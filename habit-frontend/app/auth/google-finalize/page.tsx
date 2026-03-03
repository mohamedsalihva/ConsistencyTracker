"use client";

import { Suspense, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { setStoredToken } from "@/lib/authToken";
import { setSessionCookieFromToken } from "@/lib/sessionCookie";

function GoogleFinalizeContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const token = searchParams.get("token");
    const next = searchParams.get("next");
    const target = next && next.startsWith("/") ? next : "/dashboard";

    if (!token) {
      router.replace("/auth/login");
      return;
    }

    setStoredToken(token);
    setSessionCookieFromToken(token);

    const finalize = async () => {
      try {
        await fetch("/api/auth/session", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ token }),
          credentials: "include",
        });
      } catch {
        // Continue even if session sync fails; dashboard can still use local token.
      }

      router.replace(target);
      window.location.href = target;
    };

    void finalize();
  }, [router, searchParams]);

  return (
    <main className="min-h-screen grid place-items-center text-foreground" style={{ background: "var(--gradient-page)" }}>
      <p className="text-sm text-muted-foreground">Finishing Google sign-in...</p>
    </main>
  );
}

export default function GoogleFinalizePage() {
  return (
    <Suspense
      fallback={
        <main className="min-h-screen grid place-items-center text-foreground" style={{ background: "var(--gradient-page)" }}>
          <p className="text-sm text-muted-foreground">Finishing Google sign-in...</p>
        </main>
      }
    >
      <GoogleFinalizeContent />
    </Suspense>
  );
}

