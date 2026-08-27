import { createContext, useContext, useEffect, useState } from 'react'
import { supabase } from '../services/supabase'

const AuthContext = createContext(null)

function getUserFromSession(session) {
  if (!session?.user) {
    return null
  }

  return {
    id: session.user.id,
    email: session.user.email,
    name:
      session.user.user_metadata?.name ||
      session.user.email?.split('@')[0] ||
      'User',
    role: session.user.user_metadata?.role || 'student',
  }
}

export function AuthProvider({ children }) {
  const [session, setSession] = useState(null)
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let mounted = true

    async function loadSession() {
      const { data, error } = await supabase.auth.getSession()

      if (error) {
        console.error('Failed to load authentication session:', error)
      }

      if (!mounted) {
        return
      }

      setSession(data.session)
      setUser(getUserFromSession(data.session))
      setLoading(false)
    }

    loadSession()

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, nextSession) => {
      setSession(nextSession)
      setUser(getUserFromSession(nextSession))
      setLoading(false)
    })

    return () => {
      mounted = false
      subscription.unsubscribe()
    }
  }, [])

  async function signOut() {
    const { error } = await supabase.auth.signOut()

    if (error) {
      throw error
    }
  }

  const value = {
    session,
    user,
    isAuthenticated: Boolean(session),
    loading,
    accessToken: session?.access_token || null,
    signOut,
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)

  if (!context) {
    throw new Error('useAuth must be used inside AuthProvider')
  }

  return context
}