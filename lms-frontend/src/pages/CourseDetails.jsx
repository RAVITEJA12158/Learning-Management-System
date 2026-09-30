import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { courseService, progressService } from '../services/courseService';
import { useAuth } from '../context/AuthContext';
import ContentViewerModal from '../components/ContentViewerModal';
import ModuleCurriculumManager from '../components/ModuleCurriculumManager';
import CourseAssignmentsManager from '../components/CourseAssignmentsManager';

function CourseDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [activeTab, setActiveTab] = useState('curriculum');
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [enrolling, setEnrolling] = useState(false);
  const [isEnrolled, setIsEnrolled] = useState(false);
  const [message, setMessage] = useState('');

  // Progress state
  const [progressData, setProgressData] = useState(null);
  const [completedItems, setCompletedItems] = useState({});

  // Content Viewer state
  const [selectedContent, setSelectedContent] = useState(null);

  useEffect(() => {
    fetchCourseDetails();
    checkEnrollmentStatus();
  }, [id]);

  useEffect(() => {
    if (isEnrolled) {
      fetchProgress();
    }
  }, [id, isEnrolled]);

  const checkEnrollmentStatus = async () => {
    try {
      const enrolledList = await courseService.getEnrolled();
      const found = enrolledList.some((c) => c.id === id);
      setIsEnrolled(found);
    } catch (err) {
      // Ignore if faculty/admin
    }
  };

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

  const fetchProgress = async () => {
    try {
      const progress = await progressService.getCourseProgress(id);
      setProgressData(progress);
      
      const map = {};
      progress.modules?.forEach((mod) => {
        mod.content?.forEach((item) => {
          map[item.contentId] = item.completed;
        });
      });
      setCompletedItems(map);
    } catch (err) {
      console.error('Failed to load progress:', err);
    }
  };

  const handleEnroll = async () => {
    setEnrolling(true);
    setMessage('');
    try {
      await courseService.enroll(id);
      setIsEnrolled(true);
      setMessage('Successfully enrolled in course!');
      fetchProgress();
    } catch (err) {
      setMessage(err.message || 'Failed to enroll.');
    } finally {
      setEnrolling(false);
    }
  };

  const handleDrop = async () => {
    if (!window.confirm('Are you sure you want to drop this course?')) return;
    setEnrolling(true);
    setMessage('');
    try {
      await courseService.unenroll(id);
      setIsEnrolled(false);
      setProgressData(null);
      setMessage('Successfully dropped course.');
    } catch (err) {
      setMessage(err.message || 'Failed to drop course.');
    } finally {
      setEnrolling(false);
    }
  };

  const handleToggleContentProgress = async (contentId, status) => {
    try {
      await progressService.markContent(contentId, status);
      setCompletedItems((prev) => ({ ...prev, [contentId]: status }));
      fetchProgress();
    } catch (err) {
      console.error('Failed to toggle progress:', err);
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

  const isCreatorOrStaff =
    user?.role === 'admin' ||
    user?.role === 'faculty' ||
    course.createdById === user?.id;

  return (
    <main className="relative z-10 mx-auto max-w-7xl px-5 pb-20 pt-10 sm:px-8 lg:pb-28 w-full">
      <button 
        onClick={() => navigate(-1)} 
        className="hub-lift mb-8 inline-flex items-center gap-2 rounded-full border border-black/10 bg-white px-5 py-2.5 text-xs font-black text-[#151515] hover:border-black/25"
      >
        ← Back
      </button>

      {/* Course Hero Banner */}
      <div className="rounded-[28px] border border-black/10 bg-white p-6 sm:p-10 shadow-[0_25px_70px_rgba(21,21,21,.07)]">
        <div className="flex flex-wrap items-center gap-3 mb-4">
          <span className="inline-block rounded-full bg-[#DFFF63] px-3 py-1.5 text-[10px] font-black uppercase tracking-wider text-[#151515]">
            {course.courseCode}
          </span>
          <span className="inline-block rounded-full bg-[#F6F2E9] px-3 py-1.5 text-[10px] font-black uppercase tracking-wider text-[#151515]/60">
            Semester {course.semester || 'N/A'}
          </span>
          <span className="inline-block rounded-full bg-[#F6F2E9] px-3 py-1.5 text-[10px] font-black uppercase tracking-wider text-[#151515]/60">
            By {course.createdBy?.name || 'Faculty Member'}
          </span>
        </div>

        <h1 className="text-4xl font-black leading-[.95] tracking-[-.05em] sm:text-5xl lg:text-6xl text-[#151515] mb-6">
          {course.title}
        </h1>
        
        <p className="text-base leading-7 text-[#151515]/70 max-w-3xl mb-10">
          {course.description || 'No description provided.'}
        </p>

        {message && (
          <div className={`mb-6 p-4 rounded-2xl text-xs font-bold leading-5 ${message.includes('Success') ? 'border border-[#B7E4D5] bg-[#EDF9F5] text-[#18765D]' : 'border border-[#F2C7BC] bg-[#FFF1ED] text-[#B83D29]'}`}>
            {message}
          </div>
        )}

        {/* Action Button: Enroll vs Drop vs Faculty Badge */}
        {isCreatorOrStaff ? (
          <div className="inline-flex items-center gap-2 rounded-full border border-black/10 bg-[#FAF8F5] px-5 py-2.5 text-xs font-black text-[#151515]">
            🛡️ Instructor / Staff Workspace
          </div>
        ) : isEnrolled ? (
          <div className="flex flex-wrap items-center gap-4">
            <span className="inline-flex items-center gap-2 rounded-full border border-[#B7E4D5] bg-[#EDF9F5] px-4 py-2 text-xs font-black text-[#18765D]">
              ✓ Currently Enrolled
            </span>
            <button 
              onClick={handleDrop} 
              disabled={enrolling}
              className="hub-lift inline-flex items-center gap-2 rounded-full border border-[#F2C7BC] bg-[#FFF1ED] px-6 py-3 text-xs font-black text-[#B83D29] hover:bg-[#ffe5de] disabled:opacity-70"
            >
              {enrolling ? 'Processing...' : 'Drop Course'}
            </button>
          </div>
        ) : (
          <button 
            onClick={handleEnroll} 
            disabled={enrolling}
            className="hub-lift inline-flex items-center gap-3 rounded-full bg-[#151515] px-8 py-4 text-sm font-black text-white shadow-[0_15px_35px_rgba(21,21,21,.15)] disabled:opacity-70"
          >
            {enrolling ? 'Enrolling...' : 'Enroll in Course'}
            {!enrolling && <span className="flex h-6 w-6 items-center justify-center rounded-full bg-[#DFFF63] text-[#151515]">→</span>}
          </button>
        )}
      </div>

      {/* Progress Indicator (Student View) */}
      {isEnrolled && progressData && (
        <div className="mt-8 rounded-[24px] border border-black/10 bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <div>
              <p className="text-[10px] font-black uppercase tracking-wider text-[#151515]/50">
                Your Learning Progress
              </p>
              <h3 className="text-lg font-black text-[#151515]">
                {progressData.completedContent} of {progressData.totalContent} items completed
              </h3>
            </div>
            <div className="text-2xl font-black text-[#151515]">
              {progressData.completionPercent}%
            </div>
          </div>
          <div className="h-2.5 w-full overflow-hidden rounded-full bg-black/5">
            <div
              className="h-full bg-[#151515] transition-all duration-500 rounded-full"
              style={{ width: `${progressData.completionPercent}%` }}
            />
          </div>
        </div>
      )}

      {/* Tab Navigation: Curriculum vs Assignments */}
      <div className="mt-14">
        <div className="flex items-center gap-3 border-b border-black/10 pb-4 mb-8">
          <button
            onClick={() => setActiveTab('curriculum')}
            className={`rounded-full px-6 py-2.5 text-xs font-black transition ${
              activeTab === 'curriculum'
                ? 'bg-[#151515] text-white shadow-sm'
                : 'bg-white text-black/60 hover:text-black border border-black/10'
            }`}
          >
            📚 Curriculum & Materials
          </button>
          <button
            onClick={() => setActiveTab('assignments')}
            className={`rounded-full px-6 py-2.5 text-xs font-black transition ${
              activeTab === 'assignments'
                ? 'bg-[#151515] text-white shadow-sm'
                : 'bg-white text-black/60 hover:text-black border border-black/10'
            }`}
          >
            📝 Assignments & Tasks
          </button>
        </div>

        {activeTab === 'assignments' ? (
          <CourseAssignmentsManager
            courseId={id}
            canManage={isCreatorOrStaff}
            isEnrolled={isEnrolled}
          />
        ) : isCreatorOrStaff ? (
          <ModuleCurriculumManager
            courseId={id}
            modules={course.modules || []}
            onRefresh={fetchCourseDetails}
            canEdit={true}
          />
        ) : (
          <div>
            <h2 className="text-2xl font-black tracking-[-.04em] mb-8">Course Curriculum</h2>
            
            {course.modules && course.modules.length > 0 ? (
              <div className="grid gap-5">
                {course.modules.map((module, mIdx) => (
                  <div
                    key={module.id}
                    className="rounded-[24px] border border-black/10 bg-white p-6 shadow-sm transition hover:shadow-md"
                  >
                    <div className="flex items-center gap-4 mb-3">
                      <span className="flex h-8 w-8 items-center justify-center rounded-full bg-[#151515] text-xs font-black text-white">
                        {module.position || mIdx + 1}
                      </span>
                      <div>
                        <h3 className="text-xl font-black leading-tight tracking-[-.03em] text-[#151515]">
                          {module.title}
                        </h3>
                        {module.description && (
                          <p className="text-xs text-[#151515]/60 mt-1">
                            {module.description}
                          </p>
                        )}
                      </div>
                    </div>
                    
                    {module.content && module.content.length > 0 ? (
                      <div className="pl-0 sm:pl-12 mt-4 space-y-2.5">
                        {module.content.map((c) => {
                          const isCompleted = completedItems[c.id] || false;
                          return (
                            <div
                              key={c.id}
                              className="flex items-center justify-between rounded-xl border border-black/5 bg-[#FAF8F5] p-3.5 transition hover:bg-[#F3EFEA]"
                            >
                              <div
                                onClick={() => setSelectedContent(c)}
                                className="flex items-center gap-3 cursor-pointer flex-1"
                              >
                                <span className="rounded-lg bg-white border border-black/10 px-2.5 py-1 text-[9px] font-black uppercase text-[#151515]/70">
                                  {c.type}
                                </span>
                                <div>
                                  <p className={`text-sm font-bold text-[#151515] ${isCompleted ? 'line-through text-black/40' : ''}`}>
                                    {c.title}
                                  </p>
                                  {c.description && (
                                    <p className="text-[11px] text-[#151515]/50 truncate max-w-lg">
                                      {c.description}
                                    </p>
                                  )}
                                </div>
                              </div>

                              <div className="flex items-center gap-3">
                                {isEnrolled && (
                                  <button
                                    onClick={() => handleToggleContentProgress(c.id, !isCompleted)}
                                    className={`rounded-full px-3 py-1 text-[10px] font-black uppercase tracking-wider transition ${
                                      isCompleted
                                        ? 'bg-[#EDF9F5] text-[#18765D] border border-[#B7E4D5]'
                                        : 'bg-white text-black/60 border border-black/15 hover:border-black/30'
                                    }`}
                                  >
                                    {isCompleted ? '✓ Done' : 'Mark Done'}
                                  </button>
                                )}

                                <button
                                  onClick={() => setSelectedContent(c)}
                                  className="hub-lift rounded-full bg-[#151515] px-4 py-1.5 text-xs font-black text-white"
                                >
                                  Open
                                </button>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    ) : (
                      <p className="pl-12 text-xs font-bold text-[#151515]/40 italic">
                        No materials uploaded for this module yet.
                      </p>
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
        )}
      </div>

      {/* Content Viewer Modal */}
      <ContentViewerModal
        content={selectedContent}
        isOpen={Boolean(selectedContent)}
        onClose={() => setSelectedContent(null)}
        isCompleted={selectedContent ? completedItems[selectedContent.id] : false}
        onToggleComplete={isEnrolled ? handleToggleContentProgress : null}
      />
    </main>
  );
}

export default CourseDetails;
