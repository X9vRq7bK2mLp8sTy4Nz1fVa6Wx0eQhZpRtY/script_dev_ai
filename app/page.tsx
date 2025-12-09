'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Sidebar from './components/Sidebar'
import ChatArea from './components/ChatArea'
import DiffViewer from './components/DiffViewer'

export default function Home() {
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [user, setUser] = useState<any>(null)
  const [conversations, setConversations] = useState<any[]>([])
  const [currentConversation, setCurrentConversation] = useState<any>(null)
  const [messages, setMessages] = useState<any[]>([])
  const [showDiff, setShowDiff] = useState(false)
  const [latestCode, setLatestCode] = useState<string | null>(null)

  // Check auth on mount
  useEffect(() => {
    checkAuth()
  }, [])

  const checkAuth = async () => {
    try {
      const res = await fetch('/api/auth/me')
      if (!res.ok) {
        router.push('/login')
        return
      }

      const data = await res.json()
      setUser(data.user)
      await loadConversations()
      setLoading(false)
    } catch (error) {
      router.push('/login')
    }
  }

  const loadConversations = async () => {
    try {
      const res = await fetch('/api/conversations')
      const data = await res.json()
      setConversations(data.conversations || [])

      // Auto-select first conversation if available
      if (data.conversations?.length > 0 && !currentConversation) {
        await selectConversation(data.conversations[0]._id)
      }
    } catch (error) {
      console.error('Failed to load conversations:', error)
    }
  }

  const selectConversation = async (id: string) => {
    try {
      const res = await fetch(`/api/conversations/${id}`)
      const data = await res.json()

      setCurrentConversation(data.conversation)
      setMessages(data.messages || [])

      // Check if latest message has code for diff viewer
      const lastMsg = data.messages?.[data.messages.length - 1]
      if (lastMsg?.metadata?.generatedCode) {
        setLatestCode(lastMsg.metadata.generatedCode)
        setShowDiff(true)
      }
    } catch (error) {
      console.error('Failed to load conversation:', error)
    }
  }

  const createConversation = async (title: string, environment: 'executor' | 'studio') => {
    try {
      const res = await fetch('/api/conversations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title, environment })
      })

      const data = await res.json()
      await loadConversations()
      await selectConversation(data.conversation._id)
    } catch (error) {
      console.error('Failed to create conversation:', error)
    }
  }

  const sendMessage = async (message: string, files?: any[], errors?: string) => {
    try {
      const formData = new FormData()
      formData.append('message', message)

      if (errors) {
        formData.append('errors', errors)
      }

      if (files && files.length > 0) {
        formData.append('fileCount', files.length.toString())
        files.forEach((fileWithNotes, index) => {
          formData.append(`file_${index}`, fileWithNotes.file)
          formData.append(`notes_${index}`, fileWithNotes.notes || '')
        })
      } else {
        formData.append('fileCount', '0')
      }

      const res = await fetch(`/api/conversations/${currentConversation._id}/messages`, {
        method: 'POST',
        body: formData
      })

      const data = await res.json()

      // Reload conversation to get updated messages
      await selectConversation(currentConversation._id)

      return data.message
    } catch (error) {
      console.error('Failed to send message:', error)
      throw error
    }
  }

  const handleLogout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' })
    router.push('/login')
    router.refresh()
  }

  if (loading) {
    return (
      <div className="loading-screen">
        <div className="spinner"></div>
        <p>Loading...</p>

        <style jsx>{`
          .loading-screen {
            min-height: 100vh;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            gap: var(--spacing-lg);
          }
        `}</style>
      </div>
    )
  }

  return (
    <div className="app-container">
      <Sidebar
        user={user}
        conversations={conversations}
        currentConversation={currentConversation}
        onSelectConversation={selectConversation}
        onCreateConversation={createConversation}
        onLogout={handleLogout}
      />

      <ChatArea
        conversation={currentConversation}
        messages={messages}
        onSendMessage={sendMessage}
        onShowDiff={() => setShowDiff(!showDiff)}
      />

      {showDiff && latestCode && (
        <DiffViewer
          code={latestCode}
          onClose={() => setShowDiff(false)}
          onAccept={(code) => {
            console.log('Code accepted:', code)
            // TODO: Implement git commit
            setShowDiff(false)
          }}
          onReject={(reason) => {
            console.log('Code rejected:', reason)
            setShowDiff(false)
          }}
        />
      )}

      <style jsx>{`
        .app-container {
          display: grid;
          grid-template-columns: 280px 1fr ${showDiff ? '400px' : '0'};
          height: 100vh;
          overflow: hidden;
        }

        @media (max-width: 768px) {
          .app-container {
            grid-template-columns: ${showDiff ? '0 1fr 100%' : '280px 1fr'};
          }
        }
      `}</style>
    </div>
  )
}
