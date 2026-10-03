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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-fade-in">
      <div className="relative flex max-h-[90vh] w-full max-w-4xl flex-col rounded-[28px] border border-black/10 bg-white p-6 sm:p-8 shadow-2xl overflow-hidden">
        
        {/* Modal Header */}
        <div className="flex items-start justify-between border-b border-black/5 pb-4 mb-5">
          <div>
            <div className="flex items-center gap-2">
              <span className="rounded-full bg-[#151515] px-3 py-1 text-[10px] font-black uppercase text-white">
                Instructor Grading Desk
              </span>
              <span className="rounded-full bg-[#DFFF63] px-3 py-1 text-[10px] font-black uppercase text-[#151515]">
                Max: {assignment.maxMarks} pts
              </span>
            </div>
            <h2 className="mt-2 text-2xl font-black tracking-[-.03em] text-[#151515]">
              {assignment.title}
            </h2>
          </div>

          <button
            onClick={onClose}
            className="flex h-8 w-8 items-center justify-center rounded-full border border-black/10 text-xs font-black text-[#151515] hover:bg-black/5"
          >
            ✕
          </button>
        </div>

        {/* Content Area */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 flex-1 overflow-y-auto pr-1">
          {/* Submissions List */}
          <div className="space-y-3">
            <h3 className="text-xs font-black uppercase tracking-wider text-[#151515]/60">
              Student Submissions ({submissions.length})
            </h3>

            {loading ? (
              <p className="text-xs font-bold text-[#151515]/50">Loading submissions...</p>
            ) : submissions.length > 0 ? (
              <div className="space-y-2">
                {submissions.map((sub) => (
                  <div
                    key={sub.id}
                    onClick={() => handleSelectSubmission(sub)}
                    className={`cursor-pointer rounded-2xl border p-4 transition ${
                      selectedSubmission?.id === sub.id
                        ? 'border-[#151515] bg-[#FAF8F5] shadow-sm'
                        : 'border-black/10 bg-white hover:border-black/25'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <p className="text-xs font-black text-[#151515]">
                        {sub.student?.name || 'Student'}
                      </p>
                      <span
                        className={`rounded-full px-2 py-0.5 text-[9px] font-black uppercase ${
                          sub.status === 'LATE'
                            ? 'bg-[#FFF1ED] text-[#B83D29]'
                            : 'bg-[#EDF9F5] text-[#18765D]'
                        }`}
                      >
                        {sub.status}
                      </span>
                    </div>
                    <p className="text-[11px] text-[#151515]/50 mt-1">
                      {new Date(sub.submittedAt).toLocaleString()}
                    </p>
                    <div className="mt-2 flex items-center justify-between text-[11px] font-bold">
                      <span className="text-[#151515]/60">
                        {sub.marks !== null ? `Graded: ${sub.marks}/${assignment.maxMarks}` : 'Ungraded'}
                      </span>
                      <a
                        href={sub.fileUrl}
                        target="_blank"
                        rel="noreferrer"
                        onClick={(e) => e.stopPropagation()}
                        className="text-[#151515] underline hover:text-[#E85B43]"
                      >
                        Download File ↗
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="rounded-2xl border border-black/10 bg-[#FAF8F5] p-6 text-center text-xs font-bold text-[#151515]/50">
                No submissions received for this assignment yet.
              </div>
            )}
          </div>

          {/* Grading Desk Form */}
          <div className="rounded-2xl border border-black/10 bg-[#FAF8F5] p-5">
            {selectedSubmission ? (
              <form onSubmit={handleSaveGrade} className="space-y-4">
                <div className="border-b border-black/5 pb-3">
                  <h4 className="text-sm font-black text-[#151515]">
                    Grading: {selectedSubmission.student?.name}
                  </h4>
                  <p className="text-[11px] text-[#151515]/50">
                    {selectedSubmission.student?.email}
                  </p>
                </div>

                {message && (
                  <div className="rounded-xl border border-[#B7E4D5] bg-[#EDF9F5] p-3 text-xs font-bold text-[#18765D]">
                    {message}
                  </div>
                )}

                {error && (
                  <div className="rounded-xl border border-[#F2C7BC] bg-[#FFF1ED] p-3 text-xs font-bold text-[#B83D29]">
                    {error}
                  </div>
                )}

                <div>
                  <label className="block text-xs font-black uppercase tracking-wider text-[#151515]/60 mb-1">
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
                    className="w-full rounded-xl border border-black/15 bg-white px-4 py-2.5 text-sm font-bold focus:border-black focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-black uppercase tracking-wider text-[#151515]/60 mb-1">
                    Instructor Feedback & Notes
                  </label>
                  <textarea
                    rows={4}
                    value={feedback}
                    onChange={(e) => setFeedback(e.target.value)}
                    placeholder="Provide constructive feedback for the student..."
                    className="w-full rounded-xl border border-black/15 bg-white p-3 text-xs font-medium focus:border-black focus:outline-none"
                  />
                </div>

                <button
                  type="submit"
                  disabled={saving}
                  className="hub-lift w-full rounded-full bg-[#151515] py-3 text-xs font-black text-white disabled:opacity-50"
                >
                  {saving ? 'Saving Grade...' : 'Save & Publish Grade'}
                </button>
              </form>
            ) : (
              <div className="flex h-full items-center justify-center text-center p-8 text-xs font-bold text-[#151515]/40">
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
