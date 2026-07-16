import { CheckList, Framed, HELV } from './sections'

// Setup/ongoing two-column pricing block + footnote, extracted verbatim from
// app/page.tsx's PRICING section so /pricing can reuse the exact same block
// without duplicating the markup. Deliberately excludes the eyebrow/H2/sub
// and the CTA above/below it -- those differ per page and stay authored
// where they're used.

const SETUP_ITEMS = [
  'Your website, built and live in days',
  'Google Business Profile set up right',
  'Your details fixed across every directory',
  'Set up to be found in AI search',
  'One sweep of your old leads',
]

const ONGOING_ITEMS = [
  'Listings kept accurate as things change',
  'New reviews answered in your voice',
  'Photos and posts kept current',
  'Your AI and local presence maintained',
  'A monthly report, plus the dashboard any time',
]

export default function PricingCards() {
  return (
    <div className="flex w-full flex-col items-center gap-[16px]">
      <div className="flex w-full flex-col gap-[32px]">
        <div
          className="h-[2px] w-full"
          style={{
            backgroundImage:
              'linear-gradient(90deg, #f0f0f0 0%, #cecece 30%, #cecece 70%, #f0f0f0 100%)',
          }}
        />
        <Framed outer="p-[16px]" inner="p-[24px] sm:p-[32px]" className="w-full">
          <div className="flex flex-col gap-[32px] sm:flex-row">
            <div className="flex flex-1 flex-col gap-[40px] px-[16px] py-[24px]">
              <p className="text-[20px] leading-[1.5] text-[#202020]">SETUP</p>
              <div className="flex flex-col gap-[16px]">
                <p style={{ fontFamily: HELV }} className="font-bold tracking-[-1.44px] text-[#202020]">
                  <span className="text-[48px] leading-[1.24]">$1,500 </span>
                  <span className="text-[32px] leading-[1.26] tracking-[-0.96px]">one-time</span>
                </p>
                <CheckList items={SETUP_ITEMS} gap="gap-[8px]" />
              </div>
            </div>
            <div className="h-[2px] w-full self-stretch bg-gradient-to-r from-[#fefefe] via-[#dedede] to-[#fefefe] sm:h-auto sm:w-[2px] sm:bg-gradient-to-b" />
            <div className="flex flex-1 flex-col gap-[40px] px-[16px] py-[24px]">
              <p className="text-[20px] leading-[1.5] text-[#202020]">ONGOING</p>
              <div className="flex flex-col gap-[16px]">
                <p style={{ fontFamily: HELV }} className="font-bold tracking-[-1.44px] text-[#202020]">
                  <span className="text-[48px] leading-[1.24]">$500</span>
                  <span className="text-[24px] leading-[1.26]">/mo</span>
                </p>
                <CheckList items={ONGOING_ITEMS} gap="gap-[8px]" />
              </div>
            </div>
          </div>
        </Framed>
      </div>

      <p className="max-w-[448px] text-center text-[16px] leading-[1.5] text-[#777]">
        No minimum. Cancel anytime.
      </p>
    </div>
  )
}
