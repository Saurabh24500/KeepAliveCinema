import { Clapperboard } from 'lucide-react'
import { cn } from '../../lib/cn'
import type {
  MediaSummary,
  MediaType,
  PosterTone,
} from '../../types/media'

const toneClasses: Record<PosterTone, string> = {
  violet: 'from-violet-500/45 via-purple-500/15 to-cinema-bg',
  rose: 'from-rose-500/40 via-pink-500/15 to-cinema-bg',
  cyan: 'from-cyan-500/40 via-sky-500/15 to-cinema-bg',
  amber: 'from-amber-500/40 via-orange-500/15 to-cinema-bg',
  emerald: 'from-emerald-500/40 via-teal-500/15 to-cinema-bg',
  slate: 'from-slate-400/35 via-slate-500/15 to-cinema-bg',
}

const typeLabels: Record<MediaType, string> = {
  movie: 'Movie',
  anime: 'Anime',
  series: 'Series',
}

export function MediaCard({ media }: { media: MediaSummary }) {
  return (
    <article className="w-40 shrink-0 sm:w-44 lg:w-48">
      <div
        className={cn(
          'relative aspect-[2/3] overflow-hidden rounded-2xl border border-cinema-border bg-gradient-to-br',
          toneClasses[media.tone],
        )}
      >
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_15%,rgba(255,255,255,0.2),transparent_55%)]" />
        <div className="absolute inset-0 flex items-center justify-center">
          <Clapperboard
            aria-hidden="true"
            className="size-12 text-white/25"
            strokeWidth={1.25}
          />
        </div>
        <div className="absolute inset-x-0 bottom-0 flex items-center justify-between gap-2 bg-gradient-to-t from-black/80 to-transparent p-3 pt-8">
          <span className="rounded-full bg-black/40 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wide text-white/80 ring-1 ring-white/10">
            {typeLabels[media.type]}
          </span>
          <span className="text-xs font-medium text-white/70">
            {media.year}
          </span>
        </div>
      </div>
      <h3 className="mt-3 line-clamp-2 text-sm font-semibold leading-5 text-cinema-text">
        {media.title}
      </h3>
      <p className="mt-1 text-xs text-cinema-muted">{media.genre}</p>
    </article>
  )
}
