import js from '@eslint/js';
import typescriptEslint from 'typescript-eslint';
import unicornPlugin from 'eslint-plugin-unicorn';
import importPlugin from 'eslint-plugin-import';
import unusedImportsPlugin from 'eslint-plugin-unused-imports';
import simpleImportSortPlugin from 'eslint-plugin-simple-import-sort';
import securityPlugin from 'eslint-plugin-security';
import jsdocPlugin from 'eslint-plugin-jsdoc';

export function createBaseConfig({ tsconfigDir = process.cwd() } = {}) {
  return typescriptEslint.config(
    {
      name: 'plyaz/shared-base',
      ignores: [
        '**/node_modules/**',
        '**/dist/**',
        '**/build/**',
        '**/coverage/**',
        '**/*.min.js',
        '**/.turbo/**',
        '**/storybook-static/**',
        '**/*.generated.{js,ts}',
        '**/generated/**',
        '**/lib/**/*.js', // Build outputs
        '**/esm/**/*.js', // Build outputs
        '**/cjs/**/*.js', // Build outputs
      ],
    },

    // Base configuration
    js.configs.recommended,
    ...typescriptEslint.configs.recommended,
    ...typescriptEslint.configs.strict,
    ...typescriptEslint.configs.stylistic,

    // TypeScript configuration optimized for shared packages
    {
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

        // API design for shared packages
        '@typescript-eslint/method-signature-style': ['error', 'property'],
        '@typescript-eslint/array-type': ['error', { default: 'array-simple' }],
        '@typescript-eslint/consistent-type-definitions': ['error', 'interface'],
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

              // Getters
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

              // Setters
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
        '@typescript-eslint/parameter-properties': [
          'error',
          {
            prefer: 'class-property',
          },
        ],
        '@typescript-eslint/prefer-enum-initializers': 'error',
        '@typescript-eslint/prefer-readonly': 'error',
        '@typescript-eslint/prefer-readonly-parameter-types': 'off', // Too strict for utility functions
        '@typescript-eslint/prefer-regexp-exec': 'error',
        '@typescript-eslint/switch-exhaustiveness-check': 'error',
        '@typescript-eslint/unified-signatures': 'error',
        '@typescript-eslint/naming-convention': [
          'error',
          {
            selector: 'interface',
            format: ['PascalCase'],
            custom: {
              regex: '^I[A-Z]',
              match: false,
            },
          },
          {
            selector: 'typeAlias',
            format: ['PascalCase'],
          },
          {
            selector: 'enum',
            format: ['PascalCase'],
          },
          {
            selector: 'enumMember',
            format: ['PascalCase'],
          },
          {
            selector: 'class',
            format: ['PascalCase'],
          },
          {
            selector: 'method',
            format: ['camelCase'],
          },
          {
            selector: 'function',
            format: ['camelCase'],
          },
          {
            selector: 'variable',
            format: ['camelCase', 'PascalCase', 'UPPER_CASE'],
            leadingUnderscore: 'allow',
            trailingUnderscore: 'forbid',
          },
          {
            selector: 'parameter',
            format: ['camelCase'],
            leadingUnderscore: 'allow',
          },
          {
            selector: 'property',
            format: ['camelCase', 'PascalCase', 'UPPER_CASE'],
            leadingUnderscore: 'allow',
          },
        ],
      },
    },

    // Security configuration for shared packages
    {
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
    },

    // JSDoc configuration for shared packages (important for documentation)
    {
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
        'jsdoc/require-description': [
          'error',
          {
            contexts: [
              'ClassDeclaration',
              'FunctionDeclaration',
              'MethodDefinition',
              'TSInterfaceDeclaration',
              'TSTypeAliasDeclaration',
              'TSEnumDeclaration',
            ],
          },
        ],
        'jsdoc/require-description-complete-sentence': 'error',
        'jsdoc/require-param': 'error',
        'jsdoc/require-param-description': 'error',
        'jsdoc/require-param-name': 'error',
        'jsdoc/require-param-type': 'off', // Using TypeScript
        'jsdoc/require-property': 'error',
        'jsdoc/require-property-description': 'error',
        'jsdoc/require-property-name': 'error',
        'jsdoc/require-property-type': 'off', // Using TypeScript
        'jsdoc/require-returns': 'error',
        'jsdoc/require-returns-check': 'error',
        'jsdoc/require-returns-description': 'error',
        'jsdoc/require-returns-type': 'off', // Using TypeScript
        'jsdoc/require-throws': 'error',
        'jsdoc/require-yields': 'error',
        'jsdoc/require-yields-check': 'error',
        'jsdoc/tag-lines': 'error',
        'jsdoc/valid-types': 'error',
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
        },
      },
    },

    // Import organization for shared packages
    {
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
            project: './tsconfig.json',
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
            groups: [
              // Side effect imports
              ['^\\u0000'],
              // Node.js built-ins
              ['^node:'],
              // External packages
              ['^@?\\w'],
              // Internal packages (@plyaz/*)
              ['^(@plyaz)(/.*|$)'],
              // Relative imports from parent directories
              ['^\\.\\.(?!/?$)', '^\\.\\./?'],
              // Relative imports from current directory
              ['^\\./(?=.*/)(?!/?$)', '^\\.(?!/?$)', '^\\./?'],
            ],
          },
        ],
        'simple-import-sort/exports': 'error',
        'import/no-unresolved': 'error',
        'import/no-cycle': ['error', { maxDepth: 10 }],
        'import/no-self-import': 'error',
        'import/no-useless-path-segments': 'error',
        'import/consistent-type-specifier-style': ['error', 'prefer-top-level'],
        'import/no-duplicates': ['error', { 'prefer-inline': true }],
        'import/first': 'error',
        'import/newline-after-import': 'error',
        'import/prefer-default-export': 'off', // Prefer named exports for tree shaking
        'import/no-default-export': 'error',
        'import/group-exports': 'error',
        'import/exports-last': 'error',
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
    },

    // Unicorn modern practices for shared packages
    {
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
            ignore: ['README.md', 'CHANGELOG.md', 'LICENSE', '\\.d\\.ts', 'index.ts'],
          },
        ],
        'unicorn/prevent-abbreviations': [
          'error',
          {
            allowList: {
              Props: true,
              props: true,
              ref: true,
              Ref: true,
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
              addr: true,
              i: true,
              j: true,
              k: true,
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
              id: true,
              Id: true,
              ID: true,
              url: true,
              URL: true,
              uri: true,
              URI: true,
              uuid: true,
              UUID: true,
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
            },
          },
        ],
        'unicorn/no-null': 'off', // Allow null for API compatibility
        'unicorn/prefer-top-level-await': 'off', // Not always suitable
        'unicorn/prefer-module': 'off', // Allow CommonJS for compatibility
        'unicorn/no-array-reduce': 'off', // Reduce is useful
        'unicorn/no-await-expression-member': 'off',
        'unicorn/prefer-ternary': 'off',
        'unicorn/consistent-function-scoping': 'off',
        'unicorn/no-nested-ternary': 'error',
        'unicorn/better-regex': 'error',
        'unicorn/catch-error-name': ['error', { name: 'error' }],
        'unicorn/consistent-destructuring': 'error',
        'unicorn/custom-error-definition': 'error',
        'unicorn/error-message': 'error',
        'unicorn/escape-case': 'error',
        'unicorn/expiring-todo-comments': [
          'error',
          {
            terms: ['TODO', 'FIXME', 'HACK'],
            ignore: [],
            ignoreDatesOnPullRequests: true,
            allowWarningComments: false,
            date: '2025-12-31',
          },
        ],
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
        'unicorn/no-unsafe-regex': 'error',
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
        'unicorn/prefer-logical-operator-over-ternary': 'error',
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
    },

    // General best practices for shared packages
    {
      name: 'plyaz/shared-best-practices',
      files: ['**/*.{js,ts,tsx}'],
      rules: {
        // Critical for shared package reliability
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
        'no-console': 'error', // No console in shared packages
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
            max: 8, // Lower for shared utilities
          },
        ],
        'consistent-return': 'error',
        'default-case': 'error',
        'default-case-last': 'error',
        'grouped-accessor-pairs': ['error', 'getBeforeSet'],
        'guard-for-in': 'error',
        'max-classes-per-file': ['error', 1],
        'max-depth': ['warn', 4],
        'max-lines': [
          'warn',
          {
            max: 300,
            skipBlankLines: true,
            skipComments: true,
          },
        ],
        'max-lines-per-function': [
          'warn',
          {
            max: 50,
            skipBlankLines: true,
            skipComments: true,
          },
        ],
        'max-params': ['warn', 4],
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
            ignorePropertyModificationsFor: ['acc', 'accumulator', 'e', 'event', 'state', 'draft'],
          },
        ],
        'no-proto': 'error',
        'no-undef-init': 'error',
        'no-underscore-dangle': [
          'error',
          {
            allow: ['_id', '__dirname', '__filename'],
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

        // Additional rules for utility packages
        'no-duplicate-imports': 'error',
        'no-unreachable': 'error',
        'no-unreachable-loop': 'error',
        'require-atomic-updates': 'error',
        'use-isnan': 'error',
        'valid-typeof': 'error',
      },
    },

    // Overrides for specific file patterns
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
        'n/no-unpublished-import': 'off',
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

    // Example and demo files
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

    // Markdown and documentation files
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
    }
  );
}
