import { useState, useEffect, useRef } from 'react'

/**
 * LazySection
 * Defers rendering of below-the-fold content until it nears the viewport,
 * significantly boosting initial render performance and reducing DOM size.
 * Automatically supports anchor link smooth scrolling via the 'load-lazy-section' event.
 */
export default function LazySection({
  as: Component = 'section',
  id,
  className = '',
  minHeight = '350px',
  rootMargin = '250px 0px',
  children,
}) {
  const [isVisible, setIsVisible] = useState(false)
  const ref = useRef(null)

  useEffect(() => {
    // If targeted by an anchor link click or URL hash navigation, force-load immediately
    const handleForceLoad = (e) => {
      if (!id || e.detail === id) {
        setIsVisible(true)
      }
    }
    window.addEventListener('load-lazy-section', handleForceLoad)

    if (isVisible) {
      return () => window.removeEventListener('load-lazy-section', handleForceLoad)
    }

    const el = ref.current
    if (!el) {
      return () => window.removeEventListener('load-lazy-section', handleForceLoad)
    }

    if (typeof IntersectionObserver === 'undefined') {
      setIsVisible(true)
      return () => window.removeEventListener('load-lazy-section', handleForceLoad)
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true)
          observer.disconnect()
        }
      },
      {
        rootMargin,
        threshold: 0.01,
      }
    )

    observer.observe(el)

    return () => {
      observer.disconnect()
      window.removeEventListener('load-lazy-section', handleForceLoad)
    }
  }, [id, isVisible, rootMargin])

  return (
    <Component
      ref={ref}
      id={id}
      className={className}
      style={{ minHeight: !isVisible ? minHeight : undefined }}
    >
      {isVisible ? (
        children
      ) : (
        <div className="mx-auto max-w-7xl px-4 sm:px-8 py-20 flex items-center justify-center opacity-60">
          <div className="flex flex-col items-center gap-2">
            <div className="h-5 w-5 border-2 border-slate-300 dark:border-zinc-700 border-t-blue-600 dark:border-t-blue-400 rounded-full animate-spin" />
            <span className="text-[11px] font-medium text-slate-400 dark:text-zinc-500">
              Loading content…
            </span>
          </div>
        </div>
      )}
    </Component>
  )
}
