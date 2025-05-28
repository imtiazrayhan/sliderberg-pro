<?php
/**
 * Main plugin class
 */
class Sliderberg_Pro {
    /**
     * Instance of this class
     */
    private static $instance = null;

    /**
     * Get the instance of this class
     */
    public static function instance() {
        if (null === self::$instance) {
            self::$instance = new self();
        }
        return self::$instance;
    }

    /**
     * Constructor
     */
    private function __construct() {
        // Initialize hooks
        $this->register_hooks();
    }

    /**
     * Register WordPress hooks
     */
    public function register_hooks() {
        // Add debug log
        error_log('Sliderberg Pro: Hooks registered');
    }

    /**
     * Enqueue admin assets
     */
    public function enqueue_admin_assets() {
        // Only enqueue in block editor
        if (!function_exists('get_current_screen')) {
            return;
        }

        $screen = get_current_screen();
        if (!$screen || !in_array($screen->id, ['post', 'post-new'])) {
            return;
        }

        // Enqueue admin styles
        wp_enqueue_style(
            'sliderberg-pro-admin',
            SLIDERBERG_PRO_URL . 'build/admin.css',
            [],
            SLIDERBERG_PRO_VERSION
        );

        // Enqueue admin script
        wp_enqueue_script(
            'sliderberg-pro-admin',
            SLIDERBERG_PRO_URL . 'build/admin.js',
            ['wp-element', 'wp-components', 'wp-i18n', 'wp-hooks'],
            SLIDERBERG_PRO_VERSION,
            true
        );
    }
} 