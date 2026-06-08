'use client'

import { useState } from 'react'
import { DND_TYPE, encodeDragPayload } from '@/components/builder/dnd/dragTypes'
import { defaultContentForType } from '@/lib/elementDefaults'
import { useBuilderStore } from '@/store/builder.store'
import { useDashboardStore } from '@/store/dashboard.store'
import type { DashboardWidgetType } from '@/types/dashboard.types'

// ─── Web Elements groups ──────────────────────────────────────────────────────

const WEB_GROUPS = [
  {
    label: 'Layout',
    color: '#6366f1',
    items: [
      {
        label: 'Section', type: 'section-block',
        icon: (
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
            <rect x="1" y="3" width="18" height="14" rx="2" stroke="currentColor" strokeWidth="1.4" />
            <path d="M4 6.5h5M4 9h8M4 11.5h6" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
          </svg>
        ),
      },
      {
        label: 'Div / Span', type: 'div-container',
        icon: (
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
            <rect x="1.5" y="3" width="17" height="14" rx="2" stroke="currentColor" strokeWidth="1.4" strokeDasharray="2 1.5" />
            <path d="M6 10h8M6 13h5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" opacity="0.6" />
          </svg>
        ),
      },
      {
        label: 'Row', type: 'row-layout',
        icon: (
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
            <rect x="1" y="5" width="18" height="10" rx="2" stroke="currentColor" strokeWidth="1.4" />
            <path d="M7 5v10M13 5v10" stroke="currentColor" strokeWidth="1.2" />
          </svg>
        ),
      },
      {
        label: 'Column', type: 'column-layout',
        icon: (
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
            <rect x="1" y="3" width="8" height="14" rx="2" stroke="currentColor" strokeWidth="1.4" />
            <rect x="11" y="3" width="8" height="14" rx="2" stroke="currentColor" strokeWidth="1.4" fill="currentColor" fillOpacity="0.08" />
          </svg>
        ),
      },
      {
        label: 'Table', type: 'table',
        icon: (
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
            <rect x="1.5" y="3" width="17" height="14" rx="1.5" stroke="currentColor" strokeWidth="1.4" />
            <path d="M1.5 7.5h17M1.5 12h17M7 3v14M13 3v14" stroke="currentColor" strokeWidth="1.2" />
            <rect x="1.5" y="3" width="17" height="4.5" rx="1.5" fill="currentColor" fillOpacity="0.12" />
          </svg>
        ),
      },
      {
        label: 'Hero', type: 'hero',
        icon: (
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
            <rect x="1" y="2" width="18" height="16" rx="2.5" stroke="currentColor" strokeWidth="1.4" />
            <rect x="1" y="2" width="18" height="6" rx="2.5" fill="currentColor" fillOpacity="0.12" stroke="currentColor" strokeWidth="1.4" />
            <path d="M5 12h10M7 15h6" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
          </svg>
        ),
      },
      {
        label: 'Navbar', type: 'navbar',
        icon: (
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
            <rect x="1" y="4" width="18" height="12" rx="2.5" stroke="currentColor" strokeWidth="1.4" />
            <rect x="1" y="4" width="18" height="5" rx="2.5" fill="currentColor" fillOpacity="0.1" stroke="currentColor" strokeWidth="1.4" />
            <path d="M4 6.5h3M9 6.5h2M13 6.5h3" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
          </svg>
        ),
      },
      {
        label: 'Top Header', type: 'top-header',
        icon: (
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
            <rect x="1" y="5" width="18" height="10" rx="2.5" stroke="currentColor" strokeWidth="1.4" />
            <rect x="1" y="5" width="18" height="10" rx="2.5" fill="currentColor" fillOpacity="0.05" />
            <circle cx="14.5" cy="10" r="2.5" fill="currentColor" fillOpacity="0.2" stroke="currentColor" strokeWidth="1.2" />
            <path d="M4 10h5" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
            <circle cx="17.5" cy="7.5" r="1.2" fill="#ef4444" />
          </svg>
        ),
      },
      {
        label: 'Card', type: 'card',
        icon: (
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
            <rect x="1.5" y="2" width="17" height="16" rx="2.5" stroke="currentColor" strokeWidth="1.4" />
            <rect x="1.5" y="2" width="17" height="7" rx="2.5" fill="currentColor" fillOpacity="0.1" stroke="currentColor" strokeWidth="1.4" />
            <path d="M5 12h5M5 15h8" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
          </svg>
        ),
      },
      {
        label: 'Footer', type: 'footer',
        icon: (
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
            <rect x="1" y="2" width="18" height="16" rx="2.5" stroke="currentColor" strokeWidth="1.4" />
            <rect x="1" y="13" width="18" height="5" rx="2.5" fill="currentColor" fillOpacity="0.1" stroke="currentColor" strokeWidth="1.4" />
            <path d="M5 15.5h3M10 15.5h5" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
          </svg>
        ),
      },
      {
        label: 'Divider', type: 'divider',
        icon: (
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
            <path d="M2 10h16" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
            <circle cx="10" cy="10" r="2" fill="currentColor" fillOpacity="0.2" stroke="currentColor" strokeWidth="1.2" />
          </svg>
        ),
      },
      {
        label: 'Spacer', type: 'spacer',
        icon: (
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
            <path d="M10 3v14" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeDasharray="2 2" />
            <path d="M6 5l4-3 4 3M6 15l4 3 4-3" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        ),
      },
      {
        label: 'Hamburger', type: 'hamburger-menu',
        icon: (
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
            <rect x="1.5" y="3" width="8" height="14" rx="2" fill="currentColor" fillOpacity="0.08" stroke="currentColor" strokeWidth="1.3" strokeDasharray="2.5 1.5" />
            <path d="M12 6h6M12 10h6M12 14h4" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
          </svg>
        ),
      },
      {
        label: 'Drawer', type: 'drawer',
        icon: (
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
            <rect x="1" y="2" width="18" height="16" rx="2" stroke="currentColor" strokeWidth="1.4" />
            <rect x="11" y="2" width="8" height="16" rx="2" fill="currentColor" fillOpacity="0.1" stroke="currentColor" strokeWidth="1.4" />
            <path d="M14 8l2 2-2 2" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        ),
      },
    ],
  },
  {
    label: 'Typography',
    color: '#0ea5e9',
    items: [
      {
        label: 'Heading', type: 'heading',
        icon: (
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
            <path d="M3 4v12M17 4v12M3 10h14" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
          </svg>
        ),
      },
      {
        label: 'Paragraph', type: 'paragraph',
        icon: (
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
            <path d="M3 5h14M3 9h14M3 13h10M3 17h7" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
          </svg>
        ),
      },
      {
        label: 'Link', type: 'link',
        icon: (
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
            <path d="M8.5 11.5a4.5 4.5 0 0 0 6.36.36l2-2a4.5 4.5 0 0 0-6.36-6.36l-1 1" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M11.5 8.5A4.5 4.5 0 0 0 5.14 8.14l-2 2a4.5 4.5 0 0 0 6.36 6.36l1-1" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        ),
      },
      {
        label: 'Blockquote', type: 'blockquote',
        icon: (
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
            <rect x="2" y="4" width="7" height="7" rx="1.5" fill="currentColor" fillOpacity="0.1" stroke="currentColor" strokeWidth="1.3" />
            <rect x="11" y="4" width="7" height="7" rx="1.5" fill="currentColor" fillOpacity="0.1" stroke="currentColor" strokeWidth="1.3" />
            <path d="M4.5 7.5h2M13.5 7.5h2" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
            <path d="M3 14h14" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeDasharray="2 2" />
          </svg>
        ),
      },
    ],
  },
  {
    label: 'Media',
    color: '#10b981',
    items: [
      {
        label: 'Image', type: 'image',
        icon: (
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
            <rect x="1.5" y="3" width="17" height="14" rx="2.5" stroke="currentColor" strokeWidth="1.4" />
            <circle cx="7" cy="8" r="1.8" fill="currentColor" fillOpacity="0.2" stroke="currentColor" strokeWidth="1.2" />
            <path d="M1.5 14l4.5-4 3 3 3-3.5 5.5 4.5" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        ),
      },
      {
        label: 'Video', type: 'video',
        icon: (
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
            <rect x="1" y="4" width="12" height="12" rx="2.5" stroke="currentColor" strokeWidth="1.4" />
            <path d="M13 8l5-2.5v9L13 12V8z" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M6.5 8v4M8.5 9v2" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
          </svg>
        ),
      },
      {
        label: 'Gallery', type: 'gallery',
        icon: (
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
            <rect x="1" y="1" width="8" height="8" rx="2" fill="currentColor" fillOpacity="0.08" stroke="currentColor" strokeWidth="1.3" />
            <rect x="11" y="1" width="8" height="8" rx="2" fill="currentColor" fillOpacity="0.08" stroke="currentColor" strokeWidth="1.3" />
            <rect x="1" y="11" width="8" height="8" rx="2" fill="currentColor" fillOpacity="0.08" stroke="currentColor" strokeWidth="1.3" />
            <rect x="11" y="11" width="8" height="8" rx="2" fill="currentColor" fillOpacity="0.15" stroke="currentColor" strokeWidth="1.3" />
          </svg>
        ),
      },
      {
        label: 'Embed', type: 'embed',
        icon: (
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
            <rect x="2" y="3" width="16" height="14" rx="2.5" stroke="currentColor" strokeWidth="1.4" />
            <path d="M7.5 7L4 10l3.5 3M12.5 7L16 10l-3.5 3" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M11 7l-2 6" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
          </svg>
        ),
      },
      {
        label: 'Map', type: 'map',
        icon: (
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
            <path d="M10 2C7.2 2 5 4.2 5 7c0 4.5 5 11 5 11s5-6.5 5-11c0-2.8-2.2-5-5-5z" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
            <circle cx="10" cy="7" r="2" fill="currentColor" fillOpacity="0.2" stroke="currentColor" strokeWidth="1.2" />
          </svg>
        ),
      },
      {
        label: 'Icon', type: 'icon',
        icon: (
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
            <path d="M10 2l2.2 5.5H18l-4.6 3.8 1.8 5.7L10 14l-5.2 3 1.8-5.7L2 7.5h5.8L10 2z" fill="currentColor" fillOpacity="0.12" stroke="currentColor" strokeWidth="1.3" strokeLinejoin="round" />
          </svg>
        ),
      },
    ],
  },
  {
    label: 'List',
    color: '#f59e0b',
    items: [
      {
        label: 'Bullet List', type: 'list',
        icon: (
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
            <circle cx="4" cy="6" r="1.5" fill="currentColor" />
            <circle cx="4" cy="10" r="1.5" fill="currentColor" />
            <circle cx="4" cy="14" r="1.5" fill="currentColor" />
            <path d="M8 6h9M8 10h9M8 14h6" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
          </svg>
        ),
      },
      {
        label: 'Numbered', type: 'ordered-list',
        icon: (
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
            <path d="M3 4.5h1.5v4" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M2.5 8.5h3" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
            <path d="M2.5 12c0-1.2 3-1.2 3 0s-3 1.2-3 2h3" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
            <path d="M8 6h9M8 10h9M8 14h6" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
          </svg>
        ),
      },
      {
        label: 'Checklist', type: 'checklist',
        icon: (
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
            <rect x="2" y="4" width="5" height="5" rx="1.2" fill="currentColor" fillOpacity="0.1" stroke="currentColor" strokeWidth="1.3" />
            <path d="M3.5 6.5l1 1 2-2" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
            <rect x="2" y="12" width="5" height="5" rx="1.2" stroke="currentColor" strokeWidth="1.3" />
            <path d="M9 6.5h9M9 14.5h9" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
          </svg>
        ),
      },
      {
        label: 'Icon List', type: 'icon-list',
        icon: (
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
            <path d="M4 5.5l1.5 1.5-1.5 1.5M4 11.5l1.5 1.5-1.5 1.5" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M9 7h9M9 13h7" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
          </svg>
        ),
      },
    ],
  },
  {
    label: 'Form',
    color: '#8b5cf6',
    items: [
      {
        label: 'Form', type: 'form',
        icon: (
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
            <rect x="2" y="2" width="16" height="16" rx="2.5" stroke="currentColor" strokeWidth="1.4" />
            <rect x="4" y="5" width="12" height="3" rx="1" fill="currentColor" fillOpacity="0.1" stroke="currentColor" strokeWidth="1.1" />
            <rect x="4" y="10" width="12" height="3" rx="1" fill="currentColor" fillOpacity="0.1" stroke="currentColor" strokeWidth="1.1" />
            <rect x="4" y="15" width="5" height="2.5" rx="1" fill="currentColor" fillOpacity="0.3" />
          </svg>
        ),
      },
      {
        label: 'Input', type: 'input',
        icon: (
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
            <rect x="2" y="6" width="16" height="8" rx="2" stroke="currentColor" strokeWidth="1.4" />
            <path d="M5.5 10h1" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
          </svg>
        ),
      },
      {
        label: 'Email', type: 'email',
        icon: (
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
            <rect x="2" y="4" width="16" height="12" rx="2.5" stroke="currentColor" strokeWidth="1.4" />
            <path d="M2 7l8 5 8-5" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
          </svg>
        ),
      },
      {
        label: 'Textarea', type: 'textarea',
        icon: (
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
            <rect x="2" y="3" width="16" height="14" rx="2.5" stroke="currentColor" strokeWidth="1.4" />
            <path d="M5 7h10M5 10h10M5 13h6" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
            <path d="M14 14l3-3" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
            <path d="M15.5 16l1-3.5" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
          </svg>
        ),
      },
      {
        label: 'Select', type: 'select',
        icon: (
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
            <rect x="2" y="6" width="16" height="8" rx="2" stroke="currentColor" strokeWidth="1.4" />
            <path d="M5 10h6" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
            <path d="M14 9l-1.5 1.5L14 12" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        ),
      },
      {
        label: 'Checkbox', type: 'checkbox',
        icon: (
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
            <rect x="3" y="3" width="14" height="14" rx="3" fill="currentColor" fillOpacity="0.1" stroke="currentColor" strokeWidth="1.4" />
            <path d="M6.5 10l2.5 2.5 4.5-5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        ),
      },
      {
        label: 'Radio', type: 'radio',
        icon: (
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
            <circle cx="10" cy="10" r="7.5" stroke="currentColor" strokeWidth="1.4" />
            <circle cx="10" cy="10" r="3.5" fill="currentColor" fillOpacity="0.25" stroke="currentColor" strokeWidth="1.2" />
          </svg>
        ),
      },
    ],
  },
  {
    label: 'Interactive',
    color: '#ec4899',
    items: [
      {
        label: 'Button', type: 'button',
        icon: (
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
            <rect x="2" y="6" width="16" height="8" rx="3" fill="currentColor" fillOpacity="0.12" stroke="currentColor" strokeWidth="1.4" />
            <path d="M7 10h6" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
          </svg>
        ),
      },
      {
        label: 'Tabs', type: 'tabs',
        icon: (
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
            <rect x="1.5" y="1.5" width="6" height="5" rx="1.5" fill="currentColor" fillOpacity="0.2" stroke="currentColor" strokeWidth="1.3" />
            <rect x="9" y="1.5" width="5" height="5" rx="1.5" stroke="currentColor" strokeWidth="1.3" />
            <rect x="15.5" y="1.5" width="3" height="5" rx="1.5" stroke="currentColor" strokeWidth="1.3" />
            <rect x="1.5" y="7.5" width="17" height="11" rx="2" fill="currentColor" fillOpacity="0.06" stroke="currentColor" strokeWidth="1.3" />
          </svg>
        ),
      },
      {
        label: 'Accordion', type: 'accordion',
        icon: (
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
            <rect x="2" y="2" width="16" height="5" rx="1.5" fill="currentColor" fillOpacity="0.12" stroke="currentColor" strokeWidth="1.3" />
            <path d="M15 4.5l-2 2-2-2" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
            <rect x="2" y="9" width="16" height="5" rx="1.5" stroke="currentColor" strokeWidth="1.3" />
            <rect x="2" y="16" width="16" height="2.5" rx="1" stroke="currentColor" strokeWidth="1.3" />
          </svg>
        ),
      },
      {
        label: 'Tooltip', type: 'tooltip',
        icon: (
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
            <rect x="2" y="2" width="16" height="9" rx="2.5" fill="currentColor" fillOpacity="0.1" stroke="currentColor" strokeWidth="1.3" />
            <path d="M7 14l3 4 3-4" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M6 6h8M6 9h5" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
          </svg>
        ),
      },
      {
        label: 'Modal', type: 'modal',
        icon: (
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
            <rect x="1" y="1" width="18" height="18" rx="3" fill="currentColor" fillOpacity="0.05" stroke="currentColor" strokeWidth="1.2" strokeDasharray="2 1.5" />
            <rect x="4" y="4" width="12" height="12" rx="2" fill="currentColor" fillOpacity="0.1" stroke="currentColor" strokeWidth="1.3" />
            <path d="M7 9h6M7 12h4" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
            <path d="M14 5.5L5.5 14" stroke="currentColor" strokeWidth="1" strokeLinecap="round" opacity="0.3" />
          </svg>
        ),
      },
      {
        label: 'Carousel', type: 'carousel',
        icon: (
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
            <rect x="4" y="4" width="12" height="10" rx="2" fill="currentColor" fillOpacity="0.1" stroke="currentColor" strokeWidth="1.4" />
            <path d="M1.5 9.5l2-2M1.5 9.5l2 2M18.5 9.5l-2-2M18.5 9.5l-2 2" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
            <circle cx="8" cy="17" r="1" fill="currentColor" />
            <circle cx="10" cy="17" r="1" fill="currentColor" fillOpacity="0.4" />
            <circle cx="12" cy="17" r="1" fill="currentColor" fillOpacity="0.4" />
          </svg>
        ),
      },
      {
        label: 'Alert', type: 'alert',
        icon: (
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
            <rect x="1.5" y="4" width="17" height="12" rx="2.5" fill="currentColor" fillOpacity="0.08" stroke="currentColor" strokeWidth="1.4" />
            <circle cx="5.5" cy="10" r="1.5" fill="currentColor" fillOpacity="0.5" />
            <path d="M8.5 8h7M8.5 12h5" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
          </svg>
        ),
      },
      {
        label: 'Badge', type: 'badge',
        icon: (
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
            <rect x="4" y="7" width="12" height="6" rx="3" fill="currentColor" fillOpacity="0.15" stroke="currentColor" strokeWidth="1.4" />
            <path d="M7.5 10h5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
          </svg>
        ),
      },
      {
        label: 'Progress', type: 'progress',
        icon: (
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
            <rect x="2" y="8" width="16" height="4" rx="2" fill="currentColor" fillOpacity="0.1" stroke="currentColor" strokeWidth="1.4" />
            <rect x="2" y="8" width="10" height="4" rx="2" fill="currentColor" fillOpacity="0.6" />
          </svg>
        ),
      },
      {
        label: 'Breadcrumb', type: 'breadcrumb',
        icon: (
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
            <path d="M2 10h4M8 10h4M14 10h4" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
            <path d="M6 7l2 3-2 3M12 7l2 3-2 3" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        ),
      },
      {
        label: 'Timeline', type: 'timeline',
        icon: (
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
            <circle cx="5" cy="5" r="2" fill="currentColor" fillOpacity="0.7" />
            <circle cx="5" cy="10" r="2" fill="currentColor" fillOpacity="0.5" />
            <circle cx="5" cy="15" r="2" fill="currentColor" fillOpacity="0.3" />
            <path d="M5 7v1M5 12v1" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
            <path d="M9 5h8M9 10h6M9 15h7" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
          </svg>
        ),
      },
      {
        label: 'Avatar', type: 'avatar',
        icon: (
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
            <circle cx="10" cy="7" r="3.5" fill="currentColor" fillOpacity="0.15" stroke="currentColor" strokeWidth="1.4" />
            <path d="M3 18c0-3.866 3.134-7 7-7s7 3.134 7 7" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
          </svg>
        ),
      },
    ],
  },
  {
    label: 'SaaS',
    color: '#8b5cf6',
    items: [
      {
        label: 'Stat Card', type: 'stat-card',
        icon: (
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
            <rect x="1.5" y="3" width="17" height="14" rx="2.5" fill="currentColor" fillOpacity="0.08" stroke="currentColor" strokeWidth="1.4" />
            <path d="M5 13l3-3 2.5 2.5L14 8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            <circle cx="14" cy="8" r="1.5" fill="currentColor" />
          </svg>
        ),
      },
      {
        label: 'Pricing Card', type: 'pricing-card',
        icon: (
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
            <rect x="3" y="1.5" width="14" height="17" rx="2.5" fill="currentColor" fillOpacity="0.08" stroke="currentColor" strokeWidth="1.4" />
            <path d="M7 7h6M7 10h4M8 13h4" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
            <path d="M7 5h1.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
          </svg>
        ),
      },
    ],
  },
]

// ─── KPI Dashboard groups ─────────────────────────────────────────────────────

const KPI_GROUPS = [
  {
    label: 'Charts',
    color: '#14b8a6',
    items: [
      {
        label: 'Bar Chart', type: 'chart-bar',
        icon: (
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
            <path d="M2 17h16" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
            <rect x="3" y="7" width="3" height="10" rx="1" fill="currentColor" fillOpacity="0.2" stroke="currentColor" strokeWidth="1.2" />
            <rect x="8" y="4" width="3" height="13" rx="1" fill="currentColor" fillOpacity="0.4" stroke="currentColor" strokeWidth="1.2" />
            <rect x="13" y="10" width="3" height="7" rx="1" fill="currentColor" fillOpacity="0.2" stroke="currentColor" strokeWidth="1.2" />
          </svg>
        ),
      },
      {
        label: 'Line Chart', type: 'chart-line',
        icon: (
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
            <path d="M2 17h16M2 3v14" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
            <path d="M3 14l3.5-5 3.5 3 4-7 3.5 2.5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
            <circle cx="3" cy="14" r="1.3" fill="currentColor" />
            <circle cx="6.5" cy="9" r="1.3" fill="currentColor" />
            <circle cx="10" cy="12" r="1.3" fill="currentColor" />
            <circle cx="14" cy="5" r="1.3" fill="currentColor" />
          </svg>
        ),
      },
      {
        label: 'Area Chart', type: 'chart-area',
        icon: (
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
            <path d="M2 17h16M2 3v14" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
            <path d="M3 15l3.5-5 3.5 3 4-7 3.5 2.5V17H3z" fill="currentColor" fillOpacity="0.15" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        ),
      },
      {
        label: 'Pie Chart', type: 'chart-pie',
        icon: (
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
            <circle cx="10" cy="10" r="8" stroke="currentColor" strokeWidth="1.3" />
            <path d="M10 10L10 2" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
            <path d="M10 10L17.2 14.2" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
            <path d="M10 2A8 8 0 0 1 17.2 14.2L10 10z" fill="currentColor" fillOpacity="0.2" />
          </svg>
        ),
      },
      {
        label: 'Donut Chart', type: 'chart-donut',
        icon: (
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
            <circle cx="10" cy="10" r="8" stroke="currentColor" strokeWidth="1.3" />
            <path d="M10 2A8 8 0 0 1 18 10" stroke="currentColor" strokeWidth="3.5" strokeLinecap="butt" opacity="0.25" />
            <circle cx="10" cy="10" r="4.5" fill="var(--color-surface, white)" stroke="currentColor" strokeWidth="1.3" />
          </svg>
        ),
      },
      {
        label: 'Gauge', type: 'chart-gauge',
        icon: (
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
            <path d="M3 15a8 8 0 0 1 14 0" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
            <path d="M3 15a8 8 0 0 1 4.5-7.2" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" opacity="0.2" />
            <path d="M10 15l-2.5-5.5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
            <circle cx="10" cy="15" r="1.5" fill="currentColor" />
          </svg>
        ),
      },
    ],
  },
  {
    label: 'Display',
    color: '#6366f1',
    items: [
      {
        label: 'KPI Card', type: 'kpi-card',
        icon: (
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
            <rect x="1.5" y="3" width="17" height="14" rx="2.5" fill="currentColor" fillOpacity="0.08" stroke="currentColor" strokeWidth="1.4" />
            <path d="M5 8h3M5 11h5" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
            <path d="M13 7l1.5 3.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
            <path d="M11.5 14l2-3.5 2 1" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        ),
      },
      {
        label: 'Data Table', type: 'data-table',
        icon: (
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
            <rect x="1.5" y="3" width="17" height="14" rx="1.5" stroke="currentColor" strokeWidth="1.4" />
            <path d="M1.5 7h17M1.5 11h17" stroke="currentColor" strokeWidth="1.1" />
            <path d="M7 3v14M13 3v14" stroke="currentColor" strokeWidth="1.1" />
            <rect x="1.5" y="3" width="17" height="4" rx="1.5" fill="currentColor" fillOpacity="0.12" />
          </svg>
        ),
      },
    ],
  },
  {
    label: 'Filters',
    color: '#f59e0b',
    items: [
      {
        label: 'Filter Bar', type: 'filter-bar',
        icon: (
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
            <path d="M2 5h16M5 10h10M8 15h4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
          </svg>
        ),
      },
    ],
  },
]

// ─── Element item card ────────────────────────────────────────────────────────

interface ElementItem {
  label: string
  type: string
  icon: React.ReactNode
}

interface Group {
  label: string
  color: string
  items: ElementItem[]
}

function ElementCard({ item, accentColor }: { item: ElementItem; accentColor: string }) {
  const quickAddElement = useBuilderStore((s) => s.quickAddElement)
  const addDrawerLayout = useBuilderStore((s) => s.addDrawerLayout)

  return (
    <div
      draggable
      title={`Click or drag to add ${item.label}`}
      onClick={() => {
        const content = defaultContentForType(item.type)
        if (content) {
          if (content.type === 'drawer') {
            addDrawerLayout(content)
          } else {
            quickAddElement(content)
          }
        }
      }}
      onDragStart={(e) => {
        e.stopPropagation()
        e.dataTransfer.effectAllowed = 'copyMove'
        e.dataTransfer.setData(DND_TYPE, encodeDragPayload({ type: 'panel', elementType: item.type }))
      }}
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 7,
        padding: '12px 6px 10px',
        borderRadius: 10,
        border: '1px solid var(--color-border)',
        backgroundColor: 'var(--color-bg)',
        cursor: 'grab',
        userSelect: 'none',
        minHeight: 70,
        transition: 'all 0.15s ease',
        pointerEvents: 'auto',
      }}
      onMouseEnter={(e) => {
        const el = e.currentTarget
        el.style.borderColor = accentColor
        el.style.backgroundColor = `${accentColor}0d`
        el.style.boxShadow = `0 2px 8px ${accentColor}22`
        el.style.transform = 'translateY(-1px)'
        const icon = el.querySelector('.elem-icon') as HTMLElement | null
        if (icon) icon.style.color = accentColor
      }}
      onMouseLeave={(e) => {
        const el = e.currentTarget
        el.style.borderColor = 'var(--color-border)'
        el.style.backgroundColor = 'var(--color-bg)'
        el.style.boxShadow = 'none'
        el.style.transform = 'none'
        const icon = el.querySelector('.elem-icon') as HTMLElement | null
        if (icon) icon.style.color = 'var(--color-text-secondary)'
      }}
    >
      <span
        className="elem-icon"
        style={{
          color: 'var(--color-text-secondary)',
          display: 'flex',
          pointerEvents: 'none',
          transition: 'color 0.15s ease',
        }}
      >
        {item.icon}
      </span>
      <span
        style={{
          fontSize: '0.6375rem',
          color: 'var(--color-text-secondary)',
          fontWeight: 500,
          textAlign: 'center',
          lineHeight: 1.2,
          pointerEvents: 'none',
        }}
      >
        {item.label}
      </span>
    </div>
  )
}

function GroupSection({ group, defaultOpen = false }: { group: Group; defaultOpen?: boolean }) {
  const [open, setOpen] = useState(defaultOpen)

  return (
    <div style={{ marginBottom: 4 }}>
      <button
        onClick={() => setOpen((o) => !o)}
        style={{
          width: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '7px 6px',
          background: 'none',
          border: 'none',
          cursor: 'pointer',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
          <span
            style={{
              width: 6,
              height: 6,
              borderRadius: 2,
              backgroundColor: group.color,
              flexShrink: 0,
              display: 'inline-block',
            }}
          />
          <span
            style={{
              fontSize: '0.6875rem',
              fontWeight: 700,
              textTransform: 'uppercase',
              letterSpacing: '0.07em',
              color: 'var(--color-text-secondary)',
            }}
          >
            {group.label}
          </span>
        </div>
        <svg
          width="12" height="12" viewBox="0 0 12 12" fill="none"
          stroke="var(--color-text-secondary)" strokeWidth="1.8" strokeLinecap="round"
          style={{
            flexShrink: 0,
            transition: 'transform 180ms',
            transform: open ? 'rotate(180deg)' : 'rotate(0deg)',
          }}
        >
          <path d="M2 4l4 4 4-4" />
        </svg>
      </button>

      {open && (
        <div style={{ paddingBottom: 12 }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 6 }}>
            {group.items.map((item) => (
              <ElementCard key={item.type} item={item} accentColor={group.color} />
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

// ─── Dashboard element card ───────────────────────────────────────────────────

function DashboardElementCard({ item, accentColor }: { item: ElementItem; accentColor: string }) {
  const addWidget = useDashboardStore((s) => s.addWidget)

  const handleDragStart = (e: React.DragEvent) => {
    e.stopPropagation()
    e.dataTransfer.effectAllowed = 'copy'
    e.dataTransfer.setData('dashWidgetType', item.type)
    ;(window as unknown as Record<string, unknown>).__dashDroppingType = item.type
    // Custom ghost
    const ghost = document.createElement('div')
    ghost.textContent = item.label
    Object.assign(ghost.style, {
      position: 'fixed', top: '-999px',
      padding: '4px 10px', borderRadius: '20px',
      background: accentColor, color: '#fff',
      fontSize: '11px', fontWeight: '600', pointerEvents: 'none',
    })
    document.body.appendChild(ghost)
    e.dataTransfer.setDragImage(ghost, ghost.offsetWidth / 2, 14)
    setTimeout(() => document.body.removeChild(ghost), 0)
  }

  const handleDragEnd = () => {
    ;(window as unknown as Record<string, unknown>).__dashDroppingType = null
  }

  return (
    <div
      draggable
      title={`Click or drag to add ${item.label}`}
      onClick={() => addWidget(item.type as DashboardWidgetType)}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 7,
        padding: '12px 6px 10px',
        borderRadius: 10,
        border: '1px solid var(--color-border)',
        backgroundColor: 'var(--color-bg)',
        cursor: 'grab',
        userSelect: 'none',
        minHeight: 70,
        transition: 'all 0.15s ease',
      }}
      onMouseEnter={(e) => {
        const el = e.currentTarget
        el.style.borderColor = accentColor
        el.style.backgroundColor = `${accentColor}0d`
        el.style.boxShadow = `0 2px 8px ${accentColor}22`
        el.style.transform = 'translateY(-1px)'
        const icon = el.querySelector('.elem-icon') as HTMLElement | null
        if (icon) icon.style.color = accentColor
      }}
      onMouseLeave={(e) => {
        const el = e.currentTarget
        el.style.borderColor = 'var(--color-border)'
        el.style.backgroundColor = 'var(--color-bg)'
        el.style.boxShadow = 'none'
        el.style.transform = 'none'
        const icon = el.querySelector('.elem-icon') as HTMLElement | null
        if (icon) icon.style.color = 'var(--color-text-secondary)'
      }}
    >
      <span className="elem-icon" style={{ color: 'var(--color-text-secondary)', display: 'flex', transition: 'color 0.15s ease', pointerEvents: 'none' }}>
        {item.icon}
      </span>
      <span style={{ fontSize: '0.6375rem', color: 'var(--color-text-secondary)', fontWeight: 500, textAlign: 'center', lineHeight: 1.2, pointerEvents: 'none' }}>
        {item.label}
      </span>
    </div>
  )
}

function DashboardGroupSection({ group, defaultOpen = false }: { group: Group; defaultOpen?: boolean }) {
  const [open, setOpen] = useState(defaultOpen)
  return (
    <div style={{ marginBottom: 4 }}>
      <button
        onClick={() => setOpen((o) => !o)}
        style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '7px 6px', background: 'none', border: 'none', cursor: 'pointer' }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
          <span style={{ width: 6, height: 6, borderRadius: 2, backgroundColor: group.color, flexShrink: 0, display: 'inline-block' }} />
          <span style={{ fontSize: '0.6875rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.07em', color: 'var(--color-text-secondary)' }}>
            {group.label}
          </span>
        </div>
        <svg width="12" height="12" viewBox="0 0 12 12" fill="none" stroke="var(--color-text-secondary)" strokeWidth="1.8" strokeLinecap="round"
          style={{ flexShrink: 0, transition: 'transform 180ms', transform: open ? 'rotate(180deg)' : 'rotate(0deg)' }}
        >
          <path d="M2 4l4 4 4-4" />
        </svg>
      </button>
      {open && (
        <div style={{ paddingBottom: 12 }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 6 }}>
            {group.items.map((item) => (
              <DashboardElementCard key={item.type} item={item} accentColor={group.color} />
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

// ─── Tab panel ────────────────────────────────────────────────────────────────

type TabId = 'web' | 'dashboard'

interface TabDef {
  id: TabId
  label: string
  badge?: string
  groups: Group[]
  tip: string
}

const TABS: TabDef[] = [
  {
    id: 'web',
    label: 'Web Elements',
    groups: WEB_GROUPS,
    tip: 'Drag any element onto the canvas, or click to add to the active column.',
  },
  {
    id: 'dashboard',
    label: 'Dashboard',
    badge: 'NEW',
    groups: KPI_GROUPS,
    tip: 'Drag any widget onto the dashboard canvas, or click to add it.',
  },
]

// ─── Main panel ───────────────────────────────────────────────────────────────

export default function ElementsPanel() {
  const [activeTab, setActiveTab] = useState<TabId>('web')
  const [search, setSearch] = useState('')

  const tab = TABS.find((t) => t.id === activeTab)!
  const query = search.trim().toLowerCase()

  const filteredGroups = query
    ? tab.groups
        .map((g) => ({ ...g, items: g.items.filter((i) => i.label.toLowerCase().includes(query) || i.type.toLowerCase().includes(query)) }))
        .filter((g) => g.items.length > 0)
    : tab.groups

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>

      {/* ── Tab switcher ────────────────────────────────────────────── */}
      <div style={{ flexShrink: 0, borderBottom: '1px solid var(--color-border)' }}>
        {TABS.map((t) => {
          const isActive = t.id === activeTab
          return (
            <button
              key={t.id}
              onClick={() => { setActiveTab(t.id); setSearch('') }}
              style={{
                width: '100%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '10px 14px',
                background: isActive ? 'rgba(79,70,229,0.07)' : 'transparent',
                borderLeft: isActive ? '3px solid var(--color-primary)' : '3px solid transparent',
                borderTop: 'none',
                borderRight: 'none',
                borderBottom: '1px solid var(--color-border)',
                cursor: 'pointer',
                transition: 'background 150ms',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <span
                  style={{
                    fontSize: '0.8rem',
                    fontWeight: isActive ? 700 : 500,
                    color: isActive ? 'var(--color-primary)' : 'var(--color-text-primary)',
                  }}
                >
                  {t.label}
                </span>
                {t.badge && (
                  <span
                    style={{
                      fontSize: '0.6rem',
                      fontWeight: 700,
                      color: '#fff',
                      backgroundColor: '#4f46e5',
                      borderRadius: 4,
                      padding: '1px 5px',
                      letterSpacing: '0.05em',
                    }}
                  >
                    {t.badge}
                  </span>
                )}
              </div>
              <svg
                width="12" height="12" viewBox="0 0 12 12" fill="none"
                stroke={isActive ? 'var(--color-primary)' : 'var(--color-text-secondary)'}
                strokeWidth="1.8" strokeLinecap="round"
                style={{ flexShrink: 0, transition: 'transform 180ms', transform: isActive ? 'rotate(180deg)' : 'rotate(0deg)' }}
              >
                <path d="M2 4l4 4 4-4" />
              </svg>
            </button>
          )
        })}
      </div>

      {/* ── Search ──────────────────────────────────────────────────── */}
      <div style={{ padding: '10px 12px 4px', flexShrink: 0 }}>
        <div style={{ position: 'relative' }}>
          <svg
            width="13" height="13" viewBox="0 0 13 13" fill="none"
            stroke="var(--color-text-secondary)" strokeWidth="1.5" strokeLinecap="round"
            style={{ position: 'absolute', left: 9, top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }}
          >
            <circle cx="5.5" cy="5.5" r="4" />
            <path d="M9 9l2.5 2.5" />
          </svg>
          <input
            type="text"
            placeholder={`Search ${tab.label.toLowerCase()}…`}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{
              width: '100%',
              height: 30,
              paddingLeft: 28,
              paddingRight: 8,
              borderRadius: 6,
              border: '1px solid var(--color-border)',
              backgroundColor: 'var(--color-bg)',
              color: 'var(--color-text-primary)',
              fontSize: '0.75rem',
              outline: 'none',
              boxSizing: 'border-box',
            }}
          />
        </div>
      </div>

      {/* ── Groups ──────────────────────────────────────────────────── */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '4px 12px 16px' }}>
        {filteredGroups.length === 0 && (
          <div style={{ textAlign: 'center', color: 'var(--color-muted)', fontSize: '0.75rem', paddingTop: 32 }}>
            No elements match &ldquo;{search}&rdquo;
          </div>
        )}

        {filteredGroups.map((group, idx) =>
          activeTab === 'dashboard' ? (
            <DashboardGroupSection key={group.label} group={group} defaultOpen={idx === 0} />
          ) : (
            <GroupSection key={group.label} group={group} defaultOpen={idx === 0} />
          )
        )}

        {/* Tip */}
        <div
          style={{
            marginTop: 20,
            padding: '12px 14px',
            borderRadius: 8,
            backgroundColor: 'rgba(79,70,229,0.06)',
            border: '1px solid rgba(79,70,229,0.15)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 6 }}>
            <svg
              width="13" height="13" viewBox="0 0 13 13" fill="none"
              stroke="var(--color-primary)" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"
            >
              <path d="M6.5 1v2M6.5 10v2M1 6.5h2M10 6.5h2M2.9 2.9l1.4 1.4M8.7 8.7l1.4 1.4M2.9 10.1l1.4-1.4M8.7 4.3l1.4-1.4" />
            </svg>
            <span style={{ fontSize: '0.6875rem', fontWeight: 700, color: 'var(--color-primary)', letterSpacing: '0.02em' }}>Tip</span>
          </div>
          <p style={{ fontSize: '0.75rem', color: 'var(--color-text-secondary)', margin: 0, lineHeight: 1.5 }}>
            {tab.tip}
          </p>
        </div>
      </div>
    </div>
  )
}
