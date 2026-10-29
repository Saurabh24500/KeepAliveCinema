export function readableAuthError(message: string): string {
  const normalized = message.toLowerCase()

  if (normalized.includes('invalid login credentials')) {
    return 'Email or password is incorrect.'
  }
  if (normalized.includes('email not confirmed')) {
    return 'Confirm your email address before signing in.'
  }
  if (normalized.includes('user already registered')) {
    return 'An account with this email already exists.'
  }
  if (normalized.includes('unable to validate email address')) {
    return 'Enter a valid email address.'
  }
  if (normalized.includes('email rate limit exceeded')) {
    return 'Too many email attempts. Wait a moment and try again.'
  }
  if (normalized.includes('password should be at least')) {
    return 'Choose a longer password.'
  }
  if (normalized.includes('new password should be different')) {
    return 'Choose a password you have not used before.'
  }

  return message
}
