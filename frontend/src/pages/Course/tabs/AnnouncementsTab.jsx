import React, { useState } from 'react';

export function AnnouncementsTab({ instructorsText, isCreatorOrStaff }) {
  const [announcements, setAnnouncements] = useState([
    {
      id: 'ann-1',
      title: 'Exam Dates Finalized',
      author: instructorsText,
      time: '2 hours ago',
      content:
        'The midterm exam for this course has been officially scheduled for Nov 25th in Room 302. Please review all modules up to Week 6 before the deadline. Office hours will be extended next week for exam prep.',
      pinned: true,
    },
    {
      id: 'ann-2',
      title: 'New Practice Dataset Uploaded',
      author: instructorsText,
      time: 'Yesterday',
      content:
        "Please review the module 1 practice dataset files prior to Friday's lecture. Make sure to run the prerequisite Jupyter notebooks to verify dependencies.",
      pinned: false,
    },
    {
      id: 'ann-3',
      title: 'Welcome to the Course!',
      author: instructorsText,
      time: '1 week ago',
      content:
        'Welcome all students! Please make sure to check the syllabus and introduce yourself in the Discussions tab.',
      pinned: false,
    },
  ]);

  const [isPosting, setIsPosting] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newContent, setNewContent] = useState('');

  const handlePost = (e) => {
    e.preventDefault();
    if (!newTitle.trim() || !newContent.trim()) return;

    setAnnouncements([
      {
        id: `ann-${Date.now()}`,
        title: newTitle,
        author: instructorsText,
        time: 'Just now',
        content: newContent,
        pinned: false,
      },
      ...announcements,
    ]);
    setNewTitle('');
    setNewContent('');
    setIsPosting(false);
  };

  return (
    <div className="p-6 space-y-6">
      <div className="rounded-2xl bg-white dark:bg-white/[0.02] backdrop-blur-xl border border-slate-200/80 dark:border-white/10 p-6 shadow-xs transition-colors">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-base font-bold text-slate-900 dark:text-white">Course Announcements</h2>
            <p className="text-xs text-slate-500 dark:text-gray-400 mt-0.5">
              Important updates, schedule changes, and lecture notices from your instructors.
            </p>
          </div>
          {isCreatorOrStaff && (
            <button
              onClick={() => setIsPosting(!isPosting)}
              className="text-xs font-bold text-blue-600 dark:text-cyan-400 hover:underline cursor-pointer"
            >
              {isPosting ? 'Cancel' : '+ New Announcement'}
            </button>
          )}
        </div>

        {/* New announcement form for staff */}
        {isPosting && (
          <form onSubmit={handlePost} className="mb-6 p-4 rounded-xl bg-slate-50 dark:bg-white/[0.03] border border-slate-200/80 dark:border-white/10 space-y-3">
            <h3 className="text-xs font-bold text-slate-900 dark:text-white">Post New Announcement</h3>
            <input
              type="text"
              required
              placeholder="Announcement Title"
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
              className="w-full rounded-lg border border-slate-200 dark:border-white/10 bg-white dark:bg-[#030712] px-3 py-2 text-xs font-medium text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-gray-500 focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400/30 focus:outline-none"
            />
            <textarea
              rows={3}
              required
              placeholder="Announcement message..."
              value={newContent}
              onChange={(e) => setNewContent(e.target.value)}
              className="w-full rounded-lg border border-slate-200 dark:border-white/10 bg-white dark:bg-[#030712] p-3 text-xs font-medium text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-gray-500 focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400/30 focus:outline-none"
            />
            <div className="flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setIsPosting(false)}
                className="px-3 py-1.5 text-xs font-bold text-slate-600 dark:text-gray-400 hover:text-slate-900 dark:hover:text-white"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="rounded-lg bg-[#0066FF] hover:bg-blue-600 px-4 py-1.5 text-xs font-bold text-white shadow-[0_0_15px_rgba(0,102,255,0.4)] transition"
              >
                Publish
              </button>
            </div>
          </form>
        )}

        <div className="space-y-4">
          {announcements.map((item) => (
            <div
              key={item.id}
              className="p-5 rounded-xl bg-slate-50 dark:bg-white/[0.02] border border-slate-200/60 dark:border-white/5 space-y-2 transition-all hover:dark:border-white/15"
            >
              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                  {item.pinned && (
                    <span className="text-[10px] font-bold bg-amber-50 dark:bg-amber-500/10 text-amber-700 dark:text-amber-400 px-2 py-0.5 rounded border border-amber-200 dark:border-amber-500/20">
                      Pinned
                    </span>
                  )}
                  <h3 className="text-sm font-bold text-slate-900 dark:text-white">{item.title}</h3>
                </div>
                <span className="text-[10px] text-slate-400 dark:text-gray-500 font-medium shrink-0">
                  {item.time}
                </span>
              </div>
              <p className="text-xs leading-relaxed text-slate-600 dark:text-gray-300">{item.content}</p>
              <p className="text-[11px] font-medium text-slate-400 dark:text-gray-500 pt-1">
                Posted by <span className="font-semibold text-slate-700 dark:text-gray-200">{item.author}</span>
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default AnnouncementsTab;
