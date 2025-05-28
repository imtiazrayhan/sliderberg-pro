/**
 * Posts Slider Frontend Enhancement
 * Add this to src/frontend/posts-slider.js in the pro plugin
 */

(function() {
    'use strict';
    
    /**
     * Initialize posts slider integration with main SliderBerg
     */
    function initPostsSliderIntegration() {
        // Wait for SliderBerg to be available
        if (typeof window.SliderBerg === 'undefined') {
            setTimeout(initPostsSliderIntegration, 100);
            return;
        }
        
        const postsSliders = document.querySelectorAll('.sliderberg-posts-slider-wrapper');
        
        postsSliders.forEach(slider => {
            if (slider.hasAttribute('data-integrated')) {
                return; // Already integrated
            }
            
            slider.setAttribute('data-integrated', 'true');
            
            // Get all post slides
            const postSlides = slider.querySelectorAll('.sliderberg-post-slide');
            
            if (postSlides.length <= 1) {
                return; // No need for integration with single slide
            }
            
            // Remove our internal slide management - let SliderBerg handle it
            postSlides.forEach((slide, index) => {
                // Remove inline styles that hide slides
                slide.style.display = '';
                
                // Add proper slider classes that SliderBerg expects
                if (!slide.classList.contains('sliderberg-slide')) {
                    slide.classList.add('sliderberg-slide');
                }
                
                // Set up proper flex layout for slide transitions
                slide.style.flex = '0 0 100%';
                slide.style.width = '100%';
                slide.style.minWidth = '100%';
            });
            
            // Make sure the container is set up for SliderBerg
            const container = slider.closest('.sliderberg-slides-container');
            if (container) {
                // Ensure it has the right display and transition properties
                container.style.display = 'flex';
                container.style.width = '100%';
                
                // Add data attributes for SliderBerg configuration
                const parentSlider = container.closest('.wp-block-sliderberg-sliderberg');
                if (parentSlider) {
                    // Copy transition settings from parent
                    const transitionEffect = parentSlider.querySelector('[data-transition-effect]')?.getAttribute('data-transition-effect') || 'slide';
                    const transitionDuration = parentSlider.querySelector('[data-transition-duration]')?.getAttribute('data-transition-duration') || '500';
                    const transitionEasing = parentSlider.querySelector('[data-transition-easing]')?.getAttribute('data-transition-easing') || 'ease';
                    
                    container.setAttribute('data-transition-effect', transitionEffect);
                    container.setAttribute('data-transition-duration', transitionDuration);
                    container.setAttribute('data-transition-easing', transitionEasing);
                }
            }
            
            // Enhanced accessibility for posts
            enhancePostsAccessibility(slider);
            
            // Add structured navigation
            addPostsNavigation(slider);
        });
        
        // Re-initialize SliderBerg to pick up the new slides
        if (window.SliderBerg && window.SliderBerg.init) {
            window.SliderBerg.init();
        }
    }
    
    /**
     * Enhance accessibility for posts slider
     */
    function enhancePostsAccessibility(slider) {
        const postSlides = slider.querySelectorAll('.sliderberg-post-slide');
        
        // Add ARIA labels and roles
        slider.setAttribute('role', 'region');
        slider.setAttribute('aria-label', 'Posts Slider');
        
        postSlides.forEach((slide, index) => {
            slide.setAttribute('role', 'group');
            slide.setAttribute('aria-roledescription', 'slide');
            slide.setAttribute('aria-label', `Post ${index + 1} of ${postSlides.length}`);
            
            // Enhance read more links
            const readMoreLink = slide.querySelector('.sliderberg-read-more');
            const titleElement = slide.querySelector('.sliderberg-post-title a, .sliderberg-post-title');
            
            if (readMoreLink && titleElement) {
                const titleText = titleElement.textContent.trim();
                readMoreLink.setAttribute('aria-label', `Read more about "${titleText}"`);
            }
        });
    }
    
    /**
     * Add posts-specific navigation enhancements
     */
    function addPostsNavigation(slider) {
        const parentSlider = slider.closest('.wp-block-sliderberg-sliderberg');
        if (!parentSlider) return;
        
        // Listen for slide changes from the main SliderBerg controller
        parentSlider.addEventListener('sliderberg.slidechange', function(event) {
            const detail = event.detail;
            if (detail && typeof detail.to !== 'undefined') {
                updatePostSlideContent(slider, detail.to);
            }
        });
        
        // Handle post-specific lazy loading
        setupPostLazyLoading(slider);
    }
    
    /**
     * Update post slide content when slides change
     */
    function updatePostSlideContent(slider, activeIndex) {
        const postSlides = slider.querySelectorAll('.sliderberg-post-slide');
        
        postSlides.forEach((slide, index) => {
            const isActive = index === activeIndex;
            
            // Update ARIA attributes
            slide.setAttribute('aria-hidden', isActive ? 'false' : 'true');
            
            // Load images for current and adjacent slides
            if (isActive || Math.abs(index - activeIndex) <= 1) {
                loadSlideImages(slide);
            }
        });
    }
    
    /**
     * Set up lazy loading for post images
     */
    function setupPostLazyLoading(slider) {
        const postSlides = slider.querySelectorAll('.sliderberg-post-slide');
        
        postSlides.forEach((slide, index) => {
            const images = slide.querySelectorAll('img');
            
            images.forEach(img => {
                // Skip first slide images (already loaded)
                if (index === 0) return;
                
                // Set up lazy loading
                if (img.src && !img.dataset.originalSrc) {
                    img.dataset.originalSrc = img.src;
                    img.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1 1"%3E%3C/svg%3E';
                    img.setAttribute('loading', 'lazy');
                }
            });
        });
    }
    
    /**
     * Load images in a specific slide
     */
    function loadSlideImages(slide) {
        const images = slide.querySelectorAll('img[data-original-src]');
        
        images.forEach(img => {
            if (img.dataset.originalSrc && img.src !== img.dataset.originalSrc) {
                img.src = img.dataset.originalSrc;
                img.removeAttribute('loading');
            }
        });
    }
    
    /**
     * Handle dynamic height adjustment for fade/zoom effects
     */
    function setupDynamicHeight() {
        const postsSliders = document.querySelectorAll('.sliderberg-posts-slider-wrapper');
        
        postsSliders.forEach(slider => {
            const container = slider.closest('.sliderberg-slides-container');
            if (!container) return;
            
            const transitionEffect = container.getAttribute('data-transition-effect');
            
            if (transitionEffect === 'fade' || transitionEffect === 'zoom') {
                // Set up height observation for fade/zoom effects
                const updateHeight = () => {
                    const visibleSlide = slider.querySelector('.sliderberg-post-slide[aria-hidden="false"]') ||
                                       slider.querySelector('.sliderberg-post-slide:first-child');
                    
                    if (visibleSlide) {
                        const slideHeight = visibleSlide.offsetHeight;
                        if (slideHeight > 0) {
                            container.style.height = slideHeight + 'px';
                        }
                    }
                };
                
                // Update on slide changes
                const parentSlider = container.closest('.wp-block-sliderberg-sliderberg');
                if (parentSlider) {
                    parentSlider.addEventListener('sliderberg.slidechange', updateHeight);
                }
                
                // Update on resize
                let resizeTimeout;
                window.addEventListener('resize', () => {
                    clearTimeout(resizeTimeout);
                    resizeTimeout = setTimeout(updateHeight, 150);
                });
                
                // Initial height
                setTimeout(updateHeight, 100);
            }
        });
    }
    
    /**
     * Initialize everything when DOM is ready
     */
    function init() {
        // Main integration
        initPostsSliderIntegration();
        
        // Dynamic height for fade/zoom
        setupDynamicHeight();
        
        // Watch for dynamically added content
        const observer = new MutationObserver((mutations) => {
            let shouldReinit = false;
            
            mutations.forEach(mutation => {
                mutation.addedNodes.forEach(node => {
                    if (node.nodeType === 1) {
                        if (node.classList?.contains('sliderberg-posts-slider-wrapper') ||
                            node.querySelector?.('.sliderberg-posts-slider-wrapper')) {
                            shouldReinit = true;
                        }
                    }
                });
            });
            
            if (shouldReinit) {
                setTimeout(initPostsSliderIntegration, 100);
            }
        });
        
        observer.observe(document.body, {
            childList: true,
            subtree: true
        });
    }
    
    // Initialize when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
    
    // Also try to initialize when SliderBerg script loads
    document.addEventListener('DOMContentLoaded', function() {
        // Check periodically for SliderBerg to be available
        let checkCount = 0;
        const checkForSliderBerg = setInterval(() => {
            checkCount++;
            if (window.SliderBerg || checkCount > 50) { // Stop after 5 seconds
                clearInterval(checkForSliderBerg);
                if (window.SliderBerg) {
                    setTimeout(init, 100);
                }
            }
        }, 100);
    });
    
    // Expose public API
    window.SliderbergPro = window.SliderbergPro || {};
    window.SliderbergPro.PostsSlider = {
        init: initPostsSliderIntegration,
        loadImages: loadSlideImages
    };
    
})();