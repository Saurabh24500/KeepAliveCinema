import type { Session } from '@supabase/supabase-js'
import { useEffect, useMemo, useState, type ReactNode } from 'react'
import { isSupabaseConfigured, supabase } from '../../lib/supabase'
import {
  AuthContext,
  type AuthContextValue,
  type AuthResult,
} from './auth-context'
import { readableAuthError } from './auth-errors'

const notConfiguredError =
  'Supabase is not configured. Add your project URL and publishable key to .env.local, then restart the dev server.'

export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<Session | null>(null)
  const [loading, setLoading] = useState(isSupabaseConfigured)

  useEffect(() => {
    const client = supabase

    if (!client) {
      return
    }

    let active = true

    client.auth.getSession().then(({ data }) => {
      if (!active) return
      setSession(data.session)
      setLoading(false)
    })

    const {
      data: { subscription },
    } = client.auth.onAuthStateChange((_event, nextSession) => {
      if (!active) return
      setSession(nextSession)
      setLoading(false)
    })

    return () => {
      active = false
      subscription.unsubscribe()
    }
  }, [])

  const value = useMemo<AuthContextValue>(() => {
    async function signIn(email: string, password: string): Promise<AuthResult> {
      if (!supabase) return { error: notConfiguredError }

      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      return { error: error ? readableAuthError(error.message) : null }
    }

    async function signUp(email: string, password: string): Promise<AuthResult> {
      if (!supabase) return { error: notConfiguredError }

      const { data, error } = await supabase.auth.signUp({ email, password })

      return {
        error: error ? readableAuthError(error.message) : null,
        needsEmailConfirmation: !error && !data.session,
      }
    }

    async function signOut(): Promise<AuthResult> {
      if (!supabase) return { error: null }

      const { error } = await supabase.auth.signOut()

      return { error: error ? readableAuthError(error.message) : null }
    }

    async function requestPasswordReset(email: string): Promise<AuthResult> {
      if (!supabase) return { error: notConfiguredError }

      const redirectTo = `${window.location.origin}/reset-password`
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo,
      })

      return { error: error ? readableAuthError(error.message) : null }
    }

    async function updatePassword(password: string): Promise<AuthResult> {
      if (!supabase) return { error: notConfiguredError }

      const { error } = await supabase.auth.updateUser({ password })

      return { error: error ? readableAuthError(error.message) : null }
    }

    async function signInWithGoogle(): Promise<AuthResult> {
      if (!supabase) return { error: notConfiguredError }

      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: window.location.origin,
        },
      })

      return { error: error ? readableAuthError(error.message) : null }
    }

    return {
      session,
      user: session?.user ?? null,
      loading,
      configured: isSupabaseConfigured,
      signIn,
      signUp,
      signOut,
      requestPasswordReset,
      updatePassword,
      signInWithGoogle,
    }
  }, [session, loading])

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
