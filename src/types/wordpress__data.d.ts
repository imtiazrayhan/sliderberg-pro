declare module '@wordpress/data' {
    export function dispatch(namespace: string): {
        replaceBlock: (clientId: string, block: any) => void;
    };

    export function select(namespace: string): {
        getSelectedBlock: () => { clientId: string } | null;
    };

    export function useSelect<T>(
        select: (select: any) => T,
        deps?: ReadonlyArray<any>
    ): T;
} 