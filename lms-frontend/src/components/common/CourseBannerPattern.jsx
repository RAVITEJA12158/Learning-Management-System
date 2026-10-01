import React from 'react';

export function CourseBannerPattern({ index = 0, title = 'Course', bannerUrl = null }) {
  if (bannerUrl) {
    return (
      <img
        src={bannerUrl}
        alt={title}
        className="w-full h-full object-cover rounded-t-xl"
      />
    );
  }

  // 6 Custom Vector Art Patterns matching the screenshot
  const patternIndex = index % 6;

  if (patternIndex === 0) {
    // Machine Learning pattern
    return (
      <div className="w-full h-full bg-[#08172E] relative flex items-center justify-between px-5 text-white overflow-hidden select-none">
        {/* Left Tech SVG Graphic */}
        <div className="relative z-10 opacity-90">
          <svg className="w-20 h-20 text-blue-400" viewBox="0 0 100 100" fill="none">
            {/* Neural Net Nodes & Lines */}
            <line x1="20" y1="30" x2="50" y2="20" stroke="currentColor" strokeWidth="1.5" opacity="0.6"/>
            <line x1="20" y1="30" x2="50" y2="50" stroke="currentColor" strokeWidth="1.5" opacity="0.6"/>
            <line x1="20" y1="70" x2="50" y2="50" stroke="currentColor" strokeWidth="1.5" opacity="0.6"/>
            <line x1="20" y1="70" x2="50" y2="80" stroke="currentColor" strokeWidth="1.5" opacity="0.6"/>
            <line x1="50" y1="20" x2="80" y2="40" stroke="currentColor" strokeWidth="1.5" opacity="0.8"/>
            <line x1="50" y1="50" x2="80" y2="40" stroke="currentColor" strokeWidth="1.5" opacity="0.8"/>
            <line x1="50" y1="80" x2="80" y2="60" stroke="currentColor" strokeWidth="1.5" opacity="0.8"/>

            <circle cx="20" cy="30" r="4" fill="#60A5FA"/>
            <circle cx="20" cy="70" r="4" fill="#60A5FA"/>
            <circle cx="50" cy="20" r="4" fill="#93C5FD"/>
            <circle cx="50" cy="50" r="5" fill="#3B82F6"/>
            <circle cx="50" cy="80" r="4" fill="#93C5FD"/>
            <circle cx="80" cy="40" r="5" fill="#60A5FA"/>
            <circle cx="80" cy="60" r="4" fill="#60A5FA"/>
          </svg>
        </div>

        {/* Right Title Text */}
        <div className="text-right z-10 pl-2">
          <p className="text-base font-extrabold text-white tracking-tight leading-tight">
            Machine<br /><span className="text-blue-400">Learning</span>
          </p>
        </div>

        {/* Decorative Grid Overlay */}
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#3b82f6_1px,transparent_1px)] [background-size:12px_12px]" />
      </div>
    );
  }

  if (patternIndex === 1) {
    // Linear Algebra pattern
    return (
      <div className="w-full h-full bg-[#091A33] relative flex items-center justify-between px-5 text-white overflow-hidden select-none">
        {/* Matrix & Curve Graphic */}
        <div className="relative z-10 opacity-90 font-mono text-[10px] text-blue-300">
          <div className="border-l-2 border-r-2 border-blue-400 px-2 py-1 leading-tight">
            <div>1 0 0</div>
            <div>0 1 0</div>
            <div>0 0 1</div>
          </div>
        </div>

        {/* Right Title Text */}
        <div className="text-right z-10 pl-2">
          <p className="text-base font-extrabold text-white tracking-tight leading-tight">
            Linear<br /><span className="text-blue-400">Algebra</span>
          </p>
        </div>

        {/* Vector Curve */}
        <svg className="absolute left-1/3 top-2 w-24 h-24 text-blue-500/30" fill="none" stroke="currentColor" viewBox="0 0 100 100">
          <path d="M10 80 Q 50 10, 90 80" strokeWidth="2" fill="none"/>
          <line x1="10" y1="80" x2="90" y2="80" strokeWidth="1" strokeDasharray="3 3"/>
        </svg>
      </div>
    );
  }

  if (patternIndex === 2) {
    // Web Development pattern
    return (
      <div className="w-full h-full bg-[#071830] relative flex items-center justify-between px-5 text-white overflow-hidden select-none">
        {/* Code Icon & Window */}
        <div className="relative z-10 opacity-90 flex items-center gap-2">
          <div className="p-2 rounded-lg bg-blue-500/20 border border-blue-400/40 text-blue-400">
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
            </svg>
          </div>
          <span className="text-[10px] font-mono bg-blue-600/30 text-blue-300 px-1.5 py-0.5 rounded border border-blue-500/30">UI</span>
        </div>

        {/* Right Title Text */}
        <div className="text-right z-10 pl-2">
          <p className="text-base font-extrabold text-white tracking-tight leading-tight">
            Web<br /><span className="text-blue-400">Development</span>
          </p>
        </div>
      </div>
    );
  }

  if (patternIndex === 3) {
    // Linear Learning pattern
    return (
      <div className="w-full h-full bg-[#08172E] relative flex items-center justify-between px-5 text-white overflow-hidden select-none">
        {/* Laptop & Mic Icon */}
        <div className="relative z-10 opacity-90 text-blue-400">
          <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
          </svg>
        </div>

        {/* Right Title Text */}
        <div className="text-right z-10 pl-2">
          <p className="text-base font-extrabold text-white tracking-tight leading-tight">
            Linear<br /><span className="text-blue-400">Learning</span>
          </p>
        </div>
      </div>
    );
  }

  if (patternIndex === 4) {
    // Machine Algebra pattern
    return (
      <div className="w-full h-full bg-[#091A33] relative flex items-center justify-between px-5 text-white overflow-hidden select-none">
        {/* Formula SVG */}
        <div className="relative z-10 opacity-90 text-blue-300 font-mono text-xs">
          <p>f(x) = ∑ W · x</p>
        </div>

        {/* Right Title Text */}
        <div className="text-right z-10 pl-2">
          <p className="text-base font-extrabold text-white tracking-tight leading-tight">
            Machine<br /><span className="text-blue-400">Algebra</span>
          </p>
        </div>
      </div>
    );
  }

  // Pattern index 5: Student Development
  return (
    <div className="w-full h-full bg-[#071830] relative flex items-center justify-between px-5 text-white overflow-hidden select-none">
      {/* Code Browser mockup */}
      <div className="relative z-10 opacity-90 text-blue-400">
        <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M8 9l3 3-3 3m5 0h3M5 20h14a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
      </div>

      {/* Right Title Text */}
      <div className="text-right z-10 pl-2">
        <p className="text-base font-extrabold text-white tracking-tight leading-tight">
          Student<br /><span className="text-blue-400">Development</span>
        </p>
      </div>
    </div>
  );
}
