import { cn } from '../../lib/cn'

export type ButtonVariant = 'primary' | 'secondary' | 'ghost'
export type ButtonSize = 'sm' | 'md' | 'lg'

const variantClasses: Record<ButtonVariant, string> = {
  primary:
    'bg-cinema-accent text-white shadow-lg shadow-cinema-accent/20 hover:bg-cinema-accent-strong',
  secondary:
    'border border-cinema-border bg-cinema-surface text-cinema-text hover:border-cinema-accent/60 hover:bg-cinema-surface-2',
  ghost: 'text-cinema-muted hover:bg-white/5 hover:text-cinema-text',
}

const sizeClasses: Record<ButtonSize, string> = {
  sm: 'h-9 px-4 text-sm',
  md: 'h-11 px-5 text-sm',
  lg: 'h-12 px-6 text-base',
}

export function buttonClasses(
  variant: ButtonVariant = 'primary',
  size: ButtonSize = 'md',
  className?: string,
): string {
  return cn(
    'inline-flex items-center justify-center gap-2 rounded-full font-medium transition-colors',
    'disabled:cursor-not-allowed disabled:opacity-50',
    variantClasses[variant],
    sizeClasses[size],
    className,
  )
}
