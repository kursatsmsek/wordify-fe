import React, { useEffect, useState } from "react";
import axios from "axios";

export default function QuizzesPage() {
  const [quizzes, setQuizzes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchQuizzes() {
      setLoading(true);
      setError("");
      try {
        const res = await axios.get(
          "http://localhost:8080/api/quizzes?page=0&size=20",
        );
        setQuizzes(res.data.content || []);
      } catch (err) {
        setError("Failed to fetch quizzes.");
      } finally {
        setLoading(false);
      }
    }
    fetchQuizzes();
  }, []);

  return (
    <div className="flex flex-col items-center py-10 px-4">
      <div className="w-full max-w-2xl">
        <h1 className="text-3xl font-bold mb-6 text-primary">Quizzes</h1>
        {loading && <p>Loading...</p>}
        {error && <p className="text-red-500">{error}</p>}
        <div className="flex flex-col gap-4">
          {quizzes.length === 0 && !loading && <p>No quizzes found.</p>}
          {quizzes.map((quiz) => (
            <div
              key={quiz.id}
              className="border rounded-xl p-4 bg-white dark:bg-slate-900 shadow-sm flex flex-col gap-2"
            >
              <div className="flex justify-between items-center">
                <span className="font-semibold text-primary">
                  {quiz.quizType}
                </span>
                <span className="text-xs text-slate-500">
                  {new Date(quiz.quizDate).toLocaleString()}
                </span>
              </div>
              <div className="flex gap-6 text-sm">
                <span>
                  Direction: <b>{quiz.quizDirection}</b>
                </span>
                <span>
                  Total: <b>{quiz.totalCount}</b>
                </span>
                <span>
                  Correct: <b>{quiz.correctCount}</b>
                </span>
                <span>
                  Wrong: <b>{quiz.wrongCount}</b>
                </span>
                <span>
                  Score: <b>{quiz.scorePercent}%</b>
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
