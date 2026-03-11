import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useApp } from "../context/AppContext";
import { readingsApi } from "../services/api";

function extractReadingsFromResponse(res) {
  if (!res) return [];
  if (Array.isArray(res.content)) return res.content;
  if (Array.isArray(res?._embedded?.readingSummaryResponseList)) {
    return res._embedded.readingSummaryResponseList;
  }
  if (Array.isArray(res?._embedded?.readings)) return res._embedded.readings;
  return [];
}

function getRelativeDate(dateString) {
  const readingDate = new Date(dateString);
  if (Number.isNaN(readingDate.getTime())) return "-";
  const today = new Date();
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);

  // Reset time for date comparison
  readingDate.setHours(0, 0, 0, 0);
  today.setHours(0, 0, 0, 0);
  yesterday.setHours(0, 0, 0, 0);

  if (readingDate.getTime() === today.getTime()) {
    return "Today";
  } else if (readingDate.getTime() === yesterday.getTime()) {
    return "Yesterday";
  } else {
    const daysAgo = Math.floor(
      (today.getTime() - readingDate.getTime()) / (1000 * 60 * 60 * 24),
    );
    return `${daysAgo} days ago`;
  }
}

function formatDate(dateString) {
  const date = new Date(dateString);
  if (Number.isNaN(date.getTime())) return "-";
  return date.toLocaleDateString("tr-TR", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

function ReadingCard({ reading, index, onOpen }) {
  const sourceWords = reading.source_words || [];
  const title =
    reading.title || sourceWords.slice(0, 3).join(", ") || "Reading Exercise";

  return (
    <button
      onClick={onOpen}
      className="relative overflow-hidden w-full text-left rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-gradient-to-br from-white via-slate-50 to-slate-100 dark:from-slate-900 dark:via-slate-900/80 dark:to-slate-800/70 p-5 sm:p-6 shadow-sm hover:shadow-lg hover:-translate-y-0.5 transition-all animate-fade-up"
      style={{ animationDelay: `${index * 50}ms` }}
    >
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-l from-primary/5 via-transparent to-transparent opacity-80" />

      <div className="flex items-start justify-between gap-4 mb-3">
        <div className="min-w-0">
          <p className="text-[11px] uppercase tracking-[0.16em] text-slate-500 dark:text-slate-400 mb-2">
            Reading #{reading.id}
          </p>
          <h3 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white leading-tight">
            {title}
          </h3>
        </div>
        <span className="material-symbols-outlined text-slate-500 bg-white/70 dark:bg-slate-800/80 border border-slate-200/70 dark:border-slate-700 p-2 rounded-xl shadow-sm">
          menu_book
        </span>
      </div>

      <p className="text-sm text-slate-600 dark:text-slate-300 mb-4 line-clamp-2">
        {sourceWords.length > 0
          ? `Source words: ${sourceWords.join(", ")}`
          : "No source words"}
      </p>

      <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
        <div className="flex items-center gap-2">
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-semibold">
            <span className="material-symbols-outlined text-sm">tag</span>
            {sourceWords.length} words
          </span>
          <span className="text-slate-500 dark:text-slate-400">
            {getRelativeDate(reading.created_at)} (
            {formatDate(reading.created_at)})
          </span>
        </div>
        <span className="inline-flex items-center gap-1 font-semibold text-primary">
          Open
          <span className="material-symbols-outlined text-base">
            arrow_forward
          </span>
        </span>
      </div>
    </button>
  );
}

export default function ReadingListPage() {
  const navigate = useNavigate();
  const { settings } = useApp();
  const { colorPalette } = settings || {};
  const readingCount = Math.max(
    3,
    Math.min(20, Number(settings?.readingCount) || 3),
  );
  const [readings, setReadings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [error, setError] = useState("");
  const [instruction, setInstruction] = useState("");

  useEffect(() => {
    async function fetchReadings() {
      setLoading(true);
      setError("");
      try {
        const res = await readingsApi.getAll({ page: 0, size: 20 });
        setReadings(extractReadingsFromResponse(res));
      } catch {
        setError("Failed to fetch readings.");
      } finally {
        setLoading(false);
      }
    }
    fetchReadings();
  }, []);

  const handleNewReading = async () => {
    setCreating(true);
    setError("");
    try {
      const created = await readingsApi.create({
        count: readingCount,
        instruction: instruction.trim() || "",
      });
      if (!created?.reading || !created?.source_words) {
        throw new Error("Invalid reading response");
      }
      const createdAt = new Date().toISOString();
      setReadings((prev) => [
        {
          id: "new",
          title: "New Reading",
          created_at: createdAt,
          source_words: created.source_words || [],
        },
        ...prev,
      ]);
      navigate("/readings/new", { state: { reading: created, createdAt } });
      setInstruction("");
    } catch {
      setError("Failed to create reading.");
    } finally {
      setCreating(false);
    }
  };

  return (
    <div className="flex flex-col items-center py-12 px-4">
      <div className="w-full max-w-4xl">
        {/* Header */}
        <div className="mb-8 sm:mb-10">
          <h1
            className="text-2xl sm:text-4xl font-bold bg-clip-text text-transparent mb-2"
            style={{
              lineHeight: "inherit",
              backgroundImage: `linear-gradient(to right, ${colorPalette || "#2b8cee"}, ${colorPalette || "#2b8cee"}80)`,
            }}
          >
            Reading Practice
          </h1>
          <p className="text-slate-600 dark:text-slate-400">
            Improve your reading comprehension with target vocabulary
          </p>
        </div>

        {/* New Reading Button */}
        <div className="mb-10">
          <div className="relative overflow-hidden rounded-2xl border border-slate-200 dark:border-slate-800 bg-gradient-to-r from-white to-slate-50 dark:from-slate-900 dark:to-slate-800/70 shadow-sm p-5 sm:p-6">
            <div className="absolute inset-y-0 right-0 w-32 bg-gradient-to-l from-primary/10 to-transparent pointer-events-none" />
            <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between relative">
              <div className="flex-1 space-y-2">
                <div className="flex items-center gap-2 text-xs uppercase tracking-[0.18em] text-slate-500 dark:text-slate-400 font-bold">
                  {/* <span className="material-symbols-outlined text-base">spark</span> */}
                  Build New Reading
                </div>
                <h2 className="text-xl sm:text-2xl font-extrabold pb-4 pt-4 text-slate-900 dark:text-white leading-tight">
                  Generate a fresh passage with your vocabulary
                </h2>
                <div className="flex flex-wrap items-center gap-2 text-sm text-slate-600 dark:text-slate-300">
                  <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-slate-100 dark:bg-slate-800 font-semibold">
                    <span className="material-symbols-outlined text-sm">
                      tag
                    </span>
                    {readingCount} source words (Settings)
                  </span>
                  <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-primary/10 text-primary font-semibold">
                    Optional instruction
                  </span>
                </div>
              </div>

              <div className="w-full sm:w-[380px] flex flex-col gap-3">
                <label className="text-xs font-semibold text-slate-600 dark:text-slate-300 flex items-center gap-1">
                  Instruction (optional)
                  <span className="text-[11px] font-normal text-slate-400 dark:text-slate-500">
                    leave empty for default prompt
                  </span>
                </label>
                <input
                  type="text"
                  value={instruction}
                  onChange={(e) => setInstruction(e.target.value)}
                  placeholder="e.g. 'story style', 'business email', 'sci-fi passage'..."
                  className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/60 transition-shadow"
                />
                <div className="flex flex-wrap gap-2 pt-2">
                  {["daily dialogue", "business email", "travel theme"].map(
                    (preset) => (
                      <button
                        key={preset}
                        type="button"
                        onClick={() => setInstruction(preset)}
                        className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-primary/10 hover:text-primary transition-colors"
                      >
                        {preset}
                      </button>
                    ),
                  )}
                </div>
                <button
                  onClick={handleNewReading}
                  disabled={creating}
                  className={`inline-flex justify-center items-center gap-2 w-full sm:w-auto px-5 py-3 rounded-xl font-bold text-sm text-white shadow-sm transition-all ${
                    creating
                      ? "bg-primary/70 cursor-wait"
                      : "bg-primary hover:opacity-90"
                  }`}
                >
                  <span
                    className={`material-symbols-outlined text-base ${
                      creating ? "animate-spin" : ""
                    }`}
                  >
                    {creating ? "refresh" : "add"}
                  </span>
                  {creating ? "Creating..." : "Generate Reading"}
                </button>
              </div>
            </div>
          </div>
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
        {readings.length === 0 && !loading && !error && (
          <div className="bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-800 dark:to-slate-900 rounded-xl p-12 text-center border border-slate-200 dark:border-slate-700">
            <span className="material-symbols-outlined text-6xl text-slate-300 dark:text-slate-600 block mb-4">
              auto_stories
            </span>
            <h2 className="text-xl font-semibold text-slate-700 dark:text-slate-300 mb-2">
              No reading exercises yet
            </h2>
            <p className="text-slate-600 dark:text-slate-400 mb-6">
              Create your first reading exercise to get started
            </p>
          </div>
        )}

        {/* Reading List */}
        {readings.length > 0 && (
          <div className="space-y-3">
            <div className="flex items-center justify-between px-1">
              <h2 className="text-sm sm:text-base font-bold text-slate-700 dark:text-slate-200">
                Your Reading Library
              </h2>
              <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
                {readings.length} items
              </span>
            </div>
            {readings.map((reading, idx) => (
              <ReadingCard
                key={reading.id}
                reading={reading}
                index={idx}
                onOpen={() => navigate(`/readings/${reading.id}`)}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
