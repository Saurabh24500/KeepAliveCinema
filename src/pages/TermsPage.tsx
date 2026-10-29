import { usePageTitle } from '../hooks/usePageTitle'

export function TermsPage() {
  usePageTitle('Terms of Service')

  return (
    <div className="mx-auto w-full max-w-4xl px-4 py-12 sm:px-6 lg:px-8">
      <header className="mb-8">
        <h1 className="font-display text-3xl font-semibold tracking-tight text-cinema-text sm:text-4xl">
          Terms of Service
        </h1>
        <p className="mt-2 text-sm text-cinema-muted">Last updated: October 2026</p>
      </header>

      <div className="space-y-6 text-sm leading-7 text-cinema-muted">
        <section>
          <h2 className="mb-2 text-lg font-semibold text-cinema-text">Use of Service</h2>
          <p>KeepAliveMovie is for personal use to track and discuss movies, anime, and series.</p>
        </section>

        <section>
          <h2 className="mb-2 text-lg font-semibold text-cinema-text">Content</h2>
          <p>You are responsible for content you post. Keep it respectful and follow spoiler guidelines.</p>
        </section>

        <section>
          <h2 className="mb-2 text-lg font-semibold text-cinema-text">Disclaimer</h2>
          <p>This product uses the TMDB API but is not endorsed or certified by TMDB.</p>
        </section>
      </div>
    </div>
  )
}
