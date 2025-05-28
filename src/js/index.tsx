import React from 'react';
import { addFilter } from '@wordpress/hooks';
import { __ } from '@wordpress/i18n';
import { post } from '@wordpress/icons';
import { createBlock, registerBlockType, BlockEditProps } from '@wordpress/blocks';
import { dispatch, select } from '@wordpress/data';
import './blocks/posts-slider/index';
import '../../css/posts-slider.css';

// Register the block first
import { PostsSlider } from '../components/PostsSlider';
import { PostsSliderSettings } from '../components/PostsSliderSettings';

interface PostsSliderAttributes {
    postType: string;
    numberOfPosts: number;
    order: string;
    showFeaturedImage: boolean;
    showTitle: boolean;
    showExcerpt: boolean;
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
    },
    edit: ({ attributes, setAttributes }: BlockEditProps<PostsSliderAttributes>): JSX.Element => {
        return (
            <>
                <PostsSlider attributes={attributes} />
                <PostsSliderSettings attributes={attributes} setAttributes={setAttributes} />
            </>
        );
    },
    save: (): null => null // Dynamic block, rendered on the server
});

// Add Posts Slider type to the type selector
addFilter('sliderberg.sliderTypes', 'sliderberg-pro/posts-slider', (sliderTypes) => {
    return [
        ...sliderTypes,
        {
            id: 'posts',
            title: __('Posts Slider', 'sliderberg-pro'),
            description: __('Create a slider with your posts', 'sliderberg-pro'),
            icon: post,
            isPro: true
        }
    ];
});

// Handle type selection for Posts Slider
addFilter('sliderberg.beforeTypeSelect', 'sliderberg-pro/posts-slider', (shouldProceed, typeId) => {
    if (typeId === 'posts') {
        // Get the selected block's client ID
        const selectedBlock = select('core/block-editor').getSelectedBlock();
        if (selectedBlock) {
            // Create the posts slider block
            const postsSliderBlock = createBlock('sliderberg-pro/posts-slider', {
                postType: 'posts',
                numberOfPosts: 5,
                order: 'desc',
                showFeaturedImage: true,
                showTitle: true,
                showExcerpt: true
            });

            // Replace the current block with the posts slider block
            dispatch('core/block-editor').replaceBlock(selectedBlock.clientId, postsSliderBlock);
        }
        return false; // Prevent default type selection behavior
    }
    return shouldProceed;
}); 