import fs from "fs";

const findImports = (filePaths: string[]): string[] => {
    const importPattern = /import\s+[\w{},*\s]+from\s+['"]([^'"]+)['"]|require\s*\(\s*['"]([^'"]+)['"]\s*\)|import\(\s*['"]([^'"]+)['"]\s*\)/g;
    const imports = new Set<string>();

    for (const filePath of filePaths) {
        try {
            const file = fs.readFileSync(filePath).toString();

            let match;

            while ((match = importPattern.exec(file)) !== null) {
                const importPath = match[1] || match[2] || match[3];
                imports.add(importPath);
            }
        } catch (e) {
        }
    }

    return Array.from(imports);
}

export default findImports;