# Project Conventions

This document defines the conventions, architecture principles, and development standards for the Interview Knowledge Base project.

Its purpose is to keep the project simple, consistent, and maintainable as it evolves.

---

# Project Goals

The primary goals are:

- simplicity
- maintainability
- deterministic behavior
- readability
- fast local development

The project intentionally avoids unnecessary complexity.

---

# Core Principles

## KISS

Prefer the simplest solution that solves the problem.

Avoid unnecessary abstractions.

---

## YAGNI

Do not implement features that are not currently required.

Future requirements should not influence today's architecture.

---

## Data-driven Development

The dataset is the source of truth.

Implementation decisions should be based on actual data rather than assumptions.

Support only structures that exist in the dataset.

---

## Deterministic Processing

Every processing step must be deterministic.

The same input must always produce the same output.

Avoid hidden state and random behavior.

---

# Project Structure

```
project/

data/
    original/
    enriched/

docs/
    prompts/
    reports/
    reference/

scripts/

src/
```

## Responsibilities

### data/original

Source data.

Never edited automatically.

Always considered the source of truth.

---

### data/enriched

Generated data.

May be recreated at any time.

Should never be edited manually.

---

### scripts

Build utilities.

Examples:

- build-db
- merge
- validation

Scripts should be idempotent whenever possible.

---

### src

Frontend application.

Consumes only enriched data.

Should not depend on original datasets.

---

### docs/prompts

AI prompts used during development.

Version controlled.

---

### docs/reports

Generated reports, specifications, analyses and design documents.

---

### docs/reference

Permanent project documentation.

---

# Data Pipeline

```
Original JSON
        │
        ▼
Normalization
        │
        ▼
Markdown Conversion
        │
        ▼
AI Enrichment
        │
        ▼
Merge
        │
        ▼
Enriched JSON
        │
        ▼
React Application
```

Each stage has a single responsibility.

---

# Data Ownership

Original data owns:

- question
- answerBlocks
- difficulty

Generated data owns:

- translations
- tags
- subcategory

No generated process should overwrite original content.

---

# Markdown Renderer

Target output:

GitHub Flavored Markdown (GFM)

The renderer is responsible only for presentation.

It must never modify semantic content.

Rendering rules are defined in:

```
docs/reports/markdown-rendering-spec.md
```

---

# AI Responsibilities

AI performs semantic tasks only.

Examples:

- translation
- tag generation
- category inference

AI should not:

- restructure data
- modify original content
- change business logic

---

# TypeScript Guidelines

Prefer:

- interfaces
- explicit types
- readonly where appropriate
- pure functions

Avoid:

- any
- unnecessary generics
- deeply nested types

---

# Function Design

Functions should:

- do one thing
- have descriptive names
- be easy to test
- avoid side effects

Large functions should be split into smaller ones.

---

# File Organization

One responsibility per file whenever practical.

Example:

```
renderHeading.ts
renderParagraph.ts
renderCode.ts
renderTable.ts
renderInline.ts
renderBlock.ts
answerBlocksToMarkdown.ts
```

---

# Error Handling

The application should fail gracefully.

Malformed data should not crash processing.

Prefer:

- skipping invalid nodes
- preserving valid content
- continuing processing

---

# Documentation

Significant architectural decisions should be documented.

Whenever a design decision affects future development, update the relevant documentation.

---

# Dependencies

Prefer built-in platform capabilities.

Before adding a dependency, consider whether it can be implemented simply with existing APIs.

Avoid dependencies with narrow use cases.

---

# Performance

Readability is preferred over micro-optimizations.

Optimize only after identifying an actual bottleneck.

---

# Testing

Pure functions should be easy to test.

Critical processing logic should be deterministic.

Edge cases should be documented.

---

# Naming Conventions

Use descriptive names.

Prefer:

```
renderHeading
normalizeLanguage
mergeEnrichment
```

Avoid abbreviations unless universally understood.

---

# Code Review Checklist

Before merging changes, verify:

- KISS respected
- YAGNI respected
- deterministic behavior
- no duplicated logic
- documentation updated if needed
- no unnecessary dependencies
- follows existing conventions

---

# Future Changes

When introducing a new feature:

1. Verify the requirement exists.
2. Check whether the dataset supports it.
3. Update documentation if necessary.
4. Keep changes localized.
5. Preserve backward compatibility whenever practical.