# CLI Documentation

The CLI is an Nx generator designed to scaffold clean architecture features within the `sandbox` application.

## Usage

To generate a new feature, run:

```bash
npm run generate:feature -- --name=<feature-name>
```

### Arguments

| Argument | Description | Required |
| --- | --- | --- |
| `--name` | The name of the feature to generate. | Yes |

### Generated Structure

The generator will create the following structure in `apps/sandbox/src/app/features/<name>`:

- `domain/`: Business logic and models.
- `data/`: API services and data access.
- `ui/`: Standalone Angular components and styles.

## Development

- **Build**: `npm run cli:build`
- **Test**: `npm run cli:test`
- **Lint**: `npm run cli:lint`
