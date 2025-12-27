# Angular Clean Architecture Monorepo

> A modern Nx monorepo featuring a CLI generator for scaffolding Clean Architecture Angular features with NgRx SignalStore state management.

## 🎯 Overview

This project provides a powerful CLI tool that generates production-ready Angular features following Clean Architecture principles. Each generated feature is structured into clear layers (Domain, Infrastructure, Application, UI) with proper separation of concerns, making your codebase maintainable, testable, and scalable.

**Key Features:**
- 🏗️ **Clean Architecture**: Enforces separation between business logic, data access, and UI
- 🔄 **NgRx SignalStore**: Modern reactive state management with Angular Signals
- 📦 **Nx Monorepo**: Efficient build system with caching and task orchestration
- 🚀 **Standalone Components**: Ready for Angular's future (zoneless, fully typed)
- 🧪 **Test-Ready**: Generated code is designed for easy unit testing
- 🎨 **Best Practices**: TypeScript strict mode, ESLint, Prettier

## 📁 Project Structure

```
angular-clean-architecture/
├── apps/
│   ├── cli/                    # Code generator (Nx plugin)
│   │   ├── src/
│   │   │   └── generators/
│   │   │       └── clean-feature/
│   │   │           ├── files/          # Templates for generated code
│   │   │           │   ├── application/  # State management layer
│   │   │           │   ├── domain/       # Business models
│   │   │           │   ├── infrastructure/ # API services
│   │   │           │   └── ui/           # Components
│   │   │           ├── generator.ts     # Generator logic
│   │   │           └── schema.json      # CLI options schema
│   │   └── package.json
│   │
│   └── sandbox/                # Angular app for testing generated code
│       ├── src/
│       │   └── app/
│       │       └── features/   # Generated features go here
│       └── project.json
│
├── ARCHITECTURE.md             # Architecture documentation
├── ROADMAP.md                  # Future enhancements
├── package.json                # Root workspace configuration
└── nx.json                     # Nx workspace configuration
```

## 🚀 Quick Start

### Prerequisites

- Node.js (v18 or higher)
- npm (v9 or higher)

### Installation

```bash
# Clone the repository
git clone <repository-url>
cd angular-clean-architecture

# Install dependencies
npm install
```

### Generate Your First Feature

```bash
# Generate a new feature (e.g., "products")
npm run generate:feature -- --name=products

# Or use interactive mode
npm run generate:feature:interactive
```

This creates a complete feature structure in `apps/sandbox/src/app/features/products/`.

## 🌍 Global Usage (NPM)

You can install the CLI globally to use it in any Angular project:

```bash
# Install globally given you are logged in to the npm registry
npm install -g @angular-clean-architecture/cli

# Generate a feature with attributes
aca generate feature products --attributes="name:string,price:number,inStock:boolean"
```

### Interactive Mode

You can also use the CLI interactively:

```bash
aca generate feature products
# Prompts:
# ? Enter attributes (format: name:string,age:number) or leave empty: name:string,price:number
```

Generated model will automatically include these properties:

```typescript
export interface Product {
  id: string;
  name: string;
  price: number;
  inStock: boolean;
}
```

## 🚀 Quick Start (Monorepo)

```
products/
├── application/
│   └── store.ts              # NgRx SignalStore with state management
├── domain/
│   └── model.ts              # Business entities and interfaces
├── infrastructure/
│   └── service.ts            # HTTP services and data access
└── ui/
    └── component.ts          # Standalone Angular component
```

### Run the Sandbox Application

```bash
# Serve the sandbox app with your generated features
npm run sandbox:serve

# Open your browser to http://localhost:4200
```

## 🛠️ Available Scripts

### Global Commands

| Script | Description |
|--------|-------------|
| `npm run generate:feature -- --name=<feature-name>` | Generate a new clean architecture feature |
| `npm run generate:feature:interactive` | Generate a feature with interactive prompts |
| `npm run all:build` | Build all packages in the monorepo |
| `npm run all:lint` | Lint all packages |
| `npm run all:test` | Run tests for all packages |
| `npm run full-check` | Run format check, lint, test, and build (CI pipeline) |
| `npm run format` | Format all code with Prettier |
| `npm run format:check` | Check code formatting without changes |
| `npm run clean` | Clean Nx cache and node_modules |

### CLI Package Commands

| Script | Description |
|--------|-------------|
| `npm run cli:build` | Build the CLI generator |
| `npm run cli:test` | Run CLI tests |
| `npm run cli:lint` | Lint CLI code |

### Sandbox Package Commands

| Script | Description |
|--------|-------------|
| `npm run sandbox:serve` | Serve the sandbox app (dev mode) |
| `npm run sandbox:build` | Build the sandbox app for production |
| `npm run sandbox:test` | Run sandbox tests |
| `npm run sandbox:lint` | Lint sandbox code |

## 🏛️ Architecture Principles

This project follows **Clean Architecture** (also known as Hexagonal Architecture or Ports & Adapters). Each generated feature has four distinct layers:

### 1. **Domain Layer** (`domain/`)
- **Purpose**: Pure business logic and domain models
- **Contains**: Interfaces, types, validators, business rules
- **Dependencies**: None (no Angular, no HTTP, no external libraries)
- **Example**: `Product` interface, validation functions

### 2. **Infrastructure Layer** (`infrastructure/`)
- **Purpose**: External integrations and data access
- **Contains**: HTTP services, API clients, data mapping
- **Dependencies**: Angular HttpClient, RxJS
- **Example**: `ProductService` with CRUD operations

### 3. **Application Layer** (`application/`)
- **Purpose**: State management and orchestration
- **Contains**: NgRx SignalStore, selectors, effects
- **Dependencies**: @ngrx/signals, domain models, infrastructure services
- **Example**: `ProductStore` managing product list state

### 4. **UI Layer** (`ui/`)
- **Purpose**: User interface and presentation
- **Contains**: Standalone components, templates, styles
- **Dependencies**: Angular components, application layer stores
- **Example**: `ProductComponent` displaying products

### Dependency Flow

```
UI → Application → Infrastructure → Domain
                      ↓
                 External APIs
```

- **UI** depends on **Application** (state)
- **Application** depends on **Infrastructure** (data) and **Domain** (models)
- **Infrastructure** depends on **Domain** (models)
- **Domain** has no dependencies (pure TypeScript)

## 🎨 Generated Code Example

When you run `npm run generate:feature -- --name=user`, here's what you get:

**Domain Model** (`domain/model.ts`):
```typescript
export interface User {
  id: string;
  createdAt: Date;
  updatedAt: Date;
}
```

**Infrastructure Service** (`infrastructure/service.ts`):
```typescript
@Injectable({ providedIn: 'root' })
export class UserService {
  private readonly apiUrl = '/api/users';

  constructor(private http: HttpClient) {}

  getAll(): Observable<User[]> {
    return this.http.get<User[]>(this.apiUrl);
  }

  getById(id: string): Observable<User> {
    return this.http.get<User>(`${this.apiUrl}/${id}`);
  }

  // ... create, update, delete methods
}
```

**Application Store** (`application/store.ts`):
```typescript
export const UserStore = signalStore(
  { providedIn: 'root' },
  withState({ loading: false })
);
```

**UI Component** (`ui/component.ts`):
```typescript
@Component({
  selector: 'app-user-feature',
  standalone: true,
  imports: [CommonModule],
  template: `...`,
  styles: `...`
})
export class UserComponent {
  protected readonly store = inject(UserStore);
}
```

## 🧪 Testing

All generated code is designed to be easily testable:

```bash
# Run all tests
npm run all:test

# Run tests for specific package
npm run cli:test
npm run sandbox:test
```

### Testing Strategy

- **Domain**: Pure functions, easy to unit test
- **Infrastructure**: Mock HttpClient for service tests
- **Application**: Test store state transitions and selectors
- **UI**: Test component behavior with mocked stores

## 🤝 Contributing

### Development Workflow

1. Make changes to the CLI generator in `apps/cli/src/generators/`
2. Build the CLI: `npm run cli:build`
3. Test your changes: `npm run generate:feature -- --name=test-feature`
4. Verify in sandbox: `npm run sandbox:serve`
5. Run quality checks: `npm run full-check`

### Code Quality

Before committing, ensure:
- ✅ Code is formatted: `npm run format`
- ✅ No linting errors: `npm run all:lint`
- ✅ All tests pass: `npm run all:test`
- ✅ Build succeeds: `npm run all:build`

## 📚 Additional Resources

- [ARCHITECTURE.md](./ARCHITECTURE.md) - Detailed architecture documentation
- [ROADMAP.md](./ROADMAP.md) - Future enhancements and planned features
- [Nx Documentation](https://nx.dev)
- [Angular Documentation](https://angular.dev)
- [NgRx Signals](https://ngrx.io/guide/signals)

## 📝 License

This project is licensed under the MIT License.

## 🙋 Support

For issues, questions, or contributions, please open an issue in the repository.

---

**Built with ❤️ using Angular 18, Nx, and NgRx Signals**
