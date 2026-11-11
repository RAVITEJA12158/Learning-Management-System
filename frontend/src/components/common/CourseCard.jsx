import React from 'react';
import { useNavigate } from 'react-router-dom';
import { CourseBannerPattern } from './CourseBannerPattern';
import Badge from './Badge';
import Button from './Button';
import SpotlightCard from './SpotlightCard';

export function CourseCard({
  course,
  index = 0,
  mode = 'student',
  isEnrolled = false,
  isEnrolling = false,
  onEnroll,
}) {
  const navigate = useNavigate();
  const bannerUrl = course.bannerUrl || course.banner || course.imageUrl;
  const rawInstructor = course.instructorName || course.createdBy?.name || 'Course Instructor';
  const instructor = rawInstructor.replace(/^(Dr\.\s+)+/i, 'Dr. ').replace(/^(Prof\.\s+)+/i, 'Prof. ');
  const instructorInitial =
    instructor.replace(/^Dr\.\s+|^Prof\.\s+/i, '').charAt(0).toUpperCase() || 'I';
  const progress = course.progress ?? 0;
  const status = course.statusBadge || course.status || 'Active';

  return (
    <SpotlightCard className="flex flex-col h-full rounded-2xl">
      <div
        onClick={() => navigate(`/courses/${course.id}`)}
        className="h-32 relative overflow-hidden cursor-pointer transition-all duration-500 dark:grayscale dark:group-hover:grayscale-0"
      >
        <CourseBannerPattern index={index} title={course.title} bannerUrl={bannerUrl} />
      </div>

      <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
        <div>
          {mode === 'catalog' && (
            <p className="text-[11px] font-bold text-slate-400 dark:text-gray-400 uppercase tracking-wider mb-0.5">
              {course.semester || 'Fall 2026'}
            </p>
          )}
          <h3
            onClick={() => navigate(`/courses/${course.id}`)}
            className="font-bold text-slate-900 dark:text-white text-sm line-clamp-1 group-hover:text-cyan-500 dark:group-hover:text-cyan-400 transition cursor-pointer"
          >
            {course.courseCode ? `${course.courseCode}: ` : ''}
            {course.title}
          </h3>
          {mode === 'catalog' ? (
            <p className="text-xs text-slate-500 dark:text-gray-400 line-clamp-2 mt-1 leading-relaxed">
              {course.description ||
                'Learn fundamental concepts, theories, and practical applications.'}
            </p>
          ) : (
            <p className="text-xs text-slate-500 dark:text-gray-400 mt-1 font-medium">
              {instructor}
            </p>
          )}
        </div>

        {mode === 'student' ? (
          <div className="space-y-2.5">
            <div className="flex items-center justify-between text-xs font-semibold text-slate-600 dark:text-gray-400 gap-2">
              <div className="w-full bg-slate-100 dark:bg-gray-800 rounded-full h-1.5 overflow-hidden">
                <div
                  className="bg-blue-600 dark:bg-gradient-to-r dark:from-cyan-400 dark:to-blue-500 dark:shadow-[0_0_10px_rgba(6,182,212,0.6)] h-1.5 rounded-full transition-all duration-500"
                  style={{ width: `${progress}%` }}
                />
              </div>
              <span className="text-[10px] font-bold text-slate-600 dark:text-cyan-400">
                {progress}%
              </span>
            </div>
            <div className="flex items-center justify-between gap-2 pt-1">
              <Button size="sm" onClick={() => navigate(`/courses/${course.id}`)}>
                Continue Lesson
              </Button>
              <Badge variant="active">{status}</Badge>
            </div>
          </div>
        ) : (
          <div className="pt-2 border-t border-slate-100 dark:border-white/5 flex items-center justify-between gap-2">
            <div className="flex items-center gap-2 min-w-0">
              {course.instructorAvatar ? (
                <img
                  src={course.instructorAvatar}
                  alt={instructor}
                  className="h-6 w-6 rounded-full object-cover shrink-0 border border-slate-200 dark:border-gray-800"
                />
              ) : (
                <span className="h-6 w-6 rounded-full bg-gradient-to-tr from-cyan-500 to-blue-600 text-white text-[10px] font-bold flex items-center justify-center shrink-0">
                  {instructorInitial}
                </span>
              )}
              <span className="text-xs font-medium text-slate-700 dark:text-gray-300 truncate">
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
    </SpotlightCard>
  );
}

export function RecommendedCourseItem({ course, isEnrolled, onEnroll }) {
  const navigate = useNavigate();
  const rawInstructor = course.instructorName || course.createdBy?.name || 'Course Instructor';
  const instructor = rawInstructor.replace(/^(Dr\.\s+)+/i, 'Dr. ').replace(/^(Prof\.\s+)+/i, 'Prof. ');
  const instructorInitial =
    instructor.replace(/^Dr\.\s+|^Prof\.\s+/i, '').charAt(0).toUpperCase() || 'I';

  return (
    <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-white/[0.02] border border-slate-100 dark:border-white/5 space-y-3 hover:border-slate-200 dark:hover:border-white/10 transition-colors">
      <div className="flex items-start gap-3">
        <div
          onClick={() => navigate(`/courses/${course.id}`)}
          className="h-14 w-14 rounded-lg bg-[#08172E] shrink-0 overflow-hidden flex items-center justify-center p-1 text-cyan-400 cursor-pointer"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4"
            />
          </svg>
        </div>
        <div className="min-w-0 flex-1">
          <h4
            onClick={() => navigate(`/courses/${course.id}`)}
            className="text-xs font-bold text-slate-900 dark:text-white line-clamp-1 cursor-pointer hover:text-cyan-400 transition"
          >
            {course.courseCode ? `${course.courseCode}: ` : ''}
            {course.title}
          </h4>
          <p className="text-[11px] text-slate-500 dark:text-gray-400 line-clamp-2 mt-0.5">
            {course.description}
          </p>
        </div>
      </div>

      <div className="flex items-center justify-between gap-2 text-[11px] pt-1">
        <div className="flex items-center gap-1.5 min-w-0">
          {course.instructorAvatar ? (
            <img
              src={course.instructorAvatar}
              alt={instructor}
              className="h-5 w-5 rounded-full object-cover border border-slate-200 dark:border-slate-700 shrink-0"
            />
          ) : (
            <span className="h-5 w-5 rounded-full bg-gradient-to-tr from-cyan-500 to-blue-600 text-white text-[9px] font-bold flex items-center justify-center shrink-0">
              {instructorInitial}
            </span>
          )}
          <span className="text-xs font-medium text-slate-600 dark:text-slate-300 truncate">
            {instructor}
          </span>
        </div>

        <div className="flex items-center gap-1.5 shrink-0">
          <Badge variant="open">Open</Badge>
          {isEnrolled ? (
            <Button size="sm" variant="secondary" onClick={() => navigate(`/courses/${course.id}`)}>
              View
            </Button>
          ) : (
            <Button size="sm" onClick={() => onEnroll && onEnroll(course.id)}>
              Enroll
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}

export default CourseCard;
