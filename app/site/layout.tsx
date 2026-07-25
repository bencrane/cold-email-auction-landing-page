import type { Metadata } from "next";
import { Source_Serif_4 } from "next/font/google";
import { SiteFooter, SiteNav } from "./_components/Chrome";

// Editorial serif for headings; body copy inherits Inter from the root layout.
const serif = Source_Serif_4({
  variable: "--font-site-serif",
  subsets: ["latin"],
  display: "swap",
});

// Scoped layout so /site can diverge from the landing page and /demo without
// touching either. The cream/navy palette lives on .site-theme in globals.css.
export const metadata: Metadata = {
  title: "ColdEmail.com — How outbound actually works",
  description:
    "An independent publication about outbound email: the tools, the people building them, and the decisions behind them.",
  robots: { index: false, follow: false },
};

export default function SiteLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <div
      // The global base layer pins html/body (fixed, overflow hidden) for the
      // landing page, so /site scrolls inside its own container — the same
      // pattern /demo uses rather than fighting that rule globally.
      className={`site-theme ${serif.variable} h-dvh overflow-y-auto bg-[var(--site-cream)] text-[var(--site-ink)] [&_.font-serif]:font-[family-name:var(--font-site-serif)]`}
    >
      <SiteNav />
      {children}
      <SiteFooter />
    </div>
  );
}
