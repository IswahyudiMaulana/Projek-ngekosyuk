import { supabase } from '../lib/supabase'
import { mockDb } from './mockStore'

export async function getRoomsByProperty(propertyId) {
  const all = mockDb.getProperties()
  const prop = all.find(p => p.id === propertyId)
  return prop?.rooms || []
}

export async function createRoom(propertyId, roomData) {
  const all = mockDb.getProperties()
  const newRoom = {
    ...roomData,
    id: `room-${Date.now()}`,
    property_id: propertyId,
    occupied_rooms: (roomData.total_rooms || 1) - (roomData.available_rooms || 0),
    availability_status: (roomData.available_rooms || 0) > 0 ? 'available' : 'full',
    updated_at: new Date().toISOString()
  }

  const updated = all.map(p => {
    if (p.id === propertyId) {
      const rooms = [...(p.rooms || []), newRoom]
      const minPrice = Math.min(...rooms.map(r => r.price))
      const totalAvail = rooms.reduce((s, r) => s + (r.available_rooms || 0), 0)
      return {
        ...p,
        rooms,
        price_min: minPrice,
        listing_status: totalAvail > 0 ? 'available' : 'full'
      }
    }
    return p
  })

  mockDb.saveProperties(updated)
  return newRoom
}

export async function updateRoom(roomId, updates) {
  const all = mockDb.getProperties()
  let updatedRoom = null

  const updated = all.map(p => {
    if (p.rooms?.some(r => r.id === roomId)) {
      const rooms = p.rooms.map(r => {
        if (r.id === roomId) {
          const total = updates.total_rooms !== undefined ? updates.total_rooms : r.total_rooms
          const avail = updates.available_rooms !== undefined ? updates.available_rooms : r.available_rooms
          updatedRoom = {
            ...r,
            ...updates,
            occupied_rooms: Math.max(0, total - avail),
            availability_status: avail > 0 ? 'available' : 'full',
            updated_at: new Date().toISOString()
          }
          return updatedRoom
        }
        return r
      })
      const minPrice = Math.min(...rooms.map(r => r.price))
      const totalAvail = rooms.reduce((s, r) => s + (r.available_rooms || 0), 0)
      return {
        ...p,
        rooms,
        price_min: minPrice,
        listing_status: totalAvail > 0 ? 'available' : 'full'
      }
    }
    return p
  })

  mockDb.saveProperties(updated)
  return updatedRoom
}

export async function deleteRoom(roomId) {
  const all = mockDb.getProperties()
  const updated = all.map(p => {
    if (p.rooms?.some(r => r.id === roomId)) {
      const rooms = p.rooms.filter(r => r.id !== roomId)
      const minPrice = rooms.length > 0 ? Math.min(...rooms.map(r => r.price)) : null
      const totalAvail = rooms.reduce((s, r) => s + (r.available_rooms || 0), 0)
      return {
        ...p,
        rooms,
        price_min: minPrice,
        listing_status: totalAvail > 0 ? 'available' : 'full'
      }
    }
    return p
  })
  mockDb.saveProperties(updated)
}
