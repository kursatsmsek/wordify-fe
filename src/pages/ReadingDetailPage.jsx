import React, { useState, useEffect } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import DropdownSection from "../components/DropdownSection";
import { readingsApi } from "../services/api";

function normalizeReadingResponse(res) {
  if (!res) return null;
  const readingContent = res.reading || {};
  return {
    id: res.id,
    title: res.title || "",
    created_at: res.created_at,
    source_words: res.source_words || [],
    passage_en: readingContent.passage_en || "",
    passage_tr: readingContent.passage_tr || "",
    target_words: readingContent.target_words || [],
    extra_words: readingContent.extra_words || [],
    questions: readingContent.questions || [],
  };
}

function normalizeCreateReadingResponse(res, createdAt) {
  if (!res) return null;
  const readingContent = res.reading || {};
  return {
    id: "new",
    title: res.title || "New Reading",
    created_at: createdAt,
    source_words: res.source_words || [],
    passage_en: readingContent.passage_en || "",
    passage_tr: readingContent.passage_tr || "",
    target_words: readingContent.target_words || [],
    extra_words: readingContent.extra_words || [],
    questions: readingContent.questions || [],
  };
}

export default function ReadingDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const [reading, setReading] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    async function fetchReading() {
      setLoading(true);
      setError("");
      try {
        if (id === "new") {
          const prefetched = location.state?.reading;
          const createdAt = location.state?.createdAt || new Date().toISOString();
          if (prefetched) {
            setReading(normalizeCreateReadingResponse(prefetched, createdAt));
          } else {
            const res = await readingsApi.create({ count: 10, instruction: "" });
            setReading(normalizeCreateReadingResponse(res, createdAt));
          }
        } else {
          const res = await readingsApi.getById(id);
          setReading(normalizeReadingResponse(res));
        }
      } catch (err) {
        setError(err.message || "Failed to fetch reading.");
      } finally {
        setLoading(false);
      }
    }
    fetchReading();
  }, [id, location.state]);

  const handleAnswerSelect = (questionIndex, optionId) => {
    if (submitted) return;
    setSelectedAnswers((prev) => ({
      ...prev,
      [questionIndex]: optionId,
    }));
  };

  const handleSubmit = () => {
    setSubmitted(true);
  };

  const handleReset = () => {
    setSelectedAnswers({});
    setSubmitted(false);
  };

  const calculateScore = () => {
    if (!reading) return 0;
    if (!reading.questions.length) return 0;
    return Math.round((calculateCorrectCount() / reading.questions.length) * 100);
  };

  const calculateCorrectCount = () => {
    if (!reading) return 0;
    return reading.questions.reduce((count, question, idx) => {
      return selectedAnswers[idx] === question.answer ? count + 1 : count;
    }, 0);
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center px-4 py-10 min-h-[calc(100vh-140px)]">
        <div className="w-full max-w-3xl space-y-4">
          {[1, 2, 3, 4, 5].map((i) => (
            <div
              key={i}
              className="h-24 bg-white dark:bg-slate-800 rounded-xl animate-pulse"
            ></div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center px-4 py-10 min-h-[calc(100vh-140px)]">
        <div className="w-full max-w-3xl bg-rose-50 dark:bg-rose-950/20 border border-rose-200 dark:border-rose-900/30 rounded-xl p-6 text-rose-700 dark:text-rose-400">
          <div className="flex gap-3 items-start">
            <span className="material-symbols-outlined text-lg flex-shrink-0">
              error
            </span>
            <div>
              <h3 className="font-semibold mb-1">Error</h3>
              <p>{error}</p>
              <button
                onClick={() => navigate("/readings")}
                className="mt-4 text-sm font-medium underline hover:no-underline"
              >
                Back to Readings
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!reading) return null;

  return (
    <div className="flex flex-col items-center px-4 py-10">
      <div className="w-full max-w-4xl flex flex-col gap-8">
        {/* Back Button */}
        <button
          onClick={() => navigate("/readings")}
          className="flex items-center gap-2 text-primary hover:opacity-80 transition-opacity text-sm font-medium"
        >
          <span className="material-symbols-outlined text-base">
            arrow_back
          </span>
          Back to Readings
        </button>

        {/* Passage Card */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 p-8 md:p-12 animate-pop-in">
          {reading.title && (
            <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100 mb-4">
              {reading.title}
            </h1>
          )}
          <div className="prose prose-sm dark:prose-invert max-w-none mb-8">
            <p className="text-slate-800 dark:text-slate-200 text-lg leading-8 font-normal">
              {reading.passage_en}
            </p>
          </div>

          {/* Dropdown Sections */}
          <div className="space-y-3 mt-8">
            <DropdownSection title="🇹🇷 Turkish Translation">
              <p className="text-slate-700 dark:text-slate-300 leading-relaxed text-base">
                {reading.passage_tr}
              </p>
            </DropdownSection>

            <DropdownSection title="🎯 Target Words">
              <div className="space-y-2">
                {reading.target_words.map((item, idx) => (
                  <div
                    key={idx}
                    className="flex justify-between items-start gap-4 py-2 px-3 rounded-lg bg-white dark:bg-slate-800/50 border border-slate-100 dark:border-slate-700"
                  >
                    <div>
                      <p className="font-semibold text-slate-900 dark:text-slate-100 text-sm">
                        {item.word}
                      </p>
                    </div>
                    <p className="text-slate-600 dark:text-slate-400 text-sm">
                      {item.meaning_tr}
                    </p>
                  </div>
                ))}
              </div>
            </DropdownSection>

            <DropdownSection title="➕ Extra Words">
              <div className="space-y-2">
                {reading.extra_words.map((item, idx) => (
                  <div
                    key={idx}
                    className="flex justify-between items-start gap-4 py-2 px-3 rounded-lg bg-white dark:bg-slate-800/50 border border-slate-100 dark:border-slate-700"
                  >
                    <div>
                      <p className="font-semibold text-slate-900 dark:text-slate-100 text-sm">
                        {item.word}
                      </p>
                    </div>
                    <p className="text-slate-600 dark:text-slate-400 text-sm">
                      {item.meaning_tr}
                    </p>
                  </div>
                ))}
              </div>
            </DropdownSection>
          </div>
        </div>

        {/* Questions Section */}
        <div className="space-y-6">
          <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100">
            Comprehension Questions
          </h2>

          {reading.questions.length === 0 && (
            <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-6 text-slate-600 dark:text-slate-400">
              This reading has no questions yet.
            </div>
          )}

          {reading.questions.map((question, qIdx) => (
            <div
              key={qIdx}
              className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-6 animate-pop-in"
              style={{ animationDelay: `${qIdx * 50}ms` }}
            >
              <p className="text-slate-900 dark:text-slate-100 font-semibold mb-4">
                <span className="text-primary mr-2">{qIdx + 1}.</span>
                {question.question}
              </p>

              <div className="space-y-2">
                {(question.options || []).map((option) => {
                  const isSelected = selectedAnswers[qIdx] === option.id;
                  const isCorrect = option.id === question.answer;
                  const showResult = submitted && isSelected;
                  const showCorrectOption = submitted && isCorrect;

                  let buttonClass =
                    "border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800/50 text-slate-700 dark:text-slate-300 hover:border-primary hover:bg-primary/5";

                  if (submitted) {
                    if (showCorrectOption) {
                      buttonClass =
                        "border-green-500 bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-300";
                    } else if (showResult) {
                      buttonClass =
                        "border-red-500 bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-300";
                    } else if (isSelected) {
                      buttonClass =
                        "border-slate-200 dark:border-slate-700 text-slate-400";
                    }
                  } else if (isSelected) {
                    buttonClass =
                      "border-primary bg-primary/10 text-slate-900 dark:text-slate-100 dark:bg-primary/20";
                  }

                  return (
                    <button
                      key={option.id}
                      onClick={() => handleAnswerSelect(qIdx, option.id)}
                      disabled={submitted}
                      className={`w-full p-4 rounded-lg font-medium text-sm transition-all text-left border-2 flex items-center gap-3 ${buttonClass}`}
                    >
                      <span className="flex-shrink-0 w-6 h-6 flex items-center justify-center rounded-full border-2 border-current font-bold text-xs">
                        {option.id}
                      </span>
                      <span className="flex-1">{option.text}</span>
                      {submitted && showCorrectOption && (
                        <span className="material-symbols-outlined flex-shrink-0 text-lg">
                          check_circle
                        </span>
                      )}
                      {submitted && showResult && (
                        <span className="material-symbols-outlined flex-shrink-0 text-lg">
                          cancel
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        {/* Results Summary */}
        {submitted && (
          <div className="bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-800 dark:to-slate-900 rounded-xl p-8 border border-slate-200 dark:border-slate-700 text-center animate-fade-up">
            <div className="flex justify-center mb-6">
              <div
                className={`flex items-center justify-center w-20 h-20 rounded-full font-bold text-2xl ${
                  calculateScore() >= 70
                    ? "bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400"
                    : calculateScore() >= 50
                      ? "bg-amber-50 dark:bg-amber-900/20 text-amber-600 dark:text-amber-400"
                      : "bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400"
                }`}
              >
                {calculateScore()}%
              </div>
            </div>
            <p className="text-slate-600 dark:text-slate-400 mb-4">
              You got {calculateCorrectCount()} out of {reading.questions.length} questions correct.
            </p>
            <button
              onClick={handleReset}
              className="bg-primary hover:opacity-90 text-white px-6 py-3 rounded-xl font-bold text-sm transition-all"
            >
              Try Again
            </button>
          </div>
        )}

        {/* Submit Button */}
        {!submitted && reading.questions.length > 0 && Object.keys(selectedAnswers).length === reading.questions.length && (
          <button
            onClick={handleSubmit}
            className="bg-primary hover:opacity-90 text-white px-8 py-4 rounded-xl font-bold text-base transition-all flex items-center justify-center gap-2 shadow-sm"
          >
            <span className="material-symbols-outlined text-lg">check</span>
            Submit Answers
          </button>
        )}

        {/* Instruction */}
        {!submitted && reading.questions.length > 0 && Object.keys(selectedAnswers).length < reading.questions.length && (
          <p className="text-center text-slate-500 dark:text-slate-400 text-sm">
            Answer all questions ({Object.keys(selectedAnswers).length}/{reading.questions.length}) to submit
          </p>
        )}

        <div className="h-10" />
      </div>
    </div>
  );
}
