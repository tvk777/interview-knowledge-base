# Adding a New Technology

This guide describes the complete workflow for adding a new technology to the interview knowledge base.

Example:

- Node.js
- Vue
- Angular
- Docker

The workflow consists of five steps.

```
Create original dataset
        ↓
Generate category dictionary
        ↓
Review categories
        ↓
Generate tag dictionary
        ↓
Review tags
        ↓
Generate final dataset
```

The canonical category definitions are stored in:

```
docs/categories.md
```

The final dataset will be written to:

```
data/enriched/<technology>.json
```

# Quick Start

Adding a new technology:

1. Create `data/original/<technology>.json`
2. Run `build-data`
3. Run `01-add-categories.md`
4. Review categories
5. Run `03-add-tags.md`
6. Review tags
7. Run `05-build-final-dataset.md`
8. Copy the generated dataset to the frontend.