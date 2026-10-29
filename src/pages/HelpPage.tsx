import { usePageTitle } from '../hooks/usePageTitle'

export function HelpPage() {
  usePageTitle('Help')

  return (
    <div className="mx-auto w-full max-w-4xl px-4 py-12 sm:px-6 lg:px-8">
      <header className="mb-8">
        <h1 className="font-display text-3xl font-semibold tracking-tight text-cinema-text sm:text-4xl">
          Help & FAQ
        </h1>
      </header>

      <div className="space-y-6 text-sm leading-7 text-cinema-muted">
        <section>
          <h2 className="mb-2 text-lg font-semibold text-cinema-text">How do I add to journal?</h2>
          <p>Go to Discover or a media detail page, sign in, and click Add to journal.</p>
        </section>

        <section>
          <h2 className="mb-2 text-lg font-semibold text-cinema-text">How do spoilers work?</h2>
          <p>Mark posts as containing spoilers. Others need to click Reveal to view.</p>
        </section>

        <section>
          <h2 className="mb-2 text-lg font-semibold text-cinema-text">Forgot password?</h2>
          <p>Use Forgot password on sign in page.</p>
        </section>
      </div>
    </div>
  )
}
