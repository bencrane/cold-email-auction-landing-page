import type { Metadata } from "next";
import { NewsletterForm } from "../_components/NewsletterForm";
import { ARTICLES } from "../_components/data";
import { Motif, familyForSection } from "../_components/Motif";
import { Eyebrow, Tag } from "../_components/ui";

export const metadata: Metadata = {
  title: "Playbook — ColdEmail.com",
  description: "Long reads on how outbound gets built and run.",
};

export default function PlaybookPage() {
  const [lead, ...rest] = ARTICLES;

  return (
    <main>
      <section className="border-b border-[var(--site-rule)]">
        <div className="mx-auto max-w-6xl px-6 py-16 md:py-20">
          <Eyebrow>Playbook</Eyebrow>
          <h1 className="mt-4 max-w-3xl font-serif text-4xl leading-tight text-[var(--site-navy)] md:text-5xl">
            Long reads on how this gets built.
          </h1>
          <p className="mt-5 max-w-2xl text-lg leading-relaxed text-[var(--site-muted)]">
            One subject at a time, taken properly apart. Written so you can hand
            it to someone on your team and have them come away knowing what to
            do.
          </p>
        </div>
      </section>

      {/* Lead story */}
      <section className="mx-auto max-w-6xl px-6 py-14">
        <article className="grid gap-8 md:grid-cols-[1fr_1.1fr] md:items-center">
          <Motif
            seed={lead.title}
            family={familyForSection(lead.section)}
            className="aspect-[16/11] rounded-sm"
          >
            <div className="flex h-full items-end p-7">
              <Tag tone="accent">{lead.section}</Tag>
            </div>
          </Motif>
          <div>
            <p className="text-[13px] uppercase tracking-[0.14em] text-[var(--site-accent)]">
              Latest
            </p>
            <h2 className="mt-3 font-serif text-3xl leading-tight text-[var(--site-navy)] md:text-4xl">
              {lead.title}
            </h2>
            <p className="mt-4 text-[17px] leading-relaxed text-[var(--site-muted)]">
              {lead.dek}
            </p>
            <p className="mt-5 text-[13px] text-[var(--site-muted)]">
              {lead.date} · {lead.readTime} read
            </p>
          </div>
        </article>
      </section>

      {/* Index */}
      <section className="mx-auto max-w-6xl px-6 pb-6">
        <div className="border-t border-[var(--site-rule)]">
          {rest.map((a) => (
            <article
              key={a.title}
              className="grid gap-4 border-b border-[var(--site-rule-soft)] py-8 md:grid-cols-[160px_1fr_auto] md:items-baseline"
            >
              <div className="flex items-center gap-3">
                <Tag>{a.section}</Tag>
              </div>
              <div>
                <h3 className="font-serif text-2xl leading-snug text-[var(--site-navy)]">
                  {a.title}
                </h3>
                <p className="mt-2 max-w-2xl text-[16px] leading-relaxed text-[var(--site-muted)]">
                  {a.dek}
                </p>
              </div>
              <p className="whitespace-nowrap text-[13px] text-[var(--site-muted)]">
                {a.date} · {a.readTime}
              </p>
            </article>
          ))}
        </div>

        <p className="mt-8 border-l-2 border-[var(--site-rule)] pl-3 text-[12px] leading-relaxed text-[var(--site-muted)]">
          Placeholder — article titles and summaries are invented for this
          prototype. None of these pieces are written.
        </p>
      </section>

      {/* Subscribe */}
      <section className="mx-auto max-w-6xl px-6 py-16">
        <div className="rounded-sm border border-[var(--site-navy)]/15 bg-[var(--site-paper)] p-8 md:p-10">
          <div className="grid gap-8 md:grid-cols-[1fr_1fr] md:items-center">
            <div>
              <h2 className="font-serif text-2xl leading-snug text-[var(--site-navy)]">
                Get the next one in your inbox.
              </h2>
              <p className="mt-3 text-[15px] leading-relaxed text-[var(--site-muted)]">
                Thursdays. One piece, nothing else.
              </p>
            </div>
            <NewsletterForm variant="inline" />
          </div>
        </div>
      </section>
    </main>
  );
}
