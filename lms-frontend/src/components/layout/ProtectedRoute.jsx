import { Navigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'

function ProtectedRoute({ children, allowedRoles }) {
  const { loading, isAuthenticated, user } = useAuth()

  if (loading) {
    return (
      <div className="grid min-h-screen place-items-center bg-[#f7f2ff] text-violet-950">
        <div className="rounded-3xl border border-violet-200 bg-white/70 px-6 py-5 shadow-xl shadow-violet-200/40">
          Preparing your learning space…
        </div>
      </div>
    )
  }

  if (!isAuthenticated) return <Navigate to="/login" replace />
  if (allowedRoles && !allowedRoles.includes(user?.role)) {
    return <Navigate to="/" replace />
  }

  return children
}

export default ProtectedRoute
