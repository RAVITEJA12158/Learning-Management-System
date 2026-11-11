import React, { useState, useEffect, useMemo } from 'react';
import { QuizCard } from '../components/QuizCard';
import { QuizAttemptModal } from '../components/QuizAttemptModal';
import { QuizResultsModal } from '../components/QuizResultsModal';
import { CreateQuizModal } from '../components/CreateQuizModal';
import { quizService } from '../../../services/courseService';

function QuizzesTab({
  courseId,
  isCreatorOrStaff,
  isEnrolled = true
}) {
  const [quizzes, setQuizzes] = useState([]);

  // Search & Filter state
  const [searchQuery, setSearchQuery] = useState('');
  const [filterTab, setFilterTab] = useState('All'); // 'All' | 'Active' | 'Completed'

  // Modals state
  const [activeAttemptQuiz, setActiveAttemptQuiz] = useState(null);
  const [activeResultsQuiz, setActiveResultsQuiz] = useState(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  useEffect(() => {
    let isMounted = true;
    quizService.fetchByCourse(courseId).then(list => {
      if (isMounted && Array.isArray(list)) {
        setQuizzes(list);
      }
    });
    return () => { isMounted = false; };
  }, [courseId]);

  const filteredQuizzes = useMemo(() => {
    return quizzes.filter(quiz => {
      if (filterTab === 'Active' && quiz.status === 'Completed') return false;
      if (filterTab === 'Completed' && quiz.status !== 'Completed') return false;
      const query = searchQuery.toLowerCase().trim();
      if (!query) return true;
      const titleMatch = quiz.title?.toLowerCase().includes(query);
      const numberMatch = quiz.quizNumber?.toLowerCase().includes(query);
      return titleMatch || numberMatch;
    });
  }, [quizzes, searchQuery, filterTab]);

  const handleQuizAction = (quiz, actionType) => {
    if (actionType === 'View Results') {
      setActiveResultsQuiz(quiz);
    } else {
      setActiveAttemptQuiz(quiz);
    }
  };

  const handleAttemptSubmit = async ({
    quizId,
    answers,
    score
  }) => {
    try {
      await quizService.submitAttempt(quizId, answers || {});
      const refreshed = await quizService.fetchByCourse(courseId);
      setQuizzes(refreshed);
    } catch {
      setQuizzes(prev => prev.map(q => {
        if (q.id === quizId) {
          const newUsed = Math.min(q.attemptsAllowed, (q.attemptsUsed || 0) + 1);
          return {
            ...q,
            status: 'Completed',
            attemptsUsed: newUsed,
            score,
            buttonText: 'View Results'
          };
        }
        return q;
      }));
    }
    const completedQuiz = quizzes.find(q => q.id === quizId);
    setActiveAttemptQuiz(null);
    if (completedQuiz) {
      setActiveResultsQuiz({
        ...completedQuiz,
        status: 'Completed',
        score: score ?? completedQuiz.score ?? 85,
        attemptsUsed: (completedQuiz.attemptsUsed || 0) + 1
      });
    }
  };

  const handleRetakeQuiz = quiz => {
    setActiveResultsQuiz(null);
    setActiveAttemptQuiz(quiz);
  };

  const handleCreateQuiz = async newQuiz => {
    try {
      await quizService.create({
        ...newQuiz,
        courseId
      });
      const refreshed = await quizService.fetchByCourse(courseId);
      setQuizzes(refreshed);
    } catch {
      const quizCount = quizzes.length + 1;
      const fullQuiz = {
        ...newQuiz,
        quizNumber: `Quiz ${quizCount}`
      };
      setQuizzes(prev => [...prev, fullQuiz]);
    }
    setIsCreateModalOpen(false);
  };
  return /*#__PURE__*/React.createElement("div", {
    className: "p-6 max-w-7xl mx-auto space-y-6 transition-colors duration-200"
  }, /*#__PURE__*/React.createElement("div", {
    className: "flex flex-col sm:flex-row sm:items-center justify-between gap-4"
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("h2", {
    className: "text-xl sm:text-2xl font-black tracking-tight text-slate-900 dark:text-white"
  }, "Timed Course Quizzes & Assessments"), /*#__PURE__*/React.createElement("p", {
    className: "text-xs text-slate-500 dark:text-gray-400 mt-0.5"
  }, "Take fullscreen timed assessments with question flagging, live countdowns, and instant auto-grading.")), isCreatorOrStaff && /*#__PURE__*/React.createElement("button", {
    onClick: () => setIsCreateModalOpen(true),
    className: "flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 dark:bg-[#0066FF] dark:hover:bg-[#0052cc] text-white text-xs font-bold shadow-xs dark:shadow-[0_0_15px_rgba(0,102,255,0.4)] transition cursor-pointer self-start sm:self-auto"
  }, /*#__PURE__*/React.createElement("span", {
    className: "text-sm leading-none"
  }, "+"), /*#__PURE__*/React.createElement("span", null, "Author New Quiz"))), /*#__PURE__*/React.createElement("div", {
    className: "flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 pt-1"
  }, /*#__PURE__*/React.createElement("div", {
    className: "relative flex-1 max-w-xl"
  }, /*#__PURE__*/React.createElement("input", {
    type: "text",
    placeholder: "Search quizzes by title or quiz number...",
    value: searchQuery,
    onChange: e => setSearchQuery(e.target.value),
    className: "w-full px-4 py-2.5 text-xs sm:text-sm rounded-xl bg-white dark:bg-white/[0.03] border border-slate-200/90 dark:border-white/10 text-slate-800 dark:text-white placeholder-slate-400 dark:placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-cyan-500 shadow-2xs transition-colors"
  }), searchQuery && /*#__PURE__*/React.createElement("button", {
    onClick: () => setSearchQuery(''),
    className: "absolute inset-y-0 right-0 pr-3 flex items-center text-xs text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer"
  }, "\u2715")), /*#__PURE__*/React.createElement("div", {
    className: "flex items-center gap-1 self-start sm:self-center p-1 rounded-xl bg-slate-100 dark:bg-white/[0.03] border border-slate-200/80 dark:border-white/10"
  }, ['All', 'Active', 'Completed'].map(tab => {
    const isActive = filterTab === tab;
    return /*#__PURE__*/React.createElement("button", {
      key: tab,
      onClick: () => setFilterTab(tab),
      className: `px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all duration-150 cursor-pointer ${isActive ? 'bg-slate-900 dark:bg-white/10 text-white shadow-xs border border-transparent dark:border-white/15' : 'text-slate-600 dark:text-gray-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-200/60 dark:hover:bg-white/[0.05]'}`
    }, tab);
  }))), /*#__PURE__*/React.createElement("div", {
    className: "pt-2"
  }, /*#__PURE__*/React.createElement("div", {
    className: "flex items-center justify-between mb-3"
  }, /*#__PURE__*/React.createElement("span", {
    className: "text-xs font-semibold text-slate-500 dark:text-[#A0AAB4] tracking-wide"
  }, "Available Assessments"), /*#__PURE__*/React.createElement("span", {
    className: "text-[11px] font-medium text-slate-400 dark:text-slate-400"
  }, filteredQuizzes.length, " ", filteredQuizzes.length === 1 ? 'quiz' : 'quizzes')), filteredQuizzes.length === 0 ? /*#__PURE__*/React.createElement("div", {
    className: "rounded-2xl border border-dashed border-slate-300 dark:border-zinc-800 p-12 text-center"
  }, /*#__PURE__*/React.createElement("h4", {
    className: "text-sm font-bold text-slate-800 dark:text-zinc-200"
  }, "No Quizzes Found"), /*#__PURE__*/React.createElement("p", {
    className: "text-xs text-slate-500 dark:text-zinc-400 mt-1 max-w-sm mx-auto"
  }, "No quizzes match your current filter or search criteria."), (searchQuery || filterTab !== 'All') && /*#__PURE__*/React.createElement("button", {
    onClick: () => {
      setSearchQuery('');
      setFilterTab('All');
    },
    className: "mt-3 text-xs font-bold text-cyan-600 dark:text-cyan-400 hover:underline cursor-pointer"
  }, "Clear all filters")) : /*#__PURE__*/React.createElement("div", {
    className: "space-y-4"
  }, filteredQuizzes.map(quiz => /*#__PURE__*/React.createElement(QuizCard, {
    key: quiz.id,
    quiz: quiz,
    isEnrolled: isEnrolled,
    onAction: handleQuizAction
  })))), /*#__PURE__*/React.createElement(QuizAttemptModal, {
    quiz: activeAttemptQuiz,
    isOpen: Boolean(activeAttemptQuiz),
    onClose: () => setActiveAttemptQuiz(null),
    onSubmit: handleAttemptSubmit
  }), /*#__PURE__*/React.createElement(QuizResultsModal, {
    quiz: activeResultsQuiz,
    isOpen: Boolean(activeResultsQuiz),
    onClose: () => setActiveResultsQuiz(null),
    onRetake: handleRetakeQuiz
  }), /*#__PURE__*/React.createElement(CreateQuizModal, {
    isOpen: isCreateModalOpen,
    onClose: () => setIsCreateModalOpen(false),
    onCreate: handleCreateQuiz
  }));
}
var _default = QuizzesTab;

export { QuizzesTab };

export default _default;
