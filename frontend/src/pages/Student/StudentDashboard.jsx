import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  notificationService,
  courseService,
  gradeService,
  assignmentService,
  quizService,
} from '../../services/courseService';
import { useAuth } from '../../context/AuthContext';
import { CourseCard } from '../../components/common/CourseCard';
import SpotlightCard from '../../components/common/SpotlightCard';
import Badge from '../../components/common/Badge';
import {
  BookIcon,
  ChartIcon,
  CalendarIcon,
  AcademicCapIcon,
  DocumentIcon,
  ClipboardCheckIcon,
  BellIcon,
} from '../../components/common/Icons';

function StudentDashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [enrolledCourses, setEnrolledCourses] = useState([]);
  const [gradeOverview, setGradeOverview] = useState(null);
  const [upcomingAssignments, setUpcomingAssignments] = useState([]);
  const [activeQuizzes, setActiveQuizzes] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    const loadDashboard = async () => {
      try {
        const [courses, overview, notifs] = await Promise.all([
          courseService.getEnrolled(),
          gradeService.getStudentOverview(),
          notificationService.fetchAll(),
        ]);

        if (!isMounted) return;

        const validCourses = Array.isArray(courses) ? courses : [];
        setEnrolledCourses(validCourses);
        if (overview) setGradeOverview(overview);
        if (Array.isArray(notifs)) setNotifications(notifs.slice(0, 3));

        if (validCourses.length > 0) {
          const courseAssessments = await Promise.all(
            validCourses.slice(0, 4).map(async (c) => {
              const [asms, qzs] = await Promise.all([
                assignmentService.getByCourse(c.id),
                quizService.fetchByCourse(c.id),
              ]);
              return {
                course: c,
                assignments: Array.isArray(asms)
                  ? asms.map((a) => ({ ...a, courseCode: c.courseCode, courseId: c.id }))
                  : [],
                quizzes: Array.isArray(qzs)
                  ? qzs.map((q) => ({ ...q, courseCode: c.courseCode, courseId: c.id }))
                  : [],
              };
            })
          );

          if (!isMounted) return;

          const allAsms = courseAssessments.flatMap((x) => x.assignments);
          const allQzs = courseAssessments.flatMap((x) => x.quizzes);
          setUpcomingAssignments(allAsms.slice(0, 3));
          setActiveQuizzes(allQzs.slice(0, 3));
        }
      } catch (err) {
        console.error('Failed to load student dashboard:', err);
      } finally {
        if (isMounted) setLoading(false);
      }
    };
    loadDashboard();
    return () => {
      isMounted = false;
    };
  }, []);

  const coursesList = enrolledCourses;
  const overviewCourses = gradeOverview?.courses || [];
  const totalItems = overviewCourses.reduce((acc, c) => acc + (c.totalContent || 0), 0);
  const completedItems = overviewCourses.reduce((acc, c) => acc + (c.completedContent || 0), 0);
  const overallProgress =
    totalItems > 0
      ? Math.round((completedItems / totalItems) * 100)
      : overviewCourses.length > 0
      ? Math.round(overviewCourses.reduce((a, b) => a + (b.progress || 0), 0) / overviewCourses.length)
      : 0;
  const avgAttendance =
    overviewCourses.length > 0
      ? Math.round(overviewCourses.reduce((a, b) => a + (b.participation ?? 100), 0) / overviewCourses.length)
      : 100;
  const gpaDisplay = gradeOverview?.gpa || '0.00 / 4.00';

  const userInitial = user?.name ? user.name.trim().charAt(0).toUpperCase() : 'S';

  return (
    <main className="mx-auto max-w-[1440px] px-4 py-8 sm:px-8 lg:py-10 w-full transition-colors duration-200">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div className="flex items-center gap-4">
          <div className="relative p-[2px] rounded-full dark:bg-gradient-to-r dark:from-cyan-400 dark:via-blue-500 dark:to-purple-600 dark:animate-spin-ring shrink-0">
            {user?.profileImage ? (
              <img
                src={user.profileImage}
                alt={user?.name || 'Student'}
                className="h-16 w-16 rounded-full object-cover border-2 border-white dark:border-gray-950 shadow-sm"
              />
            ) : (
              <div className="h-16 w-16 rounded-full bg-gradient-to-tr from-cyan-500 to-purple-600 text-white flex items-center justify-center text-2xl font-black border-2 border-white dark:border-gray-950 shadow-sm select-none">
                {userInitial}
              </div>
            )}
          </div>
          <div>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-transparent dark:bg-clip-text dark:bg-gradient-to-r dark:from-cyan-400 dark:via-blue-400 dark:to-purple-500 tracking-tight transition-colors">
              Welcome back, {user?.name?.split(' ')[0] || 'Scholar'}!
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-gray-400 font-medium mt-0.5 transition-colors">
              {user?.email || ''} · Ready to continue your learning journey?
            </p>
          </div>
        </div>
        <div className="flex flex-wrap items-center gap-2.5">
          <button
            onClick={() => navigate('/grades')}
            className="hub-lift px-3.5 py-2 rounded-xl bg-white dark:bg-white/[0.03] border border-slate-200 dark:border-white/10 text-xs font-bold text-slate-700 dark:text-gray-200 hover:border-blue-500 dark:hover:border-cyan-400 transition cursor-pointer"
          >
            📊 View Transcript
          </button>
          <button
            onClick={() => navigate('/attendance')}
            className="hub-lift px-3.5 py-2 rounded-xl bg-white dark:bg-white/[0.03] border border-slate-200 dark:border-white/10 text-xs font-bold text-slate-700 dark:text-gray-200 hover:border-blue-500 dark:hover:border-cyan-400 transition cursor-pointer"
          >
            📅 Attendance Log
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <SpotlightCard
          onClick={() => navigate('/courses')}
          className="p-5 flex items-center justify-between cursor-pointer"
        >
          <div className="flex items-center gap-3.5">
            <div className="h-11 w-11 rounded-xl bg-blue-50 dark:bg-cyan-950/40 text-blue-600 dark:text-cyan-400 flex items-center justify-center shrink-0 border border-transparent dark:border-cyan-500/20">
              <BookIcon className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-gray-400">
                Total Courses
              </h3>
              <p className="text-sm font-black text-slate-900 dark:text-white mt-0.5">
                {coursesList.length} Enrolled{' '}
                <span className="text-slate-400 dark:text-gray-600 font-normal">|</span>{' '}
                <span className="text-blue-600 dark:text-cyan-300">Active</span>
              </p>
            </div>
          </div>
        </SpotlightCard>

        <SpotlightCard
          onClick={() => navigate(coursesList[0]?.id ? `/courses/${coursesList[0].id}` : '/courses')}
          className="p-5 flex items-center justify-between cursor-pointer"
        >
          <div className="flex items-center gap-3.5">
            <div className="h-11 w-11 rounded-xl bg-purple-50 dark:bg-purple-950/40 text-purple-600 dark:text-purple-400 flex items-center justify-center shrink-0 border border-transparent dark:border-purple-500/20">
              <ChartIcon className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-gray-400">
                Overall Progress
              </h3>
              <p className="text-xs text-slate-600 dark:text-gray-300 mt-0.5 font-medium">
                Completed:{' '}
                <span className="font-bold text-slate-900 dark:text-white">
                  {completedItems}/{totalItems} Items
                </span>
              </p>
            </div>
          </div>
          <div className="h-10 w-10 rounded-full border-[3px] border-blue-600 dark:border-cyan-400 dark:shadow-[0_0_12px_rgba(34,211,238,0.5)] flex items-center justify-center text-[11px] font-black text-blue-600 dark:text-cyan-400 shrink-0">
            {overallProgress}%
          </div>
        </SpotlightCard>

        <SpotlightCard
          onClick={() => navigate('/attendance')}
          className="p-5 flex items-center justify-between cursor-pointer"
        >
          <div className="flex items-center gap-3.5">
            <div className="h-11 w-11 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0 border border-transparent dark:border-emerald-500/20">
              <CalendarIcon className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-gray-400">
                Attendance Rate
              </h3>
              <p className="text-sm font-black text-slate-900 dark:text-white mt-0.5">
                {avgAttendance}%{' '}
                <span className="text-xs font-semibold text-emerald-600 dark:text-emerald-400">
                  Present
                </span>
              </p>
            </div>
          </div>
        </SpotlightCard>

        <SpotlightCard
          onClick={() => navigate('/grades')}
          className="p-5 flex items-center justify-between cursor-pointer"
        >
          <div className="flex items-center gap-3.5">
            <div className="h-11 w-11 rounded-xl bg-amber-50 dark:bg-amber-950/40 text-amber-600 dark:text-amber-400 flex items-center justify-center shrink-0 border border-transparent dark:border-amber-500/20">
              <AcademicCapIcon className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-gray-400">
                Academic Standing
              </h3>
              <p className="text-sm font-black text-slate-900 dark:text-white mt-0.5">
                {gpaDisplay}
              </p>
            </div>
          </div>
        </SpotlightCard>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-5">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-extrabold text-slate-900 dark:text-white tracking-tight transition-colors">
              My Enrolled Courses ({coursesList.length})
            </h2>
            <Link
              to="/courses"
              className="text-xs font-semibold text-blue-600 dark:text-cyan-400 hover:text-blue-700 dark:hover:text-cyan-300 bg-white dark:bg-white/[0.03] border border-slate-200 dark:border-white/10 px-3 py-1.5 rounded-lg transition cursor-pointer"
            >
              Browse Catalog →
            </Link>
          </div>

          {loading ? (
            <div className="bg-white dark:bg-white/[0.02] rounded-2xl border border-slate-200/80 dark:border-white/5 p-8 text-center text-xs font-bold text-slate-400 dark:text-gray-500">
              Loading your courses...
            </div>
          ) : coursesList.length === 0 ? (
            <div className="bg-white dark:bg-white/[0.02] rounded-2xl border border-slate-200/80 dark:border-white/5 p-8 text-center text-xs font-bold text-slate-500 dark:text-gray-400 space-y-3">
              <p>You are not enrolled in any courses yet.</p>
              <Link
                to="/courses"
                className="inline-block px-4 py-2 rounded-xl bg-blue-600 text-white font-bold hover:bg-blue-700 transition"
              >
                Explore Course Catalog →
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {coursesList.map((course, idx) => {
                const matchingOverview = overviewCourses.find((oc) => oc.id === course.id);
                return (
                  <CourseCard
                    key={course.id || idx}
                    course={{
                      ...course,
                      progress: matchingOverview?.progress ?? 0,
                    }}
                    index={idx}
                    mode="student"
                  />
                );
              })}
            </div>
          )}
        </div>

        <div className="lg:col-span-1">
          <div className="bg-white dark:bg-white/[0.02] backdrop-blur-xl rounded-2xl border border-slate-200/80 dark:border-white/5 p-5 shadow-xs dark:shadow-md dark:shadow-black/40 space-y-6 sticky top-24 transition-colors">
            <h2 className="text-base font-extrabold text-slate-900 dark:text-white border-b border-slate-100 dark:border-white/5 pb-3.5 transition-colors">
              Dashboard Highlights
            </h2>

            <div>
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-xs font-bold text-slate-800 dark:text-gray-300 uppercase tracking-wider">
                  Upcoming Assignments
                </h3>
                <Link
                  to="/assignments"
                  className="text-[11px] font-semibold text-blue-600 dark:text-cyan-400 hover:underline"
                >
                  View all
                </Link>
              </div>
              <div className="space-y-2.5">
                {upcomingAssignments.length > 0 ? (
                  upcomingAssignments.map((asm) => (
                    <div
                      key={asm.id}
                      onClick={() => navigate(`/courses/${asm.courseId}`)}
                      className="flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-white/[0.02] border border-slate-100 dark:border-white/5 hover:border-blue-400 dark:hover:border-cyan-500/40 transition cursor-pointer"
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <div className="p-2 bg-blue-100/60 dark:bg-cyan-950/40 text-blue-600 dark:text-cyan-400 rounded-lg shrink-0 border border-transparent dark:border-cyan-500/20">
                          <DocumentIcon className="w-4 h-4" />
                        </div>
                        <div className="min-w-0">
                          <h4 className="text-xs font-bold text-slate-900 dark:text-white truncate">
                            {asm.title}
                          </h4>
                          <p className="text-[10px] text-slate-500 dark:text-gray-400 font-medium">
                            {asm.courseCode} · Max {asm.maxMarks} Pts
                          </p>
                        </div>
                      </div>
                      <span className="text-[10px] font-semibold text-slate-600 dark:text-gray-300 bg-white dark:bg-white/[0.03] px-2 py-1 rounded border border-slate-200 dark:border-white/10 shrink-0">
                        {asm.dueDate
                          ? new Date(asm.dueDate).toLocaleDateString(undefined, {
                              month: 'short',
                              day: 'numeric',
                            })
                          : 'Upcoming'}
                      </span>
                    </div>
                  ))
                ) : (
                  <p className="text-xs text-slate-400 dark:text-gray-500 italic">
                    No upcoming assignments due.
                  </p>
                )}
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-xs font-bold text-slate-800 dark:text-gray-300 uppercase tracking-wider">
                  Active Quizzes
                </h3>
                <Link
                  to="/assignments"
                  className="text-[11px] font-semibold text-blue-600 dark:text-cyan-400 hover:underline"
                >
                  View all
                </Link>
              </div>
              <div className="space-y-2.5">
                {activeQuizzes.length > 0 ? (
                  activeQuizzes.map((qz) => (
                    <div
                      key={qz.id}
                      onClick={() => navigate(`/courses/${qz.courseId}`)}
                      className="flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-white/[0.02] border border-slate-100 dark:border-white/5 hover:border-purple-400 dark:hover:border-purple-500/40 transition cursor-pointer"
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <div className="p-2 bg-blue-100/60 dark:bg-purple-950/40 text-blue-600 dark:text-purple-400 rounded-lg shrink-0 border border-transparent dark:border-purple-500/20">
                          <ClipboardCheckIcon className="w-4 h-4" />
                        </div>
                        <div className="min-w-0">
                          <h4 className="text-xs font-bold text-slate-900 dark:text-white truncate">
                            {qz.title}
                          </h4>
                          <p className="text-[10px] text-slate-500 dark:text-gray-400 font-medium">
                            {qz.questionCount || qz.questions || 0} Qs · {qz.duration}
                          </p>
                        </div>
                      </div>
                      <Badge variant={qz.status === 'Completed' ? 'completed' : 'active'}>
                        {qz.status || 'Active'}
                      </Badge>
                    </div>
                  ))
                ) : (
                  <p className="text-xs text-slate-400 dark:text-gray-500 italic">
                    No active quizzes right now.
                  </p>
                )}
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-xs font-bold text-slate-800 dark:text-gray-300 uppercase tracking-wider">
                  Notification Feed
                </h3>
                <Link
                  to="/notifications"
                  className="text-[11px] font-semibold text-blue-600 dark:text-cyan-400 hover:underline"
                >
                  View All
                </Link>
              </div>
              <div className="space-y-3">
                {notifications.length > 0 ? (
                  notifications.map((n) => (
                    <div
                      key={n.id}
                      onClick={() => navigate('/notifications')}
                      className="flex items-start gap-3 cursor-pointer group"
                    >
                      <div className="p-2 bg-blue-50 dark:bg-cyan-950/40 text-blue-600 dark:text-cyan-400 rounded-full shrink-0 mt-0.5 border border-transparent dark:border-cyan-500/20">
                        <BellIcon className="w-4 h-4" />
                      </div>
                      <div className="min-w-0">
                        <h4 className="text-xs font-bold text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-cyan-400 truncate transition">
                          {n.title}
                        </h4>
                        <p className="text-[10px] text-slate-500 dark:text-gray-400">{n.createdAt}</p>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-xs text-slate-400 dark:text-gray-500 italic">
                    No recent notifications.
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}

export default StudentDashboard;
