//The output from AST Crawler
const registry = {
  "/Users/saana/ripple/src/index.js": [
    "/Users/saana/ripple/src/router.js"
  ],
  "/Users/saana/ripple/src/router.js": [
    "/Users/saana/ripple/src/auth.js"
  ],
  "/Users/saana/ripple/src/auth.js": []
};

//invert the Graph (The Impact Map)
const invertedGraph = {};

// Set up empty buckets for every file
for (const file in registry) {
    invertedGraph[file] = [];
}

// Flip the direction of the arrows
for (const file in registry) {
    const imports = registry[file];
    for (const dependency of imports) {
        invertedGraph[dependency].push(file);
    }
}

// 3. The Breadth-First Search (BFS) Algorithm
function calculateBlastRadius(changedFile) {
    const queue = [changedFile]; // The processing line
    const affectedFiles = new Set(); // The final list of broken files

    while (queue.length > 0) {
        const currentFile = queue.shift(); // Take the first file in line
        
        // Find which files rely on the current file
        const impacted = invertedGraph[currentFile] || [];
        
        for (const file of impacted) {
            // If we haven't already marked it as broken
            if (!affectedFiles.has(file)) {
                affectedFiles.add(file); // Mark it as broken
                queue.push(file); // Add it to the line to check ITS dependencies
            }
        }
    }

    return Array.from(affectedFiles); // Convert Set back to a normal Array
}

// 4. Execute the Simulation
const targetFile = "/Users/saana/ripple/src/auth.js";

console.log("[RIPPLE] Simulated PR Change in:", targetFile);
console.log("\nCalculating Blast Radius...");

const radius = calculateBlastRadius(targetFile);
console.log("\n[RIPPLE] These files will break:");
console.log(radius);