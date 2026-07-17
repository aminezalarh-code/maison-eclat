<?php
/**
 * Shop archive — faithful port of collections.html.
 * The toolbar (filters + sort) and grid are hydrated by belorya.js from the
 * WooCommerce catalogue, so filtering/sorting/on-sale behave identically to
 * the original static site. ?cat= and ?sort= URL params are honoured by the JS.
 */
if (!defined('ABSPATH')) exit;
get_header();
?>
<main data-page="collections">
  <section class="page-hero">
    <div class="wrap">
      <div class="breadcrumb" data-reveal><a href="<?php echo esc_url(home_url('/')); ?>" data-i18n="nav_home">Accueil</a><span>/</span><span data-i18n="nav_collections">Collection</span></div>
      <h1 data-reveal data-delay="1" data-i18n-html="colpage_title">La <em>Collection</em></h1>
      <p data-reveal data-delay="2" data-i18n="colpage_sub">Des bijoux raffinés en acier inoxydable, pensés pour être portés chaque jour.</p>
    </div>
  </section>

  <div class="trust-bar-mount"></div>

  <section class="wrap">
    <div class="toolbar">
      <div class="filters" id="filters"></div>
      <div style="display:flex;align-items:center;gap:1.4rem;flex-wrap:wrap">
        <span class="results-count" id="resultsCount"></span>
        <div class="sort">
          <label for="sortSelect" data-i18n="sort_label">Trier</label>
          <select id="sortSelect">
            <option value="featured" data-i18n="s_featured">En vedette</option>
            <option value="new" data-i18n="s_new">Plus récent</option>
            <option value="best" data-i18n="s_best">Meilleures ventes</option>
            <option value="price-asc" data-i18n="s_price_asc">Prix croissant</option>
            <option value="price-desc" data-i18n="s_price_desc">Prix décroissant</option>
          </select>
        </div>
      </div>
    </div>
  </section>

  <section class="section wrap" style="padding-top:2.5rem">
    <div class="product-grid" id="collection-grid"></div>
  </section>
</main>
<?php get_footer();
