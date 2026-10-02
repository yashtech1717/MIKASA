-- ==============================================================================
-- Supabase Cloud Schema for Mikasa Cinematic Feed (Yash & Glory)
-- Run this in the Supabase SQL Editor (https://app.supabase.com)
-- ==============================================================================

-- 1. Table: Reels (Synced across Yash Admin and Glory Feed)
create table if not exists public.reels (
  id text primary key,
  title text not null default 'Special Screening from Yash ❤️',
  text text not null default 'hi glory last msg form yash',
  media_type text not null default 'video',
  video_type text not null default 'preset',
  video_key text default '',
  video_url text default '',
  preset_src text default 'assets/love_story_1.mp4',
  created_at timestamp with time zone default timezone('utc'::text, now())
);

-- 2. Table: Glory Direct Replies (Messages sent from Glory to Yash Admin)
create table if not exists public.glory_replies (
  id text primary key,
  reel_id text default '',
  reel_index integer not null default 1,
  reel_title text default '',
  reel_text text default '',
  reply_text text not null,
  sender text not null default 'Glory',
  created_at timestamp with time zone default timezone('utc'::text, now())
);

-- 3. Table: Glory Login History (Audited Time, Date & Device of Glory Sessions)
create table if not exists public.glory_logins (
  id text primary key,
  username text not null default 'glory',
  device_info text default 'Mobile / Desktop',
  logged_in_at text not null default timezone('utc'::text, now())::text,
  timestamp bigint default (extract(epoch from now()) * 1000)::bigint
);

-- 4. Enable Row Level Security (RLS) & Public Anonymous Access for Demo
alter table public.reels enable row level security;
alter table public.glory_replies enable row level security;
alter table public.glory_logins enable row level security;

-- Policies for anon access (Allows Yash and Glory clients to read and write without auth blockers)
drop policy if exists "Allow all operations on reels" on public.reels;
create policy "Allow all operations on reels" on public.reels for all using (true) with check (true);

drop policy if exists "Allow all operations on glory_replies" on public.glory_replies;
create policy "Allow all operations on glory_replies" on public.glory_replies for all using (true) with check (true);

drop policy if exists "Allow all operations on glory_logins" on public.glory_logins;
create policy "Allow all operations on glory_logins" on public.glory_logins for all using (true) with check (true);

-- 5. Storage Bucket for Uploaded Videos
insert into storage.buckets (id, name, public) 
values ('reels-videos', 'reels-videos', true)
on conflict (id) do nothing;

drop policy if exists "Allow public bucket read" on storage.objects;
create policy "Allow public bucket read" on storage.objects for select using (bucket_id = 'reels-videos');

drop policy if exists "Allow public bucket insert" on storage.objects;
create policy "Allow public bucket insert" on storage.objects for insert with check (bucket_id = 'reels-videos');

drop policy if exists "Allow public bucket update" on storage.objects;
create policy "Allow public bucket update" on storage.objects for update with check (bucket_id = 'reels-videos');

drop policy if exists "Allow public bucket delete" on storage.objects;
create policy "Allow public bucket delete" on storage.objects for delete using (bucket_id = 'reels-videos');

