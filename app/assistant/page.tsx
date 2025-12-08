'use client'

import { useState, useRef, useEffect } from 'react'
import { useAuth } from '@/hooks/use-auth'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Send, Bot, User, Sparkles, Loader2 } from 'lucide-react'
import {
  processAssistantQuery,
  generateContextualSuggestions,
  type ChatMessage,
  type AssistantResponse,
} from '@/lib/assistant'
import { isAIAvailable } from '@/lib/ai'

export default function AssistantPage() {
  const { profile } = useAuth()
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [input, setInput] = useState('')
  const [isProcessing, setIsProcessing] = useState(false)
  const [aiEnabled, setAiEnabled] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    setAiEnabled(isAIAvailable())
    
    // Add welcome message
    if (profile) {
      const welcomeMessage: ChatMessage = {
        id: '0',
        userId: 'assistant',
        role: 'assistant',
        content: `Hello ${profile.displayName?.split(' ')[0] || 'there'}! I'm the Hidden Treasures Network AI Assistant. I can help you find mentors, resources, events, and answer questions about the platform. What would you like to know?`,
        timestamp: new Date(),
      }
      setMessages([welcomeMessage])
    }
  }, [profile])

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  const handleSendMessage = async (messageText?: string) => {
    const text = messageText || input
    if (!text.trim() || !profile) return

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      userId: (profile as any).uid || profile.id || 'user',
      role: 'user',
      content: text,
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, userMessage])
    setInput('')
    setIsProcessing(true)

    try {
      const response = await processAssistantQuery({
        query: text,
        userId: (profile as any).uid || profile.id || 'user',
        userRole: profile.role,
      })

      const assistantMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        userId: 'assistant',
        role: 'assistant',
        content: response.response,
        timestamp: new Date(),
        actionType: response.actionType,
        actionData: response.actionData,
      }

      setMessages((prev) => [...prev, assistantMessage])

      // Handle actions
      if (response.actionType === 'navigate' && response.actionData?.url) {
        // In a real app, you would use Next.js router here
        console.log('Navigate to:', response.actionData.url)
      }
    } catch (error) {
      console.error('Assistant error:', error)
      
      const errorMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        userId: 'assistant',
        role: 'assistant',
        content: "I'm sorry, I encountered an error processing your request. Please try again or rephrase your question.",
        timestamp: new Date(),
      }
      
      setMessages((prev) => [...prev, errorMessage])
    } finally {
      setIsProcessing(false)
    }
  }

  const handleSuggestionClick = (suggestion: string) => {
    setInput(suggestion)
    handleSendMessage(suggestion)
  }

  const suggestions = profile ? generateContextualSuggestions(profile) : []

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <Card className="mb-6 bg-gradient-to-r from-aviation-navy to-blue-900 text-white">
          <CardHeader>
            <CardTitle className="text-2xl flex items-center gap-3">
              <Bot className="h-8 w-8" />
              Ask the Network Assistant
            </CardTitle>
            <CardDescription className="text-gray-200">
              Get help finding resources, mentors, events, and more using natural language
              {!aiEnabled && (
                <Badge variant="secondary" className="ml-2 bg-white/20 text-white">
                  Pattern-matching mode
                </Badge>
              )}
              {aiEnabled && (
                <Badge variant="secondary" className="ml-2 bg-white/20 text-white">
                  <Sparkles className="h-3 w-3 mr-1" />
                  AI-powered
                </Badge>
              )}
            </CardDescription>
          </CardHeader>
        </Card>

        {/* Suggestions */}
        {messages.length <= 1 && suggestions.length > 0 && (
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="text-lg">Try asking...</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {suggestions.map((suggestion, index) => (
                  <Button
                    key={index}
                    variant="outline"
                    size="sm"
                    onClick={() => handleSuggestionClick(suggestion)}
                    className="text-sm"
                  >
                    {suggestion}
                  </Button>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Chat Messages */}
        <Card className="mb-6">
          <CardContent className="p-6">
            <div className="space-y-4 max-h-[500px] overflow-y-auto">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex gap-3 ${
                    message.role === 'user' ? 'justify-end' : 'justify-start'
                  }`}
                >
                  {message.role === 'assistant' && (
                    <div className="flex-shrink-0">
                      <div className="w-8 h-8 rounded-full bg-aviation-sky flex items-center justify-center">
                        <Bot className="h-5 w-5 text-white" />
                      </div>
                    </div>
                  )}
                  
                  <div
                    className={`max-w-[80%] rounded-lg p-4 ${
                      message.role === 'user'
                        ? 'bg-aviation-navy text-white'
                        : 'bg-gray-100 text-gray-900'
                    }`}
                  >
                    <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                    
                    {message.actionType && message.actionData && (
                      <div className="mt-2 pt-2 border-t border-gray-300">
                        <Badge variant="secondary" className="text-xs">
                          Action: {message.actionType}
                        </Badge>
                      </div>
                    )}
                    
                    <p className="text-xs opacity-70 mt-2">
                      {message.timestamp.toLocaleTimeString()}
                    </p>
                  </div>

                  {message.role === 'user' && (
                    <div className="flex-shrink-0">
                      <div className="w-8 h-8 rounded-full bg-aviation-gold flex items-center justify-center">
                        <User className="h-5 w-5 text-aviation-navy" />
                      </div>
                    </div>
                  )}
                </div>
              ))}

              {isProcessing && (
                <div className="flex gap-3 justify-start">
                  <div className="flex-shrink-0">
                    <div className="w-8 h-8 rounded-full bg-aviation-sky flex items-center justify-center">
                      <Bot className="h-5 w-5 text-white" />
                    </div>
                  </div>
                  <div className="bg-gray-100 rounded-lg p-4">
                    <Loader2 className="h-5 w-5 animate-spin text-gray-600" />
                  </div>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>
          </CardContent>
        </Card>

        {/* Input */}
        <Card>
          <CardContent className="p-4">
            <form
              onSubmit={(e) => {
                e.preventDefault()
                handleSendMessage()
              }}
              className="flex gap-3"
            >
              <Input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Type your question here..."
                disabled={isProcessing}
                className="flex-1"
              />
              <Button
                type="submit"
                disabled={!input.trim() || isProcessing}
                className="bg-aviation-navy hover:bg-aviation-navy/90"
              >
                {isProcessing ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Send className="h-4 w-4" />
                )}
              </Button>
            </form>
            
            <p className="text-xs text-gray-500 mt-2 text-center">
              The assistant can help with finding mentors, resources, events, reports, and navigation
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
