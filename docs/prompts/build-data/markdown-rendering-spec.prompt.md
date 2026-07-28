We are designing the Markdown conversion layer for this project.

The implementation has NOT started yet.

Before writing any code, I want to create the complete design document for the Markdown renderer.

This document will become the single source of truth for implementing the renderer and should be used later when implementing:

- answerBlocksToMarkdown()
- renderHeading()
- renderParagraph()
- renderBulletList()
- renderNumberedList()
- renderCode()
- renderTable()
- renderInline()
- renderBlock()

You have already analyzed the entire dataset and found only six answer block types:

- heading
- paragraph
- bulletList
- numberedList
- code
- table

## Important principles

All recommendations must follow these principles:

1. Every decision must be based on the real dataset.
Do not invent features that do not exist.

2. Target GitHub Flavored Markdown (GFM).

3. Follow KISS and YAGNI.
Only support structures that actually exist in the dataset.

4. The generated Markdown should be clean, readable and deterministic.

5. The renderer should never throw because of malformed input.
Gracefully ignore unsupported or corrupted data whenever possible.

Do NOT generate any TypeScript code.

Do NOT implement anything.

Your task is only to design the renderer.

---

# 1. Overview

Describe the purpose of the renderer.

Explain that it converts AnswerBlocks into GitHub Flavored Markdown while preserving formatting and readability.

---

# 2. Global Rendering Rules

Define global formatting rules.

Include:

- UTF-8 output
- Unix line endings (\n)
- trim leading/trailing whitespace
- no trailing spaces
- one blank line between top-level blocks
- no blank lines at the beginning or end of the document
- deterministic output
- empty input returns an empty string

---

# 3. Rendering Specification

For each block type:

- heading
- paragraph
- bulletList
- numberedList
- code
- table

include:

## Purpose

Explain what the block represents.

## JSON Example

Use a real example from the dataset.

## Markdown Output

Show the exact Markdown that should be generated.

## Rendering Rules

Explain every formatting decision.

---

# 4. Inline Formatting

Describe how inline nodes should be rendered.

Include:

- plain text
- bold
- inline code
- boldItalic
- mixed formatting
- escaping Markdown characters
- whitespace handling

Also explain how corrupted properties should be ignored.

---

# 5. Lists

Describe:

- unordered lists
- ordered lists
- nested lists
- nested indentation
- nested code blocks
- spacing between items
- spacing before and after lists

Use real examples from the dataset.

---

# 6. Code Blocks

Describe:

- fenced code blocks
- language normalization
- lowercase language names
- unsupported language names
- typo normalization (example: bush -> bash)
- unknown languages
- empty code blocks

Use real examples.

---

# 7. Tables

Describe:

- markdown table generation
- header generation
- separator row
- inline formatting inside cells
- escaping |
- multiline cells
- Markdown table limitations
- alignment

Use a real dataset example.

---

# 8. Headings

Describe:

- heading level mapping
- missing level
- default heading level
- spacing before and after headings

---

# 9. Edge Cases

Describe renderer behavior for:

- missing heading.level
- empty answerBlocks
- unknown block types
- unknown inline properties
- corrupted nodes
- empty paragraphs
- empty headings
- empty lists
- empty tables
- malformed nested structures

The renderer should never throw because of malformed content.

---

# 10. Known Decisions

Create a section named exactly:

# Known Decisions

List every important design decision made while creating this specification.

Examples:

- Missing heading.level → render as ####
- Normalize code language names to lowercase
- bush → bash
- txt/url/env → render without language identifier
- Unknown block → skip rendering
- Unknown inline property → ignore
- One blank line between top-level blocks
- Trim final output
- Empty input → return empty string

Add every additional decision that should be remembered during implementation.

This section should become the implementation checklist.

---

# 11. Open Questions

Create a section named exactly:

# Open Questions

List every question or ambiguity that cannot be answered automatically from the dataset.

Examples:

- Should plain URLs be converted into Markdown links?
- Should HTML be escaped?
- Should very wide tables be wrapped?
- Should unsupported languages keep the language tag or remove it?
- Should empty headings be rendered or skipped?

If no unresolved questions remain, explicitly state:

"No open questions were found."

---

# 12. Implementation Roadmap

Finally, propose the renderer architecture.

Recommend one renderer function per block type.

For example:

- renderHeading()
- renderParagraph()
- renderBulletList()
- renderNumberedList()
- renderCode()
- renderTable()
- renderInline()
- renderBlock()
- answerBlocksToMarkdown()

Describe the responsibility of each function.

Do not generate any code.

The final document should be detailed enough that another developer could implement the renderer without making additional design decisions.