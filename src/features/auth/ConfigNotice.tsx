import { Database } from 'lucide-react'

export function ConfigNotice() {
  return (
    <div className="rounded-2xl border border-amber-400/25 bg-amber-400/5 p-5 text-left">
      <div className="flex items-center gap-3">
        <Database aria-hidden="true" className="size-5 text-amber-300" />
        <h2 className="font-display text-sm font-semibold text-cinema-text">
          Supabase is not configured yet
        </h2>
      </div>
      <p className="mt-3 text-sm leading-6 text-cinema-muted">
        Create a Supabase project, then copy the environment file and add your
        project credentials:
      </p>
      <pre className="mt-3 overflow-x-auto rounded-xl border border-cinema-border bg-cinema-bg p-3 text-xs leading-6 text-cinema-text">
        <code>Copy-Item .env.example .env.local</code>
      </pre>
      <ul className="mt-3 space-y-1.5 text-sm leading-6 text-cinema-muted">
        <li>
          <code className="text-cinema-text">VITE_SUPABASE_URL</code> — project
          URL
        </li>
        <li>
          <code className="text-cinema-text">
            VITE_SUPABASE_PUBLISHABLE_KEY
          </code>{' '}
          — publishable/anon key
        </li>
      </ul>
      <p className="mt-3 text-xs leading-5 text-cinema-muted/80">
        Restart the dev server after saving. Never use the service-role key in
        the browser.
      </p>
    </div>
  )
}
