'use client'

import { useEffect, useState } from 'react'
import { useAuth } from '@/hooks/use-auth'
import { MessageThreadList } from '@/components/messaging/MessageThreadList'
import { MessageView } from '@/components/messaging/MessageView'
import { getThreadById } from '@/lib/db-messages'
import { MessageThread } from '@/types/message'
import { Card } from '@/components/ui/card'
import { useRouter } from 'next/navigation'
import { Loader2 } from 'lucide-react'

export default function ThreadPage({ params }: { params: { threadId: string } }) {
  const { user, loading } = useAuth()
  const router = useRouter()
  const [thread, setThread] = useState<MessageThread | null>(null)
  const [loadingThread, setLoadingThread] = useState(true)

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login')
    }
  }, [user, loading, router])

  useEffect(() => {
    if (!params.threadId || !user) return

    const loadThread = async () => {
      try {
        const threadData = await getThreadById(params.threadId)
        
        // Verify user is a participant
        if (threadData && threadData.participantIds.includes(user.uid)) {
          setThread(threadData)
        } else {
          router.push('/messages')
        }
      } catch (error) {
        console.error('Error loading thread:', error)
        router.push('/messages')
      } finally {
        setLoadingThread(false)
      }
    }

    loadThread()
  }, [params.threadId, user, router])

  if (loading || loadingThread) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-aviation-sky" />
      </div>
    )
  }

  if (!user) {
    return null
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-heading font-bold text-aviation-navy mb-2">
            Messages
          </h1>
          <p className="text-gray-600">Connect with mentors and students</p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {/* Thread List */}
          <div className="md:col-span-1">
            <Card className="p-4">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Conversations</h2>
              <MessageThreadList selectedThreadId={params.threadId} />
            </Card>
          </div>

          {/* Message View */}
          <div className="md:col-span-2">
            <Card className="h-[calc(100vh-250px)]">
              <MessageView threadId={params.threadId} thread={thread} />
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
