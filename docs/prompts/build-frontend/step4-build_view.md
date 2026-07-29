# Step 4 — Build Knowledge Base View

Before making any changes, read:

- docs/frontend-design.md
- docs/frontend-architecture.md
- docs/user-flow.md
- docs/roadmap.md

The implementation roadmap is the source of truth.

----------------------------------------------------
Goal
----------------------------------------------------

Build the first functional Knowledge Base view using the real generated data.

This step connects the existing layout with the data layer and renders the application content.

----------------------------------------------------
Requirements
----------------------------------------------------

Use the existing `knowledge-base.ts` service.

Do not access the generated JSON directly from UI components.

The page should render:

- Categories
- Questions

using the real data returned by the service.

----------------------------------------------------
Implementation Guidelines
----------------------------------------------------

- Keep data loading in Server Components.
- Keep UI components presentational.
- Pass data through props.
- Do not introduce client-side data fetching.
- Do not introduce Context.
- Do not introduce React hooks unless they are clearly required.
- Do not implement search.
- Do not implement tag filtering.
- Do not implement language switching.
- Do not render Markdown yet.
- Keep the implementation simple.

----------------------------------------------------
UI Scope
----------------------------------------------------

Implement the main content area only.

Render:

Category

    Question

for every category returned by the service.

The answer content should not be rendered yet.

Question items may simply display the localized question text.

Existing placeholder components (SearchBar, TechnologyTabs, TagList, LanguageSwitcher) should remain unchanged.

----------------------------------------------------
Architecture
----------------------------------------------------

The responsibility split should remain clear:

Server Component

↓

knowledge-base service

↓

Presentational components

No business logic should move into UI components.

----------------------------------------------------
Before Writing Code
----------------------------------------------------

First explain:

- which components will be created or updated
- where data loading will occur
- how categories and questions will be composed
- any architectural decisions

Wait for approval before generating code.

----------------------------------------------------
After Implementation
----------------------------------------------------

Provide:

- summary
- created/updated files
- architectural decisions
- confirmation that:

  - TypeScript passes
  - ESLint passes
  - Build succeeds

Do not continue with the next implementation step.

After analysis:

The proposed architecture looks good.

Approved with one adjustment:

Instead of rendering static category/question blocks, consider using the existing Accordion components already in this step.

Only the question title needs to be rendered for now. The answer content should remain empty until the Markdown Rendering step.

This allows the component structure to match its naming (`CategoryAccordion`, `QuestionAccordion`) and avoids unnecessary refactoring later.

Everything else is approved.