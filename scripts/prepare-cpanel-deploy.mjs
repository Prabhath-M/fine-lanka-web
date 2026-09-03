// Assembles a ready-to-upload deployment folder from Next.js's
// output:'standalone' build (see next.config.mjs).
//
// Next.js's standalone output does NOT automatically include
// public/ or .next/static — this is a well-known gotcha (documented
// in Next.js's own docs) that silently breaks a deployed site's
// images, fonts, and CSS if skipped. This script copies both in so
// the resulting deploy/ folder is complete and upload-ready.
//
// Two more gotchas this script guards against, both found the hard
// way during the first live cPanel deploy:
//
// 1. This project uses pnpm, whose node_modules is built almost
//    entirely out of symlinks into a .pnpm store. Next's file tracer
//    preserves those as symlinks rather than copying real content -
//    fine on the machine that built it, but broken (dangling
//    symlinks) the moment deploy/ is moved anywhere else, including
//    to the production server. Every copy below uses
//    `dereference: true` so the result is real, portable files.
//
// 2. Next's file tracer misses `@swc/helpers` entirely from the
//    standalone output - a known upstream issue, since SWC injects
//    it into compiled code implicitly rather than through a normal
//    static import the tracer can follow. Without this, the app
//    crashes at startup with "Cannot find module
//    '@swc/helpers/_/_interop_require_default'". This script copies
//    it in explicitly from the full node_modules install.
//
// Run via: pnpm build:cpanel  (runs `next build` first, then this)
//
// After this finishes, deploy/ contains everything cPanel's
// "Setup Node.js App" needs:
//   deploy/server.js       <- startup file path in cPanel
//   deploy/public/
//   deploy/.next/
//   deploy/node_modules/   <- fully self-contained, real files only

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
cpSync(standaloneDir, deployDir, { recursive: true, dereference: true })

console.log('Copying public/ -> deploy/public/ ...')
cpSync(path.join(root, 'public'), path.join(deployDir, 'public'), {
  recursive: true,
  dereference: true,
})

console.log('Copying .next/static -> deploy/.next/static/ ...')
cpSync(
  path.join(root, '.next', 'static'),
  path.join(deployDir, '.next', 'static'),
  { recursive: true, dereference: true },
)

const swcHelpersSrc = path.join(root, 'node_modules', '@swc', 'helpers')
const swcHelpersDest = path.join(deployDir, 'node_modules', '@swc', 'helpers')
if (existsSync(swcHelpersSrc)) {
  console.log('Copying @swc/helpers -> deploy/node_modules/@swc/helpers/ ...')
  cpSync(swcHelpersSrc, swcHelpersDest, { recursive: true, dereference: true })
} else {
  console.warn(
    '\nWARNING: node_modules/@swc/helpers not found in the source install - skipped copying it into deploy/. If the deployed app crashes with "Cannot find module @swc/helpers/...", this is why.\n',
  )
}

console.log(
  `\nDone. Upload the contents of ${path.relative(root, deployDir)}/ to your cPanel Node.js app's root folder.\n` +
    'Startup file in cPanel should be set to: server.js\n',
)
