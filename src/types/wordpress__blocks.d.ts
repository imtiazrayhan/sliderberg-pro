declare module '@wordpress/blocks' {
    export interface BlockEditProps<T> {
        attributes: T;
        setAttributes: (attributes: Partial<T>) => void;
    }

    export function registerBlockType<T>(name: string, settings: {
        title: string;
        description: string;
        category: string;
        icon: string;
        attributes: Record<string, any>;
        edit: (props: BlockEditProps<T>) => JSX.Element;
        save: () => JSX.Element | null;
    }): void;

    export function createBlock(name: string, attributes?: Record<string, any>): any;
} 