import { LogIn, Menu } from 'lucide-react'
import { Link, NavLink } from 'react-router-dom'
import { useAuth } from '../../features/auth/auth-context'
import { useProfile } from '../../features/profile/profile-context'
import { profileDisplayName } from '../../features/profile/profile-types'
import { cn } from '../../lib/cn'
import { Avatar } from '../ui/Avatar'
import { buttonClasses } from '../ui/buttonStyles'
import { Skeleton } from '../ui/Skeleton'
import { Logo } from './Logo'
import { primaryNav } from './navigation'

interface HeaderProps {
  onOpenMenu: () => void
}

export function Header({ onOpenMenu }: HeaderProps) {
  const { user, loading } = useAuth()
  const { profile } = useProfile()
  const email = user?.email ?? ''
  const name = profileDisplayName(profile) || email
  const handle = profile ? `@${profile.username}` : email

  return (
    <header className="sticky top-0 z-40 border-b border-cinema-border/80 bg-cinema-bg/85 backdrop-blur">
      <div className="mx-auto flex h-16 w-full max-w-7xl items-center justify-between gap-4 px-4 sm:px-6 lg:h-18 lg:px-8">
        <Logo />

        <nav aria-label="Primary" className="hidden lg:block">
          <ul className="flex items-center gap-1">
            {primaryNav.map(({ to, label, comingSoon }) => (
              <li key={to}>
                <NavLink
                  to={to}
                  end={to === '/'}
                  className={({ isActive }) =>
                    cn(
                      'inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium transition-colors',
                      isActive
                        ? 'bg-white/8 text-cinema-text'
                        : 'text-cinema-muted hover:bg-white/5 hover:text-cinema-text',
                    )
                  }
                >
                  {label}
                  {comingSoon ? (
                    <span className="rounded-full bg-cinema-accent/15 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-cinema-accent">
                      Soon
                    </span>
                  ) : null}
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>

        <div className="flex items-center gap-2">
          {loading ? (
            <Skeleton className="size-9 rounded-full" />
          ) : user ? (
            <Link
              to="/profile"
              className="flex items-center gap-2 rounded-full border border-cinema-border bg-cinema-surface py-1 pl-1 pr-3 transition-colors hover:border-cinema-accent/60 hover:bg-cinema-surface-2"
              aria-label="Open your profile"
            >
              <Avatar
                src={profile?.avatar_url}
                name={name}
                className="size-7 text-xs"
              />
              <span className="hidden max-w-40 truncate text-xs text-cinema-muted sm:inline">
                {handle}
              </span>
            </Link>
          ) : (
            <Link
              to="/signin"
              className={buttonClasses(
                'secondary',
                'sm',
                'hidden sm:inline-flex',
              )}
            >
              <LogIn aria-hidden="true" className="size-4" />
              Sign in
            </Link>
          )}

          <button
            type="button"
            onClick={onOpenMenu}
            className="flex size-10 items-center justify-center rounded-full border border-cinema-border bg-cinema-surface text-cinema-text transition-colors hover:border-cinema-accent/60 hover:bg-cinema-surface-2 lg:hidden"
            aria-label="Open navigation menu"
          >
            <Menu aria-hidden="true" className="size-5" />
          </button>
        </div>
      </div>
    </header>
  )
}
