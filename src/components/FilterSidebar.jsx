import { useState } from 'react'
import { XMarkIcon, AdjustmentsHorizontalIcon } from '@heroicons/react/24/outline'

const FACILITIES_OPTIONS = [
  'WiFi', 'AC', 'Kamar Mandi Dalam', 'Kamar Mandi Luar',
  'Kasur', 'Lemari', 'Meja Belajar', 'Parkir', 'Dapur', 'Laundry'
]

const SORT_OPTIONS = [
  { value: 'default', label: 'Relevansi (Kamar Tersedia)' },
  { value: 'price_asc', label: 'Harga Termurah' },
  { value: 'price_desc', label: 'Harga Termahal' },
  { value: 'rating', label: 'Rating Tertinggi' },
  { value: 'newest', label: 'Terbaru' },
]

export default function FilterSidebar({ filters, onFilterChange }) {
  const [mobileOpen, setMobileOpen] = useState(false)

  const handleFacilityToggle = (facility) => {
    const current = filters.facilities || []
    const updated = current.includes(facility)
      ? current.filter(f => f !== facility)
      : [...current, facility]
    onFilterChange({ ...filters, facilities: updated })
  }

  const handleReset = () => {
    onFilterChange({
      search: filters.search || '',
      gender_type: '',
      price_min: '',
      price_max: '',
      facilities: [],
      sort_by: 'default',
    })
  }

  const hasActiveFilters = (filters.gender_type || filters.price_min || filters.price_max || (filters.facilities?.length > 0))

  const SidebarContent = () => (
    <div className="space-y-6">
      {/* Sorting */}
      <div>
        <h3 className="font-semibold text-primary-text mb-3 text-sm">Urutkan</h3>
        <div className="space-y-2">
          {SORT_OPTIONS.map(opt => (
            <label key={opt.value} className="flex items-center gap-2 cursor-pointer">
              <input
                type="radio"
                name="sort"
                value={opt.value}
                checked={(filters.sort_by || 'default') === opt.value}
                onChange={() => onFilterChange({ ...filters, sort_by: opt.value })}
                className="accent-primary w-4 h-4"
              />
              <span className="text-sm text-primary-text">{opt.label}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Gender type */}
      <div className="border-t border-border pt-6">
        <h3 className="font-semibold text-primary-text mb-3 text-sm">Tipe Kos</h3>
        <div className="space-y-2">
          {[
            { value: '', label: 'Semua Tipe' },
            { value: 'PUTRA', label: '👨 Kos Putra' },
            { value: 'PUTRI', label: '👩 Kos Putri' },
            { value: 'CAMPUR', label: '👥 Kos Campur' },
          ].map(opt => (
            <label key={opt.value} className="flex items-center gap-2 cursor-pointer">
              <input
                type="radio"
                name="gender"
                value={opt.value}
                checked={(filters.gender_type || '') === opt.value}
                onChange={() => onFilterChange({ ...filters, gender_type: opt.value })}
                className="accent-primary w-4 h-4"
              />
              <span className="text-sm text-primary-text">{opt.label}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Price range */}
      <div className="border-t border-border pt-6">
        <h3 className="font-semibold text-primary-text mb-3 text-sm">Rentang Harga / Bulan</h3>
        <div className="space-y-3">
          <div>
            <label className="text-xs text-secondary-text mb-1 block">Harga Minimum (Rp)</label>
            <input
              type="number"
              value={filters.price_min || ''}
              onChange={e => onFilterChange({ ...filters, price_min: e.target.value })}
              placeholder="Contoh: 400000"
              className="input-field text-sm py-2.5"
            />
          </div>
          <div>
            <label className="text-xs text-secondary-text mb-1 block">Harga Maksimum (Rp)</label>
            <input
              type="number"
              value={filters.price_max || ''}
              onChange={e => onFilterChange({ ...filters, price_max: e.target.value })}
              placeholder="Contoh: 1500000"
              className="input-field text-sm py-2.5"
            />
          </div>
        </div>
      </div>

      {/* Facilities */}
      <div className="border-t border-border pt-6">
        <h3 className="font-semibold text-primary-text mb-3 text-sm">Fasilitas</h3>
        <div className="space-y-2">
          {FACILITIES_OPTIONS.map(fac => (
            <label key={fac} className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={(filters.facilities || []).includes(fac)}
                onChange={() => handleFacilityToggle(fac)}
                className="accent-primary w-4 h-4 rounded"
              />
              <span className="text-sm text-primary-text">{fac}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Reset */}
      {hasActiveFilters && (
        <button
          onClick={handleReset}
          className="w-full btn-secondary text-sm py-2.5 flex items-center justify-center gap-2"
        >
          <XMarkIcon className="w-4 h-4" />
          Reset Filter
        </button>
      )}
    </div>
  )

  return (
    <>
      {/* Mobile toggle */}
      <div className="md:hidden mb-4">
        <button
          onClick={() => setMobileOpen(true)}
          className="flex items-center gap-2 btn-secondary text-sm py-2.5 px-4"
        >
          <AdjustmentsHorizontalIcon className="w-4 h-4" />
          Filter & Urutkan
          {hasActiveFilters && (
            <span className="w-5 h-5 bg-primary text-white text-xs rounded-full flex items-center justify-center">
              !
            </span>
          )}
        </button>
      </div>

      {/* Mobile drawer */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 md:hidden">
          <div className="absolute inset-0 bg-black/40" onClick={() => setMobileOpen(false)} />
          <div className="absolute right-0 top-0 h-full w-80 bg-white shadow-hover overflow-y-auto">
            <div className="flex items-center justify-between p-4 border-b border-border sticky top-0 bg-white">
              <h2 className="font-semibold text-primary-text">Filter & Urutkan</h2>
              <button onClick={() => setMobileOpen(false)}>
                <XMarkIcon className="w-5 h-5" />
              </button>
            </div>
            <div className="p-4">
              <SidebarContent />
            </div>
          </div>
        </div>
      )}

      {/* Desktop sidebar */}
      <div className="hidden md:block">
        <div className="card p-5 sticky top-24">
          <div className="flex items-center justify-between mb-5">
            <h2 className="font-semibold text-primary-text">Filter & Urutkan</h2>
            {hasActiveFilters && (
              <button onClick={handleReset} className="text-xs text-primary hover:underline">Reset</button>
            )}
          </div>
          <SidebarContent />
        </div>
      </div>
    </>
  )
}
