'use client'

import React, { useRef } from 'react'

interface FileWithNotes {
    file: File
    notes: string
}

interface FileUploaderProps {
    files: FileWithNotes[]
    onChange: (files: FileWithNotes[]) => void
    maxFiles?: number
}

export default function FileUploader({ files, onChange, maxFiles = 5 }: FileUploaderProps) {
    const fileInputRef = useRef<HTMLInputElement>(null)

    const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (!e.target.files) return

        const newFiles = Array.from(e.target.files)
        const remainingSlots = maxFiles - files.length
        const filesToAdd = newFiles.slice(0, remainingSlots)

        const filesWithNotes: FileWithNotes[] = filesToAdd.map(file => ({
            file,
            notes: ''
        }))

        onChange([...files, ...filesWithNotes])

        if (fileInputRef.current) {
            fileInputRef.current.value = ''
        }
    }

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault()
        e.stopPropagation()

        const droppedFiles = Array.from(e.dataTransfer.files)
        const remainingSlots = maxFiles - files.length
        const filesToAdd = droppedFiles.slice(0, remainingSlots)

        const filesWithNotes: FileWithNotes[] = filesToAdd.map(file => ({
            file,
            notes: ''
        }))

        onChange([...files, ...filesWithNotes])
    }

    const handleDragOver = (e: React.DragEvent) => {
        e.preventDefault()
        e.stopPropagation()
    }

    const removeFile = (index: number) => {
        onChange(files.filter((_, i) => i !== index))
    }

    const updateNotes = (index: number, notes: string) => {
        const updated = files.map((f, i) =>
            i === index ? { ...f, notes } : f
        )
        onChange(updated)
    }

    const formatFileSize = (bytes: number): string => {
        if (bytes === 0) return '0 Bytes'
        const k = 1024
        const sizes = ['Bytes', 'KB', 'MB', 'GB']
        const i = Math.floor(Math.log(bytes) / Math.log(k))
        return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i]
    }

    const getFileIcon = (filename: string): string => {
        if (filename.endsWith('.lua') || filename.endsWith('.luau')) return '📜'
        if (filename.endsWith('.txt')) return '📄'
        return '📁'
    }

    return (
        <div className="file-uploader">
            <label className="upload-label">
                Dependency Files ({files.length}/{maxFiles})
            </label>

            {files.length < maxFiles && (
                <div
                    className="drop-zone"
                    onDrop={handleDrop}
                    onDragOver={handleDragOver}
                    onClick={() => fileInputRef.current?.click()}
                >
                    <div className="drop-zone-content">
                        <span className="upload-icon">📤</span>
                        <p className="drop-text">Drop Lua files here or click to browse</p>
                        <p className="drop-subtext">Upload sample scripts, dependencies, or reference code</p>
                    </div>
                    <input
                        ref={fileInputRef}
                        type="file"
                        multiple
                        accept=".lua,.luau,.txt"
                        onChange={handleFileSelect}
                        style={{ display: 'none' }}
                    />
                </div>
            )}

            {files.length > 0 && (
                <div className="files-list">
                    {files.map((fileWithNotes, index) => (
                        <div key={index} className="file-item">
                            <div className="file-header">
                                <div className="file-info">
                                    <span className="file-icon">{getFileIcon(fileWithNotes.file.name)}</span>
                                    <div>
                                        <div className="file-name">{fileWithNotes.file.name}</div>
                                        <div className="file-size">{formatFileSize(fileWithNotes.file.size)}</div>
                                    </div>
                                </div>
                                <button
                                    type="button"
                                    onClick={() => removeFile(index)}
                                    className="remove-btn"
                                    title="Remove file"
                                >
                                    ✕
                                </button>
                            </div>

                            <textarea
                                className="file-notes"
                                placeholder="Add notes about this file (e.g., 'Similar implementation', 'Reference for X feature', 'Different variant'...)"
                                value={fileWithNotes.notes}
                                onChange={(e) => updateNotes(index, e.target.value)}
                            />
                        </div>
                    ))}
                </div>
            )}

            <style jsx>{`
        .file-uploader {
          margin-bottom: var(--spacing-xl);
        }

        .upload-label {
          display: block;
          font-weight: 600;
          font-size: 1rem;
          margin-bottom: var(--spacing-md);
          color: var(--color-text-primary);
        }

        .drop-zone {
          border: 2px dashed var(--color-border);
          border-radius: var(--radius-lg);
          padding: var(--spacing-2xl);
          text-align: center;
          cursor: pointer;
          transition: all var(--transition-normal);
          background: var(--color-bg-elevated);
        }

        .drop-zone:hover {
          border-color: var(--color-accent-primary);
          background: rgba(99, 102, 241, 0.05);
        }

        .drop-zone-content {
          pointer-events: none;
        }

        .upload-icon {
          font-size: 3rem;
          display: block;
          margin-bottom: var(--spacing-md);
          opacity: 0.7;
        }

        .drop-text {
          font-weight: 600;
          font-size: 1.125rem;
          color: var(--color-text-primary);
          margin-bottom: var(--spacing-xs);
        }

        .drop-subtext {
          font-size: 0.875rem;
          color: var(--color-text-tertiary);
          margin: 0;
        }

        .files-list {
          display: flex;
          flex-direction: column;
          gap: var(--spacing-md);
          margin-top: var(--spacing-md);
        }

        .file-item {
          background: var(--color-bg-elevated);
          border: 1px solid var(--color-border);
          border-radius: var(--radius-lg);
          padding: var(--spacing-lg);
          animation: slideUp 0.3s ease;
        }

        .file-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          margin-bottom: var(--spacing-md);
        }

        .file-info {
          display: flex;
          align-items: center;
          gap: var(--spacing-md);
        }

        .file-icon {
          font-size: 2rem;
        }

        .file-name {
          font-weight: 600;
          color: var(--color-text-primary);
          margin-bottom: 0.25rem;
          word-break: break-all;
        }

        .file-size {
          font-size: 0.875rem;
          color: var(--color-text-tertiary);
        }

        .remove-btn {
          background: rgba(239, 68, 68, 0.1);
          color: var(--color-accent-error);
          border: 1px solid rgba(239, 68, 68, 0.3);
          border-radius: var(--radius-sm);
          width: 32px;
          height: 32px;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: all var(--transition-fast);
          font-size: 1.25rem;
          line-height: 1;
        }

        .remove-btn:hover {
          background: rgba(239, 68, 68, 0.2);
          border-color: var(--color-accent-error);
        }

        .file-notes {
          width: 100%;
          min-height: 80px;
          padding: var(--spacing-md);
          background: var(--color-bg-secondary);
          border: 1px solid var(--color-border);
          border-radius: var(--radius-md);
          color: var(--color-text-primary);
          font-size: 0.875rem;
          resize: vertical;
          transition: all var(--transition-normal);
        }

        .file-notes:focus {
          outline: none;
          border-color: var(--color-accent-primary);
          box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.1);
        }

        .file-notes::placeholder {
          color: var(--color-text-muted);
        }
      `}</style>
        </div>
    )
}
