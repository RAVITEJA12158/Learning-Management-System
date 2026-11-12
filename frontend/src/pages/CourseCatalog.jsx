import React, { useState, useEffect, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { courseService } from '../services/courseService';
import { CourseCard, RecommendedCourseItem } from '../components/common/CourseCard';
import Modal from '../components/common/Modal';
import Button from '../components/common/Button';
import { SearchIcon, ChevronDownIcon } from '../components/common/Icons';

export default function CourseCatalog() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [dbCourses, setDbCourses] = useState([]);
  const [enrolledCourseIds, setEnrolledCourseIds] = useState(new Set());
  const [loading, setLoading] = useState(true);
  const [enrollingId, setEnrollingId] = useState(null);

  const [searchQuery, setSearchQuery] = useState(() => searchParams.get('search') || '');
  const [selectedSemester, setSelectedSemester] = useState('All');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [sortBy, setSortBy] = useState('Popularity');

  const [showGuideModal, setShowGuideModal] = useState(false);

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 9;

  useEffect(() => {
    const paramSearch = searchParams.get('search') || '';
    if (paramSearch !== searchQuery) {
      setSearchQuery(paramSearch);
    }
  }, [searchParams]);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [allData, enrolledData] = await Promise.allSettled([
        courseService.getAll(),
        courseService.getEnrolled(),
      ]);
      if (allData.status === 'fulfilled' && Array.isArray(allData.value)) {
        setDbCourses(allData.value);
      } else {
        setDbCourses([]);
      }
      if (enrolledData.status === 'fulfilled' && Array.isArray(enrolledData.value)) {
        setEnrolledCourseIds(new Set(enrolledData.value.map((c) => c.id)));
      }
    } catch (err) {
      console.error('Failed to load courses:', err);
      setDbCourses([]);
    } finally {
      setLoading(false);
    }
  };

  const handleEnroll = async (courseId) => {
    setEnrollingId(courseId);
    try {
      await courseService.enroll(courseId);
      setEnrolledCourseIds((prev) => new Set([...prev, courseId]));
    } catch (err) {
      console.error('Failed to enroll:', err);
    } finally {
      setEnrollingId(null);
    }
  };

  const filteredCourses = useMemo(() => {
    return dbCourses
      .filter((course) => {
        const matchesSearch =
          !searchQuery.trim() ||
          course.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          (course.courseCode && course.courseCode.toLowerCase().includes(searchQuery.toLowerCase())) ||
          (course.description && course.description.toLowerCase().includes(searchQuery.toLowerCase()));
        const matchesSemester =
          selectedSemester === 'All' ||
          course.semester === selectedSemester ||
          `Semester ${course.semester}` === selectedSemester;
        const matchesCategory =
          selectedCategory === 'All' ||
          course.category === selectedCategory ||
          course.department === selectedCategory;
        return matchesSearch && matchesSemester && matchesCategory;
      })
      .sort((a, b) => {
        if (sortBy === 'Title') return a.title.localeCompare(b.title);
        if (sortBy === 'Course Code') return (a.courseCode || '').localeCompare(b.courseCode || '');
        return (b.popularity || 90) - (a.popularity || 90);
      });
  }, [dbCourses, searchQuery, selectedSemester, selectedCategory, sortBy]);

  const paginatedCourses = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredCourses.slice(start, start + itemsPerPage);
  }, [filteredCourses, currentPage]);

  const totalPages = Math.ceil(filteredCourses.length / itemsPerPage);

  const recommendedCourses = useMemo(() => {
    return dbCourses.slice(0, 4);
  }, [dbCourses]);

  return (
    <main className="mx-auto max-w-[1440px] px-4 py-6 sm:px-8 lg:py-10 w-full transition-colors duration-200">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight transition-colors">
            Explore All Courses | Course Catalog
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-gray-400 font-medium mt-1 transition-colors">
            Browse academic offerings, syllabi, and one-click enrollment across departments
          </p>
        </div>
        <Button
          onClick={() => setShowGuideModal(true)}
          className="self-stretch sm:self-auto shrink-0"
        >
          View Fast Enrollment Guide
        </Button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5 mb-8">
        <div className="relative">
          <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400 dark:text-gray-500">
            <SearchIcon />
          </span>
          <input
            type="text"
            placeholder="Search by course code or title..."
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setCurrentPage(1);
            }}
            className="w-full min-h-[44px] pl-10 pr-4 py-2.5 bg-white dark:bg-white/[0.02] dark:backdrop-blur-xl border border-slate-200 dark:border-white/10 rounded-xl text-sm sm:text-xs font-medium text-slate-800 dark:text-white placeholder-slate-400 dark:placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-purple-500/50 focus:border-purple-500 transition shadow-xs"
          />
        </div>

        <div className="relative">
          <label className="absolute -top-2 left-3 bg-white dark:bg-[#030712] px-1 text-[10px] font-bold text-slate-500 dark:text-gray-400 uppercase tracking-wider z-10">
            Semester
          </label>
          <select
            value={selectedSemester}
            onChange={(e) => {
              setSelectedSemester(e.target.value);
              setCurrentPage(1);
            }}
            className="w-full min-h-[44px] px-3.5 py-2.5 bg-white dark:bg-[#030712]/90 border border-slate-200 dark:border-white/10 rounded-xl text-sm sm:text-xs font-semibold text-slate-800 dark:text-white focus:outline-none focus:ring-1 focus:ring-purple-500/50 focus:border-purple-500 transition shadow-xs appearance-none cursor-pointer"
          >
            <option value="All" className="bg-white dark:bg-[#030712] text-slate-800 dark:text-white">
              All Semesters
            </option>
            <option value="Fall 2026" className="bg-white dark:bg-[#030712] text-slate-800 dark:text-white">
              Fall 2026
            </option>
            <option value="Spring 2026" className="bg-white dark:bg-[#030712] text-slate-800 dark:text-white">
              Spring 2026
            </option>
          </select>
          <span className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none text-slate-400 dark:text-gray-500">
            <ChevronDownIcon className="w-3.5 h-3.5" />
          </span>
        </div>

        <div className="relative">
          <label className="absolute -top-2 left-3 bg-white dark:bg-[#030712] px-1 text-[10px] font-bold text-slate-500 dark:text-gray-400 uppercase tracking-wider z-10">
            Category
          </label>
          <select
            value={selectedCategory}
            onChange={(e) => {
              setSelectedCategory(e.target.value);
              setCurrentPage(1);
            }}
            className="w-full min-h-[44px] px-3.5 py-2.5 bg-white dark:bg-[#030712]/90 border border-slate-200 dark:border-white/10 rounded-xl text-sm sm:text-xs font-semibold text-slate-800 dark:text-white focus:outline-none focus:ring-1 focus:ring-purple-500/50 focus:border-purple-500 transition shadow-xs appearance-none cursor-pointer"
          >
            <option value="All" className="bg-white dark:bg-[#030712] text-slate-800 dark:text-white">
              All Categories
            </option>
            <option value="Computer Science" className="bg-white dark:bg-[#030712] text-slate-800 dark:text-white">
              Computer Science
            </option>
            <option value="Artificial Intelligence" className="bg-white dark:bg-[#030712] text-slate-800 dark:text-white">
              Artificial Intelligence
            </option>
            <option value="Data Science" className="bg-white dark:bg-[#030712] text-slate-800 dark:text-white">
              Data Science
            </option>
            <option value="Mathematics" className="bg-white dark:bg-[#030712] text-slate-800 dark:text-white">
              Mathematics
            </option>
            <option value="Software Engineering" className="bg-white dark:bg-[#030712] text-slate-800 dark:text-white">
              Software Engineering
            </option>
          </select>
          <span className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none text-slate-400 dark:text-gray-500">
            <ChevronDownIcon className="w-3.5 h-3.5" />
          </span>
        </div>

        <div className="relative">
          <label className="absolute -top-2 left-3 bg-white dark:bg-[#030712] px-1 text-[10px] font-bold text-slate-500 dark:text-gray-400 uppercase tracking-wider z-10">
            Sort By
          </label>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="w-full min-h-[44px] px-3.5 py-2.5 bg-white dark:bg-[#030712]/90 border border-slate-200 dark:border-white/10 rounded-xl text-sm sm:text-xs font-semibold text-slate-800 dark:text-white focus:outline-none focus:ring-1 focus:ring-purple-500/50 focus:border-purple-500 transition shadow-xs appearance-none cursor-pointer"
          >
            <option value="Popularity" className="bg-white dark:bg-[#030712] text-slate-800 dark:text-white">
              Popularity
            </option>
            <option value="Title" className="bg-white dark:bg-[#030712] text-slate-800 dark:text-white">
              Title (A-Z)
            </option>
            <option value="Course Code" className="bg-white dark:bg-[#030712] text-slate-800 dark:text-white">
              Course Code
            </option>
          </select>
          <span className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none text-slate-400 dark:text-gray-500">
            <ChevronDownIcon className="w-3.5 h-3.5" />
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-extrabold text-slate-900 dark:text-white tracking-tight transition-colors">
              Available Courses ({filteredCourses.length})
            </h2>
          </div>

          {loading ? (
            <div className="bg-white dark:bg-white/[0.02] dark:backdrop-blur-xl rounded-2xl border border-slate-200/80 dark:border-white/5 p-8 text-center text-xs font-bold text-slate-400 dark:text-gray-400">
              Loading courses...
            </div>
          ) : paginatedCourses.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
              {paginatedCourses.map((course, idx) => (
                <CourseCard
                  key={course.id || idx}
                  course={course}
                  index={idx}
                  mode="catalog"
                  isEnrolled={enrolledCourseIds.has(course.id)}
                  isEnrolling={enrollingId === course.id}
                  onEnroll={handleEnroll}
                />
              ))}
            </div>
          ) : (
            <div className="bg-white dark:bg-white/[0.02] dark:backdrop-blur-xl rounded-2xl border border-slate-200/80 dark:border-white/5 p-10 text-center shadow-xs">
              <p className="text-base font-bold text-slate-900 dark:text-white">
                No courses match your filter criteria.
              </p>
              <p className="mt-1 text-xs text-slate-500 dark:text-gray-400">
                Try adjusting your search terms or filters.
              </p>
              <button
                onClick={() => {
                  setSearchQuery('');
                  setSearchParams({});
                  setSelectedSemester('All');
                  setSelectedCategory('All');
                }}
                className="mt-4 min-h-[44px] px-4 text-xs font-bold text-cyan-500 hover:text-cyan-400 hover:underline cursor-pointer"
              >
                Clear all filters
              </button>
            </div>
          )}

          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-3 pt-4">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
                disabled={currentPage === 1}
              >
                &lt; Prev
              </Button>
              <span className="text-xs font-semibold text-slate-500 dark:text-zinc-400">
                Page {currentPage} of {totalPages}
              </span>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
                disabled={currentPage === totalPages}
              >
                Next &gt;
              </Button>
            </div>
          )}
        </div>

        <div className="lg:col-span-1">
          <div className="bg-white dark:bg-white/[0.02] dark:backdrop-blur-xl rounded-2xl border border-slate-200/80 dark:border-white/5 p-5 shadow-xs space-y-5 lg:sticky lg:top-24 transition-colors">
            <h2 className="text-base font-extrabold text-slate-900 dark:text-white border-b border-slate-100 dark:border-white/5 pb-3.5 transition-colors">
              Recommended for You
            </h2>
            <div className="space-y-4">
              {recommendedCourses.map((rec, rIdx) => (
                <RecommendedCourseItem
                  key={rec.id || rIdx}
                  course={rec}
                  index={rIdx}
                  isEnrolled={enrolledCourseIds.has(rec.id)}
                  onEnroll={handleEnroll}
                />
              ))}
            </div>
          </div>
        </div>
      </div>

      <Modal
        isOpen={showGuideModal}
        onClose={() => setShowGuideModal(false)}
        title="Fast Enrollment Guide"
        subtitle="How course enrollment and scheduling works"
      >
        <div className="space-y-4 text-xs text-slate-600 dark:text-gray-300 leading-relaxed">
          <div className="flex gap-3">
            <span className="flex h-6 w-6 items-center justify-center rounded-full bg-cyan-100 dark:bg-cyan-950/60 text-cyan-600 dark:text-cyan-400 font-bold shrink-0">
              1
            </span>
            <div>
              <strong className="block text-slate-900 dark:text-white">Select Your Term & Subject</strong>
              Use the semester and category filters above to narrow down offerings that match your degree roadmap.
            </div>
          </div>
          <div className="flex gap-3">
            <span className="flex h-6 w-6 items-center justify-center rounded-full bg-cyan-100 dark:bg-cyan-950/60 text-cyan-600 dark:text-cyan-400 font-bold shrink-0">
              2
            </span>
            <div>
              <strong className="block text-slate-900 dark:text-white">Instant One-Click Enrollment</strong>
              Click the blue <strong>Enroll</strong> button on any course with the green <em>Open</em> badge for instant registration.
            </div>
          </div>
          <div className="flex gap-3">
            <span className="flex h-6 w-6 items-center justify-center rounded-full bg-cyan-100 dark:bg-cyan-950/60 text-cyan-600 dark:text-cyan-400 font-bold shrink-0">
              3
            </span>
            <div>
              <strong className="block text-slate-900 dark:text-white">Access Your Workspace</strong>
              Enrolled courses immediately appear on your <strong>My Dashboard</strong> workspace with curriculum materials and deadline alerts.
            </div>
          </div>
        </div>
        <div className="mt-6 pt-4 border-t border-slate-100 dark:border-white/10 flex justify-end">
          <Button onClick={() => setShowGuideModal(false)}>Got it, Let&apos;s Explore</Button>
        </div>
      </Modal>
    </main>
  );
}
