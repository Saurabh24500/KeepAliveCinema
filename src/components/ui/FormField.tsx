import { useId, type ComponentPropsWithoutRef } from 'react'
import { cn } from '../../lib/cn'

interface FormFieldProps extends ComponentPropsWithoutRef<'input'> {
  label: string
  error?: string
  hint?: string
}

export function FormField({
  label,
  error,
  hint,
  id,
  className,
  ...props
}: FormFieldProps) {
  const generatedId = useId()
  const inputId = id ?? generatedId
  const hintId = hint ? `${inputId}-hint` : undefined
  const errorId = error ? `${inputId}-error` : undefined
  const describedBy = [hintId, errorId].filter(Boolean).join(' ') || undefined

  return (
    <div>
      <label
        htmlFor={inputId}
        className="mb-1.5 block text-sm font-medium text-cinema-text"
      >
        {label}
      </label>
      <input
        id={inputId}
        aria-invalid={error ? true : undefined}
        aria-describedby={describedBy}
        className={cn(
          'h-11 w-full rounded-xl border border-cinema-border bg-cinema-bg px-3.5 text-sm text-cinema-text',
          'placeholder:text-cinema-muted/50 focus:border-cinema-accent focus:outline-none focus-visible:outline-none',
          'disabled:cursor-not-allowed disabled:opacity-60',
          'aria-invalid:border-red-400/60',
          className,
        )}
        {...props}
      />
      {hint ? (
        <p id={hintId} className="mt-1.5 text-xs leading-5 text-cinema-muted">
          {hint}
        </p>
      ) : null}
      {error ? (
        <p id={errorId} role="alert" className="mt-1.5 text-xs text-red-300">
          {error}
        </p>
      ) : null}
    </div>
  )
}
