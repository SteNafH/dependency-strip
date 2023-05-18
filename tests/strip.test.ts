import * as fs from "fs";
import { strip, DependencyStripOptions } from "../src";

jest.mock('fs', () => {
    const originalModule = jest.requireActual('fs');

    return {
        __esModule: true,
        ...originalModule,
        readFileSync: jest.fn(() => '{"dependencies": {"dep1": "1.0.0", "dep2": "2.0.0"}}'),
        writeFileSync: jest.fn(),
    };
});

jest.mock('glob', () => {
    const originalModule = jest.requireActual('glob');

    return {
        __esModule: true,
        ...originalModule,
        default: jest.fn(() => ["file1.js", "file2.js"])
    };
});

jest.mock('../src/imports.ts', () => {
    const originalModule = jest.requireActual('../src/imports.ts');

    return {
        __esModule: true,
        ...originalModule,
        default: jest.fn(() => {
            return ["dep1"]
        })
    };
});

describe("strip", () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    test("should strip dependencies correctly", async () => {
        const paths = ["path1", "path2"];
        const options: DependencyStripOptions = {
            update: true,
            excludes: [],
            paths: paths,
            ignorePaths: []
        };

        await strip(options);

        expect(fs.readFileSync).toHaveBeenCalledWith("package.json");
        expect(fs.writeFileSync).toHaveBeenCalledWith(
            "package.json",
            JSON.stringify({ dependencies: { dep1: "1.0.0" } }, null, "\t")
        );
    });

    test("should strip dependencies correctly with exclusion", async () => {
        const paths = ["path1", "path2"];
        const options: DependencyStripOptions = {
            update: true,
            excludes: ["dep2"],
            paths: paths,
            ignorePaths: []
        };

        await strip(options);

        expect(fs.readFileSync).toHaveBeenCalledWith("package.json");
        expect(fs.writeFileSync).toHaveBeenCalledWith(
            "package.json",
            JSON.stringify({ dependencies: { dep1: "1.0.0", dep2: "2.0.0" } }, null, "\t")
        );
    });

    test("should not update package.json if `update` option is false", async () => {
        const options: DependencyStripOptions = {
            update: false,
            excludes: [],
            paths: [],
            ignorePaths: []
        };

        await strip(options);

        expect(fs.readFileSync).toHaveBeenCalled();
        expect(fs.writeFileSync).not.toHaveBeenCalled();
    });
});
