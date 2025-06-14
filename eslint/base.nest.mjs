import js from '@eslint/js';
import typescriptEslint from 'typescript-eslint';
import nestjsTypedPlugin from '@darraghor/eslint-plugin-nestjs-typed';
import securityPlugin from 'eslint-plugin-security';
import unicornPlugin from 'eslint-plugin-unicorn';
import importPlugin from 'eslint-plugin-import';
import unusedImportsPlugin from 'eslint-plugin-unused-imports';
import simpleImportSortPlugin from 'eslint-plugin-simple-import-sort';
import nodePlugin from 'eslint-plugin-n';

export function createBaseConfig({ tsconfigDir = process.cwd() } = {}) {
  return typescriptEslint.config(
    {
      name: 'plyaz/backend',
      ignores: [
        '**/node_modules/**',
        '**/dist/**',
        '**/build/**',
        '**/coverage/**',
        '**/*.min.js',
        '**/.turbo/**',
        '**/logs/**',
        '**/*.generated.{js,ts}',
        '**/generated/**',
        '**/prisma/migrations/**',
        '**/database/migrations/**',
        '**/hardhat.config.ts',
      ],
    },

    // Base configuration
    js.configs.recommended,
    ...typescriptEslint.configs.recommended,
    ...typescriptEslint.configs.strict,
    ...typescriptEslint.configs.stylistic,

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

    // TypeScript configuration for backend
    {
      name: 'plyaz/nestjs-typescript',
      files: ['**/*.ts'],
      languageOptions: {
        parser: typescriptEslint.parser,
        parserOptions: {
          project: true,
          tsconfigRootDir: tsconfigDir,
        },
      },
      rules: {
        // Critical security rules for Web3/Financial platform
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
            checksVoidReturn: {
              attributes: false,
            },
          },
        ],
        '@typescript-eslint/require-await': 'error',
        '@typescript-eslint/return-await': ['error', 'always'],
        '@typescript-eslint/no-unnecessary-type-assertion': 'error',
        '@typescript-eslint/no-non-null-assertion': 'error',
        '@typescript-eslint/consistent-type-imports': [
          'error',
          {
            prefer: 'type-imports',
            fixStyle: 'separate-type-imports',
          },
        ],
        '@typescript-eslint/consistent-type-exports': [
          'error',
          {
            fixMixedExportsWithInlineTypeSpecifier: true,
          },
        ],
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
        '@typescript-eslint/prefer-readonly-parameter-types': 'off', // Too strict for NestJS
        '@typescript-eslint/prefer-regexp-exec': 'error',
        '@typescript-eslint/switch-exhaustiveness-check': 'error',
        '@typescript-eslint/unified-signatures': 'error',
      },
    },

    // Security configuration - Critical for Web3/Financial platforms
    {
      name: 'plyaz/nestjs-security',
      files: ['**/*.{js,ts}'],
      plugins: {
        security: securityPlugin,
      },
      rules: {
        'security/detect-object-injection': 'error',
        'security/detect-non-literal-regexp': 'error',
        'security/detect-non-literal-fs-filename': 'error',
        'security/detect-eval-with-expression': 'error',
        'security/detect-pseudoRandomBytes': 'error',
        'security/detect-possible-timing-attacks': 'error',
        'security/detect-unsafe-regex': 'error',
        'security/detect-buffer-noassert': 'error',
        'security/detect-child-process': 'error',
        'security/detect-disable-mustache-escape': 'error',
        'security/detect-new-buffer': 'error',
        'security/detect-no-csrf-before-method-override': 'error',
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

    // Import organization for backend
    {
      name: 'plyaz/nestjs-imports',
      files: ['**/*.{js,ts}'],
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
            extensions: ['.js', '.ts'],
          },
        },
      },
      rules: {
        'simple-import-sort/imports': [
          'error',
          {
            groups: [
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
        'import/no-default-export': 'error', // Prefer named exports in backend
        'import/prefer-default-export': 'off',
        'unused-imports/no-unused-imports': 'error',
        'unused-imports/no-unused-vars': [
          'error',
          {
            vars: 'all',
            varsIgnorePattern: '^_',
            args: 'after-used',
            argsIgnorePattern: '^_',
          },
        ],
      },
    },

    // Unicorn modern practices for backend
    {
      name: 'plyaz/nestjs-unicorn',
      files: ['**/*.{js,ts}'],
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
            ignore: [
              'README.md',
              'CHANGELOG.md',
              'LICENSE',
              '\\.d\\.ts',
              '\\.module\\.ts',
              '\\.controller\\.ts',
              '\\.service\\.ts',
              '\\.guard\\.ts',
              '\\.interceptor\\.ts',
              '\\.pipe\\.ts',
              '\\.decorator\\.ts',
              '\\.filter\\.ts',
            ],
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
              dto: true,
              Dto: true,
              DTO: true,
              id: true,
              Id: true,
              ID: true,
              url: true,
              URL: true,
              jwt: true,
              JWT: true,
              uuid: true,
              UUID: true,
            },
          },
        ],
        'unicorn/no-null': 'off', // Allow null in database operations
        'unicorn/prefer-top-level-await': 'off', // Not always suitable for NestJS
        'unicorn/prefer-module': 'off', // Allow CommonJS in config files
        'unicorn/no-array-reduce': 'off', // Reduce is useful for data processing
        'unicorn/no-await-expression-member': 'off',
        'unicorn/prefer-ternary': 'off',
        'unicorn/consistent-function-scoping': 'off',
        'unicorn/no-process-exit': 'off', // Needed in NestJS apps
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
        'unicorn/no-static-only-class': 'off', // NestJS modules can be static-only
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
        'unicorn/prefer-keyboard-event-key': 'off', // Not relevant for backend
        'unicorn/prefer-math-trunc': 'error',
        'unicorn/prefer-modern-dom-apis': 'off', // Not relevant for backend
        'unicorn/prefer-modern-math-apis': 'error',
        'unicorn/prefer-native-coercion-functions': 'error',
        'unicorn/prefer-negative-index': 'error',
        'unicorn/prefer-number-properties': 'error',
        'unicorn/prefer-object-from-entries': 'error',
        'unicorn/prefer-optional-catch-binding': 'error',
        'unicorn/prefer-prototype-methods': 'error',
        'unicorn/prefer-query-selector': 'off', // Not relevant for backend
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

    // General best practices for backend
    {
      name: 'plyaz/nestjs-best-practices',
      files: ['**/*.{js,ts}'],
      rules: {
        // Security and reliability for financial platform
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
        'no-console': [
          'warn',
          {
            allow: ['warn', 'error', 'info'], // Allow info for structured logging
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
            max: 15, // Slightly higher for backend business logic
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

        // Additional rules for API development
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
      name: 'plyaz/nestjs-config-files',
      files: [
        '**/*.config.{js,ts}',
        '**/config/*.{js,ts}',
        '**/jest.config.{js,ts}',
        '**/webpack.config.{js,ts}',
        '**/prisma.config.{js,ts}',
      ],
      rules: {
        'import/no-default-export': 'off',
        '@typescript-eslint/no-var-requires': 'off',
        'unicorn/prefer-module': 'off',
        'no-magic-numbers': 'off',
      },
    },

    {
      name: 'plyaz/nestjs-main-files',
      files: ['**/main.ts', '**/bootstrap.ts', '**/app.module.ts'],
      rules: {
        'no-console': 'off', // Allow console in main files for startup logs
        'unicorn/no-process-exit': 'off',
      },
    },

    {
      name: 'plyaz/nestjs-type-definitions',
      files: ['**/*.d.ts'],
      rules: {
        '@typescript-eslint/no-explicit-any': 'off',
        'import/no-default-export': 'off',
        '@typescript-eslint/consistent-type-definitions': 'off',
      },
    },

    // Test files
    {
      name: 'plyaz/nestjs-test-files',
      files: [
        '**/__tests__/**/*.{js,ts}',
        '**/*.{test,spec}.{js,ts}',
        '**/test/**/*.{js,ts}',
        '**/tests/**/*.{js,ts}',
      ],
      rules: {
        '@typescript-eslint/no-explicit-any': 'off',
        '@typescript-eslint/no-unsafe-assignment': 'off',
        '@typescript-eslint/no-unsafe-call': 'off',
        '@typescript-eslint/no-unsafe-member-access': 'off',
        '@typescript-eslint/unbound-method': 'off',
        '@typescript-eslint/explicit-function-return-type': 'off',
        'no-console': 'off',
        'no-magic-numbers': 'off',
        'max-classes-per-file': 'off',
        '@darraghor/nestjs-typed/injectable-should-be-provided': 'off',
        'import/no-default-export': 'off',
      },
    },

    // Database and migration files
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
    }
  );
}
