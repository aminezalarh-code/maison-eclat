<?php
/**
 * Template Name: BELORYA — Panier
 *
 * Cart page — faithful port of cart.html. belorya.js renders the full cart,
 * promo code, delivery zone, order summary and WhatsApp checkout into
 * #cart-page (a client-side, localStorage cart). Tapping "Commander sur
 * WhatsApp" also records a real WooCommerce order (admin → Orders).
 *
 * Setup: create a Page titled "Panier" (slug: panier) and assign this template.
 */
if (!defined('ABSPATH')) exit;
get_header();
?>
<main data-page="cart">
  <section class="page-hero">
    <div class="wrap">
      <div class="breadcrumb" data-reveal><a href="<?php echo esc_url(home_url('/')); ?>" data-i18n="nav_home">Accueil</a><span>/</span><span data-i18n="cart_title">Votre panier</span></div>
      <h1 data-reveal data-delay="1" data-i18n-html="cart_page_title">Mon <em>panier</em></h1>
    </div>
  </section>

  <div id="cart-page" class="cart-page"></div>
</main>
<?php get_footer();
