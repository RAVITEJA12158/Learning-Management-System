import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { courseService } from '../../services/courseService';

function FacultyDashboard() {
  const [createdCourses, setCreatedCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchCreatedCourses();
  }, []);

  const fetchCreatedCourses = async () => {
    try {
      const courses = await courseService.getCreated();
      setCreatedCourses(courses);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="relative z-10 mx-auto max-w-7xl px-5 pb-20 pt-10 sm:px-8 lg:pb-28 w-full">
      <div className="mb-12 flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-xs font-black uppercase tracking-[.18em] text-[#E85B43]">
            Faculty Workspace
          </p>
          <h1 className="mt-4 text-4xl font-black leading-[.98] tracking-[-.055em] sm:text-5xl">
            Courses You Teach
          </h1>
        </div>
        
        <button 
          onClick={() => navigate('/faculty/courses/new')}
          className="hub-lift inline-flex w-fit items-center gap-2 rounded-full bg-[#151515] px-6 py-3 text-sm font-black text-white shadow-[0_15px_35px_rgba(21,21,21,.15)] hover:bg-[#292929]"
        >
          Create New Course <span className="text-[#DFFF63]">+</span>
        </button>
      </div>

      {loading ? (
        <div className="text-sm font-bold text-[#151515]/55">Loading your courses...</div>
      ) : createdCourses.length > 0 ? (
        <div className="grid gap-5 lg:grid-cols-3">
          {createdCourses.map((course) => (
            <div
              key={course.id}
              className="hub-lift group flex h-full flex-col justify-between rounded-[24px] border border-black/10 bg-white p-6 shadow-[0_15px_40px_rgba(21,21,21,.04)]"
            >
              <div>
                <div className="flex items-start justify-between">
                  <span className="inline-block rounded-full bg-[#A9E8D5] px-3 py-1.5 text-[10px] font-black uppercase tracking-wider text-[#102A24]">
                    {course.courseCode}
                  </span>
                  <span className="text-[10px] font-bold text-[#151515]/40">
                    Sem {course.semester}
                  </span>
                </div>
                <h3 className="mt-5 text-xl font-black leading-tight tracking-[-.03em] text-[#151515]">
                  {course.title}
                </h3>
                <p className="mt-3 text-sm leading-6 text-[#151515]/55">
                  {course.description?.substring(0, 100)}...
                </p>
              </div>

              <div className="mt-8 flex gap-3 border-t border-black/5 pt-5">
                <Link
                  to={`/courses/${course.id}`}
                  className="flex flex-1 items-center justify-center gap-2 rounded-xl border border-black/10 bg-[#F6F2E9] py-2.5 text-xs font-black text-[#151515] hover:border-black/20"
                >
                  View
                </Link>
                <Link
                  to={`/faculty/courses/${course.id}/edit`}
                  className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-[#151515] py-2.5 text-xs font-black text-white hover:bg-[#292929]"
                >
                  Edit
                </Link>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="rounded-[28px] border border-black/10 bg-white p-10 text-center shadow-[0_25px_70px_rgba(21,21,21,.07)]">
          <p className="text-lg font-black text-[#151515]">You haven't created any courses yet.</p>
          <p className="mt-2 text-sm text-[#151515]/55 mb-6">Start structuring your curriculum and sharing your knowledge.</p>
          <button 
            onClick={() => navigate('/faculty/courses/new')} 
            className="hub-lift inline-flex items-center gap-3 rounded-full bg-[#151515] px-6 py-4 text-sm font-black text-white shadow-[0_15px_35px_rgba(21,21,21,.15)]"
          >
            Create Your First Course
            <span className="flex h-6 w-6 items-center justify-center rounded-full bg-[#DFFF63] text-[#151515]">
              +
            </span>
          </button>
        </div>
      )}
    </main>
  );
}

export default FacultyDashboard;