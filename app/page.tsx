// v2 — NOIR fashion template
import Link from 'next/link'
import MarketingHeader from '@/components/marketing/MarketingHeader'
import InspirationSection from '@/components/marketing/InspirationSection'

export default function Home() {
  return (
    <>
      <MarketingHeader />
      <main>
        {/* Hero */}
        <div
          className="flex flex-1 flex-col items-center justify-center gap-6 p-8"
          style={{ minHeight: '60vh' }}
        >
          <h1
            className="text-4xl font-semibold tracking-tight hero-title"
            style={{ color: 'var(--color-primary)' }}
          >
            BuilderPro
          </h1>
          <p
            style={{ color: 'var(--color-text-secondary)' }}
            className="text-lg hero-sub"
          >
            Visual website builder — coming soon
          </p>
          <Link
            href="/builder"
            className="rounded-lg px-6 py-3 text-sm font-medium text-white btn-primary-glow hero-cta"
            style={{ backgroundColor: 'var(--color-primary)' }}
          >
            Open Builder
          </Link>
        </div>

        {/* Inspiration / Template Gallery */}
        <InspirationSection />
      </main>
    </>
  )
}
