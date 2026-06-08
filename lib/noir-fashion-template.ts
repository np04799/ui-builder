/**
 * NOIR Fashion E-Commerce — PPC landing page template
 * v3: Functional e-commerce layout (product-first, promotional, trust-driven)
 */
import type { Template } from './templates'

export const NOIR_FASHION_TEMPLATE: Template = {
  id: 'ppc-noir-fashion',
  label: 'NOIR — Fashion E-Commerce',
  category: 'ppc',
  desc: 'Dark luxury fashion e-commerce homepage. 9 sections: announcement + nav, hero, categories, new arrivals, sale banner, bestsellers, trust bar, newsletter, footer.',
  sections: [

    // ─── 1. Announcement Bar + Navigation ─────────────────────────────────────
    {
      styles: { backgroundColor: '#111010' },
      rows: [
        // Announcement bar
        {
          styles: { backgroundColor: '#C9A96E', padding: '9px 24px', textAlign: 'center' },
          columns: [{
            span: { desktop: 12, tablet: 12, mobile: 12 },
            elements: [{
              content: { type: 'paragraph', text: '🎉  LIMITED TIME: 30% OFF SITEWIDE — USE CODE NOIR30  ·  FREE SHIPPING OVER $150  🎉' },
              styles: { fontFamily: "'Inter',sans-serif", fontSize: '11px', fontWeight: '600', color: '#0A0908', margin: '0', textAlign: 'center', letterSpacing: '0.05em' },
              responsive: {},
            }],
            styles: {},
            responsive: {},
          }],
        },
        // Navigation
        {
          styles: { padding: '0 32px', borderBottom: '1px solid #222' },
          columns: [
            // Logo
            {
              span: { desktop: 2, tablet: 3, mobile: 6 },
              elements: [{
                content: { type: 'heading', level: 'h1', text: 'NOIR.' },
                styles: { fontFamily: "'Inter',sans-serif", fontSize: '22px', fontWeight: '800', color: '#F5F0E8', margin: '0', lineHeight: '60px', letterSpacing: '0.1em' },
                responsive: {},
              }],
              styles: { display: 'flex', alignItems: 'center' },
              responsive: {},
            },
            // Nav Links
            {
              span: { desktop: 8, tablet: 6, mobile: 12 },
              elements: [{
                content: { type: 'paragraph', text: 'WOMEN    MEN    NEW IN    SALE    BRANDS' },
                styles: { fontFamily: "'Inter',sans-serif", fontSize: '11px', fontWeight: '600', color: '#9C9690', margin: '0', textAlign: 'center', lineHeight: '60px', letterSpacing: '0.18em' },
                responsive: {},
              }],
              styles: { textAlign: 'center' },
              responsive: {},
            },
            // Icons
            {
              span: { desktop: 2, tablet: 3, mobile: 6 },
              elements: [{
                content: { type: 'paragraph', text: '🔍  ♡  🛒' },
                styles: { fontFamily: "'Inter',sans-serif", fontSize: '16px', color: '#F5F0E8', margin: '0', lineHeight: '60px', textAlign: 'right', letterSpacing: '0.5em' },
                responsive: {},
              }],
              styles: { display: 'flex', alignItems: 'center', justifyContent: 'flex-end' },
              responsive: {},
            },
          ],
        },
      ],
    },

    // ─── 2. Hero Banner ────────────────────────────────────────────────────────
    {
      styles: {
        backgroundImage: "url('https://images.unsplash.com/photo-1558618666-fcd25c85cd64?auto=format&fit=crop&w=1600&h=750&q=85')",
        backgroundSize: 'cover',
        backgroundPosition: 'center 30%',
        minHeight: '580px',
        display: 'flex',
        alignItems: 'center',
        position: 'relative',
      },
      rows: [{
        styles: { background: 'linear-gradient(90deg,rgba(10,9,8,0.88) 40%,rgba(10,9,8,0.15) 100%)', padding: '80px 60px', width: '100%', minHeight: '580px', display: 'flex', alignItems: 'center' },
        columns: [{
          span: { desktop: 6, tablet: 8, mobile: 12 },
          elements: [
            {
              content: { type: 'paragraph', text: 'NEW SEASON JUST DROPPED' },
              styles: { fontFamily: "'Inter',sans-serif", fontSize: '11px', fontWeight: '700', color: '#C9A96E', letterSpacing: '0.35em', margin: '0 0 16px 0', textTransform: 'uppercase' },
              responsive: {},
            },
            {
              content: { type: 'heading', level: 'h2', text: 'Own The Night.' },
              styles: { fontFamily: "'Inter',sans-serif", fontSize: '68px', fontWeight: '800', color: '#FFFFFF', lineHeight: '1.0', margin: '0 0 12px 0', letterSpacing: '-0.03em' },
              responsive: {},
            },
            {
              content: { type: 'heading', level: 'h3', text: 'AW 2025 Collection' },
              styles: { fontFamily: "'Inter',sans-serif", fontSize: '22px', fontWeight: '300', color: 'rgba(245,240,232,0.65)', margin: '0 0 28px 0', letterSpacing: '0.02em' },
              responsive: {},
            },
            {
              content: { type: 'paragraph', text: 'Up to 300 new styles. Free shipping on orders over $150.' },
              styles: { fontFamily: "'Inter',sans-serif", fontSize: '13px', color: 'rgba(245,240,232,0.55)', margin: '0 0 36px 0', lineHeight: '1.6' },
              responsive: {},
            },
            {
              content: { type: 'button', text: 'SHOP NEW IN', href: '#', variant: 'primary' },
              styles: { backgroundColor: '#C9A96E', color: '#0A0908', padding: '16px 40px', fontFamily: "'Inter',sans-serif", fontSize: '12px', fontWeight: '700', letterSpacing: '0.2em', border: 'none', cursor: 'pointer', display: 'inline-block', marginRight: '12px' },
              responsive: {},
            },
            {
              content: { type: 'button', text: 'SHOP SALE', href: '#', variant: 'primary' },
              styles: { backgroundColor: 'transparent', color: '#F5F0E8', padding: '15px 40px', fontFamily: "'Inter',sans-serif", fontSize: '12px', fontWeight: '700', letterSpacing: '0.2em', border: '1px solid rgba(245,240,232,0.4)', cursor: 'pointer', display: 'inline-block' },
              responsive: {},
            },
          ],
          styles: {},
          responsive: {},
        }],
      }],
    },

    // ─── 3. Shop by Category ──────────────────────────────────────────────────
    {
      styles: { backgroundColor: '#0A0908', padding: '48px 32px' },
      rows: [
        {
          styles: { marginBottom: '24px' },
          columns: [{
            span: { desktop: 12, tablet: 12, mobile: 12 },
            elements: [{
              content: { type: 'heading', level: 'h2', text: 'Shop by Category' },
              styles: { fontFamily: "'Inter',sans-serif", fontSize: '22px', fontWeight: '700', color: '#F5F0E8', margin: '0', letterSpacing: '-0.01em' },
              responsive: {},
            }],
            styles: {},
            responsive: {},
          }],
        },
        {
          styles: { gap: '12px' },
          columns: [
            {
              span: { desktop: 3, tablet: 6, mobile: 6 },
              elements: [
                {
                  content: { type: 'image', src: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=500&h=600&q=85', alt: 'Women', objectFit: 'cover' },
                  styles: { width: '100%', height: '280px', display: 'block' },
                  responsive: {},
                },
                {
                  content: { type: 'paragraph', text: 'WOMEN' },
                  styles: { fontFamily: "'Inter',sans-serif", fontSize: '13px', fontWeight: '700', color: '#F5F0E8', margin: '12px 0 4px 0', letterSpacing: '0.15em' },
                  responsive: {},
                },
                {
                  content: { type: 'paragraph', text: '1,200+ styles →' },
                  styles: { fontFamily: "'Inter',sans-serif", fontSize: '12px', color: '#827D76', margin: '0' },
                  responsive: {},
                },
              ],
              styles: { backgroundColor: '#141210', cursor: 'pointer' },
              responsive: {},
            },
            {
              span: { desktop: 3, tablet: 6, mobile: 6 },
              elements: [
                {
                  content: { type: 'image', src: 'https://images.unsplash.com/photo-1617137968427-85924c800a22?auto=format&fit=crop&w=500&h=600&q=85', alt: 'Men', objectFit: 'cover' },
                  styles: { width: '100%', height: '280px', display: 'block' },
                  responsive: {},
                },
                {
                  content: { type: 'paragraph', text: 'MEN' },
                  styles: { fontFamily: "'Inter',sans-serif", fontSize: '13px', fontWeight: '700', color: '#F5F0E8', margin: '12px 0 4px 0', letterSpacing: '0.15em' },
                  responsive: {},
                },
                {
                  content: { type: 'paragraph', text: '800+ styles →' },
                  styles: { fontFamily: "'Inter',sans-serif", fontSize: '12px', color: '#827D76', margin: '0' },
                  responsive: {},
                },
              ],
              styles: { backgroundColor: '#141210', cursor: 'pointer' },
              responsive: {},
            },
            {
              span: { desktop: 3, tablet: 6, mobile: 6 },
              elements: [
                {
                  content: { type: 'image', src: 'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?auto=format&fit=crop&w=500&h=600&q=85', alt: 'Accessories', objectFit: 'cover' },
                  styles: { width: '100%', height: '280px', display: 'block' },
                  responsive: {},
                },
                {
                  content: { type: 'paragraph', text: 'ACCESSORIES' },
                  styles: { fontFamily: "'Inter',sans-serif", fontSize: '13px', fontWeight: '700', color: '#F5F0E8', margin: '12px 0 4px 0', letterSpacing: '0.15em' },
                  responsive: {},
                },
                {
                  content: { type: 'paragraph', text: '400+ styles →' },
                  styles: { fontFamily: "'Inter',sans-serif", fontSize: '12px', color: '#827D76', margin: '0' },
                  responsive: {},
                },
              ],
              styles: { backgroundColor: '#141210', cursor: 'pointer' },
              responsive: {},
            },
            {
              span: { desktop: 3, tablet: 6, mobile: 6 },
              elements: [
                {
                  content: { type: 'image', src: 'https://images.unsplash.com/photo-1487222477894-8943e31ef7b2?auto=format&fit=crop&w=500&h=600&q=85', alt: 'Sale', objectFit: 'cover' },
                  styles: { width: '100%', height: '280px', display: 'block' },
                  responsive: {},
                },
                {
                  content: { type: 'paragraph', text: 'SALE — UP TO 60% OFF' },
                  styles: { fontFamily: "'Inter',sans-serif", fontSize: '13px', fontWeight: '700', color: '#C9A96E', margin: '12px 0 4px 0', letterSpacing: '0.15em' },
                  responsive: {},
                },
                {
                  content: { type: 'paragraph', text: 'Limited time only →' },
                  styles: { fontFamily: "'Inter',sans-serif", fontSize: '12px', color: '#827D76', margin: '0' },
                  responsive: {},
                },
              ],
              styles: { backgroundColor: '#141210', cursor: 'pointer' },
              responsive: {},
            },
          ],
        },
      ],
    },

    // ─── 4. New Arrivals ──────────────────────────────────────────────────────
    {
      styles: { backgroundColor: '#0D0C0B', padding: '48px 32px' },
      rows: [
        // Section header
        {
          styles: { marginBottom: '24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' },
          columns: [
            {
              span: { desktop: 8, tablet: 8, mobile: 8 },
              elements: [{
                content: { type: 'heading', level: 'h2', text: 'New Arrivals' },
                styles: { fontFamily: "'Inter',sans-serif", fontSize: '22px', fontWeight: '700', color: '#F5F0E8', margin: '0', letterSpacing: '-0.01em' },
                responsive: {},
              }],
              styles: {},
              responsive: {},
            },
            {
              span: { desktop: 4, tablet: 4, mobile: 4 },
              elements: [{
                content: { type: 'button', text: 'View All →', href: '#', variant: 'primary' },
                styles: { backgroundColor: 'transparent', color: '#C9A96E', padding: '0', fontFamily: "'Inter',sans-serif", fontSize: '12px', fontWeight: '600', border: 'none', cursor: 'pointer', textAlign: 'right', display: 'block', width: '100%' },
                responsive: {},
              }],
              styles: { display: 'flex', alignItems: 'center', justifyContent: 'flex-end' },
              responsive: {},
            },
          ],
        },
        // Product cards
        {
          styles: { gap: '16px' },
          columns: [
            {
              span: { desktop: 3, tablet: 6, mobile: 6 },
              elements: [
                {
                  content: { type: 'image', src: 'https://images.unsplash.com/photo-1509631179647-0177331693ae?auto=format&fit=crop&w=450&h=560&q=85', alt: 'Oversized Leather Jacket', objectFit: 'cover' },
                  styles: { width: '100%', height: '320px', display: 'block', backgroundColor: '#1a1816' },
                  responsive: {},
                },
                {
                  content: { type: 'paragraph', text: '✦ NEW' },
                  styles: { fontFamily: "'Inter',sans-serif", fontSize: '9px', fontWeight: '700', color: '#C9A96E', letterSpacing: '0.3em', margin: '12px 0 5px 0' },
                  responsive: {},
                },
                {
                  content: { type: 'heading', level: 'h4', text: 'Oversized Leather Jacket' },
                  styles: { fontFamily: "'Inter',sans-serif", fontSize: '13px', fontWeight: '500', color: '#F5F0E8', margin: '0 0 5px 0', lineHeight: '1.3' },
                  responsive: {},
                },
                {
                  content: { type: 'paragraph', text: '$249' },
                  styles: { fontFamily: "'Inter',sans-serif", fontSize: '14px', fontWeight: '700', color: '#F5F0E8', margin: '0 0 12px 0' },
                  responsive: {},
                },
                {
                  content: { type: 'button', text: 'ADD TO CART', href: '#', variant: 'primary' },
                  styles: { backgroundColor: '#C9A96E', color: '#0A0908', padding: '10px 0', fontFamily: "'Inter',sans-serif", fontSize: '10px', fontWeight: '700', letterSpacing: '0.2em', border: 'none', cursor: 'pointer', display: 'block', width: '100%', textAlign: 'center' },
                  responsive: {},
                },
              ],
              styles: {},
              responsive: {},
            },
            {
              span: { desktop: 3, tablet: 6, mobile: 6 },
              elements: [
                {
                  content: { type: 'image', src: 'https://images.unsplash.com/photo-1581044777550-4cfa60707c03?auto=format&fit=crop&w=450&h=560&q=85', alt: 'Ribbed Midi Dress', objectFit: 'cover' },
                  styles: { width: '100%', height: '320px', display: 'block', backgroundColor: '#1a1816' },
                  responsive: {},
                },
                {
                  content: { type: 'paragraph', text: '✦ NEW' },
                  styles: { fontFamily: "'Inter',sans-serif", fontSize: '9px', fontWeight: '700', color: '#C9A96E', letterSpacing: '0.3em', margin: '12px 0 5px 0' },
                  responsive: {},
                },
                {
                  content: { type: 'heading', level: 'h4', text: 'Ribbed Midi Dress' },
                  styles: { fontFamily: "'Inter',sans-serif", fontSize: '13px', fontWeight: '500', color: '#F5F0E8', margin: '0 0 5px 0', lineHeight: '1.3' },
                  responsive: {},
                },
                {
                  content: { type: 'paragraph', text: '$89' },
                  styles: { fontFamily: "'Inter',sans-serif", fontSize: '14px', fontWeight: '700', color: '#F5F0E8', margin: '0 0 12px 0' },
                  responsive: {},
                },
                {
                  content: { type: 'button', text: 'ADD TO CART', href: '#', variant: 'primary' },
                  styles: { backgroundColor: '#C9A96E', color: '#0A0908', padding: '10px 0', fontFamily: "'Inter',sans-serif", fontSize: '10px', fontWeight: '700', letterSpacing: '0.2em', border: 'none', cursor: 'pointer', display: 'block', width: '100%', textAlign: 'center' },
                  responsive: {},
                },
              ],
              styles: {},
              responsive: {},
            },
            {
              span: { desktop: 3, tablet: 6, mobile: 6 },
              elements: [
                {
                  content: { type: 'image', src: 'https://images.unsplash.com/photo-1529139003474-b28b2af36c2c?auto=format&fit=crop&w=450&h=560&q=85', alt: 'Structured Blazer', objectFit: 'cover' },
                  styles: { width: '100%', height: '320px', display: 'block', backgroundColor: '#1a1816' },
                  responsive: {},
                },
                {
                  content: { type: 'paragraph', text: '✦ NEW  ·  TRENDING' },
                  styles: { fontFamily: "'Inter',sans-serif", fontSize: '9px', fontWeight: '700', color: '#C9A96E', letterSpacing: '0.3em', margin: '12px 0 5px 0' },
                  responsive: {},
                },
                {
                  content: { type: 'heading', level: 'h4', text: 'Structured Power Blazer' },
                  styles: { fontFamily: "'Inter',sans-serif", fontSize: '13px', fontWeight: '500', color: '#F5F0E8', margin: '0 0 5px 0', lineHeight: '1.3' },
                  responsive: {},
                },
                {
                  content: { type: 'paragraph', text: '$175' },
                  styles: { fontFamily: "'Inter',sans-serif", fontSize: '14px', fontWeight: '700', color: '#F5F0E8', margin: '0 0 12px 0' },
                  responsive: {},
                },
                {
                  content: { type: 'button', text: 'ADD TO CART', href: '#', variant: 'primary' },
                  styles: { backgroundColor: '#C9A96E', color: '#0A0908', padding: '10px 0', fontFamily: "'Inter',sans-serif", fontSize: '10px', fontWeight: '700', letterSpacing: '0.2em', border: 'none', cursor: 'pointer', display: 'block', width: '100%', textAlign: 'center' },
                  responsive: {},
                },
              ],
              styles: {},
              responsive: {},
            },
            {
              span: { desktop: 3, tablet: 6, mobile: 6 },
              elements: [
                {
                  content: { type: 'image', src: 'https://images.unsplash.com/photo-1539109136881-3be0616acf4b?auto=format&fit=crop&w=450&h=560&q=85', alt: 'Wide-Leg Trousers', objectFit: 'cover' },
                  styles: { width: '100%', height: '320px', display: 'block', backgroundColor: '#1a1816' },
                  responsive: {},
                },
                {
                  content: { type: 'paragraph', text: '✦ NEW' },
                  styles: { fontFamily: "'Inter',sans-serif", fontSize: '9px', fontWeight: '700', color: '#C9A96E', letterSpacing: '0.3em', margin: '12px 0 5px 0' },
                  responsive: {},
                },
                {
                  content: { type: 'heading', level: 'h4', text: 'Wide-Leg Satin Trousers' },
                  styles: { fontFamily: "'Inter',sans-serif", fontSize: '13px', fontWeight: '500', color: '#F5F0E8', margin: '0 0 5px 0', lineHeight: '1.3' },
                  responsive: {},
                },
                {
                  content: { type: 'paragraph', text: '$119' },
                  styles: { fontFamily: "'Inter',sans-serif", fontSize: '14px', fontWeight: '700', color: '#F5F0E8', margin: '0 0 12px 0' },
                  responsive: {},
                },
                {
                  content: { type: 'button', text: 'ADD TO CART', href: '#', variant: 'primary' },
                  styles: { backgroundColor: '#C9A96E', color: '#0A0908', padding: '10px 0', fontFamily: "'Inter',sans-serif", fontSize: '10px', fontWeight: '700', letterSpacing: '0.2em', border: 'none', cursor: 'pointer', display: 'block', width: '100%', textAlign: 'center' },
                  responsive: {},
                },
              ],
              styles: {},
              responsive: {},
            },
          ],
        },
      ],
    },

    // ─── 5. Sale Promo Banner ─────────────────────────────────────────────────
    {
      styles: { backgroundColor: '#C9A96E', padding: '0' },
      rows: [{
        styles: { padding: '36px 60px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' },
        columns: [
          {
            span: { desktop: 8, tablet: 8, mobile: 12 },
            elements: [
              {
                content: { type: 'paragraph', text: 'FLASH SALE' },
                styles: { fontFamily: "'Inter',sans-serif", fontSize: '11px', fontWeight: '700', color: 'rgba(10,9,8,0.6)', letterSpacing: '0.35em', margin: '0 0 6px 0' },
                responsive: {},
              },
              {
                content: { type: 'heading', level: 'h2', text: 'Up to 60% Off — This Weekend Only' },
                styles: { fontFamily: "'Inter',sans-serif", fontSize: '32px', fontWeight: '800', color: '#0A0908', margin: '0', letterSpacing: '-0.02em', lineHeight: '1.15' },
                responsive: {},
              },
            ],
            styles: {},
            responsive: {},
          },
          {
            span: { desktop: 4, tablet: 4, mobile: 12 },
            elements: [{
              content: { type: 'button', text: 'SHOP THE SALE →', href: '#', variant: 'primary' },
              styles: { backgroundColor: '#0A0908', color: '#C9A96E', padding: '16px 36px', fontFamily: "'Inter',sans-serif", fontSize: '12px', fontWeight: '700', letterSpacing: '0.18em', border: 'none', cursor: 'pointer', display: 'inline-block', whiteSpace: 'nowrap' },
              responsive: {},
            }],
            styles: { display: 'flex', alignItems: 'center', justifyContent: 'flex-end' },
            responsive: {},
          },
        ],
      }],
    },

    // ─── 6. Bestsellers ───────────────────────────────────────────────────────
    {
      styles: { backgroundColor: '#0A0908', padding: '48px 32px' },
      rows: [
        {
          styles: { marginBottom: '24px' },
          columns: [
            {
              span: { desktop: 8, tablet: 8, mobile: 8 },
              elements: [{
                content: { type: 'heading', level: 'h2', text: 'Bestsellers' },
                styles: { fontFamily: "'Inter',sans-serif", fontSize: '22px', fontWeight: '700', color: '#F5F0E8', margin: '0', letterSpacing: '-0.01em' },
                responsive: {},
              }],
              styles: {},
              responsive: {},
            },
            {
              span: { desktop: 4, tablet: 4, mobile: 4 },
              elements: [{
                content: { type: 'button', text: 'View All →', href: '#', variant: 'primary' },
                styles: { backgroundColor: 'transparent', color: '#C9A96E', padding: '0', fontFamily: "'Inter',sans-serif", fontSize: '12px', fontWeight: '600', border: 'none', cursor: 'pointer', textAlign: 'right', display: 'block', width: '100%' },
                responsive: {},
              }],
              styles: { display: 'flex', alignItems: 'center', justifyContent: 'flex-end' },
              responsive: {},
            },
          ],
        },
        {
          styles: { gap: '16px' },
          columns: [
            {
              span: { desktop: 3, tablet: 6, mobile: 6 },
              elements: [
                {
                  content: { type: 'image', src: 'https://images.unsplash.com/photo-1552902865-b72c031ac5ea?auto=format&fit=crop&w=450&h=560&q=85', alt: 'Classic Trench Coat', objectFit: 'cover' },
                  styles: { width: '100%', height: '320px', display: 'block', backgroundColor: '#1a1816' },
                  responsive: {},
                },
                {
                  content: { type: 'paragraph', text: '⭐  4.9  (2.4k reviews)' },
                  styles: { fontFamily: "'Inter',sans-serif", fontSize: '10px', color: '#827D76', margin: '12px 0 5px 0', letterSpacing: '0.04em' },
                  responsive: {},
                },
                {
                  content: { type: 'heading', level: 'h4', text: 'Classic Trench Coat' },
                  styles: { fontFamily: "'Inter',sans-serif", fontSize: '13px', fontWeight: '500', color: '#F5F0E8', margin: '0 0 5px 0', lineHeight: '1.3' },
                  responsive: {},
                },
                {
                  content: { type: 'paragraph', text: '$195   ~~$260~~' },
                  styles: { fontFamily: "'Inter',sans-serif", fontSize: '14px', fontWeight: '700', color: '#F5F0E8', margin: '0 0 12px 0' },
                  responsive: {},
                },
                {
                  content: { type: 'button', text: 'ADD TO CART', href: '#', variant: 'primary' },
                  styles: { backgroundColor: '#C9A96E', color: '#0A0908', padding: '10px 0', fontFamily: "'Inter',sans-serif", fontSize: '10px', fontWeight: '700', letterSpacing: '0.2em', border: 'none', cursor: 'pointer', display: 'block', width: '100%', textAlign: 'center' },
                  responsive: {},
                },
              ],
              styles: {},
              responsive: {},
            },
            {
              span: { desktop: 3, tablet: 6, mobile: 6 },
              elements: [
                {
                  content: { type: 'image', src: 'https://images.unsplash.com/photo-1487222477894-8943e31ef7b2?auto=format&fit=crop&w=450&h=560&q=85', alt: 'Slim Fit Cargo Pants', objectFit: 'cover' },
                  styles: { width: '100%', height: '320px', display: 'block', backgroundColor: '#1a1816' },
                  responsive: {},
                },
                {
                  content: { type: 'paragraph', text: '⭐  4.8  (1.8k reviews)' },
                  styles: { fontFamily: "'Inter',sans-serif", fontSize: '10px', color: '#827D76', margin: '12px 0 5px 0', letterSpacing: '0.04em' },
                  responsive: {},
                },
                {
                  content: { type: 'heading', level: 'h4', text: 'Slim Fit Cargo Pants' },
                  styles: { fontFamily: "'Inter',sans-serif", fontSize: '13px', fontWeight: '500', color: '#F5F0E8', margin: '0 0 5px 0', lineHeight: '1.3' },
                  responsive: {},
                },
                {
                  content: { type: 'paragraph', text: '$79   ~~$110~~' },
                  styles: { fontFamily: "'Inter',sans-serif", fontSize: '14px', fontWeight: '700', color: '#F5F0E8', margin: '0 0 12px 0' },
                  responsive: {},
                },
                {
                  content: { type: 'button', text: 'ADD TO CART', href: '#', variant: 'primary' },
                  styles: { backgroundColor: '#C9A96E', color: '#0A0908', padding: '10px 0', fontFamily: "'Inter',sans-serif", fontSize: '10px', fontWeight: '700', letterSpacing: '0.2em', border: 'none', cursor: 'pointer', display: 'block', width: '100%', textAlign: 'center' },
                  responsive: {},
                },
              ],
              styles: {},
              responsive: {},
            },
            {
              span: { desktop: 3, tablet: 6, mobile: 6 },
              elements: [
                {
                  content: { type: 'image', src: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=450&h=560&q=85', alt: 'Satin Slip Skirt', objectFit: 'cover' },
                  styles: { width: '100%', height: '320px', display: 'block', backgroundColor: '#1a1816' },
                  responsive: {},
                },
                {
                  content: { type: 'paragraph', text: '⭐  4.9  (3.1k reviews)' },
                  styles: { fontFamily: "'Inter',sans-serif", fontSize: '10px', color: '#827D76', margin: '12px 0 5px 0', letterSpacing: '0.04em' },
                  responsive: {},
                },
                {
                  content: { type: 'heading', level: 'h4', text: 'Satin Slip Skirt' },
                  styles: { fontFamily: "'Inter',sans-serif", fontSize: '13px', fontWeight: '500', color: '#F5F0E8', margin: '0 0 5px 0', lineHeight: '1.3' },
                  responsive: {},
                },
                {
                  content: { type: 'paragraph', text: '$65' },
                  styles: { fontFamily: "'Inter',sans-serif", fontSize: '14px', fontWeight: '700', color: '#F5F0E8', margin: '0 0 12px 0' },
                  responsive: {},
                },
                {
                  content: { type: 'button', text: 'ADD TO CART', href: '#', variant: 'primary' },
                  styles: { backgroundColor: '#C9A96E', color: '#0A0908', padding: '10px 0', fontFamily: "'Inter',sans-serif", fontSize: '10px', fontWeight: '700', letterSpacing: '0.2em', border: 'none', cursor: 'pointer', display: 'block', width: '100%', textAlign: 'center' },
                  responsive: {},
                },
              ],
              styles: {},
              responsive: {},
            },
            {
              span: { desktop: 3, tablet: 6, mobile: 6 },
              elements: [
                {
                  content: { type: 'image', src: 'https://images.unsplash.com/photo-1469334031218-e382a71b716b?auto=format&fit=crop&w=450&h=560&q=85', alt: 'Knit Cardigan', objectFit: 'cover' },
                  styles: { width: '100%', height: '320px', display: 'block', backgroundColor: '#1a1816' },
                  responsive: {},
                },
                {
                  content: { type: 'paragraph', text: '⭐  4.7  (980 reviews)' },
                  styles: { fontFamily: "'Inter',sans-serif", fontSize: '10px', color: '#827D76', margin: '12px 0 5px 0', letterSpacing: '0.04em' },
                  responsive: {},
                },
                {
                  content: { type: 'heading', level: 'h4', text: 'Oversized Knit Cardigan' },
                  styles: { fontFamily: "'Inter',sans-serif", fontSize: '13px', fontWeight: '500', color: '#F5F0E8', margin: '0 0 5px 0', lineHeight: '1.3' },
                  responsive: {},
                },
                {
                  content: { type: 'paragraph', text: '$95   ~~$130~~' },
                  styles: { fontFamily: "'Inter',sans-serif", fontSize: '14px', fontWeight: '700', color: '#F5F0E8', margin: '0 0 12px 0' },
                  responsive: {},
                },
                {
                  content: { type: 'button', text: 'ADD TO CART', href: '#', variant: 'primary' },
                  styles: { backgroundColor: '#C9A96E', color: '#0A0908', padding: '10px 0', fontFamily: "'Inter',sans-serif", fontSize: '10px', fontWeight: '700', letterSpacing: '0.2em', border: 'none', cursor: 'pointer', display: 'block', width: '100%', textAlign: 'center' },
                  responsive: {},
                },
              ],
              styles: {},
              responsive: {},
            },
          ],
        },
      ],
    },

    // ─── 7. Trust Bar ─────────────────────────────────────────────────────────
    {
      styles: { backgroundColor: '#141210', padding: '32px 32px', borderTop: '1px solid #1E1B17', borderBottom: '1px solid #1E1B17' },
      rows: [{
        styles: { gap: '0' },
        columns: [
          {
            span: { desktop: 3, tablet: 6, mobile: 6 },
            elements: [
              {
                content: { type: 'paragraph', text: '🚚' },
                styles: { fontSize: '28px', margin: '0 0 8px 0', textAlign: 'center' },
                responsive: {},
              },
              {
                content: { type: 'heading', level: 'h4', text: 'Free Shipping' },
                styles: { fontFamily: "'Inter',sans-serif", fontSize: '13px', fontWeight: '700', color: '#F5F0E8', margin: '0 0 4px 0', textAlign: 'center' },
                responsive: {},
              },
              {
                content: { type: 'paragraph', text: 'On all orders over $150' },
                styles: { fontFamily: "'Inter',sans-serif", fontSize: '11px', color: '#827D76', margin: '0', textAlign: 'center' },
                responsive: {},
              },
            ],
            styles: { borderRight: '1px solid #1E1B17', padding: '0 20px' },
            responsive: {},
          },
          {
            span: { desktop: 3, tablet: 6, mobile: 6 },
            elements: [
              {
                content: { type: 'paragraph', text: '🔄' },
                styles: { fontSize: '28px', margin: '0 0 8px 0', textAlign: 'center' },
                responsive: {},
              },
              {
                content: { type: 'heading', level: 'h4', text: 'Free Returns' },
                styles: { fontFamily: "'Inter',sans-serif", fontSize: '13px', fontWeight: '700', color: '#F5F0E8', margin: '0 0 4px 0', textAlign: 'center' },
                responsive: {},
              },
              {
                content: { type: 'paragraph', text: '30-day hassle-free returns' },
                styles: { fontFamily: "'Inter',sans-serif", fontSize: '11px', color: '#827D76', margin: '0', textAlign: 'center' },
                responsive: {},
              },
            ],
            styles: { borderRight: '1px solid #1E1B17', padding: '0 20px' },
            responsive: {},
          },
          {
            span: { desktop: 3, tablet: 6, mobile: 6 },
            elements: [
              {
                content: { type: 'paragraph', text: '🔒' },
                styles: { fontSize: '28px', margin: '0 0 8px 0', textAlign: 'center' },
                responsive: {},
              },
              {
                content: { type: 'heading', level: 'h4', text: 'Secure Checkout' },
                styles: { fontFamily: "'Inter',sans-serif", fontSize: '13px', fontWeight: '700', color: '#F5F0E8', margin: '0 0 4px 0', textAlign: 'center' },
                responsive: {},
              },
              {
                content: { type: 'paragraph', text: 'SSL encrypted payments' },
                styles: { fontFamily: "'Inter',sans-serif", fontSize: '11px', color: '#827D76', margin: '0', textAlign: 'center' },
                responsive: {},
              },
            ],
            styles: { borderRight: '1px solid #1E1B17', padding: '0 20px' },
            responsive: {},
          },
          {
            span: { desktop: 3, tablet: 6, mobile: 6 },
            elements: [
              {
                content: { type: 'paragraph', text: '⭐' },
                styles: { fontSize: '28px', margin: '0 0 8px 0', textAlign: 'center' },
                responsive: {},
              },
              {
                content: { type: 'heading', level: 'h4', text: '50,000+ Reviews' },
                styles: { fontFamily: "'Inter',sans-serif", fontSize: '13px', fontWeight: '700', color: '#F5F0E8', margin: '0 0 4px 0', textAlign: 'center' },
                responsive: {},
              },
              {
                content: { type: 'paragraph', text: 'Rated 4.8/5 by customers' },
                styles: { fontFamily: "'Inter',sans-serif", fontSize: '11px', color: '#827D76', margin: '0', textAlign: 'center' },
                responsive: {},
              },
            ],
            styles: { padding: '0 20px' },
            responsive: {},
          },
        ],
      }],
    },

    // ─── 8. Newsletter ─────────────────────────────────────────────────────────
    {
      styles: { backgroundColor: '#0D0C0B', padding: '60px 32px', textAlign: 'center' },
      rows: [{
        styles: {},
        columns: [{
          span: { desktop: 6, tablet: 8, mobile: 12 },
          elements: [
            {
              content: { type: 'paragraph', text: 'GET 15% OFF YOUR FIRST ORDER' },
              styles: { fontFamily: "'Inter',sans-serif", fontSize: '10px', fontWeight: '700', color: '#C9A96E', letterSpacing: '0.4em', margin: '0 0 12px 0', textAlign: 'center' },
              responsive: {},
            },
            {
              content: { type: 'heading', level: 'h2', text: 'Join the NOIR Insider List' },
              styles: { fontFamily: "'Inter',sans-serif", fontSize: '28px', fontWeight: '800', color: '#F5F0E8', margin: '0 0 10px 0', textAlign: 'center', letterSpacing: '-0.02em' },
              responsive: {},
            },
            {
              content: { type: 'paragraph', text: 'Early access to new drops, exclusive member sales, and style updates straight to your inbox.' },
              styles: { fontFamily: "'Inter',sans-serif", fontSize: '13px', color: '#827D76', margin: '0 0 28px 0', textAlign: 'center', lineHeight: '1.7' },
              responsive: {},
            },
            {
              content: { type: 'form', fields: [{ id: 'email', type: 'email', label: 'Email address', placeholder: 'Enter your email address', required: true }], submitLabel: 'GET 15% OFF', formStyle: 'minimal' },
              styles: { fontFamily: "'Inter',sans-serif" },
              responsive: {},
            },
            {
              content: { type: 'paragraph', text: 'No spam, ever. Unsubscribe anytime.' },
              styles: { fontFamily: "'Inter',sans-serif", fontSize: '10px', color: '#46423D', margin: '14px 0 0 0', textAlign: 'center' },
              responsive: {},
            },
          ],
          styles: { margin: '0 auto' },
          responsive: {},
        }],
      }],
    },

    // ─── 9. Footer ─────────────────────────────────────────────────────────────
    {
      styles: { backgroundColor: '#080807', padding: '56px 32px 28px', borderTop: '1px solid #1E1B17' },
      rows: [
        {
          styles: { marginBottom: '40px', paddingBottom: '40px', borderBottom: '1px solid #1E1B17' },
          columns: [
            {
              span: { desktop: 3, tablet: 6, mobile: 12 },
              elements: [
                {
                  content: { type: 'heading', level: 'h3', text: 'NOIR.' },
                  styles: { fontFamily: "'Inter',sans-serif", fontSize: '20px', fontWeight: '800', color: '#F5F0E8', letterSpacing: '0.1em', margin: '0 0 12px 0' },
                  responsive: {},
                },
                {
                  content: { type: 'paragraph', text: 'Fashion-forward styles for the bold. Dark, distinctive, unapologetic.' },
                  styles: { fontFamily: "'Inter',sans-serif", fontSize: '12px', color: '#46423D', lineHeight: '1.7', margin: '0 0 16px 0' },
                  responsive: {},
                },
                {
                  content: { type: 'paragraph', text: 'Instagram  ·  TikTok  ·  Pinterest' },
                  styles: { fontFamily: "'Inter',sans-serif", fontSize: '11px', color: '#C9A96E', margin: '0', letterSpacing: '0.08em' },
                  responsive: {},
                },
              ],
              styles: {},
              responsive: {},
            },
            {
              span: { desktop: 3, tablet: 6, mobile: 12 },
              elements: [
                {
                  content: { type: 'heading', level: 'h4', text: 'SHOP' },
                  styles: { fontFamily: "'Inter',sans-serif", fontSize: '10px', fontWeight: '700', color: '#F5F0E8', letterSpacing: '0.3em', margin: '0 0 16px 0' },
                  responsive: {},
                },
                {
                  content: { type: 'paragraph', text: 'New In\nWomen\nMen\nAccessories\nSale' },
                  styles: { fontFamily: "'Inter',sans-serif", fontSize: '12px', color: '#46423D', lineHeight: '2.2', margin: '0', whiteSpace: 'pre-line' },
                  responsive: {},
                },
              ],
              styles: {},
              responsive: {},
            },
            {
              span: { desktop: 3, tablet: 6, mobile: 12 },
              elements: [
                {
                  content: { type: 'heading', level: 'h4', text: 'HELP' },
                  styles: { fontFamily: "'Inter',sans-serif", fontSize: '10px', fontWeight: '700', color: '#F5F0E8', letterSpacing: '0.3em', margin: '0 0 16px 0' },
                  responsive: {},
                },
                {
                  content: { type: 'paragraph', text: 'Shipping & Returns\nSize Guide\nTrack My Order\nContact Us\nFAQ' },
                  styles: { fontFamily: "'Inter',sans-serif", fontSize: '12px', color: '#46423D', lineHeight: '2.2', margin: '0', whiteSpace: 'pre-line' },
                  responsive: {},
                },
              ],
              styles: {},
              responsive: {},
            },
            {
              span: { desktop: 3, tablet: 6, mobile: 12 },
              elements: [
                {
                  content: { type: 'heading', level: 'h4', text: 'ABOUT' },
                  styles: { fontFamily: "'Inter',sans-serif", fontSize: '10px', fontWeight: '700', color: '#F5F0E8', letterSpacing: '0.3em', margin: '0 0 16px 0' },
                  responsive: {},
                },
                {
                  content: { type: 'paragraph', text: 'Our Story\nSustainability\nCareers\nPress\nAffiliates' },
                  styles: { fontFamily: "'Inter',sans-serif", fontSize: '12px', color: '#46423D', lineHeight: '2.2', margin: '0', whiteSpace: 'pre-line' },
                  responsive: {},
                },
              ],
              styles: {},
              responsive: {},
            },
          ],
        },
        {
          styles: { display: 'flex', justifyContent: 'space-between', alignItems: 'center' },
          columns: [
            {
              span: { desktop: 6, tablet: 6, mobile: 12 },
              elements: [{
                content: { type: 'paragraph', text: '© 2025 NOIR Fashion. All rights reserved.' },
                styles: { fontFamily: "'Inter',sans-serif", fontSize: '11px', color: '#2E2B27', margin: '0' },
                responsive: {},
              }],
              styles: {},
              responsive: {},
            },
            {
              span: { desktop: 6, tablet: 6, mobile: 12 },
              elements: [{
                content: { type: 'paragraph', text: 'Privacy Policy  ·  Terms of Service  ·  Cookie Settings' },
                styles: { fontFamily: "'Inter',sans-serif", fontSize: '11px', color: '#2E2B27', margin: '0', textAlign: 'right' },
                responsive: {},
              }],
              styles: {},
              responsive: {},
            },
          ],
        },
      ],
    },

  ],
}
