import { readFileSync, writeFileSync, readdirSync, statSync } from 'node:fs';
import { resolve, join } from 'node:path';

const serverDir = resolve('.output/server');

function processDirectory(directory) {
  if (!statSync(directory).isDirectory()) return;

  const files = readdirSync(directory);

  for (const file of files) {
    const fullPath = join(directory, file);
    const stat = statSync(fullPath);

    if (stat.isDirectory()) {
      processDirectory(fullPath);
    } else if (file.endsWith('.mjs') || file.endsWith('.js')) {
      const content = readFileSync(fullPath, 'utf-8');
      if (content.includes('__STATIC_CONTENT_MANIFEST')) {
        // Regex to match imports of __STATIC_CONTENT_MANIFEST
        // Matches: import ... from "__STATIC_CONTENT_MANIFEST"; or import "__STATIC_CONTENT_MANIFEST";
        // Also matches variable assignment if it was transformed: const ... = require("...");

        // Simple removal of the specific import line we saw earlier
        let newContent = content.replace(
          /import\s*["']__STATIC_CONTENT_MANIFEST["'];/g,
          '',
        );

        // Also handle the aliased import if it appears as a default import
        newContent = newContent.replace(
          /import\s*.*?\s*from\s*["']__STATIC_CONTENT_MANIFEST["'];/g,
          '',
        );

        if (content !== newContent) {
          writeFileSync(fullPath, newContent);
          console.log(`Cleaned: ${fullPath}`);
        }
      }
    }
  }
}

console.log('Starting postbuild cleanup...');
if (statSync(serverDir).isDirectory()) {
  processDirectory(serverDir);
  console.log('Postbuild cleanup complete.');
} else {
  console.warn('Warning: .output/server directory not found.');
}
