# Angular Clean Architecture CLI

[![npm version](https://img.shields.io/npm/v/@devmed555/angular-clean-architecture-cli.svg)](https://www.npmjs.com/package/@devmed555/angular-clean-architecture-cli)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0+-blue.svg)](https://www.typescriptlang.org/)

> A powerful CLI tool for scaffolding Angular features following Clean Architecture principles with NgRx SignalStore state management.

## 🎯 Overview

The Angular Clean Architecture CLI (`aca`) generates production-ready Angular features with proper separation of concerns across four distinct layers:

- **Domain Layer**: Pure business logic and models
- **Infrastructure Layer**: HTTP services and data access
- **Application Layer**: NgRx SignalStore state management
- **UI Layer**: Standalone Angular components

Each generated feature is fully typed, testable, and follows Angular best practices.

## 📦 Installation

### Global Installation (Recommended)

```bash
npm install -g @devmed555/angular-clean-architecture-cli
```

After installation, the `aca` command will be available globally.

### Local Installation

```bash
npm install --save-dev @devmed555/angular-clean-architecture-cli
```

Then use via npx:

```bash
npx aca generate feature <name>
```

## 🚀 Quick Start

### Generate Your First Feature

```bash
# Interactive mode (recommended for beginners)
aca generate feature

# You'll be prompted for:
# 1. Feature name (e.g., "product")
# 2. Attributes (name and type)
```

### With Feature Name

```bash
aca generate feature products
# Will prompt for attributes interactively
```

### With Attributes

```bash
aca generate feature products --attributes="name:string,price:number,inStock:boolean"
```

## 📖 Usage

### Command Syntax

```bash
aca generate feature <name> [options]
```

### Options

| Option | Description | Example |
|--------|-------------|---------|
| `--attributes` | Comma-separated list of attributes with types | `--attributes="name:string,age:number"` |
| `--blueprint` | Path to a JSON blueprint file | `--blueprint=./feature-blueprint.json` |
| `--interactive` | Force interactive mode | `--interactive` |

### Available Types

When defining attributes, you can use the following types:
- `string`
- `number`
- `boolean`
- `Date`
- `any`

## 🏗️ Generated Structure

Running `aca generate feature products` creates:

```
src/app/features/products/
├── domain/
│   └── model.ts              # Business entities (Product interface)
├── infrastructure/
│   └── service.ts            # HTTP service with CRUD operations
├── application/
│   └── store.ts              # NgRx SignalStore for state management
└── ui/
    └── component.ts          # Standalone Angular component
```

### Generated Code Example

**Domain Model** (`domain/model.ts`):
```typescript
export interface Product {
  id: string;
  name: string;
  price: number;
  inStock: boolean;
  createdAt: Date;
  updatedAt: Date;
}
```

**Infrastructure Service** (`infrastructure/service.ts`):
```typescript
@Injectable({ providedIn: 'root' })
export class ProductService {
  private readonly apiUrl = '/api/products';
  
  constructor(private http: HttpClient) {}

  getAll(): Observable<Product[]> {
    return this.http.get<Product[]>(this.apiUrl);
  }

  getById(id: string): Observable<Product> {
    return this.http.get<Product>(`${this.apiUrl}/${id}`);
  }

  create(data: Omit<Product, 'id' | 'createdAt' | 'updatedAt'>): Observable<Product> {
    return this.http.post<Product>(this.apiUrl, data);
  }

  update(id: string, data: Partial<Product>): Observable<Product> {
    return this.http.put<Product>(`${this.apiUrl}/${id}`, data);
  }

  delete(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
```

**Application Store** (`application/store.ts`):
```typescript
export const ProductStore = signalStore(
  { providedIn: 'root' },
  withState({ loading: false })
);
```

**UI Component** (`ui/component.ts`):
```typescript
@Component({
  selector: 'app-product-feature',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="product-feature">
      <h1>Product Feature</h1>
      @if (store.loading()) {
        <p>Loading...</p>
      } @else {
        <p>Ready to build your product feature!</p>
      }
    </div>
  `,
})
export class ProductComponent {
  protected readonly store = inject(ProductStore);
}
```

## 🎨 Blueprint Mode (Advanced)

For complex features with multiple models, use a blueprint JSON file.

### Blueprint Example

Create a `feature-blueprint.json` file:

```json
{
  "name": "order",
  "models": [
    {
      "name": "Order",
      "attributes": [
        { "name": "total", "type": "number" },
        { "name": "customerName", "type": "string" },
        { "name": "status", "type": "string" }
      ]
    },
    {
      "name": "OrderItem",
      "attributes": [
        { "name": "productId", "type": "string" },
        { "name": "quantity", "type": "number" },
        { "name": "price", "type": "number" }
      ]
    }
  ]
}
```

### Generate from Blueprint

```bash
aca generate feature --blueprint=./feature-blueprint.json
```

This will generate both `Order` and `OrderItem` interfaces in the domain model file.

### Blueprint Schema

```json
{
  "name": "string (required)",
  "models": [
    {
      "name": "string (required)",
      "attributes": [
        {
          "name": "string (required)",
          "type": "string (required)",
          "required": "boolean (optional, default: true)"
        }
      ]
    }
  ]
}
```

## 🎯 Naming Conventions

The CLI automatically handles naming conversions:

| Input | Output |
|-------|--------|
| `product` | Feature folder: `products/` (auto-pluralized) |
| `product` | Interface: `Product` (PascalCase) |
| `product` | Component: `ProductComponent` |
| `product` | Service: `ProductService` |
| `product` | Store: `ProductStore` |
| `user-profile` | Feature folder: `user-profiles/` |
| `user-profile` | Interface: `UserProfile` |

## 💡 Examples

### Simple Feature

```bash
aca generate feature user
```

Generates a basic user feature with default attributes (id, createdAt, updatedAt).

### Feature with Custom Attributes

```bash
aca generate feature article --attributes="title:string,content:string,published:boolean,views:number"
```

### Multi-Word Feature

```bash
aca generate feature user-profile --attributes="firstName:string,lastName:string,email:string,age:number"
```

### Complex Feature with Blueprint

```bash
aca generate feature ecommerce --blueprint=./ecommerce-blueprint.json
```

## 🔧 Prerequisites

- **Node.js**: v18 or higher
- **npm**: v9 or higher
- **Angular Project**: Angular 16+ (with standalone components support)
- **Dependencies**: `@ngrx/signals` must be installed in your project

### Installing Required Dependencies

```bash
npm install @ngrx/signals
```

## 🐛 Troubleshooting

### Command Not Found

If `aca` command is not recognized after global installation:

```bash
# Verify installation
npm list -g @devmed555/angular-clean-architecture-cli

# Reinstall if needed
npm uninstall -g @devmed555/angular-clean-architecture-cli
npm install -g @devmed555/angular-clean-architecture-cli
```

### Blueprint File Not Found

Ensure the blueprint path is relative to your current working directory:

```bash
# Correct
aca generate feature --blueprint=./blueprints/order.json

# Incorrect (absolute paths may not work)
aca generate feature --blueprint=/absolute/path/to/blueprint.json
```

### Generated Files Not Appearing

The CLI generates files in `src/app/features/<feature-name>/`. Ensure:
1. You're running the command from your Angular project root
2. The `src/app/features/` directory exists (create it if needed)
3. You have write permissions in the directory

### TypeScript Errors After Generation

If you see TypeScript errors:

1. Ensure `@ngrx/signals` is installed
2. Run `npm install` to update dependencies
3. Restart your IDE/editor
4. Check that your `tsconfig.json` includes the generated files

## 🤝 Contributing

Contributions are welcome! Please visit the [GitHub repository](https://github.com/MohamedBouattour/angular-clean-architecture) to:

- Report bugs
- Suggest features
- Submit pull requests

## 📚 Additional Resources

- [Architecture Documentation](https://github.com/MohamedBouattour/angular-clean-architecture/blob/main/ARCHITECTURE.md)
- [Roadmap](https://github.com/MohamedBouattour/angular-clean-architecture/blob/main/ROADMAP.md)
- [NgRx Signals Documentation](https://ngrx.io/guide/signals)
- [Angular Documentation](https://angular.dev)

## 📝 License

MIT License - see [LICENSE](https://github.com/MohamedBouattour/angular-clean-architecture/blob/main/LICENSE) for details.

## 👨‍💻 Author

**Mohamed Bouattour**
- Email: mohamedbouattour123@gmail.com
- GitHub: [@MohamedBouattour](https://github.com/MohamedBouattour)

## 🙋 Support

For issues, questions, or feature requests:
- [Open an issue](https://github.com/MohamedBouattour/angular-clean-architecture/issues)
- [Start a discussion](https://github.com/MohamedBouattour/angular-clean-architecture/discussions)

---

**Built with ❤️ using Angular, Nx, and NgRx Signals**
