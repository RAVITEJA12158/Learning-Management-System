import { useAuth } from '../context/AuthContext'

function AuthStateTest() {
  const {
    session,
    user,
    isAuthenticated,
    loading,
    accessToken,
    signOut,
  } = useAuth()

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        Loading authentication state...
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-slate-950 p-8 text-white">
      <div className="mx-auto max-w-2xl rounded-2xl border border-slate-800 bg-slate-900 p-8">
        <h1 className="text-3xl font-bold">
          Authentication State
        </h1>

        <div className="mt-8 space-y-4">
          <Info
            label="Authenticated"
            value={isAuthenticated ? 'Yes' : 'No'}
          />

          <Info
            label="User"
            value={user?.email || 'Not authenticated'}
          />

          <Info
            label="Role"
            value={user?.role || 'None'}
          />

          <Info
            label="Session"
            value={session ? 'Active' : 'None'}
          />

          <Info
            label="Access token"
            value={accessToken ? 'Available' : 'Not available'}
          />
        </div>

        {isAuthenticated && (
          <button
            onClick={signOut}
            className="mt-8 rounded-xl bg-red-600 px-5 py-3 font-semibold hover:bg-red-700"
          >
            Sign Out
          </button>
        )}
      </div>
    </div>
  )
}

function Info({ label, value }) {
  return (
    <div className="rounded-xl border border-slate-800 bg-slate-950 p-4">
      <p className="text-sm text-slate-500">{label}</p>
      <p className="mt-1 font-medium">{value}</p>
    </div>
  )
}

export default AuthStateTest