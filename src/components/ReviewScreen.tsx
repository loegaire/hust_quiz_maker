import type { AnswerRecord } from '../types/attempt';
import type { QuizQuestion } from '../types/quiz';
import { RichText } from './RichText';

interface ReviewScreenProps {
  questions: QuizQuestion[];
  answers: AnswerRecord[];
}

export function ReviewScreen({ questions, answers }: ReviewScreenProps) {
  const answerMap = new Map(answers.map((a) => [a.questionId, a]));

  return (
    <section className="space-y-3">
      {questions.map((question) => {
        const answer = answerMap.get(question.id);
        if (!answer) return null;

        return (
          <article key={question.id} className="rounded-xl bg-[var(--card)] p-4 shadow-sm">
            <RichText content={question.question.text} className="font-semibold" />
            <p className={`mt-1 text-sm ${answer.isCorrect ? 'text-emerald-700' : 'text-red-700'}`}>
              {answer.isCorrect ? 'Correct' : 'Incorrect'}
            </p>
            {!answer.isCorrect && (
              <div className="mt-2 text-sm">
                {question.type === 'fill_gap' ? (
                  <p>Accepted: {question.answer.acceptedAnswers.join(' / ')}</p>
                ) : (
                  <p>Correct: {question.answer.correctChoiceIds.join(', ')}</p>
                )}
                <p>Your answer: {answer.textAnswer || answer.selectedChoiceIds?.join(', ') || 'No answer'}</p>
              </div>
            )}
            <div className="mt-2 text-sm text-[var(--muted)]">
              <span>Explanation:</span>
              <RichText content={question.explanation.text} />
            </div>
          </article>
        );
      })}
    </section>
  );
}
