/**
 * FoxSA News - Dedicated Admin & Editorial Controller
 * Directly interacts with Supabase Cloud for multi-device data synchronization
 */
(function() {
  'use strict';

  const AUTH_SESSION_KEY = 'foxsa_auth_session_v1';
  const STORAGE_KEY = 'foxsa_news_data_v1';
  const DEFAULT_AVATAR = 'assets/logo/foxsa-icon.jpg';

  const OFFICIAL_ROLES = [
    { name: 'Chief Executive Officer', group: 'Executive', color: '#7c3aed', badge: 'bg-purple' },
    { name: 'President Commissioner', group: 'Executive', color: '#6d28d9', badge: 'bg-purple' },
    { name: 'Commissioner', group: 'Executive', color: '#7c3aed', badge: 'bg-purple' },
    { name: 'Chief Operating Officer', group: 'Executive', color: '#2563eb', badge: 'bg-blue' },
    { name: 'Chief Financial Officer', group: 'Executive', color: '#059669', badge: 'bg-green' },
    { name: 'Chief Editor', group: 'Management', color: '#ea580c', badge: 'bg-orange' },
    { name: 'Lead Editor', group: 'Management', color: '#ea580c', badge: 'bg-orange' },
    { name: 'Managing Editor', group: 'Management', color: '#ea580c', badge: 'bg-orange' },
    { name: 'Senior Editor', group: 'Management', color: '#f59e0b', badge: 'bg-amber' },
    { name: 'Editor', group: 'Editorial', color: '#f59e0b', badge: 'bg-amber' },
    { name: 'Associate Editor', group: 'Editorial', color: '#f59e0b', badge: 'bg-amber' },
    { name: 'Station Manager', group: 'Production', color: '#0284c7', badge: 'bg-sky' },
    { name: 'Executive Producer', group: 'Production', color: '#0284c7', badge: 'bg-sky' },
    { name: 'Senior News Anchor', group: 'Production', color: '#0284c7', badge: 'bg-sky' },
    { name: 'Senior Field Reporter', group: 'Reporting', color: '#10b981', badge: 'bg-emerald' },
    { name: 'Investigative Reporter', group: 'Reporting', color: '#dc2626', badge: 'bg-red' },
    { name: 'FoxSA News Journalist & Field Reporter', group: 'Reporting', color: '#10b981', badge: 'bg-emerald' },
    { name: 'Photojournalist & Visual Media', group: 'Media', color: '#8b5cf6', badge: 'bg-violet' },
    { name: 'Junior Reporter', group: 'Trainee', color: '#64748b', badge: 'bg-slate' }
  ];

  const ALL_CATEGORIES = [
    'Crime', 'Government & Emergency Services', 'LSPD', 'SAFR', 'SASD',
    'Los Santos Event', 'Community', 'Politics', 'Business', 'Automotive',
    'Special Report', 'Editorial'
  ];

  // State
  const state = {
    currentUser: null,
    activeTab: 'posts', // 'posts', 'editor', 'chat', 'staff', 'former', 'comments', 'profile', 'supabase'
    editingPostId: null,
    selectedCategories: ['Crime', 'LSPD'],
    posts: [],
    staffAccounts: [],
    formerStaff: [],
    adminChats: [],
    authors: {}
  };

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

  function formatDateID(dateStr) {
    if (!dateStr) return '';
    try {
      const d = new Date(dateStr);
      if (isNaN(d.getTime())) return dateStr;
      return d.toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' });
    } catch (e) {
      return dateStr;
    }
  }

  function formatTimeID(dateStr) {
    if (!dateStr) return '';
    try {
      const d = new Date(dateStr);
      if (isNaN(d.getTime())) return '';
      return d.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' });
    } catch (e) {
      return '';
    }
  }

  function isHighStaff(user) {
    if (!user) return false;
    if (user.isAdmin || user.is_admin) return true;
    const r = String(user.role || '').toLowerCase();
    const u = String(user.username || '').toLowerCase();
    if (['admin', 'arthur', 'rein', 'reinhardt'].includes(u)) return true;
    return r.includes('ceo') || r.includes('chief executive') || r.includes('commissioner') || r.includes('chief editor') || r.includes('managing editor');
  }

  function renderRoleBadge(role) {
    const clean = String(role || '').trim();
    return `<span class="foxsa-cat-chip" style="background:#e0f2fe;color:#0369a1;border:1px solid #bae6fd;padding:2px 8px;font-size:11px;border-radius:4px;"><i class="fa-solid fa-user-tag" style="margin-right:4px;"></i>${escapeHtml(clean || 'Staff Redaksi')}</span>`;
  }

  function showToast(msg, isSuccess = true) {
    let t = document.getElementById('foxsa-admin-toast');
    if (!t) {
      t = document.createElement('div');
      t.id = 'foxsa-admin-toast';
      t.style.position = 'fixed';
      t.style.bottom = '24px';
      t.style.right = '24px';
      t.style.zIndex = '99999';
      t.style.padding = '12px 20px';
      t.style.borderRadius = '8px';
      t.style.fontWeight = '600';
      t.style.fontSize = '13.5px';
      t.style.boxShadow = '0 6px 20px rgba(0,0,0,0.18)';
      t.style.transition = 'all 0.3s ease';
      document.body.appendChild(t);
    }
    t.style.background = isSuccess ? '#090C1E' : '#dc2626';
    t.style.color = '#fff';
    t.style.borderLeft = isSuccess ? '4px solid #F08D39' : '4px solid #fee2e2';
    t.innerHTML = msg;
    t.style.opacity = '1';
    t.style.transform = 'translateY(0)';
    setTimeout(() => {
      t.style.opacity = '0';
      t.style.transform = 'translateY(10px)';
    }, 3500);
  }

  // -----------------------------------------------------------------
  // DATA SYNC WITH SUPABASE
  // -----------------------------------------------------------------
  async function syncAllFromSupabase(forceRender = false) {
    const sb = getSupabaseClient();
    if (!sb) return false;

    let changed = false;

    try {
      // 1. Posts & Articles
      const { data: dbPosts, error: postErr } = await sb
        .from('foxsa_posts')
        .select('*')
        .order('published', { ascending: false });

      if (!postErr && Array.isArray(dbPosts)) {
        if (dbPosts.length > 0) {
          state.posts = dbPosts.map(p => ({
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
          changed = true;
        } else {
          // Table exists but is empty -> seed initial posts
          await seedPostsToSupabase(sb);
        }
      }

      // 2. Staff Accounts
      const { data: dbAccounts, error: accErr } = await sb
        .from('foxsa_staff_accounts')
        .select('*');

      if (!accErr && Array.isArray(dbAccounts) && dbAccounts.length > 0) {
        state.staffAccounts = dbAccounts.map(a => ({
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
        changed = true;
      }

      // 3. Former Staff
      const { data: dbFormer, error: fErr } = await sb
        .from('foxsa_former_staff')
        .select('*');

      if (!fErr && Array.isArray(dbFormer)) {
        state.formerStaff = dbFormer.map(f => ({
          id: f.id,
          name: f.name,
          formerRole: f.former_role,
          category: f.category,
          badge: f.badge,
          period: f.period,
          avatar: f.avatar || DEFAULT_AVATAR,
          bio: f.bio || '',
          legacy: f.legacy || ''
        }));
        changed = true;
      }

      // 4. Admin Chats
      const { data: dbChats, error: cErr } = await sb
        .from('foxsa_admin_chats')
        .select('*')
        .order('created_at', { ascending: true });

      if (!cErr && Array.isArray(dbChats)) {
        state.adminChats = dbChats.map(c => ({
          id: c.id,
          senderUsername: c.sender_username,
          senderName: c.sender_name,
          senderRole: c.sender_role,
          senderAvatar: c.sender_avatar || DEFAULT_AVATAR,
          message: c.message,
          timestamp: c.created_at
        }));
        changed = true;
      }

      // Update current user from updated staff accounts
      if (state.currentUser) {
        const freshUser = state.staffAccounts.find(a => a.username.toLowerCase() === state.currentUser.username.toLowerCase());
        if (freshUser) {
          state.currentUser = freshUser;
          updateHeaderUserUI();
        }
      }

      if (changed && forceRender) {
        renderCurrentTab();
      }
      return true;
    } catch (e) {
      console.warn('Sync Supabase failed:', e);
      return false;
    }
  }

  async function seedPostsToSupabase(sb) {
    if (!window.FOXSA_INITIAL_DATA || !Array.isArray(window.FOXSA_INITIAL_DATA.posts)) return;
    try {
      const records = window.FOXSA_INITIAL_DATA.posts.map(p => ({
        id: String(p.id),
        slug: p.slug || '',
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
      console.warn('Seed posts error:', e);
    }
  }

  function initRealtimeSubscription() {
    const sb = getSupabaseClient();
    if (!sb) return;

    try {
      sb.channel('foxsa-admin-realtime')
        .on('postgres_changes', { event: '*', schema: 'public', table: 'foxsa_admin_chats' }, async () => {
          await syncAllFromSupabase(false);
          if (state.activeTab === 'chat') renderChatTab();
        })
        .on('postgres_changes', { event: '*', schema: 'public', table: 'foxsa_staff_accounts' }, async () => {
          await syncAllFromSupabase(false);
          if (state.activeTab === 'staff') renderStaffTab();
        })
        .on('postgres_changes', { event: '*', schema: 'public', table: 'foxsa_posts' }, async () => {
          await syncAllFromSupabase(false);
          if (state.activeTab === 'posts') renderPostsTab();
        })
        .on('postgres_changes', { event: '*', schema: 'public', table: 'foxsa_former_staff' }, async () => {
          await syncAllFromSupabase(false);
          if (state.activeTab === 'former') renderFormerTab();
        })
        .subscribe();
    } catch (e) {
      console.warn('Realtime subscription error:', e);
    }
  }

  // -----------------------------------------------------------------
  // HEADER USER UI & LOGOUT
  // -----------------------------------------------------------------
  function updateHeaderUserUI() {
    if (!state.currentUser) return;
    const nameEl = document.getElementById('header-user-name');
    const roleEl = document.getElementById('header-user-role');
    const avatarEl = document.getElementById('header-user-avatar');

    if (nameEl) nameEl.textContent = state.currentUser.displayName || state.currentUser.username;
    if (roleEl) roleEl.textContent = state.currentUser.role || 'Staf Redaksi';
    if (avatarEl) avatarEl.src = state.currentUser.avatar || DEFAULT_AVATAR;
  }

  function setupLogout() {
    const logoutBtn = document.getElementById('nav-logout-btn');
    if (logoutBtn) {
      logoutBtn.addEventListener('click', () => {
        if (!confirm('Apakah Anda yakin ingin keluar dari Panel Redaksi FoxSA?')) return;
        localStorage.removeItem(AUTH_SESSION_KEY);
        window.location.href = 'login.html';
      });
    }
  }

  // -----------------------------------------------------------------
  // ROLE CHOOSER POPUP MODAL
  // -----------------------------------------------------------------
  function openRoleChooserModal({ title, currentRole, onSave }) {
    const existing = document.getElementById('foxsa-role-modal');
    if (existing) existing.remove();

    const curClean = (currentRole || '').trim().toLowerCase();
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
              ${OFFICIAL_ROLES.map(r => `
                <option value="${escapeHtml(r.name)}" ${r.name.toLowerCase() === curClean ? 'selected' : ''}>${escapeHtml(r.name)} (${r.group})</option>
              `).join('')}
              <option value="__custom__" ${!OFFICIAL_ROLES.some(r => r.name.toLowerCase() === curClean) ? 'selected' : ''}>+ Custom / Jabatan Lainnya</option>
            </select>
          </div>
          <div class="foxsa-form-group" id="role-modal-custom-wrap" style="display:${!OFFICIAL_ROLES.some(r => r.name.toLowerCase() === curClean) ? 'block' : 'none'};margin-bottom:14px;">
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
        alert('Harap pilih atau ketik nama role terlebih dahulu.');
        return;
      }
      closeModal();
      onSave(chosen);
    });
  }

  // -----------------------------------------------------------------
  // TABS RENDERING
  // -----------------------------------------------------------------
  function renderAdminShell() {
    const mainEl = document.getElementById('admin-main-wrap');
    if (!mainEl) return;

    const totalPosts = state.posts.length;
    const pendingStaffCount = state.staffAccounts.filter(a => a.status === 'pending').length;
    const approvedStaffCount = state.staffAccounts.filter(a => a.status !== 'pending').length;
    const totalComments = state.posts.reduce((acc, p) => acc + ((p.comments && p.comments.length) || 0), 0);
    const totalChats = state.adminChats.length;

    mainEl.innerHTML = `
      <div class="foxsa-admin-panel">
        
        <!-- Tab Navigation Bar -->
        <div class="foxsa-admin-tabs">
          <button type="button" class="foxsa-admin-tab ${state.activeTab === 'posts' ? 'active' : ''}" data-tab="posts">
            <i class="fa-regular fa-newspaper"></i> Berita (${totalPosts})
          </button>
          <button type="button" class="foxsa-admin-tab ${state.activeTab === 'editor' ? 'active' : ''}" data-tab="editor">
            <i class="fa-solid fa-feather-pointed"></i> ${state.editingPostId ? 'Edit Berita' : '+ Tulis Berita'}
          </button>
          <button type="button" class="foxsa-admin-tab ${state.activeTab === 'chat' ? 'active' : ''}" data-tab="chat">
            <i class="fa-solid fa-comments"></i> Chat Redaksi ${totalChats > 0 ? `<span class="foxsa-tab-badge" style="background:#F08D39;color:#fff;">${totalChats}</span>` : ''}
          </button>
          <button type="button" class="foxsa-admin-tab ${state.activeTab === 'staff' ? 'active' : ''}" data-tab="staff">
            <i class="fa-solid fa-users-gear"></i> Akun Staff (${approvedStaffCount})
            ${pendingStaffCount > 0 ? `<span class="foxsa-pending-badge" style="background:#ea580c;color:#fff;padding:2px 7px;border-radius:10px;font-size:11px;margin-left:6px;">${pendingStaffCount} ACC</span>` : ''}
          </button>
          <button type="button" class="foxsa-admin-tab ${state.activeTab === 'former' ? 'active' : ''}" data-tab="former">
            <i class="fa-solid fa-graduation-cap"></i> Former Staff (${state.formerStaff.length})
          </button>
          <button type="button" class="foxsa-admin-tab ${state.activeTab === 'comments' ? 'active' : ''}" data-tab="comments">
            <i class="fa-regular fa-comments"></i> Komentar (${totalComments})
          </button>
          <button type="button" class="foxsa-admin-tab ${state.activeTab === 'profile' ? 'active' : ''}" data-tab="profile">
            <i class="fa-solid fa-user-pen"></i> Profil Saya
          </button>
          <button type="button" class="foxsa-admin-tab ${state.activeTab === 'supabase' ? 'active' : ''}" data-tab="supabase">
            <i class="fa-solid fa-database"></i> Database Cloud
          </button>
        </div>

        <!-- Tab Body Content -->
        <div class="foxsa-admin-body" id="admin-tab-body">
          <!-- Injected dynamically -->
        </div>

      </div>
    `;

    // Bind tab clicks
    mainEl.querySelectorAll('[data-tab]').forEach(btn => {
      btn.addEventListener('click', () => {
        const target = btn.getAttribute('data-tab');
        if (target !== 'editor') {
          state.editingPostId = null;
        }
        state.activeTab = target;
        try {
          history.replaceState(null, '', '#/' + target);
        } catch (e) {}
        renderAdminShell();
        renderCurrentTab();
      });
    });

    renderCurrentTab();
  }

  function renderCurrentTab() {
    const bodyEl = document.getElementById('admin-tab-body');
    if (!bodyEl) return;

    if (state.activeTab === 'posts') renderPostsTab();
    else if (state.activeTab === 'editor') renderEditorTab();
    else if (state.activeTab === 'chat') renderChatTab();
    else if (state.activeTab === 'staff') renderStaffTab();
    else if (state.activeTab === 'former') renderFormerTab();
    else if (state.activeTab === 'comments') renderCommentsTab();
    else if (state.activeTab === 'profile') renderProfileTab();
    else if (state.activeTab === 'supabase') renderSupabaseTab();
  }

  // -----------------------------------------------------------------
  // 1. POSTS TAB
  // -----------------------------------------------------------------
  function renderPostsTab() {
    const bodyEl = document.getElementById('admin-tab-body');
    if (!bodyEl) return;

    const posts = state.posts;

    bodyEl.innerHTML = `
      <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:16px;flex-wrap:wrap;gap:12px;">
        <div>
          <h3 style="margin:0 0 4px;font-size:17px;color:#090C1E;font-family:'Poppins',sans-serif;">Daftar Artikel Berita FoxSA News</h3>
          <p style="margin:0;font-size:12.5px;color:#64748b;">Total ${posts.length} artikel dipublikasikan dan tersinkronisasi dengan Supabase Cloud.</p>
        </div>
        <button type="button" class="foxsa-btn" id="btn-create-new-post" style="padding:8px 18px;font-size:13px;">
          <i class="fa-solid fa-plus"></i> Tulis Berita Baru
        </button>
      </div>

      <div class="foxsa-table-responsive">
        <table class="foxsa-admin-table">
          <thead>
            <tr>
              <th style="width:70px;">Thumb</th>
              <th>Judul &amp; Kategori</th>
              <th style="width:180px;">Penulis &amp; Role</th>
              <th style="width:130px;">Tanggal</th>
              <th style="width:70px;text-align:center;">Populer</th>
              <th style="width:130px;text-align:center;">Aksi</th>
            </tr>
          </thead>
          <tbody>
            ${posts.length === 0 ? `
              <tr>
                <td colspan="6" style="text-align:center;padding:40px;color:#94a3b8;">
                  <i class="fa-solid fa-folder-open" style="font-size:32px;margin-bottom:10px;display:block;"></i>
                  Belum ada artikel berita. Klik <strong>Tulis Berita Baru</strong> untuk menerbitkan artikel pertama!
                </td>
              </tr>
            ` : posts.map(p => `
              <tr>
                <td>
                  <img src="${p.featuredImage || 'assets/logo/foxsa-icon.jpg'}" alt="Thumb" style="width:58px;height:42px;object-fit:cover;border-radius:4px;border:1px solid #e2e8f0;" />
                </td>
                <td>
                  <a href="index.html#/post/${p.id}" target="_blank" style="font-weight:700;color:#0f172a;text-decoration:none;display:block;margin-bottom:4px;line-height:1.4;">
                    ${escapeHtml(p.title)} <i class="fa-solid fa-arrow-up-right-from-square" style="font-size:10px;color:#94a3b8;"></i>
                  </a>
                  <div style="display:flex;flex-wrap:wrap;gap:4px;">
                    ${(p.labels || []).map(l => `<span class="foxsa-cat-chip" style="font-size:10.5px;padding:1px 6px;">#${escapeHtml(l)}</span>`).join('')}
                  </div>
                </td>
                <td>
                  <div style="font-weight:600;font-size:12.5px;color:#1e293b;">${escapeHtml(p.author)}</div>
                  <div style="display:flex;align-items:center;gap:6px;margin-top:2px;">
                    ${renderRoleBadge(p.authorBio)}
                    ${isHighStaff(state.currentUser) ? `
                      <button type="button" class="foxsa-editor-btn" data-set-post-role="${p.id}" style="padding:1px 6px;font-size:10px;" title="Ubah Jabatan Penulis">
                        <i class="fa-solid fa-user-gear"></i> Set Role
                      </button>
                    ` : ''}
                  </div>
                </td>
                <td style="font-size:12px;color:#64748b;white-space:nowrap;">
                  ${escapeHtml(formatDateID(p.published))}
                </td>
                <td style="text-align:center;">
                  <button type="button" class="foxsa-editor-btn" data-toggle-pop="${p.id}" title="Tampilkan di Berita Populer">
                    <i class="fa-${p.popular ? 'solid' : 'regular'} fa-star" style="color:${p.popular ? '#F08D39' : '#94a3b8'};font-size:14px;"></i>
                  </button>
                </td>
                <td style="text-align:center;white-space:nowrap;">
                  <button type="button" class="foxsa-editor-btn" data-edit-post="${p.id}" title="Edit Berita">
                    <i class="fa-solid fa-pen"></i> Edit
                  </button>
                  <button type="button" class="foxsa-editor-btn" style="color:#dc2626;border-color:#fecaca;" data-delete-post="${p.id}" title="Hapus Berita">
                    <i class="fa-solid fa-trash"></i>
                  </button>
                </td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </div>
    `;

    // Bind create new post button
    const createBtn = document.getElementById('btn-create-new-post');
    if (createBtn) {
      createBtn.addEventListener('click', () => {
        state.editingPostId = null;
        state.selectedCategories = ['Crime', 'LSPD'];
        state.activeTab = 'editor';
        renderAdminShell();
      });
    }

    // Toggle Popular
    bodyEl.querySelectorAll('[data-toggle-pop]').forEach(btn => {
      btn.addEventListener('click', async () => {
        const id = btn.getAttribute('data-toggle-pop');
        const p = state.posts.find(x => x.id === id);
        if (!p) return;
        p.popular = !p.popular;
        renderPostsTab();
        showToast(p.popular ? 'Artikel ditandai sebagai Berita Populer!' : 'Artikel dihapus dari Berita Populer.');

        const sb = getSupabaseClient();
        if (sb) {
          try {
            await sb.from('foxsa_posts').update({ popular: p.popular }).eq('id', id);
          } catch (e) {}
        }
      });
    });

    // Edit Post
    bodyEl.querySelectorAll('[data-edit-post]').forEach(btn => {
      btn.addEventListener('click', () => {
        state.editingPostId = btn.getAttribute('data-edit-post');
        state.activeTab = 'editor';
        renderAdminShell();
      });
    });

    // Delete Post
    bodyEl.querySelectorAll('[data-delete-post]').forEach(btn => {
      btn.addEventListener('click', async () => {
        const id = btn.getAttribute('data-delete-post');
        const p = state.posts.find(x => x.id === id);
        if (!p) return;
        if (!confirm(`Apakah Anda yakin ingin menghapus artikel berita "${p.title}"?`)) return;

        state.posts = state.posts.filter(x => x.id !== id);
        renderPostsTab();
        showToast('Artikel berhasil dihapus!');

        const sb = getSupabaseClient();
        if (sb) {
          try {
            await sb.from('foxsa_posts').delete().eq('id', id);
          } catch (e) {}
        }
      });
    });

    // Set Role for Post Author
    bodyEl.querySelectorAll('[data-set-post-role]').forEach(btn => {
      btn.addEventListener('click', () => {
        const postId = btn.getAttribute('data-set-post-role');
        const post = state.posts.find(p => p.id === postId);
        if (!post) return;
        openRoleChooserModal({
          title: `Pilih Jabatan / Role resmi untuk penulis "${post.author}" (Artikel: ${post.title}):`,
          currentRole: post.authorBio,
          onSave: async (chosen) => {
            post.authorBio = chosen;
            renderPostsTab();
            showToast(`Jabatan ${post.author} diperbarui menjadi "${chosen}"!`);

            const sb = getSupabaseClient();
            if (sb) {
              try {
                await sb.from('foxsa_posts').update({ author_bio: chosen }).eq('id', postId);
              } catch (e) {}
            }
          }
        });
      });
    });
  }

  // -----------------------------------------------------------------
  // 2. EDITOR TAB (SIMPLIFIED ZERO-HTML VISUAL EDITOR)
  // -----------------------------------------------------------------
  function renderEditorTab() {
    const bodyEl = document.getElementById('admin-tab-body');
    if (!bodyEl) return;

    const isEdit = Boolean(state.editingPostId);
    const post = isEdit ? state.posts.find(p => p.id === state.editingPostId) : null;

    if (post && Array.isArray(post.labels)) {
      state.selectedCategories = [...post.labels];
    }

    const currentAuthorName = (post && post.author) || state.currentUser.displayName || state.currentUser.authorName || state.currentUser.username;
    const currentAuthorBio = (post && post.authorBio) || state.currentUser.role || 'Junior Reporter';
    const currentAuthorAvatar = (post && post.authorAvatar) || state.currentUser.avatar || DEFAULT_AVATAR;

    bodyEl.innerHTML = `
      <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:16px;flex-wrap:wrap;gap:10px;">
        <div>
          <h3 style="margin:0 0 4px;font-size:18px;color:#090C1E;font-family:'Poppins',sans-serif;">
            <i class="fa-solid fa-feather-pointed" style="color:#F08D39;"></i>
            ${isEdit ? 'Edit Artikel Berita' : 'Tulis & Publikasikan Berita Baru'}
          </h3>
          <p style="margin:0;font-size:12.5px;color:#64748b;">Visual Studio Editor — format artikel berita tanpa perlu coding HTML.</p>
        </div>
        <button type="button" class="foxsa-btn foxsa-btn-outline" id="editor-back-btn" style="padding:6px 14px;font-size:12px;">
          <i class="fa-solid fa-arrow-left"></i> Kembali ke Daftar Berita
        </button>
      </div>

      <form id="foxsa-post-editor-form" class="foxsa-editor-card" style="background:#fff;border:1px solid #e2e8f0;border-radius:12px;padding:24px;box-shadow:0 4px 14px rgba(0,0,0,0.04);">
        
        <!-- Judul Artikel -->
        <div class="foxsa-form-group">
          <label style="font-weight:700;font-size:13.5px;color:#090C1E;margin-bottom:6px;display:block;">Judul Artikel Berita *</label>
          <input type="text" id="post-title-input" class="foxsa-input" value="${escapeHtml(post ? post.title : '')}" placeholder="Ketik judul artikel berita yang menarik &amp; profesional..." required style="font-size:15px;font-weight:600;" />
        </div>

        <!-- Kategori / Labels -->
        <div class="foxsa-form-group">
          <label style="font-weight:700;font-size:13px;color:#090C1E;margin-bottom:6px;display:block;">Kategori Berita (Pilih satu atau lebih) *</label>
          <div id="editor-category-pills" style="display:flex;flex-wrap:wrap;gap:8px;margin-bottom:8px;">
            ${ALL_CATEGORIES.map(cat => {
              const sel = state.selectedCategories.some(s => s.toLowerCase() === cat.toLowerCase());
              return `
                <button type="button" class="foxsa-cat-pill ${sel ? 'selected' : ''}" data-cat="${escapeHtml(cat)}" style="background:${sel ? '#F08D39' : '#f1f5f9'};color:${sel ? '#fff' : '#334155'};border:1px solid ${sel ? '#F08D39' : '#cbd5e1'};padding:5px 12px;border-radius:20px;font-size:12px;cursor:pointer;font-weight:600;">
                  <i class="fa-solid fa-${sel ? 'check' : 'plus'}"></i> #${escapeHtml(cat)}
                </button>
              `;
            }).join('')}
          </div>
          <div id="editor-category-summary" style="font-size:12px;color:#64748b;">
            Kategori terpilih: <strong>${state.selectedCategories.join(', ') || 'Belum ada'}</strong>
          </div>
        </div>

        <!-- Featured Image Thumbnail URL -->
        <div class="foxsa-form-group">
          <label style="font-weight:700;font-size:13px;color:#090C1E;margin-bottom:6px;display:block;">URL Gambar Sampul (Thumbnail) *</label>
          <div class="foxsa-input-icon-wrap" style="margin-bottom:8px;">
            <i class="fa-solid fa-image"></i>
            <input type="url" id="post-thumb-input" class="foxsa-input" value="${escapeHtml(post ? post.featuredImage : '')}" placeholder="https://blogger.googleusercontent.com/... atau link gambar ImgBB" required />
          </div>
          <div id="thumb-preview-wrap" style="display:${post && post.featuredImage ? 'block' : 'none'};">
            <img id="thumb-preview-img" src="${post ? post.featuredImage : ''}" alt="Preview" style="max-width:240px;height:120px;object-fit:cover;border-radius:8px;border:1px solid #e2e8f0;" />
          </div>
        </div>

        <!-- Snippet Ringkasan -->
        <div class="foxsa-form-group">
          <label style="font-weight:700;font-size:13px;color:#090C1E;margin-bottom:6px;display:block;">Ringkasan / Lead In (Snippet Singkat)</label>
          <textarea id="post-snippet-input" class="foxsa-input" rows="2" placeholder="Tuliskan 1-2 kalimat ringkasan inti peristiwa berita ini..." style="resize:vertical;">${escapeHtml(post ? post.snippet : '')}</textarea>
        </div>

        <!-- VISUAL EDITOR TOOLBAR -->
        <div class="foxsa-form-group">
          <label style="font-weight:700;font-size:13px;color:#090C1E;margin-bottom:6px;display:block;">Isi Lengkap Berita (Visual Canvas Editor) *</label>
          
          <div class="foxsa-visual-toolbar" style="background:#f8fafc;border:1px solid #cbd5e1;border-bottom:none;border-radius:8px 8px 0 0;padding:8px 10px;display:flex;flex-wrap:wrap;gap:6px;">
            <button type="button" class="foxsa-tool-btn" data-cmd="bold" title="Tebal (Ctrl+B)"><i class="fa-solid fa-bold"></i></button>
            <button type="button" class="foxsa-tool-btn" data-cmd="italic" title="Miring (Ctrl+I)"><i class="fa-solid fa-italic"></i></button>
            <button type="button" class="foxsa-tool-btn" data-cmd="underline" title="Garis Bawah (Ctrl+U)"><i class="fa-solid fa-underline"></i></button>
            <span style="border-right:1px solid #cbd5e1;margin:0 4px;"></span>
            <button type="button" class="foxsa-tool-btn" data-cmd="justifyLeft" title="Rata Kiri"><i class="fa-solid fa-align-left"></i></button>
            <button type="button" class="foxsa-tool-btn" data-cmd="justifyCenter" title="Rata Tengah"><i class="fa-solid fa-align-center"></i></button>
            <button type="button" class="foxsa-tool-btn" data-cmd="justifyJustify" title="Rata Kanan Kiri (Justify)"><i class="fa-solid fa-align-justify"></i></button>
            <span style="border-right:1px solid #cbd5e1;margin:0 4px;"></span>
            <button type="button" class="foxsa-tool-btn" data-cmd="formatBlock" data-val="h3" title="Sub-Judul (H3)"><i class="fa-solid fa-heading"></i>3</button>
            <button type="button" class="foxsa-tool-btn" data-cmd="formatBlock" data-val="blockquote" title="Kutipan Saksi / Narasumber"><i class="fa-solid fa-quote-left"></i></button>
            <button type="button" class="foxsa-tool-btn" data-cmd="insertUnorderedList" title="Poin Bullet"><i class="fa-solid fa-list-ul"></i></button>
            <span style="border-right:1px solid #cbd5e1;margin:0 4px;"></span>
            <button type="button" class="foxsa-tool-btn" id="editor-btn-insert-img" title="Sisipkan Foto Liputan"><i class="fa-solid fa-camera"></i> Sisipkan Foto</button>
          </div>

          <div id="foxsa-visual-canvas" contenteditable="true" style="min-height:280px;background:#fff;border:1px solid #cbd5e1;border-radius:0 0 8px 8px;padding:16px 20px;font-size:15px;line-height:1.7;color:#1e293b;outline:none;">
            ${post ? post.content : '<p style="text-align:justify;">Tuliskan paragraf pertama pembuka berita Anda di sini...</p>'}
          </div>
        </div>

        <!-- Penulis & Role Info Bar -->
        <div style="background:#f8fafc;border:1px solid #e2e8f0;border-radius:8px;padding:12px 16px;margin-bottom:20px;display:flex;align-items:center;justify-content:space-between;flex-wrap:wrap;gap:10px;">
          <div style="display:flex;align-items:center;gap:10px;">
            <img src="${currentAuthorAvatar}" alt="Author" style="width:36px;height:36px;border-radius:50%;object-fit:cover;border:1px solid #F08D39;" />
            <div>
              <div style="font-weight:700;font-size:13px;color:#0f172a;">${escapeHtml(currentAuthorName)}</div>
              <div style="font-size:11px;color:#64748b;">${escapeHtml(currentAuthorBio)}</div>
            </div>
          </div>
          <div style="display:flex;align-items:center;gap:8px;">
            <label style="font-size:12.5px;color:#334155;cursor:pointer;display:flex;align-items:center;gap:6px;">
              <input type="checkbox" id="post-is-popular" ${post && post.popular ? 'checked' : ''} />
              <span>Tandai sebagai <strong>Most Popular</strong></span>
            </label>
          </div>
        </div>

        <!-- Actions -->
        <div style="display:flex;justify-content:flex-end;gap:12px;">
          <button type="button" class="foxsa-btn foxsa-btn-outline" id="editor-cancel-btn" style="padding:10px 20px;">
            Batal
          </button>
          <button type="submit" class="foxsa-btn" id="editor-submit-btn" style="padding:10px 24px;font-weight:700;">
            <i class="fa-solid fa-paper-plane"></i> ${isEdit ? 'Simpan Perubahan Artikel' : 'Publikasikan Berita ke Supabase'}
          </button>
        </div>

      </form>
    `;

    // Category pill toggle
    bodyEl.querySelectorAll('[data-cat]').forEach(btn => {
      btn.addEventListener('click', () => {
        const cat = btn.getAttribute('data-cat');
        const idx = state.selectedCategories.findIndex(s => s.toLowerCase() === cat.toLowerCase());
        if (idx >= 0) {
          state.selectedCategories.splice(idx, 1);
        } else {
          state.selectedCategories.push(cat);
        }
        renderEditorTab();
      });
    });

    // Thumb input live preview
    const thumbInp = document.getElementById('post-thumb-input');
    const thumbWrap = document.getElementById('thumb-preview-wrap');
    const thumbImg = document.getElementById('thumb-preview-img');
    if (thumbInp && thumbWrap && thumbImg) {
      thumbInp.addEventListener('input', () => {
        const val = thumbInp.value.trim();
        if (val) {
          thumbWrap.style.display = 'block';
          thumbImg.src = val;
        } else {
          thumbWrap.style.display = 'none';
        }
      });
    }

    // Visual formatting toolbar
    const canvas = document.getElementById('foxsa-visual-canvas');
    bodyEl.querySelectorAll('.foxsa-tool-btn[data-cmd]').forEach(btn => {
      btn.addEventListener('click', () => {
        const cmd = btn.getAttribute('data-cmd');
        const val = btn.getAttribute('data-val') || null;
        document.execCommand(cmd, false, val);
        if (canvas) canvas.focus();
      });
    });

    // Insert Image Button
    const insertImgBtn = document.getElementById('editor-btn-insert-img');
    if (insertImgBtn) {
      insertImgBtn.addEventListener('click', () => {
        const imgUrl = prompt('Masukkan URL Gambar/Foto Berita:');
        if (!imgUrl || !imgUrl.trim()) return;
        const caption = prompt('Keterangan / Caption Foto (Opsional):') || '';
        const snippet = `
          <div class="separator" style="clear: both; text-align: center; margin: 16px 0;">
            <img src="${escapeHtml(imgUrl.trim())}" alt="${escapeHtml(caption)}" style="max-width:100%; height:auto; border-radius:6px;" />
            ${caption ? `<div style="font-size:12px;color:#64748b;font-style:italic;margin-top:4px;">${escapeHtml(caption)}</div>` : ''}
          </div>
          <p style="text-align:justify;"><br/></p>
        `;
        document.execCommand('insertHTML', false, snippet);
      });
    }

    // Back & Cancel buttons
    const backBtn = document.getElementById('editor-back-btn');
    const cancelBtn = document.getElementById('editor-cancel-btn');
    const goBack = () => {
      state.editingPostId = null;
      state.activeTab = 'posts';
      renderAdminShell();
    };
    if (backBtn) backBtn.addEventListener('click', goBack);
    if (cancelBtn) cancelBtn.addEventListener('click', goBack);

    // Form Submit
    const form = document.getElementById('foxsa-post-editor-form');
    if (form) {
      form.addEventListener('submit', async (e) => {
        e.preventDefault();
        const title = document.getElementById('post-title-input').value.trim();
        const featuredImage = thumbInp.value.trim();
        const snippet = document.getElementById('post-snippet-input').value.trim();
        const content = canvas.innerHTML.trim();
        const isPopular = document.getElementById('post-is-popular').checked;

        if (!title) {
          alert('Judul artikel berita tidak boleh kosong!');
          return;
        }
        if (state.selectedCategories.length === 0) {
          alert('Pilih minimal 1 kategori berita!');
          return;
        }

        const submitBtn = document.getElementById('editor-submit-btn');
        if (submitBtn) {
          submitBtn.disabled = true;
          submitBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Menyimpan ke Supabase Cloud...';
        }

        const now = new Date().toISOString();
        const postId = isEdit && post ? post.id : ('post_' + Date.now() + '_' + Math.random().toString(36).substr(2, 5));
        const slug = title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');

        const postRecord = {
          id: postId,
          slug,
          title,
          published: isEdit && post ? post.published : now,
          updated: now,
          author: currentAuthorName,
          author_avatar: currentAuthorAvatar,
          author_bio: currentAuthorBio,
          labels: state.selectedCategories,
          featured_image: featuredImage,
          snippet: snippet || title,
          content: content,
          original_url: isEdit && post ? post.originalUrl : `#/post/${postId}`,
          popular: isPopular,
          comments: isEdit && post ? (post.comments || []) : []
        };

        // Local state update
        if (isEdit) {
          const exIdx = state.posts.findIndex(p => p.id === postId);
          if (exIdx >= 0) {
            state.posts[exIdx] = {
              ...postRecord,
              authorAvatar: postRecord.author_avatar,
              authorBio: postRecord.author_bio,
              featuredImage: postRecord.featured_image,
              originalUrl: postRecord.original_url
            };
          }
        } else {
          state.posts.unshift({
            ...postRecord,
            authorAvatar: postRecord.author_avatar,
            authorBio: postRecord.author_bio,
            featuredImage: postRecord.featured_image,
            originalUrl: postRecord.original_url
          });
        }

        // Sync to Supabase
        const sb = getSupabaseClient();
        if (sb) {
          try {
            await sb.from('foxsa_posts').upsert(postRecord, { onConflict: 'id' });
          } catch (err) {
            console.warn('Supabase post upsert error:', err);
          }
        }

        showToast(isEdit ? 'Perubahan artikel berhasil disimpan!' : 'Berita baru berhasil dipublikasikan ke Supabase Cloud!');
        state.editingPostId = null;
        state.activeTab = 'posts';
        renderAdminShell();
      });
    }
  }

  // -----------------------------------------------------------------
  // 3. CHAT REDAKSI TAB (LIVE REAL-TIME NEWSROOM COORDINATION)
  // -----------------------------------------------------------------
  function renderChatTab() {
    const bodyEl = document.getElementById('admin-tab-body');
    if (!bodyEl) return;

    const chats = state.adminChats;

    bodyEl.innerHTML = `
      <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:14px;flex-wrap:wrap;gap:10px;">
        <div>
          <h3 style="margin:0 0 4px;font-size:17px;color:#090C1E;font-family:'Poppins',sans-serif;">
            <i class="fa-solid fa-comments" style="color:#F08D39;"></i>
            Chat Redaksi &amp; Koordinasi Liputan Lapangan
          </h3>
          <p style="margin:0;font-size:12.5px;color:#64748b;">Kanal komunikasi internal tim redaksi FoxSA News — tersinkron otomatis real-time ke Supabase Cloud.</p>
        </div>
        <span class="foxsa-cat-chip" style="background:#ecfdf5;color:#059669;border:1px solid #a7f3d0;padding:4px 10px;font-size:11.5px;font-weight:700;">
          <i class="fa-solid fa-circle" style="font-size:8px;margin-right:4px;color:#10b981;"></i> Realtime Supabase Active
        </span>
      </div>

      <div style="background:#fff;border:1px solid #e2e8f0;border-radius:12px;overflow:hidden;box-shadow:0 4px 14px rgba(0,0,0,0.04);">
        
        <!-- Messages Box -->
        <div id="foxsa-chat-box" style="height:440px;overflow-y:auto;padding:20px;background:#f8fafc;display:flex;flex-direction:column;gap:14px;">
          ${chats.length === 0 ? `
            <div style="text-align:center;margin:auto;color:#94a3b8;">
              <i class="fa-solid fa-comments" style="font-size:36px;margin-bottom:10px;display:block;"></i>
              Belum ada pesan koordinasi. Kirim pesan pertama untuk tim redaksi!
            </div>
          ` : chats.map(c => {
            const isMe = state.currentUser && state.currentUser.username.toLowerCase() === (c.senderUsername || '').toLowerCase();
            return `
              <div style="display:flex;gap:12px;align-items:flex-start;${isMe ? 'flex-direction:row-reverse;' : ''}">
                <img src="${c.senderAvatar || DEFAULT_AVATAR}" alt="Avatar" style="width:38px;height:38px;border-radius:50%;object-fit:cover;border:2px solid #F08D39;flex-shrink:0;" />
                <div style="max-width:75%;background:${isMe ? '#090C1E' : '#fff'};color:${isMe ? '#f8fafc' : '#1e293b'};border:1px solid ${isMe ? '#1e293b' : '#e2e8f0'};padding:10px 14px;border-radius:12px;box-shadow:0 2px 6px rgba(0,0,0,0.04);position:relative;">
                  <div style="display:flex;align-items:center;justify-content:space-between;gap:8px;margin-bottom:4px;font-size:11px;">
                    <span style="font-weight:700;color:${isMe ? '#F08D39' : '#0f172a'};">${escapeHtml(c.senderName)}</span>
                    <span style="color:${isMe ? '#94a3b8' : '#64748b'};">${formatTimeID(c.timestamp)}</span>
                  </div>
                  <div style="font-size:13.5px;line-height:1.5;word-break:break-word;">
                    ${escapeHtml(c.message)}
                  </div>
                  <div style="display:flex;justify-content:space-between;align-items:center;margin-top:6px;font-size:10px;color:${isMe ? '#94a3b8' : '#64748b'};">
                    <span>${escapeHtml(c.senderRole || 'Staf Redaksi')}</span>
                    ${(isMe || isHighStaff(state.currentUser)) ? `
                      <button type="button" data-del-chat="${c.id}" style="background:none;border:none;color:#ef4444;cursor:pointer;padding:0 4px;font-size:10px;" title="Hapus pesan">&times; Hapus</button>
                    ` : ''}
                  </div>
                </div>
              </div>
            `;
          }).join('')}
        </div>

        <!-- Quick Tags & Input Form -->
        <div style="padding:14px 18px;background:#fff;border-top:1px solid #e2e8f0;">
          <div style="display:flex;gap:6px;flex-wrap:wrap;margin-bottom:8px;">
            <button type="button" class="foxsa-chat-tag-pill" data-tag="[URGENT]">🚨 [URGENT]</button>
            <button type="button" class="foxsa-chat-tag-pill" data-tag="[BREAKING]">🔥 [BREAKING]</button>
            <button type="button" class="foxsa-chat-tag-pill" data-tag="[LIVESTREAM]">📹 [LIVESTREAM]</button>
            <button type="button" class="foxsa-chat-tag-pill" data-tag="[KOORDINASI]">📋 [KOORDINASI]</button>
          </div>
          <form id="foxsa-chat-form" style="display:flex;gap:10px;">
            <input type="text" id="foxsa-chat-input" class="foxsa-input" placeholder="Tulis instruksi atau pesan liputan untuk seluruh redaksi..." style="flex:1;" required autocomplete="off" />
            <button type="submit" class="foxsa-btn" style="padding:8px 20px;font-weight:700;">
              <i class="fa-solid fa-paper-plane"></i> Kirim
            </button>
          </form>
        </div>

      </div>
    `;

    // Auto scroll chat box
    const box = document.getElementById('foxsa-chat-box');
    if (box) box.scrollTop = box.scrollHeight;

    // Quick tags click
    const input = document.getElementById('foxsa-chat-input');
    bodyEl.querySelectorAll('[data-tag]').forEach(pill => {
      pill.addEventListener('click', () => {
        const tag = pill.getAttribute('data-tag');
        if (input) {
          input.value = tag + ' ' + input.value;
          input.focus();
        }
      });
    });

    // Chat form submit
    const form = document.getElementById('foxsa-chat-form');
    if (form) {
      form.addEventListener('submit', async (e) => {
        e.preventDefault();
        const text = input.value.trim();
        if (!text) return;

        const newMsg = {
          id: 'chat_' + Date.now() + '_' + Math.random().toString(36).substr(2, 5),
          sender_username: state.currentUser.username,
          sender_name: state.currentUser.displayName || state.currentUser.username,
          sender_role: state.currentUser.role || 'Staf Redaksi',
          sender_avatar: state.currentUser.avatar || DEFAULT_AVATAR,
          message: text,
          created_at: new Date().toISOString()
        };

        state.adminChats.push({
          id: newMsg.id,
          senderUsername: newMsg.sender_username,
          senderName: newMsg.sender_name,
          senderRole: newMsg.sender_role,
          senderAvatar: newMsg.sender_avatar,
          message: newMsg.message,
          timestamp: newMsg.created_at
        });

        input.value = '';
        renderChatTab();

        const sb = getSupabaseClient();
        if (sb) {
          try {
            await sb.from('foxsa_admin_chats').insert([newMsg]);
          } catch (err) {
            console.warn('Chat insert error:', err);
          }
        }
      });
    }

    // Delete chat message
    bodyEl.querySelectorAll('[data-del-chat]').forEach(btn => {
      btn.addEventListener('click', async () => {
        const id = btn.getAttribute('data-del-chat');
        if (!confirm('Hapus pesan koordinasi ini?')) return;
        state.adminChats = state.adminChats.filter(c => c.id !== id);
        renderChatTab();

        const sb = getSupabaseClient();
        if (sb) {
          try {
            await sb.from('foxsa_admin_chats').delete().eq('id', id);
          } catch (e) {}
        }
      });
    });
  }

  // -----------------------------------------------------------------
  // 4. STAFF TAB (MEMBERS, PENDING ACC, ROLES & PASSWORDS)
  // -----------------------------------------------------------------
  function renderStaffTab() {
    const bodyEl = document.getElementById('admin-tab-body');
    if (!bodyEl) return;

    const pending = state.staffAccounts.filter(a => a.status === 'pending');
    const approved = state.staffAccounts.filter(a => a.status !== 'pending' && !a.isFormer);
    const userIsHighStaff = isHighStaff(state.currentUser);

    bodyEl.innerHTML = `
      <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:16px;flex-wrap:wrap;gap:10px;">
        <div>
          <h3 style="margin:0 0 4px;font-size:17px;color:#090C1E;font-family:'Poppins',sans-serif;">
            <i class="fa-solid fa-users-gear" style="color:#F08D39;"></i>
            Kelola Anggota Staf &amp; Persetujuan (ACC)
          </h3>
          <p style="margin:0;font-size:12.5px;color:#64748b;">Semua akun tersimpan aman di database Supabase Cloud.</p>
        </div>
        <button type="button" class="foxsa-btn foxsa-btn-outline" id="btn-copy-reg-link" style="padding:6px 14px;font-size:12.5px;">
          <i class="fa-solid fa-share-nodes"></i> Bagikan Link Registrasi
        </button>
      </div>

      <!-- ================= PENDING APPROVAL SECTION ================= -->
      ${pending.length > 0 ? `
        <div style="background:#fffbeb;border:1px solid #fde68a;border-radius:10px;padding:16px 20px;margin-bottom:24px;">
          <div style="display:flex;align-items:center;gap:10px;margin-bottom:12px;">
            <i class="fa-solid fa-hourglass-half" style="color:#d97706;font-size:18px;"></i>
            <h4 style="margin:0;font-size:15px;color:#92400e;font-family:'Poppins',sans-serif;">
              Permintaan Registrasi Menunggu Persetujuan / ACC (${pending.length} Calon Anggota)
            </h4>
          </div>

          <div class="foxsa-table-responsive">
            <table class="foxsa-admin-table" style="background:#fff;">
              <thead>
                <tr>
                  <th>Calon Jurnalis</th>
                  <th>Username</th>
                  <th>Jabatan Diajukan</th>
                  <th style="width:200px;text-align:center;">Verifikasi &amp; ACC</th>
                </tr>
              </thead>
              <tbody>
                ${pending.map(p => `
                  <tr>
                    <td>
                      <div style="display:flex;align-items:center;gap:10px;">
                        <img src="${p.avatar || DEFAULT_AVATAR}" alt="Avatar" style="width:34px;height:34px;border-radius:50%;object-fit:cover;border:1px solid #F08D39;" />
                        <strong>${escapeHtml(p.displayName)}</strong>
                      </div>
                    </td>
                    <td><code>@${escapeHtml(p.username)}</code></td>
                    <td>
                      <select class="foxsa-select" data-acc-role-select="${p.username}" style="padding:4px 8px;font-size:12px;">
                        ${OFFICIAL_ROLES.map(r => `
                          <option value="${escapeHtml(r.name)}" ${r.name.toLowerCase() === (p.role || '').toLowerCase() ? 'selected' : ''}>${escapeHtml(r.name)}</option>
                        `).join('')}
                      </select>
                    </td>
                    <td style="text-align:center;white-space:nowrap;">
                      <button type="button" class="foxsa-btn" data-approve-staff="${p.username}" style="background:#059669;border-color:#059669;padding:5px 12px;font-size:12px;margin-right:6px;">
                        <i class="fa-solid fa-check"></i> ACC / Setujui
                      </button>
                      <button type="button" class="foxsa-btn foxsa-btn-danger" data-reject-staff="${p.username}" style="padding:5px 10px;font-size:12px;">
                        <i class="fa-solid fa-xmark"></i> Tolak
                      </button>
                    </td>
                  </tr>
                `).join('')}
              </tbody>
            </table>
          </div>
        </div>
      ` : ''}

      <!-- ================= APPROVED ACTIVE STAFF SECTION ================= -->
      <div style="background:#fff;border:1px solid #e2e8f0;border-radius:10px;padding:20px;margin-bottom:24px;">
        <h4 style="margin:0 0 14px;font-size:15px;color:#090C1E;display:flex;align-items:center;gap:8px;">
          <i class="fa-solid fa-id-badge" style="color:#2563eb;"></i>
          Daftar Staf Aktif Terdaftar (${approved.length} Anggota)
        </h4>

        <div class="foxsa-table-responsive">
          <table class="foxsa-admin-table">
            <thead>
              <tr>
                <th>Foto &amp; Nama Lengkap IC</th>
                <th>Username</th>
                <th>Jabatan / Role Resmi</th>
                <th>Password</th>
                <th style="width:200px;text-align:center;">Kelola Akun</th>
              </tr>
            </thead>
            <tbody>
              ${approved.map(a => `
                <tr>
                  <td>
                    <div style="display:flex;align-items:center;gap:10px;">
                      <img src="${a.avatar || DEFAULT_AVATAR}" alt="Avatar" style="width:34px;height:34px;border-radius:50%;object-fit:cover;border:1px solid #F08D39;" />
                      <div>
                        <strong>${escapeHtml(a.displayName)}</strong>
                        ${a.isAdmin ? '<span class="foxsa-cat-chip" style="background:#7c3aed;color:#fff;font-size:9.5px;padding:1px 5px;margin-left:4px;">ADMIN</span>' : ''}
                      </div>
                    </div>
                  </td>
                  <td><code>@${escapeHtml(a.username)}</code></td>
                  <td>${renderRoleBadge(a.role)}</td>
                  <td>
                    <span class="pwd-mask" data-pwd="${escapeHtml(a.password)}">••••••••</span>
                    <button type="button" class="foxsa-editor-btn" data-toggle-pwd-mask style="padding:1px 6px;font-size:10px;margin-left:4px;"><i class="fa-regular fa-eye"></i></button>
                  </td>
                  <td style="text-align:center;white-space:nowrap;">
                    ${userIsHighStaff ? `
                      <button type="button" class="foxsa-editor-btn" data-edit-role="${a.username}" title="Ubah Jabatan Resmi">
                        <i class="fa-solid fa-user-tag"></i> Role
                      </button>
                      <button type="button" class="foxsa-editor-btn" data-edit-avatar="${a.username}" title="Ganti Foto Profil">
                        <i class="fa-solid fa-image"></i> Foto
                      </button>
                      ${a.username !== 'admin' ? `
                        <button type="button" class="foxsa-editor-btn" data-retire-staff="${a.username}" style="color:#d97706;border-color:#fde68a;" title="Purnatugaskan ke Former Staff">
                          <i class="fa-solid fa-graduation-cap"></i> Purnatugas
                        </button>
                      ` : ''}
                    ` : ''}
                    <button type="button" class="foxsa-editor-btn" data-change-pwd="${a.username}" title="Ubah Password">
                      <i class="fa-solid fa-key"></i> Pass
                    </button>
                    ${(userIsHighStaff && a.username !== 'admin') ? `
                      <button type="button" class="foxsa-editor-btn" data-delete-staff="${a.username}" style="color:#dc2626;border-color:#fecaca;" title="Hapus Akun">
                        <i class="fa-solid fa-trash"></i>
                      </button>
                    ` : ''}
                  </td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>
      </div>

      <!-- ================= TAMBAH STAF SECARA MANUAL ================= -->
      <div style="background:#fff;border:1px solid #e2e8f0;border-radius:10px;padding:20px;">
        <h4 style="margin:0 0 12px;font-size:15px;color:#090C1E;display:flex;align-items:center;gap:8px;">
          <i class="fa-solid fa-user-plus" style="color:#059669;"></i>
          Tambah Staf Baru Secara Manual
        </h4>
        <form id="form-manual-add-staff" style="display:grid;grid-template-columns:repeat(auto-fit, minmax(200px, 1fr));gap:12px;align-items:end;">
          <div>
            <label style="font-size:12px;font-weight:600;display:block;margin-bottom:4px;">Username Login *</label>
            <input type="text" id="manual-staff-user" class="foxsa-input" placeholder="kevin (tanpa spasi)" required />
          </div>
          <div>
            <label style="font-size:12px;font-weight:600;display:block;margin-bottom:4px;">Nama Lengkap IC *</label>
            <input type="text" id="manual-staff-name" class="foxsa-input" placeholder="Kevin Salvatore" required />
          </div>
          <div>
            <label style="font-size:12px;font-weight:600;display:block;margin-bottom:4px;">Jabatan Resmi *</label>
            <select id="manual-staff-role" class="foxsa-select">
              ${OFFICIAL_ROLES.map(r => `<option value="${escapeHtml(r.name)}">${escapeHtml(r.name)}</option>`).join('')}
            </select>
          </div>
          <div>
            <label style="font-size:12px;font-weight:600;display:block;margin-bottom:4px;">Password Akun *</label>
            <input type="password" id="manual-staff-pass" class="foxsa-input" placeholder="Minimal 4 karakter" required />
          </div>
          <button type="submit" class="foxsa-btn" style="height:38px;font-weight:700;">
            <i class="fa-solid fa-user-check"></i> Simpan &amp; Aktifkan
          </button>
        </form>
      </div>
    `;

    // Copy registration link
    const copyBtn = document.getElementById('btn-copy-reg-link');
    if (copyBtn) {
      copyBtn.addEventListener('click', () => {
        const regUrl = `${window.location.origin}/login.html?tab=register`;
        if (navigator.clipboard && navigator.clipboard.writeText) {
          navigator.clipboard.writeText(regUrl).then(() => {
            showToast('Link registrasi berhasil disalin: ' + regUrl);
          });
        } else {
          prompt('Salin link registrasi berikut:', regUrl);
        }
      });
    }

    // ACC Approval
    bodyEl.querySelectorAll('[data-approve-staff]').forEach(btn => {
      btn.addEventListener('click', async () => {
        const username = btn.getAttribute('data-approve-staff');
        const acc = state.staffAccounts.find(a => a.username === username);
        if (!acc) return;
        const roleSel = bodyEl.querySelector(`[data-acc-role-select="${username}"]`);
        const chosenRole = roleSel ? roleSel.value.trim() : (acc.role || 'Junior Reporter');

        acc.status = 'approved';
        acc.role = chosenRole;
        renderStaffTab();
        showToast(`Akun @${acc.username} (${acc.displayName}) berhasil di-ACC sebagai "${chosenRole}"!`);

        const sb = getSupabaseClient();
        if (sb) {
          try {
            await sb.from('foxsa_staff_accounts').update({ status: 'approved', role: chosenRole }).eq('username', username);
          } catch (e) {}
        }
      });
    });

    // Reject Staff
    bodyEl.querySelectorAll('[data-reject-staff]').forEach(btn => {
      btn.addEventListener('click', async () => {
        const username = btn.getAttribute('data-reject-staff');
        if (!confirm(`Tolak dan batalkan pendaftaran akun @${username}?`)) return;

        state.staffAccounts = state.staffAccounts.filter(a => a.username !== username);
        renderStaffTab();
        showToast(`Pendaftaran @${username} ditolak.`);

        const sb = getSupabaseClient();
        if (sb) {
          try {
            await sb.from('foxsa_staff_accounts').delete().eq('username', username);
          } catch (e) {}
        }
      });
    });

    // Toggle Password Mask
    bodyEl.querySelectorAll('[data-toggle-pwd-mask]').forEach(btn => {
      btn.addEventListener('click', () => {
        const span = btn.parentElement.querySelector('.pwd-mask');
        if (!span) return;
        const real = span.getAttribute('data-pwd');
        if (span.textContent === '••••••••') {
          span.textContent = real;
        } else {
          span.textContent = '••••••••';
        }
      });
    });

    // Change Password
    bodyEl.querySelectorAll('[data-change-pwd]').forEach(btn => {
      btn.addEventListener('click', async () => {
        const username = btn.getAttribute('data-change-pwd');
        const acc = state.staffAccounts.find(a => a.username === username);
        if (!acc) return;
        const newPass = prompt(`Masukkan password baru untuk akun @${acc.username} (${acc.displayName}):`, acc.password);
        if (!newPass || !newPass.trim()) return;

        acc.password = newPass.trim();
        renderStaffTab();
        showToast(`Password untuk @${acc.username} berhasil diubah!`);

        const sb = getSupabaseClient();
        if (sb) {
          try {
            await sb.from('foxsa_staff_accounts').update({ password: acc.password }).eq('username', username);
          } catch (e) {}
        }
      });
    });

    // Edit Role
    bodyEl.querySelectorAll('[data-edit-role]').forEach(btn => {
      btn.addEventListener('click', () => {
        const username = btn.getAttribute('data-edit-role');
        const acc = state.staffAccounts.find(a => a.username === username);
        if (!acc) return;
        openRoleChooserModal({
          title: `Pilih Jabatan / Role resmi untuk "${acc.displayName}" (@${acc.username}):`,
          currentRole: acc.role,
          onSave: async (chosen) => {
            acc.role = chosen;
            renderStaffTab();
            showToast(`Jabatan ${acc.displayName} diperbarui menjadi "${chosen}"!`);

            const sb = getSupabaseClient();
            if (sb) {
              try {
                await sb.from('foxsa_staff_accounts').update({ role: chosen }).eq('username', username);
              } catch (e) {}
            }
          }
        });
      });
    });

    // Edit Avatar
    bodyEl.querySelectorAll('[data-edit-avatar]').forEach(btn => {
      btn.addEventListener('click', async () => {
        const username = btn.getAttribute('data-edit-avatar');
        const acc = state.staffAccounts.find(a => a.username === username);
        if (!acc) return;
        const newAvatar = prompt(`Masukkan URL Foto Profil baru untuk @${acc.username}:`, acc.avatar || '');
        if (newAvatar !== null && newAvatar.trim()) {
          acc.avatar = newAvatar.trim();
          renderStaffTab();
          showToast(`Foto profil @${acc.username} diperbarui!`);

          const sb = getSupabaseClient();
          if (sb) {
            try {
              await sb.from('foxsa_staff_accounts').update({ avatar: acc.avatar }).eq('username', username);
            } catch (e) {}
          }
        }
      });
    });

    // Retire to Former Staff
    bodyEl.querySelectorAll('[data-retire-staff]').forEach(btn => {
      btn.addEventListener('click', async () => {
        const username = btn.getAttribute('data-retire-staff');
        const acc = state.staffAccounts.find(a => a.username === username);
        if (!acc) return;

        const roleVal = prompt(`Gelar / Jabatan Terakhir Purna Tugas:`, acc.role || 'Former Senior Reporter');
        if (!roleVal) return;
        const quoteVal = prompt(`Pesan Kesan / Warisan (Legacy Quote):`, 'Terima kasih atas dedikasi dan pengabdian jurnalistik di FoxSA News.') || '';

        const newFormer = {
          id: 'former_' + acc.username,
          name: acc.displayName,
          former_role: roleVal,
          category: 'staff',
          badge: 'Purna Tugas',
          period: '2025 - 2026',
          avatar: acc.avatar || DEFAULT_AVATAR,
          bio: acc.bio || '',
          legacy: quoteVal
        };

        state.formerStaff.push({
          id: newFormer.id,
          name: newFormer.name,
          formerRole: newFormer.former_role,
          category: newFormer.category,
          badge: newFormer.badge,
          period: newFormer.period,
          avatar: newFormer.avatar,
          bio: newFormer.bio,
          legacy: newFormer.legacy
        });

        acc.isFormer = true;
        renderStaffTab();
        showToast(`${acc.displayName} berhasil dipindahkan ke Galeri Former Staff!`);

        const sb = getSupabaseClient();
        if (sb) {
          try {
            await sb.from('foxsa_former_staff').upsert([newFormer], { onConflict: 'id' });
            await sb.from('foxsa_staff_accounts').update({ is_former: true }).eq('username', username);
          } catch (e) {}
        }
      });
    });

    // Delete Staff
    bodyEl.querySelectorAll('[data-delete-staff]').forEach(btn => {
      btn.addEventListener('click', async () => {
        const username = btn.getAttribute('data-delete-staff');
        if (!confirm(`Hapus akun staff @${username} secara permanen?`)) return;

        state.staffAccounts = state.staffAccounts.filter(a => a.username !== username);
        renderStaffTab();
        showToast('Akun staff dihapus.');

        const sb = getSupabaseClient();
        if (sb) {
          try {
            await sb.from('foxsa_staff_accounts').delete().eq('username', username);
          } catch (e) {}
        }
      });
    });

    // Add Staff Form
    const addForm = document.getElementById('form-manual-add-staff');
    if (addForm) {
      addForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const username = document.getElementById('manual-staff-user').value.trim().toLowerCase().replace(/\s+/g, '');
        const displayName = document.getElementById('manual-staff-name').value.trim();
        const role = document.getElementById('manual-staff-role').value.trim();
        const password = document.getElementById('manual-staff-pass').value.trim();

        if (!username || !displayName || !password) return;
        if (state.staffAccounts.some(a => a.username.toLowerCase() === username)) {
          alert('Username @' + username + ' sudah terdaftar!');
          return;
        }

        const newStaff = {
          username,
          password,
          display_name: displayName,
          author_name: displayName,
          role,
          status: 'approved',
          is_admin: false,
          is_former: false,
          avatar: DEFAULT_AVATAR,
          quote: '',
          bio: ''
        };

        state.staffAccounts.push({
          username,
          password,
          displayName,
          authorName: displayName,
          role,
          status: 'approved',
          isAdmin: false,
          isFormer: false,
          avatar: DEFAULT_AVATAR,
          quote: '',
          bio: ''
        });

        renderStaffTab();
        showToast(`Akun @${username} (${displayName}) berhasil ditambahkan & diaktifkan!`);

        const sb = getSupabaseClient();
        if (sb) {
          try {
            await sb.from('foxsa_staff_accounts').insert([newStaff]);
          } catch (err) {}
        }
      });
    }
  }

  // -----------------------------------------------------------------
  // 5. FORMER STAFF TAB (ALUMNI & HALL OF FAME)
  // -----------------------------------------------------------------
  function renderFormerTab() {
    const bodyEl = document.getElementById('admin-tab-body');
    if (!bodyEl) return;

    const former = state.formerStaff;

    bodyEl.innerHTML = `
      <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:16px;flex-wrap:wrap;gap:10px;">
        <div>
          <h3 style="margin:0 0 4px;font-size:17px;color:#090C1E;font-family:'Poppins',sans-serif;">
            <i class="fa-solid fa-graduation-cap" style="color:#F08D39;"></i>
            Galeri Mantan Staf &amp; Hall of Fame FoxSA News
          </h3>
          <p style="margin:0;font-size:12.5px;color:#64748b;">Merekam jejak pengabdian dan kontribusi seluruh alumni staf di San Andreas.</p>
        </div>
        <button type="button" class="foxsa-btn" id="btn-add-former-manual" style="padding:6px 14px;font-size:12px;">
          <i class="fa-solid fa-plus"></i> Tambah Mantan Staf Manual
        </button>
      </div>

      <div class="foxsa-table-responsive">
        <table class="foxsa-admin-table">
          <thead>
            <tr>
              <th>Foto &amp; Nama Alumni</th>
              <th>Jabatan Terakhir</th>
              <th>Masa Bakti</th>
              <th>Kutipan / Warisan (Legacy)</th>
              <th style="width:140px;text-align:center;">Aksi</th>
            </tr>
          </thead>
          <tbody>
            ${former.length === 0 ? `
              <tr>
                <td colspan="5" style="text-align:center;padding:40px;color:#94a3b8;">
                  Belum ada data former staff di Supabase.
                </td>
              </tr>
            ` : former.map(f => `
              <tr>
                <td>
                  <div style="display:flex;align-items:center;gap:10px;">
                    <img src="${f.avatar || DEFAULT_AVATAR}" alt="Avatar" style="width:36px;height:36px;border-radius:50%;object-fit:cover;border:1px solid #F08D39;" />
                    <div>
                      <strong>${escapeHtml(f.name)}</strong>
                      ${f.badge ? `<div style="font-size:10px;color:#d97706;font-weight:700;">${escapeHtml(f.badge)}</div>` : ''}
                    </div>
                  </div>
                </td>
                <td><span class="foxsa-cat-chip" style="background:#fef3c7;color:#92400e;border:1px solid #fde68a;">${escapeHtml(f.formerRole)}</span></td>
                <td style="font-size:12px;color:#64748b;">${escapeHtml(f.period)}</td>
                <td style="font-size:12px;color:#475569;max-width:240px;line-height:1.4;">
                  “${escapeHtml(f.legacy || f.bio || 'Dedikasi terbaik untuk pers San Andreas.')}”
                </td>
                <td style="text-align:center;white-space:nowrap;">
                  <button type="button" class="foxsa-editor-btn" data-restore-former="${f.id}" title="Aktifkan Kembali ke Staf Aktif">
                    <i class="fa-solid fa-rotate-left"></i> Aktifkan
                  </button>
                  <button type="button" class="foxsa-editor-btn" data-del-former="${f.id}" style="color:#dc2626;border-color:#fecaca;" title="Hapus dari Hall of Fame">
                    <i class="fa-solid fa-trash"></i>
                  </button>
                </td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </div>
    `;

    // Add former manual
    const addBtn = document.getElementById('btn-add-former-manual');
    if (addBtn) {
      addBtn.addEventListener('click', async () => {
        const name = prompt('Nama Lengkap Mantan Staf:');
        if (!name || !name.trim()) return;
        const role = prompt('Gelar / Jabatan Terakhir:', 'Former Senior Reporter') || 'Former Senior Reporter';
        const period = prompt('Masa Bakti / Periode:', '2025 - 2026') || '2025 - 2026';
        const legacy = prompt('Pesan Kesan / Legacy Quote:', 'Dedikasi luar biasa untuk pembangunan FoxSA News Agency.') || '';

        const newId = 'former_' + Date.now();
        const rec = {
          id: newId,
          name: name.trim(),
          former_role: role,
          category: 'staff',
          badge: 'Alumni Terhormat',
          period,
          avatar: DEFAULT_AVATAR,
          bio: '',
          legacy
        };

        state.formerStaff.push({
          id: rec.id,
          name: rec.name,
          formerRole: rec.former_role,
          category: rec.category,
          badge: rec.badge,
          period: rec.period,
          avatar: rec.avatar,
          bio: rec.bio,
          legacy: rec.legacy
        });

        renderFormerTab();
        showToast(`${rec.name} ditambahkan ke Hall of Fame!`);

        const sb = getSupabaseClient();
        if (sb) {
          try {
            await sb.from('foxsa_former_staff').insert([rec]);
          } catch (e) {}
        }
      });
    }

    // Restore Former Staff to Active Staff
    bodyEl.querySelectorAll('[data-restore-former]').forEach(btn => {
      btn.addEventListener('click', async () => {
        const id = btn.getAttribute('data-restore-former');
        const f = state.formerStaff.find(x => x.id === id);
        if (!f) return;
        if (!confirm(`Aktifkan kembali ${f.name} ke jajaran Staf Aktif FoxSA News?`)) return;

        // Check matching staff account
        const acc = state.staffAccounts.find(a => a.displayName.toLowerCase() === f.name.toLowerCase());
        if (acc) {
          acc.isFormer = false;
          acc.status = 'approved';
        }

        state.formerStaff = state.formerStaff.filter(x => x.id !== id);
        renderFormerTab();
        showToast(`${f.name} berhasil diaktifkan kembali ke Staf Aktif!`);

        const sb = getSupabaseClient();
        if (sb) {
          try {
            await sb.from('foxsa_former_staff').delete().eq('id', id);
            if (acc) {
              await sb.from('foxsa_staff_accounts').update({ is_former: false, status: 'approved' }).eq('username', acc.username);
            }
          } catch (e) {}
        }
      });
    });

    // Delete Former Staff
    bodyEl.querySelectorAll('[data-del-former]').forEach(btn => {
      btn.addEventListener('click', async () => {
        const id = btn.getAttribute('data-del-former');
        if (!confirm('Hapus profil alumni ini secara permanen?')) return;

        state.formerStaff = state.formerStaff.filter(x => x.id !== id);
        renderFormerTab();
        showToast('Profil alumni dihapus.');

        const sb = getSupabaseClient();
        if (sb) {
          try {
            await sb.from('foxsa_former_staff').delete().eq('id', id);
          } catch (e) {}
        }
      });
    });
  }

  // -----------------------------------------------------------------
  // 6. COMMENTS TAB
  // -----------------------------------------------------------------
  function renderCommentsTab() {
    const bodyEl = document.getElementById('admin-tab-body');
    if (!bodyEl) return;

    const allComments = [];
    state.posts.forEach(p => {
      (p.comments || []).forEach(c => {
        allComments.push({
          comment: c,
          post: p
        });
      });
    });

    bodyEl.innerHTML = `
      <div style="margin-bottom:16px;">
        <h3 style="margin:0 0 4px;font-size:17px;color:#090C1E;font-family:'Poppins',sans-serif;">
          <i class="fa-regular fa-comments" style="color:#F08D39;"></i>
          Moderasi Komentar Pembaca (${allComments.length} Komentar)
        </h3>
        <p style="margin:0;font-size:12.5px;color:#64748b;">Kelola opini dan tanggapan publik pada artikel berita FoxSA News.</p>
      </div>

      <div class="foxsa-table-responsive">
        <table class="foxsa-admin-table">
          <thead>
            <tr>
              <th>Artikel Berita</th>
              <th>Nama Pengirim</th>
              <th>Isi Komentar</th>
              <th>Tanggal</th>
              <th style="width:80px;text-align:center;">Aksi</th>
            </tr>
          </thead>
          <tbody>
            ${allComments.length === 0 ? `
              <tr>
                <td colspan="5" style="text-align:center;padding:40px;color:#94a3b8;">
                  Belum ada komentar pembaca pada artikel berita.
                </td>
              </tr>
            ` : allComments.map(({ comment, post }) => `
              <tr>
                <td style="max-width:220px;">
                  <a href="index.html#/post/${post.id}" target="_blank" style="font-weight:700;color:#0f172a;text-decoration:none;">
                    ${escapeHtml(post.title)}
                  </a>
                </td>
                <td><strong>${escapeHtml(comment.author || 'Pembaca')}</strong></td>
                <td style="font-size:13px;line-height:1.4;">${escapeHtml(comment.text)}</td>
                <td style="font-size:12px;color:#64748b;white-space:nowrap;">${formatDateID(comment.published)}</td>
                <td style="text-align:center;">
                  <button type="button" class="foxsa-editor-btn" style="color:#dc2626;border-color:#fecaca;" data-del-comment="${comment.id}" data-post-id="${post.id}" title="Hapus Komentar">
                    <i class="fa-solid fa-trash"></i>
                  </button>
                </td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </div>
    `;

    // Delete comment
    bodyEl.querySelectorAll('[data-del-comment]').forEach(btn => {
      btn.addEventListener('click', async () => {
        const cId = btn.getAttribute('data-del-comment');
        const pId = btn.getAttribute('data-post-id');
        const p = state.posts.find(x => x.id === pId);
        if (!p) return;
        if (!confirm('Hapus komentar ini?')) return;

        p.comments = (p.comments || []).filter(c => String(c.id) !== String(cId));
        renderCommentsTab();
        showToast('Komentar dihapus.');

        const sb = getSupabaseClient();
        if (sb) {
          try {
            await sb.from('foxsa_posts').update({ comments: p.comments }).eq('id', pId);
          } catch (e) {}
        }
      });
    });
  }

  // -----------------------------------------------------------------
  // 7. PROFIL SAYA TAB (LIVE AVATAR UPLOAD, NAME, BIO, PASS)
  // -----------------------------------------------------------------
  function renderProfileTab() {
    const bodyEl = document.getElementById('admin-tab-body');
    if (!bodyEl) return;

    const u = state.currentUser;
    if (!u) return;

    bodyEl.innerHTML = `
      <div style="margin-bottom:16px;">
        <h3 style="margin:0 0 4px;font-size:17px;color:#090C1E;font-family:'Poppins',sans-serif;">
          <i class="fa-solid fa-user-pen" style="color:#F08D39;"></i>
          Profil &amp; Identitas Jurnalis
        </h3>
        <p style="margin:0;font-size:12.5px;color:#64748b;">Perubahan profil Anda akan langsung tersinkron ke artikel, chat redaksi, dan database Supabase.</p>
      </div>

      <div style="display:grid;grid-template-columns:repeat(auto-fit, minmax(280px, 1fr));gap:24px;">
        
        <!-- Form Edit Profil -->
        <form id="form-myprofile" style="background:#fff;border:1px solid #e2e8f0;border-radius:12px;padding:22px;box-shadow:0 4px 14px rgba(0,0,0,0.04);">
          
          <div class="foxsa-form-group">
            <label style="font-weight:700;font-size:13px;display:block;margin-bottom:4px;">Nama Lengkap IC / Jurnalis *</label>
            <input type="text" id="myprofile-name-inp" class="foxsa-input" value="${escapeHtml(u.displayName || u.username)}" required />
          </div>

          <div class="foxsa-form-group">
            <label style="font-weight:700;font-size:13px;display:block;margin-bottom:4px;">URL Foto Profil *</label>
            <input type="url" id="myprofile-avatar-url" class="foxsa-input" value="${escapeHtml(u.avatar || '')}" placeholder="https://... link foto profil jurnalis" />
          </div>

          <div class="foxsa-form-group">
            <label style="font-weight:700;font-size:13px;display:block;margin-bottom:4px;">Atau Upload File Gambar Langsung:</label>
            <input type="file" id="myprofile-avatar-file" accept="image/*" class="foxsa-input" style="padding:6px;" />
            <small id="file-upload-info" style="color:#64748b;font-size:11.5px;margin-top:2px;display:block;"></small>
          </div>

          <div class="foxsa-form-group">
            <label style="font-weight:700;font-size:13px;display:block;margin-bottom:4px;">Pesan / Motto Jurnalistik (Quote)</label>
            <textarea id="myprofile-quote-inp" class="foxsa-input" rows="2" placeholder="Prinsip jurnalisme Anda...">${escapeHtml(u.quote || '')}</textarea>
          </div>

          <div class="foxsa-form-group">
            <label style="font-weight:700;font-size:13px;display:block;margin-bottom:4px;">Biografi Singkat</label>
            <textarea id="myprofile-bio-inp" class="foxsa-input" rows="2" placeholder="Pengalaman dan bidang liputan...">${escapeHtml(u.bio || '')}</textarea>
          </div>

          <div class="foxsa-form-group">
            <label style="font-weight:700;font-size:13px;display:block;margin-bottom:4px;">Password Baru (Kosongkan bila tidak diubah)</label>
            <input type="password" id="myprofile-newpass-inp" class="foxsa-input" placeholder="Ketik password baru..." />
          </div>

          <button type="submit" class="foxsa-btn" style="width:100%;padding:10px;font-weight:700;">
            <i class="fa-solid fa-floppy-disk"></i> Simpan Perubahan Profil
          </button>
        </form>

        <!-- Preview Card -->
        <div style="background:#fff;border:1px solid #e2e8f0;border-radius:12px;padding:24px;text-align:center;box-shadow:0 4px 14px rgba(0,0,0,0.04);height:fit-content;">
          <h4 style="margin:0 0 16px;font-size:14px;color:#64748b;">Pratinjau Kartu Profil Redaksi</h4>
          <img id="myprofile-preview-img" src="${u.avatar || DEFAULT_AVATAR}" alt="Preview" style="width:96px;height:96px;border-radius:50%;object-fit:cover;border:3px solid #F08D39;box-shadow:0 4px 12px rgba(0,0,0,0.12);margin-bottom:12px;" />
          <h3 id="myprofile-preview-name" style="margin:0 0 4px;font-size:18px;color:#090C1E;font-family:'Poppins',sans-serif;">${escapeHtml(u.displayName || u.username)}</h3>
          <div style="margin-bottom:12px;">${renderRoleBadge(u.role)}</div>
          <p id="myprofile-preview-quote" style="font-size:13px;color:#64748b;font-style:italic;line-height:1.5;margin:0 0 12px;">
            “${escapeHtml(u.quote || 'Jurnalisme jujur, terpercaya, dan akurat untuk San Andreas.')}”
          </p>
          <div style="font-size:11.5px;color:#94a3b8;border-top:1px solid #f1f5f9;padding-top:12px;">
            Username: <code>@${escapeHtml(u.username)}</code>
          </div>
        </div>

      </div>
    `;

    // Live avatar URL input preview
    const urlInp = document.getElementById('myprofile-avatar-url');
    const prevImg = document.getElementById('myprofile-preview-img');
    if (urlInp && prevImg) {
      urlInp.addEventListener('input', () => {
        const val = urlInp.value.trim();
        if (val) prevImg.src = val;
      });
    }

    // Live file upload preview
    const fileInp = document.getElementById('myprofile-avatar-file');
    const fileInfo = document.getElementById('file-upload-info');
    if (fileInp && prevImg) {
      fileInp.addEventListener('change', (e) => {
        const file = e.target.files && e.target.files[0];
        if (!file) return;
        if (file.size > 2.5 * 1024 * 1024) {
          alert('Ukuran file maksimal 2.5 MB!');
          return;
        }
        const reader = new FileReader();
        reader.onload = (ev) => {
          const dataUrl = ev.target.result;
          if (urlInp) urlInp.value = dataUrl;
          prevImg.src = dataUrl;
          if (fileInfo) fileInfo.textContent = `File dipilih: ${file.name} (${Math.round(file.size / 1024)} KB)`;
        };
        reader.readAsDataURL(file);
      });
    }

    // Profile form submit
    const form = document.getElementById('form-myprofile');
    if (form) {
      form.addEventListener('submit', async (e) => {
        e.preventDefault();
        const newName = document.getElementById('myprofile-name-inp').value.trim();
        const newAvatar = (urlInp ? urlInp.value.trim() : '') || u.avatar || DEFAULT_AVATAR;
        const newQuote = document.getElementById('myprofile-quote-inp').value.trim();
        const newBio = document.getElementById('myprofile-bio-inp').value.trim();
        const newPass = document.getElementById('myprofile-newpass-inp').value.trim();

        if (!newName) {
          alert('Nama lengkap tidak boleh kosong!');
          return;
        }

        u.displayName = newName;
        u.avatar = newAvatar;
        u.quote = newQuote;
        u.bio = newBio;
        if (newPass) u.password = newPass;

        // Update in staffAccounts
        const acc = state.staffAccounts.find(a => a.username.toLowerCase() === u.username.toLowerCase());
        if (acc) {
          acc.displayName = newName;
          acc.authorName = newName;
          acc.avatar = newAvatar;
          acc.quote = newQuote;
          acc.bio = newBio;
          if (newPass) acc.password = newPass;
        }

        updateHeaderUserUI();
        renderProfileTab();
        showToast('Profil Anda berhasil diperbarui dan tersimpan di Cloud!');

        const sb = getSupabaseClient();
        if (sb) {
          try {
            const updates = {
              display_name: newName,
              author_name: newName,
              avatar: newAvatar,
              quote: newQuote,
              bio: newBio
            };
            if (newPass) updates.password = newPass;
            await sb.from('foxsa_staff_accounts').update(updates).eq('username', u.username);
          } catch (err) {
            console.warn('Update profile error:', err);
          }
        }
      });
    }
  }

  // -----------------------------------------------------------------
  // 8. DATABASE SUPABASE TAB (CLOUD STATUS & MANUAL SYNC)
  // -----------------------------------------------------------------
  function renderSupabaseTab() {
    const bodyEl = document.getElementById('admin-tab-body');
    if (!bodyEl) return;

    const sbCfg = window.FOXSA_SUPABASE_CONFIG || {};

    bodyEl.innerHTML = `
      <div style="margin-bottom:16px;">
        <h3 style="margin:0 0 4px;font-size:17px;color:#090C1E;font-family:'Poppins',sans-serif;">
          <i class="fa-solid fa-database" style="color:#059669;"></i>
          Status Koneksi Database Supabase Cloud
        </h3>
        <p style="margin:0;font-size:12.5px;color:#64748b;">Seluruh artikel, akun staf, former staff, dan chat redaksi tersinkron otomatis antar browser dan perangkat.</p>
      </div>

      <div style="display:grid;grid-template-columns:repeat(auto-fit, minmax(220px, 1fr));gap:16px;margin-bottom:24px;">
        <div style="background:#fff;border:1px solid #e2e8f0;border-radius:10px;padding:16px;border-top:3px solid #059669;">
          <div style="font-size:11.5px;color:#64748b;font-weight:600;margin-bottom:4px;">STATUS DATABASE</div>
          <div style="font-size:16px;font-weight:700;color:#059669;display:flex;align-items:center;gap:6px;">
            <i class="fa-solid fa-circle-check"></i> Terhubung (Live)
          </div>
          <div style="font-size:11px;color:#94a3b8;margin-top:4px;">bvlwthwjpkaozbmqrbog.supabase.co</div>
        </div>

        <div style="background:#fff;border:1px solid #e2e8f0;border-radius:10px;padding:16px;border-top:3px solid #F08D39;">
          <div style="font-size:11.5px;color:#64748b;font-weight:600;margin-bottom:4px;">TOTAL ARTIKEL BERITA</div>
          <div style="font-size:22px;font-weight:800;color:#090C1E;">${state.posts.length} <span style="font-size:13px;font-weight:500;color:#64748b;">Artikel</span></div>
          <div style="font-size:11px;color:#94a3b8;margin-top:2px;">Tabel: foxsa_posts</div>
        </div>

        <div style="background:#fff;border:1px solid #e2e8f0;border-radius:10px;padding:16px;border-top:3px solid #2563eb;">
          <div style="font-size:11.5px;color:#64748b;font-weight:600;margin-bottom:4px;">TOTAL AKUN STAF</div>
          <div style="font-size:22px;font-weight:800;color:#090C1E;">${state.staffAccounts.length} <span style="font-size:13px;font-weight:500;color:#64748b;">Akun</span></div>
          <div style="font-size:11px;color:#94a3b8;margin-top:2px;">Tabel: foxsa_staff_accounts</div>
        </div>

        <div style="background:#fff;border:1px solid #e2e8f0;border-radius:10px;padding:16px;border-top:3px solid #7c3aed;">
          <div style="font-size:11.5px;color:#64748b;font-weight:600;margin-bottom:4px;">PESAN CHAT REDAKSI</div>
          <div style="font-size:22px;font-weight:800;color:#090C1E;">${state.adminChats.length} <span style="font-size:13px;font-weight:500;color:#64748b;">Pesan</span></div>
          <div style="font-size:11px;color:#94a3b8;margin-top:2px;">Tabel: foxsa_admin_chats</div>
        </div>
      </div>

      <div style="background:#fff;border:1px solid #e2e8f0;border-radius:10px;padding:20px;display:flex;align-items:center;justify-content:space-between;flex-wrap:wrap;gap:14px;">
        <div>
          <h4 style="margin:0 0 4px;font-size:15px;color:#090C1E;">Sinkronisasi Ulang Data Sekarang</h4>
          <p style="margin:0;font-size:12.5px;color:#64748b;">Tarik data terbaru dari Supabase Cloud untuk memastikan data Anda adalah yang paling mutakhir.</p>
        </div>
        <button type="button" class="foxsa-btn" id="btn-manual-sync-now" style="padding:9px 20px;font-weight:700;">
          <i class="fa-solid fa-rotate"></i> Sinkronkan Data Sekarang
        </button>
      </div>
    `;

    // Manual sync button
    const syncBtn = document.getElementById('btn-manual-sync-now');
    if (syncBtn) {
      syncBtn.addEventListener('click', async () => {
        syncBtn.disabled = true;
        syncBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Menyinkronkan...';
        const ok = await syncAllFromSupabase(true);
        syncBtn.disabled = false;
        syncBtn.innerHTML = '<i class="fa-solid fa-rotate"></i> Sinkronkan Data Sekarang';
        if (ok) {
          showToast('✅ Seluruh data berhasil disinkronkan dengan Supabase Cloud!');
        } else {
          showToast('⚠️ Gagal terhubung ke Supabase. Periksa koneksi internet Anda.', false);
        }
      });
    }
  }

  // -----------------------------------------------------------------
  // INITIALIZATION
  // -----------------------------------------------------------------
  document.addEventListener('DOMContentLoaded', async () => {
    // 1. Check Auth Session
    let sessionUser = null;
    try {
      const raw = localStorage.getItem(AUTH_SESSION_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (parsed && parsed.username) {
          sessionUser = parsed.username;
        }
      }
    } catch (e) {}

    if (!sessionUser) {
      // Redirect to login page
      window.location.href = 'login.html';
      return;
    }

    // 2. Load Fallback Initial Data
    if (window.FOXSA_INITIAL_DATA) {
      if (Array.isArray(window.FOXSA_INITIAL_DATA.posts)) {
        state.posts = [...window.FOXSA_INITIAL_DATA.posts];
      }
      if (Array.isArray(window.FOXSA_INITIAL_DATA.staffAccounts)) {
        state.staffAccounts = [...window.FOXSA_INITIAL_DATA.staffAccounts];
      }
    }

    // Set initial user from matching account
    const matched = state.staffAccounts.find(a => a.username.toLowerCase() === sessionUser.toLowerCase());
    if (matched) {
      state.currentUser = matched;
    } else {
      state.currentUser = {
        username: sessionUser,
        displayName: sessionUser,
        role: 'Chief Executive Officer',
        avatar: DEFAULT_AVATAR,
        isAdmin: true
      };
    }

    // 3. Setup Header & Logout
    updateHeaderUserUI();
    setupLogout();

    // 4. Resolve Active Tab from Hash
    const hash = window.location.hash.replace(/^#\/?/, '').toLowerCase().trim();
    if (['posts', 'editor', 'chat', 'staff', 'former', 'comments', 'profile', 'supabase'].includes(hash)) {
      state.activeTab = hash;
    }

    // 5. Initial Render
    renderAdminShell();

    // 6. Connect to Supabase Cloud & Sync Data
    await syncAllFromSupabase(true);
    initRealtimeSubscription();
  });

})();
