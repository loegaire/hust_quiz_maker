import type { QuizPackFile } from '../types/quiz';

function normalizeMedia(
  items: Array<string | { id?: string; src?: string; ascii?: string; svg?: string; alt?: string }>
) {
  return items.map((item, index) => {
    if (typeof item === 'string') {
      return {
        id: `ascii-${index + 1}`,
        ascii: item
      };
    }

    if (item.src) {
      return {
        id: item.id ?? `img-${index + 1}`,
        src: item.src,
        alt: item.alt
      };
    }

    if (item.svg) {
      return {
        id: item.id ?? `svg-${index + 1}`,
        svg: item.svg,
        alt: item.alt
      };
    }

    return {
      id: item.id ?? `ascii-${index + 1}`,
      ascii: item.ascii ?? '',
      alt: item.alt
    };
  });
}

export function normalizeQuiz(data: QuizPackFile): QuizPackFile {
  const quiz = data.quiz;
  const normalizedQuestions = quiz.questions.map((q) => ({
    ...q,
    question: { ...q.question, images: normalizeMedia(q.question.images ?? []) },
    explanation: { ...q.explanation, images: normalizeMedia(q.explanation.images ?? []) }
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
