/**
 * Copies src/theme/theme.css to dist/theme.css (the "./theme.css" export).
 * `--watch` keeps copying on change for `npm run dev`.
 */
import { copyFileSync, mkdirSync, watch } from 'fs'
import { dirname, join } from 'path'
import { fileURLToPath } from 'url'

const root = join(dirname(fileURLToPath(import.meta.url)), '..')
const source = join(root, 'src', 'theme', 'theme.css')
const target = join(root, 'dist', 'theme.css')

const copy = () => {
  mkdirSync(dirname(target), { recursive: true })
  copyFileSync(source, target)
  console.log('[copy-theme] dist/theme.css updated')
}

copy()
if (process.argv.includes('--watch')) watch(source, copy)
