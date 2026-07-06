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

  /* ---------- app shell : la Maison ---------- */
  const NAV = [
    ['index.html',      'Ma Maison',       '🏛'],
    ['products.html',   'Créations',       '✨'],
    ['categories.html', 'Collections',     '💎'],
    ['filters.html',    'Filtres',         '🎀'],
    ['promos.html',     'Offres Privées',  '🎁'],
    ['orders.html',     'Commandes',       '📦'],
    ['media.html',      'Galerie',         '🖼'],
    ['homepage.html',   'Page d’accueil',  '🌸'],
    ['settings.html',   'Paramètres',      '⚙️']
  ];
  function shell(active) {
    const links = NAV.map(([href, label, ic]) =>
      `<a class="asb__link ${href === active ? 'active' : ''}" href="${href}">
         <span class="asb__ic">${ic}</span>
         <span>${label}</span></a>`).join('');
    return `
      <aside class="asb" id="asb">
        <a class="asb__brand" href="index.html"><b>BELORYA</b><span>Maison</span></a>
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

  /* Convert/compress a photo to web-friendly JPEG (max 1600px). Phone photos are often
     huge (10 MB+) or in formats browsers can't display; this normalizes them. Falls back
     to the original file for standard formats the browser can't re-encode. */
  async function toWebJpeg(file, maxDim = 1600, quality = 0.85) {
    try {
      const bmp = await createImageBitmap(file);
      const scale = Math.min(1, maxDim / Math.max(bmp.width, bmp.height));
      const w = Math.max(1, Math.round(bmp.width * scale)), h = Math.max(1, Math.round(bmp.height * scale));
      const canvas = document.createElement('canvas');
      canvas.width = w; canvas.height = h;
      canvas.getContext('2d').drawImage(bmp, 0, 0, w, h);
      if (bmp.close) bmp.close();
      const blob = await new Promise(res => canvas.toBlob(res, 'image/jpeg', quality));
      if (!blob) return file;
      const base = (file.name || 'image').replace(/\.[^.]+$/, '') || 'image';
      return new File([blob], base + '.jpg', { type: 'image/jpeg' });
    } catch (e) {
      // Browser can't decode it. Standard formats can still be uploaded as-is;
      // exotic ones (e.g. HEIC on some phones) would never display on the site.
      if (/image\/(jpeg|jpg|png|webp|gif)/i.test(file.type)) return file;
      throw new Error('Format d’image non pris en charge — utilisez JPEG ou PNG.');
    }
  }

  /* Upload an image File to the public "media" bucket, log it in media table, return its URL. */
  async function upload(file, kind) {
    const c = db(); if (!c) throw new Error('not-configured');
    // logos/favicons keep their format (transparency); photos get normalized to JPEG
    const f = (kind === 'logo') ? file : await toWebJpeg(file);
    const ext = (f.name.split('.').pop() || 'jpg').toLowerCase().replace(/[^a-z0-9]/g, '') || 'jpg';
    const path = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`;
    const { error } = await c.storage.from('media').upload(path, f, { cacheControl: '3600', upsert: false, contentType: f.type || 'image/jpeg' });
    if (error) throw error;
    const { data } = c.storage.from('media').getPublicUrl(path);
    const url = data.publicUrl;
    const { error: mediaErr } = await c.from('media').insert({ url, path, kind: kind || 'product', alt: file.name });
    if (mediaErr) throw mediaErr;
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
