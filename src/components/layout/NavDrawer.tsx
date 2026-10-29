import {
  ChevronRight,
  Info,
  LogIn,
  LogOut,
  Settings,
  User,
  X,
} from 'lucide-react'
import { useEffect, useId, useRef, useState } from 'react'
import { Link, NavLink, useNavigate } from 'react-router-dom'
import { useAuth } from '../../features/auth/auth-context'
import { useProfile } from '../../features/profile/profile-context'
import { profileDisplayName } from '../../features/profile/profile-types'
import { cn } from '../../lib/cn'
import { Avatar } from '../ui/Avatar'
import { buttonClasses } from '../ui/buttonStyles'
import { Skeleton } from '../ui/Skeleton'
import { Logo } from './Logo'
import { primaryNav } from './navigation'

interface NavDrawerProps {
  open: boolean
  onClose: () => void
}

const focusableSelector =
  'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])'

export function NavDrawer({ open, onClose }: NavDrawerProps) {
  const panelRef = useRef<HTMLDivElement>(null)
  const closeButtonRef = useRef<HTMLButtonElement>(null)
  const titleId = useId()
  const navigate = useNavigate()
  const { user, loading, signOut } = useAuth()
  const { profile, loading: profileLoading } = useProfile()
  const [signingOut, setSigningOut] = useState(false)
  const [signOutError, setSignOutError] = useState<string | null>(null)

  const email = user?.email ?? ''
  const name = profileDisplayName(profile) || email
  const busy = loading || profileLoading

  useEffect(() => {
    if (!open) return

    const previouslyFocused = document.activeElement
    const originalOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'

    const focusFrame = window.requestAnimationFrame(() => {
      closeButtonRef.current?.focus()
    })

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        onClose()
        return
      }

      if (event.key !== 'Tab' || !panelRef.current) return

      const focusable = Array.from(
        panelRef.current.querySelectorAll<HTMLElement>(focusableSelector),
      )
      if (focusable.length === 0) return

      const first = focusable[0]
      const last = focusable[focusable.length - 1]
      const active = document.activeElement

      if (event.shiftKey && (active === first || active === panelRef.current)) {
        event.preventDefault()
        last.focus()
      } else if (!event.shiftKey && active === last) {
        event.preventDefault()
        first.focus()
      }
    }

    document.addEventListener('keydown', handleKeyDown)

    return () => {
      window.cancelAnimationFrame(focusFrame)
      document.removeEventListener('keydown', handleKeyDown)
      document.body.style.overflow = originalOverflow
      if (previouslyFocused instanceof HTMLElement) {
        previouslyFocused.focus()
      }
    }
  }, [open, onClose])

  async function handleSignOut() {
    setSignOutError(null)
    setSigningOut(true)
    const result = await signOut()
    setSigningOut(false)

    if (result.error) {
      setSignOutError(result.error)
      return
    }

    onClose()
    navigate('/', { replace: true })
  }

  if (!open) return null

  return (
    <div className="fixed inset-0 z-50">
      <button
        type="button"
        tabIndex={-1}
        aria-label="Close navigation menu"
        onClick={onClose}
        className="absolute inset-0 animate-cinema-fade-in bg-black/65 backdrop-blur-sm"
      />

      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        className="relative z-10 flex h-full w-[min(21rem,88vw)] animate-cinema-slide-in flex-col border-r border-cinema-border bg-cinema-bg-soft shadow-2xl"
      >
        <h2 id={titleId} className="sr-only">
          Navigation menu
        </h2>

        <div className="flex items-center justify-between gap-3 border-b border-cinema-border px-5 py-4">
          <Logo onClick={onClose} />
          <button
            ref={closeButtonRef}
            type="button"
            onClick={onClose}
            className="flex size-10 shrink-0 items-center justify-center rounded-full border border-cinema-border bg-cinema-surface text-cinema-muted transition-colors hover:border-cinema-accent/60 hover:text-cinema-text"
            aria-label="Close navigation menu"
          >
            <X aria-hidden="true" className="size-5" />
          </button>
        </div>

        <div className="border-b border-cinema-border p-5">
          {busy ? (
            <div className="flex items-center gap-3 rounded-2xl border border-cinema-border bg-cinema-surface/70 p-4">
              <Skeleton className="size-11 rounded-full" />
              <div className="flex-1 space-y-2">
                <Skeleton className="h-3.5 w-24" />
                <Skeleton className="h-3 w-36" />
              </div>
            </div>
          ) : user ? (
            <div className="rounded-2xl border border-cinema-border bg-cinema-surface/70 p-4">
              <div className="flex items-center gap-3">
                <Avatar
                  src={profile?.avatar_url}
                  name={name}
                  className="size-11 text-sm"
                />
                <div className="min-w-0">
                  <p className="truncate font-display text-sm font-semibold text-cinema-text">
                    {name}
                  </p>
                  <p className="truncate text-xs text-cinema-muted">
                    {profile ? `@${profile.username}` : email}
                  </p>
                </div>
              </div>
              <Link
                to="/profile"
                onClick={onClose}
                className={buttonClasses(
                  'secondary',
                  'sm',
                  'mt-3 w-full',
                )}
              >
                Edit profile
              </Link>
            </div>
          ) : (
            <div className="rounded-2xl border border-cinema-border bg-cinema-surface/70 p-4">
              <div className="flex items-center gap-3">
                <span className="flex size-11 shrink-0 items-center justify-center rounded-full bg-cinema-accent/15 text-cinema-accent">
                  <User aria-hidden="true" className="size-5" />
                </span>
                <div className="min-w-0">
                  <p className="font-display text-sm font-semibold text-cinema-text">
                    Guest
                  </p>
                  <p className="truncate text-xs text-cinema-muted">
                    Sign in to sync your journal
                  </p>
                </div>
              </div>
              <Link
                to="/signin"
                onClick={onClose}
                className={buttonClasses('primary', 'sm', 'mt-3 w-full')}
              >
                <LogIn aria-hidden="true" className="size-4" />
                Sign in
              </Link>
            </div>
          )}

          {signOutError ? (
            <p
              role="alert"
              className="mt-3 rounded-xl border border-red-400/25 bg-red-400/5 px-3 py-2 text-xs leading-5 text-red-300"
            >
              {signOutError}
            </p>
          ) : null}
        </div>

        <nav aria-label="Drawer" className="flex-1 overflow-y-auto p-4">
          <ul className="space-y-1">
            {primaryNav.map(({ to, label, icon: Icon, comingSoon }) => (
              <li key={to}>
                <NavLink
                  to={to}
                  end={to === '/'}
                  onClick={onClose}
                  className={({ isActive }) =>
                    cn(
                      'flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-medium transition-colors',
                      isActive
                        ? 'bg-white/8 text-cinema-text'
                        : 'text-cinema-muted hover:bg-white/5 hover:text-cinema-text',
                    )
                  }
                >
                  <Icon aria-hidden="true" className="size-5" />
                  <span className="flex-1">{label}</span>
                  {comingSoon ? (
                    <span className="rounded-full bg-cinema-accent/15 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-cinema-accent">
                      Soon
                    </span>
                  ) : (
                    <ChevronRight
                      aria-hidden="true"
                      className="size-4 opacity-50"
                    />
                  )}
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>

        <div className="space-y-1 border-t border-cinema-border p-4">
          {user ? (
            <button
              type="button"
              onClick={handleSignOut}
              disabled={signingOut}
              className="flex w-full items-center gap-3 rounded-xl px-3 py-3 text-sm font-medium text-cinema-muted transition-colors hover:bg-white/5 hover:text-cinema-text disabled:cursor-not-allowed disabled:opacity-60"
            >
              <LogOut aria-hidden="true" className="size-5" />
              {signingOut ? 'Signing out…' : 'Sign out'}
            </button>
          ) : null}
          <NavLink
            to="/account"
            onClick={onClose}
            className={({ isActive }) =>
              cn(
                'flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-medium transition-colors',
                isActive
                  ? 'bg-white/8 text-cinema-text'
                  : 'text-cinema-muted hover:bg-white/5 hover:text-cinema-text',
              )
            }
          >
            <Settings aria-hidden="true" className="size-5" />
            Account
          </NavLink>
          <NavLink
            to="/about"
            onClick={onClose}
            className={({ isActive }) =>
              cn(
                'flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-medium transition-colors',
                isActive
                  ? 'bg-white/8 text-cinema-text'
                  : 'text-cinema-muted hover:bg-white/5 hover:text-cinema-text',
              )
            }
          >
            <Info aria-hidden="true" className="size-5" />
            About KeepAliveMovie
          </NavLink>
          <p className="px-3 pt-2 text-[11px] text-cinema-muted/60">
            Milestone 3 · Profiles
          </p>
        </div>
      </div>
    </div>
  )
}
