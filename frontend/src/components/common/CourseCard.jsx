import React from 'react';
import { useNavigate } from 'react-router-dom';
import { CourseBannerPattern } from './CourseBannerPattern';
import Badge from './Badge';
import Button from './Button';

export function CourseCard({
  course,
  index = 0,
  mode = 'student', // 'student' | 'catalog'
  isEnrolled = false,
  isEnrolling = false,
  onEnroll,
}) {
  const navigate = useNavigate();

  const bannerUrl = course.bannerUrl || course.banner || course.imageUrl;
  const instructor = course.instructorName || course.createdBy?.name || 'Dr. Alan Turing';
  const instructorAvatar =
    course.instructorAvatar ||
    (index % 2 === 0
      ? 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&auto=format&fit=crop&q=80'
      : 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=120&auto=format&fit=crop&q=80');

  const progress = course.progress ?? (index % 2 === 0 ? 85 : 62);
  const status = course.status || (index === 0 ? 'Cors badged' : 'Status');

  return (
    <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-slate-200/80 dark:border-zinc-800 shadow-xs hover:shadow-md transition flex flex-col overflow-hidden group">
      {/* Dark-themed blueprint or geometric graphic banner */}
      <div
        onClick={() => navigate(`/courses/${course.id}`)}
        className="h-32 relative overflow-hidden cursor-pointer"
      >
        <CourseBannerPattern
          index={index}
          title={course.title}
          bannerUrl={bannerUrl}
        />
      </div>

      {/* Content */}
      <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
        <div>
          {mode === 'catalog' && (
            <p className="text-[11px] font-bold text-slate-400 dark:text-zinc-500 uppercase tracking-wider mb-0.5">
              {course.semester || 'Fall 2024'}
            </p>
          )}

          <h3
            onClick={() => navigate(`/courses/${course.id}`)}
            className="font-bold text-slate-900 dark:text-zinc-50 text-xs sm:text-sm line-clamp-1 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition cursor-pointer"
          >
            {course.courseCode ? `${course.courseCode}: ` : ''}{course.title}
          </h3>

          {mode === 'catalog' ? (
            <p className="text-[11px] text-slate-500 dark:text-zinc-400 line-clamp-2 mt-1 leading-relaxed">
              {course.description || 'Learn fundamental concepts, theories, and practical applications.'}
            </p>
          ) : (
            <p className="text-[11px] text-slate-500 dark:text-zinc-400 mt-1 font-medium">
              {instructor}
            </p>
          )}
        </div>

        {/* Footer / Actions based on mode */}
        {mode === 'student' ? (
          <div className="space-y-2.5">
            {/* Progress line */}
            <div className="flex items-center justify-between text-xs font-semibold text-slate-600 dark:text-zinc-400 gap-2">
              <div className="w-full bg-slate-100 dark:bg-zinc-800 rounded-full h-1.5 overflow-hidden">
                <div
                  className="bg-blue-600 dark:bg-blue-500 h-1.5 rounded-full transition-all duration-500"
                  style={{ width: `${progress}%` }}
                />
              </div>
              <span className="text-[10px] font-bold text-slate-600 dark:text-zinc-300">{progress}%</span>
            </div>

            {/* Action Row */}
            <div className="flex items-center justify-between pt-1">
              <Button
                size="sm"
                onClick={() => navigate(`/courses/${course.id}`)}
              >
                Continue Lesson
              </Button>
              <Badge variant={status === 'Cors badged' ? 'active' : 'neutral'}>
                {status}
              </Badge>
            </div>
          </div>
        ) : (
          /* Catalog mode footer */
          <div className="pt-2 border-t border-slate-100 dark:border-zinc-800 flex items-center justify-between gap-2">
            <div className="flex items-center gap-2 min-w-0">
              <img
                src={instructorAvatar}
                alt={instructor}
                className="h-6 w-6 rounded-full object-cover shrink-0 border border-slate-200 dark:border-zinc-700"
              />
              <span className="text-[11px] font-medium text-slate-700 dark:text-zinc-300 truncate">
                {instructor}
              </span>
            </div>

            <div className="flex items-center gap-1.5 shrink-0">
              <Badge variant={course.status === 'Waiting List' ? 'waiting' : 'open'}>
                {course.status || 'Open'}
              </Badge>

              {isEnrolled ? (
                <Button
                  size="sm"
                  variant="secondary"
                  onClick={() => navigate(`/courses/${course.id}`)}
                >
                  View
                </Button>
              ) : (
                <Button
                  size="sm"
                  onClick={() => onEnroll && onEnroll(course.id)}
                  disabled={isEnrolling}
                >
                  {isEnrolling ? '...' : 'Enroll'}
                </Button>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export function RecommendedCourseItem({ course, index = 0, isEnrolled, onEnroll }) {
  const navigate = useNavigate();

  return (
    <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-zinc-800/60 border border-slate-100 dark:border-zinc-800 space-y-3">
      <div className="flex items-start gap-3">
        {/* Mini Thumbnail */}
        <div
          onClick={() => navigate(`/courses/${course.id}`)}
          className="h-14 w-14 rounded-lg bg-[#08172E] shrink-0 overflow-hidden flex items-center justify-center p-1 text-blue-400 cursor-pointer"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
          </svg>
        </div>

        <div className="min-w-0">
          <h4
            onClick={() => navigate(`/courses/${course.id}`)}
            className="text-xs font-bold text-slate-900 dark:text-zinc-50 line-clamp-1 cursor-pointer hover:text-blue-600 transition"
          >
            {course.courseCode ? `${course.courseCode}: ` : ''}{course.title}
          </h4>
          <p className="text-[10px] text-slate-500 dark:text-zinc-400 line-clamp-2 mt-0.5">
            {course.description}
          </p>
        </div>
      </div>

      <div className="flex items-center justify-between text-[11px] pt-1">
        <div className="flex items-center gap-1.5">
          <img
            src={course.instructorAvatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&auto=format&fit=crop&q=80'}
            alt={course.instructorName}
            className="h-5 w-5 rounded-full object-cover border border-slate-200 dark:border-zinc-700"
          />
          <span className="text-[10px] font-medium text-slate-600 dark:text-zinc-300">
            {course.instructorName || 'Dr. Grace Hopper'}
          </span>
        </div>

        <div className="flex items-center gap-1.5">
          <Badge variant="open">Open</Badge>
          {isEnrolled ? (
            <button
              onClick={() => navigate(`/courses/${course.id}`)}
              className="text-[10px] font-bold text-slate-600 dark:text-zinc-300 hover:underline px-2 py-1 cursor-pointer"
            >
              View
            </button>
          ) : (
            <Button
              size="sm"
              onClick={() => onEnroll && onEnroll(course.id)}
            >
              Enroll
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}

export default CourseCard;
