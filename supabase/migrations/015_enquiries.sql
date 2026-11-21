-- ═══════════════════════════════════════════════════════════════════
-- 015_enquiries.sql
-- Barada corporate site: business and institute enquiries from /enquire
-- (AI training, AI integration, AI support).
--
-- PURELY ADDITIVE. New table only; nothing existing is touched.
-- RLS is enabled with NO policies: anon and authenticated roles can
-- neither read nor write. The API route (app/api/enquiries) inserts with
-- the service role; BK reads rows in the Supabase dashboard.
--
-- ROLLBACK: drop table public.enquiries;
-- ═══════════════════════════════════════════════════════════════════

create table if not exists public.enquiries (
  enquiry_id    uuid primary key default gen_random_uuid(),
  created_at    timestamptz not null default now(),
  audience      text not null check (audience in ('business', 'institute')),
  service       text not null check (service in ('AI training', 'AI integration', 'AI support', 'Not sure yet')),
  name          text not null check (char_length(name) between 1 and 120),
  email         text not null check (char_length(email) between 3 and 200),
  phone         text check (phone is null or char_length(phone) <= 40),
  organisation  text not null check (char_length(organisation) between 1 and 200),
  role          text check (role is null or char_length(role) <= 120),
  city          text check (city is null or char_length(city) <= 120),
  team_size     text check (team_size is null or char_length(team_size) <= 40),
  message       text check (message is null or char_length(message) <= 4000),
  status        text not null default 'new' check (status in ('new', 'contacted', 'in_discussion', 'won', 'closed')),
  ip_hash       text,
  notified      boolean not null default false
);

create index if not exists enquiries_created_at_idx on public.enquiries (created_at desc);
create index if not exists enquiries_ip_hash_created_idx on public.enquiries (ip_hash, created_at desc);

alter table public.enquiries enable row level security;

comment on table public.enquiries is
  'Business/institute enquiries from barada.in/enquire. Written only by the service role via /api/enquiries. No RLS policies on purpose.';
