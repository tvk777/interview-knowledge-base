import fs from 'node:fs';
import path from 'node:path';
import { answerBlocksToMarkdown, type AnswerBlock } from '../src/lib/markdown/index.js';

const TECHNOLOGIES = ['react', 'javascript', 'nextjs', 'typescript'] as const;
type Technology = (typeof TECHNOLOGIES)[number];

// data/original uses "next.json" for the nextjs technology; every other
// technology's source file matches its slug exactly.
const SOURCE_FILE_OVERRIDES: Partial<Record<Technology, string>> = {
  nextjs: 'next.json',
};

type Locale = 'en' | 'uk';

interface SourceQuestion {
  id: string;
  difficulty: string;
  question: string;
  answerBlocks: AnswerBlock[];
}

interface MergedQuestion {
  id: string;
  difficulty: string;
  en: SourceQuestion;
  uk: SourceQuestion;
}

interface GeneratedQuestion {
  id: string;
  difficulty: string;
  question: { en: string; uk: string };
  answer: { en: string; uk: string };
  categoryId: null;
  tags: string[];
}

function isTechnology(value: string): value is Technology {
  return (TECHNOLOGIES as readonly string[]).includes(value);
}

function sourceFileName(technology: Technology): string {
  return SOURCE_FILE_OVERRIDES[technology] ?? `${technology}.json`;
}

function printUsage(): void {
  console.error('Usage: npm run build-data <technology>');
  console.error(`Supported technologies: ${TECHNOLOGIES.join(', ')}`);
}

function readSourceQuestions(filePath: string): SourceQuestion[] {
  if (!fs.existsSync(filePath)) {
    throw new Error(`Source file not found: ${filePath}`);
  }

  const raw = fs.readFileSync(filePath, 'utf-8');

  let parsed: unknown;
  try {
    parsed = JSON.parse(raw);
  } catch (error) {
    throw new Error(`Invalid JSON in ${filePath}: ${(error as Error).message}`);
  }

  if (!Array.isArray(parsed)) {
    throw new Error(`Expected an array of questions in ${filePath}`);
  }

  return parsed as SourceQuestion[];
}

function validateQuestions(questions: SourceQuestion[], locale: Locale): void {
  const seenIds = new Set<string>();

  for (const question of questions) {
    if (!question.id) {
      throw new Error(`Question is missing an id (${locale} dataset)`);
    }
    if (seenIds.has(question.id)) {
      throw new Error(`Duplicate question id:\n\n${question.id}`);
    }
    seenIds.add(question.id);
  }
}

function buildQuestionMap(questions: SourceQuestion[]): Map<string, SourceQuestion> {
  return new Map(questions.map((question) => [question.id, question]));
}

function validateTranslationCoverage(
  enQuestions: SourceQuestion[],
  ukQuestions: SourceQuestion[],
  enMap: Map<string, SourceQuestion>,
  ukMap: Map<string, SourceQuestion>,
): void {
  if (enQuestions.length !== ukQuestions.length) {
    throw new Error(
      `Dataset size mismatch: en has ${enQuestions.length} questions, uk has ${ukQuestions.length} questions`,
    );
  }

  for (const question of enQuestions) {
    if (!ukMap.has(question.id)) {
      throw new Error(`Missing Ukrainian translation for question:\n\nid: ${question.id}`);
    }
  }

  for (const question of ukQuestions) {
    if (!enMap.has(question.id)) {
      throw new Error(`Missing English translation for question:\n\nid: ${question.id}`);
    }
  }
}

function mergeQuestions(enQuestions: SourceQuestion[], ukMap: Map<string, SourceQuestion>): MergedQuestion[] {
  return enQuestions.map((en) => {
    // Presence is guaranteed by validateTranslationCoverage having run first.
    const uk = ukMap.get(en.id) as SourceQuestion;
    return { id: en.id, difficulty: en.difficulty, en, uk };
  });
}

function normalizeQuestion(question: string): string {
  return question.replace(/^\d+\.\s*/, '');
}

function transformQuestion(merged: MergedQuestion): GeneratedQuestion {
  return {
    id: merged.id,
    difficulty: merged.difficulty,
    question: {
      en: normalizeQuestion(merged.en.question),
      uk: normalizeQuestion(merged.uk.question),
    },
    answer: {
      en: answerBlocksToMarkdown(merged.en.answerBlocks),
      uk: answerBlocksToMarkdown(merged.uk.answerBlocks),
    },
    categoryId: null,
    tags: [],
  };
}

function writeGeneratedFile(filePath: string, questions: GeneratedQuestion[]): void {
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
  fs.writeFileSync(filePath, JSON.stringify(questions, null, 2), 'utf-8');
}

function main(): void {
  const technologyArg = process.argv[2];

  if (!technologyArg) {
    printUsage();
    process.exit(1);
  }

  if (!isTechnology(technologyArg)) {
    console.error(`Unknown technology: "${technologyArg}"`);
    printUsage();
    process.exit(1);
  }

  const fileName = sourceFileName(technologyArg);
  const enPath = path.resolve('data', 'original', 'en', fileName);
  const ukPath = path.resolve('data', 'original', 'uk', fileName);
  const outputPath = path.resolve('data', 'generated', `${technologyArg}.json`);

  try {
    const enQuestions = readSourceQuestions(enPath);
    const ukQuestions = readSourceQuestions(ukPath);

    validateQuestions(enQuestions, 'en');
    validateQuestions(ukQuestions, 'uk');

    const enMap = buildQuestionMap(enQuestions);
    const ukMap = buildQuestionMap(ukQuestions);
    validateTranslationCoverage(enQuestions, ukQuestions, enMap, ukMap);

    const merged = mergeQuestions(enQuestions, ukMap);
    const generatedQuestions = merged.map(transformQuestion);

    writeGeneratedFile(outputPath, generatedQuestions);
    console.log(`Generated ${generatedQuestions.length} questions -> ${outputPath}`);
  } catch (error) {
    console.error(`Failed to build data for "${technologyArg}": ${(error as Error).message}`);
    process.exit(1);
  }
}

main();
