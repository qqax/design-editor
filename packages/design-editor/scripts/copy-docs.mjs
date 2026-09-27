// Copies the repository README, license and notices into the package before
// `npm pack` / `npm publish`, so the published tarball carries them.
import { copyFileSync, existsSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const packageDir = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const repoRoot = resolve(packageDir, '../..');

for (const file of ['README.md', 'LICENSE', 'NOTICE', 'CHANGELOG.md']) {
  const source = resolve(repoRoot, file);
  if (!existsSync(source)) {
    console.error(`[copy-docs] missing ${file}`);
    process.exit(1);
  }
  copyFileSync(source, resolve(packageDir, file));
}
console.log('[copy-docs] README.md, LICENSE, NOTICE, CHANGELOG.md copied');
