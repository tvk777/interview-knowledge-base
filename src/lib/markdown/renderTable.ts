import { renderInline } from './renderInline';

function renderCell(cellNodes: unknown): string {
  return renderInline(cellNodes).replace(/\|/g, '\\|').replace(/\n/g, ' ');
}

function renderRow(cells: string[]): string {
  return `| ${cells.join(' | ')} |`;
}

function normalizeRow(row: unknown, columnCount: number): string[] {
  const cells = Array.isArray(row) ? row.map(renderCell) : [];
  while (cells.length < columnCount) cells.push('');
  cells.length = columnCount;
  return cells;
}

export function renderTable(block: unknown): string {
  if (typeof block !== 'object' || block === null) return '';

  const { header, rows } = block as Record<string, unknown>;
  if (!Array.isArray(header) || header.length === 0) return '';

  const headerCells = header.map(renderCell);
  const separatorCells = headerCells.map(() => '---');
  const dataRows = Array.isArray(rows) ? rows : [];

  const lines = [
    renderRow(headerCells),
    renderRow(separatorCells),
    ...dataRows.map((row) => renderRow(normalizeRow(row, headerCells.length))),
  ];

  return lines.join('\n');
}
