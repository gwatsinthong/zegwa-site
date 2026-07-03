import type { Metadata } from 'next'
import { display, body, serif } from './fonts'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import './globals.css'

export const metadata: Metadata = {
  title: 'Zegwa',
  description:
    'A website and online presence that puts you on Google, maps, directories, and AI search.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html
      lang="en"
      className={`${display.variable} ${body.variable} ${serif.variable}`}
    >
      <body className="flex min-h-screen flex-col bg-bg font-body text-text">
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  )
}
