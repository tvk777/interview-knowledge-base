# Markdown Rendering Specification

Design document for the AnswerBlock → GitHub Flavored Markdown (GFM) conversion layer. This is a design-only document; no code is implemented here. It is based entirely on the real dataset in `data/original/*.json` (352 questions, 3,071 answer blocks, across javascript.json, react.json, typescript.json, next.json) — see [analysis_blocks_report.md](./analysis_blocks_report.md) for the underlying data audit.

---

# 1. Overview

The renderer converts a question's `answerBlocks` array — a small rich-text document tree (headings, paragraphs, lists, code, tables, with inline marks for bold/code) — into a single GitHub Flavored Markdown string suitable for display anywhere Markdown is rendered (README-style viewers, chat UIs, static site generators).

The dataset exposes exactly **six block types** (`heading`, `paragraph`, `bulletList`, `numberedList`, `code`, `table`) built from a shared **inline node** primitive (`{ text, bold?, code? }`). The renderer's job is to walk that tree once, top to bottom, and emit clean, deterministic GFM — preserving the semantic formatting the data already encodes (bold, inline code, nesting, tables) without inventing structures the dataset doesn't contain (no links, no images, no blockquotes, no strikethrough, no task lists, no headings beyond level 3–4).

Because the source JSON has known data-entry defects (missing `heading.level`, stray `children: []` on text leaves, a stray `text2` field, a one-off `boldItalic` mark, inconsistent `code.language` casing/typos), the renderer must be defensive by construction: every function tolerates missing or malformed input and degrades gracefully rather than throwing.

---

# 2. Global Rendering Rules

- **Encoding:** output is a plain UTF-8 string (no BOM).
- **Line endings:** `\n` only (Unix). Never emit `\r\n`.
- **Whitespace:** every line is trimmed of trailing spaces; no line in the output ends with whitespace.
- **Block spacing:** exactly **one blank line** separates top-level blocks (i.e. blocks are joined with `\n\n`). No blank lines are inserted *within* a block beyond what GFM requires structurally (e.g. before/after a fenced code block, which is naturally handled by block separation).
- **Document edges:** no leading or trailing blank lines. The final string is trimmed of leading/trailing `\n` (but not of meaningful internal whitespace).
- **Determinism:** given the same input array, the output string is always byte-identical. No timestamps, random IDs, or non-stable iteration order.
- **Empty input:** `answerBlocksToMarkdown([])` (or `null`/`undefined` blocks) returns `""`.

---

# 3. Rendering Specification

## heading

### Purpose
A section title inside an answer, used to break a long answer into labeled parts (e.g. "JavaScript data types"). Maps to a Markdown ATX heading.

### JSON Example
```json
{
  "type": "heading",
  "level": 4,
  "children": [{ "text": "JavaScript description:" }]
}
```

### Markdown Output
```markdown
#### JavaScript description:
```

### Rendering Rules
- Prefix is `"#".repeat(level)` followed by a single space, then the rendered inline content of `children`.
- `level` is clamped to the range actually observed in the data (3–4); see [Section 8](#8-headings) for the missing-level default.
- Heading text is rendered through the same inline renderer used for paragraphs (bold/code marks are preserved).
- No trailing `#` closing sequence is emitted (ATX-open style only, matching GFM convention and keeping output minimal per KISS).
- A heading is always its own top-level block, separated from neighbors by the standard one-blank-line rule.

## paragraph

### Purpose
A run of prose — the primary explanatory text of an answer.

### JSON Example
```json
{
  "type": "paragraph",
  "children": [{ "bold": true, "text": "Functional programming:" }]
}
```

### Markdown Output
```markdown
**Functional programming:**
```

### Rendering Rules
- Renders as the inline-rendered concatenation of `children`, with no block-level prefix.
- A paragraph is always a single Markdown line (the dataset contains no embedded newlines inside paragraph text); the renderer does not need to wrap or reflow text.
- If `children` is missing or empty, the paragraph renders as an empty string and is dropped from output (see [Section 9](#9-edge-cases)).

## bulletList

### Purpose
An unordered set of related points, e.g. sub-properties of a concept ("Function scope.", "Not recommended.").

### JSON Example
```json
{
  "type": "bulletList",
  "children": [
    { "type": "listItem", "children": [{ "text": "Used to store ordered collections of elements." }] },
    { "type": "listItem", "children": [{ "text": "Values are accessed by numeric indexes." }] }
  ]
}
```

### Markdown Output
```markdown
- Used to store ordered collections of elements.
- Values are accessed by numeric indexes.
```

### Rendering Rules
- Each `listItem` becomes one line prefixed with `- ` (GFM unordered marker), followed by the inline-rendered content of the item's leading text run.
- See [Section 5](#5-lists) for nested lists and embedded code inside list items.

## numberedList

### Purpose
An ordered/enumerated set of points, structurally identical to `bulletList`, differing only in the `type` discriminant and the Markdown marker used.

### JSON Example
```json
{
  "type": "numberedList",
  "children": [
    {
      "type": "listItem",
      "children": [
        { "bold": true, "text": "`var`" },
        {
          "type": "bulletList",
          "children": [
            { "type": "listItem", "children": [{ "text": "Legacy declaration method." }] },
            {
              "type": "listItem",
              "children": [
                { "text": "Not recommended." },
                { "type": "code", "content": "var x = 10;", "language": "javascript" }
              ]
            }
          ]
        }
      ]
    }
  ]
}
```

### Markdown Output
```markdown
1. **`var`**
   - Legacy declaration method.
   - Not recommended.

     ```javascript
     var x = 10;
     ```
```

### Rendering Rules
- Items are numbered sequentially starting at `1.` using GFM auto-numbering conventions (each item literally prefixed `1.` is also valid GFM — but this renderer emits the true incrementing index for readability and determinism outside of Markdown renderers that don't renumber).
- Same nesting/indentation rules as `bulletList` apply (see [Section 5](#5-lists)).

## code

### Purpose
A fenced code snippet illustrating a concept, tagged with a language for syntax highlighting.

### JSON Example
```json
{
  "type": "code",
  "content": "function outer() {\n  let counter = 0;\n\n  return function inner() {\n    counter++;\n    console.log(counter);\n  };\n}",
  "language": "javascript"
}
```

### Markdown Output
````markdown
```javascript
function outer() {
  let counter = 0;

  return function inner() {
    counter++;
    console.log(counter);
  };
}
```
````

### Rendering Rules
- Emits a GFM fenced code block using triple backticks, with the normalized `language` as the fence info string (see [Section 6](#6-code-blocks) for normalization rules).
- `content` is emitted verbatim (no re-indentation, no trimming of internal blank lines), since the fence itself supplies line separation.
- When nested inside a list item, the fence is indented to align with the list item's content column (see [Section 5](#5-lists)).

## table

### Purpose
A side-by-side comparison, e.g. "Shallow Copy vs Deep Copy" across several criteria rows.

### JSON Example
```json
{
  "type": "table",
  "header": [
    [{ "bold": true, "text": "Criterion" }],
    [{ "bold": true, "text": "Shallow Copy" }],
    [{ "bold": true, "text": "Deep Copy" }]
  ],
  "rows": [
    [
      [{ "bold": true, "text": "Copy depth" }],
      [{ "text": "Only top-level properties" }],
      [{ "text": "All nested levels recursively" }]
    ]
  ]
}
```

### Markdown Output
```markdown
| **Criterion** | **Shallow Copy** | **Deep Copy** |
| --- | --- | --- |
| **Copy depth** | Only top-level properties | All nested levels recursively |
```

### Rendering Rules
- See [Section 7](#7-tables) for full details on column count, separator row, and cell rendering.

---

# 4. Inline Formatting

Inline nodes are the leaves shared across `paragraph`, `heading`, `listItem`, and table cells. The observed leaf shape is `{ text: string, bold?: boolean, code?: boolean }`, plus one non-standard mark (`boldItalic`) and two corrupt fields (`children`, `text2`) that must be tolerated.

- **plain text**: a node with only `text` renders as that text, escaped (see below).
- **bold** (`bold: true`): wraps the escaped text in `**...**`.
- **inline code** (`code: true`): wraps the raw (unescaped — see below) text in single backticks `` `...` ``. If the text itself contains a backtick, the renderer falls back to a longer backtick fence (`` `` ``) around it per GFM convention.
- **boldItalic** (`boldItalic: true`): observed only 3 times (react.json), always alone (never combined with `bold`/`code` on the same node). Normalized to combined bold+italic Markdown: `***text***`.
- **mixed formatting**: within one block, adjacent inline nodes with different marks are rendered independently and concatenated with no extra separator — the mark boundary is exactly the node boundary (e.g. `**Bold** and `code``).
- **escaping Markdown characters**: for non-code text, the renderer escapes GFM special characters that could be misinterpreted as syntax — at minimum `*`, `_`, `` ` ``, `[`, `]`, `\` — by prefixing with `\`. Text inside a `code: true` node is **not** escaped (it is rendered literally inside backticks, matching how code spans work in GFM).
- **whitespace handling**: leading/trailing whitespace within a single inline node is preserved as-is (the dataset relies on nodes like `{ "text": " or " }` to supply spacing between adjacent formatted runs — trimming would collapse intended spacing). Only the fully-assembled block's overall leading/trailing whitespace is trimmed, not each inline node.
- **corrupted properties ignored**: a text node is read using only `text`, `bold`, `code` (and `boldItalic` per above). Any other property present on the node (`children: []`, `text2`) is ignored outright — the renderer never inspects or recurses into them. If `text` itself is missing/non-string on a node, that node contributes an empty string and is otherwise skipped (no crash).

---

# 5. Lists

## Unordered lists (`bulletList`)
Each `listItem` renders as `- <inline content>`.

## Ordered lists (`numberedList`)
Each `listItem` renders as `<n>. <inline content>` with `n` starting at 1 and incrementing per item at that nesting level.

## Nested lists
A `listItem` may contain a nested `bulletList` (the only nested-list type observed in the dataset — no `numberedList`-inside-`numberedList` or `numberedList`-inside-`bulletList` case exists). Example from the dataset:

```json
{
  "type": "listItem",
  "children": [
    { "bold": true, "text": "`var`" },
    {
      "type": "bulletList",
      "children": [
        { "type": "listItem", "children": [{ "text": "Legacy declaration method." }] },
        { "type": "listItem", "children": [{ "text": "Function scope." }] }
      ]
    }
  ]
}
```
renders as:
```markdown
1. **`var`**
   - Legacy declaration method.
   - Function scope.
```

Maximum nesting depth observed in the dataset is **2** (a `bulletList` inside a `listItem` inside a top-level `numberedList`/`bulletList`). The renderer is implemented recursively so deeper nesting, if it ever appears, degrades gracefully rather than breaking — but no test data beyond depth 2 exists.

## Nested indentation
Each nesting level indents by the width of its enclosing list marker (2 spaces for `- `, 3 spaces for `N. `), cumulative across levels — i.e. a nested block's indentation equals the sum of all its ancestor markers' widths, matching CommonMark/GFM's requirement that nested block content align under the parent list marker's text.

## Nested code blocks
A `listItem` may directly contain a `code` block (sibling to its leading text run), e.g.:
```json
{
  "type": "listItem",
  "children": [
    { "text": "Not recommended." },
    { "type": "code", "content": "var x = 10;", "language": "javascript" }
  ]
}
```
renders as:
```markdown
- Not recommended.

  ```javascript
  var x = 10;
  ```
```
The fence is indented to the item's content column, and a blank line separates the item's leading text from the fenced block (required by CommonMark for a fenced block to be recognized as part of the list item rather than breaking out of the list).

## Spacing between items
No blank line between sibling `listItem`s unless one of them contains a nested block (nested list or nested code) — in that case a blank line follows the nested block before the next sibling item, to keep the list "loose" only where necessary and "tight" (no blank lines) everywhere else, which is standard GFM/CommonMark rendering behavior and keeps output minimal.

## Spacing before and after lists
Lists are top-level blocks like any other — one blank line before and after, per [Section 2](#2-global-rendering-rules).

---

# 6. Code Blocks

- Render every code block using fenced code blocks.
- If `language` is present, render it after the opening fence.
- Convert `language` to lowercase.
- If `language` is missing, render a plain fenced code block.
- Preserve the code content exactly as provided.
---

# 7. Tables

## Markdown table generation
Every `table` block renders as a standard GFM pipe table: header row, separator row, then one row per data row.

## Header generation
`header` is an array of cells (one per column); each cell is an array of inline nodes, rendered through the same inline renderer as paragraphs and joined with no extra separator. Columns observed range from 2 to 4 (`maxTableCols = 4` across the dataset).

## Separator row
A row of `---` per column (`| --- | --- | --- |` for a 3-column table), with column count always matching `header.length` (verified: zero header/row length mismatches in the dataset, so the renderer can assume `header.length` is the authoritative column count but should still defensively pad/truncate any row that doesn't match, per [Section 9](#9-edge-cases)).

## Inline formatting inside cells
Cells reuse the exact same inline-node renderer as paragraphs/headings, so `bold`/`code` marks inside a cell (e.g. `{ "code": true, "text": "function name() {}" }`) are preserved:
```json
{
  "header": [[{ "text": "Property" }], [{ "text": "Function Declaration" }], [{ "text": "Function Expression" }]],
  "rows": [[
    [{ "bold": true, "text": "Syntax" }],
    [{ "code": true, "text": "function name() {}" }],
    [{ "code": true, "text": "const name = function() {}" }, { "text": " / " }, { "code": true, "text": "() => {}" }]
  ]]
}
```
renders as:
```markdown
| Property | Function Declaration | Function Expression |
| --- | --- | --- |
| **Syntax** | `function name() {}` | `const name = function() {}` / `() => {}` |
```

## Escaping `\|`
Not currently exercised by the dataset (zero cells contain a literal `|` character), but the renderer escapes any `|` found in cell text as `\|` unconditionally, since an unescaped pipe would silently corrupt the table's column structure — this is a correctness guard, not a data-driven feature.

## Multiline cells
Not present in the dataset (zero cells contain `\n`). GFM pipe tables cannot represent real newlines inside a cell; if one is ever encountered, the renderer replaces it with a single space (or `<br>`, see [Open Questions](#11-open-questions)) rather than emitting a raw newline that would break the table syntax.

## Markdown table limitations
GFM pipe tables have no support for merged cells, multi-line cell content, or nested block content (lists/code) inside a cell — none of which the dataset requires, so no workaround is designed for them (YAGNI).

## Alignment
No alignment information exists anywhere in the source schema (`table` blocks carry no per-column alignment field). All columns render left-aligned (the default `---` separator, with no `:---`/`---:`/`:---:` markers).

---

# 8. Headings

## Heading level mapping
`heading.level` maps directly to the number of `#` characters. Only `3` and `4` appear in the dataset (`4` × 320, `3` × 1), so the renderer only needs to support that narrow range, though it should not reject an out-of-range value defensively (clamp rather than throw — see [Section 9](#9-edge-cases)).

## Missing level
193 of 514 headings (37.5%) have **no** `level` property at all. This is the single largest structural inconsistency in the dataset and must be handled as a first-class case, not an exception.

## Default heading level
When `level` is missing, default to **4** — this matches the overwhelming majority (320/321, 99.7%) of headings that *do* specify a level, so defaulting to 4 keeps visually-missing-level headings consistent with the rest of the document rather than introducing a visually distinct third heading size.

## Spacing before and after headings
Standard top-level block spacing (one blank line) applies — no special-casing beyond [Section 2](#2-global-rendering-rules).

---

# 9. Edge Cases

- **Missing `heading.level`**: render as `####` (level 4 default; see [Section 8](#8-headings)).
- **Empty `answerBlocks`**: return `""` immediately.
- **Unknown block types**: any block whose `type` is not one of the six known types is skipped entirely (not rendered, not thrown) — the block contributes nothing to the output, and no error surfaces to the caller. This keeps the renderer forward-tolerant of future schema additions.
- **Unknown inline properties**: ignored (not read, not rendered) — see [Section 4](#4-inline-formatting).
- **Corrupted nodes**: a node missing its expected core field (e.g. inline node without `text`, a `code` block without `content`, a `table` without `header`/`rows`) is treated as empty/absent for that piece — the renderer substitutes an empty string / empty array rather than throwing, and the surrounding block still renders (possibly as an empty block, which is then subject to the empty-block rule below).
- **Empty paragraphs** (`children` missing or `[]`, or all children resolve to empty text): the paragraph produces no output and is dropped from the block list entirely (it does not contribute a stray blank line). Not observed in the dataset today (0 instances) but must be handled since upstream data has already shown it drifts.
- **Empty headings**: same treatment as empty paragraphs — dropped rather than emitting a bare `####` with nothing after it.
- **Empty lists** (`children` missing or `[]`): the whole list block is dropped. Not observed in the dataset (0 instances).
- **Empty tables** (`rows` missing or `[]`, but `header` present): render the header + separator row only (a header-only table is valid GFM and still communicates the comparison categories). If `header` is *also* missing/empty, the whole table block is dropped. Not observed in the dataset (0 instances).
- **Malformed nested structures** (e.g. a `listItem` whose `children` contains something other than a text node, nested list, or `code` block — the only three shapes seen in the data): any child of unrecognized shape is skipped, the rest of the item still renders.
- **General guarantee**: no input — however malformed — causes `answerBlocksToMarkdown` to throw. Every renderer function returns `""` (or drops its contribution) on unrecoverable input rather than propagating an exception.

---

# Known Decisions

- Missing `heading.level` → render as `####` (default level 4).
- Only heading levels 3–4 are meaningfully supported; any other numeric value is clamped into range defensively rather than emitting `#######`-style invalid depth.
- Normalize `code.language` to lowercase before emitting as the fence info string.
- `toml` / `json` / `css` / `ts` / `tsx` / `jsx` / `js` / `javascript` / `typescript` / `bash` → kept as their lowercased selves on the fence.
- Unknown block type → skip rendering entirely (no output, no error).
- Unknown/corrupted inline property (`children` stray array, `text2`) → ignored; only `text`/`bold`/`code` are read.
- `boldItalic: true` → rendered as `***text***` (combined bold+italic), not dropped.
- One blank line between top-level blocks; no blank line within a tight list beyond what nested blocks require.
- Nested list indentation: cumulative marker width per level (2 spaces for `- `, 3 spaces for `N. `).
- A `listItem` containing a nested `code` block: blank line + indented fence, to satisfy CommonMark's requirement for fenced blocks to stay inside the list item.
- Table columns: no alignment markers (source has no alignment data) — all columns default-aligned.
- Table cell `|` and `\n` are escaped/substituted defensively, even though the current dataset never triggers this path.
- Trim final output (no leading/trailing blank lines); no trailing whitespace on any line.
- Empty input (`[]`, `null`, `undefined`) → return `""`.
- Empty/content-less blocks of any type (paragraph, heading, list, table) → dropped from output rather than emitting an empty stub.
- The renderer never throws; all failure modes degrade to "render nothing for this piece."

---


# Implementation Roadmap

Proposed architecture: one small, pure function per block type, plus a shared inline renderer and a dispatcher, composed by the top-level entry point. Every function takes already-parsed JS objects (no JSON.parse concerns) and returns a string; none of them throw.

- **`renderInline(nodes: unknown): string`**
  Renders an array of inline leaf nodes (as found in `paragraph.children`, `heading.children`, a `listItem`'s leading text run, and table cells) into a single Markdown-formatted string. Applies mark wrapping (`bold` → `**`, `code` → `` ` ``, `boldItalic` → `***`), escapes GFM special characters in non-code text, ignores unrecognized/corrupt properties (`children`, `text2`) on each node, and tolerates a missing/non-array input by returning `""`.

- **`renderHeading(block): string`**
  Resolves the effective level (given value if 3–4, else default 4), renders `children` via `renderInline`, and emits the `#`-prefixed line. Returns `""` for an empty/missing-content heading (dropped by the caller).

- **`renderParagraph(block): string`**
  Delegates entirely to `renderInline(block.children)`. Returns `""` when there's no content, signaling the caller to drop the block.

- **`renderBulletList(block, depth = 0): string`** and **`renderNumberedList(block, depth = 0): string`**
  Iterate `children` (`listItem`s); for each item, render its leading inline run via `renderInline`, then recursively render any nested list (calling back into `renderBulletList`/`renderNumberedList` at `depth + 1`) or nested `code` block (via `renderCode`, indented), joining nested content with the appropriate indentation and blank-line rules from [Section 5](#5-lists). Both functions share the bulk of their logic (identical structure, differing only in marker generation: `- ` vs `${n}. `) — implementation-wise this argues for a shared internal `renderList(block, ordered: boolean, depth)` helper with the two exported names as thin wrappers, but that's an implementation-time call, not a design requirement.

- **`renderCode(block, indent = ''): string`**
  Normalizes `language` (lowercase; omitted if missing), builds the fenced block, applies `indent` to every line when called from within a list item. Handles missing `content` by emitting an empty fence pair.

- **`renderTable(block): string`**
  Validates `header` is a non-empty array (else drops the whole block); renders header cells and each row's cells via `renderInline` per cell, builds the separator row from `header.length`, defensively pads/truncates any row whose length doesn't match the header, and escapes `|`/`\n` inside cell text.

- **`renderBlock(block): string`**
  The dispatcher: switches on `block.type`, calling the matching `render*` function; returns `""` for any unrecognized `type` or malformed/non-object block, so unknown block types are silently skipped per [Section 9](#9-edge-cases).

- **`answerBlocksToMarkdown(blocks: AnswerBlock[]): string`**
  The public entry point. Guards against non-array/empty input (returns `""` immediately). Otherwise maps every block through `renderBlock`, filters out blocks that rendered to `""` (empty/dropped blocks per [Section 9](#9-edge-cases)), joins the remaining block strings with `\n\n`, and trims the final result (no leading/trailing blank lines, matching [Section 2](#2-global-rendering-rules)). This function contains no per-block-type logic itself — it is purely orchestration, keeping each block type's rendering rules isolated and independently testable in its own `render*` function.
