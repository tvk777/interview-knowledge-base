Before Writing Code
Which Components Will Be Created or Updated
Content.tsx (updated) — becomes an async Server Component. Fetches getCategories("react") and getQuestions("react") from the existing knowledge-base.ts service, groups questions by categoryId, and renders one CategoryAccordion per category.
CategoryAccordion.tsx (updated) — becomes a plain presentational component. Takes category: Category and questions: Question[] as props (already filtered by Content), renders the category name as a heading and its questions as a list of QuestionAccordion.
QuestionAccordion.tsx (updated) — becomes a plain presentational component. Takes question: Question, renders question.question.en only. No answer, no expand/collapse.
SearchBar, TechnologyTabs, TagList, LanguageSwitcher — untouched, per your instruction.
Where Data Loading Occurs
Inside Content.tsx itself, not lifted up to page.tsx. Content's own architectural responsibility (per frontend-architecture.md: "category rendering, question rendering... does not know where data comes from" — the "doesn't know where data comes from" part is satisfied by going through the service, not by literal, physical distance from the fetch call) is exactly category/question rendering, so colocating the fetch there is the standard, idiomatic Next.js pattern (fetch where the data is used) rather than threading props through an extra layer for no reason.

One hardcoded value, flagged explicitly: Content.tsx will hardcode technology = "react" for now. There's no dynamic technology-selection mechanism yet (TechnologyTabs is still non-interactive, and wiring it up is Step 9's job, explicitly out of scope here). This is a temporary simplification, not a permanent decision.

How Categories and Questions Are Composed
Content fetches both lists, then does questions.filter((q) => q.categoryId === category.id) per category and passes the filtered slice down as a prop. The filtering logic lives in Content (the Server Component that already has both datasets), not inside CategoryAccordion — keeping CategoryAccordion/QuestionAccordion pure "given props, render them" components with zero data-shaping logic of their own, per the architecture's "no business logic in UI components" rule.

A Required Architectural Change: AppLayout Must Accept children
This is the one non-obvious, necessary change, and I want to flag it clearly before writing anything: AppLayout.tsx is "use client" (it needs the Sheet primitive). It currently imports and renders <Content /> directly inline. Once Content becomes an async Server Component reading from the filesystem (node:fs/promises, inside knowledge-base.ts), a Client Component can no longer import and render it inline — that would pull server-only code into the client bundle and break.

The fix is the exact pattern Next.js's own docs describe for this situation (Server Component passed as children into a Client Component): AppLayout stops importing Content at all and instead renders {children}; page.tsx (already a Server Component) does <AppLayout><Content /></AppLayout>. This means AppLayout.tsx and app/page.tsx are also modified this step, even though they weren't named in your "should remain unchanged" list — they weren't named because Step 1 didn't anticipate this composition need. Flagging this now so it's not a surprise in the diff.

Architectural Decisions Summary
Content, CategoryAccordion, QuestionAccordion all drop "use client" and become Server Components — no interactivity is needed yet (no expand/collapse — see below), so there's no reason to put them in the client bundle.
Not using shadcn's Accordion component yet, despite the file names. The roadmap separates this: Step 5 ("Build Content UI") explicitly owns "Expand/collapse behavior" as its own deliverable, distinct from this step. Wiring up real Accordion now would mean implementing that Step 5 deliverable early. So for this step, CategoryAccordion renders a heading + plain list, and QuestionAccordion renders a static block with the question text — no collapsible behavior, matching "Question items may simply display the localized question text." Step 5 will replace this same file's internals with real Accordion/AccordionItem usage.
Language is hardcoded to .en (question.question.en) — no language-switching logic exists yet (Step 10's job).
No handling for a category with zero matching questions (renders an empty list) — not mentioned in scope, and empty-state UX is explicitly Step 11's job ("Empty States").
Waiting for your approval before writing any code.

After:

Summary
Connected the layout to the real data layer and rendered the actual knowledge base content using real shadcn Accordion components, per your adjustment.

Created/Updated Files
components/content/Content.tsx (updated) — now an async Server Component. Fetches getCategories("react") and getQuestions("react") from knowledge-base.ts, groups questions by categoryId, renders one outer <Accordion multiple> containing one CategoryAccordion per category.
components/content/CategoryAccordion.tsx (updated) — real AccordionItem/AccordionTrigger/AccordionContent, with a nested <Accordion> inside (single-open-at-a-time, base-ui's default) holding the category's QuestionAccordion items.
components/content/QuestionAccordion.tsx (updated) — real AccordionItem with the question's English title as the trigger; AccordionContent renders empty, as required — no answer content until the Markdown step.
components/layout/AppLayout.tsx (updated) — now accepts children instead of hardcoding Content internally (see below).
app/page.tsx (updated) — composes <AppLayout><Content /></AppLayout>.
Added via npx shadcn add: components/ui/accordion.tsx.
Architectural Decisions
AppLayout restructuring was necessary, not optional: it's "use client" (needs Sheet), and Content now does server-only file I/O (node:fs/promises via the service). A Client Component can't import that inline without breaking the client bundle. I actually hit this exact error mid-implementation — a stale hot-reload surfaced the chunking context does not support external modules (request: node:fs/promises) with the import trace knowledge-base.ts → Content.tsx → AppLayout.tsx [Client Component Browser]. That confirmed the restructuring was required, not just theoretical. After a clean cache-clear and restart, the error is gone and everything renders correctly — but it's worth knowing this is a real failure mode of the "Client Component directly importing a Server Component" pattern, not a hypothetical one.
@base-ui/react's Accordion API differs from what I initially assumed (Radix-style type="single"|"multiple" + collapsible). It actually uses a single multiple?: boolean prop (default false = single-open, uncontrolled). Caught by tsc, fixed before it ever reached the browser.
Accordion panels aren't in the initial HTML while closed (base-ui's default keepMounted: false) — same conditional-mount behavior as Sheet from Step 1. This is correct, expected library behavior, not a rendering bug; verified by checking that all 12 category AccordionItems render server-side (visible even collapsed, since triggers always render) while their nested question content only mounts once expanded.
Technology is still hardcoded to "react" in Content.tsx — unchanged from the approved plan, pending Step 9.
Verification
✅ npx tsc --noEmit — clean
✅ npm run lint — clean
✅ npm run build — succeeds, and the page statically prerenders (the real filesystem-backed data fetch completed successfully at build time)
✅ Ran the actual dev server (twice — once mid-edit which caught the real error above, once clean after .next cache clear) and confirmed in the rendered HTML: exactly 12 category AccordionItems/triggers render (matching React's 12 real categories), category names "Fundamentals"/"Hooks"/"Redux" present, and a real question title ("What is React?") present. Zero errors/warnings in the dev log on the clean run.
Not continuing to Step 5 — waiting for your review.