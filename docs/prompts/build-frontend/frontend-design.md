# Frontend Design Specification

## Goal

Build a clean, fast, and distraction-free interface for studying software engineering interview questions.

The application is content-first. Every design decision should prioritize readability, navigation, and search speed over visual effects.

The overall visual style should be inspired by:

- React.dev
- shadcn/ui

Avoid unnecessary decorations, gradients, animations, or marketing-style layouts.

---

# General Principles

The interface should feel like technical documentation.

Priorities:

1. Readability
2. Fast navigation
3. Search-first workflow
4. Responsive layout
5. Accessibility

Visual details such as colors, spacing, font sizes, border radius, etc. are secondary. Claude Code should choose sensible defaults consistent with React.dev and shadcn/ui.

---

# Layout

Desktop layout consists of three major sections.

+--------------------------------------------------------------+
| Header                                                       |
+--------------------------------------------------------------+

+-----------+--------------------------------------------------+
| Sidebar   | Main Content                                     |
|           |                                                  |
|           |                                                  |
|           |                                                  |
+-----------+--------------------------------------------------+

---

# Header

The header is always visible (sticky).

Contains:

- Project title
- Technology selector
- Search input
- Language switcher

The search bar should be the primary visual element.

---

# Sidebar

Desktop:

Visible at all times.

Contains tag filters.

Capabilities:

- filter by tag
- clear filters
- display number of matching questions (optional)

Mobile:

Hidden inside a Drawer/Sheet.

---

# Main Content

Main content displays categories.

Each category is rendered as an Accordion.

Example:

▼ React Fundamentals

    ▶ What is React?
    ▶ What is Virtual DOM?
    ▶ What are Hooks?

Only one question should be expanded at a time.

---

# Question

Each question is an Accordion item.

Expanded question contains:

- title
- markdown answer

Markdown should be rendered using good typography.

---

# Search

Search is the primary navigation method.

Searches through:

- question titles

Future:

- answers

Search behavior:

- instant
- debounce
- highlights matching text
- automatically expands matching category
- automatically opens matching question

---

# Technology Switcher

Top navigation.

Examples:

React
JavaScript
TypeScript
Next.js

Changing technology loads another dataset.

No page reload.

---

# Language Switcher

Supports:

EN
UA

Switches interface language.

Question content depends on available datasets.

---

# Tags

Tags filter questions.

Multiple tags may be selected.

Filtering updates:

- categories
- search results
- question count

---

# Markdown

Answers are written in Markdown.

Support:

- headings
- lists
- code blocks
- inline code
- tables
- blockquotes

Code blocks should support syntax highlighting.

---

# Responsive Behavior

Desktop:

Header
Sidebar
Content

Tablet:

Smaller sidebar.

Mobile:

Header

↓

Drawer for tags

↓

Content

Search is desktop-only in this MVP. See Mobile Navigation below.

---

# Mobile Navigation

On mobile, the Header contains only:

- Menu button
- Application title

All other navigation is consolidated into a single entry point: the mobile Sheet, opened by the menu button.

The mobile Sheet contains, in order:

1. Technology selector (TechnologyTabs)
2. Divider
3. Tag filters

TechnologyTabs is the same component rendered in the desktop Header, reused inside the Sheet rather than duplicated. On mobile the Header's copy is hidden and the Sheet's copy is the only one shown, so there is still only one technology selector visible at a time.

SearchBar and LanguageSwitcher are intentionally desktop-only in this MVP. They are not present in the mobile Header or the mobile Sheet.

They may be introduced on mobile in a future iteration, once core functionality (data loading, search, filtering) is implemented.

---

# Components

Use shadcn/ui components whenever possible.

Expected components include:

- Accordion
- Button
- Input
- ScrollArea
- Badge
- Separator
- Sheet
- DropdownMenu
- Tooltip

Avoid custom implementations unless necessary.

---

# Performance

The application should feel instant.

Requirements:

- lazy rendering where appropriate
- efficient filtering
- efficient searching
- minimal unnecessary re-renders

---

# Future Features

The architecture should allow adding:

- SQLite backend
- Admin panel
- Authentication
- Favorites
- Recently viewed questions
- Theme support
- Full-text search
- AI assistant

without major UI restructuring.