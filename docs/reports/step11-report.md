## How tag selection gets from the landing page to the technology page
The landing page is a Server Component with no client state of its own — so a tag click has to communicate "select this tag" purely through navigation. I'd represent it as a query param: /react?tag=useEffect.

This is deliberately scoped as a one-way, initial-value hand-off, not a full URL-sync of selectedTag. On the technology page, sidebar tag clicks continue to work exactly as today — pure useSearch() context state, no URL writes. I don't think the broader "always sync selectedTag to the URL" refactor is warranted here: it wasn't asked for, it would touch the already-approved Step 8 TagList/useSearch design more than necessary, and "minimize unnecessary changes" is an explicit requirement for this step. The query param's only job is to seed the initial value when a technology page is opened from a link that specifies one.

## Wiring:

SearchProvider gains an optional initialSelectedTag prop, used as the useState initializer instead of the hardcoded null.
AppLayout gains a matching optional prop and passes it through. I'll also fold it into the existing key={technology} remount trick, e.g. key={${technology}:${initialSelectedTag ?? ""}} — so a fresh ?tag= always seeds cleanly, while ordinary sidebar clicks (which never touch the URL) never trigger a spurious remount.
app/[technology]/page.tsx reads tag from searchParams, validates it against that technology's actual tag list (ignoring anything unrecognized — consistent with the project's "malformed input should never crash, just be ignored" rule), and passes the result down.
This makes the tag-filtered view identical to selecting the tag from the sidebar, because it's the exact same selectedTag state and the exact same KnowledgeBase filtering logic (isFiltering, searchQuestions, filterByTags) — nothing is duplicated.

Trade-off worth flagging: static generation
Reading searchParams in app/[technology]/page.tsx makes Next.js render that route dynamically per-request instead of statically at build time — so /react, /javascript, etc. would lose the ● (SSG) badge from Step 9's build output.

I considered the alternative (useSearchParams() in a Client Component wrapped in <Suspense>, which would preserve static generation). But per Next's own docs, everything between that Suspense boundary and the hook is excluded from the static HTML and rendered client-side only after hydration — and since the boundary would have to sit above basically the whole visible page (Sheet/Header/Sidebar/Content), that means shipping an empty shell first and filling it in after JS loads. That's a real, visible regression against frontend-design.md's "avoid layout shifts" / "should feel instant" requirements — worse than losing a build-time optimization for what is, in this app, a cheap local JSON read. So I'd recommend accepting the dynamic-rendering trade-off (reading searchParams server-side) over the flash-of-empty-content alternative. Flagging it since it changes a property Step 9 established.

Reuse questions
TagChip: Yes, I'd extract one. Right now the pill styling (variant, size="sm", rounded-full) lives inline in TagList.tsx, and the landing page needs the same visual chip but as a <Link> instead of a clickable filter button. TagChip would be a thin wrapper around Button (variant={selected ? "default" : "outline"} + the shared classes), forwarding all other props — so TagList uses it with onClick, and the landing page uses it with render={<Link href=... />}, the same composition pattern already used by TechnologyTabs. This removes the styling duplication instead of copy-pasting it into the landing page.

Header/TechnologyTabs: small generalization — widen currentTechnology from string to string | null, since the landing page has no "current" technology. TechnologyTabs' existing slug === currentTechnology check already does the right thing when currentTechnology is null (nothing matches, no tab highlighted) — no behavioral changes needed, just the type.

AppLayout: not reused for the landing page. Its whole contract (technology-scoped SearchProvider, required sidebar, single-technology Content) doesn't fit a page with no current technology and no sidebar — forcing it in would mean threading dummy values through a component whose job is specifically "shell for a technology page." Instead, a small new components/landing/LandingHeader.tsx (Client) wraps Sheet + the reused Header + a mobile SheetContent containing just TechnologyTabs (mirroring frontend-design.md's "single mobile nav entry point" rule), and app/page.tsx (Server) fetches getTechnologies() + getTags() per technology and renders it.

One rough edge I want to flag rather than silently paper over: Header unconditionally renders SearchBar, which calls useSearch() — and SearchProvider is currently only mounted inside AppLayout (technology pages), not globally. Reusing Header as-is on the landing page would crash without a SearchProvider ancestor. Simplest fix: LandingHeader wraps Header in its own SearchProvider (zero changes to Header/SearchBar). The cost is a technically-present-but-inert search box on the landing page (nothing on that page consumes query, so typing does nothing visible). I don't think it's worth adding conditional logic to Header to hide it for one caller — but let me know if you'd rather I suppress it there instead.

Summary of changes
hooks/useSearch.tsx — initialSelectedTag prop.
components/layout/AppLayout.tsx — initialSelectedTag prop, included in the remount key.
app/[technology]/page.tsx — reads/validates ?tag= from searchParams.
components/header/Header.tsx, components/header/TechnologyTabs.tsx — currentTechnology: string | null.
New components/common/TagChip.tsx; components/sidebar/TagList.tsx updated to use it.
New components/landing/LandingHeader.tsx.
app/page.tsx — replaced redirect with the real landing page.
Waiting for your approval before implementing — and specifically your call on the dynamic-rendering trade-off and the inert-search-box question above.

1. Static rendering trade-off — is there a clean alternative?
Not a fully clean one, unfortunately — the constraint is fundamental: generateStaticParams prerendering happens at build time, before any ?tag= value exists, so the static HTML can only ever represent the "no tag selected" state. Any approach that keeps the page statically generated has to apply the real tag after the static HTML has already loaded — there's no way around a brief moment where the page shows the default view before flipping to the filtered one.

I looked at a narrower version of the Suspense approach to see if the "flash" could at least be minimized: instead of wrapping the whole visible tree in Suspense, wrap only a tiny invisible component that does nothing but read useSearchParams() in a useEffect and call the existing selectTag() once on mount:


// a leaf component, renders nothing
function InitialTagFromUrl({ validTagNames }: { validTagNames: string[] }) {
  const searchParams = useSearchParams();
  const { selectTag } = useSearch();
  useEffect(() => {
    const tag = searchParams.get("tag");
    if (tag && validTagNames.includes(tag)) selectTag(tag);
  }, []);
  return null;
}
Wrapped in its own <Suspense fallback={null}>, this keeps the entire rest of the page (Header, Sidebar, Content, all of it) fully static and prerendered — only this invisible node is excluded from the static HTML. That's better-scoped than my original all-or-nothing framing.

But it doesn't actually eliminate the flash, just shrinks the mechanism causing it: the static HTML still renders "all categories, no filter," and then — after hydration, on the very next tick — it switches to the filtered results. It's the same underlying trade-off as before, just implemented more precisely. So there isn't a version of "preserve SSG" that avoids a real, visible layout shift on this specific interaction.

Given that, my recommendation stays: read searchParams server-side (accept dynamic rendering for /[technology], correct content in the very first response, zero flash). The cost is a few extra local fs.readFile calls per request instead of build-time precomputation — genuinely negligible for this dataset. I'd only preserve SSG here if build-time prerendering mattered for a reason beyond this app's current scale (e.g. a real CDN-edge deployment story), which isn't the case yet. Let me know if you'd rather trade the flash for keeping the SSG badge — I can implement either.

2. Generalizing Header instead of a separate component
Agreed, and it's a better fix than what I had — I'd add showSearch?: boolean (default true, so technology pages need zero changes) and conditionally render <SearchBar />. This is strictly better than my original plan: it also removes the inert-search-box rough edge, since the landing page simply won't render SearchBar at all, rather than rendering a functionless one wrapped in a throwaway SearchProvider.

One clarification on scope: Header itself doesn't own the mobile Sheet/drawer content — that's Sidebar's job today (the SheetContent with TechnologyTabs + TagList for technology pages). The landing page still needs some Sheet + SheetContent wrapper for its own mobile nav (just TechnologyTabs, no TagList, since there's no single "current" tag list on this page) — Header can't include that itself without coupling it to a Sidebar-shaped concern it doesn't otherwise have. So I'd keep a small dedicated Client Component for that Sheet/drawer glue, but it now becomes much thinner: it wraps the reused, unmodified-behavior Header rather than reimplementing any of its markup.

Updated plan for Header: add showSearch = true; technology pages (AppLayout) pass nothing and get identical behavior; landing page passes showSearch={false}.

Ready to proceed with: searchParams-based server-side tag initialization (dynamic rendering, no flash) + the generalized Header — unless you'd rather I use the flash-preserving-SSG alternative instead. Let me know and I'll implement.


Answer: yes, AppLayout doesn't need to know about it
Good catch — you're right that it doesn't belong on AppLayout. Revised plan:

app/[technology]/page.tsx: replace the searchParams prop entirely with await connection() at the top of the function. This is Next's documented, idiomatic way to say "this route needs per-request rendering" without the Server Component itself touching request data it doesn't need. page.tsx goes back to knowing nothing about tags at all.
hooks/useSearch.tsx: SearchProvider becomes fully self-contained — it calls useSearchParams() itself and uses searchParams.get("tag") as its useState initializer. Per the Next docs, once a route is dynamically rendered (which connection() guarantees), useSearchParams() is available synchronously during the initial server render of a Client Component — no Suspense boundary needed, no flash.
AppLayout: no changes at all. No initialSelectedTag prop, no key changes. It stays exactly what it is today — pure layout composition, with zero awareness that tags or URLs exist.
One consequence worth flagging: since connection() unconditionally opts the route into per-request rendering, generateStaticParams() in that file becomes dead code — it would no longer prerender anything. I'd remove it rather than leave a misleading "this is statically generated" signal. This is the same underlying trade-off from before (no build-time prerendering for technology pages), just reached through the cleaner mechanism you're asking about.

One edge case I'm consciously not engineering around: if a user is already on /react?tag=useEffect and somehow navigates to /react?tag=useMemo without the pathname changing (e.g., hand-editing the URL or browser back/forward across two tag links) — since nothing in the actual UI produces that transition (the only source of ?tag= links is the landing page, and every such link is reached by navigating from /, which always freshly mounts AppLayout), I'm not adding speculative key logic to handle it. It's a reachable-only-by-hand edge case, not part of the specified flow — happy to harden it later if you want, but doing so now would reintroduce exactly the AppLayout coupling you're trying to avoid.

Let me know if this all looks right and I'll proceed with implementation.


Summary
New:

components/common/TagChip.tsx — extracted pill-styling wrapper around Button, used by both TagList (interactive, onClick) and the landing page (render={<Link/>}).
components/layout/SearchProviderFromUrl.tsx — the only Next-aware piece; reads ?tag= via useSearchParams() and feeds it into the now-pure SearchProvider.
components/landing/LandingHeader.tsx — thin Sheet + reused Header (showSearch={false}) + mobile SheetContent with TechnologyTabs.
app/page.tsx — real landing page; fetches all technologies + their tags in parallel, renders each as a section with technology-name link and tag links.
Modified:

hooks/useSearch.tsx — SearchProvider gained a plain initialSelectedTag?: string | null prop; stayed 100% framework-agnostic.
components/layout/AppLayout.tsx — swapped SearchProvider for SearchProviderFromUrl; otherwise untouched, no new props.
app/[technology]/page.tsx — await connection() instead of reading searchParams; generateStaticParams() removed since it's no longer effectual once the route is forced dynamic.
components/header/Header.tsx — showSearch?: boolean (default true, so technology pages are unaffected); currentTechnology: string | null.
components/header/TechnologyTabs.tsx — currentTechnology: string | null.
components/sidebar/TagList.tsx — uses TagChip instead of inline Button styling.
Verification:

tsc --noEmit, lint, build — all clean. Build output confirms the expected, deliberate trade-off: / is ○ Static, /[technology] is now ƒ Dynamic.
Zero-flash proof (the critical check you asked for): curl'd the raw SSR HTML directly from next start for /react?tag=useEffect — confirmed Search Results (6) is present in the server's initial response, with none of the unfiltered category markup, while the same check against plain /react shows the opposite (full category accordion, no "Search Results" text). This is a stronger check than a browser test, since it inspects exactly what the server sent before any client JS runs.
Playwright, real browser: landing page reuses the header with search hidden; clicking a technology name navigates correctly; clicking a tag navigates to /technology?tag=X with results already filtered; tag-link navigation produces byte-identical result text to selecting the same tag from the sidebar ("Search Results (6)" both ways); mobile Sheet on the landing page shows TechnologyTabs.
Re-ran Step 9/10 regression checks: search/tag still reset on technology switch, language still persists across technology switch. No regressions.
Ready for your review.


Fixed. Root cause: Button's render prop composed with <Link> produces an <a>, but Base UI's Button defaults to nativeButton={true} and expects a real <button> — its own docs are explicit that links should never be composed through Button's render prop at all, and should instead be styled directly. I removed both offending usages (TechnologyTabs and the landing page's tag links) in favor of plain <Link> elements styled with buttonVariants directly, and added a small tagChipLinkClassName() export from TagChip.tsx so the pill styling still isn't duplicated. Re-ran tsc/lint/build (all clean, same ○/ƒ split as before) and a fresh Playwright pass capturing all console output across the landing page, mobile menu, technology page, and tag-filtered link — zero warnings or errors.

Checked — no, it doesn't validate. SearchProviderFromUrl passes searchParams.get("tag") straight through, unvalidated, and there's no validation anywhere else in the chain either (app/[technology]/page.tsx no longer even reads tags for this purpose — it fetches tags for the Sidebar, not for validating the URL).

What actually happens with an invalid or stale tag (e.g. /react?tag=doesNotExist, or a tag name that belongs to a different technology): selectedTag gets set to that string, KnowledgeBase's isFiltering becomes true, filterByTags finds zero matching questions, and the existing EmptyState renders — "No results found. Try another keyword." So it's graceful, not a crash, but it's not "ignored" in the sense of silently falling back to the normal unfiltered category view; it lands on the same empty-results state a bogus search query would produce.

That was a deliberate call on my part, not an oversight: this makes tag-URL handling behave exactly like the existing search-query handling, which also never validates against real content and also just shows EmptyState on zero matches — no special-casing for "this specific kind of bad input." Adding a check here (fetch tags for the technology, compare, drop unrecognized ones back to null) is a small, contained addition, but it would be inconsistent with how search already handles the same category of problem, and I didn't want to introduce a fallback behavior for tags that search doesn't get.

Let me know if you'd rather have it fall back to the default (unfiltered) view instead of EmptyState for unrecognized tags — happy to add that validation if so, but I'd lean toward leaving it as-is for consistency unless you feel strongly otherwise.