const WINDOW_MS = 15 * 60 * 1000;
const MAX_ATTEMPTS = 5;
const MAX_KEYS = 1000;

// ponytail: in-memory e por processo — zera no restart e nao vale entre instancias.
// Troque por Redis/KV se o deploy escalar horizontalmente.
const failures = new Map<string, { count: number; first: number }>();

function fresh(entry: { first: number }, now: number) {
  return now - entry.first <= WINDOW_MS;
}

export function isLoginBlocked(key: string, now = Date.now()) {
  const entry = failures.get(key);
  if (!entry) return false;
  if (!fresh(entry, now)) {
    failures.delete(key);
    return false;
  }
  return entry.count >= MAX_ATTEMPTS;
}

export function registerLoginFailure(key: string, now = Date.now()) {
  if (failures.size > MAX_KEYS) {
    for (const [candidate, entry] of failures) if (!fresh(entry, now)) failures.delete(candidate);
  }
  const entry = failures.get(key);
  if (entry && fresh(entry, now)) entry.count += 1;
  else failures.set(key, { count: 1, first: now });
}

export function clearLoginFailures(key: string) {
  failures.delete(key);
}
