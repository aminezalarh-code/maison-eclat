<?php
/**
 * BELORYA — record WhatsApp orders in WooCommerce.
 *
 * The storefront uses a client-side (localStorage) cart to preserve the exact
 * original UX. When the customer taps "Commander sur WhatsApp", belorya.js
 * POSTs the cart line items here; we create a real WooCommerce order
 * (status "on-hold") so it appears in WooCommerce → Orders, then the customer
 * finishes the conversation on WhatsApp.
 *
 * POST params:
 *   nonce   — wp_rest nonce
 *   items   — JSON array of { id: <product slug>, qty: <int>, variant: <string> }
 *   zone    — "casablanca" | "outside"
 *   promo   — coupon code to apply (optional)
 */
if (!defined('ABSPATH')) exit;

add_action('wp_ajax_belorya_wa_order', 'belorya_create_wa_order');
add_action('wp_ajax_nopriv_belorya_wa_order', 'belorya_create_wa_order');

function belorya_create_wa_order() {
    check_ajax_referer('wp_rest', 'nonce');

    if (!function_exists('wc_create_order')) {
        wp_send_json_error(['message' => 'woocommerce-missing']);
    }

    $items_raw = isset($_POST['items']) ? wp_unslash($_POST['items']) : '[]';
    $items = json_decode($items_raw, true);
    if (!is_array($items) || !count($items)) {
        wp_send_json_error(['message' => 'empty-cart']);
    }

    $zone = (isset($_POST['zone']) && $_POST['zone'] === 'outside') ? 'outside' : 'casablanca';
    $promo = isset($_POST['promo']) ? sanitize_text_field(wp_unslash($_POST['promo'])) : '';

    try {
        $order = wc_create_order();
        $added = 0;

        foreach ($items as $line) {
            $slug = isset($line['id']) ? sanitize_title($line['id']) : '';
            $qty  = isset($line['qty']) ? max(1, (int) $line['qty']) : 1;
            $variant = isset($line['variant']) ? sanitize_text_field($line['variant']) : '';
            if (!$slug) continue;

            $post = get_page_by_path($slug, OBJECT, 'product');
            if (!$post) continue;
            $product = wc_get_product($post->ID);
            if (!$product) continue;

            $item_args = [];
            if ($variant !== '') {
                $item_args['name'] = $product->get_name() . ' — ' . $variant;
            }
            $order->add_product($product, $qty, $item_args);
            $added++;
        }

        if (!$added) {
            wp_send_json_error(['message' => 'no-valid-products']);
        }

        if ($promo !== '') {
            $order->apply_coupon(strtoupper($promo));
        }

        $order->set_created_via('whatsapp');
        $order->add_order_note('Commande initiée via WhatsApp. Zone : ' . ($zone === 'outside' ? 'Hors Casablanca' : 'Casablanca'));
        $order->calculate_totals();
        $order->update_status('on-hold', 'En attente de confirmation WhatsApp. ');

        wp_send_json_success(['order_id' => $order->get_id(), 'total' => (float) $order->get_total()]);
    } catch (Exception $e) {
        wp_send_json_error(['message' => $e->getMessage()]);
    }
}
