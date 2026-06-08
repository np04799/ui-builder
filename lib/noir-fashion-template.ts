/**
 * NOIR Fashion E-Commerce — PPC landing page template
 * Kept in a separate file so it's always freshly bundled,
 * independent of the large lib/templates.ts build cache.
 */
import type { Template } from './templates'

export const NOIR_FASHION_TEMPLATE: Template = {
  id: 'ppc-noir-fashion',
  label: 'NOIR — Fashion E-Commerce',
  category: 'ppc',
  desc: 'Dark luxury fashion e-commerce homepage. 8 sections: nav, hero, collections, featured product, trending, editorial quote, newsletter, footer.',
  sections: [
    // 1. Navigation
    {
      styles: { backgroundColor: '#0A0908', borderBottom: '1px solid #26231F', padding: '0 60px', position: 'sticky', top: '0', zIndex: '100' },
      rows: [{
        locked: true,
        styles: { alignItems: 'center', justifyContent: 'space-between', minHeight: '76px', flexWrap: 'nowrap', gap: '16px' },
        columns: [
          { span: { desktop: 4, tablet: 4, mobile: 0 }, styles: { display: 'flex', alignItems: 'center', gap: '32px' },
            elements: [
              { content: { type: 'button', text: 'COLLECTIONS', href: '#', variant: 'ghost' }, styles: { fontFamily: "'Inter',sans-serif", color: '#827D76', fontSize: '11px', letterSpacing: '0.18em', background: 'none', border: 'none', padding: '0', cursor: 'pointer' } },
              { content: { type: 'button', text: 'NEW ARRIVALS', href: '#', variant: 'ghost' }, styles: { fontFamily: "'Inter',sans-serif", color: '#827D76', fontSize: '11px', letterSpacing: '0.18em', background: 'none', border: 'none', padding: '0', cursor: 'pointer' } },
            ],
          },
          { span: { desktop: 4, tablet: 4, mobile: 8 }, styles: { display: 'flex', alignItems: 'center', justifyContent: 'center' },
            elements: [
              { content: { type: 'heading', level: 'h1', text: 'NOIR' }, styles: { fontFamily: "'Inter',sans-serif", fontSize: '26px', fontWeight: '700', color: '#F5F0E8', margin: '0', letterSpacing: '0.55em' } },
            ],
          },
          { span: { desktop: 4, tablet: 4, mobile: 4 }, styles: { display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '28px' },
            elements: [
              { content: { type: 'button', text: 'SALE', href: '#', variant: 'ghost' }, styles: { fontFamily: "'Inter',sans-serif", color: '#C9A96E', fontSize: '11px', letterSpacing: '0.18em', background: 'none', border: 'none', padding: '0', cursor: 'pointer' } },
              { content: { type: 'button', text: 'Bag', href: '#', variant: 'ghost' }, styles: { fontFamily: "'Inter',sans-serif", color: '#827D76', fontSize: '11px', background: 'none', border: 'none', padding: '0', cursor: 'pointer' } },
            ],
          },
        ],
      }],
    },
    // 2. Hero
    {
      styles: { backgroundColor: '#100F0D', padding: '0', overflow: 'hidden' },
      rows: [{
        styles: { minHeight: '680px', alignItems: 'stretch' },
        columns: [
          { span: { desktop: 5, tablet: 6, mobile: 12 }, styles: { backgroundColor: '#100F0D', padding: '80px 60px', display: 'flex', flexDirection: 'column', justifyContent: 'center' },
            elements: [
              { content: { type: 'paragraph', text: 'SS 2026 COLLECTION' }, styles: { fontFamily: "'Inter',sans-serif", fontSize: '10px', color: '#C9A96E', letterSpacing: '0.4em', margin: '0 0 28px 0' } },
              { content: { type: 'heading', level: 'h1', text: 'DEFINE YOUR AESTHETIC' }, styles: { fontFamily: "'Inter',sans-serif", fontSize: '64px', fontWeight: '700', color: '#F5F0E8', lineHeight: '1.0', letterSpacing: '-0.02em', margin: '0 0 32px 0' } },
              { content: { type: 'paragraph', text: 'Curated luxury for the discerning wardrobe. Structured silhouettes. Timeless pieces.' }, styles: { fontFamily: "'Inter',sans-serif", fontSize: '15px', color: '#827D76', lineHeight: '1.7', margin: '0 0 40px 0', maxWidth: '320px' } },
              { content: { type: 'button', text: 'SHOP NOW', href: '#', variant: 'primary' }, styles: { backgroundColor: '#C9A96E', color: '#0A0908', padding: '16px 40px', fontFamily: "'Inter',sans-serif", fontSize: '11px', fontWeight: '700', letterSpacing: '0.25em', border: 'none', cursor: 'pointer', display: 'inline-block' } },
            ],
          },
          { span: { desktop: 7, tablet: 6, mobile: 12 }, styles: { backgroundColor: '#201D19', minHeight: '680px', display: 'flex', alignItems: 'center', justifyContent: 'center' },
            elements: [
              { content: { type: 'paragraph', text: 'Editorial Campaign Image' }, styles: { fontFamily: "'Inter',sans-serif", fontSize: '12px', color: '#46423D', letterSpacing: '0.1em', margin: '0', textAlign: 'center' } },
            ],
          },
        ],
      }],
    },
    // 3. Collections
    {
      styles: { backgroundColor: '#0A0908', padding: '64px 60px' },
      rows: [
        { styles: { marginBottom: '28px' }, columns: [{ span: { desktop: 12, tablet: 12, mobile: 12 }, elements: [{ content: { type: 'paragraph', text: 'SHOP BY CATEGORY' }, styles: { fontFamily: "'Inter',sans-serif", fontSize: '10px', color: '#46423D', letterSpacing: '0.4em', margin: '0' } }] }] },
        { styles: { gap: '16px', alignItems: 'stretch' }, columns: [
          { span: { desktop: 4, tablet: 4, mobile: 12 }, styles: { backgroundColor: '#161412' },
            elements: [
              { content: { type: 'image', src: 'https://picsum.photos/seed/noir-new/600/520', alt: 'New Arrivals', objectFit: 'cover' }, styles: { height: '260px', width: '100%' } },
              { content: { type: 'heading', level: 'h3', text: 'NEW ARRIVALS' }, styles: { fontFamily: "'Inter',sans-serif", fontSize: '13px', fontWeight: '700', color: '#F5F0E8', letterSpacing: '0.2em', margin: '20px 20px 6px' } },
              { content: { type: 'paragraph', text: '140 Pieces' }, styles: { fontFamily: "'Inter',sans-serif", fontSize: '11px', color: '#827D76', margin: '0 20px 6px' } },
            ],
          },
          { span: { desktop: 4, tablet: 4, mobile: 12 }, styles: { backgroundColor: '#161412' },
            elements: [
              { content: { type: 'image', src: 'https://picsum.photos/seed/noir-best/600/520', alt: 'Bestsellers', objectFit: 'cover' }, styles: { height: '260px', width: '100%' } },
              { content: { type: 'heading', level: 'h3', text: 'BESTSELLERS' }, styles: { fontFamily: "'Inter',sans-serif", fontSize: '13px', fontWeight: '700', color: '#F5F0E8', letterSpacing: '0.2em', margin: '20px 20px 6px' } },
              { content: { type: 'paragraph', text: '68 Pieces' }, styles: { fontFamily: "'Inter',sans-serif", fontSize: '11px', color: '#827D76', margin: '0 20px 6px' } },
            ],
          },
          { span: { desktop: 4, tablet: 4, mobile: 12 }, styles: { backgroundColor: '#1A1210' },
            elements: [
              { content: { type: 'image', src: 'https://picsum.photos/seed/noir-sale/600/520', alt: 'Sale', objectFit: 'cover' }, styles: { height: '260px', width: '100%' } },
              { content: { type: 'heading', level: 'h3', text: 'SALE UP TO 50%' }, styles: { fontFamily: "'Inter',sans-serif", fontSize: '13px', fontWeight: '700', color: '#F5F0E8', letterSpacing: '0.2em', margin: '20px 20px 6px' } },
              { content: { type: 'paragraph', text: 'Limited Time' }, styles: { fontFamily: "'Inter',sans-serif", fontSize: '11px', color: '#C9A96E', margin: '0 20px 6px' } },
            ],
          },
        ]},
      ],
    },
    // 4. Featured Product
    {
      styles: { backgroundColor: '#100F0D', padding: '0', overflow: 'hidden' },
      rows: [{
        styles: { alignItems: 'stretch', minHeight: '600px' },
        columns: [
          { span: { desktop: 5, tablet: 5, mobile: 12 }, styles: { backgroundColor: '#201D19', minHeight: '600px', display: 'flex', alignItems: 'center', justifyContent: 'center' },
            elements: [{ content: { type: 'paragraph', text: 'Product Photo' }, styles: { fontFamily: "'Inter',sans-serif", fontSize: '12px', color: '#46423D', margin: '0' } }],
          },
          { span: { desktop: 7, tablet: 7, mobile: 12 }, styles: { padding: '80px 60px', display: 'flex', flexDirection: 'column', justifyContent: 'center' },
            elements: [
              { content: { type: 'paragraph', text: 'FEATURED PIECE' }, styles: { fontFamily: "'Inter',sans-serif", fontSize: '9px', color: '#C9A96E', letterSpacing: '0.45em', margin: '0 0 20px 0' } },
              { content: { type: 'heading', level: 'h2', text: 'The Obsidian Overcoat' }, styles: { fontFamily: "'Inter',sans-serif", fontSize: '48px', fontWeight: '700', color: '#F5F0E8', lineHeight: '1.05', margin: '0 0 20px 0', letterSpacing: '-0.02em' } },
              { content: { type: 'paragraph', text: 'Crafted from double-faced cashmere. Structured silhouette, precision-cut lapels.' }, styles: { fontFamily: "'Inter',sans-serif", fontSize: '14px', color: '#827D76', lineHeight: '1.75', margin: '0 0 24px 0' } },
              { content: { type: 'heading', level: 'h3', text: '$1,890' }, styles: { fontFamily: "'Inter',sans-serif", fontSize: '32px', fontWeight: '700', color: '#F5F0E8', margin: '0 0 28px 0' } },
              { content: { type: 'button', text: 'ADD TO BAG', href: '#', variant: 'primary' }, styles: { backgroundColor: '#C9A96E', color: '#0A0908', padding: '18px 48px', fontFamily: "'Inter',sans-serif", fontSize: '11px', fontWeight: '700', letterSpacing: '0.25em', border: 'none', cursor: 'pointer', display: 'inline-block' } },
            ],
          },
        ],
      }],
    },
    // 5. Trending Products
    {
      styles: { backgroundColor: '#0A0908', padding: '64px 60px' },
      rows: [
        { styles: { marginBottom: '28px' }, columns: [{ span: { desktop: 12, tablet: 12, mobile: 12 }, elements: [{ content: { type: 'paragraph', text: 'TRENDING NOW' }, styles: { fontFamily: "'Inter',sans-serif", fontSize: '10px', color: '#46423D', letterSpacing: '0.4em', margin: '0' } }] }] },
        { styles: { gap: '12px' }, columns: [
          { span: { desktop: 3, tablet: 6, mobile: 6 }, elements: [
            { content: { type: 'image', src: 'https://picsum.photos/seed/noir-slip/400/640', alt: 'Silk Slip Dress', objectFit: 'cover' }, styles: { height: '320px', width: '100%' } },
            { content: { type: 'heading', level: 'h4', text: 'Silk Slip Dress' }, styles: { fontFamily: "'Inter',sans-serif", fontSize: '13px', fontWeight: '400', color: '#F5F0E8', margin: '12px 0 4px 0' } },
            { content: { type: 'paragraph', text: '$420' }, styles: { fontFamily: "'Inter',sans-serif", fontSize: '13px', color: '#827D76', margin: '0' } },
          ]},
          { span: { desktop: 3, tablet: 6, mobile: 6 }, elements: [
            { content: { type: 'image', src: 'https://picsum.photos/seed/noir-blazer/400/640', alt: 'Tailored Blazer', objectFit: 'cover' }, styles: { height: '320px', width: '100%' } },
            { content: { type: 'heading', level: 'h4', text: 'Tailored Blazer' }, styles: { fontFamily: "'Inter',sans-serif", fontSize: '13px', fontWeight: '400', color: '#F5F0E8', margin: '12px 0 4px 0' } },
            { content: { type: 'paragraph', text: '$890' }, styles: { fontFamily: "'Inter',sans-serif", fontSize: '13px', color: '#827D76', margin: '0' } },
          ]},
          { span: { desktop: 3, tablet: 6, mobile: 6 }, elements: [
            { content: { type: 'image', src: 'https://picsum.photos/seed/noir-leather/400/640', alt: 'Leather Trousers', objectFit: 'cover' }, styles: { height: '320px', width: '100%' } },
            { content: { type: 'heading', level: 'h4', text: 'Leather Trousers' }, styles: { fontFamily: "'Inter',sans-serif", fontSize: '13px', fontWeight: '400', color: '#F5F0E8', margin: '12px 0 4px 0' } },
            { content: { type: 'paragraph', text: '$640' }, styles: { fontFamily: "'Inter',sans-serif", fontSize: '13px', color: '#827D76', margin: '0' } },
          ]},
          { span: { desktop: 3, tablet: 6, mobile: 6 }, elements: [
            { content: { type: 'image', src: 'https://picsum.photos/seed/noir-cash/400/640', alt: 'Cashmere Turtleneck', objectFit: 'cover' }, styles: { height: '320px', width: '100%' } },
            { content: { type: 'heading', level: 'h4', text: 'Cashmere Turtleneck' }, styles: { fontFamily: "'Inter',sans-serif", fontSize: '13px', fontWeight: '400', color: '#F5F0E8', margin: '12px 0 4px 0' } },
            { content: { type: 'paragraph', text: '$310' }, styles: { fontFamily: "'Inter',sans-serif", fontSize: '13px', color: '#827D76', margin: '0' } },
          ]},
        ]},
      ],
    },
    // 6. Editorial Quote
    {
      styles: { backgroundColor: '#161412', padding: '80px 60px', textAlign: 'center' },
      rows: [{ styles: { justifyContent: 'center' }, columns: [{ span: { desktop: 10, tablet: 12, mobile: 12 }, styles: { display: 'flex', flexDirection: 'column', alignItems: 'center' },
        elements: [
          { content: { type: 'heading', level: 'h2', text: '"Fashion is the armor to survive everyday life."' }, styles: { fontFamily: "'Inter',sans-serif", fontSize: '36px', fontWeight: '700', color: '#F5F0E8', lineHeight: '1.2', margin: '0 0 24px 0', letterSpacing: '-0.02em', textAlign: 'center' } },
          { content: { type: 'paragraph', text: '— Bill Cunningham' }, styles: { fontFamily: "'Inter',sans-serif", fontSize: '13px', color: '#C9A96E', letterSpacing: '0.15em', margin: '0', textAlign: 'center' } },
        ],
      }]}],
    },
    // 7. Newsletter
    {
      styles: { backgroundColor: '#0A0908', padding: '72px 60px', borderTop: '1px solid #26231F' },
      rows: [{ styles: { justifyContent: 'center' }, columns: [{ span: { desktop: 8, tablet: 10, mobile: 12 }, styles: { display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' },
        elements: [
          { content: { type: 'paragraph', text: 'THE INSIDE TRACK' }, styles: { fontFamily: "'Inter',sans-serif", fontSize: '9px', color: '#C9A96E', letterSpacing: '0.45em', margin: '0 0 16px 0' } },
          { content: { type: 'heading', level: 'h2', text: 'First Access. Always.' }, styles: { fontFamily: "'Inter',sans-serif", fontSize: '36px', fontWeight: '700', color: '#F5F0E8', margin: '0 0 12px 0', letterSpacing: '-0.02em' } },
          { content: { type: 'paragraph', text: 'New drops, private sales, and editorial — direct to your inbox.' }, styles: { fontFamily: "'Inter',sans-serif", fontSize: '14px', color: '#827D76', margin: '0 0 32px 0', lineHeight: '1.6' } },
        ],
      }]}],
    },
    // 8. Footer
    {
      styles: { backgroundColor: '#0A0908', padding: '52px 60px 32px', borderTop: '1px solid #26231F' },
      rows: [
        { styles: { alignItems: 'flex-start', marginBottom: '40px' }, columns: [
          { span: { desktop: 4, tablet: 4, mobile: 12 }, elements: [
            { content: { type: 'heading', level: 'h3', text: 'NOIR' }, styles: { fontFamily: "'Inter',sans-serif", fontSize: '22px', fontWeight: '700', color: '#F5F0E8', margin: '0', letterSpacing: '0.5em' } },
            { content: { type: 'paragraph', text: 'Luxury. Defined.' }, styles: { fontFamily: "'Inter',sans-serif", fontSize: '11px', color: '#46423D', margin: '0' } },
          ]},
          { span: { desktop: 2, tablet: 4, mobile: 6 }, elements: [
            { content: { type: 'paragraph', text: 'COMPANY' }, styles: { fontFamily: "'Inter',sans-serif", fontSize: '9px', fontWeight: '700', color: '#F5F0E8', letterSpacing: '0.3em', margin: '0 0 12px 0' } },
            { content: { type: 'button', text: 'About', href: '#', variant: 'ghost' }, styles: { fontFamily: "'Inter',sans-serif", fontSize: '11px', color: '#46423D', background: 'none', border: 'none', padding: '0', cursor: 'pointer', display: 'block' } },
            { content: { type: 'button', text: 'Careers', href: '#', variant: 'ghost' }, styles: { fontFamily: "'Inter',sans-serif", fontSize: '11px', color: '#46423D', background: 'none', border: 'none', padding: '0', cursor: 'pointer', display: 'block' } },
          ]},
          { span: { desktop: 2, tablet: 4, mobile: 6 }, elements: [
            { content: { type: 'paragraph', text: 'SUPPORT' }, styles: { fontFamily: "'Inter',sans-serif", fontSize: '9px', fontWeight: '700', color: '#F5F0E8', letterSpacing: '0.3em', margin: '0 0 12px 0' } },
            { content: { type: 'button', text: 'Contact', href: '#', variant: 'ghost' }, styles: { fontFamily: "'Inter',sans-serif", fontSize: '11px', color: '#46423D', background: 'none', border: 'none', padding: '0', cursor: 'pointer', display: 'block' } },
            { content: { type: 'button', text: 'Returns', href: '#', variant: 'ghost' }, styles: { fontFamily: "'Inter',sans-serif", fontSize: '11px', color: '#46423D', background: 'none', border: 'none', padding: '0', cursor: 'pointer', display: 'block' } },
          ]},
        ]},
        { styles: { borderTop: '1px solid #26231F', paddingTop: '24px' }, columns: [{ span: { desktop: 12, tablet: 12, mobile: 12 },
          elements: [{ content: { type: 'paragraph', text: '© 2026 NOIR. All rights reserved.' }, styles: { fontFamily: "'Inter',sans-serif", fontSize: '10px', color: '#46423D', margin: '0' } }],
        }]},
      ],
    },
  ],
}
