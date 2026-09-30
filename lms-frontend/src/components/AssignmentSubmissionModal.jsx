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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-fade-in">
      <div className="relative w-full max-w-xl rounded-[28px] border border-black/10 bg-white p-6 sm:p-8 shadow-2xl">
        
        {/* Header */}
        <div className="flex items-start justify-between pb-4 border-b border-black/5 mb-5">
          <div>
            <span className="inline-block rounded-full bg-[#DFFF63] px-3 py-1 text-[10px] font-black uppercase tracking-wider text-[#151515]">
              Max Marks: {assignment.maxMarks}
            </span>
            <h2 className="mt-2 text-2xl font-black tracking-[-.03em] text-[#151515]">
              {assignment.title}
            </h2>
            <p className="text-xs text-[#151515]/60 mt-1">
              Due: {new Date(assignment.dueDate).toLocaleString()}
            </p>
          </div>

          <button
            onClick={onClose}
            className="flex h-8 w-8 items-center justify-center rounded-full border border-black/10 text-xs font-black text-[#151515] hover:bg-black/5"
          >
            ✕
          </button>
        </div>

        {/* Existing Submission Details */}
        {mySubmission && (
          <div className="mb-6 rounded-2xl border border-black/10 bg-[#FAF8F5] p-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-black text-[#151515]">Previous Submission</span>
              <span
                className={`rounded-full px-2.5 py-1 text-[10px] font-black uppercase ${
                  mySubmission.status === 'LATE'
                    ? 'border border-[#F2C7BC] bg-[#FFF1ED] text-[#B83D29]'
                    : 'border border-[#B7E4D5] bg-[#EDF9F5] text-[#18765D]'
                }`}
              >
                {mySubmission.status}
              </span>
            </div>
            <p className="mt-1 text-[11px] text-[#151515]/50">
              Submitted at: {new Date(mySubmission.submittedAt).toLocaleString()}
            </p>
            {mySubmission.fileUrl && (
              <a
                href={mySubmission.fileUrl}
                target="_blank"
                rel="noreferrer"
                className="mt-2 inline-block text-xs font-bold text-[#151515] underline"
              >
                View Submitted File ↗
              </a>
            )}

            {mySubmission.marks !== null && mySubmission.marks !== undefined && (
              <div className="mt-3 rounded-xl border border-black/10 bg-white p-3">
                <p className="text-xs font-black text-[#151515]">
                  Score: {mySubmission.marks} / {assignment.maxMarks}
                </p>
                {mySubmission.feedback && (
                  <p className="mt-1 text-xs text-[#151515]/70 italic">
                    "{mySubmission.feedback}"
                  </p>
                )}
              </div>
            )}
          </div>
        )}

        {error && (
          <div className="mb-4 rounded-xl border border-[#F2C7BC] bg-[#FFF1ED] p-3 text-xs font-bold text-[#B83D29]">
            {error}
          </div>
        )}

        {isBlocked ? (
          <div className="rounded-2xl border border-[#F2C7BC] bg-[#FFF1ED] p-6 text-center text-xs font-bold text-[#B83D29]">
            The deadline for this assignment has passed and late submissions are closed.
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            {isPastDue && assignment.allowLateSubmission && (
              <div className="rounded-xl border border-orange-200 bg-orange-50 p-3 text-xs font-bold text-orange-800">
                ⚠️ This assignment is past due. Your submission will be marked as LATE.
              </div>
            )}

            {/* Drag & Drop Area */}
            <div>
              <label className="block text-xs font-black uppercase tracking-wider text-[#151515]/60 mb-1">
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
                  isDragOver ? 'border-[#151515] bg-[#DFFF63]/20' : 'border-black/15 bg-[#FAF8F5]'
                }`}
              >
                <span className="text-2xl mb-1">📤</span>
                <p className="text-xs font-bold text-[#151515]">
                  {selectedFile ? selectedFile.name : 'Drag & drop your solution file'}
                </p>
                <label className="mt-2 cursor-pointer rounded-full bg-white border border-black/10 px-4 py-1.5 text-[11px] font-black text-[#151515] hover:border-black/30">
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
              <label className="block text-xs font-black uppercase tracking-wider text-[#151515]/60 mb-1">
                Or Enter External File URL / Repository
              </label>
              <input
                type="url"
                value={fileUrl}
                onChange={(e) => setFileUrl(e.target.value)}
                placeholder="https://github.com/... or https://drive.google.com/..."
                className="w-full rounded-xl border border-black/15 bg-white px-4 py-2.5 text-xs font-medium focus:border-black focus:outline-none"
              />
            </div>

            <div className="flex justify-end gap-3 pt-4 border-t border-black/5">
              <button
                type="button"
                onClick={onClose}
                disabled={uploading}
                className="rounded-full border border-black/10 px-5 py-2.5 text-xs font-black text-[#151515]"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={uploading}
                className="hub-lift rounded-full bg-[#151515] px-6 py-2.5 text-xs font-black text-white hover:bg-[#292929] disabled:opacity-50"
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
