import { BookHeart } from 'lucide-react'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Button } from '../components/ui/Button'
import { EmptyState } from '../components/ui/EmptyState'
import { ErrorState } from '../components/ui/ErrorState'
import { Skeleton } from '../components/ui/Skeleton'
import { useJournalActions } from '../features/journal/useJournalActions'
import { useMyJournal } from '../features/journal/useMyJournal'
import type { WatchlistStatus } from '../features/journal/journal-types'
import { tmdbImageUrl } from '../features/discovery/tmdb'

const STATUS_LABELS: Record<WatchlistStatus, string> = {
  plan_to_watch: 'Plan to watch',
  watching: 'Watching',
  completed: 'Completed',
  paused: 'Paused',
  dropped: 'Dropped',
}

function JournalSkeleton() {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {[1, 2, 3, 4, 5, 6].map((i) => (
        <Skeleton key={i} className="h-40 rounded-2xl" />
      ))}
    </div>
  )
}

export function JournalPage() {
  const { entries, loading, error, reload } = useMyJournal()
  const { removeFromJournal, saving } = useJournalActions()
  const [filter, setFilter] = useState<WatchlistStatus | 'all'>('all')
  const navigate = useNavigate()

  const filtered = filter === 'all' ? entries : entries.filter((e) => e.status === filter)

  async function handleRemove(id: string) {
    if (!confirm('Remove this from your journal?')) return
    await removeFromJournal(id)
    await reload()
  }

  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-12 sm:px-6 lg:px-8 lg:py-16">
      <header className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.4em] text-cinema-accent/80">
            Your library
          </p>
          <h1 className="mt-3 font-display text-3xl font-semibold tracking-tight text-cinema-text sm:text-4xl">
            Journal
          </h1>
          <p className="mt-2 max-w-2xl text-sm leading-7 text-cinema-muted">
            Track what you want to watch, are watching, completed, paused, or dropped.
          </p>
        </div>
      </header>

      <div className="mt-8 flex flex-wrap gap-2">
        <button
          onClick={() => setFilter('all')}
          className={`rounded-full px-3 py-1.5 text-xs ${
            filter === 'all'
              ? 'bg-cinema-accent/20 text-cinema-accent'
              : 'border border-cinema-border text-cinema-muted'
          }`}
        >
          All
        </button>
        {(Object.keys(STATUS_LABELS) as WatchlistStatus[]).map((status) => (
          <button
            key={status}
            onClick={() => setFilter(status)}
            className={`rounded-full px-3 py-1.5 text-xs ${
              filter === status
                ? 'bg-cinema-accent/20 text-cinema-accent'
                : 'border border-cinema-border text-cinema-muted'
            }`}
          >
            {STATUS_LABELS[status]}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="mt-8">
          <JournalSkeleton />
        </div>
      ) : error ? (
        <ErrorState title="Failed to load journal" description={error} onRetry={reload} className="mt-8" />
      ) : filtered.length === 0 ? (
        <EmptyState
          icon={BookHeart}
          title="Your journal is empty"
          description="Add titles from Discover or Media details to start tracking."
          action={
            <Button onClick={() => navigate('/discover')}>Browse discover</Button>
          }
          className="mt-8"
        />
      ) : (
        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((entry) => {
            const poster = tmdbImageUrl(entry.media?.poster_path, 'w342')
            return (
              <article
                key={entry.id}
                className="flex gap-4 rounded-2xl border border-cinema-border bg-cinema-surface/40 p-4"
              >
                <div className="h-28 w-20 overflow-hidden rounded-xl bg-cinema-surface-2">
                  {poster ? (
                    <img src={poster} alt={entry.media?.title} className="h-full w-full object-cover" />
                  ) : null}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <h3 className="line-clamp-1 text-sm font-semibold text-cinema-text">
                        {entry.media?.title}
                      </h3>
                      <p className="mt-1 text-xs text-cinema-muted">
                        {STATUS_LABELS[entry.status]}
                        {entry.rating ? ` • ${entry.rating}/10` : ''}
                        {entry.is_favorite ? ' • ★' : ''}
                      </p>
                    </div>
                    <button
                      onClick={() => void handleRemove(entry.id)}
                      disabled={saving}
                      className="text-xs text-cinema-muted hover:text-red-400"
                    >
                      Remove
                    </button>
                  </div>
                  {entry.personal_note ? (
                    <p className="mt-2 line-clamp-2 text-xs text-cinema-muted">{entry.personal_note}</p>
                  ) : null}
                </div>
              </article>
            )
          })}
        </div>
      )}
    </div>
  )
}
