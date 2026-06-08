import type { BuilderMode } from '@/types/builder.types'
import type { OutputPlatform } from '@/types/store.types'

export interface WizardFormState {
  projectName: string
  logoDataUrl: string | undefined
  primaryColor: string
  fontFamily: string
  mode: BuilderMode
  platform: OutputPlatform
}

export const WIZARD_DEFAULTS: WizardFormState = {
  projectName: '',
  logoDataUrl: undefined,
  primaryColor: '#4f46e5',
  fontFamily: 'Inter',
  mode: 'custom',
  platform: 'react',
}
