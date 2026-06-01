'use client'

import React from 'react'
import { useElement } from '@/hooks/useBuilderSelectors'
import { useBuilderStore } from '@/store/builder.store'
import ResponsiveVisibility from '@/components/builder/controls/ResponsiveVisibility'
import type { ResponsiveStyles } from '@/types/builder.types'
import HeadingProps from './element/HeadingProps'
import ParagraphProps from './element/ParagraphProps'
import ButtonProps from './element/ButtonProps'
import ImageProps from './element/ImageProps'
import DividerProps from './element/DividerProps'
import SpacerProps from './element/SpacerProps'
import IconProps from './element/IconProps'
import VideoProps from './element/VideoProps'
import FormProps from './element/FormProps'
import HeroProps from './element/HeroProps'
import CardProps from './element/CardProps'
import NavbarProps from './element/NavbarProps'
import FooterProps from './element/FooterProps'
import Banner3DProps from './element/Banner3DProps'
import BannerMorphProps from './element/BannerMorphProps'
import BannerTickerProps from './element/BannerTickerProps'
import BannerSplitProps from './element/BannerSplitProps'
import BannerGlassProps from './element/BannerGlassProps'
import BannerNeonProps from './element/BannerNeonProps'
import BannerAuroraProps from './element/BannerAuroraProps'
import BannerRetroProps from './element/BannerRetroProps'
import BannerParticleProps from './element/BannerParticleProps'
import TabsProps from './element/TabsProps'
import AccordionProps from './element/AccordionProps'
import TooltipProps from './element/TooltipProps'
import ModalProps from './element/ModalProps'
import CarouselProps from './element/CarouselProps'
import HamburgerMenuProps from './element/HamburgerMenuProps'
import DrawerProps from './element/DrawerProps'
import TopHeaderProps from './element/TopHeaderProps'
import BarChartProps from './element/charts/BarChartProps'
import LineChartProps from './element/charts/LineChartProps'
import AreaChartProps from './element/charts/AreaChartProps'
import PieChartProps from './element/charts/PieChartProps'
import DonutChartProps from './element/charts/DonutChartProps'
import RadarChartProps from './element/charts/RadarChartProps'
import PolarChartProps from './element/charts/PolarChartProps'
import ScatterChartProps from './element/charts/ScatterChartProps'
import GaugeChartProps from './element/charts/GaugeChartProps'

interface Props {
  id: string
}

export default function ElementProperties({ id }: Props) {
  const element = useElement(id)
  const updateElement = useBuilderStore((s) => s.updateElement)

  if (!element) return null

  const { content } = element

  let typeProps: React.ReactNode = null
  switch (content.type) {
    case 'heading':         typeProps = <HeadingProps element={element} />; break
    case 'paragraph':       typeProps = <ParagraphProps element={element} />; break
    case 'button':          typeProps = <ButtonProps element={element} />; break
    case 'image':           typeProps = <ImageProps element={element} />; break
    case 'divider':         typeProps = <DividerProps element={element} />; break
    case 'spacer':          typeProps = <SpacerProps element={element} />; break
    case 'icon':            typeProps = <IconProps element={element} />; break
    case 'video':           typeProps = <VideoProps element={element} />; break
    case 'form':            typeProps = <FormProps element={element} />; break
    case 'hero':            typeProps = <HeroProps element={element} />; break
    case 'card':            typeProps = <CardProps element={element} />; break
    case 'navbar':          typeProps = <NavbarProps element={element} />; break
    case 'footer':          typeProps = <FooterProps element={element} />; break
    case 'banner-3d':       typeProps = <Banner3DProps element={element} />; break
    case 'banner-morph':    typeProps = <BannerMorphProps element={element} />; break
    case 'banner-ticker':   typeProps = <BannerTickerProps element={element} />; break
    case 'banner-split':    typeProps = <BannerSplitProps element={element} />; break
    case 'banner-glass':    typeProps = <BannerGlassProps element={element} />; break
    case 'banner-neon':     typeProps = <BannerNeonProps element={element} />; break
    case 'banner-aurora':   typeProps = <BannerAuroraProps element={element} />; break
    case 'banner-retro':    typeProps = <BannerRetroProps element={element} />; break
    case 'banner-particle': typeProps = <BannerParticleProps element={element} />; break
    case 'tabs':            typeProps = <TabsProps element={element} />; break
    case 'accordion':       typeProps = <AccordionProps element={element} />; break
    case 'tooltip':         typeProps = <TooltipProps element={element} />; break
    case 'modal':           typeProps = <ModalProps element={element} />; break
    case 'carousel':        typeProps = <CarouselProps element={element} />; break
    case 'hamburger-menu':  typeProps = <HamburgerMenuProps element={element} />; break
    case 'drawer':          typeProps = <DrawerProps element={element} />; break
    case 'top-header':      typeProps = <TopHeaderProps element={element} />; break
    case 'chart-bar':       typeProps = <BarChartProps element={element} />; break
    case 'chart-line':      typeProps = <LineChartProps element={element} />; break
    case 'chart-area':      typeProps = <AreaChartProps element={element} />; break
    case 'chart-pie':       typeProps = <PieChartProps element={element} />; break
    case 'chart-donut':     typeProps = <DonutChartProps element={element} />; break
    case 'chart-radar':     typeProps = <RadarChartProps element={element} />; break
    case 'chart-polar':     typeProps = <PolarChartProps element={element} />; break
    case 'chart-scatter':   typeProps = <ScatterChartProps element={element} />; break
    case 'chart-gauge':     typeProps = <GaugeChartProps element={element} />; break
    default:                return null
  }

  return (
    <>
      {typeProps}
      <ResponsiveVisibility
        responsive={element.responsive ?? {}}
        onUpdate={(r: ResponsiveStyles) => updateElement(id, { responsive: r })}
      />
    </>
  )
}
