import React, { useEffect, useState, useContext } from "react";
import { quizzesApi } from "../services/api";
import { AppContext } from "../context/AppContext";

function getScoreColor(score) {
  if (score >= 70) return "text-emerald-500";
  if (score >= 50) return "text-amber-500";
  return "text-rose-500";
}

function getScoreBgColor(score) {
  if (score >= 70) return "bg-emerald-50 dark:bg-emerald-950/20";
  if (score >= 50) return "bg-amber-50 dark:bg-amber-950/20";
  return "bg-rose-50 dark:bg-rose-950/20";
}

function getDirectionLabel(direction) {
  const labels = {
    TR_TO_EN: "🇹🇷 → 🇬🇧",
    EN_TO_TR: "🇬🇧 → 🇹🇷",
  };
  return labels[direction] || direction;
}

export default function QuizzesPage() {
  const appContext = useContext(AppContext);
  const { colorPalette } = appContext?.settings || {};
  const [quizzes, setQuizzes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchQuizzes() {
      setLoading(true);
      setError("");
      try {
        const res = await quizzesApi.getAll({ page: 0, size: 20 });
        setQuizzes(res.content || []);
      } catch (err) {
        setError("Failed to fetch quizzes.");
      } finally {
        setLoading(false);
      }
    }
    fetchQuizzes();
  }, []);

  return (
    <div className="flex flex-col items-center py-12 px-4">
      <div className="w-full max-w-4xl">
        {/* Header */}
        <div className="mb-10">
          <h1
            className="text-4xl font-bold bg-clip-text text-transparent mb-2"
            style={{
              backgroundImage: `linear-gradient(to right, ${colorPalette || "#2b8cee"}, ${colorPalette || "#2b8cee"}80)`,
            }}
          >
            Quiz History
          </h1>
          <p className="text-slate-600 dark:text-slate-400">
            Track your progress and review past quizzes
          </p>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="h-24 bg-white dark:bg-slate-800 rounded-xl animate-pulse"
              ></div>
            ))}
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="bg-rose-50 dark:bg-rose-950/20 border border-rose-200 dark:border-rose-900/30 rounded-xl p-4 text-rose-700 dark:text-rose-400">
            <div className="flex gap-3">
              <span className="material-symbols-outlined text-lg">error</span>
              <span>{error}</span>
            </div>
          </div>
        )}

        {/* Empty State */}
        {quizzes.length === 0 && !loading && !error && (
          <div className="bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-800 dark:to-slate-900 rounded-xl p-12 text-center border border-slate-200 dark:border-slate-700">
            <span className="material-symbols-outlined text-6xl text-slate-300 dark:text-slate-600 block mb-4">
              quiz
            </span>
            <h2 className="text-xl font-semibold text-slate-700 dark:text-slate-300 mb-2">
              No quizzes yet
            </h2>
            <p className="text-slate-600 dark:text-slate-400 mb-6">
              Start a quiz to see your progress here
            </p>
            <a
              href="/"
              className="inline-block px-6 py-2 bg-gradient-to-r from-blue-600 to-blue-500 text-white rounded-lg font-medium hover:shadow-lg transform hover:-translate-y-0.5 transition-all"
            >
              Start a Quiz
            </a>
          </div>
        )}

        {/* Quiz List */}
        {quizzes.length > 0 && (
          <div className="space-y-4">
            {quizzes.map((quiz, idx) => (
              <div
                key={quiz.id}
                className="card animate-fade-up"
                style={{ animationDelay: `${idx * 50}ms` }}
              >
                <div className="p-6">
                  {/* Top Row - Score and Date */}
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex items-center gap-4">
                      <div
                        className={`flex items-center justify-center w-16 h-16 rounded-lg font-bold text-lg ${getScoreBgColor(quiz.scorePercent)} ${getScoreColor(quiz.scorePercent)}`}
                      >
                        {quiz.scorePercent}%
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-slate-900 dark:text-white capitalize">
                          {quiz.quizType.replace(/_/g, " ")}
                        </h3>
                        <p className="text-sm text-slate-500 dark:text-slate-400">
                          {new Date(quiz.quizDate).toLocaleDateString("en-US", {
                            weekday: "short",
                            year: "numeric",
                            month: "short",
                            day: "numeric",
                          })}{" "}
                          at{" "}
                          {new Date(quiz.quizDate).toLocaleTimeString("en-US", {
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </p>
                      </div>
                    </div>
                    <div className="px-4 py-1 bg-slate-100 dark:bg-slate-700 rounded-full text-sm font-medium text-slate-700 dark:text-slate-300">
                      {getDirectionLabel(quiz.quizDirection)}
                    </div>
                  </div>

                  {/* Stats Grid */}
                  <div className="grid grid-cols-4 gap-4">
                    <div className="bg-slate-50 dark:bg-slate-800/50 rounded-lg p-3">
                      <p className="text-xs text-slate-600 dark:text-slate-400 mb-1">
                        Total
                      </p>
                      <p className="text-2xl font-bold text-slate-900 dark:text-white">
                        {quiz.totalCount}
                      </p>
                    </div>
                    <div className="bg-emerald-50 dark:bg-emerald-950/20 rounded-lg p-3">
                      <p className="text-xs text-emerald-700 dark:text-emerald-400 mb-1">
                        Correct
                      </p>
                      <p className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">
                        {quiz.correctCount}
                      </p>
                    </div>
                    <div className="bg-rose-50 dark:bg-rose-950/20 rounded-lg p-3">
                      <p className="text-xs text-rose-700 dark:text-rose-400 mb-1">
                        Wrong
                      </p>
                      <p className="text-2xl font-bold text-rose-600 dark:text-rose-400">
                        {quiz.wrongCount}
                      </p>
                    </div>
                    <div className="bg-blue-50 dark:bg-blue-950/20 rounded-lg p-3">
                      <p className="text-xs text-blue-700 dark:text-blue-400 mb-1">
                        Rate
                      </p>
                      <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                        {((quiz.correctCount / quiz.totalCount) * 100).toFixed(
                          0,
                        )}
                        %
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
