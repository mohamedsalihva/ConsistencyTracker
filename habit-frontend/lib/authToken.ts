const AUTH_TOKEN_KEY = "auth_token";
const TOKEN_CLIENT_COOKIE = "token_client";

function readTokenClientCookie(): string | null {
  if (typeof document === "undefined") return null;
  try {
    const pairs = document.cookie ? document.cookie.split(";") : [];
    for (const pair of pairs) {
      const [rawKey, ...rest] = pair.split("=");
      if (!rawKey) continue;
      if (rawKey.trim() !== TOKEN_CLIENT_COOKIE) continue;
      const rawValue = rest.join("=").trim();
      if (!rawValue) return null;
      return decodeURIComponent(rawValue);
    }
    return null;
  } catch {
    return null;
  }
}

export function getStoredToken(): string | null {
  if (typeof window === "undefined") return null;
  try {
    const fromLocalStorage = window.localStorage.getItem(AUTH_TOKEN_KEY);
    if (fromLocalStorage) return fromLocalStorage;

    const fromCookie = readTokenClientCookie();
    if (fromCookie) {
      window.localStorage.setItem(AUTH_TOKEN_KEY, fromCookie);
      return fromCookie;
    }

    return null;
  } catch {
    return readTokenClientCookie();
  }
}

export function setStoredToken(token: string) {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(AUTH_TOKEN_KEY, token);
  } catch {}
}

export function clearStoredToken() {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.removeItem(AUTH_TOKEN_KEY);
  } catch {}
}
