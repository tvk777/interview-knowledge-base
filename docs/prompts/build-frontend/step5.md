# Step 5 — Complete Knowledge Base UI

Before making any changes, read:

- docs/frontend-design.md
- docs/frontend-architecture.md
- docs/user-flow.md
- docs/roadmap.md
- docs/ui-notes.md (if present)

The implementation roadmap is the source of truth.

----------------------------------------------------
Goal
----------------------------------------------------

Complete the Knowledge Base user interface by rendering answer content and refining the user experience.

This step should produce the first polished MVP of the Knowledge Base.

----------------------------------------------------
Requirements
----------------------------------------------------

Use the existing architecture.

Do not modify the data layer.

Continue using the existing knowledge-base service.

Do not introduce client-side data fetching.

----------------------------------------------------
Markdown Rendering
----------------------------------------------------

The answers are already stored as Markdown strings.

Render the answer content inside QuestionAccordion.

Choose the Markdown library you consider most appropriate for this project.

Support at least:

- headings
- paragraphs
- bullet lists
- numbered lists
- inline code
- fenced code blocks
- blockquotes
- tables
- links

Markdown rendering must be encapsulated in a dedicated reusable component.

QuestionAccordion should not contain Markdown rendering logic directly.

----------------------------------------------------
Accordion Behavior
----------------------------------------------------

Improve the accordion behavior.

Requirements:

- Only one category may be expanded at any time.
- Only one question may be expanded at any time.
- Categories remain collapsible.
- Questions remain collapsible.

----------------------------------------------------
Visual Hierarchy
----------------------------------------------------

Improve the visual distinction between categories and questions.

Category headings should immediately stand out from question items.

Use typography, spacing, indentation, borders, backgrounds, or other appropriate visual techniques consistent with the existing design system.

The hierarchy should be obvious at first glance while keeping the interface clean and uncluttered.

----------------------------------------------------
Scope
----------------------------------------------------

Implement only:

- Markdown rendering
- Accordion behavior improvements
- Visual hierarchy improvements

Do not implement:

- Search
- Tag filtering
- Technology switching
- Language switching
- Loading states
- Empty states
- Syntax highlighting
- Copy code button

----------------------------------------------------
Architecture
----------------------------------------------------

Maintain the existing separation of responsibilities.

- Data access remains in the service layer.
- Server Components load data.
- Presentational components render UI.
- Markdown rendering is isolated in its own reusable component.

Avoid unnecessary abstractions.

Keep the solution simple and maintainable.

----------------------------------------------------
Before Writing Code
----------------------------------------------------

First explain:

- which Markdown library you recommend and why
- which components will be created or updated
- where the Markdown component will live
- how Markdown rendering will be encapsulated
- how the accordion behavior will change
- how you plan to improve the visual hierarchy

Wait for approval before generating code.

----------------------------------------------------
After Implementation
----------------------------------------------------

Provide:

- summary
- created and updated files
- architectural decisions
- explanation of the Markdown rendering approach
- confirmation that:

  - TypeScript passes
  - ESLint passes
  - Build succeeds

Do not continue with the next implementation step.

The proposal looks good.

Approved.

A couple of implementation preferences:

- Keep the Markdown component completely generic and reusable. It should accept only a Markdown string and remain independent from any domain-specific types.
- Prefer relying on Tailwind Typography for the initial Markdown styling. Avoid custom Markdown element renderers unless they are actually needed.
- Feel free to refine the visual hierarchy during implementation if you find a cleaner solution than the initial typography proposal.

Everything else is approved.