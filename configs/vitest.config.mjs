import { defineConfig } from 'vitest/config';
import { fileURLToPath } from 'node:url';
import { dirname, resolve } from 'node:path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export default defineConfig({
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: ['./vitest.setup.ts'],
    include: ['src/**/*.{test,spec}.{ts,tsx}', 'tests/**/*.{test,spec}.{ts,tsx}'],

    coverage: {
      provider: 'istanbul',
      reporter: ['text', 'lcov', 'json-summary', 'html'],
      reportsDirectory: './coverage',
      all: true,
      clean: true,
      exclude: [
        'node_modules/',
        'dist/',
        'coverage/',
        'tests/',
        '**/*.d.ts',
        '**/*.test.{ts,tsx}',
        '**/*.spec.{ts,tsx}',
        '**/index.ts', // Usually just exports
        '**/*.config.{ts,js,mjs}',
        '**/tsup.config.ts',
        '**/vitest.config.mjs',
      ],
      thresholds: {
        global: {
          branches: 80,
          functions: 80,
          lines: 80,
          statements: 80,
        },
      },
    },

    // Test behavior
    restoreMocks: true,
    testTimeout: 10_000,
    hookTimeout: 10_000,

    // Reporters
    reporters: ['default', 'verbose'],

    // Watch options
    watch: {
      include: ['src/**/*', 'tests/**/*'],
    },
  },

  resolve: {
    alias: {
      '@': resolve(__dirname, './src'),
      '~': resolve(__dirname, './src'),
    },
  },

  // Define global variables for tests
  define: {
    'import.meta.vitest': undefined,
  },
});
