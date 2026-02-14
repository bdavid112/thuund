# Thuund Framework Modules

> Thuund Framework  
> Author: David Boros  
> License: MIT  
> Last Updated: 2026-02-14

---

# Overview

Thuund is structured around a kernel + adapters model.

Modules fall into three architectural categories:

1. Kernel (orchestration layer)
2. Capability Adapters (UI / Logic implementations)
3. Feature Plugins (extend system behavior)

Each module category has a clearly defined responsibility and dependency direction.

---

# 1. thuund-core (Framework Kernel)

## Responsibility

thuund-core is the runtime foundation and orchestration engine of the framework.

It is responsible for:

- Defining core contracts (UIAdapter, LogicAdapter)
- Managing configuration and runtime state
- Loading and initializing feature plugins
- Managing lifecycle hooks
- Registering capability adapters
- Maintaining dependency boundaries

thuund-core must remain implementation-agnostic.

It does NOT depend on:

- Any specific UI framework
- Any specific backend framework
- Any specific runtime

---

## Public API (Conceptual)

```ts
registerPlugin(plugin: Plugin)
registerAdapter(type: "ui" | "logic", adapter: Adapter)
getConfig()
runLifecycleHook(hookName: string, payload?: unknown)
createThuund(config?: ThuundConfig)
```

---

## Notes

- thuund-core is required for all projects.
- It should remain minimal and stable.
- It depends only on abstractions, never concrete UI or logic implementations.

---

# 2. thuund-logic (Official Logic Adapter)

## Architectural Role

thuund-logic is the official default implementation of the LogicAdapter contract.

It provides reusable business logic for frontend and backend environments.

It is a capability adapter, not a feature plugin.

---

## Responsibility

- Shared validation schemas
- Authentication helpers
- API request/response utilities
- Shared service patterns
- Backend helper utilities (when applicable)

---

## Public API Examples

```ts
authHelpers.login();
authHelpers.logout();
validators.userSchema;
apiUtils.fetch();
createService();
```

---

## Notes

- Implements the LogicAdapter contract defined by thuund-core.
- Can be replaced at initialization.
- Should not depend on thuund-ui.
- May depend on configuration provided by thuund-core.

---

# 3. thuund-ui (Official UI Adapter)

## Architectural Role

thuund-ui is the official default implementation of the UIAdapter contract.

It provides the stock UI layer for Thuund projects.

It is a capability adapter, not a plugin.

---

## Responsibility

- Reusable UI components
- Layout primitives
- Theming system
- Form abstractions integrated with the active logic adapter
- UI utilities

---

## Public API Examples

```ts
<Button />
<Input />
<Modal />
<Table />
<ThemeProvider />
<Form />
```

---

## Notes

- Implements the UIAdapter contract defined by thuund-core.
- Can be replaced at initialization.
- Integrates with the configured LogicAdapter.
- Optional for API-only projects.

---

# 4. thuund-plugins (Feature Plugins)

## Architectural Role

Feature plugins extend system capabilities.

They are not replacements for architectural layers.

Examples:

- Authentication plugin
- Analytics plugin
- Caching plugin
- Payments plugin

---

## Responsibility

- Hook into lifecycle events
- Register services
- Extend runtime behavior
- Add optional system capabilities

---

## Notes

- Depend on thuund-core
- May interact with configured adapters
- Should not tightly couple to specific UI or logic implementations

---

# 5. Module Interaction Model

Thuund enforces strict dependency direction.

```mermaid
flowchart TD
    A[thuund-core] --> B[Feature Plugins]
    A --> C[Adapter Contracts]

    C --> D[thuund-ui (default)]
    C --> E[thuund-logic (default)]

    D --> E
```

Dependency rules:

- thuund-core depends on nothing.
- Adapters depend on contracts defined by thuund-core.
- thuund-ui may use thuund-logic.
- thuund-logic must not depend on thuund-ui.
- Feature plugins depend only on thuund-core abstractions.

---

# 6. Adapter Replacement Model

At initialization:

```ts
createThuund({
  ui: CustomUIAdapter,
  logic: CustomLogicAdapter,
});
```

If no adapters are provided:

- thuund-ui is used
- thuund-logic is used

This ensures:

- Strong defaults
- Controlled extensibility
- Clean orchestration boundaries

---

# 7. Future Modules

The architecture supports additional module categories.

Examples:

## thuund-database

Database connectors or ORM integrations.

## thuund-auth

High-level authentication system built on top of LogicAdapter.

## Third-Party UI Adapters

- thuund-ui-solid
- thuund-ui-native
- thuund-ui-custom

## Third-Party Logic Adapters

- thuund-logic-graphql
- thuund-logic-rpc
- thuund-logic-edge

All must implement contracts defined by thuund-core.

---

# Summary

Thuund modules are organized by architectural responsibility:

- Kernel (thuund-core) → orchestration & contracts
- Capability adapters (thuund-ui, thuund-logic) → implementation strategy
- Feature plugins (thuund-plugins) → system extensions

This structure ensures:

- Clean separation of concerns
- Long-term scalability
- Replaceable implementation layers
- Stable core foundation
- Ecosystem readiness
