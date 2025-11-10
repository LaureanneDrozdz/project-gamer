import { apiFetch } from '@/lib/api';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import type { ReactNode } from 'react';

export default async function AdminLayout({ children }: { children: ReactNode }) {
  const cookieStore = await cookies();
  const adminCookie = cookieStore.get('admin_token') ?? cookieStore.get('token');
  const tokenValue = adminCookie?.value;

  if (!tokenValue) redirect('/auth/admin-signin');

  try {

    const payload = await apiFetch(`/auth/profile-admin`, {
      method: 'GET',
      headers: { cookie: `admin_token=${tokenValue}` },
      cache: 'no-store',
    });

    if (!payload || payload.role !== 'ADMIN') redirect('/auth/admin-signin');

    return <>{children}</>;
  } catch {
    redirect('/auth/admin-signin');
  }
}