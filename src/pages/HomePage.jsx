import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useApp } from "../context/AppContext";

const QUIZ_TYPES = [
    { value: "LAST_WRONG", label: "Last Wrong" },
    { value: "RECENT", label: "Recent" },
    { value: "RANDOM", label: "Random" },
];

export default function HomePage() {
    const navigate = useNavigate();
    const { stats, statsLoading, settings, updateSettings, startQuiz } = useApp();
    const [quizType, setQuizType] = useState(settings.quizType || "RECENT");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    async function handleStartQuiz() {
        setLoading(true);
        setError("");
        try {
            updateSettings({ quizType });
            await startQuiz(quizType, 10);
            navigate("/quiz");
        } catch (err) {
            setError("Backend'e bağlanılamadı. Sunucunun çalıştığından emin ol.");
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="flex justify-center py-12 px-4">
            <div className="flex flex-col max-w-[640px] w-full gap-10">

                {/* Hero */}
                <div className="text-center animate-fade-up">
                    <h1 className="text-slate-900 dark:text-slate-100 tracking-tight text-[40px] font-black leading-tight pb-2">
                        Ready to learn?
                    </h1>
                    <p className="text-slate-500 dark:text-slate-400 text-lg">
                        Pick up where you left off or start a fresh session.
                    </p>
                </div>

                {/* Start Quiz */}
                <div className="flex flex-col gap-3 items-center animate-fade-up" style={{ animationDelay: "0.05s" }}>
                    <button
                        onClick={handleStartQuiz}
                        disabled={loading}
                        className="flex w-full max-w-[320px] cursor-pointer items-center justify-center overflow-hidden rounded-xl h-16 px-5 bg-primary text-white text-xl font-bold leading-normal tracking-wide hover:opacity-90 transition-all shadow-lg disabled:opacity-60"
                        style={{ boxShadow: "0 8px 30px color-mix(in srgb, var(--color-primary) 30%, transparent)" }}
                    >
                        <span className="flex items-center gap-2">
                            {loading ? (
                                <span className="material-symbols-outlined animate-spin text-2xl">refresh</span>
                            ) : (
                                <span className="material-symbols-outlined text-2xl">play_circle</span>
                            )}
                            {loading ? "Loading..." : "Start Quiz"}
                        </span>
                    </button>
                    {error && (
                        <p className="text-red-500 text-sm text-center flex items-center gap-1">
                            <span className="material-symbols-outlined text-base">error</span>
                            {error}
                        </p>
                    )}
                </div>

                {/* Quiz Type Selector */}
                <div className="animate-fade-up" style={{ animationDelay: "0.1s" }}>
                    <h4 className="text-slate-500 dark:text-slate-400 text-xs font-bold leading-normal tracking-[0.08em] px-4 pb-3 text-center uppercase">
                        Quiz Type
                    </h4>
                    <div className="flex px-4">
                        <div className="flex h-12 flex-1 items-center justify-center rounded-xl bg-slate-100 dark:bg-slate-800 p-1.5 gap-1">
                            {QUIZ_TYPES.map((qt) => (
                                <label
                                    key={qt.value}
                                    className={`flex cursor-pointer h-full grow items-center justify-center overflow-hidden rounded-lg px-2 text-sm font-semibold transition-all ${quizType === qt.value
                                            ? "bg-white dark:bg-slate-700 shadow-sm text-primary"
                                            : "text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-300"
                                        }`}
                                >
                                    <span className="truncate">{qt.label}</span>
                                    <input
                                        className="sr-only"
                                        name="quiz_type"
                                        type="radio"
                                        value={qt.value}
                                        checked={quizType === qt.value}
                                        onChange={() => setQuizType(qt.value)}
                                    />
                                </label>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Statistics */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 px-4 animate-fade-up" style={{ animationDelay: "0.15s" }}>
                    <StatCard
                        icon="list_alt"
                        label="Total Words"
                        value={statsLoading ? "—" : (stats?.totalWords ?? "—").toLocaleString()}
                    />
                    <StatCard
                        icon="quiz"
                        label="Total Quizzes"
                        value={statsLoading ? "—" : (stats?.totalQuizzes ?? "—").toLocaleString()}
                    />
                    <StatCard
                        icon="trending_up"
                        label="Avg. Score"
                        value={statsLoading ? "—" : stats ? `${stats.averageScore ?? 0}%` : "—"}
                    />
                    <StatCard
                        icon="check_circle"
                        label="Overall Success"
                        value={statsLoading ? "—" : stats ? `${stats.overallSuccessRate ?? 0}%` : "—"}
                    />
                </div>

                {/* Quick Actions */}
                <div className="flex justify-center gap-4 px-4 animate-fade-up" style={{ animationDelay: "0.2s" }}>
                    <button
                        onClick={() => navigate("/add-word")}
                        className="flex-1 max-w-[200px] flex items-center justify-center gap-2 py-3 px-4 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 hover:border-primary/50 transition-all font-medium text-sm"
                    >
                        <span className="material-symbols-outlined text-xl text-primary">add</span>
                        Add Words
                    </button>
                    <button
                        onClick={() => navigate("/vocabulary")}
                        className="flex-1 max-w-[200px] flex items-center justify-center gap-2 py-3 px-4 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 hover:border-primary/50 transition-all font-medium text-sm"
                    >
                        <span className="material-symbols-outlined text-xl text-primary">book</span>
                        My Words
                    </button>
                </div>
            </div>
        </div>
    );
}

function StatCard({ icon, label, value }) {
    return (
        <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 p-6 rounded-xl text-center shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all">
            <div className="text-primary mb-2 flex justify-center">
                <span className="material-symbols-outlined text-3xl">{icon}</span>
            </div>
            <p className="text-slate-500 dark:text-slate-400 text-xs font-bold uppercase tracking-wider">
                {label}
            </p>
            <h3 className="text-slate-900 dark:text-slate-100 text-3xl font-black mt-1">
                {value}
            </h3>
        </div>
    );
}
