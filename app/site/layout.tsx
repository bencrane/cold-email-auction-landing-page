import type { Metadata } from "next";

// Scoped layout so /site can diverge from the landing page and /demo without
// touching either. Tailwind and the font variables still come from the root
// layout; everything visual below this point is fair game.
export const metadata: Metadata = {
  title: "ColdEmail.com — Prototype",
  description: "Work in progress.",
  robots: { index: false, follow: false },
};

export default function SiteLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return <div className="min-h-dvh bg-white text-zinc-900">{children}</div>;
}
