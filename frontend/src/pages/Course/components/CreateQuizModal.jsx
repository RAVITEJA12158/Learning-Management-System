import React, { useState } from 'react';

export function CreateQuizModal({ isOpen, onClose, onCreate }) {
  const [title, setTitle] = useState('');
  const [questions, setQuestions] = useState(10);
  const [duration, setDuration] = useState(25);
  const [points, setPoints] = useState(20);
  const [attemptsAllowed, setAttemptsAllowed] = useState(3);
  const [colorTheme, setColorTheme] = useState('cyan');

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title.trim()) return;

    onCreate({
      id: `quiz-${Date.now()}`,
      title: title.trim(),
      questions: Number(questions),
      duration: `${duration} mins`,
      points: Number(points),
      attemptsAllowed: Number(attemptsAllowed),
      attemptsUsed: 0,
      status: 'Active',
      colorTheme,
    });

    setTitle('');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-xs p-4 animate-fade-in">
      <div className="relative w-full max-w-lg rounded-2xl border border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-6 sm:p-8 shadow-2xl transition-colors">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-100 dark:border-zinc-800 pb-4 mb-5">
          <h2 className="text-xl font-bold text-slate-900 dark:text-zinc-50">
            Create New Quiz
          </h2>
          <button
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-lg border border-slate-200 dark:border-zinc-700 text-slate-500 dark:text-zinc-400 hover:bg-slate-100 dark:hover:bg-zinc-800 transition"
          >
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-zinc-300 uppercase mb-1">
              Quiz Title
            </label>
            <input
              type="text"
              required
              placeholder="e.g. Asynchronous JavaScript & Promises"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-zinc-700 bg-slate-50 dark:bg-zinc-800 text-slate-900 dark:text-zinc-100 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-zinc-300 uppercase mb-1">
                Number of Questions
              </label>
              <input
                type="number"
                min="1"
                max="100"
                value={questions}
                onChange={(e) => setQuestions(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-zinc-700 bg-slate-50 dark:bg-zinc-800 text-slate-900 dark:text-zinc-100 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-zinc-300 uppercase mb-1">
                Duration (minutes)
              </label>
              <input
                type="number"
                min="5"
                max="180"
                value={duration}
                onChange={(e) => setDuration(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-zinc-700 bg-slate-50 dark:bg-zinc-800 text-slate-900 dark:text-zinc-100 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-zinc-300 uppercase mb-1">
                Total Points
              </label>
              <input
                type="number"
                min="1"
                max="100"
                value={points}
                onChange={(e) => setPoints(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-zinc-700 bg-slate-50 dark:bg-zinc-800 text-slate-900 dark:text-zinc-100 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-zinc-300 uppercase mb-1">
                Attempts Allowed
              </label>
              <input
                type="number"
                min="1"
                max="10"
                value={attemptsAllowed}
                onChange={(e) => setAttemptsAllowed(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-zinc-700 bg-slate-50 dark:bg-zinc-800 text-slate-900 dark:text-zinc-100 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-zinc-300 uppercase mb-1">
              Accent Theme
            </label>
            <div className="flex items-center gap-3">
              {[
                { id: 'cyan', label: 'Cyan', color: 'bg-sky-500' },
                { id: 'amber', label: 'Amber', color: 'bg-amber-500' },
                { id: 'emerald', label: 'Emerald', color: 'bg-emerald-500' },
              ].map((theme) => (
                <button
                  type="button"
                  key={theme.id}
                  onClick={() => setColorTheme(theme.id)}
                  className={`flex items-center gap-2 px-3 py-1.5 rounded-xl border text-xs font-semibold cursor-pointer ${
                    colorTheme === theme.id
                      ? 'border-blue-500 bg-blue-50/50 dark:bg-blue-950/40 text-blue-700 dark:text-blue-300'
                      : 'border-slate-200 dark:border-zinc-700 text-slate-600 dark:text-zinc-400'
                  }`}
                >
                  <span className={`w-3 h-3 rounded-full ${theme.color}`} />
                  {theme.label}
                </button>
              ))}
            </div>
          </div>

          <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100 dark:border-zinc-800">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 dark:text-zinc-400 hover:bg-slate-100 dark:hover:bg-zinc-800 transition cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-xl text-xs font-bold bg-blue-600 text-white hover:bg-blue-700 shadow-xs transition cursor-pointer"
            >
              Create Quiz
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default CreateQuizModal;
