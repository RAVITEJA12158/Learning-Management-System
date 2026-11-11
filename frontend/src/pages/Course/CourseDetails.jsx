import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { courseService, assignmentService, progressService } from '../../services/courseService';
import { useAuth } from '../../context/AuthContext';
import ContentViewerModal from '../../components/ContentViewerModal';
import { CourseSidebar, SIDEBAR_TABS } from './components/CourseSidebar';
import { OverviewTab } from './tabs/OverviewTab';
import { ModulesTab } from './tabs/ModulesTab';
import { AssignmentsTab } from './tabs/AssignmentsTab';
import { QuizzesTab } from './tabs/QuizzesTab';
import { AttendanceTab } from './tabs/AttendanceTab';
import { GradesTab } from './tabs/GradesTab';
import { AnnouncementsTab } from './tabs/AnnouncementsTab';
import { DiscussionsTab } from './tabs/DiscussionsTab';
import { RosterTab } from './tabs/RosterTab';

function CourseDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();

  const [activeTab, setActiveTab] = useState('overview');
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [enrolling, setEnrolling] = useState(false);
  const [isEnrolled, setIsEnrolled] = useState(false);
  const [message, setMessage] = useState('');

  const [assignments, setAssignments] = useState([]);
  const [progressData, setProgressData] = useState(null);
  const [completedItems, setCompletedItems] = useState({});
  const [selectedContent, setSelectedContent] = useState(null);

  useEffect(() => {
    fetchCourseDetails();
  }, [id]);

  useEffect(() => {
    checkEnrollmentStatus();
  }, [id, user, isAuthenticated, course]);

  useEffect(() => {
    if (isAuthenticated && (isEnrolled || isUserCourseStaff())) {
      fetchAssignments();
    }
    if (isAuthenticated && isEnrolled && user?.role?.toLowerCase() === 'student') {
      fetchProgress();
    }
  }, [id, isAuthenticated, isEnrolled, course]);

  const isUserCourseStaff = () => {
    if (!isAuthenticated || !user || !course) return false;
    const role = (user.role || '').toLowerCase();
    if (role === 'admin') return true;
    if (role === 'faculty') {
      const isCreator = course.createdById === user.id;
      const isCoInstructor = course.instructors?.some(
        (inst) => inst.facultyId === user.id || inst.faculty?.id === user.id || inst.id === user.id
      );
      return Boolean(isCreator || isCoInstructor);
    }
    return false;
  };

  const checkEnrollmentStatus = async () => {
    if (!isAuthenticated || !user) {
      setIsEnrolled(false);
      return;
    }
    const role = (user.role || '').toLowerCase();
    if (role !== 'student') {
      setIsEnrolled(false);
      return;
    }
    try {
      const enrolledList = await courseService.getEnrolled();
      const found = Array.isArray(enrolledList) && enrolledList.some((c) => c.id === id);
      setIsEnrolled(found);
    } catch {
      setIsEnrolled(false);
    }
  };

  const fetchCourseDetails = async () => {
    try {
      const data = await courseService.getById(id);
      setCourse(data);
    } catch {
      setMessage('Failed to load course details.');
    } finally {
      setLoading(false);
    }
  };

  const fetchAssignments = async () => {
    try {
      const data = await assignmentService.getByCourse(id);
      if (Array.isArray(data)) setAssignments(data);
    } catch {
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
    } catch {
      /* silent */
    }
  };

  const handleEnroll = async () => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    setEnrolling(true);
    setMessage('');
    try {
      await courseService.enroll(id);
      setIsEnrolled(true);
      setMessage('Successfully enrolled in course!');
      fetchProgress();
      fetchAssignments();
    } catch (err) {
      setMessage(err.message || 'Failed to enroll.');
    } finally {
      setEnrolling(false);
    }
  };

  const handleDrop = async () => {
    setEnrolling(true);
    setMessage('');
    try {
      await courseService.unenroll(id);
      setIsEnrolled(false);
      setProgressData(null);
      setCompletedItems({});
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
      setCompletedItems((prev) => ({
        ...prev,
        [contentId]: status,
      }));
      fetchProgress();
    } catch {
      /* silent */
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-[calc(100vh-72px)] items-center justify-center bg-[#F8FAFC] dark:bg-[#030712] transition-colors">
        <div className="flex items-center gap-3 text-xs font-bold text-slate-500 dark:text-gray-400">
          <svg
            className="h-4 w-4 animate-spin text-blue-600 dark:text-cyan-400"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            />
          </svg>
          Loading course workspace…
        </div>
      </div>
    );
  }

  if (!course) {
    return (
      <div className="flex min-h-[calc(100vh-72px)] items-center justify-center bg-[#F8FAFC] dark:bg-[#030712] transition-colors">
        <p className="text-xs font-bold text-slate-500 dark:text-gray-400">Course not found.</p>
      </div>
    );
  }

  const isCreatorOrStaff = isUserCourseStaff();
  const totalContentCount =
    course.modules?.reduce((acc, m) => acc + (m.content?.length || 0), 0) || 0;
  const completedContentCount = Object.values(completedItems).filter(Boolean).length;
  const overallCompletionPercent =
    totalContentCount > 0
      ? Math.round((completedContentCount / totalContentCount) * 100)
      : progressData?.completionPercent ?? 0;

  const rawCreatorName = course.instructorName || course.createdBy?.name || 'Course Instructor';
  const instructorsText = /^(dr\.|prof\.)/i.test(rawCreatorName.trim())
    ? rawCreatorName.trim()
    : rawCreatorName;
  const courseCode = course.courseCode || 'COURSE';

  return (
    <div className="flex flex-col lg:flex-row min-h-[calc(100vh-72px)] w-full max-w-[100vw] overflow-x-hidden bg-[#F8FAFC] dark:bg-[#030712] text-slate-900 dark:text-white font-sans transition-colors duration-200">
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

      <div className="flex-1 min-w-0 w-full overflow-x-hidden">
        {/* Mobile & Tablet Course Header + Navigation Strip */}
        <div className="lg:hidden sticky top-0 z-20 bg-white/95 dark:bg-gray-950/95 backdrop-blur-md border-b border-slate-200/80 dark:border-white/5">
          <div className="flex items-center justify-between gap-3 px-4 pt-3 pb-2 border-b border-slate-100 dark:border-white/5">
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-bold uppercase tracking-wider text-blue-600 dark:text-cyan-400">
                  {courseCode}
                </span>
                <span className="rounded-full bg-blue-50 dark:bg-cyan-950/60 px-2 py-0.5 text-[10px] font-extrabold text-blue-600 dark:text-cyan-400">
                  {overallCompletionPercent}% Complete
                </span>
              </div>
              <h2 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white truncate mt-0.5">
                {course.title}
              </h2>
            </div>
            {isEnrolled && (
              <button
                onClick={handleDrop}
                disabled={enrolling}
                className="shrink-0 rounded-lg border border-red-200 dark:border-rose-900/50 bg-red-50/70 dark:bg-rose-950/30 px-2.5 py-1.5 text-[11px] font-bold text-red-600 dark:text-rose-400 cursor-pointer disabled:opacity-50"
              >
                {enrolling ? '…' : 'Drop Course'}
              </button>
            )}
          </div>
          <div className="px-3 py-2 flex items-center gap-2 overflow-x-auto no-scrollbar">
            {SIDEBAR_TABS.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`whitespace-nowrap min-h-[40px] rounded-xl px-3.5 py-2 text-xs font-bold transition cursor-pointer ${
                  activeTab === tab.id
                    ? 'bg-blue-600 dark:bg-cyan-500 text-white dark:text-gray-950 shadow-xs'
                    : 'text-slate-600 dark:text-gray-400 hover:bg-slate-100 dark:hover:bg-white/[0.04] hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {message && (
          <div
            className={`mx-4 sm:mx-6 mt-4 p-3.5 rounded-xl text-xs font-bold ${
              message.includes('Success') || message.includes('enrolled')
                ? 'bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300'
                : 'bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-800 text-red-800 dark:text-red-300'
            }`}
          >
            {message}
          </div>
        )}

        {activeTab === 'overview' && (
          <OverviewTab
            course={course}
            courseCode={courseCode}
            instructorsText={instructorsText}
            isCreatorOrStaff={isCreatorOrStaff}
            isEnrolled={isEnrolled}
            enrolling={enrolling}
            onEnroll={handleEnroll}
            overallCompletionPercent={overallCompletionPercent}
            totalContentCount={totalContentCount}
            completedContentCount={completedContentCount}
            completedItems={completedItems}
            onToggleContentProgress={handleToggleContentProgress}
            onSelectContent={setSelectedContent}
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
            onRefresh={fetchCourseDetails}
          />
        )}

        {activeTab === 'assignments' && (
          <AssignmentsTab
            courseId={id}
            assignments={assignments}
            isCreatorOrStaff={isCreatorOrStaff}
            isEnrolled={isEnrolled}
            user={user}
            onRefresh={fetchAssignments}
          />
        )}

        {activeTab === 'quizzes' && (
          <QuizzesTab
            courseId={id}
            courseCode={courseCode}
            courseTitle={course.title}
            isCreatorOrStaff={isCreatorOrStaff}
            isEnrolled={isEnrolled}
            user={user}
          />
        )}

        {activeTab === 'attendance' && (
          <AttendanceTab
            courseId={id}
            isCreatorOrStaff={isCreatorOrStaff}
            user={user}
          />
        )}

        {activeTab === 'grades' && (
          <GradesTab
            courseId={id}
            courseTitle={course.title}
            isCreatorOrStaff={isCreatorOrStaff}
            overallCompletionPercent={overallCompletionPercent}
            assignments={assignments}
            user={user}
          />
        )}

        {activeTab === 'discussions' && (
          <DiscussionsTab
            courseId={id}
            isCreatorOrStaff={isCreatorOrStaff}
            user={user}
          />
        )}

        {activeTab === 'announcements' && (
          <AnnouncementsTab
            courseId={id}
            instructorsText={instructorsText}
            isCreatorOrStaff={isCreatorOrStaff}
          />
        )}

        {activeTab === 'roster' && (
          <RosterTab
            course={course}
            instructorsText={instructorsText}
            isCreatorOrStaff={isCreatorOrStaff}
          />
        )}
      </div>

      <ContentViewerModal
        content={selectedContent}
        isOpen={Boolean(selectedContent)}
        onClose={() => setSelectedContent(null)}
        isCompleted={selectedContent ? Boolean(completedItems[selectedContent.id]) : false}
        onToggleComplete={
          isEnrolled && user?.role?.toLowerCase() === 'student'
            ? (cId, status) => handleToggleContentProgress(cId, status)
            : null
        }
      />
    </div>
  );
}

export default CourseDetails;
