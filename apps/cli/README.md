# Angular Clean Architecture CLI

[![npm version](https://img.shields.io/npm/v/@devmed555/angular-clean-architecture-cli.svg)](https://www.npmjs.com/package/@devmed555/angular-clean-architecture-cli)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

> Scaffold Angular features following Clean Architecture principles with NgRx SignalStore.

## Installation

```bash
npm install -g @devmed555/angular-clean-architecture-cli
```

## Quick Start

```bash
# Interactive mode (recommended)
aca g feature
aca g core
aca g shared

# With arguments
aca g feature product --attributes="name:string,price:number"
aca g core app --type=navbar
aca g shared button --type=ui
```

## Generators

| Generator | Command | Description |
|-----------|---------|-------------|
| Feature | `aca g feature [name]` | Complete Clean Architecture feature (4 layers) |
| Core | `aca g core [name] --type=<type>` | Core system assets |
| Shared | `aca g shared [name] --type=<type>` | Shared UI components/utilities |

### Feature Generator

Creates a complete Clean Architecture feature:

```
features/<name>/
├── domain/model.ts           # Business entities
├── infrastructure/service.ts # HTTP service with CRUD
├── application/store.ts      # NgRx SignalStore
└── ui/component.ts           # Angular standalone component
```

**Options:**

| Option | Description |
|--------|-------------|
| `--attributes="name:type,..."` | Define model attributes |
| `--blueprint=path/to/file.json` | Use a JSON blueprint file |

**Types:** `string`, `number`, `boolean`, `Date`, `any`

**Examples:**
```bash
aca g feature product                                    # Interactive
aca g feature article --attributes="title:string,views:number"
aca g feature --blueprint=./my-feature.json               # From blueprint
```

### Core Generator

Creates core system assets like authentication, guards, interceptors.

**Types:** `auth`, `guard`, `interceptor`, `service`, `translate`, `language-selector`, `theme-selector`, `menu`, `navbar`

**Examples:**
```bash
aca g core app --type=auth                 # Auth service with login/logout
aca g core app --type=navbar               # Navigation bar component
aca g core app --type=theme-selector       # Dark/light theme toggle
aca g core app --type=translate            # i18n translation setup
aca g core jwt --type=interceptor          # HTTP interceptor
aca g core admin --type=guard              # Route guard
```

### Shared Generator

Creates shared reusable components or utilities.

**Types:** `ui`, `util`

**Examples:**
```bash
aca g shared button --type=ui              # Reusable UI component
aca g shared format --type=util            # Utility functions
```

## Blueprint Mode

For complex features with multiple models, use a JSON blueprint:

```json
{
  "name": "order",
  "models": [
    {
      "name": "Order",
      "attributes": [
        { "name": "total", "type": "number" },
        { "name": "status", "type": "string" }
      ]
    },
    {
      "name": "OrderItem",
      "attributes": [
        { "name": "productId", "type": "string" },
        { "name": "quantity", "type": "number" }
      ]
    }
  ]
}
```

```bash
aca g feature --blueprint=./order-blueprint.json
```

## Prerequisites

- Node.js v18+
- Angular 16+ project
- `@ngrx/signals` installed: `npm install @ngrx/signals`

## Resources

- [Architecture Docs](https://github.com/MohamedBouattour/angular-clean-architecture/blob/main/ARCHITECTURE.md)
- [Roadmap](https://github.com/MohamedBouattour/angular-clean-architecture/blob/main/ROADMAP.md)
- [Issues & Features](https://github.com/MohamedBouattour/angular-clean-architecture/issues)

## License

MIT - [Mohamed Bouattour](https://github.com/MohamedBouattour)
