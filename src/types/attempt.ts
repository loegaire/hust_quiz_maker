import type { QuestionType } from './quiz';

export interface Attempt {
  id: string;
  quizId: string;
  startedAt: number;
  finishedAt?: number;
  mode: 'practice' | 'exam';
  score: number;
  totalQuestions: number;
  correctCount: number;
  incorrectCount: number;
  timeSpentMs: number;
}

export interface AnswerRecord {
  id: string;
  attemptId: string;
  questionId: string;
  questionType: QuestionType;
  selectedChoiceIds?: string[];
  textAnswer?: string;
  isCorrect: boolean;
  timeSpentMs: number;
}

export interface DraftResponse {
  questionId: string;
  selectedChoiceIds?: string[];
  textAnswer?: string;
  isCorrect: boolean;
  answered: boolean;
}

export interface DraftSession {
  id: string;
  quizId: string;
  startedAt: number;
  updatedAt: number;
  mode: 'practice' | 'exam';
  timed: boolean;
  timeLimitMs?: number;
  deadlineAt?: number;
  questionOrder: string[];
  choiceOrderByQuestion: Record<string, string[]>;
  currentIndex: number;
  responses: Record<string, DraftResponse>;
}

export interface AppSetting<T = unknown> {
  key: string;
  value: T;
}
