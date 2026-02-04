import { readFileSync, writeFileSync, existsSync } from 'node:fs';
import { resolve } from 'node:path';

const filePath = resolve('.output/server/index.mjs');

if (existsSync(filePath)) {
  const content = readFileSync(filePath, 'utf-8');
  const newContent = content.replace(
    /import\s*"__STATIC_CONTENT_MANIFEST";/,
    '',
  );
  writeFileSync(filePath, newContent);
  console.log(
    'Successfully removed __STATIC_CONTENT_MANIFEST import from .output/server/index.mjs',
  );
} else {
  console.warn(
    'Warning: .output/server/index.mjs not found. Skipping postbuild step.',
  );
}
