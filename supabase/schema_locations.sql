-- Türkiye il / ilçe konum kataloğu (Supabase arama — rate limit yok)
create extension if not exists "pgcrypto";

create table if not exists public.locations (
  id uuid primary key default gen_random_uuid(),
  city_name text not null,
  city_slug text not null,
  district_name text not null,
  district_slug text not null,
  lat double precision not null,
  lng double precision not null,
  elevation integer not null default 0,
  label text not null,
  -- ASCII arama anahtarı: "gole ardahan" (Türkçe karakter bağımsız)
  search_key text not null,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  constraint locations_city_district_unique unique (city_slug, district_slug)
);

create index if not exists locations_search_key_idx
  on public.locations (search_key);

create index if not exists locations_city_slug_idx
  on public.locations (city_slug);

create index if not exists locations_label_idx
  on public.locations (label);

comment on table public.locations is
  'Türkiye il/ilçe kataloğu — autocomplete ve SEO sayfaları için';

alter table public.locations enable row level security;

drop policy if exists "locations_public_read" on public.locations;
create policy "locations_public_read"
  on public.locations
  for select
  to anon, authenticated
  using (is_active = true);

create or replace function public.search_locations(
  search_query text,
  result_limit integer default 8
)
returns setof public.locations
language plpgsql
stable
security invoker
set search_path = public
as $$
declare
  raw text := nullif(trim(search_query), '');
  normalized text;
begin
  if raw is null or length(raw) < 2 then
    return;
  end if;

  normalized := lower(raw);
  normalized := translate(
    normalized,
    'ğüşıöçĞÜŞİÖÇâîûÂÎÛ',
    'gusiocgusiocaiuAIU'
  );
  normalized := regexp_replace(normalized, '[^a-z0-9]+', ' ', 'g');
  normalized := trim(both ' ' from regexp_replace(normalized, '\s+', ' ', 'g'));

  if normalized is null or length(normalized) < 2 then
    return;
  end if;

  return query
  select l.*
  from public.locations l
  where l.is_active
    and (
      l.search_key like '%' || normalized || '%'
      or l.label ilike '%' || raw || '%'
      or l.district_name ilike '%' || raw || '%'
      or l.city_name ilike '%' || raw || '%'
    )
  order by
    case
      when l.search_key like normalized || ' %' then 0
      when l.search_key like normalized || '%' then 1
      when l.district_name ilike raw || '%' then 2
      else 3
    end,
    l.district_name asc,
    l.city_name asc
  limit greatest(1, least(coalesce(result_limit, 8), 20));
end;
$$;

grant execute on function public.search_locations(text, integer) to anon, authenticated;

-- Not: list_cities parametresiz RPC PostgREST şema önbelleğinde sorun çıkarabiliyor.
-- Uygulama illeri locations tablosundan distinct okur; bu fonksiyon opsiyoneldir.
create or replace function public.list_cities(result_limit integer default 100)
returns table (
  city_name text,
  city_slug text
)
language sql
stable
security invoker
set search_path = public
as $$
  select distinct on (l.city_slug)
    l.city_name,
    l.city_slug
  from public.locations l
  where l.is_active
  order by l.city_slug, l.district_name
  limit greatest(1, least(coalesce(result_limit, 100), 200));
$$;

grant execute on function public.list_cities(integer) to anon, authenticated;
