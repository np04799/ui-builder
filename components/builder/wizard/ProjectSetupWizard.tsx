'use client'

import { useState } from 'react'
import { useBuilderStore } from '@/store/builder.store'
import { WIZARD_DEFAULTS, type WizardFormState } from './wizard.types'
import WizardProgress from './WizardProgress'
import Step1ProjectName from './steps/Step1ProjectName'
import Step2LogoUpload from './steps/Step2LogoUpload'
import Step3Branding from './steps/Step3Branding'
import Step4UIFramework from './steps/Step4UIFramework'
import Step5Platform from './steps/Step5Platform'
import Step6Summary from './steps/Step6Summary'

const STEP_LABELS = ['Name', 'Logo', 'Branding', 'Framework', 'Platform', 'Summary']
const TOTAL_STEPS = 6

export default function ProjectSetupWizard() {
  const [step, setStep] = useState(1)
  const [form, setForm] = useState<WizardFormState>(WIZARD_DEFAULTS)

  const initProject = useBuilderStore((s) => s.initProject)
  const setBranding = useBuilderStore((s) => s.setBranding)
  const setLogo = useBuilderStore((s) => s.setLogo)
  const setPlatform = useBuilderStore((s) => s.setPlatform)

  function patch(update: Partial<WizardFormState>) {
    setForm((prev) => ({ ...prev, ...update }))
  }

  function next() { setStep((s) => Math.min(s + 1, TOTAL_STEPS)) }
  function back() { setStep((s) => Math.max(s - 1, 1)) }

  function handleConfirm() {
    initProject(form.projectName, form.mode)
    setBranding({ primaryColor: form.primaryColor, fontFamily: form.fontFamily })
    if (form.logoDataUrl) setLogo(form.logoDataUrl)
    setPlatform(form.platform)
  }

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 9999,
        backgroundColor: 'rgba(0, 0, 0, 0.65)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <div
        style={{
          width: 'min(560px, 92vw)',
          maxHeight: '90vh',
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column',
          borderRadius: 14,
          boxShadow: '0 24px 48px rgba(0,0,0,0.35)',
          backgroundColor: 'var(--color-bg)',
          animation: 'bp-fade-in 200ms ease',
        }}
      >
        {/* Progress strip */}
        <WizardProgress currentStep={step} totalSteps={TOTAL_STEPS} labels={STEP_LABELS} />

        {/* Step body — scrollable */}
        <div style={{ flex: 1, overflowY: 'auto' }}>
          {step === 1 && (
            <Step1ProjectName form={form} onChange={patch} onNext={next} />
          )}
          {step === 2 && (
            <Step2LogoUpload form={form} onChange={patch} onNext={next} onBack={back} onSkip={next} />
          )}
          {step === 3 && (
            <Step3Branding form={form} onChange={patch} onNext={next} onBack={back} onSkip={next} />
          )}
          {step === 4 && (
            <Step4UIFramework form={form} onChange={patch} onNext={next} onBack={back} onSkip={next} />
          )}
          {step === 5 && (
            <Step5Platform form={form} onChange={patch} onNext={next} onBack={back} onSkip={next} />
          )}
          {step === 6 && (
            <Step6Summary form={form} onConfirm={handleConfirm} onBack={back} />
          )}
        </div>
      </div>
    </div>
  )
}
