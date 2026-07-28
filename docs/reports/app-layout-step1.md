Step 1 complete — Application Layout
1. Summary
Built the application shell: Header (sticky, contains title / technology tabs / search / language switcher), Sidebar (persistent aside on desktop, Sheet drawer on mobile), and Content (fills remaining space). All child placeholders (SearchBar, TechnologyTabs, LanguageSwitcher, TagList) now render static, non-functional UI instead of null, per your decisions. No search, filtering, routing, data loading, or global state was introduced — the only state anywhere is the mobile Sheet's own open/close, and it's not even code I wrote: I composed Header (trigger) and Sidebar (content) as siblings under one shared <Sheet> in AppLayout, so the underlying base-ui primitive manages that state internally — zero useState anywhere in the app.

2. Final Project Structure

frontend/
├── app/
│   ├── layout.tsx
│   ├── page.tsx            (renders <AppLayout />)
│   └── globals.css
├── components/
│   ├── layout/
│   │   └── AppLayout.tsx   (shell: wraps Header/Sidebar/Content in one <Sheet>)
│   ├── header/
│   │   ├── Header.tsx      (sticky bar, mobile menu trigger)
│   │   ├── TechnologyTabs.tsx   (static)
│   │   ├── SearchBar.tsx        (static, disabled input)
│   │   └── LanguageSwitcher.tsx (static)
│   ├── sidebar/
│   │   ├── Sidebar.tsx     (desktop aside + mobile SheetContent)
│   │   └── TagList.tsx     (static placeholder badges)
│   ├── content/
│   │   ├── Content.tsx     (empty scrollable main region)
│   │   ├── CategoryAccordion.tsx  (untouched placeholder)
│   │   └── QuestionAccordion.tsx  (untouched placeholder)
│   └── ui/                 (shadcn: button, input, badge, separator, sheet)
├── lib/utils.ts
└── (no hooks/, services/, data/ yet — created only when first needed)
3. Files Created or Modified
Modified: app/page.tsx, components/layout/AppLayout.tsx, components/header/Header.tsx, components/header/SearchBar.tsx, components/header/TechnologyTabs.tsx, components/header/LanguageSwitcher.tsx, components/sidebar/Sidebar.tsx, components/sidebar/TagList.tsx, components/content/Content.tsx

Added (via npx shadcn add): components/ui/sheet.tsx, components/ui/separator.tsx, components/ui/input.tsx, components/ui/badge.tsx

Untouched: CategoryAccordion.tsx, QuestionAccordion.tsx (still return null — correctly out of scope for this step)

4. Architectural Decisions
Shared Sheet context, not lifted state: since frontend-architecture.md assigns the trigger to Header and content to Sidebar as separate components, I put the single <Sheet> wrapper in AppLayout (their common parent) rather than duplicating Sheet instances or writing custom useState/context myself. This keeps Header and Sidebar each still only responsible for their own concern, per the architecture doc.
page.tsx stays a Server Component; only AppLayout and its children are "use client", since they're the ones needing interactivity (Sheet). Matches "Server Components can be introduced later if beneficial" — no reason to force the root into the client bundle.
No responsive tier beyond one md: breakpoint (persistent sidebar ⇄ Sheet drawer) — the spec mentions a "smaller sidebar" for tablet but gives no concrete requirement, so I didn't add a third breakpoint tier; would be premature without a real spec to implement against.
TechnologyTabs/LanguageSwitcher "active" styling is static markup, not state — index === 0 just picks which button renders with the secondary variant at render time. No onClick, no useState.
Verified, not just written: tsc --noEmit clean, npm run lint clean, npm run build succeeds, and I ran the actual dev server, fetched the rendered HTML, and confirmed: correct title, tech-tab buttons, language buttons, sidebar "Tags" heading, mobile trigger with correct md:hidden class, desktop aside with correct hidden md:block class, and zero errors/warnings in the dev server log across every edit's hot-reload.

5. Recommendations Before Step 2
The Sheet/Content composition pattern (shared context via common ancestor) is worth keeping in mind as the template for future cross-component coordination, rather than reaching for lifted useState or a context provider by default.
Next logical step per the specs would be the data layer (getQuestions()/getCategories()/getTags() in a new services/ folder) — but per your instruction, I'm not creating that folder or any code until it's actually the step that needs it.
Not starting Step 2 — waiting for your review and approval.