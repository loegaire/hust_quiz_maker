import { db } from './db';

export interface BackupData {
  exportedAt: number;
  quizPacks: unknown[];
  questions: unknown[];
  attempts: unknown[];
  answers: unknown[];
  settings: unknown[];
}

export async function exportAllData(): Promise<BackupData> {
  const [quizPacks, questions, attempts, answers, settings] = await Promise.all([
    db.quizPacks.toArray(),
    db.questions.toArray(),
    db.attempts.toArray(),
    db.answers.toArray(),
    db.settings.toArray()
  ]);

  return {
    exportedAt: Date.now(),
    quizPacks,
    questions,
    attempts,
    answers,
    settings
  };
}

export async function importBackup(data: BackupData): Promise<void> {
  await db.delete();
  await db.open();

  await db.quizPacks.bulkPut(data.quizPacks as never[]);
  await db.questions.bulkPut(data.questions as never[]);
  await db.attempts.bulkPut(data.attempts as never[]);
  await db.answers.bulkPut(data.answers as never[]);
  await db.settings.bulkPut(data.settings as never[]);
}
