import * as fs from "fs";
import findImports from "./imports";
import {glob} from "glob";

export interface DependencyStripOptions {
    verbose?: boolean;
    update?: boolean;
    excludes: string[];
    paths: string[];
    ignorePaths: string[];
}

export const strip = async (opts: DependencyStripOptions) => {
    const filePaths = await glob(opts.paths, {ignore: opts.ignorePaths});

    if (opts.verbose) {
        console.log(`Checking paths: ${opts.paths}`);
        console.log(`Ignoring paths: ${opts.ignorePaths}`);
        console.log(`Found files: ${filePaths}`);
    }

    const rawPackageJson = fs.readFileSync('package.json').toString();
    const packageJson = JSON.parse(rawPackageJson);

    const dependencies = structuredClone(packageJson.dependencies);
    const usedDependencies: Record<string, string> = {};

    const imports = findImports(filePaths);

    for (const importedDependency of imports)
        if (dependencies[importedDependency])
            usedDependencies[importedDependency] = dependencies[importedDependency];

    for (const dependency of opts.excludes)
        if (dependencies[dependency])
            usedDependencies[dependency] = dependencies[dependency];

    if (opts.verbose)
        console.log(`Found imports: ${imports}`);

    console.log(`Used dependencies: ${Object.keys(usedDependencies)}`);

    if (!opts.update)
        return;

    packageJson.dependencies = usedDependencies;

    fs.writeFileSync('package.json', JSON.stringify(packageJson, null, '\t'));
}