import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { notificationService } from '../services/courseService';
import Badge from '../components/common/Badge';
import Button from '../components/common/Button';
import { BellIcon } from '../components/common/Icons';

function NotificationsPage() {
  const navigate = useNavigate();
  const [notifications, setNotifications] = useState([]);
  const [filter, setFilter] = useState('ALL');

  useEffect(() => {
    let isMounted = true;
    notificationService.fetchAll().then((list) => {
      if (isMounted && Array.isArray(list)) {
        setNotifications(list);
      }
    });
    return () => {
      isMounted = false;
    };
  }, []);

  const handleMarkAsRead = (id) => {
    const updated = notificationService.markAsRead(id);
    if (Array.isArray(updated)) {
      setNotifications(updated);
    }
  };

  const handleMarkAllRead = () => {
    const updated = notificationService.markAllAsRead();
    if (Array.isArray(updated)) {
      setNotifications(updated);
    }
  };

  const handleDelete = (id, e) => {
    e.stopPropagation();
    const updated = notificationService.delete(id);
    if (Array.isArray(updated)) {
      setNotifications(updated);
    }
  };

  const safeList = Array.isArray(notifications) ? notifications : [];
  const filtered = safeList.filter((n) => {
    if (filter === 'UNREAD') return !n.isRead;
    if (filter !== 'ALL') return n.type === filter;
    return true;
  });
  const unreadCount = safeList.filter((n) => !n.isRead).length;

  return (
    <main className="mx-auto max-w-[1440px] px-4 py-8 sm:px-8 lg:py-10 w-full font-sans transition-colors duration-200">
      <div className="mb-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <Badge variant="info" className="mb-2">
            Real-Time Academic Alerts (NOTIFICATIONS)
          </Badge>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
            Notification Center
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-gray-400 mt-1">
            Stay updated on published grades, upcoming assignment deadlines, announcements, and discussion replies.
          </p>
        </div>
        {unreadCount > 0 && (
          <Button variant="outline" onClick={handleMarkAllRead}>
            ✓ Mark All ({unreadCount}) as Read
          </Button>
        )}
      </div>

      <div className="flex flex-wrap items-center gap-2 mb-6">
        {[
          { id: 'ALL', label: `All (${safeList.length})` },
          { id: 'UNREAD', label: `Unread (${unreadCount})` },
          { id: 'GRADE', label: 'Grades' },
          { id: 'ASSIGNMENT', label: 'Assignments' },
          { id: 'ANNOUNCEMENT', label: 'Announcements' },
          { id: 'DISCUSSION', label: 'Discussions' },
          { id: 'SYSTEM', label: 'System' },
        ].map((f) => (
          <button
            key={f.id}
            onClick={() => setFilter(f.id)}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition cursor-pointer ${
              filter === f.id
                ? 'bg-[#0066FF] text-white shadow-[0_0_15px_rgba(0,102,255,0.4)]'
                : 'bg-white dark:bg-white/[0.03] text-slate-600 dark:text-gray-400 border border-slate-200/80 dark:border-white/10'
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>

      <div className="bg-white dark:bg-white/[0.02] backdrop-blur-xl rounded-2xl border border-slate-200/80 dark:border-white/10 divide-y divide-slate-100 dark:divide-white/5 overflow-hidden shadow-xs">
        {filtered.length > 0 ? (
          filtered.map((n) => (
            <div
              key={n.id}
              onClick={() => {
                handleMarkAsRead(n.id);
                if (n.courseId) navigate(`/courses/${n.courseId}`);
              }}
              className={`p-5 flex items-start justify-between gap-4 hover:bg-slate-50/80 dark:hover:bg-white/[0.03] transition cursor-pointer ${
                !n.isRead ? 'bg-blue-50/30 dark:bg-cyan-950/15' : ''
              }`}
            >
              <div className="flex items-start gap-3.5">
                <div className="p-2.5 rounded-xl bg-blue-50 dark:bg-cyan-950/50 text-blue-600 dark:text-cyan-400 shrink-0 mt-0.5">
                  <BellIcon className="w-4 h-4" />
                </div>
                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    {!n.isRead && <span className="h-2 w-2 rounded-full bg-blue-600 dark:bg-cyan-400" />}
                    <Badge variant={n.type === 'GRADE' ? 'active' : 'info'}>{n.type}</Badge>
                    <h3 className="text-sm font-bold text-slate-900 dark:text-white">{n.title}</h3>
                  </div>
                  <p className="text-xs text-slate-600 dark:text-gray-300 mt-1.5 leading-relaxed">
                    {n.message}
                  </p>
                  <p className="text-[11px] font-medium text-slate-400 dark:text-gray-500 mt-2">
                    {n.createdAt}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3 shrink-0">
                {!n.isRead && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleMarkAsRead(n.id);
                    }}
                    className="text-xs font-bold text-blue-600 dark:text-cyan-400 hover:underline cursor-pointer"
                  >
                    Mark read
                  </button>
                )}
                <button
                  onClick={(e) => handleDelete(n.id, e)}
                  className="text-xs text-slate-400 hover:text-red-500 px-2 py-1 rounded cursor-pointer"
                  title="Dismiss notification"
                >
                  ✕
                </button>
              </div>
            </div>
          ))
        ) : (
          <div className="p-12 text-center text-xs font-bold text-slate-400 dark:text-gray-500">
            No notifications match this filter.
          </div>
        )}
      </div>
    </main>
  );
}

export default NotificationsPage;
