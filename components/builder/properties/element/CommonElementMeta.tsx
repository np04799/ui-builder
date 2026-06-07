'use client'

import type { ElementNode } from '@/types/store.types'
import { useBuilderStore } from '@/store/builder.store'
import PropGroup from '@/components/builder/controls/PropGroup'
import PropRow from '@/components/builder/controls/PropRow'
import TextInput from '@/components/builder/controls/TextInput'
import SelectInput from '@/components/builder/controls/SelectInput'

interface Props { element: ElementNode }

const ELEMENT_ANIM_OPTIONS = [
  { label: 'None', value: '' },
  { label: 'Float (up-down loop)', value: 'float 6s ease-in-out infinite' },
  { label: 'Float slow (10s)', value: 'float 10s ease-in-out infinite' },
  { label: 'Pulse', value: '_bp_pulse 2s ease-in-out infinite' },
  { label: 'Fade In (once)', value: '_bp_fadeIn 0.7s ease both' },
  { label: 'Fade Up (once)', value: '_bp_fadeUp 0.6s cubic-bezier(0.22,1,0.36,1) both' },
  { label: 'Slide In Left (once)', value: '_bp_slideLeft 0.6s cubic-bezier(0.22,1,0.36,1) both' },
  { label: 'Slide In Right (once)', value: '_bp_slideRight 0.6s cubic-bezier(0.22,1,0.36,1) both' },
  { label: 'Scale In (once)', value: '_bp_scaleIn 0.55s cubic-bezier(0.22,1,0.36,1) both' },
]

const ANIM_DELAY_OPTIONS = [
  { label: 'No delay', value: '' },
  { label: '100ms', value: '0.1s' },
  { label: '200ms', value: '0.2s' },
  { label: '300ms', value: '0.3s' },
  { label: '500ms', value: '0.5s' },
  { label: '1s', value: '1s' },
  { label: '2s', value: '2s' },
]

/** Detect the animation value from element styles */
function getAnimValue(styles: Record<string, string>): string {
  return styles.animation ?? ''
}

function getAnimDelay(styles: Record<string, string>): string {
  return styles.animationDelay ?? ''
}

export default function CommonElementMeta({ element }: Props) {
  const updateElement = useBuilderStore((s) => s.updateElement)
  const styles = (element.styles ?? {}) as Record<string, string>

  function patchStyle(key: string, value: string) {
    updateElement(element.id, { styles: { [key]: value || undefined } as Record<string, string> })
  }

  const currentAnim = getAnimValue(styles)
  const currentDelay = getAnimDelay(styles)

  return (
    <>
      <PropGroup label="Element meta">
        <PropRow label="Name" stack>
          <TextInput
            value={element.name ?? ''}
            onChange={(v) => updateElement(element.id, { name: v || undefined })}
            placeholder="Shown in Layers panel"
          />
        </PropRow>
        <PropRow label="HTML id" stack>
          <TextInput
            value={element.htmlId ?? ''}
            onChange={(v) => updateElement(element.id, { htmlId: v || undefined })}
            placeholder="my-element-id"
          />
        </PropRow>
        <PropRow label="CSS class(es)" stack>
          <TextInput
            value={element.classNames ?? ''}
            onChange={(v) => updateElement(element.id, { classNames: v || undefined })}
            placeholder="my-class another-class"
          />
        </PropRow>
        <p style={{ fontSize: '0.7rem', color: 'var(--color-text-secondary)', margin: '4px 0 0', lineHeight: 1.5 }}>
          Custom id and classes are added to the rendered HTML and stay through framework switches and exports.
        </p>
      </PropGroup>

      {/* ── Element animation ── */}
      <PropGroup label="Animation">
        <PropRow label="Effect">
          <SelectInput
            value={currentAnim}
            options={ELEMENT_ANIM_OPTIONS}
            onChange={(v) => patchStyle('animation', v)}
          />
        </PropRow>
        {currentAnim && (
          <PropRow label="Delay">
            <SelectInput
              value={currentDelay}
              options={ANIM_DELAY_OPTIONS}
              onChange={(v) => patchStyle('animationDelay', v)}
            />
          </PropRow>
        )}
        <p style={{ fontSize: '0.68rem', color: 'var(--color-text-secondary)', margin: '4px 0 0', lineHeight: 1.5 }}>
          Loop animations play forever. &ldquo;Once&rdquo; animations fire on page load.
        </p>
      </PropGroup>
    </>
  )
}
