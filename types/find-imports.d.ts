declare module 'find-imports' {
    interface Options {
        packageImports: boolean;
        absoluteImports: boolean;
        relativeImports: boolean;
        flatten: boolean;
    }

    interface FlattenOptions extends Options {
        flatten: true;
    }

    interface NoFlattenOptions extends Options {
        flatten: false;
    }

    interface Modules {
        [key: string]: string[];
    }

    function findImports(patterns: string[], options: FlattenOptions): string[];
    function findImports(patterns: string[], options: NoFlattenOptions): Modules;
    function findImports(patterns: string[], options: Options): string[] | Modules;

    export = findImports;
}