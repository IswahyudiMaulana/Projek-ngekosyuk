export default function Loading({ fullScreen = false, message = 'Memuat...' }) {
  if (fullScreen) {
    return (
      <div className="fixed inset-0 bg-background flex items-center justify-center z-50">
        <div className="text-center">
          <div className="inline-block w-10 h-10 border-4 border-primary/20 border-t-primary rounded-full animate-spin mb-4"></div>
          <p className="text-secondary-text text-sm">{message}</p>
        </div>
      </div>
    )
  }
  return (
    <div className="flex items-center justify-center py-12">
      <div className="text-center">
        <div className="inline-block w-8 h-8 border-4 border-primary/20 border-t-primary rounded-full animate-spin mb-3"></div>
        <p className="text-secondary-text text-sm">{message}</p>
      </div>
    </div>
  )
}
