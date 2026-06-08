import type { Metadata } from 'next'
import ThemeProvider from '@/providers/ThemeProvider'
import AuthProvider from '@/providers/AuthProvider'
import './globals.css'

export const metadata: Metadata = {
  title: 'BuilderPro',
  description: 'Visual website builder — build responsive sites without code',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className="h-full antialiased" suppressHydrationWarning>
      <body className="min-h-full flex flex-col">
        <AuthProvider><ThemeProvider>{children}</ThemeProvider></AuthProvider>
      </body>
    </html>
  )
}
