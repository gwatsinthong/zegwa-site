import Link from 'next/link'
import Logo from './Logo'

const LEGAL = [
  { label: 'Privacy', href: '/privacy' },
  { label: 'Terms', href: '/terms' },
  { label: 'Cookies', href: '/cookies' },
]

export default function Footer() {
  return (
    <footer className="border-t border-hairline">
      <div className="mx-auto w-full max-w-shell px-6 py-12">
        <div className="flex flex-col gap-10 md:flex-row md:items-start md:justify-between">
          <Logo />

          <div className="max-w-xs text-sm text-muted">
            <p className="mb-2 font-medium text-text">
              Zegwa Studio (OPC) Private Limited
            </p>
            <address className="not-italic leading-relaxed">
              No. 472/7, Balaji Arcade, AVS Compound, Ejipura, Koramangala VI Bk,
              Bangalore South, Karnataka, India 560095
            </address>
          </div>

          <nav className="flex flex-col gap-3 text-sm">
            {LEGAL.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="text-muted transition-colors hover:text-text"
              >
                {item.label}
              </Link>
            ))}
            <button
              type="button"
              className="text-left text-muted transition-colors hover:text-text"
            >
              Cookie settings
            </button>
          </nav>
        </div>

        <div className="mt-10 flex flex-col gap-1 border-t border-hairline pt-6 text-xs text-muted md:flex-row md:justify-between">
          <p>© 2026 Zegwa Studio (OPC) Private Limited. All rights reserved.</p>
          <p>Zegwa Studio (OPC) Private Limited · CIN U62012KA2026OPC218915</p>
        </div>
      </div>
    </footer>
  )
}
