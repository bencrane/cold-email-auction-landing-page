import type { Metadata } from "next";
import { Motif, type MotifFamily } from "../_components/Motif";
import { ARTICLES, VIDEOS } from "../_components/data";
import { Eyebrow, Tag } from "../_components/ui";

export const metadata: Metadata = {
  title: "Motifs — ColdEmail.com",
  description: "Specimen sheet for the generated artwork system.",
  robots: { index: false, follow: false },
};

const FAMILIES: { family: MotifFamily; section: string; note: string }[] = [
  { family: "grid", section: "Architecture", note: "Offset rectangles — structure, systems, how things are arranged." },
  { family: "stack", section: "Economics", note: "Stacked bars — cost, margin, anything that adds up." },
  { family: "arc", section: "Fundamentals", note: "Concentric arcs — reach, propagation, first principles." },
  { family: "field", section: "Data", note: "Dot matrix — records, coverage, density." },
  { family: "signal", section: "Strategy", note: "Drifting lines — trend, drift, decisions over time." },
];

/* Four arbitrary seeds per family, to show the spread within one form. */
const SEEDS = ["alpha one", "beta two", "gamma three", "delta four"];

export default function MotifsPage() {
  return (
    <main className="mx-auto max-w-6xl px-6 py-16">
      <Eyebrow>Design system</Eyebrow>
      <h1 className="mt-4 max-w-3xl font-serif text-4xl leading-tight text-[var(--site-navy)] md:text-5xl">
        Motifs
      </h1>
      <p className="mt-5 max-w-2xl text-lg leading-relaxed text-[var(--site-muted)]">
        Every image on the site is generated from a seed string rather than
        stored as a file. The same seed always produces the same artwork, so a
        given article keeps its image permanently — but no two pieces share one.
      </p>

      {/* Families */}
      {FAMILIES.map((f) => (
        <section key={f.family} className="mt-16">
          <div className="flex flex-wrap items-baseline justify-between gap-4 border-b border-[var(--site-rule)] pb-4">
            <div>
              <h2 className="font-serif text-2xl text-[var(--site-navy)]">
                {f.family}
              </h2>
              <p className="mt-1 text-[15px] text-[var(--site-muted)]">
                {f.note}
              </p>
            </div>
            <Tag tone="navy">{f.section}</Tag>
          </div>
          <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {SEEDS.map((s) => (
              <div key={s}>
                <Motif
                  seed={`${f.family}-${s}`}
                  family={f.family}
                  className="aspect-[4/3] rounded-sm"
                />
                <p className="mt-2 font-mono text-[11px] text-[var(--site-muted)]">
                  seed: {f.family}-{s}
                </p>
              </div>
            ))}
          </div>
        </section>
      ))}

      {/* Live usage */}
      <section className="mt-20 border-t border-[var(--site-rule)] pt-12">
        <h2 className="font-serif text-2xl text-[var(--site-navy)]">
          In use
        </h2>
        <p className="mt-2 max-w-2xl text-[15px] text-[var(--site-muted)]">
          The real seeds currently on the site — article titles and interview
          titles, each resolved to its section&rsquo;s family.
        </p>
        <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {[
            ...ARTICLES.map((a) => ({
              seed: a.title,
              family: FAMILIES.find((f) => f.section === a.section)?.family ?? "grid",
              label: a.title,
            })),
            ...VIDEOS.map((v) => ({
              seed: v.title,
              family: v.family,
              label: `${v.company} — ${v.title}`,
            })),
          ].map((item) => (
            <div key={item.label}>
              <Motif
                seed={item.seed}
                family={item.family as MotifFamily}
                className="aspect-[16/10] rounded-sm"
              />
              <p className="mt-2 text-[13px] leading-snug text-[var(--site-muted)]">
                {item.label}
              </p>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
