import React from 'react';

function ContentViewerModal({ content, isOpen, onClose, onToggleComplete, isCompleted }) {
  if (!isOpen || !content) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-fade-in">
      <div className="relative flex max-h-[90vh] w-full max-w-4xl flex-col rounded-[28px] border border-black/10 bg-white p-6 sm:p-8 shadow-2xl overflow-hidden">
        
        {/* Header */}
        <div className="flex items-start justify-between border-b border-black/5 pb-4 mb-5">
          <div>
            <div className="flex items-center gap-3">
              <span className="inline-block rounded-full bg-[#DFFF63] px-3 py-1 text-[10px] font-black uppercase tracking-wider text-[#151515]">
                {content.type}
              </span>
              {content.isPublished === false && (
                <span className="inline-block rounded-full bg-[#FFF1ED] px-3 py-1 text-[10px] font-black uppercase tracking-wider text-[#B83D29]">
                  Draft
                </span>
              )}
            </div>
            <h2 className="mt-2 text-2xl font-black tracking-[-.03em] text-[#151515]">
              {content.title}
            </h2>
            {content.description && (
              <p className="mt-1 text-xs text-[#151515]/60 max-w-2xl">{content.description}</p>
            )}
          </div>

          <button
            onClick={onClose}
            className="flex h-9 w-9 items-center justify-center rounded-full border border-black/10 text-sm font-black text-[#151515] hover:bg-black/5"
          >
            ✕
          </button>
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto pr-1">
          {content.type === 'PDF' && (
            <div className="h-[60vh] w-full rounded-2xl overflow-hidden border border-black/10 bg-[#F6F2E9]">
              {content.contentUrl ? (
                <iframe
                  src={content.contentUrl}
                  title={content.title}
                  className="h-full w-full"
                />
              ) : (
                <div className="flex h-full items-center justify-center text-sm font-bold text-[#151515]/50">
                  No PDF URL specified.
                </div>
              )}
            </div>
          )}

          {content.type === 'VIDEO' && (
            <div className="h-[60vh] w-full flex items-center justify-center rounded-2xl overflow-hidden bg-black">
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
            <div className="rounded-2xl border border-black/10 bg-[#F6F2E9] p-8 text-center">
              <p className="text-sm font-bold text-[#151515]/70 mb-4">
                This content is hosted externally.
              </p>
              <a
                href={content.contentUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="hub-lift inline-flex items-center gap-2 rounded-full bg-[#151515] px-6 py-3 text-xs font-black text-white hover:bg-[#292929]"
              >
                Open Resource in New Tab ↗
              </a>
            </div>
          )}

          {content.type === 'TEXT' && (
            <div className="rounded-2xl border border-black/10 bg-[#FAF8F5] p-6 text-sm leading-7 text-[#151515]/80 whitespace-pre-wrap font-mono">
              {content.contentUrl || content.description || 'No text content provided.'}
            </div>
          )}

          {content.type === 'FILE' && (
            <div className="rounded-2xl border border-black/10 bg-[#F6F2E9] p-8 text-center">
              <p className="text-sm font-bold text-[#151515]/70 mb-4">
                Downloadable Course Material
              </p>
              {content.contentUrl ? (
                <a
                  href={content.contentUrl}
                  download
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hub-lift inline-flex items-center gap-2 rounded-full bg-[#151515] px-6 py-3 text-xs font-black text-white hover:bg-[#292929]"
                >
                  Download File 📥
                </a>
              ) : (
                <span className="text-xs text-[#151515]/50">File URL not found.</span>
              )}
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="mt-6 flex flex-wrap items-center justify-between border-t border-black/5 pt-4">
          <div className="text-xs text-[#151515]/50">
            {isCompleted ? '✅ Completed' : '⏳ Incomplete'}
          </div>

          <div className="flex gap-3">
            {onToggleComplete && (
              <button
                onClick={() => onToggleComplete(content.id, !isCompleted)}
                className={`hub-lift inline-flex items-center gap-2 rounded-full px-5 py-2.5 text-xs font-black transition ${
                  isCompleted
                    ? 'border border-[#B7E4D5] bg-[#EDF9F5] text-[#18765D]'
                    : 'bg-[#151515] text-white hover:bg-[#292929]'
                }`}
              >
                {isCompleted ? '✓ Mark as Incomplete' : '✓ Mark as Completed'}
              </button>
            )}

            <button
              onClick={onClose}
              className="rounded-full border border-black/10 bg-white px-5 py-2.5 text-xs font-black text-[#151515] hover:border-black/25"
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
