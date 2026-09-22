import { supabase } from "@/lib/supabaseClient";
import { toSlug } from "@/lib/slug";
import type { LocationRecord } from "@/types/supabase";

export interface LocationPlace {
  id?: string;
  cityName: string;
  citySlug: string;
  districtName: string;
  districtSlug: string;
  lat: number;
  lng: number;
  elevation: number;
  label: string;
  href: string;
}

function rowToPlace(row: LocationRecord): LocationPlace {
  return {
    id: row.id,
    cityName: row.city_name,
    citySlug: row.city_slug,
    districtName: row.district_name,
    districtSlug: row.district_slug,
    lat: row.lat,
    lng: row.lng,
    elevation: row.elevation,
    label: row.label,
    href: `/${row.city_slug}/${row.district_slug}`,
  };
}

/** Yazarken öneri — Supabase (önce RPC, olmazsa tablo sorgusu) */
export async function searchLocationsRemote(
  query: string,
  limit = 8,
): Promise<LocationPlace[]> {
  if (!supabase || query.trim().length < 2) return [];

  const q = query.trim();

  const { data, error } = await (
    supabase as unknown as {
      rpc: (
        fn: string,
        args: Record<string, unknown>,
      ) => Promise<{
        data: LocationRecord[] | null;
        error: { message: string } | null;
      }>;
    }
  ).rpc("search_locations", {
    search_query: q,
    result_limit: limit,
  });

  if (!error && data) {
    return data.map(rowToPlace);
  }

  if (error) {
    console.warn(
      "search_locations RPC unavailable, falling back to table query:",
      error.message,
    );
  }

  // Fallback: search_key / label ile ilike
  const ascii = q
    .toLocaleLowerCase("tr-TR")
    .replaceAll("ğ", "g")
    .replaceAll("ü", "u")
    .replaceAll("ş", "s")
    .replaceAll("ı", "i")
    .replaceAll("ö", "o")
    .replaceAll("ç", "c")
    .replace(/[^a-z0-9]+/g, " ")
    .trim();

  const { data: fallback, error: fallbackError } = await supabase
    .from("locations")
    .select("*")
    .eq("is_active", true)
    .or(
      `search_key.ilike.%${ascii}%,label.ilike.%${q}%,district_name.ilike.%${q}%,city_name.ilike.%${q}%`,
    )
    .order("district_name", { ascending: true })
    .limit(limit);

  if (fallbackError) {
    console.error("searchLocationsRemote fallback failed:", fallbackError.message);
    return [];
  }

  return ((fallback ?? []) as LocationRecord[]).map(rowToPlace);
}

export async function findLocationRemote(
  citySlug: string,
  districtSlug: string,
): Promise<LocationPlace | null> {
  if (!supabase) return null;

  const { data, error } = await supabase
    .from("locations")
    .select("*")
    .eq("city_slug", citySlug)
    .eq("district_slug", districtSlug)
    .eq("is_active", true)
    .maybeSingle();

  if (error) {
    console.error("findLocationRemote failed:", error.message);
    return null;
  }

  return data ? rowToPlace(data as LocationRecord) : null;
}

export async function findCityCenterRemote(
  citySlug: string,
): Promise<LocationPlace | null> {
  if (!supabase) return null;

  const { data, error } = await supabase
    .from("locations")
    .select("*")
    .eq("city_slug", citySlug)
    .eq("is_active", true)
    .order("district_name", { ascending: true })
    .limit(50);

  if (error || !data?.length) {
    if (error) console.error("findCityCenterRemote failed:", error.message);
    return null;
  }

  const rows = data as LocationRecord[];
  const merkez = rows.find(
    (row) =>
      row.district_slug === "merkez" ||
      row.district_slug === citySlug ||
      row.district_name.toLocaleLowerCase("tr-TR") === "merkez",
  );

  return rowToPlace(merkez ?? rows[0]);
}

export async function getCityDistrictsRemote(
  citySlug: string,
): Promise<LocationPlace[]> {
  if (!supabase) return [];

  const { data, error } = await supabase
    .from("locations")
    .select("*")
    .eq("city_slug", citySlug)
    .eq("is_active", true)
    .order("district_name", { ascending: true });

  if (error) {
    console.error("getCityDistrictsRemote failed:", error.message);
    return [];
  }

  return ((data ?? []) as LocationRecord[]).map(rowToPlace);
}

export async function listCitiesRemote(): Promise<
  Array<{ name: string; slug: string; href: string }>
> {
  if (!supabase) return [];

  // PostgREST parametresiz RPC şema önbelleğinde sorun çıkarabiliyor;
  // illeri doğrudan tablodan distinct alıyoruz.
  const { data, error } = await supabase
    .from("locations")
    .select("city_name, city_slug")
    .eq("is_active", true)
    .order("city_slug", { ascending: true });

  if (error) {
    console.error("listCitiesRemote failed:", error.message);
    return [];
  }

  const seen = new Set<string>();
  const cities: Array<{ name: string; slug: string; href: string }> = [];

  for (const row of (data ?? []) as Array<{
    city_name: string;
    city_slug: string;
  }>) {
    if (seen.has(row.city_slug)) continue;
    seen.add(row.city_slug);
    cities.push({
      name: row.city_name,
      slug: row.city_slug,
      href: `/${row.city_slug}`,
    });
  }

  return cities;
}

export function buildHref(citySlug: string, districtSlug: string): string {
  return `/${toSlug(citySlug)}/${toSlug(districtSlug)}`;
}

/** Sitemap için aktif il + ilçe path’leri (sayfalı okuma) */
export async function listSitemapEntriesRemote(): Promise<{
  cities: string[];
  districts: Array<{ citySlug: string; districtSlug: string }>;
}> {
  if (!supabase) return { cities: [], districts: [] };

  const pageSize = 1000;
  let from = 0;
  const citySet = new Set<string>();
  const districts: Array<{ citySlug: string; districtSlug: string }> = [];

  while (true) {
    const { data, error } = await supabase
      .from("locations")
      .select("city_slug, district_slug")
      .eq("is_active", true)
      .order("city_slug", { ascending: true })
      .order("district_slug", { ascending: true })
      .range(from, from + pageSize - 1);

    if (error) {
      console.error("listSitemapEntriesRemote failed:", error.message);
      break;
    }

    const rows = (data ?? []) as Array<{
      city_slug: string;
      district_slug: string;
    }>;

    if (rows.length === 0) break;

    for (const row of rows) {
      citySet.add(row.city_slug);
      districts.push({
        citySlug: row.city_slug,
        districtSlug: row.district_slug,
      });
    }

    if (rows.length < pageSize) break;
    from += pageSize;
  }

  return { cities: [...citySet], districts };
}
