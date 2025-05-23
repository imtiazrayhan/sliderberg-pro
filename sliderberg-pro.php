<?php
/**
 * Plugin Name: Sliderberg Pro
 * Plugin URI: https://sliderberg.com/pro
 * Description: Pro features for Sliderberg - The Ultimate WordPress Slider Builder
 * Version: 1.0.0
 * Author: Sliderberg
 * Author URI: https://sliderberg.com
 * Text Domain: sliderberg-pro
 * Domain Path: /languages
 * Requires at least: 5.8
 * Requires PHP: 7.4
 * License: GPL v2 or later
 * License URI: https://www.gnu.org/licenses/gpl-2.0.html
 */

// Exit if accessed directly
if (!defined('ABSPATH')) {
    exit;
}

// Define plugin constants
define('SLIDERBERG_PRO_VERSION', '1.0.0');
define('SLIDERBERG_PRO_FILE', __FILE__);
define('SLIDERBERG_PRO_PATH', plugin_dir_path(__FILE__));
define('SLIDERBERG_PRO_URL', plugin_dir_url(__FILE__));

// Initialize the plugin
function sliderberg_pro_init() {
    // Load text domain
    load_plugin_textdomain('sliderberg-pro', false, dirname(plugin_basename(__FILE__)) . '/languages');

    // Include required files
    require_once SLIDERBERG_PRO_PATH . 'includes/class-sliderberg-pro.php';

    // Initialize the plugin
    $pro = Sliderberg_Pro::instance();

    // Register hooks
    add_action('init', [$pro, 'register_hooks']);
    add_action('admin_enqueue_scripts', [$pro, 'enqueue_admin_assets']);
}
add_action('plugins_loaded', 'sliderberg_pro_init'); 