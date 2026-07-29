# Step 6 — Search Infrastructure

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

Design and implement the search infrastructure for the Knowledge Base.

The implementation should establish a clean, extensible architecture that future filtering features can reuse without significant refactoring.

Keep the solution simple, maintainable, and appropriate for the current project size.

----------------------------------------------------
Requirements
----------------------------------------------------

Implement a client-side search that works with the already loaded data.

The search must support matching:

- question titles
- answer content

Searching must be:

- case-insensitive
- whitespace tolerant
- updated immediately while typing

No search button.

----------------------------------------------------
Search Results
----------------------------------------------------

When the search query is empty, display the normal Knowledge Base grouped by categories.

When the user enters a search query, replace the category view with a flat list of matching questions.

Do not display categories while searching.

Each search result should be rendered using the existing QuestionAccordion component.

A question matches when the search query is found in either:

- the question title
- the answer content

Display the total number of matching questions.

Example:

Search Results (14)

----------------------------------------------------
Search Reset
----------------------------------------------------

The search should be easy to clear.

When the search input contains text, display a clear ("×") button inside the search field.

Clicking the clear button should:

- clear the search query
- remove the search results
- restore the default category-based Knowledge Base view

The same behavior should occur automatically when the search input becomes empty.

----------------------------------------------------
Empty State
----------------------------------------------------

If no questions match the search query, display a clean empty state.

Example:

No results found.

Try another keyword.

----------------------------------------------------
Architecture
----------------------------------------------------

Preserve the existing architecture.

- Server Components continue loading the data.
- Client Components handle user interaction.
- The search logic must be reusable and independent from UI components.
- Avoid unnecessary abstractions.
- Keep responsibilities clearly separated.

Design the solution so future features can reuse the same search pipeline.

Future features include:

- tag filtering
- technology switching
- language switching
- URL search parameters
- search result highlighting

Do not implement those features in this step.

----------------------------------------------------
Search Engine
----------------------------------------------------

Recommend the search approach you consider most appropriate.

Explain your decision.

Consider:

- project size
- performance
- maintainability
- future extensibility

You may recommend Fuse.js or another solution if you believe it is a better fit.

----------------------------------------------------
Search State
----------------------------------------------------

Design the search state with future extensibility in mind.

If you believe introducing a shared search state (Context or another approach) is beneficial, explain why.

Otherwise, explain why a simpler solution is preferable.

Choose the architecture you consider most appropriate.

----------------------------------------------------
UI
----------------------------------------------------

The SearchBar should always remain visible.

Only the content below the SearchBar changes:

- empty search → category view
- active search → search results

The overall page layout should remain unchanged while searching.

----------------------------------------------------
Scope
----------------------------------------------------

Implement only:

- search infrastructure
- search input
- search functionality
- search results view
- search reset
- empty search state

Do not implement:

- tag filtering
- technology switching
- language switching
- URL synchronization
- search result highlighting
- advanced ranking
- keyboard shortcuts

----------------------------------------------------
Before Writing Code
----------------------------------------------------

First explain:

- which search approach you recommend and why
- whether you recommend Fuse.js or another solution
- where the search logic should live
- how the search state will flow through the application
- whether shared search state is justified
- which components will be created or updated
- how this design can support future filtering features without refactoring

Wait for approval before generating code.

----------------------------------------------------
After Implementation
----------------------------------------------------

Provide:

- summary
- created and updated files
- architectural decisions
- explanation of the search architecture
- confirmation that:

  - TypeScript passes
  - ESLint passes
  - Build succeeds

Do not continue with the next implementation step.

The proposal looks good overall.

Approved with a few adjustments.

1. I agree with your recommendation to use simple substring-based search instead of Fuse.js for this step. The current product requirement is explicit substring matching, not fuzzy search. Please treat the roadmap's Fuse.js mention as a future enhancement rather than a requirement for this implementation.

2. Please keep the implementation as simple as possible. Given that search currently runs only within a single technology (roughly 100–130 questions), I do not think debounce is justified. I would prefer search results to update immediately on every keystroke.

3. Since debounce is not needed, keep the search state minimal. Avoid maintaining both `inputValue` and `query` unless there is a strong technical reason. A single `query` state should be sufficient.

4. I like the proposed architecture:
   - `lib/search.ts` containing a pure `searchQuestions()` function.
   - `KnowledgeBase` becoming the client component responsible for deciding what is visible.
   - `Content` remaining a thin Server Component responsible only for loading data.
   - A small `SearchProvider` is justified because `SearchBar` and `KnowledgeBase` are sibling branches under `AppLayout`.

5. Please keep the `SearchProvider` focused only on search. Do not introduce placeholder state for future features such as tags, technologies, or languages. Those can be added later when they are implemented.

6. Please preserve the following UX requirements:

   - The SearchBar is always visible.
   - When the search query is empty, display the normal category-based Knowledge Base.
   - When the user enters a search query, replace the category view with a flat list of matching questions.
   - Categories should not be displayed while searching.
   - Each result should use the existing `QuestionAccordion` component.
   - A question matches when the search query is found in either the question title or the answer content.
   - Display the total number of matching questions.
   - If no questions match, display a clean empty state.
   - Display a clear ("×") button whenever the search field is not empty.
   - Clicking the clear button, or manually clearing the input, should restore the default category-based view immediately.

Everything else is approved.

The implementation looks good.

The architecture is exactly what I had in mind:
- a pure search function,
- a minimal SearchProvider,
- Content remaining a Server Component,
- KnowledgeBase becoming the single client-side rendering entry point.

Before we move on, I'd just like to verify a few UX details:

- Does QuestionAccordion continue to work correctly in the search results?
- Is Markdown rendering unchanged after moving rendering into KnowledgeBase?
- Does clearing the search always restore the default category view correctly?
- After clearing the search, is it expected that all accordions return to their collapsed state? (I'm happy with that behavior.)

Also, one architecture question:
Is SearchProvider scoped only to the Knowledge Base page, or does it wrap the entire application?

If everything above checks out, I'm happy to consider Step 6 complete.