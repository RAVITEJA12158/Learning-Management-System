import React, { useState, useEffect } from 'react';
import { discussionService } from '../../../services/courseService';
import Badge from '../../../components/common/Badge';
import Button from '../../../components/common/Button';

"use strict";

function DiscussionsTab({
  courseId,
  isCreatorOrStaff = false,
  user
}) {
  const [threads, setThreads] = useState([]);
  const [expandedThreadId, setExpandedThreadId] = useState(null);
  const [isStartingThread, setIsStartingThread] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  const [replyTextMap, setReplyTextMap] = useState({});

  useEffect(() => {
    let isMounted = true;
    discussionService.fetchByCourse(courseId).then(list => {
      if (isMounted && Array.isArray(list)) {
        setThreads(list);
        if (list.length > 0) {
          setExpandedThreadId(prev => list.some(t => t.id === prev) ? prev : list[0].id);
        }
      }
    });
    return () => { isMounted = false; };
  }, [courseId]);

  const updateThreads = next => {
    setThreads(next);
    discussionService.saveForCourse(courseId, next);
  };

  const handleCreateThread = async e => {
    e.preventDefault();
    if (!title.trim() || !body.trim()) return;
    try {
      const created = await discussionService.createThread(courseId, {
        title: title.trim(),
        content: body.trim()
      });
      if (created) {
        setThreads(prev => [created, ...prev.filter(t => t.id !== created.id)]);
        setExpandedThreadId(created.id);
      }
    } catch {
      const newThread = {
        id: `thread-${Date.now()}`,
        courseId,
        title: title.trim(),
        author: user?.name || 'Sarah Jensen',
        authorRole: isCreatorOrStaff ? 'Instructor' : 'Student',
        time: 'Just now',
        pinned: false,
        resolved: false,
        likes: 1,
        likedByMe: true,
        content: body.trim(),
        replies: []
      };
      updateThreads([newThread, ...threads]);
      setExpandedThreadId(newThread.id);
    }
    setTitle('');
    setBody('');
    setIsStartingThread(false);
  };

  const handleAddReply = async (threadId, e) => {
    e.preventDefault();
    const content = (replyTextMap[threadId] || '').trim();
    if (!content) return;
    try {
      const newReply = await discussionService.createReply(threadId, content);
      const next = threads.map(t => t.id === threadId ? {
        ...t,
        replies: [...(t.replies || []), newReply]
      } : t);
      updateThreads(next);
    } catch {
      const newReply = {
        id: `rep-${Date.now()}`,
        author: user?.name || 'Sarah Jensen',
        authorRole: isCreatorOrStaff ? 'Instructor' : 'Student',
        time: 'Just now',
        content
      };
      const next = threads.map(t => t.id === threadId ? {
        ...t,
        replies: [...(t.replies || []), newReply]
      } : t);
      updateThreads(next);
    }
    setReplyTextMap(prev => ({
      ...prev,
      [threadId]: ''
    }));
  };
  const handleToggleLike = (threadId, e) => {
    e.stopPropagation();
    const next = threads.map(t => {
      if (t.id !== threadId) return t;
      const liked = !t.likedByMe;
      return {
        ...t,
        likedByMe: liked,
        likes: Math.max(0, (t.likes || 0) + (liked ? 1 : -1))
      };
    });
    updateThreads(next);
  };
  const handleToggleResolved = (threadId, e) => {
    e.stopPropagation();
    const next = threads.map(t => t.id === threadId ? {
      ...t,
      resolved: !t.resolved
    } : t);
    updateThreads(next);
  };
  const handleTogglePin = (threadId, e) => {
    e.stopPropagation();
    const next = threads.map(t => t.id === threadId ? {
      ...t,
      pinned: !t.pinned
    } : t);
    updateThreads(next);
  };
  const filteredThreads = threads.filter(t => {
    const q = searchQuery.toLowerCase().trim();
    if (!q) return true;
    return t.title.toLowerCase().includes(q) || t.content.toLowerCase().includes(q) || t.author.toLowerCase().includes(q);
  });
  return /*#__PURE__*/React.createElement("div", {
    className: "p-6 space-y-6"
  }, /*#__PURE__*/React.createElement("div", {
    className: "rounded-2xl bg-white dark:bg-white/[0.02] backdrop-blur-xl border border-slate-200/80 dark:border-white/10 p-6 shadow-xs transition-colors"
  }, /*#__PURE__*/React.createElement("div", {
    className: "flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-5"
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("h2", {
    className: "text-lg font-extrabold text-slate-900 dark:text-white"
  }, "Class Discussion Forum"), /*#__PURE__*/React.createElement("p", {
    className: "text-xs text-slate-500 dark:text-gray-400 mt-0.5"
  }, "Ask questions, collaborate on problem sets, and view verified instructor replies (DISCUSSIONS & DISCUSSION_REPLIES).")), /*#__PURE__*/React.createElement(Button, {
    onClick: () => setIsStartingThread(!isStartingThread),
    variant: isStartingThread ? 'outline' : 'primary'
  }, isStartingThread ? 'Cancel' : '+ New Discussion Thread')), /*#__PURE__*/React.createElement("div", {
    className: "mb-5"
  }, /*#__PURE__*/React.createElement("input", {
    type: "text",
    placeholder: "Search discussion threads by topic, question, or author...",
    value: searchQuery,
    onChange: e => setSearchQuery(e.target.value),
    className: "w-full rounded-xl border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-white/[0.02] px-4 py-2.5 text-xs font-medium text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-gray-500 focus:border-cyan-400 outline-none transition"
  })), isStartingThread && /*#__PURE__*/React.createElement("form", {
    onSubmit: handleCreateThread,
    className: "mb-6 p-5 rounded-2xl bg-slate-50 dark:bg-white/[0.03] border border-slate-200/80 dark:border-white/10 space-y-3"
  }, /*#__PURE__*/React.createElement("h3", {
    className: "text-xs font-bold uppercase tracking-wider text-blue-600 dark:text-cyan-400"
  }, "Start a New Discussion Thread"), /*#__PURE__*/React.createElement("input", {
    type: "text",
    required: true,
    placeholder: "Thread Title or Question (e.g. Clarification on SVD Eigenvalue Derivation)",
    value: title,
    onChange: e => setTitle(e.target.value),
    className: "w-full rounded-xl border border-slate-200 dark:border-white/10 bg-white dark:bg-[#030712] px-3.5 py-2.5 text-xs font-medium text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-gray-500 focus:border-cyan-400 focus:outline-none"
  }), /*#__PURE__*/React.createElement("textarea", {
    rows: 3,
    required: true,
    placeholder: "Write your question or discussion prompt in detail...",
    value: body,
    onChange: e => setBody(e.target.value),
    className: "w-full rounded-xl border border-slate-200 dark:border-white/10 bg-white dark:bg-[#030712] p-3.5 text-xs font-medium text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-gray-500 focus:border-cyan-400 focus:outline-none"
  }), /*#__PURE__*/React.createElement("div", {
    className: "flex justify-end gap-2"
  }, /*#__PURE__*/React.createElement(Button, {
    type: "button",
    variant: "outline",
    size: "sm",
    onClick: () => setIsStartingThread(false)
  }, "Cancel"), /*#__PURE__*/React.createElement(Button, {
    type: "submit",
    size: "sm"
  }, "Post Thread"))), /*#__PURE__*/React.createElement("div", {
    className: "space-y-4"
  }, filteredThreads.map(t => {
    const isExpanded = expandedThreadId === t.id;
    const repliesList = Array.isArray(t.replies) ? t.replies : [];
    return /*#__PURE__*/React.createElement("div", {
      key: t.id,
      className: "rounded-2xl bg-slate-50/80 dark:bg-white/[0.02] border border-slate-200/70 dark:border-white/10 overflow-hidden transition-all"
    }, /*#__PURE__*/React.createElement("div", {
      onClick: () => setExpandedThreadId(isExpanded ? null : t.id),
      className: "p-5 cursor-pointer hover:bg-slate-100/60 dark:hover:bg-white/[0.03] transition"
    }, /*#__PURE__*/React.createElement("div", {
      className: "flex flex-wrap items-center justify-between gap-2 mb-2"
    }, /*#__PURE__*/React.createElement("div", {
      className: "flex flex-wrap items-center gap-2"
    }, t.pinned && /*#__PURE__*/React.createElement(Badge, {
      variant: "warning"
    }, "\uD83D\uDCCC Pinned"), t.resolved && /*#__PURE__*/React.createElement(Badge, {
      variant: "active"
    }, "\u2713 Resolved"), /*#__PURE__*/React.createElement("h3", {
      className: "text-sm font-bold text-slate-900 dark:text-white"
    }, t.title)), /*#__PURE__*/React.createElement("span", {
      className: "text-[10px] text-slate-400 dark:text-gray-500 font-medium"
    }, t.time)), /*#__PURE__*/React.createElement("p", {
      className: "text-xs text-slate-600 dark:text-gray-300 leading-relaxed"
    }, t.content), /*#__PURE__*/React.createElement("div", {
      className: "flex flex-wrap items-center justify-between gap-3 mt-4 pt-3 border-t border-slate-200/60 dark:border-white/5 text-[11px]"
    }, /*#__PURE__*/React.createElement("div", {
      className: "flex items-center gap-2"
    }, /*#__PURE__*/React.createElement("span", {
      className: "font-bold text-slate-800 dark:text-gray-200"
    }, t.author), /*#__PURE__*/React.createElement(Badge, {
      variant: t.authorRole === 'Instructor' ? 'info' : 'neutral'
    }, t.authorRole)), /*#__PURE__*/React.createElement("div", {
      className: "flex items-center gap-3"
    }, isCreatorOrStaff && /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("button", {
      type: "button",
      onClick: e => handleTogglePin(t.id, e),
      className: "text-[11px] font-bold text-amber-600 dark:text-amber-400 hover:underline cursor-pointer"
    }, t.pinned ? 'Unpin' : 'Pin'), /*#__PURE__*/React.createElement("button", {
      type: "button",
      onClick: e => handleToggleResolved(t.id, e),
      className: "text-[11px] font-bold text-emerald-600 dark:text-emerald-400 hover:underline cursor-pointer"
    }, t.resolved ? 'Reopen' : 'Mark Resolved')), /*#__PURE__*/React.createElement("button", {
      type: "button",
      onClick: e => handleToggleLike(t.id, e),
      className: `px-2.5 py-1 rounded-lg border text-xs font-bold transition cursor-pointer ${t.likedByMe ? 'border-blue-400 bg-blue-50 dark:bg-cyan-950/50 text-blue-600 dark:text-cyan-300' : 'border-slate-200 dark:border-white/10 text-slate-600 dark:text-gray-400'}`
    }, "\uD83D\uDC4D ", t.likes || 0), /*#__PURE__*/React.createElement("span", {
      className: "font-bold text-blue-600 dark:text-cyan-400"
    }, "\uD83D\uDCAC ", repliesList.length, " ", repliesList.length === 1 ? 'Reply' : 'Replies', " ", isExpanded ? '▲' : '▼')))), isExpanded && /*#__PURE__*/React.createElement("div", {
      className: "border-t border-slate-200/80 dark:border-white/10 bg-white dark:bg-[#030712]/60 p-5 space-y-4"
    }, /*#__PURE__*/React.createElement("h4", {
      className: "text-[11px] font-bold uppercase tracking-wider text-slate-400 dark:text-gray-500"
    }, "Thread Replies (", repliesList.length, ")"), repliesList.length > 0 ? /*#__PURE__*/React.createElement("div", {
      className: "space-y-3"
    }, repliesList.map(rep => /*#__PURE__*/React.createElement("div", {
      key: rep.id,
      className: "p-3.5 rounded-xl bg-slate-50 dark:bg-white/[0.02] border border-slate-200/60 dark:border-white/5 space-y-1.5"
    }, /*#__PURE__*/React.createElement("div", {
      className: "flex items-center justify-between"
    }, /*#__PURE__*/React.createElement("div", {
      className: "flex items-center gap-2"
    }, /*#__PURE__*/React.createElement("span", {
      className: "text-xs font-bold text-slate-900 dark:text-white"
    }, rep.author), /*#__PURE__*/React.createElement(Badge, {
      variant: rep.authorRole === 'Instructor' ? 'info' : 'neutral'
    }, rep.authorRole)), /*#__PURE__*/React.createElement("span", {
      className: "text-[10px] text-slate-400 dark:text-gray-500"
    }, rep.time)), /*#__PURE__*/React.createElement("p", {
      className: "text-xs text-slate-700 dark:text-gray-300 leading-relaxed"
    }, rep.content)))) : /*#__PURE__*/React.createElement("p", {
      className: "text-xs text-slate-400 dark:text-gray-500 italic"
    }, "No replies yet. Be the first to respond below!"), /*#__PURE__*/React.createElement("form", {
      onSubmit: e => handleAddReply(t.id, e),
      className: "flex gap-2.5 pt-2"
    }, /*#__PURE__*/React.createElement("input", {
      type: "text",
      placeholder: "Write a reply to this thread...",
      value: replyTextMap[t.id] || '',
      onChange: e => setReplyTextMap(prev => ({
        ...prev,
        [t.id]: e.target.value
      })),
      className: "flex-1 rounded-xl border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-white/[0.03] px-3.5 py-2 text-xs font-medium text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-gray-500 focus:border-cyan-400 outline-none"
    }), /*#__PURE__*/React.createElement(Button, {
      type: "submit",
      size: "sm"
    }, "Reply"))));
  }))));
}
var _default = DiscussionsTab;

export { DiscussionsTab };

export default _default;
