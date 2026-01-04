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

- **Node.js** v20+
- **Angular** 21+ project
- **@ngrx/signals** installed (`npm install @ngrx/signals`)

---

## ⚡ Quick Start

```bash
# 1. Generate all features defined in feature-schema.json
aca g feature

# 2. Generate a single feature with attributes
aca g feature product --attributes="name:string,price:number"

# 3. Generate ALL core assets (Auth, Navbar, Menu, etc.)
aca g core

# 4. Generate ALL shared components
aca g shared
```

---

## 🛠️ Generators

| Command         | Description                                           |
| --------------- | ----------------------------------------------------- |
| `aca g feature` | Generates Clean Architecture features (4 layers)      |
| `aca g core`    | Generates core system assets (Auth, Guards, Services) |
| `aca g shared`  | Generates shared UI components & utilities            |

---

## 📁 Feature Generator

Creates a structure with **Domain**, **Infrastructure**, **Application**, and **UI** layers.

### Usage

```bash
# Interactive mode
aca g feature

# With inline attributes
aca g feature product --attributes="name:string,price:number,active:boolean"

# From blueprint file
aca g feature --blueprint=./order.json
```

---

## 🔧 Core Generator

Running `aca g core` without arguments automatically generates **ALL** core assets:

- **Auth**: Service with login/logout logic
- **Navbar**: Top navigation component
- **Menu**: Side navigation component
- **Theme Selector**: Dark/Light mode toggle
- **Language Selector**: i18n switcher
- **Translate**: Translation setup

### Generated Assets

| Asset               | Description                              |
| ------------------- | ---------------------------------------- |
| `navbar`            | Top navigation bar                       |
| `menu`              | Side navigation menu                     |
| `theme-selector`    | Dark/light theme toggle                  |
| `language-selector` | Language switcher component              |
| `translate`         | i18n translation setup                   |
| `auth`              | Authentication service with login/logout |

---

## 🎨 Shared Generator

Running `aca g shared` without arguments automatically generates standard shared components:

- **Confirm Dialog**: Reusable confirmation modal

### Generated Components

- **Confirm Dialog**: Reusable confirmation modal

---

## 📋 Blueprint Mode

For complex features with multiple models, use a JSON blueprint:

```json
{
  "name": "shop",
  "models": [
    {
      "name": "Product",
      "attributes": [{ "name": "price", "type": "number" }]
    },
    {
      "name": "Cart",
      "attributes": [{ "name": "total", "type": "number" }]
    }
  ]
}
```

```bash
aca g feature --blueprint=./shop.json
```

---

## 🔮 Coming Soon

- **Unit Test Templates**: Comprehensive tests for all layers
- **Custom Types (UML)**: Generate features from UML/PlantUML models
- **MCP Server**: AI integration for smarter code generation

---

## 📝 License

MIT © [Mohamed Bouattour](https://github.com/MohamedBouattour)
