import { useState, useEffect } from 'react'
import { useAuth } from '../../hooks/useAuth'
import { getOwnerProperties } from '../../services/propertyService'
import { getPropertyReviews } from '../../services/reviewService'
import ReviewCard from '../../components/ReviewCard'
import Loading from '../../components/Loading'
import EmptyState from '../../components/EmptyState'
import { StarIcon } from '@heroicons/react/24/outline'

export default function OwnerReviews() {
  const { profile } = useAuth()
  const [reviews, setReviews] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getOwnerProperties(profile?.id).then(async props => {
      if (props.length > 0) {
        const all = await Promise.all(props.map(p => getPropertyReviews(p.id)))
        setReviews(all.flat())
      }
    }).finally(() => setLoading(false))
  }, [profile?.id])

  if (loading) return <Loading message="Memuat ulasan..." />

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-primary-text">Ulasan & Rating Penghuni</h1>
        <p className="text-secondary-text text-sm">Evaluasi kepuasan penghuni terhadap kos Anda</p>
      </div>

      {reviews.length === 0 ? (
        <EmptyState
          icon={StarIcon}
          title="Belum ada ulasan masuk"
          description="Ulasan dari penghuni terverifikasi akan ditampilkan di sini."
        />
      ) : (
        <div className="space-y-4">
          {reviews.map(review => (
            <ReviewCard key={review.id} review={review} />
          ))}
        </div>
      )}
    </div>
  )
}
