import js from '@eslint/js';
import nextPlugin from '@next/eslint-plugin-next';
import reactPlugin from 'eslint-plugin-react';
import reactHooksPlugin from 'eslint-plugin-react-hooks';
import jsxA11yPlugin from 'eslint-plugin-jsx-a11y';
import tailwindcssPlugin from 'eslint-plugin-tailwindcss';
import unicornPlugin from 'eslint-plugin-unicorn';
import importPlugin from 'eslint-plugin-import';
import unusedImportsPlugin from 'eslint-plugin-unused-imports';
import simpleImportSortPlugin from 'eslint-plugin-simple-import-sort';
import typescriptEslint from 'typescript-eslint';

export function createBaseConfig({ tsconfigDir = process.cwd() } = {}) {
  return typescriptEslint.config(
    {
      name: 'plyaz/frontend',
      ignores: [
        '**/node_modules/**',
        '**/dist/**',
        '**/build/**',
        '**/.next/**',
        '**/coverage/**',
        '**/*.min.js',
        '**/public/**',
        '**/.turbo/**',
        '**/.vercel/**',
        '**/storybook-static/**',
        '**/*.generated.{js,ts,tsx}',
        '**/generated/**',
        '**/next.config.js',
        '**/tailwind.config.js',
        '**/postcss.config.js',
      ],
    },

    // Base ESLint and TypeScript configuration
    js.configs.recommended,
    ...typescriptEslint.configs.recommended,
    ...typescriptEslint.configs.strict,
    ...typescriptEslint.configs.stylistic,

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

    // TypeScript specific configuration
    {
      name: 'plyaz/typescript',
      files: ['**/*.{ts,tsx}'],
      languageOptions: {
        parser: typescriptEslint.parser,
        parserOptions: {
          project: true,
          tsconfigRootDir: tsconfigDir,
        },
      },
      rules: {
        // Critical for Web3/Financial security
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
        '@typescript-eslint/no-confusing-void-expression': [
          'error',
          {
            ignoreArrowShorthand: true,
          },
        ],
        '@typescript-eslint/no-duplicate-type-constituents': 'error',
        '@typescript-eslint/no-import-type-side-effects': 'error',
        '@typescript-eslint/no-meaningless-void-operator': 'error',
        '@typescript-eslint/no-mixed-enums': 'error',
        '@typescript-eslint/no-redundant-type-constituents': 'error',
        '@typescript-eslint/no-useless-empty-export': 'error',
        '@typescript-eslint/prefer-enum-initializers': 'error',
        '@typescript-eslint/prefer-readonly': 'error',
        '@typescript-eslint/prefer-regexp-exec': 'error',
        '@typescript-eslint/switch-exhaustiveness-check': 'error',
      },
    },

    // Tailwind CSS configuration
    {
      name: 'plyaz/tailwind',
      files: ['**/*.{jsx,tsx}'],
      plugins: {
        tailwindcss: tailwindcssPlugin,
      },
      rules: {
        'tailwindcss/classnames-order': 'error',
        'tailwindcss/enforces-negative-arbitrary-values': 'error',
        'tailwindcss/enforces-shorthand': 'error',
        'tailwindcss/migration-from-tailwind-2': 'error',
        'tailwindcss/no-arbitrary-value': 'off', // Allow arbitrary values for custom designs
        'tailwindcss/no-contradicting-classname': 'error',
        'tailwindcss/no-custom-classname': 'off', // Allow custom classes
      },
      settings: {
        tailwindcss: {
          callees: ['cn', 'clsx', 'cva'],
          config: './tailwind.config.js',
        },
      },
    },

    // Import and sorting configuration
    {
      name: 'plyaz/imports',
      files: ['**/*.{js,jsx,ts,tsx}'],
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
            extensions: ['.js', '.jsx', '.ts', '.tsx'],
          },
        },
      },
      rules: {
        // Import organization for large codebase
        'simple-import-sort/imports': [
          'error',
          {
            groups: [
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

    // Unicorn modern practices
    {
      name: 'plyaz/unicorn',
      files: ['**/*.{js,jsx,ts,tsx}'],
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
            ignore: ['README.md', 'CHANGELOG.md', 'LICENSE', '\\.d\\.ts$'],
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
              btn: true,
              nav: true,
              lib: true,
              pkg: true,
              addr: true,
            },
          },
        ],
        'unicorn/no-null': 'off', // Allow null in React
        'unicorn/prefer-top-level-await': 'off', // Not compatible with Next.js
        'unicorn/prefer-module': 'off', // Allow CommonJS in config files
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
        'unicorn/prefer-keyboard-event-key': 'error',
        'unicorn/prefer-math-trunc': 'error',
        'unicorn/prefer-modern-dom-apis': 'error',
        'unicorn/prefer-modern-math-apis': 'error',
        'unicorn/prefer-native-coercion-functions': 'error',
        'unicorn/prefer-negative-index': 'error',
        'unicorn/prefer-number-properties': 'error',
        'unicorn/prefer-object-from-entries': 'error',
        'unicorn/prefer-optional-catch-binding': 'error',
        'unicorn/prefer-prototype-methods': 'error',
        'unicorn/prefer-query-selector': 'error',
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

    // General best practices
    {
      name: 'plyaz/best-practices',
      files: ['**/*.{js,jsx,ts,tsx}'],
      rules: {
        // Security and best practices for Web3
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
            allow: ['warn', 'error'],
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
            max: 10,
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
            ],
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
              markers: ['=', '!', '/'],
            },
            block: {
              exceptions: ['-', '+'],
              markers: ['=', '!', ':', '::'],
              balanced: true,
            },
          },
        ],
      },
    },

    // Overrides for specific file patterns
    {
      name: 'plyaz/config-files',
      files: [
        '**/*.config.{js,ts}',
        '**/config/*.{js,ts}',
        '**/next.config.js',
        '**/tailwind.config.js',
        '**/postcss.config.js',
      ],
      rules: {
        'import/no-default-export': 'off',
        '@typescript-eslint/no-var-requires': 'off',
        'unicorn/prefer-module': 'off',
      },
    },

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
      name: 'plyaz/type-definitions',
      files: ['**/*.d.ts'],
      rules: {
        '@typescript-eslint/no-explicit-any': 'off',
        'import/no-default-export': 'off',
      },
    },

    // Test files
    {
      name: 'plyaz/test-files',
      files: ['**/__tests__/**/*.{js,jsx,ts,tsx}', '**/*.{test,spec}.{js,jsx,ts,tsx}'],
      rules: {
        '@typescript-eslint/no-explicit-any': 'off',
        '@typescript-eslint/no-unsafe-assignment': 'off',
        '@typescript-eslint/no-unsafe-call': 'off',
        '@typescript-eslint/no-unsafe-member-access': 'off',
        '@typescript-eslint/unbound-method': 'off',
        'no-console': 'off',
      },
    }
  );
}
