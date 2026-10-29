import { LoaderCircle } from 'lucide-react'

export function AuthLoadingState() {
  return (
    <div
      role="status"
      aria-live="polite"
      className="flex min-h-[50vh] flex-col items-center justify-center gap-4 px-4 py-16 text-center"
    >
      <LoaderCircle
        aria-hidden="true"
        className="size-7 animate-spin text-cinema-accent"
      />
      <p className="text-sm text-cinema-muted">Checking your session…</p>
    </div>
  )
}
