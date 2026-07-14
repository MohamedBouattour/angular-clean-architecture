# Contributing to Angular Clean Architecture

Thanks for your interest in contributing! This guide will help you get started.

## Prerequisites

- **Node.js** v20+
- **npm** v10+

## Setup

```bash
git clone https://github.com/MohamedBouattour/angular-clean-architecture.git
cd angular-clean-architecture
npm install
```

## Development Workflow

```bash
# Start backend + sandbox dev servers
npm run dev

# Run tests
npm run all:test

# Run linter
npm run all:lint

# Build everything
npm run all:build

# Format code
npm run format
```

## Project Structure

```
apps/
  sandbox/    # Angular demo app (Clean Architecture)
  cli/        # aca CLI package (scaffolder)
  backend/    # NestJS mock API
  backend-e2e/ # Backend integration tests
```

## Commit Convention

This project uses [Conventional Commits](https://www.conventionalcommits.org/). All commit messages are validated by `commitlint` via a pre-commit hook.

### Format

```
<type>(<scope>): <description>
```

### Types

| Type       | When to use                             |
| ---------- | --------------------------------------- |
| `feat`     | New feature                             |
| `fix`      | Bug fix                                 |
| `docs`     | Documentation only                      |
| `style`    | Formatting, missing semicolons, etc.    |
| `refactor` | Code change that neither fixes nor adds |
| `perf`     | Performance improvement                 |
| `test`     | Adding or updating tests                |
| `build`    | Build system or dependency changes      |
| `ci`       | CI configuration changes                |
| `chore`    | Other maintenance                       |
| `revert`   | Reverts a previous commit               |

### Scopes

`cli`, `sandbox`, `backend`, `core`, `shared`, `release`, `ci`

### Examples

```
feat(sandbox): add products list component
fix(cli): handle missing blueprint file
docs: update README installation steps
chore(deps): bump @angular/core to 19.2.0
```

## Adding a Good First Issue

When creating issues for new contributors, add the `good first issue` label and include:

1. A clear description of the task
2. Links to relevant code or docs
3. Acceptance criteria (checklist)

## Pull Request Process

1. Fork the repo and create a branch from `main`
2. Make your changes following the conventions above
3. Ensure all checks pass:

```bash
npm run format:check
npm run all:lint
npm run all:test
npm run all:build
```

4. Open a PR with a descriptive title using the conventional commit format
5. A maintainer will review and merge

## Reporting Bugs

Use the [Bug Report template](https://github.com/MohamedBouattour/angular-clean-architecture/issues/new?template=bug_report.yml) and include steps to reproduce.

## Code Style

- **TypeScript** with strict mode
- **Prettier** for formatting (runs on commit via lint-staged)
- **ESLint** with Nx plugin for linting
- Follow existing patterns in the codebase

## Architecture Principles

Generated features follow **Clean Architecture** (Hexagonal Architecture):

```
UI Layer         → Components, Templates
Application Layer → NgRx SignalStore, Effects
Domain Layer     → Entities, Interfaces, Business Rules
Infrastructure   → API Services, HTTP Clients
```

**Rule**: Dependencies point inward. UI depends on Application, never the reverse.

## License

By contributing, you agree that your contributions will be licensed under the [MIT License](./LICENSE).
