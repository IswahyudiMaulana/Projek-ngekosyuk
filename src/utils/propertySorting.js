/**
 * Sort properties based on NgekosYuk priority rules:
 * 1. Available + confirmed first (cheapest to most expensive)
 * 2. Full rooms after available
 * 3. Unconfirmed last
 * 
 * @param {Array} properties
 * @param {string} sortBy - 'default'|'price_asc'|'price_desc'|'rating'|'newest'
 * @returns {Array}
 */
export function sortProperties(properties, sortBy = 'default') {
  const copy = [...properties]

  if (sortBy === 'price_asc') {
    return copy.sort((a, b) => {
      // null prices go to the end
      if (a.price_min === null && b.price_min === null) return 0
      if (a.price_min === null) return 1
      if (b.price_min === null) return -1
      return a.price_min - b.price_min
    })
  }

  if (sortBy === 'price_desc') {
    return copy.sort((a, b) => {
      if (a.price_min === null && b.price_min === null) return 0
      if (a.price_min === null) return 1
      if (b.price_min === null) return -1
      return b.price_min - a.price_min
    })
  }

  if (sortBy === 'rating') {
    return copy.sort((a, b) => {
      const ratingA = a.rating_average || 0
      const ratingB = b.rating_average || 0
      return ratingB - ratingA
    })
  }

  if (sortBy === 'newest') {
    return copy.sort((a, b) => {
      return new Date(b.created_at) - new Date(a.created_at)
    })
  }

  // Default: availability priority
  return copy.sort((a, b) => {
    const priorityMap = {
      'available': 0,
      'full': 1,
      'unconfirmed': 2,
    }
    
    const getListingPriority = (property) => {
      // Check room availability
      const hasAvailableRooms = property.rooms?.some(r => r.available_rooms > 0)
      
      if (property.listing_status === 'unconfirmed') return 2
      if (property.listing_status === 'full' || !hasAvailableRooms) return 1
      return 0
    }
    
    const priorityA = getListingPriority(a)
    const priorityB = getListingPriority(b)
    
    if (priorityA !== priorityB) return priorityA - priorityB
    
    // If same priority, sort by price ascending (nulls last)
    if (a.price_min === null && b.price_min === null) return 0
    if (a.price_min === null) return 1
    if (b.price_min === null) return -1
    return a.price_min - b.price_min
  })
}

/**
 * Get availability status label
 * @param {Object} property
 * @returns {{ label: string, type: 'available'|'full'|'unconfirmed' }}
 */
export function getAvailabilityStatus(property) {
  if (property.listing_status === 'unconfirmed') {
    return { label: 'Belum Dikonfirmasi', type: 'unconfirmed' }
  }
  
  const totalAvailable = property.rooms?.reduce((sum, r) => sum + (r.available_rooms || 0), 0) || 0
  
  if (property.listing_status === 'full' || totalAvailable === 0) {
    return { label: 'Penuh', type: 'full' }
  }
  
  return { label: `${totalAvailable} Kamar Tersedia`, type: 'available' }
}
