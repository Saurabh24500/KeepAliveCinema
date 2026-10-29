import { usePageTitle } from '../hooks/usePageTitle'

export function PrivacyPage() {
  usePageTitle('Privacy Policy')

  return (
    <div className="mx-auto w-full max-w-4xl px-4 py-12 sm:px-6 lg:px-8">
      <header className="mb-8">
        <h1 className="font-display text-3xl font-semibold tracking-tight text-cinema-text sm:text-4xl">
          Privacy Policy
        </h1>
        <p className="mt-2 text-sm text-cinema-muted">Last updated: October 2026</p>
      </header>

      <div className="space-y-6 text-sm leading-7 text-cinema-muted">
        <section>
          <h2 className="mb-2 text-lg font-semibold text-cinema-text">Information We Collect</h2>
          <p>We collect only the information you provide when creating an account (email) and profile details you choose to add.</p>
        </section>

        <section>
          <h2 className="mb-2 text-lg font-semibold text-cinema-text">How We Use</h2>
          <p>We use your data to provide the journal and community features. We do not sell your personal data.</p>
        </section>

        <section>
          <h2 className="mb-2 text-lg font-semibold text-cinema-text">Third-Party Services</h2>
          <p>We use Supabase for authentication and database. We use TMDB for movie/TV metadata. Both have their own policies.</p>
        </section>

        <section>
          <h2 className="mb-2 text-lg font-semibold text-cinema-text">Your Rights</h2>
          <p>You can update or delete your profile and journal entries anytime.</p>
        </section>
      </div>
    </div>
  )
}
