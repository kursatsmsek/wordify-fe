import React, { useState } from "react";
import { Outlet, NavLink, useNavigate, useLocation } from "react-router-dom";
import { useApp } from "../context/AppContext";

export default function Layout() {
  const { words } = useApp();

  return (
    <div className="relative flex min-h-screen w-full flex-col bg-background-light dark:bg-background-dark font-display text-slate-900 dark:text-slate-100 antialiased">
      <Navbar />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}

function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinkClass = ({ isActive }) =>
    isActive
      ? "text-primary text-sm font-semibold border-b-2 border-primary pb-0.5"
      : "text-slate-600 dark:text-slate-400 text-sm font-medium hover:text-primary dark:hover:text-primary transition-colors";

  const mobileNavLinkClass = ({ isActive }) =>
    isActive
      ? "text-primary font-semibold block px-4 py-2"
      : "text-slate-600 dark:text-slate-400 font-medium hover:text-primary dark:hover:text-primary transition-colors block px-4 py-2";

  const handleMobileNavClick = (path) => {
    navigate(path);
    setMobileMenuOpen(false);
  };

  return (
    <>
      <header className="sticky top-0 z-50 flex items-center justify-between whitespace-nowrap border-b border-solid border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/95 backdrop-blur-sm px-6 md:px-10 py-3 shadow-sm">
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

        {/* Nav links - Desktop */}
        <nav className="hidden md:flex items-center gap-8">
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

        {/* Right side */}
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate("/add-word")}
            className="hidden md:flex items-center gap-1.5 px-4 py-2 bg-primary text-white text-sm font-bold rounded-lg hover:opacity-90 transition-opacity shadow-sm"
          >
            <span className="material-symbols-outlined text-sm">add</span>
            Add Word
          </button>

          {/* Hamburger Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden flex items-center justify-center"
          >
            <span className="material-symbols-outlined">
              {mobileMenuOpen ? "close" : "menu"}
            </span>
          </button>
        </div>
      </header>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 shadow-sm">
          <nav className="flex flex-col divide-y divide-slate-200 dark:divide-slate-800">
            <a
              onClick={() => handleMobileNavClick("/")}
              className={mobileNavLinkClass({
                isActive: location.pathname === "/",
              })}
            >
              Home
            </a>
            <a
              onClick={() => handleMobileNavClick("/vocabulary")}
              className={mobileNavLinkClass({
                isActive: location.pathname === "/vocabulary",
              })}
            >
              Vocabulary
            </a>
            <a
              onClick={() => handleMobileNavClick("/quiz")}
              className={mobileNavLinkClass({
                isActive: location.pathname === "/quiz",
              })}
            >
              Quiz
            </a>
            <a
              onClick={() => handleMobileNavClick("/quizzes")}
              className={mobileNavLinkClass({
                isActive: location.pathname === "/quizzes",
              })}
            >
              Quizzes
            </a>
            <a
              onClick={() => handleMobileNavClick("/settings")}
              className={mobileNavLinkClass({
                isActive: location.pathname === "/settings",
              })}
            >
              Settings
            </a>
            <button
              onClick={() => handleMobileNavClick("/add-word")}
              className="flex items-center gap-2 px-4 py-3 bg-primary text-white font-bold hover:opacity-90 transition-opacity w-full text-left"
            >
              <span className="material-symbols-outlined text-sm">add</span>
              Add Word
            </button>
          </nav>
        </div>
      )}
    </>
  );
}

function Footer() {
  return (
    <footer className="py-8 text-center border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
      <p className="text-slate-400 dark:text-slate-600 text-xs">
        2026 © Wordify
      </p>
    </footer>
  );
}
