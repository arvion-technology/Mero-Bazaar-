/**
 * Minimal in-memory fixed-window rate limiter (no external dependency).
 * Suitable for per-IP / per-account throttling of auth and OTP endpoints.
 * NOTE: instances are per-process; for multi-instance deployments replace with
 * a shared store (Redis). Still far better than no throttle.
 */
export class InMemoryRateLimiter {
  private readonly hits = new Map<string, number[]>();

  constructor(
    private readonly windowMs: number,
    private readonly max: number,
  ) {}

  /**
   * Returns true if the key is within the limit (consumes a slot),
   * false if the limit is exceeded for the current window.
   */
  tryConsume(key: string): boolean {
    const now = Date.now();
    const recent = (this.hits.get(key) ?? []).filter(
      (t) => now - t < this.windowMs,
    );

    if (recent.length >= this.max) {
      this.hits.set(key, recent);
      return false;
    }

    recent.push(now);
    this.hits.set(key, recent);
    return true;
  }

  reset(key: string): void {
    this.hits.delete(key);
  }
}
