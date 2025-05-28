declare module '@wordpress/block-editor' {
    import { ComponentType } from 'react';

    export interface InspectorControlsProps {
        children: React.ReactNode;
    }

    export const InspectorControls: ComponentType<InspectorControlsProps>;
} 