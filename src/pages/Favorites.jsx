import { useState, useEffect } from 'react'
import { useAuth } from '../hooks/useAuth'
import { getCustomerFavorites } from '../services/favoriteService'
import PropertyCard from '../components/PropertyCard'
import Loading from '../components/Loading'
import EmptyState from '../components/EmptyState'
import { HeartIcon } from '@heroicons/react/24/outline'
import { Link } from 'react-router-dom'

export default function Favorites() {
  const { profile, isAuthenticated } = useAuth()
  const [favorites, setFavorites] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (profile?.id) {
      getCustomerFavorites(profile.id)
        .then(favs => setFavorites(favs.map(f => f.properties).filter(Boolean)))
        .finally(() => setLoading(false))
    } else {
      setLoading(false)
    }
  }, [profile?.id])

  const handleFavChange = (propertyId, isFav) => {
    if (!isFav) {
      setFavorites(prev => prev.filter(p => p.id !== propertyId))
    }
  }

  if (loading) return <Loading message="Memuat kos favorit..." />

  if (!isAuthenticated) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center">
        <HeartIcon className="w-16 h-16 text-secondary mx-auto mb-4" />
        <h2 className="text-2xl font-bold text-primary-text mb-2">Simpan Kos Favoritmu</h2>
        <p className="text-secondary-text mb-6">Login atau buat akun customer untuk menyimpan daftar kos impianmu.</p>
        <Link to="/login" className="btn-primary inline-flex">Masuk ke Akun</Link>
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="mb-6">
        <h1 className="text-2xl md:text-3xl font-bold text-primary-text">Kos Favorit Saya</h1>
        <p className="text-secondary-text text-sm mt-1">
          {favorites.length} properti kos tersimpan dalam daftar favorit Anda
        </p>
      </div>

      {favorites.length === 0 ? (
        <EmptyState
          icon={HeartIcon}
          title="Belum ada kos favorit"
          description="Temukan kos impianmu di Bojongsoang dan klik ikon hati untuk menyimpannya di sini."
          action={
            <Link to="/search" className="btn-primary inline-flex">Cari Kos Sekarang</Link>
          }
        />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {favorites.map(property => (
            <PropertyCard
              key={property.id}
              property={property}
              isFav={true}
              onFavChange={handleFavChange}
            />
          ))}
        </div>
      )}
    </div>
  )
}
