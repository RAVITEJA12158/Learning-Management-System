import { useState } from 'react';

function Settings() {
  const [emailNotifs, setEmailNotifs] = useState(true);
  const [darkTheme, setDarkTheme] = useState(false);

  return (
    <main className="mx-auto max-w-5xl px-5 py-10 sm:px-8 w-full">
      <div className="mb-8">
        <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Account Settings</h1>
        <p className="text-sm text-slate-500 mt-1">Manage your platform preferences and notification options</p>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200/80 p-6 sm:p-8 shadow-xs space-y-6">
        <div className="flex items-center justify-between pb-6 border-b border-slate-100">
          <div>
            <h3 className="text-sm font-bold text-slate-900">Email Notifications</h3>
            <p className="text-xs text-slate-500 mt-0.5">Receive updates on course assignments, quizzes, and grade publications</p>
          </div>
          <input
            type="checkbox"
            checked={emailNotifs}
            onChange={(e) => setEmailNotifs(e.target.checked)}
            className="h-5 w-5 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
          />
        </div>

        <div className="flex items-center justify-between pb-6 border-b border-slate-100">
          <div>
            <h3 className="text-sm font-bold text-slate-900">Appearance Mode</h3>
            <p className="text-xs text-slate-500 mt-0.5">Toggle between light theme and dark mode</p>
          </div>
          <button
            onClick={() => setDarkTheme(!darkTheme)}
            className="px-4 py-2 text-xs font-bold rounded-lg border border-slate-200 bg-slate-50 hover:bg-slate-100 transition"
          >
            {darkTheme ? '🌙 Dark Mode' : '☀️ Light Mode'}
          </button>
        </div>

        <div className="pt-2">
          <button className="bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs px-6 py-3 rounded-xl transition shadow-xs">
            Save Preferences
          </button>
        </div>
      </div>
    </main>
  );
}

export default Settings;
