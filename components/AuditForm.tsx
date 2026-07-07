'use client'

import { useId, useRef, useState } from 'react'
import { Framed, HELV, PillCta } from './sections'

// Reusable, embeddable "Get free audit" form (Figma frame 395:2244 "Start",
// demo card 395:2286). Talks to one external endpoint from the browser. No
// SSR, no storage APIs, no <form> submit (controlled inputs; the primary
// action is a plain button + fetch). Card, field, and submit-button styling
// are read verbatim from the frame; the selection/success/rate-limited/error
// panels have no frame counterpart (dynamic states), so they reuse the same
// design tokens for visual consistency rather than inventing a new look.

const ENDPOINT = process.env.NEXT_PUBLIC_AUDIT_ENDPOINT

type Candidate = { name: string; address: string; placeId: string }

type Phase = 'form' | 'selection' | 'success' | 'rate_limited' | 'error'

type FieldErrors = {
  businessName?: string
  city?: string
  email?: string
}

const COPY = {
  submit: 'Get my free audit',
  submitting: 'Sending your request',
  reassure:
    "No commitment. We'll never share your details. Your audit lands within 24 hours.",
  err: {
    businessName: 'Add your business name.',
    city: 'Add your city.',
    emailRequired: 'Add your email.',
    emailFormat: 'Check your email address.',
  },
  selectionHeading: 'We found a few. Which one is you?',
  selectionSub: 'Pick the one that matches so we audit the right business.',
  none: 'None of these',
  successHeading: 'Your audit is on the way.',
  successBody:
    "We're building it now. It will arrive by email in a few minutes.",
  successNote: 'You can close this page.',
  rateHeading: 'Just a moment.',
  rateBody: 'You have sent this a few times. Please wait a little, then try again.',
  errorHeading: 'That did not go through.',
  errorBody: 'Something went wrong on our end. Please try again in a moment.',
  tryAgain: 'Try again',
}

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export default function AuditForm({ className = '' }: { className?: string }) {
  const [phase, setPhase] = useState<Phase>('form')
  const [submitting, setSubmitting] = useState(false)
  const [values, setValues] = useState({
    businessName: '',
    city: '',
    email: '',
    website: '',
  })
  const [errors, setErrors] = useState<FieldErrors>({})
  const [candidates, setCandidates] = useState<Candidate[]>([])
  const [pendingChoice, setPendingChoice] = useState<string | null>(null)

  const uid = useId()
  const submitted = useRef(false)

  const ids = {
    businessName: `${uid}-business`,
    city: `${uid}-city`,
    email: `${uid}-email`,
    website: `${uid}-website`,
  }

  function setField(key: keyof typeof values, value: string) {
    setValues((v) => ({ ...v, [key]: value }))
    if (submitted.current && key !== 'website') {
      setErrors((prev) => ({ ...prev, [key]: undefined }))
    }
  }

  function validate(): FieldErrors {
    const e: FieldErrors = {}
    if (!values.businessName.trim()) e.businessName = COPY.err.businessName
    if (!values.city.trim()) e.city = COPY.err.city
    if (!values.email.trim()) e.email = COPY.err.emailRequired
    else if (!EMAIL_RE.test(values.email.trim())) e.email = COPY.err.emailFormat
    return e
  }

  function buildPayload(placeId?: string) {
    const payload: Record<string, string> = {
      businessName: values.businessName.trim(),
      city: values.city.trim(),
      email: values.email.trim(),
    }
    const website = values.website.trim()
    if (website) payload.website = website
    if (placeId) payload.placeId = placeId
    return payload
  }

  async function post(placeId?: string) {
    setSubmitting(true)
    try {
      if (!ENDPOINT) {
        setPhase('error')
        return
      }
      const res = await fetch(ENDPOINT, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(buildPayload(placeId)),
      })

      if (res.status === 429) {
        setPhase('rate_limited')
        return
      }

      const data: unknown = await res.json().catch(() => null)

      if (!res.ok) {
        setPhase('error')
        return
      }

      const status =
        data && typeof data === 'object' && 'status' in data
          ? (data as { status?: string }).status
          : undefined

      if (
        status === 'needs_selection' &&
        Array.isArray((data as { candidates?: unknown }).candidates)
      ) {
        setCandidates((data as { candidates: Candidate[] }).candidates)
        setPhase('selection')
        return
      }
      if (status === 'rate_limited') {
        setPhase('rate_limited')
        return
      }
      if (status === 'error') {
        setPhase('error')
        return
      }
      // processing, delivered, or any other success. There is no not-found.
      setPhase('success')
    } catch {
      setPhase('error')
    } finally {
      setSubmitting(false)
      setPendingChoice(null)
    }
  }

  function onSubmit() {
    submitted.current = true
    const e = validate()
    setErrors(e)
    const first = (['businessName', 'city', 'email'] as const).find((k) => e[k])
    if (first) {
      document.getElementById(ids[first])?.focus()
      return
    }
    post()
  }

  function onPick(placeId: string) {
    setPendingChoice(placeId)
    post(placeId)
  }

  function onNone() {
    setPendingChoice('none')
    post()
  }

  function reset() {
    setPhase('form')
  }

  return (
    <Framed
      outer="p-[12px]"
      inner="p-[32px]"
      innerClass="flex flex-col gap-[24px]"
      className={`w-full max-w-[500px] ${className}`}
    >
      <div style={{ fontFamily: HELV }} className="flex flex-col gap-[24px]">
        {phase === 'form' && (
          <>
            <Field
              id={ids.businessName}
              label="Business name"
              required
              value={values.businessName}
              onChange={(v) => setField('businessName', v)}
              placeholder="Your business name"
              error={errors.businessName}
              disabled={submitting}
              autoComplete="organization"
            />
            <Field
              id={ids.city}
              label="Business location / city"
              required
              value={values.city}
              onChange={(v) => setField('city', v)}
              placeholder="To audit your online local presence"
              error={errors.city}
              disabled={submitting}
              autoComplete="address-level2"
            />
            <Field
              id={ids.email}
              label="Email"
              type="email"
              required
              value={values.email}
              onChange={(v) => setField('email', v)}
              placeholder="To send you the audit report"
              error={errors.email}
              disabled={submitting}
              autoComplete="email"
            />
            <Field
              id={ids.website}
              label="Website URL (optional)"
              type="url"
              value={values.website}
              onChange={(v) => setField('website', v)}
              placeholder="Your website"
              disabled={submitting}
              autoComplete="url"
            />

            <div className="flex flex-col items-stretch gap-[8px]">
              <PillCta
                tone="blackFlat"
                block
                label={submitting ? COPY.submitting : COPY.submit}
                onClick={onSubmit}
                disabled={submitting}
                icon={submitting ? <Spinner tone="light" /> : undefined}
              />
              <p className="text-center text-[16px] leading-[1.5] text-[#777]">{COPY.reassure}</p>
            </div>
          </>
        )}

        {phase === 'selection' && (
          <div className="flex flex-col gap-[24px]" role="group" aria-label={COPY.selectionHeading}>
            <div className="flex flex-col gap-[8px]">
              <h2 style={{ fontFamily: HELV }} className="text-[20px] font-bold leading-[1.26] tracking-[-0.72px] text-[#202020] sm:text-[24px]">
                {COPY.selectionHeading}
              </h2>
              <p className="text-[16px] leading-[1.5] text-[#5c5c5c]">{COPY.selectionSub}</p>
            </div>
            <ul className="flex flex-col gap-[12px]">
              {candidates.map((c, i) => (
                <li key={c.placeId || i}>
                  <button
                    type="button"
                    onClick={() => onPick(c.placeId)}
                    disabled={submitting}
                    className="flex w-full items-center justify-between gap-[12px] rounded-[8px] bg-[#fefefe] px-[16px] py-[12px] text-left shadow-[inset_1px_1px_2px_0px_rgba(0,0,0,0.2),inset_-1px_-1px_2px_0px_rgba(0,0,0,0.2)] outline-none transition-shadow hover:shadow-[inset_1px_1px_2px_0px_rgba(0,0,0,0.35),inset_-1px_-1px_2px_0px_rgba(0,0,0,0.35)] focus-visible:ring-2 focus-visible:ring-[#202020]/20 disabled:opacity-60"
                  >
                    <span className="flex flex-col gap-[2px]">
                      <span className="text-[16px] font-bold leading-[1.5] text-[#202020]">{c.name}</span>
                      <span className="text-[14px] leading-[1.5] text-[#5c5c5c]">{c.address}</span>
                    </span>
                    {pendingChoice === c.placeId && <Spinner tone="dark" />}
                  </button>
                </li>
              ))}
            </ul>
            <button
              type="button"
              onClick={onNone}
              disabled={submitting}
              className="self-start text-[14px] font-bold leading-[1.5] text-[#5c5c5c] underline underline-offset-4 outline-none transition-colors hover:text-[#202020] focus-visible:text-[#202020] disabled:opacity-60"
            >
              {pendingChoice === 'none' ? COPY.submitting : COPY.none}
            </button>
          </div>
        )}

        {phase === 'success' && (
          <div className="flex flex-col gap-[12px]" role="status" aria-live="polite">
            <CheckMark />
            <h2 style={{ fontFamily: HELV }} className="text-[20px] font-bold leading-[1.26] tracking-[-0.72px] text-[#202020] sm:text-[24px]">
              {COPY.successHeading}
            </h2>
            <p className="text-[16px] leading-[1.5] text-[#5c5c5c]">{COPY.successBody}</p>
            <p className="text-[14px] leading-[1.5] text-[#777]">{COPY.successNote}</p>
          </div>
        )}

        {phase === 'rate_limited' && (
          <StatusPanel
            heading={COPY.rateHeading}
            body={COPY.rateBody}
            actionLabel={COPY.tryAgain}
            onAction={reset}
          />
        )}

        {phase === 'error' && (
          <StatusPanel
            heading={COPY.errorHeading}
            body={COPY.errorBody}
            actionLabel={COPY.tryAgain}
            onAction={reset}
          />
        )}
      </div>
    </Framed>
  )
}

function Field({
  id,
  label,
  type = 'text',
  value,
  onChange,
  placeholder,
  required,
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
  required?: boolean
  error?: string
  disabled?: boolean
  autoComplete?: string
}) {
  const errorId = `${id}-error`
  return (
    <div className="flex w-full flex-col gap-[8px]">
      <label htmlFor={id} className="text-[14px] font-bold leading-[1.5] text-[#202020]">
        {label}
        {required && (
          <span aria-hidden="true" className="text-[#f91626]">
            *
          </span>
        )}
      </label>
      <input
        id={id}
        name={id}
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        disabled={disabled}
        required={required}
        autoComplete={autoComplete}
        aria-required={required || undefined}
        aria-invalid={error ? true : undefined}
        aria-describedby={error ? errorId : undefined}
        className={`w-full rounded-[8px] bg-[#fefefe] px-[12px] py-[8px] text-[16px] leading-[1.5] text-[#202020] shadow-[inset_1px_1px_2px_0px_rgba(0,0,0,0.2),inset_-1px_-1px_2px_0px_rgba(0,0,0,0.2)] outline-none transition-shadow placeholder:text-[#777] focus-visible:ring-2 focus-visible:ring-[#202020]/20 disabled:opacity-60 ${
          error ? 'ring-2 ring-[#f91626]/70' : ''
        }`}
      />
      {error && (
        <p id={errorId} className="text-[14px] leading-[1.5] text-[#f91626]">
          {error}
        </p>
      )}
    </div>
  )
}

function StatusPanel({
  heading,
  body,
  actionLabel,
  onAction,
}: {
  heading: string
  body: string
  actionLabel: string
  onAction: () => void
}) {
  return (
    <div className="flex flex-col items-start gap-[12px]" role="status" aria-live="polite">
      <h2 style={{ fontFamily: HELV }} className="text-[20px] font-bold leading-[1.26] tracking-[-0.72px] text-[#202020] sm:text-[24px]">
        {heading}
      </h2>
      <p className="text-[16px] leading-[1.5] text-[#5c5c5c]">{body}</p>
      <PillCta tone="blackFlat" label={actionLabel} onClick={onAction} className="mt-[4px]" />
    </div>
  )
}

function Spinner({ tone = 'light' }: { tone?: 'light' | 'dark' }) {
  const track = tone === 'light' ? 'text-[#fefefe]/30' : 'text-[#202020]/25'
  const arc = tone === 'light' ? 'text-[#fefefe]' : 'text-[#202020]'
  return (
    <svg
      className="h-[16px] w-[16px] animate-spin"
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
    >
      <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="2.5" className={track} />
      <path
        d="M21 12a9 9 0 0 0-9-9"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinecap="round"
        className={arc}
      />
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
