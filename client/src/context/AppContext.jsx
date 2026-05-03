import { createContext, useContext, useState, useCallback } from 'react';

const AppContext = createContext(null);

const STORAGE_KEY = 'eg_progress';

const defaultProgress = () => ({
  completed: {},   // { moduleId: true }
  quizScores: {},  // { moduleId: score }
  lastVisited: {}, // { moduleId: ISO string }
  achievements: [],
  chatCount: 0,
  mythCount: 0,
});

const load = () => {
  try { return { ...defaultProgress(), ...JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}') }; }
  catch { return defaultProgress(); }
};

const save = (state) => localStorage.setItem(STORAGE_KEY, JSON.stringify(state));

export function AppProvider({ children }) {
  const [progress, setProgress] = useState(load);

  const updateProgress = useCallback((updater) => {
    setProgress((prev) => {
      const next = { ...prev, ...updater(prev) };
      save(next);
      return next;
    });
  }, []);

  const markComplete = useCallback((moduleId) => {
    updateProgress((prev) => {
      const completed = { ...prev.completed, [moduleId]: true };
      const achievements = [...new Set([...prev.achievements, 'first_module'])];
      const allDone = Object.keys(completed).length >= 8;
      if (allDone) achievements.push('all_modules');
      return { completed, achievements };
    });
  }, [updateProgress]);

  const saveQuizScore = useCallback((moduleId, score) => {
    updateProgress((prev) => {
      const quizScores = { ...prev.quizScores, [moduleId]: score };
      const achievements = [...new Set([...prev.achievements,
        ...(score === 5 ? ['perfect_score'] : []),
      ])];
      return { quizScores, achievements };
    });
  }, [updateProgress]);

  const markVisited = useCallback((moduleId) => {
    updateProgress((prev) => ({
      lastVisited: { ...prev.lastVisited, [moduleId]: new Date().toISOString() },
    }));
  }, [updateProgress]);

  const incrementChat = useCallback(() => {
    updateProgress((prev) => ({ chatCount: (prev.chatCount || 0) + 1 }));
  }, [updateProgress]);

  const incrementMyth = useCallback(() => {
    updateProgress((prev) => {
      const mythCount = (prev.mythCount || 0) + 1;
      const achievements = [...new Set([...prev.achievements, 'myth_buster'])];
      return { mythCount, achievements };
    });
  }, [updateProgress]);

  return (
    <AppContext.Provider value={{
      progress,
      markComplete,
      saveQuizScore,
      markVisited,
      incrementChat,
      incrementMyth,
    }}>
      {children}
    </AppContext.Provider>
  );
}

export const useApp = () => {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used within AppProvider');
  return ctx;
};
