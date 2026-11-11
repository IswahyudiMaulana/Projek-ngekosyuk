import { useState, useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import { useAuth } from '../../hooks/useAuth'
import { getUserConversations } from '../../services/chatService'
import ChatWindow from '../../components/ChatWindow'
import Loading from '../../components/Loading'
import EmptyState from '../../components/EmptyState'
import { ChatBubbleLeftRightIcon } from '@heroicons/react/24/outline'

export default function CustomerMessages() {
  const { profile } = useAuth()
  const [searchParams] = useSearchParams()
  const [conversations, setConversations] = useState([])
  const [selected, setSelected] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (profile?.id) {
      getUserConversations(profile.id, 'customer').then(convs => {
        setConversations(convs)
        const convId = searchParams.get('conv')
        if (convId) {
          const found = convs.find(c => c.id === convId)
          if (found) setSelected(found)
        } else if (convs.length > 0) {
          setSelected(convs[0])
        }
      }).finally(() => setLoading(false))
    } else {
      setLoading(false)
    }
  }, [profile?.id, searchParams])

  if (loading) return <Loading message="Memuat percakapan..." />

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-primary-text">Pesan Saya</h1>
        <p className="text-sm text-secondary-text">Komunikasi langsung dengan pemilik kos</p>
      </div>

      {conversations.length === 0 ? (
        <EmptyState
          icon={ChatBubbleLeftRightIcon}
          title="Belum ada percakapan"
          description="Buka halaman kos mana saja dan klik 'Chat Internal Website' untuk mengirim pesan ke pemilik kos."
        />
      ) : (
        <div className="card overflow-hidden h-[580px] flex">
          <div className="w-80 border-r border-border flex-shrink-0 overflow-y-auto bg-white">
            {conversations.map(conv => {
              const lastMsg = conv.messages?.[conv.messages.length - 1]
              const owner = conv.owner
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
                    {owner?.profile_image ? (
                      <img src={owner.profile_image} alt={owner.full_name}
                        className="w-11 h-11 rounded-full object-cover flex-shrink-0" />
                    ) : (
                      <div className="w-11 h-11 rounded-full bg-primary/10 text-primary font-bold flex items-center justify-center flex-shrink-0">
                        {owner?.full_name?.charAt(0) || 'P'}
                      </div>
                    )}
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-primary-text text-sm truncate">{owner?.full_name || 'Pemilik Kos'}</p>
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
