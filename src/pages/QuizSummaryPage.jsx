import React from "react";
import { useNavigate } from "react-router-dom";
import { useApp } from "../context/AppContext";

export default function QuizSummaryPage() {
    const navigate = useNavigate();
    const { quizResults, setQuizResults } = useApp();

    if (!quizResults) {
        navigate("/");
        return null;
    }

    const { total, correct, wrong, wrongAnswers, answers } = quizResults;
    const correctPct = total > 0 ? Math.round((correct / total) * 100) : 0;
    const wrongPct = 100 - correctPct;
    const quizDirection = answers?.[0]
        ? (answers[0].correctAnswer === answers[0].word?.english ? "TR_TO_EN" : "EN_TO_TR")
        : "TR_TO_EN";

    function handleRestart() {
        setQuizResults(null);
        navigate("/");
    }

    return (
        <div className="flex justify-center py-10 px-4">
            <div className="max-w-[800px] w-full flex flex-col gap-8">
                {/* Hero */}
                <div className="flex flex-col gap-2 animate-fade-up">
                    <div className="flex items-center gap-2 text-primary">
                        <span className="material-symbols-outlined">check_circle</span>
                        <span className="text-sm font-bold uppercase tracking-wider">
                            Quiz Completed
                        </span>
                    </div>
                    <h1 className="text-slate-900 dark:text-white text-4xl font-extrabold tracking-tight">
                        Quiz Summary
                    </h1>
                    <p className="text-slate-500 dark:text-slate-400 text-lg">
                        Great job completing the session! Here is how you performed.
                    </p>
                </div>

                {/* Score Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 animate-fade-up" style={{ animationDelay: "0.05s" }}>
                    <ScoreCard
                        label="Total Correct"
                        value={correct}
                        percent={correctPct}
                        icon="sentiment_very_satisfied"
                        color="green"
                    />
                    <ScoreCard
                        label="Total Wrong"
                        value={wrong}
                        percent={wrongPct}
                        icon="sentiment_dissatisfied"
                        color="red"
                        inverted
                    />
                </div>

                {/* Words to Review */}
                {wrongAnswers.length > 0 && (
                    <div className="flex flex-col gap-4 animate-fade-up" style={{ animationDelay: "0.1s" }}>
                        <div className="flex items-center gap-2">
                            <span className="material-symbols-outlined text-slate-400">list_alt</span>
                            <h2 className="text-slate-900 dark:text-white text-xl font-bold">
                                Words to Review
                            </h2>
                        </div>
                        <div className="overflow-hidden rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm">
                            <table className="w-full border-collapse text-left">
                                <thead className="bg-slate-50 dark:bg-slate-800/50">
                                    <tr>
                                        <th className="px-6 py-4 text-slate-500 dark:text-slate-400 text-xs font-bold uppercase tracking-wider">
                                            Word
                                        </th>
                                        <th className="px-6 py-4 text-slate-500 dark:text-slate-400 text-xs font-bold uppercase tracking-wider">
                                            Your Answer
                                        </th>
                                        <th className="px-6 py-4 text-slate-500 dark:text-slate-400 text-xs font-bold uppercase tracking-wider hidden md:table-cell">
                                            Correct Answer
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                                    {wrongAnswers.map((item, i) => (
                                        <tr
                                            key={i}
                                            className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors"
                                        >
                                            <td className="px-6 py-4 text-slate-900 dark:text-white font-bold text-sm">
                                                {quizDirection === "TR_TO_EN"
                                                    ? item.word.turkish
                                                    : item.word.english}
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className="px-3 py-1 rounded-full bg-red-50 dark:bg-red-500/10 text-red-600 dark:text-red-400 text-sm font-medium">
                                                    {item.userAnswer === "(skipped)" ? "Skipped" : item.userAnswer || "—"}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 text-slate-500 dark:text-slate-400 text-sm italic hidden md:table-cell">
                                                {item.correctAnswer}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}

                {wrongAnswers.length === 0 && (
                    <div className="text-center py-8 animate-fade-up">
                        <span className="material-symbols-outlined text-5xl text-primary block mb-3">stars</span>
                        <p className="text-slate-700 dark:text-slate-300 text-lg font-bold">Perfect score! 🎉</p>
                        <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">Incredible work — every answer was correct!</p>
                    </div>
                )}

                {/* Action Buttons */}
                <div className="flex flex-col md:flex-row gap-4 pt-2 animate-fade-up" style={{ animationDelay: "0.15s" }}>
                    <button
                        onClick={handleRestart}
                        className="flex-1 bg-primary hover:opacity-90 text-white font-bold py-4 px-8 rounded-xl transition-all flex items-center justify-center gap-2 shadow-lg"
                        style={{ boxShadow: "0 8px 24px color-mix(in srgb, var(--color-primary) 25%, transparent)" }}
                    >
                        <span className="material-symbols-outlined">restart_alt</span>
                        Restart Quiz
                    </button>
                    <button
                        onClick={() => { setQuizResults(null); navigate("/"); }}
                        className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-200 font-bold py-4 px-8 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800 transition-all flex items-center justify-center gap-2"
                    >
                        <span className="material-symbols-outlined">home</span>
                        Back to Home
                    </button>
                </div>
            </div>
        </div>
    );
}

function ScoreCard({ label, value, percent, icon, color, inverted }) {
    const colorMap = {
        green: {
            icon: "text-green-500 bg-green-50 dark:bg-green-500/10",
            bar: "bg-green-500",
            percent: "text-green-600 dark:text-green-400",
        },
        red: {
            icon: "text-red-500 bg-red-50 dark:bg-red-500/10",
            bar: "bg-red-500",
            percent: "text-red-600 dark:text-red-400",
        },
    };
    const c = colorMap[color];

    return (
        <div className="flex flex-col gap-3 rounded-2xl p-8 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
            <div className="flex items-center justify-between">
                <p className="text-slate-500 dark:text-slate-400 text-sm font-bold uppercase tracking-wide">
                    {label}
                </p>
                <span className={`material-symbols-outlined p-2 rounded-xl ${c.icon}`}>{icon}</span>
            </div>
            <div className="flex items-baseline gap-2">
                <p className="text-slate-900 dark:text-white text-5xl font-black">{value}</p>
                <p className={`text-sm font-bold flex items-center gap-0.5 ${c.percent}`}>
                    <span className="material-symbols-outlined text-xs">
                        {inverted ? "arrow_downward" : "arrow_upward"}
                    </span>
                    {percent}%
                </p>
            </div>
            <div className="w-full bg-slate-100 dark:bg-slate-800 h-2 rounded-full overflow-hidden mt-1">
                <div
                    className={`h-full rounded-full transition-all duration-700 ${c.bar}`}
                    style={{ width: `${percent}%` }}
                />
            </div>
        </div>
    );
}
