function normalizeLanguage(language: unknown): string {
  if (typeof language !== 'string') return '';
  const trimmed = language.trim();
  return trimmed === '' ? '' : trimmed.toLowerCase();
}

function indentLine(line: string, indent: string): string {
  return line === '' ? '' : indent + line;
}

export function renderCode(block: unknown, indent = ''): string {
  if (typeof block !== 'object' || block === null) return '';

  const { content, language } = block as Record<string, unknown>;
  const code = typeof content === 'string' ? content : '';
  const lang = normalizeLanguage(language);

  const lines = ['```' + lang, ...code.split('\n'), '```'];
  return lines.map((line) => indentLine(line, indent)).join('\n');
}
