'use client'

import { useState } from 'react'

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
  const [dragging, setDragging] = useState(false)

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setDragging(false)

    const droppedFiles = Array.from(e.dataTransfer.files)
    const luaFiles = droppedFiles.filter(f =>
      f.name.endsWith('.lua') || f.name.endsWith('.luau') || f.name.endsWith('.txt')
    )

    if (files.length + luaFiles.length > maxFiles) {
      alert(`Maximum ${maxFiles} files allowed`)
      return
    }

    const newFiles = luaFiles.map(file => ({ file, notes: '' }))
    onChange([...files, ...newFiles])
  }

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return

    const selectedFiles = Array.from(e.target.files)
    const luaFiles = selectedFiles.filter(f =>
      f.name.endsWith('.lua') || f.name.endsWith('.luau') || f.name.endsWith('.txt')
    )

    if (files.length + luaFiles.length > maxFiles) {
      alert(`Maximum ${maxFiles} files allowed`)
      return
    }

    const newFiles = luaFiles.map(file => ({ file, notes: '' }))
    onChange([...files, ...newFiles])
  }

  const updateNotes = (index: number, notes: string) => {
    const updated = [...files]
    updated[index].notes = notes
    onChange(updated)
  }

  const removeFile = (index: number) => {
    onChange(files.filter((_, i) => i !== index))
  }

  return (
    <div className="file-uploader">
      {files.length === 0 ? (
        <div
          className={`drop-zone ${dragging ? 'dragging' : ''}`}
          onDragOver={(e) => {
            e.preventDefault()
            setDragging(true)
          }}
          onDragLeave={() => setDragging(false)}
          onDrop={handleDrop}
          onClick={() => document.getElementById('file-input')?.click()}
        >
          <span className="drop-icon">📁</span>
          <p>Drop Lua files here or click to browse</p>
          <span className="file-hint">Up to {maxFiles} files (.lua, .luau, .txt)</span>
        </div>
      ) : (
        <div className="files-list">
          {files.map((fileWithNotes, index) => (
            <div key={index} className="file-card">
              <div className="file-header">
                <span className="file-name">📄 {fileWithNotes.file.name}</span>
                <button className="remove-btn" onClick={() => removeFile(index)}>
                  ✕
                </button>
              </div>
              <input
                type="text"
                placeholder="Add notes about this file..."
                value={fileWithNotes.notes}
                onChange={(e) => updateNotes(index, e.target.value)}
                className="file-notes-input"
              />
            </div>
          ))}
          {files.length < maxFiles && (
            <button
              className="add-more-btn"
              onClick={() => document.getElementById('file-input')?.click()}
            >
              + Add more files ({files.length}/{maxFiles})
            </button>
          )}
        </div>
      )}

      <input
        id="file-input"
        type="file"
        multiple
        accept=".lua,.luau,.txt"
        onChange={handleFileSelect}
        style={{ display: 'none' }}
      />

      <style jsx>{`
        .file-uploader {
          margin-bottom: var(--spacing-md);
        }

        .drop-zone {
          padding: var(--spacing-xl);
          border: 2px dashed var(--color-border);
          border-radius: var(--radius-lg);
          text-align: center;
          cursor: pointer;
          transition: all var(--transition-normal);
        }

        .drop-zone:hover,
        .drop-zone.dragging {
          border-color: var(--color-accent-primary);
          background: rgba(99, 102, 241, 0.05);
        }

        .drop-icon {
          font-size: 3rem;
          display: block;
          margin-bottom: var(--spacing-md);
        }

        .drop-zone p {
          margin: 0 0 var(--spacing-sm) 0;
          font-weight: 600;
        }

        .file-hint {
          font-size: 0.75rem;
          color: var(--color-text-tertiary);
        }

        .files-list {
          display: flex;
          flex-direction: column;
          gap: var(--spacing-sm);
        }

        .file-card {
          padding: var(--spacing-md);
          background: var(--color-bg-elevated);
          border: 1px solid var(--color-border);
          border-radius: var(--radius-md);
        }

        .file-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: var(--spacing-sm);
        }

        .file-name {
          font-size: 0.875rem;
          font-weight: 600;
        }

        .remove-btn {
          background: transparent;
          border: none;
          color: var(--color-text-secondary);
          cursor: pointer;
          font-size: 1.125rem;
          width: 24px;
          height: 24px;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: var(--radius-sm);
          transition: all var(--transition-fast);
        }

        .remove-btn:hover {
          background: rgba(239, 68, 68, 0.1);
          color: var(--color-accent-error);
        }

        .file-notes-input {
          width: 100%;
          padding: var(--spacing-sm);
          background: var(--color-bg-secondary);
          border: 1px solid var(--color-border);
          border-radius: var(--radius-sm);
          color: var(--color-text-primary);
          font-size: 0.875rem;
        }

        .add-more-btn {
          padding: var(--spacing-md);
          background: var(--color-bg-elevated);
          border: 1px dashed var(--color-border);
          border-radius: var(--radius-md);
          color: var(--color-text-secondary);
          cursor: pointer;
          font-weight: 600;
          transition: all var(--transition-normal);
        }

        .add-more-btn:hover {
          border-color: var(--color-accent-primary);
          color: var(--color-accent-primary);
        }
      `}</style>
    </div>
  )
}
