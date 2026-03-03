import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from "react";
import { DEFAULT_SETTINGS } from "../data/mockWords";
import { wordsApi, quizzesApi } from "../services/api";

const AppContext = createContext(null);

function loadFromStorage(key, fallback) {
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : fallback;
  } catch {
    return fallback;
  }
}

export function AppProvider({ children }) {
  const [settings, setSettings] = useState(() =>
    loadFromStorage("wordify_settings", DEFAULT_SETTINGS),
  );
  const [stats, setStats] = useState(null);
  const [statsLoading, setStatsLoading] = useState(false);

  // Quiz state
  const [quizSession, setQuizSession] = useState(null);
  const [quizResults, setQuizResults] = useState(null);

  // Apply settings side effects
  useEffect(() => {
    localStorage.setItem("wordify_settings", JSON.stringify(settings));
    if (settings.darkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
    document.documentElement.style.setProperty(
      "--color-primary",
      settings.colorPalette,
    );
  }, [settings]);

  // Fetch global stats
  const fetchStats = useCallback(async () => {
    setStatsLoading(true);
    try {
      const data = await quizzesApi.getStats();
      setStats(data);
    } catch (err) {
      console.error("Failed to fetch stats:", err);
    } finally {
      setStatsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchStats();
  }, [fetchStats]);

  // ─── Quiz Flow ──────────────────────────────────────────────────────────────

  const startQuiz = useCallback(async (quizType, count = 10) => {
    const words = await wordsApi.getQuizWords(quizType, count);
    setQuizSession({
      words,
      currentIndex: 0,
      answers: [],
    });
    setQuizResults(null);
  }, []);

  const _finishQuiz = useCallback(
    async (allAnswers, sessionWords) => {
      const correct = allAnswers.filter((a) => a.isCorrect).length;
      const wrong = allAnswers.length - correct;
      const wrongWords = allAnswers
        .filter((a) => !a.isCorrect)
        .map((a) => ({ wordId: a.word.id, userAnswer: a.userAnswer }));
      const askedWordIds = sessionWords.map((w) => w.id);

      const payload = {
        quizType: settings.quizType || "RECENT",
        quizDirection: settings.quizDirection || "TR_TO_EN",
        totalCount: sessionWords.length,
        correctCount: correct,
        wrongCount: wrong,
        wrongWords,
        askedWordIds,
      };

      try {
        const quizResponse = await quizzesApi.create(payload);
        setQuizResults({
          total: sessionWords.length,
          correct,
          wrong,
          answers: allAnswers,
          wrongAnswers: allAnswers.filter((a) => !a.isCorrect),
          quizId: quizResponse?.id,
        });
      } catch (err) {
        console.error("Failed to save quiz:", err);
        // Still show results even if save fails
        setQuizResults({
          total: sessionWords.length,
          correct,
          wrong,
          answers: allAnswers,
          wrongAnswers: allAnswers.filter((a) => !a.isCorrect),
        });
      }

      setQuizSession(null);
      fetchStats(); // refresh stats after quiz
    },
    [settings.quizType, settings.quizDirection, fetchStats],
  );

  const answerQuestion = useCallback(
    (answer) => {
      if (!quizSession) return;
      const currentWord = quizSession.words[quizSession.currentIndex];
      const correctAnswer =
        settings.quizDirection === "TR_TO_EN"
          ? currentWord.english
          : currentWord.turkish;

      const isCorrect =
        answer.trim().toLowerCase() === correctAnswer.trim().toLowerCase();

      const newAnswer = {
        word: currentWord,
        userAnswer: answer,
        correctAnswer,
        isCorrect,
      };

      const newAnswers = [...quizSession.answers, newAnswer];
      const nextIndex = quizSession.currentIndex + 1;

      if (nextIndex >= quizSession.words.length) {
        _finishQuiz(newAnswers, quizSession.words);
      } else {
        setQuizSession((prev) => ({
          ...prev,
          currentIndex: nextIndex,
          answers: newAnswers,
        }));
      }
    },
    [quizSession, settings.quizDirection, _finishQuiz],
  );

  const skipQuestion = useCallback(() => {
    if (!quizSession) return;
    const currentWord = quizSession.words[quizSession.currentIndex];
    const correctAnswer =
      settings.quizDirection === "TR_TO_EN"
        ? currentWord.english
        : currentWord.turkish;

    const newAnswer = {
      word: currentWord,
      userAnswer: "(skipped)",
      correctAnswer,
      isCorrect: false,
    };

    const newAnswers = [...quizSession.answers, newAnswer];
    const nextIndex = quizSession.currentIndex + 1;

    if (nextIndex >= quizSession.words.length) {
      _finishQuiz(newAnswers, quizSession.words);
    } else {
      setQuizSession((prev) => ({
        ...prev,
        currentIndex: nextIndex,
        answers: newAnswers,
      }));
    }
  }, [quizSession, settings.quizDirection, _finishQuiz]);

  // ─── Settings ───────────────────────────────────────────────────────────────

  const updateSettings = useCallback((updates) => {
    setSettings((prev) => ({ ...prev, ...updates }));
  }, []);

  const resetSettings = useCallback(() => {
    setSettings(DEFAULT_SETTINGS);
  }, []);

  const value = {
    // Stats
    stats,
    statsLoading,
    fetchStats,
    // Settings
    settings,
    updateSettings,
    resetSettings,
    // Quiz
    quizSession,
    quizResults,
    setQuizResults,
    startQuiz,
    answerQuestion,
    skipQuestion,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error("useApp must be used inside AppProvider");
  return ctx;
}
