import { supabase, isSupabaseConfigured } from '../lib/supabase'
import { mockDb } from './mockStore'

const PROPERTY_SELECT = `
  *,
  rooms(*),
  property_images(*),
  property_facilities(facility_id, facilities(id, name)),
  users!properties_owner_id_fkey(id, full_name, phone, profile_image)
`

export async function getProperties({
  search = '',
  gender_type = '',
  price_min = null,
  price_max = null,
  facilities = [],
  sort_by = 'default',
  page = 1,
  per_page = 12,
} = {}) {
  if (isSupabaseConfigured()) {
    try {
      let query = supabase.from('properties').select(PROPERTY_SELECT, { count: 'exact' })
      if (search) {
        query = query.or(`name.ilike.%${search}%,address.ilike.%${search}%,area.ilike.%${search}%`)
      }
      if (gender_type && gender_type !== 'all') {
        query = query.eq('gender_type', gender_type.toUpperCase())
      }
      if (price_min !== null) {
        query = query.gte('price_min', price_min)
      }
      if (price_max !== null) {
        query = query.lte('price_min', price_max)
      }
      const from = (page - 1) * per_page
      const to = from + per_page - 1
      query = query.range(from, to)

      const { data, error, count } = await query
      if (!error && data) {
        return { data: data || [], count: count || 0 }
      }
    } catch (e) {
      console.warn('Supabase fetch failed, falling back to mock database:', e.message)
    }
  }

  // Fallback to local mock database
  let all = mockDb.getProperties()

  if (search) {
    const q = search.toLowerCase()
    all = all.filter(p =>
      p.name?.toLowerCase().includes(q) ||
      p.address?.toLowerCase().includes(q) ||
      p.area?.toLowerCase().includes(q)
    )
  }

  if (gender_type && gender_type !== 'all') {
    all = all.filter(p => p.gender_type === gender_type.toUpperCase())
  }

  if (price_min !== null && price_min !== undefined && price_min !== '') {
    all = all.filter(p => p.price_min === null || p.price_min >= Number(price_min))
  }

  if (price_max !== null && price_max !== undefined && price_max !== '') {
    all = all.filter(p => p.price_min === null || p.price_min <= Number(price_max))
  }

  if (facilities && facilities.length > 0) {
    all = all.filter(p => {
      const pFacs = p.property_facilities?.map(pf => pf.facilities?.name) || []
      return facilities.every(f => pFacs.includes(f))
    })
  }

  const total = all.length
  const from = (page - 1) * per_page
  const paginated = all.slice(from, from + per_page)

  return { data: paginated, count: total }
}

export async function getPropertyById(id) {
  if (isSupabaseConfigured()) {
    try {
      const { data, error } = await supabase
        .from('properties')
        .select(PROPERTY_SELECT)
        .eq('id', id)
        .single()
      if (!error && data) return data
    } catch (e) {
      console.warn('Supabase getPropertyById failed, using mock data')
    }
  }

  const all = mockDb.getProperties()
  const found = all.find(p => p.id === id)
  if (!found) throw new Error('Property not found')
  return found
}

export async function getOwnerProperties(ownerId) {
  if (isSupabaseConfigured()) {
    try {
      const { data, error } = await supabase
        .from('properties')
        .select(PROPERTY_SELECT)
        .eq('owner_id', ownerId)
        .order('created_at', { ascending: false })
      if (!error && data) return data
    } catch (e) {
      console.warn('Supabase getOwnerProperties failed, using mock data')
    }
  }

  const all = mockDb.getProperties()
  return all.filter(p => p.owner_id === ownerId || p.owner_id === 'owner-demo-1')
}

export async function createProperty(ownerId, propertyData) {
  if (isSupabaseConfigured()) {
    try {
      const { facilities, ...rest } = propertyData
      const { data, error } = await supabase
        .from('properties')
        .insert({ ...rest, owner_id: ownerId, listing_status: 'unconfirmed', data_source: 'owner' })
        .select()
        .single()
      if (!error && data) return data
    } catch (e) {
      console.warn('Supabase createProperty failed, using mock data')
    }
  }

  const all = mockDb.getProperties()
  const newProp = {
    ...propertyData,
    id: `kos-${Date.now()}`,
    owner_id: ownerId,
    rating_average: 0,
    review_count: 0,
    listing_status: 'available',
    data_source: 'owner',
    is_demo: false,
    created_at: new Date().toISOString(),
    property_images: [
      { id: `img-${Date.now()}`, image_url: 'https://images.unsplash.com/photo-1555854877-bab0e564b8d5?w=800&q=80', image_category: 'exterior' }
    ],
    rooms: [
      {
        id: `room-${Date.now()}`,
        property_id: `kos-${Date.now()}`,
        room_name: 'Kamar Standar',
        price: propertyData.price_min || 1000000,
        total_rooms: 5,
        available_rooms: 5,
        occupied_rooms: 0,
        availability_status: 'available'
      }
    ],
    property_facilities: (propertyData.facilities || []).map(fId => ({
      facility_id: fId,
      facilities: { id: fId, name: fId }
    }))
  }

  mockDb.saveProperties([newProp, ...all])
  return newProp
}

export async function updateProperty(propertyId, ownerId, updates) {
  if (isSupabaseConfigured()) {
    try {
      const { facilities, ...rest } = updates
      const { data, error } = await supabase
        .from('properties')
        .update(rest)
        .eq('id', propertyId)
        .select()
        .single()
      if (!error && data) return data
    } catch (e) {
      console.warn('Supabase updateProperty failed, using mock data')
    }
  }

  const all = mockDb.getProperties()
  const updated = all.map(p => {
    if (p.id === propertyId) {
      return { ...p, ...updates }
    }
    return p
  })
  mockDb.saveProperties(updated)
  return updated.find(p => p.id === propertyId)
}

export async function deleteProperty(propertyId, ownerId) {
  if (isSupabaseConfigured()) {
    try {
      await supabase.from('properties').delete().eq('id', propertyId)
    } catch (e) {
      console.warn('Supabase deleteProperty failed, using mock data')
    }
  }

  const all = mockDb.getProperties()
  mockDb.saveProperties(all.filter(p => p.id !== propertyId))
}

export async function uploadPropertyImage(propertyId, file, imageCategory = 'general') {
  const imageUrl = URL.createObjectURL(file)
  const all = mockDb.getProperties()
  const updated = all.map(p => {
    if (p.id === propertyId) {
      const images = p.property_images || []
      return {
        ...p,
        property_images: [...images, { id: `img-${Date.now()}`, image_url: imageUrl, image_category: imageCategory }]
      }
    }
    return p
  })
  mockDb.saveProperties(updated)
  return { image_url: imageUrl, image_category: imageCategory }
}

export async function deletePropertyImage(propertyId, imageId) {
  const all = mockDb.getProperties()
  const updated = all.map(p => {
    if (p.id === propertyId) {
      return {
        ...p,
        property_images: (p.property_images || []).filter(img => img.id !== imageId)
      }
    }
    return p
  })
  mockDb.saveProperties(updated)
}

export async function getFacilities() {
  return [
    { id: 'fac-1', name: 'WiFi' },
    { id: 'fac-2', name: 'AC' },
    { id: 'fac-3', name: 'Kamar Mandi Dalam' },
    { id: 'fac-4', name: 'Kamar Mandi Luar' },
    { id: 'fac-5', name: 'Kasur' },
    { id: 'fac-6', name: 'Lemari' },
    { id: 'fac-7', name: 'Meja Belajar' },
    { id: 'fac-8', name: 'Parkir' },
    { id: 'fac-9', name: 'Dapur' },
    { id: 'fac-10', name: 'Laundry' },
  ]
}

export async function getFeaturedProperties(limit = 6) {
  const all = mockDb.getProperties()
  return all
    .filter(p => p.listing_status !== 'unconfirmed')
    .sort((a, b) => (b.rating_average || 0) - (a.rating_average || 0))
    .slice(0, limit)
}

export async function getAvailableProperties(limit = 6) {
  const all = mockDb.getProperties()
  return all
    .filter(p => p.listing_status === 'available')
    .sort((a, b) => (a.price_min || 0) - (b.price_min || 0))
    .slice(0, limit)
}
