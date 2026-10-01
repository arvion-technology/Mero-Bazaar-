"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import Footer from "@/components/Footer";
import { FiSearch, FiMapPin, FiArrowLeft } from "react-icons/fi";

type Category = "VEHICLE" | "JOB" | "MEDICAL" | "TRADES" | "RENTAL" | "AGRICULTURE" | "SECONDHAND" | "FOODS" | "BEAUTY";

interface SearchListing {
  id: string;
  title: string;
  description: string | null;
  price: number | null;
  category: Category;
  location: string | null;
  images: string[];
}

const CATEGORY_META: Record<Category, { slug: string; label: string; color: string }> = {
  VEHICLE: { slug: "vehicles", label: "Vehicles", color: "#2563eb" },
  RENTAL: { slug: "rent-and-real-estate", label: "Rent & Real Estate", color: "#7c3aed" },
  JOB: { slug: "job", label: "Jobs", color: "#0d9488" },
  MEDICAL: { slug: "medical", label: "Medical", color: "#dc2626" },
  TRADES: { slug: "trade-and-homerepair", label: "Trades & Home Repair", color: "#d97706" },
  BEAUTY: { slug: "beauty", label: "Beauty & Wellness", color: "#db2777" },
  SECONDHAND: { slug: "secondhand", label: "Secondhand", color: "#4b5563" },
  FOODS: { slug: "food", label: "Food & Home Delivery", color: "#16a34a" },
  AGRICULTURE: { slug: "agriculture-and-livestock", label: "Agriculture & Livestock", color: "#ca8a04" },
};

function formatPrice(price: number | null): string {
  if (price == null) return "Price on request";
  return `Rs. ${price.toLocaleString("en-IN")}`;
}

function SearchResults() {
  const router = useRouter();
  const params = useSearchParams();
  const q = (params.get("q") ?? "").trim();

  const [input, setInput] = useState(q);
  const [results, setResults] = useState<SearchListing[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [imgFailed, setImgFailed] = useState<Record<string, boolean>>({});

  // Keep the input box in sync with the URL query (back/forward) using the
  // "adjust state during render" pattern instead of setState-in-effect.
  const [prevQ, setPrevQ] = useState(q);
  if (prevQ !== q) {
    setPrevQ(q);
    setInput(q);
  }

  // Turn the loading flag on during render when the query changes.
  const [loadingKey, setLoadingKey] = useState(q);
  if (loadingKey !== q) {
    setLoadingKey(q);
    setLoading(q.length > 0);
  }

  useEffect(() => {
    if (!q) return;
    let cancelled = false;
    (async () => {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/api/search?query=${encodeURIComponent(q)}&limit=20`,
        );
        if (cancelled) return;
        if (!res.ok) throw new Error(`Search failed (${res.status})`);
        const data = (await res.json()) as SearchListing[];
        if (!cancelled) setResults(Array.isArray(data) ? data : []);
      } catch (e) {
        if (!cancelled) {
          console.error("Search error:", e);
          setError("Couldn't load results right now. Please try again.");
          setResults([]);
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [q]);

  const submit = (e?: React.FormEvent) => {
    e?.preventDefault();
    const trimmed = input.trim();
    if (!trimmed) return;
    router.push(`/search?q=${encodeURIComponent(trimmed)}`);
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap');
        .sr-wrap { min-height: 100vh; background: #f6f7fb; font-family: 'Inter', sans-serif; color: #1a1a1a; }
        .sr-top { background: linear-gradient(135deg, #C0392B 0%, #E74C3C 100%); padding: 28px 20px 40px; }
        .sr-top-inner { max-width: 880px; margin: 0 auto; }
        .sr-back { display: inline-flex; align-items: center; gap: 6px; color: rgba(255,255,255,0.9); font-size: 13px; font-weight: 600; text-decoration: none; margin-bottom: 16px; }
        .sr-back:hover { color: #fff; }
        .sr-h1 { color: #fff; font-size: 26px; font-weight: 800; margin: 0 0 14px; }
        .sr-form { display: flex; align-items: center; background: #fff; border-radius: 12px; box-shadow: 0 10px 30px rgba(0,0,0,0.18); overflow: hidden; }
        .sr-input { flex: 1; border: none; outline: none; padding: 15px 18px; font-size: 15px; font-family: inherit; color: #333; min-width: 0; }
        .sr-submit { border: none; background: #C0392B; color: #fff; padding: 15px 22px; font-weight: 700; font-size: 14px; cursor: pointer; display: flex; align-items: center; gap: 7px; transition: filter .15s; font-family: inherit; }
        .sr-submit:hover { filter: brightness(1.08); }
        .sr-main { max-width: 1100px; margin: 0 auto; padding: 24px 20px 60px; }
        .sr-count { color: #666; font-size: 14px; margin: 4px 0 18px; }
        .sr-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(230px, 1fr)); gap: 18px; }
        .sr-card { background: #fff; border-radius: 14px; overflow: hidden; text-decoration: none; color: inherit; border: 1px solid #ececf1; box-shadow: 0 2px 8px rgba(0,0,0,0.04); transition: transform .16s, box-shadow .16s; display: flex; flex-direction: column; }
        .sr-card:hover { transform: translateY(-3px); box-shadow: 0 10px 24px rgba(0,0,0,0.09); }
        .sr-img { width: 100%; height: 150px; object-fit: cover; background: #eef0f5; display: block; }
        .sr-img-ph { width: 100%; height: 150px; display: flex; align-items: center; justify-content: center; color: #fff; font-weight: 800; font-size: 22px; letter-spacing: 1px; }
        .sr-body { padding: 12px 14px 14px; display: flex; flex-direction: column; gap: 6px; flex: 1; }
        .sr-cat { align-self: flex-start; font-size: 10.5px; font-weight: 700; text-transform: uppercase; letter-spacing: .4px; color: #fff; padding: 3px 8px; border-radius: 999px; }
        .sr-title { font-size: 14.5px; font-weight: 700; line-height: 1.35; margin: 0; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; }
        .sr-loc { display: flex; align-items: center; gap: 4px; color: #999; font-size: 12px; }
        .sr-price { margin-top: auto; font-weight: 800; font-size: 15px; color: #C0392B; }
        .sr-state { padding: 60px 20px; text-align: center; color: #666; }
        .sr-state h2 { font-size: 18px; color: #333; margin-bottom: 6px; }
        .sr-spinner { width: 34px; height: 34px; border: 3px solid #e8e8ef; border-top-color: #C0392B; border-radius: 50%; margin: 40px auto; animation: sr-spin .8s linear infinite; }
        @keyframes sr-spin { to { transform: rotate(360deg); } }
      `}</style>

      <div className="sr-wrap">
        <div className="sr-top">
          <div className="sr-top-inner">
            <Link href="/" className="sr-back"><FiArrowLeft size={14} /> Back to home</Link>
            <h1 className="sr-h1">Search Nepal&apos;s Marketplace</h1>
            <form className="sr-form" onSubmit={submit}>
              <input
                className="sr-input"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Search vehicles, jobs, homes, services and more..."
                autoFocus
              />
              <button type="submit" className="sr-submit"><FiSearch size={15} /> Search</button>
            </form>
          </div>
        </div>

        <div className="sr-main">
          {loading ? (
            <div className="sr-spinner" />
          ) : error ? (
            <div className="sr-state"><h2>Something went wrong</h2><p>{error}</p></div>
          ) : !q ? (
            <div className="sr-state"><h2>Type something to search</h2><p>Find vehicles, jobs, homes, food and more across Nepal.</p></div>
          ) : results.length === 0 ? (
            <div className="sr-state"><h2>No results for &ldquo;{q}&rdquo;</h2><p>Try a different keyword or browse the categories from the home page.</p></div>
          ) : (
            <>
              <p className="sr-count">{results.length} result{results.length === 1 ? "" : "s"} for &ldquo;{q}&rdquo;</p>
              <div className="sr-grid">
                {results.map((r) => {
                  const meta = CATEGORY_META[r.category] ?? { slug: "", label: r.category, color: "#888" };
                  return (
                    <Link key={r.id} href={`/listing/${r.id}`} className="sr-card">
                      {imgFailed[r.id] ? (
                        <div className="sr-img-ph" style={{ background: meta.color }}>{meta.label.slice(0, 2).toUpperCase()}</div>
                      ) : (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          className="sr-img"
                          src={r.images?.[0] ?? "/placeholder.png"}
                          alt={r.title}
                          loading="lazy"
                          onError={() => setImgFailed((p) => ({ ...p, [r.id]: true }))}
                        />
                      )}
                      <div className="sr-body">
                        <span className="sr-cat" style={{ background: meta.color }}>{meta.label}</span>
                        <p className="sr-title">{r.title}</p>
                        {r.location && (
                          <span className="sr-loc"><FiMapPin size={11} /> {r.location}</span>
                        )}
                        <span className="sr-price">{formatPrice(r.price)}</span>
                      </div>
                    </Link>
                  );
                })}
              </div>
            </>
          )}
        </div>
      </div>
      <Footer />
    </>
  );
}

export default function SearchPage() {
  return (
    <Suspense fallback={<div style={{ minHeight: "100vh" }} />}>
      <SearchResults />
    </Suspense>
  );
}
