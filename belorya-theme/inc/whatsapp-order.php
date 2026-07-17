<?php
/**
 * BELORYA — record WhatsApp orders in WooCommerce.
 * When the customer taps "Commander sur WhatsApp", the JS posts the cart
 * here; we create a real WooCommerce order (status "on-hold") from the
 * current cart so it appears in WooCommerce → Orders, then the customer
 * finishes the conversation on WhatsApp.
 */
if (!defined('ABSPATH')) exit;

add_action('wp_ajax_belorya_wa_order', 'belorya_create_wa_order');
add_action('wp_ajax_nopriv_belorya_wa_order', 'belorya_create_wa_order');

function belorya_create_wa_order() {
    check_ajax_referer('wp_rest', 'nonce');
    if (!function_exists('WC') || !WC()->cart || WC()->cart->is_empty()) {
        wp_send_json_error(['message' => 'empty-cart']);
    }

    $zone = isset($_POST['zone']) && $_POST['zone'] === 'outside' ? 'outside' : 'casablanca';

    try {
        $order = wc_create_order();
        foreach (WC()->cart->get_cart() as $item) {
            $product = $item['data'];
            $order->add_product($product, $item['quantity']);
        }
        // Carry the cart's applied coupon(s)
        foreach (WC()->cart->get_applied_coupons() as $code) {
            $order->apply_coupon($code);
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
