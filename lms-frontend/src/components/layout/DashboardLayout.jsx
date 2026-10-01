import { useState, useRef, useEffect } from 'react';
import { Outlet, useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';

function BrandMark({ dark = false }) {
  return (
    <span
      className={`relative flex h-8 w-8 items-center justify-center rounded-[10px] ${
        dark ? 'bg-white text-[#151515]' : 'bg-[#151515] text-white dark:bg-blue-600 dark:text-white'
      }`}
    >
      <span className="h-2.5 w-2.5 rounded-[3px] border-2 border-current" />
      <span className="absolute h-1.5 w-1.5 translate-x-2 -translate-y-2 rounded-full bg-[#FF7659]" />
    </span>
  );
}

function DashboardLayout() {
  const navigate = useNavigate();
  const { user, logout, isAuthenticated } = useAuth();
  const { isDark, toggleTheme } = useTheme();
  const [profileOpen, setProfileOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const dropdownRef = useRef(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setProfileOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Redirect if not authenticated
  if (!isAuthenticated) {
    navigate('/login', { replace: true });
    return null;
  }

  const handleLogout = () => {
    setProfileOpen(false);
    logout();
    navigate('/');
  };

  const getDashboardPath = () => {
    if (!user) return '/login';
    if (user.role === 'student' || user.role === 'STUDENT') return '/student';
    if (user.role === 'faculty' || user.role === 'FACULTY') return '/faculty';
    if (user.role === 'admin' || user.role === 'ADMIN') return '/admin';
    return '/student';
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/courses?search=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  return (
    <div className="min-h-screen overflow-x-hidden bg-[#F3F6FA] dark:bg-[#0B1120] text-slate-900 dark:text-slate-100 flex flex-col font-sans transition-colors duration-200">
      {/* HEADER MATCHING IMAGE WITH COURSEHUB BRANDING & DARK MODE */}
      <header className="sticky top-0 z-40 border-b border-slate-200/80 dark:border-slate-800 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md shadow-xs transition-colors duration-200">
        <div className="mx-auto flex h-[72px] max-w-7xl items-center justify-between px-4 sm:px-8">
          
          {/* LEFT: BRAND & NAV LINKS */}
          <div className="flex items-center gap-8">
            <button 
              onClick={() => navigate(getDashboardPath())} 
              className="hub-lift flex items-center gap-3"
            >
              <BrandMark dark={isDark} />
              <span className="text-lg font-black tracking-[-.06em] text-[#151515] dark:text-white transition-colors">
                CourseHub
              </span>
            </button>
            
            <nav className="hidden items-center gap-6 lg:flex">
              <button 
                onClick={() => navigate(getDashboardPath())} 
                className="text-xs font-semibold text-slate-700 dark:text-slate-200 hover:text-blue-600 dark:hover:text-blue-400 transition"
              >
                My Courses
              </button>
              <button 
                onClick={() => navigate('/courses')} 
                className="text-xs font-semibold text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition"
              >
                Resources
              </button>
              <button 
                onClick={() => navigate('/courses')} 
                className="text-xs font-semibold text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition"
              >
                Community
              </button>
            </nav>
          </div>

          {/* RIGHT: SEARCH, THEME TOGGLE, NOTIFICATIONS, PROFILE DROPDOWN */}
          <div className="hidden items-center gap-3.5 sm:flex">
            {/* Search Input Box */}
            <form onSubmit={handleSearchSubmit} className="relative">
              <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </span>
              <input
                type="text"
                placeholder="Search"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9 pr-4 py-2 w-40 lg:w-56 bg-slate-100/80 dark:bg-slate-800 border border-slate-200/60 dark:border-slate-700 rounded-full text-xs font-medium text-slate-800 dark:text-slate-100 placeholder-slate-400 focus:bg-white dark:focus:bg-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition"
              />
            </form>

            {/* Quick Theme Toggle Button */}
            <button
              onClick={toggleTheme}
              className="p-2.5 text-slate-600 dark:text-slate-300 bg-slate-100/70 dark:bg-slate-800 border border-slate-200/60 dark:border-slate-700 rounded-full hover:bg-slate-200/70 dark:hover:bg-slate-700 transition"
              title={isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
              aria-label="Toggle Theme"
            >
              {isDark ? (
                <svg className="w-4 h-4 text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
              ) : (
                <svg className="w-4 h-4 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                </svg>
              )}
            </button>

            {/* Notification Bell Button */}
            <button 
              className="relative p-2.5 text-slate-600 dark:text-slate-300 bg-slate-100/70 dark:bg-slate-800 border border-slate-200/60 dark:border-slate-700 rounded-full hover:bg-slate-200/70 dark:hover:bg-slate-700 transition"
              aria-label="Notifications"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
              </svg>
              <span className="absolute -top-0.5 -right-0.5 h-4 w-4 bg-blue-600 rounded-full text-[9px] font-extrabold text-white flex items-center justify-center border-2 border-white dark:border-slate-900">
                1
              </span>
            </button>

            {/* Profile Avatar + Name + Dropdown Trigger */}
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setProfileOpen(!profileOpen)}
                className="flex items-center gap-2.5 p-1 pr-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition"
              >
                <img
                  src={user?.avatar || "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80"}
                  alt={user?.name || "Sarah Jensen"}
                  className="h-8 w-8 rounded-full object-cover border border-slate-200 dark:border-slate-700"
                />
                <span className="text-xs font-bold text-slate-800 dark:text-slate-200">
                  {user?.name || 'Sarah Jensen'}
                </span>
                <svg className={`w-3.5 h-3.5 text-slate-500 transition-transform ${profileOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              {/* Clickable Profile Dropdown Menu */}
              {profileOpen && (
                <div className="absolute right-0 mt-2 w-60 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 shadow-xl py-2 z-50 animate-in fade-in slide-in-from-top-2">
                  <div className="px-4 py-3 border-b border-slate-100 dark:border-slate-800">
                    <p className="text-xs font-bold text-slate-900 dark:text-white">{user?.name || 'Sarah Jensen'}</p>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate">{user?.email || 'sarah.jensen@email.com'}</p>
                    <span className="mt-1.5 inline-block text-[10px] font-extrabold uppercase tracking-wider px-2 py-0.5 rounded-md bg-blue-50 dark:bg-blue-900/40 text-blue-600 dark:text-blue-400">
                      {user?.role || 'Student'}
                    </span>
                  </div>
                  
                  <div className="py-1">
                    <button
                      onClick={() => { setProfileOpen(false); navigate('/profile'); }}
                      className="w-full text-left px-4 py-2.5 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 hover:text-blue-600 dark:hover:text-blue-400 flex items-center gap-2.5 transition"
                    >
                      <svg className="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/></svg>
                      Profile
                    </button>
                    <button
                      onClick={() => { setProfileOpen(false); navigate('/settings'); }}
                      className="w-full text-left px-4 py-2.5 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 hover:text-blue-600 dark:hover:text-blue-400 flex items-center gap-2.5 transition"
                    >
                      <svg className="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"/><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/></svg>
                      Settings
                    </button>
                    <button
                      onClick={() => { setProfileOpen(false); navigate('/contact'); }}
                      className="w-full text-left px-4 py-2.5 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 hover:text-blue-600 dark:hover:text-blue-400 flex items-center gap-2.5 transition"
                    >
                      <svg className="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/></svg>
                      Contact Support
                    </button>
                    <button
                      onClick={() => { toggleTheme(); }}
                      className="w-full text-left px-4 py-2.5 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 hover:text-blue-600 dark:hover:text-blue-400 flex items-center gap-2.5 transition"
                    >
                      <span className="text-sm">{isDark ? '☀️' : '🌙'}</span>
                      {isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
                    </button>
                    <button
                      onClick={() => { setProfileOpen(false); navigate(getDashboardPath()); }}
                      className="w-full text-left px-4 py-2.5 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 hover:text-blue-600 dark:hover:text-blue-400 flex items-center gap-2.5 transition"
                    >
                      <svg className="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"/></svg>
                      My Dashboard
                    </button>
                  </div>

                  <div className="pt-1 border-t border-slate-100 dark:border-slate-800">
                    <button
                      onClick={handleLogout}
                      className="w-full text-left px-4 py-2.5 text-xs font-bold text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/30 flex items-center gap-2.5 transition"
                    >
                      <svg className="w-4 h-4 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"/></svg>
                      Sign out
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* MOBILE HAMBURGER TOGGLE */}
          <div className="flex items-center gap-2 sm:hidden">
            <button
              onClick={toggleTheme}
              className="p-2 text-slate-600 dark:text-slate-300 rounded-full border border-slate-200 dark:border-slate-700"
            >
              {isDark ? '☀️' : '🌙'}
            </button>
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="rounded-full border border-slate-200 dark:border-slate-700 p-2 text-slate-700 dark:text-slate-200"
            >
              <span className="block h-0.5 w-4 bg-current mb-1"></span>
              <span className="block h-0.5 w-4 bg-current mb-1"></span>
              <span className="block h-0.5 w-4 bg-current"></span>
            </button>
          </div>
        </div>
        
        {/* MOBILE MENU */}
        {menuOpen && (
          <div className="border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-5 py-4 sm:hidden space-y-3">
            <div className="grid gap-1">
              <button onClick={() => { setMenuOpen(false); navigate(getDashboardPath()); }} className="rounded-xl px-3 py-2 text-left text-xs font-bold hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-900 dark:text-white">
                My Courses
              </button>
              <button onClick={() => { setMenuOpen(false); navigate('/courses'); }} className="rounded-xl px-3 py-2 text-left text-xs font-bold hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-900 dark:text-white">
                Resources & Catalog
              </button>
              <button onClick={() => { setMenuOpen(false); navigate('/profile'); }} className="rounded-xl px-3 py-2 text-left text-xs font-bold hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-900 dark:text-white">
                Profile
              </button>
              <button onClick={() => { setMenuOpen(false); navigate('/settings'); }} className="rounded-xl px-3 py-2 text-left text-xs font-bold hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-900 dark:text-white">
                Settings
              </button>
              <button onClick={() => { setMenuOpen(false); navigate('/contact'); }} className="rounded-xl px-3 py-2 text-left text-xs font-bold hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-900 dark:text-white">
                Contact Support
              </button>
            </div>
            <div className="pt-3 border-t border-slate-100 dark:border-slate-800">
              <button onClick={handleLogout} className="w-full rounded-xl border border-red-200 dark:border-red-900/50 bg-red-50 dark:bg-red-950/30 py-2.5 text-xs font-bold text-red-600 dark:text-red-400">
                Sign out
              </button>
            </div>
          </div>
        )}
      </header>

      {/* DYNAMIC CONTENT REGION */}
      <div className="flex-1">
        <Outlet />
      </div>

      {/* FOOTER (SAME AS BEFORE) */}
      <footer className="bg-[#151515] text-white">
        <div className="mx-auto flex max-w-7xl flex-wrap justify-between gap-3 px-5 py-8 text-xs text-white/40 sm:px-8">
          <div className="flex items-center gap-3">
            <BrandMark dark />
            <span className="text-sm font-black tracking-[-.05em] text-white">CourseHub</span>
          </div>
          <div className="flex items-center gap-5">
            <span>© 2026 CourseHub.</span>
            <span>Privacy · Terms</span>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default DashboardLayout;
