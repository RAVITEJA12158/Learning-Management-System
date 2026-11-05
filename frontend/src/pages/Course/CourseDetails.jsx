import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
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

// Components & Tabs

function CourseDetails() {
  const {
    id
  } = (0, useParams)();
  const {
    user
  } = (0, useAuth)();

  // Tab & Data State
  const [activeTab, setActiveTab] = (0, useState)('overview');
  const [course, setCourse] = (0, useState)(null);
  const [loading, setLoading] = (0, useState)(true);
  const [enrolling, setEnrolling] = (0, useState)(false);
  const [isEnrolled, setIsEnrolled] = (0, useState)(true);
  const [message, setMessage] = (0, useState)('');

  // Course Data
  const [assignments, setAssignments] = (0, useState)([]);
  const [progressData, setProgressData] = (0, useState)(null);
  const [completedItems, setCompletedItems] = (0, useState)({});
  const [selectedContent, setSelectedContent] = (0, useState)(null);
  (0, useEffect)(() => {
    fetchCourseDetails();
    checkEnrollmentStatus();
    fetchAssignments();
  }, [id]);
  (0, useEffect)(() => {
    if (isEnrolled) {
      fetchProgress();
    }
  }, [id, isEnrolled]);
  const checkEnrollmentStatus = async () => {
    try {
      const enrolledList = await courseService.getEnrolled();
      const found = enrolledList.some(c => c.id === id);
      setIsEnrolled(found || user?.role !== 'student');
    } catch {
      setIsEnrolled(true);
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
      progress.modules?.forEach(mod => {
        mod.content?.forEach(item => {
          map[item.contentId] = item.completed;
        });
      });
      setCompletedItems(map);
    } catch {
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
      setCompletedItems(prev => ({
        ...prev,
        [contentId]: status
      }));
      fetchProgress();
    } catch {
      /* silent */
    }
  };
  if (loading) {
    return /*#__PURE__*/React.createElement("div", {
      className: "flex min-h-[calc(100vh-72px)] items-center justify-center bg-[#F8FAFC] dark:bg-[#030712] transition-colors"
    }, /*#__PURE__*/React.createElement("div", {
      className: "flex items-center gap-3 text-xs font-bold text-slate-500 dark:text-gray-400"
    }, /*#__PURE__*/React.createElement("svg", {
      className: "h-4 w-4 animate-spin text-blue-600 dark:text-cyan-400",
      fill: "none",
      viewBox: "0 0 24 24"
    }, /*#__PURE__*/React.createElement("circle", {
      className: "opacity-25",
      cx: "12",
      cy: "12",
      r: "10",
      stroke: "currentColor",
      strokeWidth: "4"
    }), /*#__PURE__*/React.createElement("path", {
      className: "opacity-75",
      fill: "currentColor",
      d: "M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
    })), "Loading course workspace\u2026"));
  }
  if (!course) {
    return /*#__PURE__*/React.createElement("div", {
      className: "flex min-h-[calc(100vh-72px)] items-center justify-center bg-[#F8FAFC] dark:bg-[#030712] transition-colors"
    }, /*#__PURE__*/React.createElement("p", {
      className: "text-xs font-bold text-slate-500 dark:text-gray-400"
    }, "Course not found."));
  }
  const userRole = user?.role?.toLowerCase();
  const isCreatorOrStaff = userRole === 'admin' || userRole === 'faculty' || course.createdById === user?.id;
  const totalContentCount = course.modules?.reduce((acc, m) => acc + (m.content?.length || 0), 0) || 0;
  const completedContentCount = Object.values(completedItems).filter(Boolean).length;
  const overallCompletionPercent = totalContentCount > 0 ? Math.round(completedContentCount / totalContentCount * 100) : progressData?.completionPercent ?? 75;
  const instructorsText = course.instructorName || (course.createdBy?.name ? `Dr. ${course.createdBy.name}` : 'Dr. Alan Turing');
  const courseCode = course.courseCode || 'CS401';
  return /*#__PURE__*/React.createElement("div", {
    className: "flex min-h-[calc(100vh-72px)] bg-[#F8FAFC] dark:bg-[#030712] text-slate-900 dark:text-white font-sans transition-colors duration-200"
  }, /*#__PURE__*/React.createElement(CourseSidebar, {
    courseCode: courseCode,
    courseTitle: course.title,
    overallCompletionPercent: overallCompletionPercent,
    activeTab: activeTab,
    onSelectTab: setActiveTab,
    isEnrolled: isEnrolled,
    enrolling: enrolling,
    onDropCourse: handleDrop
  }), /*#__PURE__*/React.createElement("div", {
    className: "flex-1 min-w-0 overflow-y-auto"
  }, /*#__PURE__*/React.createElement("div", {
    className: "lg:hidden sticky top-0 z-20 bg-white/95 dark:bg-gray-950/95 backdrop-blur-md border-b border-slate-200/80 dark:border-white/5 px-4 py-2 flex items-center gap-2 overflow-x-auto no-scrollbar"
  }, SIDEBAR_TABS.map(tab => /*#__PURE__*/React.createElement("button", {
    key: tab.id,
    onClick: () => setActiveTab(tab.id),
    className: `whitespace-nowrap rounded-lg px-3 py-1.5 text-xs font-bold transition cursor-pointer ${activeTab === tab.id ? 'bg-blue-600 dark:bg-cyan-500 text-white dark:text-gray-950 shadow-xs' : 'text-slate-600 dark:text-gray-400 hover:bg-slate-100 dark:hover:bg-white/[0.04] hover:text-slate-900 dark:hover:text-white'}`
  }, tab.label))), message && /*#__PURE__*/React.createElement("div", {
    className: `mx-6 mt-4 p-3.5 rounded-xl text-xs font-bold ${message.includes('Success') || message.includes('enrolled') ? 'bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300' : 'bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-800 text-red-800 dark:text-red-300'}`
  }, message), activeTab === 'overview' && /*#__PURE__*/React.createElement(OverviewTab, {
    course: course,
    courseCode: courseCode,
    instructorsText: instructorsText,
    isCreatorOrStaff: isCreatorOrStaff,
    isEnrolled: isEnrolled,
    enrolling: enrolling,
    handleEnroll: handleEnroll,
    assignments: assignments,
    onSelectTab: setActiveTab
  }), activeTab === 'modules' && /*#__PURE__*/React.createElement(ModulesTab, {
    course: course,
    courseId: id,
    isCreatorOrStaff: isCreatorOrStaff,
    isEnrolled: isEnrolled,
    completedItems: completedItems,
    onToggleContentProgress: handleToggleContentProgress,
    onSelectContent: setSelectedContent,
    onRefreshCourse: fetchCourseDetails
  }), activeTab === 'assignments' && /*#__PURE__*/React.createElement(AssignmentsTab, {
    courseId: id,
    isCreatorOrStaff: isCreatorOrStaff,
    isEnrolled: isEnrolled
  }), activeTab === 'quizzes' && /*#__PURE__*/React.createElement(QuizzesTab, {
    courseId: id,
    isCreatorOrStaff: isCreatorOrStaff,
    isEnrolled: isEnrolled
  }), activeTab === 'attendance' && /*#__PURE__*/React.createElement(AttendanceTab, {
    courseId: id,
    isCreatorOrStaff: isCreatorOrStaff,
    user: user
  }), activeTab === 'grades' && /*#__PURE__*/React.createElement(GradesTab, {
    courseId: id,
    course: course,
    isCreatorOrStaff: isCreatorOrStaff,
    overallCompletionPercent: overallCompletionPercent
  }), activeTab === 'announcements' && /*#__PURE__*/React.createElement(AnnouncementsTab, {
    courseId: id,
    instructorsText: instructorsText,
    isCreatorOrStaff: isCreatorOrStaff
  }), activeTab === 'discussions' && /*#__PURE__*/React.createElement(DiscussionsTab, {
    courseId: id,
    isCreatorOrStaff: isCreatorOrStaff,
    isEnrolled: isEnrolled,
    user: user
  }), activeTab === 'roster' && /*#__PURE__*/React.createElement(RosterTab, {
    course: course,
    courseId: id,
    isCreatorOrStaff: isCreatorOrStaff,
    onRefreshCourse: fetchCourseDetails
  })), /*#__PURE__*/React.createElement(ContentViewerModal, {
    content: selectedContent,
    isOpen: Boolean(selectedContent),
    onClose: () => setSelectedContent(null),
    isCompleted: selectedContent ? completedItems[selectedContent.id] : false,
    onToggleComplete: isEnrolled ? handleToggleContentProgress : null
  }));
}
var _default = CourseDetails;

export { CourseDetails };

export default _default;
