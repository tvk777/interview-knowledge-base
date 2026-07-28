# Goal

Build the final enriched interview knowledge base for one technology.

This is the final step of the data pipeline.

Each interview question must be enriched with:

- exactly one categoryId
- a set of navigation tags

The output will be used directly by the frontend.

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
├── tags/
│   ├── react.json
│   ├── javascript.json
│   ├── typescript.json
│   └── next.json
│
└── enriched/
    ├── react.json
    ├── javascript.json
    ├── typescript.json
    └── next.json
```

---

# Input

Process one technology at a time.

Input files:

```
data/generated/<technology>.json

data/categories/<technology>.json

data/tags/<technology>.json
```

Each generated question has the following structure:

```json
{
  "id": "...",
  "difficulty": "...",

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

The category dictionary contains the approved category taxonomy.

The tag dictionary contains the approved navigation tags.

---

# Output

Generate:

```
data/enriched/<technology>.json
```

Each question must have the following structure:

```json
{
  "id": "...",

  "difficulty": "...",

  "question": {
    "en": "...",
    "uk": "..."
  },

  "answer": {
    "en": "...",
    "uk": "..."
  },

  "categoryId": 12,

  "tags": [
    "useEffect",
    "Dependency Array",
    "Lifecycle"
  ]
}
```

---

# Decision Process

For every question follow this order:

1. Determine the primary interview topic.
2. Assign the most specific matching category.
3. Select the most relevant navigation tags from the approved tag dictionary.
4. Ignore secondary concepts unless they represent significant interview topics.

---

# Category Assignment

Assign exactly one category to every question.

Use ONLY categories from the approved category dictionary.

Never:

- create new categories;
- rename categories;
- modify the category dictionary.

Choose the most specific category that best represents the primary interview topic.

Every question must receive exactly one valid categoryId.

---

# Tag Assignment

Assign navigation tags using ONLY the approved tag dictionary.

Never:

- create new tags;
- rename existing tags;
- modify the tag dictionary.

Every assigned tag must exist in the dictionary.

---

# Category and Tag Consistency

Assigned tags should naturally belong to the assigned category.

Example:

Category:

```
Hooks
```

Possible tags:

- useState
- useEffect
- useMemo
- useCallback
- useRef

Avoid assigning tags that primarily belong to another category unless the interview question genuinely covers multiple major topics.

---

# Selecting Tags

Choose tags that best describe the primary interview topics.

Usually assign:

- 2–5 tags

Sometimes:

- 1 tag for a very focused question;
- up to 6 tags for broader questions.

Every question must receive at least one tag.

Avoid assigning unnecessary tags.

Do not assign a tag simply because a concept is briefly mentioned.

Instead, ask yourself:

> If I wanted to find this interview question, which tags would I click?

Assign only tags that genuinely improve discoverability.

---

# Consistency

Questions discussing the same interview topic should receive:

- the same category;
- the same primary tags whenever appropriate.

Avoid arbitrary differences between similar questions.

---

# Tag Ordering

Order tags by importance.

The first tag should represent the primary interview topic.

Example:

```json
[
  "useEffect",
  "Dependency Array",
  "Lifecycle"
]
```

---

# Validation Rules

For every question:

- categoryId must not be null;
- categoryId must exist in the category dictionary;
- exactly one category must be assigned;
- tags must not be empty;
- every assigned tag must exist in the tag dictionary;
- duplicate tags are not allowed.

---

# Preserve Existing Data

Do NOT modify:

- id;
- difficulty;
- question;
- answer.

Only populate:

- categoryId;
- tags.

---

# Final Goal

The enriched dataset becomes the single source of truth used by the frontend.

Every interview question should have:

- one correct category;
- a small set of high-quality navigation tags;
- consistent metadata that makes the knowledge base easy to browse, filter, and search.

The output should be production-ready.