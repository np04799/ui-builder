// ─────────────────────────────────────────────────────────────────────────────
// Primitives
// ─────────────────────────────────────────────────────────────────────────────

export type BuilderMode = 'bootstrap' | 'mui' | 'tailwind' | 'custom'

export type Breakpoint = 'desktop' | 'tablet' | 'mobile'

/** Alias for Breakpoint — used in builder UI state (responsive preview toggle) */
export type ResponsiveMode = Breakpoint

/** CSS property → value map (camelCase keys, string values) */
export type StyleMap = Record<string, string>

/** Per-breakpoint style overrides — merged onto base styles at render/export time */
export type ResponsiveStyles = Partial<Record<Breakpoint, StyleMap>>

// ─────────────────────────────────────────────────────────────────────────────
// Element content — discriminated union per element type
// ─────────────────────────────────────────────────────────────────────────────

export type HeadingLevel = 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6'
export type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'ghost'
export type ObjectFit = 'cover' | 'contain' | 'fill'
export type VideoProvider = 'youtube' | 'vimeo'
export type FormFieldType = 'text' | 'email' | 'textarea' | 'select' | 'checkbox' | 'radio'
export type FormStylePreset = 'default' | 'flat' | 'card' | 'floating' | 'minimal' | 'glass'

export interface NavItem {
  id: string
  label: string
  href: string
  target?: '_blank' | '_self'
  /** Submenu items (one level deep, desktop only) */
  children?: { id: string; label: string; href: string }[]
}

export interface FormField {
  id: string
  type: FormFieldType
  label: string
  placeholder?: string
  required?: boolean
  options?: string[]
}

// ─────────────────────────────────────────────────────────────────────────────
// Chart / KPI types
// ─────────────────────────────────────────────────────────────────────────────

export interface ChartDataset {
  label: string
  data: number[]
  color?: string
}

export interface ScatterDataset {
  label: string
  data: { x: number; y: number }[]
  color?: string
}

export interface GaugeThreshold {
  value: number
  color: string
}

export type ChartDataSourceType = 'json' | 'csv' | 'api'

export interface ChartDataSource {
  sourceType: ChartDataSourceType
  /** Raw JSON string (when sourceType === 'json') */
  jsonRaw?: string
  /** CSV string (when sourceType === 'csv') */
  csvRaw?: string
  /** API endpoint URL (when sourceType === 'api') */
  apiUrl?: string
  /** HTTP method for API (default: GET) */
  apiMethod?: 'GET' | 'POST'
}

export type ElementContent =
  | { type: 'heading'; level: HeadingLevel; text: string }
  | { type: 'paragraph'; text: string }
  | {
      type: 'button'
      text: string
      href: string
      variant: ButtonVariant
      target?: '_blank' | '_self'
    }
  | { type: 'image'; src: string; alt: string; objectFit: ObjectFit }
  | { type: 'video'; src: string; provider: VideoProvider }
  | { type: 'divider' }
  | { type: 'spacer'; height: string }
  | { type: 'icon'; name: string; size: string; color: string }
  | { type: 'form'; fields: FormField[]; submitLabel: string; formStyle?: FormStylePreset }
  | {
      type: 'navbar'
      /** Logo */
      logoType: 'text' | 'image'
      logoText: string
      logoSrc?: string
      /** Per-breakpoint logo visibility */
      logoVisibility?: { desktop?: boolean; tablet?: boolean; mobile?: boolean }
      /** Nav links (shared across all breakpoints) */
      items: NavItem[]
      /** CTA button */
      cta?: NavbarCta
      /** Desktop layout */
      desktopLayout?: 'left' | 'center' | 'right'
      /** Mobile: at what pixel width to switch to hamburger */
      mobileBreakpoint?: number
      /** Mobile menu open style */
      mobileMenuStyle?: 'drawer-left' | 'drawer-right' | 'fullscreen'
      /** Mobile menu colours */
      mobilePanelBg?: string
      mobileTextColor?: string
      /** Show CTA on mobile */
      showCtaMobile?: boolean
    }
  | {
      type: 'hero'
      heading: string
      paragraph: string
      cta: { text: string; href: string }
      backgroundImage?: string
    }
  | {
      type: 'card'
      image: { src: string; alt: string }
      title: string
      description: string
      button?: { text: string; href: string }
    }
  | { type: 'footer'; links: NavItem[]; copyright: string; socials?: NavItem[] }
  | {
      type: 'banner-3d'
      heading: string
      subtext: string
      cta: string
      ctaHref: string
    }
  | {
      type: 'banner-morph'
      heading: string
      subtext: string
      badge: string
      cta: string
      ctaHref: string
    }
  | {
      type: 'banner-ticker'
      heading: string
      subtext: string
      cta: string
      ctaHref: string
      tickerItems: string[]
    }
  | {
      type: 'banner-split'
      heading: string
      subtext: string
      cta: string
      ctaHref: string
      ctaSecondary: string
      stats: { value: string; label: string }[]
    }
  | { type: 'banner-glass'; heading: string; subtext: string; cta: string; ctaHref: string }
  | { type: 'banner-neon'; heading: string; subtext: string; cta: string; ctaHref: string }
  | { type: 'banner-aurora'; heading: string; subtext: string; badge: string; cta: string; ctaHref: string }
  | { type: 'banner-retro'; heading: string; subtext: string; cta: string; ctaHref: string }
  | { type: 'banner-particle'; heading: string; subtext: string; cta: string; ctaHref: string }
  | {
      type: 'tabs'
      tabs: { id: string; label: string; content: string }[]
      activeTab?: number
      variant?: 'line' | 'pill' | 'boxed'
    }
  | {
      type: 'accordion'
      items: { id: string; title: string; content: string; defaultOpen?: boolean }[]
      allowMultiple?: boolean
      variant?: 'default' | 'flush' | 'bordered'
    }
  | {
      type: 'tooltip'
      label: string
      tip: string
      position?: 'top' | 'bottom' | 'left' | 'right'
      triggerStyle?: 'underline' | 'icon' | 'button'
    }
  | {
      type: 'modal'
      triggerText: string
      triggerVariant?: 'primary' | 'secondary' | 'outline' | 'ghost'
      title: string
      body: string
      confirmText?: string
      cancelText?: string
    }
  | {
      type: 'carousel'
      slides: { id: string; image: string; heading?: string; caption?: string }[]
      autoplay?: boolean
      interval?: number
      showDots?: boolean
      showArrows?: boolean
      aspectRatio?: '16/9' | '4/3' | '1/1'
    }
  | {
      type: 'list'
      items: { id: string; text: string }[]
      markerColor?: string
    }
  | {
      type: 'ordered-list'
      items: { id: string; text: string }[]
      markerColor?: string
    }
  | {
      type: 'checklist'
      items: { id: string; text: string; checked?: boolean }[]
      checkedColor?: string
    }
  | {
      type: 'icon-list'
      items: { id: string; text: string }[]
      iconColor?: string
    }

  | {
      type: 'hamburger-menu'
      /** Visual style variant */
      menuStyle: 'left-drawer' | 'right-drawer' | 'fullscreen'
      /** Open animation: slide or fade */
      animation: 'slide' | 'fade'
      /** Hamburger icon style */
      iconStyle: '3lines' | '3lines-x' | 'dots'
      /** Logo in the panel header */
      logoType?: 'text' | 'image'
      logoText?: string
      logoSrc?: string
      /** Logo alignment inside the panel */
      logoAlign?: 'left' | 'center' | 'right'
      /** Menu links */
      links: { id: string; label: string; href: string; target?: '_blank' | '_self' }[]
      /** Optional CTA button inside the menu */
      cta?: { text: string; href: string; variant: ButtonVariant }
      /** Colours */
      overlayColor?: string
      panelBg?: string
      textColor?: string
      /** Close on overlay click */
      closeOnOverlay?: boolean
      /** Drawer width in px (ignored for fullscreen) */
      drawerWidth?: number
    }

  | {
      type: 'chart-bar'
      orientation?: 'vertical' | 'horizontal'
      title?: string
      labels: string[]
      datasets: ChartDataset[]
      showLegend?: boolean
      showGrid?: boolean
      dataSource?: ChartDataSource
    }
  | {
      type: 'chart-line'
      title?: string
      labels: string[]
      datasets: ChartDataset[]
      showLegend?: boolean
      showGrid?: boolean
      smooth?: boolean
      dataSource?: ChartDataSource
    }
  | {
      type: 'chart-area'
      title?: string
      labels: string[]
      datasets: ChartDataset[]
      showLegend?: boolean
      showGrid?: boolean
      smooth?: boolean
      dataSource?: ChartDataSource
    }
  | {
      type: 'chart-pie'
      title?: string
      labels: string[]
      datasets: ChartDataset[]
      showLegend?: boolean
      dataSource?: ChartDataSource
    }
  | {
      type: 'chart-donut'
      title?: string
      labels: string[]
      datasets: ChartDataset[]
      showLegend?: boolean
      cutout?: number
      dataSource?: ChartDataSource
    }
  | {
      type: 'chart-radar'
      title?: string
      labels: string[]
      datasets: ChartDataset[]
      showLegend?: boolean
      dataSource?: ChartDataSource
    }
  | {
      type: 'chart-polar'
      title?: string
      labels: string[]
      datasets: ChartDataset[]
      showLegend?: boolean
      dataSource?: ChartDataSource
    }
  | {
      type: 'chart-scatter'
      title?: string
      datasets: ScatterDataset[]
      showLegend?: boolean
      showGrid?: boolean
      dataSource?: ChartDataSource
    }
  | {
      type: 'chart-gauge'
      title?: string
      value: number
      min?: number
      max?: number
      thresholds?: GaugeThreshold[]
      showLabel?: boolean
      dataSource?: ChartDataSource
    }

  | {
      type: 'drawer'
      triggerText: string
      triggerVariant: ButtonVariant
      position: 'left' | 'right' | 'top' | 'bottom'
      /** 'modal' = overlay + trigger button; 'persistent' = always visible, collapsible */
      displayMode?: 'modal' | 'persistent'
      /** 'overlay' = floats over content; 'push' = shifts page layout */
      expandBehavior?: 'overlay' | 'push'
      width?: number
      collapsedWidth?: number
      height?: number
      collapsedHeight?: number
      defaultCollapsed?: boolean
      title: string
      subtitle?: string
      logoText?: string
      logoSrc?: string
      navItems?: { id: string; label: string; href: string; icon?: string; badge?: string }[]
      footerText?: string
      overlayColor?: string
      panelBg?: string
      headerBg?: string
      accentColor?: string
      textColor?: string
      closeOnOverlay?: boolean
      /** Sidebar drawer visibility (persistent mode only) */
      showDrawer?: boolean
      /** ID of the sibling content column rendered in the app-shell's right area */
      contentColumnId?: string
      /** Top header bar (merged into the app-shell layout) */
      showTopHeader?: boolean
      topHeaderHeight?: number
      topHeaderBg?: string
      topHeaderBorderColor?: string
      topHeaderTextColor?: string
      topHeaderIconColor?: string
      topHeaderShadow?: boolean
      topHeaderPageTitle?: string
      topHeaderShowSearch?: boolean
      topHeaderSearchPlaceholder?: string
      topHeaderShowNotifications?: boolean
      topHeaderNotificationCount?: number
      topHeaderShowMessages?: boolean
      topHeaderMessageCount?: number
      topHeaderShowSettings?: boolean
      topHeaderShowHelp?: boolean
      topHeaderShowProfile?: boolean
      topHeaderProfileName?: string
      topHeaderProfileRole?: string
      topHeaderProfileSrc?: string
      topHeaderProfileInitials?: string
    }

  | {
      type: 'top-header'
      /** Visual preset applied */
      preset?: 'light' | 'dark' | 'indigo' | 'blur' | 'minimal'
      height?: number
      /** Background color (overrides preset) */
      bg?: string
      borderColor?: string
      textColor?: string
      iconColor?: string
      shadow?: boolean
      /** Page title shown after breadcrumb separator */
      pageTitle?: string
      /** Breadcrumb prefix label */
      breadcrumbLabel?: string
      /** Search bar */
      showSearch?: boolean
      searchPlaceholder?: string
      /** Notification bell */
      showNotifications?: boolean
      notificationCount?: number
      /** Messages icon */
      showMessages?: boolean
      messageCount?: number
      /** Settings icon */
      showSettings?: boolean
      /** Help / docs icon */
      showHelp?: boolean
      /** Theme toggle button */
      showThemeToggle?: boolean
      /** User profile pill */
      showProfile?: boolean
      profileName?: string
      profileRole?: string
      profileSrc?: string
      profileInitials?: string
      /** Mobile: collapse all icons to avatar only below this px */
      mobileBreakpoint?: number
      /** Logo (left side) */
      showLogo?: boolean
      logoText?: string
      logoSrc?: string
      /** Container layout: full-width or constrained to maxWidth */
      containerLayout?: 'fluid' | 'centered'
      /** Max width when containerLayout = 'centered' */
      maxWidth?: string
      /** Horizontal padding */
      paddingX?: number
      /** Gap between right-side action icons */
      actionGap?: number
      /** Show divider between actions and profile */
      showProfileDivider?: boolean
    }

  | {
      type: 'alert'
      variant: 'info' | 'success' | 'warning' | 'danger'
      title?: string
      message: string
      dismissible: boolean
      showIcon: boolean
    }
  | {
      type: 'badge'
      text: string
      variant: 'primary' | 'secondary' | 'success' | 'danger' | 'warning' | 'info' | 'light' | 'dark'
      pill: boolean
      size: 'sm' | 'md' | 'lg'
    }
  | {
      type: 'progress'
      label?: string
      value: number
      max: number
      showLabel: boolean
      variant: 'primary' | 'success' | 'danger' | 'warning' | 'info'
      striped: boolean
      animated: boolean
      height?: number
    }
  | {
      type: 'breadcrumb'
      items: { id: string; label: string; href: string; active?: boolean }[]
      separator?: string
    }
  | {
      type: 'stat-card'
      preset: 'minimal' | 'bordered' | 'filled' | 'gradient'
      label: string
      value: string
      subtext?: string
      trend?: 'up' | 'down' | 'neutral'
      trendValue?: string
      icon?: string
      iconBg?: string
      iconColor?: string
      accentColor?: string
    }
  | {
      type: 'pricing-card'
      preset: 'simple' | 'featured' | 'minimal' | 'bordered'
      planName: string
      price: string
      period: string
      description?: string
      features: { id: string; text: string; included: boolean }[]
      ctaText: string
      ctaHref: string
      ctaVariant: 'primary' | 'outline' | 'secondary'
      badge?: string
      highlighted: boolean
    }
  | {
      type: 'timeline'
      items: {
        id: string
        title: string
        description: string
        date?: string
        icon?: string
        color?: string
      }[]
      variant: 'default' | 'compact' | 'alternating'
    }
  | {
      type: 'avatar'
      src?: string
      name: string
      initials?: string
      size: 'xs' | 'sm' | 'md' | 'lg' | 'xl'
      shape: 'circle' | 'rounded' | 'square'
      status?: 'online' | 'offline' | 'busy' | 'away'
      /** Group mode: show stacked avatars */
      group?: boolean
      groupItems?: { id: string; src?: string; name: string; initials?: string }[]
      groupMax?: number
      bg?: string
      textColor?: string
    }
  | {
      type: 'section-block'
      /** Visual preset for the inner section */
      preset: 'plain' | 'card' | 'hero' | 'feature' | 'cta'
      /** HTML tag — Section by default but user can pick another semantic tag */
      tag?: 'section' | 'article' | 'aside' | 'main' | 'header' | 'footer' | 'div'
      heading?: string
      subtitle?: string
      content?: string
      bg?: string
      textColor?: string
      paddingY?: number
      paddingX?: number
      maxWidth?: string
      align?: 'left' | 'center' | 'right'
      showBorder?: boolean
    }
  | {
      type: 'div-container'
      tag: 'div' | 'span' | 'article' | 'aside' | 'nav' | 'header' | 'footer' | 'main'
      /** Optional inline content (mostly used for span/inline elements) */
      text?: string
      bg?: string
      textColor?: string
      padding?: number
      borderRadius?: number
      showBorder?: boolean
      borderColor?: string
      minHeight?: number
      display?: 'block' | 'inline' | 'inline-block' | 'flex' | 'inline-flex' | 'grid'
    }
  | {
      type: 'table'
      headers: { id: string; label: string }[]
      rows: { id: string; cells: { id: string; value: string }[] }[]
      variant: 'default' | 'striped' | 'bordered' | 'borderless' | 'hover' | 'striped-hover'
      size: 'sm' | 'md' | 'lg'
      responsive: boolean
      caption?: string
      headerStyle: 'default' | 'dark' | 'light'
    }

/** Derived union of all valid element type strings */
export type ElementType = ElementContent['type']

export interface NavbarCta {
  text: string
  href: string
  variant: ButtonVariant
}

// ─────────────────────────────────────────────────────────────────────────────
// Layout nodes  (Section → Row → Column → Element)
// ─────────────────────────────────────────────────────────────────────────────

export interface BuilderElement {
  id: string
  content: ElementContent
  /** Base styles — applied at all breakpoints */
  styles: StyleMap
  /** Per-breakpoint overrides — merged on top of base styles */
  responsive: ResponsiveStyles
  /**
   * Framework class string (Bootstrap col-*, Tailwind utilities).
   * Empty for MUI and Custom modes.
   */
  classNames?: string
  /** Optional user-defined HTML id attribute */
  htmlId?: string
  /** Optional human-readable name shown in Layers panel */
  name?: string
}

export interface BuilderColumn {
  id: string
  elements: BuilderElement[]
  styles: StyleMap
  responsive: ResponsiveStyles
  classNames?: string
  /** Optional user-defined HTML id attribute */
  htmlId?: string
  /** Optional human-readable name shown in Layers panel */
  name?: string
  /** When true, this column is managed by a parent element (e.g. DrawerElement) and should be skipped at the row level in all renderers */
  managedBy?: string
  /**
   * Grid span per breakpoint (1–12).
   * Bootstrap: col-{bp}-{span} | MUI: xs/sm/md prop | Tailwind: w-{n}/12 utility.
   * Custom mode ignores this — width is expressed in styles.
   */
  span?: Partial<Record<Breakpoint, number>>
  /** Direction in which child elements are arranged inside this column */
  direction?: 'vertical' | 'horizontal' | 'grid'
  /** Grid columns count when direction === 'grid' */
  gridColumns?: number
  /** Gap between elements inside this column */
  childGap?: string
}

export interface BuilderRow {
  id: string
  columns: BuilderColumn[]
  styles: StyleMap
  responsive: ResponsiveStyles
  classNames?: string
  htmlId?: string
  name?: string
  /** Column gap per breakpoint — interpreted by the export engine per mode */
  gap?: Partial<Record<Breakpoint, string>>
  /** When true, the builder hides the "Add Column" control — used by templates with fixed column layouts */
  locked?: boolean
}

export interface BuilderSection {
  id: string
  rows: BuilderRow[]
  styles: StyleMap
  responsive: ResponsiveStyles
  classNames?: string
  htmlId?: string
  name?: string
  background?: SectionBackground
}

export interface SectionBackground {
  type: 'color' | 'image' | 'gradient'
  value: string
}

// ─────────────────────────────────────────────────────────────────────────────
// Project
// ─────────────────────────────────────────────────────────────────────────────

export interface BuilderProject {
  id: string
  name: string
  mode: BuilderMode
  sections: BuilderSection[]
  createdAt: string
  updatedAt: string
}
