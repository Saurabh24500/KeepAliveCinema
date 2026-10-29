import { Clapperboard, ExternalLink } from 'lucide-react'

export function TmdbConfigNotice() {
  return (
    <div className="rounded-3xl border border-amber-400/25 bg-amber-400/5 p-6 text-left sm:p-8">
      <div className="flex items-center gap-3">
        <span className="flex size-11 items-center justify-center rounded-2xl bg-amber-400/10 text-amber-200">
          <Clapperboard aria-hidden="true" className="size-5" />
        </span>
        <h2 className="font-display text-lg font-semibold text-cinema-text">
          TMDB is not configured yet
        </h2>
      </div>
      <p className="mt-4 max-w-2xl text-sm leading-6 text-cinema-muted">
        Live discovery uses TMDB metadata and images. Add a free TMDB API key to
        your local environment file, then restart the dev server:
      </p>
      <pre className="mt-4 overflow-x-auto rounded-xl border border-cinema-border bg-cinema-bg p-3 text-xs leading-6 text-cinema-text">
        <code>VITE_TMDB_API_KEY=your-tmdb-api-key</code>
      </pre>
      <p className="mt-4 max-w-2xl text-xs leading-5 text-cinema-muted/80">
        The key is exposed to the browser, so use a non-commercial TMDB key and
        do not put any server secret in a <code>VITE_</code> variable. Anime is
        approximated as Japanese-language animation; TMDB does not expose a
        perfect anime classification.
      </p>
      <a
        href="https://www.themoviedb.org/settings/api"
        target="_blank"
        rel="noreferrer"
        className="mt-5 inline-flex items-center gap-2 text-sm font-medium text-cinema-accent transition-colors hover:text-cinema-text"
      >
        Request a TMDB API key
        <ExternalLink aria-hidden="true" className="size-3.5" />
      </a>
    </div>
  )
}
