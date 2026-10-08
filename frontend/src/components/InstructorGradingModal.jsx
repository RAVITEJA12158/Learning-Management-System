import React, { useState, useEffect } from 'react';
import { assignmentService } from '../services/courseService';

function InstructorGradingModal({ assignment, isOpen, onClose, onRefresh }) {
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedSubmission, setSelectedSubmission] = useState(null);
  const [marks, setMarks] = useState('');
  const [feedback, setFeedback] = useState('');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');

  useEffect(() => {
    if (isOpen && assignment) {
      fetchSubmissions();
    }
  }, [isOpen, assignment]);

  const fetchSubmissions = async () => {
    setLoading(true);
    try {
      const data = await assignmentService.getSubmissions(assignment.id);
      setSubmissions(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSelectSubmission = (sub) => {
    setSelectedSubmission(sub);
    setMarks(sub.marks !== null && sub.marks !== undefined ? sub.marks : '');
    setFeedback(sub.feedback || '');
    setError('');
    setMessage('');
  };

  const handleSaveGrade = async (e) => {
    e.preventDefault();
    if (!selectedSubmission) return;

    const numMarks = parseFloat(marks);
    if (isNaN(numMarks) || numMarks < 0 || numMarks > assignment.maxMarks) {
      setError(`Marks must be between 0 and ${assignment.maxMarks}`);
      return;
    }

    setSaving(true);
    setError('');
    try {
      await assignmentService.gradeSubmission(selectedSubmission.id, {
        marks: numMarks,
        feedback,
      });
      setMessage('Grade & feedback saved successfully!');
      fetchSubmissions();
      if (onRefresh) onRefresh();
    } catch (err) {
      console.error(err);
      setError(err.message || 'Failed to grade submission');
    } finally {
      setSaving(false);
    }
  };

  if (!isOpen || !assignment) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-md p-4 animate-fade-in">
      <div className="relative flex max-h-[90vh] w-full max-w-4xl flex-col rounded-2xl border border-slate-200 dark:border-white/10 bg-white dark:bg-[#030712] p-6 sm:p-8 shadow-2xl overflow-hidden transition-colors">
        
        {/* Modal Header */}
        <div className="flex items-start justify-between border-b border-slate-100 dark:border-white/5 pb-4 mb-5">
          <div>
            <div className="flex items-center gap-2">
              <span className="rounded-full bg-slate-900 dark:bg-white/10 border border-transparent dark:border-white/10 px-3 py-1 text-[10px] font-black uppercase text-white">
                Instructor Grading Desk
              </span>
              <span className="rounded-full bg-cyan-100 dark:bg-cyan-950/60 px-3 py-1 text-[10px] font-black uppercase text-cyan-800 dark:text-cyan-300 border border-transparent dark:border-cyan-800/40">
                Max: {assignment.maxMarks} pts
              </span>
            </div>
            <h2 className="mt-2 text-2xl font-black tracking-tight text-slate-900 dark:text-white">
              {assignment.title}
            </h2>
          </div>

          <button
            onClick={onClose}
            className="flex h-8 w-8 items-center justify-center rounded-full border border-slate-200 dark:border-white/10 text-xs font-black text-slate-600 dark:text-gray-300 hover:bg-slate-100 dark:hover:bg-white/10 transition cursor-pointer"
          >
            ✕
          </button>
        </div>

        {/* Content Area */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 flex-1 overflow-y-auto pr-1">
          {/* Submissions List */}
          <div className="space-y-3">
            <h3 className="text-xs font-black uppercase tracking-wider text-slate-500 dark:text-gray-400">
              Student Submissions ({submissions.length})
            </h3>

            {loading ? (
              <p className="text-xs font-bold text-slate-400 dark:text-gray-500">Loading submissions...</p>
            ) : submissions.length > 0 ? (
              <div className="space-y-2">
                {submissions.map((sub) => (
                  <div
                    key={sub.id}
                    onClick={() => handleSelectSubmission(sub)}
                    className={`cursor-pointer rounded-xl border p-4 transition ${
                      selectedSubmission?.id === sub.id
                        ? 'border-cyan-400 bg-cyan-500/10 dark:border-cyan-400 dark:bg-cyan-500/10'
                        : 'border-slate-200 dark:border-white/5 bg-white dark:bg-white/[0.02] hover:border-slate-300 dark:hover:border-white/10'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <p className="text-xs font-black text-slate-900 dark:text-white">
                        {sub.student?.name || 'Student'}
                      </p>
                      <span
                        className={`rounded-full px-2 py-0.5 text-[9px] font-black uppercase ${
                          sub.status === 'LATE'
                            ? 'bg-red-50 dark:bg-red-950/40 text-red-600 dark:text-red-400 border border-red-200 dark:border-red-900/40'
                            : 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800/40'
                        }`}
                      >
                        {sub.status}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-500 dark:text-gray-400 mt-1">
                      {new Date(sub.submittedAt).toLocaleString()}
                    </p>
                    <div className="mt-2 flex items-center justify-between text-[11px] font-bold">
                      <span className="text-slate-600 dark:text-gray-400">
                        {sub.marks !== null ? `Graded: ${sub.marks}/${assignment.maxMarks}` : 'Ungraded'}
                      </span>
                      <a
                        href={sub.fileUrl}
                        target="_blank"
                        rel="noreferrer"
                        onClick={(e) => e.stopPropagation()}
                        className="text-cyan-600 dark:text-cyan-400 underline hover:text-cyan-500"
                      >
                        Download File ↗
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="rounded-xl border border-slate-200 dark:border-white/5 bg-slate-50 dark:bg-white/[0.02] p-6 text-center text-xs font-bold text-slate-400 dark:text-gray-500">
                No submissions received for this assignment yet.
              </div>
            )}
          </div>

          {/* Grading Desk Form */}
          <div className="rounded-xl border border-slate-200 dark:border-white/5 bg-slate-50 dark:bg-white/[0.02] p-5">
            {selectedSubmission ? (
              <form onSubmit={handleSaveGrade} className="space-y-4">
                <div className="border-b border-slate-100 dark:border-white/5 pb-3">
                  <h4 className="text-sm font-black text-slate-900 dark:text-white">
                    Grading: {selectedSubmission.student?.name}
                  </h4>
                  <p className="text-[11px] text-slate-500 dark:text-gray-400">
                    {selectedSubmission.student?.email}
                  </p>
                </div>

                {message && (
                  <div className="rounded-xl border border-emerald-200 dark:border-emerald-900/50 bg-emerald-50 dark:bg-emerald-950/30 p-3 text-xs font-bold text-emerald-700 dark:text-emerald-400">
                    {message}
                  </div>
                )}

                {error && (
                  <div className="rounded-xl border border-red-200 dark:border-red-900/50 bg-red-50 dark:bg-red-950/30 p-3 text-xs font-bold text-red-600 dark:text-red-400">
                    {error}
                  </div>
                )}

                <div>
                  <label className="block text-xs font-black uppercase tracking-wider text-slate-500 dark:text-gray-400 mb-1">
                    Award Marks (Max: {assignment.maxMarks}) *
                  </label>
                  <input
                    type="number"
                    step="0.5"
                    min="0"
                    max={assignment.maxMarks}
                    required
                    value={marks}
                    onChange={(e) => setMarks(e.target.value)}
                    placeholder={`0 - ${assignment.maxMarks}`}
                    className="w-full rounded-xl border border-slate-200 dark:border-gray-800 bg-white dark:bg-transparent px-4 py-2.5 text-sm font-bold text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-gray-500 focus:border-purple-500 focus:ring-1 focus:ring-purple-500/50 focus:outline-none transition"
                  />
                </div>

                <div>
                  <label className="block text-xs font-black uppercase tracking-wider text-slate-500 dark:text-gray-400 mb-1">
                    Instructor Feedback & Notes
                  </label>
                  <textarea
                    rows={4}
                    value={feedback}
                    onChange={(e) => setFeedback(e.target.value)}
                    placeholder="Provide constructive feedback for the student..."
                    className="w-full rounded-xl border border-slate-200 dark:border-gray-800 bg-white dark:bg-transparent p-3 text-xs font-medium text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-gray-500 focus:border-purple-500 focus:ring-1 focus:ring-purple-500/50 focus:outline-none transition"
                  />
                </div>

                <button
                  type="submit"
                  disabled={saving}
                  className="hub-lift w-full rounded-full bg-blue-600 dark:bg-[#0066FF] hover:bg-blue-700 dark:hover:bg-blue-500 shadow-[0_0_15px_rgba(0,102,255,0.4)] py-3 text-xs font-black text-white disabled:opacity-50 transition cursor-pointer"
                >
                  {saving ? 'Saving Grade...' : 'Save & Publish Grade'}
                </button>
              </form>
            ) : (
              <div className="flex h-full items-center justify-center text-center p-8 text-xs font-bold text-slate-400 dark:text-gray-500">
                Select a student submission from the left panel to review and assign grades.
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}

export default InstructorGradingModal;
