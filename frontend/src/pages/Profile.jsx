import { useState, useRef, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { userService } from '../services/userService';

function Profile() {
  const { user, updateUser } = useAuth();
  const fileInputRef = useRef(null);

  const [uploading, setUploading] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [message, setMessage] = useState(null); // { type: 'success' | 'error', text: string }

  // Sync profile on mount to get latest data from server
  useEffect(() => {
    async function loadFreshProfile() {
      try {
        const freshUser = await userService.getProfile();
        if (freshUser && freshUser.id) {
          updateUser(freshUser);
        }
      } catch (err) {
        // Silent fallback to context user
      }
    }
    loadFreshProfile();
  }, []);

  const handleAvatarClick = () => {
    if (uploading || deleting) return;
    fileInputRef.current?.click();
  };

  const handleFileChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Reset input so same file can be re-selected if needed
    e.target.value = '';

    // Validate size (max 5MB for profile pictures)
    if (file.size > 5 * 1024 * 1024) {
      setMessage({ type: 'error', text: 'Image file size must be less than 5MB.' });
      return;
    }

    setUploading(true);
    setMessage(null);

    try {
      const response = await userService.updateProfilePhoto(file);
      const newImageUrl = response.profileImage || response.user?.profileImage;

      // Update Auth context and local storage
      updateUser({ profileImage: newImageUrl });

      setMessage({
        type: 'success',
        text: 'Profile photo uploaded to Cloudinary successfully!',
      });
    } catch (err) {
      console.error('Upload error:', err);
      setMessage({
        type: 'error',
        text: err.message || 'Failed to upload image. Please try again.',
      });
    } finally {
      setUploading(false);
    }
  };

  const handleDeletePhoto = async () => {
    if (!window.confirm('Are you sure you want to remove your profile photo? It will be permanently deleted from Cloudinary.')) {
      return;
    }

    setDeleting(true);
    setMessage(null);

    try {
      await userService.deleteProfilePhoto();

      // Update Auth context and local storage to null
      updateUser({ profileImage: null });

      setMessage({
        type: 'success',
        text: 'Profile photo removed from Cloudinary. Default avatar restored.',
      });
    } catch (err) {
      console.error('Delete error:', err);
      setMessage({
        type: 'error',
        text: err.message || 'Failed to remove profile photo.',
      });
    } finally {
      setDeleting(false);
    }
  };

  const userInitial = user?.name ? user.name.trim().charAt(0).toUpperCase() : 'U';
  const hasCustomPhoto = Boolean(user?.profileImage);

  return (
    <main className="mx-auto max-w-[1440px] px-5 py-10 sm:px-8 w-full font-sans transition-colors duration-200">
      <div className="mb-8">
        <h1 className="text-3xl font-black text-slate-900 dark:text-zinc-50 tracking-tight transition-colors">
          User Profile
        </h1>
        <p className="text-sm text-slate-500 dark:text-zinc-400 mt-1 transition-colors">
          Manage your account information, profile picture, and preferences
        </p>
      </div>

      {/* Status Alert Notification */}
      {message && (
        <div
          className={`mb-6 p-4 rounded-xl text-xs font-bold transition flex items-center justify-between gap-3 ${
            message.type === 'success'
              ? 'bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300'
              : 'bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-800 text-red-800 dark:text-red-300'
          }`}
        >
          <span>{message.text}</span>
          <button
            onClick={() => setMessage(null)}
            className="text-xs font-bold opacity-70 hover:opacity-100 cursor-pointer"
          >
            ✕
          </button>
        </div>
      )}

      <div className="bg-white dark:bg-white/[0.02] backdrop-blur-xl rounded-2xl border border-slate-200/80 dark:border-white/5 p-6 sm:p-8 shadow-xs dark:shadow-md dark:shadow-black/40 space-y-8 transition-colors">
        {/* AVATAR + BASIC INFO HEADER */}
        <div className="flex flex-col sm:flex-row sm:items-center gap-6 pb-8 border-b border-slate-100 dark:border-white/5">
          {/* Interactive Profile Picture Container with Spinning Gradient Ring */}
          <div className="relative group shrink-0">
            <div className="relative p-[2.5px] rounded-full dark:bg-gradient-to-r dark:from-cyan-400 dark:via-blue-500 dark:to-purple-600 dark:animate-spin-ring">
              <div
                onClick={handleAvatarClick}
                title="Click to change profile photo"
                className="relative h-24 w-24 sm:h-28 sm:w-28 rounded-full overflow-hidden border-2 border-slate-200 dark:border-transparent bg-slate-100 dark:bg-gray-950 cursor-pointer shadow-sm group-hover:border-cyan-400 transition duration-200"
              >
                {hasCustomPhoto ? (
                  <img
                    src={user.profileImage}
                    alt={user?.name || 'User Avatar'}
                    className="h-full w-full object-cover transition duration-200 group-hover:scale-105"
                  />
                ) : (
                  <div className="h-full w-full flex items-center justify-center bg-gradient-to-br from-cyan-500 to-purple-600 text-white text-3xl sm:text-4xl font-black select-none">
                    {userInitial}
                  </div>
                )}

                {/* Hover Overlay */}
                <div className="absolute inset-0 bg-black/60 backdrop-blur-[2px] opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex flex-col items-center justify-center text-white p-2 text-center select-none">
                  <svg
                    className="w-5 h-5 mb-1"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M23 19a2 2 0 01-2 2H3a2 2 0 01-2-2V8a2 2 0 012-2h4l2-3h6l2 3h4a2 2 0 012 2z" />
                    <circle cx="12" cy="13" r="4" />
                  </svg>
                  <span className="text-[10px] font-bold uppercase tracking-wider">
                    Change Photo
                  </span>
                </div>

                {/* Loading / Uploading Spinner Overlay */}
                {(uploading || deleting) && (
                  <div className="absolute inset-0 bg-black/75 flex flex-col items-center justify-center text-white z-10">
                    <svg
                      className="w-6 h-6 animate-spin text-cyan-400 mb-1"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      />
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      />
                    </svg>
                    <span className="text-[9px] font-bold">
                      {uploading ? 'Uploading…' : 'Deleting…'}
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* Hidden native file input */}
            <input
              ref={fileInputRef}
              type="file"
              accept="image/png,image/jpeg,image/jpg,image/webp,image/gif"
              className="hidden"
              onChange={handleFileChange}
            />
          </div>

          {/* User Details & Direct Action Controls */}
          <div className="flex-1 min-w-0">
            <div className="flex flex-wrap items-center gap-3">
              <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white tracking-tight truncate">
                {user?.name || 'User'}
              </h2>
              <span className="inline-block rounded-md bg-blue-50 dark:bg-purple-950/60 px-2.5 py-0.5 text-xs font-bold text-blue-600 dark:text-cyan-400 uppercase tracking-wider border border-blue-200/60 dark:border-purple-800/40">
                {user?.role || 'Student'}
              </span>
            </div>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-gray-400 mt-1">
              {user?.email || 'email@example.com'}
            </p>

            {/* Photo Action Buttons */}
            <div className="mt-4 flex flex-wrap items-center gap-3">
              <button
                type="button"
                onClick={handleAvatarClick}
                disabled={uploading || deleting}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold bg-blue-600 dark:bg-[#0066FF] text-white hover:bg-blue-700 dark:hover:bg-[#0052cc] transition cursor-pointer disabled:opacity-50 shadow-xs dark:shadow-[0_0_15px_rgba(0,102,255,0.4)]"
              >
                <svg
                  className="w-3.5 h-3.5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4" />
                  <polyline points="17 8 12 3 7 8" />
                  <line x1="12" y1="3" x2="12" y2="15" />
                </svg>
                {uploading ? 'Uploading…' : 'Upload from Local'}
              </button>

              {hasCustomPhoto && (
                <button
                  type="button"
                  onClick={handleDeletePhoto}
                  disabled={uploading || deleting}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold text-red-600 dark:text-rose-400 border border-red-200 dark:border-rose-800/60 hover:bg-red-50 dark:hover:bg-rose-950/40 transition cursor-pointer disabled:opacity-50"
                >
                  <svg
                    className="w-3.5 h-3.5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <polyline points="3 6 5 6 21 6" />
                    <path d="M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2" />
                  </svg>
                  {deleting ? 'Deleting…' : 'Remove Photo'}
                </button>
              )}
            </div>
            <p className="text-[11px] text-slate-400 dark:text-gray-500 mt-2">
              Hover over or click your avatar to upload a photo from your computer. Removing reverts to your name initial.
            </p>
          </div>
        </div>

        {/* ACCOUNT DETAILS GRID (HOLLOW GLASS INPUTS) */}
        <div>
          <h3 className="text-sm font-bold uppercase tracking-wider text-slate-700 dark:text-gray-300 mb-4">
            Account Information
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-gray-400 mb-2">
                Full Name
              </label>
              <input
                type="text"
                readOnly
                value={user?.name || ''}
                className="w-full rounded-lg border border-slate-200 dark:border-gray-800 bg-slate-50 dark:bg-transparent px-4 py-2.5 text-sm font-medium text-slate-800 dark:text-white focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500/50 transition"
              />
            </div>
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-gray-400 mb-2">
                Email Address
              </label>
              <input
                type="email"
                readOnly
                value={user?.email || ''}
                className="w-full rounded-lg border border-slate-200 dark:border-gray-800 bg-slate-50 dark:bg-transparent px-4 py-2.5 text-sm font-medium text-slate-800 dark:text-white focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500/50 transition"
              />
            </div>
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-gray-400 mb-2">
                Username
              </label>
              <input
                type="text"
                readOnly
                value={user?.username || ''}
                className="w-full rounded-lg border border-slate-200 dark:border-gray-800 bg-slate-50 dark:bg-transparent px-4 py-2.5 text-sm font-medium text-slate-800 dark:text-white focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500/50 transition"
              />
            </div>
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-gray-400 mb-2">
                Account Role
              </label>
              <input
                type="text"
                readOnly
                value={user?.role || 'STUDENT'}
                className="w-full rounded-lg border border-slate-200 dark:border-gray-800 bg-slate-50 dark:bg-transparent px-4 py-2.5 text-sm font-medium text-slate-800 dark:text-white focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500/50 transition"
              />
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}

export default Profile;
