'use client'

import { memo, useState, useId } from 'react'
import { useFramework } from '@/hooks/useFramework'

// ─── Preset definitions (framework-agnostic tokens) ───────────────────────────

export interface TopHeaderPresetTokens {
  bg: string
  border: string
  text: string
  icon: string
  shadow: boolean
}

export const TOP_HEADER_PRESETS: Record<string, TopHeaderPresetTokens> = {
  light:   { bg: '#ffffff',  border: '#e5e7eb', text: '#111827', icon: '#6b7280', shadow: true  },
  dark:    { bg: '#111827',  border: '#1f2937', text: '#f9fafb', icon: '#9ca3af', shadow: true  },
  indigo:  { bg: '#4f46e5',  border: '#4338ca', text: '#ffffff', icon: '#c7d2fe', shadow: true  },
  blur:    { bg: 'rgba(255,255,255,0.72)', border: 'rgba(229,231,235,0.8)', text: '#111827', icon: '#6b7280', shadow: true  },
  minimal: { bg: '#f8fafc',  border: '#e2e8f0', text: '#0f172a', icon: '#94a3b8', shadow: false },
}

// ─── Props ────────────────────────────────────────────────────────────────────

interface Props {
  preset?: 'light' | 'dark' | 'indigo' | 'blur' | 'minimal'
  height?: number
  bg?: string
  borderColor?: string
  textColor?: string
  iconColor?: string
  shadow?: boolean
  pageTitle?: string
  breadcrumbLabel?: string
  showSearch?: boolean
  searchPlaceholder?: string
  showNotifications?: boolean
  notificationCount?: number
  showMessages?: boolean
  messageCount?: number
  showSettings?: boolean
  showHelp?: boolean
  showThemeToggle?: boolean
  showProfile?: boolean
  profileName?: string
  profileRole?: string
  profileSrc?: string
  profileInitials?: string
  mobileBreakpoint?: number
  showLogo?: boolean
  logoText?: string
  logoSrc?: string
  containerLayout?: 'fluid' | 'centered'
  maxWidth?: string
  paddingX?: number
  actionGap?: number
  showProfileDivider?: boolean
  style?: React.CSSProperties
}

// ─── Icon helpers (no external deps) ─────────────────────────────────────────

function Icon({ path, size = 18, color }: { path: string; size?: number; color: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
      stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d={path} />
    </svg>
  )
}

const ICONS = {
  search:   'M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z',
  bell:     'M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9',
  mail:     'M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z',
  settings: 'M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z M15 12a3 3 0 11-6 0 3 3 0 016 0z',
  help:     'M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z',
  sun:      'M12 3v1m0 16v1m9-9h-1M4 12H3m15.364-6.364l-.707.707M6.343 17.657l-.707.707m12.728 0l-.707-.707M6.343 6.343l-.707-.707M12 8a4 4 0 100 8 4 4 0 000-8z',
  chevron:  'M19 9l-7 7-7-7',
  slash:    'M17 5L7 19',
}

// ─── Badge dot ────────────────────────────────────────────────────────────────

function Badge({ count, iconColor }: { count?: number; iconColor: string }) {
  if (!count && count !== 0) return null
  return (
    <span style={{
      position: 'absolute',
      top: -2,
      right: -2,
      minWidth: 16,
      height: 16,
      borderRadius: 8,
      backgroundColor: '#ef4444',
      color: '#fff',
      fontSize: '0.6rem',
      fontWeight: 700,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '0 3px',
      lineHeight: 1,
      border: `1.5px solid ${iconColor === '#ffffff' || iconColor === '#f9fafb' ? '#111827' : '#ffffff'}`,
      boxSizing: 'border-box',
    }}>
      {count > 99 ? '99+' : count}
    </span>
  )
}

// ─── Icon button ──────────────────────────────────────────────────────────────

function IconBtn({ path, count, iconColor, label }: {
  path: string
  count?: number
  iconColor: string
  label: string
}) {
  return (
    <button
      aria-label={label}
      title={label}
      style={{
        position: 'relative',
        width: 36,
        height: 36,
        border: 'none',
        background: 'transparent',
        borderRadius: 8,
        cursor: 'pointer',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexShrink: 0,
        padding: 0,
        transition: 'background 150ms',
      }}
      onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.background = 'rgba(0,0,0,0.06)' }}
      onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.background = 'transparent' }}
    >
      <Icon path={path} color={iconColor} />
      {count !== undefined && count > 0 && <Badge count={count} iconColor={iconColor} />}
    </button>
  )
}

// ─── Profile avatar ───────────────────────────────────────────────────────────

function ProfileAvatar({ profileName, profileSrc, profileInitials, profileRole, textColor, iconColor }: {
  profileName: string
  profileSrc?: string
  profileInitials?: string
  profileRole?: string
  textColor: string
  iconColor: string
}) {
  const initials = profileInitials || profileName.split(' ').map((p) => p[0]).join('').slice(0, 2).toUpperCase()

  return (
    <button
      aria-label="User profile"
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 8,
        border: 'none',
        background: 'transparent',
        cursor: 'pointer',
        padding: '4px 6px',
        borderRadius: 8,
        transition: 'background 150ms',
        flexShrink: 0,
      }}
      onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.background = 'rgba(0,0,0,0.06)' }}
      onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.background = 'transparent' }}
    >
      {/* Avatar */}
      <div style={{
        width: 30,
        height: 30,
        borderRadius: '50%',
        overflow: 'hidden',
        flexShrink: 0,
        background: 'linear-gradient(135deg, #4f46e5, #06b6d4)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}>
        {profileSrc ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={profileSrc} alt={profileName} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
        ) : (
          <span style={{ color: '#fff', fontSize: '0.7rem', fontWeight: 700 }}>{initials}</span>
        )}
      </div>

      {/* Name + role (hidden on small screens via inline trick) */}
      <div style={{ textAlign: 'left', lineHeight: 1.2 }}>
        <div style={{ fontSize: '0.8rem', fontWeight: 600, color: textColor, whiteSpace: 'nowrap' }}>{profileName}</div>
        {profileRole && (
          <div style={{ fontSize: '0.68rem', color: iconColor, whiteSpace: 'nowrap' }}>{profileRole}</div>
        )}
      </div>

      <Icon path={ICONS.chevron} size={14} color={iconColor} />
    </button>
  )
}

// ─── Search bar ───────────────────────────────────────────────────────────────

function SearchBar({ placeholder, textColor, iconColor, borderColor }: {
  placeholder: string
  textColor: string
  iconColor: string
  borderColor: string
}) {
  return (
    <div style={{
      position: 'relative',
      display: 'flex',
      alignItems: 'center',
      minWidth: 0,
      flex: '1 1 0',
      maxWidth: 320,
    }}>
      <span style={{ position: 'absolute', left: 10, pointerEvents: 'none', display: 'flex', alignItems: 'center' }}>
        <Icon path={ICONS.search} size={15} color={iconColor} />
      </span>
      <input
        type="text"
        placeholder={placeholder}
        readOnly
        aria-label="Search"
        style={{
          width: '100%',
          height: 34,
          paddingLeft: 32,
          paddingRight: 12,
          border: `1px solid ${borderColor}`,
          borderRadius: 8,
          background: 'transparent',
          color: textColor,
          fontSize: '0.8125rem',
          outline: 'none',
          cursor: 'text',
          boxSizing: 'border-box',
        }}
      />
    </div>
  )
}

// ─── Breadcrumb ───────────────────────────────────────────────────────────────

function Breadcrumb({ breadcrumbLabel, pageTitle, textColor, iconColor }: {
  breadcrumbLabel?: string
  pageTitle?: string
  textColor: string
  iconColor: string
}) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 6, minWidth: 0, flexShrink: 0 }}>
      {breadcrumbLabel && (
        <>
          <span style={{ fontSize: '0.875rem', color: iconColor, whiteSpace: 'nowrap' }}>{breadcrumbLabel}</span>
          <Icon path={ICONS.slash} size={12} color={iconColor} />
        </>
      )}
      {pageTitle && (
        <span style={{ fontSize: '0.875rem', fontWeight: 600, color: textColor, whiteSpace: 'nowrap' }}>{pageTitle}</span>
      )}
    </div>
  )
}

// ─── Custom / default render ──────────────────────────────────────────────────

function CustomTopHeader({
  tokens,
  height,
  pageTitle,
  breadcrumbLabel,
  showSearch,
  searchPlaceholder,
  showNotifications,
  notificationCount,
  showMessages,
  messageCount,
  showSettings,
  showHelp,
  showThemeToggle,
  showProfile,
  profileName,
  profileRole,
  profileSrc,
  profileInitials,
  isBlur,
  style,
}: {
  tokens: TopHeaderPresetTokens
  height: number
  pageTitle?: string
  breadcrumbLabel?: string
  showSearch?: boolean
  searchPlaceholder?: string
  showNotifications?: boolean
  notificationCount?: number
  showMessages?: boolean
  messageCount?: number
  showSettings?: boolean
  showHelp?: boolean
  showThemeToggle?: boolean
  showProfile?: boolean
  profileName?: string
  profileRole?: string
  profileSrc?: string
  profileInitials?: string
  isBlur?: boolean
  style?: React.CSSProperties
}) {
  return (
    <header
      style={{
        display: 'flex',
        alignItems: 'center',
        height,
        padding: '0 20px',
        backgroundColor: tokens.bg,
        borderBottom: `1px solid ${tokens.border}`,
        boxShadow: tokens.shadow ? '0 1px 4px rgba(0,0,0,0.07)' : 'none',
        backdropFilter: isBlur ? 'blur(12px)' : undefined,
        WebkitBackdropFilter: isBlur ? 'blur(12px)' : undefined,
        gap: 12,
        boxSizing: 'border-box',
        width: '100%',
        position: 'relative',
        ...style,
      }}
      role="banner"
    >
      {/* Left: breadcrumb / page title */}
      {(breadcrumbLabel || pageTitle) && (
        <div style={{ flexShrink: 0 }}>
          <Breadcrumb
            breadcrumbLabel={breadcrumbLabel}
            pageTitle={pageTitle}
            textColor={tokens.text}
            iconColor={tokens.icon}
          />
        </div>
      )}

      {/* Center: search */}
      {showSearch && (
        <div style={{ flex: 1, display: 'flex', justifyContent: 'center', minWidth: 0, padding: '0 16px' }}>
          <SearchBar
            placeholder={searchPlaceholder || 'Search…'}
            textColor={tokens.text}
            iconColor={tokens.icon}
            borderColor={tokens.border}
          />
        </div>
      )}

      {/* Spacer when no search */}
      {!showSearch && <div style={{ flex: 1 }} />}

      {/* Right: action icons */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 2, flexShrink: 0 }}>
        {showHelp && (
          <IconBtn path={ICONS.help} iconColor={tokens.icon} label="Help & docs" />
        )}
        {showThemeToggle && (
          <IconBtn path={ICONS.sun} iconColor={tokens.icon} label="Toggle theme" />
        )}
        {showMessages && (
          <IconBtn path={ICONS.mail} count={messageCount} iconColor={tokens.icon} label="Messages" />
        )}
        {showNotifications && (
          <IconBtn path={ICONS.bell} count={notificationCount} iconColor={tokens.icon} label="Notifications" />
        )}
        {showSettings && (
          <IconBtn path={ICONS.settings} iconColor={tokens.icon} label="Settings" />
        )}

        {/* Divider before profile */}
        {showProfile && (
          <div style={{ width: 1, height: 24, backgroundColor: tokens.border, margin: '0 6px', flexShrink: 0 }} />
        )}

        {showProfile && profileName && (
          <ProfileAvatar
            profileName={profileName}
            profileSrc={profileSrc}
            profileInitials={profileInitials}
            profileRole={profileRole}
            textColor={tokens.text}
            iconColor={tokens.icon}
          />
        )}
      </div>
    </header>
  )
}

// ─── Bootstrap variant ────────────────────────────────────────────────────────

function BootstrapTopHeader({ tokens, height, uid, ...rest }: {
  tokens: TopHeaderPresetTokens
  height: number
  uid: string
  pageTitle?: string
  breadcrumbLabel?: string
  showSearch?: boolean
  searchPlaceholder?: string
  showNotifications?: boolean
  notificationCount?: number
  showMessages?: boolean
  messageCount?: number
  showSettings?: boolean
  showHelp?: boolean
  showThemeToggle?: boolean
  showProfile?: boolean
  profileName?: string
  profileRole?: string
  profileSrc?: string
  profileInitials?: string
  style?: React.CSSProperties
}) {
  const { pageTitle, breadcrumbLabel, showSearch, searchPlaceholder,
    showNotifications, notificationCount, showMessages, messageCount,
    showSettings, showHelp, showThemeToggle, showProfile,
    profileName, profileRole, profileSrc, profileInitials, style } = rest

  const initials = profileInitials || (profileName || '').split(' ').map((p) => p[0]).join('').slice(0, 2).toUpperCase()

  return (
    <header
      className="d-flex align-items-center px-3 border-bottom"
      style={{
        height,
        backgroundColor: tokens.bg,
        borderColor: tokens.border,
        boxShadow: tokens.shadow ? '0 1px 4px rgba(0,0,0,.07)' : 'none',
        gap: 12,
        boxSizing: 'border-box',
        width: '100%',
        ...style,
      }}
    >
      {/* Breadcrumb */}
      {(breadcrumbLabel || pageTitle) && (
        <nav aria-label="breadcrumb" className="d-flex align-items-center gap-1 flex-shrink-0">
          {breadcrumbLabel && (
            <span className="small" style={{ color: tokens.icon }}>{breadcrumbLabel}</span>
          )}
          {breadcrumbLabel && pageTitle && (
            <Icon path={ICONS.slash} size={12} color={tokens.icon} />
          )}
          {pageTitle && (
            <span className="small fw-semibold" style={{ color: tokens.text }}>{pageTitle}</span>
          )}
        </nav>
      )}

      {/* Search */}
      {showSearch && (
        <div className="position-relative flex-grow-1 mx-3" style={{ maxWidth: 320 }}>
          <span className="position-absolute top-50 translate-middle-y ms-2">
            <Icon path={ICONS.search} size={14} color={tokens.icon} />
          </span>
          <input
            type="search"
            className="form-control form-control-sm ps-4"
            placeholder={searchPlaceholder || 'Search…'}
            style={{ backgroundColor: 'transparent', borderColor: tokens.border, color: tokens.text }}
            readOnly
          />
        </div>
      )}

      {/* Spacer */}
      {!showSearch && <div className="flex-grow-1" />}

      {/* Actions */}
      <div className="d-flex align-items-center gap-1 flex-shrink-0">
        {showHelp && (
          <button className="btn btn-sm btn-link p-1" aria-label="Help" style={{ color: tokens.icon }}>
            <Icon path={ICONS.help} size={18} color={tokens.icon} />
          </button>
        )}
        {showThemeToggle && (
          <button className="btn btn-sm btn-link p-1" aria-label="Toggle theme" style={{ color: tokens.icon }}>
            <Icon path={ICONS.sun} size={18} color={tokens.icon} />
          </button>
        )}
        {showMessages && (
          <div className="position-relative">
            <button className="btn btn-sm btn-link p-1" aria-label="Messages" style={{ color: tokens.icon }}>
              <Icon path={ICONS.mail} size={18} color={tokens.icon} />
            </button>
            {messageCount !== undefined && messageCount > 0 && (
              <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger" style={{ fontSize: '0.6rem' }}>
                {messageCount > 99 ? '99+' : messageCount}
              </span>
            )}
          </div>
        )}
        {showNotifications && (
          <div className="position-relative">
            <button className="btn btn-sm btn-link p-1" aria-label="Notifications" style={{ color: tokens.icon }}>
              <Icon path={ICONS.bell} size={18} color={tokens.icon} />
            </button>
            {notificationCount !== undefined && notificationCount > 0 && (
              <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger" style={{ fontSize: '0.6rem' }}>
                {notificationCount > 99 ? '99+' : notificationCount}
              </span>
            )}
          </div>
        )}
        {showSettings && (
          <button className="btn btn-sm btn-link p-1" aria-label="Settings" style={{ color: tokens.icon }}>
            <Icon path={ICONS.settings} size={18} color={tokens.icon} />
          </button>
        )}

        {showProfile && profileName && (
          <>
            <div className="vr mx-2" style={{ opacity: 0.4 }} />
            <div className="dropdown">
              <button
                className="btn btn-sm btn-link p-0 d-flex align-items-center gap-2 text-decoration-none"
                id={`${uid}-profile`}
                data-bs-toggle="dropdown"
                aria-expanded="false"
              >
                <div className="rounded-circle d-flex align-items-center justify-content-center overflow-hidden flex-shrink-0"
                  style={{ width: 30, height: 30, background: 'linear-gradient(135deg,#4f46e5,#06b6d4)' }}>
                  {profileSrc
                    // eslint-disable-next-line @next/next/no-img-element
                    ? <img src={profileSrc} alt={profileName} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    : <span style={{ color: '#fff', fontSize: '0.7rem', fontWeight: 700 }}>{initials}</span>
                  }
                </div>
                <div className="d-none d-md-block text-start lh-sm">
                  <div className="small fw-semibold" style={{ color: tokens.text }}>{profileName}</div>
                  {profileRole && <div style={{ fontSize: '0.68rem', color: tokens.icon }}>{profileRole}</div>}
                </div>
                <Icon path={ICONS.chevron} size={14} color={tokens.icon} />
              </button>
              <ul className="dropdown-menu dropdown-menu-end">
                <li><a className="dropdown-item small" href="#">Profile</a></li>
                <li><a className="dropdown-item small" href="#">Settings</a></li>
                <li><hr className="dropdown-divider" /></li>
                <li><a className="dropdown-item small text-danger" href="#">Sign out</a></li>
              </ul>
            </div>
          </>
        )}
      </div>
    </header>
  )
}

// ─── Tailwind variant ─────────────────────────────────────────────────────────

function TailwindTopHeader({ tokens, height, ...rest }: {
  tokens: TopHeaderPresetTokens
  height: number
  pageTitle?: string
  breadcrumbLabel?: string
  showSearch?: boolean
  searchPlaceholder?: string
  showNotifications?: boolean
  notificationCount?: number
  showMessages?: boolean
  messageCount?: number
  showSettings?: boolean
  showHelp?: boolean
  showThemeToggle?: boolean
  showProfile?: boolean
  profileName?: string
  profileRole?: string
  profileSrc?: string
  profileInitials?: string
  style?: React.CSSProperties
}) {
  const { style, ...shared } = rest
  return (
    <CustomTopHeader
      tokens={tokens}
      height={height}
      style={{
        backgroundColor: tokens.bg,
        borderBottom: `1px solid ${tokens.border}`,
        ...style,
      }}
      {...shared}
    />
  )
}

// ─── MUI variant ─────────────────────────────────────────────────────────────

function MuiTopHeader({ tokens, height, ...rest }: {
  tokens: TopHeaderPresetTokens
  height: number
  pageTitle?: string
  breadcrumbLabel?: string
  showSearch?: boolean
  searchPlaceholder?: string
  showNotifications?: boolean
  notificationCount?: number
  showMessages?: boolean
  messageCount?: number
  showSettings?: boolean
  showHelp?: boolean
  showThemeToggle?: boolean
  showProfile?: boolean
  profileName?: string
  profileRole?: string
  profileSrc?: string
  profileInitials?: string
  style?: React.CSSProperties
}) {
  const { style, ...shared } = rest
  return (
    <CustomTopHeader
      tokens={tokens}
      height={height}
      style={{ backgroundColor: tokens.bg, borderBottom: `1px solid ${tokens.border}`, ...style }}
      {...shared}
    />
  )
}

// ─── Main export ──────────────────────────────────────────────────────────────

const TopHeaderElement = memo(function TopHeaderElement({
  preset = 'light',
  height = 60,
  bg,
  borderColor,
  textColor,
  iconColor,
  shadow,
  pageTitle = 'Dashboard',
  breadcrumbLabel = 'Home',
  showSearch = true,
  searchPlaceholder = 'Search…',
  showNotifications = true,
  notificationCount = 3,
  showMessages = false,
  messageCount = 0,
  showSettings = false,
  showHelp = false,
  showThemeToggle = true,
  showProfile = true,
  profileName = 'John Doe',
  profileRole = 'Administrator',
  profileSrc,
  profileInitials,
  showLogo = false,
  logoText,
  logoSrc,
  containerLayout = 'fluid',
  maxWidth = '100%',
  paddingX = 20,
  actionGap = 2,
  showProfileDivider = true,
  style,
}: Props) {
  const framework = useFramework()
  const uid = useId().replace(/:/g, '')

  // Merge preset tokens with per-element overrides
  const base = TOP_HEADER_PRESETS[preset] ?? TOP_HEADER_PRESETS.light
  const tokens: TopHeaderPresetTokens = {
    bg:     bg           ?? base.bg,
    border: borderColor  ?? base.border,
    text:   textColor    ?? base.text,
    icon:   iconColor    ?? base.icon,
    shadow: shadow       ?? base.shadow,
  }

  // Wrapper style: when 'centered', the outer <header> spans full width with bg,
  // but inner content is constrained to maxWidth. When 'fluid', use full width.
  const isCentered = containerLayout === 'centered'
  const wrapperStyle: React.CSSProperties = {
    width: '100%',
    ...style,
  }
  const innerWidthStyle: React.CSSProperties | undefined = isCentered
    ? { maxWidth, margin: '0 auto', width: '100%' }
    : undefined

  // Build inner: the actual header. We pass paddingX via style so the existing variants honour it.
  const adjustedStyle: React.CSSProperties = {
    ...wrapperStyle,
    paddingLeft: paddingX,
    paddingRight: paddingX,
  }

  const innerShared = {
    tokens,
    height,
    pageTitle,
    breadcrumbLabel,
    showSearch,
    searchPlaceholder,
    showNotifications,
    notificationCount,
    showMessages,
    messageCount,
    showSettings,
    showHelp,
    showThemeToggle,
    showProfile,
    profileName,
    profileRole,
    profileSrc,
    profileInitials,
    style: adjustedStyle,
  }

  let inner: React.ReactNode
  if (framework === 'bootstrap') {
    inner = <BootstrapTopHeader {...innerShared} uid={uid} />
  } else if (framework === 'tailwind') {
    inner = <TailwindTopHeader {...innerShared} />
  } else if (framework === 'mui') {
    inner = <MuiTopHeader {...innerShared} />
  } else {
    inner = <CustomTopHeader {...innerShared} isBlur={preset === 'blur'} />
  }

  // Wrap in centered container when needed
  if (isCentered) {
    return (
      <div style={{ width: '100%', background: tokens.bg }}>
        <div style={{ maxWidth, margin: '0 auto', width: '100%' }}>
          {inner}
        </div>
      </div>
    )
  }

  return <>{inner}</>
})

export default TopHeaderElement
