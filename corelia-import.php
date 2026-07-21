<?php
/**
 * Plugin Name: BELORYA — add Corelia (one-time)
 * Description: Creates the 17th product "Corelia" (Parures) with its 4 images. Admin-only, idempotent.
 *              Trigger: /wp-admin/?belorya_add_corelia=go  — then delete this file.
 */
if (!defined('ABSPATH')) exit;

add_action('admin_init', function () {
    if (!isset($_GET['belorya_add_corelia']) || $_GET['belorya_add_corelia'] !== 'go') return;
    if (!current_user_can('manage_options')) wp_die('Forbidden');
    if (!function_exists('wc_get_product')) wp_die('WooCommerce not active');

    @set_time_limit(0);
    require_once ABSPATH . 'wp-admin/includes/media.php';
    require_once ABSPATH . 'wp-admin/includes/file.php';
    require_once ABSPATH . 'wp-admin/includes/image.php';
    header('Content-Type: text/plain; charset=utf-8');

    if (get_page_by_path('corelia', OBJECT, 'product')) { echo 'Corelia already exists'; exit; }

    $p = new WC_Product_Simple();
    $p->set_name('Corelia');
    $p->set_status('publish');
    $p->set_catalog_visibility('visible');
    $p->set_regular_price('169');
    $p->set_description("Inspirée par les reflets dorés du littoral, Corelia célèbre la grâce des trésors marins. Une création raffinée qui évoque l’évasion, la lumière et l’élégance intemporelle.");
    $p->set_manage_stock(false);
    $p->set_stock_status('instock');
    $p->set_sku('BEL-17');

    $term = term_exists('Parures', 'product_cat');
    if (!$term) $term = wp_insert_term('Parures', 'product_cat');
    if (!is_wp_error($term)) $p->set_category_ids([(int) $term['term_id']]);

    $id = $p->save();
    wp_update_post(['ID' => $id, 'post_name' => 'corelia']);
    update_post_meta($id, '_belorya_rating', '4.8');

    $imgs = [
        'https://tbwalmrnwdchdeszjooy.supabase.co/storage/v1/object/public/media/1783427131499-yrz3ri.jpeg',
        'https://tbwalmrnwdchdeszjooy.supabase.co/storage/v1/object/public/media/1783427134631-yjhy0m.jpeg',
        'https://tbwalmrnwdchdeszjooy.supabase.co/storage/v1/object/public/media/1783427231120-y7zj54.jpeg',
        'https://tbwalmrnwdchdeszjooy.supabase.co/storage/v1/object/public/media/1783427233553-9dbtkx.jpeg',
    ];
    $g = []; $first = true;
    foreach ($imgs as $u) {
        $a = media_sideload_image($u, $id, 'Corelia', 'id');
        if (is_wp_error($a)) { echo 'img fail: ' . $a->get_error_message() . "\n"; continue; }
        if ($first) { set_post_thumbnail($id, $a); $first = false; } else { $g[] = $a; }
    }
    if ($g) { $pp = wc_get_product($id); $pp->set_gallery_image_ids($g); $pp->save(); }

    delete_transient('belorya_catalog');
    echo 'Corelia created #' . $id . ' with ' . count($imgs) . ' images. Delete corelia-import.php now.';
    exit;
});
