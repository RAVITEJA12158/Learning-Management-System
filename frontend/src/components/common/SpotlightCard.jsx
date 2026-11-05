import React, { useState, useRef } from 'react';

/**
 * SpotlightCard
 * "Midnight Glassmorphism" Cursor Tracking Glow Card
 * Tracks cursor position relative to the element and shines a soft cyan/violet
 * radial gradient behind frosted translucent glass.
 */
export function SpotlightCard({
  children,
  className = '',
  spotlightColor = 'rgba(34, 211, 238, 0.14)', // Electric Cyan spotlight
  size = 400,
  as: Component = 'div',
  onClick,
  alwaysDark = false,
  ...props
}) {
  const cardRef = useRef(null);
  const [pos, setPos] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseMove = (e) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    setPos({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    });
  };

  const baseThemeClasses = alwaysDark
    ? 'bg-white/[0.03] border border-white/10 hover:border-white/25 text-white shadow-2xl backdrop-blur-xl'
    : 'bg-white dark:bg-white/[0.02] border border-slate-200/80 dark:border-white/5 dark:hover:border-white/20 backdrop-blur-xl shadow-xs dark:shadow-md dark:shadow-black/40';

  return (
    <Component
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={onClick}
      className={`group relative overflow-hidden rounded-2xl transition-all duration-300 ${baseThemeClasses} ${className}`}
      {...props}
    >
      {/* Dynamic Cursor Spotlight Layer */}
      <div
        className={`pointer-events-none absolute -inset-px rounded-2xl transition-opacity duration-300 z-0 ${
          alwaysDark ? 'opacity-0 group-hover:opacity-100' : 'opacity-0 dark:group-hover:opacity-100'
        }`}
        style={{
          background: isHovered
            ? `radial-gradient(${size}px circle at ${pos.x}px ${pos.y}px, ${spotlightColor}, transparent 80%)`
            : 'transparent',
        }}
        aria-hidden="true"
      />

      {/* Card Content */}
      <div className="relative z-10 w-full h-full">
        {children}
      </div>
    </Component>
  );
}

export default SpotlightCard;
