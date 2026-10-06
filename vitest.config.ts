import path from 'node:path'
import { defineConfig } from 'vitest/config'

// Resolves the `@/` import alias used across the app so component tests can render real components.
export default defineConfig({
  resolve: { alias: { '@': path.resolve(__dirname) } },
  esbuild: { jsx: 'automatic' },
})
