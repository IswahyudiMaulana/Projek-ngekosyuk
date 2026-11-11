import { useState } from 'react'
import { Link, useNavigate, Navigate } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import { loginUser } from '../services/authService'
import toast from 'react-hot-toast'
import { EyeIcon, EyeSlashIcon } from '@heroicons/react/24/outline'

export default function Login() {
  const { isAuthenticated, profile } = useAuth()
  const navigate = useNavigate()
  const [form, setForm] = useState({ email: '', password: '' })
  const [showPass, setShowPass] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  if (isAuthenticated && profile) {
    return <Navigate to={profile.role === 'owner' ? '/owner/dashboard' : '/customer/dashboard'} replace />
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      const { user } = await loginUser(form)
      toast.success('Selamat datang kembali!')
      // Profile will load via auth listener, navigate after a moment
      setTimeout(() => {
        navigate('/', { replace: true })
      }, 500)
    } catch (err) {
      setError(err.message === 'Invalid login credentials'
        ? 'Email atau password salah. Silakan coba lagi.'
        : err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div>
      <div className="text-center mb-8">
        <div className="inline-flex items-center gap-2 mb-4">
          <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center">
            <span className="text-white font-bold">NK</span>
          </div>
          <span className="font-bold text-primary text-xl">NgekosYuk</span>
        </div>
        <h1 className="text-2xl font-bold text-primary-text">Masuk ke Akun</h1>
        <p className="text-secondary-text mt-2 text-sm">Selamat datang kembali!</p>
      </div>

      <div className="card p-6">
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 rounded-xl p-3 mb-4 text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-primary-text mb-1.5">Email</label>
            <input
              type="email"
              value={form.email}
              onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
              placeholder="email@contoh.com"
              className="input-field"
              required
              autoComplete="email"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-primary-text mb-1.5">Password</label>
            <div className="relative">
              <input
                type={showPass ? 'text' : 'password'}
                value={form.password}
                onChange={e => setForm(f => ({ ...f, password: e.target.value }))}
                placeholder="Masukkan password"
                className="input-field pr-12"
                required
                autoComplete="current-password"
              />
              <button
                type="button"
                onClick={() => setShowPass(!showPass)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-secondary-text hover:text-primary-text transition-colors"
              >
                {showPass ? <EyeSlashIcon className="w-5 h-5" /> : <EyeIcon className="w-5 h-5" />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full btn-primary text-center disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Masuk...
              </span>
            ) : 'Masuk'}
          </button>
        </form>

        <div className="mt-5 text-center text-sm text-secondary-text">
          Belum punya akun?{' '}
          <Link to="/register" className="text-primary font-semibold hover:underline">
            Daftar sekarang
          </Link>
        </div>

        {/* Demo credentials info */}
        <div className="mt-5 p-3 bg-background rounded-xl border border-border text-xs text-secondary-text">
          <p className="font-medium text-primary-text mb-1">Akun Demo:</p>
          <p>Customer: customer@demo.com / demo1234</p>
          <p>Owner: owner@demo.com / demo1234</p>
        </div>
      </div>
    </div>
  )
}
