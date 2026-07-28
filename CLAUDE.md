# CLAUDE.md

# Project Overview

This project is a React-based interview knowledge base.

The source content consists of structured AnswerBlocks that are transformed into enriched JSON files consumed by the frontend.

The project prioritizes simplicity, maintainability, and deterministic behavior over feature richness.

---

# Core Principles

Follow these principles at all times.

## KISS

Keep implementations as simple as possible.

Avoid unnecessary abstractions.

## YAGNI

Do not implement features that are not currently required.

Do not speculate about future requirements.

## Data-driven decisions

All implementation decisions must be based on the actual dataset.

Never invent support for structures that do not exist.

## Deterministic output

The same input must always produce identical output.

Avoid randomness.

---

# Coding Guidelines

Prefer:

- TypeScript
- Pure functions
- Small focused modules
- Single Responsibility Principle
- Explicit code over clever code
- Readability over micro-optimizations

Avoid:

- Overengineering
- Premature optimization
- Complex inheritance
- Unnecessary abstractions
- Hidden side effects

---

# Error Handling

The application should be resilient.

Malformed input should never crash the renderer.

Whenever possible:

- ignore invalid data
- continue rendering
- preserve valid content

Throw exceptions only when execution cannot continue.

---

# Project Structure

Do not change the existing folder structure unless explicitly requested.

Current important directories:

```
data/
docs/
scripts/
src/
```

Source data inside `data/original` is considered the source of truth.

Generated files belong in `data/enriched`.

---

# Markdown Rendering

Target format:

GitHub Flavored Markdown (GFM)

Renderer output should be:

- clean
- readable
- deterministic

Renderer behavior must follow the Markdown Rendering Specification.

Do not introduce rendering rules that are not documented.

---

# AI Enrichment

AI is responsible only for semantic enrichment.

Examples:

- translation
- tags
- subcategory generation

Program logic must remain deterministic.

Do not move business logic into AI.

---

# Documentation

When making architectural or design decisions:

- document assumptions
- explain trade-offs
- prefer concise documentation

If a new design decision affects future development, suggest updating the relevant documentation.

---

# When Implementing Features

Before writing code:

1. Understand the existing architecture.
2. Reuse existing code when appropriate.
3. Follow existing conventions.
4. Keep changes minimal.

If the task is ambiguous:

- identify assumptions
- ask for clarification when necessary
- do not invent requirements.

---

# Code Quality

Generated code should be production-quality.

Prioritize:

- readability
- maintainability
- consistency
- predictable behavior

Avoid unnecessary dependencies whenever possible.

---

# Communication

When explaining design decisions:

- explain the reasoning
- mention trade-offs
- identify potential edge cases

Keep explanations concise and practical.