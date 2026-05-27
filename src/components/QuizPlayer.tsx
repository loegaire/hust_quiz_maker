import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { checkAnswer } from '../lib/answerCheck';
import { db } from '../lib/db';
import { scoreAnswer } from '../lib/scoring';
import { shuffleArray } from '../lib/shuffle';
import { ContentBlockView } from './ContentBlockView';
import { QuestionCard } from './QuestionCard';
import { QuestionMap } from './QuestionMap';
import { Timer } from './Timer';
import type { QuestionRow, QuizPackRow } from '../lib/db';
import type { AnswerRecord, Attempt, DraftResponse, DraftSession } from '../types/attempt';
import type { QuizQuestion } from '../types/quiz';

interface QuizPlayerProps {
  quiz: QuizPackRow;
  questions: QuestionRow[];
  defaultTimedMode: boolean;
  defaultShuffleQuestions: boolean;
  defaultShuffleChoices: boolean;
  defaultShowExplanationAfterAnswer: boolean;
}

function hasAnswer(response: DraftResponse | undefined) {
  if (!response) {
    return false;
  }

  return response.answered;
}

function orderChoiceIds(question: QuestionRow, defaultShuffleChoices: boolean) {
  if (question.type === 'fill_gap') {
    return [];
  }

  const choiceIds = question.choices.map((choice) => choice.id);
  return defaultShuffleChoices ? shuffleArray(choiceIds) : choiceIds;
}

function createDraftSession(
  quizId: string,
  questions: QuestionRow[],
  mode: 'practice' | 'exam',
  timed: boolean,
  timeLimitMin: number,
  shuffleQuestions: boolean,
  shuffleChoices: boolean
): DraftSession {
  const orderedQuestions = shuffleQuestions ? shuffleArray(questions) : [...questions];

  return {
    id: crypto.randomUUID(),
    quizId,
    startedAt: Date.now(),
    updatedAt: Date.now(),
    mode,
    timed,
    timeLimitMs: timed ? timeLimitMin * 60 * 1000 : undefined,
    deadlineAt: timed ? Date.now() + timeLimitMin * 60 * 1000 : undefined,
    questionOrder: orderedQuestions.map((question) => question.id),
    choiceOrderByQuestion: Object.fromEntries(
      orderedQuestions.map((question) => [question.id, orderChoiceIds(question, shuffleChoices)])
    ),
    currentIndex: 0,
    responses: {}
  };
}

function hydrateQuestions(session: DraftSession, questions: QuestionRow[]) {
  const byId = new Map(questions.map((question) => [question.id, question]));
  const orderedIds = [...session.questionOrder];

  for (const question of questions) {
    if (!orderedIds.includes(question.id)) {
      orderedIds.push(question.id);
    }
  }

  return orderedIds
    .map((questionId) => {
      const question = byId.get(questionId);
      if (!question) {
        return null;
      }

      if (question.type === 'fill_gap') {
        return question;
      }

      const choiceOrder = session.choiceOrderByQuestion[question.id];
      const fallbackChoices = question.choices;

      if (!choiceOrder || choiceOrder.length === 0) {
        return question;
      }

      const choiceMap = new Map(fallbackChoices.map((choice) => [choice.id, choice]));
      const orderedChoices = choiceOrder
        .map((choiceId) => choiceMap.get(choiceId))
        .filter((choice): choice is NonNullable<typeof choice> => Boolean(choice));

      for (const choice of fallbackChoices) {
        if (!orderedChoices.some((orderedChoice) => orderedChoice.id === choice.id)) {
          orderedChoices.push(choice);
        }
      }

      return {
        ...question,
        choices: orderedChoices
      };
    })
    .filter((question): question is QuestionRow => Boolean(question));
}

function buildResponse(question: QuizQuestion, partial: { selectedChoiceIds?: string[]; textAnswer?: string }): DraftResponse {
  const selectedChoiceIds = partial.selectedChoiceIds ?? [];
  const textAnswer = partial.textAnswer ?? '';
  const answered = question.type === 'fill_gap' ? textAnswer.trim().length > 0 : selectedChoiceIds.length > 0;

  return {
    questionId: question.id,
    selectedChoiceIds,
    textAnswer,
    isCorrect: answered ? checkAnswer(question, { selectedChoiceIds, textAnswer }) : false,
    answered
  };
}

function getResponseStatus(response: DraftResponse | undefined) {
  if (!response || !response.answered) {
    return {
      label: 'Unanswered',
      className: 'bg-slate-100 text-slate-700'
    };
  }

  return response.isCorrect
    ? {
        label: 'Correct',
        className: 'bg-emerald-100 text-emerald-800'
      }
    : {
        label: 'Incorrect',
        className: 'bg-red-100 text-red-800'
      };
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
  const [loadingSession, setLoadingSession] = useState(true);
  const [pendingDraft, setPendingDraft] = useState<DraftSession | null>(null);
  const [session, setSession] = useState<DraftSession | null>(null);
  const [remainingMs, setRemainingMs] = useState<number | undefined>();

  useEffect(() => {
    let cancelled = false;

    void db.draftSessions
      .where('quizId')
      .equals(quiz.id)
      .toArray()
      .then((rows) => {
        if (cancelled) {
          return;
        }

        const latestDraft = rows.sort((left, right) => right.updatedAt - left.updatedAt)[0] ?? null;
        setPendingDraft(latestDraft);
        if (latestDraft) {
          setMode(latestDraft.mode);
          setTimed(latestDraft.timed);
          setTimeLimitMin(Math.max(1, Math.round((latestDraft.timeLimitMs ?? 10 * 60 * 1000) / 60000)));
        }
        setLoadingSession(false);
      });

    return () => {
      cancelled = true;
    };
  }, [quiz.id]);

  useEffect(() => {
    if (!session) {
      return;
    }

    void db.draftSessions.put({
      ...session,
      updatedAt: Date.now()
    });
  }, [session]);

  const orderedQuestions = useMemo(() => (session ? hydrateQuestions(session, questions) : []), [questions, session]);
  const currentQuestion = session ? orderedQuestions[session.currentIndex] : undefined;
  const currentResponse = currentQuestion ? session?.responses[currentQuestion.id] : undefined;
  const currentStatus = getResponseStatus(currentResponse);

  const answeredCount = session ? Object.values(session.responses).filter((response) => response.answered).length : 0;
  const liveScore = session
    ? orderedQuestions.reduce((score, question) => {
        const response = session.responses[question.id];
        return score + (response?.answered ? scoreAnswer(response.isCorrect) : 0);
      }, 0)
    : 0;

  useEffect(() => {
    if (!session?.timed || !session.deadlineAt) {
      setRemainingMs(undefined);
      return;
    }

    const updateRemaining = () => {
      const nextRemaining = Math.max(0, session.deadlineAt! - Date.now());
      setRemainingMs(nextRemaining);
      if (nextRemaining === 0) {
        void finishQuiz(session);
      }
    };

    updateRemaining();
    const timerId = window.setInterval(updateRemaining, 1000);

    return () => {
      window.clearInterval(timerId);
    };
  }, [session]);

  async function discardDraft() {
    if (!pendingDraft) {
      return;
    }

    await db.draftSessions.delete(pendingDraft.id);
    setPendingDraft(null);
  }

  async function startNewQuiz() {
    await db.draftSessions.where('quizId').equals(quiz.id).delete();

    const nextSession = createDraftSession(
      quiz.id,
      questions,
      mode,
      timed,
      timeLimitMin,
      defaultShuffleQuestions,
      defaultShuffleChoices
    );

    setPendingDraft(null);
    setSession(nextSession);
  }

  function updateResponse(question: QuestionRow, partial: { selectedChoiceIds?: string[]; textAnswer?: string }) {
    setSession((currentSession) => {
      if (!currentSession) {
        return currentSession;
      }

      return {
        ...currentSession,
        currentIndex: currentSession.currentIndex,
        responses: {
          ...currentSession.responses,
          [question.id]: buildResponse(question, partial)
        }
      };
    });
  }

  function updateCurrentIndex(nextIndex: number) {
    setSession((currentSession) => {
      if (!currentSession) {
        return currentSession;
      }

      return {
        ...currentSession,
        currentIndex: Math.max(0, Math.min(nextIndex, orderedQuestions.length - 1))
      };
    });
  }

  async function finishQuiz(sessionToFinish: DraftSession | null = session) {
    if (!sessionToFinish) {
      return;
    }

    const finalQuestions = hydrateQuestions(sessionToFinish, questions);
    const endedAt = Date.now();
    const answerRows: AnswerRecord[] = finalQuestions.map((question) => {
      const response = sessionToFinish.responses[question.id];
      return {
        id: crypto.randomUUID(),
        attemptId: '',
        questionId: question.id,
        questionType: question.type,
        selectedChoiceIds: response?.selectedChoiceIds ?? [],
        textAnswer: response?.textAnswer ?? '',
        isCorrect: response?.answered ? response.isCorrect : false,
        timeSpentMs: 0
      };
    });

    const score = answerRows.reduce((accumulator, answer) => accumulator + scoreAnswer(answer.isCorrect), 0);
    const correctCount = answerRows.filter((answer) => answer.isCorrect).length;
    const attemptId = crypto.randomUUID();

    const attempt: Attempt = {
      id: attemptId,
      quizId: quiz.id,
      startedAt: sessionToFinish.startedAt,
      finishedAt: endedAt,
      mode: sessionToFinish.mode,
      score,
      totalQuestions: finalQuestions.length,
      correctCount,
      incorrectCount: finalQuestions.length - correctCount,
      timeSpentMs: endedAt - sessionToFinish.startedAt
    };

    const persistedAnswers = answerRows.map((answer) => ({
      ...answer,
      attemptId
    }));

    await db.transaction('rw', db.attempts, db.answers, db.draftSessions, async () => {
      await db.attempts.put(attempt);
      await db.answers.bulkPut(persistedAnswers);
      await db.draftSessions.where('quizId').equals(quiz.id).delete();
    });

    setPendingDraft(null);
    setSession(null);
    navigate(`/review?attemptId=${attemptId}`);
  }

  if (loadingSession) {
    return <p>Loading quiz...</p>;
  }

  if (!session) {
    return (
      <section className="space-y-4 rounded-xl bg-[var(--card)] p-5 shadow-sm">
        <div className="space-y-3">
          <h1 className="font-display text-2xl">{quiz.title}</h1>
          {quiz.description ? <p>{quiz.description}</p> : null}
        </div>

        {pendingDraft ? (
          <div className="rounded-xl border border-[var(--accent)]/20 bg-[var(--accent-soft)] p-4">
            <p className="font-semibold">Unfinished session found</p>
            <p className="mt-1 text-sm text-[var(--muted)]">
              Last updated {new Date(pendingDraft.updatedAt).toLocaleString()} · {pendingDraft.mode} mode
            </p>
            <div className="mt-3 flex flex-wrap gap-2">
              <button type="button" onClick={() => setSession(pendingDraft)} className="rounded bg-[var(--accent)] px-4 py-2 text-white">
                Resume
              </button>
              <button
                type="button"
                onClick={() => {
                  void discardDraft();
                }}
                className="rounded bg-black px-4 py-2 text-white"
              >
                Discard Draft
              </button>
            </div>
          </div>
        ) : null}

        <div className="grid gap-3 md:grid-cols-2">
          <label className="flex items-center gap-2">
            Mode
            <select value={mode} onChange={(event) => setMode(event.target.value as 'practice' | 'exam')} className="rounded border px-2 py-1">
              <option value="practice">Practice</option>
              <option value="exam">Exam</option>
            </select>
          </label>
          <label className="flex items-center gap-2">
            <input type="checkbox" checked={timed} onChange={(event) => setTimed(event.target.checked)} /> Timed mode
          </label>
          {timed ? (
            <label className="flex items-center gap-2">
              Time limit (min)
              <input
                type="number"
                min={1}
                max={300}
                value={timeLimitMin}
                onChange={(event) => setTimeLimitMin(Number(event.target.value) || 1)}
                className="w-20 rounded border px-2 py-1"
              />
            </label>
          ) : null}
        </div>

        <div className="flex flex-wrap gap-2">
          <button type="button" onClick={() => void startNewQuiz()} className="rounded bg-[var(--accent)] px-4 py-2 text-white">
            {pendingDraft ? 'Start New Quiz' : 'Start Quiz'}
          </button>
          {pendingDraft ? (
            <button type="button" onClick={() => setSession(pendingDraft)} className="rounded bg-black px-4 py-2 text-white">
              Resume Existing
            </button>
          ) : null}
        </div>
      </section>
    );
  }

  if (!currentQuestion) {
    return <p>Unable to load the current question.</p>;
  }

  const responseForCurrent = session.responses[currentQuestion.id];
  const showExplanation = hasAnswer(responseForCurrent) && session.mode === 'practice' && defaultShowExplanationAfterAnswer;

  return (
    <section className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_18rem]">
      <div className="space-y-4">
        <div className="rounded-xl bg-[var(--card)] p-4 shadow-sm">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex flex-wrap items-center gap-2 text-sm">
              <span className="rounded-full bg-black/10 px-3 py-1 font-medium">
                Question {session.currentIndex + 1} / {orderedQuestions.length}
              </span>
              <span className="rounded-full bg-black/10 px-3 py-1">Answered {answeredCount}</span>
              <span className="rounded-full bg-black/10 px-3 py-1">Live score {liveScore}</span>
              <span className={`rounded-full px-3 py-1 ${currentStatus.className}`}>{currentStatus.label}</span>
            </div>
            <Timer remainingMs={remainingMs} />
          </div>
        </div>

        <QuestionCard
          question={currentQuestion}
          selectedChoiceIds={responseForCurrent?.selectedChoiceIds ?? []}
          textAnswer={responseForCurrent?.textAnswer ?? ''}
          locked={false}
          onSelectChoice={(choiceId) => {
            const selectedChoiceIds =
              currentQuestion.type === 'single_choice'
                ? [choiceId]
                : responseForCurrent?.selectedChoiceIds?.includes(choiceId)
                  ? (responseForCurrent.selectedChoiceIds ?? []).filter((selectedId) => selectedId !== choiceId)
                  : [...(responseForCurrent?.selectedChoiceIds ?? []), choiceId];

            updateResponse(currentQuestion, {
              selectedChoiceIds,
              textAnswer: responseForCurrent?.textAnswer ?? ''
            });
          }}
          onTextAnswer={(value) =>
            updateResponse(currentQuestion, {
              selectedChoiceIds: responseForCurrent?.selectedChoiceIds ?? [],
              textAnswer: value
            })
          }
        />

        {hasAnswer(responseForCurrent) ? (
          <div className={`rounded-xl p-4 text-sm ${responseForCurrent?.isCorrect ? 'bg-emerald-100 text-emerald-800' : 'bg-red-100 text-red-800'}`}>
            <p className="font-semibold">Current grading: {responseForCurrent?.isCorrect ? 'Correct' : 'Incorrect'}</p>
            {showExplanation ? (
              <div className="mt-3">
                <ContentBlockView content={currentQuestion.explanation} />
              </div>
            ) : null}
          </div>
        ) : null}

        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => updateCurrentIndex(session.currentIndex - 1)}
            disabled={session.currentIndex === 0}
            className="rounded bg-black px-4 py-2 text-white disabled:opacity-40"
          >
            Previous
          </button>
          <button
            type="button"
            onClick={() => updateCurrentIndex(session.currentIndex + 1)}
            disabled={session.currentIndex >= orderedQuestions.length - 1}
            className="rounded bg-[var(--accent)] px-4 py-2 text-white disabled:opacity-40"
          >
            Next
          </button>
          <button type="button" onClick={() => void finishQuiz()} className="rounded bg-emerald-700 px-4 py-2 text-white">
            Finish Quiz
          </button>
        </div>
      </div>

      <QuestionMap
        currentIndex={session.currentIndex}
        total={orderedQuestions.length}
        responses={session.responses}
        questionIds={orderedQuestions.map((question) => question.id)}
        onJump={updateCurrentIndex}
      />
    </section>
  );
}
