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
  category: 'banner' | 'cta' | 'form' | 'header' | 'ppc'
  desc: string
  animated?: boolean
  /** Single-section template (most templates) */
  section?: TemplateSection
  /** Multi-section / full-page template. When present, section is ignored. */
  sections?: TemplateSection[]
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


  // ─── PPC Page Template — Stellar Utah (Celestial Obsidian design system) ────

  {
    id: 'ppc-stellar-utah',
    label: 'Stellar Utah — Full Landing Page',
    category: 'ppc',
    desc: 'Complete luxury dark-sky resort landing page. 7 sections: nav, hero, experience, bortle guide, accommodations, newsletter, footer.',
    sections: [

      // 1. Navigation — glass header
      {
        styles: {
          backgroundColor: 'rgba(10,14,20,0.85)',
          backdropFilter: 'blur(20px)',
          borderBottom: '0.5px solid rgba(195,198,210,0.15)',
          padding: '0 80px',
          position: 'sticky',
          top: '0',
          zIndex: '100',
        },
        responsive: { tablet: { padding: '0 32px' }, mobile: { padding: '0 20px' } },
        rows: [{
          locked: true,
          styles: { alignItems: 'center', justifyContent: 'space-between', minHeight: '72px', flexWrap: 'nowrap', gap: '24px' },
          columns: [
            {
              span: { desktop: 3, tablet: 4, mobile: 8 },
              styles: { display: 'flex', alignItems: 'center', gap: '10px' },
              elements: [
                { content: { type: 'heading', level: 'h2', text: 'Stellar Utah' }, styles: { fontFamily: "'EB Garamond', serif", fontSize: '20px', fontWeight: '400', color: '#c3c6d2', margin: '0', letterSpacing: '0.03em' } },
              ],
            },
            {
              span: { desktop: 6, tablet: 0, mobile: 0 },
              styles: { display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '40px' },
              responsive: { tablet: { display: 'none' }, mobile: { display: 'none' } },
              elements: [
                { content: { type: 'button', text: 'The Experience', href: '#experience', variant: 'ghost' }, styles: { fontFamily: "'Space Grotesk', sans-serif", color: '#c6c6cb', fontSize: '14px', fontWeight: '500', letterSpacing: '0.1em', background: 'none', border: 'none', padding: '0', textDecoration: 'none', cursor: 'pointer' } },
                { content: { type: 'button', text: 'Dark Sky Guide', href: '#guide', variant: 'ghost' }, styles: { fontFamily: "'Space Grotesk', sans-serif", color: '#c6c6cb', fontSize: '14px', fontWeight: '500', letterSpacing: '0.1em', background: 'none', border: 'none', padding: '0', textDecoration: 'none', cursor: 'pointer' } },
                { content: { type: 'button', text: 'Accommodations', href: '#accommodations', variant: 'ghost' }, styles: { fontFamily: "'Space Grotesk', sans-serif", color: '#c6c6cb', fontSize: '14px', fontWeight: '500', letterSpacing: '0.1em', background: 'none', border: 'none', padding: '0', textDecoration: 'none', cursor: 'pointer' } },
                { content: { type: 'button', text: 'Calendar', href: '#calendar', variant: 'ghost' }, styles: { fontFamily: "'Space Grotesk', sans-serif", color: '#c6c6cb', fontSize: '14px', fontWeight: '500', letterSpacing: '0.1em', background: 'none', border: 'none', padding: '0', textDecoration: 'none', cursor: 'pointer' } },
              ],
            },
            {
              span: { desktop: 3, tablet: 8, mobile: 4 },
              styles: { display: 'flex', alignItems: 'center', justifyContent: 'flex-end' },
              elements: [
                { content: { type: 'button', text: 'Book Your Escape', href: '#accommodations', variant: 'primary' }, styles: { fontFamily: "'Space Grotesk', sans-serif", background: 'linear-gradient(#10141a, #10141a) padding-box, linear-gradient(45deg, #7d5fff, #c3c6d2, #4719c9) border-box', border: '1.5px solid transparent', borderRadius: '9999px', color: '#dfe2eb', padding: '10px 24px', fontSize: '13px', fontWeight: '700', letterSpacing: '0.1em', textTransform: 'uppercase', textDecoration: 'none', whiteSpace: 'nowrap', cursor: 'pointer' } },
              ],
            },
          ],
        }],
      },

      // 2. Hero — full-screen with Milky Way background
      {
        styles: {
          backgroundColor: '#10141a',
          backgroundImage: 'linear-gradient(to bottom, rgba(16,20,26,0.2) 0%, transparent 40%, rgba(16,20,26,0.95) 100%), url("https://lh3.googleusercontent.com/aida-public/AB6AXuA7NMZrg2RM0WqhAGgxB2WBbAbA8Kl0tHusNca-0B-1bakGN9JKMC4K-RxE0VuCPUa9fyxiozqhE69fxRvYD96sZufb2keHIexK1gKc-c1UcqmNH0y0lyQTBnif7P0pj-et76XUCtZTzXAWABVLn4PFBuRTBfNygo7uYynHwzLivaOnbmF-DiLH-6QfKLoig4P829M8ZA99ZLeBU6HkODkyyY2U0ZaaGW6Jj3KjEyTfwr92JSkMKohA-IqPt_HjwoAKh1lQwBIQQ4w")',
          backgroundSize: 'cover',
          backgroundPosition: 'center top',
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '120px 80px 80px',
        },
        responsive: { tablet: { padding: '100px 32px 60px' }, mobile: { padding: '80px 20px 48px' } },
        rows: [
          {
            styles: { flexDirection: 'column', alignItems: 'center', textAlign: 'center', gap: '28px' },
            columns: [{
              span: { desktop: 8, tablet: 10, mobile: 12 },
              styles: { display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0' },
              elements: [
                { content: { type: 'paragraph', text: 'Welcome to the Abyss' }, styles: { fontFamily: "'Space Grotesk', sans-serif", fontSize: '12px', fontWeight: '500', color: '#cabeff', letterSpacing: '0.2em', textTransform: 'uppercase', margin: '0 0 20px' } },
                { content: { type: 'heading', level: 'h1', text: 'Reconnect with the Infinite' }, styles: { fontFamily: "'EB Garamond', serif", fontSize: '64px', fontWeight: '400', color: '#dfe2eb', lineHeight: '1.1', letterSpacing: '0.05em', margin: '0 0 32px' }, responsive: { tablet: { fontSize: '44px' }, mobile: { fontSize: '36px', letterSpacing: '0.02em' } } },
                { content: { type: 'button', text: 'EXPLORE THE VOID', href: '#experience', variant: 'ghost' }, styles: { fontFamily: "'Space Grotesk', sans-serif", background: 'rgba(16,20,26,0.6)', color: '#dfe2eb', padding: '14px 32px', borderRadius: '4px', fontSize: '13px', fontWeight: '700', border: '1px solid rgba(195,198,210,0.35)', letterSpacing: '0.12em', textTransform: 'uppercase', textDecoration: 'none', display: 'inline-block', backdropFilter: 'blur(8px)', marginRight: '16px', marginBottom: '16px' } },
                { content: { type: 'button', text: 'VIEW CELESTIAL CALENDAR', href: '#calendar', variant: 'ghost' }, styles: { fontFamily: "'Space Grotesk', sans-serif", background: 'rgba(16,20,26,0.6)', color: '#dfe2eb', padding: '14px 32px', borderRadius: '4px', fontSize: '13px', fontWeight: '700', border: '1px solid rgba(195,198,210,0.35)', letterSpacing: '0.12em', textTransform: 'uppercase', textDecoration: 'none', display: 'inline-block', backdropFilter: 'blur(8px)' } },
                { content: { type: 'paragraph', text: '↓  Scroll to Descend' }, styles: { fontFamily: "'Space Grotesk', sans-serif", fontSize: '11px', fontWeight: '500', color: '#909096', letterSpacing: '0.14em', textTransform: 'uppercase', margin: '32px 0 0' } },
              ],
            }],
          },
        ],
      },

      // 3. The Experience — 2-column: text left, observatory image right
      {
        styles: { backgroundColor: '#10141a', padding: '120px 80px' },
        responsive: { tablet: { padding: '80px 32px' }, mobile: { padding: '60px 20px' } },
        rows: [{
          styles: { alignItems: 'center', gap: '80px', flexWrap: 'wrap' },
          columns: [
            {
              span: { desktop: 6, tablet: 12, mobile: 12 },
              styles: { display: 'flex', flexDirection: 'column', gap: '24px' },
              elements: [
                { content: { type: 'paragraph', text: 'Immersion' }, styles: { fontFamily: "'Space Grotesk', sans-serif", fontSize: '12px', fontWeight: '500', color: '#cabeff', letterSpacing: '0.2em', textTransform: 'uppercase', margin: '0', padding: '4px 12px', border: '0.5px solid rgba(202,190,255,0.3)', borderRadius: '2px', display: 'inline-block', width: 'fit-content' } },
                { content: { type: 'heading', level: 'h2', text: 'The Experience' }, styles: { fontFamily: "'EB Garamond', serif", fontSize: '32px', fontWeight: '400', color: '#dfe2eb', lineHeight: '1.3', letterSpacing: '0.03em', margin: '0' }, responsive: { mobile: { fontSize: '26px' } } },
                { content: { type: 'paragraph', text: "Stellar Utah is more than a retreat; it's a sanctuary for those who seek to witness the universe in its rawest form. Located in the heart of the high desert, our guided nocturnal journeys take you through ancient canyons under a canopy of billion-year-old light." }, styles: { fontFamily: "'Hanken Grotesk', sans-serif", fontSize: '18px', fontWeight: '400', color: '#c6c6cb', lineHeight: '1.6', letterSpacing: '0.01em', margin: '0' } },
                { content: { type: 'paragraph', text: '⟡  Master Astronomer Tours' }, styles: { fontFamily: "'EB Garamond', serif", fontSize: '20px', fontWeight: '500', color: '#dfe2eb', margin: '8px 0 4px', lineHeight: '1.4' } },
                { content: { type: 'paragraph', text: 'Navigate the constellations with our resident astrophysicists using research-grade telescopes.' }, styles: { fontFamily: "'Hanken Grotesk', sans-serif", fontSize: '16px', fontWeight: '400', color: '#c6c6cb', lineHeight: '1.6', margin: '0 0 16px', paddingLeft: '20px' } },
                { content: { type: 'paragraph', text: '⟡  Astrophotography Workshops' }, styles: { fontFamily: "'EB Garamond', serif", fontSize: '20px', fontWeight: '500', color: '#dfe2eb', margin: '0 0 4px', lineHeight: '1.4' } },
                { content: { type: 'paragraph', text: 'Capture the galactic core with expert instruction on long-exposure deep sky imaging.' }, styles: { fontFamily: "'Hanken Grotesk', sans-serif", fontSize: '16px', fontWeight: '400', color: '#c6c6cb', lineHeight: '1.6', margin: '0', paddingLeft: '20px' } },
              ],
            },
            {
              span: { desktop: 6, tablet: 12, mobile: 12 },
              styles: { position: 'relative', overflow: 'visible' },
              elements: [
                { content: { type: 'image', src: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBeRyBQWsinb-9qHpmoJ3EVbZZuWX0liO_RxvHpdhtKVK4W7zlIRaNiMB2iDGNd2p3YL-BQ6eM2yjae3skF0bYXufhRrLKJxub9N4ZMT6N2AlDvSAL2Oo_WRcjCCbNUko-B8YISbahfXnNeAkMTMjzbbJlDslrXJ9umt2eRHmDr1LUfun-qNGouV6D3FWJGbO5cRiAsP-sOFY-HrymeOL1sTMgEDGqgV0fjubJtQBapqw3IxhbLVlfIyVHIxvRdYX2qM86DQnvzTvc', alt: 'Observatory dome at twilight on Utah desert ridge', objectFit: 'cover' }, styles: { width: '100%', height: '520px', borderRadius: '8px', objectFit: 'cover', border: '0.5px solid rgba(195,198,210,0.2)' }, responsive: { mobile: { height: '280px' } } },
                { content: { type: 'paragraph', text: '★  Visibility: 98%  ·  Perfect conditions for M31 viewing tonight.' }, styles: { fontFamily: "'Space Grotesk', sans-serif", fontSize: '12px', fontWeight: '500', color: '#dfe2eb', backgroundColor: 'rgba(16,20,26,0.7)', backdropFilter: 'blur(12px)', border: '0.5px solid rgba(195,198,210,0.2)', borderRadius: '6px', padding: '12px 16px', margin: '0', lineHeight: '1.6', position: 'absolute', bottom: '-20px', left: '-20px', animation: 'float 6s ease-in-out infinite', zIndex: '10', maxWidth: '280px' } },
              ],
            },
          ],
        }],
      },

      // 4. The Bortle 1 Standard — bento grid
      {
        styles: { backgroundColor: '#0a0e14', padding: '120px 80px' },
        responsive: { tablet: { padding: '80px 32px' }, mobile: { padding: '60px 20px' } },
        rows: [
          // Header
          {
            styles: { flexDirection: 'column', alignItems: 'center', textAlign: 'center', marginBottom: '64px' },
            columns: [{
              span: { desktop: 7, tablet: 10, mobile: 12 },
              styles: { display: 'flex', flexDirection: 'column', gap: '16px' },
              elements: [
                { content: { type: 'heading', level: 'h2', text: 'The Bortle 1 Standard' }, styles: { fontFamily: "'EB Garamond', serif", fontSize: '32px', fontWeight: '400', color: '#dfe2eb', lineHeight: '1.3', letterSpacing: '0.03em', margin: '0' }, responsive: { mobile: { fontSize: '26px' } } },
                { content: { type: 'paragraph', text: 'True darkness is a vanishing luxury. We protect one of the few remaining "Gold Tier" International Dark Sky Parks on Earth.' }, styles: { fontFamily: "'Hanken Grotesk', sans-serif", fontSize: '16px', fontWeight: '400', color: '#c6c6cb', lineHeight: '1.6', margin: '0' } },
              ],
            }],
          },
          // Bento row 1: Absolute Void (wide) + Bortle Class stat
          {
            styles: { gap: '24px', alignItems: 'stretch', flexWrap: 'wrap' },
            columns: [
              {
                span: { desktop: 8, tablet: 12, mobile: 12 },
                styles: {
                  backgroundColor: 'rgba(16,20,26,0.4)',
                  backgroundImage: 'linear-gradient(to bottom, rgba(10,14,20,0.6) 0%, rgba(10,14,20,0.85) 100%), url("https://lh3.googleusercontent.com/aida-public/AB6AXuAqPI7Vt5K1_P0uVM6VMGHTB_8VgysArKhICBK9wgVhCBtpYB_CEfpE04N6-a6x3lrr7dTn3NWBFrAjss0XZ3pMsDZe4IX6FfFk6cyttaf0XjbZP8VPMMAHElwGAr3VxKP4qoITkLBodU8kNV81FfuMfFZIspEF-HWK1UmHdvOCRPp54FXV9tuyPJxaBsVJ2i10_I8xgr2trbnHYiKaR24qU75RxxOe9kDbjHEMQOMfzGhCHcXnZ7wRMntc8i0FsCoZhN6vZYwkPAo")',
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                  border: '0.5px solid rgba(195,198,210,0.2)',
                  borderRadius: '8px',
                  padding: '48px 40px',
                  minHeight: '280px',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'flex-end',
                  backdropFilter: 'blur(4px)',
                },
                elements: [
                  { content: { type: 'heading', level: 'h3', text: 'Absolute Void' }, styles: { fontFamily: "'EB Garamond', serif", fontSize: '24px', fontWeight: '400', color: '#dfe2eb', margin: '0 0 12px', letterSpacing: '0.03em' } },
                  { content: { type: 'paragraph', text: 'In a Bortle 1 zone, the sky is so dark that the Milky Way casts a shadow on the desert floor. Experience light as it was meant to be seen.' }, styles: { fontFamily: "'Hanken Grotesk', sans-serif", fontSize: '16px', fontWeight: '400', color: '#c6c6cb', lineHeight: '1.6', margin: '0' } },
                ],
              },
              {
                span: { desktop: 4, tablet: 12, mobile: 12 },
                styles: {
                  backgroundColor: 'rgba(16,20,26,0.4)',
                  border: '0.5px solid rgba(195,198,210,0.2)',
                  borderRadius: '8px',
                  padding: '48px 32px',
                  minHeight: '280px',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  textAlign: 'center',
                  backdropFilter: 'blur(20px)',
                },
                elements: [
                  { content: { type: 'heading', level: 'h2', text: '01' }, styles: { fontFamily: "'EB Garamond', serif", fontSize: '80px', fontWeight: '400', color: '#dfe2eb', lineHeight: '1', margin: '0 0 12px', letterSpacing: '-0.02em' } },
                  { content: { type: 'paragraph', text: 'BORTLE CLASS' }, styles: { fontFamily: "'Space Grotesk', sans-serif", fontSize: '11px', fontWeight: '500', color: '#cabeff', letterSpacing: '0.2em', textTransform: 'uppercase', margin: '0 0 12px' } },
                  { content: { type: 'paragraph', text: 'The lowest light pollution measurement possible on the planet.' }, styles: { fontFamily: "'Hanken Grotesk', sans-serif", fontSize: '14px', fontWeight: '400', color: '#c6c6cb', lineHeight: '1.6', margin: '0' } },
                ],
              },
            ],
          },
          // Bento row 2: Moon Sync + Preservation Efforts (wide)
          {
            styles: { gap: '24px', alignItems: 'stretch', marginTop: '24px', flexWrap: 'wrap' },
            columns: [
              {
                span: { desktop: 4, tablet: 12, mobile: 12 },
                styles: {
                  backgroundColor: 'rgba(16,20,26,0.4)',
                  border: '0.5px solid rgba(195,198,210,0.2)',
                  borderRadius: '8px',
                  padding: '40px 32px',
                  backdropFilter: 'blur(20px)',
                },
                elements: [
                  { content: { type: 'paragraph', text: '🌙' }, styles: { fontSize: '32px', margin: '0 0 16px' } },
                  { content: { type: 'heading', level: 'h3', text: 'Moon Sync' }, styles: { fontFamily: "'EB Garamond', serif", fontSize: '24px', fontWeight: '400', color: '#dfe2eb', margin: '0 0 12px', letterSpacing: '0.03em' } },
                  { content: { type: 'paragraph', text: 'Our retreat schedule is synchronized with the new moon for 100% celestial clarity.' }, styles: { fontFamily: "'Hanken Grotesk', sans-serif", fontSize: '16px', fontWeight: '400', color: '#c6c6cb', lineHeight: '1.6', margin: '0' } },
                ],
              },
              {
                span: { desktop: 8, tablet: 12, mobile: 12 },
                styles: {
                  backgroundColor: 'rgba(16,20,26,0.4)',
                  border: '0.5px solid rgba(195,198,210,0.2)',
                  borderRadius: '8px',
                  padding: '40px',
                  backdropFilter: 'blur(20px)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '40px',
                },
                elements: [
                  { content: { type: 'heading', level: 'h3', text: 'Preservation Efforts' }, styles: { fontFamily: "'EB Garamond', serif", fontSize: '24px', fontWeight: '400', color: '#dfe2eb', margin: '0 0 12px', letterSpacing: '0.03em' } },
                  { content: { type: 'paragraph', text: 'Every booking supports the International Dark-Sky Association (IDA) in protecting nocturnal habitats.' }, styles: { fontFamily: "'Hanken Grotesk', sans-serif", fontSize: '16px', fontWeight: '400', color: '#c6c6cb', lineHeight: '1.6', margin: '0' } },
                  { content: { type: 'image', src: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBiRCHD59So2h_XDkC2YRbYUn-jtO1guYJ8O8Pif7VgDIHpUp6zdMXieGuCG56NQaU41J_gRIr0seJFFh_ZlmcV0mNLE8TTNjA2RaxmpNr1UIVEudGvwnd41YRk6MCuqD_HDJdttnIxE8u1UbBS1nBfIkNIPwgp9XdBqjq2A0QnOat5Df-6Y-bGSR9qwJhMw3E3B8mjoNCfLAsU8O9KoG2G2o8D3mq2WZW-5L2ErXCBVE_GbCN5Z0FuU78pwTkuxcnUG3ehOr4jAZc', alt: 'Satellite view of North America at night showing dark sky regions', objectFit: 'cover' }, styles: { width: '160px', height: '120px', borderRadius: '6px', objectFit: 'cover', flexShrink: '0', filter: 'grayscale(80%)' }, responsive: { mobile: { display: 'none' } } },
                ],
              },
            ],
          },
        ],
      },

      // 5. Luxury Accommodations
      {
        styles: { backgroundColor: '#10141a', padding: '120px 80px' },
        responsive: { tablet: { padding: '80px 32px' }, mobile: { padding: '60px 20px' } },
        rows: [
          // Section header row
          {
            styles: { justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '64px', flexWrap: 'wrap', gap: '24px' },
            columns: [
              {
                span: { desktop: 8, tablet: 10, mobile: 12 },
                styles: { display: 'flex', flexDirection: 'column', gap: '12px' },
                elements: [
                  { content: { type: 'paragraph', text: 'Rest' }, styles: { fontFamily: "'Space Grotesk', sans-serif", fontSize: '12px', fontWeight: '500', color: '#cabeff', letterSpacing: '0.2em', textTransform: 'uppercase', margin: '0' } },
                  { content: { type: 'heading', level: 'h2', text: 'Luxury Dwellings' }, styles: { fontFamily: "'EB Garamond', serif", fontSize: '32px', fontWeight: '400', color: '#dfe2eb', lineHeight: '1.3', letterSpacing: '0.03em', margin: '0' }, responsive: { mobile: { fontSize: '26px' } } },
                  { content: { type: 'paragraph', text: 'Glass-ceiling domes and high-desert suites designed to dissolve the boundary between sleep and space.' }, styles: { fontFamily: "'Hanken Grotesk', sans-serif", fontSize: '16px', fontWeight: '400', color: '#c6c6cb', lineHeight: '1.6', margin: '0' } },
                ],
              },
              {
                span: { desktop: 4, tablet: 2, mobile: 12 },
                styles: { display: 'flex', alignItems: 'flex-end', justifyContent: 'flex-end' },
                responsive: { mobile: { justifyContent: 'flex-start' } },
                elements: [
                  { content: { type: 'button', text: 'VIEW ALL SUITES →', href: '#', variant: 'ghost' }, styles: { fontFamily: "'Space Grotesk', sans-serif", color: '#c3c6d2', fontSize: '13px', fontWeight: '500', letterSpacing: '0.08em', background: 'none', border: 'none', borderBottom: '1px solid rgba(195,198,210,0.3)', padding: '0 0 4px', textDecoration: 'none', cursor: 'pointer' } },
                ],
              },
            ],
          },
          // Two accommodation cards
          {
            styles: { gap: '48px', flexWrap: 'wrap' },
            columns: [
              // The Celestial Dome
              {
                span: { desktop: 6, tablet: 12, mobile: 12 },
                styles: { display: 'flex', flexDirection: 'column', gap: '0', cursor: 'pointer' },
                elements: [
                  { content: { type: 'image', src: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCskIBNqsJftIfCO_OQ_taRWtv6eXijyfSOQmatZvN3R-TcgnLdsqNneEeLttDhu6SCdg4PumEUGrq7weKevlw8TOlJhBKlB9614jD79Pn5P_bsGp7WOt6PdvBoPog6qI4ERSgYaLYwyH9ENHbhhdKkTw7PkO-btnVsnHWO5Rf_2_MsH1q_Ww54HZiTHAL6HOUim3yvYLVbYa-6pOQh9lTo18gaf6HNlR2jrlqhRNdXHCRwLnvTF3xvgHNT4AwRiHzwVonXCjWGKIw', alt: 'Luxury geodesic glass dome at night with stars visible through transparent roof', objectFit: 'cover' }, styles: { width: '100%', height: '300px', borderRadius: '12px', objectFit: 'cover', marginBottom: '24px' } },
                  { content: { type: 'paragraph', text: 'THE CELESTIAL DOME' }, styles: { fontFamily: "'Space Grotesk', sans-serif", fontSize: '10px', fontWeight: '500', color: '#c3c6d2', letterSpacing: '0.16em', textTransform: 'uppercase', margin: '0 0 8px', opacity: '0.8' } },
                  { content: { type: 'heading', level: 'h4', text: '360° Panoramic Dome' }, styles: { fontFamily: "'EB Garamond', serif", fontSize: '24px', fontWeight: '500', color: '#dfe2eb', lineHeight: '1.4', margin: '0 0 8px' } },
                  { content: { type: 'paragraph', text: 'Sleep directly under the spiral arms of our galaxy.' }, styles: { fontFamily: "'Hanken Grotesk', sans-serif", fontSize: '15px', fontWeight: '400', color: '#c6c6cb', lineHeight: '1.6', margin: '0 0 12px' } },
                  { content: { type: 'paragraph', text: '$1,200 / Night' }, styles: { fontFamily: "'Space Grotesk', sans-serif", fontSize: '14px', fontWeight: '500', color: '#c3c6d2', margin: '0', letterSpacing: '0.04em' } },
                ],
              },
              // The Obsidian Suite
              {
                span: { desktop: 6, tablet: 12, mobile: 12 },
                styles: { display: 'flex', flexDirection: 'column', gap: '0', cursor: 'pointer' },
                elements: [
                  { content: { type: 'image', src: 'https://lh3.googleusercontent.com/aida-public/AB6AXuB_BDe96McLKMEdbFXxrHQO5Rgsapblm5D8J30qCO7Jlm-9WcDTluXegIrnsaEsGub6wWlUGq8W3cxDxhIIlshoOWagXn3XjEQdwDDBvJ9eTxb1VUmjeJhT0ltGfWMiqKSZU7V0mgv--QSsiTHLX28teDMAiGS_nymwBd-d80eJAb5fHVOyI0ILMjfYupufUFv5zlYYOQ8m0WDj9fCJKfG0mFmOuf3BuRf3_KIftd7ZMIR3yFk_21TS0RoyknQYVXYpL3uH2-e7QDs', alt: 'Minimalist concrete cliffside suite with floor-to-ceiling windows and telescope', objectFit: 'cover' }, styles: { width: '100%', height: '300px', borderRadius: '12px', objectFit: 'cover', marginBottom: '24px' } },
                  { content: { type: 'paragraph', text: 'THE OBSIDIAN SUITE' }, styles: { fontFamily: "'Space Grotesk', sans-serif", fontSize: '10px', fontWeight: '500', color: '#c3c6d2', letterSpacing: '0.16em', textTransform: 'uppercase', margin: '0 0 8px', opacity: '0.8' } },
                  { content: { type: 'heading', level: 'h4', text: 'Monolith Cliffside Suite' }, styles: { fontFamily: "'EB Garamond', serif", fontSize: '24px', fontWeight: '500', color: '#dfe2eb', lineHeight: '1.4', margin: '0 0 8px' } },
                  { content: { type: 'paragraph', text: 'Embedded in the sandstone, offering absolute silence.' }, styles: { fontFamily: "'Hanken Grotesk', sans-serif", fontSize: '15px', fontWeight: '400', color: '#c6c6cb', lineHeight: '1.6', margin: '0 0 12px' } },
                  { content: { type: 'paragraph', text: '$1,850 / Night' }, styles: { fontFamily: "'Space Grotesk', sans-serif", fontSize: '14px', fontWeight: '500', color: '#c3c6d2', margin: '0', letterSpacing: '0.04em' } },
                ],
              },
            ],
          },
        ],
      },

      // 6. Newsletter CTA
      {
        styles: {
          backgroundColor: '#02040a',
          padding: '120px 80px',
          position: 'relative',
          overflow: 'hidden',
        },
        responsive: { tablet: { padding: '80px 32px' }, mobile: { padding: '60px 20px' } },
        rows: [{
          styles: { flexDirection: 'column', alignItems: 'center', textAlign: 'center', maxWidth: '640px', margin: '0 auto' },
          columns: [{
            span: { desktop: 12, tablet: 12, mobile: 12 },
            styles: { display: 'flex', flexDirection: 'column', gap: '16px', alignItems: 'center' },
            elements: [
              { content: { type: 'heading', level: 'h2', text: 'Receive the Celestial Report' }, styles: { fontFamily: "'EB Garamond', serif", fontSize: '32px', fontWeight: '400', color: '#dfe2eb', lineHeight: '1.3', letterSpacing: '0.03em', margin: '0' }, responsive: { mobile: { fontSize: '26px' } } },
              { content: { type: 'paragraph', text: 'Monthly updates on meteor showers, planet alignments, and seasonal retreat availability.' }, styles: { fontFamily: "'Hanken Grotesk', sans-serif", fontSize: '16px', fontWeight: '400', color: '#737781', lineHeight: '1.6', margin: '0' } },
              { content: { type: 'paragraph', text: 'Email Address' }, styles: { fontFamily: "'Hanken Grotesk', sans-serif", fontSize: '16px', color: '#45474b', backgroundColor: 'transparent', border: 'none', borderBottom: '1px solid #45474b', padding: '12px 0', margin: '16px 0 0', width: '100%', maxWidth: '480px', textAlign: 'left' } },
              { content: { type: 'button', text: 'SUBSCRIBE', href: '#', variant: 'primary' }, styles: { fontFamily: "'Space Grotesk', sans-serif", backgroundColor: '#cabeff', color: '#30009b', padding: '14px 40px', borderRadius: '9999px', fontSize: '13px', fontWeight: '700', border: 'none', letterSpacing: '0.2em', textTransform: 'uppercase', textDecoration: 'none', display: 'inline-block', cursor: 'pointer' } },
            ],
          }],
        }],
      },

      // 7. Footer
      {
        styles: {
          backgroundColor: '#0a0e14',
          borderTop: '0.5px solid rgba(195,198,210,0.1)',
          padding: '80px 80px 48px',
        },
        responsive: { tablet: { padding: '64px 32px 40px' }, mobile: { padding: '48px 20px 32px' } },
        rows: [
          // Main columns
          {
            styles: { justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '48px', marginBottom: '64px' },
            columns: [
              {
                span: { desktop: 4, tablet: 12, mobile: 12 },
                styles: { display: 'flex', flexDirection: 'column', gap: '16px' },
                elements: [
                  { content: { type: 'heading', level: 'h3', text: 'Stellar Utah' }, styles: { fontFamily: "'EB Garamond', serif", fontSize: '24px', fontWeight: '400', color: '#c3c6d2', margin: '0' } },
                  { content: { type: 'paragraph', text: 'A sanctuary for celestial observation and high-desert luxury.' }, styles: { fontFamily: "'Hanken Grotesk', sans-serif", fontSize: '16px', fontWeight: '400', color: '#c6c6cb', lineHeight: '1.6', margin: '0', maxWidth: '260px' } },
                ],
              },
              {
                span: { desktop: 2, tablet: 4, mobile: 6 },
                styles: { display: 'flex', flexDirection: 'column', gap: '16px' },
                elements: [
                  { content: { type: 'paragraph', text: 'EXPLORE' }, styles: { fontFamily: "'Space Grotesk', sans-serif", fontSize: '11px', fontWeight: '500', color: '#c6c6c6', letterSpacing: '0.2em', textTransform: 'uppercase', margin: '0 0 8px' } },
                  { content: { type: 'button', text: 'The Experience', href: '#experience', variant: 'ghost' }, styles: { fontFamily: "'Space Grotesk', sans-serif", color: '#c6c6cb', fontSize: '13px', fontWeight: '400', background: 'none', border: 'none', padding: '0', textDecoration: 'none', display: 'block', textAlign: 'left', letterSpacing: '0.05em' } },
                  { content: { type: 'button', text: 'Celestial Events', href: '#', variant: 'ghost' }, styles: { fontFamily: "'Space Grotesk', sans-serif", color: '#c6c6cb', fontSize: '13px', fontWeight: '400', background: 'none', border: 'none', padding: '0', textDecoration: 'none', display: 'block', textAlign: 'left', letterSpacing: '0.05em' } },
                  { content: { type: 'button', text: 'Accommodations', href: '#accommodations', variant: 'ghost' }, styles: { fontFamily: "'Space Grotesk', sans-serif", color: '#c6c6cb', fontSize: '13px', fontWeight: '400', background: 'none', border: 'none', padding: '0', textDecoration: 'none', display: 'block', textAlign: 'left', letterSpacing: '0.05em' } },
                  { content: { type: 'button', text: 'Sustainability', href: '#', variant: 'ghost' }, styles: { fontFamily: "'Space Grotesk', sans-serif", color: '#c6c6cb', fontSize: '13px', fontWeight: '400', background: 'none', border: 'none', padding: '0', textDecoration: 'none', display: 'block', textAlign: 'left', letterSpacing: '0.05em' } },
                ],
              },
              {
                span: { desktop: 2, tablet: 4, mobile: 6 },
                styles: { display: 'flex', flexDirection: 'column', gap: '16px' },
                elements: [
                  { content: { type: 'paragraph', text: 'COMMUNITY' }, styles: { fontFamily: "'Space Grotesk', sans-serif", fontSize: '11px', fontWeight: '500', color: '#c6c6c6', letterSpacing: '0.2em', textTransform: 'uppercase', margin: '0 0 8px' } },
                  { content: { type: 'button', text: 'Careers', href: '#', variant: 'ghost' }, styles: { fontFamily: "'Space Grotesk', sans-serif", color: '#c6c6cb', fontSize: '13px', fontWeight: '400', background: 'none', border: 'none', padding: '0', textDecoration: 'none', display: 'block', textAlign: 'left', letterSpacing: '0.05em' } },
                  { content: { type: 'button', text: 'Privacy Policy', href: '#', variant: 'ghost' }, styles: { fontFamily: "'Space Grotesk', sans-serif", color: '#c6c6cb', fontSize: '13px', fontWeight: '400', background: 'none', border: 'none', padding: '0', textDecoration: 'none', display: 'block', textAlign: 'left', letterSpacing: '0.05em' } },
                  { content: { type: 'button', text: 'Contact Us', href: '#', variant: 'ghost' }, styles: { fontFamily: "'Space Grotesk', sans-serif", color: '#c6c6cb', fontSize: '13px', fontWeight: '400', background: 'none', border: 'none', padding: '0', textDecoration: 'none', display: 'block', textAlign: 'left', letterSpacing: '0.05em' } },
                  { content: { type: 'button', text: 'Member Portal', href: '#', variant: 'ghost' }, styles: { fontFamily: "'Space Grotesk', sans-serif", color: '#c6c6cb', fontSize: '13px', fontWeight: '400', background: 'none', border: 'none', padding: '0', textDecoration: 'none', display: 'block', textAlign: 'left', letterSpacing: '0.05em' } },
                ],
              },
              {
                span: { desktop: 4, tablet: 4, mobile: 12 },
                styles: { display: 'flex', flexDirection: 'column', gap: '16px' },
                elements: [
                  { content: { type: 'paragraph', text: 'LOCATION' }, styles: { fontFamily: "'Space Grotesk', sans-serif", fontSize: '11px', fontWeight: '500', color: '#c6c6c6', letterSpacing: '0.2em', textTransform: 'uppercase', margin: '0 0 8px' } },
                  { content: { type: 'paragraph', text: 'Bureau of Land Management Site 42-A, Southern Utah Wilderness' }, styles: { fontFamily: "'Hanken Grotesk', sans-serif", fontSize: '15px', fontWeight: '400', color: '#c6c6cb', lineHeight: '1.6', margin: '0', whiteSpace: 'pre-line' } },
                ],
              },
            ],
          },
          // Bottom bar
          {
            styles: { justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px', paddingTop: '32px', borderTop: '0.5px solid rgba(255,255,255,0.05)' },
            columns: [
              { span: { desktop: 7, tablet: 7, mobile: 12 }, styles: {}, elements: [
                { content: { type: 'paragraph', text: '© 2024 Stellar Utah Retreats. Under the Bortle 1 Skies.' }, styles: { fontFamily: "'Space Grotesk', sans-serif", fontSize: '12px', color: '#c6c6cb', opacity: '0.6', margin: '0', letterSpacing: '0.05em' } },
              ]},
              { span: { desktop: 5, tablet: 5, mobile: 12 }, styles: { display: 'flex', gap: '32px', justifyContent: 'flex-end' }, responsive: { mobile: { justifyContent: 'flex-start' } }, elements: [
                { content: { type: 'paragraph', text: 'DARK SKY CERTIFIED' }, styles: { fontFamily: "'Space Grotesk', sans-serif", fontSize: '11px', fontWeight: '500', color: '#cabeff', letterSpacing: '0.2em', textTransform: 'uppercase', margin: '0' } },
                { content: { type: 'paragraph', text: 'HIGH DESERT LUXURY' }, styles: { fontFamily: "'Space Grotesk', sans-serif", fontSize: '11px', fontWeight: '500', color: '#cabeff', letterSpacing: '0.2em', textTransform: 'uppercase', margin: '0' } },
              ]},
            ],
          },
        ],
      },

    ],
  },

]

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

  // ─── PPC Page Template — NOIR Fashion E-Commerce (Dark Luxury) ──────────────

  {
    id: 'ppc-noir-fashion',
    label: 'NOIR — Fashion E-Commerce',
    category: 'ppc',
    desc: 'Dark luxury fashion e-commerce homepage. 8 sections: nav, hero, collections, featured product, trending, editorial quote, newsletter, footer.',
    sections: [

      // 1. Navigation
      {
        styles: { backgroundColor: '#0A0908', borderBottom: '1px solid #26231F', padding: '0 60px', position: 'sticky', top: '0', zIndex: '100' },
        responsive: { tablet: { padding: '0 32px' }, mobile: { padding: '0 20px' } },
        rows: [{
          locked: true,
          styles: { alignItems: 'center', justifyContent: 'space-between', minHeight: '76px', flexWrap: 'nowrap', gap: '16px' },
          columns: [
            {
              span: { desktop: 4, tablet: 4, mobile: 0 },
              styles: { display: 'flex', alignItems: 'center', gap: '32px' },
              responsive: { mobile: { display: 'none' } },
              elements: [
                { content: { type: 'button', text: 'COLLECTIONS', href: '#collections', variant: 'ghost' }, styles: { fontFamily: "'Inter', sans-serif", color: '#827D76', fontSize: '11px', fontWeight: '400', letterSpacing: '0.18em', background: 'none', border: 'none', padding: '0', cursor: 'pointer' } },
                { content: { type: 'button', text: 'NEW ARRIVALS', href: '#arrivals', variant: 'ghost' }, styles: { fontFamily: "'Inter', sans-serif", color: '#827D76', fontSize: '11px', fontWeight: '400', letterSpacing: '0.18em', background: 'none', border: 'none', padding: '0', cursor: 'pointer' } },
                { content: { type: 'button', text: 'DESIGNERS', href: '#designers', variant: 'ghost' }, styles: { fontFamily: "'Inter', sans-serif", color: '#827D76', fontSize: '11px', fontWeight: '400', letterSpacing: '0.18em', background: 'none', border: 'none', padding: '0', cursor: 'pointer' } },
              ],
            },
            {
              span: { desktop: 4, tablet: 4, mobile: 8 },
              styles: { display: 'flex', alignItems: 'center', justifyContent: 'center' },
              elements: [
                { content: { type: 'heading', level: 'h1', text: 'NOIR' }, styles: { fontFamily: "'Inter', sans-serif", fontSize: '26px', fontWeight: '700', color: '#F5F0E8', margin: '0', letterSpacing: '0.55em' } },
              ],
            },
            {
              span: { desktop: 4, tablet: 4, mobile: 4 },
              styles: { display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '28px' },
              elements: [
                { content: { type: 'button', text: 'SALE', href: '#sale', variant: 'ghost' }, styles: { fontFamily: "'Inter', sans-serif", color: '#C9A96E', fontSize: '11px', fontWeight: '400', letterSpacing: '0.18em', background: 'none', border: 'none', padding: '0', cursor: 'pointer' } },
                { content: { type: 'button', text: 'Search', href: '#', variant: 'ghost' }, styles: { fontFamily: "'Inter', sans-serif", color: '#827D76', fontSize: '11px', letterSpacing: '0.1em', background: 'none', border: 'none', padding: '0', cursor: 'pointer' }, responsive: { mobile: { display: 'none' } } },
                { content: { type: 'button', text: 'Bag', href: '#', variant: 'ghost' }, styles: { fontFamily: "'Inter', sans-serif", color: '#827D76', fontSize: '11px', letterSpacing: '0.1em', background: 'none', border: 'none', padding: '0', cursor: 'pointer' } },
              ],
            },
          ],
        }],
      },

      // 2. Hero
      {
        styles: { backgroundColor: '#100F0D', padding: '0', overflow: 'hidden' },
        rows: [
          // Announcement ticker
          {
            styles: { backgroundColor: '#161412', borderBottom: '1px solid #26231F', padding: '10px 60px', justifyContent: 'center' },
            responsive: { mobile: { padding: '10px 20px' } },
            columns: [{
              span: { desktop: 12, tablet: 12, mobile: 12 },
              styles: { display: 'flex', justifyContent: 'center' },
              elements: [
                { content: { type: 'paragraph', text: 'FREE SHIPPING ON ORDERS OVER $200   ·   SS 2026 ARRIVALS NOW LIVE   ·   COMPLIMENTARY GIFT WRAPPING' }, styles: { fontFamily: "'Inter', sans-serif", fontSize: '10px', color: '#827D76', letterSpacing: '0.2em', margin: '0', textAlign: 'center', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' } },
              ],
            }],
          },
          // Main hero row
          {
            styles: { minHeight: '680px', position: 'relative', alignItems: 'stretch' },
            responsive: { mobile: { minHeight: 'auto', flexDirection: 'column' } },
            columns: [
              // Left — editorial text
              {
                span: { desktop: 5, tablet: 6, mobile: 12 },
                styles: { backgroundColor: '#100F0D', padding: '80px 60px', display: 'flex', flexDirection: 'column', justifyContent: 'center' },
                responsive: { tablet: { padding: '60px 32px' }, mobile: { padding: '48px 20px' } },
                elements: [
                  { content: { type: 'paragraph', text: 'SS 2026 COLLECTION' }, styles: { fontFamily: "'Inter', sans-serif", fontSize: '10px', color: '#C9A96E', letterSpacing: '0.4em', margin: '0 0 28px 0' } },
                  { content: { type: 'heading', level: 'h1', text: 'DEFINE YOUR AESTHETIC' }, styles: { fontFamily: "'Inter', sans-serif", fontSize: '64px', fontWeight: '700', color: '#F5F0E8', lineHeight: '1.0', letterSpacing: '-0.02em', margin: '0 0 32px 0' }, responsive: { tablet: { fontSize: '48px' }, mobile: { fontSize: '36px' } } },
                  { content: { type: 'paragraph', text: 'Curated luxury for the discerning wardrobe. Structured silhouettes. Timeless pieces.' }, styles: { fontFamily: "'Inter', sans-serif", fontSize: '15px', color: '#827D76', lineHeight: '1.7', margin: '0 0 40px 0', maxWidth: '320px' } },
                  { content: { type: 'button', text: 'SHOP NOW', href: '#collections', variant: 'primary' }, styles: { backgroundColor: '#C9A96E', color: '#0A0908', padding: '16px 40px', fontFamily: "'Inter', sans-serif", fontSize: '11px', fontWeight: '700', letterSpacing: '0.25em', border: 'none', cursor: 'pointer', display: 'inline-block' } },
                ],
              },
              // Right — hero image placeholder
              {
                span: { desktop: 7, tablet: 6, mobile: 12 },
                styles: { backgroundColor: '#201D19', minHeight: '680px', display: 'flex', alignItems: 'center', justifyContent: 'center' },
                responsive: { mobile: { minHeight: '320px' } },
                elements: [
                  { content: { type: 'paragraph', text: 'Editorial Campaign Image' }, styles: { fontFamily: "'Inter', sans-serif", fontSize: '12px', color: '#46423D', letterSpacing: '0.1em', margin: '0', textAlign: 'center' } },
                ],
              },
            ],
          },
        ],
      },

      // 3. Collections
      {
        id: 'collections',
        styles: { backgroundColor: '#0A0908', padding: '64px 60px' },
        responsive: { tablet: { padding: '48px 32px' }, mobile: { padding: '40px 20px' } },
        rows: [
          {
            styles: { marginBottom: '32px' },
            columns: [{
              span: { desktop: 12, tablet: 12, mobile: 12 },
              elements: [
                { content: { type: 'paragraph', text: 'SHOP BY CATEGORY' }, styles: { fontFamily: "'Inter', sans-serif", fontSize: '10px', color: '#46423D', letterSpacing: '0.4em', margin: '0' } },
              ],
            }],
          },
          {
            styles: { gap: '16px', alignItems: 'stretch' },
            columns: [
              {
                span: { desktop: 4, tablet: 4, mobile: 12 },
                styles: { backgroundColor: '#161412', overflow: 'hidden' },
                elements: [
                  { content: { type: 'div' }, styles: { backgroundColor: '#201D19', height: '260px', width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' } },
                  { content: { type: 'heading', level: 'h3', text: 'NEW ARRIVALS' }, styles: { fontFamily: "'Inter', sans-serif", fontSize: '13px', fontWeight: '700', color: '#F5F0E8', letterSpacing: '0.2em', margin: '20px 20px 6px' } },
                  { content: { type: 'paragraph', text: '140 Pieces' }, styles: { fontFamily: "'Inter', sans-serif", fontSize: '11px', color: '#827D76', margin: '0 20px 6px', letterSpacing: '0.05em' } },
                  { content: { type: 'button', text: 'Explore →', href: '#arrivals', variant: 'ghost' }, styles: { fontFamily: "'Inter', sans-serif", fontSize: '11px', color: '#C9A96E', background: 'none', border: 'none', padding: '0 20px 20px', cursor: 'pointer', letterSpacing: '0.05em', display: 'block' } },
                ],
              },
              {
                span: { desktop: 4, tablet: 4, mobile: 12 },
                styles: { backgroundColor: '#161412', overflow: 'hidden' },
                elements: [
                  { content: { type: 'div' }, styles: { backgroundColor: '#2A2621', height: '260px', width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' } },
                  { content: { type: 'heading', level: 'h3', text: 'BESTSELLERS' }, styles: { fontFamily: "'Inter', sans-serif", fontSize: '13px', fontWeight: '700', color: '#F5F0E8', letterSpacing: '0.2em', margin: '20px 20px 6px' } },
                  { content: { type: 'paragraph', text: '68 Pieces' }, styles: { fontFamily: "'Inter', sans-serif", fontSize: '11px', color: '#827D76', margin: '0 20px 6px', letterSpacing: '0.05em' } },
                  { content: { type: 'button', text: 'Explore →', href: '#bestsellers', variant: 'ghost' }, styles: { fontFamily: "'Inter', sans-serif", fontSize: '11px', color: '#C9A96E', background: 'none', border: 'none', padding: '0 20px 20px', cursor: 'pointer', letterSpacing: '0.05em', display: 'block' } },
                ],
              },
              {
                span: { desktop: 4, tablet: 4, mobile: 12 },
                styles: { backgroundColor: '#1A1210', overflow: 'hidden' },
                elements: [
                  { content: { type: 'div' }, styles: { backgroundColor: '#241B18', height: '260px', width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' } },
                  { content: { type: 'heading', level: 'h3', text: 'SALE UP TO 50%' }, styles: { fontFamily: "'Inter', sans-serif", fontSize: '13px', fontWeight: '700', color: '#F5F0E8', letterSpacing: '0.2em', margin: '20px 20px 6px' } },
                  { content: { type: 'paragraph', text: 'Limited Time' }, styles: { fontFamily: "'Inter', sans-serif", fontSize: '11px', color: '#C9A96E', margin: '0 20px 6px', letterSpacing: '0.05em' } },
                  { content: { type: 'button', text: 'Shop Sale →', href: '#sale', variant: 'ghost' }, styles: { fontFamily: "'Inter', sans-serif", fontSize: '11px', color: '#C9A96E', background: 'none', border: 'none', padding: '0 20px 20px', cursor: 'pointer', letterSpacing: '0.05em', display: 'block' } },
                ],
              },
            ],
          },
        ],
      },

      // 4. Featured Product
      {
        styles: { backgroundColor: '#100F0D', padding: '0', overflow: 'hidden' },
        rows: [{
          styles: { alignItems: 'stretch', minHeight: '600px' },
          responsive: { mobile: { flexDirection: 'column' } },
          columns: [
            // Product image
            {
              span: { desktop: 5, tablet: 5, mobile: 12 },
              styles: { backgroundColor: '#201D19', minHeight: '600px', display: 'flex', alignItems: 'center', justifyContent: 'center' },
              responsive: { mobile: { minHeight: '300px' } },
              elements: [
                { content: { type: 'paragraph', text: 'Product Photo' }, styles: { fontFamily: "'Inter', sans-serif", fontSize: '12px', color: '#46423D', margin: '0' } },
              ],
            },
            // Product details
            {
              span: { desktop: 7, tablet: 7, mobile: 12 },
              styles: { padding: '80px 60px', display: 'flex', flexDirection: 'column', justifyContent: 'center' },
              responsive: { tablet: { padding: '60px 32px' }, mobile: { padding: '40px 20px' } },
              elements: [
                { content: { type: 'paragraph', text: 'FEATURED PIECE' }, styles: { fontFamily: "'Inter', sans-serif", fontSize: '9px', color: '#C9A96E', letterSpacing: '0.45em', margin: '0 0 20px 0' } },
                { content: { type: 'heading', level: 'h2', text: 'The Obsidian Overcoat' }, styles: { fontFamily: "'Inter', sans-serif", fontSize: '48px', fontWeight: '700', color: '#F5F0E8', lineHeight: '1.05', margin: '0 0 20px 0', letterSpacing: '-0.02em' }, responsive: { tablet: { fontSize: '36px' }, mobile: { fontSize: '28px' } } },
                { content: { type: 'div' }, styles: { width: '48px', height: '1px', backgroundColor: '#C9A96E', margin: '0 0 24px 0' } },
                { content: { type: 'paragraph', text: 'Crafted from double-faced cashmere, the Obsidian Overcoat is a study in restraint. Structured silhouette, precision-cut lapels. Timeless.' }, styles: { fontFamily: "'Inter', sans-serif", fontSize: '14px', color: '#827D76', lineHeight: '1.75', margin: '0 0 24px 0', maxWidth: '420px' } },
                { content: { type: 'paragraph', text: '★★★★★  4.9  (128 reviews)' }, styles: { fontFamily: "'Inter', sans-serif", fontSize: '12px', color: '#C9A96E', margin: '0 0 20px 0', letterSpacing: '0.03em' } },
                { content: { type: 'heading', level: 'h3', text: '$1,890' }, styles: { fontFamily: "'Inter', sans-serif", fontSize: '32px', fontWeight: '700', color: '#F5F0E8', margin: '0 0 28px 0' } },
                { content: { type: 'paragraph', text: 'SELECT SIZE' }, styles: { fontFamily: "'Inter', sans-serif", fontSize: '9px', color: '#46423D', letterSpacing: '0.3em', margin: '0 0 12px 0' } },
                { content: { type: 'paragraph', text: 'XS  ·  S  ·  M  ·  L  ·  XL' }, styles: { fontFamily: "'Inter', sans-serif", fontSize: '12px', color: '#827D76', letterSpacing: '0.15em', margin: '0 0 28px 0' } },
                { content: { type: 'button', text: 'ADD TO BAG', href: '#', variant: 'primary' }, styles: { backgroundColor: '#C9A96E', color: '#0A0908', padding: '18px 48px', fontFamily: "'Inter', sans-serif", fontSize: '11px', fontWeight: '700', letterSpacing: '0.25em', border: 'none', cursor: 'pointer', display: 'inline-block', marginBottom: '16px' } },
                { content: { type: 'paragraph', text: '✓  Free shipping & returns  ·  Ships in 2–3 days' }, styles: { fontFamily: "'Inter', sans-serif", fontSize: '11px', color: '#46423D', margin: '0', letterSpacing: '0.05em' } },
              ],
            },
          ],
        }],
      },

      // 5. Trending Now — Product Grid
      {
        styles: { backgroundColor: '#0A0908', padding: '64px 60px' },
        responsive: { tablet: { padding: '48px 32px' }, mobile: { padding: '40px 20px' } },
        rows: [
          {
            styles: { marginBottom: '28px', alignItems: 'center', justifyContent: 'space-between' },
            columns: [
              {
                span: { desktop: 6, tablet: 6, mobile: 8 },
                elements: [
                  { content: { type: 'paragraph', text: 'TRENDING NOW' }, styles: { fontFamily: "'Inter', sans-serif", fontSize: '10px', color: '#46423D', letterSpacing: '0.4em', margin: '0' } },
                ],
              },
              {
                span: { desktop: 6, tablet: 6, mobile: 4 },
                styles: { display: 'flex', justifyContent: 'flex-end' },
                elements: [
                  { content: { type: 'button', text: 'View all →', href: '#', variant: 'ghost' }, styles: { fontFamily: "'Inter', sans-serif", fontSize: '12px', color: '#C9A96E', background: 'none', border: 'none', padding: '0', cursor: 'pointer' } },
                ],
              },
            ],
          },
          {
            styles: { gap: '12px', alignItems: 'stretch' },
            responsive: { mobile: { flexWrap: 'wrap' } },
            columns: [
              {
                span: { desktop: 3, tablet: 6, mobile: 6 },
                styles: { display: 'flex', flexDirection: 'column', gap: '0' },
                elements: [
                  { content: { type: 'div' }, styles: { backgroundColor: '#201D19', height: '320px', width: '100%' } },
                  { content: { type: 'paragraph', text: 'NEW' }, styles: { fontFamily: "'Inter', sans-serif", fontSize: '9px', color: '#C9A96E', letterSpacing: '0.15em', margin: '12px 0 4px', borderLeft: '2px solid #C9A96E', paddingLeft: '8px' } },
                  { content: { type: 'heading', level: 'h4', text: 'Silk Slip Dress' }, styles: { fontFamily: "'Inter', sans-serif", fontSize: '13px', fontWeight: '400', color: '#F5F0E8', margin: '0 0 4px 0' } },
                  { content: { type: 'paragraph', text: '$420' }, styles: { fontFamily: "'Inter', sans-serif", fontSize: '13px', color: '#827D76', margin: '0' } },
                ],
              },
              {
                span: { desktop: 3, tablet: 6, mobile: 6 },
                styles: { display: 'flex', flexDirection: 'column', gap: '0' },
                elements: [
                  { content: { type: 'div' }, styles: { backgroundColor: '#2A2621', height: '320px', width: '100%' } },
                  { content: { type: 'paragraph', text: 'BESTSELLER' }, styles: { fontFamily: "'Inter', sans-serif", fontSize: '9px', color: '#C9A96E', letterSpacing: '0.15em', margin: '12px 0 4px', borderLeft: '2px solid #C9A96E', paddingLeft: '8px' } },
                  { content: { type: 'heading', level: 'h4', text: 'Tailored Blazer' }, styles: { fontFamily: "'Inter', sans-serif", fontSize: '13px', fontWeight: '400', color: '#F5F0E8', margin: '0 0 4px 0' } },
                  { content: { type: 'paragraph', text: '$890' }, styles: { fontFamily: "'Inter', sans-serif", fontSize: '13px', color: '#827D76', margin: '0' } },
                ],
              },
              {
                span: { desktop: 3, tablet: 6, mobile: 6 },
                styles: { display: 'flex', flexDirection: 'column', gap: '0' },
                elements: [
                  { content: { type: 'div' }, styles: { backgroundColor: '#161412', height: '320px', width: '100%' } },
                  { content: { type: 'paragraph', text: ' ' }, styles: { margin: '12px 0 4px' } },
                  { content: { type: 'heading', level: 'h4', text: 'Leather Trousers' }, styles: { fontFamily: "'Inter', sans-serif", fontSize: '13px', fontWeight: '400', color: '#F5F0E8', margin: '0 0 4px 0' } },
                  { content: { type: 'paragraph', text: '$640' }, styles: { fontFamily: "'Inter', sans-serif", fontSize: '13px', color: '#827D76', margin: '0' } },
                ],
              },
              {
                span: { desktop: 3, tablet: 6, mobile: 6 },
                styles: { display: 'flex', flexDirection: 'column', gap: '0' },
                elements: [
                  { content: { type: 'div' }, styles: { backgroundColor: '#201D19', height: '320px', width: '100%' } },
                  { content: { type: 'paragraph', text: 'LOW STOCK' }, styles: { fontFamily: "'Inter', sans-serif", fontSize: '9px', color: '#C9A96E', letterSpacing: '0.15em', margin: '12px 0 4px', borderLeft: '2px solid #C9A96E', paddingLeft: '8px' } },
                  { content: { type: 'heading', level: 'h4', text: 'Cashmere Turtleneck' }, styles: { fontFamily: "'Inter', sans-serif", fontSize: '13px', fontWeight: '400', color: '#F5F0E8', margin: '0 0 4px 0' } },
                  { content: { type: 'paragraph', text: '$310' }, styles: { fontFamily: "'Inter', sans-serif", fontSize: '13px', color: '#827D76', margin: '0' } },
                ],
              },
            ],
          },
        ],
      },

      // 6. Editorial Quote
      {
        styles: { backgroundColor: '#161412', padding: '80px 60px', textAlign: 'center' },
        responsive: { mobile: { padding: '60px 20px' } },
        rows: [{
          styles: { justifyContent: 'center' },
          columns: [{
            span: { desktop: 10, tablet: 12, mobile: 12 },
            styles: { display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0' },
            elements: [
              { content: { type: 'div' }, styles: { width: '1px', height: '60px', backgroundColor: '#46423D', margin: '0 auto 24px' } },
              { content: { type: 'heading', level: 'h2', text: '"Fashion is the armor to survive everyday life."' }, styles: { fontFamily: "'Inter', sans-serif", fontSize: '36px', fontWeight: '700', color: '#F5F0E8', lineHeight: '1.2', margin: '0 0 24px 0', letterSpacing: '-0.02em', textAlign: 'center' }, responsive: { tablet: { fontSize: '28px' }, mobile: { fontSize: '22px' } } },
              { content: { type: 'paragraph', text: '— Bill Cunningham' }, styles: { fontFamily: "'Inter', sans-serif", fontSize: '13px', color: '#C9A96E', letterSpacing: '0.15em', margin: '0', textAlign: 'center' } },
            ],
          }],
        }],
      },

      // 7. Newsletter
      {
        styles: { backgroundColor: '#0A0908', padding: '72px 60px', borderTop: '1px solid #26231F' },
        responsive: { mobile: { padding: '52px 20px' } },
        rows: [{
          styles: { justifyContent: 'center', flexDirection: 'column', alignItems: 'center', gap: '0' },
          columns: [{
            span: { desktop: 8, tablet: 10, mobile: 12 },
            styles: { display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' },
            elements: [
              { content: { type: 'paragraph', text: 'THE INSIDE TRACK' }, styles: { fontFamily: "'Inter', sans-serif", fontSize: '9px', color: '#C9A96E', letterSpacing: '0.45em', margin: '0 0 16px 0' } },
              { content: { type: 'heading', level: 'h2', text: 'First Access. Always.' }, styles: { fontFamily: "'Inter', sans-serif", fontSize: '36px', fontWeight: '700', color: '#F5F0E8', margin: '0 0 12px 0', letterSpacing: '-0.02em' }, responsive: { mobile: { fontSize: '26px' } } },
              { content: { type: 'paragraph', text: 'New drops, private sales, and editorial — direct to your inbox.' }, styles: { fontFamily: "'Inter', sans-serif", fontSize: '14px', color: '#827D76', margin: '0 0 32px 0', lineHeight: '1.6' } },
              { content: { type: 'form' }, styles: { display: 'flex', gap: '0', width: '100%', maxWidth: '520px', flexWrap: 'wrap', justifyContent: 'center' } },
              { content: { type: 'paragraph', text: 'No spam. Unsubscribe anytime.' }, styles: { fontFamily: "'Inter', sans-serif", fontSize: '11px', color: '#46423D', margin: '16px 0 0 0' } },
            ],
          }],
        }],
      },

      // 8. Footer
      {
        styles: { backgroundColor: '#07070600', padding: '52px 60px 32px', borderTop: '1px solid #26231F' },
        responsive: { tablet: { padding: '40px 32px 24px' }, mobile: { padding: '36px 20px 24px' } },
        rows: [
          {
            styles: { alignItems: 'flex-start', marginBottom: '40px' },
            responsive: { mobile: { flexDirection: 'column', gap: '32px' } },
            columns: [
              {
                span: { desktop: 4, tablet: 4, mobile: 12 },
                styles: { display: 'flex', flexDirection: 'column', gap: '8px' },
                elements: [
                  { content: { type: 'heading', level: 'h3', text: 'NOIR' }, styles: { fontFamily: "'Inter', sans-serif", fontSize: '22px', fontWeight: '700', color: '#F5F0E8', margin: '0', letterSpacing: '0.5em' } },
                  { content: { type: 'paragraph', text: 'Luxury. Defined.' }, styles: { fontFamily: "'Inter', sans-serif", fontSize: '11px', color: '#46423D', margin: '0', letterSpacing: '0.08em' } },
                  { content: { type: 'paragraph', text: 'IG  ·  PT  ·  TT' }, styles: { fontFamily: "'Inter', sans-serif", fontSize: '10px', color: '#827D76', margin: '16px 0 0 0', letterSpacing: '0.2em' } },
                ],
              },
              {
                span: { desktop: 2, tablet: 2, mobile: 6 },
                styles: { display: 'flex', flexDirection: 'column', gap: '12px' },
                elements: [
                  { content: { type: 'paragraph', text: 'COMPANY' }, styles: { fontFamily: "'Inter', sans-serif", fontSize: '9px', fontWeight: '700', color: '#F5F0E8', letterSpacing: '0.3em', margin: '0 0 4px 0' } },
                  { content: { type: 'button', text: 'About', href: '#', variant: 'ghost' }, styles: { fontFamily: "'Inter', sans-serif", fontSize: '11px', color: '#46423D', background: 'none', border: 'none', padding: '0', cursor: 'pointer', textAlign: 'left' } },
                  { content: { type: 'button', text: 'Careers', href: '#', variant: 'ghost' }, styles: { fontFamily: "'Inter', sans-serif", fontSize: '11px', color: '#46423D', background: 'none', border: 'none', padding: '0', cursor: 'pointer', textAlign: 'left' } },
                  { content: { type: 'button', text: 'Press', href: '#', variant: 'ghost' }, styles: { fontFamily: "'Inter', sans-serif", fontSize: '11px', color: '#46423D', background: 'none', border: 'none', padding: '0', cursor: 'pointer', textAlign: 'left' } },
                  { content: { type: 'button', text: 'Sustainability', href: '#', variant: 'ghost' }, styles: { fontFamily: "'Inter', sans-serif", fontSize: '11px', color: '#46423D', background: 'none', border: 'none', padding: '0', cursor: 'pointer', textAlign: 'left' } },
                ],
              },
              {
                span: { desktop: 2, tablet: 2, mobile: 6 },
                styles: { display: 'flex', flexDirection: 'column', gap: '12px' },
                elements: [
                  { content: { type: 'paragraph', text: 'SUPPORT' }, styles: { fontFamily: "'Inter', sans-serif", fontSize: '9px', fontWeight: '700', color: '#F5F0E8', letterSpacing: '0.3em', margin: '0 0 4px 0' } },
                  { content: { type: 'button', text: 'Contact', href: '#', variant: 'ghost' }, styles: { fontFamily: "'Inter', sans-serif", fontSize: '11px', color: '#46423D', background: 'none', border: 'none', padding: '0', cursor: 'pointer', textAlign: 'left' } },
                  { content: { type: 'button', text: 'Shipping', href: '#', variant: 'ghost' }, styles: { fontFamily: "'Inter', sans-serif", fontSize: '11px', color: '#46423D', background: 'none', border: 'none', padding: '0', cursor: 'pointer', textAlign: 'left' } },
                  { content: { type: 'button', text: 'Returns', href: '#', variant: 'ghost' }, styles: { fontFamily: "'Inter', sans-serif", fontSize: '11px', color: '#46423D', background: 'none', border: 'none', padding: '0', cursor: 'pointer', textAlign: 'left' } },
                  { content: { type: 'button', text: 'Size Guide', href: '#', variant: 'ghost' }, styles: { fontFamily: "'Inter', sans-serif", fontSize: '11px', color: '#46423D', background: 'none', border: 'none', padding: '0', cursor: 'pointer', textAlign: 'left' } },
                ],
              },
              {
                span: { desktop: 2, tablet: 4, mobile: 6 },
                styles: { display: 'flex', flexDirection: 'column', gap: '12px' },
                elements: [
                  { content: { type: 'paragraph', text: 'DISCOVER' }, styles: { fontFamily: "'Inter', sans-serif", fontSize: '9px', fontWeight: '700', color: '#F5F0E8', letterSpacing: '0.3em', margin: '0 0 4px 0' } },
                  { content: { type: 'button', text: 'Lookbook', href: '#', variant: 'ghost' }, styles: { fontFamily: "'Inter', sans-serif", fontSize: '11px', color: '#46423D', background: 'none', border: 'none', padding: '0', cursor: 'pointer', textAlign: 'left' } },
                  { content: { type: 'button', text: 'Blog', href: '#', variant: 'ghost' }, styles: { fontFamily: "'Inter', sans-serif", fontSize: '11px', color: '#46423D', background: 'none', border: 'none', padding: '0', cursor: 'pointer', textAlign: 'left' } },
                  { content: { type: 'button', text: 'Gift Cards', href: '#', variant: 'ghost' }, styles: { fontFamily: "'Inter', sans-serif", fontSize: '11px', color: '#46423D', background: 'none', border: 'none', padding: '0', cursor: 'pointer', textAlign: 'left' } },
                ],
              },
              {
                span: { desktop: 2, tablet: 4, mobile: 6 },
                styles: { display: 'flex', flexDirection: 'column', gap: '12px' },
                elements: [
                  { content: { type: 'paragraph', text: 'LEGAL' }, styles: { fontFamily: "'Inter', sans-serif", fontSize: '9px', fontWeight: '700', color: '#F5F0E8', letterSpacing: '0.3em', margin: '0 0 4px 0' } },
                  { content: { type: 'button', text: 'Privacy', href: '#', variant: 'ghost' }, styles: { fontFamily: "'Inter', sans-serif", fontSize: '11px', color: '#46423D', background: 'none', border: 'none', padding: '0', cursor: 'pointer', textAlign: 'left' } },
                  { content: { type: 'button', text: 'Terms', href: '#', variant: 'ghost' }, styles: { fontFamily: "'Inter', sans-serif", fontSize: '11px', color: '#46423D', background: 'none', border: 'none', padding: '0', cursor: 'pointer', textAlign: 'left' } },
                  { content: { type: 'button', text: 'Cookies', href: '#', variant: 'ghost' }, styles: { fontFamily: "'Inter', sans-serif", fontSize: '11px', color: '#46423D', background: 'none', border: 'none', padding: '0', cursor: 'pointer', textAlign: 'left' } },
                ],
              },
            ],
          },
          {
            styles: { borderTop: '1px solid #26231F', paddingTop: '24px', alignItems: 'center', justifyContent: 'space-between' },
            columns: [{
              span: { desktop: 12, tablet: 12, mobile: 12 },
              elements: [
                { content: { type: 'paragraph', text: '© 2026 NOIR. All rights reserved.  ·  A Modern Luxury Brand.' }, styles: { fontFamily: "'Inter', sans-serif", fontSize: '10px', color: '#46423D', margin: '0', letterSpacing: '0.05em' } },
              ],
            }],
          },
        ],
      },

    ],
  },

]

export { _removedHeaderTemplates }
