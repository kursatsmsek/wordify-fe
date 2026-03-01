import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { wordsApi } from "../services/api";

const LEVELS = ["A1", "A2", "B1", "B2", "C1", "C2"];

const JSON_TEMPLATE = `{
  "word": "Resilient",
  "translation": "Dirençli",
  "level": "B2",
  "examples": ["She is resilient."]
}`;

export default function AddWordPage() {
    const navigate = useNavigate();

    const [form, setForm] = useState({
        english: "",
        turkish: "",
        level: "",
        examples: ["", ""],
    });
    const [jsonInput, setJsonInput] = useState("");
    const [jsonError, setJsonError] = useState("");
    const [saving, setSaving] = useState(false);
    const [saved, setSaved] = useState(false);
    const [errors, setErrors] = useState({});

    function validate() {
        const e = {};
        if (!form.english.trim()) e.english = "English word is required.";
        if (!form.turkish.trim()) e.turkish = "Turkish meaning is required.";
        return e;
    }

    async function handleSave() {
        const e = validate();
        if (Object.keys(e).length > 0) { setErrors(e); return; }

        setSaving(true);
        try {
            await wordsApi.create({
                english: form.english.trim(),
                turkish: form.turkish.trim(),
                level: form.level || undefined,
                // API expects string[] for examples
                examples: form.examples.filter((s) => s.trim()),
            });
            setSaved(true);
            setTimeout(() => navigate("/vocabulary"), 1200);
        } catch (err) {
            setErrors({ api: "Kaydetme başarısız. Sunucu çalışıyor mu?" });
        } finally {
            setSaving(false);
        }
    }

    function handleExampleChange(idx, value) {
        const updated = [...form.examples];
        updated[idx] = value;
        setForm((f) => ({ ...f, examples: updated }));
    }

    function addExample() {
        setForm((f) => ({ ...f, examples: [...f.examples, ""] }));
    }

    function removeExample(idx) {
        setForm((f) => ({ ...f, examples: f.examples.filter((_, i) => i !== idx) }));
    }

    function parseJSON() {
        try {
            const parsed = JSON.parse(jsonInput);
            setForm({
                english: parsed.word || "",
                turkish: parsed.translation || "",
                level: parsed.level || "",
                examples: parsed.examples || ["", ""],
            });
            setJsonError("");
            setErrors({});
        } catch {
            setJsonError("Invalid JSON. Please check the format.");
        }
    }

    return (
        <div className="flex justify-center py-8 px-4">
            <div className="max-w-[960px] w-full">
                {/* Breadcrumbs */}
                <div className="flex items-center gap-2 mb-6 text-sm">
                    <button onClick={() => navigate("/vocabulary")} className="text-slate-500 dark:text-slate-400 hover:text-primary transition-colors font-medium">
                        Vocabulary
                    </button>
                    <span className="material-symbols-outlined text-sm text-slate-400">chevron_right</span>
                    <span className="text-slate-900 dark:text-slate-100 font-medium">Add New Entry</span>
                </div>

                <div className="mb-8 animate-fade-up">
                    <h1 className="text-slate-900 dark:text-slate-100 text-4xl font-black leading-tight tracking-tight mb-1">Add New Entry</h1>
                    <p className="text-slate-500 dark:text-slate-400 text-sm">Manually add a word or import via JSON payload.</p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Form */}
                    <div className="lg:col-span-2 space-y-6 animate-fade-up" style={{ animationDelay: "0.05s" }}>
                        <section className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
                            <h2 className="text-slate-900 dark:text-slate-100 text-xl font-bold mb-6 flex items-center gap-2">
                                <span className="material-symbols-outlined text-primary">edit_note</span>
                                Word Details
                            </h2>
                            <div className="space-y-5">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                    <Field label="English Word" required error={errors.english}>
                                        <input
                                            type="text" value={form.english}
                                            onChange={(e) => { setForm((f) => ({ ...f, english: e.target.value })); setErrors((er) => ({ ...er, english: "" })); }}
                                            placeholder="e.g. Resilient"
                                            className={inputClass(errors.english)}
                                        />
                                    </Field>
                                    <Field label="Turkish Meaning" required error={errors.turkish}>
                                        <input
                                            type="text" value={form.turkish}
                                            onChange={(e) => { setForm((f) => ({ ...f, turkish: e.target.value })); setErrors((er) => ({ ...er, turkish: "" })); }}
                                            placeholder="e.g. Dirençli"
                                            className={inputClass(errors.turkish)}
                                        />
                                    </Field>
                                </div>

                                <Field label="Word Level">
                                    <select value={form.level} onChange={(e) => setForm((f) => ({ ...f, level: e.target.value }))} className={inputClass()}>
                                        <option value="">Select proficiency level</option>
                                        {LEVELS.map((l) => <option key={l} value={l}>{l} — {levelLabel(l)}</option>)}
                                    </select>
                                </Field>

                                <div className="space-y-3">
                                    <label className="text-slate-700 dark:text-slate-300 text-sm font-semibold block">Example Sentences</label>
                                    {form.examples.map((ex, idx) => (
                                        <div key={idx} className="flex gap-2 items-center">
                                            <input
                                                type="text" value={ex}
                                                onChange={(e) => handleExampleChange(idx, e.target.value)}
                                                placeholder={`Sentence ${idx + 1}`}
                                                className={inputClass()}
                                            />
                                            {form.examples.length > 1 && (
                                                <button onClick={() => removeExample(idx)} className="p-2 text-slate-400 hover:text-red-500 transition-colors">
                                                    <span className="material-symbols-outlined">delete</span>
                                                </button>
                                            )}
                                        </div>
                                    ))}
                                    <button onClick={addExample} className="flex items-center gap-2 text-primary text-sm font-bold mt-1 hover:underline">
                                        <span className="material-symbols-outlined text-sm">add_circle</span>
                                        Add another sentence
                                    </button>
                                </div>

                                {errors.api && (
                                    <p className="text-red-500 text-sm flex items-center gap-1">
                                        <span className="material-symbols-outlined text-base">error</span>
                                        {errors.api}
                                    </p>
                                )}
                            </div>
                        </section>

                        <div className="flex justify-end gap-3">
                            <button onClick={() => navigate("/vocabulary")} className="px-6 py-3 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 font-bold hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors text-sm">
                                Cancel
                            </button>
                            <button
                                onClick={handleSave}
                                disabled={saving}
                                className={`px-8 py-3 rounded-xl font-bold text-sm transition-all flex items-center gap-2 shadow-sm disabled:opacity-60 ${saved ? "bg-green-500 text-white" : "bg-primary text-white hover:opacity-90"}`}
                            >
                                <span className="material-symbols-outlined text-sm">{saved ? "check_circle" : saving ? "refresh" : "save"}</span>
                                {saved ? "Saved!" : saving ? "Saving..." : "Save Word"}
                            </button>
                        </div>
                    </div>

                    {/* Sidebar */}
                    <div className="space-y-5 animate-fade-up" style={{ animationDelay: "0.1s" }}>
                        <section className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
                            <h2 className="text-slate-900 dark:text-slate-100 text-lg font-bold mb-2 flex items-center gap-2">
                                <span className="material-symbols-outlined text-primary text-xl">code</span>
                                JSON Import
                            </h2>
                            <p className="text-slate-500 dark:text-slate-400 text-xs mb-4">Paste a JSON payload to auto-fill the form.</p>
                            <textarea
                                value={jsonInput}
                                onChange={(e) => { setJsonInput(e.target.value); setJsonError(""); }}
                                placeholder={JSON_TEMPLATE}
                                rows={10}
                                className="w-full font-mono text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 text-slate-700 dark:text-slate-300 focus:border-primary outline-none p-3 resize-none"
                            />
                            {jsonError && <p className="text-red-500 text-xs mt-1">{jsonError}</p>}
                            <button onClick={parseJSON} className="w-full mt-3 py-2 bg-primary/10 text-primary rounded-xl font-bold text-sm hover:bg-primary/20 transition-colors">
                                Parse JSON
                            </button>
                        </section>

                        <section className="bg-primary/5 dark:bg-primary/10 p-6 rounded-2xl border border-primary/10 dark:border-primary/20">
                            <h3 className="text-primary font-bold text-xs mb-3 uppercase tracking-wider">Quick Tips</h3>
                            <ul className="text-slate-600 dark:text-slate-400 text-xs space-y-2.5">
                                {["Use clear, concise sentences.", "Levels help target your quizzes.", "JSON import is best for bulk adding."].map((tip) => (
                                    <li key={tip} className="flex gap-2 items-start">
                                        <span className="material-symbols-outlined text-primary text-sm mt-0.5">check_circle</span>
                                        {tip}
                                    </li>
                                ))}
                            </ul>
                        </section>
                    </div>
                </div>
            </div>
        </div>
    );
}

function Field({ label, required, error, children }) {
    return (
        <div className="flex flex-col gap-1.5">
            <label className="text-slate-700 dark:text-slate-300 text-sm font-semibold">
                {label} {required && <span className="text-red-500">*</span>}
            </label>
            {children}
            {error && <p className="text-red-500 text-xs">{error}</p>}
        </div>
    );
}

function inputClass(error) {
    return `w-full rounded-xl border p-3 text-sm bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-colors ${error ? "border-red-400" : "border-slate-200 dark:border-slate-700"}`;
}

function levelLabel(l) {
    return { A1: "Beginner", A2: "Elementary", B1: "Intermediate", B2: "Upper Intermediate", C1: "Advanced", C2: "Mastery" }[l] || l;
}
