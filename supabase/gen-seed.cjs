/* Generates supabase/seed-products.sql from js/products.js (run once, offline).
   Usage: node supabase/gen-seed.cjs > supabase/seed-products.sql            */
const path = require('path');
const { PRODUCTS } = require(path.join(__dirname, '..', 'js', 'products.js'));

const q = (v) => v === null || v === undefined ? 'null' : `'${String(v).replace(/'/g, "''")}'`;
const num = (v) => (v === null || v === undefined) ? 'null' : Number(v);
const bool = (v) => v ? 'true' : 'false';

let out = `-- Auto-generated product seed. Run AFTER schema.sql.\n\n`;

for (const p of PRODUCTS) {
  const isBest = p.badge === 'Best Seller';
  const isNew = p.badge === 'New';
  const sku = `BLR-${p.id.toUpperCase().replace(/[^A-Z0-9]+/g, '-')}`;
  out += `insert into products (slug,name,category_id,price,material,sku,stock,description,short,rating,status,is_best_seller,is_new,badge,featured_image)
select ${q(p.id)}, ${q(p.name)}, c.id, ${num(p.price)}, ${q(p.material)}, ${q(sku)}, 15,
       ${q(p.description)}, ${q(p.short)}, ${num(p.rating)}, 'active', ${bool(isBest)}, ${bool(isNew)}, ${q(p.badge)}, ${q(p.image)}
from categories c where c.slug = ${q(p.category)}
on conflict (slug) do nothing;\n`;

  const imgs = (p.images && p.images.length) ? p.images : [p.image];
  const values = imgs.map((u, i) => `(${q(u)}, ${i}, ${bool(i === 0)})`).join(', ');
  out += `insert into product_images (product_id, url, display_order, is_featured)
select p.id, v.url, v.ord, v.feat
from products p
join (values ${values}) as v(url, ord, feat) on true
where p.slug = ${q(p.id)}
  and not exists (select 1 from product_images pi where pi.product_id = p.id);\n\n`;
}

process.stdout.write(out);
