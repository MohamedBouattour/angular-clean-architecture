# Angular Clean Architecture CLI - Examples

This document provides comprehensive examples of using the Angular Clean Architecture CLI in various scenarios.

## Table of Contents

- [Basic Examples](#basic-examples)
- [Blueprint Examples](#blueprint-examples)
- [Real-World Scenarios](#real-world-scenarios)
- [Best Practices](#best-practices)

## Basic Examples

### Example 1: Simple Feature (Interactive Mode)

Generate a basic user feature interactively:

```bash
aca generate feature
```

**Prompts:**
```
? What is the name of the feature (singular)? user
Let's add some attributes (property fields).
? Enter attribute name (or press enter to finish): firstName
? Select type: string
? Enter attribute name (or press enter to finish): lastName
? Select type: string
? Enter attribute name (or press enter to finish): email
? Select type: string
? Enter attribute name (or press enter to finish): age
? Select type: number
? Enter attribute name (or press enter to finish): [Press Enter]
```

**Generated Structure:**
```
src/app/features/users/
├── domain/model.ts
├── infrastructure/service.ts
├── application/store.ts
└── ui/component.ts
```

**Generated Model:**
```typescript
export interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  age: number;
  createdAt: Date;
  updatedAt: Date;
}
```

---

### Example 2: Feature with Inline Attributes

Generate a product feature with attributes specified inline:

```bash
aca generate feature product --attributes="name:string,price:number,inStock:boolean,category:string"
```

**Generated Model:**
```typescript
export interface Product {
  id: string;
  name: string;
  price: number;
  inStock: boolean;
  category: string;
  createdAt: Date;
  updatedAt: Date;
}
```

---

### Example 3: Multi-Word Feature Names

Generate a feature with a multi-word name:

```bash
aca generate feature user-profile --attributes="bio:string,avatarUrl:string,followers:number"
```

**Generated Structure:**
```
src/app/features/user-profiles/
├── domain/model.ts          # Contains UserProfile interface
├── infrastructure/service.ts # UserProfileService
├── application/store.ts      # UserProfileStore
└── ui/component.ts           # UserProfileComponent
```

---

## Blueprint Examples

### Example 4: Simple Blueprint

Use the provided simple user blueprint:

```bash
aca generate feature --blueprint=./node_modules/@devmed555/angular-clean-architecture-cli/examples/simple-user-blueprint.json
```

Or create your own `user-blueprint.json`:

```json
{
  "name": "user",
  "models": [
    {
      "name": "User",
      "attributes": [
        { "name": "firstName", "type": "string" },
        { "name": "lastName", "type": "string" },
        { "name": "email", "type": "string" },
        { "name": "age", "type": "number" },
        { "name": "isActive", "type": "boolean" }
      ]
    }
  ]
}
```

Then run:
```bash
aca generate feature --blueprint=./user-blueprint.json
```

---

### Example 5: Multi-Model Blueprint (Blog System)

Create a blog feature with multiple related models:

**blog-blueprint.json:**
```json
{
  "name": "blog",
  "models": [
    {
      "name": "Post",
      "attributes": [
        { "name": "title", "type": "string" },
        { "name": "content", "type": "string" },
        { "name": "authorId", "type": "string" },
        { "name": "published", "type": "boolean" },
        { "name": "publishedAt", "type": "Date" },
        { "name": "views", "type": "number" },
        { "name": "tags", "type": "string[]" }
      ]
    },
    {
      "name": "Comment",
      "attributes": [
        { "name": "postId", "type": "string" },
        { "name": "authorId", "type": "string" },
        { "name": "content", "type": "string" },
        { "name": "approved", "type": "boolean" }
      ]
    },
    {
      "name": "Author",
      "attributes": [
        { "name": "name", "type": "string" },
        { "name": "email", "type": "string" },
        { "name": "bio", "type": "string" },
        { "name": "avatarUrl", "type": "string" }
      ]
    }
  ]
}
```

Generate:
```bash
aca generate feature --blueprint=./blog-blueprint.json
```

**Generated domain/model.ts:**
```typescript
export interface Post {
  id: string;
  title: string;
  content: string;
  authorId: string;
  published: boolean;
  publishedAt: Date;
  views: number;
  tags: string[];
  createdAt: Date;
  updatedAt: Date;
}

export interface Comment {
  id: string;
  postId: string;
  authorId: string;
  content: string;
  approved: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface Author {
  id: string;
  name: string;
  email: string;
  bio: string;
  avatarUrl: string;
  createdAt: Date;
  updatedAt: Date;
}
```

---

### Example 6: E-Commerce Blueprint

Create a comprehensive e-commerce feature:

**ecommerce-blueprint.json:**
```json
{
  "name": "ecommerce",
  "models": [
    {
      "name": "Product",
      "attributes": [
        { "name": "name", "type": "string" },
        { "name": "description", "type": "string" },
        { "name": "price", "type": "number" },
        { "name": "stock", "type": "number" },
        { "name": "category", "type": "string" },
        { "name": "imageUrl", "type": "string" },
        { "name": "isActive", "type": "boolean" }
      ]
    },
    {
      "name": "Category",
      "attributes": [
        { "name": "name", "type": "string" },
        { "name": "description", "type": "string" },
        { "name": "parentId", "type": "string" }
      ]
    },
    {
      "name": "Cart",
      "attributes": [
        { "name": "userId", "type": "string" },
        { "name": "items", "type": "CartItem[]" },
        { "name": "total", "type": "number" }
      ]
    },
    {
      "name": "CartItem",
      "attributes": [
        { "name": "productId", "type": "string" },
        { "name": "quantity", "type": "number" },
        { "name": "price", "type": "number" }
      ]
    }
  ]
}
```

Generate:
```bash
aca generate feature --blueprint=./ecommerce-blueprint.json
```

---

## Real-World Scenarios

### Scenario 1: Task Management System

```bash
# Generate task feature
aca generate feature task --attributes="title:string,description:string,status:string,priority:number,assigneeId:string,dueDate:Date,completed:boolean"
```

### Scenario 2: Social Media Platform

**social-blueprint.json:**
```json
{
  "name": "social",
  "models": [
    {
      "name": "Profile",
      "attributes": [
        { "name": "username", "type": "string" },
        { "name": "displayName", "type": "string" },
        { "name": "bio", "type": "string" },
        { "name": "avatarUrl", "type": "string" },
        { "name": "followersCount", "type": "number" },
        { "name": "followingCount", "type": "number" }
      ]
    },
    {
      "name": "Post",
      "attributes": [
        { "name": "authorId", "type": "string" },
        { "name": "content", "type": "string" },
        { "name": "imageUrls", "type": "string[]" },
        { "name": "likesCount", "type": "number" },
        { "name": "commentsCount", "type": "number" }
      ]
    },
    {
      "name": "Follow",
      "attributes": [
        { "name": "followerId", "type": "string" },
        { "name": "followingId", "type": "string" }
      ]
    }
  ]
}
```

```bash
aca generate feature --blueprint=./social-blueprint.json
```

### Scenario 3: Booking System

```bash
aca generate feature booking --attributes="customerId:string,serviceId:string,startTime:Date,endTime:Date,status:string,notes:string,totalPrice:number"
```

---

## Best Practices

### 1. Feature Naming

✅ **Good:**
```bash
aca generate feature product
aca generate feature user-profile
aca generate feature order-item
```

❌ **Avoid:**
```bash
aca generate feature products  # Will become "productss"
aca generate feature UserProfile  # Use kebab-case instead
```

### 2. Attribute Types

Use appropriate TypeScript types:

```bash
# Good type choices
--attributes="name:string,age:number,isActive:boolean,birthDate:Date,tags:string[]"
```

**Available Types:**
- `string` - Text data
- `number` - Numeric values
- `boolean` - True/false values
- `Date` - Date/time values
- `any` - Any type (use sparingly)
- `Type[]` - Arrays (e.g., `string[]`, `number[]`)

### 3. Blueprint Organization

Organize blueprints in a dedicated directory:

```
project-root/
├── blueprints/
│   ├── user.json
│   ├── product.json
│   └── order.json
└── src/
```

Then reference them easily:
```bash
aca generate feature --blueprint=./blueprints/user.json
```

### 4. Model Relationships

When creating related models, use IDs to establish relationships:

```json
{
  "name": "order",
  "models": [
    {
      "name": "Order",
      "attributes": [
        { "name": "customerId", "type": "string" },
        { "name": "items", "type": "OrderItem[]" }
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

### 5. Iterative Development

Start simple, then enhance:

```bash
# Step 1: Generate basic feature
aca generate feature article --attributes="title:string,content:string"

# Step 2: Manually enhance the generated code
# - Add custom methods to service
# - Implement state management in store
# - Build UI components

# Step 3: Generate related features
aca generate feature comment --attributes="articleId:string,content:string,authorId:string"
```

---

## Tips

1. **Always review generated code** - The CLI provides a solid foundation, but you should customize it to your needs
2. **Use blueprints for complex features** - Save time when generating features with multiple models
3. **Follow Angular conventions** - The generated code follows Angular best practices
4. **Test your features** - Generated code is designed to be easily testable
5. **Version control your blueprints** - Keep blueprint files in your repository for team consistency

---

## Need Help?

- [Main README](./README.md)
- [GitHub Issues](https://github.com/MohamedBouattour/angular-clean-architecture/issues)
- [Architecture Documentation](https://github.com/MohamedBouattour/angular-clean-architecture/blob/main/ARCHITECTURE.md)
