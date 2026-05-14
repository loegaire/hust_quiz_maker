import type { QuizQuestion } from '../types/quiz';

export function checkAnswer(question: QuizQuestion, payload: { selectedChoiceIds?: string[]; textAnswer?: string }): boolean {
  if (question.type === 'fill_gap') {
    const trimWhitespace = question.answer.trimWhitespace ?? true;
    const caseSensitive = question.answer.caseSensitive ?? false;

    const normalize = (v: string) => {
      const t = trimWhitespace ? v.trim() : v;
      return caseSensitive ? t : t.toLowerCase();
    };

    const user = normalize(payload.textAnswer ?? '');
    return question.answer.acceptedAnswers.map(normalize).includes(user);
  }

  const expected = [...question.answer.correctChoiceIds].sort();
  const selected = [...(payload.selectedChoiceIds ?? [])].sort();
  return expected.length === selected.length && expected.every((id, idx) => id === selected[idx]);
}
