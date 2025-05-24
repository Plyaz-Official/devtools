module.exports = {
  extends: [
    "next/core-web-vitals",
    "next/typescript",
    "eslint:recommended",
    "plugin:react/recommended",
    "plugin:react-hooks/recommended",
    "plugin:import/errors",
    "plugin:import/warnings",
    "plugin:import/typescript",
    "@typescript-eslint/recommended",
    "@typescript-eslint/recommended-requiring-type-checking",
    "prettier",
  ],
  plugins: [
    "@typescript-eslint",
    "react-hooks",
    "react",
    "unused-imports",
    "jsx-a11y",
    "unicorn",
    "import",
  ],
  rules: {
    // Performance & Core Web Vitals
    "@next/next/no-img-element": "error",
    "@next/next/no-page-custom-font": "error",
    "@next/next/no-unwanted-polyfillio": "error",
    "@next/next/no-duplicate-head": "error",
    "@next/next/no-head-import-in-document": "error",

    // TypeScript Best Practices
    "@typescript-eslint/no-unused-vars": [
      "error",
      {
        argsIgnorePattern: "^_",
        varsIgnorePattern: "^_",
      },
    ],
    "@typescript-eslint/explicit-function-return-type": "warn",
    "@typescript-eslint/no-explicit-any": "error",
    "@typescript-eslint/prefer-nullish-coalescing": "error",
    "@typescript-eslint/prefer-optional-chain": "error",
    "@typescript-eslint/no-non-null-assertion": "error",
    "@typescript-eslint/consistent-type-imports": "error",

    // React Best Practices
    "react/jsx-key": "error",
    "react/jsx-no-leaked-render": "error",
    "react/prop-types": "off",
    "react/react-in-jsx-scope": "off",
    "react/no-unstable-nested-components": "error",
    "react-hooks/rules-of-hooks": "error",
    "react-hooks/exhaustive-deps": "warn",

    // Import Organization
    "import/order": [
      "error",
      {
        groups: [
          "builtin",
          "external",
          "internal",
          "parent",
          "sibling",
          "index",
        ],
        pathGroups: [
          {
            pattern: "@plyaz/**",
            group: "internal",
            position: "before",
          },
        ],
        "newlines-between": "always",
        alphabetize: { order: "asc" },
      },
    ],

    // Unused imports
    "unused-imports/no-unused-imports": "error",
    "unused-imports/no-unused-vars": [
      "warn",
      {
        vars: "all",
        varsIgnorePattern: "^_",
        args: "after-used",
        argsIgnorePattern: "^_",
      },
    ],

    // Security & Quality
    "no-console": "error",
    "no-debugger": "error",
    "prefer-const": "error",
    "no-var": "error",

    // Accessibility
    "jsx-a11y/alt-text": "error",
    "jsx-a11y/aria-props": "error",
    "jsx-a11y/aria-proptypes": "error",
    "jsx-a11y/role-supports-aria-props": "error",

    // Modern JavaScript
    "unicorn/prefer-node-protocol": "error",
    "unicorn/no-array-for-each": "error",
    "unicorn/prefer-array-some": "error",
    "unicorn/prefer-includes": "error",
  },
  settings: {
    "import/resolver": {
      typescript: {
        project: "./tsconfig.json",
      },
    },
    react: {
      version: "detect",
    },
  },
  ignorePatterns: ["dist", "build", "node_modules", "coverage"],
};
