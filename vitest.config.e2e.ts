import { defineConfig } from 'vitest/config'
import tsconfigPaths from 'vitest-tsconfig-paths'

export default defineConfig({
  test: {
    include: ['**/*.e2e-spec.ts'],
    globals: true,
    setupFiles: ['./tests/setup-e2e.ts'],
  },
  plugins: [tsconfigPaths()],
})
