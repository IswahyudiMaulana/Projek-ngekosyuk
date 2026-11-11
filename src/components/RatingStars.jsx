import { StarIcon } from '@heroicons/react/24/solid'
import { StarIcon as StarOutline } from '@heroicons/react/24/outline'

export default function RatingStars({ rating = 0, max = 5, size = 'sm', showValue = true }) {
  const sizeClass = {
    xs: 'w-3 h-3',
    sm: 'w-4 h-4',
    md: 'w-5 h-5',
    lg: 'w-6 h-6',
  }[size] || 'w-4 h-4'

  return (
    <div className="flex items-center gap-1">
      <div className="flex gap-0.5">
        {Array.from({ length: max }, (_, i) => {
          const filled = i < Math.floor(rating)
          const half = !filled && i < rating
          return (
            <StarIcon
              key={i}
              className={`${sizeClass} ${filled || half ? 'text-amber-400' : 'text-gray-200'}`}
            />
          )
        })}
      </div>
      {showValue && rating > 0 && (
        <span className="text-xs text-secondary-text font-medium ml-0.5">
          {rating.toFixed(1)}
        </span>
      )}
    </div>
  )
}

export function RatingInput({ value, onChange }) {
  return (
    <div className="flex gap-1">
      {[1, 2, 3, 4, 5].map(star => (
        <button
          key={star}
          type="button"
          onClick={() => onChange(star)}
          className="transition-transform hover:scale-110 focus:outline-none"
        >
          <StarIcon
            className={`w-8 h-8 ${star <= value ? 'text-amber-400' : 'text-gray-200'}`}
          />
        </button>
      ))}
    </div>
  )
}
