import React, { useState, useMemo } from 'react';
import { QuizCard } from '../components/QuizCard';
import { QuizAttemptModal } from '../components/QuizAttemptModal';
import { QuizResultsModal } from '../components/QuizResultsModal';
import { CreateQuizModal } from '../components/CreateQuizModal';
import { MOCK_COURSE_QUIZZES } from '../../../utils/mockData';

export function QuizzesTab({ courseId: _courseId, isCreatorOrStaff, isEnrolled = true }) {
  // Initial quizzes matching the reference UI mockup loaded from shared mockData
  const [quizzes, setQuizzes] = useState(MOCK_COURSE_QUIZZES);

  // Search & Filter state
  const [searchQuery, setSearchQuery] = useState('');
  const [topSearch, setTopSearch] = useState('');
  const [filterTab, setFilterTab] = useState('All'); // 'All' | 'Active' | 'Completed'

  // Modals state
  const [activeAttemptQuiz, setActiveAttemptQuiz] = useState(null);
  const [activeResultsQuiz, setActiveResultsQuiz] = useState(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  // Filter quizzes based on search query and status filter
  const filteredQuizzes = useMemo(() => {
    return quizzes.filter((quiz) => {
      // Status filtering
      if (filterTab === 'Active' && quiz.status === 'Completed') return false;
      if (filterTab === 'Completed' && quiz.status !== 'Completed') return false;

      // Search query filtering
      const query = (searchQuery || topSearch).toLowerCase().trim();
      if (!query) return true;

      const titleMatch = quiz.title.toLowerCase().includes(query);
      const numberMatch = quiz.quizNumber.toLowerCase().includes(query);
      return titleMatch || numberMatch;
    });
  }, [quizzes, searchQuery, topSearch, filterTab]);

  // Handle card button action
  const handleQuizAction = (quiz, actionType) => {
    if (actionType === 'View Results') {
      setActiveResultsQuiz(quiz);
    } else {
      // 'Start Attempt' or 'Continue Attempt'
      setActiveAttemptQuiz(quiz);
    }
  };

  // Handle quiz attempt submission
  const handleAttemptSubmit = ({ quizId, score, answers: _answers }) => {
    setQuizzes((prev) =>
      prev.map((q) => {
        if (q.id === quizId) {
          const newUsed = Math.min(q.attemptsAllowed, (q.attemptsUsed || 0) + 1);
          return {
            ...q,
            status: 'Completed',
            attemptsUsed: newUsed,
            score: score,
            buttonText: 'View Results',
          };
        }
        return q;
      })
    );

    const completedQuiz = quizzes.find((q) => q.id === quizId);
    setActiveAttemptQuiz(null);
    if (completedQuiz) {
      setActiveResultsQuiz({
        ...completedQuiz,
        status: 'Completed',
        score,
        attemptsUsed: (completedQuiz.attemptsUsed || 0) + 1,
      });
    }
  };

  // Handle retaking quiz
  const handleRetakeQuiz = (quiz) => {
    setActiveResultsQuiz(null);
    setActiveAttemptQuiz(quiz);
  };

  // Add new quiz created by instructor
  const handleCreateQuiz = (newQuiz) => {
    const quizCount = quizzes.length + 1;
    const fullQuiz = {
      ...newQuiz,
      quizNumber: `Quiz ${quizCount}`,
    };
    setQuizzes((prev) => [...prev, fullQuiz]);
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto space-y-6 transition-colors duration-200">
      {/* 1. TOP HEADER BAR: "Course Quizzes" + Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-50">
          Course Quizzes
        </h1>

        {/* Top Right Controls: Search, Filter Button, Profile / New Quiz */}
        <div className="flex items-center gap-2 sm:gap-3 flex-wrap">
          {/* Top Compact Search */}
          <div className="relative">
            <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400 dark:text-gray-500">
              <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="11" cy="11" r="8" />
                <line x1="21" y1="21" x2="16.65" y2="16.65" />
              </svg>
            </span>
            <input
              type="text"
              placeholder="Search"
              value={topSearch}
              onChange={(e) => setTopSearch(e.target.value)}
              className="w-32 sm:w-44 pl-8 pr-3 py-1.5 text-xs rounded-xl bg-white dark:bg-white/[0.03] border border-slate-200/90 dark:border-white/10 text-slate-800 dark:text-white placeholder-slate-400 dark:placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-cyan-500 transition-colors"
            />
          </div>

          {/* Filter Icon Button */}
          <button
            onClick={() => {
              // Cycle or toggle filter
              setFilterTab((prev) => (prev === 'All' ? 'Active' : prev === 'Active' ? 'Completed' : 'All'));
            }}
            title="Filter Quizzes"
            className="h-8 w-8 flex items-center justify-center rounded-xl bg-white dark:bg-white/[0.03] border border-slate-200/90 dark:border-white/10 text-slate-600 dark:text-gray-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-50 dark:hover:bg-white/[0.08] transition cursor-pointer shadow-2xs"
          >
            <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3" />
            </svg>
          </button>

          {/* Profile Button */}
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white dark:bg-white/[0.03] border border-slate-200/90 dark:border-white/10 text-slate-700 dark:text-gray-300 text-xs font-semibold shadow-2xs">
            <svg className="w-3.5 h-3.5 text-slate-500 dark:text-gray-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
              <circle cx="8.5" cy="7" r="4" />
              <line x1="20" y1="8" x2="20" y2="14" />
              <line x1="23" y1="11" x2="17" y2="11" />
            </svg>
            <span>Profile</span>
            <svg className="w-3 h-3 text-slate-400 dark:text-gray-500 ml-0.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <polyline points="6 9 12 15 18 9" />
            </svg>
          </div>

          {/* Creator / Staff '+ New Quiz' Button */}
          {isCreatorOrStaff && (
            <button
              onClick={() => setIsCreateModalOpen(true)}
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-700 dark:bg-[#0066FF] dark:hover:bg-[#0052cc] text-white text-xs font-bold shadow-xs dark:shadow-[0_0_15px_rgba(0,102,255,0.4)] transition cursor-pointer"
            >
              <span className="text-sm leading-none">+</span>
              <span>New Quiz</span>
            </button>
          )}
        </div>
      </div>

      {/* 2. SEARCH & FILTER ROW */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 pt-1">
        {/* Main Search Input */}
        <div className="relative flex-1 max-w-xl">
          <input
            type="text"
            placeholder="Search quizz..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full px-4 py-2.5 text-xs sm:text-sm rounded-xl bg-white dark:bg-white/[0.03] border border-slate-200/90 dark:border-white/10 text-slate-800 dark:text-white placeholder-slate-400 dark:placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-cyan-500 shadow-2xs transition-colors"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute inset-y-0 right-0 pr-3 flex items-center text-xs text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer"
            >
              ✕
            </button>
          )}
        </div>

        {/* Filter Tabs: All, Active, Completed */}
        <div className="flex items-center gap-1 self-start sm:self-center p-1 rounded-xl bg-slate-100 dark:bg-white/[0.03] border border-slate-200/80 dark:border-white/10">
          {['All', 'Active', 'Completed'].map((tab) => {
            const isActive = filterTab === tab;
            return (
              <button
                key={tab}
                onClick={() => setFilterTab(tab)}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all duration-150 cursor-pointer ${
                  isActive
                    ? 'bg-slate-900 dark:bg-white/10 text-white shadow-xs border border-transparent dark:border-white/15'
                    : 'text-slate-600 dark:text-gray-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-200/60 dark:hover:bg-white/[0.05]'
                }`}
              >
                {tab}
              </button>
            );
          })}
        </div>
      </div>

      {/* 3. SECTION LABEL: "List Cards" */}
      <div className="pt-2">
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs font-semibold text-slate-500 dark:text-[#A0AAB4] tracking-wide">
            List Cards
          </span>
          <span className="text-[11px] font-medium text-slate-400 dark:text-slate-400">
            {filteredQuizzes.length} {filteredQuizzes.length === 1 ? 'quiz' : 'quizzes'}
          </span>
        </div>

        {/* 4. LIST OF CARDS */}
        {filteredQuizzes.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-slate-300 dark:border-zinc-800 p-12 text-center">
            <svg
              className="w-10 h-10 mx-auto text-slate-400 dark:text-zinc-600 mb-3"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
            >
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
              <circle cx="11" cy="14" r="3" />
              <line x1="13.5" y1="16.5" x2="16" y2="19" />
            </svg>
            <h4 className="text-sm font-bold text-slate-800 dark:text-zinc-200">No Quizzes Found</h4>
            <p className="text-xs text-slate-500 dark:text-zinc-400 mt-1 max-w-sm mx-auto">
              No quizzes match your current filter or search criteria.
            </p>
            {(searchQuery || topSearch || filterTab !== 'All') && (
              <button
                onClick={() => {
                  setSearchQuery('');
                  setTopSearch('');
                  setFilterTab('All');
                }}
                className="mt-3 text-xs font-bold text-cyan-600 dark:text-cyan-400 hover:underline cursor-pointer"
              >
                Clear all filters
              </button>
            )}
          </div>
        ) : (
          <div className="space-y-4">
            {filteredQuizzes.map((quiz) => (
              <QuizCard
                key={quiz.id}
                quiz={quiz}
                isEnrolled={isEnrolled}
                onAction={handleQuizAction}
              />
            ))}
          </div>
        )}
      </div>

      {/* Interactive Modals */}
      <QuizAttemptModal
        quiz={activeAttemptQuiz}
        isOpen={Boolean(activeAttemptQuiz)}
        onClose={() => setActiveAttemptQuiz(null)}
        onSubmit={handleAttemptSubmit}
      />

      <QuizResultsModal
        quiz={activeResultsQuiz}
        isOpen={Boolean(activeResultsQuiz)}
        onClose={() => setActiveResultsQuiz(null)}
        onRetake={handleRetakeQuiz}
      />

      <CreateQuizModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onCreate={handleCreateQuiz}
      />
    </div>
  );
}

export default QuizzesTab;
