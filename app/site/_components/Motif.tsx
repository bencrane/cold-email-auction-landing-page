/* ── Motif system ──────────────────────────────────────────────────────────
   Abstract artwork for article and video imagery, generated from a seed string
   rather than shipped as files.

   Why generated: a publication produces images faster than anyone art-directs
   them. This gives every piece a distinct image that is always on-palette,
   scales to any size, costs no bytes and needs no pipeline.

   Why seeded and not random: Math.random() would render differently on the
   server and the client and blow up hydration. A string hash means the same
   title always yields the same artwork, forever.

   Five families, mapped to editorial sections so the section is legible at a
   glance before you read the label.
   ────────────────────────────────────────────────────────────────────────── */

export type MotifFamily = "grid" | "stack" | "arc" | "field" | "signal";

const SECTION_FAMILY: Record<string, MotifFamily> = {
  Architecture: "grid",
  Economics: "stack",
  Fundamentals: "arc",
  Data: "field",
  Strategy: "signal",
};

export function familyForSection(section: string): MotifFamily {
  return SECTION_FAMILY[section] ?? "grid";
}

/* FNV-1a → mulberry32. Deterministic, tiny, good enough for layout jitter. */
function seeded(seed: string) {
  let h = 2166136261;
  for (let i = 0; i < seed.length; i++) {
    h ^= seed.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  let a = h >>> 0;
  return () => {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const W = 400;
const H = 260;

type Tone = { ink: string; accent: string; wash: string };

/* Two-tone by default; the accent earns its place by being scarce. */
const TONE: Tone = {
  ink: "#ffffff",
  accent: "#d8a24a",
  wash: "#ffffff",
};

function Grid({ r }: { r: () => number }) {
  const cols = 6;
  const rows = 4;
  const cell = W / cols;
  const out = [];
  for (let x = 0; x < cols; x++) {
    for (let y = 0; y < rows; y++) {
      const v = r();
      if (v < 0.34) continue;
      const inset = 6 + r() * 10;
      const filled = v > 0.82;
      out.push(
        <rect
          key={`${x}-${y}`}
          x={x * cell + inset}
          y={y * (H / rows) + inset}
          width={cell - inset * 2}
          height={H / rows - inset * 2}
          fill={filled ? TONE.accent : "none"}
          stroke={filled ? "none" : TONE.ink}
          strokeWidth={1}
          opacity={filled ? 0.85 : 0.28 + v * 0.3}
        />
      );
    }
  }
  return <>{out}</>;
}

function Stack({ r }: { r: () => number }) {
  const bars = 7;
  const gap = 6;
  const bh = (H - gap * (bars - 1) - 60) / bars;
  return (
    <>
      {Array.from({ length: bars }, (_, i) => {
        const v = r();
        const w = 60 + v * (W - 140);
        return (
          <rect
            key={i}
            x={40}
            y={30 + i * (bh + gap)}
            width={w}
            height={bh}
            fill={i === Math.floor(bars / 2) ? TONE.accent : TONE.ink}
            opacity={i === Math.floor(bars / 2) ? 0.9 : 0.16 + v * 0.24}
          />
        );
      })}
    </>
  );
}

function Arc({ r }: { r: () => number }) {
  const cx = W * (0.3 + r() * 0.4);
  const cy = H + 20;
  return (
    <>
      {Array.from({ length: 9 }, (_, i) => {
        const rad = 30 + i * 26;
        return (
          <circle
            key={i}
            cx={cx}
            cy={cy}
            r={rad}
            fill="none"
            stroke={i === 3 ? TONE.accent : TONE.ink}
            strokeWidth={i === 3 ? 2 : 1}
            opacity={i === 3 ? 0.85 : 0.3 - i * 0.018}
          />
        );
      })}
    </>
  );
}

function Field({ r }: { r: () => number }) {
  const cols = 14;
  const rows = 9;
  const out = [];
  for (let x = 0; x < cols; x++) {
    for (let y = 0; y < rows; y++) {
      const v = r();
      const rad = 1 + v * 3.4;
      const hot = v > 0.93;
      out.push(
        <circle
          key={`${x}-${y}`}
          cx={26 + x * ((W - 52) / (cols - 1))}
          cy={24 + y * ((H - 48) / (rows - 1))}
          r={hot ? rad + 1.4 : rad}
          fill={hot ? TONE.accent : TONE.ink}
          opacity={hot ? 0.9 : 0.14 + v * 0.4}
        />
      );
    }
  }
  return <>{out}</>;
}

function Signal({ r }: { r: () => number }) {
  const lines = 5;
  const pts = 9;
  return (
    <>
      {Array.from({ length: lines }, (_, i) => {
        const base = 40 + i * ((H - 80) / (lines - 1));
        const d = Array.from({ length: pts }, (_, p) => {
          const x = 24 + p * ((W - 48) / (pts - 1));
          const drift = (r() - 0.5) * 34 * (p / pts);
          return `${p === 0 ? "M" : "L"} ${x.toFixed(1)} ${(base + drift).toFixed(1)}`;
        }).join(" ");
        return (
          <path
            key={i}
            d={d}
            fill="none"
            stroke={i === 2 ? TONE.accent : TONE.ink}
            strokeWidth={i === 2 ? 2 : 1}
            opacity={i === 2 ? 0.85 : 0.26}
          />
        );
      })}
    </>
  );
}

const FAMILIES = { grid: Grid, stack: Stack, arc: Arc, field: Field, signal: Signal };

export function Motif({
  seed,
  family = "grid",
  className = "",
  children,
}: {
  seed: string;
  family?: MotifFamily;
  className?: string;
  /* Overlay content — a tag, a play button — composited above the artwork. */
  children?: React.ReactNode;
}) {
  const r = seeded(seed);
  const Shape = FAMILIES[family];
  /* Seeded angle so the wash differs per piece without breaking the palette. */
  const angle = 120 + Math.floor(r() * 60);

  return (
    <div className={`relative overflow-hidden ${className}`}>
      <div
        className="absolute inset-0"
        style={{
          background: `linear-gradient(${angle}deg, var(--site-navy-soft) 0%, var(--site-navy) 100%)`,
        }}
      />
      <svg
        viewBox={`0 0 ${W} ${H}`}
        preserveAspectRatio="xMidYMid slice"
        aria-hidden="true"
        className="absolute inset-0 h-full w-full"
      >
        <Shape r={r} />
      </svg>
      {children && <div className="relative h-full w-full">{children}</div>}
    </div>
  );
}
