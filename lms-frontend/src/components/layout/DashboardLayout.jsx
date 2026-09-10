import { useState } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

function BrandMark({ dark = false }) {
  return (
    <span
      className={`relative flex h-8 w-8 items-center justify-center rounded-[10px] ${
        dark ? 'bg-white text-[#151515]' : 'bg-[#151515] text-white'
      }`}
    >
      <span className="h-2.5 w-2.5 rounded-[3px] border-2 border-current" />
      <span className="absolute h-1.5 w-1.5 translate-x-2 -translate-y-2 rounded-full bg-[#FF7659]" />
    </span>
  );
}

function DashboardLayout() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const getDashboardPath = () => {
    if (!user) return '/login';
    if (user.role === 'student' || user.role === 'STUDENT') return '/student';
    if (user.role === 'faculty' || user.role === 'FACULTY') return '/faculty';
    if (user.role === 'admin' || user.role === 'ADMIN') return '/admin';
    return '/login';
  };

  return (
    <div className="min-h-screen overflow-x-hidden bg-[#F6F2E9] text-[#151515] flex flex-col">
      {/* HEADER */}
      <header className="relative z-30 border-b border-[#151515]/10 bg-[#F6F2E9]">
        <div className="mx-auto flex h-[78px] max-w-7xl items-center justify-between px-5 sm:px-8">
          <button onClick={() => navigate(getDashboardPath())} className="hub-lift flex items-center gap-3">
            <BrandMark />
            <span className="text-lg font-black tracking-[-.06em]">CourseHub</span>
          </button>
          
          <nav className="hidden items-center gap-8 lg:flex">
            <button onClick={() => navigate('/courses')} className="text-sm font-bold text-[#151515]/55 transition hover:text-[#151515]">
              Browse Catalog
            </button>
            <button onClick={() => navigate(getDashboardPath())} className="text-sm font-bold text-[#151515]/55 transition hover:text-[#151515]">
              My Workspace
            </button>
          </nav>

          <div className="hidden items-center gap-3 sm:flex">
            <span className="text-sm font-bold text-[#151515]/55 mr-4">
              Hi, {user?.name || 'User'}
            </span>
            <button
              onClick={handleLogout}
              className="hub-lift rounded-full border border-[#151515]/15 px-5 py-2.5 text-sm font-black hover:bg-black/5"
            >
              Sign out
            </button>
          </div>

          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="rounded-full border border-[#151515]/15 p-2.5 sm:hidden"
          >
            <span className="block h-0.5 w-4 bg-[#151515] mb-1"></span>
            <span className="block h-0.5 w-4 bg-[#151515] mb-1"></span>
            <span className="block h-0.5 w-4 bg-[#151515]"></span>
          </button>
        </div>
        
        {menuOpen && (
          <div className="border-t border-[#151515]/10 bg-[#F6F2E9] px-5 py-4 sm:hidden">
            <div className="grid gap-1">
              <button onClick={() => navigate('/courses')} className="rounded-xl px-3 py-3 text-left text-sm font-bold hover:bg-black/5">
                Browse Catalog
              </button>
              <button onClick={() => navigate(getDashboardPath())} className="rounded-xl px-3 py-3 text-left text-sm font-bold hover:bg-black/5">
                My Workspace
              </button>
            </div>
            <div className="mt-3 grid grid-cols-1 gap-3 border-t border-black/10 pt-4">
              <button onClick={handleLogout} className="rounded-xl border border-black/15 py-3 text-sm font-black">
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

      {/* FOOTER */}
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
