import { Film } from 'lucide-react'
import { Link } from 'react-router-dom'
import { cn } from '../../lib/cn'

interface LogoProps {
  onClick?: () => void
  className?: string
}

export function Logo({ onClick, className }: LogoProps) {
  return (
    <Link
      to="/"
      onClick={onClick}
      className={cn('flex items-center gap-3 rounded-xl', className)}
      aria-label="KeepAliveMovie home"
    >
      <span className="flex size-10 items-center justify-center rounded-xl bg-cinema-accent/15 text-cinema-accent ring-1 ring-cinema-accent/30">
        <Film aria-hidden="true" className="size-5" />
      </span>
      <span className="flex flex-col leading-tight">
        <span className="font-display text-base font-semibold tracking-tight text-cinema-text">
          KeepAliveMovie
        </span>
        <span className="text-[11px] uppercase tracking-[0.18em] text-cinema-muted">
          Stories stay alive
        </span>
      </span>
    </Link>
  )
}
