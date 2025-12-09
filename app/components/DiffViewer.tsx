'use client'

import { useState } from 'react'
import ReactDiffViewer from 'react-diff-viewer-continued'

interface DiffViewerProps {
    code: string
    onClose: () => void
    onAccept: (code: string) => void
    onReject: (reason: string) => void
}

export default function DiffViewer({ code, onClose, onAccept, onReject }: DiffViewerProps) {
    const [rejectionReason, setRejectionReason] = useState('')
    const [showRejectInput, setShowRejectInput] = useState(false)

    // For now, we'll show new code vs empty (since we don't have old code stored)
    // In a real implementation, you'd fetch the previous file content
    const oldCode = '-- Previous code will be shown here\n-- (Not yet implemented in this version)'
    const newCode = code

    const handleAccept = () => {
        onAccept(code)
    }

    const handleReject = () => {
        if (showRejectInput && rejectionReason.trim()) {
            onReject(rejectionReason)
        } else {
            setShowRejectInput(true)
        }
    }

    return (
        <div className="diff-viewer">
            <div className="diff-header">
                <h3>Code Changes</h3>
                <button className="close-btn" onClick={onClose}>✕</button>
            </div>

            <div className="diff-content">
                <ReactDiffViewer
                    oldValue={oldCode}
                    newValue={newCode}
                    splitView={true}
                    useDarkTheme={true}
                    leftTitle="Previous"
                    rightTitle="Generated"
                    styles={{
                        variables: {
                            dark: {
                                diffViewerBackground: '#1a1a26',
                                diffViewerColor: '#f9fafb',
                                addedBackground: '#10b9814d',
                                addedColor: '#f9fafb',
                                removedBackground: '#ef44444d',
                                removedColor: '#f9fafb',
                                wordAddedBackground: '#10b981',
                                wordRemovedBackground: '#ef4444',
                                addedGutterBackground: '#10b9813d',
                                removedGutterBackground: '#ef44443d',
                                gutterBackground: '#12121a',
                                gutterBackgroundDark: '#0a0a0f',
                                highlightBackground: '#6366f14d',
                                highlightGutterBackground: '#6366f13d',
                            },
                        },
                    }}
                />
            </div>

            {showRejectInput && (
                <div className="reject-input">
                    <textarea
                        value={rejection Reason}
                    onChange={(e) => setRejectionReason(e.target.value)}
                    placeholder="Why are you rejecting this code? AI will learn from your feedback..."
                    rows={3}
                    autoFocus
          />
                </div>
            )}

            <div className="diff-actions">
                <button
                    className="btn btn-secondary"
                    onClick={handleReject}
                >
                    {showRejectInput ? '✕ Reject & Send Feedback' : '✕ Reject'}
                </button>
                <button className="btn btn-primary" onClick={handleAccept}>
                    ✓ Accept & Commit
                </button>
            </div>

            <style jsx>{`
        .diff-viewer {
          background: var(--color-bg-secondary);
          border-left: 1px solid var(--color-border);
          display: flex;
          flex-direction: column;
          height: 100vh;
          width: 100%;
        }

        .diff-header {
          padding: var(--spacing-lg);
          border-bottom: 1px solid var(--color-border);
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .diff-header h3 {
          margin: 0;
          font-size: 1.125rem;
        }

        .close-btn {
          background: transparent;
          border: none;
          font-size: 1.5rem;
          color: var(--color-text-secondary);
          cursor: pointer;
          width: 32px;
          height: 32px;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: var(--radius-sm);
          transition: all var(--transition-fast);
        }

        .close-btn:hover {
          background: rgba(239, 68, 68, 0.1);
          color: var(--color-accent-error);
        }

        .diff-content {
          flex: 1;
          overflow: auto;
          padding: var(--spacing-md);
        }

        .reject-input {
          padding: var(--spacing-md);
          border-top: 1px solid var(--color-border);
          animation: slideDown 0.3s ease;
        }

        .reject-input textarea {
          width: 100%;
          padding: var(--spacing-md);
          background: var(--color-bg-elevated);
          border: 1px solid rgba(239, 68, 68, 0.3);
          border-radius: var(--radius-md);
          color: var(--color-text-primary);
          font-size: 0.875rem;
          resize: vertical;
        }

        .diff-actions {
          padding: var(--spacing-lg);
          border-top: 1px solid var(--color-border);
          display: flex;
          gap: var(--spacing-md);
        }

        .diff-actions button {
          flex: 1;
        }
      `}</style>
        </div>
    )
}
