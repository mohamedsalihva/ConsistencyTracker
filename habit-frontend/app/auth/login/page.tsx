"use client";

import { useState } from "react";
import { setUser } from "@/store/authSlice";
import { useDispatch } from "react-redux";
import api from "@/lib/axios";
import API from "@/lib/apiRoutes";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";

export default function LoginPage() {
  const dispatch = useDispatch();
  const router = useRouter();
  const searchParams = useSearchParams();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = async () => {
    try {
      const res = await api.post(API.AUTH.LOGIN, {
        email,
        password,
      });
      
      //save user to redux
      dispatch(setUser(res.data.user));
      const next = searchParams.get("next");
      router.push(next && next.startsWith("/") ? next : "/dashboard");
    } catch (error) {
      setError("Invalid email or password");
    }
  };

  return (
    <main className="min-h-screen text-foreground" style={{ background: "var(--gradient-page)" }}>
      <div className="mx-auto flex min-h-screen w-full max-w-[1560px] items-center justify-center px-4 py-10 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45 }}
          className="glass-card w-full max-w-md p-6 sm:p-8"
        >
          <div className="mb-6 text-center">
            <span className="chip chip-active inline-flex">Welcome Back</span>
            <h1 className="mt-3 font-serif text-3xl">Login</h1>
            <p className="mt-2 text-sm text-muted-foreground">Continue your streaks and open your dashboard.</p>
          </div>

          <div className="space-y-3">
            <input
              className="w-full rounded-xl border border-border bg-white/80 px-3 py-2.5 text-sm outline-none transition focus:border-lavender/40 focus:ring-2 focus:ring-lavender/20"
              placeholder="Email"
              onChange={(e) => setEmail(e.target.value)}
            />
            <input
              className="w-full rounded-xl border border-border bg-white/80 px-3 py-2.5 text-sm outline-none transition focus:border-lavender/40 focus:ring-2 focus:ring-lavender/20"
              type="password"
              placeholder="Password"
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          {error && <p className="mt-3 text-sm text-destructive">{error}</p>}

          <button onClick={handleLogin} className="btn-cta mt-5 w-full py-2.5">
            Login
          </button>

          <p className="mt-4 text-center text-sm text-muted-foreground">
            No account yet?{" "}
            <Link href="/auth/register" className="font-medium text-lavender hover:underline">
              Register
            </Link>
          </p>
        </motion.div>
      </div>
    </main>
  );
}
