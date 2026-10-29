import { AlertTriangle } from 'lucide-react'
import { Button } from './Button'
import { cn } from '../../lib/cn'

interface ErrorStateProps {
  title?: string
  description?: string
  onRetry?: () => void
  className?: string
}

export function ErrorState({
  title = 'Something went wrong',
  description = 'We could not load this section. Check your connection and try again.',
  onRetry,
  className,
}: ErrorStateProps) {
  return (
    <div
      role="alert"
      className={cn(
        'flex flex-col items-center rounded-3xl border border-red-500/20 bg-red-500/5 px-6 py-12 text-center',
        className,
      )}
    >
      <span className="mb-4 flex size-12 items-center justify-center rounded-2xl bg-red-500/10 text-red-300">
        <AlertTriangle aria-hidden="true" className="size-6" />
      </span>
      <h2 className="font-display text-lg font-semibold text-cinema-text">
        {title}
      </h2>
      <p className="mt-2 max-w-md text-sm leading-6 text-cinema-muted">
        {description}
      </p>
      {onRetry ? (
        <Button variant="secondary" size="sm" className="mt-6" onClick={onRetry}>
          Try again
        </Button>
      ) : null}
    </div>
  )
}
