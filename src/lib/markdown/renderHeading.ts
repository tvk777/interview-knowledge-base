import { renderInline } from './renderInline';

const MIN_LEVEL = 3;
const MAX_LEVEL = 4;
const DEFAULT_LEVEL = 4;

function resolveLevel(level: unknown): number {
  if (typeof level !== 'number' || !Number.isFinite(level)) return DEFAULT_LEVEL;
  return Math.min(MAX_LEVEL, Math.max(MIN_LEVEL, Math.round(level)));
}

export function renderHeading(block: unknown): string {
  if (typeof block !== 'object' || block === null) return '';

  const { level, children } = block as Record<string, unknown>;
  const content = renderInline(children);
  if (content === '') return '';

  return `${'#'.repeat(resolveLevel(level))} ${content}`;
}
