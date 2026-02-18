# Thuund Framework - Adapters Documentation

> Thuund Framework  
> Author: David Boros
> License: MIT  
> Last Updated: 2026-02-18

---

## Overview

Adapters are the capability implementations of the Thuund Framework. While thuund-core defines the contracts, adapters define the execution. By separating the kernel from the implementation, Thuund allows developers to swap UI or Logic stacks without modifying core orchestration.

---

## The Adapter Interface Strategy

To preserve controlled extensibility, Thuund adapters adhere to a Lifecycle and Registry contract. This ensures the kernel remains implementation-agnostic.

### Core Adapter Lifecycle

Every adapter must satisfy base lifecycle hooks managed by the kernel:

1. init(config): The setup phase where the adapter prepares internal state.
2. mount(target): (UI specific) When the adapter takes control of the host environment.
3. unmount(): Cleanup phase to prevent memory leaks.
4. dispose(): Final teardown hook.

---

## 1. UI Adapters

The UI Adapter provides the stock UI layer and theming.

### The getComponent Registry

Thuund uses a Registry Pattern. The kernel asks for a component by name, and the adapter returns its implementation.

- Interface Example:

```ts
interface UIAdapter {
  init: (config: ThuundConfig) => Promise<void>
  mount: (rootElement: HTMLElement) => void
  unmount: () => void
  getComponent: (name: string) => any
}
```

### Official Implementation: thuund-ui

- Default Stack: React, Vite, TypeScript.
- Responsibility: Provides official components (Buttons, Modals, Tables) and handles the rendering loop.

---

## 2. Logic Adapters

The Logic Adapter provides shared validation, API handling, and backend utilities.

### Service Management

Logic adapters provide "Services" that plugins or UI components can consume.

- Interface Example:
  interface LogicAdapter {
  init: (config: ThuundConfig) => Promise<void>;
  registerService: (name: string, service: any) => void;
  getService: (name: string) => any;
  }

### Official Implementation: thuund-logic

- Default Stack: Fastify, Prisma, PostgreSQL.
- Responsibility: Implements shared authentication helpers and API utilities.

---

## Adapter vs. Plugin

| Aspect       | Adapter                          | Plugin        |
| :----------- | :------------------------------- | :------------ |
| Role         | Foundation Layer                 | Feature Layer |
| Requirement  | Required                         | Optional      |
| Swappability | Replaces contract implementation | Adds behavior |

---

## Orchestration Flow

1. Configuration: CLI identifies active adapters.
2. Initialization: thuund-core calls .init() on Logic then UI.
3. Bridge: UI uses getService() from Logic to bind data.
4. Runtime: Application mounts and kernel manages lifecycle.

---

## Summary

Adapters allow Thuund to remain stable at the core but infinite at the edges.
