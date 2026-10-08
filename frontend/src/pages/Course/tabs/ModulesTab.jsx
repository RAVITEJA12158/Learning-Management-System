import React, { useState } from 'react';
import ModuleCurriculumManager from '../../../components/ModuleCurriculumManager';
import {
  ChevronDownIcon,
  VideoIcon,
  LinkIcon,
  DocumentIcon,
  CheckIcon,
} from '../../../components/common/Icons';

export function ModulesTab({
  course,
  courseId,
  isCreatorOrStaff,
  isEnrolled,
  completedItems,
  onToggleContentProgress,
  onSelectContent,
  onRefreshCourse,
}) {
  const [isManagingModules, setIsManagingModules] = useState(false);
  const [expandedModules, setExpandedModules] = useState(() => {
    if (course?.modules && course.modules.length > 0) {
      return { [course.modules[0].id]: true };
    }
    return {};
  });

  const toggleModuleAccordion = (moduleId) => {
    setExpandedModules((prev) => ({ ...prev, [moduleId]: !prev[moduleId] }));
  };

  const calculateModuleProgress = (module) => {
    if (!module.content || module.content.length === 0) return 0;
    const completedCount = module.content.filter((c) => completedItems[c.id]).length;
    return Math.round((completedCount / module.content.length) * 100);
  };

  return (
    <div className="p-6 space-y-5">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-extrabold text-slate-900 dark:text-zinc-50 tracking-tight">
          Course Curriculum
        </h2>
        {isCreatorOrStaff && (
          <button
            onClick={() => setIsManagingModules(!isManagingModules)}
            className="text-xs font-bold text-blue-600 dark:text-blue-400 hover:underline cursor-pointer"
          >
            {isManagingModules ? '← Back to Modules' : '+ Manage Modules'}
          </button>
        )}
      </div>

      {isCreatorOrStaff && isManagingModules ? (
        <ModuleCurriculumManager
          courseId={courseId}
          modules={course.modules || []}
          onRefresh={onRefreshCourse}
          canEdit={true}
        />
      ) : course.modules && course.modules.length > 0 ? (
        <div className="space-y-3">
          {course.modules.map((module, mIdx) => {
            const isExpanded = expandedModules[module.id];
            const modProgress = calculateModuleProgress(module);

            return (
              <div
                key={module.id}
                className="rounded-2xl bg-white dark:bg-white/[0.02] dark:backdrop-blur-xl border border-slate-200/80 dark:border-white/5 overflow-hidden shadow-xs transition-colors"
              >
                {/* Module Header */}
                <div
                  onClick={() => toggleModuleAccordion(module.id)}
                  className="p-5 flex items-center justify-between cursor-pointer hover:bg-slate-50/80 dark:hover:bg-white/[0.03] transition select-none"
                >
                  <div className="flex items-center gap-3">
                    <span className="text-slate-400 hover:text-slate-600 dark:text-gray-500 dark:hover:text-gray-300 transition">
                      <ChevronDownIcon
                        className={`w-4 h-4 transition-transform duration-200 ${
                          isExpanded ? 'rotate-180' : ''
                        }`}
                      />
                    </span>
                    <div>
                      <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                        Module {module.position || mIdx + 1}: {module.title}
                      </h3>
                      {module.description && (
                        <p className="text-xs text-slate-500 dark:text-gray-400 mt-1 leading-relaxed max-w-xl">
                          {module.description}
                        </p>
                      )}
                    </div>
                  </div>
                  <span className="text-[11px] font-bold text-slate-700 dark:text-cyan-300 bg-slate-100 dark:bg-cyan-950/40 px-2.5 py-1 rounded-full shrink-0 border border-slate-200 dark:border-cyan-800/40">
                    {modProgress}%
                  </span>
                </div>

                {/* Module Content Items */}
                {isExpanded && (
                  <div className="border-t border-slate-100 dark:border-white/5 p-4 space-y-2 bg-slate-50/50 dark:bg-gray-950/40">
                    {module.content && module.content.length > 0 ? (
                      module.content.map((c) => {
                        const isCompleted = completedItems[c.id] || false;
                        const contentType = (c.type || 'DOCUMENT').toUpperCase();

                        return (
                          <div
                            key={c.id}
                            onClick={() => onSelectContent(c)}
                            className="flex items-center justify-between p-3.5 rounded-xl bg-white dark:bg-white/[0.02] border border-slate-200/80 dark:border-white/5 hover:border-cyan-400 dark:hover:border-cyan-500/40 hover:shadow-xs transition cursor-pointer group"
                          >
                            <div className="flex items-center gap-3">
                              <div className="p-2 rounded-lg bg-cyan-50 dark:bg-cyan-950/50 text-cyan-600 dark:text-cyan-400 shrink-0">
                                {contentType.includes('VIDEO') ? (
                                  <VideoIcon className="w-4 h-4" />
                                ) : contentType.includes('LINK') || contentType.includes('URL') ? (
                                  <LinkIcon className="w-4 h-4" />
                                ) : (
                                  <DocumentIcon className="w-4 h-4" />
                                )}
                              </div>
                              <div>
                                <h4
                                  className={`text-xs font-bold text-slate-900 dark:text-white group-hover:text-cyan-600 dark:group-hover:text-cyan-400 transition ${
                                    isCompleted ? 'line-through text-slate-400 dark:text-gray-500' : ''
                                  }`}
                                >
                                  {c.title}
                                </h4>
                                {c.description && (
                                  <p className="text-[11px] text-slate-500 dark:text-gray-400 truncate max-w-md mt-0.5">
                                    {c.description}
                                  </p>
                                )}
                              </div>
                            </div>
                            {isEnrolled && (
                              <button
                                onClick={(e) => onToggleContentProgress(c.id, !isCompleted, e)}
                                className="p-1 cursor-pointer"
                                title={isCompleted ? 'Mark incomplete' : 'Mark complete'}
                              >
                                {isCompleted ? (
                                  <span className="h-5 w-5 rounded-full bg-emerald-500 text-white flex items-center justify-center">
                                    <CheckIcon className="w-3 h-3 text-white" />
                                  </span>
                                ) : (
                                  <span className="h-5 w-5 rounded-full border-2 border-slate-300 dark:border-gray-600 hover:border-cyan-400 transition block" />
                                )}
                              </button>
                            )}
                          </div>
                        );
                      })
                    ) : (
                      <p className="text-xs text-slate-400 dark:text-gray-500 italic p-2">
                        No content items added yet.
                      </p>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      ) : (
        <div className="rounded-2xl bg-white dark:bg-white/[0.02] dark:backdrop-blur-xl border border-slate-200/80 dark:border-white/5 p-8 text-center text-xs font-bold text-slate-500 dark:text-gray-400 shadow-xs">
          The curriculum for this course has not been published yet.
        </div>
      )}
    </div>
  );
}

export default ModulesTab;
