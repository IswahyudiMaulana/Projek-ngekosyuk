import { mockDb } from './mockStore'

export async function getPropertyReviews(propertyId) {
  const all = mockDb.getReviews()
  return all.filter(r => r.property_id === propertyId)
}

export async function createReview(reviewData) {
  const all = mockDb.getReviews()
  const users = mockDb.getUsers()
  const author = users.find(u => u.id === reviewData.customer_id) || { full_name: 'Penghuni' }

  const newReview = {
    ...reviewData,
    id: `rev-${Date.now()}`,
    created_at: new Date().toISOString(),
    users: author,
  }

  const updatedReviews = [newReview, ...all]
  mockDb.saveReviews(updatedReviews)

  // Recalculate property rating
  const propReviews = updatedReviews.filter(r => r.property_id === reviewData.property_id)
  const avg = propReviews.reduce((s, r) => s + r.rating, 0) / propReviews.length

  const allProps = mockDb.getProperties()
  const updatedProps = allProps.map(p => {
    if (p.id === reviewData.property_id) {
      return {
        ...p,
        rating_average: Math.round(avg * 10) / 10,
        review_count: propReviews.length,
      }
    }
    return p
  })
  mockDb.saveProperties(updatedProps)

  return newReview
}

export async function getCustomerReviews(customerId) {
  const all = mockDb.getReviews()
  const allProps = mockDb.getProperties()
  return all
    .filter(r => r.customer_id === customerId)
    .map(r => ({
      ...r,
      properties: allProps.find(p => p.id === r.property_id)
    }))
}
