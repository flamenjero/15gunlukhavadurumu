/**
 * data/turkey-cities-districts.json → supabase/seed_locations.sql
 * Çalıştır: node scripts/generate-locations-seed.mjs
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, "..");
const inputPath = path.join(root, "data", "turkey-cities-districts.json");
const outputPath = path.join(root, "supabase", "seed_locations.sql");

function esc(value) {
  return String(value).replaceAll("'", "''");
}

function asciiKey(...parts) {
  return parts
    .join(" ")
    .toLocaleLowerCase("tr-TR")
    .replaceAll("ğ", "g")
    .replaceAll("ü", "u")
    .replaceAll("ş", "s")
    .replaceAll("ı", "i")
    .replaceAll("i̇", "i")
    .replaceAll("ö", "o")
    .replaceAll("ç", "c")
    .replace(/[^a-z0-9]+/g, " ")
    .trim()
    .replace(/\s+/g, " ");
}

const cities = JSON.parse(fs.readFileSync(inputPath, "utf8"));
const rows = [];

for (const city of cities) {
  const cityName = city.name;
  const citySlug = city.slug;
  for (const town of city.towns ?? []) {
    const districtName = town.name;
    const districtSlug = town.slug;
    const label = `${districtName} (${cityName})`;
    const searchKey = asciiKey(districtName, cityName, districtSlug, citySlug);
    rows.push(
      `('${esc(cityName)}', '${esc(citySlug)}', '${esc(districtName)}', '${esc(districtSlug)}', ${Number(town.latitude)}, ${Number(town.longitude)}, 0, '${esc(label)}', '${esc(searchKey)}')`,
    );
  }
}

const sql = `-- Auto-generated from data/turkey-cities-districts.json
-- ${cities.length} il, ${rows.length} ilçe
-- Yenilemek için: node scripts/generate-locations-seed.mjs

delete from public.locations;

insert into public.locations (
  city_name, city_slug, district_name, district_slug,
  lat, lng, elevation, label, search_key
) values
${rows.join(",\n")};
`;

fs.writeFileSync(outputPath, sql, "utf8");
console.log(`Wrote ${rows.length} districts → ${outputPath}`);
