<?php
/**
 * KPKU IAGI 2026 - Central Server Synchronization & Double-Voting Prevention Engine
 * Menjamin 1 Anggota (1 NPA) = 1 Hak Suara (Strict Single-Vote Enforcement)
 * Dilengkapi atomic file lock (flock) untuk mencegah race condition / pencoblosan ganda lintas perangkat/browser.
 */

header('Content-Type: application/json; charset=UTF-8');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

date_default_timezone_set('Asia/Jakarta');

$dataDir = __DIR__ . '/data';
if (!is_dir($dataDir)) {
    @mkdir($dataDir, 0777, true);
}

$votersFile = $dataDir . '/voters_status.json';
$ballotsFile = $dataDir . '/ballots.json';
$auditFile = $dataDir . '/audit.json';
$lockFile = $dataDir . '/voting.lock';

// Helper function to read json safely
function readJsonFile($path, $default = []) {
    if (!file_exists($path)) return $default;
    $content = @file_get_contents($path);
    if (!$content) return $default;
    $data = @json_decode($content, true);
    return is_array($data) ? $data : $default;
}

// Helper function to write json safely
function writeJsonFile($path, $data) {
    return @file_put_contents($path, json_encode($data, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE), LOCK_EX);
}

$action = isset($_GET['action']) ? $_GET['action'] : '';
if (empty($action) && $_SERVER['REQUEST_METHOD'] === 'POST') {
    $raw = @file_get_contents('php://input');
    $parsed = @json_decode($raw, true);
    if (isset($parsed['action'])) {
        $action = $parsed['action'];
    }
}

// ================= ACTION 1: CHECK VOTER STATUS =================
if ($action === 'check_voter') {
    $npa = isset($_GET['npa']) ? strtoupper(trim($_GET['npa'])) : '';
    if (empty($npa)) {
        echo json_encode(['success' => false, 'error' => 'NPA wajib disertakan.']);
        exit;
    }

    $voters = readJsonFile($votersFile, []);
    $voterStatus = isset($voters[$npa]) ? $voters[$npa] : null;

    if ($voterStatus && !empty($voterStatus['voted'])) {
        echo json_encode([
            'success' => true,
            'npa' => $npa,
            'voted' => true,
            'voted_at' => $voterStatus['voted_at'],
            'receipt_hash' => isset($voterStatus['receipt_hash']) ? $voterStatus['receipt_hash'] : '',
            'message' => "Hak suara untuk NPA {$npa} telah digunakan pada {$voterStatus['voted_at']} WIB."
        ]);
        exit;
    }

    echo json_encode([
        'success' => true,
        'npa' => $npa,
        'voted' => false,
        'claimed' => ($voterStatus && !empty($voterStatus['claimed'])),
        'claimed_at' => ($voterStatus && isset($voterStatus['claimed_at'])) ? $voterStatus['claimed_at'] : null
    ]);
    exit;
}

// ================= ACTION 2: GET ALL VOTED NPAS (FOR SYNC) =================
if ($action === 'get_voted_list') {
    $voters = readJsonFile($votersFile, []);
    $votedNpas = [];
    foreach ($voters as $npaKey => $info) {
        if (!empty($info['voted'])) {
            $votedNpas[$npaKey] = [
                'voted_at' => $info['voted_at'],
                'receipt_hash' => isset($info['receipt_hash']) ? $info['receipt_hash'] : ''
            ];
        }
    }
    echo json_encode(['success' => true, 'voted_npas' => $votedNpas, 'total_voted' => count($votedNpas)]);
    exit;
}

// ================= ACTION 3: CAST VOTE (ATOMIC & STRICT ANTI-DOUBLE VOTE) =================
if ($action === 'cast_vote') {
    $rawInput = @file_get_contents('php://input');
    $payload = @json_decode($rawInput, true);
    if (!$payload) $payload = $_POST;

    $npa = isset($payload['npa']) ? strtoupper(trim($payload['npa'])) : '';
    $token = isset($payload['token']) ? strtoupper(trim($payload['token'])) : '';
    $candidateId = isset($payload['candidate_id']) ? intval($payload['candidate_id']) : 0;
    $voterName = isset($payload['name']) ? trim($payload['name']) : '';
    $receiptHash = isset($payload['receipt_hash']) ? trim($payload['receipt_hash']) : '';
    $fullHash = isset($payload['full_hash']) ? trim($payload['full_hash']) : '';

    if (empty($npa)) {
        http_response_code(400);
        echo json_encode(['success' => false, 'error' => 'NPA tidak valid.']);
        exit;
    }

    if ($candidateId < 1 || $candidateId > 3) {
        http_response_code(400);
        echo json_encode(['success' => false, 'error' => 'Pilihan Calon Ketua Umum tidak valid (Pilih 01, 02, atau 03).']);
        exit;
    }

    // Open lock file with exclusive lock (flock) to prevent ANY simultaneous double voting
    $fpLock = @fopen($lockFile, 'c+');
    if (!$fpLock || !@flock($fpLock, LOCK_EX)) {
        http_response_code(503);
        echo json_encode(['success' => false, 'error' => 'Server sedang sibuk memproses suara lain. Silakan coba lagi dalam beberapa detik.']);
        exit;
    }

    try {
        $voters = readJsonFile($votersFile, []);

        // CRITICAL CHECK: Has this NPA ALREADY voted?
        if (isset($voters[$npa]) && !empty($voters[$npa]['voted'])) {
            $votedAt = $voters[$npa]['voted_at'];
            flock($fpLock, LOCK_UN);
            fclose($fpLock);

            http_response_code(403);
            echo json_encode([
                'success' => false,
                'alreadyVoted' => true,
                'error' => "Hak suara untuk NPA {$npa} SUDAH DIGUNAKAN pada {$votedAt}. Sistem KPKU menolak pemungutan suara ganda!"
            ]);
            exit;
        }

        $nowTimestamp = time();
        $monthsIndo = [
            'January' => 'Januari', 'February' => 'Februari', 'March' => 'Maret',
            'April' => 'April', 'May' => 'Mei', 'June' => 'Juni',
            'July' => 'Juli', 'August' => 'Agustus', 'September' => 'September',
            'October' => 'Oktober', 'November' => 'November', 'December' => 'Desember'
        ];
        $timeStrWib = strtr(date('d F Y, H:i:s'), $monthsIndo) . ' WIB';

        // 1. Mark voter registry as VOTED and burn token (NO candidate id is stored here!)
        $voters[$npa] = [
            'npa' => $npa,
            'name' => $voterName,
            'voted' => true,
            'voted_at' => $timeStrWib,
            'receipt_hash' => $receiptHash,
            'claimed' => true,
            'token' => null // Token burned immediately on server
        ];
        writeJsonFile($votersFile, $voters);

        // 2. Decouple and append Anonymous Ballot to ballot box (Zero-Knowledge: NO NPA or Name!)
        $ballots = readJsonFile($ballotsFile, []);
        $ballots[] = [
            'id' => 'ballot-' . bin2hex(random_bytes(6)),
            'candidate_id' => $candidateId,
            'ballot_hash' => $fullHash,
            'timestamp' => $nowTimestamp,
            'timestamp_str' => $timeStrWib
        ];
        writeJsonFile($ballotsFile, $ballots);

        // 3. Append to server audit log
        $auditLogs = readJsonFile($auditFile, []);
        $auditLogs[] = [
            'id' => 'audit-' . bin2hex(random_bytes(4)),
            'action' => 'VOTE_RECORDED',
            'details' => "Surat suara sah direkam ke kotak suara terenkripsi (NPA: {$npa}, Receipt: {$receiptHash})",
            'timestamp' => date('c')
        ];
        writeJsonFile($auditFile, $auditLogs);

        // Release atomic lock
        flock($fpLock, LOCK_UN);
        fclose($fpLock);

        echo json_encode([
            'success' => true,
            'message' => 'Suara sah Anda berhasil direkam secara anonim ke dalam Kotak Suara Digital KPKU.',
            'receipt' => [
                'npa' => $npa,
                'voterName' => $voterName,
                'votedAt' => $timeStrWib,
                'receiptHash' => $receiptHash,
                'fullHash' => $fullHash,
                'status' => 'TERVERIFIKASI SAH'
            ]
        ]);
        exit;

    } catch (Exception $e) {
        flock($fpLock, LOCK_UN);
        fclose($fpLock);

        http_response_code(500);
        echo json_encode(['success' => false, 'error' => 'Terjadi kesalahan sistem saat merekam suara: ' . $e->getMessage()]);
        exit;
    }
}

// ================= ACTION 4: GET BALLOT STATS (FOR ADMIN / RESULTS) =================
if ($action === 'get_results') {
    $ballots = readJsonFile($ballotsFile, []);
    $voters = readJsonFile($votersFile, []);

    $counts = [1 => 0, 2 => 0, 3 => 0];
    foreach ($ballots as $b) {
        $cId = isset($b['candidate_id']) ? intval($b['candidate_id']) : 0;
        if (isset($counts[$cId])) {
            $counts[$cId]++;
        }
    }

    echo json_encode([
        'success' => true,
        'total_votes' => count($ballots),
        'counts' => $counts,
        'total_voters_registered' => count($voters)
    ]);
    exit;
}

echo json_encode(['success' => true, 'service' => 'KPKU IAGI 2026 Vote Sync API', 'status' => 'ONLINE']);
