# Adding a New Technology

This document describes the complete workflow for adding a new technology to the interview knowledge base.

Example: **Node.js**

---

# Overview

Every technology goes through the same pipeline.

```text
Original Content
        │
        ▼
Build Generated Data
        │
        ▼
Build Categories
        │
        ▼
Manual Category Review
        │
        ▼
Build Tag Dictionary
        │
        ▼
Manual Tag Review
        │
        ▼
Build Final Enriched Dataset
        │
        ▼
Frontend
```

---

# Step 1. Create the Original Dataset

Create the original bilingual interview dataset.

Directory:

```text
data/original/en/node.json
data/original/uk/node.json
```

File:

```text
node.json
```

Each question should contain:

- English question
- Ukrainian question
- English answer
- Ukrainian answer

No metadata is required at this stage.

---

# Step 2. Build the Generated Dataset

Run the **build-data** step.
```text
npm run build-data node
```

Input:

```text
data/original/en/node.json
data/original/uk/node.json
```

Output:

```text
data/generated/node.json
```

Each generated question should have the following structure:

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

At this stage:

- IDs are assigned.
- Difficulty is assigned.
- Categories are not assigned.
- Tags are empty.

---

# Step 3. Build the Category Dictionary

Run the **build-categories** step.

Input:

```text
data/generated/node.json
```

Output:

```text
data/categories/node.json
```

The result should contain the complete category taxonomy for the technology.

Example:

```json
[
  {
    "id": 1,
    "name": "Modules",
    "description": "Working with CommonJS and ES Modules."
  }
]
```

---

# Step 4. Review and Finalize Categories

Review the generated category dictionary manually.

Check for:

- duplicate categories;
- missing interview topics;
- clear category names;
- accurate descriptions;
- logical category structure.

Update the category dictionary until it is complete.

Once approved, the category dictionary becomes **frozen**.

It should not be modified during later steps.

---

# Step 5. Build the Tag Dictionary

Run the **build-tag-dictionaries** step.

Input:

```text
data/generated/node.json

data/categories/node.json
```

Output:

```text
data/tags/node.json
```

Example:

```json
[
  {
    "name": "Event Loop",
    "categoryId": 3
  },
  {
    "name": "Streams",
    "categoryId": 5
  }
]
```

The tag dictionary should contain reusable navigation tags.

---

# Step 6. Review and Finalize Tags

Review the generated tag dictionary manually.

Check for:

- duplicate tags;
- consistent naming;
- missing important interview topics;
- unnecessary or overly specific tags;
- correct category assignment.

Update the tag dictionary until it is complete.

Once approved, the tag dictionary becomes **frozen**.

It becomes the single source of truth for tag assignment.

---

# Step 7. Build the Final Enriched Dataset

Run the **build-enriched-knowledge-base** step.

Input:

```text
data/generated/node.json

data/categories/node.json

data/tags/node.json
```

Output:

```text
data/enriched/node.json
```

During this step every question receives:

- exactly one categoryId;
- one or more navigation tags.

Example:

```json
{
  "id": "node-024",

  "difficulty": "medium",

  "question": {
    "en": "...",
    "uk": "..."
  },

  "answer": {
    "en": "...",
    "uk": "..."
  },

  "categoryId": 5,

  "tags": [
    "Streams",
    "Backpressure"
  ]
}
```

---

# Step 8. Validate the Dataset

Before using the dataset in the frontend, verify that:

- every question has exactly one category;
- every categoryId exists in the category dictionary;
- every question has at least one tag;
- every assigned tag exists in the tag dictionary;
- there are no duplicate tags;
- there are no empty fields;
- the JSON is valid.

---

# Step 9. Add the Technology to the Frontend

Copy the final dataset:

```text
data/enriched/node.json
```

Update the frontend configuration:

- add the new technology to the technology list;
- register the route;
- include it in the search index;
- enable category navigation;
- enable tag navigation;
- update filters if necessary.

---

# Final Directory Structure

```text
data/
├── original/
│   ├── react.json
│   ├── javascript.json
│   ├── typescript.json
│   ├── next.json
│   └── node.json
│
├── generated/
│   ├── react.json
│   ├── javascript.json
│   ├── typescript.json
│   ├── next.json
│   └── node.json
│
├── categories/
│   ├── react.json
│   ├── javascript.json
│   ├── typescript.json
│   ├── next.json
│   └── node.json
│
├── tags/
│   ├── react.json
│   ├── javascript.json
│   ├── typescript.json
│   ├── next.json
│   └── node.json
│
└── enriched/
    ├── react.json
    ├── javascript.json
    ├── typescript.json
    ├── next.json
    └── node.json
```

---

# Summary

Adding a new technology always follows the same workflow:

1. Create the original bilingual dataset.
2. Build the generated dataset.
3. Build the category dictionary.
4. Review and finalize categories.
5. Build the tag dictionary.
6. Review and finalize tags.
7. Build the final enriched dataset.
8. Validate the output.
9. Connect the new technology to the frontend.

Once completed, the new technology is fully integrated into the interview knowledge base and is ready for use by the frontend.