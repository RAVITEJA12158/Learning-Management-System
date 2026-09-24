import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { courseService } from '../services/courseService';

function CourseCatalog() {
  const [courses, setCourses] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchCourses();
  }, []);

  const fetchCourses = async (query = '') => {
    setLoading(true);
    try {
      const data = await courseService.getAll(query);
      setCourses(data);
    } catch (err) {
      console.error('Failed to fetch courses:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    fetchCourses(searchQuery);
  };

  return (
    <main className="relative z-10 mx-auto max-w-7xl px-5 pb-20 pt-10 sm:px-8 lg:pb-28 w-full">
      <div className="mb-12 flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-xs font-black uppercase tracking-[.18em] text-[#E85B43]">
            Course Catalog
          </p>
          <h1 className="mt-4 text-4xl font-black leading-[.98] tracking-[-.055em] sm:text-5xl">
            Browse All Courses
          </h1>
        </div>
        <button 
          onClick={() => navigate(-1)}
          className="hub-lift rounded-full border border-black/10 bg-white px-6 py-3 text-sm font-black text-[#151515] hover:border-black/25"
        >
          ← Back
        </button>
      </div>

      <form onSubmit={handleSearch} className="mb-12 flex flex-col sm:flex-row gap-3 max-w-2xl">
        <div className="relative flex-1">
          <input 
            type="text" 
            placeholder="Search by title or course code..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full rounded-[20px] border border-black/10 bg-white px-6 py-4 text-sm font-medium text-[#151515] shadow-sm outline-none transition hover:border-black/25 focus:border-[#151515] focus:ring-4 focus:ring-black/[0.05] placeholder:text-black/35"
          />
        </div>
        <button 
          type="submit" 
          className="hub-lift shrink-0 rounded-[20px] bg-[#151515] px-8 py-4 text-sm font-black text-white hover:bg-[#292929]"
        >
          Search
        </button>
      </form>

      {loading ? (
        <div className="text-sm font-bold text-[#151515]/55">Loading courses...</div>
      ) : courses.length > 0 ? (
        <div className="grid gap-5 lg:grid-cols-3">
          {courses.map(course => (
            <div
              key={course.id}
              className="hub-lift group flex h-full flex-col justify-between rounded-[24px] border border-black/10 bg-white p-6 shadow-[0_15px_40px_rgba(21,21,21,.04)]"
            >
              <div>
                <div className="flex items-start justify-between">
                  <span className="inline-block rounded-full bg-[#FFB39E] px-3 py-1.5 text-[10px] font-black uppercase tracking-wider text-[#321D18]">
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

              <div className="mt-8 border-t border-black/5 pt-5">
                <button
                  onClick={() => navigate(`/courses/${course.id}`)}
                  className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#151515] py-3 text-xs font-black text-white hover:bg-[#292929]"
                >
                  View Details <span className="text-[#FFB39E]">→</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="rounded-[28px] border border-black/10 bg-white p-10 text-center shadow-[0_25px_70px_rgba(21,21,21,.07)]">
          <p className="text-lg font-black text-[#151515]">No courses found.</p>
          <p className="mt-2 text-sm text-[#151515]/55">Try adjusting your search criteria.</p>
        </div>
      )}
    </main>
  );
}

export default CourseCatalog;
