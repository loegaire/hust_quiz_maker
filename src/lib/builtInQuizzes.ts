import { db } from './db';
import { normalizeQuiz } from './normalizeQuiz';
import type { QuizPackFile } from '../types/quiz';

const BUILT_IN_FILES = ['quizzes/sample-networking.json', 'quizzes/sample-database.json'];

export async function loadBuiltInQuizzes(): Promise<void> {
  const existing = await db.quizPacks.where('sourceType').equals('built_in').count();
  if (existing > 0) {
    return;
  }

  const now = Date.now();

  for (const path of BUILT_IN_FILES) {
    const res = await fetch(`${import.meta.env.BASE_URL}${path}`);
    if (!res.ok) continue;

    const data = normalizeQuiz((await res.json()) as QuizPackFile);

    await db.transaction('rw', db.quizPacks, db.questions, async () => {
      await db.quizPacks.put({
        id: data.quiz.id,
        title: data.quiz.title,
        description: data.quiz.description,
        language: data.quiz.language,
        sourceType: 'built_in',
        createdAt: now,
        updatedAt: now,
        questionCount: data.quiz.questions.length,
        settings: data.quiz.settings
      });

      await db.questions.bulkPut(
        data.quiz.questions.map((q) => ({
          ...q,
          quizId: data.quiz.id
        }))
      );
    });
  }
}
