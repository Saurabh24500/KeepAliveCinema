import { useState, type FormEvent } from 'react'
import { Link, Navigate, useLocation, useNavigate } from 'react-router-dom'
import { Button } from '../components/ui/Button'
import { FormField } from '../components/ui/FormField'
import { AuthLayout } from '../features/auth/AuthLayout'
import { AuthLoadingState } from '../features/auth/AuthLoadingState'
import { ConfigNotice } from '../features/auth/ConfigNotice'
import { useAuth } from '../features/auth/auth-context'
import { isValidEmail } from '../features/auth/validation'

interface SignInLocationState {
  from?: { pathname?: string }
}

export function SignInPage() {
  const { signIn, session, loading, configured } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const from = (location.state as SignInLocationState | null)?.from?.pathname

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)

  if (loading) {
    return <AuthLoadingState />
  }

  if (session) {
    return <Navigate to={from ?? '/account'} replace />
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setError(null)

    const trimmedEmail = email.trim()

    if (!trimmedEmail || !password) {
      setError('Enter your email and password.')
      return
    }
    if (!isValidEmail(trimmedEmail)) {
      setError('Enter a valid email address.')
      return
    }

    setSubmitting(true)
    const result = await signIn(trimmedEmail, password)
    setSubmitting(false)

    if (result.error) {
      setError(result.error)
      return
    }

    navigate(from ?? '/account', { replace: true })
  }

  return (
    <AuthLayout
      title="Welcome back"
      description="Sign in to keep your journal, ratings, and viewing history in sync."
      footer={
        <p>
          New here?{' '}
          <Link
            to="/signup"
            className="font-medium text-cinema-accent hover:underline"
          >
            Create an account
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
            autoComplete="current-password"
            placeholder="Your password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            disabled={submitting}
          />

          <div className="flex justify-end">
            <Link
              to="/forgot-password"
              className="text-xs font-medium text-cinema-muted hover:text-cinema-text"
            >
              Forgot password?
            </Link>
          </div>

          <Button
            type="submit"
            size="lg"
            className="w-full"
            disabled={submitting}
          >
            {submitting ? 'Signing in…' : 'Sign in'}
          </Button>
        </form>
      ) : (
        <ConfigNotice />
      )}
    </AuthLayout>
  )
}
