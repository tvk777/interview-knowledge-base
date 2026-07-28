# Goal

Build a canonical navigation tag dictionary for one technology.

The purpose of the dictionary is **navigation**, not full-text search.

Users will use tags to quickly browse interview topics by clicking, without typing search queries.

The resulting dictionary will later be used by the **enrich-data** step to assign tags to questions.

The goal is to build a clean, intuitive navigation system that allows users to locate interview questions in only a few clicks.

---

# Project Structure

```
data/
├── generated/
│   ├── react.json
│   ├── javascript.json
│   ├── typescript.json
│   └── next.json
│
├── categories/
│   ├── react.json
│   ├── javascript.json
│   ├── typescript.json
│   └── next.json
│
└── tags/
    ├── react.json
    ├── javascript.json
    ├── typescript.json
    └── next.json
```

---

# Input

The script processes one technology at a time.

Input files:

```
data/generated/<technology>.json

data/categories/<technology>.json
```

Each generated question already contains:

- question (EN + UK)
- answer (EN + UK)
- categoryId

Categories are already finalized and must not be modified.

---

# Output

Generate one tag dictionary for the technology.

Save it to:

```
data/tags/<technology>.json
```

Example:

```json
[
  {
    "name": "useState",
    "categoryId": 12
  },
  {
    "name": "useEffect",
    "categoryId": 12
  },
  {
    "name": "Context",
    "categoryId": 12
  }
]
```

---

# Tag Structure

Each tag contains only:

```ts
{
    name: string;
    categoryId: number;
}
```

Do NOT generate:

- aliases
- descriptions
- synonyms
- questionCount
- metadata

---

# Navigation Model

The application supports two navigation modes.

## Mode 1

Technology

↓

Category

↓

Tags

↓

Questions

Example:

```
React
    ↓
Hooks
    ↓
useEffect
    ↓
Questions
```

## Mode 2

Technology

↓

All Tags

↓

Questions

Example:

```
React
    ↓
All Tags
    ↓
useEffect
    ↓
Questions
```

Therefore:

- every tag belongs to exactly one category;
- all tags of a technology can also be displayed as a flat list.

---

# Purpose of Tags

Tags are **navigation nodes**.

They are **not**:

- keywords
- search terms
- SEO phrases
- every concept mentioned in an answer

Users should think:

> "I want to find questions about useEffect"

↓

click

```
useEffect
```

↓

see all related interview questions.

---

# Coverage

Every interview topic should be discoverable through at least one tag.

However:

- a question does NOT require a unique tag;
- many questions should share the same tags;
- tags should group related interview questions.

The goal is **not** a one-to-one mapping between questions and tags.

---

# Tag Selection Rules

Generate only useful navigation tags.

A tag should represent a concept that developers naturally think about when browsing interview topics.

Good examples:

- Closure
- Scope
- Hoisting
- Event Loop
- Promise
- async/await
- Promise.all
- Promise.race
- Microtasks
- Macrotasks
- useState
- useEffect
- useMemo
- useCallback
- Context
- Redux Toolkit
- React.memo
- Virtual DOM
- Reconciliation
- Suspense
- Hydration

Avoid overly generic tags such as:

- JavaScript
- React
- TypeScript
- Next.js
- Programming
- Code
- Browser
- Application

unless they are genuine interview topics.

---

# Granularity

Prefer tags that represent interview topics rather than implementation details.

Good:

- Event Loop
- Closure
- Dependency Array
- React.memo
- useEffect
- Hydration

Avoid creating tags for minor implementation details that are unlikely to be searched independently.

---

# Quality over Quantity

Do NOT extract every possible concept.

Before creating a tag, ask:

> "Would a developer intentionally click this tag to find interview questions?"

If the answer is probably not, do not create the tag.

Prefer one strong navigation tag over several similar ones.

---

# Dictionary Size

The dictionary should remain compact.

Target size:

- approximately **80–100 navigation tags** per technology.

This is a guideline, not a strict limit.

Include enough tags to cover all important interview topics, but avoid creating tags for every minor concept mentioned in the answers.

---

# Category Assignment

Every tag belongs to exactly one category.

Example:

Hooks

- useState
- useEffect
- useMemo
- useCallback
- useRef

Async Programming

- Promise
- async/await
- Promise.all
- Promise.race
- Promise.any

Rendering

- Virtual DOM
- Reconciliation
- Hydration
- SSR

---

# Naming Rules

Use the canonical industry term.

Examples:

✅ Promise

❌ Promises

✅ Closure

❌ Closures

✅ async/await

❌ Async Await

Use consistent capitalization.

---

# Remove Duplicates

The dictionary must not contain duplicate concepts.

If multiple questions reference the same concept, create only one tag.

---

# Important

This step only generates tag dictionaries.

Do NOT modify:

- generated data
- category dictionaries
- questions
- answers

The only output of this step is:

```
data/tags/<technology>.json
```

---

# Final Goal

The resulting dictionary should feel like the table of contents of a technical interview handbook rather than a list of extracted keywords.

A developer should be able to browse the dictionary and immediately recognize the major interview topics.

The dictionary should optimize for:

- fast navigation;
- clarity;
- discoverability;
- consistency;
- reusability during the enrich-data step.