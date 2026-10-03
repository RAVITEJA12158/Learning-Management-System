import React from 'react';

/**
 * CourseHub BrandMark Icon
 * Consistent across navbar, landing page, and footer.
 */
export function BrandMark({ dark = false, className = '' }) {
  return (
    <span
      className={`relative flex h-8 w-8 items-center justify-center rounded-[10px] shrink-0 transition-colors ${
        dark
          ? 'bg-white text-[#151515]'
          : 'bg-[#151515] text-white dark:bg-blue-600 dark:text-white'
      } ${className}`}
    >
      <span className="h-2.5 w-2.5 rounded-[3px] border-2 border-current" />
      <span className="absolute h-1.5 w-1.5 translate-x-2 -translate-y-2 rounded-full bg-[#FF7659]" />
    </span>
  );
}

export default BrandMark;
