import React from 'react';

export function QuizCard({ quiz, onAction, isEnrolled = true }) {
  const {
    quizNumber = 'Quiz 1',
    title = 'Control Flow & Loops Quiz',
    questions = 10,
    duration = '20 minuts',
    attemptsAllowed = 3,
    attemptsUsed = 0,
    points = 16,
    status = 'Active', // 'Active' | 'Attempted' | 'Completed'
    colorTheme = 'cyan', // 'cyan' | 'amber' | 'emerald'
    buttonText,
  } = quiz;

  // Determine button text if not explicitly provided
  const actionButtonText =
    buttonText ||
    (status === 'Completed'
      ? 'View Results'
      : status === 'Attempted'
      ? 'Continue Attempt'
      : 'Start Attempt');

  // Icon color schemes based on quiz theme
  const getIconThemeStyles = () => {
    switch (colorTheme) {
      case 'amber':
        return 'bg-amber-50 dark:bg-[#2b1f16]/90 text-amber-600 dark:text-[#fb923c] border-amber-200/80 dark:border-[#f97316]/30';
      case 'emerald':
        return 'bg-emerald-50 dark:bg-[#122820]/90 text-emerald-600 dark:text-[#34d399] border-emerald-200/80 dark:border-[#10b981]/30';
      case 'cyan':
      default:
        return 'bg-sky-50 dark:bg-[#102432]/90 text-sky-600 dark:text-[#38bdf8] border-sky-200/80 dark:border-[#0ea5e9]/30';
    }
  };

  // Render Status Badge
  const renderStatusBadge = () => {
    if (status === 'Attempted') {
      const attemptsCount = attemptsUsed || 1;
      const maxAttempts = attemptsAllowed || 3;
      const progressPercent = Math.min(
        100,
        Math.max(10, Math.round((attemptsCount / maxAttempts) * 100))
      );

      return (
        <div className="relative inline-flex items-center overflow-hidden rounded-full border border-sky-400/40 dark:border-sky-500/40 bg-slate-100 dark:bg-[#182332] px-3.5 py-1 text-xs font-semibold">
          {/* Progress fill segment inside pill */}
          <div
            className="absolute inset-y-0 left-0 bg-sky-500/80 dark:bg-[#0284c7] transition-all duration-300"
            style={{ width: `${progressPercent}%` }}
          />
          <span className="relative z-10 text-slate-800 dark:text-white font-medium text-[11px] sm:text-xs tracking-tight drop-shadow-2xs">
            Attempted ({attemptsCount}/{maxAttempts})
          </span>
        </div>
      );
    }

    if (status === 'Completed') {
      return (
        <span className="inline-flex items-center px-3.5 py-1 rounded-full text-[11px] sm:text-xs font-semibold bg-emerald-50 dark:bg-[#0c242c] text-emerald-700 dark:text-[#2dd4bf] border border-emerald-200 dark:border-[#14b8a6]/40 tracking-tight">
          Completed
        </span>
      );
    }

    // Default 'Active' badge
    return (
      <span className="inline-flex items-center px-3.5 py-1 rounded-full text-[11px] sm:text-xs font-semibold bg-teal-50 dark:bg-[#0c242c] text-teal-700 dark:text-[#2dd4bf] border border-teal-200 dark:border-[#14b8a6]/40 tracking-tight">
        Active
      </span>
    );
  };

  return (
    <div className="group relative rounded-2xl bg-white dark:bg-[#111923] border border-slate-200/90 dark:border-[#1e293b] p-5 sm:p-6 shadow-xs hover:border-slate-300 dark:hover:border-cyan-900/40 hover:shadow-md transition-all duration-200">
      {/* Top Header Row: Icon + Subtitle & Title + Status Badge */}
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-center gap-3.5">
          {/* Quiz Document Icon */}
          <div
            className={`w-10 h-10 sm:w-11 sm:h-11 rounded-xl flex items-center justify-center shrink-0 border shadow-2xs transition-transform duration-200 group-hover:scale-105 ${getIconThemeStyles()}`}
          >
            <svg
              className="w-5 h-5"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              {/* Document sheet with fold */}
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
              <polyline points="14 2 14 8 20 8" />
              {/* Lines & edit pen mark */}
              <line x1="8" y1="13" x2="13" y2="13" />
              <line x1="8" y1="17" x2="11" y2="17" />
              <path d="M15 17l4-4" />
            </svg>
          </div>

          <div>
            <span className="text-[11px] sm:text-xs font-medium text-slate-400 dark:text-zinc-400">
              {quizNumber}
            </span>
            <h3 className="text-sm sm:text-base font-bold text-slate-900 dark:text-zinc-50 tracking-tight leading-snug">
              {title}
            </h3>
          </div>
        </div>

        {/* Status Badge */}
        <div>{renderStatusBadge()}</div>
      </div>

      {/* Bottom Row: Metadata Columns on Left & Gradient Action Button on Right */}
      <div className="mt-5 pt-1 flex flex-col md:flex-row md:items-end justify-between gap-5">
        {/* 3 Information Columns */}
        <div className="grid grid-cols-3 gap-4 sm:gap-8 max-w-xl">
          {/* Column 1: Number of Questions & Questions/Duration */}
          <div className="space-y-1">
            <div className="flex items-center gap-1.5 text-[11px] sm:text-xs font-normal text-slate-500 dark:text-zinc-400">
              <svg
                className="w-3.5 h-3.5 shrink-0 opacity-80"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
              </svg>
              <span className="truncate">Number of Questions</span>
            </div>
            <div className="flex items-center gap-1.5 text-xs sm:text-sm font-bold text-slate-800 dark:text-zinc-200">
              <svg
                className="w-3.5 h-3.5 shrink-0 opacity-70"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <circle cx="12" cy="12" r="10" />
                <polyline points="12 6 12 12 16 14" />
              </svg>
              <span>Duration {questions}</span>
            </div>
          </div>

          {/* Column 2: Duration & Time limit */}
          <div className="space-y-1">
            <div className="text-[11px] sm:text-xs font-normal text-slate-500 dark:text-zinc-400 truncate">
              Duration
            </div>
            <div className="flex items-center gap-1.5 text-xs sm:text-sm font-bold text-slate-800 dark:text-zinc-200">
              <svg
                className="w-3.5 h-3.5 shrink-0 opacity-70"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M5 22h14M5 2h14M17 22v-4.172a2 2 0 0 0-.586-1.414L12 12l-4.414 4.414A2 2 0 0 0 7 17.828V22M7 2v4.172a2 2 0 0 0 .586 1.414L12 12l4.414-4.414A2 2 0 0 0 17 6.172V2" />
              </svg>
              <span>{duration}</span>
            </div>
          </div>

          {/* Column 3: Attempts Allowed & Points */}
          <div className="space-y-1">
            <div className="text-[11px] sm:text-xs font-normal text-slate-500 dark:text-zinc-400 truncate">
              Attempts Allowed
            </div>
            <div className="text-xs sm:text-sm font-bold text-slate-800 dark:text-zinc-200">
              Points {points}
            </div>
          </div>
        </div>

        {/* Action Button */}
        <div className="self-end w-full md:w-auto">
          <button
            onClick={() => {
              if (onAction) {
                onAction(quiz, actionButtonText);
              }
            }}
            disabled={!isEnrolled}
            className="relative w-full md:w-auto min-w-[160px] cursor-pointer rounded-xl bg-gradient-to-r from-[#2dd4bf] via-[#0ea5e9] to-[#0284c7] hover:from-[#14b8a6] hover:via-[#0284c7] hover:to-[#0369a1] px-6 py-2.5 text-center text-xs sm:text-sm font-bold text-white shadow-md hover:shadow-cyan-500/25 active:scale-[0.98] transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <span className="drop-shadow-xs">{actionButtonText}</span>

            {/* Sparkle badge for View Results as shown in image */}
            {status === 'Completed' && (
              <span
                className="absolute bottom-1 right-2 text-white/90 text-[10px] pointer-events-none select-none drop-shadow-sm"
                aria-hidden="true"
              >
                ✦
              </span>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

export default QuizCard;
