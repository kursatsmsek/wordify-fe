import React from "react";
import { Outlet, NavLink, useNavigate } from "react-router-dom";
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

    const navLinkClass = ({ isActive }) =>
        isActive
            ? "text-primary text-sm font-semibold border-b-2 border-primary pb-0.5"
            : "text-slate-600 dark:text-slate-400 text-sm font-medium hover:text-primary dark:hover:text-primary transition-colors";

    return (
        <header className="sticky top-0 z-50 flex items-center justify-between whitespace-nowrap border-b border-solid border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/95 backdrop-blur-sm px-6 md:px-10 py-3 shadow-sm">
            {/* Logo */}
            <div
                className="flex items-center gap-3 cursor-pointer"
                onClick={() => navigate("/")}
            >
                <div className="size-8 bg-primary/10 rounded-lg flex items-center justify-center">
                    <span className="material-symbols-outlined text-primary">menu_book</span>
                </div>
                <h2 className="text-slate-900 dark:text-slate-100 text-lg font-bold leading-tight tracking-tight">
                    Wordify
                </h2>
            </div>

            {/* Nav links */}
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
                <div className="bg-primary/10 rounded-full size-10 flex items-center justify-center text-primary border border-primary/20">
                    <span className="material-symbols-outlined">person</span>
                </div>
            </div>
        </header>
    );
}

function Footer() {
    return (
        <footer className="py-8 text-center border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
            <p className="text-slate-400 dark:text-slate-600 text-xs">
                © 2024 Wordify. Keep learning every day.
            </p>
        </footer>
    );
}
