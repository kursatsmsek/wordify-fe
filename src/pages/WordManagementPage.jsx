import React, { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { wordsApi } from "../services/api";

const PAGE_SIZE = 20;

export default function WordManagementPage() {
    const navigate = useNavigate();
    const [search, setSearch] = useState("");
    const [debouncedSearch, setDebouncedSearch] = useState("");
    const [page, setPage] = useState(0); // API is 0-indexed
    const [data, setData] = useState(null); // PageWordResponse
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [deleteConfirm, setDeleteConfirm] = useState(null);

    // Debounce search
    useEffect(() => {
        const t = setTimeout(() => { setDebouncedSearch(search); setPage(0); }, 350);
        return () => clearTimeout(t);
    }, [search]);

    // Fetch words
    useEffect(() => {
        setLoading(true);
        setError("");
        wordsApi
            .getAll({ q: debouncedSearch || undefined, page, size: PAGE_SIZE })
            .then(setData)
            .catch(() => setError("Backend'e bağlanılamadı."))
            .finally(() => setLoading(false));
    }, [debouncedSearch, page]);

    function handleDelete(id) {
        if (deleteConfirm === id) {
            wordsApi.delete(id).then(() => {
                setData((prev) =>
                    prev
                        ? {
                            ...prev,
                            content: prev.content.filter((w) => w.id !== id),
                            totalElements: prev.totalElements - 1,
                        }
                        : prev
                );
                setDeleteConfirm(null);
            }).catch(() => alert("Silme başarısız."));
        } else {
            setDeleteConfirm(id);
            setTimeout(() => setDeleteConfirm(null), 3000);
        }
    }

    function successColor(rate) {
        if (rate >= 75) return "bg-emerald-500";
        if (rate >= 50) return "bg-primary";
        if (rate >= 30) return "bg-amber-500";
        return "bg-red-500";
    }

    const words = data?.content || [];
    const totalPages = data?.totalPages || 0;
    const totalElements = data?.totalElements || 0;

    return (
        <div className="flex justify-center py-8 px-4">
            <div className="flex flex-col max-w-[1100px] w-full gap-6">

                {/* Header */}
                <div className="flex flex-wrap items-end justify-between gap-4 animate-fade-up">
                    <div className="flex flex-col gap-1.5">
                        <h1 className="text-slate-900 dark:text-slate-100 text-3xl md:text-4xl font-black leading-tight tracking-tight">
                            Word Management
                        </h1>
                        <p className="text-slate-500 dark:text-slate-400 text-sm">
                            {loading ? "Loading..." : (
                                <>You have <span className="text-primary font-semibold">{totalElements} words</span> in your list.</>
                            )}
                        </p>
                    </div>
                    <div className="flex gap-3 items-center">
                        {/* Search */}
                        <div className="flex items-center gap-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-full px-4 h-10">
                            <span className="material-symbols-outlined text-slate-400 text-lg">search</span>
                            <input
                                type="text"
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                placeholder="Search words..."
                                className="bg-transparent border-none outline-none text-sm text-slate-700 dark:text-slate-300 placeholder:text-slate-400 w-40 md:w-52"
                            />
                            {search && (
                                <button onClick={() => setSearch("")} className="text-slate-400 hover:text-slate-600">
                                    <span className="material-symbols-outlined text-base">close</span>
                                </button>
                            )}
                        </div>
                        <button
                            onClick={() => navigate("/add-word")}
                            className="flex items-center gap-1.5 px-4 py-2 bg-primary text-white text-sm font-bold rounded-full hover:opacity-90 transition-opacity shadow-sm"
                        >
                            <span className="material-symbols-outlined text-lg">add</span>
                            <span className="hidden md:inline">Add Word</span>
                        </button>
                    </div>
                </div>

                {/* Error */}
                {error && (
                    <div className="flex items-center gap-2 text-red-600 text-sm bg-red-50 dark:bg-red-900/20 px-4 py-3 rounded-xl border border-red-200 dark:border-red-800">
                        <span className="material-symbols-outlined text-base">error</span>
                        {error}
                    </div>
                )}

                {/* Table */}
                <div className="overflow-hidden rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm animate-fade-up" style={{ animationDelay: "0.05s" }}>
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-slate-50 dark:bg-slate-800/50">
                                    <th className="px-6 py-4 text-slate-500 dark:text-slate-400 text-xs font-bold uppercase tracking-wider">English Word</th>
                                    <th className="px-6 py-4 text-slate-500 dark:text-slate-400 text-xs font-bold uppercase tracking-wider">Turkish Meaning</th>
                                    <th className="px-6 py-4 text-slate-500 dark:text-slate-400 text-xs font-bold uppercase tracking-wider hidden md:table-cell">Level</th>
                                    <th className="px-6 py-4 text-slate-500 dark:text-slate-400 text-xs font-bold uppercase tracking-wider hidden lg:table-cell">Success Rate</th>
                                    <th className="px-6 py-4 text-slate-500 dark:text-slate-400 text-xs font-bold uppercase tracking-wider text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                                {loading && words.length === 0 ? (
                                    <tr>
                                        <td colSpan={5} className="px-6 py-16 text-center text-slate-400">
                                            <span className="material-symbols-outlined text-3xl block mb-2 animate-spin">refresh</span>
                                            Loading...
                                        </td>
                                    </tr>
                                ) : words.length === 0 ? (
                                    <tr>
                                        <td colSpan={5} className="px-6 py-16 text-center text-slate-400 dark:text-slate-600">
                                            <span className="material-symbols-outlined text-4xl block mb-2">search_off</span>
                                            No words found.
                                        </td>
                                    </tr>
                                ) : (
                                    words.map((word) => (
                                        <tr key={word.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors">
                                            <td className="px-6 py-4">
                                                <span className="text-slate-900 dark:text-slate-100 font-bold text-sm">{word.english}</span>
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className="text-slate-600 dark:text-slate-400 text-sm">{word.turkish}</span>
                                            </td>
                                            <td className="px-6 py-4 hidden md:table-cell">
                                                {word.level ? (
                                                    <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-primary/10 text-primary">{word.level}</span>
                                                ) : <span className="text-slate-300">—</span>}
                                            </td>
                                            <td className="px-6 py-4 hidden lg:table-cell">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-24 h-1.5 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                                                        <div
                                                            className={`h-full rounded-full ${successColor(word.successRate || 0)}`}
                                                            style={{ width: `${word.successRate || 0}%` }}
                                                        />
                                                    </div>
                                                    <span className="text-slate-700 dark:text-slate-300 text-xs font-bold w-8">{word.successRate || 0}%</span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 text-right">
                                                <button
                                                    onClick={() => handleDelete(word.id)}
                                                    className={`p-2 rounded-full transition-all text-sm flex items-center gap-1 ml-auto ${deleteConfirm === word.id
                                                            ? "bg-red-500 text-white px-3"
                                                            : "hover:bg-red-50 dark:hover:bg-red-500/10 text-slate-400 hover:text-red-500"
                                                        }`}
                                                >
                                                    <span className="material-symbols-outlined text-base">
                                                        {deleteConfirm === word.id ? "warning" : "delete"}
                                                    </span>
                                                    {deleteConfirm === word.id && <span className="text-xs font-bold whitespace-nowrap">Confirm?</span>}
                                                </button>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                    <div className="flex items-center justify-between animate-fade-up">
                        <p className="text-sm text-slate-500 dark:text-slate-400">
                            Page <span className="font-bold text-slate-700 dark:text-slate-300">{page + 1}</span> of{" "}
                            <span className="font-bold text-slate-700 dark:text-slate-300">{totalPages}</span>{" "}
                            — <span className="font-bold text-slate-700 dark:text-slate-300">{totalElements}</span> total
                        </p>
                        <div className="flex items-center gap-1">
                            <button
                                disabled={page === 0}
                                onClick={() => setPage((p) => p - 1)}
                                className="size-9 flex items-center justify-center rounded-full hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors text-slate-700 dark:text-slate-300 disabled:opacity-40"
                            >
                                <span className="material-symbols-outlined">chevron_left</span>
                            </button>
                            {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => (
                                <button
                                    key={i}
                                    onClick={() => setPage(i)}
                                    className={`size-9 flex items-center justify-center rounded-full text-sm font-bold transition-colors ${i === page
                                            ? "bg-primary text-white shadow-sm"
                                            : "hover:bg-slate-200 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300"
                                        }`}
                                >
                                    {i + 1}
                                </button>
                            ))}
                            <button
                                disabled={page >= totalPages - 1}
                                onClick={() => setPage((p) => p + 1)}
                                className="size-9 flex items-center justify-center rounded-full hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors text-slate-700 dark:text-slate-300 disabled:opacity-40"
                            >
                                <span className="material-symbols-outlined">chevron_right</span>
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
