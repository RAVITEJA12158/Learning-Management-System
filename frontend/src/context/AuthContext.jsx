import { createContext, useContext, useEffect, useState } from 'react'

const AuthContext = createContext(null)

const TOKEN_KEY = 'lms_token'
const USER_KEY = 'lms_user'

/**
 * Reads the persisted user from localStorage.
 * Returns null when nothing is stored or the JSON is corrupted.
 */
function loadPersistedUser() {
  try {
    const raw = localStorage.getItem(USER_KEY)
    return raw ? JSON.parse(raw) : null
  } catch {
    localStorage.removeItem(USER_KEY)
    return null
  }
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => loadPersistedUser())
  const [loading, setLoading] = useState(true)

  // On mount, verify that we still have a valid token + user stored.
  useEffect(() => {
    const token = localStorage.getItem(TOKEN_KEY)
    const savedUser = loadPersistedUser()

    if (token && savedUser) {
      setUser(savedUser)
    } else {
      // If either piece is missing the session is invalid — clear both.
      localStorage.removeItem(TOKEN_KEY)
      localStorage.removeItem(USER_KEY)
      setUser(null)
    }

    setLoading(false)
  }, [])

  /**
   * Called after a successful /api/auth/login response.
   * Persists the JWT and user object so the session survives page reloads.
   */
  function login({ token, user: userData }) {
    localStorage.setItem(TOKEN_KEY, token)
    localStorage.setItem(USER_KEY, JSON.stringify(userData))
    // Also store under the legacy key so api.js picks it up.
    localStorage.setItem('token', token)
    setUser(userData)
  }

  /**
   * Clears the session and returns the user to the logged-out state.
   */
  function logout() {
    localStorage.removeItem(TOKEN_KEY)
    localStorage.removeItem(USER_KEY)
    localStorage.removeItem('token')
    setUser(null)
  }

  /**
   * Updates the current user state and synchronizes with localStorage.
   */
  function updateUser(updatedData) {
    setUser((prev) => {
      const nextUser = { ...prev, ...updatedData };
      localStorage.setItem(USER_KEY, JSON.stringify(nextUser));
      return nextUser;
    });
  }

  const value = {
    user,
    loading,
    isAuthenticated: Boolean(user),
    accessToken: localStorage.getItem(TOKEN_KEY),
    login,
    logout,
    updateUser,
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
