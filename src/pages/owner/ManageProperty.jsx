import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../../hooks/useAuth'
import { getOwnerProperties, deleteProperty } from '../../services/propertyService'
import { formatCurrencyShort } from '../../utils/formatCurrency'
import Loading from '../../components/Loading'
import EmptyState from '../../components/EmptyState'
import toast from 'react-hot-toast'
import {
  PlusIcon,
  PencilIcon,
  TrashIcon,
  EyeIcon,
  BuildingOfficeIcon,
} from '@heroicons/react/24/outline'

export default function ManageProperty() {
  const { profile } = useAuth()
  const [properties, setProperties] = useState([])
  const [loading, setLoading] = useState(true)
  const [deleting, setDeleting] = useState(null)

  useEffect(() => {
    if (profile?.id) fetchProperties()
    else setLoading(false)
  }, [profile?.id])

  const fetchProperties = async () => {
    setLoading(true)
    try {
      const data = await getOwnerProperties(profile?.id)
      setProperties(data)
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (propertyId, propertyName) => {
    if (!confirm(`Yakin ingin menghapus "${propertyName}"?`)) return
    setDeleting(propertyId)
    try {
      await deleteProperty(propertyId, profile?.id)
      toast.success('Properti berhasil dihapus')
      setProperties(prev => prev.filter(p => p.id !== propertyId))
    } catch (err) {
      toast.error('Gagal menghapus properti')
    } finally {
      setDeleting(null)
    }
  }

  if (loading) return <Loading message="Memuat daftar properti..." />

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-primary-text">Manajemen Properti Kos</h1>
          <p className="text-secondary-text text-sm">Kelola informasi kos, galeri foto, dan ketersediaan kamar</p>
        </div>
        <Link to="/owner/properties/add" className="btn-primary inline-flex items-center gap-2 text-sm py-2.5 px-4">
          <PlusIcon className="w-4 h-4" />
          Tambah Properti
        </Link>
      </div>

      {properties.length === 0 ? (
        <EmptyState
          icon={BuildingOfficeIcon}
          title="Belum ada properti"
          description="Tambahkan properti kos pertama Anda agar dapat ditemukan oleh pencari kos di Bojongsoang."
          action={
            <Link to="/owner/properties/add" className="btn-primary inline-flex items-center gap-2">
              <PlusIcon className="w-4 h-4" />
              Tambah Properti
            </Link>
          }
        />
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {properties.map(property => {
            const cover = property.property_images?.[0]?.image_url || 'https://images.unsplash.com/photo-1555854877-bab0e564b8d5?w=300&q=80'
            const totalAvail = property.rooms?.reduce((s, r) => s + (r.available_rooms || 0), 0) || 0
            return (
              <div key={property.id} className="card p-5">
                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                  <img
                    src={cover}
                    alt={property.name}
                    className="w-full sm:w-32 h-28 rounded-xl object-cover flex-shrink-0"
                    onError={e => { e.target.src = 'https://images.unsplash.com/photo-1555854877-bab0e564b8d5?w=300&q=80' }}
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <h3 className="font-bold text-primary-text text-base">{property.name}</h3>
                        <p className="text-xs text-secondary-text mt-0.5">{property.address || property.area}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-xs text-secondary-text">Harga Mulai</p>
                        <p className="font-bold text-primary text-sm">{formatCurrencyShort(property.price_min)}</p>
                      </div>
                    </div>

                    <div className="flex flex-wrap items-center gap-2 mt-3">
                      <span className={`text-xs px-2.5 py-0.5 rounded-full font-semibold ${
                        property.gender_type === 'PUTRA' ? 'badge-putra' :
                        property.gender_type === 'PUTRI' ? 'badge-putri' : 'badge-campur'
                      }`}>
                        {property.gender_type}
                      </span>
                      <span className={`text-xs px-2.5 py-0.5 rounded-full font-semibold ${
                        totalAvail > 0 ? 'badge-available' : 'badge-full'
                      }`}>
                        {totalAvail > 0 ? `${totalAvail} Kamar Kosong` : 'Penuh'}
                      </span>
                      {property.is_demo && (
                        <span className="text-xs px-2 py-0.5 rounded-full bg-orange-50 text-orange-700 font-semibold border border-orange-200">
                          DEMO
                        </span>
                      )}
                    </div>

                    <div className="flex flex-wrap items-center gap-2 mt-4 pt-3 border-t border-border/60">
                      <Link
                        to={`/property/${property.id}`}
                        className="inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-lg border border-border text-secondary-text hover:bg-background"
                      >
                        <EyeIcon className="w-3.5 h-3.5" />
                        Pratinjau
                      </Link>
                      <Link
                        to={`/owner/properties/${property.id}/edit`}
                        className="inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-lg border border-border text-primary hover:bg-primary/5"
                      >
                        <PencilIcon className="w-3.5 h-3.5" />
                        Edit Properti
                      </Link>
                      <Link
                        to={`/owner/properties/${property.id}/rooms`}
                        className="inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-lg bg-primary text-white hover:bg-primary-700"
                      >
                        🛏️ Kelola Kamar & Ketersediaan
                      </Link>
                      <button
                        onClick={() => handleDelete(property.id, property.name)}
                        disabled={deleting === property.id}
                        className="inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-lg text-red-600 hover:bg-red-50 ml-auto"
                      >
                        <TrashIcon className="w-3.5 h-3.5" />
                        Hapus
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
