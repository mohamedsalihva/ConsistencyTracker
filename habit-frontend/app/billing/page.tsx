'use client';

import Link from 'next/link';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useSelector } from 'react-redux';
import type { RootState } from '@/store';
import { useBilling } from '../dashboard/hooks/useBilling';

type DashboardUser = {
  name?: string;
  email?: string;
  role?: 'manager' | 'member';
  subscriptionStatus?: 'none' | 'pending' | 'active' | 'failed';
};

export default function BillingPage() {
  const router = useRouter();
  const user = useSelector((s: RootState) => s.auth.user as DashboardUser | null);
  const { paymentLoading, paymentError, handlePayNow } = useBilling(user);

  useEffect(() => {
    if (user?.role === 'manager' && user.subscriptionStatus === 'active') {
      router.replace('/dashboard');
    }
  }, [router, user?.role, user?.subscriptionStatus]);

  if (!user) {
    return (
      <main className='min-h-screen grid place-items-center text-foreground' style={{ background: 'var(--gradient-page)' }}>
        <p className='text-sm text-muted-foreground'>Loading billing details...</p>
      </main>
    );
  }

  return (
    <main className='min-h-screen text-foreground' style={{ background: 'var(--gradient-page)' }}>
      <div className='mx-auto flex min-h-screen w-full max-w-[900px] items-center justify-center px-4 py-10 sm:px-6 lg:px-8'>
        <section className='glass-card w-full max-w-xl p-6 sm:p-8'>
          <p className='chip chip-active inline-flex'>Billing</p>
          <h1 className='mt-3 text-3xl font-serif'>Activate Manager Access</h1>
          <p className='mt-2 text-sm text-muted-foreground'>
            Complete your payment to unlock full manager workspace controls.
          </p>

          {user.role !== 'manager' ? (
            <p className='mt-6 text-sm text-amber-300'>This page is for manager accounts only.</p>
          ) : (
            <div className='mt-6 rounded-xl border border-amber-500/30 bg-amber-500/10 p-4'>
              <p className='text-xs uppercase tracking-[0.14em] text-amber-300'>Subscription status: {user.subscriptionStatus}</p>
              <button
                onClick={handlePayNow}
                disabled={paymentLoading}
                className='mt-4 rounded-lg border border-amber-400/35 bg-amber-500/20 px-4 py-2 text-sm font-semibold text-amber-100 transition hover:bg-amber-500/30 disabled:cursor-not-allowed disabled:opacity-60'
              >
                {paymentLoading ? 'Processing...' : user.subscriptionStatus === 'failed' ? 'Retry payment' : 'Pay now'}
              </button>
              {paymentError && <p className='mt-3 text-sm text-red-300'>{paymentError}</p>}
            </div>
          )}

          <Link href='/dashboard' className='mt-6 inline-block text-sm font-medium text-primary hover:underline'>
            Back to dashboard
          </Link>
        </section>
      </div>
    </main>
  );
}
