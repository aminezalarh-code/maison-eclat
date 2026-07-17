<?php
/**
 * Single product — faithful port of product.html.
 * belorya.js renders the full PDP (gallery + swipe, colour swatches, quantity,
 * WhatsApp order, accordion, sticky bar, related) into #pdp. We pass the current
 * product's slug via data-product-id so the correct catalogue entry is shown,
 * while WooCommerce still owns the product data, SEO <head> and cart/order flow.
 */
if (!defined('ABSPATH')) exit;
get_header();

$queried = get_queried_object();
$slug = ($queried && isset($queried->post_name)) ? $queried->post_name : '';
?>
<main data-page="product">
  <section class="pdp" id="pdp" data-product-id="<?php echo esc_attr($slug); ?>"></section>
</main>
<?php get_footer();
