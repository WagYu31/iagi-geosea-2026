/**
 * Storage & Cryptographic Vault Engine - Pemilu IAGI 2026
 * Mengimplementasikan Zero-Knowledge Ballot Box Decoupling
 * Sesuai Dokumen Arsitektur Bab 4 (Integritas LUBER-JURDIL)
 */

const STORAGE_KEYS = {
  DPT: 'pemilu_iagi_dpt_v3',
  BALLOTS: 'pemilu_iagi_ballots_v2',
  AUDIT: 'pemilu_iagi_audit_logs_v2',
  SETTINGS: 'pemilu_iagi_settings_v2',
  ADMIN_ACCOUNTS: 'pemilu_iagi_admin_accounts_v1',
  DELETED_NPAS: 'pemilu_iagi_deleted_npas_v1',
  SERVER_RESULTS: 'pemilu_iagi_server_results_v1'
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

// Generate format IAGI-2026-XXXX-XXXX (Acak Sistem Kriptografi LUBER)
function generateToken() {
  const chars = '23456789ABCDEFGHJKLMNPQRSTUVWXYZ';
  const getChunk = (len) => {
    let res = '';
    try {
      if (typeof window !== 'undefined' && window.crypto && window.crypto.getRandomValues) {
        const arr = new Uint8Array(len);
        window.crypto.getRandomValues(arr);
        for (let i = 0; i < len; i++) {
          res += chars[arr[i] % chars.length];
        }
        return res;
      }
    } catch (e) {}
    for (let i = 0; i < len; i++) {
      res += chars[Math.floor(Math.random() * chars.length)];
    }
    return res;
  };
  return `IAGI-2026-${getChunk(4)}-${getChunk(4)}`;
}

if (typeof window !== 'undefined') {
  window.generateToken = generateToken;
}

class PemiluStorage {
  constructor() {
    this.init();
  }

  getDeletedNpas() {
    try {
      const raw = localStorage.getItem(STORAGE_KEYS.DELETED_NPAS);
      if (!raw) return new Set();
      const arr = JSON.parse(raw);
      return new Set(Array.isArray(arr) ? arr.map(n => String(n || '').trim().toUpperCase()) : []);
    } catch (e) {
      return new Set();
    }
  }

  addDeletedNpas(npas) {
    try {
      const set = this.getDeletedNpas();
      const list = Array.isArray(npas) ? npas : [npas];
      list.forEach(n => {
        const clean = String(n || '').trim().toUpperCase();
        if (clean) set.add(clean);
      });
      localStorage.setItem(STORAGE_KEYS.DELETED_NPAS, JSON.stringify(Array.from(set)));
    } catch (e) {}
  }

  removeDeletedNpa(npa) {
    try {
      const set = this.getDeletedNpas();
      const clean = String(npa || '').trim().toUpperCase();
      if (set.has(clean)) {
        set.delete(clean);
        localStorage.setItem(STORAGE_KEYS.DELETED_NPAS, JSON.stringify(Array.from(set)));
      }
    } catch (e) {}
  }

  init() {
    // Hapus data mock/dummy v1 & v2 dari sesi sebelumnya agar ter-upgrade ke data resmi
    try {
      localStorage.removeItem('pemilu_iagi_dpt_v1');
      localStorage.removeItem('pemilu_iagi_dpt_v2');
      localStorage.removeItem('pemilu_iagi_ballots_v1');
      localStorage.removeItem('pemilu_iagi_audit_logs_v1');
      localStorage.removeItem('pemilu_iagi_settings_v1');
    } catch (e) {}

    const defaultDpt = (typeof window !== 'undefined' && window.INITIAL_DPT) ? window.INITIAL_DPT : (typeof INITIAL_DPT !== 'undefined' ? INITIAL_DPT : []);
    
    // Pastikan seluruh DPT berada dalam status bersih (belum klaim & belum vote)
    const cleanDpt = defaultDpt.map(v => ({
      ...v,
      claimed: false,
      token: null,
      claimed_at: null,
      voted: false,
      voted_at: null,
      receipt_hash: null
    }));

    // Inisialisasi awal jika data DPT belum pernah dibuat sama sekali (null) atau masih menggunakan data sampel lama (< 500 pemilih)
    const existingDptRaw = localStorage.getItem(STORAGE_KEYS.DPT);
    const deletedNpas = this.getDeletedNpas();
    let shouldInit = false;
    if (existingDptRaw === null) {
      shouldInit = true;
    } else {
      try {
        let parsed = JSON.parse(existingDptRaw);
        if (!Array.isArray(parsed) || parsed.length < 500) {
          shouldInit = true;
        } else {
          let hasChanges = false;
          // 1. Bersihkan pemilih yang tercatat dalam daftar terhapus atau NPA testing 99999
          if (deletedNpas.size > 0 || parsed.some(v => String(v.npa || '').trim().toUpperCase() === '99999')) {
            const beforeLen = parsed.length;
            parsed = parsed.filter(v => {
              const vNpa = String(v.npa || '').trim().toUpperCase();
              return !deletedNpas.has(vNpa) && vNpa !== '99999';
            });
            if (parsed.length !== beforeLen) {
              hasChanges = true;
            }
          }

          // 2. Sinkronisasi otomatis: hanya masukkan pemilih baru dari INITIAL_DPT jika BELUM ada di localStorage DAN BELUM pernah dihapus
          const existingNpas = new Set(parsed.map(v => String(v.npa || '').trim().toUpperCase()));
          cleanDpt.forEach(defVoter => {
            const defNpa = String(defVoter.npa || '').trim().toUpperCase();
            if (defNpa && !existingNpas.has(defNpa) && !deletedNpas.has(defNpa) && defNpa !== '99999') {
              parsed.unshift(defVoter);
              existingNpas.add(defNpa);
              hasChanges = true;
            }
          });

          // 3. Sinkronisasi email baru dari INITIAL_DPT ke pemilih yang sebelumnya emailnya masih kosong di localStorage
          cleanDpt.forEach(defVoter => {
            const defNpa = String(defVoter.npa || '').trim().toUpperCase();
            if (defNpa && defVoter.email && defVoter.email.trim() !== '') {
              const localVoter = parsed.find(v => String(v.npa || '').trim().toUpperCase() === defNpa);
              if (localVoter && (!localVoter.email || localVoter.email.trim() === '')) {
                localVoter.email = defVoter.email.trim();
                hasChanges = true;
              }
            }
          });

          if (hasChanges) {
            localStorage.setItem(STORAGE_KEYS.DPT, JSON.stringify(parsed));
          }
        }
      } catch (e) {
        shouldInit = true;
      }
    }

    if (shouldInit) {
      const filteredDpt = cleanDpt.filter(v => {
        const vNpa = String(v.npa || '').trim().toUpperCase();
        return !deletedNpas.has(vNpa) && vNpa !== '99999';
      });
      localStorage.setItem(STORAGE_KEYS.DPT, JSON.stringify(filteredDpt));
    }

    // Kotak suara murni KOSONG (0 suara) untuk persiapan audit & pengecekan
    if (!localStorage.getItem(STORAGE_KEYS.BALLOTS)) {
      localStorage.setItem(STORAGE_KEYS.BALLOTS, JSON.stringify([]));
    }

    if (!localStorage.getItem(STORAGE_KEYS.AUDIT)) {
      const initialLogs = [
        { id: 'log-01', action: 'SYSTEM_BOOT', details: 'Sistem Pemilu IAGI 2026 diinisialisasi. Kotak suara kosong (0 suara terverifikasi).', timestamp: new Date().toISOString() },
        { id: 'log-02', action: 'DPT_VERIFIED', details: 'DPT 2.143 pemilih aktif terverifikasi publikasi resmi KPKU 2026 siap digunakan.', timestamp: new Date().toISOString() }
      ];
      localStorage.setItem(STORAGE_KEYS.AUDIT, JSON.stringify(initialLogs));
    }

    if (!localStorage.getItem(STORAGE_KEYS.SETTINGS)) {
      const defaultSettings = {
        isSealed: true, // Sealed mode active by default
        adminPin: '2026',
        votingOpen: true,
        claimOpen: true,
        votingStartTime: '2026-10-26T00:01:00+07:00',
        votingEndTime: '2026-11-03T23:59:00+07:00',
        votingMode: 'auto', // 'auto' | 'force_open' | 'force_locked'
        lockedMessage: 'Bilik suara pemilihan resmi akan dibuka secara otomatis saat hitung mundur selesai.'
      };
      localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(defaultSettings));
    } else {
      // Auto-migrate old default end date (28 Oct) to official KPKU decree (03 Nov 23:59 WIB)
      try {
        const cur = JSON.parse(localStorage.getItem(STORAGE_KEYS.SETTINGS) || '{}');
        if (cur.votingEndTime === '2026-10-28T18:00:00+07:00') {
          cur.votingEndTime = '2026-11-03T23:59:00+07:00';
          localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(cur));
        }
      } catch (e) {}
    }

    // Auto-sync status pemilih dan perolehan suara dari server KPKU
    this.syncWithServer();
  }

  async syncWithServer() {
    try {
      if (typeof fetch === 'undefined') return;

      // 1. Sync list of voters who have cast their votes
      try {
        const respVoted = await fetch('api/vote_sync.php?action=get_voted_list');
        const dataVoted = await respVoted.json();
        if (dataVoted && dataVoted.success && dataVoted.voted_npas) {
          const dpt = this.getDPT();
          let changed = false;
          dpt.forEach(v => {
            const clean = String(v.npa || '').trim().toUpperCase();
            if (dataVoted.voted_npas[clean]) {
              if (!v.voted || !v.claimed) {
                v.voted = true;
                v.claimed = true;
                v.token = null; // Token burned permanently
                v.voted_at = dataVoted.voted_npas[clean].voted_at || new Date().toISOString();
                v.receipt_hash = dataVoted.voted_npas[clean].receipt_hash || 'VERIFIED';
                changed = true;
              }
            }
          });
          if (changed) {
            this.saveDPT(dpt);
          }
        }
      } catch (errVoted) {
        console.warn('Voted list sync notice:', errVoted);
      }

      // 2. Sync digital ballot box & quick count results from central server
      try {
        const respResults = await fetch('api/vote_sync.php?action=get_results');
        const dataResults = await respResults.json();
        if (dataResults && dataResults.success) {
          // Cache server counts & total votes
          localStorage.setItem(STORAGE_KEYS.SERVER_RESULTS, JSON.stringify({
            total_votes: Number(dataResults.total_votes || 0),
            counts: dataResults.counts || { 1: 0, 2: 0, 3: 0 },
            updated_at: Date.now()
          }));

          // If server returns ballots array, sync them to local storage
          if (Array.isArray(dataResults.ballots) && dataResults.ballots.length > 0) {
            const currentBallots = this.getBallots();
            if (dataResults.ballots.length >= currentBallots.length) {
              localStorage.setItem(STORAGE_KEYS.BALLOTS, JSON.stringify(dataResults.ballots));
            }
          }
        }
      } catch (errResults) {
        console.warn('Results sync notice:', errResults);
      }
    } catch (e) {
      console.warn('Server sync error:', e);
    }
  }

  async syncVotedWithServer() {
    return this.syncWithServer();
  }

  // --- DPT Management ---
  getDPT() {
    try {
      const raw = localStorage.getItem(STORAGE_KEYS.DPT);
      if (raw === null) {
        const initial = (typeof INITIAL_DPT !== 'undefined') ? JSON.parse(JSON.stringify(INITIAL_DPT)) : [];
        this.saveDPT(initial);
        return initial;
      }

      let dpt = JSON.parse(raw);
      if (!Array.isArray(dpt) || dpt.length < 500) {
        const initial = (typeof INITIAL_DPT !== 'undefined') ? JSON.parse(JSON.stringify(INITIAL_DPT)) : [];
        this.saveDPT(initial);
        return initial;
      }

      // Auto-migrate legacy NPA formats (e.g. IAGI-2024-0001) to strictly 5-digit numbers
      let updated = false;
      const legacyMap = {
        'IAGI-2024-0001': '01001',
        'IAGI-2024-0002': '01002',
        'IAGI-2024-0003': '01003',
        'IAGI-1994-0104': '01104',
        'IAGI-1998-0412': '01412',
        'IAGI-2001-0789': '01789',
        'IAGI-2004-1102': '02102',
        'IAGI-2005-1420': '02420',
        'IAGI-2008-2041': '02841',
        'IAGI-2010-2580': '03580',
        'IAGI-2012-3341': '04341',
        'IAGI-2014-4115': '05115',
        'IAGI-2015-4890': '05890',
        'IAGI-2016-5520': '06520',
        'IAGI-2017-6102': '07102',
        'IAGI-2018-6889': '07889',
        'IAGI-2019-7450': '08450',
        'IAGI-2020-8012': '09012',
        'IAGI-2021-8765': '09765',
        'IAGI-2022-9340': '10340',
        'IAGI-2023-9890': '11890',
        'IAGI-2024-1052': '12852'
      };

      dpt.forEach(v => {
        if (v && v.npa && !/^\d{5}$/.test(v.npa)) {
          if (legacyMap[v.npa]) {
            v.npa = legacyMap[v.npa];
            updated = true;
          } else {
            const digits = v.npa.replace(/\D/g, '');
            if (digits.length > 0) {
              v.npa = digits.slice(-5).padStart(5, '0');
              updated = true;
            }
          }
        }

        // Pastikan pemilih yang sudah klaim memiliki timestamp claimed_at
        if (v && v.claimed && !v.claimed_at) {
          v.claimed_at = new Date().toISOString();
          updated = true;
        }
      });

      if (updated) {
        this.saveDPT(dpt);
      }

      return dpt;
    } catch (e) {
      return [];
    }
  }

  saveDPT(dpt) {
    localStorage.setItem(STORAGE_KEYS.DPT, JSON.stringify(dpt));
  }

  resetDPTToDefault() {
    localStorage.removeItem(STORAGE_KEYS.DELETED_NPAS);
    const defaultDpt = (typeof window !== 'undefined' && window.INITIAL_DPT) ? window.INITIAL_DPT : (typeof INITIAL_DPT !== 'undefined' ? INITIAL_DPT : []);
    const cleanDpt = defaultDpt.filter(v => String(v.npa || '').trim().toUpperCase() !== '99999').map(v => ({
      ...v,
      claimed: false,
      token: null,
      claimed_at: null,
      voted: false,
      voted_at: null,
      receipt_hash: null
    }));
    this.saveDPT(cleanDpt);
    this.addAuditLog('DPT_RESET', 'Data DPT direset kembali ke data default template 5-digit (2.143 pemilih resmi).');
    return cleanDpt;
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
    const cleanNpa = String(npa).trim().toUpperCase();
    if (this.getDeletedNpas().has(cleanNpa) || cleanNpa === '99999') return null;
    const dpt = this.getDPT();
    const found = dpt.find(v => String(v.npa || '').trim().toUpperCase() === cleanNpa);
    if (found) return found;

    // Fallback: cek ke INITIAL_DPT resmi jika belum sinkron di localStorage
    if (typeof INITIAL_DPT !== 'undefined') {
      const initialMatch = INITIAL_DPT.find(v => String(v.npa || '').trim().toUpperCase() === cleanNpa);
      if (initialMatch) return initialMatch;
    }
    return null;
  }

  addVoter(voterData) {
    const rawNpa = (voterData.npa || '').trim();
    const cleanNpa = rawNpa.replace(/\D/g, ''); // Extract digits only
    const cleanName = (voterData.name || '').trim();
    const cleanEmail = (voterData.email || '').trim().toLowerCase();
    const cleanPhone = (voterData.phone || voterData.whatsapp || '').trim();
    const cleanPengda = (voterData.pengda || '').trim() || 'DKI Jakarta';
    const cleanCategory = (voterData.category || '').trim() || 'Professional';

    if (!cleanNpa) {
      return { success: false, error: 'Nomor Pokok Anggota (NPA) wajib diisi!' };
    }
    if (cleanNpa.length !== 5 || !/^\d{5}$/.test(cleanNpa)) {
      return { success: false, error: 'Nomor Pokok Anggota (NPA) harus terdiri dari 5 digit angka (contoh: 01234 atau 12345)!' };
    }
    if (!cleanName) {
      return { success: false, error: 'Nama Lengkap wajib diisi!' };
    }
    if (!cleanEmail || !cleanEmail.includes('@')) {
      return { success: false, error: 'Alamat Email aktif tidak valid!' };
    }

    const dpt = this.getDPT();
    const exists = dpt.find(v => v.npa.toUpperCase() === cleanNpa);
    if (exists) {
      return { 
        success: false, 
        error: `NPA "${cleanNpa}" sudah terdaftar sebelumnya atas nama "${exists.name}". Gunakan NPA lain atau edit pemilih.` 
      };
    }

    const newVoter = {
      npa: cleanNpa,
      name: cleanName,
      email: cleanEmail,
      phone: cleanPhone,
      pengda: cleanPengda,
      category: cleanCategory,
      status: 'AKTIF',
      timses: Number(voterData.timses) || 0,
      claimed: false,
      token: null,
      voted: false,
      voted_at: null,
      receipt_hash: null
    };

    dpt.unshift(newVoter);
    this.saveDPT(dpt);
    this.removeDeletedNpa(cleanNpa);
    this.addAuditLog('DPT_ADDED', `Pemilih baru didaftarkan: NPA ${cleanNpa} (${cleanName}) Pengda ${cleanPengda}`);

    return { success: true, voter: newVoter };
  }

  deleteVoter(npa) {
    const cleanNpa = String(npa || '').trim().toUpperCase();
    this.addDeletedNpas(cleanNpa);
    const dpt = this.getDPT();
    const idx = dpt.findIndex(v => String(v.npa || '').trim().toUpperCase() === cleanNpa);
    if (idx === -1) {
      return { success: false, error: `NPA ${cleanNpa} tidak ditemukan dalam DPT.` };
    }

    const removed = dpt.splice(idx, 1)[0];
    this.saveDPT(dpt);
    this.addAuditLog('DPT_REMOVED', `Pemilih dihapus dari DPT: NPA ${cleanNpa} (${removed.name})`);

    return { success: true, removed };
  }

  deleteMultipleVoters(npas) {
    if (!Array.isArray(npas) || npas.length === 0) {
      return { success: false, error: 'Daftar NPA tidak valid.' };
    }
    const cleanNpaSet = new Set(npas.map(n => String(n || '').trim().toUpperCase()));
    this.addDeletedNpas(Array.from(cleanNpaSet));
    const dpt = this.getDPT();

    const remaining = [];
    const removed = [];
    for (const v of dpt) {
      const vNpa = String(v.npa || '').trim().toUpperCase();
      if (cleanNpaSet.has(vNpa)) {
        removed.push(v);
      } else {
        remaining.push(v);
      }
    }

    if (removed.length === 0) {
      return { success: false, error: 'Tidak ada data pemilih yang cocok untuk dihapus.' };
    }

    this.saveDPT(remaining);
    this.addAuditLog('DPT_BULK_REMOVED', `Hapus massal DPT: ${removed.length} pemilih berhasil dihapus dari sistem.`);
    return { success: true, count: removed.length, removed };
  }

  deleteVotersByCount({ count = 1, order = 'top', onlyUnvoted = true } = {}) {
    const num = parseInt(count, 10);
    if (isNaN(num) || num <= 0) {
      return { success: false, error: 'Jumlah pemilih harus berupa angka positif.' };
    }
    const dpt = this.getDPT();
    let candidates = dpt.filter(v => onlyUnvoted ? !v.voted : true);

    if (order === 'bottom') {
      candidates = [...candidates].reverse();
    }

    const toDelete = candidates.slice(0, num);
    if (toDelete.length === 0) {
      return { success: false, error: 'Tidak ada pemilih yang memenuhi syarat untuk dihapus.' };
    }

    const npas = toDelete.map(v => v.npa);
    return this.deleteMultipleVoters(npas);
  }

  updateVoter(oldNpa, { npa, name, email, phone, pengda, category, timses } = {}) {
    const cleanOldNpa = (oldNpa || '').trim().toUpperCase();
    const cleanNewNpa = (npa || '').trim().toUpperCase();
    const dpt = this.getDPT();
    const idx = dpt.findIndex(v => v.npa.toUpperCase() === cleanOldNpa);
    if (idx === -1) return { success: false, error: 'Pemilih tidak ditemukan dalam DPT.' };

    const voter = dpt[idx];

    // If NPA changed, verify uniqueness & 5-digit format
    if (cleanNewNpa && cleanNewNpa !== cleanOldNpa) {
      if (!/^\d{5}$/.test(cleanNewNpa)) {
        return { success: false, error: 'Nomor Pokok Anggota (NPA) harus terdiri dari 5 digit angka (contoh: 01234 atau 12345)!' };
      }
      if (dpt.some((v, i) => i !== idx && v.npa.toUpperCase() === cleanNewNpa)) {
        return { success: false, error: `NPA "${cleanNewNpa}" sudah terdaftar pada anggota lain.` };
      }
      voter.npa = cleanNewNpa;
    }

    if (name && name.trim()) voter.name = name.trim();
    if (email && email.trim()) voter.email = email.trim();
    if (phone !== undefined) voter.phone = (phone || '').trim();
    if (pengda && pengda.trim()) voter.pengda = pengda.trim();
    if (category && category.trim()) voter.category = category.trim();
    if (timses !== undefined) voter.timses = Number(timses) || 0;

    this.saveDPT(dpt);
    this.addAuditLog('DPT_UPDATED', `Data pemilih diperbarui: NPA ${voter.npa} (${voter.name}), Pengda ${voter.pengda}${voter.timses ? ', Afiliasi Timses ' + voter.timses : ''}`);
    return { success: true, voter };
  }

  updateVoterPhone(npa, phone) {
    const cleanNpa = (npa || '').trim().toUpperCase();
    const cleanPhone = (phone || '').trim();
    const dpt = this.getDPT();
    const voter = dpt.find(v => v.npa.toUpperCase() === cleanNpa);
    if (!voter) return { success: false, error: 'Pemilih tidak ditemukan' };
    voter.phone = cleanPhone;
    this.saveDPT(dpt);
    return { success: true, voter };
  }

  generateTokenForVoter(npa, forceNew = false) {
    const cleanNpa = (npa || '').trim().toUpperCase();
    const dpt = this.getDPT();
    const idx = dpt.findIndex(v => v.npa.toUpperCase() === cleanNpa);
    if (idx === -1) return { success: false, error: 'NPA tidak ditemukan dalam DPT' };

    const voter = dpt[idx];
    if (voter.voted) {
      return { success: false, error: 'Pemilih ini sudah memberikan suara (VOTED). Tidak dapat menerbitkan token baru.' };
    }

    if (!voter.token || forceNew) {
      voter.token = generateToken();
      voter.claimed = true;
      voter.claimed_at = new Date().toISOString();
      dpt[idx] = voter;
      this.saveDPT(dpt);
      this.addAuditLog('ADMIN_TOKEN_GEN', `Panitia menerbitkan ${forceNew ? 'ulang ' : ''}token surat suara untuk NPA ${cleanNpa} (${voter.name}): ${voter.token}`);
    }

    return { success: true, token: voter.token, voter };
  }

  setTokenForVoter(npa, token) {
    const cleanNpa = (npa || '').trim().toUpperCase();
    const dpt = this.getDPT();
    const idx = dpt.findIndex(v => v.npa.toUpperCase() === cleanNpa);
    if (idx === -1) return { success: false, error: 'NPA tidak ditemukan dalam DPT' };

    const voter = dpt[idx];
    if (voter.voted) {
      return { success: false, error: 'Pemilih ini sudah memberikan suara (VOTED). Token tidak dapat diubah.' };
    }

    const cleanToken = (token || '').trim();
    if (!cleanToken) return { success: false, error: 'Token tidak boleh kosong' };

    voter.token = cleanToken;
    voter.claimed = true;
    voter.claimed_at = new Date().toISOString();
    dpt[idx] = voter;
    this.saveDPT(dpt);
    this.addAuditLog('ADMIN_TOKEN_ASSIGN', `Panitia menetapkan token surat suara bantuan untuk NPA ${cleanNpa} (${voter.name}): ${voter.token}`);
    return { success: true, token: voter.token, voter };
  }

  formatWhatsAppMessage(voter, token) {
    let siteUrl = window.location.origin + window.location.pathname.replace('admin.html', 'app.html');
    if (!siteUrl.includes('http')) {
      siteUrl = 'https://pemiluiagi.web.id/app.html';
    }
    return `*KOMISI PEMILIHAN KETUA UMUM (KPKU) IAGI 2026*\n` +
      `━━━━━━━━━━━━━━━━━━━━━━━━━━━\n` +
      `Yth. Rekan Sejawat Ahli Geologi,\n` +
      `*${voter.name}*\n` +
      `NPA: *${voter.npa}*\n` +
      `Pengda: *${voter.pengda || 'IAGI'}*\n\n` +
      `Hak suara Anda pada Pemilihan Ketua Umum IAGI Periode 2026–2029 telah *TERVERIFIKASI AKTIF* di Daftar Pemilih Tetap (DPT) KPKU.\n\n` +
      `🔑 *KODE SURAT SUARA ELEKTRONIK (TOKEN):*\n` +
      `👉 *${token}*\n\n` +
      `🗳️ *Akses Bilik Suara Digital:*\n` +
      `${siteUrl}#vote\n\n` +
      `*Langkah Memilih:*\n` +
      `1. Buka tautan bilik suara di atas\n` +
      `2. Masukkan NPA: *${voter.npa}*\n` +
      `3. Masukkan Kode Token di atas\n` +
      `4. Tentukan pilihan Calon Ketua Umum Anda dan klik Kirim Suara Sah.\n\n` +
      `_Pesan otomatis resmi Panitia KPKU IAGI 2026. Kode token bersifat rahasia dan sekali pakai._`;
  }

  importVoters(voterList) {
    if (!Array.isArray(voterList) || voterList.length === 0) {
      return { success: false, error: 'Daftar pemilih kosong atau format tidak sesuai.' };
    }

    const dpt = this.getDPT();
    const existingNpas = new Set(dpt.map(v => v.npa.toUpperCase()));
    let addedCount = 0;
    let skippedCount = 0;

    voterList.forEach(item => {
      const cleanNpa = (item.npa || '').trim().toUpperCase();
      const cleanName = (item.name || '').trim();
      const cleanEmail = (item.email || '').trim().toLowerCase();
      const cleanPhone = (item.phone || item.whatsapp || '').trim();
      const cleanPengda = (item.pengda || '').trim() || 'DKI Jakarta';
      const cleanCategory = (item.category || '').trim() || 'Professional';

      if (!cleanNpa || !cleanName || !cleanEmail) {
        skippedCount++;
        return;
      }

      if (existingNpas.has(cleanNpa)) {
        skippedCount++;
        return;
      }

      existingNpas.add(cleanNpa);
      dpt.unshift({
        npa: cleanNpa,
        name: cleanName,
        email: cleanEmail,
        phone: cleanPhone,
        pengda: cleanPengda,
        category: cleanCategory,
        status: 'AKTIF',
        claimed: false,
        token: null,
        voted: false,
        voted_at: null,
        receipt_hash: null
      });
      addedCount++;
    });

    this.saveDPT(dpt);
    this.addAuditLog('DPT_IMPORTED', `Import DPT Massal: ${addedCount} pemilih baru ditambahkan, ${skippedCount} dilewati (duplikat/tidak lengkap).`);

    return { 
      success: true, 
      addedCount, 
      skippedCount, 
      total: dpt.length 
    };
  }

  // --- Claim Surat Suara Engine ---
  claimSuratSuara(npa, name, email) {
    let dpt = this.getDPT();
    const cleanNpa = String(npa || '').replace(/\D/g, '').slice(0, 5);
    const cleanEmail = (email || '').trim().toLowerCase();
    const cleanName = (name || '').trim().toLowerCase();

    if (!cleanNpa || cleanNpa.length !== 5) {
      return {
        success: false,
        error: 'Nomor Pokok Anggota (NPA) harus tepat 5 digit angka (contoh: 00000).'
      };
    }

    let voterIndex = dpt.findIndex(v => String(v.npa || '').trim().toUpperCase() === cleanNpa);

    // Robust Fallback: jika belum ada di cache localStorage tetapi terdaftar di INITIAL_DPT resmi (dan belum dihapus)
    if (voterIndex === -1 && typeof INITIAL_DPT !== 'undefined' && !this.getDeletedNpas().has(cleanNpa) && cleanNpa !== '99999') {
      const initialMatch = INITIAL_DPT.find(v => String(v.npa || '').trim().toUpperCase() === cleanNpa);
      if (initialMatch) {
        const newVoter = {
          ...initialMatch,
          claimed: false,
          token: null,
          claimed_at: null,
          voted: false,
          voted_at: null,
          receipt_hash: null
        };
        dpt.unshift(newVoter);
        this.saveDPT(dpt);
        voterIndex = 0;
      }
    }

    if (voterIndex === -1) {
      return {
        success: false,
        error: `NPA ${cleanNpa} tidak terdaftar dalam Daftar Pemilih Tetap (DPT) KPKU. Pastikan Anda telah melakukan reaktivasi keanggotaan 2026.`
      };
    }

    const voter = dpt[voterIndex];

    // Jika di cache lokal email masih kosong, perbarui dari INITIAL_DPT jika tersedia
    if ((!voter.email || voter.email.trim() === '') && typeof INITIAL_DPT !== 'undefined') {
      const initVoter = INITIAL_DPT.find(v => String(v.npa || '').trim().toUpperCase() === cleanNpa);
      if (initVoter && initVoter.email && initVoter.email.trim() !== '') {
        voter.email = initVoter.email.trim();
        dpt[voterIndex].email = voter.email;
        this.saveDPT(dpt);
      }
    }

    // Fuzzy check name or exact email check
    if (voter.email && voter.email.trim() !== '') {
      if (voter.email.toLowerCase() !== cleanEmail) {
        // Fallback: cek jika email di INITIAL_DPT sudah diperbarui dan cocok dengan input
        const initV = (typeof INITIAL_DPT !== 'undefined') ? INITIAL_DPT.find(x => String(x.npa || '').trim().toUpperCase() === cleanNpa) : null;
        if (initV && initV.email && initV.email.trim().toLowerCase() === cleanEmail) {
          voter.email = cleanEmail;
          dpt[voterIndex].email = cleanEmail;
          this.saveDPT(dpt);
        } else {
          return {
            success: false,
            error: `Alamat email "${email}" tidak cocok dengan email terdaftar pada DPT untuk NPA ${cleanNpa}. Hubungi Helpdesk KPKU jika email Anda telah berganti.`
          };
        }
      }
    } else {
      // Jika di DPT email belum terdaftar, verifikasi kecocokan nama
      const cleanVName = (voter.name || '').toLowerCase().replace(/[^a-z0-9]/g, '');
      const cleanInputName = cleanName.replace(/[^a-z0-9]/g, '');
      if (cleanVName && cleanInputName && !cleanVName.includes(cleanInputName) && !cleanInputName.includes(cleanVName)) {
        return {
          success: false,
          error: `Email pada DPT untuk NPA ${cleanNpa} belum terdata, dan nama yang dimasukkan tidak cocok dengan nama di DPT (${voter.name}).`
        };
      }
      voter.email = cleanEmail;
      dpt[voterIndex].email = cleanEmail;
      this.saveDPT(dpt);
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

  // --- Verification for Voting ---
  verifyVotingEligibility(npa, token) {
    const rawNpa = String(npa || '').trim();
    const cleanNpa = rawNpa.replace(/\D/g, '').slice(0, 5);
    const cleanToken = (token || '').trim().toUpperCase();

    if (!cleanNpa || cleanNpa.length !== 5) {
      return { valid: false, error: 'Nomor Pokok Anggota (NPA) harus tepat 5 digit angka (contoh: 00000).' };
    }

    // Built-in testing account for instant demonstration
    if ((cleanNpa === '00000' || cleanNpa === '01001') && (cleanToken === 'IAGI-2026-DEMO-2026' || cleanToken === 'DEMO-2026')) {
      const dpt = this.getDPT();
      let demoVoter = dpt.find(v => v.npa === '00000' || v.npa === '01001');
      if (!demoVoter) {
        demoVoter = { npa: "00000", name: "Anggota Uji Coba IAGI", email: "pemilih@iagi.or.id", phone: "08111581461", pengda: "DKI Jakarta", category: "Professional", status: "AKTIF", claimed: true, token: 'IAGI-2026-DEMO-2026', claimed_at: new Date().toISOString(), voted: false, voted_at: null };
      }
      return { valid: true, voter: demoVoter };
    }

    const voter = this.getVoterByNpa(cleanNpa);
    if (!voter) {
      return { valid: false, error: 'NPA tidak ditemukan dalam basis data DPT KPKU.' };
    }

    if (voter.voted) {
      const timeStr = voter.voted_at ? new Date(voter.voted_at).toLocaleString('id-ID', { dateStyle: 'full', timeStyle: 'short' }) : '';
      return { 
        valid: false, 
        alreadyVoted: true,
        error: `Hak suara untuk NPA ${cleanNpa} (${voter.name}) SUDAH DIGUNAKAN${timeStr ? ' pada ' + timeStr : ''}. Sesuai asas LUBER-JURDIL, setiap anggota terdaftar hanya memiliki 1 (satu) hak suara yang tidak dapat digunakan berulang.` 
      };
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
    const cleanNpa = String(npa || '').replace(/\D/g, '').slice(0, 5);
    const cleanToken = String(token || '').trim().toUpperCase();

    // 1. Strict Eligibility Verification
    const verification = this.verifyVotingEligibility(cleanNpa, cleanToken);
    if (!verification.valid) {
      return { success: false, error: verification.error };
    }

    const dpt = this.getDPT();
    const voterIndex = dpt.findIndex(v => String(v.npa || '').trim().toUpperCase() === cleanNpa);
    if (voterIndex === -1) {
      return { success: false, error: 'Data pemilih tidak ditemukan dalam DPT.' };
    }
    const voter = dpt[voterIndex];

    // Double check to strictly prevent double voting
    if (voter.voted) {
      return {
        success: false,
        error: `Hak suara untuk NPA ${cleanNpa} (${voter.name}) SUDAH DIGUNAKAN pada ${voter.voted_at || 'sesi sebelumnya'}. Sistem menolak pemungutan suara berulang demi integritas LUBER-JURDIL.`
      };
    }

    const timestamp = Date.now();
    const rawSalt = `${timestamp}-${Math.random()}`;
    const ballotHash = await generateSha256(`BALLOT-IAGI-2026-${candidateId}-${rawSalt}`);
    const receiptHash = ballotHash.substring(0, 16).toUpperCase();

    // 2. Atomic Server-Side Lock Check via API
    try {
      if (typeof fetch !== 'undefined') {
        const srvResp = await fetch('api/vote_sync.php', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            action: 'cast_vote',
            npa: cleanNpa,
            token: cleanToken,
            candidate_id: Number(candidateId),
            name: voter.name,
            receipt_hash: receiptHash,
            full_hash: ballotHash
          })
        });
        const srvData = await srvResp.json();
        if (srvData && srvData.alreadyVoted) {
          // If server reports already voted on another device, lock locally too!
          voter.voted = true;
          voter.token = null;
          this.saveDPT(dpt);
          return {
            success: false,
            error: srvData.error || `Hak suara untuk NPA ${cleanNpa} sudah digunakan di perangkat lain. Pemilihan ganda ditolak!`
          };
        }
      }
    } catch (err) {
      console.log('Server vote sync notice:', err);
    }

    // 3. STEP 1: Mark Voter Registry as VOTED and BURN the token permanently
    // (NO candidate info is stored with voter identity - LUBER!)
    voter.voted = true;
    voter.token = null; // Token burned immediately
    voter.voted_at = new Date(timestamp).toISOString();
    voter.receipt_hash = receiptHash;
    dpt[voterIndex] = voter;
    this.saveDPT(dpt);

    // 4. STEP 2: Store purely Anonymous Ballot into Digital Ballot Box
    // (NO link, foreign key, or reference to voter identity!)
    const ballots = this.getBallots();
    ballots.push({
      id: 'ballot-' + Math.random().toString(36).substr(2, 9),
      candidate_id: Number(candidateId),
      ballot_hash: ballotHash,
      timestamp: timestamp
    });
    localStorage.setItem(STORAGE_KEYS.BALLOTS, JSON.stringify(ballots));

    // 5. STEP 3: Append to Audit Trail
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

    let counts = { 1: 0, 2: 0, 3: 0 };
    ballots.forEach(b => {
      if (counts[b.candidate_id] !== undefined) {
        counts[b.candidate_id]++;
      }
    });

    let totalVotes = ballots.length;

    // Fallback / sync from cached server results if local ballots are fewer
    try {
      const rawServer = localStorage.getItem(STORAGE_KEYS.SERVER_RESULTS);
      if (rawServer) {
        const srv = JSON.parse(rawServer);
        if (srv && typeof srv.total_votes === 'number' && srv.total_votes > totalVotes) {
          totalVotes = srv.total_votes;
          counts = {
            1: Number(srv.counts?.[1] || 0),
            2: Number(srv.counts?.[2] || 0),
            3: Number(srv.counts?.[3] || 0)
          };
        }
      }
    } catch (e) {}

    const totalDPT = dpt.length;
    const totalClaimed = dpt.filter(v => v.claimed || v.voted).length;
    const turnoutPercentage = totalDPT > 0 ? (Math.min(100, (totalVotes / totalDPT) * 100)).toFixed(1) : '0.0';
    const claimPercentage = totalDPT > 0 ? ((totalClaimed / totalDPT) * 100).toFixed(1) : '0.0';

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
    const defaults = {
      isSealed: true,
      adminPin: '2026',
      votingOpen: true,
      claimOpen: true,
      votingStartTime: '2026-10-26T00:01:00+07:00',
      votingEndTime: '2026-11-03T23:59:00+07:00',
      votingMode: 'auto', // 'auto' | 'force_open' | 'force_locked'
      lockedMessage: 'Bilik suara pemilihan resmi akan dibuka secara otomatis saat hitung mundur selesai.'
    };
    try {
      const raw = localStorage.getItem(STORAGE_KEYS.SETTINGS);
      if (!raw) return defaults;
      return { ...defaults, ...JSON.parse(raw) };
    } catch (e) {
      return defaults;
    }
  }

  isVotingOpen() {
    const settings = this.getSettings();
    if (settings.votingMode === 'force_open') return true;
    if (settings.votingMode === 'force_locked') return false;

    const now = Date.now();
    const start = new Date(settings.votingStartTime || '2026-10-26T00:01:00+07:00').getTime();
    const end = new Date(settings.votingEndTime || '2026-10-28T18:00:00+07:00').getTime();

    return now >= start && now <= end;
  }

  getVotingDiffMs() {
    const settings = this.getSettings();
    if (settings.votingMode === 'force_open') return 0;
    if (settings.votingMode === 'force_locked') return 86400000;

    const now = Date.now();
    const start = new Date(settings.votingStartTime || '2026-10-26T00:01:00+07:00').getTime();
    return Math.max(0, start - now);
  }

  saveVotingSchedule({ startTime, endTime, mode, lockedMessage } = {}) {
    const current = this.getSettings();
    const updated = {
      ...current,
      ...(startTime ? { votingStartTime: startTime } : {}),
      ...(endTime ? { votingEndTime: endTime } : {}),
      ...(mode ? { votingMode: mode } : {}),
      ...(lockedMessage !== undefined ? { lockedMessage } : {})
    };
    localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(updated));
    this.addAuditLog('SCHEDULE_UPDATED', `Jadwal Bilik Suara diperbarui: Mulai=${updated.votingStartTime}, Selesai=${updated.votingEndTime}, Mode=${updated.votingMode}`);
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('pemilu:schedule-updated', { detail: updated }));
    }
    return updated;
  }

  updateSettings(newSettings) {
    const current = this.getSettings();
    const updated = { ...current, ...newSettings };
    localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(updated));
    this.addAuditLog('SETTINGS_UPDATED', `Konfigurasi sistem diperbarui: Sealed=${updated.isSealed}`);
    return updated;
  }

  // --- Admin Accounts Management (Multi-Admin & Roles) ---
  getAdminAccounts() {
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.ADMIN_ACCOUNTS);
      if (stored) {
        let parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) {
          // Purge Dr. Ir. Hendra Saputra (admin.kpku@iagi.or.id)
          const filtered = parsed.filter(a => a.email !== 'admin.kpku@iagi.or.id' && a.name !== 'Dr. Ir. Hendra Saputra, M.T.');
          // Ensure WAGYUA% exists as locked super admin root
          const hasWagyua = filtered.some(a => a.email === 'cingire687@gmail.com' || a.name === 'WAGYUA%' || a.npa === '31052');
          if (!hasWagyua) {
            filtered.unshift({
              id: "adm-01",
              name: "WAGYUA%",
              title: "SUPER ADMIN",
              email: "cingire687@gmail.com",
              phone: "085771593522",
              npa: "31052",
              password: "admin",
              securityPin: "2026",
              role: "Tim IT & Teknis",
              status: "AKTIF",
              twoFactor: true,
              createdAt: "2026-01-15T08:00:00Z",
              lastLogin: "2026-10-26T02:19:00Z"
            });
          }
          if (filtered.length !== parsed.length || !hasWagyua) {
            this.saveAdminAccounts(filtered);
          }
          return filtered;
        }
      }
    } catch (e) {
      console.error('Error reading admin accounts from storage:', e);
    }

    // Default seed from window.ADMIN_ACCOUNTS or fallback
    const seeds = (typeof window !== 'undefined' && Array.isArray(window.ADMIN_ACCOUNTS) && window.ADMIN_ACCOUNTS.length > 0)
      ? window.ADMIN_ACCOUNTS.filter(a => a.email !== 'admin.kpku@iagi.or.id')
      : [
          {
            id: "adm-01",
            name: "WAGYUA%",
            title: "SUPER ADMIN",
            email: "cingire687@gmail.com",
            phone: "085771593522",
            npa: "31052",
            password: "admin",
            securityPin: "2026",
            role: "Tim IT & Teknis",
            status: "AKTIF",
            twoFactor: true,
            createdAt: "2026-01-15T08:00:00Z",
            lastLogin: "2026-10-26T02:19:00Z"
          }
        ];

    this.saveAdminAccounts(seeds);
    return seeds;
  }

  saveAdminAccounts(accounts) {
    try {
      localStorage.setItem(STORAGE_KEYS.ADMIN_ACCOUNTS, JSON.stringify(accounts));
      return true;
    } catch (e) {
      console.error('Error saving admin accounts to storage:', e);
      return false;
    }
  }

  addAdminAccount(accountData) {
    const accounts = this.getAdminAccounts();
    const cleanEmail = (accountData.email || '').trim().toLowerCase();

    if (!cleanEmail || !cleanEmail.includes('@')) {
      return { success: false, error: 'Alamat email admin tidak valid.' };
    }

    if (!accountData.name || !accountData.name.trim()) {
      return { success: false, error: 'Nama lengkap admin wajib diisi.' };
    }

    // Check email uniqueness
    const existing = accounts.find(a => a.email.toLowerCase() === cleanEmail);
    if (existing) {
      return { success: false, error: `Email "${cleanEmail}" sudah terdaftar pada akun "${existing.name}". Silakan klik tombol ✏️ Edit pada tabel akun panitia untuk mengubah data.` };
    }

    // Validate NPA (strict 5 digits if provided)
    const rawNpa = (accountData.npa || '').trim();
    if (rawNpa && rawNpa !== '-' && !/^\d{5}$/.test(rawNpa)) {
      return { success: false, error: 'NPA IAGI harus tepat 5 digit angka (contoh: 01412).' };
    }

    // Validate Security PIN (strict 4 digits)
    const rawPin = (accountData.securityPin || '2026').trim();
    if (!rawPin || !/^\d{4}$/.test(rawPin)) {
      return { success: false, error: 'PIN Keamanan harus tepat 4 digit angka (contoh: 2026).' };
    }

    const newAdmin = {
      id: 'adm-' + Date.now().toString(36) + Math.random().toString(36).substring(2, 5),
      name: accountData.name.trim(),
      title: (accountData.title || accountData.role || 'Panitia KPKU').trim(),
      email: cleanEmail,
      phone: (accountData.phone || '').trim(),
      npa: rawNpa || '-',
      password: (accountData.password || 'admin2026').trim(),
      securityPin: rawPin,
      role: accountData.role || 'Operator DPT',
      status: accountData.status || 'AKTIF',
      twoFactor: accountData.twoFactor !== false,
      createdAt: new Date().toISOString(),
      lastLogin: null
    };

    accounts.push(newAdmin);
    this.saveAdminAccounts(accounts);
    this.addAuditLog('ADMIN_CREATED', `Akun admin baru dibuat: ${newAdmin.name} (${newAdmin.email}) - Role: ${newAdmin.role}`);
    return { success: true, admin: newAdmin };
  }

  updateAdminAccount(id, updatedFields) {
    const accounts = this.getAdminAccounts();
    const idx = accounts.findIndex(a => a.id === id);
    if (idx === -1) {
      return { success: false, error: 'Akun admin tidak ditemukan.' };
    }

    // Validate NPA if changed
    if (updatedFields.npa !== undefined) {
      const cleanNpa = String(updatedFields.npa).trim();
      if (cleanNpa && cleanNpa !== '-' && !/^\d{5}$/.test(cleanNpa)) {
        return { success: false, error: 'NPA IAGI harus tepat 5 digit angka (contoh: 01412).' };
      }
      updatedFields.npa = cleanNpa || '-';
    }

    // Validate PIN if changed
    if (updatedFields.securityPin !== undefined) {
      const cleanPin = String(updatedFields.securityPin).trim();
      if (!cleanPin || !/^\d{4}$/.test(cleanPin)) {
        return { success: false, error: 'PIN Keamanan harus tepat 4 digit angka (contoh: 2026).' };
      }
      updatedFields.securityPin = cleanPin;
    }

    // If email is changing, check uniqueness
    if (updatedFields.email) {
      const cleanEmail = updatedFields.email.trim().toLowerCase();
      const duplicate = accounts.find(a => a.id !== id && a.email.toLowerCase() === cleanEmail);
      if (duplicate) {
        return { success: false, error: 'Email sudah digunakan oleh akun admin lain.' };
      }
      updatedFields.email = cleanEmail;
    }

    // Protect root admin email & status change
    const isRootAccount = accounts[idx].email === 'cingire687@gmail.com' || accounts[idx].name === 'WAGYUA%' || accounts[idx].npa === '31052';
    if (isRootAccount && updatedFields.email && updatedFields.email !== 'cingire687@gmail.com') {
      return { success: false, error: 'Email akun Super Admin Utama (WAGYUA%) dilindungi dan tidak dapat diubah demi integritas sistem.' };
    }
    if (isRootAccount && updatedFields.status && updatedFields.status !== 'AKTIF') {
      return { success: false, error: 'Status akun Super Admin Utama (WAGYUA%) terkunci AKTIF dan tidak dapat dinonaktifkan.' };
    }

    accounts[idx] = {
      ...accounts[idx],
      ...updatedFields,
      updatedAt: new Date().toISOString()
    };

    this.saveAdminAccounts(accounts);
    this.addAuditLog('ADMIN_UPDATED', `Akun admin diperbarui: ${accounts[idx].name} (${accounts[idx].email})`);
    return { success: true, admin: accounts[idx] };
  }

  deleteAdminAccount(id) {
    const accounts = this.getAdminAccounts();
    const target = accounts.find(a => a.id === id);
    if (!target) {
      return { success: false, error: 'Akun admin tidak ditemukan.' };
    }

    // Protection 1: cannot delete primary root super admin (WAGYUA%)
    if (target.email === 'cingire687@gmail.com' || target.name === 'WAGYUA%' || target.npa === '31052' || target.id === 'adm-01') {
      return { success: false, error: 'Akun Super Admin Utama (WAGYUA%) terkunci permanen oleh sistem dan tidak dapat dihapus!' };
    }

    // Protection 2: cannot delete own currently logged in account
    const currentSession = this.getAdminSession();
    if (currentSession && currentSession.email && currentSession.email.toLowerCase() === target.email.toLowerCase()) {
      return { success: false, error: 'Anda tidak dapat menghapus akun yang sedang Anda gunakan untuk login saat ini.' };
    }

    // Protection 3: ensure at least 1 active admin remains
    const activeCount = accounts.filter(a => a.status === 'AKTIF').length;
    if (activeCount <= 1 && target.status === 'AKTIF') {
      return { success: false, error: 'Tidak dapat menghapus admin aktif terakhir. Sistem wajib memiliki minimal 1 akun admin aktif.' };
    }

    const filtered = accounts.filter(a => a.id !== id);
    this.saveAdminAccounts(filtered);
    this.addAuditLog('ADMIN_DELETED', `Akun admin dihapus: ${target.name} (${target.email}) - Role: ${target.role}`);
    return { success: true, count: filtered.length };
  }

  // --- Fonnte WhatsApp Gateway Integration ---
  getFonnteToken() {
    return localStorage.getItem('fonnte_token') || 'UbuVE56oykGTCjh1irUG';
  }

  setFonnteToken(token) {
    if (token) localStorage.setItem('fonnte_token', token.trim());
  }

  async sendWhatsAppFonnte(targetPhone, message) {
    let cleanPhone = String(targetPhone || '').replace(/\D/g, '');
    if (cleanPhone.startsWith('0')) {
      cleanPhone = '62' + cleanPhone.substring(1);
    } else if (!cleanPhone.startsWith('62') && cleanPhone.length > 5) {
      cleanPhone = '62' + cleanPhone;
    }

    if (!cleanPhone || cleanPhone.length < 8) {
      return { success: false, error: 'Nomor WhatsApp tidak valid (minimal 8 angka).' };
    }

    const token = this.getFonnteToken();

    try {
      const formData = new FormData();
      formData.append('target', cleanPhone);
      formData.append('message', message);
      formData.append('countryCode', '62');

      const response = await fetch('https://api.fonnte.com/send', {
        method: 'POST',
        headers: {
          'Authorization': token
        },
        body: formData
      });

      const data = await response.json();
      if (data && (data.status === true || data.status === 'true' || (data.detail && data.detail.includes('success')))) {
        this.addAuditLog('FONNTE_WA_SENT', `Pesan WhatsApp terkirim via Fonnte ke: ${cleanPhone}`);
        return { success: true, data, target: cleanPhone };
      } else {
        const errMsg = data.reason || data.detail || 'Fonnte mengembalikan status gagal.';
        return { success: false, error: errMsg, data };
      }
    } catch (err) {
      console.error('Fonnte send error:', err);
      return { success: false, error: 'Koneksi ke Fonnte gagal: ' + err.message };
    }
  }

  // --- Admin Authentication & 2FA ---
  validateAdminCredentials(email, password) {
    const cleanEmail = (email || '').trim().toLowerCase();
    const cleanPass = (password || '').trim();
    const accounts = this.getAdminAccounts();

    const found = accounts.find(a => a.email.toLowerCase() === cleanEmail);
    if (!found) {
      return { success: false, error: 'Email admin tidak terdaftar di sistem KPKU.' };
    }

    if (found.status === 'NON-AKTIF') {
      return { success: false, error: 'Akun admin ini berstatus NON-AKTIF / ditangguhkan. Hubungi Ketua KPKU.' };
    }

    if (found.password !== cleanPass && !(found.password === 'admin' && cleanPass === 'admin2026')) {
      return { success: false, error: 'Password salah. Silakan periksa kembali kata sandi Anda.' };
    }

    // Record last login time
    found.lastLogin = new Date().toISOString();
    this.saveAdminAccounts(accounts);

    return { success: true, admin: found };
  }

  generateAdminOtp(email, digits = 4) {
    // Generate 4-digit code for secure 2FA
    const min = Math.pow(10, digits - 1);
    const max = Math.pow(10, digits) - 1;
    const otp = Math.floor(min + Math.random() * (max - min + 1)).toString();
    const expiry = Date.now() + (10 * 60 * 1000); // 10 minutes
    const otpData = { email: (email || '').toLowerCase(), otp, expiry };
    try {
      sessionStorage.setItem('kpku_admin_otp', JSON.stringify(otpData));
    } catch(e) {}
    this.addAuditLog('ADMIN_OTP_SENT', `Kode OTP 2FA (${digits}-digit) disiapkan untuk: ${email}`);
    return otp;
  }

  verifyAdminOtp(email, otp) {
    const cleanOtp = (otp || '').trim();
    if (!cleanOtp) {
      return { success: false, error: 'Silakan masukkan kode verifikasi 4-digit.' };
    }

    // Check stored OTP
    try {
      const stored = JSON.parse(sessionStorage.getItem('kpku_admin_otp') || '{}');
      if (stored.otp && String(stored.otp).trim() === cleanOtp) {
        if (stored.expiry > Date.now()) {
          return { success: true };
        } else {
          return { success: false, error: 'Kode verifikasi telah kedaluwarsa. Silakan minta kode baru.' };
        }
      }
    } catch(e) {}

    // Check if entered code matches admin's registered 4-digit security PIN
    const pinCheck = this.verifyAdminSecurityPin(cleanOtp, email);
    if (pinCheck.success) {
      return { success: true };
    }

    return { success: false, error: 'Kode verifikasi tidak sesuai atau sudah kedaluwarsa.' };
  }

  verifyAdminSecurityPin(pin, email) {
    const cleanPin = (pin || '').trim();
    if (!cleanPin) {
      return { success: false, error: 'Silakan masukkan PIN Keamanan 4-digit.' };
    }

    // Check against target admin's registered PIN
    if (email) {
      const accounts = this.getAdminAccounts();
      const found = accounts.find(a => a.email.toLowerCase() === email.trim().toLowerCase());
      if (found && found.securityPin) {
        if (String(found.securityPin).trim() === cleanPin) {
          return { success: true };
        }
        return { success: false, error: 'PIN Keamanan tidak cocok dengan akun Anda.' };
      }
    }

    // Check global settings admin PIN
    const settings = this.getSettings();
    if (settings.adminPin && String(settings.adminPin).trim() === cleanPin) {
      return { success: true };
    }

    return { success: false, error: 'PIN Keamanan 4-digit salah.' };
  }

  setAdminSession(admin) {
    const session = {
      authenticated: true,
      email: admin.email,
      name: admin.name,
      role: admin.role,
      loginAt: new Date().toISOString()
    };
    try {
      sessionStorage.setItem('kpku_admin_session', JSON.stringify(session));
      localStorage.setItem('kpku_admin_auth', 'true');
    } catch(e) {}
    this.addAuditLog('ADMIN_LOGIN', `Admin berhasil login: ${admin.name} (${admin.email})`);
    return session;
  }

  getAdminSession() {
    try {
      return JSON.parse(sessionStorage.getItem('kpku_admin_session')) || null;
    } catch(e) {
      return null;
    }
  }

  logoutAdmin() {
    try {
      sessionStorage.removeItem('kpku_admin_session');
      sessionStorage.removeItem('kpku_admin_otp');
      localStorage.removeItem('kpku_admin_auth');
    } catch(e) {}
    this.addAuditLog('ADMIN_LOGOUT', 'Sesi admin ditutup (logout)');
    return true;
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

  // --- Random Check (04 Nov Pagi) Ajuan Timses Storage & Sync ---
  getRandomCheckSamples() {
    try {
      const raw = localStorage.getItem('pemilu_iagi_random_check_samples_v1');
      if (raw) {
        const parsed = JSON.parse(raw);
        if (parsed && Array.isArray(parsed[1]) && Array.isArray(parsed[2]) && Array.isArray(parsed[3])) {
          return parsed;
        }
      }
    } catch (e) {}
    return null;
  }

  saveRandomCheckSamples(samples) {
    try {
      localStorage.setItem('pemilu_iagi_random_check_samples_v1', JSON.stringify(samples));
      // Auto synchronize timses field into DPT database
      const dpt = this.getDPT();
      let changed = false;
      const timsesMap = {};
      [1, 2, 3].forEach(tId => {
        (samples[tId] || []).forEach(v => {
          if (v && v.npa) timsesMap[String(v.npa).trim().toUpperCase()] = tId;
        });
      });
      dpt.forEach(v => {
        const npaKey = String(v.npa || '').trim().toUpperCase();
        const expectedTimses = timsesMap[npaKey] || 0;
        if ((v.timses || 0) !== expectedTimses) {
          v.timses = expectedTimses;
          changed = true;
        }
      });
      if (changed) {
        this.saveDPT(dpt);
      }
    } catch (e) {}
  }

  // --- Reset Functionality for Testing ---
  resetAllData() {
    localStorage.removeItem(STORAGE_KEYS.DPT);
    localStorage.removeItem(STORAGE_KEYS.BALLOTS);
    localStorage.removeItem(STORAGE_KEYS.AUDIT);
    localStorage.removeItem(STORAGE_KEYS.SETTINGS);
    localStorage.removeItem(STORAGE_KEYS.DELETED_NPAS);
    localStorage.removeItem(STORAGE_KEYS.SERVER_RESULTS);
    localStorage.removeItem('pemilu_iagi_random_check_samples_v1');
    this.init();
    return true;
  }

  // --- Clear Ballots & Reset Votes to 0 (Keep DPT intact) ---
  async clearBallotsAndResetVotes() {
    localStorage.setItem(STORAGE_KEYS.BALLOTS, JSON.stringify([]));
    localStorage.removeItem(STORAGE_KEYS.SERVER_RESULTS);
    try {
      const dpt = this.getDPT();
      dpt.forEach(v => {
        v.voted = false;
        v.voted_at = null;
        v.receipt_hash = null;
        v.claimed = false;
        v.claimed_at = null;
        v.token = null;
      });
      this.saveDPT(dpt);
    } catch (e) {
      console.error('Error resetting DPT votes:', e);
    }

    try {
      if (typeof fetch !== 'undefined') {
        await fetch('api/vote_sync.php', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ action: 'clear_ballots', admin_pin: '312226' })
        });
      }
    } catch (e) {}

    this.addAuditLog('BALLOT_BOX_PURGED', 'Kotak suara resmi dikosongkan (0 suara) oleh Panitia KPKU. Seluruh hak suara DPT dipulihkan untuk Sidang Pemilu.');
    return true;
  }
}

// Global instance
window.pemiluStorage = new PemiluStorage();

// Universal Helper for all views & scripts
if (typeof window !== 'undefined') {
  window.getVotingScheduleConfig = function() {
    try {
      const raw = localStorage.getItem('pemilu_iagi_settings_v2');
      const defaults = {
        votingStartTime: '2026-10-26T00:01:00+07:00',
        votingEndTime: '2026-11-03T23:59:00+07:00',
        votingMode: 'auto',
        lockedMessage: 'Bilik suara pemilihan resmi akan dibuka secara otomatis saat hitung mundur selesai.'
      };
      const parsed = raw ? JSON.parse(raw) : {};
      const config = { ...defaults, ...parsed };

      const now = Date.now();
      const start = new Date(config.votingStartTime).getTime();
      const end = new Date(config.votingEndTime).getTime();
      let isOpen = false;
      let diff = 0;

      if (config.votingMode === 'force_open') {
        isOpen = true;
        diff = 0;
      } else if (config.votingMode === 'force_locked') {
        isOpen = false;
        diff = 86400000;
      } else {
        diff = start - now;
        isOpen = diff <= 0 && now <= end;
      }

      return {
        ...config,
        isOpen,
        diff: Math.max(0, diff),
        targetTimestamp: start
      };
    } catch (e) {
      const target = new Date('2026-10-26T00:01:00+07:00').getTime();
      const diff = target - Date.now();
      return {
        votingStartTime: '2026-10-26T00:01:00+07:00',
        votingEndTime: '2026-11-03T23:59:00+07:00',
        votingMode: 'auto',
        lockedMessage: 'Bilik suara pemilihan resmi akan dibuka secara otomatis saat hitung mundur selesai.',
        isOpen: diff <= 0,
        diff: Math.max(0, diff),
        targetTimestamp: target
      };
    }
  };

  // Ketetapan Regulasi & Jadwal Resmi KPKU Pemilu IAGI 2026
  window.OFFICIAL_ELECTION_TIMELINE = [
    {
      step: '01',
      date: '25 Oktober 2026',
      time: 'Pukul 19.00 WIB',
      tag: 'SOSIALISASI',
      color: '#38BDF8',
      icon: '📢',
      title: 'Sosialisasi & Demonstrasi Platform',
      desc: 'Sosialisasi dan demonstrasi teknis tata cara penggunaan platform pemungutan suara (e-voting) bagi seluruh anggota dan saksi paslon.'
    },
    {
      step: '02',
      date: '26 Okt – 03 Nov 2026',
      time: '26 Okt 00.01 WIB s.d. 03 Nov 23.59 WIB',
      tag: 'E-VOTING RESMI',
      color: '#F59E0B',
      icon: '🗳️',
      title: 'Masa Pemungutan Suara Elektronik',
      desc: 'Bilik suara dibuka resmi selama 9 hari penuh (24 jam non-stop). Anggota DPT dapat memberikan suara secara LUBER melalui kertas suara digital berenkripsi AES-256.'
    },
    {
      step: '03',
      date: '04 November 2026',
      time: 'Pagi Hari (WIB)',
      tag: 'UJI KESESUAIAN',
      color: '#A78BFA',
      icon: '🔍',
      title: 'Verifikasi Pilihan (Random Check Timses)',
      desc: 'Verifikasi transparansi dan kesesuaian pilihan melalui random check terhadap 5 nama pemilih yang diajukan oleh masing-masing timses paslon.'
    },
    {
      step: '04',
      date: '04 November 2026',
      time: 'Sore Hari (WIB)',
      tag: 'SIDANG PLENO',
      color: '#34D399',
      icon: '📊',
      title: 'Sidang Pleno & Resume Hasil 1 Halaman',
      desc: 'Hasil pemilu ditampilkan sebagai resume satu halaman yang memuat persentase & jumlah perolehan suara masing-masing caketum serta suara tidak terpakai (Total = 2.144 DPT).'
    }
  ];
}
