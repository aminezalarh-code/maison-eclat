/* ============================================================
   BELORYA - Product data (real catalogue)
   Prices in MAD (dirham). Names & descriptions in French (brand voice).
   Categories: necklaces · sets (parures) · earrings
   image = main photo · images[] = full gallery
   ============================================================ */

const CURRENCY = 'MAD';

/* helper to build the image list for a product folder */
function imgs(slug, n) {
  return Array.from({ length: n }, (_, i) => `assets/products/${slug}/${i + 1}.jpeg`);
}

var PRODUCTS = [
  {
    id: 'reflet-lunaire',
    name: 'Reflet Lunaire',
    category: 'sets',
    price: 169, oldPrice: null,
    material: 'Acier inoxydable',
    image: 'assets/products/reflet-lunaire/1.jpeg',
    images: imgs('reflet-lunaire', 3),
    badge: 'Best Seller', rating: 4.9,
    description: "Inspirée des reliefs naturels façonnés par le temps, cette parure joue avec la lumière grâce à ses courbes organiques et sa finition miroir. Son design sculptural révèle un éclat intense à chaque mouvement, pour une allure moderne, élégante et intemporelle.",
    short: 'Parure sculpturale à la finition miroir.'
  },
  {
    id: 'petales-damour',
    name: "Pétales d'Amour",
    category: 'sets',
    price: 189, oldPrice: null,
    material: 'Acier inoxydable',
    image: 'assets/products/petales-damour/1.jpeg',
    images: imgs('petales-damour', 7),
    badge: 'Best Seller', rating: 4.9,
    description: "Comme une fleur caressée par la lumière, Pétales d'Amour révèle toute la délicatesse de la féminité. Ses pétales aux nuances douces créent un jeu de lumière élégant et apportent une touche de poésie à chacune de vos tenues. Une création pensée pour traverser le temps avec grâce.",
    short: 'Parure florale, délicate et poétique.'
  },
  {
    id: 'lheritiere',
    name: "L'Héritière",
    category: 'sets',
    price: 259, oldPrice: null,
    material: 'Acier inoxydable',
    image: 'assets/products/lheritiere/1.jpeg',
    images: imgs('lheritiere', 4),
    badge: 'Limited', rating: 4.8,
    description: "Plus qu'un bijou, L'Héritière est un symbole. Elle évoque les traditions précieuses, les souvenirs transmis et la beauté qui traverse les générations, sublimée par une touche contemporaine.",
    short: 'Une parure héritage, au raffinement contemporain.'
  },
  {
    id: 'etoile-dor',
    name: "Étoile d'Or",
    category: 'earrings',
    price: 89, oldPrice: null,
    material: 'Acier inoxydable',
    image: 'assets/products/etoile-dor/1.jpeg',
    images: imgs('etoile-dor', 2),
    badge: 'New', rating: 4.8,
    description: "Née de l'inspiration des profondeurs marines, cette création célèbre la beauté rare de l'océan. Son étoile de mer, délicatement sculptée, incarne la grâce, la sérénité et la lumière des horizons infinis.",
    short: "Boucles étoile de mer, éclat doré."
  },
  {
    id: 'cygne-daurore',
    name: "Cygne d'Aurore",
    category: 'necklaces',
    price: 129, oldPrice: null,
    material: 'Acier inoxydable',
    image: 'assets/products/cygne-daurore/1.jpeg',
    images: imgs('cygne-daurore', 3),
    badge: 'Best Seller', rating: 4.8,
    description: "Entre lumière et délicatesse, Cygne d'Aurore capture l'instant où les premiers rayons rencontrent l'eau calme. Un bijou raffiné qui sublime chaque tenue.",
    short: 'Collier cygne serti, raffiné et lumineux.'
  },
  {
    id: 'lien-damour',
    name: "Lien d'Amour",
    category: 'sets',
    price: 199, oldPrice: null,
    material: 'Acier inoxydable',
    image: 'assets/products/lien-damour/1.jpeg',
    images: imgs('lien-damour', 5),
    badge: 'New', rating: 4.8,
    description: "Un cœur aux lignes entrelacées, symbole d'un lien unique qui ne se défait jamais. Lien d'Amour est une création délicate, pour porter près de soi ce qui compte le plus.",
    short: 'Parure cœur entrelacé, symbole d’un lien unique.'
  },
  {
    id: 'laureole',
    name: "L'Auréole",
    category: 'sets',
    price: 169, oldPrice: null,
    material: 'Acier inoxydable',
    image: 'assets/products/laureole/1.jpeg',
    images: imgs('laureole', 4),
    badge: 'Best Seller', rating: 4.7,
    description: "L'Auréole célèbre la beauté des détails et l'éclat des instants précieux. Une création raffinée, où douceur et élégance ne font qu'un.",
    short: 'Parure cerclée de brillance, douce et élégante.'
  },
  {
    id: 'linsaisissable',
    name: "L'Insaisissable",
    category: 'sets',
    price: 169, oldPrice: null,
    material: 'Acier inoxydable',
    image: 'assets/products/linsaisissable/1.jpeg',
    images: imgs('linsaisissable', 4),
    badge: 'New', rating: 4.7,
    description: "L'Insaisissable incarne la grâce de ce qui ne peut être retenu. Inspirée par la légèreté d'un papillon, cette création lumineuse accompagne chacun de vos mouvements avec finesse et raffinement.",
    short: 'Parure papillon, légère et lumineuse.'
  },
  {
    id: 'lincontournable',
    name: "L'Incontournable",
    category: 'necklaces',
    price: 149, oldPrice: null,
    material: 'Acier inoxydable',
    image: 'assets/products/lincontournable/1.jpeg',
    images: imgs('lincontournable', 5),
    badge: null, rating: 4.7,
    description: "L'Incontournable est ce bijou que l'on choisit sans hésiter, jour après jour. Ses délicats motifs, disponibles en blanc nacré ou en rose tendre, captent la lumière avec douceur et apportent une touche de grâce à chaque instant.",
    short: 'Collier motifs nacrés, à porter chaque jour.'
  },
  {
    id: 'lenvolee',
    name: "L'Envolée",
    category: 'necklaces',
    price: 169, oldPrice: null,
    material: 'Acier inoxydable',
    image: 'assets/products/lenvolee/1.jpeg',
    images: imgs('lenvolee', 3),
    badge: null, rating: 4.7,
    description: "L'Envolée évoque la légèreté d'un papillon porté par le vent. Une création lumineuse pensée pour celles qui avancent avec confiance et liberté.",
    short: 'Collier ajouré, léger comme un envol.'
  },
  {
    id: 'a-coeur-ouvert',
    name: 'À Cœur Ouvert',
    category: 'necklaces',
    price: 169, oldPrice: null,
    material: 'Acier inoxydable',
    image: 'assets/products/a-coeur-ouvert/1.jpeg',
    images: imgs('a-coeur-ouvert', 3),
    badge: 'New', rating: 4.7,
    description: "Trois cœurs, une seule émotion. À Cœur Ouvert incarne la force des sentiments sincères et la beauté d'un amour assumé. Une création raffinée, à porter comme une déclaration de douceur.",
    short: 'Collier lariat trois cœurs, sincère et raffiné.'
  },
  {
    id: 'emeraude',
    name: 'Émeraude',
    category: 'sets',
    price: 179, oldPrice: null,
    material: 'Acier inoxydable',
    image: 'assets/products/emeraude/1.jpeg',
    images: imgs('emeraude', 2),
    badge: null, rating: 4.6,
    description: "Comme une promenade au cœur d'un jardin baigné de lumière, Émeraude célèbre la douceur de la nature. Chaque pierre semble capturer un fragment de verdure, transformant la simplicité en une élégance intemporelle.",
    short: 'Parure aux pierres vertes, inspirée de la nature.'
  },
  {
    id: 'rosalia',
    name: 'Rosalia',
    category: 'earrings',
    price: 89, oldPrice: null,
    material: 'Acier inoxydable',
    image: 'assets/products/rosalia/1.jpeg',
    images: imgs('rosalia', 1),
    badge: 'New', rating: 4.6,
    description: "Comme un papillon au premier printemps, ce bijou célèbre la douceur, la liberté et la beauté des nouveaux départs. Une touche délicate à porter chaque jour.",
    short: 'Boucles papillon rosé, douces et printanières.'
  },
  {
    id: 'premier-regard',
    name: 'Premier Regard',
    category: 'earrings',
    price: 89, oldPrice: null,
    material: 'Acier inoxydable',
    image: 'assets/products/premier-regard/1.jpeg',
    images: imgs('premier-regard', 1),
    badge: null, rating: 4.7,
    description: "Il suffit parfois d'un seul regard pour que tout bascule. Son cœur en spirale évoque le tourbillon des premières émotions, tandis que ses rayons dorés symbolisent la lumière d'une rencontre qui éclaire l'instant.",
    short: 'Boucles soleil spiralé, à l’éclat doré.'
  },
  {
    id: 'eclora',
    name: 'Éclora',
    category: 'earrings',
    price: 89, oldPrice: null,
    material: 'Acier inoxydable',
    image: 'assets/products/eclora/1.jpeg',
    images: imgs('eclora', 1),
    badge: null, rating: 4.6,
    description: "La rencontre entre la délicatesse de l'ivoire et la noblesse de l'or. Une création intemporelle qui apporte une touche de lumière naturelle à toutes les silhouettes.",
    short: 'Boucles pétales ivoire et or.'
  },
  {
    id: 'loceane',
    name: "L'Océane",
    category: 'earrings',
    price: 69, oldPrice: null,
    material: 'Acier inoxydable',
    image: 'assets/products/loceane/1.jpeg',
    images: imgs('loceane', 1),
    badge: null, rating: 4.6,
    description: "Comme un coquillage délicatement déposé sur le sable, L'Océane capture la beauté de la mer et l'éclat du soleil. Une création pensée pour celles qui emportent un souffle d'océan partout avec elles.",
    short: 'Boucles coquillage doré, souffle marin.'
  }
];

const CATEGORY_LABELS = {
  necklaces: 'Necklaces',
  sets: 'Sets',
  earrings: 'Earrings'
};

const COLLECTIONS = [
  { key: 'necklaces', name: 'Necklaces', desc: 'Pendentifs et colliers qui subliment le décolleté.' },
  { key: 'sets',      name: 'Sets',      desc: 'Parures assorties, pensées pour être portées ensemble.' },
  { key: 'earrings',  name: 'Earrings',  desc: 'Boucles d’oreilles qui captent la lumière.' }
];

/* SVG line-art fallback (used only if a photo fails to load) */
const PH_ART = {
  necklaces: '<path d="M40 40 Q100 130 160 40" fill="none" stroke="url(#g)" stroke-width="1.4"/><circle cx="100" cy="118" r="11" fill="none" stroke="url(#g)" stroke-width="1.4"/><circle cx="100" cy="118" r="3" fill="url(#g)"/>',
  sets: '<path d="M40 44 Q100 120 160 44" fill="none" stroke="url(#g)" stroke-width="1.4"/><circle cx="72" cy="150" r="10" fill="none" stroke="url(#g)" stroke-width="1.4"/><circle cx="128" cy="150" r="10" fill="none" stroke="url(#g)" stroke-width="1.4"/>',
  earrings: '<circle cx="72" cy="84" r="26" fill="none" stroke="url(#g)" stroke-width="1.4"/><circle cx="128" cy="116" r="26" fill="none" stroke="url(#g)" stroke-width="1.4"/><circle cx="72" cy="58" r="3" fill="url(#g)"/><circle cx="128" cy="90" r="3" fill="url(#g)"/>'
};

function phSVG(cat) {
  const art = PH_ART[cat] || PH_ART.necklaces;
  return `<div class="ph"><svg viewBox="0 0 200 200" aria-hidden="true">
    <defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="#9c7c33"/><stop offset="0.5" stop-color="#e3c98a"/><stop offset="1" stop-color="#c9a24b"/>
    </linearGradient></defs>${art}</svg></div>`;
}

function productMedia(p) {
  if (p.image) {
    return `<img src="${p.image}" alt="${p.name} - ${p.material}" loading="lazy"
      onerror="this.outerHTML=phSVG('${p.category}')">`;
  }
  return phSVG(p.category);
}

function formatPrice(v) { return `${v} ${CURRENCY}`; }

if (typeof module !== 'undefined') { module.exports = { PRODUCTS, COLLECTIONS }; }
