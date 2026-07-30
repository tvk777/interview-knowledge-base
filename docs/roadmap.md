# Interview Knowledge Base Roadmap

This document describes the implementation roadmap for the Interview Knowledge Base frontend.

The goal is to build the application incrementally while keeping the architecture clean, maintainable, and easy to extend.

---

# ✅ Step 1 — Application Layout

**Status:** Completed

### Goals

- Build the application shell
- Implement Header
- Implement Sidebar
- Implement Main Content area
- Implement responsive layout
- Implement mobile navigation using Sheet
- Synchronize documentation with implementation

### Deliverables

- Application layout
- Responsive navigation
- Mobile Sheet
- Static placeholder components
- Updated documentation

---

# Step 2 — Data Contracts

### Goals

Define all application data models using TypeScript.

### Deliverables

- Question
- Category
- Technology
- Tag
- AnswerBlock
- Other shared types if needed

No UI changes.

---

# Step 3 — Data Layer

### Goals

Create a clean data access layer.

UI components must never import JSON files directly.

### Deliverables

Create services such as:

- getQuestions()
- getCategories()
- getTags()

The data layer should become the single source of data for the application.

---

# Step 4 — Build Knowledge Base View

### Goals

Connect the application to the real generated knowledge base.

Replace placeholder data with the data layer.

### Deliverables

- Content receives data from services
- No direct JSON imports in UI components
- Verify that the architecture remains clean

---

# Step 5 — Build Content UI

### Goals

Build the main knowledge base interface.

### Deliverables

- CategoryAccordion
- QuestionAccordion
- Proper typography
- Responsive spacing
- Expand / collapse behavior

### UX Requirements

- Only one category may be expanded at a time.
- Only one question may be expanded at a time.
- Category headings should be visually distinct from question items.
- Category hierarchy should be immediately recognizable.

---

# Step 6 — Markdown Rendering

### Goals

Render answer content correctly.

### Deliverables

Support for:

- headings
- paragraphs
- bullet lists
- numbered lists
- code blocks
- inline code
- tables
- blockquotes
- links

Markdown rendering should be isolated in dedicated components.

---

# Step 7 — Search

### Goals

Implement question search.

### Deliverables

- Search input
- Debounced search
- Fuse.js integration
- Search result highlighting

---

# Step 8 — Tag Filtering

### Goals

Make sidebar tags functional.

### Deliverables

- Tag selection
- Multiple tag filtering
- Filter synchronization with search

---

# Step 9 — Technology Switching

### Goals

Make TechnologyTabs functional.

### Deliverables

Switch between technologies such as:

- React
- JavaScript
- TypeScript
- Next.js

The content should update without changing the application structure.

---

# Step 10 — Language Switching

### Goals

Support multiple languages.

### Deliverables

- English
- Ukrainian

Language switching should affect only displayed content while preserving the current navigation state.

---

## Step 11 — Knowledge Base Landing Page

Replace the current redirect from `/` with a dedicated landing page that serves as the main entry point to the knowledge base.

### Goals

- Create a real homepage at `/`.
- Display the existing application header.
- Provide an overview of all available technologies.
- Improve navigation and discoverability.

### Requirements

- Reuse the existing application header.
- Display every technology as a separate section.
- Each section should include:
  - technology name;
  - list of tags belonging to that technology.
- Clicking a technology navigates to its knowledge base.
- Clicking a tag navigates to the corresponding technology page with that tag already selected.
- Tag navigation should produce the same result as selecting a tag in the sidebar.

### Architecture

- Keep data loading on the server.
- Reuse existing services for loading technologies and tags.
- Avoid duplicating filtering logic.
- Prefer URL-driven navigation for deep linking when appropriate.
- Reuse existing UI components whenever possible.
- Separate presentation from behavior.

### Acceptance Criteria

- `/` no longer redirects.
- The landing page displays all technologies.
- Every technology section displays its tags.
- Technology links navigate correctly.
- Tag links immediately open filtered results.
- Existing technology pages continue to work without regressions.

---

# Step 12 — Polish

### Goals

Prepare the application for production.

### Deliverables

- Loading states
- Empty states
- Accessibility improvements
- Keyboard navigation
- Responsive polishing
- Performance optimizations
- UI refinements
- Final documentation review

---

# Development Workflow

Every implementation step follows the same process:

1. Read the project documentation.
2. Analyze the requirements.
3. Present an implementation plan.
4. Wait for approval.
5. Implement the approved changes.
6. Verify:
   - TypeScript
   - ESLint
   - Build
7. Summarize the completed work.
8. Stop and wait for the next task.

No implementation should continue automatically to the next step.