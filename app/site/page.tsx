export default function SitePage() {
  return (
    <main className="mx-auto flex min-h-dvh max-w-3xl flex-col justify-center px-8 py-24">
      <p className="font-mono text-[11px] uppercase tracking-[0.25em] text-zinc-400">
        /site
      </p>
      <h1 className="mt-4 text-4xl font-medium tracking-tight">
        Blank slate.
      </h1>
      <p className="mt-4 max-w-xl text-lg leading-relaxed text-zinc-600">
        Prototype surface, isolated from the landing page and{" "}
        <code className="font-mono text-base">/demo</code>. Nothing here is
        shared with either, so it can go anywhere without regression risk.
      </p>
    </main>
  );
}
