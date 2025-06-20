# Token Management for Local Development

## Using GitHub's Automatic `GITHUB_TOKEN` (Recommended for GitHub Actions)

- GitHub automatically provides a `GITHUB_TOKEN` in Actions workflows with scoped permissions.
- This token is used to authenticate package installs and publishes securely within the workflow.
- You **do not** need to create a personal token manually when using this in GitHub Actions.

## Creating a Personal Access Token (PAT)

> **Use PAT tokens for local development or manual scripts outside of GitHub Actions workflows.**

1. Go to your GitHub account settings
2. Navigate to Developer Settings → Personal Access Tokens → Fine-grained tokens
3. Click on "Generate new token"
4. Set an appropriate name and expiration date
5. Select the repositories that need access
6. Under "Repository permissions", grant at least:
   - Contents: Read
   - Packages: Read and Write
7. Save the token in a secure location

## Setting Up Your Local Environment

### Environment Variables

Add to your shell profile file:

```bash
export GITHUB_TOKEN=your_personal_access_token
```

Reload your shell:

```bash
source ~/.bashrc  # or source ~/.zshrc
```
