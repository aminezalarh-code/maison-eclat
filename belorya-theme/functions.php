<?php
/**
 * BELORYA theme — setup, WooCommerce support, assets, brand settings.
 * Design parity: templates output the SAME class names as the original
 * static site, and style.css is the original CSS, so nothing drifts.
 */
if (!defined('ABSPATH')) exit;

define('BELORYA_VER', '1.0.0');

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
        'whatsapp'      => preg_replace('/[^0-9]/', '', $s['whatsapp']),
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
        'ajaxUrl'       => admin_url('admin-ajax.php'),
        'restUrl'       => esc_url_raw(rest_url()),
        'nonce'         => wp_create_nonce('wp_rest'),
        'homeUrl'       => home_url('/'),
        'shopUrl'       => function_exists('wc_get_page_permalink') ? wc_get_page_permalink('shop') : home_url('/'),
        'cartUrl'       => function_exists('wc_get_cart_url') ? wc_get_cart_url() : home_url('/panier/'),
    ];
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
