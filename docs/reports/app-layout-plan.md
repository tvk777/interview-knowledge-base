1. Understanding
Step 1 is scoped to the application shell only: a three-part layout (Header / Sidebar / Main Content) with correct structural behavior — sticky header, a sidebar that's persistent on desktop and collapses into a Sheet/Drawer on mobile, and a main content area that fills the remaining space. No data loading, search, filtering, technology/language switching logic, or Markdown rendering — those are later steps. The components created in the earlier scaffolding step (Header, Sidebar, Content, AppLayout, TechnologyTabs, SearchBar, LanguageSwitcher, TagList, CategoryAccordion, QuestionAccordion) currently all return null; this step gives the structural ones (AppLayout, Header, Sidebar, Content) real layout markup.

Before going further, I need to flag a real contradiction between the specs and what already exists on disk — see Section 5. I have not written any code yet.

2. Implementation Plan
AppLayout — the shell itself: renders Header at the top (sticky), then a two-column region below it (Sidebar + Content), full viewport height, no scroll on the outer shell (each region scrolls independently later).
Header — sticky bar containing named slots for the technology selector, search input, and language switcher (rendering the existing placeholder components in their correct positions), styled per frontend-design.md (search as the visually dominant element).
Sidebar — desktop: a persistent fixed-width column. Mobile: collapses behind a shadcn Sheet, opened by a trigger button in the Header. Renders the TagList placeholder in its correct slot.
Content — fills remaining space, scrollable region, renders nothing but a slot for future category/question rendering (no CategoryAccordion/QuestionAccordion wiring beyond placing the existing placeholder).
Mobile trigger — a menu/hamburger button in the Header (visible only on small screens) that opens the Sidebar's Sheet. This needs a tiny bit of open/closed UI state (just Sheet open/close — not app state, not global state per frontend-architecture.md's "keep global state minimal").
shadcn components — install sheet (required for the mobile drawer) and separator (visual divider between header/sidebar/content, listed as an "expected component" in the design spec). button is already installed.
No logic — no hooks, no services, no data folder content. Those directories stay empty/unused in this step since Step 1 explicitly excludes data loading and business logic.
3. Files
Modify (currently placeholder return null):

components/layout/AppLayout.tsx
components/header/Header.tsx
components/sidebar/Sidebar.tsx
components/content/Content.tsx
app/page.tsx (render AppLayout instead of the bare <h1>)
Leave untouched (still placeholders — their real implementation is a later step): TechnologyTabs.tsx, SearchBar.tsx, LanguageSwitcher.tsx, TagList.tsx, CategoryAccordion.tsx, QuestionAccordion.tsx.

Add (via npx shadcn add):

components/ui/sheet.tsx
components/ui/separator.tsx
No new top-level files or folders beyond what shadcn's add command generates.

4. Architecture
Separation of concerns: AppLayout only arranges Header/Sidebar/Content — no business logic, matching frontend-architecture.md's "Layout... should not contain business logic."
Header only lays out its three slots (tech selector, search, language) — it does not implement search logic itself, matching "No question rendering" / no search logic living in Header.
Sidebar only handles the desktop/mobile presentation of the tag-filter slot — no filtering logic, matching "No search logic" for Sidebar.
Content is a dumb container — "Does not know where data comes from," so it renders nothing but the placeholder slot for now.
No JSON imports, no data layer usage — Step 1 touches none of services/, hooks/, or data/, consistent with those being introduced in later steps.
shadcn/ui usage: Sheet for the mobile drawer and Separator for visual dividers are used as specified rather than hand-rolled, per "Avoid custom implementations unless necessary."
5. Questions
Blocking — needs your decision before I write any code:

frontend-architecture.md specifies this folder structure:


src/
    app/
    components/
        layout/ header/ sidebar/ content/ common/
    hooks/
    services/
    data/
    lib/
    types/
But the frontend project that already exists on disk (built in the previous "create-app" step, per its own explicit instruction "Do NOT create a src directory. The project structure must start directly inside the frontend folder") has no src/ — app/, components/, lib/, types/ sit directly in frontend/. It also has no top-level hooks/, services/, or data/ yet (that create-app prompt only specified lib/data/ and lib/utils/, not top-level siblings).

I don't want to guess here since it affects where literally every file in this step (and all future steps) goes. Could you clarify:

Should I keep the existing no-src/ structure (treat frontend-architecture.md's src/ as illustrative/outdated), or actually move everything into a new src/ directory to match the doc exactly?
Should I create empty top-level hooks/, services/, data/ folders now (to match the target structure) even though nothing goes in them until later steps, or defer creating them until the step that actually needs them?
Non-blocking — my proposed default, flagging in case you disagree:

The Header/Sidebar's child placeholders (SearchBar, TechnologyTabs, LanguageSwitcher, TagList) currently just return null. Since frontend-design.md describes the header's visual content in detail (search as "the primary visual element"), my plan is to give these a static, non-functional visual shell (e.g. a disabled-looking search input, tab-like buttons) so the layout actually looks like the design spec, without wiring any state/handlers/logic. Alternatively I could leave them as literal return null and only build the structural containers (Header/Sidebar/Content bars) with empty space where those slots will go. Which do you want for this step?
I have not written any implementation code yet — waiting for your answers before proceeding.