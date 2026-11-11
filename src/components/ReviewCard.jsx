import RatingStars from './RatingStars'
import { formatDistanceToNow } from 'date-fns'
import { id } from 'date-fns/locale'
import { ShieldCheckIcon } from '@heroicons/react/24/solid'

export default function ReviewCard({ review }) {
  const user = review.users
  const timeAgo = review.created_at
    ? formatDistanceToNow(new Date(review.created_at), { addSuffix: true, locale: id })
    : ''

  const aspects = [
    { key: 'cleanliness_rating', label: 'Kebersihan' },
    { key: 'comfort_rating', label: 'Kenyamanan' },
    { key: 'security_rating', label: 'Keamanan' },
    { key: 'facilities_rating', label: 'Fasilitas' },
    { key: 'environment_rating', label: 'Lingkungan' },
  ]

  return (
    <div className="card p-5">
      {/* Header */}
      <div className="flex items-start gap-3 mb-4">
        {user?.profile_image ? (
          <img src={user.profile_image} alt={user.full_name}
            className="w-10 h-10 rounded-full object-cover flex-shrink-0" />
        ) : (
          <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
            <span className="text-primary font-bold">
              {user?.full_name?.charAt(0)?.toUpperCase() || 'A'}
            </span>
          </div>
        )}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="font-semibold text-primary-text text-sm">
              {user?.full_name || 'Anonim'}
            </span>
            {review.verification_status === 'verified' && (
              <span className="inline-flex items-center gap-1 text-xs text-green-700 bg-green-50 px-2 py-0.5 rounded-full border border-green-200">
                <ShieldCheckIcon className="w-3 h-3" />
                Penghuni Terverifikasi
              </span>
            )}
          </div>
          <div className="flex items-center gap-2 mt-1">
            <RatingStars rating={review.rating} size="xs" showValue={false} />
            <span className="text-xs text-secondary-text">{timeAgo}</span>
          </div>
        </div>
        <div className="text-right flex-shrink-0">
          <span className="text-lg font-bold text-primary">{review.rating.toFixed(1)}</span>
          <span className="text-secondary-text text-xs">/5</span>
        </div>
      </div>

      {/* Comment */}
      {review.comment && (
        <p className="text-sm text-primary-text leading-relaxed mb-4">{review.comment}</p>
      )}

      {/* Aspect ratings */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-2 pt-3 border-t border-border">
        {aspects.map(({ key, label }) => review[key] && (
          <div key={key} className="text-center">
            <p className="text-xs text-secondary-text mb-1">{label}</p>
            <p className="font-semibold text-sm text-primary-text">{review[key]}/5</p>
          </div>
        ))}
      </div>
    </div>
  )
}
