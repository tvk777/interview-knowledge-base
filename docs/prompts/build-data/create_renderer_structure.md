Great.

Please implement the renderer according to the specification.

Requirements:

- Keep the implementation as simple as possible.
- Follow KISS and YAGNI.
- Do not overengineer.
- Do not introduce unnecessary abstractions.
- No classes.
- No factories.
- No generic helper layers.
- Use plain TypeScript functions.

Create the following files:

src/lib/markdown/
    answerBlocksToMarkdown.ts
    renderBlock.ts
    renderInline.ts
    renderHeading.ts
    renderParagraph.ts
    renderList.ts
    renderCode.ts
    renderTable.ts
    index.ts

Implement:

- renderInline
- renderHeading
- renderParagraph
- renderList
- renderCode
- renderTable
- renderBlock
- answerBlocksToMarkdown

Requirements:

- Renderer must never throw.
- Unknown block types are skipped.
- Empty blocks are skipped.
- Code blocks use fenced Markdown.
- Convert language to lowercase if present.
- Preserve code content exactly.
- Use one blank line between rendered blocks.
- Keep every function small and readable.
- Reuse existing project types instead of creating new ones whenever possible.

When finished:

- Check for TypeScript errors.
- Remove unused imports.
- Ensure the implementation follows the specification exactly.