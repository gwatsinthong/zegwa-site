'use client'

import { useId, useRef, useState } from 'react'
import { Framed, HELV, PillCta } from './sections'

// Contact form from Figma frame 364:4943. Controlled inputs, NOT an HTML form
// submit, no browser storage. Talks to one external endpoint from the
// browser (NEXT_PUBLIC_CONTACT_ENDPOINT) -- a Google Apps Script Web App
// bound to a Sheet: it appends a row per submission and emails Gwatsin, so
// the primary action is a fetch, not a mailto (mailto depended on the
// visitor having a configured mail client and silently failed otherwise, no
// record of the message survived on our end either way). Required-field
// asterisks are red (#f91626), per the frame. Inputs are recessed white
// fields (inset shadow), rounded 8px.

const ENDPOINT = process.env.NEXT_PUBLIC_CONTACT_ENDPOINT

type Phase = 'form' | 'success' | 'error'

type FieldErrors = {
  name?: string
  email?: string
  message?: string
}

const COPY = {
  submit: 'Send message',
  submitting: 'Sending',
  reassure: 'We reply within one business day.',
  err: {
    name: 'Add your name.',
    emailRequired: 'Add your email.',
    emailFormat: 'Check your email address.',
    message: 'Add a message.',
  },
  successHeading: 'Message sent.',
  successBody: 'We reply within one business day. You can close this page.',
  errorHeading: 'That did not go through.',
  errorBody: 'Something went wrong on our end. Please try again in a moment.',
  tryAgain: 'Try again',
}

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

const FIELD_SHELL =
  'w-full rounded-[8px] bg-[#fefefe] px-[12px] py-[8px] text-[16px] leading-[1.5] text-[#202020] shadow-[inset_1px_1px_2px_0px_rgba(0,0,0,0.2),inset_-1px_-1px_2px_0px_rgba(0,0,0,0.2)] outline-none transition-shadow placeholder:text-[#777] focus-visible:ring-2 focus-visible:ring-[#202020]/20 disabled:opacity-60'

export default function ContactForm() {
  const [phase, setPhase] = useState<Phase>('form')
  const [submitting, setSubmitting] = useState(false)
  const [values, setValues] = useState({ name: '', email: '', message: '' })
  const [errors, setErrors] = useState<FieldErrors>({})

  const uid = useId()
  const submitted = useRef(false)

  const ids = {
    name: `${uid}-name`,
    email: `${uid}-email`,
    message: `${uid}-message`,
  }

  function setField(key: keyof typeof values, value: string) {
    setValues((v) => ({ ...v, [key]: value }))
    if (submitted.current) {
      setErrors((prev) => ({ ...prev, [key]: undefined }))
    }
  }

  function validate(): FieldErrors {
    const e: FieldErrors = {}
    if (!values.name.trim()) e.name = COPY.err.name
    if (!values.email.trim()) e.email = COPY.err.emailRequired
    else if (!EMAIL_RE.test(values.email.trim())) e.email = COPY.err.emailFormat
    if (!values.message.trim()) e.message = COPY.err.message
    return e
  }

  async function onSubmit() {
    submitted.current = true
    const e = validate()
    setErrors(e)
    const first = (['name', 'email', 'message'] as const).find((k) => e[k])
    if (first) {
      document.getElementById(ids[first])?.focus()
      return
    }

    setSubmitting(true)
    try {
      if (!ENDPOINT) {
        setPhase('error')
        return
      }
      // text/plain avoids a CORS preflight the Apps Script Web App can't
      // answer (it has no way to handle an OPTIONS request); the script
      // parses the body as JSON regardless of the declared content type.
      const res = await fetch(ENDPOINT, {
        method: 'POST',
        headers: { 'Content-Type': 'text/plain;charset=utf-8' },
        body: JSON.stringify({
          name: values.name.trim(),
          email: values.email.trim(),
          message: values.message.trim(),
        }),
      })
      if (!res.ok) {
        setPhase('error')
        return
      }
      const data: unknown = await res.json().catch(() => null)
      const status =
        data && typeof data === 'object' && 'status' in data
          ? (data as { status?: string }).status
          : undefined
      if (status === 'error') {
        setPhase('error')
        return
      }
      setPhase('success')
    } catch {
      setPhase('error')
    } finally {
      setSubmitting(false)
    }
  }

  function reset() {
    setPhase('form')
  }

  return (
    <Framed outer="p-[12px]" inner="p-[32px]" innerClass="flex flex-col gap-[24px]" className="w-full">
      <div style={{ fontFamily: HELV }} className="flex flex-col gap-[24px]">
        {phase === 'form' && (
          <>
            <Field
              id={ids.name}
              label="Name"
              value={values.name}
              onChange={(v) => setField('name', v)}
              placeholder="Your name"
              error={errors.name}
              disabled={submitting}
              autoComplete="name"
            />
            <Field
              id={ids.email}
              label="Email"
              type="email"
              value={values.email}
              onChange={(v) => setField('email', v)}
              placeholder="Your email address"
              error={errors.email}
              disabled={submitting}
              autoComplete="email"
            />
            <div className="flex w-full flex-col gap-[8px]">
              <FieldLabel htmlFor={ids.message}>Message</FieldLabel>
              <textarea
                id={ids.message}
                name="message"
                required
                aria-required="true"
                aria-invalid={errors.message ? true : undefined}
                aria-describedby={errors.message ? `${ids.message}-error` : undefined}
                rows={4}
                placeholder="Your message"
                value={values.message}
                onChange={(e) => setField('message', e.target.value)}
                disabled={submitting}
                className={`${FIELD_SHELL} h-[113px] resize-y ${errors.message ? 'ring-2 ring-[#f91626]/70' : ''}`}
              />
              {errors.message && (
                <p id={`${ids.message}-error`} className="text-[14px] leading-[1.5] text-[#f91626]">
                  {errors.message}
                </p>
              )}
            </div>

            <div className="flex flex-col items-start gap-[8px]">
              <PillCta
                tone="blackFlat"
                label={submitting ? COPY.submitting : COPY.submit}
                onClick={onSubmit}
                disabled={submitting}
                icon={submitting ? <Spinner tone="light" /> : undefined}
              />
              <p className="text-[16px] leading-[1.5] text-[#777]">{COPY.reassure}</p>
            </div>
          </>
        )}

        {phase === 'success' && (
          <div className="flex flex-col gap-[12px]" role="status" aria-live="polite">
            <CheckMark />
            <h2 style={{ fontFamily: HELV }} className="text-[20px] font-bold leading-[1.26] tracking-[-0.72px] text-[#202020] sm:text-[24px]">
              {COPY.successHeading}
            </h2>
            <p className="text-[16px] leading-[1.5] text-[#5c5c5c]">{COPY.successBody}</p>
          </div>
        )}

        {phase === 'error' && (
          <div className="flex flex-col items-start gap-[12px]" role="status" aria-live="polite">
            <h2 style={{ fontFamily: HELV }} className="text-[20px] font-bold leading-[1.26] tracking-[-0.72px] text-[#202020] sm:text-[24px]">
              {COPY.errorHeading}
            </h2>
            <p className="text-[16px] leading-[1.5] text-[#5c5c5c]">{COPY.errorBody}</p>
            <PillCta tone="blackFlat" label={COPY.tryAgain} onClick={reset} className="mt-[4px]" />
          </div>
        )}
      </div>
    </Framed>
  )
}

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

function Field({
  id,
  label,
  type = 'text',
  value,
  onChange,
  placeholder,
  error,
  disabled,
  autoComplete,
}: {
  id: string
  label: string
  type?: string
  value: string
  onChange: (value: string) => void
  placeholder?: string
  error?: string
  disabled?: boolean
  autoComplete?: string
}) {
  const errorId = `${id}-error`
  return (
    <div className="flex w-full flex-col gap-[8px]">
      <FieldLabel htmlFor={id}>{label}</FieldLabel>
      <input
        id={id}
        name={id}
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        disabled={disabled}
        required
        autoComplete={autoComplete}
        aria-required="true"
        aria-invalid={error ? true : undefined}
        aria-describedby={error ? errorId : undefined}
        className={`${FIELD_SHELL} ${error ? 'ring-2 ring-[#f91626]/70' : ''}`}
      />
      {error && (
        <p id={errorId} className="text-[14px] leading-[1.5] text-[#f91626]">
          {error}
        </p>
      )}
    </div>
  )
}

function Spinner({ tone = 'light' }: { tone?: 'light' | 'dark' }) {
  const track = tone === 'light' ? 'text-[#fefefe]/30' : 'text-[#202020]/25'
  const arc = tone === 'light' ? 'text-[#fefefe]' : 'text-[#202020]'
  return (
    <svg className="h-[16px] w-[16px] animate-spin" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="2.5" className={track} />
      <path d="M21 12a9 9 0 0 0-9-9" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" className={arc} />
    </svg>
  )
}

function CheckMark() {
  return (
    <svg
      width="28"
      height="28"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className="text-[#202020]"
    >
      <circle cx="12" cy="12" r="9" />
      <polyline points="8.5 12 11 14.5 15.5 9.5" />
    </svg>
  )
}
