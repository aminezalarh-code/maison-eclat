<?php
/**
 * BELORYA theme — setup, WooCommerce support, assets, brand settings.
 * Design parity: templates output the SAME class names as the original
 * static site, and style.css is the original CSS, so nothing drifts.
 */
if (!defined('ABSPATH')) exit;

define('BELORYA_VER', '1.0.1');

/* ---------------- Theme setup ---------------- */
add_action('after_setup_theme', function () {
    load_theme_textdomain('belorya', get_template_directory() . '/languages');
    add_theme_support('title-tag');
    add_theme_support('post-thumbnails');
    add_theme_support('automatic-feed-links');
    add_theme_support('html5', ['search-form', 'gallery', 'caption', 'style', 'script']);

    // WooCommerce — we render our own gallery, so no zoom/lightbox/slider
    add_theme_support('woocommerce');

    register_nav_menus([
        'primary' => __('Navigation principale', 'belorya'),
        'footer_collections' => __('Pied — Collection', 'belorya'),
        'footer_maison' => __('Pied — La Maison', 'belorya'),
    ]);
});

/* ---------------- Assets ---------------- */
add_action('wp_enqueue_scripts', function () {
    // Google Fonts (same families as the design)
    wp_enqueue_style('belorya-fonts', 'https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,500;0,600;1,400;1,500&family=Playfair+Display:ital,wght@0,400;0,500;0,600;1,400;1,500&family=Inter:wght@300;400;500;600&display=swap', [], null);

    // Theme stylesheet (the ported BELORYA design)
    wp_enqueue_style('belorya-style', get_stylesheet_uri(), [], BELORYA_VER);

    // i18n dictionary (FR/EN/AR overlay) then the storefront logic
    wp_enqueue_script('belorya-i18n', get_template_directory_uri() . '/js/i18n.js', [], BELORYA_VER, true);
    wp_enqueue_script('belorya-app', get_template_directory_uri() . '/js/belorya.js', ['belorya-i18n', 'jquery'], BELORYA_VER, true);

    // Expose settings + WooCommerce endpoints to JS
    wp_localize_script('belorya-app', 'BELORYA', belorya_js_config());
}, 20);

/* Our theme fully styles the storefront (ported design). Drop WooCommerce's own
   stylesheets so they don't fight our layout — on shop/product/cart pages their
   default CSS (esp. woocommerce-smallscreen) broke the mobile header + grid. */
add_filter('woocommerce_enqueue_styles', '__return_empty_array');
add_action('wp_enqueue_scripts', function () {
    foreach (['wc-blocks-style', 'wc-blocks-vendors-style', 'wc-blocks-packages-style'] as $h) {
        wp_dequeue_style($h);
        wp_deregister_style($h);
    }
}, 100);

/* ---------------- Brand settings (with defaults matching the live site) ---------------- */
function belorya_settings() {
    return [
        'whatsapp'         => get_theme_mod('belorya_whatsapp', '212660323891'),
        'instagram'        => get_theme_mod('belorya_instagram', 'https://www.instagram.com/belorya_/'),
        'facebook'         => get_theme_mod('belorya_facebook', 'https://www.facebook.com/profile.php?id=61591102114678'),
        'tiktok'           => get_theme_mod('belorya_tiktok', 'https://www.tiktok.com/@belorya5'),
        'email'            => get_theme_mod('belorya_email', 'belorya1@gmail.com'),
        'ship_casa_free'   => (bool) get_theme_mod('belorya_ship_casa_free', true),
        'ship_fee'         => (float) get_theme_mod('belorya_ship_fee', 35),
        'ship_threshold'   => (float) get_theme_mod('belorya_ship_threshold', 250),
        'ship_eta'         => get_theme_mod('belorya_ship_eta', '2–4 jours ouvrables'),
        'meta_pixel'       => get_theme_mod('belorya_meta_pixel', '1061131383114577'),
        'ga_id'            => get_theme_mod('belorya_ga_id', ''),
        'promo_code'       => get_theme_mod('belorya_promo_code', 'BELORYA10'),
    ];
}

function belorya_js_config() {
    $s = belorya_settings();
    return [
        'currency'      => function_exists('get_woocommerce_currency') ? get_woocommerce_currency() : 'MAD',
        'whatsapp'      => preg_replace('/[^0-9]/', '', $s['whatsapp']),
        'brand'         => get_bloginfo('name') ?: 'Belorya',
        'socials'       => [
            'instagram' => $s['instagram'], 'facebook' => $s['facebook'],
            'tiktok' => $s['tiktok'], 'email' => $s['email'],
        ],
        'shipping'      => [
            'casa_free' => $s['ship_casa_free'], 'fee' => $s['ship_fee'],
            'threshold' => $s['ship_threshold'], 'eta' => $s['ship_eta'],
        ],
        'metaPixel'     => $s['meta_pixel'],
        'gaId'          => $s['ga_id'],
        'promoCode'     => $s['promo_code'],
        'promos'        => belorya_active_promos(),
        'products'      => belorya_catalog(),
        'ajaxUrl'       => admin_url('admin-ajax.php'),
        'restUrl'       => esc_url_raw(rest_url()),
        'nonce'         => wp_create_nonce('wp_rest'),
        'homeUrl'       => home_url('/'),
        'shopUrl'       => function_exists('wc_get_page_permalink') ? wc_get_page_permalink('shop') : home_url('/'),
        'cartUrl'       => home_url('/panier/'),
    ];
}

/* ---------------- Catalogue: WooCommerce products → storefront shape ----------------
 * The ported storefront JS (belorya.js) reads window.BELORYA.products in the
 * SAME shape as the original static PRODUCTS array, so nothing in the design
 * changes. We map each published WooCommerce product to that shape.
 *
 *   category : one of necklaces | sets | earrings (from the product category slug)
 *   badge    : "Best Seller" | "New" | "Limited"  (product meta _belorya_badge)
 *   rating   : number                              (product meta _belorya_rating)
 *   variants : [{name,color}]                      (from the "Couleur" attribute)
 *   oldPrice : regular price when the product is on sale
 */
function belorya_cat_slug($wc_slugs) {
    // Map French WooCommerce category slugs to the storefront keys.
    $map = [
        'colliers' => 'necklaces', 'necklaces' => 'necklaces', 'collier' => 'necklaces',
        'parures' => 'sets', 'sets' => 'sets', 'parure' => 'sets',
        'boucles-doreilles' => 'earrings', 'boucles' => 'earrings', 'earrings' => 'earrings',
    ];
    foreach ((array) $wc_slugs as $slug) {
        if (isset($map[$slug])) return $map[$slug];
    }
    return 'necklaces';
}

function belorya_catalog() {
    if (!function_exists('wc_get_products')) return [];
    $cache = get_transient('belorya_catalog');
    if ($cache !== false) return $cache;

    $products = wc_get_products([
        'status'  => 'publish',
        'limit'   => -1,
        'orderby' => 'menu_order',
        'order'   => 'ASC',
    ]);

    $out = [];
    foreach ($products as $product) {
        $id = $product->get_slug();

        // gallery: featured image first, then the gallery images
        $images = [];
        $main = wp_get_attachment_image_url($product->get_image_id(), 'large');
        if ($main) $images[] = $main;
        foreach ($product->get_gallery_image_ids() as $gid) {
            $u = wp_get_attachment_image_url($gid, 'large');
            if ($u) $images[] = $u;
        }
        if (!$images) $images[] = wc_placeholder_img_src('large');

        // category key
        $cat_slugs = wp_get_post_terms($product->get_id(), 'product_cat', ['fields' => 'slugs']);
        $category = belorya_cat_slug($cat_slugs);

        // colour variants from the "Couleur" / "pa_couleur" attribute
        $variants = [];
        foreach ($product->get_attributes() as $attr) {
            $name = is_object($attr) && method_exists($attr, 'get_name') ? $attr->get_name() : '';
            if (stripos($name, 'couleur') === false && stripos($name, 'color') === false) continue;
            $options = $product->get_attribute($name);
            if ($options) {
                foreach (array_map('trim', explode(',', $options)) as $opt) {
                    if ($opt !== '') $variants[] = ['name' => $opt, 'color' => $opt];
                }
            }
        }

        $on_sale = $product->is_on_sale();
        $price = (float) $product->get_price();
        $regular = (float) $product->get_regular_price();

        $badge = get_post_meta($product->get_id(), '_belorya_badge', true);
        $rating = get_post_meta($product->get_id(), '_belorya_rating', true);

        $out[] = [
            'id'       => $id,
            'name'     => $product->get_name(),
            'category' => $category,
            'price'    => $price,
            'oldPrice' => ($on_sale && $regular > $price) ? $regular : null,
            'material' => 'Acier inoxydable',
            'description' => wp_strip_all_tags($product->get_description()),
            'short'    => wp_strip_all_tags($product->get_short_description()),
            'image'    => $images[0],
            'images'   => $images,
            'badge'    => $badge ?: null,
            'rating'   => $rating ? (float) $rating : 4.8,
            'stock'    => $product->is_in_stock() ? ($product->get_stock_quantity() ?? 99) : 0,
            'status'   => $product->is_in_stock() ? 'in_stock' : 'out_of_stock',
            'variants' => $variants,
            'url'      => get_permalink($product->get_id()),
        ];
    }

    set_transient('belorya_catalog', $out, HOUR_IN_SECONDS);
    return $out;
}

/* Bust the catalogue cache whenever a product changes. */
add_action('save_post_product', function () { delete_transient('belorya_catalog'); });
add_action('woocommerce_update_product', function () { delete_transient('belorya_catalog'); });
add_action('woocommerce_product_set_stock', function () { delete_transient('belorya_catalog'); });

/* ---------------- Active promo codes → storefront shape ----------------
 * Exposes published WooCommerce coupons so the cart validates any active code
 * (percent or fixed), matching the original storefront promo behaviour. */
function belorya_active_promos() {
    if (!function_exists('wc_get_coupon_id_by_code')) return [];
    $q = get_posts([
        'post_type'   => 'shop_coupon',
        'post_status' => 'publish',
        'numberposts' => -1,
    ]);
    $out = [];
    foreach ($q as $post) {
        $c = new WC_Coupon($post->post_title);
        if (!$c->get_id()) continue;
        // skip expired coupons
        $exp = $c->get_date_expires();
        if ($exp && $exp->getTimestamp() < time()) continue;
        $type = $c->get_discount_type();
        $out[] = [
            'code'  => strtoupper($c->get_code()),
            'type'  => ($type === 'fixed_cart' || $type === 'fixed_product') ? 'fixed' : 'percent',
            'value' => (float) $c->get_amount(),
            'min'   => (float) $c->get_minimum_amount(),
        ];
    }
    return $out;
}

/* ---------------- Homepage image helper ----------------
 * Returns the first image of a product by slug (for the hero / editorial
 * sections of the homepage), falling back to a bundled theme asset. */
function belorya_img($slug, $fallback = '') {
    $product = get_page_by_path($slug, OBJECT, 'product');
    if ($product) {
        $u = get_the_post_thumbnail_url($product->ID, 'large');
        if ($u) return $u;
    }
    return $fallback ?: (get_template_directory_uri() . '/assets/logo.png');
}

/* WhatsApp click-to-chat URL helper */
function belorya_wa_url($text = '') {
    $s = belorya_settings();
    $num = preg_replace('/[^0-9]/', '', $s['whatsapp']);
    $url = 'https://wa.me/' . $num;
    if ($text !== '') $url .= '?text=' . rawurlencode($text);
    return $url;
}

/* ---------------- WooCommerce layout: use our own wrappers ---------------- */
remove_action('woocommerce_before_main_content', 'woocommerce_output_content_wrapper', 10);
remove_action('woocommerce_after_main_content', 'woocommerce_output_content_wrapper_end', 10);
add_action('woocommerce_before_main_content', function () { echo '<main class="belorya-main">'; }, 10);
add_action('woocommerce_after_main_content', function () { echo '</main>'; }, 10);

// Products per page on the shop
add_filter('loop_shop_per_page', function () { return 24; });

// Remove default sidebar
remove_action('woocommerce_sidebar', 'woocommerce_get_sidebar', 10);

/* ---------------- Includes ---------------- */
require get_template_directory() . '/inc/customizer.php';
require get_template_directory() . '/inc/whatsapp-order.php';
