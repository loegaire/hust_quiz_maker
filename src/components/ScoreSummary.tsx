interface ScoreSummaryProps {
  score: number;
  totalQuestions: number;
  correctCount: number;
  incorrectCount: number;
}

export function ScoreSummary({ score, totalQuestions, correctCount, incorrectCount }: ScoreSummaryProps) {
  const percent = totalQuestions > 0 ? Math.round((score / totalQuestions) * 100) : 0;

  return (
    <section className="neo-card">
      <h2 className="font-display text-2xl">Results</h2>
      <p className="mt-1 text-sm text-[var(--muted)]">Score: {score}/{totalQuestions} ({percent}%)</p>
      <div className="mt-3 flex gap-3 text-sm">
        <span className="neo-pill bg-emerald-300">Correct: {correctCount}</span>
        <span className="neo-pill bg-red-300">Incorrect: {incorrectCount}</span>
      </div>
    </section>
  );
}
