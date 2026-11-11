import { useState } from 'react'
import { useAuth } from '../../hooks/useAuth'
import { updateUserProfile } from '../../services/authService'
import toast from 'react-hot-toast'
import { PencilIcon, CheckIcon, XMarkIcon } from '@heroicons/react/24/outline'

export default function OwnerProfile() {
  const { profile, refreshProfile } = useAuth()
  const [editing, setEditing] = useState(false)
  const [form, setForm] = useState({
    full_name: profile?.full_name || '',
    phone: profile?.phone || '',
  })
  const [saving, setSaving] = useState(false)

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

  return (
    <div className="space-y-6 max-w-xl">
      <div>
        <h1 className="text-2xl font-bold text-primary-text">Profil Pemilik Kos</h1>
        <p className="text-secondary-text text-sm">Kelola informasi kontak dan nomor WhatsApp yang dihubungi pencari kos</p>
      </div>

      <div className="card p-6 space-y-5">
        <div className="flex items-center gap-4 pb-6 border-b border-border">
          <div className="w-16 h-16 rounded-2xl bg-accent/20 flex items-center justify-center text-accent font-bold text-2xl">
            {profile?.full_name?.charAt(0) || 'O'}
          </div>
          <div>
            <h2 className="font-bold text-primary-text text-lg">{profile?.full_name}</h2>
            <p className="text-xs text-secondary-text">{profile?.email}</p>
            <span className="inline-block mt-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-accent/10 text-accent">
              Pemilik Kos (Owner)
            </span>
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-secondary-text mb-1">Nama Lengkap</label>
            {editing ? (
              <input
                type="text"
                value={form.full_name}
                onChange={e => setForm({ ...form, full_name: e.target.value })}
                className="input-field py-2 text-sm"
              />
            ) : (
              <p className="text-primary-text font-medium text-sm py-2.5 px-3.5 bg-background rounded-xl border border-border">
                {profile?.full_name}
              </p>
            )}
          </div>

          <div>
            <label className="block text-xs font-semibold text-secondary-text mb-1">Email Akun</label>
            <p className="text-secondary-text text-sm py-2.5 px-3.5 bg-background rounded-xl border border-border">
              {profile?.email}
            </p>
          </div>

          <div>
            <label className="block text-xs font-semibold text-secondary-text mb-1">
              Nomor WhatsApp (Digunakan untuk tombol WA di listing kos)
            </label>
            {editing ? (
              <input
                type="tel"
                value={form.phone}
                onChange={e => setForm({ ...form, phone: e.target.value })}
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

        <div className="pt-2 flex gap-3">
          {editing ? (
            <>
              <button onClick={handleSave} disabled={saving} className="btn-primary text-sm py-2 px-4 flex items-center gap-1.5">
                <CheckIcon className="w-4 h-4" />
                {saving ? 'Menyimpan...' : 'Simpan'}
              </button>
              <button onClick={() => setEditing(false)} className="btn-secondary text-sm py-2 px-4 flex items-center gap-1.5">
                <XMarkIcon className="w-4 h-4" />
                Batal
              </button>
            </>
          ) : (
            <button onClick={() => setEditing(true)} className="btn-secondary text-sm py-2 px-4 flex items-center gap-1.5">
              <PencilIcon className="w-4 h-4" />
              Edit Kontak
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
