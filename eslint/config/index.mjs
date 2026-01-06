import js from '@eslint/js';
import typescriptEslint from 'typescript-eslint';
import process from 'node:process';

/**
 * Universal helper to extract recommended rules from any plugin
 * Handles all the different plugin API inconsistencies
 */
export function getRecommendedRules(plugin, configPath = 'recommended') {
  // Handle different plugin API patterns
  if (!plugin) return {};

  // Pattern 1: plugin.configs.recommended.rules (most common)
  if (plugin.configs?.[configPath]?.rules) {
    return plugin.configs[configPath].rules;
  }

  // Pattern 2: plugin.configs['flat/recommended'].rules (newer plugins)
  if (plugin.configs?.[`flat/${configPath}`]?.rules) {
    return plugin.configs[`flat/${configPath}`].rules;
  }

  // Pattern 3: plugin.configs['flat/recommended'] is the config object itself
  if (plugin.configs?.[`flat/${configPath}`] && !plugin.configs[`flat/${configPath}`].rules) {
    return plugin.configs[`flat/${configPath}`];
  }

  // Pattern 4: Direct config object (like typescript-eslint)
  if (Array.isArray(plugin.configs?.[configPath])) {
    // Extract rules from array of configs
    return plugin.configs[configPath].reduce((acc, config) => {
      return { ...acc, ...(config.rules || {}) };
    }, {});
  }

  // Pattern 5: Plugin is the config itself (some new plugins)
  if (plugin.rules && typeof plugin.rules === 'object') {
    return {};
  }

  // Pattern 6: Legacy format with overrides
  if (plugin.configs?.[configPath]?.overrides?.[0]?.rules) {
    return plugin.configs[configPath].overrides[0].rules;
  }

  // ✅ Special handling for import plugin (legacy format)
  if (configPath === 'recommended' && plugin.configs?.recommended?.env) {
    // Import plugin has a different structure
    return plugin.configs.recommended.rules || {};
  }

  return {};
}

/**
 * Universal helper to get plugin object properly formatted for flat config
 */
export function normalizePlugin(plugin, pluginName) {
  // Already normalized
  if (plugin.rules && plugin.configs) {
    return plugin;
  }

  // Handle default export plugins
  if (plugin.default) {
    return normalizePlugin(plugin.default, pluginName);
  }

  // Create normalized plugin object
  return {
    rules: plugin.rules || {},
    configs: plugin.configs || {},
    processors: plugin.processors || {},
    meta: plugin.meta || { name: pluginName },
  };
}

/**
 * Helper to normalize rule severities
 */
function normalizeRuleSeverity(severity) {
  if (typeof severity === 'string') {
    const validSeverities = ['off', 'warn', 'error'];
    return validSeverities.includes(severity) ? severity : 'error';
  }
  if (typeof severity === 'number') {
    return severity >= 0 && severity <= 2 ? severity : 2;
  }
  if (Array.isArray(severity)) {
    return [normalizeRuleSeverity(severity[0]), ...severity.slice(1)];
  }
  return 'error';
}

/**
 * Helper to normalize rules object
 */
function normalizeRules(rules) {
  if (!rules || typeof rules !== 'object') {
    return {};
  }

  const normalizedRules = {};
  for (const [ruleName, ruleConfig] of Object.entries(rules)) {
    normalizedRules[ruleName] = normalizeRuleSeverity(ruleConfig);
  }
  return normalizedRules;
}

/**
 * Universal config creator that handles all plugin types
 * Completely neutral - no plugin-specific logic
 */
export function createPluginConfig(pluginImport, pluginName, options = {}) {
  const {
    configName = 'recommended',
    additionalRules = {},
    files = ['**/*.{js,ts,tsx}'],
    flatConfigFirst = true,
    settings = {},
  } = options;

  const plugin = normalizePlugin(pluginImport, pluginName);

  // ✅ Special handling for import plugin
  if (pluginName === 'import') {
    return {
      name: `plyaz/${pluginName}`,
      plugins: {
        [pluginName]: plugin,
      },
      files,
      settings: {
        'import/resolver': {
          typescript: {
            alwaysTryTypes: true,
            project: ['./tsconfig.json'],
          },
          node: {
            extensions: ['.js', '.jsx', '.ts', '.tsx'],
          },
        },
        'import/parsers': {
          '@typescript-eslint/parser': ['.ts', '.tsx'],
        },
        ...settings,
      },
      rules: {
        ...normalizeRules(getRecommendedRules(plugin, configName)),
        ...normalizeRules(additionalRules),
      },
    };
  }

  // ✅ Special handling for storybook plugin (known to have issues)
  if (pluginName === 'storybook') {
    return {
      name: `plyaz/${pluginName}`,
      plugins: {
        [pluginName]: plugin,
      },
      files,
      settings,
      rules: {
        // Manually specify known good storybook rules instead of using plugin config
        'storybook/await-interactions': 'error',
        'storybook/context-in-play-function': 'error',
        'storybook/default-exports': 'error',
        'storybook/hierarchy-separator': 'warn',
        'storybook/no-redundant-story-name': 'warn',
        'storybook/prefer-pascal-case': 'warn',
        'storybook/story-exports': 'error',
        'storybook/use-storybook-expect': 'error',
        'storybook/use-storybook-testing-library': 'error',
        ...normalizeRules(additionalRules),
      },
    };
  }

  // Try flat config first if supported
  if (flatConfigFirst && plugin.configs?.[`flat/${configName}`]) {
    const flatConfig = plugin.configs[`flat/${configName}`];

    // Handle flat config that's already a complete config object
    if (flatConfig.plugins || flatConfig.rules) {
      return {
        ...flatConfig,
        name: `plyaz/${pluginName}`,
        files,
        rules: {
          ...normalizeRules(flatConfig.rules),
          ...normalizeRules(additionalRules),
        },
        settings: {
          ...flatConfig.settings,
          ...settings,
        },
      };
    }
  }

  // Fallback to universal method
  return {
    name: `plyaz/${pluginName}`,
    plugins: {
      [pluginName]: plugin,
    },
    files,
    rules: {
      ...normalizeRules(getRecommendedRules(plugin, configName)),
      ...normalizeRules(additionalRules),
    },
    settings,
  };
}

/**
 * Helper to create React settings object
 */
export function createReactSettings(reactVersion = 'detect', jsxRuntime = 'automatic') {
  return {
    react: {
      version: reactVersion,
      pragma: jsxRuntime === 'classic' ? 'React' : undefined,
      fragment: jsxRuntime === 'classic' ? 'Fragment' : undefined,
      createClass: 'createReactClass',
      flowVersion: '0.53',
    },
  };
}

/**
 * Dedicated React plugin config creator with proper settings
 * Uses createPluginConfig with React-specific settings passed explicitly
 */
export function createReactConfig(reactPlugin, options = {}) {
  const {
    files = ['**/*.{jsx,tsx}'],
    reactVersion = 'detect',
    additionalRules = {},
    jsxRuntime = 'automatic', // 'automatic' | 'classic'
  } = options;

  return createPluginConfig(reactPlugin, 'react', {
    files,
    configName: 'recommended',
    settings: createReactSettings(reactVersion, jsxRuntime),
    additionalRules: {
      'react/react-in-jsx-scope': jsxRuntime === 'automatic' ? 'off' : 'error',
      'react/jsx-uses-react': jsxRuntime === 'automatic' ? 'off' : 'error',
      'react/jsx-uses-vars': 'error',
      ...additionalRules,
    },
  });
}

/**
 * Common ignore patterns for all configurations
 */
export const COMMON_IGNORE_PATTERNS = [
  '**/node_modules/**',
  '**/dist/**',
  '**/build/**',
  '**/coverage/**',
  '**/*.min.js',
  '**/.turbo/**',
  '**/*.generated.{js,ts,tsx}',
  '**/generated/**',
  '**/*.css',
  '**/*.scss',
  '**/*.sass',
  '**/*.less',
  '**/*.ico',
  '**/.next/**',
  '**/public/**',
  '**/.vercel/**',
  '**/storybook-static/**',
  '**/next.config.*',
  '**/tailwind.config.*',
  '**/postcss.config.*',
  '**/.prettierrc.*.*',
  '**/vtest.config.*',
  '**/vtest.setup.*',
  '**/*.sh',
  '**/tsup.config.*',
];

/**
 * Base configurations - always use recommended
 */
export function createBaseConfigs() {
  return [
    js.configs.recommended,
    ...typescriptEslint.configs.recommended,
    ...typescriptEslint.configs.strict,
  ];
}

/**
 * TypeScript configuration with project support
 */
export function createTypeScriptConfig({ tsconfigDir = process.cwd() } = {}) {
  return {
    name: 'plyaz/typescript',
    files: ['**/*.{ts,tsx}'],
    plugins: {
      '@typescript-eslint': typescriptEslint.plugin,
    },
    languageOptions: {
      parser: typescriptEslint.parser,
      parserOptions: {
        project: true,
        tsconfigRootDir: tsconfigDir,
      },
    },
    rules: {
      // Only essential overrides - keep recommended rules mostly intact
      '@typescript-eslint/no-explicit-any': 'error',
      '@typescript-eslint/no-floating-promises': 'error',
      '@typescript-eslint/prefer-nullish-coalescing': 'error',
      '@typescript-eslint/prefer-optional-chain': 'error',
      'no-redeclare': 'off',
      '@typescript-eslint/no-redeclare': 'error',
      '@typescript-eslint/consistent-type-imports': [
        'error',
        {
          prefer: 'type-imports',
          fixStyle: 'separate-type-imports',
        },
      ],
      '@typescript-eslint/consistent-type-exports': 'error',
    },
  };
}

/**
 * Enhanced TypeScript for shared packages
 */
export function createSharedPackageTypeScriptConfig({ tsconfigDir = process.cwd() } = {}) {
  return {
    name: 'plyaz/shared-typescript',
    files: ['**/*.{ts,tsx}'],
    plugins: {
      '@typescript-eslint': typescriptEslint.plugin,
    },
    languageOptions: {
      parser: typescriptEslint.parser,
      parserOptions: {
        project: true,
        tsconfigRootDir: tsconfigDir,
      },
    },
    rules: {
      // Base TypeScript rules
      '@typescript-eslint/no-explicit-any': 'error',
      '@typescript-eslint/no-floating-promises': 'error',
      '@typescript-eslint/prefer-nullish-coalescing': 'error',
      '@typescript-eslint/prefer-optional-chain': 'error',
      '@typescript-eslint/consistent-type-imports': [
        'error',
        {
          prefer: 'type-imports',
          fixStyle: 'separate-type-imports',
        },
      ],
      '@typescript-eslint/consistent-type-exports': 'error',

      // Enhanced rules for shared packages (only for shared packages)
      '@typescript-eslint/explicit-function-return-type': [
        'error',
        {
          allowExpressions: true,
          allowTypedFunctionExpressions: true,
          allowHigherOrderFunctions: true,
        },
      ],
      '@typescript-eslint/explicit-module-boundary-types': 'error',
    },
  };
}

/**
 * Essential naming conventions - keep our domain-specific rules
 */
export function createNamingConventionsConfig() {
  return {
    name: 'plyaz/smart-naming-conventions',
    files: ['**/*.{jsx,tsx,ts,js}'],
    plugins: {
      '@typescript-eslint': typescriptEslint.plugin,
    },
    rules: {
      '@typescript-eslint/naming-convention': [
        'error',
        // Allow Tailwind-style keys like '2xl', '4xl' in objects
        {
          selector: 'objectLiteralProperty',
          modifiers: ['requiresQuotes'],
          format: null,
        },

        // Interfaces - PascalCase, no I prefix
        {
          selector: 'interface',
          format: ['PascalCase'],
          custom: { regex: '^I[A-Z]', match: false },
        },
        // Types - PascalCase
        { selector: 'typeAlias', format: ['PascalCase'] },

        // 🎯 ENUMS - Always UPPER_CASE (strict)
        { selector: 'enum', format: ['UPPER_CASE'] },
        { selector: 'enumMember', format: ['PascalCase'] }, // EnumMember is fine with PascalCase

        // Classes - PascalCase
        { selector: 'class', format: ['PascalCase'] },

        // 🎯 SMART FUNCTION NAMING - Context Aware
        // Regular functions - camelCase (backend functions, utilities)
        {
          selector: 'function',
          format: ['camelCase'],
          filter: {
            regex: '^[a-z]', // Starts with lowercase = regular function
            match: true,
          },
        },
        // React Components - PascalCase (components in React/Next.js)
        {
          selector: 'function',
          format: ['PascalCase'],
          filter: {
            regex: '^[A-Z]', // Starts with uppercase = React component
            match: true,
          },
        },

        // 🎯 SMART VARIABLE NAMING - Context Aware
        // ✅ React Component variables (functions assigned to PascalCase, like `const MyComponent = () => {}`)
        {
          selector: 'variable',
          types: ['function'],
          format: ['PascalCase'],
          filter: {
            regex: '^[A-Z]', // Matches variables starting with an uppercase letter
            match: true,
          },
        },

        // ✅ Regular function variables (e.g., `const calculateTotal = () => {}`)
        {
          selector: 'variable',
          types: ['function'],
          format: ['camelCase'],
          filter: {
            regex: '^[a-z]', // Matches variables starting with a lowercase letter
            match: true,
          },
        },

        // ✅ React Hooks (e.g., `const useFeature = () => {}`) — must follow `useX` camelCase format
        {
          selector: 'variable',
          types: ['function'],
          format: ['camelCase'],
          filter: {
            regex: '^use[A-Z]', // Matches variables starting with `use` followed by uppercase
            match: true,
          },
        },

        // ✅ Regular non-function variables (e.g., arrays, booleans, strings, numbers)
        {
          selector: 'variable',
          types: ['array', 'boolean', 'string', 'number'],
          format: ['camelCase', 'UPPER_CASE'],
        },

        // Methods - camelCase
        { selector: 'method', format: ['camelCase'] },

        // Parameters - camelCase (flexible for destructuring)
        {
          selector: 'parameter',
          format: ['camelCase'],
          leadingUnderscore: 'allow', // Allow _unused parameters
        },

        // Properties - Very flexible (APIs, config objects, etc.)
        {
          selector: 'property',
          format: ['camelCase', 'PascalCase', 'UPPER_CASE', 'snake_case'], // Allow all
          leadingUnderscore: 'allow',
          trailingUnderscore: 'allow',
        },
      ],
    },
  };
}

/**
 * Web3-specific rules for financial safety
 */
export function createWeb3Config() {
  return {
    name: 'plyaz/web3',
    files: ['**/*.{js,ts,tsx}'],
    rules: {
      'no-restricted-globals': [
        'error',
        { name: 'parseInt', message: 'Use Number.parseInt() for better BigInt compatibility' },
        { name: 'parseFloat', message: 'Use Number.parseFloat() for better precision' },
      ],
      'no-restricted-syntax': [
        'error',
        {
          selector: "CallExpression[callee.name='eval']",
          message: 'eval() is forbidden in Web3 apps',
        },
        {
          selector: "BinaryExpression[operator='/'][left.type='Literal'][right.type='Literal']",
          message: 'Use precise decimal libraries for financial calculations',
        },
      ],
      'no-magic-numbers': [
        'error',
        {
          ignore: [-1, 0, 1],
          ignoreArrayIndexes: true,
          ignoreDefaultValues: true,
          enforceConst: true,
        },
      ],
    },
  };
}

/**
 * Common overrides for special file types
 */
export function createCommonOverrides() {
  return [
    // Config files
    {
      name: 'plyaz/config-files',
      files: [
        '**/*.config.{js,ts}',
        '**/config/*.{js,ts}',
        '**/next.config.*',
        '**/tailwind.config.*',
        '**/postcss.config.*',
        '**/vitest.config.*',
        '**/tsup.config.*',
      ],
      rules: {
        'import/no-default-export': 'off',
        '@typescript-eslint/no-var-requires': 'off',
        'no-magic-numbers': 'off',
        'no-console': 'off',
      },
    },
    // Test files
    {
      name: 'plyaz/test-files',
      files: [
        '**/__tests__/**/*.{js,ts,tsx}',
        '**/tests/**/*.{js,ts,tsx}',
        '**/*.{test,spec}.{js,ts,tsx}',
      ],
      rules: {
        '@typescript-eslint/no-explicit-any': 'off',
        '@typescript-eslint/explicit-function-return-type': 'off',
        'no-magic-numbers': 'off',
      },
    },
    // Type definition files
    {
      name: 'plyaz/type-definitions',
      files: ['**/*.d.ts'],
      rules: {
        '@typescript-eslint/no-explicit-any': 'off',
        'import/no-default-export': 'off',
        '@typescript-eslint/explicit-function-return-type': 'off',
      },
    },
  ];
}
