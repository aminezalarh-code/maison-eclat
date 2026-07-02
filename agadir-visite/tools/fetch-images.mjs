/* Fetches freely-licensed photos from Wikimedia Commons to replace the
   reference-site images. Saves them into assets/images/ (as .jpg) and writes
   CREDITS.md with attribution. Run:  node tools/fetch-images.mjs            */
import { writeFile, mkdir } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const IMG = resolve(ROOT, "assets/images");
const UA = "AgadirVisiteSiteBuilder/1.0 (https://agadir-visite.com; info@agadir-visite.com)";

// filename (saved as <name>.jpg)  ->  { q: search term, w: thumbnail width, wide?: prefer landscape }
const JOBS = {
  "hero-1":            { q: "Agadir Marina Morocco",          w: 1920, wide: true },
  "hero-2":            { q: "Erg Chebbi dunes",               w: 1920, wide: true },
  "hero-3":            { q: "Taghazout beach",                w: 1920, wide: true },
  "intro":            { q: "Agadir Morocco",                  w: 1200, wide: true },

  "exc-wildlife":     { q: "Souss-Massa National Park",      w: 1000 },
  "exc-marrakech":    { q: "Jemaa el-Fnaa Marrakech",        w: 1000 },
  "exc-essaouira":    { q: "Essaouira harbour",              w: 1000 },
  "exc-legzira":      { q: "Legzira beach",                  w: 1000 },
  "exc-tiout":        { q: "Taroudant ramparts",             w: 1000 },
  "exc-citytour":     { q: "Agadir cityscape",               w: 1000 },
  "exc-souk":         { q: "Moroccan spice market souk",     w: 1000 },

  "circuit-taroudant":  { q: "Taroudant Morocco",            w: 1000 },
  "circuit-ouarzazate": { q: "Ait Benhaddou",                w: 1000 },
  "circuit-zagora":     { q: "Zagora Morocco desert",        w: 1000 },
  "circuit-zagora-4x4": { q: "Merzouga desert 4x4",          w: 1000 },
  "circuit-imperial":   { q: "Fes el Bali Morocco",          w: 1000 },
  "circuit-chegaga":    { q: "Erg Chigaga dunes",            w: 1000 },

  "act-camel":        { q: "Dromedary camel Morocco beach",  w: 1000 },
  "act-horse":        { q: "Horse riding beach",             w: 1000 },
  "act-massage":      { q: "Spa massage stones",             w: 1000 },
  "act-hammam":       { q: "Moroccan hammam",                w: 1000 },
  "act-quad":         { q: "Quad bike ATV",                   w: 1000 },
  "act-fantasia":     { q: "Tbourida Fantasia Morocco",      w: 1000 },
  "act-seatrip":      { q: "Sailing boat ocean",             w: 1000 },
  "act-buggy":        { q: "Dune buggy desert",              w: 1000 },
  "act-balloon":      { q: "Hot air balloon Marrakech",      w: 1000 },

  "veh-vito":         { q: "Mercedes-Benz Vito",             w: 1000 },
  "veh-sprinter":     { q: "Mercedes-Benz Sprinter van",     w: 1000 },
  "veh-prado":        { q: "Toyota Land Cruiser Prado",      w: 1000 },
  "veh-kodiaq":       { q: "Skoda Kodiaq",                   w: 1000 },

  "gallery-1":        { q: "Camel caravan Sahara",           w: 1000 },
  "gallery-2":        { q: "Kasbah Morocco",                 w: 1000 },
  "gallery-3":        { q: "Sahara sunset Morocco",          w: 1000 },
  "gallery-4":        { q: "Atlas Mountains Morocco village",w: 1000 },
  "gallery-5":        { q: "Moroccan ornate door",           w: 1000 },
  "gallery-6":        { q: "Sahara sand dunes",              w: 1000 },
  "gallery-7":        { q: "Moroccan market stall",          w: 1000 },
  "gallery-8":        { q: "Morocco coast Atlantic",         w: 1000 },

  "team-ceo":         { q: "Moroccan mint tea pouring",      w: 1000 },
};

const api = (params) =>
  "https://commons.wikimedia.org/w/api.php?" +
  new URLSearchParams({ format: "json", origin: "*", ...params });

const strip = (html) => (html || "").replace(/<[^>]*>/g, "").replace(/\s+/g, " ").trim();

async function search(q, width) {
  const url = api({
    action: "query", generator: "search", gsrsearch: q,
    gsrnamespace: "6", gsrlimit: "12",
    prop: "imageinfo", iiprop: "url|size|mime|extmetadata", iiurlwidth: String(width),
  });
  const res = await fetch(url, { headers: { "User-Agent": UA } });
  if (!res.ok) throw new Error("API " + res.status);
  const data = await res.json();
  const pages = Object.values(data?.query?.pages || {});
  pages.sort((a, b) => (a.index ?? 0) - (b.index ?? 0));
  return pages;
}

function pick(pages, wantWide) {
  for (const p of pages) {
    const ii = p.imageinfo?.[0];
    if (!ii || !ii.thumburl) continue;
    if (!/jpeg|png/.test(ii.mime || "")) continue;        // no svg/gif/diagrams
    if ((ii.width || 0) < 700) continue;                  // skip tiny/icons
    const landscape = (ii.width || 0) >= (ii.height || 1);
    if (wantWide && !landscape) continue;                 // hero must be landscape
    return ii;
  }
  // relax the landscape requirement if nothing matched
  for (const p of pages) {
    const ii = p.imageinfo?.[0];
    if (ii?.thumburl && /jpeg|png/.test(ii.mime || "") && (ii.width || 0) >= 700) return ii;
  }
  return null;
}

const credits = [];
let ok = 0, fail = 0;

for (const [name, job] of Object.entries(JOBS)) {
  try {
    const ii = pick(await search(job.q, job.w), job.wide);
    if (!ii) { console.log(`MISS  ${name}  (no match for "${job.q}")`); fail++; continue; }
    const img = await fetch(ii.thumburl, { headers: { "User-Agent": UA } });
    const buf = Buffer.from(await img.arrayBuffer());
    await writeFile(resolve(IMG, name + ".jpg"), buf);
    const author = strip(ii.extmetadata?.Artist?.value) || "Unknown";
    const license = strip(ii.extmetadata?.LicenseShortName?.value) || "see source";
    credits.push(`| ${name}.jpg | ${author} | ${license} | ${ii.descriptionurl} |`);
    console.log(`OK    ${name}.jpg  (${(buf.length/1024).toFixed(0)} KB) — ${license}`);
    ok++;
  } catch (e) {
    console.log(`ERR   ${name}: ${e.message}`); fail++;
  }
}

const md = `# Image Credits

All photographs below are sourced from **Wikimedia Commons** and reused under their
respective free licenses. Please keep this attribution if you continue to use them.
Replace any image by dropping a new file with the same name into \`assets/images/\`.

| File | Author | License | Source |
|------|--------|---------|--------|
${credits.sort().join("\n")}

_The logo and any award badge are excluded — provide your own._
`;
await writeFile(resolve(ROOT, "CREDITS.md"), md);
console.log(`\nDone. ${ok} downloaded, ${fail} failed. Wrote CREDITS.md`);
