import { useNavigate } from 'react-router-dom';
import Badge from '../../components/common/Badge';
import Button from '../../components/common/Button';
import { ArrowRightIcon } from '../../components/common/Icons';

function AdminDashboard() {
  const navigate = useNavigate();

  return (
    <main className="mx-auto max-w-[1440px] px-4 py-8 sm:px-8 lg:py-10 w-full font-sans transition-colors duration-200">
      <div className="mb-8">
        <Badge variant="warning" className="mb-2">
          System Administration
        </Badge>
        <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-zinc-50 tracking-tight transition-colors">
          Admin Control Center
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-zinc-400 mt-1">
          Manage system courses, student enrollments, faculty permissions, and academic records.
        </p>
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        {/* Card 1: Course Management */}
        <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-slate-200/80 dark:border-zinc-800 p-6 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-start justify-between">
              <Badge variant="active">Catalog</Badge>
            </div>
            <h3 className="mt-4 text-lg font-bold text-slate-900 dark:text-zinc-50">
              Course Management
            </h3>
            <p className="mt-2 text-xs text-slate-500 dark:text-zinc-400 leading-relaxed">
              Browse the entire course catalog, inspect syllabus modules, add or edit courses, and verify assignments.
            </p>
          </div>

          <div className="mt-6 border-t border-slate-100 dark:border-zinc-800 pt-4">
            <Button
              onClick={() => navigate('/courses')}
              className="w-full justify-center flex items-center gap-2"
            >
              Go to Course Catalog <ArrowRightIcon className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* Card 2: User Management */}
        <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-slate-200/80 dark:border-zinc-800 p-6 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-start justify-between">
              <Badge variant="neutral">Accounts</Badge>
            </div>
            <h3 className="mt-4 text-lg font-bold text-slate-900 dark:text-zinc-50">
              User Management
            </h3>
            <p className="mt-2 text-xs text-slate-500 dark:text-zinc-400 leading-relaxed">
              Manage students, faculty, and administrative staff accounts. Assign roles and oversee authentication.
            </p>
          </div>

          <div className="mt-6 border-t border-slate-100 dark:border-zinc-800 pt-4">
            <button
              disabled
              className="w-full text-center py-2.5 text-xs font-bold text-slate-400 dark:text-zinc-600 bg-slate-100 dark:bg-zinc-800 rounded-xl cursor-not-allowed"
            >
              Role Management (Active via API)
            </button>
          </div>
        </div>
      </div>
    </main>
  );
}

export default AdminDashboard;