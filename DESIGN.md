# DESIGN.md — /demo (Exit Scenario Comparison)

Purpose: a financial memo narrated over Loom. Not a dashboard, not a marketing
page. Every design decision serves one goal: the viewer feels the numbers.

## Principles

1. **Controls whisper, outcomes shout.** Sliders, labels, tick marks, and
   endpoints are quiet furniture (zinc-500/600, 11–13px). The headline figure
   of each section is the loudest element on screen (mono, 48–64px,
   zinc-100 or emerald-400). Nothing within a section competes with it.
2. **One number per moment.** Each section has exactly one headline figure.
   A companion figure (a multiple, a delta) is either a deliberate peer —
   sized within one step of the headline — or a footnote. Never a tiny
   orphan under a huge number.
3. **Never encode the same fact twice.** The readout is the value; the track
   does not repeat it as endpoint labels. A derived figure (multiple) appears
   once, in one place.
4. **Air is hierarchy.** Cards that carry a headline figure use generous
   vertical padding (p-8 to p-10). Sections separated by mt-12 to mt-16.
   Cramped reads as cheap.
5. **No marketing copy.** Labels and numbers only. Register: neutral,
   institutional. No narrative subtitles, no persuasion adjectives.

## Tokens

- Background: zinc-950. Panels/cards: zinc-900/40 with border-zinc-800.
- Text: zinc-100 primary, zinc-400 secondary, zinc-500 labels
  (uppercase, tracking-wider, 13px), zinc-600 footnotes (mono, 11px).
- Figures: Geist Mono, tabular-nums, semibold. Words: Inter.
- Emerald-400/500 exclusively for Scenario B advantage (delta, net B).
- Red-400/90 exclusively for tax/cost line items.
- Radius: rounded-xl cards, rounded-lg inner boxes. Borders 1px.

## Components

- **Section**: h2 label outside the card (13px uppercase zinc-500), card(s)
  under it, mt-12+ between sections, optional 1px zinc-800 divider between
  major acts.
- **Ledger row**: 13px label left, mono 14px value right, zinc-800/60
  hairline separators. Negatives in red, muted rows in zinc-500.
- **Headline figure**: mono 48–64px, spring-animated on change
  (stiffness 120, damping 24).
- **Slider**: Radix, 3px track, zinc-800 rail / zinc-100 range / white thumb.
  No endpoint labels when a readout exists. Snap targets (tick labels) are
  clickable and quiet (11px mono zinc-600, hover zinc-300).

## Motion

- Entry: fade+rise 0.3–0.6s, ease-out. Value changes: spring.
- Animate transform/opacity only. Everything else is instant.
