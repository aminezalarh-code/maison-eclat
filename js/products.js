/* ============================================================
   MAISON ÉCLAT — Product data
   Replace `image` paths with real photos in /assets when ready.
   Each product: id, name, category, price, oldPrice, material,
   image, images[], description, badge, rating
   ============================================================ */

const CURRENCY = 'MAD'; // change to € / $ / DH as needed

const PRODUCTS = [
  {
    id: 'luna-gold-bracelet',
    name: 'Luna Gold Bracelet',
    category: 'bracelets',
    price: 349,
    oldPrice: 420,
    material: 'Acier inoxydable',
    image: 'assets/products/luna.jpg',
    images: [],
    badge: 'Best Seller',
    rating: 4.9,
    description:
      "A fluid chain bracelet with a soft champagne-gold finish. The Luna catches light from every angle while staying weightless on the wrist — made to be worn from morning to evening.",
    short: 'Soft champagne-gold chain, weightless on the wrist.'
  },
  {
    id: 'eclat-necklace',
    name: 'Éclat Stainless Necklace',
    category: 'necklaces',
    price: 429,
    oldPrice: null,
    material: 'Acier inoxydable',
    image: 'assets/products/eclat.jpg',
    images: [],
    badge: 'Best Seller',
    rating: 4.8,
    description:
      "A sculptural pendant resting on a fine polished chain. The Éclat is built around a single luminous line — quiet, architectural, and unmistakably refined.",
    short: 'A sculptural pendant on a fine polished chain.'
  },
  {
    id: 'nova-ring',
    name: 'Nova Ring',
    category: 'rings',
    price: 199,
    oldPrice: 249,
    material: 'Acier inoxydable',
    image: 'assets/products/nova.jpg',
    images: [],
    badge: 'New',
    rating: 4.7,
    description:
      "A smooth, domed band with a brushed interior and mirror-polished edge. The Nova layers beautifully or stands alone as a modern signature.",
    short: 'A smooth domed band, brushed and mirror-polished.'
  },
  {
    id: 'serena-earrings',
    name: 'Serena Earrings',
    category: 'earrings',
    price: 229,
    oldPrice: null,
    material: 'Acier inoxydable',
    image: 'assets/products/serena.jpg',
    images: [],
    badge: 'New',
    rating: 4.9,
    description:
      "Drop earrings with a tapered silhouette that elongates and catches the light. Lightweight enough for all day, elegant enough for the evening.",
    short: 'Tapered drop earrings that catch the light.'
  },
  {
    id: 'royal-chain',
    name: 'Royal Chain',
    category: 'chains',
    price: 389,
    oldPrice: 459,
    material: 'Acier inoxydable',
    image: 'assets/products/royal.jpg',
    images: [],
    badge: 'Best Seller',
    rating: 4.8,
    description:
      "A bold Cuban-link chain with a substantial, confident drape. Hand-finished links and a secure clasp make the Royal a statement that lasts.",
    short: 'A bold Cuban-link chain with confident drape.'
  },
  {
    id: 'minimal-steel-anklet',
    name: 'Minimal Steel Anklet',
    category: 'anklets',
    price: 159,
    oldPrice: null,
    material: 'Acier inoxydable',
    image: 'assets/products/anklet.jpg',
    images: [],
    badge: 'New',
    rating: 4.6,
    description:
      "A delicate anklet with an adjustable fit and a whisper of gold. The Minimal is the finishing touch — understated, summer-ready, effortless.",
    short: 'A delicate, adjustable anklet with a whisper of gold.'
  },
  {
    id: 'celeste-pendant',
    name: 'Céleste Pendant',
    category: 'necklaces',
    price: 289,
    oldPrice: 340,
    material: 'Acier inoxydable',
    image: 'assets/products/celeste.jpg',
    images: [],
    badge: null,
    rating: 4.7,
    description:
      "A teardrop pendant suspended on a fine box chain. The Céleste reads as quiet jewellery — the kind you never take off.",
    short: 'A teardrop pendant on a fine box chain.'
  },
  {
    id: 'atlas-signet-ring',
    name: 'Atlas Signet Ring',
    category: 'rings',
    price: 219,
    oldPrice: null,
    material: 'Acier inoxydable',
    image: 'assets/products/atlas.jpg',
    images: [],
    badge: null,
    rating: 4.8,
    description:
      "A modern take on the classic signet — flat-faced, brushed, and built for daily wear. The Atlas is masculine restraint, perfected.",
    short: 'A modern brushed signet, built for daily wear.'
  },
  {
    id: 'aria-hoops',
    name: 'Aria Hoops',
    category: 'earrings',
    price: 189,
    oldPrice: null,
    material: 'Acier inoxydable',
    image: 'assets/products/aria.jpg',
    images: [],
    badge: 'Best Seller',
    rating: 4.9,
    description:
      "Perfectly weighted hoops with a seamless hinge and a warm gold tone. The Aria is the everyday hoop, refined to its essence.",
    short: 'Perfectly weighted everyday hoops.'
  },
  {
    id: 'lien-bracelet',
    name: 'Lien Link Bracelet',
    category: 'bracelets',
    price: 269,
    oldPrice: 310,
    material: 'Acier inoxydable',
    image: 'assets/products/lien.jpg',
    images: [],
    badge: null,
    rating: 4.7,
    description:
      "Interlocking flat links with a satin finish and a hidden clasp. The Lien sits flush against the wrist with quiet confidence.",
    short: 'Interlocking satin links with a hidden clasp.'
  },
  {
    id: 'sienna-chain',
    name: 'Sienna Rope Chain',
    category: 'chains',
    price: 299,
    oldPrice: null,
    material: 'Acier inoxydable',
    image: 'assets/products/sienna.jpg',
    images: [],
    badge: 'New',
    rating: 4.6,
    description:
      "A twisted rope chain that shimmers as it moves. The Sienna brings texture and warmth — a versatile layer or a standout solo piece.",
    short: 'A twisted rope chain that shimmers as it moves.'
  },
  {
    id: 'jade-anklet',
    name: 'Jade Chain Anklet',
    category: 'anklets',
    price: 149,
    oldPrice: null,
    material: 'Acier inoxydable',
    image: 'assets/products/jade.jpg',
    images: [],
    badge: null,
    rating: 4.5,
    description:
      "A fine curb-chain anklet with an extender for the perfect fit. The Jade is the easy, elegant detail that finishes every look.",
    short: 'A fine curb-chain anklet with an extender.'
  }
];

const COLLECTIONS = [
  { key: 'necklaces', name: 'Necklaces', desc: 'Pendants and chains that frame the neckline with quiet light.' },
  { key: 'bracelets', name: 'Bracelets', desc: 'Weightless chains and links made for everyday wear.' },
  { key: 'rings',     name: 'Rings',     desc: 'Bands and signets, from minimal to bold.' },
  { key: 'earrings',  name: 'Earrings',  desc: 'Hoops and drops that catch every angle of light.' }
];

const CATEGORY_LABELS = {
  necklaces: 'Necklaces', bracelets: 'Bracelets', rings: 'Rings',
  earrings: 'Earrings', chains: 'Chains', anklets: 'Anklets'
};

/* SVG line-art placeholders per category — elegant, on-brand,
   used until real product photography is dropped into /assets.
   Real <img> is rendered when the file exists (onerror falls back). */
const PH_ART = {
  necklaces: '<path d="M40 40 Q100 130 160 40" fill="none" stroke="url(#g)" stroke-width="1.4"/><circle cx="100" cy="118" r="11" fill="none" stroke="url(#g)" stroke-width="1.4"/><circle cx="100" cy="118" r="3" fill="url(#g)"/>',
  bracelets: '<ellipse cx="100" cy="100" rx="62" ry="40" fill="none" stroke="url(#g)" stroke-width="1.4"/><ellipse cx="100" cy="100" rx="50" ry="31" fill="none" stroke="url(#g)" stroke-width="0.8" opacity="0.5"/><circle cx="100" cy="60" r="4" fill="url(#g)"/>',
  rings: '<circle cx="100" cy="108" r="42" fill="none" stroke="url(#g)" stroke-width="1.4"/><path d="M78 74 L100 44 L122 74" fill="none" stroke="url(#g)" stroke-width="1.4"/><circle cx="100" cy="52" r="6" fill="none" stroke="url(#g)" stroke-width="1.2"/>',
  earrings: '<circle cx="72" cy="84" r="26" fill="none" stroke="url(#g)" stroke-width="1.4"/><circle cx="128" cy="116" r="26" fill="none" stroke="url(#g)" stroke-width="1.4"/><circle cx="72" cy="58" r="3" fill="url(#g)"/><circle cx="128" cy="90" r="3" fill="url(#g)"/>',
  chains: '<g fill="none" stroke="url(#g)" stroke-width="1.4"><ellipse cx="70" cy="100" rx="14" ry="9"/><ellipse cx="100" cy="100" rx="14" ry="9"/><ellipse cx="130" cy="100" rx="14" ry="9"/><ellipse cx="55" cy="100" rx="9" ry="6" opacity="0.5"/><ellipse cx="145" cy="100" rx="9" ry="6" opacity="0.5"/></g>',
  anklets: '<path d="M44 86 Q100 150 156 86" fill="none" stroke="url(#g)" stroke-width="1.4"/><circle cx="64" cy="100" r="3" fill="url(#g)"/><circle cx="100" cy="120" r="3" fill="url(#g)"/><circle cx="136" cy="100" r="3" fill="url(#g)"/>'
};

function phSVG(cat) {
  const art = PH_ART[cat] || PH_ART.rings;
  return `<div class="ph"><svg viewBox="0 0 200 200" aria-hidden="true">
    <defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="#9c7c33"/><stop offset="0.5" stop-color="#e3c98a"/><stop offset="1" stop-color="#c9a24b"/>
    </linearGradient></defs>${art}</svg></div>`;
}

/* Returns markup for a product image, real photo if present else placeholder */
function productMedia(p) {
  if (p.image) {
    return `<img src="${p.image}" alt="${p.name} — ${p.material}" loading="lazy"
      onerror="this.outerHTML=phSVG('${p.category}')">`;
  }
  return phSVG(p.category);
}

function formatPrice(v) {
  return `${v} ${CURRENCY}`;
}

if (typeof module !== 'undefined') { module.exports = { PRODUCTS, COLLECTIONS }; }
