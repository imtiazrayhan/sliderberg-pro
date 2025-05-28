import { __ } from '@wordpress/i18n';
import { addFilter } from '@wordpress/hooks';
import { Icon, grid, plus } from '@wordpress/icons';
import { ProTypeCard } from './components/ProTypeCard';
import type { ReactElement } from 'react';
import { createBlock } from '@wordpress/blocks';
import { dispatch, select } from '@wordpress/data';

interface SliderType {
    id: string;
    title: string;
    description: string;
    icon: ReactElement;
    isPro?: boolean;
    isComingSoon?: boolean;
}

// Declare global window property
declare global {
    interface Window {
        sliderbergPro?: {
            isLicensed: boolean;
        };
    }
}

// Add pro slider types
addFilter('sliderberg.sliderTypes', 'sliderberg-pro/addTypes', (types: SliderType[]) => {
    // Remove any existing pro types and coming-soon
    let filtered = types.filter(type => !type.isPro && type.id !== 'coming-soon');
    const comingSoon = types.find(type => type.id === 'coming-soon');

    const proTypes: SliderType[] = [
        {
            id: 'woo-products',
            title: __('WooCommerce Products Slider', 'sliderberg-pro'),
            description: __('Display your WooCommerce products in a beautiful slider.', 'sliderberg-pro'),
            icon: <Icon icon={grid} />,
            isPro: true
        },
        {
            id: 'posts-slider',
            title: __('Posts Slider', 'sliderberg-pro'),
            description: __('Showcase your latest posts in a dynamic slider.', 'sliderberg-pro'),
            icon: <Icon icon={plus} />,
            isPro: true
        }
    ];

    // Insert pro types before coming soon, always keep coming soon last
    const newTypes = [...filtered, ...proTypes];
    if (comingSoon) newTypes.push(comingSoon);
    return newTypes;
});

// Handle type selection for pro types
addFilter('sliderberg.beforeTypeSelect', 'sliderberg-pro/handleTypeSelect', (shouldProceed: boolean, typeId: string) => {
    console.log('Admin filter running for type:', typeId);
    
    if (typeId === 'posts-slider') {
        console.log('Creating posts slider block');
        const selectedBlock = select('core/block-editor').getSelectedBlock();
        console.log('Selected block:', selectedBlock);
        
        if (selectedBlock) {
            const postsSliderBlock = createBlock('sliderberg-pro/posts-slider', {
                postType: 'posts',
                numberOfPosts: 5,
                order: 'desc',
                showFeaturedImage: true,
                showTitle: true,
                showExcerpt: true
            });
            console.log('Created posts slider block:', postsSliderBlock);

            dispatch('core/block-editor').replaceBlock(selectedBlock.clientId, postsSliderBlock);
            console.log('Replaced block');
            return false;
        }
    }
    return shouldProceed;
});

// Customize type card rendering
addFilter('sliderberg.typeCardContent', 'sliderberg-pro/customizeTypeCard', (card: any, type: SliderType) => {
    if (type.isPro) {
        return <ProTypeCard type={type} />;
    }
    return card;
}); 