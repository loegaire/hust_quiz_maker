import { ZodError } from 'zod';
import { db } from './db';
import { normalizeQuiz } from './normalizeQuiz';
import { quizPackSchema } from './quizSchema';
import type { QuizPackFile } from '../types/quiz';

export class QuizImportError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'QuizImportError';
  }
}

function validateQuestionLinks(data: QuizPackFile): void {
  const ids = new Set<string>();

  for (const q of data.quiz.questions) {
    if (ids.has(q.id)) {
      throw new QuizImportError(`Duplicate question ID found: ${q.id}`);
    }
    ids.add(q.id);

    if (q.type === 'single_choice' || q.type === 'multiple_choice') {
      const choiceIds = new Set(q.choices.map((choice) => choice.id));
      for (const answerId of q.answer.correctChoiceIds) {
        if (!choiceIds.has(answerId)) {
          throw new QuizImportError(
            `Question ${q.id}: correctChoiceIds contains "${answerId}", but that choice does not exist.`
          );
        }
      }
    }
  }
}

export function parseQuizJson(raw: string): QuizPackFile {
  let parsed: unknown;
  try {
    parsed = JSON.parse(raw);
  } catch {
    throw new QuizImportError('Invalid JSON syntax.');
  }

  try {
    const validated = quizPackSchema.parse(parsed);
    const normalized = normalizeQuiz(validated as QuizPackFile);
    validateQuestionLinks(normalized);
    return normalized;
  } catch (error) {
    if (error instanceof QuizImportError) {
      throw error;
    }
    if (error instanceof ZodError) {
      const first = error.issues[0];
      const path = first.path.join('.') || 'root';
      throw new QuizImportError(`Validation failed at ${path}: ${first.message}`);
    }
    throw error;
  }
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
