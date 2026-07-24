"use client";

import { useState, useEffect } from "react";
import {
  motion,
  AnimatePresence,
  useSpring,
  useTransform,
  MotionValue,
} from "framer-motion";
import { PieChart, Pie, Cell } from "recharts";
import { Slider } from "@/components/ui/slider";
import { Building2, Globe, Scale, TrendingUp } from "lucide-react";

const TAX_RATE = 0.238; // Federal LTCG 20% + NIIT 3.8%
const DOMAIN_BASIS = 1_000_000;
const ARR = 13_200_000;

// New scenario: the deal splits into two allocations taxed at different rates.
const DOMAIN_GAINS_RATE = 0.2; // DomainCo exit allocation — long-term capital gains
const ORDINARY_RATE = 0.37; // OperatingGroup exit allocation + all distributions

function fmtM(v: number, decimals = 1) {
  return `$${(v / 1_000_000).toFixed(decimals)}M`;
}

function fmtDollars(v: number) {
  return `$${Math.round(v).toLocaleString("en-US")}`;
}

function AnimatedM({
  value,
  className,
  prefix = "",
  decimals = 1,
}: {
  value: number;
  className?: string;
  prefix?: string;
  decimals?: number;
}) {
  const spring = useSpring(value, { stiffness: 120, damping: 24 });
  spring.set(value);
  const text = useTransform(
    spring as MotionValue<number>,
    (v) => `${prefix}$${(v / 1_000_000).toFixed(decimals)}M`
  );
  return <motion.span className={className}>{text}</motion.span>;
}

function LedgerRow({
  label,
  value,
  negative = false,
  muted = false,
}: {
  label: string;
  value: string;
  negative?: boolean;
  muted?: boolean;
}) {
  return (
    <div className="flex items-baseline justify-between py-6 border-b border-zinc-800/60">
      <span
        className={`text-2xl tracking-wide ${
          muted ? "text-zinc-500" : "text-zinc-300"
        }`}
      >
        {label}
      </span>
      <span
        className={`font-mono text-3xl tabular-nums ${
          negative ? "text-red-400/90" : "text-zinc-100"
        }`}
      >
        {value}
      </span>
    </div>
  );
}

function SliderBlock({
  label,
  display,
  min,
  max,
  step,
  value,
  onChange,
  minLabel,
  maxLabel,
}: {
  label: string;
  display: string;
  min: number;
  max: number;
  step: number;
  value: number;
  onChange: (v: number) => void;
  minLabel: string;
  maxLabel: string;
}) {
  return (
    <div className="rounded-xl border border-zinc-800 bg-zinc-900/40 p-6">
      <div className="flex items-baseline justify-between">
        <label className="text-[13px] uppercase tracking-wider text-zinc-500">
          {label}
        </label>
        <span className="font-mono text-lg tabular-nums text-zinc-100">
          {display}
        </span>
      </div>
      <Slider
        className="mt-4 [&_[data-slot=slider-track]]:bg-zinc-800 [&_[data-slot=slider-range]]:bg-zinc-100 [&_[data-slot=slider-thumb]]:border-zinc-400"
        min={min}
        max={max}
        step={step}
        value={[value]}
        onValueChange={([v]) => onChange(v)}
      />
      <div className="mt-2 flex justify-between font-mono text-[11px] text-zinc-600">
        <span>{minLabel}</span>
        <span>{maxLabel}</span>
      </div>
    </div>
  );
}

// Recharts pie label: big amount inside the slice, name outside the pie
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function renderProceedsLabel(props: any) {
  const { cx, cy, midAngle, outerRadius, name, value, index } = props;
  const RADIAN = Math.PI / 180;
  const cos = Math.cos(-midAngle * RADIAN);
  const sin = Math.sin(-midAngle * RADIAN);
  const rIn = outerRadius * (index === 0 ? 0.55 : 0.68);
  const xIn = cx + rIn * cos;
  const yIn = cy + rIn * sin;
  const rOut = outerRadius + 34;
  const xOut = cx + rOut * cos;
  const yOut = cy + rOut * sin;
  const ink = index === 0 ? "#022c22" : "#450a0a";
  const accent = index === 0 ? "#34d399" : "#f87171";
  return (
    <g>
      <text
        x={xIn}
        y={yIn}
        dy={12}
        textAnchor="middle"
        fill={ink}
        fontSize={index === 0 ? 44 : 32}
        fontWeight={700}
        fontFamily="var(--font-geist-mono)"
      >
        {`${index === 1 ? "−" : ""}$${(value / 1_000_000).toFixed(1)}M`}
      </text>
      <text
        x={xOut}
        y={yOut}
        dy={6}
        textAnchor={xOut > cx ? "start" : "end"}
        fill={accent}
        fontSize={17}
        fontWeight={500}
        fontFamily="var(--font-inter)"
      >
        {name}
      </text>
    </g>
  );
}

// Recharts pie label for the deal split: share % inside the slice, entity + $ outside
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function renderAllocationLabel(props: any) {
  const { cx, cy, midAngle, outerRadius, name, value, percent, index } = props;
  if (percent < 0.005) return <g />;
  const RADIAN = Math.PI / 180;
  const cos = Math.cos(-midAngle * RADIAN);
  const sin = Math.sin(-midAngle * RADIAN);
  const rIn = outerRadius * 0.62;
  const xIn = cx + rIn * cos;
  const yIn = cy + rIn * sin;
  const rOut = outerRadius + 34;
  const xOut = cx + rOut * cos;
  const yOut = cy + rOut * sin;
  const anchor = xOut > cx ? "start" : "end";
  const accent = index === 0 ? "#34d399" : "#a1a1aa";
  // Ink has to clear its own fill: dark on the light emerald, light on the dark zinc.
  const inkOnSlice = index === 0 ? "#022c22" : "#fafafa";
  // A narrow wedge can't hold the big number — move it out beside the name.
  const wide = percent >= 0.25;
  return (
    <g>
      {wide ? (
        <text
          x={xIn}
          y={yIn}
          dy={14}
          textAnchor="middle"
          fill={inkOnSlice}
          fontSize={42}
          fontWeight={700}
          fontFamily="var(--font-geist-mono)"
        >
          {`${Math.round(percent * 100)}%`}
        </text>
      ) : (
        <text
          x={xOut}
          y={yOut}
          dy={-24}
          textAnchor={anchor}
          fill={accent}
          fontSize={30}
          fontWeight={700}
          fontFamily="var(--font-geist-mono)"
        >
          {`${Math.round(percent * 100)}%`}
        </text>
      )}
      <text
        x={xOut}
        y={yOut}
        dy={0}
        textAnchor={anchor}
        fill={accent}
        fontSize={17}
        fontWeight={500}
        fontFamily="var(--font-inter)"
      >
        {name}
      </text>
      <text
        x={xOut}
        y={yOut}
        dy={22}
        textAnchor={anchor}
        fill={accent}
        fontSize={15}
        fontWeight={400}
        opacity={0.7}
        fontFamily="var(--font-geist-mono)"
      >
        {fmtM(value)}
      </text>
    </g>
  );
}

// Percent slider with tick marks — the shape used by every rate control here.
function PercentSliderCard({
  kicker,
  value,
  onChange,
  footnote,
}: {
  kicker: string;
  value: number;
  onChange: (v: number) => void;
  footnote?: string;
}) {
  return (
    <div className="mt-4 rounded-xl border border-zinc-800 bg-zinc-900/40 px-12 py-14">
      <div className="mx-auto max-w-2xl">
        <p className="text-center text-[13px] uppercase tracking-wider text-zinc-500">
          {kicker}
        </p>
        <span className="mt-2 block text-center font-mono text-7xl font-semibold tabular-nums text-zinc-100">
          {value}%
        </span>
        <Slider
          className="mt-12 [&_[data-slot=slider-track]]:bg-zinc-800 [&_[data-slot=slider-range]]:bg-zinc-100 [&_[data-slot=slider-thumb]]:border-zinc-400"
          min={0}
          max={100}
          step={1}
          value={[value]}
          onValueChange={([v]) => onChange(v)}
        />
        <div className="relative mt-4 h-6">
          {[0, 10, 20, 30, 40, 50, 60, 70, 80, 90, 100].map((t) => (
            <button
              key={t}
              onClick={() => onChange(t)}
              className={`absolute -translate-x-1/2 font-mono text-sm tabular-nums transition-colors ${
                t === value
                  ? "text-zinc-100"
                  : "text-zinc-600 hover:text-zinc-300"
              }`}
              style={{ left: `${t}%` }}
            >
              {t}%
            </button>
          ))}
        </div>
        {footnote && (
          <p className="mt-6 text-center font-mono text-[11px] uppercase tracking-[0.2em] text-zinc-600">
            {footnote}
          </p>
        )}
      </div>
    </div>
  );
}

// ── Scenario comparison: compact variants sized for a half-width column ──

// `lg` is for the full-width bifurcated cards; the default is sized for the
// half-width comparison columns.
function CompareRow({
  label,
  value,
  negative = false,
  muted = false,
  size = "sm",
}: {
  label: string;
  value: string;
  negative?: boolean;
  muted?: boolean;
  size?: "sm" | "lg";
}) {
  const lg = size === "lg";
  return (
    <div
      className={`flex items-baseline justify-between gap-4 border-b border-zinc-800/60 ${
        lg ? "py-5" : "py-3"
      }`}
    >
      <span
        className={`leading-snug ${lg ? "text-lg" : "text-sm"} ${
          muted ? "text-zinc-500" : "text-zinc-300"
        }`}
      >
        {label}
      </span>
      <span
        className={`shrink-0 font-mono tabular-nums ${
          lg ? "text-2xl" : "text-base"
        } ${negative ? "text-red-400/90" : "text-zinc-100"}`}
      >
        {value}
      </span>
    </div>
  );
}

function CompareTotal({
  label,
  value,
  tone = "default",
  size = "sm",
}: {
  label: string;
  value: string;
  tone?: "default" | "positive" | "negative";
  size?: "sm" | "lg";
}) {
  const lg = size === "lg";
  const color =
    tone === "positive"
      ? "text-emerald-400"
      : tone === "negative"
        ? "text-red-400/90"
        : "text-zinc-100";
  return (
    <div
      className={`flex items-baseline justify-between gap-4 ${
        lg ? "mt-8" : "mt-5"
      }`}
    >
      <span
        className={`uppercase tracking-wider text-zinc-400 ${
          lg ? "text-lg" : "text-sm"
        }`}
      >
        {label}
      </span>
      <span
        className={`shrink-0 font-mono font-semibold tabular-nums ${
          lg ? "text-4xl" : "text-3xl"
        } ${color}`}
      >
        {value}
      </span>
    </div>
  );
}

function ArrCell() {
  return (
    <div className="flex justify-center py-2">
      <div className="flex h-40 w-40 flex-col items-center justify-center rounded-full border border-zinc-700 bg-zinc-900">
        <span className="font-mono text-3xl font-semibold tabular-nums text-zinc-100">
          $13.2M
        </span>
        <span className="mt-1 font-mono text-[11px] uppercase tracking-[0.2em] text-zinc-500">
          ARR
        </span>
      </div>
    </div>
  );
}

// Compact pie label — only wide enough wedges get an inside number, the legend
// below the chart carries the rest.
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function renderCompareAllocationLabel(props: any) {
  const { cx, cy, midAngle, outerRadius, percent, index } = props;
  if (percent < 0.18) return <g />;
  const RADIAN = Math.PI / 180;
  const r = outerRadius * 0.62;
  const x = cx + r * Math.cos(-midAngle * RADIAN);
  const y = cy + r * Math.sin(-midAngle * RADIAN);
  return (
    <text
      x={x}
      y={y}
      dy={9}
      textAnchor="middle"
      fill={index === 0 ? "#022c22" : "#fafafa"}
      fontSize={26}
      fontWeight={700}
      fontFamily="var(--font-geist-mono)"
    >
      {`${Math.round(percent * 100)}%`}
    </text>
  );
}

function AllocationCell({
  exit,
  domainValue,
  opcoValue,
}: {
  exit: number;
  domainValue: number;
  opcoValue: number;
}) {
  const dPct = exit > 0 ? Math.round((domainValue / exit) * 100) : 0;
  return (
    <div>
      <div className="flex justify-center">
        <PieChart width={260} height={260}>
          <Pie
            data={[
              { name: "DomainCo LLC", value: domainValue },
              { name: "OperatingGroup LLC", value: opcoValue },
            ]}
            dataKey="value"
            cx="50%"
            cy="50%"
            innerRadius={0}
            outerRadius={112}
            startAngle={90}
            endAngle={-270}
            stroke="none"
            isAnimationActive={false}
            labelLine={false}
            label={renderCompareAllocationLabel}
          >
            <Cell fill="#34d399" />
            <Cell fill="#52525b" />
          </Pie>
        </PieChart>
      </div>
      <div className="mt-4 space-y-2.5">
        <div className="flex items-baseline justify-between gap-3">
          <span className="flex items-center gap-2 text-sm text-zinc-400">
            <span className="h-2.5 w-2.5 shrink-0 rounded-sm bg-emerald-400" />
            DomainCo LLC
          </span>
          <span className="shrink-0 font-mono text-sm tabular-nums text-zinc-200">
            {dPct}% · {fmtM(domainValue)}
          </span>
        </div>
        <div className="flex items-baseline justify-between gap-3">
          <span className="flex items-center gap-2 text-sm text-zinc-400">
            <span className="h-2.5 w-2.5 shrink-0 rounded-sm bg-zinc-600" />
            OperatingGroup LLC
          </span>
          <span className="shrink-0 font-mono text-sm tabular-nums text-zinc-200">
            {100 - dPct}% · {fmtM(opcoValue)}
          </span>
        </div>
      </div>
    </div>
  );
}

function TaxCell({
  exit,
  domainValue,
  opcoValue,
  domainTax,
  opcoTax,
}: {
  exit: number;
  domainValue: number;
  opcoValue: number;
  domainTax: number;
  opcoTax: number;
}) {
  const total = domainTax + opcoTax;
  return (
    <div>
      <CompareRow label="Enterprise exit value" value={fmtM(exit, 0)} />
      <CompareRow
        label={
          domainValue > 0
            ? `DomainCo LLC ${fmtM(domainValue)} · LTCG 20%`
            : "DomainCo LLC · no allocation"
        }
        value={domainValue > 0 ? `−${fmtM(domainTax)}` : "—"}
        negative={domainValue > 0}
        muted={domainValue === 0}
      />
      <CompareRow
        label={`OperatingGroup LLC ${fmtM(opcoValue)} · Ordinary 37%`}
        value={`−${fmtM(opcoTax)}`}
        negative
      />
      <CompareRow label="State · Texas 0%" value="−$0" muted />
      <CompareTotal
        label="Total tax"
        value={`−${fmtM(total)}`}
        tone="negative"
      />
      <div className="mt-3 flex items-baseline justify-between">
        <span className="text-sm text-zinc-500">Blended effective rate</span>
        <span className="font-mono text-base tabular-nums text-zinc-300">
          {exit > 0 ? ((total / exit) * 100).toFixed(1) : "0.0"}%
        </span>
      </div>
    </div>
  );
}

// Both columns share one scale (the exit value) so bar lengths compare directly —
// two pies would each normalise to 100% and hide the difference.
function ProceedsCell({ exit, tax }: { exit: number; tax: number }) {
  const net = exit - tax;
  const netPct = exit > 0 ? (net / exit) * 100 : 0;
  return (
    <div>
      <p className="text-[11px] uppercase tracking-wider text-zinc-500">
        Net proceeds
      </p>
      <span className="mt-1 block font-mono text-4xl font-semibold tabular-nums text-emerald-400">
        {fmtM(net)}
      </span>
      <div className="mt-6 flex h-4 overflow-hidden rounded-full bg-zinc-800/80">
        <div
          className="h-full bg-emerald-400"
          style={{ width: `${netPct}%` }}
        />
        <div className="h-full flex-1 bg-red-400/80" />
      </div>
      <div className="mt-4 space-y-2.5">
        <div className="flex items-baseline justify-between gap-3">
          <span className="flex items-center gap-2 text-sm text-zinc-400">
            <span className="h-2.5 w-2.5 shrink-0 rounded-sm bg-emerald-400" />
            Kept
          </span>
          <span className="shrink-0 font-mono text-sm tabular-nums text-zinc-200">
            {Math.round(netPct)}% · {fmtM(net)}
          </span>
        </div>
        <div className="flex items-baseline justify-between gap-3">
          <span className="flex items-center gap-2 text-sm text-zinc-400">
            <span className="h-2.5 w-2.5 shrink-0 rounded-sm bg-red-400/80" />
            Tax
          </span>
          <span className="shrink-0 font-mono text-sm tabular-nums text-zinc-200">
            {Math.round(100 - netPct)}% · {fmtM(tax)}
          </span>
        </div>
      </div>
    </div>
  );
}

const ACCESS_CODE = "access123!";

function AccessGate({ onUnlock }: { onUnlock: () => void }) {
  const [code, setCode] = useState("");
  const [error, setError] = useState(false);

  const submit = () => {
    if (code === ACCESS_CODE) {
      try {
        sessionStorage.setItem("demo-access", "granted");
      } catch {}
      onUnlock();
    } else {
      setError(true);
    }
  };

  return (
    <div className="flex h-dvh items-center justify-center bg-zinc-950 text-zinc-100">
      <div className="w-full max-w-sm px-6">
        <p className="font-mono text-[11px] uppercase tracking-[0.25em] text-zinc-500">
          ColdEmail.com
        </p>
        <label className="mt-8 block text-[13px] uppercase tracking-wider text-zinc-500">
          Access code
        </label>
        <input
          type="password"
          autoFocus
          value={code}
          onChange={(e) => {
            setCode(e.target.value);
            setError(false);
          }}
          onKeyDown={(e) => e.key === "Enter" && submit()}
          className={`mt-3 w-full rounded-lg border bg-zinc-900 px-4 py-3 font-mono text-sm text-zinc-100 outline-none transition-colors focus:border-zinc-500 ${
            error ? "border-red-500/60" : "border-zinc-700"
          }`}
        />
        <button
          onClick={submit}
          className="mt-4 w-full rounded-lg border border-zinc-700 bg-zinc-100 px-4 py-3 text-sm font-medium text-zinc-950 transition-colors hover:bg-white"
        >
          Enter
        </button>
      </div>
    </div>
  );
}

// Scenario B — the OperatingGroup + DomainCo licensing structure.
// The four sliders that drive the New scenario. Held by DemoPage so the New and
// Comparison tabs read exactly the same model.
type NewControls = {
  exitMult: number;
  setExitMult: (v: number) => void;
  margin: number;
  setMargin: (v: number) => void;
  royaltyRate: number;
  setRoyaltyRate: (v: number) => void;
  domainMult: number;
  setDomainMult: (v: number) => void;
  distRate: number;
  setDistRate: (v: number) => void;
};

function deriveNewModel(c: NewControls) {
  const operatingProfit = ARR * (c.margin / 100);
  const royalty = operatingProfit * (c.royaltyRate / 100);

  // The licensing fee moves profit between two wholly-owned entities, so the
  // combined base — and every figure derived from it — matches Scenario A.
  const grossDist = operatingProfit * (c.distRate / 100);
  const distTax = grossDist * ORDINARY_RATE;

  const exit = c.exitMult * ARR;

  // DomainCo's slice of the deal is its gross income capitalized at a multiple.
  // Capped at the exit value — the two allocations must sum to the deal, not exceed it.
  const domainValueRaw = royalty * c.domainMult;
  const domainValue = Math.min(domainValueRaw, exit);
  const domainCapped = domainValueRaw > exit;
  const opcoValue = exit - domainValue;
  const domainShare = exit > 0 ? domainValue / exit : 0;

  const domainTax = domainValue * DOMAIN_GAINS_RATE;
  const opcoTax = opcoValue * ORDINARY_RATE;
  const tax = domainTax + opcoTax;
  const net = exit - tax;

  // Comparison baseline: same exit, no DomainCo — the whole deal is the
  // operating group, so all of it lands at the ordinary rate.
  const cmpTaxA = exit * ORDINARY_RATE;

  return {
    operatingProfit,
    royalty,
    grossDist,
    distTax,
    exit,
    domainValue,
    domainCapped,
    opcoValue,
    domainShare,
    domainTax,
    opcoTax,
    tax,
    net,
    cmpTaxA,
  };
}

function NewScenario({ controls }: { controls: NewControls }) {
  const {
    exitMult,
    setExitMult,
    margin,
    setMargin,
    royaltyRate,
    setRoyaltyRate,
    domainMult,
    setDomainMult,
    distRate,
    setDistRate,
  } = controls;
  const {
    operatingProfit,
    royalty,
    grossDist,
    distTax,
    exit,
    domainValue,
    domainCapped,
    opcoValue,
    domainShare,
    domainTax,
    opcoTax,
    tax,
    net,
  } = deriveNewModel(controls);

  return (
    <>
      <div className="flex items-center gap-3">
        <div className="flex h-9 w-9 items-center justify-center rounded-lg border border-zinc-700 bg-zinc-900">
          <Building2 className="h-4 w-4 text-zinc-400" />
        </div>
        <h1 className="text-xl font-medium text-zinc-200">Scenario B</h1>
      </div>

      {/* Company Economics */}
      <h2 className="mt-12 text-2xl font-semibold uppercase tracking-wide text-zinc-100">
        Company Economics
      </h2>
      <div className="mt-4 rounded-xl border border-zinc-800 bg-zinc-900/40 p-7">
        <div className="flex justify-center py-8">
          <div className="flex h-64 w-64 flex-col items-center justify-center rounded-full border border-zinc-700 bg-zinc-900">
            <span className="font-mono text-5xl font-semibold tabular-nums text-zinc-100">
              $13.2M
            </span>
            <span className="mt-2 font-mono text-sm uppercase tracking-[0.2em] text-zinc-500">
              ARR
            </span>
          </div>
        </div>
      </div>

      {/* Entity Structure */}
      <h2 className="mt-12 text-2xl font-semibold uppercase tracking-wide text-zinc-100">
        Entity Structure
      </h2>
      <div className="mt-4 rounded-xl border border-zinc-800 bg-zinc-900/40 p-7">
        <div className="flex flex-col items-center">
          {/* Master HoldCo */}
          <div className="rounded-xl border border-zinc-700 bg-zinc-900 px-14 py-7 text-center">
            <p className="text-xl font-medium text-zinc-100">Master HoldCo.</p>
            <p className="mt-1 font-mono text-sm text-zinc-500">
              S-Corp · Texas
            </p>
          </div>

          {/* Ownership connectors — stubs sit inside the same grid as the boxes
              below, so they land on each box's true centre at any width. */}
          <div className="relative h-7 w-full max-w-[1000px]">
            <div className="absolute left-1/2 top-0 h-7 w-px bg-zinc-700" />
          </div>
          <div className="grid w-full max-w-[1000px] grid-cols-3 gap-8">
            <div className="relative col-span-2 h-7">
              <div className="absolute left-1/2 -right-4 top-0 h-px bg-zinc-700" />
              <div className="absolute left-1/2 top-0 h-7 w-px bg-zinc-700" />
            </div>
            <div className="relative h-7">
              <div className="absolute -left-4 right-1/2 top-0 h-px bg-zinc-700" />
              <div className="absolute left-1/2 top-0 h-7 w-px bg-zinc-700" />
            </div>
          </div>

          {/* The operating companies carry the weight; DomainCo is a holding
              shell, so it reads smaller rather than as an equal peer. */}
          <div className="grid w-full max-w-[1000px] grid-cols-3 gap-8">
            <div className="col-span-2 rounded-xl border border-zinc-700 bg-zinc-900/60 p-7">
              <p className="text-center text-2xl font-medium text-zinc-100">
                OperatingGroup LLC
              </p>
              <p className="mt-1 text-center font-mono text-sm text-zinc-500">
                100%
              </p>
              <div className="mt-6 grid grid-cols-2 gap-5">
                <div className="rounded-lg border border-zinc-700 bg-zinc-950/60 px-5 py-7 text-center">
                  <p className="text-lg font-medium text-zinc-100">
                    LeadBird LLC
                  </p>
                  <p className="mt-1 font-mono text-sm text-zinc-500">100%</p>
                </div>
                <div className="rounded-lg border border-zinc-700 bg-zinc-950/60 px-5 py-7 text-center">
                  <p className="text-lg font-medium text-zinc-100">
                    Cleverly LLC
                  </p>
                  <p className="mt-1 font-mono text-sm text-zinc-500">
                    % stake
                  </p>
                </div>
              </div>
            </div>

            {/* DomainCo LLC — outside the operating group, deliberately compact.
                Top-aligned so the ownership stub actually lands on it. */}
            <div className="self-start rounded-lg border border-zinc-800 bg-zinc-900 px-4 py-5 text-center">
              <p className="text-base font-medium text-zinc-300">DomainCo LLC</p>
              <p className="mt-1 font-mono text-xs text-zinc-500">100%</p>
              <p className="mt-2 font-mono text-[10px] uppercase tracking-[0.15em] text-zinc-600">
                Holding shell
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Licensing Structure — OperatingGroup ↔ DomainCo LLC */}
      <h2 className="mt-12 text-2xl font-semibold uppercase tracking-wide text-zinc-100">
        Licensing Structure
      </h2>
      <div className="mt-4 rounded-xl border border-zinc-800 bg-zinc-900/40 px-8 py-12">
        <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-6">
          {/* OperatingGroup */}
          <div className="rounded-xl border border-zinc-700 bg-zinc-900 px-6 py-8 text-center">
            <p className="text-xl font-medium text-zinc-100">
              OperatingGroup LLC
            </p>
            <p className="mt-1 font-mono text-sm text-zinc-500">
              LeadBird + Cleverly
            </p>
          </div>

          {/* Flows */}
          <div className="flex w-[280px] flex-col gap-10">
            {/* OperatingGroup → DomainCo */}
            <div>
              <p className="mb-3 text-center font-mono text-[11px] uppercase tracking-[0.15em] text-emerald-400">
                Licensing fee
              </p>
              <div className="relative h-px w-full bg-emerald-500/60">
                <div className="absolute right-0 top-1/2 h-0 w-0 -translate-y-1/2 border-y-[5px] border-y-transparent border-l-[7px] border-l-emerald-400" />
              </div>
              <p className="mt-3 text-center font-mono text-[10px] uppercase tracking-[0.15em] text-zinc-500">
                Cash out of OperatingGroup
              </p>
            </div>

            {/* DomainCo → OperatingGroup */}
            <div>
              <p className="mb-3 text-center font-mono text-[11px] uppercase tracking-[0.15em] text-zinc-300">
                ColdEmail.com license
              </p>
              <div className="relative h-px w-full bg-zinc-500/60">
                <div className="absolute left-0 top-1/2 h-0 w-0 -translate-y-1/2 border-y-[5px] border-y-transparent border-r-[7px] border-r-zinc-400" />
              </div>
              <p className="mt-3 text-center font-mono text-[10px] uppercase tracking-[0.15em] text-zinc-500">
                Right to use, back in
              </p>
            </div>
          </div>

          {/* DomainCo LLC */}
          <div className="rounded-xl border border-emerald-500/40 bg-emerald-500/[0.06] px-6 py-8 text-center">
            <p className="text-xl font-medium text-zinc-100">DomainCo LLC</p>
            <p className="mt-1 font-mono text-sm text-emerald-400/80">
              Holds ColdEmail.com
            </p>
          </div>
        </div>

        {/* In / out ledger */}
        <div className="mt-12 grid grid-cols-2 gap-8 border-t border-zinc-800/60 pt-8">
          <div>
            <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-zinc-500">
              OperatingGroup LLC
            </p>
            <p className="mt-4 flex items-baseline gap-3 text-zinc-300">
              <span className="w-10 shrink-0 font-mono text-emerald-400">
                OUT
              </span>
              Pays the licensing fee — deductible operating expense
            </p>
            <p className="mt-2 flex items-baseline gap-3 text-zinc-300">
              <span className="w-10 shrink-0 font-mono text-zinc-400">IN</span>
              Right to operate on ColdEmail.com
            </p>
          </div>
          <div>
            <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-zinc-500">
              DomainCo LLC
            </p>
            <p className="mt-4 flex items-baseline gap-3 text-zinc-300">
              <span className="w-10 shrink-0 font-mono text-emerald-400">
                IN
              </span>
              Receives the licensing fee — recurring revenue
            </p>
            <p className="mt-2 flex items-baseline gap-3 text-zinc-300">
              <span className="w-10 shrink-0 font-mono text-zinc-400">OUT</span>
              Grants the license, retains the asset
            </p>
          </div>
        </div>
      </div>

      {/* Net Operating Profit Margin */}
      <h2 className="mt-12 text-2xl font-semibold uppercase tracking-wide text-zinc-100">
        Net Operating Profit Margin
      </h2>
      <div className="mt-4 rounded-xl border border-zinc-800 bg-zinc-900/40 px-12 py-14">
        <div className="mx-auto max-w-2xl">
          <p className="text-center text-[13px] uppercase tracking-wider text-zinc-500">
            Operating margin
          </p>
          <span className="mt-2 block text-center font-mono text-7xl font-semibold tabular-nums text-zinc-100">
            {margin}%
          </span>
          <Slider
            className="mt-12 [&_[data-slot=slider-track]]:bg-zinc-800 [&_[data-slot=slider-range]]:bg-zinc-100 [&_[data-slot=slider-thumb]]:border-zinc-400"
            min={0}
            max={100}
            step={1}
            value={[margin]}
            onValueChange={([v]) => setMargin(v)}
          />
          <div className="relative mt-4 h-6">
            {[0, 10, 20, 30, 40, 50, 60, 70, 80, 90, 100].map((m) => {
              const pct = m;
              const active = m === margin;
              return (
                <button
                  key={m}
                  onClick={() => setMargin(m)}
                  className={`absolute -translate-x-1/2 font-mono text-sm tabular-nums transition-colors ${
                    active
                      ? "text-zinc-100"
                      : "text-zinc-600 hover:text-zinc-300"
                  }`}
                  style={{ left: `${pct}%` }}
                >
                  {m}%
                </button>
              );
            })}
          </div>
          <div className="mt-14 flex items-baseline justify-between border-t border-zinc-800/60 pt-8">
            <span className="text-2xl uppercase tracking-wider text-zinc-400">
              Net operating profit
            </span>
            <AnimatedM
              value={operatingProfit}
              className="font-mono text-5xl font-semibold tabular-nums text-zinc-100"
            />
          </div>
          <p className="mt-6 text-center font-mono text-[11px] uppercase tracking-[0.2em] text-zinc-600">
            Applied to ARR $13.2M
          </p>
        </div>
      </div>

      {/* Royalty Rate */}
      <h2 className="mt-12 text-2xl font-semibold uppercase tracking-wide text-zinc-100">
        Royalty Rate
      </h2>
      <div className="mt-4 rounded-xl border border-zinc-800 bg-zinc-900/40 px-12 py-14">
        <div className="mx-auto max-w-2xl">
          <p className="text-center text-[13px] uppercase tracking-wider text-zinc-500">
            % of net operating profit utilized for licensing payments
          </p>
          <span className="mt-2 block text-center font-mono text-7xl font-semibold tabular-nums text-zinc-100">
            {royaltyRate}%
          </span>
          <Slider
            className="mt-12 [&_[data-slot=slider-track]]:bg-zinc-800 [&_[data-slot=slider-range]]:bg-zinc-100 [&_[data-slot=slider-thumb]]:border-zinc-400"
            min={0}
            max={100}
            step={1}
            value={[royaltyRate]}
            onValueChange={([v]) => setRoyaltyRate(v)}
          />
          <div className="relative mt-4 h-6">
            {[0, 10, 20, 30, 40, 50, 60, 70, 80, 90, 100].map((r) => {
              const active = r === royaltyRate;
              return (
                <button
                  key={r}
                  onClick={() => setRoyaltyRate(r)}
                  className={`absolute -translate-x-1/2 font-mono text-sm tabular-nums transition-colors ${
                    active
                      ? "text-zinc-100"
                      : "text-zinc-600 hover:text-zinc-300"
                  }`}
                  style={{ left: `${r}%` }}
                >
                  {r}%
                </button>
              );
            })}
          </div>

          <div className="mt-14 flex items-baseline justify-between border-t border-zinc-800/60 pt-10">
            <span className="text-2xl uppercase tracking-wider text-zinc-400">
              Monthly licensing fee
            </span>
            <span className="font-mono text-5xl font-semibold tabular-nums text-emerald-400">
              {fmtDollars(royalty / 12)}
            </span>
          </div>
        </div>
      </div>

      {/* DomainCo LLC Gross Income */}
      <h2 className="mt-12 text-2xl font-semibold uppercase tracking-wide text-zinc-100">
        DomainCo LLC Gross Income
      </h2>
      <div className="mt-4 rounded-xl border border-emerald-500/30 bg-zinc-900/40 px-14 py-16">
        <LedgerRow
          label="Monthly licensing fee · from OperatingGroup LLC"
          value={fmtDollars(royalty / 12)}
        />
        <LedgerRow label="Payments per year" value="× 12" muted />
        <div className="flex items-baseline justify-between pt-10">
          <span className="text-2xl uppercase tracking-wider text-zinc-400">
            Annual gross income
          </span>
          <span className="font-mono text-5xl font-semibold tabular-nums text-emerald-400">
            {fmtDollars(royalty)}
          </span>
        </div>
      </div>

      {/* Operating Profit — bifurcated */}
      <h2 className="mt-12 text-2xl font-semibold uppercase tracking-wide text-zinc-100">
        Operating Profit
      </h2>
      <div className="mt-4 rounded-xl border border-zinc-800 bg-zinc-900/40 px-12 py-14">
        <div className="grid grid-cols-2 gap-14">
          <div>
            <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-zinc-500">
              OperatingGroup LLC
            </p>
            <div className="mt-4">
              <CompareRow
                size="lg"
                label={`Net operating profit · ${margin}% of ARR`}
                value={fmtDollars(operatingProfit)}
              />
              <CompareRow
                size="lg"
                label="Less licensing fee to DomainCo LLC"
                value={`−${fmtDollars(royalty)}`}
                negative
              />
              <CompareTotal
                size="lg"
                label="Operating profit"
                value={fmtDollars(operatingProfit - royalty)}
              />
            </div>
          </div>
          <div>
            <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-emerald-400/80">
              DomainCo LLC
            </p>
            <div className="mt-4">
              <CompareRow
                size="lg"
                label="Licensing fee from OperatingGroup LLC"
                value={fmtDollars(royalty)}
              />
              <CompareRow
                size="lg"
                label="Operating costs"
                value="−$0"
                muted
              />
              <CompareTotal
                size="lg"
                label="Operating profit"
                value={fmtDollars(royalty)}
                tone="positive"
              />
            </div>
          </div>
        </div>
        <div className="mt-10 flex items-baseline justify-between border-t border-zinc-800/60 pt-8">
          <span className="text-2xl uppercase tracking-wider text-zinc-400">
            Combined operating profit
          </span>
          <span className="font-mono text-5xl font-semibold tabular-nums text-zinc-100">
            {fmtDollars(operatingProfit)}
          </span>
        </div>
        <p className="mt-6 font-mono text-[11px] leading-relaxed text-zinc-600">
          The licensing fee moves profit between two entities the owner holds
          100% of — it does not leave the group. Combined operating profit is
          identical to Scenario A.
        </p>
      </div>

      {/* Distribution */}
      <h2 className="mt-12 text-2xl font-semibold uppercase tracking-wide text-zinc-100">
        Distribution
      </h2>
      <PercentSliderCard
        kicker="% of operating profit distributed"
        value={distRate}
        onChange={setDistRate}
        footnote="Applied to both entities"
      />

      {/* Gross Distributions — bifurcated */}
      <h2 className="mt-12 text-2xl font-semibold uppercase tracking-wide text-zinc-100">
        Gross Distributions
      </h2>
      <div className="mt-4 rounded-xl border border-zinc-800 bg-zinc-900/40 px-12 py-14">
        <div className="grid grid-cols-2 gap-14">
          <div>
            <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-zinc-500">
              From OperatingGroup LLC
            </p>
            <div className="mt-4">
              <CompareRow
                size="lg"
                label="Operating profit"
                value={fmtDollars(operatingProfit - royalty)}
              />
              <CompareRow
                size="lg"
                label={`Distributed · ${distRate}%`}
                value={`× ${distRate}%`}
                muted
              />
              <CompareTotal
                size="lg"
                label="Gross distribution"
                value={fmtDollars((operatingProfit - royalty) * (distRate / 100))}
              />
            </div>
          </div>
          <div>
            <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-emerald-400/80">
              From DomainCo LLC
            </p>
            <div className="mt-4">
              <CompareRow
                size="lg"
                label="Operating profit"
                value={fmtDollars(royalty)}
              />
              <CompareRow
                size="lg"
                label={`Distributed · ${distRate}%`}
                value={`× ${distRate}%`}
                muted
              />
              <CompareTotal
                size="lg"
                label="Gross distribution"
                value={fmtDollars(royalty * (distRate / 100))}
                tone="positive"
              />
            </div>
          </div>
        </div>
        <div className="mt-10 flex items-baseline justify-between border-t border-zinc-800/60 pt-8">
          <span className="text-2xl uppercase tracking-wider text-zinc-400">
            Combined gross distributions
          </span>
          <span className="font-mono text-5xl font-semibold tabular-nums text-zinc-100">
            {fmtDollars(grossDist)}
          </span>
        </div>
      </div>

      {/* After-Tax Distributions */}
      <h2 className="mt-12 text-2xl font-semibold uppercase tracking-wide text-zinc-100">
        After-Tax Distributions
      </h2>
      <div className="mt-4 rounded-xl border border-zinc-800 bg-zinc-900/40 px-14 py-16">
        <LedgerRow
          label="Combined gross distributions"
          value={fmtDollars(grossDist)}
        />
        <LedgerRow
          label="Federal · Ordinary income 37%"
          value={`−${fmtDollars(distTax)}`}
          negative
        />
        <LedgerRow label="State · Texas 0%" value="−$0" muted />
        <div className="flex items-baseline justify-between pt-10">
          <span className="text-2xl uppercase tracking-wider text-zinc-400">
            After-tax distributions
          </span>
          <span className="font-mono text-5xl font-semibold tabular-nums text-emerald-400">
            {fmtDollars(grossDist - distTax)}
          </span>
        </div>
        <p className="mt-8 font-mono text-[11px] leading-relaxed text-zinc-600">
          Both entities are pass-throughs — no tax at the entity, taxed once at
          the owner level. Licensing income and operating profit are both
          ordinary, so the split changes nothing here. Texas levies no state
          income tax.
        </p>
      </div>

      {/* Master HoldCo Economics */}
      <h2 className="mt-12 text-2xl font-semibold uppercase tracking-wide text-zinc-100">
        Master HoldCo. Economics
      </h2>
      <div className="mt-4 rounded-xl border border-zinc-800 bg-zinc-900/40 p-7">
        <div className="flex justify-center py-8">
          <div className="flex h-64 w-64 flex-col items-center justify-center rounded-full border border-zinc-700 bg-zinc-900">
            <span className="font-mono text-5xl font-semibold tabular-nums text-zinc-100">
              $13.2M
            </span>
            <span className="mt-2 font-mono text-sm uppercase tracking-[0.2em] text-zinc-500">
              ARR
            </span>
          </div>
        </div>
      </div>

      {/* Enterprise Exit Value */}
      <h2 className="mt-12 text-2xl font-semibold uppercase tracking-wide text-zinc-100">
        Enterprise Exit Value
      </h2>
      <div className="mt-4 rounded-xl border border-zinc-800 bg-zinc-900/40 px-12 py-14">
        <div className="mx-auto max-w-2xl">
          <AnimatedM
            value={exit}
            decimals={0}
            className="block text-center font-mono text-7xl font-semibold tabular-nums text-zinc-100"
          />
          <Slider
            className="mt-12 [&_[data-slot=slider-track]]:bg-zinc-800 [&_[data-slot=slider-range]]:bg-zinc-100 [&_[data-slot=slider-thumb]]:border-zinc-400"
            min={2}
            max={9}
            step={0.1}
            value={[exitMult]}
            onValueChange={([v]) => setExitMult(v)}
          />
          <div className="relative mt-4 h-6">
            {[2, 3, 4, 5, 6, 7, 8, 9].map((m) => {
              const pct = ((m - 2) / (9 - 2)) * 100;
              const active = m === exitMult;
              return (
                <button
                  key={m}
                  onClick={() => setExitMult(m)}
                  className={`absolute -translate-x-1/2 font-mono text-sm tabular-nums transition-colors ${
                    active
                      ? "text-zinc-100"
                      : "text-zinc-600 hover:text-zinc-300"
                  }`}
                  style={{ left: `${pct}%` }}
                >
                  {m}×
                </button>
              );
            })}
          </div>
          <p className="mt-6 text-center font-mono text-[11px] uppercase tracking-[0.2em] text-zinc-600">
            Exit multiple · ARR $13.2M
          </p>
        </div>
      </div>

      {/* DomainCo LLC Valuation */}
      <h2 className="mt-12 text-2xl font-semibold uppercase tracking-wide text-zinc-100">
        DomainCo LLC Valuation
      </h2>
      <div className="mt-4 rounded-xl border border-zinc-800 bg-zinc-900/40 px-12 py-14">
        <div className="mx-auto max-w-2xl">
          <p className="text-center text-[13px] uppercase tracking-wider text-zinc-500">
            Multiple on annual gross income {fmtDollars(royalty)}
          </p>
          <span className="mt-2 block text-center font-mono text-7xl font-semibold tabular-nums text-zinc-100">
            {domainMult}×
          </span>
          <Slider
            className="mt-12 [&_[data-slot=slider-track]]:bg-zinc-800 [&_[data-slot=slider-range]]:bg-zinc-100 [&_[data-slot=slider-thumb]]:border-zinc-400"
            min={2}
            max={20}
            step={1}
            value={[domainMult]}
            onValueChange={([v]) => setDomainMult(v)}
          />
          <div className="relative mt-4 h-6">
            {[2, 4, 6, 8, 10, 12, 14, 16, 18, 20].map((m) => {
              const pct = ((m - 2) / (20 - 2)) * 100;
              const active = m === domainMult;
              return (
                <button
                  key={m}
                  onClick={() => setDomainMult(m)}
                  className={`absolute -translate-x-1/2 font-mono text-sm tabular-nums transition-colors ${
                    active
                      ? "text-zinc-100"
                      : "text-zinc-600 hover:text-zinc-300"
                  }`}
                  style={{ left: `${pct}%` }}
                >
                  {m}×
                </button>
              );
            })}
          </div>

          <div className="mt-14 border-t border-zinc-800/60 pt-2">
            <LedgerRow
              label="Annual gross income"
              value={fmtDollars(royalty)}
            />
            <LedgerRow
              label="Valuation multiple"
              value={`× ${domainMult}`}
              muted
            />
            <div className="flex items-baseline justify-between pt-10">
              <span className="text-2xl uppercase tracking-wider text-zinc-400">
                DomainCo LLC value
              </span>
              <AnimatedM
                value={domainValue}
                className="font-mono text-5xl font-semibold tabular-nums text-emerald-400"
              />
            </div>
            <div className="mt-6 flex items-baseline justify-between border-t border-zinc-800/60 pt-6">
              <span className="text-xl tracking-wide text-zinc-500">
                Share of enterprise exit value {fmtM(exit, 0)}
              </span>
              <span className="font-mono text-3xl tabular-nums text-emerald-400">
                {Math.round(domainShare * 100)}%
              </span>
            </div>
          </div>
          {domainCapped && (
            <p className="mt-6 font-mono text-[11px] leading-relaxed text-amber-400/80">
              {domainMult}× gross income exceeds the enterprise exit value —
              DomainCo LLC is capped at 100% of the deal. Lower the multiple or
              raise the exit multiple for a meaningful split.
            </p>
          )}
        </div>
      </div>

      {/* Deal Value Allocation */}
      <h2 className="mt-12 text-2xl font-semibold uppercase tracking-wide text-zinc-100">
        Deal Value Allocation
      </h2>
      <div className="mt-4 rounded-xl border border-zinc-800 bg-zinc-900/40 px-12 py-10">
        <div>
          {/* Height clears the outside label block: a slice sitting at the top
              of the pie stacks %, name and $ above the arc and would otherwise
              be cut off by the SVG edge. */}
          <div className="relative mx-auto h-[560px] w-[800px] max-w-full">
            <PieChart width={800} height={560}>
              <Pie
                data={[
                  { name: "DomainCo LLC", value: domainValue },
                  { name: "OperatingGroup LLC", value: opcoValue },
                ]}
                dataKey="value"
                cx="50%"
                cy="50%"
                innerRadius={0}
                outerRadius={180}
                startAngle={90}
                endAngle={-270}
                stroke="none"
                isAnimationActive={false}
                labelLine={false}
                label={renderAllocationLabel}
              >
                <Cell fill="#34d399" />
                <Cell fill="#52525b" />
              </Pie>
            </PieChart>
          </div>
          <div className="mx-auto max-w-2xl">
            <LedgerRow label="Enterprise exit value" value={fmtM(exit, 0)} />
            <LedgerRow
              label={`Ascribed to DomainCo LLC · ${Math.round(
                domainShare * 100
              )}%`}
              value={fmtM(domainValue)}
            />
            <LedgerRow
              label={`Ascribed to OperatingGroup LLC · ${Math.round(
                (1 - domainShare) * 100
              )}%`}
              value={fmtM(opcoValue)}
              muted
            />
          </div>
        </div>
      </div>

      {/* Tax Treatment */}
      <h2 className="mt-12 text-2xl font-semibold uppercase tracking-wide text-zinc-100">
        Tax Treatment
      </h2>
      <div className="mt-4 rounded-xl border border-zinc-800 bg-zinc-900/40 px-14 py-16">
        <LedgerRow label="Enterprise exit value" value={fmtM(exit, 0)} />
        <LedgerRow
          label={`DomainCo LLC ${fmtM(
            domainValue
          )} · Long-term capital gains 20%`}
          value={`−${fmtM(domainTax)}`}
          negative
        />
        <LedgerRow
          label={`OperatingGroup LLC ${fmtM(opcoValue)} · Ordinary income 37%`}
          value={`−${fmtM(opcoTax)}`}
          negative
        />
        <LedgerRow label="State · Texas 0%" value="−$0" muted />
        <div className="flex items-baseline justify-between pt-10">
          <span className="text-2xl uppercase tracking-wider text-zinc-400">
            Total tax burden
          </span>
          <AnimatedM
            value={tax}
            prefix="−"
            className="font-mono text-5xl font-semibold tabular-nums text-red-400/90"
          />
        </div>
        <div className="mt-8 flex items-baseline justify-between border-t border-zinc-800/60 pt-8">
          <span className="text-xl tracking-wide text-zinc-500">
            Blended effective rate
          </span>
          <span className="font-mono text-3xl tabular-nums text-zinc-300">
            {exit > 0 ? ((tax / exit) * 100).toFixed(1) : "0.0"}%
          </span>
        </div>
      </div>

      {/* Post-Tax Proceeds */}
      <h2 className="mt-12 text-2xl font-semibold uppercase tracking-wide text-zinc-100">
        Post-Tax Proceeds
      </h2>
      <div className="mt-4 rounded-xl border border-zinc-800 bg-zinc-900/40 px-8 py-10">
        <div className="relative mx-auto h-[480px] w-[800px] max-w-full">
          <PieChart width={800} height={480}>
            <Pie
              data={[
                { name: "Net proceeds", value: net },
                { name: "Tax burden", value: tax },
              ]}
              dataKey="value"
              cx="50%"
              cy="50%"
              innerRadius={0}
              outerRadius={190}
              startAngle={90}
              endAngle={-270}
              stroke="none"
              isAnimationActive={false}
              labelLine={false}
              label={renderProceedsLabel}
            >
              <Cell fill="#34d399" />
              <Cell fill="#f87171" />
            </Pie>
          </PieChart>
        </div>
      </div>

      <p className="mt-6 font-mono text-[11px] leading-relaxed text-zinc-600">
        Federal only — DomainCo LLC allocation at long-term capital gains 20%,
        OperatingGroup LLC allocation at ordinary 37% · Texas: no state income tax
      </p>

    </>
  );
}

function ComparisonScenario({ controls }: { controls: NewControls }) {
  const { exit, domainValue, opcoValue, domainTax, opcoTax, tax, cmpTaxA } =
    deriveNewModel(controls);

  return (
    <>
      <div className="flex items-center gap-3">
        <div className="flex h-9 w-9 items-center justify-center rounded-lg border border-zinc-700 bg-zinc-900">
          <Scale className="h-4 w-4 text-zinc-400" />
        </div>
        <h1 className="text-xl font-medium text-zinc-200">Comparison</h1>
      </div>

      <h2 className="mt-12 text-2xl font-semibold uppercase tracking-wide text-zinc-100">
        Scenario Comparison
      </h2>
      <p className="mt-2 font-mono text-[11px] uppercase tracking-[0.2em] text-zinc-600">
        Same company · same exit · different structure
      </p>

      {/* Shared inputs — identical in both scenarios, so they span the columns */}
      <h3 className="mt-10 font-mono text-[11px] uppercase tracking-[0.25em] text-zinc-500">
        Company Economics
      </h3>
      <div className="mt-3 rounded-xl border border-zinc-800 bg-zinc-900/40 p-6">
        <ArrCell />
      </div>

      <h3 className="mt-10 font-mono text-[11px] uppercase tracking-[0.25em] text-zinc-500">
        Enterprise Exit Value
      </h3>
      <div className="mt-3 rounded-xl border border-zinc-800 bg-zinc-900/40 px-6 py-10">
        <span className="block text-center font-mono text-6xl font-semibold tabular-nums text-zinc-100">
          {fmtM(exit, 0)}
        </span>
        <p className="mt-3 text-center font-mono text-[11px] uppercase tracking-[0.2em] text-zinc-600">
          {controls.exitMult}× ARR $13.2M
        </p>
      </div>

      {/* Column headers — everything below this point differs by scenario */}
      <div className="mt-12 grid grid-cols-2 gap-6">
        <div className="rounded-xl border border-zinc-800 bg-zinc-900/60 px-6 py-5">
          <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-zinc-500">
            Scenario A
          </p>
          <p className="mt-1 text-lg font-medium text-zinc-200">
            Today · operating group only
          </p>
        </div>
        <div className="rounded-xl border border-emerald-500/40 bg-emerald-500/[0.06] px-6 py-5">
          <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-emerald-400/80">
            Scenario B
          </p>
          <p className="mt-1 text-lg font-medium text-zinc-200">
            OperatingGroup + DomainCo
          </p>
        </div>
      </div>

      {/* Deal Value Allocation */}
      <h3 className="mt-10 font-mono text-[11px] uppercase tracking-[0.25em] text-zinc-500">
        Deal Value Allocation
      </h3>
      <div className="mt-3 grid grid-cols-2 items-stretch gap-6">
        <div className="rounded-xl border border-zinc-800 bg-zinc-900/40 p-6">
          <AllocationCell exit={exit} domainValue={0} opcoValue={exit} />
        </div>
        <div className="rounded-xl border border-emerald-500/20 bg-zinc-900/40 p-6">
          <AllocationCell
            exit={exit}
            domainValue={domainValue}
            opcoValue={opcoValue}
          />
        </div>
      </div>

      {/* Tax Treatment */}
      <h3 className="mt-10 font-mono text-[11px] uppercase tracking-[0.25em] text-zinc-500">
        Tax Treatment
      </h3>
      <div className="mt-3 grid grid-cols-2 items-stretch gap-6">
        <div className="rounded-xl border border-zinc-800 bg-zinc-900/40 p-6">
          <TaxCell
            exit={exit}
            domainValue={0}
            opcoValue={exit}
            domainTax={0}
            opcoTax={cmpTaxA}
          />
        </div>
        <div className="rounded-xl border border-emerald-500/20 bg-zinc-900/40 p-6">
          <TaxCell
            exit={exit}
            domainValue={domainValue}
            opcoValue={opcoValue}
            domainTax={domainTax}
            opcoTax={opcoTax}
          />
        </div>
      </div>

      {/* Post-Tax Proceeds */}
      <h3 className="mt-10 font-mono text-[11px] uppercase tracking-[0.25em] text-zinc-500">
        Post-Tax Proceeds
      </h3>
      <div className="mt-3 grid grid-cols-2 items-stretch gap-6">
        <div className="rounded-xl border border-zinc-800 bg-zinc-900/40 p-6">
          <ProceedsCell exit={exit} tax={cmpTaxA} />
        </div>
        <div className="rounded-xl border border-emerald-500/20 bg-zinc-900/40 p-6">
          <ProceedsCell exit={exit} tax={tax} />
        </div>
      </div>

      {/* Delta — centred against the two-line label, not baseline-locked to its first line */}
      <div className="mt-6 flex items-center justify-between rounded-xl border border-emerald-500/40 bg-emerald-500/[0.06] px-8 py-7">
        <div>
          <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-emerald-400/80">
            Scenario B advantage
          </p>
          <p className="mt-1 text-sm text-zinc-400">
            Additional proceeds kept after tax
          </p>
        </div>
        <AnimatedM
          value={cmpTaxA - tax}
          prefix="+"
          className="shrink-0 font-mono text-5xl font-semibold tabular-nums text-emerald-400"
        />
      </div>

      <p className="mt-6 font-mono text-[11px] leading-relaxed text-zinc-600">
        Scenario A taxes the whole deal at the ordinary 37% — with no DomainCo
        there is nothing to allocate to capital gains. Set the model on the
        Scenario B tab; this comparison follows it.
      </p>
    </>
  );
}


type TabId = "a" | "b" | "new" | "cmp";

const TABS: { id: TabId; kicker?: string; label: string }[] = [
  { id: "a", label: "Scenario A" },
  { id: "new", label: "Scenario B" },
  { id: "cmp", label: "Comparison" },
  { id: "b", label: "OpCo + DomainCo" },
];

export default function DemoPage() {
  const [unlocked, setUnlocked] = useState<boolean | null>(null);
  const [tab, setTab] = useState<TabId>("a");
  const [exitMult, setExitMult] = useState(4); // whole-number ARR multiple
  const [domainM, setDomainM] = useState(7.5); // $M
  const [marginA, setMarginA] = useState(60); // Scenario A operating margin %
  const [distA, setDistA] = useState(50); // Scenario A distribution %

  // New-scenario model — held here so the New and Comparison tabs stay in sync.
  const [nExitMult, setNExitMult] = useState(4);
  const [nMargin, setNMargin] = useState(60);
  const [nRoyaltyRate, setNRoyaltyRate] = useState(25);
  const [nDomainMult, setNDomainMult] = useState(8);
  const [nDistRate, setNDistRate] = useState(50);
  const newControls: NewControls = {
    exitMult: nExitMult,
    setExitMult: setNExitMult,
    margin: nMargin,
    setMargin: setNMargin,
    royaltyRate: nRoyaltyRate,
    setRoyaltyRate: setNRoyaltyRate,
    domainMult: nDomainMult,
    setDomainMult: setNDomainMult,
    distRate: nDistRate,
    setDistRate: setNDistRate,
  };

  useEffect(() => {
    try {
      setUnlocked(sessionStorage.getItem("demo-access") === "granted");
    } catch {
      setUnlocked(false);
    }
  }, []);

  const exit = exitMult * ARR;
  const domain = domainM * 1_000_000;

  // Scenario A
  const taxA = exit * TAX_RATE;
  const netA = exit - taxA;

  // Scenario A operating chain — no DomainCo, so one undivided stream.
  const opProfitA = ARR * (marginA / 100);
  const grossDistA = opProfitA * (distA / 100);
  const distTaxA = grossDistA * ORDINARY_RATE;

  // Scenario B — identical OpCo sale + DomainCo asset
  const domainGain = domain - DOMAIN_BASIS;
  const domainTax = domainGain * TAX_RATE;
  const domainNet = domain - DOMAIN_BASIS - domainTax;
  const netB = netA + domainNet;

  if (unlocked === null) {
    return <div className="h-dvh bg-zinc-950" />;
  }
  if (!unlocked) {
    return <AccessGate onUnlock={() => setUnlocked(true)} />;
  }

  return (
    <div className="flex h-dvh bg-zinc-950 text-zinc-100">
      {/* Tab rail */}
      <aside className="flex w-[260px] shrink-0 flex-col border-r border-zinc-800 bg-zinc-900/30">
        <div className="px-6 pt-8 pb-6">
          <p className="font-mono text-[11px] uppercase tracking-[0.25em] text-zinc-500">
            ColdEmail.com
          </p>
        </div>
        <nav className="flex flex-col gap-1 px-3">
          {TABS.map((t) => {
            const active = tab === t.id;
            return (
              <button
                key={t.id}
                onClick={() => setTab(t.id)}
                className={`rounded-lg px-4 py-3 text-left transition-colors ${
                  active
                    ? "bg-zinc-800/80 text-zinc-100"
                    : "text-zinc-500 hover:bg-zinc-800/40 hover:text-zinc-300"
                }`}
              >
                {t.kicker && (
                  <span className="block font-mono text-[10px] uppercase tracking-[0.2em] text-zinc-500">
                    {t.kicker}
                  </span>
                )}
                <span
                  className={`block text-sm font-medium ${
                    t.kicker ? "mt-0.5" : ""
                  }`}
                >
                  {t.label}
                </span>
              </button>
            );
          })}
        </nav>
      </aside>

      {/* Main */}
      <main className="flex-1 overflow-y-auto">
        <div className="mx-auto max-w-5xl px-8 pt-16 pb-40">
          <AnimatePresence mode="wait">
            {tab === "a" ? (
              <motion.div
                key="a"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.3 }}
              >
                <div className="flex items-center gap-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-lg border border-zinc-700 bg-zinc-900">
                    <Building2 className="h-4 w-4 text-zinc-400" />
                  </div>
                  <h1 className="text-xl font-medium text-zinc-200">
                    Scenario A
                  </h1>
                </div>

                {/* Company Economics */}
                <h2 className="mt-12 text-2xl font-semibold uppercase tracking-wide text-zinc-100">
                  Company Economics
                </h2>
                <div className="mt-4 rounded-xl border border-zinc-800 bg-zinc-900/40 p-7">
                  <div className="flex justify-center py-8">
                    <div className="flex h-64 w-64 flex-col items-center justify-center rounded-full border border-zinc-700 bg-zinc-900">
                      <span className="font-mono text-5xl font-semibold tabular-nums text-zinc-100">
                        $13.2M
                      </span>
                      <span className="mt-2 font-mono text-sm uppercase tracking-[0.2em] text-zinc-500">
                        ARR
                      </span>
                    </div>
                  </div>
                </div>

                {/* Entity Structure */}
                <h2 className="mt-12 text-2xl font-semibold uppercase tracking-wide text-zinc-100">
                  Entity Structure
                </h2>
                <div className="mt-4 rounded-xl border border-zinc-800 bg-zinc-900/40 p-7">
                  <div className="flex flex-col items-center">
                    {/* Master HoldCo */}
                    <div className="rounded-xl border border-zinc-700 bg-zinc-900 px-14 py-7 text-center">
                      <p className="text-xl font-medium text-zinc-100">
                        Master HoldCo.
                      </p>
                      <p className="mt-1 font-mono text-sm text-zinc-500">
                        S-Corp · Texas
                      </p>
                    </div>

                    {/* Connector */}
                    <div className="relative h-14 w-full max-w-[520px]">
                      <div className="absolute left-1/2 top-0 h-14 w-px bg-zinc-700" />
                    </div>

                    {/* OperatingGroup LLC — holds both operating entities */}
                    <div className="w-full max-w-[520px] rounded-xl border border-zinc-700 bg-zinc-900/60 p-5">
                      <p className="text-center text-xl font-medium text-zinc-100">
                        OperatingGroup LLC
                      </p>
                      <p className="mt-1 text-center font-mono text-sm text-zinc-500">
                        100%
                      </p>
                      <div className="mt-5 grid grid-cols-2 gap-4">
                        <div className="rounded-lg border border-zinc-800 bg-zinc-950/60 px-4 py-5 text-center">
                          <p className="text-base font-medium text-zinc-200">
                            LeadBird LLC
                          </p>
                          <p className="mt-1 font-mono text-xs text-zinc-500">
                            100%
                          </p>
                        </div>
                        <div className="rounded-lg border border-zinc-800 bg-zinc-950/60 px-4 py-5 text-center">
                          <p className="text-base font-medium text-zinc-200">
                            Cleverly LLC
                          </p>
                          <p className="mt-1 font-mono text-xs text-zinc-500">
                            % stake
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Net Operating Profit Margin */}
                <h2 className="mt-12 text-2xl font-semibold uppercase tracking-wide text-zinc-100">
                  Net Operating Profit Margin
                </h2>
                <PercentSliderCard
                  kicker="Operating margin"
                  value={marginA}
                  onChange={setMarginA}
                  footnote="Applied to ARR $13.2M"
                />

                {/* Operating Profit */}
                <h2 className="mt-12 text-2xl font-semibold uppercase tracking-wide text-zinc-100">
                  Operating Profit
                </h2>
                <div className="mt-4 rounded-xl border border-zinc-800 bg-zinc-900/40 px-14 py-16">
                  <LedgerRow label="ARR" value="$13.2M" />
                  <LedgerRow
                    label={`Net operating profit margin · ${marginA}%`}
                    value={`× ${marginA}%`}
                    muted
                  />
                  <div className="flex items-baseline justify-between pt-10">
                    <span className="text-2xl uppercase tracking-wider text-zinc-400">
                      Operating profit
                    </span>
                    <span className="font-mono text-5xl font-semibold tabular-nums text-zinc-100">
                      {fmtDollars(opProfitA)}
                    </span>
                  </div>
                </div>

                {/* Distribution */}
                <h2 className="mt-12 text-2xl font-semibold uppercase tracking-wide text-zinc-100">
                  Distribution
                </h2>
                <PercentSliderCard
                  kicker="% of operating profit distributed"
                  value={distA}
                  onChange={setDistA}
                />

                {/* Gross Distributions */}
                <h2 className="mt-12 text-2xl font-semibold uppercase tracking-wide text-zinc-100">
                  Gross Distributions
                </h2>
                <div className="mt-4 rounded-xl border border-zinc-800 bg-zinc-900/40 px-14 py-16">
                  <LedgerRow
                    label="Operating profit"
                    value={fmtDollars(opProfitA)}
                  />
                  <LedgerRow
                    label={`Distributed · ${distA}%`}
                    value={`× ${distA}%`}
                    muted
                  />
                  <div className="flex items-baseline justify-between pt-10">
                    <span className="text-2xl uppercase tracking-wider text-zinc-400">
                      Gross distributions
                    </span>
                    <span className="font-mono text-5xl font-semibold tabular-nums text-zinc-100">
                      {fmtDollars(grossDistA)}
                    </span>
                  </div>
                </div>

                {/* After-Tax Distributions */}
                <h2 className="mt-12 text-2xl font-semibold uppercase tracking-wide text-zinc-100">
                  After-Tax Distributions
                </h2>
                <div className="mt-4 rounded-xl border border-zinc-800 bg-zinc-900/40 px-14 py-16">
                  <LedgerRow
                    label="Gross distributions"
                    value={fmtDollars(grossDistA)}
                  />
                  <LedgerRow
                    label="Federal · Ordinary income 37%"
                    value={`−${fmtDollars(distTaxA)}`}
                    negative
                  />
                  <LedgerRow label="State · Texas 0%" value="−$0" muted />
                  <div className="flex items-baseline justify-between pt-10">
                    <span className="text-2xl uppercase tracking-wider text-zinc-400">
                      After-tax distributions
                    </span>
                    <span className="font-mono text-5xl font-semibold tabular-nums text-emerald-400">
                      {fmtDollars(grossDistA - distTaxA)}
                    </span>
                  </div>
                </div>

                {/* Enterprise Exit Value */}
                <h2 className="mt-12 text-2xl font-semibold uppercase tracking-wide text-zinc-100">
                  Enterprise Exit Value
                </h2>
                <div className="mt-4 rounded-xl border border-zinc-800 bg-zinc-900/40 px-12 py-14">
                  <div className="mx-auto max-w-2xl">
                    <AnimatedM
                      value={exit}
                      decimals={0}
                      className="block text-center font-mono text-7xl font-semibold tabular-nums text-zinc-100"
                    />
                    <Slider
                      className="mt-12 [&_[data-slot=slider-track]]:bg-zinc-800 [&_[data-slot=slider-range]]:bg-zinc-100 [&_[data-slot=slider-thumb]]:border-zinc-400"
                      min={2}
                      max={9}
                      step={0.1}
                      value={[exitMult]}
                      onValueChange={([v]) => setExitMult(v)}
                    />
                    <div className="relative mt-4 h-6">
                      {[2, 3, 4, 5, 6, 7, 8, 9].map((m) => {
                        const pct = ((m - 2) / (9 - 2)) * 100;
                        const active = m === exitMult;
                        return (
                          <button
                            key={m}
                            onClick={() => setExitMult(m)}
                            className={`absolute -translate-x-1/2 font-mono text-sm tabular-nums transition-colors ${
                              active
                                ? "text-zinc-100"
                                : "text-zinc-600 hover:text-zinc-300"
                            }`}
                            style={{ left: `${pct}%` }}
                          >
                            {m}×
                          </button>
                        );
                      })}
                    </div>
                    <p className="mt-6 text-center font-mono text-[11px] uppercase tracking-[0.2em] text-zinc-600">
                      Exit multiple · ARR $13.2M
                    </p>
                  </div>
                </div>

                {/* Tax Treatment */}
                <h2 className="mt-12 text-2xl font-semibold uppercase tracking-wide text-zinc-100">
                  Tax Treatment
                </h2>
                <div className="mt-4 rounded-xl border border-zinc-800 bg-zinc-900/40 px-14 py-16">
                  <LedgerRow
                    label="Enterprise exit value"
                    value={fmtM(exit, 0)}
                  />
                  <LedgerRow
                    label="Federal · Long-term capital gains 20%"
                    value={`−${fmtM(exit * 0.2)}`}
                    negative
                  />
                  <LedgerRow
                    label="Federal · Net investment income tax 3.8%"
                    value={`−${fmtM(exit * 0.038)}`}
                    negative
                  />
                  <LedgerRow label="State · Texas 0%" value="−$0" muted />
                  <div className="flex items-baseline justify-between pt-10">
                    <span className="text-2xl uppercase tracking-wider text-zinc-400">
                      Total tax burden
                    </span>
                    <AnimatedM
                      value={taxA}
                      prefix="−"
                      className="font-mono text-5xl font-semibold tabular-nums text-red-400/90"
                    />
                  </div>
                </div>

                {/* Post-Tax Proceeds */}
                <h2 className="mt-12 text-2xl font-semibold uppercase tracking-wide text-zinc-100">
                  Post-Tax Proceeds
                </h2>
                <div className="mt-4 rounded-xl border border-zinc-800 bg-zinc-900/40 px-8 py-10">
                  <div className="relative mx-auto h-[480px] w-[800px] max-w-full">
                    <PieChart width={800} height={480}>
                      <Pie
                        data={[
                          { name: "Net proceeds", value: netA },
                          { name: "Tax burden", value: taxA },
                        ]}
                        dataKey="value"
                        cx="50%"
                        cy="50%"
                        innerRadius={0}
                        outerRadius={190}
                        startAngle={90}
                        endAngle={-270}
                        stroke="none"
                        isAnimationActive={false}
                        labelLine={false}
                        label={renderProceedsLabel}
                      >
                        <Cell fill="#34d399" />
                        <Cell fill="#f87171" />
                      </Pie>
                    </PieChart>
                  </div>
                </div>

                <p className="mt-6 font-mono text-[11px] leading-relaxed text-zinc-600">
                  Federal only — long-term capital gains 20% + net investment
                  income tax 3.8% · Texas: no state income tax
                </p>
              </motion.div>
            ) : tab === "new" ? (
              <motion.div
                key="new"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.3 }}
              >
                <NewScenario controls={newControls} />
              </motion.div>
            ) : tab === "cmp" ? (
              <motion.div
                key="cmp"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.3 }}
              >
                <ComparisonScenario controls={newControls} />
              </motion.div>
            ) : (
              <motion.div
                key="b"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.3 }}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="flex h-9 w-9 items-center justify-center rounded-lg border border-emerald-500/40 bg-emerald-500/10">
                      <Globe className="h-4 w-4 text-emerald-400" />
                    </div>
                    <div>
                      <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-zinc-500">
                        Scenario B
                      </p>
                      <h1 className="text-xl font-medium text-zinc-200">
                        OpCo + DomainCo
                      </h1>
                    </div>
                  </div>
                  <div className="flex items-center gap-1.5 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3 py-1">
                    <TrendingUp className="h-3.5 w-3.5 text-emerald-400" />
                    <AnimatedM
                      value={domainNet}
                      prefix="+"
                      className="font-mono text-sm tabular-nums text-emerald-400"
                    />
                  </div>
                </div>

                <div className="mt-8">
                  <SliderBlock
                    label="ColdEmail.com asset value"
                    display={fmtM(domain)}
                    min={5}
                    max={10}
                    step={0.25}
                    value={domainM}
                    onChange={setDomainM}
                    minLabel="$5M"
                    maxLabel="$10M"
                  />
                </div>

                <div className="relative mt-6 rounded-xl border border-emerald-500/30 bg-zinc-900/40 p-7 overflow-hidden">
                  <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-emerald-500/[0.05] to-transparent" />
                  <LedgerRow
                    label="OpCo sale proceeds"
                    value={fmtM(exit, 0)}
                  />
                  <LedgerRow
                    label="Federal tax · LTCG 20% + NIIT 3.8%"
                    value={`−${fmtM(taxA)}`}
                    negative
                  />
                  <LedgerRow
                    label="DomainCo · ColdEmail.com"
                    value={fmtM(domain)}
                  />
                  <LedgerRow
                    label="Acquisition basis"
                    value={`−${fmtM(DOMAIN_BASIS)}`}
                    negative
                    muted
                  />
                  <LedgerRow
                    label="Federal tax on domain gain"
                    value={`−${fmtM(domainTax)}`}
                    negative
                  />
                  <div className="mt-8">
                    <p className="text-[13px] uppercase tracking-wider text-zinc-500">
                      Net proceeds
                    </p>
                    <AnimatedM
                      value={netB}
                      className="mt-1 block font-mono text-4xl md:text-[44px] font-semibold tabular-nums text-emerald-400"
                    />
                  </div>
                </div>

                {/* Comparison bars */}
                <div className="mt-6 rounded-xl border border-zinc-800 bg-zinc-900/40 p-7">
                  <div className="space-y-5">
                    <div>
                      <div className="flex items-baseline justify-between">
                        <span className="text-[13px] text-zinc-500">
                          Scenario A
                        </span>
                        <span className="font-mono text-sm tabular-nums text-zinc-300">
                          {fmtM(netA)}
                        </span>
                      </div>
                      <div className="mt-2 h-3 rounded-full bg-zinc-800/80 overflow-hidden">
                        <motion.div
                          className="h-full rounded-full bg-zinc-400"
                          animate={{ width: `${(netA / netB) * 100}%` }}
                          transition={{
                            type: "spring",
                            stiffness: 120,
                            damping: 24,
                          }}
                        />
                      </div>
                    </div>
                    <div>
                      <div className="flex items-baseline justify-between">
                        <span className="text-[13px] text-zinc-500">
                          Scenario B
                        </span>
                        <span className="font-mono text-sm tabular-nums text-emerald-400">
                          {fmtM(netB)}
                        </span>
                      </div>
                      <div className="mt-2 h-3 rounded-full bg-zinc-800/80 overflow-hidden">
                        <motion.div
                          className="h-full rounded-full bg-emerald-400"
                          animate={{ width: "100%" }}
                          transition={{
                            type: "spring",
                            stiffness: 120,
                            damping: 24,
                          }}
                        />
                      </div>
                    </div>
                  </div>
                </div>

                <p className="mt-6 font-mono text-[11px] leading-relaxed text-zinc-600">
                  Federal only — long-term capital gains 20% + net investment
                  income tax 3.8% · Texas: no state income tax
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </main>
    </div>
  );
}
