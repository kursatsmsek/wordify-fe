import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Layout from "./components/Layout";
import HomePage from "./pages/HomePage";
import QuizPage from "./pages/QuizPage";
import QuizSummaryPage from "./pages/QuizSummaryPage";
import WordManagementPage from "./pages/WordManagementPage";
import AddWordPage from "./pages/AddWordPage";
import SettingsPage from "./pages/SettingsPage";
import QuizzesPage from "./pages/QuizzesPage";
import ReadingListPage from "./pages/ReadingListPage";
import ReadingDetailPage from "./pages/ReadingDetailPage";
import "./App.css";

export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<HomePage />} />
        <Route path="/quiz" element={<QuizPage />} />
        <Route path="/quiz-summary" element={<QuizSummaryPage />} />
        <Route path="/vocabulary" element={<WordManagementPage />} />
        <Route path="/add-word" element={<AddWordPage />} />
        <Route path="/settings" element={<SettingsPage />} />
        <Route path="/quizzes" element={<QuizzesPage />} />
        <Route path="/readings" element={<ReadingListPage />} />
        <Route path="/readings/:id" element={<ReadingDetailPage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Route>
    </Routes>
  );
}
