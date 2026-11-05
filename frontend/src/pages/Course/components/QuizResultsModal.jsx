import React from 'react';
import { MOCK_QUIZ_REVIEW_ITEMS } from '../../../utils/mockData';

export function QuizResultsModal({ quiz, isOpen, onClose, onRetake }) {
  if (!isOpen || !quiz) return null;

  const score = quiz.score !== undefined ? quiz.score : 15;
  const maxPoints = quiz.points || 16;
  const percentage = Math.round((score / maxPoints) * 100);
  const isPassed = percentage >= 70;
  const reviewItems = quiz.reviewItems || MOCK_QUIZ_REVIEW_ITEMS;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4 animate-fade-in">
      <div className="relative flex max-h-[92vh] w-full max-w-2xl flex-col rounded-2xl border border-slate-200 dark:border-white/10 bg-white dark:bg-[#030712] p-6 sm:p-8 shadow-2xl transition-colors">
        {/* Header */}
        <div className="flex items-start justify-between border-b border-slate-100 dark:border-white/5 pb-4 mb-5">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold text-slate-400 dark:text-gray-400">
                {quiz.quizNumber}
              </span>
              <span
                className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                  isPassed
                    ? 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800/40'
                    : 'bg-red-50 dark:bg-red-950/60 text-red-700 dark:text-red-400 border border-red-200 dark:border-red-900/40'
                }`}
              >
                {isPassed ? 'Passed' : 'Needs Review'}
              </span>
            </div>
            <h2 className="text-xl font-bold text-slate-900 dark:text-white mt-1">
              Assessment Results: {quiz.title}
            </h2>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-lg border border-slate-200 dark:border-white/10 text-slate-500 dark:text-gray-400 hover:bg-slate-100 dark:hover:bg-white/10 transition cursor-pointer"
          >
            ✕
          </button>
        </div>

        {/* Score Highlight Banner */}
        <div className="grid grid-cols-3 gap-4 p-4 rounded-xl bg-slate-50 dark:bg-white/[0.02] border border-slate-200/80 dark:border-white/5 mb-6 text-center">
          <div>
            <div className="text-[11px] font-semibold text-slate-500 dark:text-gray-400 uppercase">
              Score
            </div>
            <div className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white mt-0.5">
              {score} / {maxPoints}
            </div>
          </div>
          <div>
            <div className="text-[11px] font-semibold text-slate-500 dark:text-gray-400 uppercase">
              Percentage
            </div>
            <div className="text-xl sm:text-2xl font-black text-cyan-600 dark:text-cyan-400 mt-0.5">
              {percentage}%
            </div>
          </div>
          <div>
            <div className="text-[11px] font-semibold text-slate-500 dark:text-gray-400 uppercase">
              Attempts
            </div>
            <div className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white mt-0.5">
              {quiz.attemptsUsed || 3} / {quiz.attemptsAllowed || 3}
            </div>
          </div>
        </div>

        {/* Breakdown List */}
        <div className="flex-1 overflow-y-auto space-y-3 pr-1">
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-gray-400 mb-2">
            Performance Breakdown
          </h4>
          {reviewItems.map((item, idx) => (
            <div
              key={idx}
              className={`p-3.5 rounded-xl border transition-colors ${
                item.correct
                  ? 'bg-emerald-50/50 dark:bg-emerald-950/20 border-emerald-200/80 dark:border-emerald-900/40'
                  : 'bg-red-50/50 dark:bg-red-950/20 border-red-200/80 dark:border-red-900/40'
              }`}
            >
              <div className="flex items-start justify-between gap-2">
                <p className="text-xs font-bold text-slate-800 dark:text-white">
                  {item.q}
                </p>
                <span
                  className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                    item.correct
                      ? 'bg-emerald-100 dark:bg-emerald-900/60 text-emerald-800 dark:text-emerald-300'
                      : 'bg-red-100 dark:bg-red-900/60 text-red-800 dark:text-red-300'
                  }`}
                >
                  {item.points}
                </span>
              </div>
              <div className="mt-2 text-[11px] space-y-0.5 text-slate-600 dark:text-gray-400">
                <div>
                  <span className="font-semibold text-slate-500 dark:text-gray-500">Your Answer: </span>
                  <span className={item.correct ? 'text-emerald-700 dark:text-emerald-400 font-medium' : 'text-red-600 dark:text-red-400 font-medium'}>
                    {item.userAns}
                  </span>
                </div>
                {!item.correct && (
                  <div>
                    <span className="font-semibold text-slate-500 dark:text-gray-500">Correct Answer: </span>
                    <span className="text-emerald-700 dark:text-emerald-400 font-medium">
                      {item.correctAns}
                    </span>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between border-t border-slate-100 dark:border-white/5 pt-4 mt-5">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 dark:text-gray-400 hover:bg-slate-100 dark:hover:bg-white/5 transition cursor-pointer"
          >
            Close
          </button>

          {(quiz.attemptsUsed || 3) < (quiz.attemptsAllowed || 3) && (
            <button
              onClick={() => {
                onClose();
                if (onRetake) {
                  onRetake(quiz);
                }
              }}
              className="px-5 py-2 rounded-xl text-xs font-bold bg-gradient-to-r from-cyan-400 to-blue-500 hover:brightness-110 text-white transition cursor-pointer shadow-[0_0_15px_rgba(6,182,212,0.4)]"
            >
              Retake Quiz
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export default QuizResultsModal;
