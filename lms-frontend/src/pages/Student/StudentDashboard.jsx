import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { courseService } from '../../services/courseService';

function StudentDashboard() {
  const [enrolledCourses, setEnrolledCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchEnrolledCourses();
  }, []);

  const fetchEnrolledCourses = async () => {
    try {
      const courses = await courseService.getEnrolled();
      setEnrolledCourses(courses);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="relative z-10 mx-auto max-w-7xl px-5 pb-20 pt-10 sm:px-8 lg:pb-28 w-full">
      <div className="mb-12">
        <p className="text-xs font-black uppercase tracking-[.18em] text-[#E85B43]">
          Student Workspace
        </p>
        <h1 className="mt-4 text-4xl font-black leading-[.98] tracking-[-.055em] sm:text-5xl">
          My Enrolled Courses
        </h1>
      </div>

      {loading ? (
        <div className="text-sm font-bold text-[#151515]/55">Loading your courses...</div>
      ) : enrolledCourses.length > 0 ? (
        <div className="grid gap-5 lg:grid-cols-3">
          {enrolledCourses.map((course) => (
            <div
              key={course.id}
              className="hub-lift group flex h-full flex-col justify-between rounded-[24px] border border-black/10 bg-white p-6 shadow-[0_15px_40px_rgba(21,21,21,.04)]"
            >
              <div>
                <div className="flex items-start justify-between">
                  <span className="inline-block rounded-full bg-[#DFFF63] px-3 py-1.5 text-[10px] font-black uppercase tracking-wider text-[#151515]">
                    {course.courseCode}
                  </span>
                </div>
                <h3 className="mt-5 text-xl font-black leading-tight tracking-[-.03em] text-[#151515]">
                  {course.title}
                </h3>
                <p className="mt-3 text-sm leading-6 text-[#151515]/55">
                  {course.description?.substring(0, 100)}...
                </p>
              </div>

              <div className="mt-8 border-t border-black/5 pt-5">
                <Link
                  to={`/courses/${course.id}`}
                  className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#151515] py-3 text-xs font-black text-white hover:bg-[#292929]"
                >
                  Continue Learning <span className="text-[#DFFF63]">→</span>
                </Link>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="rounded-[28px] border border-black/10 bg-white p-10 text-center shadow-[0_25px_70px_rgba(21,21,21,.07)]">
          <p className="text-lg font-black text-[#151515]">You haven't enrolled in any courses yet.</p>
          <p className="mt-2 text-sm text-[#151515]/55 mb-6">Start your learning journey by browsing the catalog.</p>
          <button 
            onClick={() => navigate('/courses')} 
            className="hub-lift inline-flex items-center gap-3 rounded-full bg-[#151515] px-6 py-4 text-sm font-black text-white shadow-[0_15px_35px_rgba(21,21,21,.15)]"
          >
            Find a Course
            <span className="flex h-6 w-6 items-center justify-center rounded-full bg-[#DFFF63] text-[#151515]">
              →
            </span>
          </button>
        </div>
      )}
    </main>
  );
}

export default StudentDashboard;