import type { Metadata } from 'next'
import AuditForm from '@/components/AuditForm'
import { pageMeta } from '@/lib/seo'

export const metadata: Metadata = pageMeta({
  title: 'Get your free audit',
  description:
    'Tell us about your business and we show you where bookings are slipping, in 24 hours, free. No calls and no commitment.',
  path: '/start',
})

export default function StartPage() {
  return (
    <section className="mx-auto w-full max-w-shell px-6 py-16 sm:py-24">
      <div className="mx-auto flex max-w-2xl flex-col items-center text-center">
        <p className="text-sm font-medium uppercase tracking-wide text-muted">
          Free audit
        </p>
        <h1 className="mt-5">{"Let's see what you're missing."}</h1>
        <p className="mt-5 text-lg text-muted">
          {
            "Tell us your business. We'll show you where the bookings are slipping, in 24 hours, free."
          }
        </p>
      </div>

      <div className="mt-10 flex justify-center sm:mt-14">
        <AuditForm />
      </div>
    </section>
  )
}
