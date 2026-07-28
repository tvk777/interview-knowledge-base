# Goal

Refactor the `build-data.ts` script to support bilingual source datasets.

The current implementation reads only the English source file.

The new implementation must:

- read both English and Ukrainian source files;
- validate dataset integrity;
- merge questions by `id`;
- normalize question text;
- convert `answerBlocks` to Markdown;
- generate a single normalized output file.

This script is a deterministic build step.

Do not use AI.

---

# Current Directory Structure

```
data/
├── original/
│   ├── en/
│   │   ├── javascript.json
│   │   ├── react.json
│   │   ├── typescript.json
│   │   └── next.json
│   │
│   └── uk/
│       ├── javascript.json
│       ├── react.json
│       ├── typescript.json
│       └── next.json
│
├── generated/
│   ├── javascript.json
│   ├── react.json
│   ├── typescript.json
│   └── nextjs.json
```

---

# CLI

The script receives one command line argument:

```
npm run build-data javascript
```

Supported technologies:

- javascript
- react
- typescript
- nextjs

Keep the existing `SOURCE_FILE_OVERRIDES` mechanism (`nextjs -> next.json`).

---

# Source Data

English and Ukrainian source files have identical structure.

```ts
interface SourceQuestion {
    id: string;
    difficulty: string;
    question: string;
    answerBlocks: AnswerBlock[];
}
```

The `id` value is identical in both language versions.

---

# Responsibilities

The script must:

1. Read the English source file.
2. Read the Ukrainian source file.
3. Validate both datasets.
4. Match questions by `id`.
5. Normalize question text.
6. Convert `answerBlocks` to Markdown for both languages.
7. Generate a normalized output file.

---

# Question Normalization

Normalize the question text before generating the output.

Remove the leading question number from both English and Ukrainian questions.

Examples:

```
1. What is JavaScript?
```

↓

```
What is JavaScript?
```

```
25. Explain React Context.
```

↓

```
Explain React Context.
```

```
1. Що таке TypeScript?
```

↓

```
Що таке TypeScript?
```

```
102. Поясніть Event Loop.
```

↓

```
Поясніть Event Loop.
```

Rules:

- remove only the leading numeric prefix
- remove the following period and whitespace
- preserve the remaining text exactly
- do not modify numbers that are part of the actual question
- apply the normalization to both English and Ukrainian questions

Implement this as a reusable helper function.

Example:

```ts
normalizeQuestion(question: string): string
```

---

# Validation

Before generating output, validate:

## Files

- both source files exist

## JSON

- both files contain valid JSON
- both files contain arrays

## Dataset

- same number of questions
- every English id exists in Ukrainian
- every Ukrainian id exists in English
- no duplicate ids
- every question has an id

If validation fails:

- throw a descriptive Error
- stop execution
- do not generate the output file

Examples:

```
Missing Ukrainian translation for question:

id: 9dc75baa-d1eb-4a38-9aff-ef96a179af35
```

```
Duplicate question id:

e639f68e-a8d8-4ad6-9ba4-c838d9e0e21a
```

---

# Generated Structure

Replace the current output structure with:

```ts
interface GeneratedQuestion {
    id: string;

    difficulty: string;

    question: {
        en: string;
        uk: string;
    };

    answer: {
        en: string;
        uk: string;
    };

    categoryId: null;

    tags: string[];
}
```

Requirements:

- preserve `id`
- preserve `difficulty`
- initialize

```ts
categoryId: null
```

- initialize

```ts
tags: []
```

---

# Example Output

```json
{
  "id": "e639f68e-a8d8-4ad6-9ba4-c838d9e0e21a",

  "difficulty": "medium",

  "question": {
    "en": "What is JavaScript?",
    "uk": "Що таке JavaScript?"
  },

  "answer": {
    "en": "#### JavaScript description...",
    "uk": "#### Опис JavaScript..."
  },

  "categoryId": null,

  "tags": []
}
```

---

# Refactoring

While implementing the new functionality, improve the overall structure of the script.

Separate responsibilities into small reusable functions where appropriate.

For example:

- `readSourceQuestions()`
- `validateQuestions()`
- `buildQuestionMap()`
- `mergeQuestions()`
- `normalizeQuestion()`
- `transformQuestion()`

Avoid duplicated logic.

Keep the implementation simple, readable and maintainable.

---

# Keep Unchanged

Do not modify:

- `answerBlocksToMarkdown()`
- the CLI interface
- supported technologies
- `SOURCE_FILE_OVERRIDES`
- output file names
- overall project structure

Only refactor the implementation to support bilingual input, question normalization and the new output format.