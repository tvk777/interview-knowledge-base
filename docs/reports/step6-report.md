Before Writing Code
Search Approach: Plain Substring Matching, Not Fuse.js — Flagging a Roadmap Mismatch
roadmap.md's Step 7 entry lists "Fuse.js integration" as a deliverable, so I want to address this directly rather than quietly ignore it: I recommend against Fuse.js for this step, and I think the mismatch is revealing, not just a style preference.

Fuse.js's entire value proposition is fuzzy matching — typo tolerance, approximate scoring, weighted relevance ranking. But this step's actual requirement is explicit and literal: "A question matches when the search query is found in either the question title or the answer content." That's exact substring containment, not fuzzy matching. Using Fuse.js here would mean either (a) configuring it in exact-match mode, at which point it's just a heavier, less predictable way to do .includes(), or (b) leaving fuzzy matching on, which would produce results that don't match the literal spec (e.g. matching "hoosk" against "hooks") — a behavior nobody asked for and that contradicts "found in."

On top of the semantic mismatch: the current dataset is one technology's worth of questions at a time (~100–130, since technology switching isn't wired up yet), searched against two string fields each. A linear scan with .includes() is sub-millisecond at this size — there's no performance case for an indexed fuzzy-search library here. Given the task's own stated priorities ("keep the solution simple... appropriate for the current project size," "avoid unnecessary abstractions"), a plain, dependency-free filter function is the better fit right now. If fuzzy/typo-tolerant search becomes an actual product requirement later (which roadmap.md gestures at), swapping the one pure function in lib/search.ts for a Fuse.js-backed implementation is a contained, one-file change — nothing else in the architecture would need to move. Flagging this clearly in case you'd rather I follow the roadmap literally and use Fuse.js now anyway.

Where the Search Logic Lives
frontend/lib/search.ts — a single pure function:


searchQuestions(questions: Question[], query: string): Question[]
Case-insensitive, trims the query, checks question.question.en and question.answer.en for containment. Zero React, zero state — just data in, data out. This is what makes it "reusable and independent from UI components," and it's also exactly the shape a future filterByTags() or filterByTechnology() pure function would take, callable from the same place.

How Search State Flows — and Why Shared State (Context) Is Justified Here
This is the one point I want to be explicit about, because it's a different call than Step 1's Sheet problem, even though it looks similar on the surface.

SearchBar lives inside Header; the thing that needs to react to the query (switching between the category view and a flat results view) lives inside Content. Header and Content are siblings under AppLayout, with no shared primitive to piggyback on the way Header's SheetTrigger and Sidebar's SheetContent shared one <Sheet> in Step 1. There's no way to connect a keystroke in one branch to a render decision in a completely separate branch without either lifting state to their common ancestor and threading it through children (awkward — children is an opaque ReactNode, not something you can inject props into), or sharing it via Context.

So: yes, a small Context is justified here, specifically because the two things that need to agree on the query (SearchBar, and the content-switching logic) aren't in a parent/child relationship. I'd scope it minimally — just { inputValue, query, setInputValue } — not a general-purpose "app state" grab bag with placeholder fields for tags/technology/language that don't exist yet. Extending it later (e.g. adding selectedTags) is a small, additive change to the same file when that feature actually arrives — not something to pre-build now.

I'd also fold the debounce into this same hook: inputValue updates on every keystroke (so the input itself always feels instant/controlled), while a derived query value commits ~200ms after typing stops (that's what search results actually key off). Clearing to empty is a fast-path that bypasses the debounce entirely — so backspacing to nothing restores the category view immediately, not after 200ms.

Components Created or Updated
New: frontend/lib/search.ts — searchQuestions().
New: frontend/hooks/useSearch.tsx — SearchProvider (Context provider holding inputValue/query/setInputValue, owns the debounce) + useSearch() hook. Creating hooks/ now since this is the first actual thing that needs it (same "create folders when needed" principle we used in Step 3).
New: components/content/KnowledgeBase.tsx — Client Component. Receives categories/questions as props (already fetched server-side). Reads useSearch(). Empty query → today's grouped Accordion category view (unchanged rendering, just relocated here). Non-empty query → searchQuestions(), then either a "Search Results (N)" heading + flat Accordion of QuestionAccordion results, or the empty-state message if zero matches.
Updated: components/content/Content.tsx — shrinks to a thin Server Component: fetch categories/questions, render <KnowledgeBase categories={categories} questions={questions} />. No rendering logic of its own anymore.
Updated: components/header/SearchBar.tsx — becomes a real controlled input via useSearch(), plus the × clear button (shown only when inputValue is non-empty).
Updated: components/layout/AppLayout.tsx — wraps its content in <SearchProvider> alongside the existing <Sheet>.
Unchanged: CategoryAccordion, QuestionAccordion, Markdown — reused exactly as they are, just now imported from KnowledgeBase instead of directly from Content. They have no server-only dependencies, so being pulled into the client bundle from a Client Component parent is unremarkable.
Supporting Future Filtering Without Refactoring
lib/search.ts establishes the pattern: one small pure function per filter dimension, composable in KnowledgeBase.tsx. Tag filtering later is filterByTags(questions, selectedTags), composed the same way.
The Context established here is the natural place to add selectedTags/technology/language fields later, without changing how any existing consumer reads from it.
KnowledgeBase.tsx is already the single place that decides "which questions are visible right now" — future filters plug into that same decision point rather than needing a new one.
Waiting for your approval before writing any code.

Summary
Implemented client-side search infrastructure per the approved, simplified design (no debounce, single query state).

Created Files
frontend/lib/search.ts — pure searchQuestions(questions, query) function. Case-insensitive, trims the query, matches against question.question.en or question.answer.en.
frontend/hooks/useSearch.tsx — SearchProvider (Context holding only { query, setQuery }) + useSearch() hook. No debounce, no fields for future features.
frontend/components/content/KnowledgeBase.tsx — new Client Component, the single place deciding what's visible: empty query → grouped category Accordion (today's view, relocated here); non-empty query → searchQuestions() results as a flat Accordion of QuestionAccordion with a "Search Results (N)" heading, or the empty-state message if zero matches.
Updated Files
components/layout/AppLayout.tsx — wraps everything in <SearchProvider>.
components/header/SearchBar.tsx — real controlled input via useSearch(); × clear button (using Button/XIcon) appears only when query is non-empty and resets it directly.
components/content/Content.tsx — shrunk to a thin Server Component: fetch, then render <KnowledgeBase categories={categories} questions={questions} />. No rendering logic left in it.
Unchanged: CategoryAccordion, QuestionAccordion, Markdown — reused exactly as-is, now imported from KnowledgeBase instead of Content.
Architectural Decisions
Plain substring search, not Fuse.js — per your confirmation, treating the roadmap's mention as a future enhancement, not this step's requirement.
No debounce, single query state — per your adjustment. Every keystroke updates query directly and KnowledgeBase re-renders immediately; at ~100–130 questions this is effectively instantaneous, so the debounce/dual-state complexity had no real justification.
SearchProvider holds only query/setQuery — no placeholder fields for tags/technology/language, per your instruction.
Context was still the right call, specifically because SearchBar and KnowledgeBase are sibling branches under AppLayout (not parent/child), so there was no simpler prop-threading option available.
Verification
✅ npx tsc --noEmit — clean
✅ npm run lint — clean
✅ npm run build — succeeds, static prerender still works
✅ Ran the dev server fresh (cleared .next) and confirmed in real HTML: 12 categories render by default (empty-query state), the search input is a genuinely controlled empty value="", and the clear button is correctly absent when the query is empty.
✅ Verified the actual matching logic against real data, not just that it compiles: case-insensitivity ("hooks" vs "HOOKS" both → 22 matches), whitespace tolerance (" hooks " → same 22), empty query → all 113 questions, a nonsense query → 0 matches, and — importantly — found a term ("facebook") that appears in zero question titles but in 2 answers, confirming answer-content matching genuinely works and isn't just incidentally passing via title matches.
Not continuing to the next step — waiting for your review.


Verification Results
I didn't just re-read the code for this — I set up a real interactive test (React Testing Library + jsdom, temporary dev-only, removed afterward) that renders SearchBar and KnowledgeBase together under one SearchProvider — exactly as they're composed in the real app — and simulates actual typing/clicking, not just static HTML.

Does QuestionAccordion continue to work correctly in search results?
Yes. Searching "facebook" (a term that appears in 2 answers but zero question titles — confirmed against the real dataset) correctly renders exactly 2 QuestionAccordion items in the results list, with the real question title as the trigger.

Is Markdown rendering unchanged after moving into KnowledgeBase?
Yes. I expanded a search result and confirmed its content contains real rendered HTML elements (<p>, <strong>, or <li> — not raw **/markdown syntax). The Markdown pipeline works identically regardless of which component tree renders QuestionAccordion.

Does clearing the search always restore the default category view?
Yes, verified two ways: clicking the × button, and manually clearing the input (simulating backspace-to-empty) — both correctly restore all 12 category accordion items and remove the "Search Results" heading.

After clearing, do all accordions return to collapsed state?
Yes, and here's why, concretely (not just "as expected"): I expanded a result item first, confirmed it was genuinely open (data-open attribute present), then cleared the search — and confirmed zero open accordions afterward. This happens because KnowledgeBase returns structurally different JSX for the search view vs. the category view (different element trees at the same position), so React unmounts the search view's Accordion entirely and mounts a fresh instance of the category Accordion when you clear — a fresh instance has no memory of what was open before. This is a natural consequence of the conditional-rendering structure, not something I added deliberately, but it produces exactly the behavior you said you're happy with.

Architecture Question: SearchProvider Scope
It wraps the entire application, not just a "Knowledge Base page." SearchProvider sits inside AppLayout, which is the single root shell rendered by app/page.tsx — there's currently only one page in this app, so in practice "wraps the app" and "wraps the Knowledge Base view" are the same thing today. Worth flagging for the future: if this app ever grows additional routes/pages that shouldn't share search state (e.g. a settings page), SearchProvider would need to move from AppLayout down to whatever specifically wraps the searchable content — that's a small, contained move when it becomes relevant, not a concern right now.

Step 6 is complete and verified — let me know if you'd like anything adjusted before moving on.