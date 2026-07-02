/* ============================================================
   MAISON ÉCLAT - App logic
   Header/footer injection · mobile menu · cart drawer (localStorage)
   · scroll reveal · product rendering · collection filters · PDP
   ============================================================ */

const WHATSAPP_NUMBER = '212600000000'; // ← replace with the brand's real number (international, no +)
const BRAND = 'Belorya';
const TAGLINE = 'Eternal Shine';
const LOGO_SRC = 'assets/logo.png'; // drop the real logo here; falls back to text wordmark

/* Brand lockup - uses the logo image if present, else an elegant text fallback */
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
  tiktok: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M16 3c.3 2.3 1.6 3.7 3.8 3.9v2.6c-1.3.1-2.5-.3-3.8-1v5.8c0 3.6-2.8 6-6 5.6-2.6-.3-4.4-2.4-4.3-5 .1-2.7 2.5-4.7 5.2-4.4v2.7c-.4-.1-.8-.2-1.2-.1-1.1.1-1.9 1-1.8 2.1.1 1 1 1.9 2.1 1.8 1.2-.1 1.9-1 1.9-2.3V3H16Z"/></svg>',
  arrow: '<svg viewBox="0 0 18 10" fill="none" stroke="currentColor" stroke-width="1.4"><path d="M1 5h15M12 1l4 4-4 4"/></svg>',
  check: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><path d="M5 13l4 4L19 7"/></svg>',
  shield: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.4"><path d="M12 3l7 3v5c0 4.5-3 8-7 10-4-2-7-5.5-7-10V6l7-3Z"/><path d="M9 12l2 2 4-4"/></svg>',
  truck: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.4"><path d="M3 7h11v8H3zM14 10h4l3 3v2h-7"/><circle cx="7" cy="18" r="1.6"/><circle cx="17.5" cy="18" r="1.6"/></svg>',
  refresh: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.4"><path d="M4 12a8 8 0 0 1 13.7-5.6L20 8M20 4v4h-4"/><path d="M20 12a8 8 0 0 1-13.7 5.6L4 16M4 20v-4h4"/></svg>'
};

const NAV_LINKS = [
  { href: 'index.html', label: 'Home' },
  { href: 'collections.html', label: 'Collections' },
  { href: 'collections.html?sort=best', label: 'Best Sellers' },
  { href: 'index.html#about', label: 'About' },
  { href: 'index.html#contact', label: 'Contact' }
];

/* ---------------- Header ---------------- */
function renderHeader() {
  const mount = document.getElementById('site-header');
  if (!mount) return;
  const page = document.body.dataset.page || '';
  const links = NAV_LINKS.map(l => {
    const active = (page === 'collections' && /collections/.test(l.href)) ? 'active' : '';
    return `<li><a class="nav__link ${active}" href="${l.href}">${l.label}</a></li>`;
  }).join('');

  mount.innerHTML = `
    <header class="site-header" id="header">
      <div class="wrap nav">
        <a class="brand" href="index.html" aria-label="${BRAND} home">
          ${brandLockup()}
        </a>
        <ul class="nav__menu">${links}</ul>
        <div class="nav__right">
          <a class="nav__cta" href="https://wa.me/${WHATSAPP_NUMBER}" target="_blank" rel="noopener">${ICONS.wa}<span>WhatsApp</span></a>
          <button class="icon-btn" id="cartOpen" aria-label="Open cart">
            ${ICONS.cart}<span class="cart-count" id="cartCount">0</span>
          </button>
          <button class="nav__toggle" aria-label="Open menu" id="navToggle"><span></span></button>
        </div>
      </div>
    </header>
    <nav class="mobile-menu" id="mobileMenu" aria-hidden="true">
      <ul>${NAV_LINKS.map((l,i)=>`<li><a href="${l.href}" style="animation-delay:${0.06*i}s">${l.label}</a></li>`).join('')}</ul>
      <!-- mobile brand mark -->
      <div style="position:absolute;top:1.6rem;left:var(--gut)"><a class="brand" href="index.html">${brandLockup('mobile-mark')}</a></div>
      <div class="mobile-menu__foot">
        <a class="footer__wa" href="https://wa.me/${WHATSAPP_NUMBER}" target="_blank" rel="noopener">${ICONS.wa} Order on WhatsApp</a>
      </div>
    </nav>`;

  // scroll state
  const header = document.getElementById('header');
  const solid = page !== 'home';
  if (solid) header.classList.add('solid');
  const onScroll = () => header.classList.toggle('scrolled', window.scrollY > 20);
  onScroll();
  window.addEventListener('scroll', onScroll, { passive: true });

  // mobile menu
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
  updateCartCount();
}

/* ---------------- Footer ---------------- */
function renderFooter() {
  const mount = document.getElementById('site-footer');
  if (!mount) return;
  const year = 2026;
  mount.innerHTML = `
    <footer class="site-footer" id="contact">
      <div class="wrap">
        <div class="footer__top">
          <div class="footer__brand">
            <a class="brand" href="index.html">${brandLockup('footer-mark')}</a>
            <p>Refined stainless-steel jewellery, designed in the studio and made to be worn every day. Accessible luxury, built to last.</p>
            <div class="footer__socials">
              <a href="https://instagram.com" target="_blank" rel="noopener" aria-label="Instagram">${ICONS.ig}</a>
              <a href="https://tiktok.com" target="_blank" rel="noopener" aria-label="TikTok">${ICONS.tiktok}</a>
              <a href="https://wa.me/${WHATSAPP_NUMBER}" target="_blank" rel="noopener" aria-label="WhatsApp">${ICONS.wa}</a>
            </div>
          </div>
          <div class="footer__col">
            <h5>Collections</h5>
            <ul>
              <li><a href="collections.html?cat=necklaces">Necklaces</a></li>
              <li><a href="collections.html?cat=sets">Sets</a></li>
              <li><a href="collections.html?cat=earrings">Earrings</a></li>
              <li><a href="collections.html?sort=best">Best Sellers</a></li>
              <li><a href="collections.html?sort=new">New Arrivals</a></li>
            </ul>
          </div>
          <div class="footer__col">
            <h5>Maison</h5>
            <ul>
              <li><a href="index.html#about">Our Story</a></li>
              <li><a href="index.html#material">Materials</a></li>
              <li><a href="collections.html?sort=best">Best Sellers</a></li>
              <li><a href="collections.html?sort=new">New Arrivals</a></li>
              <li><a href="index.html#newsletter">Private List</a></li>
            </ul>
          </div>
          <div class="footer__col">
            <h5>Contact</h5>
            <ul>
              <li>Casablanca, Morocco</li>
              <li><a href="mailto:hello@belorya.com">hello@belorya.com</a></li>
              <li>Mon–Sat · 10:00–19:00</li>
            </ul>
            <a class="footer__wa" href="https://wa.me/${WHATSAPP_NUMBER}" target="_blank" rel="noopener">${ICONS.wa} Order on WhatsApp</a>
          </div>
        </div>
        <div class="footer__bottom">
          <p>© ${year} ${BRAND}. All rights reserved.</p>
          <div class="footer__pay">
            <span>Visa</span><span>Mastercard</span><span>COD</span><span>WhatsApp</span>
          </div>
          <p><a href="#">Privacy</a> · <a href="#">Terms</a></p>
        </div>
      </div>
    </footer>`;
}

/* ---------------- Cart drawer ---------------- */
const CART_KEY = 'eclat_cart';
function getCart() { try { return JSON.parse(localStorage.getItem(CART_KEY)) || []; } catch { return []; } }
function saveCart(c) { localStorage.setItem(CART_KEY, JSON.stringify(c)); updateCartCount(); }

function addToCart(id, qty = 1) {
  const p = PRODUCTS.find(x => x.id === id);
  if (!p) return;
  const cart = getCart();
  const found = cart.find(i => i.id === id);
  if (found) found.qty += qty; else cart.push({ id, qty });
  saveCart(cart);
  renderCart();
  toast(`${p.name} added to your bag`);
}
function setQty(id, qty) {
  let cart = getCart();
  if (qty <= 0) cart = cart.filter(i => i.id !== id);
  else { const it = cart.find(i => i.id === id); if (it) it.qty = qty; }
  saveCart(cart); renderCart();
}
function cartTotal() {
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

function ensureCartDOM() {
  if (document.getElementById('cartDrawer')) return;
  const div = document.createElement('div');
  div.innerHTML = `
    <div class="cart-overlay" id="cartOverlay"></div>
    <aside class="cart-drawer" id="cartDrawer" aria-label="Shopping bag" aria-hidden="true">
      <div class="cart-drawer__head">
        <h3>Your Bag <span id="cartHeadCount"></span></h3>
        <button class="cart-close" id="cartClose" aria-label="Close">✕</button>
      </div>
      <div class="cart-body" id="cartBody"></div>
      <div class="cart-foot" id="cartFoot" hidden>
        <div class="cart-foot__row"><span>Subtotal</span><span id="cartSubtotal"></span></div>
        <div class="cart-foot__row"><span>Shipping</span><span>Calculated at checkout</span></div>
        <div class="cart-foot__row total"><span>Total</span><span id="cartTotal"></span></div>
        <a class="btn btn--gold btn--block" id="cartCheckout">Checkout</a>
        <button class="btn btn--block btn--ghost" id="cartWa" style="margin-top:.7rem">${ICONS.wa} Order on WhatsApp</button>
      </div>
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
    body.innerHTML = `<div class="cart-empty">${ICONS.cart}<p>Your bag is empty</p>
      <a class="btn btn--ghost btn--sm" href="collections.html" style="margin-top:1.4rem">Explore the collection</a></div>`;
    foot.hidden = true; return;
  }
  body.innerHTML = cart.map(i => {
    const p = PRODUCTS.find(x => x.id === i.id); if (!p) return '';
    return `<div class="cart-item">
      <a class="cart-item__media" href="product.html?id=${p.id}">${productMedia(p)}</a>
      <div>
        <a href="product.html?id=${p.id}" class="cart-item__name">${p.name}</a>
        <div class="cart-item__mat">${p.material}</div>
        <div class="qty">
          <button onclick="setQty('${p.id}',${i.qty-1})" aria-label="Decrease">−</button>
          <span>${i.qty}</span>
          <button onclick="setQty('${p.id}',${i.qty+1})" aria-label="Increase">+</button>
        </div>
      </div>
      <div class="cart-item__right">
        <div class="cart-item__price">${formatPrice(p.price * i.qty)}</div>
        <button class="cart-item__remove" onclick="setQty('${p.id}',0)">Remove</button>
      </div>
    </div>`;
  }).join('');
  foot.hidden = false;
  document.getElementById('cartSubtotal').textContent = formatPrice(cartTotal());
  document.getElementById('cartTotal').textContent = formatPrice(cartTotal());
  document.getElementById('cartWa').onclick = waOrderCart;
  document.getElementById('cartCheckout').onclick = (e) => { e.preventDefault(); toast('Checkout is a demo, connect your payment provider.'); };
}

function waOrderCart() {
  const cart = getCart();
  if (!cart.length) return;
  let msg = `Bonjour ${BRAND} 👋%0AJe souhaite commander :%0A`;
  cart.forEach(i => { const p = PRODUCTS.find(x => x.id === i.id); if (p) msg += `• ${p.name} × ${i.qty} - ${formatPrice(p.price*i.qty)}%0A`; });
  msg += `%0ATotal : ${formatPrice(cartTotal())}`;
  window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${msg}`, '_blank');
}

/* ---------------- Toast ---------------- */
let toastTimer;
function toast(text) {
  let t = document.getElementById('toast');
  if (!t) { t = document.createElement('div'); t.className = 'toast'; t.id = 'toast'; document.body.appendChild(t); }
  t.innerHTML = `${ICONS.check}<span>${text}</span>`;
  requestAnimationFrame(() => t.classList.add('show'));
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => t.classList.remove('show'), 2600);
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

/* ---------------- Product card markup ---------------- */
function badgeClass(b) { return b === 'New' ? 'new' : b === 'Limited' ? 'limited' : ''; }

function productCard(p, delay = 0) {
  const badge = p.badge ? `<span class="product-badge ${badgeClass(p.badge)}">${p.badge}</span>` : '';
  const old = p.oldPrice ? `<s>${formatPrice(p.oldPrice)}</s>` : '';
  const priceBlock = `<div class="product-card__price">${old}<span class="now">${formatPrice(p.price)}</span></div>`;
  return `<article class="product-card" data-reveal data-delay="${delay}">
    <div class="product-card__media">
      <a href="product.html?id=${p.id}" aria-label="${p.name}">${productMedia(p)}</a>
      ${badge}
      <div class="product-quick">
        <button class="btn btn--gold btn--block btn--sm" onclick="addToCart('${p.id}')">Add to Bag - ${formatPrice(p.price)}</button>
      </div>
    </div>
    <div class="product-card__body">
      <div class="product-card__cat">${CATEGORY_LABELS[p.category] || p.category}</div>
      <h3 class="product-card__name"><a href="product.html?id=${p.id}">${p.name}</a></h3>
      <div class="product-card__mat">${p.material}</div>
      <div class="product-card__foot">
        ${priceBlock}
        <div class="product-card__actions">
          <a class="link-arrow" href="product.html?id=${p.id}">View Details ${ICONS.arrow}</a>
          <button class="card-wa" aria-label="Order ${p.name} on WhatsApp" title="Order on WhatsApp" onclick="waProduct('${p.id}')">${ICONS.wa}</button>
        </div>
      </div>
    </div>
  </article>`;
}

function waProduct(id) {
  const p = PRODUCTS.find(x => x.id === id); if (!p) return;
  const msg = `Bonjour ${BRAND} 👋%0AJe suis intéressé(e) par : ${p.name} (${formatPrice(p.price)})`;
  window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${msg}`, '_blank');
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
  let cat = params.get('cat') || 'all';
  let sort = params.get('sort') || 'featured';

  const filterBar = document.getElementById('filters');
  const sortSel = document.getElementById('sortSelect');
  const cats = ['all', ...Object.keys(CATEGORY_LABELS)];
  filterBar.innerHTML = cats.map(c =>
    `<button class="filter-chip ${c === cat ? 'active' : ''}" data-cat="${c}">${c === 'all' ? 'All Pieces' : CATEGORY_LABELS[c]}</button>`
  ).join('');
  sortSel.value = sort;

  function apply() {
    let list = PRODUCTS.filter(p => cat === 'all' || p.category === cat);
    if (sort === 'price-asc') list.sort((a,b)=>a.price-b.price);
    else if (sort === 'price-desc') list.sort((a,b)=>b.price-a.price);
    else if (sort === 'new') list = list.filter(p=>p.badge==='New').concat(list.filter(p=>p.badge!=='New'));
    else if (sort === 'best') list = list.filter(p=>p.badge==='Best Seller').concat(list.filter(p=>p.badge!=='Best Seller'));
    mount.innerHTML = list.map((p,i)=>productCard(p,(i%3)+1)).join('') || '<p style="color:var(--muted);padding:3rem 0">No pieces in this category yet.</p>';
    document.getElementById('resultsCount').textContent = `${list.length} piece${list.length!==1?'s':''}`;
    initReveal();
    const url = new URL(location); url.searchParams.set('cat',cat); url.searchParams.set('sort',sort); history.replaceState(null,'',url);
  }

  filterBar.addEventListener('click', e => {
    const btn = e.target.closest('.filter-chip'); if (!btn) return;
    cat = btn.dataset.cat;
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
  document.title = `${p.name} - ${BRAND}`;

  const stars = '★★★★★';
  const old = p.oldPrice ? `<s>${formatPrice(p.oldPrice)}</s>` : '';
  const save = p.oldPrice ? `<em>Économisez ${formatPrice(p.oldPrice - p.price)}</em>` : '';
  const badge = p.badge ? `<span class="product-badge ${badgeClass(p.badge)}" style="position:static">${p.badge}</span>` : '';
  const dropIc = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.4"><path d="M12 3c3 3.6 6 6.7 6 10a6 6 0 0 1-12 0c0-3.3 3-6.4 6-10Z"/></svg>';

  mount.innerHTML = `
    <div class="wrap">
      <div class="breadcrumb" data-reveal>
        <a href="index.html">Accueil</a><span>/</span>
        <a href="collections.html?cat=${p.category}">${CATEGORY_LABELS[p.category]}</a><span>/</span>
        <span>${p.name}</span>
      </div>
      <div class="pdp__grid">
        <div class="pdp__gallery" data-reveal>
          <div class="gallery__main" id="galMain"><img src="${gallery[0]}" alt="${p.name} - ${p.material}" onerror="this.outerHTML=phSVG('${p.category}')"></div>
          ${gallery.length > 1 ? `<div class="gallery__thumbs">
            ${gallery.map((src,i)=>
              `<div class="gallery__thumb ${i===0?'active':''}" data-src="${src}"><img src="${src}" alt="${p.name} - vue ${i+1}" loading="lazy"></div>`
            ).join('')}
          </div>` : ''}
        </div>
        <div class="pdp__info" data-reveal data-delay="1">
          ${badge ? `<div class="pdp__badges">${badge}</div>` : ''}
          <div class="pdp__cat">${CATEGORY_LABELS[p.category]}</div>
          <h1 class="pdp__title">${p.name}</h1>
          <div class="pdp__rating"><span class="stars">${stars}</span> ${p.rating} · <span class="pdp__reviews">Lire les avis</span></div>
          <div class="pdp__price">${old}<span class="now">${formatPrice(p.price)}</span>${save}</div>
          <div class="pdp__mat">${ICONS.shield} ${p.material}</div>
          <p class="pdp__desc">${p.description}</p>

          <div class="pdp__buy">
            <div class="pdp__buy-row">
              <div class="qty" aria-label="Quantité">
                <button id="qtyMinus" aria-label="Diminuer">−</button>
                <span id="qtyVal">1</span>
                <button id="qtyPlus" aria-label="Augmenter">+</button>
              </div>
              <button class="btn pdp__add" id="pdpAdd">Ajouter au panier</button>
            </div>
            <button class="btn btn--gold pdp__wa" id="pdpWa">${ICONS.wa} Commander sur WhatsApp</button>
          </div>

          <div class="pdp__trust">
            <div><span class="pdp__trust-ic">${ICONS.shield}</span><b>Acier inoxydable</b><span>Finition durable et élégante</span></div>
            <div><span class="pdp__trust-ic">${ICONS.truck}</span><b>Livraison rapide</b><span>2–4 jours ouvrables</span></div>
            <div><span class="pdp__trust-ic">${ICONS.refresh}</span><b>Retours faciles</b><span>Sous 14 jours</span></div>
          </div>

          <div class="pdp__care">
            <span class="pdp__care-ic">${dropIc}</span>
            <div>
              <b>Conseil d'entretien</b>
              <p>Pour préserver l'éclat de votre bijou, évitez le contact direct avec les parfums, les produits chimiques et l'humidité prolongée.</p>
            </div>
          </div>

          <div class="accordion" id="acc">
            ${accItem('Description', `<p>${p.description}</p>`, true)}
            ${accItem('Matière &amp; Entretien', `<ul>
              <li>Fabriqué en acier inoxydable, avec une finition dorée durable.</li>
              <li>Nettoyez délicatement avec un chiffon doux et sec pour raviver l'éclat.</li>
              <li>Conservez à l'abri de l'humidité, des parfums et des produits chimiques.</li>
              <li>Résistant à l'eau, anti-ternissement &amp; hypoallergénique, <em>si confirmé par la marque</em>.</li>
            </ul>`)}
            ${accItem('Livraison', `<ul>
              <li>Livraison standard en 2 à 4 jours ouvrables.</li>
              <li>Paiement à la livraison disponible dans certaines régions.</li>
              <li>Chaque pièce est expédiée dans un écrin Belorya.</li>
            </ul>`)}
            ${accItem('Retours', `<ul>
              <li>Retours sous 14 jours pour toute pièce non portée, dans son emballage d'origine.</li>
              <li>Contactez-nous sur WhatsApp pour organiser un retour ou un échange.</li>
            </ul>`)}
          </div>
        </div>
      </div>
    </div>

    <section class="pdp-related">
      <div class="wrap">
        <div class="section-head center" data-reveal><span class="eyebrow center">La sélection</span>
          <h2 class="section-title" style="font-size:clamp(1.7rem,3vw,2.4rem)">Vous aimerez <em>aussi</em></h2></div>
        <div class="product-grid" id="related"></div>
      </div>
    </section>

    <div class="pdp-sticky" id="pdpSticky" aria-hidden="true">
      <div class="pdp-sticky__price">${formatPrice(p.price)}</div>
      <button class="btn btn--gold" id="pdpWaSticky">${ICONS.wa} Commander sur WhatsApp</button>
    </div>`;

  // gallery thumbs
  const main = document.getElementById('galMain');
  mount.querySelectorAll('.gallery__thumb').forEach(t => t.addEventListener('click', () => {
    mount.querySelectorAll('.gallery__thumb').forEach(x=>x.classList.remove('active'));
    t.classList.add('active');
    main.innerHTML = `<img src="${t.dataset.src}" alt="${p.name}">`;
  }));

  // qty
  let q = 1;
  const qv = document.getElementById('qtyVal');
  document.getElementById('qtyMinus').onclick = () => { q = Math.max(1, q-1); qv.textContent = q; };
  document.getElementById('qtyPlus').onclick = () => { q++; qv.textContent = q; };
  document.getElementById('pdpAdd').onclick = () => { addToCart(p.id, q); openCart(); };
  const waOrder = () => {
    const msg = `Bonjour ${BRAND} 👋%0AJe suis intéressé(e) par : ${p.name} (${formatPrice(p.price)})%0AQuantité : ${q}`;
    window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${msg}`, '_blank');
  };
  document.getElementById('pdpWa').onclick = waOrder;
  document.getElementById('pdpWaSticky').onclick = waOrder;

  // accordion
  initAccordion();

  // related
  const related = PRODUCTS.filter(x => x.category === p.category && x.id !== p.id)
    .concat(PRODUCTS.filter(x => x.category !== p.category && x.id !== p.id)).slice(0, 3);
  document.getElementById('related').innerHTML = related.map((x,i)=>productCard(x,(i%3)+1)).join('');

  // reveal mobile sticky CTA once user scrolls past the main buy button
  const sticky = document.getElementById('pdpSticky');
  const buyBtn = document.getElementById('pdpWa');
  if (sticky && buyBtn && 'IntersectionObserver' in window) {
    new IntersectionObserver(([e]) => {
      sticky.classList.toggle('show', !e.isIntersecting && e.boundingClientRect.top < 0);
    }, { threshold: 0 }).observe(buyBtn);
  }

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
    if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) { msg.textContent = 'Please enter a valid email address.'; msg.style.color = '#d98a6a'; return; }
    msg.style.color = 'var(--gold-soft)';
    msg.textContent = 'Welcome to the private list, check your inbox.';
    form.querySelector('input').value = '';
  });
}

/* ---------------- Boot ---------------- */
document.addEventListener('DOMContentLoaded', () => {
  renderHeader();
  renderFooter();
  renderBestSellers();
  renderCollectionsPage();
  renderProductPage();
  initNewsletter();
  initReveal();
  // year stamps
  document.querySelectorAll('[data-year]').forEach(e => e.textContent = '2026');
});
