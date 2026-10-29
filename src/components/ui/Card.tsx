import type { ComponentPropsWithoutRef } from 'react'
import { cn } from '../../lib/cn'

export function Card({ className, ...props }: ComponentPropsWithoutRef<'div'>) {
  return (
    <div
      className={cn(
        'rounded-3xl border border-cinema-border bg-cinema-surface/70 p-6',
        className,
      )}
      {...props}
    />
  )
}
