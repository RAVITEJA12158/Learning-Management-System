import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { courseService } from '../../services/courseService';
import { useAuth } from '../../context/AuthContext';
import Button from '../../components/common/Button';
import Badge from '../../components/common/Badge';
import SpotlightCard from '../../components/common/SpotlightCard';
import { CourseBannerPattern } from '../../components/common/CourseBannerPattern';
import { PlusIcon, BookIcon, UsersIcon, ClipboardCheckIcon, CalendarIcon } from '../../components/common/Icons';

function FacultyDashboard() {
  const {
    user
  } = (0, useAuth)();
  const [createdCourses, setCreatedCourses] = (0, useState)([]);
  const [loading, setLoading] = (0, useState)(true);
  const navigate = (0, useNavigate)();
  (0, useEffect)(() => {
    fetchCreatedCourses();
  }, []);
  const fetchCreatedCourses = async () => {
    try {
      const courses = await courseService.getCreated();
      setCreatedCourses(courses || []);
    } catch (err) {
      console.error('Failed to fetch faculty courses:', err);
    } finally {
      setLoading(false);
    }
  };
  const pendingSubmissions = [{
    id: 'sub-103',
    student: 'Ishita Nair',
    courseCode: 'CS401',
    courseId: 'mock-1',
    assignment: 'Assignment 1: Bayesian Classifier',
    time: '3 hours ago',
    status: 'SUBMITTED'
  }, {
    id: 'sub-201',
    student: 'Arjun Rao',
    courseCode: 'CS401',
    courseId: 'mock-1',
    assignment: 'Assignment 2: Ridge & Lasso Lab',
    time: '5 hours ago',
    status: 'SUBMITTED'
  }, {
    id: 'sub-301',
    student: 'Alex Chen',
    courseCode: 'CS350',
    courseId: 'mock-3',
    assignment: 'Project Milestone: REST API Auth',
    time: 'Yesterday',
    status: 'LATE'
  }];
  return /*#__PURE__*/React.createElement("main", {
    className: "mx-auto max-w-[1440px] px-4 py-8 sm:px-8 lg:py-10 w-full font-sans transition-colors duration-200"
  }, /*#__PURE__*/React.createElement("div", {
    className: "mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between"
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement(Badge, {
    variant: "warning",
    className: "mb-2"
  }, "Faculty Workspace \xB7 ", user?.name || 'Dr. Alan Turing'), /*#__PURE__*/React.createElement("h1", {
    className: "text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight transition-colors"
  }, "Instructor Teaching & Assessment Hub"), /*#__PURE__*/React.createElement("p", {
    className: "text-xs sm:text-sm text-slate-500 dark:text-gray-400 mt-1"
  }, "Manage course curriculums, grade student submissions, record attendance, and monitor class analytics.")), /*#__PURE__*/React.createElement("div", {
    className: "flex flex-wrap items-center gap-3"
  }, /*#__PURE__*/React.createElement(Button, {
    variant: "outline",
    onClick: () => navigate('/attendance')
  }, "\uD83D\uDCC5 Record Attendance"), /*#__PURE__*/React.createElement(Button, {
    onClick: () => navigate('/faculty/courses/new'),
    className: "flex items-center gap-2"
  }, /*#__PURE__*/React.createElement(PlusIcon, {
    className: "w-4 h-4"
  }), "Create New Course"))), /*#__PURE__*/React.createElement("div", {
    className: "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8"
  }, /*#__PURE__*/React.createElement(SpotlightCard, {
    className: "p-5 flex items-center gap-4"
  }, /*#__PURE__*/React.createElement("div", {
    className: "h-11 w-11 rounded-xl bg-blue-50 dark:bg-cyan-950/40 text-blue-600 dark:text-cyan-400 flex items-center justify-center shrink-0 border border-transparent dark:border-cyan-500/20"
  }, /*#__PURE__*/React.createElement(BookIcon, {
    className: "w-5 h-5"
  })), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("p", {
    className: "text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-gray-400"
  }, "Active Courses"), /*#__PURE__*/React.createElement("p", {
    className: "text-lg font-black text-slate-900 dark:text-white"
  }, createdCourses.length, " Courses Taught"))), /*#__PURE__*/React.createElement(SpotlightCard, {
    className: "p-5 flex items-center gap-4"
  }, /*#__PURE__*/React.createElement("div", {
    className: "h-11 w-11 rounded-xl bg-purple-50 dark:bg-purple-950/40 text-purple-600 dark:text-purple-400 flex items-center justify-center shrink-0 border border-transparent dark:border-purple-500/20"
  }, /*#__PURE__*/React.createElement(UsersIcon, {
    className: "w-5 h-5"
  })), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("p", {
    className: "text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-gray-400"
  }, "Enrolled Roster"), /*#__PURE__*/React.createElement("p", {
    className: "text-lg font-black text-slate-900 dark:text-white"
  }, "148 Active Students"))), /*#__PURE__*/React.createElement(SpotlightCard, {
    onClick: () => navigate('/assignments'),
    className: "p-5 flex items-center gap-4 cursor-pointer"
  }, /*#__PURE__*/React.createElement("div", {
    className: "h-11 w-11 rounded-xl bg-amber-50 dark:bg-amber-950/40 text-amber-600 dark:text-amber-400 flex items-center justify-center shrink-0 border border-transparent dark:border-amber-500/20"
  }, /*#__PURE__*/React.createElement(ClipboardCheckIcon, {
    className: "w-5 h-5"
  })), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("p", {
    className: "text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-gray-400"
  }, "Grading Queue"), /*#__PURE__*/React.createElement("p", {
    className: "text-lg font-black text-slate-900 dark:text-white"
  }, pendingSubmissions.length, " Needs Grading"))), /*#__PURE__*/React.createElement(SpotlightCard, {
    onClick: () => navigate('/attendance'),
    className: "p-5 flex items-center gap-4 cursor-pointer"
  }, /*#__PURE__*/React.createElement("div", {
    className: "h-11 w-11 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0 border border-transparent dark:border-emerald-500/20"
  }, /*#__PURE__*/React.createElement(CalendarIcon, {
    className: "w-5 h-5"
  })), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("p", {
    className: "text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-gray-400"
  }, "Class Attendance"), /*#__PURE__*/React.createElement("p", {
    className: "text-lg font-black text-slate-900 dark:text-white"
  }, "92.4% Average")))), /*#__PURE__*/React.createElement("div", {
    className: "grid grid-cols-1 lg:grid-cols-3 gap-8"
  }, /*#__PURE__*/React.createElement("div", {
    className: "lg:col-span-2 space-y-5"
  }, /*#__PURE__*/React.createElement("div", {
    className: "flex items-center justify-between"
  }, /*#__PURE__*/React.createElement("h2", {
    className: "text-lg font-extrabold text-slate-900 dark:text-white tracking-tight"
  }, "Courses You Teach (", createdCourses.length, ")"), /*#__PURE__*/React.createElement(Link, {
    to: "/courses",
    className: "text-xs font-semibold text-blue-600 dark:text-cyan-400 hover:underline"
  }, "View Full Catalog \u2192")), loading ? /*#__PURE__*/React.createElement("div", {
    className: "bg-white dark:bg-white/[0.02] backdrop-blur-xl rounded-2xl border border-slate-200/80 dark:border-white/10 p-8 text-center text-xs font-bold text-slate-400 dark:text-gray-400"
  }, "Loading your courses...") : createdCourses.length > 0 ? /*#__PURE__*/React.createElement("div", {
    className: "grid gap-5 sm:grid-cols-2"
  }, createdCourses.map((course, idx) => /*#__PURE__*/React.createElement(SpotlightCard, {
    key: course.id,
    className: "flex flex-col justify-between overflow-hidden rounded-2xl"
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    onClick: () => navigate(`/courses/${course.id}`),
    className: "h-28 relative overflow-hidden cursor-pointer"
  }, /*#__PURE__*/React.createElement(CourseBannerPattern, {
    index: idx,
    title: course.title,
    bannerUrl: course.bannerUrl
  })), /*#__PURE__*/React.createElement("div", {
    className: "p-5"
  }, /*#__PURE__*/React.createElement("div", {
    className: "flex items-center justify-between gap-2"
  }, /*#__PURE__*/React.createElement(Badge, {
    variant: "active"
  }, course.courseCode || 'CS101'), /*#__PURE__*/React.createElement("span", {
    className: "text-[11px] font-bold text-slate-400 dark:text-gray-400"
  }, course.semester || 'Fall 2026')), /*#__PURE__*/React.createElement("h3", {
    onClick: () => navigate(`/courses/${course.id}`),
    className: "mt-3 text-base font-bold text-slate-900 dark:text-white line-clamp-1 hover:text-blue-600 dark:hover:text-cyan-400 cursor-pointer transition"
  }, course.title), /*#__PURE__*/React.createElement("p", {
    className: "mt-1.5 text-xs text-slate-500 dark:text-gray-400 line-clamp-2 leading-relaxed"
  }, course.description || 'Structured academic course modules, assessments, and labs.'), /*#__PURE__*/React.createElement("div", {
    className: "mt-4 flex items-center gap-4 text-[11px] font-semibold text-slate-500 dark:text-gray-400"
  }, /*#__PURE__*/React.createElement("span", null, "\uD83D\uDCDA ", course.modules?.length || 3, " Modules"), /*#__PURE__*/React.createElement("span", null, "\uD83D\uDC65 ", course.roster?.length || 24, " Students")))), /*#__PURE__*/React.createElement("div", {
    className: "px-5 pb-5 pt-3 flex gap-2.5 border-t border-slate-100 dark:border-white/5"
  }, /*#__PURE__*/React.createElement(Link, {
    to: `/courses/${course.id}`,
    className: "flex-1 text-center py-2 text-xs font-bold text-white bg-[#0066FF] hover:bg-blue-600 shadow-[0_0_15px_rgba(0,102,255,0.35)] rounded-xl transition cursor-pointer"
  }, "Manage Workspace"), /*#__PURE__*/React.createElement(Link, {
    to: `/faculty/courses/${course.id}/edit`,
    className: "px-4 text-center py-2 text-xs font-bold text-slate-700 dark:text-gray-200 bg-slate-100 dark:bg-white/5 hover:bg-slate-200 dark:hover:bg-white/10 rounded-xl transition cursor-pointer"
  }, "Edit"))))) : /*#__PURE__*/React.createElement("div", {
    className: "bg-white dark:bg-white/[0.02] backdrop-blur-xl rounded-2xl border border-slate-200/80 dark:border-white/10 p-12 text-center shadow-xs"
  }, /*#__PURE__*/React.createElement("p", {
    className: "text-base font-bold text-slate-900 dark:text-white"
  }, "You haven't created any courses yet."), /*#__PURE__*/React.createElement("p", {
    className: "mt-1 text-xs text-slate-500 dark:text-gray-400 mb-6"
  }, "Start structuring your curriculum and sharing your knowledge."), /*#__PURE__*/React.createElement(Button, {
    onClick: () => navigate('/faculty/courses/new'),
    className: "inline-flex items-center gap-2"
  }, /*#__PURE__*/React.createElement(PlusIcon, {
    className: "w-4 h-4"
  }), "Create Your First Course"))), /*#__PURE__*/React.createElement("div", {
    className: "lg:col-span-1 space-y-6"
  }, /*#__PURE__*/React.createElement("div", {
    className: "bg-white dark:bg-white/[0.02] backdrop-blur-xl rounded-2xl border border-slate-200/80 dark:border-white/10 p-5 shadow-xs space-y-5 sticky top-24"
  }, /*#__PURE__*/React.createElement("div", {
    className: "flex items-center justify-between border-b border-slate-100 dark:border-white/5 pb-3.5"
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("h3", {
    className: "text-sm font-extrabold text-slate-900 dark:text-white"
  }, "Submissions Needing Review"), /*#__PURE__*/React.createElement("p", {
    className: "text-[11px] text-slate-500 dark:text-gray-400"
  }, "Click any submission to open the Grading Desk")), /*#__PURE__*/React.createElement(Badge, {
    variant: "warning"
  }, pendingSubmissions.length, " Pending")), /*#__PURE__*/React.createElement("div", {
    className: "space-y-3"
  }, pendingSubmissions.map(item => /*#__PURE__*/React.createElement("div", {
    key: item.id,
    onClick: () => navigate(`/courses/${item.courseId}`),
    className: "p-3.5 rounded-xl bg-slate-50 dark:bg-white/[0.02] border border-slate-200/70 dark:border-white/5 hover:border-blue-500/40 dark:hover:border-cyan-400/40 transition cursor-pointer"
  }, /*#__PURE__*/React.createElement("div", {
    className: "flex items-center justify-between gap-2"
  }, /*#__PURE__*/React.createElement("span", {
    className: "text-[10px] font-bold uppercase tracking-wider text-blue-600 dark:text-cyan-400"
  }, item.courseCode, " \xB7 ", item.time), /*#__PURE__*/React.createElement(Badge, {
    variant: item.status === 'LATE' ? 'danger' : 'info'
  }, item.status)), /*#__PURE__*/React.createElement("p", {
    className: "text-xs font-bold text-slate-900 dark:text-white mt-1"
  }, item.assignment), /*#__PURE__*/React.createElement("div", {
    className: "mt-2 flex items-center justify-between text-[11px]"
  }, /*#__PURE__*/React.createElement("span", {
    className: "text-slate-500 dark:text-gray-400"
  }, "Submitted by ", /*#__PURE__*/React.createElement("strong", {
    className: "text-slate-700 dark:text-gray-200"
  }, item.student)), /*#__PURE__*/React.createElement("span", {
    className: "font-bold text-blue-600 dark:text-cyan-400"
  }, "Grade \u2192"))))), /*#__PURE__*/React.createElement("div", {
    className: "pt-3 border-t border-slate-100 dark:border-white/5 grid grid-cols-2 gap-2.5"
  }, /*#__PURE__*/React.createElement(Button, {
    variant: "outline",
    size: "sm",
    onClick: () => navigate('/grades')
  }, "Class Gradebook"), /*#__PURE__*/React.createElement(Button, {
    variant: "outline",
    size: "sm",
    onClick: () => navigate('/assignments')
  }, "All Assessments"))))));
}
var _default = FacultyDashboard;

export default _default;
