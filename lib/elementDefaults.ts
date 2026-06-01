import type { ElementContent } from '@/types/builder.types'

/** Returns a default ElementContent for a given element type string from the panel. */
export function defaultContentForType(elementType: string): ElementContent | null {
  switch (elementType) {
    // ── Typography ───────────────────────────────────────────────────────────
    case 'heading':
      return { type: 'heading', level: 'h2', text: 'Your Heading Here' }
    case 'paragraph':
    case 'text':
      return { type: 'paragraph', text: 'Add your text content here.' }
    case 'link':
      return { type: 'button', text: 'Link Text', href: '#', variant: 'ghost' }
    case 'list':
      return {
        type: 'list',
        items: [
          { id: crypto.randomUUID(), text: 'First item' },
          { id: crypto.randomUUID(), text: 'Second item' },
          { id: crypto.randomUUID(), text: 'Third item' },
        ],
        markerColor: 'currentColor',
      }
    case 'ordered-list':
      return {
        type: 'ordered-list',
        items: [
          { id: crypto.randomUUID(), text: 'First step' },
          { id: crypto.randomUUID(), text: 'Second step' },
          { id: crypto.randomUUID(), text: 'Third step' },
        ],
        markerColor: 'var(--color-primary)',
      }
    case 'checklist':
      return {
        type: 'checklist',
        items: [
          { id: crypto.randomUUID(), text: 'Task one', checked: true },
          { id: crypto.randomUUID(), text: 'Task two', checked: false },
          { id: crypto.randomUUID(), text: 'Task three', checked: false },
        ],
        checkedColor: '#10b981',
      }
    case 'icon-list':
      return {
        type: 'icon-list',
        items: [
          { id: crypto.randomUUID(), text: 'Feature one' },
          { id: crypto.randomUUID(), text: 'Feature two' },
          { id: crypto.randomUUID(), text: 'Feature three' },
        ],
        iconColor: 'var(--color-primary)',
      }
    case 'blockquote':
      return { type: 'paragraph', text: '"This is a blockquote. Add your quote here."' }

    // ── Basic / Interactive ───────────────────────────────────────────────────
    case 'button':
      return { type: 'button', text: 'Click Me', href: '#', variant: 'primary' }
    case 'divider':
      return { type: 'divider' }
    case 'spacer':
      return { type: 'spacer', height: '40px' }
    case 'icon':
      return { type: 'icon', name: 'star', size: '24px', color: 'currentColor' }

    // ── Media ────────────────────────────────────────────────────────────────
    case 'image':
    case 'image-media':
      return { type: 'image', src: '', alt: 'Image', objectFit: 'cover' }
    case 'video':
      return { type: 'video', src: '', provider: 'youtube' }
    case 'embed':
      return { type: 'video', src: '', provider: 'youtube' }
    case 'gallery':
      return { type: 'image', src: '', alt: 'Gallery image', objectFit: 'cover' }
    case 'map':
      return { type: 'image', src: '', alt: 'Map', objectFit: 'cover' }

    // ── Form fields ──────────────────────────────────────────────────────────
    case 'input':
      return {
        type: 'form',
        fields: [{ id: crypto.randomUUID(), type: 'text', label: 'Label', placeholder: 'Enter text…' }],
        submitLabel: 'Submit',
      }
    case 'email':
      return {
        type: 'form',
        fields: [{ id: crypto.randomUUID(), type: 'email', label: 'Email', placeholder: 'you@example.com' }],
        submitLabel: 'Submit',
      }
    case 'textarea':
      return {
        type: 'form',
        fields: [{ id: crypto.randomUUID(), type: 'textarea', label: 'Message', placeholder: 'Your message…' }],
        submitLabel: 'Submit',
      }
    case 'select':
      return {
        type: 'form',
        fields: [{ id: crypto.randomUUID(), type: 'select', label: 'Choose', options: ['Option 1', 'Option 2', 'Option 3'] }],
        submitLabel: 'Submit',
      }
    case 'checkbox':
      return {
        type: 'form',
        fields: [{ id: crypto.randomUUID(), type: 'checkbox', label: 'I agree to the terms', placeholder: 'I agree to the terms' }],
        submitLabel: 'Submit',
      }
    case 'radio':
      return {
        type: 'form',
        fields: [{ id: crypto.randomUUID(), type: 'radio', label: 'Choose one', options: ['Option A', 'Option B', 'Option C'] }],
        submitLabel: 'Submit',
      }
    case 'form':
      return {
        type: 'form',
        fields: [
          { id: crypto.randomUUID(), type: 'text', label: 'Name', placeholder: 'Your name' },
          { id: crypto.randomUUID(), type: 'email', label: 'Email', placeholder: 'you@example.com' },
          { id: crypto.randomUUID(), type: 'textarea', label: 'Message', placeholder: 'Your message…' },
        ],
        submitLabel: 'Send Message',
      }

    // ── Interactive ──────────────────────────────────────────────────────────
    case 'tabs':
      return {
        type: 'tabs',
        tabs: [
          { id: crypto.randomUUID(), label: 'Tab 1', content: 'Content for tab one.' },
          { id: crypto.randomUUID(), label: 'Tab 2', content: 'Content for tab two.' },
          { id: crypto.randomUUID(), label: 'Tab 3', content: 'Content for tab three.' },
        ],
        activeTab: 0,
        variant: 'line',
      }
    case 'accordion':
      return {
        type: 'accordion',
        items: [
          { id: crypto.randomUUID(), title: 'Section One', content: 'Content for section one goes here.', defaultOpen: true },
          { id: crypto.randomUUID(), title: 'Section Two', content: 'Content for section two goes here.' },
          { id: crypto.randomUUID(), title: 'Section Three', content: 'Content for section three goes here.' },
        ],
        allowMultiple: false,
        variant: 'default',
      }
    case 'tooltip':
      return {
        type: 'tooltip',
        label: 'Hover me',
        tip: 'This is a helpful tooltip.',
        position: 'top',
        triggerStyle: 'underline',
      }
    case 'modal':
      return {
        type: 'modal',
        triggerText: 'Open Modal',
        triggerVariant: 'primary',
        title: 'Modal Title',
        body: 'This is the modal body content. Add your message here.',
        confirmText: 'Confirm',
        cancelText: 'Cancel',
      }
    case 'carousel':
      return {
        type: 'carousel',
        slides: [
          { id: crypto.randomUUID(), image: '', heading: 'Slide One', caption: 'Add a caption here.' },
          { id: crypto.randomUUID(), image: '', heading: 'Slide Two', caption: 'Another caption.' },
          { id: crypto.randomUUID(), image: '', heading: 'Slide Three', caption: 'And another.' },
        ],
        autoplay: false,
        interval: 4,
        showDots: true,
        showArrows: true,
        aspectRatio: '16/9',
      }

    // ── KPI Charts ───────────────────────────────────────────────────────────
    case 'chart-bar':
      return {
        type: 'chart-bar',
        title: 'Monthly Revenue',
        orientation: 'vertical',
        labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
        datasets: [
          { label: 'Revenue', data: [42, 58, 35, 74, 61, 89], color: '#6366f1' },
          { label: 'Target', data: [50, 55, 55, 60, 65, 80], color: '#10b981' },
        ],
        showLegend: true,
        showGrid: true,
      }
    case 'chart-line':
      return {
        type: 'chart-line',
        title: 'Weekly Active Users',
        labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
        datasets: [
          { label: 'This week', data: [120, 145, 132, 178, 165, 90, 75], color: '#6366f1' },
          { label: 'Last week', data: [100, 125, 115, 150, 140, 80, 60], color: '#f59e0b' },
        ],
        showLegend: true,
        showGrid: true,
        smooth: true,
      }
    case 'chart-area':
      return {
        type: 'chart-area',
        title: 'Cumulative Sales',
        labels: ['Q1', 'Q2', 'Q3', 'Q4'],
        datasets: [
          { label: 'Product A', data: [30, 65, 90, 140], color: '#6366f1' },
          { label: 'Product B', data: [20, 40, 75, 110], color: '#10b981' },
        ],
        showLegend: true,
        showGrid: true,
        smooth: true,
      }
    case 'chart-pie':
      return {
        type: 'chart-pie',
        title: 'Traffic Sources',
        labels: ['Organic', 'Direct', 'Referral', 'Social'],
        datasets: [{ label: 'Traffic', data: [40, 25, 20, 15] }],
        showLegend: true,
      }
    case 'chart-donut':
      return {
        type: 'chart-donut',
        title: 'Budget Allocation',
        labels: ['Marketing', 'Engineering', 'Operations', 'Sales'],
        datasets: [{ label: 'Budget', data: [30, 40, 15, 15] }],
        showLegend: true,
        cutout: 65,
      }
    case 'chart-radar':
      return {
        type: 'chart-radar',
        title: 'Skill Assessment',
        labels: ['Speed', 'Quality', 'Cost', 'Reliability', 'Innovation'],
        datasets: [
          { label: 'Team A', data: [80, 90, 70, 85, 75], color: '#6366f1' },
          { label: 'Team B', data: [70, 75, 85, 70, 90], color: '#f59e0b' },
        ],
        showLegend: true,
      }
    case 'chart-polar':
      return {
        type: 'chart-polar',
        title: 'Category Breakdown',
        labels: ['Category A', 'Category B', 'Category C', 'Category D', 'Category E'],
        datasets: [{ label: 'Values', data: [60, 85, 45, 70, 55] }],
        showLegend: true,
      }
    case 'chart-scatter':
      return {
        type: 'chart-scatter',
        title: 'Correlation Plot',
        datasets: [
          {
            label: 'Dataset A',
            data: [{ x: 10, y: 20 }, { x: 25, y: 45 }, { x: 35, y: 30 }, { x: 50, y: 70 }, { x: 65, y: 55 }],
            color: '#6366f1',
          },
          {
            label: 'Dataset B',
            data: [{ x: 15, y: 35 }, { x: 30, y: 25 }, { x: 45, y: 60 }, { x: 55, y: 40 }, { x: 70, y: 80 }],
            color: '#f59e0b',
          },
        ],
        showLegend: true,
        showGrid: true,
      }
    case 'chart-gauge':
      return {
        type: 'chart-gauge',
        title: 'Performance Score',
        value: 72,
        min: 0,
        max: 100,
        showLabel: true,
        thresholds: [
          { value: 33, color: '#10b981' },
          { value: 66, color: '#f59e0b' },
          { value: 100, color: '#ef4444' },
        ],
      }

    case 'top-header':
      return {
        type: 'top-header',
        preset: 'light',
        height: 60,
        pageTitle: 'Dashboard',
        breadcrumbLabel: 'Home',
        showSearch: true,
        searchPlaceholder: 'Search…',
        showNotifications: true,
        notificationCount: 3,
        showMessages: false,
        messageCount: 0,
        showSettings: false,
        showHelp: false,
        showThemeToggle: true,
        showProfile: true,
        profileName: 'John Doe',
        profileRole: 'Administrator',
        mobileBreakpoint: 768,
      }

    case 'hamburger-menu':
      return {
        type: 'hamburger-menu',
        menuStyle: 'left-drawer',
        animation: 'slide',
        iconStyle: '3lines',
        logoType: 'text',
        logoText: 'My Brand',
        logoAlign: 'left',
        closeOnOverlay: true,
        overlayColor: 'rgba(0,0,0,0.5)',
        panelBg: '#ffffff',
        textColor: '#111827',
        links: [
          { id: crypto.randomUUID(), label: 'Home', href: '#', target: '_self' },
          { id: crypto.randomUUID(), label: 'About', href: '#', target: '_self' },
          { id: crypto.randomUUID(), label: 'Services', href: '#', target: '_self' },
          { id: crypto.randomUUID(), label: 'Contact', href: '#', target: '_self' },
        ],
        cta: { text: 'Get Started', href: '#', variant: 'primary' },
      }

    // ── Sections / Blocks ────────────────────────────────────────────────────
    case 'hero':
      return {
        type: 'hero',
        heading: 'Welcome to Our Site',
        paragraph: 'Build something amazing with BuilderPro.',
        cta: { text: 'Get Started', href: '#' },
      }
    case 'card':
      return {
        type: 'card',
        image: { src: '', alt: 'Card image' },
        title: 'Card Title',
        description: 'Card description goes here.',
        button: { text: 'Learn More', href: '#' },
      }
    case 'navbar':
      return {
        type: 'navbar',
        logoType: 'text',
        logoText: 'Brand',
        logoVisibility: { desktop: true, tablet: true, mobile: true },
        items: [
          { id: crypto.randomUUID(), label: 'Home', href: '#' },
          { id: crypto.randomUUID(), label: 'About', href: '#' },
          { id: crypto.randomUUID(), label: 'Services', href: '#', children: [
            { id: crypto.randomUUID(), label: 'Web Design', href: '#' },
            { id: crypto.randomUUID(), label: 'Development', href: '#' },
          ]},
          { id: crypto.randomUUID(), label: 'Contact', href: '#' },
        ],
        cta: { text: 'Get Started', href: '#', variant: 'primary' },
        desktopLayout: 'right',
        mobileBreakpoint: 768,
        mobileMenuStyle: 'drawer-left',
        mobilePanelBg: '#ffffff',
        mobileTextColor: '#111827',
        showCtaMobile: true,
      }
    case 'footer':
      return {
        type: 'footer',
        links: [
          { id: '1', label: 'Privacy', href: '#' },
          { id: '2', label: 'Terms', href: '#' },
          { id: '3', label: 'Contact', href: '#' },
        ],
        copyright: `© ${new Date().getFullYear()} Your Company. All rights reserved.`,
      }

    // ── Animated Banners ─────────────────────────────────────────────────────
    case 'banner-3d':
      return {
        type: 'banner-3d',
        heading: 'Next-Gen Platform',
        subtext: 'Built for speed. Designed for scale.',
        cta: 'Get Started Free',
        ctaHref: '#',
      }
    case 'banner-morph':
      return {
        type: 'banner-morph',
        heading: 'Design Without Limits',
        subtext: 'A canvas that moves with your ideas.',
        badge: 'Creative Studio',
        cta: 'Start Creating',
        ctaHref: '#',
      }
    case 'banner-ticker':
      return {
        type: 'banner-ticker',
        heading: 'The Platform Pros Choose',
        subtext: 'Everything you need to ship world-class products.',
        cta: 'Start Free',
        ctaHref: '#',
        tickerItems: ['⚡ 10× Faster Builds', '🎨 Pixel-Perfect Design', '🚀 One-Click Deploy', '🔒 Enterprise Security'],
      }
    case 'banner-split':
      return {
        type: 'banner-split',
        heading: 'Ship Beautiful Products, Faster',
        subtext: 'The visual builder that replaces your whole frontend workflow.',
        cta: 'Start building free',
        ctaHref: '#',
        ctaSecondary: 'Watch demo',
        stats: [{ value: '50K+', label: 'Active users' }, { value: '99.9%', label: 'Uptime' }, { value: '2.4s', label: 'Load time' }],
      }
    case 'banner-glass':
      return { type: 'banner-glass', heading: 'The Future Is Transparent', subtext: 'Glassmorphism meets modern design.', cta: 'Explore Now', ctaHref: '#' }
    case 'banner-neon':
      return { type: 'banner-neon', heading: 'Glow Different', subtext: 'Neon aesthetics for the bold.', cta: 'Light It Up', ctaHref: '#' }
    case 'banner-aurora':
      return { type: 'banner-aurora', heading: 'Where Ideas Come Alive', subtext: 'Aurora-lit creativity, infinite possibilities.', badge: 'New Era', cta: 'Begin Your Journey', ctaHref: '#' }
    case 'banner-retro':
      return { type: 'banner-retro', heading: 'Retro Wave', subtext: 'Synthwave aesthetics for the digital age.', cta: 'Ride the Wave', ctaHref: '#' }
    case 'banner-particle':
      return { type: 'banner-particle', heading: 'Particles of Innovation', subtext: 'Every pixel has purpose.', cta: 'Join the Movement', ctaHref: '#' }

    case 'drawer':
      return {
        type: 'drawer',
        triggerText: 'Open Menu',
        triggerVariant: 'primary',
        position: 'left',
        displayMode: 'persistent',
        expandBehavior: 'push',
        width: 240,
        collapsedWidth: 60,
        height: 320,
        collapsedHeight: 60,
        defaultCollapsed: false,
        title: 'Navigation',
        subtitle: 'Main Menu',
        logoText: 'MyApp',
        navItems: [
          { id: crypto.randomUUID(), label: 'Dashboard', href: '#', icon: 'dashboard' },
          { id: crypto.randomUUID(), label: 'Analytics', href: '#', icon: 'analytics', badge: 'New' },
          { id: crypto.randomUUID(), label: 'Projects', href: '#', icon: 'folder' },
          { id: crypto.randomUUID(), label: 'Messages', href: '#', icon: 'mail', badge: '3' },
          { id: crypto.randomUUID(), label: 'Settings', href: '#', icon: 'settings' },
        ],
        footerText: '© 2025 MyApp',
        overlayColor: 'rgba(0,0,0,0.45)',
        panelBg: '#1e1e2e',
        headerBg: '#16162a',
        accentColor: '#6366f1',
        textColor: '#e2e8f0',
        closeOnOverlay: true,
        showTopHeader: true,
        topHeaderHeight: 60,
        topHeaderBg: '#ffffff',
        topHeaderBorderColor: '#e5e7eb',
        topHeaderTextColor: '#111827',
        topHeaderIconColor: '#6b7280',
        topHeaderShadow: true,
        topHeaderShowSearch: true,
        topHeaderSearchPlaceholder: 'Search…',
        topHeaderShowNotifications: true,
        topHeaderNotificationCount: 3,
        topHeaderShowMessages: true,
        topHeaderMessageCount: 0,
        topHeaderShowSettings: true,
        topHeaderShowHelp: false,
        topHeaderShowProfile: true,
        topHeaderProfileName: 'John Doe',
        topHeaderProfileRole: 'Administrator',
      }

    default:
      return { type: 'paragraph', text: elementType }
  }
}
