# Maison Éclat — Luxury Stainless Steel Jewelry

A premium, fully responsive jewellery boutique website. Dark luxury aesthetic
(deep black + champagne gold), elegant serif/sans typography, cinematic
product presentation. No frameworks, no build step — just open it.

## Pages

| File | Purpose |
|------|---------|
| `index.html` | Homepage — hero, signature collections, best sellers, material, editorial, about, newsletter, footer |
| `collections.html` | Shop listing — category filters + sort, responsive product grid |
| `product.html` | Product detail — gallery, price, quantity, add-to-bag, WhatsApp order, details accordion, related products |

The **cart** is a slide-in drawer available on every page (top-right bag icon),
persisted in `localStorage`.

## Project structure

```
site jowelry/
├─ index.html          # Homepage
├─ collections.html    # Collection listing page
├─ product.html        # Product detail template (?id=...)
├─ styles/
│  └─ main.css         # Full design system + responsive rules
├─ js/
│  ├─ products.js      # Product DATA + image/placeholder helpers
│  └─ app.js           # Header/footer, cart, filters, PDP, animations
├─ assets/             # Drop real photos here (see assets/README.txt)
└─ .claude/            # Local preview server config (optional)
```

## Run it

Just open `index.html` in a browser. For clickable navigation between pages,
serve the folder over HTTP, e.g.:

```bash
node .claude/server.js     # → http://localhost:5500
```

## Customise

Open **`js/app.js`** (top of file) and **`js/products.js`**:

- **WhatsApp number** — `WHATSAPP_NUMBER` in `js/app.js` (international format, no `+`).
- **Currency** — `CURRENCY` in `js/products.js` (e.g. `MAD`, `€`, `$`, `DH`).
- **Products** — edit the `PRODUCTS` array in `js/products.js`. Each item:
  `id, name, category, price, oldPrice, material, image, description, badge, rating`.
- **Real photos** — see `assets/README.txt`. Missing images fall back to
  on-brand gold line-art placeholders automatically.
- **Contact / social links** — in `renderFooter()` inside `js/app.js`.

## Notes on claims

Marketing claims like *water-resistant / anti-tarnish / hypoallergenic* are
included but explicitly marked **"if confirmed by brand"** on the product page
and material section. Verify before publishing — no false guarantees are made.

## Built for

- Semantic HTML, accessible nav/cart, `prefers-reduced-motion` respected.
- Lazy-loaded images, lightweight vanilla JS (no dependencies), Google Fonts only.
- Subtle animations: fade-in on scroll, hover zoom, button glow.
