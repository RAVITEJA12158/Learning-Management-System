import React, { useState } from 'react';
import { moduleService } from '../services/courseService';
import ContentUploadModal from './ContentUploadModal';
import ContentViewerModal from './ContentViewerModal';

function ModuleCurriculumManager({ courseId, modules = [], onRefresh, canEdit = false }) {
  const [isAddingModule, setIsAddingModule] = useState(false);
  const [newModuleTitle, setNewModuleTitle] = useState('');
  const [newModuleDesc, setNewModuleDesc] = useState('');
  const [activeUploadModuleId, setActiveUploadModuleId] = useState(null);
  const [viewingContent, setViewingContent] = useState(null);
  const [loadingAction, setLoadingAction] = useState(false);

  const handleCreateModule = async (e) => {
    e.preventDefault();
    if (!newModuleTitle.trim()) return;

    setLoadingAction(true);
    try {
      await moduleService.createModule({
        courseId,
        title: newModuleTitle,
        description: newModuleDesc,
        position: (modules.length || 0) + 1,
        isPublished: true,
      });
      setNewModuleTitle('');
      setNewModuleDesc('');
      setIsAddingModule(false);
      onRefresh();
    } catch (err) {
      console.error(err);
      alert(err.message || 'Failed to create module');
    } finally {
      setLoadingAction(false);
    }
  };

  const handleTogglePublishModule = async (module) => {
    try {
      await moduleService.updateModule(module.id, {
        isPublished: !module.isPublished,
      });
      onRefresh();
    } catch (err) {
      console.error(err);
      alert('Failed to update publish state');
    }
  };

  const handleDeleteModule = async (moduleId) => {
    if (!window.confirm('Are you sure you want to delete this module and all its content?')) return;
    try {
      await moduleService.deleteModule(moduleId);
      onRefresh();
    } catch (err) {
      console.error(err);
      alert('Failed to delete module');
    }
  };

  const handleDeleteContent = async (contentId) => {
    if (!window.confirm('Are you sure you want to delete this content item?')) return;
    try {
      await moduleService.deleteContent(contentId);
      onRefresh();
    } catch (err) {
      console.error(err);
      alert('Failed to delete content');
    }
  };

  const handleMoveModule = async (index, direction) => {
    const targetIndex = index + direction;
    if (targetIndex < 0 || targetIndex >= modules.length) return;

    const currentMod = modules[index];
    const targetMod = modules[targetIndex];

    try {
      await moduleService.updateModule(currentMod.id, { position: targetMod.position || targetIndex + 1 });
      await moduleService.updateModule(targetMod.id, { position: currentMod.position || index + 1 });
      onRefresh();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Actions for Instructors */}
      {canEdit && (
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-xl font-black tracking-[-.03em] text-[#151515]">
            Curriculum Management
          </h3>
          <button
            onClick={() => setIsAddingModule(!isAddingModule)}
            className="hub-lift inline-flex items-center gap-2 rounded-full bg-[#151515] px-5 py-2.5 text-xs font-black text-white hover:bg-[#292929]"
          >
            {isAddingModule ? 'Cancel' : '+ Add New Module'}
          </button>
        </div>
      )}

      {/* New Module Form */}
      {isAddingModule && (
        <form
          onSubmit={handleCreateModule}
          className="rounded-[24px] border border-black/15 bg-white p-6 shadow-md space-y-4 animate-fade-in"
        >
          <h4 className="text-sm font-black uppercase tracking-wider text-[#151515]">
            Create New Module
          </h4>
          <input
            type="text"
            required
            placeholder="Module Title (e.g. Module 1: Introduction to Web Architecture)"
            value={newModuleTitle}
            onChange={(e) => setNewModuleTitle(e.target.value)}
            className="w-full rounded-xl border border-black/15 bg-white px-4 py-2.5 text-sm font-medium focus:border-black focus:outline-none"
          />
          <textarea
            rows={2}
            placeholder="Module description and objectives..."
            value={newModuleDesc}
            onChange={(e) => setNewModuleDesc(e.target.value)}
            className="w-full rounded-xl border border-black/15 bg-white p-3 text-xs font-medium focus:border-black focus:outline-none"
          />
          <div className="flex justify-end gap-3">
            <button
              type="button"
              onClick={() => setIsAddingModule(false)}
              className="rounded-full border border-black/10 px-4 py-2 text-xs font-black text-[#151515]"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loadingAction}
              className="hub-lift rounded-full bg-[#151515] px-6 py-2 text-xs font-black text-white disabled:opacity-50"
            >
              {loadingAction ? 'Saving...' : 'Save Module'}
            </button>
          </div>
        </form>
      )}

      {/* Modules List */}
      {modules.length > 0 ? (
        <div className="grid gap-5">
          {modules.map((module, index) => (
            <div
              key={module.id}
              className="rounded-[24px] border border-black/10 bg-white p-6 shadow-sm transition hover:shadow-md"
            >
              {/* Module Header */}
              <div className="flex flex-wrap items-center justify-between gap-4 border-b border-black/5 pb-4">
                <div className="flex items-center gap-3">
                  <span className="flex h-8 w-8 items-center justify-center rounded-full bg-[#151515] text-xs font-black text-white">
                    {module.position || index + 1}
                  </span>
                  <div>
                    <h4 className="text-lg font-black tracking-[-.02em] text-[#151515]">
                      {module.title}
                    </h4>
                    {module.description && (
                      <p className="text-xs text-[#151515]/60 mt-0.5">{module.description}</p>
                    )}
                  </div>
                </div>

                {canEdit && (
                  <div className="flex items-center gap-2">
                    {/* Position Reorder Buttons */}
                    <button
                      type="button"
                      disabled={index === 0}
                      onClick={() => handleMoveModule(index, -1)}
                      className="flex h-7 w-7 items-center justify-center rounded-full border border-black/10 text-xs font-black disabled:opacity-30 hover:bg-black/5"
                      title="Move Up"
                    >
                      ↑
                    </button>
                    <button
                      type="button"
                      disabled={index === modules.length - 1}
                      onClick={() => handleMoveModule(index, 1)}
                      className="flex h-7 w-7 items-center justify-center rounded-full border border-black/10 text-xs font-black disabled:opacity-30 hover:bg-black/5"
                      title="Move Down"
                    >
                      ↓
                    </button>

                    {/* Publish Toggle */}
                    <button
                      type="button"
                      onClick={() => handleTogglePublishModule(module)}
                      className={`rounded-full px-3 py-1 text-[10px] font-black uppercase tracking-wider ${
                        module.isPublished
                          ? 'border border-[#B7E4D5] bg-[#EDF9F5] text-[#18765D]'
                          : 'border border-[#F2C7BC] bg-[#FFF1ED] text-[#B83D29]'
                      }`}
                    >
                      {module.isPublished ? 'Published' : 'Draft'}
                    </button>

                    {/* Add Content Button */}
                    <button
                      type="button"
                      onClick={() => setActiveUploadModuleId(module.id)}
                      className="hub-lift rounded-full bg-[#151515] px-3.5 py-1.5 text-[11px] font-black text-white"
                    >
                      + Add Material
                    </button>

                    {/* Delete Module */}
                    <button
                      type="button"
                      onClick={() => handleDeleteModule(module.id)}
                      className="flex h-7 w-7 items-center justify-center rounded-full text-xs font-bold text-[#B83D29] hover:bg-[#FFF1ED]"
                      title="Delete Module"
                    >
                      🗑
                    </button>
                  </div>
                )}
              </div>

              {/* Content items inside Module */}
              <div className="mt-4 pl-2 sm:pl-10 space-y-2">
                {module.content && module.content.length > 0 ? (
                  module.content.map((item) => (
                    <div
                      key={item.id}
                      className="flex items-center justify-between rounded-xl border border-black/5 bg-[#FAF8F5] p-3 transition hover:bg-[#F3EFEA]"
                    >
                      <div
                        onClick={() => setViewingContent(item)}
                        className="flex items-center gap-3 cursor-pointer flex-1"
                      >
                        <span className="rounded-lg bg-white border border-black/10 px-2 py-1 text-[9px] font-black uppercase text-[#151515]/70">
                          {item.type}
                        </span>
                        <div>
                          <p className="text-xs font-bold text-[#151515] hover:underline">
                            {item.title}
                          </p>
                          {item.description && (
                            <p className="text-[10px] text-[#151515]/50 truncate max-w-md">
                              {item.description}
                            </p>
                          )}
                        </div>
                      </div>

                      <div className="flex items-center gap-3">
                        <button
                          onClick={() => setViewingContent(item)}
                          className="text-[11px] font-black text-[#151515]/70 hover:text-black underline"
                        >
                          View
                        </button>
                        {canEdit && (
                          <button
                            onClick={() => handleDeleteContent(item.id)}
                            className="text-xs text-[#B83D29] hover:opacity-75"
                            title="Delete Content"
                          >
                            ✕
                          </button>
                        )}
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-xs font-bold text-[#151515]/40 italic py-2">
                    No learning materials added to this module yet.
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="rounded-[24px] border border-black/10 bg-white p-8 text-center text-sm font-bold text-[#151515]/50">
          No modules created yet. Click "+ Add New Module" to structure your course curriculum.
        </div>
      )}

      {/* Upload Modal */}
      <ContentUploadModal
        moduleId={activeUploadModuleId}
        isOpen={Boolean(activeUploadModuleId)}
        onClose={() => setActiveUploadModuleId(null)}
        onSuccess={onRefresh}
      />

      {/* Viewer Modal */}
      <ContentViewerModal
        content={viewingContent}
        isOpen={Boolean(viewingContent)}
        onClose={() => setViewingContent(null)}
      />
    </div>
  );
}

export default ModuleCurriculumManager;
