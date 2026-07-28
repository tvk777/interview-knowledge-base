# Frontend Architecture

## Goal

Build a maintainable, scalable, and modular frontend.

The application should follow a feature-oriented architecture while keeping components reusable and easy to understand.

---

# Tech Stack

- Next.js (App Router)
- React
- TypeScript
- Tailwind CSS
- shadcn/ui

---

# Design Principles

The application should be:

- simple
- modular
- reusable
- predictable

Avoid unnecessary abstractions.

Prefer composition over inheritance.

---

# Folder Structure

The project does not use a `src` directory.

All application folders are located directly under the frontend root.

frontend/

    app/

    components/

        layout/

        header/

        sidebar/

        content/

        common/

    hooks/

    services/

    data/

    lib/

    types/

---

# Component Responsibilities

## Layout

Responsible only for page structure.

Contains:

- Header
- Sidebar
- Main Content

Should not contain business logic.

---

## Header

Responsible for:

- technology selector
- search input
- language selector

No question rendering.

---

## Sidebar

Responsible for:

- tag filters
- navigation

No search logic.

---

## Main Content

Responsible for:

- category rendering
- question rendering

Does not know where data comes from.

---

# Data Layer

UI components never import JSON directly.

All data access goes through services.

Example:

getQuestions()

getCategories()

getTags()

This allows replacing JSON with SQLite or an API later.

---

# State

Keep global state minimal.

Global state:

- selected technology
- search query
- selected tags
- language

Everything else should remain local.

---

# Rendering

Categories

↓

Questions

↓

Markdown

Every level should be an independent component.

---

# Styling

Use Tailwind utilities.

Use shadcn/ui components whenever possible.

Avoid custom CSS unless necessary.

---

# Performance

Prefer memoization only when needed.

Avoid unnecessary renders.

Avoid large prop drilling.

---

# Future Compatibility

Architecture should allow replacing

JSON

↓

SQLite

↓

REST API

↓

GraphQL

without rewriting UI components.

---

# Component Philosophy

The frontend should follow a clear separation of concerns.

## UI Components

UI components are responsible only for rendering.

They should not:

- load data
- perform business logic
- know where data comes from

---

## Services

Services are responsible for loading and transforming data.

Examples:

- getQuestions()
- getCategories()
- getTags()

---

## Hooks

Hooks contain reusable application logic.

Examples:

- filtering
- searching
- state synchronization

---

## Data

The application should never import JSON files directly inside UI components.

All data access must go through the data layer.

---

## Markdown

Markdown rendering should be isolated in dedicated components.

The rest of the application should treat answers as plain content.

---

## Reusability

Components should be small, reusable, and focused on a single responsibility.

Prefer composition over large, complex components.