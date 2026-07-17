/* ============================================================
   BELORYA — storefront behaviour (WordPress / WooCommerce theme)
   Ported 1:1 from the original static site (js/app.js + js/products.js)
   so the design and UX are identical. Differences vs. the static site:
     • header/footer are rendered by PHP (header.php / footer.php),
       so this file only *binds* them (announce, lang, menu, cart).
     • the product catalogue comes from WooCommerce, injected as
       window.BELORYA.products (same shape as the old PRODUCTS array).
     • a WhatsApp order is also recorded in WooCommerce (admin → Orders)
       through the belorya_wa_order AJAX endpoint.
   ============================================================ */

/* ---------------- Config (from wp_localize_script) ---------------- */
var CFG = window.BELORYA || {};
var CURRENCY = CFG.currency || 'MAD';
var WHATSAPP_NUMBER = (CFG.whatsapp || '212660323891').replace(/[^0-9]/g, '');
var BRAND = CFG.brand || 'Belorya';
var EMAIL = (CFG.socials && CFG.socials.email) || 'belorya1@gmail.com';
var SOCIALS = {
  instagram: (CFG.socials && CFG.socials.instagram) || 'https://www.instagram.com/belorya_/',
  facebook: (CFG.socials && CFG.socials.facebook) || 'https://www.facebook.com/profile.php?id=61591102114678',
  tiktok: (CFG.socials && CFG.socials.tiktok) || 'https://www.tiktok.com/@belorya5',
  whatsapp: 'https://wa.me/' + WHATSAPP_NUMBER
};

/* Product catalogue (same shape as the old PRODUCTS array) */
var PRODUCTS = Array.isArray(CFG.products) ? CFG.products : [];

/* Promo + shipping rules */
var PROMOS = (CFG.promos && CFG.promos.length)
  ? CFG.promos.map(function (p) { return { code: String(p.code).toUpperCase(), type: p.type, value: Number(p.value), min: Number(p.min || 0) }; })
  : [{ code: (CFG.promoCode || 'BELORYA10'), type: 'percent', value: 10, min: 0 }];
var PROMO_CODE = CFG.promoCode || 'BELORYA10';
var SHIP_FEE = (CFG.shipping && CFG.shipping.fee != null) ? Number(CFG.shipping.fee) : 35;
var SHIP_FREE_THRESHOLD = (CFG.shipping && CFG.shipping.threshold != null) ? Number(CFG.shipping.threshold) : 250;
var SHIP_CASA_FREE = !(CFG.shipping && CFG.shipping.casa_free === false);

var HOME_URL = CFG.homeUrl || '/';
var SHOP_URL = CFG.shopUrl || HOME_URL;
var CART_URL = CFG.cartUrl || (HOME_URL + 'panier/');

function findPromo(code) {
  var c = String(code || '').trim().toUpperCase();
  if (!c) return null;
  return PROMOS.find(function (p) { return String(p.code).toUpperCase() === c; }) || null;
}

/* ---------------- Product URL helper ----------------
   WooCommerce products live at /produit/<slug>/. Each catalogue entry
   carries its own permalink in `url`; fall back to a query link. */
function productUrl(p) {
  if (p && p.url) return p.url;
  return SHOP_URL + '?p=' + encodeURIComponent(p ? p.id : '');
}

/* ---------------- Shared icons ---------------- */
var ICONS = {
  cart: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.4"><path d="M6 7h12l-1 12.5a1.5 1.5 0 0 1-1.5 1.4H8.5A1.5 1.5 0 0 1 7 19.5L6 7Z"/><path d="M9 7a3 3 0 0 1 6 0"/></svg>',
  wa: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 2a10 10 0 0 0-8.6 15l-1.3 4.7 4.8-1.3A10 10 0 1 0 12 2Zm5.8 14.2c-.2.7-1.4 1.3-2 1.4-.5.1-1.2.1-1.9-.1-.4-.1-1-.3-1.8-.6-3-1.3-5-4.4-5.2-4.6-.1-.2-1.2-1.6-1.2-3s.7-2.1 1-2.4c.2-.3.5-.4.7-.4h.5c.2 0 .4 0 .6.5l.8 2c.1.2.1.4 0 .5l-.4.5-.3.3c-.1.2-.3.3-.1.6.1.3.7 1.1 1.4 1.8.9.8 1.7 1 2 1.2.2.1.4.1.5-.1l.7-.8c.2-.2.3-.2.6-.1l1.9.9c.3.1.5.2.5.4.1.1.1.8-.1 1.4Z"/></svg>',
  arrow: '<svg viewBox="0 0 18 10" fill="none" stroke="currentColor" stroke-width="1.4"><path d="M1 5h15M12 1l4 4-4 4"/></svg>',
  check: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><path d="M5 13l4 4L19 7"/></svg>',
  shield: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.4"><path d="M12 3l7 3v5c0 4.5-3 8-7 10-4-2-7-5.5-7-10V6l7-3Z"/><path d="M9 12l2 2 4-4"/></svg>',
  truck: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.4"><path d="M3 7h11v8H3zM14 10h4l3 3v2h-7"/><circle cx="7" cy="18" r="1.6"/><circle cx="17.5" cy="18" r="1.6"/></svg>',
  coins: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.4"><ellipse cx="12" cy="6" rx="7" ry="3"/><path d="M5 6v6c0 1.7 3.1 3 7 3s7-1.3 7-3V6"/><path d="M5 12v6c0 1.7 3.1 3 7 3s7-1.3 7-3v-6"/></svg>'
};

/* ---------------- Product art / media helpers (from products.js) ---------------- */
var PH_ART = {
  necklaces: '<path d="M40 40 Q100 130 160 40" fill="none" stroke="url(#g)" stroke-width="1.4"/><circle cx="100" cy="118" r="11" fill="none" stroke="url(#g)" stroke-width="1.4"/><circle cx="100" cy="118" r="3" fill="url(#g)"/>',
  sets: '<path d="M40 44 Q100 120 160 44" fill="none" stroke="url(#g)" stroke-width="1.4"/><circle cx="72" cy="150" r="10" fill="none" stroke="url(#g)" stroke-width="1.4"/><circle cx="128" cy="150" r="10" fill="none" stroke="url(#g)" stroke-width="1.4"/>',
  earrings: '<circle cx="72" cy="84" r="26" fill="none" stroke="url(#g)" stroke-width="1.4"/><circle cx="128" cy="116" r="26" fill="none" stroke="url(#g)" stroke-width="1.4"/><circle cx="72" cy="58" r="3" fill="url(#g)"/><circle cx="128" cy="90" r="3" fill="url(#g)"/>'
};
function phSVG(cat) {
  var art = PH_ART[cat] || PH_ART.necklaces;
  return '<div class="ph"><svg viewBox="0 0 200 200" aria-hidden="true">' +
    '<defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1">' +
    '<stop offset="0" stop-color="#9c7c33"/><stop offset="0.5" stop-color="#e3c98a"/><stop offset="1" stop-color="#c9a24b"/>' +
    '</linearGradient></defs>' + art + '</svg></div>';
}
window.phSVG = phSVG;
function productMedia(p) {
  if (p.image) {
    return '<img src="' + p.image + '" alt="' + p.name + ' - ' + p.material + '" loading="lazy" onerror="this.outerHTML=phSVG(\'' + p.category + '\')">';
  }
  return phSVG(p.category);
}
function formatPrice(v) { return v + ' ' + CURRENCY; }

/* ---------------- Language switch binding (PHP renders the buttons) ---------------- */
function bindLangSwitch(root) {
  (root || document).querySelectorAll('.lang-opt').forEach(function (b) {
    b.classList.toggle('active', b.dataset.lang === getLang());
    b.addEventListener('click', function () {
      if (b.dataset.lang !== getLang()) setLang(b.dataset.lang);
    });
  });
}

/* ---------------- Announcement bar (PHP renders the shell) ---------------- */
function bindAnnounce() {
  var full = document.querySelector('.announce__msg--full');
  var short = document.querySelector('.announce__msg--short');
  if (full) full.innerHTML = t('announce_text', { code: '<strong>' + PROMO_CODE + '</strong>' });
  if (short) short.innerHTML = t('announce_short', { code: '<strong>' + PROMO_CODE + '</strong>' });
  var btn = document.getElementById('announceCopy');
  if (!btn) return;
  btn.dataset.code = PROMO_CODE;
  btn.addEventListener('click', function () {
    var code = btn.dataset.code || PROMO_CODE;
    (async function () {
      try { await navigator.clipboard.writeText(code); }
      catch (e) {
        var ta = document.createElement('textarea');
        ta.value = code; document.body.appendChild(ta); ta.select();
        try { document.execCommand('copy'); } catch (e2) {}
        ta.remove();
      }
      btn.classList.add('copied');
      var span = btn.querySelector('span'); if (span) span.textContent = t('announce_copied');
      setTimeout(function () {
        btn.classList.remove('copied');
        if (span) span.textContent = t('announce_copy');
      }, 2200);
    })();
  });
}

/* ---------------- Header behaviour (menu, scroll, cart) ---------------- */
function bindHeader() {
  var header = document.getElementById('header');
  if (header) {
    var onScroll = function () { header.classList.toggle('scrolled', window.scrollY > 20); };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
  }
  var toggle = document.getElementById('navToggle');
  var menu = document.getElementById('mobileMenu');
  if (toggle && menu) {
    toggle.addEventListener('click', function () {
      document.body.classList.toggle('menu-open');
      menu.setAttribute('aria-hidden', document.body.classList.contains('menu-open') ? 'false' : 'true');
    });
    menu.querySelectorAll('a').forEach(function (a) {
      a.addEventListener('click', function () { document.body.classList.remove('menu-open'); });
    });
  }
  var cartOpen = document.getElementById('cartOpen');
  if (cartOpen) cartOpen.addEventListener('click', openCart);
}

/* ---------------- Trust bar ---------------- */
function renderTrustBar() {
  document.querySelectorAll('.trust-bar-mount').forEach(function (mount) {
    var items = [
      [ICONS.truck, t('trust_free_casa')],
      [ICONS.coins, t('trust_free_250')],
      [ICONS.wa, t('trust_cod')],
      [ICONS.shield, t('trust_steel')]
    ];
    mount.innerHTML = '<div class="wrap"><div class="trust-bar" data-reveal>' +
      items.map(function (it) { return '<div class="trust-bar__item"><span class="trust-bar__ic">' + it[0] + '</span><span>' + it[1] + '</span></div>'; }).join('') +
      '</div></div>';
  });
}

/* ---------------- Cart state ---------------- */
var CART_KEY = 'eclat_cart';
var PROMO_KEY = 'belorya_promo';
var ZONE_KEY = 'belorya_zone';

function getCart() { try { return JSON.parse(localStorage.getItem(CART_KEY)) || []; } catch (e) { return []; } }
function saveCart(c) { localStorage.setItem(CART_KEY, JSON.stringify(c)); updateCartCount(); }
function getPromo() { return findPromo(localStorage.getItem(PROMO_KEY)); }
function setPromo(v) { if (v) localStorage.setItem(PROMO_KEY, v); else localStorage.removeItem(PROMO_KEY); }
function getZone() { return localStorage.getItem(ZONE_KEY) === 'outside' ? 'outside' : 'casablanca'; }
function setZone(z) { localStorage.setItem(ZONE_KEY, z === 'outside' ? 'outside' : 'casablanca'); }

function lineKey(i) { return i.id + '|' + (i.variant || ''); }
function addToCart(id, qty, variant) {
  qty = qty || 1;
  var p = PRODUCTS.find(function (x) { return x.id === id; });
  if (!p) return;
  var v = variant || null;
  var cart = getCart();
  var found = cart.find(function (i) { return i.id === id && (i.variant || null) === v; });
  if (found) found.qty += qty; else cart.push({ id: id, qty: qty, variant: v });
  saveCart(cart);
  renderCart();
  renderCartPage();
  toast(t('cart_added', { name: p.name + (v ? ' · ' + v : '') }));
  track('AddToCart', { content_ids: [id], content_name: p.name, content_type: 'product', value: p.price * qty, currency: 'MAD' });
}
window.addToCart = addToCart;
function setQty(key, qty) {
  var cart = getCart();
  if (qty <= 0) cart = cart.filter(function (i) { return lineKey(i) !== key; });
  else { var it = cart.find(function (i) { return lineKey(i) === key; }); if (it) it.qty = qty; }
  saveCart(cart); renderCart(); renderCartPage();
}
window.setQty = setQty;
function cartSubtotal() {
  return getCart().reduce(function (s, i) {
    var p = PRODUCTS.find(function (x) { return x.id === i.id; }); return s + (p ? p.price * i.qty : 0);
  }, 0);
}
function cartCount() { return getCart().reduce(function (s, i) { return s + i.qty; }, 0); }
function updateCartCount() {
  var el = document.getElementById('cartCount');
  if (!el) return;
  var n = cartCount();
  el.textContent = n;
  el.classList.toggle('show', n > 0);
}

function computeTotals() {
  var subtotal = cartSubtotal();
  var applied = getPromo();
  var promoMin = applied ? Number(applied.min || 0) : 0;
  var discount = 0;
  if (applied && subtotal >= promoMin) {
    discount = applied.type === 'fixed'
      ? Math.min(Number(applied.value), subtotal)
      : Math.round(subtotal * (Number(applied.value) / 100));
  }
  var zone = getZone();
  var fee = subtotal >= SHIP_FREE_THRESHOLD ? 0 : SHIP_FEE;
  var shipping = (zone === 'casablanca' && SHIP_CASA_FREE) ? 0 : fee;
  var total = Math.max(0, subtotal - discount + shipping);
  return { subtotal: subtotal, promo: applied ? applied.code : null, promoMin: promoMin, discount: discount, zone: zone, shipping: shipping, total: total };
}

/* ---------------- Cart drawer ---------------- */
function ensureCartDOM() {
  if (document.getElementById('cartDrawer')) return;
  var div = document.createElement('div');
  div.innerHTML =
    '<div class="cart-overlay" id="cartOverlay"></div>' +
    '<aside class="cart-drawer" id="cartDrawer" aria-label="Shopping bag" aria-hidden="true">' +
      '<div class="cart-drawer__head"><h3>' + t('cart_title') + ' <span id="cartHeadCount"></span></h3>' +
      '<button class="cart-close" id="cartClose" aria-label="Close">✕</button></div>' +
      '<div class="cart-body" id="cartBody"></div>' +
      '<div class="cart-foot" id="cartFoot" hidden></div>' +
    '</aside>';
  document.body.appendChild(div);
  document.getElementById('cartOverlay').addEventListener('click', closeCart);
  document.getElementById('cartClose').addEventListener('click', closeCart);
}
function openCart() { ensureCartDOM(); renderCart(); document.getElementById('cartOverlay').classList.add('open'); document.getElementById('cartDrawer').classList.add('open'); }
function closeCart() { var o = document.getElementById('cartOverlay'), d = document.getElementById('cartDrawer'); if (o) o.classList.remove('open'); if (d) d.classList.remove('open'); }

function renderCart() {
  ensureCartDOM();
  var body = document.getElementById('cartBody');
  var foot = document.getElementById('cartFoot');
  var cart = getCart();
  document.getElementById('cartHeadCount').textContent = cartCount() ? '(' + cartCount() + ')' : '';
  if (!cart.length) {
    body.innerHTML = '<div class="cart-empty">' + ICONS.cart + '<p>' + t('cart_empty') + '</p>' +
      '<a class="btn btn--ghost btn--sm" href="' + SHOP_URL + '" style="margin-top:1.4rem">' + t('cart_explore') + '</a></div>';
    foot.hidden = true; return;
  }
  body.innerHTML = cart.map(function (i) {
    var p = PRODUCTS.find(function (x) { return x.id === i.id; }); if (!p) return '';
    var k = lineKey(i);
    return '<div class="cart-item">' +
      '<a class="cart-item__media" href="' + productUrl(p) + '">' + productMedia(p) + '</a>' +
      '<div><a href="' + productUrl(p) + '" class="cart-item__name">' + p.name + '</a>' +
      '<div class="cart-item__mat">' + p.material + (i.variant ? ' · <span class="cart-item__variant">' + i.variant + '</span>' : '') + '</div>' +
      '<div class="qty">' +
        '<button onclick="setQty(\'' + k + '\',' + (i.qty - 1) + ')" aria-label="' + t('pdp_dec') + '">−</button>' +
        '<span>' + i.qty + '</span>' +
        '<button onclick="setQty(\'' + k + '\',' + (i.qty + 1) + ')" aria-label="' + t('pdp_inc') + '">+</button>' +
      '</div></div>' +
      '<div class="cart-item__right"><div class="cart-item__price">' + formatPrice(p.price * i.qty) + '</div>' +
      '<button class="cart-item__remove" onclick="setQty(\'' + k + '\',0)">' + t('cart_remove') + '</button></div>' +
    '</div>';
  }).join('');

  foot.hidden = false;
  foot.innerHTML =
    '<div class="cart-foot__row subtotal"><span>' + t('cart_subtotal') + '</span><span>' + formatPrice(cartSubtotal()) + '</span></div>' +
    '<a class="btn btn--gold btn--block" href="' + CART_URL + '">' + t('cart_view') + '</a>' +
    '<button class="btn btn--ghost btn--block" id="cartContinue" style="margin-top:.7rem">' + t('cart_continue') + '</button>';
  document.getElementById('cartContinue').onclick = closeCart;
}

/* ---------------- Full cart page (checkout logic) ---------------- */
function renderCartPage() {
  var mount = document.getElementById('cart-page');
  if (!mount) return;
  var cart = getCart();
  if (!cart.length) {
    mount.innerHTML = '<div class="wrap"><div class="cart-page-empty">' + ICONS.cart +
      '<p>' + t('cart_empty_page') + '</p>' +
      '<a class="btn btn--gold" href="' + SHOP_URL + '">' + t('cart_explore') + '</a></div></div>';
    return;
  }
  var T = computeTotals();
  var promoOn = !!T.promo;
  var zone = T.zone;
  var trust = [t('pdp_check_casa'), t('pdp_check_250'), t('trust_cod'), t('trust_steel')];

  mount.innerHTML =
    '<div class="wrap cart-page__grid">' +
      '<div class="cart-page__items">' +
        cart.map(function (i) {
          var p = PRODUCTS.find(function (x) { return x.id === i.id; }); if (!p) return '';
          var k = lineKey(i);
          return '<div class="cart-line">' +
            '<a class="cart-line__media" href="' + productUrl(p) + '">' + productMedia(p) + '</a>' +
            '<div class="cart-line__info"><a href="' + productUrl(p) + '" class="cart-line__name">' + p.name + '</a>' +
            '<div class="cart-line__mat">' + p.material + (i.variant ? ' · <span class="cart-item__variant">' + i.variant + '</span>' : '') + '</div>' +
            '<div class="cart-line__controls"><div class="qty">' +
              '<button onclick="setQty(\'' + k + '\',' + (i.qty - 1) + ')" aria-label="' + t('pdp_dec') + '">−</button>' +
              '<span>' + i.qty + '</span>' +
              '<button onclick="setQty(\'' + k + '\',' + (i.qty + 1) + ')" aria-label="' + t('pdp_inc') + '">+</button>' +
            '</div>' +
            '<button class="cart-item__remove" onclick="setQty(\'' + k + '\',0)">' + t('cart_remove') + '</button></div></div>' +
            '<div class="cart-line__price">' + formatPrice(p.price * i.qty) + '</div>' +
          '</div>';
        }).join('') +
      '</div>' +
      '<aside class="cart-summary-card">' +
        '<h2 class="cart-summary-card__title">' + t('cart_summary_title') + '</h2>' +
        '<div class="cart-promo"><label class="cart-sub-label">' + t('cart_promo_label') + '</label>' +
          '<div class="cart-promo__row">' +
            '<input type="text" id="promoInput" placeholder="' + t('cart_promo_ph') + '" value="' + (promoOn ? T.promo : '') + '" ' + (promoOn ? 'disabled' : '') + ' autocomplete="off" spellcheck="false">' +
            '<button class="btn btn--ghost btn--sm" id="promoApply">' + (promoOn ? t('cart_remove') : t('cart_promo_apply')) + '</button>' +
          '</div>' +
          '<p class="cart-promo__msg ' + (promoOn ? (T.discount > 0 ? 'ok' : 'bad') : '') + '" id="promoMsg">' +
            (promoOn ? (T.discount > 0 ? ICONS.check + ' ' + t('cart_promo_ok') : t('cart_promo_min', { min: formatPrice(T.promoMin) })) : '') +
          '</p></div>' +
        '<div class="cart-zone"><label class="cart-sub-label">' + t('cart_zone_label') + '</label>' +
          '<div class="cart-zone__opts">' +
            '<label class="cart-zone__opt ' + (zone === 'casablanca' ? 'active' : '') + '"><input type="radio" name="zone" value="casablanca" ' + (zone === 'casablanca' ? 'checked' : '') + '><span>' + t('cart_zone_casa') + '</span></label>' +
            '<label class="cart-zone__opt ' + (zone === 'outside' ? 'active' : '') + '"><input type="radio" name="zone" value="outside" ' + (zone === 'outside' ? 'checked' : '') + '><span>' + t('cart_zone_out') + '</span></label>' +
          '</div></div>' +
        '<div class="cart-summary">' +
          '<div class="cart-foot__row"><span>' + t('cart_subtotal') + '</span><span>' + formatPrice(T.subtotal) + '</span></div>' +
          (T.discount > 0 ? '<div class="cart-foot__row discount"><span>' + t('cart_discount') + '</span><span>−' + formatPrice(T.discount) + '</span></div>' : '') +
          '<div class="cart-foot__row"><span>' + t('cart_shipping') + '</span><span>' + (T.shipping === 0 ? t('cart_free') : formatPrice(T.shipping)) + '</span></div>' +
          '<div class="cart-foot__row total"><span>' + t('cart_total') + '</span><span>' + formatPrice(T.total) + '</span></div>' +
          '<div class="cart-foot__row eta"><span>' + t('cart_eta_label') + '</span><span>' + t('cart_eta_val') + '</span></div>' +
        '</div>' +
        '<button class="btn btn--gold btn--block" id="cartWa">' + ICONS.wa + ' ' + t('cart_wa') + '</button>' +
        '<a class="btn btn--ghost btn--block" href="' + SHOP_URL + '" style="margin-top:.7rem">' + t('cart_continue') + '</a>' +
        '<ul class="cart-trust">' + trust.map(function (x) { return '<li>' + ICONS.check + '<span>' + x + '</span></li>'; }).join('') + '</ul>' +
      '</aside>' +
    '</div>';

  var promoInput = document.getElementById('promoInput');
  var promoMsg = document.getElementById('promoMsg');
  document.getElementById('promoApply').onclick = function () {
    if (getPromo()) { setPromo(null); renderCartPage(); return; }
    var found = findPromo(promoInput.value);
    if (found) { setPromo(found.code); renderCartPage(); }
    else { promoMsg.className = 'cart-promo__msg bad'; promoMsg.textContent = t('cart_promo_bad'); }
  };
  mount.querySelectorAll('input[name="zone"]').forEach(function (r) {
    r.addEventListener('change', function () { setZone(r.value); renderCartPage(); });
  });
  document.getElementById('cartWa').onclick = waOrderCart;
}

function waOrderCart() {
  var cart = getCart();
  if (!cart.length) return;
  var T = computeTotals();
  var NL = '%0A';
  var msg = t('wa_hello') + NL + NL + t('wa_want') + NL;
  cart.forEach(function (i) { var p = PRODUCTS.find(function (x) { return x.id === i.id; }); if (p) msg += '• ' + p.name + (i.variant ? ' (' + i.variant + ')' : '') + ' ×' + i.qty + NL; });
  msg += NL + t('wa_subtotal') + ' : ' + formatPrice(T.subtotal) + NL;
  if (T.promo && T.discount > 0) msg += t('wa_promo') + ' : ' + T.promo + NL + t('wa_discount') + ' : −' + formatPrice(T.discount) + NL;
  msg += t('wa_shipping') + ' : ' + (T.zone === 'outside' ? t('cart_zone_out') : t('cart_zone_casa')) + NL;
  msg += t('wa_shipping_fee') + ' : ' + (T.shipping === 0 ? t('wa_free') : formatPrice(T.shipping)) + NL;
  msg += t('wa_total') + ' : ' + formatPrice(T.total) + NL + NL;
  msg += t('wa_name') + ' :' + NL + t('wa_phone') + ' :' + NL + t('wa_address') + ' :' + NL + NL + t('wa_thanks');

  /* Record the order in WooCommerce (admin → Orders). Silent if offline. */
  recordWooOrder(cart, T);

  track('InitiateCheckout', { value: T.total, currency: 'MAD', num_items: cartCount() });
  window.open(SOCIALS.whatsapp + '?text=' + msg, '_blank');
}

/* Post the cart to WooCommerce so a real order is created (status on-hold). */
function recordWooOrder(cart, T) {
  if (!CFG.ajaxUrl || !CFG.nonce) return;
  try {
    var body = new URLSearchParams();
    body.set('action', 'belorya_wa_order');
    body.set('nonce', CFG.nonce);
    body.set('zone', T.zone);
    body.set('promo', T.discount > 0 ? (T.promo || '') : '');
    body.set('items', JSON.stringify(cart.map(function (i) { return { id: i.id, qty: i.qty, variant: i.variant || '' }; })));
    fetch(CFG.ajaxUrl, { method: 'POST', credentials: 'same-origin', headers: { 'Content-Type': 'application/x-www-form-urlencoded' }, body: body.toString() })
      .catch(function () { /* never block the WhatsApp flow */ });
  } catch (e) { /* no-op */ }
}

/* ---------------- Marketing pixels ---------------- */
function initPixels() {
  var pid = String(CFG.metaPixel || '').trim();
  if (pid && !window.fbq) {
    !function (f, b, e, v, n, t, s) { if (f.fbq) return; n = f.fbq = function () { n.callMethod ? n.callMethod.apply(n, arguments) : n.queue.push(arguments); }; if (!f._fbq) f._fbq = n; n.push = n; n.loaded = !0; n.version = '2.0'; n.queue = []; t = b.createElement(e); t.async = !0; t.src = v; s = b.getElementsByTagName(e)[0]; s.parentNode.insertBefore(t, s); }(window, document, 'script', 'https://connect.facebook.net/en_US/fbevents.js');
    fbq('init', pid);
    fbq('track', 'PageView');
  }
  var ga = String(CFG.gaId || '').trim();
  if (ga && !window.gtag) {
    var s = document.createElement('script'); s.async = true;
    s.src = 'https://www.googletagmanager.com/gtag/js?id=' + encodeURIComponent(ga);
    document.head.appendChild(s);
    window.dataLayer = window.dataLayer || [];
    window.gtag = function () { dataLayer.push(arguments); };
    gtag('js', new Date()); gtag('config', ga);
  }
}
function track(event, params) {
  try { if (window.fbq) fbq('track', event, params || {}); } catch (e) { /* never break the shop */ }
}

/* ---------------- Toast ---------------- */
var toastTimer;
function toast(text) {
  var el = document.getElementById('toast');
  if (!el) { el = document.createElement('div'); el.className = 'toast'; el.id = 'toast'; document.body.appendChild(el); }
  el.innerHTML = ICONS.check + '<span>' + text + '</span>';
  requestAnimationFrame(function () { el.classList.add('show'); });
  clearTimeout(toastTimer);
  toastTimer = setTimeout(function () { el.classList.remove('show'); }, 2600);
}

/* ---------------- Scroll reveal ---------------- */
function initReveal() {
  var els = document.querySelectorAll('[data-reveal]');
  if (!('IntersectionObserver' in window)) { els.forEach(function (e) { e.classList.add('in'); }); return; }
  var io = new IntersectionObserver(function (entries) {
    entries.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } });
  }, { threshold: 0.12, rootMargin: '0px 0px -8% 0px' });
  els.forEach(function (e) { io.observe(e); });
}

/* ---------------- Product card + helpers ---------------- */
function badgeClass(b) { return b === 'New' ? 'new' : b === 'Limited' ? 'limited' : ''; }
function discountPct(p) { return p.oldPrice ? Math.round((1 - p.price / p.oldPrice) * 100) : 0; }
function isOnSale(p) { return !!p.oldPrice && p.oldPrice > p.price; }
function isSoldOut(p) { return (p.stock != null && p.stock <= 0) || p.status === 'out_of_stock'; }

function colorHex(name) {
  var n = (name || '').toString().toLowerCase();
  var map = [
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
  for (var idx = 0; idx < map.length; idx++) if (map[idx][0].test(n)) return map[idx][1];
  return 'linear-gradient(135deg,#e6cd86,#c0a062)';
}

function productCard(p, delay) {
  delay = delay || 0;
  var badge = p.badge ? '<span class="product-badge ' + badgeClass(p.badge) + '">' + p.badge + '</span>' : '';
  var sale = isOnSale(p) ? '<span class="sale-badge">-' + discountPct(p) + '%</span>' : '';
  var old = isOnSale(p) ? '<s>' + formatPrice(p.oldPrice) + '</s>' : '';
  var priceBlock = '<div class="product-card__price">' + old + '<span class="now ' + (isOnSale(p) ? 'sale' : '') + '">' + formatPrice(p.price) + '</span></div>';
  return '<article class="product-card" data-reveal data-delay="' + delay + '">' +
    '<div class="product-card__media">' +
      '<a href="' + productUrl(p) + '" aria-label="' + p.name + '">' + productMedia(p) + '</a>' +
      badge + sale + (isSoldOut(p) ? '<span class="sale-badge" style="background:#3a3a3a">' + t('sold_out') + '</span>' : '') +
      '<div class="product-quick">' +
        (isSoldOut(p)
          ? '<button class="btn btn--block btn--sm" disabled>' + t('sold_out') + '</button>'
          : '<button class="btn btn--gold btn--block btn--sm" onclick="addToCart(\'' + p.id + '\')">' + t('card_add', { price: formatPrice(p.price) }) + '</button>') +
      '</div>' +
    '</div>' +
    '<div class="product-card__body">' +
      '<div class="product-card__cat">' + catLabel(p.category) + '</div>' +
      '<h3 class="product-card__name"><a href="' + productUrl(p) + '">' + p.name + '</a></h3>' +
      '<div class="product-card__mat">' + p.material + '</div>' +
      '<div class="product-card__foot">' + priceBlock +
        '<div class="product-card__actions">' +
          '<a class="link-arrow" href="' + productUrl(p) + '">' + t('card_view') + ' ' + ICONS.arrow + '</a>' +
          '<button class="card-wa" aria-label="Order ' + p.name + ' on WhatsApp" title="' + t('cart_wa') + '" onclick="waProduct(\'' + p.id + '\')">' + ICONS.wa + '</button>' +
        '</div>' +
      '</div>' +
    '</div>' +
  '</article>';
}

function waProduct(id) {
  var p = PRODUCTS.find(function (x) { return x.id === id; }); if (!p) return;
  var msg = t('wa_hello') + '%0A' + t('wa_interested') + ' : ' + p.name + ' (' + formatPrice(p.price) + ')';
  window.open(SOCIALS.whatsapp + '?text=' + msg, '_blank');
}
window.waProduct = waProduct;

/* ---------------- Home: best sellers grid ---------------- */
function renderBestSellers() {
  var mount = document.getElementById('bestsellers-grid');
  if (!mount) return;
  var six = PRODUCTS.slice(0, 6);
  mount.innerHTML = six.map(function (p, i) { return productCard(p, (i % 3) + 1); }).join('');
}

/* ---------------- Collections page ---------------- */
function renderCollectionsPage() {
  var mount = document.getElementById('collection-grid');
  if (!mount) return;
  var params = new URLSearchParams(location.search);
  var filter = params.get('cat') || (params.get('sort') === 'best' ? 'best' : params.get('sort') === 'new' ? 'new' : 'all');
  var sort = params.get('sort') || 'featured';

  var FILTERS = [
    ['all', t('f_all')], ['necklaces', catLabel('necklaces')], ['sets', catLabel('sets')],
    ['earrings', catLabel('earrings')], ['new', t('f_new')], ['best', t('f_best')], ['promo', t('f_promo')]
  ];
  var filterBar = document.getElementById('filters');
  var sortSel = document.getElementById('sortSelect');
  filterBar.innerHTML = FILTERS.map(function (f) {
    return '<button class="filter-chip ' + (f[0] === filter ? 'active' : '') + '" data-filter="' + f[0] + '">' + f[1] + '</button>';
  }).join('');
  sortSel.value = ['featured', 'new', 'best', 'price-asc', 'price-desc'].indexOf(sort) !== -1 ? sort : 'featured';

  function matchesFilter(p) {
    if (filter === 'all') return true;
    if (filter === 'new') return p.badge === 'New';
    if (filter === 'best') return p.badge === 'Best Seller';
    if (filter === 'promo') return isOnSale(p);
    return p.category === filter;
  }

  function apply() {
    var list = PRODUCTS.filter(matchesFilter);
    if (sort === 'price-asc') list = list.slice().sort(function (a, b) { return a.price - b.price; });
    else if (sort === 'price-desc') list = list.slice().sort(function (a, b) { return b.price - a.price; });
    else if (sort === 'new') list = list.filter(function (p) { return p.badge === 'New'; }).concat(list.filter(function (p) { return p.badge !== 'New'; }));
    else if (sort === 'best') list = list.filter(function (p) { return p.badge === 'Best Seller'; }).concat(list.filter(function (p) { return p.badge !== 'Best Seller'; }));
    mount.innerHTML = list.map(function (p, i) { return productCard(p, (i % 3) + 1); }).join('') || '<p style="color:var(--muted);padding:3rem 0">' + t('empty_cat') + '</p>';
    var n = list.length;
    var plural = getLang() === 'ar' ? '' : (n !== 1 ? 's' : '');
    document.getElementById('resultsCount').textContent = n + ' ' + t('result_word') + plural;
    initReveal();
    var url = new URL(location); url.searchParams.set('cat', filter); url.searchParams.set('sort', sort); history.replaceState(null, '', url);
  }

  filterBar.addEventListener('click', function (e) {
    var btn = e.target.closest('.filter-chip'); if (!btn) return;
    filter = btn.dataset.filter;
    filterBar.querySelectorAll('.filter-chip').forEach(function (b) { b.classList.toggle('active', b === btn); });
    apply();
  });
  sortSel.addEventListener('change', function () { sort = sortSel.value; apply(); });
  apply();
}

/* ---------------- Product detail page ---------------- */
function renderProductPage() {
  var mount = document.getElementById('pdp');
  if (!mount) return;
  var id = mount.getAttribute('data-product-id') || new URLSearchParams(location.search).get('id');
  var p = PRODUCTS.find(function (x) { return x.id === id; }) || PRODUCTS[0];
  if (!p) return;
  var gallery = (p.images && p.images.length) ? p.images : [p.image];
  var desc = pField(p, 'description');
  document.title = p.name + ' - ' + BRAND;

  var stars = '★★★★★';
  var onSale = isOnSale(p);
  var soldOut = isSoldOut(p);
  var old = onSale ? '<s>' + formatPrice(p.oldPrice) + '</s>' : '';
  var save = onSale ? '<em>' + t('pdp_save', { amount: formatPrice(p.oldPrice - p.price) }) + '</em>' : '';
  var salePct = onSale ? '<span class="sale-badge pdp__sale">-' + discountPct(p) + '%</span>' : '';
  var badge = p.badge ? '<span class="product-badge ' + badgeClass(p.badge) + '" style="position:static">' + p.badge + '</span>' : '';
  var dropIc = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.4"><path d="M12 3c3 3.6 6 6.7 6 10a6 6 0 0 1-12 0c0-3.3 3-6.4 6-10Z"/></svg>';
  var checks = [t('pdp_check_steel'), t('pdp_check_casa'), t('pdp_check_250'), t('pdp_check_fast')];

  mount.innerHTML =
    '<div class="wrap">' +
      '<div class="breadcrumb" data-reveal>' +
        '<a href="' + HOME_URL + '">' + t('pdp_home') + '</a><span>/</span>' +
        '<a href="' + SHOP_URL + '?cat=' + p.category + '">' + catLabel(p.category) + '</a><span>/</span>' +
        '<span>' + p.name + '</span>' +
      '</div>' +
      '<div class="pdp__grid">' +
        '<div class="pdp__gallery" data-reveal>' +
          '<div class="gallery__main" id="galMain"><img src="' + gallery[0] + '" alt="' + p.name + ' - ' + p.material + '" onerror="this.outerHTML=phSVG(\'' + p.category + '\')"></div>' +
          (gallery.length > 1 ? '<div class="gallery__thumbs">' +
            gallery.map(function (src, i) { return '<div class="gallery__thumb ' + (i === 0 ? 'active' : '') + '" data-src="' + src + '"><img src="' + src + '" alt="' + p.name + ' - ' + (i + 1) + '" loading="lazy"></div>'; }).join('') +
          '</div>' : '') +
        '</div>' +
        '<div class="pdp__info" data-reveal data-delay="1">' +
          (badge ? '<div class="pdp__badges">' + badge + '</div>' : '') +
          '<div class="pdp__cat">' + catLabel(p.category) + '</div>' +
          '<h1 class="pdp__title">' + p.name + '</h1>' +
          '<div class="pdp__rating"><span class="stars">' + stars + '</span> ' + (p.rating || '') + ' · <span class="pdp__reviews">' + t('pdp_reviews') + '</span></div>' +
          '<div class="pdp__price">' + old + '<span class="now ' + (onSale ? 'sale' : '') + '">' + formatPrice(p.price) + '</span>' + save + salePct + '</div>' +
          ((p.variants && p.variants.length) ?
          '<div class="pdp__variants"><div class="pdp__variants-label">' + t('pdp_color') + ' : <span id="variantName">' + p.variants[0].name + '</span></div>' +
            '<div class="pdp__swatches" id="swatches">' +
              p.variants.map(function (v, i) { return '<button type="button" class="swatch ' + (i === 0 ? 'active' : '') + '" data-variant="' + v.name + '" aria-label="' + v.name + '" title="' + v.name + '" style="background:' + colorHex(v.color || v.name) + '"></button>'; }).join('') +
            '</div></div>' : '') +
          '<ul class="pdp__checks">' + checks.map(function (c) { return '<li>' + ICONS.check + '<span>' + c + '</span></li>'; }).join('') + '</ul>' +
          '<p class="pdp__desc">' + desc + '</p>' +
          '<div class="pdp__buy"><div class="pdp__buy-row">' +
              '<div class="qty" aria-label="' + t('pdp_qty') + '">' +
                '<button id="qtyMinus" aria-label="' + t('pdp_dec') + '">−</button>' +
                '<span id="qtyVal">1</span>' +
                '<button id="qtyPlus" aria-label="' + t('pdp_inc') + '">+</button>' +
              '</div>' +
              '<button class="btn pdp__add" id="pdpAdd" ' + (soldOut ? 'disabled' : '') + '>' + (soldOut ? t('sold_out') : t('pdp_add')) + '</button>' +
            '</div>' +
            '<button class="btn btn--gold pdp__wa" id="pdpWa">' + ICONS.wa + ' ' + t('pdp_wa') + '</button>' +
          '</div>' +
          '<div class="pdp__trust">' +
            '<div><span class="pdp__trust-ic">' + ICONS.shield + '</span><b>' + t('trust_steel') + '</b><span>' + t('pdp_check_casa') + '</span></div>' +
            '<div><span class="pdp__trust-ic">' + ICONS.truck + '</span><b>' + t('cart_shipping') + '</b><span>' + t('cart_eta_val') + '</span></div>' +
            '<div><span class="pdp__trust-ic">' + ICONS.wa + '</span><b>' + t('trust_cod') + '</b><span>' + t('trust_free_250') + '</span></div>' +
          '</div>' +
          '<div class="pdp__care"><span class="pdp__care-ic">' + dropIc + '</span>' +
            '<div><b>' + t('pdp_care_title') + '</b><p>' + t('pdp_care_text') + '</p></div></div>' +
          '<div class="accordion" id="acc">' +
            accItem(t('acc_description'), '<p>' + desc + '</p>', true) +
            accItem(t('acc_material'), t('acc_material_body')) +
            accItem(t('acc_delivery'), t('acc_delivery_body')) +
          '</div>' +
        '</div>' +
      '</div>' +
    '</div>' +
    '<section class="pdp-related"><div class="wrap">' +
      '<div class="section-head center" data-reveal><span class="eyebrow center">' + t('pdp_related_eyebrow') + '</span>' +
        '<h2 class="section-title" style="font-size:clamp(1.7rem,3vw,2.4rem)">' + t('pdp_related_title') + '</h2></div>' +
      '<div class="product-grid" id="related"></div>' +
    '</div></section>' +
    '<div class="pdp-sticky" id="pdpSticky" aria-hidden="true">' +
      '<div class="pdp-sticky__price">' + formatPrice(p.price) + '</div>' +
      '<button class="btn btn--gold" id="pdpWaSticky">' + ICONS.wa + ' ' + t('pdp_wa') + '</button>' +
    '</div>';

  var main = document.getElementById('galMain');
  var galIndex = 0;
  function showImage(i) {
    galIndex = (i + gallery.length) % gallery.length;
    main.innerHTML = '<img src="' + gallery[galIndex] + '" alt="' + p.name + '">';
    mount.querySelectorAll('.gallery__thumb').forEach(function (x, j) { x.classList.toggle('active', j === galIndex); });
  }
  mount.querySelectorAll('.gallery__thumb').forEach(function (th, i) { th.addEventListener('click', function () { showImage(i); }); });
  if (gallery.length > 1) {
    var sx = 0, sy = 0, tracking = false;
    main.addEventListener('touchstart', function (e) { var t0 = e.changedTouches[0]; sx = t0.clientX; sy = t0.clientY; tracking = true; }, { passive: true });
    main.addEventListener('touchend', function (e) {
      if (!tracking) return; tracking = false;
      var t1 = e.changedTouches[0], dx = t1.clientX - sx, dy = t1.clientY - sy;
      if (Math.abs(dx) > 40 && Math.abs(dx) > Math.abs(dy)) {
        var dir = isRTL() ? -1 : 1;
        showImage(galIndex + (dx < 0 ? dir : -dir));
      }
    }, { passive: true });
  }

  var selectedVariant = (p.variants && p.variants.length) ? p.variants[0].name : null;
  var vName = document.getElementById('variantName');
  mount.querySelectorAll('.swatch').forEach(function (sw) {
    sw.addEventListener('click', function () {
      mount.querySelectorAll('.swatch').forEach(function (x) { x.classList.remove('active'); });
      sw.classList.add('active');
      selectedVariant = sw.dataset.variant;
      if (vName) vName.textContent = selectedVariant;
    });
  });

  var q = 1;
  var qv = document.getElementById('qtyVal');
  document.getElementById('qtyMinus').onclick = function () { q = Math.max(1, q - 1); qv.textContent = q; };
  document.getElementById('qtyPlus').onclick = function () { q++; qv.textContent = q; };
  document.getElementById('pdpAdd').onclick = function () { addToCart(p.id, q, selectedVariant); openCart(); };
  var waOrder = function () {
    var colour = selectedVariant ? '%0A' + t('pdp_color') + ' : ' + selectedVariant : '';
    var msg = t('wa_hello') + '%0A' + t('wa_interested') + ' : ' + p.name + ' (' + formatPrice(p.price) + ')' + colour + '%0A' + t('pdp_qty') + ' : ' + q;
    track('InitiateCheckout', { content_ids: [p.id], content_name: p.name, value: p.price * q, currency: 'MAD' });
    window.open(SOCIALS.whatsapp + '?text=' + msg, '_blank');
  };
  document.getElementById('pdpWa').onclick = waOrder;
  document.getElementById('pdpWaSticky').onclick = waOrder;

  initAccordion();

  var related = PRODUCTS.filter(function (x) { return x.category === p.category && x.id !== p.id; })
    .concat(PRODUCTS.filter(function (x) { return x.category !== p.category && x.id !== p.id; })).slice(0, 3);
  document.getElementById('related').innerHTML = related.map(function (x, i) { return productCard(x, (i % 3) + 1); }).join('');

  var sticky = document.getElementById('pdpSticky');
  var buyBtn = document.getElementById('pdpWa');
  if (sticky && buyBtn && 'IntersectionObserver' in window) {
    new IntersectionObserver(function (arr) {
      var e = arr[0];
      sticky.classList.toggle('show', !e.isIntersecting && e.boundingClientRect.top < 0);
    }, { threshold: 0 }).observe(buyBtn);
  }

  track('ViewContent', { content_ids: [p.id], content_name: p.name, content_type: 'product', value: p.price, currency: 'MAD' });
  initReveal();
}

function accItem(title, inner, open) {
  return '<div class="acc-item ' + (open ? 'open' : '') + '">' +
    '<button class="acc-head"><span>' + title + '</span><i></i></button>' +
    '<div class="acc-body" ' + (open ? 'style="max-height:600px"' : '') + '><div class="acc-body__inner">' + inner + '</div></div>' +
  '</div>';
}
function initAccordion() {
  document.querySelectorAll('.acc-item').forEach(function (item) {
    var head = item.querySelector('.acc-head');
    var body = item.querySelector('.acc-body');
    head.addEventListener('click', function () {
      var open = item.classList.toggle('open');
      body.style.maxHeight = open ? body.scrollHeight + 'px' : '0';
    });
  });
}

/* ---------------- Newsletter ---------------- */
function initNewsletter() {
  var form = document.getElementById('newsletterForm');
  if (!form) return;
  form.addEventListener('submit', function (e) {
    e.preventDefault();
    var msg = form.querySelector('.form-msg');
    var email = form.querySelector('input').value.trim();
    if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) { msg.textContent = t('nl_invalid'); msg.style.color = '#d98a6a'; return; }
    msg.style.color = 'var(--gold-soft)';
    msg.textContent = t('nl_ok');
    form.querySelector('input').value = '';
  });
}

/* ---------------- Boot ---------------- */
document.addEventListener('DOMContentLoaded', function () {
  initPixels();
  applyStaticI18n();
  bindAnnounce();
  bindLangSwitch(document);
  bindHeader();
  renderTrustBar();
  renderBestSellers();
  renderCollectionsPage();
  renderProductPage();
  renderCartPage();
  initNewsletter();
  updateCartCount();
  initReveal();
});
