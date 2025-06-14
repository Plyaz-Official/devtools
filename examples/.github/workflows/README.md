## 🔧 GitHub Workflows

This repository uses GitHub Actions for automated publishing, deployment, and security auditing. Below is an overview of the main workflows included.

---

### 1. 📦 Publish Package Workflow

- **File:** `.github/workflows/publish.yml`
- **Trigger:** Push to the `main` branch
- **Purpose:** Automates version bumping and package publishing to npm.
- **Steps:**
  - Checks out the repository
  - Configures Git identity for automated commits
  - Sets up Node.js (v22.4.x) and pnpm (v8)
  - Authenticates with npm using the `NPM_PRIVATE_PACKAGE_TOKEN` secret
  - Installs dependencies and builds the project
  - Runs the release script (`pnpm run release`)
  - Pushes version bump commits and tags
  - Publishes the package to npm with public access
- **Permissions:**
  - `contents: write` – Push commits/tags
  - `packages: write` – (optional for GitHub Packages)
- **Authentication:** Requires `NPM_PRIVATE_PACKAGE_TOKEN` secret

---

### 2. 🚀 Deploy Workflow (Install + Build + CI)

- **File:** `.github/workflows/deploy.yml`
- **Trigger:**
  - Push to: `main`, `dev`, `staging`
  - Pull request to: `main`, `dev`, `staging`
- **Purpose:** Validates code quality and prepares for deploys.
- **Steps:**
  - Checks out the repository
  - Sets up Node.js and pnpm (v8)
  - Installs dependencies with `pnpm install`
  - Runs build script (`pnpm build`)
  - Runs linting (`pnpm lint`)
  - Executes tests (`pnpm test`)
  - _Optional:_
    - Format check: `pnpm format:check`
    - Type check: `pnpm type:check`
- **Permissions:** `contents: read`
- **Note:** Deployment steps can be added as needed

---

### 3. 🔒 Security Workflow

- **File:** `.github/workflows/security.yml`
- **Trigger:**
  - Push to: `main`, `dev`, `staging`
  - Pull request to: `main`, `dev`, `staging`
- **Purpose:** Ensures dependency safety through review and auditing.
- **Steps:**
  - Runs GitHub’s Dependency Review on PRs
    - Posts a comment summary
    - Fails the check if vulnerable packages are introduced (moderate+)
  - Audits current dependencies using:
    - `pnpm audit` (set to fail on moderate+ severity)
    - `better-npm-audit` (for deeper detection)
- **Permissions:**
  - `contents: read`
  - `pull-requests: write` – Required to comment on PRs
- **Note:** Extendable with SBOM, OSSAR, or other scanning tools

---

## 🔐 Required Secrets

Make sure these repository secrets are configured:

| Secret Name                 | Required For     | Description                                      |
| --------------------------- | ---------------- | ------------------------------------------------ |
| `GITHUB_TOKEN`              | All workflows    | Provided automatically by GitHub                 |
| `NPM_PRIVATE_PACKAGE_TOKEN` | Publish workflow | Used to authenticate and publish to npm registry |

---

### 4. 🔁 Reusable Workflow

- **File:** Custom consumer (e.g. `.github/workflows/<workflow name>.yml`)
- **Trigger:** Push to `main`, `dev`, or `staging`
- **Purpose:** Delegates build and deploy steps to a centralized reusable workflow.
- **Usage:**
  - Reuses the shared deploy workflow from `Plyaz-Official/devtools`
  - Centralizes CI logic for consistency across repositories
  - Inherits secrets from the caller repository
- **Steps:**
  - Automatically forwards events and secrets to:
    - `Plyaz-Official/devtools/.github/workflows/<worfklow name>.yml@main`
- **Permissions:** Depends on the called workflow definition (typically `contents: read`)
- **Note:** This file only **triggers** and **delegates**; logic is inside the shared workflow repo

#### Example

```yaml
# .github/workflows/deploy.yml
name: Build and Deploy

on:
  push:
    branches: [main, dev, staging]

jobs:
  build-deploy:
    uses: Plyaz-Official/devtools/.github/workflows/deploy.yml@main
    secrets: inherit
```

🧠 Pro Tip: Keep your shared deploy.yml in a versioned, stable branch (main or v1) for reliable reuse across multiple projects.
