# Kernel Context

> Thuund Framework  
> Last Updated: 2026-02-26

---

## Overview

The **Kernel Context** is the primary bridge between the orchestration kernel (`thuund-core`) and all external implementations, including adapters and plugins. It acts as a shared execution environment passed to modules during their initialization phase.

By using a Context, Thuund achieves **controlled extensibility** without allowing implementation details to leak into the kernel core.

---

## The Service Registry Pattern

In the Thuund architecture, the Context acts as a centralized directory for business logic.

- **Registration**: During the `init(context)` phase, the Logic Adapter instantiates concrete implementations and registers them with the context.
- **Discovery**: The UI Adapter and Plugins use the context to retrieve these services by their unique identifier (e.g., 'auth', 'api').
- **Abstraction**: The requester only knows the interface; the Context manages the specific instance provided by the active adapter.

---

## Interface Specification

The context follows the **Async-External rule**: all methods that interact with external state or modules return a `Promise`.

### Methods:

- **`getConfig()`**: Access project-wide configuration.
- **`getService<T>(name)`**: Retrieve a service by its unique identifier.
- **`registerService(name, service)`**: Register a concrete service implementation.
- **`getAdapter(type)`**: Directly access active adapters ('ui' | 'logic').
- **`emit(event, payload)`**: Hook into kernel-wide lifecycle events.

---

## Initialization Workflow

The Context is the "glue" during the `Kernel.start()` sequence:

1. **Kernel Creation**: The Kernel generates a fresh Context instance.
2. **Logic Registration**: `logicAdapter.init(context)` is called; it registers its services.
3. **Plugin Setup**: Feature plugins receive the context to register extra services or look up existing logic.
4. **UI Binding**: `uiAdapter.init(context)` is called last to bind UI components to the now-available services.

---

## Implementation Benefits

- **Late Binding**: Services are resolved dynamically at runtime, allowing for lazy-loading.
- **Strict Boundaries**: The Kernel remains implementation-agnostic because it only manages the Context container.
- **Mocking**: For unit testing, a "Mock Context" can be provided to simulate backend services.

---

## Summary

The Kernel Context facilitates communication between the kernel, adapters, and plugins while enforcing the primary rule: **Protect the kernel, control the contracts, and enable the ecosystem**.
