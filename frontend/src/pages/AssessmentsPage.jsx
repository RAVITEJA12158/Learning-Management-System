import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { assignmentService, quizService, courseService } from '../services/courseService';
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
  const [loading, setLoading] = useState(true);

  // Modals
  const [submittingAssignment, setSubmittingAssignment] = useState(null);
  const [gradingAssignment, setGradingAssignment] = useState(null);
  const [activeAttemptQuiz, setActiveAttemptQuiz] = useState(null);
  const [activeResultsQuiz, setActiveResultsQuiz] = useState(null);
  const [isCreateQuizOpen, setIsCreateQuizOpen] = useState(false);

  useEffect(() => {
    let isMounted = true;
    const loadCourses = async () => {
      setLoading(true);
      try {
        let list = isStaff
          ? await courseService.getCreated()
          : await courseService.getEnrolled();

        // If student has 0 enrolled courses, fallback to catalog courses so they can explore
        if ((!list || list.length === 0) && !isStaff) {
          list = await courseService.getAll();
        }

        if (isMounted) {
          const valid = Array.isArray(list) ? list : [];
          setCourses(valid);
          setSelectedCourseId(valid[0]?.id || '');
        }
      } catch (err) {
        console.error('loadCourses error:', err);
        if (isMounted) {
          setCourses([]);
          setSelectedCourseId('');
        }
      } finally {
        if (isMounted) setLoading(false);
      }
    };
    loadCourses();
    return () => { isMounted = false; };
  }, [isStaff]);

  useEffect(() => {
    if (!selectedCourseId) {
      setAssignments([]);
      setQuizzes([]);
      return;
    }
    loadAssessments(selectedCourseId);
  }, [selectedCourseId]);

  const loadAssessments = async (courseId) => {
    if (!courseId) return;
    try {
      const [asmList, qzList] = await Promise.all([
        assignmentService.getByCourse(courseId),
        quizService.fetchByCourse(courseId)
      ]);
      setAssignments(Array.isArray(asmList) ? asmList : []);
      setQuizzes(Array.isArray(qzList) ? qzList : []);
    } catch (err) {
      console.error('loadAssessments error:', err);
      setAssignments([]);
      setQuizzes([]);
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
    } catch (err) {
      console.error('submitAttempt error:', err);
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
    } catch (err) {
      console.error('handleCreateQuiz error:', err);
    }
  };

  const selectedCourse = courses.find(c => c.id === selectedCourseId) || courses[0];
  const completedQuizzesCount = quizzes.filter(q => q.status === 'Completed').length;

  return (
    <main className="mx-auto max-w-[1440px] px-4 py-8 sm:px-8 lg:py-10 w-full font-sans transition-colors duration-200">
      {/* Header */}
      <div className="mb-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <Badge variant="info" className="mb-2">
            Assignments & Timed Examinations
          </Badge>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
            Academic Assessments Center
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-gray-400 mt-1">
            Manage coursework submissions, instructor grading, and live timed quizzes across your courses.
          </p>
        </div>
        <div className="flex items-center gap-2.5">
          {isStaff && (
            <Button onClick={() => setIsCreateQuizOpen(true)}>
              + Author New Quiz
            </Button>
          )}
          <Button variant="outline" onClick={() => navigate('/grades')}>
            View Gradebook →
          </Button>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
        <SpotlightCard className="p-4">
          <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-gray-400">
            Total Assignments
          </p>
          <p className="text-2xl font-black text-slate-900 dark:text-white mt-1">
            {assignments.length}
          </p>
        </SpotlightCard>
        <SpotlightCard className="p-4">
          <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-gray-400">
            Timed Quizzes
          </p>
          <p className="text-2xl font-black text-blue-600 dark:text-cyan-400 mt-1">
            {quizzes.length}
          </p>
        </SpotlightCard>
        <SpotlightCard className="p-4">
          <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-gray-400">
            Completed / Graded
          </p>
          <p className="text-2xl font-black text-emerald-600 dark:text-emerald-400 mt-1">
            {completedQuizzesCount}
          </p>
        </SpotlightCard>
        <SpotlightCard className="p-4">
          <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-gray-400">
            Enrolled Courses
          </p>
          <p className="text-2xl font-black text-purple-600 dark:text-purple-400 mt-1">
            {courses.length}
          </p>
        </SpotlightCard>
      </div>

      {/* Course Selector Pills */}
      {courses.length > 0 ? (
        <div className="flex flex-wrap items-center gap-2 mb-6">
          {courses.map((c) => (
            <button
              key={c.id}
              onClick={() => setSelectedCourseId(c.id)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer ${
                selectedCourseId === c.id
                  ? 'bg-[#0066FF] text-white shadow-[0_0_15px_rgba(0,102,255,0.4)]'
                  : 'bg-white dark:bg-white/[0.03] text-slate-600 dark:text-gray-400 border border-slate-200/80 dark:border-white/10 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              {c.courseCode || 'Course'}: {c.title}
            </button>
          ))}
        </div>
      ) : (
        <div className="p-8 text-center rounded-2xl bg-white dark:bg-white/[0.02] border border-slate-200/80 dark:border-white/10 mb-6">
          <p className="text-sm font-bold text-slate-900 dark:text-white">
            {loading ? 'Loading courses from database…' : 'No enrolled courses found.'}
          </p>
          {!loading && (
            <button
              onClick={() => navigate('/courses')}
              className="mt-2 text-xs font-bold text-blue-600 dark:text-cyan-400 hover:underline cursor-pointer"
            >
              Explore Course Catalog →
            </button>
          )}
        </div>
      )}

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 mb-6 border-b border-slate-200 dark:border-white/10 pb-3">
        {[
          { id: 'all', label: 'All Assessments' },
          { id: 'assignments', label: `Course Assignments (${assignments.length})` },
          { id: 'quizzes', label: `Timed Quizzes (${quizzes.length})` },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition cursor-pointer ${
              activeTab === tab.id
                ? 'bg-[#0066FF] text-white shadow-[0_0_15px_rgba(0,102,255,0.4)]'
                : 'bg-white dark:bg-white/[0.03] text-slate-600 dark:text-gray-400 border border-slate-200/80 dark:border-white/10'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Main Content Area */}
      <div className="space-y-8">
        {/* Assignments Section */}
        {(activeTab === 'all' || activeTab === 'assignments') && (
          <section className="space-y-4">
            <h2 className="text-lg font-extrabold text-slate-900 dark:text-white">
              Coursework & Assignments
            </h2>
            {assignments.length > 0 ? (
              <div className="grid gap-4">
                {assignments.map((asm) => {
                  const mySub = asm.submissions?.[0];
                  return (
                    <SpotlightCard key={asm.id} className="p-6">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                        <div>
                          <div className="flex items-center gap-2 mb-2">
                            <Badge variant="info">
                              {selectedCourse?.courseCode || 'Course'}
                            </Badge>
                            <Badge variant="neutral">
                              Max {asm.maxMarks} Marks
                            </Badge>
                            {mySub && (
                              <Badge variant={mySub.status === 'LATE' ? 'danger' : 'active'}>
                                {mySub.status}
                              </Badge>
                            )}
                          </div>
                          <h3 className="text-base font-bold text-slate-900 dark:text-white">
                            {asm.title}
                          </h3>
                          <p className="text-xs text-slate-500 dark:text-gray-400 mt-1 max-w-2xl leading-relaxed">
                            {asm.description}
                          </p>
                          <p className="text-[11px] font-bold text-slate-400 dark:text-gray-500 mt-2">
                            Due: {asm.dueDate ? new Date(asm.dueDate).toLocaleString() : 'No due date set'}
                          </p>
                        </div>
                        <div className="flex items-center gap-3 shrink-0">
                          {isStaff ? (
                            <Button onClick={() => setGradingAssignment(asm)}>
                              Review Submissions ({asm.submissions?.length || 0})
                            </Button>
                          ) : (
                            <Button onClick={() => setSubmittingAssignment(asm)}>
                              {mySub ? 'View / Resubmit' : 'Submit Assignment'}
                            </Button>
                          )}
                        </div>
                      </div>
                    </SpotlightCard>
                  );
                })}
              </div>
            ) : (
              <div className="p-8 text-center rounded-2xl bg-white dark:bg-white/[0.02] border border-slate-200/80 dark:border-white/10 text-xs text-slate-500 dark:text-gray-400">
                No assignments posted for this course yet.
              </div>
            )}
          </section>
        )}

        {/* Quizzes Section */}
        {(activeTab === 'all' || activeTab === 'quizzes') && (
          <section className="space-y-4">
            <h2 className="text-lg font-extrabold text-slate-900 dark:text-white">
              Timed Examinations & Quizzes
            </h2>
            {quizzes.length > 0 ? (
              <div className="space-y-4">
                {quizzes.map((quiz) => (
                  <QuizCard
                    key={quiz.id}
                    quiz={quiz}
                    isEnrolled={true}
                    onAction={handleQuizAction}
                  />
                ))}
              </div>
            ) : (
              <div className="p-8 text-center rounded-2xl bg-white dark:bg-white/[0.02] border border-slate-200/80 dark:border-white/10 text-xs text-slate-500 dark:text-gray-400">
                No timed quizzes published for this course yet.
              </div>
            )}
          </section>
        )}
      </div>

      {/* Modals */}
      <AssignmentSubmissionModal
        assignment={submittingAssignment}
        isOpen={Boolean(submittingAssignment)}
        onClose={() => setSubmittingAssignment(null)}
        onSuccess={() => loadAssessments(selectedCourseId)}
      />

      <InstructorGradingModal
        assignment={gradingAssignment}
        isOpen={Boolean(gradingAssignment)}
        onClose={() => setGradingAssignment(null)}
        onRefresh={() => loadAssessments(selectedCourseId)}
      />

      <QuizAttemptModal
        quiz={activeAttemptQuiz}
        isOpen={Boolean(activeAttemptQuiz)}
        onClose={() => setActiveAttemptQuiz(null)}
        onSubmit={handleQuizSubmit}
      />

      <QuizResultsModal
        quiz={activeResultsQuiz}
        isOpen={Boolean(activeResultsQuiz)}
        onClose={() => setActiveResultsQuiz(null)}
        onRetake={(q) => {
          setActiveResultsQuiz(null);
          setActiveAttemptQuiz(q);
        }}
      />

      <CreateQuizModal
        isOpen={isCreateQuizOpen}
        onClose={() => setIsCreateQuizOpen(false)}
        onCreate={handleCreateQuiz}
      />
    </main>
  );
}

export default AssessmentsPage;
