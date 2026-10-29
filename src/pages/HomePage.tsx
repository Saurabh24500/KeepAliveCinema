import {
  ArrowRight,
  BookHeart,
  Bookmark,
  Clapperboard,
  ShieldCheck,
  Sparkles,
  Star,
} from 'lucide-react'
import { Link } from 'react-router-dom'
import { MediaRow } from '../components/media/MediaRow'
import { buttonClasses } from '../components/ui/buttonStyles'
import { Card } from '../components/ui/Card'
import { sampleRows } from '../features/discovery/sampleMedia'

const plannedFeatures = [
  {
    icon: BookHeart,
    title: 'A journal that remembers',
    description:
      'Save what you want to watch, mark progress, rate titles, and keep a short memory for the stories that mattered.',
    milestone: 'Milestone 5',
  },
  {
    icon: ShieldCheck,
    title: 'Community without spoilers',
    description:
      'Share thoughts, hide spoilers behind a deliberate reveal, and keep discussion tied to the titles you love.',
    milestone: 'Milestone 6',
  },
  {
    icon: Sparkles,
    title: 'A deliberate release',
    description:
      'Responsive and accessibility passes, performance checks, deployment, and a production smoke test before calling the MVP done.',
    milestone: 'Milestone 7',
  },
]

import { usePageTitle } from '../hooks/usePageTitle'

export function HomePage() {
  usePageTitle('Home')
  const featured = sampleRows[0].items[0]

  return (
    <>
      <section className="relative overflow-hidden border-b border-cinema-border/70">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -top-40 right-[-10%] size-[32rem] rounded-full bg-cinema-accent/15 blur-3xl"
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -bottom-48 left-[-10%] size-[28rem] rounded-full bg-cyan-500/10 blur-3xl"
        />

        <div className="relative mx-auto grid w-full max-w-7xl gap-12 px-4 pb-16 pt-14 sm:px-6 lg:grid-cols-[1.05fr_0.95fr] lg:items-center lg:px-8 lg:pb-24 lg:pt-20">
          <div>
            <p className="inline-flex items-center gap-2 rounded-full border border-cinema-border bg-cinema-surface/70 px-3 py-1.5 text-xs font-medium text-cinema-muted">
              <Sparkles
                aria-hidden="true"
                className="size-3.5 text-cinema-accent"
              />
              Personal entertainment journal
            </p>

            <h1 className="mt-6 font-display text-4xl font-semibold leading-[1.08] tracking-tight text-cinema-text sm:text-5xl lg:text-6xl">
              Keep the stories
              <span className="block text-cinema-accent">you love alive.</span>
            </h1>

            <p className="mt-6 max-w-xl text-base leading-7 text-cinema-muted sm:text-lg">
              Track the movies, anime, and series you watch. Rate them, keep
              personal memories, and share spoiler-safe thoughts with people who
              care about the same stories.
            </p>

            <div className="mt-8 flex flex-wrap items-center gap-3">
              <Link to="/discover" className={buttonClasses('primary', 'lg')}>
                Explore discovery
                <ArrowRight aria-hidden="true" className="size-4" />
              </Link>
              <Link to="/about" className={buttonClasses('secondary', 'lg')}>
                About the project
              </Link>
            </div>

            <div className="mt-8 flex flex-wrap gap-2 text-xs text-cinema-muted">
              {[
                { icon: Bookmark, label: 'Track your list' },
                { icon: Star, label: 'Rate and remember' },
                { icon: ShieldCheck, label: 'Spoiler-safe' },
              ].map(({ icon: Icon, label }) => (
                <span
                  key={label}
                  className="inline-flex items-center gap-2 rounded-full border border-cinema-border bg-cinema-surface/50 px-3 py-1.5"
                >
                  <Icon
                    aria-hidden="true"
                    className="size-3.5 text-cinema-accent"
                  />
                  {label}
                </span>
              ))}
            </div>
          </div>

          <div className="relative">
            <div
              aria-hidden="true"
              className="absolute -inset-3 rounded-[2rem] bg-cinema-accent/10 blur-2xl"
            />
            <Card className="relative overflow-hidden p-0">
              <div className="flex items-center justify-between gap-3 border-b border-cinema-border px-5 py-4">
                <div className="flex items-center gap-2">
                  <BookHeart
                    aria-hidden="true"
                    className="size-4 text-cinema-accent"
                  />
                  <p className="text-xs font-semibold uppercase tracking-[0.18em] text-cinema-muted">
                    Journal preview
                  </p>
                </div>
                <span className="rounded-full border border-cinema-accent/30 bg-cinema-accent/10 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wide text-cinema-accent">
                  Sample layout
                </span>
              </div>

              <div className="grid gap-5 p-5 sm:grid-cols-[8.5rem_1fr]">
                <div className="relative aspect-[2/3] overflow-hidden rounded-xl border border-white/10 bg-gradient-to-br from-amber-500/45 via-orange-500/15 to-cinema-bg">
                  <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_15%,rgba(255,255,255,0.22),transparent_55%)]" />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <Clapperboard
                      aria-hidden="true"
                      className="size-10 text-white/30"
                      strokeWidth={1.25}
                    />
                  </div>
                  <span className="absolute bottom-3 left-3 rounded-full bg-black/40 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wide text-white/80 ring-1 ring-white/10">
                    Movie
                  </span>
                </div>

                <div className="min-w-0">
                  <p className="inline-flex rounded-full bg-emerald-500/15 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wide text-emerald-300">
                    Completed
                  </p>
                  <h2 className="mt-3 font-display text-xl font-semibold text-cinema-text">
                    {featured.title}
                  </h2>
                  <p className="mt-1 text-sm text-cinema-muted">
                    {featured.year} · {featured.genre}
                  </p>

                  <div className="mt-4 flex items-center gap-1 text-amber-300">
                    {Array.from({ length: 5 }, (_, index) => (
                      <Star
                        key={index}
                        aria-hidden="true"
                        className="size-4 fill-current"
                      />
                    ))}
                    <span className="ml-2 text-xs text-cinema-muted">
                      8.5 / 10 · sample rating
                    </span>
                  </div>

                  <blockquote className="mt-4 rounded-xl border border-cinema-border bg-cinema-bg/50 p-3 text-sm leading-6 text-cinema-muted">
                    “A short personal memory would live here, attached to the
                    title and visible only to you.”
                  </blockquote>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-2 border-t border-cinema-border px-5 py-4 text-xs text-cinema-muted">
                <span className="rounded-full bg-white/5 px-3 py-1.5">
                  Watchlist
                </span>
                <span className="rounded-full bg-white/5 px-3 py-1.5">
                  Progress
                </span>
                <span className="rounded-full bg-white/5 px-3 py-1.5">
                  Favorites
                </span>
                <span className="ml-auto text-cinema-muted/60">
                  Preview only
                </span>
              </div>
            </Card>
          </div>
        </div>
      </section>

      <div
        id="discovery-preview"
        className="mx-auto w-full max-w-7xl space-y-14 px-4 py-16 sm:px-6 lg:px-8"
      >
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-cinema-accent">
              Home preview
            </p>
            <h2 className="mt-2 font-display text-2xl font-semibold tracking-tight text-cinema-text sm:text-3xl">
              Layout preview
            </h2>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-cinema-muted">
              These rows show the intended home layout and remain labeled sample
              data. Live TMDB discovery is available on the Discover page when
              a key is configured.
            </p>
          </div>
          <Link to="/discover" className={buttonClasses('secondary', 'md')}>
            Open live discovery
            <ArrowRight aria-hidden="true" className="size-4" />
          </Link>
        </div>

        {sampleRows.map((row) => (
          <MediaRow key={row.id} row={row} sample />
        ))}
      </div>

      <section className="mx-auto w-full max-w-7xl px-4 pb-4 sm:px-6 lg:px-8">
        <div className="rounded-[2rem] border border-cinema-border bg-cinema-surface/40 p-6 sm:p-10">
          <div className="max-w-2xl">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-cinema-accent">
              Planned features
            </p>
            <h2 className="mt-2 font-display text-2xl font-semibold tracking-tight text-cinema-text sm:text-3xl">
              Built one tested milestone at a time
            </h2>
            <p className="mt-3 text-sm leading-6 text-cinema-muted">
              These areas are next. Each is listed with the milestone where it
              will be implemented and tested.
            </p>
          </div>

          <div className="mt-8 grid gap-4 md:grid-cols-3">
            {plannedFeatures.map(
              ({ icon: Icon, title, description, milestone }) => (
                <Card key={title} className="flex flex-col bg-cinema-bg/40">
                  <span className="flex size-11 items-center justify-center rounded-2xl bg-cinema-accent/10 text-cinema-accent">
                    <Icon aria-hidden="true" className="size-5" />
                  </span>
                  <h3 className="mt-5 font-display text-lg font-semibold text-cinema-text">
                    {title}
                  </h3>
                  <p className="mt-2 flex-1 text-sm leading-6 text-cinema-muted">
                    {description}
                  </p>
                  <p className="mt-5 text-xs font-medium text-cinema-muted/70">
                    Planned · {milestone}
                  </p>
                </Card>
              ),
            )}
          </div>
        </div>
      </section>

      <section className="mx-auto w-full max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-6 rounded-[2rem] border border-cinema-accent/20 bg-cinema-accent/5 p-6 sm:flex-row sm:items-center sm:justify-between sm:p-8">
          <div>
            <p className="font-display text-lg font-semibold text-cinema-text">
              Milestone 4: live discovery.
            </p>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-cinema-muted">
              Auth, protected routes, profiles, avatar uploads, and the
              first-login tour are in place. Discover now searches TMDB and
              opens title details when <code className="text-cinema-text">VITE_TMDB_API_KEY</code>{' '}
              is configured. The journal and community are still to come.
            </p>
          </div>
          <div className="flex shrink-0 flex-wrap gap-3">
            <Link to="/signin" className={buttonClasses('primary', 'md')}>
              Sign in
            </Link>
            <Link to="/about" className={buttonClasses('secondary', 'md')}>
              Project status
            </Link>
          </div>
        </div>
      </section>
    </>
  )
}
