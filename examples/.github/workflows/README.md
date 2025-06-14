### 1. Publish Package Workflow

- **File:** `.github/workflows/publish.yml`
- **Trigger:** Push to the `main` branch
- **What it does:**
  - Checks out the repository
  - Sets up pnpm (version 8)
  - Installs dependencies
  - Builds the package
  - Publishes the package with restricted access
- **Permissions:**
  - Reads repository contents
  - Writes to packages
- **Authentication:** Uses the `GITHUB_TOKEN` secret

### 2. Deploy Workflow

- **File:** `.github/workflows/deploy.yml`
- **Trigger:** Push to `main`, `dev`, and `staging` branches, PR to `main`, `dev`, and `staging` branches
- **What it does:**
  - Checks out the repository
  - Sets up pnpm (version 8)
  - Installs dependencies (using `GITHUB_TOKEN` if needed)
  - Builds the app/service
  - Runs lint and tests
- **Note:** Deployment steps can be added as needed to this workflow

### 3. Security Workflow

- **File:** `.github/workflows/security.yml`
- **Trigger:** Push to `main`, `dev`, and `staging` branches, PR to `main`, `dev`, and `staging` branches
- **What it does:**
  - Review current dependencies for their current score
  - Audit current dependencies if anything moderate
- **Note:** Security, review and analysis can be added to this workflow

---

## Secrets

Make sure the following secrets are configured in your GitHub repository:

- `GITHUB_TOKEN` (automatically available in GitHub Actions)

---
