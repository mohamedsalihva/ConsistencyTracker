"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useDispatch } from "react-redux";
import Link from "next/link";
import { motion } from "framer-motion";

import { setUser } from "@/store/authSlice";
import api from "@/lib/axios";
import API from "@/lib/apiRoutes";

export default function RegisterPage() {
  const dispatch = useDispatch();
  const router = useRouter();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });

  const [error, setError] = useState("");

  // one handler for all inputs

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleRegister = async () => {
    try {
      const res = await api.post(API.AUTH.REGISTER, formData);

      // save user in redux
      dispatch(setUser(res.data.user));

      router.push("/auth/login");
    } catch (err) {
      setError("Registration failed. Please try again.");
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
            <span className="chip chip-active inline-flex">Start Strong</span>
            <h1 className="mt-3 font-serif text-3xl">Register</h1>
            <p className="mt-2 text-sm text-muted-foreground">Create your account and begin tracking habits today.</p>
          </div>

          <div className="space-y-3">
            <input
              className="w-full rounded-xl border border-border bg-white/80 px-3 py-2.5 text-sm outline-none transition focus:border-lavender/40 focus:ring-2 focus:ring-lavender/20"
              placeholder="Name"
              name="name"
              onChange={handleChange}
            />

            <input
              className="w-full rounded-xl border border-border bg-white/80 px-3 py-2.5 text-sm outline-none transition focus:border-lavender/40 focus:ring-2 focus:ring-lavender/20"
              placeholder="Email"
              name="email"
              onChange={handleChange}
            />

            <input
              className="w-full rounded-xl border border-border bg-white/80 px-3 py-2.5 text-sm outline-none transition focus:border-lavender/40 focus:ring-2 focus:ring-lavender/20"
              type="password"
              placeholder="Password"
              name="password"
              onChange={handleChange}
            />
          </div>

          {error && <p className="mt-3 text-sm text-destructive">{error}</p>}

          <button onClick={handleRegister} className="btn-cta mt-5 w-full py-2.5">
            Sign Up
          </button>

          <p className="mt-4 text-center text-sm text-muted-foreground">
            Already registered?{" "}
            <Link href="/auth/login" className="font-medium text-lavender hover:underline">
              Login
            </Link>
          </p>
        </motion.div>
      </div>
    </main>
  );
}
