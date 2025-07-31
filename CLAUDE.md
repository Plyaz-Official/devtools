# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Repository Overview

This is `@plyaz/devtools` - a centralized repository providing shared development tooling, configurations, and workflows for the Plyaz ecosystem. It ensures consistency across all `@plyaz` repositories through standardized linting, testing, building, and publishing processes.

## Common Development Commands

### Build Commands
```bash
pnpm build          # Clean and build with TypeScript
pnpm clean          # Remove dist directory
```

### Testing Commands
```bash
pnpm test           # Run tests once with Vitest
pnpm test:watch     # Run tests in watch mode
pnpm test:coverage  # Run tests with coverage report
pnpm test:ui        # Run tests with Vitest UI
pnpm test:ci        # Run tests in CI mode
```

### Code Quality Commands
```bash
pnpm lint           # Run ESLint on example files
pnpm lint:fix       # Fix ESLint issues
pnpm format         # Format code with Prettier
pnpm format:check   # Check code formatting
pnpm type:check     # Run TypeScript type checking
```

### Security Commands
```bash
pnpm audit                  # Run basic audit
pnpm audit:moderate         # Audit moderate+ vulnerabilities
pnpm audit:high            # Audit high+ vulnerabilities
pnpm audit:critical        # Audit critical vulnerabilities
pnpm audit:fix             # Auto-fix vulnerabilities
pnpm security:check        # Full security check
```

### Publishing Commands
```bash
pnpm changeset              # Create a changeset
pnpm version-packages       # Version packages
pnpm release               # Publish to npm
```

### Custom Scripts
```bash
# Check for unused functions/classes
tsx scripts/check_fnc.ts --report=./reports/unused.md

# Check dependency versions
tsx scripts/check_dependencies_versions.ts

# Check types
tsx scripts/check_types.ts
```

## Architecture Overview

### Package Structure
- **configs/** - Shared configuration files (TypeScript, Vitest, Next.js, Tailwind, PostCSS)
- **eslint/** - ESLint configurations for backend, frontend, and shared code
- **prettier/** - Prettier formatting configuration
- **scripts/** - Development and maintenance scripts
- **examples/** - Example configurations for backend, frontend, and package projects
- **plop/** - Code generation templates for UI components
- **vscode/** - VS Code settings for consistent development environment

### Configuration System
The package provides base configurations that can be extended:

1. **TypeScript**: Extend `@plyaz/devtools/configs/tsconfig.base.json`
2. **Vitest**: Import and use `createVitestConfig` from `@plyaz/devtools/configs/vitest.config.mjs`
3. **ESLint**: Import configurations from `@plyaz/devtools/eslint/`
4. **Prettier**: Import from `@plyaz/devtools/prettier/base.mjs`

### GitHub Workflows
Reusable workflows are provided for:
- **publish.yml**: Automated PR-based version bumping and npm publishing
- **deploy.yml**: Build, lint, and test validation
- **security.yml**: Comprehensive vulnerability scanning

These workflows can be used from other repositories:
```yaml
uses: Plyaz-Official/devtools/.github/workflows/[workflow-name].yml@main
```

### Testing Strategy
- Uses Vitest with happy-dom environment
- Coverage thresholds: 80% for all metrics
- Test files: `src/**/*.{test,spec}.{ts,tsx}` and `tests/**/*.{test,spec}.{ts,tsx}`
- Setup file: `vitest.setup.ts`

### Code Standards
- ESLint with comprehensive plugin set for TypeScript, React, security, and more
- Prettier for consistent formatting
- TypeScript strict mode enabled
- Node.js 22.4.x and pnpm 10.11.0 as standard toolchain

## Important Notes
- This package uses ES modules (`"type": "module"`)
- Never commit sensitive files (.env, .npmrc with tokens)
- Run security checks before releases
- Use changesets for version management
- Follow the Tuesday release schedule mentioned in workflow documentation

## Development Guidelines

### Purpose
The @plyaz/devtools package serves as the central hub for development tooling across the Plyaz platform. It provides standardized configurations that work seamlessly for both backend services and frontend applications, ensuring consistent development practices throughout the ecosystem.

### Configuration Philosophy
When working with configurations in this package:
- Design configs to be modular and composable - each piece should work independently
- Ship with intelligent defaults that work out-of-the-box for most use cases
- Expose clear extension points for teams to customize based on their needs
- Document every configuration option with examples and use cases

### Version Management
Handle versioning with care to minimize disruption:
- Mark breaking changes prominently in changesets and release notes
- Maintain backward compatibility when possible through deprecation cycles
- Version configuration schemas to allow gradual migration paths

### Tool Ecosystem
Ensure smooth integration across development environments:
- Test all configurations against common IDEs and build tools
- Verify compatibility across different operating systems and Node versions
- Keep dependencies current while avoiding breaking upstream changes

### Documentation Standards
Make configurations discoverable and understandable:
- Include inline documentation for complex configuration logic
- Provide real-world examples for typical customization scenarios
- Maintain a troubleshooting guide for common configuration issues
- All exported types must include comprehensive JSDoc comments

### Testing Infrastructure
The testing setup uses Vitest with configurations imported from this package:
- Test files live in the `tests/` directory following the pattern `*.test.ts`
- The base Vitest configuration provides sensible defaults for both unit and integration tests
- Custom test utilities and mocks should be placed in the test setup files