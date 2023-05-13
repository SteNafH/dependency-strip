import * as fs from "fs";
import findImports from "find-imports";
import {glob} from "glob";

export interface DependencyStripOptions {
    verbose?: boolean;
    preserveRoot?: boolean;
    update?: boolean;
    excludes: string[];
    paths: string[];
}

export const strip = async (opts: DependencyStripOptions) => {
    if (opts.verbose) {
        console.log(`Checking paths: ${opts.paths}`);
        console.log(`Found files: ${await glob(opts.paths)}`);
    }

    const rawPackageJson = fs.readFileSync('package.json').toString();
    const packageJson = JSON.parse(rawPackageJson);

    const dependencies = structuredClone(packageJson.dependencies);
    const usedDependencies: Record<string, string> = {};

    const imports = findImports(opts.paths, {
        absoluteImports: false,
        relativeImports: false,
        packageImports: true,
        flatten: true,
    });

    for (const importedDependency of imports)
        if (dependencies[importedDependency])
            usedDependencies[importedDependency] = dependencies[importedDependency];

    for (const dependency of opts.excludes)
        if (dependencies[dependency])
            usedDependencies[dependency] = dependencies[dependency];

    if (opts.verbose)
        console.log(imports);

    if (opts.verbose || !opts.update)
        console.log(usedDependencies);

    if (!opts.update)
        return;

    packageJson.dependencies = usedDependencies;

    fs.writeFileSync('package.json', JSON.stringify(packageJson, null, '\t'));
}