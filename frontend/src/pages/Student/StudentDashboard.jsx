import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { notificationService, courseService } from '../../services/courseService';
import { useAuth } from '../../context/AuthContext';
import { CourseCard } from '../../components/common/CourseCard';
import SpotlightCard from '../../components/common/SpotlightCard';
import Badge from '../../components/common/Badge';
import { BookIcon, ChartIcon, CalendarIcon, AcademicCapIcon, DocumentIcon, ClipboardCheckIcon, BellIcon } from '../../components/common/Icons';

function StudentDashboard() {
  const {
    user
  } = (0, useAuth)();
  const navigate = (0, useNavigate)();
  const [enrolledCourses, setEnrolledCourses] = (0, useState)([]);
  const [loading, setLoading] = (0, useState)(true);
  const notifications = notificationService.getAll().slice(0, 3);
  (0, useEffect)(() => {
    fetchEnrolledCourses();
  }, []);
  const fetchEnrolledCourses = async () => {
    try {
      const courses = await courseService.getEnrolled();
      if (Array.isArray(courses)) {
        setEnrolledCourses(courses);
      }
    } catch (err) {
      console.error('Failed to fetch enrolled courses:', err);
    } finally {
      setLoading(false);
    }
  };
  const coursesList = enrolledCourses;
  const userInitial = user?.name ? user.name.trim().charAt(0).toUpperCase() : 'S';
  return /*#__PURE__*/React.createElement("main", {
    className: "mx-auto max-w-[1440px] px-4 py-8 sm:px-8 lg:py-10 w-full transition-colors duration-200"
  }, /*#__PURE__*/React.createElement("div", {
    className: "flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8"
  }, /*#__PURE__*/React.createElement("div", {
    className: "flex items-center gap-4"
  }, /*#__PURE__*/React.createElement("div", {
    className: "relative p-[2px] rounded-full dark:bg-gradient-to-r dark:from-cyan-400 dark:via-blue-500 dark:to-purple-600 dark:animate-spin-ring shrink-0"
  }, user?.profileImage ? /*#__PURE__*/React.createElement("img", {
    src: user.profileImage,
    alt: user?.name || 'Student',
    className: "h-16 w-16 rounded-full object-cover border-2 border-white dark:border-gray-950 shadow-sm"
  }) : /*#__PURE__*/React.createElement("div", {
    className: "h-16 w-16 rounded-full bg-gradient-to-tr from-cyan-500 to-purple-600 text-white flex items-center justify-center text-2xl font-black border-2 border-white dark:border-gray-950 shadow-sm select-none"
  }, userInitial)), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("h1", {
    className: "text-2xl sm:text-3xl font-black text-slate-900 dark:text-transparent dark:bg-clip-text dark:bg-gradient-to-r dark:from-cyan-400 dark:via-blue-400 dark:to-purple-500 tracking-tight transition-colors"
  }, "Welcome back, ", user?.name?.split(' ')[0] || 'Sarah', "!"), /*#__PURE__*/React.createElement("p", {
    className: "text-xs sm:text-sm text-slate-500 dark:text-gray-400 font-medium mt-0.5 transition-colors"
  }, user?.email || 'sarah.jensen@university.edu', " \xB7 Ready to continue your learning journey?"))), /*#__PURE__*/React.createElement("div", {
    className: "flex flex-wrap items-center gap-2.5"
  }, /*#__PURE__*/React.createElement("button", {
    onClick: () => navigate('/grades'),
    className: "hub-lift px-3.5 py-2 rounded-xl bg-white dark:bg-white/[0.03] border border-slate-200 dark:border-white/10 text-xs font-bold text-slate-700 dark:text-gray-200 hover:border-blue-500 dark:hover:border-cyan-400 transition cursor-pointer"
  }, "\uD83D\uDCCA View Transcript"), /*#__PURE__*/React.createElement("button", {
    onClick: () => navigate('/attendance'),
    className: "hub-lift px-3.5 py-2 rounded-xl bg-white dark:bg-white/[0.03] border border-slate-200 dark:border-white/10 text-xs font-bold text-slate-700 dark:text-gray-200 hover:border-blue-500 dark:hover:border-cyan-400 transition cursor-pointer"
  }, "\uD83D\uDCC5 Attendance Log"))), /*#__PURE__*/React.createElement("div", {
    className: "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8"
  }, /*#__PURE__*/React.createElement(SpotlightCard, {
    onClick: () => navigate('/courses'),
    className: "p-5 flex items-center justify-between cursor-pointer"
  }, /*#__PURE__*/React.createElement("div", {
    className: "flex items-center gap-3.5"
  }, /*#__PURE__*/React.createElement("div", {
    className: "h-11 w-11 rounded-xl bg-blue-50 dark:bg-cyan-950/40 text-blue-600 dark:text-cyan-400 flex items-center justify-center shrink-0 border border-transparent dark:border-cyan-500/20"
  }, /*#__PURE__*/React.createElement(BookIcon, {
    className: "w-5 h-5"
  })), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("h3", {
    className: "text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-gray-400"
  }, "Total Courses"), /*#__PURE__*/React.createElement("p", {
    className: "text-sm font-black text-slate-900 dark:text-white mt-0.5"
  }, coursesList.length, " Enrolled ", /*#__PURE__*/React.createElement("span", {
    className: "text-slate-400 dark:text-gray-600 font-normal"
  }, "|"), ' ', /*#__PURE__*/React.createElement("span", {
    className: "text-blue-600 dark:text-cyan-300"
  }, "Active"))))), /*#__PURE__*/React.createElement(SpotlightCard, {
    onClick: () => navigate(coursesList[0]?.id ? `/courses/${coursesList[0].id}` : '/courses'),
    className: "p-5 flex items-center justify-between cursor-pointer"
  }, /*#__PURE__*/React.createElement("div", {
    className: "flex items-center gap-3.5"
  }, /*#__PURE__*/React.createElement("div", {
    className: "h-11 w-11 rounded-xl bg-purple-50 dark:bg-purple-950/40 text-purple-600 dark:text-purple-400 flex items-center justify-center shrink-0 border border-transparent dark:border-purple-500/20"
  }, /*#__PURE__*/React.createElement(ChartIcon, {
    className: "w-5 h-5"
  })), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("h3", {
    className: "text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-gray-400"
  }, "Overall Progress"), /*#__PURE__*/React.createElement("p", {
    className: "text-xs text-slate-600 dark:text-gray-300 mt-0.5 font-medium"
  }, "Completed: ", /*#__PURE__*/React.createElement("span", {
    className: "font-bold text-slate-900 dark:text-white"
  }, "51/68 Items")))), /*#__PURE__*/React.createElement("div", {
    className: "h-10 w-10 rounded-full border-[3px] border-blue-600 dark:border-cyan-400 dark:shadow-[0_0_12px_rgba(34,211,238,0.5)] flex items-center justify-center text-[11px] font-black text-blue-600 dark:text-cyan-400 shrink-0"
  }, "75%")), /*#__PURE__*/React.createElement(SpotlightCard, {
    onClick: () => navigate('/attendance'),
    className: "p-5 flex items-center justify-between cursor-pointer"
  }, /*#__PURE__*/React.createElement("div", {
    className: "flex items-center gap-3.5"
  }, /*#__PURE__*/React.createElement("div", {
    className: "h-11 w-11 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0 border border-transparent dark:border-emerald-500/20"
  }, /*#__PURE__*/React.createElement(CalendarIcon, {
    className: "w-5 h-5"
  })), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("h3", {
    className: "text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-gray-400"
  }, "Attendance Rate"), /*#__PURE__*/React.createElement("p", {
    className: "text-sm font-black text-slate-900 dark:text-white mt-0.5"
  }, "94.2% ", /*#__PURE__*/React.createElement("span", {
    className: "text-xs font-semibold text-emerald-600 dark:text-emerald-400"
  }, "Present"))))), /*#__PURE__*/React.createElement(SpotlightCard, {
    onClick: () => navigate('/grades'),
    className: "p-5 flex items-center justify-between cursor-pointer"
  }, /*#__PURE__*/React.createElement("div", {
    className: "flex items-center gap-3.5"
  }, /*#__PURE__*/React.createElement("div", {
    className: "h-11 w-11 rounded-xl bg-amber-50 dark:bg-amber-950/40 text-amber-600 dark:text-amber-400 flex items-center justify-center shrink-0 border border-transparent dark:border-amber-500/20"
  }, /*#__PURE__*/React.createElement(AcademicCapIcon, {
    className: "w-5 h-5"
  })), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("h3", {
    className: "text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-gray-400"
  }, "Academic Standing"), /*#__PURE__*/React.createElement("p", {
    className: "text-sm font-black text-slate-900 dark:text-white mt-0.5"
  }, "3.88 GPA ", /*#__PURE__*/React.createElement("span", {
    className: "text-xs font-semibold text-blue-600 dark:text-cyan-400"
  }, "\xB7 Grade A")))))), /*#__PURE__*/React.createElement("div", {
    className: "grid grid-cols-1 lg:grid-cols-3 gap-8"
  }, /*#__PURE__*/React.createElement("div", {
    className: "lg:col-span-2 space-y-5"
  }, /*#__PURE__*/React.createElement("div", {
    className: "flex items-center justify-between"
  }, /*#__PURE__*/React.createElement("h2", {
    className: "text-lg font-extrabold text-slate-900 dark:text-white tracking-tight transition-colors"
  }, "My Enrolled Courses (", coursesList.length, ")"), /*#__PURE__*/React.createElement(Link, {
    to: "/courses",
    className: "text-xs font-semibold text-blue-600 dark:text-cyan-400 hover:text-blue-700 dark:hover:text-cyan-300 bg-white dark:bg-white/[0.03] border border-slate-200 dark:border-white/10 px-3 py-1.5 rounded-lg transition cursor-pointer"
  }, "Browse Catalog \u2192")), loading ? /*#__PURE__*/React.createElement("div", {
    className: "bg-white dark:bg-white/[0.02] rounded-2xl border border-slate-200/80 dark:border-white/5 p-8 text-center text-xs font-bold text-slate-400 dark:text-gray-500"
  }, "Loading your courses...") : coursesList.length === 0 ? /*#__PURE__*/React.createElement("div", {
    className: "bg-white dark:bg-white/[0.02] rounded-2xl border border-slate-200/80 dark:border-white/5 p-8 text-center text-xs font-bold text-slate-500 dark:text-gray-400 space-y-3"
  }, /*#__PURE__*/React.createElement("p", null, "You are not enrolled in any courses yet."), /*#__PURE__*/React.createElement(Link, {
    to: "/courses",
    className: "inline-block px-4 py-2 rounded-xl bg-blue-600 text-white font-bold hover:bg-blue-700 transition"
  }, "Explore Course Catalog \u2192")) : /*#__PURE__*/React.createElement("div", {
    className: "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"
  }, coursesList.map((course, idx) => /*#__PURE__*/React.createElement(CourseCard, {
    key: course.id || idx,
    course: course,
    index: idx,
    mode: "student"
  })))), /*#__PURE__*/React.createElement("div", {
    className: "lg:col-span-1"
  }, /*#__PURE__*/React.createElement("div", {
    className: "bg-white dark:bg-white/[0.02] backdrop-blur-xl rounded-2xl border border-slate-200/80 dark:border-white/5 p-5 shadow-xs dark:shadow-md dark:shadow-black/40 space-y-6 sticky top-24 transition-colors"
  }, /*#__PURE__*/React.createElement("h2", {
    className: "text-base font-extrabold text-slate-900 dark:text-white border-b border-slate-100 dark:border-white/5 pb-3.5 transition-colors"
  }, "Dashboard Highlights"), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    className: "flex items-center justify-between mb-3"
  }, /*#__PURE__*/React.createElement("h3", {
    className: "text-xs font-bold text-slate-800 dark:text-gray-300 uppercase tracking-wider"
  }, "Upcoming Assignments"), /*#__PURE__*/React.createElement(Link, {
    to: "/assignments",
    className: "text-[11px] font-semibold text-blue-600 dark:text-cyan-400 hover:underline"
  }, "View all")), /*#__PURE__*/React.createElement("div", {
    className: "space-y-2.5"
  }, /*#__PURE__*/React.createElement("div", {
    onClick: () => navigate('/assignments'),
    className: "flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-white/[0.02] border border-slate-100 dark:border-white/5 hover:border-blue-400 dark:hover:border-cyan-500/40 transition cursor-pointer"
  }, /*#__PURE__*/React.createElement("div", {
    className: "flex items-center gap-3"
  }, /*#__PURE__*/React.createElement("div", {
    className: "p-2 bg-blue-100/60 dark:bg-cyan-950/40 text-blue-600 dark:text-cyan-400 rounded-lg shrink-0 border border-transparent dark:border-cyan-500/20"
  }, /*#__PURE__*/React.createElement(DocumentIcon, {
    className: "w-4 h-4"
  })), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("h4", {
    className: "text-xs font-bold text-slate-900 dark:text-white"
  }, "Bayesian Classifier Report"), /*#__PURE__*/React.createElement("p", {
    className: "text-[10px] text-slate-500 dark:text-gray-400 font-medium"
  }, "CS401 \xB7 Max 100 Pts"))), /*#__PURE__*/React.createElement("span", {
    className: "text-[10px] font-semibold text-slate-600 dark:text-gray-300 bg-white dark:bg-white/[0.03] px-2 py-1 rounded border border-slate-200 dark:border-white/10 shrink-0"
  }, "Due Nov 18")), /*#__PURE__*/React.createElement("div", {
    onClick: () => navigate('/assignments'),
    className: "flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-white/[0.02] border border-slate-100 dark:border-white/5 hover:border-blue-400 dark:hover:border-cyan-500/40 transition cursor-pointer"
  }, /*#__PURE__*/React.createElement("div", {
    className: "flex items-center gap-3"
  }, /*#__PURE__*/React.createElement("div", {
    className: "p-2 bg-blue-100/60 dark:bg-cyan-950/40 text-blue-600 dark:text-cyan-400 rounded-lg shrink-0 border border-transparent dark:border-cyan-500/20"
  }, /*#__PURE__*/React.createElement(DocumentIcon, {
    className: "w-4 h-4"
  })), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("h4", {
    className: "text-xs font-bold text-slate-900 dark:text-white"
  }, "Ridge & Lasso Lab"), /*#__PURE__*/React.createElement("p", {
    className: "text-[10px] text-slate-500 dark:text-gray-400 font-medium"
  }, "CS401 \xB7 Max 100 Pts"))), /*#__PURE__*/React.createElement("span", {
    className: "text-[10px] font-semibold text-slate-600 dark:text-gray-300 bg-white dark:bg-white/[0.03] px-2 py-1 rounded border border-slate-200 dark:border-white/10 shrink-0"
  }, "Due Nov 24")))), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    className: "flex items-center justify-between mb-3"
  }, /*#__PURE__*/React.createElement("h3", {
    className: "text-xs font-bold text-slate-800 dark:text-gray-300 uppercase tracking-wider"
  }, "Active Quizzes"), /*#__PURE__*/React.createElement(Link, {
    to: "/assignments",
    className: "text-[11px] font-semibold text-blue-600 dark:text-cyan-400 hover:underline"
  }, "View all")), /*#__PURE__*/React.createElement("div", {
    className: "space-y-2.5"
  }, /*#__PURE__*/React.createElement("div", {
    onClick: () => navigate(coursesList[0]?.id ? `/courses/${coursesList[0].id}` : '/assignments'),
    className: "flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-white/[0.02] border border-slate-100 dark:border-white/5 hover:border-purple-400 dark:hover:border-purple-500/40 transition cursor-pointer"
  }, /*#__PURE__*/React.createElement("div", {
    className: "flex items-center gap-3"
  }, /*#__PURE__*/React.createElement("div", {
    className: "p-2 bg-blue-100/60 dark:bg-purple-950/40 text-blue-600 dark:text-purple-400 rounded-lg shrink-0 border border-transparent dark:border-purple-500/20"
  }, /*#__PURE__*/React.createElement(ClipboardCheckIcon, {
    className: "w-4 h-4"
  })), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("h4", {
    className: "text-xs font-bold text-slate-900 dark:text-white"
  }, "Control Flow & Priors Quiz"), /*#__PURE__*/React.createElement("p", {
    className: "text-[10px] text-slate-500 dark:text-gray-400 font-medium"
  }, "10 Questions \xB7 20 mins"))), /*#__PURE__*/React.createElement(Badge, {
    variant: "active"
  }, "Active")), /*#__PURE__*/React.createElement("div", {
    onClick: () => navigate(coursesList[1]?.id ? `/courses/${coursesList[1].id}` : '/assignments'),
    className: "flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-white/[0.02] border border-slate-100 dark:border-white/5 hover:border-purple-400 dark:hover:border-purple-500/40 transition cursor-pointer"
  }, /*#__PURE__*/React.createElement("div", {
    className: "flex items-center gap-3"
  }, /*#__PURE__*/React.createElement("div", {
    className: "p-2 bg-blue-100/60 dark:bg-purple-950/40 text-blue-600 dark:text-purple-400 rounded-lg shrink-0 border border-transparent dark:border-purple-500/20"
  }, /*#__PURE__*/React.createElement(ClipboardCheckIcon, {
    className: "w-4 h-4"
  })), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("h4", {
    className: "text-xs font-bold text-slate-900 dark:text-white"
  }, "Functions & Regression Quiz"), /*#__PURE__*/React.createElement("p", {
    className: "text-[10px] text-slate-500 dark:text-gray-400 font-medium"
  }, "10 Questions \xB7 30 mins"))), /*#__PURE__*/React.createElement(Badge, {
    variant: "warning"
  }, "Attempted")))), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    className: "flex items-center justify-between mb-3"
  }, /*#__PURE__*/React.createElement("h3", {
    className: "text-xs font-bold text-slate-800 dark:text-gray-300 uppercase tracking-wider"
  }, "Notification Feed"), /*#__PURE__*/React.createElement(Link, {
    to: "/notifications",
    className: "text-[11px] font-semibold text-blue-600 dark:text-cyan-400 hover:underline"
  }, "View All")), /*#__PURE__*/React.createElement("div", {
    className: "space-y-3"
  }, notifications.map(n => /*#__PURE__*/React.createElement("div", {
    key: n.id,
    onClick: () => navigate('/notifications'),
    className: "flex items-start gap-3 cursor-pointer group"
  }, /*#__PURE__*/React.createElement("div", {
    className: "p-2 bg-blue-50 dark:bg-cyan-950/40 text-blue-600 dark:text-cyan-400 rounded-full shrink-0 mt-0.5 border border-transparent dark:border-cyan-500/20"
  }, /*#__PURE__*/React.createElement(BellIcon, {
    className: "w-4 h-4"
  })), /*#__PURE__*/React.createElement("div", {
    className: "min-w-0"
  }, /*#__PURE__*/React.createElement("h4", {
    className: "text-xs font-bold text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-cyan-400 truncate transition"
  }, n.title), /*#__PURE__*/React.createElement("p", {
    className: "text-[10px] text-slate-500 dark:text-gray-400"
  }, n.createdAt))))))))));
}
var _default = StudentDashboard;

export default _default;
