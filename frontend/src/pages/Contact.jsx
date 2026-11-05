import React, { useState } from 'react';
import Badge from '../components/common/Badge';
import Button from '../components/common/Button';

const FAQS = [{
  q: 'How are course completion percentages calculated?',
  a: 'Your completion percentage is automatically calculated from CONTENT_PROGRESS as (completed content items ÷ total published content items) × 100.'
}, {
  q: 'Can I submit an assignment after the due date?',
  a: 'If the instructor has enabled "Allow Late Submissions" on the assignment, you can still upload your file or repository link after the deadline—it will be recorded with a LATE status badge.'
}, {
  q: 'What happens if my timer expires during a fullscreen quiz?',
  a: 'Quiz attempts feature an automatic countdown timer. When time reaches 00:00, your selected answers in QUIZ_ANSWERS are automatically finalized and submitted.'
}, {
  q: 'How is my overall course grade computed?',
  a: 'CourseHub combines your graded Assignment marks and Quiz Attempt scores using the course’s weighted GRADE_COMPONENTS rubric (e.g., Assignments 20%, Quizzes 20%, Mid Exam 25%, Final Exam 30%, Participation 5%).'
}];
function Contact() {
  const [submitted, setSubmitted] = (0, useState)(false);
  const [category, setCategory] = (0, useState)('Technical Issue');
  const [subject, setSubject] = (0, useState)('');
  const [message, setMessage] = (0, useState)('');
  const [tickets, setTickets] = (0, useState)([{
    id: 'TCK-2041',
    subject: 'Cloudinary PDF upload verification in CS401',
    category: 'Course Content',
    status: 'Resolved',
    date: 'Oct 28, 2026'
  }]);
  const handleSubmit = e => {
    e.preventDefault();
    if (!subject.trim() || !message.trim()) return;
    setTickets([{
      id: `TCK-${Math.floor(3000 + Math.random() * 6000)}`,
      subject: subject.trim(),
      category,
      status: 'Open',
      date: 'Just now'
    }, ...tickets]);
    setSubmitted(true);
    setSubject('');
    setMessage('');
  };
  return /*#__PURE__*/React.createElement("main", {
    className: "mx-auto max-w-[1440px] px-5 py-10 sm:px-8 w-full font-sans transition-colors duration-200"
  }, /*#__PURE__*/React.createElement("div", {
    className: "mb-8"
  }, /*#__PURE__*/React.createElement(Badge, {
    variant: "info",
    className: "mb-2"
  }, "Academic Help Desk"), /*#__PURE__*/React.createElement("h1", {
    className: "text-3xl font-black text-slate-900 dark:text-white tracking-tight transition-colors"
  }, "Contact & Support Center"), /*#__PURE__*/React.createElement("p", {
    className: "text-sm text-slate-500 dark:text-gray-400 mt-1 transition-colors"
  }, "Get help with course enrollment, assignment submissions, fullscreen quizzes, or technical issues")), /*#__PURE__*/React.createElement("div", {
    className: "grid grid-cols-1 lg:grid-cols-3 gap-8"
  }, /*#__PURE__*/React.createElement("div", {
    className: "lg:col-span-2 bg-white dark:bg-white/[0.02] backdrop-blur-xl rounded-2xl border border-slate-200/80 dark:border-white/10 p-6 sm:p-8 shadow-xs transition-colors"
  }, submitted ? /*#__PURE__*/React.createElement("div", {
    className: "text-center py-10 space-y-4"
  }, /*#__PURE__*/React.createElement("div", {
    className: "h-14 w-14 bg-emerald-100 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 rounded-full flex items-center justify-center mx-auto text-2xl font-bold border border-emerald-200 dark:border-emerald-500/20"
  }, "\u2713"), /*#__PURE__*/React.createElement("h2", {
    className: "text-xl font-bold text-slate-900 dark:text-white"
  }, "Support Ticket Logged!"), /*#__PURE__*/React.createElement("p", {
    className: "text-sm text-slate-500 dark:text-gray-400 max-w-md mx-auto"
  }, "Thank you for reaching out. Your ticket has been assigned to our academic support team and appears in your ticket tracker."), /*#__PURE__*/React.createElement(Button, {
    onClick: () => setSubmitted(false),
    variant: "outline"
  }, "Submit Another Request")) : /*#__PURE__*/React.createElement("form", {
    onSubmit: handleSubmit,
    className: "space-y-5"
  }, /*#__PURE__*/React.createElement("h2", {
    className: "text-base font-extrabold text-slate-900 dark:text-white border-b border-slate-100 dark:border-white/5 pb-3.5"
  }, "Open a Support Ticket"), /*#__PURE__*/React.createElement("div", {
    className: "grid sm:grid-cols-3 gap-4"
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("label", {
    className: "block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-gray-400 mb-2"
  }, "Category"), /*#__PURE__*/React.createElement("select", {
    value: category,
    onChange: e => setCategory(e.target.value),
    className: "w-full rounded-xl border border-slate-200 dark:border-white/10 bg-white dark:bg-[#030712] px-3.5 py-2.5 text-xs font-bold text-slate-800 dark:text-white outline-none"
  }, /*#__PURE__*/React.createElement("option", {
    value: "Technical Issue"
  }, "Technical Issue"), /*#__PURE__*/React.createElement("option", {
    value: "Course Enrollment"
  }, "Course Enrollment"), /*#__PURE__*/React.createElement("option", {
    value: "Assignment / Grading"
  }, "Assignment / Grading"), /*#__PURE__*/React.createElement("option", {
    value: "Quiz Exam Mode"
  }, "Quiz Exam Mode"), /*#__PURE__*/React.createElement("option", {
    value: "Account & Role Access"
  }, "Account & Role Access"))), /*#__PURE__*/React.createElement("div", {
    className: "sm:col-span-2"
  }, /*#__PURE__*/React.createElement("label", {
    className: "block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-gray-400 mb-2"
  }, "Subject *"), /*#__PURE__*/React.createElement("input", {
    type: "text",
    required: true,
    value: subject,
    onChange: e => setSubject(e.target.value),
    placeholder: "Brief summary of your question or issue...",
    className: "w-full rounded-xl border border-slate-200 dark:border-white/10 bg-white dark:bg-[#030712] px-4 py-2.5 text-sm font-medium text-slate-800 dark:text-white placeholder-slate-400 dark:placeholder-gray-500 focus:ring-2 focus:ring-cyan-500/20 focus:border-cyan-400 outline-none"
  }))), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("label", {
    className: "block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-gray-400 mb-2"
  }, "Detailed Description *"), /*#__PURE__*/React.createElement("textarea", {
    rows: "5",
    required: true,
    value: message,
    onChange: e => setMessage(e.target.value),
    placeholder: "Include course code (e.g. CS401) and any relevant details...",
    className: "w-full rounded-xl border border-slate-200 dark:border-white/10 bg-white dark:bg-[#030712] px-4 py-2.5 text-sm font-medium text-slate-800 dark:text-white placeholder-slate-400 dark:placeholder-gray-500 focus:ring-2 focus:ring-cyan-500/20 focus:border-cyan-400 outline-none"
  })), /*#__PURE__*/React.createElement(Button, {
    type: "submit",
    size: "lg"
  }, "Submit Support Request")), /*#__PURE__*/React.createElement("div", {
    className: "mt-8 pt-6 border-t border-slate-100 dark:border-white/5 space-y-3"
  }, /*#__PURE__*/React.createElement("h3", {
    className: "text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-gray-400"
  }, "Your Recent Support Tickets"), tickets.map(t => /*#__PURE__*/React.createElement("div", {
    key: t.id,
    className: "flex items-center justify-between p-3.5 rounded-xl bg-slate-50 dark:bg-white/[0.02] border border-slate-200/70 dark:border-white/5 text-xs"
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("span", {
    className: "font-mono text-[10px] font-bold text-blue-600 dark:text-cyan-400 mr-2"
  }, t.id), /*#__PURE__*/React.createElement("span", {
    className: "font-bold text-slate-900 dark:text-white"
  }, t.subject), /*#__PURE__*/React.createElement("p", {
    className: "text-[10px] text-slate-500 dark:text-gray-400 mt-0.5"
  }, t.category, " \xB7 ", t.date)), /*#__PURE__*/React.createElement(Badge, {
    variant: t.status === 'Resolved' ? 'active' : 'warning'
  }, t.status))))), /*#__PURE__*/React.createElement("div", {
    className: "bg-white dark:bg-white/[0.02] backdrop-blur-xl rounded-2xl border border-slate-200/80 dark:border-white/10 p-6 shadow-xs space-y-4"
  }, /*#__PURE__*/React.createElement("h2", {
    className: "text-base font-extrabold text-slate-900 dark:text-white border-b border-slate-100 dark:border-white/5 pb-3.5"
  }, "Frequently Asked Questions"), /*#__PURE__*/React.createElement("div", {
    className: "space-y-3"
  }, FAQS.map(item => /*#__PURE__*/React.createElement("div", {
    key: item.q,
    className: "p-4 rounded-xl bg-slate-50 dark:bg-white/[0.02] border border-slate-200/70 dark:border-white/5 space-y-1.5"
  }, /*#__PURE__*/React.createElement("h3", {
    className: "text-xs font-bold text-slate-900 dark:text-white"
  }, item.q), /*#__PURE__*/React.createElement("p", {
    className: "text-[11px] text-slate-600 dark:text-gray-400 leading-relaxed"
  }, item.a)))))));
}
var _default = Contact;

export default _default;
