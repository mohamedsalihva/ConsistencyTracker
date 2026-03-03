export function setSessionCookieFromToken(token: string) {
  if (typeof document === "undefined") return;
  const isHttps = typeof window !== "undefined" && window.location.protocol === "https:";
  const secure = isHttps ? "; Secure" : "";
  document.cookie = `token_client=${encodeURIComponent(token)}; Path=/; SameSite=Lax${secure}`;
}

export function clearSessionCookie() {
  if (typeof document === "undefined") return;
  const isHttps = typeof window !== "undefined" && window.location.protocol === "https:";
  const secure = isHttps ? "; Secure" : "";
  document.cookie = `token_client=; Max-Age=0; Path=/; SameSite=Lax${secure}`;
}
