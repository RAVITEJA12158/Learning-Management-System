import React from 'react';

export function QuizSubmitConfirmModal({
  isOpen,
  onClose,
  onConfirmSubmit,
  totalQuestions = 10,
  answeredCount = 0,
  flaggedCount = 0,
  timeRemaining = '00:00',
}) {
  if (!isOpen) return null;

  const unansweredCount = Math.max(0, totalQuestions - answeredCount);
  const completionPercentage = Math.round((answeredCount / totalQuestions) * 100);

  return (
    <div className="fixed inset-0 z-60 flex items-center justify-center bg-black/80 backdrop-blur-md p-4 animate-fade-in">
      <div className="relative w-full max-w-lg rounded-2xl bg-white dark:bg-[#030712] border border-slate-200 dark:border-white/10 p-6 sm:p-7 shadow-2xl transition-colors duration-200">
        {/* Header */}
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 bg-cyan-50 dark:bg-cyan-950/60 text-cyan-600 dark:text-cyan-400 border border-cyan-200 dark:border-cyan-800/40">
            <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M9 11l3 3L22 4" />
              <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11" />
            </svg>
          </div>
          <div>
            <h3 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white">
              Confirm Exam Submission
            </h3>
            <p className="text-xs text-slate-500 dark:text-gray-400 mt-1">
              Please review your summary below before submitting. Once submitted, your answers are final.
            </p>
          </div>
        </div>

        {/* Exam Summary Statistics Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 my-5">
          {/* Total Questions */}
          <div className="p-3 rounded-xl bg-slate-50 dark:bg-white/[0.02] border border-slate-200/80 dark:border-white/5 text-center">
            <div className="text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-gray-400">
              Total
            </div>
            <div className="text-lg font-black text-slate-800 dark:text-white mt-0.5">
              {totalQuestions}
            </div>
          </div>

          {/* Attempted */}
          <div className="p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200/80 dark:border-emerald-800/40 text-center">
            <div className="text-[10px] font-bold uppercase tracking-wider text-emerald-700 dark:text-emerald-400">
              Answered
            </div>
            <div className="text-lg font-black text-emerald-700 dark:text-emerald-300 mt-0.5">
              {answeredCount}
            </div>
          </div>

          {/* Unanswered */}
          <div className="p-3 rounded-xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200/80 dark:border-amber-800/40 text-center">
            <div className="text-[10px] font-bold uppercase tracking-wider text-amber-700 dark:text-amber-400">
              Unanswered
            </div>
            <div className="text-lg font-black text-amber-700 dark:text-amber-300 mt-0.5">
              {unansweredCount}
            </div>
          </div>

          {/* Flagged */}
          <div className="p-3 rounded-xl bg-cyan-50 dark:bg-cyan-950/30 border border-cyan-200/80 dark:border-cyan-800/40 text-center">
            <div className="text-[10px] font-bold uppercase tracking-wider text-cyan-700 dark:text-cyan-400">
              Flagged
            </div>
            <div className="text-lg font-black text-cyan-700 dark:text-cyan-300 mt-0.5">
              {flaggedCount}
            </div>
          </div>
        </div>

        {/* Time Remaining & Progress Pill */}
        <div className="flex items-center justify-between p-3 rounded-xl bg-slate-100/80 dark:bg-white/[0.02] border border-slate-200/60 dark:border-white/5 mb-5 text-xs">
          <div className="flex items-center gap-2 text-slate-600 dark:text-gray-300 font-medium">
            <svg className="w-4 h-4 text-cyan-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="10" />
              <polyline points="12 6 12 12 16 14" />
            </svg>
            <span>Time Left: <strong className="font-mono text-slate-900 dark:text-white">{timeRemaining}</strong></span>
          </div>
          <div className="text-slate-500 dark:text-gray-400 font-semibold">
            {completionPercentage}% Complete
          </div>
        </div>

        {/* Warning / Status Notice */}
        {unansweredCount > 0 ? (
          <div className="p-3.5 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800/60 text-xs text-amber-800 dark:text-amber-300 mb-6 flex items-start gap-2.5">
            <span className="text-sm">⚠️</span>
            <p className="leading-snug">
              <strong>Notice:</strong> You still have <strong>{unansweredCount} unanswered</strong> questions. Unanswered questions will receive 0 marks.
            </p>
          </div>
        ) : (
          <div className="p-3.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/60 text-xs text-emerald-800 dark:text-emerald-300 mb-6 flex items-start gap-2.5">
            <span className="text-sm">✅</span>
            <p className="leading-snug">
              All <strong>{totalQuestions} questions</strong> have been answered! You are ready to complete your submission.
            </p>
          </div>
        )}

        {/* Actions */}
        <div className="flex items-center justify-end gap-3 pt-2 border-t border-slate-100 dark:border-white/5">
          <button
            onClick={onClose}
            className="px-4 py-2.5 rounded-xl text-xs font-bold text-slate-700 dark:text-gray-300 hover:bg-slate-100 dark:hover:bg-white/[0.05] border border-slate-200 dark:border-white/10 transition cursor-pointer"
          >
            Return to Exam
          </button>
          <button
            onClick={onConfirmSubmit}
            className="px-5 py-2.5 rounded-xl text-xs font-bold bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600 hover:brightness-110 text-white shadow-[0_0_15px_rgba(6,182,212,0.4)] active:scale-[0.98] transition cursor-pointer"
          >
            Confirm & Submit Exam
          </button>
        </div>
      </div>
    </div>
  );
}

export default QuizSubmitConfirmModal;
