import { defineConfig } from 'vitest/config';
import { fileURLToPath } from 'node:url';
import { dirname, resolve } from 'node:path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export default defineConfig({
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: './vitest.setup.ts',
    include: ['src/**/*.{test,spec}.{ts,tsx}', 'tests/**/*.{test,spec}.{ts,tsx}'],

    coverage: {
      provider: 'istanbul',
      reporter: ['text', 'lcov', 'json-summary'],
      all: true,
      clean: true,
    },

    restoreMocks: true,
    testTimeout: 10_000,
  },

  resolve: {
    alias: {
      '@': resolve(__dirname, './src'),
    },
  },
});
