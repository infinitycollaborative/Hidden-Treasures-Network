'use client'

import { useEffect, useState, useRef } from 'react'
import { Message, MessageThread } from '@/types/message'
import { 
  subscribeToMessages, 
  markThreadRead 
} from '@/lib/db-messages'
import { getUserProfile } from '@/lib/auth'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Loader2 } from 'lucide-react'
import { useAuth } from '@/hooks/use-auth'
import { formatShortTime } from '@/lib/utils'
import { MessageInput } from './MessageInput'

// Delay for auto-scrolling to bottom when new messages arrive
const SCROLL_DELAY_MS = 100

interface MessageViewProps {
  threadId: string
  thread: MessageThread | null
}

export function MessageView({ threadId, thread }: MessageViewProps) {
  const { user } = useAuth()
  const [messages, setMessages] = useState<Message[]>([])
  const [loading, setLoading] = useState(true)
  const [otherUserName, setOtherUserName] = useState<string>('')
  const scrollRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!threadId || !user?.uid) return

    setLoading(true)

    // Subscribe to messages
    const unsubscribe = subscribeToMessages(threadId, (newMessages) => {
      setMessages(newMessages)
      setLoading(false)
      
      // Scroll to bottom when new messages arrive
      setTimeout(() => {
        if (scrollRef.current) {
          scrollRef.current.scrollTop = scrollRef.current.scrollHeight
        }
      }, SCROLL_DELAY_MS)
    })

    // Mark thread as read
    markThreadRead(threadId, user.uid)

    return () => unsubscribe()
  }, [threadId, user?.uid])

  useEffect(() => {
    if (!thread || !user?.uid) return

    // Load other participant's name
    const loadOtherUserName = async () => {
      const otherUserId = thread.participantIds.find(id => id !== user.uid)
      if (otherUserId) {
        try {
          const profile = await getUserProfile(otherUserId)
          setOtherUserName(profile?.displayName || 'Unknown User')
        } catch (error) {
          console.error('Error loading user:', error)
          setOtherUserName('Unknown User')
        }
      }
    }

    loadOtherUserName()
  }, [thread, user?.uid])

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <Loader2 className="h-8 w-8 animate-spin text-aviation-sky" />
      </div>
    )
  }

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="border-b p-4 bg-white">
        <h2 className="text-xl font-semibold text-gray-900">{otherUserName}</h2>
      </div>

      {/* Messages */}
      <div className="flex-1 p-4 overflow-y-auto" ref={scrollRef}>
        <div className="space-y-4">
          {messages.length === 0 ? (
            <div className="text-center text-gray-500 py-8">
              No messages yet. Start the conversation!
            </div>
          ) : (
            messages.map((message) => (
              <MessageBubble
                key={message.id}
                message={message}
                isOwn={message.senderId === user?.uid}
              />
            ))
          )}
        </div>
      </div>

      {/* Input */}
      <div className="border-t p-4 bg-white">
        <MessageInput threadId={threadId} />
      </div>
    </div>
  )
}

interface MessageBubbleProps {
  message: Message
  isOwn: boolean
}

function MessageBubble({ message, isOwn }: MessageBubbleProps) {
  return (
    <div className={`flex ${isOwn ? 'justify-end' : 'justify-start'}`}>
      <div className={`flex gap-2 max-w-[70%] ${isOwn ? 'flex-row-reverse' : 'flex-row'}`}>
        {!isOwn && (
          <Avatar className="h-8 w-8 mt-1">
            <AvatarFallback>
              <span className="text-xs">U</span>
            </AvatarFallback>
          </Avatar>
        )}
        <div>
          <div
            className={`px-4 py-2 rounded-lg ${
              isOwn
                ? 'bg-aviation-sky text-white'
                : 'bg-gray-100 text-gray-900'
            }`}
          >
            <p className="text-sm whitespace-pre-wrap break-words">{message.body}</p>
          </div>
          <div className={`text-xs text-gray-500 mt-1 ${isOwn ? 'text-right' : 'text-left'}`}>
            {formatShortTime(message.createdAt)}
          </div>
        </div>
      </div>
    </div>
  )
}
