'use client'

import { useState, useRef, useEffect } from 'react'
import MessageBubble from './MessageBubble'
import ChatInput from './ChatInput'

interface ChatAreaProps {
    conversation: any
    messages: any[]
    onSendMessage: (message: string, files?: any[], errors?: string) => Promise<any>
    onShowDiff: () => void
}

export default function ChatArea({
    conversation,
    messages,
    onSendMessage,
    onShowDiff
}: ChatAreaProps) {
    const [sending, setSending] = useState(false)
    const messagesEndRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        scrollToBottom()
    }, [messages])

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
    }

    const handleSend = async (message: string, files?: any[], errors?: string) => {
        setSending(true)
        try {
            await onSendMessage(message, files, errors)
        } finally {
            setSending(false)
        }
    }

    if (!conversation) {
        return (
            <div className="chat-area-empty">
                <div className="empty-state">
                    <span className="empty-icon">💬</span>
                    <h2>No conversation selected</h2>
                    <p>Create a new chat or select an existing one from the sidebar</p>
                </div>

                <style jsx>{`
          .chat-area-empty {
            flex: 1;
            display: flex;
            align-items: center;
            justify-content: center;
            background: var(--color-bg-primary);
          }

          .empty-state {
            text-align: center;
          }

          .empty-icon {
            font-size: 4rem;
            display: block;
            margin-bottom: var(--spacing-lg);
            opacity: 0.5;
          }

          .empty-state h2 {
            margin-bottom: var(--spacing-sm);
          }

          .empty-state p {
            color: var(--color-text-tertiary);
          }
        `}</style>
            </div>
        )
    }

    return (
        <div className="chat-area">
            <div className="chat-header">
                <div className="conversation-info">
                    <span className="env-badge">
                        {conversation.environment === 'executor' ? '🔬 Executor' : '🎮 Studio'}
                    </span>
                    <h2>{conversation.title}</h2>
                </div>
                <button className="btn-diff" onClick={onShowDiff} title="View code changes">
                    📝 Diff
                </button>
            </div>

            <div className="messages-container">
                {messages.length === 0 && (
                    <div className="welcome-message">
                        <h3>Start a conversation</h3>
                        <p>Upload reference files, describe what you need, or report errors for AI to learn from.</p>
                    </div>
                )}

                {messages.map((message) => (
                    <MessageBubble key={message._id} message={message} />
                ))}

                <div ref={messagesEndRef} />
            </div>

            <ChatInput onSend={handleSend} disabled={sending} />

            <style jsx>{`
        .chat-area {
          display: flex;
          flex-direction: column;
          background: var(--color-bg-primary);
          height: 100vh;
        }

        .chat-header {
          padding: var(--spacing-lg);
          border-bottom: 1px solid var(--color-border);
          display: flex;
          justify-content: space-between;
          align-items: center;
          background: var(--color-bg-secondary);
        }

        .conversation-info {
          display: flex;
          align-items: center;
          gap: var(--spacing-md);
        }

        .env-badge {
          padding: var(--spacing-xs) var(--spacing-md);
          background: rgba(99, 102, 241, 0.1);
          border: 1px solid var(--color-accent-primary);
          border-radius: var(--radius-md);
          font-size: 0.875rem;
          color: var(--color-accent-primary);
          font-weight: 600;
        }

        .conversation-info h2 {
          margin: 0;
          font-size: 1.25rem;
        }

        .btn-diff {
          padding: var(--spacing-sm) var(--spacing-lg);
          background: var(--color-bg-elevated);
          border: 1px solid var(--color-border);
          border-radius: var(--radius-md);
          color: var(--color-text-primary);
          cursor: pointer;
          font-weight: 600;
          transition: all var(--transition-normal);
        }

        .btn-diff:hover {
          border-color: var(--color-accent-primary);
          background: rgba(99, 102, 241, 0.1);
        }

        .messages-container {
          flex: 1;
          overflow-y: auto;
          padding: var(--spacing-xl);
          display: flex;
          flex-direction: column;
          gap: var(--spacing-lg);
        }

        .welcome-message {
          text-align: center;
          padding: var(--spacing-2xl);
          color: var(--color-text-tertiary);
        }

        .welcome-message h3 {
          margin-bottom: var(--spacing-sm);
          color: var(--color-text-primary);
        }
      `}</style>
        </div>
    )
}
