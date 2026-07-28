# Interview Knowledge Base Pipeline

Version: 1.0
Status: Stable

This document describes the data preparation pipeline for the interview knowledge base.

The pipeline converts the original interview questions into the final enriched dataset used by the application.

---

# Directory Structure

```
data/
├── original/
│   ├── en/
│   └── uk/
│
├── generated/
│
├── enriched/
│
├── categories/
│
└── tags/

docs/
    categories.md

reports/
```

---

# Pipeline Overview

```
original (EN + UK)
        │
        ▼
build-data
        │
        ▼
generated
        │
        ▼
build-categories
        │
        ▼
manual review
        │
        ▼
freeze categories
        │
        ▼
build-tag-dictionaries
        │
        ▼
manual review
        │
        ▼
freeze tag dictionaries
        │
        ▼
enrich-data
        │
        ▼
enriched
        │
        ▼
frontend
```

---

# Step 1 — build-data

## Input

```
data/original/en/
data/original/uk/
```

## Responsibilities

- validate both language datasets
- ensure every English question has a Ukrainian equivalent
- ensure every Ukrainian question has an English equivalent
- merge questions by `id`
- convert `answerBlocks` into Markdown
- preserve `difficulty`
- generate the normalized dataset

## Validation

- identical number of questions
- no missing ids
- no duplicate ids
- matching ids between languages

## Output

```
data/generated/
```

Example structure:

```json
{
  "id": "...",

  "difficulty": "medium",

  "question": {
    "en": "...",
    "uk": "..."
  },

  "answer": {
    "en": "...",
    "uk": "..."
  },

  "categoryId": null,

  "tags": []
}
```

---

# Step 2 — build-categories

## Input

```
data/generated/
```

## Responsibilities

- analyze all interview questions
- design a canonical category taxonomy
- assign a unique numeric id to every category
- create category descriptions
- ensure categories are technology-independent whenever possible

## Output

```
data/categories/categories.json

docs/categories.md
```

---

# Step 3 — Manual Review

Review the generated categories.

Verify:

- category names
- descriptions
- hierarchy
- duplicates
- missing categories

---

# Step 4 — Freeze Categories

After review, categories become immutable.

All following pipeline steps must use only the approved categories.

---

# Step 5 — build-tag-dictionaries

## Input

```
data/generated/

data/categories/categories.json
```

## Responsibilities

- analyze every question and answer
- extract technical concepts
- build canonical tag dictionaries
- normalize terminology
- create aliases
- use approved categories as additional context

## Output

```
data/tags/

reports/tag-dictionary-report.md
```

---

# Step 6 — Manual Review

Review every tag dictionary.

Verify:

- canonical names
- aliases
- duplicates
- missing concepts
- normalization quality

---

# Step 7 — Freeze Tag Dictionaries

After review, tag dictionaries become immutable.

The enrichment step may only use tags from these dictionaries.

---

# Step 8 — enrich-data

## Input

```
data/generated/

data/categories/categories.json

data/tags/
```

## Responsibilities

For every question:

- assign one categoryId
- assign canonical tags

No translations are performed.

Question and answer content must remain unchanged.

## Output

```
data/enriched/
```

---

# Final Dataset

Example:

```json
{
  "id": "...",

  "difficulty": "medium",

  "question": {
    "en": "...",
    "uk": "..."
  },

  "answer": {
    "en": "...",
    "uk": "..."
  },

  "categoryId": 7,

  "tags": [
    "closures",
    "lexical scope",
    "scope"
  ]
}
```

---

# Design Principles

- Original data is never modified.
- Every pipeline step has a single responsibility.
- AI is used only where semantic understanding is required.
- Categories and tag dictionaries are manually reviewed before use.
- The final dataset is deterministic and reproducible.
- Every stage produces artifacts that can be regenerated independently.