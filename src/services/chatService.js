import { mockDb } from './mockStore'

export async function getOrCreateConversation(customerId, ownerId, propertyId) {
  const convs = mockDb.getConversations()
  const existing = convs.find(c =>
    c.customer_id === customerId &&
    c.owner_id === ownerId &&
    c.property_id === propertyId
  )
  if (existing) return existing

  const allProps = mockDb.getProperties()
  const users = mockDb.getUsers()
  const prop = allProps.find(p => p.id === propertyId)
  const customer = users.find(u => u.id === customerId) || { full_name: 'Customer' }
  const owner = users.find(u => u.id === ownerId) || { full_name: 'Pemilik Kos' }

  const newConv = {
    id: `conv-${Date.now()}`,
    customer_id: customerId,
    owner_id: ownerId,
    property_id: propertyId,
    created_at: new Date().toISOString(),
    properties: prop,
    customer,
    owner,
    messages: []
  }

  mockDb.saveConversations([newConv, ...convs])
  return newConv
}

export async function getUserConversations(userId, role) {
  const convs = mockDb.getConversations()
  return convs.filter(c => role === 'customer' ? c.customer_id === userId : (c.owner_id === userId || c.owner_id === 'owner-demo-1'))
}

export async function getConversationMessages(conversationId) {
  const convs = mockDb.getConversations()
  const conv = convs.find(c => c.id === conversationId)
  return conv?.messages || []
}

export async function sendMessage(conversationId, senderId, message) {
  const convs = mockDb.getConversations()
  const users = mockDb.getUsers()
  const sender = users.find(u => u.id === senderId) || { full_name: 'Pengguna' }

  const newMsg = {
    id: `msg-${Date.now()}`,
    conversation_id: conversationId,
    sender_id: senderId,
    message,
    created_at: new Date().toISOString(),
    is_read: false,
    users: sender,
  }

  const updatedConvs = convs.map(c => {
    if (c.id === conversationId) {
      return {
        ...c,
        messages: [...(c.messages || []), newMsg]
      }
    }
    return c
  })

  mockDb.saveConversations(updatedConvs)
  return newMsg
}

export async function markMessagesRead(conversationId, userId) {
  const convs = mockDb.getConversations()
  const updatedConvs = convs.map(c => {
    if (c.id === conversationId) {
      const messages = (c.messages || []).map(m => {
        if (m.sender_id !== userId) return { ...m, is_read: true }
        return m
      })
      return { ...c, messages }
    }
    return c
  })
  mockDb.saveConversations(updatedConvs)
}

export function subscribeToMessages(conversationId, callback) {
  // Simple listener
  return {
    unsubscribe() {}
  }
}

export async function getUnreadCount(userId) {
  const convs = mockDb.getConversations()
  let unread = 0
  convs.forEach(c => {
    (c.messages || []).forEach(m => {
      if (m.sender_id !== userId && !m.is_read) unread++
    })
  })
  return unread
}
