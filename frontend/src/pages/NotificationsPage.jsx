import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { notificationService } from '../services/courseService';
import Badge from '../components/common/Badge';
import Button from '../components/common/Button';
import { BellIcon } from '../components/common/Icons';

"use strict";

function NotificationsPage() {
  const navigate = (0, useNavigate)();
  const [notifications, setNotifications] = (0, useState)(() => notificationService.getAll());
  const [filter, setFilter] = (0, useState)('ALL'); // 'ALL' | 'UNREAD' | 'GRADE' | 'ASSIGNMENT' | 'ANNOUNCEMENT'

  const handleMarkAsRead = id => {
    setNotifications(notificationService.markAsRead(id));
  };
  const handleMarkAllRead = () => {
    setNotifications(notificationService.markAllAsRead());
  };
  const handleDelete = (id, e) => {
    e.stopPropagation();
    setNotifications(notificationService.delete(id));
  };
  const filtered = notifications.filter(n => {
    if (filter === 'UNREAD') return !n.isRead;
    if (filter !== 'ALL') return n.type === filter;
    return true;
  });
  const unreadCount = notifications.filter(n => !n.isRead).length;
  return /*#__PURE__*/React.createElement("main", {
    className: "mx-auto max-w-[1440px] px-4 py-8 sm:px-8 lg:py-10 w-full font-sans transition-colors duration-200"
  }, /*#__PURE__*/React.createElement("div", {
    className: "mb-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement(Badge, {
    variant: "info",
    className: "mb-2"
  }, "Real-Time Academic Alerts (NOTIFICATIONS)"), /*#__PURE__*/React.createElement("h1", {
    className: "text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight"
  }, "Notification Center"), /*#__PURE__*/React.createElement("p", {
    className: "text-xs sm:text-sm text-slate-500 dark:text-gray-400 mt-1"
  }, "Stay updated on published grades, upcoming assignment deadlines, announcements, and discussion replies.")), unreadCount > 0 && /*#__PURE__*/React.createElement(Button, {
    variant: "outline",
    onClick: handleMarkAllRead
  }, "\u2713 Mark All (", unreadCount, ") as Read")), /*#__PURE__*/React.createElement("div", {
    className: "flex flex-wrap items-center gap-2 mb-6"
  }, [{
    id: 'ALL',
    label: `All (${notifications.length})`
  }, {
    id: 'UNREAD',
    label: `Unread (${unreadCount})`
  }, {
    id: 'GRADE',
    label: 'Grades'
  }, {
    id: 'ASSIGNMENT',
    label: 'Assignments'
  }, {
    id: 'ANNOUNCEMENT',
    label: 'Announcements'
  }, {
    id: 'ATTENDANCE',
    label: 'Attendance'
  }].map(f => /*#__PURE__*/React.createElement("button", {
    key: f.id,
    onClick: () => setFilter(f.id),
    className: `px-3.5 py-2 rounded-xl text-xs font-bold transition cursor-pointer ${filter === f.id ? 'bg-[#0066FF] text-white shadow-[0_0_15px_rgba(0,102,255,0.4)]' : 'bg-white dark:bg-white/[0.03] text-slate-600 dark:text-gray-400 border border-slate-200/80 dark:border-white/10'}`
  }, f.label))), /*#__PURE__*/React.createElement("div", {
    className: "bg-white dark:bg-white/[0.02] backdrop-blur-xl rounded-2xl border border-slate-200/80 dark:border-white/10 divide-y divide-slate-100 dark:divide-white/5 overflow-hidden shadow-xs"
  }, filtered.length > 0 ? filtered.map(n => /*#__PURE__*/React.createElement("div", {
    key: n.id,
    onClick: () => {
      handleMarkAsRead(n.id);
      if (n.courseId) navigate(`/courses/${n.courseId}`);
    },
    className: `p-5 flex items-start justify-between gap-4 hover:bg-slate-50/80 dark:hover:bg-white/[0.03] transition cursor-pointer ${!n.isRead ? 'bg-blue-50/30 dark:bg-cyan-950/15' : ''}`
  }, /*#__PURE__*/React.createElement("div", {
    className: "flex items-start gap-3.5"
  }, /*#__PURE__*/React.createElement("div", {
    className: "p-2.5 rounded-xl bg-blue-50 dark:bg-cyan-950/50 text-blue-600 dark:text-cyan-400 shrink-0 mt-0.5"
  }, /*#__PURE__*/React.createElement(BellIcon, {
    className: "w-4 h-4"
  })), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    className: "flex flex-wrap items-center gap-2"
  }, !n.isRead && /*#__PURE__*/React.createElement("span", {
    className: "h-2 w-2 rounded-full bg-blue-600 dark:bg-cyan-400"
  }), /*#__PURE__*/React.createElement(Badge, {
    variant: n.type === 'GRADE' ? 'active' : 'info'
  }, n.type), /*#__PURE__*/React.createElement("h3", {
    className: "text-sm font-bold text-slate-900 dark:text-white"
  }, n.title)), /*#__PURE__*/React.createElement("p", {
    className: "text-xs text-slate-600 dark:text-gray-300 mt-1.5 leading-relaxed"
  }, n.message), /*#__PURE__*/React.createElement("p", {
    className: "text-[11px] font-medium text-slate-400 dark:text-gray-500 mt-2"
  }, n.createdAt))), /*#__PURE__*/React.createElement("div", {
    className: "flex items-center gap-3 shrink-0"
  }, !n.isRead && /*#__PURE__*/React.createElement("button", {
    onClick: e => {
      e.stopPropagation();
      handleMarkAsRead(n.id);
    },
    className: "text-xs font-bold text-blue-600 dark:text-cyan-400 hover:underline cursor-pointer"
  }, "Mark read"), /*#__PURE__*/React.createElement("button", {
    onClick: e => handleDelete(n.id, e),
    className: "text-xs text-slate-400 hover:text-red-500 px-2 py-1 rounded cursor-pointer",
    title: "Dismiss notification"
  }, "\u2715")))) : /*#__PURE__*/React.createElement("div", {
    className: "p-12 text-center text-xs font-bold text-slate-400 dark:text-gray-500"
  }, "No notifications match this filter.")));
}
var _default = NotificationsPage;

export default _default;
