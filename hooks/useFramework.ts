import { useBuilderStore } from '@/store/builder.store'
import { usePreviewState } from '@/components/builder/elements/PreviewStateContext'
import type { BuilderMode } from '@/types/builder.types'

export function useFramework(): BuilderMode {
  const previewState = usePreviewState()
  const storeMode = useBuilderStore((s) => s.mode)
  return previewState ? previewState.mode : storeMode
}
