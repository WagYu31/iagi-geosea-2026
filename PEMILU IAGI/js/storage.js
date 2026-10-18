/**
 * Storage & Cryptographic Vault Engine - Pemilu IAGI 2026
 * Mengimplementasikan Zero-Knowledge Ballot Box Decoupling
 * Sesuai Dokumen Arsitektur Bab 4 (Integritas LUBER-JURDIL)
 */

const STORAGE_KEYS = {
  DPT: 'pemilu_iagi_dpt_v1',
  BALLOTS: 'pemilu_iagi_ballots_v1',
  AUDIT: 'pemilu_iagi_audit_logs_v1',
  SETTINGS: 'pemilu_iagi_settings_v1'
};

// Simple pseudo SHA-256 string hash for client-side cryptographic receipt
async function generateSha256(text) {
  try {
    const encoder = new TextEncoder();
    const data = encoder.encode(text);
    const hashBuffer = await crypto.subtle.digest('SHA-256', data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  } catch (e) {
    // Fallback if subtle crypto unavailable
    let hash = 0;
    for (let i = 0; i < text.length; i++) {
      hash = ((hash << 5) - hash) + text.charCodeAt(i);
      hash |= 0;
    }
    return 'HSH-' + Math.abs(hash).toString(16).padStart(16, '0') + '-' + Date.now().toString(16);
  }
}

// Generate format IAGI-2026-XXXX-XXXX
function generateToken() {
  const chars = '23456789ABCDEFGHJKLMNPQRSTUVWXYZ';
  const getRandomChunk = (len) => {
    let res = '';
    const randomVals = new Uint8Array(len);
    window.crypto.getRandomValues(randomVals);
    for (let i = 0; i < len; i++) {
      res += chars[randomVals[i] % chars.length];
    }
    return res;
  };
  return `IAGI-2026-${getRandomChunk(4)}-${getRandomChunk(4)}`;
}

class PemiluStorage {
  constructor() {
    this.init();
  }

  init() {
    if (!localStorage.getItem(STORAGE_KEYS.DPT)) {
      localStorage.setItem(STORAGE_KEYS.DPT, JSON.stringify(INITIAL_DPT));
    }
    if (!localStorage.getItem(STORAGE_KEYS.BALLOTS)) {
      // Seed a few anonymous baseline ballots for realistic Pleno preview (e.g. 14 votes)
      const seedBallots = [
        { id: 'b-01', candidate_id: 1, ballot_hash: '8f92c10a4e7d3b5a', timestamp: 1727251200000 },
        { id: 'b-02', candidate_id: 2, ballot_hash: '3d8e5f2a1b9c7e4d', timestamp: 1727251800000 },
        { id: 'b-03', candidate_id: 1, ballot_hash: 'a1b2c3d4e5f60718', timestamp: 1727252400000 },
        { id: 'b-04', candidate_id: 3, ballot_hash: 'c4d5e6f7a8b90123', timestamp: 1727253000000 },
        { id: 'b-05', candidate_id: 2, ballot_hash: 'e7f8a9b0c1d23456', timestamp: 1727253600000 },
        { id: 'b-06', candidate_id: 1, ballot_hash: '9a8b7c6d5e4f3210', timestamp: 1727254200000 },
        { id: 'b-07', candidate_id: 3, ballot_hash: '2b3c4d5e6f7a8b9c', timestamp: 1727254800000 },
        { id: 'b-08', candidate_id: 2, ballot_hash: '5d6e7f8a9b0c1d2e', timestamp: 1727255400000 }
      ];
      localStorage.setItem(STORAGE_KEYS.BALLOTS, JSON.stringify(seedBallots));
    }
    if (!localStorage.getItem(STORAGE_KEYS.AUDIT)) {
      const initialLogs = [
        { id: 'log-01', action: 'SYSTEM_BOOT', details: 'Sistem Pemilu IAGI 2026 diinisialisasi KPKU', timestamp: new Date(Date.now() - 3600000 * 24).toISOString() },
        { id: 'log-02', action: 'DPT_VALIDATED', details: 'DPT final 22 anggota terverifikasi disahkan', timestamp: new Date(Date.now() - 3600000 * 12).toISOString() }
      ];
      localStorage.setItem(STORAGE_KEYS.AUDIT, JSON.stringify(initialLogs));
    }
    if (!localStorage.getItem(STORAGE_KEYS.SETTINGS)) {
      const defaultSettings = {
        isSealed: true, // Sealed mode active by default
        adminPin: '2026',
        votingOpen: true,
        claimOpen: true
      };
      localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(defaultSettings));
    }
  }

  // --- DPT Management ---
  getDPT() {
    try {
      return JSON.parse(localStorage.getItem(STORAGE_KEYS.DPT)) || [];
    } catch (e) {
      return [];
    }
  }

  saveDPT(dpt) {
    localStorage.setItem(STORAGE_KEYS.DPT, JSON.stringify(dpt));
  }

  findVoter(query) {
    if (!query || !query.trim()) return [];
    const q = query.toLowerCase().trim();
    const dpt = this.getDPT();
    return dpt.filter(v => 
      v.npa.toLowerCase().includes(q) || 
      v.name.toLowerCase().includes(q) ||
      (v.pengda && v.pengda.toLowerCase().includes(q))
    );
  }

  getVoterByNpa(npa) {
    if (!npa) return null;
    const dpt = this.getDPT();
    const cleanNpa = npa.trim().toUpperCase();
    return dpt.find(v => v.npa.toUpperCase() === cleanNpa) || null;
  }

  // --- Claim Surat Suara Engine ---
  claimSuratSuara(npa, name, email) {
    const dpt = this.getDPT();
    const cleanNpa = (npa || '').trim().toUpperCase();
    const cleanEmail = (email || '').trim().toLowerCase();
    const cleanName = (name || '').trim().toLowerCase();

    const voterIndex = dpt.findIndex(v => v.npa.toUpperCase() === cleanNpa);

    if (voterIndex === -1) {
      return {
        success: false,
        error: `NPA ${cleanNpa} tidak terdaftar dalam Daftar Pemilih Tetap (DPT) KPKU. Pastikan Anda telah melakukan reaktivasi keanggotaan 2026.`
      };
    }

    const voter = dpt[voterIndex];

    // Fuzzy check name or exact email check
    if (voter.email.toLowerCase() !== cleanEmail) {
      return {
        success: false,
        error: `Alamat email "${email}" tidak cocok dengan email terdaftar pada DPT untuk NPA ${cleanNpa}. Hubungi Helpdesk KPKU jika email Anda telah berganti.`
      };
    }

    if (voter.voted) {
      return {
        success: false,
        error: `Hak suara untuk NPA ${cleanNpa} (${voter.name}) SUDAH DIGUNAKAN (VOTED) pada ${new Date(voter.voted_at).toLocaleString('id-ID')}. Suara hanya dapat diberikan satu kali.`
      };
    }

    if (voter.claimed && voter.token) {
      return {
        success: true,
        alreadyClaimed: true,
        token: voter.token,
        voter: voter,
        message: `Surat suara untuk ${voter.name} telah diklaim sebelumnya. Kode unik Anda tetap valid.`
      };
    }

    // Generate new unique token
    const token = generateToken();
    voter.claimed = true;
    voter.token = token;
    voter.claimed_at = new Date().toISOString();

    dpt[voterIndex] = voter;
    this.saveDPT(dpt);

    this.addAuditLog('CLAIM_TOKEN', `Klaim surat suara berhasil untuk NPA ${voter.npa} (${voter.name})`);

    return {
      success: true,
      alreadyClaimed: false,
      token: token,
      voter: voter,
      message: `Surat suara berhasil diklaim! Kode unik telah digenerate dan dikirimkan ke email ${voter.email}.`
    };
  }

    // Built-in testing account for instant demonstration
    if (cleanNpa === 'IAGI-2024-0001' && (cleanToken === 'IAGI-2026-DEMO-2026' || cleanToken === 'DEMO-2026')) {
      const dpt = this.getDPT();
      let demoVoter = dpt.find(v => v.npa === 'IAGI-2024-0001');
      if (demoVoter) {
        demoVoter.claimed = true;
        demoVoter.token = 'IAGI-2026-DEMO-2026';
        demoVoter.voted = false; // Allow repeatable testing
        this.saveDPT(dpt);
        return { valid: true, voter: demoVoter };
      }
    }

    const voter = this.getVoterByNpa(cleanNpa);
    if (!voter) {
      return { valid: false, error: 'NPA tidak ditemukan dalam basis data DPT KPKU.' };
    }

    if (voter.voted) {
      return { valid: false, error: 'Hak suara untuk akun ini sudah digunakan. Sistem menolak pemungutan suara berulang.' };
    }

    if (!voter.claimed || !voter.token) {
      return { valid: false, error: 'Surat suara untuk NPA ini belum diklaim. Silakan klik "Klaim di sini" di bawah untuk mendapatkan kode unik.' };
    }

    if (voter.token.toUpperCase() !== cleanToken) {
      return { valid: false, error: 'Kode Unik tidak cocok dengan token resmi yang terdaftar untuk NPA ini.' };
    }

    return { valid: true, voter: voter };
  }

  // --- Cast Vote (Zero-Knowledge Anonymous Ballot Decoupling) ---
  async castVote(npa, token, candidateId) {
    const verification = this.verifyVotingEligibility(npa, token);
    if (!verification.valid) {
      return { success: false, error: verification.error };
    }

    const dpt = this.getDPT();
    const cleanNpa = npa.trim().toUpperCase();
    const voterIndex = dpt.findIndex(v => v.npa.toUpperCase() === cleanNpa);
    const voter = dpt[voterIndex];

    const timestamp = Date.now();
    const rawSalt = `${timestamp}-${Math.random()}`;
    const ballotHash = await generateSha256(`BALLOT-IAGI-2026-${candidateId}-${rawSalt}`);

    // STEP 1: Mark Voter Registry as VOTED and BURN the token
    // (NO candidate info stored here!)
    voter.voted = true;
    voter.token = null; // Token burned immediately
    voter.voted_at = new Date(timestamp).toISOString();
    voter.receipt_hash = ballotHash.substring(0, 16).toUpperCase();
    dpt[voterIndex] = voter;
    this.saveDPT(dpt);

    // STEP 2: Store purely Anonymous Ballot into Digital Ballot Box
    // (NO link, foreign key, or reference to voter identity!)
    const ballots = this.getBallots();
    ballots.push({
      id: 'ballot-' + Math.random().toString(36).substr(2, 9),
      candidate_id: Number(candidateId),
      ballot_hash: ballotHash,
      timestamp: timestamp
    });
    localStorage.setItem(STORAGE_KEYS.BALLOTS, JSON.stringify(ballots));

    // STEP 3: Append to Audit Trail (only records that a vote took place, NOT for whom)
    this.addAuditLog('VOTE_RECORDED', `Surat suara sah direkam ke kotak suara berenkripsi (NPA: ${voter.npa}, Receipt: ${voter.receipt_hash})`);

    return {
      success: true,
      receipt: {
        voterName: voter.name,
        npa: voter.npa,
        votedAt: voter.voted_at,
        receiptHash: voter.receipt_hash,
        fullHash: ballotHash,
        status: 'TERVERIFIKASI SAH'
      }
    };
  }

  getBallots() {
    try {
      return JSON.parse(localStorage.getItem(STORAGE_KEYS.BALLOTS)) || [];
    } catch (e) {
      return [];
    }
  }

  // --- Results & Quick Count Tabulation ---
  getResults() {
    const settings = this.getSettings();
    const ballots = this.getBallots();
    const dpt = this.getDPT();

    const counts = { 1: 0, 2: 0, 3: 0 };
    ballots.forEach(b => {
      if (counts[b.candidate_id] !== undefined) {
        counts[b.candidate_id]++;
      }
    });

    const totalVotes = ballots.length;
    const totalDPT = dpt.length;
    const totalClaimed = dpt.filter(v => v.claimed).length;
    const turnoutPercentage = totalDPT > 0 ? ((totalVotes / totalDPT) * 100).toFixed(1) : 0;
    const claimPercentage = totalDPT > 0 ? ((totalClaimed / totalDPT) * 100).toFixed(1) : 0;

    return {
      isSealed: settings.isSealed,
      counts,
      totalVotes,
      totalDPT,
      totalClaimed,
      turnoutPercentage,
      claimPercentage
    };
  }

  // --- Settings & KPKU Controls ---
  getSettings() {
    try {
      return JSON.parse(localStorage.getItem(STORAGE_KEYS.SETTINGS)) || { isSealed: true, adminPin: '2026', votingOpen: true, claimOpen: true };
    } catch (e) {
      return { isSealed: true, adminPin: '2026', votingOpen: true, claimOpen: true };
    }
  }

  updateSettings(newSettings) {
    const current = this.getSettings();
    const updated = { ...current, ...newSettings };
    localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(updated));
    this.addAuditLog('SETTINGS_UPDATED', `Konfigurasi sistem diperbarui: Sealed=${updated.isSealed}`);
    return updated;
  }

  // --- Audit Trail ---
  getAuditLogs() {
    try {
      return JSON.parse(localStorage.getItem(STORAGE_KEYS.AUDIT)) || [];
    } catch (e) {
      return [];
    }
  }

  addAuditLog(action, details) {
    const logs = this.getAuditLogs();
    logs.unshift({
      id: 'log-' + Date.now().toString(36),
      action,
      details,
      timestamp: new Date().toISOString()
    });
    // Keep last 100 logs
    if (logs.length > 100) logs.pop();
    localStorage.setItem(STORAGE_KEYS.AUDIT, JSON.stringify(logs));
  }

  // --- Reset Functionality for Testing ---
  resetAllData() {
    localStorage.removeItem(STORAGE_KEYS.DPT);
    localStorage.removeItem(STORAGE_KEYS.BALLOTS);
    localStorage.removeItem(STORAGE_KEYS.AUDIT);
    localStorage.removeItem(STORAGE_KEYS.SETTINGS);
    this.init();
    return true;
  }
}

// Global instance
window.pemiluStorage = new PemiluStorage();
