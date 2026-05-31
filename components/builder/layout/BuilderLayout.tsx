'use client'

import { useUndoRedo } from '@/hooks/useUndoRedo'
import { useBuilderStore } from '@/store/builder.store'
import Toolbar from '@/components/builder/toolbar/Toolbar'
import LeftSidebar from '@/components/builder/panels/LeftSidebar'
import PropertiesPanel from '@/components/builder/panels/PropertiesPanel'
import ViewportWrapper from '@/components/builder/preview/ViewportWrapper'
import FloatingToolbar from '@/components/builder/floating/FloatingToolbar'
import Breadcrumb from '@/components/builder/layout/Breadcrumb'
import ProjectSetupWizard from '@/components/builder/wizard/ProjectSetupWizard'
import BrandingApplicator from '@/components/builder/layout/BrandingApplicator'
import FrameworkLoader from '@/components/builder/layout/FrameworkLoader'

export default function BuilderLayout() {
  useUndoRedo()
  const leftPanelVisible = useBuilderStore((s) => s.leftPanelVisible)
  const rightPanelVisible = useBuilderStore((s) => s.rightPanelVisible)
  const canvasZoom = useBuilderStore((s) => s.canvasZoom)
  const projectMeta = useBuilderStore((s) => s.projectMeta)

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        height: '100vh',
        overflow: 'hidden',
        backgroundColor: 'var(--color-bg)',
      }}
    >
      {!projectMeta && <ProjectSetupWizard />}
      <BrandingApplicator />
      <FrameworkLoader />
      <Toolbar />

      <div
        style={{
          display: 'flex',
          flex: 1,
          overflow: 'hidden',
          minHeight: 0,
        }}
      >
        {leftPanelVisible && <LeftSidebar />}

        {/* Canvas stage */}
        <main
          data-canvas-stage
          style={{
            flex: 1,
            overflow: 'auto',
            backgroundColor: 'var(--color-canvas-stage)',
            minWidth: 0,
          }}
        >
          <div
            style={{
              minHeight: '100%',
              display: 'flex',
              justifyContent: 'center',
              padding: '32px 24px',
              boxSizing: 'border-box',
            }}
          >
            <div
              style={{
                transform: `scale(${canvasZoom})`,
                transformOrigin: 'top center',
                transition: 'transform 0.15s ease',
              }}
            >
              <ViewportWrapper />
            </div>
          </div>
        </main>

        {rightPanelVisible && <PropertiesPanel />}
      </div>

      {/* Bottom breadcrumb */}
      <Breadcrumb />

      <FloatingToolbar />
    </div>
  )
}
