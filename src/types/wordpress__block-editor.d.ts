declare module '@wordpress/block-editor' {
    import { ComponentType } from 'react';

    export interface InspectorControlsProps {
        children: React.ReactNode;
    }

    export interface BlockProps {
        className?: string;
        style?: React.CSSProperties;
        [key: string]: any;
    }

    export const InspectorControls: ComponentType<InspectorControlsProps>;
    export const useBlockProps: {
        (props?: BlockProps): BlockProps & { [key: string]: any };
        save: (props?: BlockProps) => BlockProps & { [key: string]: any };
    };
} 