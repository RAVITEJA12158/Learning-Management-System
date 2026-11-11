import React, { useState, useEffect, useMemo } from 'react';
import { QuizCard } from '../components/QuizCard';
import { QuizAttemptModal } from '../components/QuizAttemptModal';
import { QuizResultsModal } from '../components/QuizResultsModal';
import { CreateQuizModal } from '../components/CreateQuizModal';
import { quizService } from '../../../services/courseService';

function QuizzesTab({ courseId, isCreatorOrStaff, isEnrolled = true }) {
  const [quizzes, setQuizzes] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterTab, setFilterTab] = useState('All');

  const [activeAttemptQuiz, setActiveAttemptQuiz] = useState(null);
  const [activeResultsQuiz, setActiveResultsQuiz] = useState(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  useEffect(() => {
    let isMounted = true;
    quizService.fetchByCourse(courseId).then((list) => {
      if (isMounted && Array.isArray(list)) {
        setQuizzes(list);
      }
    });
    return () => {
      isMounted = false;
    };
  }, [courseId]);

  const filteredQuizzes = useMemo(() => {
    return quizzes.filter((quiz) => {
      if (filterTab === 'Active' && quiz.status === 'Completed') return false;
      if (filterTab === 'Completed' && quiz.status !== 'Completed') return false;
      const query = searchQuery.toLowerCase().trim();
      if (!query) return true;
      const titleMatch = quiz.title?.toLowerCase().includes(query);
      const numberMatch = quiz.quizNumber?.toLowerCase().includes(query);
      return titleMatch || numberMatch;
    });
  }, [quizzes, searchQuery, filterTab]);

  const handleQuizAction = async (quiz, actionType) => {
    if (actionType === 'View Results') {
      let attemptDetail = null;
      if (quiz.latestAttemptId) {
        attemptDetail = await quizService.getAttemptDetails(quiz.latestAttemptId);
      } else {
        const attempts = await quizService.getAttempts(quiz.id);
        if (attempts.length > 0) {
          attemptDetail = await quizService.getAttemptDetails(attempts[0].id);
        }
      }
      setActiveResultsQuiz({
        ...quiz,
        ...(attemptDetail ? { score: attemptDetail.score, answers: attemptDetail.answers } : {}),
      });
    } else {
      const fullQuiz = await quizService.getById(quiz.id);
      setActiveAttemptQuiz({
        ...quiz,
        ...(fullQuiz || {}),
      });
    }
  };

  const handleAttemptSubmit = async ({ quizId, answers }) => {
    try {
      const res = await quizService.submitAttempt(quizId, answers || []);
      const refreshed = await quizService.fetchByCourse(courseId);
      setQuizzes(refreshed);
      const completedQuiz = refreshed.find((q) => q.id === quizId) || quizzes.find((q) => q.id === quizId);
      setActiveAttemptQuiz(null);
      if (completedQuiz) {
        setActiveResultsQuiz({
          ...completedQuiz,
          status: 'Completed',
          score: res?.score ?? completedQuiz.score ?? 0,
          totalMarks: res?.totalMarks ?? completedQuiz.totalMarks ?? 20,
          answers: res?.answers || [],
        });
      }
    } catch (err) {
      console.error('Quiz submission failed:', err);
      setActiveAttemptQuiz(null);
    }
  };

  const handleRetakeQuiz = async (quiz) => {
    setActiveResultsQuiz(null);
    const fullQuiz = await quizService.getById(quiz.id);
    setActiveAttemptQuiz({
      ...quiz,
      ...(fullQuiz || {}),
    });
  };

  const handleCreateQuiz = async (newQuiz) => {
    try {
      await quizService.create({
        ...newQuiz,
        courseId,
      });
      const refreshed = await quizService.fetchByCourse(courseId);
      setQuizzes(refreshed);
      setIsCreateModalOpen(false);
    } catch (err) {
      console.error('Failed to create quiz:', err);
    }
  };

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6 transition-colors duration-200">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-black tracking-tight text-slate-900 dark:text-white">
            Timed Course Quizzes & Assessments
          </h2>
          <p className="text-xs text-slate-500 dark:text-gray-400 mt-0.5">
            Take fullscreen timed assessments with question flagging, live countdowns, and instant auto-grading.
          </p>
        </div>
        {isCreatorOrStaff && (
          <button
            onClick={() => setIsCreateModalOpen(true)}
            className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 dark:bg-[#0066FF] dark:hover:bg-[#0052cc] text-white text-xs font-bold shadow-xs dark:shadow-[0_0_15px_rgba(0,102,255,0.4)] transition cursor-pointer self-start sm:self-auto"
          >
            <span className="text-sm leading-none">+</span>
            <span>Author New Quiz</span>
          </button>
        )}
      </div>

      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 pt-1">
        <div className="relative flex-1 max-w-xl">
          <input
            type="text"
            placeholder="Search quizzes by title or quiz number..."
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

      <div className="pt-2">
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs font-semibold text-slate-500 dark:text-[#A0AAB4] tracking-wide">
            Available Assessments
          </span>
          <span className="text-[11px] font-medium text-slate-400 dark:text-slate-400">
            {filteredQuizzes.length} {filteredQuizzes.length === 1 ? 'quiz' : 'quizzes'}
          </span>
        </div>

        {filteredQuizzes.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-slate-300 dark:border-zinc-800 p-12 text-center">
            <h4 className="text-sm font-bold text-slate-800 dark:text-zinc-200">No Quizzes Found</h4>
            <p className="text-xs text-slate-500 dark:text-zinc-400 mt-1 max-w-sm mx-auto">
              No quizzes match your current filter or search criteria.
            </p>
            {(searchQuery || filterTab !== 'All') && (
              <button
                onClick={() => {
                  setSearchQuery('');
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

export { QuizzesTab };
export default QuizzesTab;
