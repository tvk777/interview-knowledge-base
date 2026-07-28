Analyze all JSON files in the `data/original` directory and identify every unique `answerBlock` type used across the project.

Do not modify any project files.

Your task is to produce a report containing:

1. A list of all unique `answerBlock` types.
2. The number of occurrences of each type.
3. One representative JSON example for each type.
4. A brief explanation of the purpose of each block type based on its structure.
5. Any inconsistencies you find (missing properties, optional fields, different shapes for the same type, etc.).

At the end, provide a recommendation for implementing a generic

```ts
function answerBlocksToMarkdown(blocks: AnswerBlock[]): string
```

Specifically:

- which block types should be supported;
- whether a discriminated union is appropriate for the TypeScript types;
- any edge cases the implementation should handle.

Do not write any implementation code yet.
The goal of this task is only to analyze the existing data model and help design a robust converter.

result:
