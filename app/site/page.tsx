import Link from "next/link";
import { NewsletterForm } from "./_components/NewsletterForm";
import { PartnerFunnel } from "./_components/PartnerFunnel";
import { VideoCard } from "./_components/VideoCard";
import { ARTICLES, VIDEOS } from "./_components/data";
import { Motif, familyForSection } from "./_components/Motif";
import { Button, Eyebrow, SectionHeading, Tag } from "./_components/ui";

export default function SiteHome() {
  const [lead, ...rest] = ARTICLES;

  return (
    <main>
      {/* ── Hero ─────────────────────────────────────────────────────────── */}
      <section className="border-b border-[var(--site-rule)]">
        <div className="mx-auto grid max-w-6xl gap-14 px-6 py-20 md:grid-cols-[1.1fr_0.9fr] md:py-28">
          <div>
            <Eyebrow>Independent · Since 2026</Eyebrow>
            <h1 className="mt-5 font-serif text-5xl leading-[1.05] tracking-tight text-[var(--site-navy)] md:text-6xl">
              The Infrastructure of Outbound.
            </h1>
            <p className="mt-6 max-w-xl text-xl leading-relaxed text-[var(--site-muted)]">
              How cold email actually works — the tools, the people building
              them, and the decisions behind them. Written for the people doing
              the work, not the people selling to them.
            </p>
            <div className="mt-9 flex flex-wrap gap-3">
              <Button href="/site/playbook" size="lg">
                Start reading
              </Button>
              <Button href="/site/directory" size="lg" variant="outline">
                Browse the directory
              </Button>
            </div>
          </div>

          <div
            id="newsletter"
            className="self-center rounded-sm border border-[var(--site-navy)]/15 bg-[var(--site-paper)] p-8 shadow-[0_1px_0_var(--site-rule)]"
          >
            <p className="font-serif text-2xl leading-snug text-[var(--site-navy)]">
              One email a week. Worth opening.
            </p>
            <p className="mt-3 text-[15px] leading-relaxed text-[var(--site-muted)]">
              What changed in outbound this week, what it means, and what to do
              about it. No roundups, no recycled advice.
            </p>
            <div className="mt-6">
              <NewsletterForm />
            </div>
          </div>
        </div>
      </section>

      {/* ── Featured reading ─────────────────────────────────────────────── */}
      <section className="mx-auto max-w-6xl px-6 py-20">
        <SectionHeading
          eyebrow="This week"
          title="What we’re reading into"
          action={
            <Link
              href="/site/playbook"
              className="text-[15px] text-[var(--site-navy)] underline decoration-[var(--site-accent)] underline-offset-4"
            >
              All articles →
            </Link>
          }
        />

        <div className="mt-10 grid gap-10 lg:grid-cols-[1.15fr_1fr]">
          <article>
            <Motif
              seed={lead.title}
              family={familyForSection(lead.section)}
              className="aspect-[16/10] rounded-sm"
            >
              <div className="flex h-full items-end p-7">
                <Tag tone="accent">{lead.section}</Tag>
              </div>
            </Motif>
            <h3 className="mt-6 font-serif text-3xl leading-tight text-[var(--site-navy)]">
              {lead.title}
            </h3>
            <p className="mt-3 text-[17px] leading-relaxed text-[var(--site-muted)]">
              {lead.dek}
            </p>
            <p className="mt-4 text-[13px] text-[var(--site-muted)]">
              {lead.date} · {lead.readTime} read
            </p>
          </article>

          <div className="divide-y divide-[var(--site-rule)]">
            {rest.slice(0, 4).map((a) => (
              <article key={a.title} className="py-6 first:pt-0">
                <div className="flex items-center gap-3">
                  <Tag>{a.section}</Tag>
                  <span className="text-[13px] text-[var(--site-muted)]">
                    {a.readTime} read
                  </span>
                </div>
                <h3 className="mt-2.5 font-serif text-xl leading-snug text-[var(--site-navy)]">
                  {a.title}
                </h3>
                <p className="mt-2 text-[15px] leading-relaxed text-[var(--site-muted)]">
                  {a.dek}
                </p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* ── In the Trenches ──────────────────────────────────────────────── */}
      <section className="border-y border-[var(--site-rule)] bg-[var(--site-cream-deep)]">
        <div className="mx-auto max-w-6xl px-6 py-20">
          <SectionHeading
            eyebrow="In the Trenches"
            title="Conversations with the people building this"
            lede="Long-form interviews with the founders behind the tools most teams run on. Unhurried, and more useful than a changelog."
          />
          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {VIDEOS.map((v) => (
              <VideoCard key={v.company} video={v} />
            ))}
          </div>
          <p className="mt-8 border-l-2 border-[var(--site-rule)] pl-3 text-[12px] leading-relaxed text-[var(--site-muted)]">
            Placeholder — these interviews don’t exist yet. Company names are
            real; no individual is named or quoted until the conversations are
            actually recorded.
          </p>
        </div>
      </section>

      {/* ── Partner funnel ───────────────────────────────────────────────── */}
      <section className="mx-auto max-w-6xl px-6 py-20">
        <PartnerFunnel />
      </section>
    </main>
  );
}
