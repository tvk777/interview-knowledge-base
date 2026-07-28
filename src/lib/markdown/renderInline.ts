function escapeMarkdown(text: string): string {
  return text.replace(/[\\*_[\]]/g, '\\$&');
}

function wrapInlineCode(text: string): string {
  return text.includes('`') ? '`` ' + text + ' ``' : '`' + text + '`';
}

// The source dataset sometimes double-encodes emphasis on a bold node, e.g.
// { bold: true, text: "_Typing:_" }. The outer underscore pair is a redundant
// formatting artifact from the source, not literal text, so it's stripped
// before a bold node's text is escaped and wrapped.
function stripRedundantBoldUnderscores(text: string): string {
  if (text.length < 3 || !text.startsWith('_') || !text.endsWith('_')) return text;

  const inner = text.slice(1, -1);
  if (inner.startsWith('_') || inner.endsWith('_')) return text;

  return inner;
}

function renderInlineNode(node: unknown): string {
  if (typeof node !== 'object' || node === null) return '';

  const { text, bold, code, boldItalic } = node as Record<string, unknown>;
  if (typeof text !== 'string' || text === '') return '';

  if (code === true) return wrapInlineCode(text);

  if (boldItalic === true) return `***${escapeMarkdown(text)}***`;

  if (bold === true) return `**${escapeMarkdown(stripRedundantBoldUnderscores(text))}**`;

  return escapeMarkdown(text);
}

export function renderInline(nodes: unknown): string {
  if (!Array.isArray(nodes)) return '';
  return nodes.map(renderInlineNode).join('').trim();
}
