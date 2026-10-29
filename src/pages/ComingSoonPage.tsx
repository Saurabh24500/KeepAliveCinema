import type { LucideIcon } from 'lucide-react'
import { ArrowRight, Check } from 'lucide-react'
import { Link } from 'react-router-dom'
import { EmptyState } from '../components/ui/EmptyState'
import { buttonClasses } from '../components/ui/buttonStyles'

interface ComingSoonPageProps {
  label: string
  milestone: string
  title: string
  description: string
  icon: LucideIcon
  planned: string[]
}

export function ComingSoonPage({
  label,
  milestone,
  title,
  description,
  icon,
  planned,
}: ComingSoonPageProps) {
  return (
    <div className="mx-auto w-full max-w-3xl px-4 py-14 sm:px-6 lg:px-8 lg:py-20">
      <p className="text-xs font-semibold uppercase tracking-[0.2em] text-cinema-accent">
        {label}
      </p>
      <h1 className="mt-3 font-display text-4xl font-semibold tracking-tight text-cinema-text sm:text-5xl">
        Coming in {milestone}
      </h1>

      <EmptyState
        icon={icon}
        title={title}
        description={description}
        className="mt-8 bg-cinema-surface/30"
        action={
          <Link
            to="/"
            className={buttonClasses('secondary', 'md')}
          >
            Back to home
            <ArrowRight aria-hidden="true" className="size-4" />
          </Link>
        }
      />

      <div className="mt-8 rounded-3xl border border-cinema-border bg-cinema-surface/40 p-6">
        <h2 className="font-display text-base font-semibold text-cinema-text">
          What this area will include
        </h2>
        <ul className="mt-4 space-y-3">
          {planned.map((item) => (
            <li
              key={item}
              className="flex gap-3 text-sm leading-6 text-cinema-muted"
            >
              <Check
                aria-hidden="true"
                className="mt-2 size-3.5 shrink-0 text-cinema-accent"
              />
              {item}
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}
