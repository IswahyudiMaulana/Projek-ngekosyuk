import { useState, useRef, useEffect } from 'react'
import { useAuth } from '../hooks/useAuth'
import { useChat } from '../hooks/useChat'
import { formatDistanceToNow } from 'date-fns'
import { id } from 'date-fns/locale'
import { PaperAirplaneIcon } from '@heroicons/react/24/solid'
import Loading from './Loading'

export default function ChatWindow({ conversation }) {
  const { profile } = useAuth()
  const { messages, loading, sending, send } = useChat(conversation?.id, profile?.id)
  const [text, setText] = useState('')
  const bottomRef = useRef(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const handleSend = async (e) => {
    e.preventDefault()
    if (!text.trim()) return
    await send(text)
    setText('')
  }

  if (!conversation) return (
    <div className="flex items-center justify-center h-full text-secondary-text text-sm">
      Pilih percakapan untuk mulai chat
    </div>
  )

  const other = profile?.role === 'customer' ? conversation.owner : conversation.customer
  const otherName = other?.full_name || 'Pengguna'

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="px-4 py-3 border-b border-border flex items-center gap-3 bg-white">
        {other?.profile_image ? (
          <img src={other.profile_image} alt={otherName} className="w-9 h-9 rounded-full object-cover" />
        ) : (
          <div className="w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center">
            <span className="text-primary font-bold text-sm">{otherName.charAt(0)}</span>
          </div>
        )}
        <div>
          <p className="font-semibold text-primary-text text-sm">{otherName}</p>
          {conversation.properties && (
            <p className="text-xs text-secondary-text truncate max-w-xs">
              {conversation.properties.name}
            </p>
          )}
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-background">
        {loading ? (
          <Loading message="Memuat percakapan..." />
        ) : messages.length === 0 ? (
          <div className="text-center text-secondary-text text-sm py-8">
            Belum ada pesan. Mulai percakapan!
          </div>
        ) : (
          messages.map(msg => {
            const isMe = msg.sender_id === profile?.id
            const timeAgo = msg.created_at
              ? formatDistanceToNow(new Date(msg.created_at), { addSuffix: true, locale: id })
              : ''
            return (
              <div key={msg.id} className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[75%] ${isMe ? 'items-end' : 'items-start'} flex flex-col gap-1`}>
                  <div className={`px-4 py-2.5 rounded-2xl text-sm leading-relaxed ${
                    isMe
                      ? 'bg-primary text-white rounded-br-sm'
                      : 'bg-white text-primary-text rounded-bl-sm border border-border shadow-sm'
                  }`}>
                    {msg.message}
                  </div>
                  <span className="text-xs text-secondary-text px-1">{timeAgo}</span>
                </div>
              </div>
            )
          })
        )}
        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <form onSubmit={handleSend} className="px-4 py-3 border-t border-border bg-white flex gap-2">
        <input
          type="text"
          value={text}
          onChange={e => setText(e.target.value)}
          placeholder="Ketik pesan..."
          className="input-field flex-1 py-2.5 text-sm"
          disabled={sending}
        />
        <button
          type="submit"
          disabled={!text.trim() || sending}
          className="w-10 h-10 rounded-xl bg-primary text-white flex items-center justify-center hover:bg-primary-700 transition-colors disabled:opacity-50 flex-shrink-0"
        >
          <PaperAirplaneIcon className="w-4 h-4" />
        </button>
      </form>
    </div>
  )
}
