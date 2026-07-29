Step 7 Analysis — Before Writing Any Code
A Placement Conflict I Need to Flag First (This Affects Everything Else)
This task's own wording says: "Display all available tags above the Knowledge Base content." But frontend-design.md puts tag filters in the Sidebar ("Sidebar... Contains tag filters"), and roadmap.md's Step 8 entry literally says "Make sidebar tags functional." The existing components/sidebar/TagList.tsx (a static placeholder since Step 1) was built specifically for that Sidebar-based design.

These don't reconcile to the same layout, so I looked at what each actually requires architecturally rather than guessing:

Sidebar placement would require restructuring AppLayout to accept a second slot (it currently only takes one children prop, used for Content) so that a Server Component (page.tsx) could fetch tags and hand them to Sidebar the same way it hands Content to AppLayout today. Sidebar itself is a Client Component with no data-fetching path currently — giving it real tag data means either this multi-slot AppLayout refactor, or fetching tags twice in unrelated places.
Above-Knowledge-Base-content placement requires none of that: Content.tsx already fetches data server-side and passes it to KnowledgeBase as props. Adding getTags() to the same Promise.all() and passing it down is a two-line change to an already-existing, working data path.
Given the task's own "Simplicity" section ("reuse the existing architecture wherever possible," "avoid unnecessary abstractions"), and that the literal task wording already says "above the Knowledge Base content," I recommend building the real, functional tag filter as a new component inside Content/KnowledgeBase's existing tree, not relocating into the Sidebar.

Trade-off I want to be upfront about: this leaves the Sidebar's existing TagList.tsx as a stale, non-functional placeholder — still showing fake hardcoded tag names that do nothing, on both desktop and the mobile Sheet. I'm not proposing to touch or remove it in this step (out of scope, and removing it might be a call you want to make deliberately, e.g. repurposing the Sidebar for something else later). Flagging this now so it's a known, deliberate gap rather than something we forgot.

Overall Architecture

Content.tsx (Server)
    fetches: categories, questions, tags
        ↓
KnowledgeBase.tsx (Client)
    renders: <TagFilter tags={tags} /> always, then either the
    category-Accordion view or the flat search-results view below it
        ↓
TagFilter.tsx (Client, new)
    reads/toggles selectedTags via the shared filter context
Files Added or Modified
New:

frontend/lib/filterByTags.ts — pure function, mirrors search.ts's pattern.
frontend/components/content/TagFilter.tsx — the clickable tag-chip row.
Modified:

frontend/hooks/useSearch.tsx — evolves to also hold tag-selection state (see below).
frontend/components/content/Content.tsx — adds getTags(TECHNOLOGY) to the existing Promise.all(), passes tags down.
frontend/components/content/KnowledgeBase.tsx — computes the combined pipeline, renders TagFilter, and the "hide empty categories" behavior.
Untouched: components/sidebar/TagList.tsx, Sidebar.tsx, AppLayout.tsx's slot structure, SearchBar.tsx's own rendering.

How SearchProvider Should Evolve
In Step 6 you asked me to keep SearchProvider scoped only to search and not pre-add tag/technology/language placeholders — that was correct then, because tags weren't being implemented yet. They are now, so I think it's the right time to extend it, rather than create a second parallel context.

I'd rename it to reflect what it actually holds going forward: hooks/useSearch.tsx → hooks/useKnowledgeBaseFilters.tsx, exporting KnowledgeBaseFilterProvider + useKnowledgeBaseFilters(), holding:


{ query: string; setQuery: (q: string) => void;
  selectedTags: string[]; toggleTag: (tag: string) => void }
Why one combined context instead of two separate ones (a second TagFilterProvider alongside SearchProvider): query and selectedTags are always consumed together at exactly one place (KnowledgeBase, to compute the visible question list) — they're really one "current filter criteria" concern, not two independent ones. One provider means one useContext call at the consumption site instead of two, and avoids provider-nesting growing for what's conceptually a single piece of state. The rename cost is small and mechanical (three import sites: AppLayout, SearchBar, KnowledgeBase).

If you'd rather keep SearchProvider untouched and add a second, separate TagFilterProvider instead (each staying single-purpose, at the cost of two nested providers and two hook calls at the consumption site), that's a reasonable alternative I'm happy to switch to — flagging it as a real choice, not just picking one silently.

How Tag Filtering Integrates With Search
Exactly the pipeline the task describes:


const visible = filterByTags(searchQuestions(questions, query), selectedTags);
computed once in KnowledgeBase, then branched on for rendering mode:

query empty: group visible by category (same as today), but a category with zero questions after filtering is simply not rendered. If visible is empty entirely, show the existing empty state.
query non-empty: flat list of visible as QuestionAccordions with the "Search Results (N)" heading (N now reflects both filters), or the empty state if zero.
filterByTags itself: selectedTags.length === 0 → passthrough (no-op); otherwise selectedTags.every((tag) => question.tags.includes(tag)) — literal AND matching, exactly as specified.

Edge Cases / Trade-offs
No "clear all tags" button — not in the stated requirements (only "clicking a selected tag deselects it"), and the Simplicity section says not to build for anything not required. Deselecting one at a time is the only reset mechanism this step provides.
Stale Sidebar placeholder, as discussed above — a known, deliberate gap, not an oversight.
Tag chips styled via the existing Button component (small, pill-shaped, variant="default" when selected / variant="outline" when not), not Badge — because every other clickable element in this app (TechnologyTabs, LanguageSwitcher, the search clear button) is a Button, and Badge isn't built as an interactive element. Keeps this consistent with existing patterns rather than introducing a second "clickable chip" convention.
Waiting for your decisions on the two flagged choices (tag placement, and single-vs-split context) before writing any code.

Updated Implementation Plan
Incorporating both decisions: tags render in the real Sidebar (with the small AppLayout refactor that requires), and SearchProvider/useSearch keep their names, just gaining tag-selection state.

Architecture Change: AppLayout Gains a Second Slot
Since Sidebar needs real server-fetched tag data the same way Content needs categories/questions, and Sidebar is a Client Component (can't fetch server-side itself), the fix is the same pattern already used for Content in Step 4 — a Server Component renders it and hands it down as a prop:


app/page.tsx (Server)
    fetches: tags (for Sidebar)
    renders: <AppLayout sidebar={<Sidebar tags={tags} />}><Content /></AppLayout>
        ↓
AppLayout (Client) — now takes {sidebar, children} instead of just {children}
        ↓
Sidebar (Client) — now accepts tags: Tag[], forwards to TagList (both desktop aside and mobile Sheet copies)
        ↓
TagList (Client) — real component now: sorted chips, reads/toggles selectedTags via useSearch()
AppLayout no longer imports Sidebar directly — it just renders {sidebar} where it used to render <Sidebar />, exactly mirroring how it already handles {children} for Content.

One small cleanup I'd fold in while touching these files: right now the technology slug "react" is hardcoded separately inside Content.tsx. Since page.tsx now also needs it (to call getTags("react") for the Sidebar), I'd rather define it once in page.tsx and pass it into Content as a technology prop, than have the same magic string duplicated in two files. Small, contained, and avoids a duplication I'd otherwise be introducing myself in this exact change — not scope creep into Step 9's real technology-switching.

Files Added or Modified (Revised)
New:

frontend/lib/filterByTags.ts
Modified:

frontend/hooks/useSearch.tsx — same names (SearchProvider, useSearch), extended with selectedTags: string[] and toggleTag(tag: string): void.
frontend/app/page.tsx — fetches tags, defines the technology constant once, passes sidebar prop into AppLayout and technology prop into Content.
frontend/components/layout/AppLayout.tsx — {children} → {sidebar, children}; drops its own Sidebar import.
frontend/components/sidebar/Sidebar.tsx — accepts tags: Tag[], forwards to both TagList render sites (desktop aside + mobile Sheet).
frontend/components/sidebar/TagList.tsx — becomes real: accepts tags: Tag[], sorts alphabetically, renders Button-based chips (variant="default" selected / "outline" unselected, rounded-full, size="sm"), wired to useSearch().
frontend/components/content/Content.tsx — accepts technology: string prop instead of its own hardcoded constant; otherwise unchanged (still only fetches categories/questions — it turns out KnowledgeBase never needed the full Tag[] list at all, only selectedTags from context, so no tag-fetching needed here).
frontend/components/content/KnowledgeBase.tsx — computes filterByTags(searchQuestions(questions, query), selectedTags) once; empty-query branch now also drops categories with zero visible questions.
No TagFilter.tsx — that component from my first proposal is no longer needed, since tags live in the Sidebar via the real TagList, not as a new component above the content.

Everything else — pure filterByTags, AND matching, the combined pipeline, hiding empty categories, immediate updates with no debounce, Button-based chips — unchanged from what you already approved.

Ready to implement this version — let me know if this matches what you had in mind before I write any code.

Summary
Implemented tag filtering per the revised plan — real Sidebar tags, extended SearchProvider, pure filterByTags.

Created Files
frontend/lib/filterByTags.ts — pure function, AND semantics (selectedTags.every((tag) => question.tags.includes(tag))), passthrough when no tags selected.
Updated Files
hooks/useSearch.tsx — same names (SearchProvider, useSearch), extended with selectedTags: string[] and toggleTag(tag).
app/page.tsx — now the single place defining technology; fetches getTags(), passes sidebar={<Sidebar tags={tags} />} into AppLayout, and technology into Content (removing the duplicated hardcoded "react" that would otherwise have existed in two files).
components/layout/AppLayout.tsx — {children} → {sidebar, children}, no longer imports Sidebar directly.
components/sidebar/Sidebar.tsx — accepts tags: Tag[], forwards to both TagList instances (desktop aside + mobile Sheet).
components/sidebar/TagList.tsx — real component now: alphabetically sorted, Button-based chips (default variant when selected, outline otherwise), wired to useSearch().
components/content/Content.tsx — accepts technology prop instead of its own constant.
components/content/KnowledgeBase.tsx — computes filterByTags(searchQuestions(questions, query), selectedTags) once; empty-query view now drops categories with zero visible questions; both branches share one EmptyState helper.
Verification
✅ npx tsc --noEmit, npm run lint, npm run build — all clean, static prerender still succeeds.
✅ Ran the dev server fresh and confirmed real tag names (from the actual data/tags/react.json) render in the sidebar, 12 categories show by default, zero errors in the log.
✅ Real interactive tests again (same jsdom + Testing-Library approach as Step 6, temporary dev-only deps, removed after): rendered SearchBar + Sidebar + KnowledgeBase together exactly as composed in the real app, and confirmed by simulated clicks/typing:
All 75 real tags render, correctly sorted alphabetically.
Selecting "useEffect" narrows 12 categories down to 1 (only Hooks has useEffect-tagged questions) — genuine filtering, not a no-op.
Deselecting the same tag restores all 12.
AND logic specifically confirmed, not just assumed: computed from real data that 6 questions have useEffect, 6 have useState, and exactly 2 have both — then verified the UI reflects the intersection behavior, not a union.
Combining a tag selection with a search query produced "Search Results (4)" — a count I computed independently from the raw dataset first, then checked it matched exactly.
Not continuing to the next step — waiting for your review.

Summary
Updated tag filtering to the single-select, search-like UX you described.

Updated Files
hooks/useSearch.tsx — selectedTags: string[] → selectedTag: string | null; toggleTag → selectTag(tag), which selects, replaces, or clears (if clicking the currently-selected tag) via current === tag ? null : tag.
components/sidebar/TagList.tsx — reads/calls selectedTag/selectTag instead of the array versions; selected-state check is now selectedTag === tag.name.
components/content/Content.tsx — no longer renders <main> itself; just fetches data and delegates entirely to KnowledgeBase.
components/content/KnowledgeBase.tsx — now owns the scrollable <main> (needed a ref to it for point 4). Rendering logic simplified: isFiltering = query.trim() !== "" || selectedTag !== null. When false → the original, unfiltered category view (the "hide empty categories" logic from before is gone — it's now unreachable, since any tag selection immediately switches to flat results mode instead of combining with the category view). When true → flat QuestionAccordion list (or the empty state), applying both searchQuestions and filterByTags together — search and tag filtering now share one code path instead of two.
A useEffect on [selectedTag] calls scrollRef.current?.scrollTo({ top: 0, behavior: "smooth" }).
lib/filterByTags.ts itself is untouched — still takes string[]; the call site just passes selectedTag ? [selectedTag] : [], keeping the already-reviewed pure function stable.

Architectural Note
Scoped the scroll-to-top effect to selectedTag changes only, per your literal wording ("after selecting or changing a tag") — it does not fire on search-query changes. Worth flagging: the effect also fires once on initial mount (harmless — the page is already at the top then), which I only discovered because jsdom doesn't implement scrollTo at all and threw on it during testing; had to stub it globally to test around that real environment gap.

Verification
✅ tsc --noEmit, npm run lint, npm run build — all clean.
✅ Ran the dev server fresh — HTTP 200, zero errors in the log.
✅ Real interactive tests (jsdom + Testing Library, temporary, removed after) confirmed all 4 requested behaviors concretely: selecting a tag switches to flat "Search Results (6)" mode (not 12 categories); selecting a second tag replaces the first (verified against useState's independently-computed count, not useEffect's); clicking the same tag again clears it and restores the exact 12-category default view; and scrollTo({ top: 0, behavior: "smooth" }) is called specifically in response to the tag-selection click (distinguished from the mount-time call by tracking call count, not just whether it was ever called).
Ready for your review — let me know if this is what you had in mind for Step 7.

Root Cause and Fix
The bug: <main ref={scrollRef}> was never actually a scroll container in the browser. Two ancestors in the height chain used min-height instead of a bounded height:

app/layout.tsx: <body className="min-h-full ...">
components/layout/AppLayout.tsx: root <div className="flex min-h-screen ...">
min-height lets an element grow past its constraint to fit its content — it doesn't cap it. So when <main>'s content was taller than the viewport, <body> and the layout wrapper simply grew taller too, right along with it. Since nothing above <main> was ever actually clipped, <main>'s own overflow-y-auto had nothing to do — the real overflow (and the real scrolling) was happening at the window/html level instead. Calling mainElement.scrollTo(...) was therefore scrolling an element that was never scrollable — a silent no-op, not an error, which is why nothing showed up in the earlier verification (which only checked that the JS call happened, not that it had any visual effect).

The fix: changed both to bounded h-full (<html> already correctly used h-full, so this just completes the chain: html → body → AppLayout's wrapper, all exactly viewport height). That makes the middle flex row's flex-1 overflow-hidden — and the overflow-y-auto on <main> and the Sidebar <aside> — actually engage as real, independently-scrolling regions, matching the original intended design (sticky header, independently scrolling sidebar and content).

Verified with a real browser, not just reasoning: I installed Playwright (temporarily) and drove an actual headless Chromium instance against the running dev server — expanded every category to force real overflow, manually scrolled <main> down, then clicked a tag and checked the actual scrollTop. To make sure this wasn't a false-positive test, I also deliberately reverted the CSS fix and reran the identical test: it correctly failed (main.scrollTop stayed at 0 the whole time — proving main genuinely wasn't scrollable in the buggy version, while window.scrollY moved instead), then passed again once the fix was restored. Both temporary tools (Playwright, its Chromium binary from node_modules) were removed afterward; tsc/lint/build all still pass.

The scroll-to-top behavior should now work correctly in your browser — let me know if you'd like me to double check anything else before we close out Step 7.

This is a stale scheduled prompt from while the Chromium download was still in progress — that work is already fully finished and reported on in my last message. To recap what's already done and confirmed:

Root cause found: <body> (min-h-full) and AppLayout's wrapper (min-h-screen) let the page grow instead of being capped at viewport height, so <main> never actually overflowed — scrollTo() on it was a silent no-op, and the window was the real (unintended) scroll container.
Fix applied: both changed to h-full, completing the bounded-height chain from <html> down to <main>.
Verified with a real headless Chromium via Playwright (installed temporarily, removed after): confirmed main genuinely overflows and scrolls now, confirmed the fix by also deliberately reverting it and watching the same test correctly fail, then restored the fix and confirmed it passes again.
Cleanup done: Playwright package removed from node_modules, tsc/lint/build all clean.
Nothing further is pending on this — the scroll-to-top fix is verified and in place. Let me know if you'd like anything else checked before considering Step 7 complete.