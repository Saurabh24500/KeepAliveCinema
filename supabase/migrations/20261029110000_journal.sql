-- Media cache for titles saved in the journal
create table if not exists public.media_items (
  id uuid primary key default gen_random_uuid(),
  tmdb_id integer not null,
  media_type text not null check (media_type in ('movie', 'tv', 'anime', 'series')),
  title text not null,
  overview text,
  poster_path text,
  backdrop_path text,
  release_date date,
  original_language text,
  created_at timestamptz not null default now(),
  unique (tmdb_id, media_type)
);

-- Personal journal entries
create table if not exists public.watchlist_items (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  media_id uuid not null references public.media_items(id) on delete cascade,
  status text not null check (status in ('plan_to_watch', 'watching', 'completed', 'paused', 'dropped')),
  rating numeric check (rating >= 0 and rating <= 10),
  progress integer not null default 0 check (progress >= 0),
  is_favorite boolean not null default false,
  personal_note text,
  started_at timestamptz,
  completed_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (user_id, media_id)
);

-- updated_at trigger
create or replace function public.set_updated_at_watchlist()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists watchlist_items_set_updated_at on public.watchlist_items;
create trigger watchlist_items_set_updated_at
before update on public.watchlist_items
for each row
execute function public.set_updated_at_watchlist();

-- RLS
alter table public.media_items enable row level security;
alter table public.watchlist_items enable row level security;

-- media_items: readable by authenticated users, insertable by authenticated (for caching)
drop policy if exists "Authenticated users can read media_items" on public.media_items;
create policy "Authenticated users can read media_items"
on public.media_items for select
to authenticated
using (true);

drop policy if exists "Authenticated users can insert media_items" on public.media_items;
create policy "Authenticated users can insert media_items"
on public.media_items for insert
to authenticated
with check (true);

-- watchlist_items: only owner
drop policy if exists "Users can read their own watchlist_items" on public.watchlist_items;
create policy "Users can read their own watchlist_items"
on public.watchlist_items for select
to authenticated
using (auth.uid() = user_id);

drop policy if exists "Users can insert their own watchlist_items" on public.watchlist_items;
create policy "Users can insert their own watchlist_items"
on public.watchlist_items for insert
to authenticated
with check (auth.uid() = user_id);

drop policy if exists "Users can update their own watchlist_items" on public.watchlist_items;
create policy "Users can update their own watchlist_items"
on public.watchlist_items for update
to authenticated
using (auth.uid() = user_id)
with check (auth.uid() = user_id);

drop policy if exists "Users can delete their own watchlist_items" on public.watchlist_items;
create policy "Users can delete their own watchlist_items"
on public.watchlist_items for delete
to authenticated
using (auth.uid() = user_id);

grant select, insert on public.media_items to authenticated;
grant select, insert, update, delete on public.watchlist_items to authenticated;
