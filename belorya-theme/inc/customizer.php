<?php
/**
 * BELORYA — Customizer settings (Apparence → Personnaliser → BELORYA).
 * Brand contact, shipping rules, and marketing pixels — no code needed.
 */
if (!defined('ABSPATH')) exit;

add_action('customize_register', function ($wp) {

    $wp->add_panel('belorya_panel', [
        'title'    => 'BELORYA',
        'priority' => 20,
    ]);

    /* ---- Contact & réseaux sociaux ---- */
    $wp->add_section('belorya_contact', ['title' => 'Contact & réseaux', 'panel' => 'belorya_panel']);
    $fields = [
        'belorya_whatsapp'  => ['WhatsApp (indicatif + numéro, sans +)', '212660323891'],
        'belorya_instagram' => ['Instagram (URL)', 'https://www.instagram.com/belorya_/'],
        'belorya_facebook'  => ['Facebook (URL)', 'https://www.facebook.com/profile.php?id=61591102114678'],
        'belorya_tiktok'    => ['TikTok (URL)', 'https://www.tiktok.com/@belorya5'],
        'belorya_email'     => ['E-mail', 'belorya1@gmail.com'],
    ];
    foreach ($fields as $id => $f) {
        $wp->add_setting($id, ['default' => $f[1], 'sanitize_callback' => 'wp_kses_post']);
        $wp->add_control($id, ['label' => $f[0], 'section' => 'belorya_contact', 'type' => 'text']);
    }

    /* ---- Livraison ---- */
    $wp->add_section('belorya_shipping', ['title' => 'Livraison', 'panel' => 'belorya_panel']);
    $wp->add_setting('belorya_ship_casa_free', ['default' => true, 'sanitize_callback' => 'wp_validate_boolean']);
    $wp->add_control('belorya_ship_casa_free', ['label' => 'Livraison gratuite à Casablanca', 'section' => 'belorya_shipping', 'type' => 'checkbox']);
    $wp->add_setting('belorya_ship_fee', ['default' => 35, 'sanitize_callback' => 'absint']);
    $wp->add_control('belorya_ship_fee', ['label' => 'Frais hors Casablanca (MAD)', 'section' => 'belorya_shipping', 'type' => 'number']);
    $wp->add_setting('belorya_ship_threshold', ['default' => 250, 'sanitize_callback' => 'absint']);
    $wp->add_control('belorya_ship_threshold', ['label' => 'Seuil livraison offerte (MAD)', 'section' => 'belorya_shipping', 'type' => 'number']);
    $wp->add_setting('belorya_ship_eta', ['default' => '2–4 jours ouvrables', 'sanitize_callback' => 'sanitize_text_field']);
    $wp->add_control('belorya_ship_eta', ['label' => 'Délai estimé', 'section' => 'belorya_shipping', 'type' => 'text']);

    /* ---- Marketing ---- */
    $wp->add_section('belorya_marketing', ['title' => 'Marketing (Pixel / Analytics)', 'panel' => 'belorya_panel']);
    $wp->add_setting('belorya_meta_pixel', ['default' => '1061131383114577', 'sanitize_callback' => 'sanitize_text_field']);
    $wp->add_control('belorya_meta_pixel', ['label' => 'Meta Pixel (ID)', 'section' => 'belorya_marketing', 'type' => 'text']);
    $wp->add_setting('belorya_ga_id', ['default' => '', 'sanitize_callback' => 'sanitize_text_field']);
    $wp->add_control('belorya_ga_id', ['label' => 'Google Analytics (ID G-XXXX)', 'section' => 'belorya_marketing', 'type' => 'text']);

    /* ---- Offre de lancement ---- */
    $wp->add_section('belorya_offer', ['title' => 'Offre de lancement', 'panel' => 'belorya_panel']);
    $wp->add_setting('belorya_promo_code', ['default' => 'BELORYA10', 'sanitize_callback' => 'sanitize_text_field']);
    $wp->add_control('belorya_promo_code', ['label' => 'Code affiché dans le bandeau', 'section' => 'belorya_offer', 'type' => 'text']);
});
