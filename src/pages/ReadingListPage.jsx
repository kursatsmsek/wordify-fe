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
      className="w-full text-left rounded-2xl border border-slate-200 dark:border-slate-700 bg-white/95 dark:bg-slate-900/90 p-5 sm:p-6 shadow-sm hover:shadow-lg hover:-translate-y-0.5 transition-all animate-fade-up"
      style={{ animationDelay: `${index * 50}ms` }}
    >
      <div className="flex items-start justify-between gap-4 mb-3">
        <div className="min-w-0">
          <p className="text-[11px] uppercase tracking-[0.16em] text-slate-500 dark:text-slate-400 mb-2">
            Reading #{reading.id}
          </p>
          <h3 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white leading-tight">
            {title}
          </h3>
        </div>
        <span className="material-symbols-outlined text-slate-400 bg-slate-100 dark:bg-slate-800 p-2 rounded-xl">
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
            {getRelativeDate(reading.created_at)} ({formatDate(reading.created_at)})
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
    5,
    Math.min(20, Number(settings?.readingCount) || 5),
  );
  const [readings, setReadings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [error, setError] = useState("");

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
        instruction: "",
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
          <div className="flex flex-col items-start gap-2">
            <button
              onClick={handleNewReading}
              disabled={creating}
              className="bg-primary hover:opacity-90 text-white px-6 py-3 rounded-xl font-bold text-sm transition-all flex items-center gap-2 shadow-sm"
            >
              <span className={`material-symbols-outlined text-base ${creating ? "animate-spin" : ""}`}>
                {creating ? "refresh" : "add"}
              </span>
              {creating ? "Creating..." : "New Reading"}
            </button>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Uses {readingCount} source words (Settings)
            </p>
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
