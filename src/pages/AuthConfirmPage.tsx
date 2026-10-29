import { CheckCircle, XCircle } from 'lucide-react'
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Button } from '../components/ui/Button'
import { AuthLayout } from '../features/auth/AuthLayout'
import { useAuth } from '../features/auth/auth-context'
import { supabase } from '../lib/supabase'

export function AuthConfirmPage() {
  const { session } = useAuth()
  const navigate = useNavigate()
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading')
  const [message, setMessage] = useState('Verifying your email...')

  useEffect(() => {
    async function verify() {
      const client = supabase
      if (!client) {
        setStatus('error')
        setMessage('Supabase not configured')
        return
      }
      try {
        const { error } = await client.auth.getSession()
        if (error) {
          setStatus('error')
          setMessage(error.message)
          return
        }
        setStatus('success')
        setMessage('Email confirmed! You can now sign in.')
        setTimeout(() => navigate('/signin'), 2000)
      } catch (err) {
        setStatus('error')
        setMessage(err instanceof Error ? err.message : 'Verification failed')
      }
    }
    void verify()
  }, [navigate])

  useEffect(() => {
    if (session) {
      setStatus('success')
      setMessage('Email confirmed! Redirecting...')
      setTimeout(() => navigate('/account'), 1500)
    }
  }, [session, navigate])

  return (
    <AuthLayout
      title={status === 'success' ? 'Email confirmed' : status === 'error' ? 'Confirmation failed' : 'Verifying'}
      description="Almost there"
    >
      <div className="flex flex-col items-center gap-4 text-center">
        {status === 'loading' && <div className="h-8 w-8 animate-spin rounded-full border-2 border-cinema-accent border-t-transparent" />}
        {status === 'success' && <CheckCircle className="h-12 w-12 text-emerald-400" />}
        {status === 'error' && <XCircle className="h-12 w-12 text-red-400" />}
        <p className="text-sm text-cinema-muted">{message}</p>
        {status === 'error' && (
          <div className="flex gap-2">
            <Button onClick={() => navigate('/signin')}>Go to sign in</Button>
            <Button variant="ghost" onClick={() => navigate('/signup')}>
              Sign up again
            </Button>
          </div>
        )}
        {status === 'success' && !session && (
          <Button onClick={() => navigate('/signin')}>Sign in now</Button>
        )}
      </div>
    </AuthLayout>
  )
}
