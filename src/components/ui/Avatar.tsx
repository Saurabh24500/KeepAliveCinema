import { useState } from 'react'
import { cn } from '../../lib/cn'

interface AvatarProps {
  src?: string | null
  name: string
  className?: string
}

export function Avatar({ src, name, className }: AvatarProps) {
  const [failedSrc, setFailedSrc] = useState<string | null>(null)
  const initial = name.trim().charAt(0).toUpperCase() || '?'
  const showImage = Boolean(src) && failedSrc !== src

  return (
    <span
      className={cn(
        'flex shrink-0 items-center justify-center overflow-hidden rounded-full bg-cinema-accent/15 font-display font-semibold text-cinema-accent ring-1 ring-cinema-accent/30',
        className,
      )}
    >
      {showImage && src ? (
        <img
          src={src}
          alt={`${name || 'User'} avatar`}
          loading="lazy"
          className="size-full object-cover"
          onError={() => setFailedSrc(src)}
        />
      ) : (
        <span aria-hidden="true">{initial}</span>
      )}
    </span>
  )
}
