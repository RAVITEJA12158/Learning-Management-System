import React from 'react';
import Badge from '../../../components/common/Badge';

export function RosterTab({ course }) {
  const instructors = course?.instructors || [{ id: 'inst-1', name: course?.instructorName || 'Dr. Alan Turing', email: 'alan.turing@university.edu', role: 'Lead Instructor' }];
  const roster = course?.roster || [];

  return (
    <div className="p-6 space-y-6">
      <div className="rounded-2xl bg-white dark:bg-white/[0.02] border border-slate-200/80 dark:border-white/10 p-6">
        <h2 className="text-base font-extrabold text-slate-900 dark:text-white mb-4">Teaching Team (COURSE_INSTRUCTORS)</h2>
        <div className="grid sm:grid-cols-2 gap-3.5">
          {instructors.map((inst) => (
            <div key={inst.id} className="flex items-center justify-between p-4 rounded-xl bg-slate-50 dark:bg-white/[0.02] border border-slate-200/70 dark:border-white/5">
              <div>
                <p className="text-xs font-bold text-slate-900 dark:text-white">{inst.name}</p>
                <p className="text-[11px] text-slate-500 dark:text-gray-400">{inst.email}</p>
              </div>
              <Badge variant="info">{inst.role}</Badge>
            </div>
          ))}
        </div>
      </div>

      <div className="rounded-2xl bg-white dark:bg-white/[0.02] border border-slate-200/80 dark:border-white/10 p-6">
        <h2 className="text-base font-extrabold text-slate-900 dark:text-white mb-4">Enrolled Students Roster (COURSE_ENROLLMENTS)</h2>
        <table className="w-full text-left border-collapse text-xs">
          <tbody>
            {roster.map((st) => (
              <tr key={st.id} className="border-b border-slate-100 dark:border-white/5">
                <td className="py-3 px-4 font-bold">{st.name}</td>
                <td className="py-3 px-4 text-slate-500">{st.email}</td>
                <td className="py-3 px-4 text-right"><Badge variant="active">{st.status || 'active'}</Badge></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default RosterTab;
