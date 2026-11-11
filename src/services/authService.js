import { supabase, isSupabaseConfigured } from '../lib/supabase'
import { mockDb } from './mockStore'

export async function registerUser({ email, password, full_name, phone, role }) {
  if (isSupabaseConfigured()) {
    try {
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: { full_name, phone, role }
        }
      })
      if (!authError && authData.user) {
        await supabase.from('users').upsert({
          id: authData.user.id,
          full_name,
          email,
          phone,
          role,
        })
        return authData
      }
    } catch (e) {
      console.warn('Supabase registerUser failed, using mock auth')
    }
  }

  // Mock registration
  const users = mockDb.getUsers()
  if (users.find(u => u.email === email)) {
    throw new Error('Email sudah terdaftar. Silakan gunakan email lain atau login.')
  }

  const newUser = {
    id: `user-${Date.now()}`,
    email,
    password,
    full_name,
    phone,
    role,
    profile_image: role === 'owner'
      ? 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&q=80'
      : 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&q=80',
    created_at: new Date().toISOString()
  }

  mockDb.saveUsers([...users, newUser])
  mockDb.setCurrentUser(newUser)
  return { user: newUser }
}

export async function loginUser({ email, password }) {
  if (isSupabaseConfigured()) {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({ email, password })
      if (!error && data?.user) return data
    } catch (e) {
      console.warn('Supabase loginUser failed, checking mock users')
    }
  }

  const users = mockDb.getUsers()
  // Accept standard demo logins or registered users
  if (email === 'owner@demo.com' || (email.toLowerCase().includes('owner') && password)) {
    const owner = users.find(u => u.role === 'owner') || {
      id: 'owner-demo-1',
      full_name: 'Hj. Siti Rahmawati',
      email: 'owner@demo.com',
      phone: '081223344556',
      role: 'owner',
      profile_image: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&q=80'
    }
    mockDb.setCurrentUser(owner)
    return { user: owner }
  }

  if (email === 'customer@demo.com' || (email.toLowerCase().includes('customer') && password)) {
    const cust = users.find(u => u.role === 'customer') || {
      id: 'customer-demo-1',
      full_name: 'Muhammad Farhan',
      email: 'customer@demo.com',
      phone: '085712345678',
      role: 'customer',
      profile_image: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&q=80'
    }
    mockDb.setCurrentUser(cust)
    return { user: cust }
  }

  const user = users.find(u => u.email === email)
  if (user && (!user.password || user.password === password)) {
    mockDb.setCurrentUser(user)
    return { user }
  }

  throw new Error('Email atau password salah. Coba akun demo: customer@demo.com / owner@demo.com')
}

export async function logoutUser() {
  if (isSupabaseConfigured()) {
    try {
      await supabase.auth.signOut()
    } catch (e) {
      // ignore
    }
  }
  mockDb.setCurrentUser(null)
}

export async function getSession() {
  if (isSupabaseConfigured()) {
    try {
      const { data, error } = await supabase.auth.getSession()
      if (!error && data?.session) return data.session
    } catch (e) {
      // ignore
    }
  }
  const curr = mockDb.getCurrentUser()
  return curr ? { user: curr } : null
}

export async function getUserProfile(userId) {
  if (isSupabaseConfigured()) {
    try {
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('id', userId)
        .single()
      if (!error && data) return data
    } catch (e) {
      // ignore
    }
  }
  const users = mockDb.getUsers()
  const found = users.find(u => u.id === userId)
  return found || mockDb.getCurrentUser()
}

export async function updateUserProfile(userId, updates) {
  if (isSupabaseConfigured()) {
    try {
      const { data, error } = await supabase
        .from('users')
        .update(updates)
        .eq('id', userId)
        .select()
        .single()
      if (!error && data) return data
    } catch (e) {
      // ignore
    }
  }
  const users = mockDb.getUsers()
  const updated = users.map(u => u.id === userId ? { ...u, ...updates } : u)
  mockDb.saveUsers(updated)
  const current = mockDb.getCurrentUser()
  if (current && current.id === userId) {
    mockDb.setCurrentUser({ ...current, ...updates })
  }
  return updated.find(u => u.id === userId)
}

export async function uploadProfileImage(userId, file) {
  const imageUrl = URL.createObjectURL(file)
  await updateUserProfile(userId, { profile_image: imageUrl })
  return imageUrl
}
