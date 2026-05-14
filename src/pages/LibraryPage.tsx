import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { db, type QuizPackRow } from '../lib/db';

export function LibraryPage() {
  const [quizzes, setQuizzes] = useState<QuizPackRow[]>([]);

  useEffect(() => {
    void db.quizPacks.orderBy('updatedAt').reverse().toArray().then(setQuizzes);
  }, []);

  const deleteQuiz = async (quizId: string) => {
    await db.transaction('rw', db.quizPacks, db.questions, async () => {
      await db.quizPacks.delete(quizId);
      await db.questions.where('quizId').equals(quizId).delete();
    });
    setQuizzes((prev) => prev.filter((q) => q.id !== quizId));
  };

  return (
    <section className="space-y-4">
      <h1 className="font-display text-3xl">Quiz Library</h1>
      <div className="grid gap-3">
        {quizzes.map((quiz) => (
          <article key={quiz.id} className="rounded-xl bg-[var(--card)] p-4 shadow-sm">
            <div className="flex items-start justify-between gap-3">
              <div>
                <h2 className="font-semibold">{quiz.title}</h2>
                <p className="text-sm text-[var(--muted)]">{quiz.description}</p>
                <p className="mt-1 text-xs text-[var(--muted)]">{quiz.questionCount} questions · {quiz.sourceType.replace('_', ' ')}</p>
              </div>
              <div className="flex gap-2">
                <Link to={`/quiz/${quiz.id}`} className="rounded bg-[var(--accent)] px-3 py-1 text-sm text-white">
                  Start
                </Link>
                {quiz.sourceType === 'imported' && (
                  <button type="button" onClick={() => void deleteQuiz(quiz.id)} className="rounded bg-red-600 px-3 py-1 text-sm text-white">
                    Delete
                  </button>
                )}
              </div>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
