import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { courseService, progressService, assignmentService } from '../../services/courseService';
import { useAuth } from '../../context/AuthContext';
import ContentViewerModal from '../../components/ContentViewerModal';

// Components & Tabs
import { CourseSidebar, SIDEBAR_TABS } from './components/CourseSidebar';
import { OverviewTab } from './tabs/OverviewTab';
import { ModulesTab } from './tabs/ModulesTab';
import { AssignmentsTab } from './tabs/AssignmentsTab';
import { QuizzesTab } from './tabs/QuizzesTab';
import { AnnouncementsTab } from './tabs/AnnouncementsTab';
import { DiscussionsTab } from './tabs/DiscussionsTab';

export function CourseDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  // Tab & Data State
  const [activeTab, setActiveTab] = useState('overview');
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [enrolling, setEnrolling] = useState(false);
  const [isEnrolled, setIsEnrolled] = useState(false);
  const [message, setMessage] = useState('');

  // Course Data
  const [assignments, setAssignments] = useState([]);
  const [progressData, setProgressData] = useState(null);
  const [completedItems, setCompletedItems] = useState({});
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
    } catch (_err) {
      // Ignore if staff
    }
  };

  const fetchCourseDetails = async () => {
    try {
      const data = await courseService.getById(id);
      setCourse(data);
    } catch (_err) {
      setMessage('Failed to load course details.');
    } finally {
      setLoading(false);
    }
  };

  const fetchAssignments = async () => {
    try {
      const data = await assignmentService.getByCourse(id);
      if (Array.isArray(data)) setAssignments(data);
    } catch (_err) {
      /* silent */
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
    } catch (_err) {
      /* silent */
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
    } catch (_err) {
      /* silent */
    }
  };

  /* Loading State */
  if (loading) {
    return (
      <div className="flex min-h-[calc(100vh-72px)] items-center justify-center bg-[#F8FAFC] dark:bg-zinc-950 transition-colors">
        <div className="flex items-center gap-3 text-xs font-bold text-slate-500 dark:text-zinc-500">
          <svg className="h-4 w-4 animate-spin text-blue-600 dark:text-blue-500" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
          </svg>
          Loading course details…
        </div>
      </div>
    );
  }

  /* Not Found State */
  if (!course) {
    return (
      <div className="flex min-h-[calc(100vh-72px)] items-center justify-center bg-[#F8FAFC] dark:bg-slate-900 transition-colors">
        <p className="text-xs font-bold text-slate-500 dark:text-slate-400">Course not found.</p>
      </div>
    );
  }

  // Calculated values
  const isCreatorOrStaff =
    user?.role === 'admin' ||
    user?.role === 'faculty' ||
    course.createdById === user?.id;

  const totalContentCount = course.modules?.reduce((acc, m) => acc + (m.content?.length || 0), 0) || 0;
  const completedContentCount = Object.values(completedItems).filter(Boolean).length;
  const overallCompletionPercent =
    progressData?.completionPercent ??
    (totalContentCount > 0 ? Math.round((completedContentCount / totalContentCount) * 100) : 0);

  const instructorsText = course.createdBy?.name
    ? `Dr. ${course.createdBy.name}`
    : 'Dr. Alan Turing';

  const courseCode = course.courseCode || 'CS101';

  return (
    <div className="flex min-h-[calc(100vh-72px)] bg-[#F8FAFC] dark:bg-[#030712] text-slate-900 dark:text-white font-sans transition-colors duration-200">
      {/* 1. PERSISTENT LEFT SIDEBAR (FIXED 250px) */}
      <CourseSidebar
        courseCode={courseCode}
        courseTitle={course.title}
        overallCompletionPercent={overallCompletionPercent}
        activeTab={activeTab}
        onSelectTab={setActiveTab}
        isEnrolled={isEnrolled}
        enrolling={enrolling}
        onDropCourse={handleDrop}
      />

      {/* 2. DYNAMIC MAIN CANVAS */}
      <div className="flex-1 min-w-0 overflow-y-auto">
        {/* Mobile Horizontal Navigation Strip */}
        <div className="lg:hidden sticky top-0 z-20 bg-white/95 dark:bg-gray-950/95 backdrop-blur-md border-b border-slate-200/80 dark:border-white/5 px-4 py-2 flex items-center gap-2 overflow-x-auto no-scrollbar">
          {SIDEBAR_TABS.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`whitespace-nowrap rounded-lg px-3 py-1.5 text-xs font-bold transition cursor-pointer ${
                activeTab === tab.id
                  ? 'bg-blue-600 dark:bg-cyan-500 text-white dark:text-gray-950 shadow-xs'
                  : 'text-slate-600 dark:text-gray-400 hover:bg-slate-100 dark:hover:bg-white/[0.04] hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Global Feedback Messages */}
        {message && (
          <div
            className={`mx-6 mt-4 p-3.5 rounded-xl text-xs font-bold ${
              message.includes('Success') || message.includes('enrolled')
                ? 'bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300'
                : 'bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-800 text-red-800 dark:text-red-300'
            }`}
          >
            {message}
          </div>
        )}

        {/* Tab-driven Content Views */}
        {activeTab === 'overview' && (
          <OverviewTab
            course={course}
            courseCode={courseCode}
            instructorsText={instructorsText}
            isCreatorOrStaff={isCreatorOrStaff}
            isEnrolled={isEnrolled}
            enrolling={enrolling}
            handleEnroll={handleEnroll}
            assignments={assignments}
            onSelectTab={setActiveTab}
          />
        )}

        {activeTab === 'modules' && (
          <ModulesTab
            course={course}
            courseId={id}
            isCreatorOrStaff={isCreatorOrStaff}
            isEnrolled={isEnrolled}
            completedItems={completedItems}
            onToggleContentProgress={handleToggleContentProgress}
            onSelectContent={setSelectedContent}
            onRefreshCourse={fetchCourseDetails}
          />
        )}

        {activeTab === 'assignments' && (
          <AssignmentsTab
            courseId={id}
            isCreatorOrStaff={isCreatorOrStaff}
            isEnrolled={isEnrolled}
          />
        )}

        {activeTab === 'quizzes' && (
          <QuizzesTab
            courseId={id}
            isCreatorOrStaff={isCreatorOrStaff}
            isEnrolled={isEnrolled}
          />
        )}

        {activeTab === 'announcements' && (
          <AnnouncementsTab
            instructorsText={instructorsText}
            isCreatorOrStaff={isCreatorOrStaff}
          />
        )}

        {activeTab === 'discussions' && (
          <DiscussionsTab
            isEnrolled={isEnrolled}
            user={user}
          />
        )}
      </div>

      {/* Shared Content Viewer Modal */}
      <ContentViewerModal
        content={selectedContent}
        isOpen={Boolean(selectedContent)}
        onClose={() => setSelectedContent(null)}
        isCompleted={selectedContent ? completedItems[selectedContent.id] : false}
        onToggleComplete={isEnrolled ? handleToggleContentProgress : null}
      />
    </div>
  );
}

export default CourseDetails;
