'use client'

import type { ElementNode } from '@/types/store.types'
import { useBuilderStore } from '@/store/builder.store'
import PropGroup from '@/components/builder/controls/PropGroup'
import PropRow from '@/components/builder/controls/PropRow'
import TextInput from '@/components/builder/controls/TextInput'
import SelectInput from '@/components/builder/controls/SelectInput'
import NumberInput from '@/components/builder/controls/NumberInput'
import ColorSwatch from '@/components/builder/controls/ColorSwatch'
import SpacingControl from '@/components/builder/controls/SpacingControl'
import CustomCSSField from '@/components/builder/controls/CustomCSSField'
import ImageUpload from '@/components/builder/controls/ImageUpload'

const ASPECT_OPTIONS = [
  { label: '16:9', value: '16/9' },
  { label: '4:3', value: '4/3' },
  { label: '1:1 (Square)', value: '1/1' },
]

const BOOL_OPTIONS = [
  { label: 'No', value: 'false' },
  { label: 'Yes', value: 'true' },
]

interface Props {
  element: ElementNode
}

export default function CarouselProps({ element }: Props) {
  const updateElement = useBuilderStore((s) => s.updateElement)

  if (element.content.type !== 'carousel') return null
  const { content, styles } = element

  function patchContent(patch: Partial<typeof content>) {
    updateElement(element.id, { content: { ...content, ...patch } })
  }

  function patchStyle(key: string, value: string) {
    updateElement(element.id, { styles: { ...styles, [key]: value } })
  }

  function updateSlide(slideId: string, field: 'image' | 'heading' | 'caption', value: string) {
    patchContent({
      slides: content.slides.map((s) => (s.id === slideId ? { ...s, [field]: value } : s)),
    })
  }

  function addSlide() {
    patchContent({
      slides: [
        ...content.slides,
        { id: crypto.randomUUID(), image: '', heading: `Slide ${content.slides.length + 1}`, caption: '' },
      ],
    })
  }

  function removeSlide(slideId: string) {
    if (content.slides.length <= 1) return
    patchContent({ slides: content.slides.filter((s) => s.id !== slideId) })
  }

  return (
    <>
      <PropGroup label="Carousel settings">
        <PropRow label="Aspect ratio">
          <SelectInput
            value={content.aspectRatio ?? '16/9'}
            options={ASPECT_OPTIONS}
            onChange={(v) => patchContent({ aspectRatio: v as '16/9' | '4/3' | '1/1' })}
          />
        </PropRow>
        <PropRow label="Show arrows">
          <SelectInput
            value={String(content.showArrows ?? true)}
            options={BOOL_OPTIONS}
            onChange={(v) => patchContent({ showArrows: v === 'true' })}
          />
        </PropRow>
        <PropRow label="Show dots">
          <SelectInput
            value={String(content.showDots ?? true)}
            options={BOOL_OPTIONS}
            onChange={(v) => patchContent({ showDots: v === 'true' })}
          />
        </PropRow>
        <PropRow label="Autoplay">
          <SelectInput
            value={String(content.autoplay ?? false)}
            options={BOOL_OPTIONS}
            onChange={(v) => patchContent({ autoplay: v === 'true' })}
          />
        </PropRow>
        {content.autoplay && (
          <PropRow label="Interval (s)">
            <NumberInput
              value={String(content.interval ?? 4)}
              onChange={(v) => patchContent({ interval: parseFloat(v) || 4 })}
              unit="s"
              min={1}
              max={30}
            />
          </PropRow>
        )}
      </PropGroup>

      {content.slides.map((slide, idx) => (
        <PropGroup key={slide.id} label={`Slide ${idx + 1}`} defaultOpen={idx === 0}>
          <PropRow label="Image" stack>
            <ImageUpload
              src={slide.image}
              onChange={(v) => updateSlide(slide.id, 'image', v)}
            />
          </PropRow>
          <PropRow label="Heading" stack>
            <TextInput
              value={slide.heading ?? ''}
              onChange={(v) => updateSlide(slide.id, 'heading', v)}
              placeholder="Slide heading"
            />
          </PropRow>
          <PropRow label="Caption" stack>
            <TextInput
              value={slide.caption ?? ''}
              onChange={(v) => updateSlide(slide.id, 'caption', v)}
              placeholder="Slide caption"
            />
          </PropRow>
          <button
            onClick={() => removeSlide(slide.id)}
            disabled={content.slides.length <= 1}
            style={{
              alignSelf: 'flex-start',
              padding: '4px 10px',
              fontSize: '0.75rem',
              border: '1px solid #fca5a5',
              borderRadius: 4,
              background: 'none',
              color: '#ef4444',
              cursor: content.slides.length <= 1 ? 'not-allowed' : 'pointer',
              opacity: content.slides.length <= 1 ? 0.4 : 1,
            }}
          >
            Remove slide
          </button>
        </PropGroup>
      ))}

      <div style={{ padding: '8px 16px' }}>
        <button
          onClick={addSlide}
          style={{
            width: '100%',
            padding: '7px',
            fontSize: '0.8125rem',
            border: '1px dashed var(--color-border)',
            borderRadius: 6,
            background: 'none',
            color: 'var(--color-text-secondary)',
            cursor: 'pointer',
          }}
        >
          + Add slide
        </button>
      </div>

      <PropGroup label="Style">
        <PropRow label="Border radius">
          <NumberInput
            value={styles.borderRadius ?? ''}
            onChange={(v) => patchStyle('borderRadius', v)}
            placeholder="10"
          />
        </PropRow>
        <PropRow label="Padding" stack>
          <SpacingControl value={styles.padding ?? '0px'} onChange={(v) => patchStyle('padding', v)} />
        </PropRow>
      </PropGroup>

      <CustomCSSField
        styles={styles}
        knownKeys={['borderRadius', 'padding']}
        onChange={(s) => updateElement(element.id, { styles: s })}
      />
    </>
  )
}
