-- agricultural_tips: hava durumu + ay takvimine göre kural tabanlı tavsiyeler
-- Supabase SQL Editor'da çalıştırılabilir.

create extension if not exists "pgcrypto";

create table if not exists public.agricultural_tips (
  id uuid primary key default gen_random_uuid(),
  category varchar(32) not null
    constraint agricultural_tips_category_check
    check (category in ('tarim', 'aricilik')),
  title varchar(200) not null,
  content text not null,
  -- Esnek kural motoru: örn. {"min_temp": 5, "max_temp": 18, "months": [3,4], "moon_phase": "waxing"}
  conditions jsonb not null default '{}'::jsonb,
  priority smallint not null default 0,
  target_regions text[] null,
  is_active boolean not null default true,
  created_at timestamptz not null default now()
);

comment on table public.agricultural_tips is
  'Hava ve ay takvimine göre dinamik tarım / arıcılık tavsiyeleri';
comment on column public.agricultural_tips.conditions is
  'JSONB kural motoru: min_temp, max_temp, months, moon_phase, wind_max_kph vb.';
comment on column public.agricultural_tips.priority is
  'Çakışmada yüksek priority önceliklidir';

create index if not exists agricultural_tips_category_idx
  on public.agricultural_tips (category);

create index if not exists agricultural_tips_active_priority_idx
  on public.agricultural_tips (is_active, priority desc);

create index if not exists agricultural_tips_conditions_gin_idx
  on public.agricultural_tips using gin (conditions);

create index if not exists agricultural_tips_target_regions_gin_idx
  on public.agricultural_tips using gin (target_regions);

-- RLS: herkese SELECT; yazma işlemleri service role / dashboard ile
alter table public.agricultural_tips enable row level security;

drop policy if exists "agricultural_tips_public_read" on public.agricultural_tips;

create policy "agricultural_tips_public_read"
  on public.agricultural_tips
  for select
  to anon, authenticated
  using (is_active = true);
