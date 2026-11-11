import { useState, useEffect, createContext, useContext } from 'react'
import { supabase, isSupabaseConfigured } from '../lib/supabase'
import { getUserProfile, getSession } from '../services/authService'
import { mockDb } from '../services/mockStore'

export const AuthContext = createContext(null)

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) throw new Error('useAuth must be used within AuthProvider')
  return context
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [profile, setProfile] = useState(null)
  const [loading, setLoading] = useState(true)

  const initAuth = async () => {
    try {
      if (isSupabaseConfigured()) {
        const session = await getSession()
        if (session?.user) {
          setUser(session.user)
          const profileData = await getUserProfile(session.user.id)
          setProfile(profileData || session.user)
          return
        }
      }
      const mockUser = mockDb.getCurrentUser()
      if (mockUser) {
        setUser(mockUser)
        setProfile(mockUser)
      } else {
        setUser(null)
        setProfile(null)
      }
    } catch (e) {
      console.warn('Auth init failed:', e)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    initAuth()

    if (!isSupabaseConfigured()) {
      return
    }

    const { data } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (session?.user) {
          setUser(session.user)
          const p = await getUserProfile(session.user.id)
          setProfile(p || session.user)
        } else {
          const mockUser = mockDb.getCurrentUser()
          setUser(mockUser || null)
          setProfile(mockUser || null)
        }
        setLoading(false)
      }
    )

    return () => {
      data?.subscription?.unsubscribe?.()
    }
  }, [])

  const refreshProfile = async () => {
    if (user?.id) {
      const p = await getUserProfile(user.id)
      setProfile(p || user)
    }
  }

  const value = {
    user,
    profile,
    loading,
    isAuthenticated: !!profile,
    isCustomer: profile?.role === 'customer',
    isOwner: profile?.role === 'owner',
    refreshProfile,
    recheckAuth: initAuth,
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}
