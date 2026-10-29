import type { ReactNode } from 'react'
import { Logo } from '../../components/layout/Logo'

interface AuthLayoutProps {
  title: string
  description: string
  children: ReactNode
  footer?: ReactNode
}

export function AuthLayout({
  title,
  description,
  children,
  footer,
}: AuthLayoutProps) {
  return (
    <div className="mx-auto w-full max-w-md px-4 py-12 sm:px-6 sm:py-16">
      <div className="rounded-3xl border border-cinema-border bg-cinema-surface/60 p-6 shadow-xl shadow-black/20 sm:p-8">
        <Logo className="mb-8" />
        <h1 className="font-display text-2xl font-semibold tracking-tight text-cinema-text">
          {title}
        </h1>
        <p className="mt-2 text-sm leading-6 text-cinema-muted">
          {description}
        </p>
        <div className="mt-6">{children}</div>
      </div>
      {footer ? (
        <div className="mt-6 text-center text-sm leading-6 text-cinema-muted">
          {footer}
        </div>
      ) : null}
    </div>
  )
}
