import { useEffect } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../auth/auth-context'
import { useProfile } from './profile-context'

export function OnboardingGate() {
  const { user } = useAuth()
  const { profile, loading } = useProfile()
  const location = useLocation()
  const navigate = useNavigate()

  useEffect(() => {
    if (!user || loading || !profile) return

    if (
      !profile.onboarding_completed &&
      location.pathname !== '/onboarding'
    ) {
      navigate('/onboarding', { replace: true })
    }
  }, [user, loading, profile, location.pathname, navigate])

  return null
}
