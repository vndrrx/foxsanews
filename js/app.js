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

  const DEFAULT_STAFF_ACCOUNTS = [
    {
      username: 'admin',
      password: 'foxsa2026',
      displayName: 'Redaksi Utama (Admin)',
      authorName: 'Arthur Redfields',
      role: 'Chief Editor / Super Admin',
      isAdmin: true,
      avatar: 'assets/logo/foxsa-icon.jpg'
    },
    {
      username: 'arthur',
      password: 'arthurfoxsa',
      displayName: 'Arthur Redfields',
      authorName: 'Arthur Redfields',
      role: 'Secretary Chief | Senior Staff',
      isAdmin: true,
      avatar: 'https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEijelpjGHfXOoTKfqD1mokSIESF0WySrKkFx3EV9rhrMxaQHJmPSkWe7Lj9QbiFJQbVx7z2os7vSHs3TVJFg1nzGX2MTzdqBO1eO-gppMt99EfwrEBOG9BqW1ZrbkNcNNqd-k9pS8vHOItd_EF7yVe_MfaTvhN2EvXpcWmK7ZDpX94RY14/s200/In%20Edward%20Snowden%E2%80%99s%20New%20Memoir,%20the%20Disclosures%20This%20Time%20Are%20Personal%20(Published%202019).jpg'
    },
    {
      username: 'ligma',
      password: 'ligmafoxsa',
      displayName: 'Ligma Deek',
      authorName: 'Ligma Deek',
      role: 'Executive Staff | Head of Affairs & Analyst',
      isAdmin: true,
      avatar: 'assets/logo/foxsa-icon.jpg'
    },
    {
      username: 'clarissa',
      password: 'clarissafoxsa',
      displayName: 'Clarissa Vencant',
      authorName: 'Clarissa Vencant',
      role: 'Senior Staff | Editor',
      isAdmin: false,
      avatar: 'assets/logo/foxsa-icon.jpg'
    },
    {
      username: 'shen',
      password: 'shenfoxsa',
      displayName: 'Shen Xander',
      authorName: 'Shen Xander',
      role: 'Junior Staff | Journalist',
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

    if (!Array.isArray(cloned.profileFeedback)) {
      cloned.profileFeedback = [
        {
          id: 'fb-1',
          author: 'Ligma Deek',
          role: 'Executive Staff | Head of Affairs',
          date: '2026-04-08T10:15:00.000Z',
          body: 'Terus tingkatkan kualitas liputan lapangan dan jadwal Live Broadcast harian FoxSA News!'
        }
      ];
    }

    cloned.staffAccounts.forEach(acc => {
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
        staffBtn.classList.add('is-logged-in');
        staffBtn.title = `Login sebagai ${state.currentUser.displayName} (${state.currentUser.role})`;
      } else {
        if (labelSpan) labelSpan.textContent = 'Staff Login';
        staffBtn.classList.remove('is-logged-in');
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
  // 4. HERO SHOWCASE (KREETI BREAKING NEWS + 3-COL GRID + 4-COL FEATURED)
  // =========================================================================

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

    // 4. Featured Posts 4-Column Row (4 strong visual stories)
    const featuredRowPosts = newsPosts.slice(1, 5).length === 4
      ? newsPosts.slice(1, 5)
      : posts.slice(0, 4);

    // Breaking News Ticker items
    const tickerPosts = posts.slice(0, 6);
    if (state.tickerIndex >= tickerPosts.length) state.tickerIndex = 0;
    const activeTickerPost = tickerPosts[state.tickerIndex] || mainPost;

    const mainTag = (mainPost.labels && mainPost.labels[0]) || 'News';
    const topPickTag = (topPick.labels && topPick.labels[0]) || 'News';

    heroSection.innerHTML = `
      <div class="container">
        <!-- BREAKING NEWS BAR (KREETI STYLE) -->
        <div class="kreeti-breaking-bar">
          <div class="breaking-badge">
            <span class="pulse-dot"></span>
            <span>BREAKING NEWS</span>
          </div>
          <div class="breaking-ticker-content" id="foxsa-ticker-slot">
            <a href="${getPostHref(activeTickerPost)}" class="ticker-item-link">
              <img src="${escapeHtml(activeTickerPost.featuredImage || state.data.siteInfo.aboutBanner)}" alt="thumb" class="ticker-thumb" />
              <span class="ticker-cat">[${escapeHtml((activeTickerPost.labels && activeTickerPost.labels[0]) || 'News')}]</span>
              <span class="ticker-title">${escapeHtml(activeTickerPost.title)}</span>
            </a>
          </div>
          <div class="breaking-controls">
            <button type="button" id="ticker-prev-btn" aria-label="Sebelumnya"><i class="fa-solid fa-chevron-left"></i></button>
            <button type="button" id="ticker-next-btn" aria-label="Berikutnya"><i class="fa-solid fa-chevron-right"></i></button>
          </div>
        </div>

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

        <!-- 4-COLUMN FEATURED POSTS ROW (KREETI STYLE) -->
        <div class="kreeti-featured-row-wrap">
          <div class="kreeti-sec-heading">
            <span class="heading-line"></span>
            <h3>Sorotan Pilihan Redaksi</h3>
          </div>
          <div class="kreeti-featured-4grid">
            ${featuredRowPosts.map(fp => {
              const cat = (fp.labels && fp.labels[0]) || 'News';
              return `
                <article class="kreeti-feat-card">
                  <a href="${getPostHref(fp)}" class="feat-card-img">
                    <img src="${escapeHtml(fp.featuredImage || state.data.siteInfo.aboutBanner)}" alt="${escapeHtml(fp.title)}" loading="lazy" />
                    <span class="feat-read-badge"><i class="fa-regular fa-clock"></i> ${getReadingTime(fp.content)}</span>
                  </a>
                  <div class="feat-card-body">
                    <a href="#/label/${encodeURIComponent(cat)}" class="feat-card-cat">${escapeHtml(cat)}</a>
                    <h4><a href="${getPostHref(fp)}">${escapeHtml(fp.title)}</a></h4>
                    <div class="feat-card-meta">
                      <span>${escapeHtml(fp.author)}</span>
                      <span>•</span>
                      <span>${escapeHtml(formatShortDate(fp.published))}</span>
                      <span>•</span>
                      <span><i class="fa-regular fa-comment"></i> ${(fp.comments || []).length}</span>
                    </div>
                  </div>
                </article>
              `;
            }).join('')}
          </div>
        </div>
      </div>
    `;

    // Bind Breaking News Ticker Controls & Auto-Cycle
    const updateTickerDOM = () => {
      const slot = document.getElementById('foxsa-ticker-slot');
      if (!slot) return;
      const p = tickerPosts[state.tickerIndex] || mainPost;
      slot.innerHTML = `
        <a href="${getPostHref(p)}" class="ticker-item-link">
          <img src="${escapeHtml(p.featuredImage || state.data.siteInfo.aboutBanner)}" alt="thumb" class="ticker-thumb" />
          <span class="ticker-cat">[${escapeHtml((p.labels && p.labels[0]) || 'News')}]</span>
          <span class="ticker-title">${escapeHtml(p.title)}</span>
        </a>
      `;
    };

    const prevBtn = document.getElementById('ticker-prev-btn');
    const nextBtn = document.getElementById('ticker-next-btn');
    if (prevBtn) {
      prevBtn.addEventListener('click', () => {
        state.tickerIndex = (state.tickerIndex - 1 + tickerPosts.length) % tickerPosts.length;
        updateTickerDOM();
      });
    }
    if (nextBtn) {
      nextBtn.addEventListener('click', () => {
        state.tickerIndex = (state.tickerIndex + 1) % tickerPosts.length;
        updateTickerDOM();
      });
    }

    clearInterval(state.tickerTimer);
    state.tickerTimer = setInterval(() => {
      if (state.currentRoute.view === 'home' && tickerPosts.length > 1) {
        state.tickerIndex = (state.tickerIndex + 1) % tickerPosts.length;
        updateTickerDOM();
      }
    }, 5500);
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

    // Top 5 categories as clean tabs (AnimeNetwork style) + Dropdown for all categories
    const topTabCategories = sortedCategories.slice(0, 5);

    return `
      <div class="an-filter-toolbar">
        <div class="an-tabs-scroll" id="foxsa-cat-pills-scroll">
          <a href="#/" class="an-tab-item ${isHome ? 'active' : ''}">Semua Berita</a>
          <a href="#/popular" class="an-tab-item ${isPopular ? 'active' : ''}">🔥 Terpopuler</a>
          ${topTabCategories.map(cat => {
            const isActive = activeLabelLower === cat.toLowerCase();
            return `<a href="#/label/${encodeURIComponent(cat)}" class="an-tab-item ${isActive ? 'active' : ''}">${escapeHtml(cat)}</a>`;
          }).join('')}
        </div>

        <div class="an-toolbar-right">
          <select id="foxsa-quick-category-select" class="foxsa-cat-select" aria-label="Pilih Kategori Berita">
            <option value="#/" ${isHome ? 'selected' : ''}>📂 Semua Kategori (${state.data.posts.length})</option>
            <option value="#/popular" ${isPopular ? 'selected' : ''}>🔥 Berita Terpopuler</option>
            <optgroup label="Filter Kategori:">
              ${sortedCategories.map(cat => {
                const isSelected = activeLabelLower === cat.toLowerCase();
                return `<option value="#/label/${encodeURIComponent(cat)}" ${isSelected ? 'selected' : ''}>#${escapeHtml(cat)} (${labelCounts[cat]})</option>`;
              }).join('')}
            </optgroup>
          </select>

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

    // Bind Category Dropdown Filter
    const quickCatSelect = document.getElementById('foxsa-quick-category-select');
    if (quickCatSelect) {
      quickCatSelect.addEventListener('change', () => {
        if (quickCatSelect.value) {
          window.location.hash = quickCatSelect.value;
        }
      });
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
                      <a href="#/author/${encodeURIComponent(post.author)}" class="byline-author-name">${escapeHtml(post.author)}</a>
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
          <p>Halaman ini dikhususkan bagi Jurnalis, Editor, dan Staff Redaksi FoxSA News untuk menulis berita serta mengelola komentar.</p>
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

          <!-- LANGKAH 4: IDENTITAS JURNALIS & WAKTU PUBLIKASI -->
          <div class="foxsa-editor-step-card">
            <div class="step-card-badge">4. Identitas Jurnalis &amp; Publikasi</div>
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
              <div class="foxsa-form-group">
                <label>Tanggal &amp; Waktu Publikasi</label>
                <input type="datetime-local" id="post-date-input" class="foxsa-input" value="${escapeHtml(dateVal)}" />
              </div>
            </div>

            <div class="foxsa-form-row" style="margin-bottom:0;">
              <div class="foxsa-form-group">
                <label>Jabatan / Bio Singkat Penulis</label>
                <input type="text" id="post-author-bio-input" class="foxsa-input" value="${escapeHtml(authorBioVal)}" placeholder="Contoh: Senior Staff | Field Reporter" />
              </div>
              <div class="foxsa-form-group">
                <label>URL Foto Profil Penulis</label>
                <input type="text" id="post-author-avatar-input" class="foxsa-input" value="${escapeHtml(authorAvatarVal)}" placeholder="https://..." />
              </div>
              <div class="foxsa-form-group" style="justify-content:center;">
                <label style="display:flex;align-items:center;gap:8px;cursor:pointer;margin-top:18px;font-size:13px;">
                  <input type="checkbox" id="post-popular-input" ${popularChecked ? 'checked' : ''} style="width:16px;height:16px;" />
                  <span>🔥 Tampilkan di Berita Terpopuler</span>
                </label>
              </div>
            </div>
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
            <i class="fa-solid fa-feather-pointed"></i> ${state.editingPostId ? 'Edit Berita' : '+ Tulis Berita'}
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
        let content = serializeVisualEditorToCleanHtml(visualCanvas);

        state.data.authors[author] = {
          name: author,
          avatar: authorAvatar,
          bio: authorBio || 'FoxSA News Journalist',
          profileUrl: `#/author/${author}`
        };

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

  function renderProfileView(subtab) {
    document.body.className = 'item';
    const mainEl = document.getElementById('main');
    if (!mainEl) return;

    const validTabs = ['overview', 'divisions', 'roadmap', 'recruitment'];
    const activeTab = validTabs.includes(subtab) ? subtab : 'overview';

    let bodyHtml = '';

    // TAB 1: OVERVIEW & ORGANIZATIONAL STRUCTURE
    if (activeTab === 'overview') {
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
                Sejak awal berdirinya, FoxSA News hadir sebagai alternatif media independen yang berani, tajam, dan lugas dibandingkan jaringan media konvensional lainnya. Dengan menjunjung tinggi akurasi fakta di lapangan, kecepatan siaran langsung, serta integritas redaksi, FoxSA News kini menjadi salah satu jaringan media paling berpengaruh dan paling banyak diikuti oleh masyarakat San Andreas.
              </p>

              <div class="foxsa-profile-values-grid">
                <div class="profile-value-box">
                  <i class="fa-solid fa-bolt"></i>
                  <div>
                    <strong>Cepat &amp; Akurat</strong>
                    <span>Liputan langsung dari lokasi kejadian bersama aparat &amp; warga.</span>
                  </div>
                </div>
                <div class="profile-value-box">
                  <i class="fa-solid fa-scale-balanced"></i>
                  <div>
                    <strong>Independen &amp; Kredibel</strong>
                    <span>Menyajikan fakta objektif, wawancara narasumber, dan jurnalisme berimbang.</span>
                  </div>
                </div>
                <div class="profile-value-box">
                  <i class="fa-solid fa-tower-broadcast"></i>
                  <div>
                    <strong>Multi-Platform 24/7</strong>
                    <span>Terintegrasi melalui Portal Berita Web, Siaran TV Harian, dan Radio Podcast.</span>
                  </div>
                </div>
              </div>
            </div>

            <div class="foxsa-profile-side-emblem">
              <div class="profile-emblem-Showcase">
                <img src="assets/logo/foxsa-icon.jpg" alt="FoxSA News Official Emblem" />
                <div class="emblem-caption">
                  <strong>FOXSA NEWS NETWORK</strong>
                  <span>Serving The Truth, Delivering The News</span>
                </div>
              </div>
              <div class="profile-quick-facts">
                <div class="qfact-row"><span>Tanggal Berdiri</span><strong>17 November 2025</strong></div>
                <div class="qfact-row"><span>Pendiri / CEO Pertama</span><strong>Messiah Dillard</strong></div>
                <div class="qfact-row"><span>CEO Saat Ini</span><strong>Catherine Cecillie</strong></div>
                <div class="qfact-row"><span>Vice CEO</span><strong>Boniface Ernest</strong></div>
                <div class="qfact-row"><span>Kantor Pusat</span><strong>Los Santos, San Andreas</strong></div>
              </div>
            </div>
          </div>

          <hr class="foxsa-profile-divider" />

          <!-- ORGANIZATIONAL STRUCTURE -->
          <div class="foxsa-org-section">
            <div class="foxsa-org-header">
              <span class="foxsa-profile-kicker"><i class="fa-solid fa-sitemap"></i> STRUKTUR ORGANISASI</span>
              <h3>Jajaran Pimpinan, Manajemen &amp; Redaksi FoxSA News</h3>
              <p>Susunan kepemimpinan eksekutif, divisi sumber daya manusia (HRD), serta tim operasional dan jurnalis FoxSA News Network.</p>
            </div>

            <!-- High Executive Team -->
            <div class="org-tier-block">
              <div class="org-tier-title"><i class="fa-solid fa-crown"></i> High Executive Team</div>
              <div class="org-cards-grid org-grid-3">
                <div class="org-person-card highlight-ceo">
                  <img src="https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEjczAy7LhtUkBsZZzOW5IrPDtx0XsQ_HvUTdjCTdK1uggIg9itmaLx523OOTEdiEAjEoZtHZBmGFl08XshLL-07nbD7NpkwLEEiV3OsyaXUeeKVfTNpotuo32uOi9v6kDXSQRPWseWo0xDNkJAdfVD2YWTupqmUK5mplTs1vBbL_bRBag/s200/pexels-photo-5717546.jpeg" alt="Catherine Cecillie" onerror="this.src='assets/logo/foxsa-icon.jpg'" />
                  <span class="org-role-badge">Chief Executive Officer (CEO)</span>
                  <h4>Catherine Cecillie</h4>
                  <p>Pimpinan tertinggi FoxSA News Network yang mengarahkan visi strategis dan kebijakan penyiaran.</p>
                </div>
                <div class="org-person-card highlight-exec">
                  <img src="assets/logo/foxsa-icon.jpg" alt="Boniface Ernest" />
                  <span class="org-role-badge">Vice Chief Executive Officer</span>
                  <h4>Boniface Ernest</h4>
                  <p>Wakil CEO yang mengawasi jalannya operasional lintas divisi serta kemitraan strategis.</p>
                </div>
                <div class="org-person-card highlight-exec">
                  <img src="https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEijelpjGHfXOoTKfqD1mokSIESF0WySrKkFx3EV9rhrMxaQHJmPSkWe7Lj9QbiFJQbVx7z2os7vSHs3TVJFg1nzGX2MTzdqBO1eO-gppMt99EfwrEBOG9BqW1ZrbkNcNNqd-k9pS8vHOItd_EF7yVe_MfaTvhN2EvXpcWmK7ZDpX94RY14/s200/In%20Edward%20Snowden%E2%80%99s%20New%20Memoir,%20the%20Disclosures%20This%20Time%20Are%20Personal%20(Published%202019).jpg" alt="Arthur Redfields" onerror="this.src='assets/logo/foxsa-icon.jpg'" />
                  <span class="org-role-badge">Secretary Chief &amp; Senior Staff</span>
                  <h4>Arthur Redfields</h4>
                  <p>Sekretaris Utama &amp; Editor Senior yang mengelola administrasi redaksi serta peliputan utama.</p>
                </div>
              </div>
              <div class="org-vacant-pills">
                <span><strong>Commissioner:</strong> Vacant</span>
                <span><strong>GM Human Resource:</strong> Vacant</span>
                <span><strong>GM Event &amp; Sponsorship:</strong> Vacant</span>
              </div>
            </div>

            <!-- Executive & HR Division Team -->
            <div class="org-tier-block">
              <div class="org-tier-title"><i class="fa-solid fa-user-tie"></i> Executive &amp; HR Division Team</div>
              <div class="org-cards-grid org-grid-4">
                <div class="org-person-card">
                  <div class="org-avatar-circle"><i class="fa-solid fa-user-shield"></i></div>
                  <span class="org-role-badge secondary">Manager of Division (HRD)</span>
                  <h4>Nayeon Park</h4>
                  <p>Manajer Sumber Daya Manusia &amp; Rekrutmen Internal.</p>
                </div>
                <div class="org-person-card">
                  <div class="org-avatar-circle"><i class="fa-solid fa-flag-checkered"></i></div>
                  <span class="org-role-badge secondary">Manager (Event)</span>
                  <h4>Jeremiah Howell</h4>
                  <p>Manajer Event &amp; Analis Utama Kejuaraan Motorsport.</p>
                </div>
                <div class="org-person-card">
                  <div class="org-avatar-circle"><i class="fa-solid fa-chart-line"></i></div>
                  <span class="org-role-badge secondary">Head of Affairs &amp; Analyst</span>
                  <h4>Ligma Deek</h4>
                  <p>Executive Staff, Hubungan Eksternal &amp; Analis Berita.</p>
                </div>
                <div class="org-person-card">
                  <div class="org-avatar-circle"><i class="fa-solid fa-shield-halved"></i></div>
                  <span class="org-role-badge secondary">HR Staff &amp; Crime Reporter</span>
                  <h4>Jesus Conway</h4>
                  <p>Staf HRD &amp; Koresponden Kriminal / Kepolisian.</p>
                </div>
                <div class="org-person-card">
                  <div class="org-avatar-circle"><i class="fa-solid fa-id-badge"></i></div>
                  <span class="org-role-badge secondary">HR Staff</span>
                  <h4>Franklin Baxter</h4>
                  <p>Staf Divisi HRD &amp; Pembinaan Anggota.</p>
                </div>
                <div class="org-person-card">
                  <div class="org-avatar-circle"><i class="fa-solid fa-pen-nib"></i></div>
                  <span class="org-role-badge secondary">Senior Staff | Editor</span>
                  <h4>Clarissa Vencant</h4>
                  <p>Editor Senior &amp; Pengarah Kualitas Artikel Redaksi.</p>
                </div>
                <div class="org-person-card">
                  <div class="org-avatar-circle"><i class="fa-solid fa-camera-retro"></i></div>
                  <span class="org-role-badge secondary">Field Reporter</span>
                  <h4>Bryan Andregaz</h4>
                  <p>Jurnalis Lapangan &amp; Dokumentasi Peristiwa San Andreas.</p>
                </div>
                <div class="org-person-card">
                  <div class="org-avatar-circle"><i class="fa-solid fa-newspaper"></i></div>
                  <span class="org-role-badge secondary">Junior Staff | Journalist</span>
                  <h4>Shen Xander</h4>
                  <p>Jurnalis &amp; Tim Liputan Berita Harian FoxSA News.</p>
                </div>
              </div>
            </div>

            <!-- Operational Staff & Internship -->
            <div class="org-tier-block">
              <div class="org-tier-title"><i class="fa-solid fa-users"></i> Operational Staff &amp; Internship</div>
              <div class="org-operational-pills">
                <div class="op-pill"><strong>Jareel Sancho</strong><span>Junior Staff</span></div>
                <div class="op-pill"><strong>Niver Richardson</strong><span>Junior Staff</span></div>
                <div class="op-pill"><strong>Mendoza Souza</strong><span>Internship</span></div>
                <div class="op-pill"><strong>Aaron Qroy</strong><span>Internship</span></div>
                <div class="op-pill"><strong>Sashura Soloveva</strong><span>Internship</span></div>
                <div class="op-pill"><strong>Giovani Marino</strong><span>Internship</span></div>
              </div>
            </div>

            <!-- Official Organization Chart Image -->
            <div class="org-chart-image-card">
              <div class="org-chart-head">
                <h4><i class="fa-solid fa-diagram-project" style="color:#F08D39;"></i> Bagan Struktur Organisasi Resmi FoxSA News</h4>
                <span>Klik gambar untuk melihat ukuran penuh</span>
              </div>
              <a href="assets/logo/foxsa-org-chart.jpg" target="_blank" rel="noopener" class="org-chart-img-link">
                <img src="assets/logo/foxsa-org-chart.jpg" alt="Bagan Struktur Organisasi FoxSA News" loading="lazy" />
              </a>
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
            <h3>3 Divisi Utama FoxSA News Network</h3>
            <p>Setiap divisi memiliki identitas visual dan fokus layanan tersendiri untuk menjangkau seluruh lapisan warga San Andreas melalui televisi, artikel digital, dan frekuensi suara.</p>
          </div>

          <div class="foxsa-divisions-grid">
            <!-- Division 1: FoxSA News Channel -->
            <div class="foxsa-division-card">
              <div class="division-logo-box">
                <img src="assets/logo/foxsa-channel.jpg" alt="FoxSA News Channel Logo" />
              </div>
              <div class="division-body">
                <span class="division-tag">TELEVISI &amp; LIVE BROADCAST</span>
                <h4>FoxSA News Channel</h4>
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
              <div class="division-logo-box">
                <img src="assets/logo/foxsa-media.jpg" alt="FoxSA News Media Logo" />
              </div>
              <div class="division-body">
                <span class="division-tag">PORTAL BERITA DIGITAL &amp; JURNALISME</span>
                <h4>FoxSA News Media</h4>
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
              <div class="division-logo-box">
                <img src="assets/logo/foxsa-audio.jpg" alt="FoxSA Audio & Radio Station Logo" />
              </div>
              <div class="division-body">
                <span class="division-tag">RADIO STATION &amp; PODCAST ACADEMY</span>
                <h4>FoxSA Audio &amp; Radio Station</h4>
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

          <!-- Official Brand Logos Showcase -->
          <div class="foxsa-brand-assets-bar">
            <div class="brand-assets-info">
              <h4><i class="fa-solid fa-palette" style="color:#F08D39;"></i> Identitas Visual Resmi FoxSA News</h4>
              <p>Logo utama dan lambang divisi FoxSA News dirancang dengan perpaduan warna <strong>Dark Navy (#090C1E)</strong>, <strong>FoxSA Orange (#F08D39)</strong>, dan <strong>Broadcast Red (#BA2131)</strong> yang melambangkan ketegasan, kecepatan, serta kredibilitas berita.</p>
            </div>
            <div class="brand-assets-previews">
              <img src="assets/logo/foxsa-icon.jpg" alt="FoxSA Icon" title="FoxSA Main Emblem" />
              <img src="assets/logo/foxsa-channel.jpg" alt="FoxSA Channel" title="FoxSA News Channel" />
              <img src="assets/logo/foxsa-media.jpg" alt="FoxSA Media" title="FoxSA News Media" />
              <img src="assets/logo/foxsa-audio.jpg" alt="FoxSA Audio" title="FoxSA Audio & Radio" />
            </div>
          </div>
        </div>
      `;
    }

    // TAB 3: ROADMAP / PROGRAM & RENCANA PENGEMBANGAN
    else if (activeTab === 'roadmap') {
      const feedbacks = Array.isArray(state.data.profileFeedback) ? state.data.profileFeedback : [];
      const isStaff = !!state.currentUser;

      bodyHtml = `
        <div class="foxsa-profile-section">
          <div class="foxsa-org-header" style="margin-bottom:22px;">
            <span class="foxsa-profile-kicker"><i class="fa-solid fa-rocket"></i> ROADMAP &amp; INOVASI</span>
            <h3>Rencana Pengembangan &amp; Pembaruan FoxSA News</h3>
            <p>FoxSA News tengah menjalankan berbagai langkah strategis untuk meningkatkan kualitas penyajian informasi serta memperluas jangkauan audiens di seluruh San Andreas.</p>
          </div>

          <div class="foxsa-roadmap-grid">
            <div class="roadmap-item-card">
              <div class="roadmap-item-top">
                <span class="roadmap-num">01</span>
                <span class="roadmap-status-pill"><span class="pulse-dot-green"></span> ON-GOING</span>
              </div>
              <h4>Transformasi Newspaper Digital</h4>
              <p>
                Format <em>newspaper</em> dikembangkan menjadi <strong>Berita Harian berbasis teks &amp; web</strong> yang lebih sederhana, informatif, dan mudah diakses kapan saja oleh warga.
              </p>
              <p>
                Konten tidak lagi bergantung pada poster statis seperti Canva, melainkan difokuskan pada penyampaian informasi jurnalistik yang jelas, terstruktur, dan profesional langsung melalui website resmi FoxSA News.
              </p>
            </div>

            <div class="roadmap-item-card">
              <div class="roadmap-item-top">
                <span class="roadmap-num">02</span>
                <span class="roadmap-status-pill"><span class="pulse-dot-green"></span> ON-GOING</span>
              </div>
              <h4>Penjadwalan Broadcast Harian</h4>
              <p>
                FoxSA News menyusun sistem siaran rutin harian guna menjaga konsistensi penyampaian informasi terkini kepada seluruh audiens di San Andreas.
              </p>
              <p>
                <strong>Broadcast dilaksanakan setiap hari</strong> dengan waktu tayang minimal dimulai pada pukul <strong>19.30 WIB</strong>, sehingga meningkatkan keterlibatan serta loyalitas pemirsa setia FoxSA.
              </p>
            </div>

            <div class="roadmap-item-card">
              <div class="roadmap-item-top">
                <span class="roadmap-num">03</span>
                <span class="roadmap-status-pill"><span class="pulse-dot-green"></span> ON-GOING</span>
              </div>
              <h4>Pengembangan Academy melalui Podcast</h4>
              <p>
                Sebagai upaya peningkatan kualitas SDM internal, FoxSA News menghadirkan program <strong>Podcast Academy</strong> untuk melatih anggota dalam berbagai peran penting di dunia <em>broadcasting</em>:
              </p>
              <div class="roadmap-role-tags">
                <span><i class="fa-solid fa-microphone-lines"></i> Presenter</span>
                <span><i class="fa-solid fa-video"></i> Cameraperson</span>
                <span><i class="fa-solid fa-sliders"></i> Mixer / Audio</span>
              </div>
            </div>

            <div class="roadmap-item-card">
              <div class="roadmap-item-top">
                <span class="roadmap-num">04</span>
                <span class="roadmap-status-pill"><span class="pulse-dot-green"></span> ON-GOING</span>
              </div>
              <h4>Kerja Sama Strategis Lintas Instansi</h4>
              <p>
                Memperluas jaringan melalui kolaborasi strategis dengan berbagai pihak di San Andreas untuk meningkatkan kredibilitas, relasi, serta eksistensi FoxSA News di berbagai sektor:
              </p>
              <div class="roadmap-role-tags">
                <span><i class="fa-solid fa-building"></i> Companies di Valliant</span>
                <span><i class="fa-solid fa-shield-halved"></i> Faction LSPD, LSSD &amp; LSFD</span>
              </div>
            </div>
          </div>

          <div class="foxsa-roadmap-closing">
            <h4><i class="fa-solid fa-bullhorn" style="color:#F08D39;"></i> Komitmen &amp; Partisipasi Publik</h4>
            <p>
              FoxSA News berkomitmen untuk terus berkembang sebagai media informasi yang profesional, terpercaya, dan inovatif. Kami sangat terbuka terhadap partisipasi dari seluruh audiens — apabila Anda memiliki <strong>saran, kritik, dan masukan</strong>, silakan tuliskan pada kotak tanggapan di bawah ini.
            </p>
          </div>

          <!-- Interactive Public Suggestion Box -->
          <div class="foxsa-comments-wrap" style="margin-top:24px;">
            <div class="foxsa-comments-header">
              <h3><i class="fa-regular fa-lightbulb" style="color:#F08D39;"></i> Kotak Saran &amp; Masukan Publik FoxSA News</h3>
              <span class="foxsa-badge">${feedbacks.length} Masukan</span>
            </div>

            ${feedbacks.length === 0
              ? `<div class="foxsa-no-comments">Belum ada saran atau masukan. Jadilah yang pertama memberikan saran pengembangan untuk FoxSA News!</div>`
              : `<div class="foxsa-comment-list">
                   ${feedbacks.map(fb => `
                     <div class="foxsa-comment-item">
                       <img class="foxsa-comment-avatar" src="assets/logo/foxsa-icon.jpg" alt="${escapeHtml(fb.author)}" />
                       <div class="foxsa-comment-content">
                         <div class="foxsa-comment-meta">
                           <span class="foxsa-comment-author">${escapeHtml(fb.author)}</span>
                           ${fb.role ? `<span class="foxsa-comment-role">${escapeHtml(fb.role)}</span>` : ''}
                           <span class="foxsa-comment-date">${escapeHtml(formatDateTimeID(fb.date))}</span>
                           ${isStaff ? `<button type="button" class="foxsa-comment-delete" data-del-feedback="${escapeHtml(fb.id)}"><i class="fa-solid fa-trash-can"></i> Hapus</button>` : ''}
                         </div>
                         <div class="foxsa-comment-body">${escapeHtml(fb.body)}</div>
                       </div>
                     </div>
                   `).join('')}
                 </div>`
            }

            <form class="foxsa-comment-form" id="foxsa-profile-feedback-form">
              <h4><i class="fa-solid fa-paper-plane" style="color:#F08D39;margin-right:6px;"></i> Kirim Saran / Masukan untuk Redaksi FoxSA News</h4>
              <div class="foxsa-form-row">
                <div class="foxsa-form-group">
                  <label>Nama Anda / Karakter IC *</label>
                  <input type="text" id="fb-author-input" class="foxsa-input" value="${state.currentUser ? escapeHtml(state.currentUser.displayName) : ''}" placeholder="Contoh: Warga Los Santos" required />
                </div>
                <div class="foxsa-form-group">
                  <label>Afiliasi / Instansi (Opsional)</label>
                  <input type="text" id="fb-role-input" class="foxsa-input" value="${state.currentUser ? 'FoxSA News Staff' : ''}" placeholder="Contoh: Citizen / LSPD / LSFD / Valliant Company" />
                </div>
              </div>
              <div class="foxsa-form-group">
                <label>Saran, Kritik, atau Masukan *</label>
                <textarea id="fb-body-input" class="foxsa-textarea" rows="3" placeholder="Tuliskan saran program atau masukan untuk pengembangan FoxSA News..." required></textarea>
              </div>
              <button type="submit" class="foxsa-btn">
                <i class="fa-solid fa-paper-plane"></i> Kirim Masukan
              </button>
            </form>
          </div>
        </div>
      `;
    }

    // TAB 4: OPEN RECRUITMENT FOXSA NEWS
    else if (activeTab === 'recruitment') {
      bodyHtml = `
        <div class="foxsa-profile-section">
          <div class="foxsa-rec-banner">
            <div class="rec-banner-left">
              <span class="rec-status-badge"><i class="fa-solid fa-bullhorn"></i> OPEN RECRUITMENT FOXSA NEWS</span>
              <h3>Bergabunglah Bersama Tim Jurnalisme &amp; Penyiaran Profesional San Andreas!</h3>
              <p>
                FoxSA News resmi membuka kesempatan bagi kamu yang ingin berkarier sebagai Jurnalis, Reporter Lapangan, Presenter, Cameraperson, maupun Editor. Jika kamu memiliki semangat dalam dunia berita, komunikasi, dan informasi publik, ini saatnya kamu menunjukkan kemampuanmu!
              </p>
              <div class="rec-cta-buttons">
                <a href="https://bit.ly/FoxSAREC-1" target="_blank" rel="noopener" class="foxsa-btn rec-apply-btn">
                  <i class="fa-solid fa-file-signature"></i> Daftar Sekarang (bit.ly/FoxSAREC-1)
                </a>
                <a href="https://discord.gg/KF6qETnr4j" target="_blank" rel="noopener" class="foxsa-btn foxsa-btn-secondary">
                  <i class="fa-brands fa-discord"></i> Hubungi Kami di Discord
                </a>
              </div>
            </div>
            <div class="rec-banner-poster">
              <a href="https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEgrScS06klrWWHG807Twx3hj_U4pXv369aEunc4lJlPoa3Vilx6BlZIZFlrn7LZFJgrkk1BWxhsQd9bu4J_IUf6Lhn3a0Ep40FcbCnpbP8609XcxGBbV8TDPaGmQxXplxmbtgq7jcG5HPV_YY2HYrOZPIp2NXY6YEBq7V_KTuwrT4RNpikcIjzHz8sc8uk/s2245/Biru_Modern_Poster_Paket_Pendakian_Open_Trip_Gunung_20251118_054148_0000%20(1).png" target="_blank" rel="noopener">
                <img src="https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEgrScS06klrWWHG807Twx3hj_U4pXv369aEunc4lJlPoa3Vilx6BlZIZFlrn7LZFJgrkk1BWxhsQd9bu4J_IUf6Lhn3a0Ep40FcbCnpbP8609XcxGBbV8TDPaGmQxXplxmbtgq7jcG5HPV_YY2HYrOZPIp2NXY6YEBq7V_KTuwrT4RNpikcIjzHz8sc8uk/w600/Biru_Modern_Poster_Paket_Pendakian_Open_Trip_Gunung_20251118_054148_0000%20(1).png" alt="Poster Open Recruitment FoxSA News" onerror="this.src='assets/logo/foxsa-channel.jpg'" />
              </a>
            </div>
          </div>

          <div class="foxsa-rec-requirements-grid">
            <!-- Section A: In Character -->
            <div class="rec-req-card">
              <div class="rec-req-head ic-head">
                <span class="req-icon"><i class="fa-solid fa-id-card"></i></span>
                <div>
                  <span class="req-sub">SECTION A</span>
                  <h4>Persyaratan In Character (IC)</h4>
                </div>
              </div>
              <ul class="rec-req-list">
                <li><i class="fa-solid fa-check"></i> Minimal berumur <strong>20 – 30 tahun</strong></li>
                <li><i class="fa-solid fa-check"></i> Memiliki <strong>ID Card &amp; Driving License</strong> yang valid dan aktif</li>
                <li><i class="fa-solid fa-check"></i> Tidak memiliki catatan kriminal berat</li>
                <li><i class="fa-solid fa-check"></i> Sehat jasmani dan rohani serta memiliki kondisi fisik yang baik</li>
                <li><i class="fa-solid fa-check"></i> Memiliki latar belakang pendidikan yang memadai</li>
                <li><i class="fa-solid fa-check"></i> Mampu melakukan <em>public speaking</em> dan fasih berbahasa Indonesia (formal maupun nonformal)</li>
                <li><i class="fa-solid fa-check"></i> Memiliki <em>attitude</em> yang baik (sikap, perilaku, dan tutur kata)</li>
                <li><i class="fa-solid fa-check"></i> Warga negara Amerika atau WNA dengan status <em>permanent resident</em></li>
                <li><i class="fa-solid fa-check"></i> Memiliki minat tinggi dalam literasi, menulis, dan membaca</li>
                <li><i class="fa-solid fa-check"></i> Tidak terlibat dalam penyalahgunaan narkoba atau obat-obatan terlarang</li>
                <li><i class="fa-solid fa-check"></i> Wajib mengikuti seluruh tahapan rekrutmen dan akademi dengan baik</li>
              </ul>
            </div>

            <!-- Section B: Out Of Character -->
            <div class="rec-req-card">
              <div class="rec-req-head ooc-head">
                <span class="req-icon"><i class="fa-solid fa-headset"></i></span>
                <div>
                  <span class="req-sub">SECTION B</span>
                  <h4>Persyaratan Out Of Character (OOC)</h4>
                </div>
              </div>
              <ul class="rec-req-list">
                <li><i class="fa-solid fa-check"></i> Minimal <strong>Level 3</strong> di dalam game</li>
                <li><i class="fa-solid fa-check"></i> Memiliki <em>Character Development</em> (alur karakter) yang jelas</li>
                <li><i class="fa-solid fa-check"></i> Tidak memiliki <em>warn</em> lebih dari 3</li>
                <li><i class="fa-solid fa-check"></i> Menjaga <em>attitude</em> yang baik secara IC maupun OOC</li>
                <li><i class="fa-solid fa-check"></i> Mampu membedakan urusan IC dan OOC dengan tegas</li>
                <li><i class="fa-solid fa-check"></i> Berusia minimal <strong>14 tahun</strong> (OOC)</li>
                <li><i class="fa-solid fa-check"></i> Memiliki rasa tanggung jawab dan komitmen tinggi</li>
                <li><i class="fa-solid fa-check"></i> Dilarang keras melakukan plagiarisme / <em>copy-paste</em> formulir</li>
                <li><i class="fa-solid fa-check"></i> Menguasai penggunaan EYD dan tanda baca yang baik</li>
                <li><i class="fa-solid fa-check"></i> Mampu membagi waktu antara <em>in-game</em> dan <em>real life</em></li>
                <li><i class="fa-solid fa-check"></i> Jujur dan tidak berbohong selama proses recruitment berlangsung</li>
                <li><i class="fa-solid fa-check"></i> Memahami dasar-dasar <em>RolePlay</em> &amp; peraturan server (<em>Breakrules</em>)</li>
              </ul>
            </div>
          </div>

          <div class="foxsa-rec-footer-cta">
            <div>
              <h4>📌 Siap Mendaftar ke FoxSA News?</h4>
              <p>Jika kamu memenuhi seluruh persyaratan IC &amp; OOC di atas, silakan isi formulir pendaftaran resmi kami melalui tautan berikut. Kami tunggu kontribusi terbaikmu di FoxSA News!</p>
            </div>
            <a href="https://bit.ly/FoxSAREC-1" target="_blank" rel="noopener" class="foxsa-btn">
              <i class="fa-solid fa-up-right-from-square"></i> Buka Formulir: bit.ly/FoxSAREC-1
            </a>
          </div>
        </div>
      `;
    }

    mainEl.innerHTML = `
      <div class="foxsa-company-profile-wrap">
        <!-- Company Profile Top Hero Header -->
        <div class="foxsa-profile-hero">
          <div class="profile-hero-bg-pattern"></div>
          <div class="profile-hero-content">
            <img src="assets/logo/foxsa-icon.jpg" alt="FoxSA News" class="profile-hero-logo" />
            <div class="profile-hero-text">
              <div class="profile-hero-badges">
                <span class="p-badge-orange"><i class="fa-solid fa-certificate"></i> OFFICIAL COMPANY PROFILE</span>
                <span class="p-badge-dark"><i class="fa-solid fa-location-dot"></i> LOS SANTOS, SAN ANDREAS</span>
              </div>
              <h1>FoxSA News — Independent News Network</h1>
              <p>Portal Informasi Resmi, Struktur Organisasi, Divisi Penyiaran, Program Pengembangan &amp; Rekrutmen Redaksi FoxSA News.</p>
            </div>
          </div>

          <!-- Sub-Navigation Tabs -->
          <div class="foxsa-profile-tabs">
            <a href="#/profile" class="foxsa-profile-tab ${activeTab === 'overview' ? 'active' : ''}">
              <i class="fa-regular fa-building"></i> Tentang &amp; Struktur
            </a>
            <a href="#/profile/divisions" class="foxsa-profile-tab ${activeTab === 'divisions' ? 'active' : ''}">
              <i class="fa-solid fa-tower-broadcast"></i> Divisi Media &amp; Radio
            </a>
            <a href="#/profile/roadmap" class="foxsa-profile-tab ${activeTab === 'roadmap' ? 'active' : ''}">
              <i class="fa-solid fa-rocket"></i> Program &amp; Rencana
            </a>
            <a href="#/profile/recruitment" class="foxsa-profile-tab ${activeTab === 'recruitment' ? 'active' : ''}">
              <i class="fa-solid fa-bullhorn"></i> Open Recruitment
            </a>
          </div>
        </div>

        <!-- Tab Body Content -->
        <div class="foxsa-profile-card-body">
          ${bodyHtml}
        </div>
      </div>
    `;

    // Bind Feedback Form on Roadmap tab
    const fbForm = document.getElementById('foxsa-profile-feedback-form');
    if (fbForm) {
      fbForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const author = document.getElementById('fb-author-input').value.trim();
        const role = document.getElementById('fb-role-input').value.trim();
        const body = document.getElementById('fb-body-input').value.trim();
        if (!author || !body) return;

        if (!Array.isArray(state.data.profileFeedback)) {
          state.data.profileFeedback = [];
        }
        state.data.profileFeedback.unshift({
          id: 'fb-' + Date.now(),
          author,
          role,
          date: new Date().toISOString(),
          body
        });
        saveDataToLocal(true);
        showToast('Terima kasih! Saran & masukan Anda telah diterima Redaksi FoxSA News.');
        renderProfileView('roadmap');
      });
    }

    mainEl.querySelectorAll('[data-del-feedback]').forEach(btn => {
      btn.addEventListener('click', () => {
        if (!state.currentUser) return;
        const id = btn.getAttribute('data-del-feedback');
        if (!confirm('Hapus masukan ini?')) return;
        state.data.profileFeedback = (state.data.profileFeedback || []).filter(f => String(f.id) !== String(id));
        saveDataToLocal(true);
        showToast('Masukan telah dihapus.');
        renderProfileView('roadmap');
      });
    });
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

    // Add Staff Portal link at the bottom of mobile menu
    const staffLi = document.createElement('li');
    staffLi.innerHTML = `<a href="#/admin" class="admin-nav-btn"><i class="fa-solid fa-user-shield"></i> ${state.currentUser ? `Panel (${escapeHtml(state.currentUser.displayName.split(' ')[0])})` : 'Staff Login'}</a>`;
    clonedUl.appendChild(staffLi);

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
