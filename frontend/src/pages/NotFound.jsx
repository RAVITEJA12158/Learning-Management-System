import React from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '../components/common/Button';

export default function NotFound() {
  const navigate = useNavigate();
  return (
    <main className="mx-auto max-w-[1440px] px-4 py-16 sm:py-20 sm:px-8 w-full flex flex-col items-center justify-center text-center font-sans">
      <div className="bg-white dark:bg-white/[0.02] backdrop-blur-xl rounded-3xl border border-slate-200/80 dark:border-white/10 p-6 sm:p-14 max-w-lg w-full shadow-xs">
        <span className="inline-block px-3 py-1 rounded-full bg-blue-50 dark:bg-cyan-950/60 text-blue-600 dark:text-cyan-400 text-xs font-black uppercase tracking-wider">
          404 · Page Not Found
        </span>
        <h1 className="mt-4 text-2xl sm:text-4xl font-black text-slate-900 dark:text-white tracking-tight">
          Lost in the stacks?
        </h1>
        <p className="mt-2 text-xs sm:text-sm text-slate-500 dark:text-gray-400 leading-relaxed">
          The page or course resource you are looking for doesn&apos;t exist or has been moved.
        </p>
        <div className="mt-6 flex flex-col sm:flex-row items-stretch sm:items-center justify-center gap-3">
          <Button onClick={() => navigate('/')}>Return Home</Button>
          <Button variant="outline" onClick={() => navigate('/courses')}>
            Browse Course Catalog
          </Button>
        </div>
      </div>
    </main>
  );
}
