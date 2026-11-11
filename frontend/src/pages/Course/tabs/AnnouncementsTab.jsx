import React, { useState, useEffect } from 'react';
import { announcementService } from '../../../services/courseService';
import Badge from '../../../components/common/Badge';
import Button from '../../../components/common/Button';

"use strict";

function AnnouncementsTab({
  courseId = 'mock-1',
  instructorsText,
  isCreatorOrStaff
}) {
  const [announcements, setAnnouncements] = useState(() => announcementService.getByCourse(courseId));
  const [isPosting, setIsPosting] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newContent, setNewContent] = useState('');
  const [pinOnPost, setPinOnPost] = useState(false);

  useEffect(() => {
    let isMounted = true;
    announcementService.fetchByCourse(courseId).then(list => {
      if (isMounted && Array.isArray(list)) {
        setAnnouncements(list);
      }
    });
    return () => { isMounted = false; };
  }, [courseId]);

  const updateList = next => {
    setAnnouncements(next);
    announcementService.saveForCourse(courseId, next);
  };

  const handlePost = async e => {
    e.preventDefault();
    if (!newTitle.trim() || !newContent.trim()) return;
    try {
      const created = await announcementService.createAnnouncement(courseId, {
        title: newTitle.trim(),
        message: newContent.trim(),
        content: newContent.trim()
      });
      if (created) {
        setAnnouncements(prev => [created, ...prev.filter(a => a.id !== created.id)]);
      }
    } catch {
      const next = [{
        id: `ann-${Date.now()}`,
        courseId,
        title: newTitle.trim(),
        author: instructorsText || 'Dr. Alan Turing',
        time: 'Just now',
        content: newContent.trim(),
        pinned: pinOnPost
      }, ...announcements];
      updateList(next);
    }
    setNewTitle('');
    setNewContent('');
    setPinOnPost(false);
    setIsPosting(false);
  };

  const handleTogglePin = id => {
    const next = announcements.map(a => a.id === id ? {
      ...a,
      pinned: !a.pinned
    } : a);
    updateList(next);
  };

  const handleDelete = async id => {
    try {
      await announcementService.deleteAnnouncement(id);
    } catch {
      // Fallback
    }
    const next = announcements.filter(a => a.id !== id);
    updateList(next);
  };
  const sortedAnnouncements = [...announcements].sort((a, b) => Number(Boolean(b.pinned)) - Number(Boolean(a.pinned)));
  return /*#__PURE__*/React.createElement("div", {
    className: "p-6 space-y-6"
  }, /*#__PURE__*/React.createElement("div", {
    className: "rounded-2xl bg-white dark:bg-white/[0.02] backdrop-blur-xl border border-slate-200/80 dark:border-white/10 p-6 shadow-xs transition-colors"
  }, /*#__PURE__*/React.createElement("div", {
    className: "flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-5"
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("h2", {
    className: "text-lg font-extrabold text-slate-900 dark:text-white"
  }, "Course Announcements"), /*#__PURE__*/React.createElement("p", {
    className: "text-xs text-slate-500 dark:text-gray-400 mt-0.5"
  }, "Official schedule updates, exam notices, and lecture broadcasts from your instructors.")), isCreatorOrStaff && /*#__PURE__*/React.createElement(Button, {
    onClick: () => setIsPosting(!isPosting),
    variant: isPosting ? 'outline' : 'primary'
  }, isPosting ? 'Cancel' : '+ Post Announcement')), isPosting && /*#__PURE__*/React.createElement("form", {
    onSubmit: handlePost,
    className: "mb-6 p-5 rounded-2xl bg-slate-50 dark:bg-white/[0.03] border border-slate-200/80 dark:border-white/10 space-y-3"
  }, /*#__PURE__*/React.createElement("h3", {
    className: "text-xs font-bold uppercase tracking-wider text-blue-600 dark:text-cyan-400"
  }, "Publish New Announcement"), /*#__PURE__*/React.createElement("input", {
    type: "text",
    required: true,
    placeholder: "Announcement Title",
    value: newTitle,
    onChange: e => setNewTitle(e.target.value),
    className: "w-full rounded-xl border border-slate-200 dark:border-white/10 bg-white dark:bg-[#030712] px-3.5 py-2.5 text-xs font-medium text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-gray-500 focus:border-cyan-400 focus:outline-none"
  }), /*#__PURE__*/React.createElement("textarea", {
    rows: 3,
    required: true,
    placeholder: "Announcement message...",
    value: newContent,
    onChange: e => setNewContent(e.target.value),
    className: "w-full rounded-xl border border-slate-200 dark:border-white/10 bg-white dark:bg-[#030712] p-3.5 text-xs font-medium text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-gray-500 focus:border-cyan-400 focus:outline-none"
  }), /*#__PURE__*/React.createElement("div", {
    className: "flex items-center justify-between pt-1"
  }, /*#__PURE__*/React.createElement("label", {
    className: "flex items-center gap-2 text-xs font-semibold text-slate-600 dark:text-gray-300 cursor-pointer"
  }, /*#__PURE__*/React.createElement("input", {
    type: "checkbox",
    checked: pinOnPost,
    onChange: e => setPinOnPost(e.target.checked),
    className: "rounded accent-blue-600"
  }), "Pin to top of announcements"), /*#__PURE__*/React.createElement("div", {
    className: "flex gap-2"
  }, /*#__PURE__*/React.createElement(Button, {
    type: "button",
    variant: "outline",
    size: "sm",
    onClick: () => setIsPosting(false)
  }, "Cancel"), /*#__PURE__*/React.createElement(Button, {
    type: "submit",
    size: "sm"
  }, "Publish")))), /*#__PURE__*/React.createElement("div", {
    className: "space-y-4"
  }, sortedAnnouncements.map(item => /*#__PURE__*/React.createElement("div", {
    key: item.id,
    className: "p-5 rounded-2xl bg-slate-50 dark:bg-white/[0.02] border border-slate-200/70 dark:border-white/5 space-y-2 transition-all hover:dark:border-white/15"
  }, /*#__PURE__*/React.createElement("div", {
    className: "flex items-center justify-between gap-3"
  }, /*#__PURE__*/React.createElement("div", {
    className: "flex items-center gap-2"
  }, item.pinned && /*#__PURE__*/React.createElement(Badge, {
    variant: "warning"
  }, "\uD83D\uDCCC Pinned"), /*#__PURE__*/React.createElement("h3", {
    className: "text-sm font-bold text-slate-900 dark:text-white"
  }, item.title)), /*#__PURE__*/React.createElement("div", {
    className: "flex items-center gap-3 shrink-0"
  }, /*#__PURE__*/React.createElement("span", {
    className: "text-[10px] text-slate-400 dark:text-gray-500 font-medium"
  }, item.time), isCreatorOrStaff && /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("button", {
    onClick: () => handleTogglePin(item.id),
    className: "text-[11px] font-bold text-blue-600 dark:text-cyan-400 hover:underline cursor-pointer"
  }, item.pinned ? 'Unpin' : 'Pin'), /*#__PURE__*/React.createElement("button", {
    onClick: () => handleDelete(item.id),
    className: "text-[11px] font-bold text-red-500 hover:underline cursor-pointer"
  }, "Delete")))), /*#__PURE__*/React.createElement("p", {
    className: "text-xs leading-relaxed text-slate-600 dark:text-gray-300"
  }, item.content), /*#__PURE__*/React.createElement("p", {
    className: "text-[11px] font-medium text-slate-400 dark:text-gray-500 pt-1"
  }, "Posted by ", /*#__PURE__*/React.createElement("span", {
    className: "font-semibold text-slate-700 dark:text-gray-200"
  }, item.author)))))));
}
var _default = AnnouncementsTab;

export { AnnouncementsTab };

export default _default;
