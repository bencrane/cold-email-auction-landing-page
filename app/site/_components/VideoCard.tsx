import { Motif, type MotifFamily } from "./Motif";
import { Tag } from "./ui";

export type Video = {
  company: string;
  role: string;
  title: string;
  runtime: string;
  topic: string;
  family: MotifFamily;
};

function PlayGlyph() {
  return (
    <span className="flex h-14 w-14 items-center justify-center rounded-full border border-[var(--site-cream)]/50 bg-[var(--site-navy)]/70 backdrop-blur transition-transform group-hover:scale-105">
      <svg
        viewBox="0 0 24 24"
        aria-hidden="true"
        className="ml-0.5 h-5 w-5 fill-[var(--site-cream)]"
      >
        <path d="M8 5v14l11-7z" />
      </svg>
    </span>
  );
}

export function VideoCard({ video }: { video: Video }) {
  return (
    <article className="group flex flex-col overflow-hidden rounded-sm border border-[var(--site-rule)] bg-[var(--site-paper)] transition-colors hover:border-[var(--site-navy)]/40">
      <Motif seed={video.title} family={video.family} className="aspect-video">
        <div className="flex h-full items-center justify-center">
          <PlayGlyph />
        </div>
        <span className="absolute bottom-3 right-3 rounded-sm bg-[var(--site-navy)]/85 px-2 py-0.5 font-mono text-[11px] text-[var(--site-cream)]">
          {video.runtime}
        </span>
      </Motif>
      <div className="flex flex-1 flex-col p-5">
        <div className="flex items-center gap-2">
          <Tag tone="navy">{video.company}</Tag>
          <span className="text-[12px] text-[var(--site-muted)]">
            {video.role}
          </span>
        </div>
        <h3 className="mt-3 font-serif text-xl leading-snug text-[var(--site-navy)]">
          {video.title}
        </h3>
        <p className="mt-2 flex-1 text-[14px] leading-relaxed text-[var(--site-muted)]">
          {video.topic}
        </p>
      </div>
    </article>
  );
}
