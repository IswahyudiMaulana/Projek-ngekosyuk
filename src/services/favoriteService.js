import { mockDb } from './mockStore'

export async function getCustomerFavorites(customerId) {
  const favs = mockDb.getFavorites()
  const allProps = mockDb.getProperties()
  return favs
    .filter(f => f.customer_id === customerId)
    .map(f => ({
      ...f,
      properties: allProps.find(p => p.id === f.property_id)
    }))
    .filter(f => !!f.properties)
}

export async function addFavorite(customerId, propertyId) {
  const favs = mockDb.getFavorites()
  if (!favs.some(f => f.customer_id === customerId && f.property_id === propertyId)) {
    const newFav = { id: `fav-${Date.now()}`, customer_id: customerId, property_id: propertyId }
    mockDb.saveFavorites([...favs, newFav])
    return newFav
  }
}

export async function removeFavorite(customerId, propertyId) {
  const favs = mockDb.getFavorites()
  mockDb.saveFavorites(favs.filter(f => !(f.customer_id === customerId && f.property_id === propertyId)))
}

export async function isFavorite(customerId, propertyId) {
  const favs = mockDb.getFavorites()
  return favs.some(f => f.customer_id === customerId && f.property_id === propertyId)
}

export async function toggleFavorite(customerId, propertyId) {
  const exists = await isFavorite(customerId, propertyId)
  if (exists) {
    await removeFavorite(customerId, propertyId)
    return false
  } else {
    await addFavorite(customerId, propertyId)
    return true
  }
}
