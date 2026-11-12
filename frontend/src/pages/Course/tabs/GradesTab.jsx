import React, { useState, useEffect } from 'react';
import { gradeService } from '../../../services/courseService';
import Badge from '../../../components/common/Badge';
import Button from '../../../components/common/Button';
import SpotlightCard from '../../../components/common/SpotlightCard';

function normalizeType(type = '') {
  const t = String(type).toUpperCase();
  if (t.includes('ASSIGN')) return 'ASSIGNMENTS';
  if (t.includes('QUIZ')) return 'QUIZZES';
  if (t.includes('MID')) return 'MID_EXAM';
  if (t.includes('FINAL')) return 'FINAL_EXAM';
  if (t.includes('PARTICIP') || t.includes('ATTEND')) return 'PARTICIPATION';
  return t;
}

export function GradesTab({
  courseId,
  isCreatorOrStaff = false,
  overallCompletionPercent = 0,
}) {
  const [weights, setWeights] = useState(() => gradeService.getWeights(courseId));
  const [courseScores, setCourseScores] = useState(null);
  const [gradebook, setGradebook] = useState([]);
  const [isEditingWeights, setIsEditingWeights] = useState(false);
  const [savingWeights, setSavingWeights] = useState(false);

  useEffect(() => {
    let isMounted = true;
    gradeService.fetchWeights(courseId).then((data) => {
      if (isMounted && Array.isArray(data)) {
        setWeights(data);
      }
    });

    if (isCreatorOrStaff) {
      gradeService.getCourseGradebook(courseId).then((rows) => {
        if (isMounted && Array.isArray(rows)) {
          setGradebook(rows);
        }
      });
    } else {
      gradeService.getStudentOverview().then((overview) => {
        if (isMounted && overview?.courses) {
          const match = overview.courses.find((c) => c.id === courseId);
          if (match) setCourseScores(match);
        }
      });
    }

    return () => {
      isMounted = false;
    };
  }, [courseId, isCreatorOrStaff]);

  const studentScores = {
    ASSIGNMENTS: courseScores?.assignments ?? 0,
    QUIZZES: courseScores?.quizzes ?? 0,
    MID_EXAM: courseScores?.midExam ?? 0,
    FINAL_EXAM: courseScores?.finalExam ?? 0,
    PARTICIPATION: courseScores?.participation ?? 100,
  };

  const weightedTotal = weights.reduce((acc, w) => {
    const key = normalizeType(w.type || w.name);
    const sc = studentScores[key] ?? 0;
    return acc + (sc * Number(w.weight || 0)) / 100;
  }, 0);

  const handleSaveWeights = async (e) => {
    e.preventDefault();
    setSavingWeights(true);
    try {
      const saved = await gradeService.saveWeights(courseId, weights);
      if (Array.isArray(saved)) setWeights(saved);
      setIsEditingWeights(false);
    } finally {
      setSavingWeights(false);
    }
  };

  return (
    <div className="p-6 space-y-6">
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <SpotlightCard className="p-4">
          <p className="text-[10px] font-bold uppercase text-slate-400">
            {isCreatorOrStaff ? 'Enrolled in Gradebook' : 'Weighted Score'}
          </p>
          <p className="text-2xl font-black text-blue-600 dark:text-cyan-400 mt-1">
            {isCreatorOrStaff ? `${gradebook.length} Students` : `${weightedTotal.toFixed(1)}%`}
          </p>
        </SpotlightCard>
        <SpotlightCard className="p-4">
          <p className="text-[10px] font-bold uppercase text-slate-400">Content Progress</p>
          <p className="text-2xl font-black text-slate-900 dark:text-white mt-1">
            {overallCompletionPercent}%
          </p>
        </SpotlightCard>
      </div>

      <div className="rounded-2xl bg-white dark:bg-white/[0.02] border border-slate-200/80 dark:border-white/10 p-6 space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-extrabold text-slate-900 dark:text-white">
            Weighted Grading Rubric (GRADE_COMPONENTS)
          </h2>
          {isCreatorOrStaff && (
            <Button
              size="sm"
              variant="outline"
              onClick={() => setIsEditingWeights(!isEditingWeights)}
            >
              {isEditingWeights ? 'Cancel' : 'Configure Rubric Weights'}
            </Button>
          )}
        </div>

        {isEditingWeights ? (
          <form onSubmit={handleSaveWeights} className="space-y-3">
            {weights.map((w, idx) => (
              <div key={w.id || idx} className="grid grid-cols-3 gap-3 items-center text-xs">
                <input
                  type="text"
                  value={w.name}
                  onChange={(e) => {
                    const next = [...weights];
                    next[idx] = { ...w, name: e.target.value };
                    setWeights(next);
                  }}
                  className="col-span-2 rounded-lg border border-slate-200 dark:border-white/10 bg-white dark:bg-[#030712] px-3 py-2 font-bold"
                />
                <input
                  type="number"
                  min="0"
                  max="100"
                  value={w.weight}
                  onChange={(e) => {
                    const next = [...weights];
                    next[idx] = { ...w, weight: Number(e.target.value) };
                    setWeights(next);
                  }}
                  className="rounded-lg border border-slate-200 dark:border-white/10 bg-white dark:bg-[#030712] px-3 py-2 font-mono"
                />
              </div>
            ))}
            <div className="flex justify-end pt-2">
              <Button type="submit" size="sm" disabled={savingWeights}>
                {savingWeights ? 'Saving…' : 'Save Rubric'}
              </Button>
            </div>
          </form>
        ) : (
          <table className="w-full text-left border-collapse text-xs">
            <tbody>
              {weights.map((w, idx) => {
                const key = normalizeType(w.type || w.name);
                return (
                  <tr
                    key={w.id || idx}
                    className="border-b border-slate-100 dark:border-white/5"
                  >
                    <td className="py-3 px-4 font-bold">{w.name}</td>
                    <td className="py-3 px-4">
                      <Badge variant="info">{w.weight}%</Badge>
                    </td>
                    {!isCreatorOrStaff && (
                      <td className="py-3 px-4 text-right font-mono">
                        {studentScores[key] ?? 0} / 100
                      </td>
                    )}
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>

      {isCreatorOrStaff && (
        <div className="rounded-2xl bg-white dark:bg-white/[0.02] border border-slate-200/80 dark:border-white/10 p-6">
          <h2 className="text-lg font-extrabold text-slate-900 dark:text-white mb-4">
            Course Gradebook Roster
          </h2>
          {gradebook.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="border-b border-slate-200 dark:border-white/10 text-[10px] font-bold uppercase text-slate-400">
                    <th className="py-2.5 px-4">Student</th>
                    <th className="py-2.5 px-4">Assignments</th>
                    <th className="py-2.5 px-4">Quizzes</th>
                    <th className="py-2.5 px-4">Attendance</th>
                    <th className="py-2.5 px-4">Weighted</th>
                    <th className="py-2.5 px-4 text-right">Grade</th>
                  </tr>
                </thead>
                <tbody>
                  {gradebook.map((row) => (
                    <tr
                      key={row.id || row.studentId}
                      className="border-b border-slate-100 dark:border-white/5"
                    >
                      <td className="py-3 px-4">
                        <p className="font-bold">{row.name}</p>
                        <p className="text-[10px] text-slate-500">{row.email}</p>
                      </td>
                      <td className="py-3 px-4 font-mono">{row.assignments}%</td>
                      <td className="py-3 px-4 font-mono">{row.quizzes}%</td>
                      <td className="py-3 px-4 font-mono">{row.attendance}%</td>
                      <td className="py-3 px-4 font-mono font-bold text-blue-600 dark:text-cyan-400">
                        {row.grade}%
                      </td>
                      <td className="py-3 px-4 text-right">
                        <Badge variant="active">{row.letter}</Badge>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p className="text-xs text-slate-400 italic">
              No enrolled students in this course gradebook yet.
            </p>
          )}
        </div>
      )}
    </div>
  );
}

export default GradesTab;
