'use client'

import { useState } from 'react'
import { HELV, Framed, PillCta } from './sections'

// Contact form from Figma frame 364:4943. Controlled inputs, NOT an HTML form
// submit, no browser storage. No submit endpoint is specified, so the primary
// action composes a mailto to hello@zegwastudio.com (matches the frame's
// "Prefer email?" block). Required-field asterisks are red (#f91626), per the
// frame. Inputs are recessed white fields (inset shadow), rounded 8px.

const CONTACT_EMAIL = 'hello@zegwastudio.com'

const FIELDS = [
  { id: 'name', label: 'Name', type: 'text', placeholder: 'Your name', autoComplete: 'name' },
  {
    id: 'email',
    label: 'Email',
    type: 'email',
    placeholder: 'Your email address',
    autoComplete: 'email',
  },
] as const

const FIELD_SHELL =
  'w-full rounded-[8px] bg-[#fefefe] px-[12px] py-[8px] text-[16px] leading-[1.5] text-[#202020] shadow-[inset_1px_1px_2px_0px_rgba(0,0,0,0.2),inset_-1px_-1px_2px_0px_rgba(0,0,0,0.2)] outline-none transition-shadow placeholder:text-[#777] focus-visible:ring-2 focus-visible:ring-[#202020]/20'

function FieldLabel({ htmlFor, children }: { htmlFor: string; children: React.ReactNode }) {
  return (
    <label htmlFor={htmlFor} className="text-[14px] font-bold leading-[1.5] text-[#202020]">
      {children}
      <span aria-hidden="true" className="text-[#f91626]">
        *
      </span>
    </label>
  )
}

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
    <Framed outer="p-[12px]" inner="p-[32px]" innerClass="flex flex-col gap-[24px]" className="w-full">
      <div style={{ fontFamily: HELV }} className="flex flex-col gap-[24px]">
        {FIELDS.map((f) => (
          <div key={f.id} className="flex w-full flex-col gap-[8px]">
            <FieldLabel htmlFor={`contact-${f.id}`}>{f.label}</FieldLabel>
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
              className={FIELD_SHELL}
            />
          </div>
        ))}

        <div className="flex w-full flex-col gap-[8px]">
          <FieldLabel htmlFor="contact-message">Message</FieldLabel>
          <textarea
            id="contact-message"
            name="message"
            required
            aria-required="true"
            rows={4}
            placeholder="Your message"
            value={values.message}
            onChange={(e) => set('message', e.target.value)}
            className={`${FIELD_SHELL} h-[113px] resize-y`}
          />
        </div>

        <div className="flex flex-col items-start gap-[8px]">
          <PillCta tone="blackFlat" label="Send message" onClick={onSend} />
          <p className="text-[16px] leading-[1.5] text-[#777]">We reply within one business day.</p>
        </div>
      </div>
    </Framed>
  )
}
