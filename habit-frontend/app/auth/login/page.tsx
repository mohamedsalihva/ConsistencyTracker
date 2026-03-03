'use client';

import { Suspense, useState } from 'react';
import { setUser } from '@/store/authSlice';
import { useDispatch } from 'react-redux';
import api from '@/lib/axios';
import API from '@/lib/apiRoutes';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import type { AxiosError } from 'axios';

function LoginContent() {
  const dispatch = useDispatch();
  const router = useRouter();
  const searchParams = useSearchParams();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const apiBase = (process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000').replace(/\/+$/, '');

  const handleLogin = async () => {
    if (isSubmitting) return;
    setIsSubmitting(true);
    try {
      const res = await api.post<{
        success: boolean;
        user: unknown;
        token?: string;
      }>(API.AUTH.LOGIN, {
        email,
        password,
      });

      if (!res.data.token) {
        setError("Login response missing token. Please redeploy backend.");
        return;
      }

      await fetch("/api/auth/session", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token: res.data.token }),
        credentials: "include",
      });

      dispatch(setUser(res.data.user));
      const next = searchParams.get('next');
      router.push(next && next.startsWith('/') ? next : '/dashboard');
    } catch (err: unknown) {
      const apiError = err as AxiosError<{ message?: string }>;
      const message = apiError.response?.data?.message || 'Invalid email or password';
      setError(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleGoogleLogin = () => {
    if (isSubmitting) return;
    window.location.href = `${apiBase}/auth/google`;
  };

  return (
    <main className='min-h-screen text-foreground' style={{ background: 'var(--gradient-page)' }}>
      <div className='mx-auto flex min-h-screen w-full max-w-[1560px] items-center justify-center px-4 py-10 sm:px-6 lg:px-8'>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45 }}
          className='glass-card w-full max-w-md p-6 sm:p-8'
        >
          <div className='mb-6 text-center'>
            <span className='chip chip-active inline-flex'>Welcome Back</span>
            <h1 className='mt-3 font-serif text-3xl'>Login</h1>
            <p className='mt-2 text-sm text-muted-foreground'>Continue your streaks and open your dashboard.</p>
          </div>

          <div className='space-y-3'>
            <input
              className='w-full rounded-xl border border-border bg-card/70 px-3 py-2.5 text-sm text-foreground outline-none transition focus:border-primary/40 focus:ring-2 focus:ring-primary/20'
              placeholder='Email'
              onChange={(e) => setEmail(e.target.value)}
            />
            <input
              className='w-full rounded-xl border border-border bg-card/70 px-3 py-2.5 text-sm text-foreground outline-none transition focus:border-primary/40 focus:ring-2 focus:ring-primary/20'
              type='password'
              placeholder='Password'
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          {error && <p className='mt-3 text-sm text-destructive'>{error}</p>}

          <button onClick={handleLogin} disabled={isSubmitting} className='btn-cta mt-5 w-full py-2.5 disabled:opacity-60'>
            {isSubmitting ? 'Logging in...' : 'Login'}
          </button>

          <button
            type='button'
            onClick={handleGoogleLogin}
            disabled={isSubmitting}
            className='mt-2 w-full rounded-xl border border-border bg-card/70 px-3 py-2.5 text-sm font-medium text-foreground transition hover:bg-card disabled:opacity-60'
          >
            Continue with Google
          </button>

          <p className='mt-4 text-center text-sm text-muted-foreground'>
            No account yet?{' '}
            <Link href='/auth/register' className='font-medium text-primary hover:underline'>
              Register
            </Link>
          </p>
        </motion.div>
      </div>
    </main>
  );
}

export default function LoginPage() {
  return (
    <Suspense
      fallback={
        <main className='min-h-screen grid place-items-center text-foreground' style={{ background: 'var(--gradient-page)' }}>
          <p className='text-sm text-muted-foreground'>Loading...</p>
        </main>
      }
    >
      <LoginContent />
    </Suspense>
  );
}
