type IconProps = {
  className?: string
  style?: React.CSSProperties
}

function Svg({
  children,
  className,
  style,
}: {
  children: React.ReactNode
} & IconProps) {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 16 16"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      style={style}
    >
      {children}
    </svg>
  )
}

export function MonitorIcon(p: IconProps) {
  return (
    <Svg {...p}>
      <rect x="1" y="2" width="14" height="9" rx="1.5" />
      <path d="M5 14h6M8 11v3" />
    </Svg>
  )
}

export function TabletIcon(p: IconProps) {
  return (
    <Svg {...p}>
      <rect x="3.5" y="1" width="9" height="14" rx="1.5" />
      <circle cx="8" cy="13" r="0.75" fill="currentColor" stroke="none" />
    </Svg>
  )
}

export function MobileIcon(p: IconProps) {
  return (
    <Svg {...p}>
      <rect x="4.5" y="1" width="7" height="14" rx="1.5" />
      <circle cx="8" cy="13" r="0.75" fill="currentColor" stroke="none" />
    </Svg>
  )
}

export function UndoIcon(p: IconProps) {
  return (
    <Svg {...p}>
      <path d="M2 9a6 6 0 1 1 12 0" />
      <path d="M5 6L2 9l3 3" />
    </Svg>
  )
}

export function RedoIcon(p: IconProps) {
  return (
    <Svg {...p}>
      <path d="M14 9a6 6 0 1 0-12 0" />
      <path d="M11 6l3 3-3 3" />
    </Svg>
  )
}

export function SunIcon(p: IconProps) {
  return (
    <Svg {...p}>
      <circle cx="8" cy="8" r="2.5" />
      <path d="M8 1.5v1M8 13.5v1M1.5 8h1M13.5 8h1M3.4 3.4l.7.7M11.9 11.9l.7.7M3.4 12.6l.7-.7M11.9 4.1l.7-.7" />
    </Svg>
  )
}

export function MoonIcon(p: IconProps) {
  return (
    <Svg {...p}>
      <path d="M13 9.5A5.5 5.5 0 0 1 6.5 3a5.5 5.5 0 1 0 6.5 6.5z" />
    </Svg>
  )
}

export function GridIcon(p: IconProps) {
  return (
    <Svg {...p}>
      <rect x="1" y="1" width="6" height="6" rx="1" />
      <rect x="9" y="1" width="6" height="6" rx="1" />
      <rect x="1" y="9" width="6" height="6" rx="1" />
      <rect x="9" y="9" width="6" height="6" rx="1" />
    </Svg>
  )
}

export function LayersIcon(p: IconProps) {
  return (
    <Svg {...p}>
      <path d="M8 1L1 4.5l7 3.5 7-3.5L8 1z" />
      <path d="M1 8l7 3.5L15 8" />
      <path d="M1 11.5l7 3.5 7-3.5" />
    </Svg>
  )
}

export function TemplatesIcon(p: IconProps) {
  return (
    <Svg {...p}>
      <rect x="1" y="1" width="14" height="14" rx="1.5" />
      <path d="M1 6h14M8 6v8" />
    </Svg>
  )
}

export function SettingsIcon(p: IconProps) {
  return (
    <Svg {...p}>
      <path d="M1 4h14M1 8h14M1 12h14" />
      <circle cx="5" cy="4" r="1.75" fill="currentColor" stroke="none" />
      <circle cx="10" cy="8" r="1.75" fill="currentColor" stroke="none" />
      <circle cx="6" cy="12" r="1.75" fill="currentColor" stroke="none" />
    </Svg>
  )
}

export function CursorIcon(p: IconProps) {
  return (
    <Svg {...p}>
      <path d="M3 2l10 5.5-5.5 1.5-1.5 5.5L3 2z" />
    </Svg>
  )
}

export function DuplicateIcon(p: IconProps) {
  return (
    <Svg {...p}>
      <rect x="5.5" y="5.5" width="8" height="8" rx="1" />
      <path d="M5.5 10.5h-2a1 1 0 0 1-1-1v-6a1 1 0 0 1 1-1h6a1 1 0 0 1 1 1v2" />
    </Svg>
  )
}

export function TrashIcon(p: IconProps) {
  return (
    <Svg {...p}>
      <path d="M2.5 5h11M6 5V3.5a.5.5 0 0 1 .5-.5h3a.5.5 0 0 1 .5.5V5M12.5 5l-1 8.5h-7L3.5 5" />
    </Svg>
  )
}

export function ChevronUpIcon(p: IconProps) {
  return (
    <Svg {...p}>
      <path d="M3.5 10l4.5-5 4.5 5" />
    </Svg>
  )
}

export function ChevronDownIcon(p: IconProps) {
  return (
    <Svg {...p}>
      <path d="M3.5 6l4.5 5 4.5-5" />
    </Svg>
  )
}

export function ChevronLeftIcon(p: IconProps) {
  return (
    <Svg {...p}>
      <path d="M10 3.5l-5 4.5 5 4.5" />
    </Svg>
  )
}

export function ChevronRightIcon(p: IconProps) {
  return (
    <Svg {...p}>
      <path d="M6 3.5l5 4.5-5 4.5" />
    </Svg>
  )
}

export function SpacingIcon(p: IconProps) {
  return (
    <Svg {...p}>
      <rect x="4" y="4" width="8" height="8" rx="1" />
      <path d="M4 2H12M4 14H12M2 4V12M14 4V12" />
    </Svg>
  )
}

export function AlignmentIcon(p: IconProps) {
  return (
    <Svg {...p}>
      <path d="M2 4h12M4 8h8M2 12h12" />
    </Svg>
  )
}

export function CopyIcon(p: IconProps) {
  return (
    <Svg {...p}>
      <rect x="5" y="5" width="8" height="9" rx="1.5" />
      <path d="M10 5V3.5A1.5 1.5 0 0 0 8.5 2h-5A1.5 1.5 0 0 0 2 3.5v7A1.5 1.5 0 0 0 3.5 12H5" />
    </Svg>
  )
}

export function PasteIcon(p: IconProps) {
  return (
    <Svg {...p}>
      <rect x="4" y="4" width="9" height="10" rx="1.5" />
      <path d="M6 4V3a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v1" />
      <path d="M7 9h3M7 12h2" />
    </Svg>
  )
}
