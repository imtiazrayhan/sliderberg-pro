import { __ } from '@wordpress/i18n';
import { addFilter } from '@wordpress/hooks';
import { Icon, grid, plus } from '@wordpress/icons';
import { ProTypeCard } from '../components/ui/ProTypeCard';
import type { ReactElement } from 'react';

interface SliderType {
    id: string;
    title: string;
    description: string;
    icon: ReactElement;
    isPro?: boolean;
    isComingSoon?: boolean;
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

// For pro types, allow normal type selection to proceed
// The actual pro block insertion will be handled by the Edit component
addFilter('sliderberg.beforeTypeSelect', 'sliderberg-pro/handleTypeSelect', (shouldProceed: boolean, typeId: string) => {
    // For pro types, just let the normal flow proceed
    // The Edit component will detect the pro type and handle the block insertion
    if (typeId === 'posts-slider' || typeId === 'woo-products') {
        console.log('Allowing pro type selection to proceed normally:', typeId);
        return true; // Allow normal type selection
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