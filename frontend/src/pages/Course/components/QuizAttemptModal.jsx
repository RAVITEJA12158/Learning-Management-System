import React, { useState, useEffect } from 'react';
import { MOCK_QUIZ_QUESTIONS } from '../../../utils/mockData';

export function QuizAttemptModal({ quiz, isOpen, onClose, onSubmit }) {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [timeLeft, setTimeLeft] = useState(20 * 60); // 20 minutes in seconds

  const questionsList = quiz?.questionsList || MOCK_QUIZ_QUESTIONS;

  // Timer countdown
  useEffect(() => {
    if (!isOpen) return;
    const timer = setInterval(() => {
      setTimeLeft((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, [isOpen]);

  if (!isOpen || !quiz) return null;

  const currentQ = questionsList[currentQuestionIndex];
  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;
  const formattedTime = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;

  const handleSelectOption = (index) => {
    setSelectedAnswers((prev) => ({
      ...prev,
      [currentQuestionIndex]: index,
    }));
  };

  const handleSubmitQuiz = () => {
    let score = 0;
    questionsList.forEach((q, idx) => {
      if (selectedAnswers[idx] === q.correctIndex) {
        score += 1.6; // 10 questions to 16 points
      }
    });
    score = Math.round(score);

    onSubmit({
      quizId: quiz.id,
      score,
      maxPoints: quiz.points || 16,
      totalQuestions: questionsList.length,
      answers: selectedAnswers,
      timeSpent: `${20 - minutes} mins ${60 - (seconds || 60)} secs`,
    });
  };

  const answeredCount = Object.keys(selectedAnswers).length;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-xs p-4 animate-fade-in">
      <div className="relative flex max-h-[92vh] w-full max-w-3xl flex-col rounded-2xl border border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-6 sm:p-8 shadow-2xl transition-colors">
        {/* Top Header */}
        <div className="flex items-center justify-between border-b border-slate-100 dark:border-zinc-800 pb-4 mb-5">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold text-slate-400 dark:text-zinc-400">
                {quiz.quizNumber}
              </span>
              <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400">
                Live Attempt
              </span>
            </div>
            <h2 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-zinc-50 mt-1">
              {quiz.title}
            </h2>
          </div>

          <div className="flex items-center gap-4">
            {/* Countdown Badge */}
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-zinc-800 text-slate-700 dark:text-zinc-300 font-mono text-xs font-bold">
              <svg className="w-4 h-4 text-amber-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="10" />
                <polyline points="12 6 12 12 16 14" />
              </svg>
              <span>{formattedTime}</span>
            </div>

            <button
              onClick={onClose}
              className="w-8 h-8 flex items-center justify-center rounded-lg border border-slate-200 dark:border-zinc-700 text-slate-500 dark:text-zinc-400 hover:bg-slate-100 dark:hover:bg-zinc-800 transition"
            >
              ✕
            </button>
          </div>
        </div>

        {/* Question Navigation Bar */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-3 mb-4 no-scrollbar">
          {questionsList.map((_, idx) => {
            const isAnswered = selectedAnswers[idx] !== undefined;
            const isCurrent = idx === currentQuestionIndex;
            return (
              <button
                key={idx}
                onClick={() => setCurrentQuestionIndex(idx)}
                className={`w-8 h-8 rounded-lg text-xs font-bold shrink-0 transition-all cursor-pointer ${
                  isCurrent
                    ? 'bg-blue-600 text-white shadow-xs'
                    : isAnswered
                    ? 'bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400 border border-emerald-300 dark:border-emerald-800'
                    : 'bg-slate-100 dark:bg-zinc-800 text-slate-600 dark:text-zinc-400 hover:bg-slate-200 dark:hover:bg-zinc-700'
                }`}
              >
                {idx + 1}
              </button>
            );
          })}
        </div>

        {/* Current Question */}
        <div className="flex-1 overflow-y-auto space-y-5 pr-1">
          <div className="space-y-2">
            <span className="text-xs font-semibold text-slate-400 dark:text-zinc-400 uppercase tracking-wider">
              Question {currentQuestionIndex + 1} of {questionsList.length}
            </span>
            <p className="text-base sm:text-lg font-bold text-slate-900 dark:text-zinc-100 leading-snug">
              {currentQ.question}
            </p>
          </div>

          {/* Options */}
          <div className="space-y-2.5">
            {currentQ.options.map((option, optIdx) => {
              const isSelected = selectedAnswers[currentQuestionIndex] === optIdx;
              return (
                <button
                  key={optIdx}
                  onClick={() => handleSelectOption(optIdx)}
                  className={`w-full text-left p-4 rounded-xl border transition-all flex items-center justify-between cursor-pointer ${
                    isSelected
                      ? 'border-blue-500 bg-blue-50/70 dark:bg-blue-950/40 text-blue-900 dark:text-blue-100 font-semibold'
                      : 'border-slate-200 dark:border-zinc-800 bg-slate-50/50 dark:bg-zinc-800/40 text-slate-700 dark:text-zinc-300 hover:border-slate-300 dark:hover:border-zinc-700 hover:bg-slate-50 dark:hover:bg-zinc-800/70'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span
                      className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold border ${
                        isSelected
                          ? 'border-blue-600 bg-blue-600 text-white'
                          : 'border-slate-300 dark:border-zinc-600 text-slate-500 dark:text-zinc-400'
                      }`}
                    >
                      {String.fromCharCode(65 + optIdx)}
                    </span>
                    <span className="text-sm">{option}</span>
                  </div>
                  {isSelected && (
                    <div className="w-2 h-2 rounded-full bg-blue-600 dark:bg-blue-400" />
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Modal Footer */}
        <div className="flex items-center justify-between border-t border-slate-100 dark:border-zinc-800 pt-4 mt-5">
          <div className="text-xs text-slate-500 dark:text-zinc-400 font-medium">
            Answered: {answeredCount}/{questionsList.length}
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setCurrentQuestionIndex((prev) => Math.max(0, prev - 1))}
              disabled={currentQuestionIndex === 0}
              className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 dark:text-zinc-400 hover:bg-slate-100 dark:hover:bg-zinc-800 disabled:opacity-40 transition cursor-pointer"
            >
              Previous
            </button>

            {currentQuestionIndex < questionsList.length - 1 ? (
              <button
                onClick={() => setCurrentQuestionIndex((prev) => Math.min(questionsList.length - 1, prev + 1))}
                className="px-5 py-2 rounded-xl text-xs font-bold bg-slate-900 dark:bg-zinc-100 text-white dark:text-zinc-900 hover:opacity-90 transition cursor-pointer"
              >
                Next
              </button>
            ) : (
              <button
                onClick={handleSubmitQuiz}
                className="px-5 py-2 rounded-xl text-xs font-bold bg-gradient-to-r from-teal-500 to-blue-600 text-white hover:opacity-95 shadow-md transition cursor-pointer"
              >
                Submit Attempt
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default QuizAttemptModal;
