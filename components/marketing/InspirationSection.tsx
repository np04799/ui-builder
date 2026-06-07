'use client'

import React, { useState, useEffect, useRef, useCallback } from 'react'
import { TEMPLATES, materializeTemplate } from '@/lib/templates'
import type { Template } from '@/lib/templates'
import type { BuilderMode } from '@/types/builder.types'
import type { BuilderStoreState } from '@/types/store.types'

export const INSPIRATION_PREVIEW_KEY = 'builderpro_inspiration_preview'

// ─── SVG Thumbnails (mirrored from TemplatesPanel — marketing context) ─────────

function BannerGradientThumb() {
  return (
    <svg viewBox="0 0 220 80" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ width: '100%', height: '100%' }}>
      <defs><linearGradient id="ig-bg1" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stopColor="#667eea" /><stop offset="100%" stopColor="#764ba2" /></linearGradient></defs>
      <rect width="220" height="80" fill="url(#ig-bg1)" />
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
      <defs><linearGradient id="ig-bg2" x1="0" y1="0" x2="1" y2="0"><stop offset="0%" stopColor="#4f46e5" /><stop offset="100%" stopColor="#7c3aed" /></linearGradient></defs>
      <rect width="220" height="80" fill="url(#ig-bg2)" />
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
      <defs><linearGradient id="ig-bg3" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#0f172a" /><stop offset="100%" stopColor="#1e1b4b" /></linearGradient></defs>
      <rect width="220" height="80" fill="url(#ig-bg3)" />
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
        <radialGradient id="ig-orb1" cx="50%" cy="50%" r="50%"><stop offset="0%" stopColor="#6366f1" stopOpacity="0.6" /><stop offset="100%" stopColor="#6366f1" stopOpacity="0" /></radialGradient>
        <radialGradient id="ig-orb2" cx="50%" cy="50%" r="50%"><stop offset="0%" stopColor="#a855f7" stopOpacity="0.5" /><stop offset="100%" stopColor="#a855f7" stopOpacity="0" /></radialGradient>
      </defs>
      <rect width="220" height="80" fill="#0a0a18" />
      <path d="M0 20h220M0 40h220M44 0v80M88 0v80M132 0v80" stroke="rgba(255,255,255,0.04)" strokeWidth="1" />
      <ellipse cx="30" cy="15" rx="60" ry="60" fill="url(#ig-orb1)" />
      <ellipse cx="190" cy="65" rx="50" ry="50" fill="url(#ig-orb2)" />
      <rect x="148" y="10" width="52" height="34" rx="5" fill="rgba(255,255,255,0.06)" stroke="rgba(255,255,255,0.12)" strokeWidth="0.8" transform="skewY(-4)" />
      <rect x="38" y="27" width="144" height="10" rx="3" fill="white" opacity="0.9" />
      <rect x="76" y="55" width="68" height="16" rx="8" fill="url(#ig-orb1)" />
    </svg>
  )
}
function BannerMorphThumb() {
  return (
    <svg viewBox="0 0 220 80" fill="none" style={{ width: '100%', height: '100%' }}>
      <defs>
        <radialGradient id="ig-blob1" cx="30%" cy="50%" r="60%"><stop offset="0%" stopColor="#f9a8d4" stopOpacity="0.7" /><stop offset="100%" stopColor="#a18cd1" stopOpacity="0" /></radialGradient>
        <radialGradient id="ig-blob2" cx="80%" cy="20%" r="50%"><stop offset="0%" stopColor="#a1c4fd" stopOpacity="0.5" /><stop offset="100%" stopColor="#c2e9fb" stopOpacity="0" /></radialGradient>
      </defs>
      <rect width="220" height="80" fill="#ffffff" />
      <ellipse cx="30" cy="40" rx="80" ry="70" fill="url(#ig-blob1)" />
      <ellipse cx="190" cy="10" rx="60" ry="55" fill="url(#ig-blob2)" />
      <rect x="16" y="30" width="108" height="10" rx="3" fill="#0f172a" opacity="0.9" />
      <rect x="16" y="62" width="72" height="14" rx="7" fill="#7c3aed" />
    </svg>
  )
}
function BannerTickerThumb() {
  return (
    <svg viewBox="0 0 220 80" fill="none" style={{ width: '100%', height: '100%' }}>
      <defs><linearGradient id="ig-shimmer" x1="0" y1="0" x2="1" y2="0"><stop offset="0%" stopColor="#6366f1" /><stop offset="50%" stopColor="#a855f7" /><stop offset="100%" stopColor="#06b6d4" /></linearGradient></defs>
      <rect width="220" height="80" fill="#0a0a18" />
      <rect x="70" y="8" width="80" height="11" rx="5.5" fill="url(#ig-shimmer)" />
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
        <radialGradient id="ig-glb1" cx="20%" cy="30%" r="60%"><stop offset="0%" stopColor="#6366f1" stopOpacity="0.5" /><stop offset="100%" stopColor="transparent" /></radialGradient>
        <radialGradient id="ig-glb2" cx="80%" cy="80%" r="50%"><stop offset="0%" stopColor="#ec4899" stopOpacity="0.4" /><stop offset="100%" stopColor="transparent" /></radialGradient>
      </defs>
      <rect width="220" height="80" fill="#16213e" />
      <ellipse cx="44" cy="24" rx="80" ry="60" fill="url(#ig-glb1)" />
      <ellipse cx="176" cy="64" rx="70" ry="55" fill="url(#ig-glb2)" />
      <rect x="40" y="12" width="140" height="56" rx="10" fill="rgba(255,255,255,0.06)" stroke="rgba(255,255,255,0.18)" strokeWidth="1" />
      <rect x="56" y="24" width="80" height="8" rx="3" fill="rgba(255,255,255,0.85)" />
      <rect x="64" y="36" width="64" height="5" rx="2" fill="rgba(255,255,255,0.4)" />
      <rect x="72" y="50" width="44" height="12" rx="6" fill="rgba(255,255,255,0.12)" stroke="rgba(255,255,255,0.3)" strokeWidth="1" />
    </svg>
  )
}
function BannerNeonThumb() {
  return (
    <svg viewBox="0 0 220 80" fill="none" style={{ width: '100%', height: '100%' }}>
      <rect width="220" height="80" fill="#050510" />
      <path d="M0 20h220M0 40h220M0 60h220M40 0v80M80 0v80M120 0v80M160 0v80M200 0v80" stroke="rgba(0,255,200,0.06)" strokeWidth="0.5" />
      <rect x="44" y="18" width="132" height="12" rx="3" fill="#fff" opacity="0.92" />
      <rect x="60" y="36" width="100" height="5" rx="2" fill="rgba(255,255,255,0.35)" />
      <rect x="68" y="50" width="84" height="18" rx="4" fill="transparent" stroke="rgba(0,255,200,0.7)" strokeWidth="1.2" />
      <rect x="78" y="55" width="64" height="7" rx="2" fill="rgba(0,255,200,0.6)" />
    </svg>
  )
}
function BannerAuroraThumb() {
  return (
    <svg viewBox="0 0 220 80" fill="none" style={{ width: '100%', height: '100%' }}>
      <defs>
        <radialGradient id="ig-aur1" cx="20%" cy="0%" r="70%"><stop offset="0%" stopColor="#00c896" stopOpacity="0.35" /><stop offset="100%" stopColor="transparent" /></radialGradient>
        <radialGradient id="ig-aur2" cx="80%" cy="0%" r="60%"><stop offset="0%" stopColor="#6428dc" stopOpacity="0.35" /><stop offset="100%" stopColor="transparent" /></radialGradient>
        <radialGradient id="ig-aur3" cx="50%" cy="0%" r="50%"><stop offset="0%" stopColor="#0096ff" stopOpacity="0.2" /><stop offset="100%" stopColor="transparent" /></radialGradient>
      </defs>
      <rect width="220" height="80" fill="#020818" />
      <ellipse cx="44" cy="0" rx="110" ry="60" fill="url(#ig-aur1)" />
      <ellipse cx="176" cy="0" rx="90" ry="50" fill="url(#ig-aur2)" />
      <ellipse cx="110" cy="0" rx="80" ry="40" fill="url(#ig-aur3)" />
      {[[18,18],[45,8],[82,22],[140,12],[170,20],[200,8]].map(([x,y],i) => (
        <circle key={i} cx={x} cy={y} r="1.2" fill="rgba(255,255,255,0.7)" />
      ))}
      <rect x="30" y="34" width="160" height="10" rx="3" fill="white" opacity="0.9" />
      <rect x="64" y="62" width="92" height="14" rx="7" fill="rgba(0,200,150,0.7)" />
    </svg>
  )
}
function BannerRetroThumb() {
  return (
    <svg viewBox="0 0 220 80" fill="none" style={{ width: '100%', height: '100%' }}>
      <defs>
        <linearGradient id="ig-retrobg" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#0d001a" /><stop offset="100%" stopColor="#2d0060" /></linearGradient>
        <linearGradient id="ig-sun" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#ff6b35" /><stop offset="100%" stopColor="#c837ab" /></linearGradient>
      </defs>
      <rect width="220" height="80" fill="url(#ig-retrobg)" />
      <path d="M70 80 A40 40 0 0 1 150 80 Z" fill="url(#ig-sun)" />
      <line x1="70" y1="65" x2="150" y2="65" stroke="#1a0035" strokeWidth="4" />
      <line x1="70" y1="71" x2="150" y2="71" stroke="#1a0035" strokeWidth="3" />
      <rect x="44" y="10" width="132" height="14" rx="3" fill="url(#ig-sun)" opacity="0.9" />
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
      {[[22,12,3,'#6366f1'],[77,55,2.5,'#8b5cf6'],[143,18,3.5,'#06b6d4'],[198,66,2,'#6366f1'],[55,40,2.5,'#8b5cf6']].map(([x,y,r,c],i) => (
        <circle key={i} cx={x as number} cy={y as number} r={r as number} fill={c as string} opacity="0.9" />
      ))}
      <rect x="38" y="24" width="144" height="10" rx="3" fill="rgba(199,210,254,0.9)" />
      <rect x="72" y="54" width="76" height="14" rx="7" fill="rgba(99,102,241,0.85)" />
    </svg>
  )
}
function HeaderClassicThumb() {
  return (
    <svg viewBox="0 0 220 80" fill="none" style={{ width: '100%', height: '100%' }}>
      <rect width="220" height="80" fill="#ffffff" />
      <rect width="220" height="1" y="55" fill="#e5e7eb" />
      <rect x="12" y="20" width="16" height="16" rx="3.5" fill="#dbeafe" />
      <text x="32" y="32" fontSize="8" fontWeight="700" fill="#1d4ed8" fontFamily="system-ui,sans-serif">UI Builder</text>
      <text x="78" y="32" fontSize="6.5" fill="#374151" fontFamily="system-ui,sans-serif">Products</text>
      <text x="108" y="32" fontSize="6.5" fill="#374151" fontFamily="system-ui,sans-serif">Templates</text>
      <text x="140" y="32" fontSize="6.5" fill="#374151" fontFamily="system-ui,sans-serif">Pricing</text>
      <rect x="186" y="23" width="24" height="13" rx="3.5" fill="#4f46e5" />
      <rect x="12" y="63" width="100" height="5" rx="1.5" fill="#d1d5db" />
    </svg>
  )
}
function HeaderDarkThumb() {
  return (
    <svg viewBox="0 0 220 80" fill="none" style={{ width: '100%', height: '100%' }}>
      <rect width="220" height="80" fill="#0f172a" />
      <rect width="220" height="1" y="55" fill="rgba(255,255,255,0.08)" />
      <rect x="12" y="20" width="15" height="15" rx="3.3" fill="rgba(255,255,255,0.12)" />
      <text x="31" y="32" fontSize="7.5" fontWeight="700" fill="#e2e8f0" fontFamily="system-ui,sans-serif">UI Builder</text>
      <text x="80" y="32" fontSize="6.5" fill="#64748b" fontFamily="system-ui,sans-serif">Features</text>
      <text x="109" y="32" fontSize="6.5" fill="#64748b" fontFamily="system-ui,sans-serif">Templates</text>
      <text x="141" y="32" fontSize="6.5" fill="#64748b" fontFamily="system-ui,sans-serif">Pricing</text>
      <rect x="185" y="23" width="26" height="13" rx="3" fill="#4f46e5" />
      <rect x="12" y="63" width="90" height="5" rx="1.5" fill="rgba(255,255,255,0.08)" />
    </svg>
  )
}
function HeaderGradientThumb() {
  return (
    <svg viewBox="0 0 220 80" fill="none" style={{ width: '100%', height: '100%' }}>
      <defs><linearGradient id="ig-hdg1" x1="0" y1="0" x2="1" y2="0"><stop offset="0%" stopColor="#4f46e5" /><stop offset="100%" stopColor="#7c3aed" /></linearGradient></defs>
      <rect width="220" height="80" fill="#f5f3ff" />
      <rect width="220" height="56" fill="url(#ig-hdg1)" />
      <text x="31" y="32" fontSize="7.5" fontWeight="700" fill="#fff" fontFamily="system-ui,sans-serif">UI Builder</text>
      <text x="78" y="32" fontSize="6.5" fill="rgba(255,255,255,0.8)" fontFamily="system-ui,sans-serif">Products</text>
      <text x="108" y="32" fontSize="6.5" fill="rgba(255,255,255,0.8)" fontFamily="system-ui,sans-serif">Templates</text>
      <rect x="180" y="22" width="30" height="14" rx="4" fill="rgba(255,255,255,0.2)" stroke="rgba(255,255,255,0.5)" strokeWidth="1" />
      <rect x="12" y="64" width="110" height="5" rx="1.5" fill="#ddd6fe" />
    </svg>
  )
}
function HeaderMinimalThumb() {
  return (
    <svg viewBox="0 0 220 80" fill="none" style={{ width: '100%', height: '100%' }}>
      <rect width="220" height="80" fill="#ffffff" />
      <rect width="220" height="1" y="59" fill="#f3f4f6" />
      <text x="16" y="34" fontSize="6.5" fill="#6b7280" fontFamily="system-ui,sans-serif">Features</text>
      <text x="50" y="34" fontSize="6.5" fill="#6b7280" fontFamily="system-ui,sans-serif">Pricing</text>
      <rect x="99" y="22" width="14" height="14" rx="3.1" fill="#dbeafe" />
      <text x="117" y="33" fontSize="7" fontWeight="700" fill="#1d4ed8" fontFamily="system-ui,sans-serif">UI Builder</text>
      <text x="158" y="34" fontSize="6.5" fill="#6b7280" fontFamily="system-ui,sans-serif">Sign in</text>
      <rect x="178" y="25" width="26" height="12" rx="3" fill="#111827" />
    </svg>
  )
}
function HeaderTransparentThumb() {
  return (
    <svg viewBox="0 0 220 80" fill="none" style={{ width: '100%', height: '100%' }}>
      <defs>
        <radialGradient id="ig-htbg" cx="60%" cy="40%" r="70%"><stop offset="0%" stopColor="#e0e7ff" /><stop offset="100%" stopColor="#f5f3ff" /></radialGradient>
      </defs>
      <rect width="220" height="80" fill="url(#ig-htbg)" />
      <rect width="220" height="52" fill="rgba(255,255,255,0.65)" />
      <rect x="12" y="18" width="15" height="15" rx="3.3" fill="#dbeafe" />
      <text x="31" y="30" fontSize="7.5" fontWeight="700" fill="#1d4ed8" fontFamily="system-ui,sans-serif">UI Builder</text>
      <text x="76" y="30" fontSize="6.5" fill="#374151" fontFamily="system-ui,sans-serif">Features</text>
      <text x="106" y="30" fontSize="6.5" fill="#374151" fontFamily="system-ui,sans-serif">Solutions</text>
      <text x="137" y="30" fontSize="6.5" fill="#374151" fontFamily="system-ui,sans-serif">Pricing</text>
      <rect x="182" y="20" width="28" height="13" rx="4" fill="url(#ig-hdg1)" />
    </svg>
  )
}
function HeaderEnterpriseThumb() {
  return (
    <svg viewBox="0 0 220 80" fill="none" style={{ width: '100%', height: '100%' }}>
      <rect width="220" height="80" fill="#09090b" />
      <rect width="220" height="1" y="53" fill="rgba(255,255,255,0.06)" />
      <rect x="12" y="19" width="14" height="14" rx="3.1" fill="rgba(255,255,255,0.12)" />
      <text x="30" y="30" fontSize="7" fontWeight="700" fill="#e4e4e7" fontFamily="system-ui,sans-serif">UI Builder</text>
      <rect x="74" y="22" width="34" height="10" rx="2.5" fill="rgba(167,139,250,0.12)" stroke="rgba(167,139,250,0.25)" strokeWidth="0.7" />
      <text x="91" y="29.5" textAnchor="middle" fontSize="4.5" fill="#a78bfa" fontWeight="700" fontFamily="system-ui,sans-serif">ENTERPRISE</text>
      <text x="118" y="30" fontSize="6" fill="#71717a" fontFamily="system-ui,sans-serif">Platform</text>
      <text x="141" y="30" fontSize="6" fill="#71717a" fontFamily="system-ui,sans-serif">Security</text>
      <text x="164" y="30" fontSize="6" fill="#71717a" fontFamily="system-ui,sans-serif">Pricing</text>
      <rect x="198" y="21" width="10" height="11" rx="2.5" fill="#4f46e5" />
    </svg>
  )
}

// ─── PPC Thumbnails — Celestial Obsidian ────────────────────────────────────

function PpcStellarUtahThumb() {
  return (
    <svg viewBox="0 0 280 160" xmlns="http://www.w3.org/2000/svg" style={{ width: '100%', height: '100%' }}>
      <defs>
        <radialGradient id="ig-ppc-glow" cx="50%" cy="30%" r="55%">
          <stop offset="0%" stopColor="#4719c9" stopOpacity="0.4"/>
          <stop offset="100%" stopColor="#10141a" stopOpacity="0"/>
        </radialGradient>
        <linearGradient id="ig-ppc-card" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#ffffff" stopOpacity="0.07"/>
          <stop offset="100%" stopColor="#ffffff" stopOpacity="0.02"/>
        </linearGradient>
      </defs>
      {/* Sky bg */}
      <rect width="280" height="160" fill="#10141a"/>
      <rect width="280" height="160" fill="url(#ig-ppc-glow)"/>
      {/* Stars */}
      {[
        [18,12],[54,8],[91,22],[132,6],[170,15],[210,9],[248,18],
        [35,38],[74,28],[118,35],[158,26],[200,32],[245,41],
        [22,55],[66,48],[105,58],[148,44],[194,52],[258,47],
      ].map(([x,y], i) => (
        <circle key={i} cx={x} cy={y} r={i%3===0?1.2:0.7} fill="#cabeff" opacity={i%2===0?0.9:0.5}/>
      ))}
      {/* Nav bar */}
      <rect width="280" height="14" fill="#0a0d12" opacity="0.9"/>
      <text x="10" y="10" fontFamily="sans-serif" fontSize="6" fontWeight="700" fill="#dfe2eb">✦ Stellar Utah</text>
      <rect x="230" y="4" width="40" height="6" rx="2" fill="#cabeff"/>
      <text x="250" y="9" fontFamily="sans-serif" fontSize="4" fill="#10141a" textAnchor="middle" fontWeight="700">Reserve</text>
      {/* Hero headline */}
      <text x="140" y="46" fontFamily="serif" fontSize="11" fontWeight="400" fill="#dfe2eb" textAnchor="middle">Sleep Beneath a Thousand Suns</text>
      <text x="140" y="58" fontFamily="sans-serif" fontSize="5" fill="#c3c6d2" textAnchor="middle">Luxury dark-sky accommodations in Canyon Country</text>
      {/* CTA row */}
      <rect x="90" y="63" width="44" height="9" rx="2" fill="#cabeff"/>
      <text x="112" y="69.5" fontFamily="sans-serif" fontSize="4" fill="#10141a" textAnchor="middle" fontWeight="700">Reserve Now</text>
      <rect x="140" y="63" width="50" height="9" rx="2" fill="none" stroke="#c3c6d2" strokeWidth="0.6"/>
      <text x="165" y="69.5" fontFamily="sans-serif" fontSize="4" fill="#c3c6d2" textAnchor="middle">Explore ↓</text>
      {/* Experiences section */}
      <rect width="280" height="30" y="80" fill="#0d1017"/>
      <text x="140" y="91" fontFamily="serif" fontSize="7" fill="#dfe2eb" textAnchor="middle">Curated Celestial Experiences</text>
      {[0,1,2].map(i => (
        <g key={i}>
          <rect x={6 + i*92} y="96" width="82" height="12" rx="4" fill="url(#ig-ppc-card)" stroke="#cabeff" strokeWidth="0.4" strokeOpacity="0.3"/>
          <text x={47 + i*92} y="104" fontFamily="sans-serif" fontSize="4" fill="#c3c6d2" textAnchor="middle">
            {['🌌 Observatory','🌠 Night Tour','📸 Astrophoto'][i]}
          </text>
        </g>
      ))}
      {/* Stats row */}
      <rect width="280" height="22" y="112" fill="#10141a"/>
      {[['320+','Clear Nights'],['5★','Rated'],['12k+','Guests'],['IDA','Certified']].map(([num, lbl], i) => (
        <g key={i}>
          <text x={23 + i*65} y="121" fontFamily="sans-serif" fontSize="6" fontWeight="700" fill="#cabeff" textAnchor="middle">{num}</text>
          <text x={23 + i*65} y="129" fontFamily="sans-serif" fontSize="3.5" fill="#c3c6d2" textAnchor="middle">{lbl}</text>
        </g>
      ))}
      {/* Footer */}
      <rect width="280" height="14" y="146" fill="#0a0d12"/>
      <text x="14" y="155" fontFamily="sans-serif" fontSize="4" fill="#c3c6d2" opacity="0.5">✦ Stellar Utah · Full Landing Page · 7 Sections</text>
    </svg>
  )
}

const THUMB_MAP: Record<string, React.ReactNode> = {
  'banner-hero-gradient':    <BannerGradientThumb />,
  'banner-dark-announcement':<BannerDarkThumb />,
  'banner-product-feature':  <BannerProductThumb />,
  'cta-centered-dark':       <CtaDarkThumb />,
  'cta-split-gradient':      <CtaSplitThumb />,
  'cta-minimal-bordered':    <CtaMinimalThumb />,
  'form-newsletter':         <FormNewsletterThumb />,
  'form-contact':            <FormContactThumb />,
  'form-waitlist':           <FormWaitlistThumb />,
  'banner-3d-cosmic':        <Banner3DThumb />,
  'banner-morph-creative':   <BannerMorphThumb />,
  'banner-ticker-dark':      <BannerTickerThumb />,
  'banner-split-3d':         <BannerSplitThumb />,
  'banner-glass-hero':       <BannerGlassThumb />,
  'banner-neon-glow':        <BannerNeonThumb />,
  'banner-aurora-sky':       <BannerAuroraThumb />,
  'banner-retro-wave':       <BannerRetroThumb />,
  'banner-particle-net':     <BannerParticleThumb />,
  'header-classic-light':    <HeaderClassicThumb />,
  'header-dark-pro':         <HeaderDarkThumb />,
  'header-gradient-brand':   <HeaderGradientThumb />,
  'header-minimal-center':   <HeaderMinimalThumb />,
  'header-saas-transparent': <HeaderTransparentThumb />,
  'header-enterprise-dark':  <HeaderEnterpriseThumb />,
  'ppc-stellar-utah':   <PpcStellarUtahThumb />,
}

// ─── Category badge colours ────────────────────────────────────────────────────

const CATEGORY_COLORS: Record<string, { bg: string; color: string }> = {
  banner: { bg: '#eff6ff', color: '#2563eb' },
  cta:    { bg: '#f0fdf4', color: '#16a34a' },
  form:   { bg: '#fdf4ff', color: '#9333ea' },
  header: { bg: '#fff7ed', color: '#ea580c' },
  ppc:    { bg: '#1a1030', color: '#cabeff' },
}

// Framework metadata
interface FrameworkOption {
  id: BuilderMode
  name: string
  desc: string
  icon: React.ReactNode
}

const FRAMEWORKS: FrameworkOption[] = [
  {
    id: 'bootstrap',
    name: 'Bootstrap',
    desc: 'Bootstrap 5.3 grid & utility classes',
    icon: (
      <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
        <rect width="28" height="28" rx="6" fill="#7952B3" />
        <text x="14" y="20" textAnchor="middle" fontSize="14" fontWeight="800" fill="white" fontFamily="system-ui,sans-serif">B</text>
      </svg>
    ),
  },
  {
    id: 'mui',
    name: 'MUI',
    desc: 'Material UI Grid, Box & Stack',
    icon: (
      <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
        <rect width="28" height="28" rx="6" fill="#0081CB" />
        <path d="M7 19V9l7 4 7-4v10l-7 4-7-4z" fill="none" stroke="white" strokeWidth="1.6" strokeLinejoin="round" />
      </svg>
    ),
  },
  {
    id: 'tailwind',
    name: 'Tailwind',
    desc: 'Utility-first responsive classes',
    icon: (
      <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
        <rect width="28" height="28" rx="6" fill="#06B6D4" />
        <path d="M9 16c.7-2.8 2.8-4.2 5.6-4.2 2.1 0 3.5.7 4.2 2.1C20.1 12.3 21.5 11 23 11c.7 0 1.4.7 0 2.8-1.4 2.1-2.8 3.5-5.6 4.2-2.1.7-3.5 0-4.2-1.4C12.5 18.5 11.1 19.2 9 17z" fill="white" />
      </svg>
    ),
  },
  {
    id: 'custom',
    name: 'Custom CSS',
    desc: 'Pure HTML + custom CSS (no framework)',
    icon: (
      <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
        <rect width="28" height="28" rx="6" fill="#4F46E5" />
        <text x="14" y="20" textAnchor="middle" fontSize="10" fontWeight="700" fill="white" fontFamily="system-ui,sans-serif">CSS</text>
      </svg>
    ),
  },
]

// ─── Framework Picker Modal ────────────────────────────────────────────────────

interface ModalProps {
  template: Template
  onClose: () => void
}

function FrameworkPickerModal({ template, onClose }: ModalProps) {
  const [selected, setSelected] = useState<BuilderMode | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleDownload() {
    if (!selected) return
    setLoading(true)
    setError(null)

    try {
      // Materialize template into normalized store nodes (single or multi-section)
      const templateSections = template.sections ?? (template.section ? [template.section] : [])
      const materialized = templateSections.map(s => materializeTemplate(s))

      const allSections: Record<string, ReturnType<typeof materializeTemplate>['section']> = {}
      const allRows: Record<string, ReturnType<typeof materializeTemplate>['rows'][number]> = {}
      const allColumns: Record<string, ReturnType<typeof materializeTemplate>['columns'][number]> = {}
      const allElements: Record<string, ReturnType<typeof materializeTemplate>['elements'][number]> = {}
      const sectionOrder: string[] = []

      for (const { section, rows, columns, elements } of materialized) {
        allSections[section.id] = section
        sectionOrder.push(section.id)
        rows.forEach(r => { allRows[r.id] = r })
        columns.forEach(c => { allColumns[c.id] = c })
        elements.forEach(e => { allElements[e.id] = e })
      }

      // Assemble a minimal BuilderStoreState
      const state: BuilderStoreState = {
        sections:  allSections,
        rows:      allRows,
        columns:   allColumns,
        elements:  allElements,
        sectionOrder,
        projectMeta: {
          id: crypto.randomUUID(),
          name: template.label,
          createdAt: new Date().toISOString(),
        },
        mode: selected,
        responsiveMode: 'desktop',
        selectedId: null,
        editingId: null,
        dragState: null,
        canvasWidth: '100%',
        projectName: template.label,
        leftPanelVisible: true,
        rightPanelVisible: true,
        canvasZoom: 1,
        clipboard: null,
        _history: [],
        _future: [],
      }

      const res = await fetch('/api/export', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ state, format: 'zip' }),
      })

      if (!res.ok) {
        const json = await res.json().catch(() => ({}))
        throw new Error((json as { error?: string }).error ?? `Export failed (${res.status})`)
      }

      const blob = await res.blob()
      const url  = URL.createObjectURL(blob)
      const a    = document.createElement('a')
      a.href     = url
      a.download = `${template.id}-${selected}.zip`
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)
      onClose()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong.')
    } finally {
      setLoading(false)
    }
  }

  return (
    // Backdrop
    <div
      onClick={onClose}
      style={{
        position: 'fixed', inset: 0, zIndex: 999,
        backgroundColor: 'rgba(0,0,0,0.55)',
        backdropFilter: 'blur(4px)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        padding: 16,
        animation: 'bp-fade-in 150ms ease forwards',
      }}
    >
      {/* Panel */}
      <div
        onClick={e => e.stopPropagation()}
        style={{
          width: '100%', maxWidth: 480,
          backgroundColor: 'var(--color-bg)',
          border: '1px solid var(--color-border)',
          borderRadius: 16,
          boxShadow: '0 24px 64px rgba(0,0,0,0.3)',
          overflow: 'hidden',
          animation: 'bp-scale-in 180ms ease forwards',
        }}
      >
        {/* Header */}
        <div style={{
          padding: '20px 24px 16px',
          borderBottom: '1px solid var(--color-border)',
          display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 12,
        }}>
          <div>
            <h3 style={{ margin: 0, fontSize: '1rem', fontWeight: 700, color: 'var(--color-text-primary)' }}>
              Choose a Framework
            </h3>
            <p style={{ margin: '3px 0 0', fontSize: '0.8125rem', color: 'var(--color-text-secondary)' }}>
              {template.label}
            </p>
          </div>
          <button
            onClick={onClose}
            aria-label="Close"
            style={{
              flexShrink: 0, width: 30, height: 30, borderRadius: 8,
              border: '1px solid var(--color-border)',
              backgroundColor: 'var(--color-surface)',
              cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
              color: 'var(--color-text-secondary)',
            }}
          >
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <path d="M1 1l10 10M11 1L1 11" />
            </svg>
          </button>
        </div>

        {/* Framework options */}
        <div style={{ padding: '16px 24px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
          {FRAMEWORKS.map(fw => {
            const isSelected = selected === fw.id
            return (
              <button
                key={fw.id}
                onClick={() => setSelected(fw.id)}
                style={{
                  display: 'flex', alignItems: 'center', gap: 12,
                  padding: '12px 14px', borderRadius: 10, textAlign: 'left', cursor: 'pointer',
                  border: isSelected
                    ? '2px solid var(--color-primary)'
                    : '1px solid var(--color-border)',
                  backgroundColor: isSelected
                    ? 'var(--color-selected)'
                    : 'var(--color-surface)',
                  transition: 'border-color 120ms, background-color 120ms',
                  outline: 'none',
                }}
              >
                <span style={{ flexShrink: 0 }}>{fw.icon}</span>
                <span>
                  <span style={{
                    display: 'block', fontSize: '0.875rem', fontWeight: 700,
                    color: isSelected ? 'var(--color-primary)' : 'var(--color-text-primary)',
                    transition: 'color 120ms',
                  }}>{fw.name}</span>
                  <span style={{
                    display: 'block', fontSize: '0.7rem', marginTop: 2,
                    color: 'var(--color-text-secondary)', lineHeight: 1.35,
                  }}>{fw.desc}</span>
                </span>
              </button>
            )
          })}
        </div>

        {/* Error */}
        {error && (
          <div style={{
            margin: '0 24px', padding: '8px 12px', borderRadius: 8,
            backgroundColor: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.25)',
            fontSize: '0.78rem', color: '#ef4444',
          }}>
            {error}
          </div>
        )}

        {/* Footer */}
        <div style={{
          padding: '14px 24px 20px',
          display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: 10,
          borderTop: '1px solid var(--color-border)', marginTop: 8,
        }}>
          <button
            onClick={onClose}
            style={{
              height: 38, padding: '0 18px', borderRadius: 8,
              border: '1px solid var(--color-border)',
              backgroundColor: 'transparent',
              color: 'var(--color-text-secondary)',
              fontSize: '0.875rem', cursor: 'pointer',
            }}
          >
            Cancel
          </button>
          <button
            onClick={handleDownload}
            disabled={!selected || loading}
            style={{
              height: 38, padding: '0 20px', borderRadius: 8, border: 'none',
              backgroundColor: selected && !loading ? 'var(--color-primary)' : 'var(--color-border)',
              color: selected && !loading ? '#fff' : 'var(--color-text-secondary)',
              fontSize: '0.875rem', fontWeight: 600, cursor: selected && !loading ? 'pointer' : 'default',
              display: 'flex', alignItems: 'center', gap: 7,
              transition: 'background-color 150ms',
            }}
          >
            {loading ? (
              <>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" style={{ animation: 'bp-spin-slow 0.8s linear infinite' }}>
                  <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" />
                </svg>
                Exporting…
              </>
            ) : (
              <>
                <svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M8 2v8M5 7l3 3 3-3" />
                  <path d="M2 11v2a1 1 0 001 1h10a1 1 0 001-1v-2" />
                </svg>
                Download ZIP
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  )
}

// ─── Template Card ─────────────────────────────────────────────────────────────

function TemplateCard({ tpl, onDownload, onPreview }: { tpl: Template; onDownload: (t: Template) => void; onPreview: (t: Template) => void }) {
  const [hovered, setHovered] = useState(false)
  const catStyle = CATEGORY_COLORS[tpl.category] ?? { bg: '#f3f4f6', color: '#374151' }

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        borderRadius: 12, border: '1px solid var(--color-border)',
        backgroundColor: 'var(--color-surface)',
        overflow: 'hidden',
        transition: 'box-shadow 150ms, transform 150ms',
        boxShadow: hovered ? '0 8px 28px rgba(0,0,0,0.12)' : '0 1px 4px rgba(0,0,0,0.04)',
        transform: hovered ? 'translateY(-2px)' : 'none',
        display: 'flex', flexDirection: 'column',
      }}
    >
      {/* Thumbnail */}
      <div style={{ position: 'relative', height: 140, overflow: 'hidden', backgroundColor: '#111', flexShrink: 0 }}>
        <div style={{ width: '100%', height: '100%' }}>
          {THUMB_MAP[tpl.id] ?? (
            <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: 'var(--color-border)' }}>
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="var(--color-text-secondary)" strokeWidth="1.5" strokeLinecap="round">
                <rect x="3" y="3" width="18" height="18" rx="2" /><path d="M3 9h18M9 9v12" />
              </svg>
            </div>
          )}
        </div>
        {tpl.animated && (
          <div style={{
            position: 'absolute', top: 8, right: 8,
            padding: '2px 8px', borderRadius: 10, fontSize: '0.6rem',
            fontWeight: 700, letterSpacing: '0.06em',
            background: 'linear-gradient(90deg,#6366f1,#a855f7)', color: '#fff',
            boxShadow: '0 2px 8px rgba(99,102,241,0.4)',
          }}>✦ ANIMATED</div>
        )}
      </div>

      {/* Body */}
      <div style={{ padding: '12px 14px 14px', flex: 1, display: 'flex', flexDirection: 'column', gap: 8 }}>
        {/* Top row: badge + name */}
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: 8 }}>
          <span style={{
            flexShrink: 0, marginTop: 2,
            fontSize: '0.6rem', fontWeight: 700, padding: '2px 7px',
            borderRadius: 20, textTransform: 'capitalize',
            backgroundColor: catStyle.bg, color: catStyle.color,
          }}>{tpl.category}</span>
          <span style={{
            fontSize: '0.875rem', fontWeight: 700, lineHeight: 1.25,
            color: 'var(--color-text-primary)',
          }}>{tpl.label}</span>
        </div>

        {/* Description */}
        <p style={{
          margin: 0, fontSize: '0.78rem', color: 'var(--color-text-secondary)',
          lineHeight: 1.4,
          overflow: 'hidden', display: '-webkit-box',
          WebkitLineClamp: 2, WebkitBoxOrient: 'vertical',
        }}>{tpl.desc}</p>

        {/* Action buttons */}
        <div style={{ marginTop: 'auto', paddingTop: 4, display: 'flex', gap: 7 }}>
          {/* Preview */}
          <button
            onClick={() => onPreview(tpl)}
            style={{
              flex: 1, height: 34, borderRadius: 8,
              border: '1.5px solid var(--color-border)',
              backgroundColor: 'var(--color-bg)',
              color: 'var(--color-text-primary)', fontSize: '0.8125rem', fontWeight: 600,
              cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 5,
              transition: 'border-color 120ms, color 120ms',
            }}
            onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--color-primary)'; e.currentTarget.style.color = 'var(--color-primary)' }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--color-border)'; e.currentTarget.style.color = 'var(--color-text-primary)' }}
          >
            <svg width="13" height="13" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M1 8s2.5-5 7-5 7 5 7 5-2.5 5-7 5-7-5-7-5z" />
              <circle cx="8" cy="8" r="2" />
            </svg>
            Preview
          </button>
          {/* Download */}
          <button
            onClick={() => onDownload(tpl)}
            style={{
              flex: 1, height: 34, borderRadius: 8, border: 'none',
              backgroundColor: 'var(--color-primary)',
              color: '#fff', fontSize: '0.8125rem', fontWeight: 600,
              cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 5,
              transition: 'opacity 150ms',
            }}
            onMouseEnter={e => (e.currentTarget.style.opacity = '0.88')}
            onMouseLeave={e => (e.currentTarget.style.opacity = '1')}
          >
            <svg width="13" height="13" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M8 2v8M5 7l3 3 3-3" />
              <path d="M2 11v2a1 1 0 001 1h10a1 1 0 001-1v-2" />
            </svg>
            Download
          </button>
        </div>
      </div>
    </div>
  )
}

// ─── Scroll-reveal hook ────────────────────────────────────────────────────────
function useScrollReveal(threshold = 0.12) {
  const ref = useRef<HTMLElement | null>(null)
  const [visible, setVisible] = useState(false)
  useEffect(() => {
    const el = ref.current
    if (!el) return
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { setVisible(true); obs.disconnect() } },
      { threshold, rootMargin: '0px 0px -40px 0px' }
    )
    obs.observe(el)
    return () => obs.disconnect()
  }, [threshold])
  return { ref, visible }
}

// ─── Category filter ───────────────────────────────────────────────────────────

type Category = 'all' | 'header' | 'banner' | 'cta' | 'form' | 'ppc'

const CATEGORIES: { label: string; value: Category }[] = [
  { label: 'All', value: 'all' },
  { label: 'Header', value: 'header' },
  { label: 'Banner', value: 'banner' },
  { label: 'CTA', value: 'cta' },
  { label: 'Form', value: 'form' },
  { label: 'PPC', value: 'ppc' },
]

// ─── Inspiration Section ───────────────────────────────────────────────────────

export default function InspirationSection() {
  const [activeCategory, setActiveCategory] = useState<Category>('all')
  const [modalTemplate, setModalTemplate] = useState<Template | null>(null)
  const headingReveal = useScrollReveal(0.1)
  const pillsReveal   = useScrollReveal(0.1)
  const ctaReveal     = useScrollReveal(0.1)
  // stagger card visibility
  const [visibleCards, setVisibleCards] = useState<Set<string>>(new Set())
  const cardObserverRef = useRef<IntersectionObserver | null>(null)
  const cardRefs = useRef<Map<string, HTMLElement>>(new Map())

  const observeCard = useCallback((id: string, el: HTMLElement | null) => {
    if (!el) { cardRefs.current.delete(id); return }
    cardRefs.current.set(id, el)
    if (!cardObserverRef.current) {
      cardObserverRef.current = new IntersectionObserver(
        (entries) => {
          entries.forEach(entry => {
            if (entry.isIntersecting) {
              const cardId = (entry.target as HTMLElement).dataset.cardId
              if (cardId) setVisibleCards(prev => new Set(prev).add(cardId))
            }
          })
        },
        { threshold: 0.08, rootMargin: '0px 0px -20px 0px' }
      )
    }
    cardObserverRef.current.observe(el)
  }, [])

  useEffect(() => {
    return () => { cardObserverRef.current?.disconnect() }
  }, [])

  function handlePreview(tpl: Template) {
    const templateSections = tpl.sections ?? (tpl.section ? [tpl.section] : [])
    const materialized = templateSections.map(s => materializeTemplate(s))

    const allSections: Record<string, ReturnType<typeof materializeTemplate>['section']> = {}
    const allRows: Record<string, ReturnType<typeof materializeTemplate>['rows'][number]> = {}
    const allColumns: Record<string, ReturnType<typeof materializeTemplate>['columns'][number]> = {}
    const allElements: Record<string, ReturnType<typeof materializeTemplate>['elements'][number]> = {}
    const sectionOrder: string[] = []

    for (const { section, rows, columns, elements } of materialized) {
      allSections[section.id] = section
      sectionOrder.push(section.id)
      rows.forEach(r => { allRows[r.id] = r })
      columns.forEach(c => { allColumns[c.id] = c })
      elements.forEach(e => { allElements[e.id] = e })
    }

    const state: BuilderStoreState = {
      sections:  allSections,
      rows:      allRows,
      columns:   allColumns,
      elements:  allElements,
      sectionOrder,
      projectMeta: {
        id: crypto.randomUUID(),
        name: tpl.label,
        createdAt: new Date().toISOString(),
      },
      mode: 'custom',
      responsiveMode: 'desktop',
      selectedId: null,
      editingId: null,
      dragState: null,
      canvasWidth: '100%',
      projectName: tpl.label,
      leftPanelVisible: true,
      rightPanelVisible: true,
      canvasZoom: 1,
      clipboard: null,
      _history: [],
      _future: [],
    }
    localStorage.setItem(INSPIRATION_PREVIEW_KEY, JSON.stringify(state))
    window.open('/preview', '_blank', 'noopener')
  }

  const filtered = activeCategory === 'all'
    ? TEMPLATES
    : TEMPLATES.filter(t => t.category === activeCategory)

  return (
    <>
      <section
        id="inspiration"
        style={{
          width: '100%',
          padding: '80px 24px',
          backgroundColor: 'var(--color-bg)',
          borderTop: '1px solid var(--color-border)',
        }}
      >
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>

          {/* Heading */}
          <div
            ref={headingReveal.ref as React.RefObject<HTMLDivElement>}
            className={headingReveal.visible ? 'anim-fade-up' : 'anim-hidden'}
            style={{ textAlign: 'center', marginBottom: 48 }}
          >
            <span style={{
              display: 'inline-block', marginBottom: 12,
              fontSize: '0.75rem', fontWeight: 700, letterSpacing: '0.08em',
              textTransform: 'uppercase', color: 'var(--color-primary)',
              padding: '4px 12px', borderRadius: 20,
              backgroundColor: 'var(--color-selected)',
              border: '1px solid rgba(79,70,229,0.2)',
            }}>
              Template Gallery
            </span>
            <h2 style={{
              margin: '0 0 12px',
              fontSize: 'clamp(1.6rem, 3vw, 2.25rem)',
              fontWeight: 800, letterSpacing: '-0.02em',
              color: 'var(--color-text-primary)',
            }}>
              Explore Templates
            </h2>
            <p style={{
              margin: 0, maxWidth: 520, marginInline: 'auto',
              fontSize: '1rem', lineHeight: 1.6,
              color: 'var(--color-text-secondary)',
            }}>
              Professionally crafted sections ready to download as{' '}
              <strong style={{ color: 'var(--color-text-primary)' }}>Bootstrap, MUI, Tailwind, or Custom CSS</strong>.
              Pick a template and grab the code in seconds.
            </p>
          </div>

          {/* Category pills */}
          <div
            ref={pillsReveal.ref as React.RefObject<HTMLDivElement>}
            className={pillsReveal.visible ? 'anim-fade-up' : 'anim-hidden'}
            style={{
              display: 'flex', flexWrap: 'wrap', gap: 8,
              justifyContent: 'center', marginBottom: 36,
            }}
          >
            {CATEGORIES.map(cat => {
              const active = activeCategory === cat.value
              return (
                <button
                  key={cat.value}
                  onClick={() => setActiveCategory(cat.value)}
                  className="cat-pill"
                  style={{
                    height: 34, padding: '0 16px', borderRadius: 8,
                    border: active ? '1.5px solid var(--color-primary)' : '1px solid var(--color-border)',
                    backgroundColor: active ? 'var(--color-selected)' : 'var(--color-surface)',
                    color: active ? 'var(--color-primary)' : 'var(--color-text-secondary)',
                    fontSize: '0.8125rem', fontWeight: active ? 700 : 500,
                    cursor: 'pointer', whiteSpace: 'nowrap',
                    transition: 'border-color 120ms, color 120ms, background-color 120ms',
                  }}
                >
                  {cat.label}
                  {cat.value !== 'all' && (
                    <span style={{ marginLeft: 5, fontSize: '0.7rem', opacity: 0.7 }}>
                      ({TEMPLATES.filter(t => t.category === cat.value).length})
                    </span>
                  )}
                </button>
              )
            })}
          </div>

          {/* Grid */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            gap: 20,
          }}
            className="inspiration-grid"
          >
            {filtered.map((tpl, idx) => {
              const isVis = visibleCards.has(tpl.id)
              const delay = (idx % 3) * 80  // stagger by column
              return (
                <div
                  key={tpl.id}
                  data-card-id={tpl.id}
                  ref={el => observeCard(tpl.id, el)}
                  className={`tpl-card ${isVis ? 'anim-scale-in' : 'anim-hidden'}`}
                  style={{ animationDelay: isVis ? `${delay}ms` : undefined, borderRadius: 12 }}
                >
                  <TemplateCard
                    tpl={tpl}
                    onDownload={setModalTemplate}
                    onPreview={handlePreview}
                  />
                </div>
              )
            })}
          </div>

          {/* Empty state */}
          {filtered.length === 0 && (
            <div style={{ textAlign: 'center', padding: '48px 0', color: 'var(--color-text-secondary)' }}>
              No templates in this category yet.
            </div>
          )}

          {/* CTA nudge */}
          <div
            ref={ctaReveal.ref as React.RefObject<HTMLDivElement>}
            className={ctaReveal.visible ? 'anim-fade-up' : 'anim-hidden'}
            style={{
              marginTop: 56, textAlign: 'center',
              padding: '32px 24px',
              borderRadius: 16, border: '1px solid var(--color-border)',
              backgroundColor: 'var(--color-surface)',
            }}
          >
            <p style={{ margin: '0 0 16px', fontSize: '1rem', fontWeight: 600, color: 'var(--color-text-primary)' }}>
              Want to build something custom?
            </p>
            <p style={{ margin: '0 0 20px', fontSize: '0.875rem', color: 'var(--color-text-secondary)' }}>
              Mix and match templates inside the visual builder — drag, drop, and export in minutes.
            </p>
            <a
              href="/builder"
              className="btn-primary-glow"
              style={{
                display: 'inline-flex', alignItems: 'center', gap: 8,
                height: 42, padding: '0 24px', borderRadius: 10, border: 'none',
                backgroundColor: 'var(--color-primary)', color: '#fff',
                fontSize: '0.9rem', fontWeight: 700, textDecoration: 'none',
              }}
            >
              Open Builder →
            </a>
          </div>
        </div>
      </section>

      {/* Global responsive style for the grid */}
      <style>{`
        @media (max-width: 900px) {
          .inspiration-grid { grid-template-columns: repeat(2, 1fr) !important; }
        }
        @media (max-width: 560px) {
          .inspiration-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>

      {/* Framework picker modal */}
      {modalTemplate && (
        <FrameworkPickerModal
          template={modalTemplate}
          onClose={() => setModalTemplate(null)}
        />
      )}
    </>
  )
}
