import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { db, type QuestionRow, type QuizPackRow } from '../lib/db';
import { QuizPlayer } from '../components/QuizPlayer';

interface UiSettings {
  shuffleQuestions: boolean;
  shuffleChoices: boolean;
  showExplanationAfterAnswer: boolean;
  timedModeDefault: boolean;
}

const defaultUiSettings: UiSettings = {
  shuffleQuestions: true,
  shuffleChoices: true,
  showExplanationAfterAnswer: true,
  timedModeDefault: false
};

export function QuizPage() {
  const { quizId } = useParams();
  const [quiz, setQuiz] = useState<QuizPackRow | null>(null);
  const [questions, setQuestions] = useState<QuestionRow[]>([]);
  const [settings, setSettings] = useState<UiSettings>(defaultUiSettings);

  useEffect(() => {
    if (!quizId) return;
    void Promise.all([
      db.quizPacks.get(quizId),
      db.questions.where('quizId').equals(quizId).toArray(),
      db.settings.get('ui')
    ]).then(([quizRow, questionRows, setting]) => {
      setQuiz(quizRow ?? null);
      setQuestions(questionRows);
      if (setting?.value && typeof setting.value === 'object') {
        setSettings({ ...defaultUiSettings, ...(setting.value as Partial<UiSettings>) });
      }
    });
  }, [quizId]);

  if (!quiz || questions.length === 0) {
    return <p>Loading quiz...</p>;
  }

  return (
    <QuizPlayer
      quiz={quiz}
      questions={questions}
      defaultTimedMode={settings.timedModeDefault}
      defaultShuffleQuestions={settings.shuffleQuestions}
      defaultShuffleChoices={settings.shuffleChoices}
      defaultShowExplanationAfterAnswer={settings.showExplanationAfterAnswer}
    />
  );
}
