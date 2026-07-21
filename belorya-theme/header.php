<?php
/**
 * Header — announcement bar + navbar + mobile menu.
 * Same markup/classes as the original static site so the CSS applies 1:1.
 */
if (!defined('ABSPATH')) exit;
$s = belorya_settings();
$logo = get_template_directory_uri() . '/assets/logo.png';
$home = home_url('/');
$shop = function_exists('wc_get_page_permalink') ? wc_get_page_permalink('shop') : $home;
$ic_wa = '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 2a10 10 0 0 0-8.6 15l-1.3 4.7 4.8-1.3A10 10 0 1 0 12 2Zm5.8 14.2c-.2.7-1.4 1.3-2 1.4-.5.1-1.2.1-1.9-.1-.4-.1-1-.3-1.8-.6-3-1.3-5-4.4-5.2-4.6-.1-.2-1.2-1.6-1.2-3s.7-2.1 1-2.4c.2-.3.5-.4.7-.4h.5c.2 0 .4 0 .6.5l.8 2c.1.2.1.4 0 .5l-.4.5-.3.3c-.1.2-.3.3-.1.6.1.3.7 1.1 1.4 1.8.9.8 1.7 1 2 1.2.2.1.4.1.5-.1l.7-.8c.2-.2.3-.2.6-.1l1.9.9c.3.1.5.2.5.4.1.1.1.8-.1 1.4Z"/></svg>';
$ic_cart = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.4"><path d="M6 7h12l-1 12.5a1.5 1.5 0 0 1-1.5 1.4H8.5A1.5 1.5 0 0 1 7 19.5L6 7Z"/><path d="M9 7a3 3 0 0 1 6 0"/></svg>';
$ic_check = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><path d="M5 13l4 4L19 7"/></svg>';
$brand = '<img class="brand__logo %s" src="' . esc_url($logo) . '" alt="Belorya - Eternal Shine">';
$nav = [
    ['href' => $home, 'key' => 'nav_home', 'label' => 'Accueil'],
    ['href' => $shop, 'key' => 'nav_collections', 'label' => 'Collection'],
    ['href' => add_query_arg('cat', 'best', $shop), 'key' => 'nav_best', 'label' => 'Meilleures ventes'],
    ['href' => $home . '#about', 'key' => 'nav_about', 'label' => 'À propos'],
    ['href' => $home . '#contact', 'key' => 'nav_contact', 'label' => 'Contact'],
];
$lang_switch = '<div class="lang-switch %s" role="group" aria-label="Language">'
    . '<button class="lang-opt" data-lang="fr">FR</button><span class="lang-sep">/</span>'
    . '<button class="lang-opt" data-lang="en">EN</button><span class="lang-sep">/</span>'
    . '<button class="lang-opt" data-lang="ar">ع</button></div>';
?><!DOCTYPE html>
<html <?php language_attributes(); ?>>
<head>
  <meta charset="<?php bloginfo('charset'); ?>" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <?php wp_head(); ?>
</head>
<body <?php body_class(); ?>>
<?php wp_body_open(); ?>

<div class="announce" id="announce">
  <div class="wrap announce__in">
    <span class="announce__msg announce__msg--full" data-i18n-html="announce_text"></span>
    <span class="announce__msg announce__msg--short" data-i18n-html="announce_short"></span>
    <button class="announce__copy" id="announceCopy" type="button" data-code="<?php echo esc_attr($s['promo_code']); ?>"><?php echo $ic_check; ?><span data-i18n="announce_copy">Copier le code</span></button>
  </div>
</div>

<header class="site-header solid" id="header">
  <div class="wrap nav">
    <a class="brand" href="<?php echo esc_url($home); ?>" aria-label="Belorya home"><?php printf($brand, ''); ?></a>
    <ul class="nav__menu">
      <?php foreach ($nav as $l): ?>
        <li><a class="nav__link" href="<?php echo esc_url($l['href']); ?>" data-i18n="<?php echo esc_attr($l['key']); ?>"><?php echo esc_html($l['label']); ?></a></li>
      <?php endforeach; ?>
    </ul>
    <div class="nav__right">
      <?php printf($lang_switch, ''); ?>
      <a class="nav__cta" href="<?php echo esc_url(belorya_wa_url()); ?>" target="_blank" rel="noopener"><?php echo $ic_wa; ?><span data-i18n="nav_whatsapp">WhatsApp</span></a>
      <button class="icon-btn" id="cartOpen" aria-label="Open cart"><?php echo $ic_cart; ?><span class="cart-count" id="cartCount"><?php echo (function_exists('WC') && WC()->cart) ? esc_html(WC()->cart->get_cart_contents_count()) : '0'; ?></span></button>
      <button class="nav__toggle" aria-label="Open menu" id="navToggle"><span></span></button>
    </div>
  </div>
</header>

<nav class="mobile-menu" id="mobileMenu" aria-hidden="true">
  <ul>
    <?php foreach ($nav as $i => $l): ?>
      <li><a href="<?php echo esc_url($l['href']); ?>" data-i18n="<?php echo esc_attr($l['key']); ?>" style="animation-delay:<?php echo 0.06 * $i; ?>s"><?php echo esc_html($l['label']); ?></a></li>
    <?php endforeach; ?>
  </ul>
  <div style="position:absolute;top:1.6rem;left:var(--gut)"><a class="brand" href="<?php echo esc_url($home); ?>"><?php printf($brand, 'mobile-mark'); ?></a></div>
  <div class="mobile-menu__foot">
    <?php printf($lang_switch, 'lang-switch--menu'); ?>
    <a class="footer__wa" href="<?php echo esc_url(belorya_wa_url()); ?>" target="_blank" rel="noopener"><?php echo $ic_wa; ?> <span data-i18n="cart_wa">Commander sur WhatsApp</span></a>
  </div>
</nav>
