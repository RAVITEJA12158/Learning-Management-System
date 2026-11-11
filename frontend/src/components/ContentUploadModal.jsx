import React, { useState } from 'react';
import { moduleService } from '../services/courseService';
import Button from './common/Button';

export default function ContentUploadModal({
  moduleId,
  isOpen,
  onClose,
  onSuccess,
}) {
  const [title, setTitle] = useState('');
  const [type, setType] = useState('PDF');
  const [description, setDescription] = useState('');
  const [contentUrl, setContentUrl] = useState('');
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isDragOver, setIsDragOver] = useState(false);
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleFileDrop = (e) => {
    e.preventDefault();
    setIsDragOver(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      setSelectedFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileSelect = (e) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
    }
  };

  const handleSubmit = async (e) => {
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
        position: 1,
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

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-md p-3 sm:p-4 animate-fade-in overflow-y-auto">
      <div className="relative w-full max-w-xl max-h-[90vh] overflow-y-auto rounded-2xl border border-slate-200 dark:border-white/10 bg-white dark:bg-[#030712] p-5 sm:p-8 shadow-2xl transition-colors my-auto">
        <div className="flex items-center justify-between gap-3 pb-4 border-b border-slate-100 dark:border-white/10 mb-5">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-blue-600 dark:text-cyan-400">
              Cloudinary Content Delivery
            </span>
            <h2 className="text-lg sm:text-xl font-black tracking-tight text-slate-900 dark:text-white mt-0.5">
              Add Course Material
            </h2>
          </div>
          <button
            onClick={onClose}
            className="flex h-11 w-11 sm:h-9 sm:w-9 shrink-0 items-center justify-center rounded-xl border border-slate-200 dark:border-white/10 text-xs font-bold text-slate-500 dark:text-gray-400 hover:bg-slate-100 dark:hover:bg-white/10 transition cursor-pointer"
            aria-label="Close modal"
          >
            ✕
          </button>
        </div>

        {error && (
          <div className="mb-4 rounded-xl border border-red-200 dark:border-red-900/50 bg-red-50 dark:bg-red-950/30 p-3 text-xs font-bold text-red-600 dark:text-red-400">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-gray-300 mb-1">
              Material Title *
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Lecture 1 Slides, Database Normalization Video"
              className="w-full min-h-[44px] rounded-xl border border-slate-200 dark:border-gray-800 bg-white dark:bg-transparent px-4 py-2.5 text-base sm:text-sm font-medium text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-gray-500 focus:border-purple-500 focus:ring-1 focus:ring-purple-500/50 outline-none transition"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-gray-300 mb-1">
                Content Type
              </label>
              <select
                value={type}
                onChange={(e) => setType(e.target.value)}
                className="w-full min-h-[44px] rounded-xl border border-slate-200 dark:border-gray-800 bg-white dark:bg-[#030712] px-4 py-2.5 text-base sm:text-sm font-semibold text-slate-900 dark:text-white focus:border-purple-500 focus:ring-1 focus:ring-purple-500/50 outline-none transition cursor-pointer"
              >
                <option value="PDF">PDF Document</option>
                <option value="VIDEO">Video Lecture</option>
                <option value="LINK">External Resource Link</option>
                <option value="TEXT">Lecture Notes / Text</option>
                <option value="FILE">Downloadable Archive / File</option>
              </select>
            </div>

            {type !== 'TEXT' && (
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-gray-300 mb-1">
                  Resource URL (Optional)
                </label>
                <input
                  type="url"
                  value={contentUrl}
                  onChange={(e) => setContentUrl(e.target.value)}
                  placeholder="https://..."
                  className="w-full min-h-[44px] rounded-xl border border-slate-200 dark:border-gray-800 bg-white dark:bg-transparent px-4 py-2.5 text-base sm:text-sm font-medium text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-gray-500 focus:border-purple-500 focus:ring-1 focus:ring-purple-500/50 outline-none transition"
                />
              </div>
            )}
          </div>

          {type === 'TEXT' ? (
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-gray-300 mb-1">
                Lecture Notes / Reading Body *
              </label>
              <textarea
                rows={4}
                required
                value={contentUrl}
                onChange={(e) => setContentUrl(e.target.value)}
                placeholder="Write or paste structured lecture notes, formulas, or code snippets..."
                className="w-full rounded-xl border border-slate-200 dark:border-gray-800 bg-white dark:bg-transparent p-3 text-xs font-mono text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-gray-500 focus:border-purple-500 focus:ring-1 focus:ring-purple-500/50 outline-none transition"
              />
            </div>
          ) : (
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-gray-300 mb-1">
                Upload File (Cloudinary Storage)
              </label>
              <div
                onDragOver={(e) => {
                  e.preventDefault();
                  setIsDragOver(true);
                }}
                onDragLeave={() => setIsDragOver(false)}
                onDrop={handleFileDrop}
                className={`flex flex-col items-center justify-center rounded-2xl border-2 border-dashed p-5 text-center transition ${
                  isDragOver
                    ? 'border-cyan-400 bg-cyan-500/10'
                    : 'border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-white/[0.02]'
                }`}
              >
                <span className="text-2xl mb-1">📁</span>
                <p className="text-xs font-bold text-slate-800 dark:text-white break-all">
                  {selectedFile ? selectedFile.name : 'Drag & Drop file here or'}
                </p>
                <label className="mt-2 min-h-[40px] inline-flex items-center cursor-pointer rounded-xl bg-white dark:bg-white/10 border border-slate-200 dark:border-white/10 px-4 py-2 text-xs font-bold text-slate-700 dark:text-white hover:border-cyan-400 transition">
                  Browse Local File
                  <input
                    type="file"
                    onChange={handleFileSelect}
                    className="hidden"
                    accept=".pdf,.doc,.docx,.ppt,.pptx,.mp4,.mov,.zip,.png,.jpg"
                  />
                </label>
                {selectedFile && (
                  <span className="mt-1.5 text-[10px] text-slate-400 dark:text-gray-400">
                    Size: {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                  </span>
                )}
              </div>
            </div>
          )}

          {uploading && (
            <div className="space-y-1">
              <div className="flex justify-between text-[11px] font-bold text-blue-600 dark:text-cyan-400">
                <span>Uploading to Cloudinary…</span>
                <span>{uploadProgress}%</span>
              </div>
              <div className="h-2 w-full overflow-hidden rounded-full bg-slate-100 dark:bg-gray-800">
                <div
                  className="h-full bg-gradient-to-r from-cyan-400 to-blue-600 transition-all duration-300"
                  style={{ width: `${uploadProgress}%` }}
                />
              </div>
            </div>
          )}

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-gray-300 mb-1">
              Summary / Student Instructions
            </label>
            <textarea
              rows={2}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Brief summary or reading instructions for students..."
              className="w-full rounded-xl border border-slate-200 dark:border-gray-800 bg-white dark:bg-transparent p-3 text-xs font-medium text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-gray-500 focus:border-purple-500 focus:ring-1 focus:ring-purple-500/50 outline-none transition"
            />
          </div>

          <div className="flex flex-col-reverse sm:flex-row justify-end gap-2.5 pt-4 border-t border-slate-100 dark:border-white/10">
            <Button type="button" variant="outline" onClick={onClose} disabled={uploading}>
              Cancel
            </Button>
            <Button type="submit" disabled={uploading}>
              {uploading ? 'Uploading…' : 'Save & Publish Material'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
