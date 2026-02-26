# Kernel

> Thuund Framework
> Last Updated: 2026-02-26

---

## Overview

The Kernel is the central orchestration engine of the Thuund Framework. It serves as the foundation for the entire system, managing the application lifecycle and maintaining strict boundaries between adapters and plugins.

Following the framework's core principles, the Kernel remains **implementation-agnostic**—it does not know about specific UI frameworks or backend runtimes, only the contracts they fulfill.

---

## Primary Responsibilities

Based on the current implementation in `@thuund/core`, the Kernel handles:

- **State Management**: Enforces a strict transition from `idle` to `running`. Configuration and registration are only permitted in the `idle` state to ensure runtime stability.
- **Adapter Orchestration**: Manages the `AdapterRegistry`, allowing for the injection and retrieval of the `UIAdapter` and `LogicAdapter`.
- **Plugin Management**: Orchestrates the loading and disposal of feature plugins.
- **Lifecycle Hooks**: Executes standard hooks (`beforeStart`, `afterStart`, `beforeStop`, `afterStop`) to allow external logic to react to the framework status.

---

## Initialization Workflow

The Kernel executes a sequential boot process to ensure that logic and services are ready before the UI is mounted.

1.  **Logic Initialization**: `logicAdapter.init()` is called first to prepare services and data handling.
2.  **Plugin Initialization**: Feature plugins are initialized. Currently, they receive the Kernel instance directly.
3.  **UI Initialization**: `uiAdapter.init()` is called after logic and plugins are ready.
4.  **UI Mount**: The kernel triggers the final `mount()` call to render the application.

---

## Technical Interface

The Kernel is configured via `KernelOptions` and managed through the following public API:

### Core Methods

- **`start()`**: Initiates the boot sequence. Prevents multiple instances from running simultaneously.
- **`stop()`**: Gracefully shuts down the application, disposing of plugins and unmounting adapters.
- **`registerPlugin(plugin)`**: Adds a feature plugin to the registry. Only available in the `idle` state.
- **`getAdapter(key)`**: Retrieves the active adapter implementation for either `ui` or `logic`.
- **`setAdapter(key, adapter)`**: Allows for late-binding of adapters before the kernel starts, facilitating the "Replaceable Implementation" principle.

---

## Future Evolution: The Kernel Context

In upcoming updates, the Kernel's `start()` sequence will evolve to instantiate a `KernelContext`. This context will replace the current practice of passing the Kernel instance or `null` to adapters/plugins, providing a secure bridge for service discovery and registration.

---

## Summary

The Kernel ensures that Thuund remains a cohesive fullstack system rather than a collection of loose libraries. By protecting the kernel and controlling the contracts, Thuund enables a scalable and stable ecosystem.
