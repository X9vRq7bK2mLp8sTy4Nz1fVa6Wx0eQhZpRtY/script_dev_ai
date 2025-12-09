'use client'

import { useState } from 'react'
import ReactMarkdown from 'react-markdown'
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter'
import { vscDarkPlus } from 'react-syntax-highlighter/dist/cjs/styles/prism'

interface MessageBubbleProps {
    message: any
}

export default function MessageBubble({ message }: MessageBubbleProps) {
    const [copied, setCopied] = useState(false)

    const copyCode = (code: string) => {
        navigator.clipboard.writeText(code)
        setCopied(true)
        setTimeout(() => setCopied(false), 2000)
    }

    const isUser = message.role === 'user'
    const hasCode = message.metadata?.generatedCode || message.content.includes('local ') || message.content.includes('--')

    return (
        <div className={`message-bubble ${isUser ? 'user' : 'assistant'}`}>
            <div className="message-header">
                <span className="message-role">
                    {isUser ? '👤 You' : '🤖 AI Assistant'}
                </span>
                <span className="message-time">
                    {new Date(message.timestamp).toLocaleTimeString()}
                </span>
            </div>

            <div className="message-content">
                {hasCode ? (
                    <div className="code-block">
                        <div className="code-header">
                            <span>Generated Script</span>
                            <button
                                className="copy-btn"
                                onClick={() => copyCode(message.metadata?.generatedCode || message.content)}
                            >
                                {copied ? '✓ Copied!' : '📋 Copy'}
                            </button>
                        </div>
                        <SyntaxHighlighter
                            language="lua"
                            style={vscDarkPlus}
                            customStyle={{
                                margin: 0,
                                borderRadius: '0 0 var(--radius-md) var(--radius-md)',
                                fontSize: '0.875rem'
                            }}
                        >
                            {message.metadata?.generatedCode || message.content}
                        </SyntaxHighlighter>
                    </div>
                ) : (
                    <ReactMarkdown className="markdown-content">{message.content}</ReactMarkdown>
                )}

                {message.metadata?.files && message.metadata.files.length > 0 && (
                    <div className="attached-files">
                        <p className="files-label">📎 Attached files:</p>
                        {message.metadata.files.map((file: any, i: number) => (
                            <div key={i} className="file-tag">
                                {file.filename}
                            </div>
                        ))}
                    </div>
                )}

                {message.metadata?.errors && (
                    <div className="error-feedback">
                        <p className="error-label">⚠️ Error reported:</p>
                        <code>{message.metadata.errors}</code>
                    </div>
                )}
            </div>

            <style jsx>{`
        .message-bubble {
          max-width: 80%;
          animation: slideUp 0.3s ease;
        }

        .message-bubble.user {
          align-self: flex-end;
        }

        .message-bubble.assistant {
          align-self: flex-start;
        }

        .message-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: var(--spacing-sm);
        }

        .message-role {
          font-weight: 600;
          font-size: 0.875rem;
          color: var(--color-text-secondary);
        }

        .message-time {
          font-size: 0.75rem;
          color: var(--color-text-muted);
        }

        .message-content {
          background: var(--color-bg-elevated);
          border: 1px solid var(--color-border);
          border-radius: var(--radius-lg);
          padding: var(--spacing-md);
        }

        .message-bubble.user .message-content {
          background: linear-gradient(135deg, rgba(99, 102, 241, 0.1), rgba(139, 92, 246, 0.1));
          border-color: rgba(99, 102, 241, 0.3);
        }

        .code-block {
          margin: calc(var(--spacing-md) * -1);
        }

        .code-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: var(--spacing-sm) var(--spacing-md);
          background: #1e1e1e;
          border-bottom: 1px solid var(--color-border);
          border-radius: var(--radius-md) var(--radius-md) 0 0;
        }

        .code-header span {
          font-size: 0.875rem;
          color: var(--color-text-secondary);
          font-weight: 600;
        }

        .copy-btn {
          padding: var(--spacing-xs) var(--spacing-sm);
          background: var(--color-accent-primary);
          color: white;
          border: none;
          border-radius: var(--radius-sm);
          cursor: pointer;
          font-size: 0.75rem;
          font-weight: 600;
          transition: all var(--transition-fast);
        }

        .copy-btn:hover {
          background: var(--color-accent-secondary);
        }

        .markdown-content {
          color: var(--color-text-primary);
          line-height: 1.6;
        }

        .markdown-content :global(p) {
          margin: 0 0 var(--spacing-sm) 0;
        }

        .markdown-content :global(code) {
          background: var(--color-bg-secondary);
          padding: 0.2em 0.4em;
          border-radius: var(--radius-sm);
          font-family: 'Monaco', monospace;
          font-size: 0.875em;
        }

        .attached-files {
          margin-top: var(--spacing-md);
          padding-top: var(--spacing-md);
          border-top: 1px solid var(--color-border);
        }

        .files-label {
          font-size: 0.875rem;
          font-weight: 600;
          margin-bottom: var(--spacing-sm);
          color: var(--color-text-secondary);
        }

        .file-tag {
          display: inline-block;
          padding: var(--spacing-xs) var(--spacing-sm);
          background: var(--color-bg-secondary);
          border: 1px solid var(--color-border);
          border-radius: var(--radius-sm);
          font-size: 0.75rem;
          margin-right: var(--spacing-xs);
          margin-bottom: var(--spacing-xs);
        }

        .error-feedback {
          margin-top: var(--spacing-md);
          padding: var(--spacing-md);
          background: rgba(239, 68, 68, 0.1);
          border: 1px solid rgba(239, 68, 68, 0.3);
          border-radius: var(--radius-md);
        }

        .error-label {
          font-size: 0.875rem;
          font-weight: 600;
          color: var(--color-accent-error);
          margin-bottom: var(--spacing-sm);
        }

        .error-feedback code {
          display: block;
          font-family: 'Monaco', monospace;
          font-size: 0.875rem;
          white-space: pre-wrap;
          word-wrap: break-word;
        }
      `}</style>
        </div>
    )
}
