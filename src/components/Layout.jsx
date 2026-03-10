import React, { useState } from "react";
import { Outlet, NavLink, useNavigate, useLocation } from "react-router-dom";

export default function Layout() {
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
        <NavLink to="/readings" className={navLinkClass}>
          Readings
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
  const [menuOpen, setMenuOpen] = useState(false);

  const isActive = (path) => {
    if (path === "/") return location.pathname === "/";
    return (
      location.pathname === path || location.pathname.startsWith(`${path}/`)
    );
  };

  const isMoreActive =
    isActive("/quizzes") || isActive("/settings") || isActive("/add-word");

  const navItemClass = (path) => {
    const baseClass =
      "flex flex-col items-center justify-center gap-0.5 py-1 px-2 rounded-xl transition-all";
    return isActive(path)
      ? `${baseClass} text-primary bg-primary/10`
      : `${baseClass} text-slate-600 dark:text-slate-400 hover:text-primary hover:bg-primary/5`;
  };

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 md:hidden">
      {menuOpen && (
        <div className="mx-3 mb-2 rounded-2xl border border-slate-200 dark:border-slate-700 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md shadow-xl p-2 grid grid-cols-3 gap-2">
          <button
            onClick={() => {
              setMenuOpen(false);
              navigate("/quizzes");
            }}
            className={`flex flex-col items-center justify-center gap-1 rounded-xl py-2 transition-all ${
              isActive("/quizzes")
                ? "bg-primary/10 text-primary"
                : "text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
            }`}
          >
            <span className="material-symbols-outlined text-lg">history</span>
            <span className="text-[11px] font-semibold">Quizzes</span>
          </button>
          <button
            onClick={() => {
              setMenuOpen(false);
              navigate("/settings");
            }}
            className={`flex flex-col items-center justify-center gap-1 rounded-xl py-2 transition-all ${
              isActive("/settings")
                ? "bg-primary/10 text-primary"
                : "text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
            }`}
          >
            <span className="material-symbols-outlined text-lg">settings</span>
            <span className="text-[11px] font-semibold">Settings</span>
          </button>
          <button
            onClick={() => {
              setMenuOpen(false);
              navigate("/add-word");
            }}
            className={`flex flex-col items-center justify-center gap-1 rounded-xl py-2 transition-all ${
              isActive("/add-word")
                ? "bg-primary/10 text-primary"
                : "text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
            }`}
          >
            <span className="material-symbols-outlined text-lg">add</span>
            <span className="text-[11px] font-semibold">Add Word</span>
          </button>
        </div>
      )}

      <div className="bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 shadow-lg">
        <div className="flex items-center justify-between h-16 px-2">
        {/* Home */}
        <button
          onClick={() => {
            setMenuOpen(false);
            navigate("/");
          }}
          className={navItemClass("/")}
        >
          <span
            className={`material-symbols-outlined text-xl ${isActive("/") ? "fill-1" : ""}`}
          >
            home
          </span>
          <span className="text-xs font-semibold leading-none">Home</span>
        </button>

        {/* Vocabulary */}
        <button
          onClick={() => {
            setMenuOpen(false);
            navigate("/vocabulary");
          }}
          className={navItemClass("/vocabulary")}
        >
          <span
            className={`material-symbols-outlined text-xl ${isActive("/vocabulary") ? "fill-1" : ""}`}
          >
            school
          </span>
          <span className="text-xs font-semibold leading-none">Words</span>
        </button>

        {/* Quiz */}
        <button
          onClick={() => {
            setMenuOpen(false);
            navigate("/quiz");
          }}
          className={`flex flex-col items-center justify-center px-3 py-2 rounded-2xl transition-all ${
            isActive("/quiz")
              ? "bg-primary text-white shadow-md"
              : "text-slate-700 dark:text-slate-200 bg-slate-100 dark:bg-slate-800 hover:bg-primary/10"
          }`}
        >
          <span className="material-symbols-outlined text-xl">quiz</span>
          <span className="text-[11px] font-semibold leading-none mt-0.5">
            Quiz
          </span>
        </button>

        {/* Readings */}
        <button
          onClick={() => {
            setMenuOpen(false);
            navigate("/readings");
          }}
          className={navItemClass("/readings")}
        >
          <span
            className={`material-symbols-outlined text-xl ${isActive("/readings") ? "fill-1" : ""}`}
          >
            auto_stories
          </span>
          <span className="text-xs font-semibold leading-none">Readings</span>
        </button>

        {/* More */}
        <button
          onClick={() => setMenuOpen((prev) => !prev)}
          className={`flex flex-col items-center justify-center gap-0.5 py-1 px-2 rounded-xl transition-all ${
            isMoreActive || menuOpen
              ? "text-primary bg-primary/10"
              : "text-slate-600 dark:text-slate-400 hover:text-primary hover:bg-primary/5"
          }`}
        >
          <span className="material-symbols-outlined text-xl">apps</span>
          <span className="text-xs font-semibold leading-none">More</span>
        </button>
      </div>
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
