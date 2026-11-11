import { useAuth } from '../../hooks/useAuth'
import { updateUserProfile } from '../../services/authService'
import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { getCustomerFavorites } from '../../services/favoriteService'
import { getCustomerReviews } from '../../services/reviewService'
import { getUserConversations } from '../../services/chatService'
import toast from 'react-hot-toast'
import {
  UserIcon,
  PhoneIcon,
  EnvelopeIcon,
  PencilIcon,
  CheckIcon,
  XMarkIcon,
  HeartIcon,
  StarIcon,
  ChatBubbleLeftRightIcon
} from '@heroicons/react/24/outline'

export default function CustomerDashboard() {
  const { profile, refreshProfile } = useAuth()
  const [editing, setEditing] = useState(false)
  const [form, setForm] = useState({
    full_name: profile?.full_name || '',
    phone: profile?.phone || '',
  })
  const [saving, setSaving] = useState(false)
  const [counts, setCounts] = useState({ favs: 0, reviews: 0, convs: 0 })

  useEffect(() => {
    if (profile?.id) {
      Promise.all([
        getCustomerFavorites(profile.id),
        getCustomerReviews(profile.id),
        getUserConversations(profile.id, 'customer'),
      ]).then(([f, r, c]) => {
        setCounts({
          favs: f.length,
          reviews: r.length,
          convs: c.length,
        })
      })
    }
  }, [profile?.id])

  const handleSave = async () => {
    setSaving(true)
    try {
      await updateUserProfile(profile.id, form)
      await refreshProfile()
      setEditing(false)
      toast.success('Profil berhasil diperbarui')
    } catch (err) {
      toast.error('Gagal memperbarui profil')
    } finally {
      setSaving(false)
    }
  }

  const handleCancel = () => {
    setForm({ full_name: profile?.full_name || '', phone: profile?.phone || '' })
    setEditing(false)
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-primary-text">Dashboard Customer</h1>
          <p className="text-sm text-secondary-text">Kelola profil dan pantau riwayat pencarian kos Anda</p>
        </div>
      </div>

      {/* Stats summary */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Link to="/customer/favorites" className="card p-5 hover:border-primary/40 transition-colors">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-red-50 text-red-500 flex items-center justify-center">
              <HeartIcon className="w-6 h-6" />
            </div>
            <div>
              <p className="text-2xl font-bold text-primary-text">{counts.favs}</p>
              <p className="text-xs text-secondary-text">Kos Favorit</p>
            </div>
          </div>
        </Link>

        <Link to="/customer/messages" className="card p-5 hover:border-primary/40 transition-colors">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center">
              <ChatBubbleLeftRightIcon className="w-6 h-6" />
            </div>
            <div>
              <p className="text-2xl font-bold text-primary-text">{counts.convs}</p>
              <p className="text-xs text-secondary-text">Percakapan Chat</p>
            </div>
          </div>
        </Link>

        <Link to="/customer/reviews" className="card p-5 hover:border-primary/40 transition-colors">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-500 flex items-center justify-center">
              <StarIcon className="w-6 h-6" />
            </div>
            <div>
              <p className="text-2xl font-bold text-primary-text">{counts.reviews}</p>
              <p className="text-xs text-secondary-text">Ulasan Diberikan</p>
            </div>
          </div>
        </Link>
      </div>

      {/* Profile Card */}
      <div className="card p-6">
        <div className="flex items-center gap-5 mb-6 pb-6 border-b border-border">
          <div className="w-20 h-20 rounded-2xl bg-primary/10 flex items-center justify-center overflow-hidden">
            {profile?.profile_image ? (
              <img src={profile.profile_image} alt={profile.full_name}
                className="w-20 h-20 object-cover" />
            ) : (
              <span className="text-primary font-bold text-3xl">
                {profile?.full_name?.charAt(0)?.toUpperCase()}
              </span>
            )}
          </div>
          <div>
            <h2 className="text-xl font-bold text-primary-text">{profile?.full_name}</h2>
            <p className="text-sm text-secondary-text">{profile?.email}</p>
            <span className="inline-block mt-2 px-3 py-0.5 bg-primary/10 text-primary text-xs font-semibold rounded-full">
              Pencari Kos (Customer)
            </span>
          </div>
        </div>

        <div className="space-y-4 max-w-lg">
          <div>
            <label className="block text-xs font-semibold text-secondary-text mb-1">
              Nama Lengkap
            </label>
            {editing ? (
              <input
                type="text"
                value={form.full_name}
                onChange={e => setForm(f => ({ ...f, full_name: e.target.value }))}
                className="input-field py-2 text-sm"
              />
            ) : (
              <p className="text-primary-text font-medium text-sm py-2.5 px-3.5 bg-background rounded-xl border border-border">
                {profile?.full_name}
              </p>
            )}
          </div>

          <div>
            <label className="block text-xs font-semibold text-secondary-text mb-1">
              Alamat Email
            </label>
            <p className="text-secondary-text font-medium text-sm py-2.5 px-3.5 bg-background rounded-xl border border-border">
              {profile?.email}
            </p>
          </div>

          <div>
            <label className="block text-xs font-semibold text-secondary-text mb-1">
              Nomor WhatsApp / HP
            </label>
            {editing ? (
              <input
                type="tel"
                value={form.phone}
                onChange={e => setForm(f => ({ ...f, phone: e.target.value }))}
                className="input-field py-2 text-sm"
                placeholder="08xxxxxxxxxx"
              />
            ) : (
              <p className="text-primary-text font-medium text-sm py-2.5 px-3.5 bg-background rounded-xl border border-border">
                {profile?.phone || 'Belum diisi'}
              </p>
            )}
          </div>
        </div>

        <div className="mt-6 flex gap-3">
          {editing ? (
            <>
              <button onClick={handleSave} disabled={saving} className="btn-primary text-sm py-2 px-4 flex items-center gap-1.5">
                <CheckIcon className="w-4 h-4" />
                {saving ? 'Menyimpan...' : 'Simpan Perubahan'}
              </button>
              <button onClick={handleCancel} className="btn-secondary text-sm py-2 px-4 flex items-center gap-1.5">
                <XMarkIcon className="w-4 h-4" />
                Batal
              </button>
            </>
          ) : (
            <button onClick={() => setEditing(true)} className="btn-secondary text-sm py-2 px-4 flex items-center gap-1.5">
              <PencilIcon className="w-4 h-4" />
              Edit Informasi
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
