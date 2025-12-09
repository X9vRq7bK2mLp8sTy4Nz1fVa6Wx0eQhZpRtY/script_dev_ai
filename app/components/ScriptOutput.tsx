'use client'

import React, { useState } from 'react'

interface ScriptOutputProps {
    content: string
    isLoading?: boolean
}

export default function ScriptOutput({ content, isLoading }: ScriptOutputProps) {
    const [copied, setCopied] = useState(false)

    const copyToClipboard = async () => {
        try {
            await navigator.clipboard.writeText(content)
            setCopied(true)
            setTimeout(() => setCopied(false), 2000)
        } catch (err) {
            console.error('Failed to copy:', err)
        }
    }

    if (isLoading) {
        return (
            <div className="output-container">
                <div className="loading-state">
                    <div className="spinner"></div>
                    <p>AI is analyzing your dependencies and generating optimized code...</p>
                </div>

                <style jsx>{`
          .output-container {
            margin-top: var(--spacing-xl);
          }

          .loading-state {
            text-align: center;
            padding: var(--spacing-2xl);
            background: var(--glass-bg);
            backdrop-filter: blur(12px);
            border: 1px solid var(--glass-border);
            border-radius: var(--radius-xl);
          }

          .loading-state p {
            margin-top: var(--spacing-lg);
            color: var(--color-text-secondary);
            font-size: 1rem;
          }
        `}</style>
            </div>
        )
    }

    if (!content) {
        return null
    }

    return (
        <div className="output-container">
            <div className="output-header">
                <h3>Generated Script</h3>
                <button onClick={copyToClipboard} className="copy-btn">
                    {copied ? '✓ Copied!' : '📋 Copy'}
                </button>
            </div>

            <div className="output-content">
                <pre><code>{content}</code></pre>
            </div>

            <style jsx>{`
        .output-container {
          margin-top: var(--spacing-xl);
          animation: slideUp 0.4s ease;
        }

        .output-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: var(--spacing-md);
        }

        .output-header h3 {
          margin: 0;
          font-size: 1.5rem;
          background: linear-gradient(135deg, var(--color-accent-primary), var(--color-accent-secondary));
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        .copy-btn {
          padding: var(--spacing-sm) var(--spacing-lg);
          background: var(--color-accent-primary);
          color: white;
          border: none;
          border-radius: var(--radius-md);
          font-weight: 600;
          cursor: pointer;
          transition: all var(--transition-normal);
          font-size: 0.875rem;
        }

        .copy-btn:hover {
          background: var(--color-accent-secondary);
          transform: translateY(-2px);
          box-shadow: var(--shadow-lg);
        }

        .output-content {
          background: var(--color-bg-secondary);
          border: 1px solid var(--color-border);
          border-radius: var(--radius-lg);
          padding: var(--spacing-lg);
          max-height: 600px;
          overflow: auto;
        }

        .output-content pre {
          margin: 0;
          font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', monospace;
          font-size: 0.875rem;
          line-height: 1.6;
        }

        .output-content code {
          color: var(--color-text-primary);
          display: block;
          white-space: pre-wrap;
          word-wrap: break-word;
        }
      `}</style>
        </div>
    )
}
