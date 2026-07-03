/* ============================================================
   BELORYA - Internationalization (FR default / EN)
   Lightweight dictionary + t() helper. No dependencies.
   Loads before app.js so every render can read the active lang.
   ============================================================ */

const LANG_KEY = 'belorya_lang';
function getLang() {
  const l = localStorage.getItem(LANG_KEY);
  return l === 'en' ? 'en' : 'fr';
}
function setLang(lang) {
  localStorage.setItem(LANG_KEY, lang === 'en' ? 'en' : 'fr');
  // full reload keeps every rendered surface perfectly in sync, no mixed languages
  location.reload();
}

/* English translations of product copy (names stay as-is) */
const PRODUCT_EN = {
  'reflet-lunaire': { description: "Inspired by the natural contours shaped by time, this set plays with light through its organic curves and mirror finish. Its sculptural design reveals an intense radiance with every movement, for a look that is modern, elegant and timeless.", short: "A sculptural set with a mirror finish." },
  'petales-damour': { description: "Like a flower kissed by the light, Pétales d'Amour reveals all the delicacy of femininity. Its petals in soft hues create an elegant play of light and bring a touch of poetry to every look. A creation designed to endure through time with grace.", short: "A floral set, delicate and poetic." },
  'lheritiere': { description: "More than a piece of jewellery, L'Héritière is a symbol. It evokes cherished traditions, memories passed down and beauty that endures across generations, elevated by a contemporary touch.", short: "An heirloom set, refined with a contemporary spirit." },
  'etoile-dor': { description: "Born of inspiration drawn from the ocean depths, this creation celebrates the rare beauty of the sea. Its delicately sculpted starfish embodies grace, serenity and the light of endless horizons.", short: "Starfish earrings with a golden glow." },
  'cygne-daurore': { description: "Between light and delicacy, Cygne d'Aurore captures the moment when the first rays of dawn meet still water. A refined piece that elevates every look.", short: "A jewelled swan necklace, refined and luminous." },
  'lien-damour': { description: "A heart of interlacing lines, symbol of a unique bond that never comes undone. Lien d'Amour is a delicate creation, made to hold close to you what matters most.", short: "An interlaced heart set, symbol of a unique bond." },
  'laureole': { description: "L'Auréole celebrates the beauty of fine details and the radiance of precious moments. A refined creation where softness and elegance become one.", short: "A set haloed in brilliance, soft and elegant." },
  'linsaisissable': { description: "L'Insaisissable embodies the grace of all that cannot be held. Inspired by the lightness of a butterfly, this luminous creation follows your every movement with finesse and refinement.", short: "A butterfly set, light and luminous." },
  'lincontournable': { description: "L'Incontournable is the piece you reach for without a second thought, day after day. Its delicate motifs, available in pearly white or soft pink, catch the light gently and bring a touch of grace to every moment.", short: "A necklace with pearly motifs, to wear every day." },
  'lenvolee': { description: "L'Envolée evokes the lightness of a butterfly carried on the breeze. A luminous creation designed for those who move forward with confidence and freedom.", short: "An openwork necklace, light as flight." },
  'a-coeur-ouvert': { description: "Three hearts, one single emotion. À Cœur Ouvert embodies the strength of sincere feeling and the beauty of a love worn openly. A refined creation, to wear as a quiet declaration.", short: "A three-heart lariat necklace, sincere and refined." },
  'emeraude': { description: "Like a stroll through a sunlit garden, Émeraude celebrates the gentleness of nature. Each stone seems to capture a fragment of greenery, turning simplicity into timeless elegance.", short: "A set of green stones, inspired by nature." },
  'rosalia': { description: "Like a butterfly in the first days of spring, this piece celebrates softness, freedom and the beauty of new beginnings. A delicate touch to wear every day.", short: "Rosy butterfly earrings, soft and spring-like." },
  'premier-regard': { description: "Sometimes a single glance is all it takes to change everything. Its spiralling heart evokes the whirl of first emotions, while its golden rays symbolise the light of an encounter that illuminates the moment.", short: "Spiralled sun earrings with a golden glow." },
  'eclora': { description: "Where the delicacy of ivory meets the nobility of gold. A timeless creation that brings a touch of natural light to every silhouette.", short: "Petal earrings in ivory and gold." },
  'loceane': { description: "Like a seashell gently laid upon the sand, L'Océane captures the beauty of the sea and the sparkle of the sun. A creation for those who carry a breath of ocean wherever they go.", short: "Golden seashell earrings, a breath of the sea." }
};
function pField(p, field) {
  const lang = getLang();
  if (lang === 'en' && PRODUCT_EN[p.id] && PRODUCT_EN[p.id][field]) return PRODUCT_EN[p.id][field];
  return p[field];
}

/* Category labels per language */
const CAT_LABELS = {
  fr: { necklaces: 'Colliers', sets: 'Parures', earrings: "Boucles d'oreilles" },
  en: { necklaces: 'Necklaces', sets: 'Sets', earrings: 'Earrings' }
};
function catLabel(cat) { return (CAT_LABELS[getLang()] || CAT_LABELS.fr)[cat] || cat; }

/* UI dictionary */
const UI = {
  fr: {
    /* nav */
    nav_home: 'Accueil', nav_collections: 'Collection', nav_best: 'Meilleures ventes',
    nav_about: 'À propos', nav_contact: 'Contact', nav_whatsapp: 'WhatsApp',
    lang_name: 'Français',
    /* announcement */
    announce_text: '🎉 Offre de lancement BELORYA ! Profitez de -10% avec le code {code} pour célébrer le lancement de notre marque.',
    announce_short: '🎉 -10% · {code}',
    announce_copy: 'Copier le code', announce_copied: 'Code copié !',
    /* trust bar */
    trust_free_casa: 'Livraison gratuite à Casablanca',
    trust_free_250: 'Livraison offerte dès 250 MAD',
    trust_cod: 'Paiement à la livraison',
    trust_steel: 'Acier inoxydable',
    /* hero shipping */
    ship_casa_free: 'Livraison gratuite à Casablanca',
    ship_maroc_250: 'Livraison offerte partout au Maroc dès 250 MAD',
    /* cart */
    cart_title: 'Votre panier', cart_empty: 'Votre panier est vide',
    cart_explore: 'Découvrir la collection',
    cart_subtotal: 'Sous-total', cart_discount: 'Remise', cart_shipping: 'Livraison',
    cart_total: 'Total', cart_free: 'Gratuite',
    cart_checkout: 'Commander', cart_wa: 'Commander sur WhatsApp',
    cart_promo_label: 'Code promo', cart_promo_ph: 'BELORYA10', cart_promo_apply: 'Appliquer',
    cart_promo_ok: 'Code promo appliqué', cart_promo_bad: 'Code promo invalide.',
    cart_zone_label: 'Zone de livraison', cart_zone_casa: 'Casablanca', cart_zone_out: 'Hors Casablanca',
    cart_eta_label: 'Livraison estimée', cart_eta_val: '2–4 jours ouvrables',
    cart_remove: 'Retirer', cart_added: '{name} ajouté à votre panier',
    cart_checkout_demo: 'Commande via WhatsApp — cliquez sur « Commander sur WhatsApp ».',
    /* product card */
    card_add: 'Ajouter — {price}', card_view: 'Voir le produit',
    /* pdp */
    pdp_home: 'Accueil', pdp_reviews: 'Lire les avis',
    pdp_add: 'Ajouter au panier', pdp_wa: 'Commander sur WhatsApp',
    pdp_save: 'Économisez {amount}',
    pdp_qty: 'Quantité', pdp_dec: 'Diminuer', pdp_inc: 'Augmenter',
    pdp_check_steel: 'Acier inoxydable',
    pdp_check_casa: 'Livraison gratuite à Casablanca',
    pdp_check_250: 'Livraison offerte dès 250 MAD',
    pdp_check_fast: 'Livraison rapide 2–4 jours ouvrables',
    pdp_care_title: "Conseil d'entretien",
    pdp_care_text: "Pour préserver l'éclat de votre bijou, évitez le contact direct avec les parfums, les produits chimiques et l'humidité prolongée.",
    pdp_related_eyebrow: 'La sélection', pdp_related_title: 'Vous aimerez <em>aussi</em>',
    acc_description: 'Description', acc_material: 'Matière &amp; Entretien', acc_delivery: 'Livraison',
    acc_material_body: '<ul><li>Fabriqué en acier inoxydable, avec une finition dorée durable.</li><li>Nettoyez délicatement avec un chiffon doux et sec pour raviver l\'éclat.</li><li>Conservez à l\'abri de l\'humidité, des parfums et des produits chimiques.</li><li>Résistant à l\'eau, anti-ternissement &amp; hypoallergénique.</li></ul>',
    acc_delivery_body: '<ul><li>Livraison gratuite à Casablanca.</li><li>Livraison offerte partout au Maroc dès 250 MAD.</li><li>Livraison standard en 2 à 4 jours ouvrables.</li><li>Paiement à la livraison disponible.</li></ul>',
    /* footer */
    footer_desc: "Bijoux en acier inoxydable, pensés en atelier pour être portés chaque jour. Un luxe accessible, fait pour durer.",
    footer_collections: 'Collection', footer_maison: 'La Maison', footer_contact: 'Contact',
    footer_l_necklaces: 'Colliers', footer_l_sets: 'Parures', footer_l_earrings: "Boucles d'oreilles",
    footer_l_best: 'Meilleures ventes', footer_l_new: 'Nouveautés', footer_l_promo: 'En promotion',
    footer_l_story: 'Notre histoire', footer_l_materials: 'Nos matières', footer_l_private: 'Liste privée',
    footer_city: 'Casablanca, Maroc', footer_hours: 'Lun–Sam · 10:00–19:00',
    footer_rights: 'Tous droits réservés.', footer_privacy: 'Confidentialité', footer_terms: 'Conditions',
    /* newsletter */
    nl_eyebrow: 'Membres privilégiés', nl_title: 'Rejoignez la <em>liste privée</em>',
    nl_sub: 'Accédez en avant-première aux nouveautés, aux éditions limitées et aux offres exclusives.',
    nl_ph: 'Votre adresse e-mail', nl_subscribe: "S'inscrire",
    nl_invalid: 'Veuillez saisir une adresse e-mail valide.',
    nl_ok: 'Bienvenue sur la liste privée, vérifiez votre boîte mail.',
    nl_note: 'Pas de spam — uniquement les nouveautés et offres privées. Désabonnement à tout moment.',
    /* home hero */
    hero_eyebrow: 'Belorya · Eternal Shine',
    hero_title: 'Bijoux en acier<br><em>inoxydable</em>',
    hero_sub: 'Des pièces raffinées, pensées pour l\'élégance du quotidien, l\'éclat et la durabilité.',
    hero_cta1: 'Découvrir la collection', hero_cta2: 'Meilleures ventes',
    hero_m1_b: '316L', hero_m1_s: 'Acier chirurgical',
    hero_m2_b: 'Paiement', hero_m2_s: 'à la livraison',
    hero_m3_b: '2–4 jours', hero_m3_s: 'Livraison rapide',
    /* featured collections */
    feat_eyebrow: 'La Maison', feat_title: 'Nos <em>collections</em>',
    feat_sub: 'Pensées pour briller. Faites pour durer.',
    col_view: 'Voir la collection',
    col1_index: '01 — Colliers', col1_title: 'Colliers', col1_desc: "Des colliers qui subliment le décolleté d'une lumière discrète.",
    col2_index: '02 — Parures', col2_title: 'Parures', col2_desc: 'Des parures assorties, pensées pour être portées ensemble.',
    col3_index: '03 — Boucles', col3_title: "Boucles d'oreilles", col3_desc: "Des boucles d'oreilles qui captent chaque éclat de lumière.",
    /* best sellers */
    best_eyebrow: 'Les plus aimés', best_title: 'Meilleures <em>ventes</em>', best_viewall: 'Voir toutes les pièces',
    /* material */
    mat_eyebrow: 'La matière', mat_title: 'Une beauté qui <em>dure</em>',
    mat_sub: "Réalisés en acier inoxydable, nos bijoux offrent un éclat raffiné, une durabilité au quotidien et un entretien facile.",
    mat_f1_h: 'Durable au quotidien', mat_f1_p: 'Conçu pour garder sa forme et son éclat au fil du temps.',
    mat_f2_h: 'Facile à entretenir', mat_f2_p: 'Un chiffon doux et sec suffit à raviver la brillance.',
    mat_f3_h: 'Finition premium', mat_f3_p: 'Un ton doré champagne et une surface nette, comme un miroir.',
    /* about */
    about_eyebrow: 'Notre histoire', about_title: "Pensés pour l'élégance du <em>quotidien</em>",
    about_p: "BELORYA crée des bijoux en acier inoxydable pour celles qui veulent un style raffiné, sans complication. Chaque pièce est pensée pour être intemporelle, polyvalente et facile à porter chaque jour.",
    about_cta: 'Découvrir la collection',
    /* collections page */
    colpage_title: 'La <em>Collection</em>',
    colpage_sub: "Des bijoux raffinés en acier inoxydable, pensés pour être portés chaque jour.",
    sort_label: 'Trier',
    s_featured: 'En vedette', s_new: 'Plus récent', s_price_asc: 'Prix croissant',
    s_price_desc: 'Prix décroissant', s_best: 'Meilleures ventes',
    f_all: 'Tous', f_new: 'Nouveautés', f_best: 'Meilleures ventes', f_promo: 'En promotion',
    result_word: 'article', empty_cat: 'Aucune pièce dans cette catégorie pour le moment.',
    /* whatsapp order */
    wa_hello: 'Bonjour BELORYA,', wa_want: 'Je souhaite commander :',
    wa_subtotal: 'Sous-total', wa_promo: 'Code promo', wa_discount: 'Remise',
    wa_shipping: 'Livraison', wa_shipping_fee: 'Frais de livraison', wa_total: 'Total',
    wa_free: 'Gratuite', wa_name: 'Nom', wa_phone: 'Téléphone', wa_address: 'Adresse', wa_thanks: 'Merci.',
    wa_interested: 'Je suis intéressé(e) par'
  },
  en: {
    nav_home: 'Home', nav_collections: 'Collection', nav_best: 'Best Sellers',
    nav_about: 'About', nav_contact: 'Contact', nav_whatsapp: 'WhatsApp',
    lang_name: 'English',
    announce_text: '🎉 BELORYA launch offer! Enjoy -10% with the code {code} to celebrate our brand launch.',
    announce_short: '🎉 -10% · {code}',
    announce_copy: 'Copy code', announce_copied: 'Code copied!',
    trust_free_casa: 'Free delivery in Casablanca',
    trust_free_250: 'Free delivery from 250 MAD',
    trust_cod: 'Cash on delivery',
    trust_steel: 'Stainless steel',
    ship_casa_free: 'Free delivery in Casablanca',
    ship_maroc_250: 'Free delivery across Morocco from 250 MAD',
    cart_title: 'Your Bag', cart_empty: 'Your bag is empty',
    cart_explore: 'Explore the collection',
    cart_subtotal: 'Subtotal', cart_discount: 'Discount', cart_shipping: 'Shipping',
    cart_total: 'Total', cart_free: 'Free',
    cart_checkout: 'Checkout', cart_wa: 'Order on WhatsApp',
    cart_promo_label: 'Promo code', cart_promo_ph: 'BELORYA10', cart_promo_apply: 'Apply',
    cart_promo_ok: 'Promo code applied', cart_promo_bad: 'Invalid promo code.',
    cart_zone_label: 'Delivery zone', cart_zone_casa: 'Casablanca', cart_zone_out: 'Outside Casablanca',
    cart_eta_label: 'Estimated delivery', cart_eta_val: '2–4 business days',
    cart_remove: 'Remove', cart_added: '{name} added to your bag',
    cart_checkout_demo: 'Ordering is via WhatsApp — tap “Order on WhatsApp”.',
    card_add: 'Add — {price}', card_view: 'View product',
    pdp_home: 'Home', pdp_reviews: 'Read reviews',
    pdp_add: 'Add to bag', pdp_wa: 'Order on WhatsApp',
    pdp_save: 'Save {amount}',
    pdp_qty: 'Quantity', pdp_dec: 'Decrease', pdp_inc: 'Increase',
    pdp_check_steel: 'Stainless steel',
    pdp_check_casa: 'Free delivery in Casablanca',
    pdp_check_250: 'Free delivery from 250 MAD',
    pdp_check_fast: 'Fast delivery 2–4 business days',
    pdp_care_title: 'Care tip',
    pdp_care_text: 'To preserve the shine of your jewellery, avoid direct contact with perfumes, chemicals and prolonged moisture.',
    pdp_related_eyebrow: 'The selection', pdp_related_title: 'You may also <em>love</em>',
    acc_description: 'Description', acc_material: 'Material &amp; Care', acc_delivery: 'Delivery',
    acc_material_body: '<ul><li>Crafted from stainless steel with a durable golden finish.</li><li>Wipe gently with a soft, dry cloth to restore the shine.</li><li>Keep away from moisture, perfumes and chemicals.</li><li>Water-resistant, anti-tarnish &amp; hypoallergenic.</li></ul>',
    acc_delivery_body: '<ul><li>Free delivery in Casablanca.</li><li>Free delivery across Morocco from 250 MAD.</li><li>Standard delivery in 2 to 4 business days.</li><li>Cash on delivery available.</li></ul>',
    footer_desc: 'Stainless steel jewellery, designed in the studio to be worn every day. Accessible luxury, built to last.',
    footer_collections: 'Collection', footer_maison: 'The Maison', footer_contact: 'Contact',
    footer_l_necklaces: 'Necklaces', footer_l_sets: 'Sets', footer_l_earrings: 'Earrings',
    footer_l_best: 'Best Sellers', footer_l_new: 'New Arrivals', footer_l_promo: 'On Sale',
    footer_l_story: 'Our Story', footer_l_materials: 'Our Materials', footer_l_private: 'Private List',
    footer_city: 'Casablanca, Morocco', footer_hours: 'Mon–Sat · 10:00–19:00',
    footer_rights: 'All rights reserved.', footer_privacy: 'Privacy', footer_terms: 'Terms',
    nl_eyebrow: 'Members only', nl_title: 'Join the <em>Private List</em>',
    nl_sub: 'Get early access to new arrivals, limited drops and exclusive offers.',
    nl_ph: 'Your email address', nl_subscribe: 'Subscribe',
    nl_invalid: 'Please enter a valid email address.',
    nl_ok: 'Welcome to the private list, check your inbox.',
    nl_note: 'No noise — only new arrivals and private offers. Unsubscribe anytime.',
    hero_eyebrow: 'Belorya · Eternal Shine',
    hero_title: 'Timeless Stainless<br><em>Steel Jewelry</em>',
    hero_sub: 'Refined pieces crafted for everyday elegance, shine and durability.',
    hero_cta1: 'Explore Collection', hero_cta2: 'Best Sellers',
    hero_m1_b: '316L', hero_m1_s: 'Surgical steel',
    hero_m2_b: 'Cash', hero_m2_s: 'on delivery',
    hero_m3_b: '2–4 days', hero_m3_s: 'Fast delivery',
    feat_eyebrow: 'The Maison', feat_title: 'Our Signature <em>Collections</em>',
    feat_sub: 'Designed to shine. Made to last.',
    col_view: 'View Collection',
    col1_index: '01 — Necklaces', col1_title: 'Necklaces', col1_desc: 'Necklaces that grace the neckline with a discreet glow.',
    col2_index: '02 — Sets', col2_title: 'Sets', col2_desc: 'Matching sets, designed to be worn together.',
    col3_index: '03 — Earrings', col3_title: 'Earrings', col3_desc: 'Earrings that catch every glimmer of light.',
    best_eyebrow: 'Most loved', best_title: 'Best <em>Sellers</em>', best_viewall: 'View all pieces',
    mat_eyebrow: 'The material', mat_title: 'Beauty That <em>Lasts</em>',
    mat_sub: 'Crafted from stainless steel, our jewelry is designed for a refined shine, everyday durability and effortless care.',
    mat_f1_h: 'Durable for daily wear', mat_f1_p: 'Built to keep its shape and shine through time.',
    mat_f2_h: 'Easy to maintain', mat_f2_p: 'A soft, dry cloth is all it takes to bring back the glow.',
    mat_f3_h: 'Premium finish', mat_f3_p: 'A warm champagne-gold tone with a precise, mirror-clean surface.',
    about_eyebrow: 'Our story', about_title: 'Designed for Everyday <em>Elegance</em>',
    about_p: 'BELORYA creates stainless steel jewelry for those who want refined style without complication. Each piece is designed to feel timeless, versatile and easy to wear every day.',
    about_cta: 'Discover the Collection',
    colpage_title: 'The <em>Collection</em>',
    colpage_sub: 'Refined stainless steel jewellery, designed to be worn every day.',
    sort_label: 'Sort',
    s_featured: 'Featured', s_new: 'Newest', s_price_asc: 'Price: Low to High',
    s_price_desc: 'Price: High to Low', s_best: 'Best Sellers',
    f_all: 'All', f_new: 'New Arrivals', f_best: 'Best Sellers', f_promo: 'On Sale',
    result_word: 'piece', empty_cat: 'No pieces in this category yet.',
    wa_hello: 'Hello BELORYA,', wa_want: 'I would like to order:',
    wa_subtotal: 'Subtotal', wa_promo: 'Promo code', wa_discount: 'Discount',
    wa_shipping: 'Delivery', wa_shipping_fee: 'Delivery fee', wa_total: 'Total',
    wa_free: 'Free', wa_name: 'Name', wa_phone: 'Phone', wa_address: 'Address', wa_thanks: 'Thank you.',
    wa_interested: "I'm interested in"
  }
};

function t(key, vars) {
  const lang = getLang();
  let s = (UI[lang] && UI[lang][key] != null) ? UI[lang][key] : (UI.fr[key] != null ? UI.fr[key] : key);
  if (vars) for (const k in vars) s = s.replace(new RegExp('\\{' + k + '\\}', 'g'), vars[k]);
  return s;
}

/* Apply translations to static HTML:
   data-i18n="key" -> textContent · data-i18n-html="key" -> innerHTML
   data-i18n-attr="attr:key;attr2:key2" -> element attributes */
function applyStaticI18n(root = document) {
  root.querySelectorAll('[data-i18n]').forEach(el => { el.textContent = t(el.getAttribute('data-i18n')); });
  root.querySelectorAll('[data-i18n-html]').forEach(el => { el.innerHTML = t(el.getAttribute('data-i18n-html')); });
  root.querySelectorAll('[data-i18n-attr]').forEach(el => {
    el.getAttribute('data-i18n-attr').split(';').forEach(pair => {
      const [attr, key] = pair.split(':');
      if (attr && key) el.setAttribute(attr.trim(), t(key.trim()));
    });
  });
  document.documentElement.lang = getLang();
}
