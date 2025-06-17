import typescriptEslint from 'typescript-eslint';
import process from 'node:process';

import {
  createBaseConfigs,
  createSharedPackageTypeScriptConfig,
  createSecurityConfig,
  createPromiseConfig,
  createSonarConfig,
  createRegexConfig,
  createFunctionalConfig,
  createWeb3Config,
  createPerformanceConfig,
  createJSDocConfig,
  createImportConfig,
  createUnicornConfig,
  createBestPracticesConfig,
  createJSONConfig,
  createFileNamingConfig,
  createCommonOverrides,
  COMMON_IGNORE_PATTERNS,
} from './config/index.mjs';

/**
 * ESLint configuration for shared packages.
 * Optimized for utility libraries, types, and reusable components.
 */
export function createBaseConfig({ tsconfigDir = process.cwd() } = {}) {
  return typescriptEslint.config(
    // Ignore patterns
    {
      name: 'plyaz/shared-base',
      ignores: [
        ...COMMON_IGNORE_PATTERNS,
        '**/storybook-static/**',
        '**/lib/**/*.js', // Build outputs
        '**/esm/**/*.js', // Build outputs
        '**/cjs/**/*.js', // Build outputs
      ],
    },

    // Base configurations
    ...createBaseConfigs(),

    // Core configurations
    createSharedPackageTypeScriptConfig({ tsconfigDir }),
    createSecurityConfig(),
    createPromiseConfig(),
    createSonarConfig(),
    createRegexConfig(),
    createPerformanceConfig(),
    createFunctionalConfig({
      enforceImmutability: true, // Strict for shared packages
    }),
    createWeb3Config(), // Important for Web3 utility packages
    createJSDocConfig(),
    createImportConfig({ tsconfigDir }),
    createUnicornConfig(),
    createBestPracticesConfig({
      complexityMax: 8, // Lower for shared utilities
    }),
    createJSONConfig(),
    createFileNamingConfig(),

    // Overrides
    ...createCommonOverrides()
  );
}
