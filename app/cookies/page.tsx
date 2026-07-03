import type { Metadata } from 'next'
import { LegalPage, type LegalContent } from '@/components/sections'

export const metadata: Metadata = { title: 'Cookie Policy · Zegwa' }

// Copy is verbatim from Figma frame 387:2000. Legal text is authoritative.
// Note: the frame's hero kicker text node reads "TERMS" (a copy-paste leftover);
// rendered here as "Cookies" to match the page. Flagged for review.

const CONTENT: LegalContent = {
  kicker: 'Cookies',
  title: 'Cookie Policy',
  org: 'Zegwa Studio (OPC) Private Limited',
  updated: 'Last updated: July 2026',
  sections: [
    {
      heading: 'What are cookies',
      blocks: [
        {
          k: 'p',
          text: 'Cookies are small text files placed on your device when you visit a website. They allow the website to remember information about your visit, like your preferences or whether you have seen a particular notice before. Similar technologies include web beacons, pixels, and local storage. Where we refer to "cookies" in this policy, we mean cookies and all similar technologies.',
        },
      ],
    },
    {
      heading: 'What cookies we use',
      blocks: [
        {
          k: 'p',
          text: 'We use cookies for two purposes: to run the site (essential) and to understand how visitors use it (analytics, only with your consent). We do not use advertising, retargeting, or third-party marketing cookies.',
        },
        {
          k: 'p',
          label: 'Essential cookies',
          text: ' These are required for the website to function. They cannot be disabled.',
        },
        {
          k: 'table',
          head: ['Cookie', 'Purpose', 'Duration'],
          rows: [
            ['Session cookie', 'Maintains your session as you navigate the site', 'Session (deleted when browser closes)'],
            ['Cookie consent', 'Stores your cookie preference so we do not ask again', '12 months'],
          ],
        },
        {
          k: 'p',
          label: 'Analytics cookies',
          text: ' These help us understand how visitors use the site. They are set only after you consent through our cookie banner.',
        },
        {
          k: 'table',
          head: ['Cookie', 'Provider', 'Purpose', 'Duration'],
          rows: [
            ['_ga', 'Google Analytics 4', 'Distinguishes unique visitors', '24 months'],
            ['_ga_[ID]', 'Google Analytics 4', 'Persists session state', '24 months'],
          ],
        },
      ],
    },
    {
      heading: 'What we do not use',
      blocks: [
        { k: 'p', text: 'We do not use:' },
        {
          k: 'ul',
          items: ['Third-party marketing cookies', 'Fingerprinting or similar tracking technologies'],
        },
        {
          k: 'p',
          text: 'If we add analytics in the future, we will update this policy, add the relevant cookie details here, and request your consent through the cookie banner where required by law.',
        },
      ],
    },
    {
      heading: 'Why we use cookies',
      blocks: [
        {
          k: 'p',
          text: 'We use essential cookies to operate the site. Without them, basic functions like page navigation, form submission, and remembering your cookie preference would not work.',
        },
      ],
    },
    {
      heading: 'How to manage cookies',
      blocks: [
        { k: 'sub', text: 'Cookie consent banner' },
        {
          k: 'p',
          text: 'When you first visit, a banner asks for consent to analytics cookies. You can accept or decline, and change your choice anytime via the cookie settings link in the footer. Analytics cookies are not set unless you accept. Declining does not affect your ability to use the site.',
        },
        { k: 'sub', text: 'Browser settings' },
        {
          k: 'p',
          text: 'You can control cookies through your browser settings. Most browsers allow you to:',
        },
        {
          k: 'ul',
          items: ['See what cookies are set', 'Block all or specific cookies', 'Delete cookies at any time'],
        },
        {
          k: 'p',
          text: 'Links to cookie settings for common browsers: Google Chrome, Mozilla Firefox, Safari, Microsoft Edge.',
        },
        { k: 'p', text: 'Disabling essential cookies may affect the functionality of the site.' },
      ],
    },
    {
      heading: 'Third-party cookies',
      blocks: [
        {
          k: 'p',
          text: 'With your consent, Google Analytics 4 (provided by Google LLC) sets analytics cookies on our behalf. Google is contractually bound to process this data only to provide analytics services to us. We do not embed other third-party content (social feeds, video players, ad networks) that would set additional cookies.',
        },
      ],
    },
    {
      heading: 'Do Not Track',
      blocks: [
        {
          k: 'p',
          text: 'Some browsers send a "Do Not Track" signal. We honor it by not setting analytics cookies when it is detected.',
        },
      ],
    },
    {
      heading: 'Changes to this policy',
      blocks: [
        {
          k: 'p',
          text: 'We may update this Cookie Policy when we change the cookies we use or when regulations require it. When we do, we will update the "last updated" date at the top of this page. For material changes, we will re-prompt your consent through the cookie banner where required.',
        },
      ],
    },
    {
      heading: 'Contact us',
      blocks: [
        { k: 'p', text: 'For questions about our use of cookies:' },
        { k: 'p', label: 'Email', text: ': privacy@zegwastudio.com' },
        {
          k: 'p',
          label: 'Post',
          text: ': Zegwa Studio (OPC) Private Limited, No. 472/7, Balaji Arcade, AVS Compound, Ejipura, Koramangala VI Bk, Bangalore South, Karnataka, India 560095',
        },
      ],
    },
  ],
}

export default function CookiesPage() {
  return <LegalPage content={CONTENT} />
}
