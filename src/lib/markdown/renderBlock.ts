import { renderHeading } from './renderHeading';
import { renderParagraph } from './renderParagraph';
import { renderList } from './renderList';
import { renderCode } from './renderCode';
import { renderTable } from './renderTable';

export function renderBlock(block: unknown): string {
  if (typeof block !== 'object' || block === null) return '';

  const { type } = block as Record<string, unknown>;

  switch (type) {
    case 'heading':
      return renderHeading(block);
    case 'paragraph':
      return renderParagraph(block);
    case 'bulletList':
    case 'numberedList':
      return renderList(block);
    case 'code':
      return renderCode(block);
    case 'table':
      return renderTable(block);
    default:
      return '';
  }
}
