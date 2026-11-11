import React, { useState, useEffect } from 'react';
import { gradeService } from '../../../services/courseService';
import Badge from '../../../components/common/Badge';
import SpotlightCard from '../../../components/common/SpotlightCard';

export function GradesTab({ courseId, overallCompletionPercent = 75 }) {
  const [weights, setWeights] = useState(() => gradeService.getWeights(courseId));

  useEffect(() => {
    let isMounted = true;
    gradeService.fetchWeights(courseId).then(data => {
      if (isMounted && Array.isArray(data)) {
        setWeights(data);
      }
    });
    return () => { isMounted = false; };
  }, [courseId]);

  const studentScores = { ASSIGNMENTS: 94, QUIZZES: 89, MID_EXAM: 91, FINAL_EXAM: 93, PARTICIPATION: 96 };
  const weightedTotal = weights.reduce((acc, w) => acc + ((studentScores[w.type] ?? 90) * Number(w.weight || 0)) / 100, 0);

  return (
    <div className="p-6 space-y-6">
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <SpotlightCard className="p-4">
          <p className="text-[10px] font-bold uppercase text-slate-400">Weighted Score</p>
          <p className="text-2xl font-black text-blue-600 dark:text-cyan-400 mt-1">{weightedTotal.toFixed(1)}%</p>
        </SpotlightCard>
        <SpotlightCard className="p-4">
          <p className="text-[10px] font-bold uppercase text-slate-400">Content Progress</p>
          <p className="text-2xl font-black text-slate-900 dark:text-white mt-1">{overallCompletionPercent}%</p>
        </SpotlightCard>
      </div>
      <div className="rounded-2xl bg-white dark:bg-white/[0.02] border border-slate-200/80 dark:border-white/10 p-6">
        <h2 className="text-lg font-extrabold text-slate-900 dark:text-white mb-4">Weighted Grading Rubric (GRADE_COMPONENTS)</h2>
        <table className="w-full text-left border-collapse text-xs">
          <tbody>
            {weights.map((w) => (
              <tr key={w.id} className="border-b border-slate-100 dark:border-white/5">
                <td className="py-3 px-4 font-bold">{w.name}</td>
                <td className="py-3 px-4"><Badge variant="info">{w.weight}%</Badge></td>
                <td className="py-3 px-4 text-right font-mono">{studentScores[w.type] ?? 90} / 100</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default GradesTab;
