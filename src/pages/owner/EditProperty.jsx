import { useState, useEffect } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { getPropertyById, updateProperty } from '../../services/propertyService'
import Loading from '../../components/Loading'
import toast from 'react-hot-toast'
import { ArrowLeftIcon } from '@heroicons/react/24/outline'

const FACILITIES_LIST = [
  'WiFi', 'AC', 'Kamar Mandi Dalam', 'Kamar Mandi Luar',
  'Kasur', 'Lemari', 'Meja Belajar', 'Parkir', 'Dapur', 'Laundry'
]

export default function EditProperty() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [form, setForm] = useState(null)

  useEffect(() => {
    getPropertyById(id).then(prop => {
      setForm({
        ...prop,
        facilities: prop.property_facilities?.map(pf => pf.facilities?.name) || []
      })
    }).catch(err => {
      toast.error('Gagal mengambil data properti')
      navigate('/owner/properties')
    }).finally(() => setLoading(false))
  }, [id])

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
    setSaving(true)
    try {
      await updateProperty(id, form.owner_id, {
        name: form.name,
        address: form.address,
        area: form.area,
        gender_type: form.gender_type,
        price_min: Number(form.price_min),
        description: form.description,
        curfew_time: form.curfew_time,
        guest_policy: form.guest_policy,
        rules_description: form.rules_description,
      })
      toast.success('Properti berhasil diperbarui!')
      navigate('/owner/properties')
    } catch (err) {
      toast.error('Gagal memperbarui properti: ' + err.message)
    } finally {
      setSaving(false)
    }
  }

  if (loading || !form) return <Loading message="Memuat properti..." />

  return (
    <div className="space-y-6 max-w-3xl">
      <div className="flex items-center gap-3">
        <Link to="/owner/properties" className="p-2 rounded-xl hover:bg-background border border-border">
          <ArrowLeftIcon className="w-5 h-5 text-secondary-text" />
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-primary-text">Edit Properti Kos</h1>
          <p className="text-secondary-text text-sm">Perbarui informasi untuk listing {form.name}</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="card p-6 space-y-5">
        <div>
          <label className="block text-xs font-semibold text-secondary-text mb-1.5">
            Nama Kos
          </label>
          <input
            type="text"
            required
            value={form.name}
            onChange={e => setForm({ ...form, name: e.target.value })}
            className="input-field"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-secondary-text mb-1.5">
              Area / Kawasan
            </label>
            <input
              type="text"
              required
              value={form.area}
              onChange={e => setForm({ ...form, area: e.target.value })}
              className="input-field"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-secondary-text mb-1.5">
              Kategori Tipe Kos
            </label>
            <select
              value={form.gender_type}
              onChange={e => setForm({ ...form, gender_type: e.target.value })}
              className="input-field font-semibold"
            >
              <option value="PUTRA">👨 Kos Putra</option>
              <option value="PUTRI">👩 Kos Putri</option>
              <option value="CAMPUR">👥 Kos Campur</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-secondary-text mb-1.5">
              Harga Sewa Mulai / Bulan (Rp)
            </label>
            <input
              type="number"
              required
              value={form.price_min || ''}
              onChange={e => setForm({ ...form, price_min: e.target.value })}
              className="input-field"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-secondary-text mb-1.5">
              Jam Malam
            </label>
            <input
              type="text"
              value={form.curfew_time || ''}
              onChange={e => setForm({ ...form, curfew_time: e.target.value })}
              className="input-field"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-secondary-text mb-1.5">
            Alamat Lengkap Properti
          </label>
          <textarea
            required
            rows={2}
            value={form.address || ''}
            onChange={e => setForm({ ...form, address: e.target.value })}
            className="input-field resize-none"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-secondary-text mb-1.5">
            Deskripsi Properti
          </label>
          <textarea
            rows={3}
            value={form.description || ''}
            onChange={e => setForm({ ...form, description: e.target.value })}
            className="input-field resize-none"
          />
        </div>

        <div className="pt-4 border-t border-border flex justify-end gap-3">
          <Link to="/owner/properties" className="btn-secondary text-sm py-2.5 px-5">
            Batal
          </Link>
          <button
            type="submit"
            disabled={saving}
            className="btn-primary text-sm py-2.5 px-6"
          >
            {saving ? 'Menyimpan...' : 'Simpan Perubahan'}
          </button>
        </div>
      </form>
    </div>
  )
}
