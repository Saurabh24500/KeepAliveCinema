import {
  ArrowLeft,
  ArrowRight,
  BookHeart,
  CheckCircle2,
  Compass,
  PartyPopper,
  ShieldCheck,
  Sparkles,
  Users,
  type LucideIcon,
} from 'lucide-react'
import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Button } from '../components/ui/Button'
import { EmptyState } from '../components/ui/EmptyState'
import { ErrorState } from '../components/ui/ErrorState'
import { buttonClasses } from '../components/ui/buttonStyles'
import { AuthLoadingState } from '../features/auth/AuthLoadingState'
import { useProfile } from '../features/profile/profile-context'

interface TourStep {
  icon: LucideIcon
  eyebrow: string
  availability: string
  title: string
  description: string
  points: string[]
}

const tourSteps: TourStep[] = [
  {
    icon: BookHeart,
    eyebrow: 'Your journal',
    availability: 'Planned · Milestone 5',
    title: 'Track the stories you actually watched',
    description:
      'The journal is the heart of KeepAliveMovie. Statuses, progress, ratings, favorites, and short memories all live together.',
    points: [
      'Watchlist, watching, completed, paused, and dropped',
      'A personal rating and an optional memory note',
      'Private by default, protected by database policies',
    ],
  },
  {
    icon: Compass,
    eyebrow: 'Discovery',
    availability: 'Available · TMDB',
    title: 'Find the next story with less guesswork',
    description:
      'Search movies, anime, and series, then save anything interesting straight into your journal.',
    points: [
      'Search and browse by media type',
      'Clear detail views with genres and release dates',
      'Loading, empty, and error states that do not leave you stuck',
    ],
  },
  {
    icon: Users,
    eyebrow: 'Community',
    availability: 'Planned · Milestone 6',
    title: 'Share thoughts without spoiling the room',
    description:
      'Post a thought, attach a title, and mark spoilers so people can choose when to reveal them.',
    points: [
      'Spoiler-safe posts with a deliberate reveal',
      'A paginated feed with likes and comments',
      'Your profile name and avatar appear on your posts',
    ],
  },
]

export function OnboardingPage() {
  const { profile, loading, error, completeOnboarding, refresh } = useProfile()
  const navigate = useNavigate()

  const [stepIndex, setStepIndex] = useState(0)
  const [replaying, setReplaying] = useState(false)
  const [finishing, setFinishing] = useState(false)
  const [actionError, setActionError] = useState<string | null>(null)

  async function finishTour() {
    setActionError(null)
    setFinishing(true)
    const result = await completeOnboarding()
    setFinishing(false)

    if (result.error) {
      setActionError(result.error)
      return
    }

    navigate('/profile', { replace: true })
  }

  if (loading) {
    return <AuthLoadingState />
  }

  if (error) {
    return (
      <div className="mx-auto w-full max-w-3xl px-4 py-12 sm:px-6">
        <ErrorState
          title="Onboarding could not load"
          description={error}
          onRetry={() => {
            void refresh()
          }}
        />
      </div>
    )
  }

  if (!profile) {
    return (
      <div className="mx-auto w-full max-w-3xl px-4 py-12 sm:px-6">
        <EmptyState
          icon={Sparkles}
          title="Profile setup is missing"
          description="Your account has no profile row yet. Open your profile to create one, or check again after applying the migration."
          action={
            <div className="flex flex-wrap justify-center gap-3">
              <Link to="/profile" className={buttonClasses('primary', 'md')}>
                Go to profile
              </Link>
              <button
                type="button"
                onClick={() => {
                  void refresh()
                }}
                className={buttonClasses('secondary', 'md')}
              >
                Check again
              </button>
            </div>
          }
        />
      </div>
    )
  }

  if (profile.onboarding_completed && !replaying) {
    return (
      <div className="mx-auto w-full max-w-3xl px-4 py-14 sm:px-6">
        <div className="rounded-3xl border border-cinema-border bg-cinema-surface/60 p-8 text-center">
          <span className="mx-auto flex size-16 items-center justify-center rounded-3xl bg-emerald-500/15 text-emerald-300">
            <PartyPopper aria-hidden="true" className="size-8" />
          </span>
          <h1 className="mt-6 font-display text-3xl font-semibold tracking-tight text-cinema-text">
            You are all caught up
          </h1>
          <p className="mx-auto mt-3 max-w-lg text-sm leading-6 text-cinema-muted">
            You already finished the tour. You can replay it whenever you want,
            or jump back into setting up your profile.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Link to="/profile" className={buttonClasses('primary', 'md')}>
              Go to profile
            </Link>
            <Button
              variant="secondary"
              onClick={() => {
                setStepIndex(0)
                setReplaying(true)
                setActionError(null)
              }}
            >
              Replay tour
            </Button>
          </div>
        </div>
      </div>
    )
  }

  const step = tourSteps[stepIndex]
  const StepIcon = step.icon
  const isLast = stepIndex === tourSteps.length - 1

  return (
    <div className="mx-auto w-full max-w-3xl px-4 py-12 sm:px-6 lg:py-16">
      <div className="flex items-center justify-between gap-4">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-cinema-accent">
          First-login tour
        </p>
        <p className="text-xs text-cinema-muted">
          Step {stepIndex + 1} of {tourSteps.length}
        </p>
      </div>

      <p className="mt-2 text-sm leading-6 text-cinema-muted">
        A short tour of the app. Profiles and discovery screens are ready;
        discovery needs a TMDB key. The journal and community arrive later.
      </p>

      <div className="mt-4 h-1.5 overflow-hidden rounded-full bg-white/10">
        <div
          className="h-full rounded-full bg-cinema-accent transition-[width]"
          style={{
            width: `${((stepIndex + 1) / tourSteps.length) * 100}%`,
          }}
        />
      </div>

      <div className="mt-8 rounded-3xl border border-cinema-border bg-cinema-surface/60 p-6 sm:p-10">
        <span className="flex size-14 items-center justify-center rounded-2xl bg-cinema-accent/15 text-cinema-accent">
          <StepIcon aria-hidden="true" className="size-7" />
        </span>
        <p className="mt-6 text-xs font-semibold uppercase tracking-[0.18em] text-cinema-accent">
          {step.eyebrow}
        </p>
        <span className="mt-2 inline-flex rounded-full border border-amber-300/20 bg-amber-300/10 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wide text-amber-200">
          {step.availability}
        </span>
        <h1 className="mt-3 font-display text-2xl font-semibold tracking-tight text-cinema-text sm:text-3xl">
          {step.title}
        </h1>
        <p className="mt-3 text-sm leading-7 text-cinema-muted">
          {step.description}
        </p>
        <ul className="mt-6 space-y-3">
          {step.points.map((point) => (
            <li
              key={point}
              className="flex gap-3 text-sm leading-6 text-cinema-muted"
            >
              <CheckCircle2
                aria-hidden="true"
                className="mt-0.5 size-4 shrink-0 text-cinema-accent"
              />
              {point}
            </li>
          ))}
        </ul>

        {actionError ? (
          <p
            role="alert"
            className="mt-6 rounded-xl border border-red-400/25 bg-red-400/5 px-3.5 py-3 text-sm leading-6 text-red-300"
          >
            {actionError}
          </p>
        ) : null}

        <div className="mt-8 flex flex-col gap-4 border-t border-cinema-border pt-6 sm:flex-row sm:items-center sm:justify-between">
          <button
            type="button"
            onClick={() => {
              void finishTour()
            }}
            disabled={finishing}
            className="text-sm font-medium text-cinema-muted transition-colors hover:text-cinema-text disabled:cursor-not-allowed disabled:opacity-50"
          >
            Skip tour
          </button>

          <div className="flex flex-wrap gap-2 sm:justify-end">
            {stepIndex > 0 ? (
              <Button
                variant="ghost"
                onClick={() => setStepIndex((index) => index - 1)}
                disabled={finishing}
              >
                <ArrowLeft aria-hidden="true" className="size-4" />
                Back
              </Button>
            ) : null}
            {isLast ? (
              <Button
                onClick={() => {
                  void finishTour()
                }}
                disabled={finishing}
              >
                {finishing ? 'Finishing…' : 'Finish tour'}
                <ShieldCheck aria-hidden="true" className="size-4" />
              </Button>
            ) : (
              <Button
                onClick={() => setStepIndex((index) => index + 1)}
                disabled={finishing}
              >
                Next
                <ArrowRight aria-hidden="true" className="size-4" />
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
