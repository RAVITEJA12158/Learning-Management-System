import { useState } from 'react';
import { useTheme } from '../context/ThemeContext';

function Settings() {
  const { theme, isDark, toggleTheme } = useTheme();
  const [emailNotifs, setEmailNotifs] = useState(true);
  const [savedFeedback, setSavedFeedback] = useState(false);

  const handleSave = () => {
    setSavedFeedback(true);
    setTimeout(() => setSavedFeedback(false), 2500);
  };

  return (
    <main className="mx-auto max-w-5xl px-5 py-10 sm:px-8 w-full font-sans">
      <div className="mb-8">
        <h1 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight transition-colors">
          Account Settings
        </h1>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1 transition-colors">
          Manage your platform preferences and notification options
        </p>
      </div>

      {savedFeedback && (
        <div className="mb-6 p-4 rounded-2xl border border-emerald-200 bg-emerald-50 dark:bg-emerald-950/40 dark:border-emerald-800 text-emerald-700 dark:text-emerald-300 text-xs font-bold transition-all">
          ✓ Preferences saved successfully!
        </div>
      )}

      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 p-6 sm:p-8 shadow-xs space-y-6 transition-colors duration-200">
        
        {/* Email Notifications */}
        <div className="flex items-center justify-between pb-6 border-b border-slate-100 dark:border-slate-800 transition-colors">
          <div>
            <h3 className="text-sm font-bold text-slate-900 dark:text-white transition-colors">
              Email Notifications
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 transition-colors">
              Receive updates on course assignments, quizzes, and grade publications
            </p>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={emailNotifs}
              onChange={(e) => setEmailNotifs(e.target.checked)}
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer dark:bg-slate-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-slate-600 peer-checked:bg-blue-600"></div>
          </label>
        </div>

        {/* Appearance Mode (Light & Dark Theme Toggle) */}
        <div className="flex items-center justify-between pb-6 border-b border-slate-100 dark:border-slate-800 transition-colors">
          <div>
            <h3 className="text-sm font-bold text-slate-900 dark:text-white transition-colors">
              Appearance Mode
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 transition-colors">
              Toggle between light theme and sleek dark mode
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={toggleTheme}
              className={`flex items-center gap-2.5 px-4 py-2 text-xs font-bold rounded-xl border transition-all shadow-xs ${
                isDark
                  ? 'border-blue-500/40 bg-slate-800 text-blue-400 hover:bg-slate-700'
                  : 'border-slate-200 bg-slate-50 text-slate-700 hover:bg-slate-100'
              }`}
              title="Click to toggle theme"
            >
              {isDark ? (
                <>
                  <svg className="w-4 h-4 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                  </svg>
                  <span>🌙 Dark Mode</span>
                </>
              ) : (
                <>
                  <svg className="w-4 h-4 text-amber-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                  </svg>
                  <span>☀️ Light Mode</span>
                </>
              )}
            </button>
          </div>
        </div>

        <div className="pt-2">
          <button
            onClick={handleSave}
            className="bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs px-6 py-3 rounded-xl transition shadow-xs"
          >
            Save Preferences
          </button>
        </div>
      </div>
    </main>
  );
}

export default Settings;
