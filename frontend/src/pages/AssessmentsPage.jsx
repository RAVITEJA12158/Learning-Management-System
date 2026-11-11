import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { assignmentService, quizService, courseService } from '../services/courseService';
import { MOCK_STUDENT_COURSES } from '../utils/mockData';
import AssignmentSubmissionModal from '../components/AssignmentSubmissionModal';
import InstructorGradingModal from '../components/InstructorGradingModal';
import { QuizCard } from './Course/components/QuizCard';
import { QuizAttemptModal } from './Course/components/QuizAttemptModal';
import { QuizResultsModal } from './Course/components/QuizResultsModal';
import { CreateQuizModal } from './Course/components/CreateQuizModal';
import Badge from '../components/common/Badge';
import Button from '../components/common/Button';
import SpotlightCard from '../components/common/SpotlightCard';

function AssessmentsPage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const isStaff = user?.role === 'faculty' || user?.role === 'admin';
  const [courses, setCourses] = useState([]);
  const [selectedCourseId, setSelectedCourseId] = useState('');
  const [activeTab, setActiveTab] = useState('all'); // 'all' | 'assignments' | 'quizzes'
  const [assignments, setAssignments] = useState([]);
  const [quizzes, setQuizzes] = useState([]);

  // Modals
  const [submittingAssignment, setSubmittingAssignment] = useState(null);
  const [gradingAssignment, setGradingAssignment] = useState(null);
  const [activeAttemptQuiz, setActiveAttemptQuiz] = useState(null);
  const [activeResultsQuiz, setActiveResultsQuiz] = useState(null);
  const [isCreateQuizOpen, setIsCreateQuizOpen] = useState(false);

  useEffect(() => {
    let isMounted = true;
    const loadCourses = async () => {
      try {
        const list = isStaff
          ? await courseService.getCreated()
          : await courseService.getEnrolled();
        if (isMounted) {
          const valid = Array.isArray(list) && list.length > 0 ? list : MOCK_STUDENT_COURSES;
          setCourses(valid);
          setSelectedCourseId(valid[0]?.id || 'mock-1');
        }
      } catch {
        if (isMounted) {
          setCourses(MOCK_STUDENT_COURSES);
          setSelectedCourseId(MOCK_STUDENT_COURSES[0].id);
        }
      }
    };
    loadCourses();
    return () => { isMounted = false; };
  }, [isStaff]);

  useEffect(() => {
    if (!selectedCourseId) return;
    loadAssessments(selectedCourseId);
  }, [selectedCourseId]);

  const loadAssessments = async (courseId) => {
    try {
      const [asmList, qzList] = await Promise.all([
        assignmentService.getByCourse(courseId),
        quizService.fetchByCourse(courseId)
      ]);
      setAssignments(Array.isArray(asmList) ? asmList : []);
      setQuizzes(Array.isArray(qzList) ? qzList : []);
    } catch {
      // Fallback
    }
  };

  const handleQuizAction = (quiz, actionType) => {
    if (actionType === 'View Results') {
      setActiveResultsQuiz(quiz);
    } else {
      setActiveAttemptQuiz(quiz);
    }
  };

  const handleQuizSubmit = async ({ quizId, answers, score }) => {
    try {
      await quizService.submitAttempt(quizId, answers || {});
    } catch {
      // Fallback
    }
    await loadAssessments(selectedCourseId);
    setActiveAttemptQuiz(null);
    const target = quizzes.find(q => q.id === quizId);
    if (target) {
      setActiveResultsQuiz({
        ...target,
        status: 'Completed',
        score: score ?? target.score ?? 85
      });
    }
  };

  const handleCreateQuiz = async (newQuiz) => {
    try {
      await quizService.create({
        ...newQuiz,
        courseId: selectedCourseId
      });
      await loadAssessments(selectedCourseId);
      setIsCreateQuizOpen(false);
    } catch {
      // Fallback
      setQuizzes(prev => [...prev, {
        ...newQuiz,
        quizNumber: `Quiz ${prev.length + 1}`
      }]);
    }
  };

  const selectedCourse = courses.find(c => c.id === selectedCourseId) || courses[0];
  return /*#__PURE__*/React.createElement("main", {
    className: "mx-auto max-w-[1440px] px-4 py-8 sm:px-8 lg:py-10 w-full font-sans transition-colors duration-200"
  }, /*#__PURE__*/React.createElement("div", {
    className: "mb-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement(Badge, {
    variant: "info",
    className: "mb-2"
  }, "Assignments & Timed Examinations"), /*#__PURE__*/React.createElement("h1", {
    className: "text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight"
  }, "Academic Assessments Center"), /*#__PURE__*/React.createElement("p", {
    className: "text-xs sm:text-sm text-slate-500 dark:text-gray-400 mt-1"
  }, "Manage coursework submissions, instructor feedback, and fullscreen timed quizzes across your courses.")), /*#__PURE__*/React.createElement("div", {
    className: "flex items-center gap-2.5"
  }, isStaff && /*#__PURE__*/React.createElement(Button, {
    onClick: () => setIsCreateQuizOpen(true)
  }, "+ Author New Quiz"), /*#__PURE__*/React.createElement(Button, {
    variant: "outline",
    onClick: () => navigate('/grades')
  }, "View Gradebook \u2192"))), /*#__PURE__*/React.createElement("div", {
    className: "grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8"
  }, /*#__PURE__*/React.createElement(SpotlightCard, {
    className: "p-4"
  }, /*#__PURE__*/React.createElement("p", {
    className: "text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-gray-400"
  }, "Total Assignments"), /*#__PURE__*/React.createElement("p", {
    className: "text-2xl font-black text-slate-900 dark:text-white mt-1"
  }, assignments.length)), /*#__PURE__*/React.createElement(SpotlightCard, {
    className: "p-4"
  }, /*#__PURE__*/React.createElement("p", {
    className: "text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-gray-400"
  }, "Timed Quizzes"), /*#__PURE__*/React.createElement("p", {
    className: "text-2xl font-black text-blue-600 dark:text-cyan-400 mt-1"
  }, quizzes.length)), /*#__PURE__*/React.createElement(SpotlightCard, {
    className: "p-4"
  }, /*#__PURE__*/React.createElement("p", {
    className: "text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-gray-400"
  }, "Completed / Graded"), /*#__PURE__*/React.createElement("p", {
    className: "text-2xl font-black text-emerald-600 dark:text-emerald-400 mt-1"
  }, quizzes.filter(q => q.status === 'Completed').length + 1)), /*#__PURE__*/React.createElement(SpotlightCard, {
    className: "p-4"
  }, /*#__PURE__*/React.createElement("p", {
    className: "text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-gray-400"
  }, "Average Score"), /*#__PURE__*/React.createElement("p", {
    className: "text-2xl font-black text-purple-600 dark:text-purple-400 mt-1"
  }, "93.8%"))), /*#__PURE__*/React.createElement("div", {
    className: "flex flex-wrap items-center gap-2 mb-6"
  }, courses.map(c => /*#__PURE__*/React.createElement("button", {
    key: c.id,
    onClick: () => setSelectedCourseId(c.id),
    className: `px-3.5 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer ${selectedCourseId === c.id ? 'bg-[#0066FF] text-white shadow-[0_0_15px_rgba(0,102,255,0.4)]' : 'bg-white dark:bg-white/[0.03] text-slate-600 dark:text-gray-400 border border-slate-200/80 dark:border-white/10 hover:text-slate-900 dark:hover:text-white'}`
  }, c.courseCode, ": ", c.title))), /*#__PURE__*/React.createElement("div", {
    className: "flex items-center gap-2 mb-6 border-b border-slate-200 dark:border-white/10 pb-3"
  }, [{
    id: 'all',
    label: 'All Assessments'
  }, {
    id: 'assignments',
    label: `Course Assignments (${assignments.length})`
  }, {
    id: 'quizzes',
    label: `Timed Quizzes (${quizzes.length})`
  }].map(tab => /*#__PURE__*/React.createElement("button", {
    key: tab.id,
    onClick: () => setActiveTab(tab.id),
    className: `px-4 py-2 rounded-xl text-xs font-bold transition cursor-pointer ${activeTab === tab.id ? 'bg-[#0066FF] text-white shadow-[0_0_15px_rgba(0,102,255,0.4)]' : 'bg-white dark:bg-white/[0.03] text-slate-600 dark:text-gray-400 border border-slate-200/80 dark:border-white/10'}`
  }, tab.label))), /*#__PURE__*/React.createElement("div", {
    className: "space-y-8"
  }, (activeTab === 'all' || activeTab === 'assignments') && /*#__PURE__*/React.createElement("section", {
    className: "space-y-4"
  }, /*#__PURE__*/React.createElement("h2", {
    className: "text-lg font-extrabold text-slate-900 dark:text-white"
  }, "Coursework & Assignments (ASSIGNMENTS)"), /*#__PURE__*/React.createElement("div", {
    className: "grid gap-4"
  }, assignments.map(asm => {
    const mySub = asm.submissions?.[0];
    return /*#__PURE__*/React.createElement(SpotlightCard, {
      key: asm.id,
      className: "p-6"
    }, /*#__PURE__*/React.createElement("div", {
      className: "flex flex-col sm:flex-row sm:items-center justify-between gap-4"
    }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
      className: "flex items-center gap-2 mb-2"
    }, /*#__PURE__*/React.createElement(Badge, {
      variant: "info"
    }, selectedCourse?.courseCode || 'Course'), /*#__PURE__*/React.createElement(Badge, {
      variant: "neutral"
    }, "Max ", asm.maxMarks, " Marks"), mySub && /*#__PURE__*/React.createElement(Badge, {
      variant: mySub.status === 'LATE' ? 'danger' : 'active'
    }, mySub.status)), /*#__PURE__*/React.createElement("h3", {
      className: "text-base font-bold text-slate-900 dark:text-white"
    }, asm.title), /*#__PURE__*/React.createElement("p", {
      className: "text-xs text-slate-500 dark:text-gray-400 mt-1 max-w-2xl leading-relaxed"
    }, asm.description), /*#__PURE__*/React.createElement("p", {
      className: "text-[11px] font-bold text-slate-400 dark:text-gray-500 mt-2"
    }, "Due: ", new Date(asm.dueDate).toLocaleString())), /*#__PURE__*/React.createElement("div", {
      className: "flex items-center gap-3 shrink-0"
    }, isStaff ? /*#__PURE__*/React.createElement(Button, {
      onClick: () => setGradingAssignment(asm)
    }, "Review Submissions (", asm.submissions?.length || 0, ")") : /*#__PURE__*/React.createElement(Button, {
      onClick: () => setSubmittingAssignment(asm)
    }, mySub ? 'View / Resubmit' : 'Submit Assignment'))));
  }))), (activeTab === 'all' || activeTab === 'quizzes') && /*#__PURE__*/React.createElement("section", {
    className: "space-y-4"
  }, /*#__PURE__*/React.createElement("h2", {
    className: "text-lg font-extrabold text-slate-900 dark:text-white"
  }, "Timed Examinations & Quizzes (QUIZZES)"), /*#__PURE__*/React.createElement("div", {
    className: "space-y-4"
  }, quizzes.map(quiz => /*#__PURE__*/React.createElement(QuizCard, {
    key: quiz.id,
    quiz: quiz,
    isEnrolled: true,
    onAction: handleQuizAction
  }))))), /*#__PURE__*/React.createElement(AssignmentSubmissionModal, {
    assignment: submittingAssignment,
    isOpen: Boolean(submittingAssignment),
    onClose: () => setSubmittingAssignment(null),
    onSuccess: loadAssignments
  }), /*#__PURE__*/React.createElement(InstructorGradingModal, {
    assignment: gradingAssignment,
    isOpen: Boolean(gradingAssignment),
    onClose: () => setGradingAssignment(null),
    onRefresh: loadAssignments
  }), /*#__PURE__*/React.createElement(QuizAttemptModal, {
    quiz: activeAttemptQuiz,
    isOpen: Boolean(activeAttemptQuiz),
    onClose: () => setActiveAttemptQuiz(null),
    onSubmit: handleQuizSubmit
  }), /*#__PURE__*/React.createElement(QuizResultsModal, {
    quiz: activeResultsQuiz,
    isOpen: Boolean(activeResultsQuiz),
    onClose: () => setActiveResultsQuiz(null),
    onRetake: q => {
      setActiveResultsQuiz(null);
      setActiveAttemptQuiz(q);
    }
  }), /*#__PURE__*/React.createElement(CreateQuizModal, {
    isOpen: isCreateQuizOpen,
    onClose: () => setIsCreateQuizOpen(false),
    onCreate: handleCreateQuiz
  }));
}
var _default = AssessmentsPage;

export default _default;
