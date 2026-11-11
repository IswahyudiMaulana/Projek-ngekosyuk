import { useState, useEffect, useRef } from 'react'
import {
  getConversationMessages,
  sendMessage,
  markMessagesRead,
  subscribeToMessages,
} from '../services/chatService'

export function useChat(conversationId, currentUserId) {
  const [messages, setMessages] = useState([])
  const [loading, setLoading] = useState(true)
  const [sending, setSending] = useState(false)
  const [error, setError] = useState(null)
  const channelRef = useRef(null)

  useEffect(() => {
    if (!conversationId) return

    fetchMessages()

    // Subscribe to real-time
    channelRef.current = subscribeToMessages(conversationId, (payload) => {
      setMessages(prev => [...prev, payload.new])
    })

    return () => {
      if (channelRef.current) {
        channelRef.current.unsubscribe()
      }
    }
  }, [conversationId])

  const fetchMessages = async () => {
    setLoading(true)
    try {
      const data = await getConversationMessages(conversationId)
      setMessages(data)
      if (currentUserId) {
        await markMessagesRead(conversationId, currentUserId)
      }
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const send = async (message) => {
    if (!message.trim() || !currentUserId) return
    setSending(true)
    try {
      await sendMessage(conversationId, currentUserId, message)
    } catch (err) {
      setError(err.message)
    } finally {
      setSending(false)
    }
  }

  return { messages, loading, sending, error, send }
}
