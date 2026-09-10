import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { courseService } from '../services/courseService';

function CourseForm() {
  const { id } = useParams();
  const isEditMode = Boolean(id);
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    title: '',
    courseCode: '',
    description: '',
    semester: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (isEditMode) {
      fetchCourse();
    }
  }, [id]);

  const fetchCourse = async () => {
    try {
      const data = await courseService.getById(id);
      setFormData({
        title: data.title || '',
        courseCode: data.courseCode || '',
        description: data.description || '',
        semester: data.semester || ''
      });
    } catch (err) {
      setError('Failed to load course data.');
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      if (isEditMode) {
        await courseService.update(id, formData);
      } else {
        await courseService.create(formData);
      }
      navigate('/faculty');
    } catch (err) {
      setError(err.message || 'Failed to save course.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="relative z-10 mx-auto max-w-4xl px-5 pb-20 pt-10 sm:px-8 lg:pb-28 w-full">
      <button 
        onClick={() => navigate(-1)} 
        className="hub-lift mb-8 inline-flex items-center gap-2 rounded-full border border-black/10 bg-white px-5 py-2.5 text-xs font-black text-[#151515] hover:border-black/25"
      >
        ← Back
      </button>

      <div className="rounded-[28px] border border-black/10 bg-white p-6 sm:p-10 shadow-[0_25px_70px_rgba(21,21,21,.07)]">
        <div className="mb-10 text-center">
          <p className="text-xs font-black uppercase tracking-[.18em] text-[#E85B43]">
            {isEditMode ? 'Course Management' : 'Course Creation'}
          </p>
          <h1 className="mt-3 text-4xl font-black leading-[.98] tracking-[-.055em] sm:text-5xl text-[#151515]">
            {isEditMode ? 'Edit Course' : 'Start a New Course'}
          </h1>
        </div>

        {error && (
          <div className="mb-8 p-4 rounded-2xl border border-[#F2C7BC] bg-[#FFF1ED] text-xs font-bold leading-5 text-[#B83D29]">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="mb-2 block text-[10px] font-black uppercase tracking-[.12em] text-[#151515]/55">
              Course Title
            </label>
            <input 
              type="text" 
              name="title"
              value={formData.title} 
              onChange={handleChange} 
              required 
              placeholder="e.g. Introduction to Computer Science"
              className="w-full rounded-[20px] border border-black/10 bg-white px-5 py-4 text-sm font-medium text-[#151515] shadow-sm outline-none transition hover:border-black/25 focus:border-[#151515] focus:ring-4 focus:ring-black/[0.05]"
            />
          </div>

          <div className="grid gap-6 sm:grid-cols-2">
            <div>
              <label className="mb-2 block text-[10px] font-black uppercase tracking-[.12em] text-[#151515]/55">
                Course Code
              </label>
              <input 
                type="text" 
                name="courseCode"
                value={formData.courseCode} 
                onChange={handleChange} 
                required 
                disabled={isEditMode}
                placeholder="e.g. CS101"
                className={`w-full rounded-[20px] border border-black/10 px-5 py-4 text-sm font-medium shadow-sm outline-none transition ${isEditMode ? 'bg-[#F6F2E9] text-[#151515]/50 cursor-not-allowed' : 'bg-white text-[#151515] hover:border-black/25 focus:border-[#151515] focus:ring-4 focus:ring-black/[0.05]'}`}
              />
            </div>

            <div>
              <label className="mb-2 block text-[10px] font-black uppercase tracking-[.12em] text-[#151515]/55">
                Semester
              </label>
              <input 
                type="text" 
                name="semester"
                value={formData.semester} 
                onChange={handleChange} 
                required 
                placeholder="e.g. Fall 2026"
                className="w-full rounded-[20px] border border-black/10 bg-white px-5 py-4 text-sm font-medium text-[#151515] shadow-sm outline-none transition hover:border-black/25 focus:border-[#151515] focus:ring-4 focus:ring-black/[0.05]"
              />
            </div>
          </div>

          <div>
            <label className="mb-2 block text-[10px] font-black uppercase tracking-[.12em] text-[#151515]/55">
              Description
            </label>
            <textarea 
              name="description"
              value={formData.description} 
              onChange={handleChange} 
              rows="5"
              placeholder="Detailed description of the course..."
              className="w-full resize-y rounded-[20px] border border-black/10 bg-white px-5 py-4 text-sm font-medium text-[#151515] shadow-sm outline-none transition hover:border-black/25 focus:border-[#151515] focus:ring-4 focus:ring-black/[0.05]"
            ></textarea>
          </div>

          <div className="mt-8 flex gap-4 pt-4 border-t border-black/5">
            <button 
              type="button" 
              onClick={() => navigate(-1)}
              className="hub-lift flex-1 rounded-[20px] border border-black/10 bg-white px-6 py-4 text-sm font-black text-[#151515] hover:border-black/25"
            >
              Cancel
            </button>
            <button 
              type="submit" 
              disabled={loading}
              className="hub-lift flex-[2] rounded-[20px] bg-[#151515] px-6 py-4 text-sm font-black text-white hover:bg-[#292929] disabled:opacity-70"
            >
              {loading ? 'Saving...' : 'Save Course'}
            </button>
          </div>
        </form>
      </div>
    </main>
  );
}

export default CourseForm;
