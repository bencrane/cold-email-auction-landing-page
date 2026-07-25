import Link from "next/link";
import type { ReactNode } from "react";

/* ── Primitives ─────────────────────────────────────────────────────────── */

export function Button({
  children,
  href,
  variant = "primary",
  size = "md",
  type,
  onClick,
  className = "",
}: {
  children: ReactNode;
  href?: string;
  variant?: "primary" | "outline" | "quiet";
  size?: "md" | "lg";
  type?: "button" | "submit";
  onClick?: () => void;
  className?: string;
}) {
  const base =
    "inline-flex items-center justify-center gap-2 rounded-sm font-medium transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--site-accent)]";
  const sizes = {
    md: "px-5 py-2.5 text-[15px]",
    lg: "px-7 py-3.5 text-base",
  };
  const variants = {
    primary:
      "bg-[var(--site-navy)] text-[var(--site-cream)] hover:bg-[var(--site-navy-soft)]",
    outline:
      "border border-[var(--site-navy)] text-[var(--site-navy)] hover:bg-[var(--site-navy)] hover:text-[var(--site-cream)]",
    quiet:
      "border border-[var(--site-rule)] text-[var(--site-ink)] hover:border-[var(--site-navy)]",
  };
  const cls = `${base} ${sizes[size]} ${variants[variant]} ${className}`;

  if (href) {
    return (
      <Link href={href} className={cls}>
        {children}
      </Link>
    );
  }
  return (
    <button type={type ?? "button"} onClick={onClick} className={cls}>
      {children}
    </button>
  );
}

export function Eyebrow({ children }: { children: ReactNode }) {
  return (
    <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[var(--site-accent)]">
      {children}
    </p>
  );
}

export function SectionHeading({
  eyebrow,
  title,
  lede,
  action,
}: {
  eyebrow?: string;
  title: string;
  lede?: string;
  action?: ReactNode;
}) {
  return (
    <div className="flex flex-wrap items-end justify-between gap-6 border-b border-[var(--site-rule)] pb-6">
      <div className="max-w-2xl">
        {eyebrow && <Eyebrow>{eyebrow}</Eyebrow>}
        <h2 className="mt-3 font-serif text-3xl leading-tight text-[var(--site-navy)] md:text-4xl">
          {title}
        </h2>
        {lede && (
          <p className="mt-3 text-[17px] leading-relaxed text-[var(--site-muted)]">
            {lede}
          </p>
        )}
      </div>
      {action}
    </div>
  );
}

export function Tag({
  children,
  tone = "default",
}: {
  children: ReactNode;
  tone?: "default" | "accent" | "navy";
}) {
  const tones = {
    default:
      "border-[var(--site-rule)] bg-[var(--site-cream-deep)] text-[var(--site-muted)]",
    accent:
      "border-[var(--site-accent)]/40 bg-[var(--site-accent)]/10 text-[var(--site-accent)]",
    navy: "border-[var(--site-navy)]/25 bg-[var(--site-navy)]/[0.06] text-[var(--site-navy)]",
  };
  return (
    <span
      className={`inline-flex items-center rounded-sm border px-2 py-0.5 text-[11px] font-medium uppercase tracking-[0.12em] ${tones[tone]}`}
    >
      {children}
    </span>
  );
}

/* Placeholder-data marker. Every block of invented content on this prototype
   carries one, so a stakeholder review never mistakes it for live data. */
export function PlaceholderNote({ children }: { children: ReactNode }) {
  return (
    <p className="mt-4 border-l-2 border-[var(--site-rule)] pl-3 text-[12px] leading-relaxed text-[var(--site-muted)]">
      {children}
    </p>
  );
}
