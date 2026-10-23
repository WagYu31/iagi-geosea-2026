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

        <!-- Messages Stream -->
        <div class="kpku-chat-messages" id="chat-messages">
          <!-- Initial Welcome Message -->
          <div class="chat-msg bot">
            <span class="msg-sender-tag">KPKU Support</span>
            <div class="msg-bubble">
              Halo Rekan Geolog! 👋 Selamat datang di <strong>Layanan Bantuan Resmi Pemilu IAGI 2026</strong>.
              <br><br>
              Ada yang bisa kami bantu terkait Cek DPT, Klaim Token Surat Suara, atau Masuk Bilik Suara?
              <div class="chat-quick-chips">
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
  }

  function toggleChatWindow(show) {
    const win = document.getElementById('chat-window');
    const overlay = document.getElementById('chat-overlay');
    if (!win) return;

    if (show) {
      win.classList.add('active');
      if (overlay) overlay.classList.add('active');
      const input = document.getElementById('chat-input');
      if (input && window.innerWidth > 480) input.focus();
    } else {
      win.classList.remove('active');
      if (overlay) overlay.classList.remove('active');
    }
  }

  function handleUserSend(text) {
    appendMessage(text, 'user');
    showTyping(true);

    setTimeout(() => {
      showTyping(false);
      const match = findBotResponse(text);
      appendMessage(match.reply, 'bot', match.chips, match.showWA ? text : null);
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

  // Auto initialize on DOM ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initLiveChat);
  } else {
    initLiveChat();
  }
})();
