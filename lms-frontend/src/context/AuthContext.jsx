import { createContext, useContext, useEffect, useState } from 'react'

const AuthContext = createContext(null)
const AUTH_STORAGE_KEY = 'lms_auth'

function getStoredSession() {
  try {
    const stored = localStorage.getItem(AUTH_STORAGE_KEY)
    return stored ? JSON.parse(stored) : null
  } catch {
    localStorage.removeItem(AUTH_STORAGE_KEY)
    return null
  }
}

export function AuthProvider({ children }) {
  const [session, setSession] = useState(getStoredSession)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    setLoading(false)

    function syncSession() {
      setSession(getStoredSession())
    }

    window.addEventListener('storage', syncSession)
    window.addEventListener('lms-auth-changed', syncSession)
    return () => {
      window.removeEventListener('storage', syncSession)
      window.removeEventListener('lms-auth-changed', syncSession)
    }
  }, [])

  function signIn(nextSession) {
    localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(nextSession))
    setSession(nextSession)
    window.dispatchEvent(new Event('lms-auth-changed'))
  }

  function signOut() {
    localStorage.removeItem(AUTH_STORAGE_KEY)
    setSession(null)
    window.dispatchEvent(new Event('lms-auth-changed'))
  }

  const value = {
    session,
    user: session?.user || null,
    isAuthenticated: Boolean(session?.token),
    loading,
    accessToken: session?.token || null,
    signIn,
    signOut,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used inside AuthProvider')
  }
  return context
}
