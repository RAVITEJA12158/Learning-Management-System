import React, { useState } from 'react';

export function OverviewTab({
  course,
  courseCode,
  instructorsText,
  isCreatorOrStaff,
  isEnrolled,
  enrolling,
  handleEnroll,
  assignments,
  onSelectTab,
}) {
  const [assessmentsPanelOpen, setAssessmentsPanelOpen] = useState(true);

  // Check if any assignment is due within 24 hours
  const hasSoonDue = assignments.some((a) => {
    const diff = new Date(a.dueDate) - new Date();
    return diff > 0 && diff < 86400000;
  });

  return (
    <div className="p-6 space-y-6">
      {/* A. Hero Banner */}
      <div className="relative overflow-hidden rounded-2xl bg-white dark:bg-zinc-900 border border-slate-200/80 dark:border-zinc-800 p-6 sm:p-8 shadow-xs transition-colors">
        {/* Subtle radial gradient flair */}
        <div className="pointer-events-none absolute -right-20 -top-20 h-72 w-72 rounded-full bg-blue-500/10 dark:bg-blue-600/10 blur-3xl" />

        <div className="relative">
          <p className="text-[10px] font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400 mb-1.5">
            {courseCode}
          </p>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-zinc-50 tracking-tight">
            {course.title}
          </h1>
          {course.description && (
            <p className="mt-3 text-sm leading-relaxed text-slate-600 dark:text-zinc-400 max-w-2xl">
              {course.description}
            </p>
          )}
          <div className="mt-5 flex flex-wrap items-center gap-4">
            <p className="text-xs text-slate-500 dark:text-zinc-400">
              Instructor: <span className="text-slate-800 dark:text-zinc-200 font-semibold">{instructorsText}</span>
            </p>
            {isCreatorOrStaff ? (
              <span className="text-[10px] font-bold bg-slate-100 dark:bg-zinc-800 text-slate-700 dark:text-zinc-300 px-2.5 py-1 rounded-md border border-slate-200 dark:border-zinc-700">
                🛡️ Staff Access
              </span>
            ) : isEnrolled ? (
              <span className="text-[10px] font-bold bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400 px-2.5 py-1 rounded-md border border-emerald-200 dark:border-emerald-800/50">
                ✓ Enrolled
              </span>
            ) : (
              <button
                onClick={handleEnroll}
                disabled={enrolling}
                className="text-xs font-bold bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition disabled:opacity-50 cursor-pointer shadow-xs"
              >
                {enrolling ? 'Enrolling…' : 'Enroll in Course'}
              </button>
            )}
          </div>
        </div>
      </div>

      {/* B. Split-Screen Dashboard Grid */}
      <div className="grid grid-cols-12 gap-6">
        {/* Main Column */}
        <div
          className={`transition-all duration-300 ease-in-out space-y-6 ${
            assessmentsPanelOpen ? 'col-span-12 lg:col-span-8' : 'col-span-12'
          }`}
        >
          {/* Course Description / Syllabus */}
          <div className="rounded-2xl bg-white dark:bg-zinc-900 border border-slate-200/80 dark:border-zinc-800 p-6 shadow-xs transition-colors">
            <h3 className="text-sm font-bold text-slate-900 dark:text-zinc-50 mb-3">Course Syllabus</h3>
            <p className="text-xs leading-relaxed text-slate-600 dark:text-zinc-400">
              {course.description ||
                'This course covers key academic concepts including theory, practical lab work, and applied research methodology. Students will gain hands-on experience with modern frameworks and tools through structured assignments and collaborative projects.'}
            </p>
          </div>

          {/* Recent Announcements Feed */}
          <div className="rounded-2xl bg-white dark:bg-zinc-900 border border-slate-200/80 dark:border-zinc-800 p-6 shadow-xs transition-colors">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-bold text-slate-900 dark:text-zinc-50">Recent Announcements</h3>
              <button
                onClick={() => onSelectTab('announcements')}
                className="text-[11px] font-semibold text-blue-600 dark:text-blue-400 hover:underline cursor-pointer"
              >
                View all
              </button>
            </div>
            <div className="space-y-3">
              <AnnouncementCard
                title="Exam Dates Finalized"
                author={instructorsText}
                time="2 hours ago"
                snippet="The midterm exam has been scheduled for Nov 25th in Room 302. Please review all modules before the deadline."
              />
              <AnnouncementCard
                title="New Practice Dataset Uploaded"
                author={instructorsText}
                time="Yesterday"
                snippet="Please review module 1 practice dataset files prior to Friday's lecture. Office hours are open for questions."
              />
            </div>
          </div>
        </div>

        {/* Collapsible Right Column — Upcoming Assessments */}
        {assessmentsPanelOpen ? (
          <div className="hidden lg:block col-span-4 transition-all duration-300 ease-in-out">
            <div className="rounded-2xl bg-white dark:bg-zinc-900 border border-slate-200/80 dark:border-zinc-800 p-5 sticky top-4 shadow-xs transition-colors">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-bold text-slate-900 dark:text-zinc-50">Upcoming Assessments</h3>
                <button
                  onClick={() => setAssessmentsPanelOpen(false)}
                  className="p-1 text-slate-400 hover:text-slate-600 dark:text-zinc-500 dark:hover:text-zinc-300 transition cursor-pointer rounded-lg hover:bg-slate-100 dark:hover:bg-zinc-800"
                  title="Collapse panel"
                >
                  <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M13 17l5-5-5-5M6 17l5-5-5-5" />
                  </svg>
                </button>
              </div>

              <div className="space-y-2.5">
                {assignments.length > 0 ? (
                  assignments.slice(0, 4).map((asm) => {
                    const due = new Date(asm.dueDate);
                    const diffMs = due - new Date();
                    const isUrgent = diffMs > 0 && diffMs < 86400000;
                    return (
                      <div
                        key={asm.id}
                        className="p-3 rounded-xl bg-slate-50 dark:bg-zinc-800/60 border border-slate-200/60 dark:border-zinc-800/80 transition-colors"
                      >
                        <div className="flex items-center justify-between gap-2">
                          <h4 className="text-xs font-bold text-slate-900 dark:text-zinc-100 truncate">{asm.title}</h4>
                          {isUrgent && <span className="h-2 w-2 rounded-full bg-red-500 animate-pulse shrink-0" />}
                        </div>
                        <p className="text-[10px] text-slate-500 dark:text-zinc-400 mt-1 font-medium">
                          Due:{' '}
                          <span className={isUrgent ? 'text-red-600 dark:text-red-400 font-bold' : 'text-slate-700 dark:text-zinc-300'}>
                            {due.toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                          </span>
                        </p>
                      </div>
                    );
                  })
                ) : (
                  <>
                    <AssessmentPlaceholder title="Assignment 3: ER Diagram" due="Nov 18" />
                    <AssessmentPlaceholder title="Linear Algebra Quiz" due="Nov 20" urgent />
                    <AssessmentPlaceholder title="Web Dev Quiz 1" due="Nov 24" />
                  </>
                )}
              </div>
            </div>
          </div>
        ) : (
          /* Minimized Strip */
          <div className="hidden lg:flex col-span-1 transition-all duration-300 ease-in-out">
            <button
              onClick={() => setAssessmentsPanelOpen(true)}
              className="relative flex w-12 flex-col items-center justify-center gap-2 rounded-2xl bg-white dark:bg-zinc-900 border border-slate-200/80 dark:border-zinc-800 py-6 cursor-pointer hover:bg-slate-50 dark:hover:bg-zinc-800 shadow-xs transition sticky top-4"
              title="Expand Assessments"
            >
              {hasSoonDue && (
                <span className="absolute top-3 right-2 h-2.5 w-2.5 rounded-full bg-red-500 animate-pulse ring-2 ring-white dark:ring-zinc-900" />
              )}
              <svg className="h-4 w-4 text-slate-500 dark:text-zinc-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="4" width="18" height="18" rx="2" />
                <path d="M16 2v4M8 2v4M3 10h18" />
              </svg>
              <span className="text-[9px] font-bold text-slate-500 dark:text-zinc-500 uppercase tracking-wider [writing-mode:vertical-lr]">
                Assessments
              </span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

function AnnouncementCard({ title, author, time, snippet }) {
  return (
    <div className="p-4 rounded-xl bg-slate-50 dark:bg-zinc-800/50 border border-slate-200/60 dark:border-zinc-800/80 transition-colors">
      <div className="flex items-center justify-between gap-4">
        <h4 className="text-xs font-bold text-slate-900 dark:text-zinc-100">{title}</h4>
        <span className="text-[10px] text-slate-400 dark:text-zinc-500 font-medium shrink-0">{time}</span>
      </div>
      <p className="text-[11px] text-slate-600 dark:text-zinc-400 mt-1.5 leading-relaxed">{snippet}</p>
      <p className="text-[10px] text-slate-400 dark:text-zinc-500 mt-2 font-medium">— {author}</p>
    </div>
  );
}

function AssessmentPlaceholder({ title, due, urgent = false }) {
  return (
    <div className="p-3 rounded-xl bg-slate-50 dark:bg-zinc-800/60 border border-slate-200/60 dark:border-zinc-800/80 transition-colors">
      <div className="flex items-center justify-between gap-2">
        <h4 className="text-xs font-bold text-slate-900 dark:text-zinc-100 truncate">{title}</h4>
        {urgent && <span className="h-2 w-2 rounded-full bg-red-500 animate-pulse shrink-0" />}
      </div>
      <p className="text-[10px] text-slate-500 dark:text-zinc-400 mt-1 font-medium">
        Due: <span className={urgent ? 'text-red-600 dark:text-red-400 font-bold' : 'text-slate-700 dark:text-zinc-300'}>{due}</span>
      </p>
    </div>
  );
}

export default OverviewTab;
