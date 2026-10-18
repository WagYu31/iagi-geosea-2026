/**
 * Pemilu IAGI 2026 - Main Application Logic & Mobile PWA Controller
 * Komisi Pemilihan Ketua Umum (KPKU) IAGI
 */

document.addEventListener('DOMContentLoaded', () => {
  // PWA Service Worker Registration
  if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
      navigator.serviceWorker.register('./sw.js')
        .then((reg) => console.log('PWA ServiceWorker registered:', reg.scope))
        .catch((err) => console.log('PWA ServiceWorker registration failed:', err));
    });
  }

  // PWA Install Prompt Capture
  let deferredInstallPrompt = null;
  const pwaPromptBanner = document.getElementById('pwa-prompt-banner');
  const btnInstallPwa = document.getElementById('btn-install-pwa');

  window.addEventListener('beforeinstallprompt', (e) => {
    e.preventDefault();
    deferredInstallPrompt = e;
    if (pwaPromptBanner) {
      pwaPromptBanner.style.display = 'flex';
    }
  });

  if (btnInstallPwa) {
    btnInstallPwa.addEventListener('click', async () => {
      if (deferredInstallPrompt) {
        deferredInstallPrompt.prompt();
        const { outcome } = await deferredInstallPrompt.userChoice;
        console.log(`PWA install choice: ${outcome}`);
        deferredInstallPrompt = null;
        if (pwaPromptBanner) pwaPromptBanner.style.display = 'none';
      }
    });
  }

  // Tactile Haptic Feedback
  function triggerHaptic(type = 'light') {
    if ('vibrate' in navigator) {
      if (type === 'light') navigator.vibrate(15);
      else if (type === 'medium') navigator.vibrate([25, 40]);
      else if (type === 'success') navigator.vibrate([20, 30, 20]);
    }
  }

  // Master Countdown Timer
  function initCountdown() {
    const targetDate = new Date(ELECTION_CONFIG.votingEndDate).getTime();
    const daysEl = document.getElementById('timer-days');
    const hoursEl = document.getElementById('timer-hours');
    const minsEl = document.getElementById('timer-mins');
    const secsEl = document.getElementById('timer-secs');

    function update() {
      const now = Date.now();
      const diff = targetDate - now;

      if (diff <= 0) {
        if (daysEl) daysEl.innerText = '00';
        if (hoursEl) hoursEl.innerText = '00';
        if (minsEl) minsEl.innerText = '00';
        if (secsEl) secsEl.innerText = '00';
        return;
      }

      const d = Math.floor(diff / (1000 * 60 * 60 * 24));
      const h = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const m = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const s = Math.floor((diff % (1000 * 60)) / 1000);

      if (daysEl) daysEl.innerText = String(d).padStart(2, '0');
      if (hoursEl) hoursEl.innerText = String(h).padStart(2, '0');
      if (minsEl) minsEl.innerText = String(m).padStart(2, '0');
      if (secsEl) secsEl.innerText = String(s).padStart(2, '0');
    }

    update();
    setInterval(update, 1000);
  }
  initCountdown();

  // Screen Routing System
  const screens = {
    home: document.getElementById('screen-home'),
    dpt: document.getElementById('screen-dpt'),
    claim: document.getElementById('screen-claim'),
    vote: document.getElementById('screen-vote'),
    receipt: document.getElementById('screen-receipt'),
    admin: document.getElementById('screen-admin')
  };

  const navItems = document.querySelectorAll('.nav-item');

  function navigateTo(screenId, params = {}) {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    triggerHaptic('light');

    Object.keys(screens).forEach(key => {
      if (screens[key]) screens[key].classList.remove('active');
    });

    if (screens[screenId]) {
      screens[screenId].classList.add('active');
    }

    navItems.forEach(item => {
      if (item.getAttribute('data-screen') === screenId) {
        item.classList.add('active');
      } else {
        item.classList.remove('active');
      }
    });

    // Update URL hash
    window.location.hash = screenId;

    // Special screen initializations
    if (screenId === 'vote') {
      setupVotingScreen(params);
    } else if (screenId === 'admin') {
      renderAdminDashboard();
    } else if (screenId === 'dpt') {
      renderDptScreen();
    }
  }

  // Handle URL hash changes & direct deep links
  function handleHashChange() {
    const hash = window.location.hash.replace('#', '') || 'home';
    const urlParams = new URLSearchParams(window.location.search);
    const code = urlParams.get('code');
    const npa = urlParams.get('npa');

    if (hash === 'vote' || (code && npa)) {
      navigateTo('vote', { code, npa });
    } else if (screens[hash]) {
      navigateTo(hash);
    } else {
      navigateTo('home');
    }
  }

  window.addEventListener('hashchange', handleHashChange);

  // Bottom Navigation Click Handlers
  navItems.forEach(item => {
    item.addEventListener('click', (e) => {
      e.preventDefault();
      const screenId = item.getAttribute('data-screen');
      navigateTo(screenId);
    });
  });

  // Action links on Home or headers
  document.querySelectorAll('[data-nav]').forEach(el => {
    el.addEventListener('click', (e) => {
      e.preventDefault();
      const target = el.getAttribute('data-nav');
      navigateTo(target);
    });
  });

  // ================= MODUL 1: CEK DPT ONLINE =================
  const dptSearchInput = document.getElementById('dpt-search-input');
  const dptResultsContainer = document.getElementById('dpt-results-container');
  const dptTotalCountEl = document.getElementById('dpt-total-count');

  function renderDptScreen() {
    const dpt = window.pemiluStorage.getDPT();
    if (dptTotalCountEl) dptTotalCountEl.innerText = `${dpt.length} Anggota Terdaftar`;
    renderDptList(dpt.slice(0, 10)); // Show top 10 initially
  }

  function renderDptList(voters) {
    if (!dptResultsContainer) return;
    if (voters.length === 0) {
      dptResultsContainer.innerHTML = `
        <div style="text-align:center; padding: 28px; color: var(--text-muted); font-size: 0.85rem;">
          <div style="margin-bottom: 10px;">
            <svg style="width:36px;height:36px;stroke:var(--gold-text);fill:none;stroke-width:1.5;" viewBox="0 0 24 24"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
          </div>
          Tidak ditemukan data anggota yang cocok dengan kata kunci pencarian.<br>
          <span style="font-size: 0.74rem; color: var(--text-subtle); margin-top:4px; display:inline-block;">Pastikan pengetikan Nama lengkap atau NPA sudah sesuai.</span>
        </div>
      `;
      return;
    }

    dptResultsContainer.innerHTML = voters.map(v => {
      let statusBadge = '<span class="badge-status badge-unclaimed">✓ Belum Klaim</span>';
      if (v.voted) {
        statusBadge = '<span class="badge-status badge-voted">✓ Sudah Memilih</span>';
      } else if (v.claimed) {
        statusBadge = '<span class="badge-status badge-claimed">✓ Token Aktif</span>';
      }

      // Mask email for privacy (e.g. ab***@gmail.com)
      const emailParts = (v.email || '').split('@');
      const maskedEmail = emailParts.length === 2 
        ? `${emailParts[0].substring(0, 2)}***@${emailParts[1]}` 
        : '***';

      return `
        <div class="dpt-result-card">
          <div class="dpt-header">
            <span class="dpt-name">${v.name}</span>
            <span class="dpt-npa">${v.npa}</span>
          </div>
          <div class="dpt-meta">
            <span style="display:inline-flex;align-items:center;gap:4px;"><svg style="width:12px;height:12px;stroke:currentColor;fill:none;stroke-width:2;" viewBox="0 0 24 24"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg> Pengda ${v.pengda || 'Pusat'}</span>
            <span style="display:inline-flex;align-items:center;gap:4px;"><svg style="width:12px;height:12px;stroke:currentColor;fill:none;stroke-width:2;" viewBox="0 0 24 24"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path><polyline points="22,6 12,13 2,6"></polyline></svg> ${maskedEmail}</span>
            <span style="display:inline-flex;align-items:center;gap:4px;"><svg style="width:12px;height:12px;stroke:currentColor;fill:none;stroke-width:2;" viewBox="0 0 24 24"><path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z"></path><line x1="7" y1="7" x2="7.01" y2="7"></line></svg> ${v.category || 'Anggota'}</span>
            ${statusBadge}
          </div>
          ${!v.voted ? `
            <div style="margin-top: 8px; display: flex; justify-content: flex-end;">
              <button class="btn btn-subtle btn-sm-action" style="width: auto; padding: 6px 14px; font-size: 0.74rem;" onclick="prefillClaim('${v.npa}', '${v.name.replace(/'/g, "\\'")}', '${v.email}')">
                <span>Klaim Surat Suara</span>
                <svg style="width:12px;height:12px;stroke:currentColor;fill:none;stroke-width:2.5;" viewBox="0 0 24 24"><line x1="5" y1="12" x2="19" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline></svg>
              </button>
            </div>
          ` : ''}
        </div>
      `;
    }).join('');
  }

  if (dptSearchInput) {
    dptSearchInput.addEventListener('input', (e) => {
      const q = e.target.value;
      if (!q.trim()) {
        renderDptScreen();
        return;
      }
      const results = window.pemiluStorage.findVoter(q);
      renderDptList(results);
    });
  }

  // Helper window function for prefilling claim from DPT search
  window.prefillClaim = (npa, name, email) => {
    navigateTo('claim');
    const npaInput = document.getElementById('claim-npa');
    const nameInput = document.getElementById('claim-name');
    const emailInput = document.getElementById('claim-email');
    if (npaInput) npaInput.value = npa;
    if (nameInput) nameInput.value = name;
    if (emailInput) emailInput.value = email;
  };

  // ================= MODUL 2: KLAIM SURAT SUARA =================
  const formClaim = document.getElementById('form-claim');
  const claimAlert = document.getElementById('claim-alert');

  if (formClaim) {
    formClaim.addEventListener('submit', (e) => {
      e.preventDefault();
      triggerHaptic('medium');

      const npa = document.getElementById('claim-npa').value.trim();
      const name = document.getElementById('claim-name').value.trim();
      const email = document.getElementById('claim-email').value.trim();

      const result = window.pemiluStorage.claimSuratSuara(npa, name, email);

      if (!result.success) {
        showAlert(claimAlert, result.error, 'error');
        triggerHaptic('error');
        return;
      }

      // Success claiming token!
      showAlert(claimAlert, result.message, 'success');
      triggerHaptic('success');

      // Show simulated email sheet modal so mobile user can see magic link & copy token immediately
      showEmailSimulationModal(result.voter, result.token);
    });
  }

  // Simulated Email Modal
  const modalEmailSim = document.getElementById('modal-email-sim');
  const simEmailRecipient = document.getElementById('sim-email-recipient');
  const simEmailToken = document.getElementById('sim-email-token');
  const simBtnOpenVote = document.getElementById('sim-btn-open-vote');
  const simBtnCopyCode = document.getElementById('sim-btn-copy-code');

  function showEmailSimulationModal(voter, token) {
    if (!modalEmailSim) return;
    if (simEmailRecipient) simEmailRecipient.innerText = `${voter.name} (${voter.email})`;
    if (simEmailToken) simEmailToken.innerText = token;

    if (simBtnOpenVote) {
      simBtnOpenVote.onclick = () => {
        closeAllModals();
        navigateTo('vote', { npa: voter.npa, code: token });
      };
    }

    if (simBtnCopyCode) {
      simBtnCopyCode.onclick = () => {
        navigator.clipboard.writeText(token);
        simBtnCopyCode.innerHTML = `
          <svg style="width:14px;height:14px;stroke:#10B981;fill:none;stroke-width:2.5;" viewBox="0 0 24 24"><polyline points="20 6 9 17 4 12"></polyline></svg>
          <span style="color:#10B981;font-weight:800;">Kode Disalin!</span>
        `;
        setTimeout(() => {
          simBtnCopyCode.innerHTML = `
            <svg style="width:14px;height:14px;stroke:currentColor;fill:none;stroke-width:2;" viewBox="0 0 24 24"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path></svg>
            <span>Salin Kode</span>
          `;
        }, 2000);
      };
    }

    modalEmailSim.classList.add('open');
  }

  // ================= MODUL 3: BILIK SUARA (VOTE NOW) =================
  const voteAuthCard = document.getElementById('vote-auth-card');
  const voteBallotCard = document.getElementById('vote-ballot-card');
  const voteFormAuth = document.getElementById('form-vote-auth');
  const voteAuthAlert = document.getElementById('vote-auth-alert');
  const voterBadgeName = document.getElementById('voter-badge-name');
  const voterBadgeNpa = document.getElementById('voter-badge-npa');
  const candidateListContainer = document.getElementById('candidate-list-container');
  const btnSubmitVote = document.getElementById('btn-submit-vote');

  let currentVoter = null;
  let currentToken = null;
  let selectedCandidateId = null;

  window.autoFillDemoVote = () => {
    const dpt = window.pemiluStorage.getDPT();
    let demoVoter = dpt.find(v => v.npa === 'IAGI-2024-0001');
    if (demoVoter) {
      demoVoter.claimed = true;
      demoVoter.token = 'IAGI-2026-DEMO-2026';
      demoVoter.voted = false; // Reset for repeatable test
      window.pemiluStorage.saveDPT(dpt);
    }
    const npaInput = document.getElementById('vote-npa');
    const tokenInput = document.getElementById('vote-token');
    if (npaInput) npaInput.value = 'IAGI-2024-0001';
    if (tokenInput) tokenInput.value = 'IAGI-2026-DEMO-2026';
    triggerHaptic('medium');
    if (voteFormAuth) {
      voteFormAuth.dispatchEvent(new Event('submit', { cancelable: true, bubbles: true }));
    }
  };

  function setupVotingScreen(params = {}) {
    // Reset state
    selectedCandidateId = null;
    if (btnSubmitVote) {
      btnSubmitVote.disabled = true;
      btnSubmitVote.innerText = 'Pilih Salah Satu Calon Ketua Umum';
    }

    const npaInput = document.getElementById('vote-npa');
    const codeInput = document.getElementById('vote-token');

    if (params.npa && npaInput) npaInput.value = params.npa;
    if (params.code && codeInput) codeInput.value = params.code;

    // Auto verify if both params exist
    if (params.npa && params.code) {
      handleVerifyVoteAuth(params.npa, params.code);
    } else {
      // Show auth form
      if (voteAuthCard) voteAuthCard.style.display = 'block';
      if (voteBallotCard) voteBallotCard.style.display = 'none';
    }
  }

  function handleVerifyVoteAuth(npa, token) {
    const verification = window.pemiluStorage.verifyVotingEligibility(npa, token);
    if (!verification.valid) {
      showAlert(voteAuthAlert, verification.error, 'error');
      triggerHaptic('error');
      if (voteAuthCard) voteAuthCard.style.display = 'block';
      if (voteBallotCard) voteBallotCard.style.display = 'none';
      return;
    }

    currentVoter = verification.voter;
    currentToken = token;

    if (voterBadgeName) voterBadgeName.innerText = currentVoter.name;
    if (voterBadgeNpa) voterBadgeNpa.innerText = currentVoter.npa;

    // Hide auth, show official digital ballot!
    if (voteAuthCard) voteAuthCard.style.display = 'none';
    if (voteBallotCard) voteBallotCard.style.display = 'block';

    renderCandidateCards();
    triggerHaptic('success');
  }

  if (voteFormAuth) {
    voteFormAuth.addEventListener('submit', (e) => {
      e.preventDefault();
      const npa = document.getElementById('vote-npa').value.trim();
      const token = document.getElementById('vote-token').value.trim();
      handleVerifyVoteAuth(npa, token);
    });
  }

  // Render 3 Candidate Cards in Ballot
  function renderCandidateCards() {
    if (!candidateListContainer) return;

    candidateListContainer.innerHTML = CANDIDATES.map(c => `
      <div class="candidate-card" id="candidate-card-${c.id}" onclick="selectCandidate(${c.id})">
        <div class="candidate-header">
          <div class="candidate-number-badge">${c.number}</div>
          <span class="selected-indicator">✓ TERPILIH</span>
        </div>
        <div class="candidate-body">
          <img src="${c.photo}" alt="${c.name}" class="candidate-avatar">
          <div class="candidate-info">
            <h4 class="candidate-name">${c.name}</h4>
            <div class="candidate-title">${c.title}</div>
            <div class="candidate-tagline">"${c.tagline}"</div>
          </div>
        </div>
        <div class="candidate-footer">
          <button type="button" class="btn-detail-link" onclick="event.stopPropagation(); showCandidateDetailModal(${c.id})">
            <svg style="width:14px;height:14px;stroke:currentColor;fill:none;stroke-width:2;" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="16" x2="12" y2="12"></line><line x1="12" y1="8" x2="12.01" y2="8"></line></svg>
            <span>Visi, Misi & Gagasan</span>
          </button>
          <div class="vote-radio-btn" id="radio-label-${c.id}">
            Coblos Calon ${c.number}
          </div>
        </div>
      </div>
    `).join('');
  }

  window.selectCandidate = (candidateId) => {
    triggerHaptic('medium');
    selectedCandidateId = candidateId;

    // Update active classes
    document.querySelectorAll('.candidate-card').forEach(card => {
      card.classList.remove('selected');
    });

    const activeCard = document.getElementById(`candidate-card-${candidateId}`);
    if (activeCard) {
      activeCard.classList.add('selected');
    }

    const candidate = CANDIDATES.find(c => c.id === candidateId);
    if (btnSubmitVote && candidate) {
      btnSubmitVote.disabled = false;
      btnSubmitVote.innerText = `SUBMIT PILIHAN: CALON ${candidate.number}`;
    }
  };

  // Submit button -> triggers mandatory Dual-Confirmation Modal
  const modalDualConfirm = document.getElementById('modal-dual-confirm');
  const confirmCandidateAvatar = document.getElementById('confirm-candidate-avatar');
  const confirmCandidateNumber = document.getElementById('confirm-candidate-number');
  const confirmCandidateName = document.getElementById('confirm-candidate-name');
  const btnConfirmYes = document.getElementById('btn-confirm-yes');
  const btnConfirmNo = document.getElementById('btn-confirm-no');

  if (btnSubmitVote) {
    btnSubmitVote.addEventListener('click', () => {
      if (!selectedCandidateId || !currentVoter || !currentToken) return;

      const candidate = CANDIDATES.find(c => c.id === selectedCandidateId);
      if (!candidate) return;

      if (confirmCandidateAvatar) confirmCandidateAvatar.src = candidate.photo;
      if (confirmCandidateNumber) confirmCandidateNumber.innerText = `Nomor Urut ${candidate.number}`;
      if (confirmCandidateName) confirmCandidateName.innerText = candidate.name;

      if (modalDualConfirm) modalDualConfirm.classList.add('open');
      triggerHaptic('medium');
    });
  }

  if (btnConfirmNo) {
    btnConfirmNo.addEventListener('click', () => {
      // Mandat KPKU: "Jika memilih TIDAK, maka akan kembali lagi ke tampilan nomor urut – foto – nama lengkap dari ketiga Caketum IAGI untuk memilih kembali"
      if (modalDualConfirm) modalDualConfirm.classList.remove('open');
      triggerHaptic('light');
    });
  }

  if (btnConfirmYes) {
    btnConfirmYes.addEventListener('click', async () => {
      btnConfirmYes.disabled = true;
      btnConfirmYes.innerText = 'Merekam Suara...';

      const result = await window.pemiluStorage.castVote(currentVoter.npa, currentToken, selectedCandidateId);

      btnConfirmYes.disabled = false;
      btnConfirmYes.innerText = 'YA, SAYA YAKIN';
      if (modalDualConfirm) modalDualConfirm.classList.remove('open');

      if (!result.success) {
        alert(result.error);
        return;
      }

      triggerHaptic('success');
      showReceiptScreen(result.receipt);
    });
  }

  // ================= MODUL 4: DIGITAL RECEIPT (TANDA TERIMA) =================
  function showReceiptScreen(receipt) {
    navigateTo('receipt');

    const receiptName = document.getElementById('receipt-name');
    const receiptNpa = document.getElementById('receipt-npa');
    const receiptDate = document.getElementById('receipt-date');
    const receiptHash = document.getElementById('receipt-hash');
    const receiptFullHash = document.getElementById('receipt-full-hash');

    if (receiptName) receiptName.innerText = receipt.voterName;
    if (receiptNpa) receiptNpa.innerText = receipt.npa;
    if (receiptDate) receiptDate.innerText = new Date(receipt.votedAt).toLocaleString('id-ID', { dateStyle: 'full', timeStyle: 'medium' });
    if (receiptHash) receiptHash.innerText = receipt.receiptHash;
    if (receiptFullHash) receiptFullHash.innerText = receipt.fullHash;
  }

  const btnPrintReceipt = document.getElementById('btn-print-receipt');
  if (btnPrintReceipt) {
    btnPrintReceipt.addEventListener('click', () => {
      window.print();
    });
  }

  // ================= MODUL 5: CANDIDATE DETAIL MODAL =================
  const modalCandidateDetail = document.getElementById('modal-candidate-detail');
  const candidateDetailContent = document.getElementById('candidate-detail-content');

  window.showCandidateDetailModal = (candidateId) => {
    const c = CANDIDATES.find(item => item.id === candidateId);
    if (!c || !modalCandidateDetail || !candidateDetailContent) return;

    candidateDetailContent.innerHTML = `
      <div style="display:flex; gap: 14px; align-items:center; margin-bottom: 12px;">
        <img src="${c.photo}" style="width: 75px; height: 75px; border-radius: var(--radius-md); object-fit: cover; border: 2px solid ${c.accentColor};" alt="${c.name}">
        <div>
          <div style="font-family: var(--font-mono); font-size: 0.8rem; font-weight:800; color:${c.accentColor};">${c.badge}</div>
          <h3 style="font-size: 0.95rem; font-weight:800; color:var(--text-pure);">${c.name}</h3>
          <div style="font-size: 0.74rem; color:var(--text-muted);">${c.title}</div>
        </div>
      </div>

      <div style="margin-bottom: 12px; background: rgba(9,13,22,0.6); padding: 10px; border-radius: var(--radius-sm); border-left: 3px solid ${c.accentColor};">
        <strong style="font-size: 0.75rem; color:${c.accentColor}; display:block; margin-bottom: 2px;">VISI RESMI</strong>
        <p style="font-size: 0.78rem; color: var(--text-pure); line-height:1.45;">"${c.vision}"</p>
      </div>

      <div style="margin-bottom: 12px;">
        <strong style="font-size: 0.75rem; color:${c.accentColor}; display:block; margin-bottom: 4px;">4 MISI PRIORITAS</strong>
        <ul style="padding-left: 18px; font-size: 0.76rem; color: var(--text-muted); line-height: 1.45;">
          ${c.missions.map(m => `<li style="margin-bottom: 4px;">${m}</li>`).join('')}
        </ul>
      </div>

      <div style="font-size: 0.74rem; color: var(--text-subtle); border-top: 1px solid var(--border-subtle); padding-top: 8px;">
        <strong>Rekam Jejak:</strong> ${c.experience}<br>
        <strong>Pendidikan:</strong> ${c.education}
      </div>
    `;

    modalCandidateDetail.classList.add('open');
    triggerHaptic('light');
  };

  // ================= MODUL 6: KPKU COMMAND CENTER (ADMIN) =================
  const adminPinGate = document.getElementById('admin-pin-gate');
  const adminDashboardContent = document.getElementById('admin-dashboard-content');
  const adminPinForm = document.getElementById('form-admin-pin');
  const adminPinAlert = document.getElementById('admin-pin-alert');

  let isAdminAuthenticated = false;

  function unlockAdmin(pin) {
    const settings = window.pemiluStorage.getSettings();
    if (pin === settings.adminPin) {
      isAdminAuthenticated = true;
      if (adminPinGate) adminPinGate.style.display = 'none';
      if (adminDashboardContent) adminDashboardContent.style.display = 'block';
      renderAdminDashboard();
      triggerHaptic('success');
      return true;
    } else {
      showAlert(adminPinAlert, 'PIN Panitia salah! Gunakan PIN default: 2026', 'error');
      triggerHaptic('error');
      return false;
    }
  }

  if (adminPinForm) {
    adminPinForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const pin = document.getElementById('admin-pin-input').value.trim();
      unlockAdmin(pin);
    });
  }

  const btnSubmitAdminPin = document.getElementById('btn-submit-admin-pin');
  if (btnSubmitAdminPin) {
    btnSubmitAdminPin.addEventListener('click', (e) => {
      const pinInput = document.getElementById('admin-pin-input');
      const pin = pinInput ? pinInput.value.trim() : '';
      if (pin) {
        e.preventDefault();
        unlockAdmin(pin);
      }
    });
  }

  const btnQuickFillAdmin = document.getElementById('btn-quick-fill-admin-pin');
  if (btnQuickFillAdmin) {
    btnQuickFillAdmin.addEventListener('click', (e) => {
      e.preventDefault();
      const pinInput = document.getElementById('admin-pin-input');
      if (pinInput) pinInput.value = '2026';
      unlockAdmin('2026');
    });
  }

  function renderAdminDashboard() {
    if (!isAdminAuthenticated) {
      if (adminPinGate) adminPinGate.style.display = 'block';
      if (adminDashboardContent) adminDashboardContent.style.display = 'none';
      return;
    }

    const results = window.pemiluStorage.getResults();
    const settings = window.pemiluStorage.getSettings();

    // Stats
    const statDpt = document.getElementById('admin-stat-dpt');
    const statClaimed = document.getElementById('admin-stat-claimed');
    const statVoted = document.getElementById('admin-stat-voted');
    const statTurnout = document.getElementById('admin-stat-turnout');

    if (statDpt) statDpt.innerText = results.totalDPT;
    if (statClaimed) statClaimed.innerText = `${results.totalClaimed} (${results.claimPercentage}%)`;
    if (statVoted) statVoted.innerText = results.totalVotes;
    if (statTurnout) statTurnout.innerText = `${results.turnoutPercentage}%`;

    // Sealed state
    const sealedBanner = document.getElementById('admin-sealed-banner');
    const unsealedResults = document.getElementById('admin-unsealed-results');
    const btnToggleSeal = document.getElementById('btn-toggle-seal');

    if (settings.isSealed) {
      if (sealedBanner) sealedBanner.style.display = 'block';
      if (unsealedResults) unsealedResults.style.display = 'none';
      if (btnToggleSeal) {
        btnToggleSeal.innerHTML = `
          <svg style="width:14px;height:14px;stroke:currentColor;fill:none;stroke-width:2;" viewBox="0 0 24 24"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 9.9-1"></path></svg>
          <span>Buka Segel Pleno (Unseal Live Count)</span>
        `;
        btnToggleSeal.className = 'btn btn-gold';
      }
    } else {
      if (sealedBanner) sealedBanner.style.display = 'none';
      if (unsealedResults) unsealedResults.style.display = 'block';
      if (btnToggleSeal) {
        btnToggleSeal.innerHTML = `
          <svg style="width:14px;height:14px;stroke:currentColor;fill:none;stroke-width:2;" viewBox="0 0 24 24"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path></svg>
          <span>Pasang Segel Kembali (Lock Vault)</span>
        `;
        btnToggleSeal.className = 'btn btn-outline';
      }
      renderLiveCountCharts(results);
    }

    // Render DPT table in Admin
    renderAdminDptTable();
    // Render Audit Trail
    renderAdminAuditTrail();
  }

  function renderLiveCountCharts(results) {
    const total = results.totalVotes || 1; // avoid / 0
    CANDIDATES.forEach(c => {
      const votes = results.counts[c.id] || 0;
      const pct = results.totalVotes > 0 ? ((votes / results.totalVotes) * 100).toFixed(1) : 0;

      const barEl = document.getElementById(`chart-bar-${c.id}`);
      const valEl = document.getElementById(`chart-val-${c.id}`);
      const pctEl = document.getElementById(`chart-pct-${c.id}`);

      if (barEl) barEl.style.width = `${pct}%`;
      if (valEl) valEl.innerText = `${votes} Suara`;
      if (pctEl) pctEl.innerText = `${pct}%`;
    });
  }

  const btnToggleSeal = document.getElementById('btn-toggle-seal');
  if (btnToggleSeal) {
    btnToggleSeal.addEventListener('click', () => {
      const settings = window.pemiluStorage.getSettings();
      const nextState = !settings.isSealed;

      if (nextState === false) {
        if (!confirm('PERINGATAN PLENO KPKU:\nApakah Anda yakin ingin MEMBUKA SEGEL perolehan suara? Aksi ini akan menampilkan hasil quick count secara terbuka.')) {
          return;
        }
      }

      window.pemiluStorage.updateSettings({ isSealed: nextState });
      triggerHaptic('medium');
      renderAdminDashboard();
    });
  }

  function renderAdminDptTable() {
    const tableBody = document.getElementById('admin-dpt-table-body');
    if (!tableBody) return;
    const dpt = window.pemiluStorage.getDPT();

    tableBody.innerHTML = dpt.map(v => `
      <tr style="border-bottom: 1px solid var(--border-subtle); font-size: 0.72rem;">
        <td style="padding: 8px 6px; font-family: var(--font-mono); color: var(--gold-primary);">${v.npa}</td>
        <td style="padding: 8px 6px; font-weight: 600; color: var(--text-pure);">${v.name}</td>
        <td style="padding: 8px 6px;">
          ${v.voted 
            ? '<span style="color: #F87171; font-weight: 700;">✓ VOTED</span>' 
            : v.claimed 
              ? '<span style="color: #FBBF24; font-weight: 600;">TOKEN: ' + v.token + '</span>' 
              : '<span style="color: #34D399;">Belum Klaim</span>'
          }
        </td>
      </tr>
    `).join('');
  }

  function renderAdminAuditTrail() {
    const auditContainer = document.getElementById('admin-audit-logs');
    if (!auditContainer) return;
    const logs = window.pemiluStorage.getAuditLogs();

    auditContainer.innerHTML = logs.slice(0, 15).map(log => `
      <div style="font-size: 0.7rem; padding: 6px 0; border-bottom: 1px solid var(--border-subtle); color: var(--text-muted);">
        <span style="font-family: var(--font-mono); color: var(--gold-primary); font-size: 0.65rem;">
          [${new Date(log.timestamp).toLocaleTimeString('id-ID')}]
        </span>
        <strong style="color: var(--text-pure); margin-left: 4px;">${log.action}:</strong> ${log.details}
      </div>
    `).join('');
  }

  // Admin Reset Button (For Demo and Testing)
  const btnResetDemo = document.getElementById('btn-reset-demo-data');
  if (btnResetDemo) {
    btnResetDemo.addEventListener('click', () => {
      if (confirm('PERHATIAN:\nApakah Anda yakin ingin MENGHAPUS SEMUA DATA suara dan mengembalikan ke data awal? Semua suara yang telah dicoblos akan di-reset.')) {
        window.pemiluStorage.resetAllData();
        triggerHaptic('success');
        alert('Semua data Pemilu IAGI 2026 berhasil di-reset kembali ke status default KPKU.');
        renderAdminDashboard();
        renderDptScreen();
      }
    });
  }

  // ================= GENERAL HELPERS =================
  function showAlert(container, msg, type = 'info') {
    if (!container) return;
    container.style.display = 'block';
    container.className = `alert alert-${type}`;
    container.innerHTML = `
      <span>${type === 'error' ? '⚠️' : type === 'success' ? '✅' : 'ℹ️'}</span>
      <span>${msg}</span>
    `;
    setTimeout(() => {
      container.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }, 100);
  }

  function closeAllModals() {
    document.querySelectorAll('.modal-overlay').forEach(modal => {
      modal.classList.remove('open');
    });
  }

  // Close modals on clicking overlay or close button
  document.querySelectorAll('.btn-close-modal').forEach(btn => {
    btn.addEventListener('click', closeAllModals);
  });

  document.querySelectorAll('.modal-overlay').forEach(overlay => {
    overlay.addEventListener('click', (e) => {
      if (e.target === overlay) closeAllModals();
    });
  });

  // Initial routing based on URL
  handleHashChange();
});
