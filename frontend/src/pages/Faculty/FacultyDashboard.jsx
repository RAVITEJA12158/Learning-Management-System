import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { courseService } from '../../services/courseService';
import Button from '../../components/common/Button';
import Badge from '../../components/common/Badge';
import { PlusIcon } from '../../components/common/Icons';

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
      setCreatedCourses(courses || []);
    } catch (err) {
      console.error('Failed to fetch faculty courses:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="mx-auto max-w-[1440px] px-4 py-8 sm:px-8 lg:py-10 w-full font-sans transition-colors duration-200">
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <Badge variant="warning" className="mb-2">
            Faculty Workspace
          </Badge>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight transition-colors">
            Courses You Teach
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-gray-400 mt-1">
            Manage your course curriculums, student assignments, and class materials.
          </p>
        </div>
        
        <Button
          onClick={() => navigate('/faculty/courses/new')}
          className="self-start sm:self-auto shrink-0 flex items-center gap-2"
        >
          <PlusIcon className="w-4 h-4" />
          Create New Course
        </Button>
      </div>

      {loading ? (
        <div className="bg-white dark:bg-white/[0.02] backdrop-blur-xl rounded-2xl border border-slate-200/80 dark:border-white/10 p-8 text-center text-xs font-bold text-slate-400 dark:text-gray-400">
          Loading your courses...
        </div>
      ) : createdCourses.length > 0 ? (
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {createdCourses.map((course) => (
            <div
              key={course.id}
              className="bg-white dark:bg-white/[0.02] backdrop-blur-xl rounded-2xl border border-slate-200/80 dark:border-white/10 p-6 shadow-xs hover:shadow-md transition flex flex-col justify-between hover:dark:border-white/20"
            >
              <div>
                <div className="flex items-start justify-between gap-2">
                  <Badge variant="active">
                    {course.courseCode || 'CS101'}
                  </Badge>
                  <span className="text-[11px] font-bold text-slate-400 dark:text-gray-500">
                    Sem {course.semester || 1}
                  </span>
                </div>
                <h3 className="mt-4 text-base font-bold text-slate-900 dark:text-white line-clamp-1">
                  {course.title}
                </h3>
                <p className="mt-2 text-xs text-slate-500 dark:text-gray-400 line-clamp-3 leading-relaxed">
                  {course.description || 'No description provided.'}
                </p>
              </div>

              <div className="mt-6 flex gap-3 border-t border-slate-100 dark:border-white/5 pt-4">
                <Link
                  to={`/courses/${course.id}`}
                  className="flex-1 text-center py-2 text-xs font-bold text-slate-700 dark:text-gray-200 bg-slate-100 dark:bg-white/5 hover:bg-slate-200 dark:hover:bg-white/10 rounded-xl transition cursor-pointer"
                >
                  View
                </Link>
                <Link
                  to={`/faculty/courses/${course.id}/edit`}
                  className="flex-1 text-center py-2 text-xs font-bold text-white bg-[#0066FF] hover:bg-blue-600 shadow-[0_0_15px_rgba(0,102,255,0.4)] rounded-xl transition cursor-pointer"
                >
                  Edit
                </Link>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-white dark:bg-white/[0.02] backdrop-blur-xl rounded-2xl border border-slate-200/80 dark:border-white/10 p-12 text-center shadow-xs">
          <p className="text-base font-bold text-slate-900 dark:text-white">You haven't created any courses yet.</p>
          <p className="mt-1 text-xs text-slate-500 dark:text-gray-400 mb-6">Start structuring your curriculum and sharing your knowledge.</p>
          <Button
            onClick={() => navigate('/faculty/courses/new')}
            className="inline-flex items-center gap-2"
          >
            <PlusIcon className="w-4 h-4" />
            Create Your First Course
          </Button>
        </div>
      )}
    </main>
  );
}

export default FacultyDashboard;