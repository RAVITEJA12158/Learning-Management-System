import React, { useState } from 'react';
import { moduleService } from '../services/courseService';
import Button from './common/Button';

"use strict";

function ContentUploadModal({
  moduleId,
  isOpen,
  onClose,
  onSuccess
}) {
  const [title, setTitle] = (0, useState)('');
  const [type, setType] = (0, useState)('PDF');
  const [description, setDescription] = (0, useState)('');
  const [contentUrl, setContentUrl] = (0, useState)('');
  const [selectedFile, setSelectedFile] = (0, useState)(null);
  const [uploading, setUploading] = (0, useState)(false);
  const [uploadProgress, setUploadProgress] = (0, useState)(0);
  const [isDragOver, setIsDragOver] = (0, useState)(false);
  const [error, setError] = (0, useState)('');
  if (!isOpen) return null;
  const handleFileDrop = e => {
    e.preventDefault();
    setIsDragOver(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      setSelectedFile(e.dataTransfer.files[0]);
    }
  };
  const handleFileSelect = e => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
    }
  };
  const handleSubmit = async e => {
    e.preventDefault();
    if (!title.trim()) {
      setError('Content title is required.');
      return;
    }
    setUploading(true);
    setError('');
    setUploadProgress(25);
    try {
      let finalUrl = contentUrl;
      if (selectedFile) {
        setUploadProgress(55);
        const uploadRes = await moduleService.uploadContentFile(selectedFile);
        finalUrl = uploadRes.url;
        setUploadProgress(85);
      }
      await moduleService.createContent({
        moduleId,
        title: title.trim(),
        type,
        description: description.trim(),
        contentUrl: finalUrl,
        isPublished: true,
        position: 1
      });
      setUploadProgress(100);
      setTitle('');
      setDescription('');
      setContentUrl('');
      setSelectedFile(null);
      onSuccess();
      onClose();
    } catch (err) {
      console.error(err);
      setError(err.message || 'Failed to upload content.');
    } finally {
      setUploading(false);
      setUploadProgress(0);
    }
  };
  return /*#__PURE__*/React.createElement("div", {
    className: "fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-md p-4 animate-fade-in"
  }, /*#__PURE__*/React.createElement("div", {
    className: "relative w-full max-w-xl rounded-2xl border border-slate-200 dark:border-white/10 bg-white dark:bg-[#030712] p-6 sm:p-8 shadow-2xl transition-colors"
  }, /*#__PURE__*/React.createElement("div", {
    className: "flex items-center justify-between pb-4 border-b border-slate-100 dark:border-white/10 mb-5"
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("span", {
    className: "text-[10px] font-bold uppercase tracking-wider text-blue-600 dark:text-cyan-400"
  }, "Cloudinary Content Delivery"), /*#__PURE__*/React.createElement("h2", {
    className: "text-xl font-black tracking-tight text-slate-900 dark:text-white mt-0.5"
  }, "Add Course Material")), /*#__PURE__*/React.createElement("button", {
    onClick: onClose,
    className: "flex h-8 w-8 items-center justify-center rounded-lg border border-slate-200 dark:border-white/10 text-xs font-bold text-slate-500 dark:text-gray-400 hover:bg-slate-100 dark:hover:bg-white/10 transition cursor-pointer"
  }, "\u2715")), error && /*#__PURE__*/React.createElement("div", {
    className: "mb-4 rounded-xl border border-red-200 dark:border-red-900/50 bg-red-50 dark:bg-red-950/30 p-3 text-xs font-bold text-red-600 dark:text-red-400"
  }, error), /*#__PURE__*/React.createElement("form", {
    onSubmit: handleSubmit,
    className: "space-y-4"
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("label", {
    className: "block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-gray-300 mb-1"
  }, "Material Title *"), /*#__PURE__*/React.createElement("input", {
    type: "text",
    required: true,
    value: title,
    onChange: e => setTitle(e.target.value),
    placeholder: "e.g. Lecture 1 Slides, Database Normalization Video",
    className: "w-full rounded-xl border border-slate-200 dark:border-gray-800 bg-white dark:bg-transparent px-4 py-2.5 text-sm font-medium text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-gray-500 focus:border-purple-500 focus:ring-1 focus:ring-purple-500/50 outline-none transition"
  })), /*#__PURE__*/React.createElement("div", {
    className: "grid grid-cols-1 sm:grid-cols-2 gap-4"
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("label", {
    className: "block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-gray-300 mb-1"
  }, "Content Type"), /*#__PURE__*/React.createElement("select", {
    value: type,
    onChange: e => setType(e.target.value),
    className: "w-full rounded-xl border border-slate-200 dark:border-gray-800 bg-white dark:bg-[#030712] px-4 py-2.5 text-sm font-semibold text-slate-900 dark:text-white focus:border-purple-500 focus:ring-1 focus:ring-purple-500/50 outline-none transition cursor-pointer"
  }, /*#__PURE__*/React.createElement("option", {
    value: "PDF"
  }, "PDF Document"), /*#__PURE__*/React.createElement("option", {
    value: "VIDEO"
  }, "Video Lecture"), /*#__PURE__*/React.createElement("option", {
    value: "LINK"
  }, "External Resource Link"), /*#__PURE__*/React.createElement("option", {
    value: "TEXT"
  }, "Lecture Notes / Text"), /*#__PURE__*/React.createElement("option", {
    value: "FILE"
  }, "Downloadable Archive / File"))), type !== 'TEXT' && /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("label", {
    className: "block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-gray-300 mb-1"
  }, "Resource URL (Optional)"), /*#__PURE__*/React.createElement("input", {
    type: "url",
    value: contentUrl,
    onChange: e => setContentUrl(e.target.value),
    placeholder: "https://...",
    className: "w-full rounded-xl border border-slate-200 dark:border-gray-800 bg-white dark:bg-transparent px-4 py-2.5 text-sm font-medium text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-gray-500 focus:border-purple-500 focus:ring-1 focus:ring-purple-500/50 outline-none transition"
  }))), type === 'TEXT' ? /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("label", {
    className: "block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-gray-300 mb-1"
  }, "Lecture Notes / Reading Body *"), /*#__PURE__*/React.createElement("textarea", {
    rows: 4,
    required: true,
    value: contentUrl,
    onChange: e => setContentUrl(e.target.value),
    placeholder: "Write or paste structured lecture notes, formulas, or code snippets...",
    className: "w-full rounded-xl border border-slate-200 dark:border-gray-800 bg-white dark:bg-transparent p-3 text-xs font-mono text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-gray-500 focus:border-purple-500 focus:ring-1 focus:ring-purple-500/50 outline-none transition"
  })) : /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("label", {
    className: "block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-gray-300 mb-1"
  }, "Upload File (Cloudinary Storage)"), /*#__PURE__*/React.createElement("div", {
    onDragOver: e => {
      e.preventDefault();
      setIsDragOver(true);
    },
    onDragLeave: () => setIsDragOver(false),
    onDrop: handleFileDrop,
    className: `flex flex-col items-center justify-center rounded-2xl border-2 border-dashed p-5 transition ${isDragOver ? 'border-cyan-400 bg-cyan-500/10' : 'border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-white/[0.02]'}`
  }, /*#__PURE__*/React.createElement("span", {
    className: "text-2xl mb-1"
  }, "\uD83D\uDCC1"), /*#__PURE__*/React.createElement("p", {
    className: "text-xs font-bold text-slate-800 dark:text-white"
  }, selectedFile ? selectedFile.name : 'Drag & Drop file here or'), /*#__PURE__*/React.createElement("label", {
    className: "mt-2 cursor-pointer rounded-xl bg-white dark:bg-white/10 border border-slate-200 dark:border-white/10 px-4 py-1.5 text-[11px] font-bold text-slate-700 dark:text-white hover:border-cyan-400 transition"
  }, "Browse Local File", /*#__PURE__*/React.createElement("input", {
    type: "file",
    onChange: handleFileSelect,
    className: "hidden",
    accept: ".pdf,.doc,.docx,.ppt,.pptx,.mp4,.mov,.zip,.png,.jpg"
  })), selectedFile && /*#__PURE__*/React.createElement("span", {
    className: "mt-1.5 text-[10px] text-slate-400 dark:text-gray-400"
  }, "Size: ", (selectedFile.size / 1024 / 1024).toFixed(2), " MB"))), uploading && /*#__PURE__*/React.createElement("div", {
    className: "space-y-1"
  }, /*#__PURE__*/React.createElement("div", {
    className: "flex justify-between text-[11px] font-bold text-blue-600 dark:text-cyan-400"
  }, /*#__PURE__*/React.createElement("span", null, "Uploading to Cloudinary\u2026"), /*#__PURE__*/React.createElement("span", null, uploadProgress, "%")), /*#__PURE__*/React.createElement("div", {
    className: "h-2 w-full overflow-hidden rounded-full bg-slate-100 dark:bg-gray-800"
  }, /*#__PURE__*/React.createElement("div", {
    className: "h-full bg-gradient-to-r from-cyan-400 to-blue-600 transition-all duration-300",
    style: {
      width: `${uploadProgress}%`
    }
  }))), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("label", {
    className: "block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-gray-300 mb-1"
  }, "Summary / Student Instructions"), /*#__PURE__*/React.createElement("textarea", {
    rows: 2,
    value: description,
    onChange: e => setDescription(e.target.value),
    placeholder: "Brief summary or reading instructions for students...",
    className: "w-full rounded-xl border border-slate-200 dark:border-gray-800 bg-white dark:bg-transparent p-3 text-xs font-medium text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-gray-500 focus:border-purple-500 focus:ring-1 focus:ring-purple-500/50 outline-none transition"
  })), /*#__PURE__*/React.createElement("div", {
    className: "flex justify-end gap-3 pt-4 border-t border-slate-100 dark:border-white/10"
  }, /*#__PURE__*/React.createElement(Button, {
    type: "button",
    variant: "outline",
    onClick: onClose,
    disabled: uploading
  }, "Cancel"), /*#__PURE__*/React.createElement(Button, {
    type: "submit",
    disabled: uploading
  }, uploading ? 'Uploading…' : 'Save & Publish Material')))));
}
var _default = ContentUploadModal;

export default _default;
