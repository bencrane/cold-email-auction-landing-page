"use client";

import { useEffect, useState } from "react";
import { Button, Eyebrow } from "./ui";

const CRITERIA = [
  "Proven at 250k+ contacts a month",
  "A named deliverability lead on the team",
  "Email authentication set up properly",
  "Regular list clean-ups, documented",
];

function Modal({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const [sent, setSent] = useState(false);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="partner-modal-title"
    >
      <button
        aria-label="Close"
        onClick={onClose}
        className="absolute inset-0 bg-[var(--site-navy)]/45 backdrop-blur-sm"
      />
      <div className="relative w-full max-w-lg rounded-sm border border-[var(--site-rule)] bg-[var(--site-paper)] p-8 shadow-2xl">
        {sent ? (
          <>
            <Eyebrow>Received</Eyebrow>
            <h3
              id="partner-modal-title"
              className="mt-3 font-serif text-2xl text-[var(--site-navy)]"
            >
              We&rsquo;ll route this within two business days.
            </h3>
            <p className="mt-3 text-[15px] leading-relaxed text-[var(--site-muted)]">
              Two or three partners that fit your volume and market, with
              references. We don&rsquo;t blast your brief to the whole list.
            </p>
            <p className="mt-4 text-[13px] text-[var(--site-accent)]">
              Prototype — no data left your browser.
            </p>
            <div className="mt-6">
              <Button variant="outline" onClick={onClose}>
                Close
              </Button>
            </div>
          </>
        ) : (
          <>
            <Eyebrow>Enterprise intake</Eyebrow>
            <h3
              id="partner-modal-title"
              className="mt-3 font-serif text-2xl text-[var(--site-navy)]"
            >
              Request partner introductions
            </h3>
            <form
              className="mt-6 space-y-4"
              onSubmit={(e) => {
                e.preventDefault();
                setSent(true);
              }}
            >
              {[
                { id: "pf-company", label: "Company", type: "text" },
                { id: "pf-email", label: "Work email", type: "email" },
              ].map((f) => (
                <div key={f.id}>
                  <label
                    htmlFor={f.id}
                    className="block text-[13px] font-medium text-[var(--site-ink)]"
                  >
                    {f.label}
                  </label>
                  <input
                    id={f.id}
                    type={f.type}
                    required
                    className="mt-1.5 w-full rounded-sm border border-[var(--site-rule)] bg-white px-3 py-2.5 text-[15px] text-[var(--site-ink)] focus:border-[var(--site-navy)] focus:outline-none"
                  />
                </div>
              ))}
              <div>
                <label
                  htmlFor="pf-volume"
                  className="block text-[13px] font-medium text-[var(--site-ink)]"
                >
                  Monthly sending volume
                </label>
                <select
                  id="pf-volume"
                  className="mt-1.5 w-full rounded-sm border border-[var(--site-rule)] bg-white px-3 py-2.5 text-[15px] text-[var(--site-ink)] focus:border-[var(--site-navy)] focus:outline-none"
                >
                  <option>Under 100k</option>
                  <option>100k – 500k</option>
                  <option>500k – 2M</option>
                  <option>2M+</option>
                </select>
              </div>
              <Button type="submit" size="lg" className="w-full">
                Submit brief
              </Button>
            </form>
          </>
        )}
      </div>
    </div>
  );
}

export function PartnerFunnel() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <div className="grid gap-10 rounded-sm border border-[var(--site-navy)]/20 bg-[var(--site-navy)] p-8 text-[var(--site-cream)] md:grid-cols-[1.15fr_1fr] md:p-12">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[var(--site-accent)]">
            Certified Agency Partners
          </p>
          <h2 className="mt-4 font-serif text-3xl leading-tight md:text-4xl">
            Rather have someone run it for you?
          </h2>
          <p className="mt-4 max-w-lg text-[16px] leading-relaxed text-[var(--site-cream)]/75">
            A short list of agencies we&rsquo;ve vetted ourselves — how they
            send, how they keep lists clean, and whether they can hold up at
            volume. Tell us what you need and we&rsquo;ll point you at two or
            three that fit.
          </p>
          <div className="mt-7 flex flex-wrap gap-3">
            <Button
              onClick={() => setOpen(true)}
              size="lg"
              className="!bg-[var(--site-cream)] !text-[var(--site-navy)] hover:!bg-white"
            >
              Request introductions
            </Button>
            <Button
              href="/site/directory"
              size="lg"
              variant="outline"
              className="!border-[var(--site-cream)]/40 !text-[var(--site-cream)] hover:!bg-[var(--site-cream)] hover:!text-[var(--site-navy)]"
            >
              Review the standard
            </Button>
          </div>
        </div>

        <div className="rounded-sm border border-[var(--site-cream)]/20 bg-[var(--site-cream)]/[0.04] p-6">
          <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[var(--site-cream)]/60">
            Partner qualification
          </p>
          <ul className="mt-4 space-y-3">
            {CRITERIA.map((c) => (
              <li key={c} className="flex gap-3 text-[15px] leading-snug">
                <span
                  aria-hidden="true"
                  className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-[var(--site-accent)]"
                />
                <span className="text-[var(--site-cream)]/85">{c}</span>
              </li>
            ))}
          </ul>
          <p className="mt-6 border-t border-[var(--site-cream)]/15 pt-4 text-[13px] text-[var(--site-cream)]/50">
            Re-checked twice a year. Placement can&rsquo;t be bought.
          </p>
        </div>
      </div>
      <Modal open={open} onClose={() => setOpen(false)} />
    </>
  );
}
