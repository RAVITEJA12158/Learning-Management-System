import React, { useState } from 'react';
import { assignmentService } from '../services/courseService';

function AssignmentSubmissionModal({ assignment, isOpen, onClose, onSuccess }) {
  const [selectedFile, setSelectedFile] = useState(null);
  const [fileUrl, setFileUrl] = useState('');
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');
  const [isDragOver, setIsDragOver] = useState(false);

  if (!isOpen || !assignment) return null;

  const mySubmission = assignment.submissions?.[0] || null;
  const isPastDue = new Date() > new Date(assignment.dueDate);
  const isBlocked = isPastDue && !assignment.allowLateSubmission && !mySubmission;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedFile && !fileUrl.trim()) {
      setError('Please choose a file to upload or enter a submission link.');
      return;
    }

    setUploading(true);
    setError('');

    try {
      if (selectedFile) {
        const formData = new FormData();
        formData.append('file', selectedFile);
        await assignmentService.submit(assignment.id, formData);
      } else {
        await assignmentService.submit(assignment.id, { fileUrl });
      }

      onSuccess();
      onClose();
    } catch (err) {
      console.error(err);
      setError(err.message || 'Failed to submit assignment.');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-md p-4 animate-fade-in">
      <div className="relative w-full max-w-xl rounded-2xl border border-slate-200 dark:border-white/10 bg-white dark:bg-[#030712] p-6 sm:p-8 shadow-2xl transition-colors">
        
        {/* Header */}
        <div className="flex items-start justify-between pb-4 border-b border-slate-100 dark:border-white/5 mb-5">
          <div>
            <span className="inline-block rounded-full bg-cyan-100 dark:bg-cyan-950/60 px-3 py-1 text-[10px] font-black uppercase tracking-wider text-cyan-800 dark:text-cyan-300 border border-transparent dark:border-cyan-800/40">
              Max Marks: {assignment.maxMarks}
            </span>
            <h2 className="mt-2 text-2xl font-black tracking-tight text-slate-900 dark:text-white">
              {assignment.title}
            </h2>
            <p className="text-xs text-slate-500 dark:text-gray-400 mt-1">
              Due: {new Date(assignment.dueDate).toLocaleString()}
            </p>
          </div>

          <button
            onClick={onClose}
            className="flex h-8 w-8 items-center justify-center rounded-full border border-slate-200 dark:border-white/10 text-xs font-black text-slate-600 dark:text-gray-300 hover:bg-slate-100 dark:hover:bg-white/10 transition cursor-pointer"
          >
            ✕
          </button>
        </div>

        {/* Existing Submission Details */}
        {mySubmission && (
          <div className="mb-6 rounded-2xl border border-slate-200 dark:border-white/5 bg-slate-50 dark:bg-white/[0.02] p-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-black text-slate-900 dark:text-white">Previous Submission</span>
              <span
                className={`rounded-full px-2.5 py-1 text-[10px] font-black uppercase ${
                  mySubmission.status === 'LATE'
                    ? 'border border-red-200 dark:border-red-900/40 bg-red-50 dark:bg-red-950/40 text-red-600 dark:text-red-400'
                    : 'border border-emerald-200 dark:border-emerald-800/40 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400'
                }`}
              >
                {mySubmission.status}
              </span>
            </div>
            <p className="mt-1 text-[11px] text-slate-500 dark:text-gray-400">
              Submitted at: {new Date(mySubmission.submittedAt).toLocaleString()}
            </p>
            {mySubmission.fileUrl && (
              <a
                href={mySubmission.fileUrl}
                target="_blank"
                rel="noreferrer"
                className="mt-2 inline-block text-xs font-bold text-cyan-600 dark:text-cyan-400 hover:underline"
              >
                View Submitted File ↗
              </a>
            )}

            {mySubmission.marks !== null && mySubmission.marks !== undefined && (
              <div className="mt-3 rounded-xl border border-slate-200 dark:border-white/10 bg-white dark:bg-gray-900/40 p-3">
                <p className="text-xs font-black text-slate-900 dark:text-white">
                  Score: {mySubmission.marks} / {assignment.maxMarks}
                </p>
                {mySubmission.feedback && (
                  <p className="mt-1 text-xs text-slate-600 dark:text-gray-300 italic">
                    "{mySubmission.feedback}"
                  </p>
                )}
              </div>
            )}
          </div>
        )}

        {error && (
          <div className="mb-4 rounded-xl border border-red-200 dark:border-red-900/50 bg-red-50 dark:bg-red-950/30 p-3 text-xs font-bold text-red-600 dark:text-red-400">
            {error}
          </div>
        )}

        {isBlocked ? (
          <div className="rounded-2xl border border-red-200 dark:border-red-900/50 bg-red-50 dark:bg-red-950/30 p-6 text-center text-xs font-bold text-red-600 dark:text-red-400">
            The deadline for this assignment has passed and late submissions are closed.
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            {isPastDue && assignment.allowLateSubmission && (
              <div className="rounded-xl border border-orange-200 dark:border-orange-900/50 bg-orange-50 dark:bg-orange-950/30 p-3 text-xs font-bold text-orange-800 dark:text-orange-300">
                ⚠️ This assignment is past due. Your submission will be marked as LATE.
              </div>
            )}

            {/* Drag & Drop Area */}
            <div>
              <label className="block text-xs font-black uppercase tracking-wider text-slate-500 dark:text-gray-400 mb-1">
                Upload Submission File (PDF / DOC / ZIP)
              </label>
              <div
                onDragOver={(e) => {
                  e.preventDefault();
                  setIsDragOver(true);
                }}
                onDragLeave={() => setIsDragOver(false)}
                onDrop={(e) => {
                  e.preventDefault();
                  setIsDragOver(false);
                  if (e.dataTransfer.files?.[0]) setSelectedFile(e.dataTransfer.files[0]);
                }}
                className={`flex flex-col items-center justify-center rounded-2xl border-2 border-dashed p-6 transition ${
                  isDragOver
                    ? 'border-cyan-400 bg-cyan-500/10'
                    : 'border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-white/[0.02]'
                }`}
              >
                <span className="text-2xl mb-1">📤</span>
                <p className="text-xs font-bold text-slate-800 dark:text-white">
                  {selectedFile ? selectedFile.name : 'Drag & drop your solution file'}
                </p>
                <label className="mt-2 cursor-pointer rounded-full bg-white dark:bg-white/10 border border-slate-200 dark:border-white/10 px-4 py-1.5 text-[11px] font-black text-slate-700 dark:text-white hover:border-cyan-400 transition">
                  Browse File
                  <input
                    type="file"
                    onChange={(e) => e.target.files?.[0] && setSelectedFile(e.target.files[0])}
                    className="hidden"
                  />
                </label>
              </div>
            </div>

            <div>
              <label className="block text-xs font-black uppercase tracking-wider text-slate-500 dark:text-gray-400 mb-1">
                Or Enter External File URL / Repository
              </label>
              <input
                type="url"
                value={fileUrl}
                onChange={(e) => setFileUrl(e.target.value)}
                placeholder="https://github.com/... or https://drive.google.com/..."
                className="w-full rounded-xl border border-slate-200 dark:border-gray-800 bg-white dark:bg-transparent px-4 py-2.5 text-xs font-medium text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-gray-500 focus:border-purple-500 focus:ring-1 focus:ring-purple-500/50 focus:outline-none transition"
              />
            </div>

            <div className="flex justify-end gap-3 pt-4 border-t border-slate-100 dark:border-white/5">
              <button
                type="button"
                onClick={onClose}
                disabled={uploading}
                className="rounded-full border border-slate-200 dark:border-white/10 px-5 py-2.5 text-xs font-black text-slate-700 dark:text-gray-300 hover:bg-slate-50 dark:hover:bg-white/5 transition"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={uploading}
                className="hub-lift rounded-full bg-blue-600 dark:bg-[#0066FF] hover:bg-blue-700 dark:hover:bg-blue-500 shadow-[0_0_15px_rgba(0,102,255,0.4)] px-6 py-2.5 text-xs font-black text-white disabled:opacity-50 transition"
              >
                {uploading ? 'Submitting...' : mySubmission ? 'Resubmit Work' : 'Submit Assignment'}
              </button>
            </div>
          </form>
        )}

      </div>
    </div>
  );
}

export default AssignmentSubmissionModal;
