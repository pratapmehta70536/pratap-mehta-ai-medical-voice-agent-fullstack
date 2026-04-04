import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'
import tsconfigPaths from 'vitest-tsconfig-paths'

export default defineConfig({
  plugins: [react(), tsconfigPaths()],
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: './tests/setup.ts',
    env: {
      DATABASE_URL: 'postgresql://user:password@localhost:5432/test',
      OPEN_ROUTER_API_KEY: 'test-key',
    },
  },
})
