Step 10 — Language Switching: Proposed Architecture
What I Reviewed
docs/roadmap.md, Step 10: "Language switching should affect only displayed content while preserving the current navigation state."
docs/prompts/build-frontend/frontend-design.md: Language Switcher supports EN/UA, "Switches interface language... Question content depends on available datasets."
docs/prompts/build-frontend/user-flow.md, Flow 8: "UI updates immediately. Question content changes only if that language dataset exists. Otherwise, the current content remains unchanged."
docs/prompts/build-frontend/user-flow.md, Flow 10 (Future deep-linking): /react/usememo — no language segment in the URL.
docs/prompts/build-frontend/frontend-architecture.md: lists "language" as Context-based global state, alongside search query and selected tags — written before Step 9's URL-based technology decision, but still directive for language specifically.
Current implementation: types/common.ts already has Language = "en" | "uk" and LocalizedText = Record<Language, string>. Question.question/Question.answer are LocalizedText — already fully bilingual in a single record. QuestionAccordion.tsx and lib/search.ts currently hardcode .en. Category.name/description and Tag.name are plain strings, not LocalizedText.
I checked the actual data (data/enriched/*.json for all 4 technologies): every question has both en and uk fully populated, no gaps. data/categories/*.json and data/tags/*.json are English-only — there is no Ukrainian variant of category/tag names anywhere in the dataset.
This last point matters for a data-driven decision: categories and tags stay English-only, by design of the actual data, not by an oversight I'm working around. Only question/answer text is bilingual.

Core Decision: Language Lives in Context, Not the URL
Two independent signals point the same direction:

Flow 10's future deep-link URL (/react/usememo) has no language segment.
frontend-architecture.md explicitly groups "language" with other Context-held global state.
So, unlike technology, language stays purely client-side Context state — no routing changes, no new Server Component re-fetch.

How localized data is loaded: it already is. getQuestions(technology) returns every question with both en and uk text in one fetch. Switching language requires zero new data loading — just picking a different field client-side. This is a nice payoff from the LocalizedText decision made back in Step 2.

Answering Your Specific Questions
Representation: a Language value ("en" | "uk", reusing the existing type) held in a new, dedicated Context — not a boolean/string ad hoc.

URL reflection: No — confirmed by Flow 10's URL shape and the architecture doc's classification of language as Context state.

Interaction with technology routing: none needed. Switching technology re-fetches technology-scoped data (unchanged from Step 9); switching language just changes which field of the already-loaded bilingual data is displayed. These two concerns don't overlap.

Preserving current technology when switching language: automatic — since language doesn't touch routing at all, the current route/technology is completely unaffected by a language change.

Search/tag filtering behavior after a language change: should be preserved, not reset — Flow 8 says nothing about resetting search or filters, and the roadmap explicitly says language switching should preserve navigation state. Practically: searchQuestions needs to become language-aware (matching against the currently-selected language's text instead of hardcoded .en), so changing language while a search query is active will naturally re-filter the same typed query against the other language's text — the query itself isn't cleared.

What should reset vs. persist, and why this needs a real architectural decision, not just "add a field":
I initially considered just adding language onto the existing SearchProvider (which already holds query/selectedTag), since they're grouped together in the architecture doc. But there's a conflict: in Step 9, SearchProvider is deliberately remounted via key={technology} so query/tag reset on every technology switch. Language must not reset on a technology switch — it's a persistent interface preference, not a per-view filter. If I put language in the same provider, switching technology would silently reset language back to English, contradicting the "preserve navigation state" requirement.

So I'm proposing a separate, small LanguageProvider/useLanguage (structurally identical to useSearch — same pattern, its own file), mounted in AppLayout outside the keyed SearchProvider:


<LanguageProvider>
  <SearchProvider key={technology}>
    ...
  </SearchProvider>
</LanguageProvider>
This gives each provider a single, clear responsibility — SearchProvider for per-technology-view filter state (resets on tech switch), LanguageProvider for a persistent global preference (survives tech switches) — rather than one provider with mixed reset semantics.

Server vs. Client components: no Server Component changes at all. Content.tsx, the new [technology]/page.tsx, and the data services are entirely untouched — this step is 100% client-side presentation logic.

Should any components be generalized/refactored:

QuestionAccordion.tsx — reads useLanguage(), renders the resolved question/answer text instead of hardcoded .en.
lib/search.ts — searchQuestions gains a language parameter, matches against the resolved text.
KnowledgeBase.tsx — reads useLanguage(), passes it into searchQuestions.
LanguageSwitcher.tsx — becomes functional (EN/UA buttons, active-state highlighting, calls setLanguage).
One new tiny pure helper, resolveLocalizedText(text: LocalizedText, language: Language): string, returning text[language] || text.en. This directly implements Flow 8's documented fallback rule ("otherwise, the current content remains unchanged"/falls back). The live dataset has zero gaps today, but the fallback is explicitly speced behavior, not something I'm inventing — and it's a one-line function, not overengineering.
No change to CategoryAccordion.tsx, TagList.tsx, Category/Tag types, or any service — confirmed by the data that these aren't localized.
Deep-linking support: fully compatible — a future /[technology]/[question] segment (Step 9's precedent) would render using whatever language is currently in LanguageProvider's Context, exactly as it does today; no structural rework needed later.

Concrete Plan
New:

frontend/hooks/useLanguage.tsx — LanguageProvider/useLanguage, holding { language, setLanguage }, default "en".
frontend/lib/resolveLocalizedText.ts — the fallback-aware text resolver.
Modified:

components/layout/AppLayout.tsx — wrap with LanguageProvider outside the keyed SearchProvider.
components/header/LanguageSwitcher.tsx — real EN/UA buttons bound to useLanguage().
components/content/QuestionAccordion.tsx — use resolveLocalizedText for question/answer.
lib/search.ts — searchQuestions(questions, query, language).
components/content/KnowledgeBase.tsx — read useLanguage(), thread it into searchQuestions.
Untouched: all Server Components, all services, routing, Category/Tag types, CategoryAccordion, TagList, SearchBar.

Trade-offs
A second provider is one more piece of tree structure, but it's justified by genuinely different lifecycle semantics (persist vs. reset-on-technology-switch) — merging them would either lose that distinction or require extra conditional logic inside one provider to special-case which fields survive a remount, which is messier than two small, single-purpose providers.
The fallback helper handles a case (missing translation) that doesn't exist in today's data, but it's explicitly documented in Flow 8 and costs one trivial function — I'd rather implement the spec's stated behavior than skip it and hope it's never needed.
Waiting for your approval before writing any code.


Summary
New files:

frontend/hooks/useLanguage.tsx — LanguageProvider/useLanguage, holding { language, setLanguage }, default "en", no persistence across reloads (per our discussion).
frontend/lib/resolveLocalizedText.ts — resolveLocalizedText(text, language), returns text[language] || text.en, implementing Flow 8's documented fallback behavior.
Modified:

frontend/app/layout.tsx — wraps {children} in <LanguageProvider>. This is the one deviation from my original proposal, explained below.
frontend/components/header/LanguageSwitcher.tsx — real EN/UA buttons bound to useLanguage().
frontend/components/content/QuestionAccordion.tsx — renders resolveLocalizedText(question.question, language) / resolveLocalizedText(question.answer, language) instead of hardcoded .en.
frontend/lib/search.ts — searchQuestions now takes a language parameter and matches against the resolved text for that language.
frontend/components/content/KnowledgeBase.tsx — reads useLanguage(), threads it into searchQuestions.
Untouched (as expected): all Server Components/services, AppLayout.tsx (ended up identical to its Step 9 state), CategoryAccordion, TagList, Category/Tag types.

One correction from the proposal, caught by real-browser testing, not just code review: I originally put LanguageProvider inside AppLayout, above the key={technology}-remounted SearchProvider, reasoning that it would survive technology navigation since it wasn't itself given a key. Testing proved that wrong — Next.js only preserves Client Component state across navigation for components rendered inside a layout.tsx; anything rendered inside page.tsx (which is where AppLayout lives) gets torn down and rebuilt on every navigation, key or no key. I confirmed this against Next's own docs (template.md: "layouts persist across routes and maintain state... unlike templates"). Fix: moved LanguageProvider to the actual root app/layout.tsx, which Next.js never remounts regardless of which technology page is active.

Verification:

tsc --noEmit, lint, build — all clean; all four technology pages still statically generated.
Real headless-Chromium (Playwright, temporarily installed and removed afterward) tests against npm run start, confirming: EN active by default; switching to UA actually changes question/answer text; URL is unaffected by language switch; search query survives a language switch; language now correctly persists across a technology switch (the bug found above); tag/category labels stay English regardless of active language (confirmed as a real data-driven boundary, not a gap).
Re-ran the Step 9 technology-switch checks afterward to confirm no regression: search query and tag selection still correctly reset on technology switch, exactly as before.
Ready for your review.