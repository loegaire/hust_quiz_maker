import type { AnswerRecord } from '../types/attempt';
import type { QuizQuestion } from '../types/quiz';
import { ContentBlockView } from './ContentBlockView';

interface ReviewScreenProps {
  questions: QuizQuestion[];
  answers: AnswerRecord[];
}

export function ReviewScreen({ questions, answers }: ReviewScreenProps) {
  const answerMap = new Map(answers.map((a) => [a.questionId, a]));

  const getChoiceText = (question: QuizQuestion, choiceIds?: string[]) => {
    if (!choiceIds || question.type === 'fill_gap') {
      return 'No answer';
    }

    const choiceMap = new Map(question.choices.map((choice) => [choice.id, choice.text]));
    return choiceIds.map((choiceId) => `${choiceId}. ${choiceMap.get(choiceId) ?? choiceId}`).join(', ');
  };

  return (
    <section className="space-y-3">
      {questions.map((question) => {
        const answer = answerMap.get(question.id);
        if (!answer) return null;

        return (
          <article key={question.id} className="neo-card">
            <ContentBlockView content={question.question} textClassName="font-semibold" />
            <p className={`mt-1 text-sm ${answer.isCorrect ? 'text-emerald-700' : 'text-red-700'}`}>
              {answer.isCorrect ? 'Correct' : 'Incorrect'}
            </p>
            {!answer.isCorrect && (
              <div className="mt-2 text-sm">
                {question.type === 'fill_gap' ? (
                  <p>Accepted: {question.answer.acceptedAnswers.join(' / ')}</p>
                ) : (
                  <p>Correct: {getChoiceText(question, question.answer.correctChoiceIds)}</p>
                )}
                <p>Your answer: {answer.textAnswer || getChoiceText(question, answer.selectedChoiceIds)}</p>
              </div>
            )}
            <div className="mt-2 text-sm text-[var(--muted)]">
              <span>Explanation:</span>
              <ContentBlockView content={question.explanation} />
            </div>
          </article>
        );
      })}
    </section>
  );
}
