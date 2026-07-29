Step 9 — Technology Switching: Proposed Architecture
What I Reviewed
Re-confirmed the relevant docs and the current implementation before designing this:

frontend-design.md — Technology Switcher: "Top navigation... Changing technology loads another dataset. No page reload."
user-flow.md, Flow 4 — explicitly states: "Search and filters are reset" and "Categories update" when switching technology. This directly answers one of your open questions — yes, state should reset.
roadmap.md, Step 9 — "Make TechnologyTabs functional... content should update without changing the application structure."
Current implementation: services/knowledge-base.ts already has getQuestions/getCategories/getTags(technology) and getTechnologies() — all technology-aware since Step 3, unused until now. app/page.tsx hardcodes const TECHNOLOGY = "react". TechnologyTabs.tsx is a fully static placeholder (hardcoded labels, no navigation, no active-state logic). hooks/useSearch.tsx holds {query, selectedTag} with no technology awareness.
Core Decision: Technology Lives in the URL, Not in Client State
This answers several of your questions at once, so I'll lead with it. I recommend converting the app to a dynamic route — app/[technology]/page.tsx — rather than adding a technology field to a Context/useState.

Why:

It's the idiomatic Next.js App Router way to represent "which resource is currently being viewed," and it means the routing system itself is the state container — not something we build ourselves. That directly satisfies "minimize unnecessary client state."
It makes each technology's page bookmarkable/shareable/server-renderable, and — importantly — it's consistent with where user-flow.md's Flow 10 (marked "Future") is explicitly heading: deep links like /react/usememo. Choosing a flat /[technology] segment now means that future step extends naturally (/react/usememo) instead of requiring a routing rework later.
<Link href="/javascript"> gives us "no page reload" (client-side navigation) for free — no custom JS needed.
Since the Server Component that renders the page re-runs with new params on navigation, "how data loading works after switching" is answered automatically: it's the exact same server-side fetch pattern already established for Content, just now parameterized by the route instead of a hardcoded constant.
Answering Your Specific Questions
Where the selector lives: Unchanged — TechnologyTabs in the Header (desktop) and inside the Sidebar's mobile Sheet (this dual placement already exists from the mobile-nav step). It becomes real: each tab is a <Button> composed with Next.js's <Link href={\/${slug}`}>(samerender-prop composition pattern already used for SheetTrigger`), with the active tab highlighted by comparing against the current route param.

How the selected technology is represented: The route segment itself (params.technology), read server-side. No new type needed — Technology ({slug, name}) already exists and is reused as-is.

URL reflection: Yes, as above.

Data loading after switching: Server Components re-run for the new segment; getQuestions/getCategories/getTags are called with the new technology exactly as they are today, just no longer hardcoded.

Server vs. Client boundaries: app/[technology]/page.tsx — Server (new). Content.tsx — Server, unchanged, already takes technology as a prop. TechnologyTabs.tsx — no "use client" needed itself (same as CategoryAccordion today — it's presentational, and it's already inside Header's client boundary transitively). AppLayout, Header, Sidebar — stay Client (unchanged, still need Sheet/interactivity).

Existing providers: SearchProvider/useSearch need zero new fields — no technology field added. Instead:

How search/tag state gets reset on switch: I'd put key={technology} on <SearchProvider> inside AppLayout. Changing an element's key is the standard React mechanism for "force this subtree to fully unmount and remount," which resets query/selectedTag to their initial values with zero new logic inside useSearch.tsx itself — no effect watching for technology changes, no extra prop. Side effect worth flagging: since <Sheet> is nested inside <SearchProvider>, this also resets the mobile drawer's open/closed state — meaning switching technology from the mobile Sheet will auto-close it. I think that's actually good UX (you see the new content immediately), not a bug, but flagging it since it's a deliberate consequence of this approach, not something I'd have chosen to add on its own.

Should anything be refactored: Yes, one thing, and I want to flag it explicitly since it revisits a Step 7 decision: AppLayout currently takes {sidebar: ReactNode, children: ReactNode} — Sidebar gets pre-rendered by a Server Component and handed down as JSX. But Sidebar doesn't actually do any server-only work itself (no fs, no async) — it only needs plain data (tags). The JSX-slot pattern is only necessary for Content, because Content genuinely does server-only data fetching. So now that AppLayout needs to grow again (for technologies/currentTechnology), I'd rather simplify: AppLayout takes plain data props (technology, technologies, tags) and renders Header/Sidebar internally itself, passing that data straight through — dropping the sidebar JSX-slot in favor of a plain prop. children remains the only true JSX slot, reserved for Content, since that's the one component that actually needs to be server-rendered before being handed to the client tree. This is simpler (less indirection, no need for page.tsx to construct <Sidebar tags={tags} /> itself) and more consistent (Header and Sidebar are now treated the same way). Flagging this as a deliberate refactor, not an accident — let me know if you'd rather keep the existing slot pattern instead.

Concrete Plan
New:

app/[technology]/page.tsx — validates technology against getTechnologies() (calls notFound() if invalid), fetches tags, renders <AppLayout technology={...} technologies={...} tags={...}><Content technology={...} /></AppLayout>. Includes generateStaticParams() returning all 4 known slugs, so all four technology pages are statically prerendered at build time, consistent with how the app builds today.
Modified:

app/page.tsx — becomes a one-line redirect("/react").
components/layout/AppLayout.tsx — new props (technology, technologies, tags), renders Header/Sidebar internally, key={technology} on SearchProvider.
components/header/Header.tsx — accepts and forwards technologies/currentTechnology to TechnologyTabs.
components/header/TechnologyTabs.tsx — real data-driven Link-based navigation with active-state highlighting.
components/sidebar/Sidebar.tsx — accepts and forwards technologies/currentTechnology to its own embedded TechnologyTabs copy (mobile Sheet), alongside the existing tags prop.
Untouched: Content.tsx, KnowledgeBase.tsx, TagList.tsx, SearchBar.tsx, LanguageSwitcher.tsx, hooks/useSearch.tsx, lib/search.ts, lib/filterByTags.ts, services/knowledge-base.ts, all types/.

Trade-offs Summary
Introducing a dynamic route is a real structural change (there was no routing before), but it's the standard tool for exactly this problem, and it reduces complexity elsewhere (no new Context, no client-side "current technology" state to keep in sync).
The key-based reset is minimal-code but has the Sheet-closing side effect noted above.
The AppLayout prop simplification touches Step 7's Sidebar slot design — worth your explicit sign-off since it's revisiting an already-approved decision, even though I think it's a net simplification.
Waiting for your approval before writing any code.