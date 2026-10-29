import {
  Film,
  Search,
  SearchX,
  Sparkles,
  Tv,
  X,
} from 'lucide-react'
import { useState, type FormEvent } from 'react'
import { Button } from '../components/ui/Button'
import { EmptyState } from '../components/ui/EmptyState'
import { ErrorState } from '../components/ui/ErrorState'
import { buttonClasses } from '../components/ui/buttonStyles'
import { MediaGrid, MediaGridSkeleton } from '../features/discovery/MediaGrid'
import { TmdbAttribution } from '../features/discovery/TmdbAttribution'
import { TmdbConfigNotice } from '../features/discovery/TmdbConfigNotice'
import { isTmdbConfigured } from '../features/discovery/tmdb'
import type { DiscoverCategory } from '../features/discovery/tmdb-types'
import { useDiscoverFeed } from '../features/discovery/useDiscoverFeed'

const categories: {
  id: DiscoverCategory
  label: string
  description: string
  icon: typeof Film
}[] = [
  {
    id: 'movies',
    label: 'Movies',
    description: 'Popular movies on TMDB right now.',
    icon: Film,
  },
  {
    id: 'anime',
    label: 'Anime',
    description:
      'Japanese-language animation, approximated from TMDB metadata.',
    icon: Sparkles,
  },
  {
    id: 'series',
    label: 'Series',
    description:
      'Popular non-animation series on TMDB right now.',
    icon: Tv,
  },
]

export function DiscoverPage() {
  const [category, setCategory] = useState<DiscoverCategory>('movies')
  const [searchInput, setSearchInput] = useState('')
  const [activeQuery, setActiveQuery] = useState('')

  const {
    items,
    page,
    totalPages,
    loading,
    loadingMore,
    error,
    moreError,
    hasMore,
    loadMore,
    retry,
  } = useDiscoverFeed(category, activeQuery)

  const searching = activeQuery.length > 0
  const activeCategory =
    categories.find((item) => item.id === category) ?? categories[0]

  function handleSearch(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setActiveQuery(searchInput.trim())
  }

  function clearSearch() {
    setSearchInput('')
    setActiveQuery('')
  }

  function selectCategory(nextCategory: DiscoverCategory) {
    setCategory(nextCategory)
    setSearchInput('')
    setActiveQuery('')
  }

  return (
    <div className="mx-auto w-full max-w-7xl px-4 py-12 sm:px-6 lg:px-8 lg:py-16">
      <p className="text-xs font-semibold uppercase tracking-[0.2em] text-cinema-accent">
        Discover
      </p>
      <h1 className="mt-3 max-w-3xl font-display text-3xl font-semibold tracking-tight text-cinema-text sm:text-4xl lg:text-5xl">
        Find your next story
      </h1>
      <p className="mt-3 max-w-2xl text-sm leading-6 text-cinema-muted sm:text-base">
        Search movies, anime, and series, then open a title for the details.
        Journal actions arrive in Milestone 5.
      </p>

      {!isTmdbConfigured ? (
        <div className="mt-8">
          <TmdbConfigNotice />
        </div>
      ) : (
        <>
          <form
            onSubmit={handleSearch}
            role="search"
            aria-label="Search TMDB"
            className="mt-8 flex flex-col gap-3 sm:flex-row"
          >
            <label htmlFor="discovery-search" className="sr-only">
              Search movies, anime, and series
            </label>
            <div className="relative flex-1">
              <Search
                aria-hidden="true"
                className="pointer-events-none absolute left-4 top-1/2 size-4 -translate-y-1/2 text-cinema-muted"
              />
              <input
                id="discovery-search"
                type="search"
                value={searchInput}
                onChange={(event) => setSearchInput(event.target.value)}
                placeholder="Search movies, anime, and series"
                autoComplete="off"
                className="h-11 w-full rounded-full border border-cinema-border bg-cinema-surface pl-11 pr-11 text-sm text-cinema-text placeholder:text-cinema-muted/60 focus:border-cinema-accent focus:outline-none"
              />
              {searchInput ? (
                <button
                  type="button"
                  onClick={clearSearch}
                  aria-label="Clear search"
                  className="absolute right-3 top-1/2 flex size-7 -translate-y-1/2 items-center justify-center rounded-full text-cinema-muted transition-colors hover:bg-white/10 hover:text-cinema-text"
                >
                  <X aria-hidden="true" className="size-4" />
                </button>
              ) : null}
            </div>
            <Button type="submit">Search</Button>
          </form>

          <div
            role="group"
            aria-label="Browse category"
            className="mt-6 flex flex-wrap items-center gap-2"
          >
            {categories.map(({ id, label, icon: Icon }) => (
              <button
                key={id}
                type="button"
                aria-pressed={!searching && category === id}
                onClick={() => selectCategory(id)}
                className={buttonClasses(
                  !searching && category === id ? 'primary' : 'secondary',
                  'sm',
                )}
              >
                <Icon aria-hidden="true" className="size-4" />
                {label}
              </button>
            ))}
          </div>

          <div className="mt-8 flex flex-col gap-2 border-b border-cinema-border pb-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <h2 className="font-display text-xl font-semibold text-cinema-text">
                {searching
                  ? `Results for “${activeQuery}”`
                  : activeCategory.label}
              </h2>
              <p className="mt-1 text-sm text-cinema-muted">
                {searching
                  ? 'Searching across movies and TV on TMDB.'
                  : activeCategory.description}
              </p>
            </div>
            {!loading && !error ? (
              <p className="text-xs text-cinema-muted/70">
                {items.length} title{items.length === 1 ? '' : 's'} loaded
                {hasMore ? ' · more available' : ''}
              </p>
            ) : null}
          </div>

          <div className="mt-6">
            {loading ? (
              <MediaGridSkeleton />
            ) : error ? (
              <ErrorState
                title="Discovery could not load"
                description={error}
                onRetry={retry}
              />
            ) : items.length === 0 ? (
              <EmptyState
                icon={searching ? SearchX : Film}
                title={
                  searching
                    ? 'No matching titles'
                    : 'Nothing to show right now'
                }
                description={
                  searching
                    ? 'Try a shorter search or a different spelling.'
                    : 'TMDB returned no titles for this category. Try another category or reload the page.'
                }
                action={
                  searching ? (
                    <button
                      type="button"
                      onClick={clearSearch}
                      className={buttonClasses('secondary', 'md')}
                    >
                      Clear search
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={retry}
                      className={buttonClasses('secondary', 'md')}
                    >
                      Try again
                    </button>
                  )
                }
              />
            ) : (
              <>
                <MediaGrid items={items} />

                {moreError ? (
                  <div
                    role="alert"
                    className="mt-6 rounded-2xl border border-red-400/25 bg-red-400/5 p-4 text-sm leading-6 text-red-300"
                  >
                    <p>{moreError}</p>
                    <button
                      type="button"
                      onClick={() => {
                        void loadMore()
                      }}
                      className={buttonClasses('secondary', 'sm', 'mt-3')}
                    >
                      Retry loading more
                    </button>
                  </div>
                ) : null}

                {hasMore && !moreError ? (
                  <div className="mt-10 flex justify-center">
                    <Button
                      variant="secondary"
                      onClick={() => {
                        void loadMore()
                      }}
                      disabled={loadingMore}
                    >
                      {loadingMore
                        ? 'Loading…'
                        : `Load more · page ${page + 1} of ${totalPages}`}
                    </Button>
                  </div>
                ) : null}
              </>
            )}
          </div>
        </>
      )}

      <TmdbAttribution className="mt-12 border-t border-cinema-border pt-4" />
    </div>
  )
}
