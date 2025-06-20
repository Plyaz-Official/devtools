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
  - Runs GitHub's Dependency Review on PRs
    - Posts a comment summary
    - Fails the check if vulnerable packages are introduced (moderate+)
  - Audits current dependencies using:
    - `pnpm audit` (set to fail on moderate+ severity)
    - `pnpm audit` (for deeper detection)
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
      skip_better_audit: true                # Skip pnpm audit for faster runs
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
| `registry_url` | string | `'https://registry.npmjs.org'` | npm registry URL |
| `package_access` | string | `'public'` | Package access level (public/restricted) |
| `skip_git_checks` | boolean | `true` | Skip git checks during publish |

### Security Workflow Inputs

| Input | Type | Default | Description |
|-------|------|---------|-------------|
| `pnpm_version` | string | `'8'` | pnpm version to use |
| `audit_level` | string | `'moderate'` | Audit severity level (low, moderate, high, critical) |
| `dependency_review_severity` | string | `'moderate'` | Dependency review fail threshold |
| `comment_summary` | string | `'always'` | When to post PR comments (always, on-failure, never) |
| `skip_better_audit` | boolean | `false` | Skip pnpm audit check |

## 🧠 Pro Tips

- **Keep workflows stable**: Use `@main` or versioned tags (e.g., `@v1`) for reliable reuse across projects
- **Environment-specific configs**: Use different input parameters for dev/staging/production environments
- **Secret inheritance**: Always use `secrets: inherit` to pass repository secrets to reusable workflows
- **Input validation**: The workflows include sensible defaults, so you only need to specify inputs you want to override