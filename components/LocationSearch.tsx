"use client";

import { useRouter } from "next/navigation";
import {
  useDeferredValue,
  useEffect,
  useId,
  useRef,
  useState,
  useEffectEvent,
} from "react";
import {
  searchLocationsRemote,
  type LocationPlace,
} from "@/lib/locationService";

export default function LocationSearch() {
  const router = useRouter();
  const listId = useId();
  const rootRef = useRef<HTMLDivElement>(null);
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);
  const [suggestions, setSuggestions] = useState<LocationPlace[]>([]);
  const [loading, setLoading] = useState(false);
  const deferredQuery = useDeferredValue(query);

  const closeOnOutside = useEffectEvent((event: MouseEvent) => {
    if (!rootRef.current?.contains(event.target as Node)) {
      setOpen(false);
    }
  });

  useEffect(() => {
    document.addEventListener("mousedown", closeOnOutside);
    return () => document.removeEventListener("mousedown", closeOnOutside);
  }, [closeOnOutside]);

  useEffect(() => {
    const q = deferredQuery.trim();
    if (q.length < 2) {
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
        setActiveIndex(0);
        setLoading(false);
      }
    }, 220);

    return () => {
      cancelled = true;
      window.clearTimeout(timer);
    };
  }, [deferredQuery]);

  function goToPlace(place: LocationPlace) {
    setQuery(place.label);
    setOpen(false);
    router.push(place.href);
  }

  function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const selected = suggestions[activeIndex] ?? suggestions[0];
    if (selected) {
      goToPlace(selected);
      return;
    }
    setOpen(true);
  }

  return (
    <div ref={rootRef} className="relative mx-auto w-full max-w-xl">
      <form onSubmit={onSubmit} className="flex flex-col gap-3 sm:flex-row">
        <div className="relative flex-1">
          <label htmlFor="location-search" className="sr-only">
            İl veya ilçe ara
          </label>
          <input
            id="location-search"
            type="search"
            role="combobox"
            aria-expanded={open && (suggestions.length > 0 || loading)}
            aria-controls={listId}
            aria-autocomplete="list"
            aria-activedescendant={
              open && suggestions[activeIndex]
                ? `${listId}-option-${activeIndex}`
                : undefined
            }
            value={query}
            onChange={(event) => {
              setQuery(event.target.value);
              setOpen(true);
            }}
            onFocus={() => setOpen(true)}
            onKeyDown={(event) => {
              if (!open || suggestions.length === 0) return;
              if (event.key === "ArrowDown") {
                event.preventDefault();
                setActiveIndex((index) => (index + 1) % suggestions.length);
              } else if (event.key === "ArrowUp") {
                event.preventDefault();
                setActiveIndex(
                  (index) =>
                    (index - 1 + suggestions.length) % suggestions.length,
                );
              } else if (event.key === "Escape") {
                setOpen(false);
              }
            }}
            placeholder="Örn. Göle, Yenişehir, Çeşme…"
            className="h-12 w-full rounded-2xl border border-sky-100 bg-white px-4 text-slate-900 shadow-sm outline-none ring-sky-300 placeholder:text-slate-400 focus:ring-2"
            autoComplete="off"
          />

          {open && query.trim().length >= 2 && (
            <ul
              id={listId}
              role="listbox"
              className="absolute z-20 mt-2 max-h-72 w-full overflow-auto rounded-2xl border border-sky-100 bg-white py-2 shadow-lg"
            >
              {loading && suggestions.length === 0 ? (
                <li className="px-4 py-3 text-sm text-slate-500">Aranıyor…</li>
              ) : suggestions.length === 0 ? (
                <li className="px-4 py-3 text-sm text-slate-500">
                  Eşleşen ilçe bulunamadı. İlçe adını yazmayı deneyin.
                </li>
              ) : (
                suggestions.map((place, index) => (
                  <li
                    key={`${place.citySlug}-${place.districtSlug}`}
                    role="option"
                    aria-selected={index === activeIndex}
                  >
                    <button
                      id={`${listId}-option-${index}`}
                      type="button"
                      className={`flex w-full flex-col items-start px-4 py-2.5 text-left transition ${
                        index === activeIndex
                          ? "bg-sky-50 text-sky-900"
                          : "text-slate-800 hover:bg-slate-50"
                      }`}
                      onMouseEnter={() => setActiveIndex(index)}
                      onClick={() => goToPlace(place)}
                    >
                      <span className="text-sm font-semibold">{place.label}</span>
                      <span className="text-xs text-slate-500">
                        {place.districtName} / {place.cityName} ·{" "}
                        {place.lat.toFixed(2)}, {place.lng.toFixed(2)}
                      </span>
                    </button>
                  </li>
                ))
              )}
            </ul>
          )}
        </div>

        <button
          type="submit"
          className="h-12 rounded-2xl bg-sky-600 px-6 text-sm font-semibold text-white transition hover:bg-sky-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-600"
        >
          Hava durumunu gör
        </button>
      </form>
    </div>
  );
}
