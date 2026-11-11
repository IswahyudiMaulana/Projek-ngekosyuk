import { useState } from 'react'
import { Link, useNavigate, Navigate } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import { registerUser } from '../services/authService'
import toast from 'react-hot-toast'
import { EyeIcon, EyeSlashIcon, UserIcon, BuildingOfficeIcon } from '@heroicons/react/24/outline'

export default function Register() {
  const { isAuthenticated, profile } = useAuth()
  const navigate = useNavigate()
  const [role, setRole] = useState(null)
  const [form, setForm] = useState({
    full_name: '', email: '', phone: '', password: '', confirmPassword: ''
  })
  const [showPass, setShowPass] = useState(false)
  const [loading, setLoading] = useState(false)
  const [errors, setErrors] = useState({})

  if (isAuthenticated && profile) {
    return <Navigate to={profile.role === 'owner' ? '/owner/dashboard' : '/customer/dashboard'} replace />
  }

  const validate = () => {
    const errs = {}
    if (!form.full_name.trim()) errs.full_name = 'Nama lengkap wajib diisi'
    if (!form.email.trim()) errs.email = 'Email wajib diisi'
    if (!form.phone.trim()) errs.phone = 'Nomor HP wajib diisi'
    if (form.password.length < 8) errs.password = 'Password minimal 8 karakter'
    if (form.password !== form.confirmPassword) errs.confirmPassword = 'Password tidak cocok'
    return errs
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const errs = validate()
    if (Object.keys(errs).length > 0) {
      setErrors(errs)
      return
    }
    setErrors({})
    setLoading(true)
    try {
      await registerUser({ ...form, role })
      toast.success('Akun berhasil dibuat! Silakan cek email untuk verifikasi.')
      navigate('/login')
    } catch (err) {
      toast.error(err.message || 'Gagal membuat akun')
    } finally {
      setLoading(false)
    }
  }

  // Step 1: Choose role
  if (!role) {
    return (
      <div>
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 mb-4">
            <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center">
              <span className="text-white font-bold">NK</span>
            </div>
            <span className="font-bold text-primary text-xl">NgekosYuk</span>
          </div>
          <h1 className="text-2xl font-bold text-primary-text">Buat Akun Baru</h1>
          <p className="text-secondary-text mt-2 text-sm">Pilih tipe akun yang sesuai dengan kebutuhanmu</p>
        </div>

        <div className="space-y-4">
          <button
            onClick={() => setRole('customer')}
            className="w-full card p-6 text-left hover:border-primary hover:shadow-hover transition-all duration-200 group border-2 border-transparent"
          >
            <div className="flex items-start gap-4">
              <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center group-hover:bg-primary group-hover:text-white transition-colors">
                <UserIcon className="w-7 h-7 text-primary group-hover:text-white" />
              </div>
              <div>
                <h3 className="font-bold text-primary-text text-lg mb-1">Saya ingin mencari kos</h3>
                <p className="text-secondary-text text-sm">Daftar sebagai Customer untuk mencari, menyimpan, dan menghubungi pemilik kos</p>
                <div className="flex flex-wrap gap-2 mt-3">
                  {['Cari Kos', 'Simpan Favorit', 'Chat dengan Owner', 'Beri Ulasan'].map(tag => (
                    <span key={tag} className="text-xs bg-primary/10 text-primary px-2 py-1 rounded-full">{tag}</span>
                  ))}
                </div>
              </div>
            </div>
          </button>

          <button
            onClick={() => setRole('owner')}
            className="w-full card p-6 text-left hover:border-accent hover:shadow-hover transition-all duration-200 group border-2 border-transparent"
          >
            <div className="flex items-start gap-4">
              <div className="w-14 h-14 rounded-2xl bg-accent/10 flex items-center justify-center group-hover:bg-accent group-hover:text-white transition-colors">
                <BuildingOfficeIcon className="w-7 h-7 text-accent group-hover:text-white" />
              </div>
              <div>
                <h3 className="font-bold text-primary-text text-lg mb-1">Saya pemilik kos</h3>
                <p className="text-secondary-text text-sm">Daftar sebagai Owner untuk memasarkan dan mengelola properti kos Anda</p>
                <div className="flex flex-wrap gap-2 mt-3">
                  {['Tambah Properti', 'Kelola Kamar', 'Balas Pesan', 'Lihat Ulasan'].map(tag => (
                    <span key={tag} className="text-xs bg-accent/10 text-accent px-2 py-1 rounded-full">{tag}</span>
                  ))}
                </div>
              </div>
            </div>
          </button>
        </div>

        <p className="text-center text-sm text-secondary-text mt-6">
          Sudah punya akun?{' '}
          <Link to="/login" className="text-primary font-semibold hover:underline">Masuk</Link>
        </p>
      </div>
    )
  }

  // Step 2: Fill form
  const isCustomer = role === 'customer'

  return (
    <div>
      <div className="text-center mb-6">
        <h1 className="text-2xl font-bold text-primary-text">
          Daftar sebagai {isCustomer ? 'Customer' : 'Pemilik Kos'}
        </h1>
        <p className="text-secondary-text text-sm mt-1">Lengkapi data diri Anda</p>
      </div>

      <div className="card p-6">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-primary-text mb-1.5">Nama Lengkap</label>
            <input
              type="text"
              value={form.full_name}
              onChange={e => setForm(f => ({ ...f, full_name: e.target.value }))}
              placeholder="Masukkan nama lengkap"
              className={`input-field ${errors.full_name ? 'border-red-400 focus:border-red-400 focus:ring-red-200' : ''}`}
            />
            {errors.full_name && <p className="text-red-600 text-xs mt-1">{errors.full_name}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-primary-text mb-1.5">Email</label>
            <input
              type="email"
              value={form.email}
              onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
              placeholder="email@contoh.com"
              className={`input-field ${errors.email ? 'border-red-400' : ''}`}
            />
            {errors.email && <p className="text-red-600 text-xs mt-1">{errors.email}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-primary-text mb-1.5">Nomor HP / WhatsApp</label>
            <input
              type="tel"
              value={form.phone}
              onChange={e => setForm(f => ({ ...f, phone: e.target.value }))}
              placeholder="08xx-xxxx-xxxx"
              className={`input-field ${errors.phone ? 'border-red-400' : ''}`}
            />
            {errors.phone && <p className="text-red-600 text-xs mt-1">{errors.phone}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-primary-text mb-1.5">Password</label>
            <div className="relative">
              <input
                type={showPass ? 'text' : 'password'}
                value={form.password}
                onChange={e => setForm(f => ({ ...f, password: e.target.value }))}
                placeholder="Minimal 8 karakter"
                className={`input-field pr-12 ${errors.password ? 'border-red-400' : ''}`}
              />
              <button type="button" onClick={() => setShowPass(!showPass)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-secondary-text">
                {showPass ? <EyeSlashIcon className="w-5 h-5" /> : <EyeIcon className="w-5 h-5" />}
              </button>
            </div>
            {errors.password && <p className="text-red-600 text-xs mt-1">{errors.password}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-primary-text mb-1.5">Konfirmasi Password</label>
            <input
              type={showPass ? 'text' : 'password'}
              value={form.confirmPassword}
              onChange={e => setForm(f => ({ ...f, confirmPassword: e.target.value }))}
              placeholder="Ulangi password"
              className={`input-field ${errors.confirmPassword ? 'border-red-400' : ''}`}
            />
            {errors.confirmPassword && <p className="text-red-600 text-xs mt-1">{errors.confirmPassword}</p>}
          </div>

          <div className="flex gap-3 pt-2">
            <button type="button" onClick={() => setRole(null)}
              className="btn-secondary flex-1">
              Kembali
            </button>
            <button type="submit" disabled={loading}
              className={`flex-1 font-semibold py-3 px-6 rounded-xl transition-all duration-200 disabled:opacity-60
                ${isCustomer ? 'btn-primary' : 'bg-accent text-white hover:opacity-90'}`}>
              {loading ? 'Mendaftar...' : 'Daftar Sekarang'}
            </button>
          </div>
        </form>

        <p className="text-center text-sm text-secondary-text mt-4">
          Sudah punya akun?{' '}
          <Link to="/login" className="text-primary font-semibold hover:underline">Masuk</Link>
        </p>
      </div>
    </div>
  )
}
