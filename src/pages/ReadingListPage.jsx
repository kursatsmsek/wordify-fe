import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useApp } from "../context/AppContext";

function getRelativeDate(dateString) {
  const readingDate = new Date(dateString);
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

export default function ReadingListPage() {
  const navigate = useNavigate();
  const { settings } = useApp();
  const { colorPalette } = settings || {};
  const [readings, setReadings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchReadings() {
      setLoading(true);
      setError("");
      try {
        // TODO: Replace with actual API call when backend is ready
        // const res = await readingsApi.getAll({ page: 0, size: 20 });
        // setReadings(res.content || []);
        setReadings([]);
      } catch {
        setError("Failed to fetch readings.");
      } finally {
        setLoading(false);
      }
    }
    fetchReadings();
  }, []);

  const handleNewReading = () => {
    // TODO: This will trigger the AI call to generate reading passage
    navigate("/readings/new");
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
          <button
            onClick={handleNewReading}
            className="bg-primary hover:opacity-90 text-white px-6 py-3 rounded-xl font-bold text-sm transition-all flex items-center gap-2 shadow-sm"
          >
            <span className="material-symbols-outlined text-base">add</span>
            New Reading
          </button>
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
          <div className="divide-y divide-slate-200 dark:divide-slate-700">
            {readings.map((reading, idx) => (
              <button
                key={reading.id}
                onClick={() => navigate(`/readings/${reading.id}`)}
                className="w-full card animate-fade-up py-4 sm:py-6 text-left hover:shadow-md transition-all"
                style={{ animationDelay: `${idx * 50}ms` }}
              >
                <div className="px-4 sm:px-6">
                  <div className="flex justify-between items-start gap-4 mb-3">
                    <h3 className="text-base sm:text-lg font-semibold text-slate-900 dark:text-white flex-1">
                      {reading.title}
                    </h3>
                    <span className="material-symbols-outlined text-slate-400">
                      arrow_forward
                    </span>
                  </div>
                  <p className="text-sm text-slate-600 dark:text-slate-400 line-clamp-2 mb-3">
                    {reading.preview}
                  </p>
                  <div className="flex justify-between items-center text-xs text-slate-500 dark:text-slate-500">
                    <span>{reading.wordCount} words</span>
                    <span>{getRelativeDate(reading.createdAt)}</span>
                  </div>
                </div>
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
