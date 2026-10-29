# KeepAliveMovie — Database Plan

This is the initial schema plan, not a claim that the database has already been created. Implement through reviewed Supabase SQL migrations. Antigravity must verify SQL and RLS policies before applying them.

## Core tables

### `profiles`
- `id uuid primary key references auth.users(id) on delete cascade`
- `username text` — required and unique, case-insensitive uniqueness should be enforced.
- `display_name text`
- `bio text`
- `avatar_url text`
- `favorite_genres text[]` or a normalized relation if later needed.
- `onboarding_completed boolean not null default false`
- `created_at timestamptz not null default now()`
- `updated_at timestamptz not null default now()`

Profile completion percentage should be calculated from a documented list of fields in application logic; do not store a percentage that can become inconsistent unless there is a strong reason.

### `media_items` (optional cache of titles users have saved)
- `id uuid primary key default gen_random_uuid()`
- `tmdb_id integer not null`
- `media_type text not null` — constrain to supported types such as movie or TV.
- `title text not null`
- `overview text`
- `poster_path text`
- `backdrop_path text`
- `release_date date`
- `original_language text`
- `created_at timestamptz not null default now()`
- Unique constraint on `(tmdb_id, media_type)`.

Do not import or duplicate the entire TMDB catalogue. Store only the fields needed for saved items if caching is useful, and comply with TMDB terms.

### `watchlist_items` (personal journal entries)
- `id uuid primary key default gen_random_uuid()`
- `user_id uuid not null references auth.users(id) on delete cascade`
- `media_id uuid not null references media_items(id) on delete cascade`
- `status text not null` — constrain to `plan_to_watch`, `watching`, `completed`, `paused`, `dropped`.
- `rating numeric` nullable — constrain to the selected rating scale.
- `progress integer not null default 0` — non-negative; maximum depends on reliable media metadata and product rules.
- `is_favorite boolean not null default false`
- `personal_note text`
- `started_at timestamptz`
- `completed_at timestamptz`
- `created_at timestamptz not null default now()`
- `updated_at timestamptz not null default now()`
- Unique constraint on `(user_id, media_id)` to prevent duplicate journal entries.

Decide and document the rating scale before implementing it; a 0–10 scale is a reasonable default, but keep UI and database validation consistent.

### `posts`
- `id uuid primary key default gen_random_uuid()`
- `user_id uuid not null references auth.users(id) on delete cascade`
- `media_id uuid nullable references media_items(id) on delete set null`
- `content text not null`
- `post_type text not null default 'discussion'` — constrain to supported values.
- `contains_spoilers boolean not null default false`
- `created_at timestamptz not null default now()`
- `updated_at timestamptz not null default now()`

Add sensible content length limits and validate on both client and database.

### `comments`
- `id uuid primary key default gen_random_uuid()`
- `post_id uuid not null references posts(id) on delete cascade`
- `user_id uuid not null references auth.users(id) on delete cascade`
- `content text not null`
- `created_at timestamptz not null default now()`

### `likes`
- `post_id uuid not null references posts(id) on delete cascade`
- `user_id uuid not null references auth.users(id) on delete cascade`
- `created_at timestamptz not null default now()`
- Composite primary key `(post_id, user_id)` to prevent duplicate likes.

## Security / RLS requirements

Enable RLS for every table and test policies using at least two separate test accounts.

- `profiles`: public fields may be readable according to the intended product experience; a user may update only their own profile row. Avoid exposing private account data.
- `watchlist_items`: only the owning user may read, insert, update, or delete their entries.
- `media_items`: read access can be public for cached metadata; write access must be limited to trusted application paths or narrowly scoped policies.
- `posts`: signed-in users may read community posts according to the chosen visibility model; users may insert/update/delete only their own posts.
- `comments`: read access follows post visibility; users may create/delete their own comments under allowed posts.
- `likes`: authenticated users may create/delete their own likes; uniqueness prevents duplicates.
- Do not assume that hiding a button in React is security. Enforce authorization in RLS/database policies.

## Later tables (not MVP blockers)

- `reports` for user-generated content reports.
- `notifications` if notifications become a real feature.
- `follows` if a follow graph is added.
- `viewing_sessions` if a richer episode-by-episode diary is needed.

## Migration checklist

- [x] SQL migration created, reviewed, and applied for `profiles` and the `avatars` bucket in the development project.
- [x] Constraints and indexes added where useful.
- [x] RLS enabled on every relevant existing table (`profiles`, `storage.objects` policies).
- [ ] Policies tested as owner, another authenticated user, and unauthenticated visitor where applicable.
- [ ] Cascading deletes and optional relations behave as intended.
- [x] No service-role key is used in the browser.
