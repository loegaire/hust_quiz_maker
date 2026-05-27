import { type ZodIssue } from 'zod';
import { db } from './db';
import { normalizeQuiz } from './normalizeQuiz';
import { quizPackSchema } from './quizSchema';
import type { QuizPackFile } from '../types/quiz';

export class QuizImportError extends Error {
  issues: string[];

  constructor(message: string, issues: string[] = []) {
    super(message);
    this.name = 'QuizImportError';
    this.issues = issues;
  }
}

function formatPathSegment(segment: string | number) {
  return typeof segment === 'number' ? `[${segment}]` : segment;
}

function getQuestionLabel(rawData: unknown, questionIndex: number) {
  if (!rawData || typeof rawData !== 'object') {
    return null;
  }

  const quiz = 'quiz' in rawData ? rawData.quiz : undefined;
  if (!quiz || typeof quiz !== 'object' || !('questions' in quiz) || !Array.isArray(quiz.questions)) {
    return null;
  }

  const question = quiz.questions[questionIndex];
  if (!question || typeof question !== 'object' || !('id' in question) || typeof question.id !== 'string' || question.id.trim() === '') {
    return null;
  }

  return question.id;
}

function formatIssuePath(path: (string | number)[], rawData: unknown) {
  if (path.length === 0) {
    return 'root';
  }

  const parts = path.map((segment, index) => {
    if (typeof segment === 'number') {
      const previous = path[index - 1];
      if (previous === 'questions') {
        const questionId = getQuestionLabel(rawData, segment);
        return questionId ? `questions[${segment}] (${questionId})` : `questions[${segment}]`;
      }

      return formatPathSegment(segment);
    }

    return segment;
  });

  return parts
    .map((part, index) => {
      if (part.startsWith('[')) {
        return part;
      }

      const next = parts[index + 1];
      return typeof next === 'string' && !next.startsWith('[') && index > 0 ? `.${part}` : index === 0 ? part : `.${part}`;
    })
    .join('');
}

function formatIssueMessage(issue: ZodIssue, rawData: unknown) {
  const path = formatIssuePath(issue.path, rawData);

  switch (issue.code) {
    case 'invalid_type':
      if (issue.received === 'undefined') {
        return `${path}: missing required field. Expected ${issue.expected}.`;
      }
      return `${path}: expected ${issue.expected}, received ${issue.received}.`;
    case 'invalid_literal':
      return `${path}: expected literal value ${JSON.stringify(issue.expected)}.`;
    case 'invalid_enum_value':
      return `${path}: expected one of ${issue.options.map((option) => JSON.stringify(option)).join(', ')}, received ${JSON.stringify(issue.received)}.`;
    case 'too_small':
      if (issue.type === 'array') {
        return `${path}: must contain at least ${issue.minimum} item${issue.minimum === 1 ? '' : 's'}.`;
      }
      if (issue.type === 'string') {
        return `${path}: must not be empty.`;
      }
      return `${path}: value is too small.`;
    case 'too_big':
      return `${path}: value is too large.`;
    case 'invalid_union':
    case 'invalid_union_discriminator':
      return `${path}: ${issue.message}.`;
    case 'custom':
      return `${path}: ${issue.message}.`;
    default:
      return `${path}: ${issue.message}.`;
  }
}

function formatJsonSyntaxError(error: unknown) {
  if (!(error instanceof SyntaxError)) {
    return 'Invalid JSON syntax.';
  }

  const message = error.message.replace(/\s+at position \d+$/, '');
  const positionMatch = error.message.match(/position (\d+)/);

  if (!positionMatch) {
    return `Invalid JSON syntax. ${message}`;
  }

  return `Invalid JSON syntax near character ${positionMatch[1]}. ${message}`;
}

function validateQuestionLinks(data: QuizPackFile): string[] {
  const ids = new Set<string>();
  const issues: string[] = [];

  data.quiz.questions.forEach((q, questionIndex) => {
    if (ids.has(q.id)) {
      issues.push(`quiz.questions[${questionIndex}] (${q.id}): duplicate question ID. Each question.id must be unique.`);
    }
    ids.add(q.id);

    if (q.type === 'single_choice' || q.type === 'multiple_choice') {
      const choiceIds = new Set(q.choices.map((choice) => choice.id));
      q.answer.correctChoiceIds.forEach((answerId, answerIndex) => {
        if (!choiceIds.has(answerId)) {
          issues.push(
            `quiz.questions[${questionIndex}] (${q.id}).answer.correctChoiceIds[${answerIndex}]: references "${answerId}", but no choice with that id exists.`
          );
        }
      });

      const duplicateChoiceIds = q.choices
        .map((choice) => choice.id)
        .filter((choiceId, index, list) => list.indexOf(choiceId) !== index);

      for (const duplicateChoiceId of new Set(duplicateChoiceIds)) {
        issues.push(`quiz.questions[${questionIndex}] (${q.id}).choices: duplicate choice id "${duplicateChoiceId}".`);
      }
    }
  });

  return issues;
}

export function parseQuizJson(raw: string): QuizPackFile {
  let parsed: unknown;
  try {
    parsed = JSON.parse(raw);
  } catch (error) {
    throw new QuizImportError(formatJsonSyntaxError(error));
  }

  const result = quizPackSchema.safeParse(parsed);
  if (!result.success) {
    const issues = result.error.issues.map((issue) => formatIssueMessage(issue, parsed));
    const summary = `Validation failed with ${issues.length} issue${issues.length === 1 ? '' : 's'}:\n- ${issues.join('\n- ')}`;
    throw new QuizImportError(summary, issues);
  }

  const normalized = normalizeQuiz(result.data as QuizPackFile);
  const issues = validateQuestionLinks(normalized);

  if (issues.length > 0) {
    const summary = `Validation failed with ${issues.length} issue${issues.length === 1 ? '' : 's'}:\n- ${issues.join('\n- ')}`;
    throw new QuizImportError(summary, issues);
  }

  return normalized;
}

export async function saveImportedQuiz(data: QuizPackFile): Promise<void> {
  const now = Date.now();

  await db.transaction('rw', db.quizPacks, db.questions, async () => {
    await db.quizPacks.put({
      id: data.quiz.id,
      title: data.quiz.title,
      description: data.quiz.description,
      language: data.quiz.language,
      sourceType: 'imported',
      createdAt: now,
      updatedAt: now,
      questionCount: data.quiz.questions.length,
      settings: data.quiz.settings
    });

    await db.questions.where('quizId').equals(data.quiz.id).delete();

    await db.questions.bulkPut(
      data.quiz.questions.map((question) => ({
        ...question,
        quizId: data.quiz.id
      }))
    );
  });
}
