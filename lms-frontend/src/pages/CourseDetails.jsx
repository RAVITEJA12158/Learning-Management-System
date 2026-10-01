import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { courseService, progressService, assignmentService } from '../services/courseService';
import { useAuth } from '../context/AuthContext';
import ContentViewerModal from '../components/ContentViewerModal';
import ModuleCurriculumManager from '../components/ModuleCurriculumManager';
import CourseAssignmentsManager from '../components/CourseAssignmentsManager';

function CourseDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  // Active Tab state: 'modules', 'assignments', 'quizzes', 'announcements', 'discussions'
  const [activeTab, setActiveTab] = useState('modules');
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [enrolling, setEnrolling] = useState(false);
  const [isEnrolled, setIsEnrolled] = useState(false);
  const [message, setMessage] = useState('');

  // Course assignments state
  const [assignments, setAssignments] = useState([]);

  // Progress state
  const [progressData, setProgressData] = useState(null);
  const [completedItems, setCompletedItems] = useState({});

  // Accordion state for modules (map of moduleId -> boolean expanded)
  const [expandedModules, setExpandedModules] = useState({});

  // Content Viewer Modal state
  const [selectedContent, setSelectedContent] = useState(null);

  useEffect(() => {
    fetchCourseDetails();
    checkEnrollmentStatus();
    fetchAssignments();
  }, [id]);

  useEffect(() => {
    if (isEnrolled) {
      fetchProgress();
    }
  }, [id, isEnrolled]);

  const checkEnrollmentStatus = async () => {
    try {
      const enrolledList = await courseService.getEnrolled();
      const found = enrolledList.some((c) => c.id === id);
      setIsEnrolled(found);
    } catch (err) {
      // Ignore if staff
    }
  };

  const fetchCourseDetails = async () => {
    try {
      const data = await courseService.getById(id);
      setCourse(data);

      // Expand first module by default
      if (data.modules && data.modules.length > 0) {
        setExpandedModules((prev) => ({
          ...prev,
          [data.modules[0].id]: true,
        }));
      }
    } catch (err) {
      console.error(err);
      setMessage('Failed to load course details.');
    } finally {
      setLoading(false);
    }
  };

  const fetchAssignments = async () => {
    try {
      const data = await assignmentService.getByCourse(id);
      if (Array.isArray(data)) {
        setAssignments(data);
      }
    } catch (err) {
      console.error('Failed to fetch assignments:', err);
    }
  };

  const fetchProgress = async () => {
    try {
      const progress = await progressService.getCourseProgress(id);
      setProgressData(progress);

      const map = {};
      progress.modules?.forEach((mod) => {
        mod.content?.forEach((item) => {
          map[item.contentId] = item.completed;
        });
      });
      setCompletedItems(map);
    } catch (err) {
      console.error('Failed to load progress:', err);
    }
  };

  const handleEnroll = async () => {
    setEnrolling(true);
    setMessage('');
    try {
      await courseService.enroll(id);
      setIsEnrolled(true);
      setMessage('Successfully enrolled in course!');
      fetchProgress();
    } catch (err) {
      setMessage(err.message || 'Failed to enroll.');
    } finally {
      setEnrolling(false);
    }
  };

  const handleDrop = async () => {
    if (!window.confirm('Are you sure you want to drop this course?')) return;
    setEnrolling(true);
    setMessage('');
    try {
      await courseService.unenroll(id);
      setIsEnrolled(false);
      setProgressData(null);
      setMessage('Successfully dropped course.');
    } catch (err) {
      setMessage(err.message || 'Failed to drop course.');
    } finally {
      setEnrolling(false);
    }
  };

  const handleToggleContentProgress = async (contentId, status, e) => {
    if (e) e.stopPropagation();
    try {
      await progressService.markContent(contentId, status);
      setCompletedItems((prev) => ({ ...prev, [contentId]: status }));
      fetchProgress();
    } catch (err) {
      console.error('Failed to toggle progress:', err);
    }
  };

  const toggleModuleAccordion = (moduleId) => {
    setExpandedModules((prev) => ({
      ...prev,
      [moduleId]: !prev[moduleId],
    }));
  };

  // Helper to calculate module progress percentage
  const calculateModuleProgress = (module) => {
    if (!module.content || module.content.length === 0) return 0;
    const completedCount = module.content.filter((c) => completedItems[c.id]).length;
    return Math.round((completedCount / module.content.length) * 100);
  };

  if (loading) {
    return (
      <main className="mx-auto max-w-7xl px-4 py-12 sm:px-8 w-full">
        <div className="bg-white dark:bg-slate-900 rounded-2xl p-8 text-center text-xs font-bold text-slate-400">
          Loading course details...
        </div>
      </main>
    );
  }

  if (!course) {
    return (
      <main className="mx-auto max-w-7xl px-4 py-12 sm:px-8 w-full">
        <div className="bg-white dark:bg-slate-900 rounded-2xl p-8 text-center text-xs font-bold text-slate-500">
          Course not found.
        </div>
      </main>
    );
  }

  const isCreatorOrStaff =
    user?.role === 'admin' ||
    user?.role === 'faculty' ||
    course.createdById === user?.id;

  const totalContentCount = course.modules?.reduce((acc, m) => acc + (m.content?.length || 0), 0) || 0;
  const completedContentCount = Object.values(completedItems).filter(Boolean).length;
  const overallCompletionPercent = progressData?.completionPercent ?? 
    (totalContentCount > 0 ? Math.round((completedContentCount / totalContentCount) * 100) : 85);

  const instructorsText = course.createdBy?.name
    ? `Dr. ${course.createdBy.name}, Prof. Katherine Johnson`
    : 'Dr. Alan Turing, Prof. Katherine Johnson';

  return (
    <main className="mx-auto max-w-7xl px-4 py-8 sm:px-8 lg:py-10 w-full font-sans transition-colors duration-200">
      
      {/* 1. TOP HEADER BANNER (TITLE & PROGRESS CARD) */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
        <div>
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black text-slate-900 dark:text-white tracking-tight transition-colors">
            {course.courseCode ? `${course.courseCode}: ` : ''}{course.title}
          </h1>
          <p className="text-xs sm:text-sm font-medium text-slate-500 dark:text-slate-400 mt-1.5 transition-colors">
            Instructors: <span className="text-slate-800 dark:text-slate-200 font-semibold">{instructorsText}</span>
          </p>

          {/* Enroll / Drop Buttons */}
          <div className="mt-3 flex items-center gap-3">
            {isCreatorOrStaff ? (
              <span className="inline-flex items-center gap-1.5 rounded-full bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 px-3 py-1 text-[11px] font-bold text-slate-700 dark:text-slate-300">
                🛡️ Staff Workspace
              </span>
            ) : isEnrolled ? (
              <div className="flex items-center gap-3">
                <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 px-3 py-1 text-[11px] font-bold text-emerald-700 dark:text-emerald-300">
                  ✓ Enrolled
                </span>
                <button
                  onClick={handleDrop}
                  disabled={enrolling}
                  className="text-[11px] font-bold text-red-600 dark:text-red-400 hover:underline"
                >
                  {enrolling ? 'Processing...' : 'Drop Course'}
                </button>
              </div>
            ) : (
              <button
                onClick={handleEnroll}
                disabled={enrolling}
                className="bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold px-4 py-2 rounded-lg transition shadow-xs"
              >
                {enrolling ? 'Enrolling...' : 'Enroll in Course'}
              </button>
            )}
          </div>
        </div>

        {/* Top-Right Progress Box */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 p-4 shadow-xs flex items-center justify-between gap-4 shrink-0 min-w-[240px] transition-colors">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 flex items-center justify-center shrink-0">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
              </svg>
            </div>
            <div>
              <p className="text-sm font-bold text-slate-900 dark:text-white">{overallCompletionPercent}% Complete</p>
              <p className="text-[11px] text-slate-400 dark:text-slate-500 font-medium">
                {completedContentCount} of {totalContentCount || 10} completed
              </p>
            </div>
          </div>
          <div className="h-10 w-10 rounded-full border-[3px] border-blue-600 dark:border-blue-500 flex items-center justify-center text-[11px] font-black text-blue-600 dark:text-blue-400 shrink-0">
            {overallCompletionPercent}%
          </div>
        </div>
      </div>

      {message && (
        <div className={`mb-6 p-4 rounded-xl text-xs font-bold leading-5 ${message.includes('Success') || message.includes('enrolled') ? 'border border-emerald-200 bg-emerald-50 dark:bg-emerald-950/40 dark:border-emerald-800 text-emerald-700 dark:text-emerald-300' : 'border border-red-200 bg-red-50 dark:bg-red-950/40 dark:border-red-800 text-red-700 dark:text-red-300'}`}>
          {message}
        </div>
      )}

      {/* 2. MAIN TABS NAVIGATION BAR */}
      <div className="border-b border-slate-200/80 dark:border-slate-800 mb-8 flex items-center gap-6 overflow-x-auto no-scrollbar transition-colors">
        {[
          { id: 'modules', label: 'Modules (Active)' },
          { id: 'assignments', label: 'Assignments' },
          { id: 'quizzes', label: 'Quizzes' },
          { id: 'announcements', label: 'Announcements' },
          { id: 'discussions', label: 'Discussions' },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`pb-3 text-xs sm:text-sm font-bold transition whitespace-nowrap relative ${
              activeTab === tab.id
                ? 'text-blue-600 dark:text-blue-400 border-b-2 border-blue-600 dark:border-blue-400'
                : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-white'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* 3. MAIN 2-COLUMN LAYOUT */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* LEFT COLUMN (2/3 width) - CURRICULUM OR ACTIVE TAB CONTENT */}
        <div className="lg:col-span-2 space-y-6">
          
          {activeTab === 'assignments' ? (
            <CourseAssignmentsManager
              courseId={id}
              canManage={isCreatorOrStaff}
              isEnrolled={isEnrolled}
            />
          ) : activeTab === 'quizzes' ? (
            <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 p-6 shadow-xs transition-colors">
              <h2 className="text-base font-bold text-slate-900 dark:text-white mb-4">Active Quizzes</h2>
              <div className="space-y-3">
                <div className="flex items-center justify-between p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800">
                  <div>
                    <h3 className="text-xs font-bold text-slate-900 dark:text-white">Web Dev Quiz 1</h3>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">Duration: 30 mins · 15 Questions</p>
                  </div>
                  <span className="text-xs font-bold text-emerald-700 dark:text-emerald-400 bg-emerald-100/70 dark:bg-emerald-950/40 px-3 py-1 rounded-full">Active</span>
                </div>
                <div className="flex items-center justify-between p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800">
                  <div>
                    <h3 className="text-xs font-bold text-slate-900 dark:text-white">Algo Quiz 4</h3>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">Duration: 45 mins · 20 Questions</p>
                  </div>
                  <span className="text-xs font-bold text-emerald-700 dark:text-emerald-400 bg-emerald-100/70 dark:bg-emerald-950/40 px-3 py-1 rounded-full">Active</span>
                </div>
              </div>
            </div>
          ) : activeTab === 'announcements' ? (
            <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 p-6 shadow-xs space-y-4 transition-colors">
              <h2 className="text-base font-bold text-slate-900 dark:text-white mb-2">Course Announcements</h2>
              <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800 space-y-1">
                <div className="flex items-center justify-between">
                  <h3 className="text-xs font-bold text-slate-900 dark:text-white">ML Exam Dates Finalized</h3>
                  <span className="text-[10px] text-slate-400 dark:text-slate-500 font-medium">2 hours ago</span>
                </div>
                <p className="text-xs text-slate-600 dark:text-slate-300">The midterm exam for Machine Learning has been scheduled for Nov 25th in Room 302.</p>
              </div>
              <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800 space-y-1">
                <div className="flex items-center justify-between">
                  <h3 className="text-xs font-bold text-slate-900 dark:text-white">New Practice Dataset Uploaded</h3>
                  <span className="text-[10px] text-slate-400 dark:text-slate-500 font-medium">10+ minutes ago</span>
                </div>
                <p className="text-xs text-slate-600 dark:text-slate-300">Please review module 1 practice dataset files prior to Friday's lecture.</p>
              </div>
            </div>
          ) : activeTab === 'discussions' ? (
            <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 p-6 shadow-xs transition-colors">
              <h2 className="text-base font-bold text-slate-900 dark:text-white mb-4">Class Discussion Forum</h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">Ask questions and discuss topics with fellow students and instructors.</p>
              <div className="mt-4 p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800 text-center text-xs font-medium text-slate-500 dark:text-slate-400">
                No active discussion threads yet. Be the first to start a conversation!
              </div>
            </div>
          ) : (
            /* MODULES TAB (DEFAULT ACTIVE TAB) */
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-extrabold text-slate-900 dark:text-white tracking-tight transition-colors">
                  Course Curriculum (Modules)
                </h2>
                {isCreatorOrStaff && (
                  <button
                    onClick={() => setActiveTab('modules_manage')}
                    className="text-xs font-bold text-blue-600 dark:text-blue-400 hover:underline"
                  >
                    + Manage Modules
                  </button>
                )}
              </div>

              {isCreatorOrStaff && activeTab === 'modules_manage' ? (
                <ModuleCurriculumManager
                  courseId={id}
                  modules={course.modules || []}
                  onRefresh={fetchCourseDetails}
                  canEdit={true}
                />
              ) : course.modules && course.modules.length > 0 ? (
                <div className="space-y-4">
                  {course.modules.map((module, mIdx) => {
                    const isExpanded = expandedModules[module.id];
                    const modProgress = calculateModuleProgress(module);

                    return (
                      <div
                        key={module.id}
                        className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-xs overflow-hidden transition-colors"
                      >
                        {/* MODULE HEADER ROW */}
                        <div
                          onClick={() => toggleModuleAccordion(module.id)}
                          className="p-5 flex items-center justify-between cursor-pointer hover:bg-slate-50/80 dark:hover:bg-slate-800/60 transition select-none"
                        >
                          <div className="flex items-center gap-3">
                            <button className="text-slate-400 dark:text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 transition">
                              <svg
                                className={`w-4 h-4 transition-transform duration-200 ${
                                  isExpanded ? 'rotate-180' : ''
                                }`}
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M19 9l-7 7-7-7" />
                              </svg>
                            </button>
                            <div>
                              <h3 className="text-sm font-extrabold text-slate-900 dark:text-white">
                                Module {module.position || mIdx + 1}: {module.title}
                              </h3>
                              {module.description && (
                                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 font-medium leading-relaxed max-w-xl">
                                  {module.description}
                                </p>
                              )}
                            </div>
                          </div>

                          <span className="text-[11px] font-bold text-slate-600 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 px-2.5 py-1 rounded-full shrink-0">
                            {modProgress}%
                          </span>
                        </div>

                        {/* MODULE CONTENT ITEMS LIST */}
                        {isExpanded && (
                          <div className="border-t border-slate-100 dark:border-slate-800 p-4 space-y-2.5 bg-slate-50/40 dark:bg-slate-950/40">
                            {module.content && module.content.length > 0 ? (
                              module.content.map((c) => {
                                const isCompleted = completedItems[c.id] || false;
                                const contentType = (c.type || 'DOCUMENT').toUpperCase();

                                return (
                                  <div
                                    key={c.id}
                                    onClick={() => setSelectedContent(c)}
                                    className="flex items-center justify-between p-3.5 rounded-xl bg-white dark:bg-slate-800/90 border border-slate-200/70 dark:border-slate-700 hover:border-blue-400/50 hover:shadow-xs transition cursor-pointer group"
                                  >
                                    <div className="flex items-center gap-3">
                                      {/* Content Type Icon Tile */}
                                      <div className="p-2 rounded-lg bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 shrink-0">
                                        {contentType.includes('VIDEO') ? (
                                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                          </svg>
                                        ) : contentType.includes('LINK') || contentType.includes('URL') ? (
                                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                                          </svg>
                                        ) : (
                                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                          </svg>
                                        )}
                                      </div>

                                      <div>
                                        <h4 className={`text-xs font-bold text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition ${isCompleted ? 'line-through text-slate-400 dark:text-slate-500' : ''}`}>
                                          {c.type ? `${c.type.charAt(0) + c.type.slice(1).toLowerCase()}: ` : ''}{c.title}
                                        </h4>
                                        {c.description && (
                                          <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate max-w-md mt-0.5">
                                            {c.description}
                                          </p>
                                        )}
                                      </div>
                                    </div>

                                    {/* Checkmark Status Toggle */}
                                    <div className="flex items-center gap-3">
                                      {isEnrolled && (
                                        <button
                                          onClick={(e) => handleToggleContentProgress(c.id, !isCompleted, e)}
                                          className="p-1"
                                          title={isCompleted ? 'Mark incomplete' : 'Mark complete'}
                                        >
                                          {isCompleted ? (
                                            <span className="h-5 w-5 rounded-full bg-emerald-500 text-white flex items-center justify-center text-[10px] font-bold">
                                              ✓
                                            </span>
                                          ) : (
                                            <span className="h-5 w-5 rounded-full border-2 border-slate-300 dark:border-slate-600 hover:border-blue-500 transition block" />
                                          )}
                                        </button>
                                      )}
                                    </div>
                                  </div>
                                );
                              })
                            ) : (
                              <p className="text-xs font-medium text-slate-400 dark:text-slate-500 italic p-2">
                                No content items added to this module yet.
                              </p>
                            )}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 p-8 text-center text-xs font-bold text-slate-400">
                  The curriculum for this course has not been published yet.
                </div>
              )}
            </div>
          )}

        </div>

        {/* RIGHT COLUMN - SIDEBAR HIGHLIGHTS & DEADLINES (1/3 width) */}
        <div className="lg:col-span-1">
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 p-5 shadow-xs space-y-6 sticky top-24 transition-colors">
            <h2 className="text-base font-extrabold text-slate-900 dark:text-white border-b border-slate-100 dark:border-slate-800 pb-3.5 transition-colors">
              Course Highlights & Deadlines
            </h2>

            {/* Recent Announcements */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-xs font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider">Recent Announcements</h3>
                <button onClick={() => setActiveTab('announcements')} className="text-[11px] font-semibold text-blue-600 dark:text-blue-400 hover:underline">View all</button>
              </div>
              <div className="space-y-2.5">
                <div className="flex items-start gap-3 p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800">
                  <div className="p-2 bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 rounded-full shrink-0 mt-0.5">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                    </svg>
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-slate-900 dark:text-white">ML Exam Dates Finalized</h4>
                    <p className="text-[10px] text-slate-500 dark:text-slate-400 mt-0.5">Due to 2 hours ago</p>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800">
                  <div className="p-2 bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 rounded-full shrink-0 mt-0.5">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-slate-900 dark:text-white">New Practice Dataset</h4>
                    <p className="text-[10px] text-slate-500 dark:text-slate-400 mt-0.5">10+ minutes ago</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Upcoming Assessments */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-xs font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider">Upcoming Assessments</h3>
                <button onClick={() => setActiveTab('assignments')} className="text-[11px] font-semibold text-blue-600 dark:text-blue-400 hover:underline">View All</button>
              </div>
              <div className="space-y-2.5">
                {assignments.length > 0 ? (
                  assignments.slice(0, 3).map((asm) => (
                    <div key={asm.id} className="flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-blue-100/60 dark:bg-blue-900/40 text-blue-600 dark:text-blue-400 rounded-lg shrink-0">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                          </svg>
                        </div>
                        <div>
                          <h4 className="text-xs font-bold text-slate-900 dark:text-white">{asm.title}</h4>
                          <p className="text-[10px] text-slate-500 dark:text-slate-400 font-medium">Due: {new Date(asm.dueDate).toLocaleDateString()}</p>
                        </div>
                      </div>
                      <span className="text-[10px] font-semibold text-slate-600 dark:text-slate-300 bg-white dark:bg-slate-800 px-2 py-1 rounded border border-slate-200 dark:border-slate-700 shrink-0">
                        {new Date(asm.dueDate).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                      </span>
                    </div>
                  ))
                ) : (
                  <>
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

                    <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-blue-100/60 dark:bg-blue-900/40 text-blue-600 dark:text-blue-400 rounded-lg shrink-0">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                          </svg>
                        </div>
                        <div>
                          <h4 className="text-xs font-bold text-slate-900 dark:text-white">Machine Algebra Quiz</h4>
                          <p className="text-[10px] text-slate-500 dark:text-slate-400 font-medium">Active Completed</p>
                        </div>
                      </div>
                      <span className="text-[10px] font-bold text-emerald-700 dark:text-emerald-400 bg-emerald-100/70 dark:bg-emerald-950/40 px-2 py-0.5 rounded-full shrink-0">Active</span>
                    </div>
                  </>
                )}
              </div>
            </div>

          </div>
        </div>

      </div>

      {/* Content Viewer Modal */}
      <ContentViewerModal
        content={selectedContent}
        isOpen={Boolean(selectedContent)}
        onClose={() => setSelectedContent(null)}
        isCompleted={selectedContent ? completedItems[selectedContent.id] : false}
        onToggleComplete={isEnrolled ? handleToggleContentProgress : null}
      />
    </main>
  );
}

export default CourseDetails;
