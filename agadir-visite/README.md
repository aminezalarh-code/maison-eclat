# Agadir Visite — Tourism Website

A fast, lightweight, fully responsive static website for **Agadir Visite**, a local
Moroccan tourism agency offering excursions, multi-day circuits, activities, vehicle
rental with driver and airport transfers.

Built with plain **HTML, CSS and vanilla JavaScript** — no build framework, no
dependencies, no tracking. It loads instantly and works on any static host.

---

## 📁 Project structure

```
agadir-visite/
├── index.html              # Home / Welcome
├── excursions.html         # Day trips
├── circuits.html           # Multi-day tours
├── activities.html         # Activities & experiences
├── transfers.html          # Airport & inter-city transfers (+ booking form)
├── vehicles.html           # Our fleet (minibus / minivan / 4x4)
├── golden-book.html        # Traveller reviews / testimonials
├── gallery.html            # Photo gallery
├── blog.html               # Articles
├── about.html              # Who we are + FAQ
├── contact.html            # Contact info + form + map
│
├── assets/
│   ├── css/styles.css      # Single design system (tokens, components, responsive)
│   ├── js/main.js          # Menu, slider, scroll reveals, form handling
│   └── images/             # All images (see "Replacing images" below)
│
├── partials/               # Source fragments used to build the pages
│   ├── head.html           # Shared <head> + top bar + header/nav (template)
│   ├── foot.html           # Shared footer + WhatsApp button + scripts
│   └── content/*.html      # Unique <main> content for each page
│
├── build.sh                # Re-assembles the .html pages from partials
├── robots.txt              # SEO
└── sitemap.xml             # SEO
```

> The `.html` files in the root are the **final, deployable** pages — they already
> contain the header/footer inlined, so the site needs **no server** to work.
> `partials/` and `build.sh` only exist to keep the shared header/footer DRY.

---

## ✏️ Editing content

- **Quick text/price edits:** open the page's file in `partials/content/`, edit it,
  then run `bash build.sh` to regenerate the root `.html` file.
- **Header, footer or menu (all pages at once):** edit `partials/head.html` or
  `partials/foot.html`, then run `bash build.sh`.
- If you don't want to use the build step, you can also edit the root `.html`
  files directly — just remember to repeat header/footer changes on each page.

```bash
# Rebuild all pages after editing any partial
bash build.sh
```

---

## 🖼️ Replacing images

All images live in **`assets/images/`** with clear, descriptive names, e.g.:

| File                | Used for                          |
|---------------------|-----------------------------------|
| `logo.png`          | Brand logo (header & footer)      |
| `hero-1/2/3.webp`   | Homepage hero slider              |
| `exc-*.jpg`         | Day excursion cards               |
| `circuit-*.jpg`     | Multi-day circuit cards           |
| `act-*.jpg/webp`    | Activity cards                    |
| `veh-*.jpg`         | Vehicle cards                     |
| `gallery-*.jpg`     | Photo gallery                     |
| `team-ceo.jpg`      | About page portrait               |

**To swap an image, just drop a new file with the same name** into
`assets/images/`. For best results match the existing aspect ratio
(cards ≈ 29:22, hero ≈ 16:9). Always keep a descriptive `alt` text on the
matching `<img>` tag for SEO and accessibility.

---

## 📨 Connecting the forms

The transfer and contact forms currently run a friendly front-end confirmation and
can open a pre-filled **WhatsApp** message (number set via the `data-whatsapp`
attribute). To wire them to a real backend or email service:

1. Open `assets/js/main.js` and find the `form[data-demo]` handler.
2. Replace the demo logic with a `fetch()` POST to your endpoint, e.g.
   [Formspree](https://formspree.io), [Web3Forms](https://web3forms.com),
   Netlify Forms, or your own API.

```js
// Example: send to Formspree
fetch("https://formspree.io/f/your-id", {
  method: "POST",
  headers: { "Accept": "application/json" },
  body: new FormData(form)
});
```

The WhatsApp number is set in two places — update both to your real number:
- `data-whatsapp="2126..."` on the `<form>` tags
- the floating `.wa-float` button and the `wa.me/` links

---

## 🎨 Design system

All colours, fonts and spacing are defined as CSS variables at the top of
`assets/css/styles.css` (`:root`). Change the brand look in one place:

```css
--teal-700: #0f766e;   /* primary */
--terra:    #c2693b;   /* accent (prices, CTAs) */
--font-head: "Sora";   --font-body: "Inter";
```

---

## 🚀 Deploying

It's a static site — upload the contents of `agadir-visite/` to any host
(Netlify, Vercel, GitHub Pages, cPanel, etc.). No build step is required on the
server. Remember to update the domain in `sitemap.xml`, `robots.txt` and the
`<link rel="canonical">` tags if you use a different URL.

To preview locally:

```bash
npx serve agadir-visite
# or simply open index.html in a browser
```

---

## ✅ Features

- Responsive across desktop, tablet and mobile, with a clean slide-in mobile menu
- Auto-rotating hero slider, scroll-reveal animations (respects `prefers-reduced-motion`)
- Reusable card / section components and a single shared header & footer
- SEO basics: unique titles & meta descriptions, semantic headings, alt text,
  canonical tags, Open Graph tags, `sitemap.xml` and `robots.txt`
- Lazy-loaded images and a tiny CSS/JS footprint for fast loading
- Accessible: keyboard focus styles, ARIA labels, `Esc` closes the menu
