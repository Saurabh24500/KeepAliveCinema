# KeepAliveMovie — Decision Log

Record significant choices here so the agent does not repeatedly change direction.

## Confirmed for now

- Product name used in code/workspace: **KeepAliveMovie**.
- Tagline: **Keep the stories you love alive.**
- Product positioning: personal entertainment journal + community.
- Primary user value: personal lists, memories/notes, ratings, favorites, and viewing history.
- Frontend: React + TypeScript + Vite.
- Styling: Tailwind CSS v4.
- Routing: React Router.
- Backend: Supabase Auth + PostgreSQL + Storage.
- Media metadata: TMDB, subject to current terms and attribution requirements.
- Hosting target: Vercel.
- Visual direction: dark cinematic UI with restrained purple accent.
- Development method: build one milestone at a time and test before moving forward.
- Auth: Supabase email/password with session persistence. `/signin`, `/signup`, `/forgot-password`, and `/reset-password` are public; `/journal`, `/community`, `/account`, `/profile`, and `/onboarding` require a session.
- Environment variables: `VITE_SUPABASE_URL` and `VITE_SUPABASE_PUBLISHABLE_KEY`. Only the publishable/anon key may be used in browser code.
- Password rule: the UI requires at least 8 characters. Supabase settings should match or be stricter.
- Missing Supabase configuration must show a clear setup notice, not a broken form or a crash.
- Password reset uses the `/reset-password` redirect URL, which must be allowed in the Supabase dashboard.

## Provisional decisions (revisit only when needed)

- Rating scale: likely 0–10; make the UI and database constraints consistent.
- Initial community visibility: signed-in users can view posts; decide exact public/anonymous access before writing RLS.
- Viewing progress: store a simple integer initially; episode-specific progress may need a richer model later.
- Profile completion: calculate from five equally weighted fields (username, display name, bio, favorite genres, avatar), not as a manually maintained counter.
- Profile usernames: lowercase letters, numbers, and underscores only, 3–24 characters, unique case-insensitively through a `lower(username)` index.
- Profile avatars: public `avatars` Storage bucket, 2 MB limit, JPG/PNG/WebP/GIF, one object per user at `<user-id>/avatar`.
- First-login tour: skippable and replayable; `profiles.onboarding_completed` prevents automatic repeats but does not block navigation after completion.
- Discovery uses TMDB with a browser-exposed `VITE_TMDB_API_KEY`, a typed client in `src/features/discovery/`, and centralized image URL helpers. It is intended for non-commercial use with the required TMDB attribution.
- Anime browse is approximated as Japanese-language TV animation. Multi-search also classifies Japanese-language animated films as anime. The series browse category excludes the animation genre, which reduces overlap but is not a perfect taxonomy.
- Home rows remain explicitly labeled sample data; `/discover` and `/media/:mediaType/:id` are the live TMDB surfaces.
- Discovery routes are public. Journal actions remain disabled until Milestone 5.

## Important unresolved checks

- [x] Verify TMDB attribution and key handling requirements. Use a non-commercial browser-exposed key and the required notice/logo; re-check TMDB terms before production.
- [ ] Confirm domain availability and conduct trademark checks before public branding. The name is a provisional project name, not a claim of legal clearance.
- [ ] Define whether profiles/posts are publicly viewable or only available to signed-in users before final RLS policies.
- [ ] Choose production deployment and auth redirect URLs before launch.

## Change log

- Initial project brief recorded in this file.
- Milestone 1 shell implemented: Tailwind CSS v4 via `@tailwindcss/vite`, React Router routes for Home/Discover/Journal/Community/About plus a 404 page, and a shared app shell.
- Home content uses real title names only as clearly labeled sample layout data. No TMDB data is fetched.
- Controls for later milestones (sign-in, create post, settings, discover/journal/community actions) are disabled or shown on honest placeholder pages rather than pretending to work.
- Routes for Discover, Journal, and Community are placeholder pages that name the milestone where each feature will be implemented.
- Milestone 2 auth foundation added: Supabase client, auth context/provider, sign-in, sign-up, forgot/reset password screens, protected routes, and session-aware header/drawer. Not yet tested against a live Supabase project.
- Added a minimal `/account` page for authenticated session status and sign-out. Profile editing remains Milestone 3.
- Supabase development project connected locally through `.env.local` using the publishable key only. The project URL and publishable key are safe for browser use; the service-role key is not used anywhere.
- Headless browser checks passed for protected-route redirects, auth form rendering, invalid credentials, invalid email, short password, password mismatch, reset-page error state, and mobile drawer behavior. Successful account flows remain untested until a confirmed test account is available.
- Milestone 3 profile implementation added: profile types/service/provider, avatar component, profile edit form, profile page, skippable/replayable onboarding tour, onboarding redirect gate, and profile-aware header/drawer/account views.
- Milestone 3 migration authored at `supabase/migrations/20261029000000_profiles.sql`, including the profiles table, auth-insert trigger, existing-user backfill, RLS policies, and the public avatars bucket with owner-scoped write policies. It has not been applied to the Supabase project yet.
- Lint and production build pass after the Milestone 3 code. The profiles migration was applied to the development Supabase project through the SQL Editor; the table is reachable through the REST API. Profile reads/writes, avatar uploads, and the tour completion flag still cannot be verified until a confirmed account is used.
- Added a self-heal path: if a signed-in account has no profile row, `/profile` can insert a starter profile with a generated unique username. The sign-up trigger and migration backfill remain the primary creation paths.
- Milestone 4 discovery added: typed TMDB client, centralized image helpers, movies/anime/series browse feeds, multi-search, incremental loading, lazy poster images with fallbacks, title details, retry/empty/error states, and TMDB attribution in the footer, Discover, details, and About.
- TMDB API key is not present in the local environment yet, so live discovery has not been exercised against the real API. The unconfigured state is implemented and visible.
- Lint and production build pass after the Milestone 4 code. The only build warning is Vite's bundle-size advisory.
