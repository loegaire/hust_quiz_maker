import Dexie, { type Table } from 'dexie';
import type { AnswerRecord, AppSetting, Attempt } from '../types/attempt';
import type { QuizQuestion, StoredQuizPack } from '../types/quiz';

export interface QuizPackRow extends StoredQuizPack {
  settings?: {
    shuffleQuestions?: boolean;
    shuffleChoices?: boolean;
    showExplanationAfterAnswer?: boolean;
  };
}

export type QuestionRow = QuizQuestion & {
  quizId: string;
};

class QuizDB extends Dexie {
  quizPacks!: Table<QuizPackRow, string>;
  questions!: Table<QuestionRow, string>;
  attempts!: Table<Attempt, string>;
  answers!: Table<AnswerRecord, string>;
  settings!: Table<AppSetting, string>;

  constructor() {
    super('hustQuizDb');
    this.version(1).stores({
      quizPacks: 'id, sourceType, updatedAt',
      questions: 'id, quizId, type',
      attempts: 'id, quizId, startedAt',
      answers: 'id, attemptId, questionId',
      settings: 'key'
    });
  }
}

export const db = new QuizDB();
