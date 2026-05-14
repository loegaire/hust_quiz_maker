import { Link } from 'react-router-dom';

export function HomePage() {
  return (
    <section className="grid gap-4 md:grid-cols-2">
      <div className="rounded-xl bg-[var(--card)] p-6 shadow-sm md:col-span-2">
        <h1 className="font-display text-3xl">Local-First Quiz App</h1>
        <p className="mt-2 text-[var(--muted)]">Import JSON quizzes, study in practice/exam modes, and keep progress in your browser.</p>
      </div>
      <Link to="/library" className="rounded-xl bg-[var(--card)] p-6 shadow-sm hover:shadow">
        <h2 className="font-display text-xl">Open Library</h2>
        <p className="mt-1 text-sm text-[var(--muted)]">Start built-in or imported quizzes.</p>
      </Link>
      <Link to="/import" className="rounded-xl bg-[var(--card)] p-6 shadow-sm hover:shadow">
        <h2 className="font-display text-xl">Import Quiz</h2>
        <p className="mt-1 text-sm text-[var(--muted)]">Paste JSON or upload .json files.</p>
      </Link>
      <Link to="/review" className="rounded-xl bg-[var(--card)] p-6 shadow-sm hover:shadow">
        <h2 className="font-display text-xl">Review Attempts</h2>
        <p className="mt-1 text-sm text-[var(--muted)]">See previous scores and incorrect answers.</p>
      </Link>
      <Link to="/settings" className="rounded-xl bg-[var(--card)] p-6 shadow-sm hover:shadow">
        <h2 className="font-display text-xl">Settings & Backup</h2>
        <p className="mt-1 text-sm text-[var(--muted)]">Shuffle, timed defaults, dark mode, export/import backup.</p>
      </Link>
    </section>
  );
}
