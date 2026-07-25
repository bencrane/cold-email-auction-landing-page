"use client";

import { useState } from "react";
import { Button } from "./ui";

export function NewsletterForm({
  variant = "hero",
}: {
  variant?: "hero" | "inline";
}) {
  const [email, setEmail] = useState("");
  const [state, setState] = useState<"idle" | "done">("idle");

  // Prototype: no backend. Captures locally so the interaction reads as real
  // in a walkthrough without implying a list exists.
  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.includes("@")) return;
    setState("done");
  };

  if (state === "done") {
    return (
      <div
        className={
          variant === "hero"
            ? "rounded-sm border border-[var(--site-navy)]/20 bg-[var(--site-paper)] px-6 py-5"
            : "rounded-sm border border-[var(--site-rule)] bg-[var(--site-paper)] px-5 py-4"
        }
      >
        <p className="font-serif text-lg text-[var(--site-navy)]">
          You&rsquo;re on the list.
        </p>
        <p className="mt-1 text-sm text-[var(--site-muted)]">
          Thursdays. One story, no filler.{" "}
          <span className="text-[var(--site-accent)]">
            Prototype — nothing was submitted.
          </span>
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={submit} className="w-full">
      <div className="flex flex-col gap-3 sm:flex-row">
        <label htmlFor={`nl-${variant}`} className="sr-only">
          Work email
        </label>
        <input
          id={`nl-${variant}`}
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="you@company.com"
          className="min-w-0 flex-1 rounded-sm border border-[var(--site-rule)] bg-[var(--site-paper)] px-4 py-3 text-[15px] text-[var(--site-ink)] placeholder:text-[var(--site-muted)]/60 focus:border-[var(--site-navy)] focus:outline-none"
        />
        <Button type="submit" size={variant === "hero" ? "lg" : "md"}>
          Subscribe
        </Button>
      </div>
      <p className="mt-3 text-[13px] text-[var(--site-muted)]">
        {variant === "hero"
          ? "One clear read a week on how outbound actually gets built. Join 14,200 operators."
          : "One email Thursdays. Unsubscribe anytime."}
      </p>
    </form>
  );
}
