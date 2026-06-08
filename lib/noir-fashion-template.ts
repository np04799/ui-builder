/**
 * NOIR Fashion E-Commerce — PPC landing page template
 * Kept in a separate file so it's always freshly bundled,
 * independent of the large lib/templates.ts build cache.
 *
 * Redesigned v2 — editorial luxury aesthetic (Net-a-Porter / Jacquemus / Ssense)
 */
import type { Template } from './templates'

export const NOIR_FASHION_TEMPLATE: Template = {
  id: 'ppc-noir-fashion',
  label: 'NOIR — Fashion E-Commerce',
  category: 'ppc',
  desc: 'Dark luxury fashion e-commerce homepage. 8 sections: nav, hero, collections, featured product, trending, editorial quote, newsletter, footer.',
  sections: [

    // ─── 1. Announcement Bar + Navbar ─────────────────────────────────────────
    {
      styles: { backgroundColor: '#0A0908' },
      rows: [
        // Announcement bar
        {
          styles: { backgroundColor: '#C9A96E', padding: '10px 40px', textAlign: 'center' },
          columns: [{
            span: { desktop: 12, tablet: 12, mobile: 12 },
            elements: [{
              content: { type: 'paragraph', text: 'FREE SHIPPING ON ORDERS OVER $250  ·  FREE RETURNS  ·  SUSTAINABLY MADE' },
              styles: { fontFamily: "'Inter',sans-serif", fontSize: '11px', fontWeight: '600', color: '#0A0908', letterSpacing: '0.18em', margin: '0', textAlign: 'center' },
              responsive: {},
            }],
            styles: {},
            responsive: {},
          }],
        },
        // Navbar
        {
          styles: { padding: '0 40px', borderBottom: '1px solid #1E1B17' },
          columns: [
            {
              span: { desktop: 3, tablet: 3, mobile: 6 },
              elements: [{
                content: { type: 'paragraph', text: 'COLLECTIONS  ·  NEW  ·  SALE' },
                styles: { fontFamily: "'Inter',sans-serif", fontSize: '10px', fontWeight: '500', color: '#827D76', letterSpacing: '0.22em', margin: '0', lineHeight: '64px' },
                responsive: {},
              }],
              styles: { display: 'flex', alignItems: 'center' },
              responsive: {},
            },
            {
              span: { desktop: 6, tablet: 6, mobile: 12 },
              elements: [{
                content: { type: 'heading', level: 'h1', text: 'NOIR' },
                styles: { fontFamily: "'Cormorant Garamond','Georgia',serif", fontSize: '28px', fontWeight: '700', color: '#F5F0E8', letterSpacing: '0.55em', margin: '0', textAlign: 'center', lineHeight: '64px' },
                responsive: {},
              }],
              styles: { textAlign: 'center' },
              responsive: {},
            },
            {
              span: { desktop: 3, tablet: 3, mobile: 6 },
              elements: [{
                content: { type: 'paragraph', text: 'ACCOUNT  ·  BAG (0)' },
                styles: { fontFamily: "'Inter',sans-serif", fontSize: '10px', fontWeight: '500', color: '#827D76', letterSpacing: '0.22em', margin: '0', lineHeight: '64px', textAlign: 'right' },
                responsive: {},
              }],
              styles: { display: 'flex', alignItems: 'center', justifyContent: 'flex-end' },
              responsive: {},
            },
          ],
        },
      ],
    },

    // ─── 2. Hero — full-bleed image + editorial overlay ────────────────────────
    {
      styles: {
        backgroundImage: "url('https://images.unsplash.com/photo-1558618666-fcd25c85cd64?auto=format&fit=crop&w=1600&h=900&q=85')",
        backgroundSize: 'cover',
        backgroundPosition: 'center center',
        minHeight: '90vh',
        position: 'relative',
        display: 'flex',
        alignItems: 'flex-end',
      },
      rows: [{
        styles: {
          background: 'linear-gradient(to top, rgba(10,9,8,0.92) 0%, rgba(10,9,8,0.3) 55%, transparent 100%)',
          padding: '80px 80px 90px',
          width: '100%',
        },
        columns: [
          {
            span: { desktop: 7, tablet: 10, mobile: 12 },
            elements: [
              {
                content: { type: 'paragraph', text: 'NEW COLLECTION — AW 2025' },
                styles: { fontFamily: "'Inter',sans-serif", fontSize: '10px', fontWeight: '600', color: '#C9A96E', letterSpacing: '0.45em', margin: '0 0 20px 0' },
                responsive: {},
              },
              {
                content: { type: 'heading', level: 'h2', text: 'Redefine Your Silhouette' },
                styles: { fontFamily: "'Cormorant Garamond','Georgia',serif", fontSize: '72px', fontWeight: '600', color: '#F5F0E8', lineHeight: '1.0', margin: '0 0 24px 0', letterSpacing: '-0.01em' },
                responsive: {},
              },
              {
                content: { type: 'paragraph', text: 'Precision tailoring. Rare materials. Uncompromising craft.' },
                styles: { fontFamily: "'Inter',sans-serif", fontSize: '15px', fontWeight: '300', color: 'rgba(245,240,232,0.75)', letterSpacing: '0.04em', margin: '0 0 36px 0' },
                responsive: {},
              },
              {
                content: { type: 'button', text: 'SHOP THE COLLECTION', href: '#', variant: 'primary' },
                styles: { backgroundColor: '#C9A96E', color: '#0A0908', padding: '18px 52px', fontFamily: "'Inter',sans-serif", fontSize: '10px', fontWeight: '700', letterSpacing: '0.3em', border: 'none', cursor: 'pointer', display: 'inline-block', textDecoration: 'none' },
                responsive: {},
              },
            ],
            styles: {},
            responsive: {},
          },
        ],
      }],
    },

    // ─── 3. Collections — 3-col editorial cards ────────────────────────────────
    {
      styles: { backgroundColor: '#0A0908', padding: '80px 40px' },
      rows: [
        {
          styles: { marginBottom: '40px' },
          columns: [{
            span: { desktop: 12, tablet: 12, mobile: 12 },
            elements: [
              {
                content: { type: 'paragraph', text: 'SHOP BY CATEGORY' },
                styles: { fontFamily: "'Inter',sans-serif", fontSize: '10px', fontWeight: '600', color: '#C9A96E', letterSpacing: '0.45em', margin: '0 0 10px 0', textAlign: 'center' },
                responsive: {},
              },
              {
                content: { type: 'heading', level: 'h2', text: 'The Collections' },
                styles: { fontFamily: "'Cormorant Garamond','Georgia',serif", fontSize: '48px', fontWeight: '500', color: '#F5F0E8', textAlign: 'center', margin: '0', letterSpacing: '0.02em' },
                responsive: {},
              },
            ],
            styles: {},
            responsive: {},
          }],
        },
        {
          styles: { gap: '2px' },
          columns: [
            {
              span: { desktop: 4, tablet: 4, mobile: 12 },
              elements: [
                {
                  content: { type: 'image', src: 'https://images.unsplash.com/photo-1509631179647-0177331693ae?auto=format&fit=crop&w=700&h=900&q=85', alt: 'New Arrivals', objectFit: 'cover' },
                  styles: { width: '100%', height: '520px', display: 'block' },
                  responsive: {},
                },
                {
                  content: { type: 'heading', level: 'h3', text: 'New Arrivals' },
                  styles: { fontFamily: "'Cormorant Garamond','Georgia',serif", fontSize: '26px', fontWeight: '500', color: '#F5F0E8', margin: '20px 0 6px 0', letterSpacing: '0.04em' },
                  responsive: {},
                },
                {
                  content: { type: 'paragraph', text: '140 new pieces this season' },
                  styles: { fontFamily: "'Inter',sans-serif", fontSize: '12px', color: '#827D76', margin: '0 0 16px 0', letterSpacing: '0.06em' },
                  responsive: {},
                },
                {
                  content: { type: 'button', text: 'SHOP NOW →', href: '#', variant: 'primary' },
                  styles: { backgroundColor: 'transparent', color: '#C9A96E', padding: '0', fontFamily: "'Inter',sans-serif", fontSize: '10px', fontWeight: '600', letterSpacing: '0.28em', border: 'none', cursor: 'pointer' },
                  responsive: {},
                },
              ],
              styles: { backgroundColor: '#100F0D', padding: '0 0 28px 0' },
              responsive: {},
            },
            {
              span: { desktop: 4, tablet: 4, mobile: 12 },
              elements: [
                {
                  content: { type: 'image', src: 'https://images.unsplash.com/photo-1487222477894-8943e31ef7b2?auto=format&fit=crop&w=700&h=900&q=85', alt: 'Bestsellers', objectFit: 'cover' },
                  styles: { width: '100%', height: '520px', display: 'block' },
                  responsive: {},
                },
                {
                  content: { type: 'heading', level: 'h3', text: 'Bestsellers' },
                  styles: { fontFamily: "'Cormorant Garamond','Georgia',serif", fontSize: '26px', fontWeight: '500', color: '#F5F0E8', margin: '20px 0 6px 0', letterSpacing: '0.04em' },
                  responsive: {},
                },
                {
                  content: { type: 'paragraph', text: 'Our most-loved pieces, restocked' },
                  styles: { fontFamily: "'Inter',sans-serif", fontSize: '12px', color: '#827D76', margin: '0 0 16px 0', letterSpacing: '0.06em' },
                  responsive: {},
                },
                {
                  content: { type: 'button', text: 'SHOP NOW →', href: '#', variant: 'primary' },
                  styles: { backgroundColor: 'transparent', color: '#C9A96E', padding: '0', fontFamily: "'Inter',sans-serif", fontSize: '10px', fontWeight: '600', letterSpacing: '0.28em', border: 'none', cursor: 'pointer' },
                  responsive: {},
                },
              ],
              styles: { backgroundColor: '#100F0D', padding: '0 0 28px 0' },
              responsive: {},
            },
            {
              span: { desktop: 4, tablet: 4, mobile: 12 },
              elements: [
                {
                  content: { type: 'image', src: 'https://images.unsplash.com/photo-1539109136881-3be0616acf4b?auto=format&fit=crop&w=700&h=900&q=85', alt: 'The Edit', objectFit: 'cover' },
                  styles: { width: '100%', height: '520px', display: 'block' },
                  responsive: {},
                },
                {
                  content: { type: 'heading', level: 'h3', text: 'The Edit' },
                  styles: { fontFamily: "'Cormorant Garamond','Georgia',serif", fontSize: '26px', fontWeight: '500', color: '#F5F0E8', margin: '20px 0 6px 0', letterSpacing: '0.04em' },
                  responsive: {},
                },
                {
                  content: { type: 'paragraph', text: 'Curated styles, up to 50% off' },
                  styles: { fontFamily: "'Inter',sans-serif", fontSize: '12px', color: '#C9A96E', margin: '0 0 16px 0', letterSpacing: '0.06em' },
                  responsive: {},
                },
                {
                  content: { type: 'button', text: 'SHOP NOW →', href: '#', variant: 'primary' },
                  styles: { backgroundColor: 'transparent', color: '#C9A96E', padding: '0', fontFamily: "'Inter',sans-serif", fontSize: '10px', fontWeight: '600', letterSpacing: '0.28em', border: 'none', cursor: 'pointer' },
                  responsive: {},
                },
              ],
              styles: { backgroundColor: '#100F0D', padding: '0 0 28px 0' },
              responsive: {},
            },
          ],
        },
      ],
    },

    // ─── 4. Featured Product — editorial split ──────────────────────────────────
    {
      styles: { backgroundColor: '#100F0D', overflow: 'hidden' },
      rows: [{
        styles: { alignItems: 'stretch', minHeight: '680px', gap: '0' },
        columns: [
          {
            span: { desktop: 6, tablet: 6, mobile: 12 },
            elements: [{
              content: { type: 'image', src: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=800&h=1000&q=85', alt: 'Featured look', objectFit: 'cover' },
              styles: { width: '100%', height: '100%', minHeight: '680px', display: 'block' },
              responsive: {},
            }],
            styles: { padding: '0', overflow: 'hidden' },
            responsive: {},
          },
          {
            span: { desktop: 6, tablet: 6, mobile: 12 },
            elements: [
              {
                content: { type: 'paragraph', text: 'THE STATEMENT PIECE' },
                styles: { fontFamily: "'Inter',sans-serif", fontSize: '9px', fontWeight: '600', color: '#C9A96E', letterSpacing: '0.5em', margin: '0 0 24px 0' },
                responsive: {},
              },
              {
                content: { type: 'heading', level: 'h2', text: 'The Obsidian Overcoat' },
                styles: { fontFamily: "'Cormorant Garamond','Georgia',serif", fontSize: '52px', fontWeight: '600', color: '#F5F0E8', lineHeight: '1.05', margin: '0 0 16px 0', letterSpacing: '-0.01em' },
                responsive: {},
              },
              {
                content: { type: 'paragraph', text: 'Double-faced cashmere. Structured silhouette, precision-cut lapels. A coat that outlives every trend.' },
                styles: { fontFamily: "'Inter',sans-serif", fontSize: '14px', fontWeight: '300', color: '#827D76', lineHeight: '1.85', margin: '0 0 32px 0' },
                responsive: {},
              },
              {
                content: { type: 'paragraph', text: '$1,890' },
                styles: { fontFamily: "'Cormorant Garamond','Georgia',serif", fontSize: '40px', fontWeight: '400', color: '#F5F0E8', margin: '0 0 32px 0' },
                responsive: {},
              },
              {
                content: { type: 'button', text: 'ADD TO BAG', href: '#', variant: 'primary' },
                styles: { backgroundColor: '#C9A96E', color: '#0A0908', padding: '20px 56px', fontFamily: "'Inter',sans-serif", fontSize: '10px', fontWeight: '700', letterSpacing: '0.3em', border: 'none', cursor: 'pointer', display: 'inline-block', textDecoration: 'none' },
                responsive: {},
              },
              {
                content: { type: 'paragraph', text: 'Free shipping & returns  ·  Size guide  ·  Complimentary gift wrapping' },
                styles: { fontFamily: "'Inter',sans-serif", fontSize: '11px', color: '#46423D', letterSpacing: '0.06em', margin: '28px 0 0 0' },
                responsive: {},
              },
            ],
            styles: { padding: '80px 60px', display: 'flex', flexDirection: 'column', justifyContent: 'center', backgroundColor: '#0A0908' },
            responsive: {},
          },
        ],
      }],
    },

    // ─── 5. Trending Products — 4-col grid ────────────────────────────────────
    {
      styles: { backgroundColor: '#0A0908', padding: '80px 40px' },
      rows: [
        {
          styles: { marginBottom: '40px' },
          columns: [{
            span: { desktop: 12, tablet: 12, mobile: 12 },
            elements: [
              {
                content: { type: 'paragraph', text: 'TRENDING NOW' },
                styles: { fontFamily: "'Inter',sans-serif", fontSize: '10px', fontWeight: '600', color: '#C9A96E', letterSpacing: '0.45em', margin: '0 0 10px 0', textAlign: 'center' },
                responsive: {},
              },
              {
                content: { type: 'heading', level: 'h2', text: 'Most Wanted' },
                styles: { fontFamily: "'Cormorant Garamond','Georgia',serif", fontSize: '48px', fontWeight: '500', color: '#F5F0E8', textAlign: 'center', margin: '0', letterSpacing: '0.02em' },
                responsive: {},
              },
            ],
            styles: {},
            responsive: {},
          }],
        },
        {
          styles: { gap: '20px' },
          columns: [
            {
              span: { desktop: 3, tablet: 6, mobile: 6 },
              elements: [
                {
                  content: { type: 'image', src: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=500&h=680&q=85', alt: 'Silk Slip Dress', objectFit: 'cover' },
                  styles: { width: '100%', height: '380px', display: 'block', backgroundColor: '#161412' },
                  responsive: {},
                },
                {
                  content: { type: 'paragraph', text: 'NEW' },
                  styles: { fontFamily: "'Inter',sans-serif", fontSize: '9px', fontWeight: '700', color: '#C9A96E', letterSpacing: '0.35em', margin: '14px 0 4px 0' },
                  responsive: {},
                },
                {
                  content: { type: 'heading', level: 'h4', text: 'Silk Slip Dress' },
                  styles: { fontFamily: "'Cormorant Garamond','Georgia',serif", fontSize: '20px', fontWeight: '400', color: '#F5F0E8', margin: '0 0 4px 0' },
                  responsive: {},
                },
                {
                  content: { type: 'paragraph', text: '$420' },
                  styles: { fontFamily: "'Inter',sans-serif", fontSize: '13px', color: '#827D76', margin: '0 0 12px 0' },
                  responsive: {},
                },
                {
                  content: { type: 'button', text: '+ QUICK ADD', href: '#', variant: 'primary' },
                  styles: { backgroundColor: 'transparent', color: '#46423D', padding: '0', fontFamily: "'Inter',sans-serif", fontSize: '9px', fontWeight: '600', letterSpacing: '0.2em', border: 'none', cursor: 'pointer' },
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
                  content: { type: 'image', src: 'https://images.unsplash.com/photo-1581044777550-4cfa60707c03?auto=format&fit=crop&w=500&h=680&q=85', alt: 'Tailored Blazer', objectFit: 'cover' },
                  styles: { width: '100%', height: '380px', display: 'block', backgroundColor: '#161412' },
                  responsive: {},
                },
                {
                  content: { type: 'paragraph', text: 'BESTSELLER' },
                  styles: { fontFamily: "'Inter',sans-serif", fontSize: '9px', fontWeight: '700', color: '#C9A96E', letterSpacing: '0.35em', margin: '14px 0 4px 0' },
                  responsive: {},
                },
                {
                  content: { type: 'heading', level: 'h4', text: 'Tailored Blazer' },
                  styles: { fontFamily: "'Cormorant Garamond','Georgia',serif", fontSize: '20px', fontWeight: '400', color: '#F5F0E8', margin: '0 0 4px 0' },
                  responsive: {},
                },
                {
                  content: { type: 'paragraph', text: '$890' },
                  styles: { fontFamily: "'Inter',sans-serif", fontSize: '13px', color: '#827D76', margin: '0 0 12px 0' },
                  responsive: {},
                },
                {
                  content: { type: 'button', text: '+ QUICK ADD', href: '#', variant: 'primary' },
                  styles: { backgroundColor: 'transparent', color: '#46423D', padding: '0', fontFamily: "'Inter',sans-serif", fontSize: '9px', fontWeight: '600', letterSpacing: '0.2em', border: 'none', cursor: 'pointer' },
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
                  content: { type: 'image', src: 'https://images.unsplash.com/photo-1529139003474-b28b2af36c2c?auto=format&fit=crop&w=500&h=680&q=85', alt: 'Leather Trousers', objectFit: 'cover' },
                  styles: { width: '100%', height: '380px', display: 'block', backgroundColor: '#161412' },
                  responsive: {},
                },
                {
                  content: { type: 'paragraph', text: 'NEW' },
                  styles: { fontFamily: "'Inter',sans-serif", fontSize: '9px', fontWeight: '700', color: '#C9A96E', letterSpacing: '0.35em', margin: '14px 0 4px 0' },
                  responsive: {},
                },
                {
                  content: { type: 'heading', level: 'h4', text: 'Leather Trousers' },
                  styles: { fontFamily: "'Cormorant Garamond','Georgia',serif", fontSize: '20px', fontWeight: '400', color: '#F5F0E8', margin: '0 0 4px 0' },
                  responsive: {},
                },
                {
                  content: { type: 'paragraph', text: '$640' },
                  styles: { fontFamily: "'Inter',sans-serif", fontSize: '13px', color: '#827D76', margin: '0 0 12px 0' },
                  responsive: {},
                },
                {
                  content: { type: 'button', text: '+ QUICK ADD', href: '#', variant: 'primary' },
                  styles: { backgroundColor: 'transparent', color: '#46423D', padding: '0', fontFamily: "'Inter',sans-serif", fontSize: '9px', fontWeight: '600', letterSpacing: '0.2em', border: 'none', cursor: 'pointer' },
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
                  content: { type: 'image', src: 'https://images.unsplash.com/photo-1552902865-b72c031ac5ea?auto=format&fit=crop&w=500&h=680&q=85', alt: 'Cashmere Turtleneck', objectFit: 'cover' },
                  styles: { width: '100%', height: '380px', display: 'block', backgroundColor: '#161412' },
                  responsive: {},
                },
                {
                  content: { type: 'paragraph', text: 'SOLD OUT — WAITLIST' },
                  styles: { fontFamily: "'Inter',sans-serif", fontSize: '9px', fontWeight: '700', color: '#827D76', letterSpacing: '0.35em', margin: '14px 0 4px 0' },
                  responsive: {},
                },
                {
                  content: { type: 'heading', level: 'h4', text: 'Cashmere Turtleneck' },
                  styles: { fontFamily: "'Cormorant Garamond','Georgia',serif", fontSize: '20px', fontWeight: '400', color: '#F5F0E8', margin: '0 0 4px 0' },
                  responsive: {},
                },
                {
                  content: { type: 'paragraph', text: '$310' },
                  styles: { fontFamily: "'Inter',sans-serif", fontSize: '13px', color: '#827D76', margin: '0 0 12px 0' },
                  responsive: {},
                },
                {
                  content: { type: 'button', text: 'JOIN WAITLIST →', href: '#', variant: 'primary' },
                  styles: { backgroundColor: 'transparent', color: '#46423D', padding: '0', fontFamily: "'Inter',sans-serif", fontSize: '9px', fontWeight: '600', letterSpacing: '0.2em', border: 'none', cursor: 'pointer' },
                  responsive: {},
                },
              ],
              styles: {},
              responsive: {},
            },
          ],
        },
        {
          styles: { marginTop: '40px', textAlign: 'center' },
          columns: [{
            span: { desktop: 12, tablet: 12, mobile: 12 },
            elements: [{
              content: { type: 'button', text: 'VIEW ALL PRODUCTS', href: '#', variant: 'primary' },
              styles: { backgroundColor: 'transparent', color: '#F5F0E8', padding: '16px 48px', fontFamily: "'Inter',sans-serif", fontSize: '10px', fontWeight: '600', letterSpacing: '0.3em', border: '1px solid #26231F', cursor: 'pointer', display: 'inline-block' },
              responsive: {},
            }],
            styles: { textAlign: 'center' },
            responsive: {},
          }],
        },
      ],
    },

    // ─── 6. Editorial Quote + Press ───────────────────────────────────────────
    {
      styles: {
        backgroundImage: "url('https://images.unsplash.com/photo-1469334031218-e382a71b716b?auto=format&fit=crop&w=1600&h=700&q=80')",
        backgroundSize: 'cover',
        backgroundPosition: 'center 30%',
        padding: '120px 80px',
        position: 'relative',
      },
      rows: [{
        styles: { background: 'rgba(10,9,8,0.78)', padding: '80px', margin: '-120px -80px', position: 'relative' },
        columns: [
          {
            span: { desktop: 8, tablet: 10, mobile: 12 },
            elements: [
              {
                content: { type: 'heading', level: 'h2', text: '"The most important wardrobe investment you\'ll make this decade."' },
                styles: { fontFamily: "'Cormorant Garamond','Georgia',serif", fontSize: '44px', fontWeight: '400', color: '#F5F0E8', lineHeight: '1.3', margin: '0 0 28px 0', fontStyle: 'italic' },
                responsive: {},
              },
              {
                content: { type: 'paragraph', text: '— VOGUE, October 2025' },
                styles: { fontFamily: "'Inter',sans-serif", fontSize: '11px', fontWeight: '500', color: '#C9A96E', letterSpacing: '0.3em', margin: '0 0 48px 0' },
                responsive: {},
              },
              {
                content: { type: 'paragraph', text: 'AS SEEN IN  ·  VOGUE  ·  HARPER\'S BAZAAR  ·  THE BUSINESS OF FASHION  ·  SSENSE' },
                styles: { fontFamily: "'Inter',sans-serif", fontSize: '9px', fontWeight: '600', color: '#46423D', letterSpacing: '0.35em', margin: '0' },
                responsive: {},
              },
            ],
            styles: {},
            responsive: {},
          },
        ],
      }],
    },

    // ─── 7. Newsletter ─────────────────────────────────────────────────────────
    {
      styles: { backgroundColor: '#C9A96E', padding: '80px 40px', textAlign: 'center' },
      rows: [{
        styles: {},
        columns: [{
          span: { desktop: 6, tablet: 8, mobile: 12 },
          elements: [
            {
              content: { type: 'paragraph', text: 'THE INSIDER' },
              styles: { fontFamily: "'Inter',sans-serif", fontSize: '9px', fontWeight: '700', color: '#0A0908', letterSpacing: '0.55em', margin: '0 0 12px 0', textAlign: 'center' },
              responsive: {},
            },
            {
              content: { type: 'heading', level: 'h2', text: 'Be First to Know' },
              styles: { fontFamily: "'Cormorant Garamond','Georgia',serif", fontSize: '44px', fontWeight: '500', color: '#0A0908', margin: '0 0 10px 0', textAlign: 'center' },
              responsive: {},
            },
            {
              content: { type: 'paragraph', text: 'New arrivals, exclusive access and private sale events — delivered to your inbox.' },
              styles: { fontFamily: "'Inter',sans-serif", fontSize: '14px', fontWeight: '300', color: 'rgba(10,9,8,0.7)', margin: '0 0 32px 0', textAlign: 'center', lineHeight: '1.75' },
              responsive: {},
            },
            {
              content: { type: 'form', fields: [{ id: 'email', type: 'email', label: 'Email address', placeholder: 'Your email address', required: true }], submitLabel: 'JOIN', formStyle: 'minimal' },
              styles: { fontFamily: "'Inter',sans-serif" },
              responsive: {},
            },
            {
              content: { type: 'paragraph', text: 'By joining, you agree to our Privacy Policy. Unsubscribe at any time.' },
              styles: { fontFamily: "'Inter',sans-serif", fontSize: '10px', color: 'rgba(10,9,8,0.45)', margin: '16px 0 0 0', textAlign: 'center', letterSpacing: '0.04em' },
              responsive: {},
            },
          ],
          styles: { margin: '0 auto' },
          responsive: {},
        }],
      }],
    },

    // ─── 8. Footer ─────────────────────────────────────────────────────────────
    {
      styles: { backgroundColor: '#0A0908', padding: '64px 40px 32px', borderTop: '1px solid #1E1B17' },
      rows: [
        {
          styles: { marginBottom: '48px', paddingBottom: '48px', borderBottom: '1px solid #1E1B17' },
          columns: [
            {
              span: { desktop: 3, tablet: 6, mobile: 12 },
              elements: [
                {
                  content: { type: 'heading', level: 'h3', text: 'NOIR' },
                  styles: { fontFamily: "'Cormorant Garamond','Georgia',serif", fontSize: '24px', fontWeight: '700', color: '#F5F0E8', letterSpacing: '0.55em', margin: '0 0 12px 0' },
                  responsive: {},
                },
                {
                  content: { type: 'paragraph', text: 'Luxury fashion for those who refuse to follow.' },
                  styles: { fontFamily: "'Inter',sans-serif", fontSize: '12px', color: '#46423D', lineHeight: '1.75', margin: '0', letterSpacing: '0.04em' },
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
                  styles: { fontFamily: "'Inter',sans-serif", fontSize: '9px', fontWeight: '700', color: '#F5F0E8', letterSpacing: '0.4em', margin: '0 0 20px 0' },
                  responsive: {},
                },
                {
                  content: { type: 'paragraph', text: 'New Arrivals\nBestsellers\nThe Edit\nCollections\nSale' },
                  styles: { fontFamily: "'Inter',sans-serif", fontSize: '12px', color: '#46423D', lineHeight: '2.2', margin: '0', letterSpacing: '0.06em', whiteSpace: 'pre-line' },
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
                  styles: { fontFamily: "'Inter',sans-serif", fontSize: '9px', fontWeight: '700', color: '#F5F0E8', letterSpacing: '0.4em', margin: '0 0 20px 0' },
                  responsive: {},
                },
                {
                  content: { type: 'paragraph', text: 'Shipping & Returns\nSize Guide\nContact Us\nFAQ\nSustainability' },
                  styles: { fontFamily: "'Inter',sans-serif", fontSize: '12px', color: '#46423D', lineHeight: '2.2', margin: '0', letterSpacing: '0.06em', whiteSpace: 'pre-line' },
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
                  content: { type: 'heading', level: 'h4', text: 'FOLLOW' },
                  styles: { fontFamily: "'Inter',sans-serif", fontSize: '9px', fontWeight: '700', color: '#F5F0E8', letterSpacing: '0.4em', margin: '0 0 20px 0' },
                  responsive: {},
                },
                {
                  content: { type: 'paragraph', text: 'Instagram\nTikTok\nPinterest\n@shopnoir' },
                  styles: { fontFamily: "'Inter',sans-serif", fontSize: '12px', color: '#46423D', lineHeight: '2.2', margin: '0', letterSpacing: '0.06em', whiteSpace: 'pre-line' },
                  responsive: {},
                },
              ],
              styles: {},
              responsive: {},
            },
          ],
        },
        {
          styles: {},
          columns: [{
            span: { desktop: 12, tablet: 12, mobile: 12 },
            elements: [{
              content: { type: 'paragraph', text: '© 2025 NOIR. All rights reserved.  ·  Privacy Policy  ·  Terms of Service' },
              styles: { fontFamily: "'Inter',sans-serif", fontSize: '10px', color: '#2E2B27', letterSpacing: '0.1em', margin: '0', textAlign: 'center' },
              responsive: {},
            }],
            styles: {},
            responsive: {},
          }],
        },
      ],
    },

  ],
}
