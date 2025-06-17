import js from '@eslint/js';
import typescriptEslint from 'typescript-eslint';
import unicornPlugin from 'eslint-plugin-unicorn';
import importPlugin from 'eslint-plugin-import';
import unusedImportsPlugin from 'eslint-plugin-unused-imports';
import simpleImportSortPlugin from 'eslint-plugin-simple-import-sort';
import securityPlugin from 'eslint-plugin-security';
import jsdocPlugin from 'eslint-plugin-jsdoc';
import jsoncPlugin from 'eslint-plugin-jsonc';
import promisePlugin from 'eslint-plugin-promise';
import sonarjsPlugin from 'eslint-plugin-sonarjs';
import regexpPlugin from 'eslint-plugin-regexp';
import functionalPlugin from 'eslint-plugin-functional';
import process from 'node:process';

/**
 * Common TypeScript configuration for all packages.
 */
export function createTypeScriptConfig({ tsconfigDir = process.cwd() } = {}) {
  return {
    name: 'plyaz/shared-typescript',
    files: ['**/*.{ts,tsx}'],
    languageOptions: {
      parser: typescriptEslint.parser,
      parserOptions: {
        project: true,
        tsconfigRootDir: tsconfigDir,
      },
    },
    rules: {
      // Critical for shared package reliability and Web3 security
      '@typescript-eslint/no-explicit-any': 'error',
      '@typescript-eslint/no-unsafe-assignment': 'error',
      '@typescript-eslint/no-unsafe-call': 'error',
      '@typescript-eslint/no-unsafe-member-access': 'error',
      '@typescript-eslint/no-unsafe-return': 'error',
      '@typescript-eslint/no-unsafe-argument': 'error',
      '@typescript-eslint/strict-boolean-expressions': 'error',
      '@typescript-eslint/prefer-nullish-coalescing': 'error',
      '@typescript-eslint/prefer-optional-chain': 'error',
      '@typescript-eslint/no-floating-promises': 'error',
      '@typescript-eslint/await-thenable': 'error',
      '@typescript-eslint/no-misused-promises': [
        'error',
        {
          checksVoidReturn: false,
        },
      ],
      '@typescript-eslint/require-await': 'error',
      '@typescript-eslint/return-await': ['error', 'always'],
      '@typescript-eslint/no-unnecessary-type-assertion': 'error',
      '@typescript-eslint/no-non-null-assertion': 'error',

      // Type imports/exports for better tree-shaking
      '@typescript-eslint/consistent-type-imports': [
        'error',
        {
          prefer: 'type-imports',
          fixStyle: 'separate-type-imports',
          disallowTypeAnnotations: false,
        },
      ],
      '@typescript-eslint/consistent-type-exports': [
        'error',
        {
          fixMixedExportsWithInlineTypeSpecifier: true,
        },
      ],

      // API design consistency
      '@typescript-eslint/method-signature-style': ['error', 'property'],
      '@typescript-eslint/array-type': ['error', { default: 'array-simple' }],
      '@typescript-eslint/consistent-type-definitions': ['error', 'interface'],
      '@typescript-eslint/no-confusing-void-expression': [
        'error',
        {
          ignoreArrowShorthand: true,
          ignoreVoidOperator: true,
        },
      ],
      '@typescript-eslint/no-duplicate-type-constituents': 'error',
      '@typescript-eslint/no-import-type-side-effects': 'error',
      '@typescript-eslint/no-invalid-void-type': 'error',
      '@typescript-eslint/no-meaningless-void-operator': 'error',
      '@typescript-eslint/no-mixed-enums': 'error',
      '@typescript-eslint/no-redundant-type-constituents': 'error',
      '@typescript-eslint/no-require-imports': 'error',
      '@typescript-eslint/no-useless-empty-export': 'error',
      '@typescript-eslint/prefer-enum-initializers': 'error',
      '@typescript-eslint/prefer-readonly': 'error',
      '@typescript-eslint/prefer-regexp-exec': 'error',
      '@typescript-eslint/switch-exhaustiveness-check': 'error',
      '@typescript-eslint/unified-signatures': 'error',
    },
  };
}

/**
 * Enhanced TypeScript configuration for backend services.
 */
export function createBackendTypeScriptConfig({ tsconfigDir = process.cwd() } = {}) {
  const baseConfig = createTypeScriptConfig({ tsconfigDir });

  return {
    ...baseConfig,
    name: 'plyaz/backend-typescript',
    rules: {
      ...baseConfig.rules,
      // Additional backend-specific rules
      '@typescript-eslint/explicit-function-return-type': [
        'error',
        {
          allowExpressions: true,
          allowTypedFunctionExpressions: true,
          allowHigherOrderFunctions: true,
          allowDirectConstAssertionInArrowFunctions: true,
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
      '@typescript-eslint/member-ordering': [
        'error',
        {
          default: [
            'static-field',
            'instance-field',
            'static-initialization',
            'constructor',
            'static-method',
            'instance-method',
          ],
        },
      ],
    },
  };
}

/**
 * Enhanced TypeScript configuration for shared packages.
 */
export function createSharedPackageTypeScriptConfig({ tsconfigDir = process.cwd() } = {}) {
  const baseConfig = createTypeScriptConfig({ tsconfigDir });

  return {
    ...baseConfig,
    name: 'plyaz/shared-package-typescript',
    rules: {
      ...baseConfig.rules,
      // Shared package specific rules
      '@typescript-eslint/explicit-function-return-type': [
        'error',
        {
          allowExpressions: true,
          allowTypedFunctionExpressions: true,
          allowHigherOrderFunctions: true,
          allowDirectConstAssertionInArrowFunctions: true,
          allowConciseArrowFunctionExpressionsStartingWithVoid: false,
        },
      ],
      '@typescript-eslint/explicit-member-accessibility': [
        'error',
        {
          accessibility: 'explicit',
          overrides: {
            constructors: 'no-public',
            methods: 'explicit',
            properties: 'explicit',
            parameterProperties: 'explicit',
          },
        },
      ],
      '@typescript-eslint/explicit-module-boundary-types': 'error',
      '@typescript-eslint/member-ordering': [
        'error',
        {
          default: [
            // Index signature
            'signature',
            'call-signature',

            // Fields
            'public-static-field',
            'protected-static-field',
            'private-static-field',
            'public-decorated-field',
            'protected-decorated-field',
            'private-decorated-field',
            'public-instance-field',
            'protected-instance-field',
            'private-instance-field',
            'public-abstract-field',
            'protected-abstract-field',

            // Static initialization
            'static-initialization',

            // Constructors
            'public-constructor',
            'protected-constructor',
            'private-constructor',

            // Getters and Setters
            'public-static-get',
            'protected-static-get',
            'private-static-get',
            'public-decorated-get',
            'protected-decorated-get',
            'private-decorated-get',
            'public-instance-get',
            'protected-instance-get',
            'private-instance-get',
            'public-abstract-get',
            'protected-abstract-get',

            'public-static-set',
            'protected-static-set',
            'private-static-set',
            'public-decorated-set',
            'protected-decorated-set',
            'private-decorated-set',
            'public-instance-set',
            'protected-instance-set',
            'private-instance-set',
            'public-abstract-set',
            'protected-abstract-set',

            // Methods
            'public-static-method',
            'protected-static-method',
            'private-static-method',
            'public-decorated-method',
            'protected-decorated-method',
            'private-decorated-method',
            'public-instance-method',
            'protected-instance-method',
            'private-instance-method',
            'public-abstract-method',
            'protected-abstract-method',
          ],
        },
      ],
      '@typescript-eslint/parameter-properties': [
        'error',
        {
          prefer: 'class-property',
        },
      ],
    },
    ...createNamingConventionsConfig()
  };
}

/**
 * Promise handling configuration - Critical for Web3/blockchain interactions.
 * Ensures proper async/await patterns and promise handling.
 */
export function createPromiseConfig() {
  return {
    name: 'plyaz/shared-promises',
    files: ['**/*.{js,ts,tsx}'],
    plugins: {
      promise: promisePlugin,
    },
    rules: {
      // Critical for Web3 transaction handling
      'promise/always-return': 'error',
      'promise/catch-or-return': [
        'error',
        {
          allowFinally: true,
          allowThen: true,
          terminationMethod: ['catch', 'asCallback', 'finally'],
        },
      ],
      'promise/param-names': 'error',
      'promise/no-return-wrap': [
        'error',
        {
          allowReject: true,
        },
      ],

      // Prevent callback/promise mixing (common in Web3 libraries)
      'promise/no-callback-in-promise': 'warn',
      'promise/no-promise-in-callback': 'warn',
      'promise/no-nesting': 'warn',

      // Static method usage
      'promise/no-new-statics': 'error',
      'promise/no-return-in-finally': 'warn',
      'promise/valid-params': 'warn',

      // Allow native promises (needed for Web3)
      'promise/no-native': 'off',

      // Allow new Promise() when needed for Web3 wrapping
      'promise/avoid-new': 'off',

      // Prefer async/await over .then() for readability
      'promise/prefer-await-to-then': 'warn',
      'promise/prefer-await-to-callbacks': 'warn',
    },
  };
}

/**
 * Security configuration for Web3/Financial platforms.
 */
export function createSecurityConfig() {
  return {
    name: 'plyaz/shared-security',
    files: ['**/*.{js,ts,tsx}'],
    plugins: {
      security: securityPlugin,
    },
    rules: {
      'security/detect-object-injection': 'error',
      'security/detect-non-literal-regexp': 'error',
      'security/detect-eval-with-expression': 'error',
      'security/detect-pseudoRandomBytes': 'error',
      'security/detect-possible-timing-attacks': 'error',
      'security/detect-unsafe-regex': 'error',
      'security/detect-buffer-noassert': 'error',
      'security/detect-new-buffer': 'error',
    },
  };
}

/**
 * Enhanced security configuration for backend services.
 */
export function createBackendSecurityConfig() {
  const baseConfig = createSecurityConfig();

  return {
    ...baseConfig,
    name: 'plyaz/backend-security',
    rules: {
      ...baseConfig.rules,
      // Additional backend security rules
      'security/detect-non-literal-fs-filename': 'error',
      'security/detect-child-process': 'error',
      'security/detect-disable-mustache-escape': 'error',
      'security/detect-no-csrf-before-method-override': 'error',
    },
  };
}

/**
 * JSDoc configuration for shared packages.
 */
export function createJSDocConfig() {
  return {
    name: 'plyaz/shared-jsdoc',
    files: ['**/*.{js,ts,tsx}'],
    plugins: {
      jsdoc: jsdocPlugin,
    },
    rules: {
      'jsdoc/check-access': 'error',
      'jsdoc/check-alignment': 'error',
      'jsdoc/check-param-names': 'error',
      'jsdoc/check-property-names': 'error',
      'jsdoc/check-tag-names': 'error',
      'jsdoc/check-types': 'error',
      'jsdoc/check-values': 'error',
      'jsdoc/empty-tags': 'error',
      'jsdoc/implements-on-classes': 'error',
      'jsdoc/multiline-blocks': 'error',
      'jsdoc/no-multi-asterisks': 'error',
      'jsdoc/no-undefined-types': 'error',

      // Require JSDoc for all important code structures
      'jsdoc/require-description': [
        'error',
        {
          contexts: [
            // Classes and constructors
            'ClassDeclaration',
            'ClassExpression',
            'MethodDefinition[key.name="constructor"]',

            // All function types
            'FunctionDeclaration',
            'FunctionExpression',
            'ArrowFunctionExpression',

            // Methods (class methods, object methods)
            'MethodDefinition',
            'Property[method=true]',

            // TypeScript specific
            'TSInterfaceDeclaration',
            'TSTypeAliasDeclaration',
            'TSEnumDeclaration',
            'TSModuleDeclaration',

            // Variable declarations that are functions or classes
            'VariableDeclarator[init.type="FunctionExpression"]',
            'VariableDeclarator[init.type="ArrowFunctionExpression"]',
            'VariableDeclarator[init.type="ClassExpression"]',

            // Exported items (critical for shared packages)
            'ExportNamedDeclaration > FunctionDeclaration',
            'ExportNamedDeclaration > ClassDeclaration',
            'ExportNamedDeclaration > TSInterfaceDeclaration',
            'ExportNamedDeclaration > TSTypeAliasDeclaration',
            'ExportDefaultDeclaration > FunctionDeclaration',
            'ExportDefaultDeclaration > ClassDeclaration',
          ],
        },
      ],

      // Enforce complete sentences
      'jsdoc/require-description-complete-sentence': 'error',

      // Parameter documentation
      'jsdoc/require-param': 'error',
      'jsdoc/require-param-description': 'error',
      'jsdoc/require-param-name': 'error',
      'jsdoc/require-param-type': 'off', // Using TypeScript

      // Property documentation for interfaces/types
      'jsdoc/require-property': 'error',
      'jsdoc/require-property-description': 'error',
      'jsdoc/require-property-name': 'error',
      'jsdoc/require-property-type': 'off', // Using TypeScript

      // Return value documentation
      'jsdoc/require-returns': 'error',
      'jsdoc/require-returns-check': 'error',
      'jsdoc/require-returns-description': 'error',
      'jsdoc/require-returns-type': 'off', // Using TypeScript

      // Exception documentation
      'jsdoc/require-throws': 'error',

      // Generator/async documentation
      'jsdoc/require-yields': 'error',
      'jsdoc/require-yields-check': 'error',

      // Additional quality rules
      'jsdoc/tag-lines': 'error',
      'jsdoc/valid-types': 'error',
      'jsdoc/require-asterisk-prefix': 'error',
      'jsdoc/require-hyphen-before-param-description': 'error',
      'jsdoc/no-bad-blocks': 'error',
      'jsdoc/no-defaults': 'error',

      // Enforce @example for complex functions
      'jsdoc/require-example': [
        'warn',
        {
          contexts: [
            'FunctionDeclaration[params.length>2]', // Functions with 3+ params
            'MethodDefinition[value.params.length>2]', // Methods with 3+ params
            'ExportNamedDeclaration > FunctionDeclaration', // All exported functions
            'ExportDefaultDeclaration > FunctionDeclaration',
          ],
        },
      ],

      // Enforce consistent formatting
      'jsdoc/match-description': [
        'error',
        {
          mainDescription: /^[A-Z].*\.$/,
          matchDescription: '^[A-Z].*\\.$',
          contexts: ['any'],
          tags: {
            param: /^[A-Z].*\.$/,
            returns: /^[A-Z].*\.$/,
            throws: /^[A-Z].*\.$/,
          },
        },
      ],
    },
    settings: {
      jsdoc: {
        mode: 'typescript',
        preferredTypes: {
          object: 'Record<string, unknown>',
          Object: 'Record<string, unknown>',
          array: 'Array',
          'Array.<>': 'Array<>',
          'Promise.<>': 'Promise<>',
        },
        // Tag preferences for TypeScript
        tagNamePreference: {
          arg: 'param',
          argument: 'param',
          class: 'constructor',
          virtual: 'abstract',
          extends: 'augments',
          constructor: 'class',
          const: 'constant',
          defaultvalue: 'default',
          desc: 'description',
          host: 'external',
          fileoverview: 'file',
          overview: 'file',
          emits: 'fires',
          func: 'function',
          method: 'function',
          var: 'member',
          prop: 'property',
          return: 'returns',
          exception: 'throws',
          linkcode: 'link',
          linkplain: 'link',
        },
      },
    },
  };
}

/**
 * Common abbreviations allowlist for unicorn plugin.
 */
export const COMMON_ABBREVIATIONS = {
  // Standard React/Web
  Props: true,
  props: true,
  ref: true,
  Ref: true,

  // General development
  env: true,
  ctx: true,
  req: true,
  res: true,
  prev: true,
  acc: true,
  args: true,
  params: true,
  config: true,
  auth: true,
  db: true,
  api: true,
  src: true,
  dist: true,
  lib: true,
  pkg: true,

  // Domain specific
  dto: true,
  Dto: true,
  DTO: true,
  id: true,
  Id: true,
  ID: true,
  url: true,
  URL: true,
  uri: true,
  URI: true,
  uuid: true,
  UUID: true,
  jwt: true,
  JWT: true,
  addr: true,

  // Loop variables
  i: true,
  j: true,
  k: true,

  // Common abbreviations
  e: true,
  el: true,
  elem: true,
  fn: true,
  cb: true,
  err: true,
  str: true,
  num: true,
  obj: true,
  arr: true,
  len: true,
  msg: true,
  btn: true,
  nav: true,

  // File extensions
  html: true,
  HTML: true,
  css: true,
  CSS: true,
  js: true,
  JS: true,
  ts: true,
  TS: true,
  jsx: true,
  JSX: true,
  tsx: true,
  TSX: true,
};

/**
 * Common filename patterns for unicorn plugin.
 */
export const COMMON_FILENAME_IGNORE_PATTERNS = [
  // Standard files
  'README.md',
  'CHANGELOG.md',
  'LICENSE',
  // Type definitions
  '\\.d\\.ts$',
  // Index files
  'index.ts',
  'index.tsx',
  // Config files
  '\\.(config|rc)\\.',
  // Next.js specific files
  'next.config.js',
  'tailwind.config.js',
  'postcss.config.js',
  // NestJS specific patterns
  '\\.module\\.ts$',
  '\\.controller\\.ts$',
  '\\.service\\.ts$',
  '\\.dto\\.ts$',
  '\\.entity\\.ts$',
  '\\.guard\\.ts$',
  '\\.interceptor\\.ts$',
  '\\.pipe\\.ts$',
  '\\.decorator\\.ts$',
  '\\.filter\\.ts$',
  // React specific patterns
  '\\.stories\\.',
  '\\.test\\.',
  '\\.spec\\.',
];

/**
 * Unicorn configuration with common settings.
 */
export function createUnicornConfig(options = {}) {
  const {
    allowTopLevelAwait = false,
    allowProcessExit = false,
    additionalAbbreviations = {},
    additionalIgnorePatterns = [],
  } = options;

  return {
    name: 'plyaz/shared-unicorn',
    files: ['**/*.{js,ts,tsx}'],
    plugins: {
      unicorn: unicornPlugin,
    },
    rules: {
      'unicorn/filename-case': [
        'error',
        {
          cases: {
            kebabCase: true,
            camelCase: true,
            pascalCase: true,
          },
          ignore: [...COMMON_FILENAME_IGNORE_PATTERNS, ...additionalIgnorePatterns],
        },
      ],
      'unicorn/prevent-abbreviations': [
        'error',
        {
          allowList: {
            ...COMMON_ABBREVIATIONS,
            ...additionalAbbreviations,
          },
        },
      ],
      'unicorn/no-null': 'off',
      'unicorn/prefer-top-level-await': allowTopLevelAwait ? 'error' : 'off',
      'unicorn/prefer-module': 'off',
      'unicorn/no-array-reduce': 'off',
      'unicorn/no-await-expression-member': 'off',
      'unicorn/prefer-ternary': 'off',
      'unicorn/consistent-function-scoping': 'off',
      'unicorn/no-process-exit': allowProcessExit ? 'off' : 'error',
      'unicorn/no-nested-ternary': 'error',
      'unicorn/better-regex': 'error',
      'unicorn/catch-error-name': ['error', { name: 'error' }],
      'unicorn/consistent-destructuring': 'error',
      'unicorn/custom-error-definition': 'error',
      'unicorn/error-message': 'error',
      'unicorn/escape-case': 'error',
      'unicorn/explicit-length-check': 'error',
      'unicorn/new-for-builtins': 'error',
      'unicorn/no-abusive-eslint-disable': 'error',
      'unicorn/no-array-push-push': 'error',
      'unicorn/no-console-spaces': 'error',
      'unicorn/no-for-loop': 'error',
      'unicorn/no-instanceof-array': 'error',
      'unicorn/no-lonely-if': 'error',
      'unicorn/no-new-array': 'error',
      'unicorn/no-new-buffer': 'error',
      'unicorn/no-static-only-class': 'error',
      'unicorn/no-thenable': 'error',
      'unicorn/no-this-assignment': 'error',
      'unicorn/no-unreadable-array-destructuring': 'error',
      'unicorn/no-unused-properties': 'error',
      'unicorn/no-useless-fallback-in-spread': 'error',
      'unicorn/no-useless-length-check': 'error',
      'unicorn/no-useless-promise-resolve-reject': 'error',
      'unicorn/no-useless-spread': 'error',
      'unicorn/no-zero-fractions': 'error',
      'unicorn/number-literal-case': 'error',
      'unicorn/numeric-separators-style': [
        'error',
        {
          number: {
            minimumDigits: 0,
            groupLength: 3,
          },
        },
      ],
      'unicorn/prefer-add-event-listener': 'error',
      'unicorn/prefer-array-find': 'error',
      'unicorn/prefer-array-flat': 'error',
      'unicorn/prefer-array-flat-map': 'error',
      'unicorn/prefer-array-index-of': 'error',
      'unicorn/prefer-array-some': 'error',
      'unicorn/prefer-at': 'error',
      'unicorn/prefer-code-point': 'error',
      'unicorn/prefer-date-now': 'error',
      'unicorn/prefer-default-parameters': 'error',
      'unicorn/prefer-includes': 'error',
      'unicorn/prefer-math-trunc': 'error',
      'unicorn/prefer-modern-math-apis': 'error',
      'unicorn/prefer-native-coercion-functions': 'error',
      'unicorn/prefer-negative-index': 'error',
      'unicorn/prefer-number-properties': 'error',
      'unicorn/prefer-object-from-entries': 'error',
      'unicorn/prefer-optional-catch-binding': 'error',
      'unicorn/prefer-prototype-methods': 'error',
      'unicorn/prefer-reflect-apply': 'error',
      'unicorn/prefer-regexp-test': 'error',
      'unicorn/prefer-set-has': 'error',
      'unicorn/prefer-set-size': 'error',
      'unicorn/prefer-spread': 'error',
      'unicorn/prefer-string-replace-all': 'error',
      'unicorn/prefer-string-slice': 'error',
      'unicorn/prefer-string-starts-ends-with': 'error',
      'unicorn/prefer-string-trim-start-end': 'error',
      'unicorn/prefer-switch': 'error',
      'unicorn/prefer-type-error': 'error',
      'unicorn/require-array-join-separator': 'error',
      'unicorn/require-number-to-fixed-digits-argument': 'error',
      'unicorn/string-content': 'error',
      'unicorn/switch-case-braces': ['error', 'avoid'],
      'unicorn/text-encoding-identifier-case': 'error',
      'unicorn/throw-new-error': 'error',
    },
  };
}

/**
 * Import organization configuration.
 */
export function createImportConfig({ tsconfigDir = process.cwd(), backend = false } = {}) {
  const importGroups = backend
    ? [
        // Node.js built-ins
        ['^node:'],
        // NestJS imports
        ['^@nestjs/'],
        // External packages
        ['^@?\\w'],
        // Internal packages (@plyaz/*)
        ['^(@plyaz)(/.*|$)'],
        // Relative imports from parent directories
        ['^\\.\\.(?!/?$)', '^\\.\\./?'],
        // Relative imports from current directory
        ['^\\./(?=.*/)(?!/?$)', '^\\.(?!/?$)', '^\\./?'],
        // Side effect imports
        ['^\\u0000'],
      ]
    : [
        // React and Next.js first
        ['^react', '^next'],
        // External packages
        ['^@?\\w'],
        // Internal packages (@plyaz/*)
        ['^(@plyaz)(/.*|$)'],
        // Parent imports
        ['^\\.\\.(?!/?$)', '^\\.\\./?$'],
        // Relative imports
        ['^\\./(?=.*/)(?!/?$)', '^\\.(?!/?$)', '^\\./?$'],
        // Side effect imports
        ['^\\u0000'],
      ];

  return {
    name: 'plyaz/shared-imports',
    files: ['**/*.{js,ts,tsx}'],
    plugins: {
      import: importPlugin,
      'unused-imports': unusedImportsPlugin,
      'simple-import-sort': simpleImportSortPlugin,
    },
    settings: {
      'import/resolver': {
        typescript: {
          alwaysTryTypes: true,
          project: tsconfigDir,
        },
        node: {
          extensions: ['.js', '.ts', '.tsx'],
        },
      },
    },
    rules: {
      'simple-import-sort/imports': [
        'error',
        {
          groups: importGroups,
        },
      ],
      'simple-import-sort/exports': 'error',
      'import/no-unresolved': 'error',
      'import/no-cycle': ['error', { maxDepth: 10, ignoreExternal: true }],
      'import/no-self-import': 'error',
      'import/no-useless-path-segments': 'error',
      'import/consistent-type-specifier-style': ['error', 'prefer-top-level'],
      'import/no-duplicates': ['error', { 'prefer-inline': true }],
      'import/first': 'error',
      'import/newline-after-import': 'error',
      'import/no-default-export': backend ? 'error' : 'off',
      'import/prefer-default-export': 'off',
      'unused-imports/no-unused-imports': 'error',
      'unused-imports/no-unused-vars': [
        'error',
        {
          vars: 'all',
          varsIgnorePattern: '^_',
          args: 'after-used',
          argsIgnorePattern: '^_',
          destructuredArrayIgnorePattern: '^_',
        },
      ],
    },
  };
}

/**
 * Best practices configuration.
 */
export function createBestPracticesConfig(options = {}) {
  const { allowConsole = false, complexityMax = 10, additionalParamReassignIgnore = [] } = options;

  return {
    name: 'plyaz/shared-best-practices',
    files: ['**/*.{js,ts,tsx}'],
    rules: {
      // Security and reliability
      'prefer-const': 'error',
      'no-var': 'error',
      'object-shorthand': ['error', 'always'],
      'prefer-destructuring': [
        'error',
        {
          array: true,
          object: true,
        },
        {
          enforceForRenamedProperties: false,
        },
      ],
      'prefer-template': 'error',
      'template-curly-spacing': ['error', 'never'],
      'no-console': allowConsole
        ? 'off'
        : [
            'warn',
            {
              allow: ['warn', 'error', 'info'],
            },
          ],
      'no-debugger': 'error',
      'no-alert': 'error',
      'no-eval': 'error',
      'no-implied-eval': 'error',
      'no-new-func': 'error',
      'no-script-url': 'error',
      radix: 'error',
      yoda: ['error', 'never'],
      eqeqeq: [
        'error',
        'always',
        {
          null: 'ignore',
        },
      ],
      curly: ['error', 'all'],
      'dot-notation': 'error',
      'no-else-return': [
        'error',
        {
          allowElseIf: false,
        },
      ],
      'no-empty-function': [
        'error',
        {
          allow: ['arrowFunctions', 'constructors'],
        },
      ],
      'no-lone-blocks': 'error',
      'no-multi-spaces': 'error',
      'no-new': 'error',
      'no-new-wrappers': 'error',
      'no-return-assign': ['error', 'always'],
      'no-self-compare': 'error',
      'no-sequences': 'error',
      'no-throw-literal': 'error',
      'no-unmodified-loop-condition': 'error',
      'no-unused-expressions': [
        'error',
        {
          allowShortCircuit: true,
          allowTernary: true,
          allowTaggedTemplates: true,
        },
      ],
      'no-useless-call': 'error',
      'no-useless-concat': 'error',
      'no-useless-return': 'error',
      'prefer-promise-reject-errors': [
        'error',
        {
          allowEmptyReject: true,
        },
      ],
      'array-callback-return': [
        'error',
        {
          allowImplicit: false,
          checkForEach: true,
        },
      ],
      'block-scoped-var': 'error',
      complexity: [
        'warn',
        {
          max: complexityMax,
        },
      ],
      'consistent-return': 'error',
      'default-case': 'error',
      'default-case-last': 'error',
      'grouped-accessor-pairs': ['error', 'getBeforeSet'],
      'guard-for-in': 'error',
      'max-classes-per-file': ['error', 1],
      'no-constructor-return': 'error',
      'no-extend-native': 'error',
      'no-extra-bind': 'error',
      'no-implicit-coercion': 'error',
      'no-implicit-globals': 'error',
      'no-iterator': 'error',
      'no-labels': 'error',
      'no-loop-func': 'error',
      'no-magic-numbers': [
        'warn',
        {
          ignore: [-1, 0, 1, 2, 10, 100, 1000],
          ignoreArrayIndexes: true,
          ignoreDefaultValues: true,
          detectObjects: false,
          enforceConst: true,
        },
      ],
      'no-param-reassign': [
        'error',
        {
          props: true,
          ignorePropertyModificationsFor: [
            'acc',
            'accumulator',
            'e',
            'event',
            'req',
            'request',
            'res',
            'response',
            'state',
            'draft',
            'ctx',
            'context',
            ...additionalParamReassignIgnore,
          ],
        },
      ],
      'no-proto': 'error',
      'no-undef-init': 'error',
      'no-underscore-dangle': [
        'error',
        {
          allow: ['_id', '__dirname', '__filename', '_metadata'],
          allowAfterThis: false,
          allowAfterSuper: false,
          enforceInMethodNames: true,
          allowFunctionParams: true,
        },
      ],
      'no-unneeded-ternary': [
        'error',
        {
          defaultAssignment: false,
        },
      ],
      'one-var': ['error', 'never'],
      'operator-assignment': ['error', 'always'],
      'prefer-exponentiation-operator': 'error',
      'prefer-object-spread': 'error',
      'spaced-comment': [
        'error',
        'always',
        {
          line: {
            exceptions: ['-', '+'],
            markers: ['=', '!', '/', 'TODO', 'FIXME', 'NOTE'],
          },
          block: {
            exceptions: ['-', '+'],
            markers: ['=', '!', ':', '::', 'TODO', 'FIXME', 'NOTE'],
            balanced: true,
          },
        },
      ],

      // Additional rules for reliability
      'no-duplicate-imports': 'error',
      'no-unreachable': 'error',
      'no-unreachable-loop': 'error',
      'require-atomic-updates': 'error',
      'use-isnan': 'error',
      'valid-typeof': 'error',
    },
  };
}

/**
 * Naming conventions configuration.
 */
export function createNamingConventionsConfig() {
  return {
    name: 'plyaz/shared-naming-conventions',
    files: ['**/*.{jsx,tsx,ts,js}'],
    rules: {
      '@typescript-eslint/naming-convention': [
        'error',

        // Interfaces/Types - PascalCase (UserProfile, AuthState) - no I prefix
        {
          selector: 'interface',
          format: ['PascalCase'],
          custom: {
            regex: '^I[A-Z]',
            match: false, // Disallow I prefix
          },
        },
        {
          selector: 'typeAlias',
          format: ['PascalCase'],
        },

        // Enums - PascalCase (UserRole, TransactionStatus)
        {
          selector: 'enum',
          format: ['PascalCase'],
        },
        {
          selector: 'enumMember',
          format: ['PascalCase'],
        },

        // Classes - PascalCase
        {
          selector: 'class',
          format: ['PascalCase'],
        },

        // Variables - camelCase (userData, isLoading)
        {
          selector: 'variable',
          format: ['camelCase'],
          leadingUnderscore: 'allow',
          trailingUnderscore: 'forbid',
        },

        // Constants - SCREAMING_SNAKE_CASE (API_BASE_URL, MAX_RETRY_ATTEMPTS)
        {
          selector: 'variable',
          modifiers: ['const'],
          format: ['UPPER_CASE', 'camelCase'], // Allow both for flexibility
          leadingUnderscore: 'allow',
        },

        // React Components - PascalCase (UserProfile, AuthButton)
        {
          selector: 'variable',
          types: ['function'],
          format: ['PascalCase'],
          filter: {
            regex: '^[A-Z]', // React components start with capital
            match: true,
          },
        },

        // Hooks - camelCase with use prefix (useAuth, useWallet)
        {
          selector: 'variable',
          types: ['function'],
          format: ['camelCase'],
          filter: {
            regex: '^use[A-Z]', // Hook pattern
            match: true,
          },
        },

        // Functions - camelCase (getUserData, validateInput)
        {
          selector: 'function',
          format: ['camelCase'],
        },
        {
          selector: 'method',
          format: ['camelCase'],
        },

        // Parameters - camelCase
        {
          selector: 'parameter',
          format: ['camelCase'],
          leadingUnderscore: 'allow',
        },

        // Properties - camelCase (onClick, isLoading)
        {
          selector: 'property',
          format: ['camelCase', 'PascalCase', 'UPPER_CASE'],
          leadingUnderscore: 'allow',
        },

        // State Props - isX, hasX, canX pattern (isOpen, hasIcon, canSubmit)
        {
          selector: 'property',
          types: ['boolean'],
          format: ['camelCase'],
          custom: {
            regex: '^(is|has|can|should|will|was)[A-Z]',
            match: true,
          },
        },
      ],
    },
  };
}

/**
 * JSON configuration.
 */
export function createJSONConfig() {
  return {
    name: 'plyaz/shared-json',
    files: ['**/*.{json}'],
    plugins: {
      jsonc: jsoncPlugin,
    },
    languageOptions: {
      parser: jsoncPlugin.parser,
    },
    rules: {
      'jsonc/no-comments': 'error',
      'jsonc/quote-props': ['error', 'always'],
      'jsonc/quotes': ['error', 'double'],
      'jsonc/no-multiple-empty-lines': ['error', { max: 1 }],
      'jsonc/indent': ['error', 2],
      'jsonc/comma-dangle': ['error', 'never'],
      // Disable rules not applicable to JSON
      'no-unused-expressions': 'off',
    },
  };
}

/**
 * File naming and syntax restrictions.
 */
export function createFileNamingConfig() {
  return {
    name: 'plyaz/shared-file-naming',
    files: ['**/*.{jsx,tsx,ts,js}'],
    rules: {
      'no-restricted-syntax': [
        'error',
        // Prevent Plyaz prefixing
        {
          selector: 'VariableDeclarator[id.name=/^Plyaz/]',
          message: 'Avoid prefixing components with "Plyaz" - it\'s redundant in context',
        },
        // Prevent generic naming
        {
          selector: 'VariableDeclarator[id.name=/^Custom/]',
          message:
            'Use semantic naming: avoid "CustomComponent", prefer descriptive names like "TokenAmountDisplay"',
        },
      ],
    },
  };
}

/**
 * Common base configuration with TypeScript, JS recommended, and stylistic.
 */
export function createBaseConfigs() {
  return [
    js.configs.recommended,
    ...typescriptEslint.configs.recommended,
    ...typescriptEslint.configs.strict,
    ...typescriptEslint.configs.stylistic,
  ];
}

/**
 * Common ignore patterns for all configurations.
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
];

/**
 * Common file override configurations.
 */
export function createCommonOverrides() {
  return [
    // Config files
    {
      name: 'plyaz/shared-config-files',
      files: [
        '**/*.config.{js,ts}',
        '**/config/*.{js,ts}',
        '**/rollup.config.{js,ts}',
        '**/vite.config.{js,ts}',
        '**/webpack.config.{js,ts}',
        '**/jest.config.{js,ts}',
        '**/vitest.config.{js,ts}',
        '**/tsup.config.{js,ts}',
        '**/next.config.js',
        '**/tailwind.config.js',
        '**/postcss.config.js',
      ],
      rules: {
        'import/no-default-export': 'off',
        '@typescript-eslint/no-var-requires': 'off',
        'unicorn/prefer-module': 'off',
        'no-magic-numbers': 'off',
        'no-console': 'off',
        'jsdoc/require-description': 'off',
      },
    },

    // Index files
    {
      name: 'plyaz/shared-index-files',
      files: ['**/index.{js,ts}', '**/src/index.{js,ts}'],
      rules: {
        'import/no-default-export': 'off',
        'import/prefer-default-export': 'off',
        'jsdoc/require-description': 'off',
        '@typescript-eslint/explicit-function-return-type': 'off',
      },
    },

    // Type definition files
    {
      name: 'plyaz/shared-type-definitions',
      files: ['**/*.d.ts'],
      rules: {
        '@typescript-eslint/no-explicit-any': 'off',
        'import/no-default-export': 'off',
        '@typescript-eslint/consistent-type-definitions': 'off',
        '@typescript-eslint/explicit-function-return-type': 'off',
        '@typescript-eslint/explicit-member-accessibility': 'off',
        'jsdoc/require-description': 'off',
        'unicorn/filename-case': 'off',
      },
    },

    // Test files
    {
      name: 'plyaz/shared-test-files',
      files: [
        '**/__tests__/**/*.{js,ts,tsx}',
        '**/*.{test,spec}.{js,ts,tsx}',
        '**/test/**/*.{js,ts,tsx}',
        '**/tests/**/*.{js,ts,tsx}',
      ],
      rules: {
        '@typescript-eslint/no-explicit-any': 'off',
        '@typescript-eslint/no-unsafe-assignment': 'off',
        '@typescript-eslint/no-unsafe-call': 'off',
        '@typescript-eslint/no-unsafe-member-access': 'off',
        '@typescript-eslint/unbound-method': 'off',
        '@typescript-eslint/explicit-function-return-type': 'off',
        '@typescript-eslint/explicit-member-accessibility': 'off',
        'no-console': 'off',
        'no-magic-numbers': 'off',
        'max-classes-per-file': 'off',
        'max-lines-per-function': 'off',
        'jsdoc/require-description': 'off',
        'jsdoc/require-param-description': 'off',
        'jsdoc/require-returns-description': 'off',
        'import/no-default-export': 'off',
        complexity: 'off',
        'max-lines': 'off',
        'unicorn/no-null': 'off',
        'unicorn/consistent-function-scoping': 'off',
      },
    },

    // Build and script files
    {
      name: 'plyaz/shared-build-scripts',
      files: ['**/scripts/**/*.{js,ts}', '**/build/**/*.{js,ts}', '**/tools/**/*.{js,ts}'],
      rules: {
        'no-console': 'off',
        '@typescript-eslint/no-var-requires': 'off',
        'unicorn/prefer-module': 'off',
        'import/no-default-export': 'off',
        'no-magic-numbers': 'off',
        'jsdoc/require-description': 'off',
        '@typescript-eslint/explicit-function-return-type': 'off',
        'unicorn/no-process-exit': 'off',
      },
    },

    // Example and documentation files
    {
      name: 'plyaz/shared-examples',
      files: [
        '**/examples/**/*.{js,ts,tsx}',
        '**/demo/**/*.{js,ts,tsx}',
        '**/docs/**/*.{js,ts,tsx}',
        '**/stories/**/*.{js,ts,tsx}',
      ],
      rules: {
        'no-console': 'off',
        'no-magic-numbers': 'off',
        'import/no-default-export': 'off',
        'jsdoc/require-description': 'off',
        '@typescript-eslint/explicit-function-return-type': 'off',
        complexity: 'off',
        'max-lines': 'off',
        'max-lines-per-function': 'off',
        'unicorn/filename-case': 'off',
      },
    },

    // Markdown files
    {
      name: 'plyaz/shared-markdown',
      files: ['**/*.md', '**/*.mdx'],
      rules: {
        // Disable all rules for markdown files
      },
    },

    // Package.json files
    {
      name: 'plyaz/shared-package-json',
      files: ['**/package.json'],
      rules: {
        // Disable all rules for package.json files
      },
    },
  ];
}

/**
 * Sonar code quality configuration for better maintainability.
 */
export function createSonarConfig() {
  return {
    name: 'plyaz/shared-sonar',
    files: ['**/*.{js,ts,tsx}'],
    plugins: {
      sonarjs: sonarjsPlugin,
    },
    rules: {
      // Cognitive complexity
      'sonarjs/cognitive-complexity': ['error', 15],
      'sonarjs/max-switch-cases': ['error', 30],

      // Duplications
      'sonarjs/no-duplicate-string': ['error', { threshold: 3 }],
      'sonarjs/no-duplicated-branches': 'error',
      'sonarjs/no-identical-conditions': 'error',
      'sonarjs/no-identical-expressions': 'error',
      'sonarjs/no-identical-functions': 'error',

      // Suspicious code
      'sonarjs/no-element-overwrite': 'error',
      'sonarjs/no-ignored-return': 'error',
      'sonarjs/no-redundant-boolean': 'error',
      'sonarjs/no-redundant-jump': 'error',
      'sonarjs/no-same-line-conditional': 'error',
      'sonarjs/no-useless-catch': 'error',

      // Code style
      'sonarjs/prefer-immediate-return': 'error',
      'sonarjs/prefer-object-literal': 'error',
      'sonarjs/prefer-single-boolean-return': 'error',
      'sonarjs/prefer-while': 'error',
    },
  };
}

/**
 * Regex security and optimization configuration.
 */
export function createRegexConfig() {
  return {
    name: 'plyaz/shared-regex',
    files: ['**/*.{js,ts,tsx}'],
    plugins: {
      regexp: regexpPlugin,
    },
    rules: {
      // Security - prevent ReDoS attacks
      'regexp/no-super-linear-backtracking': 'error',
      'regexp/no-control-character': 'error',
      'regexp/no-misleading-capturing-group': 'error',
      'regexp/no-misleading-unicode-character': 'error',
      'regexp/no-potentially-useless-backreference': 'error',

      // Correctness
      'regexp/no-dupe-characters-character-class': 'error',
      'regexp/no-empty-alternative': 'error',
      'regexp/no-empty-capturing-group': 'error',
      'regexp/no-empty-character-class': 'error',
      'regexp/no-empty-group': 'error',
      'regexp/no-escape-backspace': 'error',
      'regexp/no-invalid-regexp': 'error',
      'regexp/no-optional-assertion': 'error',
      'regexp/no-trivially-nested-assertion': 'error',
      'regexp/no-trivially-nested-quantifier': 'error',
      'regexp/no-unused-capturing-group': 'error',
      'regexp/no-useless-assertions': 'error',
      'regexp/no-useless-backreference': 'error',
      'regexp/no-useless-character-class': 'error',
      'regexp/no-useless-dollar-replacements': 'error',
      'regexp/no-useless-escape': 'error',
      'regexp/no-useless-flag': 'error',
      'regexp/no-useless-lazy': 'error',
      'regexp/no-useless-quantifier': 'error',
      'regexp/no-useless-range': 'error',
      'regexp/no-useless-two-nums-quantifier': 'error',
      'regexp/no-zero-quantifier': 'error',

      // Optimization
      'regexp/optimal-lookaround-quantifier': 'error',
      'regexp/optimal-quantifier-concatenation': 'error',
      'regexp/prefer-lookaround': 'error',
      'regexp/prefer-plus-quantifier': 'error',
      'regexp/prefer-question-quantifier': 'error',
      'regexp/prefer-range': 'error',
      'regexp/prefer-star-quantifier': 'error',
      'regexp/prefer-unicode-codepoint-escapes': 'error',
      'regexp/prefer-w': 'error',
      'regexp/sort-alternatives': 'error',
      'regexp/sort-flags': 'error',
      'regexp/strict': 'error',
      'regexp/use-ignore-case': 'error',

      // Best practices
      'regexp/prefer-named-backreference': 'error',
      'regexp/prefer-named-capture-group': 'error',
      'regexp/prefer-named-replacement': 'error',
      'regexp/prefer-result-array-groups': 'error',
      'regexp/prefer-regexp-exec': 'error',
      'regexp/prefer-regexp-test': 'error',
    },
  };
}

/**
 * Functional programming configuration for immutability and pure functions.
 * Do not use it for the following
 * Backend: ⚠️ Skipped createFunctionalConfig() - NestJS needs flexibility for classes/mutation
 * Frontend: ⚠️ Skipped createFunctionalConfig() - React needs flexibility for state updates
 */
export function createFunctionalConfig(options = {}) {
  const { enforceImmutability = true } = options;

  return {
    name: 'plyaz/shared-functional',
    files: ['**/*.{js,ts,tsx}'],
    plugins: {
      functional: functionalPlugin,
    },
    rules: {
      // Immutability (critical for Web3 state management)
      'functional/immutable-data': enforceImmutability ? 'error' : 'warn',
      'functional/prefer-readonly-type': 'warn',

      // Function purity
      'functional/no-this-expressions': 'off', // Allow this in classes
      'functional/no-try-statements': 'off', // Allow try/catch for error handling

      // Expression restrictions
      'functional/no-conditional-statements': 'off', // Too strict
      'functional/no-expression-statements': 'off', // Too strict
      'functional/no-return-void': 'off', // Allow void returns

      // Class restrictions
      'functional/no-classes': 'off', // Allow classes (NestJS needs them)
      'functional/no-mixed-types': 'off', // Allow mixed object/function types

      // Throw restrictions
      'functional/no-throw-statements': 'off', // Allow throwing errors

      // Style preferences
      'functional/functional-parameters': [
        'warn',
        {
          allowRestParameter: true,
          allowArgumentsKeyword: false,
          enforceParameterCount: false,
        },
      ],
    },
  };
}

/**
 * Web3 and blockchain-specific configuration.
 */
export function createWeb3Config() {
  return {
    name: 'plyaz/shared-web3',
    files: ['**/*.{js,ts,tsx}'],
    rules: {
      // BigInt and number safety
      'no-restricted-globals': [
        'error',
        {
          name: 'parseInt',
          message: 'Use Number.parseInt() instead for better BigInt compatibility in Web3',
        },
        {
          name: 'parseFloat',
          message:
            'Use Number.parseFloat() instead for better precision handling in financial calculations',
        },
        {
          name: 'isNaN',
          message: 'Use Number.isNaN() instead for better type safety',
        },
        {
          name: 'isFinite',
          message: 'Use Number.isFinite() instead for better type safety',
        },
      ],

      // Prevent unsafe financial calculations
      'no-restricted-syntax': [
        'error',
        {
          selector: "CallExpression[callee.name='eval']",
          message: 'eval() is forbidden for security reasons in Web3 applications',
        },
        {
          selector: 'Literal[value=/^0x[0-9a-fA-F]{40}$/]',
          message: 'Use typed address constants instead of hardcoded Ethereum addresses',
        },
        {
          selector: "BinaryExpression[operator='/'][left.type='Literal'][right.type='Literal']",
          message:
            'Use precise decimal libraries (decimal.js, big.js) for financial calculations instead of division',
        },
        {
          selector:
            "CallExpression[callee.object.name='Math'][callee.property.name=/^(round|floor|ceil)$/]",
          message:
            'Use decimal.js or similar libraries for precise financial rounding instead of Math methods',
        },
        {
          selector: "BinaryExpression[operator='%']",
          message:
            'Be cautious with modulo operations on financial values - consider using decimal libraries',
        },
        {
          selector: "UpdateExpression[operator='++']",
          message:
            'Avoid increment operators with financial values - use explicit addition for clarity',
        },
        {
          selector: "UpdateExpression[operator='--']",
          message:
            'Avoid decrement operators with financial values - use explicit subtraction for clarity',
        },
      ],

      // Enhanced magic numbers for Web3
      'no-magic-numbers': [
        'error',
        {
          ignore: [
            // Standard allowed
            -1,
            0,
            1,
            2,
            10,
            100,
            1000,
            // Web3 specific
            18, // Standard ERC20 decimals
            1e18, // 1 ETH in wei
            21000, // Standard gas limit
            8, // Bitcoin decimals
            6, // USDC decimals
          ],
          ignoreArrayIndexes: true,
          ignoreDefaultValues: true,
          detectObjects: false,
          enforceConst: true,
          ignoreClassFieldInitialValues: true,
        },
      ],

      // Numeric literal safety
      'prefer-numeric-literals': 'error',

      // Additional async safety for Web3
      'no-async-promise-executor': 'error',
      'no-promise-executor-return': 'error',
      'require-atomic-updates': 'error',
    },
  };
}

/**
 * Performance optimization configuration.
 */
export function createPerformanceConfig() {
  return {
    name: 'plyaz/shared-performance',
    files: ['**/*.{js,ts,tsx}'],
    rules: {
      // Array and object optimizations
      'no-array-constructor': 'error',
      'no-new-object': 'error',
      'prefer-spread': 'error',
      'prefer-rest-params': 'error',

      // Loop optimizations
      'no-await-in-loop': 'warn',
      'no-unreachable-loop': 'error',

      // Function optimizations
      'no-inner-declarations': 'error',
      'no-implicit-coercion': [
        'error',
        {
          boolean: false,
          number: true,
          string: true,
          disallowTemplateShorthand: false,
        },
      ],

      // Regex optimizations
      'no-regex-spaces': 'error',
      'prefer-named-capture-group': 'warn',

      // Object property optimizations
      'dot-notation': [
        'error',
        {
          allowKeywords: true,
          allowPattern: '^[a-z]+(_[a-z]+)+$',
        },
      ],

      // String optimizations
      'prefer-template': 'error',
      'no-useless-concat': 'error',

      // Callback optimizations
      'max-nested-callbacks': ['warn', 3],

      // Memory leak prevention
      'no-global-assign': 'error',
      'no-implicit-globals': 'error',
      'no-unused-vars': [
        'error',
        {
          vars: 'all',
          args: 'after-used',
          ignoreRestSiblings: true,
          argsIgnorePattern: '^_',
          varsIgnorePattern: '^_',
        },
      ],

      // Efficient comparisons
      eqeqeq: ['error', 'always', { null: 'ignore' }],
      'no-eq-null': 'off',

      // Prevent inefficient patterns
      'no-extra-boolean-cast': 'error',
      'no-extra-parens': [
        'error',
        'all',
        {
          conditionalAssign: false,
          returnAssign: false,
          nestedBinaryExpressions: false,
          ignoreJSX: 'all',
          enforceForArrowConditionals: false,
        },
      ],
      'no-lonely-if': 'error',
      'no-unneeded-ternary': ['error', { defaultAssignment: false }],
      'no-useless-call': 'error',
      'no-useless-return': 'error',

      // Optimize destructuring
      'prefer-destructuring': [
        'warn',
        {
          array: true,
          object: true,
        },
        {
          enforceForRenamedProperties: false,
        },
      ],

      // Optimize object creation
      'object-shorthand': [
        'error',
        'always',
        {
          ignoreConstructors: false,
          avoidQuotes: true,
        },
      ],

      // Function expression optimizations
      'prefer-arrow-callback': [
        'error',
        {
          allowNamedFunctions: false,
          allowUnboundThis: true,
        },
      ],

      // Reduce bundle size
      'no-duplicate-imports': 'error',
      'no-useless-constructor': 'error',
      'no-useless-computed-key': 'error',
      'no-useless-rename': 'error',

      // Additional performance rules
      'no-delete-var': 'error',
      'no-label-var': 'error',
      'no-shadow-restricted-names': 'error',
      'no-undef-init': 'error',
      'no-undefined': 'off',
      'no-use-before-define': [
        'error',
        {
          functions: false,
          classes: true,
          variables: true,
        },
      ],

      // Optimize conditionals
      'no-else-return': ['error', { allowElseIf: false }],
      'no-negated-condition': 'warn',
      'no-nested-ternary': 'error',

      // Optimize loops
      'no-loop-func': 'error',
      'no-unmodified-loop-condition': 'error',

      // Optimize error handling
      'no-throw-literal': 'error',
      'prefer-promise-reject-errors': ['error', { allowEmptyReject: true }],

      // Optimize variable declarations
      'one-var': ['error', 'never'],
      'operator-assignment': ['error', 'always'],

      // Optimize regex usage
      'no-invalid-regexp': 'error',
      'no-misleading-character-class': 'error',

      // Optimize property access
      'prefer-exponentiation-operator': 'error',
      'prefer-object-spread': 'error',

      // Optimize string operations
      'no-multi-str': 'error',
      'no-octal-escape': 'error',
      quotes: [
        'error',
        'single',
        {
          avoidEscape: true,
          allowTemplateLiterals: true,
        },
      ],

      // Optimize numeric operations
      'no-floating-decimal': 'error',
      'no-multi-spaces': 'error',
      'no-multiple-empty-lines': [
        'error',
        {
          max: 2,
          maxEOF: 0,
          maxBOF: 0,
        },
      ],

      // Optimize whitespace
      'no-trailing-spaces': 'error',
      'no-whitespace-before-property': 'error',
      'space-before-blocks': 'error',
      'space-before-function-paren': [
        'error',
        {
          anonymous: 'always',
          named: 'never',
          asyncArrow: 'always',
        },
      ],
      'space-in-parens': ['error', 'never'],
      'space-infix-ops': 'error',
      'space-unary-ops': [
        'error',
        {
          words: true,
          nonwords: false,
        },
      ],

      // Optimize semicolons
      semi: ['error', 'always'],
      'semi-spacing': [
        'error',
        {
          before: false,
          after: true,
        },
      ],
    },
  };
}
