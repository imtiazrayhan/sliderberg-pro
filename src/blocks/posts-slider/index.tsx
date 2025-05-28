import { registerBlockType } from '@wordpress/blocks';
import { __ } from '@wordpress/i18n';
import { InspectorControls, useBlockProps } from '@wordpress/block-editor';
import { PostsSlider } from '../../components/sliders/PostsSlider';
import { PostsSliderSettings } from './settings';
import type { BlockEditProps } from '@wordpress/blocks';

interface PostsSliderAttributes {
    postType: string;
    numberOfPosts: number;
    order: string;
    showFeaturedImage: boolean;
    showTitle: boolean;
    showExcerpt: boolean;
}

interface BlockAttributes {
    postType: {
        type: 'string';
        default: string;
    };
    numberOfPosts: {
        type: 'number';
        default: number;
    };
    order: {
        type: 'string';
        default: string;
    };
    showFeaturedImage: {
        type: 'boolean';
        default: boolean;
    };
    showTitle: {
        type: 'boolean';
        default: boolean;
    };
    showExcerpt: {
        type: 'boolean';
        default: boolean;
    };
}

registerBlockType<PostsSliderAttributes>('sliderberg-pro/posts-slider', {
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
            className: 'sliderberg-posts-slider-wrapper'
        });

        return (
            <div {...blockProps}>
                <InspectorControls>
                    <PostsSliderSettings attributes={attributes} setAttributes={setAttributes} />
                </InspectorControls>
                <PostsSlider attributes={attributes} />
            </div>
        );
    },
    save: ({ attributes }: { attributes: PostsSliderAttributes }): JSX.Element => {
        const blockProps = useBlockProps.save({
            className: 'sliderberg-posts-slider-wrapper'
        });

        return (
            <div {...blockProps}>
                {/* This will be rendered server-side in PHP */}
                <div 
                    className="sliderberg-posts-slider-placeholder"
                    data-post-type={attributes.postType}
                    data-number-of-posts={attributes.numberOfPosts}
                    data-order={attributes.order}
                    data-show-featured-image={attributes.showFeaturedImage}
                    data-show-title={attributes.showTitle}
                    data-show-excerpt={attributes.showExcerpt}
                >
                    {__('Posts will be loaded here...', 'sliderberg-pro')}
                </div>
            </div>
        );
    }
});