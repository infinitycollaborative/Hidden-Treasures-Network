'use client'

import { useEffect, useState } from 'react'
import { MessageThread } from '@/types/message'
import { getThreadsForUser } from '@/lib/db-messages'
import { Card } from '@/components/ui/card'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { MessageSquare, Loader2 } from 'lucide-react'
import { useAuth } from '@/hooks/use-auth'
import { getUserProfile } from '@/lib/auth'
import { formatRelativeTime } from '@/lib/utils'
import Link from 'next/link'

interface MessageThreadListProps {
  selectedThreadId?: string
}

export function MessageThreadList({ selectedThreadId }: MessageThreadListProps) {
  const { user } = useAuth()
  const [threads, setThreads] = useState<MessageThread[]>([])
  const [loading, setLoading] = useState(true)
  const [participantNames, setParticipantNames] = useState<Record<string, string>>({})

  useEffect(() => {
    if (!user?.uid) return

    const loadThreads = async () => {
      try {
        const userThreads = await getThreadsForUser(user.uid)
        setThreads(userThreads)

        // Load participant names
        const names: Record<string, string> = {}
        for (const thread of userThreads) {
          const otherUserId = thread.participantIds.find(id => id !== user.uid)
          if (otherUserId && !names[otherUserId]) {
            try {
              const profile = await getUserProfile(otherUserId)
              names[otherUserId] = profile?.displayName || 'Unknown User'
            } catch (error) {
              console.error('Error loading participant:', error)
              names[otherUserId] = 'Unknown User'
            }
          }
        }
        setParticipantNames(names)
      } catch (error) {
        console.error('Error loading threads:', error)
      } finally {
        setLoading(false)
      }
    }

    loadThreads()
  }, [user?.uid])

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <Loader2 className="h-6 w-6 animate-spin text-aviation-sky" />
      </div>
    )
  }

  if (threads.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-8 text-center">
        <MessageSquare className="h-12 w-12 text-gray-400 mb-4" />
        <h3 className="text-lg font-semibold text-gray-900 mb-2">No messages yet</h3>
        <p className="text-gray-600">Start a conversation with a mentor or student.</p>
      </div>
    )
  }

  return (
    <div className="space-y-2">
      {threads.map((thread) => {
        const otherUserId = thread.participantIds.find(id => id !== user?.uid)
        const participantName = otherUserId ? participantNames[otherUserId] || 'Loading...' : 'Unknown'
        const isSelected = thread.id === selectedThreadId
        const initials = participantName.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)

        return (
          <Link key={thread.id} href={`/messages/${thread.id}`}>
            <Card 
              className={`p-4 cursor-pointer transition-colors hover:bg-gray-50 ${
                isSelected ? 'bg-aviation-sky/10 border-aviation-sky' : ''
              }`}
            >
              <div className="flex items-start gap-3">
                <Avatar>
                  <AvatarFallback>{initials}</AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1">
                    <h4 className="font-semibold text-gray-900 truncate">{participantName}</h4>
                    {thread.lastMessageAt && (
                      <span className="text-xs text-gray-500">
                        {formatRelativeTime(thread.lastMessageAt)}
                      </span>
                    )}
                  </div>
                  {thread.lastMessagePreview && (
                    <p className="text-sm text-gray-600 truncate">{thread.lastMessagePreview}</p>
                  )}
                </div>
              </div>
            </Card>
          </Link>
        )
      })}
    </div>
  )
}
