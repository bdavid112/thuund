# Thuund Framework Architecture

> Thuund Framework
> Author: David Boros
> License: MIT
> Last Updated: 2026-02-14

---

## Overview

The Thuund Framework is a modular fullstack development system built around a kernel + adapters architecture. It prioritizes developer experience, automation, reusability, and long-term extensibility.

Thuund provides:

- A core orchestration kernel
- A plugin system for feature extensions
- Official default UI and logic implementations
- A controlled adapter mechanism that allows developers to replace UI or logic layers without modifying the core

The framework is opinionated by default but extensible by design.

---

## Architectural Model

```text
                                                 +----------------------+
                                                 |      User App / CLI  |
                                                 +----------+-----------+
                                                            |
                                                            v
                                                 +----------------------+
                                                 |      thuund-core     |
                                                 |   (Framework Kernel) |
                                                 +----+-----------+-----+
                                                      |           |
                                     -----------------+           +---------------
                                     |                                           |
                                     v                                           v
                             +--------------------+                   +--------------------+
                             |   Feature Plugins  |                   |   Adapter Layer    |
                             |   (thuund-plugins) |                   | (UI / Logic impl.) |
                             +--------------------+                   +----------+---------+
                                                                                  |
                                                                  ----------------+----------------
                                                                  |                               |
                                                                  v                               v
                                                           +--------------+                +-----------------+
                                                           |   thuund-ui  |                |   thuund-logic  |
                                                           | (default UI) |                | (default logic) |
                                                           +--------------+                +-----------------+
```

## Core Architectural Idea

At the center of Thuund is thuund-core, the framework kernel.

It defines:

- Core contracts (interfaces)
- Lifecycle management
- Plugin orchestration
- Adapter registration
- Dependency boundaries

It does NOT directly depend on any specific UI framework, runtime, or API layer.

UI and logic implementations are injected at initialization.

---

## Components

### thuund-core (Framework Kernel)

Role:
The central orchestration engine of the framework.

Responsibilities:

- Define core contracts (UI adapter, Logic adapter)
- Manage lifecycle hooks
- Load and initialize feature plugins
- Register default adapters
- Allow override of adapters at bootstrap

Dependencies:
None. Pure foundation module.

thuund-core depends only on abstractions — never concrete implementations.

---

### thuund-plugins (Feature Plugins)

Role:
Extend framework capabilities.

Responsibilities:

- Add features such as authentication, caching, analytics, etc.
- Hook into lifecycle events defined by thuund-core
- Register services, middleware, or integrations

Dependencies:
thuund-core

These are capability extensions — not architectural replacements.

---

### Adapter Layer (UI & Logic Contracts)

Thuund distinguishes between:

1. Feature plugins (add new functionality)
2. Capability adapters (define how something is implemented)

thuund-core defines contracts such as:

- UIAdapter
- LogicAdapter

Implementations of these contracts can be swapped without modifying core.

---

### thuund-ui (Official Default UI Implementation)

Role:
Stock UI adapter provided by the framework.

Responsibilities:

- Provide reusable frontend components
- Integrate with the configured logic adapter
- Implement the UIAdapter contract

Dependencies:
Implements contracts defined by thuund-core

This is the official default UI stack.
Developers may replace it with a custom implementation if desired.

---

### thuund-logic (Official Default Logic Implementation)

Role:
Stock logic adapter provided by the framework.

Responsibilities:

- Provide shared validation, API handling, utilities
- Implement backend helpers where applicable
- Implement the LogicAdapter contract

Dependencies:
Implements contracts defined by thuund-core

This is the official default logic layer but is fully replaceable.

---

### User App / CLI

Role:
Entry point for developers using Thuund.

Responsibilities:

- Scaffold new projects
- Generate boilerplate
- Configure default adapters
- Register plugins
- Initialize the application

By default, the CLI wires:

- thuund-ui as the UI adapter
- thuund-logic as the logic adapter

Developers may override this wiring during initialization.

Example conceptual bootstrap:

createThuund({
ui: CustomUIAdapter,
logic: CustomLogicAdapter
})

If no overrides are provided, the official stock implementations are used.

---

## Initialization Model

Thuund follows a default preset with override capability approach.

1. thuund-core defines adapter contracts.
2. Official implementations (thuund-ui, thuund-logic) satisfy those contracts.
3. The CLI registers default adapters.
4. Developers may override adapters at orchestration level.

This ensures:

- Strong conventions by default
- Controlled extensibility
- Clean dependency boundaries
- Long-term scalability

---

## Architectural Principles

### 1. Kernel-Based Design

thuund-core acts as a framework kernel that orchestrates all behavior through well-defined contracts.

### 2. Opinionated Defaults

Thuund ships with official UI and logic implementations to ensure consistency and optimal developer experience.

### 3. Controlled Extensibility

Developers may replace core capabilities (UI or logic) without modifying framework internals.

### 4. Clear Separation of Concerns

- Feature plugins extend functionality.
- Capability adapters define implementation strategies.
- The kernel remains implementation-agnostic.

### 5. Fullstack Symmetry

Frontend and backend concerns share architectural principles, enabling reusable patterns across the stack.

### 6. Automation First

The CLI is central to the ecosystem, handling scaffolding, configuration, and adapter wiring automatically.

---

## Architectural Positioning

### Thuund is:

- Not just a plugin framework
- Not just a UI toolkit
- Not just a backend system

### It is:

An opinionated fullstack framework built on a pluggable kernel architecture.

### This model provides:

- A cohesive default developer experience
- Long-term extensibility
- A foundation for a scalable ecosystem
