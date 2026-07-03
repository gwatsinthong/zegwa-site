'use client'

import { useId, useRef, useState } from 'react'

// Reusable, embeddable "Get free audit" form.
// Talks to one external endpoint from the browser. No SSR, no storage APIs.

const ENDPOINT = process.env.NEXT_PUBLIC_AUDIT_ENDPOINT

type Candidate = { name: string; address: string; placeId: string }

type Phase = 'form' | 'selection' | 'success' | 'rate_limited' | 'error'

type FieldErrors = {
  businessName?: string
  city?: string
  email?: string
}

const COPY = {
  submit: 'Get free audit',
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
    <div className={`w-full max-w-[480px] ${className}`}>
      <div className="border border-hairline bg-white p-6 sm:p-8">
        {phase === 'form' && (
          <div className="flex flex-col gap-6">
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
              label="City"
              required
              value={values.city}
              onChange={(v) => setField('city', v)}
              placeholder="Your city"
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
              placeholder="you@business.com"
              error={errors.email}
              disabled={submitting}
              autoComplete="email"
            />
            <Field
              id={ids.website}
              label="Website"
              type="url"
              optional
              value={values.website}
              onChange={(v) => setField('website', v)}
              placeholder="yourbusiness.com"
              disabled={submitting}
              autoComplete="url"
            />

            <div className="flex flex-col gap-3">
              <button
                type="button"
                onClick={onSubmit}
                disabled={submitting}
                aria-disabled={submitting}
                className="flex w-full items-center justify-center gap-2 bg-text px-6 py-3 text-base font-medium text-bg outline-none transition-opacity hover:opacity-90 focus-visible:ring-2 focus-visible:ring-text/40 focus-visible:ring-offset-2 focus-visible:ring-offset-white disabled:cursor-wait"
              >
                {submitting ? (
                  <>
                    <Spinner />
                    {COPY.submitting}
                  </>
                ) : (
                  <>
                    {COPY.submit}
                    <Arrow />
                  </>
                )}
              </button>
              <p className="text-center text-sm text-muted">{COPY.reassure}</p>
            </div>
          </div>
        )}

        {phase === 'selection' && (
          <div className="flex flex-col gap-5" role="group" aria-label={COPY.selectionHeading}>
            <div className="flex flex-col gap-1">
              <h2 className="font-display text-xl">{COPY.selectionHeading}</h2>
              <p className="text-sm text-muted">{COPY.selectionSub}</p>
            </div>
            <ul className="flex flex-col gap-3">
              {candidates.map((c, i) => (
                <li key={c.placeId || i}>
                  <button
                    type="button"
                    onClick={() => onPick(c.placeId)}
                    disabled={submitting}
                    className="flex w-full items-center justify-between gap-3 border border-hairline bg-white px-4 py-3 text-left outline-none transition-colors hover:border-text focus-visible:border-text focus-visible:ring-2 focus-visible:ring-text/15 disabled:opacity-60"
                  >
                    <span className="flex flex-col gap-0.5">
                      <span className="font-medium text-text">{c.name}</span>
                      <span className="text-sm text-muted">{c.address}</span>
                    </span>
                    {pendingChoice === c.placeId && <Spinner tone="text" />}
                  </button>
                </li>
              ))}
            </ul>
            <button
              type="button"
              onClick={onNone}
              disabled={submitting}
              className="self-start text-sm text-muted underline underline-offset-4 outline-none transition-colors hover:text-text focus-visible:text-text disabled:opacity-60"
            >
              {pendingChoice === 'none' ? COPY.submitting : COPY.none}
            </button>
          </div>
        )}

        {phase === 'success' && (
          <div className="flex flex-col gap-3" role="status" aria-live="polite">
            <CheckMark />
            <h2 className="font-display text-xl">{COPY.successHeading}</h2>
            <p className="text-muted">{COPY.successBody}</p>
            <p className="text-sm text-muted">{COPY.successNote}</p>
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
    </div>
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
  optional,
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
  optional?: boolean
  error?: string
  disabled?: boolean
  autoComplete?: string
}) {
  const errorId = `${id}-error`
  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={id} className="text-sm font-medium text-text">
        {label}
        {required && (
          <span aria-hidden="true" className="text-muted">
            {' '}
            *
          </span>
        )}
        {optional && <span className="font-normal text-muted"> (optional)</span>}
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
        className={`w-full border bg-white px-3 py-2.5 text-base text-text outline-none transition-colors placeholder:text-muted focus-visible:border-text focus-visible:ring-2 focus-visible:ring-text/15 disabled:opacity-60 ${
          error ? 'border-text' : 'border-hairline'
        }`}
      />
      {error && (
        <p id={errorId} className="text-sm text-text">
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
    <div className="flex flex-col gap-3" role="status" aria-live="polite">
      <h2 className="font-display text-xl">{heading}</h2>
      <p className="text-muted">{body}</p>
      <button
        type="button"
        onClick={onAction}
        className="mt-1 self-start bg-text px-5 py-2.5 text-sm font-medium text-bg outline-none transition-opacity hover:opacity-90 focus-visible:ring-2 focus-visible:ring-text/40 focus-visible:ring-offset-2 focus-visible:ring-offset-white"
      >
        {actionLabel}
      </button>
    </div>
  )
}

function Spinner({ tone = 'bg' }: { tone?: 'bg' | 'text' }) {
  return (
    <svg
      className="h-4 w-4 animate-spin"
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
    >
      <circle
        cx="12"
        cy="12"
        r="9"
        stroke="currentColor"
        strokeWidth="2.5"
        className={tone === 'bg' ? 'text-bg/30' : 'text-text/25'}
      />
      <path
        d="M21 12a9 9 0 0 0-9-9"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinecap="round"
        className={tone === 'bg' ? 'text-bg' : 'text-text'}
      />
    </svg>
  )
}

function Arrow() {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.75"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <line x1="5" y1="12" x2="19" y2="12" />
      <polyline points="13 6 19 12 13 18" />
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
      className="text-text"
    >
      <circle cx="12" cy="12" r="9" />
      <polyline points="8.5 12 11 14.5 15.5 9.5" />
    </svg>
  )
}
