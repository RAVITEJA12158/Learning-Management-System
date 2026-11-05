import React from 'react';
import BrandMark from '../common/BrandMark';

function Footer() {
  return (
    <footer className="bg-slate-950 dark:bg-gray-950 text-white relative transition-colors duration-200">
      {/* Signature Faint Gradient Separator Line */}
      <div className="h-[1px] w-full bg-gradient-to-r from-transparent via-slate-700/60 dark:via-gray-700 to-transparent" />
      
      <div className="mx-auto flex max-w-[1440px] flex-wrap justify-between items-center gap-3 px-5 py-8 text-xs text-slate-400 dark:text-gray-400 sm:px-8">
        <div className="flex items-center gap-3">
          <BrandMark dark />
          <span className="text-sm font-black tracking-[-.05em] text-white">CourseHub</span>
        </div>
        <div className="flex items-center gap-5">
          <span>© 2026 CourseHub. All rights reserved.</span>
          <span className="hover:text-cyan-400 cursor-pointer transition">Privacy</span>
          <span>·</span>
          <span className="hover:text-cyan-400 cursor-pointer transition">Terms</span>
        </div>
      </div>
    </footer>
  );
}

export default Footer;