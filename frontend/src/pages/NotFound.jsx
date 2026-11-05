import React from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '../components/common/Button';

"use strict";

function NotFound() {
  const navigate = (0, useNavigate)();
  return /*#__PURE__*/React.createElement("main", {
    className: "mx-auto max-w-[1440px] px-4 py-20 sm:px-8 w-full flex flex-col items-center justify-center text-center font-sans"
  }, /*#__PURE__*/React.createElement("div", {
    className: "bg-white dark:bg-white/[0.02] backdrop-blur-xl rounded-3xl border border-slate-200/80 dark:border-white/10 p-10 sm:p-14 max-w-lg w-full shadow-xs"
  }, /*#__PURE__*/React.createElement("span", {
    className: "inline-block px-3 py-1 rounded-full bg-blue-50 dark:bg-cyan-950/60 text-blue-600 dark:text-cyan-400 text-xs font-black uppercase tracking-wider"
  }, "404 \xB7 Page Not Found"), /*#__PURE__*/React.createElement("h1", {
    className: "mt-4 text-3xl sm:text-4xl font-black text-slate-900 dark:text-white tracking-tight"
  }, "Lost in the stacks?"), /*#__PURE__*/React.createElement("p", {
    className: "mt-2 text-xs sm:text-sm text-slate-500 dark:text-gray-400 leading-relaxed"
  }, "The page or course resource you are looking for doesn't exist or has been moved."), /*#__PURE__*/React.createElement("div", {
    className: "mt-6 flex flex-wrap items-center justify-center gap-3"
  }, /*#__PURE__*/React.createElement(Button, {
    onClick: () => navigate('/')
  }, "Return Home"), /*#__PURE__*/React.createElement(Button, {
    variant: "outline",
    onClick: () => navigate('/courses')
  }, "Browse Course Catalog"))));
}
var _default = NotFound;

export default _default;
