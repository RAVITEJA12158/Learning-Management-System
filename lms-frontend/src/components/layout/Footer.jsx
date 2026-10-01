import React from 'react';
import BrandMark from '../common/BrandMark';

function Footer() {
  return (
    <footer className="bg-[#151515] text-white transition-colors duration-200">
      <div className="mx-auto flex max-w-7xl flex-wrap justify-between items-center gap-3 px-5 py-8 text-xs text-white/40 sm:px-8">
        <div className="flex items-center gap-3">
          <BrandMark dark />
          <span className="text-sm font-black tracking-[-.05em] text-white">CourseHub</span>
        </div>
        <div className="flex items-center gap-5">
          <span>© 2026 CourseHub. All rights reserved.</span>
          <span className="hover:text-white/60 cursor-pointer transition">Privacy</span>
          <span>·</span>
          <span className="hover:text-white/60 cursor-pointer transition">Terms</span>
        </div>
      </div>
    </footer>
  );
}

export default Footer;