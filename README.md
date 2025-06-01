# @plyaz/devtools

A centralized repository of shared development tooling to ensure consistency across all `@plyaz` repositories.

---

## Overview

This package provides core tooling, configuration templates, and CI/CD workflows designed to standardize development, testing, and publishing processes across all projects in the organization.

---

## Features

- **Core scripts** for repository setup and package linking
- **Base configurations** for ESLint, Prettier, and TypeScript
- **CI/CD workflow templates** for publishing packages and building apps/services
- **Private package registry setup** using GitHub Packages
- **Publishing and versioning standards** for consistent release management

---

## Core Scripts

### `scripts/dev-setup.sh`

Script to set up consumer repositories for development.

### `scripts/link-all.sh`

Script to link all internal packages.

> **Note:** Remember to add execution permissions:
>
> ```bash
> chmod +x scripts/dev-setup.sh scripts/link-all.sh
> ```

---

## Configuration Templates

- **ESLint:** Base linting rules and plugin configurations
- **Prettier:** Code formatting standards
- **TypeScript:** Base compiler options and project references

Usage and extension patterns are documented in respective config folders.

---

## CI/CD Workflow Templates

- **Publish Workflow:** Standardized GitHub Actions workflow for publishing packages

Documentation for customizing workflows is included in `.github/workflows/README.md`.

---

## Private Package Registry Setup

### NPM Registry Configuration

- `.npmrc` template included to configure npm to use GitHub Packages for scoped packages.
- Workspace repositories should add the `.npmrc` config and manage authentication tokens securely.

### Authentication Workflow

- Documentation provided for setting up `GITHUB_TOKEN` secrets in GitHub Actions.
- Guide for token management during local development.

---

## Getting Started

1. Clone this repository.
2. Run the setup script to prepare your repo:
   ```bash
   ./scripts/dev-setup.sh
   ```

### Temporary Public Publishing Policy

For now, packages can be published publicly using:

```bash
pnpm run publish
```

This is a temporary measure since most packages currently don't contain sensitive content and aren't likely to be widely used externally.

Once we begin working with sensitive content (especially authentication or Web3 integrations), all packages will be made private.

**Never commit sensitive files**, such as:

- `.env`
- `.npmrc` (with tokens)

Empty variables are acceptable, but never expose actual secrets.
