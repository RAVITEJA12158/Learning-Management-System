import { useNavigate } from 'react-router-dom';

function AdminDashboard() {
  const navigate = useNavigate();

  return (
    <main className="relative z-10 mx-auto max-w-7xl px-5 pb-20 pt-10 sm:px-8 lg:pb-28 w-full">
      <div className="mb-12">
        <p className="text-xs font-black uppercase tracking-[.18em] text-[#E85B43]">
          System Administration
        </p>
        <h1 className="mt-4 text-4xl font-black leading-[.98] tracking-[-.055em] sm:text-5xl">
          Admin Control Center
        </h1>
      </div>

      <div className="grid gap-5 lg:grid-cols-2">
        <div className="hub-lift group flex flex-col justify-between rounded-[24px] border border-black/10 bg-white p-6 shadow-[0_15px_40px_rgba(21,21,21,.04)]">
          <div>
            <div className="flex items-start justify-between">
              <span className="inline-block rounded-full bg-[#A9E8D5] px-3 py-1.5 text-[10px] font-black uppercase tracking-wider text-[#102A24]">
                Catalog
              </span>
            </div>
            <h3 className="mt-5 text-xl font-black leading-tight tracking-[-.03em] text-[#151515]">
              Course Management
            </h3>
            <p className="mt-3 text-sm leading-6 text-[#151515]/55">
              Browse the entire course catalog, manage courses, or assign faculty.
            </p>
          </div>

          <div className="mt-8 border-t border-black/5 pt-5">
            <button
              onClick={() => navigate('/courses')}
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#151515] py-3 text-xs font-black text-white hover:bg-[#292929]"
            >
              Go to Course Catalog <span className="text-[#A9E8D5]">→</span>
            </button>
          </div>
        </div>

        <div className="hub-lift group flex flex-col justify-between rounded-[24px] border border-black/10 bg-white p-6 shadow-[0_15px_40px_rgba(21,21,21,.04)]">
          <div>
            <div className="flex items-start justify-between">
              <span className="inline-block rounded-full bg-[#F6F2E9] px-3 py-1.5 text-[10px] font-black uppercase tracking-wider text-[#151515]/50">
                Accounts
              </span>
            </div>
            <h3 className="mt-5 text-xl font-black leading-tight tracking-[-.03em] text-[#151515]">
              User Management
            </h3>
            <p className="mt-3 text-sm leading-6 text-[#151515]/55">
              Manage students, faculty, and administrators. Assign roles and handle accounts.
            </p>
          </div>

          <div className="mt-8 border-t border-black/5 pt-5">
            <button
              disabled
              className="flex w-full items-center justify-center gap-2 rounded-xl border border-black/10 bg-[#F6F2E9] py-3 text-xs font-black text-[#151515]/40 cursor-not-allowed"
            >
              Coming Soon
            </button>
          </div>
        </div>
      </div>
    </main>
  );
}

export default AdminDashboard;