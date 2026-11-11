import { createClient } from '@supabase/supabase-js'

const rawUrl = import.meta.env.VITE_SUPABASE_URL
const rawKey = import.meta.env.VITE_SUPABASE_ANON_KEY

export const isSupabaseConfigured = () => {
  if (!rawUrl || !rawKey) return false
  if (typeof rawUrl !== 'string' || typeof rawKey !== 'string') return false
  const trimmedUrl = rawUrl.trim()
  if (!trimmedUrl.startsWith('https://') && !trimmedUrl.startsWith('http://')) return false
  if (trimmedUrl.includes('placeholder') || trimmedUrl.includes('your_supabase')) return false
  if (rawKey.includes('placeholder') || rawKey.includes('your_supabase') || rawKey.length < 20) return false
  return true
}

const configured = isSupabaseConfigured()

if (!configured) {
  console.info('Supabase belum dikonfigurasi atau URL tidak valid. Menggunakan mode Mock lokal.')
}

const supabaseUrl = configured ? rawUrl.trim() : 'https://placeholder.supabase.co'
const supabaseAnonKey = configured ? rawKey.trim() : 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.placeholder'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

export default supabase

