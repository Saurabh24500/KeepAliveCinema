import {
  ArrowLeft,
  CalendarDays,
  Clapperboard,
  Clock3,
  ExternalLink,
  Film,
  SearchX,
  Star,
  Tv,
} from 'lucide-react'
import { useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { Button } from '../components/ui/Button'
import { Card } from '../components/ui/Card'
import { EmptyState } from '../components/ui/EmptyState'
import { ErrorState } from '../components/ui/ErrorState'
import { Skeleton } from '../components/ui/Skeleton'
import { buttonClasses } from '../components/ui/buttonStyles'
import { TmdbAttribution } from '../features/discovery/TmdbAttribution'
import { TmdbConfigNotice } from '../features/discovery/TmdbConfigNotice'
import {
  formatRating,
  formatRuntime,
  mediaTypeLabels,
} from '../features/discovery/media-presentation'
import {
  genreNames,
  isTmdbConfigured,
  tmdbImageUrl,
} from '../features/discovery/tmdb'
import { useMediaDetail } from '../features/discovery/useMediaDetail'
import { useJournalActions } from '../features/journal/useJournalActions'
import { useAuth } from '../features/auth/auth-context'

function formatDate(date: string): string | null {
  if (!date) return null

  const [year, month, day] = date.split('-').map(Number)
  if (!year || !month || !day) return null

  return new Date(Date.UTC(year, month - 1, day)).toLocaleDateString(
    undefined,
    {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      timeZone: 'UTC',
    },
  )
}

function DetailSkeleton() {
  return (
    <div className="mt-6 overflow-hidden rounded-[2rem] border border-cinema-border bg-cinema-surface/50">
      <div className="grid gap-6 p-5 sm:p-8 md:grid-cols-[14rem_1fr] lg:grid-cols-[16rem_1fr]">
        <Skeleton className="aspect-[2/3] w-full max-w-64 rounded-2xl" />
        <div className="space-y-4">
          <Skeleton className="h-5 w-40" />
          <Skeleton className="h-10 w-4/5" />
          <Skeleton className="h-4 w-2/3" />
          <div className="flex gap-3 pt-2">
            <Skeleton className="h-9 w-28 rounded-full" />
            <Skeleton className="h-9 w-24 rounded-full" />
            <Skeleton className="h-9 w-24 rounded-full" />
          </div>
          <Skeleton className="h-24 w-full" />
          <Skeleton className="h-4 w-3/4" />
          <Skeleton className="h-4 w-2/3" />
        </div>
      </div>
    </div>
  )
}

function InvalidMedia() {
  return (
    <div className="mx-auto w-full max-w-3xl px-4 py-14 sm:px-6">
      <EmptyState
        icon={SearchX}
        title="That title link is not valid"
        description="The media type or TMDB ID in this URL is not recognized."
        action={
          <Link to="/discover" className={buttonClasses('primary', 'md')}>
            Back to discover
          </Link>
        }
      />
    </div>
  )
}

export function MediaDetailPage() {
  const { mediaType, id } = useParams()
  const navigate = useNavigate()
  const kind =
    mediaType === 'movie' || mediaType === 'tv' ? mediaType : null
  const numericId =
    id && /^\d+$/.test(id) ? Number(id) : null
  const { media, loading, error, retry } = useMediaDetail(kind, numericId)
  const [failedPosterUrl, setFailedPosterUrl] = useState<string | null>(null)
  const [failedBackdropUrl, setFailedBackdropUrl] = useState<string | null>(null)
  const posterUrl = tmdbImageUrl(media?.posterPath, 'w500')
  const backdropUrl = tmdbImageUrl(media?.backdropPath, 'w1280')
  const { user } = useAuth()
  const { addToJournal, saving } = useJournalActions()
  const [added, setAdded] = useState(false)

  if (!kind || !numericId) {
    return <InvalidMedia />
  }

  const backLink = (
    <Link
      to="/discover"
      className="inline-flex items-center gap-2 text-sm font-medium text-cinema-muted transition-colors hover:text-cinema-text"
    >
      <ArrowLeft aria-hidden="true" className="size-4" />
      Back to discover
    </Link>
  )

  if (!isTmdbConfigured) {
    return (
      <div className="mx-auto w-full max-w-5xl px-4 py-12 sm:px-6 lg:px-8 lg:py-16">
        {backLink}
        <div className="mt-8">
          <TmdbConfigNotice />
        </div>
      </div>
    )
  }

  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-12 sm:px-6 lg:px-8 lg:py-16">
      {backLink}

      {loading ? (
        <DetailSkeleton />
      ) : error ? (
        <ErrorState
          title="Title details could not load"
          description={error}
          onRetry={retry}
          className="mt-6"
        />
      ) : !media ? (
        <EmptyState
          icon={SearchX}
          title="Title not found"
          description="TMDB did not return a title for this link. It may have been removed or the ID may be wrong."
          className="mt-6"
          action={
            <Link to="/discover" className={buttonClasses('secondary', 'md')}>
              Back to discover
            </Link>
          }
        />
      ) : (
        <>
          <article className="relative mt-6 overflow-hidden rounded-[2rem] border border-cinema-border bg-cinema-surface/50">
            {backdropUrl && failedBackdropUrl !== backdropUrl ? (
              <img
                src={backdropUrl}
                alt=""
                aria-hidden="true"
                loading="lazy"
                decoding="async"
                onError={() => setFailedBackdropUrl(backdropUrl)}
                className="absolute inset-0 size-full object-cover opacity-25"
              />
            ) : null}
            <div
              aria-hidden="true"
              className="absolute inset-0 bg-gradient-to-t from-cinema-bg via-cinema-bg/85 to-cinema-bg/20"
            />

            <div className="relative grid gap-6 p-5 sm:p-8 md:grid-cols-[14rem_1fr] lg:grid-cols-[16rem_1fr] lg:gap-10">
              <div className="relative aspect-[2/3] w-full max-w-64 overflow-hidden rounded-2xl border border-cinema-border bg-gradient-to-br from-cinema-accent/25 via-cinema-surface-2 to-cinema-bg">
                {posterUrl && failedPosterUrl !== posterUrl ? (
                  <img
                    src={posterUrl}
                    alt={`${media.title} poster`}
                    loading="lazy"
                    decoding="async"
                    onError={() => setFailedPosterUrl(posterUrl)}
                    className="size-full object-cover"
                  />
                ) : (
                  <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 p-5 text-center">
                    <Clapperboard
                      aria-hidden="true"
                      className="size-12 text-white/25"
                      strokeWidth={1.25}
                    />
                    <span className="text-xs font-medium text-white/60">
                      Poster not available
                    </span>
                  </div>
                )}
              </div>

              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-2 text-xs">
                  <span className="inline-flex items-center gap-1.5 rounded-full border border-cinema-accent/30 bg-cinema-accent/10 px-2.5 py-1 font-semibold uppercase tracking-wide text-cinema-accent">
                    {media.kind === 'movie' ? (
                      <Film aria-hidden="true" className="size-3.5" />
                    ) : (
                      <Tv aria-hidden="true" className="size-3.5" />
                    )}
                    {mediaTypeLabels[media.type]}
                  </span>
                  {media.year ? (
                    <span className="rounded-full border border-cinema-border bg-cinema-bg/60 px-2.5 py-1 text-cinema-muted">
                      {media.year}
                    </span>
                  ) : null}
                  {media.rating > 0 ? (
                    <span className="inline-flex items-center gap-1 rounded-full border border-amber-300/20 bg-amber-300/10 px-2.5 py-1 text-amber-200">
                      <Star
                        aria-hidden="true"
                        className="size-3.5 fill-amber-300 text-amber-300"
                      />
                      {formatRating(media.rating)}
                      <span className="text-amber-200/60">
                        ({media.voteCount.toLocaleString()})
                      </span>
                    </span>
                  ) : null}
                </div>

                <h1 className="mt-4 font-display text-3xl font-semibold leading-tight tracking-tight text-cinema-text sm:text-4xl lg:text-5xl">
                  {media.title}
                </h1>
                {media.tagline ? (
                  <p className="mt-3 text-base italic leading-7 text-cinema-accent/90">
                    {media.tagline}
                  </p>
                ) : null}

                <div className="mt-5 flex flex-wrap gap-x-5 gap-y-2 text-sm text-cinema-muted">
                  {formatDate(media.date) ? (
                    <span className="inline-flex items-center gap-2">
                      <CalendarDays
                        aria-hidden="true"
                        className="size-4 text-cinema-accent"
                      />
                      {formatDate(media.date)}
                    </span>
                  ) : null}
                  {media.kind === 'movie' && formatRuntime(media.runtimeMinutes) ? (
                    <span className="inline-flex items-center gap-2">
                      <Clock3
                        aria-hidden="true"
                        className="size-4 text-cinema-accent"
                      />
                      {formatRuntime(media.runtimeMinutes)}
                    </span>
                  ) : null}
                  {media.kind === 'tv' && media.seasonCount ? (
                    <span className="inline-flex items-center gap-2">
                      <Tv
                        aria-hidden="true"
                        className="size-4 text-cinema-accent"
                      />
                      {media.seasonCount} season
                      {media.seasonCount === 1 ? '' : 's'}
                      {media.episodeCount
                        ? ` · ${media.episodeCount} episodes`
                        : ''}
                    </span>
                  ) : null}
                  <span>{media.status}</span>
                  {media.originalLanguage ? (
                    <span className="uppercase">
                      {media.originalLanguage}
                    </span>
                  ) : null}
                </div>

                {media.overview ? (
                  <p className="mt-6 max-w-3xl text-sm leading-7 text-cinema-muted sm:text-base">
                    {media.overview}
                  </p>
                ) : (
                  <p className="mt-6 max-w-3xl text-sm leading-7 text-cinema-muted">
                    TMDB does not have an overview for this title yet.
                  </p>
                )}

                {media.genres.length > 0 ? (
                  <ul className="mt-6 flex flex-wrap gap-2">
                    {media.genres.map((genre) => (
                      <li
                        key={genre.id}
                        className="rounded-full border border-cinema-border bg-cinema-bg/60 px-3 py-1.5 text-xs text-cinema-muted"
                      >
                        {genre.name}
                      </li>
                    ))}
                  </ul>
                ) : genreNames(media.genreIds, media.kind).length > 0 ? (
                  <ul className="mt-6 flex flex-wrap gap-2">
                    {genreNames(media.genreIds, media.kind).map((genre) => (
                      <li
                        key={genre}
                        className="rounded-full border border-cinema-border bg-cinema-bg/60 px-3 py-1.5 text-xs text-cinema-muted"
                      >
                        {genre}
                      </li>
                    ))}
                  </ul>
                ) : null}

                <div className="mt-8 flex flex-wrap items-center gap-3 border-t border-cinema-border pt-6">
                  {user ? (
                    <>
                      <Button
                        disabled={saving || added}
                        onClick={async () => {
                          if (!media) return
                          try {
                            await addToJournal({
                              tmdb_id: media.id,
                              media_type: media.kind === 'movie' ? 'movie' : media.type === 'anime' ? 'anime' : 'series',
                              title: media.title,
                              poster_path: media.posterPath,
                              backdrop_path: media.backdropPath,
                              release_date: media.date || null,
                              overview: media.overview,
                              original_language: media.originalLanguage,
                              status: 'plan_to_watch',
                            })
                            setAdded(true)
                          } catch {
                            // ignore
                          }
                        }}
                      >
                        {added ? 'Added to journal' : saving ? 'Saving...' : 'Add to journal (Plan to watch)'}
                      </Button>
                      {added ? (
                        <Button variant="ghost" size="sm" onClick={() => navigate('/journal')}>
                          View journal
                        </Button>
                      ) : null}
                    </>
                  ) : (
                    <Button onClick={() => navigate('/signin')}>Sign in to add to journal</Button>
                  )}
                  <a
                    href={`https://www.themoviedb.org/${media.kind}/${media.id}`}
                    target="_blank"
                    rel="noreferrer"
                    className={buttonClasses('ghost', 'sm')}
                  >
                    View on TMDB
                    <ExternalLink aria-hidden="true" className="size-3.5" />
                  </a>
                </div>
              </div>
            </div>
          </article>

          <Card className="mt-6 bg-cinema-surface/30">
            <p className="text-xs leading-5 text-cinema-muted/80">
              Metadata and images come from TMDB. Anime is approximated from
              Japanese-language animation and may miss titles that TMDB
              classifies differently.
            </p>
          </Card>

          <TmdbAttribution className="mt-8 border-t border-cinema-border pt-4" />
        </>
      )}
    </div>
  )
}
