import { useAuth } from '../context/AuthContext';

function Profile() {
  const { user } = useAuth();

  return (
    <main className="mx-auto max-w-5xl px-5 py-10 sm:px-8 w-full font-sans transition-colors duration-200">
      <div className="mb-8">
        <h1 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight transition-colors">User Profile</h1>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1 transition-colors">Manage your account information and preferences</p>
      </div>

      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 p-6 sm:p-8 shadow-xs space-y-6 transition-colors">
        <div className="flex items-center gap-6 pb-6 border-b border-slate-100 dark:border-slate-800">
          <img
            src={user?.avatar || "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80"}
            alt={user?.name || "User Avatar"}
            className="h-20 w-20 rounded-full object-cover border-2 border-slate-200 dark:border-slate-700"
          />
          <div>
            <h2 className="text-xl font-bold text-slate-900 dark:text-white">{user?.name || 'Sarah Jensen'}</h2>
            <p className="text-sm text-slate-500 dark:text-slate-400">{user?.email || 'sarah.jensen@email.com'}</p>
            <span className="mt-2 inline-block rounded-md bg-blue-50 dark:bg-blue-900/40 px-3 py-1 text-xs font-bold text-blue-600 dark:text-blue-400 uppercase tracking-wider">
              {user?.role || 'Student'}
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-2">Full Name</label>
            <input
              type="text"
              readOnly
              value={user?.name || 'Sarah Jensen'}
              className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 px-4 py-2.5 text-sm font-medium text-slate-800 dark:text-slate-100"
            />
          </div>
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-2">Email Address</label>
            <input
              type="email"
              readOnly
              value={user?.email || 'sarah.jensen@email.com'}
              className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 px-4 py-2.5 text-sm font-medium text-slate-800 dark:text-slate-100"
            />
          </div>
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-2">User ID</label>
            <input
              type="text"
              readOnly
              value={user?.id || 'usr_8943247923'}
              className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 px-4 py-2.5 text-sm font-medium text-slate-800 dark:text-slate-100"
            />
          </div>
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-2">Account Role</label>
            <input
              type="text"
              readOnly
              value={user?.role || 'Student'}
              className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 px-4 py-2.5 text-sm font-medium text-slate-800 dark:text-slate-100"
            />
          </div>
        </div>
      </div>
    </main>
  );
}

export default Profile;
