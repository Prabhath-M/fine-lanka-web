import { readFileSync } from 'node:fs'
import { join } from 'node:path'
import { describe, expect, it } from 'vitest'

describe('globals.css', () => {
  it('has balanced braces (a stray "}" breaks the whole build)', () => {
    const css = readFileSync(join(__dirname, 'globals.css'), 'utf8').replace(/\/\*[\s\S]*?\*\//g, '')
    let depth = 0
    let line = 1
    for (const char of css) {
      if (char === '\n') line += 1
      if (char === '{') depth += 1
      if (char === '}') {
        depth -= 1
        expect(depth, `unexpected "}" at line ${line}`).toBeGreaterThanOrEqual(0)
      }
    }
    expect(depth).toBe(0)
  })
})
