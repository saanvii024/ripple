import { parse } from '@babel/parser';
import fs from 'fs';

const codeString = fs.readFileSync('./test-code.js', 'utf-8');

const ast = parse(codeString, {
    sourceType: 'module', 
});

const dependencies = [];
 
for (const node of ast.program.body) {
    
    if (node.type === 'ImportDeclaration') {
        const importPath = node.source.value;
        dependencies.push(importPath);
    }
}

console.log("AST Scan Complete. Blast Radius dependencies found:");
console.log(dependencies);