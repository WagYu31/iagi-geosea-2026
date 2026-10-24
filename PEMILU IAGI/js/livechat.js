/**
 * Pemilu IAGI 2026 - Official Helpdesk Live Chat Engine
 * Intelligent Virtual Assistant & Direct WhatsApp Committee Escalation
 */

(function() {
  'use strict';

  const KPKU_WA_NUMBER = '628111581461';
  const KPKU_WA_DISPLAY = '+62 811-158-1461';

  // Knowledge Base Responses
  const BOT_KNOWLEDGE = [
    {
      keywords: ['dpt', 'daftar pemilih', 'cek dpt', 'nama saya', 'terdaftar', 'npa tidak'],
      reply: 'Untuk memeriksa status Anda dalam <strong>Daftar Pemilih Tetap (DPT)</strong> resmi:\n1. Masuk ke menu <strong>Cek DPT</strong> di aplikasi ini.\n2. Masukkan <strong>NPA (Nomor Pokok Anggota)</strong> 5 digit atau Nama lengkap Anda.\n3. Jika Anda sudah berstatus anggota aktif IAGI namun belum terdata, silakan hubungi Panitia KPKU via WhatsApp untuk verifikasi berkas keanggotaan.',
      chips: ['🎟️ Cara Klaim Token', '🟢 Hubungi Panitia via WA']
    },
    {
      keywords: ['token', 'klaim', 'kode unik', 'surat suara', 'belum dapat', 'email', 'spam'],
      reply: 'Tata cara <strong>Klaim Token Surat Suara Digital</strong>:\n1. Buka menu <strong>Klaim</strong> di navigasi bawah.\n2. Masukkan <strong>NPA 5-digit</strong> dan <strong>Email terdaftar</strong> Anda di IAGI.\n3. Kode unik 128-bit (contoh: <code>IAGI-2026-XXXX-XXXX</code>) akan langsung dikirimkan ke Email & ditampilkan di layar.\n4. Cek folder <em>Inbox / Spam / Updates</em> email Anda.',
      chips: ['🗳️ Masuk Bilik Suara', '🟢 Hubungi Panitia via WA']
    },
    {
      keywords: ['bilik suara', 'cara vote', 'cara memilih', 'coblos', 'suara saya', 'pilihan'],
      reply: 'Panduan menggunakan <strong>Bilik Suara Digital</strong>:\n1. Buka menu <strong>Bilik Suara</strong>.\n2. Masukkan <strong>NPA</strong> dan <strong>Kode Unik Surat Suara</strong> yang telah diklaim.\n3. Pilih Calon Ketua Umum (01, 02, atau 03).\n4. Konfirmasi pilihan Anda. Pilihan bersifat <strong>FINAL & RAHASIA</strong>. Kode unik langsung dihanguskan demi keamanan satu suara satu pemilih.',
      chips: ['👨‍💼 Profil 3 Calon', '🔍 Cek Status DPT']
    },
    {
      keywords: ['calon', 'kandidat', 'caketum', 'paslon', 'mirzam', 'sonny', 'hartanto', 'nomor urut'],
      reply: 'Daftar Calon Ketua Umum IAGI Periode 2026–2029:\n• <strong>No. Urut 01:</strong> Mirzam Abdurrachman (NPA: 03457)\n• <strong>No. Urut 02:</strong> Sonny Yudhistira (NPA: 03749)\n• <strong>No. Urut 03:</strong> Sri Hartanto (NPA: 05653)\n\nAnda dapat melihat Visi, Misi & Video Profil lengkap di halaman Portal Utama.',
      chips: ['🗳️ Masuk Bilik Suara', '📅 Jadwal Pemilu']
    },
    {
      keywords: ['jadwal', 'kapan', 'tanggal', 'waktu', 'jam', 'dibuka', 'ditutup'],
      reply: 'Pemungutan Suara Elektronik (E-Voting) Pemilu IAGI 2026 dibuka resmi pada:\n📅 <strong>Senin, 26 Oktober 2026 pukul 00:01 WIB</strong> (UTC+7) secara serentak dalam rangka PIT IAGI ke-55 & GEOSEA XIX 2026.',
      chips: ['🎟️ Cara Klaim Token', '🔍 Cek Status DPT']
    },
    {
      keywords: ['wa', 'whatsapp', 'kontak', 'panitia', 'petugas', 'operator', 'hubungi', 'bantuan manual', 'helpdesk'],
      reply: 'Anda dapat langsung berinteraksi dengan <strong>Petugas Panitia Pelaksana KPKU</strong> via WhatsApp resmi untuk verifikasi data khusus atau bantuan darurat:',
      showWA: true,
      chips: ['🔍 Cek Status DPT', '🎟️ Cara Klaim Token']
    },
    {
      keywords: ['muat chat', 'pulihkan', 'riwayat', 'cek tiket', 'tiket saya', 'balasan saya', 'lihat balasan', 'baca balasan'],
      reply: '📂 <strong>Fitur Muat Riwayat Chat & Balasan Panitia:</strong>\nUntuk memuat percakapan sebelumnya atau melihat balasan dari Panitia:\n1. Masukkan <strong>NPA 5-digit</strong> Anda (contoh: <code>01842</code>) pada panel di atas atau langsung ketikkan di chat ini.\n2. Sistem akan otomatis memulihkan seluruh riwayat chat dan balasan resmi panitia.\n\nJika belum pernah mengajukan pengaduan, silakan langsung sampaikan pertanyaan Anda di bawah ini.',
      chips: ['🔍 Cek Status DPT', '🎟️ Cara Klaim Token', '🟢 Hubungi Panitia via WA']
    }
  ];

  // Initialize UI Elements
  function initLiveChat() {
    if (document.getElementById('kpku-chat-container')) return;

    const container = document.createElement('div');
    container.id = 'kpku-chat-container';
    container.innerHTML = `
      <!-- Trigger Floating Button -->
      <button type="button" class="kpku-chat-trigger" id="btn-chat-trigger" aria-label="Buka Live Chat Bantuan KPKU">
        <div class="chat-trigger-icon-wrap">
          <svg viewBox="0 0 24 24"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path></svg>
          <span class="chat-trigger-dot"></span>
        </div>
        <div class="chat-trigger-label">
          <span class="chat-trigger-title">Live Chat KPKU</span>
          <span class="chat-trigger-subtitle">● Online Helpdesk</span>
        </div>
        <span class="chat-trigger-badge" id="chat-unread-badge">1</span>
      </button>

      <!-- Overlay (Mobile) -->
      <div class="kpku-chat-overlay" id="chat-overlay"></div>

      <!-- Live Chat Window -->
      <div class="kpku-chat-window" id="chat-window">
        <!-- Mobile Drawer Handle Bar -->
        <div class="chat-drawer-handle-bar" id="chat-drawer-handle"></div>

        <!-- Header -->
        <div class="kpku-chat-header">
          <div class="chat-header-profile">
            <div class="chat-avatar-frame">
              <img src="assets/iagi-logo.png?v=iagi2026" alt="KPKU Logo">
              <span class="chat-avatar-status"></span>
            </div>
            <div class="chat-header-info">
              <span class="chat-header-title">Helpdesk Pemilu IAGI</span>
              <span class="chat-header-status">
                <span class="chat-trigger-dot" style="position:static; display:inline-block; margin-right:4px;"></span>
                Online • Respon Cepat
              </span>
            </div>
          </div>
          <div class="chat-header-actions">
            <button type="button" class="btn-chat-restore" id="btn-chat-restore" title="Muat / Pulihkan Riwayat Chat & Balasan Panitia (Cari dengan NPA)" aria-label="Muat Chat">
              <svg viewBox="0 0 24 24" style="width: 13px; height: 13px; stroke: currentColor; fill: none; stroke-width: 2.2;"><path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"></path></svg>
              <span>Muat Chat</span>
            </button>
            <a href="https://wa.me/${KPKU_WA_NUMBER}?text=Halo%20Panitia%20KPKU%20IAGI%202026,%20saya%20butuh%20bantuan%20terkait%20Pemilu." target="_blank" rel="noopener noreferrer" class="btn-chat-wa" title="Lanjut Chat di WhatsApp">
              <svg viewBox="0 0 24 24"><path fill="currentColor" d="M12.04 2c-5.46 0-9.91 4.45-9.91 9.91 0 1.75.46 3.45 1.32 4.95L2.05 22l5.25-1.38c1.45.79 3.08 1.21 4.74 1.21 5.46 0 9.91-4.45 9.91-9.91 0-2.65-1.03-5.14-2.9-7.01A9.816 9.816 0 0 0 12.04 2m.01 1.67c2.2 0 4.26.86 5.82 2.42a8.225 8.225 0 0 1 2.41 5.83c0 4.54-3.7 8.24-8.24 8.24-1.48 0-2.93-.4-4.2-1.15l-.3-.18-3.12.82.83-3.04-.2-.31a8.196 8.196 0 0 1-1.26-4.38c0-4.54 3.7-8.24 8.24-8.24m4.52 11.64c-.25-.13-1.47-.72-1.7-.81-.23-.08-.39-.13-.56.13-.17.25-.64.81-.79.97-.14.17-.29.19-.54.06-.25-.13-1.06-.39-2.02-1.25-.75-.67-1.26-1.5-1.4-1.75-.15-.25-.02-.39.11-.51.11-.11.25-.29.37-.44.13-.15.17-.25.25-.42.08-.17.04-.31-.02-.44-.06-.13-.56-1.35-.77-1.85-.2-.49-.41-.42-.56-.43h-.48c-.17 0-.44.06-.67.31-.23.25-.88.86-.88 2.1 0 1.24.9 2.44 1.03 2.61.13.17 1.78 2.72 4.31 3.81.6.26 1.07.42 1.44.54.61.19 1.16.17 1.6.1.49-.07 1.47-.6 1.68-1.18.21-.58.21-1.07.15-1.18-.06-.1-.23-.17-.48-.29z"/></svg>
            </a>
            <button type="button" class="btn-chat-close" id="btn-chat-close" aria-label="Tutup Chat">&times;</button>
          </div>
        </div>

        <!-- Banner -->
        <div class="kpku-chat-banner">
          <svg viewBox="0 0 24 24"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path></svg>
          <span>Pusat Bantuan Resmi Panitia Pemilu Ketua Umum IAGI 2026–2029</span>
        </div>

        <!-- Restore / Recovery Panel -->
        <div class="chat-restore-panel" id="chat-restore-panel" style="display: none;">
          <div class="chat-restore-inner">
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 6px;">
              <span class="chat-restore-desc" style="font-weight: 700; color: #FDE68A; font-size: 0.78rem;">
                📂 Muat Riwayat Chat & Balasan Panitia
              </span>
              <button type="button" onclick="document.getElementById('chat-restore-panel').style.display='none'" style="background:none; border:none; color:#94A3B8; font-size:1.2rem; cursor:pointer; line-height:1; padding:0 4px;" aria-label="Tutup Panel">&times;</button>
            </div>
            <div style="font-size: 0.72rem; color: #94A3B8; margin-bottom: 8px; line-height: 1.35;">
              Masukkan <strong>NPA 5-digit</strong> atau <strong>Email</strong> Anda untuk memuat percakapan & balasan resmi admin:
            </div>
            <div class="chat-restore-input-group">
              <input type="text" id="restore-npa-input" class="restore-input" placeholder="Contoh: 01842 atau email...">
              <button type="button" class="btn-do-restore" id="btn-do-restore" onclick="window.doRestoreByNpa()">Muat Chat</button>
            </div>
            <div id="restore-status-msg" style="display: none; font-size: 0.74rem; padding: 4px 0; font-weight: 600;"></div>
          </div>
        </div>

        <!-- PRE-CHAT REGISTRATION FORM SCREEN -->
        <div class="kpku-prechat-screen" id="prechat-screen" style="display: none;">
          <div class="prechat-card">
            <div class="prechat-badge">
              <svg viewBox="0 0 24 24" style="width: 14px; height: 14px; stroke: currentColor; fill: none; stroke-width: 2.2;"><path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="8.5" cy="7" r="4"></circle><polyline points="17 11 19 13 23 9"></polyline></svg>
              <span>Formulir Pengaduan Pemilih</span>
            </div>
            <h3 class="prechat-title">Layanan Bantuan Resmi Pemilu IAGI</h3>
            <p class="prechat-desc">
              Mohon lengkapi <strong>Nama</strong>, <strong>NPA</strong>, dan <strong>Email</strong> agar Panitia KPKU dapat mencatat dan memverifikasi data Anda:
            </p>

            <form class="prechat-form" id="prechat-form" onsubmit="window.handlePreChatSubmit(event)">
              <div class="prechat-field">
                <label for="prechat-name">Nama Lengkap <span class="required-star">*</span></label>
                <div class="prechat-input-wrap">
                  <svg class="prechat-icon" viewBox="0 0 24 24"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>
                  <input type="text" id="prechat-name" class="prechat-input" placeholder="Contoh: Ir. Budi Santoso, M.T." required autocomplete="name">
                </div>
              </div>

              <div class="prechat-field">
                <label for="prechat-npa">Nomor Pokok Anggota (NPA) <span class="required-star">*</span></label>
                <div class="prechat-input-wrap">
                  <svg class="prechat-icon" viewBox="0 0 24 24"><rect x="3" y="4" width="18" height="16" rx="2"></rect><line x1="7" y1="8" x2="17" y2="8"></line><line x1="7" y1="12" x2="13" y2="12"></line></svg>
                  <input type="text" id="prechat-npa" class="prechat-input font-mono" placeholder="5 digit, contoh: 01842 atau 00000" maxlength="10" required>
                </div>
                <span class="prechat-hint">Ketik 5 digit NPA resmi IAGI Anda, atau <strong>00000</strong> jika belum ber-NPA.</span>
              </div>

              <div class="prechat-field">
                <label for="prechat-email">Email Terdaftar <span class="required-star">*</span></label>
                <div class="prechat-input-wrap">
                  <svg class="prechat-icon" viewBox="0 0 24 24"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path><polyline points="22,6 12,13 2,6"></polyline></svg>
                  <input type="email" id="prechat-email" class="prechat-input" placeholder="contoh: budi@geology.id" required autocomplete="email">
                </div>
              </div>

              <div class="prechat-field">
                <label>Topik Bantuan</label>
                <div class="prechat-topic-grid" id="prechat-topic-grid">
                  <button type="button" class="prechat-topic-btn active" data-topic="Klaim Token Surat Suara">🎟️ Klaim Token</button>
                  <button type="button" class="prechat-topic-btn" data-topic="Pemeriksaan Data DPT">🔍 Cek DPT</button>
                  <button type="button" class="prechat-topic-btn" data-topic="Bilik Suara Digital">🗳️ Bilik Suara</button>
                  <button type="button" class="prechat-topic-btn" data-topic="Pertanyaan Lain">💬 Bantuan Lain</button>
                </div>
              </div>

              <button type="submit" class="btn-prechat-submit" id="btn-prechat-submit">
                <span>🚀 Mulai Chat & Hubungkan ke Panitia</span>
              </button>

              <div class="prechat-footer-action">
                <span>Sudah punya tiket pengaduan?</span>
                <button type="button" class="btn-prechat-link" onclick="window.openRestorePanel()">📂 Muat Chat Lama</button>
              </div>
            </form>
          </div>
        </div>

        <!-- Messages Stream -->
        <div class="kpku-chat-messages" id="chat-messages" style="display: none;">
          <!-- Voter Identity Active Banner -->
          <div class="chat-voter-id-banner" id="chat-voter-id-banner" style="display: none;">
            <div class="voter-id-left">
              <div class="voter-id-icon">🪪</div>
              <div class="voter-id-info">
                <div class="voter-id-name" id="voter-id-display-name">-</div>
                <div class="voter-id-sub" id="voter-id-display-sub">-</div>
              </div>
            </div>
            <button type="button" class="btn-voter-id-edit" onclick="window.showPreChatForm(true)" title="Ubah Nama, NPA, atau Email">Ubah Data</button>
          </div>
          <!-- Initial Welcome Message -->
          <div class="chat-msg bot">
            <span class="msg-sender-tag">KPKU Support</span>
            <div class="msg-bubble">
              Halo Rekan Geolog! 👋 Selamat datang di <strong>Layanan Bantuan Resmi Pemilu IAGI 2026</strong>.
              <br><br>
              Ada yang bisa kami bantu terkait Cek DPT, Klaim Token Surat Suara, atau Masuk Bilik Suara?
              <div class="chat-quick-chips">
                <button type="button" class="chat-chip highlight" onclick="window.sendChatQuery('Muat Chat')">📂 Muat Chat / Cek Tiket</button>
                <button type="button" class="chat-chip" onclick="window.sendChatQuery('Cek DPT')">🔍 Cek Status DPT</button>
                <button type="button" class="chat-chip" onclick="window.sendChatQuery('Klaim Token')">🎟️ Cara Klaim Token</button>
                <button type="button" class="chat-chip" onclick="window.sendChatQuery('Bilik Suara')">🗳️ Masuk Bilik Suara</button>
                <button type="button" class="chat-chip" onclick="window.sendChatQuery('Profil Calon')">👨‍💼 Profil 3 Calon</button>
                <button type="button" class="chat-chip" onclick="window.sendChatQuery('Hubungi WA')">🟢 Hubungi Panitia via WA</button>
              </div>
            </div>
            <span class="msg-time" id="chat-init-time"></span>
          </div>

          <!-- Typing Indicator -->
          <div class="chat-typing" id="chat-typing">
            <span class="typing-dot"></span>
            <span class="typing-dot"></span>
            <span class="typing-dot"></span>
          </div>
        </div>

        <!-- Input Bar -->
        <form class="kpku-chat-input-bar" id="chat-form">
          <input type="text" class="chat-input-field" id="chat-input" placeholder="Ketik pertanyaan Anda..." autocomplete="off">
          <button type="submit" class="chat-btn-send" aria-label="Kirim Pesan">
            <svg viewBox="0 0 24 24"><line x1="22" y1="2" x2="11" y2="13"></line><polygon points="22 2 15 22 11 13 2 9 22 2"></polygon></svg>
          </button>
        </form>
      </div>
    `;

    document.body.appendChild(container);
    bindChatEvents();

    // Set initial timestamp
    const now = new Date();
    const timeStr = String(now.getHours()).padStart(2, '0') + ':' + String(now.getMinutes()).padStart(2, '0') + ' WIB';
    const timeElem = document.getElementById('chat-init-time');
    if (timeElem) timeElem.textContent = timeStr;
  }

  function bindChatEvents() {
    const trigger = document.getElementById('btn-chat-trigger');
    const closeBtn = document.getElementById('btn-chat-close');
    const overlay = document.getElementById('chat-overlay');
    const form = document.getElementById('chat-form');
    const input = document.getElementById('chat-input');
    const badge = document.getElementById('chat-unread-badge');

    if (document.querySelector('.mobile-nav-dock')) {
      if (trigger) trigger.classList.add('docked-above');
      const win = document.getElementById('chat-window');
      if (win) win.classList.add('docked-above');
    }

    const restoreBtn = document.getElementById('btn-chat-restore');
    const restoreInput = document.getElementById('restore-npa-input');

    if (restoreBtn) {
      restoreBtn.addEventListener('click', () => {
        const panel = document.getElementById('chat-restore-panel');
        if (panel) {
          const isHidden = (panel.style.display === 'none' || !panel.style.display);
          panel.style.display = isHidden ? 'block' : 'none';
          if (isHidden && restoreInput) {
            const id = getVoterIdentity();
            if (id.voterNpa && id.voterNpa !== 'Tamu') restoreInput.value = id.voterNpa;
            setTimeout(() => restoreInput.focus(), 60);
          }
        }
      });
    }

    if (restoreInput) {
      restoreInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
          e.preventDefault();
          window.doRestoreByNpa();
        }
      });
    }

    if (trigger) {
      trigger.addEventListener('click', () => {
        toggleChatWindow(true);
        if (badge) badge.style.display = 'none';
      });
    }

    if (closeBtn) {
      closeBtn.addEventListener('click', () => toggleChatWindow(false));
    }

    if (overlay) {
      overlay.addEventListener('click', () => toggleChatWindow(false));
    }

    if (form) {
      form.addEventListener('submit', (e) => {
        e.preventDefault();
        const text = input.value.trim();
        if (text) {
          handleUserSend(text);
          input.value = '';
        }
      });
    }

    // Bind pre-chat topic selector chips
    const topicBtns = document.querySelectorAll('.prechat-topic-btn');
    topicBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        topicBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
      });
    });

    if (hasCompletedPreChat()) {
      showPreChatForm(false);
    } else {
      showPreChatForm(true);
    }
  }

  function toggleChatWindow(show) {
    const win = document.getElementById('chat-window');
    const overlay = document.getElementById('chat-overlay');
    if (!win) return;

    if (show) {
      win.classList.add('active');
      if (overlay) overlay.classList.add('active');

      if (hasCompletedPreChat()) {
        showPreChatForm(false);
        const input = document.getElementById('chat-input');
        if (input && window.innerWidth > 480) input.focus();
      } else {
        showPreChatForm(true);
      }
    } else {
      win.classList.remove('active');
      if (overlay) overlay.classList.remove('active');
    }
  }

  const CHAT_STORAGE_KEY = 'kpku_livechat_sessions';
  const ACTIVE_TICKET_KEY = 'kpku_voter_active_ticket_id';
  const VOTER_IDENTITY_KEY = 'kpku_chat_voter_identity';
  const SESSION_ACTIVE_KEY = 'kpku_chat_in_progress';
  let displayedAdminMsgCount = 0;

  function hasCompletedPreChat() {
    try {
      if (sessionStorage.getItem(SESSION_ACTIVE_KEY) === '1') {
        return true;
      }
    } catch(e) {}
    return false;
  }

  function showPreChatForm(show) {
    const prechatScreen = document.getElementById('prechat-screen');
    const chatMessages = document.getElementById('chat-messages');
    const chatForm = document.getElementById('chat-form');

    if (show) {
      try {
        sessionStorage.removeItem(SESSION_ACTIVE_KEY);
      } catch(e) {}

      if (prechatScreen) prechatScreen.style.display = 'flex';
      if (chatMessages) chatMessages.style.display = 'none';
      if (chatForm) chatForm.style.display = 'none';

      // Pre-fill fields with existing identity if available
      const id = getVoterIdentity();
      const nameInput = document.getElementById('prechat-name');
      const npaInput = document.getElementById('prechat-npa');
      const emailInput = document.getElementById('prechat-email');

      if (nameInput && id.voterName && !id.voterName.includes('Tamu')) nameInput.value = id.voterName;
      if (npaInput && id.voterNpa && id.voterNpa !== 'Tamu') npaInput.value = id.voterNpa;
      if (emailInput && id.voterEmail) emailInput.value = id.voterEmail;

      setTimeout(() => {
        if (nameInput && !nameInput.value) nameInput.focus();
        else if (npaInput && !npaInput.value) npaInput.focus();
      }, 100);
    } else {
      try {
        sessionStorage.setItem(SESSION_ACTIVE_KEY, '1');
      } catch(e) {}

      if (prechatScreen) prechatScreen.style.display = 'none';
      if (chatMessages) chatMessages.style.display = 'flex';
      if (chatForm) chatForm.style.display = 'flex';

      updateVoterIdentityBanner();
    }
  }
  window.showPreChatForm = showPreChatForm;

  function updateVoterIdentityBanner() {
    const banner = document.getElementById('chat-voter-id-banner');
    const nameEl = document.getElementById('voter-id-display-name');
    const subEl = document.getElementById('voter-id-display-sub');

    const id = getVoterIdentity();
    if (!banner || !id.voterName || id.voterName.includes('Tamu')) {
      if (banner) banner.style.display = 'none';
      return;
    }

    if (nameEl) nameEl.textContent = '👤 ' + id.voterName;
    if (subEl) subEl.innerHTML = `🪪 NPA: <strong>${escapeHtml(id.voterNpa || '-')}</strong> • ✉️ ${escapeHtml(id.voterEmail || '-')}`;
    banner.style.display = 'flex';
  }

  window.handlePreChatSubmit = function(event) {
    if (event) event.preventDefault();

    const nameInput = document.getElementById('prechat-name');
    const npaInput = document.getElementById('prechat-npa');
    const emailInput = document.getElementById('prechat-email');

    const name = (nameInput ? nameInput.value : '').trim();
    const npa = (npaInput ? npaInput.value : '').trim();
    const email = (emailInput ? emailInput.value : '').trim();

    if (!name || name.length < 2) {
      alert('Mohon masukkan Nama Lengkap Anda.');
      if (nameInput) nameInput.focus();
      return;
    }
    if (!npa) {
      alert('Mohon masukkan Nomor Pokok Anggota (NPA) Anda (atau 00000).');
      if (npaInput) npaInput.focus();
      return;
    }
    if (!email || !email.includes('@')) {
      alert('Mohon masukkan Email valid yang terdaftar di IAGI.');
      if (emailInput) emailInput.focus();
      return;
    }

    const activeTopicBtn = document.querySelector('.prechat-topic-btn.active');
    const topic = activeTopicBtn ? activeTopicBtn.dataset.topic : 'Bantuan Umum';

    // 1. Save identity
    const identityObj = {
      name: name,
      npa: npa,
      email: email,
      topic: topic,
      timestamp: Date.now()
    };
    localStorage.setItem(VOTER_IDENTITY_KEY, JSON.stringify(identityObj));

    // 2. Initialize or Update session in kpku_livechat_sessions
    let sessions = [];
    try {
      sessions = JSON.parse(localStorage.getItem(CHAT_STORAGE_KEY) || '[]');
      if (!Array.isArray(sessions)) sessions = [];
    } catch(e) { sessions = []; }

    const now = new Date();
    const timeStr = String(now.getHours()).padStart(2, '0') + ':' + String(now.getMinutes()).padStart(2, '0') + ' WIB';

    let ticketId = getActiveTicketId();
    let ticket = sessions.find(s => s.id === ticketId);

    if (!ticket) {
      ticketId = 'ticket-live-' + Date.now();
      setActiveTicketId(ticketId);
      ticket = {
        id: ticketId,
        userName: name,
        userNpa: npa,
        userEmail: email,
        userPhone: '',
        channel: 'Live Web Chat',
        status: 'waiting',
        startedAt: '24 Okt 2026, ' + timeStr,
        lastUpdated: timeStr,
        messages: []
      };
      sessions.unshift(ticket);
    } else {
      ticket.userName = name;
      ticket.userNpa = npa;
      ticket.userEmail = email;
      ticket.status = 'waiting';
      ticket.lastUpdated = timeStr;
    }

    // Add initial prechat registration message
    const regMsg = `[Registrasi Bantuan Pemilu IAGI 2026]\nNama: ${name}\nNPA: ${npa}\nEmail: ${email}\nTopik: ${topic}`;
    const botGreeting = `Halo Rekan <strong>${escapeHtml(name)}</strong>! 👋\n\nData identitas Anda telah berhasil dicatat dengan NPA: <strong>${escapeHtml(npa)}</strong> dan Email: <strong>${escapeHtml(email)}</strong>.\n\nTiket pengaduan Anda telah terhubung ke meja Panitia KPKU (Topik: <em>${escapeHtml(topic)}</em>). Silakan sampaikan pertanyaan atau kendala detail Anda di bawah:`;

    ticket.messages.push({ sender: 'user', text: regMsg, time: timeStr });
    ticket.messages.push({ sender: 'bot', text: botGreeting, time: timeStr });

    localStorage.setItem(CHAT_STORAGE_KEY, JSON.stringify(sessions));
    setActiveTicketId(ticket.id);

    // 3. Switch screens to active chat
    showPreChatForm(false);
    renderFullChatHistory(ticket);

    const input = document.getElementById('chat-input');
    if (input && window.innerWidth > 480) input.focus();
  };

  function getActiveTicketId() {
    return localStorage.getItem(ACTIVE_TICKET_KEY) || sessionStorage.getItem('kpku_chat_session_id');
  }

  function setActiveTicketId(id) {
    if (id) {
      localStorage.setItem(ACTIVE_TICKET_KEY, id);
      sessionStorage.setItem('kpku_chat_session_id', id);
    }
  }

  function extractNpaFromText(text) {
    if (!text) return null;
    const match = text.match(/\b\d{5}\b/);
    return match ? match[0] : null;
  }

  function getVoterIdentity() {
    let voterName = '';
    let voterNpa = '';
    let voterEmail = '';
    let voterPhone = '';

    try {
      const saved = JSON.parse(localStorage.getItem(VOTER_IDENTITY_KEY) || '{}');
      if (saved && saved.name) {
        voterName = saved.name;
        voterNpa = saved.npa || '';
        voterEmail = saved.email || '';
        voterPhone = saved.phone || '';
      }
    } catch (e) {}

    if (!voterName) {
      try {
        const claimed = JSON.parse(localStorage.getItem('pemilu_iagi_claimed_voter') || '{}');
        if (claimed && claimed.name) {
          voterName = claimed.name;
          voterNpa = claimed.npa || '';
          voterEmail = claimed.email || '';
          voterPhone = claimed.phone || '';
        }
      } catch (e) {}
    }

    if (!voterName) {
      try {
        const current = JSON.parse(localStorage.getItem('pemilu_current_user') || '{}');
        if (current && current.name) {
          voterName = current.name;
          voterNpa = current.npa || '';
          voterEmail = current.email || '';
          voterPhone = current.phone || '';
        }
      } catch (e) {}
    }

    if (!voterName) voterName = 'Rekan Geolog (Tamu Web)';
    if (!voterNpa) voterNpa = 'Tamu';

    return { voterName, voterNpa, voterEmail, voterPhone };
  }

  function syncVoterChatSession(userText, botText) {
    try {
      let sessions = [];
      try {
        sessions = JSON.parse(localStorage.getItem(CHAT_STORAGE_KEY) || '[]');
        if (!Array.isArray(sessions)) sessions = [];
      } catch (e) { sessions = []; }

      let ticketId = getActiveTicketId();
      let ticket = sessions.find(s => s.id === ticketId);

      const identity = getVoterIdentity();
      const detectedNpa = extractNpaFromText(userText);
      if (detectedNpa && identity.voterNpa === 'Tamu') {
        identity.voterNpa = detectedNpa;
      }

      const now = new Date();
      const timeStr = String(now.getHours()).padStart(2, '0') + ':' + String(now.getMinutes()).padStart(2, '0') + ' WIB';

      if (!ticket) {
        ticketId = 'ticket-live-' + Date.now();
        setActiveTicketId(ticketId);
        ticket = {
          id: ticketId,
          userName: identity.voterName,
          userNpa: identity.voterNpa,
          userEmail: identity.voterEmail,
          userPhone: identity.voterPhone,
          channel: 'Live Web Chat',
          status: 'waiting',
          startedAt: '24 Okt 2026, ' + timeStr,
          lastUpdated: timeStr,
          messages: []
        };
        sessions.unshift(ticket);
      } else {
        if ((ticket.userNpa === 'Tamu' || !ticket.userNpa) && identity.voterNpa !== 'Tamu') {
          ticket.userName = identity.voterName;
          ticket.userNpa = identity.voterNpa;
          ticket.userEmail = identity.voterEmail || ticket.userEmail;
          ticket.userPhone = identity.voterPhone || ticket.userPhone;
        }
      }

      if (userText) {
        ticket.messages.push({ sender: 'user', text: userText, time: timeStr });
        ticket.status = 'waiting';
        ticket.lastUpdated = timeStr;
      }
      if (botText) {
        ticket.messages.push({ sender: 'bot', text: botText, time: timeStr });
      }

      localStorage.setItem(CHAT_STORAGE_KEY, JSON.stringify(sessions));
      setActiveTicketId(ticket.id);
    } catch (e) {
      console.error('Error syncing voter chat to admin:', e);
    }
  }

  function renderFullChatHistory(ticket) {
    const msgContainer = document.getElementById('chat-messages');
    const typing = document.getElementById('chat-typing');
    if (!msgContainer) return;

    // Clear existing rendered history to prevent duplicates
    const oldDynamic = msgContainer.querySelectorAll('.rendered-history, .chat-resume-banner');
    oldDynamic.forEach(el => el.remove());

    // Show persistent resume banner
    const banner = document.createElement('div');
    banner.className = 'chat-resume-banner';
    banner.innerHTML = `<span>📂 Sesi Terhubung: ${escapeHtml(ticket.userName)} (NPA: ${escapeHtml(ticket.userNpa || 'Tamu')})</span>`;
    if (typing) {
      msgContainer.insertBefore(banner, typing);
    } else {
      msgContainer.appendChild(banner);
    }

    let adminCount = 0;
    (ticket.messages || []).forEach(m => {
      const div = document.createElement('div');
      div.className = `chat-msg ${m.sender === 'user' ? 'user' : 'bot'} rendered-history`;

      if (m.sender === 'user') {
        div.innerHTML = `
          <span class="msg-sender-tag">Anda</span>
          <div class="msg-bubble">${escapeHtml(m.text).replace(/\n/g, '<br>')}</div>
          <span class="msg-time">${escapeHtml(m.time || '')}</span>
        `;
      } else if (m.sender === 'bot') {
        div.innerHTML = `
          <span class="msg-sender-tag">KPKU Support (Bot)</span>
          <div class="msg-bubble">${escapeHtml(m.text).replace(/\n/g, '<br>')}</div>
          <span class="msg-time">${escapeHtml(m.time || '')}</span>
        `;
      } else {
        // Admin official response
        adminCount++;
        div.style.borderLeft = '3px solid #34D399';
        div.style.paddingLeft = '6px';
        div.innerHTML = `
          <span class="msg-sender-tag" style="color: #34D399; font-weight: 800;">🏛️ ${escapeHtml(m.adminName || 'Panitia KPKU (Admin)')}</span>
          <div class="msg-bubble" style="background: rgba(16, 185, 129, 0.15); border-color: rgba(16, 185, 129, 0.35); color: #F0FDF4;">
            ${escapeHtml(m.text).replace(/\n/g, '<br>')}
          </div>
          <span class="msg-time">${escapeHtml(m.time || '')} ✓ Balasan Resmi</span>
        `;
      }

      if (typing) {
        msgContainer.insertBefore(div, typing);
      } else {
        msgContainer.appendChild(div);
      }
    });

    displayedAdminMsgCount = adminCount;
    msgContainer.scrollTop = msgContainer.scrollHeight;

    // Unread badge alert if window is closed
    if (adminCount > 0) {
      const win = document.getElementById('chat-window');
      if (!win || !win.classList.contains('active')) {
        const badge = document.getElementById('chat-unread-badge');
        if (badge) {
          badge.style.display = 'block';
          badge.textContent = String(adminCount);
        }
      }
    }
  }

  function restoreChatSession() {
    try {
      let ticketId = getActiveTicketId();
      const identity = getVoterIdentity();

      const raw = localStorage.getItem(CHAT_STORAGE_KEY);
      if (!raw) return;
      let sessions = [];
      try {
        sessions = JSON.parse(raw);
      } catch(e) { return; }
      if (!Array.isArray(sessions) || sessions.length === 0) return;

      let ticket = null;
      if (ticketId) {
        ticket = sessions.find(s => s.id === ticketId);
      }

      // Smart fallback: If no active ticket ID, but user is known by NPA, find their latest ticket
      if (!ticket && identity && identity.voterNpa && identity.voterNpa !== 'Tamu') {
        ticket = sessions.find(s => s.userNpa === identity.voterNpa);
        if (ticket) {
          setActiveTicketId(ticket.id);
        }
      }

      if (!ticket || !ticket.messages || ticket.messages.length === 0) return;

      renderFullChatHistory(ticket);
    } catch (e) {
      console.error('Error restoring chat session:', e);
    }
  }

  window.doRestoreByNpa = function(customVal) {
    const input = document.getElementById('restore-npa-input');
    const statusMsg = document.getElementById('restore-status-msg');
    const query = (customVal || (input ? input.value : '')).trim().toLowerCase();
    if (!query) {
      if (statusMsg) {
        statusMsg.style.display = 'block';
        statusMsg.style.color = '#F87171';
        statusMsg.innerText = 'Masukkan NPA 5-digit atau Email terlebih dahulu.';
      }
      return;
    }

    const raw = localStorage.getItem(CHAT_STORAGE_KEY);
    if (!raw) {
      if (statusMsg) {
        statusMsg.style.display = 'block';
        statusMsg.style.color = '#F87171';
        statusMsg.innerText = 'Belum ada data pengaduan yang tersimpan di sistem.';
      }
      return;
    }

    let sessions = [];
    try { sessions = JSON.parse(raw); } catch(e) {}
    const found = sessions.find(s => {
      const npaMatch = (s.userNpa || '').toLowerCase() === query;
      const emailMatch = (s.userEmail || '').toLowerCase() === query;
      const nameMatch = (s.userName || '').toLowerCase().includes(query);
      return npaMatch || emailMatch || nameMatch;
    });

    if (!found) {
      if (statusMsg) {
        statusMsg.style.display = 'block';
        statusMsg.style.color = '#F87171';
        statusMsg.innerText = 'Tidak ditemukan tiket aktif untuk "' + query + '". Silakan ketik pertanyaan langsung di bawah.';
      }
      return;
    }

    setActiveTicketId(found.id);
    try {
      localStorage.setItem(VOTER_IDENTITY_KEY, JSON.stringify({
        name: found.userName,
        npa: found.userNpa,
        email: found.userEmail,
        timestamp: Date.now()
      }));
    } catch(e) {}
    showPreChatForm(false);
    renderFullChatHistory(found);

    if (statusMsg) {
      statusMsg.style.display = 'block';
      statusMsg.style.color = '#34D399';
      const adminReplyCount = (found.messages || []).filter(m => m.sender === 'admin').length;
      statusMsg.innerText = `✓ Berhasil memuat sesi ${found.userName} (NPA: ${found.userNpa}). ${adminReplyCount} balasan panitia tersedia.`;
    }

    const panel = document.getElementById('chat-restore-panel');
    setTimeout(() => {
      if (panel) panel.style.display = 'none';
    }, 2500);
  };

  function checkForAdminReplies() {
    try {
      const ticketId = getActiveTicketId();
      if (!ticketId) return;

      const raw = localStorage.getItem(CHAT_STORAGE_KEY);
      if (!raw) return;
      const sessions = JSON.parse(raw);
      const ticket = sessions.find(s => s.id === ticketId);
      if (!ticket || !ticket.messages) return;

      const adminMessages = ticket.messages.filter(m => m.sender === 'admin');
      if (adminMessages.length > displayedAdminMsgCount) {
        for (let i = displayedAdminMsgCount; i < adminMessages.length; i++) {
          const adm = adminMessages[i];
          appendAdminMessage(adm.text, adm.adminName || 'Panitia KPKU (Admin)', adm.time);
        }
        displayedAdminMsgCount = adminMessages.length;

        const win = document.getElementById('chat-window');
        if (!win || !win.classList.contains('active')) {
          const badge = document.getElementById('chat-unread-badge');
          if (badge) {
            badge.style.display = 'block';
            badge.textContent = String(adminMessages.length);
          }
        }
      }
    } catch (e) {
      console.error('Error checking admin replies', e);
    }
  }

  function appendAdminMessage(text, adminName, timeStr) {
    const msgContainer = document.getElementById('chat-messages');
    const typing = document.getElementById('chat-typing');
    if (!msgContainer) return;

    const div = document.createElement('div');
    div.className = 'chat-msg bot rendered-history';
    div.style.borderLeft = '3px solid #34D399';
    div.style.paddingLeft = '6px';

    div.innerHTML = `
      <span class="msg-sender-tag" style="color: #34D399; font-weight: 800;">🏛️ ${escapeHtml(adminName)}</span>
      <div class="msg-bubble" style="background: rgba(16, 185, 129, 0.15); border-color: rgba(16, 185, 129, 0.35); color: #F0FDF4;">
        ${escapeHtml(text).replace(/\n/g, '<br>')}
      </div>
      <span class="msg-time">${timeStr || 'Baru saja'} ✓ Balasan Resmi</span>
    `;

    if (typing) {
      msgContainer.insertBefore(div, typing);
    } else {
      msgContainer.appendChild(div);
    }

    msgContainer.scrollTop = msgContainer.scrollHeight;
  }

  function handleUserSend(text) {
    const trimmed = (text || '').trim();
    if (!trimmed) return;

    appendMessage(trimmed, 'user');
    showTyping(true);

    setTimeout(() => {
      showTyping(false);

      const lower = trimmed.toLowerCase();
      const detectedNpa = extractNpaFromText(trimmed);

      // Check if user specifically asked to Muat Chat / restore
      const isRestoreQuery = lower.includes('muat chat') || 
                             lower.includes('pulihkan') || 
                             lower.includes('cek tiket') || 
                             lower.includes('riwayat') || 
                             lower.includes('baca balasan') || 
                             lower.includes('lihat balasan');

      if (isRestoreQuery) {
        // Automatically open the restore panel for convenient user input
        const panel = document.getElementById('chat-restore-panel');
        if (panel) panel.style.display = 'block';

        // Check if we can auto-restore right now
        let ticketId = getActiveTicketId();
        const raw = localStorage.getItem(CHAT_STORAGE_KEY);
        let sessions = [];
        try { sessions = JSON.parse(raw || '[]'); } catch(e) {}

        let ticket = null;
        if (ticketId) ticket = sessions.find(s => s.id === ticketId);
        if (!ticket && detectedNpa) ticket = sessions.find(s => s.userNpa === detectedNpa);

        if (ticket && ticket.messages && ticket.messages.length > 0) {
          setActiveTicketId(ticket.id);
          renderFullChatHistory(ticket);
          const adminReplyCount = (ticket.messages || []).filter(m => m.sender === 'admin').length;
          const reply = `📂 <strong>Riwayat Percakapan Anda Berhasil Dimuat!</strong>\nSesi untuk <strong>${escapeHtml(ticket.userName)}</strong> (NPA: ${escapeHtml(ticket.userNpa || 'Tamu')}) telah aktif kembali.\n\n${adminReplyCount > 0 ? `✓ <strong>${adminReplyCount} balasan resmi dari Panitia KPKU</strong> telah ditampilkan di atas.` : 'Belum ada balasan baru dari admin. Tim Panitia sedang meninjau pesan Anda.'}\n\nAda hal lain yang dapat kami bantu?`;
          appendMessage(reply, 'bot', ['🟢 Hubungi Panitia via WA', '🎟️ Cara Klaim Token', '🗳️ Masuk Bilik Suara']);
          return;
        } else {
          const reply = `📂 <strong>Fitur Muat Riwayat Chat & Balasan Panitia</strong>\n\nUntuk memuat percakapan atau melihat balasan dari Panitia:\n1. Masukkan <strong>NPA 5-digit</strong> Anda (contoh: <code>01842</code>) pada panel di atas atau langsung ketikkan di chat ini.\n2. Sistem akan otomatis menghubungkan Anda dengan tiket pengaduan aktif.\n\nJika ini adalah pengaduan baru, silakan ketik pertanyaan Anda secara langsung.`;
          appendMessage(reply, 'bot', ['🔍 Cek Status DPT', '🎟️ Cara Klaim Token', '🟢 Hubungi Panitia via WA']);
          return;
        }
      }

      // Check if user entered a 5-digit NPA directly (e.g. "01842" or "npa 01842")
      if (detectedNpa && (trimmed.length <= 12 || /^\s*(npa\s*)?\d{5}\s*$/i.test(trimmed))) {
        const raw = localStorage.getItem(CHAT_STORAGE_KEY);
        let sessions = [];
        try { sessions = JSON.parse(raw || '[]'); } catch(e) {}
        const found = sessions.find(s => (s.userNpa || '') === detectedNpa);

        if (found) {
          setActiveTicketId(found.id);
          renderFullChatHistory(found);
          const adminReplyCount = (found.messages || []).filter(m => m.sender === 'admin').length;
          const reply = `✓ <strong>Tiket Ditemukan & Berhasil Dimuat!</strong>\nRiwayat pengaduan untuk <strong>${escapeHtml(found.userName)}</strong> (NPA: ${escapeHtml(found.userNpa)}) telah dipulihkan di atas.\n\n${adminReplyCount > 0 ? `✓ <strong>${adminReplyCount} balasan resmi Panitia KPKU</strong> tersedia.` : 'Status: Menunggu respon panitia.'}\nSilakan lanjutkan pesan Anda atau hubungi panitia melalui WhatsApp.`;
          appendMessage(reply, 'bot', ['🟢 Hubungi Panitia via WA', '🎟️ Cara Klaim Token', '🗳️ Masuk Bilik Suara']);
          syncVoterChatSession(trimmed, reply);
          return;
        } else {
          // Associate future messages with this detected NPA
          const identity = getVoterIdentity();
          identity.voterNpa = detectedNpa;
          const reply = `NPA <strong>${escapeHtml(detectedNpa)}</strong> telah dicatat untuk sesi percakapan Anda.\nBelum ada riwayat pengaduan sebelumnya untuk NPA ini. Silakan sampaikan pertanyaan atau kendala Anda di bawah, Panitia KPKU siap membantu!`;
          appendMessage(reply, 'bot', ['🎟️ Cara Klaim Token', '🔍 Cek Status DPT', '🟢 Hubungi Panitia via WA']);
          syncVoterChatSession(trimmed, reply);
          return;
        }
      }

      // Normal bot matching
      const match = findBotResponse(trimmed);
      appendMessage(match.reply, 'bot', match.chips, match.showWA ? trimmed : null);
      syncVoterChatSession(trimmed, match.reply);
    }, 600 + Math.random() * 400);
  }

  function findBotResponse(query) {
    const lower = query.toLowerCase();
    for (const item of BOT_KNOWLEDGE) {
      for (const kw of item.keywords) {
        if (lower.includes(kw)) {
          return item;
        }
      }
    }

    // Default Fallback
    const waUrl = `https://wa.me/${KPKU_WA_NUMBER}?text=${encodeURIComponent('Halo Panitia KPKU IAGI 2026, saya ingin menanyakan hal berikut:\n\n"' + query + '"')}`;
    return {
      reply: `Terima kasih atas pertanyaannya. Terkait pertanyaan <em>"${escapeHtml(query)}"</em>, Anda dapat memilih panduan cepat di bawah atau terhubung langsung dengan Tim Panitia Pelaksana KPKU melalui WhatsApp resmi kami:\n\n<a href="${waUrl}" target="_blank" rel="noopener noreferrer" class="bubble-wa-cta"><svg viewBox="0 0 24 24"><path fill="currentColor" d="M12.04 2c-5.46 0-9.91 4.45-9.91 9.91 0 1.75.46 3.45 1.32 4.95L2.05 22l5.25-1.38c1.45.79 3.08 1.21 4.74 1.21 5.46 0 9.91-4.45 9.91-9.91 0-2.65-1.03-5.14-2.9-7.01A9.816 9.816 0 0 0 12.04 2m.01 1.67c2.2 0 4.26.86 5.82 2.42a8.225 8.225 0 0 1 2.41 5.83c0 4.54-3.7 8.24-8.24 8.24-1.48 0-2.93-.4-4.2-1.15l-.3-.18-3.12.82.83-3.04-.2-.31a8.196 8.196 0 0 1-1.26-4.38c0-4.54 3.7-8.24 8.24-8.24m4.52 11.64c-.25-.13-1.47-.72-1.7-.81-.23-.08-.39-.13-.56.13-.17.25-.64.81-.79.97-.14.17-.29.19-.54.06-.25-.13-1.06-.39-2.02-1.25-.75-.67-1.26-1.5-1.4-1.75-.15-.25-.02-.39.11-.51.11-.11.25-.29.37-.44.13-.15.17-.25.25-.42.08-.17.04-.31-.02-.44-.06-.13-.56-1.35-.77-1.85-.2-.49-.41-.42-.56-.43h-.48c-.17 0-.44.06-.67.31-.23.25-.88.86-.88 2.1 0 1.24.9 2.44 1.03 2.61.13.17 1.78 2.72 4.31 3.81.6.26 1.07.42 1.44.54.61.19 1.16.17 1.6.1.49-.07 1.47-.6 1.68-1.18.21-.58.21-1.07.15-1.18-.06-.1-.23-.17-.48-.29z"/></svg><span>Chat WhatsApp Panitia Sekarang</span></a>`,
      chips: ['🔍 Cek Status DPT', '🎟️ Cara Klaim Token', '🗳️ Masuk Bilik Suara']
    };
  }

  function appendMessage(text, sender, chips = [], userQuery = null) {
    const msgContainer = document.getElementById('chat-messages');
    const typing = document.getElementById('chat-typing');
    if (!msgContainer) return;

    const now = new Date();
    const timeStr = String(now.getHours()).padStart(2, '0') + ':' + String(now.getMinutes()).padStart(2, '0') + ' WIB';

    const div = document.createElement('div');
    div.className = `chat-msg ${sender}`;

    let senderLabel = sender === 'user' ? 'Anda' : 'KPKU Support';
    let formattedText = text.replace(/\n/g, '<br>');

    let chipsHtml = '';
    if (chips && chips.length > 0) {
      chipsHtml = `<div class="chat-quick-chips">` + chips.map(c => {
        let q = c.replace(/^[^\w\s]+\s*/, '');
        return `<button type="button" class="chat-chip" onclick="window.sendChatQuery('${q}')">${c}</button>`;
      }).join('') + `</div>`;
    }

    let waButtonHtml = '';
    if (userQuery) {
      const waUrl = `https://wa.me/${KPKU_WA_NUMBER}?text=${encodeURIComponent('Halo Panitia KPKU IAGI 2026, saya ingin menanyakan terkait:\n"' + userQuery + '"')}`;
      waButtonHtml = `<a href="${waUrl}" target="_blank" rel="noopener noreferrer" class="bubble-wa-cta"><svg viewBox="0 0 24 24"><path fill="currentColor" d="M12.04 2c-5.46 0-9.91 4.45-9.91 9.91 0 1.75.46 3.45 1.32 4.95L2.05 22l5.25-1.38c1.45.79 3.08 1.21 4.74 1.21 5.46 0 9.91-4.45 9.91-9.91 0-2.65-1.03-5.14-2.9-7.01A9.816 9.816 0 0 0 12.04 2m.01 1.67c2.2 0 4.26.86 5.82 2.42a8.225 8.225 0 0 1 2.41 5.83c0 4.54-3.7 8.24-8.24 8.24-1.48 0-2.93-.4-4.2-1.15l-.3-.18-3.12.82.83-3.04-.2-.31a8.196 8.196 0 0 1-1.26-4.38c0-4.54 3.7-8.24 8.24-8.24m4.52 11.64c-.25-.13-1.47-.72-1.7-.81-.23-.08-.39-.13-.56.13-.17.25-.64.81-.79.97-.14.17-.29.19-.54.06-.25-.13-1.06-.39-2.02-1.25-.75-.67-1.26-1.5-1.4-1.75-.15-.25-.02-.39.11-.51.11-.11.25-.29.37-.44.13-.15.17-.25.25-.42.08-.17.04-.31-.02-.44-.06-.13-.56-1.35-.77-1.85-.2-.49-.41-.42-.56-.43h-.48c-.17 0-.44.06-.67.31-.23.25-.88.86-.88 2.1 0 1.24.9 2.44 1.03 2.61.13.17 1.78 2.72 4.31 3.81.6.26 1.07.42 1.44.54.61.19 1.16.17 1.6.1.49-.07 1.47-.6 1.68-1.18.21-.58.21-1.07.15-1.18-.06-.1-.23-.17-.48-.29z"/></svg><span>Hubungi WhatsApp Panitia (+62 811-158-1461)</span></a>`;
    }

    div.innerHTML = `
      <span class="msg-sender-tag">${senderLabel}</span>
      <div class="msg-bubble">
        ${formattedText}
        ${waButtonHtml}
        ${chipsHtml}
      </div>
      <span class="msg-time">${timeStr}</span>
    `;

    if (typing) {
      msgContainer.insertBefore(div, typing);
    } else {
      msgContainer.appendChild(div);
    }

    msgContainer.scrollTop = msgContainer.scrollHeight;
  }

  function showTyping(show) {
    const typing = document.getElementById('chat-typing');
    if (!typing) return;
    if (show) {
      typing.classList.add('active');
    } else {
      typing.classList.remove('active');
    }
    const msgContainer = document.getElementById('chat-messages');
    if (msgContainer) msgContainer.scrollTop = msgContainer.scrollHeight;
  }

  function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  }

  // Global handler for chips
  window.sendChatQuery = function(text) {
    handleUserSend(text);
  };

  window.openKPKULiveChat = function() {
    toggleChatWindow(true);
  };

  window.openRestorePanel = function() {
    const panel = document.getElementById('chat-restore-panel');
    if (panel) {
      panel.style.display = 'block';
      const restoreInput = document.getElementById('restore-npa-input');
      if (restoreInput) {
        const id = getVoterIdentity();
        if (id.voterNpa && id.voterNpa !== 'Tamu') restoreInput.value = id.voterNpa;
        setTimeout(() => restoreInput.focus(), 80);
      }
    }
  };

  // Auto initialize on DOM ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      initLiveChat();
      restoreChatSession();
      checkForAdminReplies();
      if (window.location.hash === '#chat' || window.location.hash === '#livechat') {
        setTimeout(() => toggleChatWindow(true), 350);
      }
    });
  } else {
    initLiveChat();
    restoreChatSession();
    checkForAdminReplies();
    if (window.location.hash === '#chat' || window.location.hash === '#livechat') {
      setTimeout(() => toggleChatWindow(true), 350);
    }
  }

  // Cross-tab real-time listener for admin replies
  window.addEventListener('storage', (e) => {
    if (e.key === CHAT_STORAGE_KEY) {
      checkForAdminReplies();
    }
  });

  // Periodic fallback check
  setInterval(checkForAdminReplies, 2500);
})();
