import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useApp } from "../context/AppContext";

export default function QuizPage() {
    const navigate = useNavigate();
    const { quizSession, quizResults, settings, answerQuestion, skipQuestion } = useApp();
    const [answer, setAnswer] = useState("");
    const [feedback, setFeedback] = useState(null); // { correct: bool, correctAnswer: str }
    const inputRef = useRef(null);

    useEffect(() => {
        if (quizResults) navigate("/quiz-summary");
    }, [quizResults, navigate]);

    useEffect(() => {
        if (!quizSession && !quizResults) navigate("/");
    }, [quizSession, quizResults, navigate]);

    useEffect(() => {
        if (feedback === null && inputRef.current) inputRef.current.focus();
    }, [feedback, quizSession?.currentIndex]);

    const currentWord = quizSession?.words[quizSession.currentIndex];
    const total = quizSession?.words.length || 0;
    const current = (quizSession?.currentIndex || 0) + 1;
    const progress = total > 0 ? ((current - 1) / total) * 100 : 0;

    const isTypingMode = settings.typingMode !== false;
    const quizDirection = settings.quizDirection || "TR_TO_EN";

    const questionWord = currentWord
        ? quizDirection === "TR_TO_EN"
            ? currentWord.turkish
            : currentWord.english
        : "";

    const correctAnswer = currentWord
        ? quizDirection === "TR_TO_EN"
            ? currentWord.english
            : currentWord.turkish
        : "";

    const promptLabel = quizDirection === "TR_TO_EN" ? "Translate to English" : "Translate to Turkish";

    // examples is now [{ id, sentence }] from API
    const exampleSentence = currentWord?.examples?.[0]?.sentence || "";

    // MC options
    const [mcOptions, setMcOptions] = useState([]);

    useEffect(() => {
        if (!isTypingMode && currentWord && quizSession) {
            const otherWords = quizSession.words.filter((w) => w.id !== currentWord.id);
            const shuffled = [...otherWords].sort(() => Math.random() - 0.5).slice(0, 3);
            const options = [
                ...shuffled.map((w) => (quizDirection === "TR_TO_EN" ? w.english : w.turkish)),
                correctAnswer,
            ].sort(() => Math.random() - 0.5);
            setMcOptions(options);
        }
    }, [currentWord?.id, isTypingMode]);

    function handleCheckAnswer() {
        if (feedback) {
            proceedNext();
            return;
        }
        const isCorrect = answer.trim().toLowerCase() === correctAnswer.trim().toLowerCase();
        setFeedback({ correct: isCorrect, correctAnswer });
    }

    function handleMCSelect(option) {
        if (feedback) return;
        const isCorrect = option.trim().toLowerCase() === correctAnswer.trim().toLowerCase();
        setFeedback({ correct: isCorrect, correctAnswer });
        setTimeout(() => {
            answerQuestion(option);
            setAnswer("");
            setFeedback(null);
        }, 1200);
    }

    function proceedNext() {
        answerQuestion(answer);
        setAnswer("");
        setFeedback(null);
    }

    function handleSkip() {
        skipQuestion();
        setAnswer("");
        setFeedback(null);
    }

    function handleKeyDown(e) {
        if (e.key === "Enter") { if (feedback) proceedNext(); else handleCheckAnswer(); }
        if (e.key === "Escape") handleSkip();
    }

    if (!currentWord) return null;

    return (
        <div className="flex flex-col items-center justify-center px-4 py-10 min-h-[calc(100vh-140px)]">
            <div className="w-full max-w-[620px] flex flex-col gap-8">

                {/* Progress */}
                <div className="flex flex-col gap-2 w-full animate-fade-up">
                    <div className="flex justify-between items-center">
                        <p className="text-slate-500 dark:text-slate-400 text-xs font-bold uppercase tracking-wider">
                            Current Session
                        </p>
                        <p className="text-primary text-sm font-bold">
                            {current} / {total} Words
                        </p>
                    </div>
                    <div className="rounded-full bg-slate-200 dark:bg-slate-800 h-2.5 overflow-hidden">
                        <div
                            className="h-full rounded-full bg-primary transition-all duration-500"
                            style={{ width: `${progress}%` }}
                        />
                    </div>
                </div>

                {/* Quiz Card */}
                <div
                    key={quizSession.currentIndex}
                    className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 p-8 md:p-12 flex flex-col items-center text-center animate-pop-in"
                >
                    <span className="text-primary/60 text-xs font-bold uppercase tracking-widest mb-4">
                        {promptLabel}
                    </span>
                    <h1 className="text-slate-900 dark:text-slate-100 tracking-tight text-4xl md:text-5xl font-black leading-tight mb-6">
                        {questionWord}
                    </h1>

                    {exampleSentence && (
                        <div className="max-w-md mx-auto mb-8">
                            <p className="text-slate-500 dark:text-slate-400 text-base italic leading-relaxed">
                                {exampleSentence}
                                {" "}
                                <span className="border-b-2 border-primary/30 px-2 text-transparent select-none text-sm">______</span>
                            </p>
                        </div>
                    )}

                    {/* Typing mode */}
                    {isTypingMode && (
                        <div className="w-full max-w-sm flex flex-col gap-4">
                            <input
                                ref={inputRef}
                                type="text"
                                value={answer}
                                onChange={(e) => setAnswer(e.target.value)}
                                onKeyDown={handleKeyDown}
                                disabled={!!feedback}
                                placeholder="Type your answer here..."
                                className={`w-full px-6 py-4 rounded-xl text-center text-lg font-semibold transition-all outline-none border-2 ${feedback === null
                                        ? "bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 focus:border-primary text-slate-900 dark:text-slate-100"
                                        : feedback.correct
                                            ? "bg-green-50 dark:bg-green-900/20 border-green-500 text-green-700 dark:text-green-300"
                                            : "bg-red-50 dark:bg-red-900/20 border-red-400 text-red-700 dark:text-red-300"
                                    }`}
                            />

                            {feedback && (
                                <div className={`flex items-center gap-2 justify-center text-sm font-semibold animate-fade-up ${feedback.correct ? "text-green-600 dark:text-green-400" : "text-red-600 dark:text-red-400"}`}>
                                    <span className="material-symbols-outlined text-lg">
                                        {feedback.correct ? "check_circle" : "cancel"}
                                    </span>
                                    {feedback.correct ? "Correct!" : `Answer: ${feedback.correctAnswer}`}
                                </div>
                            )}

                            <div className="flex gap-3 justify-center">
                                <button
                                    onClick={feedback ? proceedNext : handleCheckAnswer}
                                    className="bg-primary hover:opacity-90 text-white px-8 py-3 rounded-xl font-bold text-sm transition-all flex items-center gap-2 shadow-sm"
                                >
                                    {feedback ? "Next" : "Check Answer"}
                                    <span className="material-symbols-outlined text-sm">
                                        {feedback ? "arrow_forward" : "check"}
                                    </span>
                                </button>
                                {!feedback && (
                                    <button
                                        onClick={handleSkip}
                                        className="bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-400 px-6 py-3 rounded-xl font-bold text-sm transition-all"
                                    >
                                        Skip
                                    </button>
                                )}
                            </div>
                        </div>
                    )}

                    {/* Multiple choice */}
                    {!isTypingMode && (
                        <div className="w-full grid grid-cols-2 gap-3">
                            {mcOptions.map((option) => (
                                <button
                                    key={option}
                                    onClick={() => handleMCSelect(option)}
                                    disabled={!!feedback}
                                    className={`p-4 rounded-xl font-medium text-sm transition-all text-center border-2 ${feedback && option === correctAnswer
                                            ? "border-green-500 bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-300"
                                            : feedback && option !== correctAnswer
                                                ? "border-slate-200 dark:border-slate-700 text-slate-400"
                                                : "border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800/50 text-slate-700 dark:text-slate-300 hover:border-primary hover:bg-primary/5"
                                        }`}
                                >
                                    {option}
                                </button>
                            ))}
                        </div>
                    )}
                </div>

                {/* Keyboard hints */}
                <div className="flex justify-center gap-8 text-slate-400 dark:text-slate-600 text-xs font-medium">
                    <span className="flex items-center gap-1.5">
                        <kbd className="px-2 py-1 bg-slate-200 dark:bg-slate-800 rounded border border-slate-300 dark:border-slate-700 font-mono">Enter</kbd>
                        to submit
                    </span>
                    <span className="flex items-center gap-1.5">
                        <kbd className="px-2 py-1 bg-slate-200 dark:bg-slate-800 rounded border border-slate-300 dark:border-slate-700 font-mono">Esc</kbd>
                        to skip
                    </span>
                </div>
            </div>
        </div>
    );
}
