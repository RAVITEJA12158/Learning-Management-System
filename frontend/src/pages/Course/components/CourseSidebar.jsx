import React from 'react';

export const SIDEBAR_TABS = [
  { id: 'overview', label: 'Overview', icon: OverviewIcon },
  { id: 'modules', label: 'Modules', icon: ModulesIcon },
  { id: 'assignments', label: 'Assignments', icon: AssignmentsIcon },
  { id: 'quizzes', label: 'Quizzes', icon: QuizzesIcon },
  { id: 'announcements', label: 'Announcements', icon: AnnouncementsIcon },
  { id: 'discussions', label: 'Discussions', icon: DiscussionsIcon },
];

export function CourseSidebar({
  courseCode,
  courseTitle,
  overallCompletionPercent,
  activeTab,
  onSelectTab,
  isEnrolled,
  enrolling,
  onDropCourse,
}) {
  return (
    <aside className="hidden lg:flex w-[250px] shrink-0 flex-col bg-white dark:bg-gray-950 border-r border-slate-200/80 dark:border-white/5 transition-colors duration-200">
      {/* Course Header */}
      <div className="p-5 border-b border-slate-200/80 dark:border-white/5">
        <div className="flex items-center gap-3.5">
          {/* Progress Ring */}
          <div className="relative flex h-11 w-11 shrink-0 items-center justify-center">
            <svg className="h-full w-full -rotate-90" viewBox="0 0 44 44">
              <circle
                cx="22"
                cy="22"
                r="18"
                fill="transparent"
                stroke="currentColor"
                strokeWidth="3"
                className="text-slate-200 dark:text-gray-900 transition-colors"
              />
              <circle
                cx="22"
                cy="22"
                r="18"
                fill="transparent"
                stroke="currentColor"
                strokeWidth="3"
                strokeDasharray={113.1}
                strokeDashoffset={113.1 * (1 - overallCompletionPercent / 100)}
                strokeLinecap="round"
                className="text-blue-600 dark:text-cyan-400 transition-all duration-700"
              />
            </svg>
            <span className="absolute text-[9px] font-black text-slate-900 dark:text-white">
              {overallCompletionPercent}%
            </span>
          </div>
          <div className="min-w-0">
            <p className="text-[10px] font-bold uppercase tracking-wider text-blue-600 dark:text-cyan-400">
              {courseCode}
            </p>
            <h2 className="text-sm font-bold text-slate-900 dark:text-white leading-tight truncate">
              {courseTitle}
            </h2>
          </div>
        </div>
      </div>

      {/* Navigation Pills */}
      <nav className="flex-1 py-3 px-2 space-y-0.5">
        {SIDEBAR_TABS.map((tab) => {
          const isActive = activeTab === tab.id;
          const TabIcon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => onSelectTab(tab.id)}
              className={`relative flex w-full items-center gap-3 rounded-lg px-3.5 py-2.5 text-left text-xs font-semibold transition-all duration-150 cursor-pointer ${
                isActive
                  ? 'bg-blue-50 dark:bg-gradient-to-r dark:from-cyan-500/10 dark:to-transparent text-blue-700 dark:text-cyan-300 border-l-2 border-blue-600 dark:border-cyan-400 pl-3 font-bold shadow-xs'
                  : 'text-slate-600 dark:text-gray-400 hover:bg-slate-100 dark:hover:bg-white/[0.03] hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <TabIcon
                className={`h-4 w-4 shrink-0 transition-colors ${
                  isActive
                    ? 'text-blue-600 dark:text-cyan-400'
                    : 'text-slate-400 dark:text-gray-500'
                }`}
              />
              {tab.label}
            </button>
          );
        })}
      </nav>

      {/* Sidebar Footer */}
      {isEnrolled && (
        <div className="mt-auto border-t border-slate-200/80 dark:border-white/5 p-4">
          <button
            onClick={onDropCourse}
            disabled={enrolling}
            className="w-full text-left text-[11px] font-semibold text-red-600/70 hover:text-red-600 dark:text-rose-400/70 dark:hover:text-rose-400 transition-colors cursor-pointer disabled:opacity-50"
          >
            {enrolling ? 'Processing…' : 'Drop Course'}
          </button>
        </div>
      )}
    </aside>
  );
}

/* ============================================================
   SIDEBAR ICONS (INLINE SVG)
============================================================ */
function OverviewIcon({ className }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="3" width="7" height="7" rx="1" />
      <rect x="14" y="3" width="7" height="7" rx="1" />
      <rect x="3" y="14" width="7" height="7" rx="1" />
      <rect x="14" y="14" width="7" height="7" rx="1" />
    </svg>
  );
}

function ModulesIcon({ className }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 19.5A2.5 2.5 0 016.5 17H20" />
      <path d="M6.5 2H20v20H6.5A2.5 2.5 0 014 19.5v-15A2.5 2.5 0 016.5 2z" />
    </svg>
  );
}

function AssignmentsIcon({ className }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2" />
      <rect x="9" y="3" width="6" height="4" rx="1" />
      <path d="M9 14l2 2 4-4" />
    </svg>
  );
}

function QuizzesIcon({ className }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" />
      <path d="M9.09 9a3 3 0 015.83 1c0 2-3 3-3 3" />
      <line x1="12" y1="17" x2="12.01" y2="17" />
    </svg>
  );
}

function AnnouncementsIcon({ className }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M18 8a6 6 0 00-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9" />
      <path d="M13.73 21a2 2 0 01-3.46 0" />
    </svg>
  );
}

function DiscussionsIcon({ className }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z" />
    </svg>
  );
}

export default CourseSidebar;
