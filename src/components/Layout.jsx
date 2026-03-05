import React from "react";
import { Outlet, NavLink, useNavigate, useLocation } from "react-router-dom";
import { useApp } from "../context/AppContext";

export default function Layout() {
  const { words } = useApp();

  return (
    <div className="relative flex min-h-screen w-full flex-col bg-background-light dark:bg-background-dark font-display text-slate-900 dark:text-slate-100 antialiased">
      <Navbar />
      <main className="flex-1 mb-20 md:mb-0">
        <Outlet />
      </main>
      <Footer />
      <BottomNav />
    </div>
  );
}

function Navbar() {
  const navigate = useNavigate();

  const navLinkClass = ({ isActive }) =>
    isActive
      ? "text-primary text-sm font-semibold border-b-2 border-primary pb-0.5"
      : "text-slate-600 dark:text-slate-400 text-sm font-medium hover:text-primary dark:hover:text-primary transition-colors";

  return (
    <header className="sticky top-0 z-40 hidden md:flex items-center justify-between whitespace-nowrap border-b border-solid border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/95 backdrop-blur-sm px-10 py-3 shadow-sm">
      {/* Logo */}
      <div
        className="flex items-center gap-3 cursor-pointer"
        onClick={() => navigate("/")}
      >
        <div className="size-8 bg-primary/10 rounded-lg flex items-center justify-center">
          <span className="material-symbols-outlined text-primary">
            menu_book
          </span>
        </div>
        <h2 className="text-slate-900 dark:text-slate-100 text-lg font-bold leading-tight tracking-tight">
          Wordify
        </h2>
      </div>

      {/* Nav links */}
      <nav className="flex items-center gap-8">
        <NavLink to="/" end className={navLinkClass}>
          Home
        </NavLink>
        <NavLink to="/vocabulary" className={navLinkClass}>
          Vocabulary
        </NavLink>
        <NavLink to="/quiz" className={navLinkClass}>
          Quiz
        </NavLink>
        <NavLink to="/quizzes" className={navLinkClass}>
          Quizzes
        </NavLink>
        <NavLink to="/settings" className={navLinkClass}>
          Settings
        </NavLink>
      </nav>

      {/* Right side - Add Word Button */}
      <button
        onClick={() => navigate("/add-word")}
        className="flex items-center gap-1.5 px-4 py-2 bg-primary text-white text-sm font-bold rounded-lg hover:opacity-90 transition-opacity shadow-sm"
      >
        <span className="material-symbols-outlined text-sm">add</span>
        Add Word
      </button>
    </header>
  );
}

function BottomNav() {
  const navigate = useNavigate();
  const location = useLocation();

  const isActive = (path) => location.pathname === path;

  const navItemClass = (path) => {
    const baseClass =
      "flex flex-col items-center justify-center gap-0.5 py-1 px-2 rounded-lg transition-all";
    return isActive(path)
      ? `${baseClass} text-primary bg-primary/10`
      : `${baseClass} text-slate-600 dark:text-slate-400 hover:text-primary hover:bg-primary/5`;
  };

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 md:hidden bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 shadow-lg">
      <div className="flex items-center justify-around h-16 px-1">
        {/* Home */}
        <button onClick={() => navigate("/")} className={navItemClass("/")}>
          <span
            className={`material-symbols-outlined text-xl ${isActive("/") ? "fill-1" : ""}`}
          >
            home
          </span>
          <span className="text-xs font-semibold leading-none">Home</span>
        </button>

        {/* Vocabulary */}
        <button
          onClick={() => navigate("/vocabulary")}
          className={navItemClass("/vocabulary")}
        >
          <span
            className={`material-symbols-outlined text-xl ${isActive("/vocabulary") ? "fill-1" : ""}`}
          >
            school
          </span>
          <span className="text-xs font-semibold leading-none">Words</span>
        </button>

        {/* Quiz - Center floating button style */}
        <button
          onClick={() => navigate("/quiz")}
          className="flex flex-col items-center justify-center -mt-1 bg-primary text-white p-3 rounded-full shadow-lg hover:opacity-90 transition-opacity relative z-50"
        >
          <span className="material-symbols-outlined text-xl fill-1">quiz</span>
        </button>

        {/* History */}
        <button
          onClick={() => navigate("/quizzes")}
          className={navItemClass("/quizzes")}
        >
          <span
            className={`material-symbols-outlined text-xl ${isActive("/quizzes") ? "fill-1" : ""}`}
          >
            history
          </span>
          <span className="text-xs font-semibold leading-none">History</span>
        </button>

        {/* Settings */}
        <button
          onClick={() => navigate("/settings")}
          className={navItemClass("/settings")}
        >
          <span
            className={`material-symbols-outlined text-xl ${isActive("/settings") ? "fill-1" : ""}`}
          >
            settings
          </span>
          <span className="text-xs font-semibold leading-none">Settings</span>
        </button>
      </div>
    </nav>
  );
}

function Footer() {
  return (
    <footer className="hidden md:block py-8 text-center border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
      <p className="text-slate-400 dark:text-slate-600 text-xs">
        2026 © Wordify
      </p>
    </footer>
  );
}
