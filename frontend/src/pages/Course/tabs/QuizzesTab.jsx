import React from 'react';

export function QuizzesTab({ courseId, isCreatorOrStaff, isEnrolled }) {
  const sampleQuizzes = [
    {
      id: 'quiz-1',
      title: 'Web Dev Fundamentals Quiz',
      duration: '30 mins',
      questions: 15,
      status: 'Active',
      deadline: 'Nov 24',
    },
    {
      id: 'quiz-2',
      title: 'Algorithms & Complexity Quiz 4',
      duration: '45 mins',
      questions: 20,
      status: 'Active',
      deadline: 'Nov 28',
    },
    {
      id: 'quiz-3',
      title: 'Data Structures & Trees Assessment',
      duration: '40 mins',
      questions: 18,
      status: 'Upcoming',
      deadline: 'Dec 05',
    },
  ];

  return (
    <div className="p-6">
      <div className="rounded-2xl bg-white dark:bg-zinc-900 border border-slate-200/80 dark:border-zinc-800 p-6 shadow-xs transition-colors">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-base font-bold text-slate-900 dark:text-zinc-50">Active Quizzes</h2>
            <p className="text-xs text-slate-500 dark:text-zinc-400 mt-0.5">
              Timed self-assessments and graded quizzes for this course.
            </p>
          </div>
          {isCreatorOrStaff && (
            <button className="text-xs font-bold text-blue-600 dark:text-blue-400 hover:underline cursor-pointer">
              + New Quiz
            </button>
          )}
        </div>

        <div className="space-y-3">
          {sampleQuizzes.map((quiz) => (
            <div
              key={quiz.id}
              className="flex items-center justify-between p-4 rounded-xl bg-slate-50 dark:bg-zinc-800/60 border border-slate-200/60 dark:border-zinc-800/80 transition-colors"
            >
              <div>
                <h3 className="text-xs font-bold text-slate-900 dark:text-zinc-100">{quiz.title}</h3>
                <p className="text-[11px] text-slate-500 dark:text-zinc-400 mt-0.5">
                  Duration: {quiz.duration} · {quiz.questions} Questions · Due {quiz.deadline}
                </p>
              </div>
              <div className="flex items-center gap-3">
                <span
                  className={`text-[10px] font-bold px-2.5 py-1 rounded-md border ${
                    quiz.status === 'Active'
                      ? 'bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-400 border-blue-200 dark:border-blue-800/50'
                      : 'bg-slate-100 dark:bg-zinc-800 text-slate-600 dark:text-zinc-400 border-slate-200 dark:border-zinc-700'
                  }`}
                >
                  {quiz.status}
                </span>
                {isEnrolled && (
                  <button className="text-xs font-bold text-blue-600 dark:text-blue-400 hover:underline cursor-pointer">
                    Start
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default QuizzesTab;
