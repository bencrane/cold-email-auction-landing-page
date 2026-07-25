import type { Metadata } from "next";
import { DirectoryBrowser } from "./DirectoryBrowser";
import { Eyebrow } from "../_components/ui";

export const metadata: Metadata = {
  title: "Directory — ColdEmail.com",
  description: "The tools teams actually run, sorted by what they do.",
};

export default function DirectoryPage() {
  return (
    <main>
      <section className="border-b border-[var(--site-rule)]">
        <div className="mx-auto max-w-6xl px-6 py-16 md:py-20">
          <Eyebrow>Directory</Eyebrow>
          <h1 className="mt-4 max-w-3xl font-serif text-4xl leading-tight text-[var(--site-navy)] md:text-5xl">
            The tools teams actually run.
          </h1>
          <p className="mt-5 max-w-2xl text-lg leading-relaxed text-[var(--site-muted)]">
            Sorted by what they do, not by who paid to be here. Where we&rsquo;ve
            written a full piece on something, it&rsquo;s marked — the rest are on
            the list.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6 py-14">
        <DirectoryBrowser />
      </section>
    </main>
  );
}
