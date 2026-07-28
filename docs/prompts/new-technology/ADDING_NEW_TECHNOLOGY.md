# Adding a New Technology

---

# Purpose

This document is the operational runbook for adding a new technology (for example: Node.js, Vue, Angular, Docker) to the Interview Knowledge Base.

**What this document is.** A complete, self-contained, step-by-step manual for taking a technology from "nothing exists yet" to "fully integrated and browsable in the frontend." It explains every pipeline stage, every input and output file, every validation rule, and — critically — *why* each stage exists, not just the mechanical commands to run.

**When it should be used.** Any time a new technology is added to the knowledge base. It is also the reference to reach for when resuming interrupted work (see [Recovery Guide](#recovery-guide)) or debugging a broken dataset (see [Troubleshooting](#troubleshooting)).

**Who it is for.** Future you, months or years from now, having forgotten everything about how this project works. Also any other engineer or AI agent picking up this project cold. You should be able to read this document top to bottom and execute the entire pipeline without opening any other file except the referenced Claude Code prompts themselves (`01-build-categories.md` through `05-build-final-dataset.md`).

> **Note:** This document describes the pipeline as it actually exists in this repository today. It is generated from, and must stay consistent with, `docs/prompts/new-technology/README.md`, `01-build-categories.md`, `02-review-categories.md`, `03-add-tags.md`, `04-review-tags.md`, `05-build-final-dataset.md`, and `docs/prompts/categories.md`. If those files change, this document is out of date and should be regenerated or edited to match — never the other way around.

---

# Overview

Every technology, without exception, passes through the same nine-stage pipeline. Only Stage 1 (writing the original questions) and Stage 2 (running `build-data`) are automated/scripted. Stages 3, 5, and 7 are performed by an AI agent (Claude Code) following a fixed prompt file, with mandatory human review in between (Stages 4 and 6). This mix is intentional: content transformation that is purely mechanical is scripted for determinism; steps that require semantic judgment (categorization, tagging) are AI-assisted but never trusted blindly — they are always followed by a manual review gate before the result becomes permanent.

```
 Stage 1   Original bilingual dataset (data/original/en, data/original/uk)
              │
              ▼
 Stage 2   build-data script  →  data/generated/<technology>.json
              │
              ▼
 Stage 3   Claude Code: 01-build-categories.md  →  data/categories/<technology>.json
              │
              ▼
 Stage 4   Manual review of categories  →  categories FROZEN
              │
              ▼
 Stage 5   Claude Code: 03-add-tags.md  →  data/tags/<technology>.json
              │
              ▼
 Stage 6   Manual review of tags  →  tags FROZEN
              │
              ▼
 Stage 7   Claude Code: 05-build-final-dataset.md  →  data/enriched/<technology>.json
              │
              ▼
 Stage 8   Validation (all rules below)
              │
              ▼
 Stage 9   Frontend integration
```

**Why the pipeline is shaped this way:**

- **Original data is the only hand-authored artifact.** Everything downstream is derived and can, in principle, be regenerated from it. This keeps the source of truth small and auditable.
- **`build-data` is a deterministic script, not an AI step.** Merging two language files by `id`, stripping a leading question number, and converting `answerBlocks` to Markdown do not require judgment — they require correctness and repeatability. A script guarantees the same input always produces the same output.
- **Categorization and tagging require judgment, so they are AI-assisted.** Deciding "which category does this question primarily belong to" is a semantic task no regex can do reliably.
- **Categories and tags are frozen after review.** Once other data (or a human) starts depending on a category name or tag name, silently renaming it would break everything downstream. Freezing turns a fuzzy AI draft into a stable contract.
- **The final enrichment step is deliberately constrained.** It may only *assign* categoryId and tags from the frozen dictionaries — it may never invent new ones. This is what makes the frozen dictionaries trustworthy: nothing downstream can quietly expand them.

---

# Before You Start

## Prerequisites

- You understand the target technology well enough to write accurate interview Q&A content, or you have a reliable source to translate/adapt.
- You have both English and Ukrainian content ready, or you're comfortable authoring both (see [Step 1](#step-1--create-the-original-dataset)).
- You have read this entire document once before starting, so you know what "done" looks like.

## Required Tools

- Node.js (v20+ confirmed working) and npm.
- `npx tsx` is used to run the build script directly (`npm run build-data <technology>` already wraps this — see `package.json`).
- A Claude Code (or equivalent capable AI agent) session with file read/write access to this repository, for Stages 3, 5, and 7.
- A text editor for manual review (Stages 4 and 6) and for hand-authoring the original dataset (Stage 1).

## Required Files (must already exist)

- `src/lib/markdown/` — the `answerBlocksToMarkdown()` renderer. Do not modify this while adding a technology; it is shared, technology-agnostic infrastructure.
- `scripts/build-data.ts` — the Stage 2 script.
- `docs/prompts/categories.md` — the canonical, human-readable category taxonomy for every technology. **You must edit this file yourself if the technology is new** (see Step 3).
- `docs/prompts/new-technology/01-build-categories.md` through `05-build-final-dataset.md` — the Claude Code prompts for Stages 3, 5, and 7 (`02` and `04` are review checklists, not prompts you run).

## Project State

Before starting, confirm the repository is in a clean, known-good state:

```bash
npx tsc --noEmit          # no TypeScript errors anywhere in the project
npm run build-data react  # sanity check: existing technologies still build
```

If either of these fails, **stop and fix that first.** Do not add a new technology on top of a broken baseline — you will not be able to tell which failures are pre-existing and which are yours.

## Git Recommendations

This project may or may not be a Git repository depending on your checkout. If it is:

- Create a dedicated branch for the new technology (e.g. `add-nodejs-technology`) before starting Stage 1.
- Commit after each stage completes successfully, not just at the end. Recommended commit points: after Stage 2 (generated dataset builds cleanly), after Stage 4 (categories frozen), after Stage 6 (tags frozen), after Stage 7 (enriched dataset builds and validates).
- **Never** amend or rewrite history on commits after categories or tags are frozen and other work (Stage 7, frontend wiring) depends on them.
- If it is not a Git repository, keep manual backups of `data/categories/<technology>.json` and `data/tags/<technology>.json` immediately after each freeze — these are the two artifacts that are most expensive to accidentally lose or corrupt, since recreating them means re-running AI generation and review from scratch.

## Expected Project Structure

Before you begin, the relevant parts of the repository should look like this:

```
data/
    original/
        en/
            react.json
            javascript.json
            typescript.json
            next.json
        uk/
            react.json
            javascript.json
            typescript.json
            next.json
    generated/
        react.json
        javascript.json
        typescript.json
        nextjs.json
    categories/
        react.json
        javascript.json
        typescript.json
        nextjs.json
    tags/
        react.json
        javascript.json
        typescript.json
        nextjs.json
    enriched/
        react.json
        javascript.json
        typescript.json
        nextjs.json

docs/
    prompts/
        categories.md
        new-technology/
            README.md
            01-build-categories.md
            02-review-categories.md
            03-add-tags.md
            04-review-tags.md
            05-build-final-dataset.md
            ADDING_NEW_TECHNOLOGY.md   ← this file

scripts/
    build-data.ts

src/
    lib/
        markdown/
```

> **Warning — naming inconsistency you will hit immediately:** Next.js's original source files are named `next.json` (both under `data/original/en/` and `data/original/uk/`), but every other artifact for that technology — `data/generated/`, `data/categories/`, `data/tags/`, `data/enriched/` — uses `nextjs.json`. This is not a bug; it is handled deliberately by `SOURCE_FILE_OVERRIDES` in `scripts/build-data.ts` (see [Step 2](#step-2--build-the-generated-dataset)). When you add a new technology, you only need an override if your original filename won't match your technology's canonical slug exactly.

---

# Project Structure

| Directory | Purpose |
|---|---|
| `data/original/en/`, `data/original/uk/` | Hand-authored source of truth. One JSON array per technology per language. Contains `answerBlocks` (structured, renderer-agnostic content), not Markdown. **Never edit downstream files instead of these** — anything downstream is disposable and regeneratable. |
| `data/generated/` | Output of `build-data`. Bilingual questions merged by `id`, question text normalized, `answerBlocks` rendered to Markdown. `categoryId` is `null` and `tags` is `[]` at this stage — nothing has been categorized yet. |
| `data/categories/` | The approved category taxonomy per technology, as flat JSON: `{ id, name, description }`. Authored via Stage 3 + Stage 4 (AI draft + human review), then frozen. |
| `data/tags/` | The approved navigation tag dictionary per technology, as flat JSON: `{ name, categoryId }`. Authored via Stage 5 + Stage 6 (AI draft + human review), then frozen. |
| `data/enriched/` | The final, production-ready dataset. Same shape as `data/generated/`, except `categoryId` is populated and `tags` contains 1–6 entries per question. This is the only directory the frontend should ever read from. |
| `docs/prompts/` | Every Claude Code prompt used anywhere in this project, plus `categories.md`, the canonical human-readable category taxonomy that `data/categories/*.json` is generated from. |
| `docs/prompts/new-technology/` | The five-step (six-file) prompt sequence specifically for onboarding a new technology, plus this runbook. |

---

# Step 1 – Create the Original Dataset

### Purpose

Author the raw interview content. This is the only stage in the entire pipeline that is not derived from something else — it is the actual source of truth. Every other file in `data/` can theoretically be deleted and regenerated from this one.

### Input

None. This is hand-authored (or AI-assisted-but-human-approved) content.

### Output

```
data/original/en/<technology>.json
data/original/uk/<technology>.json
```

### Directory

`data/original/en/` and `data/original/uk/` — both are required. This project is bilingual by design; there is no path through the pipeline that produces a monolingual dataset.

### Requirements

Each file is a JSON array of question objects with this shape:

```json
{
  "id": "e639f68e-a8d8-4ad6-9ba4-c838d9e0e21a",
  "categoryId": "c7a2ccc3-f95f-423b-8ff1-f5ed802337f0",
  "sortOrder": 1,
  "difficulty": "medium",
  "question": "1. What is Node.js?",
  "answerBlocks": [
    {
      "type": "heading",
      "level": 4,
      "children": [{ "text": "Node.js description:" }]
    },
    {
      "type": "paragraph",
      "children": [{ "text": "Node.js is a JavaScript runtime built on..." }]
    }
  ],
  "locale": "en"
}
```

- `id` must be a stable, unique identifier (a UUID is conventional) and **must be identical between the English and Ukrainian entry for the same question.** This is how `build-data` matches translations to each other.
- `question` conventionally carries a leading number (`"1. "`, `"25. "`) — this is stripped automatically in Stage 2, so keep numbering consistent with your intended display order.
- `answerBlocks` uses the structured block format consumed by `answerBlocksToMarkdown()` (see `src/lib/markdown/`) — headings, paragraphs, lists, code blocks, tables, and inline marks (bold/code). Do not write Markdown directly here; write structured blocks.
- `categoryId` on the original record is a **legacy/authoring-time field and is intentionally discarded** by `build-data` — it is not the same `categoryId` that gets assigned later in Stage 7. Don't worry about keeping it meaningful; it exists only because the original authoring format includes it, not because the pipeline uses it.
- `difficulty` is a free-form string (`"easy"`, `"medium"`, `"hard"` by convention) and is the one piece of metadata that passes through the entire pipeline unchanged, from original to enriched.

### Validation

`build-data` (Stage 2) is where real validation happens, but before running it, spot-check:

- Every question in the English file has a matching `id` in the Ukrainian file, and vice versa.
- No duplicate `id` values within either file.
- Valid JSON (a trailing comma or unclosed brace will fail the whole build).

### Common Mistakes

- **Mismatched `id` between languages.** The single most common failure. If you author English and Ukrainian separately, double-check the IDs line up before running `build-data` — it will fail loudly (see [Troubleshooting](#troubleshooting)), but it's much faster to catch this by eye first.
- **Different question counts between languages.** Every English question needs a Ukrainian counterpart and vice versa — partial translation is not supported by this pipeline.
- **Writing Markdown into `answerBlocks` text fields.** The block format is structured data, not Markdown source — bold/italic/code must use the mark properties (`"bold": true`, `"code": true`), not literal `**asterisks**` in the text.

### Next Step

Run `build-data` (Step 2).

---

# Step 2 – Build the Generated Dataset

### Purpose

Deterministically transform the two raw language files into one merged, normalized, production-shaped file — with zero AI involvement. Everything in this step is mechanical: match by ID, strip a number prefix, render Markdown, done.

### Command

```bash
npm run build-data <technology>
```

Example:

```bash
npm run build-data node
```

> **Before running this for a genuinely new technology**, you must register it. This is a real gap in the current tooling that none of the Claude Code prompts mention — **the prompts assume the technology is already registered.** Open `scripts/build-data.ts` and:
>
> 1. Add your technology's slug to the `TECHNOLOGIES` array.
> 2. If your original filename doesn't match the slug exactly (like `next.json` for `nextjs`), add an entry to `SOURCE_FILE_OVERRIDES`.
>
> Skipping this step produces `Unknown technology: "node"` and the build refuses to run.

### Input

```
data/original/en/<technology-or-override-name>.json
data/original/uk/<technology-or-override-name>.json
```

### Output

```
data/generated/<technology>.json
```

### Generated Schema

```json
{
  "id": "e639f68e-a8d8-4ad6-9ba4-c838d9e0e21a",
  "difficulty": "medium",
  "question": {
    "en": "What is Node.js?",
    "uk": "Що таке Node.js?"
  },
  "answer": {
    "en": "#### Node.js description\n\nNode.js is a JavaScript runtime...",
    "uk": "#### Опис Node.js\n\nNode.js — це середовище виконання..."
  },
  "categoryId": null,
  "tags": []
}
```

### Field-by-Field

- **`id`** — carried through unchanged from the original English record.
- **`difficulty`** — carried through unchanged.
- **`question` / `answer`** — now bilingual objects. `question` has had its leading number stripped (`normalizeQuestion()`); `answer` has been converted from `answerBlocks` to Markdown via `answerBlocksToMarkdown()` for both languages independently.
- **`categoryId`** — always `null` at this stage.
- **`tags`** — always `[]` at this stage.

### Why `categoryId` and `tags` Are Empty

Because assigning them requires understanding what the question is actually about — a semantic judgment call that a deterministic script cannot make reliably. `build-data`'s only job is structural transformation (merge, normalize, render). Deciding *meaning* is deferred to the AI-assisted stages (3 through 7), where it can be done with real judgment and is subject to human review before being trusted. Keeping this boundary strict is what makes the pipeline auditable: if something is wrong with question text or Markdown rendering, the bug is in Stage 1 or the renderer; if something is wrong with categorization, the bug is in Stage 3 or 7.

### Validation (enforced by the script itself — it will refuse to write output otherwise)

- Both source files exist.
- Both files contain valid JSON, and both are arrays.
- Both language datasets have the same number of questions.
- Every English `id` exists in the Ukrainian dataset, and vice versa.
- No duplicate `id` within either dataset.
- Every question has a non-empty `id`.

On any validation failure, the script throws a descriptive error, exits non-zero, and **does not write or overwrite the output file** — a failed run never corrupts a previously-good `data/generated/<technology>.json`.

### Next Step

Generate the category dictionary (Step 3).

---

# Step 3 – Generate the Category Dictionary

### Purpose

Produce the taxonomy of top-level topic categories for this technology (e.g., for React: Fundamentals, Hooks, State Management, Performance, Redux, Other). Categories are the first, broadest level of navigation in the frontend.

### Input

- `docs/prompts/categories.md` (to check whether this technology already has categories, and to see the structure/granularity of existing technologies)
- `data/generated/<technology>.json` (the actual question content to categorize against)

### Output

- New sections appended to `docs/prompts/categories.md` (only if the technology is genuinely new)
- `data/categories/<technology>.json`

### Claude Code Prompt

```
docs/prompts/new-technology/01-build-categories.md
```

Open this file in your AI agent session, update the technology name inside it (it ships with `Node.js` as a placeholder example — replace with your actual technology), and run it.

### Expected Result

- If the technology already has an entry in `categories.md` (rare for a *new* technology, but possible if someone pre-drafted it), the existing categories are reused as-is.
- If not, the agent designs a full category taxonomy from scratch, matching the structure and granularity of the existing technologies in `categories.md`, and writes it into a new section of that file.
- Either way, `data/categories/<technology>.json` is generated from the Markdown, as a flat array:

```json
[
  {
    "id": 1,
    "name": "Fundamentals",
    "description": "Core Node.js concepts, the event loop, module systems, and runtime architecture."
  },
  {
    "id": 2,
    "name": "File System & Streams",
    "description": "Reading and writing files, streaming APIs, and backpressure handling."
  }
]
```

- IDs are sequential integers starting at 1.
- The last category is always named exactly `"Other"` — a catch-all for questions that don't cleanly fit anywhere else.

### Validation

- `data/categories/<technology>.json` is valid JSON and an array.
- IDs are sequential starting at 1, with no gaps or duplicates.
- Every category name appears in `docs/prompts/categories.md` under this technology's section, with matching wording.
- Exactly one category is named `"Other"`, and it is last.

### Common Mistakes

- Generating categories that are too granular (one category per question topic) or too broad (three categories for fifty questions). Match the granularity of the existing technologies — look at how many categories React (12) or JavaScript (15) have relative to their question counts as a reference point.
- Forgetting to write the Markdown section into `categories.md` before generating the JSON — the JSON should always be a mechanical derivation of the Markdown, never authored independently, or the two will drift apart.
- Copying another technology's categories verbatim instead of designing ones that fit this technology's actual topics.

### Relationship With `categories.md`

`docs/prompts/categories.md` is the **human-readable, canonical source of truth** for category taxonomy across every technology in the project. `data/categories/<technology>.json` is a **generated, machine-readable projection** of one technology's section of that file. If you ever need to hand-edit a category name or description, edit `categories.md` first, then regenerate (or manually mirror the edit into) the JSON — never let the JSON diverge from the Markdown silently.

### Next Step

Manual review (Step 4). **Do not skip this. Do not proceed to tags before categories are reviewed and frozen.**

---

# Step 4 – Review Categories

### Why Manual Review Is Required

The AI-generated category list is a strong first draft, not a final answer. It's cheap to fix a bad category name now, before nine other files start referencing it (via numeric `categoryId`) — and prohibitively expensive to fix later, since every tag and every enriched question would need to be re-pointed at the corrected category. Freezing after review is what makes the rest of the pipeline safe to build on top of.

### What Should Be Reviewed

Using `docs/prompts/new-technology/02-review-categories.md` as the checklist source:

- [ ] No duplicate categories (same concept, two names).
- [ ] No missing interview topics — read through a sample of actual questions in `data/generated/<technology>.json` and confirm every major topic area has a home.
- [ ] Category names are clear and use industry-standard terminology.
- [ ] Descriptions are accurate and specific enough to disambiguate from neighboring categories.
- [ ] Exactly one `"Other"` category exists.
- [ ] IDs are sequential, starting at 1, no gaps.
- [ ] Categories appear in a logical order (e.g., fundamentals first, niche/advanced topics later, "Other" last).

Make any necessary edits **manually**, directly in both `docs/prompts/categories.md` and `data/categories/<technology>.json`. Keep them in sync.

### What Should Never Be Changed Later

Once you move on to Step 5 (tag generation), **do not rename, renumber, merge, or delete categories.** The tag dictionary you're about to generate will assign every tag a `categoryId` pointing at these exact IDs. Renaming or renumbering after tags exist silently breaks that mapping with no error — tags will point at the wrong category, or at nothing, and nothing will tell you.

If you discover a real problem with categories *after* tags have been generated, you must:

1. Fix the category.
2. Re-run Step 5 tag generation from scratch (or manually re-point every affected tag's `categoryId`).
3. Re-review tags (Step 6) before re-freezing.

This is expensive. It is why Step 4 exists as a hard gate before Step 5 — get it right once, here.

### What "Frozen" Means

"Frozen" means the file becomes **read-only in practice**, even though nothing technically prevents editing it. From this point forward:

- No pipeline step is allowed to add, rename, or remove categories.
- Step 5 (tag generation) treats this file as fixed input, never output.
- Step 7 (final enrichment) treats this file as fixed input, never output.
- Any future correction is a deliberate, out-of-band exception — not a normal part of the pipeline — and requires redoing every downstream step that depends on it.

### Detailed Checklist

- [ ] Read every category name and description aloud — do they make sense in isolation?
- [ ] Cross-check against 5-10 real questions from `data/generated/<technology>.json` — does each one clearly belong to exactly one category?
- [ ] No two categories overlap enough that a question could reasonably go in either.
- [ ] `"Other"` exists, is spelled exactly `"Other"`, and is the last category.
- [ ] IDs: 1, 2, 3, ... N with no gaps, no duplicates, no non-sequential jumps.
- [ ] `docs/prompts/categories.md` and `data/categories/<technology>.json` agree exactly on names (JSON is a faithful projection of the Markdown).
- [ ] You are willing to freeze this. If not, keep iterating before moving to Step 5.

### Next Step

Generate the tag dictionary (Step 5).

---

# Step 5 – Generate the Tag Dictionary

### Purpose

Produce the fine-grained navigation vocabulary within each category — the actual clickable concepts a user browses by (e.g., within "Hooks": `useState`, `useEffect`, `useMemo`). Where categories are broad topic areas, tags are the specific things someone would click looking for a specific answer.

### Input

```
data/generated/<technology>.json
data/categories/<technology>.json
```

### Output

```
data/tags/<technology>.json
```

### Prompt

```
docs/prompts/new-technology/03-add-tags.md
```

Update the technology placeholder inside it, then run it in your AI agent session.

### Expected Tag Count

Approximately **80–100** tags. This is a guideline, not a hard limit — a technology with unusually rich or unusually narrow interview content may reasonably land outside that range. What matters more than hitting the number is quality: every tag should be something a developer would deliberately click while browsing, not just any concept that happens to appear in an answer.

### Naming Conventions

- Use the **canonical industry term**, singular, not a description: `Promise`, not `Promises`; `Closure`, not `Closures`; `async/await`, not `Async Await`.
- Use consistent capitalization matching how the community actually writes it (`useEffect`, not `UseEffect` or `useeffect`; `React.memo`, not `react.memo`).
- Prefer the specific, official API/concept name over a paraphrase.

### Relationship With Categories

Every tag belongs to **exactly one** category, referenced by numeric `categoryId` (matching `data/categories/<technology>.json`). The output schema is intentionally minimal:

```json
{
  "name": "useEffect",
  "categoryId": 4
}
```

No aliases, no descriptions, no synonyms, no question counts, no other metadata — this is a navigation dictionary, not a full-text search index. Keep it that way; do not add fields.

### Examples

```json
[
  { "name": "Event Loop", "categoryId": 1 },
  { "name": "Streams", "categoryId": 3 },
  { "name": "Backpressure", "categoryId": 3 },
  { "name": "Buffer", "categoryId": 2 }
]
```

### Validation

- Valid JSON array.
- Every entry has exactly `{ name, categoryId }` — no extra fields.
- No duplicate `name` values.
- Every `categoryId` matches an ID present in `data/categories/<technology>.json`.
- Every category from Step 3/4 has at least one tag (nothing orphaned in the navigation tree) — not a hard requirement, but a strong signal something was missed if a whole category has zero tags.

### Next Step

Manual review (Step 6). **Do not skip this. Do not proceed to final dataset generation before tags are reviewed and frozen.**

---

# Step 6 – Review Tags

### What Makes a Good Navigation Tag

Ask, for every candidate tag: *"If I wanted to find questions about this, would I click a tag with this exact name?"* If the honest answer is no, it shouldn't be a tag. Good tags are specific, well-known, and independently searched-for — `useEffect`, `Event Loop`, `Promise.all`. They read like the table of contents of a technical handbook, not a keyword-extraction dump.

### What Should Be Removed

Using `docs/prompts/new-technology/04-review-tags.md` as the checklist source:

- **Duplicates.** The same concept represented by two different tag names (`Promise` and `Promises` both existing is a bug, not two tags).
- **Overly generic tags.** `JavaScript`, `Node.js`, `Programming`, `Code` — these describe the entire dataset, not a navigable subset of it. (Exception: only keep something this broad if it's a genuine, narrowly-scoped interview topic in its own right, not just the technology's own name.)
- **Implementation details unlikely to be independently searched.** If it's a concept only a maintainer of this specific codebase would think to search for, it's not a navigation tag.
- **Inconsistent naming** for the same concept across near-identical questions.

### Duplicates

Check specifically for near-duplicate concepts that got split into two tags by mistake during generation (e.g., `Callback` and `Callback Function` both present). Merge into one canonical name and re-point any usage.

### Aliases

**This dictionary format has no alias field.** If two names could plausibly refer to the same thing, pick one canonical name and delete the other — don't try to keep both as "the tag" and "its alias." (This is a deliberate simplification from an earlier version of this pipeline, which did support aliases; the current format does not.)

### Implementation Details

Reject tags for things a user would never think to click on directly — internal helper function names, one-off code snippet variables, or overly narrow sub-cases of a broader concept that already has its own tag.

### Generic Tags

Reject tags that are really just describing "this entire technology" or "programming in general." A tag should narrow the search, not just restate the obvious.

### Detailed Checklist

- [ ] No two tags represent the same concept under different names.
- [ ] Every tag name uses consistent, canonical, industry-standard capitalization.
- [ ] Read through `data/generated/<technology>.json` once more — are there major, frequently-recurring interview topics with no corresponding tag?
- [ ] No tag is so generic it applies to nearly every question in the technology.
- [ ] Every tag's `categoryId` still points at a category that exists (re-check after any edits made during this review).
- [ ] Tag names match how the developer community actually writes them (check official docs/API names when unsure).
- [ ] You are willing to freeze this. If not, keep iterating before moving to Step 7.

### Next Step

Generate the final enriched dataset (Step 7).

---

# Step 7 – Generate the Final Dataset

### Purpose

Assign every question in `data/generated/<technology>.json` exactly one category and a small set of navigation tags, producing the file the frontend will actually consume.

### Inputs

```
data/generated/<technology>.json
data/categories/<technology>.json
data/tags/<technology>.json
```

### Outputs

```
data/enriched/<technology>.json
```

### Prompt

```
docs/prompts/new-technology/05-build-final-dataset.md
```

### Decision Process

For every question, in this order:

1. Determine the primary interview topic (read the question and answer, not just the question).
2. Assign the single most specific matching category.
3. Select the most relevant navigation tags from the frozen tag dictionary — nothing else.
4. Ignore secondary concepts unless they represent a genuinely significant second topic in the question.

### Category Assignment

- Exactly one `categoryId` per question, always from the frozen category dictionary.
- Never invent, rename, or otherwise modify a category during this step — Stage 4 already froze it.
- Choose the *most specific* fit, not the most convenient one.

### Tag Assignment

- Only tags already present in the frozen tag dictionary. Never invent a new tag here, even if the "perfect" tag seems obviously missing — that's a signal Step 5/6 needs revisiting later, not a license to add one now.
- Usually 2–5 tags per question; 1 is acceptable for a very narrowly-focused question, up to 6 for an unusually broad one.
- Order tags by importance — the first tag is the primary topic.
- Every question needs at least one tag; none may exceed six; no duplicates within a question.

### Consistency

Questions covering the same topic (including duplicate/near-duplicate questions, which do occur in these datasets) should get the same category and the same primary tag. Don't let near-identical questions drift to different classifications just because they were reviewed at different times.

### Example

```json
{
  "id": "a1b2c3d4-...",
  "difficulty": "medium",
  "question": {
    "en": "How does the Event Loop work in Node.js?",
    "uk": "Як працює Event Loop у Node.js?"
  },
  "answer": {
    "en": "...",
    "uk": "..."
  },
  "categoryId": 1,
  "tags": ["Event Loop", "Microtask Queue", "Call Stack"]
}
```

### Validation (see full checklist in Step 8)

- `categoryId` is never null, is a single number, and exists in the category dictionary.
- `tags` is never empty, contains only names present in the tag dictionary, and has no duplicates.
- `id`, `difficulty`, `question`, and `answer` are byte-identical to the corresponding entry in `data/generated/<technology>.json` — this step populates two fields and touches nothing else.

> **Note on effort:** this step genuinely requires reading every question — there is no reliable shortcut. A pure keyword-match approach will systematically overweight incidental mentions and underweight questions whose dictionary-approved tags don't literally appear in the question text. Expect (and budget time for) a real per-question read-through, plus at least one self-check of the resulting tag-count distribution (most questions should land in the 2–5 range; if the average comes out closer to 1, go back and look for genuinely-relevant secondary tags before treating the pass as done).

### Next Step

Validate the dataset (Step 8), then connect it to the frontend (Step 9).

---

# Step 8 – Validate the Dataset

Run through this checklist against `data/enriched/<technology>.json` before considering the technology done. Every rule here is drawn directly from the pipeline's own stated validation rules (Steps 2, 5, and 7 above) — this step just re-checks all of them together, on the final artifact, in one pass.

**Structural**

- [ ] `data/enriched/<technology>.json` is valid JSON.
- [ ] It is a flat array of question objects.
- [ ] The number of questions exactly matches `data/generated/<technology>.json`.

**Per-question — identity fields**

- [ ] Every `id` matches its counterpart in `data/generated/<technology>.json` exactly.
- [ ] Every `difficulty` matches its counterpart exactly.
- [ ] Every `question.en` / `question.uk` matches its counterpart exactly.
- [ ] Every `answer.en` / `answer.uk` matches its counterpart exactly.

**Per-question — categoryId**

- [ ] `categoryId` is present and is not `null` on every question.
- [ ] `categoryId` is a single number (not an array, not a string).
- [ ] `categoryId` exists in `data/categories/<technology>.json`.

**Per-question — tags**

- [ ] `tags` is present and is a non-empty array on every question.
- [ ] `tags` has at most 6 entries.
- [ ] No duplicate tag names within a single question's `tags` array.
- [ ] Every tag name exists in `data/tags/<technology>.json` exactly (case-sensitive).

**Coverage**

- [ ] Every category in `data/categories/<technology>.json` is used by at least one question.
- [ ] Most tags in `data/tags/<technology>.json` are used by at least one question (a handful of unused tags is not automatically a failure, but investigate if a large fraction go unused — it may mean tag generation missed the actual question content).

**Consistency**

- [ ] Duplicate/near-duplicate questions (same topic, possibly repeated in the source dataset) share the same `categoryId` and the same first (primary) tag.

**Distribution sanity check**

- [ ] The average number of tags per question is reasonably close to the "usually 2-5" guideline. If it's close to 1, that's a signal the pass was too conservative, not that the questions were unusually focused.

A validation script is not currently checked into this repository — these checks were performed by hand (or via an ad hoc script) for the existing four technologies. If you write a reusable validation script while adding a technology, consider committing it under `scripts/` for future use.

---

# Step 9 – Connect the Frontend

Once `data/enriched/<technology>.json` exists and passes every check in Step 8, it needs to actually become reachable from the application. As of this writing, the frontend application itself has not yet been built out in this repository — this section documents the *intent* and the places you will need to wire in a new technology once it exists, based on the project's stated architecture (see `docs/architecture.txt` and `docs/reference/project-conventions.md`).

- **Technology registry.** There should be a single place (an `index.json` or equivalent, per the project's original architecture notes) listing every available technology and pointing at its file — e.g. `{ "id": "node", "file": "node.json" }`. Add your new technology there.
- **Routing.** The frontend needs a route (e.g. `/node`) that loads `data/enriched/node.json` and renders its questions.
- **Search index.** If the frontend has a cross-technology or per-technology search feature, the new enriched dataset needs to be included in whatever indexing step feeds it.
- **Category navigation.** The UI that lets a user drill from Technology → Category → Questions needs to pick up the new technology's `data/categories/node.json`.
- **Tag navigation.** Similarly, the UI that lets a user browse Technology → All Tags → Questions needs to pick up `data/tags/node.json`.
- **Filters.** If the frontend supports filtering by difficulty, category, or tag, confirm the new technology's data populates those filters correctly (spot-check a few questions in the running app).

> **Warning:** because the frontend is not yet implemented as of this document's writing, treat this section as a checklist of integration points to verify once it is, not as a guarantee that these exact mechanisms already exist. Update this section once the frontend is built, so it reflects reality rather than intent.

---

# Recovery Guide

If work on a new technology was interrupted — a different session, a different day, a crashed process — use this section to figure out where you left off. Work backward from what already exists on disk.

### Already have: nothing (not even original data)

Start at [Step 1](#step-1--create-the-original-dataset).

### Already have: `data/original/en/<tech>.json` and `data/original/uk/<tech>.json`

Confirm the technology is registered in `scripts/build-data.ts` (`TECHNOLOGIES`, and `SOURCE_FILE_OVERRIDES` if needed), then run `npm run build-data <technology>`. Proceed to [Step 3](#step-3--generate-the-category-dictionary).

### Already have: `data/generated/<tech>.json`

Check whether `data/categories/<tech>.json` already exists.

- If not: proceed to [Step 3](#step-3--generate-the-category-dictionary).
- If it exists but you're not sure it was reviewed: treat it as **not yet frozen** and run the [Step 4](#step-4--review-categories) checklist before trusting it.

### Already have: categories (reviewed and frozen)

Check whether `data/tags/<tech>.json` exists.

- If not: proceed to [Step 5](#step-5--generate-the-tag-dictionary).
- If it exists but review status is unclear: run the [Step 6](#step-6--review-tags) checklist before trusting it. **Do not assume a tag file is frozen just because it exists** — verify.

### Already have: tags (reviewed and frozen)

Proceed to [Step 7](#step-7--generate-the-final-dataset).

### Already have: `data/enriched/<tech>.json`

Run the full [Step 8](#step-8--validate-the-dataset) checklist against it before trusting it in the frontend, even if it looks complete. A prior session may have stopped partway through enrichment (some questions still holding placeholder or inconsistent values) without that being obvious from a quick glance.

> **General rule for recovery:** never assume a frozen artifact (`data/categories/*.json` or `data/tags/*.json`) is actually reviewed just because it exists on disk. "Generated" and "frozen" are different states, and only a completed review checklist makes something frozen. When in doubt, re-run the relevant review checklist — it's far cheaper than discovering the mistake after Step 7.

---

# Troubleshooting

**"Unknown technology: `node`"** when running `npm run build-data node`.
The technology isn't registered. Add it to `TECHNOLOGIES` in `scripts/build-data.ts` (and to `SOURCE_FILE_OVERRIDES` if the original filename doesn't match the slug exactly).

**"Source file not found: ...`.json`"**
Either the original file doesn't exist at that path, or you have a filename mismatch — check `SOURCE_FILE_OVERRIDES` if your technology's original filename differs from its canonical slug (this is exactly the situation Next.js is in, with `next.json` vs. the `nextjs` slug).

**"Dataset size mismatch: en has N questions, uk has M questions"**
The English and Ukrainian original files have different numbers of entries. Find the extra/missing question — usually it's a single question added to one language and forgotten in the other — and reconcile.

**"Missing Ukrainian translation for question: id: ..."** / **"Missing English translation for question: id: ..."**
An `id` exists in one language file but not the other. Fix the mismatched or missing `id` in the original data (do not just delete the orphan without checking whether it should have a translation).

**"Duplicate question id: ..."**
Two questions in the same language file share an `id`. Assign one of them a new, unique `id`.

**Invalid JSON in any `data/` file**
Usually a trailing comma, unclosed bracket, or an unescaped character in translated text. Run the file through any JSON validator/linter to get an exact line/column, since Node's own JSON parser error messages are often imprecise about location in large files.

**Missing categories** (a real interview topic has nowhere to go)
Caught during Step 4 review, ideally. If caught later, categories are supposed to be frozen — but a genuinely missing major topic is worth the cost of reopening Step 3/4, rather than shoehorning those questions into a wrong category. Re-run Step 5/6 afterward, since the tag dictionary may need new tags in the new category.

**Duplicate tags** (`Promise` and `Promises` both present)
Caught during Step 6 review, ideally. If found later in `data/enriched/<tech>.json`, it means Step 6 was incomplete — go back, merge the tags in `data/tags/<tech>.json` into one canonical name, then re-run Step 7 so every question referencing the removed duplicate gets re-pointed at the canonical name.

**Questions without categories** (`categoryId` still `null` in the enriched file)
Step 7 was incomplete or was interrupted partway through. Re-run Step 7 — it's safe to regenerate the whole enriched file, since it should be fully derived from `data/generated/`, `data/categories/`, and `data/tags/` with no other state.

**Tags that don't exist** (a tag name in `data/enriched/<tech>.json` isn't in `data/tags/<tech>.json`)
This means Step 7 invented a tag instead of only selecting from the dictionary — a process violation, not a data problem. Fix by replacing the invented tag with the closest dictionary match, or by treating it as a signal that the tag dictionary genuinely needs that concept added (requires reopening Step 5/6).

**Category IDs don't match** (a `categoryId` in `data/tags/<tech>.json` or `data/enriched/<tech>.json` doesn't exist in `data/categories/<tech>.json`)
Almost always caused by editing categories *after* tags or the enriched dataset were generated, without re-running the downstream steps. This is exactly the failure mode the "categories are frozen" rule in Step 4 exists to prevent. Fix by re-running Step 5 (if tags are affected) and/or Step 7 (if the enriched dataset is affected).

**"Prompt generated bad output"** (AI-assisted step produced something clearly wrong — nonsensical categories, tags that don't match the dictionary, wildly inconsistent categorization)
This is exactly what the manual review steps (4 and 6) and the validation step (8) exist to catch. Don't try to patch a bad AI output by hand line-by-line — it's usually faster and safer to re-run the generation prompt with more specific guidance, or to fix the systemic issue (e.g., a misunderstood category) and regenerate.

**Incomplete dataset** (fewer questions in `data/enriched/<tech>.json` than in `data/generated/<tech>.json`)
Step 7 was interrupted or a filtering bug dropped questions. Re-run Step 7 in full; it is not designed to support partial/incremental runs.

---

# Best Practices

### Why Categories Should Be Frozen

Every tag references a category by numeric ID, not by name. If a category is renamed or renumbered after tags exist, every tag pointing at it silently becomes wrong — there is no error, no warning, just quietly incorrect data. Freezing categories before generating tags eliminates this entire class of bug by construction.

### Why Tags Should Be Frozen

The final enrichment step (Step 7) is only trustworthy *because* it's constrained to select from a fixed, reviewed vocabulary rather than inventing tags per-question. If the tag dictionary were still mutable during enrichment, you'd lose the guarantee that every tag in the final dataset is a deliberate, reviewed navigation concept — you'd just have keyword extraction with extra steps.

### Why Manual Review Matters

AI-generated categories and tags are a strong first draft, not a final answer — they can be too granular, too generic, inconsistent in naming, or simply miss a major topic that a domain expert would immediately notice. The cost of catching a mistake at review time (Steps 4 and 6) is minutes. The cost of catching the same mistake after Step 7 has run is redoing Steps 5 through 7 (or worse, discovering it after frontend integration, once real users or other data may depend on the wrong names).

### When to Regenerate

- Categories: only if a real, significant gap or error is found — and only with the understanding that Steps 5 through 7 must be redone afterward.
- Tags: if review (Step 6) finds real problems, or if categories were regenerated and tags need to be re-derived against the new taxonomy.
- The enriched dataset (Step 7): freely and often — it's cheap to regenerate since it has no other state depending on it, and doing so is the correct way to pick up any fix made to categories or tags.

### When Not to Regenerate

- Don't regenerate categories or tags just because a *single* question seems slightly miscategorized in the final dataset — that's usually a Step 7 judgment call to fix directly, not a sign the dictionary itself is wrong.
- Don't regenerate the whole pipeline for a technology because one new question was added to the original dataset — re-running `build-data` and Step 7 for that technology is sufficient; categories and tags don't need to change for one new question unless it introduces a genuinely new topic.

### Git Recommendations

- Commit immediately after freezing categories and immediately after freezing tags — these are the two states you most want a clean rollback point for.
- Use descriptive commit messages that name the pipeline stage (e.g. `"node: freeze category dictionary"`), so `git log` alone tells the story of how the technology was built.
- If a mistake is discovered after tags are frozen and Step 7 has already run, prefer a new commit that fixes the dictionary and regenerates Step 7's output, over trying to hand-patch the enriched dataset directly — the enriched dataset should always be a clean derivation of its inputs.

---

# Validation Checklist

Final pre-release gate. Do not consider a new technology done until every box is checked.

- [ ] `data/original/en/<tech>.json` and `data/original/uk/<tech>.json` exist, are valid JSON, have matching question counts, and every `id` matches across both languages.
- [ ] `<tech>` is registered in `scripts/build-data.ts` (`TECHNOLOGIES`, and `SOURCE_FILE_OVERRIDES` if applicable).
- [ ] `npm run build-data <tech>` completes successfully with no errors.
- [ ] `data/generated/<tech>.json` exists, `categoryId` is `null` and `tags` is `[]` for every question (expected at this stage).
- [ ] `data/categories/<tech>.json` exists, was generated via `01-build-categories.md`, and `docs/prompts/categories.md` contains a matching section.
- [ ] Category review checklist (Step 4) fully completed. Categories are frozen.
- [ ] `data/tags/<tech>.json` exists, was generated via `03-add-tags.md`, and contains roughly 80–100 tags (or a deliberately justified different count).
- [ ] Tag review checklist (Step 6) fully completed. Tags are frozen.
- [ ] `data/enriched/<tech>.json` exists, was generated via `05-build-final-dataset.md`.
- [ ] Full Step 8 validation checklist passes against `data/enriched/<tech>.json`.
- [ ] Frontend integration points (Step 9) are updated once the frontend exists.
- [ ] All changes are committed, with the new technology reachable from a known Git commit/branch.

---

# Quick Reference

```
Original (en + uk, hand-authored)
        ↓
   npm run build-data <tech>
        ↓
Generated  (categoryId: null, tags: [])
        ↓
   01-build-categories.md
        ↓
Categories (draft)
        ↓
   manual review (02-review-categories.md)  →  FROZEN
        ↓
   03-add-tags.md
        ↓
Tags (draft)
        ↓
   manual review (04-review-tags.md)  →  FROZEN
        ↓
   05-build-final-dataset.md
        ↓
Enriched  (categoryId assigned, tags assigned)
        ↓
   Step 8 validation
        ↓
   Step 9 frontend integration
```

---

# Appendix

### Directory Structure (Full)

```
data/
├── original/
│   ├── en/
│   │   ├── react.json
│   │   ├── javascript.json
│   │   ├── typescript.json
│   │   └── next.json
│   └── uk/
│       ├── react.json
│       ├── javascript.json
│       ├── typescript.json
│       └── next.json
├── generated/
│   ├── react.json
│   ├── javascript.json
│   ├── typescript.json
│   └── nextjs.json
├── categories/
│   ├── react.json
│   ├── javascript.json
│   ├── typescript.json
│   └── nextjs.json
├── tags/
│   ├── react.json
│   ├── javascript.json
│   ├── typescript.json
│   └── nextjs.json
└── enriched/
    ├── react.json
    ├── javascript.json
    ├── typescript.json
    └── nextjs.json
```

### Example File Names

For a new technology with slug `node`:

```
data/original/en/node.json
data/original/uk/node.json
data/generated/node.json
data/categories/node.json
data/tags/node.json
data/enriched/node.json
```

If the slug and the natural filename diverge (as with `nextjs` / `next.json`), only the `data/original/` files need the override — everything downstream always uses the canonical slug.

### Example Commands

```bash
# Sanity-check the project before starting
npx tsc --noEmit
npm run build-data react

# Build the generated dataset for a new technology
npm run build-data node

# (Categories, tags, and enrichment are run as Claude Code prompts,
#  not npm scripts — see Steps 3, 5, and 7 above.)
```

### Example Generated Schema (Step 2 output)

```json
{
  "id": "...",
  "difficulty": "medium",
  "question": { "en": "...", "uk": "..." },
  "answer": { "en": "...", "uk": "..." },
  "categoryId": null,
  "tags": []
}
```

### Example Enriched Schema (Step 7 output)

```json
{
  "id": "...",
  "difficulty": "medium",
  "question": { "en": "...", "uk": "..." },
  "answer": { "en": "...", "uk": "..." },
  "categoryId": 3,
  "tags": ["Streams", "Backpressure"]
}
```

### Useful Notes

- The `answerBlocks` → Markdown renderer (`src/lib/markdown/answerBlocksToMarkdown()`) is shared, technology-agnostic infrastructure — you should never need to modify it while adding a technology. If a new technology's content genuinely needs a Markdown feature the renderer doesn't support, that's a separate task, not part of this pipeline.
- Only Stage 2 (`build-data`) is an actual script (`scripts/build-data.ts`, invoked via `npm run build-data <technology>`). Stages 3, 5, and 7 are performed by an AI agent following the corresponding prompt file in `docs/prompts/new-technology/` — there is currently no `build-categories`, `build-tag-dictionaries`, or `enrich-data` npm script in this project, despite some older internal notes referring to them that way.
- `docs/prompts/categories.md` is occasionally referenced elsewhere in this project's prompt files as `docs/categories.md` (without the `prompts/` segment) — that path does not exist. Always use `docs/prompts/categories.md`.
- There is no automated validation script checked in yet for Step 8 — all validation described above has, to date, been performed by hand or via one-off scripts. Writing a reusable one is a good candidate for a future improvement to this pipeline.
