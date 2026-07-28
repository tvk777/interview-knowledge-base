import { renderInline } from './renderInline';
import { renderCode } from './renderCode';

interface RenderedItem {
  text: string;
  hasNested: boolean;
}

function isBlockNode(node: unknown): boolean {
  return typeof node === 'object' && node !== null && 'type' in node;
}

function renderNestedChild(child: unknown, contentIndent: string): { rendered: string; needsBlankLineBefore: boolean } {
  const { type } = child as Record<string, unknown>;
  if (type === 'bulletList' || type === 'numberedList') {
    return { rendered: renderList(child, contentIndent), needsBlankLineBefore: false };
  }
  if (type === 'code') {
    return { rendered: renderCode(child, contentIndent), needsBlankLineBefore: true };
  }
  return { rendered: '', needsBlankLineBefore: false };
}

function renderListItem(item: unknown, ordered: boolean, index: number, indent: string): RenderedItem | null {
  if (typeof item !== 'object' || item === null) return null;

  const { children } = item as Record<string, unknown>;
  if (!Array.isArray(children)) return null;

  const inlineNodes = children.filter((child) => !isBlockNode(child));
  const blockNodes = children.filter(isBlockNode);

  const marker = ordered ? `${index + 1}. ` : '- ';
  const contentIndent = indent + ' '.repeat(marker.length);

  const inlineText = renderInline(inlineNodes);
  let text = inlineText === '' ? (indent + marker).trimEnd() : indent + marker + inlineText;
  let hasNested = false;

  for (const child of blockNodes) {
    const { rendered, needsBlankLineBefore } = renderNestedChild(child, contentIndent);
    if (rendered === '') continue;
    hasNested = true;
    text += (needsBlankLineBefore ? '\n\n' : '\n') + rendered;
  }

  return { text, hasNested };
}

export function renderList(block: unknown, indent = ''): string {
  if (typeof block !== 'object' || block === null) return '';

  const { type, children } = block as Record<string, unknown>;
  if (type !== 'bulletList' && type !== 'numberedList') return '';
  if (!Array.isArray(children) || children.length === 0) return '';

  const ordered = type === 'numberedList';
  const items = children
    .map((item, index) => renderListItem(item, ordered, index, indent))
    .filter((item): item is RenderedItem => item !== null);

  if (items.length === 0) return '';

  let result = items[0].text;
  for (let i = 1; i < items.length; i++) {
    result += (items[i - 1].hasNested ? '\n\n' : '\n') + items[i].text;
  }
  return result;
}
