import type { Metadata } from 'next'
import ContactForm from '@/components/ContactForm'
import { SocialLinks } from '@/components/Social'
import { HELV, FRAME_TYPE, RuleRow } from '@/components/sections'
import { pageMeta } from '@/lib/seo'
import FadeUp from '@/components/FadeUp'

export const metadata: Metadata = pageMeta({
  title: 'Contact',
  description:
    'Talk to a real person. Send a note and we reply within one business day, or start your free audit.',
  path: '/contact',
})

// Figma-faithful rebuild of frame 364:4886 "Contact" (body only; the shell
// supplies Header + Footer). Exact radii, colors, shadows, and type sizes are
// read per node. Font target is Helvetica Now Display. The form lives in
// ContactForm (mailto action, no submit endpoint); the details column carries
// both emails, the registered office + CIN, and the shared social icons.

const LABEL = 'text-[14px] font-bold leading-[1.5] text-[#5c5c5c]'
const VALUE = 'text-[16px] font-bold leading-[1.5] tracking-[0.16px] text-[#202020]'
const EMAIL = `${VALUE} outline-none underline-offset-4 hover:underline focus-visible:underline`

export default function ContactPage() {
  return (
    <div style={{ fontFamily: HELV }} className="text-[#202020]">
      {/* ============================= HERO (364:4889) ========================= */}
      <FadeUp>
      <section className="px-6 pb-[64px] pt-[64px] sm:pb-[80px] sm:pt-[80px]">
        <div className="mx-auto flex max-w-[1040px] flex-col items-center gap-[26px] text-center">
          <RuleRow>Contact</RuleRow>
          <h1
            style={{ fontFamily: HELV }}
            className={`max-w-[704px] text-[#202020] ${FRAME_TYPE.display}`}
          >
            Questions? Talk to a real person.
          </h1>
          <p className="max-w-[503px] text-[18px] leading-[1.5] text-[#5c5c5c] sm:text-[20px]">
            Not ready for an audit yet? Just want to ask something? Send a note and we&#39;ll get
            back to you within a day.
          </p>
        </div>
      </section>
      </FadeUp>

      {/* ==================== FORM + DETAILS (364:4941) ======================== */}
      <FadeUp>
      <section className="px-6 pb-[80px] sm:pb-[100px]">
        <div className="mx-auto flex max-w-[984px] flex-col items-stretch gap-[40px] md:flex-row md:items-center md:gap-[24px]">
          <div className="w-full md:flex-1">
            <ContactForm />
          </div>

          <div className="flex w-full flex-col items-center gap-[64px] md:flex-1">
            {/* Emails */}
            <div className="flex w-full max-w-[367px] flex-col gap-[16px]">
              <div className="flex flex-col">
                <p className={LABEL}>Prefer email?</p>
                <a href="mailto:hello@zegwastudio.com" className={EMAIL}>
                  hello@zegwastudio.com
                </a>
              </div>
              <div className="flex flex-col">
                <p className={LABEL}>Privacy or data questions?</p>
                <a href="mailto:privacy@zegwastudio.com" className={EMAIL}>
                  privacy@zegwastudio.com
                </a>
              </div>
            </div>

            {/* Registered office */}
            <div className="flex w-full max-w-[367px] flex-col gap-[16px]">
              <div className="flex flex-col">
                <p className={LABEL}>Registered office:</p>
                <p className={VALUE}>Zegwa Studio (OPC) Private Limited</p>
              </div>
              <address className={`not-italic ${VALUE}`}>
                No. 472/7, Balaji Arcade, AVS Compound, Ejipura, Koramangala VI Bk, Bangalore South,
                Karnataka, India 560095
              </address>
              <p className={VALUE}>CIN: U62012KA2026OPC218915</p>
              <p className={VALUE}>
                Phone: <a href="tel:+917026949689" className={EMAIL}>+91 7026949689</a>
              </p>
              <p className={VALUE}>For queries or grievances: Gwatsin Thong</p>
            </div>

            {/* US mailing address: a mailing address only, not an office, HQ, or
                place of business -- Zegwa Studio is an Indian company. Shown here
                so it matches the address in outbound email signatures. */}
            <div className="flex w-full max-w-[367px] flex-col gap-[16px]">
              <p className={LABEL}>US mailing address:</p>
              <address className={`not-italic ${VALUE}`}>
                2232 Dell Range Blvd, Suite 303 1743, Cheyenne, WY 82009, United States
              </address>
            </div>

            {/* Socials */}
            <div className="flex w-full max-w-[367px] flex-col gap-[8px]">
              <p className={LABEL}>Our Socials:</p>
              <SocialLinks
                size={16}
                linkClassName="text-[#202020] hover:text-[#5c5c5c] focus-visible:text-[#5c5c5c]"
              />
            </div>
          </div>
        </div>
      </section>
      </FadeUp>
    </div>
  )
}
