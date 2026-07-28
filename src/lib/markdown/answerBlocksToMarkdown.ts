import { renderBlock } from './renderBlock';

export interface InlineNode {
  text?: string;
  bold?: boolean;
  code?: boolean;
  boldItalic?: boolean;
}

export interface HeadingBlock {
  type: 'heading';
  level?: number;
  children?: InlineNode[];
}

export interface ParagraphBlock {
  type: 'paragraph';
  children?: InlineNode[];
}

export interface ListItem {
  type: 'listItem';
  children?: Array<InlineNode | ListBlock | CodeBlock>;
}

export interface ListBlock {
  type: 'bulletList' | 'numberedList';
  children?: ListItem[];
}

export interface CodeBlock {
  type: 'code';
  content?: string;
  language?: string;
}

export interface TableBlock {
  type: 'table';
  header?: InlineNode[][];
  rows?: InlineNode[][][];
}

export type AnswerBlock = HeadingBlock | ParagraphBlock | ListBlock | CodeBlock | TableBlock;

export function answerBlocksToMarkdown(blocks: AnswerBlock[]): string {
  if (!Array.isArray(blocks)) return '';

  const rendered = blocks.map((block) => renderBlock(block)).filter((text) => text !== '');

  return rendered.join('\n\n').trim();
}
