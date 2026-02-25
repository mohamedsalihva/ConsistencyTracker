"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useDispatch } from "react-redux";
import Link from "next/link";
import { motion } from "framer-motion";
import type { AxiosError } from "axios";

import { setUser } from "@/store/authSlice";
import api from "@/lib/axios";
import API from "@/lib/apiRoutes";

type RegisterForm = {
  name: string;
  email: string;
  password: string;
  accountType: "manager" | "member";
  workspaceName: string;
  inviteCode: string;
};

export default function RegisterPage() {
  const dispatch = useDispatch();
  const router = useRouter();

  const [formData, setFormData] = useState<RegisterForm>({
    name: "",
    email: "",
    password: "",
    accountType: "member",
    workspaceName: "",
    inviteCode: "",
  });

  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (error) setError("");
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: name === "inviteCode" ? value.toUpperCase() : value,
    }));
  };

  const handleAccountTypeChange = (accountType: "manager" | "member") => {
    if (error) setError("");
    setFormData((prev) => ({
      ...prev,
      accountType,
      workspaceName: accountType === "manager" ? prev.workspaceName : "",
      inviteCode: accountType === "member" ? prev.inviteCode : "",
    }));
  };

  const handleRegister = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (isSubmitting) return;

    if (!formData.name.trim() || !formData.email.trim() || !formData.password.trim()) {
      setError("Please fill out all fields.");
      return;
    }

    if (formData.accountType === "manager" && !formData.workspaceName.trim()) {
      setError("Workspace name is required for manager signup.");
      return;
    }

    setIsSubmitting(true);
    try {
      const payload = {
        name: formData.name.trim(),
        email: formData.email.trim(),
        password: formData.password,
        accountType: formData.accountType,
        workspaceName: formData.accountType === "manager" ? formData.workspaceName.trim() : undefined,
        inviteCode:
          formData.accountType === "member" && formData.inviteCode.trim()
            ? formData.inviteCode.trim()
            : undefined,
      };

      const res = await api.post(API.AUTH.REGISTER, payload);
      dispatch(setUser(res.data.user));
      router.push("/auth/login");
    } catch (err: unknown) {
      const apiError = err as AxiosError<{ message?: string }>;
      const message = apiError.response?.data?.message || "Registration failed. Please try again.";
      setError(message);
    } finally {
      setIsSubmitting(false);
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

          <form onSubmit={handleRegister} className="space-y-3">
            <div className="grid grid-cols-2 gap-2 rounded-xl border border-border bg-white/60 p-1">
              <button
                type="button"
                onClick={() => handleAccountTypeChange("member")}
                className={`rounded-lg px-3 py-2 text-sm font-medium transition ${
                  formData.accountType === "member"
                    ? "bg-lavender/20 text-foreground"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                Member
              </button>
              <button
                type="button"
                onClick={() => handleAccountTypeChange("manager")}
                className={`rounded-lg px-3 py-2 text-sm font-medium transition ${
                  formData.accountType === "manager"
                    ? "bg-lavender/20 text-foreground"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                Manager
              </button>
            </div>

            <input
              className="w-full rounded-xl border border-border bg-white/80 px-3 py-2.5 text-sm outline-none transition focus:border-lavender/40 focus:ring-2 focus:ring-lavender/20"
              placeholder="Name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              autoComplete="name"
              required
            />

            <input
              className="w-full rounded-xl border border-border bg-white/80 px-3 py-2.5 text-sm outline-none transition focus:border-lavender/40 focus:ring-2 focus:ring-lavender/20"
              placeholder="Email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              autoComplete="email"
              required
            />

            <input
              className="w-full rounded-xl border border-border bg-white/80 px-3 py-2.5 text-sm outline-none transition focus:border-lavender/40 focus:ring-2 focus:ring-lavender/20"
              type="password"
              placeholder="Password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              autoComplete="new-password"
              required
            />

            {formData.accountType === "manager" ? (
              <input
                className="w-full rounded-xl border border-border bg-white/80 px-3 py-2.5 text-sm outline-none transition focus:border-lavender/40 focus:ring-2 focus:ring-lavender/20"
                placeholder="Workspace name"
                name="workspaceName"
                value={formData.workspaceName}
                onChange={handleChange}
                required
              />
            ) : (
              <div className="space-y-1">
                <input
                  className="w-full rounded-xl border border-border bg-white/80 px-3 py-2.5 text-sm uppercase outline-none transition focus:border-lavender/40 focus:ring-2 focus:ring-lavender/20"
                  placeholder="Invite code (optional)"
                  name="inviteCode"
                  value={formData.inviteCode}
                  onChange={handleChange}
                />
                <p className="text-xs text-muted-foreground">Leave empty to sign up without joining a workspace now.</p>
              </div>
            )}

            <button type="submit" disabled={isSubmitting} className="btn-cta mt-2 w-full py-2.5 disabled:opacity-60">
              {isSubmitting ? "Creating account..." : "Sign Up"}
            </button>
          </form>

          {error && <p className="mt-3 text-sm text-destructive">{error}</p>}

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
