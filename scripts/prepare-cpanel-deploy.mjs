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
// during the first live cPanel deploy - and it took several rounds
// to get right, so this explanation is worth reading in full before
// changing anything below:
//
// This project uses pnpm, whose node_modules is deliberately NOT
// flat: only this project's own declared dependencies get a
// top-level entry (as a symlink into a .pnpm store). Anything that's
// only a *transitive* dependency - needed internally by some package
// this project depends on, but never declared in this project's own
// package.json - has no top-level entry at all. That's pnpm
// correctly preventing "phantom dependency" bugs during normal
// dev/build - but it's exactly the wrong property for a standalone,
// portable deploy/ folder, where everything needs to be resolvable
// via plain top-level requires with nothing left implicit.
//
// Next's own file tracer (which builds the standalone output) makes
// this worse: it doesn't reliably catch every transitive dependency
// either - some are injected into compiled code implicitly (e.g. by
// SWC) rather than through a normal static import the tracer can
// follow. In practice this surfaced as a chain of crashes, each only
// visible once the previous one was fixed and the app got further
// into starting up: first "Cannot find module 'next'" (turned out to
// be a *symlink*, not a missing file - see dereference: true below),
// then '@swc/helpers', then '@next/env', with 'tslib' and
// 'client-only' waiting one level deeper still (needed by
// @swc/helpers and styled-jsx respectively).
//
// Patching each one by name as it was discovered clearly wasn't
// going to end - so instead, resolvePhantomDepsRecursively() below
// walks the FULL dependency tree of every package this project
// directly depends on (from deploy/package.json's own
// "dependencies"), checks each one against pnpm's .pnpm store, and
// copies in anything missing from deploy/node_modules - recursing
// into newly-copied packages' own dependencies too, however deep
// that goes. This should need no further hand-patching even if a
// dependency upgrade shuffles which packages happen to be phantom.
//
// (A "throw it all away and do a flat npm install instead" approach
// was tried and reverted - npm's own dependency resolver
// (@npmcli/arborist) hit an unrelated internal crash, "Cannot read
// properties of null (reading 'edgesOut')", on this project's
// peer-dependency graph. The targeted, recursive approach here is
// more reliable than that blanket replacement turned out to be.)
//
// Run via: pnpm build:cpanel  (runs `next build` first, then this)
//
// After this finishes, deploy/ contains everything cPanel's
// "Setup Node.js App" needs:
//   deploy/server.js       <- startup file path in cPanel
//   deploy/public/
//   deploy/.next/
//   deploy/node_modules/   <- fully self-contained, real files only

import { cpSync, existsSync, readdirSync, readFileSync, rmSync } from 'node:fs'
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

function depNameToParts(depName) {
  return depName.startsWith('@') ? depName.split('/') : [depName]
}

// Finds a package inside pnpm's .pnpm store and copies it to the top
// level of deploy/node_modules, dereferenced (real files, not
// symlinks). Falls back to a flat top-level node_modules/<pkg> path
// for non-pnpm installs (e.g. a plain `npm install`).
function copyPhantomPnpmDep(pkgPathParts) {
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
  if (!src || !existsSync(src)) {
    const flatPath = path.join(root, 'node_modules', ...pkgPathParts)
    if (existsSync(flatPath)) src = flatPath
  }

  const pkgLabel = pkgPathParts.join('/')
  if (src && existsSync(src)) {
    cpSync(src, dest, { recursive: true, dereference: true })
    return true
  }
  console.warn(
    `\nWARNING: could not locate ${pkgLabel} anywhere under node_modules (checked the pnpm store and the flat top-level path). If the deployed app crashes with "Cannot find module ${pkgLabel}/...", this is why.\n`,
  )
  return false
}

// Walks the full dependency tree starting from the given package
// names, copying in anything missing from deploy/node_modules and
// recursing into each newly-copied package's own dependencies.
function resolvePhantomDepsRecursively(startingDeps) {
  const visited = new Set()
  const queue = [...startingDeps]
  let copiedCount = 0

  while (queue.length > 0) {
    const depName = queue.shift()
    if (visited.has(depName)) continue
    visited.add(depName)

    const depParts = depNameToParts(depName)
    const destPath = path.join(deployDir, 'node_modules', ...depParts)

    if (!existsSync(destPath)) {
      const copied = copyPhantomPnpmDep(depParts)
      if (!copied) continue
      console.log(`  copied phantom dependency: ${depName}`)
      copiedCount++
    }

    const pkgJsonPath = path.join(destPath, 'package.json')
    if (existsSync(pkgJsonPath)) {
      try {
        const pkgJson = JSON.parse(readFileSync(pkgJsonPath, 'utf8'))
        for (const subDep of Object.keys(pkgJson.dependencies ?? {})) {
          if (!visited.has(subDep)) queue.push(subDep)
        }
      } catch {
        // Malformed or unreadable package.json - nothing more to walk
        // from here, but the package itself is already in place.
      }
    }
  }

  return copiedCount
}

console.log('Resolving phantom pnpm-only dependencies (recursive) ...')
const deployPkgJsonPath = path.join(deployDir, 'package.json')
if (existsSync(deployPkgJsonPath)) {
  const deployPkgJson = JSON.parse(readFileSync(deployPkgJsonPath, 'utf8'))
  const directDeps = Object.keys(deployPkgJson.dependencies ?? {})
  const copiedCount = resolvePhantomDepsRecursively(directDeps)
  console.log(`Done - copied ${copiedCount} phantom dependencies into deploy/node_modules/.`)
} else {
  console.warn('\nWARNING: deploy/package.json not found - skipped resolving phantom dependencies.\n')
}

console.log(
  `\nDone. Upload the contents of ${path.relative(root, deployDir)}/ to your cPanel Node.js app's root folder.\n` +
    'Startup file in cPanel should be set to: server.js\n',
)
