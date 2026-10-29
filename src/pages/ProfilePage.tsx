import { Settings, Sparkles } from 'lucide-react'
import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Card } from '../components/ui/Card'
import { EmptyState } from '../components/ui/EmptyState'
import { ErrorState } from '../components/ui/ErrorState'
import { Skeleton } from '../components/ui/Skeleton'
import { buttonClasses } from '../components/ui/buttonStyles'
import { ProfileForm } from '../features/profile/ProfileForm'
import { useProfile } from '../features/profile/profile-context'
import { calculateProfileCompletion } from '../features/profile/profile-types'

function ProfilePageSkeleton() {
  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_18rem]">
      <div className="rounded-3xl border border-cinema-border bg-cinema-surface/40 p-6 sm:p-8">
        <Skeleton className="h-6 w-40" />
        <Skeleton className="mt-2 h-4 w-80 max-w-full" />
        <div className="mt-8 space-y-5">
          <Skeleton className="h-16 w-full rounded-xl" />
          <Skeleton className="h-16 w-full rounded-xl" />
          <Skeleton className="h-28 w-full rounded-xl" />
          <Skeleton className="h-20 w-full rounded-xl" />
        </div>
      </div>
      <div className="space-y-4">
        <Skeleton className="h-52 w-full rounded-3xl" />
        <Skeleton className="h-40 w-full rounded-3xl" />
      </div>
    </div>
  )
}

export function ProfilePage() {
  const { profile, loading, error, configured, createProfile, refresh } =
    useProfile()
  const [creating, setCreating] = useState(false)
  const [createError, setCreateError] = useState<string | null>(null)

  async function handleCreateProfile() {
    setCreating(true)
    setCreateError(null)
    const result = await createProfile()
    setCreating(false)

    if (result.error) {
      setCreateError(result.error)
    }
  }

  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-12 sm:px-6 lg:px-8 lg:py-16">
      <p className="text-xs font-semibold uppercase tracking-[0.2em] text-cinema-accent">
        Profile
      </p>
      <div className="mt-3 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="font-display text-3xl font-semibold tracking-tight text-cinema-text sm:text-4xl">
            Make it yours
          </h1>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-cinema-muted">
            Set the name and details people will see when community features
            arrive. Your private journal stays separate.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Link
            to="/onboarding"
            className={buttonClasses('secondary', 'sm')}
          >
            <Sparkles aria-hidden="true" className="size-4" />
            {profile?.onboarding_completed ? 'Replay tour' : 'Take the tour'}
          </Link>
          <Link to="/account" className={buttonClasses('ghost', 'sm')}>
            <Settings aria-hidden="true" className="size-4" />
            Account
          </Link>
        </div>
      </div>

      {!configured ? (
        <EmptyState
          icon={Settings}
          title="Supabase is not configured"
          description="Add your Supabase project URL and publishable key to .env.local, then restart the dev server."
          className="mt-8"
        />
      ) : loading ? (
        <div className="mt-8">
          <ProfilePageSkeleton />
        </div>
      ) : error ? (
        <ErrorState
          title="Profile could not load"
          description={error}
          onRetry={() => {
            void refresh()
          }}
          className="mt-8"
        />
      ) : !profile ? (
        <EmptyState
          icon={Settings}
          title="No profile row found"
          description="Your account exists, but its profile row is missing. Create a starter profile now, or check again if the migration was just applied."
          className="mt-8"
          action={
            <div className="flex flex-col items-center gap-3">
              <div className="flex flex-wrap justify-center gap-3">
                <button
                  type="button"
                  onClick={() => {
                    void handleCreateProfile()
                  }}
                  disabled={creating}
                  className={buttonClasses('primary', 'md')}
                >
                  {creating ? 'Creating…' : 'Create profile'}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    void refresh()
                  }}
                  disabled={creating}
                  className={buttonClasses('secondary', 'md')}
                >
                  Check again
                </button>
              </div>
              {createError ? (
                <p
                  role="alert"
                  className="max-w-md rounded-xl border border-red-400/25 bg-red-400/5 px-3.5 py-3 text-sm leading-6 text-red-300"
                >
                  {createError}
                </p>
              ) : null}
            </div>
          }
        />
      ) : (
        <>
          {!profile.onboarding_completed ? (
            <Card className="mt-8 flex flex-col gap-4 border-cinema-accent/20 bg-cinema-accent/5 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="font-display text-base font-semibold text-cinema-text">
                  Finish your first-login tour
                </p>
                <p className="mt-1 text-sm leading-6 text-cinema-muted">
                  A short tour explains the journal, discovery, and community.
                  You can skip it now and replay it later.
                </p>
              </div>
              <Link
                to="/onboarding"
                className={buttonClasses('primary', 'sm', 'shrink-0')}
              >
                Start tour
              </Link>
            </Card>
          ) : null}

          <div className="mt-8">
            <ProfileForm profile={profile} />
          </div>

          <p className="mt-6 text-xs leading-5 text-cinema-muted/70">
            Profile completion is currently {calculateProfileCompletion(profile)}
            %. It is recalculated from your saved fields, not stored separately.
          </p>
        </>
      )}
    </div>
  )
}
