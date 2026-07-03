import type { Metadata } from 'next'
import ContactForm from '@/components/ContactForm'
import { SocialLinks } from '@/components/Social'
import { Container, Kicker } from '@/components/sections'

export const metadata: Metadata = {
  title: 'Contact · Zegwa',
  description:
    'Questions? Talk to a real person. Send a note and we will get back to you within a day.',
}

// Copy is verbatim from Figma frame 364:4886.

export default function ContactPage() {
  return (
    <>
      {/* Hero */}
      <section className="py-16 sm:py-24">
        <Container className="flex flex-col items-center gap-6 text-center">
          <Kicker>Contact</Kicker>
          <h1 className="max-w-2xl">Questions? Talk to a real person.</h1>
          <p className="max-w-xl text-lg text-muted">
            Not ready for an audit yet? Just want to ask something? Send a note and we&#39;ll get
            back to you within a day.
          </p>
        </Container>
      </section>

      {/* Form + details */}
      <section className="pb-16 sm:pb-24">
        <Container>
          <div className="grid gap-10 md:grid-cols-2 md:gap-12">
            <ContactForm />

            <div className="flex flex-col justify-center gap-10">
              <div className="flex flex-col gap-1">
                <p className="text-sm font-medium text-muted">Prefer email?</p>
                <a
                  href="mailto:hello@zegwastudio.com"
                  className="font-medium text-text underline underline-offset-4"
                >
                  hello@zegwastudio.com
                </a>
                <p className="mt-4 text-sm font-medium text-muted">Privacy or data questions?</p>
                <a
                  href="mailto:privacy@zegwastudio.com"
                  className="font-medium text-text underline underline-offset-4"
                >
                  privacy@zegwastudio.com
                </a>
              </div>

              <div className="flex flex-col gap-1">
                <p className="text-sm font-medium text-muted">Registered office:</p>
                <address className="font-medium not-italic leading-relaxed text-text">
                  Zegwa Studio (OPC) Private Limited
                  <br />
                  <br />
                  No. 472/7, Balaji Arcade, AVS Compound, Ejipura, Koramangala VI Bk, Bangalore
                  South, Karnataka, India 560095
                  <br />
                  <br />
                  CIN: U62012KA2026OPC218915
                </address>
              </div>

              <div className="flex flex-col gap-3">
                <p className="text-sm font-medium text-muted">Our Socials:</p>
                <SocialLinks linkClassName="text-muted hover:text-text focus-visible:text-text" />
              </div>
            </div>
          </div>
        </Container>
      </section>
    </>
  )
}
