'use client'

interface EnvironmentSelectorProps {
  value: 'executor' | 'studio'
  onChange: (value: 'executor' | 'studio') => void
}

export default function EnvironmentSelector({ value, onChange }: EnvironmentSelectorProps) {
  return (
    <div className="environment-selector">
      <button
        className={`env-option ${value === 'executor' ? 'active' : ''}`}
        onClick={() => onChange('executor')}
      >
        <span className="env-icon">🔬</span>
        <span className="env-label">Executor</span>
      </button>
      <button
        className={`env-option ${value === 'studio' ? 'active' : ''}`}
        onClick={() => onChange('studio')}
      >
        <span className="env-icon">🎮</span>
        <span className="env-label">Studio</span>
      </button>

      <style jsx>{`
        .environment-selector {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: var(--spacing-sm);
        }

        .env-option {
          padding: var(--spacing-md);
          background: var(--color-bg-secondary);
          border: 1px solid var(--color-border);
          border-radius: var(--radius-md);
          cursor: pointer;
          display: flex;
          align-items: center;
          gap: var(--spacing-sm);
          transition: all var(--transition-normal);
        }

        .env-option:hover {
          border-color: var(--color-border-hover);
          background: var(--color-bg-elevated);
        }

        .env-option.active {
          border-color: var(--color-accent-primary);
          background: rgba(99, 102, 241, 0.1);
        }

        .env-icon {
          font-size: 1.25rem;
        }

        .env-label {
          font-weight: 600;
          font-size: 0.875rem;
        }
      `}</style>
    </div>
  )
}
