// Assembles a ready-to-upload deployment folder from Next.js's
// output:'standalone' build (see next.config.mjs).
//
// Next.js's standalone output does NOT automatically include
// public/ or .next/static — this is a well-known gotcha (documented
// in Next.js's own docs) that silently breaks a deployed site's
// images, fonts, and CSS if skipped. This script copies both in so
// the resulting deploy/ folder is complete and upload-ready.
//
// Run via: pnpm build:cpanel  (runs `next build` first, then this)
//
// After this finishes, deploy/ contains everything cPanel's
// "Setup Node.js App" needs:
//   deploy/server.js       <- startup file path in cPanel
//   deploy/public/
//   deploy/.next/
//   deploy/node_modules/   <- already bundled, minimal, correct for
//                              a generic Linux server; sharp's native
//                              binary is the one exception that may
//                              still need `npm install` re-run ON THE
//                              SERVER itself if its exact architecture
//                              differs from wherever this was built.

import { cpSync, existsSync, rmSync } from 'node:fs'
import path from 'node:path'

const root = process.cwd()
const standaloneDir = path.join(root, '.next', 'standalone')
const deployDir = path.join(root, 'deploy')

if (!existsSync(standaloneDir)) {
  console.error(
    '\n.next/standalone not found. Make sure next.config.mjs has output:"standalone" and that `next build` completed successfully before this script runs.\n',
  )
  process.exit(1)
}

if (existsSync(deployDir)) {
  rmSync(deployDir, { recursive: true, force: true })
}

console.log('Copying .next/standalone -> deploy/ ...')
cpSync(standaloneDir, deployDir, { recursive: true })

console.log('Copying public/ -> deploy/public/ ...')
cpSync(path.join(root, 'public'), path.join(deployDir, 'public'), { recursive: true })

console.log('Copying .next/static -> deploy/.next/static/ ...')
cpSync(
  path.join(root, '.next', 'static'),
  path.join(deployDir, '.next', 'static'),
  { recursive: true },
)

console.log(
  `\nDone. Upload the contents of ${path.relative(root, deployDir)}/ to your cPanel Node.js app's root folder.\n` +
    'Startup file in cPanel should be set to: server.js\n',
)
