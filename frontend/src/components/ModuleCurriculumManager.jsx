import React, { useState } from 'react';
import { moduleService } from '../services/courseService';
import ContentUploadModal from './ContentUploadModal';
import ContentViewerModal from './ContentViewerModal';
import Badge from './common/Badge';
import Button from './common/Button';

export default function ModuleCurriculumManager({
  courseId,
  modules = [],
  onRefresh,
  canEdit = false,
}) {
  const [isAddingModule, setIsAddingModule] = useState(false);
  const [newModuleTitle, setNewModuleTitle] = useState('');
  const [newModuleDesc, setNewModuleDesc] = useState('');
  const [releaseAt, setReleaseAt] = useState('');
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
        releaseAt: releaseAt ? new Date(releaseAt).toISOString() : new Date().toISOString(),
      });
      setNewModuleTitle('');
      setNewModuleDesc('');
      setReleaseAt('');
      setIsAddingModule(false);
      onRefresh();
    } catch (err) {
      console.error(err);
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
    }
  };

  const handleDeleteModule = async (moduleId) => {
    try {
      await moduleService.deleteModule(moduleId);
      onRefresh();
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteContent = async (contentId) => {
    try {
      await moduleService.deleteContent(contentId);
      onRefresh();
    } catch (err) {
      console.error(err);
    }
  };

  const handleMoveModule = async (index, direction) => {
    const targetIndex = index + direction;
    if (targetIndex < 0 || targetIndex >= modules.length) return;
    const currentMod = modules[index];
    const targetMod = modules[targetIndex];
    try {
      await moduleService.updateModule(currentMod.id, {
        position: targetMod.position || targetIndex + 1,
      });
      await moduleService.updateModule(targetMod.id, {
        position: currentMod.position || index + 1,
      });
      onRefresh();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="space-y-6">
      {canEdit && (
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
          <div>
            <h3 className="text-lg font-extrabold tracking-tight text-slate-900 dark:text-white">
              Curriculum & Module Studio
            </h3>
            <p className="text-xs text-slate-500 dark:text-gray-400 mt-0.5">
              Organize modules, reorder learning sequences, toggle publish visibility, and upload Cloudinary resources.
            </p>
          </div>
          <Button
            onClick={() => setIsAddingModule(!isAddingModule)}
            variant={isAddingModule ? 'outline' : 'primary'}
            className="self-start sm:self-auto"
          >
            {isAddingModule ? 'Cancel' : '+ Add New Module'}
          </Button>
        </div>
      )}

      {isAddingModule && (
        <form
          onSubmit={handleCreateModule}
          className="rounded-2xl border border-slate-200 dark:border-white/10 bg-white dark:bg-white/[0.02] backdrop-blur-xl p-5 sm:p-6 shadow-md space-y-4 animate-fade-in"
        >
          <h4 className="text-xs font-bold uppercase tracking-wider text-blue-600 dark:text-cyan-400">
            Create New Curriculum Module
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="md:col-span-2">
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-gray-400 mb-1">
                Module Title *
              </label>
              <input
                type="text"
                required
                placeholder="e.g. Module 4: Neural Network Architectures & Backpropagation"
                value={newModuleTitle}
                onChange={(e) => setNewModuleTitle(e.target.value)}
                className="w-full min-h-[44px] rounded-xl border border-slate-200 dark:border-gray-800 bg-white dark:bg-transparent px-4 py-2.5 text-base sm:text-sm font-medium text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-gray-500 focus:border-purple-500 focus:ring-1 focus:ring-purple-500/50 outline-none transition"
              />
            </div>
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-gray-400 mb-1">
                Scheduled Release (Optional)
              </label>
              <input
                type="date"
                value={releaseAt}
                onChange={(e) => setReleaseAt(e.target.value)}
                className="w-full min-h-[44px] rounded-xl border border-slate-200 dark:border-gray-800 bg-white dark:bg-transparent px-4 py-2.5 text-base sm:text-sm font-medium text-slate-900 dark:text-white focus:border-purple-500 focus:ring-1 focus:ring-purple-500/50 outline-none transition"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-gray-400 mb-1">
              Module Description & Learning Objectives
            </label>
            <textarea
              rows={2}
              placeholder="Summarize key topics and deliverables covered in this module..."
              value={newModuleDesc}
              onChange={(e) => setNewModuleDesc(e.target.value)}
              className="w-full rounded-xl border border-slate-200 dark:border-gray-800 bg-white dark:bg-transparent p-3 text-xs font-medium text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-gray-500 focus:border-purple-500 focus:ring-1 focus:ring-purple-500/50 outline-none transition"
            />
          </div>

          <div className="flex flex-col-reverse sm:flex-row justify-end gap-2.5 pt-2">
            <Button type="button" variant="outline" onClick={() => setIsAddingModule(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={loadingAction}>
              {loadingAction ? 'Saving…' : 'Save Module'}
            </Button>
          </div>
        </form>
      )}

      {modules.length > 0 ? (
        <div className="grid gap-5">
          {modules.map((module, index) => (
            <div
              key={module.id}
              className="rounded-2xl border border-slate-200/80 dark:border-white/10 bg-white dark:bg-white/[0.02] backdrop-blur-xl p-4 sm:p-6 shadow-xs transition hover:border-slate-300 dark:hover:border-white/20"
            >
              <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-100 dark:border-white/5 pb-4">
                <div className="flex items-center gap-3.5 min-w-0">
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-blue-600 dark:bg-cyan-500/20 dark:border dark:border-cyan-500/40 text-xs font-black text-white dark:text-cyan-300">
                    {module.position || index + 1}
                  </span>
                  <div className="min-w-0">
                    <h4 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white break-words">
                      {module.title}
                    </h4>
                    {module.description && (
                      <p className="text-xs text-slate-500 dark:text-gray-400 mt-0.5">
                        {module.description}
                      </p>
                    )}
                  </div>
                </div>

                {canEdit && (
                  <div className="flex flex-wrap items-center gap-2">
                    <button
                      type="button"
                      disabled={index === 0}
                      onClick={() => handleMoveModule(index, -1)}
                      className="flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 dark:border-white/10 text-xs font-bold text-slate-700 dark:text-gray-300 disabled:opacity-30 hover:bg-slate-100 dark:hover:bg-white/10 transition cursor-pointer"
                      title="Move Up"
                    >
                      ↑
                    </button>
                    <button
                      type="button"
                      disabled={index === modules.length - 1}
                      onClick={() => handleMoveModule(index, 1)}
                      className="flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 dark:border-white/10 text-xs font-bold text-slate-700 dark:text-gray-300 disabled:opacity-30 hover:bg-slate-100 dark:hover:bg-white/10 transition cursor-pointer"
                      title="Move Down"
                    >
                      ↓
                    </button>
                    <button
                      type="button"
                      onClick={() => handleTogglePublishModule(module)}
                      className="cursor-pointer"
                    >
                      <Badge variant={module.isPublished !== false ? 'active' : 'warning'}>
                        {module.isPublished !== false ? 'Published' : 'Draft'}
                      </Badge>
                    </button>
                    <Button size="sm" onClick={() => setActiveUploadModuleId(module.id)}>
                      + Add Material
                    </Button>
                    <button
                      type="button"
                      onClick={() => handleDeleteModule(module.id)}
                      className="flex h-9 w-9 items-center justify-center rounded-lg text-xs font-bold text-red-500 hover:bg-red-50 dark:hover:bg-red-950/40 transition cursor-pointer"
                      title="Delete Module"
                    >
                      🗑
                    </button>
                  </div>
                )}
              </div>

              <div className="mt-4 pl-0 sm:pl-12 space-y-2.5">
                {module.content && module.content.length > 0 ? (
                  module.content.map((item) => (
                    <div
                      key={item.id}
                      className="flex flex-wrap items-center justify-between gap-2 rounded-xl border border-slate-200/70 dark:border-white/5 bg-slate-50/70 dark:bg-white/[0.02] p-3.5 transition hover:border-cyan-400/50"
                    >
                      <div
                        onClick={() => setViewingContent(item)}
                        className="flex items-center gap-3 cursor-pointer flex-1 min-w-0"
                      >
                        <Badge variant="info">{item.type || 'PDF'}</Badge>
                        <div className="min-w-0">
                          <p className="text-xs font-bold text-slate-900 dark:text-white hover:text-blue-600 dark:hover:text-cyan-400 truncate transition">
                            {item.title}
                          </p>
                          {item.description && (
                            <p className="text-[11px] text-slate-500 dark:text-gray-400 truncate max-w-lg">
                              {item.description}
                            </p>
                          )}
                        </div>
                      </div>

                      <div className="flex items-center gap-3 shrink-0">
                        <button
                          onClick={() => setViewingContent(item)}
                          className="text-xs font-bold text-blue-600 dark:text-cyan-400 hover:underline cursor-pointer py-1"
                        >
                          Preview
                        </button>
                        {canEdit && (
                          <button
                            onClick={() => handleDeleteContent(item.id)}
                            className="text-xs text-red-500 hover:text-red-600 px-2 py-1 rounded hover:bg-red-50 dark:hover:bg-red-950/40 cursor-pointer"
                            title="Delete Content"
                          >
                            ✕
                          </button>
                        )}
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-xs font-medium text-slate-400 dark:text-gray-500 italic py-2">
                    No learning materials added to this module yet.
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="rounded-2xl border border-slate-200/80 dark:border-white/10 bg-white dark:bg-white/[0.02] p-8 text-center text-xs font-bold text-slate-500 dark:text-gray-400">
          No modules created yet. Click “+ Add New Module” to structure your course curriculum.
        </div>
      )}

      <ContentUploadModal
        moduleId={activeUploadModuleId}
        isOpen={Boolean(activeUploadModuleId)}
        onClose={() => setActiveUploadModuleId(null)}
        onSuccess={onRefresh}
      />

      <ContentViewerModal
        content={viewingContent}
        isOpen={Boolean(viewingContent)}
        onClose={() => setViewingContent(null)}
      />
    </div>
  );
}
