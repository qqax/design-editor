import { readdir, readFile, writeFile } from 'node:fs/promises';
import { join, relative, sep } from 'node:path';
import { fileURLToPath } from 'node:url';

const here = fileURLToPath(new URL('.', import.meta.url));
const root = join(here, '..', 'src', 'content', 'docs', 'api');

async function walk(dir) {
  const entries = await readdir(dir, { withFileTypes: true });
  const files = [];
  for (const e of entries) {
    const p = join(dir, e.name);
    if (e.isDirectory()) files.push(...(await walk(p)));
    else if (e.isFile() && e.name.endsWith('.md')) files.push(p);
  }
  return files;
}

function titleFromContent(md, fallback) {
  const h1 = md.match(/^#\s+(.+?)\s*$/m);
  return h1 ? h1[1].replace(/[`*_]/g, '').trim() : fallback;
}

const files = await walk(root);
let touched = 0;
for (const file of files) {
  const md = await readFile(file, 'utf8');
  if (md.startsWith('---')) continue;
  const rel = relative(root, file).replaceAll(sep, '/').replace(/\.md$/, '');
  const fallback = rel === 'README' ? 'API Reference' : rel.split('/').pop();
  const title = titleFromContent(md, fallback).replace(/"/g, '\\"');
  const next = `---\ntitle: "${title}"\n---\n\n${md}`;
  await writeFile(file, next);
  touched++;
}
console.log(
  `[add-typedoc-frontmatter] injected frontmatter into ${touched}/${files.length} file(s)`
);
