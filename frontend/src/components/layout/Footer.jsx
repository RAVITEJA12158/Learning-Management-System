import React from 'react';
import { useNavigate } from 'react-router-dom';
import BrandMark from '../common/BrandMark';

export default function Footer() {
  const navigate = useNavigate();
  return (
    <footer className="bg-slate-950 dark:bg-gray-950 text-white relative transition-colors duration-200">
      <div className="h-[1px] w-full bg-gradient-to-r from-transparent via-slate-700/60 dark:via-gray-700 to-transparent" />
      <div className="mx-auto flex max-w-[1440px] flex-col sm:flex-row flex-wrap justify-between items-center gap-4 px-5 py-8 text-xs text-slate-400 dark:text-gray-400 sm:px-8 text-center sm:text-left">
        <button
          onClick={() => navigate('/')}
          className="flex items-center gap-3 cursor-pointer hover:opacity-90 transition min-h-[44px]"
        >
          <BrandMark dark={true} />
          <span className="text-sm font-black tracking-[-.05em] text-white">
            CourseHub
          </span>
        </button>
        <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-5">
          <span className="w-full sm:w-auto">© 2026 CourseHub LMS. All rights reserved.</span>
          <button
            onClick={() => navigate('/courses')}
            className="hover:text-cyan-400 cursor-pointer transition py-2 px-1"
          >
            Catalog
          </button>
          <span className="hidden sm:inline">·</span>
          <button
            onClick={() => navigate('/settings')}
            className="hover:text-cyan-400 cursor-pointer transition py-2 px-1"
          >
            Privacy & Preferences
          </button>
          <span className="hidden sm:inline">·</span>
          <button
            onClick={() => navigate('/contact')}
            className="hover:text-cyan-400 cursor-pointer transition py-2 px-1"
          >
            Support
          </button>
        </div>
      </div>
    </footer>
  );
}
