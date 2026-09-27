/**
 * Post-build script: prepend the 'use client' directive to all .js and .cjs
 * files in dist/ so Next.js App Router treats them as client components.
 */
import { readFileSync, writeFileSync, readdirSync, statSync } from 'fs'
import { join } from 'path'
import { fileURLToPath } from 'url'
import { dirname } from 'path'

const __dirname = dirname(fileURLToPath(import.meta.url))
const distDir = join(__dirname, '..', 'dist')

// ── 2. Prepend 'use client' to JS outputs ────────────────────────────────────
function walk(dir) {
  const entries = readdirSync(dir)
  for (const entry of entries) {
    const full = join(dir, entry)
    if (statSync(full).isDirectory()) {
      walk(full)
    } else if (full.endsWith('.js') || full.endsWith('.cjs')) {
      const content = readFileSync(full, 'utf8')
      const hasUseClient = /^\s*['"]use client['"]/.test(content)
      if (!hasUseClient) {
        writeFileSync(full, `'use client'\n${content}`)
        console.log(`[use-client] prepended to: ${full}`)
      }
    }
  }
}

walk(distDir)
console.log('[postbuild-use-client] done.')

