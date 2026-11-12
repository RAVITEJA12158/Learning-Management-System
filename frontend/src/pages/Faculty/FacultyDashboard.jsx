import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { courseService, assignmentService } from '../../services/courseService';
import { useAuth } from '../../context/AuthContext';
import Button from '../../components/common/Button';
import Badge from '../../components/common/Badge';
import SpotlightCard from '../../components/common/SpotlightCard';
import { CourseBannerPattern } from '../../components/common/CourseBannerPattern';
import {
  PlusIcon,
  BookIcon,
  UsersIcon,
  ClipboardCheckIcon,
  CalendarIcon,
} from '../../components/common/Icons';

function FacultyDashboard() {
  const { user } = useAuth();
  const [createdCourses, setCreatedCourses] = useState([]);
  const [pendingSubmissions, setPendingSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    let isMounted = true;
    const loadFacultyWorkspace = async () => {
      try {
        const courses = await courseService.getCreated();
        const validCourses = Array.isArray(courses) ? courses : [];
        if (!isMounted) return;
        setCreatedCourses(validCourses);

        // Fetch real ungraded submissions across the faculty's courses
        const ungraded = [];
        for (const c of validCourses.slice(0, 4)) {
          const asms = await assignmentService.getByCourse(c.id);
          for (const asm of (asms || []).slice(0, 3)) {
            if ((asm._count?.submissions || 0) > 0) {
              const subs = await assignmentService.getSubmissions(asm.id);
              for (const sub of subs || []) {
                if (sub.marks === null || sub.marks === undefined) {
                  ungraded.push({
                    id: sub.id,
                    student: sub.student?.name || 'Student',
                    courseCode: c.courseCode,
                    courseId: c.id,
                    assignment: asm.title,
                    time: sub.submittedAt
                      ? new Date(sub.submittedAt).toLocaleDateString()
                      : 'Recent',
                    status: sub.status || 'SUBMITTED',
                  });
                }
              }
            }
          }
        }
        if (isMounted) {
          setPendingSubmissions(ungraded);
        }
      } catch (err) {
        console.error('Failed to fetch faculty courses:', err);
      } finally {
        if (isMounted) setLoading(false);
      }
    };
    loadFacultyWorkspace();
    return () => {
      isMounted = false;
    };
  }, []);

  const totalRosterStudents = createdCourses.reduce(
    (sum, c) => sum + (c.enrollments?.length ?? c._count?.enrollments ?? 0),
    0
  );

  return (
    <main className="mx-auto max-w-[1440px] px-4 py-8 sm:px-8 lg:py-10 w-full font-sans transition-colors duration-200">
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <Badge variant="warning" className="mb-2">
            Faculty Workspace · {user?.name || 'Instructor'}
          </Badge>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight transition-colors">
            Instructor Teaching & Assessment Hub
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-gray-400 mt-1">
            Manage course curriculums, grade student submissions, record attendance, and monitor class analytics.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <Button variant="outline" onClick={() => navigate('/attendance')}>
            📅 Record Attendance
          </Button>
          <Button onClick={() => navigate('/faculty/courses/new')} className="flex items-center gap-2">
            <PlusIcon className="w-4 h-4" />
            Create New Course
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <SpotlightCard className="p-5 flex items-center gap-4">
          <div className="h-11 w-11 rounded-xl bg-blue-50 dark:bg-cyan-950/40 text-blue-600 dark:text-cyan-400 flex items-center justify-center shrink-0 border border-transparent dark:border-cyan-500/20">
            <BookIcon className="w-5 h-5" />
          </div>
          <div>
            <p className="text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-gray-400">
              Active Courses
            </p>
            <p className="text-lg font-black text-slate-900 dark:text-white">
              {createdCourses.length} Courses Taught
            </p>
          </div>
        </SpotlightCard>

        <SpotlightCard className="p-5 flex items-center gap-4">
          <div className="h-11 w-11 rounded-xl bg-purple-50 dark:bg-purple-950/40 text-purple-600 dark:text-purple-400 flex items-center justify-center shrink-0 border border-transparent dark:border-purple-500/20">
            <UsersIcon className="w-5 h-5" />
          </div>
          <div>
            <p className="text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-gray-400">
              Enrolled Roster
            </p>
            <p className="text-lg font-black text-slate-900 dark:text-white">
              {totalRosterStudents} Active Students
            </p>
          </div>
        </SpotlightCard>

        <SpotlightCard
          onClick={() => navigate('/assignments')}
          className="p-5 flex items-center gap-4 cursor-pointer"
        >
          <div className="h-11 w-11 rounded-xl bg-amber-50 dark:bg-amber-950/40 text-amber-600 dark:text-amber-400 flex items-center justify-center shrink-0 border border-transparent dark:border-amber-500/20">
            <ClipboardCheckIcon className="w-5 h-5" />
          </div>
          <div>
            <p className="text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-gray-400">
              Grading Queue
            </p>
            <p className="text-lg font-black text-slate-900 dark:text-white">
              {pendingSubmissions.length} Needs Grading
            </p>
          </div>
        </SpotlightCard>

        <SpotlightCard
          onClick={() => navigate('/attendance')}
          className="p-5 flex items-center gap-4 cursor-pointer"
        >
          <div className="h-11 w-11 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0 border border-transparent dark:border-emerald-500/20">
            <CalendarIcon className="w-5 h-5" />
          </div>
          <div>
            <p className="text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-gray-400">
              Attendance Roll
            </p>
            <p className="text-lg font-black text-slate-900 dark:text-white">Manage Sessions</p>
          </div>
        </SpotlightCard>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-5">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-extrabold text-slate-900 dark:text-white tracking-tight">
              Courses You Teach ({createdCourses.length})
            </h2>
            <Link
              to="/courses"
              className="text-xs font-semibold text-blue-600 dark:text-cyan-400 hover:underline"
            >
              View Full Catalog →
            </Link>
          </div>

          {loading ? (
            <div className="bg-white dark:bg-white/[0.02] backdrop-blur-xl rounded-2xl border border-slate-200/80 dark:border-white/10 p-8 text-center text-xs font-bold text-slate-400 dark:text-gray-400">
              Loading your courses...
            </div>
          ) : createdCourses.length > 0 ? (
            <div className="grid gap-5 sm:grid-cols-2">
              {createdCourses.map((course, idx) => (
                <SpotlightCard
                  key={course.id}
                  className="flex flex-col justify-between overflow-hidden rounded-2xl"
                >
                  <div>
                    <div
                      onClick={() => navigate(`/courses/${course.id}`)}
                      className="h-28 relative overflow-hidden cursor-pointer"
                    >
                      <CourseBannerPattern
                        index={idx}
                        title={course.title}
                        bannerUrl={course.bannerUrl}
                      />
                    </div>
                    <div className="p-5">
                      <div className="flex items-center justify-between gap-2">
                        <Badge variant="active">{course.courseCode || 'CS101'}</Badge>
                        <span className="text-[11px] font-bold text-slate-400 dark:text-gray-400">
                          {course.semester || 'Fall 2026'}
                        </span>
                      </div>
                      <h3
                        onClick={() => navigate(`/courses/${course.id}`)}
                        className="mt-3 text-base font-bold text-slate-900 dark:text-white line-clamp-1 hover:text-blue-600 dark:hover:text-cyan-400 cursor-pointer transition"
                      >
                        {course.title}
                      </h3>
                      <p className="mt-1.5 text-xs text-slate-500 dark:text-gray-400 line-clamp-2 leading-relaxed">
                        {course.description ||
                          'Structured academic course modules, assessments, and labs.'}
                      </p>
                      <div className="mt-4 flex items-center gap-4 text-[11px] font-semibold text-slate-500 dark:text-gray-400">
                        <span>📚 {course.modules?.length ?? 0} Modules</span>
                        <span>👥 {course.enrollments?.length ?? 0} Students</span>
                      </div>
                    </div>
                  </div>
                  <div className="px-5 pb-5 pt-3 flex gap-2.5 border-t border-slate-100 dark:border-white/5">
                    <Link
                      to={`/courses/${course.id}`}
                      className="flex-1 text-center py-2 text-xs font-bold text-white bg-[#0066FF] hover:bg-blue-600 shadow-[0_0_15px_rgba(0,102,255,0.35)] rounded-xl transition cursor-pointer"
                    >
                      Manage Workspace
                    </Link>
                    <Link
                      to={`/faculty/courses/${course.id}/edit`}
                      className="px-4 text-center py-2 text-xs font-bold text-slate-700 dark:text-gray-200 bg-slate-100 dark:bg-white/5 hover:bg-slate-200 dark:hover:bg-white/10 rounded-xl transition cursor-pointer"
                    >
                      Edit
                    </Link>
                  </div>
                </SpotlightCard>
              ))}
            </div>
          ) : (
            <div className="bg-white dark:bg-white/[0.02] backdrop-blur-xl rounded-2xl border border-slate-200/80 dark:border-white/10 p-12 text-center shadow-xs">
              <p className="text-base font-bold text-slate-900 dark:text-white">
                You haven&apos;t created any courses yet.
              </p>
              <p className="mt-1 text-xs text-slate-500 dark:text-gray-400 mb-6">
                Start structuring your curriculum and sharing your knowledge.
              </p>
              <Button
                onClick={() => navigate('/faculty/courses/new')}
                className="inline-flex items-center gap-2"
              >
                <PlusIcon className="w-4 h-4" />
                Create Your First Course
              </Button>
            </div>
          )}
        </div>

        <div className="lg:col-span-1 space-y-6">
          <div className="bg-white dark:bg-white/[0.02] backdrop-blur-xl rounded-2xl border border-slate-200/80 dark:border-white/10 p-5 shadow-xs space-y-5 sticky top-24">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-white/5 pb-3.5">
              <div>
                <h3 className="text-sm font-extrabold text-slate-900 dark:text-white">
                  Submissions Needing Review
                </h3>
                <p className="text-[11px] text-slate-500 dark:text-gray-400">
                  Click any submission to open the Grading Desk
                </p>
              </div>
              <Badge variant="warning">{pendingSubmissions.length} Pending</Badge>
            </div>

            <div className="space-y-3">
              {pendingSubmissions.length > 0 ? (
                pendingSubmissions.map((item) => (
                  <div
                    key={item.id}
                    onClick={() =>
                      navigate(item.courseId ? `/courses/${item.courseId}` : '/assignments')
                    }
                    className="p-3.5 rounded-xl bg-slate-50 dark:bg-white/[0.02] border border-slate-200/70 dark:border-white/5 hover:border-blue-500/40 dark:hover:border-cyan-400/40 transition cursor-pointer"
                  >
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-blue-600 dark:text-cyan-400">
                        {item.courseCode} · {item.time}
                      </span>
                      <Badge variant={item.status === 'LATE' ? 'danger' : 'info'}>
                        {item.status}
                      </Badge>
                    </div>
                    <p className="text-xs font-bold text-slate-900 dark:text-white mt-1">
                      {item.assignment}
                    </p>
                    <div className="mt-2 flex items-center justify-between text-[11px]">
                      <span className="text-slate-500 dark:text-gray-400">
                        Submitted by{' '}
                        <strong className="text-slate-700 dark:text-gray-200">
                          {item.student}
                        </strong>
                      </span>
                      <span className="font-bold text-blue-600 dark:text-cyan-400">Grade →</span>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-xs text-slate-400 dark:text-gray-500 italic py-4 text-center">
                  All student submissions are graded!
                </p>
              )}
            </div>

            <div className="pt-3 border-t border-slate-100 dark:border-white/5 grid grid-cols-2 gap-2.5">
              <Button variant="outline" size="sm" onClick={() => navigate('/grades')}>
                Class Gradebook
              </Button>
              <Button variant="outline" size="sm" onClick={() => navigate('/assignments')}>
                All Assessments
              </Button>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}

export default FacultyDashboard;
