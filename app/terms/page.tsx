import type { Metadata } from 'next'
import { LegalPage, type LegalBlock, type LegalContent, type LegalSection } from '@/components/sections'
import { pageMeta } from '@/lib/seo'

export const metadata: Metadata = pageMeta({
  title: 'Terms of Service',
  description:
    'The terms for using Zegwa Studio services, including engagement and payment, ownership, and cancellation.',
  path: '/terms',
})

// Copy is verbatim from Figma frame 387:1819. Legal text is authoritative.

// HIDDEN (Found-only launch, restore later): the Capture, Bundle, and
// Managed service entries are lifted out of the "Our services" section and
// preserved verbatim here. To restore, move these three blocks back into
// that section's blocks array, after the Found entry, and change "a
// productized service" back to "two productized services" in that
// section's lead-in sentence.
const hiddenServiceEntries: LegalBlock[] = [
  {
    k: 'p',
    label: 'Capture',
    text: ': An AI front desk service that answers inbound calls, texts, and web chat inquiries, qualifies leads, and books appointments directly into your existing booking or practice management software. Includes reminders and no-show recovery.',
  },
  {
    k: 'p',
    label: 'Bundle',
    text: ': Found and Capture delivered together as a combined package.',
  },
  {
    k: 'p',
    label: 'Managed',
    text: ': A higher-engagement service tier for clients requiring broader operational support. Scoped and priced individually by request.',
  },
]

// HIDDEN (Found-only launch, restore later): the Capture, Bundle, and
// Managed fee lines are lifted out of "Engagement and payment" > Fees and
// preserved verbatim here. To restore, move these three items back into
// that ul's items array, after the Found item.
const hiddenFeeItems: { label: string; text: string }[] = [
  {
    label: 'Capture',
    text: ': $3,000 setup fee plus $1,000 per month per location. Minimum term of three months from the date the service goes live.',
  },
  {
    label: 'Bundle',
    text: ': $4,000 setup fee plus $1,300 per month. Minimum term of three months from the date the service goes live.',
  },
  { label: 'Managed', text: ': Priced individually per Order.' },
]

// HIDDEN (reversible, not deleted): this section duplicated Privacy's
// "Legal basis for processing (GDPR and DPDP Act)" section word-for-word,
// and Terms already defers to Privacy for this via the "Data and privacy"
// section below. Preserved verbatim here rather than deleted. To restore,
// move this back into CONTENT.sections, in its original position (right
// after "Engagement and payment", before "Minimum terms and
// cancellation"). Privacy's own copy of this section is untouched.
const hiddenLegalBasisSection: LegalSection = {
  heading: 'Legal basis for processing (GDPR and DPDP Act)',
  blocks: [
    {
      k: 'p',
      text: 'Where applicable, we process your personal data on the following legal bases:',
    },
    {
      k: 'ul',
      items: [
        { label: 'Contract', text: ': Processing necessary to deliver the services you requested' },
        {
          label: 'Legitimate interests',
          text: ': Improving our services, preventing fraud, securing our systems',
        },
        { label: 'Consent', text: ': Where you have explicitly opted in (e.g. marketing communications)' },
        { label: 'Legal obligation', text: ': Where required by applicable law' },
      ],
    },
  ],
}

// HIDDEN (Found-only launch, restore later): the "Capture and Bundle"
// minimum-term item is lifted out of "Minimum terms and cancellation" and
// preserved verbatim here. To restore, move it back into that ul's items
// array, after the Found item.
const hiddenCancellationTerm: { label: string; text: string } = {
  label: 'Capture and Bundle',
  text: ': Three-month minimum term from the date the service goes live. After the minimum term, month-to-month with 30 days written notice to cancel.',
}

// HIDDEN (Found-only launch, restore later): these three ownership bullets
// are lifted out of "Ownership of work product" and preserved verbatim
// here. To restore, move them back into that ul's items array, in this
// order, after "Google Business Profile and directory listings (under your
// accounts)" and before "All reporting and performance data".
const hiddenOwnershipItems: string[] = [
  'The AI agent knowledge base, scripts, and qualification logic',
  'Your business phone number provisioned for Capture',
  'All call recordings, transcripts, and conversation logs',
]

// HIDDEN (Found-only launch, restore later): the entire "AI and accuracy"
// section is lifted out of CONTENT.sections and preserved verbatim here,
// including the >>>LAWYER<<< marker. To restore, move this back into
// CONTENT.sections, in its original position (right after "Acceptable
// use", before "Confidentiality").
const hiddenAiAccuracySection: LegalSection = {
  heading: 'AI and accuracy',
  blocks: [
    {
      k: 'p',
      text: 'Our Capture service uses artificial intelligence to handle inbound calls, qualify leads, and book appointments. While we configure, tune, and maintain the AI for your specific business, AI systems can make errors. We do not guarantee that the AI will handle every interaction perfectly.',
    },
    { k: 'p', text: 'We do guarantee that:' },
    {
      k: 'ul',
      items: [
        'The agent will be configured with your specific business information before going live',
        'You will have access to every conversation the agent has',
        'We will correct errors promptly when you flag them',
        'The agent is configured to escalate to a human when it is uncertain rather than guess',
        'The agent discloses that a call may be recorded where required.',
      ],
    },
    {
      k: 'p',
      text: '>>>LAWYER — confirm call-recording disclosure language and two-party-consent handling for US states that require it<<<',
    },
    {
      k: 'p',
      text: 'For legal verticals, the agent handles intake only and does not provide legal advice or create an attorney-client relationship.',
    },
  ],
}

const CONTENT: LegalContent = {
  kicker: 'Terms',
  title: 'Terms of Service',
  org: 'Zegwa Studio (OPC) Private Limited',
  updated: 'Last updated: July 2026',
  sections: [
    {
      heading: 'About these terms',
      blocks: [
        {
          k: 'p',
          text: 'These Terms of Service ("Terms") govern your use of the website zegwastudio.com and the services provided by Zegwa Studio (OPC) Private Limited ("Zegwa Studio," "Zegwa," "we," "us," or "our"). By using our website or engaging our services, you agree to these Terms. If you do not agree, do not use our website or services.',
        },
        { k: 'p', label: 'Registered entity', text: ': Zegwa Studio (OPC) Private Limited' },
        { k: 'p', label: 'CIN', text: ': U62012KA2026OPC218915' },
        {
          k: 'p',
          text: 'No. 472/7, Balaji Arcade, AVS Compound, Ejipura, Koramangala VI Bk, Bangalore South, Karnataka, India 560095',
        },
        { k: 'p', label: 'Contact', text: ': hello@zegwastudio.com' },
      ],
    },
    {
      heading: 'Our services',
      blocks: [
        {
          k: 'p',
          text: 'Zegwa Studio provides a productized service to local appointment businesses:',
        },
        {
          k: 'p',
          label: 'Found',
          text: ': A done-for-you web presence package including website development, Google Business Profile optimization, local directory listings, on-page SEO, and answer engine optimization (AEO). Includes a one-time dormant lead reactivation sweep.',
        },
        // HIDDEN: Capture, Bundle, and Managed entries lifted into
        // `hiddenServiceEntries` above.
      ],
    },
    {
      heading: 'Engagement and payment',
      blocks: [
        { k: 'sub', text: 'Service agreements' },
        {
          k: 'p',
          text: 'Each engagement is governed by a separate service agreement ("Order") that specifies the services, fees, and timelines. These Terms apply to all Orders unless the Order expressly states otherwise.',
        },
        { k: 'sub', text: 'Fees' },
        {
          k: 'ul',
          items: [
            { label: 'Found', text: ': $1,500 setup fee plus $500 per month. No minimum term.' },
            // HIDDEN: Capture, Bundle, and Managed fee items lifted into
            // `hiddenFeeItems` above.
          ],
        },
        { k: 'p', text: 'Fees are stated in US dollars unless otherwise agreed.' },
        { k: 'sub', text: 'Payment' },
        {
          k: 'p',
          text: 'Payment terms are specified in each Order. Setup fees are due before work begins. Monthly fees are due on the same date each month from the date the service goes live. We use a third-party payment processor. By providing payment details, you authorize us to charge the agreed fees on the agreed schedule.',
        },
        { k: 'sub', text: 'Late payment' },
        {
          k: 'p',
          text: 'If a payment is not received within 7 days of the due date, we may suspend the service until payment is made. We will notify you before suspending.',
        },
      ],
    },
    // HIDDEN: "Legal basis for processing (GDPR and DPDP Act)" section
    // lifted into `hiddenLegalBasisSection` above.
    {
      heading: 'Minimum terms and cancellation',
      blocks: [
        {
          k: 'ul',
          items: [
            {
              label: 'Found',
              text: ': No minimum term. Cancel with 30 days written notice. Monthly fee is charged through the end of the notice period.',
            },
            // HIDDEN: "Capture and Bundle" minimum-term item lifted into
            // `hiddenCancellationTerm` above.
          ],
        },
        {
          k: 'p',
          text: 'Cancellation requests must be sent to hello@zegwastudio.com. Verbal cancellations are not accepted. Setup fees are non-refundable once work has begun.',
        },
      ],
    },
    {
      heading: 'Ownership of work product',
      blocks: [
        { k: 'p', text: 'Everything we build for your business is yours. This includes:' },
        {
          k: 'ul',
          items: [
            'The website and all its content',
            'Domain configurations (where you own the domain)',
            'Google Business Profile and directory listings (under your accounts)',
            // HIDDEN: three ownership bullets lifted into
            // `hiddenOwnershipItems` above.
            'All reporting and performance data',
          ],
        },
        {
          k: 'p',
          text: 'We do not retain ownership of any work product delivered to you. We do not hold assets on proprietary platforms that prevent you from taking them with you if you leave. Upon cancellation, we will provide you with access to all work product within 14 days.',
        },
      ],
    },
    {
      heading: 'Your responsibilities',
      blocks: [
        { k: 'p', text: 'To enable us to deliver the services, you agree to:' },
        {
          k: 'ul',
          items: [
            'Provide accurate and complete information about your business, services, hours, pricing, and policies',
            'Grant us necessary access to your systems, accounts, and platforms in a timely manner',
            'Respond to setup and onboarding requests within a reasonable timeframe',
            'Ensure you have the right to grant us access to any systems, data, or accounts you share with us',
            'Comply with all applicable laws in your jurisdiction, including consumer protection and data privacy laws',
            'Obtain any necessary consents from your customers before their data is processed through our services',
          ],
        },
      ],
    },
    {
      heading: 'Acceptable use',
      blocks: [
        { k: 'p', text: 'You agree not to use our services to:' },
        {
          k: 'ul',
          items: [
            'Violate any applicable law or regulation',
            'Deceive or mislead your customers',
            'Collect or process data you do not have the right to collect',
            'Interfere with or disrupt our systems or infrastructure',
            'Circumvent any security measures we have in place',
          ],
        },
      ],
    },
    // HIDDEN: entire "AI and accuracy" section (including the >>>LAWYER<<<
    // marker) lifted into `hiddenAiAccuracySection` above.
    {
      heading: 'Confidentiality',
      blocks: [
        {
          k: 'p',
          text: 'Both parties agree to keep confidential any non-public information received from the other party in connection with the services. This obligation does not apply to information that is publicly available, independently developed, or required to be disclosed by law.',
        },
      ],
    },
    {
      heading: 'Data and privacy',
      blocks: [
        {
          k: 'p',
          text: 'Our collection and use of personal data is governed by our Privacy Policy, which is incorporated into these Terms by reference.',
        },
      ],
    },
    {
      heading: 'Warranties and disclaimers',
      blocks: [
        { k: 'p', text: 'We warrant that:' },
        {
          k: 'ul',
          items: [
            'We will deliver the services described in each Order with reasonable skill and care',
            'We have the right to provide the services',
            'The services will not knowingly infringe any third-party intellectual property rights',
          ],
        },
        { k: 'p', text: 'We do not warrant that:' },
        {
          k: 'ul',
          items: [
            'The services will produce specific revenue or customer outcomes',
            'The services will be error-free or uninterrupted',
            'Search rankings or AI search visibility will achieve specific positions or timeframes',
          ],
        },
        {
          k: 'p',
          text: 'Results depend on many factors outside our control, including your market, competition, pricing, and business operations.',
        },
      ],
    },
    {
      heading: 'Limitation of liability',
      blocks: [
        { k: 'p', text: 'To the maximum extent permitted by applicable law:' },
        {
          k: 'ul',
          items: [
            'Our total liability to you for any claim arising out of or related to these Terms or the services shall not exceed the total fees paid by you to us in the three months preceding the claim',
            'We are not liable for any indirect, incidental, special, consequential, or punitive damages, including lost profits or lost revenue, even if we have been advised of the possibility of such damages',
          ],
        },
        {
          k: 'p',
          text: 'Nothing in these Terms limits liability for fraud, death or personal injury caused by negligence, or any other liability that cannot be limited by law.',
        },
      ],
    },
    {
      heading: 'Indemnification',
      blocks: [
        {
          k: 'p',
          text: 'You agree to indemnify and hold harmless Zegwa Studio and its personnel from any claims, damages, losses, or expenses (including reasonable legal fees) arising from:',
        },
        {
          k: 'ul',
          items: [
            'Your breach of these Terms',
            'Your use of the services in violation of applicable law',
            'Any claim by a third party relating to content or data you provide to us',
          ],
        },
      ],
    },
    {
      heading: 'Termination',
      blocks: [
        {
          k: 'p',
          text: 'Either party may terminate a service engagement by following the cancellation process described above. We may terminate immediately if:',
        },
        {
          k: 'ul',
          items: [
            'You breach these Terms and fail to remedy the breach within 14 days of written notice',
            'You become insolvent or cease to operate as a business',
            'Continuing the engagement would require us to violate applicable law',
          ],
        },
        {
          k: 'p',
          text: 'On termination, all outstanding fees become immediately due. We will deliver all work product to you within 14 days of termination.',
        },
      ],
    },
    {
      heading: 'Governing law and disputes',
      blocks: [
        {
          k: 'p',
          text: 'These Terms are governed by the laws of India. For disputes involving clients in the United States, both parties agree to first attempt resolution through good-faith negotiation before pursuing formal proceedings. Any dispute that cannot be resolved through negotiation shall be submitted to binding arbitration under the rules of the Indian Council of Arbitration, with proceedings conducted in English in Bangalore, India. Nothing in this clause prevents either party from seeking injunctive or other equitable relief from a court of competent jurisdiction.',
        },
      ],
    },
    {
      heading: 'Changes to these terms',
      blocks: [
        {
          k: 'p',
          text: 'We may update these Terms from time to time. When we do, we will update the "last updated" date at the top of this page. For material changes affecting active engagements, we will notify you by email at least 30 days before the changes take effect.',
        },
      ],
    },
    {
      heading: 'Entire agreement',
      blocks: [
        {
          k: 'p',
          text: 'These Terms, together with any applicable Order and our Privacy Policy, constitute the entire agreement between you and Zegwa Studio regarding the services. They supersede all prior discussions, representations, and agreements.',
        },
      ],
    },
    {
      heading: 'Contact us',
      blocks: [
        { k: 'p', text: 'For questions about these Terms:' },
        { k: 'p', label: 'Email', text: ': hello@zegwastudio.com' },
        {
          k: 'p',
          label: 'Post',
          text: ': Zegwa Studio (OPC) Private Limited, No. 472/7, Balaji Arcade, AVS Compound, Ejipura, Koramangala VI Bk, Bangalore South, Karnataka, India 560095',
        },
      ],
    },
  ],
}

export default function TermsPage() {
  return <LegalPage content={CONTENT} />
}
