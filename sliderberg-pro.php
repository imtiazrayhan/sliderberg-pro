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
    require_once SLIDERBERG_PRO_PATH . 'includes/class-posts-slider-renderer.php';

    // Initialize the plugin
    $pro = Sliderberg_Pro::instance();

    // Register hooks
    add_action('init', [$pro, 'register_hooks']);
    add_action('admin_enqueue_scripts', [$pro, 'enqueue_admin_assets']);
}
add_action('plugins_loaded', 'sliderberg_pro_init');

// Register scripts and styles
function sliderberg_pro_register_assets() {
    // Register admin script
    wp_register_script(
        'sliderberg-pro-admin',
        SLIDERBERG_PRO_URL . 'build/admin.js',
        array('wp-blocks', 'wp-element', 'wp-editor', 'wp-components', 'wp-i18n'),
        SLIDERBERG_PRO_VERSION,
        true
    );

    // Register block script
    wp_register_script(
        'sliderberg-pro-blocks',
        SLIDERBERG_PRO_URL . 'build/blocks/posts-slider.js',
        array('wp-blocks', 'wp-element', 'wp-editor', 'wp-components', 'wp-i18n'),
        SLIDERBERG_PRO_VERSION,
        true
    );

    // Register editor styles
    wp_register_style(
        'sliderberg-pro-editor',
        SLIDERBERG_PRO_URL . 'build/index.css',
        array(),
        SLIDERBERG_PRO_VERSION
    );

    // Register frontend styles
    wp_register_style(
        'sliderberg-pro-frontend',
        SLIDERBERG_PRO_URL . 'build/style-index.css',
        array(),
        SLIDERBERG_PRO_VERSION
    );

    // Register posts slider frontend styles - this will be compiled by webpack alongside JS
    wp_register_style(
        'sliderberg-pro-posts-slider-frontend',
        SLIDERBERG_PRO_URL . 'build/posts-slider-frontend.css',
        array(),
        SLIDERBERG_PRO_VERSION
    );

    // Register posts slider frontend script
    wp_register_script(
        'sliderberg-pro-posts-slider-frontend',
        SLIDERBERG_PRO_URL . 'build/posts-slider-frontend.js',
        array(),
        SLIDERBERG_PRO_VERSION,
        true
    );
}
add_action('init', 'sliderberg_pro_register_assets');

// Enqueue editor assets
function sliderberg_pro_editor_assets() {
    wp_enqueue_script('sliderberg-pro-admin');
    wp_enqueue_script('sliderberg-pro-blocks');
    wp_enqueue_style('sliderberg-pro-editor');
}
add_action('enqueue_block_editor_assets', 'sliderberg_pro_editor_assets');

// Enqueue frontend assets
function sliderberg_pro_frontend_assets() {
    // Only enqueue base frontend styles if we have any sliderberg blocks
    if (has_block('sliderberg/sliderberg') || has_block('sliderberg-pro/posts-slider')) {
        wp_enqueue_style('sliderberg-pro-frontend');
    }
}
add_action('wp_enqueue_scripts', 'sliderberg_pro_frontend_assets');

/**
 * Check if Sliderberg base plugin is active
 */
function sliderberg_pro_check_dependencies() {
    if (!is_plugin_active('sliderberg/sliderberg.php') && !function_exists('sliderberg_init')) {
        add_action('admin_notices', 'sliderberg_pro_dependency_notice');
        deactivate_plugins(plugin_basename(__FILE__));
    }
}
add_action('admin_init', 'sliderberg_pro_check_dependencies');

/**
 * Show dependency notice
 */
function sliderberg_pro_dependency_notice() {
    ?>
    <div class="notice notice-error">
        <p>
            <?php 
            echo sprintf(
                esc_html__('Sliderberg Pro requires the %sSliderberg base plugin%s to be installed and activated.', 'sliderberg-pro'),
                '<strong>',
                '</strong>'
            ); 
            ?>
        </p>
    </div>
    <?php
}