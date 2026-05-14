import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { AppLayout } from './components/AppLayout';
import { HomePage } from './pages/HomePage';
import { ImportPage } from './pages/ImportPage';
import { LibraryPage } from './pages/LibraryPage';
import { QuizPage } from './pages/QuizPage';
import { ReviewPage } from './pages/ReviewPage';
import { SettingsPage } from './pages/SettingsPage';

const router = createBrowserRouter([
  {
    path: '/',
    element: <AppLayout />,
    children: [
      { index: true, element: <HomePage /> },
      { path: 'library', element: <LibraryPage /> },
      { path: 'import', element: <ImportPage /> },
      { path: 'quiz/:quizId', element: <QuizPage /> },
      { path: 'review', element: <ReviewPage /> },
      { path: 'settings', element: <SettingsPage /> }
    ]
  }
]);

export function App() {
  return <RouterProvider router={router} />;
}
