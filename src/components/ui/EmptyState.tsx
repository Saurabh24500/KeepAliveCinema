import type { LucideIcon } from 'lucide-react'
import type { ReactNode } from 'react'
import { cn } from '../../lib/cn'

interface EmptyStateProps {
  icon: LucideIcon
  title: string
  description: string
  action?: ReactNode
  className?: string
}

export function EmptyState({
  icon: Icon,
  title,
  description,
  action,
  className,
}: EmptyStateProps) {
  return (
    <div
      className={cn(
        'flex flex-col items-center rounded-3xl border border-dashed border-cinema-border bg-cinema-surface/40 px-6 py-14 text-center',
        className,
      )}
    >
      <span className="mb-5 flex size-14 items-center justify-center rounded-2xl bg-cinema-accent/10 text-cinema-accent">
        <Icon aria-hidden="true" className="size-7" />
      </span>
      <h2 className="font-display text-xl font-semibold text-cinema-text">
        {title}
      </h2>
      <p className="mt-2 max-w-md text-sm leading-6 text-cinema-muted">
        {description}
      </p>
      {action ? <div className="mt-6">{action}</div> : null}
    </div>
  )
}
