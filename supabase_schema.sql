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
  created_at bigint not null default (extract(epoch from now()) * 1000)::bigint
);

-- 2. Table: Glory Direct Replies (Messages sent from Glory to Yash Admin)
create table if not exists public.glory_replies (
  id text primary key,
  text text not null,
  reel_index integer not null default 1,
  reel_title text default '',
  reel_text text default '',
  sender text not null default 'Glory',
  created_at bigint not null default (extract(epoch from now()) * 1000)::bigint
);

-- 3. Table: Glory Login History (Audited Time & Date of Glory Sessions)
create table if not exists public.glory_logins (
  id text primary key,
  timestamp bigint not null default (extract(epoch from now()) * 1000)::bigint,
  date_string text not null,
  device text default 'Mobile / Desktop',
  screen text default ''
);

-- 4. Enable Row Level Security (RLS) & Public Anonymous Access for Demo
alter table public.reels enable row level security;
alter table public.glory_replies enable row level security;
alter table public.glory_logins enable row level security;

-- Policies for anon access (Allows Yash and Glory clients to read and write without auth blockers)
create policy "Allow all operations on reels" on public.reels for all using (true) with check (true);
create policy "Allow all operations on glory_replies" on public.glory_replies for all using (true) with check (true);
create policy "Allow all operations on glory_logins" on public.glory_logins for all using (true) with check (true);

-- 5. Storage Bucket for Uploaded Videos
insert into storage.buckets (id, name, public) 
values ('reels-videos', 'reels-videos', true)
on conflict (id) do nothing;

create policy "Allow public bucket read" on storage.objects for select using (bucket_id = 'reels-videos');
create policy "Allow public bucket insert" on storage.objects for insert with check (bucket_id = 'reels-videos');
create policy "Allow public bucket update" on storage.objects for update with check (bucket_id = 'reels-videos');
create policy "Allow public bucket delete" on storage.objects for delete using (bucket_id = 'reels-videos');
