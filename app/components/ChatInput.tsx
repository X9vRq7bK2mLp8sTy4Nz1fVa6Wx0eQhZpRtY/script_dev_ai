'use client'

import { useState, useRef } from 'react'
import FileUploader from './FileUploader'

interface ChatInputProps {
    onSend: (message: string, files?: any[], errors?: string) => Promise<void>
    disabled?: boolean
}

export default function ChatInput({ onSend, disabled }: ChatInputProps) {
    const [message, setMessage] = useState('')
    const [files, setFiles] = useState<any[]>([])
    const [errors, setErrors] = useState('')
    const [showErrorInput, setShowErrorInput] = useState(false)
    const textareaRef = useRef<HTMLTextAreaElement>(null)

    const handleSend = async () => {
        if (!message.trim() && files.length === 0) return

        await onSend(message, files, errors || undefined)
        setMessage('')
        setFiles([])
        setErrors('')
        setShowErrorInput(false)
    }

    const handleKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault()
            handleSend()
        }
    }

    return (
        <div className="chat-input">
            <FileUploader files={files} onChange={setFiles} maxFiles={5} />

            <div className="input-controls">
                <button
                    className={`btn-toggle-errors ${showErrorInput ? 'active' : ''}`}
                    onClick={() => setShowErrorInput(!showErrorInput)}
                    title="Report errors for AI learning"
                >
                    ⚠️ Report Errors
                </button>
            </div>

            {showErrorInput && (
                <div className="error-input-section">
                    <label>Paste Roblox errors here for AI to learn:</label>
                    <textarea
                        value={errors}
                        onChange={(e) => setErrors(e.target.value)}
                        placeholder="Paste error messages from Roblox here..."
                        rows={3}
                    />
                </div>
            )}

            <div className="message-input-area">
                <textarea
                    ref={textareaRef}
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder="Type your message... (Shift+Enter for new line)"
                    rows={3}
                    disabled={disabled}
                />
                <button
                    className="btn btn-primary send-btn"
                    onClick={handleSend}
                    disabled={disabled || (!message.trim() && files.length === 0)}
                >
                    {disabled ? (
                        <span className="spinner"></span>
                    ) : (
                        '⬆️'
                    )}
                </button>
            </div>

            <style jsx>{`
        .chat-input {
          border-top: 1px solid var(--color-border);
          background: var(--color-bg-secondary);
          padding: var(--spacing-lg);
          display: flex;
          flex-direction: column;
          gap: var(--spacing-md);
        }

        .input-controls {
          display: flex;
          gap: var(--spacing-sm);
        }

        .btn-toggle-errors {
          padding: var(--spacing-xs) var(--spacing-md);
          background: var(--color-bg-elevated);
          border: 1px solid var(--color-border);
          border-radius: var(--radius-md);
          color: var(--color-text-secondary);
          cursor: pointer;
          font-size: 0.875rem;
          font-weight: 600;
          transition: all var(--transition-normal);
        }

        .btn-toggle-errors:hover {
          border-color: var(--color-accent-warning);
          color: var(--color-accent-warning);
        }

        .btn-toggle-errors.active {
          background: rgba(245, 158, 11, 0.1);
          border-color: var(--color-accent-warning);
          color: var(--color-accent-warning);
        }

        .error-input-section {
          animation: slideDown 0.3s ease;
        }

        .error-input-section label {
          display: block;
          margin-bottom: var(--spacing-sm);
          font-size: 0.875rem;
          font-weight: 600;
          color: var(--color-text-secondary);
        }

        .error-input-section textarea {
          width: 100%;
          padding: var(--spacing-md);
          background: var(--color-bg-elevated);
          border: 1px solid rgba(245, 158, 11, 0.3);
          border-radius: var(--radius-md);
          color: var(--color-text-primary);
          font-family: 'Monaco', monospace;
          font-size: 0.875rem;
          resize: vertical;
        }

        .message-input-area {
          display: flex;
          gap: var(--spacing-md);
          align-items: flex-end;
        }

        .message-input-area textarea {
          flex: 1;
          padding: var(--spacing-md);
          background: var(--color-bg-elevated);
          border: 1px solid var(--color-border);
          border-radius: var(--radius-md);
          color: var(--color-text-primary);
          font-size: 1rem;
          resize: vertical;
          font-family: inherit;
          transition: all var(--transition-normal);
        }

        .message-input-area textarea:focus {
          outline: none;
          border-color: var(--color-accent-primary);
          box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.1);
        }

        .send-btn {
          width: 50px;
          height: 50px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 1.5rem;
          padding: 0;
          flex-shrink: 0;
        }

        .send-btn:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }
      `}</style>
        </div>
    )
}
