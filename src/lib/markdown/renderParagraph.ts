import { renderInline } from './renderInline';

export function renderParagraph(block: unknown): string {
  if (typeof block !== 'object' || block === null) return '';

  const { children } = block as Record<string, unknown>;
  return renderInline(children);
}
