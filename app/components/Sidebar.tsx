'use client'

import { useState } from 'react'
import EnvironmentSelector from './EnvironmentSelector'

interface SidebarProps {
    user: any
    conversations: any[]
    currentConversation: any
    onSelectConversation: (id: string) => void
    onCreateConversation: (title: string, environment: 'executor' | 'studio') => void
    onLogout: () => void
}

export default function Sidebar({
    user,
    conversations,
    currentConversation,
    onSelectConversation,
    onCreateConversation,
    onLogout
}: SidebarProps) {
    const [showNewChat, setShowNewChat] = useState(false)
    const [newTitle, setNewTitle] = useState('')
    const [newEnvironment, setNewEnvironment] = useState<'executor' | 'studio'>('executor')

    const handleCreate = () => {
        if (newTitle.trim()) {
            onCreateConversation(newTitle, newEnvironment)
            setNewTitle('')
            setShowNewChat(false)
        }
    }

    return (
        <div className="sidebar">
            <div className="sidebar-header">
                <div className="logo">
                    <span className="logo-icon">🎮</span>
                    <span className="logo-text">Script Dev AI</span>
                </div>
                <button className="btn-new-chat" onClick={() => setShowNewChat(!showNewChat)}>
                    + New Chat
                </button>
            </div>

            {showNewChat && (
                <div className="new-chat-form">
                    <input
                        type="text"
                        placeholder="Chat title..."
                        value={newTitle}
                        onChange={(e) => setNewTitle(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && handleCreate()}
                        autoFocus
                    />
                    <EnvironmentSelector value={newEnvironment} onChange={setNewEnvironment} />
                    <div className="form-actions">
                        <button className="btn btn-secondary" onClick={() => setShowNewChat(false)}>
                            Cancel
                        </button>
                        <button className="btn btn-primary" onClick={handleCreate}>
                            Create
                        </button>
                    </div>
                </div>
            )}

            <div className="conversations-list">
                {conversations.map((conv) => (
                    <div
                        key={conv._id}
                        className={`conversation-item ${currentConversation?._id === conv._id ? 'active' : ''}`}
                        onClick={() => onSelectConversation(conv._id)}
                    >
                        <div className="conversation-header">
                            <span className="conversation-icon">
                                {conv.environment === 'executor' ? '🔬' : '🎮'}
                            </span>
                            <span className="conversation-title">{conv.title}</span>
                        </div>
                        <div className="conversation-meta">
                            <span className="message-count">{conv.metadata.totalMessages || 0} messages</span>
                        </div>
                    </div>
                ))}
            </div>

            <div className="sidebar-footer">
                <div className="user-info">
                    <span className="user-icon">👤</span>
                    <span className="username">{user?.username}</span>
                </div>
                <button className="btn-logout" onClick={onLogout} title="Logout">
                    🚪
                </button>
            </div>

            <style jsx>{`
        .sidebar {
          background: var(--color-bg-secondary);
          border-right: 1px solid var(--color-border);
          display: flex;
          flex-direction: column;
          height: 100vh;
        }

        .sidebar-header {
          padding: var(--spacing-lg);
          border-bottom: 1px solid var(--color-border);
        }

        .logo {
          display: flex;
          align-items: center;
          gap: var(--spacing-sm);
          margin-bottom: var(--spacing-md);
        }

        .logo-icon {
          font-size: 1.5rem;
        }

        .logo-text {
          font-weight: 700;
          font-size: 1.125rem;
          background: linear-gradient(135deg, var(--color-accent-primary), var(--color-accent-secondary));
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }

        .btn-new-chat {
          width: 100%;
          padding: var(--spacing-md);
          background: var(--color-accent-primary);
          color: white;
          border: none;
          border-radius: var(--radius-md);
          font-weight: 600;
          cursor: pointer;
          transition: all var(--transition-normal);
        }

        .btn-new-chat:hover {
          background: var(--color-accent-secondary);
          transform: translateY(-2px);
        }

        .new-chat-form {
          padding: var(--spacing-lg);
          background: var(--color-bg-elevated);
          border-bottom: 1px solid var(--color-border);
          display: flex;
          flex-direction: column;
          gap: var(--spacing-md);
          animation: slideDown 0.3s ease;
        }

        .new-chat-form input {
          padding: var(--spacing-sm);
          background: var(--color-bg-secondary);
          border: 1px solid var(--color-border);
          border-radius: var(--radius-sm);
          color: var(--color-text-primary);
          font-size: 0.875rem;
        }

        .form-actions {
          display: flex;
          gap: var(--spacing-sm);
        }

        .form-actions button {
          flex: 1;
          padding: var(--spacing-sm);
          font-size: 0.875rem;
        }

        .conversations-list {
          flex: 1;
          overflow-y: auto;
          padding: var(--spacing-sm);
        }

        .conversation-item {
          padding: var(--spacing-md);
          margin-bottom: var(--spacing-sm);
          background: var(--color-bg-elevated);
          border: 1px solid var(--color-border);
          border-radius: var(--radius-md);
          cursor: pointer;
          transition: all var(--transition-fast);
        }

        .conversation-item:hover {
          border-color: var(--color-border-hover);
          background: var(--color-bg-tertiary);
        }

        .conversation-item.active {
          border-color: var(--color-accent-primary);
          background: rgba(99, 102, 241, 0.1);
        }

        .conversation-header {
          display: flex;
          align-items: center;
          gap: var(--spacing-sm);
          margin-bottom: var(--spacing-xs);
        }

        .conversation-icon {
          font-size: 1.25rem;
        }

        .conversation-title {
          font-weight: 600;
          color: var(--color-text-primary);
          font-size: 0.9375rem;
        }

        .conversation-meta {
          font-size: 0.75rem;
          color: var(--color-text-tertiary);
        }

        .sidebar-footer {
          padding: var(--spacing-md);
          border-top: 1px solid var(--color-border);
          display: flex;
          align-items: center;
          justify-content: space-between;
        }

        .user-info {
          display: flex;
          align-items: center;
          gap: var(--spacing-sm);
        }

        .user-icon {
          font-size: 1.25rem;
        }

        .username {
          font-size: 0.875rem;
          color: var(--color-text-secondary);
        }

        .btn-logout {
          background: transparent;
          border: none;
          font-size: 1.25rem;
          cursor: pointer;
          padding: var(--spacing-xs);
          border-radius: var(--radius-sm);
          transition: all var(--transition-fast);
        }

        .btn-logout:hover {
          background: rgba(239, 68, 68, 0.1);
        }
      `}</style>
        </div>
    )
}
