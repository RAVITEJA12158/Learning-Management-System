import { createContext, useContext, useState } from 'react'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(getStoredUser)

  function login(userData) {
    localStorage.setItem('lms_user', JSON.stringify(userData))
    setUser(userData)
  }

  function logout() {
    localStorage.removeItem('lms_user')
    setUser(null)
  }

  const value = {
    user,
    isAuthenticated: Boolean(user),
    login,
    logout,
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

function getStoredUser() {
  try {
    const savedUser = localStorage.getItem('lms_user')
    return savedUser ? JSON.parse(savedUser) : null
  } catch {
    // A stale or malformed browser value must not prevent the public app loading.
    localStorage.removeItem('lms_user')
    return null
  }
}
