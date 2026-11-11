import React, { useState, useEffect } from 'react';
import { courseService } from '../../../services/courseService';
import Badge from '../../../components/common/Badge';

export function RosterTab({ course, courseId, isCreatorOrStaff }) {
  const [roster, setRoster] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    let isMounted = true;
    if (isCreatorOrStaff && courseId) {
      setLoading(true);
      courseService
        .getRoster(courseId)
        .then((data) => {
          if (isMounted && Array.isArray(data)) {
            setRoster(data);
          }
        })
        .finally(() => {
          if (isMounted) setLoading(false);
        });
    }
    return () => {
      isMounted = false;
    };
  }, [courseId, isCreatorOrStaff]);

  const handleStatusChange = async (studentId, nextStatus) => {
    try {
      await courseService.updateRosterStatus(courseId, studentId, nextStatus);
      const refreshed = await courseService.getRoster(courseId);
      setRoster(refreshed);
    } catch (err) {
      console.error('Failed to update roster status:', err);
    }
  };

  // Build instructor list from course.instructors or course.createdBy
  const rawInstructors = Array.isArray(course?.instructors) ? course.instructors : [];
  const instructors =
    rawInstructors.length > 0
      ? rawInstructors.map((inst) => ({
          id: inst.faculty?.id || inst.facultyId || inst.id,
          name: inst.faculty?.name || inst.name || course?.createdBy?.name || 'Course Instructor',
          email: inst.faculty?.email || inst.email || '',
          role:
            (inst.faculty?.id || inst.facultyId) === course?.createdById
              ? 'Lead Instructor'
              : 'Co-Instructor',
        }))
      : [
          {
            id: course?.createdBy?.id || 'inst-1',
            name: course?.instructorName || course?.createdBy?.name || 'Course Instructor',
            email: course?.createdBy?.email || '',
            role: 'Lead Instructor',
          },
        ];

  return (
    <div className="p-6 space-y-6">
      <div className="rounded-2xl bg-white dark:bg-white/[0.02] border border-slate-200/80 dark:border-white/10 p-6">
        <h2 className="text-base font-extrabold text-slate-900 dark:text-white mb-4">
          Teaching Team (COURSE_INSTRUCTORS)
        </h2>
        <div className="grid sm:grid-cols-2 gap-3.5">
          {instructors.map((inst) => (
            <div
              key={inst.id}
              className="flex items-center justify-between p-4 rounded-xl bg-slate-50 dark:bg-white/[0.02] border border-slate-200/70 dark:border-white/5"
            >
              <div>
                <p className="text-xs font-bold text-slate-900 dark:text-white">{inst.name}</p>
                {inst.email && (
                  <p className="text-[11px] text-slate-500 dark:text-gray-400">{inst.email}</p>
                )}
              </div>
              <Badge variant="info">{inst.role}</Badge>
            </div>
          ))}
        </div>
      </div>

      <div className="rounded-2xl bg-white dark:bg-white/[0.02] border border-slate-200/80 dark:border-white/10 p-6">
        <h2 className="text-base font-extrabold text-slate-900 dark:text-white mb-4">
          Enrolled Students Roster (COURSE_ENROLLMENTS)
        </h2>
        {!isCreatorOrStaff ? (
          <p className="text-xs text-slate-500 dark:text-gray-400">
            Student roster details are restricted to course instructors and administrators.
          </p>
        ) : loading ? (
          <p className="text-xs text-slate-400">Loading course roster…</p>
        ) : roster.length > 0 ? (
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-slate-200 dark:border-white/10 text-[10px] font-bold uppercase text-slate-400">
                <th className="py-2.5 px-4">Student</th>
                <th className="py-2.5 px-4">Email</th>
                <th className="py-2.5 px-4 text-right">Enrollment Status</th>
              </tr>
            </thead>
            <tbody>
              {roster.map((enr) => {
                const student = enr.student || enr;
                const studentId = enr.studentId || student.id;
                const status = enr.status || 'ACTIVE';
                return (
                  <tr
                    key={enr.id || studentId}
                    className="border-b border-slate-100 dark:border-white/5"
                  >
                    <td className="py-3 px-4 font-bold">{student.name}</td>
                    <td className="py-3 px-4 text-slate-500">{student.email}</td>
                    <td className="py-3 px-4 text-right">
                      <select
                        value={status}
                        onChange={(e) => handleStatusChange(studentId, e.target.value)}
                        className="rounded-lg border border-slate-200 dark:border-white/10 bg-white dark:bg-[#030712] px-2.5 py-1 text-xs font-bold"
                      >
                        <option value="ACTIVE">ACTIVE</option>
                        <option value="COMPLETED">COMPLETED</option>
                        <option value="DROPPED">DROPPED</option>
                      </select>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        ) : (
          <p className="text-xs text-slate-400 italic">No students enrolled in this course yet.</p>
        )}
      </div>
    </div>
  );
}

export default RosterTab;
