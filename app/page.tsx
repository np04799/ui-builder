import Link from 'next/link'
import MarketingHeader from '@/components/marketing/MarketingHeader'

export default function Home() {
  return (
    <>
    <MarketingHeader />
    <main className="flex flex-1 flex-col items-center justify-center gap-6 p-8">
      <h1 className="text-4xl font-semibold tracking-tight" style={{ color: 'var(--color-primary)' }}>
        BuilderPro
      </h1>
      <p style={{ color: 'var(--color-text-secondary)' }} className="text-lg">
        Visual website builder — coming soon
      </p>
      <Link
        href="/builder"
        className="rounded-lg px-6 py-3 text-sm font-medium text-white transition-opacity hover:opacity-90"
        style={{ backgroundColor: 'var(--color-primary)' }}
      >
        Open Builder
      </Link>
    </main>
    </>
  )
}
