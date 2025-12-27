# CLI Documentation

The CLI is an Nx generator designed to scaffold clean architecture features within the `sandbox` application.

## Usage

To generate a new feature, run:

```bash
npm run generate:feature -- --name=<feature-name>

# Examples:
npm run generate:feature -- --name=products
npm run generate:feature -- --name=user-profile
npm run generate:feature -- --name=shopping-cart

# Interactive mode with prompts:
npm run generate:feature:interactive
```

### Arguments

| Argument | Description | Required |
| --- | --- | --- |
| `--name` | The name of the feature to generate (kebab-case recommended). | Yes |

### Generated Structure

The generator will create the following structure in `apps/sandbox/src/app/features/<name>`:

```
<feature-name>/
├── domain/
│   └── model.ts              # Business entities (PascalCase interfaces)
├── infrastructure/
│   └── service.ts            # HTTP services with CRUD operations
├── application/
│   └── store.ts              # NgRx SignalStore for state management
└── ui/
    └── component.ts          # Standalone Angular component with store injection
```

### Naming Conventions

The generator automatically handles naming:
- **Input**: kebab-case (e.g., `user-profile`)
- **Classes/Interfaces**: PascalCase (e.g., `UserProfileComponent`, `UserProfile`)
- **Stores**: PascalCase with "Store" suffix (e.g., `UserProfileStore`)
- **Services**: PascalCase with "Service" suffix (e.g., `UserProfileService`)

### Example Generated Code

For `npm run generate:feature -- --name=product`:

**Domain Model** (`domain/model.ts`):
```typescript
export interface Product {
  id: string;
  createdAt: Date;
  updatedAt: Date;
}
```

**Infrastructure Service** (`infrastructure/service.ts`):
```typescript
@Injectable({ providedIn: 'root' })
export class ProductService {
  private readonly apiUrl = '/api/products';
  
  getAll(): Observable<Product[]> { ... }
  getById(id: string): Observable<Product> { ... }
  create(data: Omit<Product, 'id' | 'createdAt' | 'updatedAt'>): Observable<Product> { ... }
  update(id: string, data: Partial<Product>): Observable<Product> { ... }
  delete(id: string): Observable<void> { ... }
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

## Template Structure

Templates are located in `src/generators/clean-feature/files/`:

```
files/
├── application/
│   └── store.ts.template       # SignalStore template
├── domain/
│   └── model.ts.template       # Interface template
├── infrastructure/
│   └── service.ts.template     # Service template with CRUD
└── ui/
    └── component.ts.template   # Component template with store
```

Templates use EJS syntax:
- `<%= name %>` - Original kebab-case feature name
- `<%= pascalName %>` - PascalCase version of the name

## Development

### Build the CLI

```bash
npm run cli:build
```

### Test the CLI

```bash
npm run cli:test
```

### Lint the CLI

```bash
npm run cli:lint
```

### Development Workflow

1. **Modify templates** in `src/generators/clean-feature/files/`
2. **Update generator logic** in `generator.ts` if needed
3. **Build**: `npm run cli:build`
4. **Test**: Generate a feature with `npm run generate:feature -- --name=test`
5. **Verify**: Check generated code in `apps/sandbox/src/app/features/test`
6. **Clean up**: Delete test feature after verification

### Adding New Template Variables

To add new template variables:

1. Update `generator.ts`:
   ```typescript
   generateFiles(tree, ..., targetPath, {
     ...options,
     name,
     pascalName,
     yourNewVariable: computeValue(name), // Add here
     tmpl: '',
   });
   ```

2. Use in templates:
   ```typescript
   // In any .template file
   export class <%= yourNewVariable %>Something { }
   ```

## Tips

- **Feature naming**: Use kebab-case for multi-word features (e.g., `user-profile`, not `userProfile`)
- **Testing**: Always test generated code in the sandbox app
- **Customization**: Modify templates to match your team's conventions
- **Validation**: Consider adding name validation in `generator.ts` to prevent duplicates
