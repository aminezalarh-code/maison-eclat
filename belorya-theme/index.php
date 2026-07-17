<?php
/** Fallback template. */
if (!defined('ABSPATH')) exit;
get_header();
echo '<main class="belorya-main"><section class="page-hero"><div class="wrap">';
if (have_posts()) { while (have_posts()) { the_post(); echo '<h1>' . get_the_title() . '</h1>'; the_content(); } }
echo '</div></section></main>';
get_footer();
