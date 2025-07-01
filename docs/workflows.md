## 🔧 GitHub Workflows

This repository uses GitHub Actions for automated publishing, deployment, and security auditing. Below is an overview of the main workflows included.

---
### 1. 📦 Publish Package Workflow

- **File:** `.github/workflows/publish.yml`
- **Trigger:** Push to the `main` branch
- **Purpose:** Automates PR-based version bumping and package publishing to npm with detailed changelogs.
- **Steps:**
  - Checks out the repository with full git history
  - Configures Git identity for automated commits
  - Sets up Node.js (v22.4.x) and pnpm (v8)
  - Authenticates with npm using the `NPM_PRIVATE_PACKAGE_TOKEN` secret
  - Installs dependencies and builds the project
  - **Analyzes PR information** (title, labels, author) from GitHub API
  - **Determines version bump** based on PR labels or conventional commit format:
    - `breaking`/`major` label or `BREAKING` in title → **major** version
    - `feature`/`feat` label or `feat:` in title → **minor** version  
    - `fix`/`bug` label or `fix:` in title → **patch** version
    - Default → **patch** version
  - **Checks npm registry** to avoid duplicate publishing
  - **Creates detailed commit message** with PR info, commit list, and package links
  - **Pushes version bump commits and annotated tags** with comprehensive changelog
  - Publishes the package to npm with public access
- **Permissions:**
  - `contents: write` – Push commits/tags
  - `packages: write` – Publish to npm
  - `pull-requests: read` – Read PR information for changelog
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
  - Sets up Node.js (v22.4.x) and pnpm (v8) with caching
  - Installs dependencies with `pnpm install`
  - Runs build script (`pnpm build`)
  - Runs linting (`pnpm lint`)
  - Executes tests (`pnpm test`)
  - **Optional (configurable):**
    - Format check: `pnpm format:check`
    - Type check: `pnpm type:check`
- **Permissions:** `contents: read`
- **Customization:** Steps can be skipped via input parameters
- **Note:** Deployment steps can be added as needed

---

### 3. 🔒 Security Workflow

- **File:** `.github/workflows/security.yml`
- **Trigger:**
  - Push to: `main`, `dev`, `staging`
  - Pull request to: `main`, `dev`, `staging`
- **Purpose:** Ensures dependency safety through comprehensive security scanning.
- **Steps:**
  - **GitHub Dependency Review** (PRs only):
    - Posts a comment summary on pull requests
    - Fails the check if vulnerable packages are introduced (moderate+ severity)
  - **pnpm Security Audit**:
    - Runs `pnpm audit` with configurable severity levels
    - Native pnpm vulnerability detection
  - **Google OSV-Scanner**:
    - Uses official Google OSV reusable workflow
    - Comprehensive multi-ecosystem vulnerability scanning
    - Uploads SARIF results to GitHub Security tab
    - **Environment-specific behavior**: Strict on `main`/`staging`, lenient on dev branches
- **Permissions:**
  - `contents: read`
  - `pull-requests: write` – Required to comment on PRs
  - `security-events: write` – Required for OSV-Scanner SARIF uploads
  - `actions: read` – Required for OSV-Scanner
- **Customization:** Audit levels, OSV scanning, and comment behavior are configurable
- **Note:** Results appear in GitHub Security > Code Scanning tab

---

## 🔐 Required Secrets

Make sure these repository secrets are configured:

| Secret Name                 | Required For     | Description                                      |
| --------------------------- | ---------------- | ------------------------------------------------ |
| `GITHUB_TOKEN`              | All workflows    | Provided automatically by GitHub                 |
| `NPM_PRIVATE_PACKAGE_TOKEN` | Publish workflow | Used to authenticate and publish to npm registry |

---

### 4. 🔁 Reusable Workflows

All workflows above support being called as reusable workflows from other repositories. This allows for centralized CI/CD logic while maintaining consistency across the Plyaz platform.

#### Basic Usage (Default Configuration)

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

```yaml
# .github/workflows/publish.yml
name: Publish Package
on:
  push:
    branches: [main]

jobs:
  publish:
    uses: Plyaz-Official/devtools/.github/workflows/publish.yml@main
    secrets: inherit
```

```yaml
# .github/workflows/security.yml
name: Security
on:
  push:
    branches: [main, dev, staging]
  pull_request:
    branches: [main, dev, staging]

jobs:
  security:
    uses: Plyaz-Official/devtools/.github/workflows/security.yml@main
    secrets: inherit
```

#### Advanced Usage (Custom Configuration)

##### Deploy Workflow with Custom Inputs

```yaml
# .github/workflows/deploy.yml
name: Build and Deploy
on:
  push:
    branches: [main, dev, staging]

jobs:
  build-deploy:
    uses: Plyaz-Official/devtools/.github/workflows/deploy.yml@main
    with:
      node_version: '20.x'          # Use Node.js 20.x instead of default 22.4.x
      pnpm_version: '9'             # Use pnpm v9 instead of default v8
      skip_format_check: true       # Skip format checking step
      skip_type_check: true         # Skip type checking step
    secrets: inherit
```

##### Publish Workflow with Custom Registry

```yaml
# .github/workflows/publish.yml
name: Publish Package
on:
  push:
    branches: [main]

jobs:
  publish:
    uses: Plyaz-Official/devtools/.github/workflows/publish.yml@main
    with:
      node_version: '22.4.x'        # Specific Node.js version
      registry_url: 'https://npm.pkg.github.com'  # GitHub Packages registry
      package_access: 'restricted'  # Private package access
      skip_git_checks: false        # Enable git checks during publish
    secrets: inherit
```

##### Security Workflow with Custom Audit Levels

```yaml
# .github/workflows/security.yml
name: Security
on:
  push:
    branches: [main, dev, staging]
  pull_request:
    branches: [main, dev, staging]

jobs:
  security:
    uses: Plyaz-Official/devtools/.github/workflows/security.yml@main
    with:
      audit_level: 'high'                    # Only fail on high/critical vulnerabilities
      dependency_review_severity: 'high'     # Higher threshold for dependency review
      comment_summary: 'on-failure'          # Only comment on PR if issues found
      dependency_review: true                # Skip dependecy review
      skip_osv_scan: true                    # Skip OSV review
    secrets: inherit
```

## 📋 Available Input Parameters

### Deploy Workflow Inputs

| Input | Type | Default | Description |
|-------|------|---------|-------------|
| `node_version` | string | `'22.4.x'` | Node.js version to use |
| `pnpm_version` | string | `'8'` | pnpm version to use |
| `skip_format_check` | boolean | `false` | Skip format checking step |
| `skip_type_check` | boolean | `false` | Skip type checking step |

### Publish Workflow Inputs

| Input | Type | Default | Description |
|-------|------|---------|-------------|
| `node_version` | string | `'22.4.x'` | Node.js version to use |
| `pnpm_version` | string | `'8'` | pnpm version to use |
| `package_access` | string | `'public'` | Package access level (public/restricted) |

### Security Workflow Inputs

| Input | Type | Default | Description |
|-------|------|---------|-------------|
| `pnpm_version` | string | `'8'` | pnpm version to use |
| `audit_level` | string | `'moderate'` | Audit severity level (low, moderate, high, critical) |
| `dependency_review_severity` | string | `'moderate'` | Dependency review fail threshold |
| `comment_summary` | string | `'always'` | When to post PR comments (always, on-failure, never) |
| `skip_osv_scan` | boolean | `false` | Skip Google OSV vulnerability scanning |
| `dependency_review` | boolean | `false` | Skip Github Dependecy Review scanning |

### Team Workflow

```
1. Developer creates PR with appropriate label or conventional title
2. Team reviews and merges PR to main
3. Workflow automatically:
   - Detects version bump type
   - Creates detailed changelog
   - Bumps version if needed
   - Publishes to npm
   - Creates git tag with comprehensive information
```

### Example Release Information

Each release creates detailed git commits and tags with:

```
chore: release v1.3.0

## Release Information
**Package:** @plyaz/package@1.3.0
**Version Bump:** minor
**Reason:** New feature (label: feature)
**Previous Tag:** v1.2.5

## Source Changes
**PR #42:** feat: add user authentication system
**Author:** john-developer
**Labels:** feature,enhancement

## Commits Included
- Add JWT token validation (John Doe)
- Update middleware for auth (Jane Smith)
- Add comprehensive tests (John Doe)

## Package Info
📦 **npm:** https://www.npmjs.com/package/@plyaz/package/v/1.3.0
🏷️ **Tag:** v1.3.0
📅 **Released:** 2025-06-21 15:30:45 UTC
```

## 🧠 Pro Tips

- **Keep workflows stable**: Use `@main` or versioned tags (e.g., `@v1`) for reliable reuse across projects
- **Environment-specific configs**: Use different input parameters for dev/staging/production environments
- **Secret inheritance**: Always use `secrets: inherit` to pass repository secrets to reusable workflows
- **Input validation**: The workflows include sensible defaults, so you only need to specify inputs you want to override
- **Tuesday releases**: These workflows are optimized for the bi-weekly Tuesday release schedule with proper caching, performance optimization, and comprehensive documentation