import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { courseService } from '../services/courseService';

function CourseDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [enrolling, setEnrolling] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    fetchCourseDetails();
  }, [id]);

  const fetchCourseDetails = async () => {
    try {
      const data = await courseService.getById(id);
      setCourse(data);
    } catch (err) {
      console.error(err);
      setMessage('Failed to load course details.');
    } finally {
      setLoading(false);
    }
  };

  const handleEnroll = async () => {
    setEnrolling(true);
    setMessage('');
    try {
      await courseService.enroll(id);
      setMessage('Successfully enrolled!');
    } catch (err) {
      setMessage(err.message || 'Failed to enroll.');
    } finally {
      setEnrolling(false);
    }
  };

  if (loading) {
    return (
      <main className="relative z-10 mx-auto max-w-7xl px-5 pb-20 pt-10 sm:px-8 lg:pb-28 w-full">
        <div className="text-sm font-bold text-[#151515]/55">Loading course details...</div>
      </main>
    );
  }

  if (!course) {
    return (
      <main className="relative z-10 mx-auto max-w-7xl px-5 pb-20 pt-10 sm:px-8 lg:pb-28 w-full">
        <div className="text-sm font-bold text-[#151515]/55">Course not found.</div>
      </main>
    );
  }

  return (
    <main className="relative z-10 mx-auto max-w-7xl px-5 pb-20 pt-10 sm:px-8 lg:pb-28 w-full">
      <button 
        onClick={() => navigate(-1)} 
        className="hub-lift mb-8 inline-flex items-center gap-2 rounded-full border border-black/10 bg-white px-5 py-2.5 text-xs font-black text-[#151515] hover:border-black/25"
      >
        ← Back
      </button>

      <div className="rounded-[28px] border border-black/10 bg-white p-6 sm:p-10 shadow-[0_25px_70px_rgba(21,21,21,.07)]">
        <div className="flex flex-wrap items-center gap-3 mb-4">
          <span className="inline-block rounded-full bg-[#DFFF63] px-3 py-1.5 text-[10px] font-black uppercase tracking-wider text-[#151515]">
            {course.courseCode}
          </span>
          <span className="inline-block rounded-full bg-[#F6F2E9] px-3 py-1.5 text-[10px] font-black uppercase tracking-wider text-[#151515]/60">
            Semester {course.semester}
          </span>
          <span className="inline-block rounded-full bg-[#F6F2E9] px-3 py-1.5 text-[10px] font-black uppercase tracking-wider text-[#151515]/60">
            By {course.createdBy?.name || 'Unknown Faculty'}
          </span>
        </div>

        <h1 className="text-4xl font-black leading-[.95] tracking-[-.05em] sm:text-5xl lg:text-6xl text-[#151515] mb-6">
          {course.title}
        </h1>
        
        <p className="text-base leading-7 text-[#151515]/70 max-w-3xl mb-10">
          {course.description}
        </p>

        {message && (
          <div className={`mb-6 p-4 rounded-2xl text-xs font-bold leading-5 ${message.includes('Success') ? 'border border-[#B7E4D5] bg-[#EDF9F5] text-[#18765D]' : 'border border-[#F2C7BC] bg-[#FFF1ED] text-[#B83D29]'}`}>
            {message}
          </div>
        )}

        <button 
          onClick={handleEnroll} 
          disabled={enrolling}
          className="hub-lift inline-flex items-center gap-3 rounded-full bg-[#151515] px-8 py-4 text-sm font-black text-white shadow-[0_15px_35px_rgba(21,21,21,.15)] disabled:opacity-70"
        >
          {enrolling ? 'Enrolling...' : 'Enroll in Course'}
          {!enrolling && <span className="flex h-6 w-6 items-center justify-center rounded-full bg-[#DFFF63] text-[#151515]">→</span>}
        </button>
      </div>

      <div className="mt-16">
        <h2 className="text-2xl font-black tracking-[-.04em] mb-8">Course Curriculum</h2>
        
        {course.modules && course.modules.length > 0 ? (
          <div className="grid gap-4">
            {course.modules.map(module => (
              <div key={module.id} className="rounded-[24px] border border-black/10 bg-white p-6 transition hover:shadow-md">
                <div className="flex items-center gap-4 mb-3">
                  <span className="flex h-8 w-8 items-center justify-center rounded-full bg-[#151515] text-xs font-black text-white">
                    {module.position}
                  </span>
                  <h3 className="text-xl font-black leading-tight tracking-[-.03em] text-[#151515]">
                    {module.title}
                  </h3>
                </div>
                <p className="text-sm leading-6 text-[#151515]/60 pl-12 mb-5">
                  {module.description}
                </p>
                
                {module.content && module.content.length > 0 && (
                  <ul className="pl-12 grid gap-2">
                    {module.content.map(c => (
                      <li key={c.id} className="flex items-center gap-3 rounded-xl border border-black/5 bg-[#F6F2E9] p-3">
                        <span className="text-[10px] font-black uppercase tracking-wider text-[#151515]/40 w-16">
                          {c.type}
                        </span>
                        <span className="text-sm font-medium text-[#151515]">
                          {c.title}
                        </span>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className="rounded-[24px] border border-black/10 bg-white p-8 text-center text-sm font-bold text-[#151515]/50">
            The curriculum for this course has not been published yet.
          </div>
        )}
      </div>
    </main>
  );
}

export default CourseDetails;
