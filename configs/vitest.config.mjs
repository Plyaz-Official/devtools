import { defineConfig } from 'vitest/config';
import { fileURLToPath } from 'node:url';
import { dirname, resolve } from 'node:path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export default defineConfig({
  test: {
    // Environment
    environment: 'jsdom',
    globals: true,

    // Environment variables
    env: {
      NODE_ENV: 'test',
    },

    // Setup
    setupFiles: ['./vitest.setup.ts'],

    // Test file patterns
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
    clearMocks: true,
    testTimeout: 10_000,
    hookTimeout: 10_000,

    // Reporters
    reporters: ['default', 'verbose'],

    // Watch options
    watch: {
      include: ['src/**/*', 'tests/**/*'],
    },

    // Pool options for better performance
    pool: 'threads',
    poolOptions: {
      threads: {
        singleThread: false,
        isolate: true,
      },
    },
  },

  // Module resolution
  resolve: {
    alias: {
      '@': resolve(__dirname, './src'),
      '~': resolve(__dirname, './src'),
    },
  },

  // Define global variables for tests
  define: {
    'import.meta.vitest': 'undefined',
  },

  // ESBuild options
  esbuild: {
    target: 'node22',
  },
});
