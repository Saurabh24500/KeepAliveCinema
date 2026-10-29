# KeepAliveMovie — Roadmap and Checklist

Work top to bottom. Do not start a later milestone until the current one is tested and accepted.

## Milestone 0 — Workspace and decisions
- [x] Create/open `keepalivemovie` workspace.
- [x] Add the project instruction/specification files.
- [x] Initialize Git and check `.gitignore`.
- [x] Confirm Node.js/npm work locally.
- [x] Do not add credentials to Git.

## Milestone 1 — Foundation and visual shell
- [x] Create Vite React + TypeScript project if one does not already exist.
- [x] Configure Tailwind CSS v4 with Vite.
- [x] Set up React Router and global styles.
- [x] Build responsive app shell, navigation drawer, footer, and reusable buttons/cards.
- [x] Build a static home page using clearly labeled sample/mock data.
- [x] Add loading skeleton and empty/error-state components for reuse.
- [ ] Verify mobile and desktop layout. (Build passes; still needs a manual visual check in a browser.)
- [x] Run typecheck/build and fix errors.

## Milestone 2 — Supabase setup and authentication
- [x] Create Supabase development project.
- [x] Add `.env.example` with placeholder values; `.env.local` is ignored by Git.
- [x] Create `.env.local` with real Supabase development credentials (publishable key only).
- [x] Create Supabase client using only the publishable/anon key with session persistence.
- [x] Implement sign up, sign in, sign out, session persistence, and password reset. (Code implemented; successful-account flow still needs testing.)
- [x] Add protected routes and auth loading state. (Protected redirects and signed-out UI tested.)
- [ ] Configure Supabase Site URL and `/reset-password` redirect URL.
- [x] Test invalid credentials, invalid-email validation, short-password validation, password-mismatch validation, protected redirects, reset-page error state, and mobile drawer behavior.
- [ ] Test successful sign-up, email confirmation, session refresh/persistence, sign-out, and full password reset with a confirmed test account.

## Milestone 3 — Profiles and onboarding
- [x] Add profile schema and RLS migration. (Applied to the development Supabase project through the SQL Editor.)
- [x] Create/edit profile: avatar, display name, username, bio, favorite genres.
- [x] Enforce case-insensitive unique usernames. (Unique index on `lower(username)`; apply migration to activate.)
- [x] Compute profile completion percentage consistently. (Equal weight across username, display name, bio, favorite genres, and avatar.)
- [x] Add skippable first-login tour.
- [x] Do not repeat the tour after completion; add replay option.
- [ ] Verify the avatars bucket and profile trigger with a confirmed account.
- [ ] Test profile access using two accounts.

## Milestone 4 — Media discovery
- [x] Confirm TMDB terms and attribution approach. (Attribution notice and TMDB logo link are implemented.)
- [ ] Add a TMDB API key to `.env.local` for live testing.
- [x] Create typed TMDB client and centralize image URL logic.
- [x] Build discovery sections for movies, anime/animation, and TV/series.
- [x] Add search, details view, pagination/incremental loading, skeletons, errors, and retry.
- [x] Lazy-load images and handle missing posters.
- [x] Document that anime is approximated as Japanese-language animation and is not classified consistently by one provider.
- [ ] Test discovery, search, details, pagination, and error states with a configured TMDB key.

## Milestone 5 — Personal journal
- [ ] Create media cache/journal migrations and RLS.
- [ ] Add to watchlist / currently watching / completed / paused / dropped.
- [ ] Add personal rating, favorite, note/memory, and update/delete actions.
- [ ] Add viewing history and filters.
- [ ] Prevent duplicate user/media entries.
- [ ] Test that one account cannot read or edit another account's private journal.

## Milestone 6 — Community MVP
- [ ] Create posts, comments, and likes migrations with RLS.
- [ ] Create text post with optional media attachment.
- [ ] Add spoiler flag and reveal-to-view UI.
- [ ] Add paginated feed, like/unlike, and comments.
- [ ] Add validation, empty states, error handling, and duplicate-action protection.
- [ ] Test ownership and RLS with multiple accounts.

## Milestone 7 — Polish and release
- [ ] Responsive and keyboard-accessibility pass.
- [ ] Check performance, image loading, and network failure handling.
- [ ] Add About/footer content and basic settings.
- [ ] Add sensible page titles and not-found route.
- [ ] Review dependencies and exposed environment variables.
- [ ] Run production build and smoke tests.
- [ ] Configure Vercel environment variables and deploy.
- [ ] Test the deployed site, auth redirect URLs, and RLS.
- [ ] Add project README with setup instructions and screenshots.

## Future ideas — only after MVP works

### High-value candidates
- [ ] Mood-based discovery using simple rules/filters first.
- [ ] Language and regional filters useful to Indian users.
- [ ] Unified stats: titles completed, genres, yearly recap.
- [ ] Memory timeline for personal notes and milestones.
- [ ] Spoiler-aware discussion improvements.
- [ ] Import/export personal lists.

### Later / optional
- [ ] Follow friends and activity feed.
- [ ] Notifications.
- [ ] Recommendations based on explicit preferences.
- [ ] PWA/offline-friendly enhancements.
- [ ] AI-powered recommendations only after useful data and a clear use case exist.
- [ ] Moderation/report dashboard and stronger anti-abuse controls.

## Release gate

Do not call the MVP complete until authentication, user-owned data isolation, the main journal flow, community basics, responsive behavior, and production build have been tested.
