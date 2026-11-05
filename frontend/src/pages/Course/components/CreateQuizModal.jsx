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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4 animate-fade-in">
      <div className="relative w-full max-w-lg rounded-2xl border border-slate-200 dark:border-white/10 bg-white dark:bg-[#030712] p-6 sm:p-8 shadow-2xl transition-colors">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-100 dark:border-white/5 pb-4 mb-5">
          <h2 className="text-xl font-bold text-slate-900 dark:text-white">
            Create New Quiz
          </h2>
          <button
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-lg border border-slate-200 dark:border-white/10 text-slate-500 dark:text-gray-400 hover:bg-slate-100 dark:hover:bg-white/10 transition cursor-pointer"
          >
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-gray-300 uppercase mb-1">
              Quiz Title
            </label>
            <input
              type="text"
              required
              placeholder="e.g. Asynchronous JavaScript & Promises"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-gray-800 bg-white dark:bg-transparent text-slate-900 dark:text-white text-sm placeholder-slate-400 dark:placeholder-gray-500 focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500/50 transition"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-gray-300 uppercase mb-1">
                Number of Questions
              </label>
              <input
                type="number"
                min="1"
                max="100"
                value={questions}
                onChange={(e) => setQuestions(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-gray-800 bg-white dark:bg-transparent text-slate-900 dark:text-white text-sm focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500/50 transition"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-gray-300 uppercase mb-1">
                Duration (minutes)
              </label>
              <input
                type="number"
                min="5"
                max="180"
                value={duration}
                onChange={(e) => setDuration(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-gray-800 bg-white dark:bg-transparent text-slate-900 dark:text-white text-sm focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500/50 transition"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-gray-300 uppercase mb-1">
                Total Points
              </label>
              <input
                type="number"
                min="1"
                max="100"
                value={points}
                onChange={(e) => setPoints(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-gray-800 bg-white dark:bg-transparent text-slate-900 dark:text-white text-sm focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500/50 transition"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-gray-300 uppercase mb-1">
                Attempts Allowed
              </label>
              <input
                type="number"
                min="1"
                max="10"
                value={attemptsAllowed}
                onChange={(e) => setAttemptsAllowed(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-gray-800 bg-white dark:bg-transparent text-slate-900 dark:text-white text-sm focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500/50 transition"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-gray-300 uppercase mb-1">
              Accent Theme
            </label>
            <div className="flex items-center gap-3">
              {[
                { id: 'cyan', label: 'Cyan', color: 'bg-cyan-400' },
                { id: 'amber', label: 'Amber', color: 'bg-amber-500' },
                { id: 'emerald', label: 'Emerald', color: 'bg-emerald-500' },
              ].map((theme) => (
                <button
                  type="button"
                  key={theme.id}
                  onClick={() => setColorTheme(theme.id)}
                  className={`flex items-center gap-2 px-3 py-1.5 rounded-xl border text-xs font-semibold cursor-pointer ${
                    colorTheme === theme.id
                      ? 'border-cyan-400 bg-cyan-50/50 dark:bg-cyan-950/40 text-cyan-700 dark:text-cyan-300'
                      : 'border-slate-200 dark:border-white/10 text-slate-600 dark:text-gray-400'
                  }`}
                >
                  <span className={`w-3 h-3 rounded-full ${theme.color}`} />
                  {theme.label}
                </button>
              ))}
            </div>
          </div>

          <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100 dark:border-white/5">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 dark:text-gray-400 hover:bg-slate-100 dark:hover:bg-white/5 transition cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-xl text-xs font-bold bg-gradient-to-r from-cyan-400 to-blue-500 hover:brightness-110 text-white shadow-[0_0_15px_rgba(6,182,212,0.4)] transition cursor-pointer"
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
