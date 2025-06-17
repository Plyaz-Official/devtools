import typescriptEslint from 'typescript-eslint';
import nestjsTypedPlugin from '@darraghor/eslint-plugin-nestjs-typed';
import nodePlugin from 'eslint-plugin-n';
import process from 'node:process';

import {
  createBaseConfigs,
  createBackendTypeScriptConfig,
  createBackendSecurityConfig,
  createPromiseConfig,
  createSonarConfig,
  createRegexConfig,
  createWeb3Config,
  createPerformanceConfig,
  createImportConfig,
  createUnicornConfig,
  createBestPracticesConfig,
  createNamingConventionsConfig,
  createFileNamingConfig,
  createCommonOverrides,
  COMMON_IGNORE_PATTERNS,
} from './config/index.mjs';

/**
 * ESLint configuration for NestJS backend services.
 * Includes Node.js and NestJS specific rules.
 */
export function createBaseConfig({ tsconfigDir = process.cwd() } = {}) {
  return typescriptEslint.config(
    // Ignore patterns
    {
      name: 'plyaz/backend',
      ignores: [
        ...COMMON_IGNORE_PATTERNS,
        '**/logs/**',
        '**/prisma/migrations/**',
        '**/database/migrations/**',
        '**/hardhat.config.ts',
      ],
    },

    // Base configurations
    ...createBaseConfigs(),

    // NestJS specific configuration
    {
      name: 'plyaz/nestjs',
      files: ['**/*.{js,ts}'],
      plugins: {
        '@darraghor/nestjs-typed': nestjsTypedPlugin,
      },
      rules: {
        // Use flat config rules from the plugin
        ...nestjsTypedPlugin.configs.flatRecommended.rules,

        // Additional NestJS specific rules
        '@darraghor/nestjs-typed/injectable-should-be-provided': 'error',
        '@darraghor/nestjs-typed/param-decorator-name-matches-route-param': 'error',
        '@darraghor/nestjs-typed/validate-nested-of-array-should-set-each': 'error',
        '@darraghor/nestjs-typed/controllers-should-supply-api-tags': 'error',
        '@darraghor/nestjs-typed/api-property-matches-property-optionality': 'error',
        '@darraghor/nestjs-typed/api-enum-property-best-practices': 'error',
        '@darraghor/nestjs-typed/api-property-returning-array-should-set-array': 'error',
        '@darraghor/nestjs-typed/should-specify-forbid-unknown-values': 'error',
        '@darraghor/nestjs-typed/validated-non-primitive-property-needs-type-decorator': 'error',
        '@darraghor/nestjs-typed/use-validation-pipe': 'error',
      },
      settings: {
        '@darraghor/nestjs-typed': {
          filterFromPaths: [
            'node_modules',
            '.eslintrc.js',
            '*.spec.ts',
            '*.test.ts',
            'test/',
            'tests/',
            'migrations/',
            'seeds/',
          ],
        },
      },
    },

    // Node.js specific configuration
    {
      name: 'plyaz/nestjs-node',
      files: ['**/*.{js,ts}'],
      plugins: {
        n: nodePlugin,
      },
      rules: {
        'n/no-deprecated-api': 'error',
        'n/no-extraneous-import': 'error',
        'n/no-extraneous-require': 'error',
        'n/no-missing-import': 'off', // Handled by TypeScript
        'n/no-missing-require': 'off', // Handled by TypeScript
        'n/no-unpublished-import': [
          'error',
          {
            allowModules: [
              '@nestjs/testing',
              '@types/*',
              'jest',
              'supertest',
              'ts-jest',
              'ts-node',
            ],
          },
        ],
        'n/no-unpublished-require': [
          'error',
          {
            allowModules: [
              '@nestjs/testing',
              '@types/*',
              'jest',
              'supertest',
              'ts-jest',
              'ts-node',
            ],
          },
        ],
        'n/no-unsupported-features/es-builtins': 'error',
        'n/no-unsupported-features/es-syntax': 'off', // Using TypeScript
        'n/no-unsupported-features/node-builtins': 'error',
        'n/prefer-global/buffer': ['error', 'always'],
        'n/prefer-global/console': ['error', 'always'],
        'n/prefer-global/process': ['error', 'always'],
        'n/prefer-global/url-search-params': ['error', 'always'],
        'n/prefer-global/url': ['error', 'always'],
        'n/prefer-promises/dns': 'error',
        'n/prefer-promises/fs': 'error',
      },
    },

    // Core configurations
    createBackendTypeScriptConfig({ tsconfigDir }),
    createBackendSecurityConfig(),
    createPromiseConfig(),
    createSonarConfig(),
    createRegexConfig(),
    createWeb3Config(), // Backend handles blockchain transactions
    createPerformanceConfig(),
    createImportConfig({ tsconfigDir, backend: true }),
    createUnicornConfig({
      allowProcessExit: true, // Needed in NestJS apps
    }),
    createBestPracticesConfig({
      allowConsole: true, // Allow structured logging
      complexityMax: 15, // Higher for backend business logic
    }),
    createNamingConventionsConfig(),
    createFileNamingConfig(),

    // Backend-specific overrides
    {
      name: 'plyaz/nestjs-main-files',
      files: ['**/main.ts', '**/bootstrap.ts', '**/app.module.ts'],
      rules: {
        'no-console': 'off', // Allow console in main files for startup logs
        'unicorn/no-process-exit': 'off',
      },
    },

    {
      name: 'plyaz/nestjs-database-files',
      files: [
        '**/migrations/**/*.{js,ts}',
        '**/seeds/**/*.{js,ts}',
        '**/database/**/*.{js,ts}',
        '**/prisma/**/*.{js,ts}',
      ],
      rules: {
        'no-magic-numbers': 'off',
        '@typescript-eslint/explicit-function-return-type': 'off',
        'unicorn/filename-case': 'off',
        'import/no-default-export': 'off',
      },
    },

    {
      name: 'plyaz/nestjs-test-overrides',
      files: [
        '**/__tests__/**/*.{js,ts}',
        '**/*.{test,spec}.{js,ts}',
        '**/test/**/*.{js,ts}',
        '**/tests/**/*.{js,ts}',
      ],
      rules: {
        '@darraghor/nestjs-typed/injectable-should-be-provided': 'off',
      },
    },

    // Common overrides
    ...createCommonOverrides()
  );
}
