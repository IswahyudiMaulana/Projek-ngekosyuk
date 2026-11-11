import { useState, useEffect } from 'react'
import { useAuth } from '../../hooks/useAuth'
import { getUserConversations } from '../../services/chatService'
import ChatWindow from '../../components/ChatWindow'
import Loading from '../../components/Loading'
import EmptyState from '../../components/EmptyState'
import { ChatBubbleLeftRightIcon } from '@heroicons/react/24/outline'

export default function OwnerMessages() {
  const { profile } = useAuth()
  const [conversations, setConversations] = useState([])
  const [selected, setSelected] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getUserConversations(profile?.id, 'owner').then(convs => {
      setConversations(convs)
      if (convs.length > 0) setSelected(convs[0])
    }).finally(() => setLoading(false))
  }, [profile?.id])

  if (loading) return <Loading message="Memuat pesan masuk..." />

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-primary-text">Pesan Masuk</h1>
        <p className="text-secondary-text text-sm">Pertanyaan dan kesepakatan penyewaan dari calon penghuni</p>
      </div>

      {conversations.length === 0 ? (
        <EmptyState
          icon={ChatBubbleLeftRightIcon}
          title="Belum ada pesan masuk"
          description="Pesan dari pencari kos akan muncul di sini ketika mereka menghubungi properti Anda."
        />
      ) : (
        <div className="card overflow-hidden h-[580px] flex">
          <div className="w-80 border-r border-border flex-shrink-0 overflow-y-auto bg-white">
            {conversations.map(conv => {
              const lastMsg = conv.messages?.[conv.messages.length - 1]
              const customer = conv.customer
              const isSelected = selected?.id === conv.id
              return (
                <button
                  key={conv.id}
                  onClick={() => setSelected(conv)}
                  className={`w-full text-left p-4 border-b border-border/60 hover:bg-background transition-colors block ${
                    isSelected ? 'bg-primary/5 border-l-4 border-l-primary' : ''
                  }`}
                >
                  <div className="flex items-center gap-3">
                    {customer?.profile_image ? (
                      <img src={customer.profile_image} alt={customer.full_name}
                        className="w-11 h-11 rounded-full object-cover flex-shrink-0" />
                    ) : (
                      <div className="w-11 h-11 rounded-full bg-accent/20 text-accent font-bold flex items-center justify-center flex-shrink-0">
                        {customer?.full_name?.charAt(0) || 'C'}
                      </div>
                    )}
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-primary-text text-sm truncate">{customer?.full_name || 'Customer'}</p>
                      <p className="text-xs text-primary font-medium truncate">{conv.properties?.name}</p>
                      {lastMsg && (
                        <p className="text-xs text-secondary-text truncate mt-1">{lastMsg.message}</p>
                      )}
                    </div>
                  </div>
                </button>
              )
            })}
          </div>

          <div className="flex-1 bg-background flex flex-col">
            <ChatWindow conversation={selected} />
          </div>
        </div>
      )}
    </div>
  )
}
