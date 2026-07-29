# Step 2 — Data Contracts

Before making any changes, read:

- docs/frontend-design.md
- docs/frontend-architecture.md
- docs/user-flow.md
- docs/roadmap.md

The implementation roadmap is the source of truth.

----------------------------------------------------
Goal
----------------------------------------------------

Define all application data models using TypeScript.

This step establishes the application's data contracts.

No UI changes.

No data loading.

No business logic.

----------------------------------------------------
Requirements
----------------------------------------------------

Create the application's shared TypeScript models.

At minimum define:

- Question
- Category
- Technology
- Tag
- AnswerBlock

If additional shared types are required to accurately model the generated knowledge base, introduce them as needed.

The models should represent the structure of the generated knowledge base rather than the UI.

Avoid UI-specific types unless absolutely necessary.

----------------------------------------------------
Project Structure
----------------------------------------------------

Create the `frontend/types` directory.

Choose an appropriate file organization.

For example:

types/

    question.ts
    category.ts
    technology.ts
    tag.ts
    answer.ts
    index.ts

or another structure if you believe it is cleaner.

Explain your reasoning before implementation.

----------------------------------------------------
Important
----------------------------------------------------

The TypeScript models should become the single source of truth for the frontend.

Future services, hooks, and UI components should all depend on these types.

Design the contracts with future extensibility in mind while keeping them simple.

Do not introduce unnecessary abstractions or generic types.

----------------------------------------------------
Before Writing Code
----------------------------------------------------

First analyze the existing generated knowledge base structure.

Explain:

- which types will be created
- how they relate to each other
- proposed file structure
- whether additional shared types are needed
- any assumptions or questions

Wait for approval before generating code.

----------------------------------------------------
After Implementation
----------------------------------------------------

Provide:

- summary
- created files
- architectural decisions
- explanation of any additional types introduced
- confirmation that:
  - TypeScript passes
  - ESLint passes
  - Build succeeds

Do not continue with the next implementation step.

next prompt after analysis:
The analysis looks good.

Approved with the following adjustments:

1. Use `LocalizedText` instead of `AnswerBlock`.

The current generated knowledge base contains localized strings, not answer block structures.

2. Keep `Technology` as:

{
    slug: string;
    name: string;
}

Do not use a closed union for technology names.

3. Use a shared `Language` type:

type Language = "en" | "uk";

4. Keep `Difficulty` as a string union if it represents the guaranteed data contract of the generation pipeline.

Otherwise explain why a plain string would be preferable.

5. Instead of `localized-text.ts`, consider a more generic file such as `common.ts` (or another name you believe scales better), since it will likely contain multiple shared types (LocalizedText, Language, Difficulty).

6. Do not create `index.ts` unless it already provides clear value.

Avoid premature abstractions.

Proceed with the implementation.
