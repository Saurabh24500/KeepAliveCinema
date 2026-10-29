import {
  CalendarDays,
  LogOut,
  Mail,
  Pencil,
  UserRound,
} from 'lucide-react'
import { useState } from 'react'
import { Link, Navigate, useNavigate } from 'react-router-dom'
import { Avatar } from '../components/ui/Avatar'
import { Button } from '../components/ui/Button'
import { Card } from '../components/ui/Card'
import { buttonClasses } from '../components/ui/buttonStyles'
import { AuthLoadingState } from '../features/auth/AuthLoadingState'
import { useAuth } from '../features/auth/auth-context'
import { useProfile } from '../features/profile/profile-context'
import {
  calculateProfileCompletion,
  profileDisplayName,
} from '../features/profile/profile-types'

export function AccountPage() {
  const { user, loading, signOut } = useAuth()
  const { profile, loading: profileLoading } = useProfile()
  const navigate = useNavigate()
  const [signingOut, setSigningOut] = useState(false)
  const [error, setError] = useState<string | null>(null)

  if (loading) {
    return <AuthLoadingState />
  }

  if (!user) {
    return <Navigate to="/signin" replace />
  }

  const email = user.email ?? 'No email on this account'
  const name = profileDisplayName(profile) || email
  const handle = profile ? `@${profile.username}` : email
  const completion = profile ? calculateProfileCompletion(profile) : 0
  const joined = new Date(user.created_at).toLocaleDateString(undefined, {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })

  async function handleSignOut() {
    setError(null)
    setSigningOut(true)
    const result = await signOut()
    setSigningOut(false)

    if (result.error) {
      setError(result.error)
      return
    }

    navigate('/', { replace: true })
  }

  return (
    <div className="mx-auto w-full max-w-3xl px-4 py-12 sm:px-6 lg:py-16">
      <p className="text-xs font-semibold uppercase tracking-[0.2em] text-cinema-accent">
        Account
      </p>
      <h1 className="mt-3 font-display text-3xl font-semibold tracking-tight text-cinema-text sm:text-4xl">
        Your account
      </h1>
      <p className="mt-2 text-sm leading-6 text-cinema-muted">
        Manage your session here. Public profile details live on the profile
        page.
      </p>

      <Card className="mt-8">
        <div className="flex flex-col gap-5 sm:flex-row sm:items-center">
          <Avatar
            src={profile?.avatar_url}
            name={name}
            className="size-16 text-2xl"
          />
          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-2">
              <p className="truncate font-display text-xl font-semibold text-cinema-text">
                {profileLoading ? 'Loading profile…' : name}
              </p>
              <span className="rounded-full bg-emerald-500/15 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wide text-emerald-300">
                Active session
              </span>
            </div>
            <p className="mt-1 truncate text-sm text-cinema-muted">{handle}</p>
          </div>
          <Link
            to="/profile"
            className={buttonClasses('secondary', 'sm', 'shrink-0')}
          >
            <Pencil aria-hidden="true" className="size-4" />
            Edit profile
          </Link>
        </div>

        {profile ? (
          <div className="mt-6 rounded-2xl border border-cinema-border bg-cinema-bg/40 p-4">
            <div className="flex items-center justify-between gap-3">
              <p className="text-sm font-medium text-cinema-text">
                Profile completion
              </p>
              <span className="font-display text-lg font-semibold text-cinema-accent">
                {completion}%
              </span>
            </div>
            <div className="mt-3 h-2 overflow-hidden rounded-full bg-white/10">
              <div
                className="h-full rounded-full bg-cinema-accent"
                style={{ width: `${completion}%` }}
              />
            </div>
          </div>
        ) : null}

        <dl className="mt-8 grid gap-4 border-t border-cinema-border pt-6 sm:grid-cols-2">
          <div className="flex gap-3">
            <Mail
              aria-hidden="true"
              className="mt-0.5 size-4 shrink-0 text-cinema-accent"
            />
            <div className="min-w-0">
              <dt className="text-xs font-medium uppercase tracking-wide text-cinema-muted">
                Email
              </dt>
              <dd className="mt-1 truncate text-sm text-cinema-text">
                {email}
              </dd>
            </div>
          </div>
          <div className="flex gap-3">
            <CalendarDays
              aria-hidden="true"
              className="mt-0.5 size-4 shrink-0 text-cinema-accent"
            />
            <div>
              <dt className="text-xs font-medium uppercase tracking-wide text-cinema-muted">
                Account created
              </dt>
              <dd className="mt-1 text-sm text-cinema-text">{joined}</dd>
            </div>
          </div>
          <div className="flex gap-3 sm:col-span-2">
            <UserRound
              aria-hidden="true"
              className="mt-0.5 size-4 shrink-0 text-cinema-accent"
            />
            <div className="min-w-0">
              <dt className="text-xs font-medium uppercase tracking-wide text-cinema-muted">
                User ID
              </dt>
              <dd className="mt-1 truncate font-mono text-xs text-cinema-text">
                {user.id}
              </dd>
            </div>
          </div>
        </dl>

        {error ? (
          <p
            role="alert"
            className="mt-6 rounded-xl border border-red-400/25 bg-red-400/5 px-3.5 py-3 text-sm text-red-300"
          >
            {error}
          </p>
        ) : null}

        <div className="mt-8 flex flex-wrap gap-3 border-t border-cinema-border pt-6">
          <Button
            variant="secondary"
            onClick={handleSignOut}
            disabled={signingOut}
          >
            <LogOut aria-hidden="true" className="size-4" />
            {signingOut ? 'Signing out…' : 'Sign out'}
          </Button>
          <Link to="/journal" className={buttonClasses('ghost', 'md')}>
            Go to journal
          </Link>
        </div>
      </Card>

      <div className="mt-6 rounded-2xl border border-cinema-border bg-cinema-surface/30 p-5 text-sm leading-6 text-cinema-muted">
        Profile completion is calculated from username, display name, bio,
        favorite genres, and avatar. It is not stored as a separate counter.
      </div>
    </div>
  )
}
