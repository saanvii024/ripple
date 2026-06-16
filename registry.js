import { parse } from '@babel/parser';
import fs from 'fs';
import path from 'path';

//"Registry" will be a JavaScript Object mapping files to their dependencies
const registry = {}; 


// a set to keep track of files we've already parsed to prevent infinite loops
const visited = new Set(); 

function buildRegistry(absolutePath) {

    if (visited.has(absolutePath)) return;
    visited.add(absolutePath);

		//read and parse the file into an AST
    const codeString = fs.readFileSync(absolutePath, 'utf-8');
    const ast = parse(codeString, { sourceType: 'module' });

    //initialize this file's empty bucket in the registry
    registry[absolutePath] = [];

    //scan the AST for import statements
    for (const node of ast.program.body) {
        if (node.type === 'ImportDeclaration') {
            const importPath = node.source.value;

            //CRITICAL FILTER: Only process local files, ignore node_modules
            if (importPath.startsWith('.')) {
                
                // calculate the absolute file path on the hard drive
                const currentDirectory = path.dirname(absolutePath);
                let resolvedPath = path.resolve(currentDirectory, importPath);

                //add the connection to our graph
                registry[absolutePath].push(resolvedPath);

                //RECURSION: Crawl the file we just discovered
                buildRegistry(resolvedPath);
            }
        }
    }
}

//start the crawler
const entryPoint = path.resolve('./src/index.js');
console.log(`[RIPPLE] Starting AST crawler at: ${entryPoint}\n`);

buildRegistry(entryPoint);

console.log("[RIPPLE] Dependency Graph Built Successfully:");
//print the object beautifully with 2 spaces of indentation
console.log(JSON.stringify(registry, null, 2))