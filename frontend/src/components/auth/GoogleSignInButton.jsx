import { GoogleLogin } from '@react-oauth/google';

const googleClientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;

function GoogleSignInButton({ onSuccess, onError }) {
  return (
    <div className="mt-5 w-full">
      <div className="mb-4 flex items-center gap-3 text-[10px] font-semibold uppercase tracking-[0.18em] text-slate-400 dark:text-gray-500">
        <span className="h-px flex-1 bg-slate-200 dark:bg-white/10" />
        Or continue with
        <span className="h-px flex-1 bg-slate-200 dark:bg-white/10" />
      </div>
      {googleClientId ? (
        <div className="mx-auto flex min-h-12 w-full max-w-[320px] items-center justify-center overflow-hidden rounded-full bg-white shadow-sm ring-1 ring-slate-200 transition hover:shadow-md dark:ring-white/15">
          <GoogleLogin
            onSuccess={onSuccess}
            onError={onError}
            theme="outline"
            size="large"
            shape="pill"
            text="continue_with"
            logo_alignment="left"
            width="300"
          />
        </div>
      ) : (
        <p className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-center text-[11px] text-slate-500 dark:border-white/10 dark:bg-white/[0.03] dark:text-gray-400">
          Google sign-in is unavailable until VITE_GOOGLE_CLIENT_ID is configured.
        </p>
      )}
    </div>
  );
}

export default GoogleSignInButton;
