/* ============================================================
   BELORYA - App logic
   Announcement bar · header/footer · language switch (i18n.js)
   · cart drawer with promo + shipping + WhatsApp order
   · scroll reveal · product rendering · collection filters · PDP
   ============================================================ */

/* Defaults — overridden at boot by settings from Supabase when configured (js/store.js). */
let WHATSAPP_NUMBER = '212660323891'; // Belorya WhatsApp (international, no +)
let BRAND = 'Belorya';
let TAGLINE = 'Eternal Shine';
let LOGO_SRC = 'assets/logo.png';
let EMAIL = 'belorya1@gmail.com';
let SOCIALS = {
  instagram: 'https://www.instagram.com/belorya_/',
  facebook: 'https://www.facebook.com/profile.php?id=61591102114678',
  tiktok: 'https://www.tiktok.com/@belorya5',
  whatsapp: `https://wa.me/${WHATSAPP_NUMBER}`
};

/* Promo + shipping rules (defaults; overridden by DB promo_codes/settings) */
let PROMOS = [{ code: 'BELORYA10', type: 'percent', value: 10, min: 0 }]; // all valid codes the cart accepts
let PROMO_CODE = 'BELORYA10';        // featured code shown in the announcement bar
let SHIP_FEE = 35;                   // MAD, outside Casablanca under threshold
let SHIP_FREE_THRESHOLD = 250;       // MAD
let SHIP_CASA_FREE = true;

/* Marketing pixels — defaults; the admin (Paramètres → Meta Pixel / Google
   Analytics) overrides these via the settings table. */
let META_PIXEL = '1061131383114577'; // "Pixel Belorya" — the pixel attached to the ad account
let GA_ID = '';

function findPromo(code) {
  const c = String(code || '').trim().toUpperCase();
  if (!c) return null;
  return PROMOS.find(p => String(p.code).toUpperCase() === c) || null;
}

/* Brand lockup */
function brandLockup(extraClass = '') {
  return `<img class="brand__logo ${extraClass}" src="${LOGO_SRC}" alt="${BRAND} - ${TAGLINE}"
      onerror="this.classList.add('hide');this.nextElementSibling.classList.remove('hide')">
    <span class="brand__fallback hide">
      <span class="brand__name">BELORYA</span>
      <span class="brand__tag">${TAGLINE}</span>
    </span>`;
}

/* ---------------- Shared icons ---------------- */
const ICONS = {
  cart: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.4"><path d="M6 7h12l-1 12.5a1.5 1.5 0 0 1-1.5 1.4H8.5A1.5 1.5 0 0 1 7 19.5L6 7Z"/><path d="M9 7a3 3 0 0 1 6 0"/></svg>',
  wa: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 2a10 10 0 0 0-8.6 15l-1.3 4.7 4.8-1.3A10 10 0 1 0 12 2Zm5.8 14.2c-.2.7-1.4 1.3-2 1.4-.5.1-1.2.1-1.9-.1-.4-.1-1-.3-1.8-.6-3-1.3-5-4.4-5.2-4.6-.1-.2-1.2-1.6-1.2-3s.7-2.1 1-2.4c.2-.3.5-.4.7-.4h.5c.2 0 .4 0 .6.5l.8 2c.1.2.1.4 0 .5l-.4.5-.3.3c-.1.2-.3.3-.1.6.1.3.7 1.1 1.4 1.8.9.8 1.7 1 2 1.2.2.1.4.1.5-.1l.7-.8c.2-.2.3-.2.6-.1l1.9.9c.3.1.5.2.5.4.1.1.1.8-.1 1.4Z"/></svg>',
  ig: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.4"><rect x="3" y="3" width="18" height="18" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none"/></svg>',
  fb: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M14 8.5V7c0-.7.3-1 1-1h1.5V3H14c-2.2 0-3.5 1.3-3.5 3.6V8.5H8.5V12h2V21h3.5v-9h2.4l.6-3.5H14Z"/></svg>',
  tiktok: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M16 3c.3 2.3 1.6 3.7 3.8 3.9v2.6c-1.3.1-2.5-.3-3.8-1v5.8c0 3.6-2.8 6-6 5.6-2.6-.3-4.4-2.4-4.3-5 .1-2.7 2.5-4.7 5.2-4.4v2.7c-.4-.1-.8-.2-1.2-.1-1.1.1-1.9 1-1.8 2.1.1 1 1 1.9 2.1 1.8 1.2-.1 1.9-1 1.9-2.3V3H16Z"/></svg>',
  arrow: '<svg viewBox="0 0 18 10" fill="none" stroke="currentColor" stroke-width="1.4"><path d="M1 5h15M12 1l4 4-4 4"/></svg>',
  check: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><path d="M5 13l4 4L19 7"/></svg>',
  shield: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.4"><path d="M12 3l7 3v5c0 4.5-3 8-7 10-4-2-7-5.5-7-10V6l7-3Z"/><path d="M9 12l2 2 4-4"/></svg>',
  truck: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.4"><path d="M3 7h11v8H3zM14 10h4l3 3v2h-7"/><circle cx="7" cy="18" r="1.6"/><circle cx="17.5" cy="18" r="1.6"/></svg>',
  coins: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.4"><ellipse cx="12" cy="6" rx="7" ry="3"/><path d="M5 6v6c0 1.7 3.1 3 7 3s7-1.3 7-3V6"/><path d="M5 12v6c0 1.7 3.1 3 7 3s7-1.3 7-3v-6"/></svg>',
  refresh: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.4"><path d="M4 12a8 8 0 0 1 13.7-5.6L20 8M20 4v4h-4"/><path d="M20 12a8 8 0 0 1-13.7 5.6L4 16M4 20v-4h4"/></svg>'
};

/* Nav (labels resolved through i18n at render time) */
const NAV_LINKS = [
  { href: 'index.html', key: 'nav_home' },
  { href: 'collections.html', key: 'nav_collections' },
  { href: 'collections.html?sort=best', key: 'nav_best' },
  { href: 'index.html#about', key: 'nav_about' },
  { href: 'index.html#contact', key: 'nav_contact' }
];

/* Language switcher markup */
function langSwitcher(extra = '') {
  const lang = getLang();
  const opts = [['fr', 'FR'], ['en', 'EN'], ['ar', 'ع']];
  return `<div class="lang-switch ${extra}" role="group" aria-label="Language">
    ${opts.map(([code, label], i) =>
      `${i ? '<span class="lang-sep">/</span>' : ''}<button class="lang-opt ${lang===code?'active':''}" data-lang="${code}">${label}</button>`
    ).join('')}
  </div>`;
}
function bindLangSwitch(root = document) {
  root.querySelectorAll('.lang-opt').forEach(b => b.addEventListener('click', () => {
    if (b.dataset.lang !== getLang()) setLang(b.dataset.lang);
  }));
}

/* ---------------- Announcement bar ---------------- */
function announceBar() {
  return `<div class="announce" id="announce">
      <div class="wrap announce__in">
        <span class="announce__msg announce__msg--full">${t('announce_text', { code: `<strong>${PROMO_CODE}</strong>` })}</span>
        <span class="announce__msg announce__msg--short">${t('announce_short', { code: `<strong>${PROMO_CODE}</strong>` })}</span>
        <button class="announce__copy" id="announceCopy" type="button">${ICONS.check}<span>${t('announce_copy')}</span></button>
      </div>
    </div>`;
}
function bindAnnounce() {
  const btn = document.getElementById('announceCopy');
  if (!btn) return;
  btn.addEventListener('click', async () => {
    try {
      await navigator.clipboard.writeText(PROMO_CODE);
    } catch {
      const ta = document.createElement('textarea');
      ta.value = PROMO_CODE; document.body.appendChild(ta); ta.select();
      try { document.execCommand('copy'); } catch {}
      ta.remove();
    }
    btn.classList.add('copied');
    btn.querySelector('span').textContent = t('announce_copied');
    setTimeout(() => {
      btn.classList.remove('copied');
      btn.querySelector('span').textContent = t('announce_copy');
    }, 2200);
  });
}

/* ---------------- Trust bar (below hero / page hero) ---------------- */
function renderTrustBar() {
  document.querySelectorAll('.trust-bar-mount').forEach(mount => {
    const items = [
      [ICONS.truck, t('trust_free_casa')],
      [ICONS.coins, t('trust_free_250')],
      [ICONS.wa, t('trust_cod')],
      [ICONS.shield, t('trust_steel')]
    ];
    mount.innerHTML = `<div class="wrap"><div class="trust-bar" data-reveal>
      ${items.map(([ic, label]) => `<div class="trust-bar__item"><span class="trust-bar__ic">${ic}</span><span>${label}</span></div>`).join('')}
    </div></div>`;
  });
}

/* ---------------- Header ---------------- */
function renderHeader() {
  const mount = document.getElementById('site-header');
  if (!mount) return;
  const page = document.body.dataset.page || '';
  const links = NAV_LINKS.map(l => {
    const active = (page === 'collections' && /collections/.test(l.href)) ? 'active' : '';
    return `<li><a class="nav__link ${active}" href="${l.href}">${t(l.key)}</a></li>`;
  }).join('');

  mount.innerHTML = `
    ${announceBar()}
    <header class="site-header" id="header">
      <div class="wrap nav">
        <a class="brand" href="index.html" aria-label="${BRAND} home">
          ${brandLockup()}
        </a>
        <ul class="nav__menu">${links}</ul>
        <div class="nav__right">
          ${langSwitcher()}
          <a class="nav__cta" href="${SOCIALS.whatsapp}" target="_blank" rel="noopener">${ICONS.wa}<span>${t('nav_whatsapp')}</span></a>
          <button class="icon-btn" id="cartOpen" aria-label="Open cart">
            ${ICONS.cart}<span class="cart-count" id="cartCount">0</span>
          </button>
          <button class="nav__toggle" aria-label="Open menu" id="navToggle"><span></span></button>
        </div>
      </div>
    </header>
    <nav class="mobile-menu" id="mobileMenu" aria-hidden="true">
      <ul>${NAV_LINKS.map((l,i)=>`<li><a href="${l.href}" style="animation-delay:${0.06*i}s">${t(l.key)}</a></li>`).join('')}</ul>
      <div style="position:absolute;top:1.6rem;left:var(--gut)"><a class="brand" href="index.html">${brandLockup('mobile-mark')}</a></div>
      <div class="mobile-menu__foot">
        ${langSwitcher('lang-switch--menu')}
        <a class="footer__wa" href="${SOCIALS.whatsapp}" target="_blank" rel="noopener">${ICONS.wa} ${t('cart_wa')}</a>
      </div>
    </nav>`;

  const header = document.getElementById('header');
  const solid = page !== 'home';
  if (solid) header.classList.add('solid');
  const onScroll = () => header.classList.toggle('scrolled', window.scrollY > 20);
  onScroll();
  window.addEventListener('scroll', onScroll, { passive: true });

  const toggle = document.getElementById('navToggle');
  const menu = document.getElementById('mobileMenu');
  toggle.addEventListener('click', () => {
    document.body.classList.toggle('menu-open');
    menu.setAttribute('aria-hidden', document.body.classList.contains('menu-open') ? 'false' : 'true');
  });
  menu.querySelectorAll('a').forEach(a => a.addEventListener('click', () => {
    document.body.classList.remove('menu-open');
  }));

  document.getElementById('cartOpen').addEventListener('click', openCart);
  bindAnnounce();
  bindLangSwitch(mount);
  updateCartCount();
}

/* ---------------- Footer ---------------- */
function renderFooter() {
  const mount = document.getElementById('site-footer');
  if (!mount) return;
  mount.innerHTML = `
    <footer class="site-footer" id="contact">
      <div class="wrap">
        <div class="footer__ship">
          <div><span class="footer__ship-ic">${ICONS.truck}</span>${t('trust_free_casa')}</div>
          <div><span class="footer__ship-ic">${ICONS.coins}</span>${t('trust_free_250')}</div>
          <div><span class="footer__ship-ic">${ICONS.wa}</span>${t('trust_cod')}</div>
          <div><span class="footer__ship-ic">${ICONS.shield}</span>${t('trust_steel')}</div>
        </div>
        <div class="footer__top">
          <div class="footer__brand">
            <a class="brand" href="index.html">${brandLockup('footer-mark')}</a>
            <p>${t('footer_desc')}</p>
            <div class="footer__socials">
              <a href="${SOCIALS.instagram}" target="_blank" rel="noopener" aria-label="Instagram">${ICONS.ig}</a>
              <a href="${SOCIALS.facebook}" target="_blank" rel="noopener" aria-label="Facebook">${ICONS.fb}</a>
              <a href="${SOCIALS.tiktok}" target="_blank" rel="noopener" aria-label="TikTok">${ICONS.tiktok}</a>
              <a href="${SOCIALS.whatsapp}" target="_blank" rel="noopener" aria-label="WhatsApp">${ICONS.wa}</a>
            </div>
          </div>
          <div class="footer__col">
            <h5>${t('footer_collections')}</h5>
            <ul>
              <li><a href="collections.html?cat=necklaces">${t('footer_l_necklaces')}</a></li>
              <li><a href="collections.html?cat=sets">${t('footer_l_sets')}</a></li>
              <li><a href="collections.html?cat=earrings">${t('footer_l_earrings')}</a></li>
              <li><a href="collections.html?sort=best">${t('footer_l_best')}</a></li>
              <li><a href="collections.html?sort=new">${t('footer_l_new')}</a></li>
            </ul>
          </div>
          <div class="footer__col">
            <h5>${t('footer_maison')}</h5>
            <ul>
              <li><a href="index.html#about">${t('footer_l_story')}</a></li>
              <li><a href="index.html#material">${t('footer_l_materials')}</a></li>
              <li><a href="collections.html?sort=best">${t('footer_l_best')}</a></li>
              <li><a href="collections.html?cat=promo">${t('footer_l_promo')}</a></li>
              <li><a href="index.html#newsletter">${t('footer_l_private')}</a></li>
            </ul>
          </div>
          <div class="footer__col">
            <h5>${t('footer_contact')}</h5>
            <ul>
              <li>${t('footer_city')}</li>
              <li><a href="mailto:${EMAIL}">${EMAIL}</a></li>
              <li><a href="${SOCIALS.whatsapp}" target="_blank" rel="noopener">+212 660 323 891</a></li>
            </ul>
            <a class="footer__wa" href="${SOCIALS.whatsapp}" target="_blank" rel="noopener">${ICONS.wa} ${t('cart_wa')}</a>
          </div>
        </div>
        <div class="footer__bottom">
          <p>© 2026 ${BRAND}. ${t('footer_rights')}</p>
          <div class="footer__pay">
            <span>${t('trust_cod')}</span><span>WhatsApp</span>
          </div>
          <p><a href="#">${t('footer_privacy')}</a> · <a href="#">${t('footer_terms')}</a></p>
        </div>
      </div>
    </footer>`;
}

/* ---------------- Cart state ---------------- */
const CART_KEY = 'eclat_cart';
const PROMO_KEY = 'belorya_promo';
const ZONE_KEY = 'belorya_zone';

function getCart() { try { return JSON.parse(localStorage.getItem(CART_KEY)) || []; } catch { return []; } }
function saveCart(c) { localStorage.setItem(CART_KEY, JSON.stringify(c)); updateCartCount(); }
/* Applied promo = stored code, re-validated against the current PROMOS list
   (so a code that gets deactivated/expired in the admin stops working). */
function getPromo() { return findPromo(localStorage.getItem(PROMO_KEY)); }
function setPromo(v) { if (v) localStorage.setItem(PROMO_KEY, v); else localStorage.removeItem(PROMO_KEY); }
function getZone() { return localStorage.getItem(ZONE_KEY) === 'outside' ? 'outside' : 'casablanca'; }
function setZone(z) { localStorage.setItem(ZONE_KEY, z === 'outside' ? 'outside' : 'casablanca'); }

/* A cart line is identified by product id + chosen variant (colour). */
function lineKey(i) { return i.id + '|' + (i.variant || ''); }
function addToCart(id, qty = 1, variant = null) {
  const p = PRODUCTS.find(x => x.id === id);
  if (!p) return;
  const v = variant || null;
  const cart = getCart();
  const found = cart.find(i => i.id === id && (i.variant || null) === v);
  if (found) found.qty += qty; else cart.push({ id, qty, variant: v });
  saveCart(cart);
  renderCart();
  renderCartPage();
  toast(t('cart_added', { name: p.name + (v ? ' · ' + v : '') }));
  track('AddToCart', { content_ids: [id], content_name: p.name, content_type: 'product', value: p.price * qty, currency: 'MAD' });
}
/* setQty operates on a line key ("id|variant"); qty<=0 removes the line. */
function setQty(key, qty) {
  let cart = getCart();
  if (qty <= 0) cart = cart.filter(i => lineKey(i) !== key);
  else { const it = cart.find(i => lineKey(i) === key); if (it) it.qty = qty; }
  saveCart(cart); renderCart(); renderCartPage();
}
function cartSubtotal() {
  return getCart().reduce((s, i) => {
    const p = PRODUCTS.find(x => x.id === i.id); return s + (p ? p.price * i.qty : 0);
  }, 0);
}
function cartCount() { return getCart().reduce((s, i) => s + i.qty, 0); }
function updateCartCount() {
  const el = document.getElementById('cartCount');
  if (!el) return;
  const n = cartCount();
  el.textContent = n;
  el.classList.toggle('show', n > 0);
}

/* single source of truth for the order maths */
function computeTotals() {
  const subtotal = cartSubtotal();
  const applied = getPromo();
  const promoMin = applied ? Number(applied.min || 0) : 0;
  let discount = 0;
  if (applied && subtotal >= promoMin) {
    discount = applied.type === 'fixed'
      ? Math.min(Number(applied.value), subtotal)
      : Math.round(subtotal * (Number(applied.value) / 100));
  }
  const zone = getZone();
  const fee = subtotal >= SHIP_FREE_THRESHOLD ? 0 : SHIP_FEE;
  const shipping = (zone === 'casablanca' && SHIP_CASA_FREE) ? 0 : fee;
  const total = Math.max(0, subtotal - discount + shipping);
  return { subtotal, promo: applied ? applied.code : null, promoMin, discount, zone, shipping, total };
}

/* ---------------- Cart drawer ---------------- */
function ensureCartDOM() {
  if (document.getElementById('cartDrawer')) return;
  const div = document.createElement('div');
  div.innerHTML = `
    <div class="cart-overlay" id="cartOverlay"></div>
    <aside class="cart-drawer" id="cartDrawer" aria-label="Shopping bag" aria-hidden="true">
      <div class="cart-drawer__head">
        <h3>${t('cart_title')} <span id="cartHeadCount"></span></h3>
        <button class="cart-close" id="cartClose" aria-label="Close">✕</button>
      </div>
      <div class="cart-body" id="cartBody"></div>
      <div class="cart-foot" id="cartFoot" hidden></div>
    </aside>`;
  document.body.appendChild(div);
  document.getElementById('cartOverlay').addEventListener('click', closeCart);
  document.getElementById('cartClose').addEventListener('click', closeCart);
}
function openCart() { ensureCartDOM(); renderCart(); document.getElementById('cartOverlay').classList.add('open'); document.getElementById('cartDrawer').classList.add('open'); }
function closeCart() { const o=document.getElementById('cartOverlay'),d=document.getElementById('cartDrawer'); if(o)o.classList.remove('open'); if(d)d.classList.remove('open'); }

function renderCart() {
  ensureCartDOM();
  const body = document.getElementById('cartBody');
  const foot = document.getElementById('cartFoot');
  const cart = getCart();
  document.getElementById('cartHeadCount').textContent = cartCount() ? `(${cartCount()})` : '';
  if (!cart.length) {
    body.innerHTML = `<div class="cart-empty">${ICONS.cart}<p>${t('cart_empty')}</p>
      <a class="btn btn--ghost btn--sm" href="collections.html" style="margin-top:1.4rem">${t('cart_explore')}</a></div>`;
    foot.hidden = true; return;
  }
  body.innerHTML = cart.map(i => {
    const p = PRODUCTS.find(x => x.id === i.id); if (!p) return '';
    const k = lineKey(i);
    return `<div class="cart-item">
      <a class="cart-item__media" href="product.html?id=${p.id}">${productMedia(p)}</a>
      <div>
        <a href="product.html?id=${p.id}" class="cart-item__name">${p.name}</a>
        <div class="cart-item__mat">${p.material}${i.variant ? ` · <span class="cart-item__variant">${i.variant}</span>` : ''}</div>
        <div class="qty">
          <button onclick="setQty('${k}',${i.qty-1})" aria-label="${t('pdp_dec')}">−</button>
          <span>${i.qty}</span>
          <button onclick="setQty('${k}',${i.qty+1})" aria-label="${t('pdp_inc')}">+</button>
        </div>
      </div>
      <div class="cart-item__right">
        <div class="cart-item__price">${formatPrice(p.price * i.qty)}</div>
        <button class="cart-item__remove" onclick="setQty('${k}',0)">${t('cart_remove')}</button>
      </div>
    </div>`;
  }).join('');

  // Compact quick-preview only: subtotal + navigate to full cart page
  foot.hidden = false;
  foot.innerHTML = `
    <div class="cart-foot__row subtotal"><span>${t('cart_subtotal')}</span><span>${formatPrice(cartSubtotal())}</span></div>
    <a class="btn btn--gold btn--block" href="cart.html">${t('cart_view')}</a>
    <button class="btn btn--ghost btn--block" id="cartContinue" style="margin-top:.7rem">${t('cart_continue')}</button>`;
  document.getElementById('cartContinue').onclick = closeCart;
}

/* ---------------- Full cart page (checkout logic) ---------------- */
function renderCartPage() {
  const mount = document.getElementById('cart-page');
  if (!mount) return;
  const cart = getCart();
  if (!cart.length) {
    mount.innerHTML = `<div class="wrap"><div class="cart-page-empty">${ICONS.cart}
      <p>${t('cart_empty_page')}</p>
      <a class="btn btn--gold" href="collections.html">${t('cart_explore')}</a></div></div>`;
    return;
  }
  const T = computeTotals();
  const promoOn = !!T.promo;
  const zone = T.zone;
  const trust = [t('pdp_check_casa'), t('pdp_check_250'), t('trust_cod'), t('trust_steel')];

  mount.innerHTML = `
    <div class="wrap cart-page__grid">
      <div class="cart-page__items">
        ${cart.map(i => {
          const p = PRODUCTS.find(x => x.id === i.id); if (!p) return '';
          const k = lineKey(i);
          return `<div class="cart-line">
            <a class="cart-line__media" href="product.html?id=${p.id}">${productMedia(p)}</a>
            <div class="cart-line__info">
              <a href="product.html?id=${p.id}" class="cart-line__name">${p.name}</a>
              <div class="cart-line__mat">${p.material}${i.variant ? ` · <span class="cart-item__variant">${i.variant}</span>` : ''}</div>
              <div class="cart-line__controls">
                <div class="qty">
                  <button onclick="setQty('${k}',${i.qty-1})" aria-label="${t('pdp_dec')}">−</button>
                  <span>${i.qty}</span>
                  <button onclick="setQty('${k}',${i.qty+1})" aria-label="${t('pdp_inc')}">+</button>
                </div>
                <button class="cart-item__remove" onclick="setQty('${k}',0)">${t('cart_remove')}</button>
              </div>
            </div>
            <div class="cart-line__price">${formatPrice(p.price * i.qty)}</div>
          </div>`;
        }).join('')}
      </div>

      <aside class="cart-summary-card">
        <h2 class="cart-summary-card__title">${t('cart_summary_title')}</h2>

        <div class="cart-promo">
          <label class="cart-sub-label">${t('cart_promo_label')}</label>
          <div class="cart-promo__row">
            <input type="text" id="promoInput" placeholder="${t('cart_promo_ph')}" value="${promoOn ? T.promo : ''}" ${promoOn ? 'disabled' : ''} autocomplete="off" spellcheck="false">
            <button class="btn btn--ghost btn--sm" id="promoApply">${promoOn ? t('cart_remove') : t('cart_promo_apply')}</button>
          </div>
          <p class="cart-promo__msg ${promoOn ? (T.discount > 0 ? 'ok' : 'bad') : ''}" id="promoMsg">${
            promoOn ? (T.discount > 0 ? ICONS.check + ' ' + t('cart_promo_ok') : t('cart_promo_min', { min: formatPrice(T.promoMin) })) : ''
          }</p>
        </div>

        <div class="cart-zone">
          <label class="cart-sub-label">${t('cart_zone_label')}</label>
          <div class="cart-zone__opts">
            <label class="cart-zone__opt ${zone==='casablanca'?'active':''}"><input type="radio" name="zone" value="casablanca" ${zone==='casablanca'?'checked':''}><span>${t('cart_zone_casa')}</span></label>
            <label class="cart-zone__opt ${zone==='outside'?'active':''}"><input type="radio" name="zone" value="outside" ${zone==='outside'?'checked':''}><span>${t('cart_zone_out')}</span></label>
          </div>
        </div>

        <div class="cart-summary">
          <div class="cart-foot__row"><span>${t('cart_subtotal')}</span><span>${formatPrice(T.subtotal)}</span></div>
          ${T.discount > 0 ? `<div class="cart-foot__row discount"><span>${t('cart_discount')}</span><span>−${formatPrice(T.discount)}</span></div>` : ''}
          <div class="cart-foot__row"><span>${t('cart_shipping')}</span><span>${T.shipping === 0 ? t('cart_free') : formatPrice(T.shipping)}</span></div>
          <div class="cart-foot__row total"><span>${t('cart_total')}</span><span>${formatPrice(T.total)}</span></div>
          <div class="cart-foot__row eta"><span>${t('cart_eta_label')}</span><span>${t('cart_eta_val')}</span></div>
        </div>

        <button class="btn btn--gold btn--block" id="cartWa">${ICONS.wa} ${t('cart_wa')}</button>
        <a class="btn btn--ghost btn--block" href="collections.html" style="margin-top:.7rem">${t('cart_continue')}</a>

        <ul class="cart-trust">
          ${trust.map(x => `<li>${ICONS.check}<span>${x}</span></li>`).join('')}
        </ul>
      </aside>
    </div>`;

  // promo
  const promoInput = document.getElementById('promoInput');
  const promoMsg = document.getElementById('promoMsg');
  document.getElementById('promoApply').onclick = () => {
    if (getPromo()) { setPromo(null); renderCartPage(); return; }
    const found = findPromo(promoInput.value);
    if (found) { setPromo(found.code); renderCartPage(); }
    else { promoMsg.className = 'cart-promo__msg bad'; promoMsg.textContent = t('cart_promo_bad'); }
  };
  // zone -> instant recalc
  mount.querySelectorAll('input[name="zone"]').forEach(r => r.addEventListener('change', () => { setZone(r.value); renderCartPage(); }));
  document.getElementById('cartWa').onclick = waOrderCart;
}

function waOrderCart() {
  const cart = getCart();
  if (!cart.length) return;
  const T = computeTotals();
  const NL = '%0A';
  let msg = `${t('wa_hello')}${NL}${NL}${t('wa_want')}${NL}`;
  cart.forEach(i => { const p = PRODUCTS.find(x => x.id === i.id); if (p) msg += `• ${p.name}${i.variant ? ' (' + i.variant + ')' : ''} ×${i.qty}${NL}`; });
  msg += `${NL}${t('wa_subtotal')} : ${formatPrice(T.subtotal)}${NL}`;
  if (T.promo && T.discount > 0) msg += `${t('wa_promo')} : ${T.promo}${NL}${t('wa_discount')} : −${formatPrice(T.discount)}${NL}`;
  msg += `${t('wa_shipping')} : ${T.zone === 'outside' ? t('cart_zone_out') : t('cart_zone_casa')}${NL}`;
  msg += `${t('wa_shipping_fee')} : ${T.shipping === 0 ? t('wa_free') : formatPrice(T.shipping)}${NL}`;
  msg += `${t('wa_total')} : ${formatPrice(T.total)}${NL}${NL}`;
  msg += `${t('wa_name')} :${NL}${t('wa_phone')} :${NL}${t('wa_address')} :${NL}${NL}${t('wa_thanks')}`;

  // Persist the order so it appears in the admin (silent no-op if offline)
  if (window.Store && Store.saveOrder) {
    const order = { subtotal: T.subtotal, discount: T.discount, shipping: T.shipping, total: T.total,
      promo_code: T.discount > 0 ? T.promo : null, shipping_zone: T.zone, status: 'pending' };
    const items = cart.map(i => { const p = PRODUCTS.find(x => x.id === i.id); return { product_name: p ? p.name : i.id, variant: i.variant || null, qty: i.qty, unit_price: p ? p.price : 0 }; });
    Store.saveOrder(order, items);
  }

  track('InitiateCheckout', { value: T.total, currency: 'MAD', num_items: cartCount() });
  window.open(`${SOCIALS.whatsapp}?text=${msg}`, '_blank');
}

/* ---------------- Marketing pixels (Meta / Google Analytics) ---------------- */
function initPixels(seo) {
  const pid = String((seo && seo.meta_pixel) || META_PIXEL || '').trim();
  if (pid && !window.fbq) {
    !function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){n.callMethod?
      n.callMethod.apply(n,arguments):n.queue.push(arguments)};if(!f._fbq)f._fbq=n;
      n.push=n;n.loaded=!0;n.version='2.0';n.queue=[];t=b.createElement(e);t.async=!0;
      t.src=v;s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s)}(window,
      document,'script','https://connect.facebook.net/en_US/fbevents.js');
    fbq('init', pid);
    fbq('track', 'PageView');
  }
  const ga = String((seo && seo.ga) || GA_ID || '').trim();
  if (ga && !window.gtag) {
    const s = document.createElement('script'); s.async = true;
    s.src = 'https://www.googletagmanager.com/gtag/js?id=' + encodeURIComponent(ga);
    document.head.appendChild(s);
    window.dataLayer = window.dataLayer || [];
    window.gtag = function () { dataLayer.push(arguments); };
    gtag('js', new Date()); gtag('config', ga);
  }
}
/* Fire a Meta Pixel standard event (no-op when the pixel isn't loaded). */
function track(event, params) {
  try { if (window.fbq) fbq('track', event, params || {}); } catch (e) { /* never break the shop */ }
}

/* ---------------- Toast ---------------- */
let toastTimer;
function toast(text) {
  let el = document.getElementById('toast');
  if (!el) { el = document.createElement('div'); el.className = 'toast'; el.id = 'toast'; document.body.appendChild(el); }
  el.innerHTML = `${ICONS.check}<span>${text}</span>`;
  requestAnimationFrame(() => el.classList.add('show'));
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => el.classList.remove('show'), 2600);
}

/* ---------------- Scroll reveal ---------------- */
function initReveal() {
  const els = document.querySelectorAll('[data-reveal]');
  if (!('IntersectionObserver' in window)) { els.forEach(e => e.classList.add('in')); return; }
  const io = new IntersectionObserver((entries) => {
    entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } });
  }, { threshold: 0.12, rootMargin: '0px 0px -8% 0px' });
  els.forEach(e => io.observe(e));
}

/* ---------------- Product helpers ---------------- */
function badgeClass(b) { return b === 'New' ? 'new' : b === 'Limited' ? 'limited' : ''; }
function discountPct(p) { return p.oldPrice ? Math.round((1 - p.price / p.oldPrice) * 100) : 0; }
function isOnSale(p) { return !!p.oldPrice && p.oldPrice > p.price; }
function isSoldOut(p) { return (p.stock != null && p.stock <= 0) || p.status === 'out_of_stock'; }

/* Map a colour name (FR/EN/AR) to a swatch background for the product page. */
function colorHex(name) {
  const n = (name || '').toString().toLowerCase();
  const map = [
    [/(dor|gold|ذهب)/, 'linear-gradient(135deg,#e6cd86,#c0a062)'],
    [/(or rose|rose gold|rose-gold|روز)/, 'linear-gradient(135deg,#e7c2ad,#d99e86)'],
    [/(argent|silver|فض)/, 'linear-gradient(135deg,#e8e8ea,#b9bbbf)'],
    [/(blanc|white|nacr|pearl|أبيض|صدف)/, 'linear-gradient(135deg,#fbf7ef,#e7ddca)'],
    [/(rose|pink|وردي)/, '#e7b7c4'],
    [/(mauve|lilac|موف|بنفسج)/, '#b39ddb'],
    [/(vert|green|emerald|أخضر|زمرد)/, '#5b8b6b'],
    [/(bleu|blue|أزرق)/, '#7d9cc0'],
    [/(noir|black|أسود)/, '#2b2b2b'],
    [/(ivoire|ivory|عاج)/, 'linear-gradient(135deg,#f5efe2,#e3d7bf)']
  ];
  for (const [re, val] of map) if (re.test(n)) return val;
  return 'linear-gradient(135deg,#e6cd86,#c0a062)';
}

function productCard(p, delay = 0) {
  const badge = p.badge ? `<span class="product-badge ${badgeClass(p.badge)}">${p.badge}</span>` : '';
  const sale = isOnSale(p) ? `<span class="sale-badge">-${discountPct(p)}%</span>` : '';
  const old = isOnSale(p) ? `<s>${formatPrice(p.oldPrice)}</s>` : '';
  const priceBlock = `<div class="product-card__price">${old}<span class="now ${isOnSale(p)?'sale':''}">${formatPrice(p.price)}</span></div>`;
  return `<article class="product-card" data-reveal data-delay="${delay}">
    <div class="product-card__media">
      <a href="product.html?id=${p.id}" aria-label="${p.name}">${productMedia(p)}</a>
      ${badge}${sale}${isSoldOut(p) ? `<span class="sale-badge" style="background:#3a3a3a">${t('sold_out')}</span>` : ''}
      <div class="product-quick">
        ${isSoldOut(p)
          ? `<button class="btn btn--block btn--sm" disabled>${t('sold_out')}</button>`
          : `<button class="btn btn--gold btn--block btn--sm" onclick="addToCart('${p.id}')">${t('card_add', { price: formatPrice(p.price) })}</button>`}
      </div>
    </div>
    <div class="product-card__body">
      <div class="product-card__cat">${catLabel(p.category)}</div>
      <h3 class="product-card__name"><a href="product.html?id=${p.id}">${p.name}</a></h3>
      <div class="product-card__mat">${p.material}</div>
      <div class="product-card__foot">
        ${priceBlock}
        <div class="product-card__actions">
          <a class="link-arrow" href="product.html?id=${p.id}">${t('card_view')} ${ICONS.arrow}</a>
          <button class="card-wa" aria-label="Order ${p.name} on WhatsApp" title="${t('cart_wa')}" onclick="waProduct('${p.id}')">${ICONS.wa}</button>
        </div>
      </div>
    </div>
  </article>`;
}

function waProduct(id) {
  const p = PRODUCTS.find(x => x.id === id); if (!p) return;
  const msg = `${t('wa_hello')}%0A${t('wa_interested')} : ${p.name} (${formatPrice(p.price)})`;
  window.open(`${SOCIALS.whatsapp}?text=${msg}`, '_blank');
}

/* ---------------- Home: best sellers ---------------- */
function renderBestSellers() {
  const mount = document.getElementById('bestsellers-grid');
  if (!mount) return;
  const six = PRODUCTS.slice(0, 6);
  mount.innerHTML = six.map((p, i) => productCard(p, (i % 3) + 1)).join('');
}

/* ---------------- Collections page ---------------- */
function renderCollectionsPage() {
  const mount = document.getElementById('collection-grid');
  if (!mount) return;
  const params = new URLSearchParams(location.search);
  // support ?cat=necklaces|sets|earrings|promo and ?sort=new|best
  let filter = params.get('cat') || (params.get('sort') === 'best' ? 'best' : params.get('sort') === 'new' ? 'new' : 'all');
  let sort = params.get('sort') || 'featured';

  const FILTERS = [
    ['all', t('f_all')], ['necklaces', catLabel('necklaces')], ['sets', catLabel('sets')],
    ['earrings', catLabel('earrings')], ['new', t('f_new')], ['best', t('f_best')], ['promo', t('f_promo')]
  ];
  const filterBar = document.getElementById('filters');
  const sortSel = document.getElementById('sortSelect');
  filterBar.innerHTML = FILTERS.map(([key, label]) =>
    `<button class="filter-chip ${key === filter ? 'active' : ''}" data-filter="${key}">${label}</button>`
  ).join('');
  sortSel.value = ['featured','new','best','price-asc','price-desc'].includes(sort) ? sort : 'featured';

  function matchesFilter(p) {
    if (filter === 'all') return true;
    if (filter === 'new') return p.badge === 'New';
    if (filter === 'best') return p.badge === 'Best Seller';
    if (filter === 'promo') return isOnSale(p);
    return p.category === filter;
  }

  function apply() {
    let list = PRODUCTS.filter(matchesFilter);
    if (sort === 'price-asc') list = list.slice().sort((a,b)=>a.price-b.price);
    else if (sort === 'price-desc') list = list.slice().sort((a,b)=>b.price-a.price);
    else if (sort === 'new') list = list.filter(p=>p.badge==='New').concat(list.filter(p=>p.badge!=='New'));
    else if (sort === 'best') list = list.filter(p=>p.badge==='Best Seller').concat(list.filter(p=>p.badge!=='Best Seller'));
    mount.innerHTML = list.map((p,i)=>productCard(p,(i%3)+1)).join('') || `<p style="color:var(--muted);padding:3rem 0">${t('empty_cat')}</p>`;
    const n = list.length;
    const plural = getLang() === 'ar' ? '' : (n !== 1 ? 's' : '');
    document.getElementById('resultsCount').textContent = `${n} ${t('result_word')}${plural}`;
    initReveal();
    const url = new URL(location); url.searchParams.set('cat',filter); url.searchParams.set('sort',sort); history.replaceState(null,'',url);
  }

  filterBar.addEventListener('click', e => {
    const btn = e.target.closest('.filter-chip'); if (!btn) return;
    filter = btn.dataset.filter;
    filterBar.querySelectorAll('.filter-chip').forEach(b=>b.classList.toggle('active', b===btn));
    apply();
  });
  sortSel.addEventListener('change', () => { sort = sortSel.value; apply(); });
  apply();
}

/* ---------------- Product detail page ---------------- */
function renderProductPage() {
  const mount = document.getElementById('pdp');
  if (!mount) return;
  const id = new URLSearchParams(location.search).get('id');
  const p = PRODUCTS.find(x => x.id === id) || PRODUCTS[0];
  const gallery = (p.images && p.images.length) ? p.images : [p.image];
  const desc = pField(p, 'description');
  document.title = `${p.name} - ${BRAND}`;

  const stars = '★★★★★';
  const onSale = isOnSale(p);
  const soldOut = isSoldOut(p);
  const old = onSale ? `<s>${formatPrice(p.oldPrice)}</s>` : '';
  const save = onSale ? `<em>${t('pdp_save', { amount: formatPrice(p.oldPrice - p.price) })}</em>` : '';
  const salePct = onSale ? `<span class="sale-badge pdp__sale">-${discountPct(p)}%</span>` : '';
  const badge = p.badge ? `<span class="product-badge ${badgeClass(p.badge)}" style="position:static">${p.badge}</span>` : '';
  const dropIc = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.4"><path d="M12 3c3 3.6 6 6.7 6 10a6 6 0 0 1-12 0c0-3.3 3-6.4 6-10Z"/></svg>';

  const checks = [t('pdp_check_steel'), t('pdp_check_casa'), t('pdp_check_250'), t('pdp_check_fast')];

  mount.innerHTML = `
    <div class="wrap">
      <div class="breadcrumb" data-reveal>
        <a href="index.html">${t('pdp_home')}</a><span>/</span>
        <a href="collections.html?cat=${p.category}">${catLabel(p.category)}</a><span>/</span>
        <span>${p.name}</span>
      </div>
      <div class="pdp__grid">
        <div class="pdp__gallery" data-reveal>
          <div class="gallery__main" id="galMain"><img src="${gallery[0]}" alt="${p.name} - ${p.material}" onerror="this.outerHTML=phSVG('${p.category}')"></div>
          ${gallery.length > 1 ? `<div class="gallery__thumbs">
            ${gallery.map((src,i)=>
              `<div class="gallery__thumb ${i===0?'active':''}" data-src="${src}"><img src="${src}" alt="${p.name} - ${i+1}" loading="lazy"></div>`
            ).join('')}
          </div>` : ''}
        </div>
        <div class="pdp__info" data-reveal data-delay="1">
          ${badge ? `<div class="pdp__badges">${badge}</div>` : ''}
          <div class="pdp__cat">${catLabel(p.category)}</div>
          <h1 class="pdp__title">${p.name}</h1>
          <div class="pdp__rating"><span class="stars">${stars}</span> ${p.rating} · <span class="pdp__reviews">${t('pdp_reviews')}</span></div>
          <div class="pdp__price">${old}<span class="now ${onSale?'sale':''}">${formatPrice(p.price)}</span>${save}${salePct}</div>

          ${(p.variants && p.variants.length) ? `
          <div class="pdp__variants">
            <div class="pdp__variants-label">${t('pdp_color')} : <span id="variantName">${p.variants[0].name}</span></div>
            <div class="pdp__swatches" id="swatches">
              ${p.variants.map((v, i) => `<button type="button" class="swatch ${i===0?'active':''}" data-variant="${v.name}" aria-label="${v.name}" title="${v.name}" style="background:${colorHex(v.color || v.name)}"></button>`).join('')}
            </div>
          </div>` : ''}

          <ul class="pdp__checks">
            ${checks.map(c => `<li>${ICONS.check}<span>${c}</span></li>`).join('')}
          </ul>

          <p class="pdp__desc">${desc}</p>

          <div class="pdp__buy">
            <div class="pdp__buy-row">
              <div class="qty" aria-label="${t('pdp_qty')}">
                <button id="qtyMinus" aria-label="${t('pdp_dec')}">−</button>
                <span id="qtyVal">1</span>
                <button id="qtyPlus" aria-label="${t('pdp_inc')}">+</button>
              </div>
              <button class="btn pdp__add" id="pdpAdd" ${soldOut ? 'disabled' : ''}>${soldOut ? t('sold_out') : t('pdp_add')}</button>
            </div>
            <button class="btn btn--gold pdp__wa" id="pdpWa">${ICONS.wa} ${t('pdp_wa')}</button>
          </div>

          <div class="pdp__trust">
            <div><span class="pdp__trust-ic">${ICONS.shield}</span><b>${t('trust_steel')}</b><span>${t('pdp_check_casa')}</span></div>
            <div><span class="pdp__trust-ic">${ICONS.truck}</span><b>${t('cart_shipping')}</b><span>${t('cart_eta_val')}</span></div>
            <div><span class="pdp__trust-ic">${ICONS.wa}</span><b>${t('trust_cod')}</b><span>${t('trust_free_250')}</span></div>
          </div>

          <div class="pdp__care">
            <span class="pdp__care-ic">${dropIc}</span>
            <div>
              <b>${t('pdp_care_title')}</b>
              <p>${t('pdp_care_text')}</p>
            </div>
          </div>

          <div class="accordion" id="acc">
            ${accItem(t('acc_description'), `<p>${desc}</p>`, true)}
            ${accItem(t('acc_material'), t('acc_material_body'))}
            ${accItem(t('acc_delivery'), t('acc_delivery_body'))}
          </div>
        </div>
      </div>
    </div>

    <section class="pdp-related">
      <div class="wrap">
        <div class="section-head center" data-reveal><span class="eyebrow center">${t('pdp_related_eyebrow')}</span>
          <h2 class="section-title" style="font-size:clamp(1.7rem,3vw,2.4rem)">${t('pdp_related_title')}</h2></div>
        <div class="product-grid" id="related"></div>
      </div>
    </section>

    <div class="pdp-sticky" id="pdpSticky" aria-hidden="true">
      <div class="pdp-sticky__price">${formatPrice(p.price)}</div>
      <button class="btn btn--gold" id="pdpWaSticky">${ICONS.wa} ${t('pdp_wa')}</button>
    </div>`;

  // ---- gallery: thumbnails + finger swipe ----
  const main = document.getElementById('galMain');
  let galIndex = 0;
  function showImage(i) {
    galIndex = (i + gallery.length) % gallery.length;
    main.innerHTML = `<img src="${gallery[galIndex]}" alt="${p.name}">`;
    mount.querySelectorAll('.gallery__thumb').forEach((x, j) => x.classList.toggle('active', j === galIndex));
  }
  mount.querySelectorAll('.gallery__thumb').forEach((th, i) => th.addEventListener('click', () => showImage(i)));
  if (gallery.length > 1) {
    let sx = 0, sy = 0, tracking = false;
    main.addEventListener('touchstart', e => { const t0 = e.changedTouches[0]; sx = t0.clientX; sy = t0.clientY; tracking = true; }, { passive: true });
    main.addEventListener('touchend', e => {
      if (!tracking) return; tracking = false;
      const t1 = e.changedTouches[0], dx = t1.clientX - sx, dy = t1.clientY - sy;
      if (Math.abs(dx) > 40 && Math.abs(dx) > Math.abs(dy)) {
        // in RTL the visual direction is mirrored
        const dir = isRTL() ? -1 : 1;
        showImage(galIndex + (dx < 0 ? dir : -dir));
      }
    }, { passive: true });
  }

  // ---- colour variants ----
  let selectedVariant = (p.variants && p.variants.length) ? p.variants[0].name : null;
  const vName = document.getElementById('variantName');
  mount.querySelectorAll('.swatch').forEach(sw => sw.addEventListener('click', () => {
    mount.querySelectorAll('.swatch').forEach(x => x.classList.remove('active'));
    sw.classList.add('active');
    selectedVariant = sw.dataset.variant;
    if (vName) vName.textContent = selectedVariant;
  }));

  let q = 1;
  const qv = document.getElementById('qtyVal');
  document.getElementById('qtyMinus').onclick = () => { q = Math.max(1, q-1); qv.textContent = q; };
  document.getElementById('qtyPlus').onclick = () => { q++; qv.textContent = q; };
  document.getElementById('pdpAdd').onclick = () => { addToCart(p.id, q, selectedVariant); openCart(); };
  const waOrder = () => {
    const colour = selectedVariant ? `%0A${t('pdp_color')} : ${selectedVariant}` : '';
    const msg = `${t('wa_hello')}%0A${t('wa_interested')} : ${p.name} (${formatPrice(p.price)})${colour}%0A${t('pdp_qty')} : ${q}`;
    track('InitiateCheckout', { content_ids: [p.id], content_name: p.name, value: p.price * q, currency: 'MAD' });
    window.open(`${SOCIALS.whatsapp}?text=${msg}`, '_blank');
  };
  document.getElementById('pdpWa').onclick = waOrder;
  document.getElementById('pdpWaSticky').onclick = waOrder;

  initAccordion();

  const related = PRODUCTS.filter(x => x.category === p.category && x.id !== p.id)
    .concat(PRODUCTS.filter(x => x.category !== p.category && x.id !== p.id)).slice(0, 3);
  document.getElementById('related').innerHTML = related.map((x,i)=>productCard(x,(i%3)+1)).join('');

  const sticky = document.getElementById('pdpSticky');
  const buyBtn = document.getElementById('pdpWa');
  if (sticky && buyBtn && 'IntersectionObserver' in window) {
    new IntersectionObserver(([e]) => {
      sticky.classList.toggle('show', !e.isIntersecting && e.boundingClientRect.top < 0);
    }, { threshold: 0 }).observe(buyBtn);
  }

  track('ViewContent', { content_ids: [p.id], content_name: p.name, content_type: 'product', value: p.price, currency: 'MAD' });

  initReveal();
}

function accItem(title, inner, open = false) {
  return `<div class="acc-item ${open?'open':''}">
    <button class="acc-head"><span>${title}</span><i></i></button>
    <div class="acc-body" ${open?'style="max-height:600px"':''}><div class="acc-body__inner">${inner}</div></div>
  </div>`;
}
function initAccordion() {
  document.querySelectorAll('.acc-item').forEach(item => {
    const head = item.querySelector('.acc-head');
    const body = item.querySelector('.acc-body');
    head.addEventListener('click', () => {
      const open = item.classList.toggle('open');
      body.style.maxHeight = open ? body.scrollHeight + 'px' : '0';
    });
  });
}

/* ---------------- Newsletter ---------------- */
function initNewsletter() {
  const form = document.getElementById('newsletterForm');
  if (!form) return;
  form.addEventListener('submit', e => {
    e.preventDefault();
    const msg = form.querySelector('.form-msg');
    const email = form.querySelector('input').value.trim();
    if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) { msg.textContent = t('nl_invalid'); msg.style.color = '#d98a6a'; return; }
    msg.style.color = 'var(--gold-soft)';
    msg.textContent = t('nl_ok');
    form.querySelector('input').value = '';
  });
}

/* ---------------- Apply dynamic settings from Supabase ---------------- */
function applySettings(S, promo) {
  if (!S) return;
  const b = S.brand || {}, soc = S.socials || {}, shp = S.shipping || {}, seo = S.seo || {}, hp = S.homepage || {};
  if (b.name) BRAND = b.name;
  if (b.tagline) TAGLINE = b.tagline;
  if (b.logo_url) LOGO_SRC = b.logo_url;
  const wa = (soc.whatsapp || '').replace(/[^0-9]/g, '');
  if (wa) WHATSAPP_NUMBER = wa;
  if (soc.email) EMAIL = soc.email;
  SOCIALS = {
    instagram: soc.instagram || SOCIALS.instagram, facebook: soc.facebook || SOCIALS.facebook,
    tiktok: soc.tiktok || SOCIALS.tiktok, whatsapp: `https://wa.me/${WHATSAPP_NUMBER}`
  };
  if (typeof shp.outside_fee === 'number') SHIP_FEE = shp.outside_fee;
  if (typeof shp.free_threshold === 'number') SHIP_FREE_THRESHOLD = shp.free_threshold;
  if (typeof shp.casablanca_free === 'boolean') SHIP_CASA_FREE = shp.casablanca_free;
  if (shp.eta && typeof UI !== 'undefined') { UI.fr.cart_eta_val = shp.eta; }
  // All active codes become valid in the cart; the featured one drives the announcement bar
  if (window.Store && Store.promos && Store.promos.length) {
    PROMOS = Store.promos.map(p => ({
      code: String(p.code).toUpperCase(), type: p.discount_type,
      value: Number(p.discount_value), min: Number(p.min_order || 0)
    }));
  }
  if (promo) PROMO_CODE = String(promo.code).toUpperCase();

  // Homepage/i18n text overrides (FR)
  if (typeof UI !== 'undefined') {
    const f = UI.fr;
    const set = (k, v) => { if (v) f[k] = v; };
    set('hero_title', hp.hero_title_fr); set('hero_sub', hp.hero_sub_fr);
    set('hero_cta1', hp.hero_cta1_fr); set('hero_cta2', hp.hero_cta2_fr);
    if (hp.trust_casa) { f.trust_free_casa = hp.trust_casa; f.ship_casa_free = hp.trust_casa; }
    if (hp.trust_250) { f.trust_free_250 = hp.trust_250; f.ship_maroc_250 = hp.trust_250; }
    set('trust_cod', hp.trust_cod); set('trust_steel', hp.trust_steel);
    set('about_title', hp.story_title_fr); set('about_p', hp.story_text_fr);
    set('nl_title', hp.newsletter_title_fr); set('nl_sub', hp.newsletter_sub_fr);
    set('footer_desc', hp.footer_desc_fr);
  }
  // SEO
  if (seo.title) document.title = seo.title;
  if (seo.description) { const m = document.querySelector('meta[name="description"]'); if (m) m.setAttribute('content', seo.description); }
  // Homepage images/label
  if (document.body.dataset.page === 'home') {
    if (hp.hero_image) { const im = document.querySelector('.hero__frame img'); if (im) im.src = hp.hero_image; }
    if (hp.hero_label) { const l = document.querySelector('.hero__badge p'); if (l) l.textContent = hp.hero_label; }
    if (hp.story_image) { const im = document.querySelector('.editorial__media img'); if (im) im.src = hp.story_image; }
  }
}

/* ---------------- Boot ---------------- */
document.addEventListener('DOMContentLoaded', async () => {
  let seoSettings = null;
  try {
    if (window.Store && Store.hydrate) {
      const r = await Store.hydrate();
      if (r && r.ok) { applySettings(Store.settings, Store.promo); seoSettings = Store.settings.seo || null; }
    }
  } catch (e) { /* graceful fallback to built-in data */ }
  initPixels(seoSettings);
  applyStaticI18n();
  renderHeader();
  renderTrustBar();
  renderFooter();
  renderBestSellers();
  renderCollectionsPage();
  renderProductPage();
  renderCartPage();
  initNewsletter();
  initReveal();
});
