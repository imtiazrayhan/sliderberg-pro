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
        // Add pro slider types
        add_filter('sliderberg_slider_types', [$this, 'add_pro_slider_types']);
        
        // Handle type selection
        add_filter('sliderberg_type_selected', [$this, 'handle_type_selection'], 10, 2);
        
        // Customize type card rendering
        add_filter('sliderberg_type_card', [$this, 'customize_type_card'], 10, 2);

        // Add debug log
        error_log('Sliderberg Pro: Hooks registered');
    }

    /**
     * Add pro slider types
     */
    public function add_pro_slider_types($types) {
        error_log('Sliderberg Pro: Adding pro types');
        error_log('Current types: ' . print_r($types, true));

        $pro_types = [
            [
                'id' => 'woo-products',
                'label' => __('WooCommerce Products Slider', 'sliderberg-pro'),
                'icon' => 'products',
                'isPro' => true
            ],
            [
                'id' => 'posts-slider',
                'label' => __('Posts Slider', 'sliderberg-pro'),
                'icon' => 'posts',
                'isPro' => true
            ]
        ];

        $new_types = array_merge($types, $pro_types);
        error_log('New types: ' . print_r($new_types, true));
        return array_merge($types, $pro_types);
    }

    /**
     * Handle pro type selection
     */
    public function handle_pro_type_selection($shouldProceed, $typeId, $type) {
        return $shouldProceed;
    }

    /**
     * Customize pro type card
     */
    public function customize_pro_type_card($content, $type) {
        return $content;
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