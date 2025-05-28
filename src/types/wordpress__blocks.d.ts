declare module '@wordpress/blocks' {
    export interface BlockEditProps<T> {
        attributes: T;
        setAttributes: (attributes: Partial<T>) => void;
    }

    export interface BlockConfiguration<T> {
        title: string;
        description: string;
        category: string;
        icon: string;
        parent?: string[];
        supports?: {
            inserter?: boolean;
            [key: string]: any;
        };
        attributes: Record<string, {
            type: string;
            default: any;
        }>;
        edit: (props: BlockEditProps<T>) => JSX.Element;
        save: () => JSX.Element | null;
    }

    export function registerBlockType<T>(name: string, settings: BlockConfiguration<T>): void;

    export function createBlock(name: string, attributes?: Record<string, any>): any;
} 