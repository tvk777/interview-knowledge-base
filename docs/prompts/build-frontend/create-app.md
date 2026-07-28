Act as a Senior Frontend Architect.

We are starting the frontend for the Interview Knowledge Base project.

The repository already contains the following folders:

data/
prompts/
scripts/
src/

## IMPORTANT

The existing `src` folder contains build scripts responsible for generating the knowledge base.

It MUST NOT be modified, moved, renamed, or deleted.

The frontend must be created as a completely independent application.

---

# GOAL

Create a clean, production-ready Next.js application inside a new folder:

frontend/

This project is an Interview Knowledge Base.

Initially it behaves as a React SPA built with Next.js App Router.

In the future it will evolve into a full-stack Next.js application with API Routes, SQLite, and CRUD functionality.

The architecture should support this future evolution without requiring major refactoring.

Do not over-engineer anything.

Keep the project simple, clean, scalable, and easy to extend.

---

# TECH STACK

- Next.js (latest stable)
- App Router
- TypeScript
- Tailwind CSS
- ESLint
- npm
- shadcn/ui

---

# SHADCN/UI

Install and configure shadcn/ui during the initial setup.

The goal is to significantly reduce future UI development time.

No shadcn components need to be added yet.

Only perform the initial installation and configuration so components can later be added using commands like:

npx shadcn@latest add accordion
npx shadcn@latest add input

The project should be fully prepared for shadcn/ui.

---

# REQUIREMENTS

- Do NOT create a src directory.
- The project structure must start directly inside the frontend folder.
- Use App Router.
- Remove all demo code.
- Remove all boilerplate pages.
- Remove unnecessary comments.
- Keep the generated code minimal and production-ready.

Do NOT implement:

- Authentication
- Database
- API Routes
- Server Actions
- CRUD
- SEO optimization
- Dark Mode
- i18n libraries
- State management libraries
- Testing
- Storybook

---

# APPLICATION STYLE

Treat the application as a client-side SPA.

UI components should be implemented as Client Components.

Avoid introducing unnecessary server-side complexity.

Server Components can be introduced later if they provide a clear benefit.

---

# PROJECT STRUCTURE

Create the following structure:

frontend/

app/
    layout.tsx
    page.tsx
    globals.css

components/
    common/
    layout/
    header/
    sidebar/
    content/

lib/
    data/
    utils/

types/

public/

---

# COMPONENT STRUCTURE

Create placeholder React components for the future application architecture.

Create the following files:

components/

layout/
    AppLayout.tsx

header/
    Header.tsx
    TechnologyTabs.tsx
    LanguageSwitcher.tsx
    SearchBar.tsx

sidebar/
    Sidebar.tsx
    TagList.tsx

content/
    Content.tsx
    CategoryAccordion.tsx
    QuestionAccordion.tsx

common/

Every component should be a valid TypeScript React component.

Every placeholder component should simply return:

```tsx
export default function ComponentName() {
    return null;
}
```

Do not implement any UI or business logic.

The goal is only to establish the project architecture.

---

# ARCHITECTURE PRINCIPLES

Business logic must never be coupled directly to React components.

All future data loading should happen through the data layer.

Future components should use functions like:

- getQuestions()
- getCategories()
- getTags()

instead of importing JSON files directly.

GOOD

const questions = await getQuestions("react");

BAD

import reactData from "@/data/react.json";

The data layer is not implemented yet.

Only prepare the project architecture for it.

---

# HOME PAGE

Create only a minimal home page.

Display only:

Interview Knowledge Base

No additional UI.

---

# CODE QUALITY

Follow modern React and Next.js best practices.

Use TypeScript everywhere.

Keep components small.

Organize folders logically.

The generated project should be easy to extend with:

- JSON data
- SQLite
- Prisma or Drizzle
- API Routes
- CRUD
- Admin Panel

without requiring major refactoring.

---

# OUTPUT

Create the complete Next.js project inside the `frontend` folder.

Initialize all required configuration.

Install and configure shadcn/ui.

Create the folder structure.

Create all placeholder components.

Remove all boilerplate code.

Do not implement any functionality beyond the requirements above.