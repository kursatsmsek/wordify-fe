import React, { useState } from "react";
import { useApp } from "../context/AppContext";
import { DEFAULT_SETTINGS, COLOR_PALETTES } from "../data/mockWords";

export default function SettingsPage() {
  const { settings, updateSettings } = useApp();
  const [localSettings, setLocalSettings] = useState({ ...settings });
  const [saved, setSaved] = useState(false);

  function handleToggle(key) {
    setLocalSettings((s) => ({ ...s, [key]: !s[key] }));
    setSaved(false);
  }

  function handleQuizDirection(dir) {
    setLocalSettings((s) => ({ ...s, quizDirection: dir }));
    setSaved(false);
  }

  function handleColor(value) {
    setLocalSettings((s) => ({ ...s, colorPalette: value }));
    setSaved(false);
  }

  function handleSave() {
    updateSettings(localSettings);
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  }

  function handleReset() {
    setLocalSettings({ ...DEFAULT_SETTINGS });
    updateSettings(DEFAULT_SETTINGS);
    setSaved(false);
  }

  return (
    <div className="flex justify-center py-10 px-4">
      <div className="flex flex-col max-w-[800px] w-full gap-2">
        {/* Header */}
        <div className="flex flex-col gap-1.5 mb-6 animate-fade-up">
          <h1 className="text-slate-900 dark:text-white text-4xl font-extrabold tracking-tight">
            App Settings
          </h1>
          <p className="text-slate-500 dark:text-slate-400 text-sm">
            Personalize your learning experience and application appearance.
          </p>
        </div>

        <div className="flex flex-col gap-6">
          {/* Learning Preferences */}
          <SettingSection icon="school" title="Learning Preferences">
            {/* Quiz Mode */}
            <SettingRow
              title="Quiz Mode"
              description="Choose how you want to answer quiz questions: typing or multiple choice."
            >
              <div className="flex bg-slate-100 dark:bg-slate-800 p-1 rounded-xl gap-1">
                {[
                  { value: "TYPING", label: "Typing" },
                  { value: "MULTIPLE_CHOICE", label: "Multiple Choice" },
                ].map((mode) => (
                  <button
                    key={mode.value}
                    onClick={() => {
                      setLocalSettings((s) => ({ ...s, quizMode: mode.value }));
                      setSaved(false);
                    }}
                    className={`px-4 py-2 rounded-lg text-sm font-bold transition-all ${
                      localSettings.quizMode === mode.value
                        ? "bg-white dark:bg-slate-700 shadow-sm text-primary"
                        : "text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-300"
                    }`}
                  >
                    {mode.label}
                  </button>
                ))}
              </div>
            </SettingRow>
            {/* Typing Mode (legacy, can be hidden or kept for backward compatibility) */}
            {/* <SettingRow
                            title="Typing Mode"
                            description="Require manual keyboard entry for quiz answers to strengthen spelling memory."
                        >
                            <Toggle
                                checked={localSettings.typingMode}
                                onChange={() => handleToggle("typingMode")}
                            />
                        </SettingRow> */}

            {/* Quiz Direction */}
            <SettingRow
              title="Quiz Direction"
              description="Choose the translation flow for your flashcards."
            >
              <div className="flex bg-slate-100 dark:bg-slate-800 p-1 rounded-xl gap-1">
                {["TR_TO_EN", "EN_TO_TR"].map((dir) => (
                  <button
                    key={dir}
                    onClick={() => handleQuizDirection(dir)}
                    className={`px-4 py-2 rounded-lg text-sm font-bold transition-all ${
                      localSettings.quizDirection === dir
                        ? "bg-white dark:bg-slate-700 shadow-sm text-primary"
                        : "text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-300"
                    }`}
                  >
                    {dir === "TR_TO_EN" ? "TR → EN" : "EN → TR"}
                  </button>
                ))}
              </div>
            </SettingRow>
          </SettingSection>

          {/* Appearance */}
          <SettingSection icon="palette" title="Appearance">
            {/* Dark Mode */}
            <SettingRow
              title="Dark Theme"
              description="Switch between light and dark display modes for better visibility."
            >
              <Toggle
                checked={localSettings.darkMode}
                onChange={() => handleToggle("darkMode")}
              />
            </SettingRow>

            {/* Color Palette */}
            <SettingRow
              title="Color Palette"
              description="Select the primary accent color for the interface."
            >
              <div className="flex gap-3 flex-wrap">
                {COLOR_PALETTES.map((palette) => (
                  <button
                    key={palette.value}
                    onClick={() => handleColor(palette.value)}
                    title={palette.name}
                    className={`size-8 rounded-full transition-all hover:scale-110 ${
                      localSettings.colorPalette === palette.value
                        ? "ring-4 ring-offset-2 dark:ring-offset-slate-900 scale-110"
                        : ""
                    }`}
                    style={{
                      backgroundColor: palette.value,
                      ringColor: palette.value,
                      boxShadow:
                        localSettings.colorPalette === palette.value
                          ? `0 0 0 3px ${palette.value}40`
                          : "none",
                      outline:
                        localSettings.colorPalette === palette.value
                          ? `3px solid ${palette.value}`
                          : "none",
                      outlineOffset: "3px",
                    }}
                  />
                ))}
              </div>
            </SettingRow>
          </SettingSection>
        </div>

        {/* Footer actions */}
        <div className="mt-8 flex justify-end gap-4 animate-fade-up">
          <button
            onClick={handleReset}
            className="px-6 py-3 rounded-xl text-slate-600 dark:text-slate-400 font-bold hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors text-sm"
          >
            Reset Defaults
          </button>
          <button
            onClick={handleSave}
            className={`px-8 py-3 rounded-xl font-bold text-sm shadow-sm transition-all hover:-translate-y-0.5 flex items-center gap-2 ${
              saved
                ? "bg-green-500 text-white"
                : "bg-primary text-white hover:opacity-90"
            }`}
          >
            <span className="material-symbols-outlined text-sm">
              {saved ? "check_circle" : "save"}
            </span>
            {saved ? "Saved!" : "Save Changes"}
          </button>
        </div>
      </div>
    </div>
  );
}

function SettingSection({ icon, title, children }) {
  return (
    <div className="flex flex-col gap-3 animate-fade-up">
      <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400 uppercase tracking-widest text-xs font-bold px-1">
        <span className="material-symbols-outlined text-sm">{icon}</span>
        {title}
      </div>
      <div className="flex flex-col gap-3">{children}</div>
    </div>
  );
}

function SettingRow({ title, description, children }) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 hover:border-primary/30 transition-colors">
      <div className="flex flex-col gap-0.5">
        <p className="text-slate-900 dark:text-white text-base font-bold">
          {title}
        </p>
        <p className="text-slate-500 dark:text-slate-400 text-sm">
          {description}
        </p>
      </div>
      <div className="flex-shrink-0">{children}</div>
    </div>
  );
}

function Toggle({ checked, onChange }) {
  return (
    <label
      className="relative flex h-7 w-13 cursor-pointer items-center rounded-full p-1 transition-colors"
      style={{
        backgroundColor: checked ? "var(--color-primary)" : "#e2e8f0",
        width: "52px",
      }}
    >
      <input
        type="checkbox"
        className="sr-only"
        checked={checked}
        onChange={onChange}
      />
      <div
        className="h-5 w-5 rounded-full bg-white shadow-md transition-transform duration-200"
        style={{ transform: checked ? "translateX(24px)" : "translateX(0)" }}
      />
    </label>
  );
}
