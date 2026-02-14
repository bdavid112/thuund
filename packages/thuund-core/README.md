# **Thuund Framework – Core Space Documentation**

## 1️⃣ Overview

**Purpose:**
The **Core Space** represents the heart of the **Thuund Framework** — the **kernel, orchestration engine, and contract definitions**. It is fully **implementation-agnostic**, providing the foundation for all adapters, plugins, and CLI operations.
The Core Space ensures:

- Strong **dependency boundaries**
- **Lifecycle orchestration** for adapters and plugins
- **Contract enforcement** for UI and logic layers
- Centralized initialization and configuration
  **Key Principle:**
  > Thuund Core defines “what” happens, not “how.” Implementations (UI, Logic) are injected via adapters.

---

## 2️⃣ Core Modules

The Core Space contains the following modules:

| Module           | Role          | Description                                                                 |
| ---------------- | ------------- | --------------------------------------------------------------------------- |
| Kernel           | Orchestration | Central class managing lifecycle hooks, adapters, and plugin initialization |
| Contracts        | Abstractions  | Interfaces for `UIAdapter`, `LogicAdapter`, and lifecycle hooks             |
| Lifecycle        | Event System  | Hook system for pre-init, post-init, pre-destroy, post-destroy events       |
| Plugin Manager   | Extensibility | Handles registration, validation, and orchestration of plugins              |
| Adapter Registry | Flexibility   | Tracks active adapters and allows runtime replacement                       |

---

## 3️⃣ Core Concepts

### 3.1 Adapter Contracts

- **UIAdapter**
  - Methods: `render()`, `update()`, `destroy()`
  - Responsibilities: Render UI components, interact with logic adapter, manage UI lifecycle
- **LogicAdapter**
  _ Methods: `request()`, `validate()`, `service()`
  _ Responsibilities: Handle API calls, validations, shared utilities, backend orchestration
  > Both adapters are **pluggable**, replaceable without modifying Thuund Core.

---

### 3.2 Lifecycle Hooks

Lifecycle hooks provide **extension points** for plugins and adapters:

- `beforeInit` → runs before kernel bootstraps adapters
- `afterInit` → runs after kernel initialization is complete
- `beforeDestroy` → cleanup hooks
- `afterDestroy` → post-cleanup tasks
  > Hooks are **asynchronous**, allowing adapters and plugins to perform setup and teardown reliably.

---

### 3.3 Plugin System

- **Registration:** Plugins register via `registerPlugin(pluginObject)`
- **Validation:** Ensures plugin implements required interface (name, init function, optional hooks)
- **Orchestration:** Plugins can subscribe to lifecycle hooks or register services
- **Isolation:** Plugins never directly modify kernel or adapter internals

---

### 3.4 Orchestration Flow

1. Kernel initializes → core contracts are loaded
2. Default adapters (UI & Logic) are registered
3. Plugins are loaded and registered
4. Lifecycle hooks execute in order (`beforeInit` → `init` → `afterInit`)
5. Application ready for user commands / CLI interaction
   > This flow guarantees **predictable initialization** and **modular extensibility**.

---

## 4️⃣ Directory Structure (Example)

```bash
core/
├── src/
│   ├── kernel/
│   │   └── Kernel.ts          # Main orchestration class
│   ├── contracts/
│   │   ├── UIAdapter.ts
│   │   ├── LogicAdapter.ts
│   │   └── LifecycleHooks.ts
│   ├── plugins/
│   │   └── PluginManager.ts
│   └── adapters/
│       └── AdapterRegistry.ts
├── tests/
│   └── kernel.test.ts
├── index.ts                   # Entry point
└── README.md
```

> Keep Thuund Core **independent** of any concrete UI or Logic frameworks.

---

## 5️⃣ Recommended Tasks (ClickUp)

| Task                     | Description                                             | Subtasks                                                                 |
| ------------------------ | ------------------------------------------------------- | ------------------------------------------------------------------------ |
| Define Adapter Contracts | Create base interfaces for `UIAdapter` & `LogicAdapter` | Define methods, expected params, default error handling                  |
| Implement Kernel Class   | Central orchestration engine                            | Load adapters, manage lifecycle, execute hooks                           |
| Build Plugin Manager     | Handles plugin registration & lifecycle                 | Register plugin, validate plugin, trigger plugin hooks                   |
| Create Adapter Registry  | Track and allow swapping of adapters                    | Register, unregister, replace adapters                                   |
| Lifecycle Hook System    | Define async hook events                                | beforeInit, afterInit, beforeDestroy, afterDestroy                       |
| Unit Tests               | Test kernel, hooks, adapters, plugin manager            | Write tests for initialization, plugin registration, adapter replacement |

---

## 6️⃣ Best Practices

- **No direct dependencies:** Thuund Core must not import UI, Logic, or plugins directly.
- **Interfaces only:** Always use contracts to interact with adapters.
- **Asynchronous hooks:** Ensure all lifecycle events support async operations.
- **Clear boundaries:** Core should never implement business logic — that’s for adapters and plugins.
- **Version control alignment:** Each module (Kernel, Contracts, PluginManager) should map to a separate folder for easier monorepo management.

---

## 7️⃣ Notes on Integration

- CLI (`thuund-cli`) interacts with Thuund Core to **bootstrap projects**, **register adapters**, and **load plugins**.
- Adapters can be replaced dynamically via:

```yaml
createThuund({
  ui: CustomUIAdapter,
  logic: CustomLogicAdapter
});
```

- Future modules (e.g., database, cloud) should **interface through core contracts**, never bypass Thuund Core.

#
