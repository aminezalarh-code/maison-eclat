/* ============================================================
   BELORYA — storefront data layer
   Fetches products / categories / promo / settings from Supabase
   when configured (admin/config.js). If not configured or the fetch
   fails, the storefront keeps using its built-in data (graceful
   fallback) so the live site never breaks.
   Loaded after products.js and i18n.js, before app.js.
   ============================================================ */
window.Store = (function () {
  const S = { settings: {}, client: null, promo: null, ready: false };

  function configured() {
    const C = window.BELORYA_SUPABASE || {};
    return !!(C.url && !/YOUR-/.test(C.url) && C.anonKey && !/YOUR-/.test(C.anonKey) && window.supabase);
  }

  async function hydrate() {
    if (!configured()) return { ok: false };
    try {
      const C = window.BELORYA_SUPABASE;
      const c = window.supabase.createClient(C.url, C.anonKey);
      S.client = c;

      const [cats, prods, imgs, setts, promos, vars] = await Promise.all([
        c.from('categories').select('*').order('display_order'),
        c.from('products').select('*').in('status', ['active', 'out_of_stock']).order('display_order').order('created_at', { ascending: false }),
        c.from('product_images').select('*').order('display_order'),
        c.from('settings').select('*'),
        c.from('promo_codes').select('*').eq('active', true),
        c.from('product_variants').select('*').order('display_order')
      ]);
      if (prods.error || !prods.data) return { ok: false };

      const varsByP = {};
      (vars && vars.data || []).forEach(v => (varsByP[v.product_id] = varsByP[v.product_id] || []).push({
        name: v.name, color: v.color || v.name, stock: v.stock == null ? null : Number(v.stock), price_diff: Number(v.price_diff || 0)
      }));

      const catById = {};
      (cats.data || []).forEach(k => {
        catById[k.id] = k;
        if (typeof CAT_LABELS !== 'undefined') { CAT_LABELS.fr[k.slug] = k.name_fr; CAT_LABELS.en[k.slug] = k.name_en || k.name_fr; }
      });

      const imgsByP = {};
      (imgs.data || []).forEach(im => (imgsByP[im.product_id] = imgsByP[im.product_id] || []).push(im.url));

      const now = Date.now();
      const mapped = prods.data.map(p => {
        const cat = catById[p.category_id];
        const pimgs = imgsByP[p.id] || [];
        const onSale = p.sale_price != null && Number(p.sale_price) < Number(p.price)
          && (!p.sale_start || new Date(p.sale_start).getTime() <= now)
          && (!p.sale_end || new Date(p.sale_end).getTime() >= now);
        return {
          id: p.slug, name: p.name, category: cat ? cat.slug : '',
          price: onSale ? Number(p.sale_price) : Number(p.price),
          oldPrice: onSale ? Number(p.price) : null,
          material: p.material || '', description: p.description || '', short: p.short || '',
          rating: p.rating || 4.8,
          badge: p.badge || (p.is_best_seller ? 'Best Seller' : (p.is_new ? 'New' : null)),
          image: p.featured_image || pimgs[0] || '',
          images: pimgs.length ? pimgs : (p.featured_image ? [p.featured_image] : []),
          stock: p.stock == null ? null : Number(p.stock), status: p.status,
          variants: varsByP[p.id] || []
        };
      });
      if (mapped.length) window.PRODUCTS = mapped;

      const map = {}; (setts.data || []).forEach(r => map[r.key] = r.value || {});
      S.settings = map;

      // all active & non-expired promos (the cart validates any of them);
      // "featured" promo (shown in the announcement bar): BELORYA10 if active, else the first
      const active = (promos.data || []).filter(p => !p.expires_at || new Date(p.expires_at).getTime() >= now);
      S.promos = active;
      S.promo = active.find(p => p.code === 'BELORYA10') || active[0] || null;

      S.ready = true;
      return { ok: true, settings: map, promo: S.promo };
    } catch (e) {
      console.warn('[Store] hydrate failed — using built-in data.', e);
      return { ok: false };
    }
  }

  /* Persist an order created at WhatsApp checkout. Silent no-op if offline. */
  async function saveOrder(order, items) {
    if (!S.client) return null;
    try {
      const { data, error } = await S.client.from('orders').insert(order).select('id').single();
      if (error || !data) { console.warn('[Store] saveOrder', error); return null; }
      if (items && items.length) {
        await S.client.from('order_items').insert(items.map(it => Object.assign({ order_id: data.id }, it)));
      }
      return data.id;
    } catch (e) { console.warn('[Store] saveOrder failed', e); return null; }
  }

  return { hydrate, saveOrder, get settings() { return S.settings; }, get promo() { return S.promo; }, get promos() { return S.promos || []; }, get client() { return S.client; } };
})();
