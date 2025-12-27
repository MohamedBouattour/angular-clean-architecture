# Publishing Guide

This guide explains how to publish the CLI to npm and use it in other projects.

## Prerequisites

1. **NPM Account**: You need an account on [npmjs.com](https://www.npmjs.com/).
2. **Login**: Run `npm login` in your terminal.

## Publishing Steps

The project includes an automated script to handle building and publishing:

```bash
npm run cli:publish
```

This script will:
1. Build the CLI project (`nx build cli`)
2. Copy the `README.md` to the distribution folder
3. Run `npm publish --access public` from the dist folder

## Manual Publishing

If you prefer to publish manually:

```bash
# 1. Build the CLI
nx build cli

# 2. Copy README
cp apps/cli/README.md dist/apps/cli/README.md

# 3. Navigate to dist
cd dist/apps/cli

# 4. Publish
npm publish --access public
```

## Using the CLI Globally

Once published, users can install and use the CLI globally:

```bash
# Install
npm install -g @angular-clean-architecture/cli

# Use
aca generate feature <name> --attributes="prop1:type,prop2:type"
```

### Examples

**User Feature:**
```bash
aca generate feature user-profile --attributes="username:string,email:string,age:number"
```

Generates:
- `UserProfile` interface with `username`, `email`, `age`
- `UserProfileService` with CRUD
- `UserProfileStore`
- `UserProfileComponent` displaying the user details

**Product Feature:**
```bash
aca generate feature product --attributes="name:string,price:number,category:string"
```

## Versioning

Before publishing a new version, remember to update the version number in `apps/cli/package.json`:

```json
{
  "name": "@angular-clean-architecture/cli",
  "version": "0.0.2", 
  ...
}
```

Follow [Semantic Versioning](https://semver.org/) rules.
