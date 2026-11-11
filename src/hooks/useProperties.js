import { useState, useEffect, useCallback } from 'react'
import { getProperties } from '../services/propertyService'
import { sortProperties } from '../utils/propertySorting'

export function useProperties(filters = {}) {
  const [properties, setProperties] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [count, setCount] = useState(0)
  const [page, setPage] = useState(1)

  const fetchProperties = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const { data, count: total } = await getProperties({ ...filters, page })
      const sorted = sortProperties(data, filters.sort_by)
      setProperties(sorted)
      setCount(total)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }, [JSON.stringify(filters), page])

  useEffect(() => {
    fetchProperties()
  }, [fetchProperties])

  return { properties, loading, error, count, page, setPage, refetch: fetchProperties }
}
