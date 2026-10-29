-- Posts
create table if not exists public.posts (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  media_id uuid references public.media_items(id) on delete set null,
  content text not null,
  contains_spoilers boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint posts_content_length check (char_length(content) <= 1000)
);

-- Comments
create table if not exists public.comments (
  id uuid primary key default gen_random_uuid(),
  post_id uuid not null references public.posts(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  content text not null,
  created_at timestamptz not null default now(),
  constraint comments_content_length check (char_length(content) <= 500)
);

-- Likes
create table if not exists public.likes (
  post_id uuid not null references public.posts(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  created_at timestamptz not null default now(),
  primary key (post_id, user_id)
);

-- updated_at for posts
create or replace function public.set_updated_at_posts()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists posts_set_updated_at on public.posts;
create trigger posts_set_updated_at
before update on public.posts
for each row
execute function public.set_updated_at_posts();

-- RLS
alter table public.posts enable row level security;
alter table public.comments enable row level security;
alter table public.likes enable row level security;

-- Posts
drop policy if exists "Anyone can read posts" on public.posts;
create policy "Anyone can read posts"
on public.posts for select
using (true);

drop policy if exists "Users can create posts" on public.posts;
create policy "Users can create posts"
on public.posts for insert
to authenticated
with check (auth.uid() = user_id);

drop policy if exists "Users can update their own posts" on public.posts;
create policy "Users can update their own posts"
on public.posts for update
to authenticated
using (auth.uid() = user_id)
with check (auth.uid() = user_id);

drop policy if exists "Users can delete their own posts" on public.posts;
create policy "Users can delete their own posts"
on public.posts for delete
to authenticated
using (auth.uid() = user_id);

-- Comments
drop policy if exists "Anyone can read comments" on public.comments;
create policy "Anyone can read comments"
on public.comments for select
using (true);

drop policy if exists "Users can create comments" on public.comments;
create policy "Users can create comments"
on public.comments for insert
to authenticated
with check (auth.uid() = user_id);

drop policy if exists "Users can delete their own comments" on public.comments;
create policy "Users can delete their own comments"
on public.comments for delete
to authenticated
using (auth.uid() = user_id);

-- Likes
drop policy if exists "Anyone can read likes" on public.likes;
create policy "Anyone can read likes"
on public.likes for select
using (true);

drop policy if exists "Users can like" on public.likes;
create policy "Users can like"
on public.likes for insert
to authenticated
with check (auth.uid() = user_id);

drop policy if exists "Users can unlike" on public.likes;
create policy "Users can unlike"
on public.likes for delete
to authenticated
using (auth.uid() = user_id);

grant select, insert, update, delete on public.posts to authenticated;
grant select, insert, update, delete on public.comments to authenticated;
grant select, insert, update, delete on public.likes to authenticated;
grant select on public.posts to anon;
grant select on public.comments to anon;
grant select on public.likes to anon;
