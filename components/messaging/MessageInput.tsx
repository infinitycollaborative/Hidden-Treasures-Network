'use client'

import { useState } from 'react'
import { sendMessage } from '@/lib/db-messages'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Send, Loader2 } from 'lucide-react'
import { useAuth } from '@/hooks/use-auth'

interface MessageInputProps {
  threadId: string
}

export function MessageInput({ threadId }: MessageInputProps) {
  const { user } = useAuth()
  const [message, setMessage] = useState('')
  const [sending, setSending] = useState(false)

  const handleSend = async () => {
    if (!message.trim() || !user?.uid || sending) return

    setSending(true)
    try {
      await sendMessage(threadId, user.uid, message.trim())
      setMessage('')
    } catch (error) {
      console.error('Error sending message:', error)
      alert('Failed to send message. Please try again.')
    } finally {
      setSending(false)
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  return (
    <div className="flex gap-2">
      <Textarea
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        onKeyPress={handleKeyPress}
        placeholder="Type a message..."
        className="min-h-[60px] resize-none"
        disabled={sending}
      />
      <Button
        onClick={handleSend}
        disabled={!message.trim() || sending}
        className="bg-aviation-sky hover:bg-aviation-sky/90"
      >
        {sending ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : (
          <Send className="h-4 w-4" />
        )}
      </Button>
    </div>
  )
}
