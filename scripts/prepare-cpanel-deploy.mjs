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
//    (A "replace it all with a flat npm install instead" approach
//    was tried and reverted - npm's own dependency resolver
//    (@npmcli/arborist) hit an unrelated internal crash,
//    "Cannot read properties of null (reading 'edgesOut')", on this
//    project's peer-dependency graph. Targeted fixes below are more
//    reliable than that blanket replacement turned out to be.)
//
// 2. Next's file tracer misses `@swc/helpers` entirely from the
//    standalone output - a known upstream issue, since SWC injects
//    it into compiled code implicitly rather than through a normal
//    static import the tracer can follow. It's only a transitive
//    dependency (needed internally by Next/SWC, never declared in
//    this project's own package.json), so pnpm's strict,
//    non-hoisting layout never creates a top-level
//    node_modules/@swc/helpers for it either - it only exists inside
//    the .pnpm store (confirmed: node_modules/.pnpm/@swc+helpers@*).
//    Without this, the app crashes at startup with "Cannot find
//    module '@swc/helpers/_/_interop_require_default'". This script
//    locates it inside the store directly and copies it to the top
//    level of deploy/node_modules, where Node's normal module
//    resolution can find it like any other flat-installed package.
//
// If a *different* "Cannot find module 'X'" error shows up after
// this - i.e. another package in the same boat as @swc/helpers -
// the fix is the same pattern: find it under node_modules/.pnpm/,
// copy it into deploy/node_modules/ at the top level.
//
// Run via: pnpm build:cpanel  (runs `next build` first, then this)
//
// After this finishes, deploy/ contains everything cPanel's
// "Setup Node.js App" needs:
//   deploy/server.js       <- startup file path in cPanel
//   deploy/public/
//   deploy/.next/
//   deploy/node_modules/   <- fully self-contained, real files only

import { cpSync, existsSync, readdirSync, rmSync } from 'node:fs'
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

function copyPhantomPnpmDep(pkgPathParts) {
  // pkgPathParts e.g. ['@swc', 'helpers'] for the @swc/helpers package.
  const storeName = pkgPathParts.join('+') // pnpm store dirs use + instead of /
  const pnpmStoreDir = path.join(root, 'node_modules', '.pnpm')
  const dest = path.join(deployDir, 'node_modules', ...pkgPathParts)

  let src = null
  if (existsSync(pnpmStoreDir)) {
    const match = readdirSync(pnpmStoreDir).find((name) => name.startsWith(`${storeName}@`))
    if (match) {
      src = path.join(pnpmStoreDir, match, 'node_modules', ...pkgPathParts)
    }
  }
  // Fallback for non-pnpm installs (e.g. a plain `npm install`), where
  // it may already be hoisted to the normal top-level location.
  if (!src || !existsSync(src)) {
    const flatPath = path.join(root, 'node_modules', ...pkgPathParts)
    if (existsSync(flatPath)) src = flatPath
  }

  const pkgLabel = pkgPathParts.join('/')
  if (src && existsSync(src)) {
    console.log(`Copying ${pkgLabel} (from ${path.relative(root, src)}) -> deploy/node_modules/${pkgLabel}/ ...`)
    cpSync(src, dest, { recursive: true, dereference: true })
  } else {
    console.warn(
      `\nWARNING: could not locate ${pkgLabel} anywhere under node_modules (checked the pnpm store and the flat top-level path). If the deployed app crashes with "Cannot find module ${pkgLabel}/...", this is why.\n`,
    )
  }
}

copyPhantomPnpmDep(['@swc', 'helpers'])

console.log(
  `\nDone. Upload the contents of ${path.relative(root, deployDir)}/ to your cPanel Node.js app's root folder.\n` +
    'Startup file in cPanel should be set to: server.js\n',
)
