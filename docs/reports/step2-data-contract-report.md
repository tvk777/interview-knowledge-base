Data Analysis
I checked the actual current shape of data/enriched/, data/categories/, and data/tags/ (all four technologies) rather than assuming — here's what the real generated knowledge base looks like today:


// data/enriched/<tech>.json — one entry
{
  "id": "46f58a8d-b89c-4435-82c6-bc09cba84d80",
  "difficulty": "medium",
  "question": { "en": "What is React?", "uk": "Що таке React?" },
  "answer": { "en": "**React** is a...", "uk": "**React** — це..." },
  "categoryId": 1,
  "tags": ["Virtual DOM", "Reconciliation", "One-Way Data Flow"]
}

// data/categories/<tech>.json — one entry
{ "id": 1, "name": "Fundamentals", "description": "Core React concepts..." }

// data/tags/<tech>.json — one entry
{ "name": "One-Way Data Flow", "categoryId": 1 }
Two things worth surfacing before I write anything:

answer is already rendered Markdown, not a block tree. The original answerBlocks structure (headings/paragraphs/lists/code/tables) only exists in data/original/*.json — it gets flattened into a plain Markdown string by the build pipeline before it ever reaches data/generated/data/enriched. So the roadmap's listed type name "AnswerBlock" doesn't match what the frontend will actually receive. question and answer are both identical { en: string; uk: string } shapes.
There's no Technology registry file anywhere — technology only exists implicitly as filenames (react.json, javascript.json, typescript.json, nextjs.json) and as the hardcoded label list in TechnologyTabs.tsx. I'll have to design this type myself; it's not derived from an existing JSON contract the way the other four are.
Types to Be Created
Type	Shape	Source
LocalizedText	{ en: string; uk: string }	Shared by question and answer — this is what the roadmap calls "AnswerBlock" (see Question 1 below)
Difficulty	"easy" | "medium" | "hard"	Only "medium" appears in current data, but easy/hard are the documented convention
Question	{ id, difficulty, question: LocalizedText, answer: LocalizedText, categoryId: number, tags: string[] }	data/enriched/<tech>.json
Category	{ id: number, name: string, description: string }	data/categories/<tech>.json
Tag	{ name: string, categoryId: number }	data/tags/<tech>.json
Technology	{ slug: string, name: string }	No existing file — designed, see Question 2
Relationships
Technology → has many Category, Tag, Question (one JSON file per technology, per type).
Question.categoryId → foreign key to Category.id (numeric).
Question.tags → array of foreign keys to Tag.name — not an ID. Tags have no separate numeric identifier in this domain; name is effectively their primary key. This is worth stating explicitly since it's an asymmetry (Category is keyed by id, Tag is keyed by name).
Tag.categoryId → foreign key to Category.id.
I'm keeping foreign keys as plain number/string fields rather than embedding related objects (e.g. Question.category: Category), since the real JSON is flat/normalized — embedding would misrepresent "the structure of the generated knowledge base" in favor of a UI-convenience shape, which the task explicitly says to avoid.

Proposed File Structure
Following your suggested layout closely, one file per concept:


frontend/types/
    localized-text.ts   (LocalizedText, Difficulty)
    question.ts          (Question)
    category.ts           (Category)
    tag.ts                 (Tag)
    technology.ts          (Technology)
    index.ts                (barrel re-export)
question.ts imports LocalizedText from localized-text.ts; nothing else cross-imports (categoryId/tags stay primitive, no Category/Tag imports needed in question.ts).

Assumptions / Questions
Naming: AnswerBlock vs. LocalizedText. The roadmap lists "AnswerBlock" as a required type name, but since the real data shape is just bilingual text (not a block tree) and is identical for both question and answer, I'd rather name it accurately (LocalizedText) and use it for both fields, than name it AnswerBlock and have it also represent question (which would be a confusing name for something that isn't an answer). Want me to keep LocalizedText, or do you want the literal name AnswerBlock preserved for continuity with the roadmap's vocabulary even though it'd be reused for question too?
Technology has no source file to derive from. I've proposed { slug: string, name: string } — deliberately using plain string for slug rather than a hardcoded union ("react" | "javascript" | ...), since ADDING_NEW_TECHNOLOGY.md documents this list as actively extensible (Node.js, Vue, etc. are explicitly planned future additions) and a closed union would need editing every time a technology is added. Is that the right call, or would you prefer a strict union now for stronger type safety, accepting that it'll need updating later?
Difficulty as a union type. Only "medium" exists in the live data right now. I'm modeling it as "easy" | "medium" | "hard" based on the documented convention rather than what's literally observed, since a bare string would be weaker typing for no real benefit. Flagging in case you'd rather it stay string until easy/hard actually appear in data.
No code written yet — waiting for your answers/approval.

Summary
Created the frontend's shared TypeScript data contracts. No UI changes, no data loading, no business logic.

Created Files

frontend/types/
    common.ts       (Language, LocalizedText, Difficulty)
    question.ts      (Question)
    category.ts       (Category)
    tag.ts              (Tag)
    technology.ts       (Technology)
No index.ts — with five tiny, independently-importable files and nothing yet consuming more than one or two of them at a time, a barrel file wouldn't earn its keep right now. Easy to add later once real consumers (services, hooks) want a single import line.

Architectural Decisions
LocalizedText = Record<Language, string> rather than a hand-written { en: string; uk: string } — ties it directly to Language, so if a third language is ever added, both types update from one place. Record is a built-in TS utility, not a custom abstraction.
Difficulty = string (not a union). Explained inline with a comment, since it's a non-obvious choice a future reader would question: I checked scripts/build-data.ts and confirmed difficulty is typed string end-to-end with zero validation against a fixed set anywhere in the pipeline — a union would assert a guarantee the data doesn't actually have.
Foreign keys stay primitive (Question.categoryId: number, Question.tags: string[]) rather than embedding related objects — matches the real flat/normalized JSON, not a UI-convenience denormalized shape.
Tag has no id field — in this domain, name is the tag's actual identity (that's what Question.tags references), while Category is genuinely keyed by numeric id. Kept this asymmetry rather than papering over it with an invented tag ID.
Additional Type Introduced
Language ("en" | "uk") — not one of the five originally listed, but needed as its own shared type per your instruction, and it's what makes LocalizedText derivable via Record rather than duplicated by hand.

Verification
✅ npx tsc --noEmit — clean
✅ npm run lint — clean
✅ npm run build — succeeds
✅ Extra check beyond what was asked: I temporarily imported the real data/enriched/react.json, data/categories/react.json, and data/tags/react.json and assigned them to Question[], Category[], Tag[] respectively to confirm the types aren't just internally consistent but actually match production data — zero type errors. Scratch file removed after.
Not continuing to Step 3 — waiting for your review.