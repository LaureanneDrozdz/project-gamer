import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import type { ReactNode } from 'react';
import { apiFetch } from '@/lib/api';

export default async function AdminLayout({ children }: { children: ReactNode }) {
  // Try common cookie names that may store a JWT
  
  const cookieStore = await cookies();
  const token = cookieStore.get('token')?.value ?? cookieStore.get('auth')?.value ?? cookieStore.get('admin_token')?.value;

  // If there's no login cookie, redirect to signin immediately
  if (!token) {
    redirect('/auth/admin-signin');
  }

  try {
    const res = await apiFetch(`/auth/me`, {
      method: 'GET',
      // forward the cookie so the backend can read it
      headers: { cookie: `token=${token}` },
      cache: 'no-store',
    });
    if (!res.ok) {
      redirect('/auth/admin-signin');
    }

    const payload = await res.json();
    if (!payload || (payload.role && payload.role !== 'ADMIN')) {
      // not an admin
      redirect('/auth/admin-signin');
    }
  } catch {
    // on any error, redirect to signin
    redirect('/auth/admin-signin');
  }

  return <>{children}</>;
}
