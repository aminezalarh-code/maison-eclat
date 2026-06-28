MAISON ÉCLAT — Image assets
============================

Drop real jewellery photography here to replace the elegant SVG placeholders.

Folder layout (create as needed):
  assets/
    hero.jpg          → homepage hero (portrait, ~1000×1250)
    material.jpg      → "Beauty That Lasts" macro shot (portrait)
    editorial.jpg     → "Luxury in Every Detail" image
    products/
      luna.jpg        → matches PRODUCTS[].image in js/products.js
      eclat.jpg
      nova.jpg
      serena.jpg
      royal.jpg
      anklet.jpg
      ...

How replacement works
---------------------
Each product in js/products.js has an `image` path (e.g. "assets/products/luna.jpg").
- If the file exists, it is shown automatically (lazy-loaded).
- If it is missing, the site falls back to the on-brand gold line-art placeholder.
So you can add photos one at a time without breaking anything.

Photo guidance for a luxury look
--------------------------------
- Shoot on deep black / charcoal or dark marble with a single warm key light.
- Square crop (1:1) for product cards, portrait (4:5) works for hero/PDP.
- Keep backgrounds dark so the gold accents read; avoid bright/white backdrops.
- Export optimised JPG/WebP (~150–300 KB) for fast loading.
