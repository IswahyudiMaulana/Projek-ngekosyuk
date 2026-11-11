import { useState } from 'react'
import { XMarkIcon, ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/outline'

const CATEGORY_LABELS = {
  exterior: 'Tampak Depan',
  bedroom: 'Kamar Tidur',
  bathroom: 'Kamar Mandi',
  kitchen: 'Dapur',
  parking: 'Parkir',
  common: 'Area Umum',
  environment: 'Lingkungan',
  general: 'Umum',
}

export default function PropertyGallery({ images = [] }) {
  const [lightboxIndex, setLightboxIndex] = useState(null)
  const [activeCategory, setActiveCategory] = useState('all')

  const categories = ['all', ...new Set(images.map(img => img.image_category || 'general'))]
  const filtered = activeCategory === 'all' ? images : images.filter(img => img.image_category === activeCategory)

  const openLightbox = (idx) => setLightboxIndex(idx)
  const closeLightbox = () => setLightboxIndex(null)
  const prevImage = () => setLightboxIndex(i => (i - 1 + filtered.length) % filtered.length)
  const nextImage = () => setLightboxIndex(i => (i + 1) % filtered.length)

  if (!images.length) return (
    <div className="bg-background rounded-2xl h-64 flex items-center justify-center">
      <p className="text-secondary-text">Belum ada foto tersedia</p>
    </div>
  )

  return (
    <div>
      {/* Category tabs */}
      {categories.length > 2 && (
        <div className="flex gap-2 mb-4 overflow-x-auto pb-2">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-colors flex-shrink-0 ${
                activeCategory === cat
                  ? 'bg-primary text-white'
                  : 'bg-background text-secondary-text border border-border hover:border-primary/30'
              }`}
            >
              {cat === 'all' ? 'Semua Foto' : CATEGORY_LABELS[cat] || cat}
            </button>
          ))}
        </div>
      )}

      {/* Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
        {filtered.map((img, idx) => (
          <div
            key={img.id || idx}
            className="relative aspect-square rounded-xl overflow-hidden cursor-pointer group"
            onClick={() => openLightbox(idx)}
          >
            <img
              src={img.image_url}
              alt={CATEGORY_LABELS[img.image_category] || 'Foto kos'}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              onError={e => { e.target.src = 'https://images.unsplash.com/photo-1555854877-bab0e564b8d5?w=400&q=80' }}
            />
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors" />
            {img.image_category && (
              <div className="absolute bottom-2 left-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <span className="text-xs bg-black/60 text-white px-2 py-1 rounded-full">
                  {CATEGORY_LABELS[img.image_category] || img.image_category}
                </span>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Lightbox */}
      {lightboxIndex !== null && (
        <div className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4"
          onClick={closeLightbox}>
          <button onClick={closeLightbox}
            className="absolute top-4 right-4 w-10 h-10 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center transition-colors z-10">
            <XMarkIcon className="w-6 h-6 text-white" />
          </button>

          {filtered.length > 1 && (
            <>
              <button onClick={e => { e.stopPropagation(); prevImage() }}
                className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center transition-colors z-10">
                <ChevronLeftIcon className="w-6 h-6 text-white" />
              </button>
              <button onClick={e => { e.stopPropagation(); nextImage() }}
                className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center transition-colors z-10">
                <ChevronRightIcon className="w-6 h-6 text-white" />
              </button>
            </>
          )}

          <img
            src={filtered[lightboxIndex]?.image_url}
            alt="Preview"
            className="max-w-full max-h-[85vh] object-contain rounded-xl"
            onClick={e => e.stopPropagation()}
          />

          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 text-white/70 text-sm">
            {lightboxIndex + 1} / {filtered.length}
            {filtered[lightboxIndex]?.image_category && (
              <span className="ml-2">• {CATEGORY_LABELS[filtered[lightboxIndex].image_category] || filtered[lightboxIndex].image_category}</span>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
