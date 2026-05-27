import type { DraftResponse } from '../types/attempt';

interface QuestionMapProps {
  currentIndex: number;
  total: number;
  responses: Record<string, DraftResponse>;
  questionIds: string[];
  onJump: (index: number) => void;
}

function getStatusClass(isCurrent: boolean, response?: DraftResponse) {
  if (isCurrent) {
    return 'border-[var(--accent)] bg-[var(--accent)] text-white';
  }

  if (!response || !response.answered) {
    return 'border-black/10 bg-white/70 text-[var(--ink)]';
  }

  return response.isCorrect
    ? 'border-emerald-200 bg-emerald-100 text-emerald-800'
    : 'border-red-200 bg-red-100 text-red-800';
}

export function QuestionMap({ currentIndex, total, responses, questionIds, onJump }: QuestionMapProps) {
  return (
    <aside className="rounded-xl bg-[var(--card)] p-4 shadow-sm">
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
            className={`rounded-lg border px-2 py-3 text-sm font-medium transition ${getStatusClass(index === currentIndex, responses[questionId])}`}
          >
            {index + 1}
          </button>
        ))}
      </div>
    </aside>
  );
}
