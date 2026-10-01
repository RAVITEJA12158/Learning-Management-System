import { useState, useRef, useEffect } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import BrandMark from '../common/BrandMark';
import Footer from './Footer';
import {
  SearchIcon,
  BellIcon,
  ChevronDownIcon,
  SunIcon,
  MoonIcon,
  UserIcon,
  CogIcon,
  MailIcon,
  BookIcon,
  LogoutIcon,
} from '../common/Icons';

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
    const role = user.role?.toLowerCase();
    if (role === 'student') return '/student';
    if (role === 'faculty') return '/faculty';
    if (role === 'admin') return '/admin';
    return '/student';
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/courses?search=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  return (
    <div className="min-h-screen overflow-x-hidden bg-[#F3F6FA] dark:bg-zinc-950 text-slate-900 dark:text-zinc-50 flex flex-col font-sans transition-colors duration-200">
      {/* 2. TOP NAVIGATION BAR */}
      <header className="sticky top-0 z-40 border-b border-slate-200/80 dark:border-zinc-800 bg-white/95 dark:bg-zinc-900/95 backdrop-blur-md shadow-xs transition-colors duration-200">
        <div className="mx-auto flex h-[72px] max-w-[1440px] items-center justify-between px-4 sm:px-8">
          
          {/* LEFT: BRAND & NAV LINKS */}
          <div className="flex items-center gap-8">
            <button 
              onClick={() => navigate(getDashboardPath())} 
              className="hub-lift flex items-center gap-3 cursor-pointer"
            >
              <BrandMark dark={isDark} />
              <span className="text-lg font-black tracking-[-.06em] text-[#151515] dark:text-zinc-50 transition-colors">
                CourseHub
              </span>
            </button>
            
            <nav className="hidden items-center gap-6 lg:flex">
              <button 
                onClick={() => navigate(getDashboardPath())} 
                className="text-xs font-semibold text-slate-700 dark:text-zinc-200 hover:text-blue-600 dark:hover:text-blue-400 transition cursor-pointer"
              >
                My Courses
              </button>
              <button 
                onClick={() => navigate('/courses')} 
                className="text-xs font-semibold text-slate-500 dark:text-zinc-400 hover:text-slate-900 dark:hover:text-zinc-50 transition cursor-pointer"
              >
                Catalog & Resources
              </button>
            </nav>
          </div>

          {/* RIGHT: GLOBAL SEARCH, THEME TOGGLE, USER CONTROLS */}
          <div className="hidden items-center gap-3.5 sm:flex">
            {/* Pill-shaped search input (bg-zinc-800 in dark mode) */}
            <form onSubmit={handleSearchSubmit} className="relative">
              <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400 dark:text-zinc-400">
                <SearchIcon className="w-4 h-4" />
              </span>
              <input
                type="text"
                placeholder="Search courses..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9 pr-4 py-2 w-40 lg:w-56 bg-slate-100/80 dark:bg-zinc-800 border border-slate-200/60 dark:border-zinc-700 rounded-full text-xs font-medium text-slate-800 dark:text-zinc-100 placeholder-slate-400 dark:placeholder-zinc-500 focus:bg-white dark:focus:bg-zinc-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition"
              />
            </form>

            {/* Quick Theme Toggle Button */}
            <button
              onClick={toggleTheme}
              className="p-2.5 text-slate-600 dark:text-zinc-300 bg-slate-100/70 dark:bg-zinc-800 border border-slate-200/60 dark:border-zinc-700 rounded-full hover:bg-slate-200/70 dark:hover:bg-zinc-700 transition cursor-pointer"
              title={isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
              aria-label="Toggle Theme"
            >
              {isDark ? (
                <SunIcon className="w-4 h-4 text-amber-400" />
              ) : (
                <MoonIcon className="w-4 h-4 text-slate-600" />
              )}
            </button>

            {/* Notification Bell with unread badge counter */}
            <button 
              className="relative p-2.5 text-slate-600 dark:text-zinc-300 bg-slate-100/70 dark:bg-zinc-800 border border-slate-200/60 dark:border-zinc-700 rounded-full hover:bg-slate-200/70 dark:hover:bg-zinc-700 transition cursor-pointer"
              aria-label="Notifications"
            >
              <BellIcon className="w-4 h-4" />
              <span className="absolute -top-0.5 -right-0.5 h-4 w-4 bg-blue-600 rounded-full text-[9px] font-extrabold text-white flex items-center justify-center border-2 border-white dark:border-zinc-900">
                1
              </span>
            </button>

            {/* User Profile Avatar + Dropdown */}
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setProfileOpen(!profileOpen)}
                className="flex items-center gap-2.5 p-1 pr-2 rounded-full hover:bg-slate-100 dark:hover:bg-zinc-800 transition cursor-pointer"
              >
                <img
                  src={user?.avatar || "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80"}
                  alt={user?.name || "Sarah Jensen"}
                  className="h-8 w-8 rounded-full object-cover border border-slate-200 dark:border-zinc-700"
                />
                <span className="text-xs font-bold text-slate-800 dark:text-zinc-200">
                  {user?.name || 'Sarah Jensen'}
                </span>
                <ChevronDownIcon className={`w-3.5 h-3.5 text-slate-500 dark:text-zinc-400 transition-transform ${profileOpen ? 'rotate-180' : ''}`} />
              </button>

              {/* Clickable Profile Dropdown Menu */}
              {profileOpen && (
                <div className="absolute right-0 mt-2 w-60 rounded-2xl bg-white dark:bg-zinc-900 border border-slate-200/90 dark:border-zinc-800 shadow-xl py-2 z-50 animate-in fade-in slide-in-from-top-2">
                  <div className="px-4 py-3 border-b border-slate-100 dark:border-zinc-800">
                    <p className="text-xs font-bold text-slate-900 dark:text-zinc-50">{user?.name || 'Sarah Jensen'}</p>
                    <p className="text-[11px] text-slate-500 dark:text-zinc-400 truncate">{user?.email || 'sarah.jensen@email.com'}</p>
                    <span className="mt-1.5 inline-block text-[10px] font-extrabold uppercase tracking-wider px-2 py-0.5 rounded-md bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 border dark:border-blue-800/40">
                      {user?.role || 'Student'}
                    </span>
                  </div>
                  
                  <div className="py-1">
                    <button
                      onClick={() => { setProfileOpen(false); navigate('/profile'); }}
                      className="w-full text-left px-4 py-2.5 text-xs font-semibold text-slate-700 dark:text-zinc-300 hover:bg-slate-50 dark:hover:bg-zinc-800 hover:text-blue-600 dark:hover:text-blue-400 flex items-center gap-2.5 transition cursor-pointer"
                    >
                      <UserIcon className="w-4 h-4 text-slate-400 dark:text-zinc-500" />
                      Profile
                    </button>
                    <button
                      onClick={() => { setProfileOpen(false); navigate('/settings'); }}
                      className="w-full text-left px-4 py-2.5 text-xs font-semibold text-slate-700 dark:text-zinc-300 hover:bg-slate-50 dark:hover:bg-zinc-800 hover:text-blue-600 dark:hover:text-blue-400 flex items-center gap-2.5 transition cursor-pointer"
                    >
                      <CogIcon className="w-4 h-4 text-slate-400 dark:text-zinc-500" />
                      Settings
                    </button>
                    <button
                      onClick={() => { setProfileOpen(false); navigate('/contact'); }}
                      className="w-full text-left px-4 py-2.5 text-xs font-semibold text-slate-700 dark:text-zinc-300 hover:bg-slate-50 dark:hover:bg-zinc-800 hover:text-blue-600 dark:hover:text-blue-400 flex items-center gap-2.5 transition cursor-pointer"
                    >
                      <MailIcon className="w-4 h-4 text-slate-400 dark:text-zinc-500" />
                      Contact Support
                    </button>
                    <button
                      onClick={() => { toggleTheme(); }}
                      className="w-full text-left px-4 py-2.5 text-xs font-semibold text-slate-700 dark:text-zinc-300 hover:bg-slate-50 dark:hover:bg-zinc-800 hover:text-blue-600 dark:hover:text-blue-400 flex items-center gap-2.5 transition cursor-pointer"
                    >
                      {isDark ? <SunIcon className="w-4 h-4 text-amber-400" /> : <MoonIcon className="w-4 h-4 text-slate-600" />}
                      {isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
                    </button>
                    <button
                      onClick={() => { setProfileOpen(false); navigate(getDashboardPath()); }}
                      className="w-full text-left px-4 py-2.5 text-xs font-semibold text-slate-700 dark:text-zinc-300 hover:bg-slate-50 dark:hover:bg-zinc-800 hover:text-blue-600 dark:hover:text-blue-400 flex items-center gap-2.5 transition cursor-pointer"
                    >
                      <BookIcon className="w-4 h-4 text-slate-400 dark:text-zinc-500" />
                      My Dashboard
                    </button>
                  </div>

                  <div className="pt-1 border-t border-slate-100 dark:border-zinc-800">
                    <button
                      onClick={handleLogout}
                      className="w-full text-left px-4 py-2.5 text-xs font-bold text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/30 flex items-center gap-2.5 transition cursor-pointer"
                    >
                      <LogoutIcon className="w-4 h-4 text-red-500" />
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
              className="p-2 text-slate-600 dark:text-zinc-300 rounded-full border border-slate-200 dark:border-zinc-700 cursor-pointer"
            >
              {isDark ? <SunIcon className="w-4 h-4 text-amber-400" /> : <MoonIcon className="w-4 h-4 text-slate-600" />}
            </button>
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="rounded-full border border-slate-200 dark:border-zinc-700 p-2 text-slate-700 dark:text-zinc-200 cursor-pointer"
            >
              <span className="block h-0.5 w-4 bg-current mb-1"></span>
              <span className="block h-0.5 w-4 bg-current mb-1"></span>
              <span className="block h-0.5 w-4 bg-current"></span>
            </button>
          </div>
        </div>
        
        {/* MOBILE MENU */}
        {menuOpen && (
          <div className="border-t border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 px-5 py-4 sm:hidden space-y-3">
            <div className="grid gap-1">
              <button onClick={() => { setMenuOpen(false); navigate(getDashboardPath()); }} className="rounded-xl px-3 py-2 text-left text-xs font-bold hover:bg-slate-50 dark:hover:bg-zinc-800 text-slate-900 dark:text-zinc-50">
                My Courses
              </button>
              <button onClick={() => { setMenuOpen(false); navigate('/courses'); }} className="rounded-xl px-3 py-2 text-left text-xs font-bold hover:bg-slate-50 dark:hover:bg-zinc-800 text-slate-900 dark:text-zinc-50">
                Resources & Catalog
              </button>
              <button onClick={() => { setMenuOpen(false); navigate('/profile'); }} className="rounded-xl px-3 py-2 text-left text-xs font-bold hover:bg-slate-50 dark:hover:bg-zinc-800 text-slate-900 dark:text-zinc-50">
                Profile
              </button>
              <button onClick={() => { setMenuOpen(false); navigate('/settings'); }} className="rounded-xl px-3 py-2 text-left text-xs font-bold hover:bg-slate-50 dark:hover:bg-zinc-800 text-slate-900 dark:text-zinc-50">
                Settings
              </button>
              <button onClick={() => { setMenuOpen(false); navigate('/contact'); }} className="rounded-xl px-3 py-2 text-left text-xs font-bold hover:bg-slate-50 dark:hover:bg-zinc-800 text-slate-900 dark:text-zinc-50">
                Contact Support
              </button>
            </div>
            <div className="pt-3 border-t border-slate-100 dark:border-zinc-800">
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

      {/* GLOBAL REUSABLE FOOTER */}
      <Footer />
    </div>
  );
}

export default DashboardLayout;
