import { defineConfig } from 'vitest/config';
import { nxViteTsPaths } from '@nx/vite/plugins/nx-tsconfig-paths.plugin';

export default defineConfig(() => ({
  root: __dirname,
  cacheDir: '../../node_modules/.vite/apps/backend-e2e',
  plugins: [nxViteTsPaths()],
  test: {
    name: 'backend-e2e',
    watch: false,
    globals: true,
    environment: 'node',
    include: ['{src,tests}/**/*.{test,spec}.{js,mjs,cjs,ts,mts,cts,jsx,tsx}'],
    reporters: ['default'],
    globalSetup: 'src/support/global-setup.ts',
    globalTeardown: 'src/support/global-teardown.ts',
    setupFiles: ['src/support/test-setup.ts'],
  },
}));
