import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { checkAnswer } from '../lib/answerCheck';
import { db } from '../lib/db';
import { scoreAnswer } from '../lib/scoring';
import { shuffleArray } from '../lib/shuffle';
import { QuestionCard } from './QuestionCard';
import { RichText } from './RichText';
import { Timer } from './Timer';
import type { AnswerRecord, Attempt } from '../types/attempt';
import type { QuestionRow, QuizPackRow } from '../lib/db';

interface QuizPlayerProps {
  quiz: QuizPackRow;
  questions: QuestionRow[];
  defaultTimedMode: boolean;
  defaultShuffleQuestions: boolean;
  defaultShuffleChoices: boolean;
  defaultShowExplanationAfterAnswer: boolean;
}

export function QuizPlayer({
  quiz,
  questions,
  defaultTimedMode,
  defaultShuffleQuestions,
  defaultShuffleChoices,
  defaultShowExplanationAfterAnswer
}: QuizPlayerProps) {
  const navigate = useNavigate();
  const [mode, setMode] = useState<'practice' | 'exam'>('practice');
  const [timed, setTimed] = useState(defaultTimedMode);
  const [timeLimitMin, setTimeLimitMin] = useState(10);
  const [started, setStarted] = useState(false);
  const [remainingMs, setRemainingMs] = useState<number | undefined>();

  const ordered = useMemo(() => {
    const base = defaultShuffleQuestions ? shuffleArray(questions) : [...questions];
    return base.map((q) => {
      if ((q.type === 'single_choice' || q.type === 'multiple_choice') && defaultShuffleChoices) {
        return { ...q, choices: shuffleArray(q.choices) };
      }
      return q;
    });
  }, [questions, defaultShuffleQuestions, defaultShuffleChoices]);

  const [index, setIndex] = useState(0);
  const [selected, setSelected] = useState<string[]>([]);
  const [textAnswer, setTextAnswer] = useState('');
  const [locked, setLocked] = useState(false);
  const [feedback, setFeedback] = useState<{ correct: boolean; explanation: string } | null>(null);
  const [answers, setAnswers] = useState<AnswerRecord[]>([]);
  const [startedAt, setStartedAt] = useState<number>(Date.now());

  useEffect(() => {
    if (!started || !timed) return;
    setRemainingMs(timeLimitMin * 60 * 1000);
    const timer = window.setInterval(() => {
      setRemainingMs((prev) => {
        if (prev === undefined) return prev;
        if (prev <= 1000) {
          window.clearInterval(timer);
          void finishQuiz();
          return 0;
        }
        return prev - 1000;
      });
    }, 1000);
    return () => window.clearInterval(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [started, timed]);

  const current = ordered[index];

  const onSelectChoice = (choiceId: string) => {
    if (locked) return;
    if (current.type === 'single_choice') {
      setSelected([choiceId]);
      return;
    }
    setSelected((prev) => (prev.includes(choiceId) ? prev.filter((id) => id !== choiceId) : [...prev, choiceId]));
  };

  const submit = () => {
    const correct = checkAnswer(current, {
      selectedChoiceIds: selected,
      textAnswer
    });

    const answer: AnswerRecord = {
      id: crypto.randomUUID(),
      attemptId: '',
      questionId: current.id,
      questionType: current.type,
      selectedChoiceIds: selected,
      textAnswer,
      isCorrect: correct,
      timeSpentMs: 0
    };

    setAnswers((prev) => [...prev, answer]);
    setLocked(true);

    if (mode === 'practice' || defaultShowExplanationAfterAnswer) {
      setFeedback({ correct, explanation: current.explanation.text });
    }
  };

  const next = () => {
    if (index + 1 >= ordered.length) {
      void finishQuiz();
      return;
    }

    setIndex((v) => v + 1);
    setSelected([]);
    setTextAnswer('');
    setLocked(false);
    setFeedback(null);
  };

  const finishQuiz = async () => {
    const endedAt = Date.now();
    const score = answers.reduce((acc, a) => acc + scoreAnswer(a.isCorrect), 0);
    const correctCount = answers.filter((a) => a.isCorrect).length;

    const attemptId = crypto.randomUUID();
    const attempt: Attempt = {
      id: attemptId,
      quizId: quiz.id,
      startedAt,
      finishedAt: endedAt,
      mode,
      score,
      totalQuestions: ordered.length,
      correctCount,
      incorrectCount: ordered.length - correctCount,
      timeSpentMs: endedAt - startedAt
    };

    const answerRows = answers.map((a) => ({ ...a, attemptId }));

    await db.transaction('rw', db.attempts, db.answers, async () => {
      await db.attempts.put(attempt);
      await db.answers.bulkPut(answerRows);
    });

    navigate(`/review?attemptId=${attemptId}`);
  };

  if (!started) {
    return (
      <section className="space-y-4 rounded-xl bg-[var(--card)] p-5 shadow-sm">
        <h1 className="font-display text-2xl">{quiz.title}</h1>
        <p>{quiz.description}</p>
        <div className="grid gap-3 md:grid-cols-2">
          <label className="flex items-center gap-2">
            Mode
            <select value={mode} onChange={(e) => setMode(e.target.value as 'practice' | 'exam')} className="rounded border px-2 py-1">
              <option value="practice">Practice</option>
              <option value="exam">Exam</option>
            </select>
          </label>
          <label className="flex items-center gap-2">
            <input type="checkbox" checked={timed} onChange={(e) => setTimed(e.target.checked)} /> Timed mode
          </label>
          {timed && (
            <label className="flex items-center gap-2">
              Time limit (min)
              <input
                type="number"
                min={1}
                max={300}
                value={timeLimitMin}
                onChange={(e) => setTimeLimitMin(Number(e.target.value) || 1)}
                className="w-20 rounded border px-2 py-1"
              />
            </label>
          )}
        </div>
        <button
          type="button"
          onClick={() => {
            setStartedAt(Date.now());
            setStarted(true);
          }}
          className="rounded bg-[var(--accent)] px-4 py-2 text-white"
        >
          Start Quiz
        </button>
      </section>
    );
  }

  return (
    <section className="space-y-4">
      <div className="flex items-center justify-between rounded-xl bg-[var(--card)] p-4 shadow-sm">
        <p className="font-medium">Question {index + 1} / {ordered.length}</p>
        <Timer remainingMs={remainingMs} />
      </div>

      <QuestionCard
        question={current}
        selectedChoiceIds={selected}
        textAnswer={textAnswer}
        locked={locked}
        onSelectChoice={onSelectChoice}
        onTextAnswer={setTextAnswer}
      />

      {feedback ? (
        <div className={`rounded-xl p-4 text-sm ${feedback.correct ? 'bg-emerald-100 text-emerald-800' : 'bg-red-100 text-red-800'}`}>
          <p className="font-semibold">{feedback.correct ? 'Correct' : 'Incorrect'}</p>
          <RichText content={feedback.explanation} className="mt-1" />
        </div>
      ) : null}

      <div className="flex gap-2">
        <button type="button" onClick={submit} disabled={locked} className="rounded bg-black px-4 py-2 text-white disabled:opacity-40">
          Submit
        </button>
        <button type="button" onClick={next} disabled={!locked} className="rounded bg-[var(--accent)] px-4 py-2 text-white disabled:opacity-40">
          {index + 1 >= ordered.length ? 'Finish' : 'Next'}
        </button>
      </div>
    </section>
  );
}
