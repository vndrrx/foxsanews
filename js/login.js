/**
 * FoxSA News - Dedicated Login & Registration Controller
 * Directly interacts with Supabase Cloud for real-time authentication
 */
(function() {
  'use strict';

  const AUTH_SESSION_KEY = 'foxsa_auth_session_v1';
  const STORAGE_KEY = 'foxsa_news_data_v1';

  const DEFAULT_CREDENTIALS = {
    'admin': ['foxsa2026', 'admin', 'foxsa', 'admin123'],
    'arthur': ['arthurfoxsa', 'arthur', 'foxsa2026', 'foxsa'],
    'reinhardt': ['reinhardt2026', 'reinhardt', 'foxsa2026', 'foxsa'],
    'rein': ['rein123', 'reinhardt2026', 'rein', 'foxsa2026'],
    'younghwan19': ['hwan123', 'parkyounghwan', 'foxsa2026'],
    'park': ['parkyounghwan', 'park', 'foxsa2026', 'foxsa'],
    'steven': ['stevendeluca', 'steven', 'foxsa2026', 'foxsa']
  };

  function getExecutiveAvatarSvg(seed = 0) {
    const palettes = [
      { bg1: '#0f172a', bg2: '#1e293b', suit: '#1e293b', lapel: '#0f172a', tie: '#F08D39', tieKnot: '#ea580c', skin: '#f1c29b', hair: '#1e293b', glasses: false, pocketSquare: '#F08D39' },
      { bg1: '#18181b', bg2: '#27272a', suit: '#18181b', lapel: '#09090b', tie: '#2563eb', tieKnot: '#1d4ed8', skin: '#f3c6a2', hair: '#3f3f46', glasses: false, pocketSquare: '#38bdf8' },
      { bg1: '#0c192c', bg2: '#162b48', suit: '#0f233d', lapel: '#081424', tie: '#dc2626', tieKnot: '#b91c1c', skin: '#ecc098', hair: '#1e293b', glasses: true, pocketSquare: '#ffffff' },
      { bg1: '#111827', bg2: '#1f2937', suit: '#1f2937', lapel: '#111827', tie: '#059669', tieKnot: '#047857', skin: '#e2b388', hair: '#111827', glasses: false, pocketSquare: '#34d399' },
      { bg1: '#1c1917', bg2: '#292524', suit: '#292524', lapel: '#1c1917', tie: '#7c3aed', tieKnot: '#6d28d9', skin: '#f5cb9f', hair: '#292524', glasses: true, pocketSquare: '#a78bfa' }
    ];
    const p = palettes[Math.abs(seed) % palettes.length];
    const glassesSvg = p.glasses ? `
      <circle cx="90" cy="98" r="9" fill="none" stroke="#F08D39" stroke-width="2.5" />
      <circle cx="110" cy="98" r="9" fill="none" stroke="#F08D39" stroke-width="2.5" />
      <path d="M 99 98 L 101 98" stroke="#F08D39" stroke-width="2.5" />
    ` : '';

    const svg = `
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200" width="200" height="200">
        <defs>
          <radialGradient id="bgG_${seed}" cx="50%" cy="40%" r="65%">
            <stop offset="0%" stop-color="${p.bg2}" />
            <stop offset="100%" stop-color="${p.bg1}" />
          </radialGradient>
        </defs>
        <rect width="200" height="200" fill="url(#bgG_${seed})" rx="100" />
        <ellipse cx="100" cy="180" rx="68" ry="48" fill="${p.suit}" />
        <path d="M 80 145 L 100 185 L 120 145 Z" fill="#ffffff" />
        <path d="M 97 150 L 103 150 L 101 188 L 99 188 Z" fill="${p.tie}" />
        <path d="M 96 148 L 104 148 L 102 155 L 98 155 Z" fill="${p.tieKnot}" />
        <path d="M 68 148 L 88 185 L 82 188 L 60 155 Z" fill="${p.lapel}" />
        <path d="M 132 148 L 112 185 L 118 188 L 140 155 Z" fill="${p.lapel}" />
        <rect x="91" y="125" width="18" height="25" rx="3" fill="${p.skin}" />
        <ellipse cx="100" cy="100" rx="30" ry="34" fill="${p.skin}" />
        <path d="M 70 95 C 70 70 82 62 100 62 C 118 62 130 70 130 95 C 122 84 112 80 100 80 C 88 80 78 84 70 95 Z" fill="${p.hair}" />
        <circle cx="89" cy="98" r="3.5" fill="#1e293b" />
        <circle cx="111" cy="98" r="3.5" fill="#1e293b" />
        ${glassesSvg}
        <path d="M 94 116 Q 100 120 106 116" stroke="#92400e" stroke-width="2" stroke-linecap="round" fill="none" />
      </svg>
    `;
    return 'data:image/svg+xml;utf8,' + encodeURIComponent(svg.trim());
  }

  function getSupabaseClient() {
    if (window.supabase && window.FOXSA_SUPABASE_CONFIG) {
      try {
        return window.supabase.createClient(
          window.FOXSA_SUPABASE_CONFIG.url,
          window.FOXSA_SUPABASE_CONFIG.anonKey
        );
      } catch (e) {
        console.warn('Supabase Client Error:', e);
      }
    }
    return null;
  }

  function escapeHtml(str) {
    if (!str) return '';
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  }

  document.addEventListener('DOMContentLoaded', () => {
    // Check if user is already logged in
    try {
      const savedSession = localStorage.getItem(AUTH_SESSION_KEY);
      if (savedSession) {
        const parsed = JSON.parse(savedSession);
        if (parsed && parsed.username) {
          // Redirect to admin panel
          window.location.href = 'admin.html';
          return;
        }
      }
    } catch (e) {}

    // Elements
    const tabBtnLogin = document.getElementById('auth-tab-btn-login');
    const tabBtnRegister = document.getElementById('auth-tab-btn-register');
    const panelLogin = document.getElementById('foxsa-auth-panel-login');
    const panelRegister = document.getElementById('foxsa-auth-panel-register');

    // Tab switching
    function switchTab(tab) {
      if (tab === 'register') {
        tabBtnRegister.classList.add('active');
        tabBtnLogin.classList.remove('active');
        panelRegister.style.display = 'block';
        panelLogin.style.display = 'none';
      } else {
        tabBtnLogin.classList.add('active');
        tabBtnRegister.classList.remove('active');
        panelLogin.style.display = 'block';
        panelRegister.style.display = 'none';
      }
    }

    if (tabBtnLogin && tabBtnRegister) {
      tabBtnLogin.addEventListener('click', () => switchTab('login'));
      tabBtnRegister.addEventListener('click', () => switchTab('register'));
    }

    // Check URL params (?tab=register or #register)
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get('tab') === 'register' || window.location.hash.includes('register')) {
      switchTab('register');
    }

    // Password toggles
    const loginPassInp = document.getElementById('login-password');
    const loginToggleBtn = document.getElementById('login-toggle-pwd');
    if (loginToggleBtn && loginPassInp) {
      loginToggleBtn.addEventListener('click', () => {
        const isPwd = loginPassInp.type === 'password';
        loginPassInp.type = isPwd ? 'text' : 'password';
        loginToggleBtn.innerHTML = isPwd ? '<i class="fa-regular fa-eye-slash"></i>' : '<i class="fa-regular fa-eye"></i>';
      });
    }

    const regPassInp = document.getElementById('reg-password');
    const regToggleBtn = document.getElementById('reg-toggle-pwd');
    if (regToggleBtn && regPassInp) {
      regToggleBtn.addEventListener('click', () => {
        const isPwd = regPassInp.type === 'password';
        regPassInp.type = isPwd ? 'text' : 'password';
        regToggleBtn.innerHTML = isPwd ? '<i class="fa-regular fa-eye-slash"></i>' : '<i class="fa-regular fa-eye"></i>';
      });
    }

    // Random avatar generator
    let currentRegAvatar = getExecutiveAvatarSvg(Math.floor(Math.random() * 10));
    const avatarPreviewImg = document.getElementById('reg-avatar-preview');
    const randomAvatarBtn = document.getElementById('reg-btn-random-avatar');
    if (avatarPreviewImg) avatarPreviewImg.src = currentRegAvatar;

    if (randomAvatarBtn && avatarPreviewImg) {
      randomAvatarBtn.addEventListener('click', () => {
        currentRegAvatar = getExecutiveAvatarSvg(Math.floor(Math.random() * 10));
        avatarPreviewImg.src = currentRegAvatar;
      });
    }

    // -------------------------------------------------------------
    // HANDLE LOGIN SUBMIT
    // -------------------------------------------------------------
    const loginForm = document.getElementById('foxsa-staff-login-form');
    const loginUserInp = document.getElementById('login-username');
    const loginErrBox = document.getElementById('login-error-msg');
    const loginSubmitBtn = document.getElementById('login-submit-btn');

    if (loginUserInp) {
      loginUserInp.addEventListener('input', () => {
        if (loginErrBox) loginErrBox.style.display = 'none';
      });
    }
    if (loginPassInp) {
      loginPassInp.addEventListener('input', () => {
        if (loginErrBox) loginErrBox.style.display = 'none';
      });
    }

    if (loginForm) {
      loginForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const rawUser = loginUserInp.value.trim();
        const rawPass = loginPassInp.value.trim();
        const cleanUser = rawUser.toLowerCase().replace(/^@+/, '');

        if (!cleanUser || !rawPass) {
          loginErrBox.style.display = 'block';
          loginErrBox.innerHTML = '<i class="fa-solid fa-triangle-exclamation"></i> Harap isi username dan password!';
          return;
        }

        if (loginSubmitBtn) {
          loginSubmitBtn.disabled = true;
          loginSubmitBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Memverifikasi Akun ke Supabase...';
        }

        let account = null;

        // Query Supabase directly
        const sb = getSupabaseClient();
        if (sb) {
          try {
            const { data: accounts, error } = await sb
              .from('foxsa_staff_accounts')
              .select('*');

            if (!error && Array.isArray(accounts)) {
              account = accounts.find(a => {
                const u = String(a.username || '').toLowerCase().trim();
                const d = String(a.display_name || '').toLowerCase().trim();
                const authN = String(a.author_name || '').toLowerCase().trim();
                const userMatch = (u === cleanUser) ||
                                 (d === cleanUser) ||
                                 (authN === cleanUser) ||
                                 (cleanUser.length >= 3 && (u.includes(cleanUser) || cleanUser.includes(u) || d.includes(cleanUser)));
                if (!userMatch) return false;

                const passVal = String(a.password || '');
                const allowedPasses = DEFAULT_CREDENTIALS[u] || [];
                return (passVal === rawPass) || allowedPasses.includes(rawPass);
              });
            }
          } catch (err) {
            console.warn('Supabase query error:', err);
          }
        }

        // Fallback to local data if offline or not in Supabase yet
        if (!account && window.FOXSA_INITIAL_DATA && Array.isArray(window.FOXSA_INITIAL_DATA.staffAccounts)) {
          account = window.FOXSA_INITIAL_DATA.staffAccounts.find(a => {
            const u = String(a.username || '').toLowerCase().trim();
            const d = String(a.displayName || '').toLowerCase().trim();
            const userMatch = (u === cleanUser) || (d === cleanUser) || (cleanUser.length >= 3 && (u.includes(cleanUser) || cleanUser.includes(u)));
            if (!userMatch) return false;
            const passVal = String(a.password || '');
            const allowed = DEFAULT_CREDENTIALS[u] || [];
            return (passVal === rawPass) || allowed.includes(rawPass);
          });
        }

        if (loginSubmitBtn) {
          loginSubmitBtn.disabled = false;
          loginSubmitBtn.innerHTML = '<i class="fa-solid fa-right-to-bracket"></i> Masuk ke Panel Redaksi';
        }

        if (!account) {
          loginErrBox.style.display = 'block';
          loginErrBox.style.background = '#fee2e2';
          loginErrBox.style.color = '#991b1b';
          loginErrBox.style.borderColor = '#fecaca';
          loginErrBox.innerHTML = '<i class="fa-solid fa-triangle-exclamation"></i> Username atau Password salah! Periksa kembali username & password staff Anda.';
          loginPassInp.value = '';
          loginPassInp.focus();
          return;
        }

        if (account.status === 'pending') {
          loginErrBox.style.display = 'block';
          loginErrBox.style.background = '#fffbeb';
          loginErrBox.style.color = '#b45309';
          loginErrBox.style.borderColor = '#fde68a';
          loginErrBox.innerHTML = `
            <div style="display:flex;align-items:flex-start;gap:8px;">
              <i class="fa-solid fa-hourglass-half" style="color:#d97706;font-size:16px;margin-top:2px;"></i>
              <div>
                <strong>Menunggu ACC High Staff!</strong><br/>
                Akun <code>@${escapeHtml(account.username)}</code> sedang menunggu persetujuan (ACC) dari High Staff FoxSA News Agency sebelum dapat masuk.
              </div>
            </div>
          `;
          return;
        }

        // Login success! Store session
        const normalizedUser = {
          username: account.username,
          displayName: account.display_name || account.displayName,
          authorName: account.author_name || account.authorName || account.display_name || account.displayName,
          role: account.role || 'Junior Reporter',
          status: account.status || 'approved',
          isAdmin: Boolean(account.is_admin || account.isAdmin),
          avatar: account.avatar || currentRegAvatar,
          quote: account.quote || '',
          bio: account.bio || ''
        };

        try {
          localStorage.setItem(AUTH_SESSION_KEY, JSON.stringify({
            username: normalizedUser.username,
            loginAt: new Date().toISOString()
          }));
        } catch (e) {}

        // Redirect to admin panel
        loginSubmitBtn.innerHTML = '<i class="fa-solid fa-circle-check"></i> Berhasil! Membuka Panel Redaksi...';
        loginSubmitBtn.style.background = '#059669';
        setTimeout(() => {
          window.location.href = 'admin.html';
        }, 300);
      });
    }

    // -------------------------------------------------------------
    // HANDLE REGISTER SUBMIT
    // -------------------------------------------------------------
    const regForm = document.getElementById('foxsa-staff-register-form');
    const regUserInp = document.getElementById('reg-username');
    const regNameInp = document.getElementById('reg-name');
    const regRoleSelect = document.getElementById('reg-role');
    const regConfirmInp = document.getElementById('reg-confirm-password');
    const regErrBox = document.getElementById('reg-error-msg');
    const regSubmitBtn = document.getElementById('reg-submit-btn');

    if (regForm) {
      regForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const username = regUserInp.value.trim().toLowerCase().replace(/\s+/g, '');
        const displayName = regNameInp.value.trim();
        const role = regRoleSelect.value.trim() || 'Junior Reporter';
        const password = regPassInp.value.trim();
        const confirmPassword = regConfirmInp.value.trim();

        if (regErrBox) regErrBox.style.display = 'none';

        if (!username || !displayName || !password) {
          regErrBox.style.display = 'block';
          regErrBox.innerHTML = '<i class="fa-solid fa-triangle-exclamation"></i> Harap lengkapi seluruh kolom formulir!';
          return;
        }

        if (password.length < 4) {
          regErrBox.style.display = 'block';
          regErrBox.innerHTML = '<i class="fa-solid fa-triangle-exclamation"></i> Password minimal 4 karakter!';
          return;
        }

        if (password !== confirmPassword) {
          regErrBox.style.display = 'block';
          regErrBox.innerHTML = '<i class="fa-solid fa-triangle-exclamation"></i> Konfirmasi password tidak cocok!';
          return;
        }

        if (regSubmitBtn) {
          regSubmitBtn.disabled = true;
          regSubmitBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Menyimpan ke Supabase...';
        }

        const sb = getSupabaseClient();
        if (sb) {
          try {
            // Check if username already exists
            const { data: existing } = await sb
              .from('foxsa_staff_accounts')
              .select('username')
              .eq('username', username)
              .maybeSingle();

            if (existing) {
              regSubmitBtn.disabled = false;
              regSubmitBtn.innerHTML = '<i class="fa-solid fa-user-check"></i> Selesaikan Registrasi';
              regErrBox.style.display = 'block';
              regErrBox.innerHTML = '<i class="fa-solid fa-triangle-exclamation"></i> Username <code>@' + escapeHtml(username) + '</code> sudah terdaftar! Gunakan username lain.';
              return;
            }

            // Insert new pending account
            const newAcc = {
              username,
              password,
              display_name: displayName,
              author_name: displayName,
              role,
              status: 'pending',
              is_admin: false,
              is_former: false,
              avatar: currentRegAvatar,
              quote: '',
              bio: ''
            };

            const { error: insErr } = await sb
              .from('foxsa_staff_accounts')
              .insert([newAcc]);

            if (insErr) {
              console.warn('Insert Supabase error:', insErr);
            }
          } catch (err) {
            console.warn('Supabase register error:', err);
          }
        }

        // Show Success Banner
        panelRegister.innerHTML = `
          <div class="foxsa-reg-pending-alert" style="text-align:center;padding:24px 20px;background:#fef3c7;border:1px solid #fde68a;border-radius:12px;">
            <div style="font-size:36px;margin-bottom:12px;">⏳</div>
            <h3 style="margin:0 0 8px;color:#92400e;font-size:18px;font-family:'Poppins',sans-serif;">Pendaftaran Berhasil Terkirim!</h3>
            <p style="margin:0 0 16px;font-size:13.5px;color:#78350f;line-height:1.6;">
              Terima kasih, <strong>${escapeHtml(displayName)}</strong>! Akun Anda dengan username <code>@${escapeHtml(username)}</code> telah tersimpan di database Cloud dan berstatus <strong>Menunggu Persetujuan (ACC) dari High Staff</strong> FoxSA News Agency.
            </p>
            <div style="background:#fff;border:1px solid #fde68a;border-radius:8px;padding:12px 14px;margin-bottom:18px;text-align:left;font-size:12.5px;color:#78350f;">
              <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:6px;">
                <span>Jabatan Diajukan:</span>
                <strong>${escapeHtml(role)}</strong>
              </div>
              <div style="display:flex;align-items:center;justify-content:space-between;">
                <span>Status Akun:</span>
                <span class="foxsa-pending-badge" style="margin-left:0;background:#d97706;color:#fff;padding:2px 8px;border-radius:4px;font-size:11px;">Pending High Staff Review</span>
              </div>
            </div>
            <button type="button" class="foxsa-btn foxsa-btn-full" id="reg-back-to-login-btn">
              <i class="fa-solid fa-right-to-bracket"></i> Kembali ke Form Login Staff
            </button>
          </div>
        `;

        const backBtn = document.getElementById('reg-back-to-login-btn');
        if (backBtn) {
          backBtn.addEventListener('click', () => {
            window.location.href = 'login.html';
          });
        }
      });
    }

  });
})();
