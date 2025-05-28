// src/blocks/posts-slider/index.tsx
import { registerBlockType } from '@wordpress/blocks';
import { __ } from '@wordpress/i18n';
import { InspectorControls } from '@wordpress/block-editor';
import { useBlockProps } from '@wordpress/block-editor';
import { PostsSlider } from '../../components/sliders/PostsSlider';
import { PostsSliderSettings } from './settings';
import type { BlockEditProps, BlockConfiguration } from '@wordpress/blocks';
import { useEffect } from 'react';

declare global {
    interface Window {
        updateSliderbergSlidesVisibility?: () => void;
    }
}

interface PostsSliderAttributes {
    postType: string;
    numberOfPosts: number;
    order: string;
    showFeaturedImage: boolean;
    showTitle: boolean;
    showExcerpt: boolean;
}

type BlockAttributes = {
    [K in keyof PostsSliderAttributes]: {
        type: 'string' | 'number' | 'boolean';
        default: PostsSliderAttributes[K];
    };
};

const blockConfig: BlockConfiguration<PostsSliderAttributes> = {
    title: __('Posts Slider', 'sliderberg-pro'),
    description: __('Create a slider with your posts', 'sliderberg-pro'),
    category: 'sliderberg',
    icon: 'admin-post',
    parent: ['sliderberg/sliderberg'], // This ensures it can only be inserted as a child
    supports: {
        inserter: false // Hide from inserter since it's added via type selector
    },
    attributes: {
        postType: {
            type: 'string',
            default: 'posts'
        },
        numberOfPosts: {
            type: 'number',
            default: 5
        },
        order: {
            type: 'string',
            default: 'desc'
        },
        showFeaturedImage: {
            type: 'boolean',
            default: true
        },
        showTitle: {
            type: 'boolean',
            default: true
        },
        showExcerpt: {
            type: 'boolean',
            default: true
        }
    } as BlockAttributes,
    edit: ({ attributes, setAttributes }: BlockEditProps<PostsSliderAttributes>): JSX.Element => {
        const blockProps = useBlockProps({
            className: 'sliderberg-posts-slider-wrapper sliderberg-slides-container'
        });

        // Trigger visibility update when posts change
        useEffect(() => {
            const timer = setTimeout(() => {
                if (typeof window !== 'undefined' && window.updateSliderbergSlidesVisibility) {
                    window.updateSliderbergSlidesVisibility();
                }
            }, 100); // Small delay to ensure posts are rendered

            return () => clearTimeout(timer);
        }, [attributes.postType, attributes.numberOfPosts, attributes.order]);

        return (
            <div {...blockProps}>
                <InspectorControls>
                    <PostsSliderSettings attributes={attributes} setAttributes={setAttributes} />
                </InspectorControls>
                <PostsSlider attributes={attributes} />
            </div>
        );
    },
    save: (): JSX.Element => {
        const blockProps = useBlockProps.save({
            className: 'sliderberg-posts-slider-wrapper sliderberg-slides-container'
        });

        return (
            <div {...blockProps}>
                {/* This will be rendered server-side in PHP */}
                <div 
                    className="sliderberg-posts-slider-placeholder"
                    data-post-type="posts"
                    data-number-of-posts={5}
                    data-order="desc"
                    data-show-featured-image={true}
                    data-show-title={true}
                    data-show-excerpt={true}
                >
                    {__('Posts will be loaded here...', 'sliderberg-pro')}
                </div>
            </div>
        );
    }
};

registerBlockType<PostsSliderAttributes>('sliderberg-pro/posts-slider', blockConfig);