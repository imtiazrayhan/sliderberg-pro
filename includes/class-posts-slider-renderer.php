<?php
/**
 * Posts Slider Frontend Renderer
 * Add this to includes/class-posts-slider-renderer.php in the pro plugin
 */

class Sliderberg_Pro_Posts_Slider_Renderer {
    
    /**
     * Initialize the renderer
     */
    public static function init() {
        add_action('init', [__CLASS__, 'register_block']);
        add_action('wp_enqueue_scripts', [__CLASS__, 'enqueue_frontend_assets']);
    }

    /**
     * Register the posts slider block
     */
    public static function register_block() {
        if (!function_exists('register_block_type')) {
            return;
        }

        register_block_type('sliderberg-pro/posts-slider', [
            'attributes' => [
                'postType' => [
                    'type' => 'string',
                    'default' => 'posts'
                ],
                'numberOfPosts' => [
                    'type' => 'number',
                    'default' => 5
                ],
                'order' => [
                    'type' => 'string',
                    'default' => 'desc'
                ],
                'showFeaturedImage' => [
                    'type' => 'boolean',
                    'default' => true
                ],
                'showTitle' => [
                    'type' => 'boolean',
                    'default' => true
                ],
                'showExcerpt' => [
                    'type' => 'boolean',
                    'default' => true
                ]
            ],
            'render_callback' => [__CLASS__, 'render_posts_slider']
        ]);
    }

    /**
     * Render the posts slider on the frontend
     */
    public static function render_posts_slider($attributes, $content, $block) {
        // Sanitize attributes
        $post_type = sanitize_text_field($attributes['postType'] ?? 'posts');
        $number_of_posts = absint($attributes['numberOfPosts'] ?? 5);
        $order = sanitize_text_field($attributes['order'] ?? 'desc');
        $show_featured_image = (bool) ($attributes['showFeaturedImage'] ?? true);
        $show_title = (bool) ($attributes['showTitle'] ?? true);
        $show_excerpt = (bool) ($attributes['showExcerpt'] ?? true);

        // Validate post type
        if (!post_type_exists($post_type)) {
            $post_type = 'post';
        }

        // Validate order
        if (!in_array($order, ['asc', 'desc', 'title'])) {
            $order = 'desc';
        }

        // Set up query arguments
        $query_args = [
            'post_type' => $post_type,
            'posts_per_page' => min($number_of_posts, 20), // Limit to 20 for performance
            'post_status' => 'publish',
            'no_found_rows' => true, // Performance optimization
            'update_post_meta_cache' => false, // Performance optimization
        ];

        // Set ordering
        if ($order === 'title') {
            $query_args['orderby'] = 'title';
            $query_args['order'] = 'ASC';
        } else {
            $query_args['orderby'] = 'date';
            $query_args['order'] = strtoupper($order);
        }

        // Execute query
        $posts_query = new WP_Query($query_args);

        if (!$posts_query->have_posts()) {
            return '<div class="sliderberg-posts-slider-empty">' . 
                   esc_html__('No posts found.', 'sliderberg-pro') . 
                   '</div>';
        }

        // Add structured data for SEO
        ob_start();
        self::add_structured_data($posts_query, $attributes);
        $structured_data = ob_get_clean();

        ob_start();
        ?>
        <div class="sliderberg-posts-slider-wrapper sliderberg-slides-container" 
             data-post-type="<?php echo esc_attr($post_type); ?>"
             data-number-of-posts="<?php echo esc_attr($number_of_posts); ?>"
             data-order="<?php echo esc_attr($order); ?>"
             data-show-featured-image="<?php echo esc_attr($show_featured_image ? 'true' : 'false'); ?>"
             data-show-title="<?php echo esc_attr($show_title ? 'true' : 'false'); ?>"
             data-show-excerpt="<?php echo esc_attr($show_excerpt ? 'true' : 'false'); ?>"
             role="region"
             aria-label="<?php esc_attr_e('Posts Slider', 'sliderberg-pro'); ?>">
            
            <?php 
            $slide_index = 0;
            while ($posts_query->have_posts()) : 
                $posts_query->the_post();
                $post_id = get_the_ID();
                $post_url = get_permalink();
                $post_title = get_the_title();
                ?>
                <div class="sliderberg-slide sliderberg-post-slide" 
                     data-slide-index="<?php echo esc_attr($slide_index); ?>"
                     role="group"
                     aria-roledescription="slide"
                     aria-label="<?php echo esc_attr(sprintf(__('%d of %d', 'sliderberg-pro'), $slide_index + 1, $posts_query->found_posts)); ?>">
                    
                    <div class="sliderberg-slide-content sliderberg-post-content">
                        
                        <?php if ($show_featured_image && has_post_thumbnail($post_id)) : ?>
                            <div class="sliderberg-post-image">
                                <a href="<?php echo esc_url($post_url); ?>" 
                                   title="<?php echo esc_attr($post_title); ?>"
                                   aria-label="<?php echo esc_attr(sprintf(__('View %s', 'sliderberg-pro'), $post_title)); ?>">
                                    <?php 
                                    echo get_the_post_thumbnail($post_id, 'large', [
                                        'alt' => esc_attr($post_title),
                                        'loading' => $slide_index === 0 ? 'eager' : 'lazy'
                                    ]); 
                                    ?>
                                </a>
                            </div>
                        <?php endif; ?>
                        
                        <?php if ($show_title) : ?>
                            <h3 class="sliderberg-post-title">
                                <a href="<?php echo esc_url($post_url); ?>" 
                                   title="<?php echo esc_attr($post_title); ?>">
                                    <?php echo esc_html($post_title); ?>
                                </a>
                            </h3>
                        <?php endif; ?>
                        
                        <?php if ($show_excerpt) : ?>
                            <div class="sliderberg-post-excerpt">
                                <?php 
                                // Use manual excerpt if available, otherwise generate one
                                $excerpt = get_the_excerpt();
                                if (empty($excerpt)) {
                                    $excerpt = wp_trim_words(strip_shortcodes(get_the_content()), 30, '...');
                                }
                                echo wp_kses_post($excerpt);
                                ?>
                            </div>
                        <?php endif; ?>
                        
                        <div class="sliderberg-post-meta">
                            <span class="sliderberg-post-date" aria-label="<?php esc_attr_e('Published on', 'sliderberg-pro'); ?>">
                                <time datetime="<?php echo esc_attr(get_the_date('c')); ?>">
                                    <?php echo esc_html(get_the_date()); ?>
                                </time>
                            </span>
                            
                            <a href="<?php echo esc_url($post_url); ?>" 
                               class="sliderberg-read-more"
                               aria-label="<?php echo esc_attr(sprintf(__('Read more about %s', 'sliderberg-pro'), $post_title)); ?>">
                                <?php esc_html_e('Read More', 'sliderberg-pro'); ?>
                                <span class="screen-reader-text"> <?php echo esc_html(sprintf(__('about %s', 'sliderberg-pro'), $post_title)); ?></span>
                            </a>
                        </div>
                        
                    </div>
                </div>
                <?php 
                $slide_index++;
            endwhile; 
            wp_reset_postdata();
            ?>
        </div>
        <?php
        
        $output = ob_get_clean();
        
        return $structured_data . $output;
    }

    /**
     * Enqueue frontend assets
     */
    public static function enqueue_frontend_assets() {
        // Only enqueue if we have posts slider blocks on the page
        if (has_block('sliderberg-pro/posts-slider')) {
            wp_enqueue_style(
                'sliderberg-pro-posts-slider-frontend',
                SLIDERBERG_PRO_URL . 'build/posts-slider-frontend.css',
                [],
                SLIDERBERG_PRO_VERSION
            );
            
            wp_enqueue_script(
                'sliderberg-pro-posts-slider-frontend',
                SLIDERBERG_PRO_URL . 'build/posts-slider-frontend.js',
                [],
                SLIDERBERG_PRO_VERSION,
                true
            );
        }
    }

    /**
     * Add structured data for SEO
     */
    public static function add_structured_data($posts_query, $attributes) {
        if (empty($posts_query->posts)) {
            return;
        }

        $structured_data = [
            '@context' => 'https://schema.org',
            '@type' => 'ItemList',
            'itemListElement' => []
        ];

        $position = 1;
        foreach ($posts_query->posts as $post) {
            $structured_data['itemListElement'][] = [
                '@type' => 'ListItem',
                'position' => $position,
                'item' => [
                    '@type' => 'Article',
                    'headline' => get_the_title($post->ID),
                    'url' => get_permalink($post->ID),
                    'datePublished' => get_the_date('c', $post->ID),
                    'dateModified' => get_the_modified_date('c', $post->ID),
                    'author' => [
                        '@type' => 'Person',
                        'name' => get_the_author_meta('display_name', $post->post_author)
                    ]
                ]
            ];
            $position++;
        }

        echo '<script type="application/ld+json">' . wp_json_encode($structured_data) . '</script>';
    }
}

// Initialize the renderer
Sliderberg_Pro_Posts_Slider_Renderer::init();