import { defineConfig } from 'eslint/config';
import { FlatCompat } from '@eslint/eslintrc';
import js from '@eslint/js';
import typescriptEslint from 'typescript-eslint';

// Plugin imports
import reactPlugin from 'eslint-plugin-react';
import reactHooksPlugin from 'eslint-plugin-react-hooks';
import reactRefreshPlugin from 'eslint-plugin-react-refresh';
import jsxA11yPlugin from 'eslint-plugin-jsx-a11y';
import tailwindcssPlugin from 'eslint-plugin-better-tailwindcss';
import storybookPlugin from 'eslint-plugin-storybook';
import importPlugin from 'eslint-plugin-import';
import process from 'node:process'

// Universal system imports
import {
  createPluginConfig,
  createTypeScriptConfig,
  createNamingConventionsConfig,
  createWeb3Config,
  createReactConfig,
  createCommonOverrides,
  COMMON_IGNORE_PATTERNS,
} from './config/index.mjs';

/**
 * Flexible frontend configuration with full customization options
 * Supports Next.js, Vite, React, Storybook, Tailwind, and more
 */
export function createBaseConfig({
  // TypeScript settings
  tsconfigDir = process.cwd(),

  // React/Next.js settings
  enableReact = true,
  enableNextjs = true,
  enableReactHooks = true,
  enableReactRefresh = true,
  enableJsxA11y = true,

  // Tool integrations
  enableStorybook = true,
  enableTailwind = true,
  enablePrettier = true,
  enableImport = true,

  // Tailwind specific
  cssFilePath = 'src/global.css',
  tailwindConfig = 'tailwind.config.ts',

  // Next.js specific
  baseDirectory = process.cwd(),
  rootDir = '.',
  appDirs = ['src/app'],

  // Security and quality
  enableWeb3Rules = true,
  enableSmartNaming = true,

  // Custom overrides
  customRules = {},
  additionalPlugins = [],
  additionalConfigs = [],
} = {}) {
  const configs = [
    // Ignore patterns
    {
      name: 'plyaz/frontend-ignores',
      ignores: COMMON_IGNORE_PATTERNS,
    },

    js.configs.recommended,
    ...typescriptEslint.configs.recommended,
    createTypeScriptConfig({ tsconfigDir }),

    // Additional configs from user
    ...additionalConfigs,
  ];

  // ✅ Import plugin configuration (conditional)
  if (enableImport) {
    configs.push(
      createPluginConfig(importPlugin, 'import', {
        files: ['**/*.{js,jsx,ts,tsx}'],
        configName: 'recommended',
        additionalRules: {
          'import/order': [
            'error',
            {
              groups: ['builtin', 'external', 'internal', 'parent', 'sibling', 'index'],
              'newlines-between': 'always',
              alphabetize: {
                order: 'asc',
                caseInsensitive: true,
              },
            },
          ],
          'import/no-unresolved': 'off', // Handled by TypeScript
          'import/named': 'off', // Handled by TypeScript
          'import/namespace': 'off', // Handled by TypeScript
          'import/default': 'off', // Handled by TypeScript
          'import/export': 'off', // Handled by TypeScript
          'import/no-named-as-default': 'off', // Handled by TypeScript
          'import/no-named-as-default-member': 'off', // Handled by TypeScript
          'import/no-duplicates': 'error',
          'import/first': 'error',
          'import/newline-after-import': 'error',
        },
      })
    );
  }

  // React ecosystem (conditional - skip if Next.js is enabled)
  if (enableReact && !enableNextjs) {
    configs.push(
      createReactConfig(reactPlugin, 'react', {
        files: ['**/*.{jsx,tsx}'],
        configName: 'recommended',
        additionalRules: {
          'react/react-in-jsx-scope': 'off', // Not needed in Next.js/modern React
          'react/prop-types': 'off', // Using TypeScript
          'react/jsx-no-target-blank': [
            'error',
            {
              allowReferrer: false,
              enforceDynamicLinks: 'always',
              warnOnSpreadAttributes: true,
            },
          ],
          'react/no-danger': 'error', // Critical for Web3 security
        },
      })
    );
  }

  // React hooks (works with both standalone React and Next.js)
  if (enableReactHooks && enableReact) {
    configs.push(
      createPluginConfig(reactHooksPlugin, 'react-hooks', {
        files: ['**/*.{jsx,tsx}'],
      })
    );
  }

  // React refresh (only for non-Next.js React setups)
  if (enableReactRefresh && enableReact && !enableNextjs) {
    configs.push(
      createPluginConfig(reactRefreshPlugin, 'react-refresh', {
        files: ['**/*.{jsx,tsx}'],
      })
    );
  }

  // JSX A11y (works with both standalone React and Next.js)
  if (enableJsxA11y && enableReact) {
    configs.push(
      createPluginConfig(jsxA11yPlugin, 'jsx-a11y', {
        files: ['**/*.{jsx,tsx}'],
      })
    );
  }

  // Optional tool integrations
  if (enableStorybook) {
    // ✅ Temporarily use a safer approach for Storybook
    configs.push(
      {
        name: 'plyaz/storybook-manual',
        files: ['**/*.stories.{js,jsx,ts,tsx}', '**/.storybook/**/*.{js,jsx,ts,tsx}'],
        plugins: {
          storybook: storybookPlugin,
        },
        rules: {
          // Manually specify safe storybook rules
          'storybook/await-interactions': 'error',
          'storybook/context-in-play-function': 'error',
          'storybook/default-exports': 'error',
          'storybook/hierarchy-separator': 'warn',
          'storybook/no-redundant-story-name': 'warn',
          'storybook/prefer-pascal-case': 'warn',
          'storybook/story-exports': 'error',
          'storybook/use-storybook-expect': 'error',
          'storybook/use-storybook-testing-library': 'error',
        },
      },
      {
        name: 'plyaz/storybook-overrides',
        files: ['**/*.stories.{js,jsx,ts,tsx}'],
        rules: {
          ...(enableImport && { 'import/no-default-export': 'off' }),
        },
      }
    );
  }

  if (enableTailwind) {
    configs.push(
      createPluginConfig(tailwindcssPlugin, 'better-tailwindcss', {
        files: ['**/*.{jsx,tsx}'],
        configName: 'recommended',
      }),
      {
        name: 'plyaz/tailwind-settings',
        files: ['**/*.{jsx,tsx}'],
        settings: {
          'better-tailwindcss': {
            entryPoint: cssFilePath,
            tailwindConfig: tailwindConfig,
          },
        },
      }
    );
  }

  // Security and best practices (conditional)
  if (enableWeb3Rules) {
    configs.push(createWeb3Config());
  }

  if (enableSmartNaming) {
    configs.push(createNamingConventionsConfig());
  }

  // Next.js integration (conditional)
  if (enableNextjs) {
    const compat = new FlatCompat({
      baseDirectory,
      recommendedConfig: js.configs.recommended,
    });

    configs.push(
      ...compat.config({
        extends: ['next/core-web-vitals', 'next'],
        overrides: appDirs.map(appDir => ({
          files: [`${appDir}/**/*`],
          rules: {
            '@next/next/no-html-link-for-pages': ['error', appDir],
          },
        })),
        settings: {
          next: { rootDir },
        },
      }),
      {
        name: 'plyaz/nextjs-overrides',
        files: [
          'app/**/*.{js,jsx,ts,tsx}',
          'pages/**/*.{js,jsx,ts,tsx}',
          'src/app/**/*.{js,jsx,ts,tsx}',
          'src/pages/**/*.{js,jsx,ts,tsx}',
        ],
        rules: {
          ...(enableImport && {
            'import/no-default-export': 'off', // Next.js pages need default exports
            'import/prefer-default-export': 'error',
          }),
        },
      }
    );
  }

  // Additional plugins from user
  configs.push(...additionalPlugins);

  // Frontend-specific rules
  configs.push({
    name: 'plyaz/frontend-specific',
    files: ['**/*.{jsx,tsx,ts,js}'],
    rules: {
      'no-console': ['warn', { allow: ['warn', 'error', 'info'] }],
      complexity: ['error', 10],
      ...(enableImport && {
        'import/no-anonymous-default-export': [
          'error',
          {
            allowArray: false,
            allowArrowFunction: false,
            allowAnonymousClass: false,
            allowAnonymousFunction: false,
            allowCallExpression: true,
            allowNew: false,
            allowLiteral: false,
            allowObject: false,
          },
        ],
      }),
      ...customRules,
    },
  });

  // Prettier compatibility (conditional)
  if (enablePrettier) {
    configs.push({
      name: 'plyaz/prettier-compatibility',
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
        // React formatting rules
        'react/jsx-indent': 'off',
        'react/jsx-indent-props': 'off',
        'react/jsx-curly-spacing': 'off',
        'react/jsx-equals-spacing': 'off',
        'react/jsx-tag-spacing': 'off',
        'react/jsx-wrap-multilines': 'off',
      },
    });
  }

  // Common overrides
  configs.push(...createCommonOverrides());

  return defineConfig(configs);
}

/**
 * 🎯 SIMPLE PRESETS FOR COMMON USE CASES
 * But you can still use createBaseConfig for full flexibility!
 */
export const presets = {
  nextjs: (options = {}) =>
    createBaseConfig({
      enableNextjs: true,
      enableReact: true,
      enableReactRefresh: false,
      enableStorybook: true,
      enableTailwind: true,
      enablePrettier: true,
      enableImport: true,
      ...options,
    }),

  // Vite + React stack - uses standalone React plugins
  viteReact: (options = {}) =>
    createBaseConfig({
      enableNextjs: false,
      enableReact: true,
      enableReactRefresh: true,
      enableStorybook: true,
      enableTailwind: true,
      enablePrettier: true,
      enableImport: true,
      ...options,
    }),

  // Minimal React (no extra tools)
  reactOnly: (options = {}) =>
    createBaseConfig({
      enableNextjs: false,
      enableReact: true,
      enableReactRefresh: true,
      enableStorybook: false,
      enableTailwind: false,
      enablePrettier: true,
      enableImport: true,
      ...options,
    }),

  // Pure TypeScript (no React)
  typescript: (options = {}) =>
    createBaseConfig({
      enableNextjs: false,
      enableReact: false,
      enableStorybook: false,
      enableTailwind: false,
      enablePrettier: true,
      enableImport: true,
      ...options,
    }),
};
