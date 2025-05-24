# **PLYAZ Base Configuration Templates**

This folder contains base config templates for TypeScript and other shared configurations used across PLYAZ repos.

## **Purpose**

- Provide consistent coding standards and build configurations.
- Simplify maintenance and onboarding.
- Allow easy extension/customization per repo.

## **Usage**

1. Copy or extend the configs in your repo:

### TypeScript Configuration

```json
{
  "extends": "@plyaz/devtools/configs/tsconfig.base.json",
  "compilerOptions": {
    // your custom overrides
  }
}
```

### Vitest Configuration

```javascript
import { defineConfig } from "vitest/config";
import baseConfig from "@plyaz/devtools/configs/vitest.config";

export default defineConfig({
  ...baseConfig,
  // your custom overrides
});
```

## **Other Configurations**

For ESLint and Prettier configurations, see the dedicated folders:

- ESLint: `/eslint/` folder
- Prettier: `/prettier/` folder

## **Files in this folder**

- `tsconfig.base.json` - Base TypeScript configuration
- `vitest.config.ts` - Base Vitest testing configuration
