import React, { useState } from 'react';

"use strict";

function CreateQuizModal({
  isOpen,
  onClose,
  onCreate
}) {
  const [title, setTitle] = (0, useState)('');
  const [duration, setDuration] = (0, useState)(25);
  const [points, setPoints] = (0, useState)(20);
  const [attemptsAllowed, setAttemptsAllowed] = (0, useState)(3);
  const [colorTheme, setColorTheme] = (0, useState)('cyan');

  // Custom question authoring support (QUESTIONS & QUESTION_OPTIONS)
  const [customQuestions, setCustomQuestions] = (0, useState)([{
    id: Date.now(),
    question: 'Which matrix decomposition factors any real or complex matrix into U Σ V^T?',
    type: 'MCQ',
    marks: 2,
    options: ['Singular Value Decomposition (SVD)', 'Cholesky Decomposition', 'LU Factorization without pivoting', 'Jacobi Iteration'],
    correctIndex: 0
  }]);
  const [qText, setQText] = (0, useState)('');
  const [optA, setOptA] = (0, useState)('');
  const [optB, setOptB] = (0, useState)('');
  const [optC, setOptC] = (0, useState)('');
  const [optD, setOptD] = (0, useState)('');
  const [correctIdx, setCorrectIdx] = (0, useState)(0);
  if (!isOpen) return null;
  const handleAddQuestion = () => {
    if (!qText.trim() || !optA.trim() || !optB.trim()) return;
    const options = [optA.trim(), optB.trim(), optC.trim() || 'None of the above', optD.trim() || 'All of the above'];
    setCustomQuestions(prev => [...prev, {
      id: Date.now(),
      question: qText.trim(),
      type: 'MCQ',
      marks: 2,
      options,
      correctIndex: Number(correctIdx)
    }]);
    setQText('');
    setOptA('');
    setOptB('');
    setOptC('');
    setOptD('');
    setCorrectIdx(0);
  };
  const handleRemoveQuestion = id => {
    setCustomQuestions(prev => prev.filter(q => q.id !== id));
  };
  const handleSubmit = e => {
    e.preventDefault();
    if (!title.trim()) return;
    const finalQuestions = customQuestions;
    onCreate({
      id: `quiz-${Date.now()}`,
      title: title.trim(),
      questions: finalQuestions.length,
      questionsList: finalQuestions,
      duration: `${duration} mins`,
      points: Number(points),
      attemptsAllowed: Number(attemptsAllowed),
      attemptsUsed: 0,
      status: 'Active',
      colorTheme
    });
    setTitle('');
    onClose();
  };
  return /*#__PURE__*/React.createElement("div", {
    className: "fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4 overflow-y-auto animate-fade-in"
  }, /*#__PURE__*/React.createElement("div", {
    className: "relative w-full max-w-2xl rounded-2xl border border-slate-200 dark:border-white/10 bg-white dark:bg-[#030712] p-6 sm:p-8 shadow-2xl transition-colors my-8 max-h-[92vh] overflow-y-auto"
  }, /*#__PURE__*/React.createElement("div", {
    className: "flex items-center justify-between border-b border-slate-100 dark:border-white/5 pb-4 mb-5"
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("span", {
    className: "text-[10px] font-bold uppercase tracking-wider text-blue-600 dark:text-cyan-400"
  }, "Assessment Authoring"), /*#__PURE__*/React.createElement("h2", {
    className: "text-xl font-bold text-slate-900 dark:text-white"
  }, "Create Timed Quiz & Questions")), /*#__PURE__*/React.createElement("button", {
    onClick: onClose,
    className: "w-8 h-8 flex items-center justify-center rounded-lg border border-slate-200 dark:border-white/10 text-slate-500 dark:text-gray-400 hover:bg-slate-100 dark:hover:bg-white/10 transition cursor-pointer"
  }, "\u2715")), /*#__PURE__*/React.createElement("form", {
    onSubmit: handleSubmit,
    className: "space-y-5"
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("label", {
    className: "block text-xs font-bold text-slate-700 dark:text-gray-300 uppercase mb-1"
  }, "Quiz Title *"), /*#__PURE__*/React.createElement("input", {
    type: "text",
    required: true,
    placeholder: "e.g. Midterm Assessment: Eigenvalues, SVD & Optimization",
    value: title,
    onChange: e => setTitle(e.target.value),
    className: "w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-gray-800 bg-white dark:bg-transparent text-slate-900 dark:text-white text-sm placeholder-slate-400 dark:placeholder-gray-500 focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500/50 transition"
  })), /*#__PURE__*/React.createElement("div", {
    className: "grid grid-cols-3 gap-4"
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("label", {
    className: "block text-xs font-bold text-slate-700 dark:text-gray-300 uppercase mb-1"
  }, "Duration (mins)"), /*#__PURE__*/React.createElement("input", {
    type: "number",
    min: "5",
    max: "180",
    value: duration,
    onChange: e => setDuration(e.target.value),
    className: "w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-gray-800 bg-white dark:bg-transparent text-slate-900 dark:text-white text-sm focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500/50 transition"
  })), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("label", {
    className: "block text-xs font-bold text-slate-700 dark:text-gray-300 uppercase mb-1"
  }, "Total Marks"), /*#__PURE__*/React.createElement("input", {
    type: "number",
    min: "1",
    max: "100",
    value: points,
    onChange: e => setPoints(e.target.value),
    className: "w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-gray-800 bg-white dark:bg-transparent text-slate-900 dark:text-white text-sm focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500/50 transition"
  })), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("label", {
    className: "block text-xs font-bold text-slate-700 dark:text-gray-300 uppercase mb-1"
  }, "Max Attempts"), /*#__PURE__*/React.createElement("input", {
    type: "number",
    min: "1",
    max: "10",
    value: attemptsAllowed,
    onChange: e => setAttemptsAllowed(e.target.value),
    className: "w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-gray-800 bg-white dark:bg-transparent text-slate-900 dark:text-white text-sm focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500/50 transition"
  }))), /*#__PURE__*/React.createElement("div", {
    className: "rounded-2xl border border-slate-200 dark:border-white/10 bg-slate-50/70 dark:bg-white/[0.02] p-4 space-y-3"
  }, /*#__PURE__*/React.createElement("div", {
    className: "flex items-center justify-between"
  }, /*#__PURE__*/React.createElement("h4", {
    className: "text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-gray-300"
  }, "Question Bank (", customQuestions.length, " Added)"), /*#__PURE__*/React.createElement("span", {
    className: "text-[11px] text-slate-500 dark:text-gray-400"
  }, "Objective MCQ Auto-Graded")), customQuestions.length > 0 && /*#__PURE__*/React.createElement("div", {
    className: "space-y-2 max-h-36 overflow-y-auto pr-1"
  }, customQuestions.map((q, idx) => /*#__PURE__*/React.createElement("div", {
    key: q.id,
    className: "flex items-center justify-between gap-2 rounded-xl bg-white dark:bg-gray-900/60 border border-slate-200/80 dark:border-white/5 px-3 py-2 text-xs"
  }, /*#__PURE__*/React.createElement("div", {
    className: "truncate"
  }, /*#__PURE__*/React.createElement("span", {
    className: "font-bold text-blue-600 dark:text-cyan-400 mr-1.5"
  }, "Q", idx + 1, "."), /*#__PURE__*/React.createElement("span", {
    className: "font-semibold text-slate-800 dark:text-gray-200"
  }, q.question)), /*#__PURE__*/React.createElement("button", {
    type: "button",
    onClick: () => handleRemoveQuestion(q.id),
    className: "text-red-500 hover:text-red-600 font-bold px-1.5 cursor-pointer"
  }, "\u2715")))), /*#__PURE__*/React.createElement("div", {
    className: "pt-2 border-t border-slate-200/70 dark:border-white/5 space-y-2.5"
  }, /*#__PURE__*/React.createElement("input", {
    type: "text",
    placeholder: "Type a new question prompt...",
    value: qText,
    onChange: e => setQText(e.target.value),
    className: "w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-gray-800 bg-white dark:bg-[#030712] text-xs font-medium text-slate-900 dark:text-white"
  }), /*#__PURE__*/React.createElement("div", {
    className: "grid grid-cols-2 gap-2"
  }, /*#__PURE__*/React.createElement("input", {
    type: "text",
    placeholder: "Option A *",
    value: optA,
    onChange: e => setOptA(e.target.value),
    className: "px-3 py-1.5 rounded-lg border border-slate-200 dark:border-gray-800 bg-white dark:bg-[#030712] text-xs text-slate-900 dark:text-white"
  }), /*#__PURE__*/React.createElement("input", {
    type: "text",
    placeholder: "Option B *",
    value: optB,
    onChange: e => setOptB(e.target.value),
    className: "px-3 py-1.5 rounded-lg border border-slate-200 dark:border-gray-800 bg-white dark:bg-[#030712] text-xs text-slate-900 dark:text-white"
  }), /*#__PURE__*/React.createElement("input", {
    type: "text",
    placeholder: "Option C",
    value: optC,
    onChange: e => setOptC(e.target.value),
    className: "px-3 py-1.5 rounded-lg border border-slate-200 dark:border-gray-800 bg-white dark:bg-[#030712] text-xs text-slate-900 dark:text-white"
  }), /*#__PURE__*/React.createElement("input", {
    type: "text",
    placeholder: "Option D",
    value: optD,
    onChange: e => setOptD(e.target.value),
    className: "px-3 py-1.5 rounded-lg border border-slate-200 dark:border-gray-800 bg-white dark:bg-[#030712] text-xs text-slate-900 dark:text-white"
  })), /*#__PURE__*/React.createElement("div", {
    className: "flex items-center justify-between gap-2 pt-1"
  }, /*#__PURE__*/React.createElement("div", {
    className: "flex items-center gap-2 text-xs text-slate-600 dark:text-gray-300"
  }, /*#__PURE__*/React.createElement("span", {
    className: "font-semibold"
  }, "Correct Option:"), /*#__PURE__*/React.createElement("select", {
    value: correctIdx,
    onChange: e => setCorrectIdx(Number(e.target.value)),
    className: "rounded-lg border border-slate-200 dark:border-gray-800 bg-white dark:bg-[#030712] px-2.5 py-1 text-xs font-bold text-slate-900 dark:text-white"
  }, /*#__PURE__*/React.createElement("option", {
    value: 0
  }, "Option A"), /*#__PURE__*/React.createElement("option", {
    value: 1
  }, "Option B"), /*#__PURE__*/React.createElement("option", {
    value: 2
  }, "Option C"), /*#__PURE__*/React.createElement("option", {
    value: 3
  }, "Option D"))), /*#__PURE__*/React.createElement("button", {
    type: "button",
    onClick: handleAddQuestion,
    className: "px-3 py-1.5 rounded-lg bg-slate-900 dark:bg-white/10 text-white text-xs font-bold hover:opacity-90 transition cursor-pointer"
  }, "+ Add Question to Quiz")))), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("label", {
    className: "block text-xs font-bold text-slate-700 dark:text-gray-300 uppercase mb-1.5"
  }, "Card Accent Theme"), /*#__PURE__*/React.createElement("div", {
    className: "flex items-center gap-3"
  }, [{
    id: 'cyan',
    label: 'Cyan',
    color: 'bg-cyan-400'
  }, {
    id: 'amber',
    label: 'Amber',
    color: 'bg-amber-500'
  }, {
    id: 'emerald',
    label: 'Emerald',
    color: 'bg-emerald-500'
  }].map(theme => /*#__PURE__*/React.createElement("button", {
    type: "button",
    key: theme.id,
    onClick: () => setColorTheme(theme.id),
    className: `flex items-center gap-2 px-3 py-1.5 rounded-xl border text-xs font-semibold cursor-pointer ${colorTheme === theme.id ? 'border-cyan-400 bg-cyan-50/50 dark:bg-cyan-950/40 text-cyan-700 dark:text-cyan-300' : 'border-slate-200 dark:border-white/10 text-slate-600 dark:text-gray-400'}`
  }, /*#__PURE__*/React.createElement("span", {
    className: `w-3 h-3 rounded-full ${theme.color}`
  }), theme.label)))), /*#__PURE__*/React.createElement("div", {
    className: "flex items-center justify-end gap-3 pt-4 border-t border-slate-100 dark:border-white/5"
  }, /*#__PURE__*/React.createElement("button", {
    type: "button",
    onClick: onClose,
    className: "px-4 py-2 rounded-xl text-xs font-bold text-slate-600 dark:text-gray-400 hover:bg-slate-100 dark:hover:bg-white/5 transition cursor-pointer"
  }, "Cancel"), /*#__PURE__*/React.createElement("button", {
    type: "submit",
    className: "px-5 py-2.5 rounded-xl text-xs font-bold bg-[#0066FF] hover:bg-blue-600 text-white shadow-[0_0_15px_rgba(0,102,255,0.4)] transition cursor-pointer"
  }, "Publish Quiz")))));
}
var _default = CreateQuizModal;

export { CreateQuizModal };

export default _default;
