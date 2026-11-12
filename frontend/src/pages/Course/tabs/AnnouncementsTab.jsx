import React, { useState, useEffect } from 'react';
import { announcementService } from '../../../services/courseService';
import Badge from '../../../components/common/Badge';
import Button from '../../../components/common/Button';

export function AnnouncementsTab({
  courseId,
  instructorsText,
  isCreatorOrStaff
}) {
  const [announcements, setAnnouncements] = useState([]);
  const [isPosting, setIsPosting] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newContent, setNewContent] = useState('');
  const [pinOnPost, setPinOnPost] = useState(false);

  useEffect(() => {
    let isMounted = true;
    announcementService.fetchByCourse(courseId).then(list => {
      if (isMounted && Array.isArray(list)) {
        setAnnouncements(list);
      }
    });
    return () => { isMounted = false; };
  }, [courseId]);

  const updateList = next => {
    setAnnouncements(next);
    announcementService.saveForCourse(courseId, next);
  };

  const handlePost = async e => {
    e.preventDefault();
    if (!newTitle.trim() || !newContent.trim()) return;
    try {
      const created = await announcementService.createAnnouncement(courseId, {
        title: newTitle.trim(),
        message: newContent.trim(),
        content: newContent.trim(),
        pinned: pinOnPost
      });
      if (created) {
        setAnnouncements(prev => [created, ...prev.filter(a => a.id !== created.id)]);
      }
    } catch {
      const next = [{
        id: `ann-${Date.now()}`,
        courseId,
        title: newTitle.trim(),
        author: instructorsText || 'Instructor',
        time: 'Just now',
        content: newContent.trim(),
        pinned: pinOnPost
      }, ...announcements];
      updateList(next);
    }
    setNewTitle('');
    setNewContent('');
    setPinOnPost(false);
    setIsPosting(false);
  };

  const handleTogglePin = async id => {
    const target = announcements.find(a => a.id === id);
    if (!target) return;
    const nextPinned = !target.pinned;
    const next = announcements.map(a => a.id === id ? {
      ...a,
      pinned: nextPinned
    } : a);
    updateList(next);
    try {
      await announcementService.updateAnnouncement(id, { pinned: nextPinned });
    } catch {
      // Saved locally
    }
  };

  const handleDelete = async id => {
    try {
      await announcementService.deleteAnnouncement(id);
    } catch {
      // Fallback
    }
    const next = announcements.filter(a => a.id !== id);
    updateList(next);
  };

  const sortedAnnouncements = [...announcements].sort((a, b) => Number(Boolean(b.pinned)) - Number(Boolean(a.pinned)));

  return (
    <div className="p-6 space-y-6">
      <div className="rounded-2xl bg-white dark:bg-white/[0.02] backdrop-blur-xl border border-slate-200/80 dark:border-white/10 p-6 shadow-xs transition-colors">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-5">
          <div>
            <h2 className="text-lg font-extrabold text-slate-900 dark:text-white">
              Course Announcements
            </h2>
            <p className="text-xs text-slate-500 dark:text-gray-400 mt-0.5">
              Official schedule updates, exam notices, and lecture broadcasts from your instructors.
            </p>
          </div>
          {isCreatorOrStaff && (
            <Button
              onClick={() => setIsPosting(!isPosting)}
              variant={isPosting ? 'outline' : 'primary'}
            >
              {isPosting ? 'Cancel' : '+ Post Announcement'}
            </Button>
          )}
        </div>

        {isPosting && (
          <form
            onSubmit={handlePost}
            className="mb-6 p-5 rounded-2xl bg-slate-50 dark:bg-white/[0.03] border border-slate-200/80 dark:border-white/10 space-y-3"
          >
            <h3 className="text-xs font-bold uppercase tracking-wider text-blue-600 dark:text-cyan-400">
              Publish New Announcement
            </h3>
            <input
              type="text"
              required
              placeholder="Announcement Title"
              value={newTitle}
              onChange={e => setNewTitle(e.target.value)}
              className="w-full rounded-xl border border-slate-200 dark:border-white/10 bg-white dark:bg-[#030712] px-3.5 py-2.5 text-xs font-medium text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-gray-500 focus:border-cyan-400 focus:outline-none"
            />
            <textarea
              rows={3}
              required
              placeholder="Announcement message..."
              value={newContent}
              onChange={e => setNewContent(e.target.value)}
              className="w-full rounded-xl border border-slate-200 dark:border-white/10 bg-white dark:bg-[#030712] p-3.5 text-xs font-medium text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-gray-500 focus:border-cyan-400 focus:outline-none"
            />
            <div className="flex items-center justify-between pt-1">
              <label className="flex items-center gap-2 text-xs font-semibold text-slate-600 dark:text-gray-300 cursor-pointer">
                <input
                  type="checkbox"
                  checked={pinOnPost}
                  onChange={e => setPinOnPost(e.target.checked)}
                  className="rounded accent-blue-600"
                />
                Pin to top of announcements
              </label>
              <div className="flex gap-2">
                <Button type="button" variant="outline" size="sm" onClick={() => setIsPosting(false)}>
                  Cancel
                </Button>
                <Button type="submit" size="sm">
                  Publish
                </Button>
              </div>
            </div>
          </form>
        )}

        <div className="space-y-4">
          {sortedAnnouncements.map(item => (
            <div
              key={item.id}
              className="p-5 rounded-2xl bg-slate-50 dark:bg-white/[0.02] border border-slate-200/70 dark:border-white/5 space-y-2 transition-all hover:dark:border-white/15"
            >
              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                  {item.pinned && <Badge variant="warning">📌 Pinned</Badge>}
                  <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                    {item.title}
                  </h3>
                </div>
                <div className="flex items-center gap-3 shrink-0">
                  <span className="text-[10px] text-slate-400 dark:text-gray-500 font-medium">
                    {item.time}
                  </span>
                  {isCreatorOrStaff && (
                    <>
                      <button
                        onClick={() => handleTogglePin(item.id)}
                        className="text-[11px] font-bold text-blue-600 dark:text-cyan-400 hover:underline cursor-pointer"
                      >
                        {item.pinned ? 'Unpin' : 'Pin'}
                      </button>
                      <button
                        onClick={() => handleDelete(item.id)}
                        className="text-[11px] font-bold text-red-500 hover:underline cursor-pointer"
                      >
                        Delete
                      </button>
                    </>
                  )}
                </div>
              </div>
              <p className="text-xs leading-relaxed text-slate-600 dark:text-gray-300">
                {item.content}
              </p>
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
