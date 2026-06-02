import type { ElementContent, ElementType } from '@/types/builder.types'
import type { ReactElement } from 'react'
import HeadingElement from './HeadingElement'
import ParagraphElement from './ParagraphElement'
import ButtonElement from './ButtonElement'
import ImageElement from './ImageElement'
import DividerElement from './DividerElement'
import SpacerElement from './SpacerElement'
import IconElement from './IconElement'
import VideoElement from './VideoElement'
import FormElement from './FormElement'
import HeroElement from './HeroElement'
import CardElement from './CardElement'
import NavbarElement from './NavbarElement'
import FooterElement from './FooterElement'
import Banner3DElement from './Banner3DElement'
import BannerMorphElement from './BannerMorphElement'
import BannerTickerElement from './BannerTickerElement'
import BannerSplitElement from './BannerSplitElement'
import BannerGlassElement from './BannerGlassElement'
import BannerNeonElement from './BannerNeonElement'
import BannerAuroraElement from './BannerAuroraElement'
import BannerRetroElement from './BannerRetroElement'
import BannerParticleElement from './BannerParticleElement'
import TabsElement from './TabsElement'
import AccordionElement from './AccordionElement'
import TooltipElement from './TooltipElement'
import ModalElement from './ModalElement'
import CarouselElement from './CarouselElement'
import HamburgerMenuElement from './HamburgerMenuElement'
import DrawerElement from './DrawerElement'
import TopHeaderElement from './TopHeaderElement'
import AlertElement from './AlertElement'
import BadgeElement from './BadgeElement'
import ProgressElement from './ProgressElement'
import BreadcrumbElement from './BreadcrumbElement'
import StatCardElement from './StatCardElement'
import PricingCardElement from './PricingCardElement'
import TimelineElement from './TimelineElement'
import AvatarElement from './AvatarElement'
import SectionBlockElement from './SectionBlockElement'
import DivContainerElement from './DivContainerElement'
import TableElement from './TableElement'
import BulletListElement from './BulletListElement'
import OrderedListElement from './OrderedListElement'
import ChecklistElement from './ChecklistElement'
import IconListElement from './IconListElement'
import BarChartElement from './charts/BarChartElement'
import LineChartElement from './charts/LineChartElement'
import AreaChartElement from './charts/AreaChartElement'
import PieChartElement from './charts/PieChartElement'
import DonutChartElement from './charts/DonutChartElement'
import RadarChartElement from './charts/RadarChartElement'
import PolarChartElement from './charts/PolarChartElement'
import ScatterChartElement from './charts/ScatterChartElement'
import GaugeChartElement from './charts/GaugeChartElement'

export interface ElementRendererProps<T extends ElementContent = ElementContent> {
  content: T
  style?: React.CSSProperties
}

interface RegistryEntry<T extends ElementContent> {
  render: (props: ElementRendererProps<T>, elementId?: string) => ReactElement | null
}

type ElementRegistry = {
  [K in ElementType]?: RegistryEntry<Extract<ElementContent, { type: K }>>
}

export const ELEMENT_REGISTRY: ElementRegistry = {
  heading: {
    render: ({ content, style }) => (
      <HeadingElement level={content.level} text={content.text} style={style} />
    ),
  },

  paragraph: {
    render: ({ content, style }) => (
      <ParagraphElement text={content.text} style={style} />
    ),
  },

  list: {
    render: ({ content, style }, elementId) => (
      <BulletListElement elementId={elementId} items={content.items} markerColor={content.markerColor} style={style} />
    ),
  },

  'ordered-list': {
    render: ({ content, style }, elementId) => (
      <OrderedListElement elementId={elementId} items={content.items} markerColor={content.markerColor} style={style} />
    ),
  },

  checklist: {
    render: ({ content, style }, elementId) => (
      <ChecklistElement elementId={elementId} items={content.items} checkedColor={content.checkedColor} style={style} />
    ),
  },

  'icon-list': {
    render: ({ content, style }, elementId) => (
      <IconListElement elementId={elementId} items={content.items} iconColor={content.iconColor} style={style} />
    ),
  },

  button: {
    render: ({ content, style }) => (
      <ButtonElement
        text={content.text}
        href={content.href}
        variant={content.variant}
        target={content.target}
        style={style}
      />
    ),
  },

  image: {
    render: ({ content, style }) => (
      <ImageElement
        src={content.src}
        alt={content.alt}
        objectFit={content.objectFit}
        style={style}
      />
    ),
  },

  divider: {
    render: ({ style }) => <DividerElement style={style} />,
  },

  spacer: {
    render: ({ content, style }) => <SpacerElement height={content.height} style={style} />,
  },

  icon: {
    render: ({ content, style }) => (
      <IconElement name={content.name} size={content.size} color={content.color} style={style} />
    ),
  },

  video: {
    render: ({ content, style }) => (
      <VideoElement src={content.src} provider={content.provider} style={style} />
    ),
  },

  form: {
    render: ({ content, style }) => (
      <FormElement fields={content.fields} submitLabel={content.submitLabel} formStyle={content.formStyle} style={style} />
    ),
  },

  hero: {
    render: ({ content, style }) => (
      <HeroElement
        heading={content.heading}
        paragraph={content.paragraph}
        cta={content.cta}
        backgroundImage={content.backgroundImage}
        style={style}
      />
    ),
  },

  card: {
    render: ({ content, style }) => (
      <CardElement
        image={content.image}
        title={content.title}
        description={content.description}
        button={content.button}
        style={style}
      />
    ),
  },

  navbar: {
    render: ({ content, style }) => (
      <NavbarElement
        logoType={content.logoType}
        logoText={content.logoText}
        logoSrc={content.logoSrc}
        logoVisibility={content.logoVisibility}
        items={content.items}
        cta={content.cta}
        desktopLayout={content.desktopLayout}
        mobileBreakpoint={content.mobileBreakpoint}
        mobileMenuStyle={content.mobileMenuStyle}
        mobilePanelBg={content.mobilePanelBg}
        mobileTextColor={content.mobileTextColor}
        showCtaMobile={content.showCtaMobile}
        style={style}
      />
    ),
  },

  footer: {
    render: ({ content, style }) => (
      <FooterElement
        links={content.links}
        copyright={content.copyright}
        socials={content.socials}
        style={style}
      />
    ),
  },

  'banner-3d': {
    render: ({ content, style }) => (
      <Banner3DElement
        heading={content.heading}
        subtext={content.subtext}
        cta={content.cta}
        ctaHref={content.ctaHref}
        style={style}
      />
    ),
  },

  'banner-morph': {
    render: ({ content, style }) => (
      <BannerMorphElement
        heading={content.heading}
        subtext={content.subtext}
        badge={content.badge}
        cta={content.cta}
        ctaHref={content.ctaHref}
        style={style}
      />
    ),
  },

  'banner-ticker': {
    render: ({ content, style }) => (
      <BannerTickerElement
        heading={content.heading}
        subtext={content.subtext}
        cta={content.cta}
        ctaHref={content.ctaHref}
        tickerItems={content.tickerItems}
        style={style}
      />
    ),
  },

  'banner-split': {
    render: ({ content, style }) => (
      <BannerSplitElement
        heading={content.heading}
        subtext={content.subtext}
        cta={content.cta}
        ctaHref={content.ctaHref}
        ctaSecondary={content.ctaSecondary}
        stats={content.stats}
        style={style}
      />
    ),
  },

  'banner-glass': {
    render: ({ content, style }) => (
      <BannerGlassElement heading={content.heading} subtext={content.subtext} cta={content.cta} ctaHref={content.ctaHref} style={style} />
    ),
  },

  'banner-neon': {
    render: ({ content, style }) => (
      <BannerNeonElement heading={content.heading} subtext={content.subtext} cta={content.cta} ctaHref={content.ctaHref} style={style} />
    ),
  },

  'banner-aurora': {
    render: ({ content, style }) => (
      <BannerAuroraElement heading={content.heading} subtext={content.subtext} badge={content.badge} cta={content.cta} ctaHref={content.ctaHref} style={style} />
    ),
  },

  'banner-retro': {
    render: ({ content, style }) => (
      <BannerRetroElement heading={content.heading} subtext={content.subtext} cta={content.cta} ctaHref={content.ctaHref} style={style} />
    ),
  },

  'banner-particle': {
    render: ({ content, style }) => (
      <BannerParticleElement heading={content.heading} subtext={content.subtext} cta={content.cta} ctaHref={content.ctaHref} style={style} />
    ),
  },

  tabs: {
    render: ({ content, style }) => (
      <TabsElement
        tabs={content.tabs}
        activeTab={content.activeTab}
        variant={content.variant}
        style={style}
      />
    ),
  },

  accordion: {
    render: ({ content, style }) => (
      <AccordionElement
        items={content.items}
        allowMultiple={content.allowMultiple}
        variant={content.variant}
        style={style}
      />
    ),
  },

  tooltip: {
    render: ({ content, style }) => (
      <TooltipElement
        label={content.label}
        tip={content.tip}
        position={content.position}
        triggerStyle={content.triggerStyle}
        style={style}
      />
    ),
  },

  modal: {
    render: ({ content, style }) => (
      <ModalElement
        triggerText={content.triggerText}
        triggerVariant={content.triggerVariant}
        title={content.title}
        body={content.body}
        confirmText={content.confirmText}
        cancelText={content.cancelText}
        style={style}
      />
    ),
  },

  carousel: {
    render: ({ content, style }) => (
      <CarouselElement
        slides={content.slides}
        autoplay={content.autoplay}
        interval={content.interval}
        showDots={content.showDots}
        showArrows={content.showArrows}
        aspectRatio={content.aspectRatio}
        style={style}
      />
    ),
  },

  'chart-bar': {
    render: ({ content, style }) => (
      <BarChartElement title={content.title} orientation={content.orientation} labels={content.labels} datasets={content.datasets} showLegend={content.showLegend} showGrid={content.showGrid} style={style} />
    ),
  },
  'chart-line': {
    render: ({ content, style }) => (
      <LineChartElement title={content.title} labels={content.labels} datasets={content.datasets} showLegend={content.showLegend} showGrid={content.showGrid} smooth={content.smooth} style={style} />
    ),
  },
  'chart-area': {
    render: ({ content, style }) => (
      <AreaChartElement title={content.title} labels={content.labels} datasets={content.datasets} showLegend={content.showLegend} showGrid={content.showGrid} smooth={content.smooth} style={style} />
    ),
  },
  'chart-pie': {
    render: ({ content, style }) => (
      <PieChartElement title={content.title} labels={content.labels} datasets={content.datasets} showLegend={content.showLegend} style={style} />
    ),
  },
  'chart-donut': {
    render: ({ content, style }) => (
      <DonutChartElement title={content.title} labels={content.labels} datasets={content.datasets} showLegend={content.showLegend} cutout={content.cutout} style={style} />
    ),
  },
  'chart-radar': {
    render: ({ content, style }) => (
      <RadarChartElement title={content.title} labels={content.labels} datasets={content.datasets} showLegend={content.showLegend} style={style} />
    ),
  },
  'chart-polar': {
    render: ({ content, style }) => (
      <PolarChartElement title={content.title} labels={content.labels} datasets={content.datasets} showLegend={content.showLegend} style={style} />
    ),
  },
  'chart-scatter': {
    render: ({ content, style }) => (
      <ScatterChartElement title={content.title} datasets={content.datasets} showLegend={content.showLegend} showGrid={content.showGrid} style={style} />
    ),
  },
  'chart-gauge': {
    render: ({ content, style }) => (
      <GaugeChartElement title={content.title} value={content.value} min={content.min} max={content.max} thresholds={content.thresholds} showLabel={content.showLabel} style={style} />
    ),
  },

  drawer: {
    render: ({ content, style }) => (
      <DrawerElement
        triggerText={content.triggerText}
        triggerVariant={content.triggerVariant}
        position={content.position}
        displayMode={content.displayMode}
        expandBehavior={content.expandBehavior}
        width={content.width}
        collapsedWidth={content.collapsedWidth}
        height={content.height}
        collapsedHeight={content.collapsedHeight}
        defaultCollapsed={content.defaultCollapsed}
        title={content.title}
        subtitle={content.subtitle}
        logoText={content.logoText}
        logoSrc={content.logoSrc}
        navItems={content.navItems}
        footerText={content.footerText}
        overlayColor={content.overlayColor}
        panelBg={content.panelBg}
        headerBg={content.headerBg}
        accentColor={content.accentColor}
        textColor={content.textColor}
        closeOnOverlay={content.closeOnOverlay}
        showDrawer={content.showDrawer}
        contentColumnId={content.contentColumnId}
        showTopHeader={content.showTopHeader}
        topHeaderHeight={content.topHeaderHeight}
        topHeaderBg={content.topHeaderBg}
        topHeaderBorderColor={content.topHeaderBorderColor}
        topHeaderTextColor={content.topHeaderTextColor}
        topHeaderIconColor={content.topHeaderIconColor}
        topHeaderShadow={content.topHeaderShadow}
        topHeaderPageTitle={content.topHeaderPageTitle}
        topHeaderShowSearch={content.topHeaderShowSearch}
        topHeaderSearchPlaceholder={content.topHeaderSearchPlaceholder}
        topHeaderShowNotifications={content.topHeaderShowNotifications}
        topHeaderNotificationCount={content.topHeaderNotificationCount}
        topHeaderShowMessages={content.topHeaderShowMessages}
        topHeaderMessageCount={content.topHeaderMessageCount}
        topHeaderShowSettings={content.topHeaderShowSettings}
        topHeaderShowHelp={content.topHeaderShowHelp}
        topHeaderShowProfile={content.topHeaderShowProfile}
        topHeaderProfileName={content.topHeaderProfileName}
        topHeaderProfileRole={content.topHeaderProfileRole}
        topHeaderProfileSrc={content.topHeaderProfileSrc}
        topHeaderProfileInitials={content.topHeaderProfileInitials}
        style={style}
      />
    ),
  },

  'top-header': {
    render: ({ content, style }) => (
      <TopHeaderElement
        preset={content.preset}
        height={content.height}
        bg={content.bg}
        borderColor={content.borderColor}
        textColor={content.textColor}
        iconColor={content.iconColor}
        shadow={content.shadow}
        pageTitle={content.pageTitle}
        breadcrumbLabel={content.breadcrumbLabel}
        showSearch={content.showSearch}
        searchPlaceholder={content.searchPlaceholder}
        showNotifications={content.showNotifications}
        notificationCount={content.notificationCount}
        showMessages={content.showMessages}
        messageCount={content.messageCount}
        showSettings={content.showSettings}
        showHelp={content.showHelp}
        showThemeToggle={content.showThemeToggle}
        showProfile={content.showProfile}
        profileName={content.profileName}
        profileRole={content.profileRole}
        profileSrc={content.profileSrc}
        profileInitials={content.profileInitials}
        style={style}
      />
    ),
  },

  'alert': {
    render: ({ content, style }) => (
      <AlertElement
        variant={content.variant}
        title={content.title}
        message={content.message}
        dismissible={content.dismissible}
        showIcon={content.showIcon}
        style={style}
      />
    ),
  },

  'badge': {
    render: ({ content, style }) => (
      <BadgeElement
        text={content.text}
        variant={content.variant}
        pill={content.pill}
        size={content.size}
        style={style}
      />
    ),
  },

  'progress': {
    render: ({ content, style }) => (
      <ProgressElement
        label={content.label}
        value={content.value}
        max={content.max}
        showLabel={content.showLabel}
        variant={content.variant}
        striped={content.striped}
        animated={content.animated}
        height={content.height}
        style={style}
      />
    ),
  },

  'breadcrumb': {
    render: ({ content, style }) => (
      <BreadcrumbElement
        items={content.items}
        separator={content.separator}
        style={style}
      />
    ),
  },

  'stat-card': {
    render: ({ content, style }) => (
      <StatCardElement
        preset={content.preset}
        label={content.label}
        value={content.value}
        subtext={content.subtext}
        trend={content.trend}
        trendValue={content.trendValue}
        icon={content.icon}
        iconBg={content.iconBg}
        iconColor={content.iconColor}
        accentColor={content.accentColor}
        style={style}
      />
    ),
  },

  'pricing-card': {
    render: ({ content, style }) => (
      <PricingCardElement
        preset={content.preset}
        planName={content.planName}
        price={content.price}
        period={content.period}
        description={content.description}
        features={content.features}
        ctaText={content.ctaText}
        ctaHref={content.ctaHref}
        ctaVariant={content.ctaVariant}
        badge={content.badge}
        highlighted={content.highlighted}
        style={style}
      />
    ),
  },

  'timeline': {
    render: ({ content, style }) => (
      <TimelineElement
        items={content.items}
        variant={content.variant}
        style={style}
      />
    ),
  },

  'avatar': {
    render: ({ content, style }) => (
      <AvatarElement
        src={content.src}
        name={content.name}
        initials={content.initials}
        size={content.size}
        shape={content.shape}
        status={content.status}
        group={content.group}
        groupItems={content.groupItems}
        groupMax={content.groupMax}
        bg={content.bg}
        textColor={content.textColor}
        style={style}
      />
    ),
  },

  'section-block': {
    render: ({ content, style }) => (
      <SectionBlockElement
        preset={content.preset}
        tag={content.tag}
        heading={content.heading}
        subtitle={content.subtitle}
        content={content.content}
        bg={content.bg}
        textColor={content.textColor}
        paddingY={content.paddingY}
        paddingX={content.paddingX}
        maxWidth={content.maxWidth}
        align={content.align}
        showBorder={content.showBorder}
        style={style}
      />
    ),
  },

  'div-container': {
    render: ({ content, style }) => (
      <DivContainerElement
        tag={content.tag}
        text={content.text}
        bg={content.bg}
        textColor={content.textColor}
        padding={content.padding}
        borderRadius={content.borderRadius}
        showBorder={content.showBorder}
        borderColor={content.borderColor}
        minHeight={content.minHeight}
        display={content.display}
        style={style}
      />
    ),
  },

  'table': {
    render: ({ content, style }) => (
      <TableElement
        headers={content.headers}
        rows={content.rows}
        variant={content.variant}
        size={content.size}
        responsive={content.responsive}
        caption={content.caption}
        headerStyle={content.headerStyle}
        style={style}
      />
    ),
  },

  'hamburger-menu': {
    render: ({ content, style }) => (
      <HamburgerMenuElement
        menuStyle={content.menuStyle}
        animation={content.animation}
        iconStyle={content.iconStyle}
        logoType={content.logoType}
        logoText={content.logoText}
        logoSrc={content.logoSrc}
        logoAlign={content.logoAlign}
        links={content.links}
        cta={content.cta}
        overlayColor={content.overlayColor}
        panelBg={content.panelBg}
        textColor={content.textColor}
        closeOnOverlay={content.closeOnOverlay}
        drawerWidth={content.drawerWidth}
        style={style}
      />
    ),
  },
}

export function renderElement(
  content: ElementContent,
  style?: React.CSSProperties,
  elementId?: string,
): ReactElement | null {
  const entry = ELEMENT_REGISTRY[content.type] as
    | RegistryEntry<ElementContent>
    | undefined

  return entry ? entry.render({ content, style }, elementId) : null
}
