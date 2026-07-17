<?php
/**
 * Plugin Name: BELORYA — One-time product importer
 * Description: Imports the 16 BELORYA products from the CSV bundled in the theme
 *              (belorya-theme/belorya-products.csv), creating WooCommerce products,
 *              categories, badges/ratings and sideloading images from their URLs.
 *              Admin-only, idempotent (skips products that already exist by slug).
 *              Trigger: visit  /wp-admin/?belorya_import=go  while logged in as admin.
 *              Safe to delete after the import completes.
 *
 * Drop this file in wp-content/mu-plugins/ (auto-loads) or wp-content/plugins/ and activate.
 */
if (!defined('ABSPATH')) exit;

add_action('admin_init', function () {
    if (!isset($_GET['belorya_import']) || $_GET['belorya_import'] !== 'go') return;
    if (!current_user_can('manage_options')) wp_die('Forbidden');
    if (!function_exists('wc_get_product')) wp_die('WooCommerce is not active.');

    @set_time_limit(0);
    require_once ABSPATH . 'wp-admin/includes/media.php';
    require_once ABSPATH . 'wp-admin/includes/file.php';
    require_once ABSPATH . 'wp-admin/includes/image.php';

    header('Content-Type: text/plain; charset=utf-8');

    // Locate the CSV bundled with the active theme.
    $csv = get_stylesheet_directory() . '/belorya-products.csv';
    if (!file_exists($csv)) $csv = get_template_directory() . '/belorya-products.csv';
    if (!file_exists($csv)) wp_die('CSV not found at ' . esc_html($csv));

    $fh = fopen($csv, 'r');
    if (!$fh) wp_die('Cannot open CSV.');

    // Header row → column index map
    $header = fgetcsv($fh);
    if ($header && isset($header[0])) $header[0] = preg_replace('/^\xEF\xBB\xBF/', '', $header[0]); // strip BOM
    $col = array_flip($header);
    $get = function ($row, $name) use ($col) {
        return isset($col[$name], $row[$col[$name]]) ? $row[$col[$name]] : '';
    };

    $created = 0; $skipped = 0; $log = [];

    while (($row = fgetcsv($fh)) !== false) {
        if (count($row) < 3) continue;
        $name = trim($get($row, 'Name'));
        if ($name === '') continue;

        $slug = sanitize_title($name);

        // Idempotent: skip if a product with this slug already exists.
        $existing = get_page_by_path($slug, OBJECT, 'product');
        if ($existing) { $skipped++; $log[] = "skip (exists): $name"; continue; }

        $product = new WC_Product_Simple();
        $product->set_name($name);
        $product->set_status('publish');
        $product->set_catalog_visibility('visible');
        $product->set_description($get($row, 'Description'));
        $product->set_short_description($get($row, 'Short description'));
        $product->set_regular_price((string) $get($row, 'Regular price'));
        $product->set_featured(strtolower(trim($get($row, 'Is featured?'))) === '1' || strtolower(trim($get($row, 'Is featured?'))) === 'yes' || $get($row, 'Is featured?') == 1);
        $product->set_manage_stock(false);
        $product->set_stock_status('instock');
        $product->set_sku(trim($get($row, 'SKU')));

        // Category (create term if missing)
        $cat_name = trim($get($row, 'Categories'));
        if ($cat_name !== '') {
            $term = term_exists($cat_name, 'product_cat');
            if (!$term) $term = wp_insert_term($cat_name, 'product_cat');
            if (!is_wp_error($term)) $product->set_category_ids([(int) $term['term_id']]);
        }

        $product_id = $product->save();

        // Force the slug to match the storefront key (e.g. "reflet-lunaire")
        wp_update_post(['ID' => $product_id, 'post_name' => $slug]);

        // Meta: badge + rating (read by belorya_catalog())
        $badge = trim($get($row, 'Meta: _belorya_badge'));
        $rating = trim($get($row, 'Meta: _belorya_rating'));
        if ($badge !== '') update_post_meta($product_id, '_belorya_badge', $badge);
        if ($rating !== '') update_post_meta($product_id, '_belorya_rating', $rating);

        // Images: first = featured, rest = gallery. Sideload from the URLs.
        $images = array_filter(array_map('trim', explode(',', $get($row, 'Images'))));
        $gallery = [];
        $first = true;
        foreach ($images as $url) {
            $att_id = media_sideload_image($url, $product_id, $name, 'id');
            if (is_wp_error($att_id)) { $log[] = "  image failed: $url (" . $att_id->get_error_message() . ")"; continue; }
            if ($first) { set_post_thumbnail($product_id, $att_id); $first = false; }
            else { $gallery[] = $att_id; }
        }
        if ($gallery) {
            $p2 = wc_get_product($product_id);
            $p2->set_gallery_image_ids($gallery);
            $p2->save();
        }

        $created++;
        $log[] = "created: $name  (#$product_id, " . count($images) . " images)";
        echo end($log) . "\n";
        flush();
    }
    fclose($fh);

    delete_transient('belorya_catalog');

    echo "\n----------------------------------------\n";
    echo "DONE. Created: $created   Skipped: $skipped\n";
    echo "You can now delete belorya-import.php.\n";
    exit;
});
