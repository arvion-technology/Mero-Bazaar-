"use client";
import { useState, useEffect } from "react";

interface Suggestion {
  display_name: string;
  lat: string;
  lon: string;
}

export default function LocationPicker({
  onSelect,
}: {
  onSelect: (loc: { location: string; latitude: number; longitude: number }) => void;
}) {
  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);

  useEffect(() => {
    let cancelled = false;

    const handle = setTimeout(async () => {
      if (query.trim().length < 3) {
        if (!cancelled) setSuggestions([]);
        return;
      }

      try {
        const res = await fetch(`/api/geocode/search?q=${encodeURIComponent(query)}`);
        const data = await res.json();
        if (!cancelled) setSuggestions(data);
      } catch {
        if (!cancelled) setSuggestions([]);
      }
    }, 400); // respects Nominatim's 1 req/sec limit

    return () => {
      cancelled = true;
      clearTimeout(handle);
    };
  }, [query]);

  const handlePick = (s: Suggestion) => {
    setQuery(s.display_name);
    setSuggestions([]);
    onSelect({
      location: s.display_name,
      latitude: parseFloat(s.lat),
      longitude: parseFloat(s.lon),
    });
  };

  return (
    <div style={{ position: "relative" }}>
      <input
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search your location"
        style={{ width: "100%", padding: "10px 12px", borderRadius: 8, border: "1px solid #e5e7eb" }}
      />
      {suggestions.length > 0 && (
        <ul style={{ position: "absolute", top: "100%", left: 0, right: 0, background: "#fff", border: "1px solid #e5e7eb", borderRadius: 8, zIndex: 10, listStyle: "none", margin: 0, padding: 4 }}>
          {suggestions.map((s, i) => (
            <li key={i} onClick={() => handlePick(s)} style={{ padding: "8px 10px", cursor: "pointer", fontSize: 13 }}>
              {s.display_name}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}