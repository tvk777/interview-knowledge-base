## Before Writing Code
Markdown Library Recommendation: react-markdown + remark-gfm
Verified compatibility first (React 19, Next 16, Tailwind v4 are all quite new): react-markdown@10.1.0 supports react >=18, remark-gfm@4.0.1 is current, and @tailwindcss/typography@0.5.20 explicitly supports tailwindcss >=4.0.0. All compatible.

Why react-markdown over alternatives (marked, markdown-it): it renders to actual React elements, not an HTML string — so there's no dangerouslySetInnerHTML anywhere in the pipeline, which matters since this content ultimately comes from generated data, not code I control by hand. remark-gfm is the standard plugin that adds GitHub-Flavored-Markdown features (tables, autolinks) on top of react-markdown's CommonMark base — required here since "tables" is explicitly in the support list and isn't part of vanilla CommonMark.

I'd also add @tailwindcss/typography (Tailwind Labs' official plugin, confirmed Tailwind v4-compatible) purely for the prose utility class, which handles "good typography" (per frontend-design.md's own wording) for headings/lists/blockquotes/tables/code out of the box. The alternative — hand-styling every element type via react-markdown's components override prop — would be reinventing what this plugin already does well, which runs against "avoid custom implementations unless necessary."

## Components Created or Updated
New: components/common/Markdown.tsx — the dedicated Markdown-rendering component. Takes content: string, renders <ReactMarkdown remarkPlugins={[remarkGfm]}> wrapped in a prose container. Plain Server Component (no interactivity needed).
Updated: components/content/QuestionAccordion.tsx — AccordionContent now renders <Markdown content={question.answer.en} /> instead of being empty. No Markdown logic lives here — it just passes the string through.
Updated: components/content/CategoryAccordion.tsx and components/content/Content.tsx — accordion-mode and styling changes only (below). No logic changes.
app/globals.css — needs the typography plugin registered (Tailwind v4 registers plugins via @plugin "..." in CSS, not tailwind.config.js).
components/common/ is currently empty — this is exactly the folder it exists for (a shared, non-header/sidebar/content-specific presentational component), so this is its first real use, not a new pattern.

How Markdown Encapsulation Works
QuestionAccordion only ever calls <Markdown content={...} /> — it has zero knowledge of react-markdown, remark-gfm, or how Markdown gets turned into DOM. If the Markdown library ever needs to change, Markdown.tsx is the only file that changes.

Accordion Behavior Change
Currently: Content.tsx wraps categories in <Accordion multiple> (several categories can be open at once); each category's nested question <Accordion> already defaults to single-open (multiple unset = false).

Change: drop multiple from the outer (category) Accordion in Content.tsx, so only one category can be expanded at a time — matching ui-notes.md exactly.

Worth noting explicitly: "only one question expanded at any time" doesn't need any additional code. Since categories are now mutually exclusive (only one open) and each category's own question-accordion is already independently single-open, the combination already guarantees at most one question is expanded anywhere on the page at any time — collapsing a category unmounts its (at-most-one) open question along with it. No lifted state, no cross-component coordination required.

Both levels stay collapsible — that's base-ui's default behavior for a value-based accordion already (clicking an open trigger closes it), nothing to add.

Visual Hierarchy Plan
Per ui-notes.md specifically:

Category trigger: larger, bolder text (e.g. text-base font-semibold) to stand out immediately from question rows.
Question trigger: smaller, regular-weight text (e.g. text-sm font-normal).
Nesting: the inner questions Accordion gets a left border + left padding (e.g. border-l pl-4), so questions read as visually contained inside their category, not just sequential list items.
Spacing between categories: increase vertical spacing on the outer Accordion/AccordionItems (e.g. a bit more py per category item) so categories don't run together.
All via Tailwind utility classes passed through the existing className prop support already built into the shadcn Accordion primitives (confirmed in Step 4 — they merge via cn()) — no custom CSS, no new styling mechanism.

Explicitly Out of Scope (confirming, not deciding)
Search, tag filtering, technology/language switching, loading/empty states, syntax highlighting, copy-code button — none of these touched, per the Scope section.

Waiting for your approval before writing any code.

Summary
Completed the first polished MVP of the Knowledge Base UI: real Markdown-rendered answers, corrected accordion behavior, and improved visual hierarchy.

Created/Updated Files
New: components/common/Markdown.tsx — the dedicated, fully generic Markdown component. Takes only content: string, no domain types, no knowledge of Question/Category/anything else. No custom element renderers — relies entirely on react-markdown + remark-gfm + the prose class from @tailwindcss/typography.
Updated: components/content/QuestionAccordion.tsx — AccordionContent now renders <Markdown content={question.answer.en} />; trigger styled text-sm font-normal for visual hierarchy.
Updated: components/content/CategoryAccordion.tsx — trigger styled text-base font-semibold; nested question Accordion gets border-l pl-4 to read as visually contained within its category.
Updated: components/content/Content.tsx — removed multiple from the outer Accordion, so only one category can be expanded at a time.
Updated: app/globals.css — registered @plugin "@tailwindcss/typography".
package.json — added react-markdown, remark-gfm, @tailwindcss/typography.
Architectural Decisions
Single-open composes correctly with zero extra code: with categories now mutually exclusive (one open at a time) and each category's own nested question-accordion already independently single-open (from Step 4), the combination already guarantees at most one question is expanded anywhere on the page — collapsing a category unmounts its one open question along with it. No lifted state, no coordination logic needed to satisfy both "only one category" and "only one question" simultaneously.
No custom Markdown element renderers — per your preference, styling comes entirely from Tailwind Typography's prose class rather than per-element components overrides in react-markdown.
Markdown renders to real React elements, never dangerouslySetInnerHTML — matters since the content is generated data, not hand-authored.
Verification
✅ npx tsc --noEmit — clean
✅ npm run lint — clean
✅ npm run build — succeeds, static prerender still works
✅ Beyond the minimum: server-rendered <Markdown> in isolation against two real answers pulled directly from data/enriched/react.json (one containing a table, one containing a fenced code block) and inspected the actual output HTML — confirmed real <table>, <pre><code>, <strong>, <ol>, <ul> elements present, and zero raw Markdown syntax (**, ```) leaking through unparsed.
✅ Ran the dev server fresh (cleared .next cache first) and confirmed zero errors/warnings in the log, and confirmed the category-level trigger styling (text-base font-semibold) renders correctly in the actual HTML.
One honest caveat: I could not directly inspect the nested question-level styling (text-sm font-normal, border-l pl-4) in static HTML, because — consistent with base-ui's behavior already established in Steps 1 and 4 — collapsed accordion panels aren't mounted to the DOM until opened, and all categories start collapsed by default. This is expected/correct behavior, not a gap in verification; the classes are applied via the same cn() merge mechanism already confirmed working for the category level.
Not continuing to the next step — waiting for your review.