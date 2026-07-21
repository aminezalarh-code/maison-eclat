<?php
/** Footer — shipping band, columns, socials. Same classes as the live site. */
if (!defined('ABSPATH')) exit;
$s = belorya_settings();
$home = home_url('/');
$shop = function_exists('wc_get_page_permalink') ? wc_get_page_permalink('shop') : $home;
$brand = '<img class="brand__logo footer-mark" src="' . esc_url(get_template_directory_uri() . '/assets/logo.png') . '" alt="Belorya">';
$ic = [
  'ig' => '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.4"><rect x="3" y="3" width="18" height="18" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none"/></svg>',
  'fb' => '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M14 8.5V7c0-.7.3-1 1-1h1.5V3H14c-2.2 0-3.5 1.3-3.5 3.6V8.5H8.5V12h2V21h3.5v-9h2.4l.6-3.5H14Z"/></svg>',
  'tk' => '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M16 3c.3 2.3 1.6 3.7 3.8 3.9v2.6c-1.3.1-2.5-.3-3.8-1v5.8c0 3.6-2.8 6-6 5.6-2.6-.3-4.4-2.4-4.3-5 .1-2.7 2.5-4.7 5.2-4.4v2.7c-.4-.1-.8-.2-1.2-.1-1.1.1-1.9 1-1.8 2.1.1 1 1 1.9 2.1 1.8 1.2-.1 1.9-1 1.9-2.3V3H16Z"/></svg>',
  'wa' => '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 2a10 10 0 0 0-8.6 15l-1.3 4.7 4.8-1.3A10 10 0 1 0 12 2Zm5.8 14.2c-.2.7-1.4 1.3-2 1.4-.5.1-1.2.1-1.9-.1-.4-.1-1-.3-1.8-.6-3-1.3-5-4.4-5.2-4.6-.1-.2-1.2-1.6-1.2-3s.7-2.1 1-2.4c.2-.3.5-.4.7-.4h.5c.2 0 .4 0 .6.5l.8 2c.1.2.1.4 0 .5l-.4.5-.3.3c-.1.2-.3.3-.1.6.1.3.7 1.1 1.4 1.8.9.8 1.7 1 2 1.2.2.1.4.1.5-.1l.7-.8c.2-.2.3-.2.6-.1l1.9.9c.3.1.5.2.5.4.1.1.1.8-.1 1.4Z"/></svg>',
  'truck' => '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.4"><path d="M3 7h11v8H3zM14 10h4l3 3v2h-7"/><circle cx="7" cy="18" r="1.6"/><circle cx="17.5" cy="18" r="1.6"/></svg>',
  'coins' => '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.4"><ellipse cx="12" cy="6" rx="7" ry="3"/><path d="M5 6v6c0 1.7 3.1 3 7 3s7-1.3 7-3V6"/><path d="M5 12v6c0 1.7 3.1 3 7 3s7-1.3 7-3v-6"/></svg>',
  'shield' => '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.4"><path d="M12 3l7 3v5c0 4.5-3 8-7 10-4-2-7-5.5-7-10V6l7-3Z"/><path d="M9 12l2 2 4-4"/></svg>',
];
?>
<footer class="site-footer" id="contact">
  <div class="wrap">
    <div class="footer__ship">
      <div><span class="footer__ship-ic"><?php echo $ic['truck']; ?></span><span data-i18n="trust_free_casa">Livraison gratuite à Casablanca</span></div>
      <div><span class="footer__ship-ic"><?php echo $ic['coins']; ?></span><span data-i18n="trust_free_250">Livraison offerte dès 250 MAD</span></div>
      <div><span class="footer__ship-ic"><?php echo $ic['wa']; ?></span><span data-i18n="trust_cod">Paiement à la livraison</span></div>
      <div><span class="footer__ship-ic"><?php echo $ic['shield']; ?></span><span data-i18n="trust_steel">Acier inoxydable</span></div>
    </div>
    <div class="footer__top">
      <div class="footer__brand">
        <a class="brand" href="<?php echo esc_url($home); ?>"><?php echo $brand; ?></a>
        <p data-i18n="footer_desc">Bijoux en acier inoxydable, pensés en atelier pour être portés chaque jour. Un luxe accessible, fait pour durer.</p>
        <div class="footer__socials">
          <a href="<?php echo esc_url($s['instagram']); ?>" target="_blank" rel="noopener" aria-label="Instagram"><?php echo $ic['ig']; ?></a>
          <a href="<?php echo esc_url($s['facebook']); ?>" target="_blank" rel="noopener" aria-label="Facebook"><?php echo $ic['fb']; ?></a>
          <a href="<?php echo esc_url($s['tiktok']); ?>" target="_blank" rel="noopener" aria-label="TikTok"><?php echo $ic['tk']; ?></a>
          <a href="<?php echo esc_url(belorya_wa_url()); ?>" target="_blank" rel="noopener" aria-label="WhatsApp"><?php echo $ic['wa']; ?></a>
        </div>
      </div>
      <div class="footer__col">
        <h5 data-i18n="footer_collections">Collection</h5>
        <ul>
          <li><a href="<?php echo esc_url($shop); ?>" data-i18n="footer_l_necklaces">Colliers</a></li>
          <li><a href="<?php echo esc_url($shop); ?>" data-i18n="footer_l_sets">Parures</a></li>
          <li><a href="<?php echo esc_url($shop); ?>" data-i18n="footer_l_earrings">Boucles d'oreilles</a></li>
          <li><a href="<?php echo esc_url(add_query_arg('cat', 'best', $shop)); ?>" data-i18n="footer_l_best">Meilleures ventes</a></li>
          <li><a href="<?php echo esc_url($shop); ?>" data-i18n="footer_l_new">Nouveautés</a></li>
        </ul>
      </div>
      <div class="footer__col">
        <h5 data-i18n="footer_maison">La Maison</h5>
        <ul>
          <li><a href="<?php echo esc_url($home . '#about'); ?>" data-i18n="footer_l_story">Notre histoire</a></li>
          <li><a href="<?php echo esc_url($home . '#material'); ?>" data-i18n="footer_l_materials">Nos matières</a></li>
          <li><a href="<?php echo esc_url(add_query_arg('cat', 'best', $shop)); ?>" data-i18n="footer_l_best">Meilleures ventes</a></li>
          <li><a href="<?php echo esc_url($home . '#newsletter'); ?>" data-i18n="footer_l_private">Liste privée</a></li>
        </ul>
      </div>
      <div class="footer__col">
        <h5 data-i18n="footer_contact">Contact</h5>
        <ul>
          <li data-i18n="footer_city">Casablanca, Maroc</li>
          <li><a href="mailto:<?php echo esc_attr($s['email']); ?>"><?php echo esc_html($s['email']); ?></a></li>
          <li><a href="<?php echo esc_url(belorya_wa_url()); ?>" target="_blank" rel="noopener">+<?php echo esc_html(preg_replace('/[^0-9]/', '', $s['whatsapp'])); ?></a></li>
        </ul>
        <a class="footer__wa" href="<?php echo esc_url(belorya_wa_url()); ?>" target="_blank" rel="noopener"><?php echo $ic['wa']; ?> <span data-i18n="cart_wa">Commander sur WhatsApp</span></a>
      </div>
    </div>
    <div class="footer__bottom">
      <p>© <?php echo esc_html(date('Y')); ?> Belorya. <span data-i18n="footer_rights">Tous droits réservés.</span></p>
      <div class="footer__pay"><span data-i18n="trust_cod">Paiement à la livraison</span><span>WhatsApp</span></div>
      <p><a href="#" data-i18n="footer_privacy">Confidentialité</a> · <a href="#" data-i18n="footer_terms">Conditions</a></p>
    </div>
  </div>
</footer>

<?php wp_footer(); ?>
</body>
</html>
