import { MailCheck } from 'lucide-react'
import { useState, type FormEvent } from 'react'
import { Link, Navigate } from 'react-router-dom'
import { Button } from '../components/ui/Button'
import { FormField } from '../components/ui/FormField'
import { AuthLayout } from '../features/auth/AuthLayout'
import { AuthLoadingState } from '../features/auth/AuthLoadingState'
import { ConfigNotice } from '../features/auth/ConfigNotice'
import { useAuth } from '../features/auth/auth-context'
import {
  isValidEmail,
  minimumPasswordLength,
} from '../features/auth/validation'

export function SignUpPage() {
  const { signUp, session, loading, configured } = useAuth()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)
  const [confirmationEmail, setConfirmationEmail] = useState<string | null>(
    null,
  )

  if (loading) {
    return <AuthLoadingState />
  }

  if (session) {
    return <Navigate to="/account" replace />
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setError(null)

    const trimmedEmail = email.trim()

    if (!trimmedEmail || !password || !confirmPassword) {
      setError('Fill in all fields to create your account.')
      return
    }
    if (!isValidEmail(trimmedEmail)) {
      setError('Enter a valid email address.')
      return
    }
    if (password.length < minimumPasswordLength) {
      setError(
        `Use a password with at least ${minimumPasswordLength} characters.`,
      )
      return
    }
    if (password !== confirmPassword) {
      setError('Passwords do not match.')
      return
    }

    setSubmitting(true)
    const result = await signUp(trimmedEmail, password)
    setSubmitting(false)

    if (result.error) {
      setError(result.error)
      return
    }

    if (result.needsEmailConfirmation) {
      setConfirmationEmail(trimmedEmail)
    }
  }

  if (confirmationEmail) {
    return (
      <AuthLayout
        title="Check your email"
        description="One more step before your journal is ready."
        footer={
          <p>
            Already confirmed?{' '}
            <Link
              to="/signin"
              className="font-medium text-cinema-accent hover:underline"
            >
              Sign in
            </Link>
          </p>
        }
      >
        <div className="rounded-2xl border border-emerald-400/25 bg-emerald-400/5 p-5">
          <MailCheck
            aria-hidden="true"
            className="size-6 text-emerald-300"
          />
          <p className="mt-3 text-sm leading-6 text-cinema-muted">
            We sent a confirmation link to{' '}
            <span className="font-medium text-cinema-text">
              {confirmationEmail}
            </span>
            . Open it to activate your account, then come back and sign in.
          </p>
        </div>
      </AuthLayout>
    )
  }

  return (
    <AuthLayout
      title="Create your account"
      description="Start keeping the movies, anime, and series you love in one place."
      footer={
        <p>
          Already have an account?{' '}
          <Link
            to="/signin"
            className="font-medium text-cinema-accent hover:underline"
          >
            Sign in
          </Link>
        </p>
      }
    >
      {configured ? (
        <form className="space-y-4" onSubmit={handleSubmit} noValidate>
          {error ? (
            <p
              role="alert"
              className="rounded-xl border border-red-400/25 bg-red-400/5 px-3.5 py-3 text-sm leading-6 text-red-300"
            >
              {error}
            </p>
          ) : null}

          <FormField
            label="Email"
            type="email"
            name="email"
            autoComplete="email"
            placeholder="you@example.com"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            disabled={submitting}
          />

          <FormField
            label="Password"
            type="password"
            name="password"
            autoComplete="new-password"
            placeholder="Create a password"
            hint={`Use at least ${minimumPasswordLength} characters.`}
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            disabled={submitting}
          />

          <FormField
            label="Confirm password"
            type="password"
            name="confirmPassword"
            autoComplete="new-password"
            placeholder="Repeat your password"
            value={confirmPassword}
            onChange={(event) => setConfirmPassword(event.target.value)}
            disabled={submitting}
          />

          <Button
            type="submit"
            size="lg"
            className="w-full"
            disabled={submitting}
          >
            {submitting ? 'Creating account…' : 'Create account'}
          </Button>

          <p className="text-xs leading-5 text-cinema-muted/80">
            If email confirmation is enabled in Supabase, you will need to
            confirm your address before signing in.
          </p>
        </form>
      ) : (
        <ConfigNotice />
      )}
    </AuthLayout>
  )
}
