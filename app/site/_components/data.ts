import type { Video } from "./VideoCard";

/* ──────────────────────────────────────────────────────────────────────────
   All content below is placeholder for a prototype review.

   Company names are real products in this category. Interviews are invented,
   so no individual is named and nothing is quoted — attributing a fabricated
   conversation to a real, identifiable founder is not something a placeholder
   should do. Swap in real names and quotes once the interviews exist.
   ────────────────────────────────────────────────────────────────────────── */

export const VIDEOS: Video[] = [
  {
    company: "Smartlead",
    role: "Founder interview",
    title: "Why sending got harder, and what changed",
    runtime: "42 min",
    topic:
      "How inbox providers tightened up over the last two years, and what teams had to rebuild in response.",
    family: "signal",
  },
  {
    company: "Instantly",
    role: "Founder interview",
    title: "Scaling from one inbox to a thousand",
    runtime: "38 min",
    topic:
      "What breaks when volume grows, and the unglamorous work of keeping a large sending setup healthy.",
    family: "grid",
  },
  {
    company: "Prospeo",
    role: "Founder interview",
    title: "Where contact data actually comes from",
    runtime: "31 min",
    topic:
      "A plain walk through how B2B contact data is sourced and verified — and why quality varies so much.",
    family: "field",
  },
  {
    company: "Clay",
    role: "Founder interview",
    title: "Research before outreach",
    runtime: "47 min",
    topic:
      "Doing the homework at scale: what teams look up before they write, and how that changes reply rates.",
    family: "arc",
  },
];

export type Tool = {
  name: string;
  category: string;
  note: string;
  coverage: "Published" | "In progress" | "Queued";
};

/* Compliance: email and data infrastructure only. No voice, dialer or
   automated-calling categories — deliberately out of scope. */
export const CATEGORIES = [
  "Inbox Management",
  "Deliverability",
  "Lead Data",
  "Verification",
  "Sequencing",
  "Enrichment",
] as const;

export const TOOLS: Tool[] = [
  {
    name: "Smartlead",
    category: "Inbox Management",
    note: "Rotates sending across many inboxes from one place.",
    coverage: "Published",
  },
  {
    name: "Instantly",
    category: "Inbox Management",
    note: "Inbox pooling with warmup built in.",
    coverage: "Published",
  },
  {
    name: "Mailreach",
    category: "Deliverability",
    note: "Warms domains and reports on inbox placement.",
    coverage: "In progress",
  },
  {
    name: "GlockApps",
    category: "Deliverability",
    note: "Seed testing — shows where mail actually lands.",
    coverage: "Queued",
  },
  {
    name: "Clay",
    category: "Enrichment",
    note: "Pulls from many sources and fills the gaps automatically.",
    coverage: "Published",
  },
  {
    name: "Apollo",
    category: "Lead Data",
    note: "Large contact database with filtering and export.",
    coverage: "In progress",
  },
  {
    name: "Prospeo",
    category: "Lead Data",
    note: "Email lookup with verification on the way out.",
    coverage: "Published",
  },
  {
    name: "Ocean.io",
    category: "Lead Data",
    note: "Finds companies that look like your best customers.",
    coverage: "Queued",
  },
  {
    name: "MillionVerifier",
    category: "Verification",
    note: "Bulk list cleaning before you send.",
    coverage: "Published",
  },
  {
    name: "NeverBounce",
    category: "Verification",
    note: "Checks addresses one at a time or in bulk.",
    coverage: "Queued",
  },
  {
    name: "Lemlist",
    category: "Sequencing",
    note: "Multi-step campaigns with personalised media.",
    coverage: "In progress",
  },
  {
    name: "HeyReach",
    category: "Sequencing",
    note: "Sequencing built around LinkedIn alongside email.",
    coverage: "Queued",
  },
];

export type Article = {
  title: string;
  dek: string;
  section: string;
  readTime: string;
  date: string;
  featured?: boolean;
};

export const ARTICLES: Article[] = [
  {
    title: "Decoupling Deliverability: The Multi-Inbox Architecture",
    dek: "Why serious teams stopped sending everything from one domain, and how the split actually works in practice.",
    section: "Architecture",
    readTime: "14 min",
    date: "Jul 18, 2026",
    featured: true,
  },
  {
    title: "The Capital Mechanics of B2B Lead Arbitrage",
    dek: "What a lead really costs once you count data, tooling and the people running it — and where the margin hides.",
    section: "Economics",
    readTime: "11 min",
    date: "Jul 11, 2026",
  },
  {
    title: "Configuring SPF/DKIM/DMARC at Enterprise Scale",
    dek: "The three records every sender needs, explained once, properly — plus what changes across hundreds of domains.",
    section: "Fundamentals",
    readTime: "18 min",
    date: "Jul 4, 2026",
  },
  {
    title: "What Inbox Providers Actually Measure",
    dek: "Engagement, complaints, authentication. A plain-language tour of the signals that decide where mail lands.",
    section: "Fundamentals",
    readTime: "9 min",
    date: "Jun 27, 2026",
  },
  {
    title: "Buying Contact Data Without Getting Burned",
    dek: "How to test a provider before you commit, and the questions that separate good data from expensive noise.",
    section: "Data",
    readTime: "12 min",
    date: "Jun 20, 2026",
  },
  {
    title: "The Case Against Sending More",
    dek: "Volume is the easiest lever to pull and the fastest way to wreck a domain. What to do instead.",
    section: "Strategy",
    readTime: "8 min",
    date: "Jun 13, 2026",
  },
];
