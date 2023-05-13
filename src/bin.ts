#!/usr/bin/env node
import {version} from '../package.json'
import {strip, DependencyStripOptions} from "./index";

const runHelpForUsage = () => console.error('run `dependency-strip --help` for usage information');

export const help = `rimraf version ${version}

Usage: dependency-strip --path=<path>
Check all files and folders at "path", recursively.

Options:
  --help               Display this usage info
  --verbose            Log info about which files are being checked
  --path               Glob pattern for paths of files/directories 
                       which should be checked
  --exclude            Dependencies that should be ignored for
                       the strip 
  --update             Update the package.json to only include
                       used dependencies
`;

const main = async (...args: string[]) => {
    const opts: DependencyStripOptions = {
        paths: [],
        excludes: []
    };

    for (const arg of args) {
        if (arg === '--help') {
            console.log(help);
            return 0;
        } else if (arg === '--update') {
            opts.update = true;
        } else if (arg === '--verbose') {
            opts.verbose = true;
        } else if (/^--exclude=/.test(arg)) {
            opts.excludes.push(arg.substring('--exclude='.length));
        } else if (/^--path=/.test(arg)) {
            opts.paths.push(arg.substring('--path='.length));
        } else if (/^-/.test(arg)) {
            console.error(`unknown option: ${arg}`)
            runHelpForUsage()
            return 1
        }
    }

    if (!opts.paths.length) {
        console.error('dependency-strip: must provide a path to check');
        runHelpForUsage();
        return 1;
    }

    if (opts.verbose)
        console.log(`Passed args: ${args}`);

    await strip(opts);
}
main.help = help;

export default main;

if (
    typeof require === 'function' &&
    typeof module === 'object' &&
    require.main === module
) {
    const args = process.argv.slice(2)
    main(...args).then(
        code => process.exit(code),
        er => {
            console.error(er)
            process.exit(1)
        }
    )
}