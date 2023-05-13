# Dependency Strip

Dependency Strip is a command-line tool that helps you analyze and update your project's `package.json` file by removing unused dependencies. It scans your project's files and folders to identify which dependencies are actually being used, and then updates the `package.json` file to include only the necessary dependencies.

## Usage
```
dependency-strip --path=src/**/*.js
```

Specify one or more paths to be checked recursively. The tool will analyze all files and folders at the specified paths.

## Options

- `--help`: Display usage information.
- `--verbose`: Log information about which files are being checked.
- `--path`: Specify a glob pattern for paths of files/directories that should be checked.
- `--exclude`: Specify dependencies that should be ignored for the strip.
- `--update`: Update the `package.json` file to only include used dependencies.

## Installation

To use Dependency Strip, you need to have Node.js installed on your system. Then, follow these steps:

1.  Open a terminal and navigate to the project directory.
2.  Run `npm install dependency-strip --save-dev`

## Examples

Check all files and folders in the current directory:
```
dependency-strip --path=.
```

Check only the JavaScript files in the src directory:
```
dependency-strip --path=src/**/*.js
```

Excluding `express` from the dependencies that should be searched for:
```
dependency-strip --path=src/**/*.js --exclude=express
```

Update the `package.json` file to include only used dependencies:
```
dependency-strip --update --path=.
```

## Development

If you want to contribute to the development of Dependency Strip, follow these steps:

1. Clone this repository or download the project files.
2. Open a terminal and navigate to the project directory.
3. Run `npm install` to install the required dependencies.
4. Make your changes to the code.

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.