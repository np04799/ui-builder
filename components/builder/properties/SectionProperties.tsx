'use client'

import { useSection } from '@/hooks/useBuilderSelectors'
import { useBuilderStore } from '@/store/builder.store'
import PropGroup from '@/components/builder/controls/PropGroup'
import PropRow from '@/components/builder/controls/PropRow'
import ColorSwatch from '@/components/builder/controls/ColorSwatch'
import SelectInput from '@/components/builder/controls/SelectInput'
import TextInput from '@/components/builder/controls/TextInput'
import SpacingControl from '@/components/builder/controls/SpacingControl'
import AlignButtonGroup from '@/components/builder/controls/AlignButtonGroup'
import ResponsiveVisibility from '@/components/builder/controls/ResponsiveVisibility'
import type { ResponsiveStyles } from '@/types/builder.types'

interface Props {
  id: string
}

const WIDTH_OPTIONS = [
  { label: 'Full width (100%)', value: '100%' },
  { label: 'Wide (1400px)', value: '1400px' },
  { label: 'Contained (1200px)', value: '1200px' },
  { label: 'Narrow (960px)', value: '960px' },
]

const SCROLL_ANIM_OPTIONS = [
  { label: 'Fade Up (default)', value: 'fade-up' },
  { label: 'Fade In', value: 'fade-in' },
  { label: 'Scale In', value: 'scale-in' },
  { label: 'None', value: 'none' },
]

const ANIM_DELAY_OPTIONS = [
  { label: 'No delay', value: '' },
  { label: '80ms', value: '1' },
  { label: '160ms', value: '2' },
  { label: '240ms', value: '3' },
  { label: '320ms', value: '4' },
]

export default function SectionProperties({ id }: Props) {
  const section = useSection(id)
  const updateSection = useBuilderStore((s) => s.updateSection)

  if (!section) return null

  const styles = section.styles as Record<string, string>

  function patchStyle(key: string, value: string) {
    updateSection(id, { styles: { [key]: value } })
  }

  function handleMaxWidthChange(value: string) {
    updateSection(id, { styles: { maxWidth: value } })
  }

  return (
    <>
      <PropGroup label="Background">
        <PropRow label="Color">
          <ColorSwatch
            value={styles.backgroundColor ?? ''}
            onChange={(v) => patchStyle('backgroundColor', v)}
          />
        </PropRow>
        <PropRow label="Image URL" stack>
          <TextInput
            value={styles.backgroundImage?.replace(/^url\(['"]?/, '').replace(/['"]?\)$/, '') ?? ''}
            onChange={(v) => patchStyle('backgroundImage', v ? `url('${v}')` : '')}
            placeholder="https://..."
          />
        </PropRow>
        {styles.backgroundImage && (
          <PropRow label="Bg size">
            <SelectInput
              value={styles.backgroundSize ?? 'cover'}
              options={[
                { label: 'Cover', value: 'cover' },
                { label: 'Contain', value: 'contain' },
                { label: 'Auto', value: 'auto' },
              ]}
              onChange={(v) => patchStyle('backgroundSize', v)}
            />
          </PropRow>
        )}
      </PropGroup>

      <PropGroup label="Layout">
        <PropRow label="Max width">
          <SelectInput
            value={styles.maxWidth ?? '1200px'}
            options={WIDTH_OPTIONS}
            onChange={handleMaxWidthChange}
          />
        </PropRow>
        <PropRow label="Alignment">
          <AlignButtonGroup
            value={styles.alignItems ?? 'center'}
            onChange={(v) => patchStyle('alignItems', v)}
            options={[
              { value: 'flex-start', title: 'Left', icon: <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"><path d="M2 2v10M5 4h6M5 7h4M5 10h5" /></svg> },
              { value: 'center', title: 'Center', icon: <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"><path d="M7 2v10M4 4h6M5 7h4M4 10h6" /></svg> },
              { value: 'flex-end', title: 'Right', icon: <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"><path d="M12 2v10M3 4h6M5 7h4M4 10h5" /></svg> },
            ]}
          />
        </PropRow>
      </PropGroup>

      <PropGroup label="Spacing">
        <PropRow label="Padding" stack>
          <SpacingControl
            value={[
              styles.paddingTop ?? styles.padding ?? '0px',
              styles.paddingRight ?? styles.padding ?? '0px',
              styles.paddingBottom ?? styles.padding ?? '0px',
              styles.paddingLeft ?? styles.padding ?? '0px',
            ].join(' ')}
            onChange={(v) => {
              const [top, right, bottom, left] = v.trim().split(/\s+/)
              updateSection(id, {
                styles: {
                  paddingTop: top,
                  paddingRight: right,
                  paddingBottom: bottom,
                  paddingLeft: left,
                  padding: undefined,
                } as unknown as Record<string, string>,
              })
            }}
          />
        </PropRow>
      </PropGroup>

      {/* ── Scroll-reveal animation ── */}
      <PropGroup label="Scroll Animation">
        <PropRow label="Effect">
          <SelectInput
            value={styles['--bp-anim'] ?? 'fade-up'}
            options={SCROLL_ANIM_OPTIONS}
            onChange={(v) => patchStyle('--bp-anim', v)}
          />
        </PropRow>
        {(styles['--bp-anim'] ?? 'fade-up') !== 'none' && (
          <PropRow label="Delay">
            <SelectInput
              value={styles['--bp-anim-delay'] ?? ''}
              options={ANIM_DELAY_OPTIONS}
              onChange={(v) => patchStyle('--bp-anim-delay', v)}
            />
          </PropRow>
        )}
        <p style={{ fontSize: '0.68rem', color: 'var(--color-text-secondary)', margin: '4px 0 0', lineHeight: 1.5 }}>
          Applied on scroll when viewing the published page.
        </p>
      </PropGroup>

      <PropGroup label="Section meta">
        <PropRow label="Name" stack>
          <TextInput
            value={section.name ?? ''}
            onChange={(v) => updateSection(id, { name: v || undefined })}
            placeholder="Shown in Layers panel (e.g. Hero, Features…)"
          />
        </PropRow>
        <PropRow label="HTML id" stack>
          <TextInput
            value={section.htmlId ?? ''}
            onChange={(v) => updateSection(id, { htmlId: v || undefined })}
            placeholder="hero-section"
          />
        </PropRow>
        <PropRow label="CSS class(es)" stack>
          <TextInput
            value={section.classNames ?? ''}
            onChange={(v) => updateSection(id, { classNames: v || undefined })}
            placeholder="my-section another-class"
          />
        </PropRow>
      </PropGroup>

      <ResponsiveVisibility
        responsive={section.responsive ?? {}}
        onUpdate={(r: ResponsiveStyles) => updateSection(id, { responsive: r })}
      />
    </>
  )
}
