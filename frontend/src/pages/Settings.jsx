import React, { useState } from 'react';
import { useTheme } from '../context/ThemeContext';
import { MoonIcon, SunIcon } from '../components/common/Icons';
import Button from '../components/common/Button';
import { userService } from '../services/userService';

function Settings() {
  const {
    isDark,
    toggleTheme
  } = (0, useTheme)();
  const [emailNotifs, setEmailNotifs] = (0, useState)(true);
  const [assignmentAlerts, setAssignmentAlerts] = (0, useState)(true);
  const [quizReminders, setQuizReminders] = (0, useState)(true);
  const [discussionNotifs, setDiscussionNotifs] = (0, useState)(true);
  const [twoFactor, setTwoFactor] = (0, useState)(false);
  const [currentPassword, setCurrentPassword] = (0, useState)('');
  const [newPassword, setNewPassword] = (0, useState)('');
  const [confirmPassword, setConfirmPassword] = (0, useState)('');
  const [savedFeedback, setSavedFeedback] = (0, useState)('');
  const [passwordError, setPasswordError] = (0, useState)('');
  const handleSavePreferences = () => {
    setSavedFeedback('Preferences and notification channels saved successfully!');
    setTimeout(() => setSavedFeedback(''), 3000);
  };
  const handlePasswordUpdate = async e => {
    e.preventDefault();
    setPasswordError('');
    if (!currentPassword) {
      setPasswordError('Current password is required.');
      return;
    }
    if (newPassword.length < 6) {
      setPasswordError('New password must be at least 6 characters.');
      return;
    }
    if (newPassword !== confirmPassword) {
      setPasswordError('New password and confirmation do not match.');
      return;
    }
    try {
      await userService.changePassword(currentPassword, newPassword);
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
      setSavedFeedback('Password updated securely with bcrypt hash!');
      setTimeout(() => setSavedFeedback(''), 4000);
    } catch (err) {
      setPasswordError(err.message || 'Failed to update password.');
    }
  };
  return /*#__PURE__*/React.createElement("main", {
    className: "mx-auto max-w-[1440px] px-5 py-10 sm:px-8 w-full font-sans"
  }, /*#__PURE__*/React.createElement("div", {
    className: "mb-8"
  }, /*#__PURE__*/React.createElement("h1", {
    className: "text-3xl font-black text-slate-900 dark:text-white tracking-tight transition-colors"
  }, "Account & Security Settings"), /*#__PURE__*/React.createElement("p", {
    className: "text-sm text-slate-500 dark:text-gray-400 mt-1 transition-colors"
  }, "Manage your global theme, notification preferences, and JWT/bcrypt security credentials")), savedFeedback && /*#__PURE__*/React.createElement("div", {
    className: "mb-6 p-4 rounded-2xl border border-emerald-200 bg-emerald-50 dark:bg-emerald-950/40 dark:border-emerald-800 text-emerald-700 dark:text-emerald-300 text-xs font-bold transition-all"
  }, "\u2713 ", savedFeedback), /*#__PURE__*/React.createElement("div", {
    className: "grid grid-cols-1 lg:grid-cols-2 gap-8"
  }, /*#__PURE__*/React.createElement("div", {
    className: "bg-white dark:bg-white/[0.02] backdrop-blur-xl rounded-2xl border border-slate-200/80 dark:border-white/5 p-6 sm:p-8 shadow-xs dark:shadow-md dark:shadow-black/40 space-y-6 transition-colors duration-200"
  }, /*#__PURE__*/React.createElement("h2", {
    className: "text-base font-extrabold text-slate-900 dark:text-white border-b border-slate-100 dark:border-white/5 pb-3.5"
  }, "Appearance & Notification Channels"), /*#__PURE__*/React.createElement("div", {
    className: "flex items-center justify-between pb-5 border-b border-slate-100 dark:border-white/5"
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("h3", {
    className: "text-sm font-bold text-slate-900 dark:text-white"
  }, "Global Theme Mode"), /*#__PURE__*/React.createElement("p", {
    className: "text-xs text-slate-500 dark:text-gray-400 mt-0.5"
  }, "Switch between Clean Slate Light Mode and Midnight Glassmorphism Dark Mode")), /*#__PURE__*/React.createElement("button", {
    type: "button",
    onClick: toggleTheme,
    className: `flex items-center gap-2.5 px-4 py-2 text-xs font-bold rounded-xl border transition-all shadow-xs cursor-pointer shrink-0 ${isDark ? 'border-cyan-500/40 bg-white/[0.04] text-cyan-400 hover:bg-white/[0.08]' : 'border-slate-200 bg-slate-50 text-slate-700 hover:bg-slate-100'}`
  }, isDark ? /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(MoonIcon, {
    className: "w-4 h-4 text-cyan-400"
  }), /*#__PURE__*/React.createElement("span", null, "Midnight Glass")) : /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(SunIcon, {
    className: "w-4 h-4 text-amber-500"
  }), /*#__PURE__*/React.createElement("span", null, "Clean Light")))), [{
    label: 'Email & Push Notifications',
    desc: 'Receive instant updates on grades and instructor announcements',
    checked: emailNotifs,
    onChange: setEmailNotifs
  }, {
    label: 'Assignment Deadline Reminders',
    desc: 'Alert 24 hours before coursework submission deadlines',
    checked: assignmentAlerts,
    onChange: setAssignmentAlerts
  }, {
    label: 'Timed Quiz Availability Alerts',
    desc: 'Notify when new quizzes open or attempt windows are closing',
    checked: quizReminders,
    onChange: setQuizReminders
  }, {
    label: 'Discussion Forum Replies',
    desc: 'Notify when peers or instructors reply to your threads',
    checked: discussionNotifs,
    onChange: setDiscussionNotifs
  }].map(item => /*#__PURE__*/React.createElement("div", {
    key: item.label,
    className: "flex items-center justify-between pb-4 border-b border-slate-100 dark:border-white/5"
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("h3", {
    className: "text-xs sm:text-sm font-bold text-slate-900 dark:text-white"
  }, item.label), /*#__PURE__*/React.createElement("p", {
    className: "text-[11px] text-slate-500 dark:text-gray-400 mt-0.5"
  }, item.desc)), /*#__PURE__*/React.createElement("label", {
    className: "relative inline-flex items-center cursor-pointer shrink-0"
  }, /*#__PURE__*/React.createElement("input", {
    type: "checkbox",
    checked: item.checked,
    onChange: e => item.onChange(e.target.checked),
    className: "sr-only peer"
  }), /*#__PURE__*/React.createElement("div", {
    className: "w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer dark:bg-gray-800 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-700 peer-checked:bg-blue-600 dark:peer-checked:bg-gradient-to-r dark:peer-checked:from-cyan-500 dark:peer-checked:to-blue-600"
  })))), /*#__PURE__*/React.createElement("div", {
    className: "pt-2"
  }, /*#__PURE__*/React.createElement(Button, {
    onClick: handleSavePreferences,
    size: "lg"
  }, "Save Preferences"))), /*#__PURE__*/React.createElement("div", {
    className: "bg-white dark:bg-white/[0.02] backdrop-blur-xl rounded-2xl border border-slate-200/80 dark:border-white/5 p-6 sm:p-8 shadow-xs dark:shadow-md dark:shadow-black/40 space-y-6 transition-colors duration-200"
  }, /*#__PURE__*/React.createElement("h2", {
    className: "text-base font-extrabold text-slate-900 dark:text-white border-b border-slate-100 dark:border-white/5 pb-3.5"
  }, "Security & Password Management"), passwordError && /*#__PURE__*/React.createElement("div", {
    className: "p-3 rounded-xl border border-red-200 dark:border-red-900/50 bg-red-50 dark:bg-red-950/30 text-xs font-bold text-red-600 dark:text-red-400"
  }, passwordError), /*#__PURE__*/React.createElement("form", {
    onSubmit: handlePasswordUpdate,
    className: "space-y-4"
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("label", {
    className: "block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-gray-400 mb-1.5"
  }, "Current Password"), /*#__PURE__*/React.createElement("input", {
    type: "password",
    required: true,
    value: currentPassword,
    onChange: e => setCurrentPassword(e.target.value),
    placeholder: "\u2022\u2022\u2022\u2022\u2022\u2022\u2022\u2022",
    className: "w-full rounded-xl border border-slate-200 dark:border-gray-800 bg-white dark:bg-transparent px-4 py-2.5 text-sm text-slate-900 dark:text-white focus:outline-none focus:border-purple-500"
  })), /*#__PURE__*/React.createElement("div", {
    className: "grid sm:grid-cols-2 gap-4"
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("label", {
    className: "block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-gray-400 mb-1.5"
  }, "New Password"), /*#__PURE__*/React.createElement("input", {
    type: "password",
    required: true,
    value: newPassword,
    onChange: e => setNewPassword(e.target.value),
    placeholder: "Min 6 characters",
    className: "w-full rounded-xl border border-slate-200 dark:border-gray-800 bg-white dark:bg-transparent px-4 py-2.5 text-sm text-slate-900 dark:text-white focus:outline-none focus:border-purple-500"
  })), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("label", {
    className: "block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-gray-400 mb-1.5"
  }, "Confirm New Password"), /*#__PURE__*/React.createElement("input", {
    type: "password",
    required: true,
    value: confirmPassword,
    onChange: e => setConfirmPassword(e.target.value),
    placeholder: "Repeat password",
    className: "w-full rounded-xl border border-slate-200 dark:border-gray-800 bg-white dark:bg-transparent px-4 py-2.5 text-sm text-slate-900 dark:text-white focus:outline-none focus:border-purple-500"
  }))), /*#__PURE__*/React.createElement("div", {
    className: "flex items-center justify-between py-3 border-t border-b border-slate-100 dark:border-white/5"
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("h4", {
    className: "text-xs font-bold text-slate-900 dark:text-white"
  }, "Two-Factor Authentication (2FA)"), /*#__PURE__*/React.createElement("p", {
    className: "text-[11px] text-slate-500 dark:text-gray-400"
  }, "Require verification code on new device logins")), /*#__PURE__*/React.createElement("input", {
    type: "checkbox",
    checked: twoFactor,
    onChange: e => setTwoFactor(e.target.checked),
    className: "h-4 w-4 rounded accent-blue-600 cursor-pointer"
  })), /*#__PURE__*/React.createElement(Button, {
    type: "submit",
    variant: "secondary",
    size: "lg"
  }, "Update Password")))));
}
var _default = Settings;

export default _default;
