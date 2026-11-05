import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { courseService } from '../services/courseService';
import { COURSE_CATEGORIES, SEMESTERS } from '../utils/constants';
import { CourseBannerPattern } from './common/CourseBannerPattern';
import Badge from './common/Badge';
import Button from './common/Button';
import SpotlightCard from './common/SpotlightCard';

function CourseForm() {
  const {
    id
  } = (0, useParams)();
  const isEditMode = Boolean(id);
  const navigate = (0, useNavigate)();
  const [formData, setFormData] = (0, useState)({
    title: '',
    courseCode: '',
    category: 'Computer Science',
    semester: 'Fall 2026',
    description: '',
    bannerUrl: ''
  });
  const [loading, setLoading] = (0, useState)(false);
  const [error, setError] = (0, useState)('');
  (0, useEffect)(() => {
    if (isEditMode) {
      fetchCourse();
    }
  }, [id]);
  const fetchCourse = async () => {
    try {
      const data = await courseService.getById(id);
      if (data) {
        setFormData({
          title: data.title || '',
          courseCode: data.courseCode || '',
          category: data.category || 'Computer Science',
          semester: data.semester || 'Fall 2026',
          description: data.description || '',
          bannerUrl: data.bannerUrl || data.banner || data.imageUrl || ''
        });
      }
    } catch {
      setError('Failed to load course data.');
    }
  };
  const handleChange = e => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };
  const handleSubmit = async e => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      if (isEditMode) {
        await courseService.update(id, formData);
      } else {
        await courseService.create(formData);
      }
      navigate('/faculty');
    } catch (err) {
      setError(err.message || 'Failed to save course.');
    } finally {
      setLoading(false);
    }
  };
  const categories = COURSE_CATEGORIES.filter(c => c !== 'All Categories');
  const semesters = SEMESTERS.filter(s => s !== 'All Semesters');
  return /*#__PURE__*/React.createElement("main", {
    className: "mx-auto max-w-[1440px] px-4 py-8 sm:px-8 lg:py-10 w-full font-sans transition-colors duration-200"
  }, /*#__PURE__*/React.createElement("div", {
    className: "mb-6 flex items-center justify-between"
  }, /*#__PURE__*/React.createElement("button", {
    type: "button",
    onClick: () => navigate(-1),
    className: "hub-lift inline-flex items-center gap-2 rounded-xl border border-slate-200 dark:border-white/10 bg-white dark:bg-white/[0.03] px-4 py-2 text-xs font-bold text-slate-700 dark:text-gray-200 hover:bg-slate-50 dark:hover:bg-white/[0.08] transition cursor-pointer"
  }, "\u2190 Back to Workspace"), /*#__PURE__*/React.createElement(Badge, {
    variant: "info"
  }, isEditMode ? 'Editing Curriculum' : 'New Course Authoring')), /*#__PURE__*/React.createElement("div", {
    className: "grid grid-cols-1 lg:grid-cols-3 gap-8 items-start"
  }, /*#__PURE__*/React.createElement("div", {
    className: "lg:col-span-2 bg-white dark:bg-white/[0.02] backdrop-blur-xl rounded-2xl border border-slate-200/80 dark:border-white/10 p-6 sm:p-8 shadow-xs dark:shadow-2xl dark:shadow-black/50 transition-colors"
  }, /*#__PURE__*/React.createElement("div", {
    className: "mb-6 pb-5 border-b border-slate-100 dark:border-white/5"
  }, /*#__PURE__*/React.createElement("p", {
    className: "text-[11px] font-bold uppercase tracking-wider text-blue-600 dark:text-cyan-400"
  }, isEditMode ? 'Course Management' : 'Course Creation'), /*#__PURE__*/React.createElement("h1", {
    className: "mt-1 text-2xl sm:text-3xl font-black tracking-tight text-slate-900 dark:text-white"
  }, isEditMode ? 'Edit Course Details' : 'Launch a New Course'), /*#__PURE__*/React.createElement("p", {
    className: "mt-1 text-xs sm:text-sm text-slate-500 dark:text-gray-400"
  }, "Configure course metadata, academic term, category, and syllabus overview.")), error && /*#__PURE__*/React.createElement("div", {
    className: "mb-6 p-4 rounded-xl border border-red-200 dark:border-red-900/50 bg-red-50 dark:bg-red-950/30 text-xs font-bold text-red-600 dark:text-red-400"
  }, error), /*#__PURE__*/React.createElement("form", {
    onSubmit: handleSubmit,
    className: "space-y-5"
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("label", {
    className: "mb-2 block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-gray-300"
  }, "Course Title *"), /*#__PURE__*/React.createElement("input", {
    type: "text",
    name: "title",
    value: formData.title,
    onChange: handleChange,
    required: true,
    placeholder: "e.g. Introduction to Machine Learning & Neural Networks",
    className: "w-full rounded-xl border border-slate-200 dark:border-gray-800 bg-white dark:bg-transparent px-4 py-3 text-sm font-medium text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-gray-500 focus:border-blue-600 dark:focus:border-purple-500 focus:ring-1 focus:ring-blue-500/20 dark:focus:ring-purple-500/50 outline-none transition"
  })), /*#__PURE__*/React.createElement("div", {
    className: "grid gap-5 sm:grid-cols-3"
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("label", {
    className: "mb-2 block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-gray-300"
  }, "Course Code *"), /*#__PURE__*/React.createElement("input", {
    type: "text",
    name: "courseCode",
    value: formData.courseCode,
    onChange: handleChange,
    required: true,
    disabled: isEditMode,
    placeholder: "e.g. CS501",
    className: `w-full rounded-xl border border-slate-200 dark:border-gray-800 px-4 py-3 text-sm font-bold outline-none transition ${isEditMode ? 'bg-slate-100 dark:bg-white/5 text-slate-400 dark:text-gray-500 cursor-not-allowed' : 'bg-white dark:bg-transparent text-slate-900 dark:text-white focus:border-blue-600 dark:focus:border-purple-500 focus:ring-1 focus:ring-blue-500/20 dark:focus:ring-purple-500/50'}`
  })), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("label", {
    className: "mb-2 block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-gray-300"
  }, "Academic Term *"), /*#__PURE__*/React.createElement("select", {
    name: "semester",
    value: formData.semester,
    onChange: handleChange,
    className: "w-full rounded-xl border border-slate-200 dark:border-gray-800 bg-white dark:bg-[#030712] px-4 py-3 text-sm font-semibold text-slate-900 dark:text-white focus:border-blue-600 dark:focus:border-purple-500 focus:ring-1 focus:ring-blue-500/20 dark:focus:ring-purple-500/50 outline-none transition cursor-pointer"
  }, semesters.map(sem => /*#__PURE__*/React.createElement("option", {
    key: sem,
    value: sem,
    className: "bg-white dark:bg-[#030712]"
  }, sem)))), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("label", {
    className: "mb-2 block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-gray-300"
  }, "Department / Category *"), /*#__PURE__*/React.createElement("select", {
    name: "category",
    value: formData.category,
    onChange: handleChange,
    className: "w-full rounded-xl border border-slate-200 dark:border-gray-800 bg-white dark:bg-[#030712] px-4 py-3 text-sm font-semibold text-slate-900 dark:text-white focus:border-blue-600 dark:focus:border-purple-500 focus:ring-1 focus:ring-blue-500/20 dark:focus:ring-purple-500/50 outline-none transition cursor-pointer"
  }, categories.map(cat => /*#__PURE__*/React.createElement("option", {
    key: cat,
    value: cat,
    className: "bg-white dark:bg-[#030712]"
  }, cat))))), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("label", {
    className: "mb-2 block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-gray-300"
  }, "Course Banner Image URL (Optional)"), /*#__PURE__*/React.createElement("input", {
    type: "url",
    name: "bannerUrl",
    value: formData.bannerUrl,
    onChange: handleChange,
    placeholder: "https://example.com/course-banner.png",
    className: "w-full rounded-xl border border-slate-200 dark:border-gray-800 bg-white dark:bg-transparent px-4 py-3 text-sm font-medium text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-gray-500 focus:border-blue-600 dark:focus:border-purple-500 focus:ring-1 focus:ring-blue-500/20 dark:focus:ring-purple-500/50 outline-none transition"
  }), /*#__PURE__*/React.createElement("p", {
    className: "mt-1.5 text-[11px] text-slate-400 dark:text-gray-500"
  }, "Leave empty to automatically generate a vector blueprint banner tailored to the course.")), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("label", {
    className: "mb-2 block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-gray-300"
  }, "Syllabus & Course Description *"), /*#__PURE__*/React.createElement("textarea", {
    name: "description",
    value: formData.description,
    onChange: handleChange,
    rows: "5",
    required: true,
    placeholder: "Outline learning objectives, weekly topics, prerequisites, and assessment structure...",
    className: "w-full resize-y rounded-xl border border-slate-200 dark:border-gray-800 bg-white dark:bg-transparent px-4 py-3 text-sm font-medium text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-gray-500 focus:border-blue-600 dark:focus:border-purple-500 focus:ring-1 focus:ring-blue-500/20 dark:focus:ring-purple-500/50 outline-none transition"
  })), /*#__PURE__*/React.createElement("div", {
    className: "pt-4 border-t border-slate-100 dark:border-white/5 flex items-center justify-end gap-3"
  }, /*#__PURE__*/React.createElement(Button, {
    type: "button",
    variant: "outline",
    size: "lg",
    onClick: () => navigate(-1)
  }, "Cancel"), /*#__PURE__*/React.createElement(Button, {
    type: "submit",
    size: "lg",
    disabled: loading
  }, loading ? 'Saving Course…' : isEditMode ? 'Save Changes' : 'Create & Publish Course')))), /*#__PURE__*/React.createElement("div", {
    className: "lg:col-span-1 space-y-4 sticky top-24"
  }, /*#__PURE__*/React.createElement("div", {
    className: "bg-white dark:bg-white/[0.02] backdrop-blur-xl rounded-2xl border border-slate-200/80 dark:border-white/10 p-5 shadow-xs"
  }, /*#__PURE__*/React.createElement("h3", {
    className: "text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-gray-400 mb-3"
  }, "Live Catalog Card Preview"), /*#__PURE__*/React.createElement(SpotlightCard, {
    className: "flex flex-col rounded-2xl overflow-hidden border border-slate-200/80 dark:border-white/10"
  }, /*#__PURE__*/React.createElement("div", {
    className: "h-32 relative overflow-hidden"
  }, /*#__PURE__*/React.createElement(CourseBannerPattern, {
    index: 0,
    title: formData.title || 'Course Preview',
    bannerUrl: formData.bannerUrl || null
  })), /*#__PURE__*/React.createElement("div", {
    className: "p-4 space-y-2.5"
  }, /*#__PURE__*/React.createElement("div", {
    className: "flex items-center justify-between"
  }, /*#__PURE__*/React.createElement("span", {
    className: "text-[10px] font-bold uppercase tracking-wider text-blue-600 dark:text-cyan-400"
  }, formData.semester || 'Fall 2026'), /*#__PURE__*/React.createElement(Badge, {
    variant: "open"
  }, "Open")), /*#__PURE__*/React.createElement("h4", {
    className: "text-sm font-bold text-slate-900 dark:text-white line-clamp-1"
  }, formData.courseCode ? `${formData.courseCode}: ` : 'CS501: ', formData.title || 'Untitled Course'), /*#__PURE__*/React.createElement("p", {
    className: "text-xs text-slate-500 dark:text-gray-400 line-clamp-3 leading-relaxed"
  }, formData.description || 'Your course description and learning outcomes will appear here in the student catalog.')))))));
}
var _default = CourseForm;

export default _default;
