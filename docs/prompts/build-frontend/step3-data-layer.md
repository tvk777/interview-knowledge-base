# Step 3 — Data Layer

Before making any changes, read:

- docs/frontend-design.md
- docs/frontend-architecture.md
- docs/user-flow.md
- docs/roadmap.md

The implementation roadmap is the source of truth.

----------------------------------------------------
Goal
----------------------------------------------------

Implement the application's data access layer.

The data layer should become the single source of data for the frontend.

UI components must never import JSON files directly.

----------------------------------------------------
Requirements
----------------------------------------------------

Create the `frontend/services` directory.

Design a clean and minimal API for accessing the generated knowledge base.

At minimum provide functions for:

- getQuestions()
- getCategories()
- getTags()

These functions should use the shared TypeScript contracts created in Step 2.

----------------------------------------------------
Implementation Guidelines
----------------------------------------------------

- Use the real generated JSON files.
- Keep the service layer independent from the UI.
- Do not introduce React hooks.
- Do not introduce Context.
- Do not introduce caching.
- Do not introduce state management.
- Do not implement filtering or search.
- Do not implement asynchronous loading unless there is a clear architectural reason.

Keep the implementation as simple as possible while providing a clean API for future UI components.

----------------------------------------------------
Before Writing Code
----------------------------------------------------

First explain:

- proposed folder structure
- public service API
- how JSON files will be loaded
- whether the API should be synchronous or asynchronous
- any assumptions or architectural decisions

Wait for approval before generating code.

----------------------------------------------------
After Implementation
----------------------------------------------------

Provide:

- summary
- created files
- architectural decisions
- confirmation that:
  - TypeScript passes
  - ESLint passes
  - Build succeeds

Do not continue with the next implementation step.

After analysis:

The analysis looks good.

Approved with the following adjustments:

1. Do not duplicate the generated JSON inside `frontend/data`.

The generated data at the repository root remains the single source of truth. We'll decide on the best consumption strategy without introducing two copies of the same data.

2. Keep the service API asynchronous.

3. Add `getTechnologies()`.

4. Unknown technology slugs should fail fast with a clear error instead of silently returning an empty array.

5. Implement a single `knowledge-base.ts` service exposing:

- getQuestions()
- getCategories()
- getTags()
- getTechnologies()

These functions belong to the same domain and should share a common service. If this service becomes too large in the future, it can be split into a `knowledge-base/` directory without changing the public API.