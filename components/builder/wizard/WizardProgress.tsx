'use client'

interface Props {
  currentStep: number
  totalSteps: number
  labels: string[]
}

export default function WizardProgress({ currentStep, totalSteps, labels }: Props) {
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        padding: '20px 24px 16px',
        gap: 0,
      }}
    >
      {Array.from({ length: totalSteps }, (_, i) => {
        const stepNum = i + 1
        const isDone = stepNum < currentStep
        const isActive = stepNum === currentStep

        return (
          <div key={stepNum} style={{ display: 'flex', alignItems: 'center', flex: i < totalSteps - 1 ? 1 : undefined }}>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
              <div
                style={{
                  width: 28,
                  height: 28,
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '0.6875rem',
                  fontWeight: 700,
                  transition: 'all 200ms ease',
                  backgroundColor: isDone
                    ? 'var(--color-primary)'
                    : isActive
                      ? 'var(--color-primary)'
                      : 'var(--color-border)',
                  color: isDone || isActive ? '#fff' : 'var(--color-text-secondary)',
                  border: isActive ? '2px solid var(--color-primary)' : '2px solid transparent',
                  boxShadow: isActive ? '0 0 0 3px color-mix(in srgb, var(--color-primary) 20%, transparent)' : 'none',
                }}
              >
                {isDone ? (
                  <svg width="12" height="12" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M2 6l3 3 5-5" />
                  </svg>
                ) : (
                  stepNum
                )}
              </div>
              <span
                style={{
                  fontSize: '0.5625rem',
                  fontWeight: isActive ? 600 : 400,
                  color: isActive ? 'var(--color-primary)' : 'var(--color-text-secondary)',
                  whiteSpace: 'nowrap',
                }}
              >
                {labels[i]}
              </span>
            </div>

            {i < totalSteps - 1 && (
              <div
                style={{
                  flex: 1,
                  height: 2,
                  marginBottom: 14,
                  marginLeft: 4,
                  marginRight: 4,
                  backgroundColor: isDone ? 'var(--color-primary)' : 'var(--color-border)',
                  transition: 'background-color 200ms ease',
                }}
              />
            )}
          </div>
        )
      })}
    </div>
  )
}
