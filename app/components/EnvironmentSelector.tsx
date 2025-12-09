'use client'

import React from 'react'

interface EnvironmentSelectorProps {
    value: 'executor' | 'studio'
    onChange: (value: 'executor' | 'studio') => void
}

export default function EnvironmentSelector({ value, onChange }: EnvironmentSelectorProps) {
    return (
        <div className="environment-selector">
            <label className="env-label">Target Environment</label>
            <div className="env-toggle">
                <button
                    type="button"
                    className={`env-option ${value === 'executor' ? 'active' : ''}`}
                    onClick={() => onChange('executor')}
                >
                    <span className="env-icon">🔬</span>
                    <div>
                        <div className="env-title">Executor</div>
                        <div className="env-desc">Testing & Research</div>
                    </div>
                </button>
                <button
                    type="button"
                    className={`env-option ${value === 'studio' ? 'active' : ''}`}
                    onClick={() => onChange('studio')}
                >
                    <span className="env-icon">🎮</span>
                    <div>
                        <div className="env-title">Roblox Studio</div>
                        <div className="env-desc">Development</div>
                    </div>
                </button>
            </div>

            <style jsx>{`
        .environment-selector {
          margin-bottom: var(--spacing-xl);
        }

        .env-label {
          display: block;
          font-weight: 600;
          font-size: 1rem;
          margin-bottom: var(--spacing-md);
          color: var(--color-text-primary);
        }

        .env-toggle {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: var(--spacing-md);
        }

        .env-option {
          display: flex;
          align-items: center;
          gap: var(--spacing-md);
          padding: var(--spacing-lg);
          background: var(--color-bg-elevated);
          border: 2px solid var(--color-border);
          border-radius: var(--radius-lg);
          cursor: pointer;
          transition: all var(--transition-normal);
          color: var(--color-text-primary);
        }

        .env-option:hover {
          border-color: var(--color-border-hover);
          background: var(--color-bg-tertiary);
          transform: translateY(-2px);
        }

        .env-option.active {
          border-color: var(--color-accent-primary);
          background: rgba(99, 102, 241, 0.1);
          box-shadow: 0 0 20px rgba(99, 102, 241, 0.2);
        }

        .env-icon {
          font-size: 2rem;
          filter: grayscale(100%);
          opacity: 0.5;
          transition: all var(--transition-normal);
        }

        .env-option.active .env-icon {
          filter: grayscale(0%);
          opacity: 1;
        }

        .env-title {
          font-weight: 600;
          font-size: 1.125rem;
          margin-bottom: 0.25rem;
          text-align: left;
        }

        .env-desc {
          font-size: 0.875rem;
          color: var(--color-text-tertiary);
          text-align: left;
        }

        @media (max-width: 768px) {
          .env-toggle {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
        </div>
    )
}
