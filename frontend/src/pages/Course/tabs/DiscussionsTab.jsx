import React, { useState } from 'react';

export function DiscussionsTab({ isEnrolled, user }) {
  const [threads, setThreads] = useState([
    {
      id: 'thread-1',
      title: 'Clarification on Module 1 - Problem Set question 3',
      author: 'Jane Doe',
      authorRole: 'Student',
      time: '3 hours ago',
      content:
        'Does question 3 require asymptotic upper bound or strict tight bound theta analysis?',
      replies: 4,
      likes: 6,
    },
    {
      id: 'thread-2',
      title: 'Study group for upcoming Midterm',
      author: 'Alex Chen',
      authorRole: 'Student',
      time: '1 day ago',
      content:
        'Setting up a virtual study group this Saturday 4 PM. Reply below if you want to join the Discord channel!',
      replies: 12,
      likes: 15,
    },
  ]);

  const [isStartingThread, setIsStartingThread] = useState(false);
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');

  const handleCreateThread = (e) => {
    e.preventDefault();
    if (!title.trim() || !body.trim()) return;

    setThreads([
      {
        id: `thread-${Date.now()}`,
        title,
        author: user?.name || 'Current User',
        authorRole: user?.role === 'student' ? 'Student' : 'Instructor',
        time: 'Just now',
        content: body,
        replies: 0,
        likes: 0,
      },
      ...threads,
    ]);
    setTitle('');
    setBody('');
    setIsStartingThread(false);
  };

  return (
    <div className="p-6 space-y-6">
      <div className="rounded-2xl bg-white dark:bg-white/[0.02] backdrop-blur-xl border border-slate-200/80 dark:border-white/10 p-6 shadow-xs transition-colors">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-base font-bold text-slate-900 dark:text-white">Class Discussion Forum</h2>
            <p className="text-xs text-slate-500 dark:text-gray-400 mt-0.5">
              Ask questions, discuss topics, and collaborate with your peers and instructors.
            </p>
          </div>
          <button
            onClick={() => setIsStartingThread(!isStartingThread)}
            className="text-xs font-bold text-blue-600 dark:text-cyan-400 hover:underline cursor-pointer"
          >
            {isStartingThread ? 'Cancel' : '+ New Thread'}
          </button>
        </div>

        {isStartingThread && (
          <form
            onSubmit={handleCreateThread}
            className="mb-6 p-4 rounded-xl bg-slate-50 dark:bg-white/[0.03] border border-slate-200/80 dark:border-white/10 space-y-3"
          >
            <h3 className="text-xs font-bold text-slate-900 dark:text-white">Start a New Discussion</h3>
            <input
              type="text"
              required
              placeholder="Thread Title or Question"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full rounded-lg border border-slate-200 dark:border-white/10 bg-white dark:bg-[#030712] px-3 py-2 text-xs font-medium text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-gray-500 focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400/30 focus:outline-none"
            />
            <textarea
              rows={3}
              required
              placeholder="What would you like to discuss?"
              value={body}
              onChange={(e) => setBody(e.target.value)}
              className="w-full rounded-lg border border-slate-200 dark:border-white/10 bg-white dark:bg-[#030712] p-3 text-xs font-medium text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-gray-500 focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400/30 focus:outline-none"
            />
            <div className="flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setIsStartingThread(false)}
                className="px-3 py-1.5 text-xs font-bold text-slate-600 dark:text-gray-400 hover:text-slate-900 dark:hover:text-white"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="rounded-lg bg-[#0066FF] hover:bg-blue-600 px-4 py-1.5 text-xs font-bold text-white shadow-[0_0_15px_rgba(0,102,255,0.4)] transition"
              >
                Post Thread
              </button>
            </div>
          </form>
        )}

        <div className="space-y-3">
          {threads.map((t) => (
            <div
              key={t.id}
              className="p-4 rounded-xl bg-slate-50 dark:bg-white/[0.02] border border-slate-200/60 dark:border-white/5 transition-all hover:dark:border-white/15"
            >
              <div className="flex items-center justify-between gap-3">
                <h3 className="text-xs font-bold text-slate-900 dark:text-white">{t.title}</h3>
                <span className="text-[10px] text-slate-400 dark:text-gray-500 font-medium shrink-0">
                  {t.time}
                </span>
              </div>
              <p className="text-xs text-slate-600 dark:text-gray-300 mt-1 leading-relaxed">{t.content}</p>
              <div className="flex items-center justify-between mt-3 text-[11px] text-slate-400 dark:text-gray-500">
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-slate-700 dark:text-gray-200">{t.author}</span>
                  <span>·</span>
                  <span className="text-[10px] bg-slate-200/70 dark:bg-white/10 px-1.5 py-0.5 rounded text-slate-700 dark:text-gray-300">
                    {t.authorRole}
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <span>💬 {t.replies} replies</span>
                  <span>👍 {t.likes}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default DiscussionsTab;
