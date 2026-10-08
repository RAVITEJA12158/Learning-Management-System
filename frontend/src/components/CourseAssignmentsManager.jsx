import React, { useState, useEffect } from 'react';
import { assignmentService } from '../services/courseService';
import AssignmentSubmissionModal from './AssignmentSubmissionModal';
import InstructorGradingModal from './InstructorGradingModal';

function CourseAssignmentsManager({ courseId, canManage = false, isEnrolled = false }) {
  const [assignments, setAssignments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isCreating, setIsCreating] = useState(false);

  // Form state
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [maxMarks, setMaxMarks] = useState('100');
  const [dueDate, setDueDate] = useState('');
  const [allowLateSubmission, setAllowLateSubmission] = useState(false);
  const [formError, setFormError] = useState('');
  const [formLoading, setFormLoading] = useState(false);

  // Modals state
  const [submittingAssignment, setSubmittingAssignment] = useState(null);
  const [gradingAssignment, setGradingAssignment] = useState(null);

  useEffect(() => {
    fetchAssignments();
  }, [courseId]);

  const fetchAssignments = async () => {
    try {
      const data = await assignmentService.getByCourse(courseId);
      setAssignments(data);
    } catch (err) {
      console.error('Failed to load assignments:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateAssignment = async (e) => {
    e.preventDefault();
    if (!title.trim() || !dueDate) {
      setFormError('Title and due date are required.');
      return;
    }

    setFormLoading(true);
    setFormError('');
    try {
      await assignmentService.create({
        courseId,
        title,
        description,
        maxMarks: parseFloat(maxMarks),
        dueDate: new Date(dueDate).toISOString(),
        allowLateSubmission,
      });

      setTitle('');
      setDescription('');
      setMaxMarks('100');
      setDueDate('');
      setAllowLateSubmission(false);
      setIsCreating(false);
      fetchAssignments();
    } catch (err) {
      console.error(err);
      setFormError(err.message || 'Failed to create assignment.');
    } finally {
      setFormLoading(false);
    }
  };

  const handleDeleteAssignment = async (id) => {
    if (!window.confirm('Are you sure you want to delete this assignment?')) return;
    try {
      await assignmentService.delete(id);
      fetchAssignments();
    } catch (err) {
      console.error(err);
      alert('Failed to delete assignment');
    }
  };

  const formatCountdown = (dueDateString) => {
    const diff = new Date(dueDateString) - new Date();
    if (diff <= 0) return 'Deadline Passed';
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
    if (days > 0) return `${days}d ${hours}h left`;
    const mins = Math.floor((diff / (1000 * 60)) % 60);
    return `${hours}h ${mins}m left`;
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h3 className="text-2xl font-black tracking-tight text-slate-900 dark:text-white">
            Assignments & Assessments
          </h3>
          <p className="text-xs text-slate-500 dark:text-gray-400 mt-1">
            Submit coursework and track real-time grading, instructor feedback, and milestones.
          </p>
        </div>

        {canManage && (
          <button
            onClick={() => setIsCreating(!isCreating)}
            className="hub-lift inline-flex items-center gap-2 rounded-full bg-slate-900 dark:bg-white/[0.05] dark:border dark:border-white/10 dark:hover:bg-white/[0.1] px-5 py-2.5 text-xs font-black text-white hover:bg-slate-800 transition cursor-pointer"
          >
            {isCreating ? 'Cancel' : '+ New Assignment'}
          </button>
        )}
      </div>

      {/* Creation Form (Faculty/Admin) */}
      {isCreating && (
        <form
          onSubmit={handleCreateAssignment}
          className="rounded-2xl border border-slate-200 dark:border-white/10 bg-white dark:bg-white/[0.02] dark:backdrop-blur-xl p-6 shadow-md space-y-4 animate-fade-in"
        >
          <h4 className="text-sm font-black uppercase tracking-wider text-slate-900 dark:text-white">
            Create Assignment
          </h4>

          {formError && (
            <div className="rounded-xl border border-red-200 dark:border-red-900/50 bg-red-50 dark:bg-red-950/30 p-3 text-xs font-bold text-red-600 dark:text-red-400">
              {formError}
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-black uppercase tracking-wider text-slate-500 dark:text-gray-400 mb-1">
                Assignment Title *
              </label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Project 1: Database Schema & Indexing"
                className="w-full rounded-xl border border-slate-200 dark:border-gray-800 bg-white dark:bg-transparent px-4 py-2.5 text-sm font-medium text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-gray-500 focus:border-purple-500 focus:ring-1 focus:ring-purple-500/50 focus:outline-none transition"
              />
            </div>

            <div>
              <label className="block text-xs font-black uppercase tracking-wider text-slate-500 dark:text-gray-400 mb-1">
                Max Marks *
              </label>
              <input
                type="number"
                required
                value={maxMarks}
                onChange={(e) => setMaxMarks(e.target.value)}
                className="w-full rounded-xl border border-slate-200 dark:border-gray-800 bg-white dark:bg-transparent px-4 py-2.5 text-sm font-medium text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-gray-500 focus:border-purple-500 focus:ring-1 focus:ring-purple-500/50 focus:outline-none transition"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-black uppercase tracking-wider text-slate-500 dark:text-gray-400 mb-1">
                Due Date & Time *
              </label>
              <input
                type="datetime-local"
                required
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                className="w-full rounded-xl border border-slate-200 dark:border-gray-800 bg-white dark:bg-transparent px-4 py-2.5 text-sm font-medium text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-gray-500 focus:border-purple-500 focus:ring-1 focus:ring-purple-500/50 focus:outline-none transition"
              />
            </div>

            <div className="flex items-center gap-3 pt-6">
              <input
                type="checkbox"
                id="allowLate"
                checked={allowLateSubmission}
                onChange={(e) => setAllowLateSubmission(e.target.checked)}
                className="h-4 w-4 rounded border-slate-300 dark:border-gray-700 text-purple-600 focus:ring-purple-500"
              />
              <label htmlFor="allowLate" className="text-xs font-bold text-slate-700 dark:text-gray-300">
                Allow late submissions (marked with LATE status)
              </label>
            </div>
          </div>

          <div>
            <label className="block text-xs font-black uppercase tracking-wider text-slate-500 dark:text-gray-400 mb-1">
              Instructions & Problem Statement
            </label>
            <textarea
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Provide assignment guidelines, deliverables, and requirements..."
              className="w-full rounded-xl border border-slate-200 dark:border-gray-800 bg-white dark:bg-transparent p-3 text-xs font-medium text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-gray-500 focus:border-purple-500 focus:ring-1 focus:ring-purple-500/50 focus:outline-none transition"
            />
          </div>

          <div className="flex justify-end gap-3">
            <button
              type="button"
              onClick={() => setIsCreating(false)}
              className="rounded-full border border-slate-200 dark:border-gray-700 px-4 py-2 text-xs font-black text-slate-700 dark:text-gray-300 hover:bg-slate-50 dark:hover:bg-white/[0.05]"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={formLoading}
              className="hub-lift rounded-full bg-blue-600 dark:bg-[#0066FF] hover:bg-blue-700 dark:hover:bg-blue-500 shadow-[0_0_15px_rgba(0,102,255,0.4)] px-6 py-2 text-xs font-black text-white disabled:opacity-50 transition"
            >
              {formLoading ? 'Publishing...' : 'Publish Assignment'}
            </button>
          </div>
        </form>
      )}

      {/* Assignment List */}
      {loading ? (
        <p className="text-xs font-bold text-slate-400 dark:text-gray-500">Loading assignments...</p>
      ) : assignments.length > 0 ? (
        <div className="grid gap-4">
          {assignments.map((assignment) => {
            const mySubmission = assignment.submissions?.[0];
            const isPastDue = new Date() > new Date(assignment.dueDate);
            const countdown = formatCountdown(assignment.dueDate);

            return (
              <div
                key={assignment.id}
                className="rounded-xl border border-slate-200 dark:border-gray-800 bg-white dark:bg-gray-900/50 p-6 shadow-sm transition hover:border-cyan-500/40 dark:hover:border-cyan-500/40"
              >
                <div className="flex flex-wrap items-start justify-between gap-4">
                  <div>
                    <div className="flex flex-wrap items-center gap-2 mb-2">
                      <span className="rounded-full bg-slate-900 dark:bg-white/10 border border-transparent dark:border-white/10 px-3 py-1 text-[10px] font-black uppercase text-white">
                        {assignment.maxMarks} Points
                      </span>
                      <span
                        className={`rounded-full px-3 py-1 text-[10px] font-black uppercase ${
                          isPastDue
                            ? 'bg-red-50 dark:bg-red-950/40 text-red-600 dark:text-red-400 border border-red-200 dark:border-red-900/50'
                            : 'bg-emerald-50 dark:bg-cyan-950/40 text-emerald-700 dark:text-cyan-300 border border-emerald-200 dark:border-cyan-800/40'
                        }`}
                      >
                        ⏱ {countdown}
                      </span>
                      {assignment.allowLateSubmission && (
                        <span className="rounded-full bg-slate-100 dark:bg-white/[0.03] border border-slate-200 dark:border-white/10 px-2.5 py-0.5 text-[9px] font-bold text-slate-600 dark:text-gray-400">
                          Late Submissions OK
                        </span>
                      )}
                    </div>

                    <h4 className="text-xl font-black tracking-tight text-slate-900 dark:text-white">
                      {assignment.title}
                    </h4>
                    {assignment.description && (
                      <p className="mt-2 text-xs leading-5 text-slate-600 dark:text-gray-400 max-w-2xl">
                        {assignment.description}
                      </p>
                    )}
                    <p className="mt-3 text-[11px] font-bold text-slate-400 dark:text-gray-500">
                      Due: {new Date(assignment.dueDate).toLocaleString()}
                    </p>
                  </div>

                  {/* Actions */}
                  <div className="flex flex-wrap items-center gap-3">
                    {canManage ? (
                      <>
                        <button
                          onClick={() => setGradingAssignment(assignment)}
                          className="hub-lift inline-flex items-center gap-2 rounded-xl bg-slate-900 dark:bg-white/10 dark:border dark:border-white/10 px-4 py-2 text-xs font-black text-white hover:bg-slate-800 dark:hover:bg-white/20 transition cursor-pointer"
                        >
                          Review Submissions ({assignment._count?.submissions || 0})
                        </button>
                        <button
                          onClick={() => handleDeleteAssignment(assignment.id)}
                          className="flex h-8 w-8 items-center justify-center rounded-full text-xs font-bold text-red-500 hover:bg-red-50 dark:hover:bg-red-950/40 transition cursor-pointer"
                          title="Delete Assignment"
                        >
                          🗑
                        </button>
                      </>
                    ) : isEnrolled ? (
                      <div className="text-right">
                        {mySubmission ? (
                          <div className="space-y-2">
                            <span
                              className={`inline-block rounded-full px-3 py-1 text-[10px] font-black uppercase ${
                                mySubmission.status === 'LATE'
                                  ? 'bg-red-50 dark:bg-red-950/40 text-red-600 dark:text-red-400 border border-red-200 dark:border-red-900/40'
                                  : 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800/40'
                              }`}
                            >
                              ✓ {mySubmission.status}
                            </span>
                            {mySubmission.marks !== null && mySubmission.marks !== undefined && (
                              <p className="text-xs font-black text-slate-900 dark:text-white">
                                Grade: {mySubmission.marks} / {assignment.maxMarks}
                              </p>
                            )}
                            <button
                              onClick={() => setSubmittingAssignment(assignment)}
                              className="block text-xs font-bold text-cyan-500 hover:text-cyan-400 underline cursor-pointer"
                            >
                              View / Resubmit
                            </button>
                          </div>
                        ) : (
                          <button
                            onClick={() => setSubmittingAssignment(assignment)}
                            className="hub-lift inline-flex items-center gap-2 rounded-xl bg-blue-600 dark:bg-[#0066FF] px-5 py-2.5 text-xs font-black text-white hover:bg-blue-700 dark:hover:bg-blue-500 shadow-[0_0_15px_rgba(0,102,255,0.4)] transition cursor-pointer"
                          >
                            Submit Assignment →
                          </button>
                        )}
                      </div>
                    ) : null}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="rounded-xl border border-slate-200 dark:border-gray-800 bg-white dark:bg-gray-900/50 p-8 text-center text-sm font-bold text-slate-400 dark:text-gray-500">
          No assignments scheduled for this course yet.
        </div>
      )}

      {/* Submission Modal */}
      <AssignmentSubmissionModal
        assignment={submittingAssignment}
        isOpen={Boolean(submittingAssignment)}
        onClose={() => setSubmittingAssignment(null)}
        onSuccess={fetchAssignments}
      />

      {/* Grading Modal */}
      <InstructorGradingModal
        assignment={gradingAssignment}
        isOpen={Boolean(gradingAssignment)}
        onClose={() => setGradingAssignment(null)}
        onRefresh={fetchAssignments}
      />
    </div>
  );
}

export default CourseAssignmentsManager;
