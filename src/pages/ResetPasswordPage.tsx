import { CheckCircle2, KeyRound } from 'lucide-react'
import { useState, type FormEvent } from 'react'
import { Link } from 'react-router-dom'
import { Button } from '../components/ui/Button'
import { FormField } from '../components/ui/FormField'
import { AuthLayout } from '../features/auth/AuthLayout'
import { AuthLoadingState } from '../features/auth/AuthLoadingState'
import { ConfigNotice } from '../features/auth/ConfigNotice'
import { useAuth } from '../features/auth/auth-context'
import { minimumPasswordLength } from '../features/auth/validation'

export function ResetPasswordPage() {
  const { session, loading, configured, updatePassword } = useAuth()

  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)
  const [updated, setUpdated] = useState(false)

  if (loading) {
    return <AuthLoadingState />
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setError(null)

    if (!password || !confirmPassword) {
      setError('Enter and confirm your new password.')
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
    const result = await updatePassword(password)
    setSubmitting(false)

    if (result.error) {
      setError(result.error)
      return
    }

    setUpdated(true)
  }

  return (
    <AuthLayout
      title="Choose a new password"
      description="Set a new password for your KeepAliveMovie account."
      footer={
        <p>
          <Link
            to="/signin"
            className="font-medium text-cinema-accent hover:underline"
          >
            Back to sign in
          </Link>
        </p>
      }
    >
      {!configured ? (
        <ConfigNotice />
      ) : updated ? (
        <div className="rounded-2xl border border-emerald-400/25 bg-emerald-400/5 p-5">
          <CheckCircle2
            aria-hidden="true"
            className="size-6 text-emerald-300"
          />
          <p className="mt-3 text-sm leading-6 text-cinema-muted">
            Your password has been updated. You can continue to your account.
          </p>
          <Link
            to="/account"
            className="mt-4 inline-flex text-sm font-medium text-cinema-accent hover:underline"
          >
            Go to account
          </Link>
        </div>
      ) : !session ? (
        <div className="rounded-2xl border border-amber-400/25 bg-amber-400/5 p-5">
          <KeyRound aria-hidden="true" className="size-6 text-amber-300" />
          <p className="mt-3 text-sm leading-6 text-cinema-muted">
            This page needs a valid reset link. Request a new one if your link
            has expired.
          </p>
          <Link
            to="/forgot-password"
            className="mt-4 inline-flex text-sm font-medium text-cinema-accent hover:underline"
          >
            Request a new reset link
          </Link>
        </div>
      ) : (
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
            label="New password"
            type="password"
            name="password"
            autoComplete="new-password"
            placeholder="Create a new password"
            hint={`Use at least ${minimumPasswordLength} characters.`}
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            disabled={submitting}
          />

          <FormField
            label="Confirm new password"
            type="password"
            name="confirmPassword"
            autoComplete="new-password"
            placeholder="Repeat the new password"
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
            {submitting ? 'Updating password…' : 'Update password'}
          </Button>
        </form>
      )}
    </AuthLayout>
  )
}
