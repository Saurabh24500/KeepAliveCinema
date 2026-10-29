import { Camera, Trash2 } from 'lucide-react'
import { useRef, useState, type FormEvent } from 'react'
import { Avatar } from '../../components/ui/Avatar'
import { Button } from '../../components/ui/Button'
import { FormField } from '../../components/ui/FormField'
import { useProfile } from './profile-context'
import {
  calculateProfileCompletion,
  favoriteGenres,
  maximumAvatarBytes,
  maximumBioLength,
  maximumFavoriteGenres,
  profileDisplayName,
  type Profile,
} from './profile-types'
import { cn } from '../../lib/cn'

const usernamePattern = /^[a-z0-9_]{3,24}$/

export function ProfileForm({ profile }: { profile: Profile }) {
  const { saveProfile, uploadAvatar, removeAvatar } = useProfile()
  const fileInputRef = useRef<HTMLInputElement>(null)

  const [displayName, setDisplayName] = useState(profile.display_name)
  const [username, setUsername] = useState(profile.username)
  const [bio, setBio] = useState(profile.bio)
  const [selectedGenres, setSelectedGenres] = useState<string[]>(
    profile.favorite_genres,
  )
  const [error, setError] = useState<string | null>(null)
  const [savedMessage, setSavedMessage] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)
  const [avatarBusy, setAvatarBusy] = useState(false)

  const completion = calculateProfileCompletion(profile)
  const displayLabel = profileDisplayName(profile)

  async function handleSave(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setError(null)
    setSavedMessage(null)

    const trimmedName = displayName.trim()

    if (!trimmedName) {
      setError('Add a display name.')
      return
    }
    if (trimmedName.length > 60) {
      setError('Keep your display name under 60 characters.')
      return
    }
    if (!usernamePattern.test(username)) {
      setError(
        'Usernames need 3–24 lowercase letters, numbers, or underscores.',
      )
      return
    }
    if (bio.length > maximumBioLength) {
      setError(`Keep your bio under ${maximumBioLength} characters.`)
      return
    }
    if (selectedGenres.length === 0) {
      setError('Choose at least one favorite genre.')
      return
    }

    setSubmitting(true)
    const result = await saveProfile({
      username,
      display_name: trimmedName,
      bio: bio.trim(),
      favorite_genres: selectedGenres,
    })
    setSubmitting(false)

    if (result.error) {
      setError(result.error)
      return
    }

    setSavedMessage('Profile saved.')
  }

  async function handleAvatarChange(file: File | undefined) {
    if (!file) return

    setError(null)
    setSavedMessage(null)

    if (file.size > maximumAvatarBytes) {
      setError('Choose an image smaller than 2 MB.')
      return
    }

    setAvatarBusy(true)
    const result = await uploadAvatar(file)
    setAvatarBusy(false)

    if (result.error) {
      setError(result.error)
      return
    }

    setSavedMessage('Avatar updated.')
  }

  async function handleRemoveAvatar() {
    setError(null)
    setSavedMessage(null)
    setAvatarBusy(true)
    const result = await removeAvatar()
    setAvatarBusy(false)

    if (result.error) {
      setError(result.error)
      return
    }

    setSavedMessage('Avatar removed.')
  }

  function toggleGenre(genre: string) {
    setSavedMessage(null)
    setSelectedGenres((current) => {
      if (current.includes(genre)) {
        return current.filter((item) => item !== genre)
      }
      if (current.length >= maximumFavoriteGenres) {
        return current
      }
      return [...current, genre]
    })
  }

  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_18rem] lg:items-start">
      <form
        onSubmit={handleSave}
        noValidate
        className="rounded-3xl border border-cinema-border bg-cinema-surface/60 p-6 sm:p-8"
      >
        <h2 className="font-display text-xl font-semibold text-cinema-text">
          Profile details
        </h2>
        <p className="mt-1 text-sm leading-6 text-cinema-muted">
          Your username and display name are shown on community posts later.
        </p>

        {error ? (
          <p
            role="alert"
            className="mt-5 rounded-xl border border-red-400/25 bg-red-400/5 px-3.5 py-3 text-sm leading-6 text-red-300"
          >
            {error}
          </p>
        ) : null}
        {savedMessage ? (
          <p
            role="status"
            className="mt-5 rounded-xl border border-emerald-400/25 bg-emerald-400/5 px-3.5 py-3 text-sm leading-6 text-emerald-300"
          >
            {savedMessage}
          </p>
        ) : null}

        <div className="mt-6 space-y-5">
          <FormField
            label="Display name"
            name="displayName"
            autoComplete="name"
            placeholder="How you want to be known"
            value={displayName}
            onChange={(event) => {
              setDisplayName(event.target.value)
              setSavedMessage(null)
            }}
            maxLength={60}
            disabled={submitting}
          />

          <FormField
            label="Username"
            name="username"
            autoComplete="username"
            placeholder="your_username"
            hint="3–24 characters: lowercase letters, numbers, or underscores."
            value={username}
            onChange={(event) => {
              setUsername(event.target.value.toLowerCase())
              setSavedMessage(null)
            }}
            maxLength={24}
            disabled={submitting}
          />

          <div>
            <label
              htmlFor="profile-bio"
              className="mb-1.5 block text-sm font-medium text-cinema-text"
            >
              Short bio
            </label>
            <textarea
              id="profile-bio"
              name="bio"
              rows={4}
              maxLength={maximumBioLength}
              value={bio}
              onChange={(event) => {
                setBio(event.target.value)
                setSavedMessage(null)
              }}
              placeholder="A few words about the stories you love."
              disabled={submitting}
              className="w-full resize-y rounded-xl border border-cinema-border bg-cinema-bg px-3.5 py-3 text-sm leading-6 text-cinema-text placeholder:text-cinema-muted/50 focus:border-cinema-accent focus:outline-none focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-60"
            />
            <p className="mt-1.5 text-right text-xs text-cinema-muted">
              {bio.length} / {maximumBioLength}
            </p>
          </div>

          <fieldset>
            <legend className="text-sm font-medium text-cinema-text">
              Favorite genres
            </legend>
            <p className="mt-1 text-xs leading-5 text-cinema-muted">
              Choose up to {maximumFavoriteGenres}.
            </p>
            <div className="mt-3 flex flex-wrap gap-2">
              {favoriteGenres.map((genre) => {
                const selected = selectedGenres.includes(genre)
                const atLimit =
                  !selected &&
                  selectedGenres.length >= maximumFavoriteGenres

                return (
                  <button
                    key={genre}
                    type="button"
                    aria-pressed={selected}
                    disabled={submitting || atLimit}
                    onClick={() => toggleGenre(genre)}
                    className={cn(
                      'rounded-full border px-3 py-1.5 text-xs font-medium transition-colors',
                      selected
                        ? 'border-cinema-accent/50 bg-cinema-accent/15 text-cinema-accent'
                        : 'border-cinema-border bg-cinema-bg text-cinema-muted hover:border-cinema-accent/40 hover:text-cinema-text',
                      atLimit && 'cursor-not-allowed opacity-40',
                    )}
                  >
                    {genre}
                  </button>
                )
              })}
            </div>
          </fieldset>
        </div>

        <div className="mt-8 flex flex-wrap gap-3 border-t border-cinema-border pt-6">
          <Button type="submit" disabled={submitting}>
            {submitting ? 'Saving…' : 'Save profile'}
          </Button>
          <Button
            type="button"
            variant="ghost"
            onClick={() => {
              setDisplayName(profile.display_name)
              setUsername(profile.username)
              setBio(profile.bio)
              setSelectedGenres(profile.favorite_genres)
              setError(null)
              setSavedMessage(null)
            }}
            disabled={submitting}
          >
            Reset changes
          </Button>
        </div>
      </form>

      <aside className="space-y-4">
        <div className="rounded-3xl border border-cinema-border bg-cinema-surface/60 p-6">
          <div className="flex items-center gap-4">
            <Avatar
              src={profile.avatar_url}
              name={displayLabel}
              className="size-16 text-xl"
            />
            <div className="min-w-0">
              <p className="truncate font-display text-base font-semibold text-cinema-text">
                {displayLabel}
              </p>
              <p className="truncate text-xs text-cinema-muted">
                @{profile.username}
              </p>
            </div>
          </div>

          <input
            ref={fileInputRef}
            type="file"
            accept="image/jpeg,image/png,image/webp,image/gif"
            className="sr-only"
            onChange={(event) => {
              void handleAvatarChange(event.target.files?.[0])
              event.target.value = ''
            }}
          />

          <div className="mt-5 flex flex-wrap gap-2">
            <Button
              type="button"
              variant="secondary"
              size="sm"
              onClick={() => fileInputRef.current?.click()}
              disabled={avatarBusy}
            >
              <Camera aria-hidden="true" className="size-4" />
              {avatarBusy ? 'Uploading…' : 'Change photo'}
            </Button>
            {profile.avatar_url ? (
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={handleRemoveAvatar}
                disabled={avatarBusy}
              >
                <Trash2 aria-hidden="true" className="size-4" />
                Remove
              </Button>
            ) : null}
          </div>
          <p className="mt-3 text-xs leading-5 text-cinema-muted/80">
            JPG, PNG, WebP, or GIF. Maximum 2 MB.
          </p>
        </div>

        <div className="rounded-3xl border border-cinema-border bg-cinema-surface/60 p-6">
          <div className="flex items-center justify-between gap-3">
            <p className="text-sm font-medium text-cinema-text">
              Profile completion
            </p>
            <span className="font-display text-lg font-semibold text-cinema-accent">
              {completion}%
            </span>
          </div>
          <div className="mt-3 h-2 overflow-hidden rounded-full bg-white/10">
            <div
              className="h-full rounded-full bg-cinema-accent transition-[width]"
              style={{ width: `${completion}%` }}
            />
          </div>
          <p className="mt-3 text-xs leading-5 text-cinema-muted">
            Completion counts username, display name, bio, favorite genres, and
            avatar. It updates after saving.
          </p>
        </div>
      </aside>
    </div>
  )
}
