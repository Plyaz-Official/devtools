import { defineConfig } from 'eslint/config';
import js from '@eslint/js';

// Plugin imports
import reactPlugin from 'eslint-plugin-react';
import jsxA11yPlugin from 'eslint-plugin-jsx-a11y';
import tailwindcssPlugin from 'eslint-plugin-better-tailwindcss';
import nodePlugin from 'eslint-plugin-n';
import process from 'node:process';

// Universal system imports
import {
  createPluginConfig,
  createSharedPackageTypeScriptConfig,
  createNamingConventionsConfig,
  createWeb3Config,
  createReactConfig,
  createCommonOverrides,
  COMMON_IGNORE_PATTERNS,
} from './config/index.mjs';

/**
 * Environment detection utilities
 */
const EnvironmentDetectors = {
  /**
   * Detect if current package/service is Node.js environment
   * Based on package.json type, dependencies, and explicit config
   */
  isNodeEnvironment(packageJson = {}) {
    // Check package.json indicators
    const hasNodeDeps =
      packageJson.dependencies &&
      (packageJson.dependencies['@nestjs/core'] ||
        packageJson.dependencies['express'] ||
        packageJson.dependencies['fastify'] ||
        packageJson.dependencies['node:fs'] ||
        packageJson.dependencies['fs-extra']);

    const hasNodeDevDeps =
      packageJson.devDependencies &&
      (packageJson.devDependencies['@types/node'] || packageJson.devDependencies['nodemon']);

    return (
      packageJson.type === 'module' ||
      hasNodeDeps ||
      hasNodeDevDeps ||
      packageJson.main?.includes('dist/') ||
      packageJson.scripts?.start?.includes('node')
    );
  },

  /**
   * Detect if current package/service uses React
   */
  isReactEnvironment(packageJson = {}) {
    const hasReactDeps =
      packageJson.dependencies &&
      (packageJson.dependencies['react'] ||
        packageJson.dependencies['@types/react'] ||
        packageJson.dependencies['next']);

    const hasReactDevDeps =
      packageJson.devDependencies &&
      (packageJson.devDependencies['react'] || packageJson.devDependencies['@types/react']);

    return hasReactDeps || hasReactDevDeps;
  },

  /**
   * Detect if current package uses Tailwind
   */
  isTailwindEnvironment(packageJson = {}) {
    const hasTailwindDeps =
      packageJson.dependencies &&
      (packageJson.dependencies['tailwindcss'] ||
        packageJson.dependencies['@tailwindcss/typography']);

    const hasTailwindDevDeps =
      packageJson.devDependencies &&
      (packageJson.devDependencies['tailwindcss'] ||
        packageJson.devDependencies['@tailwindcss/typography']);

    return hasTailwindDeps || hasTailwindDevDeps;
  },
};

/**
 * Fullstack shared packages configuration
 * Auto-detects environment based on package.json and explicit overrides
 * Uses universal plugin system to handle all environments
 */
export function createBaseConfig({
  tsconfigDir = process.cwd(),
  enableReact = null, // null = auto-detect
  enableNode = null, // null = auto-detect
  enableTailwind = null, // null = auto-detect
  enablePrettier = true,
  packageType = 'utility', // 'utility' | 'ui' | 'types' | 'constants'
  strictness = 'high', // 'low' | 'medium' | 'high'
  customRules = {},
  packageJson = {}, // Pass package.json for auto-detection
  // File pattern overrides for specific environments
  nodeFilePatterns = ['**/*.{js,ts}'], // Default: all files if Node detected
  reactFilePatterns = ['**/*.{jsx,tsx}'], // Default: JSX/TSX files if React detected
  tailwindFilePatterns = ['**/*.{jsx,tsx}'], // Default: JSX/TSX files if Tailwind detected
} = {}) {
  // Auto-detect environments if not explicitly set
  const detectedNode = enableNode ?? EnvironmentDetectors.isNodeEnvironment(packageJson);
  const detectedReact = enableReact ?? EnvironmentDetectors.isReactEnvironment(packageJson);
  const detectedTailwind =
    enableTailwind ?? EnvironmentDetectors.isTailwindEnvironment(packageJson);

  const configs = [
    // Ignore patterns
    {
      name: 'plyaz/fullstack-ignores',
      ignores: [
        ...COMMON_IGNORE_PATTERNS,
        '**/storybook-static/**',
        '**/lib/**/*.js', // Build outputs
        '**/esm/**/*.js', // Build outputs
        '**/cjs/**/*.js', // Build outputs
        '**/dist/**', // Build outputs
      ],
    },

    // Base JS and strict TypeScript for shared packages
    js.configs.recommended,
    createSharedPackageTypeScriptConfig({ tsconfigDir }),

    // Security and Web3 rules (important for all shared packages)
    createWeb3Config(),

    // Naming conventions
    createNamingConventionsConfig(),

    // Shared package base rules
    {
      name: 'plyaz/shared-package-base',
      files: ['**/*.{js,ts,tsx}'],
      rules: {
        // Strictness based on level
        complexity: ['warn', strictness === 'high' ? 8 : strictness === 'medium' ? 12 : 20],
        'max-lines-per-function': [
          'error',
          strictness === 'high' ? 120 : strictness === 'medium' ? 80 : 250,
        ],
        'max-params': ['error', strictness === 'high' ? 4 : strictness === 'medium' ? 6 : 8],
        'max-depth': ['error', strictness === 'high' ? 3 : strictness === 'medium' ? 4 : 5],

        // Allow console for debugging utilities but warn
        'no-console': strictness === 'high' ? 'warn' : 'off',

        // Shared package specific rules
        'no-magic-numbers': [
          'error',
          {
            ignore: [-1, 0, 1, 2, 10, 100, 1000, 18, 1e18, 21000, 8, 6],
            ignoreArrayIndexes: true,
            ignoreDefaultValues: true,
            detectObjects: false,
            enforceConst: true,
            ignoreClassFieldInitialValues: true,
          },
        ],

        ...customRules,
      },
    },

    // Common overrides
    ...createCommonOverrides(),
  ];

  // Conditionally add React support based on detection/override
  if (detectedReact) {
    configs.push(
      createReactConfig(reactPlugin, 'react', {
        files: reactFilePatterns,
        additionalRules: {
          'react/react-in-jsx-scope': 'off', // Modern React
          'react/prop-types': 'off', // Using TypeScript
          'react/display-name': 'error', // Required for shared components
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
          'react/no-danger': 'error', // Security for shared components
          'react/self-closing-comp': [
            'error',
            {
              component: true,
              html: true,
            },
          ],
        },
      }),

      createPluginConfig(jsxA11yPlugin, 'jsx-a11y', {
        files: reactFilePatterns,
        additionalRules: {
          'jsx-a11y/alt-text': 'error',
          'jsx-a11y/anchor-has-content': 'error',
          'jsx-a11y/anchor-is-valid': 'error',
          'jsx-a11y/aria-props': 'error',
          'jsx-a11y/aria-role': 'error',
          'jsx-a11y/heading-has-content': 'error',
          'jsx-a11y/img-redundant-alt': 'error',
          'jsx-a11y/interactive-supports-focus': 'error',
          'jsx-a11y/label-has-associated-control': 'error',
          'jsx-a11y/no-redundant-roles': 'error',
          'jsx-a11y/role-has-required-aria-props': 'error',
          'jsx-a11y/tabindex-no-positive': 'error',
        },
      })
    );
  }

  // Conditionally add Node.js support based on detection/override
  if (detectedNode) {
    configs.push(
      createPluginConfig(nodePlugin, 'n', {
        files: nodeFilePatterns,
        additionalRules: {
          'n/no-missing-import': 'off', // Handled by TypeScript
          'n/no-unpublished-import': 'off', // ✅ Disable problematic rule
          'n/no-unpublished-require': 'off', // ✅ Disable problematic rule
          'n/prefer-global/buffer': ['error', 'always'],
          'n/prefer-global/console': ['error', 'always'],
          'n/prefer-global/process': ['error', 'always'],
        },
      }),

      // Node.js specific overrides
      {
        name: 'plyaz/node-shared-overrides',
        files: nodeFilePatterns,
        rules: {
          'unicorn/no-process-exit': 'off', // Allow process usage in Node.js utilities
          'no-console': 'off', // Allow console for Node.js utilities
        },
      }
    );
  }

  // Conditionally add Tailwind based on detection/override
  if (detectedTailwind) {
    configs.push(
      createPluginConfig(tailwindcssPlugin, 'better-tailwindcss', {
        files: tailwindFilePatterns,
        configName: 'recommended',
      })
    );
  }

  // Package type specific configurations
  if (packageType === 'ui') {
    configs.push({
      name: 'plyaz/ui-package',
      files: reactFilePatterns,
      rules: {
        // UI components should have display names
        'react/display-name': 'error',

        // Prop validation through TypeScript
        'react/prop-types': 'off',

        // Accessibility is critical for UI components
        'jsx-a11y/alt-text': 'error',
        'jsx-a11y/anchor-has-content': 'error',
        'jsx-a11y/aria-props': 'error',
        'jsx-a11y/role-has-required-aria-props': 'error',

        // Consistent component structure
        'react/jsx-sort-props': [
          'error',
          {
            callbacksLast: true,
            shorthandFirst: true,
            multiline: 'last',
            reservedFirst: true,
          },
        ],
      },
    });
  }

  // Build output overrides
  configs.push({
    name: 'plyaz/build-output',
    files: [
      '**/dist/**/*.{js,ts}',
      '**/lib/**/*.{js,ts}',
      '**/esm/**/*.{js,ts}',
      '**/cjs/**/*.{js,ts}',
      '**/build/**/*.{js,ts}',
    ],
    rules: {
      // Disable all rules for build output
      '@typescript-eslint/no-explicit-any': 'off',
      '@typescript-eslint/explicit-function-return-type': 'off',
      '@typescript-eslint/explicit-module-boundary-types': 'off',
      complexity: 'off',
      'max-lines-per-function': 'off',
      'max-params': 'off',
      'no-magic-numbers': 'off',
    },
  });

  // Prettier compatibility (conditionally)
  if (enablePrettier) {
    configs.push({
      name: 'plyaz/prettier-compatibility-shared',
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

  return defineConfig(configs);
}

/**
 * Utility to read package.json for auto-detection
 */
export async function loadPackageJson(cwd = process.cwd()) {
  try {
    const { readFile } = await import('fs/promises');
    const { join } = await import('path');
    const packageJsonPath = join(cwd, 'package.json');
    const content = await readFile(packageJsonPath, 'utf-8');
    return JSON.parse(content);
  } catch {
    return {};
  }
}

/**
 * Enhanced factory function that auto-detects environment
 */
export async function createAutoDetectedConfig(options = {}) {
  const packageJson = await loadPackageJson(options.tsconfigDir);
  return createBaseConfig({
    ...options,
    packageJson,
  });
}

/**
 * Simplified presets for common shared package types
 * Now with auto-detection support
 */
export const presets = {
  // Pure TypeScript types package
  types: (options = {}) =>
    createBaseConfig({
      packageType: 'types',
      enableReact: false,
      enableNode: false,
      enableTailwind: false,
      strictness: 'high',
      ...options,
    }),

  // Utility functions package (auto-detects Node.js usage)
  utils: async (options = {}) => {
    const packageJson = await loadPackageJson(options.tsconfigDir);
    return createBaseConfig({
      packageType: 'utility',
      enableReact: false,
      enableTailwind: false,
      strictness: 'high',
      packageJson,
      ...options,
    });
  },

  // React UI components package (auto-detects Tailwind)
  ui: async (options = {}) => {
    const packageJson = await loadPackageJson(options.tsconfigDir);
    return createBaseConfig({
      packageType: 'ui',
      enableReact: true,
      enableNode: false,
      strictness: 'medium',
      packageJson,
      ...options,
    });
  },

  // Constants and configuration package
  constants: (options = {}) =>
    createBaseConfig({
      packageType: 'constants',
      enableReact: false,
      enableNode: false,
      enableTailwind: false,
      strictness: 'high',
      ...options,
    }),

  // Full-stack hooks and stores package (auto-detects environments)
  hooks: async (options = {}) => {
    const packageJson = await loadPackageJson(options.tsconfigDir);
    return createBaseConfig({
      packageType: 'utility',
      strictness: 'medium',
      packageJson,
      ...options,
    });
  },

  // API clients and data layer package (auto-detects Node.js)
  api: async (options = {}) => {
    const packageJson = await loadPackageJson(options.tsconfigDir);
    return createBaseConfig({
      packageType: 'utility',
      enableReact: false,
      enableTailwind: false,
      strictness: 'high',
      packageJson,
      ...options,
    });
  },

  // Auto-detect everything based on package.json
  auto: async (options = {}) => {
    const packageJson = await loadPackageJson(options.tsconfigDir);
    return createBaseConfig({
      packageJson,
      ...options,
    });
  },
};
