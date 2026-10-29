import { Link } from 'react-router-dom'
import { TmdbAttribution } from '../../features/discovery/TmdbAttribution'

const currentYear = new Date().getFullYear()

export function Footer() {
  return (
    <footer className="mt-20 border-t border-cinema-border bg-cinema-bg-soft">
      <div className="mx-auto grid w-full max-w-7xl gap-10 px-4 py-12 sm:px-6 lg:grid-cols-[1.4fr_1fr_1fr] lg:px-8">
        <div>
          <p className="font-display text-lg font-semibold text-cinema-text">
            KeepAliveMovie
          </p>
          <p className="mt-3 max-w-sm text-sm leading-6 text-cinema-muted">
            A personal entertainment journal and community for the movies,
            anime, and series that stay with you.
          </p>
          <p className="mt-4 text-xs leading-5 text-cinema-muted/70">
            Home rows remain clearly labeled sample data. Live discovery uses
            TMDB when a key is configured.
          </p>
        </div>

        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-cinema-muted">
            Explore
          </p>
          <ul className="mt-4 space-y-2 text-sm">
            <li>
              <Link
                to="/"
                className="text-cinema-muted transition-colors hover:text-cinema-text"
              >
                Home
              </Link>
            </li>
            <li>
              <Link
                to="/discover"
                className="text-cinema-muted transition-colors hover:text-cinema-text"
              >
                Discover
              </Link>
            </li>
            <li>
              <Link
                to="/journal"
                className="text-cinema-muted transition-colors hover:text-cinema-text"
              >
                Journal
              </Link>
            </li>
            <li>
              <Link
                to="/community"
                className="text-cinema-muted transition-colors hover:text-cinema-text"
              >
                Community
              </Link>
            </li>
          </ul>
        </div>

        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-cinema-muted">
            Project
          </p>
          <ul className="mt-4 space-y-2 text-sm">
            <li>
              <Link
                to="/about"
                className="text-cinema-muted transition-colors hover:text-cinema-text"
              >
                About
              </Link>
            </li>
            <li>
              <Link
                to="/privacy"
                className="text-cinema-muted transition-colors hover:text-cinema-text"
              >
                Privacy
              </Link>
            </li>
            <li>
              <Link
                to="/terms"
                className="text-cinema-muted transition-colors hover:text-cinema-text"
              >
                Terms
              </Link>
            </li>
            <li>
              <Link
                to="/help"
                className="text-cinema-muted transition-colors hover:text-cinema-text"
              >
                Help
              </Link>
            </li>
            <li className="text-cinema-muted/70">Built with React + Tailwind</li>
            <li className="text-cinema-muted/70">
              Supabase auth + profiles · TMDB discovery
            </li>
          </ul>
        </div>
      </div>

      <div className="border-t border-cinema-border/70">
        <div className="mx-auto w-full max-w-7xl px-4 pt-5 sm:px-6 lg:px-8">
          <TmdbAttribution />
        </div>
        <div className="mx-auto flex w-full max-w-7xl flex-col gap-2 px-4 py-5 text-xs text-cinema-muted/70 sm:flex-row sm:items-center sm:justify-between sm:px-6 lg:px-8">
          <p>
            © {currentYear} KeepAliveMovie. Keep the stories you love alive.
          </p>
          <p>Milestone 4 · Discovery</p>
        </div>
      </div>
    </footer>
  )
}

