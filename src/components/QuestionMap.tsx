import type { DraftResponse } from '../types/attempt';

interface QuestionMapProps {
  currentIndex: number;
  total: number;
  responses: Record<string, DraftResponse>;
  questionIds: string[];
  revealCorrectness: boolean;
  onJump: (index: number) => void;
}

function getStatusClass(isCurrent: boolean, revealCorrectness: boolean, response?: DraftResponse) {
  if (isCurrent) {
    return 'border-black bg-[var(--accent)] text-black shadow-[3px_3px_0_var(--shadow)]';
  }

  if (!response || !response.answered) {
    return 'border-black bg-white text-[var(--ink)]';
  }

  if (!revealCorrectness) {
    return 'border-black bg-[var(--accent-blue)] text-black';
  }

  return response.isCorrect
    ? 'border-black bg-emerald-300 text-black'
    : 'border-black bg-red-300 text-black';
}

export function QuestionMap({ currentIndex, total, responses, questionIds, revealCorrectness, onJump }: QuestionMapProps) {
  return (
    <aside className="neo-card">
      <div className="mb-3 flex items-center justify-between">
        <h2 className="font-display text-lg">Question Map</h2>
        <p className="text-xs text-[var(--muted)]">{total} total</p>
      </div>
      <div className="grid grid-cols-5 gap-2 sm:grid-cols-6 md:grid-cols-4 lg:grid-cols-5">
        {questionIds.map((questionId, index) => (
          <button
            key={questionId}
            type="button"
            onClick={() => onJump(index)}
            className={`border-4 px-2 py-3 text-sm font-bold transition ${getStatusClass(index === currentIndex, revealCorrectness, responses[questionId])}`}
          >
            {index + 1}
          </button>
        ))}
      </div>
    </aside>
  );
}
