import type { Metadata } from 'next'
import { LegalPage, type LegalContent } from '@/components/sections'
import { pageMeta } from '@/lib/seo'

export const metadata: Metadata = pageMeta({
  title: 'Privacy Policy',
  description:
    'How Zegwa Studio collects, uses, and protects your data, and the rights you have under GDPR, CCPA, and the DPDP Act.',
  path: '/privacy',
})

// Copy is verbatim from Figma frame 364:5158. Legal text is authoritative.

// HIDDEN (Found-only launch, restore later): these two bullets are lifted
// out of "What information we collect" > "Information collected through
// our services" and preserved verbatim here. To restore, move them back
// into that ul's items array, in this order, at the start of the list
// (before "Lead and contact data from your existing systems"), and change
// the lead-in "When we deliver Found to your business" back to "When we
// deliver Found or Capture to your business".
const hiddenCollectionItems: string[] = [
  'Call recordings and transcripts handled by the AI front desk',
  'Appointment and booking data from your calendar system',
]

// HIDDEN (Found-only launch, restore later): lifted out of "How we use
// your information" and preserved verbatim here. To restore, move it back
// into that ul's items array, after "Provide and operate the Found
// service" (which should also revert to "Provide and operate Found and
// Capture services").
const hiddenUsePurpose = 'Configure and tune the AI front desk for your business'

// HIDDEN (Found-only launch, restore later): these two service-provider
// bullets, including the Voice/SMS line's own >>>PENDING<<< marker, are
// lifted out of "How we share your information" and preserved verbatim
// here. To restore, move them back into that ul's items array, in this
// order, at the start of the list (before "Database and application
// hosting").
const hiddenServiceProviderItems: string[] = [
  'Voice and SMS platforms (Twilio; Vapi or Retell for voice) >>>PENDING — depends on final Capture voice-backend decision<<<',
  'Calendar and booking integrations',
]

// HIDDEN (Found-only launch, restore later): lifted out of "Data
// retention" and preserved verbatim here. To restore, move it back into
// that ul's items array, after "Client data" and before "Website
// analytics (Google Analytics)".
const hiddenRetentionItem: { label: string; text: string } = {
  label: 'Call recordings and transcripts',
  text: ': Retained for 12 months unless a longer period is required by law or agreed with the client',
}

const CONTENT: LegalContent = {
  kicker: 'Privacy',
  title: 'Privacy Policy',
  org: 'Zegwa Studio (OPC) Private Limited',
  updated: 'Last updated: July 2026',
  sections: [
    {
      heading: 'Who we are',
      blocks: [
        {
          k: 'p',
          label: 'Zegwa Studio (OPC) Private Limited',
          text: ' ("Zegwa Studio," "Zegwa," "we," "us," or "our") is a company incorporated in India under the Companies Act 2013.',
        },
        {
          k: 'p',
          label: 'Registered address',
          text: ': No. 472/7, Balaji Arcade, AVS Compound, Ejipura, Koramangala VI Bk, Bangalore South, Karnataka, India 560095',
        },
        { k: 'p', label: 'CIN', text: ': U62012KA2026OPC218915' },
        { k: 'p', label: 'Contact', text: ': privacy@zegwastudio.com' },
        { k: 'p', label: 'Phone', text: ': (+91) 7026949689' },
        {
          k: 'p',
          text: 'We operate the website zegwastudio.com and deliver AI-native web presence services to local appointment businesses, primarily in the United States, India and other English-speaking markets.',
        },
      ],
    },
    {
      heading: 'What information we collect',
      blocks: [
        { k: 'sub', text: 'Information you give us directly' },
        {
          k: 'p',
          text: 'When you submit the free audit form, contact us, or become a client, we may collect:',
        },
        {
          k: 'ul',
          items: [
            'Your name and business name',
            'Email address and phone number',
            'Website URL and business details',
            'Any information you share in free-text fields',
            'Billing and payment information (processed by our payment provider, not stored by us)',
          ],
        },
        { k: 'sub', text: 'Information collected automatically' },
        { k: 'p', text: 'When you visit our website, we may collect:' },
        {
          k: 'ul',
          items: [
            'IP address and approximate location',
            'Browser type, operating system, device type',
            'Pages visited, time on page, referral source',
            'Aggregate usage data via Google Analytics (only with your consent)',
          ],
        },
        { k: 'sub', text: 'Information collected through our services' },
        {
          k: 'p',
          text: 'When we deliver Found to your business, we may process:',
        },
        {
          k: 'ul',
          items: [
            // HIDDEN: two bullets lifted into `hiddenCollectionItems` above.
            'Lead and contact data from your existing systems',
            'Business performance data (search impressions, website visits, reviews)',
          ],
        },
      ],
    },
    {
      heading: 'How we use your information',
      blocks: [
        { k: 'p', text: 'We use the information we collect to:' },
        {
          k: 'ul',
          items: [
            'Deliver the free audit you requested',
            'Provide and operate the Found service',
            // HIDDEN: `hiddenUsePurpose` above.
            'Send service communications (confirmations, reports, updates)',
            'Respond to your questions and support requests',
            'Improve our services and develop new features',
            'Comply with legal obligations',
          ],
        },
        {
          k: 'p',
          text: 'We do not sell your personal information. We do not use your information for advertising on third-party platforms.',
        },
      ],
    },
    {
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
    },
    {
      heading: 'Cookies',
      blocks: [
        {
          k: 'p',
          text: 'We use essential cookies to run the site, and Google Analytics cookies to understand usage. Analytics cookies are set only with your consent, collected through our cookie banner. We do not run advertising, retargeting, or third-party marketing cookies. You can manage cookies through your browser settings. Disabling essential cookies may affect the functionality of the site. See our Cookie Policy for full details.',
        },
      ],
    },
    {
      heading: 'How we share your information',
      blocks: [
        { k: 'p', text: 'We share your information only in the following circumstances:' },
        {
          k: 'p',
          text: 'Service providers. We use third-party providers to operate our services. >>>PENDING — confirm final sub-processor list before publishing<<<',
        },
        { k: 'p', text: 'These currently include:' },
        {
          k: 'ul',
          items: [
            // HIDDEN: two bullets lifted into `hiddenServiceProviderItems`
            // above.
            'Database and application hosting (Supabase, hosted on AWS in the United States)',
            'Email delivery (AWS SES)',
            'Website analytics (Google Analytics 4, provided by Google LLC, United States)',
          ],
        },
        {
          k: 'p',
          text: 'These providers are contractually bound to protect your data and use it only to provide services to us.',
        },
        {
          k: 'p',
          label: 'Legal requirements',
          text: '. We may disclose information if required by law, court order, or government authority, or to protect the rights, property, or safety of Zegwa Studio, our clients, or others.',
        },
        {
          k: 'p',
          label: 'Business transfers',
          text: '. If Zegwa Studio is acquired or merges with another entity, your information may be transferred as part of that transaction. We will notify you before your information is transferred and becomes subject to a different privacy policy.',
        },
        {
          k: 'p',
          text: 'We do not share, sell, or rent your personal information to third parties for their own marketing purposes.',
        },
      ],
    },
    {
      heading: 'Data retention',
      blocks: [
        {
          k: 'p',
          text: 'We retain your information for as long as necessary to deliver our services and comply with legal obligations.',
        },
        {
          k: 'ul',
          items: [
            { label: 'Audit requests', text: ': Retained for 12 months from the date of the audit' },
            {
              label: 'Client data',
              text: ': Retained for the duration of the engagement plus 3 years',
            },
            // HIDDEN: "Call recordings and transcripts" item lifted into
            // `hiddenRetentionItem` above.
            { label: 'Website analytics (Google Analytics)', text: ': Retained for 14 months' },
          ],
        },
        {
          k: 'p',
          text: 'When data is no longer needed, we delete or anonymize it securely.',
        },
      ],
    },
    {
      heading: 'Your rights',
      blocks: [
        {
          k: 'p',
          text: 'Depending on where you are located, you may have the following rights regarding your personal data:',
        },
        { k: 'sub', text: 'All users:' },
        {
          k: 'ul',
          items: [
            'Right to know what data we hold about you',
            'Right to correct inaccurate data',
            'Right to request deletion of your data',
            'Right to withdraw consent where processing is based on consent',
          ],
        },
        { k: 'sub', text: 'EU/UK users (GDPR):' },
        {
          k: 'ul',
          items: [
            'Right to data portability',
            'Right to object to processing based on legitimate interests',
            'Right to restrict processing',
            'Right to lodge a complaint with your local supervisory authority',
          ],
        },
        { k: 'sub', text: 'California users (CCPA/CPRA):' },
        {
          k: 'ul',
          items: [
            'Right to know categories and specific pieces of personal information collected',
            'Right to delete personal information',
            'Right to opt out of the sale of personal information (we do not sell personal information)',
            'Right to non-discrimination for exercising your rights',
          ],
        },
        { k: 'sub', text: 'Indian users (DPDP Act):' },
        {
          k: 'ul',
          items: [
            'Right to access information about personal data processed',
            'Right to correction and erasure',
            'Right to grievance redressal (see Grievance Officer below)',
          ],
        },
        {
          k: 'p',
          text: 'To exercise any of these rights, contact us at privacy@zegwastudio.com. We will respond within 30 days.',
        },
      ],
    },
    {
      heading: 'International data transfers',
      blocks: [
        {
          k: 'p',
          text: 'Zegwa Studio is incorporated in India and operates services primarily in the United States, India and other English-speaking markets. Your data is stored primarily in the United States (via our hosting providers), with some processing carried out in India (our operations) and in other regions where our service providers operate. Where we transfer data from the European Economic Area or United Kingdom, we ensure appropriate safeguards are in place in accordance with applicable data protection law.',
        },
      ],
    },
    {
      heading: "Children's privacy",
      blocks: [
        {
          k: 'p',
          text: 'Our services are not directed at children under the age of 18. We do not knowingly collect personal information from children. If you believe we have inadvertently collected information from a child, contact us immediately at privacy@zegwastudio.com.',
        },
      ],
    },
    {
      heading: 'Grievance Officer',
      blocks: [
        {
          k: 'p',
          text: 'In accordance with the Information Technology Act 2000, the IT Rules 2011, and the Digital Personal Data Protection Act 2023, Zegwa Studio (OPC) Private Limited has designated a Grievance Officer for data-related complaints and requests.',
        },
        { k: 'p', label: 'Grievance Officer', text: ': Gwatsin Thong' },
        { k: 'p', label: 'Email', text: ': privacy@zegwastudio.com' },
        {
          k: 'p',
          label: 'Address',
          text: ': Zegwa Studio (OPC) Private Limited, No. 472/7, Balaji Arcade, AVS Compound, Ejipura, Koramangala VI Bk, Bangalore South, Karnataka, India 560095',
        },
        {
          k: 'p',
          text: 'We will acknowledge your grievance within 72 hours and resolve it within 30 days of receipt.',
        },
        {
          k: 'p',
          text: 'If you are dissatisfied with our response, you may escalate your complaint to the Data Protection Board of India once it becomes operational.',
        },
      ],
    },
    {
      heading: 'Changes to this policy',
      blocks: [
        {
          k: 'p',
          text: 'We may update this Privacy Policy from time to time. When we do, we will update the "last updated" date at the top of this page. For material changes, we will notify active clients by email. Continued use of our website or services after changes take effect constitutes acceptance of the updated policy.',
        },
      ],
    },
    {
      heading: 'Contact us',
      blocks: [
        { k: 'p', text: 'For privacy-related questions, requests, or complaints:' },
        { k: 'p', label: 'Email', text: ': privacy@zegwastudio.com' },
        {
          k: 'p',
          label: 'Post',
          text: ': Zegwa Studio (OPC) Private Limited, No. 472/7, Balaji Arcade, AVS Compound, Ejipura, Koramangala VI Bk, Bangalore South, Karnataka, India 560095',
        },
        { k: 'p', text: 'We aim to respond to all privacy requests within 30 days.' },
      ],
    },
  ],
}

export default function PrivacyPage() {
  return <LegalPage content={CONTENT} />
}
