import { MailCheck } from 'lucide-react'
import { useState, type FormEvent } from 'react'
import { Link } from 'react-router-dom'
import { Button } from '../components/ui/Button'
import { FormField } from '../components/ui/FormField'
import { AuthLayout } from '../features/auth/AuthLayout'
import { ConfigNotice } from '../features/auth/ConfigNotice'
import { useAuth } from '../features/auth/auth-context'
import { isValidEmail } from '../features/auth/validation'

export function ForgotPasswordPage() {
  const { requestPasswordReset, configured } = useAuth()

  const [email, setEmail] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)
  const [sentTo, setSentTo] = useState<string | null>(null)

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setError(null)

    const trimmedEmail = email.trim()

    if (!isValidEmail(trimmedEmail)) {
      setError('Enter a valid email address.')
      return
    }

    setSubmitting(true)
    const result = await requestPasswordReset(trimmedEmail)
    setSubmitting(false)

    if (result.error) {
      setError(result.error)
      return
    }

    setSentTo(trimmedEmail)
  }

  return (
    <AuthLayout
      title="Reset your password"
      description="Enter your account email and we will send a reset link."
      footer={
        <p>
          Remembered it?{' '}
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
      ) : sentTo ? (
        <div className="rounded-2xl border border-emerald-400/25 bg-emerald-400/5 p-5">
          <MailCheck aria-hidden="true" className="size-6 text-emerald-300" />
          <p className="mt-3 text-sm leading-6 text-cinema-muted">
            If an account exists for{' '}
            <span className="font-medium text-cinema-text">{sentTo}</span>, a
            password reset link is on its way. Check your spam folder if it
            does not arrive.
          </p>
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
            label="Email"
            type="email"
            name="email"
            autoComplete="email"
            placeholder="you@example.com"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            disabled={submitting}
          />

          <Button
            type="submit"
            size="lg"
            className="w-full"
            disabled={submitting}
          >
            {submitting ? 'Sending reset link…' : 'Send reset link'}
          </Button>

          <p className="text-xs leading-5 text-cinema-muted/80">
            The reset link requires the `/reset-password` URL to be allowed in
            your Supabase Auth redirect settings.
          </p>
        </form>
      )}
    </AuthLayout>
  )
}
