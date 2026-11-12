import React, { useState } from 'react';

function CreateQuizModal({ isOpen, onClose, onCreate }) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [duration, setDuration] = useState(25);
  const [points, setPoints] = useState(20);
  const [attemptsAllowed, setAttemptsAllowed] = useState(3);
  const [colorTheme, setColorTheme] = useState('cyan');

  const [customQuestions, setCustomQuestions] = useState([
    {
      id: Date.now(),
      question: 'Which matrix decomposition factors any real or complex matrix into U Σ V^T?',
      type: 'MCQ',
      marks: 4,
      options: [
        'Singular Value Decomposition (SVD)',
        'Cholesky Decomposition',
        'LU Factorization without pivoting',
        'Jacobi Iteration',
      ],
      correctIndex: 0,
    },
  ]);

  const [qText, setQText] = useState('');
  const [optA, setOptA] = useState('');
  const [optB, setOptB] = useState('');
  const [optC, setOptC] = useState('');
  const [optD, setOptD] = useState('');
  const [correctIdx, setCorrectIdx] = useState(0);

  if (!isOpen) return null;

  const handleAddQuestion = () => {
    if (!qText.trim() || !optA.trim() || !optB.trim()) return;
    const options = [
      optA.trim(),
      optB.trim(),
      optC.trim() || 'None of the above',
      optD.trim() || 'All of the above',
    ];
    setCustomQuestions((prev) => [
      ...prev,
      {
        id: Date.now(),
        question: qText.trim(),
        type: 'MCQ',
        marks: 4,
        options,
        correctIndex: Number(correctIdx),
      },
    ]);
    setQText('');
    setOptA('');
    setOptB('');
    setOptC('');
    setOptD('');
    setCorrectIdx(0);
  };

  const handleRemoveQuestion = (id) => {
    setCustomQuestions((prev) => prev.filter((q) => q.id !== id));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title.trim() || customQuestions.length === 0) return;

    const totalMarksNum = Number(points) || 20;
    const marksPerQuestion = Math.max(1, Math.round(totalMarksNum / customQuestions.length));

    const formattedQuestions = customQuestions.map((q, idx) => ({
      questionText: q.question,
      questionType: q.type || 'MCQ',
      marks: marksPerQuestion,
      position: idx + 1,
      options: q.options.map((optText, oIdx) => ({
        optionText: optText,
        isCorrect: oIdx === Number(q.correctIndex),
      })),
    }));

    onCreate({
      title: title.trim(),
      description: description.trim() || undefined,
      durationMinutes: Number(duration) || 25,
      totalMarks: totalMarksNum,
      maxAttempts: Number(attemptsAllowed) || 3,
      questions: formattedQuestions,
      colorTheme,
    });

    setTitle('');
    setDescription('');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4 overflow-y-auto animate-fade-in">
      <div className="relative w-full max-w-2xl rounded-2xl border border-slate-200 dark:border-white/10 bg-white dark:bg-[#030712] p-6 sm:p-8 shadow-2xl transition-colors my-8 max-h-[92vh] overflow-y-auto">
        <div className="flex items-center justify-between border-b border-slate-100 dark:border-white/5 pb-4 mb-5">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-blue-600 dark:text-cyan-400">
              Assessment Authoring
            </span>
            <h2 className="text-xl font-bold text-slate-900 dark:text-white">
              Create Timed Quiz & Questions
            </h2>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-lg border border-slate-200 dark:border-white/10 text-slate-500 dark:text-gray-400 hover:bg-slate-100 dark:hover:bg-white/10 transition cursor-pointer"
          >
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-gray-300 uppercase mb-1">
              Quiz Title *
            </label>
            <input
              type="text"
              required
              placeholder="e.g. Midterm Assessment: Eigenvalues, SVD & Optimization"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-gray-800 bg-white dark:bg-transparent text-slate-900 dark:text-white text-sm placeholder-slate-400 dark:placeholder-gray-500 focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500/50 transition"
            />
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-gray-300 uppercase mb-1">
                Duration (mins)
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
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-gray-300 uppercase mb-1">
                Total Marks
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
                Max Attempts
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

          <div className="rounded-2xl border border-slate-200 dark:border-white/10 bg-slate-50/70 dark:bg-white/[0.02] p-4 space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-gray-300">
                Question Bank ({customQuestions.length} Added)
              </h4>
              <span className="text-[11px] text-slate-500 dark:text-gray-400">
                Objective MCQ Auto-Graded
              </span>
            </div>

            {customQuestions.length > 0 && (
              <div className="space-y-2 max-h-36 overflow-y-auto pr-1">
                {customQuestions.map((q, idx) => (
                  <div
                    key={q.id}
                    className="flex items-center justify-between gap-2 rounded-xl bg-white dark:bg-gray-900/60 border border-slate-200/80 dark:border-white/5 px-3 py-2 text-xs"
                  >
                    <div className="truncate">
                      <span className="font-bold text-blue-600 dark:text-cyan-400 mr-1.5">
                        Q{idx + 1}.
                      </span>
                      <span className="font-semibold text-slate-800 dark:text-gray-200">
                        {q.question}
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleRemoveQuestion(q.id)}
                      className="text-red-500 hover:text-red-600 font-bold px-1.5 cursor-pointer"
                    >
                      ✕
                    </button>
                  </div>
                ))}
              </div>
            )}

            <div className="pt-2 border-t border-slate-200/70 dark:border-white/5 space-y-2.5">
              <input
                type="text"
                placeholder="Type a new question prompt..."
                value={qText}
                onChange={(e) => setQText(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-gray-800 bg-white dark:bg-[#030712] text-xs font-medium text-slate-900 dark:text-white"
              />
              <div className="grid grid-cols-2 gap-2">
                <input
                  type="text"
                  placeholder="Option A *"
                  value={optA}
                  onChange={(e) => setOptA(e.target.value)}
                  className="px-3 py-1.5 rounded-lg border border-slate-200 dark:border-gray-800 bg-white dark:bg-[#030712] text-xs text-slate-900 dark:text-white"
                />
                <input
                  type="text"
                  placeholder="Option B *"
                  value={optB}
                  onChange={(e) => setOptB(e.target.value)}
                  className="px-3 py-1.5 rounded-lg border border-slate-200 dark:border-gray-800 bg-white dark:bg-[#030712] text-xs text-slate-900 dark:text-white"
                />
                <input
                  type="text"
                  placeholder="Option C"
                  value={optC}
                  onChange={(e) => setOptC(e.target.value)}
                  className="px-3 py-1.5 rounded-lg border border-slate-200 dark:border-gray-800 bg-white dark:bg-[#030712] text-xs text-slate-900 dark:text-white"
                />
                <input
                  type="text"
                  placeholder="Option D"
                  value={optD}
                  onChange={(e) => setOptD(e.target.value)}
                  className="px-3 py-1.5 rounded-lg border border-slate-200 dark:border-gray-800 bg-white dark:bg-[#030712] text-xs text-slate-900 dark:text-white"
                />
              </div>
              <div className="flex items-center justify-between gap-2 pt-1">
                <div className="flex items-center gap-2 text-xs text-slate-600 dark:text-gray-300">
                  <span className="font-semibold">Correct Option:</span>
                  <select
                    value={correctIdx}
                    onChange={(e) => setCorrectIdx(Number(e.target.value))}
                    className="rounded-lg border border-slate-200 dark:border-gray-800 bg-white dark:bg-[#030712] px-2.5 py-1 text-xs font-bold text-slate-900 dark:text-white"
                  >
                    <option value={0}>Option A</option>
                    <option value={1}>Option B</option>
                    <option value={2}>Option C</option>
                    <option value={3}>Option D</option>
                  </select>
                </div>
                <button
                  type="button"
                  onClick={handleAddQuestion}
                  className="px-3 py-1.5 rounded-lg bg-slate-900 dark:bg-white/10 text-white text-xs font-bold hover:opacity-90 transition cursor-pointer"
                >
                  + Add Question to Quiz
                </button>
              </div>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-gray-300 uppercase mb-1.5">
              Card Accent Theme
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
              className="px-5 py-2.5 rounded-xl text-xs font-bold bg-[#0066FF] hover:bg-blue-600 text-white shadow-[0_0_15px_rgba(0,102,255,0.4)] transition cursor-pointer"
            >
              Publish Quiz
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export { CreateQuizModal };
export default CreateQuizModal;
