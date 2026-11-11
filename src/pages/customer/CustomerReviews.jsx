import { useState, useEffect } from 'react'
import { useAuth } from '../../hooks/useAuth'
import { getCustomerReviews } from '../../services/reviewService'
import { Link } from 'react-router-dom'
import RatingStars from '../../components/RatingStars'
import Loading from '../../components/Loading'
import EmptyState from '../../components/EmptyState'
import { StarIcon } from '@heroicons/react/24/outline'

export default function CustomerReviews() {
  const { profile } = useAuth()
  const [reviews, setReviews] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (profile?.id) {
      getCustomerReviews(profile.id)
        .then(setReviews)
        .finally(() => setLoading(false))
    } else {
      setLoading(false)
    }
  }, [profile?.id])

  if (loading) return <Loading message="Memuat ulasan..." />

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-primary-text">Riwayat Ulasan Saya</h1>
        <p className="text-sm text-secondary-text">Daftar penilaian kos yang telah Anda berikan</p>
      </div>

      {reviews.length === 0 ? (
        <EmptyState
          icon={StarIcon}
          title="Belum ada ulasan"
          description="Ulasan dapat diberikan setelah Anda menempati kamar dan diverifikasi oleh pemilik kos."
          action={
            <Link to="/search" className="btn-primary inline-flex">Cari Kos</Link>
          }
        />
      ) : (
        <div className="space-y-4">
          {reviews.map(review => {
            const coverImage = review.properties?.property_images?.[0]?.image_url
            return (
              <div key={review.id} className="card p-5">
                <div className="flex items-start gap-4">
                  {coverImage && (
                    <img src={coverImage} alt={review.properties?.name}
                      className="w-20 h-20 rounded-xl object-cover flex-shrink-0" />
                  )}
                  <div className="flex-1 min-w-0">
                    <Link to={`/property/${review.property_id}`}
                      className="font-bold text-primary hover:underline truncate block">
                      {review.properties?.name}
                    </Link>
                    <div className="flex items-center gap-2 mt-1">
                      <RatingStars rating={review.rating} size="sm" />
                      <span className="text-xs text-secondary-text">
                        {new Date(review.created_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}
                      </span>
                    </div>
                    {review.comment && (
                      <p className="text-sm text-primary-text mt-2 leading-relaxed">{review.comment}</p>
                    )}
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
