import {
  CheckCircle2,
  Clock3,
  Database,
  Film,
  Heart,
  ShieldCheck,
} from 'lucide-react'
import { Link } from 'react-router-dom'
import { buttonClasses } from '../components/ui/buttonStyles'
import { Card } from '../components/ui/Card'
import { TmdbAttribution } from '../features/discovery/TmdbAttribution'

const implemented = [
  'Vite + React + TypeScript foundation',
  'Tailwind CSS v4 design tokens and dark cinematic shell',
  'React Router with Home, About, Journal, Discover, Community, and auth routes',
  'Responsive header, navigation drawer, footer, and create-post placeholder',
  'Reusable buttons, cards, skeleton, empty, error, and media row components',
  'Home page with clearly labeled sample media rows',
  'Email/password auth screens, session handling, and protected routes',
  'Profile editing, avatar upload, and completion tracking',
  'Skippable, replayable first-login tour',
  'TMDB-powered discovery, search, and title details',
]

const notConnected = [
  'Successful-account testing with a confirmed Supabase email',
  'Personal journal entries and viewing history',
  'Community posts, comments, likes, and spoiler controls',
  'Production deployment and final accessibility pass',
]

export function AboutPage() {
  return (
    <div className="mx-auto w-full max-w-5xl px-4 py-14 sm:px-6 lg:px-8 lg:py-20">
      <p className="text-xs font-semibold uppercase tracking-[0.2em] text-cinema-accent">
        About
      </p>
      <h1 className="mt-3 max-w-3xl font-display text-4xl font-semibold leading-tight tracking-tight text-cinema-text sm:text-5xl">
        A home for the stories that stay with you.
      </h1>
      <p className="mt-5 max-w-2xl text-base leading-7 text-cinema-muted">
        KeepAliveMovie is a personal entertainment journal and community for
        movies, anime, anime series, TV series, and web series. The goal is
        simple: help you remember what you watched, how it felt, and what you
        want to watch next.
      </p>

      <div className="mt-10 grid gap-4 sm:grid-cols-3">
        {[
          {
            icon: Film,
            title: 'One place for every title',
            description:
              'Movies, anime, and series share one journal instead of scattered notes and half-finished lists.',
          },
          {
            icon: Heart,
            title: 'Memory over metrics',
            description:
              'Ratings are useful, but the short personal note about why a story mattered is the part worth keeping.',
          },
          {
            icon: ShieldCheck,
            title: 'Spoiler-aware by design',
            description:
              'Community features are planned around deliberate spoiler reveals, not accidental ones.',
          },
        ].map(({ icon: Icon, title, description }) => (
          <Card key={title}>
            <span className="flex size-11 items-center justify-center rounded-2xl bg-cinema-accent/10 text-cinema-accent">
              <Icon aria-hidden="true" className="size-5" />
            </span>
            <h2 className="mt-5 font-display text-lg font-semibold text-cinema-text">
              {title}
            </h2>
            <p className="mt-2 text-sm leading-6 text-cinema-muted">
              {description}
            </p>
          </Card>
        ))}
      </div>

      <div className="mt-12 grid gap-4 lg:grid-cols-2">
        <Card className="bg-cinema-bg-soft">
          <div className="flex items-center gap-3">
            <CheckCircle2
              aria-hidden="true"
              className="size-5 text-emerald-300"
            />
            <h2 className="font-display text-lg font-semibold text-cinema-text">
              Working in this preview
            </h2>
          </div>
          <ul className="mt-5 space-y-3">
            {implemented.map((item) => (
              <li
                key={item}
                className="flex gap-3 text-sm leading-6 text-cinema-muted"
              >
                <CheckCircle2
                  aria-hidden="true"
                  className="mt-0.5 size-4 shrink-0 text-emerald-300/80"
                />
                {item}
              </li>
            ))}
          </ul>
        </Card>

        <Card className="bg-cinema-bg-soft">
          <div className="flex items-center gap-3">
            <Clock3 aria-hidden="true" className="size-5 text-amber-300" />
            <h2 className="font-display text-lg font-semibold text-cinema-text">
              Planned, not connected
            </h2>
          </div>
          <ul className="mt-5 space-y-3">
            {notConnected.map((item) => (
              <li
                key={item}
                className="flex gap-3 text-sm leading-6 text-cinema-muted"
              >
                <Clock3
                  aria-hidden="true"
                  className="mt-0.5 size-4 shrink-0 text-amber-300/70"
                />
                {item}
              </li>
            ))}
          </ul>
        </Card>
      </div>

      <div className="mt-12 rounded-[2rem] border border-cinema-border bg-cinema-surface/40 p-6 sm:p-8">
        <div className="flex items-center gap-3">
          <Database aria-hidden="true" className="size-5 text-cinema-accent" />
          <h2 className="font-display text-lg font-semibold text-cinema-text">
            Honest status
          </h2>
        </div>
        <p className="mt-3 max-w-3xl text-sm leading-6 text-cinema-muted">
          Home rows use sample titles only to demonstrate layout. Discover uses
          live TMDB metadata and images when{' '}
          <code>VITE_TMDB_API_KEY</code> is configured; without it, the page
          shows a setup notice instead of pretending to have data. Anime is
          approximated as Japanese-language animation, so TMDB classification
          can miss or include titles unexpectedly. Journal entries and community
          content do not exist yet. Profile and auth flows still need a confirmed
          test account before they can be called verified.
        </p>
        <TmdbAttribution className="mt-6 border-t border-cinema-border pt-4" />
        <div className="mt-6 flex flex-wrap gap-3">
          <Link to="/discover" className={buttonClasses('primary', 'md')}>
            Open discovery
          </Link>
          <Link to="/journal" className={buttonClasses('secondary', 'md')}>
            View the journal placeholder
          </Link>
        </div>
      </div>
    </div>
  )
}
