'use client'

import { useState } from 'react'
import { HELV } from './sections'

// Free-audit form for the /start orphan page (business-card QR target). No
// backend: submit builds a wa.me link with the field values folded into the
// message and opens it. No fetch, no endpoint, nothing that can silently
// fail -- the only "send" path is handing off to WhatsApp itself.

const WHATSAPP_NUMBER = '917026949689'

const CHOICES = ['Website review', 'Local SEO', 'App or software']

const PILL_BASE =
  'whitespace-nowrap rounded-[999px] border px-[16px] py-[8px] text-[14px] font-bold tracking-[0.16px] outline-none transition-colors focus-visible:ring-2 focus-visible:ring-[#202020]/30'
const PILL_ACTIVE = 'border-[#202020] bg-[#202020] text-[#fefefe]'
const PILL_INACTIVE = 'border-[#e0e0e0] bg-[#fefefe] text-[#5c5c5c] hover:border-[#202020] hover:text-[#202020]'

const FIELD_SHELL =
  'w-full rounded-[8px] bg-[#fefefe] px-[12px] py-[8px] text-[16px] leading-[1.5] text-[#202020] shadow-[inset_1px_1px_2px_0px_rgba(0,0,0,0.2),inset_-1px_-1px_2px_0px_rgba(0,0,0,0.2)] outline-none transition-shadow placeholder:text-[#777] focus-visible:ring-2 focus-visible:ring-[#202020]/20'

export function buildWhatsAppUrl({
  choice,
  site,
  notes,
}: {
  choice: string | null
  site: string
  notes: string
}) {
  const need = choice ?? 'Not sure'
  const siteText = site.trim() || 'not yet'
  const notesText = notes.trim() || 'none'
  const message = `Hi Zegwa Studio, I'd like a free audit. Need: ${need}. Site: ${siteText}. Notes: ${notesText}`
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`
}

export default function StartAuditForm() {
  const [choice, setChoice] = useState<string | null>(null)
  const [site, setSite] = useState('')
  const [notes, setNotes] = useState('')

  function onSubmit() {
    const url = buildWhatsAppUrl({ choice, site, notes })
    window.open(url, '_blank')
  }

  return (
    <div
      style={{ fontFamily: HELV }}
      className="flex w-full flex-col gap-[24px] rounded-[16px] bg-[#fefefe] p-[24px] shadow-[-1px_-1px_4px_0px_rgba(0,0,0,0.15),1px_1px_4px_0px_rgba(0,0,0,0.15)] sm:p-[32px]"
    >
      <div className="flex flex-col gap-[12px]">
        <p className="text-[14px] font-bold leading-[1.5] text-[#202020]">What do you need?</p>
        <div className="flex flex-wrap gap-[8px]">
          {CHOICES.map((c) => (
            <button
              key={c}
              type="button"
              aria-pressed={choice === c}
              onClick={() => setChoice(c)}
              className={`${PILL_BASE} ${choice === c ? PILL_ACTIVE : PILL_INACTIVE}`}
            >
              {c}
            </button>
          ))}
        </div>
      </div>

      <div className="flex flex-col gap-[8px]">
        <label htmlFor="audit-site" className="text-[14px] font-bold leading-[1.5] text-[#202020]">
          Website
        </label>
        <input
          id="audit-site"
          type="text"
          value={site}
          onChange={(e) => setSite(e.target.value)}
          placeholder="yourwebsite.com"
          className={FIELD_SHELL}
        />
      </div>

      <div className="flex flex-col gap-[8px]">
        <label htmlFor="audit-notes" className="text-[14px] font-bold leading-[1.5] text-[#202020]">
          Notes
        </label>
        <input
          id="audit-notes"
          type="text"
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder="Anything specific? (optional)"
          className={FIELD_SHELL}
        />
      </div>

      <button
        type="button"
        onClick={onSubmit}
        className="flex w-full items-center justify-center gap-[10px] rounded-[999px] bg-gradient-to-b from-[#4a4a4a] to-black px-[24px] py-[12px] text-[16px] font-bold tracking-[0.16px] text-[#fefefe] outline-none transition-colors focus-visible:ring-2 focus-visible:ring-[#202020]/30"
      >
        Send on WhatsApp
      </button>
    </div>
  )
}
