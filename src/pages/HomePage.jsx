import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useApp } from "../context/AppContext";

const QUIZ_TYPES = [
  { value: "LAST_WRONG", label: "Last Wrong", icon: "priority_high" },
  { value: "RECENT", label: "Recent", icon: "history" },
  { value: "RANDOM", label: "Random", icon: "shuffle" },
];

export default function HomePage() {
  const navigate = useNavigate();
  const { stats, statsLoading, settings, updateSettings, startQuiz } = useApp();
  const [quizType, setQuizType] = useState(settings.quizType || "RECENT");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [quizCount, setQuizCount] = useState(5);

  const primaryColor = settings.colorPalette;

  async function handleStartQuiz() {
    setLoading(true);
    setError("");
    try {
      updateSettings({ quizType });
      await startQuiz(quizType, quizCount);
      navigate("/quiz");
    } catch (err) {
      setError("Backend'e bağlanılamadı. Sunucunun çalıştığından emin ol.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex flex-col items-center py-12 px-4">
      <div className="w-full max-w-4xl">
        {/* Header */}
        <div className="mb-12 animate-fade-up">
          <h1
            className="text-5xl font-black mb-3 bg-clip-text text-transparent leading-tight"
            style={{
              backgroundImage: `linear-gradient(to right, ${primaryColor}, color-mix(in srgb, ${primaryColor} 70%, #0099ff))`,
            }}
          >
            Ready to learn?
          </h1>
          <p className="text-slate-600 dark:text-slate-400 text-lg">
            Pick up where you left off or start a fresh session.
          </p>
        </div>

        {/* Main Quiz Card */}
        <div
          className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl p-8 mb-8 shadow-sm animate-fade-up"
          style={{ animationDelay: "0.05s" }}
        >
          {/* Quiz Type Selection */}
          <div className="mb-8">
            <h2 className="text-lg font-bold text-slate-800 dark:text-slate-200 mb-4">
              Choose Quiz Type
            </h2>
            <div className="grid grid-cols-3 gap-4">
              {QUIZ_TYPES.map((qt) => (
                <button
                  key={qt.value}
                  onClick={() => setQuizType(qt.value)}
                  className="group relative p-5 rounded-xl border-2 transition-all duration-300 flex flex-col items-center gap-3"
                  style={{
                    borderColor:
                      quizType === qt.value ? primaryColor : "rgb(226 232 240)",
                    backgroundColor:
                      quizType === qt.value
                        ? `${primaryColor}10`
                        : "transparent",
                  }}
                >
                  <span
                    className="material-symbols-outlined text-3xl transition-colors group-hover:scale-110"
                    style={{
                      color:
                        quizType === qt.value
                          ? primaryColor
                          : "rgb(107 114 128)",
                    }}
                  >
                    {qt.icon}
                  </span>
                  <span
                    className="text-sm font-bold uppercase tracking-wider transition-colors"
                    style={{
                      color:
                        quizType === qt.value
                          ? primaryColor
                          : "rgb(107 114 128)",
                    }}
                  >
                    {qt.label}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Divider */}
          <div className="h-px bg-slate-200 dark:bg-slate-700 mb-8"></div>

          {/* Question Count Selection */}
          <div className="mb-8">
            <h2 className="text-lg font-bold text-slate-800 dark:text-slate-200 mb-4">
              Number of Questions
            </h2>
            <div className="grid grid-cols-4 gap-3">
              {[3, 5, 10, 20].map((count) => (
                <button
                  key={count}
                  onClick={() => setQuizCount(count)}
                  style={{
                    backgroundColor:
                      quizCount === count ? primaryColor : "rgb(241 245 249)",
                    color: quizCount === count ? "white" : "rgb(71 85 105)",
                    transform: quizCount === count ? "scale(1.05)" : "scale(1)",
                  }}
                  className="py-3 rounded-lg font-bold text-lg transition-all duration-200 dark:bg-slate-700 dark:text-slate-300"
                >
                  {count}
                </button>
              ))}
            </div>
          </div>

          {/* Divider */}
          <div className="h-px bg-slate-200 dark:bg-slate-700 mb-8"></div>

          {/* Start Button */}
          <button
            onClick={handleStartQuiz}
            disabled={loading}
            style={{
              background: `linear-gradient(135deg, ${primaryColor}, color-mix(in srgb, ${primaryColor} 70%, #0099ff))`,
              boxShadow: `0 12px 32px ${primaryColor}40`,
            }}
            className="w-full py-5 px-6 rounded-xl text-white font-bold text-xl transition-all duration-300 hover:shadow-xl disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-3 group"
          >
            {loading ? (
              <>
                <span className="material-symbols-outlined animate-spin text-2xl">
                  refresh
                </span>
                Starting...
              </>
            ) : (
              <>
                <span className="material-symbols-outlined text-2xl group-hover:scale-110 transition-transform">
                  play_circle
                </span>
                Start Quiz
              </>
            )}
          </button>

          {/* Error Message */}
          {error && (
            <div className="mt-6 bg-rose-50 dark:bg-rose-950/20 border border-rose-200 dark:border-rose-900/30 rounded-lg p-4 flex items-center gap-3 text-rose-700 dark:text-rose-400">
              <span className="material-symbols-outlined">error</span>
              {error}
            </div>
          )}
        </div>

        {/* Statistics Section */}
        <div className="animate-fade-up" style={{ animationDelay: "0.1s" }}>
          <h2 className="text-xl font-bold text-slate-800 dark:text-slate-200 mb-6">
            Your Progress
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <StatCard
              icon="list_alt"
              label="Total Words"
              value={
                statsLoading ? "—" : (stats?.totalWords ?? "—").toLocaleString()
              }
              color="blue"
              primaryColor={primaryColor}
            />
            <StatCard
              icon="quiz"
              label="Total Quizzes"
              value={
                statsLoading
                  ? "—"
                  : (stats?.totalQuizzes ?? "—").toLocaleString()
              }
              color="emerald"
              primaryColor={primaryColor}
            />
            <StatCard
              icon="trending_up"
              label="Avg. Score"
              value={
                statsLoading ? "—" : stats ? `${stats.averageScore ?? 0}%` : "—"
              }
              color="amber"
              primaryColor={primaryColor}
            />
            <StatCard
              icon="check_circle"
              label="Overall Success"
              value={
                statsLoading
                  ? "—"
                  : stats
                    ? `${stats.overallSuccessRate ?? 0}%`
                    : "—"
              }
              color="rose"
              primaryColor={primaryColor}
            />
          </div>
        </div>

        {/* Quick Actions */}
        <div
          className="flex gap-4 justify-center mt-12 animate-fade-up"
          style={{ animationDelay: "0.15s" }}
        >
          <button
            onClick={() => navigate("/add-word")}
            className="flex-1 max-w-xs flex items-center justify-center gap-2 py-4 px-6 rounded-xl border-2 bg-white dark:bg-slate-800 font-bold transition-all duration-300"
            style={{
              borderColor: `${primaryColor}40`,
              color: "rgb(55 65 81)",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = primaryColor;
              e.currentTarget.style.borderColor = primaryColor;
              e.currentTarget.style.color = "white";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = "white";
              e.currentTarget.style.borderColor = `${primaryColor}40`;
              e.currentTarget.style.color = "rgb(55 65 81)";
            }}
          >
            <span className="material-symbols-outlined text-2xl">
              add_circle
            </span>
            Add Words
          </button>
          <button
            onClick={() => navigate("/vocabulary")}
            className="flex-1 max-w-xs flex items-center justify-center gap-2 py-4 px-6 rounded-xl border-2 bg-white dark:bg-slate-800 font-bold transition-all duration-300"
            style={{
              borderColor: `${primaryColor}40`,
              color: "rgb(55 65 81)",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = primaryColor;
              e.currentTarget.style.borderColor = primaryColor;
              e.currentTarget.style.color = "white";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = "white";
              e.currentTarget.style.borderColor = `${primaryColor}40`;
              e.currentTarget.style.color = "rgb(55 65 81)";
            }}
          >
            <span className="material-symbols-outlined text-2xl">
              library_books
            </span>
            My Words
          </button>
        </div>
      </div>
    </div>
  );
}

function StatCard({ icon, label, value, color = "blue", primaryColor }) {
  const darkBgMap = {
    blue: "dark:bg-blue-950/50",
    emerald: "dark:bg-emerald-950/50",
    amber: "dark:bg-amber-950/50",
    rose: "dark:bg-rose-950/50",
  };

  const darkBorderMap = {
    blue: "dark:border-blue-900/30",
    emerald: "dark:border-emerald-900/30",
    amber: "dark:border-amber-900/30",
    rose: "dark:border-rose-900/30",
  };

  const darkTextMap = {
    blue: "dark:text-blue-300",
    emerald: "dark:text-emerald-300",
    amber: "dark:text-amber-300",
    rose: "dark:text-rose-300",
  };

  const darkIconMap = {
    blue: "dark:text-blue-400",
    emerald: "dark:text-emerald-400",
    amber: "dark:text-amber-400",
    rose: "dark:text-rose-400",
  };

  return (
    <div
      className={`bg-white dark:bg-slate-800 border border-slate-200 ${darkBgMap[color]} ${darkBorderMap[color]} p-6 rounded-xl text-center shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all`}
    >
      <div
        className={`${darkIconMap[color]} mb-3 flex justify-center group-hover:scale-110 transition-transform`}
        style={{ color: primaryColor }}
      >
        <span className="material-symbols-outlined text-3xl">{icon}</span>
      </div>
      <p className="text-slate-500 dark:text-slate-400 text-xs font-bold uppercase tracking-wider">
        {label}
      </p>
      <h3
        className={`text-slate-900 ${darkTextMap[color]} text-3xl font-black mt-2`}
      >
        {value}
      </h3>
    </div>
  );
}
