'use client'

import React, { useState, useRef } from 'react'
import { useBuilderStore } from '@/store/builder.store'
import { useDashboardStore } from '@/store/dashboard.store'
import { TEMPLATES, materializeTemplate } from '@/lib/templates'
import { NOIR_FASHION_TEMPLATE } from '@/lib/noir-fashion-template'
import { DND_TYPE, encodeDragPayload } from '@/components/builder/dnd/dragTypes'
import { defaultContentForType } from '@/lib/elementDefaults'
import { getSalesDashboard } from '@/components/dashboard/templates/SalesDashboard'

// ─── Types ────────────────────────────────────────────────────────────────────

type TabId = 'web' | 'dashboard'

// ─── SVG thumbnails (template cards) ─────────────────────────────────────────

function BannerGradientThumb() {
  return (
    <svg viewBox="0 0 220 80" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ width: '100%', height: '100%' }}>
      <defs><linearGradient id="bg1" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stopColor="#667eea" /><stop offset="100%" stopColor="#764ba2" /></linearGradient></defs>
      <rect width="220" height="80" fill="url(#bg1)" />
      <rect x="60" y="12" width="100" height="10" rx="3" fill="rgba(255,255,255,0.9)" />
      <rect x="75" y="28" width="70" height="6" rx="2" fill="rgba(255,255,255,0.55)" />
      <rect x="84" y="50" width="52" height="16" rx="8" fill="white" />
      <rect x="94" y="55" width="32" height="5" rx="2" fill="#764ba2" />
    </svg>
  )
}
function BannerDarkThumb() {
  return (
    <svg viewBox="0 0 220 80" fill="none" style={{ width: '100%', height: '100%' }}>
      <rect width="220" height="80" fill="#0f172a" />
      <rect x="20" y="34" width="124" height="7" rx="2" fill="#e2e8f0" opacity="0.8" />
      <rect x="152" y="34" width="50" height="7" rx="2" fill="#818cf8" />
    </svg>
  )
}
function BannerProductThumb() {
  return (
    <svg viewBox="0 0 220 80" fill="none" style={{ width: '100%', height: '100%' }}>
      <rect width="220" height="80" fill="#f8faff" />
      <rect x="12" y="18" width="28" height="4" rx="1.5" fill="#4f46e5" />
      <rect x="12" y="28" width="80" height="8" rx="2" fill="#0f172a" />
      <rect x="12" y="38" width="72" height="5" rx="1.5" fill="#64748b" />
      <rect x="12" y="56" width="44" height="12" rx="4" fill="#4f46e5" />
      <rect x="120" y="8" width="88" height="64" rx="8" fill="#e0e7ff" />
      <rect x="138" y="28" width="52" height="6" rx="2" fill="#818cf8" opacity="0.8" />
    </svg>
  )
}
function CtaDarkThumb() {
  return (
    <svg viewBox="0 0 220 80" fill="none" style={{ width: '100%', height: '100%' }}>
      <rect width="220" height="80" fill="#0f172a" />
      <rect x="55" y="14" width="110" height="10" rx="3" fill="#f1f5f9" />
      <rect x="65" y="30" width="90" height="5" rx="1.5" fill="#94a3b8" />
      <rect x="70" y="50" width="80" height="16" rx="6" fill="#4f46e5" />
      <rect x="86" y="55" width="48" height="5" rx="2" fill="rgba(255,255,255,0.9)" />
    </svg>
  )
}
function CtaSplitThumb() {
  return (
    <svg viewBox="0 0 220 80" fill="none" style={{ width: '100%', height: '100%' }}>
      <defs><linearGradient id="bg2" x1="0" y1="0" x2="1" y2="0"><stop offset="0%" stopColor="#4f46e5" /><stop offset="100%" stopColor="#7c3aed" /></linearGradient></defs>
      <rect width="220" height="80" fill="url(#bg2)" />
      <rect x="16" y="22" width="88" height="9" rx="2.5" fill="white" />
      <rect x="16" y="36" width="72" height="5" rx="1.5" fill="rgba(255,255,255,0.65)" />
      <rect x="128" y="27" width="64" height="14" rx="4" fill="white" />
      <rect x="138" y="31" width="44" height="5" rx="2" fill="#4f46e5" />
      <rect x="128" y="47" width="64" height="14" rx="4" fill="transparent" stroke="rgba(255,255,255,0.6)" strokeWidth="1.5" />
    </svg>
  )
}
function CtaMinimalThumb() {
  return (
    <svg viewBox="0 0 220 80" fill="none" style={{ width: '100%', height: '100%' }}>
      <rect width="220" height="80" fill="white" />
      <rect width="220" height="80" rx="8" fill="none" stroke="#e2e8f0" strokeWidth="1.5" />
      <rect x="16" y="16" width="100" height="9" rx="2.5" fill="#0f172a" />
      <rect x="16" y="30" width="80" height="5" rx="1.5" fill="#94a3b8" />
      <rect x="152" y="22" width="52" height="16" rx="5" fill="#0f172a" />
      <rect x="160" y="27" width="36" height="5" rx="2" fill="white" />
    </svg>
  )
}
function FormNewsletterThumb() {
  return (
    <svg viewBox="0 0 220 80" fill="none" style={{ width: '100%', height: '100%' }}>
      <rect width="220" height="80" fill="#fafafa" />
      <rect x="82" y="10" width="56" height="5" rx="1.5" fill="#4f46e5" />
      <rect x="52" y="20" width="116" height="9" rx="2.5" fill="#0f172a" />
      <rect x="30" y="48" width="108" height="14" rx="4" fill="white" stroke="#e2e8f0" strokeWidth="1" />
      <rect x="144" y="48" width="46" height="14" rx="4" fill="#4f46e5" />
    </svg>
  )
}
function FormContactThumb() {
  return (
    <svg viewBox="0 0 220 80" fill="none" style={{ width: '100%', height: '100%' }}>
      <rect width="220" height="80" fill="white" />
      <rect x="12" y="12" width="68" height="9" rx="2.5" fill="#0f172a" />
      <rect x="106" y="8" width="102" height="64" rx="8" fill="#f8fafc" stroke="#e2e8f0" strokeWidth="1" />
      <rect x="114" y="16" width="86" height="10" rx="3" fill="white" stroke="#e2e8f0" strokeWidth="1" />
      <rect x="114" y="30" width="86" height="10" rx="3" fill="white" stroke="#e2e8f0" strokeWidth="1" />
      <rect x="114" y="62" width="50" height="8" rx="3" fill="#4f46e5" />
    </svg>
  )
}
function FormWaitlistThumb() {
  return (
    <svg viewBox="0 0 220 80" fill="none" style={{ width: '100%', height: '100%' }}>
      <defs><linearGradient id="bg3" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#0f172a" /><stop offset="100%" stopColor="#1e1b4b" /></linearGradient></defs>
      <rect width="220" height="80" fill="url(#bg3)" />
      <rect x="40" y="18" width="140" height="10" rx="3" fill="#f1f5f9" />
      <rect x="30" y="46" width="120" height="14" rx="4" fill="#1e293b" stroke="#334155" strokeWidth="1" />
      <rect x="156" y="46" width="34" height="14" rx="4" fill="#4f46e5" />
    </svg>
  )
}
function Banner3DThumb() {
  return (
    <svg viewBox="0 0 220 80" fill="none" style={{ width: '100%', height: '100%' }}>
      <defs>
        <radialGradient id="orb1t" cx="50%" cy="50%" r="50%"><stop offset="0%" stopColor="#6366f1" stopOpacity="0.6" /><stop offset="100%" stopColor="#6366f1" stopOpacity="0" /></radialGradient>
        <radialGradient id="orb2t" cx="50%" cy="50%" r="50%"><stop offset="0%" stopColor="#a855f7" stopOpacity="0.5" /><stop offset="100%" stopColor="#a855f7" stopOpacity="0" /></radialGradient>
      </defs>
      <rect width="220" height="80" fill="#0a0a18" />
      <path d="M0 20h220M0 40h220M44 0v80M88 0v80M132 0v80" stroke="rgba(255,255,255,0.04)" strokeWidth="1" />
      <ellipse cx="30" cy="15" rx="60" ry="60" fill="url(#orb1t)" />
      <ellipse cx="190" cy="65" rx="50" ry="50" fill="url(#orb2t)" />
      <rect x="148" y="10" width="52" height="34" rx="5" fill="rgba(255,255,255,0.06)" stroke="rgba(255,255,255,0.12)" strokeWidth="0.8" transform="skewY(-4)" />
      <rect x="38" y="27" width="144" height="10" rx="3" fill="white" opacity="0.9" />
      <rect x="76" y="55" width="68" height="16" rx="8" fill="url(#orb1t)" />
    </svg>
  )
}
function BannerMorphThumb() {
  return (
    <svg viewBox="0 0 220 80" fill="none" style={{ width: '100%', height: '100%' }}>
      <defs>
        <radialGradient id="blob1t" cx="30%" cy="50%" r="60%"><stop offset="0%" stopColor="#f9a8d4" stopOpacity="0.7" /><stop offset="100%" stopColor="#a18cd1" stopOpacity="0" /></radialGradient>
        <radialGradient id="blob2t" cx="80%" cy="20%" r="50%"><stop offset="0%" stopColor="#a1c4fd" stopOpacity="0.5" /><stop offset="100%" stopColor="#c2e9fb" stopOpacity="0" /></radialGradient>
      </defs>
      <rect width="220" height="80" fill="#ffffff" />
      <ellipse cx="30" cy="40" rx="80" ry="70" fill="url(#blob1t)" />
      <ellipse cx="190" cy="10" rx="60" ry="55" fill="url(#blob2t)" />
      <rect x="16" y="30" width="108" height="10" rx="3" fill="#0f172a" opacity="0.9" />
      <rect x="16" y="62" width="72" height="14" rx="7" fill="#7c3aed" />
    </svg>
  )
}
function BannerTickerThumb() {
  return (
    <svg viewBox="0 0 220 80" fill="none" style={{ width: '100%', height: '100%' }}>
      <defs><linearGradient id="shimmer" x1="0" y1="0" x2="1" y2="0"><stop offset="0%" stopColor="#6366f1" /><stop offset="50%" stopColor="#a855f7" /><stop offset="100%" stopColor="#06b6d4" /></linearGradient></defs>
      <rect width="220" height="80" fill="#0a0a18" />
      <rect x="70" y="8" width="80" height="11" rx="5.5" fill="url(#shimmer)" />
      <rect x="30" y="25" width="160" height="10" rx="3" fill="#f1f5f9" opacity="0.9" />
      <rect x="72" y="50" width="76" height="14" rx="7" fill="#4f46e5" />
      <rect x="0" y="68" width="220" height="12" fill="rgba(255,255,255,0.03)" />
    </svg>
  )
}
function BannerSplitThumb() {
  return (
    <svg viewBox="0 0 220 80" fill="none" style={{ width: '100%', height: '100%' }}>
      <rect width="220" height="80" fill="#f8faff" />
      <rect x="12" y="12" width="88" height="9" rx="2.5" fill="#0f172a" />
      <rect x="12" y="44" width="56" height="12" rx="4" fill="#4f46e5" />
      <rect x="118" y="24" width="76" height="48" rx="6" fill="#4f46e5" />
      <rect x="126" y="32" width="40" height="8" rx="2" fill="rgba(255,255,255,0.2)" />
    </svg>
  )
}
function BannerGlassThumb() {
  return (
    <svg viewBox="0 0 220 80" fill="none" style={{ width: '100%', height: '100%' }}>
      <defs>
        <radialGradient id="glb1" cx="20%" cy="30%" r="60%"><stop offset="0%" stopColor="#6366f1" stopOpacity="0.5" /><stop offset="100%" stopColor="transparent" /></radialGradient>
        <radialGradient id="glb2" cx="80%" cy="80%" r="50%"><stop offset="0%" stopColor="#ec4899" stopOpacity="0.4" /><stop offset="100%" stopColor="transparent" /></radialGradient>
      </defs>
      <rect width="220" height="80" fill="#16213e" />
      <ellipse cx="44" cy="24" rx="80" ry="60" fill="url(#glb1)" />
      <ellipse cx="176" cy="64" rx="70" ry="55" fill="url(#glb2)" />
      <rect x="40" y="12" width="140" height="56" rx="10" fill="rgba(255,255,255,0.06)" stroke="rgba(255,255,255,0.18)" strokeWidth="1" />
      <rect x="56" y="24" width="80" height="8" rx="3" fill="rgba(255,255,255,0.85)" />
      <rect x="64" y="36" width="64" height="5" rx="2" fill="rgba(255,255,255,0.4)" />
      <rect x="72" y="50" width="44" height="12" rx="6" fill="rgba(255,255,255,0.12)" stroke="rgba(255,255,255,0.3)" strokeWidth="1" />
      <rect x="168" y="6" width="38" height="24" rx="5" fill="rgba(255,255,255,0.05)" stroke="rgba(255,255,255,0.15)" strokeWidth="0.8" transform="rotate(-6 187 18)" />
    </svg>
  )
}
function BannerNeonThumb() {
  return (
    <svg viewBox="0 0 220 80" fill="none" style={{ width: '100%', height: '100%' }}>
      <rect width="220" height="80" fill="#050510" />
      <path d="M0 20h220M0 40h220M0 60h220M40 0v80M80 0v80M120 0v80M160 0v80M200 0v80" stroke="rgba(0,255,200,0.06)" strokeWidth="0.5" />
      <rect x="10" y="70" width="200" height="8" rx="4" fill="rgba(0,255,200,0.08)" />
      <rect x="44" y="18" width="132" height="12" rx="3" fill="#fff" opacity="0.92" />
      <rect x="60" y="36" width="100" height="5" rx="2" fill="rgba(255,255,255,0.35)" />
      <rect x="68" y="50" width="84" height="18" rx="4" fill="transparent" stroke="rgba(0,255,200,0.7)" strokeWidth="1.2" />
      <rect x="78" y="55" width="64" height="7" rx="2" fill="rgba(0,255,200,0.6)" />
      <line x1="0" y1="30" x2="60" y2="30" stroke="rgba(0,255,200,0.4)" strokeWidth="0.8" />
      <line x1="160" y1="50" x2="220" y2="50" stroke="rgba(255,0,200,0.4)" strokeWidth="0.8" />
    </svg>
  )
}
function BannerAuroraThumb() {
  return (
    <svg viewBox="0 0 220 80" fill="none" style={{ width: '100%', height: '100%' }}>
      <defs>
        <radialGradient id="aur1" cx="20%" cy="0%" r="70%"><stop offset="0%" stopColor="#00c896" stopOpacity="0.35" /><stop offset="100%" stopColor="transparent" /></radialGradient>
        <radialGradient id="aur2" cx="80%" cy="0%" r="60%"><stop offset="0%" stopColor="#6428dc" stopOpacity="0.35" /><stop offset="100%" stopColor="transparent" /></radialGradient>
        <radialGradient id="aur3" cx="50%" cy="0%" r="50%"><stop offset="0%" stopColor="#0096ff" stopOpacity="0.2" /><stop offset="100%" stopColor="transparent" /></radialGradient>
      </defs>
      <rect width="220" height="80" fill="#020818" />
      <ellipse cx="44" cy="0" rx="110" ry="60" fill="url(#aur1)" />
      <ellipse cx="176" cy="0" rx="90" ry="50" fill="url(#aur2)" />
      <ellipse cx="110" cy="0" rx="80" ry="40" fill="url(#aur3)" />
      {[[18,18],[45,8],[82,22],[140,12],[170,20],[200,8]].map(([x,y],i) => (
        <circle key={i} cx={x} cy={y} r="1.2" fill="rgba(255,255,255,0.7)" />
      ))}
      <circle cx="170" cy="22" r="18" fill="rgba(0,220,170,0.2)" stroke="rgba(0,255,180,0.3)" strokeWidth="0.8" />
      <rect x="30" y="34" width="160" height="10" rx="3" fill="white" opacity="0.9" />
      <rect x="48" y="50" width="124" height="5" rx="2" fill="rgba(255,255,255,0.35)" />
      <rect x="64" y="62" width="92" height="14" rx="7" fill="rgba(0,200,150,0.7)" />
    </svg>
  )
}
function BannerRetroThumb() {
  return (
    <svg viewBox="0 0 220 80" fill="none" style={{ width: '100%', height: '100%' }}>
      <defs><linearGradient id="retrobg" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#0d001a" /><stop offset="100%" stopColor="#2d0060" /></linearGradient>
        <linearGradient id="sun" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#ff6b35" /><stop offset="100%" stopColor="#c837ab" /></linearGradient>
      </defs>
      <rect width="220" height="80" fill="url(#retrobg)" />
      <path d="M70 80 A40 40 0 0 1 150 80 Z" fill="url(#sun)" />
      <line x1="70" y1="65" x2="150" y2="65" stroke="#1a0035" strokeWidth="4" />
      <line x1="70" y1="71" x2="150" y2="71" stroke="#1a0035" strokeWidth="3" />
      <line x1="72" y1="76" x2="148" y2="76" stroke="#1a0035" strokeWidth="2" />
      <line x1="0" y1="80" x2="220" y2="80" stroke="rgba(255,107,200,0.5)" strokeWidth="0.8" />
      <line x1="0" y1="73" x2="220" y2="73" stroke="rgba(255,107,200,0.35)" strokeWidth="0.6" />
      <rect x="44" y="10" width="132" height="14" rx="3" fill="url(#sun)" opacity="0.9" />
      <rect x="64" y="30" width="92" height="5" rx="2" fill="rgba(255,200,255,0.5)" />
      <rect x="72" y="42" width="76" height="14" rx="3" fill="transparent" stroke="rgba(255,77,166,0.8)" strokeWidth="1.2" />
    </svg>
  )
}
function BannerParticleThumb() {
  return (
    <svg viewBox="0 0 220 80" fill="none" style={{ width: '100%', height: '100%' }}>
      <rect width="220" height="80" fill="#0c0c1d" />
      <line x1="22" y1="12" x2="77" y2="55" stroke="#6366f1" strokeWidth="0.4" opacity="0.5" />
      <line x1="77" y1="55" x2="143" y2="18" stroke="#8b5cf6" strokeWidth="0.4" opacity="0.5" />
      <line x1="143" y1="18" x2="198" y2="66" stroke="#6366f1" strokeWidth="0.4" opacity="0.4" />
      <line x1="22" y1="12" x2="110" y2="70" stroke="#06b6d4" strokeWidth="0.3" opacity="0.3" />
      <line x1="55" y1="40" x2="143" y2="18" stroke="#8b5cf6" strokeWidth="0.35" opacity="0.4" />
      {[[22,12,3,'#6366f1'],[77,55,2.5,'#8b5cf6'],[143,18,3.5,'#06b6d4'],[198,66,2,'#6366f1'],[55,40,2.5,'#8b5cf6'],[110,70,2,'#06b6d4'],[165,35,3,'#6366f1']].map(([x,y,r,c],i) => (
        <circle key={i} cx={x as number} cy={y as number} r={r as number} fill={c as string} opacity="0.9" />
      ))}
      <ellipse cx="110" cy="40" rx="45" ry="15" stroke="rgba(99,102,241,0.2)" strokeWidth="0.8" fill="none" />
      <rect x="38" y="24" width="144" height="10" rx="3" fill="rgba(199,210,254,0.9)" />
      <rect x="56" y="40" width="108" height="5" rx="2" fill="rgba(255,255,255,0.3)" />
      <rect x="72" y="54" width="76" height="14" rx="7" fill="rgba(99,102,241,0.85)" />
    </svg>
  )
}

// ─── Header SVG thumbnails ────────────────────────────────────────────────────

// Shared inline logo mark (puzzle-piece "n" icon) used in header thumbs
function LogoMark({ x = 0, y = 0, size = 14, dark = false }: { x?: number; y?: number; size?: number; dark?: boolean }) {
  const fg = dark ? '#ffffff' : '#2563eb'
  const bg = dark ? 'rgba(255,255,255,0.12)' : '#dbeafe'
  return (
    <g transform={`translate(${x},${y})`}>
      <rect width={size} height={size} rx={size * 0.22} fill={bg} />
      <text x={size / 2} y={size * 0.74} textAnchor="middle" fontSize={size * 0.54} fontWeight="700" fill={fg} fontFamily="system-ui,sans-serif">n</text>
    </g>
  )
}

function HeaderClassicThumb() {
  return (
    <svg viewBox="0 0 220 80" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ width: '100%', height: '100%' }}>
      <rect width="220" height="80" fill="#ffffff" />
      <rect width="220" height="56" fill="#ffffff" />
      <rect width="220" height="1" y="55" fill="#e5e7eb" />
      <rect x="0" y="55" width="220" height="25" fill="#f9fafb" />
      {/* Logo */}
      <LogoMark x={12} y={20} size={16} />
      <text x="32" y="32" fontSize="8" fontWeight="700" fill="#1d4ed8" fontFamily="system-ui,sans-serif">UI Builder</text>
      {/* Nav links */}
      <text x="78" y="32" fontSize="6.5" fill="#374151" fontFamily="system-ui,sans-serif">Products</text>
      <text x="108" y="32" fontSize="6.5" fill="#374151" fontFamily="system-ui,sans-serif">Templates</text>
      <text x="140" y="32" fontSize="6.5" fill="#374151" fontFamily="system-ui,sans-serif">Pricing</text>
      <text x="164" y="32" fontSize="6.5" fill="#374151" fontFamily="system-ui,sans-serif">Blog</text>
      {/* CTA */}
      <rect x="186" y="23" width="24" height="13" rx="3.5" fill="#4f46e5" />
      <text x="198" y="32" textAnchor="middle" fontSize="5.5" fill="white" fontWeight="600" fontFamily="system-ui,sans-serif">Start</text>
      {/* Content preview below */}
      <rect x="12" y="63" width="100" height="5" rx="1.5" fill="#d1d5db" />
      <rect x="12" y="70" width="70" height="4" rx="1" fill="#e5e7eb" />
    </svg>
  )
}

function HeaderDarkThumb() {
  return (
    <svg viewBox="0 0 220 80" fill="none" style={{ width: '100%', height: '100%' }}>
      <rect width="220" height="80" fill="#0f172a" />
      <rect width="220" height="56" fill="#0f172a" />
      <rect width="220" height="1" y="55" fill="rgba(255,255,255,0.08)" />
      <rect x="0" y="55" width="220" height="25" fill="#0a1020" />
      {/* Logo */}
      <LogoMark x={12} y={20} size={15} dark />
      <text x="31" y="32" fontSize="7.5" fontWeight="700" fill="#e2e8f0" fontFamily="system-ui,sans-serif">UI Builder</text>
      {/* Nav */}
      <text x="80" y="32" fontSize="6.5" fill="#64748b" fontFamily="system-ui,sans-serif">Features</text>
      <text x="109" y="32" fontSize="6.5" fill="#64748b" fontFamily="system-ui,sans-serif">Templates</text>
      <text x="141" y="32" fontSize="6.5" fill="#64748b" fontFamily="system-ui,sans-serif">Pricing</text>
      <text x="164" y="32" fontSize="6.5" fill="#64748b" fontFamily="system-ui,sans-serif">Docs</text>
      {/* CTA */}
      <rect x="185" y="23" width="26" height="13" rx="3" fill="#4f46e5" />
      <text x="198" y="32" textAnchor="middle" fontSize="5" fill="white" fontWeight="600" fontFamily="system-ui,sans-serif">Start →</text>
      {/* Content */}
      <rect x="12" y="63" width="90" height="5" rx="1.5" fill="rgba(255,255,255,0.08)" />
      <rect x="12" y="70" width="60" height="4" rx="1" fill="rgba(255,255,255,0.05)" />
    </svg>
  )
}

function HeaderGradientThumb() {
  return (
    <svg viewBox="0 0 220 80" fill="none" style={{ width: '100%', height: '100%' }}>
      <defs><linearGradient id="hdg1" x1="0" y1="0" x2="1" y2="0"><stop offset="0%" stopColor="#4f46e5" /><stop offset="100%" stopColor="#7c3aed" /></linearGradient></defs>
      <rect width="220" height="80" fill="#f5f3ff" />
      <rect width="220" height="56" fill="url(#hdg1)" />
      <rect width="220" height="1" y="55" fill="rgba(255,255,255,0.15)" />
      {/* Logo */}
      <LogoMark x={12} y={20} size={15} dark />
      <text x="31" y="32" fontSize="7.5" fontWeight="700" fill="#fff" fontFamily="system-ui,sans-serif">UI Builder</text>
      {/* Nav */}
      <text x="78" y="32" fontSize="6.5" fill="rgba(255,255,255,0.8)" fontFamily="system-ui,sans-serif">Products</text>
      <text x="108" y="32" fontSize="6.5" fill="rgba(255,255,255,0.8)" fontFamily="system-ui,sans-serif">Templates</text>
      <text x="140" y="32" fontSize="6.5" fill="rgba(255,255,255,0.8)" fontFamily="system-ui,sans-serif">Pricing</text>
      {/* CTA */}
      <rect x="180" y="22" width="30" height="14" rx="4" fill="rgba(255,255,255,0.2)" stroke="rgba(255,255,255,0.5)" strokeWidth="1" />
      <text x="195" y="31.5" textAnchor="middle" fontSize="5.5" fill="white" fontWeight="600" fontFamily="system-ui,sans-serif">Get started</text>
      {/* Content */}
      <rect x="12" y="64" width="110" height="5" rx="1.5" fill="#ddd6fe" />
      <rect x="12" y="71" width="75" height="4" rx="1" fill="#ede9fe" />
    </svg>
  )
}

function HeaderMinimalThumb() {
  return (
    <svg viewBox="0 0 220 80" fill="none" style={{ width: '100%', height: '100%' }}>
      <rect width="220" height="80" fill="#ffffff" />
      <rect width="220" height="1" y="59" fill="#f3f4f6" />
      {/* Left nav */}
      <text x="16" y="34" fontSize="6.5" fill="#6b7280" fontFamily="system-ui,sans-serif">Features</text>
      <text x="50" y="34" fontSize="6.5" fill="#6b7280" fontFamily="system-ui,sans-serif">Pricing</text>
      {/* Center logo */}
      <LogoMark x={99} y={22} size={14} />
      <text x="117" y="33" fontSize="7" fontWeight="700" fill="#1d4ed8" fontFamily="system-ui,sans-serif">UI Builder</text>
      {/* Right */}
      <text x="158" y="34" fontSize="6.5" fill="#6b7280" fontFamily="system-ui,sans-serif">Sign in</text>
      <rect x="178" y="25" width="26" height="12" rx="3" fill="#111827" />
      <text x="191" y="33.5" textAnchor="middle" fontSize="5.5" fill="white" fontFamily="system-ui,sans-serif">Sign up</text>
      {/* Content */}
      <rect x="30" y="68" width="160" height="5" rx="1.5" fill="#f3f4f6" />
    </svg>
  )
}

function HeaderTransparentThumb() {
  return (
    <svg viewBox="0 0 220 80" fill="none" style={{ width: '100%', height: '100%' }}>
      <defs>
        <radialGradient id="htbg" cx="60%" cy="40%" r="70%"><stop offset="0%" stopColor="#e0e7ff" /><stop offset="100%" stopColor="#f5f3ff" /></radialGradient>
      </defs>
      <rect width="220" height="80" fill="url(#htbg)" />
      {/* Frosted bar */}
      <rect width="220" height="52" fill="rgba(255,255,255,0.65)" />
      <rect width="220" height="1" y="51" fill="rgba(229,231,235,0.6)" />
      {/* Logo */}
      <LogoMark x={12} y={18} size={15} />
      <text x="31" y="30" fontSize="7.5" fontWeight="700" fill="#1d4ed8" fontFamily="system-ui,sans-serif">UI Builder</text>
      {/* Nav */}
      <text x="76" y="30" fontSize="6.5" fill="#374151" fontFamily="system-ui,sans-serif">Features</text>
      <text x="106" y="30" fontSize="6.5" fill="#374151" fontFamily="system-ui,sans-serif">Solutions</text>
      <text x="137" y="30" fontSize="6.5" fill="#374151" fontFamily="system-ui,sans-serif">Pricing</text>
      <text x="163" y="30" fontSize="6.5" fill="#374151" fontFamily="system-ui,sans-serif">Resources</text>
      {/* CTA */}
      <rect x="182" y="20" width="28" height="13" rx="4" fill="url(#hdg1)" />
      <text x="196" y="29" textAnchor="middle" fontSize="5" fill="white" fontWeight="600" fontFamily="system-ui,sans-serif">Try free</text>
      {/* Content below */}
      <rect x="20" y="60" width="130" height="6" rx="2" fill="rgba(79,70,229,0.15)" />
      <rect x="40" y="69" width="90" height="4" rx="1.5" fill="rgba(79,70,229,0.08)" />
    </svg>
  )
}

function HeaderEnterpriseThumb() {
  return (
    <svg viewBox="0 0 220 80" fill="none" style={{ width: '100%', height: '100%' }}>
      <rect width="220" height="80" fill="#09090b" />
      <rect width="220" height="1" y="53" fill="rgba(255,255,255,0.06)" />
      <rect x="0" y="53" width="220" height="27" fill="#040407" />
      {/* Logo */}
      <LogoMark x={12} y={19} size={14} dark />
      <text x="30" y="30" fontSize="7" fontWeight="700" fill="#e4e4e7" fontFamily="system-ui,sans-serif">UI Builder</text>
      {/* Badge */}
      <rect x="74" y="22" width="34" height="10" rx="2.5" fill="rgba(167,139,250,0.12)" stroke="rgba(167,139,250,0.25)" strokeWidth="0.7" />
      <text x="91" y="29.5" textAnchor="middle" fontSize="4.5" fill="#a78bfa" fontWeight="700" fontFamily="system-ui,sans-serif" letterSpacing="0.06em">ENTERPRISE</text>
      {/* Nav */}
      <text x="118" y="30" fontSize="6" fill="#71717a" fontFamily="system-ui,sans-serif">Platform</text>
      <text x="141" y="30" fontSize="6" fill="#71717a" fontFamily="system-ui,sans-serif">Security</text>
      <text x="164" y="30" fontSize="6" fill="#71717a" fontFamily="system-ui,sans-serif">Pricing</text>
      {/* CTAs */}
      <rect x="182" y="21" width="14" height="11" rx="2.5" fill="transparent" stroke="rgba(255,255,255,0.15)" strokeWidth="0.8" />
      <text x="189" y="29" textAnchor="middle" fontSize="4" fill="#e4e4e7" fontFamily="system-ui,sans-serif">Sales</text>
      <rect x="198" y="21" width="10" height="11" rx="2.5" fill="#4f46e5" />
      <text x="203" y="29" textAnchor="middle" fontSize="4" fill="white" fontFamily="system-ui,sans-serif">Demo</text>
      {/* Content */}
      <rect x="12" y="60" width="80" height="5" rx="1.5" fill="rgba(255,255,255,0.06)" />
      <rect x="12" y="67" width="50" height="4" rx="1" fill="rgba(255,255,255,0.04)" />
    </svg>
  )
}



// ─── PPC Thumbnails ───────────────────────────────────────────────────────────

function PpcStellarUtahThumb() {
  return (
    <svg viewBox="0 0 280 160" xmlns="http://www.w3.org/2000/svg" style={{ width: '100%', height: '100%' }}>
      <defs>
        <radialGradient id="tp-ppc-hero" cx="50%" cy="40%" r="60%">
          <stop offset="0%" stopColor="#4719c9" stopOpacity="0.25"/>
          <stop offset="100%" stopColor="#02040a" stopOpacity="0"/>
        </radialGradient>
        <linearGradient id="tp-ppc-fade" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#02040a" stopOpacity="0.2"/>
          <stop offset="80%" stopColor="#02040a" stopOpacity="0.85"/>
          <stop offset="100%" stopColor="#02040a" stopOpacity="1"/>
        </linearGradient>
      </defs>
      <rect width="280" height="62" fill="#02040a"/>
      <rect width="280" height="62" fill="url(#tp-ppc-hero)"/>
      <rect width="280" height="62" fill="url(#tp-ppc-fade)"/>
      {([
        [12,4],[42,7],[88,3],[130,9],[172,4],[218,6],[260,10],
        [28,18],[64,14],[105,22],[150,11],[195,19],[245,15],
        [18,30],[55,26],[98,33],[142,25],[188,28],[252,22],
        [35,44],[78,39],[120,48],[165,38],[208,44],[268,35],
      ] as [number,number][]).map(([x,y], i) => (
        <circle key={i} cx={x} cy={y} r={i%5===0?1.1:0.6} fill="white" opacity={i%3===0?0.9:0.45}/>
      ))}
      <rect width="280" height="11" fill="rgba(10,14,20,0.85)"/>
      <text x="10" y="7.5" fontFamily="serif" fontSize="5" fill="#c3c6d2">Stellar Utah</text>
      <rect x="228" y="2.5" width="42" height="6" rx="1.5" fill="none" stroke="#7d5fff" strokeWidth="0.5"/>
      <text x="249" y="7" fontFamily="sans-serif" fontSize="3.5" fill="#dfe2eb" textAnchor="middle" letterSpacing="0.5">BOOK ESCAPE</text>
      <text x="140" y="33" fontFamily="serif" fontSize="10" fontWeight="400" fill="#dfe2eb" textAnchor="middle" letterSpacing="0.5">Reconnect with the Infinite</text>
      <text x="140" y="43" fontFamily="sans-serif" fontSize="4" fill="#909096" textAnchor="middle" letterSpacing="1">WELCOME TO THE ABYSS</text>
      <rect x="72" y="48" width="52" height="7" rx="1.5" fill="none" stroke="rgba(195,198,210,0.4)" strokeWidth="0.5"/>
      <text x="98" y="53.5" fontFamily="sans-serif" fontSize="3" fill="#dfe2eb" textAnchor="middle">EXPLORE THE VOID</text>
      <rect x="130" y="48" width="78" height="7" rx="1.5" fill="none" stroke="rgba(195,198,210,0.4)" strokeWidth="0.5"/>
      <text x="169" y="53.5" fontFamily="sans-serif" fontSize="3" fill="#dfe2eb" textAnchor="middle">VIEW CELESTIAL CALENDAR</text>
      <rect width="280" height="34" y="62" fill="#10141a"/>
      <text x="8" y="76" fontFamily="serif" fontSize="7" fill="#dfe2eb">The Experience</text>
      <rect x="148" y="64" width="126" height="30" rx="3" fill="#1c2026" stroke="rgba(195,198,210,0.2)" strokeWidth="0.5"/>
      <rect width="280" height="36" y="96" fill="#0a0e14"/>
      <text x="140" y="103" fontFamily="serif" fontSize="6.5" fill="#dfe2eb" textAnchor="middle">The Bortle 1 Standard</text>
      <rect x="6" y="105" width="150" height="12" rx="2" fill="rgba(16,20,26,0.7)" stroke="rgba(195,198,210,0.15)" strokeWidth="0.5"/>
      <text x="12" y="113" fontFamily="serif" fontSize="5" fill="#dfe2eb">Absolute Void</text>
      <rect x="162" y="105" width="112" height="12" rx="2" fill="rgba(16,20,26,0.4)" stroke="rgba(195,198,210,0.15)" strokeWidth="0.5"/>
      <text x="218" y="110" fontFamily="serif" fontSize="10" fill="#dfe2eb" textAnchor="middle" fontWeight="300">01</text>
      <text x="218" y="115" fontFamily="sans-serif" fontSize="2.5" fill="#cabeff" textAnchor="middle">BORTLE CLASS</text>
      <rect width="280" height="22" y="132" fill="#10141a"/>
      <text x="8" y="146" fontFamily="serif" fontSize="6.5" fill="#dfe2eb">Luxury Dwellings</text>
      <rect width="280" height="6" y="154" fill="#0a0e14"/>
      <text x="8" y="158.5" fontFamily="sans-serif" fontSize="2.5" fill="#c6c6cb" opacity="0.5">Stellar Utah  ·  Dark Sky Certified  ·  High Desert Luxury</text>
    </svg>
  )
}

function PpcNoirFashionThumb() {
  return (
    <svg viewBox="0 0 280 160" xmlns="http://www.w3.org/2000/svg" style={{width:'100%',height:'100%'}}>
      <defs>
        <linearGradient id="tp-noir-v3" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#1a1614" stopOpacity="0.1"/>
          <stop offset="55%" stopColor="#0A0908" stopOpacity="0.55"/>
          <stop offset="100%" stopColor="#0A0908" stopOpacity="0.95"/>
        </linearGradient>
      </defs>
      {/* bg */}
      <rect width="280" height="160" fill="#0A0908"/>

      {/* announcement bar */}
      <rect width="280" height="6" fill="#C9A96E"/>
      <text x="140" y="4.5" fontFamily="sans-serif" fontSize="2.5" fill="#0A0908" textAnchor="middle" fontWeight="700" letterSpacing="1.5">30% OFF SITEWIDE — USE CODE NOIR30  ·  FREE SHIPPING OVER $150</text>

      {/* nav */}
      <rect y="6" width="280" height="13" fill="#111010"/>
      <line x1="0" y1="19" x2="280" y2="19" stroke="#222" strokeWidth="0.5"/>
      <text x="14" y="14.5" fontFamily="sans-serif" fontSize="8" fill="#F5F0E8" fontWeight="800" letterSpacing="1">NOIR.</text>
      <text x="100" y="14" fontFamily="sans-serif" fontSize="3" fill="#6b6660" letterSpacing="1.2">WOMEN  MEN  NEW IN  SALE</text>
      <text x="258" y="14" fontFamily="sans-serif" fontSize="7" fill="#F5F0E8" textAnchor="end">🔍 🛒</text>

      {/* hero image */}
      <rect y="19" width="280" height="64" fill="#2a2420"/>
      <ellipse cx="200" cy="38" rx="30" ry="42" fill="#1e1a17" opacity="0.6"/>
      <rect x="175" y="48" width="48" height="36" fill="#1e1a17" opacity="0.5"/>
      <rect y="19" width="280" height="64" fill="url(#tp-noir-v3)"/>
      {/* hero text */}
      <text x="14" y="38" fontFamily="sans-serif" fontSize="3.5" fill="#C9A96E" letterSpacing="2" fontWeight="700">NEW SEASON JUST DROPPED</text>
      <text x="13" y="52" fontFamily="sans-serif" fontSize="14" fill="#fff" fontWeight="800" letterSpacing="-0.5">Own The Night.</text>
      <text x="13" y="63" fontFamily="sans-serif" fontSize="5.5" fill="rgba(245,240,232,0.55)">AW 2025 Collection</text>
      {/* hero CTAs */}
      <rect x="13" y="67" width="38" height="10" fill="#C9A96E" rx="1"/>
      <text x="32" y="74" fontFamily="sans-serif" fontSize="3" fill="#0A0908" textAnchor="middle" fontWeight="700" letterSpacing="1">SHOP NEW IN</text>
      <rect x="55" y="67" width="30" height="10" fill="transparent" rx="1" stroke="rgba(245,240,232,0.4)" strokeWidth="0.7"/>
      <text x="70" y="74" fontFamily="sans-serif" fontSize="3" fill="#F5F0E8" textAnchor="middle" fontWeight="600" letterSpacing="0.8">SHOP SALE</text>

      {/* product grid — 4 cards */}
      <rect y="83" width="280" height="52" fill="#0D0C0B"/>
      <text x="10" y="91" fontFamily="sans-serif" fontSize="4" fill="#F5F0E8" fontWeight="700">New Arrivals</text>
      <text x="265" y="91" fontFamily="sans-serif" fontSize="3" fill="#C9A96E" textAnchor="end">View All →</text>
      {/* card 1 */}
      <rect x="8" y="94" width="58" height="30" fill="#1a1816" rx="1"/>
      <rect x="8" y="94" width="58" height="20" fill="#252019"/>
      <text x="37" y="121" fontFamily="sans-serif" fontSize="3" fill="#F5F0E8" textAnchor="middle">Leather Jacket</text>
      <text x="37" y="126" fontFamily="sans-serif" fontSize="3" fill="#C9A96E" textAnchor="middle" fontWeight="700">$249</text>
      {/* card 2 */}
      <rect x="72" y="94" width="58" height="30" fill="#1a1816" rx="1"/>
      <rect x="72" y="94" width="58" height="20" fill="#1e1c18"/>
      <text x="101" y="121" fontFamily="sans-serif" fontSize="3" fill="#F5F0E8" textAnchor="middle">Ribbed Dress</text>
      <text x="101" y="126" fontFamily="sans-serif" fontSize="3" fill="#C9A96E" textAnchor="middle" fontWeight="700">$89</text>
      {/* card 3 */}
      <rect x="136" y="94" width="58" height="30" fill="#1a1816" rx="1"/>
      <rect x="136" y="94" width="58" height="20" fill="#201e1a"/>
      <text x="165" y="121" fontFamily="sans-serif" fontSize="3" fill="#F5F0E8" textAnchor="middle">Power Blazer</text>
      <text x="165" y="126" fontFamily="sans-serif" fontSize="3" fill="#C9A96E" textAnchor="middle" fontWeight="700">$175</text>
      {/* card 4 */}
      <rect x="200" y="94" width="72" height="30" fill="#1a1816" rx="1"/>
      <rect x="200" y="94" width="72" height="20" fill="#1e1b17"/>
      <text x="236" y="121" fontFamily="sans-serif" fontSize="3" fill="#F5F0E8" textAnchor="middle">Satin Trousers</text>
      <text x="236" y="126" fontFamily="sans-serif" fontSize="3" fill="#C9A96E" textAnchor="middle" fontWeight="700">$119</text>

      {/* trust bar */}
      <rect y="135" width="280" height="14" fill="#141210"/>
      <line x1="0" y1="135" x2="280" y2="135" stroke="#1E1B17" strokeWidth="0.5"/>
      <text x="35" y="143.5" fontFamily="sans-serif" fontSize="3" fill="#827D76" textAnchor="middle">🚚 Free Shipping</text>
      <text x="95" y="143.5" fontFamily="sans-serif" fontSize="3" fill="#827D76" textAnchor="middle">🔄 Free Returns</text>
      <text x="180" y="143.5" fontFamily="sans-serif" fontSize="3" fill="#827D76" textAnchor="middle">🔒 Secure Checkout</text>
      <text x="248" y="143.5" fontFamily="sans-serif" fontSize="3" fill="#827D76" textAnchor="middle">⭐ 50K+ Reviews</text>

      {/* footer */}
      <rect y="149" width="280" height="11" fill="#080807"/>
      <line x1="0" y1="149" x2="280" y2="149" stroke="#1E1B17" strokeWidth="0.5"/>
      <text x="140" y="156.5" fontFamily="sans-serif" fontSize="7" fill="#F5F0E8" textAnchor="middle" fontWeight="800" letterSpacing="1">NOIR.</text>
    </svg>
  )
}


const THUMB_MAP: Record<string, React.ReactNode> = {
  'banner-hero-gradient': <BannerGradientThumb />,
  'banner-dark-announcement': <BannerDarkThumb />,
  'banner-product-feature': <BannerProductThumb />,
  'cta-centered-dark': <CtaDarkThumb />,
  'cta-split-gradient': <CtaSplitThumb />,
  'cta-minimal-bordered': <CtaMinimalThumb />,
  'form-newsletter': <FormNewsletterThumb />,
  'form-contact': <FormContactThumb />,
  'form-waitlist': <FormWaitlistThumb />,
  'banner-3d-cosmic': <Banner3DThumb />,
  'banner-morph-creative': <BannerMorphThumb />,
  'banner-ticker-dark': <BannerTickerThumb />,
  'banner-split-3d': <BannerSplitThumb />,
  'banner-glass-hero': <BannerGlassThumb />,
  'banner-neon-glow': <BannerNeonThumb />,
  'banner-aurora-sky': <BannerAuroraThumb />,
  'banner-retro-wave': <BannerRetroThumb />,
  'banner-particle-net': <BannerParticleThumb />,
  'header-classic-light': <HeaderClassicThumb />,
  'header-dark-pro': <HeaderDarkThumb />,
  'header-gradient-brand': <HeaderGradientThumb />,
  'header-minimal-center': <HeaderMinimalThumb />,
  'header-saas-transparent': <HeaderTransparentThumb />,
  'header-enterprise-dark': <HeaderEnterpriseThumb />,
  'ppc-stellar-utah':         <PpcStellarUtahThumb />,
  'ppc-noir-fashion':          <PpcNoirFashionThumb />,
}

const CATEGORY_COLORS: Record<string, { bg: string; color: string }> = {
  banner: { bg: '#eff6ff', color: '#2563eb' },
  cta: { bg: '#f0fdf4', color: '#16a34a' },
  form: { bg: '#fdf4ff', color: '#9333ea' },
  header: { bg: '#fff7ed', color: '#ea580c' },
  ppc:    { bg: '#1a1030', color: '#cabeff' },
}

// ─── KPI chart items ──────────────────────────────────────────────────────────

interface ChartItem {
  label: string
  type: string
  icon: React.ReactNode
}

const KPI_ITEMS: ChartItem[] = [
  {
    label: 'Bar Chart', type: 'chart-bar',
    icon: <svg width="22" height="22" viewBox="0 0 22 22" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M3 18h16" /><rect x="4" y="8" width="3" height="10" rx="1" /><rect x="9" y="5" width="3" height="13" rx="1" /><rect x="14" y="11" width="3" height="7" rx="1" /></svg>,
  },
  {
    label: 'Line Chart', type: 'chart-line',
    icon: <svg width="22" height="22" viewBox="0 0 22 22" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M3 18h16" /><path d="M3 14l4-5 4 3 4-6 4 2" /></svg>,
  },
  {
    label: 'Area Chart', type: 'chart-area',
    icon: <svg width="22" height="22" viewBox="0 0 22 22" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M3 18h16" /><path d="M3 15l4-5 4 3 4-6 4 2v9H3z" fill="currentColor" fillOpacity="0.15" /></svg>,
  },
  {
    label: 'Pie Chart', type: 'chart-pie',
    icon: <svg width="22" height="22" viewBox="0 0 22 22" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8" /><path d="M11 11L11 3" /><path d="M11 11L18.2 15" /></svg>,
  },
  {
    label: 'Donut Chart', type: 'chart-donut',
    icon: <svg width="22" height="22" viewBox="0 0 22 22" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"><circle cx="11" cy="11" r="8" /><circle cx="11" cy="11" r="4" /></svg>,
  },
  {
    label: 'Radar Chart', type: 'chart-radar',
    icon: <svg width="22" height="22" viewBox="0 0 22 22" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><polygon points="11,2 20,8 17,18 5,18 2,8" /><polygon points="11,6 16,9.5 14,16 8,16 6,9.5" fill="currentColor" fillOpacity="0.15" /></svg>,
  },
  {
    label: 'Polar Area', type: 'chart-polar',
    icon: <svg width="22" height="22" viewBox="0 0 22 22" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"><circle cx="11" cy="11" r="8" /><line x1="11" y1="3" x2="11" y2="19" /><line x1="3" y1="11" x2="19" y2="11" /><line x1="5.3" y1="5.3" x2="16.7" y2="16.7" /><line x1="16.7" y1="5.3" x2="5.3" y2="16.7" /></svg>,
  },
  {
    label: 'Scatter Plot', type: 'chart-scatter',
    icon: <svg width="22" height="22" viewBox="0 0 22 22" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"><path d="M3 18h16M3 3v16" /><circle cx="6" cy="14" r="1.5" fill="currentColor" /><circle cx="9" cy="9" r="1.5" fill="currentColor" /><circle cx="13" cy="12" r="1.5" fill="currentColor" /><circle cx="16" cy="7" r="1.5" fill="currentColor" /><circle cx="7" cy="17" r="1.5" fill="currentColor" /></svg>,
  },
  {
    label: 'Gauge', type: 'chart-gauge',
    icon: <svg width="22" height="22" viewBox="0 0 22 22" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"><path d="M4 16a8 8 0 0 1 14 0" /><path d="M11 16l-3-5" strokeWidth="2" /></svg>,
  },
]

// ─── Hover tooltip preview ────────────────────────────────────────────────────

interface TooltipPreviewProps {
  tpl: (typeof TEMPLATES)[0]
  anchorRect: DOMRect
}

function TooltipPreview({ tpl, anchorRect }: TooltipPreviewProps) {
  const catStyle = CATEGORY_COLORS[tpl.category]
  const tooltipWidth = 300
  const viewportWidth = typeof window !== 'undefined' ? window.innerWidth : 1200
  const left = anchorRect.right + 8
  const adjustedLeft = left + tooltipWidth > viewportWidth ? anchorRect.left - tooltipWidth - 8 : left
  const top = Math.min(anchorRect.top, (typeof window !== 'undefined' ? window.innerHeight : 800) - 220)

  return (
    <div
      style={{
        position: 'fixed',
        left: adjustedLeft,
        top: Math.max(8, top),
        width: tooltipWidth,
        zIndex: 9999,
        pointerEvents: 'none',
        borderRadius: 12,
        overflow: 'hidden',
        border: '1px solid var(--color-border)',
        boxShadow: '0 16px 48px rgba(0,0,0,0.28)',
        background: 'var(--color-bg)',
        animation: 'bp-fade-in 120ms ease forwards',
      }}
    >
      <div style={{ width: '100%', height: 130, overflow: 'hidden', backgroundColor: '#111', position: 'relative' }}>
        <div style={{ width: '100%', height: '100%' }}>
          {THUMB_MAP[tpl.id] ?? (
            <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#666" strokeWidth="1.5"><rect x="3" y="3" width="18" height="18" rx="2" /><path d="M3 9h18M9 9v12" /></svg>
            </div>
          )}
        </div>
        {tpl.animated && (
          <div style={{
            position: 'absolute', bottom: 6, left: 6,
            padding: '2px 7px', borderRadius: 8, fontSize: '0.58rem',
            fontWeight: 700, background: 'linear-gradient(90deg,#6366f1,#a855f7)', color: '#fff',
          }}>✦ ANIMATED</div>
        )}
      </div>
      <div style={{ padding: '10px 12px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 4 }}>
          <span style={{
            fontSize: '0.6rem', fontWeight: 700, padding: '2px 6px', borderRadius: 20,
            backgroundColor: catStyle.bg, color: catStyle.color, textTransform: 'capitalize',
          }}>{tpl.category}</span>
          <span style={{ fontSize: '0.8125rem', fontWeight: 700, color: 'var(--color-text-primary)' }}>{tpl.label}</span>
        </div>
        <p style={{ margin: 0, fontSize: '0.72rem', color: 'var(--color-text-secondary)', lineHeight: 1.4 }}>{tpl.desc}</p>
      </div>
    </div>
  )
}

// ─── KPI chart grid ───────────────────────────────────────────────────────────

function ChartGrid() {
  const quickAddElement = useBuilderStore((s) => s.quickAddElement)

  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 8 }}>
      {KPI_ITEMS.map((item) => (
        <div
          key={item.type}
          draggable
          title={`Click or drag to add ${item.label}`}
          onClick={() => {
            const content = defaultContentForType(item.type)
            if (content) quickAddElement(content)
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
            gap: 6,
            padding: '10px 4px 8px',
            borderRadius: 8,
            border: '1px solid var(--color-border)',
            backgroundColor: 'var(--color-bg)',
            cursor: 'grab',
            userSelect: 'none',
            minHeight: 64,
            transition: 'border-color 0.15s, box-shadow 0.15s, background-color 0.15s',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.borderColor = 'var(--color-primary)'
            e.currentTarget.style.backgroundColor = 'var(--color-selected)'
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.borderColor = 'var(--color-border)'
            e.currentTarget.style.backgroundColor = 'var(--color-bg)'
          }}
        >
          <span style={{ color: 'var(--color-text-secondary)', display: 'flex', pointerEvents: 'none' }}>
            {item.icon}
          </span>
          <span style={{ fontSize: '0.6875rem', color: 'var(--color-text-secondary)', fontWeight: 500, textAlign: 'center', lineHeight: 1.2, pointerEvents: 'none' }}>
            {item.label}
          </span>
        </div>
      ))}
    </div>
  )
}

// ─── Web templates list ───────────────────────────────────────────────────────

type WebCategory = 'all' | 'banner' | 'cta' | 'form' | 'header' | 'ppc'

const WEB_CATEGORIES: { label: string; value: WebCategory }[] = [
  { label: 'All', value: 'all' },
  { label: 'Header', value: 'header' },
  { label: 'Banner', value: 'banner' },
  { label: 'CTA', value: 'cta' },
  { label: 'Form', value: 'form' },
  { label: 'PPC',  value: 'ppc'  },
]

function WebTemplatesTab() {
  const insertTemplate = useBuilderStore((s) => s.insertTemplate)
  const [activeCategory, setActiveCategory] = useState<WebCategory>('all')
  const [inserting, setInserting] = useState<string | null>(null)
  const [tooltip, setTooltip] = useState<{ tpl: (typeof TEMPLATES)[0]; rect: DOMRect } | null>(null)
  const hideTimer = useRef<ReturnType<typeof setTimeout> | null>(null)

  const ALL_TEMPLATES = TEMPLATES.find(t => t.id === 'ppc-noir-fashion')
    ? TEMPLATES
    : [...TEMPLATES, NOIR_FASHION_TEMPLATE]

  const filtered = activeCategory === 'all'
    ? ALL_TEMPLATES
    : ALL_TEMPLATES.filter((t) => t.category === activeCategory)

  function handleInsert(templateId: string) {
    const tpl = ALL_TEMPLATES.find((t) => t.id === templateId)
    if (!tpl) return
    setInserting(templateId)
    insertTemplate(materializeTemplate(tpl.section ?? tpl.sections?.[0]!))
    setTimeout(() => setInserting(null), 800)
  }

  function showTooltip(e: React.MouseEvent, tpl: (typeof TEMPLATES)[0]) {
    if (hideTimer.current) clearTimeout(hideTimer.current)
    const rect = (e.currentTarget as HTMLElement).getBoundingClientRect()
    setTooltip({ tpl, rect })
  }

  function hideTooltip() {
    hideTimer.current = setTimeout(() => setTooltip(null), 80)
  }

  return (
    <>
      {/* Category filter pills */}
      <div style={{ padding: '8px 12px', borderBottom: '1px solid var(--color-border)', display: 'flex', gap: 4, flexWrap: 'wrap', flexShrink: 0 }}>
        {WEB_CATEGORIES.map((cat) => {
          const active = activeCategory === cat.value
          return (
            <button
              key={cat.value}
              onClick={() => setActiveCategory(cat.value)}
              style={{
                height: 24, padding: '0 10px', borderRadius: 4,
                border: active ? '1px solid var(--color-primary)' : '1px solid var(--color-border)',
                backgroundColor: active ? 'var(--color-selected)' : 'transparent',
                color: active ? 'var(--color-primary)' : 'var(--color-text-secondary)',
                fontSize: '0.7rem', fontWeight: active ? 600 : 400, cursor: 'pointer', whiteSpace: 'nowrap',
              }}
            >
              {cat.label}
            </button>
          )
        })}
      </div>

      {/* Template list */}
      <div style={{ flex: 1, minHeight: 0, overflowY: 'auto', padding: 12, display: 'flex', flexDirection: 'column', gap: 10 }}>
        {filtered.map((tpl) => {
          const catStyle = CATEGORY_COLORS[tpl.category]
          const isInserting = inserting === tpl.id
          return (
            <div
              key={tpl.id}
              style={{
                borderRadius: 10, border: '1px solid var(--color-border)',
                overflow: 'hidden', flexShrink: 0,
                transition: 'box-shadow 150ms ease, transform 150ms ease',
              }}
              onMouseEnter={(e) => {
                ;(e.currentTarget as HTMLDivElement).style.boxShadow = '0 4px 16px rgba(0,0,0,0.1)'
                ;(e.currentTarget as HTMLDivElement).style.transform = 'translateY(-1px)'
              }}
              onMouseLeave={(e) => {
                ;(e.currentTarget as HTMLDivElement).style.boxShadow = 'none'
                ;(e.currentTarget as HTMLDivElement).style.transform = 'none'
              }}
            >
              <div
                draggable
                onDragStart={(e) => {
                  e.dataTransfer.effectAllowed = 'copyMove'
                  e.dataTransfer.setData(DND_TYPE, encodeDragPayload({ type: 'template', templateId: tpl.id }))
                  setTooltip(null)
                }}
                onMouseEnter={(e) => showTooltip(e, tpl)}
                onMouseLeave={hideTooltip}
                title="Drag to canvas"
                style={{ height: 80, overflow: 'hidden', position: 'relative', backgroundColor: 'var(--color-border)', cursor: 'grab' }}
              >
                {tpl.animated && (
                  <div style={{
                    position: 'absolute', top: 6, right: 6, zIndex: 2,
                    padding: '2px 7px', borderRadius: 10, fontSize: '0.6rem',
                    fontWeight: 700, letterSpacing: '0.06em',
                    background: 'linear-gradient(90deg,#6366f1,#a855f7)', color: '#fff',
                    boxShadow: '0 2px 8px rgba(99,102,241,0.4)', pointerEvents: 'none',
                  }}>✦ ANIMATED</div>
                )}
                {THUMB_MAP[tpl.id] ?? (
                  <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="var(--color-text-secondary)" strokeWidth="1.5" strokeLinecap="round"><rect x="3" y="3" width="18" height="18" rx="2" /><path d="M3 9h18M9 9v12" /></svg>
                  </div>
                )}
              </div>

              <div style={{ padding: '9px 12px', backgroundColor: 'var(--color-bg)' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 6 }}>
                  <div style={{ minWidth: 0 }}>
                    <p style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--color-text-primary)', margin: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {tpl.label}
                    </p>
                    <p style={{ fontSize: '0.68rem', color: 'var(--color-text-secondary)', margin: '1px 0 0', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {tpl.desc}
                    </p>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 5, flexShrink: 0 }}>
                    <span style={{
                      fontSize: '0.6rem', fontWeight: 600, padding: '2px 6px', borderRadius: 20,
                      backgroundColor: catStyle.bg, color: catStyle.color, textTransform: 'capitalize',
                    }}>{tpl.category}</span>
                    <button
                      onClick={(e) => { e.stopPropagation(); handleInsert(tpl.id) }}
                      disabled={isInserting}
                      title="Insert onto canvas"
                      style={{
                        height: 24, padding: '0 9px', borderRadius: 5, border: 'none',
                        backgroundColor: isInserting ? 'var(--color-border)' : 'var(--color-primary)',
                        color: isInserting ? 'var(--color-text-secondary)' : '#fff',
                        fontSize: '0.68rem', fontWeight: 700,
                        cursor: isInserting ? 'default' : 'pointer',
                        transition: 'background 150ms', whiteSpace: 'nowrap',
                      }}
                    >
                      {isInserting ? '✓ Added' : '+ Insert'}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )
        })}

        {filtered.length === 0 && (
          <p style={{ textAlign: 'center', color: 'var(--color-text-secondary)', fontSize: '0.8rem', marginTop: 24 }}>
            No templates in this category yet.
          </p>
        )}
      </div>

      {tooltip && <TooltipPreview tpl={tooltip.tpl} anchorRect={tooltip.rect} />}
    </>
  )
}

// ─── KPI tab content ──────────────────────────────────────────────────────────

function KpiTab() {
  return (
    <div style={{ flex: 1, minHeight: 0, overflowY: 'auto', padding: '12px 12px 16px' }}>
      <ChartGrid />
      <div style={{ marginTop: 20, padding: '12px 14px', borderRadius: 8, backgroundColor: 'rgba(79,70,229,0.06)', border: '1px solid rgba(79,70,229,0.15)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 6 }}>
          <svg width="13" height="13" viewBox="0 0 13 13" fill="none" stroke="var(--color-primary)" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round">
            <path d="M6.5 1v2M6.5 10v2M1 6.5h2M10 6.5h2M2.9 2.9l1.4 1.4M8.7 8.7l1.4 1.4M2.9 10.1l1.4-1.4M8.7 4.3l1.4-1.4" />
          </svg>
          <span style={{ fontSize: '0.6875rem', fontWeight: 700, color: 'var(--color-primary)', letterSpacing: '0.02em' }}>Tip</span>
        </div>
        <p style={{ fontSize: '0.75rem', color: 'var(--color-text-secondary)', margin: 0, lineHeight: 1.5 }}>
          Charts use sample data by default. Use the props panel to edit data, upload CSV/JSON, or connect an API.
        </p>
      </div>
    </div>
  )
}

// ─── Dashboard Templates Tab ──────────────────────────────────────────────────

function DashboardTemplatesTab() {
  function handleLoadSales() {
    if (!confirm('Switch to Dashboard mode and load the Sales Dashboard template? Current canvas will remain saved.')) return
    const tpl = getSalesDashboard()
    useDashboardStore.getState().loadTemplate(tpl)
    useBuilderStore.setState({ isDashboardMode: true })
  }

  return (
    <div style={{ flex: 1, minHeight: 0, overflowY: 'auto', padding: '12px 12px 16px' }}>
      <p style={{ margin: '0 0 12px', fontSize: '0.75rem', color: 'var(--color-text-secondary)', lineHeight: 1.5 }}>
        Dashboard templates switch the canvas to Dashboard mode with pre-built widgets and sample data.
      </p>

      {/* Sales Dashboard card */}
      <div
        onClick={handleLoadSales}
        style={{
          borderRadius: 10, border: '1px solid var(--color-border)',
          overflow: 'hidden', cursor: 'pointer', transition: 'box-shadow 150ms, border-color 150ms',
        }}
        onMouseEnter={e => { (e.currentTarget as HTMLDivElement).style.borderColor = 'var(--color-primary)'; (e.currentTarget as HTMLDivElement).style.boxShadow = '0 4px 16px rgba(79,70,229,0.15)' }}
        onMouseLeave={e => { (e.currentTarget as HTMLDivElement).style.borderColor = 'var(--color-border)'; (e.currentTarget as HTMLDivElement).style.boxShadow = 'none' }}
      >
        {/* Thumbnail */}
        <div style={{ height: 80, background: 'linear-gradient(135deg, #1e1b4b 0%, #0f172a 100%)', padding: 10, display: 'flex', gap: 6, alignItems: 'flex-end' }}>
          {/* Mini KPI cards */}
          {['#6366f1','#f59e0b','#10b981','#3b82f6'].map((c, i) => (
            <div key={i} style={{ flex: 1, height: 36, borderRadius: 5, backgroundColor: 'rgba(255,255,255,0.07)', border: `1px solid ${c}40`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <div style={{ width: '60%', height: 4, borderRadius: 2, backgroundColor: c, opacity: 0.8 }} />
            </div>
          ))}
        </div>
        {/* Bottom bar */}
        <div style={{ height: 20, background: 'linear-gradient(90deg, #1e1b4b 0%, #312e81 100%)', display: 'flex', alignItems: 'center', gap: 4, padding: '0 8px' }}>
          {['#6366f1','#10b981'].map((c,i) => (
            <div key={i} style={{ flex: i === 0 ? 3 : 2, height: 6, borderRadius: 2, backgroundColor: c, opacity: 0.6 }} />
          ))}
        </div>
        <div style={{ padding: '10px 12px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 4 }}>
            <span style={{ fontSize: '0.8125rem', fontWeight: 700, color: 'var(--color-text-primary)' }}>Sales Dashboard</span>
            <span style={{ fontSize: '0.65rem', fontWeight: 700, color: '#fff', backgroundColor: '#6366f1', borderRadius: 4, padding: '1px 6px' }}>NEW</span>
          </div>
          <p style={{ margin: 0, fontSize: '0.72rem', color: 'var(--color-text-secondary)', lineHeight: 1.45 }}>
            KPI cards, bar + line charts, data table. 12 months of sample revenue data included.
          </p>
          <div style={{ marginTop: 8, display: 'flex', gap: 4, flexWrap: 'wrap' }}>
            {['KPI Cards','Bar Chart','Line Chart','Data Table'].map(tag => (
              <span key={tag} style={{ fontSize: '0.6rem', padding: '2px 6px', borderRadius: 4, backgroundColor: 'rgba(99,102,241,0.1)', color: 'var(--color-primary)', fontWeight: 600 }}>{tag}</span>
            ))}
          </div>
        </div>
      </div>

      <div style={{ marginTop: 14, padding: '10px 12px', borderRadius: 8, backgroundColor: 'rgba(79,70,229,0.06)', border: '1px solid rgba(79,70,229,0.15)' }}>
        <p style={{ fontSize: '0.72rem', color: 'var(--color-text-secondary)', margin: 0, lineHeight: 1.5 }}>
          More dashboard templates coming soon. Start from scratch via the Pages panel → New blank dashboard.
        </p>
      </div>
    </div>
  )
}

// ─── Main panel ───────────────────────────────────────────────────────────────

const PANEL_TABS: { id: TabId; label: string; badge?: string }[] = [
  { id: 'web', label: 'Web Elements' },
  { id: 'dashboard', label: 'Dashboard', badge: 'NEW' },
]

export default function TemplatesPanel() {
  const [activeTab, setActiveTab] = useState<TabId>('web')

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', overflow: 'hidden' }}>

      {/* Vertical accordion tab switcher */}
      <div style={{ flexShrink: 0, borderBottom: '1px solid var(--color-border)' }}>
        {PANEL_TABS.map((t) => {
          const isActive = t.id === activeTab
          return (
            <button
              key={t.id}
              onClick={() => setActiveTab(t.id)}
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
                <span style={{ fontSize: '0.8rem', fontWeight: isActive ? 700 : 500, color: isActive ? 'var(--color-primary)' : 'var(--color-text-primary)' }}>
                  {t.label}
                </span>
                {t.badge && (
                  <span style={{
                    fontSize: '0.6rem', fontWeight: 700, color: '#fff',
                    backgroundColor: '#4f46e5', borderRadius: 4,
                    padding: '1px 5px', letterSpacing: '0.05em',
                  }}>
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

      {/* Tab content */}
      {activeTab === 'web' && <WebTemplatesTab />}
      {activeTab === 'dashboard' && <DashboardTemplatesTab />}
    </div>
  )
}
