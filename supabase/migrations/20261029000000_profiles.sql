create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  username text not null,
  display_name text not null default '',
  bio text not null default '',
  avatar_url text,
  favorite_genres text[] not null default '{}',
  onboarding_completed boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint profiles_username_format check (username ~ '^[a-z0-9_]{3,24}$'),
  constraint profiles_display_name_length check (char_length(display_name) <= 60),
  constraint profiles_bio_length check (char_length(bio) <= 300),
  constraint profiles_favorite_genres_limit check (cardinality(favorite_genres) <= 10)
);

create unique index if not exists profiles_username_lower_key
  on public.profiles (lower(username));

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists profiles_set_updated_at on public.profiles;
create trigger profiles_set_updated_at
before update on public.profiles
for each row
execute function public.set_updated_at();

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
declare
  base_username text;
  candidate text;
  suffix integer := 0;
begin
  base_username := lower(
    regexp_replace(split_part(coalesce(new.email, ''), '@', 1), '[^a-z0-9]', '', 'g')
  );

  if base_username is null or base_username = '' or char_length(base_username) < 3 then
    base_username := 'cinephile';
  end if;

  base_username := left(base_username, 18);
  candidate := base_username;

  while exists (
    select 1 from public.profiles p where lower(p.username) = candidate
  ) loop
    suffix := suffix + 1;
    candidate := left(base_username, 18) || suffix::text;
  end loop;

  insert into public.profiles (id, username, display_name)
  values (new.id, candidate, base_username);

  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
after insert on auth.users
for each row
execute function public.handle_new_user();

insert into public.profiles (id, username, display_name)
select
  u.id,
  left(
    case
      when char_length(
        regexp_replace(lower(split_part(coalesce(u.email, ''), '@', 1)), '[^a-z0-9]', '', 'g')
      ) >= 3
      then regexp_replace(lower(split_part(coalesce(u.email, ''), '@', 1)), '[^a-z0-9]', '', 'g')
      else 'cinephile'
    end,
    12
  ) || '_' || left(replace(u.id::text, '-', ''), 6),
  left(
    coalesce(nullif(split_part(coalesce(u.email, ''), '@', 1), ''), 'Cinephile'),
    60
  )
from auth.users u
where not exists (
  select 1 from public.profiles p where p.id = u.id
);

alter table public.profiles enable row level security;

drop policy if exists "Authenticated users can read profiles" on public.profiles;
create policy "Authenticated users can read profiles"
on public.profiles
for select
to authenticated
using (true);

drop policy if exists "Users can insert their own profile" on public.profiles;
create policy "Users can insert their own profile"
on public.profiles
for insert
to authenticated
with check (auth.uid() = id);

drop policy if exists "Users can update their own profile" on public.profiles;
create policy "Users can update their own profile"
on public.profiles
for update
to authenticated
using (auth.uid() = id)
with check (auth.uid() = id);

grant select, insert, update on public.profiles to authenticated;

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'avatars',
  'avatars',
  true,
  2097152,
  array['image/jpeg', 'image/png', 'image/webp', 'image/gif']
)
on conflict (id) do update
set
  public = excluded.public,
  file_size_limit = excluded.file_size_limit,
  allowed_mime_types = excluded.allowed_mime_types;

drop policy if exists "Avatar images are publicly readable" on storage.objects;
create policy "Avatar images are publicly readable"
on storage.objects
for select
using (bucket_id = 'avatars');

drop policy if exists "Users can upload their own avatar" on storage.objects;
create policy "Users can upload their own avatar"
on storage.objects
for insert
to authenticated
with check (
  bucket_id = 'avatars'
  and (storage.foldername(name))[1] = auth.uid()::text
);

drop policy if exists "Users can update their own avatar" on storage.objects;
create policy "Users can update their own avatar"
on storage.objects
for update
to authenticated
using (
  bucket_id = 'avatars'
  and (storage.foldername(name))[1] = auth.uid()::text
)
with check (
  bucket_id = 'avatars'
  and (storage.foldername(name))[1] = auth.uid()::text
);

drop policy if exists "Users can delete their own avatar" on storage.objects;
create policy "Users can delete their own avatar"
on storage.objects
for delete
to authenticated
using (
  bucket_id = 'avatars'
  and (storage.foldername(name))[1] = auth.uid()::text
);
