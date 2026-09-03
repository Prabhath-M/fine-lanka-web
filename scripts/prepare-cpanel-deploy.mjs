// Assembles a ready-to-upload deployment folder from Next.js's
// output:'standalone' build (see next.config.mjs).
//
// Next.js's standalone output does NOT automatically include
// public/ or .next/static — this is a well-known gotcha (documented
// in Next.js's own docs) that silently breaks a deployed site's
// images, fonts, and CSS if skipped. This script copies both in so
// the resulting deploy/ folder is complete and upload-ready.
//
// One more gotcha this script guards against, found the hard way
// during the first live cPanel deploy: this project uses pnpm, whose
// node_modules is built almost entirely out of symlinks into a
// .pnpm store with strict, non-hoisted isolation (deliberately
// blocking access to "phantom" transitive dependencies that aren't
// declared in package.json - which is exactly why @swc/helpers,
// needed internally by Next/SWC but never declared directly, doesn't
// exist at a normal top-level path at all). Next's own standalone
// output file tracer inherits both problems: it preserves pnpm's
// symlinks as-is (fine on the build machine, dangling once moved
// anywhere else) and misses @swc/helpers entirely (a known upstream
// issue - SWC injects it into compiled code implicitly, not via a
// static import the tracer can follow).
//
// Rather than patching around pnpm's structure package-by-package
// (fragile - there could be other similarly "phantom" transitive
// deps we haven't hit yet), this script throws away the traced
// node_modules and does a plain `npm install` inside deploy/ instead,
// using the package.json Next already generates there. npm's
// resolver has none of pnpm's phantom-dependency isolation, so it
// naturally pulls in and correctly hoists everything actually
// needed - including @swc/helpers - as real files, no symlinks.
//
// Run via: pnpm build:cpanel  (runs `next build` first, then this)
//
// After this finishes, deploy/ contains everything cPanel's
// "Setup Node.js App" needs:
//   deploy/server.js       <- startup file path in cPanel
//   deploy/public/
//   deploy/.next/
//   deploy/node_modules/   <- fresh flat npm install, no pnpm quirks

import { cpSync, existsSync, rmSync } from 'node:fs'
import path from 'node:path'
import { execSync } from 'node:child_process'

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

console.log(
  '\nReplacing traced node_modules with a fresh flat `npm install` in deploy/ ' +
    '(avoids pnpm phantom-dependency gaps like the missing @swc/helpers) ...\n',
)
rmSync(path.join(deployDir, 'node_modules'), { recursive: true, force: true })
execSync('npm install --omit=dev --no-audit --no-fund', {
  cwd: deployDir,
  stdio: 'inherit',
})

console.log(
  `\nDone. Upload the contents of ${path.relative(root, deployDir)}/ to your cPanel Node.js app's root folder.\n` +
    'Startup file in cPanel should be set to: server.js\n',
)
