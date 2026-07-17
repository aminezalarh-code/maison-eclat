# BELORYA — WordPress / WooCommerce theme (install & handoff)

This theme reproduces the BELORYA storefront **pixel-for-pixel** on WordPress +
WooCommerce, so the backend (products, orders, promo codes) is free to run while
the design and UX stay identical to the current live site.

## How it works (architecture)

- **Design parity**: `style.css` is the original site CSS, and every template
  outputs the **same class names** as the static site, so nothing drifts.
- **Catalogue**: `functions.php` → `belorya_catalog()` maps every published
  WooCommerce product into the exact shape the storefront JS expects and injects
  it as `window.BELORYA.products` (via `wp_localize_script`). Editing a product
  in WooCommerce updates the storefront automatically (a 1-hour cache is busted
  on every product save).
- **Storefront logic**: `js/i18n.js` (FR/EN/AR + product translations, unchanged)
  and `js/belorya.js` (cart drawer, cart page, PDP gallery/swipe/colour swatches,
  filters, announcement bar, Meta Pixel, WhatsApp order) — ported 1:1 from the
  original `app.js`.
- **Cart & checkout**: a client-side (localStorage) cart preserves the exact UX.
  Tapping **Commander sur WhatsApp** opens WhatsApp **and** records a real
  WooCommerce order (status *on-hold*) via the `belorya_wa_order` AJAX endpoint,
  so every order appears in **WooCommerce → Orders**.
- **Promo codes**: managed as normal **WooCommerce → Marketing → Coupons**.
  Active coupons (percent or fixed) are exposed to the cart automatically.
- **Settings** (WhatsApp number, socials, shipping rules, Meta Pixel, GA, banner
  promo code): **Apparence → Personnaliser → BELORYA**.

## Files

```
belorya-theme/
├── style.css                # original design CSS + WP theme header
├── functions.php            # setup, catalogue builder, coupons, settings, assets
├── header.php / footer.php   # announcement bar, navbar, footer (same classes)
├── front-page.php           # homepage (port of index.html)
├── archive-product.php      # shop / collection (port of collections.html)
├── single-product.php       # product page (port of product.html)
├── template-cart.php        # cart page template (port of cart.html)
├── index.php                # generic fallback
├── inc/customizer.php       # BELORYA settings panel
├── inc/whatsapp-order.php   # WhatsApp → WooCommerce order recorder
├── js/i18n.js               # FR/EN/AR dictionary (unchanged)
├── js/belorya.js            # storefront behaviour
├── assets/logo.png          # brand logo
└── belorya-products.csv     # 16-product WooCommerce import (images from live site)
```

## Setup steps

1. **Install WordPress + WooCommerce** on the host (staging subdomain first,
   e.g. `wp.belorya.ma`). Run WooCommerce's setup wizard; set:
   - Currency: **Moroccan Dirham (MAD)**.
   - Selling location / shipping: Morocco (shipping is handled by our own
     Casablanca / hors-Casablanca logic, so WooCommerce shipping can stay empty).
2. **Upload the theme**: zip the `belorya-theme` folder → Apparence → Thèmes →
   Ajouter → Téléverser → **Activer**. (Or upload via cPanel to
   `wp-content/themes/belorya-theme`.)
3. **Permalinks**: Réglages → Permaliens → **Nom de l'article** → Enregistrer.
4. **Categories**: the CSV import creates them, but you can pre-create
   *Colliers*, *Parures*, *Boucles d'oreilles* (slugs `colliers`, `parures`,
   `boucles-doreilles`).
5. **Import products**: Produits → Importer → choose `belorya-products.csv` →
   run. WooCommerce downloads the product photos from the live site into the
   media library. (Product slugs generated from the names match the storefront
   keys — e.g. *Reflet Lunaire* → `reflet-lunaire` — so translations and the
   PDP line up.)
6. **Cart page**: Pages → Ajouter → title **Panier** (slug `panier`) →
   Template **“BELORYA — Panier”** → Publier.
7. **Menu** (optional): Apparence → Menus → assign to *Navigation principale*
   (the header also works without a menu — links are built in).
8. **Coupon**: Marketing → Coupons → create `BELORYA10` (percentage, 10%). Set
   the banner code in Personnaliser → BELORYA → Offre.
9. **Brand settings**: Personnaliser → BELORYA → fill WhatsApp, socials,
   shipping, Meta Pixel (`1061131383114577`), GA if any.
10. **Go live**: once verified on the staging subdomain, point `belorya.ma` to
    this WordPress install and retire the Supabase backend.

## Notes

- The Meta Pixel is fired from `belorya.js` using the Customizer value
  (`1061131383114577` by default) — PageView, ViewContent, AddToCart,
  InitiateCheckout, all preserved.
- To change any product photo, edit the product in WooCommerce; the storefront
  updates on the next page load.
