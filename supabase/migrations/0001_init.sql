-- Bookmami (책방아줌마) initial schema
-- All access goes through server-side code using the service_role key.
-- RLS is enabled with no policies, so anon/authenticated keys get zero access by default.

create extension if not exists pgcrypto;

create table if not exists family_members (
  id uuid primary key default gen_random_uuid(),
  name text not null unique,
  password_hash text not null,
  avatar_emoji text not null default '📚',
  default_template text not null default 'cover-rating'
    check (default_template in ('cover-rating', 'minimal-quote', 'polaroid-photo')),
  created_at timestamptz not null default now()
);

create table if not exists reading_logs (
  id uuid primary key default gen_random_uuid(),
  member_id uuid not null references family_members(id) on delete cascade,
  title text not null,
  author text,
  publisher text,
  genre text,
  cover_url text,
  photo_url text,
  status text not null default 'want'
    check (status in ('want', 'reading', 'done')),
  rating smallint not null default 0
    check (rating between 0 and 5),
  format text not null default 'paper'
    check (format in ('paper', 'ebook', 'audio')),
  started_at date,
  finished_at date,
  one_line_review text,
  quote text,
  tags text[] not null default '{}',
  recommend boolean,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists reading_logs_member_id_idx on reading_logs(member_id);
create index if not exists reading_logs_created_at_idx on reading_logs(created_at desc);

alter table family_members enable row level security;
alter table reading_logs enable row level security;

-- Storage bucket for book covers / reading photos (public read, server-side write only)
insert into storage.buckets (id, name, public)
values ('reading-photos', 'reading-photos', true)
on conflict (id) do nothing;
