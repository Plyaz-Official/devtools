import { defineConfig } from 'vitest/config';
import { resolve } from 'node:path';
import process from 'node:process';

export const createVitestConfig = rootDir => {
  return defineConfig({
    test: {
      // Environment
      environment: 'happy-dom', // faster and lighter
      globals: true,
      exclude: ['**/node_modules/**'],
      // Run tests sequentially to avoid memory issues
      maxConcurrency: 1,

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
          'tests/',
          '**/*.d.ts',
          '**/*.config.*',
          '**/coverage/**',
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
      clearMocks: true,
      restoreMocks: true,
      mockReset: true,
      // Set test timeout
      testTimeout: 30_000,
      hookTimeout: 10_000,

      // Watch options
      watch: !process.env.CI
        ? false
        : {
            include: ['src/**/*', 'tests/**/*'],
          },

      // Pool options for better performance
      pool: 'forks',
      poolOptions: {
        threads: {
          maxThreads: 4,
          minThreads: 1,
        },
      },
      // Environment-specific settings
      environmentOptions: {
        jsdom: {
          resources: 'usable',
        },
      },
    },
    // Add isolation to prevent memory leaks between tests
    isolate: true,
    // Clear mocks between tests
    clearMocks: true,
    restoreMocks: true,

    // Module resolution
    resolve: {
      alias: {
        '@': resolve(rootDir, './src'),
        '~': resolve(rootDir, './src'),
        tests: resolve(rootDir, './tests'),
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
};
