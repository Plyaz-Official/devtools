import { defineConfig } from 'eslint/config';
import js from '@eslint/js';
import typescriptEslint from 'typescript-eslint';

// Plugin imports
import nestjsTypedPlugin from '@darraghor/eslint-plugin-nestjs-typed';
import nodePlugin from 'eslint-plugin-n';

// Universal system imports
import {
  createPluginConfig,
  createNamingConventionsConfig,
  createWeb3Config,
  createCommonOverrides,
  COMMON_IGNORE_PATTERNS,
} from './config/index.mjs';

/**
 * Backend configuration for NestJS + Node.js + Prettier
 * Uses universal plugin system to handle API inconsistencies
 */
export function createBaseConfig({
  enableNestjs = true,
  enableNodejs = true,
  enablePrettier = true,
  customRules = {},
} = {}) {
  const configs = [
    // Ignore patterns
    {
      name: 'plyaz/backend-ignores',
      ignores: [
        ...COMMON_IGNORE_PATTERNS,
        '**/logs/**',
        '**/prisma/migrations/**',
        '**/database/migrations/**',
        '**/hardhat.config.ts',
      ],
    },

    // Base JS and TypeScript
    js.configs.recommended,

    // Enhanced TypeScript for backend
    {
      name: 'plyaz/backend-typescript-enhanced',
      files: ['**/*.{ts,js}'],
      plugins: {
        '@typescript-eslint': typescriptEslint.plugin,
      },
      rules: {
        '@typescript-eslint/explicit-function-return-type': [
          'error',
          {
            allowExpressions: true,
            allowTypedFunctionExpressions: true,
            allowHigherOrderFunctions: true,
          },
        ],
        '@typescript-eslint/explicit-member-accessibility': [
          'error',
          {
            accessibility: 'explicit',
            overrides: {
              constructors: 'off',
              parameterProperties: 'explicit',
            },
          },
        ],
      },
    },

    // Security and Web3 rules
    createWeb3Config(),

    // Naming conventions
    createNamingConventionsConfig(),

    // Backend-specific rules
    {
      name: 'plyaz/backend-specific',
      files: ['**/*.{ts,js}'],
      rules: {
        'no-console': 'off', // Allow structured logging
        complexity: ['warn', 15], // Higher for business logic
        ...customRules,
      },
    },

    // Common overrides
    ...createCommonOverrides(),
  ];

  // Conditionally add NestJS
  if (enableNestjs) {
    configs.push(
      createPluginConfig(nestjsTypedPlugin, '@darraghor/nestjs-typed', {
        files: ['**/*.{ts,js}'],
        additionalRules: {},
      }),

      // NestJS specific overrides
      {
        name: 'plyaz/nestjs-overrides',
        files: ['**/main.ts', '**/bootstrap.ts', '**/app.module.ts'],
        rules: {
          'no-console': 'off',
          'unicorn/no-process-exit': 'off',
        },
      },

      {
        name: 'plyaz/nestjs-database',
        files: [
          '**/migrations/**/*.{js,ts}',
          '**/seeds/**/*.{js,ts}',
          '**/database/**/*.{js,ts}',
          '**/prisma/**/*.{js,ts}',
        ],
        rules: {
          'no-magic-numbers': 'off',
          '@typescript-eslint/explicit-function-return-type': 'off',
          'import/no-default-export': 'off',
        },
      },

      {
        name: 'plyaz/nestjs-test-overrides',
        files: ['**/*.{test,spec}.{js,ts}'],
        rules: {},
      }
    );

    // NestJS plugin settings
    configs.push({
      name: 'plyaz/nestjs-settings',
      files: ['**/*.{ts,js}'],
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
    });
  }

  // Conditionally add Node.js
  if (enableNodejs) {
    configs.push(
      createPluginConfig(nodePlugin, 'n', {
        files: ['**/*.{ts,js}'],
        additionalRules: {
          'n/no-missing-import': 'off', // Handled by TypeScript
          'n/no-missing-require': 'off', // Handled by TypeScript
          'n/no-unsupported-features/es-syntax': 'off', // Using TypeScript
          'n/no-unpublished-import': 'off', // ✅ Disable problematic rule
          'n/no-unpublished-require': 'off', // ✅ Disable problematic rule
          'n/prefer-global/buffer': ['error', 'always'],
          'n/prefer-global/console': ['error', 'always'],
          'n/prefer-global/process': ['error', 'always'],
          'n/prefer-promises/dns': 'error',
          'n/prefer-promises/fs': 'error',
        },
      })
    );
  }

  // Prettier compatibility (conditionally)
  if (enablePrettier) {
    configs.push({
      name: 'plyaz/prettier-compatibility-backend',
      rules: {
        // Disable key formatting rules that conflict with Prettier
        indent: 'off',
        quotes: 'off',
        semi: 'off',
        'comma-dangle': 'off',
        'brace-style': 'off',
        'object-curly-spacing': 'off',
        'array-bracket-spacing': 'off',
        'space-before-function-paren': 'off',
        '@typescript-eslint/indent': 'off',
        '@typescript-eslint/quotes': 'off',
        '@typescript-eslint/semi': 'off',
        '@typescript-eslint/comma-dangle': 'off',
        '@typescript-eslint/brace-style': 'off',
        '@typescript-eslint/object-curly-spacing': 'off',
        '@typescript-eslint/space-before-function-paren': 'off',
      },
    });
  }

  return defineConfig(configs);
}

/**
 * Simplified presets for common backend use cases
 */
export const presets = {
  // Full NestJS stack
  nestjs: (options = {}) =>
    createBaseConfig({
      enableNestjs: true,
      enableNodejs: true,
      enablePrettier: true,
      ...options,
    }),

  // Express + Node.js stack
  express: (options = {}) =>
    createBaseConfig({
      enableNestjs: false,
      enableNodejs: true,
      enablePrettier: true,
      ...options,
    }),

  // Pure Node.js (no framework)
  nodejs: (options = {}) =>
    createBaseConfig({
      enableNestjs: false,
      enableNodejs: true,
      enablePrettier: true,
      ...options,
    }),
};
