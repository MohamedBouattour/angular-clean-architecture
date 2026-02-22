---
name: aca-helper
description: Generates Angular Clean Architecture code using the project's custom CLI (aca). Use when needing to scaffold features, core modules, or shared components.
---

# Angular Clean Architecture CLI Helper

This skill helps you scaffold Angular features following the project's Clean Architecture principles using the built-in CLI tool.

## Usage

Use the following commands to generate code. Always run these commands from the project root.

### Generate a Feature

To generate a new feature with Domain, Infrastructure, Application, and UI layers:

```bash
node apps/cli/bin/index.js g feature <feature-name>
```

### Generate a Feature from Blueprint

For complex features with multiple models, create a blueprint JSON file first, then run:

```bash
node apps/cli/bin/index.js g feature --blueprint=./path/to/blueprint.json
```

**Blueprint Format:**

See [blueprint-schema.json](references/blueprint-schema.json) for the JSON structure.

Example `blueprint.json`:

```json
{
  "name": "shop",
  "models": [
    {
      "name": "Product",
      "attributes": [{ "name": "price", "type": "number" }]
    }
  ]
}
```

### Generate Core Assets

To generate authentication, navigation, and other core services:

```bash
node apps/cli/bin/index.js g core
```

### Generate Shared Components

To generate reusable UI components:

```bash
node apps/cli/bin/index.js g shared
```

## Tips

- Always check if `apps/cli/bin/index.js` exists before running. If not, you might need to build the CLI first (though it should be pre-built in this environment).
- If generating a feature from a blueprint, ensure the blueprint file is valid JSON according to the schema.
