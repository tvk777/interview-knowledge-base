/**
 * Server-only data access layer.
 *
 * Reads the generated knowledge base directly from the repository root.
 * UI components should access application data only through this module.
 */

import { readFile } from 'node:fs/promises';
import path from 'node:path';

import type { Category } from '@/types/category';
import type { Question } from '@/types/question';
import type { Tag } from '@/types/tag';
import type { Technology } from '@/types/technology';

// The generated knowledge base lives at the repository root (data/), one
// level above this Next.js project, and is the single source of truth.
// Nothing in this project duplicates it.
const REPO_ROOT = path.join(process.cwd(), '..');

const TECHNOLOGIES: Technology[] = [
  { slug: 'react', name: 'React' },
  { slug: 'javascript', name: 'JavaScript' },
  { slug: 'typescript', name: 'TypeScript' },
  { slug: 'nextjs', name: 'Next.js' },
];

function assertKnownTechnology(technology: string): void {
  const isKnown = TECHNOLOGIES.some((entry) => entry.slug === technology);
  if (!isKnown) {
    const known = TECHNOLOGIES.map((entry) => entry.slug).join(', ');
    throw new Error(`Unknown technology: "${technology}". Expected one of: ${known}.`);
  }
}

async function readJsonFile<T>(relativePath: string): Promise<T> {
  const filePath = path.join(REPO_ROOT, relativePath);

  let contents: string;
  try {
    contents = await readFile(filePath, 'utf-8');
  } catch (error) {
    throw new Error(`Failed to read data file: ${filePath}`, { cause: error });
  }

  return JSON.parse(contents) as T;
}

export async function getTechnologies(): Promise<Technology[]> {
  return [...TECHNOLOGIES];
}

export async function getQuestions(technology: string): Promise<Question[]> {
  assertKnownTechnology(technology);
  return readJsonFile<Question[]>(path.join('data', 'enriched', `${technology}.json`));
}

export async function getCategories(technology: string): Promise<Category[]> {
  assertKnownTechnology(technology);
  return readJsonFile<Category[]>(path.join('data', 'categories', `${technology}.json`));
}

export async function getTags(technology: string): Promise<Tag[]> {
  assertKnownTechnology(technology);
  return readJsonFile<Tag[]>(path.join('data', 'tags', `${technology}.json`));
}
