"use client";

import { useRouter } from "next/navigation";
import { useEffect, useId, useState } from "react";
import {
  searchLocationsRemote,
  type LocationPlace,
} from "@/lib/locationService";

export interface TripPlaceSelection {
  label: string;
  cityName: string;
  districtName: string;
  citySlug: string;
  districtSlug: string;
}

export default function TripPlanForm({
  place,
  start,
  end,
  minDate,
  maxDate,
}: {
  place: TripPlaceSelection | null;
  start: string;
  end: string;
  minDate: string;
  maxDate: string;
}) {
  const router = useRouter();
  const listId = useId();
  const [query, setQuery] = useState(place?.label ?? "");
  const [selected, setSelected] = useState<TripPlaceSelection | null>(place);
  const [suggestions, setSuggestions] = useState<LocationPlace[]>([]);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [tripStart, setTripStart] = useState(start);
  const [tripEnd, setTripEnd] = useState(end);
  const [error, setError] = useState("");

  useEffect(() => {
    const q = query.trim();
    if (q.length < 2 || (selected && q === selected.label)) {
      setSuggestions([]);
      setLoading(false);
      return;
    }

    let cancelled = false;
    setLoading(true);
    const timer = window.setTimeout(async () => {
      const results = await searchLocationsRemote(q, 8);
      if (!cancelled) {
        setSuggestions(results);
        setLoading(false);
        setOpen(true);
      }
    }, 220);

    return () => {
      cancelled = true;
      window.clearTimeout(timer);
    };
  }, [query, selected]);

  function choose(next: LocationPlace) {
    setSelected({
      label: next.label,
      cityName: next.cityName,
      districtName: next.districtName,
      citySlug: next.citySlug,
      districtSlug: next.districtSlug,
    });
    setQuery(next.label);
    setOpen(false);
    setError("");
  }

  function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!selected) {
      setError("Listeden bir il veya ilçe seçin.");
      return;
    }
    if (!tripStart || !tripEnd) {
      setError("Başlangıç ve bitiş tarihini seçin.");
      return;
    }
    const params = new URLSearchParams({
      baslangic: tripStart,
      bitis: tripEnd,
    });
    router.push(
      `/gezi-plani/${selected.citySlug}/${selected.districtSlug}?${params.toString()}`,
    );
  }

  return (
    <form
      onSubmit={onSubmit}
      className="rounded-3xl border border-sky-100 bg-white p-4 shadow-sm sm:p-6"
    >
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="relative sm:col-span-2">
          <label htmlFor="trip-place" className="text-sm font-medium text-slate-700">
            Yer
          </label>
          <input
            id="trip-place"
            type="search"
            role="combobox"
            aria-expanded={open}
            aria-controls={listId}
            aria-autocomplete="list"
            value={query}
            placeholder="Örn. Kaş, Göle, Çeşme…"
            autoComplete="off"
            onChange={(event) => {
              setQuery(event.target.value);
              setSelected(null);
              setOpen(true);
            }}
            onFocus={() => {
              if (suggestions.length > 0) setOpen(true);
            }}
            className="mt-1 h-12 w-full rounded-2xl border border-sky-100 px-4 text-slate-900 outline-none ring-sky-300 placeholder:text-slate-400 focus:ring-2"
          />
          {open && query.trim().length >= 2 && !selected ? (
            <ul
              id={listId}
              role="listbox"
              className="absolute z-20 mt-2 max-h-72 w-full overflow-auto rounded-2xl border border-sky-100 bg-white py-2 shadow-lg"
            >
              {loading && suggestions.length === 0 ? (
                <li className="px-4 py-3 text-sm text-slate-500">Aranıyor…</li>
              ) : suggestions.length === 0 ? (
                <li className="px-4 py-3 text-sm text-slate-500">
                  Eşleşen yer bulunamadı.
                </li>
              ) : (
                suggestions.map((item) => (
                  <li key={`${item.citySlug}-${item.districtSlug}`}>
                    <button
                      type="button"
                      className="flex w-full flex-col items-start px-4 py-2.5 text-left hover:bg-sky-50"
                      onClick={() => choose(item)}
                    >
                      <span className="text-sm font-semibold text-slate-900">
                        {item.label}
                      </span>
                      <span className="text-xs text-slate-500">
                        {item.districtName} / {item.cityName}
                      </span>
                    </button>
                  </li>
                ))
              )}
            </ul>
          ) : null}
        </div>
        <div>
          <label htmlFor="trip-start" className="text-sm font-medium text-slate-700">
            Başlangıç
          </label>
          <input
            id="trip-start"
            type="date"
            required
            min={minDate}
            max={maxDate}
            value={tripStart}
            onChange={(event) => setTripStart(event.target.value)}
            className="mt-1 h-12 w-full rounded-2xl border border-sky-100 px-4 text-slate-900 outline-none ring-sky-300 focus:ring-2"
          />
        </div>
        <div>
          <label htmlFor="trip-end" className="text-sm font-medium text-slate-700">
            Bitiş
          </label>
          <input
            id="trip-end"
            type="date"
            required
            min={minDate}
            max={maxDate}
            value={tripEnd}
            onChange={(event) => setTripEnd(event.target.value)}
            className="mt-1 h-12 w-full rounded-2xl border border-sky-100 px-4 text-slate-900 outline-none ring-sky-300 focus:ring-2"
          />
        </div>
      </div>
      {error ? <p className="mt-3 text-sm text-rose-700">{error}</p> : null}
      <button
        type="submit"
        className="mt-4 h-12 w-full rounded-2xl bg-sky-600 px-6 text-sm font-semibold text-white transition hover:bg-sky-500 sm:w-auto"
      >
        Bu tarihlerde havayı gör
      </button>
    </form>
  );
}
