import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { MOCK_STUDENT_COURSES } from '../utils/mockData';
import { AttendanceTab } from './Course/tabs/AttendanceTab';
import Badge from '../components/common/Badge';

"use strict";

function AttendancePage() {
  const {
    user
  } = (0, useAuth)();
  const navigate = (0, useNavigate)();
  const isStaff = user?.role === 'faculty' || user?.role === 'admin';
  const [selectedCourseId, setSelectedCourseId] = (0, useState)(MOCK_STUDENT_COURSES[0].id);
  return /*#__PURE__*/React.createElement("main", {
    className: "mx-auto max-w-[1440px] px-4 py-8 sm:px-8 lg:py-10 w-full font-sans transition-colors duration-200"
  }, /*#__PURE__*/React.createElement("div", {
    className: "mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement(Badge, {
    variant: "active",
    className: "mb-2"
  }, "Attendance Tracking (ATTENDANCE_SESSIONS & ATTENDANCE_RECORDS)"), /*#__PURE__*/React.createElement("h1", {
    className: "text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight"
  }, "Academic Attendance Center"), /*#__PURE__*/React.createElement("p", {
    className: "text-xs sm:text-sm text-slate-500 dark:text-gray-400 mt-1"
  }, "Select a course below to inspect derived attendance percentages or record a live roll-call session."))), /*#__PURE__*/React.createElement("div", {
    className: "flex flex-wrap items-center gap-2 mb-4"
  }, MOCK_STUDENT_COURSES.map(c => /*#__PURE__*/React.createElement("button", {
    key: c.id,
    onClick: () => setSelectedCourseId(c.id),
    className: `px-4 py-2 rounded-xl text-xs font-bold transition cursor-pointer ${selectedCourseId === c.id ? 'bg-[#0066FF] text-white shadow-[0_0_15px_rgba(0,102,255,0.4)]' : 'bg-white dark:bg-white/[0.03] text-slate-600 dark:text-gray-400 border border-slate-200/80 dark:border-white/10 hover:text-slate-900 dark:hover:text-white'}`
  }, c.courseCode, ": ", c.title)), /*#__PURE__*/React.createElement("button", {
    onClick: () => navigate(`/courses/${selectedCourseId}`),
    className: "ml-auto text-xs font-bold text-blue-600 dark:text-cyan-400 hover:underline cursor-pointer"
  }, "Open Full Course Workspace \u2192")), /*#__PURE__*/React.createElement("div", {
    className: "-mx-6"
  }, /*#__PURE__*/React.createElement(AttendanceTab, {
    courseId: selectedCourseId,
    isCreatorOrStaff: isStaff,
    user: user
  })));
}
var _default = AttendancePage;

export default _default;
