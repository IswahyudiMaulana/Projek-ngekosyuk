import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { MagnifyingGlassIcon, AdjustmentsHorizontalIcon } from '@heroicons/react/24/outline'

export default function SearchBar({ compact = false, initialValues = {} }) {
  const navigate = useNavigate()
  const [values, setValues] = useState({
    search: initialValues.search || '',
    gender_type: initialValues.gender_type || '',
    price_min: initialValues.price_min || '',
    price_max: initialValues.price_max || '',
  })

  const handleChange = (key, val) => setValues(prev => ({ ...prev, [key]: val }))

  const handleSearch = (e) => {
    e.preventDefault()
    const params = new URLSearchParams()
    if (values.search) params.set('search', values.search)
    if (values.gender_type) params.set('gender', values.gender_type)
    if (values.price_min) params.set('price_min', values.price_min)
    if (values.price_max) params.set('price_max', values.price_max)
    navigate(`/search?${params.toString()}`)
  }

  if (compact) {
    return (
      <form onSubmit={handleSearch} className="flex gap-2">
        <div className="relative flex-1">
          <MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-secondary-text" />
          <input
            type="text"
            value={values.search}
            onChange={e => handleChange('search', e.target.value)}
            placeholder="Cari kos di Bojongsoang..."
            className="input-field pl-10 py-2.5 text-sm"
          />
        </div>
        <button type="submit" className="btn-primary py-2.5 px-4 text-sm">
          Cari
        </button>
      </form>
    )
  }

  return (
    <form onSubmit={handleSearch} className="bg-white rounded-2xl shadow-hover border border-border p-2">
      <div className="flex flex-col md:flex-row gap-2">
        {/* Location search */}
        <div className="relative flex-1">
          <MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-secondary-text" />
          <input
            type="text"
            value={values.search}
            onChange={e => handleChange('search', e.target.value)}
            placeholder="Cari lokasi, nama kos, atau area..."
            className="w-full pl-10 pr-4 py-3 text-primary-text placeholder-secondary-text focus:outline-none rounded-xl bg-background text-sm"
          />
        </div>

        {/* Divider */}
        <div className="hidden md:block w-px bg-border self-stretch my-1" />

        {/* Gender type */}
        <select
          value={values.gender_type}
          onChange={e => handleChange('gender_type', e.target.value)}
          className="px-4 py-3 text-sm text-primary-text focus:outline-none rounded-xl bg-background md:w-40 cursor-pointer"
        >
          <option value="">Semua Tipe</option>
          <option value="PUTRA">Kos Putra</option>
          <option value="PUTRI">Kos Putri</option>
          <option value="CAMPUR">Kos Campur</option>
        </select>

        <div className="hidden md:block w-px bg-border self-stretch my-1" />

        {/* Price min */}
        <input
          type="number"
          value={values.price_min}
          onChange={e => handleChange('price_min', e.target.value)}
          placeholder="Harga min"
          className="px-4 py-3 text-sm text-primary-text placeholder-secondary-text focus:outline-none rounded-xl bg-background md:w-32"
        />

        <div className="hidden md:block w-px bg-border self-stretch my-1" />

        {/* Price max */}
        <input
          type="number"
          value={values.price_max}
          onChange={e => handleChange('price_max', e.target.value)}
          placeholder="Harga max"
          className="px-4 py-3 text-sm text-primary-text placeholder-secondary-text focus:outline-none rounded-xl bg-background md:w-32"
        />

        {/* Search button */}
        <button type="submit" className="btn-primary flex items-center gap-2 justify-center px-6">
          <MagnifyingGlassIcon className="w-5 h-5" />
          <span>Cari Kos</span>
        </button>
      </div>
    </form>
  )
}
