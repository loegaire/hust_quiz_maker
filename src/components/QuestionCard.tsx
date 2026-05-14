import { ChoiceButton } from './ChoiceButton';
import { FillGapQuestion } from './FillGapQuestion';
import type { QuizQuestion } from '../types/quiz';

interface QuestionCardProps {
  question: QuizQuestion;
  selectedChoiceIds: string[];
  textAnswer: string;
  locked: boolean;
  onSelectChoice: (choiceId: string) => void;
  onTextAnswer: (value: string) => void;
}

export function QuestionCard({ question, selectedChoiceIds, textAnswer, locked, onSelectChoice, onTextAnswer }: QuestionCardProps) {
  return (
    <article className="space-y-4 rounded-xl bg-[var(--card)] p-5 shadow-sm">
      <div>
        <h2 className="text-lg font-semibold">{question.question.text}</h2>
        {question.tags?.length ? <p className="mt-1 text-xs text-[var(--muted)]">Tags: {question.tags.join(', ')}</p> : null}
      </div>

      {(question.type === 'single_choice' || question.type === 'multiple_choice') && (
        <div className="space-y-2">
          {question.choices.map((choice) => (
            <ChoiceButton
              key={choice.id}
              text={`${choice.id}. ${choice.text}`}
              selected={selectedChoiceIds.includes(choice.id)}
              onClick={() => onSelectChoice(choice.id)}
              disabled={locked}
            />
          ))}
        </div>
      )}

      {question.type === 'fill_gap' && <FillGapQuestion value={textAnswer} onChange={onTextAnswer} disabled={locked} />}
    </article>
  );
}
