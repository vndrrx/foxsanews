/**
 * FoxSA News - Main Application Script (Kreeti + AnimeNetwork Magazine Edition)
 * Features:
 * - Kreeti + AnimeNetwork Hybrid Design:
 *   * Live Date Topbar, Dark Brand Box Header, Inline Search, Popular Tags Strip
 *   * Breaking News Ticker + 3-Column Hero Showcase (Editor's Picks, Main News, Trending Now)
 *   * 4-Column Featured Posts Row
 *   * AnimeNetwork-style Category Tabs + Grid/List View Switcher + Clean "Recent News" Cards
 *   * Tabbed Sidebar (TERPOPULER / TERBARU) + FoxSA Spotlight Card
 * - Super-Simple Visual Article Editor (Zero HTML code — type like Word/Google Docs + 1-click Photo Upload)
 * - Protected Staff/Admin Login System & Interactive IC Comments
 */

(function () {
  'use strict';

  const STORAGE_KEY = 'foxsa_news_data_v1';
  const AUTH_SESSION_KEY = 'foxsa_auth_session_v1';
  const VIEW_MODE_KEY = 'foxsa_news_view_mode_v1';
  const GITHUB_CONFIG_KEY = 'foxsa_github_sync_config';
  const DEFAULT_AVATAR = 'https://4.bp.blogspot.com/-uCjYgVFIh70/VuOLn-mL7PI/AAAAAAAADUs/Kcu9wJbv790hIo83rI_s7lLW3zkLY01EA/s100/avatar.png';

  const DAYS_ID = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'];
  const MONTHS_ID = [
    'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
    'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'
  ];

  const OFFICIAL_CATEGORIES = [
    'Crime',
    'LSPD',
    'Motorsport',
    'Los Santos Event',
    'Government & Emergency Services',
    'Police',
    'Police Chase',
    'San Andreas Motorsport Championship',
    'Ceremony',
    'Social Event',
    'Wedding',
    'Street Race',
    'Traffic Incident'
  ];

  const NON_NEWS_LEGACY_POST_IDS = [
    '2526320561083681754', // Overview FoxSA News
    '3689427128628530545', // Rencana Pengembangan & Pembaruan FoxSA News
    '4080555137325759950'  // OPEN RECRUITMENT FOXSA NEWS
  ];

  // =========================================================================
  // OFFICIAL FOXSA ROLES & HIERARCHY
  // =========================================================================
  const OFFICIAL_ROLES = [
    // Tier 1: Red Shield (High Staff / Board of Commissioners)
    { name: 'Commissioner', category: 'High Staff', color: '#dc2626', bg: '#fef2f2', border: '#fecaca', icon: 'fa-shield-halved', isHighStaff: true, level: 100 },

    // Tier 2: Purple / Indigo Shield (High Staff / Executive Board)
    { name: 'Chief Executive Officer', category: 'High Staff', color: '#7c3aed', bg: '#f5f3ff', border: '#ddd6fe', icon: 'fa-crown', isHighStaff: true, level: 90 },
    { name: 'Chief Operating Officer', category: 'High Staff', color: '#7c3aed', bg: '#f5f3ff', border: '#ddd6fe', icon: 'fa-user-tie', isHighStaff: true, level: 85 },
    { name: 'Vice President', category: 'High Staff', color: '#7c3aed', bg: '#f5f3ff', border: '#ddd6fe', icon: 'fa-user-tie', isHighStaff: true, level: 80 },

    // Tier 3: Blue Shield (Management / Operational Leads)
    { name: 'General Manager', category: 'Management', color: '#2563eb', bg: '#eff6ff', border: '#bfdbfe', icon: 'fa-briefcase', isHighStaff: true, level: 70 },
    { name: 'Executive Producer', category: 'Management', color: '#2563eb', bg: '#eff6ff', border: '#bfdbfe', icon: 'fa-clapperboard', isHighStaff: true, level: 65 },
    { name: 'Managing Editor', category: 'Management', color: '#2563eb', bg: '#eff6ff', border: '#bfdbfe', icon: 'fa-newspaper', isHighStaff: true, level: 60 },

    // Tier 4: Teal / Dark Green Shield (Supervisor Team)
    { name: 'Senior Producer', category: 'Supervisor', color: '#0d9488', bg: '#f0fdfa', border: '#99f6e4', icon: 'fa-video', isHighStaff: false, level: 50 },
    { name: 'Line Producer', category: 'Supervisor', color: '#0d9488', bg: '#f0fdfa', border: '#99f6e4', icon: 'fa-film', isHighStaff: false, level: 45 },
    { name: 'Head Reporter', category: 'Supervisor', color: '#0d9488', bg: '#f0fdfa', border: '#99f6e4', icon: 'fa-bullhorn', isHighStaff: false, level: 40 },

    // Tier 5: Green Shield (Operational Staff / Field Reporters)
    { name: 'Senior Reporter', category: 'Operational', color: '#16a34a', bg: '#f0fdf4', border: '#bbf7d0', icon: 'fa-microphone', isHighStaff: false, level: 30 },
    { name: 'Staff Reporter', category: 'Operational', color: '#16a34a', bg: '#f0fdf4', border: '#bbf7d0', icon: 'fa-pen-nib', isHighStaff: false, level: 20 },
    { name: 'Junior Reporter', category: 'Operational', color: '#22c55e', bg: '#f0fdf4', border: '#bbf7d0', icon: 'fa-pen-fancy', isHighStaff: false, level: 10 },
    { name: 'Journalism Intern', category: 'Operational', color: '#10b981', bg: '#ecfdf5', border: '#a7f3d0', icon: 'fa-graduation-cap', isHighStaff: false, level: 5 }
  ];

  function getRoleInfo(roleName) {
    if (!roleName) return OFFICIAL_ROLES[OFFICIAL_ROLES.length - 1];
    const clean = String(roleName).trim().toLowerCase();
    const found = OFFICIAL_ROLES.find(r => r.name.toLowerCase() === clean);
    if (found) return found;
    const partial = OFFICIAL_ROLES.find(r => clean.includes(r.name.toLowerCase()) || r.name.toLowerCase().includes(clean));
    if (partial) return partial;
    return {
      name: roleName,
      category: 'Staff',
      color: '#64748b',
      bg: '#f1f5f9',
      border: '#cbd5e1',
      icon: 'fa-id-badge',
      isHighStaff: clean.includes('admin') || clean.includes('chief') || clean.includes('commissioner') || clean.includes('manager')
    };
  }

  function renderRoleBadgeHtml(roleName) {
    const info = getRoleInfo(roleName);
    return `<span class="foxsa-role-badge" style="background:${info.bg};color:${info.color};border:1px solid ${info.border};">
      <i class="fa-solid ${info.icon}"></i> ${escapeHtml(info.name)}
    </span>`;
  }

  function isHighStaff(user) {
    if (!user) return false;
    if (user.isAdmin) return true;
    const rInfo = getRoleInfo(user.role);
    return !!rInfo.isHighStaff;
  }

  function renderRoleOptionsHtml(selectedRole, options = {}) {
    const selClean = String(selectedRole || '').trim().toLowerCase();
    const categories = options.excludeHighStaff
      ? ['Management', 'Supervisor', 'Operational']
      : ['High Staff', 'Management', 'Supervisor', 'Operational'];
    const catLabels = {
      'High Staff': '🛡️ High Staff / Dewan Direksi',
      'Management': '💼 Operational Management',
      'Supervisor': '🎬 Supervisor Team',
      'Operational': '🎤 Operational Staff'
    };
    return categories.map(cat => {
      const rolesInCat = OFFICIAL_ROLES.filter(r => r.category === cat);
      if (rolesInCat.length === 0) return '';
      const opts = rolesInCat.map(r => {
        const isSel = r.name.toLowerCase() === selClean;
        return `<option value="${escapeHtml(r.name)}" ${isSel ? 'selected' : ''}>${escapeHtml(r.name)}</option>`;
      }).join('');
      return `<optgroup label="${catLabels[cat] || cat}">${opts}</optgroup>`;
    }).join('');
  }

  function openRoleChooserModal({ title, currentRole, onSave }) {
    const existing = document.getElementById('foxsa-role-modal');
    if (existing) existing.remove();

    const curRoleClean = (currentRole || '').trim().toLowerCase();
    const modal = document.createElement('div');
    modal.id = 'foxsa-role-modal';
    modal.className = 'foxsa-modal-overlay';
    modal.innerHTML = `
      <div class="foxsa-modal-card">
        <div class="foxsa-modal-header">
          <div style="display:flex;align-items:center;gap:8px;">
            <i class="fa-solid fa-user-tag" style="color:#F08D39;font-size:18px;"></i>
            <h4 style="margin:0;font-size:16px;color:#090C1E;font-family:'Poppins',sans-serif;">Pilih Jabatan / Role</h4>
          </div>
          <button type="button" class="foxsa-modal-close" id="role-modal-close" aria-label="Tutup">&times;</button>
        </div>
        <div class="foxsa-modal-body">
          <p style="margin:0 0 14px;font-size:13px;color:#64748b;line-height:1.5;">${escapeHtml(title)}</p>
          <div class="foxsa-form-group" style="margin-bottom:12px;">
            <label style="font-weight:600;font-size:13px;color:#1E2438;display:block;margin-bottom:6px;">Pilih Role Resmi FoxSA News:</label>
            <select id="role-modal-select" class="foxsa-select" style="font-size:13px;padding:9px 12px;width:100%;">
              ${OFFICIAL_ROLES.map(r => {
                const isSel = r.name.toLowerCase() === curRoleClean;
                return `<option value="${escapeHtml(r.name)}" ${isSel ? 'selected' : ''}>${escapeHtml(r.name)} [${escapeHtml(r.category)}]</option>`;
              }).join('')}
              <option value="__custom__" ${!OFFICIAL_ROLES.some(r => r.name.toLowerCase() === curRoleClean) ? 'selected' : ''}>+ Custom / Jabatan Lainnya</option>
            </select>
          </div>
          <div class="foxsa-form-group" id="role-modal-custom-wrap" style="display:${!OFFICIAL_ROLES.some(r => r.name.toLowerCase() === curRoleClean) ? 'block' : 'none'};margin-bottom:14px;">
            <label style="font-weight:600;font-size:12.5px;color:#475569;display:block;margin-bottom:4px;">Jabatan Custom:</label>
            <input type="text" id="role-modal-custom-input" class="foxsa-input" value="${escapeHtml(currentRole || '')}" placeholder="Ketik nama jabatan custom..." style="width:100%;font-size:13px;" />
          </div>
        </div>
        <div class="foxsa-modal-footer">
          <button type="button" class="foxsa-btn foxsa-btn-outline" id="role-modal-cancel" style="padding:8px 16px;font-size:13px;">Batal</button>
          <button type="button" class="foxsa-btn" id="role-modal-save" style="padding:8px 18px;font-size:13px;"><i class="fa-solid fa-check"></i> Simpan Role</button>
        </div>
      </div>
    `;

    document.body.appendChild(modal);

    const sel = modal.querySelector('#role-modal-select');
    const customWrap = modal.querySelector('#role-modal-custom-wrap');
    const customInp = modal.querySelector('#role-modal-custom-input');
    const closeBtn = modal.querySelector('#role-modal-close');
    const cancelBtn = modal.querySelector('#role-modal-cancel');
    const saveBtn = modal.querySelector('#role-modal-save');

    sel.addEventListener('change', () => {
      if (sel.value === '__custom__') {
        customWrap.style.display = 'block';
        customInp.focus();
      } else {
        customWrap.style.display = 'none';
      }
    });

    const closeModal = () => modal.remove();
    closeBtn.addEventListener('click', closeModal);
    cancelBtn.addEventListener('click', closeModal);
    modal.addEventListener('click', (e) => {
      if (e.target === modal) closeModal();
    });

    saveBtn.addEventListener('click', () => {
      let chosen = sel.value;
      if (chosen === '__custom__') {
        chosen = (customInp.value || '').trim();
      }
      if (!chosen) {
        showToast('Pilih atau ketik nama role terlebih dahulu.');
        return;
      }
      closeModal();
      onSave(chosen);
    });
  }

  const DEFAULT_STAFF_ACCOUNTS = [
    {
      username: 'admin',
      password: 'foxsa2026',
      displayName: 'Arthur Redfields (CEO & Admin)',
      authorName: 'Arthur Redfields',
      role: 'Chief Executive Officer',
      status: 'approved',
      isAdmin: true,
      avatar: 'assets/logo/foxsa-icon.jpg'
    },
    {
      username: 'arthur',
      password: 'arthurfoxsa',
      displayName: 'Arthur Redfields',
      authorName: 'Arthur Redfields',
      role: 'Chief Executive Officer',
      status: 'approved',
      isAdmin: true,
      avatar: 'https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEijelpjGHfXOoTKfqD1mokSIESF0WySrKkFx3EV9rhrMxaQHJmPSkWe7Lj9QbiFJQbVx7z2os7vSHs3TVJFg1nzGX2MTzdqBO1eO-gppMt99EfwrEBOG9BqW1ZrbkNcNNqd-k9pS8vHOItd_EF7yVe_MfaTvhN2EvXpcWmK7ZDpX94RY14/s200/In%20Edward%20Snowden%E2%80%99s%20New%20Memoir,%20the%20Disclosures%20This%20Time%20Are%20Personal%20(Published%202019).jpg'
    },
    {
      username: 'reinhardt',
      password: 'reinhardt2026',
      displayName: 'Reinhardt Harrison',
      authorName: 'Reinhardt Harrison',
      role: 'Commissioner',
      status: 'approved',
      isAdmin: true,
      avatar: 'assets/logo/foxsa-icon.jpg'
    },
    {
      username: 'park',
      password: 'parkyounghwan',
      displayName: 'Park Young-Hwan',
      authorName: 'Park Young-Hwan',
      role: 'Line Producer',
      status: 'approved',
      isAdmin: false,
      avatar: 'assets/logo/foxsa-icon.jpg'
    },
    {
      username: 'steven',
      password: 'stevendeluca',
      displayName: 'Steven Deluca',
      authorName: 'Steven Deluca',
      role: 'Journalism Intern',
      status: 'approved',
      isAdmin: false,
      avatar: 'assets/logo/foxsa-icon.jpg'
    }
  ];

  // Application State
  const state = {
    data: null,
    currentUser: null,
    currentRoute: { view: 'home', param: null },
    visiblePostsCount: 6,
    feedLayout: localStorage.getItem(VIEW_MODE_KEY) || 'list', // 'list' (AnimeNetwork) or 'grid' (Kreeti)
    sidebarTab: 'popular', // 'popular' or 'latest'
    tickerIndex: 0,
    tickerTimer: null,
    adminTab: 'posts',
    editingPostId: null,
    selectedEditorLabels: [],
    syncInProgress: false
  };

  // =========================================================================
  // 1. DATA & AUTH INITIALIZATION
  // =========================================================================

  function repairMojibakeText(str) {
    if (!str || typeof str !== 'string') return str;
    return str
      .replace(/â€”/g, '—')
      .replace(/â€“/g, '–')
      .replace(/â€œ/g, '“')
      .replace(/â€\u009d|â€ /g, '”')
      .replace(/â€™/g, '’')
      .replace(/Â©/g, '©')
      .replace(/ðŸ‘\s*/g, '👍');
  }

  function normalizeData(raw) {
    const cloned = JSON.parse(JSON.stringify(raw || window.FOXSA_INITIAL_DATA));
    if (!cloned.siteInfo) cloned.siteInfo = JSON.parse(JSON.stringify(window.FOXSA_INITIAL_DATA.siteInfo));
    cloned.siteInfo.headerLogo = 'assets/logo/foxsa-icon.jpg';
    cloned.siteInfo.mobileLogo = 'assets/logo/foxsa-icon.jpg';
    cloned.siteInfo.aboutBanner = 'assets/logo/foxsa-channel.jpg';
    cloned.siteInfo.copyright = '© 2026 FoxSA News. Independent News Network. All Rights Reserved.';

    if (!cloned.authors) cloned.authors = window.FOXSA_INITIAL_DATA.authors || {};
    if (!Array.isArray(cloned.posts)) cloned.posts = [];

    // Remove the 3 non-news company profile/roadmap/recruitment posts even if cached in localStorage
    cloned.posts = cloned.posts.filter(p => !NON_NEWS_LEGACY_POST_IDS.includes(String(p.id)));

    if (!Array.isArray(cloned.staffAccounts) || cloned.staffAccounts.length === 0) {
      cloned.staffAccounts = JSON.parse(JSON.stringify(DEFAULT_STAFF_ACCOUNTS));
    }
    cloned.staffAccounts = cloned.staffAccounts.filter(acc =>
      !String(acc.username || '').toLowerCase().includes('ligma') &&
      !String(acc.displayName || '').toLowerCase().includes('ligma')
    );
    delete cloned.profileFeedback;

    cloned.staffAccounts.forEach(acc => {
      if (!acc.status) acc.status = 'approved';
      const known = cloned.authors[acc.authorName];
      if (known && known.avatar && (!acc.avatar || acc.avatar === DEFAULT_AVATAR || acc.avatar.includes('Arthur%20PP'))) {
        acc.avatar = known.avatar;
      }
    });

    cloned.posts.forEach(post => {
      post.title = repairMojibakeText(post.title);
      post.snippet = repairMojibakeText(post.snippet);
      post.content = repairMojibakeText(post.content);
      if (post.featuredImage) {
        post.featuredImage = post.featuredImage.replace(/\/s320\//g, '/s1200/');
      }
      if (post.content) {
        post.content = post.content
          .replace(/\/s320\//g, '/s1200/')
          .replace(/\s+(width|height)=["']\d+["']/gi, '');
      }
      if (!Array.isArray(post.labels)) post.labels = [];
      post.labels = post.labels.map(l => String(l).trim()).filter(Boolean);
      if (!Array.isArray(post.comments)) post.comments = [];
      post.comments = post.comments.filter(c => !String(c.author || '').toLowerCase().includes('ligma'));
      post.comments.forEach(c => {
        c.body = repairMojibakeText(c.body);
      });
      if (!post.authorAvatar) {
        const knownAuthor = cloned.authors[post.author];
        post.authorAvatar = (knownAuthor && knownAuthor.avatar) ? knownAuthor.avatar : DEFAULT_AVATAR;
      }
      if (!post.authorBio) {
        const knownAuthor = cloned.authors[post.author];
        post.authorBio = (knownAuthor && knownAuthor.bio)
          ? repairMojibakeText(knownAuthor.bio)
          : 'Jurnalis & Tim Redaksi FoxSA News — Independent News Network.';
      }
    });

    cloned.posts.sort((a, b) => new Date(b.published) - new Date(a.published));
    return cloned;
  }

  function loadData() {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed && Array.isArray(parsed.posts) && parsed.posts.length > 0) {
          state.data = normalizeData(parsed);
          loadAuthSession();
          return;
        }
      }
    } catch (err) {
      console.warn('Gagal membaca localStorage, menggunakan data bawaan:', err);
    }
    state.data = normalizeData(window.FOXSA_INITIAL_DATA);
    saveDataToLocal(false);
    loadAuthSession();
  }

  function loadAuthSession() {
    try {
      const raw = localStorage.getItem(AUTH_SESSION_KEY);
      if (!raw) {
        state.currentUser = null;
        updateHeaderStaffBadge();
        return;
      }
      const parsed = JSON.parse(raw);
      if (parsed && parsed.username) {
        const matched = (state.data.staffAccounts || []).find(
          a => a.username.toLowerCase() === String(parsed.username).toLowerCase()
        );
        state.currentUser = matched || null;
      }
    } catch (e) {
      state.currentUser = null;
    }
    updateHeaderStaffBadge();
  }

  function loginStaff(username, password) {
    const cleanUser = String(username || '').trim().toLowerCase();
    const cleanPass = String(password || '');
    const account = (state.data.staffAccounts || []).find(
      a => a.username.toLowerCase() === cleanUser && a.password === cleanPass
    );
    if (!account) return { success: false, reason: 'invalid_credentials' };
    if (account.status === 'pending') {
      return { success: false, reason: 'pending_approval', account };
    }
    state.currentUser = account;
    localStorage.setItem(AUTH_SESSION_KEY, JSON.stringify({
      username: account.username,
      loginAt: new Date().toISOString()
    }));
    updateHeaderStaffBadge();
    return { success: true, account };
  }

  function logoutStaff() {
    state.currentUser = null;
    state.editingPostId = null;
    localStorage.removeItem(AUTH_SESSION_KEY);
    updateHeaderStaffBadge();
    showToast('Anda telah keluar dari sesi Staff FoxSA.');
  }

  function updateHeaderStaffBadge() {
    const staffBtn = document.getElementById('header-staff-btn');
    const footerStaffLink = document.getElementById('footer-staff-link');
    if (staffBtn) {
      const labelSpan = staffBtn.querySelector('.staff-btn-label');
      if (state.currentUser) {
        staffBtn.style.display = 'inline-flex';
        if (labelSpan) labelSpan.textContent = `Panel (${state.currentUser.displayName.split(' ')[0]})`;
        staffBtn.classList.add('is-logged-in');
        staffBtn.title = `Login sebagai ${state.currentUser.displayName} (${state.currentUser.role})`;
      } else {
        // Hanya bisa diakses oleh staff/admin, sembunyikan dari pembaca umum
        staffBtn.style.display = 'none';
        staffBtn.classList.remove('is-logged-in');
        staffBtn.title = 'Login khusus Redaksi & Staff FoxSA';
      }
    }
    if (footerStaffLink) {
      footerStaffLink.style.display = state.currentUser ? 'block' : 'none';
    }
    rebuildMobileDrawerMenu();
  }

  function saveDataToLocal(triggerCloud = true) {
    try {
      state.data.posts.sort((a, b) => new Date(b.published) - new Date(a.published));
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state.data));
      if (triggerCloud) {
        syncToCloudIfConfigured();
      }
    } catch (err) {
      console.error('Gagal menyimpan ke localStorage:', err);
      showToast('Peringatan: Penyimpanan browser penuh. Gunakan fitur Download data.js di Admin Panel.');
    }
  }

  function getGitHubConfig() {
    try {
      const raw = localStorage.getItem(GITHUB_CONFIG_KEY);
      return raw ? JSON.parse(raw) : { enabled: false, repo: 'vndrrx/foxsanews', branch: 'main', token: '', useServerlessApi: false };
    } catch (e) {
      return { enabled: false, repo: 'vndrrx/foxsanews', branch: 'main', token: '', useServerlessApi: false };
    }
  }

  function saveGitHubConfig(cfg) {
    localStorage.setItem(GITHUB_CONFIG_KEY, JSON.stringify(cfg));
  }

  async function syncToCloudIfConfigured() {
    const cfg = getGitHubConfig();
    if (!cfg.enabled) return;

    state.syncInProgress = true;
    try {
      if (cfg.useServerlessApi) {
        const res = await fetch('/api/save', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ data: state.data })
        });
        if (res.ok) {
          showToast('Tersimpan ke Server Cloud / GitHub!');
        }
        state.syncInProgress = false;
        return;
      }

      if (cfg.repo && cfg.token) {
        await commitFileToGitHub(
          cfg.repo,
          cfg.branch || 'main',
          cfg.token,
          'data/posts.json',
          JSON.stringify(state.data, null, 2),
          'Update data berita & komentar FoxSA News'
        );
        const jsContent = '// Data bawaan FoxSA News (Otomatis di-load oleh website)\nwindow.FOXSA_INITIAL_DATA = ' + JSON.stringify(state.data, null, 2) + ';\n';
        await commitFileToGitHub(
          cfg.repo,
          cfg.branch || 'main',
          cfg.token,
          'js/data.js',
          jsContent,
          'Sync js/data.js FoxSA News'
        );
        showToast('Perubahan berhasil disinkronkan ke GitHub Repo!');
      }
    } catch (err) {
      console.error('Cloud sync error:', err);
      showToast('Tersimpan di browser (Gagal sync ke GitHub: periksa Token/Repo).');
    } finally {
      state.syncInProgress = false;
    }
  }

  async function commitFileToGitHub(repo, branch, token, filePath, contentText, message) {
    const apiUrl = `https://api.github.com/repos/${repo}/contents/${filePath}`;
    const headers = {
      'Authorization': `Bearer ${token}`,
      'Accept': 'application/vnd.github+json'
    };

    let sha = undefined;
    const getRes = await fetch(`${apiUrl}?ref=${encodeURIComponent(branch)}`, { headers });
    if (getRes.ok) {
      const fileMeta = await getRes.json();
      sha = fileMeta.sha;
    }

    const encoded = btoa(unescape(encodeURIComponent(contentText)));
    const putRes = await fetch(apiUrl, {
      method: 'PUT',
      headers: { ...headers, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        message,
        content: encoded,
        branch,
        ...(sha ? { sha } : {})
      })
    });

    if (!putRes.ok) {
      throw new Error(`GitHub API HTTP ${putRes.status}`);
    }
  }

  async function tryFetchRemoteFreshData() {
    const cfg = getGitHubConfig();
    if (cfg.enabled && cfg.repo) {
      try {
        const rawUrl = `https://raw.githubusercontent.com/${cfg.repo}/${cfg.branch || 'main'}/data/posts.json?t=${Date.now()}`;
        const res = await fetch(rawUrl);
        if (res.ok) {
          const remoteData = await res.json();
          if (remoteData && Array.isArray(remoteData.posts)) {
            state.data = normalizeData(remoteData);
            saveDataToLocal(false);
            loadAuthSession();
            renderAll();
          }
        }
      } catch (e) {
        // Ignore offline/fetch errors
      }
    }
  }

  // =========================================================================
  // 2. HELPER FUNCTIONS & READING TIME / CATEGORY UTILS
  // =========================================================================

  function escapeHtml(str) {
    if (str === null || str === undefined) return '';
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }

  function formatDateID(isoDate) {
    if (!isoDate) return '';
    const d = new Date(isoDate);
    if (isNaN(d.getTime())) return isoDate;
    const month = MONTHS_ID[d.getMonth()];
    const day = String(d.getDate()).padStart(2, '0');
    const year = d.getFullYear();
    return `${day} ${month} ${year}`;
  }

  function formatShortDate(isoDate) {
    if (!isoDate) return '';
    const d = new Date(isoDate);
    if (isNaN(d.getTime())) return isoDate;
    const day = String(d.getDate()).padStart(2, '0');
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const year = d.getFullYear();
    return `${day}/${month}/${year}`;
  }

  function formatDateTimeID(isoDate) {
    if (!isoDate) return '';
    const d = new Date(isoDate);
    if (isNaN(d.getTime())) return isoDate;
    const month = MONTHS_ID[d.getMonth()];
    const day = String(d.getDate()).padStart(2, '0');
    const year = d.getFullYear();
    const hh = String(d.getHours()).padStart(2, '0');
    const mm = String(d.getMinutes()).padStart(2, '0');
    return `${day} ${month} ${year}, ${hh}:${mm}`;
  }

  function getReadingTime(html) {
    const tmp = document.createElement('div');
    tmp.innerHTML = html || '';
    const words = (tmp.textContent || '').trim().split(/\s+/).filter(Boolean).length;
    const mins = Math.max(1, Math.round(words / 160));
    return `${mins} min read`;
  }

  function getArchiveKey(isoDate) {
    const d = new Date(isoDate);
    if (isNaN(d.getTime())) return '2026-04';
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    return `${year}-${month}`;
  }

  function formatArchiveLabel(ymKey) {
    const [year, month] = (ymKey || '').split('-');
    const mIdx = parseInt(month, 10) - 1;
    if (mIdx >= 0 && mIdx < 12) {
      return `${MONTHS_ID[mIdx]} ${year}`;
    }
    return ymKey;
  }

  function stripHtmlToSnippet(html, maxLen = 150) {
    const tmp = document.createElement('div');
    tmp.innerHTML = html || '';
    tmp.querySelectorAll('style, script').forEach(el => el.remove());
    const text = (tmp.textContent || tmp.innerText || '').replace(/\s+/g, ' ').trim();
    if (text.length <= maxLen) return text;
    return text.substring(0, maxLen).trim() + '...';
  }

  function slugify(text) {
    return String(text || '')
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .trim()
      .replace(/\s+/g, '-')
      .substring(0, 60) || ('post-' + Date.now());
  }

  function getPostHref(post) {
    return `#/post/${post.id}`;
  }

  function getLabelCounts() {
    const counts = {};
    (state.data.posts || []).forEach(p => {
      (p.labels || []).forEach(rawL => {
        const l = String(rawL).trim();
        if (l) counts[l] = (counts[l] || 0) + 1;
      });
    });
    return counts;
  }

  function getAllAvailableCategories() {
    const set = new Set(OFFICIAL_CATEGORIES);
    (state.data.posts || []).forEach(p => {
      (p.labels || []).forEach(l => {
        const clean = String(l).trim();
        if (clean) set.add(clean);
      });
    });
    return Array.from(set);
  }

  function getCategoryIcon(label) {
    const lower = String(label || '').toLowerCase();
    if (lower.includes('crime')) return 'fa-solid fa-handcuffs';
    if (lower.includes('lspd') || lower.includes('police')) return 'fa-solid fa-shield-halved';
    if (lower.includes('motorsport') || lower.includes('race')) return 'fa-solid fa-flag-checkered';
    if (lower.includes('government') || lower.includes('emergency')) return 'fa-solid fa-building-columns';
    if (lower.includes('event')) return 'fa-solid fa-calendar-check';
    if (lower.includes('traffic')) return 'fa-solid fa-car-burst';
    if (lower.includes('recruitment')) return 'fa-solid fa-user-plus';
    if (lower.includes('overview') || lower.includes('info')) return 'fa-solid fa-circle-info';
    return 'fa-solid fa-hashtag';
  }

  function showToast(message) {
    let toast = document.getElementById('foxsa-toast');
    if (!toast) {
      toast = document.createElement('div');
      toast.id = 'foxsa-toast';
      toast.className = 'foxsa-toast';
      document.body.appendChild(toast);
    }
    toast.textContent = message;
    toast.classList.add('show');
    clearTimeout(toast._timer);
    toast._timer = setTimeout(() => {
      toast.classList.remove('show');
    }, 3200);
  }

  function processPostContentHtml(html) {
    if (!html) return '';
    return html.replace(/https?:\/\/foxsanews\.blogspot\.com\/\d{4}\/\d{2}\/([a-zA-Z0-9-_]+)\.html/g, (match, slug) => {
      const found = state.data.posts.find(p => p.slug === slug);
      return found ? `#/post/${found.id}` : match;
    });
  }

  // Convert legacy messy Blogger HTML into clean, readable visual HTML for the Visual Editor
  function cleanBloggerHtmlForVisualEditor(rawHtml) {
    if (!rawHtml) return '<p>Los Santos, FoxSA News — Tulis isi berita di sini...</p>';
    const temp = document.createElement('div');
    temp.innerHTML = processPostContentHtml(rawHtml);

    // Remove inline font-family/font-size clutter while keeping paragraphs, bold, italic, images, quotes, tables
    temp.querySelectorAll('span').forEach(sp => {
      sp.removeAttribute('style');
    });

    // Convert Blogger .separator image wrappers into clean visual figure blocks
    temp.querySelectorAll('.separator').forEach(sep => {
      const img = sep.querySelector('img');
      if (img && img.getAttribute('src')) {
        const src = img.getAttribute('src');
        const fig = document.createElement('figure');
        fig.className = 'foxsa-article-figure';
        fig.innerHTML = `<img src="${src}" alt="Foto Berita" />`;
        sep.replaceWith(fig);
      }
    });

    return temp.innerHTML;
  }

  // Serialize Visual Editor content into clean, justified article HTML
  function serializeVisualEditorToCleanHtml(editorEl) {
    const clone = editorEl.cloneNode(true);
    // Remove any editor-only delete buttons if present
    clone.querySelectorAll('.foxsa-img-remove-btn').forEach(btn => btn.remove());
    // Ensure paragraphs have clean justify alignment
    clone.querySelectorAll('p').forEach(p => {
      if (!p.style.textAlign) {
        p.style.textAlign = 'justify';
      }
    });
    return clone.innerHTML.trim();
  }

  // =========================================================================
  // 3. ROUTING
  // =========================================================================

  function parseHash() {
    const rawHash = window.location.hash || '#/';
    const clean = rawHash.replace(/^#\/?/, '');
    if (!clean) {
      return { view: 'home', param: null };
    }
    const parts = clean.split('/');
    const action = parts[0];
    const param = decodeURIComponent(parts.slice(1).join('/'));

    if (action === 'profile') {
      const sub = (param || 'overview').toLowerCase().trim();
      return { view: 'profile', param: sub };
    }
    if (action === 'post' && param) {
      // Redirect legacy removed non-news post IDs/slugs to dedicated Company Profile tabs
      if (param === '2526320561083681754' || param === 'overview-foxsa-news') {
        return { view: 'profile', param: 'overview' };
      }
      if (param === '3689427128628530545' || param === 'rencana-pengembangan-pembaruan-foxsa') {
        return { view: 'profile', param: 'roadmap' };
      }
      if (param === '4080555137325759950' || param === 'open-recruitment-foxsa-news') {
        return { view: 'profile', param: 'recruitment' };
      }
      return { view: 'post', param };
    }
    if (action === 'label' && param) return { view: 'label', param };
    if (action === 'popular') return { view: 'popular', param: null };
    if (action === 'archive' && param) return { view: 'archive', param };
    if (action === 'author' && param) return { view: 'author', param };
    if (action === 'search') return { view: 'search', param: param || '' };
    if (action === 'admin') return { view: 'admin', param: param || 'posts' };
    if (action === 'login') return { view: 'admin', param: 'login' };
    if (action === 'register') return { view: 'admin', param: 'register' };
    if (action === 'staff') return { view: 'admin', param: 'staff' };
    return { view: 'home', param: null };
  }

  function handleRouteChange() {
    const prevView = state.currentRoute.view;
    state.currentRoute = parseHash();

    if (state.currentRoute.view !== prevView) {
      state.visiblePostsCount = 6;
    }

    document.body.classList.remove('nav-active');
    renderHeroShowcase();
    renderMainView();
    renderWidgets();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  // =========================================================================
  // 4. HERO SHOWCASE (BINDUZ NEWSPAPER MEGA HERO & SUB-CARDS)
  // =========================================================================

  let binduzTickerIndex = 0;
  let binduzTickerTimer = null;

  function updateBinduzTicker() {
    const track = document.getElementById('binduz-ticker-content');
    if (!track) return;
    const posts = (state.data && state.data.posts) || [];
    if (posts.length === 0) return;

    const trending = posts.filter(p => p.popular).concat(posts.filter(p => !p.popular));

    const renderTickerItem = (idx) => {
      const p = trending[idx % trending.length];
      track.innerHTML = `<a href="${getPostHref(p)}" class="binduz-ticker-item">${escapeHtml(p.title)}</a>`;
    };

    renderTickerItem(binduzTickerIndex);

    if (!binduzTickerTimer) {
      binduzTickerTimer = setInterval(() => {
        binduzTickerIndex = (binduzTickerIndex + 1) % trending.length;
        renderTickerItem(binduzTickerIndex);
      }, 4500);

      const prevBtn = document.getElementById('ticker-prev');
      const nextBtn = document.getElementById('ticker-next');
      if (prevBtn) {
        prevBtn.addEventListener('click', () => {
          binduzTickerIndex = (binduzTickerIndex - 1 + trending.length) % trending.length;
          renderTickerItem(binduzTickerIndex);
        });
      }
      if (nextBtn) {
        nextBtn.addEventListener('click', () => {
          binduzTickerIndex = (binduzTickerIndex + 1) % trending.length;
          renderTickerItem(binduzTickerIndex);
        });
      }
    }
  }

  function renderHeroShowcase() {
    const heroSection = document.getElementById('foxsa-hero-showcase');
    if (!heroSection) return;

    // Show full Hero Showcase ONLY on main Home view
    if (state.currentRoute.view !== 'home' || !state.data || !state.data.posts || state.data.posts.length === 0) {
      heroSection.style.display = 'none';
      clearInterval(state.tickerTimer);
      return;
    }

    heroSection.style.display = 'block';
    const posts = state.data.posts;

    // 1. Main Headline (Newest news article, skip "All About FoxSA" overview if there's a newer or news post)
    const newsPosts = posts.filter(p => p.id !== '2526320561083681754');
    const mainPost = newsPosts[0] || posts[0];

    // 2. Editor's Picks (Next 3 posts)
    const editorPicks = posts.filter(p => p.id !== mainPost.id).slice(0, 3);
    const topPick = editorPicks[0] || mainPost;
    const subPicks = editorPicks.slice(1, 3);

    // 3. Trending Now (Up to 5 popular/recent posts with numbered badges 1-5)
    let trendingPosts = posts.filter(p => p.popular);
    if (trendingPosts.length < 5) {
      const others = posts.filter(p => !trendingPosts.includes(p));
      trendingPosts = trendingPosts.concat(others);
    }
    trendingPosts = trendingPosts.slice(0, 5);

    const mainTag = (mainPost.labels && mainPost.labels[0]) || 'News';
    const topPickTag = (topPick.labels && topPick.labels[0]) || 'News';

    heroSection.innerHTML = `
      <div class="container">
        <!-- 3-COLUMN HERO MAGAZINE GRID (KREETI STYLE) -->
        <div class="kreeti-hero-grid">
          <!-- Left Column: Editor's Picks -->
          <div class="kreeti-col kreeti-col-picks">
            <div class="kreeti-sec-heading">
              <span class="heading-line"></span>
              <h3>Editor's Picks</h3>
            </div>

            <div class="kreeti-pick-featured">
              <a href="${getPostHref(topPick)}" class="pick-featured-link">
                <img src="${escapeHtml(topPick.featuredImage || state.data.siteInfo.aboutBanner)}" alt="${escapeHtml(topPick.title)}" loading="lazy" />
                <div class="pick-featured-overlay">
                  <div class="kreeti-badges">
                    <span class="k-badge-time"><i class="fa-regular fa-clock"></i> ${getReadingTime(topPick.content)}</span>
                    <span class="k-badge-cat">${escapeHtml(topPickTag)}</span>
                  </div>
                  <h4>${escapeHtml(topPick.title)}</h4>
                </div>
              </a>
            </div>

            <div class="kreeti-pick-list">
              ${subPicks.map(sp => `
                <div class="kreeti-pick-text-card">
                  <div class="pick-meta-line">
                    <span class="pick-read"><i class="fa-regular fa-clock"></i> ${getReadingTime(sp.content)}</span>
                    <a href="#/label/${encodeURIComponent((sp.labels && sp.labels[0]) || 'News')}" class="pick-cat">${escapeHtml((sp.labels && sp.labels[0]) || 'News')}</a>
                  </div>
                  <h4><a href="${getPostHref(sp)}">${escapeHtml(sp.title)}</a></h4>
                </div>
              `).join('')}
            </div>
          </div>

          <!-- Center Column: Main News -->
          <div class="kreeti-col kreeti-col-main">
            <div class="kreeti-sec-heading">
              <span class="heading-line"></span>
              <h3>Headline Utama</h3>
            </div>

            <div class="kreeti-main-hero-card">
              <a href="${getPostHref(mainPost)}" class="main-hero-link">
                <img src="${escapeHtml(mainPost.featuredImage || state.data.siteInfo.aboutBanner)}" alt="${escapeHtml(mainPost.title)}" />
                <div class="main-hero-overlay">
                  <div class="kreeti-badges">
                    <span class="k-badge-icon"><i class="fa-solid fa-bolt"></i></span>
                    <span class="k-badge-time">${getReadingTime(mainPost.content)}</span>
                    <span class="k-badge-cat">${escapeHtml(mainTag)}</span>
                  </div>
                  <h2>${escapeHtml(mainPost.title)}</h2>
                  <p class="main-hero-excerpt">${escapeHtml(stripHtmlToSnippet(mainPost.content, 120))}</p>
                  <div class="main-hero-meta">
                    <span><i class="fa-regular fa-user"></i> ${escapeHtml(mainPost.author)}</span>
                    <span>•</span>
                    <span><i class="fa-regular fa-calendar"></i> ${escapeHtml(formatDateID(mainPost.published))}</span>
                    <span>•</span>
                    <span><i class="fa-regular fa-comments"></i> ${(mainPost.comments || []).length} Komentar</span>
                  </div>
                </div>
              </a>
            </div>
          </div>

          <!-- Right Column: Trending Now -->
          <div class="kreeti-col kreeti-col-trending">
            <div class="kreeti-sec-heading">
              <span class="heading-line"></span>
              <h3>Trending Now</h3>
            </div>

            <div class="kreeti-trending-list">
              ${trendingPosts.map((tp, idx) => `
                <a href="${getPostHref(tp)}" class="kreeti-trending-item">
                  <div class="trending-thumb-wrap">
                    <img src="${escapeHtml(tp.featuredImage || state.data.siteInfo.aboutBanner)}" alt="${escapeHtml(tp.title)}" loading="lazy" />
                    <span class="trending-rank-badge">${idx + 1}</span>
                  </div>
                  <div class="trending-item-info">
                    <h4>${escapeHtml(tp.title)}</h4>
                    <span class="trending-item-date">${escapeHtml(formatDateID(tp.published))}</span>
                  </div>
                </a>
              `).join('')}
            </div>
          </div>
        </div>
      </div>
    `;
  }

  // =========================================================================
  // 5. RENDERING: RECENT NEWS LIST / GRID + ANIMENETWORK CATEGORY TABS
  // =========================================================================

  function getFilteredPosts() {
    const posts = state.data.posts || [];
    const { view, param } = state.currentRoute;

    if (view === 'popular') {
      return posts.filter(p => p.popular);
    }
    if (view === 'label') {
      const target = param.trim().toLowerCase();
      return posts.filter(p => (p.labels || []).some(l => l.trim().toLowerCase() === target));
    }
    if (view === 'archive') {
      return posts.filter(p => getArchiveKey(p.published) === param);
    }
    if (view === 'author') {
      const target = param.trim().toLowerCase();
      return posts.filter(p => (p.author || '').trim().toLowerCase() === target);
    }
    if (view === 'search') {
      const q = (param || '').toLowerCase().trim();
      if (!q) return posts;
      return posts.filter(p =>
        (p.title || '').toLowerCase().includes(q) ||
        (p.snippet || '').toLowerCase().includes(q) ||
        (p.author || '').toLowerCase().includes(q) ||
        (p.labels || []).some(l => l.toLowerCase().includes(q)) ||
        (p.content || '').toLowerCase().includes(q)
      );
    }
    return posts;
  }

  function buildAnimeNetworkCategoryToolbarHtml() {
    const { view, param } = state.currentRoute;
    const labelCounts = getLabelCounts();
    const sortedCategories = Object.keys(labelCounts).sort((a, b) => {
      if (labelCounts[b] !== labelCounts[a]) return labelCounts[b] - labelCounts[a];
      return a.localeCompare(b);
    });

    const isHome = view === 'home';
    const isPopular = view === 'popular';
    const activeLabelLower = view === 'label' && param ? param.trim().toLowerCase() : '';

    return `
      <div class="an-filter-toolbar">
        <button type="button" class="an-cat-scroll-btn" id="cat-scroll-left" aria-label="Geser Kategori Kiri" title="Geser Kategori Kiri">
          <i class="fa-solid fa-chevron-left"></i>
        </button>

        <div class="an-tabs-scroll" id="foxsa-cat-pills-scroll">
          <a href="#/" class="an-tab-item ${isHome ? 'active' : ''}">Semua Berita</a>
          <a href="#/popular" class="an-tab-item ${isPopular ? 'active' : ''}">🔥 Terpopuler</a>
          ${sortedCategories.map(cat => {
            const isActive = activeLabelLower === cat.toLowerCase();
            return `<a href="#/label/${encodeURIComponent(cat)}" class="an-tab-item ${isActive ? 'active' : ''}">${escapeHtml(cat)}</a>`;
          }).join('')}
        </div>

        <button type="button" class="an-cat-scroll-btn" id="cat-scroll-right" aria-label="Geser Kategori Kanan" title="Geser Kategori Kanan">
          <i class="fa-solid fa-chevron-right"></i>
        </button>

        <div class="an-toolbar-right">
          <div class="an-view-switcher" role="group" aria-label="Tampilan Berita">
            <button type="button" class="an-view-btn ${state.feedLayout === 'grid' ? 'active' : ''}" data-set-layout="grid" title="Tampilan Grid (Kartu)">
              <i class="fa-solid fa-border-all"></i>
            </button>
            <button type="button" class="an-view-btn ${state.feedLayout === 'list' ? 'active' : ''}" data-set-layout="list" title="Tampilan List (Daftar Rapi)">
              <i class="fa-solid fa-list"></i>
            </button>
          </div>
        </div>
      </div>
    `;
  }

  function renderListView() {
    document.body.className = 'index home';
    const mainEl = document.getElementById('main');
    if (!mainEl) return;

    const { view, param } = state.currentRoute;
    const filteredPosts = getFilteredPosts();
    const visiblePosts = filteredPosts.slice(0, state.visiblePostsCount);
    const hasMore = filteredPosts.length > visiblePosts.length;

    let filterMessageHtml = '';
    if (view === 'label') {
      filterMessageHtml = `
        <div class="queryMessage">
          <span class="query-info query-label query-success">
            Kategori: <strong>#${escapeHtml(param)}</strong> (${filteredPosts.length} berita)
            <a class="show-more" href="#/">Reset Filter</a>
          </span>
        </div>`;
    } else if (view === 'popular') {
      filterMessageHtml = `
        <div class="queryMessage">
          <span class="query-info query-success">
            Menampilkan: <strong>🔥 Berita Terpopuler FoxSA News</strong> (${filteredPosts.length} berita)
            <a class="show-more" href="#/">Tampilkan Semua</a>
          </span>
        </div>`;
    } else if (view === 'archive') {
      filterMessageHtml = `
        <div class="queryMessage">
          <span class="query-info query-success">
            Arsip Bulan: <strong>${escapeHtml(formatArchiveLabel(param))}</strong> (${filteredPosts.length} berita)
            <a class="show-more" href="#/">Tampilkan Semua</a>
          </span>
        </div>`;
    } else if (view === 'author') {
      filterMessageHtml = `
        <div class="queryMessage">
          <span class="query-info query-success">
            Jurnalis: <strong>${escapeHtml(param)}</strong> (${filteredPosts.length} berita)
            <a class="show-more" href="#/">Tampilkan Semua</a>
          </span>
        </div>`;
    } else if (view === 'search') {
      filterMessageHtml = `
        <div class="queryMessage">
          <span class="query-info query-success">
            Hasil pencarian: <strong>"${escapeHtml(param)}"</strong> (${filteredPosts.length} ditemukan)
            <a class="show-more" href="#/">Reset Pencarian</a>
          </span>
        </div>`;
    }

    const postsCardsHtml = visiblePosts.length === 0
      ? `<div class="queryEmpty">
           <i class="fa-regular fa-folder-open" style="font-size:32px;color:#ccc;display:block;margin-bottom:10px;"></i>
           Tidak ada berita yang ditemukan pada filter ini.
           <div style="margin-top:12px;"><a href="#/" class="foxsa-btn" style="text-decoration:none;">Kembali ke Semua Berita</a></div>
         </div>`
      : visiblePosts.map((post) => {
          const labels = Array.isArray(post.labels) && post.labels.length > 0 ? post.labels : ['News'];
          const primaryTag = labels[0];
          const commentCount = (post.comments || []).length;
          const postHref = getPostHref(post);
          const snippet = post.snippet || stripHtmlToSnippet(post.content, 165);
          const thumb = post.featuredImage || state.data.siteInfo.aboutBanner;

          // AnimeNetwork Clean News Card (supports both 'list' and 'grid' modes via CSS)
          return `
            <article class="an-news-card">
              <div class="an-news-thumb-wrap">
                <a href="${postHref}" class="an-news-thumb-link">
                  <img src="${escapeHtml(thumb)}" alt="${escapeHtml(post.title)}" loading="lazy" />
                  <span class="an-thumb-read"><i class="fa-regular fa-clock"></i> ${getReadingTime(post.content)}</span>
                </a>
              </div>
              <div class="an-news-body">
                <div class="an-news-meta-top">
                  <a href="#/label/${encodeURIComponent(primaryTag)}" class="an-news-cat">${escapeHtml(primaryTag)}</a>
                  ${labels.slice(1, 3).map(t => `<a href="#/label/${encodeURIComponent(t)}" class="an-news-subcat">#${escapeHtml(t)}</a>`).join('')}
                  <span class="an-news-date">Posted on ${escapeHtml(formatDateID(post.published))} • <a href="#/author/${encodeURIComponent(post.author)}">${escapeHtml(post.author)}</a></span>
                </div>
                <h2 class="an-news-title">
                  <a href="${postHref}">${escapeHtml(post.title)}</a>
                </h2>
                <p class="an-news-excerpt">${escapeHtml(snippet)}</p>
                <div class="an-news-footer">
                  <a href="${postHref}" class="an-continue-link">Baca selengkapnya...</a>
                  <a href="${postHref}" class="an-comment-count">
                    <i class="fa-solid fa-message"></i> ${commentCount} komentar
                  </a>
                </div>
              </div>
            </article>
          `;
        }).join('');

    const paginationHtml = hasMore
      ? `<div class="blog-pager" id="blog-pager">
           <a class="blog-pager-older-link load-more" href="javascript:void(0)" id="foxsa-load-more-btn">
             Muat Berita Lainnya (${filteredPosts.length - visiblePosts.length} lagi)
           </a>
         </div>`
      : (filteredPosts.length > 0
          ? `<div class="blog-pager" id="blog-pager">
               <span class="no-more load-more" style="display:inline-block;">Semua Berita Telah Ditampilkan</span>
             </div>`
          : '');

    mainEl.innerHTML = `
      <div class="widget Blog" id="Blog1">
        ${buildAnimeNetworkCategoryToolbarHtml()}
        ${filterMessageHtml}

        <div class="an-section-header">
          <h3><span class="heading-line"></span> Berita Terkini (Recent News)</h3>
          ${state.currentUser ? `<a href="#/admin" class="an-quick-add-link" id="home-quick-new-post"><i class="fa-solid fa-plus"></i> Tulis Berita Baru</a>` : `<span class="an-total-label">${filteredPosts.length} Artikel</span>`}
        </div>

        <div class="an-news-feed layout-${state.feedLayout}">
          ${postsCardsHtml}
        </div>

        ${paginationHtml}
      </div>
    `;

    // Bind Category Bar Horizontal Scroll on PC (Left/Right Buttons + Mouse Wheel + Drag)
    const catScroll = document.getElementById('foxsa-cat-pills-scroll');
    const catLeftBtn = document.getElementById('cat-scroll-left');
    const catRightBtn = document.getElementById('cat-scroll-right');
    if (catScroll) {
      if (catLeftBtn) {
        catLeftBtn.addEventListener('click', () => {
          catScroll.scrollBy({ left: -240, behavior: 'smooth' });
        });
      }
      if (catRightBtn) {
        catRightBtn.addEventListener('click', () => {
          catScroll.scrollBy({ left: 240, behavior: 'smooth' });
        });
      }
      catScroll.addEventListener('wheel', (e) => {
        if (Math.abs(e.deltaY) > Math.abs(e.deltaX)) {
          e.preventDefault();
          catScroll.scrollLeft += e.deltaY * 1.4;
        }
      }, { passive: false });

      let isCatDown = false;
      let catStartX = 0;
      let catScrollStart = 0;
      let catDragged = false;
      catScroll.addEventListener('mousedown', (e) => {
        isCatDown = true;
        catDragged = false;
        catScroll.classList.add('is-dragging');
        catStartX = e.pageX - catScroll.offsetLeft;
        catScrollStart = catScroll.scrollLeft;
      });
      catScroll.addEventListener('mouseleave', () => {
        isCatDown = false;
        catScroll.classList.remove('is-dragging');
      });
      catScroll.addEventListener('mouseup', () => {
        isCatDown = false;
        catScroll.classList.remove('is-dragging');
      });
      catScroll.addEventListener('mousemove', (e) => {
        if (!isCatDown) return;
        const x = e.pageX - catScroll.offsetLeft;
        const walk = (x - catStartX) * 1.3;
        if (Math.abs(walk) > 6) {
          catDragged = true;
          e.preventDefault();
          catScroll.scrollLeft = catScrollStart - walk;
        }
      });
      catScroll.addEventListener('click', (e) => {
        if (catDragged) {
          e.preventDefault();
          e.stopPropagation();
          catDragged = false;
        }
      }, true);
    }

    // Bind Grid / List View Switcher
    mainEl.querySelectorAll('[data-set-layout]').forEach(btn => {
      btn.addEventListener('click', () => {
        const mode = btn.getAttribute('data-set-layout');
        state.feedLayout = mode;
        localStorage.setItem(VIEW_MODE_KEY, mode);
        renderListView();
      });
    });

    // Quick "+ Tulis Berita Baru" if logged in
    const quickNewBtn = document.getElementById('home-quick-new-post');
    if (quickNewBtn) {
      quickNewBtn.addEventListener('click', (e) => {
        e.preventDefault();
        state.editingPostId = null;
        state.adminTab = 'editor';
        window.location.hash = '#/admin';
      });
    }

    const loadMoreBtn = document.getElementById('foxsa-load-more-btn');
    if (loadMoreBtn) {
      loadMoreBtn.addEventListener('click', function (e) {
        e.preventDefault();
        state.visiblePostsCount += 5;
        renderListView();
      });
    }
  }

  // =========================================================================
  // 6. RENDERING: SINGLE ARTICLE VIEW + COMMENTS
  // =========================================================================

  function findPostByParam(param) {
    if (!param) return null;
    return state.data.posts.find(p => p.id === param || p.slug === param);
  }

  function renderSinglePostView(param) {
    document.body.className = 'item';
    const mainEl = document.getElementById('main');
    if (!mainEl) return;

    const post = findPostByParam(param);
    if (!post) {
      mainEl.innerHTML = `
        <div class="widget Blog" id="Blog1">
          <div class="errorWrap">
            <h3>404</h3>
            <h4>Berita Tidak Ditemukan</h4>
            <p>Maaf, artikel yang Anda cari tidak tersedia atau telah dihapus.</p>
            <a class="homepage" href="#/"><i class="fa fa-home"></i> Kembali ke Beranda</a>
          </div>
        </div>
      `;
      return;
    }

    const isStaffLoggedIn = !!state.currentUser;
    const postIdx = state.data.posts.findIndex(p => p.id === post.id);
    const newerPost = postIdx > 0 ? state.data.posts[postIdx - 1] : null;
    const olderPost = (postIdx >= 0 && postIdx < state.data.posts.length - 1) ? state.data.posts[postIdx + 1] : null;

    const primaryCategory = (post.labels && post.labels.length > 0) ? post.labels[0] : 'News';
    const authorInfo = state.data.authors[post.author] || {
      name: post.author,
      avatar: post.authorAvatar || DEFAULT_AVATAR,
      bio: post.authorBio || 'Jurnalis & Tim Redaksi FoxSA News.'
    };

    let related = state.data.posts.filter(p =>
      p.id !== post.id &&
      (p.labels || []).some(l => (post.labels || []).includes(l))
    );
    if (related.length < 3) {
      const fillers = state.data.posts.filter(p => p.id !== post.id && !related.includes(p));
      related = related.concat(fillers);
    }
    related = related.slice(0, 3);

    const labelsHtml = (post.labels && post.labels.length > 0)
      ? `<div class="post-labels">
           <div class="labels-Edges">
             <span style="font-size:12px;font-weight:700;color:#090C1E;margin-right:8px;"><i class="fa-solid fa-tags" style="color:#F08D39;"></i> Kategori:</span>
             ${post.labels.map(l => `<a class="label-link" href="#/label/${encodeURIComponent(l)}" rel="tag">#${escapeHtml(l)}</a>`).join('')}
           </div>
         </div>`
      : '';

    const shareUrl = encodeURIComponent(window.location.href);
    const shareTitle = encodeURIComponent(post.title);

    const comments = Array.isArray(post.comments) ? post.comments : [];
    const commentsListHtml = comments.length === 0
      ? `<div class="foxsa-no-comments">Belum ada komentar pada berita ini. Jadilah yang pertama memberikan tanggapan!</div>`
      : `<div class="foxsa-comment-list">
           ${comments.map(c => `
             <div class="foxsa-comment-item" data-comment-id="${escapeHtml(c.id)}">
               <img class="foxsa-comment-avatar" src="${escapeHtml(c.avatar || DEFAULT_AVATAR)}" alt="${escapeHtml(c.author)}" onerror="this.src='${DEFAULT_AVATAR}'"/>
               <div class="foxsa-comment-content">
                 <div class="foxsa-comment-meta">
                   <span class="foxsa-comment-author">${escapeHtml(c.author)}</span>
                   ${c.role ? `<span class="foxsa-comment-role">${escapeHtml(c.role)}</span>` : ''}
                   <span class="foxsa-comment-date">${escapeHtml(formatDateTimeID(c.date))}</span>
                   ${isStaffLoggedIn
                     ? `<button type="button" class="foxsa-comment-delete" data-del-comment="${escapeHtml(c.id)}" title="Hapus Komentar (Khusus Staff)">
                          <i class="fa-solid fa-trash-can"></i> Hapus
                        </button>`
                     : ''}
                 </div>
                 <div class="foxsa-comment-body">${escapeHtml(c.body).replace(/\n/g, '<br/>')}</div>
               </div>
             </div>
           `).join('')}
         </div>`;

    mainEl.innerHTML = `
      <div class="widget Blog" id="Blog1">
        <div class="blog-posts hfeed item-post-wrap">
          <article class="blog-post hentry item-post foxsa-clean-article-card">
            <div class="post-item-inner">
              <div class="post-header">
                <nav id="breadcrumb">
                  <a href="#/"><i class="fa-solid fa-house"></i> Beranda</a>
                  <em class="delimiter"></em>
                  <a class="b-label" href="#/label/${encodeURIComponent(primaryCategory)}">${escapeHtml(primaryCategory)}</a>
                  <em class="delimiter"></em>
                  <span class="current">${escapeHtml(post.title)}</span>
                </nav>

                <div class="article-top-badges">
                  ${(post.labels || ['News']).map(l => `<a href="#/label/${encodeURIComponent(l)}" class="article-cat-pill">${escapeHtml(l)}</a>`).join('')}
                  <span class="article-read-time"><i class="fa-regular fa-clock"></i> ${getReadingTime(post.content)}</span>
                </div>

                <h1 class="post-title">${escapeHtml(post.title)}</h1>

                <div class="article-byline-bar">
                  <div class="byline-author-left">
                    <img src="${escapeHtml(authorInfo.avatar || DEFAULT_AVATAR)}" alt="${escapeHtml(post.author)}" onerror="this.src='${DEFAULT_AVATAR}'" />
                    <div>
                      <div style="display:flex;align-items:center;gap:6px;flex-wrap:wrap;">
                        <a href="#/author/${encodeURIComponent(post.author)}" class="byline-author-name">${escapeHtml(post.author)}</a>
                        ${post.authorBio ? renderRoleBadgeHtml(post.authorBio) : ''}
                      </div>
                      <div class="byline-date-meta">
                        <span>Dipublikasikan ${escapeHtml(formatDateID(post.published))}</span>
                        <span>•</span>
                        <span style="color:#F08D39;font-weight:700;"><i class="fa-regular fa-comments"></i> ${comments.length} Komentar</span>
                      </div>
                    </div>
                  </div>
                  ${isStaffLoggedIn
                    ? `<button type="button" id="foxsa-quick-edit-post" class="foxsa-btn foxsa-btn-outline" style="padding:6px 12px;font-size:12px;">
                         <i class="fa-solid fa-pen"></i> Edit Berita
                       </button>`
                    : ''}
                </div>
              </div>

              <div class="post-body post-content foxsa-clean-prose">
                ${processPostContentHtml(post.content)}
              </div>

              <div class="post-footer">
                ${labelsHtml}

                <div class="post-share">
                  <ul class="share-links social social-color">
                    <li class="share-icon"><span class="s-icon"></span></li>
                    <li class="facebook"><a class="facebook" href="https://www.facebook.com/sharer.php?u=${shareUrl}" target="_blank" rel="noopener" title="Share to Facebook"></a></li>
                    <li class="twitter"><a class="twitter" href="https://twitter.com/intent/tweet?text=${shareTitle}&url=${shareUrl}" target="_blank" rel="noopener" title="Share to X/Twitter"></a></li>
                    <li class="whatsapp whatsapp-desktop"><a class="whatsapp" href="https://api.whatsapp.com/send?text=${shareTitle}%20-%20${shareUrl}" target="_blank" rel="noopener" title="Share to WhatsApp"></a></li>
                    <li class="email"><a class="email" href="javascript:void(0)" id="foxsa-copy-link-btn" title="Salin Link Berita"></a></li>
                  </ul>
                </div>

                <ul class="post-nav">
                  <li class="post-next">
                    ${newerPost
                      ? `<a class="next-post-link" href="${getPostHref(newerPost)}" id="Blog1_blog-pager-newer-link" rel="next">
                           <div class="post-nav-inner"><span>Berita Berikutnya</span><p>${escapeHtml(newerPost.title)}</p></div>
                         </a>`
                      : `<div class="post-nav-inner"><span>Berita Berikutnya</span><p>Ini adalah berita terbaru</p></div>`}
                  </li>
                  <li class="post-prev">
                    ${olderPost
                      ? `<a class="prev-post-link" href="${getPostHref(olderPost)}" id="Blog1_blog-pager-older-link" rel="prev">
                           <div class="post-nav-inner"><span>Berita Sebelumnya</span><p>${escapeHtml(olderPost.title)}</p></div>
                         </a>`
                      : `<div class="post-nav-inner"><span>Berita Sebelumnya</span><p>Ini adalah berita pertama</p></div>`}
                  </li>
                </ul>

                <div class="about-author">
                  <div class="avatar-container">
                    <img alt="${escapeHtml(authorInfo.name)}" class="author-avatar" src="${escapeHtml(authorInfo.avatar || DEFAULT_AVATAR)}" onerror="this.src='${DEFAULT_AVATAR}'"/>
                  </div>
                  <h3 class="author-name">
                    <span>Jurnalis / Penulis:</span>
                    <a href="#/author/${encodeURIComponent(authorInfo.name)}">${escapeHtml(authorInfo.name)}</a>
                  </h3>
                  <span class="author-description">${escapeHtml(authorInfo.bio)}</span>
                </div>

                <div id="related-wrap">
                  <div class="title-wrap">
                    <h3>Berita Terkait Lainnya</h3>
                  </div>
                  <div class="related-ready">
                    <ul class="related-posts">
                      ${related.map((rp, idx) => `
                        <li class="related-item item-${idx}">
                          <div class="post-image-wrap">
                            <a class="post-image-link" href="${getPostHref(rp)}">
                              <img class="post-thumb" src="${escapeHtml(rp.featuredImage || state.data.siteInfo.aboutBanner)}" alt="${escapeHtml(rp.title)}" loading="lazy"/>
                            </a>
                          </div>
                          <h2 class="post-title"><a href="${getPostHref(rp)}">${escapeHtml(rp.title)}</a></h2>
                          <div class="post-meta">
                            <span class="post-date">${escapeHtml(formatDateID(rp.published))}</span>
                          </div>
                        </li>
                      `).join('')}
                    </ul>
                  </div>
                </div>

                <!-- Interactive Comments Section -->
                <div class="foxsa-comments-wrap" id="comments-section">
                  <div class="foxsa-comments-header">
                    <h3><i class="fa-regular fa-comments"></i> Tanggapan &amp; Komentar Pembaca</h3>
                    <span class="foxsa-badge">${comments.length} Komentar</span>
                  </div>

                  ${commentsListHtml}

                  <form class="foxsa-comment-form" id="foxsa-add-comment-form">
                    <h4><i class="fa-solid fa-reply" style="color:#F08D39;margin-right:6px;"></i> Tulis Komentar (IC / Warga San Andreas)</h4>
                    <div class="foxsa-form-row">
                      <div class="foxsa-form-group">
                        <label for="comment-author-input">Nama Anda / Karakter IC *</label>
                        <input type="text" id="comment-author-input" class="foxsa-input" value="${state.currentUser ? escapeHtml(state.currentUser.displayName) : ''}" placeholder="Contoh: Akio Asakura / Warga Los Santos" required />
                      </div>
                      <div class="foxsa-form-group">
                        <label for="comment-role-input">Afiliasi / Status (Opsional)</label>
                        <input type="text" id="comment-role-input" class="foxsa-input" value="${state.currentUser ? 'FoxSA News Staff' : ''}" placeholder="Contoh: Citizen / LSPD / LSFD / Pembalap" />
                      </div>
                    </div>
                    <div class="foxsa-form-group">
                      <label for="comment-body-input">Isi Komentar *</label>
                      <textarea id="comment-body-input" class="foxsa-textarea" rows="3" placeholder="Tulis tanggapan atau komentar Anda mengenai berita ini..." required></textarea>
                    </div>
                    <button type="submit" class="foxsa-btn">
                      <i class="fa-solid fa-paper-plane"></i> Kirim Komentar
                    </button>
                  </form>
                </div>

              </div>
            </div>
          </article>
        </div>
      </div>
    `;

    const quickEditBtn = document.getElementById('foxsa-quick-edit-post');
    if (quickEditBtn && isStaffLoggedIn) {
      quickEditBtn.addEventListener('click', () => {
        state.editingPostId = post.id;
        state.adminTab = 'editor';
        window.location.hash = '#/admin';
      });
    }

    const copyLinkBtn = document.getElementById('foxsa-copy-link-btn');
    if (copyLinkBtn) {
      copyLinkBtn.addEventListener('click', (e) => {
        e.preventDefault();
        navigator.clipboard.writeText(window.location.href).then(() => {
          showToast('Tautan berita berhasil disalin!');
        });
      });
    }

    const commentForm = document.getElementById('foxsa-add-comment-form');
    if (commentForm) {
      commentForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const authorVal = document.getElementById('comment-author-input').value.trim();
        const roleVal = document.getElementById('comment-role-input').value.trim();
        const bodyVal = document.getElementById('comment-body-input').value.trim();

        if (!authorVal || !bodyVal) return;

        const knownAuthor = state.data.authors[authorVal];
        const avatarUrl = (knownAuthor && knownAuthor.avatar) ? knownAuthor.avatar : DEFAULT_AVATAR;

        const newComment = {
          id: 'c-' + Date.now(),
          author: authorVal,
          role: roleVal || '',
          avatar: avatarUrl,
          date: new Date().toISOString(),
          body: bodyVal
        };

        if (!Array.isArray(post.comments)) post.comments = [];
        post.comments.push(newComment);
        saveDataToLocal(true);
        showToast('Komentar berhasil ditambahkan!');
        renderSinglePostView(post.id);
      });
    }

    if (isStaffLoggedIn) {
      mainEl.querySelectorAll('[data-del-comment]').forEach(btn => {
        btn.addEventListener('click', () => {
          const cId = btn.getAttribute('data-del-comment');
          if (!confirm('Hapus komentar ini?')) return;
          post.comments = (post.comments || []).filter(c => String(c.id) !== String(cId));
          saveDataToLocal(true);
          showToast('Komentar telah dihapus.');
          renderSinglePostView(post.id);
        });
      });
    }
  }

  // =========================================================================
  // 7. STAFF LOGIN & SIMPLIFIED ZERO-HTML VISUAL ARTICLE EDITOR
  // =========================================================================

  function renderStaffLoginView(initialTab) {
    document.body.className = 'item';
    const mainEl = document.getElementById('main');
    if (!mainEl) return;

    // Detect if register is requested via route or parameter
    const currentTab = (initialTab || (state.currentRoute && state.currentRoute.param === 'register')) ? 'register' : 'login';

    mainEl.innerHTML = `
      <div class="foxsa-login-card">
        <div class="foxsa-auth-tabs">
          <button type="button" class="foxsa-auth-tab ${currentTab === 'login' ? 'active' : ''}" id="auth-tab-btn-login">
            <i class="fa-solid fa-right-to-bracket"></i> Masuk Staff
          </button>
          <button type="button" class="foxsa-auth-tab ${currentTab === 'register' ? 'active' : ''}" id="auth-tab-btn-register">
            <i class="fa-solid fa-user-plus"></i> Registrasi Anggota
          </button>
        </div>

        <!-- TAB LOGIN -->
        <div id="foxsa-auth-panel-login" style="display:${currentTab === 'login' ? 'block' : 'none'};">
          <div class="foxsa-login-header">
            <img src="assets/logo/foxsa-icon.jpg" class="foxsa-login-logo" alt="FoxSA News" />
            <div class="foxsa-login-badge">
              <i class="fa-solid fa-shield-halved"></i> PORTAL REDAKSI FOXSA
            </div>
            <h2>Login Staff &amp; Admin</h2>
            <p>Halaman khusus jurnalis, editor, dan staf redaksi FoxSA News untuk publikasi berita dan kelola portal.</p>
          </div>

          <form id="foxsa-staff-login-form" class="foxsa-login-form">
            <div class="foxsa-form-group">
              <label for="login-username">Username Staff / Admin *</label>
              <div class="foxsa-input-icon-wrap">
                <i class="fa-solid fa-user"></i>
                <input type="text" id="login-username" class="foxsa-input" placeholder="Masukkan username staff..." autocomplete="username" required />
              </div>
            </div>

            <div class="foxsa-form-group">
              <label for="login-password">Password *</label>
              <div class="foxsa-input-icon-wrap">
                <i class="fa-solid fa-lock"></i>
                <input type="password" id="login-password" class="foxsa-input" placeholder="Masukkan password staff..." autocomplete="current-password" required />
                <button type="button" class="foxsa-pwd-toggle" id="login-toggle-pwd" aria-label="Tampilkan Password">
                  <i class="fa-regular fa-eye"></i>
                </button>
              </div>
            </div>

            <div id="login-error-msg" class="foxsa-login-error" style="display:none;">
              <i class="fa-solid fa-triangle-exclamation"></i> Username atau Password salah! Periksa kembali akun staff Anda.
            </div>

            <div class="foxsa-login-actions">
              <button type="submit" class="foxsa-btn foxsa-btn-full">
                <i class="fa-solid fa-right-to-bracket"></i> Masuk ke Panel Redaksi
              </button>
              <a href="#/" class="foxsa-login-back-link">
                <i class="fa-solid fa-arrow-left"></i> Kembali ke Beranda Berita
              </a>
            </div>
          </form>
        </div>

        <!-- TAB REGISTRASI ANGGOTA -->
        <div id="foxsa-auth-panel-register" style="display:${currentTab === 'register' ? 'block' : 'none'};">
          <div class="foxsa-login-header">
            <img src="assets/logo/foxsa-icon.jpg" class="foxsa-login-logo" alt="FoxSA News" />
            <div class="foxsa-login-badge" style="background:rgba(16, 185, 129, 0.14);color:#059669;">
              <i class="fa-solid fa-id-card"></i> PENDAFTARAN ANGGOTA
            </div>
            <h2>Registrasi Anggota Baru</h2>
            <p>Khusus calon jurnalis &amp; staf yang telah diterima di tim redaksi FoxSA News Agency.</p>
          </div>

          <form id="foxsa-staff-register-form" class="foxsa-login-form">
            <div class="foxsa-form-group">
              <label for="reg-username">Username Login (Tanpa spasi) *</label>
              <div class="foxsa-input-icon-wrap">
                <i class="fa-solid fa-at"></i>
                <input type="text" id="reg-username" class="foxsa-input" placeholder="Contoh: kevin (huruf kecil &amp; angka)" autocomplete="username" required />
              </div>
            </div>

            <div class="foxsa-form-group">
              <label for="reg-name">Nama Lengkap IC / Reporter *</label>
              <div class="foxsa-input-icon-wrap">
                <i class="fa-solid fa-signature"></i>
                <input type="text" id="reg-name" class="foxsa-input" placeholder="Contoh: Kevin Salvatore" required />
              </div>
            </div>

            <div class="foxsa-form-group">
              <label for="reg-role">Departemen / Jabatan yang Diajukan *</label>
              <select id="reg-role" class="foxsa-select">
                ${renderRoleOptionsHtml('Junior Reporter', { excludeHighStaff: true })}
              </select>
              <small style="color:#64748b;font-size:11.5px;margin-top:4px;display:block;">
                <i class="fa-solid fa-circle-info"></i> Jabatan resmi operasional akan diverifikasi &amp; di-ACC oleh High Staff FoxSA.
              </small>
            </div>

            <div class="foxsa-form-group">
              <label for="reg-password">Password Baru *</label>
              <div class="foxsa-input-icon-wrap">
                <i class="fa-solid fa-lock"></i>
                <input type="password" id="reg-password" class="foxsa-input" placeholder="Minimal 4 karakter..." autocomplete="new-password" required />
                <button type="button" class="foxsa-pwd-toggle" id="reg-toggle-pwd" aria-label="Tampilkan Password">
                  <i class="fa-regular fa-eye"></i>
                </button>
              </div>
            </div>

            <div class="foxsa-form-group">
              <label for="reg-confirm-password">Konfirmasi Password *</label>
              <div class="foxsa-input-icon-wrap">
                <i class="fa-solid fa-lock"></i>
                <input type="password" id="reg-confirm-password" class="foxsa-input" placeholder="Ulangi password..." autocomplete="new-password" required />
              </div>
            </div>

            <div id="reg-error-msg" class="foxsa-login-error" style="display:none;"></div>

            <div class="foxsa-login-actions">
              <button type="submit" class="foxsa-btn foxsa-btn-full" style="background:#090C1E;border-color:#090C1E;">
                <i class="fa-solid fa-user-check"></i> Selesaikan Registrasi
              </button>
              <a href="#/" class="foxsa-login-back-link">
                <i class="fa-solid fa-arrow-left"></i> Kembali ke Beranda Berita
              </a>
            </div>
          </form>
        </div>
      </div>
    `;

    const tabBtnLogin = document.getElementById('auth-tab-btn-login');
    const tabBtnRegister = document.getElementById('auth-tab-btn-register');
    const panelLogin = document.getElementById('foxsa-auth-panel-login');
    const panelRegister = document.getElementById('foxsa-auth-panel-register');

    if (tabBtnLogin && tabBtnRegister) {
      tabBtnLogin.addEventListener('click', () => {
        tabBtnLogin.classList.add('active');
        tabBtnRegister.classList.remove('active');
        panelLogin.style.display = 'block';
        panelRegister.style.display = 'none';
      });
      tabBtnRegister.addEventListener('click', () => {
        tabBtnRegister.classList.add('active');
        tabBtnLogin.classList.remove('active');
        panelRegister.style.display = 'block';
        panelLogin.style.display = 'none';
      });
    }

    // Toggle Password in Login
    const passInp = document.getElementById('login-password');
    const togglePwdBtn = document.getElementById('login-toggle-pwd');
    if (togglePwdBtn && passInp) {
      togglePwdBtn.addEventListener('click', () => {
        const isPwd = passInp.type === 'password';
        passInp.type = isPwd ? 'text' : 'password';
        togglePwdBtn.innerHTML = isPwd ? '<i class="fa-regular fa-eye-slash"></i>' : '<i class="fa-regular fa-eye"></i>';
      });
    }

    // Toggle Password in Register
    const regPassInp = document.getElementById('reg-password');
    const regToggleBtn = document.getElementById('reg-toggle-pwd');
    if (regToggleBtn && regPassInp) {
      regToggleBtn.addEventListener('click', () => {
        const isPwd = regPassInp.type === 'password';
        regPassInp.type = isPwd ? 'text' : 'password';
        regToggleBtn.innerHTML = isPwd ? '<i class="fa-regular fa-eye-slash"></i>' : '<i class="fa-regular fa-eye"></i>';
      });
    }

    // Handle Login Submit
    const loginForm = document.getElementById('foxsa-staff-login-form');
    const loginUserInp = document.getElementById('login-username');
    const loginErrBox = document.getElementById('login-error-msg');

    if (loginForm) {
      loginForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const res = loginStaff(loginUserInp.value, passInp.value);
        if (res && res.success) {
          showToast(`Selamat datang, ${state.currentUser.displayName}!`);
          renderAdminView();
        } else if (res && res.reason === 'pending_approval') {
          if (loginErrBox) {
            loginErrBox.style.display = 'flex';
            loginErrBox.style.background = '#fffbeb';
            loginErrBox.style.color = '#b45309';
            loginErrBox.style.borderColor = '#fde68a';
            loginErrBox.innerHTML = `
              <div style="display:flex;align-items:flex-start;gap:8px;">
                <i class="fa-solid fa-hourglass-half" style="color:#d97706;font-size:16px;margin-top:2px;"></i>
                <div>
                  <strong>Menunggu ACC High Staff!</strong><br/>
                  Akun <code>@${escapeHtml(loginUserInp.value)}</code> sedang menunggu verifikasi &amp; persetujuan (ACC) dari High Staff FoxSA News Agency sebelum dapat login.
                </div>
              </div>
            `;
          }
        } else {
          if (loginErrBox) {
            loginErrBox.style.display = 'flex';
            loginErrBox.style.background = '#fee2e2';
            loginErrBox.style.color = '#991b1b';
            loginErrBox.style.borderColor = '#fecaca';
            loginErrBox.innerHTML = '<i class="fa-solid fa-triangle-exclamation"></i> Username atau Password salah! Periksa kembali akun staff Anda.';
          }
          passInp.value = '';
          passInp.focus();
        }
      });
    }

    // Handle Register Submit
    const regForm = document.getElementById('foxsa-staff-register-form');
    const regUserInp = document.getElementById('reg-username');
    const regNameInp = document.getElementById('reg-name');
    const regRoleSelect = document.getElementById('reg-role');
    const regConfirmInp = document.getElementById('reg-confirm-password');
    const regErrBox = document.getElementById('reg-error-msg');

    if (regForm) {
      regForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const username = regUserInp.value.trim().toLowerCase().replace(/\s+/g, '');
        const displayName = regNameInp.value.trim();
        const role = regRoleSelect.value.trim() || 'Junior Reporter';
        const password = regPassInp.value.trim();
        const confirmPassword = regConfirmInp.value.trim();

        if (regErrBox) regErrBox.style.display = 'none';

        if (!username || !displayName || !password) {
          if (regErrBox) {
            regErrBox.innerHTML = '<i class="fa-solid fa-triangle-exclamation"></i> Harap lengkapi semua kolom pendaftaran!';
            regErrBox.style.display = 'flex';
          }
          return;
        }

        if (password.length < 4) {
          if (regErrBox) {
            regErrBox.innerHTML = '<i class="fa-solid fa-triangle-exclamation"></i> Password minimal terdiri dari 4 karakter!';
            regErrBox.style.display = 'flex';
          }
          return;
        }

        if (password !== confirmPassword) {
          if (regErrBox) {
            regErrBox.innerHTML = '<i class="fa-solid fa-triangle-exclamation"></i> Konfirmasi password tidak cocok!';
            regErrBox.style.display = 'flex';
          }
          return;
        }

        const accounts = state.data.staffAccounts || [];
        if (accounts.some(a => a.username.toLowerCase() === username)) {
          if (regErrBox) {
            regErrBox.innerHTML = '<i class="fa-solid fa-triangle-exclamation"></i> Username tersebut sudah digunakan. Gunakan username lain.';
            regErrBox.style.display = 'flex';
          }
          return;
        }

        const newAccount = {
          username,
          password,
          displayName,
          authorName: displayName,
          role,
          status: 'pending',
          isAdmin: false,
          createdAt: new Date().toISOString(),
          avatar: DEFAULT_AVATAR
        };

        state.data.staffAccounts.push(newAccount);
        saveDataToLocal(true);

        panelRegister.innerHTML = `
          <div class="foxsa-reg-pending-alert">
            <div style="font-size:32px;margin-bottom:10px;">⏳</div>
            <h3 style="margin:0 0 8px;color:#92400e;font-size:17px;font-family:'Poppins',sans-serif;">Pendaftaran Berhasil Terkirim!</h3>
            <p style="margin:0 0 12px;font-size:13px;color:#78350f;line-height:1.6;">
              Terima kasih, <strong>${escapeHtml(displayName)}</strong>! Akun Anda dengan username <code>@${escapeHtml(username)}</code> telah tersimpan dan saat ini berstatus <strong>Menunggu ACC (Approval) dari High Staff</strong> FoxSA News Agency.
            </p>
            <div style="background:#fff;border:1px solid #fde68a;border-radius:8px;padding:12px 14px;margin-bottom:16px;text-align:left;font-size:12.5px;color:#78350f;">
              <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:6px;">
                <span>Jabatan Diajukan:</span>
                ${renderRoleBadgeHtml(role)}
              </div>
              <div style="display:flex;align-items:center;justify-content:space-between;">
                <span>Status Akun:</span>
                <span class="foxsa-pending-badge" style="margin-left:0;">Pending High Staff Review</span>
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
            renderStaffLoginView('login');
          });
        }

        showToast('Pendaftaran terkirim! Menunggu ACC High Staff.');
      });
    }
  }

  function renderAdminView() {
    if (!state.currentUser) {
      renderStaffLoginView();
      return;
    }

    document.body.className = 'item';
    const mainEl = document.getElementById('main');
    if (!mainEl) return;

    const totalPosts = state.data.posts.length;
    const totalComments = state.data.posts.reduce((acc, p) => acc + ((p.comments && p.comments.length) || 0), 0);
    const allStaffList = state.data.staffAccounts || [];
    const pendingStaff = allStaffList.filter(a => a.status === 'pending');
    const approvedStaff = allStaffList.filter(a => a.status !== 'pending');
    const isUserHighStaff = isHighStaff(state.currentUser);

    let tabContentHtml = '';

    // TAB 1: DAFTAR BERITA
    if (state.adminTab === 'posts') {
      tabContentHtml = `
        <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:16px;flex-wrap:wrap;gap:10px;">
          <div>
            <strong>Total Berita Roleplay: ${totalPosts} Artikel</strong>
          </div>
          <button type="button" class="foxsa-btn" id="admin-new-post-btn">
            <i class="fa-solid fa-plus"></i> Tulis Berita Baru
          </button>
        </div>
        <div class="foxsa-table-responsive">
          <table class="foxsa-admin-table">
            <thead>
              <tr>
                <th>Thumb</th>
                <th>Judul &amp; Kategori</th>
                <th>Penulis</th>
                <th>Tanggal</th>
                <th>Populer</th>
                <th>Aksi</th>
              </tr>
            </thead>
            <tbody>
              ${state.data.posts.map(p => `
                <tr>
                  <td>
                    <img class="foxsa-admin-thumb" src="${escapeHtml(p.featuredImage || state.data.siteInfo.aboutBanner)}" alt="thumb"/>
                  </td>
                  <td>
                    <a href="${getPostHref(p)}" style="font-weight:700;color:#090C1E;display:block;margin-bottom:4px;">${escapeHtml(p.title)}</a>
                    <div>
                      ${(p.labels || []).map(l => `<span class="foxsa-badge">#${escapeHtml(l)}</span>`).join('')}
                      ${(p.comments && p.comments.length > 0) ? `<span class="foxsa-badge" style="background:#e0f2fe;color:#0369a1;"><i class="fa-regular fa-comment"></i> ${p.comments.length}</span>` : ''}
                    </div>
                  </td>
                  <td>
                    <div style="font-weight:600;color:#090C1E;">${escapeHtml(p.author)}</div>
                    <div style="margin-top:4px;display:flex;align-items:center;gap:6px;flex-wrap:wrap;">
                      ${renderRoleBadgeHtml(p.authorBio)}
                      ${isHighStaff(state.currentUser) ? `
                        <button type="button" class="foxsa-role-badge-btn" data-set-post-role="${escapeHtml(p.id)}" title="Ubah Jabatan/Role Penulis Artikel Ini">
                          <i class="fa-solid fa-user-gear"></i> Set Role
                        </button>
                      ` : ''}
                    </div>
                  </td>
                  <td style="white-space:nowrap;">${escapeHtml(formatDateID(p.published))}</td>
                  <td style="text-align:center;">
                    <button type="button" class="foxsa-editor-btn" data-toggle-pop="${escapeHtml(p.id)}" title="Tampilkan di Most Popular">
                      <i class="fa-${p.popular ? 'solid' : 'regular'} fa-star" style="color:${p.popular ? '#F08D39' : '#999'};"></i>
                    </button>
                  </td>
                  <td style="white-space:nowrap;">
                    <button type="button" class="foxsa-editor-btn" data-edit-post="${escapeHtml(p.id)}" title="Edit Berita">
                      <i class="fa-solid fa-pen"></i> Edit
                    </button>
                    <button type="button" class="foxsa-editor-btn" style="color:#dc2626;border-color:#fecaca;" data-delete-post="${escapeHtml(p.id)}" title="Hapus Berita">
                      <i class="fa-solid fa-trash"></i>
                    </button>
                  </td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>
      `;
    }

    // TAB 2: VISUAL STUDIO EDITOR (ZERO HTML CODE — SIMPLE & PROFESSIONAL)
    else if (state.adminTab === 'editor') {
      const editingPost = state.editingPostId
        ? state.data.posts.find(p => p.id === state.editingPostId)
        : null;

      if (editingPost) {
        state.selectedEditorLabels = Array.isArray(editingPost.labels) && editingPost.labels.length > 0
          ? [...editingPost.labels]
          : ['Crime'];
      } else if (!Array.isArray(state.selectedEditorLabels) || state.selectedEditorLabels.length === 0) {
        state.selectedEditorLabels = ['Crime', 'LSPD'];
      }

      const authorNames = Object.keys(state.data.authors || {});
      const loggedInAuthor = (state.currentUser && state.currentUser.authorName) || authorNames[0] || 'Arthur Redfields';
      const defaultAuthorName = editingPost ? editingPost.author : loggedInAuthor;
      const defaultAuthorObj = state.data.authors[defaultAuthorName] || {};

      const titleVal = editingPost ? editingPost.title : '';
      const authorVal = editingPost ? editingPost.author : defaultAuthorName;
      const authorAvatarVal = editingPost ? (editingPost.authorAvatar || defaultAuthorObj.avatar || DEFAULT_AVATAR) : (defaultAuthorObj.avatar || DEFAULT_AVATAR);
      const authorBioVal = editingPost ? (editingPost.authorBio || defaultAuthorObj.bio || '') : (defaultAuthorObj.bio || '');
      const imageVal = editingPost ? (editingPost.featuredImage || '') : '';
      const popularChecked = editingPost ? !!editingPost.popular : true;
      const dateVal = editingPost && editingPost.published
        ? new Date(editingPost.published).toISOString().slice(0, 16)
        : new Date().toISOString().slice(0, 16);

      const initialVisualHtml = editingPost
        ? cleanBloggerHtmlForVisualEditor(editingPost.content)
        : `<p><strong>Los Santos, FoxSA News</strong> — Ketik paragraf pembuka berita di sini. Tekan Enter untuk membuat paragraf baru secara otomatis...</p><p>Tulis kronologi kejadian dan keterangan saksi atau pihak berwenang di sini...</p>`;

      const allCategories = getAllAvailableCategories();

      tabContentHtml = `
        <form id="foxsa-post-editor-form">
          <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:16px;flex-wrap:wrap;gap:8px;">
            <div>
              <h3 style="margin:0;color:#090C1E;">
                ${editingPost ? `<i class="fa-solid fa-pen-to-square" style="color:#F08D39;"></i> Edit Artikel Berita` : `<i class="fa-solid fa-feather-pointed" style="color:#F08D39;"></i> Studio Penulisan Berita Baru`}
              </h3>
              <span style="font-size:12px;color:#666;">Ketik langsung seperti di Microsoft Word / Google Docs — tanpa perlu kode HTML!</span>
            </div>
            ${editingPost ? `<button type="button" class="foxsa-btn foxsa-btn-outline" id="editor-cancel-btn" style="padding:6px 12px;font-size:12px;">Batal Edit</button>` : ''}
          </div>

          <!-- LANGKAH 1: JUDUL & KATEGORI -->
          <div class="foxsa-editor-step-card">
            <div class="step-card-badge">1. Judul &amp; Kategori Berita</div>
            <div class="foxsa-form-group">
              <label>Judul Headline Berita *</label>
              <input type="text" id="post-title-input" class="foxsa-input foxsa-title-big-input" value="${escapeHtml(titleVal)}" placeholder="Contoh: Polisi Lakukan Pengejaran di Los Santos, Dua Pelaku Berhasil Diamankan" required />
            </div>

            <div class="foxsa-form-group" style="margin-bottom:0;">
              <label><i class="fa-solid fa-tags" style="color:#F08D39;"></i> Pilih Kategori Berita (Tinggal Klik / Tap, Bisa Pilih Lebih dari 1) *</label>
              <div class="foxsa-smart-cat-box">
                <div class="foxsa-smart-cat-pills" id="editor-category-pills">
                  ${allCategories.map(cat => {
                    const isSelected = state.selectedEditorLabels.some(s => s.toLowerCase() === cat.toLowerCase());
                    return `
                      <button type="button" class="foxsa-selectable-pill ${isSelected ? 'selected' : ''}" data-toggle-cat="${escapeHtml(cat)}">
                        <i class="fa-solid ${isSelected ? 'fa-circle-check' : 'fa-plus'}"></i>
                        <span>${escapeHtml(cat)}</span>
                      </button>
                    `;
                  }).join('')}
                </div>

                <div class="foxsa-smart-cat-controls">
                  <div class="foxsa-smart-cat-dropdown-col">
                    <select id="editor-category-dropdown" class="foxsa-select">
                      <option value="">-- Atau Pilih Cepat dari Dropdown Kategori --</option>
                      ${allCategories.map(cat => `<option value="${escapeHtml(cat)}">+ Pilih: ${escapeHtml(cat)}</option>`).join('')}
                    </select>
                  </div>
                  <div class="foxsa-smart-cat-custom-col">
                    <input type="text" id="editor-new-cat-input" class="foxsa-input" placeholder="Ketik kategori baru..." />
                    <button type="button" class="foxsa-btn foxsa-btn-secondary" id="editor-add-new-cat-btn" style="white-space:nowrap;">
                      <i class="fa-solid fa-plus"></i> Buat
                    </button>
                  </div>
                </div>

                <div class="foxsa-selected-cat-summary" id="editor-selected-summary"></div>
                <input type="hidden" id="post-labels-input" value="${escapeHtml(state.selectedEditorLabels.join(', '))}" />
              </div>
            </div>
          </div>

          <!-- LANGKAH 2: SAMPUL / FOTO UTAMA BERITA -->
          <div class="foxsa-editor-step-card">
            <div class="step-card-badge">2. Foto Sampul Utama (Thumbnail)</div>
            <div class="foxsa-cover-upload-row">
              <div class="foxsa-cover-preview" id="editor-cover-preview-box">
                ${imageVal
                  ? `<img src="${escapeHtml(imageVal)}" alt="Preview Sampul" />`
                  : `<div class="cover-empty"><i class="fa-regular fa-image"></i><span>Belum ada foto sampul</span></div>`}
              </div>
              <div class="foxsa-cover-inputs">
                <label class="foxsa-btn" style="cursor:pointer;margin-bottom:8px;width:fit-content;">
                  <i class="fa-solid fa-camera"></i> Upload Foto Sampul dari HP / PC
                  <input type="file" id="post-image-file" accept="image/*" style="display:none;" />
                </label>
                <div style="font-size:12px;color:#666;margin-bottom:6px;">Atau tempel (paste) link URL gambar di bawah:</div>
                <input type="text" id="post-image-input" class="foxsa-input" value="${escapeHtml(imageVal)}" placeholder="https://..." />
              </div>
            </div>
          </div>

          <!-- LANGKAH 3: ISI ARTIKEL BERITA (VISUAL EDITOR TANPA KODE HTML) -->
          <div class="foxsa-editor-step-card">
            <div class="step-card-badge">3. Tulis Isi Artikel Berita (Visual Editor — Tanpa Koding!)</div>

            <div class="foxsa-visual-editor-wrap">
              <!-- Simple Word-like Toolbar -->
              <div class="foxsa-visual-toolbar">
                <button type="button" class="vtool-btn" data-vcmd="bold" title="Tebalkan Teks (Bold)">
                  <i class="fa-solid fa-bold"></i> <span>Tebal</span>
                </button>
                <button type="button" class="vtool-btn" data-vcmd="italic" title="Miringkan Teks (Italic)">
                  <i class="fa-solid fa-italic"></i> <span>Miring</span>
                </button>
                <button type="button" class="vtool-btn" id="vtool-add-Location" title="Sisipkan Awalan Kota (Los Santos, FoxSA News —)">
                  <i class="fa-solid fa-location-dot" style="color:#F08D39;"></i> <span>+ Lokasi Kota</span>
                </button>
                <button type="button" class="vtool-btn" id="vtool-add-heading" title="Tambah Sub-Judul Bagian">
                  <i class="fa-solid fa-heading"></i> <span>+ Sub-Judul</span>
                </button>
                <button type="button" class="vtool-btn" id="vtool-add-quote" title="Tambah Kotak Kutipan Narasumber">
                  <i class="fa-solid fa-quote-left" style="color:#F08D39;"></i> <span>+ Kutipan</span>
                </button>

                <div class="vtool-divider"></div>

                <!-- Insert Image directly from Device or URL into the visual editor -->
                <label class="vtool-btn vtool-btn-accent" style="cursor:pointer;margin:0;" title="Upload Foto dari HP/PC ke dalam Isi Berita">
                  <i class="fa-solid fa-image"></i> <span>+ Upload Foto ke Artikel</span>
                  <input type="file" id="vtool-inline-img-file" accept="image/*" style="display:none;" />
                </label>
                <button type="button" class="vtool-btn" id="vtool-insert-img-url" title="Sisipkan Foto via Link URL">
                  <i class="fa-solid fa-link"></i> <span>+ Foto via Link</span>
                </button>
              </div>

              <!-- WYSIWYG Visual Writing Canvas -->
              <div id="foxsa-visual-canvas" class="foxsa-visual-canvas post-body foxsa-clean-prose" contenteditable="true" spellcheck="false">${initialVisualHtml}</div>

              <div class="foxsa-visual-footer-hint">
                <span><i class="fa-regular fa-lightbulb" style="color:#F08D39;"></i> <strong>Tips:</strong> Langsung ketik cerita berita di kotak putih di atas. Tekan <strong>Enter</strong> untuk paragraf baru. Klik <strong>+ Upload Foto ke Artikel</strong> jika ingin menaruh foto dokumentasi di tengah berita.</span>
              </div>
            </div>
          </div>

          ${isHighStaff(state.currentUser) ? `
            <!-- PENGATURAN REDAKSI & JABATAN PENULIS (KHUSUS HIGH STAFF / ADMIN) -->
            <div class="foxsa-editor-step-card foxsa-admin-override-card">
              <div class="step-card-badge" style="background:#090C1E;color:#F08D39;">
                <i class="fa-solid fa-user-shield"></i> Pengaturan Penulis &amp; Role Resmi (Khusus High Staff)
              </div>
              <p style="font-size:12px;color:#64748b;margin:6px 0 14px;">High Staff dapat menentukan nama jurnalis yang memposting berita ini dan mengatur jabatan resminya dari 14 role hierarki FoxSA.</p>
              <div class="foxsa-form-row" style="margin-bottom:0;">
                <div class="foxsa-form-group">
                  <label>Pilih Penulis Berita</label>
                  <select id="post-author-select" class="foxsa-select">
                    ${(state.data.staffAccounts || []).map(acc => {
                      const name = acc.authorName || acc.displayName;
                      const isSelected = name.toLowerCase() === authorVal.toLowerCase();
                      return `<option value="${escapeHtml(name)}" data-role="${escapeHtml(acc.role || '')}" data-avatar="${escapeHtml(acc.avatar || DEFAULT_AVATAR)}" ${isSelected ? 'selected' : ''}>${escapeHtml(acc.displayName)} (${escapeHtml(acc.role)})</option>`;
                    }).join('')}
                    <option value="__custom__" ${!(state.data.staffAccounts || []).some(a => (a.authorName || a.displayName).toLowerCase() === authorVal.toLowerCase()) ? 'selected' : ''}>+ Tulis Nama Penulis Lainnya...</option>
                  </select>
                </div>
                <div class="foxsa-form-group" id="post-author-custom-group" style="display:${!(state.data.staffAccounts || []).some(a => (a.authorName || a.displayName).toLowerCase() === authorVal.toLowerCase()) ? 'block' : 'none'};">
                  <label>Nama Penulis Custom *</label>
                  <input type="text" id="post-author-custom-input" class="foxsa-input" value="${escapeHtml(authorVal)}" placeholder="Nama Penulis..." />
                </div>
                <div class="foxsa-form-group">
                  <label>Role / Jabatan Resmi Penulis *</label>
                  <select id="post-author-role-select" class="foxsa-select">
                    ${renderRoleOptionsHtml(authorBioVal)}
                    <option value="__custom__" ${!OFFICIAL_ROLES.some(r => r.name.toLowerCase() === (authorBioVal || '').toLowerCase()) ? 'selected' : ''}>+ Custom / Jabatan Lainnya</option>
                  </select>
                  <input type="text" id="post-author-role-input" class="foxsa-input" value="${escapeHtml(authorBioVal)}" placeholder="Ketik jabatan..." style="margin-top:6px;display:${!OFFICIAL_ROLES.some(r => r.name.toLowerCase() === (authorBioVal || '').toLowerCase()) ? 'block' : 'none'};" required />
                </div>
              </div>
            </div>
          ` : `
            <!-- INFORMASI PENULIS OTOMATIS (UNTUK STAFF) -->
            <div class="foxsa-staff-author-preview" style="display:flex;align-items:center;gap:12px;padding:12px 16px;background:#f8fafc;border-radius:10px;border:1px solid #e2e8f0;margin:18px 0 10px;">
              <img src="${escapeHtml(state.currentUser.avatar || DEFAULT_AVATAR)}" alt="${escapeHtml(state.currentUser.displayName)}" style="width:40px;height:40px;border-radius:50%;object-fit:cover;" onerror="this.src='${DEFAULT_AVATAR}'" />
              <div>
                <div style="font-size:11.5px;color:#64748b;text-transform:uppercase;letter-spacing:0.5px;font-weight:700;">Identitas Jurnalis</div>
                <strong style="color:#090C1E;font-size:14px;">${escapeHtml(state.currentUser.authorName || state.currentUser.displayName)}</strong>
                <span style="margin-left:6px;">${renderRoleBadgeHtml(state.currentUser.role)}</span>
              </div>
            </div>
          `}

          <div style="margin: 14px 0 16px;">
            <label style="display:inline-flex;align-items:center;gap:8px;cursor:pointer;font-size:13.5px;font-weight:600;color:#1E2438;">
              <input type="checkbox" id="post-popular-input" ${popularChecked ? 'checked' : ''} style="width:17px;height:17px;accent-color:#F08D39;" />
              <span>🔥 Tampilkan di Berita Terpopuler</span>
            </label>
          </div>

          <div style="display:flex;gap:12px;align-items:center;flex-wrap:wrap;margin-top:18px;">
            <button type="submit" class="foxsa-btn" style="padding:13px 26px;font-size:14px;">
              <i class="fa-solid fa-paper-plane"></i> ${editingPost ? 'Simpan Perubahan Berita' : 'Publikasikan Berita Sekarang'}
            </button>
            <button type="button" class="foxsa-btn foxsa-btn-outline" id="editor-back-list-btn">
              Kembali ke Daftar Berita
            </button>
          </div>
        </form>
      `;
    }

    // TAB 3: KELOLA KOMENTAR
    else if (state.adminTab === 'comments') {
      const allComments = [];
      state.data.posts.forEach(p => {
        (p.comments || []).forEach(c => {
          allComments.push({
            ...c,
            postId: p.id,
            postTitle: p.title
          });
        });
      });
      allComments.sort((a, b) => new Date(b.date) - new Date(a.date));

      tabContentHtml = `
        <div style="margin-bottom:14px;">
          <strong>Total Komentar di Seluruh Berita: ${allComments.length} Komentar</strong>
        </div>
        ${allComments.length === 0
          ? `<div class="foxsa-no-comments">Belum ada komentar.</div>`
          : `<div class="foxsa-table-responsive">
               <table class="foxsa-admin-table">
                 <thead>
                   <tr>
                     <th>Penulis</th>
                     <th>Isi Komentar</th>
                     <th>Pada Berita</th>
                     <th>Tanggal</th>
                     <th>Aksi</th>
                   </tr>
                 </thead>
                 <tbody>
                   ${allComments.map(c => `
                     <tr>
                       <td>
                         <strong>${escapeHtml(c.author)}</strong>
                         ${c.role ? `<br/><span class="foxsa-badge">${escapeHtml(c.role)}</span>` : ''}
                       </td>
                       <td>${escapeHtml(c.body)}</td>
                       <td><a href="#/post/${escapeHtml(c.postId)}" style="color:#F08D39;font-weight:600;">${escapeHtml(c.postTitle)}</a></td>
                       <td style="white-space:nowrap;">${escapeHtml(formatDateTimeID(c.date))}</td>
                       <td>
                         <button type="button" class="foxsa-editor-btn" style="color:#dc2626;border-color:#fecaca;" data-admin-del-comment="${escapeHtml(c.id)}" data-post-id="${escapeHtml(c.postId)}">
                           <i class="fa-solid fa-trash"></i> Hapus
                         </button>
                       </td>
                     </tr>
                   `).join('')}
                 </tbody>
               </table>
             </div>`
        }
      `;
    }

    // TAB 4: KELOLA STAFF, PERSETUJUAN (ACC), & PASSWORD
    else if (state.adminTab === 'staff') {
      tabContentHtml = `
        <div class="foxsa-status-box">
          <strong><i class="fa-solid fa-users-gear" style="color:#F08D39;"></i> Struktur Tim Redaksi &amp; Manajemen Akun Staff FoxSA:</strong>
          <p style="margin:6px 0 0;">
            Hierarki resmi FoxSA News Network terdiri dari 5 tingkatan jabatan resmi.
            ${isUserHighStaff ? 'Sebagai <strong>High Staff / Admin</strong>, Anda memiliki wewenang untuk menyetujui (ACC) pendaftaran baru, menetapkan role, dan mengelola staf.' : 'Anda dapat memperbarui password akun redaksi Anda di bawah.'}
          </p>
        </div>

        ${pendingStaff.length > 0 ? (
          isUserHighStaff ? `
            <div class="foxsa-pending-acc-box">
              <div class="foxsa-pending-acc-header">
                <h4>
                  <i class="fa-solid fa-user-clock" style="color:#ea580c;"></i>
                  Permintaan Registrasi Anggota — Menunggu ACC High Staff (${pendingStaff.length})
                </h4>
                <p>
                  Calon staf berikut telah mendaftar dan menunggu persetujuan (ACC). Silakan sesuaikan jabatan resmi sebelum mengaktifkan akun mereka.
                </p>
              </div>
              <div class="foxsa-table-responsive">
                <table class="foxsa-admin-table">
                  <thead>
                    <tr>
                      <th>Username</th>
                      <th>Nama Lengkap IC</th>
                      <th>Waktu Daftar</th>
                      <th>Pilihan Role Resmi</th>
                      <th>Tindakan ACC</th>
                    </tr>
                  </thead>
                  <tbody>
                    ${pendingStaff.map(acc => `
                      <tr>
                        <td><code>@${escapeHtml(acc.username)}</code></td>
                        <td><strong>${escapeHtml(acc.displayName)}</strong></td>
                        <td style="font-size:12px;color:#64748b;white-space:nowrap;">
                          ${escapeHtml(acc.createdAt ? formatDateID(acc.createdAt) : 'Baru saja')}
                        </td>
                        <td>
                          <select class="foxsa-select" style="padding:6px 10px;font-size:12px;min-width:180px;" data-acc-role-select="${escapeHtml(acc.username)}">
                            ${renderRoleOptionsHtml(acc.role || 'Junior Reporter')}
                          </select>
                        </td>
                        <td style="white-space:nowrap;">
                          <button type="button" class="foxsa-btn" style="padding:6px 14px;font-size:12px;background:#16a34a;border-color:#16a34a;margin-right:6px;" data-approve-staff="${escapeHtml(acc.username)}">
                            <i class="fa-solid fa-check"></i> ACC &amp; Aktifkan
                          </button>
                          <button type="button" class="foxsa-editor-btn" style="padding:6px 10px;font-size:12px;color:#dc2626;border-color:#fecaca;" data-reject-staff="${escapeHtml(acc.username)}" title="Tolak Registrasi">
                            <i class="fa-solid fa-xmark"></i> Tolak
                          </button>
                        </td>
                      </tr>
                    `).join('')}
                  </tbody>
                </table>
              </div>
            </div>
          ` : `
            <div class="foxsa-status-box" style="background:#fffbeb;border-color:#fde68a;margin-bottom:20px;">
              <strong style="color:#b45309;"><i class="fa-solid fa-hourglass-half"></i> ${pendingStaff.length} Calon Anggota Menunggu ACC:</strong>
              <p style="margin:4px 0 0;font-size:12.5px;color:#78350f;">
                Terdapat ${pendingStaff.length} pendaftaran anggota baru yang sedang menunggu verifikasi dan persetujuan (ACC) dari High Staff FoxSA.
              </p>
            </div>
          `
        ) : ''}

        <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:12px;flex-wrap:wrap;gap:10px;">
          <h4 style="margin:0;font-size:15px;color:#090C1E;display:flex;align-items:center;gap:8px;">
            <i class="fa-solid fa-id-badge" style="color:#2563eb;"></i>
            Daftar Anggota Staf Aktif (${approvedStaff.length})
          </h4>
          <button type="button" class="foxsa-btn foxsa-btn-outline" id="btn-copy-register-link" style="padding:6px 14px;font-size:12px;">
            <i class="fa-solid fa-share-nodes"></i> Bagikan Link Registrasi
          </button>
        </div>

        <div class="foxsa-table-responsive" style="margin-bottom:24px;">
          <table class="foxsa-admin-table">
            <thead>
              <tr>
                <th>Username</th>
                <th>Nama Jurnalis / Staf</th>
                <th>Jabatan / Role Resmi</th>
                <th>Password</th>
                <th>Aksi</th>
              </tr>
            </thead>
            <tbody>
              ${approvedStaff.map(acc => `
                <tr>
                  <td><code>@${escapeHtml(acc.username)}</code></td>
                  <td><strong>${escapeHtml(acc.displayName)}</strong></td>
                  <td>${renderRoleBadgeHtml(acc.role)}</td>
                  <td>
                    <span class="pwd-mask" data-pwd="${escapeHtml(acc.password)}">••••••••</span>
                    <button type="button" class="foxsa-editor-btn" style="padding:2px 6px;font-size:11px;margin-left:6px;" data-show-staff-pwd="${escapeHtml(acc.username)}">
                      <i class="fa-regular fa-eye"></i>
                    </button>
                  </td>
                  <td style="white-space:nowrap;">
                    ${isUserHighStaff ? `
                      <button type="button" class="foxsa-editor-btn" style="color:#0284c7;border-color:#bae6fd;" data-edit-staff-role="${escapeHtml(acc.username)}" title="Ubah Jabatan/Role Resmi">
                        <i class="fa-solid fa-user-tag"></i> Set Role
                      </button>
                    ` : ''}
                    <button type="button" class="foxsa-editor-btn" data-change-pwd="${escapeHtml(acc.username)}">
                      <i class="fa-solid fa-key"></i> Ubah Password
                    </button>
                    ${acc.username !== 'admin' && (isUserHighStaff || acc.username === state.currentUser.username) ? `
                      <button type="button" class="foxsa-editor-btn" style="color:#dc2626;border-color:#fecaca;" data-del-staff="${escapeHtml(acc.username)}" title="Hapus Akun">
                        <i class="fa-solid fa-trash"></i>
                      </button>
                    ` : ''}
                  </td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>

        ${isUserHighStaff ? `
          <div class="foxsa-comment-form">
            <h4><i class="fa-solid fa-user-plus" style="color:#F08D39;"></i> Tambah Anggota Staf Langsung (Bypass ACC)</h4>
            <form id="foxsa-add-staff-form">
              <div class="foxsa-form-row">
                <div class="foxsa-form-group">
                  <label>Username Login (Tanpa spasi) *</label>
                  <input type="text" id="new-staff-username" class="foxsa-input" placeholder="Contoh: kevin" required />
                </div>
                <div class="foxsa-form-group">
                  <label>Password Login *</label>
                  <input type="text" id="new-staff-password" class="foxsa-input" placeholder="Contoh: kevinfoxsa" required />
                </div>
              </div>
              <div class="foxsa-form-row">
                <div class="foxsa-form-group">
                  <label>Nama Lengkap IC Jurnalis *</label>
                  <input type="text" id="new-staff-name" class="foxsa-input" placeholder="Contoh: Kevin Salvatore" required />
                </div>
                <div class="foxsa-form-group">
                  <label>Jabatan Resmi di FoxSA News *</label>
                  <select id="new-staff-role" class="foxsa-select">
                    ${renderRoleOptionsHtml('Junior Reporter')}
                  </select>
                </div>
              </div>
              <button type="submit" class="foxsa-btn">
                <i class="fa-solid fa-user-check"></i> Simpan &amp; Aktifkan Akun
              </button>
            </form>
          </div>
        ` : ''}
      `;
    }

    // TAB 5: PENYIMPANAN & CLOUD SYNC
    else if (state.adminTab === 'storage') {
      const cfg = getGitHubConfig();
      tabContentHtml = `
        <div class="foxsa-status-box">
          <strong><i class="fa-solid fa-database" style="color:#F08D39;"></i> Cara Kerja Penyimpanan Data (Local &amp; Vercel/GitHub):</strong>
          <ul style="margin:8px 0 0 18px;padding:0;">
            <li><strong>Otomatis Tersimpan di Browser (LocalStorage):</strong> Setiap kali kamu menambah berita, komentar, atau akun staff, data langsung tersimpan di perangkat kamu.</li>
            <li><strong>Update Permanen ke GitHub / Vercel (1 Klik):</strong> Klik tombol <strong>"Download data.js"</strong> atau aktifkan <strong>Auto-Sync GitHub</strong> di bawah agar setiap perubahan langsung ter-commit ke GitHub &amp; tampil untuk semua pengunjung di Vercel.</li>
          </ul>
        </div>

        <div style="display:flex;flex-wrap:wrap;gap:10px;margin-bottom:26px;">
          <button type="button" class="foxsa-btn" id="btn-export-datajs">
            <i class="fa-solid fa-file-code"></i> Download js/data.js (Untuk GitHub/Vercel)
          </button>
          <button type="button" class="foxsa-btn foxsa-btn-secondary" id="btn-export-json">
            <i class="fa-solid fa-download"></i> Download data/posts.json
          </button>
          <label class="foxsa-btn foxsa-btn-outline" style="cursor:pointer;margin:0;">
            <i class="fa-solid fa-file-import"></i> Import File JSON
            <input type="file" id="input-import-json" accept=".json" style="display:none;" />
          </label>
          <button type="button" class="foxsa-btn foxsa-btn-danger" id="btn-reset-default" style="margin-left:auto;">
            <i class="fa-solid fa-rotate-left"></i> Reset ke 10 Berita Awal
          </button>
        </div>

        <div class="foxsa-comment-form">
          <h4><i class="fa-brands fa-github"></i> Pengaturan Auto-Save ke GitHub / Vercel Cloud (Opsional)</h4>
          <p style="font-size:12px;color:#666;margin-bottom:14px;">
            Jika diaktifkan, setiap penambahan berita dan komentar akan langsung di-push otomatis ke repository GitHub <code>vndrrx/foxsanews</code>.
          </p>
          <form id="foxsa-github-sync-form">
            <div class="foxsa-form-group">
              <label style="display:flex;align-items:center;gap:8px;cursor:pointer;">
                <input type="checkbox" id="gh-enabled" ${cfg.enabled ? 'checked' : ''} />
                <span>Aktifkan Auto-Sync ke GitHub Repository</span>
              </label>
            </div>
            <div class="foxsa-form-row">
              <div class="foxsa-form-group">
                <label>Nama Repository GitHub (username/nama-repo)</label>
                <input type="text" id="gh-repo" class="foxsa-input" value="${escapeHtml(cfg.repo || 'vndrrx/foxsanews')}" placeholder="vndrrx/foxsanews" />
              </div>
              <div class="foxsa-form-group" style="max-width:180px;">
                <label>Branch</label>
                <input type="text" id="gh-branch" class="foxsa-input" value="${escapeHtml(cfg.branch || 'main')}" placeholder="main" />
              </div>
            </div>
            <div class="foxsa-form-group">
              <label>GitHub Personal Access Token (Fine-grained / Classic dengan izin Contents: Read &amp; Write)</label>
              <input type="password" id="gh-token" class="foxsa-input" value="${escapeHtml(cfg.token || '')}" placeholder="ghp_xxxxxxxxxxxxxxxxxxxx" />
            </div>
            <div class="foxsa-form-group">
              <label style="display:flex;align-items:center;gap:8px;cursor:pointer;">
                <input type="checkbox" id="gh-serverless" ${cfg.useServerlessApi ? 'checked' : ''} />
                <span>Gunakan Endpoint Serverless Vercel (<code>/api/save</code>) jika Environment Variable sudah diatur di Dashboard Vercel</span>
              </label>
            </div>
            <div style="display:flex;gap:10px;">
              <button type="submit" class="foxsa-btn">
                <i class="fa-solid fa-cloud-arrow-up"></i> Simpan &amp; Test Sinkronisasi
              </button>
            </div>
          </form>
        </div>
      `;
    }

    mainEl.innerHTML = `
      <div class="foxsa-admin-panel">
        <!-- Logged-In Staff Banner -->
        <div class="foxsa-staff-logged-bar">
          <div class="foxsa-staff-logged-info">
            <img src="${escapeHtml(state.currentUser.avatar || DEFAULT_AVATAR)}" alt="${escapeHtml(state.currentUser.displayName)}" onerror="this.src='${DEFAULT_AVATAR}'" />
            <div>
              <div class="staff-logged-name">${escapeHtml(state.currentUser.displayName)}</div>
              <div class="staff-logged-role" style="margin-top:2px;">${renderRoleBadgeHtml(state.currentUser.role)}</div>
            </div>
          </div>
          <div class="foxsa-staff-logged-actions">
            <a href="#/" class="foxsa-btn foxsa-btn-outline" style="text-decoration:none;padding:7px 12px;font-size:12px;">
              <i class="fa-solid fa-house"></i> Beranda
            </a>
            <button type="button" class="foxsa-btn foxsa-btn-danger" id="admin-logout-btn" style="padding:7px 14px;font-size:12px;">
              <i class="fa-solid fa-right-from-bracket"></i> Logout
            </button>
          </div>
        </div>

        <div class="foxsa-admin-tabs">
          <button type="button" class="foxsa-admin-tab ${state.adminTab === 'posts' ? 'active' : ''}" data-admin-tab="posts">
            <i class="fa-regular fa-newspaper"></i> Berita (${totalPosts})
          </button>
          <button type="button" class="foxsa-admin-tab ${state.adminTab === 'editor' ? 'active' : ''}" data-admin-tab="editor">
            <i class="fa-solid fa-feather-pointed"></i> ${state.editingPostId ? 'Edit Berita' : '+ Tulis Berita'}
          </button>
          <button type="button" class="foxsa-admin-tab ${state.adminTab === 'comments' ? 'active' : ''}" data-admin-tab="comments">
            <i class="fa-regular fa-comments"></i> Komentar (${totalComments})
          </button>
          <button type="button" class="foxsa-admin-tab ${state.adminTab === 'staff' ? 'active' : ''}" data-admin-tab="staff">
            <i class="fa-solid fa-users-gear"></i> Akun Staff (${approvedStaff.length})
            ${pendingStaff.length > 0 ? `<span class="foxsa-pending-badge">${pendingStaff.length} ACC</span>` : ''}
          </button>
        </div>

        <div class="foxsa-admin-body">
          ${tabContentHtml}
        </div>
      </div>
    `;

    bindAdminEvents();
  }

  function updateEditorCategorySummaryUI() {
    const summaryEl = document.getElementById('editor-selected-summary');
    const hiddenInput = document.getElementById('post-labels-input');
    const pillsWrap = document.getElementById('editor-category-pills');

    if (hiddenInput) {
      hiddenInput.value = state.selectedEditorLabels.join(', ');
    }

    if (pillsWrap) {
      pillsWrap.querySelectorAll('[data-toggle-cat]').forEach(btn => {
        const cat = btn.getAttribute('data-toggle-cat');
        const isSel = state.selectedEditorLabels.some(s => s.toLowerCase() === cat.toLowerCase());
        btn.classList.toggle('selected', isSel);
        const icon = btn.querySelector('i');
        if (icon) {
          icon.className = isSel ? 'fa-solid fa-circle-check' : 'fa-solid fa-plus';
        }
      });
    }

    if (summaryEl) {
      if (state.selectedEditorLabels.length === 0) {
        summaryEl.innerHTML = `<span style="color:#dc2626;font-size:12px;"><i class="fa-solid fa-circle-exclamation"></i> Pilih minimal 1 kategori di atas (klik pada pil kategori).</span>`;
      } else {
        summaryEl.innerHTML = `
          <span style="font-size:12px;color:#555;font-weight:600;margin-right:6px;">Kategori Terpilih (${state.selectedEditorLabels.length}):</span>
          ${state.selectedEditorLabels.map(cat => `
            <span class="foxsa-active-cat-chip">
              #${escapeHtml(cat)}
              <button type="button" data-remove-selected-cat="${escapeHtml(cat)}" title="Hapus kategori">&times;</button>
            </span>
          `).join('')}
        `;
        summaryEl.querySelectorAll('[data-remove-selected-cat]').forEach(remBtn => {
          remBtn.addEventListener('click', () => {
            const targetCat = remBtn.getAttribute('data-remove-selected-cat');
            state.selectedEditorLabels = state.selectedEditorLabels.filter(c => c.toLowerCase() !== targetCat.toLowerCase());
            updateEditorCategorySummaryUI();
          });
        });
      }
    }
  }

  function insertHtmlIntoVisualCanvas(canvasEl, htmlSnippet) {
    if (!canvasEl) return;
    canvasEl.focus();
    const sel = window.getSelection();
    if (sel && sel.rangeCount > 0 && canvasEl.contains(sel.anchorNode)) {
      const range = sel.getRangeAt(0);
      range.deleteContents();
      const temp = document.createElement('div');
      temp.innerHTML = htmlSnippet;
      const frag = document.createDocumentFragment();
      let lastNode = null;
      while (temp.firstChild) {
        lastNode = frag.appendChild(temp.firstChild);
      }
      range.insertNode(frag);
      if (lastNode) {
        range.setStartAfter(lastNode);
        range.collapse(true);
        sel.removeAllRanges();
        sel.addRange(range);
      }
    } else {
      canvasEl.insertAdjacentHTML('beforeend', htmlSnippet);
    }
  }

  function bindAdminEvents() {
    const mainEl = document.getElementById('main');
    if (!mainEl) return;

    const logoutBtn = document.getElementById('admin-logout-btn');
    if (logoutBtn) {
      logoutBtn.addEventListener('click', () => {
        logoutStaff();
        renderAdminView();
      });
    }

    mainEl.querySelectorAll('[data-admin-tab]').forEach(tabBtn => {
      tabBtn.addEventListener('click', () => {
        const target = tabBtn.getAttribute('data-admin-tab');
        if (target !== 'editor') {
          state.editingPostId = null;
        }
        state.adminTab = target;
        renderAdminView();
      });
    });

    const newPostBtn = document.getElementById('admin-new-post-btn');
    if (newPostBtn) {
      newPostBtn.addEventListener('click', () => {
        state.editingPostId = null;
        state.selectedEditorLabels = ['Crime', 'LSPD'];
        state.adminTab = 'editor';
        renderAdminView();
      });
    }

    mainEl.querySelectorAll('[data-toggle-pop]').forEach(btn => {
      btn.addEventListener('click', () => {
        const id = btn.getAttribute('data-toggle-pop');
        const p = state.data.posts.find(x => x.id === id);
        if (p) {
          p.popular = !p.popular;
          saveDataToLocal(true);
          renderAdminView();
          renderWidgets();
          showToast(p.popular ? 'Ditambahkan ke Most Popular!' : 'Dihapus dari Most Popular.');
        }
      });
    });

    mainEl.querySelectorAll('[data-edit-post]').forEach(btn => {
      btn.addEventListener('click', () => {
        state.editingPostId = btn.getAttribute('data-edit-post');
        state.adminTab = 'editor';
        renderAdminView();
      });
    });

    mainEl.querySelectorAll('[data-delete-post]').forEach(btn => {
      btn.addEventListener('click', () => {
        const id = btn.getAttribute('data-delete-post');
        const p = state.data.posts.find(x => x.id === id);
        if (!p) return;
        if (!confirm(`Yakin ingin menghapus berita "${p.title}"?`)) return;
        state.data.posts = state.data.posts.filter(x => x.id !== id);
        saveDataToLocal(true);
        renderAdminView();
        renderWidgets();
        showToast('Berita berhasil dihapus.');
      });
    });

    // VISUAL EDITOR EVENTS
    const editorForm = document.getElementById('foxsa-post-editor-form');
    if (editorForm) {
      updateEditorCategorySummaryUI();
      const visualCanvas = document.getElementById('foxsa-visual-canvas');

      // Multi-select category pill click
      mainEl.querySelectorAll('[data-toggle-cat]').forEach(pillBtn => {
        pillBtn.addEventListener('click', () => {
          const cat = pillBtn.getAttribute('data-toggle-cat');
          const exists = state.selectedEditorLabels.some(s => s.toLowerCase() === cat.toLowerCase());
          if (exists) {
            state.selectedEditorLabels = state.selectedEditorLabels.filter(s => s.toLowerCase() !== cat.toLowerCase());
          } else {
            state.selectedEditorLabels.push(cat);
          }
          updateEditorCategorySummaryUI();
        });
      });

      const catDropdown = document.getElementById('editor-category-dropdown');
      if (catDropdown) {
        catDropdown.addEventListener('change', () => {
          const val = catDropdown.value;
          if (val) {
            if (!state.selectedEditorLabels.some(s => s.toLowerCase() === val.toLowerCase())) {
              state.selectedEditorLabels.push(val);
              updateEditorCategorySummaryUI();
            }
            catDropdown.value = '';
          }
        });
      }

      const newCatInput = document.getElementById('editor-new-cat-input');
      const addNewCatBtn = document.getElementById('editor-add-new-cat-btn');
      if (addNewCatBtn && newCatInput) {
        const addCustomCategory = () => {
          const val = newCatInput.value.trim();
          if (!val) return;
          if (!state.selectedEditorLabels.some(s => s.toLowerCase() === val.toLowerCase())) {
            state.selectedEditorLabels.push(val);
          }
          const pillsWrap = document.getElementById('editor-category-pills');
          if (pillsWrap) {
            const existingBtns = Array.from(pillsWrap.querySelectorAll('[data-toggle-cat]'));
            const alreadyInDom = existingBtns.some(b => b.getAttribute('data-toggle-cat').toLowerCase() === val.toLowerCase());
            if (!alreadyInDom) {
              const newBtn = document.createElement('button');
              newBtn.type = 'button';
              newBtn.className = 'foxsa-selectable-pill selected';
              newBtn.setAttribute('data-toggle-cat', val);
              newBtn.innerHTML = `<i class="fa-solid fa-circle-check"></i> <span>${escapeHtml(val)}</span>`;
              newBtn.addEventListener('click', () => {
                const exists = state.selectedEditorLabels.some(s => s.toLowerCase() === val.toLowerCase());
                if (exists) {
                  state.selectedEditorLabels = state.selectedEditorLabels.filter(s => s.toLowerCase() !== val.toLowerCase());
                } else {
                  state.selectedEditorLabels.push(val);
                }
                updateEditorCategorySummaryUI();
              });
              pillsWrap.appendChild(newBtn);
            }
          }
          newCatInput.value = '';
          updateEditorCategorySummaryUI();
          showToast(`Kategori "#${val}" ditambahkan!`);
        };

        addNewCatBtn.addEventListener('click', addCustomCategory);
        newCatInput.addEventListener('keydown', (e) => {
          if (e.key === 'Enter') {
            e.preventDefault();
            addCustomCategory();
          }
        });
      }

      // Cover Thumbnail Upload & URL Preview
      const coverPreviewBox = document.getElementById('editor-cover-preview-box');
      const coverUrlInput = document.getElementById('post-image-input');
      const coverFileInput = document.getElementById('post-image-file');

      const updateCoverPreview = (url) => {
        if (!coverPreviewBox) return;
        if (url) {
          coverPreviewBox.innerHTML = `<img src="${escapeHtml(url)}" alt="Preview Sampul" />`;
        } else {
          coverPreviewBox.innerHTML = `<div class="cover-empty"><i class="fa-regular fa-image"></i><span>Belum ada foto sampul</span></div>`;
        }
      };

      if (coverUrlInput) {
        coverUrlInput.addEventListener('input', () => updateCoverPreview(coverUrlInput.value.trim()));
      }
      if (coverFileInput) {
        coverFileInput.addEventListener('change', (e) => {
          const file = e.target.files && e.target.files[0];
          if (!file) return;
          compressImageFile(file, 960, 0.82, (dataUrl) => {
            coverUrlInput.value = dataUrl;
            updateCoverPreview(dataUrl);
            showToast('Foto sampul berhasil dipasang!');
          });
        });
      }

      // Visual Editor Toolbar Commands (Bold, Italic)
      mainEl.querySelectorAll('[data-vcmd]').forEach(btn => {
        btn.addEventListener('click', () => {
          const cmd = btn.getAttribute('data-vcmd');
          document.execCommand(cmd, false, null);
          if (visualCanvas) visualCanvas.focus();
        });
      });

      // + Lokasi Kota ("Los Santos, FoxSA News — ")
      const locBtn = document.getElementById('vtool-add-Location');
      if (locBtn && visualCanvas) {
        locBtn.addEventListener('click', () => {
          const city = prompt('Masukkan nama kota / lokasi kejadian:', 'Los Santos');
          if (!city) return;
          insertHtmlIntoVisualCanvas(visualCanvas, `<p><strong>${escapeHtml(city.trim())}, FoxSA News</strong> — </p>`);
        });
      }

      // + Sub-Judul
      const headingBtn = document.getElementById('vtool-add-heading');
      if (headingBtn && visualCanvas) {
        headingBtn.addEventListener('click', () => {
          const text = prompt('Masukkan teks Sub-Judul Bagian:', 'Kronologi Kejadian');
          if (!text) return;
          insertHtmlIntoVisualCanvas(visualCanvas, `<h3>${escapeHtml(text.trim())}</h3><p>Lanjutkan menulis paragraf di sini...</p>`);
        });
      }

      // + Kutipan Narasumber
      const quoteBtn = document.getElementById('vtool-add-quote');
      if (quoteBtn && visualCanvas) {
        quoteBtn.addEventListener('click', () => {
          const quoteText = prompt('Masukkan kalimat kutipan wawancara / narasumber:');
          if (!quoteText) return;
          const speaker = prompt('Siapa yang menyampaikan kutipan tersebut? (Opsional, contoh: ujar Officer LSPD)', '');
          const fullQuote = speaker ? `"${quoteText.trim()}," ${speaker.trim()}.` : `"${quoteText.trim()}"`;
          insertHtmlIntoVisualCanvas(visualCanvas, `<blockquote>${escapeHtml(fullQuote)}</blockquote><p></p>`);
        });
      }

      // + Upload Foto langsung ke dalam Artikel
      const inlineImgFile = document.getElementById('vtool-inline-img-file');
      if (inlineImgFile && visualCanvas) {
        inlineImgFile.addEventListener('change', (e) => {
          const file = e.target.files && e.target.files[0];
          if (!file) return;
          const caption = prompt('Tulis keterangan / kredit foto (Opsional):', 'Picture : FoxSA News');
          compressImageFile(file, 920, 0.82, (dataUrl) => {
            const figHtml = `
              <figure class="foxsa-article-figure">
                <img src="${dataUrl}" alt="Dokumentasi FoxSA News" />
                ${caption ? `<figcaption>${escapeHtml(caption)}</figcaption>` : ''}
              </figure>
              <p>Lanjutkan menulis paragraf berita di sini...</p>
            `;
            insertHtmlIntoVisualCanvas(visualCanvas, figHtml);
            if (!coverUrlInput.value.trim()) {
              coverUrlInput.value = dataUrl;
              updateCoverPreview(dataUrl);
            }
            showToast('Foto berhasil dimasukkan ke dalam artikel!');
          });
          inlineImgFile.value = '';
        });
      }

      // + Foto via Link URL ke dalam Artikel
      const insertImgUrlBtn = document.getElementById('vtool-insert-img-url');
      if (insertImgUrlBtn && visualCanvas) {
        insertImgUrlBtn.addEventListener('click', () => {
          const url = prompt('Paste link URL Gambar (https://...):');
          if (!url || !url.trim()) return;
          const caption = prompt('Tulis keterangan / kredit foto (Opsional):', 'Picture : FoxSA News');
          const figHtml = `
            <figure class="foxsa-article-figure">
              <img src="${escapeHtml(url.trim())}" alt="Dokumentasi FoxSA News" />
              ${caption ? `<figcaption>${escapeHtml(caption)}</figcaption>` : ''}
            </figure>
            <p>Lanjutkan menulis paragraf berita di sini...</p>
          `;
          insertHtmlIntoVisualCanvas(visualCanvas, figHtml);
          if (!coverUrlInput.value.trim()) {
            coverUrlInput.value = url.trim();
            updateCoverPreview(url.trim());
          }
        });
      }

      // Clean plain-text paste inside Visual Canvas so external styles don't break article look
      if (visualCanvas) {
        visualCanvas.addEventListener('paste', (e) => {
          const text = (e.clipboardData || window.clipboardData).getData('text/plain');
          if (text) {
            e.preventDefault();
            const paragraphs = text
              .split(/\r?\n\r?\n|\r?\n/)
              .map(line => line.trim())
              .filter(Boolean)
              .map(line => `<p>${escapeHtml(line)}</p>`)
              .join('');
            insertHtmlIntoVisualCanvas(visualCanvas, paragraphs || escapeHtml(text));
          }
        });
      }

      // Author selection logic for High Staff & Admin
      const authorSelect = document.getElementById('post-author-select');
      const authorCustomGroup = document.getElementById('post-author-custom-group');
      const authorCustomInput = document.getElementById('post-author-custom-input');
      const authorRoleSelect = document.getElementById('post-author-role-select');
      const authorRoleInput = document.getElementById('post-author-role-input');

      if (authorRoleSelect && authorRoleInput) {
        authorRoleSelect.addEventListener('change', () => {
          if (authorRoleSelect.value === '__custom__') {
            authorRoleInput.style.display = 'block';
            authorRoleInput.focus();
          } else {
            authorRoleInput.value = authorRoleSelect.value;
            authorRoleInput.style.display = 'none';
          }
        });
      }

      if (authorSelect) {
        authorSelect.addEventListener('change', () => {
          const val = authorSelect.value;
          if (val === '__custom__') {
            if (authorCustomGroup) authorCustomGroup.style.display = 'block';
            if (authorCustomInput) {
              authorCustomInput.focus();
            }
          } else {
            if (authorCustomGroup) authorCustomGroup.style.display = 'none';
            const opt = authorSelect.options[authorSelect.selectedIndex];
            const role = opt ? opt.getAttribute('data-role') : '';
            if (role) {
              if (authorRoleInput) authorRoleInput.value = role;
              if (authorRoleSelect) {
                const found = Array.from(authorRoleSelect.options).some(o => o.value.toLowerCase() === role.toLowerCase());
                if (found) {
                  authorRoleSelect.value = role;
                  if (authorRoleInput) authorRoleInput.style.display = 'none';
                } else {
                  authorRoleSelect.value = '__custom__';
                  if (authorRoleInput) authorRoleInput.style.display = 'block';
                }
              }
            }
          }
        });
      }

      const cancelBtn = document.getElementById('editor-cancel-btn');
      if (cancelBtn) {
        cancelBtn.addEventListener('click', () => {
          state.editingPostId = null;
          state.adminTab = 'posts';
          renderAdminView();
        });
      }

      const backListBtn = document.getElementById('editor-back-list-btn');
      if (backListBtn) {
        backListBtn.addEventListener('click', () => {
          state.editingPostId = null;
          state.adminTab = 'posts';
          renderAdminView();
        });
      }

      // Submit Add / Edit Post
      editorForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const title = document.getElementById('post-title-input').value.trim();
        const labels = state.selectedEditorLabels.length > 0 ? [...state.selectedEditorLabels] : ['News'];
        const popular = document.getElementById('post-popular-input') ? document.getElementById('post-popular-input').checked : false;
        let featuredImage = document.getElementById('post-image-input').value.trim();
        let content = serializeVisualEditorToCleanHtml(visualCanvas);

        let author = '';
        let authorBio = '';
        let authorAvatar = DEFAULT_AVATAR;

        if (state.currentUser && isHighStaff(state.currentUser)) {
          const aSelect = document.getElementById('post-author-select');
          const aCustom = document.getElementById('post-author-custom-input');
          const aRole = document.getElementById('post-author-role-input');

          if (aSelect && aSelect.value === '__custom__') {
            author = (aCustom && aCustom.value.trim()) || 'FoxSA News';
          } else if (aSelect && aSelect.value) {
            author = aSelect.value;
          } else {
            author = state.currentUser.authorName || state.currentUser.displayName;
          }

          authorBio = (aRole && aRole.value.trim()) || 'Chief Editor / Super Admin';

          const opt = aSelect ? aSelect.options[aSelect.selectedIndex] : null;
          authorAvatar = (opt && opt.getAttribute('data-avatar')) || (state.data.authors[author] && state.data.authors[author].avatar) || DEFAULT_AVATAR;

          // If the author matches a registered staff account, update that staff's role in the system
          const matchedStaff = (state.data.staffAccounts || []).find(
            a => (a.authorName && a.authorName.toLowerCase() === author.toLowerCase()) ||
                 (a.displayName && a.displayName.toLowerCase() === author.toLowerCase())
          );
          if (matchedStaff) {
            matchedStaff.role = authorBio;
          }
        } else if (state.currentUser) {
          author = state.currentUser.authorName || state.currentUser.displayName;
          authorBio = state.currentUser.role || 'Jurnalis FoxSA News';
          authorAvatar = state.currentUser.avatar || DEFAULT_AVATAR;
        } else {
          author = 'FoxSA News';
          authorBio = 'Tim Redaksi FoxSA News';
          authorAvatar = DEFAULT_AVATAR;
        }

        state.data.authors[author] = {
          name: author,
          avatar: authorAvatar,
          bio: authorBio,
          profileUrl: `#/author/${encodeURIComponent(author)}`
        };

        const existingPost = state.editingPostId ? state.data.posts.find(p => p.id === state.editingPostId) : null;
        const publishedIso = existingPost && existingPost.published ? existingPost.published : new Date().toISOString();

        // If user provided a featuredImage and content doesn't have an <img> yet, prepend it cleanly
        if (featuredImage && !/<img\b/i.test(content)) {
          content = `<figure class="foxsa-article-figure"><img src="${featuredImage}" alt="${escapeHtml(title)}" /><figcaption>Picture : FoxSA News</figcaption></figure>` + content;
        }
        if (!featuredImage) {
          const match = content.match(/<img[^>]+src=["']([^"']+)["']/i);
          featuredImage = match ? match[1] : state.data.siteInfo.aboutBanner;
        }

        const snippet = stripHtmlToSnippet(content, 155);

        if (state.editingPostId) {
          const existing = state.data.posts.find(p => p.id === state.editingPostId);
          if (existing) {
            existing.title = title;
            existing.author = author;
            existing.authorAvatar = authorAvatar;
            existing.authorBio = authorBio;
            existing.labels = labels;
            existing.published = publishedIso;
            existing.updated = new Date().toISOString();
            existing.featuredImage = featuredImage;
            existing.content = content;
            existing.snippet = snippet;
            existing.popular = popular;
          }
          showToast('Berita berhasil diperbarui!');
          const targetId = state.editingPostId;
          state.editingPostId = null;
          saveDataToLocal(true);
          renderWidgets();
          window.location.hash = `#/post/${targetId}`;
        } else {
          const newId = String(Date.now());
          const newPost = {
            id: newId,
            slug: slugify(title),
            title,
            published: publishedIso,
            updated: publishedIso,
            author,
            authorAvatar,
            authorBio,
            labels,
            featuredImage,
            snippet,
            content,
            originalUrl: '',
            popular,
            comments: []
          };
          state.data.posts.unshift(newPost);
          saveDataToLocal(true);
          renderWidgets();
          showToast('Berita baru berhasil dipublikasikan!');
          window.location.hash = `#/post/${newId}`;
        }
      });
    }

    // Admin Delete Comment
    mainEl.querySelectorAll('[data-admin-del-comment]').forEach(btn => {
      btn.addEventListener('click', () => {
        const cId = btn.getAttribute('data-admin-del-comment');
        const pId = btn.getAttribute('data-post-id');
        const post = state.data.posts.find(p => p.id === pId);
        if (!post) return;
        if (!confirm('Hapus komentar ini?')) return;
        post.comments = (post.comments || []).filter(c => String(c.id) !== String(cId));
        saveDataToLocal(true);
        showToast('Komentar dihapus.');
        renderAdminView();
      });
    });

    // Set Author Role from Post List (High Staff & Admin)
    mainEl.querySelectorAll('[data-set-post-role]').forEach(btn => {
      btn.addEventListener('click', () => {
        const postId = btn.getAttribute('data-set-post-role');
        const post = state.data.posts.find(p => p.id === postId);
        if (!post) return;
        const currentRole = post.authorBio || '';
        openRoleChooserModal({
          title: `Pilih Jabatan / Role Penulis untuk artikel "${post.title}" (${post.author}):`,
          currentRole,
          onSave: (chosenRole) => {
            const trimmedRole = chosenRole.trim();
            post.authorBio = trimmedRole;
            if (state.data.authors[post.author]) {
              state.data.authors[post.author].bio = trimmedRole;
            }
            // Update matching staff account if exists
            const matchedAcc = (state.data.staffAccounts || []).find(
              a => (a.authorName && a.authorName.toLowerCase() === post.author.toLowerCase()) ||
                   (a.displayName && a.displayName.toLowerCase() === post.author.toLowerCase())
            );
            if (matchedAcc) {
              matchedAcc.role = trimmedRole;
            }
            saveDataToLocal(true);
            renderAdminView();
            showToast(`Jabatan ${post.author} berhasil diubah menjadi "${trimmedRole}"!`);
          }
        });
      });
    });

    // High Staff ACC Approval Handler
    mainEl.querySelectorAll('[data-approve-staff]').forEach(btn => {
      btn.addEventListener('click', () => {
        const username = btn.getAttribute('data-approve-staff');
        const acc = (state.data.staffAccounts || []).find(a => a.username === username);
        if (!acc) return;
        const roleSel = mainEl.querySelector(`[data-acc-role-select="${username}"]`);
        const chosenRole = roleSel ? roleSel.value.trim() : (acc.role || 'Junior Reporter');

        acc.status = 'approved';
        acc.role = chosenRole;
        if (!state.data.authors[acc.displayName]) {
          state.data.authors[acc.displayName] = {
            name: acc.displayName,
            avatar: acc.avatar || DEFAULT_AVATAR,
            bio: chosenRole,
            profileUrl: `#/author/${encodeURIComponent(acc.displayName)}`
          };
        } else {
          state.data.authors[acc.displayName].bio = chosenRole;
        }

        saveDataToLocal(true);
        renderAdminView();
        showToast(`Akun @${acc.username} (${acc.displayName}) berhasil di-ACC sebagai "${chosenRole}"!`);
      });
    });

    // High Staff ACC Reject Handler
    mainEl.querySelectorAll('[data-reject-staff]').forEach(btn => {
      btn.addEventListener('click', () => {
        const username = btn.getAttribute('data-reject-staff');
        const acc = (state.data.staffAccounts || []).find(a => a.username === username);
        if (!acc) return;
        if (!confirm(`Tolak dan batalkan pendaftaran akun @${acc.username} (${acc.displayName})?`)) return;
        state.data.staffAccounts = (state.data.staffAccounts || []).filter(a => a.username !== username);
        saveDataToLocal(true);
        renderAdminView();
        showToast(`Pendaftaran akun @${username} telah ditolak.`);
      });
    });

    // Staff Management Tab Events
    mainEl.querySelectorAll('[data-edit-staff-role]').forEach(btn => {
      btn.addEventListener('click', () => {
        const username = btn.getAttribute('data-edit-staff-role');
        const acc = (state.data.staffAccounts || []).find(a => a.username === username);
        if (!acc) return;
        openRoleChooserModal({
          title: `Pilih Jabatan / Role resmi untuk "${acc.displayName}" (@${acc.username}):`,
          currentRole: acc.role,
          onSave: (chosenRole) => {
            const trimmedRole = chosenRole.trim();
            acc.role = trimmedRole;
            if (state.data.authors[acc.authorName || acc.displayName]) {
              state.data.authors[acc.authorName || acc.displayName].bio = trimmedRole;
            }
            // Also update all posts by this author
            state.data.posts.forEach(p => {
              if ((p.author || '').toLowerCase() === (acc.authorName || '').toLowerCase() ||
                  (p.author || '').toLowerCase() === (acc.displayName || '').toLowerCase()) {
                p.authorBio = trimmedRole;
              }
            });
            saveDataToLocal(true);
            renderAdminView();
            showToast(`Jabatan ${acc.displayName} berhasil diubah menjadi "${trimmedRole}"!`);
          }
        });
      });
    });

    const copyRegBtn = document.getElementById('btn-copy-register-link');
    if (copyRegBtn) {
      copyRegBtn.addEventListener('click', () => {
        const regUrl = `${window.location.origin}${window.location.pathname}#/register`;
        if (navigator.clipboard && navigator.clipboard.writeText) {
          navigator.clipboard.writeText(regUrl).then(() => {
            showToast('Link registrasi anggota berhasil disalin ke clipboard!');
          }).catch(() => {
            prompt('Salin link registrasi berikut untuk dibagikan ke anggota baru:', regUrl);
          });
        } else {
          prompt('Salin link registrasi berikut untuk dibagikan ke anggota baru:', regUrl);
        }
      });
    }

    mainEl.querySelectorAll('[data-show-staff-pwd]').forEach(btn => {
      btn.addEventListener('click', () => {
        const tr = btn.closest('tr');
        const span = tr && tr.querySelector('.pwd-mask');
        if (!span) return;
        const realPwd = span.getAttribute('data-pwd');
        if (span.textContent === '••••••••') {
          span.textContent = realPwd;
        } else {
          span.textContent = '••••••••';
        }
      });
    });

    mainEl.querySelectorAll('[data-change-pwd]').forEach(btn => {
      btn.addEventListener('click', () => {
        const username = btn.getAttribute('data-change-pwd');
        const acc = (state.data.staffAccounts || []).find(a => a.username === username);
        if (!acc) return;
        const newPwd = prompt(`Masukkan password baru untuk akun "${acc.displayName}" (${acc.username}):`, acc.password);
        if (!newPwd || !newPwd.trim()) return;
        acc.password = newPwd.trim();
        saveDataToLocal(true);
        renderAdminView();
        showToast(`Password untuk ${acc.displayName} berhasil diperbarui!`);
      });
    });

    mainEl.querySelectorAll('[data-del-staff]').forEach(btn => {
      btn.addEventListener('click', () => {
        const username = btn.getAttribute('data-del-staff');
        if (username === 'admin') return;
        if (!confirm(`Hapus akun staff "${username}"?`)) return;
        state.data.staffAccounts = (state.data.staffAccounts || []).filter(a => a.username !== username);
        saveDataToLocal(true);
        renderAdminView();
        showToast('Akun staff dihapus.');
      });
    });

    const addStaffForm = document.getElementById('foxsa-add-staff-form');
    if (addStaffForm) {
      addStaffForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const username = document.getElementById('new-staff-username').value.trim().toLowerCase().replace(/\s+/g, '');
        const password = document.getElementById('new-staff-password').value.trim();
        const displayName = document.getElementById('new-staff-name').value.trim();
        const roleSel = document.getElementById('new-staff-role');
        const role = roleSel ? roleSel.value.trim() : 'Junior Reporter';

        if (!username || !password || !displayName) return;
        if ((state.data.staffAccounts || []).some(a => a.username.toLowerCase() === username)) {
          alert('Username tersebut sudah terdaftar! Gunakan username lain.');
          return;
        }

        state.data.staffAccounts.push({
          username,
          password,
          displayName,
          authorName: displayName,
          role,
          status: 'approved',
          isAdmin: false,
          avatar: DEFAULT_AVATAR
        });

        if (!state.data.authors[displayName]) {
          state.data.authors[displayName] = {
            name: displayName,
            avatar: DEFAULT_AVATAR,
            bio: role,
            profileUrl: `#/author/${displayName}`
          };
        }

        saveDataToLocal(true);
        renderAdminView();
        showToast(`Akun staff ${displayName} (${username}) berhasil ditambahkan & diaktifkan!`);
      });
    }

    // Storage Tab Events
    const btnExportDataJs = document.getElementById('btn-export-datajs');
    if (btnExportDataJs) {
      btnExportDataJs.addEventListener('click', () => {
        const content = '// Data bawaan FoxSA News (Otomatis di-load oleh website)\nwindow.FOXSA_INITIAL_DATA = ' + JSON.stringify(state.data, null, 2) + ';\n';
        downloadTextFile('data.js', content, 'application/javascript');
        showToast('File data.js berhasil di-download!');
      });
    }

    const btnExportJson = document.getElementById('btn-export-json');
    if (btnExportJson) {
      btnExportJson.addEventListener('click', () => {
        const content = JSON.stringify(state.data, null, 2);
        downloadTextFile('posts.json', content, 'application/json');
        showToast('File posts.json berhasil di-download!');
      });
    }

    const inputImportJson = document.getElementById('input-import-json');
    if (inputImportJson) {
      inputImportJson.addEventListener('change', (e) => {
        const file = e.target.files && e.target.files[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onload = (ev) => {
          try {
            const parsed = JSON.parse(ev.target.result);
            if (!parsed || !Array.isArray(parsed.posts)) {
              alert('Format file JSON tidak valid.');
              return;
            }
            state.data = normalizeData(parsed);
            saveDataToLocal(true);
            renderAll();
            showToast('Data berhasil di-import!');
          } catch (err) {
            alert('Gagal membaca file JSON: ' + err.message);
          }
        };
        reader.readAsText(file);
      });
    }

    const btnResetDefault = document.getElementById('btn-reset-default');
    if (btnResetDefault) {
      btnResetDefault.addEventListener('click', () => {
        if (!confirm('Reset semua perubahan lokal ke 10 berita Roleplay bawaan awal?')) return;
        localStorage.removeItem(STORAGE_KEY);
        state.data = normalizeData(window.FOXSA_INITIAL_DATA);
        saveDataToLocal(false);
        renderAll();
        showToast('Data berhasil di-reset ke bawaan awal.');
      });
    }

    const ghForm = document.getElementById('foxsa-github-sync-form');
    if (ghForm) {
      ghForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const cfg = {
          enabled: document.getElementById('gh-enabled').checked,
          repo: document.getElementById('gh-repo').value.trim(),
          branch: document.getElementById('gh-branch').value.trim() || 'main',
          token: document.getElementById('gh-token').value.trim(),
          useServerlessApi: document.getElementById('gh-serverless').checked
        };
        saveGitHubConfig(cfg);
        showToast('Pengaturan GitHub/Cloud Sync disimpan!');
        if (cfg.enabled) {
          await syncToCloudIfConfigured();
        }
      });
    }
  }

  function downloadTextFile(filename, text, mimeType) {
    const blob = new Blob([text], { type: mimeType || 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    setTimeout(() => {
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    }, 150);
  }

  function compressImageFile(file, maxWidth, quality, callback) {
    const reader = new FileReader();
    reader.onload = function (ev) {
      const img = new Image();
      img.onload = function () {
        let w = img.width;
        let h = img.height;
        if (w > maxWidth) {
          h = Math.round((h * maxWidth) / w);
          w = maxWidth;
        }
        const canvas = document.createElement('canvas');
        canvas.width = w;
        canvas.height = h;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, w, h);
        const dataUrl = canvas.toDataURL('image/jpeg', quality || 0.82);
        callback(dataUrl);
      };
      img.src = ev.target.result;
    };
    reader.readAsDataURL(file);
  }

  // =========================================================================
  // 8. RENDERING: SIDEBAR, POPULAR TAGS STRIP & FOOTER WIDGETS
  // =========================================================================

  function renderSidebarTabbedList() {
    const container = document.getElementById('sidebar-tabbed-posts');
    if (!container || !state.data || !state.data.posts) return;

    const posts = state.data.posts;
    let list = [];
    if (state.sidebarTab === 'popular') {
      list = posts.filter(p => p.popular);
      if (list.length < 5) {
        list = list.concat(posts.filter(p => !list.includes(p)));
      }
      list = list.slice(0, 5);
    } else {
      list = posts.slice(0, 5);
    }

    container.innerHTML = `
      <div class="an-side-post-list">
        ${list.map(p => {
          const cat = (p.labels && p.labels[0]) || 'News';
          return `
            <a href="${getPostHref(p)}" class="an-side-post-item">
              <img src="${escapeHtml(p.featuredImage || state.data.siteInfo.aboutBanner)}" alt="${escapeHtml(p.title)}" loading="lazy" />
              <div class="an-side-post-info">
                <h4>${escapeHtml(p.title)}</h4>
                <span class="an-side-post-sub">${escapeHtml(cat)} • ${escapeHtml(formatShortDate(p.published))}</span>
                <span class="an-side-post-stat"><i class="fa-regular fa-comment"></i> ${(p.comments || []).length} komentar</span>
              </div>
            </a>
          `;
        }).join('')}
      </div>
    `;
  }

  function renderWidgets() {
    if (!state.data || !state.data.posts) return;
    const posts = state.data.posts;

    // Update Spotlight stats
    const statPosts = document.getElementById('side-stat-posts');
    const statAuthors = document.getElementById('side-stat-authors');
    if (statPosts) statPosts.textContent = posts.length;
    if (statAuthors) statAuthors.textContent = Object.keys(state.data.authors || {}).length;

    // 1. Sidebar Tabbed Posts (TERPOPULER / TERBARU)
    renderSidebarTabbedList();

    // 2. Footer Popular Posts
    let popularPosts = posts.filter(p => p.popular);
    if (popularPosts.length < 3) popularPosts = posts.slice(0, 3);
    else popularPosts = popularPosts.slice(0, 3);

    const popFooterEl = document.querySelector('#PopularPosts2 .widget-content');
    if (popFooterEl) {
      popFooterEl.innerHTML = popularPosts.map(p => `
        <a href="${getPostHref(p)}" class="footer-pop-item">
          <img src="${escapeHtml(p.featuredImage || state.data.siteInfo.aboutBanner)}" alt="${escapeHtml(p.title)}" loading="lazy" />
          <div>
            <h5>${escapeHtml(p.title)}</h5>
            <span>${escapeHtml(formatDateID(p.published))}</span>
          </div>
        </a>
      `).join('');
    }

    // 3. Popular Tags Strip under Header (Kreeti style) & Nav Categories
    const labelCounts = getLabelCounts();
    const sortedLabels = Object.keys(labelCounts).sort((a, b) => {
      if (labelCounts[b] !== labelCounts[a]) return labelCounts[b] - labelCounts[a];
      return a.localeCompare(b);
    });

    const ptagsList = document.getElementById('header-popular-tags-list');
    if (ptagsList) {
      ptagsList.innerHTML = sortedLabels.map(l => `
        <a href="#/label/${encodeURIComponent(l)}" class="ptag-chip">#${escapeHtml(l)}</a>
      `).join('');
    }

    const navDynamicCats = document.getElementById('nav-dynamic-categories');
    if (navDynamicCats) {
      navDynamicCats.innerHTML = sortedLabels.map(l => `
        <li><a href="#/label/${encodeURIComponent(l)}" role="menuitem">#${escapeHtml(l)} (${labelCounts[l]})</a></li>
      `).join('');
      rebuildMobileDrawerMenu();
    }

    const activeLabelLower = state.currentRoute.view === 'label' && state.currentRoute.param
      ? state.currentRoute.param.trim().toLowerCase()
      : '';

    const labelListEl = document.querySelector('#Label1 .widget-content');
    if (labelListEl) {
      labelListEl.innerHTML = `
        <div style="margin-bottom:12px;">
          <select id="sidebar-category-select" class="foxsa-cat-select" style="width:100%;" aria-label="Pilih Kategori Berita">
            <option value="#/">-- Pilih Kategori Cepat (${sortedLabels.length}) --</option>
            ${sortedLabels.map(l => `
              <option value="#/label/${encodeURIComponent(l)}" ${activeLabelLower === l.toLowerCase() ? 'selected' : ''}>
                #${escapeHtml(l)} (${labelCounts[l]} berita)
              </option>
            `).join('')}
          </select>
        </div>
        <ul class="list-label">
          ${sortedLabels.map(l => `
            <li>
              <a class="label-name" href="#/label/${encodeURIComponent(l)}">
                ${escapeHtml(l)}
                <span class="label-count">${labelCounts[l]}</span>
              </a>
            </li>
          `).join('')}
        </ul>
      `;

      const sideSelect = document.getElementById('sidebar-category-select');
      if (sideSelect) {
        sideSelect.addEventListener('change', () => {
          if (sideSelect.value) window.location.hash = sideSelect.value;
        });
      }
    }

    // 4. Blog Archive (#BlogArchive1)
    const archiveCounts = {};
    posts.forEach(p => {
      const key = getArchiveKey(p.published);
      archiveCounts[key] = (archiveCounts[key] || 0) + 1;
    });
    const sortedArchives = Object.keys(archiveCounts).sort().reverse();

    const archiveEl = document.querySelector('#BlogArchive1 #ArchiveList');
    if (archiveEl) {
      archiveEl.innerHTML = `
        <ul class="flat">
          ${sortedArchives.map(ym => `
            <li class="archivedate">
              <a href="#/archive/${encodeURIComponent(ym)}">
                ${escapeHtml(formatArchiveLabel(ym))}
                <span class="post-count" dir="ltr">${archiveCounts[ym]}</span>
              </a>
            </li>
          `).join('')}
        </ul>
      `;
    }
  }

  // =========================================================================
  // 8B. DEDICATED COMPANY PROFILE PAGE (#/profile, divisions, roadmap, recruitment)
  // =========================================================================

  function getDefaultTeamAvatarSvg(variantIndex = 0) {
    const palettes = [
      { bg1: '#dce8f5', bg2: '#c8d9ed', suit: '#1e293b', lapel: '#0f172a', tie: '#F08D39', skin: '#f1c29b', hair: '#27303f' },
      { bg1: '#fce6d4', bg2: '#f7d3b8', suit: '#172033', lapel: '#090C1E', tie: '#3b82f6', skin: '#f3c6a2', hair: '#4a3525' },
      { bg1: '#daf2ee', bg2: '#c2e8e2', suit: '#222b3d', lapel: '#111827', tie: '#e11d48', skin: '#ecc098', hair: '#1f242d' },
      { bg1: '#e6e8f8', bg2: '#d3d7f2', suit: '#1b2436', lapel: '#0b1120', tie: '#10b981', skin: '#f2c5a0', hair: '#382c22' }
    ];
    const p = palettes[Math.abs(variantIndex) % palettes.length];
    const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 440" width="400" height="440">
      <defs>
        <linearGradient id="bgGrad${variantIndex}" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stop-color="${p.bg1}"/>
          <stop offset="100%" stop-color="${p.bg2}"/>
        </linearGradient>
      </defs>
      <rect width="400" height="440" fill="url(#bgGrad${variantIndex})"/>
      <circle cx="200" cy="210" r="150" fill="#ffffff" fill-opacity="0.28"/>
      <!-- Suit Shoulders & Torso -->
      <path d="M62 440 C66 334 118 294 200 294 C282 294 334 334 338 440 Z" fill="${p.suit}"/>
      <!-- White Dress Shirt -->
      <polygon points="162,294 238,294 216,440 184,440" fill="#ffffff"/>
      <!-- Tie -->
      <polygon points="192,306 208,306 214,420 200,438 186,420" fill="${p.tie}"/>
      <polygon points="189,294 211,294 207,312 193,312" fill="${p.tie}"/>
      <!-- Suit Lapels -->
      <polygon points="160,294 192,388 142,440 116,320" fill="${p.lapel}"/>
      <polygon points="240,294 208,388 258,440 284,320" fill="${p.lapel}"/>
      <!-- Shirt Collar -->
      <polygon points="162,286 196,312 174,326 152,298" fill="#f8fafc"/>
      <polygon points="238,286 204,312 226,326 248,298" fill="#f8fafc"/>
      <!-- Neck -->
      <rect x="176" y="242" width="48" height="60" rx="18" fill="${p.skin}"/>
      <path d="M176 266 Q200 284 224 266 L224 288 L176 288 Z" fill="#d9a782" opacity="0.45"/>
      <!-- Ears -->
      <circle cx="136" cy="186" r="14" fill="${p.skin}"/>
      <circle cx="264" cy="186" r="14" fill="${p.skin}"/>
      <!-- Head -->
      <rect x="142" y="106" width="116" height="152" rx="56" fill="${p.skin}"/>
      <!-- Hair -->
      <path d="M140 162 C136 112 164 88 202 88 C242 88 266 114 260 162 C252 132 232 120 200 120 C168 120 148 134 140 162 Z" fill="${p.hair}"/>
      <!-- Eyebrows -->
      <path d="M164 166 Q177 160 188 165" stroke="${p.hair}" stroke-width="4" stroke-linecap="round" fill="none"/>
      <path d="M212 165 Q223 160 236 166" stroke="${p.hair}" stroke-width="4" stroke-linecap="round" fill="none"/>
      <!-- Eyes -->
      <circle cx="176" cy="180" r="5.5" fill="#1e293b"/>
      <circle cx="224" cy="180" r="5.5" fill="#1e293b"/>
      <!-- Nose -->
      <path d="M200 182 L196 204 L205 206" stroke="#c9956e" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" fill="none"/>
      <!-- Confident Smile -->
      <path d="M182 222 Q200 235 218 222" stroke="#b87d56" stroke-width="3.8" stroke-linecap="round" fill="none"/>
      <!-- FoxSA Lapel Pin -->
      <circle cx="246" cy="354" r="6" fill="#F08D39"/>
    </svg>`;
    return 'data:image/svg+xml;utf8,' + encodeURIComponent(svg);
  }

  function getCommissionerAvatarSvg() {
    const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 440" width="400" height="440">
      <defs>
        <linearGradient id="bocBg" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#0f172a"/>
          <stop offset="55%" stop-color="#1e293b"/>
          <stop offset="100%" stop-color="#090C1E"/>
        </linearGradient>
        <linearGradient id="goldGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#fbbf24"/>
          <stop offset="50%" stop-color="#f59e0b"/>
          <stop offset="100%" stop-color="#d97706"/>
        </linearGradient>
      </defs>
      <rect width="400" height="440" fill="url(#bocBg)"/>
      <circle cx="200" cy="195" r="142" fill="#f59e0b" opacity="0.08"/>
      <circle cx="200" cy="195" r="118" fill="none" stroke="url(#goldGrad)" stroke-width="1.5" opacity="0.35"/>
      <!-- Executive Suit Shoulders & Jacket -->
      <path d="M52 440 C52 332 112 292 200 292 C288 292 348 332 348 440 Z" fill="#090C1E" stroke="#334155" stroke-width="1.5"/>
      <!-- Inner Vest & Crisp White Shirt -->
      <polygon points="154,292 246,292 224,440 176,440" fill="#ffffff"/>
      <polygon points="158,330 200,368 242,330 230,440 170,440" fill="#1e293b"/>
      <!-- Gold Silk Tie -->
      <polygon points="191,310 209,310 215,422 200,438 185,422" fill="url(#goldGrad)"/>
      <polygon points="189,296 211,296 207,314 193,314" fill="#d97706"/>
      <!-- Suit Lapels with Gold Trim -->
      <polygon points="154,292 194,398 158,440 116,336" fill="#060916"/>
      <polygon points="246,292 206,398 242,440 284,336" fill="#060916"/>
      <!-- Gold Pocket Square -->
      <polygon points="256,374 282,366 276,382 252,382" fill="url(#goldGrad)"/>
      <!-- Shirt Collar -->
      <polygon points="162,286 196,312 174,326 152,298" fill="#f8fafc"/>
      <polygon points="238,286 204,312 226,326 248,298" fill="#f8fafc"/>
      <!-- Neck -->
      <rect x="176" y="242" width="48" height="60" rx="18" fill="#f0c4a0"/>
      <path d="M176 266 Q200 284 224 266 L224 288 L176 288 Z" fill="#d9a782" opacity="0.45"/>
      <!-- Ears -->
      <circle cx="136" cy="186" r="14" fill="#f0c4a0"/>
      <circle cx="264" cy="186" r="14" fill="#f0c4a0"/>
      <!-- Head -->
      <rect x="142" y="106" width="116" height="152" rx="56" fill="#f0c4a0"/>
      <!-- Distinguished Executive Hair -->
      <path d="M140 162 C136 112 164 88 202 88 C242 88 266 114 260 162 C252 132 232 120 200 120 C168 120 148 134 140 162 Z" fill="#1e293b"/>
      <!-- Eyebrows -->
      <path d="M164 166 Q177 160 188 165" stroke="#1e293b" stroke-width="4" stroke-linecap="round" fill="none"/>
      <path d="M212 165 Q223 160 236 166" stroke="#1e293b" stroke-width="4" stroke-linecap="round" fill="none"/>
      <!-- Eyes -->
      <circle cx="176" cy="180" r="5.5" fill="#0f172a"/>
      <circle cx="224" cy="180" r="5.5" fill="#0f172a"/>
      <!-- Executive Glasses Frame -->
      <rect x="158" y="168" width="36" height="24" rx="6" fill="none" stroke="#d97706" stroke-width="2.5"/>
      <rect x="206" y="168" width="36" height="24" rx="6" fill="none" stroke="#d97706" stroke-width="2.5"/>
      <line x1="194" y1="178" x2="206" y2="178" stroke="#d97706" stroke-width="2.5"/>
      <!-- Nose -->
      <path d="M200 182 L196 204 L205 206" stroke="#c9956e" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" fill="none"/>
      <!-- Confident Smile -->
      <path d="M182 222 Q200 234 218 222" stroke="#b87d56" stroke-width="3.8" stroke-linecap="round" fill="none"/>
      <!-- Gold Commissioner Lapel Crest -->
      <circle cx="246" cy="352" r="7.5" fill="url(#goldGrad)"/>
      <circle cx="246" cy="352" r="3.5" fill="#090C1E"/>
    </svg>`;
    return 'data:image/svg+xml;utf8,' + encodeURIComponent(svg);
  }

  const LEADER_QUOTES = {
    reinhardt: 'Menjaga marwah, independensi redaksi, dan integritas jurnalistik tertinggi FoxSA News.',
    arthur: 'Setiap berita yang terbit harus akurat, tajam, dan menjunjung profesionalisme jurnalisme di San Andreas.'
  };

  const FOXSA_TEAM_MEMBERS = [
    {
      id: 'reinhardt',
      name: 'Reinhardt Harrison',
      role: 'Board of Commissioners',
      badge: 'Board of Commissioners',
      dept: 'boc',
      featured: true,
      discordId: '797879523726983198',
      bio: 'Dewan Komisaris FoxSA News Agency yang mengawasi tata kelola perusahaan, memberikan nasihat strategis tingkat tinggi kepada Dewan Direksi, serta menjaga marwah dan independensi jaringan media di San Andreas.',
      experienceIntro: 'Berperan sebagai pengawas tertinggi yang memastikan seluruh kebijakan strategis dan operasional FoxSA News berjalan sesuai visi utama perusahaan.',
      highlights: [
        'Mengawasi jalannya kebijakan strategis & tata kelola Dewan Direksi FoxSA News',
        'Memberikan arahan & pertimbangan utama dalam pengembangan jangka panjang perusahaan',
        'Menjaga standar kehormatan, integritas, dan independensi FoxSA News Agency'
      ]
    },
    {
      id: 'arthur',
      name: 'Arthur Redfields',
      role: 'Chief Executive Officer',
      badge: 'Chief Executive Officer',
      dept: 'bod',
      featured: true,
      discordId: '797879523726983198',
      bio: 'Pimpinan tertinggi FoxSA News Agency yang mengarahkan visi strategis, kebijakan penyiaran, independensi ruang redaksi, transformasi digital, serta kemitraan utama jaringan media di seluruh San Andreas.',
      experienceIntro: 'Memimpin operasional dan strategi ruang redaksi FoxSA News dengan komitmen teguh terhadap integritas, akurasi, dan profesionalisme.',
      highlights: [
        'Memimpin arah strategis & kebijakan penyiaran FoxSA News Network 24/7',
        'Mengintegrasikan 3 ekosistem utama: News Channel, FoxSA Media, & Audio Station',
        'Menjaga independensi redaksi dan kemitraan strategis lintas instansi San Andreas'
      ]
    },
    {
      id: 'park',
      name: 'Park Young-Hwan',
      role: 'Line Producer',
      badge: 'Supervisor Team',
      dept: 'supervisor',
      featured: false,
      discordId: '797879523726983198',
      bio: 'Line Producer pada Supervisor Team yang mengoordinasikan eksekusi teknis produksi siaran harian, alur kerja liputan lapangan, serta kelancaran jadwal program berita.'
    },
    {
      id: 'steven',
      name: 'Steven Deluca',
      role: 'Journalism Intern',
      badge: 'Operational Staff',
      dept: 'staff',
      featured: false,
      discordId: '1302277024425185380',
      bio: 'Journalism Intern pada Operational Staff yang aktif membantu riset lapangan, peliputan peristiwa aktual, serta dokumentasi berita di kawasan Los Santos.'
    }
  ];

  function renderProfileView(subtab) {
    document.body.className = 'item';
    const mainEl = document.getElementById('main');
    if (!mainEl) return;

    const validTabs = ['overview', 'divisions', 'roadmap', 'recruitment'];
    const activeTab = validTabs.includes(subtab) ? subtab : 'overview';

    let bodyHtml = '';

    // TAB 1: OVERVIEW & "MEET OUR TEAM" INTERACTIVE SLIDER SHOWCASE
    if (activeTab === 'overview') {
      const commissioner = FOXSA_TEAM_MEMBERS.find(m => m.dept === 'boc');
      const featuredExecs = FOXSA_TEAM_MEMBERS.filter(m => m.dept === 'bod');
      const leaders = (commissioner ? [commissioner] : []).concat(featuredExecs);
      const crewMembers = FOXSA_TEAM_MEMBERS.filter(m => m.dept !== 'bod' && m.dept !== 'boc');

      bodyHtml = `
        <div class="foxsa-profile-section">
          <div class="foxsa-profile-intro-grid">
            <div class="foxsa-profile-about-text">
              <span class="foxsa-profile-kicker"><i class="fa-solid fa-shield-halved"></i> TENTANG PERUSAHAAN</span>
              <h3>Jaringan Media Berita, Televisi &amp; Radio Independen di San Andreas</h3>
              <p>
                <strong>FoxSA News</strong> adalah jaringan televisi kabel dan portal berita 24 jam di San Andreas yang dikenal karena pengaruh besarnya terhadap liputan politik, opini publik, penegakan hukum, motorsport, dan peristiwa nasional. FoxSA News resmi diluncurkan pada <strong>17 November 2025</strong> dengan <strong>Messiah Dillard</strong> sebagai CEO pertama, dan kini dipimpin oleh <strong>Catherine Cecillie</strong> selaku <em>Chief Executive Officer (CEO)</em>.
              </p>
              <p>
                Sejak awal berdirinya, FoxSA News hadir sebagai alternatif media independen yang berani, tajam, dan lugas. Kami bukan sekadar jaringan berita, melainkan keluarga para pencerita (<em>a family of storytellers</em>) yang menjunjung tinggi kerja sama tim, persahabatan, dan integritas jurnalistik di seluruh San Andreas.
              </p>

              <div class="foxsa-profile-values-grid">
                <div class="profile-value-box">
                  <h4><i class="fa-solid fa-bolt"></i> Cepat &amp; Akurat</h4>
                  <p>Liputan langsung dari lokasi kejadian bersama aparat &amp; warga San Andreas.</p>
                </div>
                <div class="profile-value-box">
                  <h4><i class="fa-solid fa-scale-balanced"></i> Independen &amp; Kredibel</h4>
                  <p>Menyajikan fakta objektif, wawancara narasumber, dan jurnalisme berimbang.</p>
                </div>
              </div>
            </div>

            <div class="foxsa-profile-side-emblem">
              <div class="profile-emblem-Showcase">
                <img src="assets/logo/foxsa-icon.jpg" alt="FoxSA News Official Emblem" />
                <div class="profile-emblem-caption">FOXSA NEWS AGENCY</div>
              </div>
              <ul class="profile-quick-facts">
                <li><span>Tanggal Berdiri</span><strong>17 November 2025</strong></li>
                <li><span>Board of Commissioners</span><strong>Reinhardt Harrison</strong></li>
                <li><span>Chief Executive Officer</span><strong>Arthur Redfields</strong></li>
                <li><span>Line Producer</span><strong>Park Young-Hwan</strong></li>
                <li><span>Journalism Intern</span><strong>Steven Deluca</strong></li>
                <li><span>Status Roster</span><strong>Official Roster 2026</strong></li>
                <li><span>Kantor Pusat</span><strong>Los Santos, SA</strong></li>
              </ul>
            </div>
          </div>

          <hr class="foxsa-profile-divider" />

          <!-- ==================== MEET OUR TEAM (REFERENCE IMAGE 1 STYLE + SLIDER) ==================== -->
          <div class="foxsa-meet-team-wrap" id="foxsa-meet-team-section">
            <div class="meet-team-top-heading">
              <h2>Meet Our <span class="team-underline">Team</span></h2>
              <p>Mengenal lebih dekat jajaran Dewan Komisaris, Dewan Direksi (CEO &amp; Board of Directors), manajemen operasional, supervisor, dan kru redaksi FoxSA News Agency.</p>
            </div>

            <!-- 1. LEADERSHIP MEMBER SHOWCASE (Board of Commissioners & Board of Directors, JAL "MEMBER" Style) -->
            <div class="foxsa-leader-member-wrap">
              <div class="leader-member-hero">
                <div class="leader-member-hero-overlay"></div>
                <div class="leader-member-hero-text">
                  <h2 class="leader-member-title">LEADERSHIP</h2>
                  <span class="leader-member-title-bar"></span>
                  <h3 class="leader-member-subtitle">Board of Commissioners &amp; Board of Directors</h3>
                  <p class="leader-member-lead">Jajaran pengawas dan pimpinan eksekutif yang menjaga arah, integritas, dan masa depan FoxSA News Agency di seluruh San Andreas.</p>
                </div>
              </div>

              <div class="leader-member-grid">
                ${leaders.map((m, idx) => `
                  <article class="leader-member-card ${m.dept === 'boc' ? 'is-commissioner' : ''}" data-leader-id="${escapeHtml(m.id)}" tabindex="0" role="button" aria-label="Lihat profil ${escapeHtml(m.name)}">
                    <div class="leader-member-photo">
                      <img src="${m.dept === 'boc' ? getCommissionerAvatarSvg() : getDefaultTeamAvatarSvg(idx - 1)}" alt="${escapeHtml(m.name)}" loading="lazy" />
                      <span class="leader-member-tag">${m.dept === 'boc' ? '<i class="fa-solid fa-crown"></i> ' : ''}${escapeHtml(m.dept === 'boc' ? 'Board of Commissioners' : m.role)}</span>
                    </div>
                    <div class="leader-member-info">
                      <p class="leader-member-quote">${escapeHtml(LEADER_QUOTES[m.id] || m.experienceIntro || '')}</p>
                      <span class="leader-member-meta">${escapeHtml(m.dept === 'boc' ? 'Dewan Komisaris' : 'Dewan Direksi')} / ${escapeHtml(m.badge)}</span>
                      <div class="leader-member-name-row">
                        <strong>${escapeHtml(m.name)}</strong>
                        <span>${escapeHtml(m.dept === 'boc' ? 'President Commissioner' : m.role)}</span>
                      </div>
                    </div>
                  </article>
                `).join('')}
              </div>
              <p class="leader-member-note"><i class="fa-regular fa-hand-pointer"></i> Klik kartu untuk melihat profil lengkap.</p>
            </div>

            <!-- Leader Profile Modal -->
            <div class="leader-profile-modal" id="leader-profile-modal" aria-hidden="true">
              <div class="leader-profile-backdrop" data-close-leader-modal></div>
              <div class="leader-profile-dialog" role="dialog" aria-modal="true">
                <button type="button" class="leader-profile-close" data-close-leader-modal aria-label="Tutup"><i class="fa-solid fa-xmark"></i></button>
                <div class="leader-profile-content" id="leader-profile-content"></div>
              </div>
            </div>

            <!-- 3. Operational Management, Supervisor Team & Operational Staff Carousel (Slide Right & Left) -->
            <div class="meet-board-slider-section">
              <div class="meet-board-header">
                <div class="meet-board-title-col">
                  <h3>Management, <span class="team-underline">Supervisor</span> &amp; Staff</h3>
                </div>
                <div class="meet-board-desc-col">
                  <p>Geser ke kanan atau kiri untuk melihat jajaran Operational Management, Supervisor Team, dan Operational Staff FoxSA News.</p>
                  <div class="meet-carousel-nav-btns">
                    <button type="button" class="meet-carousel-btn" id="team-slider-prev" aria-label="Geser Kiri">
                      <i class="fa-solid fa-arrow-left"></i>
                    </button>
                    <button type="button" class="meet-carousel-btn" id="team-slider-next" aria-label="Geser Kanan">
                      <i class="fa-solid fa-arrow-right"></i>
                    </button>
                  </div>
                </div>
              </div>

              <!-- Horizontal Slidable Cards Track -->
              <div class="meet-team-slider-viewport" id="team-slider-viewport">
                <div class="meet-team-slider-track" id="team-slider-track">
                  ${crewMembers.map((member, idx) => `
                    <div class="meet-member-card" data-member-id="${escapeHtml(member.id)}">
                      <div class="meet-member-photo-box">
                        <span class="meet-floating-role-pill">${escapeHtml(member.role)}</span>
                        <img src="${getDefaultTeamAvatarSvg(idx + 1)}" alt="${escapeHtml(member.name)}" loading="lazy" />
                      </div>
                      <div class="meet-member-info-box">
                        <span class="meet-member-dept-tag">${escapeHtml(member.badge)}</span>
                        <h4>${escapeHtml(member.name)}</h4>
                        <p>${escapeHtml(member.bio)}</p>
                      </div>
                    </div>
                  `).join('')}
                </div>
              </div>
            
            <!-- 4. OFFICIAL MEMBER ROSTER (COMPREHENSIVE 13 TIERS) -->
            <div class="foxsa-roster-board">
              <div class="roster-board-header">
                <div class="roster-header-brand">
                  <div class="roster-badge"><i class="fa-solid fa-microphone-lines"></i> FOXSA NEWS AGENCY</div>
                  <h3>OFFICIAL MEMBER ROSTER</h3>
                  <p class="roster-motto">“Accurate Information. Professional Journalism. Trusted by San Andreas.”</p>
                </div>
                <div class="roster-header-meta">
                  <span class="roster-tag"><i class="fa-solid fa-calendar-check"></i> Active Period 2026</span>
                  <span class="roster-tag"><i class="fa-solid fa-users-gear"></i> Official Structure</span>
                </div>
              </div>

              <div class="roster-tier-list">
                <!-- TIER: BOARD OF COMMISSIONERS -->
                <div class="roster-tier-block tier-commissioner">
                  <div class="roster-tier-label">
                    <span class="tier-icon"><i class="fa-solid fa-crown"></i></span>
                    <h4>BOARD OF COMMISSIONERS</h4>
                    <span class="tier-pill red">Supervisory Council</span>
                  </div>
                  <div class="roster-tier-grid">
                    <div class="roster-card active">
                      <div class="roster-card-head">
                        <span class="roster-pos-title">Board of Commissioners</span>
                        <span class="roster-status-badge active"><i class="fa-solid fa-circle-check"></i> Active</span>
                      </div>
                      <div class="roster-officer-name">Reinhardt Harrison</div>
                      <div class="roster-discord-id"><i class="fa-brands fa-discord"></i> &lt;@797879523726983198&gt;</div>
                    </div>
                  </div>
                </div>

                <!-- TIER: BOARD OF DIRECTORS -->
                <div class="roster-tier-block tier-directors">
                  <div class="roster-tier-label">
                    <span class="tier-icon"><i class="fa-solid fa-shield-halved"></i></span>
                    <h4>BOARD OF DIRECTORS</h4>
                    <span class="tier-pill purple">Executive Leadership</span>
                  </div>
                  <div class="roster-tier-grid">
                    <div class="roster-card active">
                      <div class="roster-card-head">
                        <span class="roster-pos-num">01</span>
                        <span class="roster-pos-title">Chief Executive Officer</span>
                        <span class="roster-status-badge active"><i class="fa-solid fa-circle-check"></i> Active</span>
                      </div>
                      <div class="roster-officer-name">Arthur Redfields</div>
                      <div class="roster-discord-id"><i class="fa-brands fa-discord"></i> &lt;@797879523726983198&gt;</div>
                    </div>

                    <div class="roster-card vacant">
                      <div class="roster-card-head">
                        <span class="roster-pos-num">02</span>
                        <span class="roster-pos-title">Chief Operational Officer</span>
                        <span class="roster-status-badge vacant">VACANT</span>
                      </div>
                      <div class="roster-officer-name vacant">— Belum Terisi —</div>
                      <div class="roster-vacant-note">Posisi Terbuka untuk Promosi</div>
                    </div>

                    <div class="roster-card vacant">
                      <div class="roster-card-head">
                        <span class="roster-pos-num">03</span>
                        <span class="roster-pos-title">Vice President</span>
                        <span class="roster-status-badge vacant">VACANT</span>
                      </div>
                      <div class="roster-officer-name vacant">— Belum Terisi —</div>
                      <div class="roster-vacant-note">Posisi Terbuka untuk Promosi</div>
                    </div>
                  </div>
                </div>

                <!-- TIER: OPERATIONAL MANAGEMENT -->
                <div class="roster-tier-block tier-management">
                  <div class="roster-tier-label">
                    <span class="tier-icon"><i class="fa-solid fa-briefcase"></i></span>
                    <h4>OPERATIONAL MANAGEMENT</h4>
                    <span class="tier-pill blue">Department Leads</span>
                  </div>
                  <div class="roster-tier-grid">
                    <div class="roster-card vacant">
                      <div class="roster-card-head">
                        <span class="roster-pos-num">04</span>
                        <span class="roster-pos-title">General Manager</span>
                        <span class="roster-status-badge vacant">VACANT</span>
                      </div>
                      <div class="roster-officer-name vacant">— Belum Terisi —</div>
                      <div class="roster-vacant-note">Open Position</div>
                    </div>

                    <div class="roster-card vacant">
                      <div class="roster-card-head">
                        <span class="roster-pos-num">05</span>
                        <span class="roster-pos-title">Executive Producer</span>
                        <span class="roster-status-badge vacant">VACANT</span>
                      </div>
                      <div class="roster-officer-name vacant">— Belum Terisi —</div>
                      <div class="roster-vacant-note">Open Position</div>
                    </div>
                  </div>
                </div>

                <!-- TIER: SUPERVISOR TEAM -->
                <div class="roster-tier-block tier-supervisor">
                  <div class="roster-tier-label">
                    <span class="tier-icon"><i class="fa-solid fa-clapperboard"></i></span>
                    <h4>SUPERVISOR TEAM</h4>
                    <span class="tier-pill teal">Field &amp; Production Leads</span>
                  </div>
                  <div class="roster-tier-grid">
                    <div class="roster-card vacant">
                      <div class="roster-card-head">
                        <span class="roster-pos-num">06</span>
                        <span class="roster-pos-title">Managing Editor</span>
                        <span class="roster-status-badge vacant">VACANT</span>
                      </div>
                      <div class="roster-officer-name vacant">— Belum Terisi —</div>
                      <div class="roster-vacant-note">Open Position</div>
                    </div>

                    <div class="roster-card vacant">
                      <div class="roster-card-head">
                        <span class="roster-pos-num">07</span>
                        <span class="roster-pos-title">Senior Producer</span>
                        <span class="roster-status-badge vacant">VACANT</span>
                      </div>
                      <div class="roster-officer-name vacant">— Belum Terisi —</div>
                      <div class="roster-vacant-note">Open Position</div>
                    </div>

                    <div class="roster-card active">
                      <div class="roster-card-head">
                        <span class="roster-pos-num">08</span>
                        <span class="roster-pos-title">Line Producer</span>
                        <span class="roster-status-badge active"><i class="fa-solid fa-circle-check"></i> Active</span>
                      </div>
                      <div class="roster-officer-name">Park Young-Hwan</div>
                      <div class="roster-discord-id"><i class="fa-brands fa-discord"></i> &lt;@797879523726983198&gt;</div>
                    </div>
                  </div>
                </div>

                <!-- TIER: OPERATIONAL STAFF -->
                <div class="roster-tier-block tier-staff">
                  <div class="roster-tier-label">
                    <span class="tier-icon"><i class="fa-solid fa-microphone"></i></span>
                    <h4>OPERATIONAL STAFF</h4>
                    <span class="tier-pill green">Newsroom Reporters &amp; Crew</span>
                  </div>
                  <div class="roster-tier-grid">
                    <div class="roster-card vacant">
                      <div class="roster-card-head">
                        <span class="roster-pos-num">09</span>
                        <span class="roster-pos-title">Head Reporter</span>
                        <span class="roster-status-badge vacant">VACANT</span>
                      </div>
                      <div class="roster-officer-name vacant">— Belum Terisi —</div>
                      <div class="roster-vacant-note">Open Position</div>
                    </div>

                    <div class="roster-card vacant">
                      <div class="roster-card-head">
                        <span class="roster-pos-num">10</span>
                        <span class="roster-pos-title">Senior Reporter</span>
                        <span class="roster-status-badge vacant">VACANT</span>
                      </div>
                      <div class="roster-officer-name vacant">— Belum Terisi —</div>
                      <div class="roster-vacant-note">Open Position</div>
                    </div>

                    <div class="roster-card vacant">
                      <div class="roster-card-head">
                        <span class="roster-pos-num">11</span>
                        <span class="roster-pos-title">Staff Reporter</span>
                        <span class="roster-status-badge vacant">VACANT</span>
                      </div>
                      <div class="roster-officer-name vacant">— Belum Terisi —</div>
                      <div class="roster-vacant-note">Open Position</div>
                    </div>

                    <div class="roster-card vacant">
                      <div class="roster-card-head">
                        <span class="roster-pos-num">12</span>
                        <span class="roster-pos-title">Junior Reporter</span>
                        <span class="roster-status-badge vacant">VACANT</span>
                      </div>
                      <div class="roster-officer-name vacant">— Belum Terisi —</div>
                      <div class="roster-vacant-note">Open Position</div>
                    </div>

                    <div class="roster-card active">
                      <div class="roster-card-head">
                        <span class="roster-pos-num">13</span>
                        <span class="roster-pos-title">Journalism Intern</span>
                        <span class="roster-status-badge active"><i class="fa-solid fa-circle-check"></i> Active</span>
                      </div>
                      <div class="roster-officer-name">Steven Deluca</div>
                      <div class="roster-discord-id"><i class="fa-brands fa-discord"></i> &lt;@1302277024425185380&gt;</div>
                    </div>
                  </div>
                </div>
              </div>

              <div class="roster-board-footer">
                <div class="roster-footer-left">
                  <strong>FoxSA News Management</strong>
                  <span>Integrity • Accuracy • Professionalism</span>
                </div>
                <a href="#/profile/recruitment" class="roster-join-btn">
                  <i class="fa-solid fa-user-plus"></i> Gabung FoxSA News (Open Recruitment)
                </a>
              </div>
            </div>
</div>
          </div>
        </div>
      `;
    }

    // TAB 2: DIVISI MEDIA, CHANNEL & RADIO
    else if (activeTab === 'divisions') {
      bodyHtml = `
        <div class="foxsa-profile-section">
          <div class="foxsa-org-header" style="margin-bottom:24px;">
            <span class="foxsa-profile-kicker"><i class="fa-solid fa-layer-group"></i> EKOSISTEM PENYIARAN FOXSA</span>
            <h3 class="foxsa-profile-section-title">3 Divisi Utama FoxSA News Network</h3>
            <p class="foxsa-profile-lead">Setiap divisi memiliki identitas visual dan fokus layanan tersendiri untuk menjangkau seluruh lapisan warga San Andreas melalui televisi, artikel digital, dan frekuensi suara.</p>
          </div>

          <div class="foxsa-divisions-grid">
            <!-- Division 1: FoxSA News Channel -->
            <div class="foxsa-division-card">
              <div class="division-logo-wrap">
                <img src="assets/logo/foxsa-channel.jpg" alt="FoxSA News Channel Logo" />
              </div>
              <div class="division-body">
                <span class="division-badge">TELEVISI &amp; LIVE BROADCAST</span>
                <h3>FoxSA News Channel</h3>
                <p>
                  Divisi penyiaran televisi kabel 24 jam yang menyuguhkan program <strong>Live Broadcast Harian</strong> (mulai pukul 19.30 WIB), liputan Breaking News langsung dari tempat kejadian perkara (TKP), serta siaran eksklusif acara kenegaraan dan kejuaraan motorsport San Andreas.
                </p>
                <ul class="division-features">
                  <li><i class="fa-solid fa-circle-check"></i> Siaran Berita Malam Harian (19.30 WIB)</li>
                  <li><i class="fa-solid fa-circle-check"></i> Live Breaking News &amp; Konferensi Pers</li>
                  <li><i class="fa-solid fa-circle-check"></i> Liputan Eksklusif Event Kota &amp; Motorsport</li>
                </ul>
              </div>
            </div>

            <!-- Division 2: FoxSA News Media -->
            <div class="foxsa-division-card">
              <div class="division-logo-wrap">
                <img src="assets/logo/foxsa-media.jpg" alt="FoxSA News Media Logo" />
              </div>
              <div class="division-body">
                <span class="division-badge">PORTAL BERITA DIGITAL &amp; JURNALISME</span>
                <h3>FoxSA News Media</h3>
                <p>
                  Divisi surat kabar digital (<em>Daily Digital Newspaper</em>) dan jurnalisme investigasi berbasis web. Menyajikan artikel berita harian yang terstruktur, cepat diakses melalui perangkat PC maupun HP Android, serta didukung dokumentasi fotografi jurnalis lapangan.
                </p>
                <ul class="division-features">
                  <li><i class="fa-solid fa-circle-check"></i> Artikel Berita Harian Berbasis Web Resmi</li>
                  <li><i class="fa-solid fa-circle-check"></i> Liputan Kriminal, LSPD, LSFD &amp; Pemerintahan</li>
                  <li><i class="fa-solid fa-circle-check"></i> Kolom Opini Publik &amp; Interaksi Komentar Warga IC</li>
                </ul>
              </div>
            </div>

            <!-- Division 3: FoxSA Audio & Radio Station -->
            <div class="foxsa-division-card">
              <div class="division-logo-wrap">
                <img src="assets/logo/foxsa-audio.jpg" alt="FoxSA Audio & Radio Station Logo" />
              </div>
              <div class="division-body">
                <span class="division-badge">RADIO STATION &amp; PODCAST ACADEMY</span>
                <h3>FoxSA Audio &amp; Radio Station</h3>
                <p>
                  Divisi penyiaran audio, radio komunitas San Andreas, dan pusat pelatihan internal <strong>FoxSA Podcast Academy</strong>. Dirancang untuk menemani warga yang sedang berkendara sekaligus mencetak talenta penyiaran profesional.
                </p>
                <ul class="division-features">
                  <li><i class="fa-solid fa-circle-check"></i> Program Talkshow &amp; Diskusi Publik San Andreas</li>
                  <li><i class="fa-solid fa-circle-check"></i> Podcast Academy: Pelatihan <strong>Presenter</strong></li>
                  <li><i class="fa-solid fa-circle-check"></i> Pelatihan Teknis <strong>Cameraperson</strong> &amp; <strong>Mixer</strong></li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      `;
    }

    // TAB 3: ROADMAP / PROGRAM & RENCANA PENGEMBANGAN
    else if (activeTab === 'roadmap') {
      bodyHtml = `
        <div class="foxsa-profile-section">
          <div class="foxsa-org-header" style="margin-bottom:22px;">
            <span class="foxsa-profile-kicker"><i class="fa-solid fa-rocket"></i> ROADMAP &amp; INOVASI</span>
            <h3 class="foxsa-profile-section-title">Rencana Pengembangan &amp; Pembaruan FoxSA News</h3>
            <p class="foxsa-profile-lead">FoxSA News tengah menjalankan berbagai langkah strategis untuk meningkatkan kualitas penyajian informasi serta memperluas jangkauan audiens di seluruh San Andreas.</p>
          </div>

          <div class="foxsa-roadmap-grid">
            <div class="roadmap-item-card">
              <span class="roadmap-step-num">PROGRAM 01 • ON-GOING</span>
              <h4><i class="fa-solid fa-newspaper"></i> Transformasi Newspaper Digital</h4>
              <ul>
                <li>Format <em>newspaper</em> dikembangkan menjadi <strong>Berita Harian berbasis teks &amp; web</strong> yang lebih sederhana, informatif, dan mudah diakses kapan saja oleh warga.</li>
                <li>Konten tidak lagi bergantung pada poster statis seperti Canva, melainkan difokuskan pada penyampaian informasi jurnalistik yang jelas, terstruktur, dan profesional.</li>
              </ul>
            </div>

            <div class="roadmap-item-card">
              <span class="roadmap-step-num">PROGRAM 02 • ON-GOING</span>
              <h4><i class="fa-solid fa-tv"></i> Penjadwalan Broadcast Harian</h4>
              <ul>
                <li>FoxSA News menyusun sistem siaran rutin harian guna menjaga konsistensi penyampaian informasi terkini kepada seluruh audiens di San Andreas.</li>
                <li><strong>Broadcast dilaksanakan setiap hari</strong> dengan waktu tayang minimal dimulai pada pukul <strong>19.30 WIB</strong> untuk meningkatkan keterlibatan pemirsa.</li>
              </ul>
            </div>

            <div class="roadmap-item-card">
              <span class="roadmap-step-num">PROGRAM 03 • ON-GOING</span>
              <h4><i class="fa-solid fa-podcast"></i> Pengembangan Academy melalui Podcast</h4>
              <ul>
                <li>Menghadirkan program <strong>Podcast Academy</strong> untuk melatih anggota dalam berbagai peran penting di dunia <em>broadcasting</em>.</li>
                <li>Fokus pelatihan mencakup peran <strong>Presenter</strong>, <strong>Cameraperson</strong>, serta <strong>Mixer / Audio Engineer</strong>.</li>
              </ul>
            </div>

            <div class="roadmap-item-card">
              <span class="roadmap-step-num">PROGRAM 04 • ON-GOING</span>
              <h4><i class="fa-solid fa-handshake"></i> Kerja Sama Strategis Lintas Instansi</h4>
              <ul>
                <li>Memperluas jaringan melalui kolaborasi strategis dengan berbagai <strong>Companies di Valliant</strong>.</li>
                <li>Membangun kemitraan publikasi dan peliputan resmi bersama <strong>Faction LSPD, LSSD, &amp; LSFD</strong>.</li>
              </ul>
            </div>
          </div>

          <div class="foxsa-roadmap-closing">
            <i class="fa-solid fa-bullhorn"></i>
            <p>
              <strong>Komitmen Pelayanan Informasi:</strong> FoxSA News berkomitmen untuk terus berkembang sebagai media informasi independen yang profesional, terpercaya, dan inovatif bagi seluruh warga San Andreas.
            </p>
          </div>
        </div>
      `;
    }

    // TAB 4: NEW OPEN RECRUITMENT FOXSA NEWS AGENCY + OFFICIAL POSTER DESIGN
    else if (activeTab === 'recruitment') {
      bodyHtml = `
        <div class="foxsa-profile-section">
          <!-- Top Hero Recruitment Banner -->
          <div class="foxsa-rec-banner">
            <div class="rec-banner-left">
              <div class="rec-status-pill">
                <span class="pulse-dot"></span> RECRUITMENT STATUS: OPEN!
              </div>
              <h2>🎙️ START YOUR STORY WITH FOXSA NEWS AGENCY! 🎙️</h2>
              <p>
                We are more than just a news network; we are a family of storytellers. FoxSA News is currently looking for passionate individuals who value teamwork, camaraderie, and journalistic integrity. If you are looking for a workplace where colleagues become close friends, this is your home!
              </p>
            </div>
            <a href="https://discord.gg/rVeaKGzhyy" target="_blank" rel="noopener" class="rec-discord-cta-btn">
              <i class="fa-brands fa-discord"></i> Join Communication Hub
            </a>
          </div>

          <!-- 2-Column Showcase: Official Announcement + "WE'RE HIRING!" Poster Design -->
          <div class="foxsa-rec-showcase-grid">
            <!-- Left Column: Full Recruitment Details -->
            <div class="foxsa-rec-details-col">
              <!-- Departments We Are Hiring For -->
              <div class="rec-detail-block">
                <h3><i class="fa-solid fa-sitemap"></i> Departments We Are Hiring For</h3>
                <p class="rec-detail-intro">We are actively filling key positions to complete our new structural family:</p>
                <div class="rec-dept-cards-grid">
                  <div class="rec-dept-item">
                    <div class="rec-dept-icon"><i class="fa-solid fa-crown"></i></div>
                    <div class="rec-dept-text">
                      <strong>Board of Directors</strong>
                      <span class="rec-dept-desc">Strategic Leadership &amp; Executive Governance</span>
                    </div>
                  </div>
                  <div class="rec-dept-item">
                    <div class="rec-dept-icon"><i class="fa-solid fa-briefcase"></i></div>
                    <div class="rec-dept-text">
                      <strong>Operational Management</strong>
                      <span class="rec-dept-desc">Division Managers, HRD, PR &amp; Event Operations</span>
                    </div>
                  </div>
                  <div class="rec-dept-item">
                    <div class="rec-dept-icon"><i class="fa-solid fa-user-check"></i></div>
                    <div class="rec-dept-text">
                      <strong>Supervisor Team</strong>
                      <span class="rec-dept-desc">Editorial Supervisors, Lead Reporters &amp; Quality Control</span>
                    </div>
                  </div>
                  <div class="rec-dept-item">
                    <div class="rec-dept-icon"><i class="fa-solid fa-microphone-lines"></i></div>
                    <div class="rec-dept-text">
                      <strong>Operational Staff</strong>
                      <span class="rec-dept-desc">Journalists, Presenters, Camerapersons &amp; Broadcast Crew</span>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Recruitment Timeline -->
              <div class="rec-detail-block">
                <h3><i class="fa-regular fa-calendar-check"></i> Recruitment Timeline</h3>
                <div class="rec-timeline-box">
                  <div class="rec-timeline-row">
                    <span class="tl-label">Status:</span>
                    <span class="tl-badge-open">OPEN!</span>
                  </div>
                  <div class="rec-timeline-row">
                    <span class="tl-label">Deadline:</span>
                    <span class="tl-text">We are keeping our doors open until we find the right people to complete our crew. Take your time, but don't miss the chance!</span>
                  </div>
                </div>
              </div>

              <!-- Next Steps to Join -->
              <div class="rec-detail-block highlight-next-steps">
                <h3><i class="fa-solid fa-compass"></i> Next Steps to Join</h3>
                <p>
                  No lengthy paperwork or forms required just yet! To start your journey with us, simply hop into our communication hub, get to know the crew, and wait for further directions from our Executive Board.
                </p>

                <div class="rec-official-links-box">
                  <a href="https://discord.gg/rVeaKGzhyy" target="_blank" rel="noopener" class="rec-link-card discord-card">
                    <i class="fa-brands fa-discord"></i>
                    <div>
                      <small>🔗 Join our Discord</small>
                      <strong>https://discord.gg/rVeaKGzhyy</strong>
                    </div>
                  </a>
                  <a href="#/" class="rec-link-card web-card">
                    <i class="fa-solid fa-globe"></i>
                    <div>
                      <small>🌐 Check our Website</small>
                      <strong>www.foxsanews.blogspot.com</strong>
                    </div>
                  </a>
                </div>

                <div class="rec-closing-quote">
                  <p>Come for the career, stay for the family. Let’s build something great together! 🤝📰</p>
                  <div class="rec-hashtags">
                    <span>#DeliveringTheTruth</span>
                    <span>#FoxSANews</span>
                    <span>#MoreThanJustNews</span>
                    <span class="everyone-tag">(( @everyone ))</span>
                  </div>
                </div>
              </div>
            </div>

            <!-- Right Column: Official "WE'RE HIRING!" Poster Design -->
            <div class="foxsa-rec-poster-col">
              <div class="rec-poster-card">
                <div class="rec-poster-card-head">
                  <span><i class="fa-solid fa-image"></i> Official Recruitment Poster</span>
                  <a href="assets/logo/foxsa-recruitment-poster.jpg" target="_blank" rel="noopener" title="Buka ukuran penuh">
                    <i class="fa-solid fa-expand"></i> Full Size
                  </a>
                </div>
                <a href="assets/logo/foxsa-recruitment-poster.jpg" target="_blank" rel="noopener" class="rec-poster-img-link">
                  <img src="assets/logo/foxsa-recruitment-poster.jpg" alt="FoxSA News Agency - We're Hiring Poster" />
                </a>
                <div class="rec-poster-card-foot">
                  <span>FoxSA News Agency — We're Hiring!</span>
                  <a href="https://discord.gg/rVeaKGzhyy" target="_blank" rel="noopener">Join Discord &rarr;</a>
                </div>
              </div>
            </div>
          </div>
        </div>
      `;
    }

    mainEl.innerHTML = `
      <div class="foxsa-company-profile-wrap">
        <!-- Company Profile Top Hero Header -->
        <div class="foxsa-profile-hero">
          <div class="foxsa-profile-hero-bg"></div>
          <div class="foxsa-profile-hero-inner">
            <div class="profile-hero-content">
              <div class="profile-hero-badge">
                <i class="fa-solid fa-certificate"></i> OFFICIAL COMPANY PROFILE • LOS SANTOS, SA
              </div>
              <h1>FoxSA News — Independent News Network</h1>
              <p class="profile-hero-tagline">Portal Informasi Resmi, Jajaran Pimpinan &amp; Tim Redaksi, Divisi Penyiaran, Program Pengembangan &amp; Rekrutmen FoxSA News Agency.</p>
              <div class="profile-hero-chips">
                <span><i class="fa-solid fa-tv"></i> FoxSA News Channel</span>
                <span><i class="fa-solid fa-newspaper"></i> FoxSA News Media</span>
                <span><i class="fa-solid fa-radio"></i> FoxSA Audio &amp; Radio</span>
              </div>
            </div>
            <div class="profile-hero-logo">
              <img src="assets/logo/foxsa-icon.jpg" alt="FoxSA News" />
            </div>
          </div>
        </div>

        <!-- Sub-Navigation Tabs -->
        <div class="foxsa-profile-tabs">
          <a href="#/profile" class="foxsa-profile-tab ${activeTab === 'overview' ? 'is-active' : ''}">
            <i class="fa-regular fa-building"></i> Tentang &amp; Tim Kami
          </a>
          <a href="#/profile/divisions" class="foxsa-profile-tab ${activeTab === 'divisions' ? 'is-active' : ''}">
            <i class="fa-solid fa-tower-broadcast"></i> Divisi Media &amp; Radio
          </a>
          <a href="#/profile/roadmap" class="foxsa-profile-tab ${activeTab === 'roadmap' ? 'is-active' : ''}">
            <i class="fa-solid fa-rocket"></i> Program &amp; Rencana
          </a>
          <a href="#/profile/recruitment" class="foxsa-profile-tab ${activeTab === 'recruitment' ? 'is-active' : ''}">
            <i class="fa-solid fa-bullhorn"></i> Open Recruitment
          </a>
        </div>

        <!-- Tab Body Content -->
        <div class="foxsa-profile-card-body">
          ${bodyHtml}
        </div>
      </div>
    `;

    // Bind Horizontal Carousel Left/Right Buttons, Wheel & Drag-to-Scroll on Overview
    if (activeTab === 'overview') {
      // Leadership Member Cards -> Open Profile Modal
      const leaderModal = document.getElementById('leader-profile-modal');
      const leaderContent = document.getElementById('leader-profile-content');
      const closeLeaderModal = () => {
        if (!leaderModal) return;
        leaderModal.classList.remove('is-open');
        leaderModal.setAttribute('aria-hidden', 'true');
        document.body.classList.remove('leader-modal-open');
      };
      const openLeaderModal = (memberId) => {
        const m = FOXSA_TEAM_MEMBERS.find(x => x.id === memberId);
        if (!m || !leaderModal || !leaderContent) return;
        const isBoc = m.dept === 'boc';
        const bodIdx = FOXSA_TEAM_MEMBERS.filter(x => x.dept === 'bod').indexOf(m);
        const avatar = isBoc ? getCommissionerAvatarSvg() : getDefaultTeamAvatarSvg(bodIdx);
        leaderContent.innerHTML = `
          <div class="leader-profile-grid ${isBoc ? 'is-commissioner' : ''}">
            <div class="leader-profile-photo">
              <img src="${avatar}" alt="${escapeHtml(m.name)}" />
              <span class="leader-member-tag">${isBoc ? '<i class="fa-solid fa-crown"></i> Board of Commissioners' : escapeHtml(m.role)}</span>
            </div>
            <div class="leader-profile-body">
              <span class="leader-profile-kicker">${escapeHtml(isBoc ? 'Dewan Komisaris' : 'Dewan Direksi')} • ${escapeHtml(m.badge)}</span>
              <h3>${escapeHtml(m.name)}</h3>
              <p class="leader-profile-role">${escapeHtml(isBoc ? 'President Commissioner' : m.role)}</p>
              <blockquote class="leader-profile-quote">“${escapeHtml(LEADER_QUOTES[m.id] || '')}”</blockquote>
              <p class="leader-profile-bio">${escapeHtml(m.bio)}</p>
              <h4>${isBoc ? 'Wewenang &amp; Fokus Pengawasan' : 'Fokus &amp; Tanggung Jawab'}</h4>
              <ul class="leader-profile-list">
                ${(m.highlights || []).map(h => `<li><i class="fa-solid fa-check"></i><span>${escapeHtml(h)}</span></li>`).join('')}
              </ul>
            </div>
          </div>
        `;
        leaderModal.classList.add('is-open');
        leaderModal.setAttribute('aria-hidden', 'false');
        document.body.classList.add('leader-modal-open');
      };

      mainEl.querySelectorAll('[data-leader-id]').forEach(card => {
        card.addEventListener('click', () => openLeaderModal(card.getAttribute('data-leader-id')));
        card.addEventListener('keydown', (e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            openLeaderModal(card.getAttribute('data-leader-id'));
          }
        });
      });
      mainEl.querySelectorAll('[data-close-leader-modal]').forEach(el => {
        el.addEventListener('click', closeLeaderModal);
      });
      if (!window.__foxsaLeaderEscBound) {
        window.__foxsaLeaderEscBound = true;
        document.addEventListener('keydown', (e) => {
          if (e.key === 'Escape') {
            const modal = document.getElementById('leader-profile-modal');
            if (modal && modal.classList.contains('is-open')) {
              modal.classList.remove('is-open');
              modal.setAttribute('aria-hidden', 'true');
              document.body.classList.remove('leader-modal-open');
            }
          }
        });
      }

      const viewport = document.getElementById('team-slider-viewport');
      const slidePrev = document.getElementById('team-slider-prev');
      const slideNext = document.getElementById('team-slider-next');

      if (viewport && slidePrev && slideNext) {
        const getScrollStep = () => {
          const firstCard = viewport.querySelector('.meet-member-card');
          if (!firstCard) return 300;
          const isMobile = window.innerWidth <= 680;
          const gap = isMobile ? 14 : 20;
          return isMobile ? (firstCard.offsetWidth + gap) : (firstCard.offsetWidth + gap) * 2;
        };

        slidePrev.addEventListener('click', () => {
          if (viewport.scrollLeft <= 10) {
            viewport.scrollTo({ left: viewport.scrollWidth, behavior: 'smooth' });
          } else {
            viewport.scrollBy({ left: -getScrollStep(), behavior: 'smooth' });
          }
        });

        slideNext.addEventListener('click', () => {
          if (viewport.scrollLeft + viewport.clientWidth >= viewport.scrollWidth - 10) {
            viewport.scrollTo({ left: 0, behavior: 'smooth' });
          } else {
            viewport.scrollBy({ left: getScrollStep(), behavior: 'smooth' });
          }
        });

        viewport.addEventListener('wheel', (e) => {
          if (Math.abs(e.deltaY) > Math.abs(e.deltaX)) {
            e.preventDefault();
            viewport.scrollLeft += e.deltaY * 1.4;
          }
        }, { passive: false });

        // Mouse drag-to-scroll support on desktop
        let isDown = false;
        let startX = 0;
        let scrollLeftStart = 0;

        viewport.addEventListener('mousedown', (e) => {
          isDown = true;
          viewport.classList.add('is-dragging');
          startX = e.pageX - viewport.offsetLeft;
          scrollLeftStart = viewport.scrollLeft;
        });
        viewport.addEventListener('mouseleave', () => {
          isDown = false;
          viewport.classList.remove('is-dragging');
        });
        viewport.addEventListener('mouseup', () => {
          isDown = false;
          viewport.classList.remove('is-dragging');
        });
        viewport.addEventListener('mousemove', (e) => {
          if (!isDown) return;
          e.preventDefault();
          const x = e.pageX - viewport.offsetLeft;
          const walk = (x - startX) * 1.4;
          viewport.scrollLeft = scrollLeftStart - walk;
        });
      }
    }
  }

  function renderMainView() {
    const { view, param } = state.currentRoute;
    if (view === 'post') {
      renderSinglePostView(param);
    } else if (view === 'profile') {
      renderProfileView(param);
    } else if (view === 'admin') {
      renderAdminView();
    } else {
      renderListView();
    }
  }

  function renderAll() {
    renderHeroShowcase();
    renderMainView();
    renderWidgets();
  }

  // =========================================================================
  // 9. UI INTERACTIONS (TOPBAR DATE, INLINE SEARCH, SIDEBAR TABS, DRAWER)
  // =========================================================================

  function rebuildMobileDrawerMenu() {
    const mobileMenuContainer = document.querySelector('.mobile-menu');
    const desktopMenuNav = document.getElementById('main-menu-nav');
    if (!mobileMenuContainer || !desktopMenuNav) return;

    mobileMenuContainer.innerHTML = '';
    const clonedUl = desktopMenuNav.cloneNode(true);
    clonedUl.removeAttribute('id');

    clonedUl.querySelectorAll('li.has-sub').forEach(li => {
      const toggleSpan = document.createElement('span');
      toggleSpan.className = 'submenu-toggle';
      li.appendChild(toggleSpan);

      const topLink = li.querySelector(':scope > a');
      const toggleFn = (e) => {
        e.preventDefault();
        e.stopPropagation();
        li.classList.toggle('show');
      };
      toggleSpan.addEventListener('click', toggleFn);
      if (topLink && topLink.getAttribute('href') === 'javascript:void(0)') {
        topLink.addEventListener('click', toggleFn);
      }
    });

    // Add Staff Portal link at the bottom of mobile menu only if logged in
    if (state.currentUser) {
      const staffLi = document.createElement('li');
      staffLi.innerHTML = `<a href="#/admin" class="admin-nav-btn"><i class="fa-solid fa-user-shield"></i> Panel (${escapeHtml(state.currentUser.displayName.split(' ')[0])})</a>`;
      clonedUl.appendChild(staffLi);
    }

    mobileMenuContainer.appendChild(clonedUl);
  }

  function initUIInteractions() {
    // Live Date in Top Bar
    const liveDateEl = document.getElementById('foxsa-live-date');
    if (liveDateEl) {
      const now = new Date();
      const dayName = DAYS_ID[now.getDay()];
      const dayNum = String(now.getDate()).padStart(2, '0');
      const monthName = MONTHS_ID[now.getMonth()];
      const year = now.getFullYear();
      liveDateEl.innerHTML = `<i class="fa-regular fa-calendar"></i> ${dayName}, ${dayNum} ${monthName} ${year}`;
    }

    // Inline Header Search (AnimeNetwork style)
    const inlineSearchForm = document.getElementById('header-inline-search-form');
    const inlineSearchInput = document.getElementById('header-inline-search-input');
    if (inlineSearchForm) {
      inlineSearchForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const q = inlineSearchInput ? inlineSearchInput.value.trim() : '';
        window.location.hash = q ? `#/search/${encodeURIComponent(q)}` : '#/';
      });
    }

    // Mobile Search Overlay Toggle
    const showSearchBtn = document.querySelector('.show-search');
    const hideSearchBtn = document.querySelector('.hide-search');
    const searchWrap = document.getElementById('nav-search');
    const searchInput = document.querySelector('#nav-search .search-input');
    const searchForm = document.querySelector('#nav-search .search-form');

    if (showSearchBtn && searchWrap) {
      showSearchBtn.addEventListener('click', () => {
        searchWrap.style.display = 'block';
        if (searchInput) searchInput.focus();
      });
    }
    if (hideSearchBtn && searchWrap) {
      hideSearchBtn.addEventListener('click', () => {
        searchWrap.style.display = 'none';
      });
    }
    if (searchForm) {
      searchForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const q = searchInput ? searchInput.value.trim() : '';
        if (searchWrap) searchWrap.style.display = 'none';
        window.location.hash = q ? `#/search/${encodeURIComponent(q)}` : '#/';
      });
    }

    // Mobile Drawer Search Form
    const mobileSearchForm = document.getElementById('mobile-drawer-search-form');
    if (mobileSearchForm) {
      mobileSearchForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const inp = mobileSearchForm.querySelector('input[name="q"]');
        const q = inp ? inp.value.trim() : '';
        document.body.classList.remove('nav-active');
        window.location.hash = q ? `#/search/${encodeURIComponent(q)}` : '#/';
      });
    }

    // Sidebar Tabs (TERPOPULER / TERBARU)
    document.querySelectorAll('[data-side-tab]').forEach(tabBtn => {
      tabBtn.addEventListener('click', () => {
        document.querySelectorAll('[data-side-tab]').forEach(b => b.classList.remove('active'));
        tabBtn.classList.add('active');
        state.sidebarTab = tabBtn.getAttribute('data-side-tab');
        renderSidebarTabbedList();
      });
    });

    // Mobile Menu Toggle & Slide Drawer
    const mobileToggles = document.querySelectorAll('.mobile-menu-toggle');
    const closeDrawerBtn = document.getElementById('mobile-drawer-close');
    const overlay = document.getElementById('mobile-drawer-overlay');
    const mobileMenuContainer = document.querySelector('.mobile-menu');

    rebuildMobileDrawerMenu();

    mobileToggles.forEach(btn => {
      btn.addEventListener('click', () => {
        document.body.classList.toggle('nav-active');
      });
    });

    if (closeDrawerBtn) {
      closeDrawerBtn.addEventListener('click', () => {
        document.body.classList.remove('nav-active');
      });
    }

    if (overlay) {
      overlay.addEventListener('click', () => {
        document.body.classList.remove('nav-active');
      });
    }

    if (mobileMenuContainer) {
      mobileMenuContainer.addEventListener('click', (e) => {
        const anchor = e.target.closest('a');
        if (anchor && anchor.getAttribute('href') !== 'javascript:void(0)') {
          document.body.classList.remove('nav-active');
        }
      });
    }

    // Back to Top button
    const backTopBtn = document.querySelector('.back-top');
    if (backTopBtn) {
      window.addEventListener('scroll', () => {
        if (window.scrollY > 250) {
          backTopBtn.style.display = 'block';
        } else {
          backTopBtn.style.display = 'none';
        }
      });
      backTopBtn.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      });
    }
  }

  // =========================================================================
  // 10. BOOTSTRAP
  // =========================================================================

  document.addEventListener('DOMContentLoaded', () => {
    loadData();
    initUIInteractions();
    state.currentRoute = parseHash();
    renderAll();
    window.addEventListener('hashchange', handleRouteChange);
    tryFetchRemoteFreshData();
  });

})();
