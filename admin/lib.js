/* ============================================================
   BELORYA Admin — shared library
   Supabase client · auth · route guard · app shell · helpers
   Loaded on every admin page after config.js and the supabase-js CDN.
   ============================================================ */
(function () {
  const CFG = window.BELORYA_SUPABASE || {};
  const CONFIGURED = !!(CFG.url && !/YOUR-/.test(CFG.url) && CFG.anonKey && !/YOUR-/.test(CFG.anonKey));

  let _client = null;
  function db() {
    if (_client) return _client;
    if (!CONFIGURED || !window.supabase) return null;
    _client = window.supabase.createClient(CFG.url, CFG.anonKey, {
      auth: { persistSession: true, autoRefreshToken: true, storageKey: 'belorya-admin-auth' }
    });
    return _client;
  }

  /* ---------- auth ---------- */
  async function currentUser() {
    const c = db(); if (!c) return null;
    const { data } = await c.auth.getUser();
    return data ? data.user : null;
  }
  async function isAdmin() {
    const c = db(); if (!c) return false;
    // admins_self_read RLS returns only the caller's own row when they are an admin
    const { data, error } = await c.from('admins').select('user_id').limit(1);
    return !error && !!(data && data.length);
  }
  async function signIn(email, password) {
    const c = db(); if (!c) throw new Error('not-configured');
    const { data, error } = await c.auth.signInWithPassword({ email, password });
    if (error) throw error;
    return data.user;
  }
  async function signOut() {
    const c = db(); if (c) await c.auth.signOut();
    location.replace('login.html');
  }

  /* Guard for protected pages. Returns the user or redirects away. */
  async function requireAdmin() {
    if (!CONFIGURED) { renderNotConfigured(); return null; }
    const user = await currentUser();
    if (!user) { location.replace('login.html'); return null; }
    if (!(await isAdmin())) { await db().auth.signOut(); location.replace('login.html?denied=1'); return null; }
    return user;
  }

  /* ---------- app shell (sidebar + topbar) ---------- */
  const NAV = [
    ['index.html',      'Tableau de bord', 'grid'],
    ['products.html',   'Produits',        'tag'],
    ['orders.html',     'Commandes',       'bag'],
    ['categories.html', 'Catégories',      'folder'],
    ['filters.html',    'Filtres',         'sliders'],
    ['promos.html',     'Codes promo',     'ticket'],
    ['media.html',      'Médiathèque',     'image'],
    ['homepage.html',   'Page d’accueil',  'home'],
    ['settings.html',   'Réglages',        'gear']
  ];
  const IC = {
    grid:'<path d="M3 3h7v7H3zM14 3h7v7h-7zM14 14h7v7h-7zM3 14h7v7H3z"/>',
    tag:'<path d="M3 12l9-9 8 8-9 9zM7.5 7.5h.01"/>',
    bag:'<path d="M6 7h12l-1 13H7zM9 7a3 3 0 0 1 6 0"/>',
    folder:'<path d="M3 7h6l2 2h10v11H3z"/>',
    sliders:'<path d="M4 6h16M4 12h16M4 18h16"/><circle cx="9" cy="6" r="2"/><circle cx="15" cy="12" r="2"/><circle cx="8" cy="18" r="2"/>',
    ticket:'<path d="M3 8a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2 2 2 0 0 0 0 4 2 2 0 0 1-2 2H5a2 2 0 0 1-2-2 2 2 0 0 0 0-4z"/>',
    image:'<rect x="3" y="4" width="18" height="16" rx="2"/><circle cx="8.5" cy="9.5" r="1.5"/><path d="M21 16l-5-5-9 9"/>',
    home:'<path d="M3 11l9-8 9 8M5 10v10h14V10"/>',
    gear:'<circle cx="12" cy="12" r="3"/><path d="M12 2v3M12 19v3M2 12h3M19 12h3M5 5l2 2M17 17l2 2M19 5l-2 2M7 17l-2 2"/>'
  };
  function shell(active) {
    const links = NAV.map(([href, label, ic]) =>
      `<a class="asb__link ${href === active ? 'active' : ''}" href="${href}">
         <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6">${IC[ic] || ''}</svg>
         <span>${label}</span></a>`).join('');
    return `
      <aside class="asb" id="asb">
        <a class="asb__brand" href="index.html"><b>BELORYA</b><span>Admin</span></a>
        <nav class="asb__nav">${links}</nav>
        <button class="asb__logout" id="btnLogout">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><path d="M15 12H3M9 6l-6 6 6 6M14 4h5v16h-5"/></svg>
          <span>Déconnexion</span></button>
      </aside>
      <div class="asb-overlay" id="asbOverlay"></div>`;
  }
  function topbar(title, actions) {
    return `<header class="atop">
      <button class="atop__burger" id="asbToggle" aria-label="Menu">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M4 7h16M4 12h16M4 17h16"/></svg>
      </button>
      <h1 class="atop__title">${title}</h1>
      <div class="atop__actions">${actions || ''}</div>
    </header>`;
  }

  /* Mount the shell into a page. host = element that holds page content. */
  function mountShell(active, title, actions, contentHTML) {
    document.body.insertAdjacentHTML('afterbegin', shell(active));
    const main = document.createElement('main');
    main.className = 'amain';
    main.innerHTML = topbar(title, actions) + `<div class="acontent" id="acontent">${contentHTML || ''}</div>`;
    document.body.appendChild(main);
    document.getElementById('btnLogout').onclick = signOut;
    const asb = document.getElementById('asb'), ov = document.getElementById('asbOverlay');
    const close = () => { asb.classList.remove('open'); ov.classList.remove('open'); };
    document.getElementById('asbToggle').onclick = () => { asb.classList.toggle('open'); ov.classList.toggle('open'); };
    ov.onclick = close;
    return document.getElementById('acontent');
  }

  function renderNotConfigured() {
    document.body.innerHTML = `<div class="setup-wrap">
      <div class="setup-card">
        <h1>Configuration requise</h1>
        <p>Le tableau de bord n’est pas encore connecté à la base de données.</p>
        <p>Ouvrez <code>admin/config.js</code> et renseignez l’URL et la clé <b>anon</b> de votre projet Supabase, puis suivez le guide <code>admin/README.md</code>.</p>
      </div></div>`;
  }

  /* ---------- helpers ---------- */
  const money = (v) => `${Number(v || 0).toLocaleString('fr-FR')} MAD`;
  const esc = (s) => String(s == null ? '' : s).replace(/[&<>"']/g, m => ({ '&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;' }[m]));
  const el = (id) => document.getElementById(id);
  function toast(msg, kind) {
    let t = el('atoast');
    if (!t) { t = document.createElement('div'); t.id = 'atoast'; t.className = 'atoast'; document.body.appendChild(t); }
    t.textContent = msg; t.className = 'atoast show ' + (kind || 'ok');
    clearTimeout(t._t); t._t = setTimeout(() => t.classList.remove('show'), 2600);
  }
  async function count(table, filters) {
    const c = db(); if (!c) return 0;
    let q = c.from(table).select('*', { count: 'exact', head: true });
    (filters || []).forEach(([col, op, val]) => { q = q[op](col, val); });
    const { count: n } = await q;
    return n || 0;
  }

  function slugify(s) {
    return String(s || '').toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '')
      .replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
  }

  /* Upload an image File to the public "media" bucket, log it in media table, return its URL. */
  async function upload(file, kind) {
    const c = db(); if (!c) throw new Error('not-configured');
    const ext = (file.name.split('.').pop() || 'jpg').toLowerCase().replace(/[^a-z0-9]/g, '') || 'jpg';
    const path = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`;
    const { error } = await c.storage.from('media').upload(path, file, { cacheControl: '3600', upsert: false });
    if (error) throw error;
    const { data } = c.storage.from('media').getPublicUrl(path);
    const url = data.publicUrl;
    await c.from('media').insert({ url, path, kind: kind || 'product', alt: file.name });
    return { url, path };
  }

  /* Generic modal. Returns { root, close }. footHTML buttons wire themselves via ids you pass. */
  function openModal(title, bodyHTML, footHTML) {
    let ov = el('amodal');
    if (!ov) { ov = document.createElement('div'); ov.id = 'amodal'; ov.className = 'modal-ov'; document.body.appendChild(ov); }
    ov.innerHTML = `<div class="modal">
      <div class="modal__head"><h2>${title}</h2><button class="modal__close" id="amodalClose" aria-label="Fermer">×</button></div>
      <div class="modal__body">${bodyHTML}</div>
      ${footHTML ? `<div class="modal__foot">${footHTML}</div>` : ''}
    </div>`;
    ov.classList.add('open');
    const close = () => ov.classList.remove('open');
    el('amodalClose').onclick = close;
    ov.onclick = (e) => { if (e.target === ov) close(); };
    return { root: ov, close };
  }

  window.Admin = {
    db, CONFIGURED, currentUser, isAdmin, signIn, signOut, requireAdmin,
    mountShell, renderNotConfigured, money, esc, el, toast, count, NAV,
    slugify, upload, openModal
  };
})();
