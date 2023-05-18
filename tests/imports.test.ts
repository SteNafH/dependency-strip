import * as fs from "fs";
import findImports from "../src/imports";

jest.mock("fs", () => ({
    readFileSync: jest.fn(),
}));

describe("findImports", () => {
    beforeEach(() => {
        (fs.readFileSync as jest.Mock).mockReset();
    });

    it("should return an empty array if no imports are found", () => {
        (fs.readFileSync as jest.Mock).mockReturnValue("");

        const filePaths = ["file1.ts", "file2.ts"];
        const result = findImports(filePaths);

        expect(result).toEqual([]);
    });

    it("should return an array of unique imports found in the files", () => {
        const fileContents = `
      import module1 from 'module1';
      import { namedImport } from 'module2';
      require('module3');
      import('module4');
      import module5 from 'module5';
    `;

        // Mock the readFileSync method to return the file contents
        (fs.readFileSync as jest.Mock).mockReturnValue(fileContents);

        const filePaths = ["file1.ts", "file2.ts"];
        const result = findImports(filePaths);

        expect(result).toEqual([
            "module1",
            "module2",
            "module3",
            "module4",
            "module5",
        ]);
    });

    it("should handle errors while reading files and continue with other files", () => {
        // Mock the readFileSync method to throw an error
        (fs.readFileSync as jest.Mock).mockImplementation(() => {
            throw new Error("File read error");
        });

        const filePaths = ["file1.ts", "file2.ts"];
        const result = findImports(filePaths);

        expect(result).toEqual([]);
    });
});
