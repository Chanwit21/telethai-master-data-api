# Docker & GitHub Container Registry Setup

This document explains the Docker setup and GitHub Actions workflows for building and pushing images to GitHub Container Registry (GHCR).

## Overview

The project uses multi-stage Docker builds for optimized image size and GitHub Actions for automated CI/CD pipeline to build and push images to GHCR.

## Files

### 1. Dockerfile
Multi-stage Dockerfile with three stages:

- **dependencies**: Installs all dependencies using pnpm
- **builder**: Builds the NestJS application
- **runtime**: Minimal production image with only necessary files

Features:
- Alpine Linux for smaller image size (~200MB)
- Health check endpoint
- Proper signal handling with dumb-init
- Production-optimized (only production dependencies)

### 2. .dockerignore
Excludes unnecessary files from Docker context to speed up builds.

### 3. GitHub Actions Workflows

#### release.yml
**Purpose**: Automatically creates git tags based on package.json version

**Triggers**:
- When `package.json` is modified on `main` branch
- Manual trigger via workflow_dispatch

**What it does**:
- Extracts version from package.json
- Creates git tag automatically (e.g., `v1.0.0`)
- Pushes tag to repository
- This automatically triggers `docker-build-push.yml`

**Example workflow**:
1. Update version in package.json: `"version": "1.0.0"`
2. Commit and push to main
3. Release workflow automatically creates tag `v1.0.0`
4. Docker build workflow is triggered by the tag

#### docker-build-push.yml
**Purpose**: Builds and pushes Docker images to GHCR with semantic versioning

**Triggers**:
- Push to `main` or `develop` branches
- Push of version tags (e.g., `v1.0.0`)
- Manual trigger via workflow_dispatch

**Features**:
- Automatic version extraction from git tags or package.json
- Multi-platform support (linux/amd64, linux/arm64)
- Comprehensive image labels with version, commit, and timestamp
- Build summary posted to GitHub Actions

**Image Tags** (auto-generated):
- Release tags: `v1.0.0`, `1.0`, `1`
- Branch tags: `main`, `develop`
- Commit-based: `main-abc123def-1.0.0`, `develop-abc123def-1.0.0`
- Latest: `latest` (only for main branch)

## Version Control Strategy

### Automatic Versioning via Release Workflow

The release workflow automates the tagging process:

1. **Update Version**: Modify `package.json` version field
   ```json
   {
     "version": "1.0.0"
   }
   ```

2. **Commit & Push**: Push to main branch
   ```bash
   git add package.json
   git commit -m "chore: bump version to 1.0.0"
   git push origin main
   ```

3. **Automatic Tag Creation**: GitHub Actions automatically:
   - Extracts version from package.json
   - Creates git tag `v1.0.0`
   - Pushes tag to repository
   - Triggers docker-build-push workflow

4. **Docker Image Built**: Images are automatically tagged:
   - `v1.0.0` (exact version)
   - `1.0` (major.minor)
   - `1` (major version)
   - `latest` (only on main branch)

### Manual Tag Creation (if needed)
```bash
git tag v1.0.0 -m "Release version 1.0.0"
git push origin v1.0.0
```

### Image Tags Structure

Images are automatically tagged based on:

1. **Semantic Versions** (from git tags):
   ```
   ghcr.io/username/telethai-master-data-api:v1.0.0
   ghcr.io/username/telethai-master-data-api:1.0
   ghcr.io/username/telethai-master-data-api:1
   ```

2. **Branch Names**:
   ```
   ghcr.io/username/telethai-master-data-api:main
   ghcr.io/username/telethai-master-data-api:develop
   ```

3. **Commit SHA with Version**:
   ```
   ghcr.io/username/telethai-master-data-api:main-abc123d-1.0.0
   ghcr.io/username/telethai-master-data-api:develop-abc123d-1.0.0
   ```

4. **Latest Tag** (only for main branch):
   ```
   ghcr.io/username/telethai-master-data-api:latest
   ```

## Setup Instructions

### 1. GitHub Repository Settings

Enable GitHub Container Registry:
1. Go to repository Settings → Packages and registries
2. Ensure "Actions" has permission to write to packages
3. Enable workflow read/write permissions:
   - Settings → Actions → General
   - Set "Workflow permissions" to "Read and write permissions"
   - Check "Allow GitHub Actions to create and approve pull requests"

### 2. Version Control Workflow

The recommended workflow is now automated:

**Development Phase**:
```bash
# Make your changes
git add .
git commit -m "feat: add new feature"
git push origin feature/my-feature
```

**Release Phase**:
```bash
# Update version in package.json
# e.g., change from 0.0.1 to 1.0.0

git add package.json
git commit -m "chore: bump version to 1.0.0"
git push origin main
# GitHub Actions automatically creates tag v1.0.0 and builds image
```

**Important**: Never manually create tags when using the release workflow - let GitHub Actions handle it automatically to ensure consistency.

### 3. Local Building & Testing

Build locally:
```bash
docker build -t telethai-master-data-api:local .
```

Run locally:
```bash
docker run -it --rm \
  -e NODE_ENV=production \
  -e PORT=8001 \
  -p 8001:8001 \
  telethai-master-data-api:local
```

### 4. GitHub Actions Integration Verification

To verify the workflows are working:

1. Check Release Workflow:
   - Go to Actions → Release Tag
   - Update package.json version and push
   - Verify tag is created automatically

2. Check Docker Build Workflow:
   - Go to Actions → Build and Push Docker Image
   - Verify images are pushed to GHCR
   - Check image tags match version

3. View Build Summary:
   - Click on completed workflow run
   - Scroll to bottom to see Docker Image Build Summary with all tags

### 5. Pushing to GHCR Manually (if needed)

For local manual push (not recommended with automation):
```bash
# Login to GHCR
echo $PAT_TOKEN | docker login ghcr.io -u USERNAME --password-stdin

# Tag the image
docker tag telethai-master-data-api:local ghcr.io/USERNAME/telethai-master-data-api:v1.0.0

# Push to GHCR
docker push ghcr.io/USERNAME/telethai-master-data-api:v1.0.0
```

## Docker Image Architecture

```
FROM node:20-alpine
  ↓
Health Check: /
  ↓
Exposed Port: 8001
  ↓
Environment: NODE_ENV=production
  ↓
Entrypoint: dumb-init (proper signal handling)
  ↓
CMD: node dist/main
```

## CI/CD Pipeline

```
Update package.json version
  ↓
git push origin main
  ↓
Release Workflow:
  ├─ Extract version from package.json
  ├─ Check if tag already exists
  └─ Create git tag v1.0.0 (if not exists)
  ↓
Docker Build Workflow (triggered by tag):
  ├─ Extract version info
  ├─ Set up multi-platform build (amd64, arm64)
  ├─ Build multi-stage image
  ├─ Generate semantic version tags
  ├─ Push to GHCR with all tags
  └─ Post build summary to Actions
  ↓
Image available at:
  ghcr.io/username/telethai-master-data-api:v1.0.0
  ghcr.io/username/telethai-master-data-api:1.0
  ghcr.io/username/telethai-master-data-api:1
  ghcr.io/username/telethai-master-data-api:latest
  ghcr.io/username/telethai-master-data-api:main-abc123d-1.0.0
```

## Pulling Images from GHCR

For public repository:
```bash
docker pull ghcr.io/username/telethai-master-data-api:latest
```

For private repository, first authenticate:
```bash
echo $PAT_TOKEN | docker login ghcr.io -u USERNAME --password-stdin
docker pull ghcr.io/username/telethai-master-data-api:latest
```

## Best Practices

1. **Use Automated Release Tagging**: Let GitHub Actions create tags automatically when you update package.json
2. **Semantic Versioning**: Follow SemVer (v1.0.0, v1.1.0, v2.0.0, etc.)
3. **Version Consistency**: Keep package.json version in sync with git tags
4. **Never Manual Tags with Automation**: Don't manually create tags - let the release workflow do it
5. **Test before Release**: Use PR validation to ensure builds succeed
6. **Monitor image size**: Keep Alpine-based images under 300MB
7. **Layer caching**: GitHub Actions automatically caches layers for faster builds
8. **Security**: Regularly update base image (node:20-alpine)

## Troubleshooting

### Build fails in GitHub Actions
- Check GitHub token has `packages: write` permission
- Verify Dockerfile syntax
- Check pnpm-lock.yaml is committed

### Image too large
- Ensure only production dependencies are installed
- Review .dockerignore for excluded files
- Consider multi-stage build optimization

### Cannot pull image from GHCR
- Verify you're authenticated with valid token
- Check repository visibility settings
- Ensure image tag exists

## Environment Variables

Required at runtime:
```env
NODE_ENV=production
PORT=8001
DATABASE_HOST=postgres
DATABASE_PORT=5432
DATABASE_USER=user
DATABASE_PASSWORD=password
DATABASE_NAME=telethai_master_data
REDIS_HOST=redis
REDIS_PORT=6379
```

## Related Documentation

- [Docker Documentation](https://docs.docker.com/)
- [GitHub Container Registry](https://docs.github.com/en/packages/working-with-a-github-packages-registry/working-with-the-container-registry)
- [NestJS Docker Guide](https://docs.nestjs.com/deployment)
