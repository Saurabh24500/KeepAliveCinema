# KeepAliveMovie — Antigravity Starter Pack

**Tagline:** Keep the stories you love alive.

KeepAliveMovie is a personal entertainment journal and community for movies, anime, anime series, and TV/web series. Users can track what they want to watch, what they have watched, ratings, progress, memories, and spoiler-aware community posts.

## Current status

Milestones 1–3 (visual shell, auth code, and profiles/onboarding) are implemented, and the Milestone 4 discovery code is in place. The Supabase project is connected locally and the profiles migration has been applied. Successful account flows, profile reads/writes, avatar uploads, and onboarding completion still need a confirmed test account.

Discover uses live TMDB metadata and images once `VITE_TMDB_API_KEY` is configured; without it, the page shows a setup notice. Journal and Community remain planned for later milestones.

## Run locally

```powershell
npm install
Copy-Item .env.example .env.local
npm run dev
```

Then edit `.env.local` and add values from your Supabase project (Project Settings → API):

```dotenv
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_PUBLISHABLE_KEY=your-publishable-or-anon-key
VITE_TMDB_API_KEY=your-tmdb-api-key
```

Restart the dev server after changing environment variables. Use only the Supabase publishable/anon key in the browser; never put the service-role key in a `VITE_` variable. `.env.local` is ignored by Git.

### TMDB discovery

Request a non-commercial TMDB API key from [the TMDB API settings](https://www.themoviedb.org/settings/api) and add it as `VITE_TMDB_API_KEY`. This key is exposed to the browser; use TMDB's current API terms and attribution requirements.

- Attribution: **This product uses the TMDB API but is not endorsed or certified by TMDB.** The notice and TMDB logo link appear in the footer, on Discover, on title details, and on the About page.
- Anime browse uses Japanese-language TV animation. TMDB does not provide a perfect anime classification, so anime films may appear under Movies and some titles may be grouped differently.
- Series browse excludes the animation genre to reduce overlap. Animated series that are not Japanese-language anime may only appear through search.
- Search uses TMDB multi-search; people results are filtered out.
- Home rows remain clearly labeled sample data. Live discovery lives at `/discover`.
- If the key is missing or rejected, the UI shows an explicit configuration or error state with retry where appropriate.

### Profiles migration

The profiles migration has been applied to the current development project. Open the Supabase SQL Editor and run it again only for a fresh project:

```text
supabase/migrations/20261029000000_profiles.sql
```

Or, if the project is linked with the Supabase CLI:

```powershell
supabase db push
```

The migration creates `public.profiles`, the new-user trigger, a backfill for existing auth users, RLS policies, and the public `avatars` bucket with owner-scoped write policies. Profile reads/writes and onboarding completion are not yet tested end to end.

In Supabase Authentication → URL Configuration, set:

- Site URL: `http://localhost:5173`
- Redirect URL: `http://localhost:5173/reset-password`

Add your production URLs there before deploying. Email confirmation can be enabled or disabled in Supabase; the sign-up screen handles both cases. If confirmation is enabled, a new account needs a confirmed session before its profile row is visible.

Checks:

```powershell
npm run lint
npm run build
```

## How to use this pack

1. Extract this folder into your project workspace, or copy the files into the root of your existing `keepalivemovie` repository.
2. Open the project folder in Antigravity.
3. Start with `ANTIGRAVITY_RULES.md`.
4. Give Antigravity the prompt in `prompts/01-start-project.md`.
5. Work one milestone at a time. Review and test each milestone before moving on.

## Files

- `ANTIGRAVITY_RULES.md` — persistent instructions for the coding agent.
- `PROJECT_SPEC.md` — product requirements and MVP scope.
- `TECHNICAL_PLAN.md` — chosen stack and architecture.
- `DATABASE_PLAN.md` — planned tables, constraints, and security rules.
- `ROADMAP.md` — phased implementation checklist and future features.
- `DECISIONS.md` — decisions already made; avoid repeatedly changing them.
- `prompts/01-start-project.md` — first implementation prompt.
- `prompts/02-review-and-test.md` — quality-check prompt.
- `prompts/03-next-feature.md` — reusable prompt for each next milestone.
- `prompts/04-security-review.md` — security review prompt.

## Important

This pack is a planning and instruction starter, not the finished website. Antigravity should inspect the current workspace before creating or overwriting files. Do not paste real secrets into prompts or commit `.env.local` to Git.
