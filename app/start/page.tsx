import type { Metadata } from 'next'

export const metadata: Metadata = { title: 'Get free audit · Zegwa' }

export default function StartPage() {
  return (
    <section className="mx-auto w-full max-w-shell px-6 py-24">
      <h1>Get free audit</h1>
      <p className="mt-4 text-muted">Coming soon.</p>
    </section>
  )
}
