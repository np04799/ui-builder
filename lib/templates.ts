import type { ElementContent, ResponsiveStyles, StyleMap } from '@/types/builder.types'
import type { ColumnNode, ElementNode, RowNode, SectionNode } from '@/types/store.types'

// ─────────────────────────────────────────────────────────────────────────────
// Template shape — a section with nested rows/columns/elements fully resolved
// ─────────────────────────────────────────────────────────────────────────────

export interface TemplateColumn {
  span?: Partial<Record<'desktop' | 'tablet' | 'mobile', number>>
  styles?: StyleMap
  responsive?: ResponsiveStyles
  elements: { content: ElementContent; styles?: StyleMap; responsive?: ResponsiveStyles }[]
}

export interface TemplateRow {
  styles?: StyleMap
  responsive?: ResponsiveStyles
  locked?: boolean
  columns: TemplateColumn[]
}

export interface TemplateSection {
  styles?: StyleMap
  responsive?: ResponsiveStyles
  rows: TemplateRow[]
}

export interface Template {
  id: string
  label: string
  category: 'banner' | 'cta' | 'form' | 'header'
  desc: string
  animated?: boolean
  section: TemplateSection
}

// ─────────────────────────────────────────────────────────────────────────────
// Helpers
// ─────────────────────────────────────────────────────────────────────────────

function uid() { return crypto.randomUUID() }

/**
 * Materialize a Template into normalized store nodes.
 * Returns all nodes ready to be spliced into the store.
 */
export function materializeTemplate(tpl: TemplateSection): {
  section: SectionNode
  rows: RowNode[]
  columns: ColumnNode[]
  elements: ElementNode[]
} {
  const sectionId = uid()
  const rows: RowNode[] = []
  const columns: ColumnNode[] = []
  const elements: ElementNode[] = []
  const rowIds: string[] = []

  for (const rowDef of tpl.rows) {
    const rowId = uid()
    const columnIds: string[] = []

    for (const colDef of rowDef.columns) {
      const colId = uid()
      const elementIds: string[] = []

      for (const elDef of colDef.elements) {
        const elemId = uid()
        elements.push({
          id: elemId,
          columnId: colId,
          content: elDef.content,
          styles: elDef.styles ?? {},
          responsive: elDef.responsive ?? {},
        })
        elementIds.push(elemId)
      }

      columns.push({
        id: colId,
        rowId,
        elementIds,
        styles: colDef.styles ?? {},
        responsive: colDef.responsive ?? {},
        ...(colDef.span ? { span: colDef.span } : {}),
      })
      columnIds.push(colId)
    }

    rows.push({
      id: rowId,
      sectionId,
      columnIds,
      styles: rowDef.styles ?? {},
      responsive: rowDef.responsive ?? {},
      ...(rowDef.locked ? { locked: true } : {}),
    })
    rowIds.push(rowId)
  }

  return {
    section: {
      id: sectionId,
      rowIds,
      styles: tpl.styles ?? {},
      responsive: tpl.responsive ?? {},
    },
    rows,
    columns,
    elements,
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// Templates
// ─────────────────────────────────────────────────────────────────────────────

export const TEMPLATES: Template[] = [
  // ── BANNERS ─────────────────────────────────────────────────────────────────

  {
    id: 'banner-hero-gradient',
    label: 'Gradient Hero Banner',
    category: 'banner',
    desc: 'Full-width gradient hero with headline, subtext & CTA',
    section: {
      styles: {
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        padding: '80px 48px',
        textAlign: 'center',
      },
      responsive: {
        tablet: { padding: '60px 32px' },
        mobile: { padding: '48px 20px' },
      },
      rows: [{
        styles: { justifyContent: 'center', flexDirection: 'column', alignItems: 'center', gap: '20px' },
        columns: [{
          span: { desktop: 8, tablet: 10, mobile: 12 },
          styles: { display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '16px' },
          elements: [
            {
              content: { type: 'heading', level: 'h1', text: 'Build Faster. Launch Smarter.' },
              styles: { color: '#ffffff', fontSize: '52px', fontWeight: '800', lineHeight: '1.15', margin: '0', textAlign: 'center', letterSpacing: '-0.02em' },
              responsive: {
                tablet: { fontSize: '38px' },
                mobile: { fontSize: '28px', letterSpacing: '-0.01em' },
              },
            },
            {
              content: { type: 'paragraph', text: 'The no-code platform trusted by 50,000+ teams worldwide. Start building beautiful products in minutes, not months.' },
              styles: { color: 'rgba(255,255,255,0.85)', fontSize: '18px', lineHeight: '1.7', margin: '0', textAlign: 'center', maxWidth: '540px' },
              responsive: {
                tablet: { fontSize: '16px' },
                mobile: { fontSize: '15px' },
              },
            },
            {
              content: { type: 'button', text: 'Start Free Trial', href: '#', variant: 'primary', target: '_blank' },
              styles: { backgroundColor: '#ffffff', color: '#764ba2', borderRadius: '50px', padding: '14px 36px', fontSize: '15px', fontWeight: '700', border: 'none', boxShadow: '0 8px 30px rgba(0,0,0,0.2)' },
              responsive: {
                mobile: { padding: '12px 28px', fontSize: '14px' },
              },
            },
          ],
        }],
      }],
    },
  },

  {
    id: 'banner-dark-announcement',
    label: 'Dark Announcement Bar',
    category: 'banner',
    desc: 'Slim top-of-page announcement strip with link',
    section: {
      styles: {
        backgroundColor: '#0f172a',
        padding: '12px 24px',
      },
      rows: [{
        styles: { alignItems: 'center', justifyContent: 'center', gap: '12px', flexWrap: 'wrap' },
        columns: [
          {
            styles: { display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap', justifyContent: 'center' },
            elements: [
              {
                content: { type: 'paragraph', text: '🎉 Introducing BuilderPro 2.0 — Now with AI-powered layout suggestions.' },
                styles: { color: '#e2e8f0', fontSize: '14px', margin: '0', fontWeight: '500' },
              },
              {
                content: { type: 'button', text: 'See what\'s new →', href: '#', variant: 'ghost', target: '_self' },
                styles: { color: '#818cf8', fontSize: '14px', fontWeight: '600', background: 'none', border: 'none', padding: '0', cursor: 'pointer', textDecoration: 'underline' },
              },
            ],
          },
        ],
      }],
    },
  },

  {
    id: 'banner-product-feature',
    label: 'Product Feature Banner',
    category: 'banner',
    desc: 'Two-column banner — copy left, visual right',
    section: {
      styles: {
        backgroundColor: '#f8faff',
        padding: '64px 48px',
        borderBottom: '1px solid #e2e8f0',
      },
      responsive: {
        tablet: { padding: '48px 32px' },
        mobile: { padding: '40px 20px' },
      },
      rows: [{
        styles: { alignItems: 'center', gap: '48px' },
        responsive: {
          tablet: { gap: '32px' },
          mobile: { gap: '24px', flexDirection: 'column' },
        },
        columns: [
          {
            span: { desktop: 6, tablet: 12, mobile: 12 },
            styles: { display: 'flex', flexDirection: 'column', gap: '20px' },
            elements: [
              {
                content: { type: 'paragraph', text: 'NEW FEATURE' },
                styles: { color: '#4f46e5', fontSize: '12px', fontWeight: '700', letterSpacing: '0.12em', textTransform: 'uppercase', margin: '0' },
              },
              {
                content: { type: 'heading', level: 'h2', text: 'Visual drag-and-drop editing — reimagined.' },
                styles: { color: '#0f172a', fontSize: '40px', fontWeight: '800', lineHeight: '1.2', margin: '0', letterSpacing: '-0.02em' },
                responsive: {
                  tablet: { fontSize: '30px' },
                  mobile: { fontSize: '24px' },
                },
              },
              {
                content: { type: 'paragraph', text: 'Move, resize and style any element without touching a line of code. What you see is exactly what your visitors get.' },
                styles: { color: '#64748b', fontSize: '16px', lineHeight: '1.7', margin: '0' },
                responsive: {
                  mobile: { fontSize: '15px' },
                },
              },
              {
                content: { type: 'button', text: 'Try it free', href: '#', variant: 'primary' },
                styles: { backgroundColor: '#4f46e5', color: '#fff', padding: '12px 28px', borderRadius: '8px', fontSize: '15px', fontWeight: '600', border: 'none', display: 'inline-block', width: 'fit-content' },
              },
            ],
          },
          {
            span: { desktop: 6, tablet: 12, mobile: 12 },
            styles: { display: 'flex', alignItems: 'center', justifyContent: 'center' },
            elements: [
              {
                content: { type: 'image', src: 'https://images.unsplash.com/photo-1551650975-87deedd944c3?w=600&q=80', alt: 'Product screenshot', objectFit: 'cover' },
                styles: { borderRadius: '16px', width: '100%', boxShadow: '0 24px 60px rgba(0,0,0,0.12)' },
              },
            ],
          },
        ],
      }],
    },
  },

  // ── CTAs ─────────────────────────────────────────────────────────────────────

  {
    id: 'cta-centered-dark',
    label: 'Centered Dark CTA',
    category: 'cta',
    desc: 'Bold centered call-to-action on dark background',
    section: {
      styles: {
        backgroundColor: '#0f172a',
        padding: '96px 48px',
        textAlign: 'center',
      },
      responsive: {
        tablet: { padding: '72px 32px' },
        mobile: { padding: '56px 20px' },
      },
      rows: [{
        styles: { justifyContent: 'center' },
        columns: [{
          span: { desktop: 7, tablet: 10, mobile: 12 },
          styles: { display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '24px' },
          elements: [
            {
              content: { type: 'heading', level: 'h2', text: 'Ready to ship faster?' },
              styles: { color: '#f1f5f9', fontSize: '44px', fontWeight: '800', lineHeight: '1.15', margin: '0', letterSpacing: '-0.02em', textAlign: 'center' },
              responsive: {
                tablet: { fontSize: '34px' },
                mobile: { fontSize: '26px' },
              },
            },
            {
              content: { type: 'paragraph', text: 'Join 50,000 builders who use BuilderPro every day. Free plan available — no credit card required.' },
              styles: { color: '#94a3b8', fontSize: '17px', lineHeight: '1.7', margin: '0', textAlign: 'center' },
              responsive: {
                mobile: { fontSize: '15px' },
              },
            },
            {
              content: { type: 'button', text: 'Get started for free', href: '#', variant: 'primary' },
              styles: { backgroundColor: '#4f46e5', color: '#fff', padding: '16px 40px', borderRadius: '10px', fontSize: '16px', fontWeight: '700', border: 'none', boxShadow: '0 0 0 1px rgba(79,70,229,0.3), 0 8px 24px rgba(79,70,229,0.4)' },
              responsive: {
                mobile: { padding: '14px 28px', fontSize: '15px' },
              },
            },
            {
              content: { type: 'paragraph', text: '✓ Free forever plan  ✓ No credit card  ✓ Cancel anytime' },
              styles: { color: '#475569', fontSize: '13px', margin: '0', letterSpacing: '0.01em' },
            },
          ],
        }],
      }],
    },
  },

  {
    id: 'cta-split-gradient',
    label: 'Split Gradient CTA',
    category: 'cta',
    desc: 'Left headline, right dual-button layout with gradient accent',
    section: {
      styles: {
        background: 'linear-gradient(120deg, #4f46e5 0%, #7c3aed 100%)',
        padding: '64px 56px',
        borderRadius: '16px',
        margin: '0 24px',
      },
      responsive: {
        tablet: { padding: '48px 32px', margin: '0 16px' },
        mobile: { padding: '40px 20px', margin: '0 12px', borderRadius: '12px' },
      },
      rows: [{
        styles: { alignItems: 'center', gap: '40px' },
        responsive: {
          mobile: { flexDirection: 'column', gap: '24px' },
        },
        columns: [
          {
            span: { desktop: 7, tablet: 12, mobile: 12 },
            styles: { display: 'flex', flexDirection: 'column', gap: '16px' },
            elements: [
              {
                content: { type: 'heading', level: 'h2', text: 'Start building for free today.' },
                styles: { color: '#ffffff', fontSize: '38px', fontWeight: '800', lineHeight: '1.2', margin: '0', letterSpacing: '-0.02em' },
                responsive: {
                  tablet: { fontSize: '28px' },
                  mobile: { fontSize: '24px', textAlign: 'center' },
                },
              },
              {
                content: { type: 'paragraph', text: 'Everything you need to launch a professional website. Upgrade when you grow.' },
                styles: { color: 'rgba(255,255,255,0.8)', fontSize: '16px', lineHeight: '1.65', margin: '0' },
                responsive: {
                  mobile: { fontSize: '15px', textAlign: 'center' },
                },
              },
            ],
          },
          {
            span: { desktop: 5, tablet: 12, mobile: 12 },
            styles: { display: 'flex', gap: '12px', alignItems: 'center', justifyContent: 'flex-end', flexWrap: 'wrap' },
            responsive: {
              mobile: { justifyContent: 'center' },
            },
            elements: [
              {
                content: { type: 'button', text: 'Get started free', href: '#', variant: 'primary' },
                styles: { backgroundColor: '#ffffff', color: '#4f46e5', padding: '14px 28px', borderRadius: '8px', fontSize: '15px', fontWeight: '700', border: 'none', whiteSpace: 'nowrap' },
              },
              {
                content: { type: 'button', text: 'See pricing', href: '#', variant: 'outline' },
                styles: { backgroundColor: 'transparent', color: '#ffffff', padding: '14px 28px', borderRadius: '8px', fontSize: '15px', fontWeight: '600', border: '2px solid rgba(255,255,255,0.5)', whiteSpace: 'nowrap' },
              },
            ],
          },
        ],
      }],
    },
  },

  {
    id: 'cta-minimal-bordered',
    label: 'Minimal Bordered CTA',
    category: 'cta',
    desc: 'Clean light CTA card with border and social proof',
    section: {
      styles: {
        padding: '48px',
        border: '1px solid #e2e8f0',
        borderRadius: '20px',
        backgroundColor: '#ffffff',
        margin: '0 24px',
        boxShadow: '0 4px 24px rgba(0,0,0,0.05)',
      },
      responsive: {
        tablet: { padding: '36px', margin: '0 16px' },
        mobile: { padding: '24px 20px', margin: '0 12px', borderRadius: '12px' },
      },
      rows: [
        {
          styles: { alignItems: 'center', gap: '32px', marginBottom: '32px' },
          responsive: {
            mobile: { flexDirection: 'column', gap: '20px', marginBottom: '20px' },
          },
          columns: [
            {
              span: { desktop: 8, tablet: 12, mobile: 12 },
              styles: { display: 'flex', flexDirection: 'column', gap: '12px' },
              elements: [
                {
                  content: { type: 'heading', level: 'h3', text: 'Thousands of teams ship with BuilderPro' },
                  styles: { color: '#0f172a', fontSize: '28px', fontWeight: '700', lineHeight: '1.25', margin: '0' },
                  responsive: {
                    tablet: { fontSize: '22px' },
                    mobile: { fontSize: '20px' },
                  },
                },
                {
                  content: { type: 'paragraph', text: 'From solo makers to enterprise teams — one platform for all your web projects.' },
                  styles: { color: '#64748b', fontSize: '15px', lineHeight: '1.6', margin: '0' },
                },
              ],
            },
            {
              span: { desktop: 4, tablet: 12, mobile: 12 },
              styles: { display: 'flex', justifyContent: 'flex-end', alignItems: 'center' },
              responsive: {
                mobile: { justifyContent: 'center' },
              },
              elements: [
                {
                  content: { type: 'button', text: 'Start building →', href: '#', variant: 'primary' },
                  styles: { backgroundColor: '#0f172a', color: '#fff', padding: '14px 28px', borderRadius: '8px', fontSize: '15px', fontWeight: '600', border: 'none', whiteSpace: 'nowrap' },
                },
              ],
            },
          ],
        },
        {
          styles: { borderTop: '1px solid #f1f5f9', paddingTop: '24px', gap: '32px' },
          columns: [
            {
              styles: { display: 'flex', gap: '32px', flexWrap: 'wrap' },
              elements: [
                {
                  content: { type: 'paragraph', text: '★★★★★  4.9/5 from 2,400+ reviews' },
                  styles: { color: '#f59e0b', fontSize: '13px', fontWeight: '600', margin: '0' },
                },
                {
                  content: { type: 'paragraph', text: '50,000+ websites built' },
                  styles: { color: '#94a3b8', fontSize: '13px', margin: '0' },
                },
                {
                  content: { type: 'paragraph', text: 'SOC2 & GDPR compliant' },
                  styles: { color: '#94a3b8', fontSize: '13px', margin: '0' },
                },
              ],
            },
          ],
        },
      ],
    },
  },

  // ── FORMS ────────────────────────────────────────────────────────────────────

  {
    id: 'form-newsletter',
    label: 'Newsletter Signup',
    category: 'form',
    desc: 'Minimal centered email capture with trust indicators',
    section: {
      styles: {
        backgroundColor: '#fafafa',
        padding: '80px 48px',
        textAlign: 'center',
        borderTop: '1px solid #f1f5f9',
        borderBottom: '1px solid #f1f5f9',
      },
      responsive: {
        tablet: { padding: '60px 32px' },
        mobile: { padding: '48px 20px' },
      },
      rows: [{
        styles: { justifyContent: 'center' },
        columns: [{
          span: { desktop: 6, tablet: 9, mobile: 12 },
          styles: { display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '20px' },
          elements: [
            {
              content: { type: 'paragraph', text: 'NEWSLETTER' },
              styles: { color: '#4f46e5', fontSize: '11px', fontWeight: '700', letterSpacing: '0.14em', textTransform: 'uppercase', margin: '0' },
            },
            {
              content: { type: 'heading', level: 'h2', text: 'Stay ahead of the curve.' },
              styles: { color: '#0f172a', fontSize: '36px', fontWeight: '800', lineHeight: '1.2', margin: '0', letterSpacing: '-0.02em', textAlign: 'center' },
              responsive: {
                tablet: { fontSize: '28px' },
                mobile: { fontSize: '24px' },
              },
            },
            {
              content: { type: 'paragraph', text: 'Weekly insights on design, development and product strategy. Join 14,000 subscribers.' },
              styles: { color: '#64748b', fontSize: '16px', lineHeight: '1.65', margin: '0', textAlign: 'center' },
              responsive: {
                mobile: { fontSize: '15px' },
              },
            },
            {
              content: {
                type: 'form',
                submitLabel: 'Subscribe →',
                fields: [
                  { id: crypto.randomUUID(), type: 'email', label: 'Email address', placeholder: 'you@example.com', required: true },
                ],
              },
              styles: { width: '100%' },
            },
            {
              content: { type: 'paragraph', text: '🔒 No spam, ever. Unsubscribe in one click.' },
              styles: { color: '#94a3b8', fontSize: '12px', margin: '0', textAlign: 'center' },
            },
          ],
        }],
      }],
    },
  },

  {
    id: 'form-contact',
    label: 'Contact Form',
    category: 'form',
    desc: 'Two-column contact section — details left, form right',
    section: {
      styles: {
        backgroundColor: '#ffffff',
        padding: '80px 48px',
      },
      responsive: {
        tablet: { padding: '60px 32px' },
        mobile: { padding: '48px 20px' },
      },
      rows: [{
        styles: { gap: '64px', alignItems: 'flex-start' },
        responsive: {
          tablet: { gap: '40px' },
          mobile: { gap: '32px', flexDirection: 'column' },
        },
        columns: [
          {
            span: { desktop: 5, tablet: 12, mobile: 12 },
            styles: { display: 'flex', flexDirection: 'column', gap: '24px' },
            elements: [
              {
                content: { type: 'heading', level: 'h2', text: 'Get in touch' },
                styles: { color: '#0f172a', fontSize: '36px', fontWeight: '800', margin: '0', lineHeight: '1.2', letterSpacing: '-0.02em' },
                responsive: {
                  tablet: { fontSize: '28px' },
                  mobile: { fontSize: '24px' },
                },
              },
              {
                content: { type: 'paragraph', text: 'Have a project in mind or just want to say hello? Fill in the form and we\'ll get back to you within 24 hours.' },
                styles: { color: '#64748b', fontSize: '15px', lineHeight: '1.7', margin: '0' },
              },
              {
                content: { type: 'paragraph', text: '📧 hello@builderpro.io\n📍 San Francisco, CA\n⏱ Reply within 24 hours' },
                styles: { color: '#475569', fontSize: '14px', lineHeight: '2', margin: '0' },
              },
            ],
          },
          {
            span: { desktop: 7, tablet: 12, mobile: 12 },
            styles: { backgroundColor: '#f8fafc', padding: '36px', borderRadius: '16px', border: '1px solid #e2e8f0' },
            elements: [
              {
                content: {
                  type: 'form',
                  submitLabel: 'Send message',
                  fields: [
                    { id: crypto.randomUUID(), type: 'text', label: 'Full name', placeholder: 'Jane Smith', required: true },
                    { id: crypto.randomUUID(), type: 'email', label: 'Email address', placeholder: 'jane@company.com', required: true },
                    { id: crypto.randomUUID(), type: 'text', label: 'Subject', placeholder: 'What\'s this about?', required: false },
                    { id: crypto.randomUUID(), type: 'textarea', label: 'Message', placeholder: 'Tell us about your project…', required: true },
                  ],
                },
                styles: {},
              },
            ],
          },
        ],
      }],
    },
  },

  {
    id: 'form-waitlist',
    label: 'Waitlist / Early Access',
    category: 'form',
    desc: 'Full-width launch waitlist with gradient and email capture',
    section: {
      styles: {
        background: 'linear-gradient(160deg, #0f172a 0%, #1e1b4b 50%, #0f172a 100%)',
        padding: '96px 48px',
        textAlign: 'center',
      },
      responsive: {
        tablet: { padding: '72px 32px' },
        mobile: { padding: '56px 20px' },
      },
      rows: [{
        styles: { justifyContent: 'center' },
        columns: [{
          span: { desktop: 6, tablet: 9, mobile: 12 },
          styles: { display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '24px' },
          elements: [
            {
              content: { type: 'paragraph', text: 'COMING SOON' },
              styles: { color: '#818cf8', fontSize: '11px', fontWeight: '700', letterSpacing: '0.16em', textTransform: 'uppercase', margin: '0' },
            },
            {
              content: { type: 'heading', level: 'h1', text: 'Something big is on its way.' },
              styles: { color: '#f1f5f9', fontSize: '48px', fontWeight: '800', lineHeight: '1.15', margin: '0', letterSpacing: '-0.025em', textAlign: 'center' },
              responsive: {
                tablet: { fontSize: '36px' },
                mobile: { fontSize: '28px', letterSpacing: '-0.015em' },
              },
            },
            {
              content: { type: 'paragraph', text: 'Be the first to know when we launch. Early access members get 3 months free and exclusive founding-member perks.' },
              styles: { color: '#94a3b8', fontSize: '17px', lineHeight: '1.7', margin: '0', textAlign: 'center' },
              responsive: {
                mobile: { fontSize: '15px' },
              },
            },
            {
              content: {
                type: 'form',
                submitLabel: 'Join the waitlist',
                fields: [
                  { id: crypto.randomUUID(), type: 'email', label: 'Work email', placeholder: 'you@company.com', required: true },
                ],
              },
              styles: { width: '100%' },
            },
            {
              content: { type: 'paragraph', text: '🚀 2,847 people already on the list' },
              styles: { color: '#475569', fontSize: '13px', margin: '0' },
            },
          ],
        }],
      }],
    },
  },

  // ── ANIMATED 3D BANNERS ──────────────────────────────────────────────────────

  {
    id: 'banner-3d-cosmic',
    label: '3D Cosmic Hero',
    category: 'banner',
    animated: true,
    desc: 'Dark space theme with floating orbs, grid & glowing CTA',
    section: {
      styles: { padding: '0' },
      rows: [{
        columns: [{
          elements: [{
            content: {
              type: 'banner-3d',
              heading: 'Next-Gen Platform',
              subtext: 'Built for speed. Designed for scale. Ready for tomorrow.',
              cta: 'Get Started Free',
              ctaHref: '#',
            },
            styles: {},
          }],
        }],
      }],
    },
  },

  {
    id: 'banner-morph-creative',
    label: 'Morphing Blob Banner',
    category: 'banner',
    animated: true,
    desc: 'Fluid animated blobs, floating dots, slide-in copy — light bg',
    section: {
      styles: { padding: '0' },
      rows: [{
        columns: [{
          elements: [{
            content: {
              type: 'banner-morph',
              heading: 'Design Without Limits',
              subtext: 'A canvas that moves with your ideas. Fluid. Alive. Yours.',
              badge: 'Creative Studio',
              cta: 'Start Creating',
              ctaHref: '#',
            },
            styles: {},
          }],
        }],
      }],
    },
  },

  {
    id: 'banner-ticker-dark',
    label: 'Ticker Tape Banner',
    category: 'banner',
    animated: true,
    desc: 'Dark hero with shimmer badge, fade-up copy & animated ticker strip',
    section: {
      styles: { padding: '0' },
      rows: [{
        columns: [{
          elements: [{
            content: {
              type: 'banner-ticker',
              heading: 'The Platform Pros Choose',
              subtext: 'Everything you need to ship world-class products — ready to go.',
              cta: 'Start Free',
              ctaHref: '#',
              tickerItems: [
                '⚡ 10× Faster Builds',
                '🎨 Pixel-Perfect Design',
                '🚀 One-Click Deploy',
                '🔒 Enterprise Security',
                '🌍 Global CDN',
                '💡 AI-Powered Suggestions',
                '📱 Mobile-First Responsive',
                '🔗 200+ Integrations',
              ],
            },
            styles: {},
          }],
        }],
      }],
    },
  },

  {
    id: 'banner-split-3d',
    label: '3D Split Hero',
    category: 'banner',
    animated: true,
    desc: 'Two-column: animated copy + perspective card stack with floating badges',
    section: {
      styles: { padding: '0' },
      rows: [{
        columns: [{
          elements: [{
            content: {
              type: 'banner-split',
              heading: 'Ship Beautiful Products, Faster',
              subtext: 'The visual builder that replaces your whole frontend workflow — from wireframe to production in hours.',
              cta: 'Start building free',
              ctaHref: '#',
              ctaSecondary: 'Watch demo',
              stats: [
                { value: '50K+', label: 'Active users' },
                { value: '99.9%', label: 'Uptime SLA' },
                { value: '2.4s', label: 'Avg load time' },
              ],
            },
            styles: {},
          }],
        }],
      }],
    },
  },

  {
    id: 'banner-glass-hero',
    label: 'Glassmorphism Hero',
    category: 'banner',
    animated: true,
    desc: 'Layered glass card on deep blue with floating 3D glass tiles',
    section: {
      styles: { padding: '0' },
      rows: [{ columns: [{ elements: [{ content: { type: 'banner-glass', heading: 'The Future Is Transparent', subtext: 'Glassmorphism meets modern design. Beautiful, layered, alive.', cta: 'Explore Now', ctaHref: '#' }, styles: {} }] }] }],
    },
  },

  {
    id: 'banner-neon-glow',
    label: 'Neon Glow Banner',
    category: 'banner',
    animated: true,
    desc: 'Cyber-noir dark background with neon grid, glow lines and electric CTA',
    section: {
      styles: { padding: '0' },
      rows: [{ columns: [{ elements: [{ content: { type: 'banner-neon', heading: 'Glow Different', subtext: 'Neon aesthetics for the bold. Stand out from the noise.', cta: 'Light It Up', ctaHref: '#' }, styles: {} }] }] }],
    },
  },

  {
    id: 'banner-aurora-sky',
    label: 'Aurora Borealis Hero',
    category: 'banner',
    animated: true,
    desc: 'Northern lights gradient sky with star field and glowing orbs',
    section: {
      styles: { padding: '0' },
      rows: [{ columns: [{ elements: [{ content: { type: 'banner-aurora', heading: 'Where Ideas Come Alive', subtext: 'Aurora-lit creativity, infinite possibilities, zero compromise.', badge: 'New Era', cta: 'Begin Your Journey', ctaHref: '#' }, styles: {} }] }] }],
    },
  },

  {
    id: 'banner-retro-wave',
    label: 'Synthwave Retro',
    category: 'banner',
    animated: true,
    desc: 'Synthwave sun, perspective grid floor and chromatic gradient text',
    section: {
      styles: { padding: '0' },
      rows: [{ columns: [{ elements: [{ content: { type: 'banner-retro', heading: 'Retro Wave', subtext: 'Synthwave aesthetics for the digital age. Bold stripes, bold vision.', cta: 'Ride the Wave', ctaHref: '#' }, styles: {} }] }] }],
    },
  },

  {
    id: 'banner-particle-net',
    label: 'Particle Network Hero',
    category: 'banner',
    animated: true,
    desc: 'Floating connected particles with 3D perspective rings on dark field',
    section: {
      styles: { padding: '0' },
      rows: [{ columns: [{ elements: [{ content: { type: 'banner-particle', heading: 'Particles of Innovation', subtext: 'Every pixel has purpose. Every moment, an opportunity to connect.', cta: 'Join the Movement', ctaHref: '#' }, styles: {} }] }] }],
    },
  },

  // ── HEADERS ──────────────────────────────────────────────────────────────────
  // Logo is served from /logo.svg (public/logo.svg).
  // All headers: desktop = full nav, tablet = logo + CTA only (nav hidden),
  // mobile = logo only (nav + secondary CTA hidden, primary CTA kept).

  {
    id: 'header-classic-light',
    label: 'Classic Light Header',
    category: 'header',
    desc: 'Logo left, nav center, CTA button right — clean white navbar',
    section: {
      styles: {
        backgroundColor: '#ffffff',
        borderBottom: '1px solid #e5e7eb',
        padding: '0 48px',
        position: 'sticky',
        top: '0',
        zIndex: '100',
        boxShadow: '0 1px 3px rgba(0,0,0,0.06)',
      },
      responsive: {
        tablet: { padding: '0 24px' },
        mobile: { padding: '0 16px' },
      },
      rows: [{
        locked: true,
        styles: { alignItems: 'center', justifyContent: 'space-between', minHeight: '64px', flexWrap: 'nowrap', gap: '16px' },
        columns: [
          {
            span: { desktop: 3, tablet: 5, mobile: 7 },
            styles: { display: 'flex', alignItems: 'center', flexShrink: '0', minWidth: '0' },
            elements: [
              {
                content: { type: 'image', src: '/logo.svg', alt: 'UI Builder — Connect ideas. Build websites.', objectFit: 'contain' },
                styles: { height: '36px', width: '180px', display: 'block', objectFit: 'contain', flexShrink: '0' },
              },
            ],
          },
          {
            span: { desktop: 6, tablet: 0, mobile: 0 },
            styles: { display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '32px' },
            responsive: {
              tablet: { display: 'none' },
              mobile: { display: 'none' },
            },
            elements: [
              { content: { type: 'button', text: 'Products', href: '#', variant: 'ghost' }, styles: { color: '#374151', fontSize: '14px', fontWeight: '500', background: 'none', border: 'none', padding: '0', cursor: 'pointer', whiteSpace: 'nowrap' } },
              { content: { type: 'button', text: 'Templates', href: '#', variant: 'ghost' }, styles: { color: '#374151', fontSize: '14px', fontWeight: '500', background: 'none', border: 'none', padding: '0', cursor: 'pointer', whiteSpace: 'nowrap' } },
              { content: { type: 'button', text: 'Pricing', href: '#', variant: 'ghost' }, styles: { color: '#374151', fontSize: '14px', fontWeight: '500', background: 'none', border: 'none', padding: '0', cursor: 'pointer', whiteSpace: 'nowrap' } },
              { content: { type: 'button', text: 'Blog', href: '#', variant: 'ghost' }, styles: { color: '#374151', fontSize: '14px', fontWeight: '500', background: 'none', border: 'none', padding: '0', cursor: 'pointer', whiteSpace: 'nowrap' } },
            ],
          },
          {
            span: { desktop: 3, tablet: 7, mobile: 5 },
            styles: { display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '12px', flexShrink: '0' },
            elements: [
              {
                content: { type: 'button', text: 'Sign in', href: '#', variant: 'ghost' },
                styles: { color: '#374151', fontSize: '14px', fontWeight: '500', background: 'none', border: 'none', padding: '0', cursor: 'pointer', whiteSpace: 'nowrap' },
                responsive: { mobile: { display: 'none' } },
              },
              { content: { type: 'button', text: 'Get started', href: '#', variant: 'primary' }, styles: { backgroundColor: '#4f46e5', color: '#ffffff', padding: '9px 20px', borderRadius: '8px', fontSize: '14px', fontWeight: '600', border: 'none', whiteSpace: 'nowrap' } },
            ],
          },
        ],
      }],
    },
  },
]

// Placeholder to keep the rest of the removed header templates — will be re-added once each is fixed
const _removedHeaderTemplates = [
  {
    id: 'header-dark-pro',
    label: 'Dark Pro Header',
    category: 'header',
    desc: 'Dark navbar with logo, nav links and dual action buttons',
    section: {
      styles: {
        backgroundColor: '#0f172a',
        padding: '0 48px',
        borderBottom: '1px solid rgba(255,255,255,0.08)',
        position: 'sticky',
        top: '0',
        zIndex: '100',
      },
      responsive: {
        tablet: { padding: '0 24px' },
        mobile: { padding: '0 16px' },
      },
      rows: [{
        locked: true,
        styles: { alignItems: 'center', justifyContent: 'space-between', minHeight: '64px', flexWrap: 'nowrap', gap: '16px' },
        columns: [
          {
            span: { desktop: 3, tablet: 5, mobile: 7 },
            styles: { display: 'flex', alignItems: 'center', flexShrink: '0', minWidth: '0' },
            elements: [
              {
                content: { type: 'image', src: '/logo.svg', alt: 'UI Builder', objectFit: 'contain' },
                styles: { height: '34px', width: '170px', display: 'block', objectFit: 'contain', flexShrink: '0', filter: 'brightness(0) invert(1)' },
              },
            ],
          },
          {
            span: { desktop: 6, tablet: 0, mobile: 0 },
            styles: { display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '28px' },
            responsive: {
              tablet: { display: 'none' },
              mobile: { display: 'none' },
            },
            elements: [
              { content: { type: 'button', text: 'Features', href: '#', variant: 'ghost' }, styles: { color: '#94a3b8', fontSize: '14px', fontWeight: '500', background: 'none', border: 'none', padding: '0', cursor: 'pointer', whiteSpace: 'nowrap' } },
              { content: { type: 'button', text: 'Templates', href: '#', variant: 'ghost' }, styles: { color: '#94a3b8', fontSize: '14px', fontWeight: '500', background: 'none', border: 'none', padding: '0', cursor: 'pointer', whiteSpace: 'nowrap' } },
              { content: { type: 'button', text: 'Pricing', href: '#', variant: 'ghost' }, styles: { color: '#94a3b8', fontSize: '14px', fontWeight: '500', background: 'none', border: 'none', padding: '0', cursor: 'pointer', whiteSpace: 'nowrap' } },
              { content: { type: 'button', text: 'Docs', href: '#', variant: 'ghost' }, styles: { color: '#94a3b8', fontSize: '14px', fontWeight: '500', background: 'none', border: 'none', padding: '0', cursor: 'pointer', whiteSpace: 'nowrap' } },
            ],
          },
          {
            span: { desktop: 3, tablet: 7, mobile: 5 },
            styles: { display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '10px', flexShrink: '0' },
            elements: [
              {
                content: { type: 'button', text: 'Log in', href: '#', variant: 'ghost' },
                styles: { color: '#94a3b8', fontSize: '14px', fontWeight: '500', background: 'none', border: 'none', padding: '0', cursor: 'pointer', whiteSpace: 'nowrap' },
                responsive: { mobile: { display: 'none' } },
              },
              { content: { type: 'button', text: 'Start free →', href: '#', variant: 'primary' }, styles: { backgroundColor: '#4f46e5', color: '#ffffff', padding: '9px 18px', borderRadius: '7px', fontSize: '13px', fontWeight: '600', border: 'none', whiteSpace: 'nowrap' } },
            ],
          },
        ],
      }],
    },
  },

  {
    id: 'header-gradient-brand',
    label: 'Gradient Brand Header',
    category: 'header',
    desc: 'Indigo-to-purple gradient header with logo and navigation',
    section: {
      styles: {
        background: 'linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%)',
        padding: '0 48px',
        position: 'sticky',
        top: '0',
        zIndex: '100',
      },
      responsive: {
        tablet: { padding: '0 24px' },
        mobile: { padding: '0 16px' },
      },
      rows: [{
        locked: true,
        styles: { alignItems: 'center', justifyContent: 'space-between', minHeight: '64px', flexWrap: 'nowrap', gap: '16px' },
        columns: [
          {
            span: { desktop: 3, tablet: 5, mobile: 7 },
            styles: { display: 'flex', alignItems: 'center', flexShrink: '0', minWidth: '0' },
            elements: [
              {
                content: { type: 'image', src: '/logo.svg', alt: 'UI Builder', objectFit: 'contain' },
                styles: { height: '34px', width: '170px', display: 'block', objectFit: 'contain', flexShrink: '0', filter: 'brightness(0) invert(1)' },
              },
            ],
          },
          {
            span: { desktop: 6, tablet: 0, mobile: 0 },
            styles: { display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '28px' },
            responsive: {
              tablet: { display: 'none' },
              mobile: { display: 'none' },
            },
            elements: [
              { content: { type: 'button', text: 'Products', href: '#', variant: 'ghost' }, styles: { color: 'rgba(255,255,255,0.85)', fontSize: '14px', fontWeight: '500', background: 'none', border: 'none', padding: '0', cursor: 'pointer', whiteSpace: 'nowrap' } },
              { content: { type: 'button', text: 'Templates', href: '#', variant: 'ghost' }, styles: { color: 'rgba(255,255,255,0.85)', fontSize: '14px', fontWeight: '500', background: 'none', border: 'none', padding: '0', cursor: 'pointer', whiteSpace: 'nowrap' } },
              { content: { type: 'button', text: 'Pricing', href: '#', variant: 'ghost' }, styles: { color: 'rgba(255,255,255,0.85)', fontSize: '14px', fontWeight: '500', background: 'none', border: 'none', padding: '0', cursor: 'pointer', whiteSpace: 'nowrap' } },
              { content: { type: 'button', text: 'About', href: '#', variant: 'ghost' }, styles: { color: 'rgba(255,255,255,0.85)', fontSize: '14px', fontWeight: '500', background: 'none', border: 'none', padding: '0', cursor: 'pointer', whiteSpace: 'nowrap' } },
            ],
          },
          {
            span: { desktop: 3, tablet: 7, mobile: 5 },
            styles: { display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '12px', flexShrink: '0' },
            elements: [
              {
                content: { type: 'button', text: 'Sign in', href: '#', variant: 'ghost' },
                styles: { color: 'rgba(255,255,255,0.85)', fontSize: '14px', fontWeight: '500', background: 'none', border: 'none', padding: '0', cursor: 'pointer', whiteSpace: 'nowrap' },
                responsive: { mobile: { display: 'none' } },
              },
              { content: { type: 'button', text: 'Get started', href: '#', variant: 'outline' }, styles: { backgroundColor: 'rgba(255,255,255,0.15)', color: '#ffffff', padding: '9px 20px', borderRadius: '8px', fontSize: '14px', fontWeight: '600', border: '1.5px solid rgba(255,255,255,0.5)', whiteSpace: 'nowrap' } },
            ],
          },
        ],
      }],
    },
  },

  {
    id: 'header-minimal-center',
    label: 'Minimal Centered Header',
    category: 'header',
    desc: 'Logo centered, minimal links — ultra-clean minimal style',
    section: {
      styles: {
        backgroundColor: '#ffffff',
        borderBottom: '1px solid #f3f4f6',
        padding: '0 48px',
      },
      responsive: {
        tablet: { padding: '0 24px' },
        mobile: { padding: '0 16px' },
      },
      rows: [{
        locked: true,
        styles: { alignItems: 'center', justifyContent: 'space-between', minHeight: '72px', flexWrap: 'nowrap', gap: '16px' },
        columns: [
          {
            span: { desktop: 3, tablet: 4, mobile: 5 },
            styles: { display: 'flex', alignItems: 'center', gap: '20px' },
            responsive: {
              mobile: { gap: '0' },
            },
            elements: [
              {
                content: { type: 'button', text: 'Features', href: '#', variant: 'ghost' },
                styles: { color: '#6b7280', fontSize: '14px', fontWeight: '400', background: 'none', border: 'none', padding: '0', cursor: 'pointer', whiteSpace: 'nowrap' },
                responsive: { mobile: { display: 'none' } },
              },
              {
                content: { type: 'button', text: 'Pricing', href: '#', variant: 'ghost' },
                styles: { color: '#6b7280', fontSize: '14px', fontWeight: '400', background: 'none', border: 'none', padding: '0', cursor: 'pointer', whiteSpace: 'nowrap' },
                responsive: { mobile: { display: 'none' } },
              },
              {
                content: { type: 'image', src: '/logo.svg', alt: 'UI Builder', objectFit: 'contain' },
                styles: { height: '32px', width: '160px', display: 'none', objectFit: 'contain', flexShrink: '0' },
                responsive: { mobile: { display: 'block' } },
              },
            ],
          },
          {
            span: { desktop: 6, tablet: 4, mobile: 0 },
            styles: { display: 'flex', alignItems: 'center', justifyContent: 'center' },
            responsive: { mobile: { display: 'none' } },
            elements: [
              {
                content: { type: 'image', src: '/logo.svg', alt: 'UI Builder', objectFit: 'contain' },
                styles: { height: '32px', width: '160px', display: 'block', objectFit: 'contain', flexShrink: '0' },
              },
            ],
          },
          {
            span: { desktop: 3, tablet: 4, mobile: 7 },
            styles: { display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '16px', flexShrink: '0' },
            elements: [
              {
                content: { type: 'button', text: 'Sign in', href: '#', variant: 'ghost' },
                styles: { color: '#6b7280', fontSize: '14px', fontWeight: '400', background: 'none', border: 'none', padding: '0', cursor: 'pointer', whiteSpace: 'nowrap' },
                responsive: { mobile: { display: 'none' } },
              },
              { content: { type: 'button', text: 'Sign up', href: '#', variant: 'primary' }, styles: { backgroundColor: '#111827', color: '#ffffff', padding: '8px 18px', borderRadius: '6px', fontSize: '14px', fontWeight: '500', border: 'none', whiteSpace: 'nowrap' } },
            ],
          },
        ],
      }],
    },
  },

  {
    id: 'header-saas-transparent',
    label: 'SaaS Transparent Header',
    category: 'header',
    desc: 'Glassmorphism frosted header — overlays hero content with blur',
    section: {
      styles: {
        backgroundColor: 'rgba(255,255,255,0.75)',
        backdropFilter: 'blur(16px)',
        WebkitBackdropFilter: 'blur(16px)',
        borderBottom: '1px solid rgba(229,231,235,0.6)',
        padding: '0 48px',
        position: 'sticky',
        top: '0',
        zIndex: '100',
        boxShadow: '0 2px 20px rgba(0,0,0,0.05)',
      },
      responsive: {
        tablet: { padding: '0 24px' },
        mobile: { padding: '0 16px' },
      },
      rows: [{
        locked: true,
        styles: { alignItems: 'center', justifyContent: 'space-between', minHeight: '64px', flexWrap: 'nowrap', gap: '16px' },
        columns: [
          {
            span: { desktop: 3, tablet: 5, mobile: 7 },
            styles: { display: 'flex', alignItems: 'center', flexShrink: '0', minWidth: '0' },
            elements: [
              {
                content: { type: 'image', src: '/logo.svg', alt: 'UI Builder', objectFit: 'contain' },
                styles: { height: '32px', width: '160px', display: 'block', objectFit: 'contain', flexShrink: '0' },
              },
            ],
          },
          {
            span: { desktop: 6, tablet: 0, mobile: 0 },
            styles: { display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '32px' },
            responsive: {
              tablet: { display: 'none' },
              mobile: { display: 'none' },
            },
            elements: [
              { content: { type: 'button', text: 'Features', href: '#', variant: 'ghost' }, styles: { color: '#374151', fontSize: '14px', fontWeight: '500', background: 'none', border: 'none', padding: '0', cursor: 'pointer', whiteSpace: 'nowrap' } },
              { content: { type: 'button', text: 'Solutions', href: '#', variant: 'ghost' }, styles: { color: '#374151', fontSize: '14px', fontWeight: '500', background: 'none', border: 'none', padding: '0', cursor: 'pointer', whiteSpace: 'nowrap' } },
              { content: { type: 'button', text: 'Pricing', href: '#', variant: 'ghost' }, styles: { color: '#374151', fontSize: '14px', fontWeight: '500', background: 'none', border: 'none', padding: '0', cursor: 'pointer', whiteSpace: 'nowrap' } },
              { content: { type: 'button', text: 'Resources', href: '#', variant: 'ghost' }, styles: { color: '#374151', fontSize: '14px', fontWeight: '500', background: 'none', border: 'none', padding: '0', cursor: 'pointer', whiteSpace: 'nowrap' } },
            ],
          },
          {
            span: { desktop: 3, tablet: 7, mobile: 5 },
            styles: { display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '12px', flexShrink: '0' },
            elements: [
              {
                content: { type: 'button', text: 'Log in', href: '#', variant: 'ghost' },
                styles: { color: '#374151', fontSize: '14px', fontWeight: '500', background: 'none', border: 'none', padding: '0', cursor: 'pointer', whiteSpace: 'nowrap' },
                responsive: { mobile: { display: 'none' } },
              },
              { content: { type: 'button', text: 'Try for free', href: '#', variant: 'primary' }, styles: { background: 'linear-gradient(135deg,#4f46e5,#7c3aed)', color: '#ffffff', padding: '9px 20px', borderRadius: '8px', fontSize: '14px', fontWeight: '600', border: 'none', whiteSpace: 'nowrap', boxShadow: '0 4px 14px rgba(79,70,229,0.4)' } },
            ],
          },
        ],
      }],
    },
  },

  {
    id: 'header-enterprise-dark',
    label: 'Enterprise Dark Header',
    category: 'header',
    desc: 'Sophisticated dark header with logo, multi-section nav and badge',
    section: {
      styles: {
        backgroundColor: '#09090b',
        borderBottom: '1px solid rgba(255,255,255,0.06)',
        padding: '0 48px',
        position: 'sticky',
        top: '0',
        zIndex: '100',
      },
      responsive: {
        tablet: { padding: '0 24px' },
        mobile: { padding: '0 16px' },
      },
      rows: [{
        locked: true,
        styles: { alignItems: 'center', justifyContent: 'space-between', minHeight: '60px', flexWrap: 'nowrap', gap: '16px' },
        columns: [
          {
            span: { desktop: 4, tablet: 5, mobile: 7 },
            styles: { display: 'flex', alignItems: 'center', gap: '10px', flexShrink: '0', minWidth: '0' },
            elements: [
              {
                content: { type: 'image', src: '/logo.svg', alt: 'UI Builder', objectFit: 'contain' },
                styles: { height: '30px', width: '150px', display: 'block', objectFit: 'contain', flexShrink: '0', filter: 'brightness(0) invert(1)' },
              },
              {
                content: { type: 'paragraph', text: 'Enterprise' },
                styles: { fontSize: '10px', fontWeight: '700', color: '#a78bfa', backgroundColor: 'rgba(167,139,250,0.12)', border: '1px solid rgba(167,139,250,0.25)', borderRadius: '4px', padding: '2px 7px', letterSpacing: '0.06em', textTransform: 'uppercase', margin: '0', whiteSpace: 'nowrap' },
                responsive: { mobile: { display: 'none' } },
              },
            ],
          },
          {
            span: { desktop: 5, tablet: 0, mobile: 0 },
            styles: { display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '20px' },
            responsive: {
              tablet: { display: 'none' },
              mobile: { display: 'none' },
            },
            elements: [
              { content: { type: 'button', text: 'Platform', href: '#', variant: 'ghost' }, styles: { color: '#a1a1aa', fontSize: '13px', fontWeight: '500', background: 'none', border: 'none', padding: '0', cursor: 'pointer', whiteSpace: 'nowrap' } },
              { content: { type: 'button', text: 'Security', href: '#', variant: 'ghost' }, styles: { color: '#a1a1aa', fontSize: '13px', fontWeight: '500', background: 'none', border: 'none', padding: '0', cursor: 'pointer', whiteSpace: 'nowrap' } },
              { content: { type: 'button', text: 'Integrations', href: '#', variant: 'ghost' }, styles: { color: '#a1a1aa', fontSize: '13px', fontWeight: '500', background: 'none', border: 'none', padding: '0', cursor: 'pointer', whiteSpace: 'nowrap' } },
              { content: { type: 'button', text: 'Customers', href: '#', variant: 'ghost' }, styles: { color: '#a1a1aa', fontSize: '13px', fontWeight: '500', background: 'none', border: 'none', padding: '0', cursor: 'pointer', whiteSpace: 'nowrap' } },
              { content: { type: 'button', text: 'Pricing', href: '#', variant: 'ghost' }, styles: { color: '#a1a1aa', fontSize: '13px', fontWeight: '500', background: 'none', border: 'none', padding: '0', cursor: 'pointer', whiteSpace: 'nowrap' } },
            ],
          },
          {
            span: { desktop: 3, tablet: 7, mobile: 5 },
            styles: { display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '8px', flexShrink: '0' },
            elements: [
              {
                content: { type: 'button', text: 'Contact sales', href: '#', variant: 'outline' },
                styles: { color: '#e4e4e7', fontSize: '13px', fontWeight: '500', backgroundColor: 'transparent', border: '1px solid rgba(255,255,255,0.15)', padding: '7px 14px', borderRadius: '6px', whiteSpace: 'nowrap', cursor: 'pointer' },
                responsive: { mobile: { display: 'none' } },
              },
              { content: { type: 'button', text: 'Get demo', href: '#', variant: 'primary' }, styles: { backgroundColor: '#4f46e5', color: '#ffffff', padding: '7px 14px', borderRadius: '6px', fontSize: '13px', fontWeight: '600', border: 'none', whiteSpace: 'nowrap' } },
            ],
          },
        ],
      }],
    },
  },
]

export { _removedHeaderTemplates }