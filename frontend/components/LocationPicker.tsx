"use client";
import { useState, useEffect } from "react";

interface Suggestion {
  display_name: string;
  lat: string;
  lon: string;
}

export default function LocationPicker({
  onSelect,
  initialValue = "",
  placeholder = "Search your location",
}: {
  onSelect: (loc: { location: string; latitude: number; longitude: number }) => void;
  initialValue?: string;
  placeholder?: string;
}) {
  const [query, setQuery] = useState(initialValue);
  const [prevInitialValue, setPrevInitialValue] = useState(initialValue);
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [isOpen, setIsOpen] = useState(false);

  if (initialValue !== prevInitialValue) {
    setPrevInitialValue(initialValue);
    setQuery(initialValue);
  }

  useEffect(() => {
    let cancelled = false;

    const handle = setTimeout(async () => {
      if (query.trim().length < 3) {
        if (!cancelled) {
          setSuggestions([]);
          setIsOpen(false);
        }
        return;
      }

      try {
        const res = await fetch(`/api/geocode/search?q=${encodeURIComponent(query)}`);
        if (!res.ok) {
          if (!cancelled) {
            setSuggestions([]);
            setIsOpen(false);
          }
          return;
        }
        const data = await res.json();
        if (!cancelled) {
          const results = Array.isArray(data) ? data : [];
          setSuggestions(results);
          setIsOpen(results.length > 0);
        }
      } catch {
        if (!cancelled) {
          setSuggestions([]);
          setIsOpen(false);
        }
      }
    }, 400);

    return () => {
      cancelled = true;
      clearTimeout(handle);
    };
  }, [query]);

  const handlePick = (s: Suggestion) => {
    setQuery(s.display_name);
    setSuggestions([]);
    setIsOpen(false);
    onSelect({
      location: s.display_name,
      latitude: parseFloat(s.lat),
      longitude: parseFloat(s.lon),
    });
  };

  return (
    <div className="custom-select-container">
      <input
        className="form-input"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        onFocus={() => suggestions.length > 0 && setIsOpen(true)}
        placeholder={placeholder}
      />
      {isOpen && suggestions.length > 0 && (
        <div className="custom-select-dropdown">
          <div className="custom-select-options">
            {suggestions.map((s, i) => (
              <div
                key={i}
                className="custom-select-option"
                onClick={() => handlePick(s)}
              >
                {s.display_name}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}