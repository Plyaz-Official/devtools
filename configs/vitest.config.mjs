/* eslint-disable @typescript-eslint/naming-convention */
import { defineConfig } from 'vitest/config';

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
});
