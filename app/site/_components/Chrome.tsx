"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

const NAV = [
  { href: "/site", label: "Home" },
  { href: "/site/directory", label: "Directory" },
  { href: "/site/playbook", label: "Playbook" },
];

export function SiteNav() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  const isActive = (href: string) =>
    href === "/site" ? pathname === "/site" : pathname.startsWith(href);

  return (
    <header className="sticky top-0 z-40 border-b border-[var(--site-rule)] bg-[var(--site-cream)]/95 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        <Link href="/site" className="flex items-baseline gap-2">
          <span className="font-serif text-xl tracking-tight text-[var(--site-navy)]">
            ColdEmail
          </span>
          <span className="font-serif text-xl text-[var(--site-accent)]">
            .com
          </span>
        </Link>

        <nav className="hidden items-center gap-8 md:flex">
          {NAV.map((n) => (
            <Link
              key={n.href}
              href={n.href}
              className={`text-[15px] transition-colors ${
                isActive(n.href)
                  ? "text-[var(--site-navy)] underline decoration-[var(--site-accent)] decoration-2 underline-offset-8"
                  : "text-[var(--site-muted)] hover:text-[var(--site-navy)]"
              }`}
            >
              {n.label}
            </Link>
          ))}
          <Link
            href="/site#newsletter"
            className="rounded-sm bg-[var(--site-navy)] px-4 py-2 text-[14px] font-medium text-[var(--site-cream)] transition-colors hover:bg-[var(--site-navy-soft)]"
          >
            Subscribe
          </Link>
        </nav>

        <button
          onClick={() => setOpen((v) => !v)}
          aria-expanded={open}
          aria-label="Menu"
          className="flex h-9 w-9 items-center justify-center rounded-sm border border-[var(--site-rule)] md:hidden"
        >
          <span className="space-y-1">
            <span className="block h-px w-4 bg-[var(--site-navy)]" />
            <span className="block h-px w-4 bg-[var(--site-navy)]" />
            <span className="block h-px w-4 bg-[var(--site-navy)]" />
          </span>
        </button>
      </div>

      {open && (
        <nav className="border-t border-[var(--site-rule)] px-6 py-3 md:hidden">
          {NAV.map((n) => (
            <Link
              key={n.href}
              href={n.href}
              onClick={() => setOpen(false)}
              className="block py-2.5 text-[15px] text-[var(--site-navy)]"
            >
              {n.label}
            </Link>
          ))}
        </nav>
      )}
    </header>
  );
}

export function SiteFooter() {
  return (
    <footer className="mt-24 border-t border-[var(--site-rule)] bg-[var(--site-cream-deep)]">
      <div className="mx-auto grid max-w-6xl gap-10 px-6 py-14 sm:grid-cols-2 md:grid-cols-4">
        <div className="sm:col-span-2">
          <p className="font-serif text-lg text-[var(--site-navy)]">
            ColdEmail<span className="text-[var(--site-accent)]">.com</span>
          </p>
          <p className="mt-3 max-w-sm text-[14px] leading-relaxed text-[var(--site-muted)]">
            An independent publication about how outbound email really works —
            the tools, the people building them, and the decisions behind them.
          </p>
        </div>
        {[
          { h: "Sections", items: ["Directory", "Playbook", "Interviews"] },
          { h: "About", items: ["Editorial standard", "Partners", "Contact"] },
        ].map((col) => (
          <div key={col.h}>
            <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[var(--site-navy)]">
              {col.h}
            </p>
            <ul className="mt-4 space-y-2.5">
              {col.items.map((i) => (
                <li
                  key={i}
                  className="text-[14px] text-[var(--site-muted)] hover:text-[var(--site-navy)]"
                >
                  {i}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      <div className="border-t border-[var(--site-rule)]">
        <p className="mx-auto max-w-6xl px-6 py-5 text-[13px] text-[var(--site-muted)]">
          Prototype — all content on this site is placeholder for review.
        </p>
      </div>
    </footer>
  );
}
