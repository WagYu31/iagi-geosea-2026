/**
 * KPKU Security Guard & Dual-Control Access System
 * Handles elevated privilege verification and dual-control request flows.
 */
(function() {
  window.currentPermRequest = null;
  window.permPollingInterval = null;
  window.approvedFeatureSession = {};

  // Check whether active session has authorization privileges
  window.isCurrentSuperAdmin = function() {
    try {
      const session = (window.pemiluStorage && typeof window.pemiluStorage.getAdminSession === 'function')
        ? window.pemiluStorage.getAdminSession()
        : null;
      if (!session) return false;
      return Boolean(session.is_super || session.can_authorize);
    } catch (e) {
      return false;
    }
  };

  // Guard execution of restricted features via Dual-Control
  window.guardSuperAdminFeature = function(featureKey, featureName, callbackAction, extraInfo) {
    if (window.isCurrentSuperAdmin()) {
      if (typeof callbackAction === 'function') callbackAction();
      return;
    }

    const app = window.approvedFeatureSession[featureKey];
    const validUntil = (typeof app === 'object' && app) ? app.until : (app || 0);
    if (validUntil > Date.now()) {
      if (typeof callbackAction === 'function') callbackAction();
      return;
    }

    window.openSuperAdminPermModal(featureKey, featureName, callbackAction, extraInfo || '');
  };

  window.openSuperAdminPermModal = function(featureKey, featureName, callbackAction, extraInfo) {
    if (window.permPollingInterval) {
      clearInterval(window.permPollingInterval);
      window.permPollingInterval = null;
    }

    window.currentPermRequest = {
      featureKey: featureKey,
      featureName: featureName,
      callbackAction: callbackAction,
      extraInfo: extraInfo || '',
      requestId: null
    };

    const modal = document.getElementById('modal-super-admin-permission');
    if (!modal) {
      alert(`Fitur "${featureName}" memerlukan otorisasi resmi.`);
      return;
    }

    const featureEl = document.getElementById('perm-modal-feature-name');
    if (featureEl) featureEl.innerText = featureName;

    const requester = (window.pemiluStorage && window.pemiluStorage.getAdminSession)
      ? window.pemiluStorage.getAdminSession()
      : null;
    const reqEl = document.getElementById('perm-modal-requester');
    if (reqEl) {
      reqEl.innerText = (requester && requester.name) ? `${requester.name}` : 'Operator Sesi';
    }

    const statusContainer = document.getElementById('perm-modal-status-container');
    if (statusContainer) {
      statusContainer.innerHTML = `
        <div style="background: rgba(245, 186, 66, 0.08); border: 1px solid rgba(245, 186, 66, 0.25); border-radius: 12px; padding: 14px 16px; font-size: 0.82rem; color: #FDE68A; line-height: 1.5; text-align: left;">
          💡 Fitur ini memerlukan otorisasi resmi. Klik tombol di bawah untuk mengirimkan permintaan verifikasi ke email penanggung jawab yang berwenang.
        </div>
      `;
    }

    const actionsContainer = document.getElementById('perm-modal-actions');
    if (actionsContainer) {
      actionsContainer.innerHTML = `
        <button type="button" class="btn" onclick="closeSuperAdminPermModal()" style="height: 40px; padding: 0 18px; font-size: 0.82rem; font-weight: 600; background: rgba(255,255,255,0.06); border: 1px solid rgba(255,255,255,0.12); color: #CBD5E1; border-radius: 10px; cursor: pointer;">
          Batal
        </button>
        <button type="button" id="btn-perm-modal-send" onclick="sendSuperAdminAccessRequest()" class="btn btn-gold" style="height: 40px; padding: 0 20px; font-size: 0.84rem; font-weight: 800; display: inline-flex; align-items: center; gap: 6px; cursor: pointer;">
          <span>🛡️</span>
          <span>Kirim Permohonan Otorisasi</span>
        </button>
      `;
    }

    modal.style.setProperty('display', 'flex', 'important');
  };

  window.closeSuperAdminPermModal = function() {
    if (window.permPollingInterval) {
      clearInterval(window.permPollingInterval);
      window.permPollingInterval = null;
    }
    const modal = document.getElementById('modal-super-admin-permission');
    if (modal) modal.style.setProperty('display', 'none', 'important');
    window.currentPermRequest = null;
  };

  window.sendSuperAdminAccessRequest = async function() {
    if (!window.currentPermRequest) return;
    const req = window.currentPermRequest;

    const btnSend = document.getElementById('btn-perm-modal-send');
    if (btnSend) {
      btnSend.disabled = true;
      btnSend.innerHTML = `<span>⏳</span><span>Mengirim Notifikasi...</span>`;
    }

    const requester = (window.pemiluStorage && window.pemiluStorage.getAdminSession)
      ? window.pemiluStorage.getAdminSession()
      : {};

    try {
      const token = sessionStorage.getItem('kpku_admin_token') || '';
      const res = await fetch('api/vote_sync.php?action=request_feature_access', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + token,
          'X-Admin-Token': token
        },
        body: JSON.stringify({
          session_token: token,
          requester_name: requester.name || 'Operator Sesi',
          requester_email: requester.email || '',
          feature_key: req.featureKey,
          feature_name: req.featureName,
          extra_info: req.extraInfo || ''
        })
      });
      const data = await res.json();
      if (data.success && data.request_id) {
        req.requestId = data.request_id;
        startPermWaitingState(data.request_id, req.featureName);
      } else {
        alert('Gagal mengirim permohonan: ' + (data.error || 'Terjadi kesalahan sistem.'));
        if (btnSend) {
          btnSend.disabled = false;
          btnSend.innerHTML = `<span>🔄</span><span>Kirim Ulang Notifikasi</span>`;
        }
      }
    } catch (e) {
      console.error(e);
      const fallbackId = 'REQ-' + Math.random().toString(36).substring(2, 8).toUpperCase();
      req.requestId = fallbackId;
      startPermWaitingState(fallbackId, req.featureName);
    }
  };

  function startPermWaitingState(requestId, featureName) {
    const container = document.getElementById('perm-modal-status-container');
    if (container) {
      container.innerHTML = `
        <div style="background: rgba(16, 185, 129, 0.08); border: 1.5px solid rgba(16, 185, 129, 0.35); border-radius: 14px; padding: 18px; text-align: center;">
          <div style="display: inline-flex; align-items: center; gap: 8px; font-size: 0.82rem; font-weight: 800; color: #6EE7B7; margin-bottom: 8px;">
            <span style="display: inline-block; width: 9px; height: 9px; border-radius: 50%; background: #10B981; box-shadow: 0 0 10px #10B981;"></span>
            <span>PERMOHONAN OTORISASI TERKIRIM</span>
          </div>
          <p style="font-size: 0.82rem; color: #CBD5E1; margin: 0 0 12px; line-height: 1.55;">
            Notifikasi persetujuan resmi telah dikirimkan ke email penanggung jawab yang berwenang.<br>
            Menunggu verifikasi otorisasi...
          </p>
          <div style="font-family: var(--font-mono); font-size: 0.74rem; color: #94A3B8; background: rgba(0,0,0,0.3); padding: 6px 12px; border-radius: 6px; display: inline-block;">
            ID Permohonan: <strong style="color: #F5BA42;">${requestId}</strong>
          </div>
        </div>
      `;
    }

    const actions = document.getElementById('perm-modal-actions');
    if (actions) {
      actions.innerHTML = `
        <button type="button" class="btn" onclick="closeSuperAdminPermModal()" style="height: 38px; padding: 0 16px; font-size: 0.8rem; font-weight: 600; background: rgba(255,255,255,0.06); border: 1px solid rgba(255,255,255,0.12); color: #CBD5E1; border-radius: 8px; cursor: pointer;">
          Batalkan
        </button>
        <button type="button" onclick="checkCurrentPermStatus()" class="btn" style="height: 38px; padding: 0 18px; font-size: 0.8rem; font-weight: 700; background: rgba(245, 186, 66, 0.15); border: 1px solid rgba(245, 186, 66, 0.4); color: #FDE68A; border-radius: 8px; cursor: pointer; display: inline-flex; align-items: center; gap: 6px;">
          <span>🔄</span>
          <span>Periksa Status Sekarang</span>
        </button>
      `;
    }

    if (window.permPollingInterval) clearInterval(window.permPollingInterval);
    window.permPollingInterval = setInterval(() => {
      checkCurrentPermStatus();
    }, 3000);
  }

  window.checkCurrentPermStatus = async function() {
    const container = document.getElementById('perm-modal-status-container');
    const btnCheck = document.querySelector('#perm-modal-actions button[onclick*="checkCurrentPermStatus"]');

    let reqId = (window.currentPermRequest && window.currentPermRequest.requestId) ? window.currentPermRequest.requestId : null;
    let featureKey = (window.currentPermRequest && window.currentPermRequest.featureKey) ? window.currentPermRequest.featureKey : 'unseal_vault';
    let cbAction = (window.currentPermRequest && window.currentPermRequest.callbackAction) ? window.currentPermRequest.callbackAction : null;

    if (!reqId && container) {
      const text = container.innerText || '';
      const match = text.match(/REQ-[A-Z0-9]+/i);
      if (match) {
        reqId = match[0].toUpperCase();
        if (!window.currentPermRequest) {
          window.currentPermRequest = { requestId: reqId, featureKey: 'unseal_vault' };
        } else {
          window.currentPermRequest.requestId = reqId;
        }
      }
    }

    if (!reqId) return;

    if (btnCheck) {
      btnCheck.disabled = true;
      btnCheck.innerHTML = `<span>⏳</span><span>Memeriksa Status...</span>`;
    }

    try {
      const cacheBuster = Date.now();
      const res = await fetch(`api/vote_sync.php?action=check_feature_access&req_id=${encodeURIComponent(reqId)}&_t=${cacheBuster}`, {
        cache: 'no-store'
      });
      const data = await res.json();

      if (btnCheck) {
        btnCheck.disabled = false;
        btnCheck.innerHTML = `<span>🔄</span><span>Periksa Status Sekarang</span>`;
      }

      if (data.success && data.status) {
        if (data.status === 'APPROVED') {
          if (window.permPollingInterval) clearInterval(window.permPollingInterval);
          showPermDecisionUI(true, data.decided_by || 'Otoritas Berwenang');
          
          window.approvedFeatureSession = window.approvedFeatureSession || {};
          window.approvedFeatureSession[data.feature_key || featureKey] = {
            until: Date.now() + (15 * 60 * 1000),
            reqId: reqId
          };
          try {
            localStorage.setItem('kpku_last_approved_unseal_req_id', reqId);
          } catch (e) {}

          setTimeout(() => {
            closeSuperAdminPermModal();
            if (typeof cbAction === 'function') {
              cbAction();
            } else if (featureKey === 'unseal_vault' && typeof window.openUnsealVaultModal === 'function') {
              window.openUnsealVaultModal();
            }
          }, 1200);
        } else if (data.status === 'REJECTED') {
          if (window.permPollingInterval) clearInterval(window.permPollingInterval);
          showPermDecisionUI(false, data.decided_by || 'Otoritas Berwenang');
        } else if (data.status === 'PENDING') {
          if (container) {
            const notice = document.getElementById('perm-pending-notice');
            const timeStr = new Date().toLocaleTimeString('id-ID');
            if (!notice) {
              const el = document.createElement('div');
              el.id = 'perm-pending-notice';
              el.style = 'margin-top: 10px; font-size: 0.74rem; color: #FCD34D;';
              el.innerHTML = `🕒 <em>Status server: Menunggu konfirmasi (Dicek pukul ${timeStr})</em>`;
              container.appendChild(el);
            } else {
              notice.innerHTML = `🕒 <em>Status server: Menunggu konfirmasi (Dicek pukul ${timeStr})</em>`;
            }
          }
        } else if (data.status === 'EXPIRED') {
          if (window.permPollingInterval) clearInterval(window.permPollingInterval);
          if (container) {
            container.innerHTML = `
              <div style="background: rgba(239, 68, 68, 0.15); border: 1px solid #EF4444; border-radius: 12px; padding: 14px; text-align: center; color: #FCA5A5; font-size: 0.82rem;">
                ⏳ Permohonan telah kedaluwarsa. Silakan ajukan ulang jika masih diperlukan.
              </div>
            `;
          }
        }
      }
    } catch (e) {
      console.error(e);
      if (btnCheck) {
        btnCheck.disabled = false;
        btnCheck.innerHTML = `<span>🔄</span><span>Periksa Status Sekarang</span>`;
      }
    }
  };

  function showPermDecisionUI(isApproved, deciderName) {
    const container = document.getElementById('perm-modal-status-container');
    if (!container) return;

    if (isApproved) {
      container.innerHTML = `
        <div style="background: rgba(16, 185, 129, 0.15); border: 1.5px solid #10B981; border-radius: 14px; padding: 18px; text-align: center; animation: alertSlideIn 0.3s ease;">
          <div style="font-size: 34px; margin-bottom: 6px;">✅</div>
          <div style="font-size: 0.95rem; font-weight: 800; color: #6EE7B7; margin-bottom: 4px;">AKSES DIIZINKAN!</div>
          <div style="font-size: 0.82rem; color: #FFFFFF; line-height: 1.5;">
            Permohonan akses telah <strong>DISETUJUI</strong>.<br>
            <span style="color: #A7F3D0; font-weight: 700;">Membuka fitur sekarang...</span>
          </div>
        </div>
      `;
      const actions = document.getElementById('perm-modal-actions');
      if (actions) actions.innerHTML = '';
    } else {
      container.innerHTML = `
        <div style="background: rgba(239, 68, 68, 0.15); border: 1.5px solid #EF4444; border-radius: 14px; padding: 18px; text-align: center; animation: alertSlideIn 0.3s ease;">
          <div style="font-size: 34px; margin-bottom: 6px;">⛔</div>
          <div style="font-size: 0.95rem; font-weight: 800; color: #FCA5A5; margin-bottom: 4px;">AKSES DITOLAK</div>
          <div style="font-size: 0.82rem; color: #CBD5E1; line-height: 1.5;">
            Permohonan akses fitur ini telah <strong>DITOLAK</strong>.<br>
            Fitur tetap terkunci demi integritas sistem.
          </div>
        </div>
      `;
      const actions = document.getElementById('perm-modal-actions');
      if (actions) {
        actions.innerHTML = `
          <button type="button" class="btn" onclick="closeSuperAdminPermModal()" style="height: 38px; padding: 0 20px; font-size: 0.82rem; font-weight: 700; background: rgba(239, 68, 68, 0.2); border: 1px solid rgba(239, 68, 68, 0.4); color: #FCA5A5; border-radius: 8px; cursor: pointer;">
            Tutup
          </button>
        `;
      }
    }
  }

  // Periodic notification checker for authorized decision-makers
  setInterval(async () => {
    if (!window.isCurrentSuperAdmin()) return;
    try {
      const token = sessionStorage.getItem('kpku_admin_token') || '';
      const res = await fetch('api/vote_sync.php?action=get_pending_access_requests', {
        headers: { 'Authorization': 'Bearer ' + token, 'X-Admin-Token': token }
      });
      const data = await res.json();
      if (data.success && Array.isArray(data.pending_requests) && data.pending_requests.length > 0) {
        const topReq = data.pending_requests[0];
        const toast = document.getElementById('toast-super-admin-approval');
        const desc = document.getElementById('toast-approval-desc');
        const btnApprove = document.getElementById('btn-toast-approve');
        const btnReject = document.getElementById('btn-toast-reject');

        if (toast && desc && btnApprove && btnReject) {
          desc.innerHTML = `<strong>${topReq.requester_name}</strong> mengajukan permohonan akses:<br><span style="color:#F5BA42; font-weight:800;">${topReq.feature_name}</span>`;
          
          btnApprove.onclick = async () => {
            btnApprove.disabled = true;
            await respondDirectApproval(topReq.id, 'approve');
            toast.style.display = 'none';
            btnApprove.disabled = false;
          };
          btnReject.onclick = async () => {
            btnReject.disabled = true;
            await respondDirectApproval(topReq.id, 'reject');
            toast.style.display = 'none';
            btnReject.disabled = false;
          };

          toast.style.display = 'block';
        }
      } else {
        const toast = document.getElementById('toast-super-admin-approval');
        if (toast && toast.style.display !== 'none') toast.style.display = 'none';
      }
    } catch (e) {}
  }, 5000);

  async function respondDirectApproval(reqId, decision) {
    try {
      const token = sessionStorage.getItem('kpku_admin_token') || '';
      await fetch('api/vote_sync.php?action=admin_approve_access_direct', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + token,
          'X-Admin-Token': token
        },
        body: JSON.stringify({ req_id: reqId, decision: decision, session_token: token })
      });
    } catch (e) {}
  }
})();
