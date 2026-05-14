import React from 'react';
import ReactDOM from 'react-dom/client';
import { registerSW } from 'virtual:pwa-register';
import { App } from './App';
import { loadBuiltInQuizzes } from './lib/builtInQuizzes';
import './styles/index.css';

registerSW({ immediate: true });

void loadBuiltInQuizzes().finally(() => {
  ReactDOM.createRoot(document.getElementById('root')!).render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  );
});
