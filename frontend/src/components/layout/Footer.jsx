import React from 'react';
import { useNavigate } from 'react-router-dom';
import BrandMark from '../common/BrandMark';

"use strict";

function Footer() {
  const navigate = (0, useNavigate)();
  return /*#__PURE__*/React.createElement("footer", {
    className: "bg-slate-950 dark:bg-gray-950 text-white relative transition-colors duration-200"
  }, /*#__PURE__*/React.createElement("div", {
    className: "h-[1px] w-full bg-gradient-to-r from-transparent via-slate-700/60 dark:via-gray-700 to-transparent"
  }), /*#__PURE__*/React.createElement("div", {
    className: "mx-auto flex max-w-[1440px] flex-wrap justify-between items-center gap-3 px-5 py-8 text-xs text-slate-400 dark:text-gray-400 sm:px-8"
  }, /*#__PURE__*/React.createElement("button", {
    onClick: () => navigate('/'),
    className: "flex items-center gap-3 cursor-pointer hover:opacity-90 transition"
  }, /*#__PURE__*/React.createElement(BrandMark, {
    dark: true
  }), /*#__PURE__*/React.createElement("span", {
    className: "text-sm font-black tracking-[-.05em] text-white"
  }, "CourseHub")), /*#__PURE__*/React.createElement("div", {
    className: "flex flex-wrap items-center gap-5"
  }, /*#__PURE__*/React.createElement("span", null, "\xA9 2026 CourseHub LMS. All rights reserved."), /*#__PURE__*/React.createElement("button", {
    onClick: () => navigate('/courses'),
    className: "hover:text-cyan-400 cursor-pointer transition"
  }, "Catalog"), /*#__PURE__*/React.createElement("span", null, "\xB7"), /*#__PURE__*/React.createElement("button", {
    onClick: () => navigate('/settings'),
    className: "hover:text-cyan-400 cursor-pointer transition"
  }, "Privacy & Preferences"), /*#__PURE__*/React.createElement("span", null, "\xB7"), /*#__PURE__*/React.createElement("button", {
    onClick: () => navigate('/contact'),
    className: "hover:text-cyan-400 cursor-pointer transition"
  }, "Support"))));
}
var _default = Footer;

export default _default;
