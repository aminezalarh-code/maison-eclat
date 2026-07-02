/* Fetch a few extra high-res images for the redesigned homepage. */
import { writeFile } from "node:fs/promises";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";
const IMG = resolve(dirname(fileURLToPath(import.meta.url)), "..", "assets/images");
const UA = "AgadirVisiteSiteBuilder/1.0 (https://agadir-visite.com; info@agadir-visite.com)";
const api = (p) => "https://commons.wikimedia.org/w/api.php?" + new URLSearchParams({ format: "json", origin: "*", ...p });

const JOBS = {
  "hero-marrakech": { q: "Marrakesh Jemaa el-Fnaa", w: 1920, wide: true },
  "booking-desert": { q: "Camel Sahara Morocco", w: 1400, wide: true },
};

for (const [name, job] of Object.entries(JOBS)) {
  try {
    const url = api({ action: "query", generator: "search", gsrsearch: job.q, gsrnamespace: "6", gsrlimit: "15",
      prop: "imageinfo", iiprop: "url|size|mime", iiurlwidth: String(job.w) });
    const data = await (await fetch(url, { headers: { "User-Agent": UA } })).json();
    const pages = Object.values(data?.query?.pages || {}).sort((a,b)=>(a.index??0)-(b.index??0));
    let ii = null;
    for (const p of pages) { const x = p.imageinfo?.[0];
      if (x?.thumburl && /jpeg|png/.test(x.mime||"") && (x.width||0) >= 900 && (x.width||0) > (x.height||1)) { ii = x; break; } }
    if (!ii) { console.log("MISS " + name); continue; }
    const buf = Buffer.from(await (await fetch(ii.thumburl, { headers: { "User-Agent": UA } })).arrayBuffer());
    await writeFile(resolve(IMG, name + ".jpg"), buf);
    console.log(`OK ${name}.jpg ${(buf.length/1024).toFixed(0)}KB`);
  } catch (e) { console.log("ERR " + name + ": " + e.message); }
}
