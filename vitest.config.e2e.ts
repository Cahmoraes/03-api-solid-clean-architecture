import { defineConfig } from 'vitest/config'
import tsconfigPaths from 'vitest-tsconfig-paths'

export default defineConfig({
  test: {
    globals: true,
    include: ['**/*.e2e-spec.ts'],
    setupFiles: ['./tests/setup-e2e.ts'],
  },
  plugins: [tsconfigPaths()],
})
