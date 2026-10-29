import { Clapperboard, Star } from 'lucide-react'
import { useState } from 'react'
import { Link } from 'react-router-dom'
import { cn } from '../../lib/cn'
import {
  genreNames,
  tmdbImageSrcSet,
  tmdbImageUrl,
} from './tmdb'
import type { DiscoveryMedia } from './tmdb-types'
import {
  formatRating,
  mediaTypeLabels,
} from './media-presentation'

const fallbackClasses: Record<DiscoveryMedia['type'], string> = {
  movie: 'from-amber-500/35 via-orange-500/10 to-cinema-bg',
  anime: 'from-cyan-500/35 via-sky-500/10 to-cinema-bg',
  series: 'from-violet-500/35 via-purple-500/10 to-cinema-bg',
}

export function MediaPosterCard({ media }: { media: DiscoveryMedia }) {
  const [failedUrl, setFailedUrl] = useState<string | null>(null)
  const posterUrl = tmdbImageUrl(media.posterPath, 'w500')
  const showPoster = Boolean(posterUrl) && failedUrl !== posterUrl
  const genres = genreNames(media.genreIds, media.kind).slice(0, 2)

  return (
    <article className="min-w-0">
      <Link
        to={`/media/${media.kind}/${media.id}`}
        className="group block focus-visible:outline-none"
        aria-label={`View details for ${media.title}`}
      >
        <div
          className={cn(
            'relative aspect-[2/3] overflow-hidden rounded-2xl border border-cinema-border bg-gradient-to-br',
            fallbackClasses[media.type],
          )}
        >
          {showPoster && posterUrl ? (
            <img
              src={posterUrl}
              srcSet={tmdbImageSrcSet(media.posterPath)}
              sizes="(min-width: 1280px) 16vw, (min-width: 1024px) 20vw, (min-width: 640px) 33vw, 50vw"
              alt={`${media.title} poster`}
              loading="lazy"
              decoding="async"
              onError={() => setFailedUrl(posterUrl)}
              className="size-full object-cover transition-transform duration-300 group-hover:scale-[1.03]"
            />
          ) : (
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 p-4 text-center">
              <Clapperboard
                aria-hidden="true"
                className="size-10 text-white/25"
                strokeWidth={1.25}
              />
              <span className="line-clamp-3 text-xs font-medium text-white/60">
                {media.title}
              </span>
            </div>
          )}

          <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_10%,rgba(255,255,255,0.12),transparent_50%)]" />

          <div className="absolute inset-x-0 top-0 flex items-start justify-between gap-2 p-2.5">
            <span className="rounded-full bg-black/55 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wide text-white/85 ring-1 ring-white/10 backdrop-blur-sm">
              {mediaTypeLabels[media.type]}
            </span>
            {media.rating > 0 ? (
              <span className="inline-flex items-center gap-1 rounded-full bg-black/55 px-2 py-1 text-[10px] font-semibold text-white/85 ring-1 ring-white/10 backdrop-blur-sm">
                <Star
                  aria-hidden="true"
                  className="size-3 fill-amber-300 text-amber-300"
                />
                {formatRating(media.rating)}
              </span>
            ) : null}
          </div>

          <div className="absolute inset-x-0 bottom-0 flex items-center justify-between gap-2 bg-gradient-to-t from-black/85 to-transparent p-3 pt-10">
            <span className="text-xs font-medium text-white/75">
              {media.year ?? 'Year TBA'}
            </span>
            <span className="text-[10px] uppercase tracking-wide text-white/50">
              TMDB
            </span>
          </div>
        </div>

        <h3 className="mt-3 line-clamp-2 text-sm font-semibold leading-5 text-cinema-text transition-colors group-hover:text-cinema-accent">
          {media.title}
        </h3>
        <p className="mt-1 line-clamp-1 text-xs text-cinema-muted">
          {genres.length > 0 ? genres.join(' · ') : 'Details on TMDB'}
        </p>
      </Link>
    </article>
  )
}
