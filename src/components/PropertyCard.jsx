import { Link } from 'react-router-dom'
import { useState } from 'react'
import { HeartIcon, MapPinIcon, StarIcon, WifiIcon } from '@heroicons/react/24/outline'
import { HeartIcon as HeartSolid } from '@heroicons/react/24/solid'
import { formatCurrencyShort } from '../utils/formatCurrency'
import { getAvailabilityStatus } from '../utils/propertySorting'
import { useAuth } from '../hooks/useAuth'
import { toggleFavorite } from '../services/favoriteService'
import toast from 'react-hot-toast'

const FACILITY_ICONS = {
  'WiFi': '📶',
  'AC': '❄️',
  'Kamar Mandi Dalam': '🚿',
  'Kasur': '🛏️',
  'Lemari': '🗄️',
  'Meja Belajar': '📚',
  'Parkir': '🅿️',
  'Dapur': '🍳',
  'Laundry': '👕',
  'Kamar Mandi Luar': '🚽',
}

const GENDER_BADGE = {
  PUTRA: { label: 'Putra', className: 'badge-putra' },
  PUTRI: { label: 'Putri', className: 'badge-putri' },
  CAMPUR: { label: 'Campur', className: 'badge-campur' },
}

export default function PropertyCard({ property, isFav = false, onFavChange }) {
  const { profile, isAuthenticated } = useAuth()
  const [favLoading, setFavLoading] = useState(false)
  const [isFavState, setIsFavState] = useState(isFav)

  const coverImage = property.property_images?.find(img => img.image_category === 'exterior')?.image_url
    || property.property_images?.[0]?.image_url
    || `https://images.unsplash.com/photo-1555854877-bab0e564b8d5?w=600&q=80`

  const availability = getAvailabilityStatus(property)
  const totalAvailable = property.rooms?.reduce((sum, r) => sum + (r.available_rooms || 0), 0) || 0
  const genderBadge = GENDER_BADGE[property.gender_type] || { label: property.gender_type, className: 'badge-campur' }
  const topFacilities = property.property_facilities?.slice(0, 3).map(pf => pf.facilities?.name).filter(Boolean) || []

  const handleFavorite = async (e) => {
    e.preventDefault()
    if (!isAuthenticated || profile?.role !== 'customer') {
      toast.error('Login sebagai customer untuk menyimpan favorit')
      return
    }
    setFavLoading(true)
    try {
      const result = await toggleFavorite(profile.id, property.id)
      setIsFavState(result)
      toast.success(result ? 'Ditambahkan ke favorit' : 'Dihapus dari favorit')
      if (onFavChange) onFavChange(property.id, result)
    } catch (err) {
      toast.error('Gagal memperbarui favorit')
    } finally {
      setFavLoading(false)
    }
  }

  return (
    <Link to={`/property/${property.id}`} className="group block">
      <div className="card hover:shadow-hover transition-all duration-300 group-hover:-translate-y-0.5">
        {/* Image */}
        <div className="relative overflow-hidden h-48">
          <img
            src={coverImage}
            alt={property.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            onError={e => { e.target.src = 'https://images.unsplash.com/photo-1555854877-bab0e564b8d5?w=600&q=80' }}
          />
          {/* Badges overlay */}
          <div className="absolute top-3 left-3 flex gap-2 flex-wrap">
            <span className={genderBadge.className}>{genderBadge.label}</span>
            {property.is_demo && (
              <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold bg-orange-50 text-orange-700 border border-orange-200">
                DEMO
              </span>
            )}
          </div>
          {/* Availability badge */}
          <div className="absolute bottom-3 left-3">
            <span className={
              availability.type === 'available' ? 'badge-available' :
              availability.type === 'full' ? 'badge-full' : 'badge-unconfirmed'
            }>
              {availability.label}
            </span>
          </div>
          {/* Favorite button */}
          <button
            onClick={handleFavorite}
            disabled={favLoading}
            className="absolute top-3 right-3 w-8 h-8 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center shadow-soft hover:bg-white transition-colors"
          >
            {isFavState
              ? <HeartSolid className="w-4 h-4 text-red-500" />
              : <HeartIcon className="w-4 h-4 text-secondary-text" />}
          </button>
        </div>

        {/* Content */}
        <div className="p-4">
          <h3 className="font-semibold text-primary-text mb-1 truncate group-hover:text-primary transition-colors">
            {property.name}
          </h3>

          <div className="flex items-center gap-1 text-secondary-text text-xs mb-3">
            <MapPinIcon className="w-3.5 h-3.5 flex-shrink-0" />
            <span className="truncate">{property.area || property.address}</span>
          </div>

          {/* Rating */}
          <div className="flex items-center gap-1 mb-3">
            {property.rating_average > 0 ? (
              <>
                <StarIcon className="w-4 h-4 text-amber-400 fill-amber-400" />
                <span className="text-sm font-semibold text-primary-text">{property.rating_average?.toFixed(1)}</span>
                <span className="text-xs text-secondary-text">({property.review_count} ulasan)</span>
              </>
            ) : (
              <span className="text-xs text-secondary-text">Belum ada ulasan</span>
            )}
          </div>

          {/* Facilities */}
          {topFacilities.length > 0 && (
            <div className="flex gap-1 mb-3 flex-wrap">
              {topFacilities.map(fac => (
                <span key={fac} className="text-xs bg-background text-secondary-text px-2 py-1 rounded-lg border border-border">
                  {FACILITY_ICONS[fac] || '•'} {fac}
                </span>
              ))}
            </div>
          )}

          {/* Price */}
          <div className="flex items-center justify-between pt-3 border-t border-border">
            <div>
              <p className="text-xs text-secondary-text">Mulai dari</p>
              <p className="text-base font-bold text-primary">{formatCurrencyShort(property.price_min)}</p>
            </div>
            <span className="text-xs text-secondary-text bg-background px-2 py-1 rounded-lg border border-border">
              Lihat Detail →
            </span>
          </div>
        </div>
      </div>
    </Link>
  )
}
