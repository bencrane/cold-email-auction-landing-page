"use client";

import { useState } from "react";
import { CATEGORIES, TOOLS } from "../_components/data";
import { Tag } from "../_components/ui";

const COVERAGE_TONE = {
  Published: "accent",
  "In progress": "navy",
  Queued: "default",
} as const;

export function DirectoryBrowser() {
  const [active, setActive] = useState<string>("All");

  const shown =
    active === "All" ? TOOLS : TOOLS.filter((t) => t.category === active);

  return (
    <div>
      {/* Filters */}
      <div className="flex flex-wrap gap-2">
        {["All", ...CATEGORIES].map((c) => (
          <button
            key={c}
            onClick={() => setActive(c)}
            className={`rounded-sm border px-3.5 py-1.5 text-[14px] transition-colors ${
              active === c
                ? "border-[var(--site-navy)] bg-[var(--site-navy)] text-[var(--site-cream)]"
                : "border-[var(--site-rule)] text-[var(--site-muted)] hover:border-[var(--site-navy)] hover:text-[var(--site-navy)]"
            }`}
          >
            {c}
          </button>
        ))}
      </div>

      {/* Table on desktop */}
      <div className="mt-8 hidden overflow-hidden rounded-sm border border-[var(--site-rule)] md:block">
        <table className="w-full border-collapse text-left">
          <thead>
            <tr className="bg-[var(--site-cream-deep)]">
              {["Tool", "Category", "What it does", "Our coverage"].map((h) => (
                <th
                  key={h}
                  scope="col"
                  className="border-b border-[var(--site-rule)] px-5 py-3 text-[11px] font-semibold uppercase tracking-[0.14em] text-[var(--site-navy)]"
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {shown.map((t) => (
              <tr
                key={t.name}
                className="border-b border-[var(--site-rule-soft)] bg-[var(--site-paper)] last:border-0 hover:bg-[var(--site-cream-deep)]/50"
              >
                <td className="px-5 py-4 font-serif text-[17px] text-[var(--site-navy)]">
                  {t.name}
                </td>
                <td className="px-5 py-4 text-[14px] text-[var(--site-muted)]">
                  {t.category}
                </td>
                <td className="px-5 py-4 text-[15px] text-[var(--site-ink)]">
                  {t.note}
                </td>
                <td className="px-5 py-4">
                  <Tag tone={COVERAGE_TONE[t.coverage]}>{t.coverage}</Tag>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Cards on mobile */}
      <div className="mt-6 grid gap-4 md:hidden">
        {shown.map((t) => (
          <div
            key={t.name}
            className="rounded-sm border border-[var(--site-rule)] bg-[var(--site-paper)] p-5"
          >
            <div className="flex items-start justify-between gap-3">
              <h3 className="font-serif text-lg text-[var(--site-navy)]">
                {t.name}
              </h3>
              <Tag tone={COVERAGE_TONE[t.coverage]}>{t.coverage}</Tag>
            </div>
            <p className="mt-1 text-[13px] text-[var(--site-muted)]">
              {t.category}
            </p>
            <p className="mt-3 text-[15px] leading-relaxed text-[var(--site-ink)]">
              {t.note}
            </p>
          </div>
        ))}
      </div>

      <p className="mt-6 text-[13px] text-[var(--site-muted)]">
        Showing {shown.length} of {TOOLS.length}.
      </p>
    </div>
  );
}
