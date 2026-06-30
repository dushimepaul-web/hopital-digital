import { useState } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCommentDots, faPaperPlane, faSearch, faSpinner } from '@fortawesome/free-solid-svg-icons'
import { Card, CardContent } from '@/components/ui/card'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { EmptyState } from '@/components/ui/loading'
import { useConversations, useMessages, useSendMessage } from '@/hooks/useApi'

export default function DoctorMessagesPage() {
  const [selectedConv, setSelectedConv] = useState<string | null>(null)
  const [newMessage, setNewMessage] = useState('')
  const { data: conversations } = useConversations()
  const { data: messages } = useMessages(selectedConv || '')
  const sendMessage = useSendMessage()

  const convList = Array.isArray(conversations) ? conversations : conversations?.data ?? []
  const msgList = Array.isArray(messages) ? messages : messages?.data ?? []

  const handleSend = () => {
    if (!newMessage.trim() || !selectedConv) return
    sendMessage.mutate(
      { conversationId: selectedConv, content: newMessage.trim() },
      { onSuccess: () => setNewMessage('') }
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Messages</h1>
        <p className="text-slate-500 mt-1">Communiquez avec vos patients</p>
      </div>

      <div className="grid lg:grid-cols-3 gap-6 h-[calc(100vh-16rem)]">
        <Card className="border-0 shadow-sm lg:col-span-1 overflow-hidden">
          <CardContent className="p-0">
            <div className="p-3 border-b">
              <div className="relative">
                <FontAwesomeIcon icon={faSearch} className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                <input
                  type="text"
                  placeholder="Rechercher..."
                  className="w-full pl-9 pr-3 py-2 rounded-lg bg-slate-50 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
              </div>
            </div>
            <div className="overflow-y-auto h-[calc(100%-4rem)]">
              {convList.length === 0 ? (
                <EmptyState icon={<FontAwesomeIcon icon={faCommentDots} className="h-6 w-6" />} title="Aucune conversation" description="Vos conversations avec les patients apparaîtront ici." />
              ) : (
                convList.map((conv: any) => (
                  <button
                    key={conv.id}
                    onClick={() => setSelectedConv(conv.id)}
                    className={`w-full flex items-center gap-3 p-3 hover:bg-slate-50 transition-colors text-left ${selectedConv === conv.id ? 'bg-primary-50' : ''}`}
                  >
                    <Avatar className="h-10 w-10 flex-shrink-0">
                      <AvatarFallback className="bg-primary-100 text-primary-700">
                        {conv.participantName?.[0] || '?'}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-slate-900 truncate">{conv.participantName || 'Patient'}</p>
                      <p className="text-xs text-slate-500 truncate">{conv.lastMessage || 'Dernier message...'}</p>
                    </div>
                  </button>
                ))
              )}
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-sm lg:col-span-2 flex flex-col">
          {!selectedConv ? (
            <div className="flex-1 flex items-center justify-center">
              <EmptyState icon={<FontAwesomeIcon icon={faCommentDots} className="h-8 w-8" />} title="Sélectionnez une conversation" description="Choisissez une conversation pour commencer." />
            </div>
          ) : (
            <>
              <div className="flex-1 overflow-y-auto p-4 space-y-3">
                {msgList.map((msg: any) => (
                  <div key={msg.id} className={`flex ${msg.isMine ? 'justify-end' : 'justify-start'}`}>
                    <div className={`max-w-[75%] rounded-2xl px-4 py-2.5 ${
                      msg.isMine ? 'bg-primary-600 text-white rounded-tr-sm' : 'bg-slate-100 text-slate-900 rounded-tl-sm'
                    }`}>
                      <p className="text-sm">{msg.content}</p>
                      <p className={`text-[10px] mt-1 ${msg.isMine ? 'text-primary-200' : 'text-slate-400'}`}>
                        {new Date(msg.createdAt).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="border-t p-3">
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                    placeholder="Votre message..."
                    className="flex-1 px-4 py-2.5 rounded-lg border border-input bg-white text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                  />
                  <Button size="icon" onClick={handleSend} disabled={!newMessage.trim() || sendMessage.isPending}>
                    {sendMessage.isPending ? <FontAwesomeIcon icon={faSpinner} className="h-4 w-4 animate-spin" /> : <FontAwesomeIcon icon={faPaperPlane} className="h-4 w-4" />}
                  </Button>
                </div>
              </div>
            </>
          )}
        </Card>
      </div>
    </div>
  )
}
