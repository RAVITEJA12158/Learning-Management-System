import React from 'react';

"use strict";

const SIDEBAR_TABS = [{
  id: 'overview',
  label: 'Overview',
  icon: OverviewIcon
}, {
  id: 'modules',
  label: 'Modules & Content',
  icon: ModulesIcon
}, {
  id: 'assignments',
  label: 'Assignments',
  icon: AssignmentsIcon
}, {
  id: 'quizzes',
  label: 'Timed Quizzes',
  icon: QuizzesIcon
}, {
  id: 'attendance',
  label: 'Attendance',
  icon: AttendanceIcon
}, {
  id: 'grades',
  label: 'Grades & Rubric',
  icon: GradesIcon
}, {
  id: 'discussions',
  label: 'Discussions',
  icon: DiscussionsIcon
}, {
  id: 'announcements',
  label: 'Announcements',
  icon: AnnouncementsIcon
}, {
  id: 'roster',
  label: 'People & Roster',
  icon: RosterIcon
}];
function CourseSidebar({
  courseCode,
  courseTitle,
  overallCompletionPercent,
  activeTab,
  onSelectTab,
  isEnrolled,
  enrolling,
  onDropCourse
}) {
  return /*#__PURE__*/React.createElement("aside", {
    className: "hidden lg:flex w-[250px] shrink-0 flex-col bg-white dark:bg-gray-950 border-r border-slate-200/80 dark:border-white/5 transition-colors duration-200"
  }, /*#__PURE__*/React.createElement("div", {
    className: "p-5 border-b border-slate-200/80 dark:border-white/5"
  }, /*#__PURE__*/React.createElement("div", {
    className: "flex items-center gap-3.5"
  }, /*#__PURE__*/React.createElement("div", {
    className: "relative flex h-11 w-11 shrink-0 items-center justify-center"
  }, /*#__PURE__*/React.createElement("svg", {
    className: "h-full w-full -rotate-90",
    viewBox: "0 0 44 44"
  }, /*#__PURE__*/React.createElement("circle", {
    cx: "22",
    cy: "22",
    r: "18",
    fill: "transparent",
    stroke: "currentColor",
    strokeWidth: "3",
    className: "text-slate-200 dark:text-gray-900 transition-colors"
  }), /*#__PURE__*/React.createElement("circle", {
    cx: "22",
    cy: "22",
    r: "18",
    fill: "transparent",
    stroke: "currentColor",
    strokeWidth: "3",
    strokeDasharray: 113.1,
    strokeDashoffset: 113.1 * (1 - overallCompletionPercent / 100),
    strokeLinecap: "round",
    className: "text-blue-600 dark:text-cyan-400 transition-all duration-700"
  })), /*#__PURE__*/React.createElement("span", {
    className: "absolute text-[9px] font-black text-slate-900 dark:text-white"
  }, overallCompletionPercent, "%")), /*#__PURE__*/React.createElement("div", {
    className: "min-w-0"
  }, /*#__PURE__*/React.createElement("p", {
    className: "text-[10px] font-bold uppercase tracking-wider text-blue-600 dark:text-cyan-400"
  }, courseCode), /*#__PURE__*/React.createElement("h2", {
    className: "text-sm font-bold text-slate-900 dark:text-white leading-tight truncate"
  }, courseTitle)))), /*#__PURE__*/React.createElement("nav", {
    className: "flex-1 py-3 px-2 space-y-0.5"
  }, SIDEBAR_TABS.map(tab => {
    const isActive = activeTab === tab.id;
    const TabIcon = tab.icon;
    return /*#__PURE__*/React.createElement("button", {
      key: tab.id,
      onClick: () => onSelectTab(tab.id),
      className: `relative flex w-full items-center gap-3 rounded-lg px-3.5 py-2.5 text-left text-xs font-semibold transition-all duration-150 cursor-pointer ${isActive ? 'bg-blue-50 dark:bg-gradient-to-r dark:from-cyan-500/10 dark:to-transparent text-blue-700 dark:text-cyan-300 border-l-2 border-blue-600 dark:border-cyan-400 pl-3 font-bold shadow-xs' : 'text-slate-600 dark:text-gray-400 hover:bg-slate-100 dark:hover:bg-white/[0.03] hover:text-slate-900 dark:hover:text-white'}`
    }, /*#__PURE__*/React.createElement(TabIcon, {
      className: `h-4 w-4 shrink-0 transition-colors ${isActive ? 'text-blue-600 dark:text-cyan-400' : 'text-slate-400 dark:text-gray-500'}`
    }), tab.label);
  })), isEnrolled && /*#__PURE__*/React.createElement("div", {
    className: "mt-auto border-t border-slate-200/80 dark:border-white/5 p-4"
  }, /*#__PURE__*/React.createElement("button", {
    onClick: onDropCourse,
    disabled: enrolling,
    className: "w-full text-left text-[11px] font-semibold text-red-600/70 hover:text-red-600 dark:text-rose-400/70 dark:hover:text-rose-400 transition-colors cursor-pointer disabled:opacity-50"
  }, enrolling ? 'Processing…' : 'Drop Course')));
}

/* ============================================================
   SIDEBAR ICONS (INLINE SVG)
============================================================ */
function OverviewIcon({
  className
}) {
  return /*#__PURE__*/React.createElement("svg", {
    className: className,
    fill: "none",
    stroke: "currentColor",
    viewBox: "0 0 24 24",
    strokeWidth: "2",
    strokeLinecap: "round",
    strokeLinejoin: "round"
  }, /*#__PURE__*/React.createElement("rect", {
    x: "3",
    y: "3",
    width: "7",
    height: "7",
    rx: "1"
  }), /*#__PURE__*/React.createElement("rect", {
    x: "14",
    y: "3",
    width: "7",
    height: "7",
    rx: "1"
  }), /*#__PURE__*/React.createElement("rect", {
    x: "3",
    y: "14",
    width: "7",
    height: "7",
    rx: "1"
  }), /*#__PURE__*/React.createElement("rect", {
    x: "14",
    y: "14",
    width: "7",
    height: "7",
    rx: "1"
  }));
}
function ModulesIcon({
  className
}) {
  return /*#__PURE__*/React.createElement("svg", {
    className: className,
    fill: "none",
    stroke: "currentColor",
    viewBox: "0 0 24 24",
    strokeWidth: "2",
    strokeLinecap: "round",
    strokeLinejoin: "round"
  }, /*#__PURE__*/React.createElement("path", {
    d: "M4 19.5A2.5 2.5 0 016.5 17H20"
  }), /*#__PURE__*/React.createElement("path", {
    d: "M6.5 2H20v20H6.5A2.5 2.5 0 014 19.5v-15A2.5 2.5 0 016.5 2z"
  }));
}
function AssignmentsIcon({
  className
}) {
  return /*#__PURE__*/React.createElement("svg", {
    className: className,
    fill: "none",
    stroke: "currentColor",
    viewBox: "0 0 24 24",
    strokeWidth: "2",
    strokeLinecap: "round",
    strokeLinejoin: "round"
  }, /*#__PURE__*/React.createElement("path", {
    d: "M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2"
  }), /*#__PURE__*/React.createElement("rect", {
    x: "9",
    y: "3",
    width: "6",
    height: "4",
    rx: "1"
  }), /*#__PURE__*/React.createElement("path", {
    d: "M9 14l2 2 4-4"
  }));
}
function QuizzesIcon({
  className
}) {
  return /*#__PURE__*/React.createElement("svg", {
    className: className,
    fill: "none",
    stroke: "currentColor",
    viewBox: "0 0 24 24",
    strokeWidth: "2",
    strokeLinecap: "round",
    strokeLinejoin: "round"
  }, /*#__PURE__*/React.createElement("circle", {
    cx: "12",
    cy: "12",
    r: "10"
  }), /*#__PURE__*/React.createElement("path", {
    d: "M9.09 9a3 3 0 015.83 1c0 2-3 3-3 3"
  }), /*#__PURE__*/React.createElement("line", {
    x1: "12",
    y1: "17",
    x2: "12.01",
    y2: "17"
  }));
}
function AttendanceIcon({
  className
}) {
  return /*#__PURE__*/React.createElement("svg", {
    className: className,
    fill: "none",
    stroke: "currentColor",
    viewBox: "0 0 24 24",
    strokeWidth: "2",
    strokeLinecap: "round",
    strokeLinejoin: "round"
  }, /*#__PURE__*/React.createElement("rect", {
    x: "3",
    y: "4",
    width: "18",
    height: "18",
    rx: "2"
  }), /*#__PURE__*/React.createElement("line", {
    x1: "16",
    y1: "2",
    x2: "16",
    y2: "6"
  }), /*#__PURE__*/React.createElement("line", {
    x1: "8",
    y1: "2",
    x2: "8",
    y2: "6"
  }), /*#__PURE__*/React.createElement("line", {
    x1: "3",
    y1: "10",
    x2: "21",
    y2: "10"
  }));
}
function GradesIcon({
  className
}) {
  return /*#__PURE__*/React.createElement("svg", {
    className: className,
    fill: "none",
    stroke: "currentColor",
    viewBox: "0 0 24 24",
    strokeWidth: "2",
    strokeLinecap: "round",
    strokeLinejoin: "round"
  }, /*#__PURE__*/React.createElement("line", {
    x1: "18",
    y1: "20",
    x2: "18",
    y2: "10"
  }), /*#__PURE__*/React.createElement("line", {
    x1: "12",
    y1: "20",
    x2: "12",
    y2: "4"
  }), /*#__PURE__*/React.createElement("line", {
    x1: "6",
    y1: "20",
    x2: "6",
    y2: "14"
  }));
}
function AnnouncementsIcon({
  className
}) {
  return /*#__PURE__*/React.createElement("svg", {
    className: className,
    fill: "none",
    stroke: "currentColor",
    viewBox: "0 0 24 24",
    strokeWidth: "2",
    strokeLinecap: "round",
    strokeLinejoin: "round"
  }, /*#__PURE__*/React.createElement("path", {
    d: "M18 8a6 6 0 00-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9"
  }), /*#__PURE__*/React.createElement("path", {
    d: "M13.73 21a2 2 0 01-3.46 0"
  }));
}
function DiscussionsIcon({
  className
}) {
  return /*#__PURE__*/React.createElement("svg", {
    className: className,
    fill: "none",
    stroke: "currentColor",
    viewBox: "0 0 24 24",
    strokeWidth: "2",
    strokeLinecap: "round",
    strokeLinejoin: "round"
  }, /*#__PURE__*/React.createElement("path", {
    d: "M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z"
  }));
}
function RosterIcon({
  className
}) {
  return /*#__PURE__*/React.createElement("svg", {
    className: className,
    fill: "none",
    stroke: "currentColor",
    viewBox: "0 0 24 24",
    strokeWidth: "2",
    strokeLinecap: "round",
    strokeLinejoin: "round"
  }, /*#__PURE__*/React.createElement("path", {
    d: "M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"
  }), /*#__PURE__*/React.createElement("circle", {
    cx: "9",
    cy: "7",
    r: "4"
  }), /*#__PURE__*/React.createElement("path", {
    d: "M23 21v-2a4 4 0 0 0-3-3.87"
  }), /*#__PURE__*/React.createElement("path", {
    d: "M16 3.13a4 4 0 0 1 0 7.75"
  }));
}
var _default = CourseSidebar;

export { CourseSidebar, SIDEBAR_TABS };

export default _default;
