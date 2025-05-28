import React from 'react';
import { __ } from '@wordpress/i18n';
import { PanelBody, SelectControl, RangeControl, ToggleControl } from '@wordpress/components';
import type { BlockEditProps } from '@wordpress/blocks';

interface PostsSliderAttributes {
    postType: string;
    numberOfPosts: number;
    order: string;
    showFeaturedImage: boolean;
    showTitle: boolean;
    showExcerpt: boolean;
}

export const PostsSliderSettings: React.FC<BlockEditProps<PostsSliderAttributes>> = ({ attributes, setAttributes }) => {
    const { postType, numberOfPosts, order, showFeaturedImage, showTitle, showExcerpt } = attributes;

    return (
        <>
            <PanelBody title={__('Post Selection', 'sliderberg-pro')} initialOpen={true}>
                <SelectControl
                    label={__('Content Type', 'sliderberg-pro')}
                    value={postType}
                    options={[
                        { label: __('Posts', 'sliderberg-pro'), value: 'posts' },
                        { label: __('Pages', 'sliderberg-pro'), value: 'pages' },
                    ]}
                    onChange={(value) => setAttributes({ postType: value })}
                />
                <RangeControl
                    label={__('Number of Posts', 'sliderberg-pro')}
                    value={numberOfPosts}
                    onChange={(value) => setAttributes({ numberOfPosts: value })}
                    min={1}
                    max={20}
                />
                <SelectControl
                    label={__('Order', 'sliderberg-pro')}
                    value={order}
                    options={[
                        { label: __('Newest First', 'sliderberg-pro'), value: 'desc' },
                        { label: __('Oldest First', 'sliderberg-pro'), value: 'asc' },
                        { label: __('Title A-Z', 'sliderberg-pro'), value: 'title' },
                    ]}
                    onChange={(value) => setAttributes({ order: value })}
                />
            </PanelBody>
            <PanelBody title={__('Display Options', 'sliderberg-pro')} initialOpen={true}>
                <ToggleControl
                    label={__('Show Featured Image', 'sliderberg-pro')}
                    checked={showFeaturedImage}
                    onChange={(value) => setAttributes({ showFeaturedImage: value })}
                />
                <ToggleControl
                    label={__('Show Post Title', 'sliderberg-pro')}
                    checked={showTitle}
                    onChange={(value) => setAttributes({ showTitle: value })}
                />
                <ToggleControl
                    label={__('Show Excerpt', 'sliderberg-pro')}
                    checked={showExcerpt}
                    onChange={(value) => setAttributes({ showExcerpt: value })}
                />
            </PanelBody>
        </>
    );
}; 