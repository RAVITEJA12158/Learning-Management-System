import React, { useState } from 'react';
import { moduleService } from '../services/courseService';

function ContentUploadModal({ moduleId, isOpen, onClose, onSuccess }) {
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
    setUploadProgress(20);

    try {
      let finalUrl = contentUrl;

      // If a file was selected, upload it via backend Cloudinary endpoint
      if (selectedFile) {
        setUploadProgress(40);
        const uploadRes = await moduleService.uploadContentFile(selectedFile);
        finalUrl = uploadRes.url;
        setUploadProgress(80);
      }

      await moduleService.createContent({
        moduleId,
        title,
        type,
        description,
        contentUrl: finalUrl,
        isPublished: true,
        position: 1,
      });

      setUploadProgress(100);
      setTimeout(() => {
        onSuccess();
        onClose();
      }, 400);
    } catch (err) {
      console.error(err);
      setError(err.message || 'Failed to upload content.');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-fade-in">
      <div className="relative w-full max-w-xl rounded-[28px] border border-black/10 bg-white p-6 sm:p-8 shadow-2xl">
        <div className="flex items-center justify-between pb-4 border-b border-black/5 mb-6">
          <h2 className="text-xl font-black tracking-[-.03em] text-[#151515]">
            Add Course Material
          </h2>
          <button
            onClick={onClose}
            className="flex h-8 w-8 items-center justify-center rounded-full border border-black/10 text-xs font-black text-[#151515] hover:bg-black/5"
          >
            ✕
          </button>
        </div>

        {error && (
          <div className="mb-4 rounded-xl border border-[#F2C7BC] bg-[#FFF1ED] p-3 text-xs font-bold text-[#B83D29]">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-black uppercase tracking-wider text-[#151515]/60 mb-1">
              Title *
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Lecture 1 Slides, Database Normalization Video"
              className="w-full rounded-xl border border-black/15 bg-white px-4 py-2.5 text-sm font-medium focus:border-black focus:outline-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-black uppercase tracking-wider text-[#151515]/60 mb-1">
                Content Type
              </label>
              <select
                value={type}
                onChange={(e) => setType(e.target.value)}
                className="w-full rounded-xl border border-black/15 bg-white px-4 py-2.5 text-sm font-medium focus:border-black focus:outline-none"
              >
                <option value="PDF">PDF Document</option>
                <option value="VIDEO">Video</option>
                <option value="LINK">External Link</option>
                <option value="TEXT">Notes / Text</option>
                <option value="FILE">Downloadable File</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-black uppercase tracking-wider text-[#151515]/60 mb-1">
                External URL (Optional)
              </label>
              <input
                type="url"
                value={contentUrl}
                onChange={(e) => setContentUrl(e.target.value)}
                placeholder="https://..."
                className="w-full rounded-xl border border-black/15 bg-white px-4 py-2.5 text-sm font-medium focus:border-black focus:outline-none"
              />
            </div>
          </div>

          {/* Drag & Drop Zone */}
          <div>
            <label className="block text-xs font-black uppercase tracking-wider text-[#151515]/60 mb-1">
              Upload File (Cloudinary Storage)
            </label>
            <div
              onDragOver={(e) => {
                e.preventDefault();
                setIsDragOver(true);
              }}
              onDragLeave={() => setIsDragOver(false)}
              onDrop={handleFileDrop}
              className={`flex flex-col items-center justify-center rounded-2xl border-2 border-dashed p-6 transition ${
                isDragOver ? 'border-[#151515] bg-[#DFFF63]/20' : 'border-black/15 bg-[#FAF8F5]'
              }`}
            >
              <span className="text-2xl mb-2">📁</span>
              <p className="text-xs font-bold text-[#151515]">
                {selectedFile ? selectedFile.name : 'Drag & Drop file here or'}
              </p>
              <label className="mt-2 cursor-pointer rounded-full bg-white border border-black/10 px-4 py-1.5 text-[11px] font-black text-[#151515] hover:border-black/30">
                Browse File
                <input
                  type="file"
                  onChange={handleFileSelect}
                  className="hidden"
                  accept=".pdf,.doc,.docx,.ppt,.pptx,.mp4,.mov,.zip,.png,.jpg"
                />
              </label>
              {selectedFile && (
                <span className="mt-2 text-[10px] text-[#151515]/50">
                  Size: {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                </span>
              )}
            </div>
          </div>

          {/* Progress Bar */}
          {uploading && (
            <div className="space-y-1">
              <div className="flex justify-between text-[11px] font-bold text-[#151515]/60">
                <span>Uploading to Cloudinary...</span>
                <span>{uploadProgress}%</span>
              </div>
              <div className="h-2 w-full overflow-hidden rounded-full bg-black/10">
                <div
                  className="h-full bg-[#151515] transition-all duration-300"
                  style={{ width: `${uploadProgress}%` }}
                />
              </div>
            </div>
          )}

          <div>
            <label className="block text-xs font-black uppercase tracking-wider text-[#151515]/60 mb-1">
              Description / Notes
            </label>
            <textarea
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Brief summary or reading instructions for students..."
              className="w-full rounded-xl border border-black/15 bg-white p-3 text-xs font-medium focus:border-black focus:outline-none"
            />
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-black/5">
            <button
              type="button"
              onClick={onClose}
              disabled={uploading}
              className="rounded-full border border-black/10 bg-white px-5 py-2.5 text-xs font-black text-[#151515] hover:border-black/25"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={uploading}
              className="hub-lift inline-flex items-center gap-2 rounded-full bg-[#151515] px-6 py-2.5 text-xs font-black text-white hover:bg-[#292929] disabled:opacity-70"
            >
              {uploading ? 'Uploading...' : 'Save & Publish'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default ContentUploadModal;
