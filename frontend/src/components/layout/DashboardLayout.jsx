import React, { useState, useRef, useEffect } from 'react';
import { useNavigate, useLocation, Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import { notificationService } from '../../services/courseService';
import BrandMark from '../common/BrandMark';
import Footer from './Footer';
import { SearchIcon, SunIcon, MoonIcon, BellIcon, ChevronDownIcon, BookIcon, ClipboardCheckIcon, ChartIcon, CalendarIcon, UserIcon, CogIcon, MailIcon, LogoutIcon } from '../common/Icons';

function DashboardLayout() {
  const navigate = (0, useNavigate)();
  const location = (0, useLocation)();
  const {
    user,
    logout,
    isAuthenticated,
    updateUser
  } = (0, useAuth)();
  const {
    isDark,
    toggleTheme
  } = (0, useTheme)();
  const [profileOpen, setProfileOpen] = (0, useState)(false);
  const [notifOpen, setNotifOpen] = (0, useState)(false);
  const [menuOpen, setMenuOpen] = (0, useState)(false);
  const [searchQuery, setSearchQuery] = (0, useState)('');
  const [notifications, setNotifications] = (0, useState)(() => notificationService.getAll());
  const dropdownRef = (0, useRef)(null);
  const notifRef = (0, useRef)(null);
  (0, useEffect)(() => {
    setNotifications(notificationService.getAll());
  }, [location.pathname]);

  // Close dropdowns when clicking outside
  (0, useEffect)(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setProfileOpen(false);
      }
      if (notifRef.current && !notifRef.current.contains(event.target)) {
        setNotifOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);
  if (!isAuthenticated) {
    return /*#__PURE__*/React.createElement(Navigate, {
      to: "/login",
      replace: true
    });
  }
  const handleLogout = () => {
    setProfileOpen(false);
    logout();
    navigate('/');
  };
  const getDashboardPath = roleOverride => {
    const role = (roleOverride || user?.role || 'student').toLowerCase();
    if (role === 'student') return '/student';
    if (role === 'faculty') return '/faculty';
    if (role === 'admin') return '/admin';
    return '/student';
  };
  const handleQuickRoleSwitch = newRole => {
    const defaultProfiles = {
      student: {
        name: 'Sarah Jensen',
        email: 'sarah.jensen@university.edu',
        role: 'student'
      },
      faculty: {
        name: 'Dr. Alan Turing',
        email: 'alan.turing@university.edu',
        role: 'faculty'
      },
      admin: {
        name: 'Dean Robert Vance',
        email: 'admin@university.edu',
        role: 'admin'
      }
    };
    updateUser(defaultProfiles[newRole] || {
      role: newRole
    });
    setProfileOpen(false);
    navigate(getDashboardPath(newRole));
  };
  const handleSearchSubmit = e => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/courses?search=${encodeURIComponent(searchQuery.trim())}`);
    } else {
      navigate('/courses');
    }
  };
  const handleMarkAllRead = () => {
    const updated = notificationService.markAllAsRead();
    setNotifications(updated);
  };
  const handleNotifClick = notif => {
    const updated = notificationService.markAsRead(notif.id);
    setNotifications(updated);
    setNotifOpen(false);
    if (notif.courseId) {
      navigate(`/courses/${notif.courseId}`);
    } else {
      navigate('/notifications');
    }
  };
  const unreadCount = notifications.filter(n => !n.isRead).length;
  const navItems = [{
    label: user?.role === 'admin' ? 'Admin Center' : user?.role === 'faculty' ? 'Faculty Hub' : 'My Courses',
    path: getDashboardPath(),
    active: location.pathname.startsWith('/student') || location.pathname.startsWith('/faculty') || location.pathname.startsWith('/admin')
  }, {
    label: 'Catalog',
    path: '/courses',
    active: location.pathname.startsWith('/courses')
  }, {
    label: 'Assessments',
    path: '/assignments',
    active: location.pathname.startsWith('/assignments')
  }, {
    label: 'Grades & Progress',
    path: '/grades',
    active: location.pathname.startsWith('/grades')
  }, {
    label: 'Attendance',
    path: '/attendance',
    active: location.pathname.startsWith('/attendance')
  }];
  return /*#__PURE__*/React.createElement("div", {
    className: "min-h-screen overflow-x-hidden bg-[#F3F6FA] dark:bg-[#030712] text-slate-900 dark:text-white flex flex-col font-sans transition-colors duration-200"
  }, /*#__PURE__*/React.createElement("header", {
    className: "sticky top-0 z-40 border-b border-slate-200/80 dark:border-white/5 bg-white/95 dark:bg-gray-950/75 backdrop-blur-xl shadow-xs dark:shadow-md dark:shadow-black/30 transition-colors duration-200"
  }, /*#__PURE__*/React.createElement("div", {
    className: "mx-auto flex h-[72px] max-w-[1440px] items-center justify-between px-4 sm:px-8"
  }, /*#__PURE__*/React.createElement("div", {
    className: "flex items-center gap-7"
  }, /*#__PURE__*/React.createElement("button", {
    onClick: () => navigate('/'),
    className: "hub-lift flex items-center gap-3 cursor-pointer"
  }, /*#__PURE__*/React.createElement(BrandMark, {
    dark: isDark
  }), /*#__PURE__*/React.createElement("span", {
    className: "text-lg font-black tracking-[-.06em] text-[#151515] dark:text-white transition-colors"
  }, "CourseHub")), /*#__PURE__*/React.createElement("nav", {
    className: "hidden items-center gap-5 lg:flex"
  }, navItems.map(item => /*#__PURE__*/React.createElement("button", {
    key: item.path,
    onClick: () => navigate(item.path),
    className: `relative py-1 text-xs font-semibold transition cursor-pointer flex flex-col items-center ${item.active ? 'text-blue-600 dark:text-cyan-400 font-bold' : 'text-slate-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-white'}`
  }, /*#__PURE__*/React.createElement("span", null, item.label), item.active && /*#__PURE__*/React.createElement("span", {
    className: "absolute -bottom-1.5 h-1 w-4 rounded-full bg-blue-600 dark:bg-cyan-400 dark:shadow-[0_0_8px_rgba(34,211,238,0.9)]"
  }))))), /*#__PURE__*/React.createElement("div", {
    className: "hidden items-center gap-3 sm:flex"
  }, /*#__PURE__*/React.createElement("form", {
    onSubmit: handleSearchSubmit,
    className: "relative"
  }, /*#__PURE__*/React.createElement("span", {
    className: "absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400 dark:text-gray-500"
  }, /*#__PURE__*/React.createElement(SearchIcon, {
    className: "w-4 h-4"
  })), /*#__PURE__*/React.createElement("input", {
    type: "text",
    placeholder: "Search courses...",
    value: searchQuery,
    onChange: e => setSearchQuery(e.target.value),
    className: "pl-9 pr-4 py-2 w-36 xl:w-52 bg-slate-100/80 dark:bg-white/[0.03] border border-slate-200/60 dark:border-white/10 rounded-full text-xs font-medium text-slate-800 dark:text-white placeholder-slate-400 dark:placeholder-gray-500 focus:bg-white dark:focus:bg-white/[0.06] focus:outline-none focus:ring-2 focus:ring-blue-500/20 dark:focus:ring-cyan-500/20 focus:border-blue-500 dark:focus:border-cyan-500/60 transition"
  })), /*#__PURE__*/React.createElement("button", {
    onClick: toggleTheme,
    className: "p-2.5 text-slate-600 dark:text-gray-300 bg-slate-100/70 dark:bg-white/[0.03] border border-slate-200/60 dark:border-white/10 rounded-full hover:bg-slate-200/70 dark:hover:bg-white/[0.08] transition cursor-pointer",
    title: isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode',
    "aria-label": "Toggle Theme"
  }, isDark ? /*#__PURE__*/React.createElement(SunIcon, {
    className: "w-4 h-4 text-amber-400"
  }) : /*#__PURE__*/React.createElement(MoonIcon, {
    className: "w-4 h-4 text-slate-600"
  })), /*#__PURE__*/React.createElement("div", {
    className: "relative",
    ref: notifRef
  }, /*#__PURE__*/React.createElement("button", {
    onClick: () => setNotifOpen(!notifOpen),
    className: "relative p-2.5 text-slate-600 dark:text-gray-300 bg-slate-100/70 dark:bg-white/[0.03] border border-slate-200/60 dark:border-white/10 rounded-full hover:bg-slate-200/70 dark:hover:bg-white/[0.08] transition cursor-pointer",
    "aria-label": "Notifications"
  }, /*#__PURE__*/React.createElement(BellIcon, {
    className: "w-4 h-4"
  }), unreadCount > 0 && /*#__PURE__*/React.createElement("span", {
    className: "absolute -top-0.5 -right-0.5 h-4 min-w-[16px] px-1 bg-blue-600 dark:bg-cyan-500 rounded-full text-[9px] font-extrabold text-white dark:text-gray-950 flex items-center justify-center border-2 border-white dark:border-gray-950 shadow-xs"
  }, unreadCount)), notifOpen && /*#__PURE__*/React.createElement("div", {
    className: "absolute right-0 mt-2 w-80 sm:w-96 rounded-2xl bg-white dark:bg-gray-950/95 dark:backdrop-blur-xl border border-slate-200/90 dark:border-white/10 shadow-xl dark:shadow-2xl dark:shadow-black/80 py-2 z-50"
  }, /*#__PURE__*/React.createElement("div", {
    className: "px-4 py-3 border-b border-slate-100 dark:border-white/5 flex items-center justify-between"
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("p", {
    className: "text-xs font-extrabold text-slate-900 dark:text-white"
  }, "Notifications"), /*#__PURE__*/React.createElement("p", {
    className: "text-[10px] text-slate-500 dark:text-gray-400"
  }, unreadCount, " unread updates")), unreadCount > 0 && /*#__PURE__*/React.createElement("button", {
    onClick: handleMarkAllRead,
    className: "text-[11px] font-bold text-blue-600 dark:text-cyan-400 hover:underline cursor-pointer"
  }, "Mark all read")), /*#__PURE__*/React.createElement("div", {
    className: "max-h-80 overflow-y-auto divide-y divide-slate-100 dark:divide-white/5"
  }, notifications.slice(0, 5).map(notif => /*#__PURE__*/React.createElement("button", {
    key: notif.id,
    onClick: () => handleNotifClick(notif),
    className: `w-full text-left px-4 py-3 hover:bg-slate-50 dark:hover:bg-white/[0.04] transition flex items-start gap-3 cursor-pointer ${!notif.isRead ? 'bg-blue-50/40 dark:bg-cyan-950/20' : ''}`
  }, /*#__PURE__*/React.createElement("span", {
    className: `mt-1 h-2 w-2 rounded-full shrink-0 ${!notif.isRead ? 'bg-blue-600 dark:bg-cyan-400' : 'bg-slate-300 dark:bg-gray-700'}`
  }), /*#__PURE__*/React.createElement("div", {
    className: "min-w-0 flex-1"
  }, /*#__PURE__*/React.createElement("div", {
    className: "flex items-center justify-between gap-2"
  }, /*#__PURE__*/React.createElement("p", {
    className: "text-xs font-bold text-slate-900 dark:text-white truncate"
  }, notif.title), /*#__PURE__*/React.createElement("span", {
    className: "text-[10px] text-slate-400 dark:text-gray-500 shrink-0"
  }, notif.createdAt)), /*#__PURE__*/React.createElement("p", {
    className: "text-[11px] text-slate-500 dark:text-gray-400 line-clamp-2 mt-0.5"
  }, notif.message))))), /*#__PURE__*/React.createElement("div", {
    className: "pt-2 px-4 pb-1 border-t border-slate-100 dark:border-white/5"
  }, /*#__PURE__*/React.createElement("button", {
    onClick: () => {
      setNotifOpen(false);
      navigate('/notifications');
    },
    className: "w-full py-2 text-center text-xs font-bold text-blue-600 dark:text-cyan-400 hover:bg-slate-50 dark:hover:bg-white/[0.04] rounded-xl transition cursor-pointer"
  }, "View All Notifications \u2192")))), /*#__PURE__*/React.createElement("div", {
    className: "relative",
    ref: dropdownRef
  }, /*#__PURE__*/React.createElement("button", {
    onClick: () => setProfileOpen(!profileOpen),
    className: "flex items-center gap-2.5 p-1 pr-2 rounded-full hover:bg-slate-100 dark:hover:bg-white/[0.04] transition cursor-pointer"
  }, /*#__PURE__*/React.createElement("div", {
    className: "relative p-[1.5px] rounded-full dark:bg-gradient-to-r dark:from-cyan-400 dark:via-blue-500 dark:to-purple-600 dark:animate-spin-ring"
  }, user?.profileImage ? /*#__PURE__*/React.createElement("img", {
    src: user.profileImage,
    alt: user?.name || 'User Avatar',
    className: "h-8 w-8 rounded-full object-cover border border-slate-200 dark:border-transparent bg-gray-950"
  }) : /*#__PURE__*/React.createElement("span", {
    className: "h-8 w-8 rounded-full bg-gradient-to-tr from-cyan-500 to-purple-600 text-white flex items-center justify-center text-xs font-black select-none"
  }, user?.name ? user.name.trim().charAt(0).toUpperCase() : 'U')), /*#__PURE__*/React.createElement("span", {
    className: "text-xs font-bold text-slate-800 dark:text-white"
  }, user?.name || 'User'), /*#__PURE__*/React.createElement(ChevronDownIcon, {
    className: `w-3.5 h-3.5 text-slate-500 dark:text-gray-400 transition-transform ${profileOpen ? 'rotate-180' : ''}`
  })), profileOpen && /*#__PURE__*/React.createElement("div", {
    className: "absolute right-0 mt-2 w-64 rounded-2xl bg-white dark:bg-gray-950/95 dark:backdrop-blur-xl border border-slate-200/90 dark:border-white/10 shadow-xl dark:shadow-2xl dark:shadow-black/70 py-2 z-50"
  }, /*#__PURE__*/React.createElement("div", {
    className: "px-4 py-3 border-b border-slate-100 dark:border-white/5"
  }, /*#__PURE__*/React.createElement("p", {
    className: "text-xs font-bold text-slate-900 dark:text-white"
  }, user?.name || 'Sarah Jensen'), /*#__PURE__*/React.createElement("p", {
    className: "text-[11px] text-slate-500 dark:text-gray-400 truncate"
  }, user?.email || 'sarah.jensen@university.edu'), /*#__PURE__*/React.createElement("span", {
    className: "mt-1.5 inline-block text-[10px] font-extrabold uppercase tracking-wider px-2 py-0.5 rounded-md bg-blue-50 dark:bg-purple-950/50 text-blue-600 dark:text-cyan-400 border border-blue-200 dark:border-purple-800/40"
  }, user?.role || 'Student')), /*#__PURE__*/React.createElement("div", {
    className: "px-4 py-2.5 border-b border-slate-100 dark:border-white/5"
  }, /*#__PURE__*/React.createElement("p", {
    className: "text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-gray-500 mb-1.5"
  }, "Switch Role View"), /*#__PURE__*/React.createElement("div", {
    className: "grid grid-cols-3 gap-1"
  }, ['student', 'faculty', 'admin'].map(r => {
    const isActiveRole = (user?.role || 'student').toLowerCase() === r;
    return /*#__PURE__*/React.createElement("button", {
      key: r,
      onClick: () => handleQuickRoleSwitch(r),
      className: `py-1 rounded-lg text-[10px] font-bold capitalize transition cursor-pointer ${isActiveRole ? 'bg-blue-600 dark:bg-cyan-500 text-white dark:text-gray-950' : 'bg-slate-100 dark:bg-white/5 text-slate-600 dark:text-gray-400 hover:bg-slate-200 dark:hover:bg-white/10'}`
    }, r);
  }))), /*#__PURE__*/React.createElement("div", {
    className: "py-1"
  }, /*#__PURE__*/React.createElement("button", {
    onClick: () => {
      setProfileOpen(false);
      navigate(getDashboardPath());
    },
    className: "w-full text-left px-4 py-2 text-xs font-semibold text-slate-700 dark:text-gray-300 hover:bg-slate-50 dark:hover:bg-white/[0.04] hover:text-blue-600 dark:hover:text-cyan-400 flex items-center gap-2.5 transition cursor-pointer"
  }, /*#__PURE__*/React.createElement(BookIcon, {
    className: "w-4 h-4 text-slate-400 dark:text-gray-500"
  }), "My Workspace"), /*#__PURE__*/React.createElement("button", {
    onClick: () => {
      setProfileOpen(false);
      navigate('/assignments');
    },
    className: "w-full text-left px-4 py-2 text-xs font-semibold text-slate-700 dark:text-gray-300 hover:bg-slate-50 dark:hover:bg-white/[0.04] hover:text-blue-600 dark:hover:text-cyan-400 flex items-center gap-2.5 transition cursor-pointer"
  }, /*#__PURE__*/React.createElement(ClipboardCheckIcon, {
    className: "w-4 h-4 text-slate-400 dark:text-gray-500"
  }), "Assessments & Quizzes"), /*#__PURE__*/React.createElement("button", {
    onClick: () => {
      setProfileOpen(false);
      navigate('/grades');
    },
    className: "w-full text-left px-4 py-2 text-xs font-semibold text-slate-700 dark:text-gray-300 hover:bg-slate-50 dark:hover:bg-white/[0.04] hover:text-blue-600 dark:hover:text-cyan-400 flex items-center gap-2.5 transition cursor-pointer"
  }, /*#__PURE__*/React.createElement(ChartIcon, {
    className: "w-4 h-4 text-slate-400 dark:text-gray-500"
  }), "Grades & Transcript"), /*#__PURE__*/React.createElement("button", {
    onClick: () => {
      setProfileOpen(false);
      navigate('/attendance');
    },
    className: "w-full text-left px-4 py-2 text-xs font-semibold text-slate-700 dark:text-gray-300 hover:bg-slate-50 dark:hover:bg-white/[0.04] hover:text-blue-600 dark:hover:text-cyan-400 flex items-center gap-2.5 transition cursor-pointer"
  }, /*#__PURE__*/React.createElement(CalendarIcon, {
    className: "w-4 h-4 text-slate-400 dark:text-gray-500"
  }), "Attendance Tracker"), /*#__PURE__*/React.createElement("button", {
    onClick: () => {
      setProfileOpen(false);
      navigate('/notifications');
    },
    className: "w-full text-left px-4 py-2 text-xs font-semibold text-slate-700 dark:text-gray-300 hover:bg-slate-50 dark:hover:bg-white/[0.04] hover:text-blue-600 dark:hover:text-cyan-400 flex items-center gap-2.5 transition cursor-pointer"
  }, /*#__PURE__*/React.createElement(BellIcon, {
    className: "w-4 h-4 text-slate-400 dark:text-gray-500"
  }), "Notification Center"), /*#__PURE__*/React.createElement("button", {
    onClick: () => {
      setProfileOpen(false);
      navigate('/profile');
    },
    className: "w-full text-left px-4 py-2 text-xs font-semibold text-slate-700 dark:text-gray-300 hover:bg-slate-50 dark:hover:bg-white/[0.04] hover:text-blue-600 dark:hover:text-cyan-400 flex items-center gap-2.5 transition cursor-pointer"
  }, /*#__PURE__*/React.createElement(UserIcon, {
    className: "w-4 h-4 text-slate-400 dark:text-gray-500"
  }), "Profile"), /*#__PURE__*/React.createElement("button", {
    onClick: () => {
      setProfileOpen(false);
      navigate('/settings');
    },
    className: "w-full text-left px-4 py-2 text-xs font-semibold text-slate-700 dark:text-gray-300 hover:bg-slate-50 dark:hover:bg-white/[0.04] hover:text-blue-600 dark:hover:text-cyan-400 flex items-center gap-2.5 transition cursor-pointer"
  }, /*#__PURE__*/React.createElement(CogIcon, {
    className: "w-4 h-4 text-slate-400 dark:text-gray-500"
  }), "Settings"), /*#__PURE__*/React.createElement("button", {
    onClick: () => {
      setProfileOpen(false);
      navigate('/contact');
    },
    className: "w-full text-left px-4 py-2 text-xs font-semibold text-slate-700 dark:text-gray-300 hover:bg-slate-50 dark:hover:bg-white/[0.04] hover:text-blue-600 dark:hover:text-cyan-400 flex items-center gap-2.5 transition cursor-pointer"
  }, /*#__PURE__*/React.createElement(MailIcon, {
    className: "w-4 h-4 text-slate-400 dark:text-gray-500"
  }), "Contact Support")), /*#__PURE__*/React.createElement("div", {
    className: "pt-1 border-t border-slate-100 dark:border-white/5"
  }, /*#__PURE__*/React.createElement("button", {
    onClick: handleLogout,
    className: "w-full text-left px-4 py-2.5 text-xs font-bold text-red-600 dark:text-rose-400 hover:bg-red-50 dark:hover:bg-rose-950/30 flex items-center gap-2.5 transition cursor-pointer"
  }, /*#__PURE__*/React.createElement(LogoutIcon, {
    className: "w-4 h-4 text-red-500 dark:text-rose-400"
  }), "Sign out"))))), /*#__PURE__*/React.createElement("div", {
    className: "flex items-center gap-2 sm:hidden"
  }, /*#__PURE__*/React.createElement("button", {
    onClick: toggleTheme,
    className: "p-2 text-slate-600 dark:text-slate-300 rounded-full border border-slate-200 dark:border-slate-700 cursor-pointer"
  }, isDark ? /*#__PURE__*/React.createElement(SunIcon, {
    className: "w-4 h-4 text-amber-400"
  }) : /*#__PURE__*/React.createElement(MoonIcon, {
    className: "w-4 h-4 text-slate-600"
  })), /*#__PURE__*/React.createElement("button", {
    onClick: () => setMenuOpen(!menuOpen),
    className: "rounded-full border border-slate-200 dark:border-slate-700 p-2 text-slate-700 dark:text-slate-200 cursor-pointer"
  }, /*#__PURE__*/React.createElement("span", {
    className: "block h-0.5 w-4 bg-current mb-1"
  }), /*#__PURE__*/React.createElement("span", {
    className: "block h-0.5 w-4 bg-current mb-1"
  }), /*#__PURE__*/React.createElement("span", {
    className: "block h-0.5 w-4 bg-current"
  })))), menuOpen && /*#__PURE__*/React.createElement("div", {
    className: "border-t border-slate-200 dark:border-white/10 bg-white dark:bg-[#030712] px-5 py-4 sm:hidden space-y-3"
  }, /*#__PURE__*/React.createElement("div", {
    className: "grid gap-1"
  }, navItems.map(item => /*#__PURE__*/React.createElement("button", {
    key: item.path,
    onClick: () => {
      setMenuOpen(false);
      navigate(item.path);
    },
    className: "rounded-xl px-3 py-2 text-left text-xs font-bold hover:bg-slate-50 dark:hover:bg-white/5 text-slate-900 dark:text-white"
  }, item.label)), /*#__PURE__*/React.createElement("button", {
    onClick: () => {
      setMenuOpen(false);
      navigate('/notifications');
    },
    className: "rounded-xl px-3 py-2 text-left text-xs font-bold hover:bg-slate-50 dark:hover:bg-white/5 text-slate-900 dark:text-white"
  }, "Notifications (", unreadCount, ")"), /*#__PURE__*/React.createElement("button", {
    onClick: () => {
      setMenuOpen(false);
      navigate('/profile');
    },
    className: "rounded-xl px-3 py-2 text-left text-xs font-bold hover:bg-slate-50 dark:hover:bg-white/5 text-slate-900 dark:text-white"
  }, "Profile"), /*#__PURE__*/React.createElement("button", {
    onClick: () => {
      setMenuOpen(false);
      navigate('/settings');
    },
    className: "rounded-xl px-3 py-2 text-left text-xs font-bold hover:bg-slate-50 dark:hover:bg-white/5 text-slate-900 dark:text-white"
  }, "Settings"), /*#__PURE__*/React.createElement("button", {
    onClick: () => {
      setMenuOpen(false);
      navigate('/contact');
    },
    className: "rounded-xl px-3 py-2 text-left text-xs font-bold hover:bg-slate-50 dark:hover:bg-white/5 text-slate-900 dark:text-white"
  }, "Contact Support")), /*#__PURE__*/React.createElement("div", {
    className: "pt-3 border-t border-slate-100 dark:border-white/10"
  }, /*#__PURE__*/React.createElement("button", {
    onClick: handleLogout,
    className: "w-full rounded-xl border border-red-200 dark:border-red-900/50 bg-red-50 dark:bg-red-950/30 py-2.5 text-xs font-bold text-red-600 dark:text-red-400"
  }, "Sign out")))), /*#__PURE__*/React.createElement("div", {
    className: "flex-1"
  }, /*#__PURE__*/React.createElement(Outlet, null)), /*#__PURE__*/React.createElement(Footer, null));
}
var _default = DashboardLayout;

export default _default;
