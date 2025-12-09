'use client'

import { useState } from 'react'
import EnvironmentSelector from './components/EnvironmentSelector'
import FileUploader from './components/FileUploader'
import ScriptOutput from './components/ScriptOutput'

interface FileWithNotes {
    file: File
    notes: string
}

export default function Home() {
    const [environment, setEnvironment] = useState<'executor' | 'studio'>('executor')
    const [files, setFiles] = useState<FileWithNotes[]>([])
    const [userPrompt, setUserPrompt] = useState('')
    const [output, setOutput] = useState('')
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState('')

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setError('')
        setOutput('')
        setIsLoading(true)

        try {
            const formData = new FormData()
            formData.append('environment', environment)
            formData.append('userPrompt', userPrompt)

            files.forEach((fileWithNotes, index) => {
                formData.append(`file_${index}`, fileWithNotes.file)
                formData.append(`notes_${index}`, fileWithNotes.notes)
            })
            formData.append('fileCount', files.length.toString())

            const response = await fetch('/api/generate-script', {
                method: 'POST',
                body: formData,
            })

            if (!response.ok) {
                const errorData = await response.json()
                throw new Error(errorData.error || 'Failed to generate script')
            }

            const data = await response.json()
            setOutput(data.script)
        } catch (err: any) {
            setError(err.message || 'An error occurred while generating the script')
            console.error('Error:', err)
        } finally {
            setIsLoading(false)
        }
    }

    const canSubmit = userPrompt.trim().length > 0 && !isLoading

    return (
        <main className="main-container">
            <div className="content-wrapper">
                <header className="header">
                    <div className="logo-container">
                        <span className="logo-icon">🎮</span>
                        <h1>Roblox Script Dev AI</h1>
                    </div>
                    <p className="tagline">
                        AI-Powered Script Development & Refinement Platform
                    </p>
                </header>

                <form onSubmit={handleSubmit} className="main-form">
                    <div className="card form-card">
                        <EnvironmentSelector
                            value={environment}
                            onChange={setEnvironment}
                        />

                        <FileUploader
                            files={files}
                            onChange={setFiles}
                            maxFiles={5}
                        />

                        <div className="prompt-section">
                            <label htmlFor="userPrompt" className="prompt-label">
                                Your Instructions
                            </label>
                            <textarea
                                id="userPrompt"
                                className="prompt-input"
                                placeholder={`Describe what you want to achieve with your script...

Example: "Create a raycast-based aiming system that highlights players within 100 studs. Use the uploaded files as reference for the hitbox detection logic."`}
                                value={userPrompt}
                                onChange={(e) => setUserPrompt(e.target.value)}
                                rows={6}
                            />
                        </div>

                        {error && (
                            <div className="error-message">
                                <span className="error-icon">⚠️</span>
                                {error}
                            </div>
                        )}

                        <button
                            type="submit"
                            className="btn btn-primary submit-btn"
                            disabled={!canSubmit}
                        >
                            {isLoading ? (
                                <>
                                    <span className="spinner"></span>
                                    Generating...
                                </>
                            ) : (
                                <>
                                    <span>✨</span>
                                    Generate Script
                                </>
                            )}
                        </button>
                    </div>
                </form>

                <ScriptOutput content={output} isLoading={isLoading} />

                <footer className="footer">
                    <p>Powered by Google Gemini AI • Built for Roblox Developers</p>
                </footer>
            </div>

            <style jsx>{`
        .main-container {
          min-height: 100vh;
          padding: var(--spacing-xl) var(--spacing-md);
        }

        .content-wrapper {
          max-width: 1200px;
          margin: 0 auto;
        }

        .header {
          text-align: center;
          margin-bottom: var(--spacing-2xl);
          animation: slideDown 0.6s ease;
        }

        .logo-container {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: var(--spacing-md);
          margin-bottom: var(--spacing-sm);
        }

        .logo-icon {
          font-size: 3rem;
          filter: drop-shadow(0 0 20px rgba(99, 102, 241, 0.5));
        }

        .header h1 {
          margin: 0;
          font-size: 2.5rem;
        }

        .tagline {
          font-size: 1.125rem;
          color: var(--color-text-secondary);
          margin: 0;
        }

        .main-form {
          animation: fadeIn 0.8s ease;
        }

        .form-card {
          margin-bottom: var(--spacing-xl);
        }

        .prompt-section {
          margin-bottom: var(--spacing-xl);
        }

        .prompt-label {
          display: block;
          font-weight: 600;
          font-size: 1rem;
          margin-bottom: var(--spacing-md);
          color: var(--color-text-primary);
        }

        .prompt-input {
          width: 100%;
          min-height: 150px;
          padding: var(--spacing-md);
          background: var(--color-bg-elevated);
          border: 1px solid var(--color-border);
          border-radius: var(--radius-md);
          color: var(--color-text-primary);
          font-size: 1rem;
          font-family: inherit;
          resize: vertical;
          transition: all var(--transition-normal);
        }

        .prompt-input:focus {
          outline: none;
          border-color: var(--color-accent-primary);
          box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.1);
        }

        .prompt-input::placeholder {
          color: var(--color-text-muted);
        }

        .error-message {
          display: flex;
          align-items: center;
          gap: var(--spacing-sm);
          padding: var(--spacing-md);
          background: rgba(239, 68, 68, 0.1);
          border: 1px solid rgba(239, 68, 68, 0.3);
          border-radius: var(--radius-md);
          color: var(--color-accent-error);
          margin-bottom: var(--spacing-lg);
          animation: slideUp 0.3s ease;
        }

        .error-icon {
          font-size: 1.25rem;
        }

        .submit-btn {
          width: 100%;
          padding: var(--spacing-lg);
          font-size: 1.125rem;
          justify-content: center;
        }

        .submit-btn:disabled {
          opacity: 0.5;
          cursor: not-allowed;
          transform: none;
        }

        .submit-btn:disabled:hover {
          transform: none;
          box-shadow: var(--shadow-md);
        }

        .footer {
          text-align: center;
          padding: var(--spacing-2xl) 0;
          color: var(--color-text-tertiary);
          font-size: 0.875rem;
        }

        .footer p {
          margin: 0;
        }

        @media (max-width: 768px) {
          .main-container {
            padding: var(--spacing-lg) var(--spacing-sm);
          }

          .header h1 {
            font-size: 2rem;
          }

          .logo-icon {
            font-size: 2.5rem;
          }

          .tagline {
            font-size: 1rem;
          }
        }
      `}</style>
        </main>
    )
}
