import React from 'react';
import { useNavigate } from 'react-router-dom';
import { CourseBannerPattern } from './CourseBannerPattern';
import Badge from './Badge';
import Button from './Button';
import SpotlightCard from './SpotlightCard';

"use strict";

function CourseCard({
  course,
  index = 0,
  mode = 'student',
  // 'student' | 'catalog'
  isEnrolled = false,
  isEnrolling = false,
  onEnroll
}) {
  const navigate = (0, useNavigate)();
  const bannerUrl = course.bannerUrl || course.banner || course.imageUrl;
  const instructor = course.instructorName || course.createdBy?.name || 'Dr. Alan Turing';
  const instructorInitial = instructor.replace(/^Dr\.\s+|^Prof\.\s+/i, '').charAt(0).toUpperCase() || 'I';
  const progress = course.progress ?? (index % 2 === 0 ? 85 : 62);
  const status = course.statusBadge || course.status || 'Active';
  return /*#__PURE__*/React.createElement(SpotlightCard, {
    className: "flex flex-col h-full rounded-2xl"
  }, /*#__PURE__*/React.createElement("div", {
    onClick: () => navigate(`/courses/${course.id}`),
    className: "h-32 relative overflow-hidden cursor-pointer transition-all duration-500 dark:grayscale dark:group-hover:grayscale-0"
  }, /*#__PURE__*/React.createElement(CourseBannerPattern, {
    index: index,
    title: course.title,
    bannerUrl: bannerUrl
  })), /*#__PURE__*/React.createElement("div", {
    className: "p-4 flex-1 flex flex-col justify-between space-y-3"
  }, /*#__PURE__*/React.createElement("div", null, mode === 'catalog' && /*#__PURE__*/React.createElement("p", {
    className: "text-[11px] font-bold text-slate-400 dark:text-gray-400 uppercase tracking-wider mb-0.5"
  }, course.semester || 'Fall 2026'), /*#__PURE__*/React.createElement("h3", {
    onClick: () => navigate(`/courses/${course.id}`),
    className: "font-bold text-slate-900 dark:text-white text-xs sm:text-sm line-clamp-1 group-hover:text-cyan-500 dark:group-hover:text-cyan-400 transition cursor-pointer"
  }, course.courseCode ? `${course.courseCode}: ` : '', course.title), mode === 'catalog' ? /*#__PURE__*/React.createElement("p", {
    className: "text-[11px] text-slate-500 dark:text-gray-400 line-clamp-2 mt-1 leading-relaxed"
  }, course.description || 'Learn fundamental concepts, theories, and practical applications.') : /*#__PURE__*/React.createElement("p", {
    className: "text-[11px] text-slate-500 dark:text-gray-400 mt-1 font-medium"
  }, instructor)), mode === 'student' ? /*#__PURE__*/React.createElement("div", {
    className: "space-y-2.5"
  }, /*#__PURE__*/React.createElement("div", {
    className: "flex items-center justify-between text-xs font-semibold text-slate-600 dark:text-gray-400 gap-2"
  }, /*#__PURE__*/React.createElement("div", {
    className: "w-full bg-slate-100 dark:bg-gray-800 rounded-full h-1.5 overflow-hidden"
  }, /*#__PURE__*/React.createElement("div", {
    className: "bg-blue-600 dark:bg-gradient-to-r dark:from-cyan-400 dark:to-blue-500 dark:shadow-[0_0_10px_rgba(6,182,212,0.6)] h-1.5 rounded-full transition-all duration-500",
    style: {
      width: `${progress}%`
    }
  })), /*#__PURE__*/React.createElement("span", {
    className: "text-[10px] font-bold text-slate-600 dark:text-cyan-400"
  }, progress, "%")), /*#__PURE__*/React.createElement("div", {
    className: "flex items-center justify-between pt-1"
  }, /*#__PURE__*/React.createElement(Button, {
    size: "sm",
    onClick: () => navigate(`/courses/${course.id}`)
  }, "Continue Lesson"), /*#__PURE__*/React.createElement(Badge, {
    variant: "active"
  }, status))) : /*#__PURE__*/
  /* Catalog mode footer */
  React.createElement("div", {
    className: "pt-2 border-t border-slate-100 dark:border-white/5 flex items-center justify-between gap-2"
  }, /*#__PURE__*/React.createElement("div", {
    className: "flex items-center gap-2 min-w-0"
  }, course.instructorAvatar ? /*#__PURE__*/React.createElement("img", {
    src: course.instructorAvatar,
    alt: instructor,
    className: "h-6 w-6 rounded-full object-cover shrink-0 border border-slate-200 dark:border-gray-800"
  }) : /*#__PURE__*/React.createElement("span", {
    className: "h-6 w-6 rounded-full bg-gradient-to-tr from-cyan-500 to-blue-600 text-white text-[10px] font-bold flex items-center justify-center shrink-0"
  }, instructorInitial), /*#__PURE__*/React.createElement("span", {
    className: "text-[11px] font-medium text-slate-700 dark:text-gray-300 truncate"
  }, instructor)), /*#__PURE__*/React.createElement("div", {
    className: "flex items-center gap-1.5 shrink-0"
  }, /*#__PURE__*/React.createElement(Badge, {
    variant: course.status === 'Waiting List' ? 'waiting' : 'open'
  }, course.status || 'Open'), isEnrolled ? /*#__PURE__*/React.createElement(Button, {
    size: "sm",
    variant: "secondary",
    onClick: () => navigate(`/courses/${course.id}`)
  }, "View") : /*#__PURE__*/React.createElement(Button, {
    size: "sm",
    onClick: () => onEnroll && onEnroll(course.id),
    disabled: isEnrolling
  }, isEnrolling ? '...' : 'Enroll')))));
}
function RecommendedCourseItem({
  course,
  isEnrolled,
  onEnroll
}) {
  const navigate = (0, useNavigate)();
  const instructor = course.instructorName || 'Dr. Grace Hopper';
  const instructorInitial = instructor.replace(/^Dr\.\s+|^Prof\.\s+/i, '').charAt(0).toUpperCase() || 'G';
  return /*#__PURE__*/React.createElement("div", {
    className: "p-3.5 rounded-xl bg-slate-50 dark:bg-white/[0.02] border border-slate-100 dark:border-white/5 space-y-3 hover:border-slate-200 dark:hover:border-white/10 transition-colors"
  }, /*#__PURE__*/React.createElement("div", {
    className: "flex items-start gap-3"
  }, /*#__PURE__*/React.createElement("div", {
    onClick: () => navigate(`/courses/${course.id}`),
    className: "h-14 w-14 rounded-lg bg-[#08172E] shrink-0 overflow-hidden flex items-center justify-center p-1 text-cyan-400 cursor-pointer"
  }, /*#__PURE__*/React.createElement("svg", {
    className: "w-6 h-6",
    fill: "none",
    stroke: "currentColor",
    viewBox: "0 0 24 24"
  }, /*#__PURE__*/React.createElement("path", {
    strokeLinecap: "round",
    strokeLinejoin: "round",
    strokeWidth: "2",
    d: "M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4"
  }))), /*#__PURE__*/React.createElement("div", {
    className: "min-w-0"
  }, /*#__PURE__*/React.createElement("h4", {
    onClick: () => navigate(`/courses/${course.id}`),
    className: "text-xs font-bold text-slate-900 dark:text-white line-clamp-1 cursor-pointer hover:text-cyan-400 transition"
  }, course.courseCode ? `${course.courseCode}: ` : '', course.title), /*#__PURE__*/React.createElement("p", {
    className: "text-[10px] text-slate-500 dark:text-gray-400 line-clamp-2 mt-0.5"
  }, course.description))), /*#__PURE__*/React.createElement("div", {
    className: "flex items-center justify-between text-[11px] pt-1"
  }, /*#__PURE__*/React.createElement("div", {
    className: "flex items-center gap-1.5"
  }, course.instructorAvatar ? /*#__PURE__*/React.createElement("img", {
    src: course.instructorAvatar,
    alt: instructor,
    className: "h-5 w-5 rounded-full object-cover border border-slate-200 dark:border-slate-700"
  }) : /*#__PURE__*/React.createElement("span", {
    className: "h-5 w-5 rounded-full bg-gradient-to-tr from-cyan-500 to-blue-600 text-white text-[9px] font-bold flex items-center justify-center shrink-0"
  }, instructorInitial), /*#__PURE__*/React.createElement("span", {
    className: "text-[10px] font-medium text-slate-600 dark:text-slate-300"
  }, instructor)), /*#__PURE__*/React.createElement("div", {
    className: "flex items-center gap-1.5"
  }, /*#__PURE__*/React.createElement(Badge, {
    variant: "open"
  }, "Open"), isEnrolled ? /*#__PURE__*/React.createElement("button", {
    onClick: () => navigate(`/courses/${course.id}`),
    className: "text-[10px] font-bold text-slate-600 dark:text-slate-300 hover:underline px-2 py-1 cursor-pointer"
  }, "View") : /*#__PURE__*/React.createElement(Button, {
    size: "sm",
    onClick: () => onEnroll && onEnroll(course.id)
  }, "Enroll"))));
}
var _default = CourseCard;

export { CourseCard, RecommendedCourseItem };

export default _default;
