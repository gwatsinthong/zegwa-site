'use client'

import { useState } from 'react'
import { Arrow } from './icons'

// Contact form from Figma frame 364:4941. Controlled inputs, not an HTML form
// submit, no browser storage. No submit endpoint is specified, so the primary
// action composes a mailto to hello@zegwastudio.com (matches the frame's
// "Prefer email?" block). Required-field asterisks are red, per the frame.

const CONTACT_EMAIL = 'hello@zegwastudio.com'

const FIELDS = [
  { id: 'name', label: 'Name', type: 'text', placeholder: 'Your name', autoComplete: 'name' },
  { id: 'email', label: 'Email', type: 'email', placeholder: 'Your email address', autoComplete: 'email' },
] as const

export default function ContactForm() {
  const [values, setValues] = useState({ name: '', email: '', message: '' })

  function set(id: keyof typeof values, v: string) {
    setValues((prev) => ({ ...prev, [id]: v }))
  }

  function onSend() {
    const firstEmpty = (['name', 'email', 'message'] as const).find((k) => !values[k].trim())
    if (firstEmpty) {
      document.getElementById(`contact-${firstEmpty}`)?.focus()
      return
    }
    const subject = `Website enquiry from ${values.name.trim()}`
    const body = `${values.message.trim()}\n\nFrom: ${values.name.trim()} <${values.email.trim()}>`
    window.location.href = `mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent(
      subject,
    )}&body=${encodeURIComponent(body)}`
  }

  return (
    <div className="border border-hairline bg-white p-6 sm:p-8">
      <div className="flex flex-col gap-6">
        {FIELDS.map((f) => (
          <div key={f.id} className="flex flex-col gap-2">
            <label htmlFor={`contact-${f.id}`} className="text-sm font-medium text-text">
              {f.label}
              <span aria-hidden="true" className="text-accent-red">
                *
              </span>
            </label>
            <input
              id={`contact-${f.id}`}
              name={f.id}
              type={f.type}
              required
              aria-required="true"
              autoComplete={f.autoComplete}
              placeholder={f.placeholder}
              value={values[f.id]}
              onChange={(e) => set(f.id, e.target.value)}
              className="w-full border border-hairline bg-white px-3 py-2.5 text-base text-text outline-none transition-colors placeholder:text-muted focus-visible:border-text focus-visible:ring-2 focus-visible:ring-text/15"
            />
          </div>
        ))}

        <div className="flex flex-col gap-2">
          <label htmlFor="contact-message" className="text-sm font-medium text-text">
            Message
            <span aria-hidden="true" className="text-accent-red">
              *
            </span>
          </label>
          <textarea
            id="contact-message"
            name="message"
            required
            aria-required="true"
            rows={4}
            placeholder="Your message"
            value={values.message}
            onChange={(e) => set('message', e.target.value)}
            className="w-full resize-y border border-hairline bg-white px-3 py-2.5 text-base text-text outline-none transition-colors placeholder:text-muted focus-visible:border-text focus-visible:ring-2 focus-visible:ring-text/15"
          />
        </div>

        <div className="flex flex-col gap-2">
          <button
            type="button"
            onClick={onSend}
            className="inline-flex items-center justify-center gap-2 self-start bg-text px-6 py-3 text-base font-medium text-bg outline-none transition-opacity hover:opacity-90 focus-visible:ring-2 focus-visible:ring-text/40 focus-visible:ring-offset-2 focus-visible:ring-offset-white"
          >
            Send message
            <Arrow />
          </button>
          <p className="text-sm text-muted">We reply within one business day.</p>
        </div>
      </div>
    </div>
  )
}
