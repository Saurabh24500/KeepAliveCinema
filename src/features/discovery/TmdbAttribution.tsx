import { useState } from 'react'
import { cn } from '../../lib/cn'
import { tmdbWebsite } from './tmdb'

const tmdbLogoSrc =
  'https://www.themoviedb.org/assets/2/v4/logos/v2/blue_short-8e7b30f73a4020692ccca9c88bafe5dcb6f8a62a4c6bc55cd9ba82bb2cd95f6c.svg'

export function TmdbAttribution({ className }: { className?: string }) {
  const [logoFailed, setLogoFailed] = useState(false)

  return (
    <div
      className={cn(
        'flex flex-col gap-3 text-xs leading-5 text-cinema-muted/70 sm:flex-row sm:items-center sm:justify-between',
        className,
      )}
    >
      <p>
        This product uses the TMDB API but is not endorsed or certified by TMDB.
      </p>
      <a
        href={tmdbWebsite}
        target="_blank"
        rel="noreferrer"
        className="inline-flex shrink-0 items-center gap-2 text-cinema-muted transition-colors hover:text-cinema-text"
        aria-label="Visit The Movie Database"
      >
        {logoFailed ? (
          <span className="font-display text-sm font-semibold tracking-tight text-cinema-text">
            TMDB
          </span>
        ) : (
          <img
            src={tmdbLogoSrc}
            alt="TMDB"
            loading="lazy"
            onError={() => setLogoFailed(true)}
            className="h-4 w-auto"
          />
        )}
      </a>
    </div>
  )
}
