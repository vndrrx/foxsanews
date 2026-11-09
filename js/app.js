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
  function getRandomExecutiveAvatarSvg(seed = 0) {
    const palettes = [
      // 0: Classic Executive Navy Suit & Orange Tie (Signature FoxSA)
      { bg1: '#0f172a', bg2: '#1e293b', suit: '#1e293b', lapel: '#0f172a', tie: '#F08D39', tieKnot: '#ea580c', skin: '#f1c29b', hair: '#1e293b', glasses: false, pocketSquare: '#F08D39' },
      // 1: Charcoal Black Executive Suit & Royal Sapphire Tie
      { bg1: '#18181b', bg2: '#27272a', suit: '#18181b', lapel: '#09090b', tie: '#2563eb', tieKnot: '#1d4ed8', skin: '#f3c6a2', hair: '#3f3f46', glasses: false, pocketSquare: '#38bdf8' },
      // 2: Distinguished Midnight Blue & Crimson Tie with Glasses
      { bg1: '#0c192c', bg2: '#162b48', suit: '#0f233d', lapel: '#081424', tie: '#dc2626', tieKnot: '#b91c1c', skin: '#ecc098', hair: '#1e293b', glasses: true, pocketSquare: '#ffffff' },
      // 3: Deep Emerald Green Suit & Warm Champagne Gold Tie
      { bg1: '#06281e', bg2: '#0d3d2e', suit: '#0b3528', lapel: '#051f17', tie: '#fbbf24', tieKnot: '#f59e0b', skin: '#f2c5a0', hair: '#292524', glasses: false, pocketSquare: '#fbbf24' },
      // 4: Royal Indigo Suit & Jade Green Silk Tie
      { bg1: '#1e1b4b', bg2: '#312e81', suit: '#232057', lapel: '#141238', tie: '#10b981', tieKnot: '#059669', skin: '#ebb990', hair: '#1c1917', glasses: false, pocketSquare: '#34d399' },
      // 5: Rich Burgundy Suit & Silver Tie with Executive Glasses
      { bg1: '#2e0b16', bg2: '#4a1525', suit: '#3d101e', lapel: '#240811', tie: '#cbd5e1', tieKnot: '#94a3b8', skin: '#f4cbb0', hair: '#44403c', glasses: true, pocketSquare: '#cbd5e1' },
      // 6: Slate Grey Double-Breasted Suit & Violet Purple Tie
      { bg1: '#1e293b', bg2: '#334155', suit: '#273444', lapel: '#18202c', tie: '#8b5cf6', tieKnot: '#7c3aed', skin: '#f0c4a0', hair: '#171717', glasses: false, pocketSquare: '#a78bfa' },
      // 7: Modern Jet Black Suit & Amber Flame Tie
      { bg1: '#0a0a0c', bg2: '#1c1d22', suit: '#121318', lapel: '#070709', tie: '#f59e0b', tieKnot: '#d97706', skin: '#e8b894', hair: '#262626', glasses: false, pocketSquare: '#fbbf24' },
      // 8: Warm Mocha Brown Suit & Cyan Blue Silk Tie with Glasses
      { bg1: '#261914', bg2: '#3d2b22', suit: '#33231c', lapel: '#1f130e', tie: '#06b6d4', tieKnot: '#0891b2', skin: '#f3c7a5', hair: '#1c1917', glasses: true, pocketSquare: '#67e8f9' },
      // 9: Premium Steel Navy Suit & Rose Pink Executive Tie
      { bg1: '#0f172a', bg2: '#1e3a5f', suit: '#162842', lapel: '#0d1829', tie: '#f43f5e', tieKnot: '#e11d48', skin: '#f1c29b', hair: '#334155', glasses: false, pocketSquare: '#fda4af' }
    ];
    const idx = Math.abs(seed) % palettes.length;
    const p = palettes[idx];
    const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 440" width="400" height="440">
      <defs>
        <linearGradient id="execGrad${idx}" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="${p.bg1}"/>
          <stop offset="100%" stop-color="${p.bg2}"/>
        </linearGradient>
      </defs>
      <rect width="400" height="440" fill="url(#execGrad${idx})"/>
      <circle cx="200" cy="200" r="140" fill="#ffffff" opacity="0.05"/>
      <path d="M56 440 C58 332 114 292 200 292 C286 292 342 332 344 440 Z" fill="${p.suit}" stroke="#334155" stroke-width="1.5"/>
      <polygon points="156,292 244,292 222,440 178,440" fill="#ffffff"/>
      <polygon points="191,308 209,308 215,424 200,438 185,424" fill="${p.tie}"/>
      <polygon points="189,294 211,294 207,314 193,314" fill="${p.tieKnot}"/>
      <polygon points="156,292 194,396 150,440 116,330" fill="${p.lapel}"/>
      <polygon points="244,292 206,396 250,440 284,330" fill="${p.lapel}"/>
      ${p.pocketSquare ? `<polygon points="254,374 278,366 272,382 250,382" fill="${p.pocketSquare}"/>` : ''}
      <polygon points="162,286 196,312 174,326 152,298" fill="#f8fafc"/>
      <polygon points="238,286 204,312 226,326 248,298" fill="#f8fafc"/>
      <rect x="176" y="242" width="48" height="60" rx="18" fill="${p.skin}"/>
      <path d="M176 266 Q200 284 224 266 L224 288 L176 288 Z" fill="#d9a782" opacity="0.45"/>
      <circle cx="136" cy="186" r="14" fill="${p.skin}"/>
      <circle cx="264" cy="186" r="14" fill="${p.skin}"/>
      <rect x="142" y="106" width="116" height="152" rx="56" fill="${p.skin}"/>
      <path d="M140 162 C136 112 164 88 202 88 C242 88 266 114 260 162 C252 132 232 120 200 120 C168 120 148 134 140 162 Z" fill="${p.hair}"/>
      <path d="M164 166 Q177 160 188 165" stroke="${p.hair}" stroke-width="4" stroke-linecap="round" fill="none"/>
      <path d="M212 165 Q223 160 236 166" stroke="${p.hair}" stroke-width="4" stroke-linecap="round" fill="none"/>
      <circle cx="176" cy="180" r="5.5" fill="#0f172a"/>
      <circle cx="224" cy="180" r="5.5" fill="#0f172a"/>
      ${p.glasses ? `
        <rect x="158" y="168" width="36" height="24" rx="6" fill="none" stroke="#fbbf24" stroke-width="2.5"/>
        <rect x="206" y="168" width="36" height="24" rx="6" fill="none" stroke="#fbbf24" stroke-width="2.5"/>
        <line x1="194" y1="178" x2="206" y2="178" stroke="#fbbf24" stroke-width="2.5"/>
      ` : ''}
      <path d="M200 182 L196 204 L205 206" stroke="#c9956e" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" fill="none"/>
      <path d="M182 222 Q200 234 218 222" stroke="#b87d56" stroke-width="3.8" stroke-linecap="round" fill="none"/>
      <circle cx="246" cy="354" r="6" fill="#F08D39"/>
    </svg>`;
    return 'data:image/svg+xml;utf8,' + encodeURIComponent(svg);
  }

  const DEFAULT_AVATAR = getRandomExecutiveAvatarSvg(0);

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
    // Tier 1: Red Shield (Dewan Komisaris / Supervisory Board)
    { name: 'Board of Commissioners', category: 'Commissioners', color: '#dc2626', bg: '#fef2f2', border: '#fecaca', icon: 'fa-crown', isHighStaff: true, level: 110 },
    { name: 'President Commissioner', category: 'Commissioners', color: '#dc2626', bg: '#fef2f2', border: '#fecaca', icon: 'fa-crown', isHighStaff: true, level: 105 },
    { name: 'Commissioner', category: 'Commissioners', color: '#dc2626', bg: '#fef2f2', border: '#fecaca', icon: 'fa-shield-halved', isHighStaff: true, level: 100 },

    // Tier 2: Purple / Indigo Shield (Dewan Direksi / Executive Board)
    { name: 'Chief Executive Officer', category: 'Directors', color: '#7c3aed', bg: '#f5f3ff', border: '#ddd6fe', icon: 'fa-shield-halved', isHighStaff: true, level: 90 },
    { name: 'Chief Operating Officer', category: 'Directors', color: '#7c3aed', bg: '#f5f3ff', border: '#ddd6fe', icon: 'fa-user-tie', isHighStaff: true, level: 85 },
    { name: 'Vice President', category: 'Directors', color: '#7c3aed', bg: '#f5f3ff', border: '#ddd6fe', icon: 'fa-user-tie', isHighStaff: true, level: 80 },

    // Tier 3: Blue Shield (Manajemen Operasional / Department Leads)
    { name: 'General Manager', category: 'Management', color: '#2563eb', bg: '#eff6ff', border: '#bfdbfe', icon: 'fa-briefcase', isHighStaff: true, level: 70 },
    { name: 'Executive Producer', category: 'Management', color: '#2563eb', bg: '#eff6ff', border: '#bfdbfe', icon: 'fa-briefcase', isHighStaff: true, level: 65 },
    { name: 'Station Manager', category: 'Management', color: '#2563eb', bg: '#eff6ff', border: '#bfdbfe', icon: 'fa-briefcase', isHighStaff: true, level: 62 },

    // Tier 4: Teal / Dark Green Shield (Tim Supervisor / Production & Editorial Leads)
    { name: 'Managing Editor', category: 'Supervisor', color: '#0d9488', bg: '#f0fdfa', border: '#99f6e4', icon: 'fa-clapperboard', isHighStaff: false, level: 60 },
    { name: 'Chief Editor', category: 'Supervisor', color: '#0d9488', bg: '#f0fdfa', border: '#99f6e4', icon: 'fa-clapperboard', isHighStaff: false, level: 55 },
    { name: 'Senior Producer', category: 'Supervisor', color: '#0d9488', bg: '#f0fdfa', border: '#99f6e4', icon: 'fa-clapperboard', isHighStaff: false, level: 50 },
    { name: 'Line Producer', category: 'Supervisor', color: '#0d9488', bg: '#f0fdfa', border: '#99f6e4', icon: 'fa-clapperboard', isHighStaff: false, level: 45 },
    { name: 'Head Reporter', category: 'Supervisor', color: '#0d9488', bg: '#f0fdfa', border: '#99f6e4', icon: 'fa-bullhorn', isHighStaff: false, level: 40 },
    { name: 'Senior Editor', category: 'Supervisor', color: '#0d9488', bg: '#f0fdfa', border: '#99f6e4', icon: 'fa-clapperboard', isHighStaff: false, level: 38 },
    { name: 'Editor', category: 'Supervisor', color: '#0d9488', bg: '#f0fdfa', border: '#99f6e4', icon: 'fa-clapperboard', isHighStaff: false, level: 35 },

    // Tier 5: Green Shield (Staf Redaksi & Jurnalis Lapangan)
    { name: 'Senior News Anchor', category: 'Operational', color: '#0284c7', bg: '#f0f9ff', border: '#bae6fd', icon: 'fa-tv', isHighStaff: false, level: 32 },
    { name: 'Senior Reporter', category: 'Operational', color: '#16a34a', bg: '#f0fdf4', border: '#bbf7d0', icon: 'fa-microphone', isHighStaff: false, level: 30 },
    { name: 'FoxSA News Journalist & Field Reporter', category: 'Operational', color: '#16a34a', bg: '#f0fdf4', border: '#bbf7d0', icon: 'fa-microphone', isHighStaff: false, level: 28 },
    { name: 'Investigative Reporter', category: 'Operational', color: '#dc2626', bg: '#fef2f2', border: '#fecaca', icon: 'fa-user-secret', isHighStaff: false, level: 25 },
    { name: 'Photojournalist & Visual Media', category: 'Operational', color: '#8b5cf6', bg: '#f5f3ff', border: '#ddd6fe', icon: 'fa-camera', isHighStaff: false, level: 22 },
    { name: 'Staff Reporter', category: 'Operational', color: '#16a34a', bg: '#f0fdf4', border: '#bbf7d0', icon: 'fa-pen-nib', isHighStaff: false, level: 20 },
    { name: 'Junior Reporter', category: 'Operational', color: '#22c55e', bg: '#f0fdf4', border: '#bbf7d0', icon: 'fa-pen-fancy', isHighStaff: false, level: 10 },
    { name: 'Journalism Intern', category: 'Operational', color: '#10b981', bg: '#ecfdf5', border: '#a7f3d0', icon: 'fa-graduation-cap', isHighStaff: false, level: 5 }
  ];

  function getRoleInfo(roleName) {
    if (!roleName) return OFFICIAL_ROLES[OFFICIAL_ROLES.length - 2];
    const clean = String(roleName).trim().toLowerCase();
    const found = OFFICIAL_ROLES.find(r => r.name.toLowerCase() === clean);
    if (found) return found;
    const partial = OFFICIAL_ROLES.find(r => clean.includes(r.name.toLowerCase()) || r.name.toLowerCase().includes(clean));
    if (partial) return partial;
    return {
      name: roleName,
      category: 'Operational',
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
    if (user.isAdmin || user.is_admin) return true;
    const u = String(user.username || '').toLowerCase();
    if (['admin', 'arthur', 'rein', 'reinhardt', 'rei'].includes(u)) return true;
    const rInfo = getRoleInfo(user.role);
    return !!rInfo.isHighStaff;
  }

  function renderRoleOptionsHtml(selectedRole, options = {}) {
    const selClean = String(selectedRole || '').trim().toLowerCase();
    const categories = ['Commissioners', 'Directors', 'Management', 'Supervisor', 'Operational'];
    const catLabels = {
      'Commissioners': '🏛️ Dewan Komisaris (Supervisory Board)',
      'Directors': '👑 Dewan Direksi (Executive Board)',
      'Management': '💼 Manajemen Operasional',
      'Supervisor': '🎬 Tim Supervisor (Redaksi & Produksi)',
      'Operational': '🎙️ Staf Redaksi & Jurnalis Lapangan'
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
              ${renderRoleOptionsHtml(currentRole)}
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
      avatar: 'https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEjczAy7LhtUkBsZZzOW5IrPDtx0XsQ_HvUTdjCTdK1uggIg9itmaLx523OOTEdiEAjEoZtHZBmGFl08XshLL-07nbD7NpkwLEEiV3OsyaXUeeKVfTNpotuo32uOi9v6kDXSQRPWseWo0xDNkJAdfVD2YWTupqmUK5mplTs1vBbL_bRBag/s200/pexels-photo-5717546.jpeg'
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

    if (!Array.isArray(cloned.staffAccounts)) {
      cloned.staffAccounts = [];
    }
    cloned.staffAccounts = cloned.staffAccounts.filter(acc =>
      !String(acc.username || '').toLowerCase().includes('ligma') &&
      !String(acc.displayName || '').toLowerCase().includes('ligma')
    );
    // Guarantee that all official baseline roster accounts exist with approved status
    DEFAULT_STAFF_ACCOUNTS.forEach(defAcc => {
      const idx = cloned.staffAccounts.findIndex(
        a => String(a.username || '').toLowerCase().trim() === defAcc.username.toLowerCase()
      );
      if (idx === -1) {
        cloned.staffAccounts.push(JSON.parse(JSON.stringify(defAcc)));
      } else {
        const acc = cloned.staffAccounts[idx];
        if (!acc.status) acc.status = 'approved';
        if (defAcc.isAdmin && !acc.isAdmin) acc.isAdmin = true;
        if (!acc.role) acc.role = defAcc.role;
        if (!acc.password) acc.password = defAcc.password;
        if (!acc.displayName) acc.displayName = defAcc.displayName;
        if (!acc.authorName) acc.authorName = defAcc.authorName;
      }
    });
    delete cloned.profileFeedback;

    // Initialize Admin Chats if not present
    if (!Array.isArray(cloned.adminChats) || cloned.adminChats.length === 0) {
      cloned.adminChats = [
        {
          id: 'chat_seed_1',
          senderUsername: 'arthur',
          senderName: 'Arthur Redfields',
          senderRole: 'Chief Executive Officer',
          senderAvatar: 'https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEijelpjGHfXOoTKfqD1mokSIESF0WySrKkFx3EV9rhrMxaQHJmPSkWe7Lj9QbiFJQbVx7z2os7vSHs3TVJFg1nzGX2MTzdqBO1eO-gppMt99EfwrEBOG9BqW1ZrbkNcNNqd-k9pS8vHOItd_EF7yVe_MfaTvhN2EvXpcWmK7ZDpX94RY14/s200/In%20Edward%20Snowden%E2%80%99s%20New%20Memoir,%20the%20Disclosures%20This%20Time%20Are%20Personal%20(Published%202019).jpg',
          message: 'Selamat bertugas kepada seluruh jajaran redaksi FoxSA News! Gunakan saluran chat ini untuk koordinasi penugasan berita harian dan liputan peristiwa aktual di San Andreas.',
          timestamp: new Date(Date.now() - 3600000 * 6).toISOString()
        },
        {
          id: 'chat_seed_2',
          senderUsername: 'reinhardt',
          senderName: 'Reinhardt Harrison',
          senderRole: 'Commissioner',
          senderAvatar: getCommissionerAvatarSvg(),
          message: 'Selalu jaga independensi media, verifikasi keakuratan fakta di lapangan, dan junjung tinggi kode etik jurnalistik.',
          timestamp: new Date(Date.now() - 3600000 * 3).toISOString()
        },
        {
          id: 'chat_seed_3',
          senderUsername: 'steven',
          senderName: 'Steven Deluca',
          senderRole: 'Journalism Intern',
          senderAvatar: getRandomExecutiveAvatarSvg(3),
          message: 'Siap Pak! Informasi pemantauan wilayah dan situasi terkini di Los Santos sedang kami himpun.',
          timestamp: new Date(Date.now() - 3600000 * 1).toISOString()
        }
      ];
    }

    // Initialize Former Staff if not present
    if (!Array.isArray(cloned.formerStaff) || cloned.formerStaff.length === 0) {
      cloned.formerStaff = JSON.parse(JSON.stringify(FOXSA_FORMER_STAFF));
    }

    // Clear out any old Blogger grey silhouettes from localStorage cache
    if (cloned.authors) {
      Object.keys(cloned.authors).forEach(k => {
        if (cloned.authors[k] && cloned.authors[k].avatar && cloned.authors[k].avatar.includes('VuOLn-mL7PI')) {
          delete cloned.authors[k].avatar;
        }
      });
    }
    cloned.staffAccounts.forEach(acc => {
      if (!acc.status) acc.status = 'approved';
      if (acc.avatar && acc.avatar.includes('VuOLn-mL7PI')) {
        acc.avatar = '';
      }
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
        const cleanSavedUser = String(parsed.username).toLowerCase().trim().replace(/^@+/, '');
        const matched = (state.data.staffAccounts || []).find(
          a => String(a.username || '').toLowerCase().trim() === cleanSavedUser
        );
        // Only keep session if account is approved and not former
        if (matched && matched.status === 'approved' && !matched.isFormer) {
          state.currentUser = matched;
        } else if (state.data.staffAccounts && state.data.staffAccounts.length > 0) {
          state.currentUser = null;
          localStorage.removeItem(AUTH_SESSION_KEY);
        }
      }
    } catch (e) {
      state.currentUser = null;
    }
    updateHeaderStaffBadge();
  }

  const DEFAULT_CREDENTIALS = {
    'admin': ['foxsa2026', 'admin', 'foxsa', 'admin123'],
    'arthur': ['arthurfoxsa', 'arthur', 'foxsa2026', 'foxsa'],
    'reinhardt': ['reinhardt2026', 'reinhardt', 'foxsa2026', 'foxsa'],
    'park': ['parkyounghwan', 'park', 'foxsa2026', 'foxsa'],
    'steven': ['stevendeluca', 'steven', 'foxsa2026', 'foxsa']
  };

  async function loginStaff(username, password) {
    const cleanUser = String(username || '').trim().toLowerCase().replace(/^@+/, '');
    const rawPass = String(password || '');
    const cleanPass = rawPass.trim();

    if (!cleanUser || !cleanPass) {
      return { success: false, reason: 'empty_credentials' };
    }

    let account = (state.data.staffAccounts || []).find(a => {
      const accUser = String(a.username || '').toLowerCase().trim();
      const accDisplay = String(a.displayName || '').toLowerCase().trim();
      const accAuthor = String(a.authorName || '').toLowerCase().trim();
      const userMatches = (accUser === cleanUser) ||
                          (accDisplay === cleanUser) ||
                          (accAuthor === cleanUser) ||
                          (cleanUser.length >= 3 && (accUser.includes(cleanUser) || cleanUser.includes(accUser) || accDisplay.includes(cleanUser)));
      if (!userMatches) return false;

      const accPass = String(a.password || '');
      const allowedPasses = DEFAULT_CREDENTIALS[accUser] || [];
      const passMatches = (accPass === rawPass) ||
                          (accPass.trim() === cleanPass) ||
                          allowedPasses.includes(cleanPass) ||
                          allowedPasses.includes(rawPass);
      return passMatches;
    });

    // Jika tidak ditemukan di memori browser lokal, query langsung ke database Supabase
    if (!account) {
      const sb = getSupabaseClient();
      if (sb) {
        try {
          const { data: cloudAccounts, error } = await sb
            .from('foxsa_staff_accounts')
            .select('*');

          if (!error && Array.isArray(cloudAccounts)) {
            const foundCloud = cloudAccounts.find(ca => {
              const u = String(ca.username || '').toLowerCase().trim();
              const d = String(ca.display_name || '').toLowerCase().trim();
              const a = String(ca.author_name || '').toLowerCase().trim();
              const uMatch = (u === cleanUser) ||
                             (d === cleanUser) ||
                             (a === cleanUser) ||
                             (cleanUser.length >= 3 && (u.includes(cleanUser) || cleanUser.includes(u) || d.includes(cleanUser)));
              if (!uMatch) return false;

              const accPass = String(ca.password || '');
              const allowedPasses = DEFAULT_CREDENTIALS[u] || [];
              return (accPass === rawPass) ||
                     (accPass.trim() === cleanPass) ||
                     allowedPasses.includes(cleanPass) ||
                     allowedPasses.includes(rawPass);
            });

            if (foundCloud) {
              account = {
                username: foundCloud.username,
                password: foundCloud.password,
                displayName: foundCloud.display_name,
                authorName: foundCloud.author_name || foundCloud.display_name,
                role: foundCloud.role,
                status: foundCloud.status || 'approved',
                isAdmin: Boolean(foundCloud.is_admin),
                isFormer: Boolean(foundCloud.is_former),
                avatar: foundCloud.avatar || DEFAULT_AVATAR,
                quote: foundCloud.quote || '',
                bio: foundCloud.bio || ''
              };
              const exIdx = (state.data.staffAccounts || []).findIndex(a => a.username.toLowerCase() === account.username.toLowerCase());
              if (exIdx >= 0) {
                state.data.staffAccounts[exIdx] = account;
              } else {
                state.data.staffAccounts.push(account);
              }
              saveDataToLocal(false);
            }
          }
        } catch (e) {
          console.warn('Supabase login lookup error:', e);
        }
      }
    }

    if (!account) return { success: false, reason: 'invalid_credentials' };
    if (account.status === 'pending') {
      return { success: false, reason: 'pending_approval', account };
    }
    if (account.status === 'rejected') {
      return { success: false, reason: 'rejected_approval', account };
    }

    state.currentUser = account;
    try {
      localStorage.setItem(AUTH_SESSION_KEY, JSON.stringify({
        username: account.username,
        loginAt: new Date().toISOString()
      }));
    } catch (e) {
      console.warn('Storage warning:', e);
    }
    updateHeaderStaffBadge();
    return { success: true, account };
  }

  function logoutStaff() {
    state.currentUser = null;
    state.editingPostId = null;
    localStorage.removeItem(AUTH_SESSION_KEY);
    updateHeaderStaffBadge();
    showToast('Anda telah keluar dari sesi Staff FoxSA.');
    if (window.location.hash !== '#/login') {
      window.location.hash = '#/login';
    } else {
      renderStaffLoginView('login');
    }
  }

  function updateHeaderStaffBadge() {
    const staffBtn = document.getElementById('header-staff-btn');
    const footerStaffLink = document.getElementById('footer-staff-link');
    if (staffBtn) {
      const labelSpan = staffBtn.querySelector('.staff-btn-label');
      if (state.currentUser) {
        staffBtn.style.display = 'inline-flex';
        staffBtn.href = 'admin.html';
        if (labelSpan) labelSpan.textContent = `Panel (${state.currentUser.displayName.split(' ')[0]})`;
        staffBtn.classList.add('is-logged-in');
        staffBtn.title = `Login sebagai ${state.currentUser.displayName} (${state.currentUser.role})`;
      } else {
        // Disembunyikan dari pembaca umum saat belum login
        staffBtn.style.display = 'none';
        staffBtn.classList.remove('is-logged-in');
        staffBtn.title = 'Login khusus Redaksi & Staff FoxSA';
        staffBtn.href = 'login.html';
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

  // =========================================================================
  // SUPABASE CLOUD DATABASE INTEGRATION (REALTIME & MULTI-DEVICE SYNC)
  // =========================================================================
  const SUPABASE_CONFIG_KEY = 'foxsa_supabase_config_v2';
  let _supabaseClientInstance = null;
  let _supabaseRealtimeSubscribed = false;

  function getSupabaseConfig() {
    try {
      const raw = localStorage.getItem(SUPABASE_CONFIG_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (parsed && parsed.url && parsed.anonKey) {
          return { url: parsed.url.trim(), anonKey: parsed.anonKey.trim(), enabled: true };
        }
      }
    } catch (e) {}

    if (window.FOXSA_SUPABASE_CONFIG && window.FOXSA_SUPABASE_CONFIG.url && window.FOXSA_SUPABASE_CONFIG.anonKey) {
      return {
        url: window.FOXSA_SUPABASE_CONFIG.url.trim(),
        anonKey: window.FOXSA_SUPABASE_CONFIG.anonKey.trim(),
        enabled: true
      };
    }

    return { url: '', anonKey: '', enabled: false };
  }

  function saveSupabaseConfig(cfg) {
    try {
      localStorage.setItem(SUPABASE_CONFIG_KEY, JSON.stringify(cfg));
      _supabaseClientInstance = null;
      _supabaseRealtimeSubscribed = false;
    } catch (e) {}
  }

  function getSupabaseClient() {
    if (_supabaseClientInstance) return _supabaseClientInstance;
    if (typeof window.supabase === 'undefined' || typeof window.supabase.createClient !== 'function') {
      return null;
    }
    const cfg = getSupabaseConfig();
    if (!cfg || !cfg.enabled || !cfg.url || !cfg.anonKey) {
      return null;
    }
    try {
      _supabaseClientInstance = window.supabase.createClient(cfg.url, cfg.anonKey);
      return _supabaseClientInstance;
    } catch (e) {
      console.warn('Gagal membuat Supabase client:', e);
      return null;
    }
  }

  async function syncFromSupabase(forceRerender = false) {
    const sb = getSupabaseClient();
    if (!sb) return false;

    let hasChanges = false;
    try {
      // 0. Ambil Berita & Artikel dari Supabase Cloud (foxsa_posts)
      const { data: dbPosts, error: postErr } = await sb
        .from('foxsa_posts')
        .select('*')
        .order('published', { ascending: false });

      if (!postErr && Array.isArray(dbPosts)) {
        if (dbPosts.length > 0) {
          state.data.posts = dbPosts.map(p => ({
            id: p.id,
            slug: p.slug,
            title: p.title,
            published: p.published,
            updated: p.updated,
            author: p.author,
            authorAvatar: p.author_avatar,
            authorBio: p.author_bio,
            labels: Array.isArray(p.labels) ? p.labels : [],
            featuredImage: p.featured_image,
            snippet: p.snippet,
            content: p.content,
            originalUrl: p.original_url,
            popular: Boolean(p.popular),
            comments: Array.isArray(p.comments) ? p.comments : []
          }));
          hasChanges = true;
        } else {
          await seedInitialPostsToSupabase(sb);
        }
      }

      // 1. Ambil Akun Staff & Jurnalis
      const { data: accounts, error: accErr } = await sb
        .from('foxsa_staff_accounts')
        .select('*');

      if (!accErr && Array.isArray(accounts)) {
        if (accounts.length > 0) {
          state.data.staffAccounts = accounts.map(a => ({
            username: a.username,
            password: a.password,
            displayName: a.display_name,
            authorName: a.author_name || a.display_name,
            role: a.role,
            status: a.status || 'approved',
            isAdmin: Boolean(a.is_admin),
            isFormer: Boolean(a.is_former),
            avatar: a.avatar || DEFAULT_AVATAR,
            quote: a.quote || '',
            bio: a.bio || ''
          }));
          hasChanges = true;
        } else {
          await seedInitialAccountsToSupabase(sb);
        }
      }

      // 2. Ambil Mantan Staf (Former Staff)
      const { data: former, error: fErr } = await sb
        .from('foxsa_former_staff')
        .select('*');

      if (!fErr && Array.isArray(former)) {
        if (former.length > 0) {
          state.data.formerStaff = former.map(f => ({
            id: f.id,
            name: f.name,
            formerRole: f.former_role,
            category: f.category,
            badge: f.badge,
            period: f.period,
            avatar: f.avatar,
            bio: f.bio,
            legacy: f.legacy
          }));
          hasChanges = true;
        } else {
          await seedInitialFormerStaffToSupabase(sb);
        }
      }

      // 3. Ambil Pesan Chat Redaksi
      const { data: chats, error: cErr } = await sb
        .from('foxsa_admin_chats')
        .select('*')
        .order('created_at', { ascending: true });

      if (!cErr && Array.isArray(chats)) {
        state.data.adminChats = chats.map(c => ({
          id: c.id,
          senderUsername: c.sender_username,
          senderName: c.sender_name,
          senderRole: c.sender_role,
          senderAvatar: c.sender_avatar,
          message: c.message,
          timestamp: c.created_at
        }));
        hasChanges = true;
      }

      if (hasChanges) {
        saveDataToLocal(false);
        loadAuthSession();
        if (forceRerender) {
          renderAll();
        }
      }
      return true;
    } catch (err) {
      console.warn('Sync dari Supabase terganggu:', err);
      return false;
    }
  }

  async function seedInitialPostsToSupabase(sb) {
    try {
      const postsToSeed = (window.FOXSA_INITIAL_DATA && Array.isArray(window.FOXSA_INITIAL_DATA.posts) && window.FOXSA_INITIAL_DATA.posts.length > 0)
        ? window.FOXSA_INITIAL_DATA.posts
        : (state.data && Array.isArray(state.data.posts) ? state.data.posts : []);
      if (!postsToSeed || !postsToSeed.length) return;
      const records = postsToSeed.map(p => ({
        id: String(p.id),
        slug: p.slug || 'post-' + p.id,
        title: p.title || '',
        published: p.published || new Date().toISOString(),
        updated: p.updated || new Date().toISOString(),
        author: p.author || 'Redaksi FoxSA News',
        author_avatar: p.authorAvatar || '',
        author_bio: p.authorBio || '',
        labels: p.labels || [],
        featured_image: p.featuredImage || '',
        snippet: p.snippet || '',
        content: p.content || '',
        original_url: p.originalUrl || '',
        popular: Boolean(p.popular),
        comments: p.comments || []
      }));
      await sb.from('foxsa_posts').upsert(records, { onConflict: 'id' });
    } catch (e) {
      console.warn('Gagal seed berita ke Supabase:', e);
    }
  }

  async function syncPostCommentsToSupabase(post) {
    const sb = getSupabaseClient();
    if (!sb || !post || !post.id) return;
    try {
      await sb
        .from('foxsa_posts')
        .update({ comments: post.comments || [] })
        .eq('id', post.id);
    } catch (e) {
      console.warn('Gagal sync komentar berita ke Supabase:', e);
    }
  }

  async function seedInitialAccountsToSupabase(sb) {
    try {
      const records = (state.data.staffAccounts || DEFAULT_STAFF_ACCOUNTS).map(a => ({
        username: a.username,
        password: a.password,
        display_name: a.displayName,
        author_name: a.authorName || a.displayName,
        role: a.role,
        status: a.status || 'approved',
        is_admin: Boolean(a.isAdmin),
        is_former: Boolean(a.isFormer),
        avatar: a.avatar || '',
        quote: a.quote || '',
        bio: a.bio || ''
      }));
      await sb.from('foxsa_staff_accounts').upsert(records, { onConflict: 'username' });
    } catch (e) {
      console.warn('Gagal seed akun ke Supabase:', e);
    }
  }

  async function seedInitialFormerStaffToSupabase(sb) {
    try {
      const records = (state.data.formerStaff || FOXSA_FORMER_STAFF).map(f => ({
        id: f.id,
        name: f.name,
        former_role: f.formerRole,
        category: f.category,
        badge: f.badge,
        period: f.period,
        avatar: f.avatar,
        bio: f.bio,
        legacy: f.legacy
      }));
      await sb.from('foxsa_former_staff').upsert(records, { onConflict: 'id' });
    } catch (e) {
      console.warn('Gagal seed former staff ke Supabase:', e);
    }
  }

  async function syncStaffAccountToSupabase(acc) {
    const sb = getSupabaseClient();
    if (!sb || !acc) return;
    try {
      await sb.from('foxsa_staff_accounts').upsert([{
        username: acc.username,
        password: acc.password,
        display_name: acc.displayName,
        author_name: acc.authorName || acc.displayName,
        role: acc.role,
        status: acc.status || 'approved',
        is_admin: Boolean(acc.isAdmin),
        is_former: Boolean(acc.isFormer),
        avatar: acc.avatar || '',
        quote: acc.quote || '',
        bio: acc.bio || ''
      }], { onConflict: 'username' });
    } catch (e) {
      console.warn('Gagal sync akun ke Supabase:', e);
    }
  }

  async function deleteStaffAccountFromSupabase(username) {
    const sb = getSupabaseClient();
    if (!sb || !username) return;
    try {
      await sb.from('foxsa_staff_accounts').delete().eq('username', username);
    } catch (e) {
      console.warn('Gagal hapus akun di Supabase:', e);
    }
  }

  async function syncFormerStaffToSupabase(former) {
    const sb = getSupabaseClient();
    if (!sb || !former) return;
    try {
      await sb.from('foxsa_former_staff').upsert([{
        id: former.id,
        name: former.name,
        former_role: former.formerRole,
        category: former.category,
        badge: former.badge,
        period: former.period,
        avatar: former.avatar,
        bio: former.bio || '',
        legacy: former.legacy || ''
      }], { onConflict: 'id' });
    } catch (e) {
      console.warn('Gagal sync mantan staf ke Supabase:', e);
    }
  }

  async function deleteFormerStaffFromSupabase(id) {
    const sb = getSupabaseClient();
    if (!sb || !id) return;
    try {
      await sb.from('foxsa_former_staff').delete().eq('id', id);
    } catch (e) {
      console.warn('Gagal hapus mantan staf di Supabase:', e);
    }
  }

  async function syncAdminChatToSupabase(chat) {
    const sb = getSupabaseClient();
    if (!sb || !chat) return;
    try {
      await sb.from('foxsa_admin_chats').upsert([{
        id: chat.id,
        sender_username: chat.senderUsername,
        sender_name: chat.senderName,
        sender_role: chat.senderRole,
        sender_avatar: chat.senderAvatar,
        message: chat.message,
        created_at: chat.timestamp || new Date().toISOString()
      }], { onConflict: 'id' });
    } catch (e) {
      console.warn('Gagal sync chat ke Supabase:', e);
    }
  }

  async function deleteAdminChatFromSupabase(id) {
    const sb = getSupabaseClient();
    if (!sb || !id) return;
    try {
      await sb.from('foxsa_admin_chats').delete().eq('id', id);
    } catch (e) {
      console.warn('Gagal hapus chat di Supabase:', e);
    }
  }

  function initSupabaseRealtime() {
    if (_supabaseRealtimeSubscribed) return;
    const sb = getSupabaseClient();
    if (!sb) return;

    try {
      sb.channel('foxsa-realtime-sync')
        .on('postgres_changes', { event: '*', schema: 'public', table: 'foxsa_posts' }, async () => {
          await syncFromSupabase(true);
        })
        .on('postgres_changes', { event: '*', schema: 'public', table: 'foxsa_admin_chats' }, async () => {
          await syncFromSupabase(false);
          if (state.currentRoute.view === 'admin' && state.adminTab === 'chat') {
            renderAdminView();
          }
        })
        .on('postgres_changes', { event: '*', schema: 'public', table: 'foxsa_staff_accounts' }, async () => {
          await syncFromSupabase(false);
          if (state.currentRoute.view === 'admin' && (state.adminTab === 'staff' || state.adminTab === 'profile')) {
            renderAdminView();
          } else if (state.currentRoute.view === 'profile') {
            renderCompanyProfileView();
          }
        })
        .on('postgres_changes', { event: '*', schema: 'public', table: 'foxsa_former_staff' }, async () => {
          await syncFromSupabase(false);
          if (state.currentRoute.view === 'profile' && state.currentRoute.param === 'former-staff') {
            renderCompanyProfileView();
          }
        })
        .subscribe((status) => {
          if (status === 'SUBSCRIBED') {
            _supabaseRealtimeSubscribed = true;
          }
        });
    } catch (e) {
      console.warn('Gagal subscribe Realtime Supabase:', e);
    }
  }

  async function initSupabaseCloud() {
    const sb = getSupabaseClient();
    if (sb) {
      await syncFromSupabase(true);
      initSupabaseRealtime();
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
    if (window.location.search) {
      try {
        history.replaceState(null, '', window.location.pathname + (window.location.hash || '#/'));
      } catch (e) {}
    }
    const rawHash = window.location.hash || '#/';
    const clean = rawHash.replace(/^#\/?/, '');
    if (!clean) {
      return { view: 'home', param: null };
    }
    const parts = clean.split('/');
    const action = parts[0];
    const param = decodeURIComponent(parts.slice(1).join('/'));

    if (action === 'profile') {
      let sub = (param || 'overview').toLowerCase().trim();
      if (sub === 'roadmap') sub = 'overview';
      return { view: 'profile', param: sub };
    }
    if (action === 'post' && param) {
      // Redirect legacy removed non-news post IDs/slugs to dedicated Company Profile tabs
      if (param === '2526320561083681754' || param === 'overview-foxsa-news') {
        return { view: 'profile', param: 'overview' };
      }
      if (param === '3689427128628530545' || param === 'rencana-pengembangan-pembaruan-foxsa') {
        return { view: 'profile', param: 'overview' };
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
    if (action === 'admin') {
      window.location.href = 'admin.html' + (param ? '#/' + param : '');
      return { view: 'home', param: null };
    }
    if (action === 'login') {
      window.location.href = 'login.html';
      return { view: 'home', param: null };
    }
    if (action === 'register') {
      window.location.href = 'login.html?tab=register';
      return { view: 'home', param: null };
    }
    if (action === 'staff') {
      window.location.href = 'admin.html#/staff';
      return { view: 'home', param: null };
    }
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
        syncPostCommentsToSupabase(post);
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
          syncPostCommentsToSupabase(post);
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

    let currentRegAvatar = getRandomExecutiveAvatarSvg(Math.floor(Math.random() * 10));

    // Detect if register is requested via route or parameter
    let currentTab = 'login';
    if (initialTab === 'register') {
      currentTab = 'register';
    } else if (initialTab === 'login') {
      currentTab = 'login';
    } else if (state.currentRoute && (state.currentRoute.param === 'register' || state.currentRoute.view === 'register')) {
      currentTab = 'register';
    }

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
            <!-- Random Avatar Picker for Registration -->
            <div class="foxsa-reg-avatar-card" style="display:flex;align-items:center;gap:14px;background:#f8fafc;border:1px solid #e2e8f0;border-radius:12px;padding:12px 14px;margin-bottom:16px;">
              <img id="reg-avatar-preview" src="${currentRegAvatar}" alt="Foto Profil" style="width:58px;height:58px;border-radius:50%;object-fit:cover;border:2px solid #F08D39;box-shadow:0 2px 8px rgba(0,0,0,0.08);background:#fff;" />
              <div style="flex:1;">
                <div style="font-weight:600;font-size:12.5px;color:#0f172a;margin-bottom:2px;">Foto Profil Jurnalis (Default Executive)</div>
                <div style="font-size:11.5px;color:#64748b;margin-bottom:6px;">Karakter eksekutif acak disiapkan otomatis untuk akun Anda.</div>
                <button type="button" class="foxsa-editor-btn" id="reg-btn-random-avatar" style="font-size:11.5px;padding:4px 10px;color:#ea580c;border-color:#fdba74;background:#fff;">
                  <i class="fa-solid fa-dice"></i> Acak Foto Karakter
                </button>
              </div>
            </div>

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
                ${renderRoleOptionsHtml('Junior Reporter')}
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
        if (window.location.hash.includes('register')) {
          history.replaceState(null, '', '#/login');
        }
      });
      tabBtnRegister.addEventListener('click', () => {
        tabBtnRegister.classList.add('active');
        tabBtnLogin.classList.remove('active');
        panelRegister.style.display = 'block';
        panelLogin.style.display = 'none';
        if (!window.location.hash.includes('register')) {
          history.replaceState(null, '', '#/register');
        }
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
    const regDiceBtn = document.getElementById('reg-btn-random-avatar');
    if (regDiceBtn) {
      regDiceBtn.addEventListener('click', () => {
        currentRegAvatar = getRandomExecutiveAvatarSvg(Math.floor(Math.random() * 10));
        const pImg = document.getElementById('reg-avatar-preview');
        if (pImg) pImg.src = currentRegAvatar;
        showToast('Karakter foto profil diacak!');
      });
    }
    if (regToggleBtn && regPassInp) {
      regToggleBtn.addEventListener('click', () => {
        const isPwd = regPassInp.type === 'password';
        regPassInp.type = isPwd ? 'text' : 'password';
        regToggleBtn.innerHTML = isPwd ? '<i class="fa-regular fa-eye-slash"></i>' : '<i class="fa-regular fa-eye"></i>';
      });
    }

    // Handle Login Elements & Listeners
    const loginForm = document.getElementById('foxsa-staff-login-form');
    const loginUserInp = document.getElementById('login-username');
    const loginErrBox = document.getElementById('login-error-msg');

    if (loginUserInp) {
      loginUserInp.addEventListener('input', () => {
        if (loginErrBox) loginErrBox.style.display = 'none';
      });
    }
    if (passInp) {
      passInp.addEventListener('input', () => {
        if (loginErrBox) loginErrBox.style.display = 'none';
      });
    }

    if (loginForm) {
      loginForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const userVal = loginUserInp ? loginUserInp.value.trim() : '';
        const passVal = passInp ? passInp.value.trim() : '';
        const submitBtn = loginForm.querySelector('button[type="submit"]');
        if (submitBtn) {
          submitBtn.disabled = true;
          submitBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Memeriksa Akun...';
        }
        const res = await loginStaff(userVal, passVal);
        if (submitBtn) {
          submitBtn.disabled = false;
          submitBtn.innerHTML = '<i class="fa-solid fa-right-to-bracket"></i> Masuk ke Panel Redaksi';
        }
        if (res && res.success) {
          showToast(`Selamat datang, ${state.currentUser.displayName}!`);
          state.adminTab = 'posts';
          window.location.hash = '#/admin';
          renderAdminView();
          window.scrollTo({ top: 0, behavior: 'smooth' });
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
                  Akun <code>@${escapeHtml(userVal)}</code> sedang menunggu persetujuan (ACC) dari High Staff FoxSA News Agency sebelum dapat login.
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
            loginErrBox.innerHTML = '<i class="fa-solid fa-triangle-exclamation"></i> Username atau Password salah! Gunakan akun arthur (pass: arthurfoxsa atau arthur) atau admin (pass: foxsa2026 atau admin).';
          }
          if (passInp) {
            passInp.value = '';
            passInp.focus();
          }
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
          avatar: currentRegAvatar || getRandomExecutiveAvatarSvg(Math.floor(Math.random() * 10))
        };

        state.data.staffAccounts.push(newAccount);
        saveDataToLocal(true);
        syncStaffAccountToSupabase(newAccount);

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

    if (state.currentRoute && state.currentRoute.param && ['posts', 'editor', 'comments', 'chat', 'profile', 'staff'].includes(state.currentRoute.param)) {
      state.adminTab = state.currentRoute.param;
    } else if (!state.adminTab) {
      state.adminTab = 'posts';
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

    // TAB: CHAT REDAKSI (INTERNAL NEWSROOM CHAT)
    else if (state.adminTab === 'chat') {
      const chatMessages = state.data.adminChats || [];
      const activeStaffList = (state.data.staffAccounts || []).filter(a => a.status === 'approved' && !a.isFormer);

      tabContentHtml = `
        <div class="foxsa-admin-chat-wrap">
          <div class="foxsa-chat-header-bar">
            <div class="foxsa-chat-title-group">
              <h4><i class="fa-solid fa-satellite-dish" style="color:#F08D39;"></i> Ruang Koordinasi Redaksi FoxSA News</h4>
              <p>Saluran komunikasi internal real-time untuk jurnalis, editor, dan pimpinan dalam koordinasi liputan 24/7 di San Andreas.</p>
            </div>
            <div class="foxsa-chat-online-pill">
              <span class="online-indicator-dot"></span>
              <span>${activeStaffList.length} Staf Terhubung</span>
            </div>
          </div>

          <!-- Active Staff Chips -->
          <div class="foxsa-chat-staff-chips">
            ${activeStaffList.map(s => `
              <span class="chat-staff-chip" title="${escapeHtml(s.role)}">
                <img src="${escapeHtml(s.avatar || DEFAULT_AVATAR)}" onerror="this.src='${DEFAULT_AVATAR}'" />
                <span>${escapeHtml(s.displayName)}</span>
              </span>
            `).join('')}
          </div>

          <div class="foxsa-chat-messages-container" id="foxsa-chat-messages-container">
            ${chatMessages.length === 0 ? `
              <div class="foxsa-chat-empty">
                <i class="fa-regular fa-comments" style="font-size:32px;color:#cbd5e1;margin-bottom:8px;"></i>
                <p>Belum ada pesan koordinasi. Kirim pesan pertama untuk memulai obrolan redaksi!</p>
              </div>
            ` : chatMessages.map(msg => {
              const isSelf = (state.currentUser && state.currentUser.username === msg.senderUsername);
              const canDelete = isSelf || isUserHighStaff;
              const avatarSrc = msg.senderAvatar || DEFAULT_AVATAR;
              return `
                <div class="foxsa-chat-msg-row ${isSelf ? 'msg-self' : ''}" id="chat-msg-${escapeHtml(msg.id)}">
                  <img src="${escapeHtml(avatarSrc)}" class="foxsa-chat-avatar" alt="${escapeHtml(msg.senderName)}" onerror="this.src='${DEFAULT_AVATAR}'" />
                  <div class="foxsa-chat-bubble-wrap">
                    <div class="foxsa-chat-meta">
                      <span class="foxsa-chat-sender-name">${escapeHtml(msg.senderName)}</span>
                      ${renderRoleBadgeHtml(msg.senderRole)}
                      <span class="foxsa-chat-time"><i class="fa-regular fa-clock"></i> ${formatChatTime(msg.timestamp)}</span>
                      ${canDelete ? `
                        <button type="button" class="foxsa-chat-del-btn" data-delete-chat="${escapeHtml(msg.id)}" title="Hapus Pesan">
                          <i class="fa-regular fa-trash-can"></i>
                        </button>
                      ` : ''}
                    </div>
                    <div class="foxsa-chat-bubble">
                      ${escapeHtml(msg.message).replace(/\n/g, '<br/>')}
                    </div>
                  </div>
                </div>
              `;
            }).join('')}
          </div>

          <!-- Quick Tag Helper Bar -->
          <div class="foxsa-chat-quick-tags">
            <span style="font-size:11px;font-weight:600;color:#64748b;margin-right:4px;">Topik Cepat:</span>
            <button type="button" class="foxsa-chat-tag-pill" data-chat-tag="[BREAKING NEWS]">🚨 Breaking News</button>
            <button type="button" class="foxsa-chat-tag-pill" data-chat-tag="[TUGAS LIPUTAN]">🎙️ Tugas Liputan</button>
            <button type="button" class="foxsa-chat-tag-pill" data-chat-tag="[PENGUMUMAN REDAKSI]">📢 Pengumuman</button>
            <button type="button" class="foxsa-chat-tag-pill" data-chat-tag="[LAPORAN TKP]">📍 Laporan TKP</button>
            <button type="button" class="foxsa-chat-tag-pill" data-chat-tag="[KOORDINASI]">☕ Koordinasi</button>
          </div>

          <form id="foxsa-admin-chat-form" class="foxsa-chat-form">
            <div class="foxsa-chat-input-row">
              <textarea id="foxsa-chat-input" class="foxsa-input" rows="2" placeholder="Tulis instruksi liputan, catatan redaksi, atau laporan berita sebagai ${escapeHtml(state.currentUser.displayName)}..." required></textarea>
              <button type="submit" class="foxsa-btn" style="background:#F08D39;border-color:#F08D39;padding:0 22px;white-space:nowrap;">
                <i class="fa-solid fa-paper-plane"></i> Kirim Pesan
              </button>
            </div>
            ${isUserHighStaff ? `
              <div style="display:flex;justify-content:flex-end;margin-top:8px;">
                <button type="button" id="btn-clear-chat-history" class="foxsa-editor-btn" style="font-size:11px;color:#dc2626;border-color:#fecaca;">
                  <i class="fa-solid fa-broom"></i> Bersihkan Riwayat Chat
                </button>
              </div>
            ` : ''}
          </form>
        </div>
      `;
    }

    // TAB 4: KELOLA STAFF, PERSETUJUAN (ACC), & PASSWORD
    else if (state.adminTab === 'staff') {
      const sbCfg = getSupabaseConfig();
      tabContentHtml = `
        <!-- KONEKSI CLOUD DATABASE (SUPABASE) -->
        ${isUserHighStaff ? `
          <div class="foxsa-cloud-card">
            <div class="foxsa-cloud-header">
              <div class="foxsa-cloud-title">
                <i class="fa-solid fa-cloud-arrow-up" style="color:#0ea5e9;font-size:22px;"></i>
                <div>
                  <h4>Koneksi Cloud Database (Supabase) — Realtime &amp; Multi-Device Sync</h4>
                  <div style="font-size:12px;color:#64748b;margin-top:2px;">
                    Hubungkan ke database online agar seluruh pendaftaran akun baru, foto profil, dan chat redaksi otomatis tersinkron ke semua HP &amp; browser secara Realtime.
                  </div>
                </div>
              </div>
              <div>
                ${sbCfg.enabled ? `
                  <span class="foxsa-cloud-badge connected">
                    <i class="fa-solid fa-circle-check"></i> Terhubung ke Supabase Cloud
                  </span>
                ` : `
                  <span class="foxsa-cloud-badge disconnected">
                    <i class="fa-solid fa-circle-pause"></i> Mode Offline / Lokal Browser
                  </span>
                `}
              </div>
            </div>

            <form id="foxsa-supabase-config-form">
              <div class="foxsa-cloud-grid">
                <div class="foxsa-form-group" style="margin:0;">
                  <label style="font-size:12px;font-weight:600;color:#334155;display:block;margin-bottom:4px;">Supabase Project URL</label>
                  <input type="url" id="sb-cfg-url" class="foxsa-input" style="font-size:13px;padding:8px 12px;" placeholder="https://xxxxxxxxxxxx.supabase.co" value="${escapeHtml(sbCfg.url || '')}" />
                </div>
                <div class="foxsa-form-group" style="margin:0;">
                  <label style="font-size:12px;font-weight:600;color:#334155;display:block;margin-bottom:4px;">Supabase Anon / Public Key</label>
                  <input type="password" id="sb-cfg-anon" class="foxsa-input" style="font-size:13px;padding:8px 12px;" placeholder="eyJhbGciOiJIUzI1NiIsIn..." value="${escapeHtml(sbCfg.anonKey || '')}" />
                </div>
              </div>

              <div class="foxsa-cloud-actions" style="margin-top:12px;">
                <button type="submit" class="foxsa-btn" style="padding:7px 16px;font-size:12.5px;background:#0ea5e9;border-color:#0ea5e9;">
                  <i class="fa-solid fa-floppy-disk"></i> Simpan &amp; Uji Koneksi
                </button>
                <button type="button" class="foxsa-btn foxsa-btn-outline" id="sb-btn-manual-sync" style="padding:7px 16px;font-size:12.5px;">
                  <i class="fa-solid fa-rotate"></i> Sinkronkan Data Sekarang
                </button>
                <button type="button" class="foxsa-editor-btn" id="sb-btn-toggle-sql" style="padding:6px 12px;font-size:12px;">
                  <i class="fa-solid fa-code"></i> Panduan SQL Supabase
                </button>
              </div>
            </form>

            <div id="sb-sql-guide" style="display:none;margin-top:14px;background:#0f172a;color:#cbd5e1;border-radius:8px;padding:14px;font-size:12px;line-height:1.6;">
              <div style="font-weight:700;color:#38bdf8;margin-bottom:6px;"><i class="fa-solid fa-circle-info"></i> Langkah Penggunaan Supabase (Gratis &amp; 1 Menit Selesai):</div>
              <ol style="margin:0 0 10px 18px;padding:0;">
                <li>Buka <a href="https://supabase.com" target="_blank" rel="noopener" style="color:#38bdf8;text-decoration:underline;">supabase.com</a> lalu buat project baru.</li>
                <li>Masuk ke <strong>SQL Editor</strong> di dashboard Supabase.</li>
                <li>Buka file <code>supabase_schema.sql</code> di project ini atau salin seluruh perintah SQL, lalu klik <strong>Run</strong>.</li>
                <li>Masuk ke <strong>Project Settings &gt; API</strong>, salin <strong>Project URL</strong> dan <strong>anon/public key</strong>, lalu tempel di form di atas.</li>
              </ol>
            </div>
          </div>
        ` : ''}

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
                        <td>
                    <div style="display:flex;align-items:center;gap:8px;">
                      <img src="${escapeHtml(acc.avatar || DEFAULT_AVATAR)}" style="width:28px;height:28px;border-radius:50%;object-fit:cover;border:1px solid #cbd5e1;" onerror="this.src='${DEFAULT_AVATAR}'" />
                      <div>
                        <strong>${escapeHtml(acc.displayName)}</strong>
                        
                      </div>
                    </div>
                  </td>
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
                      <button type="button" class="foxsa-editor-btn" style="color:#7c3aed;border-color:#ddd6fe;" data-edit-staff-avatar="${escapeHtml(acc.username)}" title="Ubah Foto Profil Staff">
                        <i class="fa-solid fa-image"></i> Foto
                      </button>
                      ${acc.username !== 'admin' ? `
                        <button type="button" class="foxsa-editor-btn" style="color:#d97706;border-color:#fde68a;" data-make-former-staff="${escapeHtml(acc.username)}" title="Purnatugaskan ke Former Staff / Alumni">
                          <i class="fa-solid fa-graduation-cap"></i> Jadikan Former
                        </button>
                      ` : ''}
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

        <!-- FORMER STAFF & ALUMNI MANAGEMENT SECTION -->
        <div class="foxsa-former-staff-mgmt-box" style="margin-top:28px;margin-bottom:28px;background:#f8fafc;border:1px solid #e2e8f0;border-radius:12px;padding:20px;">
          <div style="display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:10px;margin-bottom:14px;">
            <div>
              <h4 style="margin:0;font-size:15px;color:#0f172a;display:flex;align-items:center;gap:8px;">
                <i class="fa-solid fa-award" style="color:#d97706;"></i>
                Daftar Anggota Purna Tugas &amp; Former Staff FoxSA (${(state.data.formerStaff || []).length})
              </h4>
              <p style="margin:4px 0 0;font-size:12px;color:#64748b;">
                Jajaran alumni yang tampil di galeri publik <strong>#/profile/former-staff</strong>. High Staff dapat mengaktifkan kembali staf jika bergabung kembali.
              </p>
            </div>
            ${isUserHighStaff ? `
              <button type="button" class="foxsa-btn foxsa-btn-outline" id="btn-add-former-manual" style="padding:6px 14px;font-size:12px;">
                <i class="fa-solid fa-user-plus"></i> + Tambah Alumni Manual
              </button>
            ` : ''}
          </div>

          <div class="foxsa-table-responsive">
            <table class="foxsa-admin-table" style="background:#ffffff;">
              <thead>
                <tr>
                  <th>Nama Alumni</th>
                  <th>Jabatan Terakhir</th>
                  <th>Kategori</th>
                  <th>Masa Bakti</th>
                  <th>Catatan &amp; Warisan</th>
                  ${isUserHighStaff ? '<th>Aksi High Staff</th>' : ''}
                </tr>
              </thead>
              <tbody>
                ${(state.data.formerStaff || []).map(f => `
                  <tr>
                    <td>
                      <div style="display:flex;align-items:center;gap:8px;">
                        <img src="${escapeHtml(f.avatar || DEFAULT_AVATAR)}" style="width:28px;height:28px;border-radius:50%;object-fit:cover;border:1px solid #cbd5e1;" onerror="this.src='${DEFAULT_AVATAR}'" />
                        <strong>${escapeHtml(f.name)}</strong>
                      </div>
                    </td>
                    <td><span class="foxsa-role-badge" style="background:#fef3c7;color:#b45309;border:1px solid #fde68a;">${escapeHtml(f.formerRole || f.badge || 'Former Staff')}</span></td>
                    <td><span style="font-size:12px;text-transform:capitalize;color:#475569;">${escapeHtml(f.category || 'staff')}</span></td>
                    <td style="font-size:12px;color:#64748b;white-space:nowrap;">${escapeHtml(f.period || '2025 – 2026')}</td>
                    <td style="font-size:12px;color:#64748b;max-width:240px;"><em>"${escapeHtml(f.legacy || f.bio || '—')}"</em></td>
                    ${isUserHighStaff ? `
                      <td style="white-space:nowrap;">
                        <button type="button" class="foxsa-editor-btn" style="color:#16a34a;border-color:#bbf7d0;" data-reactivate-former="${escapeHtml(f.id)}" title="Aktifkan Kembali ke Staf Aktif">
                          <i class="fa-solid fa-arrow-rotate-left"></i> Aktifkan
                        </button>
                        <button type="button" class="foxsa-editor-btn" style="color:#dc2626;border-color:#fecaca;" data-delete-former="${escapeHtml(f.id)}" title="Hapus dari Hall of Fame">
                          <i class="fa-solid fa-trash-can"></i>
                        </button>
                      </td>
                    ` : ''}
                  </tr>
                `).join('')}
              </tbody>
            </table>
          </div>
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
    else if (state.adminTab === 'profile') {
      const userAvatar = state.currentUser.avatar || DEFAULT_AVATAR;
      const roleInfo = getRoleInfo(state.currentUser.role);
      const userPostsCount = state.data.posts.filter(p => (p.author || '').toLowerCase() === (state.currentUser.displayName || '').toLowerCase()).length;

      tabContentHtml = `
        <div class="foxsa-myprofile-wrap">
          <div class="foxsa-myprofile-header">
            <div class="myprofile-header-title">
              <h3><i class="fa-solid fa-user-gear"></i> Pengaturan Profil &amp; Foto Staff</h3>
              <p>Kelola identitas jurnalis, foto profil, biografi, serta quote Anda yang tampil di halaman tim dan artikel berita.</p>
            </div>
            <div class="myprofile-header-meta">
              <span class="myprofile-status-badge"><i class="fa-solid fa-circle-check"></i> Akun Terverifikasi</span>
            </div>
          </div>

          <div class="foxsa-myprofile-grid">
            <!-- LEFT CARD: LIVE PROFILE CARD PREVIEW -->
            <div class="myprofile-preview-card">
              <div class="myprofile-card-cover"></div>
              <div class="myprofile-avatar-wrapper">
                <img id="myprofile-preview-avatar" src="${userAvatar}" alt="${escapeHtml(state.currentUser.displayName)}" onerror="this.src='${DEFAULT_AVATAR}'" />
                <span class="myprofile-avatar-badge" title="Role Aktif"><i class="fa-solid ${roleInfo.icon}"></i></span>
              </div>
              <div class="myprofile-card-body">
                <h4 id="myprofile-preview-name">${escapeHtml(state.currentUser.displayName)}</h4>
                <div class="myprofile-username-tag">@${escapeHtml(state.currentUser.username)}</div>
                <div class="myprofile-role-pill" id="myprofile-preview-role">
                  ${renderRoleBadgeHtml(state.currentUser.role)}
                </div>
                


                <div class="myprofile-quote-bubble" id="myprofile-preview-quote">
                  <i class="fa-solid fa-quote-left"></i>
                  <p>“${escapeHtml(state.currentUser.quote || 'Jurnalisme jujur, terpercaya, dan akurat untuk San Andreas.')}”</p>
                </div>

                <div class="myprofile-bio-box">
                  <label>Bio Singkat:</label>
                  <p id="myprofile-preview-bio">${escapeHtml(state.currentUser.bio || 'Staf redaksi resmi FoxSA News Agency.')}</p>
                </div>

                <div class="myprofile-stats-row">
                  <div class="myprofile-stat-item">
                    <strong>${userPostsCount}</strong>
                    <span>Berita Ditulis</span>
                  </div>
                  <div class="myprofile-stat-item">
                    <strong>${state.currentUser.isAdmin ? 'Admin / High Staff' : 'Redaksi'}</strong>
                    <span>Hak Akses</span>
                  </div>
                </div>
              </div>
            </div>

            <!-- RIGHT CARD: FORM EDIT PROFIL & UPLOAD FOTO -->
            <div class="myprofile-form-card">
              <form id="foxsa-myprofile-form">
                <!-- 1. FOTO PROFIL SECTION -->
                <div class="myprofile-section-title">
                  <i class="fa-solid fa-camera"></i> 1. Foto Profil / Avatar Akun
                </div>
                
                <div class="myprofile-photo-picker-row">
                  <div class="photo-picker-preview-col">
                    <img id="myprofile-form-avatar-preview" src="${userAvatar}" alt="Preview" onerror="this.src='${DEFAULT_AVATAR}'" />
                  </div>
                  <div class="photo-picker-inputs-col">
                    <div class="foxsa-form-group">
                      <label for="myprofile-avatar-url">URL Foto / Link Gambar (Disarankan)</label>
                      <div class="foxsa-input-icon-wrap">
                        <i class="fa-solid fa-link"></i>
                        <input type="url" id="myprofile-avatar-url" class="foxsa-input" placeholder="https://blogger.googleusercontent.com/... atau https://i.ibb.co/..." value="${escapeHtml(state.currentUser.avatar || '')}" />
                      </div>
                      <small class="form-hint">Mendukung link langsung dari ImgBB, Discord CDN, Postimages, Google Blogger, dll.</small>
                    </div>

                    <div class="myprofile-or-divider"><span>ATAU UPLOAD DARI PERANGKAT</span></div>

                    <div class="foxsa-form-group">
                      <label for="myprofile-avatar-file" class="myprofile-upload-btn">
                        <i class="fa-solid fa-cloud-arrow-up"></i> Pilih File Foto dari Galeri / Laptop
                      </label>
                      <input type="file" id="myprofile-avatar-file" accept="image/*" style="display:none;" />
                      <small id="myprofile-file-info" style="display:block;margin-top:4px;color:#64748b;font-size:11.5px;"></small>
                    </div>
                  </div>
                </div>

                <!-- 2. DATA DIRI SECTION -->
                <div class="myprofile-section-title" style="margin-top:24px;">
                  <i class="fa-solid fa-id-card"></i> 2. Informasi Pribadi &amp; Jurnalistik
                </div>

                <div class="foxsa-form-group">
                  <label for="myprofile-name">Nama Lengkap IC / Reporter *</label>
                  <div class="foxsa-input-icon-wrap">
                    <i class="fa-solid fa-signature"></i>
                    <input type="text" id="myprofile-name" class="foxsa-input" value="${escapeHtml(state.currentUser.displayName || '')}" required />
                  </div>
                  <small class="form-hint">Nama ini akan tercantum pada byline berita dan kartu jajaran tim.</small>
                </div>



                <div class="foxsa-form-group">
                  <label for="myprofile-quote">Kutipan / Motto Jurnalistik (Quotes)</label>
                  <div class="foxsa-input-icon-wrap">
                    <i class="fa-solid fa-quote-left"></i>
                    <input type="text" id="myprofile-quote" class="foxsa-input" placeholder="Contoh: Setiap kata yang terbit harus akurat, tajam, dan independen." value="${escapeHtml(state.currentUser.quote || LEADER_QUOTES[state.currentUser.username] || '')}" />
                  </div>
                </div>

                <div class="foxsa-form-group">
                  <label for="myprofile-bio">Biografi / Deskripsi Jurnalis</label>
                  <textarea id="myprofile-bio" class="foxsa-textarea" rows="3" placeholder="Tuliskan peran, rekam jejak, atau pengalaman Anda di FoxSA News...">${escapeHtml(state.currentUser.bio || '')}</textarea>
                </div>

                <!-- 3. KEAMANAN AKUN SECTION -->
                <div class="myprofile-section-title" style="margin-top:24px;">
                  <i class="fa-solid fa-lock"></i> 3. Ubah Password Login (Opsional)
                </div>

                <div class="foxsa-form-group">
                  <label for="myprofile-new-password">Password Baru</label>
                  <div class="foxsa-input-icon-wrap">
                    <i class="fa-solid fa-key"></i>
                    <input type="password" id="myprofile-new-password" class="foxsa-input" placeholder="Biarkan kosong jika tidak ingin mengubah password" autocomplete="new-password" />
                  </div>
                </div>

                <div class="myprofile-submit-row">
                  <button type="submit" class="foxsa-btn foxsa-btn-primary" style="padding:12px 24px;font-size:14px;">
                    <i class="fa-solid fa-floppy-disk"></i> Simpan Pembaruan Profil &amp; Foto
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      `;
    }

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
            <button type="button" class="foxsa-btn foxsa-btn-primary" data-admin-tab="profile" style="padding:7px 12px;font-size:12px;">
              <i class="fa-solid fa-user-pen"></i> Edit Profil
            </button>
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
          <button type="button" class="foxsa-admin-tab ${state.adminTab === 'chat' ? 'active' : ''}" data-admin-tab="chat">
            <i class="fa-solid fa-comments"></i> Chat Redaksi ${(state.data.adminChats || []).length > 0 ? `<span class="foxsa-tab-badge" style="background:#F08D39;color:#fff;">${(state.data.adminChats || []).length}</span>` : ''}
          </button>
          <button type="button" class="foxsa-admin-tab ${state.adminTab === 'profile' ? 'active' : ''}" data-admin-tab="profile">
            <i class="fa-solid fa-user-pen"></i> Profil Saya
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


  // =========================================================================
  // MODALS FOR FORMER STAFF ASSIGNMENT (HIGH STAFF)
  // =========================================================================
  function openMakeFormerModal(acc) {
    const existing = document.getElementById('foxsa-former-modal');
    if (existing) existing.remove();

    const defFormerRole = `Former ${acc.role || 'Staff'}`;
    const defPeriod = '2025 – 2026';
    const cleanRole = (acc.role || '').toLowerCase();
    let defCategory = 'staff';
    if (cleanRole.includes('chief') || cleanRole.includes('commissioner') || cleanRole.includes('director')) defCategory = 'leadership';
    else if (cleanRole.includes('manager') || cleanRole.includes('producer') || cleanRole.includes('editor')) defCategory = 'management';

    const modal = document.createElement('div');
    modal.id = 'foxsa-former-modal';
    modal.className = 'foxsa-modal-overlay';
    modal.innerHTML = `
      <div class="foxsa-modal-card" style="max-width:520px;text-align:left;">
        <div class="foxsa-modal-header">
          <div style="display:flex;align-items:center;gap:8px;">
            <i class="fa-solid fa-graduation-cap" style="color:#d97706;font-size:18px;"></i>
            <h4 style="margin:0;font-size:16px;color:#090C1E;font-family:'Poppins',sans-serif;">Purnatugaskan Staf: ${escapeHtml(acc.displayName)}</h4>
          </div>
          <button type="button" class="foxsa-modal-close" id="former-modal-close-btn" aria-label="Tutup">&times;</button>
        </div>
        <form id="former-staff-submit-form">
          <div class="foxsa-modal-body">
            <p style="font-size:13px;color:#64748b;margin:0 0 14px;line-height:1.5;">
              Staf ini akan dipindahkan dari <strong>Staf Aktif</strong> ke <strong>Hall of Fame Former Staff &amp; Alumni</strong>. Posisi resminya di struktur organisasi FoxSA News akan menjadi <strong>[VACANT]</strong>.
            </p>
            <div class="foxsa-form-group" style="margin-bottom:12px;">
              <label style="font-size:12px;font-weight:600;display:block;margin-bottom:4px;">Gelar / Jabatan Terakhir Purna Tugas *</label>
              <input type="text" id="former-inp-role" class="foxsa-input" value="${escapeHtml(defFormerRole)}" required style="width:100%;font-size:13px;" />
            </div>
            <div class="foxsa-form-row" style="margin-bottom:12px;display:flex;gap:10px;">
              <div class="foxsa-form-group" style="flex:1;">
                <label style="font-size:12px;font-weight:600;display:block;margin-bottom:4px;">Masa Bakti / Periode *</label>
                <input type="text" id="former-inp-period" class="foxsa-input" value="${escapeHtml(defPeriod)}" required style="width:100%;font-size:13px;" />
              </div>
              <div class="foxsa-form-group" style="flex:1;">
                <label style="font-size:12px;font-weight:600;display:block;margin-bottom:4px;">Kategori Galeri *</label>
                <select id="former-inp-cat" class="foxsa-select" style="width:100%;font-size:13px;padding:8px 10px;">
                  <option value="leadership" ${defCategory === 'leadership' ? 'selected' : ''}>Dewan Eksekutif (Leadership)</option>
                  <option value="management" ${defCategory === 'management' ? 'selected' : ''}>Manajemen &amp; Supervisor</option>
                  <option value="staff" ${defCategory === 'staff' ? 'selected' : ''}>Staf Lapangan &amp; Reporter</option>
                </select>
              </div>
            </div>
            <div class="foxsa-form-group" style="margin-bottom:6px;">
              <label style="font-size:12px;font-weight:600;display:block;margin-bottom:4px;">Pesan Kesan / Warisan (Legacy Quote) *</label>
              <textarea id="former-inp-legacy" class="foxsa-input" rows="3" required style="width:100%;font-size:13px;line-height:1.4;">Dedikasi dan kontribusi jurnalistik luar biasa dalam pembangunan divisi redaksi FoxSA News Agency.</textarea>
            </div>
          </div>
          <div class="foxsa-modal-footer">
            <button type="button" class="foxsa-btn foxsa-btn-outline" id="former-modal-cancel-btn" style="padding:8px 16px;font-size:13px;">Batal</button>
            <button type="submit" class="foxsa-btn" style="background:#d97706;border-color:#d97706;padding:8px 18px;font-size:13px;">
              <i class="fa-solid fa-check"></i> Simpan ke Former Staff
            </button>
          </div>
        </form>
      </div>
    `;

    document.body.appendChild(modal);

    const closeBtn = modal.querySelector('#former-modal-close-btn');
    const cancelBtn = modal.querySelector('#former-modal-cancel-btn');
    const form = modal.querySelector('#former-staff-submit-form');

    const closeModal = () => modal.remove();
    if (closeBtn) closeBtn.addEventListener('click', closeModal);
    if (cancelBtn) cancelBtn.addEventListener('click', closeModal);
    modal.addEventListener('click', (e) => {
      if (e.target === modal) closeModal();
    });

    if (form) {
      form.addEventListener('submit', (e) => {
        e.preventDefault();
        const roleVal = document.getElementById('former-inp-role').value.trim();
        const periodVal = document.getElementById('former-inp-period').value.trim();
        const catVal = document.getElementById('former-inp-cat').value;
        const legacyVal = document.getElementById('former-inp-legacy').value.trim();

        acc.isFormer = true;
        acc.formerRole = roleVal;
        acc.formerPeriod = periodVal;
        acc.role = 'Former Staff';

        const newFormerEntry = {
          id: acc.username,
          name: acc.displayName,
          formerRole: roleVal,
          category: catVal,
          badge: roleVal.replace(/^Former\s*/i, '') || 'Alumni FoxSA',
          period: periodVal,
          avatar: acc.avatar || getRandomExecutiveAvatarSvg(2),
          bio: acc.bio || `Purna tugas dari jabatan ${roleVal} FoxSA News Agency.`,
          legacy: legacyVal,
          authorName: acc.displayName
        };

        if (!Array.isArray(state.data.formerStaff)) state.data.formerStaff = [];
        state.data.formerStaff = state.data.formerStaff.filter(f => f.id !== acc.username);
        state.data.formerStaff.unshift(newFormerEntry);

        saveDataToLocal(true);
        syncFormerStaffToSupabase(newFormerEntry);
        syncStaffAccountToSupabase(acc);
        closeModal();
        renderAdminView();
        showToast(`${acc.displayName} resmi purna tugas dan tercatat di Hall of Fame Former Staff!`);
      });
    }
  }

  function openAddFormerManualModal() {
    const existing = document.getElementById('foxsa-former-modal');
    if (existing) existing.remove();

    const modal = document.createElement('div');
    modal.id = 'foxsa-former-modal';
    modal.className = 'foxsa-modal-overlay';
    modal.innerHTML = `
      <div class="foxsa-modal-card" style="max-width:520px;text-align:left;">
        <div class="foxsa-modal-header">
          <div style="display:flex;align-items:center;gap:8px;">
            <i class="fa-solid fa-user-plus" style="color:#d97706;font-size:18px;"></i>
            <h4 style="margin:0;font-size:16px;color:#090C1E;font-family:'Poppins',sans-serif;">Tambah Alumni / Former Staff Manual</h4>
          </div>
          <button type="button" class="foxsa-modal-close" id="former-modal-close-btn" aria-label="Tutup">&times;</button>
        </div>
        <form id="former-manual-submit-form">
          <div class="foxsa-modal-body">
            <div class="foxsa-form-group" style="margin-bottom:12px;">
              <label style="font-size:12px;font-weight:600;display:block;margin-bottom:4px;">Nama Lengkap Tokoh Alumni *</label>
              <input type="text" id="manual-former-name" class="foxsa-input" placeholder="Contoh: Jessica Roberts" required style="width:100%;font-size:13px;" />
            </div>
            <div class="foxsa-form-group" style="margin-bottom:12px;">
              <label style="font-size:12px;font-weight:600;display:block;margin-bottom:4px;">Jabatan / Gelar Kehormatan *</label>
              <input type="text" id="manual-former-role" class="foxsa-input" placeholder="Contoh: Former Senior Anchor" required style="width:100%;font-size:13px;" />
            </div>
            <div class="foxsa-form-row" style="margin-bottom:12px;display:flex;gap:10px;">
              <div class="foxsa-form-group" style="flex:1;">
                <label style="font-size:12px;font-weight:600;display:block;margin-bottom:4px;">Masa Bakti / Periode *</label>
                <input type="text" id="manual-former-period" class="foxsa-input" value="2025 – 2026" required style="width:100%;font-size:13px;" />
              </div>
              <div class="foxsa-form-group" style="flex:1;">
                <label style="font-size:12px;font-weight:600;display:block;margin-bottom:4px;">Kategori Galeri *</label>
                <select id="manual-former-cat" class="foxsa-select" style="width:100%;font-size:13px;padding:8px 10px;">
                  <option value="leadership">Dewan Eksekutif (Leadership)</option>
                  <option value="management">Manajemen &amp; Supervisor</option>
                  <option value="staff" selected>Staf Lapangan &amp; Reporter</option>
                </select>
              </div>
            </div>
            <div class="foxsa-form-group" style="margin-bottom:6px;">
              <label style="font-size:12px;font-weight:600;display:block;margin-bottom:4px;">Warisan / Catatan Pengabdian *</label>
              <textarea id="manual-former-legacy" class="foxsa-input" rows="2" placeholder="Catatan kontribusi jurnalistik di FoxSA News..." required style="width:100%;font-size:13px;line-height:1.4;"></textarea>
            </div>
          </div>
          <div class="foxsa-modal-footer">
            <button type="button" class="foxsa-btn foxsa-btn-outline" id="former-modal-cancel-btn" style="padding:8px 16px;font-size:13px;">Batal</button>
            <button type="submit" class="foxsa-btn" style="background:#d97706;border-color:#d97706;padding:8px 18px;font-size:13px;">
              <i class="fa-solid fa-plus"></i> Tambah ke Hall of Fame
            </button>
          </div>
        </form>
      </div>
    `;

    document.body.appendChild(modal);

    const closeBtn = modal.querySelector('#former-modal-close-btn');
    const cancelBtn = modal.querySelector('#former-modal-cancel-btn');
    const form = modal.querySelector('#former-manual-submit-form');

    const closeModal = () => modal.remove();
    if (closeBtn) closeBtn.addEventListener('click', closeModal);
    if (cancelBtn) cancelBtn.addEventListener('click', closeModal);
    modal.addEventListener('click', (e) => {
      if (e.target === modal) closeModal();
    });

    if (form) {
      form.addEventListener('submit', (e) => {
        e.preventDefault();
        const nameVal = document.getElementById('manual-former-name').value.trim();
        const roleVal = document.getElementById('manual-former-role').value.trim();
        const periodVal = document.getElementById('manual-former-period').value.trim();
        const catVal = document.getElementById('manual-former-cat').value;
        const legacyVal = document.getElementById('manual-former-legacy').value.trim();

        const newEntry = {
          id: nameVal.toLowerCase().replace(/\s+/g, '') + '_' + Date.now().toString(36),
          name: nameVal,
          formerRole: roleVal,
          category: catVal,
          badge: roleVal.replace(/^Former\s*/i, '') || 'Alumni FoxSA',
          period: periodVal,
          avatar: getRandomExecutiveAvatarSvg(Math.floor(Math.random() * 10)),
          bio: 'Alumni kehormatan FoxSA News Agency.',
          legacy: legacyVal,
          authorName: nameVal
        };

        if (!Array.isArray(state.data.formerStaff)) state.data.formerStaff = [];
        state.data.formerStaff.unshift(newEntry);
        saveDataToLocal(true);
        syncFormerStaffToSupabase(newEntry);
        closeModal();
        renderAdminView();
        showToast(`${nameVal} berhasil ditambahkan ke Galeri Former Staff!`);
      });
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
        if (state.currentRoute) {
          state.currentRoute.param = target;
        }
        try {
          history.replaceState(null, '', '#/admin/' + target);
        } catch (e) {}
        renderAdminView();
      });
    });

    const newPostBtn = document.getElementById('admin-new-post-btn');
    if (newPostBtn) {
      newPostBtn.addEventListener('click', () => {
        state.editingPostId = null;
        state.selectedEditorLabels = ['Crime', 'LSPD'];
        state.adminTab = 'editor';
        if (state.currentRoute) {
          state.currentRoute.param = 'editor';
        }
        try {
          history.replaceState(null, '', '#/admin/editor');
        } catch (e) {}
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
        if (state.currentRoute) {
          state.currentRoute.param = 'editor';
        }
        try {
          history.replaceState(null, '', '#/admin/editor');
        } catch (e) {}
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


    // ---------------------------------------------------------------------
    // CHAT REDAKSI EVENTS
    // ---------------------------------------------------------------------
    const chatForm = document.getElementById('foxsa-admin-chat-form');
    const chatInput = document.getElementById('foxsa-chat-input');
    const chatBox = document.getElementById('foxsa-chat-messages-container');

    // Auto-scroll chat box to bottom
    if (chatBox) {
      chatBox.scrollTop = chatBox.scrollHeight;
    }

    if (chatForm && chatInput) {
      chatForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const text = chatInput.value.trim();
        if (!text) return;

        const newMsg = {
          id: 'chat_' + Date.now() + '_' + Math.random().toString(36).substr(2, 5),
          senderUsername: state.currentUser.username,
          senderName: state.currentUser.displayName || state.currentUser.authorName || state.currentUser.username,
          senderRole: state.currentUser.role || 'Staff Redaksi',
          senderAvatar: state.currentUser.avatar || getRandomExecutiveAvatarSvg(0),
          message: text,
          timestamp: new Date().toISOString()
        };

        if (!Array.isArray(state.data.adminChats)) state.data.adminChats = [];
        state.data.adminChats.push(newMsg);
        saveDataToLocal(true);
        syncAdminChatToSupabase(newMsg);
        renderAdminView();
        showToast('Pesan redaksi berhasil dikirim!');
      });
    }

    // Quick tag pills click
    mainEl.querySelectorAll('[data-chat-tag]').forEach(pill => {
      pill.addEventListener('click', () => {
        const tag = pill.getAttribute('data-chat-tag');
        if (chatInput) {
          chatInput.value = tag + ' ' + chatInput.value;
          chatInput.focus();
        }
      });
    });

    // Delete single chat message
    mainEl.querySelectorAll('[data-delete-chat]').forEach(btn => {
      btn.addEventListener('click', () => {
        const id = btn.getAttribute('data-delete-chat');
        if (!confirm('Hapus pesan koordinasi ini?')) return;
        state.data.adminChats = (state.data.adminChats || []).filter(m => m.id !== id);
        saveDataToLocal(true);
        deleteAdminChatFromSupabase(id);
        renderAdminView();
        showToast('Pesan berhasil dihapus.');
      });
    });

    // Clear all chat history (High Staff only)
    const clearChatBtn = document.getElementById('btn-clear-chat-history');
    if (clearChatBtn) {
      clearChatBtn.addEventListener('click', () => {
        if (!confirm('Yakin ingin membersihkan riwayat obrolan redaksi? Pesan akan direset ke seed default.')) return;
        state.data.adminChats = [];
        saveDataToLocal(true);
        renderAdminView();
        showToast('Riwayat obrolan redaksi telah dibersihkan.');
      });
    }

    // ---------------------------------------------------------------------
    // FORMER STAFF MANAGEMENT EVENTS (HIGH STAFF)
    // ---------------------------------------------------------------------
    mainEl.querySelectorAll('[data-make-former-staff]').forEach(btn => {
      btn.addEventListener('click', () => {
        const username = btn.getAttribute('data-make-former-staff');
        const acc = (state.data.staffAccounts || []).find(a => a.username === username);
        if (!acc) return;
        openMakeFormerModal(acc);
      });
    });

    mainEl.querySelectorAll('[data-reactivate-former]').forEach(btn => {
      btn.addEventListener('click', () => {
        const formerId = btn.getAttribute('data-reactivate-former');
        const f = (state.data.formerStaff || []).find(x => x.id === formerId);
        if (!f) return;
        if (!confirm(`Aktifkan kembali "${f.name}" sebagai Staf Aktif FoxSA News?`)) return;

        // Restore in staffAccounts if present
        let acc = (state.data.staffAccounts || []).find(a => a.username === formerId || a.displayName === f.name);
        const restoredRole = (f.formerRole || 'Staff Reporter').replace(/^Former\s*/i, '') || 'Staff Reporter';

        if (acc) {
          acc.isFormer = false;
          acc.role = restoredRole;
          acc.status = 'approved';
        } else {
          // Re-create staff account
          const newAcc = {
            username: f.id || f.name.toLowerCase().replace(/\s+/g, ''),
            password: 'foxsa' + Math.floor(1000 + Math.random() * 9000),
            displayName: f.name,
            authorName: f.name,
            role: restoredRole,
            status: 'approved',
            isAdmin: false,
            isFormer: false,
            avatar: f.avatar || getRandomExecutiveAvatarSvg(1)
          };
          if (!state.data.staffAccounts) state.data.staffAccounts = [];
          state.data.staffAccounts.push(newAcc);
        }

        // Remove from formerStaff list
        state.data.formerStaff = (state.data.formerStaff || []).filter(x => x.id !== formerId);
        saveDataToLocal(true);
        deleteFormerStaffFromSupabase(formerId);
        if (acc) syncStaffAccountToSupabase(acc);
        renderAdminView();
        showToast(`${f.name} berhasil diaktifkan kembali ke Staf Aktif (${restoredRole})!`);
      });
    });

    mainEl.querySelectorAll('[data-delete-former]').forEach(btn => {
      btn.addEventListener('click', () => {
        const formerId = btn.getAttribute('data-delete-former');
        const f = (state.data.formerStaff || []).find(x => x.id === formerId);
        if (!f) return;
        if (!confirm(`Hapus "${f.name}" dari daftar Former Staff & Hall of Fame?`)) return;
        state.data.formerStaff = (state.data.formerStaff || []).filter(x => x.id !== formerId);
        saveDataToLocal(true);
        deleteFormerStaffFromSupabase(formerId);
        renderAdminView();
        showToast(`${f.name} dihapus dari daftar Former Staff.`);
      });
    });

    const addFormerManualBtn = document.getElementById('btn-add-former-manual');
    if (addFormerManualBtn) {
      addFormerManualBtn.addEventListener('click', () => {
        openAddFormerManualModal();
      });
    }


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
          if (state.currentRoute) {
            state.currentRoute.param = 'posts';
          }
          try {
            history.replaceState(null, '', '#/admin/posts');
          } catch (e) {}
          renderAdminView();
        });
      }

      const backListBtn = document.getElementById('editor-back-list-btn');
      if (backListBtn) {
        backListBtn.addEventListener('click', () => {
          state.editingPostId = null;
          state.adminTab = 'posts';
          if (state.currentRoute) {
            state.currentRoute.param = 'posts';
          }
          try {
            history.replaceState(null, '', '#/admin/posts');
          } catch (e) {}
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
        syncStaffAccountToSupabase(acc);
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
        deleteStaffAccountFromSupabase(username);
        renderAdminView();
        showToast(`Pendaftaran akun @${username} telah ditolak.`);
      });
    });

    // Staff Management Tab Events
    mainEl.querySelectorAll('[data-edit-staff-avatar]').forEach(btn => {
      btn.addEventListener('click', () => {
        const username = btn.getAttribute('data-edit-staff-avatar');
        const acc = (state.data.staffAccounts || []).find(a => a.username === username);
        if (!acc) return;
        const current = acc.avatar || '';
        const newAvatar = prompt(`Masukkan URL Foto Profil baru untuk @${acc.username} (${acc.displayName}):\n\n(Atau masukkan link gambar dari ImgBB / Discord / Google Blogger)`, current);
        if (newAvatar !== null) {
          const trimmed = newAvatar.trim();
          acc.avatar = trimmed || DEFAULT_AVATAR;
          if (!state.data.authors) state.data.authors = {};
          if (state.data.authors[acc.displayName]) {
            state.data.authors[acc.displayName].avatar = acc.avatar;
          }
          if (state.currentUser && state.currentUser.username === acc.username) {
            state.currentUser.avatar = acc.avatar;
          }
          saveDataToLocal(true);
          syncStaffAccountToSupabase(acc);
          renderAdminView();
          updateHeaderStaffBadge();
          showToast(`Foto profil @${acc.username} berhasil diperbarui!`);
        }
      });
    });

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
            syncStaffAccountToSupabase(acc);
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
        syncStaffAccountToSupabase(acc);
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
        deleteStaffAccountFromSupabase(username);
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

        const newStaff = {
          username,
          password,
          displayName,
          authorName: displayName,
          role,
          status: 'approved',
          isAdmin: false,
          avatar: getRandomExecutiveAvatarSvg(Math.floor(Math.random() * 10))
        };
        state.data.staffAccounts.push(newStaff);

        if (!state.data.authors[displayName]) {
          state.data.authors[displayName] = {
            name: displayName,
            avatar: DEFAULT_AVATAR,
            bio: role,
            profileUrl: `#/author/${displayName}`
          };
        }

        saveDataToLocal(true);
        syncStaffAccountToSupabase(newStaff);
        renderAdminView();
        showToast(`Akun staff ${displayName} (${username}) berhasil ditambahkan & diaktifkan!`);
      });
    }

    // Profile Tab Events (Edit Profile & Live Photo Upload)
    const myProfileForm = document.getElementById('foxsa-myprofile-form');
    if (myProfileForm) {
      const pAvatarUrlInp = document.getElementById('myprofile-avatar-url');
      const pAvatarFileInp = document.getElementById('myprofile-avatar-file');
      const pFormAvatarPreview = document.getElementById('myprofile-form-avatar-preview');
      const pCardAvatarPreview = document.getElementById('myprofile-preview-avatar');
      const pNameInp = document.getElementById('myprofile-name');
      const pDiscordInp = null;
      const pQuoteInp = document.getElementById('myprofile-quote');
      const pBioInp = document.getElementById('myprofile-bio');
      const pNewPassInp = document.getElementById('myprofile-new-password');

      // Live typing updates on preview card
      if (pAvatarUrlInp && pFormAvatarPreview && pCardAvatarPreview) {
        pAvatarUrlInp.addEventListener('input', () => {
          const val = pAvatarUrlInp.value.trim() || DEFAULT_AVATAR;
          pFormAvatarPreview.src = val;
          pCardAvatarPreview.src = val;
        });
      }

      if (pAvatarFileInp) {
        pAvatarFileInp.addEventListener('change', (e) => {
          const file = e.target.files && e.target.files[0];
          if (!file) return;
          if (file.size > 2.5 * 1024 * 1024) {
            alert('Ukuran file maksimal 2.5 MB!');
            return;
          }
          const reader = new FileReader();
          reader.onload = (ev) => {
            const dataUrl = ev.target.result;
            if (pAvatarUrlInp) pAvatarUrlInp.value = dataUrl;
            if (pFormAvatarPreview) pFormAvatarPreview.src = dataUrl;
            if (pCardAvatarPreview) pCardAvatarPreview.src = dataUrl;
            const infoEl = document.getElementById('myprofile-file-info');
            if (infoEl) infoEl.textContent = `Foto dipilih: ${file.name} (${Math.round(file.size / 1024)} KB)`;
          };
          reader.readAsDataURL(file);
        });
      }

      if (pNameInp) {
        pNameInp.addEventListener('input', () => {
          const nameEl = document.getElementById('myprofile-preview-name');
          if (nameEl) nameEl.textContent = pNameInp.value.trim() || state.currentUser.displayName;
        });
      }



      if (pQuoteInp) {
        pQuoteInp.addEventListener('input', () => {
          const qEl = document.querySelector('#myprofile-preview-quote p');
          if (qEl) qEl.textContent = `“${pQuoteInp.value.trim() || 'Jurnalisme jujur, terpercaya, dan akurat untuk San Andreas.'}”`;
        });
      }

      if (pBioInp) {
        pBioInp.addEventListener('input', () => {
          const bioEl = document.getElementById('myprofile-preview-bio');
          if (bioEl) bioEl.textContent = pBioInp.value.trim() || 'Staf redaksi resmi FoxSA News Agency.';
        });
      }

      // Handle submit
      myProfileForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const newAvatar = (pAvatarUrlInp ? pAvatarUrlInp.value.trim() : '') || state.currentUser.avatar || DEFAULT_AVATAR;
        const newName = pNameInp.value.trim();
        
        const newQuote = pQuoteInp ? pQuoteInp.value.trim() : '';
        const newBio = pBioInp ? pBioInp.value.trim() : '';
        const newPass = pNewPassInp ? pNewPassInp.value.trim() : '';

        if (!newName) {
          alert('Nama lengkap tidak boleh kosong!');
          return;
        }

        // Update state.currentUser
        state.currentUser.avatar = newAvatar;
        state.currentUser.displayName = newName;
        state.currentUser.authorName = newName;
        
        state.currentUser.quote = newQuote;
        state.currentUser.bio = newBio;
        if (newPass) {
          state.currentUser.password = newPass;
        }

        // Update account in state.data.staffAccounts
        const targetAcc = (state.data.staffAccounts || []).find(a => a.username === state.currentUser.username);
        if (targetAcc) {
          targetAcc.avatar = newAvatar;
          targetAcc.displayName = newName;
          targetAcc.authorName = newName;
          
          targetAcc.quote = newQuote;
          targetAcc.bio = newBio;
          if (newPass) targetAcc.password = newPass;
        }

        // Update in state.data.authors
        if (!state.data.authors) state.data.authors = {};
        state.data.authors[newName] = {
          bio: `${state.currentUser.role} | FoxSA News`,
          profileUrl: `#/author/${encodeURIComponent(newName)}`,
          name: newName,
          avatar: newAvatar
        };

        // Update in LEADER_QUOTES
        if (typeof LEADER_QUOTES !== 'undefined') {
          LEADER_QUOTES[state.currentUser.username] = newQuote;
        }

        // Save and refresh
        saveDataToLocal(true);
        if (targetAcc) syncStaffAccountToSupabase(targetAcc);
        updateHeaderStaffBadge();
        renderAdminView();
        showToast('Profil & foto Anda berhasil diperbarui dan langsung terhubung ke seluruh sistem!');
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

    // Supabase Cloud Database Form Handlers
    const sbConfigForm = document.getElementById('foxsa-supabase-config-form');
    if (sbConfigForm) {
      sbConfigForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const urlInp = document.getElementById('sb-cfg-url');
        const anonInp = document.getElementById('sb-cfg-anon');
        const urlVal = urlInp ? urlInp.value.trim() : '';
        const anonVal = anonInp ? anonInp.value.trim() : '';

        const cfg = {
          url: urlVal,
          anonKey: anonVal,
          enabled: Boolean(urlVal && anonVal)
        };
        saveSupabaseConfig(cfg);

        if (!cfg.enabled) {
          showToast('Konfigurasi Supabase dikosongkan. Kembali ke mode penyimpanan lokal.');
          renderAdminView();
          return;
        }

        showToast('Menghubungkan ke Supabase Cloud...');
        const ok = await syncFromSupabase(true);
        if (ok) {
          initSupabaseRealtime();
          showToast('✅ Berhasil terhubung ke Supabase Cloud! Data akun & chat tersinkron.');
        } else {
          showToast('⚠️ Gagal terhubung ke Supabase. Periksa URL Project & Anon Key Anda.');
        }
        renderAdminView();
      });
    }

    const sbManualSyncBtn = document.getElementById('sb-btn-manual-sync');
    if (sbManualSyncBtn) {
      sbManualSyncBtn.addEventListener('click', async () => {
        sbManualSyncBtn.disabled = true;
        sbManualSyncBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Menyinkronkan...';
        const ok = await syncFromSupabase(true);
        sbManualSyncBtn.disabled = false;
        sbManualSyncBtn.innerHTML = '<i class="fa-solid fa-rotate"></i> Sinkronkan Data Sekarang';
        if (ok) {
          showToast('✅ Seluruh data akun & chat redaksi berhasil disinkronkan dengan Supabase Cloud!');
          renderAdminView();
        } else {
          showToast('⚠️ Gagal sinkronisasi. Pastikan Supabase URL & Key sudah benar.');
        }
      });
    }

    const sbToggleSqlBtn = document.getElementById('sb-btn-toggle-sql');
    if (sbToggleSqlBtn) {
      sbToggleSqlBtn.addEventListener('click', () => {
        const guide = document.getElementById('sb-sql-guide');
        if (!guide) return;
        guide.style.display = guide.style.display === 'none' ? 'block' : 'none';
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
    return getRandomExecutiveAvatarSvg(variantIndex);
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

  
  // =========================================================================
  // FOXSA FORMER STAFF & HONORARY ALUMNI (HALL OF FAME)
  // =========================================================================
  const FOXSA_FORMER_STAFF = [
    {
      id: 'messiah',
      name: 'Messiah Dillard',
      formerRole: 'Founder & 1st Chief Executive Officer',
      category: 'leadership',
      badge: 'Founder & 1st CEO',
      period: '17 Nov 2025 – Era Rintisan',
      avatar: 'assets/logo/foxsa-icon.jpg',
      bio: 'Pendiri pertama FoxSA News Agency yang meletakkan dasar jurnalisme berani, independen, dan lugas di San Andreas. Membangun fondasi stasiun penyiaran 24 jam.',
      legacy: 'Perintis berdirinya FoxSA News & peletak nilai independensi media.',
      authorName: 'Messiah Dillard'
    },
    {
      id: 'catherine',
      name: 'Catherine Cecillie',
      formerRole: 'Former Chief Executive Officer (CEO)',
      category: 'leadership',
      badge: 'Former CEO',
      period: '2025 – 2026',
      avatar: 'assets/logo/foxsa-icon.jpg',
      bio: 'Mantan CEO yang memimpin era ekspansi jaringan siaran televisi kabel, transformasi studio digital, serta perintisan 3 ekosistem utama penyiaran FoxSA News Network.',
      legacy: 'Memimpin ekspansi siaran kabel, modernisasi newsroom, dan regenerasi talenta.',
      authorName: 'Catherine Cecilie'
    },
    {
      id: 'boniface',
      name: 'Boniface Ernest',
      formerRole: 'Former Vice CEO & Board of Directors',
      category: 'leadership',
      badge: 'Former Vice CEO',
      period: '2025 – 2026',
      avatar: 'assets/logo/foxsa-icon.jpg',
      bio: 'Mantan Wakil CEO yang mengawal efektivitas tata kelola manajemen eksekutif, koordinasi lintas departemen, dan kemitraan strategis perusahaan di San Andreas.',
      legacy: 'Penguatan struktur internal dan tata kelola operasional eksekutif.',
      authorName: 'Boniface Ernest'
    },
    {
      id: 'marshall',
      name: 'Marshall Swiss',
      formerRole: 'Former Executive Director',
      category: 'leadership',
      badge: 'Former Executive Director',
      period: '2025 – 2026',
      avatar: 'assets/logo/foxsa-icon.jpg',
      bio: 'Anggota Dewan Direksi kehormatan yang menanamkan budaya kerja kekeluargaan yang solid, etika komunikasi, dan profesionalisme di FoxSA News.',
      legacy: 'Pembangun kultur kekeluargaan para pencerita (family of storytellers).',
      authorName: 'Marshall Swiss'
    },
    {
      id: 'jesus',
      name: 'Jesus Conway',
      formerRole: 'Former Command / Senior Crime Supervisor',
      category: 'management',
      badge: 'Former Command FoxSA',
      period: '2025 – 2026',
      avatar: 'assets/logo/foxsa-icon.jpg',
      bio: 'Pimpinan operasional & koresponden kriminal legendaris yang memimpin liputan investigasi berisiko tinggi bersama LSPD dan penegak hukum di Los Santos.',
      legacy: 'Pelopor liputan kriminal investigatif dan koordinasi lapangan tangguh.',
      authorName: 'Jesus Conway'
    },
    {
      id: 'jeremiah',
      name: 'Jeremiah Howell',
      formerRole: 'Former Event Manager & Chief Analyst',
      category: 'management',
      badge: 'Former Event Manager',
      period: '2025 – 2026',
      avatar: 'assets/logo/foxsa-icon.jpg',
      bio: 'Manajer liputan event besar dan analis utama olahraga bermotor yang memelopori liputan San Andreas Motorsport Championship.',
      legacy: 'Liputan kejuaraan balap San Andreas & siaran langsung event kota.',
      authorName: 'Jeremiah Howell'
    },
    {
      id: 'nayeon',
      name: 'Nayeon Park',
      formerRole: 'Former HRD Manager',
      category: 'management',
      badge: 'Former HRD Manager',
      period: '2025 – 2026',
      avatar: 'assets/logo/foxsa-icon.jpg',
      bio: 'Manajer HRD pertama yang menyusun kerangka rekrutmen resmi, standardisasi kualifikasi kru, serta pembinaan awal FoxSA Academy.',
      legacy: 'Standardisasi proses rekrutmen dan tata tertib anggota redaksi.',
      authorName: 'Nayeon Park'
    },
    {
      id: 'clarissa',
      name: 'Clarissa Vencant',
      formerRole: 'Former Senior Editor & Supervisor',
      category: 'supervisor',
      badge: 'Former Senior Editor',
      period: '2025 – 2026',
      avatar: 'assets/logo/foxsa-icon.jpg',
      bio: 'Supervisor redaksi yang mengawal kualitas bahasa, akurasi fakta, serta pembimbingan jurnalis muda dalam penulisan artikel harian.',
      legacy: 'Standar penyuntingan berita berimbang, tajam, dan akurat.',
      authorName: 'Clarissa Vencant'
    },
    {
      id: 'franklin',
      name: 'Franklin Baxter',
      formerRole: 'Former HR Supervisor',
      category: 'supervisor',
      badge: 'Former HR Supervisor',
      period: '2025 – 2026',
      avatar: 'assets/logo/foxsa-icon.jpg',
      bio: 'Supervisor HRD yang mendampingi program orientasi, pelatihan siaran, serta kesiapan mental kru jurnalis baru di lapangan.',
      legacy: 'Pengembangan kurikulum pelatihan jurnalis lapangan FoxSA.',
      authorName: 'Franklin Baxter'
    },
    {
      id: 'bryan',
      name: 'Bryan Andregaz',
      formerRole: 'Former Senior Field Reporter',
      category: 'staff',
      badge: 'Former Field Reporter',
      period: '2025 – 2026',
      avatar: 'assets/logo/foxsa-icon.jpg',
      bio: 'Jurnalis lapangan tanggap darurat yang kerap hadir pertama di lokasi kebakaran, operasi penegakan hukum, serta akademi darurat San Andreas.',
      legacy: 'Liputan sigap dari garis depan peristiwa darurat Los Santos.',
      authorName: 'Bryan Andregaz'
    },
    {
      id: 'shen',
      name: 'Shen Xander',
      formerRole: 'Former Staff Journalist',
      category: 'staff',
      badge: 'Former Journalist',
      period: '2025 – 2026',
      avatar: 'assets/logo/foxsa-icon.jpg',
      bio: 'Jurnalis harian yang berkontribusi aktif meliput dinamika sosial masyarakat, komunitas warga, dan dokumentasi peristiwa perkotaan.',
      legacy: 'Laporan jurnalisme warga dan dokumentasi kehidupan kota.',
      authorName: 'Shen Xander'
    }
  ];

  // Helper: Check if an avatar is a real custom uploaded/provided photo (not a placeholder)
  function isCustomAvatar(url) {
    if (!url || typeof url !== 'string') return false;
    const clean = url.trim();
    if (!clean) return false;
    if (clean.includes('VuOLn-mL7PI') || clean.includes('avatar.png') || clean.includes('avatar.jpg')) return false;
    if (clean === 'assets/logo/foxsa-icon.jpg') return false;
    return true;
  }

  // Helper: Find connected account in state.data.staffAccounts
  function findStaffAccountForMember(memberOrName) {
    const accounts = (state.data && state.data.staffAccounts) || [];
    if (!memberOrName) return null;
    const id = typeof memberOrName === 'string' ? memberOrName : (memberOrName.id || memberOrName.username);
    const name = typeof memberOrName === 'string' ? memberOrName : (memberOrName.name || memberOrName.displayName || memberOrName.authorName);

    if (id) {
      const cleanId = String(id).toLowerCase().trim();
      const byUser = accounts.find(a => (a.username || '').toLowerCase().trim() === cleanId);
      if (byUser) return byUser;
    }
    if (name) {
      const cleanName = String(name).toLowerCase().trim();
      const byName = accounts.find(a => 
        ((a.authorName || '').toLowerCase().trim() === cleanName) ||
        ((a.displayName || '').toLowerCase().trim() === cleanName)
      );
      if (byName) return byName;
    }
    return null;
  }

  // Helper: Dynamic data resolution linking team member to account photo, bio, quote & discord
  function getMemberEffectiveData(m, idx = 0) {
    const acc = findStaffAccountForMember(m);
    const authorsMap = (state.data && state.data.authors) || {};
    const authorObj = (m.name && authorsMap[m.name]) || (acc && acc.authorName && authorsMap[acc.authorName]) || {};

    let avatar = '';

    // Check account avatar first (only if it's a real custom uploaded photo)
    if (acc && isCustomAvatar(acc.avatar)) {
      avatar = acc.avatar.trim();
    } else if (authorObj && isCustomAvatar(authorObj.avatar)) {
      avatar = authorObj.avatar.trim();
    } else if (m && isCustomAvatar(m.avatar)) {
      avatar = m.avatar.trim();
    }

    // If no custom photo has been uploaded, use the previous default SVG avatars (Executive character for BOC, Suit variations for others)
    if (!avatar) {
      avatar = (m.dept === 'boc' || (m.role && m.role.toLowerCase().includes('commissioner')))
        ? getCommissionerAvatarSvg()
        : getDefaultTeamAvatarSvg(idx);
    }
    const bio = (acc && acc.bio && acc.bio.trim()) || m.bio || authorObj.bio || '';
    const quote = (acc && acc.quote && acc.quote.trim()) || (LEADER_QUOTES[m.id]) || '';
    const role = (acc && acc.role) || m.role || '';
    const name = (acc && acc.displayName) || m.name || '';

    return {
      ...m,
      name,
      role,
      avatar,
      bio,
      quote,
      account: acc
    };
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
      bio: 'Line Producer pada Supervisor Team yang mengoordinasikan eksekusi teknis produksi siaran harian, alur kerja liputan lapangan, serta kelancaran jadwal program berita.'
    },
    {
      id: 'steven',
      name: 'Steven Deluca',
      role: 'Journalism Intern',
      badge: 'Operational Staff',
      dept: 'staff',
      featured: false,
      bio: 'Journalism Intern pada Operational Staff yang aktif membantu riset lapangan, peliputan peristiwa aktual, serta dokumentasi berita di kawasan Los Santos.'
    }
  ];


  // =========================================================================
  // DYNAMIC TEAM STRUCTURE & ROSTER TIERS RESOLUTION
  // =========================================================================
  const OFFICIAL_ROSTER_TIERS = [
    {
      tierKey: 'boc',
      tierName: 'BOARD OF COMMISSIONERS',
      pillClass: 'red',
      pillText: 'Supervisory Council',
      icon: 'fa-crown',
      slots: [
        {
          num: '',
          title: 'Board of Commissioners',
          matchRoles: ['board of commissioners', 'commissioner'],
        }
      ]
    },
    {
      tierKey: 'bod',
      tierName: 'BOARD OF DIRECTORS',
      pillClass: 'purple',
      pillText: 'Executive Leadership',
      icon: 'fa-shield-halved',
      slots: [
        { num: '01', title: 'Chief Executive Officer', matchRoles: ['chief executive officer', 'ceo'], },
        { num: '02', title: 'Chief Operational Officer', matchRoles: ['chief operational officer', 'chief operating officer', 'coo'] },
        { num: '03', title: 'Vice President', matchRoles: ['vice president', 'vp'] }
      ]
    },
    {
      tierKey: 'management',
      tierName: 'OPERATIONAL MANAGEMENT',
      pillClass: 'blue',
      pillText: 'Department Leads',
      icon: 'fa-briefcase',
      slots: [
        { num: '04', title: 'General Manager', matchRoles: ['general manager', 'gm'] },
        { num: '05', title: 'Executive Producer', matchRoles: ['executive producer'] }
      ]
    },
    {
      tierKey: 'supervisor',
      tierName: 'SUPERVISOR TEAM',
      pillClass: 'teal',
      pillText: 'Field & Production Leads',
      icon: 'fa-clapperboard',
      slots: [
        { num: '06', title: 'Managing Editor', matchRoles: ['managing editor'] },
        { num: '07', title: 'Senior Producer', matchRoles: ['senior producer'] },
        { num: '08', title: 'Line Producer', matchRoles: ['line producer'], }
      ]
    },
    {
      tierKey: 'staff',
      tierName: 'OPERATIONAL STAFF',
      pillClass: 'green',
      pillText: 'Newsroom & Field Journalists',
      icon: 'fa-microphone-lines',
      slots: [
        { num: '09', title: 'Head Reporter', matchRoles: ['head reporter'] },
        { num: '10', title: 'Senior Reporter', matchRoles: ['senior reporter'] },
        { num: '11', title: 'Staff Reporter', matchRoles: ['staff reporter'] },
        { num: '12', title: 'Junior Reporter', matchRoles: ['junior reporter'] },
        { num: '13', title: 'Journalism Intern', matchRoles: ['journalism intern', 'intern'], allowMultiple: true }
      ]
    }
  ];

  function getActiveTeamMembersFromAccounts() {
    const accounts = (state.data && state.data.staffAccounts) || [];
    const authorsMap = (state.data && state.data.authors) || {};

    const hasArthur = accounts.some(a => a.username === 'arthur' && a.status === 'approved' && !a.isFormer);
    const activeStaff = accounts.filter(a => {
      if (a.status !== 'approved' && a.status !== undefined && a.approved === false) return false;
      if (a.isFormer) return false;
      if (a.username === 'admin' && hasArthur) return false;
      return true;
    });

    // Strictly deduplicate by normalized person name so Reinhardt Harrison never appears twice
    const seenNames = new Set();
    const uniqueActiveStaff = [];
    for (const acc of activeStaff) {
      const normName = String(acc.displayName || acc.authorName || acc.username).toLowerCase().trim();
      if (!seenNames.has(normName)) {
        seenNames.add(normName);
        uniqueActiveStaff.push(acc);
      }
    }

    return uniqueActiveStaff.map((acc, idx) => {
      const authorObj = (acc.authorName && authorsMap[acc.authorName]) || {};
      const rInfo = getRoleInfo(acc.role);

      let dept = 'staff';
      const cleanRole = (acc.role || '').toLowerCase();
      if (cleanRole.includes('commissioner')) dept = 'boc';
      else if (cleanRole.includes('chief') || cleanRole.includes('president') || cleanRole.includes('director')) dept = 'bod';
      else if (cleanRole.includes('manager') || cleanRole.includes('executive producer')) dept = 'management';
      else if (cleanRole.includes('producer') || cleanRole.includes('editor')) dept = 'supervisor';
      else dept = 'staff';

      let avatar = '';
      if (acc.avatar && isCustomAvatar(acc.avatar)) {
        avatar = acc.avatar.trim();
      } else if (authorObj.avatar && isCustomAvatar(authorObj.avatar)) {
        avatar = authorObj.avatar.trim();
      } else {
        avatar = (dept === 'boc') ? getCommissionerAvatarSvg() : getRandomExecutiveAvatarSvg(idx);
      }

      return {
        id: acc.username,
        username: acc.username,
        name: acc.displayName || acc.authorName || acc.username,
        role: acc.role || 'Staff Redaksi',
        dept,
        badge: rInfo.name,
        avatar,
        bio: acc.bio || authorObj.bio || 'Staf redaksi FoxSA News Agency dengan integritas jurnalisme tinggi.',
        quote: acc.quote || (LEADER_QUOTES[acc.username] || 'Menyajikan informasi akurat dan kredibel untuk masyarakat San Andreas.'),
        account: acc
      };
    });
  }

  function formatChatTime(dateStr) {
    if (!dateStr) return '';
    try {
      const d = new Date(dateStr);
      if (isNaN(d.getTime())) return '';
      const now = new Date();
      const isToday = d.toDateString() === now.toDateString();
      const timeStr = d.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }).replace('.', ':');
      if (isToday) return `Hari ini, ${timeStr}`;
      const day = d.getDate();
      const month = MONTHS_ID[d.getMonth()] ? MONTHS_ID[d.getMonth()].slice(0, 3) : '';
      return `${day} ${month}, ${timeStr}`;
    } catch (e) {
      return '';
    }
  }

  function renderProfileView(subtab) {
    document.body.className = 'item';
    const mainEl = document.getElementById('main');
    if (!mainEl) return;

    const validTabs = ['overview', 'former-staff', 'alumni', 'divisions', 'recruitment'];
    const activeTab = validTabs.includes(subtab) ? subtab : 'overview';

    let bodyHtml = '';

    // =========================================================================
    // TAB 1: OVERVIEW & ACTIVE TEAM SHOWCASE
    // =========================================================================
    if (activeTab === 'overview') {
      const allActiveStaff = getActiveTeamMembersFromAccounts();
      const leaders = allActiveStaff.filter(m => m.dept === 'boc' || m.dept === 'bod');
      const crewMembers = allActiveStaff.filter(m => m.dept !== 'boc' && m.dept !== 'bod');

      bodyHtml = `
        <div class="foxsa-profile-section">
          <div class="foxsa-profile-intro-grid">
            <div class="foxsa-profile-about-text">
              <span class="foxsa-profile-kicker"><i class="fa-solid fa-shield-halved"></i> TENTANG PERUSAHAAN</span>
              <h3>Jaringan Media Berita, Televisi &amp; Radio Independen di San Andreas</h3>
              <p>
                <strong>FoxSA News</strong> adalah jaringan televisi kabel dan portal berita 24 jam di San Andreas yang dikenal karena pengaruh besarnya terhadap liputan politik, opini publik, penegakan hukum, motorsport, dan peristiwa nasional. FoxSA News resmi diluncurkan pada <strong>17 November 2025</strong> dengan <strong>Messiah Dillard</strong> sebagai CEO pertama, dan kini dipimpin oleh <strong>Arthur Redfields</strong> selaku <em>Chief Executive Officer (CEO)</em> bersama <strong>Reinhardt Harrison</strong> selaku <em>Board of Commissioners</em>.
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

          <!-- ==================== MEET OUR TEAM ==================== -->
          <div class="foxsa-meet-team-wrap" id="foxsa-meet-team-section">
            <div class="meet-team-top-heading">
              <h2>Meet Our <span class="team-underline">Team</span></h2>
              <p>Mengenal lebih dekat jajaran Dewan Komisaris, Dewan Direksi, tim manajemen operasional, supervisor, dan kru redaksi FoxSA News Agency yang terhubung langsung dengan akun sistem.</p>
            </div>

            <!-- 1. LEADERSHIP MEMBER SHOWCASE (JAL "MEMBER" Style) -->
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
                ${leaders.map(m => `
                  <article class="leader-member-card ${m.dept === 'boc' ? 'is-commissioner' : ''}" data-leader-id="${escapeHtml(m.id)}" tabindex="0" role="button" aria-label="Lihat profil ${escapeHtml(m.name)}">
                    <div class="leader-member-photo">
                      <img src="${m.avatar}" alt="${escapeHtml(m.name)}" loading="lazy" onerror="this.src='assets/logo/foxsa-icon.jpg'" />
                      <span class="leader-member-tag">${m.dept === 'boc' ? '<i class="fa-solid fa-crown"></i> ' : ''}${escapeHtml(m.dept === 'boc' ? 'Board of Commissioners' : m.role)}</span>
                    </div>
                    <div class="leader-member-info">
                      <p class="leader-member-quote">${escapeHtml(m.quote || m.bio || '')}</p>
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

            <!-- 2. Operational Management, Supervisor Team & Operational Staff Carousel -->
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
                  ${crewMembers.map(member => `
                    <div class="meet-member-card" data-member-id="${escapeHtml(member.id)}">
                      <div class="meet-member-photo-box">
                        <span class="meet-floating-role-pill">${escapeHtml(member.role)}</span>
                        <img src="${member.avatar}" alt="${escapeHtml(member.name)}" loading="lazy" onerror="this.src='assets/logo/foxsa-icon.jpg'" />
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
            </div>

            <!-- 3. OFFICIAL MEMBER ROSTER (COMPREHENSIVE 13 TIERS WITH CONNECTED PHOTOS) -->
            <div class="foxsa-roster-board">
              <div class="roster-board-header">
                <div class="roster-header-brand">
                  <div class="roster-badge"><i class="fa-solid fa-microphone-lines"></i> FOXSA NEWS AGENCY</div>
                  <h3>OFFICIAL MEMBER ROSTER</h3>
                  <p class="roster-motto">“Accurate Information. Professional Journalism. Trusted by San Andreas.”</p>
                </div>
                <div class="roster-header-meta">
                  <span class="roster-tag"><i class="fa-solid fa-calendar-check"></i> Active Period 2026</span>
                  <span class="roster-tag"><i class="fa-solid fa-users-gear"></i> Connected Accounts</span>
                </div>
              </div>

              <div class="roster-tier-list">
                ${isHighStaff(state.currentUser) ? `
                  <div class="roster-admin-manage-bar" style="margin-bottom:18px;background:rgba(240,141,57,0.08);border:1px dashed #F08D39;border-radius:10px;padding:10px 16px;display:flex;align-items:center;justify-content:space-between;flex-wrap:wrap;gap:10px;">
                    <span style="font-size:12.5px;color:#9a3412;">
                      <i class="fa-solid fa-user-shield" style="color:#ea580c;"></i>
                      <strong>Mode High Staff:</strong> Posisi kosong di bawah ini otomatis terisi saat anggota mendaftar/di-ACC dan diberi role di Panel Admin.
                    </span>
                    <a href="#/admin" class="foxsa-btn" style="padding:5px 12px;font-size:12px;text-decoration:none;">
                      <i class="fa-solid fa-users-gear"></i> Kelola Struktur &amp; Akun Staf
                    </a>
                  </div>
                ` : ''}

                ${OFFICIAL_ROSTER_TIERS.map(tier => {
                  return `
                    <div class="roster-tier-block tier-${tier.tierKey}">
                      <div class="roster-tier-label">
                        <span class="tier-icon"><i class="fa-solid ${tier.icon}"></i></span>
                        <h4>${tier.tierName}</h4>
                        <span class="tier-pill ${tier.pillClass}">${tier.pillText}</span>
                      </div>
                      <div class="roster-tier-grid">
                        ${tier.slots.map(slot => {
                          const matchedMembers = allActiveStaff.filter(m => {
                            const cleanR = (m.role || '').toLowerCase();
                            return slot.matchRoles.some(mr => cleanR.includes(mr));
                          });

                          if (matchedMembers.length > 0) {
                            return matchedMembers.map(member => `
                              <div class="roster-card active">
                                <div class="roster-card-head">
                                  ${slot.num ? `<span class="roster-pos-num">${slot.num}</span>` : ''}
                                  <span class="roster-pos-title">${escapeHtml(slot.title)}</span>
                                  <span class="roster-status-badge active"><i class="fa-solid fa-circle-check"></i> Active</span>
                                </div>
                                <div class="roster-officer-row">
                                  <div class="roster-avatar-box">
                                    <img src="${member.avatar}" alt="${escapeHtml(member.name)}" onerror="this.src='assets/logo/foxsa-icon.jpg'" />
                                  </div>
                                  <div class="roster-officer-info">
                                    <div class="roster-officer-name">${escapeHtml(member.name)}</div>
                                    
                                  </div>
                                </div>
                              </div>
                            `).join('');
                          } else {
                            return `
                              <div class="roster-card vacant">
                                <div class="roster-card-head">
                                  ${slot.num ? `<span class="roster-pos-num">${slot.num}</span>` : ''}
                                  <span class="roster-pos-title">${escapeHtml(slot.title)}</span>
                                  <span class="roster-status-badge vacant">VACANT</span>
                                </div>
                                <div class="roster-officer-name vacant">— Belum Terisi —</div>
                                <div class="roster-vacant-note">Posisi Terbuka untuk Promosi / Pendaftaran</div>
                              </div>
                            `;
                          }
                        }).join('')}
                      </div>
                    </div>
                  `;
                }).join('')}
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

            <!-- 4. FORMER STAFF TEASER BANNER (HALL OF FAME TEASER) -->
            <div class="foxsa-former-teaser-banner">
              <div class="former-teaser-left">
                <div class="former-teaser-badge"><i class="fa-solid fa-medal"></i> FOXSA HALL OF FAME</div>
                <h3>Purna Tugas &amp; Penghormatan Former Staff FoxSA</h3>
                <p>Apresiasi setinggi-tingginya bagi para pendiri, mantan pimpinan eksekutif, serta jurnalis yang telah meletakkan fondasi dan mendedikasikan karyanya untuk FoxSA News Agency di San Andreas.</p>
                <div class="former-teaser-pills">
                  <span class="former-mini-pill"><strong>Messiah Dillard</strong> (Founder &amp; 1st CEO)</span>
                  <span class="former-mini-pill"><strong>Catherine Cecillie</strong> (Former CEO)</span>
                  <span class="former-mini-pill"><strong>Boniface Ernest</strong> (Former Vice CEO)</span>
                  <span class="former-mini-pill"><strong>Marshall Swiss</strong> (Former Director)</span>
                  <span class="former-mini-pill"><strong>Jesus Conway</strong> (Former Command)</span>
                </div>
              </div>
              <div class="former-teaser-right">
                <a href="#/profile/former-staff" class="former-teaser-btn">
                  <i class="fa-solid fa-arrow-right"></i> Buka Galeri Lengkap Former Staff &rarr;
                </a>
              </div>
            </div>

          </div>
        </div>
      `;
    }

    // =========================================================================
    // TAB: FORMER STAFF & ALUMNI (BAGIAN KHUSUS FORMER STAFF FOXSA)
    // =========================================================================
    else if (activeTab === 'former-staff' || activeTab === 'alumni') {
      const formerList = (state.data && Array.isArray(state.data.formerStaff) && state.data.formerStaff.length > 0)
        ? state.data.formerStaff
        : FOXSA_FORMER_STAFF;
      const leadershipFormer = formerList.filter(f => f.category === 'leadership');
      const mgmtFormer = formerList.filter(f => f.category === 'management' || f.category === 'supervisor');
      const staffFormer = formerList.filter(f => f.category === 'staff');

      bodyHtml = `
        <div class="foxsa-profile-section">
          <!-- Alumni Hero Header -->
          <div class="foxsa-alumni-hero">
            <div class="alumni-hero-badge"><i class="fa-solid fa-medal"></i> FOXSA NEWS HALL OF FAME • HONORARY ALUMNI</div>
            <h2>Jajaran Purna Tugas &amp; Former Staff FoxSA News</h2>
            <p class="alumni-hero-lead">
              Penghormatan dan apresiasi setinggi-tingginya bagi para pendiri, mantan pimpinan eksekutif, manajer, supervisor, dan staf jurnalis yang telah menorehkan karya jurnalistik terbaik di San Andreas. Terima kasih atas dedikasi, integritas, dan semangat kekeluargaan yang telah kalian wariskan bagi FoxSA News Agency.
            </p>
            <div class="alumni-stats-bar">
              <span class="alumni-stat"><i class="fa-solid fa-users"></i> <strong>${formerList.length}</strong> Tokoh Kehormatan</span>
              <span class="alumni-stat"><i class="fa-solid fa-calendar-check"></i> <strong>Sejak 2025</strong> Jejak Sejarah</span>
              <span class="alumni-stat"><i class="fa-solid fa-newspaper"></i> <strong>Arsip Liputan</strong> Tetap Tersimpan</span>
            </div>
          </div>

          <!-- Category 1: Founder & Leadership Alumni -->
          <div class="alumni-category-section">
            <div class="alumni-category-title-bar">
              <div class="alumni-cat-icon gold"><i class="fa-solid fa-crown"></i></div>
              <div>
                <h3>Dewan Pendiri &amp; Mantan Pimpinan Eksekutif</h3>
                <p>Tokoh pilar yang mendirikan FoxSA News, mengarahkan visi independensi, dan memimpin era transformasi penyiaran 24 jam di San Andreas.</p>
              </div>
            </div>

            <div class="alumni-cards-grid">
              ${leadershipFormer.map((f, i) => {
                const fAvatar = isCustomAvatar(f.avatar) ? f.avatar : getDefaultTeamAvatarSvg(i);
                return `
                <div class="alumni-card gold-border">
                  <div class="alumni-card-head">
                    <div class="alumni-photo-box">
                      <img src="${fAvatar}" alt="${escapeHtml(f.name)}" onerror="this.src=getDefaultTeamAvatarSvg(0)" />
                    </div>
                    <div class="alumni-head-info">
                      <span class="alumni-role-tag gold"><i class="fa-solid fa-award"></i> ${escapeHtml(f.badge)}</span>
                      <h4>${escapeHtml(f.name)}</h4>
                      <span class="alumni-period"><i class="fa-regular fa-calendar"></i> ${escapeHtml(f.period)}</span>
                    </div>
                  </div>
                  <div class="alumni-card-body">
                    <div class="alumni-legacy-quote">
                      <i class="fa-solid fa-quote-left"></i>
                      <span>${escapeHtml(f.legacy)}</span>
                    </div>
                    <p class="alumni-bio">${escapeHtml(f.bio)}</p>
                    <div class="alumni-card-actions">
                      <a href="#/author/${encodeURIComponent(f.authorName)}" class="alumni-author-btn">
                        <i class="fa-solid fa-newspaper"></i> Arsip Berita Karya ${escapeHtml(f.name.split(' ')[0])}
                      </a>
                    </div>
                  </div>
                </div>
              `;
              }).join('')}
            </div>
          </div>

          <!-- Category 2: Management & Editorial Supervisors Alumni -->
          <div class="alumni-category-section" style="margin-top:36px;">
            <div class="alumni-category-title-bar">
              <div class="alumni-cat-icon blue"><i class="fa-solid fa-briefcase"></i></div>
              <div>
                <h3>Mantan Tim Manajemen &amp; Supervisor Redaksi</h3>
                <p>Para pengawal mutu siaran harian, manajer rekrutmen, koresponden kriminal investigatif, dan penggerak liputan kejuaraan motorsport.</p>
              </div>
            </div>

            <div class="alumni-cards-grid">
              ${mgmtFormer.map((f, i) => {
                const fAvatar = isCustomAvatar(f.avatar) ? f.avatar : getDefaultTeamAvatarSvg(i + 1);
                return `
                <div class="alumni-card blue-border">
                  <div class="alumni-card-head">
                    <div class="alumni-photo-box">
                      <img src="${fAvatar}" alt="${escapeHtml(f.name)}" onerror="this.src=getDefaultTeamAvatarSvg(1)" />
                    </div>
                    <div class="alumni-head-info">
                      <span class="alumni-role-tag blue">${escapeHtml(f.badge)}</span>
                      <h4>${escapeHtml(f.name)}</h4>
                      <span class="alumni-period"><i class="fa-regular fa-calendar"></i> ${escapeHtml(f.period)}</span>
                    </div>
                  </div>
                  <div class="alumni-card-body">
                    <div class="alumni-legacy-quote">
                      <i class="fa-solid fa-quote-left"></i>
                      <span>${escapeHtml(f.legacy)}</span>
                    </div>
                    <p class="alumni-bio">${escapeHtml(f.bio)}</p>
                    <div class="alumni-card-actions">
                      <a href="#/author/${encodeURIComponent(f.authorName)}" class="alumni-author-btn">
                        <i class="fa-solid fa-newspaper"></i> Arsip Berita Karya ${escapeHtml(f.name.split(' ')[0])}
                      </a>
                    </div>
                  </div>
                </div>
              `;
              }).join('')}
            </div>
          </div>

          <!-- Category 3: Former Operational Staff & Field Reporters -->
          <div class="alumni-category-section" style="margin-top:36px;">
            <div class="alumni-category-title-bar">
              <div class="alumni-cat-icon green"><i class="fa-solid fa-microphone"></i></div>
              <div>
                <h3>Mantan Jurnalis Lapangan &amp; Kru Redaksi</h3>
                <p>Reporter lapangan yang bertugas sigap di garis depan peristiwa darurat, dinamika warga perkotaan, dan dokumentasi visual Los Santos.</p>
              </div>
            </div>

            <div class="alumni-cards-grid">
              ${staffFormer.map((f, i) => {
                const fAvatar = isCustomAvatar(f.avatar) ? f.avatar : getDefaultTeamAvatarSvg(i + 2);
                return `
                <div class="alumni-card green-border">
                  <div class="alumni-card-head">
                    <div class="alumni-photo-box">
                      <img src="${fAvatar}" alt="${escapeHtml(f.name)}" onerror="this.src=getDefaultTeamAvatarSvg(2)" />
                    </div>
                    <div class="alumni-head-info">
                      <span class="alumni-role-tag green">${escapeHtml(f.badge)}</span>
                      <h4>${escapeHtml(f.name)}</h4>
                      <span class="alumni-period"><i class="fa-regular fa-calendar"></i> ${escapeHtml(f.period)}</span>
                    </div>
                  </div>
                  <div class="alumni-card-body">
                    <div class="alumni-legacy-quote">
                      <i class="fa-solid fa-quote-left"></i>
                      <span>${escapeHtml(f.legacy)}</span>
                    </div>
                    <p class="alumni-bio">${escapeHtml(f.bio)}</p>
                    <div class="alumni-card-actions">
                      <a href="#/author/${encodeURIComponent(f.authorName)}" class="alumni-author-btn">
                        <i class="fa-solid fa-newspaper"></i> Arsip Berita Karya ${escapeHtml(f.name.split(' ')[0])}
                      </a>
                    </div>
                  </div>
                </div>
              `;
              }).join('')}
            </div>
          </div>

          <!-- Alumni Footer Back to Active Team -->
          <div class="alumni-footer-banner">
            <div class="alumni-footer-text">
              <strong>Ingin melihat jajaran tim aktif periode 2026?</strong>
              <p>Lihat struktur Dewan Komisaris, CEO, Line Producer, dan kru operasional saat ini.</p>
            </div>
            <a href="#/profile" class="foxsa-btn foxsa-btn-primary">
              <i class="fa-solid fa-users"></i> Buka Struktur Tim Aktif 2026
            </a>
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
                  Saluran radio suara dan siniar (<em>podcast</em>) interaktif FoxSA. Menyajikan segmen talkshow bersama tokoh masyarakat, pembaruan lalu lintas kota, serta akademi penyiaran suara bagi talenta reporter muda di San Andreas.
                </p>
                <ul class="division-features">
                  <li><i class="fa-solid fa-circle-check"></i> Talkshow Tokoh Publik &amp; Dialog Warga</li>
                  <li><i class="fa-solid fa-circle-check"></i> Pembaruan Kondisi Lalu Lintas &amp; Cuaca</li>
                  <li><i class="fa-solid fa-circle-check"></i> Siniar Investigasi Khusus &amp; Wawancara Eksklusif</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      `;
    }

    // TAB 4: OPEN RECRUITMENT
    else if (activeTab === 'recruitment') {
      bodyHtml = `
        <div class="foxsa-profile-section">
          <!-- Recruitment Top Banner -->
          <div class="foxsa-recruitment-hero">
            <div class="rec-hero-kicker"><i class="fa-solid fa-bullhorn"></i> OFFICIAL OPEN RECRUITMENT</div>
            <h2>We’re Hiring: Join the FoxSA Family!</h2>
            <p class="rec-hero-lead">Accurate Information. Professional Journalism. Trusted by San Andreas.</p>
            <div class="rec-hero-badge-row">
              <span class="rec-status-pill open"><i class="fa-solid fa-circle-check"></i> Status: OPEN!</span>
              <span class="rec-meta-pill"><i class="fa-regular fa-clock"></i> No Deadline • Open Until Crew Complete</span>
              <span class="rec-meta-pill"><i class="fa-brands fa-discord"></i> Fast Track via Discord Hub</span>
            </div>
          </div>

          <div class="foxsa-recruitment-grid">
            <!-- Left Column: Details -->
            <div class="foxsa-rec-details-col">
              <div class="rec-detail-block">
                <h3><i class="fa-solid fa-handshake-angle"></i> Welcome to FoxSA News!</h3>
                <p>
                  At <strong>FoxSA News</strong>, we believe that great stories come from great people. We are not just a news network; we are a family of storytellers, journalists, and media enthusiasts dedicated to keeping San Andreas informed with <em>Integrity, Accuracy, and Professionalism</em>.
                </p>
                <p>
                  As we step into a new chapter of growth, we are looking for passionate, driven, and reliable individuals to join our ranks. Whether you are an experienced journalist or someone looking to break into the media industry, there’s a place for you in our newsroom!
                </p>
              </div>

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

              <!-- Next Steps to Join -->
              <div class="rec-detail-block highlight-next-steps">
                <h3><i class="fa-solid fa-compass"></i> Next Steps to Join</h3>
                <p>
                  No lengthy paperwork required! Simply hop into our communication hub, get to know the crew, and connect with our Executive Board.
                </p>

                <div class="rec-official-links-box">
                  <a href="https://discord.gg/rVeaKGzhyy" target="_blank" rel="noopener" class="rec-link-card discord-card">
                    <i class="fa-brands fa-discord"></i>
                    <div>
                      <small>🔗 Official Discord Hub</small>
                      <strong>discord.gg/rVeaKGzhyy</strong>
                    </div>
                  </a>
                  <a href="login.html?tab=register" class="rec-link-card web-card">
                    <i class="fa-solid fa-id-card"></i>
                    <div>
                      <small>📝 Anggota Baru?</small>
                      <strong>Registrasi Akun Anggota &rarr;</strong>
                    </div>
                  </a>
                </div>
              </div>
            </div>

            <!-- Right Column: Official Poster -->
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
              <p class="profile-hero-tagline">Portal Informasi Resmi, Jajaran Pimpinan &amp; Tim Redaksi, Galeri Former Staff, Divisi Penyiaran, Program Pengembangan &amp; Rekrutmen FoxSA News Agency.</p>
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
          <a href="#/profile/former-staff" class="foxsa-profile-tab ${activeTab === 'former-staff' || activeTab === 'alumni' ? 'is-active' : ''}">
            <i class="fa-solid fa-medal"></i> Former Staff FoxSA
          </a>
          <a href="#/profile/divisions" class="foxsa-profile-tab ${activeTab === 'divisions' ? 'is-active' : ''}">
            <i class="fa-solid fa-tower-broadcast"></i> Divisi Media &amp; Radio
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

    // Bind slider & modal events for profile overview tab
    if (activeTab === 'overview') {
      const leaderModal = document.getElementById('leader-profile-modal');
      const leaderContent = document.getElementById('leader-profile-content');
      const closeLeaderModal = () => {
        if (!leaderModal) return;
        leaderModal.classList.remove('is-open');
        leaderModal.setAttribute('aria-hidden', 'true');
        document.body.classList.remove('leader-modal-open');
      };
      const openLeaderModal = (memberId) => {
        const rawM = FOXSA_TEAM_MEMBERS.find(x => x.id === memberId);
        if (!rawM || !leaderModal || !leaderContent) return;
        const m = getMemberEffectiveData(rawM);
        const isBoc = m.dept === 'boc';
        leaderContent.innerHTML = `
          <div class="leader-profile-grid ${isBoc ? 'is-commissioner' : ''}">
            <div class="leader-profile-photo">
              <img src="${m.avatar}" alt="${escapeHtml(m.name)}" onerror="this.src='assets/logo/foxsa-icon.jpg'" />
              <span class="leader-member-tag">${isBoc ? '<i class="fa-solid fa-crown"></i> Board of Commissioners' : escapeHtml(m.role)}</span>
            </div>
            <div class="leader-profile-body">
              <span class="leader-profile-kicker">${escapeHtml(isBoc ? 'Dewan Komisaris' : 'Dewan Direksi')} • ${escapeHtml(m.badge)}</span>
              <h3>${escapeHtml(m.name)}</h3>
              <p class="leader-profile-role">${escapeHtml(isBoc ? 'President Commissioner' : m.role)}</p>
              
              <blockquote class="leader-profile-quote">“${escapeHtml(m.quote || 'Setiap berita yang terbit harus akurat, tajam, dan independen.')}”</blockquote>
              <p class="leader-profile-bio">${escapeHtml(m.bio)}</p>
              <h4>${isBoc ? 'Wewenang &amp; Fokus Pengawasan' : 'Fokus &amp; Tanggung Jawab'}</h4>
              <ul class="leader-profile-list">
                ${(m.highlights || [
                  'Memimpin arah strategis & kebijakan penyiaran FoxSA News Network 24/7',
                  'Menjaga independensi redaksi dan integritas jurnalisme di San Andreas'
                ]).map(h => `<li><i class="fa-solid fa-check"></i><span>${escapeHtml(h)}</span></li>`).join('')}
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

    // Add Staff Portal link at bottom of mobile menu only if logged in
    if (state.currentUser) {
      const staffLi = document.createElement('li');
      staffLi.innerHTML = `<a href="#/admin" class="admin-nav-btn"><i class="fa-solid fa-user-shield"></i> Panel Redaksi (${escapeHtml(state.currentUser.displayName.split(' ')[0])})</a>`;
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
    initSupabaseCloud();
  });

})();
