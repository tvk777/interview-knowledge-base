Data Layer Analysis
Checked two things before proposing anything: how frontend-architecture.md describes the data layer, and — critically — whether project docs already commit to sync or async. They do: create-app.md's own "GOOD" example (written back in the initial scaffolding step) is const questions = await getQuestions("react"); — already async, already precedent.

Sync or Async — Recommendation: Async
The rule here is "don't introduce async without a clear architectural reason." I think there is one: frontend-architecture.md explicitly states the future evolution path is JSON → SQLite → REST API → GraphQL, and three of those four are inherently async. If getQuestions() starts synchronous, swapping the implementation later means a breaking signature change propagating through every consumer. Designing it async now costs nothing (the body is a one-line Promise.resolve(...) around a static import) and means Step 4+ can swap the internals without touching any calling code. Combined with the existing await getQuestions(...) precedent already in the docs, I'd rather follow that than introduce an inconsistency with it.

Where the JSON Actually Lives — the Real Fork
The generated knowledge base (data/enriched/, data/categories/, data/tags/) lives at the repo root, outside frontend/ entirely. But create-app.md's own "BAD" example — import reactData from "@/data/react.json" — uses the @/ alias, which only resolves inside frontend/. That, plus frontend-architecture.md listing data/ as one of the frontend's own top-level folders, tells me the intent is: the JSON files are meant to be copied into frontend/data/, and the service layer is the only thing allowed to touch them there. The frontend stays a self-contained project (per create-app.md's "completely independent application" requirement) rather than reaching across the repo boundary at build time.

This means Step 3 isn't just writing service functions — it also means copying the real current JSON files into frontend/data/, mirroring the source layout:


frontend/data/
    enriched/   { react, javascript, typescript, nextjs }.json
    categories/ { react, javascript, typescript, nextjs }.json
    tags/       { react, javascript, typescript, nextjs }.json
Worth flagging honestly: this is a snapshot copy, not a live link. If the repo-root data changes later, frontend/data/ needs to be manually re-synced. That's an acceptable MVP tradeoff given the documented plan to eventually replace static JSON with a real backend anyway (at which point this copy step disappears entirely) — but it is a real limitation, not a hidden one.

Proposed Public API

frontend/services/
    questions.ts      getQuestions(technology: string): Promise<Question[]>
    categories.ts       getCategories(technology: string): Promise<Category[]>
    tags.ts               getTags(technology: string): Promise<Tag[]>
    technologies.ts        getTechnologies(): Promise<Technology[]>
getQuestions / getCategories / getTags each take a technology slug and return that technology's dataset — statically imported per-technology JSON, resolved via a lookup keyed by slug (all four technologies imported at the top of each file; no dynamic import(), no fs — keeps it usable from both server and client code).
getTechnologies() wasn't explicitly requested ("at minimum" only lists the other three), but nothing in the data layer currently produces a Technology[], and that type exists specifically for this. I'd add it now rather than leave Technology an orphaned type with no producer — flagging it explicitly since it's outside the literal minimum, same as I did for Technology itself in Step 2.
No barrel index.ts, same reasoning as Step 2 — four tiny files, no clear consumer yet needing single-import convenience.
No hooks, no context, no caching, no filtering — each function is a plain lookup-and-return.
Assumptions to Confirm
Copying the real JSON into frontend/data/ (rather than reaching outside frontend/) — confirming this matches your intent before I touch any files outside frontend/.
Async signatures (Promise<T[]>) per the create-app.md precedent, even though the underlying implementation has no real I/O yet.
Adding getTechnologies() beyond the literal minimum three.
Unknown technology slug → I'd have each function return an empty array rather than throw, keeping this step free of error-handling logic (no "architectural reason" for it yet, and the task says avoid anything beyond the minimal API surface).
No code written yet — waiting for your approval.

Summary
Implemented the data access layer as a single service module. 
No copy of the generated JSON was made — it's read directly from the repo-root data/ directory at call time.

Created Files

frontend/services/
    knowledge-base.ts   (getQuestions, getCategories, getTags, getTechnologies)
Architectural Decisions
No data duplication: REPO_ROOT = path.join(process.cwd(), ".."), relying on the documented Next.js guarantee that process.cwd() is the project directory in dev/build/start. Each read joins that against data/enriched|categories|tags/<technology>.json — the actual repo-root files, read fresh via fs/promises.readFile on every call. Single source of truth, no sync step to forget.
Genuinely async, not Promise.resolve() theater: since we're doing real disk I/O now (not a static bundled import), async/await throughout is doing real work, not just satisfying a future-proofing contract.
Fail-fast validation via a single source of truth for known slugs: TECHNOLOGIES is defined once and used both to answer getTechnologies() and to validate the technology argument in the other three — an unknown slug throws immediately with the list of valid options, before any file I/O is attempted.
File-read failures are also wrapped, not just unknown-slug errors — if a known technology's file is somehow missing/unreadable, the error names the exact path via Error(..., { cause }), rather than leaking a bare Node ENOENT.
One file, not four: per your instruction, all four functions live in knowledge-base.ts since they're one domain with shared validation logic (assertKnownTechnology, readJsonFile). Structured so splitting into a knowledge-base/ directory later wouldn't change the public API — each function is already self-contained and only depends on the two small private helpers.
Consequence worth naming explicitly: because this uses Node's fs, these functions are server-only — they can't run inside a "use client" component's browser bundle. That's consistent with standard Next.js practice (Server Components fetch data, pass it down as props) and shouldn't be a surprise in Step 4, but flagging it now since it wasn't discussed yet.
Verification
✅ npx tsc --noEmit — clean
✅ npm run lint — clean
✅ npm run build — succeeds
✅ Beyond the minimum: actually ran all four functions against the real data (via a temporary script, deleted after) rather than trusting compilation alone. Confirmed exact counts for all four technologies (react: 113/12/75, javascript: 126/15/101, typescript: 98/12/65, nextjs: 100/14/53 — questions/categories/tags), and confirmed getQuestions("cobol") throws the expected clear error instead of silently returning [].
Not continuing to Step 4 — waiting for your review.