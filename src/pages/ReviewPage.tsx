import { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { ReviewScreen } from '../components/ReviewScreen';
import { ScoreSummary } from '../components/ScoreSummary';
import { db, type QuestionRow } from '../lib/db';
import type { AnswerRecord, Attempt } from '../types/attempt';

export function ReviewPage() {
  const [searchParams] = useSearchParams();
  const attemptId = searchParams.get('attemptId');

  const [attempts, setAttempts] = useState<Attempt[]>([]);
  const [attempt, setAttempt] = useState<Attempt | null>(null);
  const [answers, setAnswers] = useState<AnswerRecord[]>([]);
  const [questions, setQuestions] = useState<QuestionRow[]>([]);

  useEffect(() => {
    void db.attempts.orderBy('startedAt').reverse().toArray().then(setAttempts);
  }, [attemptId]);

  useEffect(() => {
    if (!attemptId) return;

    void db.attempts.get(attemptId).then((row) => {
      if (!row) return;
      setAttempt(row);
      void Promise.all([
        db.answers.where('attemptId').equals(row.id).toArray(),
        db.questions.where('quizId').equals(row.quizId).toArray()
      ]).then(([answerRows, questionRows]) => {
        setAnswers(answerRows);
        setQuestions(questionRows);
      });
    });
  }, [attemptId]);

  if (!attemptId) {
    return (
      <section className="space-y-3">
        <h1 className="font-display text-3xl">Attempts</h1>
        {attempts.map((a) => (
          <Link key={a.id} to={`/review?attemptId=${a.id}`} className="block rounded-xl bg-[var(--card)] p-4 shadow-sm hover:shadow">
            <p className="font-semibold">Quiz ID: {a.quizId}</p>
            <p className="text-sm text-[var(--muted)]">{new Date(a.startedAt).toLocaleString()} · Score {a.score}/{a.totalQuestions}</p>
          </Link>
        ))}
      </section>
    );
  }

  if (!attempt) return <p>Loading review...</p>;

  return (
    <section className="space-y-4">
      <ScoreSummary
        score={attempt.score}
        totalQuestions={attempt.totalQuestions}
        correctCount={attempt.correctCount}
        incorrectCount={attempt.incorrectCount}
      />
      <ReviewScreen questions={questions} answers={answers} />
    </section>
  );
}
