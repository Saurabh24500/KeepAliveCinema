import { Film } from 'lucide-react'
import { Link } from 'react-router-dom'
import { buttonClasses } from '../components/ui/buttonStyles'

export function NotFoundPage() {
  return (
    <div className="mx-auto flex w-full max-w-2xl flex-col items-center px-4 py-24 text-center sm:px-6">
      <span className="flex size-16 items-center justify-center rounded-3xl bg-cinema-accent/10 text-cinema-accent ring-1 ring-cinema-accent/20">
        <Film aria-hidden="true" className="size-7" />
      </span>
      <p className="mt-6 text-xs font-semibold uppercase tracking-[0.2em] text-cinema-accent">
        404
      </p>
      <h1 className="mt-3 font-display text-3xl font-semibold tracking-tight text-cinema-text sm:text-4xl">
        This scene is missing.
      </h1>
      <p className="mt-3 max-w-md text-sm leading-6 text-cinema-muted">
        The page you are looking for does not exist yet, or the link may be out
        of date.
      </p>
      <Link to="/" className={buttonClasses('primary', 'md', 'mt-8')}>
        Back to home
      </Link>
    </div>
  )
}
