import type { QuizPackFile } from '../types/quiz';

export function normalizeQuiz(data: QuizPackFile): QuizPackFile {
  const quiz = data.quiz;
  const normalizedQuestions = quiz.questions.map((q) => ({
    ...q,
    question: { ...q.question, images: q.question.images ?? [] },
    explanation: { ...q.explanation, images: q.explanation.images ?? [] }
  }));

  return {
    schemaVersion: 1,
    quiz: {
      ...quiz,
      settings: {
        shuffleQuestions: quiz.settings?.shuffleQuestions ?? true,
        shuffleChoices: quiz.settings?.shuffleChoices ?? true,
        showExplanationAfterAnswer: quiz.settings?.showExplanationAfterAnswer ?? true
      },
      questions: normalizedQuestions
    }
  };
}
