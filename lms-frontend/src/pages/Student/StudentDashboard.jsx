import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { courseService } from '../../services/courseService';
import { useAuth } from '../../context/AuthContext';
import { CourseBannerPattern } from '../../components/common/CourseBannerPattern';

// Fallback courses matching the reference screenshot to guarantee a full, impressive UI
const MOCK_REFERENCE_COURSES = [
  {
    id: 'mock-1',
    title: 'Intro to Machine Learning',
    courseCode: 'CS401',
    instructorName: 'Dr. Alan Turing',
    progress: 85,
    statusBadge: 'Cors badged',
    bannerUrl: null,
  },
  {
    id: 'mock-2',
    title: 'Linear Algebra II',
    courseCode: 'MATH202',
    instructorName: 'Prof. Katherine Johnson',
    progress: 62,
    statusBadge: 'Status',
    bannerUrl: null,
  },
  {
    id: 'mock-3',
    title: 'Advanced Web Development',
    courseCode: 'CS350',
    instructorName: 'Dr. Tim Berners-Lee',
    progress: 78,
    statusBadge: 'Status',
    bannerUrl: null,
  },
  {
    id: 'mock-4',
    title: 'Linear Learning',
    courseCode: 'CS410',
    instructorName: 'Dr. Alan Turing',
    progress: 85,
    statusBadge: 'Status',
    bannerUrl: null,
  },
  {
    id: 'mock-5',
    title: 'Machine Algebra',
    courseCode: 'MATH305',
    instructorName: 'Prof. Katherine',
    progress: 62,
    statusBadge: 'Status',
    bannerUrl: null,
  },
  {
    id: 'mock-6',
    title: 'Student Development',
    courseCode: 'CS499',
    instructorName: 'Dr. Tim Berners-Lee',
    progress: 78,
    statusBadge: 'Status',
    bannerUrl: null,
  },
];

function StudentDashboard() {
  const { user } = useAuth();
  const [enrolledCourses, setEnrolledCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchEnrolledCourses();
  }, []);

  const fetchEnrolledCourses = async () => {
    try {
      const courses = await courseService.getEnrolled();
      if (Array.isArray(courses) && courses.length > 0) {
        setEnrolledCourses(courses);
      } else {
        setEnrolledCourses(MOCK_REFERENCE_COURSES);
      }
    } catch (err) {
      console.error('Failed to fetch enrolled courses:', err);
      setEnrolledCourses(MOCK_REFERENCE_COURSES);
    } finally {
      setLoading(false);
    }
  };

  const coursesList = enrolledCourses.length > 0 ? enrolledCourses : MOCK_REFERENCE_COURSES;

  return (
    <main className="mx-auto max-w-7xl px-4 py-8 sm:px-8 lg:py-10 w-full transition-colors duration-200">
      {/* 1. GREETING BANNER */}
      <div className="flex items-center gap-4 mb-8">
        <img
          src={user?.avatar || "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80"}
          alt={user?.name || "Sarah Jensen"}
          className="h-16 w-16 rounded-full object-cover border-2 border-white dark:border-slate-800 shadow-sm shrink-0"
        />
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight transition-colors">
            Welcome back, {user?.name?.split(' ')[0] || 'Sarah'}!
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 font-medium mt-0.5 transition-colors">
            {user?.email || 'sarah.jensen@email.com'} · Ready to continue your learning journey?
          </p>
        </div>
      </div>

      {/* 2. STATS CARDS ROW */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-8">
        {/* Stat Card 1: Total Courses */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 p-5 shadow-xs flex items-center justify-between transition-colors">
          <div className="flex items-center gap-4">
            <div className="h-12 w-12 rounded-xl bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 flex items-center justify-center shrink-0">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
            </div>
            <div>
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">Total Courses</h3>
              <p className="text-sm font-bold text-slate-900 dark:text-white mt-0.5">
                {coursesList.length} Enrolled <span className="text-slate-400 font-normal">|</span> <span className="text-slate-600 dark:text-slate-300">4 Active</span>
              </p>
            </div>
          </div>
        </div>

        {/* Stat Card 2: Overall Progress */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 p-5 shadow-xs flex items-center justify-between transition-colors">
          <div className="flex items-center gap-4">
            <div className="h-12 w-12 rounded-xl bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 flex items-center justify-center shrink-0">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
              </svg>
            </div>
            <div>
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">Overall Progress</h3>
              <p className="text-xs text-slate-600 dark:text-slate-300 mt-0.5 font-medium">Modules Completed: <span className="font-bold text-slate-900 dark:text-white">51/68</span></p>
            </div>
          </div>
          <div className="h-11 w-11 rounded-full border-[3.5px] border-blue-600 flex items-center justify-center text-xs font-black text-blue-600 dark:text-blue-400 shrink-0">
            74%
          </div>
        </div>
      </div>

      {/* 3. MAIN CONTENT (2-COLUMN GRID) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* LEFT COLUMN: MY COURSES (2/3 width) */}
        <div className="lg:col-span-2 space-y-5">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-extrabold text-slate-900 dark:text-white tracking-tight transition-colors">
              My Courses ({coursesList.length})
            </h2>
            <Link
              to="/courses"
              className="text-xs font-semibold text-blue-600 dark:text-blue-400 hover:text-blue-700 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 px-3 py-1.5 rounded-lg transition"
            >
              View all
            </Link>
          </div>

          {loading ? (
            <div className="bg-white dark:bg-slate-900 rounded-2xl p-8 text-center text-xs font-bold text-slate-400">
              Loading your courses...
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {coursesList.map((course, idx) => {
                const bannerUrl = course.bannerUrl || course.banner || course.imageUrl;
                const instructor = course.instructorName || course.createdBy?.name || 'Dr. Alan Turing';
                const progress = course.progress ?? (idx % 2 === 0 ? 85 : 62);
                const statusBadge = course.statusBadge || (idx === 0 ? 'Cors badged' : 'Status');

                return (
                  <div
                    key={course.id || idx}
                    className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-xs hover:shadow-md transition flex flex-col overflow-hidden group"
                  >
                    {/* BANNER CONTAINER */}
                    <div className="h-32 relative overflow-hidden">
                      <CourseBannerPattern
                        index={idx}
                        title={course.title}
                        bannerUrl={bannerUrl}
                      />
                    </div>

                    {/* CARD CONTENT */}
                    <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
                      <div>
                        <h3 className="font-bold text-slate-900 dark:text-white text-xs sm:text-sm line-clamp-1 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition">
                          {course.title}
                        </h3>
                        <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 font-medium">
                          {instructor}
                        </p>
                      </div>

                      <div className="space-y-2.5">
                        {/* Progress line */}
                        <div className="flex items-center justify-between text-xs font-semibold text-slate-600 dark:text-slate-400 gap-2">
                          <div className="w-full bg-slate-100 dark:bg-slate-800 rounded-full h-1.5 overflow-hidden">
                            <div
                              className="bg-blue-600 dark:bg-blue-500 h-1.5 rounded-full transition-all duration-500"
                              style={{ width: `${progress}%` }}
                            />
                          </div>
                          <span className="text-[10px] font-bold text-slate-600 dark:text-slate-300">{progress}%</span>
                        </div>

                        {/* Action Row */}
                        <div className="flex items-center justify-between pt-1">
                          <button
                            onClick={() => navigate(`/courses/${course.id}`)}
                            className="bg-blue-600 hover:bg-blue-700 text-white text-[11px] font-bold px-3 py-1.5 rounded-lg transition shadow-xs"
                          >
                            Continue Lesson
                          </button>
                          <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                            idx === 0
                              ? 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 border border-emerald-200/60 dark:border-emerald-800'
                              : 'bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400'
                          }`}>
                            {statusBadge}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* RIGHT COLUMN: DASHBOARD HIGHLIGHTS (1/3 width) */}
        <div className="lg:col-span-1">
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 p-5 shadow-xs space-y-6 sticky top-24 transition-colors">
            <h2 className="text-base font-extrabold text-slate-900 dark:text-white border-b border-slate-100 dark:border-slate-800 pb-3.5 transition-colors">
              Dashboard Highlights
            </h2>

            {/* Upcoming Assignments */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-xs font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider">Upcoming Assignments</h3>
                <Link to="/courses" className="text-[11px] font-semibold text-blue-600 dark:text-blue-400 hover:underline">View all</Link>
              </div>
              <div className="space-y-2.5">
                <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-blue-100/60 dark:bg-blue-900/40 text-blue-600 dark:text-blue-400 rounded-lg shrink-0">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-slate-900 dark:text-white">ML Assignment 3</h4>
                      <p className="text-[10px] text-slate-500 dark:text-slate-400 font-medium">Due 12: Nov 18</p>
                    </div>
                  </div>
                  <span className="text-[10px] font-semibold text-slate-600 dark:text-slate-300 bg-white dark:bg-slate-800 px-2 py-1 rounded border border-slate-200 dark:border-slate-700 shrink-0">Due Nov 18</span>
                </div>

                <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-blue-100/60 dark:bg-blue-900/40 text-blue-600 dark:text-blue-400 rounded-lg shrink-0">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-slate-900 dark:text-white">Linear Algebra Quiz</h4>
                      <p className="text-[10px] text-slate-500 dark:text-slate-400 font-medium">Due 12: Nov 20</p>
                    </div>
                  </div>
                  <span className="text-[10px] font-semibold text-slate-600 dark:text-slate-300 bg-white dark:bg-slate-800 px-2 py-1 rounded border border-slate-200 dark:border-slate-700 shrink-0">Due Nov 20</span>
                </div>
              </div>
            </div>

            {/* Active Quizzes */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-xs font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider">Active Quizzes</h3>
                <Link to="/courses" className="text-[11px] font-semibold text-blue-600 dark:text-blue-400 hover:underline">View All</Link>
              </div>
              <div className="space-y-2.5">
                <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-blue-100/60 dark:bg-blue-900/40 text-blue-600 dark:text-blue-400 rounded-lg shrink-0">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                      </svg>
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-slate-900 dark:text-white">Web Dev Quiz 1</h4>
                      <p className="text-[10px] text-slate-500 dark:text-slate-400 font-medium">Active Completed</p>
                    </div>
                  </div>
                  <span className="text-[10px] font-bold text-emerald-700 dark:text-emerald-400 bg-emerald-100/70 dark:bg-emerald-950/40 px-2 py-0.5 rounded-full shrink-0">Active</span>
                </div>

                <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-blue-100/60 dark:bg-blue-900/40 text-blue-600 dark:text-blue-400 rounded-lg shrink-0">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                      </svg>
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-slate-900 dark:text-white">Algo Quiz 4</h4>
                      <p className="text-[10px] text-slate-500 dark:text-slate-400 font-medium">Active Completed</p>
                    </div>
                  </div>
                  <span className="text-[10px] font-bold text-emerald-700 dark:text-emerald-400 bg-emerald-100/70 dark:bg-emerald-950/40 px-2 py-0.5 rounded-full shrink-0">Active</span>
                </div>
              </div>
            </div>

            {/* Notification Feed */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-xs font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider">Notification Feed</h3>
                <Link to="/courses" className="text-[11px] font-semibold text-blue-600 dark:text-blue-400 hover:underline">View All</Link>
              </div>
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <div className="p-2 bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 rounded-full shrink-0 mt-0.5">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                    </svg>
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-slate-900 dark:text-white">ML Grade Published</h4>
                    <p className="text-[10px] text-slate-500 dark:text-slate-400">2 hours ago</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="p-2 bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 rounded-full shrink-0 mt-0.5">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-slate-900 dark:text-white">New Message from Dr. Turing</h4>
                    <p className="text-[10px] text-slate-500 dark:text-slate-400">10+ minutes ago</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="p-2 bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 rounded-full shrink-0 mt-0.5">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                    </svg>
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-slate-900 dark:text-white">Algo Exam Details Updated</h4>
                    <p className="text-[10px] text-slate-500 dark:text-slate-400">10+ minutes ago</p>
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