import type { Metadata } from 'next'

export const metadata: Metadata = { title: 'About · Zegwa' }

export default function AboutPage() {
  return (
    <section className="mx-auto w-full max-w-shell px-6 py-24">
      <h1>About</h1>
      <p className="mt-4 text-muted">Coming soon.</p>
    </section>
  )
}
