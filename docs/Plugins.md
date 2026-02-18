# Thuund Framework - Plugin Documentation

## What is a Plugin?

A **plugin** in Thuund is a **self-contained module** that adds extra functionality to your application **without modifying the kernel or adapters**. Plugins hook into the kernel lifecycle, allowing developers to extend the system in a controlled way.

**Examples of common plugins:**

- Authentication
- Analytics
- Caching
- Payments
- Logging enhancements

Plugins are **capability extensions**, not architectural replacements. They rely on the kernel and adapters but do not change their contracts.

---

## Plugin Architecture

Thuund enforces a **clear separation of concerns**:

- **Kernel:** Orchestration, lifecycle, adapter contracts
- **Adapters:** Provide implementations for UI or logic
- **Plugins:** Extend functionality, hook into lifecycle, register services

This ensures that plugins can be added or removed without breaking the framework.

---

## Plugin Interface

In TypeScript, a plugin follows this interface:

```ts
interface Plugin {
  name: string // Unique identifier for the plugin
  init?: (kernel: Kernel) => Promise<void> // Optional hook executed when the kernel starts
  dispose?: () => Promise<void> // Optional hook executed when the kernel stops
}
```

### Properties

- **name** – A unique identifier for the plugin. Used internally and in CLI commands.
- **init** – Optional asynchronous function called when the kernel starts. Can access the kernel, adapters, and register services.
- **dispose** – Optional asynchronous function called when the kernel stops. Should clean up resources, listeners, or background tasks.

---

## Lifecycle Hooks

Plugins interact with the **kernel lifecycle**:

1. **Kernel Start (`init`)**
   - Called after adapters are initialized.
   - Plugins can register services, add middleware, or modify runtime behavior.

2. **Kernel Stop (`dispose`)**
   - Called before the kernel shuts down.
   - Plugins should release resources, unsubscribe from events, or clear caches.

The kernel ensures all registered plugins are initialized and disposed in **registration order**.

---

## Example: Authentication Plugin

```ts
export const AuthPlugin: Plugin = {
  name: 'auth',
  init: async (kernel) => {
    // Access the logic adapter
    const logic = kernel.getAdapter('logic')

    // Register authentication service
    logic.registerService('auth', new AuthService())

    console.log('[PLUGIN] AuthPlugin initialized')
  },
  dispose: async () => {
    console.log('[PLUGIN] AuthPlugin disposed')
  },
}
```

---

## Plugin vs Adapter

| Aspect         | Plugin                     | Adapter                              |
| -------------- | -------------------------- | ------------------------------------ |
| **Purpose**    | Add optional functionality | Provide implementation of a contract |
| **Depends on** | Kernel only                | Kernel contracts                     |
| **Lifecycle**  | `init` / `dispose` hooks   | `init` / `mount` / `dispose`         |
| **Scope**      | Feature-level, optional    | Core capability layer                |
| **Examples**   | Auth, Analytics, Payments  | UI Adapter, Logic Adapter            |

**Key Idea:**

- **Adapters** define _how_ things work.
- **Plugins** define _extra features_ that use the kernel and adapters.

---

## Best Practices

- Keep plugins **self-contained** and independent.
- Use kernel hooks (`init` / `dispose`) for setup and cleanup.
- Expose only a **minimal API** to reduce coupling.
- Do **not modify kernel contracts** or core adapters.
- Use **unique names** for each plugin.
- Ensure plugins can safely be **added or removed at runtime**.

---

## Advanced Plugin Capabilities

Plugins can:

- Hook into **kernel lifecycle events** for initialization or cleanup.
- Access **adapters** via `kernel.getAdapter('ui' | 'logic')`.
- Register **services** for business logic or utilities.
- Attach **middleware** for request/response handling.
- Provide **custom CLI commands** or code generators.

Example: Adding a service to the logic adapter:

```ts
init: async (kernel) => {
  const logic = kernel.getAdapter('logic')
  logic.registerService('cache', new CacheService())
}
```

---

## Summary

- Plugins extend Thuund without altering core architecture.
- They hook into the **kernel lifecycle** (`init` / `dispose`).
- Plugins access adapters and register services to enhance functionality.
- They follow strict **separation of concerns** and **dependency rules**.
- Designed for **modularity, flexibility, and ecosystem growth**.
