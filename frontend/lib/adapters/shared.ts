const IMG_BASE = process.env.NEXT_PUBLIC_API_URL ?? "";

export function resolveImage(path?: string | null): string {
  if (!path) return "";
  return path.startsWith("http") ? path : `${IMG_BASE}${path}`;
}

export function resolveImages(paths: string[] | undefined, fallback: string): string[] {
  const valid = (paths ?? []).filter((p): p is string => typeof p === "string" && p.length > 0);
  return valid.length ? valid.map(resolveImage) : [fallback];
}

export function daysAgo(iso: string | Date): number {
  return Math.floor((Date.now() - new Date(iso).getTime()) / 86400000);
}