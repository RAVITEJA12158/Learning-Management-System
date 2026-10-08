import React from 'react';
import Badge from './common/Badge';

function ContentViewerModal({ content, isOpen, onClose, onToggleComplete, isCompleted }) {
  if (!isOpen || !content) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-xs p-4 animate-fade-in">
      <div className="relative flex max-h-[90vh] w-full max-w-4xl flex-col rounded-2xl border border-slate-200 dark:border-white/10 bg-white dark:bg-[#030712] p-6 sm:p-8 shadow-2xl overflow-hidden transition-colors">
        
        {/* Header */}
        <div className="flex items-start justify-between border-b border-slate-100 dark:border-white/10 pb-4 mb-5">
          <div>
            <div className="flex items-center gap-3">
              <Badge variant="info">
                {content.type}
              </Badge>
              {content.isPublished === false && (
                <Badge variant="warning">
                  Draft
                </Badge>
              )}
            </div>
            <h2 className="mt-2 text-xl sm:text-2xl font-black tracking-tight text-slate-900 dark:text-white">
              {content.title}
            </h2>
            {content.description && (
              <p className="mt-1 text-xs text-slate-500 dark:text-gray-400 max-w-2xl">{content.description}</p>
            )}
          </div>

          <button
            onClick={onClose}
            className="flex h-8 w-8 items-center justify-center rounded-full border border-slate-200 dark:border-white/10 bg-slate-100 dark:bg-white/5 text-sm font-bold text-slate-600 dark:text-gray-300 hover:bg-slate-200 dark:hover:bg-white/10 transition cursor-pointer"
            aria-label="Close modal"
          >
            ✕
          </button>
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto pr-1">
          {content.type === 'PDF' && (
            <div className="h-[60vh] w-full rounded-xl overflow-hidden border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-black">
              {content.contentUrl ? (
                <iframe
                  src={content.contentUrl}
                  title={content.title}
                  className="h-full w-full"
                />
              ) : (
                <div className="flex h-full items-center justify-center text-sm font-bold text-slate-400 dark:text-gray-500">
                  No PDF URL specified.
                </div>
              )}
            </div>
          )}

          {content.type === 'VIDEO' && (
            <div className="h-[60vh] w-full flex items-center justify-center rounded-xl overflow-hidden bg-black border border-slate-200 dark:border-white/10">
              {content.contentUrl ? (
                <video
                  controls
                  className="max-h-full max-w-full rounded-xl"
                  src={content.contentUrl}
                >
                  Your browser does not support the video tag.
                </video>
              ) : (
                <div className="text-sm font-bold text-white/50">
                  No Video URL available.
                </div>
              )}
            </div>
          )}

          {content.type === 'LINK' && (
            <div className="rounded-xl border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-white/[0.02] p-8 text-center">
              <p className="text-sm font-bold text-slate-700 dark:text-gray-200 mb-4">
                This content is hosted externally.
              </p>
              <a
                href={content.contentUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-xl bg-[#0066FF] hover:bg-blue-600 px-6 py-2.5 text-xs font-bold text-white shadow-[0_0_15px_rgba(0,102,255,0.4)] transition"
              >
                Open Resource in New Tab ↗
              </a>
            </div>
          )}

          {content.type === 'TEXT' && (
            <div className="rounded-xl border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-white/[0.02] p-6 text-sm leading-7 text-slate-800 dark:text-gray-200 whitespace-pre-wrap font-mono">
              {content.contentUrl || content.description || 'No text content provided.'}
            </div>
          )}

          {content.type === 'FILE' && (
            <div className="rounded-xl border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-white/[0.02] p-8 text-center">
              <p className="text-sm font-bold text-slate-700 dark:text-gray-200 mb-4">
                Downloadable Course Material
              </p>
              {content.contentUrl ? (
                <a
                  href={content.contentUrl}
                  download
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 rounded-xl bg-[#0066FF] hover:bg-blue-600 px-6 py-2.5 text-xs font-bold text-white shadow-[0_0_15px_rgba(0,102,255,0.4)] transition"
                >
                  Download File 📥
                </a>
              ) : (
                <span className="text-xs text-slate-400 dark:text-gray-500">File URL not found.</span>
              )}
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="mt-6 flex flex-wrap items-center justify-between border-t border-slate-100 dark:border-white/10 pt-4">
          <div className="text-xs font-semibold text-slate-500 dark:text-gray-400">
            {isCompleted ? '✅ Completed' : '⏳ Incomplete'}
          </div>

          <div className="flex gap-3">
            {onToggleComplete && (
              <button
                onClick={() => onToggleComplete(content.id, !isCompleted)}
                className={`inline-flex items-center gap-2 rounded-xl px-4 py-2 text-xs font-bold transition cursor-pointer ${
                  isCompleted
                    ? 'border border-emerald-300 dark:border-emerald-800 bg-emerald-50 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-400'
                    : 'bg-[#0066FF] hover:bg-blue-600 text-white shadow-[0_0_15px_rgba(0,102,255,0.4)]'
                }`}
              >
                {isCompleted ? '✓ Mark Incomplete' : '✓ Mark as Completed'}
              </button>
            )}

            <button
              onClick={onClose}
              className="rounded-xl border border-slate-200 dark:border-white/10 bg-white dark:bg-white/5 px-4 py-2 text-xs font-bold text-slate-700 dark:text-gray-200 hover:bg-slate-50 dark:hover:bg-white/10 transition cursor-pointer"
            >
              Close
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}

export default ContentViewerModal;
