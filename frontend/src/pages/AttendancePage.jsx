import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { courseService } from '../services/courseService';
import { AttendanceTab } from './Course/tabs/AttendanceTab';
import Badge from '../components/common/Badge';

function AttendancePage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const isStaff = user?.role?.toLowerCase() === 'faculty' || user?.role?.toLowerCase() === 'admin';
  const [courses, setCourses] = useState([]);
  const [selectedCourseId, setSelectedCourseId] = useState('');

  useEffect(() => {
    let isMounted = true;
    const loadCourses = async () => {
      try {
        let list = isStaff
          ? await courseService.getCreated()
          : await courseService.getEnrolled();
        if ((!list || list.length === 0) && !isStaff) {
          list = await courseService.getAll();
        }
        if (isMounted) {
          const valid = Array.isArray(list) ? list : [];
          setCourses(valid);
          setSelectedCourseId(valid[0]?.id || '');
        }
      } catch {
        if (isMounted) {
          setCourses([]);
          setSelectedCourseId('');
        }
      }
    };
    loadCourses();
    return () => { isMounted = false; };
  }, [isStaff]);

  return (
    <main className="mx-auto max-w-[1440px] px-4 py-6 sm:px-8 lg:py-10 w-full overflow-x-hidden font-sans transition-colors duration-200">
      <div className="mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <Badge variant="active" className="mb-2">Attendance Tracking</Badge>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">Academic Attendance Center</h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-gray-400 mt-1">Select a course below to inspect derived attendance percentages or record a live roll-call session.</p>
        </div>
      </div>
      {courses.length > 0 ? (
        <div className="flex flex-wrap items-center gap-2 mb-4">
          {courses.map(c => (
            <button
              key={c.id}
              onClick={() => setSelectedCourseId(c.id)}
              className={`min-h-[44px] px-4 py-2 rounded-xl text-xs font-bold transition cursor-pointer ${
                selectedCourseId === c.id
                  ? 'bg-[#0066FF] text-white shadow-[0_0_15px_rgba(0,102,255,0.4)]'
                  : 'bg-white dark:bg-white/[0.03] text-slate-600 dark:text-gray-400 border border-slate-200/80 dark:border-white/10 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              {c.courseCode}: {c.title}
            </button>
          ))}
          {selectedCourseId && (
            <button
              onClick={() => navigate(`/courses/${selectedCourseId}`)}
              className="min-h-[44px] sm:ml-auto px-2 text-xs font-bold text-blue-600 dark:text-cyan-400 hover:underline cursor-pointer"
            >
              Open Full Course Workspace →
            </button>
          )}
        </div>
      ) : (
        <div className="p-8 text-center rounded-2xl bg-white dark:bg-white/[0.02] border border-slate-200/80 dark:border-white/10 mb-6">
          <p className="text-sm font-bold text-slate-900 dark:text-white">No courses available for attendance tracking.</p>
          <button
            onClick={() => navigate('/courses')}
            className="mt-2 min-h-[44px] px-3 text-xs font-bold text-blue-600 dark:text-cyan-400 hover:underline cursor-pointer"
          >
            Explore Course Catalog →
          </button>
        </div>
      )}
      <div className="-mx-4 sm:-mx-6">
        {selectedCourseId && (
          <AttendanceTab
            courseId={selectedCourseId}
            isCreatorOrStaff={isStaff}
            user={user}
          />
        )}
      </div>
    </main>
  );
}

export default AttendancePage;
