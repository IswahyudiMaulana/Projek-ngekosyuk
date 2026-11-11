import { ExclamationCircleIcon } from '@heroicons/react/24/outline'

export default function EmptyState({ 
  icon: Icon = ExclamationCircleIcon,
  title = 'Tidak ada data',
  description = '',
  action = null
}) {
  return (
    <div className="text-center py-16 px-4">
      <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-secondary/20 mb-4">
        <Icon className="w-8 h-8 text-secondary" />
      </div>
      <h3 className="text-lg font-semibold text-primary-text mb-2">{title}</h3>
      {description && <p className="text-secondary-text text-sm mb-6 max-w-md mx-auto">{description}</p>}
      {action && action}
    </div>
  )
}
