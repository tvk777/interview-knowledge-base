# UI Notes

## Accordion Behavior

- Only one category can be expanded at a time.
- Only one question can be expanded at a time.

## Visual Hierarchy

- Category headers should be visually distinct from question items.
- Use larger typography for categories.
- Increase spacing between categories.
- Questions should appear visually nested inside categories.

## Search

- The SearchBar is always visible.
- Empty search displays the normal category-based Knowledge Base.
- Active search displays a flat list of matching questions.
- Categories are hidden while searching.
- Search results use the existing QuestionAccordion component.
- Display the number of matching questions.
- Display a clear ("×") button while the search query is not empty.
- Clearing the search restores the default category view.
- Clearing the input manually has the same effect as clicking the clear button.
- Display a clean empty state when no results are found.

## Future Improvements

- Smooth accordion animations.
- Highlight active question.
- Auto-scroll active question into view (optional).