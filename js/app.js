/**
 * FoxSA News - Main Application Script (HTML/CSS/JS Static & Vercel Ready)
 * Features:
 * - Android-Friendly Responsive UI (Sticky Header, Slide Drawer, Category Bar)
 * - Smart Category System: Scrollable Pills + Dropdown Filter (Home) & Multi-Select Chips + Dropdown (Admin)
 * - Protected Staff/Admin Login System (Multi-Staff Accounts + Password Manager)
 * - Interactive Comments System & Full News CRUD
 * - Persistent Storage: LocalStorage + JSON/JS Export-Import + Optional GitHub/Vercel Cloud Sync
 */

(function () {
  'use strict';

  const STORAGE_KEY = 'foxsa_news_data_v1';
  const AUTH_SESSION_KEY = 'foxsa_auth_session_v1';
  const GITHUB_CONFIG_KEY = 'foxsa_github_sync_config';
  const DEFAULT_AVATAR = 'https://4.bp.blogspot.com/-uCjYgVFIh70/VuOLn-mL7PI/AAAAAAAADUs/Kcu9wJbv790hIo83rI_s7lLW3zkLY01EA/s100/avatar.png';
  const HASHTAG_ICON = 'https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEhZ8ywHDFxR8Ve6lZmhowku3pgPCU-hcA-fO7LSE1kZcwLd6GrYvwegTY9qU92Pc5d3PqPFV9RtzYDB2k1sUM6sVLMvvZyBxtIo7xgbw64b3_S18fI3guFOUsaeZXGhZh7ThunBaeAkgs5OjJ7G8lN0myppggd5V4mmDirNri0Xkhxc2lW0tmi2kZRHd-_Y/s16000/Hash-tag.png';

  const MONTHS_ID = [
    'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
    'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'
  ];

  // Official preset categories so staff never have to type manually
  const OFFICIAL_CATEGORIES = [
    'Crime',
    'LSPD',
    'Motorsport',
    'Los Santos Event',
    'Government & Emergency Services',
    'FoxSA Overview',
    'Information',
    'Recruitment',
    'Update',
    'Street Race',
    'Traffic Incident'
  ];

  // Default Staff & Admin Accounts
  const DEFAULT_STAFF_ACCOUNTS = [
    {
      username: 'admin',
      password: 'foxsa2026',
      displayName: 'Redaksi Utama (Admin)',
      authorName: 'Arthur Redfields',
      role: 'Chief Editor / Super Admin',
      isAdmin: true,
      avatar: 'https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEg8BFSDlMuk9oQMdt54bGJWdFRjLoRiTGicU3Tbo1g1ROZfwnbnGdEQ_XFe4LCNnan9EzICIdp6nE4pchL0FKgAfrgoxxEivmFrArKlg0yS94xAqXKLdT6pj6qOBvBqnTdBX5Hu1s0oNY64JRerTaU9hV0p6fNkH5bq0arILGTkG4mGS4Y/s200/FoxSA2.png'
    },
    {
      username: 'arthur',
      password: 'arthurfoxsa',
      displayName: 'Arthur Redfields',
      authorName: 'Arthur Redfields',
      role: 'Senior Staff | Field Reporter',
      isAdmin: true,
      avatar: 'https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEiI9O-y-Htw6eF9xJ-2uWw8q2pXp2rK6-A0z-q3U5Y2X_9X1x0h8L3V1p0v2w1g5K9M/s220/Arthur%20PP%201-1.jpg'
    },
    {
      username: 'ligma',
      password: 'ligmafoxsa',
      displayName: 'Ligma Deek',
      authorName: 'Ligma Deek',
      role: 'Executive Staff | Head of Affairs & Analyst',
      isAdmin: true,
      avatar: 'https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEg8BFSDlMuk9oQMdt54bGJWdFRjLoRiTGicU3Tbo1g1ROZfwnbnGdEQ_XFe4LCNnan9EzICIdp6nE4pchL0FKgAfrgoxxEivmFrArKlg0yS94xAqXKLdT6pj6qOBvBqnTdBX5Hu1s0oNY64JRerTaU9hV0p6fNkH5bq0arILGTkG4mGS4Y/s200/FoxSA2.png'
    },
    {
      username: 'clarissa',
      password: 'clarissafoxsa',
      displayName: 'Clarissa Vencant',
      authorName: 'Clarissa Vencant',
      role: 'Senior Staff | Editor',
      isAdmin: false,
      avatar: 'https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEg8BFSDlMuk9oQMdt54bGJWdFRjLoRiTGicU3Tbo1g1ROZfwnbnGdEQ_XFe4LCNnan9EzICIdp6nE4pchL0FKgAfrgoxxEivmFrArKlg0yS94xAqXKLdT6pj6qOBvBqnTdBX5Hu1s0oNY64JRerTaU9hV0p6fNkH5bq0arILGTkG4mGS4Y/s200/FoxSA2.png'
    },
    {
      username: 'shen',
      password: 'shenfoxsa',
      displayName: 'Shen Xander',
      authorName: 'Shen Xander',
      role: 'Junior Staff | Journalist',
      isAdmin: false,
      avatar: 'https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEg8BFSDlMuk9oQMdt54bGJWdFRjLoRiTGicU3Tbo1g1ROZfwnbnGdEQ_XFe4LCNnan9EzICIdp6nE4pchL0FKgAfrgoxxEivmFrArKlg0yS94xAqXKLdT6pj6qOBvBqnTdBX5Hu1s0oNY64JRerTaU9hV0p6fNkH5bq0arILGTkG4mGS4Y/s200/FoxSA2.png'
    }
  ];

  // Application State
  const state = {
    data: null,
    currentUser: null,
    currentRoute: { view: 'home', param: null },
    visiblePostsCount: 5,
    adminTab: 'posts',
    editingPostId: null,
    selectedEditorLabels: [],
    syncInProgress: false
  };

  // =========================================================================
  // 1. DATA & AUTH INITIALIZATION
  // =========================================================================

  function normalizeData(raw) {
    const cloned = JSON.parse(JSON.stringify(raw || window.FOXSA_INITIAL_DATA));
    if (!cloned.siteInfo) cloned.siteInfo = window.FOXSA_INITIAL_DATA.siteInfo;
    if (!cloned.authors) cloned.authors = window.FOXSA_INITIAL_DATA.authors || {};
    if (!Array.isArray(cloned.posts)) cloned.posts = [];
    if (!Array.isArray(cloned.staffAccounts) || cloned.staffAccounts.length === 0) {
      cloned.staffAccounts = JSON.parse(JSON.stringify(DEFAULT_STAFF_ACCOUNTS));
    }

    // Sync avatars from authors object into staffAccounts if available
    cloned.staffAccounts.forEach(acc => {
      const known = cloned.authors[acc.authorName];
      if (known && known.avatar && (!acc.avatar || acc.avatar === DEFAULT_AVATAR)) {
        acc.avatar = known.avatar;
      }
    });

    cloned.posts.forEach(post => {
      if (!Array.isArray(post.labels)) post.labels = [];
      post.labels = post.labels.map(l => String(l).trim()).filter(Boolean);
      if (!Array.isArray(post.comments)) post.comments = [];
      if (!post.authorAvatar) {
        const knownAuthor = cloned.authors[post.author];
        post.authorAvatar = (knownAuthor && knownAuthor.avatar) ? knownAuthor.avatar : DEFAULT_AVATAR;
      }
      if (!post.authorBio) {
        const knownAuthor = cloned.authors[post.author];
        post.authorBio = (knownAuthor && knownAuthor.bio)
          ? knownAuthor.bio
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
    if (!account) return false;
    state.currentUser = account;
    localStorage.setItem(AUTH_SESSION_KEY, JSON.stringify({
      username: account.username,
      loginAt: new Date().toISOString()
    }));
    updateHeaderStaffBadge();
    return true;
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
    if (staffBtn) {
      const labelSpan = staffBtn.querySelector('.staff-btn-label');
      if (state.currentUser) {
        if (labelSpan) labelSpan.textContent = `Panel (${state.currentUser.displayName.split(' ')[0]})`;
        staffBtn.title = `Login sebagai ${state.currentUser.displayName} (${state.currentUser.role})`;
      } else {
        if (labelSpan) labelSpan.textContent = 'Staff Login';
        staffBtn.title = 'Login khusus Redaksi & Staff FoxSA';
      }
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
  // 2. HELPER FUNCTIONS & CATEGORY UTILS
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
    return `${month} ${day}, ${year}`;
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

  function stripHtmlToSnippet(html, maxLen = 135) {
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

    if (action === 'post' && param) return { view: 'post', param };
    if (action === 'label' && param) return { view: 'label', param };
    if (action === 'popular') return { view: 'popular', param: null };
    if (action === 'archive' && param) return { view: 'archive', param };
    if (action === 'author' && param) return { view: 'author', param };
    if (action === 'search') return { view: 'search', param: param || '' };
    if (action === 'admin') return { view: 'admin', param: param || 'posts' };
    return { view: 'home', param: null };
  }

  function handleRouteChange() {
    const prevView = state.currentRoute.view;
    state.currentRoute = parseHash();

    if (state.currentRoute.view !== prevView) {
      state.visiblePostsCount = (state.data && state.data.siteInfo && state.data.siteInfo.postPerPage) || 5;
    }

    document.body.classList.remove('nav-active');
    renderMainView();
    renderWidgets();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  // =========================================================================
  // 4. RENDERING: LIST VIEW + SMART CATEGORY BAR (PILLS + DROPDOWN)
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

  function buildCategoryFilterBarHtml() {
    const { view, param } = state.currentRoute;
    const labelCounts = getLabelCounts();
    const sortedCategories = Object.keys(labelCounts).sort((a, b) => {
      if (labelCounts[b] !== labelCounts[a]) return labelCounts[b] - labelCounts[a];
      return a.localeCompare(b);
    });

    const isHome = view === 'home';
    const isPopular = view === 'popular';
    const activeLabelLower = view === 'label' && param ? param.trim().toLowerCase() : '';

    const pillsHtml = [
      `<a href="#/" class="foxsa-cat-pill ${isHome ? 'active' : ''}">
         <i class="fa-solid fa-newspaper"></i> Semua <span class="pill-count">${state.data.posts.length}</span>
       </a>`,
      `<a href="#/popular" class="foxsa-cat-pill ${isPopular ? 'active' : ''}">
         <i class="fa-solid fa-fire" style="color:${isPopular ? '#fff' : '#F08D39'};"></i> Terpopuler
       </a>`,
      ...sortedCategories.map(cat => {
        const isActive = activeLabelLower === cat.toLowerCase();
        return `
          <a href="#/label/${encodeURIComponent(cat)}" class="foxsa-cat-pill ${isActive ? 'active' : ''}">
            <i class="${getCategoryIcon(cat)}"></i> ${escapeHtml(cat)}
            <span class="pill-count">${labelCounts[cat]}</span>
          </a>
        `;
      })
    ].join('');

    return `
      <div class="foxsa-category-bar">
        <div class="foxsa-category-bar-top">
          <div class="foxsa-cat-bar-title">
            <i class="fa-solid fa-layer-group"></i> Kategori Berita
          </div>
          <div class="foxsa-cat-dropdown-wrap">
            <select id="foxsa-quick-category-select" class="foxsa-cat-select" aria-label="Pilih Kategori Berita">
              <option value="#/" ${isHome ? 'selected' : ''}>📂 Semua Kategori (${state.data.posts.length} Berita)</option>
              <option value="#/popular" ${isPopular ? 'selected' : ''}>🔥 Berita Terpopuler</option>
              <optgroup label="Pilih Kategori Spesifik:">
                ${sortedCategories.map(cat => {
                  const isSelected = activeLabelLower === cat.toLowerCase();
                  return `<option value="#/label/${encodeURIComponent(cat)}" ${isSelected ? 'selected' : ''}>#${escapeHtml(cat)} (${labelCounts[cat]} berita)</option>`;
                }).join('')}
              </optgroup>
            </select>
          </div>
        </div>
        <div class="foxsa-cat-pills-scroll" id="foxsa-cat-pills-scroll">
          ${pillsHtml}
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
      : visiblePosts.map((post, idx) => {
          const labels = Array.isArray(post.labels) && post.labels.length > 0 ? post.labels : ['News'];
          const primaryTag = labels[0];
          const extraTagsCount = labels.length > 1 ? labels.length - 1 : 0;
          const commentCount = (post.comments || []).length;
          const postHref = getPostHref(post);
          const snippet = post.snippet || stripHtmlToSnippet(post.content, 135);
          const thumb = post.featuredImage || state.data.siteInfo.aboutBanner;

          return `
            <div class="blog-post hentry index-post post-${idx}">
              <div class="post-image-wrap">
                <a class="post-image-link" href="${postHref}">
                  <img alt="${escapeHtml(post.title)}" class="post-thumb lazy-yard" src="${escapeHtml(thumb)}" loading="lazy"/>
                </a>
              </div>
              <div class="post-info">
                <div class="post-meta foxsa-card-tags">
                  <a class="post-tag" href="#/label/${encodeURIComponent(primaryTag)}">
                    <img src="${HASHTAG_ICON}" alt="#" />
                    ${escapeHtml(primaryTag)}
                  </a>
                  ${extraTagsCount > 0
                    ? labels.slice(1, 3).map(t => `
                        <a class="foxsa-sub-tag" href="#/label/${encodeURIComponent(t)}">#${escapeHtml(t)}</a>
                      `).join('')
                    : ''}
                </div>
                <h2 class="post-title">
                  <a href="${postHref}">${escapeHtml(post.title)}</a>
                </h2>
                <div class="index-post-footer">
                  <div class="post-meta">
                    <span class="post-author"><a href="#/author/${encodeURIComponent(post.author)}" title="${escapeHtml(post.author)}">${escapeHtml(post.author)}</a></span>
                    <span class="post-date published" datetime="${escapeHtml(post.published)}">${escapeHtml(formatDateID(post.published))}</span>
                    ${commentCount > 0 ? `<span class="foxsa-card-comment-count"><i class="fa-regular fa-comment"></i> ${commentCount}</span>` : ''}
                  </div>
                  <p class="post-snippet">${escapeHtml(snippet)}</p>
                </div>
              </div>
            </div>
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
        ${buildCategoryFilterBarHtml()}
        ${filterMessageHtml}
        <div class="blog-posts hfeed index-post-wrap">
          <div class="grid-posts">
            ${postsCardsHtml}
          </div>
        </div>
        ${paginationHtml}
      </div>
    `;

    // Bind Category Dropdown Filter
    const quickCatSelect = document.getElementById('foxsa-quick-category-select');
    if (quickCatSelect) {
      quickCatSelect.addEventListener('change', () => {
        if (quickCatSelect.value) {
          window.location.hash = quickCatSelect.value;
        }
      });
    }

    // Scroll active pill into view horizontally on mobile
    const activePill = mainEl.querySelector('.foxsa-cat-pill.active');
    const pillScrollContainer = document.getElementById('foxsa-cat-pills-scroll');
    if (activePill && pillScrollContainer && activePill.offsetLeft > 80) {
      pillScrollContainer.scrollLeft = activePill.offsetLeft - 24;
    }

    const loadMoreBtn = document.getElementById('foxsa-load-more-btn');
    if (loadMoreBtn) {
      loadMoreBtn.addEventListener('click', function (e) {
        e.preventDefault();
        const step = (state.data.siteInfo && state.data.siteInfo.postPerPage) || 5;
        state.visiblePostsCount += step;
        renderListView();
      });
    }
  }

  // =========================================================================
  // 5. RENDERING: SINGLE ARTICLE VIEW + COMMENTS
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
          <article class="blog-post hentry item-post">
            <div class="post-item-inner">
              <div class="post-header">
                <nav id="breadcrumb">
                  <a href="#/"><i class="fa-solid fa-house"></i> Beranda</a>
                  <em class="delimiter"></em>
                  <a class="b-label" href="#/label/${encodeURIComponent(primaryCategory)}">${escapeHtml(primaryCategory)}</a>
                  <em class="delimiter"></em>
                  <span class="current">${escapeHtml(post.title)}</span>
                </nav>
                <h1 class="post-title">${escapeHtml(post.title)}</h1>
                <div class="post-meta" style="display:flex;align-items:center;justify-content:space-between;flex-wrap:wrap;gap:8px;">
                  <div>
                    <span class="post-author"><a href="#/author/${encodeURIComponent(post.author)}" title="${escapeHtml(post.author)}">${escapeHtml(post.author)}</a></span>
                    <span class="post-date published" datetime="${escapeHtml(post.published)}">${escapeHtml(formatDateID(post.published))}</span>
                    <span style="margin-left:10px;color:#F08D39;font-weight:600;"><i class="fa-regular fa-comments"></i> ${comments.length} Komentar</span>
                  </div>
                  ${isStaffLoggedIn
                    ? `<button type="button" id="foxsa-quick-edit-post" class="foxsa-btn foxsa-btn-outline" style="padding:5px 12px;font-size:12px;">
                         <i class="fa-solid fa-pen"></i> Edit Berita (Staff)
                       </button>`
                    : ''}
                </div>
              </div>

              <div class="post-body post-content">
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
                    <h3><i class="fa-regular fa-comments"></i> Komentar Pembaca</h3>
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

    // Bind Quick Edit Post (Staff only)
    const quickEditBtn = document.getElementById('foxsa-quick-edit-post');
    if (quickEditBtn && isStaffLoggedIn) {
      quickEditBtn.addEventListener('click', () => {
        state.editingPostId = post.id;
        state.adminTab = 'editor';
        window.location.hash = '#/admin';
      });
    }

    // Bind Copy Link
    const copyLinkBtn = document.getElementById('foxsa-copy-link-btn');
    if (copyLinkBtn) {
      copyLinkBtn.addEventListener('click', (e) => {
        e.preventDefault();
        navigator.clipboard.writeText(window.location.href).then(() => {
          showToast('Tautan berita berhasil disalin!');
        });
      });
    }

    // Bind Add Comment
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

    // Bind Delete Comment buttons (Staff only)
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
  // 6. RENDERING: STAFF LOGIN & PROTECTED ADMIN PANEL
  // =========================================================================

  function renderStaffLoginView() {
    document.body.className = 'item';
    const mainEl = document.getElementById('main');
    if (!mainEl) return;

    const accounts = state.data.staffAccounts || [];

    mainEl.innerHTML = `
      <div class="foxsa-login-card">
        <div class="foxsa-login-header">
          <div class="foxsa-login-badge">
            <i class="fa-solid fa-user-shield"></i> PORTAL REDAKSI FOXSA NEWS
          </div>
          <h2>Login Khusus Staff &amp; Admin</h2>
          <p>Halaman ini dikhususkan bagi Jurnalis, Editor, dan Staff Redaksi FoxSA News untuk menambah berita serta mengelola komentar.</p>
        </div>

        <form id="foxsa-staff-login-form" class="foxsa-login-form">
          <div class="foxsa-form-group">
            <label for="login-quick-account">Pilih Nama Staff Cepat (Opsional)</label>
            <select id="login-quick-account" class="foxsa-select">
              <option value="">-- Pilih Akun Staff atau Ketik Username Manual --</option>
              ${accounts.map(acc => `
                <option value="${escapeHtml(acc.username)}">${escapeHtml(acc.displayName)} — (${escapeHtml(acc.role)})</option>
              `).join('')}
            </select>
          </div>

          <div class="foxsa-form-group">
            <label for="login-username">Username Staff / Admin *</label>
            <div class="foxsa-input-icon-wrap">
              <i class="fa-solid fa-user"></i>
              <input type="text" id="login-username" class="foxsa-input" placeholder="Contoh: admin, arthur, ligma, clarissa, shen" autocomplete="username" required />
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
            <i class="fa-solid fa-triangle-exclamation"></i> Username atau Password salah! Silakan periksa kembali.
          </div>

          <div class="foxsa-login-actions">
            <button type="submit" class="foxsa-btn foxsa-btn-full">
              <i class="fa-solid fa-right-to-bracket"></i> Masuk ke Panel Redaksi
            </button>
            <a href="#/" class="foxsa-btn foxsa-btn-outline foxsa-btn-full" style="text-decoration:none;">
              <i class="fa-solid fa-arrow-left"></i> Kembali ke Beranda Berita
            </a>
          </div>
        </form>
      </div>
    `;

    const quickSelect = document.getElementById('login-quick-account');
    const userInp = document.getElementById('login-username');
    const passInp = document.getElementById('login-password');
    const togglePwdBtn = document.getElementById('login-toggle-pwd');
    const errBox = document.getElementById('login-error-msg');
    const form = document.getElementById('foxsa-staff-login-form');

    if (quickSelect) {
      quickSelect.addEventListener('change', () => {
        if (quickSelect.value) {
          userInp.value = quickSelect.value;
          passInp.focus();
        }
      });
    }

    if (togglePwdBtn && passInp) {
      togglePwdBtn.addEventListener('click', () => {
        const isPwd = passInp.type === 'password';
        passInp.type = isPwd ? 'text' : 'password';
        togglePwdBtn.innerHTML = isPwd ? '<i class="fa-regular fa-eye-slash"></i>' : '<i class="fa-regular fa-eye"></i>';
      });
    }

    if (form) {
      form.addEventListener('submit', (e) => {
        e.preventDefault();
        const ok = loginStaff(userInp.value, passInp.value);
        if (ok) {
          showToast(`Selamat datang, ${state.currentUser.displayName}!`);
          renderAdminView();
        } else {
          if (errBox) errBox.style.display = 'flex';
          passInp.value = '';
          passInp.focus();
        }
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
    const totalStaff = (state.data.staffAccounts || []).length;

    let tabContentHtml = '';

    // TAB 1: DAFTAR BERITA
    if (state.adminTab === 'posts') {
      tabContentHtml = `
        <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:16px;flex-wrap:wrap;gap:10px;">
          <div>
            <strong>Total Berita Roleplay: ${totalPosts} Artikel</strong>
          </div>
          <button type="button" class="foxsa-btn" id="admin-new-post-btn">
            <i class="fa-solid fa-plus"></i> Tambah Berita Baru
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
                  <td>${escapeHtml(p.author)}</td>
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

    // TAB 2: TAMBAH / EDIT BERITA (DENGAN MULTI-SELECT PIL KATEGORI + DROPDOWN)
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
      const contentVal = editingPost ? editingPost.content : `<p style="text-align: justify;">Los Santos, FoxSA News — Tulis paragraf pembuka berita di sini...</p>\n<p style="text-align: justify;">Tulis kronologi lengkap kejadian di sini...</p>`;

      const allCategories = getAllAvailableCategories();

      tabContentHtml = `
        <form id="foxsa-post-editor-form">
          <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:14px;flex-wrap:wrap;gap:8px;">
            <h3 style="margin:0;color:#090C1E;">
              ${editingPost ? `<i class="fa-solid fa-pen-to-square" style="color:#F08D39;"></i> Edit Berita` : `<i class="fa-solid fa-circle-plus" style="color:#F08D39;"></i> Tambah Berita Baru`}
            </h3>
            ${editingPost ? `<button type="button" class="foxsa-btn foxsa-btn-outline" id="editor-cancel-btn" style="padding:6px 12px;font-size:12px;">Batal Edit</button>` : ''}
          </div>

          <div class="foxsa-form-group">
            <label>Judul Berita *</label>
            <input type="text" id="post-title-input" class="foxsa-input" value="${escapeHtml(titleVal)}" placeholder="Contoh: Polisi Lakukan Pengejaran di Los Santos, Dua Pelaku Berhasil Diamankan" required />
          </div>

          <!-- SMART CATEGORY SELECTOR (NO MANUAL COMMA TYPING NEEDED) -->
          <div class="foxsa-form-group">
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
                  <input type="text" id="editor-new-cat-input" class="foxsa-input" placeholder="Buat kategori baru..." />
                  <button type="button" class="foxsa-btn foxsa-btn-secondary" id="editor-add-new-cat-btn" style="white-space:nowrap;">
                    <i class="fa-solid fa-plus"></i> Tambah
                  </button>
                </div>
              </div>

              <div class="foxsa-selected-cat-summary" id="editor-selected-summary">
                <!-- Updated dynamically -->
              </div>
              <input type="hidden" id="post-labels-input" value="${escapeHtml(state.selectedEditorLabels.join(', '))}" />
            </div>
          </div>

          <div class="foxsa-form-row">
            <div class="foxsa-form-group">
              <label>Pilih Jurnalis / Penulis Tersimpan</label>
              <select id="post-author-preset" class="foxsa-select">
                ${authorNames.map(name => `<option value="${escapeHtml(name)}" ${name === authorVal ? 'selected' : ''}>${escapeHtml(name)}</option>`).join('')}
                <option value="__custom__">+ Tulis Nama Jurnalis Baru...</option>
              </select>
            </div>
            <div class="foxsa-form-group">
              <label>Nama Penulis / Reporter *</label>
              <input type="text" id="post-author-input" class="foxsa-input" value="${escapeHtml(authorVal)}" required />
            </div>
          </div>

          <div class="foxsa-form-row">
            <div class="foxsa-form-group">
              <label>Jabatan / Bio Singkat Penulis</label>
              <input type="text" id="post-author-bio-input" class="foxsa-input" value="${escapeHtml(authorBioVal)}" placeholder="Contoh: Senior Staff | Field Reporter" />
            </div>
            <div class="foxsa-form-group">
              <label>URL Foto Profil Penulis</label>
              <input type="text" id="post-author-avatar-input" class="foxsa-input" value="${escapeHtml(authorAvatarVal)}" placeholder="https://..." />
            </div>
          </div>

          <div class="foxsa-form-row">
            <div class="foxsa-form-group">
              <label>Gambar Utama Berita (URL Gambar atau Upload dari HP/Komputer)</label>
              <div style="display:flex;gap:8px;flex-wrap:wrap;">
                <input type="text" id="post-image-input" class="foxsa-input" style="flex:1;min-width:180px;" value="${escapeHtml(imageVal)}" placeholder="Paste link gambar (https://...) atau klik Upload" />
                <label class="foxsa-btn foxsa-btn-secondary" style="cursor:pointer;margin:0;">
                  <i class="fa-solid fa-upload"></i> Upload Gambar
                  <input type="file" id="post-image-file" accept="image/*" style="display:none;" />
                </label>
              </div>
            </div>
            <div class="foxsa-form-group" style="max-width:260px;">
              <label>Tanggal &amp; Waktu Publikasi</label>
              <input type="datetime-local" id="post-date-input" class="foxsa-input" value="${escapeHtml(dateVal)}" />
              <label style="display:flex;align-items:center;gap:6px;margin-top:8px;cursor:pointer;">
                <input type="checkbox" id="post-popular-input" ${popularChecked ? 'checked' : ''} />
                <span>Tampilkan di Most Popular</span>
              </label>
            </div>
          </div>

          <div class="foxsa-form-group">
            <label>Isi Artikel Berita (Mendukung Teks &amp; HTML)</label>
            <div class="foxsa-editor-toolbar">
              <button type="button" class="foxsa-editor-btn" data-insert-tag="p"><i class="fa-solid fa-paragraph"></i> Paragraf</button>
              <button type="button" class="foxsa-editor-btn" data-insert-tag="b"><i class="fa-solid fa-bold"></i> Bold</button>
              <button type="button" class="foxsa-editor-btn" data-insert-tag="i"><i class="fa-solid fa-italic"></i> Italic</button>
              <button type="button" class="foxsa-editor-btn" data-insert-tag="h2"><i class="fa-solid fa-heading"></i> Subjudul H2</button>
              <button type="button" class="foxsa-editor-btn" data-insert-tag="blockquote"><i class="fa-solid fa-quote-left"></i> Kutipan</button>
              <button type="button" class="foxsa-editor-btn" id="editor-insert-img-url"><i class="fa-regular fa-image"></i> + Gambar Link</button>
              <button type="button" class="foxsa-editor-btn" id="editor-toggle-preview" style="margin-left:auto;"><i class="fa-solid fa-eye"></i> Preview</button>
            </div>
            <textarea id="post-content-input" class="foxsa-textarea" rows="12" style="border-radius:0 0 8px 8px;font-family:monospace;font-size:13px;" required>${escapeHtml(contentVal)}</textarea>
          </div>

          <div id="editor-live-preview" style="display:none;padding:20px;border:1px dashed #F08D39;border-radius:12px;margin-bottom:16px;background:#fff;">
            <h4 style="margin-top:0;color:#F08D39;">Preview Isi Berita:</h4>
            <div class="post-body" id="editor-preview-body"></div>
          </div>

          <div style="display:flex;gap:10px;align-items:center;flex-wrap:wrap;">
            <button type="submit" class="foxsa-btn">
              <i class="fa-solid fa-floppy-disk"></i> ${editingPost ? 'Simpan Perubahan Berita' : 'Publikasikan Berita Sekarang'}
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

    // TAB 4: KELOLA STAFF & PASSWORD
    else if (state.adminTab === 'staff') {
      const staffList = state.data.staffAccounts || [];
      tabContentHtml = `
        <div class="foxsa-status-box">
          <strong><i class="fa-solid fa-users-gear" style="color:#F08D39;"></i> Manajemen Akun Staff &amp; Password Redaksi FoxSA:</strong>
          <p style="margin:6px 0 0;">Di sini kamu bisa mengubah password akunmu, menambah akun untuk anggota staff FoxSA baru, atau mengatur jabatan penulis.</p>
        </div>

        <div class="foxsa-table-responsive" style="margin-bottom:24px;">
          <table class="foxsa-admin-table">
            <thead>
              <tr>
                <th>Username Login</th>
                <th>Nama Jurnalis / Tampilan</th>
                <th>Jabatan / Role</th>
                <th>Password Saat Ini</th>
                <th>Aksi</th>
              </tr>
            </thead>
            <tbody>
              ${staffList.map(acc => `
                <tr>
                  <td><code>${escapeHtml(acc.username)}</code></td>
                  <td><strong>${escapeHtml(acc.displayName)}</strong></td>
                  <td><span class="foxsa-badge">${escapeHtml(acc.role)}</span></td>
                  <td>
                    <span class="pwd-mask" data-pwd="${escapeHtml(acc.password)}">••••••••</span>
                    <button type="button" class="foxsa-editor-btn" style="padding:2px 6px;font-size:11px;margin-left:6px;" data-show-staff-pwd="${escapeHtml(acc.username)}">
                      <i class="fa-regular fa-eye"></i>
                    </button>
                  </td>
                  <td style="white-space:nowrap;">
                    <button type="button" class="foxsa-editor-btn" data-change-pwd="${escapeHtml(acc.username)}">
                      <i class="fa-solid fa-key"></i> Ubah Password
                    </button>
                    ${acc.username !== 'admin' ? `
                      <button type="button" class="foxsa-editor-btn" style="color:#dc2626;border-color:#fecaca;" data-del-staff="${escapeHtml(acc.username)}">
                        <i class="fa-solid fa-trash"></i>
                      </button>
                    ` : ''}
                  </td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>

        <div class="foxsa-comment-form">
          <h4><i class="fa-solid fa-user-plus" style="color:#F08D39;"></i> Tambah Akun Staff / Jurnalis Baru</h4>
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
                <label>Jabatan di FoxSA News *</label>
                <input type="text" id="new-staff-role" class="foxsa-input" value="Junior Staff | Journalist" required />
              </div>
            </div>
            <button type="submit" class="foxsa-btn">
              <i class="fa-solid fa-user-check"></i> Simpan Akun Staff Baru
            </button>
          </form>
        </div>
      `;
    }

    // TAB 5: PENYIMPANAN & CLOUD SYNC (GITHUB / VERCEL)
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
              <div class="staff-logged-role">${escapeHtml(state.currentUser.role)}</div>
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
            <i class="fa-solid fa-pen-nib"></i> ${state.editingPostId ? 'Edit Berita' : '+ Tambah Berita'}
          </button>
          <button type="button" class="foxsa-admin-tab ${state.adminTab === 'comments' ? 'active' : ''}" data-admin-tab="comments">
            <i class="fa-regular fa-comments"></i> Komentar (${totalComments})
          </button>
          <button type="button" class="foxsa-admin-tab ${state.adminTab === 'staff' ? 'active' : ''}" data-admin-tab="staff">
            <i class="fa-solid fa-users-gear"></i> Akun Staff (${totalStaff})
          </button>
          <button type="button" class="foxsa-admin-tab ${state.adminTab === 'storage' ? 'active' : ''}" data-admin-tab="storage">
            <i class="fa-solid fa-cloud-arrow-up"></i> Cloud &amp; Backup
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

  function bindAdminEvents() {
    const mainEl = document.getElementById('main');
    if (!mainEl) return;

    // Logout button
    const logoutBtn = document.getElementById('admin-logout-btn');
    if (logoutBtn) {
      logoutBtn.addEventListener('click', () => {
        logoutStaff();
        renderAdminView();
      });
    }

    // Tab switching
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

    // "+ Tambah Berita Baru" button
    const newPostBtn = document.getElementById('admin-new-post-btn');
    if (newPostBtn) {
      newPostBtn.addEventListener('click', () => {
        state.editingPostId = null;
        state.selectedEditorLabels = ['Crime', 'LSPD'];
        state.adminTab = 'editor';
        renderAdminView();
      });
    }

    // Popular Star Toggle
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

    // Edit Post button
    mainEl.querySelectorAll('[data-edit-post]').forEach(btn => {
      btn.addEventListener('click', () => {
        state.editingPostId = btn.getAttribute('data-edit-post');
        state.adminTab = 'editor';
        renderAdminView();
      });
    });

    // Delete Post button
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

    // Editor Events
    const editorForm = document.getElementById('foxsa-post-editor-form');
    if (editorForm) {
      updateEditorCategorySummaryUI();

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

      // Dropdown quick category add
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

      // Add custom new category button
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

      const presetSelect = document.getElementById('post-author-preset');
      const authorInput = document.getElementById('post-author-input');
      const bioInput = document.getElementById('post-author-bio-input');
      const avatarInput = document.getElementById('post-author-avatar-input');

      if (presetSelect) {
        presetSelect.addEventListener('change', () => {
          const val = presetSelect.value;
          if (val !== '__custom__' && state.data.authors[val]) {
            const a = state.data.authors[val];
            authorInput.value = a.name;
            bioInput.value = a.bio || '';
            avatarInput.value = a.avatar || DEFAULT_AVATAR;
          } else if (val === '__custom__') {
            authorInput.value = '';
            bioInput.value = 'FoxSA News Journalist';
            avatarInput.value = DEFAULT_AVATAR;
            authorInput.focus();
          }
        });
      }

      // Image File Upload
      const fileInput = document.getElementById('post-image-file');
      if (fileInput) {
        fileInput.addEventListener('change', (e) => {
          const file = e.target.files && e.target.files[0];
          if (!file) return;
          compressImageFile(file, 960, 0.82, (dataUrl) => {
            document.getElementById('post-image-input').value = dataUrl;
            showToast('Gambar berhasil di-load!');
          });
        });
      }

      // Formatting toolbar buttons
      const contentArea = document.getElementById('post-content-input');
      mainEl.querySelectorAll('[data-insert-tag]').forEach(btn => {
        btn.addEventListener('click', () => {
          const tag = btn.getAttribute('data-insert-tag');
          const start = contentArea.selectionStart;
          const end = contentArea.selectionEnd;
          const selected = contentArea.value.substring(start, end) || 'Teks di sini';
          let replacement = `<${tag}>${selected}</${tag}>`;
          if (tag === 'p') {
            replacement = `<p style="text-align: justify;">${selected}</p>\n`;
          } else if (tag === 'blockquote') {
            replacement = `<blockquote style="text-align: justify;">"${selected}"</blockquote>\n`;
          }
          contentArea.value = contentArea.value.substring(0, start) + replacement + contentArea.value.substring(end);
          contentArea.focus();
        });
      });

      const insertImgBtn = document.getElementById('editor-insert-img-url');
      if (insertImgBtn) {
        insertImgBtn.addEventListener('click', () => {
          const url = prompt('Masukkan URL Gambar yang ingin ditambahkan ke dalam isi berita:');
          if (!url) return;
          const caption = prompt('Masukkan Keterangan Gambar / Kredit Foto (Opsional):', 'Picture : FoxSA News');
          const imgHtml = `\n<div class="separator" style="clear: both; text-align: center;"><a href="${url}" target="_blank"><img border="0" src="${url}" width="640" /></a></div>\n${caption ? `<p style="text-align: center;"><i>${caption}</i></p>\n` : ''}`;
          contentArea.value += imgHtml;
        });
      }

      const previewBtn = document.getElementById('editor-toggle-preview');
      if (previewBtn) {
        previewBtn.addEventListener('click', () => {
          const box = document.getElementById('editor-live-preview');
          const body = document.getElementById('editor-preview-body');
          if (box.style.display === 'none') {
            body.innerHTML = contentArea.value;
            box.style.display = 'block';
          } else {
            box.style.display = 'none';
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
        const author = document.getElementById('post-author-input').value.trim() || 'FoxSA News';
        const authorBio = document.getElementById('post-author-bio-input').value.trim();
        const authorAvatar = document.getElementById('post-author-avatar-input').value.trim() || DEFAULT_AVATAR;
        const labels = state.selectedEditorLabels.length > 0 ? [...state.selectedEditorLabels] : ['News'];
        const dateRaw = document.getElementById('post-date-input').value;
        const publishedIso = dateRaw ? new Date(dateRaw).toISOString() : new Date().toISOString();
        const popular = document.getElementById('post-popular-input').checked;
        let featuredImage = document.getElementById('post-image-input').value.trim();
        let content = document.getElementById('post-content-input').value.trim();

        state.data.authors[author] = {
          name: author,
          avatar: authorAvatar,
          bio: authorBio || 'FoxSA News Journalist',
          profileUrl: `#/author/${author}`
        };

        if (featuredImage && !/<img\b/i.test(content)) {
          content = `<div class="separator" style="clear: both; text-align: center;"><a href="${featuredImage}" target="_blank"><img border="0" src="${featuredImage}" width="640" /></a></div><br/>` + content;
        }
        if (!featuredImage) {
          const match = content.match(/<img[^>]+src=["']([^"']+)["']/i);
          featuredImage = match ? match[1] : state.data.siteInfo.aboutBanner;
        }

        const snippet = stripHtmlToSnippet(content, 135);

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

    // Staff Management Tab Events
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
        const role = document.getElementById('new-staff-role').value.trim() || 'FoxSA News Journalist';

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
        showToast(`Akun staff ${displayName} (${username}) berhasil ditambahkan!`);
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
  // 7. RENDERING: SIDEBAR, HEADER MENU & FOOTER WIDGETS
  // =========================================================================

  function renderWidgets() {
    if (!state.data || !state.data.posts) return;
    const posts = state.data.posts;

    // 1. Popular Posts (Sidebar #PopularPosts1 & Footer #PopularPosts2)
    let popularPosts = posts.filter(p => p.popular);
    if (popularPosts.length < 3) {
      popularPosts = posts.slice(0, 3);
    } else {
      popularPosts = popularPosts.slice(0, 3);
    }

    const popularHtml = popularPosts.map((p, idx) => `
      <div class="post item-${idx}">
        <div class="post-content">
          <a class="post-image-link" href="${getPostHref(p)}">
            <img alt="${escapeHtml(p.title)}" class="post-thumb lazy-yard" src="${escapeHtml(p.featuredImage || state.data.siteInfo.aboutBanner)}" loading="lazy"/>
          </a>
          <div class="post-info">
            <h2 class="post-title"><a href="${getPostHref(p)}">${escapeHtml(p.title)}</a></h2>
            <div class="post-meta">
              <span class="post-date published" datetime="${escapeHtml(p.published)}">${escapeHtml(formatDateID(p.published))}</span>
            </div>
          </div>
        </div>
      </div>
    `).join('');

    const popSidebarEl = document.querySelector('#PopularPosts1 .widget-content');
    if (popSidebarEl) popSidebarEl.innerHTML = popularHtml;

    const popFooterEl = document.querySelector('#PopularPosts2 .widget-content');
    if (popFooterEl) popFooterEl.innerHTML = popularHtml;

    // 2. Categories & Tags Count (#Label1 list + dropdown & #Label2 cloud)
    const labelCounts = getLabelCounts();
    const sortedLabels = Object.keys(labelCounts).sort((a, b) => {
      if (labelCounts[b] !== labelCounts[a]) return labelCounts[b] - labelCounts[a];
      return a.localeCompare(b);
    });

    // Update top header dynamic category submenu
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

    const labelCloudEl = document.querySelector('#Label2 .widget-content');
    if (labelCloudEl) {
      labelCloudEl.innerHTML = `
        <ul class="cloud-label">
          ${sortedLabels.map(l => `
            <li>
              <a class="label-name" href="#/label/${encodeURIComponent(l)}">
                #${escapeHtml(l)}
              </a>
            </li>
          `).join('')}
        </ul>
      `;
    }

    // 3. Blog Archive (#BlogArchive1)
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

  function renderMainView() {
    const { view, param } = state.currentRoute;
    if (view === 'post') {
      renderSinglePostView(param);
    } else if (view === 'admin') {
      renderAdminView();
    } else {
      renderListView();
    }
  }

  function renderAll() {
    renderMainView();
    renderWidgets();
  }

  // =========================================================================
  // 8. UI INTERACTIONS (SEARCH, ANDROID DRAWER MENU, BACK TO TOP)
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

    mobileMenuContainer.appendChild(clonedUl);
  }

  function initUIInteractions() {
    // Desktop/Header Search Toggle
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
  // 9. BOOTSTRAP
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
