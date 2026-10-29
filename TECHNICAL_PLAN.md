# KeepAliveMovie — Technical Plan

## Selected stack

- **Frontend:** React + TypeScript + Vite
- **Styling:** Tailwind CSS v4 via `@tailwindcss/vite`
- **Routing:** React Router
- **Icons:** Lucide React
- **Backend services:** Supabase Auth, PostgreSQL, and Storage
- **Media metadata:** TMDB API
- **Hosting:** Vercel
- **Version control:** Git + GitHub

This is a practical MVP stack for a student project. A separate Express server is not required initially; add a server/API layer only if a specific secure server-side task requires it.

## Suggested structure

```text
keepalivemovie/
├── public/
├── src/
│   ├── app/
│   │   ├── App.tsx
│   │   └── router.tsx
│   ├── assets/
│   ├── components/
│   │   ├── layout/
│   │   ├── ui/
│   │   └── media/
│   ├── features/
│   │   ├── auth/
│   │   ├── profile/
│   │   ├── discovery/
│   │   ├── journal/
│   │   └── community/
│   ├── hooks/
│   ├── lib/
│   │   ├── supabase.ts
│   │   └── tmdb.ts
│   ├── pages/
│   ├── types/
│   ├── styles/
│   └── main.tsx
├── supabase/
│   └── migrations/
├── prompts/
├── .env.example
├── .gitignore
├── ANTIGRAVITY_RULES.md
├── PROJECT_SPEC.md
├── TECHNICAL_PLAN.md
├── DATABASE_PLAN.md
├── ROADMAP.md
└── DECISIONS.md
```

Do not create every file in advance as empty scaffolding. Add files when the relevant milestone needs them.

## Environment variables

Use `.env.local` for local secrets and `.env.example` for safe placeholders.

```dotenv
VITE_SUPABASE_URL=
VITE_SUPABASE_PUBLISHABLE_KEY=
VITE_TMDB_API_KEY=
```

Important:
- Vite exposes variables prefixed with `VITE_` to browser code. Only put values there that are safe to expose in a browser.
- Use the Supabase publishable key, not the service-role key, in the frontend.
- A TMDB API key used directly by the browser is visible to users. Review TMDB's current terms and key guidance; if the key must be kept private, use a suitable server-side proxy/function rather than putting a secret in a `VITE_` variable.
- Never commit `.env.local`.

## Data flow

1. React pages/components display the interface.
2. Feature modules manage user interactions and page-specific logic.
3. `src/lib/supabase.ts` centralizes Supabase client configuration.
4. `src/features/discovery/` centralizes TMDB calls, types, image URL handling, hooks, and error handling.
5. Supabase stores user profiles, journal entries, posts, comments, and likes.
6. TMDB is the source of media metadata where appropriate; avoid copying large catalogues into your own database.

## Data and security principles

- Supabase Auth owns credentials and session handling.
- Link a profile to the authenticated user's UUID.
- Enable RLS on every table containing user or community data.
- Users can edit their own private journal entries and profile; policies should not allow them to edit other users' data.
- Community visibility and write policies must be deliberate and tested.
- Validate data on the client for usability and enforce important rules in the database too.
- Do not put service-role keys, passwords, or private tokens in source code or Git.
- Use database migrations for schema changes rather than relying only on manual dashboard edits.

## Performance

- Use pagination/incremental loading for feeds and lists.
- Lazy-load non-critical images.
- Set image dimensions/aspect ratios to reduce layout shifts.
- Cache stable metadata where appropriate without creating stale-data problems.
- Avoid fetching the same data repeatedly when a page rerenders.
- Include loading, empty, and error states.
