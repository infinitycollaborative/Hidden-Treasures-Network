'use client'

import { useEffect, useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { MessageSquare, Send, Users, Globe, Building2 } from 'lucide-react'
import { createAdminMessage, getAdminMessages } from '@/lib/db-adminMessages'
import { MessageAudience } from '@/types'

export default function CommunicationsPage() {
  const [messages, setMessages] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [showComposer, setShowComposer] = useState(false)
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    audience: 'network_wide' as MessageAudience,
    deliveryChannels: ['in_app'] as ('in_app' | 'email' | 'sms')[],
  })

  useEffect(() => {
    loadMessages()
  }, [])

  async function loadMessages() {
    try {
      setLoading(true)
      const data = await getAdminMessages({ limitCount: 50 })
      setMessages(data)
    } catch (error) {
      console.error('Error loading messages:', error)
    } finally {
      setLoading(false)
    }
  }

  async function handleSend() {
    try {
      // TODO: Replace with actual admin context from useAuth or similar
      // const { user, profile } = useAuth()
      // const senderId = user?.uid || ''
      // const senderName = profile?.displayName || 'Admin'
      await createAdminMessage({
        title: formData.title,
        content: formData.content,
        audience: formData.audience,
        deliveryChannels: formData.deliveryChannels,
        senderId: 'admin-user-id', // TODO: Get from auth context
        senderName: 'Admin User',  // TODO: Get from auth context
      })
      
      setShowComposer(false)
      setFormData({
        title: '',
        content: '',
        audience: 'network_wide',
        deliveryChannels: ['in_app'],
      })
      loadMessages()
    } catch (error) {
      console.error('Error sending message:', error)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-aviation-sky mx-auto mb-4"></div>
          <p className="text-gray-600">Loading communications...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-heading font-bold text-aviation-navy">
            Communications
          </h1>
          <p className="mt-2 text-gray-600">
            Broadcast messages to organizations and users
          </p>
        </div>
        <Button
          className="bg-aviation-navy"
          onClick={() => setShowComposer(!showComposer)}
        >
          <MessageSquare className="h-4 w-4 mr-2" />
          New Message
        </Button>
      </div>

      {/* Message Composer */}
      {showComposer && (
        <Card>
          <CardHeader>
            <CardTitle>Compose Message</CardTitle>
            <CardDescription>Send a broadcast message to the network</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Title
              </label>
              <input
                type="text"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-aviation-sky focus:border-transparent"
                value={formData.title}
                onChange={e => setFormData({ ...formData, title: e.target.value })}
                placeholder="Message title..."
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Audience
              </label>
              <select
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-aviation-sky focus:border-transparent"
                value={formData.audience}
                onChange={e =>
                  setFormData({ ...formData, audience: e.target.value as MessageAudience })
                }
              >
                <option value="network_wide">Network-Wide</option>
                <option value="country">Country-Specific</option>
                <option value="region">Region-Specific</option>
                <option value="organization">Organization-Specific</option>
                <option value="role_specific">Role-Specific</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Message Content
              </label>
              <textarea
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-aviation-sky focus:border-transparent"
                rows={6}
                value={formData.content}
                onChange={e => setFormData({ ...formData, content: e.target.value })}
                placeholder="Write your message..."
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Delivery Channels
              </label>
              <div className="space-y-2">
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={formData.deliveryChannels.includes('in_app')}
                    onChange={e => {
                      const channels = e.target.checked
                        ? [...formData.deliveryChannels, 'in_app']
                        : formData.deliveryChannels.filter(c => c !== 'in_app')
                      setFormData({ ...formData, deliveryChannels: channels as any })
                    }}
                  />
                  <span className="text-sm">In-App Notification</span>
                </label>
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={formData.deliveryChannels.includes('email')}
                    onChange={e => {
                      const channels = e.target.checked
                        ? [...formData.deliveryChannels, 'email']
                        : formData.deliveryChannels.filter(c => c !== 'email')
                      setFormData({ ...formData, deliveryChannels: channels as any })
                    }}
                  />
                  <span className="text-sm">Email</span>
                </label>
              </div>
            </div>

            <div className="flex gap-3 justify-end pt-4 border-t">
              <Button variant="outline" onClick={() => setShowComposer(false)}>
                Cancel
              </Button>
              <Button
                className="bg-aviation-sky"
                onClick={handleSend}
                disabled={!formData.title || !formData.content}
              >
                <Send className="h-4 w-4 mr-2" />
                Send Message
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Messages List */}
      <Card>
        <CardHeader>
          <CardTitle>Sent Messages</CardTitle>
          <CardDescription>Broadcast message history</CardDescription>
        </CardHeader>
        <CardContent>
          {messages.length === 0 ? (
            <p className="text-gray-500 text-center py-8">No messages sent yet</p>
          ) : (
            <div className="space-y-3">
              {messages.map(msg => (
                <div
                  key={msg.id}
                  className="flex items-start justify-between p-4 border border-gray-200 rounded-lg"
                >
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <MessageSquare className="h-4 w-4 text-aviation-sky" />
                      <h3 className="font-semibold">{msg.title}</h3>
                    </div>
                    <p className="text-sm text-gray-600 mb-2 line-clamp-2">{msg.content}</p>
                    <div className="flex items-center gap-4 text-xs text-gray-500">
                      <span className="flex items-center gap-1">
                        {msg.audience === 'network_wide' && <Globe className="h-3 w-3" />}
                        {msg.audience === 'country' && <Building2 className="h-3 w-3" />}
                        {msg.audience === 'role_specific' && <Users className="h-3 w-3" />}
                        {msg.audience.replace('_', ' ')}
                      </span>
                      <span>
                        {new Date((msg.createdAt as any)?.toDate()).toLocaleDateString()}
                      </span>
                      {msg.sentAt && (
                        <span className="text-green-600">✓ Sent</span>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
