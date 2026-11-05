import React, { useState, useEffect } from 'react';
import { MOCK_QUIZ_QUESTIONS, MOCK_EXAM_INSTRUCTIONS } from '../../../utils/mockData';
import { QuizSubmitConfirmModal } from './QuizSubmitConfirmModal';
import { useTheme } from '../../../context/ThemeContext';

export function QuizAttemptModal({ quiz, isOpen, onClose, onSubmit }) {
  const { isDark, toggleTheme } = useTheme();

  // Stages: 'instructions' | 'exam'
  const [stage, setStage] = useState('instructions');
  const [agreedToTerms, setAgreedToTerms] = useState(false);

  // Exam state
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [flaggedQuestions, setFlaggedQuestions] = useState({});
  const [timeLeft, setTimeLeft] = useState(20 * 60); // in seconds
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showSubmitConfirm, setShowSubmitConfirm] = useState(false);

  const questionsList = quiz?.questionsList || MOCK_QUIZ_QUESTIONS;

  // Initialize timer and duration when quiz changes or opens
  useEffect(() => {
    if (!isOpen || !quiz) {
      setStage('instructions');
      setAgreedToTerms(false);
      setSelectedAnswers({});
      setFlaggedQuestions({});
      setCurrentQuestionIndex(0);
      setShowSubmitConfirm(false);
      return;
    }

    // Parse duration (e.g., '20 minuts' or '30 minuts' or default 20)
    const parsedMinutes = parseInt(quiz.duration, 10) || 20;
    setTimeLeft(parsedMinutes * 60);
  }, [isOpen, quiz]);

  // Handle Fullscreen state change events
  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(Boolean(document.fullscreenElement));
    };

    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
    };
  }, []);

  // Timer countdown while in 'exam' stage
  useEffect(() => {
    if (!isOpen || stage !== 'exam') return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          // Automatically trigger submit when time expires
          setShowSubmitConfirm(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isOpen, stage]);

  if (!isOpen || !quiz) return null;

  // Fullscreen helper functions
  const enterFullscreen = () => {
    const elem = document.documentElement;
    if (elem.requestFullscreen) {
      elem.requestFullscreen().catch(() => {});
    } else if (elem.webkitRequestFullscreen) {
      elem.webkitRequestFullscreen();
    }
  };

  const exitFullscreen = () => {
    if (document.fullscreenElement) {
      if (document.exitFullscreen) {
        document.exitFullscreen().catch(() => {});
      } else if (document.webkitExitFullscreen) {
        document.webkitExitFullscreen();
      }
    }
  };

  // Toggle fullscreen mode manually
  const toggleFullscreen = () => {
    if (document.fullscreenElement) {
      exitFullscreen();
    } else {
      enterFullscreen();
    }
  };

  // Handle Confirm & Enter Exam
  const handleConfirmAndEnterExam = () => {
    enterFullscreen();
    setStage('exam');
  };

  // Select an option
  const handleSelectOption = (optIndex) => {
    setSelectedAnswers((prev) => ({
      ...prev,
      [currentQuestionIndex]: optIndex,
    }));
  };

  // Clear current response
  const handleClearResponse = () => {
    setSelectedAnswers((prev) => {
      const copy = { ...prev };
      delete copy[currentQuestionIndex];
      return copy;
    });
  };

  // Toggle flag for review
  const handleToggleFlag = () => {
    setFlaggedQuestions((prev) => ({
      ...prev,
      [currentQuestionIndex]: !prev[currentQuestionIndex],
    }));
  };

  // Final submission action
  const handleFinalSubmit = () => {
    exitFullscreen();
    setShowSubmitConfirm(false);

    const parsedMinutes = parseInt(quiz.duration, 10) || 20;
    const initialSeconds = parsedMinutes * 60;
    const timeUsedSeconds = Math.max(0, initialSeconds - timeLeft);
    const usedMin = Math.floor(timeUsedSeconds / 60);
    const usedSec = timeUsedSeconds % 60;

    // Calculate score
    let calculatedScore = 0;
    const pointsPerQuestion = (quiz.points || 16) / questionsList.length;
    questionsList.forEach((q, idx) => {
      if (selectedAnswers[idx] === q.correctIndex) {
        calculatedScore += pointsPerQuestion;
      }
    });

    onSubmit({
      quizId: quiz.id,
      score: Math.round(calculatedScore),
      maxPoints: quiz.points || 16,
      totalQuestions: questionsList.length,
      answers: selectedAnswers,
      timeSpent: `${usedMin} mins ${usedSec} secs`,
    });
  };

  // Calculations for display
  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;
  const formattedTime = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
  const isUrgentTime = minutes < 5;

  const currentQ = questionsList[currentQuestionIndex];
  const answeredCount = Object.keys(selectedAnswers).length;
  const flaggedCount = Object.values(flaggedQuestions).filter(Boolean).length;

  // -------------------------------------------------------------
  // VIEW 1: PRE-EXAM INSTRUCTIONS SCREEN
  // -------------------------------------------------------------
  if (stage === 'instructions') {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4 overflow-y-auto animate-fade-in">
        <div className="relative w-full max-w-3xl rounded-3xl bg-white dark:bg-[#030712] border border-slate-200 dark:border-white/10 p-6 sm:p-9 shadow-2xl transition-colors duration-200 my-8">
          {/* Header */}
          <div className="flex items-start justify-between border-b border-slate-100 dark:border-white/5 pb-5 mb-6">
            <div>
              <div className="flex items-center gap-2 mb-1.5">
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-cyan-50 dark:bg-cyan-950/60 text-cyan-700 dark:text-cyan-300 border border-cyan-200 dark:border-cyan-800/40">
                  {quiz.quizNumber}
                </span>
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-cyan-400">
                  Timed Examination
                </span>
              </div>
              <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight">
                {quiz.title}
              </h2>
              <p className="text-xs text-slate-500 dark:text-gray-400 mt-1">
                Carefully review the assessment rules and guidelines before starting your attempt.
              </p>
            </div>

            <button
              onClick={onClose}
              className="w-9 h-9 flex items-center justify-center rounded-xl border border-slate-200 dark:border-white/10 text-slate-500 dark:text-gray-400 hover:bg-slate-100 dark:hover:bg-white/10 transition cursor-pointer"
              title="Close"
            >
              ✕
            </button>
          </div>

          {/* Quick Metrics Bar */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5 mb-7">
            <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-white/[0.02] border border-slate-200/80 dark:border-white/5 text-center">
              <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-gray-400">
                Duration
              </div>
              <div className="text-base sm:text-lg font-black text-slate-900 dark:text-white mt-0.5">
                {quiz.duration}
              </div>
            </div>

            <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-white/[0.02] border border-slate-200/80 dark:border-white/5 text-center">
              <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-gray-400">
                Questions
              </div>
              <div className="text-base sm:text-lg font-black text-slate-900 dark:text-white mt-0.5">
                {questionsList.length} Questions
              </div>
            </div>

            <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-white/[0.02] border border-slate-200/80 dark:border-white/5 text-center">
              <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-gray-400">
                Total Marks
              </div>
              <div className="text-base sm:text-lg font-black text-slate-900 dark:text-white mt-0.5">
                {quiz.points || 16} Points
              </div>
            </div>

            <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-white/[0.02] border border-slate-200/80 dark:border-white/5 text-center">
              <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-gray-400">
                Attempts
              </div>
              <div className="text-base sm:text-lg font-black text-slate-900 dark:text-white mt-0.5">
                {quiz.attemptsAllowed || 3} Allowed
              </div>
            </div>
          </div>

          {/* Exam Instructions List */}
          <div className="space-y-3 mb-6 max-h-[300px] overflow-y-auto pr-1">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-gray-400 mb-2">
              Examination Instructions & Protocol
            </h4>
            {MOCK_EXAM_INSTRUCTIONS.map((inst, idx) => (
              <div
                key={inst.id}
                className="flex items-start gap-3.5 p-3.5 rounded-2xl bg-slate-50/70 dark:bg-white/[0.02] border border-slate-200/70 dark:border-white/5 transition-colors"
              >
                <div className="w-7 h-7 rounded-lg flex items-center justify-center shrink-0 bg-cyan-100 dark:bg-cyan-950 text-cyan-700 dark:text-cyan-400 text-xs font-black">
                  {idx + 1}
                </div>
                <div>
                  <h5 className="text-xs font-bold text-slate-900 dark:text-white">
                    {inst.title}
                  </h5>
                  <p className="text-[11px] text-slate-600 dark:text-gray-400 mt-0.5 leading-relaxed">
                    {inst.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Academic Integrity Agreement */}
          <div className="p-4 rounded-2xl bg-amber-50/80 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-900/40 mb-7">
            <label className="flex items-start gap-3 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={agreedToTerms}
                onChange={(e) => setAgreedToTerms(e.target.checked)}
                className="mt-0.5 h-4 w-4 rounded text-cyan-500 focus:ring-cyan-500 border-amber-300 dark:border-amber-700"
              />
              <span className="text-xs font-medium text-amber-900 dark:text-amber-200 leading-snug">
                I understand that this assessment will run in <strong>fullscreen mode</strong>. I confirm that I will work independently without unauthorized materials or external assistance.
              </span>
            </label>
          </div>

          {/* Bottom Action Buttons */}
          <div className="flex items-center justify-between pt-4 border-t border-slate-100 dark:border-white/5">
            <button
              onClick={onClose}
              className="px-5 py-2.5 rounded-xl text-xs font-bold text-slate-600 dark:text-gray-400 hover:bg-slate-100 dark:hover:bg-white/5 transition cursor-pointer"
            >
              Cancel & Return
            </button>

            <button
              onClick={handleConfirmAndEnterExam}
              disabled={!agreedToTerms}
              className="flex items-center gap-2 px-6 py-2.5 rounded-xl text-xs sm:text-sm font-bold bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600 hover:brightness-110 text-white shadow-[0_0_15px_rgba(6,182,212,0.4)] active:scale-[0.98] transition-all disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M15 3h6v6" />
                <path d="M9 21H3v-6" />
                <path d="M21 3l-7 7" />
                <path d="M3 21l7-7" />
              </svg>
              <span>Confirm & Enter Full Screen</span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  // -------------------------------------------------------------
  // VIEW 2: FULLSCREEN IMMERSIVE EXAM VIEW
  // -------------------------------------------------------------
  return (
    <div className="fixed inset-0 z-50 w-screen h-screen flex flex-col bg-[#F8FAFC] dark:bg-[#030712] text-slate-900 dark:text-white overflow-hidden select-none transition-colors duration-200 animate-fade-in">
      {/* 1. TOP EXAM HEADER */}
      <header className="h-16 shrink-0 px-4 sm:px-6 flex items-center justify-between border-b border-slate-200/80 dark:border-white/5 bg-white/95 dark:bg-[#030712]/95 backdrop-blur-md">
        {/* Left: Quiz Info */}
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl flex items-center justify-center bg-cyan-50 dark:bg-cyan-950/60 text-cyan-600 dark:text-cyan-400 border border-cyan-200 dark:border-cyan-800/40">
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
              <polyline points="14 2 14 8 20 8" />
            </svg>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-bold text-slate-400 dark:text-gray-400">
                {quiz.quizNumber}
              </span>
              <span className="hidden sm:inline-block text-[10px] font-semibold px-2 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800/40">
                Exam Mode
              </span>
            </div>
            <h2 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white truncate max-w-xs sm:max-w-md">
              {quiz.title}
            </h2>
          </div>
        </div>

        {/* Center: Live Timer Countdown */}
        <div
          className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xl border font-mono text-xs sm:text-sm font-black transition-all ${
            isUrgentTime
              ? 'bg-red-50 dark:bg-red-950/70 border-red-300 dark:border-red-700 text-red-600 dark:text-red-400 animate-pulse'
              : 'bg-slate-100 dark:bg-white/[0.03] border-slate-200 dark:border-white/10 text-slate-800 dark:text-gray-200'
          }`}
        >
          <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="12" cy="12" r="10" />
            <polyline points="12 6 12 12 16 14" />
          </svg>
          <span>{formattedTime}</span>
        </div>

        {/* Right: Controls & Submit Button */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Fullscreen Toggle */}
          <button
            onClick={toggleFullscreen}
            className="p-2 rounded-xl border border-slate-200 dark:border-white/10 hover:bg-slate-100 dark:hover:bg-white/10 text-slate-600 dark:text-gray-400 transition cursor-pointer"
            title={isFullscreen ? 'Exit Fullscreen' : 'Enter Fullscreen'}
          >
            {isFullscreen ? (
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M8 3v3a2 2 0 0 1-2 2H3m18 0h-3a2 2 0 0 1-2-2V3m0 18v-3a2 2 0 0 1 2-2h3M3 16h3a2 2 0 0 1 2 2v3" />
              </svg>
            ) : (
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M15 3h6v6" />
                <path d="M9 21H3v-6" />
                <path d="M21 3l-7 7" />
                <path d="M3 21l7-7" />
              </svg>
            )}
          </button>

          {/* Theme Toggle Button */}
          <button
            onClick={toggleTheme}
            className="p-2 rounded-xl border border-slate-200 dark:border-white/10 hover:bg-slate-100 dark:hover:bg-white/10 text-slate-600 dark:text-gray-400 transition cursor-pointer"
            title={`Switch to ${isDark ? 'Light' : 'Dark'} Theme`}
          >
            {isDark ? (
              <svg className="w-4 h-4 text-amber-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="5" />
                <line x1="12" y1="1" x2="12" y2="3" />
                <line x1="12" y1="21" x2="12" y2="23" />
                <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
                <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
                <line x1="1" y1="12" x2="3" y2="12" />
                <line x1="21" y1="12" x2="23" y2="12" />
                <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
                <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
              </svg>
            ) : (
              <svg className="w-4 h-4 text-slate-700" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
              </svg>
            )}
          </button>

          {/* Finish & Submit Button */}
          <button
            onClick={() => setShowSubmitConfirm(true)}
            className="px-4 sm:px-5 py-2 rounded-xl text-xs sm:text-sm font-bold bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600 hover:brightness-110 text-white shadow-[0_0_15px_rgba(6,182,212,0.4)] active:scale-[0.98] transition cursor-pointer"
          >
            Submit Exam
          </button>
        </div>
      </header>

      {/* 2. MAIN BODY: QUESTION CANVAS + PALETTE SIDEBAR */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left / Center Section: Question Area */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-10 flex flex-col justify-between max-w-4xl mx-auto w-full">
          <div>
            {/* Question Header: Question number + Points + Flag for Review */}
            <div className="flex items-center justify-between pb-4 border-b border-slate-200/80 dark:border-white/10 mb-6">
              <div className="flex items-center gap-3">
                <span className="text-xs sm:text-sm font-bold px-3 py-1 rounded-xl bg-blue-50 dark:bg-cyan-500/10 text-blue-700 dark:text-cyan-400 border border-blue-200 dark:border-cyan-500/20">
                  Question {currentQuestionIndex + 1} of {questionsList.length}
                </span>
                <span className="text-xs font-semibold text-slate-400 dark:text-gray-500">
                  +1.6 Marks
                </span>
              </div>

              {/* Mark for Review Flag */}
              <button
                onClick={handleToggleFlag}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer border ${
                  flaggedQuestions[currentQuestionIndex]
                    ? 'bg-amber-50 dark:bg-amber-950/70 border-amber-300 dark:border-amber-700 text-amber-700 dark:text-amber-400'
                    : 'border-slate-200 dark:border-white/10 text-slate-600 dark:text-gray-400 hover:bg-slate-100 dark:hover:bg-white/5'
                }`}
              >
                <svg
                  className={`w-3.5 h-3.5 ${
                    flaggedQuestions[currentQuestionIndex] ? 'fill-current' : ''
                  }`}
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z" />
                  <line x1="4" y1="22" x2="4" y2="15" />
                </svg>
                <span>
                  {flaggedQuestions[currentQuestionIndex]
                    ? 'Flagged for Review'
                    : 'Mark for Review'}
                </span>
              </button>
            </div>

            {/* Question Prompt */}
            <div className="mb-7">
              <h3 className="text-base sm:text-xl font-bold text-slate-900 dark:text-white leading-relaxed">
                {currentQ.question}
              </h3>
            </div>

            {/* Option Choices */}
            <div className="space-y-3.5">
              {currentQ.options.map((option, optIdx) => {
                const isSelected = selectedAnswers[currentQuestionIndex] === optIdx;
                return (
                  <button
                    key={optIdx}
                    onClick={() => handleSelectOption(optIdx)}
                    className={`w-full text-left p-4 sm:p-5 rounded-2xl border transition-all flex items-center justify-between cursor-pointer group ${
                      isSelected
                        ? 'border-blue-500 dark:border-cyan-500 bg-blue-50/70 dark:bg-cyan-500/10 text-blue-950 dark:text-cyan-100 shadow-sm ring-1 ring-blue-500 dark:ring-cyan-500'
                        : 'border-slate-200 dark:border-white/10 bg-white dark:bg-white/[0.02] backdrop-blur-xl text-slate-800 dark:text-gray-200 hover:border-slate-300 dark:hover:border-white/20 hover:bg-slate-50 dark:hover:bg-white/[0.04]'
                    }`}
                  >
                    <div className="flex items-center gap-4">
                      {/* Letter badge: A, B, C, D */}
                      <span
                        className={`w-8 h-8 rounded-xl flex items-center justify-center text-xs font-bold border transition-colors ${
                          isSelected
                            ? 'border-blue-600 dark:border-cyan-400 bg-blue-600 dark:bg-cyan-500 text-white font-black'
                            : 'border-slate-300 dark:border-white/10 bg-slate-100 dark:bg-white/5 text-slate-600 dark:text-gray-400 group-hover:border-slate-400 dark:group-hover:border-white/20'
                        }`}
                      >
                        {String.fromCharCode(65 + optIdx)}
                      </span>
                      <span className="text-xs sm:text-sm font-semibold">{option}</span>
                    </div>

                    {/* Radio bullet checkmark */}
                    <div
                      className={`w-5 h-5 rounded-full flex items-center justify-center border transition-all ${
                        isSelected
                          ? 'border-blue-600 dark:border-cyan-400 bg-blue-600 dark:bg-cyan-500 text-white'
                          : 'border-slate-300 dark:border-white/15'
                      }`}
                    >
                      {isSelected && (
                        <div className="w-2 h-2 rounded-full bg-white" />
                      )}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Bottom Actions Bar */}
          <div className="flex items-center justify-between pt-6 border-t border-slate-200/80 dark:border-white/10 mt-8">
            <button
              onClick={() => setCurrentQuestionIndex((prev) => Math.max(0, prev - 1))}
              disabled={currentQuestionIndex === 0}
              className="px-4 sm:px-5 py-2.5 rounded-xl text-xs font-bold border border-slate-200 dark:border-white/10 text-slate-700 dark:text-gray-300 hover:bg-slate-100 dark:hover:bg-white/5 disabled:opacity-40 disabled:cursor-not-allowed transition cursor-pointer"
            >
              ← Previous
            </button>

            {selectedAnswers[currentQuestionIndex] !== undefined && (
              <button
                onClick={handleClearResponse}
                className="text-xs font-semibold text-slate-500 dark:text-gray-400 hover:text-red-500 dark:hover:text-red-400 transition cursor-pointer"
              >
                Clear Response
              </button>
            )}

            {currentQuestionIndex < questionsList.length - 1 ? (
              <button
                onClick={() =>
                  setCurrentQuestionIndex((prev) =>
                    Math.min(questionsList.length - 1, prev + 1)
                  )
                }
                className="px-6 py-2.5 rounded-xl text-xs sm:text-sm font-bold bg-slate-900 dark:bg-[#0066FF] text-white hover:opacity-90 dark:hover:bg-blue-600 dark:shadow-[0_0_15px_rgba(0,102,255,0.4)] transition cursor-pointer shadow-xs"
              >
                Next Question →
              </button>
            ) : (
              <button
                onClick={() => setShowSubmitConfirm(true)}
                className="px-6 py-2.5 rounded-xl text-xs sm:text-sm font-bold bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600 text-white hover:brightness-110 shadow-[0_0_15px_rgba(6,182,212,0.4)] transition cursor-pointer"
              >
                Review & Submit
              </button>
            )}
          </div>
        </main>

        {/* Right Section: Question Navigator / Palette Sidebar */}
        <aside className="hidden md:flex w-72 lg:w-80 shrink-0 border-l border-slate-200/80 dark:border-white/10 bg-white dark:bg-[#030712] p-5 flex-col justify-between overflow-y-auto">
          <div>
            {/* Candidate Header */}
            <div className="flex items-center gap-3 p-3 rounded-2xl bg-slate-50 dark:bg-white/[0.02] border border-slate-200/80 dark:border-white/10 mb-5">
              <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-cyan-400 to-blue-600 text-white flex items-center justify-center font-bold text-xs">
                ST
              </div>
              <div className="min-w-0">
                <div className="text-xs font-bold text-slate-800 dark:text-white truncate">
                  Candidate Session
                </div>
                <div className="text-[10px] text-emerald-600 dark:text-emerald-400 font-semibold flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping" />
                  Live Exam Connected
                </div>
              </div>
            </div>

            {/* Navigator Title */}
            <div className="flex items-center justify-between mb-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-gray-400">
                Question Palette
              </h4>
              <span className="text-[11px] font-semibold text-slate-400 dark:text-gray-500">
                {answeredCount}/{questionsList.length} Answered
              </span>
            </div>

            {/* Interactive Question Grid */}
            <div className="grid grid-cols-5 gap-2.5 mb-6">
              {questionsList.map((_, idx) => {
                const isCurrent = idx === currentQuestionIndex;
                const isAnswered = selectedAnswers[idx] !== undefined;
                const isFlagged = Boolean(flaggedQuestions[idx]);

                let buttonStyle = 'bg-slate-100 dark:bg-white/5 text-slate-600 dark:text-gray-400 hover:bg-slate-200 dark:hover:bg-white/10';

                if (isFlagged) {
                  buttonStyle = 'bg-amber-500 text-white shadow-xs';
                } else if (isAnswered) {
                  buttonStyle = 'bg-emerald-600 text-white shadow-xs';
                }

                return (
                  <button
                    key={idx}
                    onClick={() => setCurrentQuestionIndex(idx)}
                    className={`h-10 rounded-xl text-xs font-black transition-all cursor-pointer relative ${buttonStyle} ${
                      isCurrent
                        ? 'ring-2 ring-blue-500 dark:ring-cyan-400 ring-offset-2 dark:ring-offset-[#030712] scale-105'
                        : ''
                    }`}
                  >
                    <span>{idx + 1}</span>
                    {isFlagged && (
                      <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-amber-300 ring-2 ring-white dark:ring-[#030712]" />
                    )}
                  </button>
                );
              })}
            </div>

            {/* Status Legend */}
            <div className="space-y-2 p-3.5 rounded-2xl bg-slate-50 dark:bg-white/[0.02] border border-slate-200/80 dark:border-white/10 text-[11px]">
              <div className="flex items-center gap-2 text-slate-700 dark:text-gray-300">
                <span className="w-3.5 h-3.5 rounded-md bg-emerald-600 shrink-0" />
                <span>Answered ({answeredCount})</span>
              </div>
              <div className="flex items-center gap-2 text-slate-700 dark:text-gray-300">
                <span className="w-3.5 h-3.5 rounded-md bg-amber-500 shrink-0" />
                <span>Marked for Review ({flaggedCount})</span>
              </div>
              <div className="flex items-center gap-2 text-slate-700 dark:text-gray-300">
                <span className="w-3.5 h-3.5 rounded-md bg-slate-200 dark:bg-white/10 shrink-0" />
                <span>Not Answered ({questionsList.length - answeredCount})</span>
              </div>
            </div>
          </div>

          {/* Sidebar Bottom Action */}
          <div className="pt-4 border-t border-slate-100 dark:border-white/10">
            <button
              onClick={() => setShowSubmitConfirm(true)}
              className="w-full py-2.5 rounded-xl text-xs font-bold bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600 hover:brightness-110 text-white shadow-[0_0_15px_rgba(6,182,212,0.4)] active:scale-[0.98] transition cursor-pointer text-center"
            >
              Finish & Submit Assessment
            </button>
          </div>
        </aside>
      </div>

      {/* 3. SUBMIT CONFIRMATION SUMMARY DIALOG */}
      <QuizSubmitConfirmModal
        isOpen={showSubmitConfirm}
        onClose={() => setShowSubmitConfirm(false)}
        onConfirmSubmit={handleFinalSubmit}
        totalQuestions={questionsList.length}
        answeredCount={answeredCount}
        flaggedCount={flaggedCount}
        timeRemaining={formattedTime}
      />
    </div>
  );
}

export default QuizAttemptModal;
