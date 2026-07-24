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
import { Building2, Globe, TrendingUp } from "lucide-react";

const TAX_RATE = 0.238; // Federal LTCG 20% + NIIT 3.8%
const DOMAIN_BASIS = 1_000_000;
const ARR = 13_200_000;

function fmtM(v: number, decimals = 1) {
  return `$${(v / 1_000_000).toFixed(decimals)}M`;
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
    <div className="flex items-baseline justify-between py-2.5 border-b border-zinc-800/60">
      <span
        className={`text-[13px] tracking-wide ${
          muted ? "text-zinc-500" : "text-zinc-400"
        }`}
      >
        {label}
      </span>
      <span
        className={`font-mono text-sm tabular-nums ${
          negative ? "text-red-400/90" : "text-zinc-200"
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

// Recharts pie label: name above amount, anchored outside the slice
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function renderProceedsLabel(props: any) {
  const { cx, cy, midAngle, outerRadius, name, value, index } = props;
  const RADIAN = Math.PI / 180;
  const r = outerRadius + 36;
  const x = cx + r * Math.cos(-midAngle * RADIAN);
  const y = cy + r * Math.sin(-midAngle * RADIAN);
  const anchor = x > cx ? "start" : "end";
  const color = index === 0 ? "#34d399" : "#f87171";
  return (
    <text textAnchor={anchor} fill={color}>
      <tspan
        x={x}
        y={y - 10}
        fill="#a1a1aa"
        fontSize={15}
        fontFamily="var(--font-inter)"
      >
        {name}
      </tspan>
      <tspan
        x={x}
        y={y + 16}
        fontSize={20}
        fontWeight={600}
        fontFamily="var(--font-geist-mono)"
      >
        {`${index === 1 ? "−" : ""}$${(value / 1_000_000).toFixed(1)}M`}
      </tspan>
    </text>
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

type TabId = "a" | "b";

const TABS: { id: TabId; kicker: string; label: string }[] = [
  { id: "a", kicker: "Scenario A", label: "Today" },
  { id: "b", kicker: "Scenario B", label: "OpCo + DomainCo" },
];

export default function DemoPage() {
  const [unlocked, setUnlocked] = useState<boolean | null>(null);
  const [tab, setTab] = useState<TabId>("a");
  const [exitM, setExitM] = useState(50); // $M
  const [domainM, setDomainM] = useState(7.5); // $M

  useEffect(() => {
    try {
      setUnlocked(sessionStorage.getItem("demo-access") === "granted");
    } catch {
      setUnlocked(false);
    }
  }, []);

  const exit = exitM * 1_000_000;
  const domain = domainM * 1_000_000;

  // Scenario A
  const taxA = exit * TAX_RATE;
  const netA = exit - taxA;

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
                <span className="block font-mono text-[10px] uppercase tracking-[0.2em] text-zinc-500">
                  {t.kicker}
                </span>
                <span className="mt-0.5 block text-sm font-medium">
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
                  <div>
                    <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-zinc-500">
                      Scenario A
                    </p>
                    <h1 className="text-xl font-medium text-zinc-200">
                      Today
                    </h1>
                  </div>
                </div>

                {/* Entity Structure */}
                <h2 className="mt-10 text-[13px] uppercase tracking-wider text-zinc-500">
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

                    {/* Connectors */}
                    <div className="relative h-14 w-full max-w-[640px]">
                      <div className="absolute left-1/2 top-0 h-7 w-px bg-zinc-700" />
                      <div className="absolute top-7 left-[25%] right-[25%] h-px bg-zinc-700" />
                      <div className="absolute left-[25%] top-7 h-7 w-px bg-zinc-700" />
                      <div className="absolute left-[75%] top-7 h-7 w-px bg-zinc-700" />
                    </div>

                    {/* Subsidiaries */}
                    <div className="grid w-full max-w-[640px] grid-cols-2 gap-10">
                      <div className="rounded-xl border border-zinc-700 bg-zinc-900 px-6 py-7 text-center">
                        <p className="text-xl font-medium text-zinc-100">
                          Leadbird LLC
                        </p>
                        <p className="mt-1 font-mono text-sm text-zinc-500">
                          100%
                        </p>
                      </div>
                      <div className="rounded-xl border border-zinc-700 bg-zinc-900 px-6 py-7 text-center">
                        <p className="text-xl font-medium text-zinc-100">
                          Cleverly LLC
                        </p>
                        <p className="mt-1 font-mono text-sm text-zinc-500">
                          % stake
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Company Economics */}
                <h2 className="mt-10 text-[13px] uppercase tracking-wider text-zinc-500">
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

                {/* Divider */}
                <div className="mt-10 h-px bg-zinc-800" />

                {/* Exit Economics */}
                <h2 className="mt-10 text-[13px] uppercase tracking-wider text-zinc-500">
                  Exit Economics
                </h2>
                <div className="mt-4 rounded-xl border border-zinc-800 bg-zinc-900/40 px-12 py-20">
                  <div className="flex items-center gap-20">
                    <div className="flex-1">
                      <label className="text-[13px] uppercase tracking-wider text-zinc-500">
                        Exit multiple
                      </label>
                      <Slider
                        className="mt-8 [&_[data-slot=slider-track]]:bg-zinc-800 [&_[data-slot=slider-range]]:bg-zinc-100 [&_[data-slot=slider-thumb]]:border-zinc-400"
                        min={30}
                        max={75}
                        step={1}
                        value={[exitM]}
                        onValueChange={([v]) => setExitM(v)}
                      />
                      <div className="relative mt-4 h-6">
                        {[3, 4, 5].map((m) => {
                          const valM = (m * ARR) / 1_000_000;
                          const pct = ((valM - 30) / (75 - 30)) * 100;
                          return (
                            <button
                              key={m}
                              onClick={() => setExitM(Math.round(valM))}
                              className="absolute -translate-x-1/2 font-mono text-sm tabular-nums text-zinc-600 transition-colors hover:text-zinc-300"
                              style={{ left: `${pct}%` }}
                            >
                              {m}×
                            </button>
                          );
                        })}
                      </div>
                    </div>
                    <div className="shrink-0 text-right">
                      <p className="text-[13px] uppercase tracking-wider text-zinc-500">
                        Enterprise exit value
                      </p>
                      <AnimatedM
                        value={exit}
                        decimals={0}
                        className="mt-3 block font-mono text-7xl font-semibold tabular-nums text-zinc-100"
                      />
                      <p className="mt-3 font-mono text-xl tabular-nums text-zinc-400">
                        {(exit / ARR).toFixed(1)}× ARR
                      </p>
                    </div>
                  </div>
                </div>

                {/* Post-Tax Proceeds */}
                <h2 className="mt-10 text-[13px] uppercase tracking-wider text-zinc-500">
                  Post-Tax Proceeds
                </h2>
                <div className="mt-4 rounded-xl border border-zinc-800 bg-zinc-900/40 px-8 py-10">
                  <div className="relative mx-auto h-[480px] w-[800px] max-w-full">
                    <PieChart width={800} height={480}>
                      <Pie
                        data={[
                          { name: "Net proceeds", value: netA },
                          { name: "Federal tax", value: taxA },
                        ]}
                        dataKey="value"
                        cx="50%"
                        cy="50%"
                        innerRadius={130}
                        outerRadius={180}
                        startAngle={90}
                        endAngle={-270}
                        stroke="none"
                        isAnimationActive={false}
                        labelLine={{ stroke: "#52525b", strokeWidth: 1 }}
                        label={renderProceedsLabel}
                      >
                        <Cell fill="#34d399" />
                        <Cell fill="#f87171" />
                      </Pie>
                    </PieChart>
                    <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
                      <AnimatedM
                        value={exit}
                        decimals={0}
                        className="font-mono text-5xl font-semibold tabular-nums text-zinc-100"
                      />
                      <span className="mt-2 font-mono text-sm uppercase tracking-[0.2em] text-zinc-500">
                        Exit value
                      </span>
                    </div>
                  </div>
                </div>

                <p className="mt-6 font-mono text-[11px] leading-relaxed text-zinc-600">
                  Federal only — long-term capital gains 20% + net investment
                  income tax 3.8% · Texas: no state income tax
                </p>
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
