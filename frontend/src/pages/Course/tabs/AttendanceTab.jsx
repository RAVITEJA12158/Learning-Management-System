import React, { useState, useEffect } from 'react';
import { attendanceService } from '../../../services/courseService';
import Badge from '../../../components/common/Badge';
import Button from '../../../components/common/Button';
import SpotlightCard from '../../../components/common/SpotlightCard';

export function AttendanceTab({ courseId, isCreatorOrStaff = false, user }) {
  const [sessions, setSessions] = useState([]);
  const [selectedSessionId, setSelectedSessionId] = useState(null);
  const [isCreatingSession, setIsCreatingSession] = useState(false);
  const [newDate, setNewDate] = useState(() => new Date().toISOString().slice(0, 10));
  const [newTopic, setNewTopic] = useState('');

  const loadSessions = async () => {
    const loaded = await attendanceService.fetchSessions(courseId, isCreatorOrStaff);
    if (Array.isArray(loaded)) {
      setSessions(loaded);
      if (loaded.length > 0) {
        setSelectedSessionId((prev) =>
          loaded.some((s) => s.id === prev) ? prev : loaded[0].id
        );
      }
    }
  };

  useEffect(() => {
    loadSessions();
  }, [courseId, isCreatorOrStaff]);

  const handleCreateSession = async (e) => {
    e.preventDefault();
    const created = await attendanceService.createSession(courseId, {
      date: newDate,
      topic: newTopic.trim() || `Lecture Session (${newDate})`,
    });
    await loadSessions();
    if (created && created.id) {
      setSelectedSessionId(created.id);
    }
    setNewTopic('');
    setIsCreatingSession(false);
  };

  const handleStatusChange = async (sessionId, studentId, status) => {
    try {
      await attendanceService.updateRecord(courseId, sessionId, studentId, status);
      setSessions((prev) =>
        prev.map((sess) =>
          sess.id !== sessionId
            ? sess
            : {
                ...sess,
                records: (sess.records || []).map((rec) =>
                  rec.studentId === studentId ? { ...rec, status } : rec
                ),
              }
        )
      );
    } catch (err) {
      console.error('Failed to update attendance status:', err);
    }
  };

  const handleMarkAllPresent = async (sessionId) => {
    try {
      await attendanceService.markAllPresent(courseId, sessionId);
      setSessions((prev) =>
        prev.map((sess) =>
          sess.id !== sessionId
            ? sess
            : {
                ...sess,
                records: (sess.records || []).map((rec) => ({
                  ...rec,
                  status: 'PRESENT',
                })),
              }
        )
      );
    } catch (err) {
      console.error('Failed to mark all present:', err);
    }
  };

  const currentStudentId = user?.id || 'me';
  const mySessionRecords = sessions.map((s) => {
    const recordsArr = Array.isArray(s.records) ? s.records : [];
    const rec =
      recordsArr.find(
        (r) =>
          r.studentId === currentStudentId ||
          r.studentName?.toLowerCase() === user?.name?.toLowerCase()
      ) || recordsArr[0];
    return {
      sessionId: s.id,
      date: s.date,
      topic: s.topic,
      createdBy: s.createdBy,
      status: s.status || rec?.status || 'PRESENT',
    };
  });

  const presentCount = mySessionRecords.filter((r) => r.status === 'PRESENT').length;
  const lateCount = mySessionRecords.filter((r) => r.status === 'LATE').length;
  const absentCount = mySessionRecords.filter((r) => r.status === 'ABSENT').length;
  const derivedPercentage =
    mySessionRecords.length > 0
      ? Math.round(((presentCount + lateCount * 0.5) / mySessionRecords.length) * 100)
      : 100;

  const activeSession = sessions.find((s) => s.id === selectedSessionId) || sessions[0];

  return (
    <div className="p-6 space-y-6">
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <SpotlightCard className="p-4">
          <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-gray-400">
            Derived Attendance %
          </p>
          <p className="text-2xl font-black text-emerald-600 dark:text-emerald-400 mt-1">
            {derivedPercentage}%
          </p>
        </SpotlightCard>
        <SpotlightCard className="p-4">
          <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-gray-400">
            Total Sessions
          </p>
          <p className="text-2xl font-black text-slate-900 dark:text-white mt-1">
            {sessions.length}
          </p>
        </SpotlightCard>
        <SpotlightCard className="p-4">
          <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-gray-400">
            Present / Late
          </p>
          <p className="text-2xl font-black text-blue-600 dark:text-cyan-400 mt-1">
            {presentCount} / {lateCount}
          </p>
        </SpotlightCard>
        <SpotlightCard className="p-4">
          <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-gray-400">
            Absences
          </p>
          <p className="text-2xl font-black text-amber-600 dark:text-amber-400 mt-1">
            {absentCount}
          </p>
        </SpotlightCard>
      </div>

      <div className="rounded-2xl bg-white dark:bg-white/[0.02] backdrop-blur-xl border border-slate-200/80 dark:border-white/10 p-6 shadow-xs space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 dark:border-white/5 pb-4">
          <h2 className="text-lg font-extrabold text-slate-900 dark:text-white">
            {isCreatorOrStaff
              ? 'Instructor Attendance Roll & Session Manager'
              : 'My Course Attendance Log'}
          </h2>
          {isCreatorOrStaff && (
            <Button onClick={() => setIsCreatingSession(!isCreatingSession)}>
              {isCreatingSession ? 'Cancel' : '+ New Attendance Session'}
            </Button>
          )}
        </div>

        {isCreatorOrStaff && isCreatingSession && (
          <form
            onSubmit={handleCreateSession}
            className="p-5 rounded-2xl bg-slate-50 dark:bg-white/[0.03] border border-slate-200 dark:border-white/10 space-y-4"
          >
            <div className="grid sm:grid-cols-3 gap-4">
              <input
                type="date"
                required
                value={newDate}
                onChange={(e) => setNewDate(e.target.value)}
                className="rounded-xl border border-slate-200 dark:border-gray-800 bg-white dark:bg-[#030712] px-3.5 py-2 text-xs font-bold text-slate-900 dark:text-white"
              />
              <input
                type="text"
                required
                placeholder="Lecture Topic (e.g. Gradient Descent & Optimization)"
                value={newTopic}
                onChange={(e) => setNewTopic(e.target.value)}
                className="sm:col-span-2 rounded-xl border border-slate-200 dark:border-gray-800 bg-white dark:bg-[#030712] px-3.5 py-2 text-xs text-slate-900 dark:text-white"
              />
            </div>
            <Button type="submit" size="sm">
              Start Roll Call
            </Button>
          </form>
        )}

        {isCreatorOrStaff && activeSession ? (
          <div className="space-y-4">
            <div className="flex flex-wrap justify-between items-center gap-3">
              <div className="flex flex-wrap gap-2">
                {sessions.map((s) => (
                  <button
                    key={s.id}
                    onClick={() => setSelectedSessionId(s.id)}
                    className={`px-3 py-1.5 rounded-lg border text-xs font-bold cursor-pointer ${
                      activeSession.id === s.id
                        ? 'bg-[#0066FF] text-white border-transparent'
                        : 'border-slate-200 dark:border-white/10 text-slate-700 dark:text-gray-300'
                    }`}
                  >
                    {s.date}
                  </button>
                ))}
              </div>
              <Button
                size="sm"
                variant="secondary"
                onClick={() => handleMarkAllPresent(activeSession.id)}
              >
                Mark All Present
              </Button>
            </div>

            {activeSession.topic && (
              <p className="text-xs font-semibold text-slate-500 dark:text-gray-400">
                Session Topic: <strong className="text-slate-900 dark:text-white">{activeSession.topic}</strong>
              </p>
            )}

            <table className="w-full text-left border-collapse text-xs">
              <tbody>
                {(activeSession.records || []).map((rec) => (
                  <tr
                    key={rec.studentId}
                    className="border-b border-slate-100 dark:border-white/5"
                  >
                    <td className="py-3 px-4 font-bold">{rec.studentName}</td>
                    <td className="py-3 px-4 text-right space-x-1.5">
                      {['PRESENT', 'LATE', 'ABSENT'].map((st) => {
                        const active = rec.status === st;
                        return (
                          <button
                            key={st}
                            type="button"
                            onClick={() =>
                              handleStatusChange(activeSession.id, rec.studentId, st)
                            }
                            className={`px-2.5 py-1 rounded border text-[10px] font-bold cursor-pointer transition ${
                              active
                                ? st === 'PRESENT'
                                  ? 'bg-emerald-600 text-white border-emerald-600'
                                  : st === 'LATE'
                                  ? 'bg-amber-500 text-white border-amber-500'
                                  : 'bg-red-600 text-white border-red-600'
                                : 'border-slate-200 dark:border-white/10 text-slate-600 dark:text-gray-400'
                            }`}
                          >
                            {st}
                          </button>
                        );
                      })}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <table className="w-full text-left border-collapse text-xs">
            <tbody>
              {mySessionRecords.length > 0 ? (
                mySessionRecords.map((rec) => (
                  <tr
                    key={rec.sessionId}
                    className="border-b border-slate-100 dark:border-white/5"
                  >
                    <td className="py-3 px-4 font-mono">{rec.date}</td>
                    <td className="py-3 px-4 font-bold">{rec.topic}</td>
                    <td className="py-3 px-4 text-right">
                      <Badge
                        variant={
                          rec.status === 'ABSENT'
                            ? 'danger'
                            : rec.status === 'LATE'
                            ? 'warning'
                            : 'active'
                        }
                      >
                        {rec.status}
                      </Badge>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="3" className="py-6 text-center text-slate-400 italic">
                    No attendance sessions recorded yet.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

export default AttendanceTab;
