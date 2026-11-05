import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { courseService } from '../../services/courseService';
import { useAuth } from '../../context/AuthContext';
import { CourseCard } from '../../components/common/CourseCard';
import SpotlightCard from '../../components/common/SpotlightCard';
import Badge from '../../components/common/Badge';
import {
  BookIcon,
  ChartIcon,
  DocumentIcon,
  ClipboardCheckIcon,
  BellIcon,
  MailIcon,
} from '../../components/common/Icons';
import { MOCK_STUDENT_COURSES } from '../../utils/mockData';

function StudentDashboard() {
  const { user } = useAuth();
  const [enrolledCourses, setEnrolledCourses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchEnrolledCourses();
  }, []);

  const fetchEnrolledCourses = async () => {
    try {
      const courses = await courseService.getEnrolled();
      if (Array.isArray(courses) && courses.length > 0) {
        setEnrolledCourses(courses);
      } else {
        setEnrolledCourses(MOCK_STUDENT_COURSES);
      }
    } catch (err) {
      console.error('Failed to fetch enrolled courses:', err);
      setEnrolledCourses(MOCK_STUDENT_COURSES);
    } finally {
      setLoading(false);
    }
  };

  const coursesList = enrolledCourses.length > 0 ? enrolledCourses : MOCK_STUDENT_COURSES;

  return (
    <main className="mx-auto max-w-[1440px] px-4 py-8 sm:px-8 lg:py-10 w-full transition-colors duration-200">
      {/* 3. WELCOME & GREETING WITH GRADIENT HEADLINE & SPINNING AVATAR RING */}
      <div className="flex items-center gap-4 mb-8">
        <div className="relative p-[2px] rounded-full dark:bg-gradient-to-r dark:from-cyan-400 dark:via-blue-500 dark:to-purple-600 dark:animate-spin-ring shrink-0">
          <img
            src={user?.profileImage || "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80"}
            alt={user?.name || "Student"}
            className="h-16 w-16 rounded-full object-cover border-2 border-white dark:border-gray-950 shadow-sm"
          />
        </div>
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-transparent dark:bg-clip-text dark:bg-gradient-to-r dark:from-cyan-400 dark:via-blue-400 dark:to-purple-500 tracking-tight transition-colors">
            Welcome back, {user?.name?.split(' ')[0] || 'Sarah'}!
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-gray-400 font-medium mt-0.5 transition-colors">
            {user?.email || 'sarah.jensen@email.com'} · Ready to continue your learning journey?
          </p>
        </div>
      </div>

      {/* HIGH-LEVEL METRICS (TOTAL COURSES & OVERALL PROGRESS WITH SPOTLIGHT) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-8">
        {/* Total Courses Widget */}
        <SpotlightCard className="p-5 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="h-12 w-12 rounded-xl bg-blue-50 dark:bg-cyan-950/40 text-blue-600 dark:text-cyan-400 flex items-center justify-center shrink-0 border border-transparent dark:border-cyan-500/20">
              <BookIcon className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-gray-400">Total Courses</h3>
              <p className="text-sm font-bold text-slate-900 dark:text-white mt-0.5">
                {coursesList.length} Enrolled <span className="text-slate-400 dark:text-gray-600 font-normal">|</span> <span className="text-slate-600 dark:text-cyan-300">4 Active</span>
              </p>
            </div>
          </div>
        </SpotlightCard>

        {/* Overall Progress Widget */}
        <SpotlightCard className="p-5 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="h-12 w-12 rounded-xl bg-blue-50 dark:bg-purple-950/40 text-blue-600 dark:text-purple-400 flex items-center justify-center shrink-0 border border-transparent dark:border-purple-500/20">
              <ChartIcon className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-gray-400">Overall Progress</h3>
              <p className="text-xs text-slate-600 dark:text-gray-300 mt-0.5 font-medium">Modules Completed: <span className="font-bold text-slate-900 dark:text-white">51/68</span></p>
            </div>
          </div>
          <div className="h-11 w-11 rounded-full border-[3.5px] border-blue-600 dark:border-cyan-400 dark:shadow-[0_0_12px_rgba(34,211,238,0.5)] flex items-center justify-center text-xs font-black text-blue-600 dark:text-cyan-400 shrink-0">
            74%
          </div>
        </SpotlightCard>
      </div>

      {/* 4 & 5. MAIN CONTENT AREA (2-COLUMN GRID) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

        {/* LEFT COLUMN: 4. MAIN CONTENT AREA (COURSE GRID) (2/3 width) */}
        <div className="lg:col-span-2 space-y-5">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-extrabold text-slate-900 dark:text-white tracking-tight transition-colors">
              My Courses ({coursesList.length})
            </h2>
            <Link
              to="/courses"
              className="text-xs font-semibold text-blue-600 dark:text-cyan-400 hover:text-blue-700 dark:hover:text-cyan-300 bg-white dark:bg-white/[0.03] border border-slate-200 dark:border-white/10 px-3 py-1.5 rounded-lg transition cursor-pointer"
            >
              View all
            </Link>
          </div>

          {loading ? (
            <div className="bg-white dark:bg-white/[0.02] rounded-2xl border border-slate-200/80 dark:border-white/5 p-8 text-center text-xs font-bold text-slate-400 dark:text-gray-500">
              Loading your courses...
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {coursesList.map((course, idx) => (
                <CourseCard
                  key={course.id || idx}
                  course={course}
                  index={idx}
                  mode="student"
                />
              ))}
            </div>
          )}
        </div>

        {/* RIGHT COLUMN: 5. RIGHT-HAND CONTEXT PANEL (1/3 width) */}
        <div className="lg:col-span-1">
          <div className="bg-white dark:bg-white/[0.02] backdrop-blur-xl rounded-2xl border border-slate-200/80 dark:border-white/5 p-5 shadow-xs dark:shadow-md dark:shadow-black/40 space-y-6 sticky top-24 transition-colors">
            <h2 className="text-base font-extrabold text-slate-900 dark:text-white border-b border-slate-100 dark:border-white/5 pb-3.5 transition-colors">
              Dashboard Highlights
            </h2>

            {/* Upcoming Assignments */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-xs font-bold text-slate-800 dark:text-gray-300 uppercase tracking-wider">Upcoming Assignments</h3>
                <Link to="/courses" className="text-[11px] font-semibold text-blue-600 dark:text-cyan-400 hover:underline">View all</Link>
              </div>
              <div className="space-y-2.5">
                <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-white/[0.02] border border-slate-100 dark:border-white/5">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-blue-100/60 dark:bg-cyan-950/40 text-blue-600 dark:text-cyan-400 rounded-lg shrink-0 border border-transparent dark:border-cyan-500/20">
                      <DocumentIcon className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-slate-900 dark:text-white">ML Assignment 3</h4>
                      <p className="text-[10px] text-slate-500 dark:text-gray-400 font-medium">Due: Nov 18</p>
                    </div>
                  </div>
                  <span className="text-[10px] font-semibold text-slate-600 dark:text-gray-300 bg-white dark:bg-white/[0.03] px-2 py-1 rounded border border-slate-200 dark:border-white/10 shrink-0">Due Nov 18</span>
                </div>

                <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-white/[0.02] border border-slate-100 dark:border-white/5">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-blue-100/60 dark:bg-cyan-950/40 text-blue-600 dark:text-cyan-400 rounded-lg shrink-0 border border-transparent dark:border-cyan-500/20">
                      <DocumentIcon className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-slate-900 dark:text-white">Linear Algebra Quiz</h4>
                      <p className="text-[10px] text-slate-500 dark:text-gray-400 font-medium">Due: Nov 20</p>
                    </div>
                  </div>
                  <span className="text-[10px] font-semibold text-slate-600 dark:text-gray-300 bg-white dark:bg-white/[0.03] px-2 py-1 rounded border border-slate-200 dark:border-white/10 shrink-0">Due Nov 20</span>
                </div>
              </div>
            </div>

            {/* Active Quizzes */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-xs font-bold text-slate-800 dark:text-gray-300 uppercase tracking-wider">Active Quizzes</h3>
                <Link to="/courses" className="text-[11px] font-semibold text-blue-600 dark:text-cyan-400 hover:underline">View All</Link>
              </div>
              <div className="space-y-2.5">
                <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-white/[0.02] border border-slate-100 dark:border-white/5">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-blue-100/60 dark:bg-purple-950/40 text-blue-600 dark:text-purple-400 rounded-lg shrink-0 border border-transparent dark:border-purple-500/20">
                      <ClipboardCheckIcon className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-slate-900 dark:text-white">Web Dev Quiz 1</h4>
                      <p className="text-[10px] text-slate-500 dark:text-gray-400 font-medium">15 Questions · Active</p>
                    </div>
                  </div>
                  <Badge variant="active">Active</Badge>
                </div>

                <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-white/[0.02] border border-slate-100 dark:border-white/5">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-blue-100/60 dark:bg-purple-950/40 text-blue-600 dark:text-purple-400 rounded-lg shrink-0 border border-transparent dark:border-purple-500/20">
                      <ClipboardCheckIcon className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-slate-900 dark:text-white">Algo Quiz 4</h4>
                      <p className="text-[10px] text-slate-500 dark:text-gray-400 font-medium">20 Questions · Active</p>
                    </div>
                  </div>
                  <Badge variant="active">Active</Badge>
                </div>
              </div>
            </div>

            {/* Notification Feed */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-xs font-bold text-slate-800 dark:text-gray-300 uppercase tracking-wider">Notification Feed</h3>
                <Link to="/courses" className="text-[11px] font-semibold text-blue-600 dark:text-cyan-400 hover:underline">View All</Link>
              </div>
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <div className="p-2 bg-blue-50 dark:bg-cyan-950/40 text-blue-600 dark:text-cyan-400 rounded-full shrink-0 mt-0.5 border border-transparent dark:border-cyan-500/20">
                    <BellIcon className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-slate-900 dark:text-white">ML Grade Published</h4>
                    <p className="text-[10px] text-slate-500 dark:text-gray-400">2 hours ago</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="p-2 bg-blue-50 dark:bg-purple-950/40 text-blue-600 dark:text-purple-400 rounded-full shrink-0 mt-0.5 border border-transparent dark:border-purple-500/20">
                    <MailIcon className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-slate-900 dark:text-white">New Message from Dr. Turing</h4>
                    <p className="text-[10px] text-slate-500 dark:text-gray-400">10+ minutes ago</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="p-2 bg-blue-50 dark:bg-cyan-950/40 text-blue-600 dark:text-cyan-400 rounded-full shrink-0 mt-0.5 border border-transparent dark:border-cyan-500/20">
                    <BellIcon className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-slate-900 dark:text-white">Algo Exam Details Updated</h4>
                    <p className="text-[10px] text-slate-500 dark:text-gray-400">10+ minutes ago</p>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>

      </div>
    </main>
  );
}

export default StudentDashboard;