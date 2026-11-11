import React, { useState, useEffect, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { courseService } from '../services/courseService';
import { CourseCard, RecommendedCourseItem } from '../components/common/CourseCard';
import Modal from '../components/common/Modal';
import Button from '../components/common/Button';
import { SearchIcon, ChevronDownIcon } from '../components/common/Icons';

function CourseCatalog() {
  const [searchParams, setSearchParams] = (0, useSearchParams)();
  const [dbCourses, setDbCourses] = (0, useState)([]);
  const [enrolledCourseIds, setEnrolledCourseIds] = (0, useState)(new Set());
  const [loading, setLoading] = (0, useState)(true);
  const [enrollingId, setEnrollingId] = (0, useState)(null);

  // Filters & Search
  const [searchQuery, setSearchQuery] = (0, useState)(() => searchParams.get('search') || '');
  const [selectedSemester, setSelectedSemester] = (0, useState)('All');
  const [selectedCategory, setSelectedCategory] = (0, useState)('All');
  const [sortBy, setSortBy] = (0, useState)('Popularity');

  // Fast Enrollment Guide Modal
  const [showGuideModal, setShowGuideModal] = (0, useState)(false);

  // Pagination
  const [currentPage, setCurrentPage] = (0, useState)(1);
  const itemsPerPage = 9;
  (0, useEffect)(() => {
    const paramSearch = searchParams.get('search') || '';
    if (paramSearch !== searchQuery) {
      setSearchQuery(paramSearch);
    }
  }, [searchParams]);
  (0, useEffect)(() => {
    fetchData();
  }, []);
  const fetchData = async () => {
    setLoading(true);
    try {
      const [allData, enrolledData] = await Promise.allSettled([courseService.getAll(), courseService.getEnrolled()]);
      if (allData.status === 'fulfilled' && Array.isArray(allData.value)) {
        setDbCourses(allData.value);
      } else {
        setDbCourses([]);
      }
      if (enrolledData.status === 'fulfilled' && Array.isArray(enrolledData.value)) {
        setEnrolledCourseIds(new Set(enrolledData.value.map(c => c.id)));
      }
    } catch (err) {
      console.error('Failed to load courses:', err);
      setDbCourses([]);
    } finally {
      setLoading(false);
    }
  };
  const handleEnroll = async courseId => {
    setEnrollingId(courseId);
    try {
      await courseService.enroll(courseId);
      setEnrolledCourseIds(prev => new Set([...prev, courseId]));
    } catch (err) {
      console.error('Failed to enroll:', err);
    } finally {
      setEnrollingId(null);
    }
  };

  // Filter and sort catalog courses
  const filteredCourses = (0, useMemo)(() => {
    return dbCourses.filter(course => {
      const matchesSearch = !searchQuery.trim() || course.title.toLowerCase().includes(searchQuery.toLowerCase()) || course.courseCode && course.courseCode.toLowerCase().includes(searchQuery.toLowerCase()) || course.description && course.description.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesSemester = selectedSemester === 'All' || course.semester === selectedSemester || `Semester ${course.semester}` === selectedSemester;
      const matchesCategory = selectedCategory === 'All' || course.category === selectedCategory || course.department === selectedCategory;
      return matchesSearch && matchesSemester && matchesCategory;
    }).sort((a, b) => {
      if (sortBy === 'Title') return a.title.localeCompare(b.title);
      if (sortBy === 'Course Code') return (a.courseCode || '').localeCompare(b.courseCode || '');
      return (b.popularity || 90) - (a.popularity || 90);
    });
  }, [dbCourses, searchQuery, selectedSemester, selectedCategory, sortBy]);

  // Paginated slice
  const paginatedCourses = (0, useMemo)(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredCourses.slice(start, start + itemsPerPage);
  }, [filteredCourses, currentPage]);
  const totalPages = Math.ceil(filteredCourses.length / itemsPerPage);

  // Recommendations slice
  const recommendedCourses = (0, useMemo)(() => {
    return dbCourses.slice(0, 4);
  }, [dbCourses]);
  return /*#__PURE__*/React.createElement("main", {
    className: "mx-auto max-w-[1440px] px-4 py-8 sm:px-8 lg:py-10 w-full transition-colors duration-200"
  }, /*#__PURE__*/React.createElement("div", {
    className: "flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8"
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("h1", {
    className: "text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight transition-colors"
  }, "Explore All Courses | Course Catalog"), /*#__PURE__*/React.createElement("p", {
    className: "text-xs sm:text-sm text-slate-500 dark:text-gray-400 font-medium mt-1 transition-colors"
  }, "Browse academic offerings, syllabi, and one-click enrollment across departments")), /*#__PURE__*/React.createElement(Button, {
    onClick: () => setShowGuideModal(true),
    className: "self-start sm:self-auto shrink-0"
  }, "View Fast Enrollment Guide")), /*#__PURE__*/React.createElement("div", {
    className: "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5 mb-8"
  }, /*#__PURE__*/React.createElement("div", {
    className: "relative"
  }, /*#__PURE__*/React.createElement("span", {
    className: "absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400 dark:text-gray-500"
  }, /*#__PURE__*/React.createElement(SearchIcon, null)), /*#__PURE__*/React.createElement("input", {
    type: "text",
    placeholder: "Search by course code or title...",
    value: searchQuery,
    onChange: e => {
      setSearchQuery(e.target.value);
      setCurrentPage(1);
    },
    className: "w-full pl-9 pr-4 py-2.5 bg-white dark:bg-white/[0.02] dark:backdrop-blur-xl border border-slate-200 dark:border-white/10 rounded-xl text-xs font-medium text-slate-800 dark:text-white placeholder-slate-400 dark:placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-purple-500/50 focus:border-purple-500 transition shadow-xs"
  })), /*#__PURE__*/React.createElement("div", {
    className: "relative"
  }, /*#__PURE__*/React.createElement("label", {
    className: "absolute -top-2 left-3 bg-white dark:bg-[#030712] px-1 text-[10px] font-bold text-slate-500 dark:text-gray-400 uppercase tracking-wider z-10"
  }, "Semester"), /*#__PURE__*/React.createElement("select", {
    value: selectedSemester,
    onChange: e => {
      setSelectedSemester(e.target.value);
      setCurrentPage(1);
    },
    className: "w-full px-3.5 py-2.5 bg-white dark:bg-[#030712]/90 border border-slate-200 dark:border-white/10 rounded-xl text-xs font-semibold text-slate-800 dark:text-white focus:outline-none focus:ring-1 focus:ring-purple-500/50 focus:border-purple-500 transition shadow-xs appearance-none cursor-pointer"
  }, /*#__PURE__*/React.createElement("option", {
    value: "All",
    className: "bg-white dark:bg-[#030712] text-slate-800 dark:text-white"
  }, "All Semesters"), /*#__PURE__*/React.createElement("option", {
    value: "Fall 2026",
    className: "bg-white dark:bg-[#030712] text-slate-800 dark:text-white"
  }, "Fall 2026"), /*#__PURE__*/React.createElement("option", {
    value: "Spring 2026",
    className: "bg-white dark:bg-[#030712] text-slate-800 dark:text-white"
  }, "Spring 2026")), /*#__PURE__*/React.createElement("span", {
    className: "absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none text-slate-400 dark:text-gray-500"
  }, /*#__PURE__*/React.createElement(ChevronDownIcon, {
    className: "w-3.5 h-3.5"
  }))), /*#__PURE__*/React.createElement("div", {
    className: "relative"
  }, /*#__PURE__*/React.createElement("label", {
    className: "absolute -top-2 left-3 bg-white dark:bg-[#030712] px-1 text-[10px] font-bold text-slate-500 dark:text-gray-400 uppercase tracking-wider z-10"
  }, "Category"), /*#__PURE__*/React.createElement("select", {
    value: selectedCategory,
    onChange: e => {
      setSelectedCategory(e.target.value);
      setCurrentPage(1);
    },
    className: "w-full px-3.5 py-2.5 bg-white dark:bg-[#030712]/90 border border-slate-200 dark:border-white/10 rounded-xl text-xs font-semibold text-slate-800 dark:text-white focus:outline-none focus:ring-1 focus:ring-purple-500/50 focus:border-purple-500 transition shadow-xs appearance-none cursor-pointer"
  }, /*#__PURE__*/React.createElement("option", {
    value: "All",
    className: "bg-white dark:bg-[#030712] text-slate-800 dark:text-white"
  }, "All Categories"), /*#__PURE__*/React.createElement("option", {
    value: "Computer Science",
    className: "bg-white dark:bg-[#030712] text-slate-800 dark:text-white"
  }, "Computer Science"), /*#__PURE__*/React.createElement("option", {
    value: "Artificial Intelligence",
    className: "bg-white dark:bg-[#030712] text-slate-800 dark:text-white"
  }, "Artificial Intelligence"), /*#__PURE__*/React.createElement("option", {
    value: "Data Science",
    className: "bg-white dark:bg-[#030712] text-slate-800 dark:text-white"
  }, "Data Science"), /*#__PURE__*/React.createElement("option", {
    value: "Mathematics",
    className: "bg-white dark:bg-[#030712] text-slate-800 dark:text-white"
  }, "Mathematics"), /*#__PURE__*/React.createElement("option", {
    value: "Software Engineering",
    className: "bg-white dark:bg-[#030712] text-slate-800 dark:text-white"
  }, "Software Engineering")), /*#__PURE__*/React.createElement("span", {
    className: "absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none text-slate-400 dark:text-gray-500"
  }, /*#__PURE__*/React.createElement(ChevronDownIcon, {
    className: "w-3.5 h-3.5"
  }))), /*#__PURE__*/React.createElement("div", {
    className: "relative"
  }, /*#__PURE__*/React.createElement("label", {
    className: "absolute -top-2 left-3 bg-white dark:bg-[#030712] px-1 text-[10px] font-bold text-slate-500 dark:text-gray-400 uppercase tracking-wider z-10"
  }, "Sort By"), /*#__PURE__*/React.createElement("select", {
    value: sortBy,
    onChange: e => setSortBy(e.target.value),
    className: "w-full px-3.5 py-2.5 bg-white dark:bg-[#030712]/90 border border-slate-200 dark:border-white/10 rounded-xl text-xs font-semibold text-slate-800 dark:text-white focus:outline-none focus:ring-1 focus:ring-purple-500/50 focus:border-purple-500 transition shadow-xs appearance-none cursor-pointer"
  }, /*#__PURE__*/React.createElement("option", {
    value: "Popularity",
    className: "bg-white dark:bg-[#030712] text-slate-800 dark:text-white"
  }, "Popularity"), /*#__PURE__*/React.createElement("option", {
    value: "Title",
    className: "bg-white dark:bg-[#030712] text-slate-800 dark:text-white"
  }, "Title (A-Z)"), /*#__PURE__*/React.createElement("option", {
    value: "Course Code",
    className: "bg-white dark:bg-[#030712] text-slate-800 dark:text-white"
  }, "Course Code")), /*#__PURE__*/React.createElement("span", {
    className: "absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none text-slate-400 dark:text-gray-500"
  }, /*#__PURE__*/React.createElement(ChevronDownIcon, {
    className: "w-3.5 h-3.5"
  })))), /*#__PURE__*/React.createElement("div", {
    className: "grid grid-cols-1 lg:grid-cols-3 gap-8"
  }, /*#__PURE__*/React.createElement("div", {
    className: "lg:col-span-2 space-y-6"
  }, /*#__PURE__*/React.createElement("div", {
    className: "flex items-center justify-between"
  }, /*#__PURE__*/React.createElement("h2", {
    className: "text-lg font-extrabold text-slate-900 dark:text-white tracking-tight transition-colors"
  }, "Available Courses (", filteredCourses.length, ")")), loading ? /*#__PURE__*/React.createElement("div", {
    className: "bg-white dark:bg-white/[0.02] dark:backdrop-blur-xl rounded-2xl border border-slate-200/80 dark:border-white/5 p-8 text-center text-xs font-bold text-slate-400 dark:text-gray-400"
  }, "Loading courses...") : paginatedCourses.length > 0 ? /*#__PURE__*/React.createElement("div", {
    className: "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"
  }, paginatedCourses.map((course, idx) => /*#__PURE__*/React.createElement(CourseCard, {
    key: course.id || idx,
    course: course,
    index: idx,
    mode: "catalog",
    isEnrolled: enrolledCourseIds.has(course.id),
    isEnrolling: enrollingId === course.id,
    onEnroll: handleEnroll
  }))) : /*#__PURE__*/React.createElement("div", {
    className: "bg-white dark:bg-white/[0.02] dark:backdrop-blur-xl rounded-2xl border border-slate-200/80 dark:border-white/5 p-10 text-center shadow-xs"
  }, /*#__PURE__*/React.createElement("p", {
    className: "text-base font-bold text-slate-900 dark:text-white"
  }, "No courses match your filter criteria."), /*#__PURE__*/React.createElement("p", {
    className: "mt-1 text-xs text-slate-500 dark:text-gray-400"
  }, "Try adjusting your search terms or filters."), /*#__PURE__*/React.createElement("button", {
    onClick: () => {
      setSearchQuery('');
      setSearchParams({});
      setSelectedSemester('All');
      setSelectedCategory('All');
    },
    className: "mt-4 text-xs font-bold text-cyan-500 hover:text-cyan-400 hover:underline cursor-pointer"
  }, "Clear all filters")), totalPages > 1 && /*#__PURE__*/React.createElement("div", {
    className: "flex items-center justify-center gap-3 pt-4"
  }, /*#__PURE__*/React.createElement(Button, {
    variant: "outline",
    size: "sm",
    onClick: () => setCurrentPage(p => Math.max(p - 1, 1)),
    disabled: currentPage === 1
  }, "< Prev"), /*#__PURE__*/React.createElement("span", {
    className: "text-xs font-semibold text-slate-500 dark:text-zinc-400"
  }, "Page ", currentPage, " of ", totalPages), /*#__PURE__*/React.createElement(Button, {
    variant: "outline",
    size: "sm",
    onClick: () => setCurrentPage(p => Math.min(p + 1, totalPages)),
    disabled: currentPage === totalPages
  }, "Next >"))), /*#__PURE__*/React.createElement("div", {
    className: "lg:col-span-1"
  }, /*#__PURE__*/React.createElement("div", {
    className: "bg-white dark:bg-white/[0.02] dark:backdrop-blur-xl rounded-2xl border border-slate-200/80 dark:border-white/5 p-5 shadow-xs space-y-5 sticky top-24 transition-colors"
  }, /*#__PURE__*/React.createElement("h2", {
    className: "text-base font-extrabold text-slate-900 dark:text-white border-b border-slate-100 dark:border-white/5 pb-3.5 transition-colors"
  }, "Recommended for You"), /*#__PURE__*/React.createElement("div", {
    className: "space-y-4"
  }, recommendedCourses.map((rec, rIdx) => /*#__PURE__*/React.createElement(RecommendedCourseItem, {
    key: rec.id || rIdx,
    course: rec,
    index: rIdx,
    isEnrolled: enrolledCourseIds.has(rec.id),
    onEnroll: handleEnroll
  })))))), /*#__PURE__*/React.createElement(Modal, {
    isOpen: showGuideModal,
    onClose: () => setShowGuideModal(false),
    title: "Fast Enrollment Guide",
    subtitle: "How course enrollment and scheduling works"
  }, /*#__PURE__*/React.createElement("div", {
    className: "space-y-4 text-xs text-slate-600 dark:text-gray-300 leading-relaxed"
  }, /*#__PURE__*/React.createElement("div", {
    className: "flex gap-3"
  }, /*#__PURE__*/React.createElement("span", {
    className: "flex h-6 w-6 items-center justify-center rounded-full bg-cyan-100 dark:bg-cyan-950/60 text-cyan-600 dark:text-cyan-400 font-bold shrink-0"
  }, "1"), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("strong", {
    className: "block text-slate-900 dark:text-white"
  }, "Select Your Term & Subject"), "Use the semester and category filters above to narrow down offerings that match your degree roadmap.")), /*#__PURE__*/React.createElement("div", {
    className: "flex gap-3"
  }, /*#__PURE__*/React.createElement("span", {
    className: "flex h-6 w-6 items-center justify-center rounded-full bg-cyan-100 dark:bg-cyan-950/60 text-cyan-600 dark:text-cyan-400 font-bold shrink-0"
  }, "2"), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("strong", {
    className: "block text-slate-900 dark:text-white"
  }, "Instant One-Click Enrollment"), "Click the blue ", /*#__PURE__*/React.createElement("strong", null, "Enroll"), " button on any course with the green ", /*#__PURE__*/React.createElement("em", null, "Open"), " badge for instant registration.")), /*#__PURE__*/React.createElement("div", {
    className: "flex gap-3"
  }, /*#__PURE__*/React.createElement("span", {
    className: "flex h-6 w-6 items-center justify-center rounded-full bg-cyan-100 dark:bg-cyan-950/60 text-cyan-600 dark:text-cyan-400 font-bold shrink-0"
  }, "3"), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("strong", {
    className: "block text-slate-900 dark:text-white"
  }, "Access Your Workspace"), "Enrolled courses immediately appear on your ", /*#__PURE__*/React.createElement("strong", null, "My Dashboard"), " workspace with curriculum materials and deadline alerts."))), /*#__PURE__*/React.createElement("div", {
    className: "mt-6 pt-4 border-t border-slate-100 dark:border-white/10 flex justify-end"
  }, /*#__PURE__*/React.createElement(Button, {
    onClick: () => setShowGuideModal(false)
  }, "Got it, Let's Explore"))));
}
var _default = CourseCatalog;

export default _default;
