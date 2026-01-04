# Angular Clean Architecture CLI

[![npm version](https://img.shields.io/npm/v/@devmed555/angular-clean-architecture-cli.svg)](https://www.npmjs.com/package/@devmed555/angular-clean-architecture-cli)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

> 🚀 Scaffold Angular features following Clean Architecture principles with NgRx SignalStore.

A powerful CLI that generates production-ready Angular features structured into **Domain**, **Infrastructure**, **Application**, and **UI** layers — keeping your codebase maintainable, testable, and scalable.

---

## 📦 Installation

```bash
# Global installation (recommended)
npm install -g @devmed555/angular-clean-architecture-cli

# Verify installation
aca --version
```

### Prerequisites

- **Node.js** v18+
- **Angular** 16+ project
- **@ngrx/signals** installed:
  ```bash
  npm install @ngrx/signals
  ```

---

## ⚡ Quick Start

```bash
# Generate all features from feature-schema.json
aca g feature

# Generate a single feature with attributes
aca g feature product --attributes="name:string,price:number"

# Generate ALL core assets (auth, navbar, menu, theme, etc.)
aca g core

# Generate ALL shared components (button, card, input, etc.)
aca g shared
```

---

## 🛠️ Generators

| Generator   | Command         | Description                                     |
| ----------- | --------------- | ----------------------------------------------- |
| **Feature** | `aca g feature` | Complete Clean Architecture feature (4 layers)  |
| **Core**    | `aca g core`    | Core system assets (auth, guards, interceptors) |
| **Shared**  | `aca g shared`  | Shared UI components & utilities                |

---

## 📁 Feature Generator

Creates a complete Clean Architecture feature with 4 layers:

```
features/<name>/
├── domain/model.ts           # Business entities & interfaces
├── infrastructure/service.ts # HTTP service with CRUD operations
├── application/store.ts      # NgRx SignalStore state management
└── ui/component.ts           # Standalone Angular component
```

### Usage

```bash
# Interactive mode
aca g feature

# With name argument
aca g feature product

# With inline attributes
aca g feature product --attributes="name:string,price:number,inStock:boolean"

# From blueprint file
aca g feature --blueprint=./my-feature.json
```

### Options

| Option         | Description                    | Example                                    |
| -------------- | ------------------------------ | ------------------------------------------ |
| `--attributes` | Define model properties inline | `--attributes="title:string,views:number"` |
| `--blueprint`  | Use a JSON blueprint file      | `--blueprint=./order.json`                 |

### Supported Types

| Type      | Description                             |
| --------- | --------------------------------------- |
| `string`  | Text data                               |
| `number`  | Numeric values                          |
| `boolean` | True/false values                       |
| `Date`    | Date/time values                        |
| `any`     | Flexible type (use sparingly)           |
| `Type[]`  | Arrays (e.g., `string[]`, `CartItem[]`) |

### Interactive Mode Example

```
$ aca g feature

? What is the name of the feature (singular)? product
Let's add some attributes (property fields).
? Enter attribute name (or press enter to finish): name
? Select type: string
? Enter attribute name (or press enter to finish): price
? Select type: number
? Enter attribute name (or press enter to finish): [Press Enter]

✓ Generated feature "product" in src/app/features/products
```

---

## 🔧 Core Generator

Creates core system assets like authentication, guards, and interceptors.

**Running without arguments generates ALL core assets automatically:**

```bash
# Generate ALL core assets (recommended)
aca g core

# Output:
# 🚀 Generating ALL core assets: navbar, menu, theme-selector, language-selector, translate, auth...
# ✓ Generated core navbar in apps/sandbox/src/app/core/navbar
# ✓ Generated core menu in apps/sandbox/src/app/core/menu
# ...
```

### Generated Assets

| Asset               | Description                              |
| ------------------- | ---------------------------------------- |
| `navbar`            | Top navigation bar                       |
| `menu`              | Side navigation menu                     |
| `theme-selector`    | Dark/light theme toggle                  |
| `language-selector` | Language switcher component              |
| `translate`         | i18n translation setup                   |
| `auth`              | Authentication service with login/logout |

### Generate Specific Asset

```bash
# Generate only a specific asset
aca g core --type=navbar
aca g core --type=auth
aca g core --type=guard
aca g core --type=interceptor
```

---

## 🎨 Shared Generator

Creates shared reusable components and utilities.

**Running without arguments generates ALL shared UI components automatically:**

```bash
# Generate ALL shared UI components (recommended)
aca g shared

# Output:
# 🚀 Generating standard shared UI components: button, card, input, icon, loader, confirm-dialog...
# ✓ Generated shared ui "button" in apps/sandbox/src/app/shared/ui/button
# ✓ Generated shared ui "card" in apps/sandbox/src/app/shared/ui/card
# ...
```

### Generated Components

| Component        | Description                   |
| ---------------- | ----------------------------- |
| `button`         | Reusable button component     |
| `card`           | Card container component      |
| `input`          | Form input component          |
| `icon`           | Icon wrapper component        |
| `loader`         | Loading spinner component     |
| `confirm-dialog` | Confirmation dialog component |

### Generate Specific Component

```bash
# Generate only a specific UI component
aca g shared myButton --type=ui

# Generate a utility module
aca g shared format --type=util
```

---

## 📋 Blueprint Mode

For complex features with multiple related models, use a JSON blueprint file.

### Blueprint Schema

```json
{
  "name": "order",
  "models": [
    {
      "name": "Order",
      "attributes": [
        { "name": "customerId", "type": "string" },
        { "name": "total", "type": "number" },
        { "name": "status", "type": "string" }
      ]
    },
    {
      "name": "OrderItem",
      "attributes": [
        { "name": "orderId", "type": "string" },
        { "name": "productId", "type": "string" },
        { "name": "quantity", "type": "number" }
      ]
    }
  ]
}
```

### Generate from Blueprint

```bash
aca g feature --blueprint=./order-blueprint.json
```

### Example: E-Commerce Blueprint

```json
{
  "name": "ecommerce",
  "models": [
    {
      "name": "Product",
      "attributes": [
        { "name": "name", "type": "string" },
        { "name": "price", "type": "number" },
        { "name": "stock", "type": "number" },
        { "name": "imageUrl", "type": "string" }
      ]
    },
    {
      "name": "Cart",
      "attributes": [
        { "name": "userId", "type": "string" },
        { "name": "items", "type": "CartItem[]" },
        { "name": "total", "type": "number" }
      ]
    }
  ]
}
```

---

## 📂 Feature Schema (Batch Generation)

The CLI automatically stores feature definitions in `feature-schema.json`. When you run `aca g feature` without arguments, it can batch-generate all features defined in this schema.

### Schema Format

```json
{
  "version": "1.0",
  "lastUpdated": "2026-01-04T20:11:51.889Z",
  "features": {
    "product": {
      "name": "product",
      "attributes": [
        { "name": "name", "type": "string" },
        { "name": "price", "type": "number" }
      ]
    },
    "book": {
      "name": "book",
      "attributes": [
        { "name": "title", "type": "string" },
        { "name": "author", "type": "string" }
      ]
    }
  }
}
```

### Batch Generation

```bash
# Running without a name triggers batch generation from feature-schema.json
aca g feature

# Output:
# 🚀 Found 4 features in feature-schema.json. Generating...
# ✓ Generated feature "product" in src/app/features/products
# ✓ Generated feature "book" in src/app/features/books
```

---

## 🏛️ Architecture Overview

Generated features follow **Clean Architecture** (Hexagonal Architecture) principles:

```
┌─────────────────────────────────────────────────────────┐
│                         UI Layer                         │
│              (Components, Templates, Styles)             │
├─────────────────────────────────────────────────────────┤
│                    Application Layer                     │
│              (NgRx SignalStore, Selectors)               │
├─────────────────────────────────────────────────────────┤
│                  Infrastructure Layer                    │
│              (HTTP Services, API Clients)                │
├─────────────────────────────────────────────────────────┤
│                      Domain Layer                        │
│          (Interfaces, Types, Business Rules)             │
└─────────────────────────────────────────────────────────┘
```

### Dependency Flow

```
UI → Application → Infrastructure → Domain
                        ↓
                   External APIs
```

- **Domain**: Pure TypeScript, zero dependencies
- **Infrastructure**: Depends on Domain
- **Application**: Depends on Infrastructure + Domain
- **UI**: Depends on Application

---

## 💡 Best Practices

### ✅ Feature Naming

```bash
# Good (singular, kebab-case)
aca g feature product
aca g feature user-profile
aca g feature order-item

# Avoid
aca g feature products      # Will become "productss"
aca g feature UserProfile   # Use kebab-case
```

### ✅ Attribute Types

```bash
# Use appropriate TypeScript types
--attributes="name:string,age:number,isActive:boolean,createdAt:Date,tags:string[]"
```

### ✅ Blueprint Organization

```
project-root/
├── blueprints/
│   ├── user.json
│   ├── product.json
│   └── order.json
└── src/
```

---

## 🔗 Nx Workspace Integration

When using within an Nx monorepo:

```bash
# Generate feature using Nx
nx g cli:feature product

# Generate core assets
nx g cli:core app --type=navbar

# Generate shared components
nx g cli:shared button --type=ui
```

---

## 📚 Resources

- [Architecture Documentation](https://github.com/MohamedBouattour/angular-clean-architecture/blob/main/ARCHITECTURE.md)
- [Examples & Scenarios](./EXAMPLES.md)
- [Roadmap](https://github.com/MohamedBouattour/angular-clean-architecture/blob/main/ROADMAP.md)
- [GitHub Issues](https://github.com/MohamedBouattour/angular-clean-architecture/issues)

---

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch: `git checkout -b feature/amazing-feature`
3. Commit your changes: `git commit -m 'Add amazing feature'`
4. Push to the branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

---

## 📝 License

MIT © [Mohamed Bouattour](https://github.com/MohamedBouattour)

---

**Built with ❤️ for the Angular community**
