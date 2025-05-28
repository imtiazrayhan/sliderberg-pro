import { registerBlockType } from '@wordpress/blocks';
import { __ } from '@wordpress/i18n';
import { InspectorControls } from '@wordpress/block-editor';
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
        return (
            <>
                <InspectorControls>
                    <PostsSliderSettings attributes={attributes} setAttributes={setAttributes} />
                </InspectorControls>
                <PostsSlider attributes={attributes} />
            </>
        );
    },
    save: (): null => {
        return null; // Dynamic block, rendered on the server
    }
}); 