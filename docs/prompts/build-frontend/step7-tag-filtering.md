Step 7: Tag Filtering

Please read the project documentation before making any changes:

- docs/frontend-design.md
- docs/frontend-architecture.md
- docs/user-flow.md
- docs/roadmap.md
- docs/ui-notes.md

Also review the current implementation, especially the recently completed search functionality and KnowledgeBase architecture.

Do not implement anything yet.

First, explain your proposed implementation, including:

1. Overall architecture.
2. Which files will be added or modified.
3. How the current SearchProvider (or another state container, if necessary) should evolve.
4. How tag filtering should integrate with the existing search flow.
5. Why you chose that approach instead of alternatives.
6. Any potential edge cases or trade-offs.

Wait for my approval before implementing anything.

## Functional Requirements

The application already supports client-side search.

Now implement client-side tag filtering.

### Tag list

- Display all available tags above the Knowledge Base content.
- Tags come from the existing data layer.
- Tags should be displayed in alphabetical order.
- Each tag is rendered as a clickable chip/button.

### Selection

- Multiple tags can be selected simultaneously.
- Clicking a selected tag deselects it.
- Selected tags should have a clearly different visual state.

### Filtering

- When no tags are selected:
  - all questions are eligible.

- When one or more tags are selected:
  - display only questions containing ALL selected tags (logical AND).

### Interaction with Search

Search and tag filtering must work together.

The visible questions are determined by applying both filters.

Conceptually:

visibleQuestions =
    questions
    -> search(query)
    -> filterByTags(selectedTags)

If the search query is empty, only tag filtering applies.

If no tags are selected, only search applies.

### Rendering

Keep the rendering behavior introduced in Step 6.

If the search query is empty:
- render the normal category-based view,
- but categories containing no visible questions should not be displayed.

If the search query is not empty:
- render the flat search-results view,
- containing only questions matching both search and tag filters.

### Empty State

If no questions satisfy the current filters, display the existing empty-state message.

### UX

- Tag filtering updates immediately after every click.
- No Apply button.
- No debounce.
- Preserve the existing search behavior.
- Preserve the existing accordion behavior.

## Simplicity

Please keep the implementation consistent with the existing MVP philosophy:

- prefer simple, pure filtering functions;
- avoid introducing unnecessary abstractions;
- avoid preparing for future features unless they are required for this implementation;
- reuse the existing architecture wherever possible.

After presenting your proposal, wait for my approval before writing any code.


Thanks for the analysis. I agree with most of the proposal.

I'd like to make two adjustments before implementation.

1. I'd like to keep the original UI design and render the real tags in the left sidebar rather than above the Knowledge Base content. The sidebar was designed to contain the tag filters, so I'd prefer to preserve that layout even if it requires a small AppLayout refactor to pass the tag data.

2. I'd prefer to keep the existing SearchProvider for now instead of renaming it. We can simply extend it with the selected tag state. If, after technologies and languages are implemented, it grows into a more general filter state, we can rename it then if it still feels appropriate.

Everything else looks good:
- a pure filterByTags() helper,
- AND matching,
- combining search and tag filtering,
- hiding empty categories,
- immediate updates,
- Button-based chips.

Please update the implementation plan accordingly before writing any code.

This matches what I had in mind.

I like the updated approach:

- keeping the original sidebar-based UI,
- using AppLayout with separate sidebar and content slots,
- extending the existing SearchProvider instead of renaming it,
- reusing the existing TagList component instead of introducing a new one,
- keeping the filtering logic as pure helper functions.

One small question before implementation:

Can you confirm that getTags(technology) returns only the tags for the selected technology? If so, that's exactly the behavior we want.

Otherwise, I'm happy with this plan. Please proceed with the implementation.



Thanks for the implementation. I tested it and I'd like to make a few UX adjustments before considering Step 7 complete.

### 1. Single tag selection instead of multi-select

I'd like to simplify the interaction.

Instead of supporting multiple selected tags, only one tag should be active at a time.

Behavior:

- clicking a tag selects it;
- clicking another tag replaces the current selection;
- clicking the selected tag again clears the selection.

So the state becomes:

selectedTag: string | null

instead of

selectedTags: string[].

---

### 2. Easy way to return to the default view

After clearing the selected tag, the application should immediately return to the default state, exactly as it does before any filtering.

No additional action should be required.

---

### 3. Tag filtering should behave like Search

I'd like the UX to be consistent with Search.

When a tag is selected, display a flat list of matching QuestionAccordion items, just like the Search Results view.

Do not render categories.

Selecting a tag should switch to a "results" mode, exactly like searching does.

---

### 4. Scroll to the top after selecting a tag

After selecting or changing a tag, automatically scroll the page to the top so that the filtered results are immediately visible.

A smooth scroll is preferred.

Please update the implementation accordingly and then verify the new behavior.


Everything looks good after my manual testing except one thing.

The scroll-to-top behavior doesn't seem to work in the browser.

I saw in your verification that `scrollTo()` is being called, but visually the page does not scroll back to the top after selecting a tag.

Could you investigate why?

It may be that the scroll is being applied to a different element than the one that actually scrolls.

Please identify the correct scroll container and update the implementation accordingly.