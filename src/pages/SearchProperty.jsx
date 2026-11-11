import { useState, useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import { getProperties } from '../services/propertyService'
import { sortProperties } from '../utils/propertySorting'
import PropertyCard from '../components/PropertyCard'
import FilterSidebar from '../components/FilterSidebar'
import SearchBar from '../components/SearchBar'
import Loading from '../components/Loading'
import EmptyState from '../components/EmptyState'
import { MagnifyingGlassIcon, AdjustmentsHorizontalIcon } from '@heroicons/react/24/outline'

const PER_PAGE = 12

export default function SearchProperty() {
  const [searchParams, setSearchParams] = useSearchParams()
  const [properties, setProperties] = useState([])
  const [loading, setLoading] = useState(true)
  const [count, setCount] = useState(0)
  const [page, setPage] = useState(1)

  const filters = {
    search: searchParams.get('search') || '',
    gender_type: searchParams.get('gender') || '',
    price_min: searchParams.get('price_min') ? Number(searchParams.get('price_min')) : null,
    price_max: searchParams.get('price_max') ? Number(searchParams.get('price_max')) : null,
    facilities: searchParams.getAll('facility'),
    sort_by: searchParams.get('sort') || 'default',
  }

  useEffect(() => {
    setPage(1)
  }, [searchParams.toString()])

  useEffect(() => {
    fetchProperties()
  }, [searchParams.toString(), page])

  const fetchProperties = async () => {
    setLoading(true)
    try {
      const { data, count: total } = await getProperties({ ...filters, page, per_page: PER_PAGE })
      const sorted = sortProperties(data, filters.sort_by)
      setProperties(sorted)
      setCount(total)
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const handleFilterChange = (newFilters) => {
    const params = new URLSearchParams()
    if (newFilters.search) params.set('search', newFilters.search)
    if (newFilters.gender_type) params.set('gender', newFilters.gender_type)
    if (newFilters.price_min) params.set('price_min', newFilters.price_min)
    if (newFilters.price_max) params.set('price_max', newFilters.price_max)
    if (newFilters.facilities?.length > 0) {
      newFilters.facilities.forEach(f => params.append('facility', f))
    }
    if (newFilters.sort_by && newFilters.sort_by !== 'default') params.set('sort', newFilters.sort_by)
    setSearchParams(params)
  }

  const totalPages = Math.ceil(count / PER_PAGE)

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Page header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-primary-text mb-4">
          {filters.gender_type === 'PUTRA' && 'Kos Putra'}
          {filters.gender_type === 'PUTRI' && 'Kos Putri'}
          {filters.gender_type === 'CAMPUR' && 'Kos Campur'}
          {!filters.gender_type && 'Cari Kos'}
          {filters.search && ` - "${filters.search}"`}
        </h1>
        <SearchBar compact initialValues={filters} />
      </div>

      <div className="flex gap-6">
        {/* Sidebar */}
        <div className="w-64 flex-shrink-0">
          <FilterSidebar filters={filters} onFilterChange={handleFilterChange} />
        </div>

        {/* Results */}
        <div className="flex-1 min-w-0">
          {/* Results count + active filters */}
          <div className="flex items-center justify-between mb-5">
            <p className="text-secondary-text text-sm">
              {loading ? 'Mencari...' : `${count} kos ditemukan`}
            </p>
            {filters.gender_type && (
              <div className="flex gap-2">
                <span className={`text-xs px-3 py-1 rounded-full font-medium ${
                  filters.gender_type === 'PUTRA' ? 'badge-putra' :
                  filters.gender_type === 'PUTRI' ? 'badge-putri' : 'badge-campur'
                }`}>
                  {filters.gender_type === 'PUTRA' ? '👨 Kos Putra' :
                   filters.gender_type === 'PUTRI' ? '👩 Kos Putri' : '👥 Kos Campur'}
                </span>
              </div>
            )}
          </div>

          {loading ? (
            <Loading message="Mencari kos..." />
          ) : properties.length === 0 ? (
            <EmptyState
              icon={MagnifyingGlassIcon}
              title="Kos tidak ditemukan"
              description="Coba ubah kata kunci pencarian atau filter yang digunakan"
            />
          ) : (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                {properties.map(property => (
                  <PropertyCard key={property.id} property={property} />
                ))}
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex justify-center gap-2 mt-8">
                  {page > 1 && (
                    <button onClick={() => setPage(p => p - 1)} className="btn-secondary py-2 px-4 text-sm">
                      ← Sebelumnya
                    </button>
                  )}
                  {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
                    const p = i + 1
                    return (
                      <button
                        key={p}
                        onClick={() => setPage(p)}
                        className={`w-10 h-10 rounded-xl text-sm font-medium transition-colors ${
                          p === page ? 'bg-primary text-white' : 'bg-white text-secondary-text border border-border hover:border-primary/30'
                        }`}
                      >
                        {p}
                      </button>
                    )
                  })}
                  {page < totalPages && (
                    <button onClick={() => setPage(p => p + 1)} className="btn-secondary py-2 px-4 text-sm">
                      Berikutnya →
                    </button>
                  )}
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  )
}
