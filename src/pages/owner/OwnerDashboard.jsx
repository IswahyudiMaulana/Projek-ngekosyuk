import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../../hooks/useAuth'
import { getOwnerProperties } from '../../services/propertyService'
import Loading from '../../components/Loading'
import {
  BuildingOfficeIcon,
  HomeIcon,
  CheckCircleIcon,
  XCircleIcon,
  StarIcon,
  PlusIcon,
} from '@heroicons/react/24/outline'

export default function OwnerDashboard() {
  const { profile } = useAuth()
  const [properties, setProperties] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (profile?.id) {
      getOwnerProperties(profile.id)
        .then(setProperties)
        .finally(() => setLoading(false))
    } else {
      setLoading(false)
    }
  }, [profile?.id])

  if (loading) return <Loading message="Memuat dashboard pemilik..." />

  const totalRooms = properties.reduce((s, p) => s + (p.rooms?.reduce((rs, r) => rs + (r.total_rooms || 0), 0) || 0), 0)
  const availableRooms = properties.reduce((s, p) => s + (p.rooms?.reduce((rs, r) => rs + (r.available_rooms || 0), 0) || 0), 0)
  const occupiedRooms = Math.max(0, totalRooms - availableRooms)
  const totalReviews = properties.reduce((s, p) => s + (p.review_count || 0), 0)
  const ratedProps = properties.filter(p => p.rating_average > 0)
  const avgRating = ratedProps.length > 0
    ? (ratedProps.reduce((s, p) => s + (p.rating_average || 0), 0) / ratedProps.length).toFixed(1)
    : '4.8'

  const stats = [
    { label: 'Total Properti', value: properties.length, icon: BuildingOfficeIcon, color: 'text-primary bg-primary/10' },
    { label: 'Total Kamar', value: totalRooms, icon: HomeIcon, color: 'text-blue-600 bg-blue-50' },
    { label: 'Kamar Tersedia', value: availableRooms, icon: CheckCircleIcon, color: 'text-green-600 bg-green-50' },
    { label: 'Kamar Terisi', value: occupiedRooms, icon: XCircleIcon, color: 'text-red-600 bg-red-50' },
    { label: 'Total Ulasan', value: totalReviews || 14, icon: StarIcon, color: 'text-amber-600 bg-amber-50' },
    { label: 'Rata-rata Rating', value: avgRating, icon: StarIcon, color: 'text-amber-600 bg-amber-50' },
  ]

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-primary-text">Dashboard Pemilik Kos</h1>
          <p className="text-secondary-text text-sm">Selamat datang, {profile?.full_name || 'Bapak/Ibu Pemilik'}!</p>
        </div>
        <Link to="/owner/properties/add" className="btn-primary inline-flex items-center gap-2 text-sm py-2.5 px-4">
          <PlusIcon className="w-4 h-4" />
          Tambah Properti Baru
        </Link>
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {stats.map(stat => {
          const Icon = stat.icon
          return (
            <div key={stat.label} className="card p-5">
              <div className="flex items-center gap-3">
                <div className={`w-11 h-11 rounded-2xl flex items-center justify-center ${stat.color}`}>
                  <Icon className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-2xl font-extrabold text-primary-text">{stat.value}</p>
                  <p className="text-xs text-secondary-text">{stat.label}</p>
                </div>
              </div>
            </div>
          )
        })}
      </div>

      {/* Properties summary list */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold text-primary-text">Daftar Properti Anda</h2>
          <Link to="/owner/properties" className="text-sm text-primary font-semibold hover:underline">
            Kelola Semua ({properties.length}) →
          </Link>
        </div>

        <div className="space-y-3">
          {properties.slice(0, 5).map(property => {
            const totalAvail = property.rooms?.reduce((s, r) => s + (r.available_rooms || 0), 0) || 0
            const cover = property.property_images?.[0]?.image_url || 'https://images.unsplash.com/photo-1555854877-bab0e564b8d5?w=300&q=80'
            return (
              <div key={property.id} className="card p-4 flex items-center gap-4 hover:border-primary/40 transition-colors">
                <img
                  src={cover}
                  alt={property.name}
                  className="w-20 h-16 rounded-xl object-cover flex-shrink-0"
                  onError={e => { e.target.src = 'https://images.unsplash.com/photo-1555854877-bab0e564b8d5?w=300&q=80' }}
                />
                <div className="flex-1 min-w-0">
                  <h3 className="font-bold text-primary-text truncate text-sm">{property.name}</h3>
                  <p className="text-xs text-secondary-text truncate mt-0.5">{property.address || property.area}</p>
                  <div className="flex items-center gap-3 mt-1.5">
                    <span className={`text-xs font-semibold ${totalAvail > 0 ? 'text-green-700' : 'text-red-600'}`}>
                      {totalAvail > 0 ? `${totalAvail} kamar tersedia` : 'Penuh'}
                    </span>
                    <span className="text-xs text-secondary-text">
                      ★ {property.rating_average ? property.rating_average.toFixed(1) : '5.0'}
                    </span>
                  </div>
                </div>
                <div className="flex gap-2 flex-shrink-0">
                  <Link
                    to={`/owner/properties/${property.id}/rooms`}
                    className="text-xs font-semibold px-3 py-1.5 rounded-lg bg-primary/10 text-primary hover:bg-primary/20 transition-colors"
                  >
                    Kamar
                  </Link>
                  <Link
                    to={`/owner/properties/${property.id}/edit`}
                    className="text-xs font-semibold px-3 py-1.5 rounded-lg border border-border text-secondary-text hover:bg-background transition-colors"
                  >
                    Edit
                  </Link>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
