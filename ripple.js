import { parse } from '@babel/parser';
import fs from 'fs';
import path from 'path';

// Wrapped in an exported function for scope isolation
export function analyzeBlastRadius(entryPointString, targetModifiedString) {
    const entryPoint = path.resolve(entryPointString);
    const targetFile = path.resolve(targetModifiedString);

    // LOCAL SCOPE: Fresh memory for every request
    const registry = {}; 
    const visited = new Set(); 
    const invertedGraph = {};

    function buildRegistry(absolutePath) {
        if (visited.has(absolutePath)) return;
        visited.add(absolutePath);

        let codeString;
        try {
            // Safety: Try to read the file, fail gracefully if it doesn't exist
            codeString = fs.readFileSync(absolutePath, 'utf-8');
        } catch (error) {
            console.error(`[Ripple Error] Missing file: ${absolutePath}`);
            return;
        }
        
        const ast = parse(codeString, { sourceType: 'module' });
        registry[absolutePath] = [];

        for (const node of ast.program.body) {
            if (node.type === 'ImportDeclaration') {
                const importPath = node.source.value;
                if (importPath.startsWith('.')) {
                    const currentDirectory = path.dirname(absolutePath);
                    let resolvedPath = path.resolve(currentDirectory, importPath);

                    registry[absolutePath].push(resolvedPath);
                    buildRegistry(resolvedPath);
                }
            }
        }
    }

    function invertDependencyGraph() {
        for (const file in registry) {
            invertedGraph[file] = [];
        }
        for (const file in registry) {
            const imports = registry[file];
            for (const dependency of imports) {
                if (!invertedGraph[dependency]) {
                    invertedGraph[dependency] = [];
                }
                invertedGraph[dependency].push(file);
            }
        }
    }

    function calculateBFS(changedFile) {
        const queue = [changedFile];
        const affectedFiles = new Set();

        while (queue.length > 0) {
            const currentFile = queue.shift(); 
            const impacted = invertedGraph[currentFile] || [];
            
            for (const file of impacted) {
                if (!affectedFiles.has(file)) {
                    affectedFiles.add(file);
                    queue.push(file);
                }
            }
        }
        return Array.from(affectedFiles);
    }

    // Run the pipeline
    buildRegistry(entryPoint);
    invertDependencyGraph();
    const radius = calculateBFS(targetFile);

    // Return the JSON data instead of console logging
    return {
        target: targetFile,
        totalAffected: radius.length,
        affectedFiles: radius
    };
}