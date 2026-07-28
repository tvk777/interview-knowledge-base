# User Flow Specification

## Goal

Describe how users interact with the application.

Every feature should support one or more user flows described below.

---

# Primary User

Software engineer preparing for technical interviews.

Typical session duration:

15–60 minutes.

Primary devices:

- Desktop
- Laptop

Mobile support is required but desktop is the primary experience.

---

# User Journey

User opens the application.

↓

Chooses a technology.

↓

Searches or browses questions.

↓

Reads answers.

↓

Repeats until finished.

---

# Flow 1 — Browse Questions

User opens the application.

Default technology is selected.

The application displays:

- Header
- Sidebar
- Categories

User scrolls through categories.

User expands one category.

User expands one question.

Reads the answer.

Continues browsing.

---

# Flow 2 — Search

User clicks the search input.

Starts typing.

Search updates immediately.

Matching questions appear automatically.

Matching category expands automatically.

Matching question is highlighted.

User opens the question.

Reads the answer.

Clears the search.

The interface returns to its normal state.

---

# Flow 3 — Filter by Tag

User selects one or more tags.

The question list updates instantly.

Only matching questions remain visible.

User removes a tag.

Results update immediately.

---

# Flow 4 — Change Technology

User clicks another technology.

Example:

React

↓

Next.js

The application loads another dataset.

The page does not reload.

Search and filters are reset.

Categories update.

---

# Flow 5 — Read Answer

User opens a question.

The answer is displayed as formatted Markdown.

Supported content:

- headings
- paragraphs
- bullet lists
- numbered lists
- tables
- code blocks
- blockquotes

Only one question should remain expanded at a time.

---

# Flow 6 — Multiple Searches

User searches:

"hooks"

↓

opens answer

↓

searches

"context"

↓

opens another answer

↓

searches

"memo"

Navigation should always feel instant.

---

# Flow 7 — Mobile

User opens the application.

Header remains visible.

Sidebar becomes a Drawer.

User opens the Drawer.

Selects a tag.

Drawer closes.

Questions update.

---

# Flow 8 — Language

User changes interface language.

UI updates immediately.

Question content changes only if that language dataset exists.

Otherwise, the current content remains unchanged.

---

# Flow 9 — Keyboard Navigation (Future)

User presses:

Ctrl + K

↓

Focus moves to Search.

Esc

↓

Clears search or closes Drawer.

Arrow keys navigate search results.

Enter opens the selected question.

---

# Flow 10 — Deep Link (Future)

User opens:

/react/usememo

Application automatically:

- selects React
- opens category
- opens question
- scrolls to it

---

# Empty States

## No Search Results

Display:

No questions found.

Suggestions:

- Check spelling.
- Try another keyword.
- Clear filters.

---

## No Matching Tags

Display:

No questions match the selected tags.

Provide a button:

Clear Filters

---

# Loading State

Dataset loading should display lightweight skeletons.

Avoid layout shifts.

---

# Error State

If a dataset cannot be loaded:

Display a friendly message.

Provide:

Retry

---

# Expected User Experience

The application should feel like reading high-quality technical documentation.

Navigation should be effortless.

Search should always be the fastest way to reach information.

The interface should never distract from the content.

The user should always know:

- where they are,
- what they are reading,
- how to reach another question in one or two clicks.