import { useState } from 'react';
import { useTheme } from '../context/ThemeContext';
import { SunIcon, MoonIcon } from '../components/common/Icons';

function Settings() {
  const { isDark, toggleTheme } = useTheme();
  const [emailNotifs, setEmailNotifs] = useState(true);
  const [savedFeedback, setSavedFeedback] = useState(false);

  const handleSave = () => {
    setSavedFeedback(true);
    setTimeout(() => setSavedFeedback(false), 2500);
  };

  return (
    <main className="mx-auto max-w-[1440px] px-5 py-10 sm:px-8 w-full font-sans">
      <div className="mb-8">
        <h1 className="text-3xl font-black text-slate-900 dark:text-zinc-50 tracking-tight transition-colors">
          Account Settings
        </h1>
        <p className="text-sm text-slate-500 dark:text-zinc-400 mt-1 transition-colors">
          Manage your platform preferences and notification options
        </p>
      </div>

      {savedFeedback && (
        <div className="mb-6 p-4 rounded-2xl border border-emerald-200 bg-emerald-50 dark:bg-emerald-950/40 dark:border-emerald-800 text-emerald-700 dark:text-emerald-300 text-xs font-bold transition-all">
          ✓ Preferences saved successfully!
        </div>
      )}

      <div className="bg-white dark:bg-white/[0.02] backdrop-blur-xl rounded-2xl border border-slate-200/80 dark:border-white/5 p-6 sm:p-8 shadow-xs dark:shadow-md dark:shadow-black/40 space-y-6 transition-colors duration-200">
        
        {/* Email Notifications */}
        <div className="flex items-center justify-between pb-6 border-b border-slate-100 dark:border-white/5 transition-colors">
          <div>
            <h3 className="text-sm font-bold text-slate-900 dark:text-white transition-colors">
              Email Notifications
            </h3>
            <p className="text-xs text-slate-500 dark:text-gray-400 mt-0.5 transition-colors">
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
            <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer dark:bg-gray-800 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-700 peer-checked:bg-blue-600 dark:peer-checked:bg-gradient-to-r dark:peer-checked:from-cyan-500 dark:peer-checked:to-blue-600"></div>
          </label>
        </div>

        {/* Appearance Mode (Light & Dark Theme Toggle) */}
        <div className="flex items-center justify-between pb-6 border-b border-slate-100 dark:border-white/5 transition-colors">
          <div>
            <h3 className="text-sm font-bold text-slate-900 dark:text-white transition-colors">
              Appearance Mode
            </h3>
            <p className="text-xs text-slate-500 dark:text-gray-400 mt-0.5 transition-colors">
              Toggle between clean light mode and Midnight Glassmorphism dark mode
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={toggleTheme}
              className={`flex items-center gap-2.5 px-4 py-2 text-xs font-bold rounded-xl border transition-all shadow-xs cursor-pointer ${
                isDark
                  ? 'border-cyan-500/40 bg-white/[0.04] text-cyan-400 hover:bg-white/[0.08]'
                  : 'border-slate-200 bg-slate-50 text-slate-700 hover:bg-slate-100'
              }`}
              title="Click to toggle theme"
            >
              {isDark ? (
                <>
                  <MoonIcon className="w-4 h-4 text-cyan-400" />
                  <span>🌙 Dark Mode (Midnight Glass)</span>
                </>
              ) : (
                <>
                  <SunIcon className="w-4 h-4 text-amber-500" />
                  <span>☀️ Light Mode</span>
                </>
              )}
            </button>
          </div>
        </div>

        <div className="pt-2">
          <button
            onClick={handleSave}
            className="bg-blue-600 dark:bg-[#0066FF] hover:bg-blue-700 dark:hover:bg-[#0052cc] text-white font-bold text-xs px-6 py-3 rounded-xl transition shadow-xs dark:shadow-[0_0_15px_rgba(0,102,255,0.4)] cursor-pointer"
          >
            Save Preferences
          </button>
        </div>
      </div>
    </main>
  );
}

export default Settings;
