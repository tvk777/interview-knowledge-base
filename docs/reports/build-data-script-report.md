Done
Implemented scripts/build-data.ts exactly to spec, plus the minimal tooling needed to actually run it (package.json with a build-data script, tsconfig.json, and tsx/typescript/@types/node as dev dependencies — nothing else existed in the repo to run TypeScript CLI scripts).

One mapping decision, resolved from existing docs, not guessed: the CLI's nextjs technology slug doesn't match the source filename — data/original/next.json, not nextjs.json. I checked docs/architecture.txt, which already documents the target/enriched convention using nextjs.json. So build-data.ts reads data/original/next.json but writes data/generated/nextjs.json, keeping the output aligned with the canonical slug used everywhere else (and with the CLI argument itself, per the data/generated/<technology>.json rule in the prompt).

Validation results (ran the script for all four technologies, then checked every requirement from the prompt's Validation section):

Check	react	javascript	nextjs	typescript
Valid JSON	✅	✅	✅	✅
Question count matches source	✅ 113	✅ 126	✅ 100	✅ 13
answerBlocks absent	✅	✅	✅	✅
Schema fields correct (id, tags: [], level: "", category: "", question.{en,uk}, answer.{en,uk})	✅	✅	✅	✅
answer.en populated with generated Markdown	✅	✅	✅	✅
UTF-8 preserved (checked real non-ASCII content: typographic punctuation, box-drawing chars, emoji, stray Cyrillic)	✅ 10 chars	✅ 15 chars	✅ 12 chars	✅ 7 chars
Also verified the required error paths directly:

No argument → prints usage, exit code 1.
Unknown technology (vue) → prints clear error + usage, exit code 1.
Source file missing → Source file not found: ..., exit code 1.
Invalid JSON in source → Invalid JSON in ...: <parse error>, exit code 1.
npx tsc --noEmit is clean across the whole project (src + scripts). data/generated/ now holds fresh, validated output for all four technologies.