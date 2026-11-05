import React, { useState, useEffect } from 'react';
import { attendanceService } from '../../../services/courseService';
import Badge from '../../../components/common/Badge';
import Button from '../../../components/common/Button';
import SpotlightCard from '../../../components/common/SpotlightCard';

export function AttendanceTab({ courseId = 'mock-1', isCreatorOrStaff = false, user }) {
  const [sessions, setSessions] = useState(() => attendanceService.getSessions(courseId));
  const [selectedSessionId, setSelectedSessionId] = useState(() => {
    const initial = attendanceService.getSessions(courseId);
    return initial[0]?.id || null;
  });
  const [isCreatingSession, setIsCreatingSession] = useState(false);
  const [newDate, setNewDate] = useState(() => new Date().toISOString().slice(0, 10));
  const [newTopic, setNewTopic] = useState('');

  useEffect(() => {
    const loaded = attendanceService.getSessions(courseId);
    setSessions(loaded);
    if (loaded.length > 0 && !loaded.some((s) => s.id === selectedSessionId)) {
      setSelectedSessionId(loaded[0].id);
    }
  }, [courseId]);

  const handleCreateSession = (e) => {
    e.preventDefault();
    const created = attendanceService.createSession(courseId, {
      date: newDate,
      topic: newTopic.trim() || `Lecture Session (${newDate})`,
      createdBy: user?.name || 'Dr. Alan Turing',
    });
    const refreshed = attendanceService.getSessions(courseId);
    setSessions(refreshed);
    setSelectedSessionId(created.id);
    setNewTopic('');
    setIsCreatingSession(false);
  };

  const handleStatusChange = (sessionId, studentId, status) => {
    const updated = attendanceService.updateRecord(courseId, sessionId, studentId, status);
    setSessions(updated);
  };

  const handleMarkAllPresent = (sessionId) => {
    const target = sessions.find((s) => s.id === sessionId);
    if (!target) return;
    let updated = sessions;
    target.records.forEach((r) => {
      updated = attendanceService.updateRecord(courseId, sessionId, r.studentId, 'PRESENT');
    });
    setSessions([...updated]);
  };

  const currentStudentId = user?.id?.includes('student') ? user.id : 'user-student-1';
  const mySessionRecords = sessions.map((s) => {
    const rec =
      s.records.find(
        (r) =>
          r.studentId === currentStudentId ||
          r.studentName?.toLowerCase() === user?.name?.toLowerCase()
      ) || s.records[0];
    return {
      sessionId: s.id,
      date: s.date,
      topic: s.topic,
      createdBy: s.createdBy,
      status: rec?.status || 'PRESENT',
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
            {isCreatorOrStaff ? 'Instructor Attendance Roll & Session Manager' : 'My Course Attendance Log'}
          </h2>
          {isCreatorOrStaff && (
            <Button onClick={() => setIsCreatingSession(!isCreatingSession)}>
              {isCreatingSession ? 'Cancel' : '+ New Attendance Session'}
            </Button>
          )}
        </div>

        {isCreatorOrStaff && isCreatingSession && (
          <form onSubmit={handleCreateSession} className="p-5 rounded-2xl bg-slate-50 dark:bg-white/[0.03] border border-slate-200 dark:border-white/10 space-y-4">
            <div className="grid sm:grid-cols-3 gap-4">
              <input type="date" required value={newDate} onChange={(e) => setNewDate(e.target.value)} className="rounded-xl border border-slate-200 dark:border-gray-800 bg-white dark:bg-[#030712] px-3.5 py-2 text-xs font-bold text-slate-900 dark:text-white" />
              <input type="text" required placeholder="Lecture Topic" value={newTopic} onChange={(e) => setNewTopic(e.target.value)} className="sm:col-span-2 rounded-xl border border-slate-200 dark:border-gray-800 bg-white dark:bg-[#030712] px-3.5 py-2 text-xs text-slate-900 dark:text-white" />
            </div>
            <Button type="submit" size="sm">Start Roll Call</Button>
          </form>
        )}

        {isCreatorOrStaff && activeSession ? (
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <div className="flex gap-2">
                {sessions.map((s) => (
                  <button key={s.id} onClick={() => setSelectedSessionId(s.id)} className="px-3 py-1.5 rounded-lg border border-slate-200 dark:border-white/10 text-xs font-bold">
                    {s.date}
                  </button>
                ))}
              </div>
              <Button size="sm" variant="secondary" onClick={() => handleMarkAllPresent(activeSession.id)}>
                Mark All Present
              </Button>
            </div>
            <table className="w-full text-left border-collapse text-xs">
              <tbody>
                {activeSession.records.map((rec) => (
                  <tr key={rec.studentId} className="border-b border-slate-100 dark:border-white/5">
                    <td className="py-3 px-4 font-bold">{rec.studentName}</td>
                    <td className="py-3 px-4 text-right space-x-1.5">
                      {['PRESENT', 'LATE', 'ABSENT'].map((st) => (
                        <button key={st} type="button" onClick={() => handleStatusChange(activeSession.id, rec.studentId, st)} className="px-2.5 py-1 rounded border text-[10px] font-bold">
                          {st}
                        </button>
                      ))}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <table className="w-full text-left border-collapse text-xs">
            <tbody>
              {mySessionRecords.map((rec) => (
                <tr key={rec.sessionId} className="border-b border-slate-100 dark:border-white/5">
                  <td className="py-3 px-4 font-mono">{rec.date}</td>
                  <td className="py-3 px-4 font-bold">{rec.topic}</td>
                  <td className="py-3 px-4 text-right"><Badge variant="active">{rec.status}</Badge></td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

export default AttendanceTab;
