Create JSON configuration files for the interview question categories based on the canonical specification in:

docs/categories.md

## Output directory

Create:

data/categories/
    react.json
    javascript.json
    typescript.json
    nextjs.json

## JSON format

Each file must contain an array of category objects.

Example:

```json
[
  {
    "id": 1,
    "name": "Fundamentals",
    "description": "Core React concepts, virtual DOM, rendering model, React philosophy, advantages, limitations, and comparisons with other frameworks."
  },
  {
    "id": 2,
    "name": "JSX",
    "description": "JSX syntax, expressions, rendering rules, fragments, conditional rendering, lists, keys, and JSX-specific behavior."
  }
]
```

## Requirements

- Read category names and descriptions from `docs/categories.md`.
- Preserve the exact wording of names and descriptions.
- Assign sequential numeric IDs starting from 1.
- IDs must be unique within each technology.
- Keep the order exactly the same as in `categories.md`.
- Include the `Other` category as the last item.
- Do not add, remove or rename any categories.
- Do not invent descriptions.
- Output valid, pretty-formatted JSON (2-space indentation).
- Save one file per technology.

## Validation

After generating the files, verify:

- Every category from `categories.md` exists exactly once.
- IDs are sequential.
- JSON is valid.
- The number of categories in each JSON file matches the Markdown document.

Do not modify `docs/categories.md`.

Only create the JSON configuration files.