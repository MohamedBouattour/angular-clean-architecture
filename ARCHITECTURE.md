# Angular Clean Architecture

This document describes the architectural principles and structure followed by applications generated with `angular-clean-architecture`.

## Layers

The application is structured into four main layers within each feature:

1.  **UI (User Interface)**:
    *   **Components**: Dumb (presentational) and Smart (container) components.
    *   **Responsibility**: Rendering state from the Store and dispatching user events. No business logic or direct API calls.
    *   **Path**: `src/app/features/<feature>/ui/`

2.  **Application**:
    *   **State Management**: Uses NgRx SignalStore (`<feature>.store.ts`) to manage state, selectors, and side effects.
    *   **Orchestration**: Facades (optional) or Stores coordinate between Domain and Infrastructure.
    *   **Path**: `src/app/features/<feature>/application/`

3.  **Domain**:
    *   **Models**: Pure TypeScript interfaces/types defining the business entities.
    *   **Logic**: Pure business logic (validators, mappers) that does not depend on Angular or HTTP.
    *   **Path**: `src/app/features/<feature>/domain/`

4.  **Infrastructure**:
    *   **API Services**: Implementation of data access, primarily via `HttpClient`.
    *   **DTOing**: Mapping between API payloads and Domain Models (if necessary).
    *   **Path**: `src/app/features/<feature>/infrastructure/`

## File Naming Conventions

*   **Interfaces/Types**: PascalCase (e.g., `User`, `Product`)
*   **Services**: PascalCase with "Service" suffix (e.g., `UserService`)
*   **Stores**: PascalCase with "Store" suffix (e.g., `UserStore`)
*   **Components**: PascalCase with "Component" suffix (e.g., `UserComponent`)
*   **Files**: kebab-case with type suffix (e.g., `model.ts`, `service.ts`, `store.ts`, `component.ts`)

## Generated Feature Example

When you generate a feature named `user`, you get:

```
src/app/features/user/
├── domain/
│   └── model.ts              # User interface definition
├── infrastructure/
│   └── service.ts            # UserService with HTTP operations
├── application/
│   └── store.ts              # UserStore with SignalStore
└── ui/
    └── component.ts          # UserComponent with store injection
```

## Core & Shared

*   **Core (`src/app/core`)**: Singleton services, interceptors, guards, and global configuration.
*   **Shared (`src/app/shared`)**: Reusable UI components, pipes, and directives that are used across multiple features.

## State Management

We use **NgRx SignalStore** (v20+) for managing feature state.
*   **Entities**: Managed via `withEntities`.
*   **Call State**: Loading/Error states managed via `withCallState` (custom feature).
*   **Reactivity**: Deeply integrated with Angular Signals.

## Coding Standards

*   **Zoneless**: Ready for zoneless change detection (using Signals and `OnPush`).
*   **Strict Mode**: Full strictness in TypeScript.
*   **Standalone**: All components are standalone.
