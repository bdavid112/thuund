# Thuund CLI Documentation

> Thuund Framework  
> Author: David Boros  
> License: MIT  
> Last Updated: 2026-02-14

---

## Overview

The Thuund CLI is the primary developer interface for projects built with the Thuund Framework.

It is responsible for:

- Project scaffolding
- Adapter wiring (UI & Logic)
- Plugin management
- Code generation
- Development workflows
- Automation and diagnostics

The CLI follows the same philosophy as the framework itself:

Opinionated by default — extensible by design.

By default, the CLI wires:

- `thuund-ui` as the UI adapter
- `thuund-logic` as the Logic adapter

Developers can override these at initialization or later via configuration.

---

## Architectural Role of the CLI

The CLI acts as the orchestration layer for:

- `thuund-core` (framework kernel)
- Feature plugins
- Adapter registration
- Project configuration

Conceptually:

```mermaid
flowchart TD
    A[Thuund CLI] --> B[thuund-core]
    B --> C[Feature Plugins]
    B --> D[Adapter Contracts]
    D --> E[thuund-ui (default)]
    D --> F[thuund-logic (default)]
```

The CLI determines which adapters are bound to the kernel during project setup.

---

# Core Commands

---

## 1. Project Initialization

### `thuund init <project-name>`

Creates a new Thuund project with the official default stack.

By default this wires:

- thuund-ui
- thuund-logic

Example:

```bash
thuund init my-app
```

You may optionally specify adapters:

```bash
thuund init my-app --ui custom-ui --logic graphql-logic
```

If no adapters are specified, the official stock implementations are used.

---

### `thuund template <template-name>`

Generates a project from a pre-configured template.

Templates may define:

- Preset plugin configurations
- Custom adapter bindings
- Example modules
- Architecture presets

Example:

```bash
thuund template ecommerce
```

Templates can target use cases such as:

- E-commerce
- Admin dashboard
- SaaS starter
- API-only backend

---

## 2. Adapter Management

Thuund distinguishes between:

- Feature plugins (extend capabilities)
- Capability adapters (define UI/Logic implementation)

### `thuund adapters list`

Lists currently available adapters.

### `thuund adapters set-ui <adapter-name>`

Rebinds the UI adapter.

Example:

```bash
thuund adapters set-ui react-ui
```

### `thuund adapters set-logic <adapter-name>`

Rebinds the logic adapter.

Example:

```bash
thuund adapters set-logic graphql-logic
```

Changing adapters updates project configuration but does not modify `thuund-core`.

---

## 3. Plugin Management

### `thuund add-plugin <plugin-name>`

Adds a feature plugin and updates project configuration.

Example:

```bash
thuund add-plugin auth
```

### `thuund remove-plugin <plugin-name>`

Removes a plugin and cleans up its configuration.

### `thuund plugins list`

Lists installed and active plugins.

Feature plugins extend functionality but do not replace architectural capabilities.

---

## 4. Code Generation

The `generate` family of commands automates repetitive development tasks.

### `thuund generate ui <component-name>`

Generates a UI component compatible with the current UI adapter.

Example:

```bash
thuund generate ui Header
```

### `thuund generate page <page-name>`

Generates a frontend page with routing and placeholder logic.

### `thuund generate route <route-name>`

Generates a backend API route skeleton compatible with the current logic adapter.

### `thuund generate service <service-name>`

Generates a reusable logic/service module.

### `thuund generate plugin <plugin-name>`

Scaffolds a new feature plugin compatible with `thuund-core`.

---

## 5. Development & Build

### `thuund dev`

Starts development environment.

- Boots thuund-core
- Loads configured plugins
- Binds configured adapters
- Starts frontend and backend dev servers

### `thuund build`

Builds the project for production.

- Compiles UI layer
- Compiles logic layer
- Produces distributable artifacts

### `thuund test`

Runs all tests across modules, adapters, and plugins.

### `thuund lint`

Runs linting across the entire project.

---

## 6. Configuration

### `thuund config`

Displays or edits project configuration.

Example:

```bash
thuund config list
thuund config set ui react-ui
thuund config enable plugin-analytics
```

Configuration controls:

- Active adapters
- Enabled plugins
- Runtime options
- Environment presets

---

## 7. Utilities

### `thuund doctor`

Diagnoses:

- Missing dependencies
- Adapter mismatch
- Plugin conflicts
- Configuration errors

### `thuund update`

Updates:

- Thuund CLI
- thuund-core
- Official adapters
- Plugins (when compatible)

---

# Design Philosophy of the CLI

The CLI enforces several principles:

1. Kernel Integrity  
   thuund-core remains implementation-agnostic.

2. Default Stability  
   Official adapters are wired automatically.

3. Controlled Flexibility  
   Developers can replace UI or Logic at the orchestration level.

4. Automation First  
   Code generation and scaffolding reduce manual setup.

5. Ecosystem Ready  
   Third-party adapters and plugins can integrate cleanly.

---

# Future Extensions

Potential future additions:

- Versioning workflows
- Package publishing
- Database schema tools
- Storybook integration
- Adapter marketplace
- Plugin validation system

---

# Summary

The Thuund CLI is not just a project generator.

It is the orchestration tool that binds:

- The framework kernel
- Feature plugins
- Capability adapters
- Project configuration

Together, these form a cohesive but extensible fullstack development system.
