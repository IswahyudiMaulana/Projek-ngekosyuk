import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../../hooks/useAuth'
import { createProperty } from '../../services/propertyService'
import toast from 'react-hot-toast'
import { ArrowLeftIcon } from '@heroicons/react/24/outline'

const FACILITIES_LIST = [
  'WiFi', 'AC', 'Kamar Mandi Dalam', 'Kamar Mandi Luar',
  'Kasur', 'Lemari', 'Meja Belajar', 'Parkir', 'Dapur', 'Laundry'
]

export default function AddProperty() {
  const { profile } = useAuth()
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const [form, setForm] = useState({
    name: '',
    address: '',
    area: 'Bojongsoang',
    gender_type: 'CAMPUR',
    price_min: '',
    description: '',
    curfew_time: '23:00 WIB',
    guest_policy: 'Tamu diterima di ruang tamu bersama.',
    rules_description: 'Menjaga kebersihan dan ketertiban bersama antar penghuni.',
    facilities: ['WiFi', 'Kasur', 'Lemari', 'Kamar Mandi Dalam'],
  })

  const handleFacilityToggle = (fac) => {
    setForm(prev => ({
      ...prev,
      facilities: prev.facilities.includes(fac)
        ? prev.facilities.filter(f => f !== fac)
        : [...prev.facilities, fac]
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!form.name.trim() || !form.address.trim()) {
      toast.error('Mohon isi nama kos dan alamat lengkap')
      return
    }

    setLoading(true)
    try {
      const created = await createProperty(profile?.id || 'owner-demo-1', {
        name: form.name,
        address: form.address,
        area: form.area,
        gender_type: form.gender_type,
        price_min: Number(form.price_min) || 1000000,
        description: form.description,
        curfew_time: form.curfew_time,
        guest_policy: form.guest_policy,
        rules_description: form.rules_description,
        facilities: form.facilities,
      })
      toast.success('Properti kos berhasil ditambahkan!')
      navigate(`/owner/properties/${created.id}/rooms`)
    } catch (err) {
      toast.error('Gagal menambahkan properti: ' + err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-6 max-w-3xl">
      <div className="flex items-center gap-3">
        <Link to="/owner/properties" className="p-2 rounded-xl hover:bg-background border border-border">
          <ArrowLeftIcon className="w-5 h-5 text-secondary-text" />
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-primary-text">Tambah Properti Kos Baru</h1>
          <p className="text-secondary-text text-sm">Lengkapi detail properti untuk mulai menerima calon penghuni</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="card p-6 space-y-5">
        <div>
          <label className="block text-xs font-semibold text-secondary-text mb-1.5">
            Nama Kos *
          </label>
          <input
            type="text"
            required
            value={form.name}
            onChange={e => setForm({ ...form, name: e.target.value })}
            placeholder="Contoh: Pondok Indah Bojongsoang"
            className="input-field"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-secondary-text mb-1.5">
              Kawasan / Area *
            </label>
            <select
              value={form.area}
              onChange={e => setForm({ ...form, area: e.target.value })}
              className="input-field"
            >
              <option value="Bojongsoang">Bojongsoang</option>
              <option value="Sukabirus">Sukabirus</option>
              <option value="Sukapura">Sukapura</option>
              <option value="Terusan Buah Batu">Terusan Buah Batu</option>
              <option value="Ciganitri">Ciganitri</option>
              <option value="Lengkong">Lengkong</option>
              <option value="Cipagalo">Cipagalo</option>
              <option value="Cikoneng">Cikoneng</option>
              <option value="Griya Bandung Asri (GBA)">Griya Bandung Asri (GBA)</option>
              <option value="Sekitar Telkom University">Sekitar Telkom University</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-secondary-text mb-1.5">
              Kategori Tipe Kos *
            </label>
            <select
              value={form.gender_type}
              onChange={e => setForm({ ...form, gender_type: e.target.value })}
              className="input-field font-semibold"
            >
              <option value="PUTRA">👨 Kos Putra (Khusus Pria)</option>
              <option value="PUTRI">👩 Kos Putri (Khusus Wanita)</option>
              <option value="CAMPUR">👥 Kos Campur (Putra & Putri)</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-secondary-text mb-1.5">
              Harga Sewa Mulai / Bulan (Rp) *
            </label>
            <input
              type="number"
              required
              min="300000"
              step="50000"
              value={form.price_min}
              onChange={e => setForm({ ...form, price_min: e.target.value })}
              placeholder="Contoh: 850000"
              className="input-field"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-secondary-text mb-1.5">
              Jam Malam
            </label>
            <input
              type="text"
              value={form.curfew_time}
              onChange={e => setForm({ ...form, curfew_time: e.target.value })}
              placeholder="Contoh: 23:00 WIB atau Bebas 24 Jam"
              className="input-field"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-secondary-text mb-1.5">
            Alamat Lengkap Properti *
          </label>
          <textarea
            required
            rows={2}
            value={form.address}
            onChange={e => setForm({ ...form, address: e.target.value })}
            placeholder="Jl. Raya Bojongsoang No. ..., RT/RW, Desa ..., Kab. Bandung"
            className="input-field resize-none"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-secondary-text mb-1.5">
            Deskripsi Kos & Lingkungan Sekitar
          </label>
          <textarea
            rows={3}
            value={form.description}
            onChange={e => setForm({ ...form, description: e.target.value })}
            placeholder="Jelaskan kenyamanan, keunggulan, serta jarak menuju kampus Telkom University..."
            className="input-field resize-none"
          />
        </div>

        {/* Facilities selection */}
        <div>
          <label className="block text-xs font-semibold text-secondary-text mb-2">
            Pilihan Fasilitas yang Tersedia
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            {FACILITIES_LIST.map(fac => {
              const isSelected = form.facilities.includes(fac)
              return (
                <button
                  type="button"
                  key={fac}
                  onClick={() => handleFacilityToggle(fac)}
                  className={`text-left px-3 py-2.5 rounded-xl border text-xs font-medium transition-all ${
                    isSelected
                      ? 'border-primary bg-primary/10 text-primary font-semibold'
                      : 'border-border text-secondary-text hover:bg-background'
                  }`}
                >
                  {isSelected ? '✓ ' : '+ '} {fac}
                </button>
              )
            })}
          </div>
        </div>

        <div className="pt-4 border-t border-border flex justify-end gap-3">
          <Link to="/owner/properties" className="btn-secondary text-sm py-2.5 px-5">
            Batal
          </Link>
          <button
            type="submit"
            disabled={loading}
            className="btn-primary text-sm py-2.5 px-6"
          >
            {loading ? 'Menyimpan...' : 'Simpan & Kelola Kamar'}
          </button>
        </div>
      </form>
    </div>
  )
}
