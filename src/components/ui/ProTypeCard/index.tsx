import { __ } from '@wordpress/i18n';
import { Icon } from '@wordpress/icons';
import type { ReactElement } from 'react';

interface SliderType {
    id: string;
    title: string;
    description: string;
    icon: ReactElement;
    isPro?: boolean;
}

interface ProTypeCardProps {
    type: SliderType;
}

export const ProTypeCard = ({ type }: ProTypeCardProps) => {
    return (
        <div className="sliderberg-pro-type-card">
            <div className="sliderberg-type-icon">
                <Icon icon={type.icon} />
            </div>
            <h3>{type.title}</h3>
            <p>{type.description}</p>
            <div className="sliderberg-pro-badge">
                {__('Pro', 'sliderberg-pro')}
            </div>
        </div>
    );
}; 