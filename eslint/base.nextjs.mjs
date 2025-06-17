import typescriptEslint from 'typescript-eslint';
import nextPlugin from '@next/eslint-plugin-next';
import reactPlugin from 'eslint-plugin-react';
import reactHooksPlugin from 'eslint-plugin-react-hooks';
import jsxA11yPlugin from 'eslint-plugin-jsx-a11y';
import tailwindcssPlugin from ' eslint-plugin-better-tailwindcss';
import process from 'node:process';

import {
  createBaseConfigs,
  createTypeScriptConfig,
  createSecurityConfig,
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
 * ESLint configuration for Next.js frontend applications.
 * Includes React, Next.js, and accessibility rules.
 */
export function createBaseConfig({
  tsconfigDir = process.cwd(),
  cssFilePath = 'src/global.css',
  tailwindConfig = 'tailwind.config.ts',
} = {}) {
  return typescriptEslint.config(
    // Ignore patterns
    {
      name: 'plyaz/frontend',
      ignores: [
        ...COMMON_IGNORE_PATTERNS,
        '**/.next/**',
        '**/public/**',
        '**/.vercel/**',
        '**/storybook-static/**',
        '**/next.config.js',
        '**/tailwind.config.js',
        '**/postcss.config.js',
      ],
    },

    // Base configurations
    ...createBaseConfigs(),

    // Next.js configuration
    {
      name: 'plyaz/next',
      files: ['**/*.{js,jsx,ts,tsx}'],
      plugins: {
        '@next/next': nextPlugin,
      },
      rules: {
        ...nextPlugin.configs.recommended.rules,
        ...nextPlugin.configs['core-web-vitals'].rules,
      },
      settings: {
        next: {
          rootDir: '.',
        },
      },
    },

    // React configuration
    {
      name: 'plyaz/react',
      files: ['**/*.{jsx,tsx}'],
      plugins: {
        react: reactPlugin,
        'react-hooks': reactHooksPlugin,
        'jsx-a11y': jsxA11yPlugin,
      },
      languageOptions: {
        parser: typescriptEslint.parser,
        parserOptions: {
          ecmaFeatures: {
            jsx: true,
          },
        },
      },
      settings: {
        react: {
          version: 'detect',
        },
      },
      rules: {
        // React Core Rules
        'react/react-in-jsx-scope': 'off', // Not needed in Next.js 13+
        'react/prop-types': 'off', // Using TypeScript
        'react/display-name': 'error',
        'react/jsx-key': [
          'error',
          {
            checkFragmentShorthand: true,
            checkKeyMustBeforeSpread: true,
            warnOnDuplicates: true,
          },
        ],
        'react/jsx-no-target-blank': [
          'error',
          {
            allowReferrer: false,
            enforceDynamicLinks: 'always',
            warnOnSpreadAttributes: true,
          },
        ],
        'react/jsx-no-leaked-render': [
          'error',
          {
            validStrategies: ['ternary', 'coerce'],
          },
        ],
        'react/jsx-no-useless-fragment': [
          'error',
          {
            allowExpressions: true,
          },
        ],
        'react/no-array-index-key': 'error',
        'react/no-danger': 'error',
        'react/no-unstable-nested-components': [
          'error',
          {
            allowAsProps: true,
          },
        ],
        'react/self-closing-comp': [
          'error',
          {
            component: true,
            html: true,
          },
        ],
        'react/jsx-no-bind': [
          'error',
          {
            allowArrowFunctions: true,
            allowBind: false,
            allowFunctions: false,
          },
        ],

        // React Hooks Rules
        'react-hooks/rules-of-hooks': 'error',
        'react-hooks/exhaustive-deps': 'error',

        // Accessibility Rules (critical for Web3 platforms)
        'jsx-a11y/alt-text': 'error',
        'jsx-a11y/anchor-has-content': 'error',
        'jsx-a11y/anchor-is-valid': 'error',
        'jsx-a11y/aria-props': 'error',
        'jsx-a11y/aria-proptypes': 'error',
        'jsx-a11y/aria-role': 'error',
        'jsx-a11y/click-events-have-key-events': 'error',
        'jsx-a11y/heading-has-content': 'error',
        'jsx-a11y/iframe-has-title': 'error',
        'jsx-a11y/img-redundant-alt': 'error',
        'jsx-a11y/interactive-supports-focus': 'error',
        'jsx-a11y/label-has-associated-control': 'error',
        'jsx-a11y/no-autofocus': 'error',
        'jsx-a11y/no-redundant-roles': 'error',
        'jsx-a11y/role-has-required-aria-props': 'error',
        'jsx-a11y/tabindex-no-positive': 'error',
      },
    },

    // Tailwind CSS configuration
    {
      name: 'plyaz/tailwind',
      files: ['**/*.{jsx,tsx}'],
      plugins: {
        'better-tailwindcss': tailwindcssPlugin,
      },
      settings: {
        'better-tailwindcss': {
          entryPoint: cssFilePath,
          tailwindConfig: tailwindConfig,
        },
      },
    },

    // Core configurations
    createTypeScriptConfig({ tsconfigDir }),
    createSecurityConfig(),
    createPromiseConfig(),
    createSonarConfig(),
    createRegexConfig(),
    createWeb3Config(), // Frontend handles wallet connections
    createPerformanceConfig(),
    createImportConfig({ tsconfigDir }),
    createUnicornConfig({
      additionalIgnorePatterns: [
        'unicorn/prefer-keyboard-event-key',
        'unicorn/prefer-modern-dom-apis',
        'unicorn/prefer-query-selector',
      ],
    }),
    createBestPracticesConfig({
      allowConsole: false, // Stricter for frontend
      complexityMax: 10,
    }),
    createNamingConventionsConfig(),
    createFileNamingConfig(),

    // Frontend-specific overrides
    {
      name: 'plyaz/pages-and-app-router',
      files: [
        'app/**/*.{js,jsx,ts,tsx}',
        'pages/**/*.{js,jsx,ts,tsx}',
        'src/app/**/*.{js,jsx,ts,tsx}',
        'src/pages/**/*.{js,jsx,ts,tsx}',
      ],
      rules: {
        'import/no-default-export': 'off',
        'import/prefer-default-export': 'error',
      },
    },

    {
      name: 'plyaz/react-component-naming',
      files: ['**/*.{jsx,tsx}'],
      rules: {
        // Enhanced import rules for React
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
      },
    },

    {
      name: 'plyaz/storybook-naming',
      files: ['**/*.stories.{ts,tsx,js,jsx}'],
      rules: {
        'import/no-default-export': 'off',
        '@typescript-eslint/naming-convention': [
          'error',
          // Story exports must be PascalCase and descriptive
          {
            selector: 'variable',
            format: ['PascalCase'],
            custom: {
              regex:
                '^(Primary|Secondary|Large|Small|With|Without|Default|Error|Success|Loading)[A-Z]',
              match: false, // Allow any PascalCase, but encourage descriptive names
            },
          },
        ],
      },
    },

    // CSS naming enforcement
    {
      name: 'plyaz/css-naming',
      files: ['**/*.{css,less,scss}'],
      rules: {
        'no-restricted-syntax': [
          'error',
          // Enforce CSS class naming
          {
            selector: 'Literal[value=/className.*[A-Z]/]',
            message: 'CSS classnames should use kebab-case (button-primary ✓, buttonPrimary ✗)',
          },
          // Enforce variant keys are singular
          {
            selector: 'Property[key.name="variants"] Property[key.name=/s$/]',
            message:
              'Variant keys should be singular form (variant="primary" ✓, variants="primary" ✗)',
          },
        ],
      },
    },

    // Common overrides
    ...createCommonOverrides()
  );
}
